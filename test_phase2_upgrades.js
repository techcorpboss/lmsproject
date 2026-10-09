// test_phase2_upgrades.js
// Kịch bản Kiểm thử Tự động Toàn diện Giai đoạn 2: Chuẩn Kiểm định AUN-QA, ABET, TT 08/2021/TT-BGDĐT
const peerReviewService = require('./backend/services/peerReviewService');
const graduationThesisService = require('./backend/services/graduationThesisService');
const examSchedulerService = require('./backend/services/examSchedulerService');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ GIAI ĐOẠN 2: CHUẨN KIỂM ĐỊNH & HỌC VỤ ĐẠI HỌC');
console.log('================================================================\n');

// -------------------------------------------------------------
// 1. KIỂM THỬ ĐÁNH GIÁ ĐỒNG ĐẲNG KÉP (DOUBLE-BLIND PEER REVIEW)
// -------------------------------------------------------------
console.log('📋 1. KIỂM THỬ PEER REVIEW VÀ RUBRICS ĐA TIÊU CHÍ');
try {
  // 1.1 Khởi tạo cấu hình Rubric
  const rubrics = peerReviewService.getRubricCriteria();
  assert(rubrics && rubrics.length === 3, 'Khởi tạo thành công 3 tiêu chí Rubrics chuẩn AUN-QA/ABET (Kiến trúc 3.5đ, Cài đặt 3.5đ, Báo cáo 3.0đ)');

  // 1.2 Phân công ẩn danh kép (Double-Blind Allocation)
  const assignmentId = 'assign_test_it101';
  const submissions = [
    { id: 'sub_1', student_id: 1, student_name: 'Nguyễn Văn An', file_name: 'BTL_Nhom1.zip' },
    { id: 'sub_2', student_id: 2, student_name: 'Trần Thị Bình', file_name: 'BTL_Nhom2.zip' },
    { id: 'sub_3', student_id: 3, student_name: 'Lê Hoàng Cường', file_name: 'BTL_Nhom3.zip' },
    { id: 'sub_4', student_id: 4, student_name: 'Phạm Thu Dung', file_name: 'BTL_Nhom4.zip' }
  ];

  const distResult = peerReviewService.distributePeerReviews(assignmentId, submissions, 2);
  assert(distResult && distResult.success, 'Phân phối chấm chéo đồng đẳng tự động thành công');
  assert(distResult.allocations.length === 8, 'Tổng số lượt phân công chấm: 8 lượt (4 sinh viên x 2 bài/bạn)');

  // Kiểm tra không ai tự chấm bài mình (No Self-Review) & Ẩn danh tác giả (Token Masked)
  let selfReviewFound = false;
  let anonTokensValid = true;
  distResult.allocations.forEach(a => {
    const targetSub = submissions.find(s => s.id === a.submissionId);
    if (targetSub && targetSub.student_id === a.reviewerStudentId) {
      selfReviewFound = true;
    }
    if (!a.authorMaskedCode || !a.authorMaskedCode.startsWith('ANON-AUTHOR-')) {
      anonTokensValid = false;
    }
  });
  assert(!selfReviewFound, 'Ràng buộc 1: Tuyệt đối không sinh viên nào tự chấm bài của chính mình');
  assert(anonTokensValid, 'Ràng buộc 2: Tác giả bài nộp bị ẩn danh hoàn toàn (Token dạng ANON-AUTHOR-xxx)');

  // 1.3 Nộp điểm đánh giá Peer Review theo Rubric
  const firstAlloc = distResult.allocations[0];
  const reviewResult = peerReviewService.submitPeerReview({
    reviewId: firstAlloc.reviewId,
    assignmentId,
    reviewerStudentId: firstAlloc.reviewerStudentId,
    submissionId: firstAlloc.submissionId,
    rubricScores: {
      crit_architecture: 3.5,
      crit_algorithm: 2.8,
      crit_report: 2.4
    },
    feedbackText: 'Thiết kế kiến trúc rất sáng sủa, code module hóa tốt.'
  });

  assert(reviewResult && reviewResult.success, 'Nộp kết quả đánh giá đồng đẳng theo Rubric thành công');
  assert(reviewResult.reviewRecord.totalScore === 8.7, `Điểm Rubric tổng cộng được tính chính xác: ${reviewResult.reviewRecord.totalScore}/10`);

  // 1.4 Lấy báo cáo tổng hợp Peer Review cho bài nộp
  const summary = peerReviewService.getPeerReviewSummaryForSubmission(firstAlloc.submissionId);
  assert(summary && summary.reviewCount >= 1, 'Báo cáo tổng kết đối soát Peer Review của bài nộp chính xác');
  assert(summary.averagePeerScore === 8.7, `Điểm trung bình đồng đẳng: ${summary.averagePeerScore}`);
} catch (err) {
  console.error('Lỗi kiểm thử Peer Review:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử Peer Review');
}

console.log('\n-------------------------------------------------------------');

// -------------------------------------------------------------
// 2. KIỂM THỬ KHÓA LUẬN / ĐỒ ÁN TỐT NGHIỆP & HỘI ĐỒNG BẢO VỆ
// -------------------------------------------------------------
console.log('🎓 2. KIỂM THỬ QUẢN LÝ ĐỒ ÁN / KHÓA LUẬN TỐT NGHIỆP');
try {
  // 2.1 Đăng ký đề tài mới
  const newThesis = graduationThesisService.registerThesis({
    student_id: 101,
    student_code: '20260088',
    student_name: 'Lê Minh Khang',
    class_name: '66.CNTT-2',
    major_name: 'Kỹ thuật Phần mềm',
    title: 'Nghiên cứu ứng dụng Large Language Model trong Chấm thi Tự luận Tự động',
    objective: 'Xây dựng engine AI chấm điểm tự luận theo Rubrics chuẩn Bộ GD&ĐT',
    technologies: 'Python, FastAPI, OpenAI, LangChain',
    supervisor_id: 2,
    supervisor_name: 'TS. Hoàng Đức Em'
  });
  assert(newThesis && newThesis.id.startsWith('thesis_2026_'), `Đăng ký khóa luận thành công, Mã đề tài: ${newThesis.id}`);
  assert(newThesis.status === 'PROPOSED', 'Trạng thái ban đầu: PROPOSED (Chờ duyệt đề tài)');

  // 2.2 Giảng viên duyệt đề tài
  const approved = graduationThesisService.approveThesis(newThesis.id, 'APPROVED');
  assert(approved && approved.status === 'APPROVED', 'Giảng viên hướng dẫn & Bộ môn phê duyệt đề cương');

  // 2.3 Nộp báo cáo tiến độ và kích hoạt kiểm tra đạo văn
  const milestoneSubmitted = graduationThesisService.submitMilestone(newThesis.id, 'FINAL_100', 'Bao_cao_toan_van_LeMinhKhang.pdf');
  assert(milestoneSubmitted && milestoneSubmitted.status === 'SUBMITTED_FINAL', 'Nộp toàn văn khóa luận 100% thành công');
  assert(milestoneSubmitted.plagiarism_check.status === 'PASSED', `Kiểm tra đạo văn Turnitin/TCU: ${milestoneSubmitted.plagiarism_check.similarity_score}% (Chuẩn < 20%)`);

  // 2.4 Gán hội đồng và chấm bảo vệ khóa luận
  // Lấy thesis mẫu có sẵn hội đồng để chấm điểm hội đồng
  const initialThesis = graduationThesisService.listTheses().find(t => t.id === 'thesis_2026_001');
  assert(initialThesis && initialThesis.defense_council, 'Khóa luận mẫu đã sẵn sàng Hội đồng bảo vệ gồm 4 thành viên');

  const gradedThesis = graduationThesisService.submitCouncilGrading(initialThesis.id, {
    CHAIRMAN: { research: 9.5, presentation: 9.0, qa: 9.5 },
    SECRETARY: { research: 9.0, presentation: 9.0, qa: 9.0 },
    REVIEWER_1: { research: 9.5, presentation: 9.5, qa: 9.0 },
    REVIEWER_2: { research: 9.0, presentation: 9.0, qa: 9.5 }
  });

  assert(gradedThesis.status === 'DEFENDED_PASSED', 'Hội đồng thông qua kết quả bảo vệ khóa luận');
  assert(gradedThesis.defense_council.final_grade >= 9.0 && gradedThesis.defense_council.academic_rank === 'XUẤT SẮC', `Điểm tốt nghiệp Hội đồng: ${gradedThesis.defense_council.final_grade} (Xếp loại: ${gradedThesis.defense_council.academic_rank})`);
  assert(gradedThesis.defense_council.defense_minutes && gradedThesis.defense_council.defense_minutes.minutes_code.startsWith('BB-BVKL-'), `Lập Biên bản bảo vệ số chính thức: ${gradedThesis.defense_council.defense_minutes.minutes_code}`);
} catch (err) {
  console.error('Lỗi kiểm thử Khóa luận:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử Khóa luận tốt nghiệp');
}

console.log('\n-------------------------------------------------------------');

// -------------------------------------------------------------
// 3. KIỂM THỬ XẾP LỊCH THI THÔNG MINH (CONSTRAINT ENGINE)
// -------------------------------------------------------------
console.log('🤖 3. KIỂM THỬ ĐỘNG CƠ TỰ ĐỘNG XẾP LỊCH THI & CÁN BỘ COI THI');
try {
  const scheduleResult = examSchedulerService.generateSchedule({
    startDate: '2026-11-02',
    examDays: 5
  });

  assert(scheduleResult.success, 'Động cơ xếp lịch thi chạy thành công');
  assert(scheduleResult.totalScheduled === 6, `Xếp lịch hoàn tất cho 6/6 học phần đăng ký`);
  assert(scheduleResult.conflictCount === 0, 'Giải quyết hoàn toàn xung đột (0 conflicts)');

  // Kiểm tra Ràng buộc 1: Chống trùng phòng thi (cùng ngày + cùng giờ bắt đầu + cùng phòng)
  const roomSlots = new Set();
  let roomConflict = false;
  scheduleResult.schedules.forEach(s => {
    const key = `${s.exam_date}_${s.start_time}_${s.room_code}`;
    if (roomSlots.has(key)) roomConflict = true;
    roomSlots.add(key);
  });
  assert(!roomConflict, 'Ràng buộc Cứng 1: 0% trùng phòng thi trong cùng ca');

  // Kiểm tra Ràng buộc 2: Chống trùng ca thi của cùng một khóa sinh viên
  const cohortSlots = new Set();
  let cohortConflict = false;
  scheduleResult.schedules.forEach(s => {
    const key = `${s.exam_date}_${s.start_time}_${s.cohort}`;
    if (cohortSlots.has(key)) cohortConflict = true;
    cohortSlots.add(key);
  });
  assert(!cohortConflict, 'Ràng buộc Cứng 2: 0% sinh viên cùng khóa bị thi 2 môn trong cùng một ca');

  // Kiểm tra Ràng buộc 3: Cán bộ coi thi độc lập và không tự coi thi môn của mình
  let selfProctoring = false;
  let proctorDuplicate = false;
  scheduleResult.schedules.forEach(s => {
    if (s.proctor_1 === s.proctor_2) proctorDuplicate = true;
    // Kiểm tra Giảng viên TS. Hoàng Đức Em không được coi môn IT101 hay IT201
    if ((s.course_code === 'IT101' || s.course_code === 'IT201') &&
        (s.proctor_1.includes('Hoàng Đức Em') || s.proctor_2.includes('Hoàng Đức Em'))) {
      selfProctoring = true;
    }
  });
  assert(!proctorDuplicate, 'Ràng buộc Cứng 3A: Mỗi phòng có 02 Cán bộ Coi thi hoàn toàn độc lập');
  assert(!selfProctoring, 'Ràng buộc Cứng 3B: Tuyệt đối không có tình trạng Giảng viên tự coi thi môn mình dạy');

  console.log('  📊 Phân bổ tải coi thi giữa các Giảng viên:');
  Object.entries(scheduleResult.invigilatorLoadStats).forEach(([name, count]) => {
    console.log(`     • ${name}: ${count} ca coi thi`);
  });
} catch (err) {
  console.error('Lỗi kiểm thử Xếp lịch thi:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử Xếp lịch thi');
}

console.log('\n================================================================');
console.log(`🏁 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TIÊU CHÍ ĐẠT (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
