// backend/routes/notification.routes.js
// Routes cho Web Push Notifications & Broadcast Thông Báo Học Vụ Thời Gian Thực
const express = require('express');
const router = express.Router();
const pushService = require('../services/pushNotificationService');
const { protect } = require('../middleware/auth');

// GET /api/notifications/vapid-key (Lấy Public Key để client đăng ký Web Push)
router.get('/vapid-key', (req, res) => {
  res.json({
    success: true,
    publicKey: pushService.getVapidPublicKey()
  });
});

// POST /api/notifications/subscribe (Đăng ký nhận thông báo đẩy từ trình duyệt)
router.post('/subscribe', (req, res) => {
  try {
    const { subscription, user } = req.body;
    const result = pushService.registerSubscription(subscription, user || (req.user ? {
      id: req.user.id,
      name: req.user.name || req.user.full_name,
      role: req.user.role
    } : {}));

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/notifications/unsubscribe (Hủy đăng ký nhận thông báo)
router.post('/unsubscribe', (req, res) => {
  try {
    const { endpoint } = req.body;
    pushService.unregisterSubscription(endpoint);
    res.json({ success: true, message: 'Đã hủy đăng ký nhận thông báo đẩy.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications/broadcast (Phát sóng thông báo đẩy - Dành cho Quản trị viên / Giảng viên)
router.post('/broadcast', async (req, res) => {
  try {
    const { eventType, data, targetRole } = req.body;
    if (!eventType) {
      return res.status(400).json({ success: false, message: 'Thiếu loại sự kiện thông báo (eventType).' });
    }

    const result = await pushService.broadcastNotification(eventType, data || {}, targetRole);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi phát sóng thông báo: ' + err.message });
  }
});

// GET /api/notifications/history (Lấy lịch sử thông báo đã gửi)
router.get('/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const history = pushService.getHistory(limit);
    res.json({ success: true, count: history.length, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
