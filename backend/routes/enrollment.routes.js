// routes/enrollment.routes.js
const express = require('express');
const router = express.Router();
const { registerCourse, confirmPayment, getMyCourses } = require('../controllers/enrollmentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Route cho học viên đăng ký khóa học
router.post('/register', protect, registerCourse);

// Route cho học viên xem các khóa học đã đăng ký
router.get('/my-courses', protect, getMyCourses);

// Route cho admin xác nhận thanh toán
router.post('/confirm-payment', protect, isAdmin, confirmPayment);

module.exports = router;