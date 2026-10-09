// backend/routes/academicEnterprise.routes.js
// Enterprise Academic Endpoints: Catalogs, Assignments, AI Authoring & 3-Exams Generation, Moderation, Gradebooks, Curriculum Compliance & PDPD
const express = require('express');
const router = express.Router();
const controller = require('../controllers/academicEnterprise.controller');
const curriculumComplianceService = require('../services/curriculumComplianceService');
const encryptionService = require('../services/encryptionService');
const { AcademicStudent } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// 1. Danh mục quản trị cơ sở & Hồ sơ Giảng viên (CRUD)
router.get('/lecturers', controller.getLecturers);
router.post('/lecturers', controller.createLecturer);
router.put('/lecturers/:id', controller.updateLecturer);
router.delete('/lecturers/:id', controller.deleteLecturer);

// 1.1. Cơ cấu tổ chức & Danh mục cơ sở (Khoa, Ngành, Khóa, Lớp)
router.get('/catalogs/all', controller.getInstitutionalCatalogs);
router.post('/catalogs/faculties', controller.saveFaculty);
router.delete('/catalogs/faculties/:id', controller.deleteFaculty);
router.post('/catalogs/majors', controller.saveMajor);
router.delete('/catalogs/majors/:id', controller.deleteMajor);
router.post('/catalogs/cohorts', controller.saveCohort);
router.delete('/catalogs/cohorts/:id', controller.deleteCohort);
router.post('/catalogs/classes', controller.saveClass);
router.delete('/catalogs/classes/:id', controller.deleteClass);

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
router.post('/transcripts/class/batch', controller.saveClassGradesBatch);

// -------------------------------------------------------------
// 6. KIỂM SOÁT TRẦN 30% ĐÀO TẠO TRỰC TUYẾN (TT 08/2021 ĐIỀU 12)
// -------------------------------------------------------------
router.get('/curriculum/compliance', async (req, res) => {
  try {
    const report = await curriculumComplianceService.getComplianceReport(req.query);
    res.json(report);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi thẩm định tuân thủ CTĐT: ' + err.message });
  }
});

router.post('/curriculum/validate-course', async (req, res) => {
  try {
    const validation = await curriculumComplianceService.validateCourseChange(req.body);
    res.json(validation);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi kiểm tra tính hợp lệ của môn học: ' + err.message });
  }
});

// -------------------------------------------------------------
// 7. BẢO VỆ DỮ LIỆU CÁ NHÂN (PDPD NĐ 13/2023/NĐ-CP - AES-256-GCM)
// -------------------------------------------------------------
router.get('/students/secure-list', protect, async (req, res) => {
  try {
    const students = await AcademicStudent.findAll({
      where: { is_deleted: false },
      order: [['student_code', 'ASC']]
    });

    const isPrivileged = ['superadmin', 'admin'].includes(req.user.role);
    const sanitized = students.map(s => encryptionService.sanitizeStudentProfile(s, isPrivileged));

    res.json({
      success: true,
      pdpd_compliant: true,
      encryption_standard: 'AES-256-GCM (ISO 27001 / NĐ 13/2023)',
      is_masked: !isPrivileged,
      total: sanitized.length,
      data: sanitized
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi truy xuất danh sách sinh viên bảo mật: ' + err.message });
  }
});

// Cập nhật thông tin PII sinh viên với mã hóa tự động
router.put('/students/:id/pdpd-update', protect, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const student = await AcademicStudent.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ sinh viên.' });

    const { citizen_id, phone, address, emergency_contact } = req.body;
    const updateData = {};

    if (citizen_id !== undefined) updateData.citizen_id = encryptionService.encrypt(citizen_id);
    if (phone !== undefined) updateData.phone = encryptionService.encrypt(phone);
    if (address !== undefined) updateData.address = encryptionService.encrypt(address);
    if (emergency_contact !== undefined) updateData.emergency_contact = encryptionService.encrypt(emergency_contact);

    await student.update(updateData);

    res.json({
      success: true,
      message: 'Đã cập nhật và mã hóa dữ liệu nhạy cảm AES-256-GCM theo Nghị định 13/2023/NĐ-CP thành công!',
      student: encryptionService.sanitizeStudentProfile(student, true)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật dữ liệu PII: ' + err.message });
  }
});

// -------------------------------------------------------------
// 8. CHỮ KÝ SỐ PKI BẢNG ĐIỂM (TT 41/2017/TT-BTTTT & TT 08/2021)
// -------------------------------------------------------------
const digitalSignatureService = require('../services/digitalSignatureService');

// Ký số bảng điểm học phần (Giảng viên / Trưởng khoa)
router.post('/gradebook/sign', async (req, res) => {
  try {
    const { gradebookData, signerInfo } = req.body;
    if (!gradebookData || !gradebookData.grades) {
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu bảng điểm học phần.' });
    }

    const signer = signerInfo || {
      id: req.user ? req.user.id : 'GV-2027',
      name: req.user ? req.user.name : 'Giảng viên Phụ trách',
      title: 'Giảng viên chính',
      role: 'LECTURER',
      email: req.user ? req.user.email : 'giangvien@techcorp.edu.vn',
      department: 'Khoa Công nghệ Thông tin'
    };

    const signatureEnvelope = digitalSignatureService.signGradebook(gradebookData, signer);

    res.json({
      success: true,
      message: 'Ký số điện tử bảng điểm học phần thành công theo Thông tư 41/2017/TT-BTTTT.',
      signatureEnvelope
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi ký số bảng điểm: ' + err.message });
  }
});

// Lấy chữ ký số đã lưu của lớp học phần
router.get('/gradebook/signature/:sectionId', async (req, res) => {
  try {
    const signature = digitalSignatureService.getStoredSignature(req.params.sectionId);
    if (!signature) {
      return res.status(404).json({ success: false, message: 'Chưa có chữ ký số cho lớp học phần này.' });
    }
    res.json({ success: true, signatureEnvelope: signature });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi truy xuất chữ ký số: ' + err.message });
  }
});

// Thẩm tra xác minh chữ ký số và phát hiện can thiệp điểm số trái phép
router.post('/gradebook/verify', async (req, res) => {
  try {
    const { gradebookData, signatureEnvelope } = req.body;
    if (!gradebookData || !signatureEnvelope) {
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu bảng điểm hoặc phong bì chữ ký để thẩm tra.' });
    }

    const verification = digitalSignatureService.verifyGradebookSignature(gradebookData, signatureEnvelope);
    res.json({
      success: verification.isValid,
      ...verification
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi thẩm tra chữ ký số: ' + err.message });
  }
});

// -------------------------------------------------------------
// 9. KHẢO SÁT ĐÁNH GIÁ GIẢNG VIÊN (SET) & CỔNG CHẶN ĐIỂM THI (GATEKEEPER)
// -------------------------------------------------------------
const courseEvaluationService = require('../services/courseEvaluationService');

// Lấy mẫu khảo sát giảng dạy cho học phần
router.get('/evaluations/form', (req, res) => {
  try {
    const { courseCode, lecturerName } = req.query;
    const form = courseEvaluationService.getSurveyForm(courseCode || 'IT101', lecturerName);
    res.json({ success: true, data: form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Kiểm tra trạng thái khảo sát của sinh viên
router.get('/evaluations/status/:studentId', (req, res) => {
  try {
    const { courseCode } = req.query;
    const hasCompleted = courseEvaluationService.hasStudentCompleted(req.params.studentId, courseCode);
    res.json({ success: true, hasCompleted, courseCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Nộp phiếu khảo sát ẩn danh (Mở khóa điểm thi)
router.post('/evaluations/submit', (req, res) => {
  try {
    const result = courseEvaluationService.submitSurvey(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Thống kê kết quả khảo sát cho Giảng viên & Phòng Đảm bảo Chất lượng
router.get('/evaluations/stats/:courseCode', (req, res) => {
  try {
    const stats = courseEvaluationService.getStatistics(req.params.courseCode);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 10. ĐÁNH GIÁ ĐỒNG ĐẲNG (DOUBLE-BLIND PEER REVIEW) & RUBRICS AUN-QA
// -------------------------------------------------------------
const peerReviewService = require('../services/peerReviewService');

// Lấy danh mục tiêu chí Rubric chuẩn AUN-QA/ABET
router.get('/peer-review/rubric', (req, res) => {
  try {
    const criteria = peerReviewService.getRubricCriteria();
    res.json({ success: true, data: criteria });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Giảng viên kích hoạt phân bổ bài nộp cho sinh viên chấm chéo
router.post('/peer-review/distribute', (req, res) => {
  try {
    const { assignmentId, submissions, reviewsPerStudent } = req.body;
    const result = peerReviewService.distributePeerReviews(assignmentId, submissions, reviewsPerStudent);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Lấy danh sách bài nộp mà sinh viên được phân công chấm chéo
router.get('/peer-review/assigned/:studentId', (req, res) => {
  try {
    const { assignmentId } = req.query;
    const assigned = peerReviewService.getAssignedReviewsForStudent(assignmentId, req.params.studentId);
    res.json({ success: true, data: assigned });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Sinh viên nộp phiếu chấm chéo đồng đẳng
router.post('/peer-review/submit', (req, res) => {
  try {
    const result = peerReviewService.submitPeerReview(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Giảng viên xem báo cáo tổng hợp điểm đồng đẳng
router.get('/peer-review/summary/:submissionId', (req, res) => {
  try {
    const summary = peerReviewService.getPeerReviewSummaryForSubmission(req.params.submissionId);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 11. QUẢN LÝ ĐỒ ÁN / KHÓA LUẬN TỐT NGHIỆP & HỘI ĐỒNG BẢO VỆ
// -------------------------------------------------------------
const graduationThesisService = require('../services/graduationThesisService');

// Lấy danh sách khóa luận
router.get('/thesis', (req, res) => {
  try {
    const list = graduationThesisService.listTheses(req.query);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Đăng ký đề tài khóa luận mới
router.post('/thesis/register', (req, res) => {
  try {
    const newThesis = graduationThesisService.registerThesis(req.body);
    res.json({ success: true, message: 'Đăng ký đề tài khóa luận tốt nghiệp thành công!', data: newThesis });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Phê duyệt đề tài
router.post('/thesis/:id/approve', (req, res) => {
  try {
    const updated = graduationThesisService.approveThesis(req.params.id, req.body.decision);
    res.json({ success: true, message: 'Đã cập nhật trạng thái phê duyệt đề tài!', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Nộp mốc tiến độ (20%, 50%, 100%)
router.post('/thesis/:id/milestone', (req, res) => {
  try {
    const { milestoneKey, fileName } = req.body;
    const updated = graduationThesisService.submitMilestone(req.params.id, milestoneKey, fileName);
    res.json({ success: true, message: 'Nộp báo cáo mốc tiến độ thành công!', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Nhập điểm Hội đồng chấm bảo vệ
router.post('/thesis/:id/council-grade', (req, res) => {
  try {
    const updated = graduationThesisService.submitCouncilGrading(req.params.id, req.body.scores);
    res.json({ success: true, message: 'Đã hoàn tất chấm điểm Hội đồng và lập biên bản bảo vệ!', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
