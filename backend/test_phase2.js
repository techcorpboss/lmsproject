// backend/test_phase2.js
// Bộ kiểm thử tự động Giai đoạn 2 LMS Chuẩn MOET & Quốc tế
'use strict';

const cacheService = require('./services/cacheService');
const digitalSignatureService = require('./services/digitalSignatureService');
const virtualClassroomService = require('./services/virtualClassroomService');
const sebConfigService = require('./services/sebConfigService');

async function runPhase2Tests() {
  console.log('================================================================');
  console.log('   BẮT ĐẦU KIỂM THỬ GIAI ĐOẠN 2: LMS CHUẨN MOET & QUỐC TẾ');
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
  // 1. KIỂM THỬ BỘ ĐỆM CACHING HIỆU NĂNG CAO (Redis / In-Memory LRU)
  // ----------------------------------------------------------------
  console.log('1. KIỂM THỬ BỘ ĐỆM CACHING HIỆU NĂNG CAO (CacheService):');

  await cacheService.set('test:course:101', { name: 'Lập trình Web nâng cao', credits: 3 }, 10);
  const cachedVal = await cacheService.get('test:course:101');
  assert(cachedVal && cachedVal.name === 'Lập trình Web nâng cao', 'Lưu và lấy dữ liệu thành công từ Cache');

  // Kiểm tra Remember pattern (Cache-Aside)
  let dbCallCount = 0;
  const rememberVal = await cacheService.remember('test:calc:sum', 10, async () => {
    dbCallCount++;
    return 100 + 200;
  });
  assert(rememberVal === 300 && dbCallCount === 1, 'Cache-Aside remember() gọi hàm tạo lần đầu');

  const cachedRememberVal = await cacheService.remember('test:calc:sum', 10, async () => {
    dbCallCount++;
    return 999;
  });
  assert(cachedRememberVal === 300 && dbCallCount === 1, 'Cache-Aside remember() trả về dữ liệu đệm mà không gọi lại DB');

  // Thống kê Cache
  const stats = cacheService.getStats();
  assert(stats.hits_count >= 1 && stats.total_cached_keys >= 2, 'Ghi nhận đúng thống kê Hits và Dung lượng Cache');


  // Xóa theo tiền tố
  await cacheService.clearPrefix('test:');
  const afterClear = await cacheService.get('test:course:101');
  assert(afterClear === null, 'Xóa sạch các key theo tiền tố prefix thành công');

  // ----------------------------------------------------------------
  // 2. KIỂM THỬ CHỮ KÝ SỐ PKI BẢNG ĐIỂM (TT 41/2017/TT-BTTTT & TT 08/2021)
  // ----------------------------------------------------------------
  console.log('\n2. KIỂM THỬ CHỮ KÝ SỐ PKI BẢNG ĐIỂM (DigitalSignatureService):');

  const sampleGradebook = {
    section_id: 'SEC_CS101_2026',
    course_code: 'CS101',
    course_name: 'Cấu trúc dữ liệu & Giải thuật',
    semester: 'Học kỳ 1',
    academic_year: '2026-2027',
    grades: [
      { student_id: 1, student_code: 'SV001', full_name: 'Nguyễn Văn An', attendance_score: 9.0, midterm_score: 8.5, final_score: 8.0, total_score_10: 8.35, letter_grade: 'B+' },
      { student_id: 2, student_code: 'SV002', full_name: 'Trần Thị Bích', attendance_score: 10.0, midterm_score: 9.0, final_score: 9.5, total_score_10: 9.45, letter_grade: 'A' }
    ]
  };

  const signer = {
    id: 'GV_1001',
    name: 'TS. Nguyễn Văn Hùng',
    title: 'Phó Trưởng khoa CNTT',
    role: 'LECTURER',
    email: 'hung.nv@techcorp.edu.vn',
    department: 'Khoa Công nghệ Thông tin'
  };

  const signatureEnvelope = digitalSignatureService.signGradebook(sampleGradebook, signer);
  assert(signatureEnvelope.algorithm === 'RSA-SHA256' && signatureEnvelope.signature_base64.length > 50, 'Tạo chữ ký số RSA-2048 / SHA-256 thành công');
  assert(signatureEnvelope.signer.name === 'TS. Nguyễn Văn Hùng', 'Thông tin định danh người ký chính xác');

  // Thẩm tra bảng điểm hợp lệ
  const validVerification = digitalSignatureService.verifyGradebookSignature(sampleGradebook, signatureEnvelope);
  assert(validVerification.isValid === true && !validVerification.isTampered, 'Xác minh chữ ký số thành công: Dữ liệu nguyên vẹn 100%');

  // Thẩm tra phát hiện can thiệp điểm số trái phép (Tamper Detection)
  const tamperedGradebook = JSON.parse(JSON.stringify(sampleGradebook));
  tamperedGradebook.grades[0].final_score = 10.0; // Sửa trộm điểm từ 8.0 lên 10.0

  const tamperedVerification = digitalSignatureService.verifyGradebookSignature(tamperedGradebook, signatureEnvelope);
  assert(tamperedVerification.isValid === false && tamperedVerification.isTampered === true, 'Phát hiện can thiệp điểm số trái phép (Tamper Detection kích hoạt)');

  // ----------------------------------------------------------------
  // 3. KIỂM THỬ LỚP HỌC TRỰC TUYẾN THỜI GIAN THỰC (VirtualClassroomService)
  // ----------------------------------------------------------------
  console.log('\n3. KIỂM THỬ LỚP HỌC TRỰC TUYẾN THỜI GIAN THỰC (VirtualClassroomService):');

  const room = virtualClassroomService.createOrGetRoom({
    courseId: 50,
    courseName: 'Trí tuệ nhân tạo chuyên sâu',
    weekIndex: 3,
    title: 'Tuần 3: Mạng nơ-ron học sâu (Deep Learning)',
    instructorId: 'GV_1001',
    instructorName: 'TS. Nguyễn Văn Hùng'
  });
  assert(room.roomId && room.meetingUrl.includes(room.roomId), 'Khởi tạo phòng học trực tuyến thành công');

  // Quyền Giảng viên (Moderator)
  const gvConfig = virtualClassroomService.getRoomAccessConfig(room.roomId, {
    id: 'GV_1001',
    name: 'TS. Nguyễn Văn Hùng',
    role: 'INSTRUCTOR'
  });
  assert(gvConfig.isModerator === true && gvConfig.userRole === 'MODERATOR', 'Phân quyền chính xác: Giảng viên là MODERATOR (quản lý phòng & điểm danh)');

  // Quyền Sinh viên (Attendee)
  const svConfig = virtualClassroomService.getRoomAccessConfig(room.roomId, {
    id: 'SV001',
    name: 'Nguyễn Văn An',
    role: 'STUDENT',
    code: 'SV2026-001'
  });
  assert(svConfig.isModerator === false && svConfig.userRole === 'ATTENDEE', 'Phân quyền chính xác: Sinh viên là ATTENDEE');

  // Báo cáo điểm danh phòng học
  const attendance = virtualClassroomService.getAttendanceReport(room.roomId);
  assert(attendance.totalParticipants === 2 && attendance.students.length === 1, 'Tự động ghi nhận danh sách điểm danh lớp học trực tuyến');

  // ----------------------------------------------------------------
  // 4. KIỂM THỬ KHÓA TRÌNH DUYỆT THI AN TOÀN SAFE EXAM BROWSER (SebConfigService)
  // ----------------------------------------------------------------
  console.log('\n4. KIỂM THỬ SAFE EXAM BROWSER OS-LEVEL LOCKDOWN (SebConfigService):');

  const sebResult = sebConfigService.generateSebConfigFile({
    id: 'CA_THI_2027_01',
    title: 'Thi Cuối kỳ Môn Lập trình Hướng đối tượng'
  });

  assert(sebResult.xmlContent.includes('<!DOCTYPE plist'), 'Xuất cấu hình .seb chuẩn XML Property List');
  assert(sebResult.xmlContent.includes('<key>allowVirtualMachine</key>\n    <false/>'), 'Cấu hình cấm chạy trên Máy ảo (VMware, VirtualBox, Hyper-V)');
  assert(sebResult.xmlContent.includes('<string>TeamViewer.exe</string>') && sebResult.xmlContent.includes('<string>UltraViewer_Desktop.exe</string>'), 'Cấu hình cấm các ứng dụng điều khiển từ xa');

  // Thẩm định Header từ SEB Client
  const mockSebReq = {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 SEB/3.5.0 SafeExamBrowser/3.5.0',
      'x-safeexambrowser-requesthash': 'mock_request_hash_abc123'
    }
  };
  const verifiedSeb = sebConfigService.verifySebRequest(mockSebReq);
  assert(verifiedSeb.isSebBrowser === true && verifiedSeb.isCompliant === true, 'Xác thực thành công Client gửi từ trình duyệt Safe Exam Browser');

  const mockChromeReq = {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
    }
  };
  const verifiedChrome = sebConfigService.verifySebRequest(mockChromeReq);
  assert(verifiedChrome.isSebBrowser === false && verifiedChrome.isCompliant === false, 'Phát hiện và cảnh báo Client duyệt web thông thường chưa khóa hệ thống');

  // ----------------------------------------------------------------
  // TỔNG KẾT
  // ----------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`   KẾT QUẢ KIỂM THỬ GIAI ĐOẠN 2: ${passed} PASS, ${failed} FAIL`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase2Tests().catch(err => {
  console.error('Lỗi khi chạy kiểm thử:', err);
  process.exit(1);
});
