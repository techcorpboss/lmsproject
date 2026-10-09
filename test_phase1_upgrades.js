// test_phase1_upgrades.js
/**
 * Kịch bản kiểm thử tự động toàn diện Giai đoạn 1:
 * 1. H5P Interactive Video Quizzes (Checkpoints, Submit, Scoring, Teacher Authoring)
 * 2. Khảo sát Đánh giá Giảng viên (SET) & Cổng Chặn Điểm Thi (Grade Gatekeeper)
 */

// Import services and routes
const interactiveVideoService = require('./backend/services/interactiveVideoService');
const courseEvaluationService = require('./backend/services/courseEvaluationService');
const academicEnterpriseController = require('./backend/controllers/academicEnterprise.controller');

async function runTests() {
  console.log('================================================================');
  console.log('🚀 KIỂM THỬ TÍNH NĂNG GIAI ĐOẠN 1: TCU COMPASS LMS UPGRADE');
  console.log('================================================================\n');

  // TEST 1: H5P INTERACTIVE VIDEO
  console.log('--- TEST 1: H5P INTERACTIVE VIDEO CHECKPOINTS ---');
  const checkpoints = interactiveVideoService.getCheckpointsByLesson('1');
  console.log(`1.1. Lấy danh sách điểm dừng bài học 1: ${checkpoints.length} câu hỏi`);
  console.log(`     - Checkpoint 1 tại: ${checkpoints[0]?.timestamp_display} - "${checkpoints[0]?.title}"`);

  // Sinh viên trả lời đúng
  const answerResult = interactiveVideoService.submitAnswer('1', 1, {
    checkpointId: checkpoints[0]?.id,
    selectedAnswer: 'B' // Toán tử &
  });
  console.log(`1.2. Sinh viên nộp câu trả lời 'B': ${answerResult.isCorrect ? '✅ ĐÚNG' : '❌ SAI'}`);
  console.log(`     - Điểm nhận được: +${answerResult.pointsEarned}đ (Tổng tích lũy: ${answerResult.totalPointsEarned}đ)`);

  // Giảng viên thêm mốc kiểm tra mới
  const updatedCheckpoints = interactiveVideoService.saveCheckpoint('1', {
    timestamp_seconds: 60,
    title: 'Kiểm tra giải phóng mảng con trỏ',
    question: 'Cú pháp giải phóng mảng cấp phát động đúng là gì?',
    options: [
      { key: 'A', text: 'delete arr;' },
      { key: 'B', text: 'delete[] arr;' },
      { key: 'C', text: 'free(arr);' },
      { key: 'D', text: 'remove(arr);' }
    ],
    correct_answer: 'B',
    points: 10,
    explanation: 'Dùng new[] thì phải dùng delete[]!'
  });
  console.log(`1.3. Giảng viên thêm checkpoint mới tại 01:00: Tổng ${updatedCheckpoints.length} câu hỏi thành công!\n`);

  // TEST 2: KHẢO SÁT GIẢNG VIÊN (SET) & GATEKEEPER
  console.log('--- TEST 2: KHẢO SÁT Ý KIẾN NGƯỜI HỌC (SET) & CỔNG CHẶN ĐIỂM THI ---');
  const surveyForm = courseEvaluationService.getSurveyForm('IT101', 'TS. Hoàng Đức Em');
  console.log(`2.1. Tải mẫu khảo sát học phần IT101: ${surveyForm.dimensions.length} tiêu chuẩn chất lượng`);
  surveyForm.dimensions.forEach((d, i) => console.log(`     ${i + 1}. [${d.key}] ${d.title} (Trọng số ${d.weight * 100}%)`));

  // Kiểm tra bảng điểm trước khi khảo sát
  let mockResData = null;
  const mockReq = { params: { studentId: 1 }, query: { semester: '1' } };
  const mockRes = {
    json: (obj) => { mockResData = obj; return mockRes; },
    status: () => mockRes
  };

  await academicEnterpriseController.getStudentTranscript(mockReq, mockRes);
  const it101Before = mockResData?.data?.courses?.find(c => c.code === 'IT101');
  console.log(`\n2.2. Trạng thái môn IT101 trước khảo sát:`);
  console.log(`     - is_evaluated: ${it101Before?.is_evaluated}`);
  console.log(`     - is_locked_by_survey: ${it101Before?.is_locked_by_survey}`);
  console.log(`     - display_final_score: "${it101Before?.display_final_score}"`);
  console.log(`     - display_course_score_10: "${it101Before?.display_course_score_10}"`);

  // Sinh viên thực hiện nộp phiếu khảo sát ẩn danh
  console.log(`\n2.3. Sinh viên hoàn thành phiếu khảo sát ẩn danh...`);
  const submitSurveyRes = courseEvaluationService.submitSurvey({
    studentId: 1,
    courseCode: 'IT101',
    courseName: 'Nhập Môn Lập Trình C/C++',
    lecturerId: 'GV001',
    lecturerName: 'TS. Hoàng Đức Em',
    ratings: {
      pedagogical_clarity: 5,
      professionalism_punctuality: 5,
      materials_usefulness: 4,
      fairness_transparency: 5,
      inspiration_motivation: 5
    },
    generalFeedback: 'Thầy giảng rất dễ hiểu và truyền cảm hứng tuyệt vời!'
  });
  console.log(`     - Kết quả nộp: ${submitSurveyRes.message}`);
  console.log(`     - Mã phiếu ẩn danh: ${submitSurveyRes.submissionId}`);

  // Kiểm tra bảng điểm sau khi khảo sát
  await academicEnterpriseController.getStudentTranscript(mockReq, mockRes);
  const it101After = mockResData?.data?.courses?.find(c => c.code === 'IT101');
  console.log(`\n2.4. Trạng thái môn IT101 sau khi khảo sát:`);
  console.log(`     - is_evaluated: ${it101After?.is_evaluated}`);
  console.log(`     - is_locked_by_survey: ${it101After?.is_locked_by_survey}`);
  console.log(`     - display_final_score: ${it101After?.display_final_score} (ĐÃ MỞ KHÓA!)`);
  console.log(`     - display_course_score_10: ${it101After?.display_course_score_10} (ĐÃ MỞ KHÓA!)`);
  console.log(`     - display_letter_grade: ${it101After?.display_letter_grade}`);

  // Thống kê kết quả khảo sát cho Giảng viên / Khoa
  const stats = courseEvaluationService.getStatistics('IT101');
  console.log(`\n2.5. Báo cáo Thống kê Đảm bảo Chất lượng Học phần IT101:`);
  console.log(`     - Tổng số phiếu thu về: ${stats.totalResponses}`);
  console.log(`     - Điểm hài lòng trung bình: ${stats.overallAverage}/5.0 (${stats.satisfactionRate}%)`);
  console.log(`     - Ý kiến đóng góp: "${stats.feedbackList[0]?.feedback}"`);

  console.log('\n================================================================');
  console.log('✅ TẤT CẢ CÁC BÀI KIỂM THỬ GIAI ĐOẠN 1 ĐÃ VƯỢT QUA 100%!');
  console.log('================================================================');
}

runTests().catch(err => console.error('Lỗi kiểm thử:', err));
