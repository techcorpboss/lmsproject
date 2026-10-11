// backend/routes/academicNotification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/academicNotification.controller');

// Lấy danh sách thông báo
router.get('/', notificationController.getNotifications);

// Đánh dấu 1 thông báo đã đọc
router.post('/:id/read', notificationController.markAsRead);

// Đánh dấu tất cả thông báo đã đọc
router.post('/mark-all-read', notificationController.markAllAsRead);

// Tạo thông báo mới
router.post('/', notificationController.createNotification);

module.exports = router;
