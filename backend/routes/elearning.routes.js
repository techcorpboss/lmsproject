// routes/elearning.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const elearningService = require('../services/elearningService');

// Tự động bảo vệ các endpoint
router.use(protect);

// GET /api/elearning/courses
router.get('/courses', async (req, res) => {
  try {
    const data = await elearningService.listCoursesWithProgress(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/elearning/courses/:id/curriculum
router.get('/courses/:id/curriculum', async (req, res) => {
  try {
    const data = await elearningService.getCourseCurriculum(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/elearning/courses/:id/curriculum
router.post('/courses/:id/curriculum', async (req, res) => {
  try {
    const data = await elearningService.saveCourseCurriculum(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/elearning/courses/:id/quiz
router.get('/courses/:id/quiz', async (req, res) => {
  try {
    const data = await elearningService.getQuizForTaking(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/elearning/quiz/:id/submit
router.post('/quiz/:id/submit', async (req, res) => {
  try {
    const data = await elearningService.submitQuizAndAutoGrade(req.params.id, req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/elearning/courses/:id/certificate
router.get('/courses/:id/certificate', async (req, res) => {
  try {
    const data = await elearningService.getCourseCertificate(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// VIRTUAL CLASSROOM HUB (WebRTC / Jitsi / BigBlueButton)
// -------------------------------------------------------------
const virtualClassroomService = require('../services/virtualClassroomService');

// POST /api/elearning/virtual-classroom/room (Tạo hoặc truy xuất phòng học trực tuyến)
router.post('/virtual-classroom/room', async (req, res) => {
  try {
    const { courseId, courseName, weekIndex, sectionId, title } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Thiếu Course ID để khởi tạo phòng học.' });
    }

    const room = virtualClassroomService.createOrGetRoom({
      courseId,
      courseName,
      weekIndex: weekIndex || 1,
      sectionId,
      title,
      instructorId: req.user ? req.user.id : null,
      instructorName: req.user ? req.user.name : 'Giảng viên'
    });

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khởi tạo phòng học trực tuyến: ' + err.message });
  }
});

// GET /api/elearning/virtual-classroom/access/:roomId (Lấy thông tin quyền truy cập & điểm danh)
router.get('/virtual-classroom/access/:roomId', async (req, res) => {
  try {
    const user = req.user || {
      id: 'GUEST_' + Date.now(),
      name: 'Khách tham dự',
      role: 'STUDENT'
    };

    const accessConfig = virtualClassroomService.getRoomAccessConfig(req.params.roomId, user);
    res.json({ success: true, ...accessConfig });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

// GET /api/elearning/virtual-classroom/attendance/:roomId (Báo cáo điểm danh và thời lượng)
router.get('/virtual-classroom/attendance/:roomId', async (req, res) => {
  try {
    const report = virtualClassroomService.getAttendanceReport(req.params.roomId);
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

