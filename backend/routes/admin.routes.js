// backend/routes/admin.routes.js
// Routes for Enterprise LMS Administration & ERP Integration
const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');

// 1. Quản lý tài khoản người dùng
router.get('/users', controller.getUsers);
router.post('/users', controller.createUser);
router.put('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

// 2. Nhật ký Audit Logs
router.get('/audit-logs', controller.getAuditLogs);

// 3. Giám sát hệ thống & tài nguyên máy chủ
router.get('/system-stats', controller.getSystemStats);

// 4. Sao lưu & Khôi phục CSDL / File học tập
router.get('/backups', controller.getBackups);
router.post('/backups/create', controller.createBackup);
router.post('/backups/restore', controller.restoreBackup);

// 5. Quản lý danh sách học viên
router.get('/students', controller.getStudents);
router.post('/students', controller.saveStudent);

// 6. Khung chương trình đào tạo độc lập
router.get('/curriculum', controller.getCurriculum);
router.get('/curriculum/architecture', controller.getCurriculumArchitecture);
router.post('/curriculum/course', controller.saveCurriculumCourse);
router.delete('/curriculum/course/:id', controller.deleteCurriculumCourse);
router.post('/curriculum/sync-root', controller.syncRootCurriculum);

// 7. Cổng liên thông ERP TCU COMPASS (qldt.techcorp.info.vn)
router.get('/erp/config', controller.getErpConfig);
router.post('/erp/config', controller.updateErpConfig);
router.get('/erp/ping', controller.pingErp);
router.post('/erp/pull', controller.pullFromErp);

module.exports = router;
