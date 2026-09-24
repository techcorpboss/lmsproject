// routes/lesson.routes.js
const express = require('express');
const router = express.Router();
const { getLessonById, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Route cho học viên lấy chi tiết bài học (cần đăng nhập)
router.get('/:id', protect, getLessonById);

// Routes cho Admin quản lý bài học
router.put('/:id', protect, isAdmin, updateLesson);
router.delete('/:id', protect, isAdmin, deleteLesson);

module.exports = router;