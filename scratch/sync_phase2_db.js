// scratch/sync_phase2_db.js
const path = require('path');
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

const {
  sequelize,
  AcademicAssignment,
  AcademicAssignmentSubmission,
  AcademicAttendanceSession,
  AcademicAttendanceRecord
} = require('../backend/models');

async function syncDb() {
  console.log('--- Đang đồng bộ cấu trúc CSDL cho Giai đoạn 2 (Assignments & Attendance) ---');
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

    console.log('🎉 Hoàn tất đồng bộ 4 bảng Giai đoạn 2 an toàn!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi đồng bộ DB:', err);
    process.exit(1);
  }
}

syncDb();
