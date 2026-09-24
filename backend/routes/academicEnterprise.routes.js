// backend/routes/academicEnterprise.routes.js
// Routes for Enterprise Hierarchy, AI Teaching Studio, Exam Appraisal and MOET Transcripts
const express = require('express');
const router = express.Router();
const controller = require('../controllers/academicEnterprise.controller');

// 1. Phân cấp Khoa - Ngành - Khóa - Lớp & Phân công giảng dạy
router.get('/hierarchy', controller.getHierarchyAndAssignments);
router.post('/assignments', controller.saveAssignment);

// 2. Trợ lý AI Soạn bài giảng & Đề thi chuyên sâu
router.post('/ai/generate', controller.generateAiContent);

// 3. Thẩm định Đề thi & Biên bản số hóa
router.get('/appraisals', controller.getAppraisals);
router.post('/appraisals', controller.createAppraisal);
router.post('/appraisals/:id/sign', controller.signAppraisalMinutes);

// 4. Bảng điểm & Mẫu in ấn chuẩn Bộ GD&ĐT (TT 08/2021)
router.get('/transcripts/student/:studentId', controller.getStudentTranscript);
router.get('/transcripts/class/:sectionId', controller.getClassTranscript);

module.exports = router;
