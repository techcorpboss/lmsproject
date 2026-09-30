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

module.exports = router;
