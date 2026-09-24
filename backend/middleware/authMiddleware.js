// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // 2. Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Lấy thông tin user từ token và gắn vào request
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] } // Không lấy password
      });

      next(); // Chuyển sang middleware/controller tiếp theo
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'MANAGER')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin/manager' });
  }
};

module.exports = { protect, isAdmin };