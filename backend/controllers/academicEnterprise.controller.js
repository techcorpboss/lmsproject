// backend/controllers/academicEnterprise.controller.js
// Enterprise Academic Modules: Hierarchy & Assignments, AI Authoring, Exam Appraisal, MOET Transcripts
const { User, Course, CourseSection } = require('../models');

// 1. Phân cấp Khoa - Ngành - Khóa - Lớp & Phân công giảng dạy
let hierarchyStore = {
  faculties: [
    {
      id: 'CNTT',
      name: 'Khoa Công Nghệ Thông Tin',
      dean: 'PGS. TS. Trần Mạnh Tuấn',
      majors: [
        {
          id: 'CNPM',
          name: 'Kỹ thuật Phần mềm (Software Engineering)',
          code: '7480103',
          cohorts: ['K66 (2026-2030)', 'K65 (2025-2029)', 'K64 (2024-2028)'],
          classes: [
            { id: 1, name: '66.CNTT-1', cohort: 'K66', advisor: 'TS. Hoàng Đức Em', total_students: 42 },
            { id: 2, name: '65.CNTT-1', cohort: 'K65', advisor: 'ThS. Chu Quỳnh Anh', total_students: 38 }
          ]
        },
        {
          id: 'KHMT',
          name: 'Khoa học Máy tính (Computer Science)',
          code: '7480101',
          cohorts: ['K66 (2026-2030)', 'K65 (2025-2029)'],
          classes: [
            { id: 3, name: '66.KHMT-1', cohort: 'K66', advisor: 'TS. Lê Hải Đăng', total_students: 40 }
          ]
        },
        {
          id: 'HTTT',
          name: 'Hệ thống Thông tin (Information Systems)',
          code: '7480104',
          cohorts: ['K66 (2026-2030)', 'K65 (2025-2029)'],
          classes: [
            { id: 4, name: '66.HTTT-1', cohort: 'K66', advisor: 'TS. Hoàng Đức Em', total_students: 45 }
          ]
        }
      ]
    },
    {
      id: 'KT',
      name: 'Khoa Kinh Tế & Quản Trị Kinh Doanh',
      dean: 'TS. Nguyễn Thị Hồng',
      majors: [
        {
          id: 'QTKD',
          name: 'Quản trị Kinh doanh',
          code: '7340101',
          cohorts: ['K66 (2026-2030)', 'K65 (2025-2029)'],
          classes: [
            { id: 5, name: '66.QTKD-1', cohort: 'K66', advisor: 'ThS. Vũ Nam', total_students: 50 }
          ]
        }
      ]
    }
  ],
  assignments: [
    {
      id: 1,
      lecturer_id: 2,
      lecturer_username: 'teacher',
      lecturer_name: 'TS. Hoàng Đức Em',
      course_id: 1,
      course_code: 'IT101',
      course_name: 'Nhập môn Lập trình C/C++',
      class_name: '66.CNTT-1',
      semester: 'Học kỳ 1 (2026-2027)',
      assigned_by: 'Trưởng bộ môn Kỹ thuật Phần mềm',
      can_author_lms: true,
      can_grade: true,
      can_appraise_exams: false
    },
    {
      id: 2,
      lecturer_id: 2,
      lecturer_username: 'teacher',
      lecturer_name: 'TS. Hoàng Đức Em',
      course_id: 2,
      course_code: 'IT201',
      course_name: 'Cơ sở Dữ liệu (Database Systems)',
      class_name: '66.HTTT-1',
      semester: 'Học kỳ 1 (2026-2027)',
      assigned_by: 'Trưởng bộ môn Hệ thống Thông tin',
      can_author_lms: true,
      can_grade: true,
      can_appraise_exams: false
    },
    {
      id: 3,
      lecturer_id: 5,
      lecturer_username: 'an.nv',
      lecturer_name: 'TS. Nguyễn Văn An',
      course_id: 3,
      course_code: 'IT301',
      course_name: 'Cấu trúc Dữ liệu & Giải thuật',
      class_name: '65.CNTT-1',
      semester: 'Học kỳ 1 (2026-2027)',
      assigned_by: 'Hội đồng Khoa CNTT',
      can_author_lms: true,
      can_grade: true,
      can_appraise_exams: true
    }
  ]
};

// 2. Thẩm định Đề thi & Biên bản Số Hóa (Exam Appraisal & Digital Minutes)
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
    status: 'APPROVED', // PENDING, APPROVED, REVISION_REQUESTED
    criteria: {
      matrix_coverage_score: 9.5, // Độ phủ ma trận chuẩn đầu ra CLO
      bloom_distribution_score: 9.0, // Phân bố cấp độ nhận thức Bloom
      clarity_score: 9.5, // Tính chuẩn xác, không đánh đố
      security_classification: 'TUYET_MAT_CAP_TRUONG', // Mức độ bảo mật
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
  },
  {
    id: 2,
    appraisal_code: 'BB-TD-2026-IT201-02',
    course_code: 'IT201',
    course_name: 'Cơ sở Dữ liệu',
    exam_paper_code: 'DE-THI-IT201-MIDTERM',
    author_lecturer: 'TS. Hoàng Đức Em',
    reviewer_dept: 'ThS. Chu Quỳnh Anh',
    council_president: 'PGS. TS. Trần Mạnh Tuấn',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'IN_REVIEW',
    criteria: {
      matrix_coverage_score: 8.5,
      bloom_distribution_score: 8.5,
      clarity_score: 9.0,
      security_classification: 'MAT',
      exam_duration_fit: 'PHU_HOP_45_PHUT',
      notes: 'Đang chờ ký số từ Chủ tịch Hội đồng thẩm định.'
    },
    digital_signatures: {
      author_signed: true,
      author_signed_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      reviewer_signed: true,
      reviewer_signed_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      president_signed: false,
      president_signed_at: null,
      digital_cert_id: 'PENDING_PRESIDENT_SIGN'
    }
  }
];

// 3. Bảng điểm chuẩn Bộ GD&ĐT (Thông tư 08/2021/TT-BGDĐT)
let transcriptData = {
  grading_scale: {
    system_10: 'Thang điểm 10',
    system_letter: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
    system_4: 'Thang điểm 4.0'
  },
  students: [
    {
      student_id: 1,
      student_code: '261IT001',
      full_name: 'Trần Văn Nam',
      birth_date: '15/08/2004',
      class_name: '66.CNTT-1',
      major: 'Kỹ thuật Phần mềm',
      cohort: 'K66 (2026-2030)',
      course_code: 'IT101',
      course_name: 'Nhập môn Lập trình C/C++',
      credits: 4,
      attendance_score: 9.5, // 10%
      assignment_score: 9.0, // 20%
      midterm_score: 9.0,    // 20%
      final_exam_score: 9.5, // 50%
      course_score_10: 9.35,
      course_score_letter: 'A+',
      course_score_4: 4.0,
      course_result: 'ĐẠT (PASS)',
      gpa_semester_4: 3.85,
      gpa_accumulated_4: 3.78,
      credits_passed: 38,
      academic_rank: 'XUẤT SẮC (EXCELLENT)'
    },
    {
      student_id: 2,
      student_code: '261IT002',
      full_name: 'Nguyễn Thị Mai',
      birth_date: '20/11/2004',
      class_name: '66.CNTT-1',
      major: 'Kỹ thuật Phần mềm',
      cohort: 'K66 (2026-2030)',
      course_code: 'IT101',
      course_name: 'Nhập môn Lập trình C/C++',
      credits: 4,
      attendance_score: 10.0,
      assignment_score: 9.5,
      midterm_score: 9.5,
      final_exam_score: 9.0,
      course_score_10: 9.30,
      course_score_letter: 'A+',
      course_score_4: 4.0,
      course_result: 'ĐẠT (PASS)',
      gpa_semester_4: 3.90,
      gpa_accumulated_4: 3.82,
      credits_passed: 42,
      academic_rank: 'XUẤT SẮC (EXCELLENT)'
    },
    {
      student_id: 3,
      student_code: '261IT003',
      full_name: 'Lê Hoàng Long',
      birth_date: '02/05/2004',
      class_name: '66.CNTT-1',
      major: 'Kỹ thuật Phần mềm',
      cohort: 'K66 (2026-2030)',
      course_code: 'IT101',
      course_name: 'Nhập môn Lập trình C/C++',
      credits: 4,
      attendance_score: 8.5,
      assignment_score: 8.0,
      midterm_score: 8.0,
      final_exam_score: 8.5,
      course_score_10: 8.35,
      course_score_letter: 'B+',
      course_score_4: 3.5,
      course_result: 'ĐẠT (PASS)',
      gpa_semester_4: 3.35,
      gpa_accumulated_4: 3.20,
      credits_passed: 35,
      academic_rank: 'GIỎI (VERY GOOD)'
    },
    {
      student_id: 5,
      student_code: '261IT005',
      full_name: 'Vũ Hải Đăng',
      birth_date: '10/10/2004',
      class_name: '66.CNTT-1',
      major: 'Kỹ thuật Phần mềm',
      cohort: 'K66 (2026-2030)',
      course_code: 'IT101',
      course_name: 'Nhập môn Lập trình C/C++',
      credits: 4,
      attendance_score: 4.5,
      assignment_score: 4.0,
      midterm_score: 5.0,
      final_exam_score: 4.0,
      course_score_10: 4.35,
      course_score_letter: 'D',
      course_score_4: 1.0,
      course_result: 'ĐẠT (PASS)',
      gpa_semester_4: 1.85,
      gpa_accumulated_4: 1.95,
      credits_passed: 22,
      academic_rank: 'CẢNH BÁO HỌC VỤ 1 (WARNING)'
    }
  ]
};

// ==================== CÁC PHƯƠNG THỨC API CONTROLLER ====================

// --- 1. PHÂN CẤP KHOA - NGÀNH & PHÂN CÔNG GIẢNG VIÊN ---
exports.getHierarchyAndAssignments = async (req, res) => {
  try {
    const userRole = (req.user && req.user.role) || 'admin';
    const username = (req.user && req.user.username) || '';

    // Nếu là giảng viên (teacher), trả về cả toàn bộ phân cấp và lọc phân công giảng dạy của riêng giảng viên
    let userAssignments = hierarchyStore.assignments;
    if (userRole === 'teacher') {
      userAssignments = hierarchyStore.assignments.filter(
        a => a.lecturer_username === username || a.lecturer_username === 'teacher'
      );
    }

    res.json({
      success: true,
      data: {
        faculties: hierarchyStore.faculties,
        assignments: hierarchyStore.assignments,
        my_assignments: userAssignments,
        current_year: '2026-2027',
        current_semester: 'Học kỳ 1'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveAssignment = async (req, res) => {
  try {
    const data = req.body;
    const newAss = {
      id: Date.now(),
      ...data,
      can_author_lms: true,
      can_grade: true,
      created_at: new Date()
    };
    hierarchyStore.assignments.push(newAss);
    res.json({ success: true, message: 'Phân công giảng dạy môn học thành công!', data: newAss });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- 2. TRỢ LÝ AI SOẠN BÀI GIẢNG & ĐỀ THI (AI TEACHING STUDIO) ---
exports.generateAiContent = async (req, res) => {
  try {
    const { type, course_name, course_code, topic, week_number, bloom_level, count } = req.body;

    if (type === 'SYLLABUS_WORD') {
      // Soạn đề cương / giáo trình dạng Word / Markdown
      const wordContent = `
# ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN (CHUẨN BỘ GD&ĐT TT 08/2021)
## Học phần: ${course_name} (Mã: ${course_code || 'IT101'})
**Số tín chỉ:** 4 Tín chỉ (Lý thuyết: 30 tiết | Thực hành: 60 tiết)
**Khoa phụ trách:** Khoa Công Nghệ Thông Tin - Bộ Môn Kỹ Thuật Phần Mềm

### 1. MỤC TIÊU HỌC PHẦN (Course Objectives)
- **CO1:** Nắm vững cấu trúc cú pháp, nguyên lý cấp phát bộ nhớ và kỹ thuật quản lý con trỏ an toàn trong C++.
- **CO2:** Vận dụng các thuật toán tìm kiếm, sắp xếp và tối ưu độ phức tạp không gian O(n) và thời gian O(n log n).
- **CO3:** Thiết kế module hóa chương trình theo chuẩn lập trình hiện đại, sẵn sàng liên thông đồ án tốt nghiệp.

### 2. CHUẨN ĐẦU RA HỌC PHẦN (CLO Matrix)
- **CLO1.1 (Nhận thức Bloom C1-C2):** Trình bày kiểu dữ liệu cơ sở, cấu trúc rẽ nhánh, vòng lặp.
- **CLO2.1 (Vận dụng Bloom C3-C4):** Xây dựng thuật toán xử lý chuỗi và ma trận số học 2 chiều.
- **CLO3.1 (Sáng tạo Bloom C5-C6):** Phát triển ứng dụng hoàn chỉnh quản lý dữ liệu lưu trữ tệp tin.

### 3. KẾ HOẠCH BÀI GIẢNG 15 TUẦN THEO QUY CHẾ
*(Đã đồng bộ tự động vào cấu trúc Module 15 Tuần trên LMS Classroom Studio)*
`;
      return res.json({ success: true, type, content: wordContent, generated_at: new Date() });
    }

    if (type === 'SLIDE_OUTLINE') {
      // Soạn Slide trình chiếu
      const slides = [
        { slide: 1, title: `BÀI GIẢNG TUẦN ${week_number || 1}: ${topic || course_name}`, notes: 'Slide bìa, giới thiệu giảng viên và mục tiêu bài học.' },
        { slide: 2, title: 'Mục Tiêu & Chuẩn Đầu Ra Cần Đạt', notes: 'Nhắc lại chuẩn Bloom C3-C4 và điều kiện thực hành lab.' },
        { slide: 3, title: 'Nền Tảng Lý Thuyết Cốt Lõi', notes: 'Giải thích nguyên lý kiến trúc bộ nhớ Heap/Stack và sơ đồ khối.' },
        { slide: 4, title: 'Ví Dụ Minh Họa Code Mẫu & Trực Quan Hóa', notes: 'Chiếu code snippet, phân tích ca kiểm thử biên (Edge cases).' },
        { slide: 5, title: 'Bài Tập Vận Dụng & Thảo Luận Nhóm', notes: 'Giao đề bài cho sinh viên giải quyết trên LMS trong 20 phút.' },
        { slide: 6, title: 'Tổng Kết & Câu Hỏi Củng Cố Kiến Thức (Quiz)', notes: 'Hướng dẫn làm bài kiểm tra trắc nghiệm cuối tuần trên LMS.' }
      ];
      return res.json({ success: true, type, slides, generated_at: new Date() });
    }

    if (type === 'VIDEO_SCRIPT') {
      // Soạn kịch bản Video bài giảng
      const script = {
        title: `Kịch bản Video Bài giảng: ${topic || course_name} (Tuần ${week_number || 1})`,
        duration: '15 phút',
        scenes: [
          { time: '00:00 - 02:00', visual: 'Giảng viên xuất hiện tại Studio + Slide mở đầu', audio: 'Chào các em sinh viên, trong bài học tuần này chúng ta sẽ nghiên cứu chuyên sâu về cấu trúc điều khiển và tối ưu mã nguồn...' },
          { time: '02:00 - 07:00', visual: 'Quay màn hình IDE (VSCode) gõ code trực tiếp', audio: 'Hãy quan sát cách cấp phát con trỏ động tại dòng 15, lưu ý luôn thu hồi bằng delete[] để tránh memory leak...' },
          { time: '07:00 - 07:30', visual: 'Pop-up câu hỏi tương tác trên video (Interactive Video Checkpoint)', audio: 'Hệ thống tự động dừng video: Em hãy chọn đáp án đúng về kích thước kiểu con trỏ trong hệ điều hành 64-bit.' },
          { time: '07:30 - 14:00', visual: 'Biểu đồ luồng dữ liệu + Sơ đồ thuật toán', audio: 'Tiếp theo là phân tích thuật toán đệ quy và quản lý stack frame...' },
          { time: '14:00 - 15:00', visual: 'Giảng viên dặn dò + Slide bài tập về nhà', audio: 'Các em hãy hoàn thành bài tập thực hành trên LMS trước 23:59 Chủ nhật tuần này nhé!' }
        ]
      };
      return res.json({ success: true, type, script, generated_at: new Date() });
    }

    if (type === 'QUIZ_GENERATOR') {
      // Soạn câu hỏi Quiz / Ngân hàng đề thi theo thang Bloom
      const qCount = count || 4;
      const questions = [];
      const bloomLevels = ['Nhận biết (Remember)', 'Thông hiểu (Understand)', 'Vận dụng (Apply)', 'Vận dụng cao (Analyze)'];

      for (let i = 1; i <= qCount; i++) {
        const lvl = bloomLevels[(i - 1) % bloomLevels.length];
        questions.push({
          id: Date.now() + i,
          bloom_level: lvl,
          question_text: `[${lvl}] Câu hỏi số ${i} về kiến thức ${topic || course_name}: Khẳng định nào sau đây là chính xác nhất khi áp dụng vào thực tế?`,
          options: [
            { key: 'A', text: 'Phương án A: Định nghĩa chính xác theo chuẩn kỹ thuật quốc tế và tối ưu hiệu năng', is_correct: true },
            { key: 'B', text: 'Phương án B: Chỉ áp dụng trong trường hợp dữ liệu đơn giản', is_correct: false },
            { key: 'C', text: 'Phương án C: Dễ gây xung đột bộ nhớ và không khuyến nghị sử dụng', is_correct: false },
            { key: 'D', text: 'Phương án D: Sai cú pháp quy chuẩn', is_correct: false }
          ],
          correct_key: 'A',
          explanation: `Giải thích chi tiết: Lựa chọn A đáp ứng trọn vẹn yêu cầu chuẩn đầu ra cấp độ ${lvl} theo tài liệu giảng dạy chính thức.`
        });
      }
      return res.json({ success: true, type, questions, generated_at: new Date() });
    }

    res.status(400).json({ success: false, message: 'Loại nội dung AI yêu cầu không hợp lệ.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- 3. THẨM ĐỊNH ĐỀ THI & BIÊN BẢN SỐ HÓA ---
exports.getAppraisals = async (req, res) => {
  try {
    res.json({ success: true, data: appraisalStore });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAppraisal = async (req, res) => {
  try {
    const data = req.body;
    const newRecord = {
      id: Date.now(),
      appraisal_code: `BB-TD-${new Date().getFullYear()}-${data.course_code || 'HP'}-${Math.floor(Math.random() * 900 + 100)}`,
      course_code: data.course_code,
      course_name: data.course_name,
      exam_paper_code: data.exam_paper_code || 'DE-THI-CHUA-MA-HOA',
      author_lecturer: data.author_lecturer || 'Giảng viên biên soạn',
      reviewer_dept: data.reviewer_dept || 'Trưởng bộ môn',
      council_president: data.council_president || 'Chủ tịch hội đồng',
      created_at: new Date().toISOString(),
      status: 'IN_REVIEW',
      criteria: {
        matrix_coverage_score: 9.0,
        bloom_distribution_score: 9.0,
        clarity_score: 9.0,
        security_classification: 'TUYET_MAT',
        exam_duration_fit: 'PHU_HOP',
        notes: data.notes || 'Khởi tạo hồ sơ thẩm định đề thi'
      },
      digital_signatures: {
        author_signed: true,
        author_signed_at: new Date().toISOString(),
        reviewer_signed: false,
        president_signed: false,
        digital_cert_id: `CERT-TCU-${Date.now()}`
      }
    };
    appraisalStore.unshift(newRecord);
    res.json({ success: true, message: 'Khởi tạo đợt thẩm định đề thi thành công!', data: newRecord });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.signAppraisalMinutes = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, notes } = req.body; // 'reviewer' or 'president'
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

// --- 4. BẢNG ĐIỂM & MẪU IN ẤN CHUẨN BỘ GD&ĐT (TT 08/2021) ---
exports.getStudentTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;
    const std = transcriptData.students.find(s => s.student_id === Number(studentId)) || transcriptData.students[0];
    res.json({
      success: true,
      data: {
        student: std,
        grading_rules: 'Quy chế Đào tạo Trình độ Đại học theo Thông tư 08/2021/TT-BGDĐT',
        school_name: 'TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TECHCORP',
        printed_at: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getClassTranscript = async (req, res) => {
  try {
    const { sectionId } = req.params;
    res.json({
      success: true,
      data: {
        section_id: Number(sectionId) || 1,
        course_name: 'Nhập môn Lập trình C/C++ (IT101)',
        class_name: '66.CNTT-1',
        semester: 'Học kỳ 1 - Năm học 2026-2027',
        faculty: 'Khoa Công Nghệ Thông Tin',
        lecturer: 'TS. Hoàng Đức Em',
        students: transcriptData.students,
        summary: {
          total: transcriptData.students.length,
          passed: transcriptData.students.filter(s => s.course_score_10 >= 4.0).length,
          excellent_count: transcriptData.students.filter(s => s.course_score_10 >= 9.0).length,
          good_count: transcriptData.students.filter(s => s.course_score_10 >= 8.0 && s.course_score_10 < 9.0).length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
