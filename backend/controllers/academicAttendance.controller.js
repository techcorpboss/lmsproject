// backend/controllers/academicAttendance.controller.js
// 📅 Phân Hệ Điểm Danh Từng Buổi Học & Tự Động Cảnh Báo Cấm Thi Theo TT 08/2021/TT-BGDĐT
const {
  AcademicAttendanceSession,
  AcademicAttendanceRecord,
  AcademicStudent,
  AcademicSectionGrade,
  ExamCandidateAuthorization
} = require('../models');

// Khởi tạo 15 buổi học mẫu chuẩn 15 tuần học kỳ nếu chưa có
async function ensureSessionsExist(sectionId) {
  const count = await AcademicAttendanceSession.count({ where: { section_id: sectionId } });
  if (count === 0) {
    const defaultSessions = [];
    const baseDate = new Date('2026-09-08'); // Bắt đầu kỳ 1 năm học 2026-2027

    for (let i = 1; i <= 15; i++) {
      const sessionDate = new Date(baseDate);
      sessionDate.setDate(baseDate.getDate() + (i - 1) * 7);

      defaultSessions.push({
        section_id: sectionId,
        session_number: i,
        session_date: sessionDate.toISOString().split('T')[0],
        start_time: '07:30',
        end_time: '11:00',
        topic: `Tuần ${i}: Nội dung giảng dạy lý thuyết & thực hành Chuyên đề ${i}`,
        room: 'P.401 (Nhà A3)',
        status: i <= 5 ? 'CLOSED' : (i === 6 ? 'OPEN' : 'CLOSED'),
        total_present: 0,
        total_excused: 0,
        total_absent: 0,
        total_late: 0
      });
    }
    await AcademicAttendanceSession.bulkCreate(defaultSessions);
  }
}

// 1. Lấy danh sách 15 buổi học của lớp học phần
exports.getSessions = async (req, res) => {
  try {
    const sectionId = parseInt(req.query.section_id) || 1;
    await ensureSessionsExist(sectionId);

    const sessions = await AcademicAttendanceSession.findAll({
      where: { section_id: sectionId },
      order: [['session_number', 'ASC']]
    });

    return res.json({ success: true, data: sessions });
  } catch (err) {
    console.error('Lỗi getSessions:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Lấy chi tiết điểm danh của 1 buổi học
exports.getSessionRecords = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const session = await AcademicAttendanceSession.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy buổi học' });
    }

    const records = await AcademicAttendanceRecord.findAll({
      where: { session_id: sessionId }
    });

    // Lấy toàn bộ sinh viên trong lớp 66.CNTT-1
    const students = await AcademicStudent.findAll({
      where: { class_name: '66.CNTT-1', is_deleted: false },
      order: [['student_code', 'ASC']]
    });

    const recordMap = new Map();
    records.forEach(r => recordMap.set(r.student_code, r));

    const studentList = students.map(s => {
      const rec = recordMap.get(s.student_code);
      return {
        student_id: s.id,
        student_code: s.student_code,
        student_name: s.full_name,
        class_name: s.class_name,
        status: rec ? rec.status : 'PRESENT',
        checkin_time: rec ? rec.checkin_time : null,
        notes: rec ? rec.notes : ''
      };
    });

    return res.json({
      success: true,
      session,
      records: studentList
    });
  } catch (err) {
    console.error('Lỗi getSessionRecords:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Giảng viên lưu điểm danh của buổi học (Checklist hoặc từng sinh viên)
exports.saveSessionRecords = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const session = await AcademicAttendanceSession.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy buổi học' });
    }

    const {
      records = [],
      topic,
      room,
      status = 'CLOSED'
    } = req.body;

    let present = 0, excused = 0, absent = 0, late = 0;

    for (const r of records) {
      const st = r.status || 'PRESENT';
      if (st === 'PRESENT') present++;
      else if (st === 'EXCUSED') excused++;
      else if (st === 'ABSENT') absent++;
      else if (st === 'LATE') late++;

      let existing = await AcademicAttendanceRecord.findOne({
        where: { session_id: sessionId, student_code: r.student_code }
      });

      if (existing) {
        await existing.update({
          status: st,
          student_name: r.student_name,
          class_name: r.class_name || '66.CNTT-1',
          notes: r.notes || '',
          checkin_time: new Date()
        });
      } else {
        await AcademicAttendanceRecord.create({
          session_id: sessionId,
          student_id: r.student_id || null,
          student_code: r.student_code,
          student_name: r.student_name,
          class_name: r.class_name || '66.CNTT-1',
          status: st,
          notes: r.notes || '',
          checkin_time: new Date()
        });
      }
    }

    await session.update({
      topic: topic || session.topic,
      room: room || session.room,
      status,
      total_present: present,
      total_excused: excused,
      total_absent: absent,
      total_late: late
    });

    return res.json({
      success: true,
      message: `Đã lưu điểm danh Buổi ${session.session_number}! (Có mặt: ${present}, Vắng: ${absent}, Phép: ${excused}, Trễ: ${late})`
    });
  } catch (err) {
    console.error('Lỗi saveSessionRecords:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Báo cáo Chuyên cần Toàn khóa & Cảnh báo Cấm thi TT 08/2021
exports.getAttendanceSummary = async (req, res) => {
  try {
    const sectionId = parseInt(req.query.section_id) || 1;
    await ensureSessionsExist(sectionId);

    const sessions = await AcademicAttendanceSession.findAll({
      where: { section_id: sectionId },
      order: [['session_number', 'ASC']]
    });

    const sessionIds = sessions.map(s => s.id);
    const totalSessions = sessions.length || 15;

    const records = await AcademicAttendanceRecord.findAll({
      where: { session_id: sessionIds }
    });

    const students = await AcademicStudent.findAll({
      where: { class_name: '66.CNTT-1', is_deleted: false },
      order: [['student_code', 'ASC']]
    });

    const summaryList = students.map(s => {
      const myRecords = records.filter(r => r.student_code === s.student_code);
      let present = 0, excused = 0, absent = 0, late = 0;

      myRecords.forEach(r => {
        if (r.status === 'PRESENT') present++;
        else if (r.status === 'EXCUSED') excused++;
        else if (r.status === 'ABSENT') absent++;
        else if (r.status === 'LATE') late++;
      });

      // Nếu số buổi ghi nhận nhỏ hơn tổng số buổi đã chốt, số còn lại tính là PRESENT mặc định
      const recordedCount = present + excused + absent + late;
      const closedSessionsCount = sessions.filter(sess => sess.status === 'CLOSED').length || 1;
      const missingCount = Math.max(0, closedSessionsCount - recordedCount);
      present += missingCount;

      // Đi trễ tính bằng 0.5 buổi có mặt, Vắng có phép tính 0.75
      const effectiveAttended = present + (late * 0.8) + (excused * 0.9);
      const attendancePct = parseFloat(((effectiveAttended / closedSessionsCount) * 100).toFixed(1));
      
      // Tỷ lệ vắng thực tế để xét cấm thi theo TT 08/2021 (Vắng > 20% số tiết = CẤM THI)
      const absentSessionsEquivalent = absent + (late * 0.5) + (excused * 0.25);
      const absentPct = parseFloat(((absentSessionsEquivalent / closedSessionsCount) * 100).toFixed(1));

      const isBanned = absentPct > 20.0; // Điều 12 TT 08/2021
      let warningStatus = 'SAFE';
      let warningText = 'Đủ điều kiện thi';

      if (isBanned) {
        warningStatus = 'BANNED';
        warningText = `CẤM THI (Vắng ${absentPct}% > 20% theo TT 08/2021)`;
      } else if (absentPct >= 13.0) {
        warningStatus = 'WARNING';
        warningText = `Cảnh báo nguy cơ cấm thi (Đã vắng ${absentPct}%)`;
      }

      return {
        student_code: s.student_code,
        student_name: s.full_name,
        class_name: s.class_name,
        email: s.email,
        total_closed_sessions: closedSessionsCount,
        present,
        late,
        excused,
        absent,
        attendance_pct: Math.min(100.0, attendancePct),
        absent_pct: absentPct,
        is_banned: isBanned,
        warning_status: warningStatus,
        warning_text: warningText
      };
    });

    const bannedCount = summaryList.filter(s => s.is_banned).length;
    const warningCount = summaryList.filter(s => s.warning_status === 'WARNING').length;

    return res.json({
      success: true,
      sectionId,
      totalSessions,
      stats: {
        totalStudents: summaryList.length,
        safeCount: summaryList.length - bannedCount - warningCount,
        warningCount,
        bannedCount
      },
      data: summaryList
    });
  } catch (err) {
    console.error('Lỗi getAttendanceSummary:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Tự động Đồng bộ Điểm chuyên cần sang Sổ điểm & Cập nhật Quyền dự thi
exports.syncAttendanceWithMoet = async (req, res) => {
  try {
    const sectionId = parseInt(req.body.section_id) || 1;
    await ensureSessionsExist(sectionId);

    const summaryReq = { query: { section_id: sectionId } };
    let summaryData = [];

    // Gọi nội bộ hàm summary
    const sessions = await AcademicAttendanceSession.findAll({ where: { section_id: sectionId } });
    const records = await AcademicAttendanceRecord.findAll({ where: { session_id: sessions.map(s => s.id) } });
    const students = await AcademicStudent.findAll({ where: { class_name: '66.CNTT-1', is_deleted: false } });

    const closedCount = sessions.filter(s => s.status === 'CLOSED').length || 1;

    let syncedGrades = 0;
    let syncedAuthorizations = 0;

    for (const st of students) {
      const myRecords = records.filter(r => r.student_code === st.student_code);
      let present = 0, late = 0, excused = 0, absent = 0;

      myRecords.forEach(r => {
        if (r.status === 'PRESENT') present++;
        else if (r.status === 'LATE') late++;
        else if (r.status === 'EXCUSED') excused++;
        else if (r.status === 'ABSENT') absent++;
      });

      const recorded = present + late + excused + absent;
      present += Math.max(0, closedCount - recorded);

      const effectiveAttended = present + (late * 0.8) + (excused * 0.9);
      const attRate = Math.min(100.0, (effectiveAttended / closedCount) * 100);
      const absentEquivalent = absent + (late * 0.5) + (excused * 0.25);
      const absentRate = (absentEquivalent / closedCount) * 100;
      const isBanned = absentRate > 20.0;

      // 1. Cập nhật Điểm chuyên cần (thang 10) vào Sổ điểm
      const attScore = parseFloat((attRate / 10.0).toFixed(2));
      let secGrade = await AcademicSectionGrade.findOne({
        where: { section_id: sectionId, student_code: st.student_code }
      });

      if (secGrade) {
        const assignment = parseFloat(secGrade.assignment_score) || 8.5;
        const midterm = parseFloat(secGrade.midterm_score) || 8.0;
        const finalExam = parseFloat(secGrade.final_exam_score) || 8.0;

        const course10 = parseFloat(((attScore * 0.1) + (assignment * 0.2) + (midterm * 0.2) + (finalExam * 0.5)).toFixed(2));
        await secGrade.update({
          attendance_score: attScore,
          course_score_10: course10
        });
        syncedGrades++;
      }

      // 2. Cập nhật Tư cách dự thi (ExamCandidateAuthorization)
      let candidate = await ExamCandidateAuthorization.findOne({
        where: { student_code: st.student_code }
      });

      if (candidate) {
        if (isBanned) {
          await candidate.update({
            attendance_pct: Math.round(attRate),
            condition_passed: false,
            authorization_status: 'DENIED',
            notes: `CẤM THI: Vắng ${absentRate.toFixed(1)}% vượt quá 20% theo quy chế TT 08/2021`
          });
        } else {
          await candidate.update({
            attendance_pct: Math.round(attRate),
            condition_passed: true,
            authorization_status: 'GRANTED',
            notes: 'Đủ điều kiện dự thi (Chuyên cần đạt chuẩn)'
          });
        }
        syncedAuthorizations++;
      }
    }

    return res.json({
      success: true,
      message: `Đồng bộ thành công ${syncedGrades} bảng điểm học phần và cập nhật ${syncedAuthorizations} hồ sơ cấp quyền phòng thi!`
    });
  } catch (err) {
    console.error('Lỗi syncAttendanceWithMoet:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
