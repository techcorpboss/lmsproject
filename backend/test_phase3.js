// backend/test_phase3.js
// Bộ kiểm thử tự động Giai đoạn 3: EdTech Thế Hệ Mới & Đạt Chuẩn Toàn Cầu
'use strict';

const pushService = require('./services/pushNotificationService');
const openBadgesService = require('./services/openBadgesService');

async function runPhase3Tests() {
  console.log('================================================================');
  console.log('   BẮT ĐẦU KIỂM THỬ GIAI ĐOẠN 3: EDTECH THẾ HỆ MỚI & TOÀN CẦU');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extraInfo = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${extraInfo}`);
      failed++;
    }
  }

  // ----------------------------------------------------------------
  // 1. KIỂM THỬ THÔNG BÁO ĐẨY WEB PUSH & BROKER SỰ KIỆN HỌC VỤ
  // ----------------------------------------------------------------
  console.log('1. KIỂM THỬ ĐỘNG CƠ THÔNG BÁO ĐẨY WEB PUSH (pushNotificationService):');

  // Kiểm tra VAPID Public Key
  const vapidKey = pushService.getVapidPublicKey();
  assert(vapidKey && vapidKey.length > 30, 'Cung cấp VAPID Public Key hợp lệ cho client subscribe');

  // Đăng ký thiết bị nhận thông báo đẩy
  const mockSub = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/mock_device_token_xyz_123',
    keys: {
      p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t0Ppk6CmdukIAZhhLFXICqE6SlG',
      auth: 'tBHItJI5svbpez7KI4CCXg'
    }
  };

  const regResult = pushService.registerSubscription(mockSub, {
    id: 1,
    name: 'Trần Văn Nam',
    role: 'STUDENT'
  });
  assert(regResult.success && regResult.subId, 'Đăng ký Push Subscription cho thiết bị học viên thành công');

  // Kiểm thử tạo Payload cho 4 sự kiện học vụ chuẩn Bộ GD&ĐT
  const examPayload = pushService.createPayload('EXAM_SCHEDULE', {
    subjectName: 'Nhập môn Lập trình C/C++',
    startTime: '08:00',
    examDate: '15/10/2026',
    roomCode: 'ROOM-P01',
    scheduleId: 101
  });
  assert(examPayload.notification.title.includes('LỊCH THI') && examPayload.notification.data.url.includes('/online-exam/101'), 'Tạo chuẩn payload thông báo Lịch thi khẩn cấp');

  const gradePayload = pushService.createPayload('GRADE_PUBLISHED', {
    courseName: 'Cấu trúc dữ liệu & Giải thuật',
    totalScore10: '9.35',
    score4: '4.0',
    rank: 'A+',
    sectionId: 12
  });
  assert(gradePayload.notification.title.includes('CÔNG BỐ ĐIỂM') && gradePayload.notification.body.includes('9.35/10'), 'Tạo chuẩn payload thông báo Công bố Điểm học phần');

  const alertPayload = pushService.createPayload('ACADEMIC_ALERT', {
    message: 'Chuyên cần học phần đạt 75% (< 80%). Nguy cơ bị cấm thi theo TT 08/2021.'
  });
  assert(alertPayload.notification.title.includes('CẢNH BÁO HỌC VỤ'), 'Tạo chuẩn payload Cảnh báo học vụ theo Thông tư 08');

  // Phát sóng thông báo đẩy (Broadcast)
  const broadcastResult = await pushService.broadcastNotification('GRADE_PUBLISHED', {
    courseName: 'Trí tuệ nhân tạo chuyên sâu',
    totalScore10: '9.5',
    rank: 'A+'
  }, 'ALL');
  assert(broadcastResult.success && broadcastResult.data.recipientsCount >= 1, 'Phát sóng Broadcast thông báo đẩy thành công đến các thiết bị');

  const history = pushService.getHistory();
  assert(history.length >= 1 && history[0].title.includes('CÔNG BỐ ĐIỂM'), 'Ghi nhận đầy đủ lịch sử phát sóng thông báo học vụ');

  // ----------------------------------------------------------------
  // 2. KIỂM THỬ HUY HIỆU SỐ CHUẨN QUỐC TẾ 1EDTECH OPEN BADGES V3.0
  // ----------------------------------------------------------------
  console.log('\n2. KIỂM THỬ HUY HIỆU SỐ 1EDTECH OPEN BADGES V3.0 (openBadgesService):');

  // Lấy danh mục BadgeClass
  const badgeClasses = openBadgesService.getBadgeClasses();
  assert(badgeClasses.length >= 4, 'Định nghĩa đầy đủ 4 hạng mục Huy hiệu năng lực số học thuật');

  const hasAunQaBadge = badgeClasses.some(b => b.code === 'TCU-BADGE-AUN-QA');
  assert(hasAunQaBadge, 'Có huy hiệu Chuẩn kiểm định chất lượng AUN-QA 4.0 & ABET');

  // Cấp huy hiệu số cho sinh viên
  const newAssertion = openBadgesService.issueBadge('TCU-BADGE-EXCELLENCE', {
    studentId: 2,
    studentCode: '261IT002',
    studentName: 'Nguyễn Thị Mai',
    email: 'mai.nt@techcorp.edu.vn'
  }, {
    courseName: 'Chương trình Cử nhân Khoa học Máy tính K66',
    scoreText: 'CPA 3.92/4.00 (Thủ khoa Xuất sắc)',
    decisionNo: 'QĐ-108/QĐ-TCU'
  });

  assert(newAssertion.assertionId && newAssertion.type.includes('OpenBadgeCredential'), 'Cấp huy hiệu số chuẩn W3C Verifiable Credentials & Open Badges v3.0');
  assert(newAssertion.proof && newAssertion.proof.jws, 'Gắn chữ ký số mật mã học thuật JWS (HMAC-SHA256) chống giả mạo');
  assert(newAssertion.recipient.hashed === true && newAssertion.recipient.identity.startsWith('sha256$'), 'Mã hóa định danh người nhận bảo vệ quyền riêng tư (PDPD)');

  // Thẩm tra xác minh huy hiệu hợp lệ (Public QR Verify)
  const verifyValid = openBadgesService.verifyBadge(newAssertion.assertionId);
  assert(verifyValid.isValid === true && verifyValid.status === 'VERIFIED_OFFICIAL', 'Xác minh thành công chữ ký số và tính pháp lý của huy hiệu');

  // Thẩm tra huy hiệu không tồn tại hoặc bị can thiệp
  const verifyFake = openBadgesService.verifyBadge('TCU-BADGE-FAKE-999');
  assert(verifyFake.isValid === false && verifyFake.status === 'REVOKED_OR_NOT_FOUND', 'Phát hiện và từ chối mã huy hiệu không hợp lệ');

  // Truy xuất danh sách huy hiệu của sinh viên
  const studentBadges = openBadgesService.getBadgesByStudent(2, '261IT002');
  assert(studentBadges.length >= 1, 'Truy xuất chính xác danh sách huy hiệu số cá nhân của người học');

  // ----------------------------------------------------------------
  // 3. KIỂM THỬ THUẬT TOÁN TIẾP CẬN WEB CHUẨN QUỐC TẾ W3C WCAG 2.1 LEVEL AA
  // ----------------------------------------------------------------
  console.log('\n3. KIỂM THỬ CHUẨN TIẾP CẬN WEB W3C WCAG 2.1 LEVEL AA:');

  /**
   * Tính độ sáng tương đối (Relative Luminance) theo chuẩn W3C WCAG 2.1
   */
  function getRelativeLuminance(r, g, b) {
    const sRGB = [r, g, b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  /**
   * Tính tỷ lệ tương phản màu (Contrast Ratio)
   */
  function getContrastRatio(rgb1, rgb2) {
    const l1 = getRelativeLuminance(...rgb1);
    const l2 = getRelativeLuminance(...rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // 1. Kiểm tra Chế độ Vàng trên Nền Đen (Yellow #FFFF00 on Black #000000)
  const yellowOnBlackRatio = getContrastRatio([255, 255, 0], [0, 0, 0]);
  assert(yellowOnBlackRatio >= 19.0, `Chế độ Trợ năng Vàng/Đen đạt tương phản cực đại: ${yellowOnBlackRatio.toFixed(2)}:1 (Vượt chuẩn WCAG AA 4.5:1)`);

  // 2. Kiểm tra Chế độ Trắng trên Nền Xanh Đậm TCU Brand (White #FFFFFF on #002B66)
  const whiteOnNavyRatio = getContrastRatio([255, 255, 255], [0, 43, 102]);
  assert(whiteOnNavyRatio >= 4.5, `Chữ Trắng trên Nền Xanh Thương Hiệu TCU đạt tương phản cao: ${whiteOnNavyRatio.toFixed(2)}:1 (Vượt chuẩn WCAG AA 4.5:1)`);


  // 3. Kiểm tra Chế độ Trắng trên Đen (White on Black)
  const whiteOnBlackRatio = getContrastRatio([255, 255, 255], [0, 0, 0]);
  assert(whiteOnBlackRatio === 21.0, `Chế độ Dark Contrast đạt điểm tuyệt đối W3C: ${whiteOnBlackRatio.toFixed(2)}:1`);

  // ----------------------------------------------------------------
  // TỔNG KẾT
  // ----------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`   KẾT QUẢ KIỂM THỬ GIAI ĐOẠN 3: ${passed} PASS, ${failed} FAIL`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase3Tests().catch(err => {
  console.error('Lỗi kiểm thử Giai đoạn 3:', err);
  process.exit(1);
});
