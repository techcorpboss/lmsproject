// test_phase3_upgrades.js
// Kịch bản Kiểm thử Tự động Toàn diện Giai đoạn 3: EdTech Thế Hệ Mới & Đạt Chuẩn Toàn Cầu
const aiTutorService = require('./backend/services/aiTutorService');
const tuitionPaymentService = require('./backend/services/tuitionPaymentService');
const pushService = require('./backend/services/pushNotificationService');
const openBadgesService = require('./backend/services/openBadgesService');

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
console.log('🧪 BẮT ĐẦU KIỂM THỬ GIAI ĐOẠN 3: EDTECH THẾ HỆ MỚI & CHUẨN TOÀN CẦU');
console.log('================================================================\n');

// -------------------------------------------------------------
// 1. KIỂM THỬ TRỢ LÝ GIA SƯ AI HỌC THUẬT (RAG AI COURSE TUTOR)
// -------------------------------------------------------------
console.log('🤖 1. KIỂM THỬ TRỢ LÝ GIA SƯ AI BÁM SÁT GIÁO TRÌNH (RAG AI TUTOR)');
try {
  // 1.1 Kiểm tra truy xuất danh mục câu hỏi gợi ý theo tuần
  const prompts = aiTutorService.getPrompts({ courseCode: 'IT101', week: 8 });
  assert(prompts && prompts.suggestedQuestions.length >= 2, 'Truy xuất thành công câu hỏi gợi ý bám sát Tuần 8 (Con trỏ & Quản lý bộ nhớ)');

  // 1.2 Hỏi đáp về Con trỏ & Quản lý Bộ nhớ C++ (Kiểm tra Sinh Code & Trích dẫn)
  const q1 = aiTutorService.answerStudentQuestion({
    studentId: 1,
    studentName: 'Trần Văn Nam',
    courseCode: 'IT101',
    week: 8,
    question: 'Làm sao để tránh rò rỉ bộ nhớ (Memory Leak) khi sử dụng con trỏ trong C++?'
  });
  assert(q1.success && q1.codeSnippet.includes('unique_ptr'), 'Gia sư AI giải thích chính xác nguyên lý RAII & Smart Pointers (std::unique_ptr)');
  assert(q1.referenceBook.includes('Nhập môn Lập trình C/C++'), 'Gia sư AI tự động trích dẫn chuẩn xác giáo trình tuần học tương ứng');

  // 1.3 Hỏi đáp về Hàm ảo & Tính Đa hình OOP
  const q2 = aiTutorService.answerStudentQuestion({
    studentId: 1,
    studentName: 'Trần Văn Nam',
    courseCode: 'IT101',
    week: 12,
    question: 'Tại sao hàm hủy của lớp cơ sở trong C++ phải là virtual?'
  });
  assert(q2.success && q2.answer.includes('Virtual Destructor') && q2.codeSnippet.includes('virtual ~Base()'), 'Gia sư AI phân tích chính xác cơ chế Virtual Destructor và bảng vtable');

  // 1.4 Hỏi đáp về SQL & Chuẩn hóa CSDL (Học phần IT201)
  const q3 = aiTutorService.answerStudentQuestion({
    studentId: 2,
    studentName: 'Nguyễn Thị Mai',
    courseCode: 'IT201',
    week: 4,
    question: 'Phân biệt mệnh đề WHERE và HAVING trong truy vấn SQL?'
  });
  assert(q3.success && q3.answer.includes('GROUP BY') && q3.codeSnippet.includes('HAVING COUNT'), 'Gia sư AI phân biệt chính xác WHERE (lọc dòng) và HAVING (lọc nhóm sau GROUP BY)');

  // 1.5 Hỏi đáp về Công thức Toán học KaTeX
  const q4 = aiTutorService.answerStudentQuestion({
    studentId: 3,
    studentName: 'Lê Hoàng Cường',
    courseCode: 'MATH101',
    week: 2,
    question: 'Định lý cơ bản của giải tích và công thức tích phân xác định?'
  });
  assert(q4.success && q4.mathLatex && q4.mathLatex.includes('\\int_{a}^{b}'), 'Gia sư AI kết xuất chuẩn công thức Toán học KaTeX LaTeX');
} catch (err) {
  console.error('Lỗi kiểm thử AI Tutor:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử AI Tutor');
}

console.log('\n-------------------------------------------------------------');

// -------------------------------------------------------------
// 2. KIỂM THỬ CỔNG THANH TOÁN VIETQR NAPAS 24/7 & HÓA ĐƠN ĐIỆN TỬ
// -------------------------------------------------------------
console.log('💳 2. KIỂM THỬ CỔNG THANH TOÁN HỌC PHÍ VIETQR & HÓA ĐƠN ĐIỆN TỬ (TT 78)');
try {
  // 2.1 Truy xuất danh sách hóa đơn công nợ
  const invoices = tuitionPaymentService.getInvoices();
  assert(invoices && invoices.length >= 2, 'Hệ thống quản lý đầy đủ danh mục phiếu thu học phí & lệ phí');

  // 2.2 Sinh mã VietQR động chuẩn NAPAS 24/7
  const qrGen = tuitionPaymentService.generateVietQr('INV-2026-002');
  assert(qrGen.success && qrGen.qrImageUrl.includes('vietqr.io'), 'Sinh đường dẫn mã QR động chuẩn Quốc gia VietQR NAPAS 24/7');
  assert(qrGen.bankInfo.bankName.includes('VietinBank') && qrGen.transferMemo.includes('INV-2026-002'), 'Nội dung chuyển khoản chứa mã hóa đơn và số tài khoản chính thức của Trường');

  // 2.3 Xử lý Webhook IPN Đối soát tự động (Instant Payment Notification)
  const ipnResult = tuitionPaymentService.processIpnWebhook({
    transactionId: 'FT262899881122',
    invoiceId: 'INV-2026-002',
    amount: 3350000
  });
  assert(ipnResult.success && ipnResult.invoice.status === 'PAID', 'Đối soát Webhook IPN ngân hàng thành công: Hóa đơn được chuyển trạng thái PAID');
  assert(ipnResult.invoice.einvoiceNumber.startsWith('HDDT-TCU-'), `Tự động phát hành Hóa đơn điện tử số: ${ipnResult.invoice.einvoiceNumber}`);

  // 2.4 Kiểm tra trích xuất Hóa đơn điện tử chuẩn Thông tư 78/2021/TT-BTC
  const einvoice = tuitionPaymentService.getEInvoice('INV-2026-002');
  assert(einvoice.success && einvoice.einvoice.seller.taxCode === '0109998888', 'Hóa đơn điện tử chứa đầy đủ Mã số thuế đơn vị phát hành');
  assert(einvoice.einvoice.digitalSignature && einvoice.einvoice.items.length === 3, 'Hóa đơn điện tử được ký số bảo mật và liệt kê chi tiết từng khoản học phí');
} catch (err) {
  console.error('Lỗi kiểm thử Cổng Thanh toán:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử Cổng Thanh toán VietQR');
}

console.log('\n-------------------------------------------------------------');

// -------------------------------------------------------------
// 3. KIỂM THỬ THÔNG BÁO ĐẨY WEB PUSH & HUY HIỆU SỐ OPEN BADGES V3.0
// -------------------------------------------------------------
console.log('📲 3. KIỂM THỬ WEB PUSH NOTIFICATION & OPEN BADGES V3.0');
try {
  // 3.1 Kiểm tra VAPID Key của Web Push Notification
  const vapidKey = pushService.getVapidPublicKey();
  assert(vapidKey && vapidKey.length > 30, 'Cung cấp VAPID Public Key hợp lệ cho thiết bị PWA');

  // 3.2 Đăng ký thiết bị và tạo payload thông báo đẩy
  const pushPayload = pushService.createPayload('EXAM_SCHEDULE', {
    subjectName: 'Cơ sở Dữ liệu (IT201)',
    startTime: '09:30',
    examDate: '02/11/2026',
    roomCode: 'PHÒNG-LAB-101',
    scheduleId: 1
  });
  assert(pushPayload.notification && pushPayload.notification.title.includes('LỊCH THI'), 'Chuẩn hóa định dạng Web Push Notification cho ca thi khẩn');

  // 3.3 Huy hiệu số chuẩn quốc tế 1EdTech Open Badges v3.0 & W3C Verifiable Credentials
  const badgeClasses = openBadgesService.getBadgeClasses();
  assert(badgeClasses.length >= 4, 'Định nghĩa 4 hạng mục Huy hiệu năng lực số học thuật');

  const issueRes = openBadgesService.issueBadge('TCU-BADGE-EXCELLENCE', {
    studentId: 1,
    studentCode: '261IT001',
    studentName: 'Trần Văn Nam',
    email: 'nam.tv@techcorp.edu.vn'
  }, {
    courseName: 'Cử nhân Kỹ thuật Phần mềm K66',
    scoreText: 'GPA 3.90/4.00 (Thủ khoa Học kỳ)',
    decisionNo: 'QĐ-88/QĐ-TCU'
  });
  assert(issueRes.assertionId && issueRes.proof && issueRes.proof.jws, 'Huy hiệu số được gắn chữ ký số JWS mật mã chống giả mạo');

  const verify = openBadgesService.verifyBadge(issueRes.assertionId);
  assert(verify.isValid === true && verify.status === 'VERIFIED_OFFICIAL', 'Xác minh công khai QR Code tính pháp lý của Huy hiệu số thành công');
} catch (err) {
  console.error('Lỗi kiểm thử Web Push & Badges:', err);
  assert(false, 'Ngoại lệ xảy ra trong kiểm thử Web Push & Badges');
}

console.log('\n================================================================');
console.log(`🏁 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TIÊU CHÍ ĐẠT (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
