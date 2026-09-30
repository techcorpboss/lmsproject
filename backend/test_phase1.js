// backend/test_phase1.js
// Kịch bản kiểm thử tự động 5 phân hệ Giai đoạn 1 (Security Hardening & MOET Compliance)
'use strict';

const encryptionService = require('./services/encryptionService');
const totpService = require('./services/totpService');
const curriculumComplianceService = require('./services/curriculumComplianceService');
const hemisExportService = require('./services/hemisExportService');

const schemaIntegrityService = require('./services/schemaIntegrityService');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('KIỂM THỬ TỰ ĐỘNG GIAI ĐOẠN 1: BẢO MẬT & PHÁP LÝ MOET');
  console.log('====================================================\n');

  console.log('0. Đồng bộ cấu trúc bảng và cột CSDL (Self-Healing Schema)...');
  await schemaIntegrityService.ensureAllTablesAndColumns();
  console.log('   -> CSDL đã sẵn sàng 100%!\n');

  // TEST 1: FIELD-LEVEL ENCRYPTION (AES-256-GCM)
  console.log('1. Kiểm thử Mã hóa Mức trường (Field-Level Encryption - PDPD NĐ 13/2023)');
  const sampleCccd = '001204018923';
  const samplePhone = '0987654321';
  const sampleAddress = 'Số 123 Đường Giải Phóng, Hà Nội';

  const encryptedCccd = encryptionService.encrypt(sampleCccd);
  assert(encryptedCccd.startsWith('enc:v1:'), 'Chuỗi mã hóa phải có tiền tố enc:v1:');
  assert(encryptedCccd !== sampleCccd, 'Dữ liệu được mã hóa không chứa plaintext');

  const decryptedCccd = encryptionService.decrypt(encryptedCccd);
  assert(decryptedCccd === sampleCccd, 'Giải mã AES-256-GCM bảo toàn 100% dữ liệu gốc');

  const maskedCccd = encryptionService.maskCccd(sampleCccd);
  assert(maskedCccd.startsWith('0012') && maskedCccd.endsWith('923') && maskedCccd.includes('*'), 'Làm mờ CCCD chuẩn format');

  const maskedPhone = encryptionService.maskPhone(samplePhone);
  assert(maskedPhone.startsWith('098') && maskedPhone.endsWith('321') && maskedPhone.includes('*'), 'Làm mờ SĐT chuẩn format');

  // Kiểm tra giải mã an toàn tương thích ngược với dữ liệu cũ (plaintext)
  const legacyData = '0381928371';
  assert(encryptionService.decrypt(legacyData) === legacyData, 'Dữ liệu cũ chưa mã hóa được bảo toàn an toàn');

  console.log('\n2. Kiểm thử Xác thực 2 Yếu tố (RFC 6238 TOTP Authenticator)');
  const secret = totpService.generateSecret();
  assert(secret && secret.length === 32, 'Sinh Secret Base32 160-bit hợp chuẩn');

  const otp = totpService.generateToken(secret);
  assert(otp && otp.length === 6 && /^\d{6}$/.test(otp), 'Mã OTP sinh ra đúng 6 chữ số');

  const isValidOtp = totpService.verifyToken(otp, secret);
  assert(isValidOtp === true, 'Xác thực mã OTP hợp lệ thành công');

  const isInvalidOtp = totpService.verifyToken('000000', secret);
  assert(isInvalidOtp === false || otp === '000000', 'Mã OTP sai bị từ chối');

  const uri = totpService.generateOtpAuthUri('admin_demo', secret);
  assert(uri.startsWith('otpauth://totp/'), 'Chuỗi URI tương thích Google Authenticator');

  const qrCodeData = await totpService.generateQrCodeDataUrl(uri);
  assert(qrCodeData && qrCodeData.startsWith('data:image/png;base64,'), 'Sinh mã QR Data URL thành công');

  const backupCodes = totpService.generateBackupCodes(8);
  assert(backupCodes.length === 8, 'Khởi tạo đúng 8 mã phục hồi dự phòng');
  const testCode = backupCodes[0].code;
  const backupResult = totpService.verifyAndConsumeBackupCode(testCode, backupCodes);
  assert(backupResult.valid === true, 'Sử dụng mã dự phòng thành công');
  assert(backupResult.updatedCodes[0].used === true, 'Mã dự phòng đã dùng được đánh dấu hủy');

  console.log('\n3. Kiểm thử Kiểm soát Trần 30% Đào tạo Trực tuyến (TT 08/2021 Điều 12)');
  const validationTest = await curriculumComplianceService.validateCourseChange({
    credits: 3,
    teaching_mode: 'TRUC_TIEP',
    major_id: '7480103'
  });
  assert(validationTest && typeof validationTest.allowed === 'boolean', 'Dịch vụ thẩm định trần trả về kết quả hợp lệ');

  console.log('\n4. Kiểm thử Xuất khẩu CSDL Ngành HEMIS (Bộ GD&ĐT)');
  const hemisSummary = await hemisExportService.getHemisSummary();
  assert(hemisSummary.institution_code === 'TCU', 'Mã định danh trường hợp chuẩn');
  assert(hemisSummary.entities.learners !== undefined, 'Thực thể Người học tồn tại trong báo cáo');
  assert(hemisSummary.entities.transcripts !== undefined, 'Thực thể Bảng điểm tồn tại trong báo cáo');

  const learnersExportJson = await hemisExportService.exportEntity('learners', 'json');
  assert(learnersExportJson.format === 'json' && Array.isArray(learnersExportJson.data), 'Xuất gói JSON Người học thành công');

  const gradesExportXlsx = await hemisExportService.exportEntity('grades', 'xlsx');
  assert(gradesExportXlsx.format === 'xlsx' && Buffer.isBuffer(gradesExportXlsx.buffer), 'Xuất file Excel XLSX Bảng điểm chuẩn SheetJS thành công');

  console.log('\n====================================================');
  console.log(`KẾT QUẢ: ĐÃ VƯỢT QUA ${passedTests}/${totalTests} BÀI KIỂM THỬ TỰ ĐỘNG!`);
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('[Test Error]:', err);
  process.exit(1);
});
