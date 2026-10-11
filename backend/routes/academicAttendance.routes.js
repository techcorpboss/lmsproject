// backend/routes/academicAttendance.routes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/academicAttendance.controller');

// Lấy danh sách 15 buổi học của lớp học phần
router.get('/sessions', attendanceController.getSessions);

// Lấy chi tiết điểm danh của 1 buổi học
router.get('/sessions/:sessionId/records', attendanceController.getSessionRecords);

// Lưu điểm danh của buổi học (Checklist hoặc từng sinh viên)
router.post('/sessions/:sessionId/records', attendanceController.saveSessionRecords);

// Báo cáo chuyên cần toàn khóa & Cảnh báo cấm thi TT 08/2021
router.get('/summary', attendanceController.getAttendanceSummary);

// Tự động đồng bộ điểm chuyên cần sang Sổ điểm & Cập nhật tư cách thi
router.post('/sync-moet-regulations', attendanceController.syncAttendanceWithMoet);

module.exports = router;
