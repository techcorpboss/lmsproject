// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Bí mật JWT cho LMS nội bộ và hỗ trợ SSO từ TCU COMPASS ERP
const JWT_SECRET = process.env.JWT_SECRET || 'lms-super-secret-key-2026-techcorp';
const ERP_SSO_SECRET = process.env.ERP_SSO_SECRET || 'techcorp_ntu_compass_jwt_secret_key_2026';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để truy cập tài nguyên này.' });
  }

  try {
    let decoded = null;
    // 1. Thử giải mã bằng JWT_SECRET của LMS
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e1) {
      // 2. Thử giải mã bằng ERP_SSO_SECRET (SSO từ qldt.techcorp.info.vn)
      try {
        decoded = jwt.verify(token, ERP_SSO_SECRET);
        decoded.isSSO = true;
      } catch (e2) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn.');
      }
    }

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ.' });
    }

    // Gắn thông tin người dùng vào request
    req.user = {
      id: decoded.id || decoded.user_id || decoded.sub || 1,
      username: decoded.username || 'user',
      email: decoded.email || 'user@techcorp.info.vn',
      full_name: decoded.full_name || decoded.name || 'Người dùng LMS',
      role: decoded.role || 'student',
      isSSO: !!decoded.isSSO
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message || 'Xác thực không thành công.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || (!roles.includes(req.user.role) && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này.'
      });
    }
    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET, ERP_SSO_SECRET };
