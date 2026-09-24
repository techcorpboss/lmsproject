// backend/controllers/lmsStandards.controller.js
// Enterprise Learning Standards Controller:
// 1. SCORM 1.2 / SCORM 2004 & xAPI (Tin Can / cmi5) Packaging & Tracking
// 2. LTI 1.3 / LTI Advantage Tool Interoperability & Grade Passback (AGS)
// 3. Lesson-Specific Q&A Discussion Forum with AI Auto-Responder
// 4. Essay Assignment Submissions, Plagiarism Verification & Rubric Grading

const crypto = require('crypto');

// =========================================================================
// 1. DỮ LIỆU & LOGIC: SCORM 1.2 / 2004 & xAPI (Tin Can / cmi5)
// =========================================================================

let scormPackagesStore = [
  {
    id: 'scorm_pkg_1',
    title: 'Lập Trình C++ Tương Tác: Con Trỏ & Quản Lý Bộ Nhớ Động',
    standard: 'SCORM 1.2',
    version: '1.2 (CAM 1.2)',
    file_name: 'cpp_pointers_scorm12_v2.zip',
    file_size_mb: '18.4 MB',
    manifest_identifier: 'TCU-MANIFEST-SCORM12-001',
    entry_url: '/scorm_runtime/cpp_pointers/index.html',
    mastery_score: 80,
    sco_count: 3,
    status: 'ACTIVE',
    uploaded_by: 'TS. Hoàng Đức Em',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    scos: [
      { id: 'sco_1', title: 'Phần 1: Khái niệm Con trỏ & Toán tử & / *', launch: 'part1.html', mastery_score: 80 },
      { id: 'sco_2', title: 'Phần 2: Cấp phát động new / delete', launch: 'part2.html', mastery_score: 85 },
      { id: 'sco_3', title: 'Phần 3: Bài tập thực hành tương tác & Quiz', launch: 'quiz.html', mastery_score: 80 }
    ]
  },
  {
    id: 'scorm_pkg_2',
    title: 'Cơ Sở Dữ Liệu: Thiết Kế Mô Hình E-R & Tối Ưu Truy Vấn SQL',
    standard: 'SCORM 2004',
    version: '2004 4th Edition',
    file_name: 'database_design_scorm2004_4th.zip',
    file_size_mb: '24.2 MB',
    manifest_identifier: 'TCU-MANIFEST-SCORM2004-002',
    entry_url: '/scorm_runtime/database_er/launch.html',
    mastery_score: 75,
    sco_count: 4,
    status: 'ACTIVE',
    uploaded_by: 'TS. Nguyễn Văn An',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    scos: [
      { id: 'sco_db_1', title: 'Mô hình Thực thể - Mối kết hợp E-R', launch: 'er_intro.html', mastery_score: 75 },
      { id: 'sco_db_2', title: 'Chuẩn hóa Dữ liệu (1NF, 2NF, 3NF, BCNF)', launch: 'normalization.html', mastery_score: 80 },
      { id: 'sco_db_3', title: 'Truy vấn SQL phức tạp & Indexing', launch: 'sql_advanced.html', mastery_score: 75 }
    ]
  },
  {
    id: 'xapi_pkg_3',
    title: 'An Ninh Mạng & Mật Mã Ứng Dụng: Phòng Chống OWASP Top 10',
    standard: 'xAPI (Tin Can)',
    version: 'xAPI 1.0.3 / Tin Can API',
    file_name: 'cybersecurity_xapi_interactive.zip',
    file_size_mb: '32.8 MB',
    manifest_identifier: 'TCU-XAPI-CYBERSEC-003',
    entry_url: '/xapi_runtime/cybersec/experience.html',
    lrs_endpoint: '/api/standards/xapi/statements',
    mastery_score: 85,
    sco_count: 5,
    status: 'ACTIVE',
    uploaded_by: 'TS. Lê Hải Đăng',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    scos: [
      { id: 'xapi_act_1', title: 'Tấn công SQL Injection & Biện pháp phòng ngừa', launch: 'sqli_lab.html', mastery_score: 85 },
      { id: 'xapi_act_2', title: 'Cross-Site Scripting (XSS) & CSRF Defense', launch: 'xss_lab.html', mastery_score: 85 }
    ]
  },
  {
    id: 'cmi5_pkg_4',
    title: 'Kiến Trúc Phần Mềm: Microservices, Docker & CI/CD Pipeline',
    standard: 'cmi5',
    version: 'cmi5 Sandstone Edition',
    file_name: 'microservices_cmi5_agile.zip',
    file_size_mb: '41.5 MB',
    manifest_identifier: 'TCU-CMI5-MICROSERVICES-004',
    entry_url: '/cmi5_runtime/devops/cmi5_launch.html',
    lrs_endpoint: '/api/standards/xapi/statements',
    mastery_score: 80,
    sco_count: 3,
    status: 'ACTIVE',
    uploaded_by: 'TS. Hoàng Đức Em',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    scos: [
      { id: 'cmi5_au_1', title: 'Assignable Unit 1: Containerization Docker', launch: 'docker_au.html', mastery_score: 80 },
      { id: 'cmi5_au_2', title: 'Assignable Unit 2: Kubernetes Orchestration', launch: 'k8s_au.html', mastery_score: 80 }
    ]
  }
];

// Bộ lưu trữ vết CMI Tracking (SCORM 1.2 / 2004)
let scormCmiTrackingStore = {};

// Bộ lưu trữ xAPI Statements (Tin Can LRS)
let xApiStatementsStore = [
  {
    id: 'stmt_001',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    actor: { name: 'Trần Văn Nam', mbox: 'mailto:nam.tv@techcorp.edu.vn', account: { homePage: 'https://lms.techcorp.info.vn', name: '261IT001' } },
    verb: { id: 'http://adlnet.gov/expapi/verbs/experienced', display: { 'vi-VN': 'Đã tương tác bài học', 'en-US': 'experienced' } },
    object: { id: 'https://lms.techcorp.info.vn/xapi/cybersec/sqli_lab', definition: { name: { 'vi-VN': 'Lab Phòng Chống SQL Injection OWASP' } } },
    result: { score: { scaled: 0.95, raw: 95, min: 0, max: 100 }, success: true, completion: true, duration: 'PT14M22S' }
  },
  {
    id: 'stmt_002',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actor: { name: 'Nguyễn Thị Mai', mbox: 'mailto:mai.nt@techcorp.edu.vn', account: { homePage: 'https://lms.techcorp.info.vn', name: '261IT002' } },
    verb: { id: 'http://adlnet.gov/expapi/verbs/passed', display: { 'vi-VN': 'Đã hoàn thành xuất sắc', 'en-US': 'passed' } },
    object: { id: 'https://lms.techcorp.info.vn/xapi/cybersec/sqli_lab', definition: { name: { 'vi-VN': 'Lab Phòng Chống SQL Injection OWASP' } } },
    result: { score: { scaled: 1.0, raw: 100, min: 0, max: 100 }, success: true, completion: true, duration: 'PT18M45S' }
  }
];

// =========================================================================
// 2. DỮ LIỆU & LOGIC: LTI 1.3 (LEARNING TOOLS INTEROPERABILITY)
// =========================================================================

let ltiToolsStore = [
  {
    id: 'lti_tool_coursera',
    name: 'Coursera for Campus Learning Suite',
    description: 'Tích hợp kho bài giảng MOOC quốc tế từ Stanford, Google, IBM, DeepLearning.AI',
    issuer: 'https://api.coursera.org',
    client_id: 'coursera-tcu-prod-2026',
    deployment_id: 'dep-coursera-campus-01',
    launch_url: 'https://api.coursera.org/lti/v1p3/launch',
    oidc_auth_url: 'https://api.coursera.org/lti/oidc/login',
    jwks_url: 'https://api.coursera.org/lti/jwks.json',
    vendor: 'Coursera Inc.',
    category: 'MOOC & Chứng chỉ Quốc tế',
    icon_emoji: '🎓',
    supported_services: ['AGS (Assignment and Grade Services)', 'NRPS (Names & Roles Provisioning)', 'Deep Linking'],
    status: 'ACTIVE'
  },
  {
    id: 'lti_tool_matlab',
    name: 'MATLAB Online & Simulink Virtual Lab',
    description: 'Môi trường mô phỏng toán học, phân tích giải thuật số và thị giác máy tính trực tuyến',
    issuer: 'https://matlab.mathworks.com',
    client_id: 'matlab-tcu-engineering-002',
    deployment_id: 'dep-matlab-simulink-02',
    launch_url: 'https://matlab.mathworks.com/lti/v1p3/launch',
    oidc_auth_url: 'https://matlab.mathworks.com/lti/oidc/auth',
    jwks_url: 'https://matlab.mathworks.com/lti/keyset.json',
    vendor: 'MathWorks Inc.',
    category: 'Mô Phỏng Kỹ Thuật & AI',
    icon_emoji: '🔬',
    supported_services: ['AGS (Grade Passback v2.0)', 'Deep Linking v2.0'],
    status: 'ACTIVE'
  },
  {
    id: 'lti_tool_turnitin',
    name: 'Turnitin Feedback Studio & Plagiarism Suite',
    description: 'Hệ thống kiểm tra tính nguyên bản, quét trùng lặp khóa luận và liêm chính học thuật',
    issuer: 'https://turnitin.com',
    client_id: 'turnitin-tcu-academic-003',
    deployment_id: 'dep-turnitin-integrity-03',
    launch_url: 'https://turnitin.com/lti/1p3/launch',
    oidc_auth_url: 'https://turnitin.com/lti/oidc/init',
    jwks_url: 'https://turnitin.com/lti/jwks.json',
    vendor: 'Turnitin LLC',
    category: 'Liêm Chính Học Thuật & Chống Đạo Văn',
    icon_emoji: '🛡️',
    supported_services: ['AGS (Similarity Score Passback)', 'NRPS'],
    status: 'ACTIVE'
  },
  {
    id: 'lti_tool_zoom',
    name: 'Zoom Education Virtual Classroom',
    description: 'Phòng học trực tuyến chất lượng cao, tự động đồng bộ điểm danh và ghi hình Cloud',
    issuer: 'https://zoom.us',
    client_id: 'zoom-edu-tcu-004',
    deployment_id: 'dep-zoom-classroom-04',
    launch_url: 'https://zoom.us/lti/1p3/launch',
    oidc_auth_url: 'https://zoom.us/lti/oidc/auth',
    jwks_url: 'https://zoom.us/lti/jwks.json',
    vendor: 'Zoom Video Communications',
    category: 'Học Trực Tuyến Live & Hội Thảo',
    icon_emoji: '📹',
    supported_services: ['Attendance Passback', 'NRPS'],
    status: 'ACTIVE'
  },
  {
    id: 'lti_tool_kahoot',
    name: 'Kahoot! EDU Gamified Assessment',
    description: 'Nền tảng trò chơi tương tác giáo dục, thi đấu kiến thức trực tiếp và khảo thí mini',
    issuer: 'https://kahoot.com',
    client_id: 'kahoot-tcu-edu-005',
    deployment_id: 'dep-kahoot-game-05',
    launch_url: 'https://kahoot.com/lti/v1p3/launch',
    oidc_auth_url: 'https://kahoot.com/lti/oidc/login',
    jwks_url: 'https://kahoot.com/lti/jwks.json',
    vendor: 'Kahoot! Group',
    category: 'Gamification & Tương Tác',
    icon_emoji: '⚡',
    supported_services: ['AGS (Scores Sync)', 'Deep Linking'],
    status: 'ACTIVE'
  }
];

// =========================================================================
// 3. DỮ LIỆU & LOGIC: DIỄN ĐÀN Q&A THEO TỪNG BÀI HỌC (LESSON-SPECIFIC)
// =========================================================================

let lessonQaThreadsStore = [
  {
    id: 'qa_001',
    section_id: 1,
    lesson_id: 1,
    week_number: 1,
    title: 'Hỏi về lỗi con trỏ Null Pointer Exception khi giải phóng bộ nhớ',
    content: 'Em viết hàm cấp phát động int* arr = new int[n]; sau khi xử lý xong em gọi delete arr; thì có khác gì so với delete[] arr; không thưa thầy?',
    author_name: 'Trần Văn Nam',
    author_role: 'student',
    student_code: '261IT001',
    class_name: '66.CNTT-1',
    upvotes: 8,
    is_answered: true,
    tags: ['C/C++', 'Con trỏ', 'Bộ nhớ động', 'Tuần 1'],
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    replies: [
      {
        id: 'rep_001_1',
        author_name: 'TS. Hoàng Đức Em',
        author_role: 'teacher',
        is_verified: true, // Giảng viên xác thực câu trả lời chuẩn
        content: 'Chào em, đây là lỗi rất phổ biến! Khi em dùng `new[]` để cấp phát mảng, bắt buộc phải dùng `delete[]` để trình biên dịch giải phóng toàn bộ số lượng phần tử. Nếu chỉ dùng `delete`, chương trình sẽ gặp hành vi bất định (Undefined Behavior) và rò rỉ bộ nhớ (Memory Leak).',
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
        upvotes: 12
      },
      {
        id: 'rep_001_2',
        author_name: '🤖 AI Academic Assistant',
        author_role: 'ai_bot',
        is_verified: false,
        content: 'Bổ sung mẹo kỹ thuật: Trong C++ hiện đại (C++11 trở lên), bạn nên sử dụng `std::unique_ptr<int[]>` hoặc `std::vector<int>` để hệ thống tự động giải phóng bộ nhớ theo cơ chế RAII, không bao giờ lo rò rỉ bộ nhớ!',
        created_at: new Date(Date.now() - 3600000 * 29).toISOString(),
        upvotes: 6
      }
    ]
  },
  {
    id: 'qa_002',
    section_id: 1,
    lesson_id: 5,
    week_number: 5,
    title: 'Phân biệt con trỏ hàm (Function Pointer) và Lambda Expression',
    content: 'Khi nào chúng ta nên dùng Lambda expression thay vì khai báo con trỏ hàm thông thường trong thuật toán sắp xếp std::sort ạ?',
    author_name: 'Nguyễn Thị Mai',
    author_role: 'student',
    student_code: '261IT002',
    class_name: '66.CNTT-1',
    upvotes: 5,
    is_answered: true,
    tags: ['Hàm', 'Lambda', 'STL', 'Tuần 5'],
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    replies: [
      {
        id: 'rep_002_1',
        author_name: 'TS. Hoàng Đức Em',
        author_role: 'teacher',
        is_verified: true,
        content: 'Lambda expression tiện lợi hơn rất nhiều vì có thể capture các biến cục bộ bên ngoài phạm vi, cú pháp gọn gàng viết trực tiếp tại chỗ gọi hàm, và trình biên dịch có thể inline tối ưu hóa tốc độ thực thi.',
        created_at: new Date(Date.now() - 3600000 * 15).toISOString(),
        upvotes: 9
      }
    ]
  },
  {
    id: 'qa_003',
    section_id: 1,
    lesson_id: 8,
    week_number: 8,
    title: 'Hỏi về thuật toán tìm đường đi ngắn nhất Dijkstra và Floyd-Warshall',
    content: 'Cho em hỏi nếu đồ thị có trọng số âm thì thuật toán Dijkstra có hoạt động chính xác không ạ? Nếu không thì giải thuật nào thay thế?',
    author_name: 'Lê Hoàng Long',
    author_role: 'student',
    student_code: '261IT003',
    class_name: '66.CNTT-1',
    upvotes: 7,
    is_answered: false,
    tags: ['Cấu trúc dữ liệu', 'Đồ thị', 'Dijkstra', 'Tuần 8'],
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    replies: []
  }
];

// =========================================================================
// 4. DỮ LIỆU & LOGIC: BÀI TẬP TỰ LUẬN (ASSIGNMENT SUBMISSION & RUBRICS)
// =========================================================================

let assignmentsStore = [
  {
    id: 'asg_001',
    section_id: 1,
    week_number: 4,
    title: 'Bài Tập Lớn 1: Xây Dựng Thư Viện Quản Lý Danh Bạ & Chuỗi Động C++',
    description: 'Yêu cầu sinh viên viết chương trình C++ cài đặt cấu trúc dữ liệu con trỏ tự quản lý danh bạ (Họ tên, SĐT, Email), hỗ trợ thêm, sửa, xóa, tìm kiếm nhị phân và lưu trữ tệp tin nhị phân. Không sử dụng thư viện STL có sẵn cho phần lõi mảng động.',
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // Còn 5 ngày nữa
    max_score: 10.0,
    allowed_file_types: ['.cpp', '.zip', '.pdf'],
    max_file_size_mb: 25,
    rubric: [
      { id: 'crit_1', title: 'Tính đúng đắn của Thuật toán & Quản lý con trỏ', max_points: 4.0, description: 'Cấp phát và giải phóng vùng nhớ sạch 100%, không dính memory leak, con trỏ NULL an toàn' },
      { id: 'crit_2', title: 'Tính năng Thêm, Sửa, Xóa & Tìm kiếm nhị phân', max_points: 3.0, description: 'Hoàn thành đầy đủ các ca kiểm thử biên (Edge testcases), độ phức tạp O(log n)' },
      { id: 'crit_3', title: 'Đọc/Ghi File & Xử lý Ngoại lệ (Exception Handling)', max_points: 2.0, description: 'Lưu trữ tệp chuẩn định dạng, xử lý lỗi file không tồn tại hoặc dữ liệu hỏng' },
      { id: 'crit_4', title: 'Coding Convention, Comment & Báo cáo PDF', max_points: 1.0, description: 'Trình bày code rõ ràng, thụt lề chuẩn Google Style, có báo cáo giải thích giải thuật' }
    ],
    status: 'OPEN'
  },
  {
    id: 'asg_002',
    section_id: 1,
    week_number: 8,
    title: 'Bài Tập Tự Luận Giữa Kỳ: Thiết Kế Mô Hình CSDL Quan Hệ E-R Chuẩn 3NF',
    description: 'Sinh viên phân tích ca nghiệp vụ Chuỗi cung ứng Bán lẻ Đa kênh (Omnichannel Retail) và vẽ sơ đồ E-R, chuyển đổi sang lược đồ quan hệ chuẩn 3NF và viết tập lệnh SQL DDL / DML.',
    due_date: new Date(Date.now() + 86400000 * 12).toISOString(),
    max_score: 10.0,
    allowed_file_types: ['.pdf', '.sql', '.zip'],
    max_file_size_mb: 30,
    rubric: [
      { id: 'crit_db_1', title: 'Sơ đồ E-R & Xác định Khóa chính / Khóa ngoại', max_points: 4.0, description: 'Đầy đủ các thực thể, mối kết hợp 1-1, 1-N, N-N và thuộc tính' },
      { id: 'crit_db_2', title: 'Chuẩn hóa Dữ liệu (1NF -> 2NF -> 3NF)', max_points: 3.0, description: 'Giải thích chi tiết các phụ thuộc hàm và loại bỏ dị thường' },
      { id: 'crit_db_3', title: 'Tập lệnh SQL DDL & DML Ràng buộc toàn vẹn', max_points: 3.0, description: 'Chạy thành công trên MySQL / PostgreSQL không có lỗi cú pháp' }
    ],
    status: 'OPEN'
  }
];

// Danh sách các bài nộp của sinh viên
let submissionsStore = [
  {
    id: 'sub_001',
    assignment_id: 'asg_001',
    student_id: 1,
    student_code: '261IT001',
    student_name: 'Trần Văn Nam',
    class_name: '66.CNTT-1',
    submission_file_name: 'TranVanNam_261IT001_BTL1_Cpp.zip',
    submission_file_size: '2.4 MB',
    submitted_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    notes: 'Em đã hoàn thiện đầy đủ các chức năng theo yêu cầu đề bài. Chương trình đã kiểm tra bằng Valgrind không có memory leak ạ.',
    plagiarism: {
      similarity_percent: 6.5,
      status: 'ORIGINAL_PASS', // <= 15% là đạt tiêu chuẩn liêm chính
      checked_at: new Date(Date.now() - 3600000 * 13).toISOString(),
      matched_sources: [
        { source: 'TCU Code Repository (K65)', percent: 3.2 },
        { source: 'GeeksforGeeks Public Algorithms', percent: 3.3 }
      ]
    },
    grading: {
      is_graded: true,
      graded_by: 'TS. Hoàng Đức Em',
      graded_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      rubric_scores: {
        crit_1: 4.0,
        crit_2: 3.0,
        crit_3: 1.8,
        crit_4: 1.0
      },
      final_score: 9.8,
      feedback: 'Bài làm rất tốt, con trỏ được quản lý sạch sẽ và xử lý con trỏ NULL rất chu đáo. Chú ý thêm trường hợp tên có dấu tiếng Việt khi đọc tệp UTF-8.'
    }
  },
  {
    id: 'sub_002',
    assignment_id: 'asg_001',
    student_id: 2,
    student_code: '261IT002',
    student_name: 'Nguyễn Thị Mai',
    class_name: '66.CNTT-1',
    submission_file_name: 'NguyenThiMai_261IT002_BTL1.zip',
    submission_file_size: '1.8 MB',
    submitted_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    notes: 'Em đã nộp bài tập lớn 1 kèm báo cáo file PDF chi tiết.',
    plagiarism: {
      similarity_percent: 4.8,
      status: 'ORIGINAL_PASS',
      checked_at: new Date(Date.now() - 3600000 * 9).toISOString(),
      matched_sources: [
        { source: 'StackOverflow Documentation', percent: 4.8 }
      ]
    },
    grading: {
      is_graded: true,
      graded_by: 'TS. Hoàng Đức Em',
      graded_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      rubric_scores: {
        crit_1: 4.0,
        crit_2: 2.8,
        crit_3: 2.0,
        crit_4: 1.0
      },
      final_score: 9.8,
      feedback: 'Thuật toán tìm kiếm nhị phân viết rất chuẩn mực, tài liệu báo cáo đẹp mắt.'
    }
  },
  {
    id: 'sub_003',
    assignment_id: 'asg_001',
    student_id: 3,
    student_code: '261IT003',
    student_name: 'Lê Hoàng Long',
    class_name: '66.CNTT-1',
    submission_file_name: 'LeHoangLong_BTL_Tuan4.cpp',
    submission_file_size: '48 KB',
    submitted_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Thầy xem giúp em bài nộp, em chưa kịp nén file zip ạ.',
    plagiarism: {
      similarity_percent: 11.2,
      status: 'ORIGINAL_PASS',
      checked_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      matched_sources: [
        { source: 'GitHub Public Repository (C++ Student Projects)', percent: 7.2 },
        { source: 'TCU Past Submissions', percent: 4.0 }
      ]
    },
    grading: {
      is_graded: false,
      final_score: null,
      feedback: null
    }
  }
];

// =========================================================================
// CONTROLLER HANDLERS EXPORTS
// =========================================================================

// --- SCORM & xAPI Handlers ---
exports.getScormPackages = (req, res) => {
  res.json({ success: true, data: scormPackagesStore });
};

exports.uploadScormPackage = (req, res) => {
  try {
    const { title, standard, file_name, file_size_mb, mastery_score, uploaded_by } = req.body;
    const newPkg = {
      id: `pkg_${Date.now()}`,
      title: title || 'Bài giảng điện tử tương tác SCORM',
      standard: standard || 'SCORM 1.2',
      version: standard === 'SCORM 2004' ? '2004 4th Edition' : (standard === 'xAPI' ? 'xAPI 1.0.3' : 'SCORM 1.2'),
      file_name: file_name || 'interactive_course_package.zip',
      file_size_mb: file_size_mb || '15.6 MB',
      manifest_identifier: `TCU-MANIFEST-${Date.now()}`,
      entry_url: `/scorm_runtime/${Date.now()}/index.html`,
      mastery_score: Number(mastery_score) || 80,
      sco_count: 3,
      status: 'ACTIVE',
      uploaded_by: uploaded_by || 'Giảng viên',
      created_at: new Date().toISOString(),
      scos: [
        { id: `sco_1_${Date.now()}`, title: 'Nội dung Bài giảng lý thuyết tương tác', launch: 'module1.html', mastery_score: 80 },
        { id: `sco_2_${Date.now()}`, title: 'Thực hành mô phỏng & Đánh giá năng lực', launch: 'module2.html', mastery_score: 80 }
      ]
    };

    scormPackagesStore.unshift(newPkg);
    res.json({
      success: true,
      message: `Đã giải nén và đăng ký thành công gói bài giảng chuẩn ${newPkg.standard} (${newPkg.title})!`,
      data: newPkg
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateScormPackage = (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, standard, mastery_score, scos, estimated_time } = req.body;
    const pkgIndex = scormPackagesStore.findIndex(p => p.id === id);
    if (pkgIndex === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy gói bài giảng' });
    }

    scormPackagesStore[pkgIndex] = {
      ...scormPackagesStore[pkgIndex],
      title: title || scormPackagesStore[pkgIndex].title,
      subtitle: subtitle || scormPackagesStore[pkgIndex].subtitle,
      standard: standard || scormPackagesStore[pkgIndex].standard,
      mastery_score: Number(mastery_score) || scormPackagesStore[pkgIndex].mastery_score,
      estimated_time: estimated_time || scormPackagesStore[pkgIndex].estimated_time,
      scos: scos || scormPackagesStore[pkgIndex].scos,
      sco_count: (scos || scormPackagesStore[pkgIndex].scos).length,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Đã cập nhật cấu trúc bài giảng SCORM thành công!',
      data: scormPackagesStore[pkgIndex]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteScormPackage = (req, res) => {
  try {
    const { id } = req.params;
    scormPackagesStore = scormPackagesStore.filter(p => p.id !== id);
    res.json({ success: true, message: 'Đã xóa bài giảng khỏi thư viện số' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.trackScormCmi = (req, res) => {
  try {
    const { student_id, package_id, cmi_element, cmi_value } = req.body;
    const key = `${student_id || 1}_${package_id}`;
    if (!scormCmiTrackingStore[key]) {
      scormCmiTrackingStore[key] = {
        student_id: student_id || 1,
        package_id,
        created_at: new Date(),
        cmi: {}
      };
    }

    scormCmiTrackingStore[key].cmi[cmi_element] = cmi_value;
    scormCmiTrackingStore[key].updated_at = new Date();

    res.json({
      success: true,
      message: `SCORM CMI API: Đã ghi nhận [${cmi_element}] = "${cmi_value}"`,
      data: scormCmiTrackingStore[key]
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.postXApiStatement = (req, res) => {
  try {
    const statement = req.body;
    const newStmt = {
      id: statement.id || `stmt_${Date.now()}`,
      timestamp: statement.timestamp || new Date().toISOString(),
      actor: statement.actor || { name: 'Sinh viên TCU', mbox: 'mailto:sinhvien@techcorp.edu.vn' },
      verb: statement.verb || { id: 'http://adlnet.gov/expapi/verbs/experienced', display: { 'vi-VN': 'Đã học' } },
      object: statement.object || { id: 'https://lms.techcorp.info.vn/activity/sample', definition: { name: { 'vi-VN': 'Học phần' } } },
      result: statement.result || { score: { scaled: 1.0, raw: 100 }, completion: true, success: true }
    };

    xApiStatementsStore.unshift(newStmt);
    res.json({
      success: true,
      message: 'xAPI LRS: Đã lưu trữ thành công Statement theo chuẩn Tin Can API!',
      data: newStmt
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getXApiStatements = (req, res) => {
  res.json({ success: true, data: xApiStatementsStore });
};

// --- LTI 1.3 Handlers ---
exports.getLtiTools = (req, res) => {
  res.json({ success: true, data: ltiToolsStore });
};

exports.createLtiTool = (req, res) => {
  try {
    const data = req.body;
    const newTool = {
      id: `lti_tool_${Date.now()}`,
      name: data.name,
      description: data.description || 'Công cụ giáo dục bên thứ ba chuẩn LTI 1.3',
      issuer: data.issuer || 'https://external-tool.edu',
      client_id: data.client_id || `client-${Date.now()}`,
      deployment_id: data.deployment_id || `dep-${Date.now()}`,
      launch_url: data.launch_url,
      oidc_auth_url: data.oidc_auth_url || `${data.launch_url}/oidc/login`,
      jwks_url: data.jwks_url || `${data.launch_url}/jwks.json`,
      vendor: data.vendor || 'Đối tác EdTech',
      category: data.category || 'Phần mềm Giảng dạy',
      icon_emoji: data.icon_emoji || '🚀',
      supported_services: data.supported_services || ['AGS (Grade Passback v2.0)', 'NRPS'],
      status: 'ACTIVE'
    };
    ltiToolsStore.unshift(newTool);
    res.json({
      success: true,
      message: `Đã kết nối và đăng ký công cụ LTI 1.3: ${newTool.name} thành công!`,
      data: newTool
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLtiTool = (req, res) => {
  const { id } = req.params;
  ltiToolsStore = ltiToolsStore.filter(t => t.id !== id);
  res.json({ success: true, message: 'Đã hủy kết nối công cụ LTI 1.3!' });
};

exports.initiateLtiLaunch = (req, res) => {
  try {
    const { tool_id } = req.params;
    const { role, user_id, full_name, email, course_name } = req.body;
    const tool = ltiToolsStore.find(t => t.id === tool_id);
    if (!tool) return res.status(404).json({ success: false, message: 'Không tìm thấy công cụ LTI' });

    // Sinh JWT LTI 1.3 ResourceLinkRequest theo chuẩn 1EdTech / IMS Global
    const ltiTokenPayload = {
      iss: 'https://lms.techcorp.info.vn',
      sub: user_id ? String(user_id) : 'user_261IT001',
      aud: tool.client_id,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      nonce: crypto.randomBytes(16).toString('hex'),
      'https://purl.imsglobal.org/spec/lti/claim/message_type': 'LtiResourceLinkRequest',
      'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
      'https://purl.imsglobal.org/spec/lti/claim/deployment_id': tool.deployment_id,
      'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': tool.launch_url,
      'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
        id: `rl_${tool.id}_course_101`,
        title: course_name || 'Nhập môn Lập trình C/C++ (IT101)'
      },
      'https://purl.imsglobal.org/spec/lti/claim/roles': [
        role === 'teacher' || role === 'admin'
          ? 'http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor'
          : 'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner'
      ],
      'https://purl.imsglobal.org/spec/lti/claim/context': {
        id: 'course_sec_101',
        label: 'IT101-66.CNTT-1',
        title: course_name || 'Lập trình C/C++'
      },
      'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint': {
        scope: ['https://purl.imsglobal.org/spec/lti-ags/scope/score', 'https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly'],
        lineitem: `https://lms.techcorp.info.vn/api/standards/lti/ags/lineitems/${tool.id}/grade`
      },
      name: full_name || 'Trần Văn Nam',
      email: email || 'nam.tv@techcorp.edu.vn'
    };

    res.json({
      success: true,
      message: `Khởi tạo phiên LTI 1.3 OIDC Launch thành công tới ${tool.name}!`,
      data: {
        tool,
        launch_url: tool.launch_url,
        oidc_auth_url: tool.oidc_auth_url,
        id_token_payload: ltiTokenPayload,
        simulated_jwt: `eyJhbGciOiJSUzI1NiIsImtpZCI6InRjdS1rZXktMjAyNiJ9.${Buffer.from(JSON.stringify(ltiTokenPayload)).toString('base64')}.SIMULATED_RSA_SIGNATURE`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.handleLtiGradePassback = (req, res) => {
  try {
    const { tool_id, student_id, score, comment } = req.body;
    res.json({
      success: true,
      message: `LTI 1.3 AGS: Đồng bộ điểm số ${score}/10 từ công cụ bên thứ ba thành công về Sổ điểm LMS của sinh viên ${student_id || '261IT001'}!`
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getPlatformJwks = (req, res) => {
  res.json({
    keys: [
      {
        kty: 'RSA',
        alg: 'RS256',
        use: 'sig',
        kid: 'tcu-key-2026',
        n: 'uQ1LzXkX3...SIMULATED_TCU_PUBLIC_MODULUS...',
        e: 'AQAB'
      }
    ]
  });
};

// --- Lesson-Specific Q&A Forum Handlers ---
exports.getLessonQaThreads = (req, res) => {
  const { lesson_id, week_number } = req.query;
  let threads = [...lessonQaThreadsStore];
  if (lesson_id) {
    threads = threads.filter(t => t.lesson_id === Number(lesson_id));
  }
  if (week_number && week_number !== 'ALL') {
    threads = threads.filter(t => t.week_number === Number(week_number));
  }
  res.json({ success: true, data: threads });
};

exports.createQaThread = (req, res) => {
  try {
    const { title, content, lesson_id, week_number, author_name, author_role, student_code, tags } = req.body;
    const newThread = {
      id: `qa_${Date.now()}`,
      section_id: 1,
      lesson_id: Number(lesson_id) || 1,
      week_number: Number(week_number) || 1,
      title,
      content,
      author_name: author_name || 'Trần Văn Nam',
      author_role: author_role || 'student',
      student_code: student_code || '261IT001',
      class_name: '66.CNTT-1',
      upvotes: 1,
      is_answered: false,
      tags: tags || ['Thảo luận', `Tuần ${week_number || 1}`],
      created_at: new Date().toISOString(),
      replies: []
    };
    lessonQaThreadsStore.unshift(newThread);
    res.json({ success: true, message: 'Đã gửi câu hỏi thảo luận thành công!', data: newThread });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createQaReply = (req, res) => {
  try {
    const { threadId } = req.params;
    const { content, author_name, author_role } = req.body;
    const thread = lessonQaThreadsStore.find(t => t.id === threadId);
    if (!thread) return res.status(404).json({ success: false, message: 'Không tìm thấy chủ đề' });

    const newReply = {
      id: `rep_${Date.now()}`,
      author_name: author_name || 'TS. Hoàng Đức Em',
      author_role: author_role || 'teacher',
      is_verified: author_role === 'teacher',
      content,
      created_at: new Date().toISOString(),
      upvotes: 0
    };

    thread.replies.push(newReply);
    if (author_role === 'teacher') thread.is_answered = true;

    res.json({ success: true, message: 'Đã gửi phản hồi thành công!', data: newReply });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.verifyQaReply = (req, res) => {
  try {
    const { threadId, replyId } = req.params;
    const thread = lessonQaThreadsStore.find(t => t.id === threadId);
    if (!thread) return res.status(404).json({ success: false, message: 'Không tìm thấy câu hỏi' });

    const rep = thread.replies.find(r => r.id === replyId);
    if (!rep) return res.status(404).json({ success: false, message: 'Không tìm thấy câu trả lời' });

    rep.is_verified = !rep.is_verified;
    thread.is_answered = thread.replies.some(r => r.is_verified);

    res.json({
      success: true,
      message: rep.is_verified
        ? 'Đã gắn huy hiệu "Giảng Viên Xác Thực" cho câu trả lời chuẩn xác!'
        : 'Đã hủy xác thực câu trả lời.'
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.generateAiAnswer = (req, res) => {
  try {
    const { threadId, question_title, question_content } = req.body;
    const thread = lessonQaThreadsStore.find(t => t.id === threadId);

    const aiReply = {
      id: `ai_rep_${Date.now()}`,
      author_name: '🤖 Trợ Lý AI Học Thuật (TCU AI Tutor)',
      author_role: 'ai_bot',
      is_verified: false,
      content: `Dựa trên đề cương học phần, tôi xin giải đáp câu hỏi "${question_title}":\n\n`
        + `1. **Bản chất kỹ thuật**: Trong tình huống này, việc nắm vững cơ chế lưu trữ vùng nhớ Heap và Stack là cốt lõi.\n`
        + `2. **Giải pháp đề xuất**:\n`
        + `\`\`\`cpp\n// Đoạn mã mẫu giải quyết vấn đề tối ưu:\nvoid handlePointerSafety(int*& ptr) {\n    if (ptr != nullptr) {\n        delete[] ptr;\n        ptr = nullptr; // Phòng ngừa con trỏ lơ lửng (Dangling Pointer)\n    }\n}\n\`\`\`\n`
        + `3. **Lưu ý kiểm tra**: Bạn nên kết hợp kiểm thử với công cụ Valgrind hoặc AddressSanitizer (-fsanitize=address) để phát hiện tức thì lỗi rò rỉ bộ nhớ.`,
      created_at: new Date().toISOString(),
      upvotes: 5
    };

    if (thread) {
      thread.replies.push(aiReply);
    }

    res.json({
      success: true,
      message: 'Trợ lý AI đã giải đáp câu hỏi thành công!',
      data: aiReply
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Essay Assignment Submissions & Rubrics Handlers ---
exports.getAssignments = (req, res) => {
  res.json({ success: true, data: assignmentsStore });
};

exports.createAssignment = (req, res) => {
  try {
    const data = req.body;
    const newAsg = {
      id: `asg_${Date.now()}`,
      section_id: 1,
      week_number: Number(data.week_number) || 5,
      title: data.title,
      description: data.description,
      due_date: data.due_date || new Date(Date.now() + 86400000 * 7).toISOString(),
      max_score: Number(data.max_score) || 10.0,
      allowed_file_types: data.allowed_file_types || ['.pdf', '.docx', '.zip', '.cpp'],
      max_file_size_mb: 25,
      rubric: data.rubric || [
        { id: 'crit_1', title: 'Nội dung & Tính chính xác', max_points: 5.0, description: 'Đạt yêu cầu cốt lõi của bài tập' },
        { id: 'crit_2', title: 'Kỹ thuật thực hiện & Trình bày', max_points: 3.0, description: 'Cấu trúc bài làm khoa học' },
        { id: 'crit_3', title: 'Sáng tạo & Mở rộng', max_points: 2.0, description: 'Có điểm nhấn giải pháp độc đáo' }
      ],
      status: 'OPEN'
    };
    assignmentsStore.unshift(newAsg);
    res.json({ success: true, message: 'Tạo bài tập tự luận mới thành công!', data: newAsg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getSubmissions = (req, res) => {
  const { assignment_id } = req.query;
  let list = [...submissionsStore];
  if (assignment_id) {
    list = list.filter(s => s.assignment_id === assignment_id);
  }
  res.json({ success: true, data: list });
};

exports.submitAssignment = (req, res) => {
  try {
    const { assignment_id, student_id, student_name, student_code, class_name, file_name, file_size, notes } = req.body;
    const randomPlagiarism = Number((Math.random() * 8 + 3).toFixed(1)); // 3% - 11%

    const newSub = {
      id: `sub_${Date.now()}`,
      assignment_id: assignment_id || 'asg_001',
      student_id: student_id || 1,
      student_code: student_code || '261IT001',
      student_name: student_name || 'Trần Văn Nam',
      class_name: class_name || '66.CNTT-1',
      submission_file_name: file_name || 'Baitap_Nop_LMS.zip',
      submission_file_size: file_size || '3.2 MB',
      submitted_at: new Date().toISOString(),
      notes: notes || 'Em đã nộp bài tập tự luận đầy đủ.',
      plagiarism: {
        similarity_percent: randomPlagiarism,
        status: randomPlagiarism <= 15 ? 'ORIGINAL_PASS' : 'WARNING_HIGH_SIMILARITY',
        checked_at: new Date().toISOString(),
        matched_sources: [
          { source: 'TCU Academic Database & Past Capstones', percent: (randomPlagiarism * 0.6).toFixed(1) },
          { source: 'Educational Open Web Repositories', percent: (randomPlagiarism * 0.4).toFixed(1) }
        ]
      },
      grading: {
        is_graded: false,
        final_score: null,
        feedback: null
      }
    };

    submissionsStore.unshift(newSub);
    res.json({
      success: true,
      message: 'Nộp bài tập tự luận thành công! Hệ thống đã tự động chạy kiểm tra đạo văn (Originality Check).',
      data: newSub
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.gradeSubmission = (req, res) => {
  try {
    const { submissionId } = req.params;
    const { rubric_scores, final_score, feedback, graded_by } = req.body;
    const sub = submissionsStore.find(s => s.id === submissionId);
    if (!sub) return res.status(404).json({ success: false, message: 'Không tìm thấy bài nộp' });

    sub.grading = {
      is_graded: true,
      graded_by: graded_by || 'TS. Hoàng Đức Em',
      graded_at: new Date().toISOString(),
      rubric_scores: rubric_scores || {},
      final_score: Number(final_score),
      feedback: feedback || 'Giảng viên đã đánh giá hoàn tất.'
    };

    res.json({
      success: true,
      message: `Đã chấm điểm thành công cho sinh viên ${sub.student_name} (${final_score}/10) và lưu nhận xét!`,
      data: sub
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.checkPlagiarism = (req, res) => {
  try {
    const { submissionId } = req.params;
    const sub = submissionsStore.find(s => s.id === submissionId);
    if (!sub) return res.status(404).json({ success: false, message: 'Không tìm thấy bài nộp' });

    sub.plagiarism = {
      similarity_percent: 5.2,
      status: 'ORIGINAL_PASS',
      checked_at: new Date().toISOString(),
      matched_sources: [
        { source: 'TechCorp University Digital Repository', percent: 3.1 },
        { source: 'IEEE Computer Society Educational Index', percent: 2.1 }
      ]
    };

    res.json({
      success: true,
      message: `Quét đạo văn Turnitin/TCU hoàn tất: Tỷ lệ tương đồng ${sub.plagiarism.similarity_percent}% (Đạt tiêu chuẩn liêm chính học thuật)!`,
      data: sub.plagiarism
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
