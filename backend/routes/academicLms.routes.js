// backend/routes/academicLms.routes.js
// Routes for Academic LMS (15-Week Curriculum, Discussion, Quiz, Progress, Analytics)
const express = require('express');
const router = express.Router();
const controller = require('../controllers/academicLms.controller');

// Quản lý modules / tuần học (15 Tuần)
router.get('/sections/:sectionId/modules', controller.getModulesBySection);
router.post('/modules', controller.saveModule);
router.delete('/modules/:id', controller.deleteModule);

// Quản lý tài liệu học tập
router.post('/materials', controller.saveMaterial);
router.delete('/materials/:id', controller.deleteMaterial);
router.put('/materials/:id/slides', controller.updateMaterialSlides);

// Tải lên tệp tin học liệu (Video, Slide, PDF, Docs, Code) từ thiết bị
router.post('/upload', controller.uploadFileMiddleware, controller.uploadFile);

// Trợ lý AI tự động sinh câu hỏi trắc nghiệm & slide bài giảng
router.post('/ai-generate-quiz', controller.aiGenerateQuiz);
router.post('/ai-generate-slides', controller.aiGenerateSlides);

// Quản lý bài kiểm tra Quiz
router.post('/quizzes', controller.saveQuiz);
router.delete('/quizzes/:id', controller.deleteQuiz);
router.get('/quizzes/:quizId', controller.getQuizDetail);
router.post('/quizzes/:quizId/submit', controller.submitQuiz);
router.post('/sections/:sectionId/sync-quiz-grades', controller.syncQuizGradesToGradebook);

// Diễn đàn thảo luận lớp học phần
router.get('/sections/:sectionId/discussions', controller.getDiscussions);
router.post('/discussions', controller.postDiscussion);
router.put('/discussions/:id/upvote', controller.upvoteDiscussion);
router.put('/discussions/:id/toggle-answered', controller.toggleDiscussionAnswered);

// Thống kê & Phân tích chuyên sâu (Learning Analytics)
router.get('/sections/:sectionId/analytics', controller.getSectionAnalytics);

// Ghi nhận tiến độ học tập
router.post('/progress', controller.markProgress);

module.exports = router;
