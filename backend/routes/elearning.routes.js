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

// -------------------------------------------------------------
// H5P INTERACTIVE VIDEO CHECKPOINTS & IN-VIDEO QUIZZES
// -------------------------------------------------------------
const interactiveVideoService = require('../services/interactiveVideoService');

// GET /api/elearning/lessons/:lessonId/checkpoints (Lấy danh sách điểm dừng câu hỏi)
router.get('/lessons/:lessonId/checkpoints', (req, res) => {
  try {
    const checkpoints = interactiveVideoService.getCheckpointsByLesson(req.params.lessonId);
    res.json({ success: true, data: checkpoints });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách điểm dừng: ' + err.message });
  }
});

// POST /api/elearning/lessons/:lessonId/checkpoints (Thêm / Sửa điểm dừng - Giảng viên)
router.post('/lessons/:lessonId/checkpoints', (req, res) => {
  try {
    const updated = interactiveVideoService.saveCheckpoint(req.params.lessonId, req.body);
    res.json({ success: true, message: 'Đã lưu điểm dừng câu hỏi thành công!', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lưu điểm dừng câu hỏi: ' + err.message });
  }
});

// DELETE /api/elearning/lessons/:lessonId/checkpoints/:checkpointId (Xóa điểm dừng - Giảng viên)
router.delete('/lessons/:lessonId/checkpoints/:checkpointId', (req, res) => {
  try {
    const updated = interactiveVideoService.deleteCheckpoint(req.params.lessonId, req.params.checkpointId);
    res.json({ success: true, message: 'Đã xóa điểm dừng câu hỏi!', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa điểm dừng: ' + err.message });
  }
});

// POST /api/elearning/lessons/:lessonId/checkpoint-submit (Nộp câu trả lời dừng video - Sinh viên)
router.post('/lessons/:lessonId/checkpoint-submit', (req, res) => {
  try {
    const studentId = req.user ? req.user.id : 'SV_DEFAULT';
    const result = interactiveVideoService.submitAnswer(req.params.lessonId, studentId, req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/elearning/lessons/:lessonId/interactive-progress (Tiến độ xem & điểm tương tác)
router.get('/lessons/:lessonId/interactive-progress', (req, res) => {
  try {
    const studentId = req.user ? req.user.id : 'SV_DEFAULT';
    const progress = interactiveVideoService.getStudentProgress(req.params.lessonId, studentId);
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy tiến độ video: ' + err.message });
  }
});

module.exports = router;

