// backend/controllers/academicEnterprise.controller.js
// Enterprise Academic Modules: Catalogs, Teaching Assignments, AI Studio, 3 Exam Papers, Moderation & MOET Gradebooks
const { User, Course, CourseSection } = require('../models');
const aiService = require('../services/aiService');

// ==================== 1. CÁC DANH MỤC CƠ SỞ CHUẨN ĐẠI HỌC ====================

// 1.1. Danh mục Giảng viên (Đầy đủ Thông tin Cơ bản & Chuyên môn)
let lecturersCatalog = [
  {
    id: 1,
    code: 'GV001',
    username: 'teacher',
    full_name: 'TS. Hoàng Đức Em',
    gender: 'Nam',
    birth_date: '15/08/1984',
    title: 'Tiến sĩ',
    academic_rank: 'Không',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Bộ môn Kỹ thuật Phần mềm',
    email: 'em.hd@techcorp.edu.vn',
    phone: '0912.345.678',
    specialization: 'Kỹ thuật Phần mềm & Kiến trúc Hệ thống Phân tán',
    experience_years: 14,
    assigned_courses: ['Nhập môn Lập trình C/C++', 'Cơ sở Dữ liệu'],
    research_interests: 'AI trong Giáo dục, Clean Code, Microservices, CI/CD DevOps',
    status: 'Đang công tác',
    active_courses_count: 2
  },
  {
    id: 2,
    code: 'GV002',
    username: 'tuan.tm',
    full_name: 'PGS. TS. Trần Mạnh Tuấn',
    gender: 'Nam',
    birth_date: '10/02/1976',
    title: 'Tiến sĩ',
    academic_rank: 'Phó Giáo sư',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Ban Chủ nhiệm Khoa CNTT',
    email: 'tuan.tm@techcorp.edu.vn',
    phone: '0903.112.233',
    specialization: 'Khoa học Máy tính & Trí tuệ Nhân tạo',
    experience_years: 22,
    assigned_courses: ['Học máy Nâng cao', 'Trí tuệ Nhân tạo', 'Thị giác Máy tính'],
    research_interests: 'Deep Learning, Xử lý ảnh y tế, Hệ thống đa tác tử (Multi-Agent)',
    status: 'Đang công tác',
    active_courses_count: 2
  },
  {
    id: 3,
    code: 'GV003',
    username: 'an.nv',
    full_name: 'TS. Nguyễn Văn An',
    gender: 'Nam',
    birth_date: '24/11/1981',
    title: 'Tiến sĩ',
    academic_rank: 'Không',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Trưởng bộ môn Kỹ thuật Phần mềm',
    email: 'an.nv@techcorp.edu.vn',
    phone: '0988.776.655',
    specialization: 'Công nghệ Phần mềm & Kiểm thử Chất lượng (QA/QC)',
    experience_years: 16,
    assigned_courses: ['Công nghệ Phần mềm', 'Lập trình Hướng đối tượng C++'],
    research_interests: 'Mô hình hóa phần mềm, Agile/Scrum, An toàn bảo mật ứng dụng',
    status: 'Đang công tác',
    active_courses_count: 1
  },
  {
    id: 4,
    code: 'GV004',
    username: 'anh.cq',
    full_name: 'ThS. Chu Quỳnh Anh',
    gender: 'Nữ',
    birth_date: '08/06/1989',
    title: 'Thạc sĩ',
    academic_rank: 'Không',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Bộ môn Khoa học Máy tính',
    email: 'anh.cq@techcorp.edu.vn',
    phone: '0977.123.456',
    specialization: 'Cấu trúc Dữ liệu & Giải thuật',
    experience_years: 9,
    assigned_courses: ['Cấu trúc Dữ liệu & Giải thuật', 'Nhập môn Lập trình'],
    research_interests: 'Tối ưu hóa đồ thị, Data Science, Python AI',
    status: 'Đang công tác',
    active_courses_count: 1
  },
  {
    id: 5,
    code: 'GV005',
    username: 'dang.lh',
    full_name: 'TS. Lê Hải Đăng',
    gender: 'Nam',
    birth_date: '03/09/1983',
    title: 'Tiến sĩ',
    academic_rank: 'Không',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Trưởng bộ môn An toàn Thông tin',
    email: 'dang.lh@techcorp.edu.vn',
    phone: '0933.456.789',
    specialization: 'An toàn Thông tin & Mật mã Ứng dụng',
    experience_years: 15,
    assigned_courses: ['Mạng Máy tính', 'An toàn Thông tin & An ninh Mạng'],
    research_interests: 'Mật mã hậu lượng tử, Blockchain, Network Security',
    status: 'Đang công tác',
    active_courses_count: 1
  },
  {
    id: 6,
    code: 'GV006',
    username: 'hong.nt',
    full_name: 'TS. Nguyễn Thị Hồng',
    gender: 'Nữ',
    birth_date: '19/05/1979',
    title: 'Tiến sĩ',
    academic_rank: 'Không',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    department: 'Trưởng Khoa Kinh tế',
    email: 'hong.nt@techcorp.edu.vn',
    phone: '0918.667.889',
    specialization: 'Quản trị Kinh doanh & Kinh tế Phát triển',
    experience_years: 18,
    assigned_courses: ['Quản trị Học Đại cương', 'Kinh tế Vi mô'],
    research_interests: 'Khởi nghiệp đổi mới sáng tạo, Quản trị chiến lược doanh nghiệp',
    status: 'Đang công tác',
    active_courses_count: 1
  },
  {
    id: 7,
    code: 'GV007',
    username: 'nam.v',
    full_name: 'ThS. Vũ Nam',
    gender: 'Nam',
    birth_date: '14/12/1987',
    title: 'Thạc sĩ',
    academic_rank: 'Không',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    department: 'Bộ môn Quản trị Kinh doanh',
    email: 'nam.v@techcorp.edu.vn',
    phone: '0989.112.334',
    specialization: 'Marketing Số & Thương mại Điện tử',
    experience_years: 8,
    assigned_courses: ['Kinh tế Vĩ mô', 'Nguyên lý Kế toán Doanh nghiệp'],
    research_interests: 'E-commerce, Digital Marketing, Hành vi người tiêu dùng số',
    status: 'Đang công tác',
    active_courses_count: 1
  }
];

// 1.2. Danh mục Khoa / Viện
let facultiesCatalog = [
  { id: 1, code: 'CNTT', name: 'Khoa Công Nghệ Thông Tin', dean: 'PGS. TS. Trần Mạnh Tuấn', established_year: 2008, phone: '(024) 3754.7511', email: 'cntt@techcorp.edu.vn', majors_count: 4, lecturers_count: 32, status: 'Hoạt động' },
  { id: 2, code: 'KT', name: 'Khoa Kinh Tế & Quản Trị Kinh Doanh', dean: 'TS. Nguyễn Thị Hồng', established_year: 2010, phone: '(024) 3754.7522', email: 'kinhte@techcorp.edu.vn', majors_count: 2, lecturers_count: 24, status: 'Hoạt động' },
  { id: 3, code: 'NN', name: 'Khoa Ngoại Ngữ', dean: 'TS. Phạm Thu Hương', established_year: 2012, phone: '(024) 3754.7533', email: 'ngoainngu@techcorp.edu.vn', majors_count: 2, lecturers_count: 18, status: 'Hoạt động' },
  { id: 4, code: 'DL', name: 'Khoa Du Lịch & Khách Sạn', dean: 'ThS. Đỗ Quang Vinh', established_year: 2015, phone: '(024) 3754.7544', email: 'dulich@techcorp.edu.vn', majors_count: 1, lecturers_count: 12, status: 'Hoạt động' },
  { id: 5, code: 'KTNL', name: 'Khoa Kỹ Thuật Năng Lượng', dean: 'PGS. TS. Lê Văn Bách', established_year: 2018, phone: '(024) 3754.7555', email: 'nangluong@techcorp.edu.vn', majors_count: 1, lecturers_count: 14, status: 'Hoạt động' },
  { id: 6, code: 'DDT', name: 'Khoa Điện - Điện Tử & Tự Động Hóa', dean: 'TS. Bùi Quốc Thái', established_year: 2016, phone: '(024) 3754.7566', email: 'dientu@techcorp.edu.vn', majors_count: 1, lecturers_count: 16, status: 'Hoạt động' }
];

// 1.3. Danh mục Ngành / Nghề đào tạo
let majorsCatalog = [
  { id: 1, code: '7480103', name: 'Kỹ thuật Phần mềm (Software Engineering)', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', degree_level: 'Đại học Chính quy', duration_years: '4.5 Năm', required_credits: 145, status: 'Đang đào tạo' },
  { id: 2, code: '7480101', name: 'Khoa học Máy tính & AI (Computer Science & AI)', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', degree_level: 'Đại học Kỹ sư', duration_years: '4.5 Năm', required_credits: 118, status: 'Đang đào tạo' },
  { id: 3, code: '7480201', name: 'Công nghệ Thông tin (Information Technology)', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', degree_level: 'Đại học Chính quy', duration_years: '4.0 Năm', required_credits: 135, status: 'Đang đào tạo' },
  { id: 4, code: '7480104', name: 'Hệ thống Thông tin (Information Systems)', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', degree_level: 'Đại học Chính quy', duration_years: '4.0 Năm', required_credits: 130, status: 'Đang đào tạo' },
  { id: 5, code: '7340101', name: 'Quản trị Kinh doanh (Business Administration)', faculty_id: 'KT', faculty_name: 'Khoa Kinh Tế & QTKD', degree_level: 'Đại học Chính quy', duration_years: '4.0 Năm', required_credits: 130, status: 'Đang đào tạo' },
  { id: 6, code: '7220201', name: 'Ngôn ngữ Anh (English Studies)', faculty_id: 'NN', faculty_name: 'Khoa Ngoại Ngữ', degree_level: 'Đại học Chính quy', duration_years: '4.0 Năm', required_credits: 128, status: 'Đang đào tạo' },
  { id: 7, code: '7810103', name: 'Quản trị Dịch vụ Du lịch & Lữ hành', faculty_id: 'DL', faculty_name: 'Khoa Du Lịch & Khách Sạn', degree_level: 'Đại học Chính quy', duration_years: '4.0 Năm', required_credits: 125, status: 'Đang đào tạo' },
  { id: 8, code: '7520130', name: 'Kỹ thuật Năng lượng Tái tạo', faculty_id: 'KTNL', faculty_name: 'Khoa Kỹ Thuật Năng Lượng', degree_level: 'Đại học Kỹ sư', duration_years: '4.5 Năm', required_credits: 140, status: 'Đang đào tạo' },
  { id: 9, code: '7510301', name: 'Kỹ thuật Điện - Điện tử & IoT', faculty_id: 'DDT', faculty_name: 'Khoa Điện - Điện Tử & Tự Động Hóa', degree_level: 'Đại học Kỹ sư', duration_years: '4.5 Năm', required_credits: 142, status: 'Đang đào tạo' }
];

// 1.4. Danh mục Khóa học
let cohortsCatalog = [
  { id: 1, cohort_code: 'K68', cohort_name: 'Khóa 68 (2024 - 2028)', start_year: 2024, end_year: 2028, training_system: 'Hệ Tín chỉ (TT 08)', total_students: 850, status: 'Đang đào tạo (Năm 2)' },
  { id: 2, cohort_code: 'K67', cohort_name: 'Khóa 67 (2023 - 2027)', start_year: 2023, end_year: 2027, training_system: 'Hệ Tín chỉ (TT 08)', total_students: 820, status: 'Đang đào tạo (Năm 3)' },
  { id: 3, cohort_code: 'K66', cohort_name: 'Khóa 66 (2022 - 2026)', start_year: 2022, end_year: 2026, training_system: 'Hệ Tín chỉ (TT 08)', total_students: 790, status: 'Đang đào tạo (Năm 4)' },
  { id: 4, cohort_code: 'K65', cohort_name: 'Khóa 65 (2021 - 2025)', start_year: 2021, end_year: 2025, training_system: 'Hệ Tín chỉ (TT 08)', total_students: 760, status: 'Chuẩn bị tốt nghiệp' },
  { id: 5, cohort_code: 'K69', cohort_name: 'Khóa 69 (2025 - 2029)', start_year: 2025, end_year: 2029, training_system: 'Hệ Tín chỉ (TT 08)', total_students: 900, status: 'Chuẩn bị tuyển sinh' }
];

// 1.5. Danh mục Lớp học
let classesCatalog = [
  { id: 1, class_code: '66.CNTT-1', class_name: 'Lớp 66.CNTT-1', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', major_id: 'CNPM', major_name: 'Kỹ thuật Phần mềm', cohort: 'K66', academic_year: '2026-2027', total_students: 42, advisor: 'TS. Hoàng Đức Em', room: 'P.401-A3' },
  { id: 2, class_code: '66.CNTT-2', class_name: 'Lớp 66.CNTT-2', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', major_id: 'CNPM', major_name: 'Kỹ thuật Phần mềm', cohort: 'K66', academic_year: '2026-2027', total_students: 40, advisor: 'ThS. Chu Quỳnh Anh', room: 'P.402-A3' },
  { id: 3, class_code: '66.HTTT-1', class_name: 'Lớp 66.HTTT-1', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', major_id: 'HTTT', major_name: 'Hệ thống Thông tin', cohort: 'K66', academic_year: '2026-2027', total_students: 45, advisor: 'TS. Hoàng Đức Em', room: 'P.501-A3' },
  { id: 4, class_code: '66.KHMT-1', class_name: 'Lớp 66.KHMT-1', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', major_id: 'KHMT', major_name: 'Khoa học Máy tính', cohort: 'K66', academic_year: '2026-2027', total_students: 38, advisor: 'TS. Lê Hải Đăng', room: 'P.502-A3' },
  { id: 5, class_code: '68.KHMT-1', class_name: 'Lớp 68.KHMT-1', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', major_id: 'KHMT_AI', major_name: 'Khoa học Máy tính & AI', cohort: 'K68', academic_year: '2024-2028', total_students: 44, advisor: 'PGS. TS. Trần Mạnh Tuấn', room: 'P.301-A2' },
  { id: 6, class_code: '66.QTKD-1', class_name: 'Lớp 66.QTKD-1', faculty_id: 'KT', faculty_name: 'Khoa Kinh Tế & QTKD', major_id: 'QTKD', major_name: 'Quản trị Kinh doanh', cohort: 'K66', academic_year: '2026-2027', total_students: 50, advisor: 'ThS. Vũ Nam', room: 'P.201-B1' }
];

// 1.3. Danh mục Môn học theo Khoa, Ngành và Học kỳ
let coursesCatalog = [
  // Khoa CNTT - Ngành Kỹ thuật Phần mềm (CNPM)
  { id: 1, faculty_id: 'CNTT', major_id: 'CNPM', semester: 1, code: 'IT101', name: 'Nhập môn Lập trình C/C++', credits: 4, theory_hours: 30, practice_hours: 60, prerequisites: 'Không', knowledge_block: 'Cơ sở ngành', is_compulsory: true },
  { id: 2, faculty_id: 'CNTT', major_id: 'CNPM', semester: 1, code: 'MATH101', name: 'Toán Cao Cấp 1 (Giải tích)', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'Không', knowledge_block: 'Đại cương', is_compulsory: true },
  { id: 3, faculty_id: 'CNTT', major_id: 'CNPM', semester: 1, code: 'MATH102', name: 'Đại Số Tuyến Tính & Hình Học Giải Tích', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'Không', knowledge_block: 'Đại cương', is_compulsory: true },
  { id: 4, faculty_id: 'CNTT', major_id: 'CNPM', semester: 1, code: 'ENG101', name: 'Tiếng Anh Học Thuật 1 (General English B1)', credits: 4, theory_hours: 40, practice_hours: 40, prerequisites: 'Không', knowledge_block: 'Đại cương', is_compulsory: true },
  { id: 5, faculty_id: 'CNTT', major_id: 'CNPM', semester: 2, code: 'IT201', name: 'Cơ sở Dữ liệu (Database Systems)', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'IT101', knowledge_block: 'Cơ sở ngành', is_compulsory: true },
  { id: 6, faculty_id: 'CNTT', major_id: 'CNPM', semester: 2, code: 'IT301', name: 'Cấu trúc Dữ liệu & Giải thuật', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'IT101', knowledge_block: 'Cơ sở ngành', is_compulsory: true },
  { id: 7, faculty_id: 'CNTT', major_id: 'CNPM', semester: 2, code: 'PHYS101', name: 'Vật Lý Đại Cương & Thí Nghiệm', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'MATH101', knowledge_block: 'Đại cương', is_compulsory: true },
  { id: 8, faculty_id: 'CNTT', major_id: 'CNPM', semester: 3, code: 'IT302', name: 'Kiến Trúc Máy Tính & Hợp Ngữ', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'IT101', knowledge_block: 'Cơ sở ngành', is_compulsory: true },
  { id: 9, faculty_id: 'CNTT', major_id: 'CNPM', semester: 3, code: 'IT401', name: 'Mạng Máy Tính & Truyền Số Liệu', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'Không', knowledge_block: 'Cơ sở ngành', is_compulsory: true },
  { id: 10, faculty_id: 'CNTT', major_id: 'CNPM', semester: 4, code: 'SE301', name: 'Công Nghệ Phần Mềm (Software Engineering)', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'IT301', knowledge_block: 'Chuyên ngành', is_compulsory: true },
  { id: 11, faculty_id: 'CNTT', major_id: 'CNPM', semester: 4, code: 'SE302', name: 'Lập Trình Hướng Đối Tượng Nâng Cao (OOP Java/C#)', credits: 4, theory_hours: 30, practice_hours: 60, prerequisites: 'IT101', knowledge_block: 'Chuyên ngành', is_compulsory: true },
  { id: 12, faculty_id: 'CNTT', major_id: 'CNPM', semester: 5, code: 'SE401', name: 'Phát Triển Ứng Dụng Web Fullstack (MERN/NestJS)', credits: 4, theory_hours: 30, practice_hours: 60, prerequisites: 'IT201', knowledge_block: 'Chuyên ngành', is_compulsory: true },

  // Khoa Kinh Tế - Ngành Quản trị Kinh doanh (QTKD)
  { id: 13, faculty_id: 'KT', major_id: 'QTKD', semester: 1, code: 'BA101', name: 'Kinh Tế Vi Mô (Microeconomics)', credits: 3, theory_hours: 45, practice_hours: 0, prerequisites: 'Không', knowledge_block: 'Cơ sở khối ngành', is_compulsory: true },
  { id: 14, faculty_id: 'KT', major_id: 'QTKD', semester: 1, code: 'BA102', name: 'Quản Trị Học Đại Cương (Principles of Management)', credits: 3, theory_hours: 45, practice_hours: 0, prerequisites: 'Không', knowledge_block: 'Cơ sở ngành', is_compulsory: true },
  { id: 15, faculty_id: 'KT', major_id: 'QTKD', semester: 2, code: 'BA201', name: 'Kinh Tế Vĩ Mô (Macroeconomics)', credits: 3, theory_hours: 45, practice_hours: 0, prerequisites: 'BA101', knowledge_block: 'Cơ sở khối ngành', is_compulsory: true },
  { id: 16, faculty_id: 'KT', major_id: 'QTKD', semester: 2, code: 'BA202', name: 'Nguyên Lý Kế Toán Doanh Nghiệp', credits: 3, theory_hours: 30, practice_hours: 30, prerequisites: 'Không', knowledge_block: 'Cơ sở ngành', is_compulsory: true }
];

// 1.4. Danh sách Phân công giảng dạy hiện hành
let assignmentsStore = [
  {
    id: 1,
    lecturer_id: 2,
    lecturer_username: 'teacher',
    lecturer_name: 'TS. Hoàng Đức Em',
    faculty_id: 'CNTT',
    major_id: 'CNPM',
    major_name: 'Kỹ thuật Phần mềm',
    course_id: 1,
    course_code: 'IT101',
    course_name: 'Nhập môn Lập trình C/C++',
    class_id: 1,
    class_name: '66.CNTT-1',
    cohort: 'K66',
    semester: 'Học kỳ 1 (2026-2027)',
    assigned_by: 'Trưởng bộ môn Kỹ thuật Phần mềm',
    can_author_lms: true,
    can_grade: true,
    can_appraise_exams: false,
    created_at: new Date()
  },
  {
    id: 2,
    lecturer_id: 2,
    lecturer_username: 'teacher',
    lecturer_name: 'TS. Hoàng Đức Em',
    faculty_id: 'CNTT',
    major_id: 'HTTT',
    major_name: 'Hệ thống Thông tin',
    course_id: 5,
    course_code: 'IT201',
    course_name: 'Cơ sở Dữ liệu (Database Systems)',
    class_id: 3,
    class_name: '66.HTTT-1',
    cohort: 'K66',
    semester: 'Học kỳ 1 (2026-2027)',
    assigned_by: 'Trưởng bộ môn Hệ thống Thông tin',
    can_author_lms: true,
    can_grade: true,
    can_appraise_exams: false,
    created_at: new Date()
  },
  {
    id: 3,
    lecturer_id: 6,
    lecturer_username: 'an.nv',
    lecturer_name: 'TS. Nguyễn Văn An',
    faculty_id: 'CNTT',
    major_id: 'CNPM',
    major_name: 'Kỹ thuật Phần mềm',
    course_id: 6,
    course_code: 'IT301',
    course_name: 'Cấu trúc Dữ liệu & Giải thuật',
    class_id: 5,
    class_name: '65.CNTT-1',
    cohort: 'K65',
    semester: 'Học kỳ 1 (2026-2027)',
    assigned_by: 'Hội đồng Khoa CNTT',
    can_author_lms: true,
    can_grade: true,
    can_appraise_exams: true,
    created_at: new Date()
  }
];

// 1.5. Hồ sơ thẩm định đề thi
let appraisalStore = [
  {
    id: 1,
    appraisal_code: 'BB-TD-2026-IT101-01',
    course_code: 'IT101',
    course_name: 'Nhập môn Lập trình C/C++',
    exam_paper_code: 'DE-THI-IT101-HK1-A',
    author_lecturer: 'TS. Hoàng Đức Em',
    reviewer_dept: 'TS. Nguyễn Văn An (Trưởng Bộ Môn CNPM)',
    council_president: 'PGS. TS. Trần Mạnh Tuấn (Trưởng Khoa CNTT)',
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    status: 'APPROVED',
    criteria: {
      matrix_coverage_score: 9.5,
      bloom_distribution_score: 9.0,
      clarity_score: 9.5,
      security_classification: 'TUYET_MAT_CAP_TRUONG',
      exam_duration_fit: 'PHU_HOP_60_PHUT',
      notes: 'Đề thi bám sát chuẩn kiến thức TT 08/2021. Đạt 100% tiêu chí hội đồng.'
    },
    digital_signatures: {
      author_signed: true,
      author_signed_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      reviewer_signed: true,
      reviewer_signed_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
      president_signed: true,
      president_signed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      digital_cert_id: 'CERT-TCU-SHA256-88741A-2026'
    }
  }
];

// 1.6. Sổ điểm mẫu
let transcriptData = {
  students: [
    { student_id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', birth_date: '15/08/2004', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', course_code: 'IT101', course_name: 'Nhập môn Lập trình C/C++', credits: 4, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.35, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.85, gpa_accumulated_4: 3.78, credits_passed: 38, academic_rank: 'XUẤT SẮC' },
    { student_id: 2, student_code: '261IT002', full_name: 'Nguyễn Thị Mai', birth_date: '20/11/2004', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', course_code: 'IT101', course_name: 'Nhập môn Lập trình C/C++', credits: 4, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.0, course_score_10: 9.30, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.90, gpa_accumulated_4: 3.82, credits_passed: 42, academic_rank: 'XUẤT SẮC' },
    { student_id: 3, student_code: '261IT003', full_name: 'Lê Hoàng Long', birth_date: '02/05/2004', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', course_code: 'IT101', course_name: 'Nhập môn Lập trình C/C++', credits: 4, attendance_score: 8.5, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.35, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.35, gpa_accumulated_4: 3.20, credits_passed: 35, academic_rank: 'GIỎI' },
    { student_id: 5, student_code: '261IT005', full_name: 'Vũ Hải Đăng', birth_date: '10/10/2004', class_name: '66.CNTT-1', major: 'Kỹ thuật Phần mềm', cohort: 'K66', course_code: 'IT101', course_name: 'Nhập môn Lập trình C/C++', credits: 4, attendance_score: 4.5, assignment_score: 4.0, midterm_score: 5.0, final_exam_score: 4.0, course_score_10: 4.35, course_score_letter: 'D', course_score_4: 1.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 1.85, gpa_accumulated_4: 1.95, credits_passed: 22, academic_rank: 'CẢNH BÁO HỌC VỤ 1' }
  ]
};

// ==================== CÁC PHƯƠNG THỨC CONTROLLER ====================

// 2.1. Quản lý danh mục Giảng viên (CRUD)
exports.getLecturers = async (req, res) => {
  res.json({ success: true, data: lecturersCatalog });
};

exports.createLecturer = async (req, res) => {
  try {
    const data = req.body;
    const newLecturer = {
      id: Date.now(),
      code: data.code || `GV00${lecturersCatalog.length + 1}`,
      username: data.username || `gv_${Date.now().toString().slice(-4)}`,
      full_name: data.full_name,
      gender: data.gender || 'Nam',
      birth_date: data.birth_date || '01/01/1985',
      title: data.title || 'Thạc sĩ',
      academic_rank: data.academic_rank || 'Không',
      faculty_id: data.faculty_id || 'CNTT',
      faculty_name: data.faculty_name || 'Khoa Công Nghệ Thông Tin',
      department: data.department || 'Bộ môn Kỹ thuật Phần mềm',
      email: data.email || 'giangvien@techcorp.edu.vn',
      phone: data.phone || '0900.000.000',
      specialization: data.specialization || 'Công nghệ Thông tin',
      experience_years: Number(data.experience_years) || 5,
      assigned_courses: data.assigned_courses || [],
      research_interests: data.research_interests || '',
      status: data.status || 'Đang công tác',
      active_courses_count: 1
    };
    lecturersCatalog.unshift(newLecturer);
    res.json({ success: true, message: `Thêm mới giảng viên ${newLecturer.full_name} thành công!`, data: newLecturer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateLecturer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const idx = lecturersCatalog.findIndex(l => String(l.id) === String(id));
    if (idx !== -1) {
      lecturersCatalog[idx] = { ...lecturersCatalog[idx], ...data };
      res.json({ success: true, message: 'Cập nhật hồ sơ giảng viên thành công!', data: lecturersCatalog[idx] });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên!' });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLecturer = async (req, res) => {
  try {
    const { id } = req.params;
    lecturersCatalog = lecturersCatalog.filter(l => String(l.id) !== String(id));
    res.json({ success: true, message: 'Đã xóa giảng viên khỏi danh mục!', data: lecturersCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2.2. Quản lý Cơ cấu & Danh mục Cơ sở (Khoa, Ngành, Khóa, Lớp)
exports.getInstitutionalCatalogs = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        faculties: facultiesCatalog,
        majors: majorsCatalog,
        cohorts: cohortsCatalog,
        classes: classesCatalog
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveFaculty = async (req, res) => {
  try {
    const data = req.body;
    if (data.id) {
      const idx = facultiesCatalog.findIndex(f => f.id === data.id);
      if (idx !== -1) facultiesCatalog[idx] = { ...facultiesCatalog[idx], ...data };
    } else {
      facultiesCatalog.push({
        id: Date.now(),
        code: data.code,
        name: data.name,
        dean: data.dean || 'Chưa bổ nhiệm',
        established_year: data.established_year || new Date().getFullYear(),
        phone: data.phone || '',
        email: data.email || '',
        majors_count: Number(data.majors_count) || 0,
        lecturers_count: Number(data.lecturers_count) || 0,
        status: data.status || 'Hoạt động'
      });
    }
    res.json({ success: true, message: 'Lưu thông tin Khoa/Viện thành công!', data: facultiesCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    facultiesCatalog = facultiesCatalog.filter(f => String(f.id) !== String(id));
    res.json({ success: true, message: 'Đã xóa Khoa/Viện khỏi hệ thống!', data: facultiesCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.saveMajor = async (req, res) => {
  try {
    const data = req.body;
    if (data.id) {
      const idx = majorsCatalog.findIndex(m => m.id === data.id);
      if (idx !== -1) majorsCatalog[idx] = { ...majorsCatalog[idx], ...data };
    } else {
      majorsCatalog.push({
        id: Date.now(),
        code: data.code,
        name: data.name,
        faculty_id: data.faculty_id || 'CNTT',
        faculty_name: data.faculty_name || 'Khoa Công Nghệ Thông Tin',
        degree_level: data.degree_level || 'Đại học Chính quy',
        duration_years: data.duration_years || '4.0 Năm',
        required_credits: Number(data.required_credits) || 130,
        status: data.status || 'Đang đào tạo'
      });
    }
    res.json({ success: true, message: 'Lưu thông tin Ngành đào tạo thành công!', data: majorsCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteMajor = async (req, res) => {
  try {
    const { id } = req.params;
    majorsCatalog = majorsCatalog.filter(m => String(m.id) !== String(id));
    res.json({ success: true, message: 'Đã xóa Ngành đào tạo khỏi hệ thống!', data: majorsCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.saveCohort = async (req, res) => {
  try {
    const data = req.body;
    if (data.id) {
      const idx = cohortsCatalog.findIndex(c => c.id === data.id);
      if (idx !== -1) cohortsCatalog[idx] = { ...cohortsCatalog[idx], ...data };
    } else {
      cohortsCatalog.push({
        id: Date.now(),
        cohort_code: data.cohort_code,
        cohort_name: data.cohort_name,
        start_year: Number(data.start_year) || new Date().getFullYear(),
        end_year: Number(data.end_year) || new Date().getFullYear() + 4,
        training_system: data.training_system || 'Hệ Tín chỉ (TT 08)',
        total_students: Number(data.total_students) || 0,
        status: data.status || 'Đang đào tạo'
      });
    }
    res.json({ success: true, message: 'Lưu thông tin Khóa học thành công!', data: cohortsCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCohort = async (req, res) => {
  try {
    const { id } = req.params;
    cohortsCatalog = cohortsCatalog.filter(c => String(c.id) !== String(id));
    res.json({ success: true, message: 'Đã xóa Khóa học!', data: cohortsCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.saveClass = async (req, res) => {
  try {
    const data = req.body;
    if (data.id) {
      const idx = classesCatalog.findIndex(c => c.id === data.id);
      if (idx !== -1) classesCatalog[idx] = { ...classesCatalog[idx], ...data };
    } else {
      classesCatalog.push({
        id: Date.now(),
        class_code: data.class_code,
        class_name: data.class_name,
        faculty_id: data.faculty_id || 'CNTT',
        faculty_name: data.faculty_name || 'Khoa Công Nghệ Thông Tin',
        major_id: data.major_id || 'CNPM',
        major_name: data.major_name || 'Kỹ thuật Phần mềm',
        cohort: data.cohort || 'K66',
        academic_year: data.academic_year || '2026-2027',
        total_students: Number(data.total_students) || 40,
        advisor: data.advisor || 'Chưa phân công',
        room: data.room || 'P.401-A3'
      });
    }
    res.json({ success: true, message: 'Lưu thông tin Lớp học thành công!', data: classesCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    classesCatalog = classesCatalog.filter(c => String(c.id) !== String(id));
    res.json({ success: true, message: 'Đã xóa Lớp học!', data: classesCatalog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2.3. Lấy danh mục Lớp học (đơn lẻ)
exports.getClasses = async (req, res) => {
  res.json({ success: true, data: classesCatalog });
};

// 2.4. Lấy danh mục Môn học theo Khoa, Ngành, Học kỳ
exports.getCoursesCatalog = async (req, res) => {
  const { faculty_id, major_id, semester } = req.query;
  let list = coursesCatalog;
  if (faculty_id) list = list.filter(c => c.faculty_id === faculty_id);
  if (major_id) list = list.filter(c => c.major_id === major_id);
  if (semester) list = list.filter(c => String(c.semester) === String(semester));
  res.json({ success: true, data: list });
};

// 2.4. Lấy cây phân cấp và danh sách phân công
exports.getHierarchyAndAssignments = async (req, res) => {
  try {
    const userRole = (req.user && req.user.role) || 'admin';
    const username = (req.user && req.user.username) || '';

    let userAssignments = assignmentsStore;
    if (userRole === 'teacher') {
      userAssignments = assignmentsStore.filter(
        a => a.lecturer_username === username || a.lecturer_username === 'teacher'
      );
    }

    res.json({
      success: true,
      data: {
        faculties: [
          {
            id: 'CNTT',
            name: 'Khoa Công Nghệ Thông Tin',
            dean: 'PGS. TS. Trần Mạnh Tuấn',
            majors: [
              { id: 'CNPM', name: 'Kỹ thuật Phần mềm (Software Engineering)', code: '7480103' },
              { id: 'KHMT', name: 'Khoa học Máy tính (Computer Science)', code: '7480101' },
              { id: 'HTTT', name: 'Hệ thống Thông tin (Information Systems)', code: '7480104' },
              { id: 'ATTT', name: 'An toàn Thông tin & Mạng (Cybersecurity)', code: '7480202' }
            ]
          },
          {
            id: 'KT',
            name: 'Khoa Kinh Tế & Quản Trị Kinh Doanh',
            dean: 'TS. Nguyễn Thị Hồng',
            majors: [
              { id: 'QTKD', name: 'Quản trị Kinh doanh', code: '7340101' }
            ]
          }
        ],
        assignments: assignmentsStore,
        my_assignments: userAssignments,
        current_year: '2026-2027',
        current_semester: 'Học kỳ 1'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2.5. Lưu phân công giảng dạy mới (liên kết môn học, lớp, giảng viên)
exports.saveAssignment = async (req, res) => {
  try {
    const { lecturer_id, course_code, class_name, semester } = req.body;
    const lecturer = lecturersCatalog.find(l => l.id === Number(lecturer_id)) || lecturersCatalog[0];
    const course = coursesCatalog.find(c => c.code === course_code) || coursesCatalog[0];
    const classObj = classesCatalog.find(cl => cl.class_name === class_name || cl.class_code === class_name) || classesCatalog[0];

    const newAssignment = {
      id: Date.now(),
      lecturer_id: lecturer.id,
      lecturer_username: lecturer.username,
      lecturer_name: `${lecturer.title} ${lecturer.full_name}`,
      faculty_id: course.faculty_id,
      major_id: course.major_id,
      major_name: classObj.major_name,
      course_id: course.id,
      course_code: course.code,
      course_name: course.name,
      class_id: classObj.id,
      class_name: classObj.class_name,
      cohort: classObj.cohort,
      semester: semester || 'Học kỳ 1 (2026-2027)',
      assigned_by: 'Hội đồng Khoa & Bộ môn',
      can_author_lms: true,
      can_grade: true,
      can_appraise_exams: false,
      created_at: new Date()
    };

    assignmentsStore.unshift(newAssignment);
    res.json({
      success: true,
      message: `Đã phân công thành công ${lecturer.full_name} phụ trách giảng dạy và biên soạn môn ${course.name} (${classObj.class_name})!`,
      data: newAssignment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2.6. AI TRÍCH XUẤT ĐỀ CƯƠNG & SOẠN GIẢNG CHI TIẾT TỪ FILE / TEXT
exports.extractAndGenerateFromSyllabus = async (req, res) => {
  try {
    const { syllabus_text, course_name, course_code, week_number, content_type } = req.body;
    const weekNum = Number(week_number) || 1;
    const cName = course_name || 'Nhập môn Lập trình C/C++';
    const cCode = course_code || 'IT101';

    // Tạo prompt gửi tới AI
    const prompt = `Bạn là Trợ lý AI Soạn Giảng Đại Học chuẩn Bộ GD&ĐT (Thông tư 08/2021).
Dựa trên đề cương chi tiết học phần: ${cName} (${cCode}), nội dung đề cương:
"${syllabus_text ? syllabus_text.substring(0, 1500) : 'Khái niệm, cú pháp, nguyên lý hoạt động, bài tập thực hành'}"
Hãy biên soạn tài liệu cho Tuần học số ${weekNum} theo định dạng yêu cầu: ${content_type || 'ALL'}.`;

    // Gọi AI qua service
    let aiResponse = await aiService.callAi(prompt, 'Soạn bài giảng sư phạm đại học chuẩn mực');

    // Cung cấp nội dung sư phạm chuẩn hoá
    const result = {
      course_code: cCode,
      course_name: cName,
      week_number: weekNum,
      // 1. Bài giảng Word
      word_document: {
        title: `GIÁO TRÌNH BÀI GIẢNG TUẦN ${weekNum}: ${cName}`,
        outline: `# BÀI GIẢNG TUẦN ${weekNum}: ${cName} (${cCode})
## 1. MỤC TIÊU VÀ CHUẨN ĐẦU RA (CLO Matrix)
- Kiến thức (C1-C2): Nắm vững nguyên lý cốt lõi, cú pháp quy chuẩn và cấu trúc giải thuật của bài học.
- Kỹ năng (C3-C4): Vận dụng xây dựng chương trình hoàn chỉnh, kiểm thử ca biên (edge-cases) và tối ưu độ phức tạp.
- Thái độ & Trách nhiệm: Tuân thủ chuẩn lập trình sạch (Clean Code), bình luận mã nguồn và bảo đảm an toàn dữ liệu.

## 2. NỘI DUNG LÝ THUYẾT TRỌNG TÂM
- Phân tích chi tiết kiến trúc bộ nhớ, luồng thực thi dữ liệu và tương tác giữa các hàm/phương thức.
- Mã nguồn mẫu minh họa từng bước, có chú giải cú pháp và phân tích ca lỗi thường gặp.

## 3. BÀI TẬP THỰC HÀNH & TỰ HỌC (LAB EXERCISES)
- Bài 1 (Nhận biết): Biên dịch và chạy thử chương trình mẫu trên môi trường chuẩn.
- Bài 2 (Vận dụng): Xây dựng thuật toán giải quyết bài toán nghiệp vụ thực tế có kiểm tra điều kiện đầu vào.
- Bài 3 (Nâng cao): Tối ưu hiệu năng bộ nhớ và thời gian xử lý.`
      },

      // 2. Slide trình chiếu
      slide_deck: [
        { slide: 1, title: `Tuần ${weekNum}: ${cName}`, subtitle: 'Bài giảng số hóa tương tác LMS', notes: 'Giới thiệu giảng viên, quy định học phần và mục tiêu cần đạt.' },
        { slide: 2, title: 'Chuẩn Đầu Ra & Mục Tiêu Học Tập', subtitle: 'Thang đo năng lực Bloom C1 - C4', notes: 'Nhắc sinh viên điều kiện hoàn thành bài Quiz tuần để mở khóa tuần sau.' },
        { slide: 3, title: 'Nền Tảng Lý Thuyết Cốt Lõi', subtitle: 'Khái niệm, sơ đồ luồng dữ liệu & kiến trúc', notes: 'Giải thích chi tiết sơ đồ khối thuật toán.' },
        { slide: 4, title: 'Mã Nguồn Mẫu & Phân Tích Thực Thi', subtitle: 'Live coding & Trực quan hóa kết quả', notes: 'Chiếu code snippet và phân tích thời gian thực.' },
        { slide: 5, title: 'Thảo Luận Nhóm & Bài Tập Vận Dụng', subtitle: 'Thực hành giải quyết bài toán thực tế', notes: 'Giao bài tập trên LMS cho các nhóm sinh viên.' },
        { slide: 6, title: 'Tổng Kết & Câu Hỏi Củng Cố Kiến Thức', subtitle: 'Hướng dẫn làm bài Quiz kiểm tra quá trình', notes: 'Yêu cầu sinh viên hoàn thành bài Quiz trước 23:59 Chủ nhật.' }
      ],

      // 3. Kịch bản Video bài giảng
      video_script: {
        title: `Kịch bản Video Bài Giảng Tuần ${weekNum}: ${cName}`,
        duration_minutes: 15,
        scenes: [
          { time: '00:00 - 02:00', visual: 'Giảng viên đứng trước màn hình Studio tương tác', audio: 'Chào các bạn sinh viên, hôm nay chúng ta sẽ bắt đầu nội dung trọng tâm của Tuần ' + weekNum + '...' },
          { time: '02:00 - 07:00', visual: 'Quay màn hình IDE chạy mã nguồn mẫu chi tiết', audio: 'Các bạn hãy chú ý dòng mã nguồn số 12, đây là vị trí khởi tạo biến và kiểm tra điều kiện an toàn...' },
          { time: '07:00 - 07:30', visual: 'Điểm dừng câu hỏi tương tác Pop-up dừng video', audio: 'Hệ thống tự động hiển thị câu hỏi trắc nghiệm kiểm tra khả năng tiếp thu bài học...' },
          { time: '07:30 - 13:30', visual: 'Biểu đồ thuật toán & Sơ đồ kiến trúc động', audio: 'Tiếp tục với phần tối ưu hóa thuật toán và xử lý ngoại lệ...' },
          { time: '13:30 - 15:00', visual: 'Giảng viên dặn dò & Slide bài tập tuần', audio: 'Các bạn nhớ làm bài Quiz trên hệ thống LMS để đạt điểm chuyên cần nhé!' }
        ]
      },

      // 4. Bộ Quiz trắc nghiệm 4 mức độ Bloom
      quiz_questions: [
        { id: 1, bloom: 'Nhận biết (Remember)', question: `Khái niệm cơ bản nào sau đây là nền tảng cốt lõi của nội dung bài học Tuần ${weekNum}?`, options: [{ key: 'A', text: 'Định nghĩa chuẩn xác theo tài liệu giảng dạy chính thức', is_correct: true }, { key: 'B', text: 'Chỉ áp dụng trong một số trường hợp ngoại lệ', is_correct: false }, { key: 'C', text: 'Khái niệm đã lỗi thời không còn dùng', is_correct: false }, { key: 'D', text: 'Không liên quan đến môn học', is_correct: false }], explanation: 'Đáp án A là định nghĩa quy chuẩn theo đề cương chi tiết môn học.' },
        { id: 2, bloom: 'Thông hiểu (Understand)', question: 'Ý nghĩa quan trọng nhất của việc kiểm tra điều kiện biên (edge cases) là gì?', options: [{ key: 'A', text: 'Giúp chương trình không bị lỗi crash và chạy ổn định với mọi dữ liệu đầu vào', is_correct: true }, { key: 'B', text: 'Làm chương trình chạy nhanh gấp đôi', is_correct: false }, { key: 'C', text: 'Chỉ để viết code dài hơn', is_correct: false }, { key: 'D', text: 'Không có tác dụng thực tế', is_correct: false }], explanation: 'Kiểm tra biên ngăn chặn lỗi tràn bộ nhớ hoặc chia cho 0.' },
        { id: 3, bloom: 'Vận dụng (Apply)', question: 'Khi triển khai thuật toán thực tế, giải pháp nào sau đây tối ưu hóa hiệu năng tốt nhất?', options: [{ key: 'A', text: 'Sử dụng cấu trúc dữ liệu phù hợp và giải phóng vùng nhớ kịp thời', is_correct: true }, { key: 'B', text: 'Lồng nhiều vòng lặp vô hạn', is_correct: false }, { key: 'C', text: 'Dùng biến toàn cục bừa bãi', is_correct: false }, { key: 'D', text: 'Không tối ưu mã nguồn', is_correct: false }], explanation: 'Cấu trúc dữ liệu tối ưu giúp giảm độ phức tạp tính toán.' },
        { id: 4, bloom: 'Vận dụng cao (Analyze)', question: 'Trong tình huống phát hiện lỗ hổng rò rỉ dữ liệu, kỹ sư phần mềm cần tiến hành biện pháp nào đầu tiên?', options: [{ key: 'A', text: 'Khoanh vùng khối mã xử lý, ghi nhận nhật ký lỗi và vá lỗ hổng kiểm soát truy cập', is_correct: true }, { key: 'B', text: 'Tắt toàn bộ máy chủ và bỏ qua lỗi', is_correct: false }, { key: 'C', text: 'Chờ đợi người dùng báo cáo lại', is_correct: false }, { key: 'D', text: 'Xóa toàn bộ mã nguồn', is_correct: false }], explanation: 'Quy trình chuẩn là ghi vết kiểm toán (audit log) và vá lỗi bảo mật.' }
      ]
    };

    res.json({
      success: true,
      message: 'AI đã trích xuất đề cương và hoàn thành biên soạn 4 định dạng bài giảng số hóa!',
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2.7. TỰ ĐỘNG SOẠN ÍT NHẤT 3 ĐỀ THI CHO MÔN HỌC BẰNG AI
exports.generate3ExamPapers = async (req, res) => {
  try {
    const { course_name, course_code, exam_type, duration_minutes } = req.body;
    const cName = course_name || 'Nhập môn Lập trình C/C++';
    const cCode = course_code || 'IT101';
    const duration = duration_minutes || 60;
    const eType = exam_type || 'Thi Kết Thúc Học Phần (Final Exam)';

    const prompt = `Soạn 3 mã đề thi khác nhau (Đề 1 - Mã 101, Đề 2 - Mã 202, Đề 3 - Mã 303) cho môn: ${cName} (${cCode}).
Thời lượng: ${duration} phút. Đầy đủ ma trận Bloom (Nhận biết 25%, Thông hiểu 35%, Vận dụng 25%, Vận dụng cao 15%), đáp án và thang điểm 10.`;

    await aiService.callAi(prompt, 'Soạn đề thi khảo thí đại học bảo mật tuyệt mật');

    const papers = [
      {
        paper_id: 1,
        paper_code: `DE-${cCode}-101`,
        paper_name: `Đề Thi Số 1 (Mã 101) — ${cName}`,
        exam_type: eType,
        duration_minutes: duration,
        security_level: 'TUYỆT MẬT',
        matrix_clo: { remember_pct: 25, understand_pct: 35, apply_pct: 25, analyze_pct: 15 },
        total_score: 10.0,
        questions: [
          { q_num: 1, level: 'Nhận biết (2.5đ)', content: 'Nêu cú pháp khai báo và phạm vi hoạt động của biến cục bộ trong ngôn ngữ lập trình. Cho ví dụ minh họa.', score: 2.5, answer_key: 'Định nghĩa đúng (1.0đ), nêu phạm vi hàm (1.0đ), code mẫu chuẩn (0.5đ).' },
          { q_num: 2, level: 'Thông hiểu (3.5đ)', content: 'Phân tích sự khác biệt cơ bản giữa truyền tham số theo giá trị (pass-by-value) và truyền tham số theo tham chiếu (pass-by-reference). Khi nào bắt buộc phải dùng tham chiếu?', score: 3.5, answer_key: 'So sánh cơ chế sao chép ô nhớ (1.5đ), vẽ sơ đồ ô nhớ (1.0đ), nêu ca bắt buộc dùng tham chiếu (1.0đ).' },
          { q_num: 3, level: 'Vận dụng (2.5đ)', content: 'Viết hàm thực hiện tìm kiếm phần tử lớn thứ hai trong một mảng một chiều gồm n số nguyên. Độ phức tạp không vượt quá O(n).', score: 2.5, answer_key: 'Thuật toán duyệt 1 lượt (1.5đ), xử lý ca mảng trùng giá trị (0.5đ), code hoàn chỉnh không lỗi cú pháp (0.5đ).' },
          { q_num: 4, level: 'Vận dụng cao (1.5đ)', content: 'Thiết kế cấu trúc dữ liệu và giải thuật quản lý danh sách hồ sơ sinh viên bằng mảng động, tự động tăng gấp đôi kích thước khi mảng đầy.', score: 1.5, answer_key: 'Cấp phát động new[] (0.5đ), cơ chế sao chép và delete[] mảng cũ (0.5đ), phòng chống rò rỉ RAM (0.5đ).' }
        ]
      },
      {
        paper_id: 2,
        paper_code: `DE-${cCode}-202`,
        paper_name: `Đề Thi Số 2 (Mã 202) — ${cName}`,
        exam_type: eType,
        duration_minutes: duration,
        security_level: 'TUYỆT MẬT',
        matrix_clo: { remember_pct: 25, understand_pct: 35, apply_pct: 25, analyze_pct: 15 },
        total_score: 10.0,
        questions: [
          { q_num: 1, level: 'Nhận biết (2.5đ)', content: 'Trình bày khái niệm mảng hai chiều và cách truy xuất phần tử trên dòng i, cột j trong bộ nhớ máy tính.', score: 2.5, answer_key: 'Khái niệm ma trận (1.0đ), công thức tính địa chỉ ô nhớ Row-Major (1.0đ), ví dụ code (0.5đ).' },
          { q_num: 2, level: 'Thông hiểu (3.5đ)', content: 'Giải thích nguyên lý hoạt động của cấu trúc rẽ nhánh switch-case và so sánh ưu thế về tốc độ với chuỗi if-else if lồng nhau.', score: 3.5, answer_key: 'Bảng nhảy Jump Table của switch-case (1.5đ), điều kiện áp dụng kiểu dữ liệu rời rạc (1.0đ), ví dụ minh họa (1.0đ).' },
          { q_num: 3, level: 'Vận dụng (2.5đ)', content: 'Viết chương trình chuẩn hóa chuỗi ký tự họ tên: loại bỏ khoảng trắng thừa đầu, cuối, giữa các từ và viết hoa chữ cái đầu mỗi từ.', score: 2.5, answer_key: 'Thuật toán duyệt chuỗi (1.5đ), tách từ và chuẩn hóa in hoa (0.5đ), xuất chuỗi kết quả (0.5đ).' },
          { q_num: 4, level: 'Vận dụng cao (1.5đ)', content: 'Cài đặt thuật toán sắp xếp mảng cấu trúc học sinh giảm dần theo điểm trung bình GPA bằng thuật toán QuickSort hoặc MergeSort.', score: 1.5, answer_key: 'Định nghĩa struct đúng (0.5đ), cài đặt hàm chia mảng/trộn mảng (0.5đ), thuật toán O(n log n) (0.5đ).' }
        ]
      },
      {
        paper_id: 3,
        paper_code: `DE-${cCode}-303`,
        paper_name: `Đề Thi Số 3 (Mã 303 - Dự bị) — ${cName}`,
        exam_type: eType,
        duration_minutes: duration,
        security_level: 'TUYỆT MẬT',
        matrix_clo: { remember_pct: 25, understand_pct: 35, apply_pct: 25, analyze_pct: 15 },
        total_score: 10.0,
        questions: [
          { q_num: 1, level: 'Nhận biết (2.5đ)', content: 'Định nghĩa con trỏ (pointer) trong C++. Giải thích sự khác biệt giữa toán tử & và toán tử *.', score: 2.5, answer_key: 'Định nghĩa ô nhớ (1.0đ), toán tử & lấy địa chỉ (0.75đ), toán tử * giải tham chiếu (0.75đ).' },
          { q_num: 2, level: 'Thông hiểu (3.5đ)', content: 'Trình bày cơ chế đọc và ghi tệp tin nhị phân bằng ifstream và ofstream. Tại sao tệp nhị phân có tốc độ truy xuất nhanh hơn tệp văn bản?', score: 3.5, answer_key: 'Cú pháp open/read/write (1.5đ), giải thích cơ chế binary không cần ép kiểu ASCII (1.0đ), đóng tệp an toàn (1.0đ).' },
          { q_num: 3, level: 'Vận dụng (2.5đ)', content: 'Viết hàm đệ quy tính số Fibonacci thứ n và phân tích tại sao kỹ thuật đệ quy có nhớ (Memoization) giúp giảm độ phức tạp từ O(2^n) về O(n).', score: 2.5, answer_key: 'Viết đúng đệ quy cơ sở (1.0đ), phân tích cây đệ quy (1.0đ), cài đặt mảng nhớ (0.5đ).' },
          { q_num: 4, level: 'Vận dụng cao (1.5đ)', content: 'Xây dựng module quản lý giỏ hàng gồm cấu trúc SanPham, tính tổng giá trị đơn hàng và áp dụng mã giảm giá theo ngưỡng chi tiêu.', score: 1.5, answer_key: 'Cấu trúc SanPham và mảng động (0.5đ), logic tính chiết khấu chính xác (0.5đ), định dạng hóa đơn đẹp (0.5đ).' }
        ]
      }
    ];

    // Tự động tạo hồ sơ thẩm định cho cả 3 đề thi
    const appraisalRecord = {
      id: Date.now(),
      appraisal_code: `BB-TD-${new Date().getFullYear()}-${cCode}-${Math.floor(Math.random() * 900 + 100)}`,
      course_code: cCode,
      course_name: cName,
      exam_paper_code: `BỘ 3 ĐỀ THI (${papers.map(p => p.paper_code).join(', ')})`,
      author_lecturer: (req.user && req.user.full_name) || 'TS. Hoàng Đức Em',
      reviewer_dept: 'TS. Nguyễn Văn An (Trưởng Bộ Môn CNPM)',
      council_president: 'PGS. TS. Trần Mạnh Tuấn (Trưởng Khoa CNTT)',
      created_at: new Date().toISOString(),
      status: 'APPROVED',
      criteria: {
        matrix_coverage_score: 9.8,
        bloom_distribution_score: 9.5,
        clarity_score: 9.6,
        security_classification: 'TUYET_MAT_CAP_TRUONG',
        exam_duration_fit: `PHÙ HỢP ${duration} PHÚT`,
        notes: `Đã hoàn thành thẩm định bộ 3 đề thi chính thức và dự bị cho môn ${cName}. Đáp ứng 100% chuẩn đầu ra TT 08/2021.`
      },
      digital_signatures: {
        author_signed: true,
        author_signed_at: new Date().toISOString(),
        reviewer_signed: true,
        reviewer_signed_at: new Date().toISOString(),
        president_signed: true,
        president_signed_at: new Date().toISOString(),
        digital_cert_id: `CERT-TCU-SHA256-${Date.now()}`
      }
    };

    appraisalStore.unshift(appraisalRecord);

    res.json({
      success: true,
      message: `Đã tự động soạn thành công bộ 3 đề thi chuẩn ma trận Bloom cho môn ${cName} và gửi sang Hội đồng Thẩm định số hóa!`,
      data: {
        papers,
        appraisal_record: appraisalRecord
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2.8. Lấy danh sách thẩm định đề thi
exports.getAppraisals = async (req, res) => {
  res.json({ success: true, data: appraisalStore });
};

// 2.9. Ký số biên bản thẩm định
exports.signAppraisalMinutes = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, notes } = req.body;
    const record = appraisalStore.find(a => a.id === Number(id));
    if (!record) return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ thẩm định' });

    if (role === 'reviewer') {
      record.digital_signatures.reviewer_signed = true;
      record.digital_signatures.reviewer_signed_at = new Date().toISOString();
    } else if (role === 'president') {
      record.digital_signatures.president_signed = true;
      record.digital_signatures.president_signed_at = new Date().toISOString();
      record.status = 'APPROVED';
    }
    if (notes) record.criteria.notes = notes;

    res.json({
      success: true,
      message: `Đã ký số thành công với tư cách ${role === 'president' ? 'Chủ tịch Hội đồng Thẩm định' : 'Trưởng Bộ Môn'}!`,
      data: record
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2.10. Sổ điểm sinh viên chi tiết theo từng học kỳ & toàn khóa tích lũy (TT 08/2021)
const studentDetailedTranscripts = {
  '1': {
    student_id: 1,
    student_code: '261IT001',
    full_name: 'Trần Văn Nam',
    birth_date: '15/08/2004',
    gender: 'Nam',
    email: 'nam.tv@techcorp.edu.vn',
    class_name: '66.CNTT-1',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    major_id: 'CNPM',
    major_code: '7480103',
    major_name: 'Kỹ thuật Phần mềm (Software Engineering)',
    cohort: 'K66',
    training_system: 'Đại học Chính quy (Theo hệ thống tín chỉ TT 08/2021)',
    advisor: 'TS. Hoàng Đức Em',
    cumulative: {
      total_credits_registered: 64,
      total_credits_passed: 64,
      cpa_10: 8.88,
      cpa_4: 3.87,
      academic_rank: 'XUẤT SẮC',
      status: 'Bình thường (Đạt chuẩn TT 08/2021/TT-BGDĐT)'
    },
    semesters: [
      {
        semester_number: 1,
        semester_name: 'Học kỳ 1 - Năm học 2024-2025',
        academic_year: '2024-2025',
        total_credits: 16,
        passed_credits: 16,
        gpa_10: 8.95,
        gpa_4: 3.91,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'MLN101', name: 'Triết học Mác - Lênin', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.45, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' },
          { code: 'ENG101', name: 'Tiếng Anh Học Thuật 1 (B1)', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.95, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MATH101', name: 'Toán Cao Cấp 1 (Giải tích 1)', credits: 3, attendance_score: 9.0, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.00, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MATH102', name: 'Đại Số Tuyến Tính & Hình Học', credits: 3, attendance_score: 10.0, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 9.00, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'IT101', name: 'Nhập Môn Lập Trình C/C++', credits: 4, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.35, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' }
        ]
      },
      {
        semester_number: 2,
        semester_name: 'Học kỳ 2 - Năm học 2024-2025',
        academic_year: '2024-2025',
        total_credits: 15,
        passed_credits: 15,
        gpa_10: 8.66,
        gpa_4: 3.80,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'MLN102', name: 'Kinh tế Chính trị Mác - Lênin', credits: 2, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.0, final_exam_score: 8.0, course_score_10: 8.20, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' },
          { code: 'ENG102', name: 'Tiếng Anh Học Thuật 2 (B2)', credits: 3, attendance_score: 9.5, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.65, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'PHYS101', name: 'Vật Lý Đại Cương & Thí Nghiệm', credits: 3, attendance_score: 8.5, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.30, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' },
          { code: 'IT201', name: 'Cơ Sở Dữ Liệu (Database Systems)', credits: 3, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.20, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'IT301', name: 'Cấu Trúc Dữ Liệu & Giải Thuật', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.95, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'PE101', name: 'Giáo Dục Thể Chất 1 (Bóng chuyền)', credits: 1, attendance_score: 10.0, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.10, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' }
        ]
      },
      {
        semester_number: 3,
        semester_name: 'Học kỳ 3 - Năm học 2025-2026',
        academic_year: '2025-2026',
        total_credits: 18,
        passed_credits: 18,
        gpa_10: 8.92,
        gpa_4: 3.86,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'MLN103', name: 'Chủ Nghĩa Xã Hội Khoa Học', credits: 2, attendance_score: 9.0, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.0, course_score_10: 8.10, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' },
          { code: 'IT302', name: 'Kiến Trúc Máy Tính & Hợp Ngữ', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.80, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'IT401', name: 'Mạng Máy Tính & Truyền Số Liệu', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.10, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'SE301', name: 'Công Nghệ Phần Mềm & Quản Lý Dự Án', credits: 3, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.5, course_score_10: 9.60, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'SE302', name: 'Lập Trình Hướng Đối Tượng Nâng Cao (OOP)', credits: 4, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.30, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'STAT101', name: 'Xác Suất Thống Kê & Phân Tích Dữ Liệu', credits: 3, attendance_score: 9.0, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.35, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' }
        ]
      },
      {
        semester_number: 4,
        semester_name: 'Học kỳ 4 - Năm học 2025-2026',
        academic_year: '2025-2026',
        total_credits: 15,
        passed_credits: 15,
        gpa_10: 8.96,
        gpa_4: 3.90,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'HCM101', name: 'Tư Tưởng Hồ Chí Minh', credits: 2, attendance_score: 9.5, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.65, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'IT402', name: 'Hệ Điều Hành (Operating Systems)', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.80, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'SE401', name: 'Phát Triển Ứng Dụng Web Fullstack (MERN)', credits: 4, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.5, course_score_10: 9.60, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'AI202', name: 'Lập Trình Python Cho Khoa Học Dữ Liệu & AI', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.10, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'IT303', name: 'An Toàn Thông Tin & Mật Mã Ứng Dụng', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.45, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' }
        ]
      }
    ]
  }
};

// Aliases cho các ID người dùng khác nhau của sinh viên (id 3: đăng nhập, id 1: dữ liệu mẫu)
studentDetailedTranscripts['3'] = studentDetailedTranscripts['1'];

exports.getStudentTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester } = req.query; // '1', '2', '3', '4', hoặc 'ALL'

    let transcript = studentDetailedTranscripts[studentId] || studentDetailedTranscripts['1'];
    if (!transcript) {
      transcript = studentDetailedTranscripts['1'];
    }

    let filteredCourses = [];
    let activeSemesterInfo = null;

    if (semester && semester !== 'ALL') {
      const semNum = Number(semester);
      const targetSem = transcript.semesters.find(s => s.semester_number === semNum) || transcript.semesters[0];
      filteredCourses = targetSem.courses.map(c => ({
        ...c,
        semester: targetSem.semester_number,
        semester_name: targetSem.semester_name
      }));
      activeSemesterInfo = targetSem;
    } else {
      // Toàn bộ các học kỳ tích lũy
      transcript.semesters.forEach(s => {
        s.courses.forEach(c => {
          filteredCourses.push({
            ...c,
            semester: s.semester_number,
            semester_name: s.semester_name
          });
        });
      });
      activeSemesterInfo = {
        semester_number: 'ALL',
        semester_name: 'Toàn khóa tích lũy (Học kỳ 1 - 4)',
        total_credits: transcript.cumulative.total_credits_registered,
        passed_credits: transcript.cumulative.total_credits_passed,
        gpa_10: transcript.cumulative.cpa_10,
        gpa_4: transcript.cumulative.cpa_4,
        academic_rank: transcript.cumulative.academic_rank
      };
    }

    res.json({
      success: true,
      data: {
        student: {
          student_id: transcript.student_id,
          student_code: transcript.student_code,
          full_name: transcript.full_name,
          birth_date: transcript.birth_date,
          gender: transcript.gender,
          faculty_id: transcript.faculty_id,
          faculty_name: transcript.faculty_name,
          major_id: transcript.major_id,
          major_name: transcript.major_name,
          cohort: transcript.cohort,
          class_name: transcript.class_name,
          training_system: transcript.training_system,
          advisor: transcript.advisor,
          email: transcript.email
        },
        semesters_list: transcript.semesters.map(s => ({
          semester_number: s.semester_number,
          semester_name: s.semester_name,
          academic_year: s.academic_year,
          credits: s.total_credits,
          gpa_10: s.gpa_10,
          gpa_4: s.gpa_4,
          academic_rank: s.academic_rank
        })),
        active_semester: activeSemesterInfo,
        courses: filteredCourses,
        cumulative: transcript.cumulative,
        printed_at: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getClassTranscript = async (req, res) => {
  res.json({
    success: true,
    data: {
      section_id: 1,
      course_name: 'Nhập môn Lập trình C/C++ (IT101)',
      class_name: '66.CNTT-1',
      semester: 'Học kỳ 1 - Năm học 2026-2027',
      faculty: 'Khoa Công Nghệ Thông Tin',
      lecturer: 'TS. Hoàng Đức Em',
      students: transcriptData.students
    }
  });
};
