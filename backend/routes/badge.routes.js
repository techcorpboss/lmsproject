// backend/routes/badge.routes.js
// Routes cho Hệ thống Cấp Huy hiệu & Chứng chỉ số 1EdTech Open Badges v3.0
const express = require('express');
const router = express.Router();
const badgesService = require('../services/openBadgesService');
const { protect } = require('../middleware/auth');

// GET /api/badges/classes (Danh mục tất cả BadgeClass học thuật)
router.get('/classes', (req, res) => {
  try {
    const classes = badgesService.getBadgeClasses();
    res.json({ success: true, count: classes.length, data: classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/badges/my-badges (Lấy danh sách huy hiệu của sinh viên đang đăng nhập)
router.get('/my-badges', (req, res) => {
  try {
    const studentId = req.user ? req.user.id : (req.query.studentId ? parseInt(req.query.studentId, 10) : 1);
    const studentCode = req.user ? (req.user.student_code || req.user.code) : req.query.studentCode;

    const badges = badgesService.getBadgesByStudent(studentId, studentCode);
    res.json({
      success: true,
      standard: '1EdTech Open Badges v3.0 / W3C Verifiable Credentials',
      count: badges.length,
      data: badges
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/badges/issue (Cấp huy hiệu số cho học viên - Giảng viên / Quản trị viên)
router.post('/issue', (req, res) => {
  try {
    const { badgeCode, student, evidence } = req.body;
    if (!badgeCode || !student) {
      return res.status(400).json({ success: false, message: 'Thiếu mã huy hiệu hoặc thông tin sinh viên.' });
    }

    const assertion = badgesService.issueBadge(badgeCode, student, evidence || {});
    res.json({
      success: true,
      message: 'Cấp huy hiệu số Open Badges v3.0 thành công kèm chữ ký mật mã!',
      assertion
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi cấp huy hiệu số: ' + err.message });
  }
});

// GET /api/badges/assertion/:assertionId (Xuất JSON-LD chuẩn Open Badges v3.0)
router.get('/assertion/:assertionId', (req, res) => {
  try {
    const assertion = badgesService.getAssertion(req.params.assertionId);
    if (!assertion) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin huy hiệu số này.' });
    }

    res.setHeader('Content-Type', 'application/ld+json');
    res.json(assertion);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/badges/verify/:assertionId (Thẩm tra tính xác thực công khai - Không cần login)
router.get('/verify/:assertionId', (req, res) => {
  try {
    const verification = badgesService.verifyBadge(req.params.assertionId);
    res.json({
      success: verification.isValid,
      ...verification
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi thẩm tra huy hiệu: ' + err.message });
  }
});

module.exports = router;
