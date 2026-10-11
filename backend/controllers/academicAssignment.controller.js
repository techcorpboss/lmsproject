// backend/controllers/academicAssignment.controller.js
// 📋 Phân Hệ Bài Tập Tự Luận & Chấm Điểm Theo Rubrics Sư Phạm (Academic Assignment & Rubrics Grading Hub)
const {
  AcademicAssignment,
  AcademicAssignmentSubmission,
  AcademicSectionGrade,
  AcademicStudent
} = require('../models');

// Tiêu chí Rubrics mẫu chuẩn sư phạm CNTT & Học thuật
const DEFAULT_RUBRICS = [
  {
    id: 'crit_correctness',
    name: 'Tính đúng đắn & Đáp ứng yêu cầu bài toán',
    weight_pct: 40,
    max_points: 4.0,
    levels: [
      { level: 'Xuất sắc', points: 4.0, description: 'Chạy đúng 100% test cases, không có lỗi runtime/logic, xử lý ngoại lệ hoàn hảo' },
      { level: 'Khá / Tốt', points: 3.2, description: 'Chạy đúng > 80% trường hợp, xử lý tốt các luồng cơ bản' },
      { level: 'Đạt yêu cầu', points: 2.4, description: 'Đạt yêu cầu tối thiểu, còn lỗi ở một số trường hợp biên' },
      { level: 'Chưa đạt', points: 1.0, description: 'Chương trình không chạy được hoặc sai lệch nghiêm trọng so với đề bài' }
    ]
  },
  {
    id: 'crit_architecture',
    name: 'Kiến trúc, Cấu trúc Dữ liệu & Tối ưu Giải thuật',
    weight_pct: 30,
    max_points: 3.0,
    levels: [
      { level: 'Xuất sắc', points: 3.0, description: 'Thiết kế module hóa xuất sắc, cấu trúc dữ liệu tối ưu O(n log n) hoặc O(1)' },
      { level: 'Khá / Tốt', points: 2.4, description: 'Thiết kế hợp lý, phân tách hàm rõ ràng, độ phức tạp chấp nhận được' },
      { level: 'Đạt yêu cầu', points: 1.8, description: 'Mã nguồn còn lặp, cấu trúc dữ liệu chưa tối ưu' },
      { level: 'Chưa đạt', points: 0.8, description: 'Spaghetti code, không phân chia module, độ phức tạp O(n^2) không cần thiết' }
    ]
  },
  {
    id: 'crit_standards',
    name: 'Quy chuẩn Mã nguồn & Báo cáo Thuyết minh',
    weight_pct: 20,
    max_points: 2.0,
    levels: [
      { level: 'Xuất sắc', points: 2.0, description: 'Tuân thủ tuyệt đối chuẩn coding style (camelCase, comment Docstrings), báo cáo PDF đẹp chuẩn' },
      { level: 'Khá / Tốt', points: 1.6, description: 'Mã nguồn sạch, có comment các hàm chính, báo cáo đầy đủ' },
      { level: 'Đạt yêu cầu', points: 1.2, description: 'Còn thiếu comment, định dạng chưa đồng nhất' },
      { level: 'Chưa đạt', points: 0.5, description: 'Mã nguồn cẩu thả, không có ghi chú hoặc thiếu báo cáo' }
    ]
  },
  {
    id: 'crit_creativity',
    name: 'Tính Sáng tạo, Mở rộng & Giao diện/UX',
    weight_pct: 10,
    max_points: 1.0,
    levels: [
      { level: 'Xuất sắc', points: 1.0, description: 'Có tính năng mở rộng đột phá, giải pháp thuật toán thông minh hoặc giao diện CLI/GUI mượt mà' },
      { level: 'Khá / Tốt', points: 0.8, description: 'Có nỗ lực cải tiến mở rộng ngoài yêu cầu đề bài' },
      { level: 'Đạt yêu cầu', points: 0.5, description: 'Đáp ứng vừa đủ, không có mở rộng' },
      { level: 'Chưa đạt', points: 0.0, description: 'Không có yếu tố sáng tạo' }
    ]
  }
];

// 1. Lấy danh sách bài tập của lớp học phần
exports.getAssignments = async (req, res) => {
  try {
    const sectionId = parseInt(req.query.section_id) || 1;
    const moduleId = req.query.module_id ? parseInt(req.query.module_id) : null;
    const studentCode = req.query.student_code || (req.user && req.user.student_code) || null;

    const whereClause = { section_id: sectionId };
    if (moduleId) whereClause.module_id = moduleId;

    const assignments = await AcademicAssignment.findAll({
      where: whereClause,
      include: [
        {
          model: AcademicAssignmentSubmission,
          as: 'submissions',
          attributes: ['id', 'student_code', 'student_name', 'status', 'score', 'submitted_at']
        }
      ],
      order: [['id', 'DESC']]
    });

    // Thống kê nhanh
    const result = assignments.map(a => {
      const plain = a.toJSON();
      const subs = plain.submissions || [];
      const totalSubs = subs.length;
      const gradedSubs = subs.filter(s => s.status === 'GRADED').length;
      const pendingSubs = totalSubs - gradedSubs;

      let mySubmission = null;
      if (studentCode) {
        mySubmission = subs.find(s => s.student_code === studentCode) || null;
      }

      return {
        ...plain,
        stats: {
          totalSubmissions: totalSubs,
          gradedSubmissions: gradedSubs,
          pendingSubmissions: pendingSubs
        },
        mySubmission
      };
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Lỗi getAssignments:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Giảng viên tạo hoặc cập nhật bài tập (kèm cấu hình Rubrics)
exports.createOrUpdateAssignment = async (req, res) => {
  try {
    const {
      id,
      section_id = 1,
      module_id = 1001,
      title,
      description,
      due_date,
      max_score = 10.0,
      allowed_file_types = '.pdf,.zip,.docx,.cpp,.py,.sql',
      max_file_size_mb = 50,
      rubric_criteria,
      status = 'PUBLISHED'
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Tiêu đề bài tập không được để trống' });
    }

    const finalRubric = (rubric_criteria && rubric_criteria.length > 0)
      ? rubric_criteria
      : DEFAULT_RUBRICS;

    let assignment;
    if (id) {
      assignment = await AcademicAssignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy bài tập' });
      }
      await assignment.update({
        section_id,
        module_id,
        title,
        description,
        due_date,
        max_score,
        allowed_file_types,
        max_file_size_mb,
        rubric_criteria: finalRubric,
        status
      });
    } else {
      assignment = await AcademicAssignment.create({
        section_id,
        module_id,
        title,
        description,
        due_date: due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Mặc định 2 tuần sau
        max_score,
        allowed_file_types,
        max_file_size_mb,
        rubric_criteria: finalRubric,
        status,
        created_by: req.user ? req.user.id : 1
      });
    }

    return res.json({
      success: true,
      message: id ? 'Cập nhật bài tập thành công!' : 'Tạo mới bài tập tự luận kèm Rubric thành công!',
      data: assignment
    });
  } catch (err) {
    console.error('Lỗi createOrUpdateAssignment:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Giảng viên lấy toàn bộ bài nộp của một bài tập để chấm
exports.getSubmissions = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const assignment = await AcademicAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài tập' });
    }

    const submissions = await AcademicAssignmentSubmission.findAll({
      where: { assignment_id: assignmentId },
      order: [['submitted_at', 'DESC']]
    });

    // Lấy thêm danh sách sinh viên của lớp để biết ai chưa nộp
    const enrolledStudents = await AcademicStudent.findAll({
      where: { class_name: '66.CNTT-1', is_deleted: false },
      attributes: ['student_code', 'full_name', 'class_name', 'email']
    });

    const submissionMap = new Map();
    submissions.forEach(s => submissionMap.set(s.student_code, s));

    const fullClassList = enrolledStudents.map(st => {
      const sub = submissionMap.get(st.student_code);
      return {
        student_code: st.student_code,
        student_name: st.full_name,
        class_name: st.class_name,
        email: st.email,
        submission: sub || null,
        is_submitted: !!sub,
        status: sub ? sub.status : 'NOT_SUBMITTED'
      };
    });

    return res.json({
      success: true,
      assignment,
      submissions,
      fullClassList
    });
  } catch (err) {
    console.error('Lỗi getSubmissions:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Sinh viên nộp bài tập (Upload file hoặc nhập text)
exports.submitAssignment = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const assignment = await AcademicAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài tập' });
    }

    const {
      student_code = '261IT001',
      student_name = 'Trần Văn Nam',
      class_name = '66.CNTT-1',
      submission_text = '',
      attachment_url = '',
      attachment_name = '',
      attachment_size = 0
    } = req.body;

    const now = new Date();
    let status = 'SUBMITTED';
    if (assignment.due_date && now > new Date(assignment.due_date)) {
      status = 'LATE';
    }

    let submission = await AcademicAssignmentSubmission.findOne({
      where: {
        assignment_id: assignmentId,
        student_code
      }
    });

    if (submission) {
      // Cập nhật bài nộp
      await submission.update({
        student_name,
        class_name,
        submission_text,
        attachment_url: attachment_url || submission.attachment_url,
        attachment_name: attachment_name || submission.attachment_name,
        attachment_size: attachment_size || submission.attachment_size,
        submitted_at: now,
        status
      });
    } else {
      // Tạo mới bài nộp
      submission = await AcademicAssignmentSubmission.create({
        assignment_id: assignmentId,
        student_id: req.user ? req.user.id : null,
        student_code,
        student_name,
        class_name,
        submission_text,
        attachment_url,
        attachment_name,
        attachment_size,
        submitted_at: now,
        status
      });
    }

    return res.json({
      success: true,
      message: status === 'LATE' ? 'Đã nộp bài (Trễ hạn) thành công!' : 'Đã nộp bài tập thành công!',
      data: submission
    });
  } catch (err) {
    console.error('Lỗi submitAssignment:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Giảng viên chấm điểm với Rubric & Đồng bộ Sổ Điểm Học Phần
exports.gradeSubmission = async (req, res) => {
  try {
    const submissionId = parseInt(req.params.submissionId);
    const submission = await AcademicAssignmentSubmission.findByPk(submissionId, {
      include: [{ model: AcademicAssignment, as: 'assignment' }]
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài nộp' });
    }

    const {
      score,
      rubric_scores = {},
      feedback = '',
      graded_by = 'TS. Hoàng Đức Em'
    } = req.body;

    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      return res.status(400).json({ success: false, message: 'Điểm số phải nằm trong khoảng 0.0 - 10.0' });
    }

    await submission.update({
      score: parsedScore,
      rubric_scores,
      feedback,
      status: 'GRADED',
      graded_by,
      graded_at: new Date()
    });

    // ⚡ ĐỒNG BỘ TỰ ĐỘNG SANG SỔ ĐIỂM HỌC PHẦN (academic_section_grades)
    const sectionId = submission.assignment ? submission.assignment.section_id : 1;
    let sectionGrade = await AcademicSectionGrade.findOne({
      where: {
        section_id: sectionId,
        student_code: submission.student_code
      }
    });

    if (sectionGrade) {
      // Cập nhật assignment_score
      const attendance = parseFloat(sectionGrade.attendance_score) || 10.0;
      const assignment = parsedScore;
      const midterm = parseFloat(sectionGrade.midterm_score) || 8.0;
      const finalExam = parseFloat(sectionGrade.final_exam_score) || 8.0;

      // Công thức tính điểm học phần theo tỷ lệ chuẩn TT 08/2021:
      // Chuyên cần 10% + Bài tập 20% + Giữa kỳ 20% + Cuối kỳ 50%
      const course10 = parseFloat(((attendance * 0.1) + (assignment * 0.2) + (midterm * 0.2) + (finalExam * 0.5)).toFixed(2));
      
      // Quy đổi thang chữ & thang 4 chuẩn Bộ GD&ĐT
      let letter = 'F';
      let scale4 = 0.0;
      let rank = 'KÉM';
      let result = 'KHÔNG ĐẠT (FAIL)';

      if (course10 >= 8.5) { letter = 'A'; scale4 = 4.0; rank = 'XUẤT SẮC'; result = 'ĐẠT (PASS)'; }
      else if (course10 >= 8.0) { letter = 'B+'; scale4 = 3.5; rank = 'GIỎI'; result = 'ĐẠT (PASS)'; }
      else if (course10 >= 7.0) { letter = 'B'; scale4 = 3.0; rank = 'KHÁ'; result = 'ĐẠT (PASS)'; }
      else if (course10 >= 6.5) { letter = 'C+'; scale4 = 2.5; rank = 'TRUNG BÌNH KHÁ'; result = 'ĐẠT (PASS)'; }
      else if (course10 >= 5.5) { letter = 'C'; scale4 = 2.0; rank = 'TRUNG BÌNH'; result = 'ĐẠT (PASS)'; }
      else if (course10 >= 5.0) { letter = 'D+'; scale4 = 1.5; rank = 'TRUNG BÌNH YẾU'; result = 'ĐẠT (PASS)'; }
      else if (course10 >= 4.0) { letter = 'D'; scale4 = 1.0; rank = 'YẾU'; result = 'ĐẠT (PASS)'; }

      await sectionGrade.update({
        assignment_score: assignment,
        course_score_10: course10,
        course_score_letter: letter,
        course_score_4: scale4,
        academic_rank: rank,
        course_result: result
      });
    }

    return res.json({
      success: true,
      message: `Đã chấm ${parsedScore} điểm và đồng bộ tức thời vào Sổ điểm học phần!`,
      data: submission
    });
  } catch (err) {
    console.error('Lỗi gradeSubmission:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
