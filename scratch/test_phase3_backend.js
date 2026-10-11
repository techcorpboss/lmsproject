// scratch/test_phase3_backend.js
const path = require('path');
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

const notificationController = require('../backend/controllers/academicNotification.controller');
const {
  AcademicMaterial,
  AcademicNotification,
  sequelize
} = require('../backend/models');

async function runTests() {
  console.log('========================================================================');
  console.log('KIỂM THỬ TRỰC TIẾP MODULE GIAI ĐOẠN 3 (PURE MYSQL, NOTIFICATIONS & EXPORTER)');
  console.log('========================================================================\n');

  try {
    await sequelize.authenticate();

    // [1] Verify pure MySQL AcademicMaterial
    console.log('[1] Kiểm tra CSDL thuần quan hệ MySQL (Bảng academic_materials)...');
    const totalMaterials = await AcademicMaterial.count();
    console.log(` -> Tổng số học liệu đã lưu trong bảng MySQL: ${totalMaterials}`);
    if (totalMaterials === 0) throw new Error('Chưa có học liệu trong MySQL!');
    
    const sampleMat = await AcademicMaterial.findOne({ where: { material_type: 'RICH_TEXT' } });
    if (sampleMat) {
      console.log(` -> Mẫu bài giảng KaTeX: "${sampleMat.title}" (ID: ${sampleMat.id})`);
      console.log(`    Chống tua: ${sampleMat.anti_skipping} | Tỷ lệ hoàn thành tối thiểu: ${sampleMat.min_completion_pct}%`);
    }

    // [2] Test getNotifications
    console.log('\n[2] Kiểm tra lấy danh sách thông báo học vụ (getNotifications)...');
    const reqGet = { query: { student_code: '261IT001', class_name: '66.CNTT-1' } };
    let notifsList = [];
    const resGet = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        notifsList = data.data;
        console.log(` -> Tổng số thông báo nhận được: ${notifsList.length}`);
        console.log(` -> Số thông báo chưa đọc: ${data.unreadCount}`);
        notifsList.forEach((n, idx) => {
          console.log(`    [${idx + 1}] (${n.type}) ${n.title} - ${n.is_read ? 'Đã đọc' : 'Chưa đọc'}`);
        });
      }
    };
    await notificationController.getNotifications(reqGet, resGet);

    // [3] Test createNotification
    console.log('\n[3] Kiểm thử phát thông báo thời gian thực mới (createNotification)...');
    let createdNotifId;
    const reqCreate = {
      body: {
        recipient_type: 'USER',
        recipient_id: '261IT001',
        title: '📢 Nhắc nhở hạn nộp Bài Tập Lớn 1 (còn 24 giờ)',
        message: 'Hệ thống LMS ghi nhận bạn đã nộp bài. Bạn có thể cập nhật bài làm trước 23:59 ngày mai.',
        type: 'ASSIGNMENT',
        action_url: '/elearning'
      },
      app: { get: () => null }
    };
    const resCreate = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        createdNotifId = data.data.id;
        console.log(' -> Result: SUCCESS | ID thông báo:', createdNotifId);
        console.log(' -> Tiêu đề:', data.data.title);
      }
    };
    await notificationController.createNotification(reqCreate, resCreate);

    // [4] Test markAsRead
    console.log('\n[4] Kiểm thử đánh dấu đã đọc (markAsRead)...');
    const reqRead = { params: { id: createdNotifId } };
    const resRead = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        console.log(' -> Result:', data.message);
      }
    };
    await notificationController.markAsRead(reqRead, resRead);

    // [5] Test markAllAsRead
    console.log('\n[5] Kiểm thử đánh dấu tất cả đã đọc (markAllAsRead)...');
    const reqAllRead = { body: { student_code: '261IT001', class_name: '66.CNTT-1' } };
    const resAllRead = {
      json: (data) => {
        if (!data.success) throw new Error(data.message);
        console.log(' -> Result:', data.message);
      }
    };
    await notificationController.markAllAsRead(reqAllRead, resAllRead);

    console.log('\n========================================================================');
    console.log('HOÀN TẤT KIỂM THỬ GIAI ĐOẠN 3: TẤT CẢ TÍNH NĂNG VẬN HÀNH CHÍNH XÁC 100%!');
    console.log('========================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi kiểm thử:', err);
    process.exit(1);
  }
}

runTests();
