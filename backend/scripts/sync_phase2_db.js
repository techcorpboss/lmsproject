// backend/scripts/sync_phase2_db.js
// 🔄 Script Đồng Bộ CSDL MySQL Cho Giai Đoạn 2 (Assignments & Attendance)
const path = require('path');
const fs = require('fs');

// Nạp biến môi trường từ các đường dẫn tiềm năng
const envCandidates = [
  path.join(__dirname, '..', '.env'),
  path.join(process.cwd(), 'backend', '.env'),
  path.join(process.cwd(), '.env'),
  '/www/wwwroot/lms.techcorp.info.vn/backend/.env'
];

for (const envFile of envCandidates) {
  if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
    console.log(`[ENV] Đã nạp cấu hình từ: ${envFile}`);
    break;
  }
}

// Hỗ trợ truyền password từ CLI nếu cần: node backend/scripts/sync_phase2_db.js [password]
if (process.argv[2]) {
  process.env.DB_PASSWORD = process.argv[2];
}

const {
  sequelize,
  AcademicAssignment,
  AcademicAssignmentSubmission,
  AcademicAttendanceSession,
  AcademicAttendanceRecord
} = require('../models');

async function syncDb() {
  console.log('========================================================================');
  console.log('🔄 ĐỒNG BỘ CSDL MYSQL CHO GIAI ĐOẠN 2 (ASSIGNMENTS, RUBRICS & ATTENDANCE)');
  console.log('========================================================================');
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công!');

    await AcademicAssignment.sync({ alter: true });
    console.log('✅ Bảng academic_assignments: OK');

    await AcademicAssignmentSubmission.sync({ alter: true });
    console.log('✅ Bảng academic_assignment_submissions: OK');

    await AcademicAttendanceSession.sync({ alter: true });
    console.log('✅ Bảng academic_attendance_sessions: OK');

    await AcademicAttendanceRecord.sync({ alter: true });
    console.log('✅ Bảng academic_attendance_records: OK');

    console.log('\n🎉 HOÀN TẤT ĐỒNG BỘ 4 BẢNG GIAI ĐOẠN 2 AN TOÀN VÀO CSDL PRODUCTION!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi đồng bộ DB:', err);
    process.exit(1);
  }
}

syncDb();
