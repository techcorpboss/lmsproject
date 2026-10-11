// backend/controllers/academicNotification.controller.js
// 🔔 Trung Tâm Thông Báo Đẩy Thời Gian Thực (Real-time Notification Center)
const { AcademicNotification } = require('../models');

// 1. Lấy danh sách thông báo cho sinh viên / giảng viên
exports.getNotifications = async (req, res) => {
  try {
    const studentCode = req.query.student_code || (req.user && req.user.student_code) || '261IT001';
    const className = req.query.class_name || '66.CNTT-1';

    // Tìm thông báo riêng cho SV này, cho cả Lớp, hoặc cho Toàn trường
    const notifications = await AcademicNotification.findAll({
      where: {
        recipient_id: [studentCode, className, 'ALL']
      },
      order: [['created_at', 'DESC']],
      limit: 30
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return res.json({
      success: true,
      unreadCount,
      data: notifications
    });
  } catch (err) {
    console.error('Lỗi getNotifications:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Đánh dấu 1 thông báo là đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await AcademicNotification.findByPk(id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
    }

    await notif.update({ is_read: true });
    return res.json({ success: true, message: 'Đã đánh dấu thông báo là đã đọc' });
  } catch (err) {
    console.error('Lỗi markAsRead:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = async (req, res) => {
  try {
    const studentCode = req.body.student_code || '261IT001';
    const className = req.body.class_name || '66.CNTT-1';

    await AcademicNotification.update(
      { is_read: true },
      {
        where: {
          recipient_id: [studentCode, className, 'ALL'],
          is_read: false
        }
      }
    );

    return res.json({ success: true, message: 'Đã đánh dấu tất cả thông báo là đã đọc' });
  } catch (err) {
    console.error('Lỗi markAllAsRead:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Tạo thông báo mới (hệ thống hoặc giảng viên phát đi)
exports.createNotification = async (req, res) => {
  try {
    const {
      recipient_type = 'USER',
      recipient_id = 'ALL',
      title,
      message,
      type = 'SYSTEM',
      action_url = '/elearning'
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung là bắt buộc' });
    }

    const notif = await AcademicNotification.create({
      recipient_type,
      recipient_id,
      title,
      message,
      type,
      action_url,
      is_read: false
    });

    // Bắn realtime qua Socket.io nếu app đã khởi tạo io
    const io = req.app.get('io');
    if (io) {
      io.emit('new_academic_notification', notif);
    }

    return res.json({
      success: true,
      message: 'Đã phát thông báo thời gian thực thành công!',
      data: notif
    });
  } catch (err) {
    console.error('Lỗi createNotification:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
