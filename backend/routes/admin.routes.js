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
router.get('/backups/download/:filename', controller.downloadBackup);

// 5. Quản lý danh sách học viên
router.get('/students', controller.getStudents);
router.post('/students', controller.saveStudent);
router.delete('/students/:id', controller.deleteStudent);
router.post('/students/batch', controller.batchSaveStudents);

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

// 8. Động cơ bộ đệm Caching hiệu năng cao (Redis & In-Memory Fallback)
const cacheService = require('../services/cacheService');

router.get('/cache/stats', (req, res) => {
  try {
    const stats = cacheService.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy thống kê Cache: ' + err.message });
  }
});

router.post('/cache/clear', async (req, res) => {
  try {
    const { prefix } = req.body || {};
    if (prefix) {
      await cacheService.clearPrefix(prefix);
      return res.json({ success: true, message: `Đã xóa sạch bộ đệm với tiền tố: ${prefix}` });
    }
    await cacheService.flush();
    res.json({ success: true, message: 'Đã giải phóng toàn bộ bộ nhớ đệm Cache thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa bộ đệm: ' + err.message });
  }
});

module.exports = router;

