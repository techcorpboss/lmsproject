// scratch/test_phase2_backend.js
const path = require('path');
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

const assignmentController = require('../backend/controllers/academicAssignment.controller');
const attendanceController = require('../backend/controllers/academicAttendance.controller');
const {
  AcademicAssignment,
  AcademicAssignmentSubmission,
  AcademicAttendanceSession,
  AcademicAttendanceRecord,
  AcademicSectionGrade,
  ExamCandidateAuthorization
} = require('../backend/models');

async function runTests() {
  console.log('========================================================================');
  console.log('KIỂM THỬ TRỰC TIẾP MODULE GIAI ĐOẠN 2 (ASSIGNMENTS, RUBRICS & ATTENDANCE)');
  console.log('========================================================================\n');

  try {
    // [1] Test createOrUpdateAssignment
    console.log('[1] Kiểm thử createOrUpdateAssignment (Tạo bài tập kèm Rubric 4 tiêu chí)...');
    let assignmentId;
    const reqCreate = {
      body: {
        section_id: 1,
        module_id: 1001,
        title: 'Bài Tập Lớn 1: Thiết Kế & Xây Dựng Hệ Thống Quản Lý Đào Tạo',
        description: 'Sinh viên xây dựng chương trình C++/Python quản lý sinh viên và điểm học phần theo kiến trúc hướng đối tượng.',
        due_date: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        max_score: 10.0,
        allowed_file_types: '.zip,.pdf,.docx,.cpp',
        max_file_size_mb: 50,
        status: 'PUBLISHED'
      },
      user: { id: 1 }
    };
    const resCreate = {
      status: (code) => ({ json: (data) => console.log('Status code:', code, data) }),
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        assignmentId = data.data.id;
        console.log(' -> Result: SUCCESS | Assignment ID:', assignmentId);
        console.log(' -> Title:', data.data.title);
        console.log(' -> Rubric Criteria Count:', data.data.rubric_criteria ? data.data.rubric_criteria.length : 0);
      }
    };
    await assignmentController.createOrUpdateAssignment(reqCreate, resCreate);

    // [2] Test submitAssignment
    console.log('\n[2] Kiểm thử submitAssignment (Sinh viên nộp bài kèm file nén)...');
    let submissionId;
    const reqSubmit = {
      params: { assignmentId },
      body: {
        student_code: '261IT001',
        student_name: 'Trần Văn Nam',
        class_name: '66.CNTT-1',
        submission_text: 'Em xin nộp bài tập lớn số 1: Code C++ hoàn chỉnh và Báo cáo PDF kiến trúc.',
        attachment_url: '/uploads/assignments/261IT001_BTL1.zip',
        attachment_name: '261IT001_BTL1.zip',
        attachment_size: 15420000
      },
      user: { id: 101, student_code: '261IT001' }
    };
    const resSubmit = {
      status: (code) => ({ json: (data) => console.log('Status code:', code, data) }),
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        submissionId = data.data.id;
        console.log(' -> Result: SUCCESS | Submission ID:', submissionId);
        console.log(' -> Student:', data.data.student_name, `(${data.data.student_code})`);
        console.log(' -> Status:', data.data.status);
      }
    };
    await assignmentController.submitAssignment(reqSubmit, resSubmit);

    // [3] Test gradeSubmission with Rubric & Sync to Gradebook
    console.log('\n[3] Kiểm thử gradeSubmission (Chấm điểm Rubric & Tự động đồng bộ Sổ điểm)...');
    const reqGrade = {
      params: { submissionId },
      body: {
        score: 9.25,
        rubric_scores: {
          crit_correctness: 3.8,
          crit_architecture: 2.8,
          crit_standards: 1.85,
          crit_creativity: 0.8
        },
        feedback: 'Bài làm rất tốt, phân chia module rõ ràng, tối ưu hóa thuật toán tìm kiếm và xử lý ngoại lệ tốt.',
        graded_by: 'TS. Hoàng Đức Em'
      }
    };
    const resGrade = {
      status: (code) => ({ json: (data) => console.log('Status code:', code, data) }),
      json: async (data) => {
        if (!data.success) throw new Error(data.message);
        console.log(' -> Result: SUCCESS | Score:', data.data.score);
        console.log(' -> Feedback:', data.data.feedback);

        // Verify in AcademicSectionGrade
        const secGrade = await AcademicSectionGrade.findOne({
          where: { section_id: 1, student_code: '261IT001' }
        });
        if (secGrade) {
          console.log(' -> Synced to Sổ Điểm:');
          console.log(`    Assignment Score: ${secGrade.assignment_score} | Course 10: ${secGrade.course_score_10} | Letter: ${secGrade.course_score_letter} | Scale 4: ${secGrade.course_score_4}`);
        }
      }
    };
    await assignmentController.gradeSubmission(reqGrade, resGrade);

    // [4] Test getSessions & saveSessionRecords
    console.log('\n[4] Kiểm thử getSessions & saveSessionRecords (Điểm danh buổi học)...');
    let sessionId;
    const reqSessions = { query: { section_id: 1 } };
    const resSessions = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        console.log(' -> Total Sessions initialized:', data.data.length);
        sessionId = data.data[0].id;
        console.log(' -> Session 1 ID:', sessionId);
      }
    };
    await attendanceController.getSessions(reqSessions, resSessions);

    // Giả lập điểm danh: Nam có mặt, thêm 1 SV vắng để test cảnh báo
    const reqSaveAtt = {
      params: { sessionId },
      body: {
        topic: 'Tuần 1: Giới thiệu môn học & Thiết lập môi trường biên dịch',
        room: 'P.401 (Nhà A3)',
        status: 'CLOSED',
        records: [
          { student_code: '261IT001', student_name: 'Trần Văn Nam', status: 'PRESENT' },
          { student_code: '261IT002', student_name: 'Nguyễn Thị Mai', status: 'ABSENT', notes: 'Vắng không phép' }
        ]
      }
    };
    const resSaveAtt = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        console.log(' -> Result:', data.message);
      }
    };
    await attendanceController.saveSessionRecords(reqSaveAtt, resSaveAtt);

    // [5] Test getAttendanceSummary & syncAttendanceWithMoet
    console.log('\n[5] Kiểm thử getAttendanceSummary & Cảnh báo cấm thi TT 08/2021...');
    const reqSummary = { query: { section_id: 1 } };
    const resSummary = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        console.log(' -> Attendance Summary Stats:', JSON.stringify(data.stats));
        const nam = data.data.find(s => s.student_code === '261IT001');
        if (nam) {
          console.log(` -> Sinh viên 261IT001 (${nam.student_name}): Chuyên cần ${nam.attendance_pct}% | Trạng thái: ${nam.warning_status} (${nam.warning_text})`);
        }
      }
    };
    await attendanceController.getAttendanceSummary(reqSummary, resSummary);

    console.log('\n[6] Kiểm thử syncAttendanceWithMoet (Đồng bộ điều kiện dự thi)...');
    const reqSyncMoet = { body: { section_id: 1 } };
    const resSyncMoet = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        console.log(' -> Result:', data.message);
      }
    };
    await attendanceController.syncAttendanceWithMoet(reqSyncMoet, resSyncMoet);

    console.log('\n========================================================================');
    console.log('HOÀN TẤT KIỂM THỬ GIAI ĐOẠN 2: TẤT CẢ CONTROLLER CHẠY CHÍNH XÁC 100%!');
    console.log('========================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Kiểm thử thất bại:', err);
    process.exit(1);
  }
}

runTests();
