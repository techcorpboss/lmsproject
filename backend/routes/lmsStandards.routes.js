// backend/routes/lmsStandards.routes.js
// Routes for International LMS Standards: SCORM/xAPI, LTI 1.3, Lesson Q&A Forum, and Essay Assignments
const express = require('express');
const router = express.Router();
const controller = require('../controllers/lmsStandards.controller');

// 1. Chuẩn đóng gói bài giảng điện tử SCORM 1.2 / 2004 & xAPI (Tin Can / cmi5)
router.get('/scorm/packages', controller.getScormPackages);
router.post('/scorm/upload', controller.uploadScormPackage);
router.put('/scorm/packages/:id', controller.updateScormPackage);
router.delete('/scorm/packages/:id', controller.deleteScormPackage);
router.get('/scorm/packages/:id/export-zip', controller.exportScormPackageZip);
router.post('/scorm/export-direct-zip', controller.exportDirectScormZip);
router.post('/scorm/publish-to-curriculum', controller.publishScormToCurriculum);
router.post('/scorm/cmi-track', controller.trackScormCmi);
router.get('/xapi/statements', controller.getXApiStatements);
router.post('/xapi/statements', controller.postXApiStatement);

// 2. Chuẩn tích hợp công cụ giáo dục bên thứ ba LTI 1.3 / LTI Advantage
router.get('/lti/tools', controller.getLtiTools);
router.post('/lti/tools', controller.createLtiTool);
router.delete('/lti/tools/:id', controller.deleteLtiTool);
router.post('/lti/launch/:tool_id', controller.initiateLtiLaunch);
router.post('/lti/ags/grade-passback', controller.handleLtiGradePassback);
router.get('/lti/jwks.json', controller.getPlatformJwks);

// 3. Diễn đàn trao đổi Q&A theo từng bài học (Lesson-Specific Q&A)
router.get('/qa/threads', controller.getLessonQaThreads);
router.post('/qa/threads', controller.createQaThread);
router.post('/qa/threads/:threadId/replies', controller.createQaReply);
router.put('/qa/threads/:threadId/replies/:replyId/verify', controller.verifyQaReply);
router.post('/qa/ai-answer', controller.generateAiAnswer);

// 4. Quản lý nộp bài tập tự luận (Assignment Submission, Plagiarism & Rubrics)
router.get('/assignments', controller.getAssignments);
router.post('/assignments', controller.createAssignment);
router.get('/assignments/submissions', controller.getSubmissions);
router.post('/assignments/submit', controller.submitAssignment);
router.post('/assignments/submissions/:submissionId/grade', controller.gradeSubmission);
router.post('/assignments/submissions/:submissionId/check-plagiarism', controller.checkPlagiarism);

module.exports = router;
