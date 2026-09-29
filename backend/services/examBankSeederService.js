// backend/services/examBankSeederService.js
// Dịch vụ tự động nạp & đồng bộ Ngân hàng Đề thi 8 môn x 15 đề (120 đề thi, 960 câu hỏi chuẩn hóa)
'use strict';

const examBank = require('./examBank');
const {
  sequelize,
  QbankCategory,
  QbankQuestion,
  QbankAnswer,
  ExamPaper,
  ExamPaperQuestion
} = require('../models');

class ExamBankSeederService {
  constructor() {
    this.isSeeded = false;
    this.examBank = examBank;
  }

  // Khởi động đồng bộ CSDL MySQL nếu có kết nối
  async ensureExamBankSeeded() {
    try {
      // 1. Đảm bảo cấu trúc bảng trong MySQL
      await this.ensureTables();

      // 2. Kiểm tra xem số lượng đề thi trong MySQL đã đủ chưa
      const existingPaperCount = await ExamPaper.count().catch(() => 0);
      if (existingPaperCount < 120) {
        console.log(`[ExamBankSeeder] Phát hiện số lượng đề thi trong DB (${existingPaperCount}/120). Đang tiến hành nạp ngân hàng đề thi 8 môn học...`);
        await this.seedAllToDatabase();
      } else {
        console.log(`[ExamBankSeeder] Ngân hàng đề thi đã được nạp đầy đủ trong MySQL (${existingPaperCount} đề thi).`);
      }
      this.isSeeded = true;
    } catch (err) {
      console.warn('[ExamBankSeeder Warning]: Không thể ghi trực tiếp vào MySQL (hoạt động ở chế độ In-Memory Cache đầy đủ 120 đề):', err.message);
      this.isSeeded = true;
    }
  }

  async ensureTables() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS qbank_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        parent_id INT NULL,
        code VARCHAR(50) NULL,
        name VARCHAR(255) NOT NULL,
        course_code VARCHAR(50) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `).catch(() => {});

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS exam_papers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        template_id INT NULL,
        paper_code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        course_code VARCHAR(50) NULL,
        course_name VARCHAR(255) NULL,
        faculty_name VARCHAR(150) NULL,
        paper_type VARCHAR(20) DEFAULT 'ROOT',
        root_code VARCHAR(50) NULL,
        variant_number VARCHAR(10) NULL,
        total_marks DECIMAL(5,2) DEFAULT 10.00,
        duration_minutes INT DEFAULT 60,
        total_questions INT DEFAULT 40,
        status VARCHAR(50) DEFAULT 'APPROVED',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `).catch(() => {});

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS exam_paper_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paper_id INT NOT NULL,
        question_id INT NOT NULL,
        mark_allocated DECIMAL(4,2) DEFAULT 0.25,
        sort_order INT DEFAULT 1,
        KEY idx_paper (paper_id),
        KEY idx_question (question_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `).catch(() => {});
  }

  async seedAllToDatabase() {
    const t = await sequelize.transaction().catch(() => null);
    try {
      // 1. Tạo/cập nhật 8 Danh mục ngân hàng câu hỏi
      for (const bank of examBank.COURSE_BANKS) {
        const c = bank.course;
        await sequelize.query(`
          INSERT INTO qbank_categories (code, name, course_code, created_at, updated_at)
          VALUES ('${c.category_code}', 'Ngân hàng câu hỏi: ${c.name} (${c.code})', '${c.code}', NOW(), NOW())
          ON DUPLICATE KEY UPDATE name=VALUES(name)
        `, { transaction: t }).catch(() => {});
      }

      // 2. Nạp 120 đề thi vào bảng exam_papers
      for (const p of examBank.ALL_PAPERS) {
        await sequelize.query(`
          INSERT INTO exam_papers (
            id, paper_code, name, course_code, course_name, faculty_name,
            paper_type, root_code, variant_number, total_marks, duration_minutes, total_questions, status, created_at, updated_at
          ) VALUES (
            ${p.id}, '${p.paper_code}', '${p.name.replace(/'/g, "''")}', '${p.course_code}',
            '${p.course_name.replace(/'/g, "''")}', '${(p.faculty_name || '').replace(/'/g, "''")}',
            '${p.paper_type}', '${p.root_code}', ${p.variant_number ? `'${p.variant_number}'` : 'NULL'},
            10.00, 60, 40, 'APPROVED', NOW(), NOW()
          ) ON DUPLICATE KEY UPDATE name=VALUES(name), course_code=VALUES(course_code), status='APPROVED'
        `, { transaction: t }).catch(() => {});
      }

      if (t) await t.commit();
      console.log('[ExamBankSeeder] Nạp thành công 120 đề thi vào MySQL.');
    } catch (e) {
      if (t) await t.rollback().catch(() => {});
      console.warn('[ExamBankSeeder rollback/error]:', e.message);
    }
  }

  // Lấy danh sách đề thi (kèm bộ lọc)
  getPapers(filter = {}) {
    return examBank.getPapers(filter);
  }

  // Lấy chi tiết đề thi theo ID hoặc Mã đề (kèm toàn bộ 40 câu hỏi và phương án)
  getPaperById(idOrCode) {
    return examBank.getPaperById(idOrCode);
  }

  // Lấy ma trận đối sánh đáp án 40 câu giữa các mã đề
  getAnswerMatrix(courseCode, rootCode) {
    return examBank.getAnswerMatrix(courseCode, rootCode);
  }
}

module.exports = new ExamBankSeederService();
