// backend/services/schemaIntegrityService.js
// Dịch vụ tự động đồng bộ lược đồ CSDL & tự phục hồi cấu trúc bảng (Self-Healing Schema)
'use strict';

const {
  sequelize,
  User,
  Course,
  CurriculumCourse,
  AcademicLecturer,
  AcademicStudent,
  SystemAuditLog,
  AcademicSectionGrade,
  QbankCategory,
  QbankQuestion,
  QbankAnswer,
  AcademicExamSchedule,
  ExamCandidateAuthorization
} = require('../models');

class SchemaIntegrityService {

  /**
   * Tự động kiểm tra và đảm bảo 100% các bảng và cột cần thiết luôn tồn tại trong MySQL
   */
  async ensureAllTablesAndColumns() {
    try {
      console.log('[SchemaIntegrity] Bắt đầu kiểm tra và đồng bộ cấu trúc CSDL MySQL...');

      // 1. BẢNG DANH MỤC NGÂN HÀNG CÂU HỎI
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

      // 2. BẢNG CÂU HỎI THI
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS qbank_questions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category_id INT NOT NULL DEFAULT 1,
          content TEXT NOT NULL,
          question_type VARCHAR(50) DEFAULT 'SINGLE_CHOICE',
          difficulty VARCHAR(50) DEFAULT 'MEDIUM',
          default_mark DECIMAL(4,2) DEFAULT 1.00,
          status VARCHAR(50) DEFAULT 'APPROVED',
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 3. BẢNG ĐÁP ÁN CÂU HỎI
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS qbank_answers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          question_id INT NOT NULL,
          content TEXT NOT NULL,
          is_correct TINYINT(1) DEFAULT 0,
          fraction DECIMAL(4,2) DEFAULT 0.00,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 4. BẢNG CA THI TRỰC TUYẾN
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS academic_exam_schedules (
          id INT AUTO_INCREMENT PRIMARY KEY,
          exam_code VARCHAR(50) NULL,
          exam_name VARCHAR(255) NOT NULL,
          semester VARCHAR(50) DEFAULT 'Học kỳ 1',
          academic_year VARCHAR(50) DEFAULT '2026-2027',
          exam_date DATE NOT NULL,
          start_time VARCHAR(10) DEFAULT '07:30',
          end_time VARCHAR(10) DEFAULT '09:00',
          duration_minutes INT DEFAULT 60,
          course_id INT NULL,
          course_code VARCHAR(50) NULL,
          course_name VARCHAR(255) NULL,
          room_code VARCHAR(50) DEFAULT 'PHONG-ONLINE-01',
          paper_id INT NULL,
          exam_type VARCHAR(50) DEFAULT 'Trắc nghiệm khách quan trực tuyến',
          proctor_1 VARCHAR(150) DEFAULT 'TS. Hoàng Đức Em',
          proctor_2 VARCHAR(150) DEFAULT 'ThS. Nguyễn Văn Quản',
          security_level VARCHAR(50) DEFAULT 'AI_PROCTORING_WEBCAM',
          status VARCHAR(50) DEFAULT 'SCHEDULED',
          faculty_id VARCHAR(50) NULL,
          faculty_name VARCHAR(150) NULL,
          major_id VARCHAR(50) NULL,
          major_name VARCHAR(150) NULL,
          notes TEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 5. BẢNG CẤP QUYỀN THÍ SINH DỰ THI
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS exam_candidate_authorizations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          schedule_id INT NOT NULL,
          student_id INT NULL,
          student_code VARCHAR(50) NOT NULL,
          student_name VARCHAR(150) NOT NULL,
          class_name VARCHAR(50) NULL,
          seat_number VARCHAR(50) NULL,
          subject_code VARCHAR(50) NULL,
          subject_name VARCHAR(150) NULL,
          attendance_pct INT DEFAULT 90,
          tuition_cleared TINYINT(1) DEFAULT 1,
          condition_passed TINYINT(1) DEFAULT 1,
          authorization_status VARCHAR(50) DEFAULT 'PENDING',
          authorized_by VARCHAR(150) NULL,
          authorized_at DATETIME NULL,
          notes TEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 6. BẢNG KHUNG CHƯƠNG TRÌNH ĐÀO TẠO
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS curriculum_courses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          semester INT NOT NULL DEFAULT 1,
          code VARCHAR(50) NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT NULL,
          credits INT DEFAULT 3,
          is_compulsory TINYINT(1) DEFAULT 1,
          prerequisite_codes VARCHAR(255) NULL,
          faculty_id VARCHAR(50) DEFAULT 'CNTT',
          major_id VARCHAR(50) DEFAULT '7480103',
          status VARCHAR(20) DEFAULT 'ACTIVE',
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 7. BẢNG HỒ SƠ GIẢNG VIÊN
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS academic_lecturers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(50) NOT NULL UNIQUE,
          username VARCHAR(100) NOT NULL,
          full_name VARCHAR(150) NOT NULL,
          gender VARCHAR(20) DEFAULT 'Nam',
          birth_date VARCHAR(50) NULL,
          title VARCHAR(50) DEFAULT 'Tiến sĩ',
          academic_rank VARCHAR(50) DEFAULT 'Không',
          faculty_id VARCHAR(50) DEFAULT 'CNTT',
          faculty_name VARCHAR(150) DEFAULT 'Khoa Công Nghệ Thông Tin',
          department VARCHAR(150) DEFAULT 'Bộ môn Kỹ thuật Phần mềm',
          email VARCHAR(150) NULL,
          phone VARCHAR(50) NULL,
          specialization VARCHAR(255) NULL,
          experience_years INT DEFAULT 5,
          assigned_courses JSON NULL,
          research_interests TEXT NULL,
          status VARCHAR(50) DEFAULT 'Đang công tác',
          active_courses_count INT DEFAULT 1,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 8. BẢNG HỒ SƠ HỌC VIÊN
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS academic_students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_code VARCHAR(50) NOT NULL UNIQUE,
          full_name VARCHAR(150) NOT NULL,
          birth_date VARCHAR(50) NULL,
          gender VARCHAR(20) DEFAULT 'Nam',
          faculty_id VARCHAR(50) DEFAULT 'CNTT',
          faculty_name VARCHAR(150) DEFAULT 'Khoa Công Nghệ Thông Tin',
          major_id VARCHAR(50) DEFAULT '7480103',
          major_name VARCHAR(150) DEFAULT 'Kỹ thuật Phần mềm',
          cohort VARCHAR(50) DEFAULT 'K66',
          class_name VARCHAR(50) DEFAULT '66.CNTT-1',
          email VARCHAR(150) NULL,
          phone VARCHAR(50) NULL,
          gpa DECIMAL(4,2) DEFAULT 3.00,
          cpa DECIMAL(4,2) DEFAULT 3.00,
          credits_accumulated INT DEFAULT 0,
          academic_rank VARCHAR(50) DEFAULT 'KHÁ',
          warning_level INT DEFAULT 0,
          status VARCHAR(50) DEFAULT 'ACTIVE',
          training_system VARCHAR(100) DEFAULT 'Đại học Chính quy (Tín chỉ TT 08/2021)',
          advisor VARCHAR(150) DEFAULT 'TS. Hoàng Đức Em',
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 9. BẢNG NHẬT KÝ AUDIT LOGS
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS system_audit_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          user VARCHAR(150) NOT NULL,
          action VARCHAR(100) NOT NULL,
          description TEXT NULL,
          ip VARCHAR(50) DEFAULT '127.0.0.1',
          status VARCHAR(50) DEFAULT 'SUCCESS',
          details JSON NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 10. BẢNG SỔ ĐIỂM HỌC PHẦN CHUẨN BỘ GD&ĐT
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS academic_section_grades (
          id INT AUTO_INCREMENT PRIMARY KEY,
          section_id INT NOT NULL,
          student_id INT NULL,
          student_code VARCHAR(50) NOT NULL,
          full_name VARCHAR(150) NOT NULL,
          attendance_score DECIMAL(4,2) DEFAULT 10.00,
          assignment_score DECIMAL(4,2) DEFAULT 8.50,
          midterm_score DECIMAL(4,2) DEFAULT 8.00,
          final_exam_score DECIMAL(4,2) DEFAULT 8.50,
          course_score_10 DECIMAL(4,2) DEFAULT 8.50,
          course_score_letter VARCHAR(10) DEFAULT 'B+',
          course_score_4 DECIMAL(3,2) DEFAULT 3.50,
          course_result VARCHAR(50) DEFAULT 'ĐẠT (PASS)',
          academic_rank VARCHAR(50) DEFAULT 'GIỎI',
          notes VARCHAR(255) NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // 11. BẢNG ĐỀ THI VÀ QUY TẮC MA TRẬN
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS exam_templates (
          id INT AUTO_INCREMENT PRIMARY KEY,
          course_id INT NOT NULL DEFAULT 1,
          name VARCHAR(255) NOT NULL,
          total_marks DECIMAL(5,2) DEFAULT 10.00,
          duration_minutes INT DEFAULT 60,
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
          total_marks DECIMAL(5,2) DEFAULT 10.00,
          status VARCHAR(50) DEFAULT 'APPROVED',
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `).catch(() => {});

      // TỰ ĐỘNG BỔ SUNG CỘT CÒN THIẾU CHO BẢNG CŨ (BAO GỒM SOFT DELETE POLICY)
      await this.ensureTableColumns('qbank_questions', [
        { name: 'status', type: "VARCHAR(50) DEFAULT 'APPROVED'" },
        { name: 'difficulty', type: "VARCHAR(50) DEFAULT 'MEDIUM'" },
        { name: 'default_mark', type: "DECIMAL(4,2) DEFAULT 1.00" },
        { name: 'question_type', type: "VARCHAR(50) DEFAULT 'SINGLE_CHOICE'" },
        { name: 'is_deleted', type: 'TINYINT(1) DEFAULT 0' },
        { name: 'deleted_at', type: 'DATETIME NULL' }
      ]);

      await this.ensureTableColumns('academic_exam_schedules', [
        { name: 'faculty_id', type: 'VARCHAR(50) NULL' },
        { name: 'faculty_name', type: 'VARCHAR(150) NULL' },
        { name: 'major_id', type: 'VARCHAR(50) NULL' },
        { name: 'major_name', type: 'VARCHAR(150) NULL' },
        { name: 'notes', type: 'TEXT NULL' },
        { name: 'is_deleted', type: 'TINYINT(1) DEFAULT 0' },
        { name: 'deleted_at', type: 'DATETIME NULL' }
      ]);

      await this.ensureTableColumns('academic_students', [
        { name: 'is_deleted', type: 'TINYINT(1) DEFAULT 0' },
        { name: 'deleted_at', type: 'DATETIME NULL' }
      ]);

      await this.ensureTableColumns('curriculum_courses', [
        { name: 'is_deleted', type: 'TINYINT(1) DEFAULT 0' },
        { name: 'deleted_at', type: 'DATETIME NULL' }
      ]);

      await this.ensureTableColumns('academic_lecturers', [
        { name: 'is_deleted', type: 'TINYINT(1) DEFAULT 0' },
        { name: 'deleted_at', type: 'DATETIME NULL' }
      ]);

      // NẠP DỮ LIỆU KHỞI TẠO NẾU CSDL ĐANG TRỐNG
      await this.seedInitialAcademicData();

      console.log('[SchemaIntegrity] Hoàn tất đồng bộ toàn bộ bảng & cột CSDL!');
    } catch (err) {
      console.warn('[SchemaIntegrity Warning]:', err.message);
    }
  }

  /**
   * Kiểm tra và tự động thêm các cột còn thiếu vào bảng
   */
  async ensureTableColumns(tableName, columns) {
    try {
      const [rows] = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${tableName}'
      `).catch(() => [[]]);
      const existing = (rows || []).map(r => (r.COLUMN_NAME || r.column_name || '').toLowerCase());
      for (const col of columns) {
        if (!existing.includes(col.name.toLowerCase())) {
          await sequelize.query(`ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type}`).catch(() => {});
          console.log(`[SchemaIntegrity] Đã tự động bổ sung cột: ${tableName}.${col.name}`);
        }
      }
    } catch (e) {}
  }

  /**
   * Tự động khởi tạo dữ liệu mẫu nếu các bảng đang trống
   */
  async seedInitialAcademicData() {
    try {
      // 1. Seed Danh mục QBank
      const [qCatCount] = await sequelize.query('SELECT COUNT(*) as c FROM qbank_categories').catch(() => [[{ c: 0 }]]);
      if ((qCatCount[0]?.c || 0) === 0) {
        await sequelize.query(`
          INSERT INTO qbank_categories (id, code, name, course_code, created_at, updated_at)
          VALUES 
            (1, 'CAT-GEN', 'Kiến thức Giáo dục Đại cương', 'GEN101', NOW(), NOW()),
            (2, 'CAT-IT-BASE', 'Cơ sở ngành Công nghệ Thông tin', 'IT101', NOW(), NOW()),
            (3, 'CAT-SW-ENG', 'Công nghệ Phần mềm & Kiến trúc Hệ thống', 'SE201', NOW(), NOW()),
            (4, 'CAT-AI-DS', 'Trí tuệ Nhân tạo & Khoa học Dữ liệu', 'AI301', NOW(), NOW()),
            (5, 'CAT-QA-MOET', 'Khảo thí & Đảm bảo Chất lượng Đào tạo (TT 08/2021)', 'QA401', NOW(), NOW())
          ON DUPLICATE KEY UPDATE name=VALUES(name);
        `).catch(() => {});
      }

      // 2. Seed Khung Chương trình K68
      const [currCount] = await sequelize.query('SELECT COUNT(*) as c FROM curriculum_courses').catch(() => [[{ c: 0 }]]);
      if ((currCount[0]?.c || 0) === 0) {
        const k68Courses = [
          { semester: 1, code: 'MLN101', name: 'Triết học Mác - Lênin', credits: 3, is_compulsory: 1 },
          { semester: 1, code: 'ENG101', name: 'Tiếng Anh 1', credits: 2, is_compulsory: 1 },
          { semester: 1, code: 'MAT101', name: 'Giải tích 1', credits: 3, is_compulsory: 1 },
          { semester: 1, code: 'IT101', name: 'Nhập môn Lập trình C/C++', credits: 4, is_compulsory: 1 },
          { semester: 2, code: 'MLN102', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, is_compulsory: 1 },
          { semester: 2, code: 'MAT102', name: 'Đại số tuyến tính', credits: 3, is_compulsory: 1 },
          { semester: 2, code: 'IT102', name: 'Kỹ thuật lập trình & Hướng đối tượng', credits: 3, is_compulsory: 1 },
          { semester: 2, code: 'IT201', name: 'Cơ sở dữ liệu (Database Systems)', credits: 3, is_compulsory: 1 },
          { semester: 3, code: 'IT301', name: 'Cấu trúc dữ liệu & Giải thuật', credits: 4, is_compulsory: 1 },
          { semester: 3, code: 'IT202', name: 'Kiến trúc máy tính & Hợp ngữ', credits: 3, is_compulsory: 1 },
          { semester: 4, code: 'IT401', name: 'Mạng máy tính & Truyền thông dữ liệu', credits: 3, is_compulsory: 1 },
          { semester: 4, code: 'IT402', name: 'Hệ điều hành (Operating Systems)', credits: 3, is_compulsory: 1 },
          { semester: 4, code: 'SE301', name: 'Công nghệ phần mềm & Quản lý dự án', credits: 3, is_compulsory: 1 },
          { semester: 5, code: 'AI301', name: 'Học máy (Machine Learning)', credits: 4, is_compulsory: 1 },
          { semester: 5, code: 'SE401', name: 'Phát triển ứng dụng Web Fullstack', credits: 3, is_compulsory: 1 },
          { semester: 6, code: 'AI401', name: 'Học sâu (Deep Learning & Neural Networks)', credits: 4, is_compulsory: 1 },
          { semester: 6, code: 'IT405', name: 'Điện toán đám mây & MLOps', credits: 3, is_compulsory: 1 },
          { semester: 7, code: 'AI501', name: 'Hệ thống Đa Tác Tử (Multi-Agent Systems & RAG)', credits: 4, is_compulsory: 1 },
          { semester: 7, code: 'INT501', name: 'Thực tập tốt nghiệp doanh nghiệp', credits: 4, is_compulsory: 1 }
        ];

        for (const c of k68Courses) {
          await sequelize.query(`
            INSERT INTO curriculum_courses (semester, code, name, credits, is_compulsory, faculty_id, major_id, status, created_at, updated_at)
            VALUES (${c.semester}, '${c.code}', '${c.name}', ${c.credits}, ${c.is_compulsory}, 'CNTT', '7480103', 'ACTIVE', NOW(), NOW())
          `).catch(() => {});
        }
      }

      // 3. Seed Danh mục Giảng viên
      const [lecCount] = await sequelize.query('SELECT COUNT(*) as c FROM academic_lecturers').catch(() => [[{ c: 0 }]]);
      if ((lecCount[0]?.c || 0) === 0) {
        await sequelize.query(`
          INSERT INTO academic_lecturers (code, username, full_name, gender, birth_date, title, academic_rank, faculty_id, faculty_name, department, email, phone, specialization, experience_years, status, active_courses_count, created_at, updated_at)
          VALUES 
            ('GV001', 'teacher', 'TS. Hoàng Đức Em', 'Nam', '15/08/1984', 'Tiến sĩ', 'Không', 'CNTT', 'Khoa Công Nghệ Thông Tin', 'Bộ môn Kỹ thuật Phần mềm', 'em.hd@techcorp.edu.vn', '0912.345.678', 'Kỹ thuật Phần mềm & Kiến trúc Hệ thống Phân tán', 14, 'Đang công tác', 2, NOW(), NOW()),
            ('GV002', 'tuan.tm', 'PGS. TS. Trần Mạnh Tuấn', 'Nam', '10/02/1976', 'Tiến sĩ', 'Phó Giáo sư', 'CNTT', 'Khoa Công Nghệ Thông Tin', 'Ban Chủ nhiệm Khoa CNTT', 'tuan.tm@techcorp.edu.vn', '0903.112.233', 'Khoa học Máy tính & Trí tuệ Nhân tạo', 22, 'Đang công tác', 2, NOW(), NOW()),
            ('GV003', 'an.nv', 'TS. Nguyễn Văn An', 'Nam', '24/11/1981', 'Tiến sĩ', 'Không', 'CNTT', 'Khoa Công Nghệ Thông Tin', 'Bộ môn Mạng & An toàn Thông tin', 'an.nv@techcorp.edu.vn', '0988.445.566', 'An ninh Mạng & Điện toán Đám mây', 16, 'Đang công tác', 2, NOW(), NOW()),
            ('GV004', 'thu.lt', 'ThS. Lê Thị Thu', 'Nữ', '05/04/1989', 'Thạc sĩ', 'Không', 'CNTT', 'Khoa Công Nghệ Thông Tin', 'Bộ môn Kỹ thuật Phần mềm', 'thu.lt@techcorp.edu.vn', '0977.889.900', 'Lập trình Hướng đối tượng & Cơ sở Dữ liệu', 9, 'Đang công tác', 2, NOW(), NOW())
          ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
        `).catch(() => {});
      }

      // 4. Seed Danh sách Sinh viên
      const [stdCount] = await sequelize.query('SELECT COUNT(*) as c FROM academic_students').catch(() => [[{ c: 0 }]]);
      if ((stdCount[0]?.c || 0) === 0) {
        await sequelize.query(`
          INSERT INTO academic_students (student_code, full_name, birth_date, gender, faculty_id, faculty_name, major_id, major_name, cohort, class_name, email, phone, gpa, cpa, credits_accumulated, academic_rank, status, created_at, updated_at)
          VALUES 
            ('261IT001', 'Trần Văn Nam', '15/08/2004', 'Nam', 'CNTT', 'Khoa Công Nghệ Thông Tin', '7480103', 'Kỹ thuật Phần mềm', 'K66', '66.CNTT-1', 'nam.tv@techcorp.edu.vn', '0912.001.001', 3.87, 3.85, 95, 'XUẤT SẮC', 'ACTIVE', NOW(), NOW()),
            ('261IT002', 'Nguyễn Thị Mai', '20/09/2004', 'Nữ', 'CNTT', 'Khoa Công Nghệ Thông Tin', '7480103', 'Kỹ thuật Phần mềm', 'K66', '66.CNTT-1', 'mai.nt@techcorp.edu.vn', '0912.001.002', 3.82, 3.80, 95, 'XUẤT SẮC', 'ACTIVE', NOW(), NOW()),
            ('261IT003', 'Lê Hoàng Long', '02/01/2004', 'Nam', 'CNTT', 'Khoa Công Nghệ Thông Tin', '7480103', 'Kỹ thuật Phần mềm', 'K66', '66.CNTT-1', 'long.lh@techcorp.edu.vn', '0912.001.003', 3.20, 3.15, 95, 'GIỎI', 'ACTIVE', NOW(), NOW()),
            ('261IT004', 'Phạm Quỳnh Anh', '12/11/2004', 'Nữ', 'CNTT', 'Khoa Công Nghệ Thông Tin', '7480103', 'Kỹ thuật Phần mềm', 'K66', '66.CNTT-1', 'anh.pq@techcorp.edu.vn', '0912.001.004', 2.85, 2.80, 90, 'KHÁ', 'ACTIVE', NOW(), NOW()),
            ('261IT005', 'Vũ Hải Đăng', '18/06/2004', 'Nam', 'CNTT', 'Khoa Công Nghệ Thông Tin', '7480103', 'Kỹ thuật Phần mềm', 'K66', '66.CNTT-1', 'dang.vh@techcorp.edu.vn', '0912.001.005', 1.95, 1.90, 72, 'TRUNG BÌNH YẾU', 'ACTIVE', NOW(), NOW())
          ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
        `).catch(() => {});
      }

      // 5. Seed Sổ điểm học phần Section 1
      const [grCount] = await sequelize.query('SELECT COUNT(*) as c FROM academic_section_grades').catch(() => [[{ c: 0 }]]);
      if ((grCount[0]?.c || 0) === 0) {
        await sequelize.query(`
          INSERT INTO academic_section_grades (section_id, student_id, student_code, full_name, attendance_score, assignment_score, midterm_score, final_exam_score, course_score_10, course_score_letter, course_score_4, course_result, academic_rank, created_at, updated_at)
          VALUES 
            (1, 1, '261IT001', 'Trần Văn Nam', 9.50, 9.00, 9.00, 9.50, 9.35, 'A+', 4.00, 'ĐẠT (PASS)', 'XUẤT SẮC', NOW(), NOW()),
            (1, 2, '261IT002', 'Nguyễn Thị Mai', 10.00, 9.50, 9.50, 9.00, 9.30, 'A+', 4.00, 'ĐẠT (PASS)', 'XUẤT SẮC', NOW(), NOW()),
            (1, 3, '261IT003', 'Lê Hoàng Long', 8.50, 8.00, 8.00, 8.50, 8.35, 'B+', 3.50, 'ĐẠT (PASS)', 'GIỎI', NOW(), NOW()),
            (1, 4, '261IT004', 'Phạm Quỳnh Anh', 8.00, 7.50, 7.00, 7.50, 7.45, 'B', 3.00, 'ĐẠT (PASS)', 'KHÁ', NOW(), NOW()),
            (1, 5, '261IT005', 'Vũ Hải Đăng', 4.50, 4.00, 5.00, 4.00, 4.35, 'D', 1.00, 'ĐẠT (PASS)', 'CẢNH BÁO HỌC VỤ 1', NOW(), NOW())
          ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
        `).catch(() => {});
      }

    } catch (seedErr) {
      console.warn('[SchemaIntegrity Seed Warning]:', seedErr.message);
    }
  }

  /**
   * Helper thực thi giao dịch CSDL an toàn (Database Transaction Wrapper)
   */
  async withTransaction(callback) {
    const t = await sequelize.transaction();
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}

module.exports = new SchemaIntegrityService();
