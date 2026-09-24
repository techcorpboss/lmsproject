// backend/routes/academicEnterprise.routes.js
// Enterprise Academic Endpoints: Catalogs, Assignments, AI Authoring & 3-Exams Generation, Moderation, Gradebooks
const express = require('express');
const router = express.Router();
const controller = require('../controllers/academicEnterprise.controller');

// 1. Danh mục quản trị cơ sở
router.get('/lecturers', controller.getLecturers);
router.get('/classes', controller.getClasses);
router.get('/courses-catalog', controller.getCoursesCatalog);

// 2. Phân cấp Khoa - Ngành - Lớp & Phân công giảng dạy
router.get('/hierarchy', controller.getHierarchyAndAssignments);
router.post('/assignments', controller.saveAssignment);

// 3. AI Soạn giảng từ đề cương & Soạn bộ 3 đề thi
router.post('/ai/extract-and-generate', controller.extractAndGenerateFromSyllabus);
router.post('/ai/generate-3-exams', controller.generate3ExamPapers);

// 4. Thẩm định đề thi & Ký số biên bản
router.get('/appraisals', controller.getAppraisals);
router.post('/appraisals/:id/sign', controller.signAppraisalMinutes);

// 5. Bảng điểm chuẩn Bộ GD&ĐT (TT 08/2021)
router.get('/transcripts/student/:studentId', controller.getStudentTranscript);
router.get('/transcripts/class/:sectionId', controller.getClassTranscript);

module.exports = router;
