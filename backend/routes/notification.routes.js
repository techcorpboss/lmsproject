// backend/routes/notification.routes.js
// Routes for Notification & Academic Alerts System
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// GET /api/notifications - Lấy danh sách thông báo và thống kê theo người dùng/vai trò
router.get('/', notificationController.getNotifications);

// PUT /api/notifications/read-all - Đánh dấu tất cả thông báo là đã đọc
router.put('/read-all', notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Đánh dấu một thông báo đã đọc
router.put('/:id/read', notificationController.markAsRead);

// POST /api/notifications - Phát thông báo mới / Cảnh báo học vụ (Admin & Giảng viên)
router.post('/', notificationController.createNotification);

// DELETE /api/notifications/:id - Xóa thông báo
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
