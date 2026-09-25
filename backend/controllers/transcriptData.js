// backend/controllers/transcriptData.js
// Dữ liệu bảng điểm cá nhân & sổ điểm lớp học phần chuẩn hoá Bộ GD&ĐT (TT 08/2021) cho 5 Khoa

const studentDetailedTranscripts = {
  // 1. Khoa CNTT: Trần Văn Nam (261IT001, id 3 hoặc 1)
  '1': {
    student_id: 3,
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
    dean_name: 'PGS. TS. Trần Mạnh Tuấn',
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
          { code: 'PE101', name: 'Giáo Dục Thể Chất 1', credits: 1, attendance_score: 10.0, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.10, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' }
        ]
      }
    ]
  },

  // 2. Khoa Kinh Tế & QTKD: Lê Thị Mỹ Duyên (261BA001, id 7)
  '7': {
    student_id: 7,
    student_code: '261BA001',
    full_name: 'Lê Thị Mỹ Duyên',
    birth_date: '10/05/2004',
    gender: 'Nữ',
    email: 'duyen.ltm@techcorp.edu.vn',
    class_name: '66.QTKD-1',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & Quản Trị Kinh Doanh',
    major_id: 'QTKD',
    major_code: '7340101',
    major_name: 'Quản trị Kinh doanh (Business Administration)',
    cohort: 'K66',
    training_system: 'Đại học Chính quy (Theo hệ thống tín chỉ TT 08/2021)',
    advisor: 'ThS. Vũ Nam',
    dean_name: 'TS. Nguyễn Thị Hồng',
    cumulative: {
      total_credits_registered: 62,
      total_credits_passed: 62,
      cpa_10: 8.92,
      cpa_4: 3.90,
      academic_rank: 'XUẤT SẮC',
      status: 'Bình thường (Đạt chuẩn TT 08/2021/TT-BGDĐT)'
    },
    semesters: [
      {
        semester_number: 1,
        semester_name: 'Học kỳ 1 - Năm học 2024-2025',
        academic_year: '2024-2025',
        total_credits: 15,
        passed_credits: 15,
        gpa_10: 8.95,
        gpa_4: 3.92,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'BA101', name: 'Kinh Tế Vi Mô (Microeconomics)', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'BA102', name: 'Quản Trị Học Đại Cương', credits: 3, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.45, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MATH105', name: 'Toán Cao Cấp Cho Kinh Tế', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.80, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MLN101', name: 'Triết học Mác - Lênin', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.45, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' },
          { code: 'ENG101', name: 'Tiếng Anh Thương Mại 1 (Business English)', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' }
        ]
      },
      {
        semester_number: 2,
        semester_name: 'Học kỳ 2 - Năm học 2024-2025',
        academic_year: '2024-2025',
        total_credits: 16,
        passed_credits: 16,
        gpa_10: 8.88,
        gpa_4: 3.88,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'BA201', name: 'Kinh Tế Vĩ Mô (Macroeconomics)', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.95, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'BA202', name: 'Nguyên Lý Kế Toán Doanh Nghiệp', credits: 3, attendance_score: 9.0, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.00, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MKT201', name: 'Marketing Căn Bản', credits: 3, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.25, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'LAW101', name: 'Pháp Luật Đại Cương & Luật Kinh Tế', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.45, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' },
          { code: 'STAT102', name: 'Thống Kê Ứng Dụng Trong Kinh Doanh', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.60, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'PE101', name: 'Giáo Dục Thể Chất 1', credits: 1, attendance_score: 10.0, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.10, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' }
        ]
      }
    ]
  },

  // 3. Khoa Ngoại Ngữ: Hoàng Thùy Linh (261NN001, id 9)
  '9': {
    student_id: 9,
    student_code: '261NN001',
    full_name: 'Hoàng Thùy Linh',
    birth_date: '28/02/2004',
    gender: 'Nữ',
    email: 'linh.ht@techcorp.edu.vn',
    class_name: '66.NNA-1',
    faculty_id: 'NN',
    faculty_name: 'Khoa Ngoại Ngữ',
    major_id: 'NNA',
    major_code: '7220201',
    major_name: 'Ngôn ngữ Anh (English Studies)',
    cohort: 'K66',
    training_system: 'Đại học Chính quy (Theo hệ thống tín chỉ TT 08/2021)',
    advisor: 'TS. Phạm Thu Hương',
    dean_name: 'TS. Phạm Thu Hương',
    cumulative: {
      total_credits_registered: 60,
      total_credits_passed: 60,
      cpa_10: 8.96,
      cpa_4: 3.93,
      academic_rank: 'XUẤT SẮC',
      status: 'Bình thường (Đạt chuẩn TT 08/2021/TT-BGDĐT)'
    },
    semesters: [
      {
        semester_number: 1,
        semester_name: 'Học kỳ 1 - Năm học 2024-2025',
        academic_year: '2024-2025',
        total_credits: 15,
        passed_credits: 15,
        gpa_10: 9.05,
        gpa_4: 4.00,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'ENG101', name: 'Tiếng Anh Học Thuật 1 (General English B1)', credits: 4, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.5, course_score_10: 9.60, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'ENG103', name: 'Ngữ Pháp & Cú Pháp Tiếng Anh Nâng Cao', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'ENG104', name: 'Ngữ Âm - Âm Vị Học Tiếng Anh (Phonetics)', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.95, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MLN101', name: 'Triết học Mác - Lênin', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.60, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'CUL101', name: 'Dẫn Luận Văn Hóa Các Nước Nói Tiếng Anh', credits: 2, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.25, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' }
        ]
      }
    ]
  },

  // 4. Khoa Điện - Điện Tử: Nguyễn Văn Cường (261DT001, id 11)
  '11': {
    student_id: 11,
    student_code: '261DT001',
    full_name: 'Nguyễn Văn Cường',
    birth_date: '19/09/2004',
    gender: 'Nam',
    email: 'cuong.nv@techcorp.edu.vn',
    class_name: '66.DDT-1',
    faculty_id: 'DDT',
    faculty_name: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    major_id: 'DDT',
    major_code: '7510301',
    major_name: 'Kỹ thuật Điện - Điện tử & IoT',
    cohort: 'K66',
    training_system: 'Đại học Kỹ sư (Theo hệ thống tín chỉ TT 08/2021)',
    advisor: 'TS. Bùi Quốc Thái',
    dean_name: 'TS. Bùi Quốc Thái',
    cumulative: {
      total_credits_registered: 65,
      total_credits_passed: 65,
      cpa_10: 8.78,
      cpa_4: 3.82,
      academic_rank: 'GIỎI',
      status: 'Bình thường (Đạt chuẩn TT 08/2021/TT-BGDĐT)'
    },
    semesters: [
      {
        semester_number: 1,
        semester_name: 'Học kỳ 1 - Năm học 2024-2025',
        academic_year: '2024-2025',
        total_credits: 16,
        passed_credits: 16,
        gpa_10: 8.82,
        gpa_4: 3.85,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'EE101', name: 'Kỹ Thuật Mạch Điện Tử & IoT', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'PHYS101', name: 'Vật Lý Đại Cương 1 & Thí Nghiệm', credits: 4, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.60, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MATH101', name: 'Toán Cao Cấp 1 (Giải tích kỹ thuật)', credits: 3, attendance_score: 9.0, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.90, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MATH102', name: 'Đại Số Tuyến Tính Cho Kỹ Sư', credits: 3, attendance_score: 9.5, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.65, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MLN101', name: 'Triết học Mác - Lênin', credits: 3, attendance_score: 9.0, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.0, course_score_10: 8.10, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)' }
        ]
      }
    ]
  },

  // 5. Khoa Du Lịch & KS: Phan Quỳnh Trang (261DL001, id 13)
  '13': {
    student_id: 13,
    student_code: '261DL001',
    full_name: 'Phan Quỳnh Trang',
    birth_date: '05/04/2004',
    gender: 'Nữ',
    email: 'trang.pq@techcorp.edu.vn',
    class_name: '66.DL-1',
    faculty_id: 'DL',
    faculty_name: 'Khoa Du Lịch & Khách Sạn',
    major_id: 'DL',
    major_code: '7810103',
    major_name: 'Quản trị Dịch vụ Du lịch & Lữ hành',
    cohort: 'K66',
    training_system: 'Đại học Chính quy (Theo hệ thống tín chỉ TT 08/2021)',
    advisor: 'ThS. Đỗ Quang Vinh',
    dean_name: 'ThS. Đỗ Quang Vinh',
    cumulative: {
      total_credits_registered: 61,
      total_credits_passed: 61,
      cpa_10: 9.02,
      cpa_4: 3.96,
      academic_rank: 'XUẤT SẮC',
      status: 'Bình thường (Đạt chuẩn TT 08/2021/TT-BGDĐT)'
    },
    semesters: [
      {
        semester_number: 1,
        semester_name: 'Học kỳ 1 - Năm học 2024-2025',
        academic_year: '2024-2025',
        total_credits: 15,
        passed_credits: 15,
        gpa_10: 9.10,
        gpa_4: 4.00,
        academic_rank: 'XUẤT SẮC',
        courses: [
          { code: 'TOU101', name: 'Tổng Quan Du Lịch & Dịch Vụ Lữ Hành', credits: 3, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.5, course_score_10: 9.60, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'GEO101', name: 'Địa Lý & Tuyến Điểm Du Lịch Việt Nam', credits: 3, attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'ENG101', name: 'Tiếng Anh Chuyên Ngành Du Lịch 1', credits: 3, attendance_score: 9.5, assignment_score: 9.5, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.15, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'MLN101', name: 'Triết học Mác - Lênin', credits: 3, attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.60, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' },
          { code: 'COM101', name: 'Kỹ Năng Giao Tiếp & Thuyết Minh Du Lịch', credits: 3, attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.45, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)' }
        ]
      }
    ]
  }
};

// Aliases cho các tài khoản sinh viên
studentDetailedTranscripts['3'] = studentDetailedTranscripts['1'];
studentDetailedTranscripts['sv_cntt'] = studentDetailedTranscripts['1'];
studentDetailedTranscripts['261IT001'] = studentDetailedTranscripts['1'];

studentDetailedTranscripts['sv_kinhte'] = studentDetailedTranscripts['7'];
studentDetailedTranscripts['261BA001'] = studentDetailedTranscripts['7'];

studentDetailedTranscripts['sv_ngoaingu'] = studentDetailedTranscripts['9'];
studentDetailedTranscripts['261NN001'] = studentDetailedTranscripts['9'];

studentDetailedTranscripts['sv_dientu'] = studentDetailedTranscripts['11'];
studentDetailedTranscripts['261DT001'] = studentDetailedTranscripts['11'];

studentDetailedTranscripts['sv_dulich'] = studentDetailedTranscripts['13'];
studentDetailedTranscripts['261DL001'] = studentDetailedTranscripts['13'];

// Sổ điểm lớp học phần chi tiết theo từng Section (1 đến 8)
const sectionClassTranscripts = {
  1: {
    section_id: 1,
    course_name: 'Nhập môn Lập trình C/C++ (IT101)',
    course_code: 'IT101',
    class_name: '66.CNTT-1',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    lecturer: 'TS. Hoàng Đức Em',
    head_of_department: 'TS. Nguyễn Văn An',
    dean: 'PGS. TS. Trần Mạnh Tuấn',
    students: [
      { student_id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', birth_date: '15/08/2004', class_name: '66.CNTT-1', attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.35, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.91, gpa_accumulated_4: 3.87, academic_rank: 'XUẤT SẮC' },
      { student_id: 2, student_code: '261IT002', full_name: 'Nguyễn Thị Mai', birth_date: '20/11/2004', class_name: '66.CNTT-1', attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.0, course_score_10: 9.30, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.90, gpa_accumulated_4: 3.82, academic_rank: 'XUẤT SẮC' },
      { student_id: 3, student_code: '261IT003', full_name: 'Lê Hoàng Long', birth_date: '02/05/2004', class_name: '66.CNTT-1', attendance_score: 8.5, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.35, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.35, gpa_accumulated_4: 3.20, academic_rank: 'GIỎI' },
      { student_id: 4, student_code: '261IT004', full_name: 'Phạm Quỳnh Như', birth_date: '18/07/2004', class_name: '66.CNTT-1', attendance_score: 9.0, assignment_score: 8.5, midterm_score: 9.0, final_exam_score: 8.5, course_score_10: 8.70, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 3.65, gpa_accumulated_4: 3.55, academic_rank: 'GIỎI' },
      { student_id: 5, student_code: '261IT005', full_name: 'Vũ Hải Đăng', birth_date: '10/10/2004', class_name: '66.CNTT-1', attendance_score: 4.5, assignment_score: 4.0, midterm_score: 5.0, final_exam_score: 4.0, course_score_10: 4.35, course_score_letter: 'D', course_score_4: 1.0, course_result: 'ĐẠT (PASS)', gpa_semester_4: 1.85, gpa_accumulated_4: 1.95, academic_rank: 'CẢNH BÁO HỌC VỤ 1' }
    ]
  },

  2: {
    section_id: 2,
    course_name: 'Cơ sở Dữ liệu (IT201)',
    course_code: 'IT201',
    class_name: '66.CNTT-2',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    lecturer: 'TS. Hoàng Đức Em',
    head_of_department: 'TS. Nguyễn Văn An',
    dean: 'PGS. TS. Trần Mạnh Tuấn',
    students: [
      { student_id: 21, student_code: '261IT041', full_name: 'Đặng Tuấn Kiệt', birth_date: '11/03/2004', class_name: '66.CNTT-2', attendance_score: 9.0, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.90, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' },
      { student_id: 22, student_code: '261IT042', full_name: 'Nguyễn Bích Ngọc', birth_date: '25/08/2004', class_name: '66.CNTT-2', attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.5, course_score_10: 9.60, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'XUẤT SẮC' }
    ]
  },

  3: {
    section_id: 3,
    course_name: 'Cấu trúc Dữ liệu & Giải thuật (IT301)',
    course_code: 'IT301',
    class_name: '65.CNTT-1',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Công Nghệ Thông Tin',
    faculty_id: 'CNTT',
    lecturer: 'TS. Nguyễn Văn An',
    head_of_department: 'TS. Nguyễn Văn An',
    dean: 'PGS. TS. Trần Mạnh Tuấn',
    students: [
      { student_id: 31, student_code: '251IT001', full_name: 'Vũ Đức Mạnh', birth_date: '14/01/2003', class_name: '65.CNTT-1', attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.35, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'XUẤT SẮC' }
    ]
  },

  4: {
    section_id: 4,
    course_name: 'Kinh Tế Vi Mô (BA101)',
    course_code: 'BA101',
    class_name: '66.QTKD-1',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Kinh Tế & Quản Trị Kinh Doanh',
    faculty_id: 'KT',
    lecturer: 'TS. Nguyễn Thị Hồng',
    head_of_department: 'ThS. Vũ Nam',
    dean: 'TS. Nguyễn Thị Hồng',
    students: [
      { student_id: 7, student_code: '261BA001', full_name: 'Lê Thị Mỹ Duyên', birth_date: '10/05/2004', class_name: '66.QTKD-1', attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'XUẤT SẮC' },
      { student_id: 42, student_code: '261BA002', full_name: 'Nguyễn Hoài An', birth_date: '12/12/2004', class_name: '66.QTKD-1', attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.60, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' },
      { student_id: 43, student_code: '261BA003', full_name: 'Phạm Minh Đức', birth_date: '04/09/2004', class_name: '66.QTKD-1', attendance_score: 9.0, assignment_score: 8.0, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.45, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' }
    ]
  },

  5: {
    section_id: 5,
    course_name: 'Quản Trị Học Đại Cương (BA102)',
    course_code: 'BA102',
    class_name: '66.QTKD-1',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Kinh Tế & Quản Trị Kinh Doanh',
    faculty_id: 'KT',
    lecturer: 'ThS. Vũ Nam',
    head_of_department: 'ThS. Vũ Nam',
    dean: 'TS. Nguyễn Thị Hồng',
    students: [
      { student_id: 7, student_code: '261BA001', full_name: 'Lê Thị Mỹ Duyên', birth_date: '10/05/2004', class_name: '66.QTKD-1', attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.0, final_exam_score: 9.5, course_score_10: 9.45, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'XUẤT SẮC' },
      { student_id: 42, student_code: '261BA002', full_name: 'Nguyễn Hoài An', birth_date: '12/12/2004', class_name: '66.QTKD-1', attendance_score: 9.0, assignment_score: 8.5, midterm_score: 9.0, final_exam_score: 8.5, course_score_10: 8.70, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' }
    ]
  },

  6: {
    section_id: 6,
    course_name: 'Tiếng Anh Học Thuật 1 (ENG101)',
    course_code: 'ENG101',
    class_name: '66.NNA-1',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Ngoại Ngữ',
    faculty_id: 'NN',
    lecturer: 'TS. Phạm Thu Hương',
    head_of_department: 'TS. Phạm Thu Hương',
    dean: 'TS. Phạm Thu Hương',
    students: [
      { student_id: 9, student_code: '261NN001', full_name: 'Hoàng Thùy Linh', birth_date: '28/02/2004', class_name: '66.NNA-1', attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.5, course_score_10: 9.60, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'XUẤT SẮC' },
      { student_id: 62, student_code: '261NN002', full_name: 'Đỗ Tuấn Anh', birth_date: '17/06/2004', class_name: '66.NNA-1', attendance_score: 9.5, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 9.0, course_score_10: 8.95, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' },
      { student_id: 63, student_code: '261NN003', full_name: 'Trần Mai Phương', birth_date: '03/11/2004', class_name: '66.NNA-1', attendance_score: 9.0, assignment_score: 9.0, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.65, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' }
    ]
  },

  7: {
    section_id: 7,
    course_name: 'Kỹ Thuật Mạch Điện Tử & IoT (EE101)',
    course_code: 'EE101',
    class_name: '66.DDT-1',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    faculty_id: 'DDT',
    lecturer: 'TS. Bùi Quốc Thái',
    head_of_department: 'TS. Bùi Quốc Thái',
    dean: 'TS. Bùi Quốc Thái',
    students: [
      { student_id: 11, student_code: '261DT001', full_name: 'Nguyễn Văn Cường', birth_date: '19/09/2004', class_name: '66.DDT-1', attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'XUẤT SẮC' },
      { student_id: 72, student_code: '261DT002', full_name: 'Bùi Anh Tuấn', birth_date: '08/04/2004', class_name: '66.DDT-1', attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.60, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' },
      { student_id: 73, student_code: '261DT003', full_name: 'Đặng Hải Long', birth_date: '15/12/2004', class_name: '66.DDT-1', attendance_score: 9.0, assignment_score: 8.0, midterm_score: 8.0, final_exam_score: 8.5, course_score_10: 8.35, course_score_letter: 'B+', course_score_4: 3.5, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' }
    ]
  },

  8: {
    section_id: 8,
    course_name: 'Tổng Quan Du Lịch & Dịch Vụ Lữ Hành (TOU101)',
    course_code: 'TOU101',
    class_name: '66.DL-1',
    semester: 'Học kỳ 1 - Năm học 2026-2027',
    faculty: 'Khoa Du Lịch & Khách Sạn',
    faculty_id: 'DL',
    lecturer: 'ThS. Đỗ Quang Vinh',
    head_of_department: 'ThS. Đỗ Quang Vinh',
    dean: 'ThS. Đỗ Quang Vinh',
    students: [
      { student_id: 13, student_code: '261DL001', full_name: 'Phan Quỳnh Trang', birth_date: '05/04/2004', class_name: '66.DL-1', attendance_score: 10.0, assignment_score: 9.5, midterm_score: 9.5, final_exam_score: 9.5, course_score_10: 9.60, course_score_letter: 'A+', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'XUẤT SẮC' },
      { student_id: 82, student_code: '261DL002', full_name: 'Lê Hoàng Yến', birth_date: '21/08/2004', class_name: '66.DL-1', attendance_score: 9.5, assignment_score: 9.0, midterm_score: 9.0, final_exam_score: 9.0, course_score_10: 9.05, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' },
      { student_id: 83, student_code: '261DL003', full_name: 'Trịnh Ngọc Ánh', birth_date: '14/10/2004', class_name: '66.DL-1', attendance_score: 9.0, assignment_score: 8.5, midterm_score: 8.5, final_exam_score: 8.5, course_score_10: 8.60, course_score_letter: 'A', course_score_4: 4.0, course_result: 'ĐẠT (PASS)', academic_rank: 'GIỎI' }
    ]
  }
};

module.exports = {
  studentDetailedTranscripts,
  sectionClassTranscripts
};
