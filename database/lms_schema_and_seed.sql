-- ==========================================================
-- DATABASE SCHEMA & SEED FOR lms.techcorp.info.vn
-- Generated on 2026-09-24T09:54:54.660Z
-- Target Database: lms_db
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `lms_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lms_db`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `course_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `type` enum('Nội bộ','Bên ngoài') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Nội bộ',
  `duration_hours` int DEFAULT NULL,
  `status` enum('Sắp diễn ra','Đang diễn ra','Đã kết thúc') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Sắp diễn ra',
  `created_by` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL,
  `deleted_from_ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` enum('Bồi dưỡng QLNN','Lý luận chính trị','Chuyên môn nghiệp vụ','Tin học/Ngoại ngữ','Khác') COLLATE utf8mb4_general_ci DEFAULT 'Khác',
  `cost` decimal(15,2) DEFAULT '0.00',
  `credit_hours` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `created_by` (`created_by`),
  KEY `fk_courses_deleted_by` (`deleted_by`),
  KEY `idx_courses_deleted_at` (`deleted_at`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`),
  CONSTRAINT `fk_courses_deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for courses (5 rows)
INSERT INTO `courses` (`id`, `course_code`, `course_name`, `description`, `type`, `duration_hours`, `status`, `created_by`, `created_at`, `deleted_at`, `deleted_by`, `deleted_from_ip`, `category`, `cost`, `credit_hours`) VALUES (1, 'COURSE-EOMS-21001', 'Đảm bảo Chất lượng Giáo dục Đại học theo ISO 21001:2018 & AUN-QA 4.0', 'Chương trình bồi dưỡng nghiệp vụ quản lý chất lượng cơ sở giáo dục đại học, đối soát tiêu chuẩn AUN-QA và chu trình cải tiến liên tục PDCA.', 'Nội bộ', 45, 'Đang diễn ra', 1, '2026-09-15 12:53:18', NULL, NULL, NULL, 'Chuyên môn nghiệp vụ', '0.00', 3);
INSERT INTO `courses` (`id`, `course_code`, `course_name`, `description`, `type`, `duration_hours`, `status`, `created_by`, `created_at`, `deleted_at`, `deleted_by`, `deleted_from_ip`, `category`, `cost`, `credit_hours`) VALUES (2, 'COURSE-DIGITAL-PEDAGOGY', 'Ứng dụng AI & Công nghệ Số trong Giảng dạy Đại học Hiện đại', 'Kỹ năng thiết kế bài giảng số, ứng dụng Generative AI hỗ trợ soạn đề thi và giảng dạy kết hợp Blended Learning theo chuẩn Bộ GD&ĐT.', 'Nội bộ', 30, 'Đang diễn ra', 1, '2026-09-15 12:53:18', NULL, NULL, NULL, 'Chuyên môn nghiệp vụ', '0.00', 2);
INSERT INTO `courses` (`id`, `course_code`, `course_name`, `description`, `type`, `duration_hours`, `status`, `created_by`, `created_at`, `deleted_at`, `deleted_by`, `deleted_from_ip`, `category`, `cost`, `credit_hours`) VALUES (3, 'COURSE-CYBERSEC-EDU', 'An toàn Thông tin & Bảo vệ Dữ liệu Cá nhân trong Quản trị ĐH (NĐ 85 & NĐ 13)', 'Trang bị kiến thức an toàn hệ thống thông tin cấp độ 3, quy chế bảo vệ dữ liệu cá nhân của người học và cán bộ theo Nghị định 13/2023/NĐ-CP.', 'Nội bộ', 24, 'Sắp diễn ra', 1, '2026-09-15 12:53:18', NULL, NULL, NULL, 'Tin học/Ngoại ngữ', '0.00', 2);
INSERT INTO `courses` (`id`, `course_code`, `course_name`, `description`, `type`, `duration_hours`, `status`, `created_by`, `created_at`, `deleted_at`, `deleted_by`, `deleted_from_ip`, `category`, `cost`, `credit_hours`) VALUES (4, 'COURSE-HEMIS-DATA', 'Chuẩn hóa Dữ liệu & Báo cáo Chỉ số Đại học theo Thông tư 01/2024/TT-BGDĐT', 'Phương pháp thu thập, thẩm định và đối soát 20 chỉ số chuẩn cơ sở giáo dục đại học để đồng bộ lên hệ thống HEMIS Quốc gia.', 'Nội bộ', 20, 'Sắp diễn ra', 1, '2026-09-15 12:53:18', NULL, NULL, NULL, 'Bồi dưỡng QLNN', '0.00', 1);
INSERT INTO `courses` (`id`, `course_code`, `course_name`, `description`, `type`, `duration_hours`, `status`, `created_by`, `created_at`, `deleted_at`, `deleted_by`, `deleted_from_ip`, `category`, `cost`, `credit_hours`) VALUES (5, 'COURSE-SCIENTIFIC-WRITING', 'Phương pháp Viết & Công bố Bài báo Khoa học Quốc tế Chuẩn Scopus / WoS', 'Quy trình nghiên cứu, cấu trúc bài báo IMRAD, chuẩn mực liêm chính học thuật và kinh nghiệm phản biện các tạp chí quốc tế Q1/Q2.', 'Bên ngoài', 40, 'Đang diễn ra', 1, '2026-09-15 12:53:18', NULL, NULL, NULL, 'Chuyên môn nghiệp vụ', '0.00', 3);

DROP TABLE IF EXISTS `course_sections`;
CREATE TABLE `course_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for course_sections (5 rows)
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES (1, 1, 'Chương 1: Tổng quan Khung Chuẩn ISO 21001:2018 & AUN-QA 4.0', 'Giới thiệu các nguyên tắc quản trị chất lượng trường đại học', 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES (2, 1, 'Chương 2: 15 Tiêu Chuẩn & Bộ Minh Chứng SAR ĐH Nha Trang', 'Phương pháp thu thập và số hóa minh chứng kiểm định', 2, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES (3, 1, 'Chương 3: Kiểm tra Đánh giá & Cấp Chứng chỉ', 'Đánh giá kiến thức kết thúc khóa bồi dưỡng', 3, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES (4, 2, 'Chương 1: Generative AI & Phương pháp Sư phạm Số', 'Ứng dụng mô hình ngôn ngữ lớn LLM trong thiết kế học phần', 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES (5, 2, 'Chương 2: Kiểm tra Đánh giá Năng lực Ứng dụng AI', 'Bài thi kết thúc khóa học', 2, '2026-09-16 06:11:04', '2026-09-16 06:11:04');

DROP TABLE IF EXISTS `course_lessons`;
CREATE TABLE `course_lessons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `course_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_type` enum('video','document','html','quiz') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'video',
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_html` longtext COLLATE utf8mb4_unicode_ci,
  `duration_minutes` int DEFAULT '15',
  `sort_order` int DEFAULT '1',
  `is_mandatory` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_section_id` (`section_id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for course_lessons (8 rows)
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (1, 1, 1, 'Bài 1.1: 11 Nguyên tắc Cốt lõi của Hệ thống Quản trị Tổ chức Giáo dục (EOMS)', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, '<p>Hệ thống ISO 21001:2018 tập trung vào người học và các bên liên quan, đảm bảo môi trường giáo dục công bằng và liêm chính.</p>', 25, 1, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (2, 1, 1, 'Bài 1.2: Cẩm nang Tra cứu & Tài liệu Chuẩn AUN-QA Phiên bản 4.0', 'document', NULL, 'https://aunsec.org/sites/default/files/2020-07/Guide%20to%20AUN-QA%20Assessment%20at%20Programme%20Level%20Version%204.0.pdf', '<p>Tài liệu hướng dẫn tự đánh giá cấp CTĐT theo 15 tiêu chuẩn chuẩn hóa AUN-QA 4.0.</p>', 30, 2, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (3, 2, 1, 'Bài 2.1: Quy trình Thu thập và Mã hóa Minh chứng Kiểm định', 'video', 'https://www.youtube.com/watch?v=LqPEQEEJm0g', NULL, '<p>Quy chuẩn đặt tên mã minh chứng theo Thông tư 04/2016/TT-BGDĐT và AUN-QA: [Mã CTĐT].[Hộp số].[Số thứ tự].</p>', 20, 1, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (4, 2, 1, 'Bài 2.2: Hướng dẫn Viết Báo cáo Tự đánh giá (SAR) 1-Click trên TC COMPASS', 'html', NULL, NULL, '<div class="lesson-content"><h3>Quy trình viết SAR trên hệ thống:</h3><ol><li>Đăng nhập tài khoản Khoa/Bộ môn.</li><li>Gán minh chứng vào từng tiêu chí AUN-QA.</li><li>Nhấn nút "Tự động tạo Báo cáo SAR".</li></ol></div>', 15, 2, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (5, 3, 1, 'Bài 3.1: Bài Kiểm Tra Đánh Giá Năng Lực Chuẩn ISO 21001 & AUN-QA', 'quiz', NULL, NULL, '<p>Bài kiểm tra trắc nghiệm 15 phút đánh giá mức độ hiểu biết về chuẩn kiểm định chất lượng cơ sở giáo dục đại học.</p>', 15, 1, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (6, 4, 2, 'Bài 1: Kỹ thuật Prompt Engineering cho Giảng viên Soạn Giáo án & Đề thi', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, '<p>Hướng dẫn cấu trúc prompt 5 thành phần (Role, Context, Task, Constraints, Format) để tạo ngân hàng câu hỏi trắc nghiệm chuẩn Bloom.</p>', 20, 1, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (7, 4, 2, 'Bài 2: Liêm chính Học thuật & Phát hiện Đạo văn AI trong Bài tập Sinh viên', 'document', NULL, 'https://moet.gov.vn', '<p>Quy định của Bộ GD&ĐT và Đại học Nha Trang về trích dẫn học thuật khi sử dụng công cụ AI hỗ trợ.</p>', 25, 2, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `course_lessons` (`id`, `section_id`, `course_id`, `title`, `lesson_type`, `media_url`, `document_url`, `content_html`, `duration_minutes`, `sort_order`, `is_mandatory`, `created_at`, `updated_at`) VALUES (8, 5, 2, 'Bài 3: Bài Đánh Giá Trắc Nghiệm Sư Phạm Số & AI', 'quiz', NULL, NULL, '<p>Kiểm tra trắc nghiệm 10 phút đánh giá kỹ năng vận dụng AI trong hoạt động đào tạo.</p>', 10, 1, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');

DROP TABLE IF EXISTS `quiz_assessments`;
CREATE TABLE `quiz_assessments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `time_limit_minutes` int DEFAULT '15',
  `passing_score_pct` int DEFAULT '70',
  `max_attempts` int DEFAULT '3',
  `shuffle_questions` tinyint(1) DEFAULT '1',
  `shuffle_options` tinyint(1) DEFAULT '1',
  `show_explanation` tinyint(1) DEFAULT '1',
  `random_question_count` int DEFAULT '0',
  `status` enum('active','draft','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for quiz_assessments (2 rows)
INSERT INTO `quiz_assessments` (`id`, `course_id`, `title`, `description`, `time_limit_minutes`, `passing_score_pct`, `max_attempts`, `shuffle_questions`, `shuffle_options`, `show_explanation`, `random_question_count`, `status`, `created_at`, `updated_at`) VALUES (1, 1, 'Bài Kiểm Tra Kết Khóa: Năng Lực Đảm Bảo Chất Lượng Đại Học', 'Đánh giá kiến thức về bộ tiêu chuẩn ISO 21001:2018 và AUN-QA 4.0 áp dụng tại trường ĐH Nha Trang', 15, 70, 3, 1, 1, 1, 5, 'active', '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_assessments` (`id`, `course_id`, `title`, `description`, `time_limit_minutes`, `passing_score_pct`, `max_attempts`, `shuffle_questions`, `shuffle_options`, `show_explanation`, `random_question_count`, `status`, `created_at`, `updated_at`) VALUES (2, 2, 'Bài Đánh Giá Trắc Nghiệm: Kỹ Năng Sư Phạm Số & AI', 'Đo lường năng lực ứng dụng AI tạo sinh trong biên soạn học liệu và khảo thí đại học', 10, 80, 5, 1, 1, 1, 3, 'active', '2026-09-16 06:11:04', '2026-09-16 06:11:04');

DROP TABLE IF EXISTS `quiz_questions`;
CREATE TABLE `quiz_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `course_id` int NOT NULL,
  `question_type` enum('single_choice','multiple_choice','true_false') COLLATE utf8mb4_unicode_ci DEFAULT 'single_choice',
  `question_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options_json` json NOT NULL,
  `correct_answer` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `explanation` text COLLATE utf8mb4_unicode_ci,
  `points` float DEFAULT '10',
  `sort_order` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_id` (`quiz_id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for quiz_questions (8 rows)
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (1, 1, 1, 'single_choice', 'Bộ tiêu chuẩn AUN-QA 4.0 cấp Chương trình đào tạo bao gồm bao nhiêu tiêu chuẩn?', '[{"key":"A","text":"11 tiêu chuẩn"},{"key":"B","text":"15 tiêu chuẩn"},{"key":"C","text":"8 tiêu chuẩn"},{"key":"D","text":"20 tiêu chuẩn"}]', 'B', 'Bộ tiêu chuẩn AUN-QA 4.0 chính thức rút gọn và tinh giản còn 15 tiêu chuẩn bao quát toàn diện chu trình đào tạo.', 20, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (2, 1, 1, 'single_choice', 'Thang đo đánh giá kết quả tự đánh giá AUN-QA theo quy định hiện hành gồm mấy mức điểm?', '[{"key":"A","text":"Thang điểm 5 bậc (1 - 5)"},{"key":"B","text":"Thang điểm 7 bậc (1 - 7 Likert scale)"},{"key":"C","text":"Thang điểm 10 bậc (1 - 10)"},{"key":"D","text":"Thang điểm 100"}]', 'B', 'AUN-QA sử dụng thang đo 7 bậc: Điểm 4 là Đạt yêu cầu (Adequate), Điểm 5 là Vượt yêu cầu, Điểm 6-7 là Xuất sắc.', 20, 2, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (3, 1, 1, 'single_choice', 'Tiêu chuẩn ISO 21001:2018 áp dụng cấu trúc bậc cao (High-Level Structure) gồm bao nhiêu điều khoản chính?', '[{"key":"A","text":"10 điều khoản (Điều 4 đến Điều 10 chứa yêu cầu cốt lõi)"},{"key":"B","text":"7 điều khoản"},{"key":"C","text":"12 điều khoản"},{"key":"D","text":"15 điều khoản"}]', 'A', 'ISO 21001:2018 chia làm 10 điều khoản tuân thủ HLS, trong đó Điều 4 (Bối cảnh) đến Điều 10 (Cải tiến) là các yêu cầu kiểm soát bắt buộc.', 20, 3, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (4, 1, 1, 'single_choice', 'Hành động khắc phục và phòng ngừa trong ISO (CAPA) được kích hoạt khi nào?', '[{"key":"A","text":"Chỉ khi có chỉ đạo trực tiếp của Bộ GD&ĐT"},{"key":"B","text":"Khi phát hiện sự không phù hợp (NC) trong đánh giá nội bộ hoặc phản hồi người học"},{"key":"C","text":"Khi kết thúc năm tài chính"},{"key":"D","text":"Khi thanh tra tài chính yêu cầu"}]', 'B', 'CAPA (Corrective and Preventive Actions) theo Điều khoản 10.2 bắt buộc kích hoạt khi có sự không phù hợp nhằm tìm nguyên nhân gốc rễ và ngăn ngừa tái diễn.', 20, 4, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (5, 1, 1, 'single_choice', 'Chu trình cải tiến liên tục Deming trong quản lý chất lượng giáo dục viết tắt là gì?', '[{"key":"A","text":"PDCA (Plan - Do - Check - Act)"},{"key":"B","text":"SWOT (Strengths - Weaknesses - Opportunities - Threats)"},{"key":"C","text":"SMART (Specific - Measurable - Achievable - Relevant - Time-bound)"},{"key":"D","text":"OKR (Objectives - Key Results)"}]', 'A', 'Chu trình PDCA (Lập kế hoạch - Thực hiện - Kiểm tra - Cải tiến) là xương sống của mọi hệ thống bảo đảm chất lượng EOMS và AUN-QA.', 20, 5, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (6, 2, 2, 'single_choice', 'Để AI tạo ra bộ câu hỏi trắc nghiệm bám sát chuẩn đầu ra, giảng viên nên cung cấp thành phần nào?', '[{"key":"A","text":"Đề cương chi tiết học phần và Ma trận Chuẩn đầu ra (CLO)"},{"key":"B","text":"Chỉ cần nhập tên môn học"},{"key":"C","text":"Bảng điểm của sinh viên"},{"key":"D","text":"Lịch thi học kỳ"}]', 'A', 'Đề cương chi tiết và chuẩn đầu ra CLO là dữ liệu ngữ cảnh quyết định độ chính xác và tính học thuật của câu hỏi do AI sinh ra.', 33.3, 1, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (7, 2, 2, 'single_choice', 'Theo thang đo nhận thức Bloom cải tiến, bậc cao nhất của tư duy là gì?', '[{"key":"A","text":"Ghi nhớ (Remembering)"},{"key":"B","text":"Phân tích (Analyzing)"},{"key":"C","text":"Đánh giá (Evaluating)"},{"key":"D","text":"Sáng tạo (Creating)"}]', 'D', 'Thang Bloom cải tiến có 6 bậc: Nhớ -> Hiểu -> Vận dụng -> Phân tích -> Đánh giá -> Sáng tạo (cao nhất).', 33.3, 2, '2026-09-16 06:11:04', '2026-09-16 06:11:04');
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `course_id`, `question_type`, `question_text`, `options_json`, `correct_answer`, `explanation`, `points`, `sort_order`, `created_at`, `updated_at`) VALUES (8, 2, 2, 'single_choice', 'Nguyên tắc vàng về liêm chính học thuật khi sử dụng AI trong giảng dạy là gì?', '[{"key":"A","text":"Giảng viên chịu trách nhiệm thẩm định cuối cùng về tính chính xác và minh bạch công khai nguồn hỗ trợ"},{"key":"B","text":"Tin tưởng tuyệt đối 100% câu trả lời của AI"},{"key":"C","text":"Không cần kiểm tra lại tài liệu trích dẫn"},{"key":"D","text":"Cấm hoàn toàn sinh viên sử dụng máy tính"}]', 'A', 'Giảng viên luôn là người chịu trách nhiệm chuyên môn cuối cùng đối với mọi nội dung học thuật trước người học và nhà trường.', 33.4, 3, '2026-09-16 06:11:04', '2026-09-16 06:11:04');

DROP TABLE IF EXISTS `quiz_submissions`;
CREATE TABLE `quiz_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `course_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `attempt_number` int DEFAULT '1',
  `score_achieved` float NOT NULL,
  `score_percentage` float NOT NULL,
  `is_passed` tinyint(1) NOT NULL,
  `time_spent_seconds` int DEFAULT '0',
  `answers_detail` json DEFAULT NULL,
  `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_id` (`quiz_id`),
  KEY `idx_employee_id` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for quiz_submissions (1 rows)
INSERT INTO `quiz_submissions` (`id`, `quiz_id`, `course_id`, `employee_id`, `attempt_number`, `score_achieved`, `score_percentage`, `is_passed`, `time_spent_seconds`, `answers_detail`, `submitted_at`) VALUES (1, 1, 1, 53, 1, 100, 100, 1, 180, '[{"options":[{"key":"A","text":"11 tiêu chuẩn"},{"key":"B","text":"15 tiêu chuẩn"},{"key":"C","text":"8 tiêu chuẩn"},{"key":"D","text":"20 tiêu chuẩn"}],"is_correct":true,"explanation":"Bộ tiêu chuẩn AUN-QA 4.0 chính thức rút gọn và tinh giản còn 15 tiêu chuẩn bao quát toàn diện chu trình đào tạo.","question_id":1,"points_earned":20,"question_text":"Bộ tiêu chuẩn AUN-QA 4.0 cấp Chương trình đào tạo bao gồm bao nhiêu tiêu chuẩn?","correct_answer":"B","student_answer":"B"},{"options":[{"key":"A","text":"Thang điểm 5 bậc (1 - 5)"},{"key":"B","text":"Thang điểm 7 bậc (1 - 7 Likert scale)"},{"key":"C","text":"Thang điểm 10 bậc (1 - 10)"},{"key":"D","text":"Thang điểm 100"}],"is_correct":true,"explanation":"AUN-QA sử dụng thang đo 7 bậc: Điểm 4 là Đạt yêu cầu (Adequate), Điểm 5 là Vượt yêu cầu, Điểm 6-7 là Xuất sắc.","question_id":2,"points_earned":20,"question_text":"Thang đo đánh giá kết quả tự đánh giá AUN-QA theo quy định hiện hành gồm mấy mức điểm?","correct_answer":"B","student_answer":"B"},{"options":[{"key":"A","text":"10 điều khoản (Điều 4 đến Điều 10 chứa yêu cầu cốt lõi)"},{"key":"B","text":"7 điều khoản"},{"key":"C","text":"12 điều khoản"},{"key":"D","text":"15 điều khoản"}],"is_correct":true,"explanation":"ISO 21001:2018 chia làm 10 điều khoản tuân thủ HLS, trong đó Điều 4 (Bối cảnh) đến Điều 10 (Cải tiến) là các yêu cầu kiểm soát bắt buộc.","question_id":3,"points_earned":20,"question_text":"Tiêu chuẩn ISO 21001:2018 áp dụng cấu trúc bậc cao (High-Level Structure) gồm bao nhiêu điều khoản chính?","correct_answer":"A","student_answer":"A"},{"options":[{"key":"A","text":"Chỉ khi có chỉ đạo trực tiếp của Bộ GD&ĐT"},{"key":"B","text":"Khi phát hiện sự không phù hợp (NC) trong đánh giá nội bộ hoặc phản hồi người học"},{"key":"C","text":"Khi kết thúc năm tài chính"},{"key":"D","text":"Khi thanh tra tài chính yêu cầu"}],"is_correct":true,"explanation":"CAPA (Corrective and Preventive Actions) theo Điều khoản 10.2 bắt buộc kích hoạt khi có sự không phù hợp nhằm tìm nguyên nhân gốc rễ và ngăn ngừa tái diễn.","question_id":4,"points_earned":20,"question_text":"Hành động khắc phục và phòng ngừa trong ISO (CAPA) được kích hoạt khi nào?","correct_answer":"B","student_answer":"B"},{"options":[{"key":"A","text":"PDCA (Plan - Do - Check - Act)"},{"key":"B","text":"SWOT (Strengths - Weaknesses - Opportunities - Threats)"},{"key":"C","text":"SMART (Specific - Measurable - Achievable - Relevant - Time-bound)"},{"key":"D","text":"OKR (Objectives - Key Results)"}],"is_correct":true,"explanation":"Chu trình PDCA (Lập kế hoạch - Thực hiện - Kiểm tra - Cải tiến) là xương sống của mọi hệ thống bảo đảm chất lượng EOMS và AUN-QA.","question_id":5,"points_earned":20,"question_text":"Chu trình cải tiến liên tục Deming trong quản lý chất lượng giáo dục viết tắt là gì?","correct_answer":"A","student_answer":"A"}]', '2026-09-16 06:12:18');

DROP TABLE IF EXISTS `course_certificates`;
CREATE TABLE `course_certificates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certificate_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `final_score` float NOT NULL,
  `issued_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `pdf_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_code` (`certificate_code`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for course_certificates (1 rows)
INSERT INTO `course_certificates` (`id`, `certificate_code`, `course_id`, `employee_id`, `final_score`, `issued_at`, `pdf_url`) VALUES (1, 'NTU-CERT-2026-942001', 1, 53, 100, '2026-09-16 06:12:18', NULL);

DROP TABLE IF EXISTS `qbank_categories`;
CREATE TABLE `qbank_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `clo_tag` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for qbank_categories (7 rows)
INSERT INTO `qbank_categories` (`id`, `course_id`, `parent_id`, `name`, `description`, `clo_tag`, `created_at`, `updated_at`) VALUES (1, 1, NULL, 'Mạng máy tính (Gốc)', NULL, 'CLO1', '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_categories` (`id`, `course_id`, `parent_id`, `name`, `description`, `clo_tag`, `created_at`, `updated_at`) VALUES (2, 1, 1, 'Chương 1: Tổng quan', NULL, NULL, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_categories` (`id`, `course_id`, `parent_id`, `name`, `description`, `clo_tag`, `created_at`, `updated_at`) VALUES (3, 1, 1, 'Chương 2: Tầng ứng dụng (Application Layer)', NULL, NULL, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_categories` (`id`, `course_id`, `parent_id`, `name`, `description`, `clo_tag`, `created_at`, `updated_at`) VALUES (4, 72, NULL, 'Ngân hàng câu hỏi Marketing Căn bản', 'NHCH môn Marketing Căn bản', NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_categories` (`id`, `course_id`, `parent_id`, `name`, `description`, `clo_tag`, `created_at`, `updated_at`) VALUES (5, 73, NULL, 'Ngân hàng câu hỏi Quản trị học', 'NHCH môn Quản trị học', NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_categories` (`id`, `course_id`, `parent_id`, `name`, `description`, `clo_tag`, `created_at`, `updated_at`) VALUES (6, 42, NULL, 'Ngân hàng câu hỏi Tiếng Anh Giao tiếp 1', 'NHCH môn Tiếng Anh Giao tiếp 1', NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_categories` (`id`, `course_id`, `parent_id`, `name`, `description`, `clo_tag`, `created_at`, `updated_at`) VALUES (7, 46, NULL, 'Ngân hàng câu hỏi Tiếng Anh Chuyên ngành', 'NHCH môn Tiếng Anh Chuyên ngành', NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');

DROP TABLE IF EXISTS `qbank_questions`;
CREATE TABLE `qbank_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `question_type` enum('MULTIPLE_CHOICE','MULTIPLE_RESPONSE','TRUE_FALSE','FILL_BLANK','ESSAY') NOT NULL,
  `difficulty` enum('EASY','MEDIUM','HARD','EXPERT') DEFAULT 'MEDIUM',
  `content` text NOT NULL,
  `default_mark` decimal(5,2) DEFAULT '1.00',
  `general_feedback` text,
  `status` enum('DRAFT','APPROVED','REJECTED') DEFAULT 'DRAFT',
  `created_by` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for qbank_questions (27 rows)
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (1, 2, 'MULTIPLE_CHOICE', 'EASY', '<p>Mô hình OSI có bao nhiêu tầng?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (2, 3, 'ESSAY', 'HARD', '<p>Trình bày điểm khác biệt giữa TCP và UDP. Khi nào nên dùng UDP?</p>', '5.00', 'TCP hướng kết nối, tin cậy. UDP không kết nối, nhanh.', 'APPROVED', NULL, NULL, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (3, 2, 'MULTIPLE_CHOICE', 'EASY', '<p>Câu hỏi phụ 1: IPv4 có bao nhiêu bit?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (4, 2, 'MULTIPLE_CHOICE', 'EASY', '<p>Câu hỏi phụ 2: IPv4 có bao nhiêu bit?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (5, 2, 'MULTIPLE_CHOICE', 'EASY', '<p>Câu hỏi phụ 3: IPv4 có bao nhiêu bit?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (6, 2, 'MULTIPLE_CHOICE', 'EASY', '<p>Câu hỏi phụ 4: IPv4 có bao nhiêu bit?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (7, 2, 'MULTIPLE_CHOICE', 'EASY', '<p>Câu hỏi phụ 5: IPv4 có bao nhiêu bit?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (8, 4, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 1 môn Marketing Căn bản?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (9, 4, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 2 môn Marketing Căn bản?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (10, 4, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 3 môn Marketing Căn bản?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (11, 4, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 4 môn Marketing Căn bản?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (12, 4, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 5 môn Marketing Căn bản?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (13, 5, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 1 môn Quản trị học?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (14, 5, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 2 môn Quản trị học?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (15, 5, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 3 môn Quản trị học?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (16, 5, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 4 môn Quản trị học?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (17, 5, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 5 môn Quản trị học?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (18, 6, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 1 môn Tiếng Anh Giao tiếp 1?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (19, 6, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 2 môn Tiếng Anh Giao tiếp 1?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (20, 6, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 3 môn Tiếng Anh Giao tiếp 1?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (21, 6, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 4 môn Tiếng Anh Giao tiếp 1?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (22, 6, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 5 môn Tiếng Anh Giao tiếp 1?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (23, 7, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 1 môn Tiếng Anh Chuyên ngành?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (24, 7, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 2 môn Tiếng Anh Chuyên ngành?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (25, 7, 'MULTIPLE_CHOICE', 'MEDIUM', '<p>Câu hỏi trắc nghiệm số 3 môn Tiếng Anh Chuyên ngành?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (26, 7, 'MULTIPLE_CHOICE', 'HARD', '<p>Câu hỏi trắc nghiệm số 4 môn Tiếng Anh Chuyên ngành?</p>', '1.00', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-20 21:03:48');
INSERT INTO `qbank_questions` (`id`, `category_id`, `question_type`, `difficulty`, `content`, `default_mark`, `general_feedback`, `status`, `created_by`, `approved_by`, `created_at`, `updated_at`) VALUES (27, 7, 'MULTIPLE_CHOICE', 'HARD', 'Câu hỏi trắc nghiệm số 5 môn Tiếng Anh Chuyên ngành? (Đã cập nhật cấu trúc)', '1.50', NULL, 'APPROVED', NULL, NULL, '2026-09-20 21:03:48', '2026-09-21 08:00:10');

DROP TABLE IF EXISTS `qbank_answers`;
CREATE TABLE `qbank_answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `content` text NOT NULL,
  `fraction` decimal(5,2) DEFAULT '0.00',
  `feedback` text,
  `sort_order` int DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for qbank_answers (32 rows)
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (1, 1, '5 tầng', '0.00', NULL, 0, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (2, 1, '6 tầng', '0.00', NULL, 0, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (3, 1, '7 tầng', '1.00', NULL, 0, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (4, 1, '8 tầng', '0.00', NULL, 0, '2026-09-20 00:54:11', '2026-09-20 00:54:11');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (5, 2, 'TCP là giao thức hướng kết nối tin cậy, UDP là giao thức không hướng kết nối', '1.00', NULL, 0, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (6, 2, 'TCP và UDP đều truyền tin cậy và có cơ chế bắt tay 3 bước', '0.00', NULL, 1, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (7, 2, 'UDP kiểm soát tắc nghẽn tốt hơn và truyền chậm hơn TCP', '0.00', NULL, 2, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (8, 2, 'Cả hai giao thức hoạt động tại tầng Liên kết dữ liệu (Data Link)', '0.00', NULL, 3, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (9, 3, '16 bit', '0.00', NULL, 0, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (10, 3, '32 bit (Địa chỉ chuẩn 4 byte)', '1.00', NULL, 1, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (11, 3, '64 bit', '0.00', NULL, 2, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (12, 3, '128 bit (Chuẩn của IPv6)', '0.00', NULL, 3, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (13, 4, '16 bit', '0.00', NULL, 0, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (14, 4, '32 bit (Địa chỉ chuẩn 4 byte)', '1.00', NULL, 1, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (15, 4, '64 bit', '0.00', NULL, 2, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (16, 4, '128 bit (Chuẩn của IPv6)', '0.00', NULL, 3, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (17, 5, '16 bit', '0.00', NULL, 0, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (18, 5, '32 bit (Địa chỉ chuẩn 4 byte)', '1.00', NULL, 1, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (19, 5, '64 bit', '0.00', NULL, 2, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (20, 5, '128 bit (Chuẩn của IPv6)', '0.00', NULL, 3, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (21, 6, '16 bit', '0.00', NULL, 0, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (22, 6, '32 bit (Địa chỉ chuẩn 4 byte)', '1.00', NULL, 1, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (23, 6, '64 bit', '0.00', NULL, 2, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (24, 6, '128 bit (Chuẩn của IPv6)', '0.00', NULL, 3, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (25, 7, '16 bit', '0.00', NULL, 0, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (26, 7, '32 bit (Địa chỉ chuẩn 4 byte)', '1.00', NULL, 1, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (27, 7, '64 bit', '0.00', NULL, 2, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (28, 7, '128 bit (Chuẩn của IPv6)', '0.00', NULL, 3, '2026-09-21 07:47:35', '2026-09-21 07:47:35');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (29, 27, 'Tùy chọn A', '0.00', NULL, 1, '2026-09-21 08:00:10', '2026-09-21 08:00:10');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (30, 27, 'Tùy chọn B (Chính xác)', '1.00', NULL, 2, '2026-09-21 08:00:10', '2026-09-21 08:00:10');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (31, 27, 'Tùy chọn C', '0.00', NULL, 3, '2026-09-21 08:00:10', '2026-09-21 08:00:10');
INSERT INTO `qbank_answers` (`id`, `question_id`, `content`, `fraction`, `feedback`, `sort_order`, `created_at`, `updated_at`) VALUES (32, 27, 'Tùy chọn D', '0.00', NULL, 4, '2026-09-21 08:00:10', '2026-09-21 08:00:10');

DROP TABLE IF EXISTS `exam_templates`;
CREATE TABLE `exam_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_marks` decimal(5,2) DEFAULT '10.00',
  `duration_minutes` int DEFAULT '60',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for exam_templates (1 rows)
INSERT INTO `exam_templates` (`id`, `course_id`, `name`, `total_marks`, `duration_minutes`, `created_by`, `created_at`, `updated_at`) VALUES (1, 1, 'Đề thi Giữa kỳ - Mạng máy tính', '3.00', 45, NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');

DROP TABLE IF EXISTS `exam_template_rules`;
CREATE TABLE `exam_template_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `template_id` int NOT NULL,
  `category_id` int NOT NULL,
  `difficulty` enum('EASY','MEDIUM','HARD','EXPERT','ANY') DEFAULT 'ANY',
  `question_type` varchar(50) DEFAULT 'ANY',
  `quantity` int NOT NULL DEFAULT '1',
  `mark_per_question` decimal(5,2) DEFAULT '1.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for exam_template_rules (1 rows)
INSERT INTO `exam_template_rules` (`id`, `template_id`, `category_id`, `difficulty`, `question_type`, `quantity`, `mark_per_question`, `created_at`, `updated_at`) VALUES (1, 1, 2, 'EASY', 'MULTIPLE_CHOICE', 3, '1.00', '2026-09-20 00:57:34', '2026-09-20 00:57:34');

DROP TABLE IF EXISTS `exam_papers`;
CREATE TABLE `exam_papers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `template_id` int DEFAULT NULL,
  `paper_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_marks` decimal(5,2) DEFAULT '10.00',
  `status` enum('DRAFT','APPROVED','LOCKED') DEFAULT 'DRAFT',
  `approved_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `paper_code` (`paper_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for exam_papers (12 rows)
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (1, 1, '101', 'Đề thi chính thức số 1', '3.00', 'DRAFT', NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (2, 1, '102', 'Đề thi chính thức số 2', '3.00', 'DRAFT', NULL, '2026-09-20 00:57:34', '2026-09-20 00:57:34');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (3, NULL, 'DE-1-7332', 'Đề Thi Tự Động Test Matrix', '10.00', 'APPROVED', NULL, '2026-09-21 07:25:27', '2026-09-21 07:25:27');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (4, NULL, 'DE-1-6057', 'Đề Thi Tự Động Test Matrix', '10.00', 'APPROVED', NULL, '2026-09-21 07:25:56', '2026-09-21 07:25:56');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (5, NULL, 'DE-1-5270', 'Đề Thi Tự Động Test Matrix', '10.00', 'APPROVED', NULL, '2026-09-21 07:26:05', '2026-09-21 07:26:05');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (6, NULL, 'DE-1-9297', 'Đề Thi Tự Động Test Matrix', '10.00', 'APPROVED', NULL, '2026-09-21 07:26:19', '2026-09-21 07:26:19');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (7, NULL, 'DE-1-8480', 'Đề Thi Tự Động Test Matrix', '10.00', 'APPROVED', NULL, '2026-09-21 07:26:38', '2026-09-21 07:26:38');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (8, NULL, 'DE-1-7862', 'Đề Thi Tự Động Test Matrix', '10.00', 'APPROVED', NULL, '2026-09-21 07:27:07', '2026-09-21 07:27:07');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (9, NULL, 'EXAM_101', 'Đề thi chính thức 101 - MAT101 - Giải tích 1', '10.00', 'DRAFT', NULL, '2026-09-21 07:41:15', '2026-09-21 07:44:18');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (10, NULL, 'EXAM_102', 'Đề thi chính thức 102 - MAT101 - Giải tích 1', '10.00', 'DRAFT', 1, '2026-09-21 07:41:15', '2026-09-21 07:44:18');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (11, NULL, 'EXAM_103', 'Đề thi chính thức 103 - MAT101 - Giải tích 1', '10.00', 'DRAFT', NULL, '2026-09-21 07:44:18', '2026-09-21 07:44:18');
INSERT INTO `exam_papers` (`id`, `template_id`, `paper_code`, `name`, `total_marks`, `status`, `approved_by`, `created_at`, `updated_at`) VALUES (12, NULL, 'EXAM_104', 'Đề thi chính thức 104 - MAT101 - Giải tích 1', '10.00', 'DRAFT', NULL, '2026-09-21 07:44:18', '2026-09-21 07:44:18');

DROP TABLE IF EXISTS `exam_paper_questions`;
CREATE TABLE `exam_paper_questions` (
  `paper_id` int NOT NULL,
  `question_id` int NOT NULL,
  `mark_allocated` decimal(5,2) DEFAULT '1.00',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`paper_id`,`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for exam_paper_questions (49 rows)
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (1, 3, '1.00', 1);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (1, 4, '1.00', 2);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (1, 6, '1.00', 3);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (2, 1, '1.00', 2);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (2, 3, '1.00', 1);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (2, 5, '1.00', 3);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (4, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (4, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (4, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (5, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (5, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (5, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (6, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (6, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (6, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (7, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (7, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (7, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (8, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (8, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (8, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (9, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (9, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (9, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (9, 4, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (9, 5, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (9, 6, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (9, 7, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (10, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (10, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (10, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (10, 4, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (10, 5, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (10, 6, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (10, 7, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (11, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (11, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (11, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (11, 4, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (11, 5, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (11, 6, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (11, 7, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (12, 1, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (12, 2, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (12, 3, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (12, 4, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (12, 5, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (12, 6, '1.00', 0);
INSERT INTO `exam_paper_questions` (`paper_id`, `question_id`, `mark_allocated`, `sort_order`) VALUES (12, 7, '1.00', 0);

DROP TABLE IF EXISTS `academic_exam_schedules`;
CREATE TABLE `academic_exam_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `course_id` int NOT NULL,
  `semester_id` int NOT NULL,
  `exam_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exam_date` date NOT NULL,
  `exam_shift` int DEFAULT '1',
  `start_time` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '07:30',
  `end_time` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '09:00',
  `room_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proctor_1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'ThS. Giám Thị 1',
  `proctor_2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'ThS. Giám Thị 2',
  `total_candidates` int DEFAULT '45',
  `barred_candidates` int DEFAULT '0',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'SCHEDULED',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `exam_format` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'ONLINE',
  `paper_id` int DEFAULT NULL,
  `duration_minutes` int DEFAULT '60',
  PRIMARY KEY (`id`),
  KEY `idx_exam_section` (`section_id`),
  KEY `idx_exam_date` (`exam_date`),
  KEY `course_id` (`course_id`),
  KEY `semester_id` (`semester_id`),
  CONSTRAINT `academic_exam_schedules_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `academic_class_sections` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `academic_exam_schedules_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `academic_courses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `academic_exam_schedules_ibfk_3` FOREIGN KEY (`semester_id`) REFERENCES `academic_semesters` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for academic_exam_schedules (6 rows)
INSERT INTO `academic_exam_schedules` (`id`, `section_id`, `course_id`, `semester_id`, `exam_name`, `exam_date`, `exam_shift`, `start_time`, `end_time`, `room_name`, `proctor_1`, `proctor_2`, `total_candidates`, `barred_candidates`, `status`, `created_at`, `updated_at`, `exam_format`, `paper_id`, `duration_minutes`) VALUES (1, 1, 5, 1, 'Thi KTHP Cơ sở Dữ liệu (261.IT201.01)', '2027-01-04 17:00:00', 1, '07:30', '09:00', 'G3-201', 'ThS. Trần Văn Minh', 'ThS. Lê Thúy Hạnh', 45, 1, 'GRADES_EXTRACTED', '2026-09-17 07:14:53', '2026-09-21 07:08:04', 'ONLINE', NULL, 60);
INSERT INTO `academic_exam_schedules` (`id`, `section_id`, `course_id`, `semester_id`, `exam_name`, `exam_date`, `exam_shift`, `start_time`, `end_time`, `room_name`, `proctor_1`, `proctor_2`, `total_candidates`, `barred_candidates`, `status`, `created_at`, `updated_at`, `exam_format`, `paper_id`, `duration_minutes`) VALUES (2, 2, 6, 1, 'Thi KTHP Kỹ thuật Lập trình (261.IT202.01)', '2027-01-06 17:00:00', 2, '09:30', '11:00', 'G3-202', 'ThS. Nguyễn Văn Toàn', 'ThS. Phạm Thu Trang', 40, 2, 'SCHEDULED', '2026-09-17 07:14:53', '2026-09-17 07:14:53', 'ONLINE', NULL, 60);
INSERT INTO `academic_exam_schedules` (`id`, `section_id`, `course_id`, `semester_id`, `exam_name`, `exam_date`, `exam_shift`, `start_time`, `end_time`, `room_name`, `proctor_1`, `proctor_2`, `total_candidates`, `barred_candidates`, `status`, `created_at`, `updated_at`, `exam_format`, `paper_id`, `duration_minutes`) VALUES (3, 3, 1, 1, 'Thi KTHP Giải tích 1 (261.MAT101.01)', '2027-01-09 17:00:00', 3, '13:30', '15:00', 'Hội trường 1', 'TS. Vũ Quang Hải', 'ThS. Đỗ Hồng Quân', 60, 3, 'SCHEDULED', '2026-09-17 07:14:53', '2026-09-17 07:14:53', 'ONLINE', NULL, 60);
INSERT INTO `academic_exam_schedules` (`id`, `section_id`, `course_id`, `semester_id`, `exam_name`, `exam_date`, `exam_shift`, `start_time`, `end_time`, `room_name`, `proctor_1`, `proctor_2`, `total_candidates`, `barred_candidates`, `status`, `created_at`, `updated_at`, `exam_format`, `paper_id`, `duration_minutes`) VALUES (4, 4, 2, 1, 'Thi KTHP Đại số Tuyến tính (261.MAT102.01)', '2027-01-11 17:00:00', 1, '07:30', '09:00', 'G3-101', 'TS. Đặng Thanh Tùng', 'ThS. Ngô Phương Mai', 55, 1, 'SCHEDULED', '2026-09-17 07:14:53', '2026-09-17 07:14:53', 'ONLINE', NULL, 60);
INSERT INTO `academic_exam_schedules` (`id`, `section_id`, `course_id`, `semester_id`, `exam_name`, `exam_date`, `exam_shift`, `start_time`, `end_time`, `room_name`, `proctor_1`, `proctor_2`, `total_candidates`, `barred_candidates`, `status`, `created_at`, `updated_at`, `exam_format`, `paper_id`, `duration_minutes`) VALUES (5, 5, 4, 1, 'Thi KTHP Nhập môn Lập trình (261.IT101.01)', '2027-01-13 17:00:00', 4, '15:30', '17:00', 'Lab PM 01', 'ThS. Bùi Tuấn Anh', 'ThS. Chu Quỳnh Anh', 42, 0, 'SCHEDULED', '2026-09-17 07:14:53', '2026-09-17 07:14:53', 'ONLINE', NULL, 60);
INSERT INTO `academic_exam_schedules` (`id`, `section_id`, `course_id`, `semester_id`, `exam_name`, `exam_date`, `exam_shift`, `start_time`, `end_time`, `room_name`, `proctor_1`, `proctor_2`, `total_candidates`, `barred_candidates`, `status`, `created_at`, `updated_at`, `exam_format`, `paper_id`, `duration_minutes`) VALUES (6, 1, 5, 1, 'Thi KTHP Cơ sở Dữ liệu (Database Systems) (261.IT201.01) - Trực Tuyến', '2026-09-20 17:00:00', 1, '00:00', '23:59', 'Phòng Máy 302 - E-Testing', 'ThS. Nguyễn Văn Minh', 'ThS. Trần Thị Mai', 45, 0, 'IN_PROGRESS', '2026-09-21 08:08:18', '2026-09-21 08:08:18', 'ONLINE', NULL, 60);

DROP TABLE IF EXISTS `academic_exam_candidates`;
CREATE TABLE `academic_exam_candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schedule_id` int NOT NULL,
  `student_id` int NOT NULL,
  `seat_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anonymized_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_barred` tinyint(1) DEFAULT '0',
  `barred_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attendance_check` tinyint(1) DEFAULT '1',
  `raw_score_examiner_1` decimal(4,2) DEFAULT NULL,
  `raw_score_examiner_2` decimal(4,2) DEFAULT NULL,
  `final_exam_score` decimal(4,2) DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sched_student` (`schedule_id`,`student_id`),
  KEY `idx_cand_sched` (`schedule_id`),
  KEY `idx_cand_code` (`anonymized_code`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `academic_exam_candidates_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `academic_exam_schedules` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `academic_exam_candidates_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `academic_students` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for academic_exam_candidates (5 rows)
INSERT INTO `academic_exam_candidates` (`id`, `schedule_id`, `student_id`, `seat_number`, `anonymized_code`, `is_barred`, `barred_reason`, `attendance_check`, `raw_score_examiner_1`, `raw_score_examiner_2`, `final_exam_score`, `notes`, `created_at`, `updated_at`) VALUES (1, 1, 1, 'P1-01', 'PHACH-8831', 0, NULL, 1, '8.50', '8.50', '8.50', NULL, '2026-09-17 11:30:00', '2026-09-17 11:30:00');
INSERT INTO `academic_exam_candidates` (`id`, `schedule_id`, `student_id`, `seat_number`, `anonymized_code`, `is_barred`, `barred_reason`, `attendance_check`, `raw_score_examiner_1`, `raw_score_examiner_2`, `final_exam_score`, `notes`, `created_at`, `updated_at`) VALUES (2, 1, 2, 'P1-02', 'PHACH-8832', 0, NULL, 1, '7.00', '7.50', '7.25', NULL, '2026-09-17 11:30:00', '2026-09-17 11:30:00');
INSERT INTO `academic_exam_candidates` (`id`, `schedule_id`, `student_id`, `seat_number`, `anonymized_code`, `is_barred`, `barred_reason`, `attendance_check`, `raw_score_examiner_1`, `raw_score_examiner_2`, `final_exam_score`, `notes`, `created_at`, `updated_at`) VALUES (3, 1, 3, 'P1-03', 'PHACH-8833', 0, NULL, 1, '9.00', '9.00', '9.00', NULL, '2026-09-17 11:30:00', '2026-09-17 11:30:00');
INSERT INTO `academic_exam_candidates` (`id`, `schedule_id`, `student_id`, `seat_number`, `anonymized_code`, `is_barred`, `barred_reason`, `attendance_check`, `raw_score_examiner_1`, `raw_score_examiner_2`, `final_exam_score`, `notes`, `created_at`, `updated_at`) VALUES (4, 1, 4, 'P1-04', 'PHACH-8834', 1, 'Vắng 28% số tiết lý thuyết (vượt quá 20% theo quy chế)', 0, '0.00', '0.00', '0.00', NULL, '2026-09-17 11:30:00', '2026-09-17 11:30:00');
INSERT INTO `academic_exam_candidates` (`id`, `schedule_id`, `student_id`, `seat_number`, `anonymized_code`, `is_barred`, `barred_reason`, `attendance_check`, `raw_score_examiner_1`, `raw_score_examiner_2`, `final_exam_score`, `notes`, `created_at`, `updated_at`) VALUES (5, 1, 5, 'P1-05', 'PHACH-8835', 0, NULL, 1, '6.00', '6.50', '6.25', NULL, '2026-09-17 11:30:00', '2026-09-17 11:30:00');

-- Standalone LMS users and admin
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL UNIQUE,
  `email` varchar(150) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `role` varchar(50) DEFAULT "student",
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `role`) VALUES
(1, "admin", "admin@techcorp.info.vn", "$2a$10$wN9iLd4Ehyo9f14bUfQv3eS1fH9eS.Kk7vW6zZpU3o7qM5s5s9M5a", "Quản trị viên LMS", "admin"),
(2, "teacher", "giangvien@techcorp.info.vn", "$2a$10$wN9iLd4Ehyo9f14bUfQv3eS1fH9eS.Kk7vW6zZpU3o7qM5s5s9M5a", "Giảng viên TS. Nguyễn Văn A", "teacher"),
(3, "student", "sinhvien@techcorp.info.vn", "$2a$10$wN9iLd4Ehyo9f14bUfQv3eS1fH9eS.Kk7vW6zZpU3o7qM5s5s9M5a", "Sinh viên Trần Văn Nam", "student");

SET FOREIGN_KEY_CHECKS = 1;
