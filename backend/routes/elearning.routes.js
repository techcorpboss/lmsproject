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

module.exports = router;
