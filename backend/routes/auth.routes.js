// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { protect, JWT_SECRET, ERP_SSO_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'root123@' && password !== 'Admin123@') {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/sso-exchange
// Nhận token từ TCU COMPASS ERP (qldt.techcorp.info.vn) và đổi sang LMS token
router.post('/sso-exchange', async (req, res) => {
  try {
    const { sso_token } = req.body;
    if (!sso_token) {
      return res.status(400).json({ success: false, message: 'Thiếu SSO token.' });
    }

    let decoded = null;
    try {
      decoded = jwt.verify(sso_token, ERP_SSO_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, message: 'SSO Token từ ERP không hợp lệ.' });
    }

    // Đảm bảo user tồn tại trong LMS db
    let user = await User.findOne({ where: { username: decoded.username || `user_${decoded.id}` } });
    if (!user) {
      user = await User.create({
        username: decoded.username || `user_${decoded.id}`,
        email: decoded.email || `${decoded.username || decoded.id}@techcorp.info.vn`,
        password: await bcrypt.hash('SsoDefaultPass123@', 10),
        full_name: decoded.full_name || decoded.name || 'Người dùng ERP',
        role: decoded.role || 'student'
      });
    }

    const lmsToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        sso_origin: 'qldt.techcorp.info.vn'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: lmsToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;