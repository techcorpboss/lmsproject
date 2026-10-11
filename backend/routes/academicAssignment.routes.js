// backend/routes/academicAssignment.routes.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/academicAssignment.controller');

// Lấy danh sách bài tập của lớp học phần
router.get('/', assignmentController.getAssignments);

// Giảng viên tạo mới hoặc cập nhật bài tập kèm Rubric
router.post('/', assignmentController.createOrUpdateAssignment);

// Giảng viên lấy toàn bộ bài nộp của một bài tập để chấm
router.get('/:assignmentId/submissions', assignmentController.getSubmissions);

// Sinh viên nộp bài tập
router.post('/:assignmentId/submit', assignmentController.submitAssignment);

// Giảng viên chấm điểm bằng Rubrics & Tự động đồng bộ sang Sổ điểm học phần
router.post('/submissions/:submissionId/grade', assignmentController.gradeSubmission);

module.exports = router;
