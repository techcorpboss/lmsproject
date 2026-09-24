// controllers/authController.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Hàm tạo token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token hết hạn sau 30 ngày
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // 1. Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // 2. Tạo user mới (mật khẩu sẽ được hash tự động bởi hook trong model)
    const user = await User.create({
      full_name,
      email,
      password_hash: password, // Truyền mật khẩu thô, model sẽ hash
    });

    // 3. Trả về thông tin user và token
    if (user) {
      res.status(201).json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Tìm user theo email
    const user = await User.findOne({ where: { email } });

    // 2. Nếu user tồn tại và mật khẩu khớp
    if (user && (await user.isValidPassword(password))) {
      res.json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};