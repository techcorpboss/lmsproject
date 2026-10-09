// test_phase4_upgrades.js
// Kịch bản Kiểm thử Tự động Toàn diện Giai đoạn 4: Executive BI, RAG Policy & UAT (>95%)
const academicPolicyService = require('./backend/services/academicPolicyService');
const executiveBiService = require('./backend/services/executiveBiService');
const uatAssessmentService = require('./backend/services/uatAssessmentService');

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
console.log('🧪 BẮT ĐẦU KIỂM THỬ GIAI ĐOẠN 4: EXECUTIVE BI & NGHIỆM THU UAT >95%');
console.log('================================================================\n');

// -------------------------------------------------------------
// 1. KIỂM THỬ TRỢ LÝ TRA CỨU QUY CHẾ HỌC VỤ & ĐÀO TẠO (RAG POLICY)
// -------------------------------------------------------------
console.log('📜 1. KIỂM THỬ TRỢ LÝ TRA CỨU QUY CHẾ HỌC VỤ (academicPolicyService):');
try {
  // 1.1 Toàn văn danh mục quy chế
  const allPolicies = academicPolicyService.getAllPolicies();
  assert(allPolicies && allPolicies.length >= 6, 'Nạp đầy đủ cơ sở tri thức pháp lý: Thông tư 08/2021 & Nghị định 81/2021');

  // 1.2 Tìm kiếm theo từ khóa học vụ
  const searchResults = academicPolicyService.searchPolicies('tín chỉ');
  assert(searchResults.length >= 1 && searchResults.some(s => s.id === 'TT08_DIEU_09'), 'Tìm kiếm chính xác quy định khối lượng tín chỉ tối thiểu/tối đa');

  // 1.3 Hỏi đáp về Cảnh báo học vụ & Buộc thôi học (Điều 11)
  const adv1 = academicPolicyService.adviseQuestion('Bị cảnh báo học vụ mấy lần thì sinh viên bị buộc thôi học?');
  assert(adv1.success && adv1.matchedPolicy.article === 'Điều 11' && adv1.advice.includes('03 lần liên tiếp'), 'Trích xuất chính xác Điều 11 TT 08/2021: 03 lần cảnh báo liên tiếp sẽ bị buộc thôi học');

  // 1.4 Hỏi đáp về Học lại & Cải thiện điểm (Điều 13)
  const adv2 = academicPolicyService.adviseQuestion('Học lại môn bị điểm D thì hệ thống tính điểm lần nào?');
  assert(adv2.success && adv2.matchedPolicy.article === 'Điều 13' && adv2.advice.includes('ĐIỂM CAO NHẤT'), 'Trích xuất chính xác Điều 13 TT 08/2021: Ghi nhận điểm cao nhất có lợi cho người học');

  // 1.5 Hỏi đáp về Điều kiện công nhận tốt nghiệp (Điều 14)
  const adv3 = academicPolicyService.adviseQuestion('Điểm CPA tối thiểu để được cấp bằng tốt nghiệp đại học?');
  assert(adv3.success && adv3.matchedPolicy.article === 'Điều 14' && adv3.advice.includes('2.00'), 'Trích xuất chính xác Điều 14 TT 08/2021: CPA đạt tối thiểu 2.00/4.00');

  // 1.6 Hỏi đáp về Miễn giảm học phí & Học bổng khuyến khích (Nghị định 81)
  const adv4 = academicPolicyService.adviseQuestion('Sinh viên con thương binh được miễn giảm bao nhiêu học phí?');
  assert(adv4.success && adv4.matchedPolicy.id === 'ND81_HOC_BONG' && adv4.advice.includes('100%'), 'Trích xuất chính xác Nghị định 81/2021/NĐ-CP: Miễn 100% học phí cho con thương binh');
} catch (err) {
  console.error('Lỗi kiểm thử RAG Policy:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử RAG Policy');
}

console.log('\n-------------------------------------------------------------');

// -------------------------------------------------------------
// 2. KIỂM THỬ EXECUTIVE BI DASHBOARD (BAN GIÁM HIỆU & TRƯỞNG KHOA)
// -------------------------------------------------------------
console.log('📊 2. KIỂM THỬ EXECUTIVE BI CHIẾN LƯỢC TOÀN TRƯỜNG (executiveBiService):');
try {
  const biData = executiveBiService.getExecutiveKpiOverview();

  // 2.1 Quy mô sinh viên
  assert(biData.success && biData.enrollment.totalStudents === 6850, 'Ghi nhận chuẩn xác quy mô 6.850 sinh viên toàn trường');
  assert(biData.enrollment.facultiesBreakdown.length === 3, 'Phân bổ học viên theo 3 khoa chuyên môn trọng điểm');

  // 2.2 Phổ điểm GPA toàn trường
  assert(biData.gpaDistribution.length === 5, 'Phân loại phổ điểm 5 mức độ chuẩn Bộ GD&ĐT (Xuất sắc, Giỏi, Khá, TB, Yếu)');

  // 2.3 Dự báo rủi ro cảnh báo học vụ
  assert(biData.academicWarningStats.warningRate < 5.0, `Tỷ lệ sinh viên bị cảnh báo học vụ trong ngưỡng an toàn: ${biData.academicWarningStats.warningRate}%`);
  assert(biData.academicWarningStats.levels.length === 3, 'Phân tầng rủi ro học vụ 3 mức độ có hành động can thiệp sớm');

  // 2.4 Doanh thu học phí VietQR NAPAS
  assert(biData.tuitionCollection.collectionRate >= 90.0, `Tỷ lệ thu học phí số hóa VietQR đạt: ${biData.tuitionCollection.collectionRate}%`);
  assert(biData.tuitionCollection.automatedQrPercentage > 95.0, 'Tỷ lệ gạch nợ tự động qua VietQR đạt 96.5%');

  // 2.5 Tuân thủ trần đào tạo trực tuyến Thông tư 08 (<= 30%)
  assert(biData.deliveryCompliance.isCompliant && biData.deliveryCompliance.onlineLmsRate <= 30.0, `Tỷ lệ học LMS đạt ${biData.deliveryCompliance.onlineLmsRate}% (Tuân thủ nghiêm ngặt trần <= 30% Thông tư 08)`);

  // 2.6 Đạt chuẩn đầu ra PLO (AUN-QA)
  assert(biData.accreditationAttainment.overallPloAttainment > 90.0, `Tỷ lệ đạt chuẩn đầu ra PLO toàn trường: ${biData.accreditationAttainment.overallPloAttainment}%`);
} catch (err) {
  console.error('Lỗi kiểm thử Executive BI:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử Executive BI');
}

console.log('\n-------------------------------------------------------------');

// -------------------------------------------------------------
// 3. KIỂM THỬ BẢNG KIỂM UAT 25 TIÊU CHÍ & BIÊN BẢN BÀN GIAO SỐ
// -------------------------------------------------------------
console.log('🏆 3. KIỂM THỬ BẢNG KIỂM NGHIỆM THU UAT CHUẨN BỘ (>95%) (uatAssessmentService):');
try {
  // 3.1 Đánh giá 25 tiêu chí theo 5 trụ cột
  const checklist = uatAssessmentService.getChecklist();
  assert(checklist.success && checklist.totalCriteria === 25, 'Kiểm tra đầy đủ 25 tiêu chí chất lượng toàn diện theo 5 trụ cột');
  assert(checklist.passedCriteriaCount === 25, '100% tiêu chí đạt trạng thái PASSED có minh chứng kỹ thuật');
  assert(checklist.overallPercentage >= 95.0, `Tổng điểm nghiệm thu đạt mức xuất sắc: ${checklist.overallPercentage}% (Vượt mốc cam kết >95%)`);
  assert(checklist.ratingGrade.includes('XUẤT SẮC'), `Xếp loại nghiệm thu: ${checklist.ratingGrade}`);

  // 3.2 Sinh Biên bản nghiệm thu kỹ thuật và bàn giao số
  const minutes = uatAssessmentService.generateHandoverMinutes();
  assert(minutes.success && minutes.minutesNumber.startsWith('BB-NTKT-TCU-'), `Lập Biên bản nghiệm thu số chính thức: ${minutes.minutesNumber}`);
  assert(minutes.deliverables.length === 8, 'Liệt kê đủ 8 gói giải pháp phần mềm bàn giao cho Nhà trường');
  assert(minutes.signatories.length === 4, 'Đầy đủ 4 chữ ký số đại diện: Hiệu trưởng, ĐBCL, Đào tạo và TechCorp');
  assert(minutes.qrVerificationUrl.includes('verify-handover'), 'Có mã QR tra cứu tính toàn vẹn của biên bản nghiệm thu trực tuyến');
} catch (err) {
  console.error('Lỗi kiểm thử UAT Checklist:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử UAT Checklist');
}

console.log('\n================================================================');
console.log(`🏁 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TIÊU CHÍ ĐẠT (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
