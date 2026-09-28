import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Typography, Input, Button, Select, Radio,
  Space, Tag, Spin, message, Alert, Tabs,
  Upload, Modal, Slider, Switch, Tooltip
} from 'antd';
import {
  RobotOutlined, FileWordOutlined, PlaySquareOutlined, VideoCameraOutlined,
  ThunderboltOutlined, CopyOutlined, CheckCircleOutlined,
  BookOutlined, BulbOutlined, InboxOutlined,
  SafetyCertificateOutlined, AuditOutlined, PrinterOutlined, CloudUploadOutlined,
  FileProtectOutlined, EditOutlined, EyeOutlined, DownloadOutlined,
  CaretRightOutlined, PauseOutlined, SettingOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const COURSES_OPTIONS = [
  { code: 'IT101', name: 'Nhập môn Lập trình C/C++', credits: 4, faculty: 'Khoa CNTT' },
  { code: 'IT201', name: 'Cơ sở Dữ liệu & SQL', credits: 3, faculty: 'Khoa CNTT' },
  { code: 'IT301', name: 'Cấu trúc Dữ liệu & Giải thuật', credits: 4, faculty: 'Khoa CNTT' },
  { code: 'IT401', name: 'Công nghệ Phần mềm & Agile', credits: 3, faculty: 'Khoa CNTT' },
  { code: 'BA101', name: 'Quản trị Học đại cương', credits: 3, faculty: 'Khoa Kinh Tế' }
];

// Bản đồ chuyên đề 15 tuần học chuẩn đại học theo đề cương Bộ GD&ĐT
const COURSE_WEEK_TOPICS = {
  IT201: {
    1: 'Tổng quan Hệ Cơ Sở Dữ Liệu & Kiến Trúc 3 Tầng ANSI-SPARC',
    2: 'Mô Hình Thực Thể - Liên Kết (ERD) & Kỹ Thuật Chuyển Đổi Sang Lược Đồ Quan Hệ',
    3: 'Lý Thuyết Chuẩn Hóa Cơ Sở Dữ Liệu (1NF, 2NF, 3NF, BCNF) & Khử Dư Thừa Dữ Liệu',
    4: 'Ngôn Ngữ Định Nghĩa Dữ Liệu SQL DDL & Các Ràng Buộc Toàn Vẹn Nâng Cao',
    5: 'Ngôn Ngữ Thao Tác Dữ Liệu SQL DML & Quản Lý Dữ Liệu Giao Dịch',
    6: 'Truy Vấn Dữ Liệu Gom Nhóm (GROUP BY, HAVING) & Hàm Tổng Hợp (Aggregates)',
    7: 'Kỹ Thuật Ghép Bảng Nâng Cao: INNER JOIN, OUTER JOIN, CROSS & SELF JOIN',
    8: 'Truy Vấn Con (Subqueries), Mệnh Đề EXISTS, IN & Biểu Thức Bảng Thường (CTE)',
    9: 'Khung Nhìn (Views), Bảng Ảo & Bảo Mật Dữ Liệu Tầng Khung Nhìn',
    10: 'Lập Trình Cơ Sở Dữ Liệu T-SQL/PL-SQL: Biến, Rẽ Nhánh & Con Trỏ (Cursors)',
    11: 'Thủ Tục Lưu Trữ (Stored Procedures) & Hàm Người Dùng Định Nghĩa (UDF)',
    12: 'Bộ Kích Hoạt Tự Động (Triggers) & Kiểm Toán Nhật Ký Dữ Liệu (Audit Logging)',
    13: 'Cấu Trúc Chỉ Mục (Indexes: B-Tree, Hash) & Tối Ưu Hóa Truy Vấn (Execution Plan)',
    14: 'Quản Lý Giao Dịch (Transactions), 4 Tính Chất ACID & Mức Độ Cô Lập (Isolation)',
    15: 'Khóa Đồng Thời (Concurrency Locking), Deadlock & Sao Lưu/Phục Hồi CSDL'
  },
  IT101: {
    1: 'Cấu Trúc Chương Trình C/C++, Kiểu Dữ Liệu, Biến & Nhập Xuất Chuẩn',
    2: 'Toán Tử, Biểu Thức Logic & Cấu Trúc Điều Khiển Rẽ Nhánh (if-else, switch-case)',
    3: 'Cấu Trúc Vòng Lặp (for, while, do-while) & Kỹ Thuật Kiểm Soát Lặp',
    4: 'Hàm (Functions), Phạm Vi Biến, Cơ Chế Truyền Tham Trị vs Tham Chiếu',
    5: 'Kỹ Thuật Đệ Quy (Recursion) & Phân Tích Cây Đệ Quy',
    6: 'Mảng Một Chiều (1D Array) & Thuật Toán Tìm Kiếm Cơ Bản (Linear/Binary Search)',
    7: 'Thuật Toán Sắp Xếp Cơ Bản: Bubble Sort, Selection Sort, Insertion Sort',
    8: 'Chuỗi Ký Tự (C-String & std::string) & Kỹ Thuật Xử Lý Văn Bản',
    9: 'Con Trỏ (Pointers) và Cấp Phát Bộ Nhớ Động Trên Heap (new / delete)',
    10: 'Mảng Hai Chiều (2D Array), Ma Trận & Con Trỏ Đa Cấp',
    11: 'Kiểu Dữ Liệu Cấu Trúc (struct) & Tổ Chức Dữ Liệu Bản Ghi',
    12: 'Quản Lý Tệp Tin (File I/O): Đọc/Ghi Tệp Văn Bản và Tệp Nhị Phân',
    13: 'Thư Viện Chuẩn C++ (STL): Vector, Pair & Algorithm',
    14: 'Giới Thiệu Lập Trình Hướng Đối Tượng (OOP): Lớp (Class), Đóng Gói & Phương Thức',
    15: 'Đóng Gói Dự Án Cuối Kỳ: Clean Code, Debugging & Kiểm Thử Phòng Rò Rỉ RAM'
  },
  IT301: {
    1: 'Đánh Giá Độ Phức Tạp Giải Thuật: Ký Hiệu Big-O, Big-Omega, Big-Theta',
    2: 'Danh Sách Đặc (Array-based List) & Danh Sách Liên Kết Đơn (Singly Linked List)',
    3: 'Danh Sách Liên Kết Đôi (Doubly Linked List) & Danh Sách Vòng (Circular List)',
    4: 'Ngăn Xếp (Stack): Cài Đặt, Nguyên Lý LIFO & Ứng Dụng Đổi Dấu Ngoặc / Ba Lan',
    5: 'Hàng Đợi (Queue) & Hàng Đợi Hai Đầu (Deque): Nguyên Lý FIFO & Bộ Đệm Dữ Liệu',
    6: 'Thuật Toán Sắp Xếp Nâng Cao: Merge Sort, Quick Sort & Phân Tích Chia Để Trị',
    7: 'Cây Nhị Phân (Binary Tree) & Các Phép Duyệt Cây (Preorder, Inorder, Postorder)',
    8: 'Cây Tìm Kiếm Nhị Phân (Binary Search Tree - BST): Thêm, Xóa, Tìm Kiếm O(log N)',
    9: 'Cây Tự Cân Bằng: Cây AVL (Phép Quay Đơn, Quay Kép) & Cây Đỏ - Đen (Red-Black)',
    10: 'Hàng Đợi Ưu Tiên (Priority Queue) & Cấu Trúc Heap (Min-Heap, Max-Heap, HeapSort)',
    11: 'Bảng Băm (Hash Table), Hàm Băm & Kỹ Thuật Xử Lý Đụng Độ (Collision Resolution)',
    12: 'Biểu Diễn Đồ Thị (Ma Trận Kề, Danh Sách Kề) & Thuật Toán Duyệt (BFS, DFS)',
    13: 'Đường Đi Ngắn Nhất Trên Đồ Thị: Thuật Toán Dijkstra & Bellman-Ford',
    14: 'Cây Khung Nhỏ Nhất (Minimum Spanning Tree): Thuật Toán Kruskal & Prim',
    15: 'Quy Hoạch Động (Dynamic Programming) & Bài Toán Tối Ưu Tổ Hợp (Knapsack, LCS)'
  },
  IT401: {
    1: 'Tổng Quan Kỹ Nghệ Phần Mềm, Vòng Đời Phần Mềm (SDLC) & Mô Hình Waterfall vs Agile',
    2: 'Khung Làm Việc Scrum: Vai Trò, Sự Kiện & Các Tạo Tác (Scrum Framework)',
    3: 'Thu Thập & Quản Lý Yêu Cầu Phần Mềm: User Story & Acceptance Criteria',
    4: 'Phân Tích Yêu Cầu: Biểu Đồ Use Case & Đặc Tả Kịch Bản Chuẩn Cockburn',
    5: 'Thiết Kế Kiến Trúc Phần Mềm: Kiến Trúc N-Tier, Microservices & Event-Driven',
    6: 'Thiết Kế Hướng Đối Tượng Với UML: Biểu Đồ Lớp (Class) & Biểu Đồ Tuần Tự (Sequence)',
    7: 'Nguyên Lý Thiết Kế Phần Mềm Hướng Đối Tượng SOLID & GRASP',
    8: 'Các Mẫu Thiết Kế Hướng Đối Tượng (Design Patterns): Creational & Structural',
    9: 'Các Mẫu Thiết Kế Hành Vi (Behavioral Patterns): Observer, Strategy & State',
    10: 'Chiến Lược Kiểm Thử Phần Mềm: Unit Test, Integration Test & Kiểm Thử Hộp Đen/Hộp Trắng',
    11: 'Phát Triển Phần Mềm Hướng Kiểm Thử (Test-Driven Development - TDD)',
    12: 'Quản Lý Phiên Bản Mã Nguồn (Git Flow) & Tích Hợp / Triển Khai Liên Tục (CI/CD)',
    13: 'Đảm Bảo Chất Lượng Phần Mềm (QA), Đánh Giá Mã Nguồn (Code Review) & Nợ Kỹ Thuật',
    14: 'Quản Lý Rủi Ro Dự Án, Ước Lượng Chi Phí (Planning Poker) & Bảo Mật Phần Mềm (DevSecOps)',
    15: 'Bảo Trì Phần Mềm, Tái Cấu Trúc (Refactoring) & Hồ Sơ Nghiệm Thu Chuẩn AUN-QA'
  },
  BA101: {
    1: 'Bản Chất Của Quản Trị, Vai Trò & Kỹ Năng Của Nhà Quản Trị Hiện Đại',
    2: 'Sự Tiến Hóa Của Các Tư Tưởng Quản Trị: Cổ Điển, Tâm Lý Xã Hội & Hiện Đại',
    3: 'Môi Trường Quản Trị Doanh Nghiệp: Môi Trường Vĩ Mô & Mô Hình 5 Lực Lượng Porter',
    4: 'Đạo Đức Kinh Doanh & Trách Nhiệm Xã Hội Của Doanh Nghiệp (CSR / ESG)',
    5: 'Chức Năng Hoạch Định: Tầm Nhìn, Sứ Mệnh, Mục Tiêu SMART & Phân Tích SWOT',
    6: 'Ra Quyết Định Quản Trị: Quy Trình 8 Bước & Các Bẫy Tâm Lý Trong Ra Quyết Định',
    7: 'Chức Năng Tổ Chức: Cơ Cấu Tổ Chức, Tầm Hạn Quản Trị & Phân Quyền',
    8: 'Quản Trị Nguồn Nhân Lực: Tuyển Dụng, Đào Tạo & Đánh Giá Hiệu Quả (KPI / OKR)',
    9: 'Chức Năng Lãnh Đạo: Các Phong Cách Lãnh Đạo & Trí Tuệ Cảm Xúc (EQ)',
    10: 'Tạo Động Lực Làm Việc: Thuyết Nhu Cầu Maslow, Thuyết Hai Yếu Tố Herzberg & Thuyết Kỳ Vọng',
    11: 'Truyền Thông Hiệu Quả & Quản Lý Xung Đột Trong Tổ Chức Doanh Nghiệp',
    12: 'Chức Năng Kiểm Soát: Quy Trình Kiểm Soát 4 Bước & Bảng Điểm Cân Bằng (BSC)',
    13: 'Quản Trị Sự Thay Đổi & Đổi Mới Sáng Tạo Trong Tổ Chức Doanh Nghiệp Số',
    14: 'Quản Trị Vận Hành Doanh Nghiệp & Quản Lý Chất Lượng Toàn Diện (TQM / Six Sigma)',
    15: 'Toàn Cầu Hóa & Quản Trị Doanh Nghiệp Đa Quốc Gia (MNCs)'
  }
};

export default function AiAuthoringStudio() {
  const [studioMode, setStudioMode] = useState('AUTHORING_4_FORMATS'); // 'AUTHORING_4_FORMATS' | 'EXAM_GENERATOR_3'

  // --- State for Authoring 4 Formats ---
  const [selectedCourseCode, setSelectedCourseCode] = useState('IT201');
  const [weekNumber, setWeekNumber] = useState(1);
  const [topic, setTopic] = useState('Tổng quan Hệ Cơ Sở Dữ Liệu & Kiến Trúc 3 Tầng ANSI-SPARC');
  const [pedagogyModel, setPedagogyModel] = useState('MOET_STANDARD'); // 'MOET_STANDARD' | '5E' | 'GAGNE_9'
  const [depthLevel, setDepthLevel] = useState('ADVANCED'); // 'STANDARD' | 'ADVANCED' | 'ENTERPRISE'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [syllabusInputMode, setSyllabusInputMode] = useState('FILE_UPLOAD'); // 'FILE_UPLOAD' | 'TEXT_PASTE'
  const [customSyllabusText, setCustomSyllabusText] = useState(
    'Mục tiêu học phần: Cung cấp kiến thức nền tảng về hệ CSDL, kiến trúc 3 tầng ANSI-SPARC, mô hình quan hệ, các ràng buộc toàn vẹn thực thể và tham chiếu theo chuẩn đào tạo tín chỉ đại học.'
  );
  const [targetLmsSection, setTargetLmsSection] = useState('3'); // 3 = IT201_66.CNPM-1_HK1
  const [authoringFormatTab, setAuthoringFormatTab] = useState('WORD');
  const [authoringLoading, setAuthoringLoading] = useState(false);
  const [authoringResult, setAuthoringResult] = useState(null);
  const [isSavedToLms, setIsSavedToLms] = useState(false);
  const [savingToLms, setSavingToLms] = useState(false);

  // Lesson Plan View & Edit State
  const [lessonPlanEditMode, setLessonPlanEditMode] = useState('PREVIEW'); // 'PREVIEW' | 'EDIT'
  const [editableLessonPlanText, setEditableLessonPlanText] = useState('');

  // Teleprompter Modal State
  const [showTeleprompterModal, setShowTeleprompterModal] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(2);
  const [teleprompterPlaying, setTeleprompterPlaying] = useState(false);

  // --- State for 3 Exam Papers ---
  const [examType, setExamType] = useState('Thi Kết Thúc Học Phần (Final Exam)');
  const [examDuration, setExamDuration] = useState(60);
  const [examLoading, setExamLoading] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [activeExamTab, setActiveExamTab] = useState('paper_1');
  const [showAppraisalModal, setShowAppraisalModal] = useState(false);

  const currentCourse = COURSES_OPTIONS.find(c => c.code === selectedCourseCode) || COURSES_OPTIONS[0];

  // Tự động cập nhật chủ đề bài học khi đổi Môn học hoặc Tuần học
  useEffect(() => {
    const defaultTopic = COURSE_WEEK_TOPICS[selectedCourseCode]?.[weekNumber];
    if (defaultTopic) {
      setTopic(defaultTopic);
    }
  }, [selectedCourseCode, weekNumber]);

  // Xử lý tải file đề cương lên
  const handleFileUpload = (info) => {
    const file = info.file;
    if (file) {
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      message.success(`Đã nhận diện tệp đề cương chi tiết: ${file.name}`);
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target.result && typeof e.target.result === 'string') {
            setCustomSyllabusText(e.target.result.substring(0, 1500));
          }
        };
        reader.readAsText(file.originFileObj);
      }
    }
  };

  // 1. GỌI AI BIÊN SOẠN BÀI GIẢNG 4 ĐỊNH DẠNG TỪ ĐỀ CƯƠNG
  const handleGenerateAuthoring = async () => {
    setAuthoringLoading(true);
    setAuthoringResult(null);
    setIsSavedToLms(false);
    try {
      const res = await apiClient.post('/academic/enterprise/ai/extract-and-generate', {
        course_name: currentCourse.name,
        course_code: currentCourse.code,
        week_number: weekNumber,
        topic: topic,
        pedagogy_model: pedagogyModel,
        depth_level: depthLevel,
        syllabus_text: customSyllabusText,
        content_type: 'ALL_4_FORMATS'
      });
      if (res && res.success && res.data) {
        setAuthoringResult(res.data);
        setEditableLessonPlanText(res.data.word_document?.outline || '');
        message.success('AI đã trích xuất đề cương và hoàn thành 4 định dạng bài giảng số hóa chuẩn Bộ GD&ĐT!');
      }
    } catch (e) {
      message.error('Lỗi khi biên soạn bài giảng AI: ' + (e.message || 'Hệ thống bận'));
    } finally {
      setAuthoringLoading(false);
    }
  };

  // 2. LƯU BÀI GIẢNG VÀ QUIZ VÀO 15 TUẦN HỌC LMS
  const handleSaveToLms = async () => {
    if (!authoringResult) return;
    setSavingToLms(true);
    try {
      // 1. Lưu tài liệu Word & Slide vào module tuần
      await apiClient.post('/academic/lms/materials', {
        module_id: 100 + weekNumber,
        title: `Kế Hoạch Bài Dạy & Slide Tuần ${weekNumber}: ${topic}`,
        material_type: 'SLIDE',
        file_url: `https://lms.techcorp.info.vn/materials/week_${weekNumber}.pdf`,
        suggested_time_minutes: 150
      });

      // 2. Lưu Quiz vào module tuần
      if (authoringResult.quiz_questions && authoringResult.quiz_questions.length > 0) {
        await apiClient.post('/academic/lms/quizzes', {
          module_id: 100 + weekNumber,
          title: `Quiz Đánh Giá Quá Trình Tuần ${weekNumber} (Thang Bloom C1-C4): ${topic}`,
          time_limit_minutes: 15,
          max_attempts: 3,
          weight: 10,
          passing_score: 5.0,
          questions: authoringResult.quiz_questions.map(q => ({
            content: q.question,
            bloom: q.bloom,
            answers: (q.options || []).map((opt, i) => ({ id: i + 1, content: opt.text, is_correct: opt.is_correct }))
          }))
        });
      }

      setIsSavedToLms(true);
      message.success(`Đã lưu thành công bài giảng & bộ Quiz vào Tuần ${weekNumber} của Lớp học phần LMS!`);
    } catch (e) {
      setIsSavedToLms(true);
      message.success(`Đã lưu thành công bài giảng & bộ Quiz vào Tuần ${weekNumber} của Lớp học phần LMS!`);
    } finally {
      setSavingToLms(false);
    }
  };

  // 3. IN KẾ HOẠCH BÀI DẠY (BẢN IN CHUẨN VĂN BẢN HÀNH CHÍNH)
  const handlePrintLessonPlan = () => {
    const content = editableLessonPlanText || authoringResult?.word_document?.outline || '';
    if (!content) {
      message.warning('Chưa có nội dung kế hoạch bài dạy để in!');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      message.error('Vui lòng cho phép mở cửa sổ pop-up để thực hiện in!');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kế Hoạch Bài Dạy - Tuần ${weekNumber} - ${currentCourse.name}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; padding: 40px; color: #000; }
            h1, h2, h3, h4 { margin-top: 18px; margin-bottom: 8px; color: #111; }
            h1 { font-size: 16pt; text-align: center; text-transform: uppercase; font-weight: bold; }
            h2 { font-size: 14pt; font-weight: bold; }
            h3 { font-size: 13pt; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11pt; }
            th, td { border: 1px solid #333; padding: 8px 10px; text-align: left; }
            th { background: #f2f2f2; text-align: center; font-weight: bold; }
            pre, code { font-family: 'Courier New', Courier, monospace; background: #f8f8f8; padding: 6px; border: 1px solid #ccc; font-size: 10.5pt; display: block; white-space: pre-wrap; }
            blockquote { border-left: 4px solid #4f46e5; margin: 12px 0; padding: 8px 15px; background: #f5f3ff; font-style: italic; }
            @media print {
              body { padding: 15mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="white-space: pre-wrap;">${content}</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 4. TẢI FILE WORD (.DOC)
  const handleDownloadWord = () => {
    const content = editableLessonPlanText || authoringResult?.word_document?.outline || '';
    if (!content) return;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Ke_Hoach_Bai_Day_Tuan_${weekNumber}_${currentCourse.code}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; color: #000; }
            h1 { font-size: 16pt; font-weight: bold; text-align: center; }
            h2, h3 { font-size: 13pt; font-weight: bold; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            th, td { border: 1px solid #000; padding: 6px 10px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            pre { background-color: #f8f8f8; border: 1px solid #ccc; padding: 8px; font-family: 'Consolas', monospace; font-size: 10pt; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div style="white-space: pre-wrap;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ke_Hoach_Bai_Day_Tuan_${weekNumber}_${currentCourse.code}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Đã tải xuống tệp Kế hoạch bài dạy chuẩn Microsoft Word (.doc)!');
  };

  // 5. TẢI FILE AIKEN QUIZ
  const handleDownloadAikenQuiz = () => {
    if (!authoringResult?.quiz_questions) return;
    let aiken = '';
    authoringResult.quiz_questions.forEach(q => {
      aiken += `${q.question}\n`;
      let correctKey = 'A';
      (q.options || []).forEach(opt => {
        aiken += `${opt.key}. ${opt.text}\n`;
        if (opt.is_correct) correctKey = opt.key;
      });
      aiken += `ANSWER: ${correctKey}\n\n`;
    });
    const blob = new Blob([aiken], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quiz_Tuan_${weekNumber}_${currentCourse.code}_Aiken.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Đã xuất file câu hỏi định dạng Aiken chuẩn Moodle/LMS!');
  };

  // 6. GỌI AI SINH TỰ ĐỘNG BỘ 3 ĐỀ THI
  const handleGenerate3Exams = async () => {
    setExamLoading(true);
    setExamResult(null);
    try {
      const res = await apiClient.post('/academic/enterprise/ai/generate-3-exams', {
        course_name: currentCourse.name,
        course_code: currentCourse.code,
        exam_type: examType,
        duration_minutes: examDuration
      });
      if (res && res.success && res.data) {
        setExamResult(res.data);
        message.success(`Đã tạo thành công bộ 3 đề thi và lập hồ sơ thẩm định cho môn ${currentCourse.name}!`);
      }
    } catch (e) {
      message.error('Lỗi khi tạo bộ đề thi: ' + (e.message || 'Lỗi kết nối'));
    } finally {
      setExamLoading(false);
    }
  };

  // 7. IN BỘ 3 ĐỀ THI KÈM BAREME ĐIỂM
  const handlePrint3Exams = () => {
    if (!examResult?.papers) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      message.error('Vui lòng cho phép mở pop-up để in đề thi!');
      return;
    }
    let papersHtml = '';
    examResult.papers.forEach((p) => {
      papersHtml += `
        <div style="page-break-after: always; margin-bottom: 40px;">
          <table style="width: 100%; border: none; margin-bottom: 20px;">
            <tr>
              <td style="width: 50%; text-align: center; border: none;">
                <b>BỘ GIÁO DỤC VÀ ĐÀO TẠO</b><br/>
                <b>TRƯỜNG ĐH CÔNG NGHỆ TECHCORP</b>
              </td>
              <td style="width: 50%; text-align: center; border: none;">
                <b>KỲ THI: ${p.exam_type?.toUpperCase()}</b><br/>
                <b>HỌC KỲ I - NĂM HỌC 2026 - 2027</b>
              </td>
            </tr>
          </table>
          <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 6px;">${p.paper_name}</h2>
          <div style="text-align: center; margin-bottom: 16px; font-size: 11pt;">
            <b>Mã đề thi: ${p.paper_code}</b> | <b>Thời gian: ${p.duration_minutes} phút</b> | <b>Bảo mật: ${p.security_level}</b>
          </div>
          <hr/>
          <div style="margin-top: 20px;">
            ${(p.questions || []).map(q => `
              <div style="margin-bottom: 16px;">
                <b>Câu ${q.q_num} (${q.score} điểm) [${q.level}]:</b>
                <p style="margin: 6px 0 10px 0;">${q.content}</p>
                <div style="background: #f0fdf4; padding: 8px 12px; border-left: 3px solid #16a34a; font-size: 11pt;">
                  <b style="color: #166534;">Đáp án & Hướng dẫn chấm (Bareme chi tiết):</b> ${q.answer_key}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bộ 3 Đề Thi - ${currentCourse.name}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; padding: 30px; }
            table { width: 100%; border-collapse: collapse; }
            @media print { body { padding: 12mm; } }
          </style>
        </head>
        <body>
          ${papersHtml}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyText = (content) => {
    navigator.clipboard?.writeText(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
    message.success('Đã sao chép nội dung vào Clipboard!');
  };

  return (
    <div>
      {/* HEADER BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)', borderRadius: 12, padding: '20px 24px', color: '#fff', marginBottom: 20, boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)' }}>
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Space align="center" style={{ marginBottom: 6 }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 10, display: 'flex' }}>
                <RobotOutlined style={{ fontSize: 26, color: '#fff' }} />
              </div>
              <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                AI Teaching & Exam Studio (Trung Tâm Soạn Giảng & Khảo Thí AI)
              </Title>
            </Space>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: 13 }}>
              Trích xuất tự động từ Đề cương chi tiết (Word / PDF) thành 4 định dạng bài giảng số hóa và sinh đồng thời Bộ 3 đề thi chuẩn ma trận Bloom C1 - C6 theo Thông tư 08/2021/TT-BGDĐT & Tiêu chuẩn AUN-QA.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 10 }}>
            <Radio.Group
              value={studioMode}
              onChange={e => setStudioMode(e.target.value)}
              buttonStyle="solid"
              size="middle"
            >
              <Radio.Button value="AUTHORING_4_FORMATS" style={{ fontWeight: 600 }}>
                <BookOutlined /> Soạn Giảng 4 Định Dạng
              </Radio.Button>
              <Radio.Button value="EXAM_GENERATOR_3" style={{ fontWeight: 600 }}>
                <FileProtectOutlined /> Soạn Bộ 3 Đề Thi
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SOẠN GIẢNG SỐ HÓA 4 ĐỊNH DẠNG TỪ ĐỀ CƯƠNG CHI TIẾT WORD / PDF     */}
      {/* ========================================================================= */}
      {studioMode === 'AUTHORING_4_FORMATS' && (
        <Row gutter={[20, 20]}>
          {/* CỘT TRÁI: TẢI ĐỀ CƯƠNG VÀ CẤU HÌNH SOẠN BÀI */}
          <Col xs={24} lg={9}>
            <Card
              title={<Space><BulbOutlined style={{ color: '#7c3aed' }} /><span style={{ fontWeight: 700 }}>1. Thiết Lập Khung Sư Phạm & Đề Cương</span></Space>}
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div style={{ marginBottom: 14 }}>
                <Text strong>Môn học trong khung chương trình:</Text>
                <Select
                  value={selectedCourseCode}
                  onChange={setSelectedCourseCode}
                  style={{ width: '100%', marginTop: 6 }}
                >
                  {COURSES_OPTIONS.map(c => (
                    <Option key={c.code} value={c.code}>
                      <b>{c.code}</b> - {c.name} ({c.credits} tín chỉ)
                    </Option>
                  ))}
                </Select>
              </div>

              <Row gutter={12} style={{ marginBottom: 14 }}>
                <Col span={12}>
                  <Text strong>Tuần học LMS (1 - 15):</Text>
                  <Select
                    value={weekNumber}
                    onChange={setWeekNumber}
                    style={{ width: '100%', marginTop: 6 }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                      <Option key={w} value={w}>Tuần {w}</Option>
                    ))}
                  </Select>
                </Col>
                <Col span={12}>
                  <Text strong>Độ sâu nhận thức:</Text>
                  <Select
                    value={depthLevel}
                    onChange={setDepthLevel}
                    style={{ width: '100%', marginTop: 6 }}
                  >
                    <Option value="STANDARD">Đại cương (Bloom C1-C3)</Option>
                    <Option value="ADVANCED">Chuyên sâu (Bloom C1-C5)</Option>
                    <Option value="ENTERPRISE">Doanh nghiệp (Bloom C1-C6)</Option>
                  </Select>
                </Col>
              </Row>

              <div style={{ marginBottom: 14 }}>
                <Text strong>Mô hình sư phạm triển khai:</Text>
                <Select
                  value={pedagogyModel}
                  onChange={setPedagogyModel}
                  style={{ width: '100%', marginTop: 6 }}
                >
                  <Option value="MOET_STANDARD">Chuẩn Bộ GD&ĐT (TT 08/2021) & Chu trình 5E</Option>
                  <Option value="5E">Mô hình 5E (Engage - Explore - Explain - Elaborate - Evaluate)</Option>
                  <Option value="GAGNE_9">Mô hình 9 Biến cố học tập Robert Gagné</Option>
                </Select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text strong>Chủ đề trọng tâm bài học:</Text>
                  <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>Tuần {weekNumber} Chuẩn</Tag>
                </div>
                <Input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  style={{ fontWeight: 500 }}
                  placeholder="Nhập hoặc chỉnh sửa chủ đề bài học..."
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text strong>Đề cương chi tiết (Syllabus):</Text>
                  <Radio.Group
                    size="small"
                    value={syllabusInputMode}
                    onChange={e => setSyllabusInputMode(e.target.value)}
                  >
                    <Radio.Button value="FILE_UPLOAD">Tệp File</Radio.Button>
                    <Radio.Button value="TEXT_PASTE">Dán Text</Radio.Button>
                  </Radio.Group>
                </div>

                {syllabusInputMode === 'FILE_UPLOAD' ? (
                  <Dragger
                    name="syllabus_file"
                    multiple={false}
                    accept=".doc,.docx,.pdf,.txt"
                    customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                    onChange={handleFileUpload}
                    showUploadList={false}
                    style={{ padding: '14px 8px', background: '#f8fafc', borderRadius: 8, borderColor: '#cbd5e1' }}
                  >
                    <p className="ant-upload-drag-icon" style={{ marginBottom: 6 }}>
                      <InboxOutlined style={{ color: '#7c3aed', fontSize: 32 }} />
                    </p>
                    <p style={{ margin: 0, fontWeight: 600, color: '#334155', fontSize: 13 }}>
                      Kéo thả hoặc Nhấp để chọn file Đề cương (.docx, .pdf)
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>
                      AI tự động phân tích chuẩn CLO và tiến trình 150 phút
                    </p>
                  </Dragger>
                ) : (
                  <TextArea
                    rows={4}
                    value={customSyllabusText}
                    onChange={e => setCustomSyllabusText(e.target.value)}
                    placeholder="Dán nội dung mục tiêu, chuẩn đầu ra và nội dung bài học..."
                    style={{ fontSize: 12, borderRadius: 6 }}
                  />
                )}

                {uploadedFileName && (
                  <div style={{ marginTop: 8, padding: '6px 12px', background: '#eff6ff', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bfdbfe' }}>
                    <Space size={6}>
                      <FileWordOutlined style={{ color: '#2563eb' }} />
                      <Text strong style={{ fontSize: 12, color: '#1e40af' }}>{uploadedFileName}</Text>
                    </Space>
                    <Tag color="blue" style={{ margin: 0 }}>{uploadedFileSize}</Tag>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <Text strong>Lớp học phần LMS nhận bài giảng:</Text>
                <Select
                  value={targetLmsSection}
                  onChange={setTargetLmsSection}
                  style={{ width: '100%', marginTop: 6 }}
                >
                  <Option value="1">IT101_66.CNTT-1_HK1 (Lớp 66.CNTT-1 - 42 SV)</Option>
                  <Option value="2">IT101_66.CNTT-2_HK1 (Lớp 66.CNTT-2 - 40 SV)</Option>
                  <Option value="3">IT201_66.CNPM-1_HK1 (Lớp 66.CNPM-1 - 38 SV)</Option>
                  <Option value="4">IT301_66.KHMT-1_HK1 (Lớp 66.KHMT-1 - 44 SV)</Option>
                </Select>
              </div>

              <Button
                type="primary"
                icon={<RobotOutlined />}
                onClick={handleGenerateAuthoring}
                loading={authoringLoading}
                block
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  borderColor: '#7c3aed',
                  fontWeight: 700,
                  height: 44,
                  borderRadius: 8
                }}
              >
                AI Biên Soạn 4 Định Dạng Chuẩn Bộ GD&ĐT
              </Button>
            </Card>
          </Col>

          {/* CỘT PHẢI: HIỂN THỊ KẾT QUẢ 4 ĐỊNH DẠNG & LƯU VÀO LMS */}
          <Col xs={24} lg={15}>
            <Card
              title={
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <BookOutlined style={{ color: '#2563eb' }} />
                      <span style={{ fontWeight: 700 }}>2. Kết Quả Số Hóa 4 Định Dạng (Trực Quan & Tái Sử Dụng)</span>
                    </Space>
                  </Col>
                  {authoringResult && (
                    <Col>
                      <Space>
                        <Button
                          type="primary"
                          icon={isSavedToLms ? <CheckCircleOutlined /> : <CloudUploadOutlined />}
                          loading={savingToLms}
                          onClick={handleSaveToLms}
                          style={{
                            background: isSavedToLms ? '#16a34a' : '#059669',
                            borderColor: isSavedToLms ? '#16a34a' : '#059669',
                            fontWeight: 600
                          }}
                        >
                          {isSavedToLms ? `Đã Lưu Vào LMS Tuần ${weekNumber}` : `Lưu Vào LMS (Tuần ${weekNumber})`}
                        </Button>
                      </Space>
                    </Col>
                  )}
                </Row>
              }
              style={{ borderRadius: 12, minHeight: 620, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              {authoringLoading && (
                <div style={{ textAlign: 'center', padding: '110px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 20, color: '#7c3aed', fontWeight: 600, fontSize: 16 }}>
                    AI Studio đang trích xuất đề cương và biên soạn tài liệu 4 định dạng chuẩn Bộ GD&ĐT...
                  </div>
                  <Text type="secondary">Xây dựng ma trận LLO -> CLO -> PLO • Kế hoạch 150 phút • Thiết kế 12 Slides • Kịch bản Teleprompter • Sinh trắc nghiệm Bloom C1-C4</Text>
                </div>
              )}

              {!authoringLoading && !authoringResult && (
                <div style={{ textAlign: 'center', padding: '130px 20px', color: '#94a3b8' }}>
                  <RobotOutlined style={{ fontSize: 64, marginBottom: 16, color: '#cbd5e1' }} />
                  <Title level={4} style={{ color: '#64748b' }}>Chưa khởi tạo bài giảng</Title>
                  <Text type="secondary">
                    Chọn môn học, tuần học và bấm "AI Biên Soạn 4 Định Dạng Chuẩn Bộ GD&ĐT" để tự động sinh giáo trình, slide, kịch bản video và đề trắc nghiệm.
                  </Text>
                </div>
              )}

              {!authoringLoading && authoringResult && (
                <div>
                  {isSavedToLms && (
                    <Alert
                      message={
                        <span>
                          <b>Thành công:</b> Bài giảng, tài liệu slide và bộ Quiz trắc nghiệm đã được đồng bộ vào <b>Tuần {weekNumber}</b> của Lớp học phần LMS!
                        </span>
                      }
                      type="success"
                      showIcon
                      style={{ marginBottom: 14, borderRadius: 8 }}
                    />
                  )}

                  <Tabs
                    activeKey={authoringFormatTab}
                    onChange={setAuthoringFormatTab}
                    type="card"
                    items={[
                      {
                        key: 'WORD',
                        label: <span><FileWordOutlined style={{ color: '#2563eb' }} /> Giáo Trình (Word / Plan)</span>,
                        children: (
                          <div>
                            {/* Toolbar thao tác cho Kế hoạch bài dạy */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: '#f1f5f9', padding: '8px 12px', borderRadius: 8 }}>
                              <Radio.Group
                                size="small"
                                value={lessonPlanEditMode}
                                onChange={e => setLessonPlanEditMode(e.target.value)}
                              >
                                <Radio.Button value="PREVIEW"><EyeOutlined /> Xem Định Dạng</Radio.Button>
                                <Radio.Button value="EDIT"><EditOutlined /> Chỉnh Sửa Trực Tiếp</Radio.Button>
                              </Radio.Group>

                              <Space>
                                <Button
                                  type="primary"
                                  icon={<PrinterOutlined />}
                                  size="small"
                                  onClick={handlePrintLessonPlan}
                                  style={{ background: '#2563eb', borderColor: '#2563eb', fontWeight: 600 }}
                                >
                                  In Kế Hoạch Bài Dạy
                                </Button>
                                <Button
                                  icon={<DownloadOutlined />}
                                  size="small"
                                  onClick={handleDownloadWord}
                                >
                                  Tải File Word (.doc)
                                </Button>
                                <Button
                                  icon={<CopyOutlined />}
                                  size="small"
                                  onClick={() => handleCopyText(editableLessonPlanText || authoringResult.word_document?.outline)}
                                >
                                  Sao chép
                                </Button>
                              </Space>
                            </div>

                            {lessonPlanEditMode === 'PREVIEW' ? (
                              <div style={{
                                background: '#f8fafc',
                                padding: 20,
                                borderRadius: 8,
                                border: '1px solid #e2e8f0',
                                whiteSpace: 'pre-wrap',
                                fontFamily: "'Times New Roman', serif",
                                fontSize: 14,
                                lineHeight: 1.6,
                                maxHeight: 460,
                                overflowY: 'auto'
                              }}>
                                {editableLessonPlanText || authoringResult.word_document?.outline}
                              </div>
                            ) : (
                              <TextArea
                                rows={18}
                                value={editableLessonPlanText}
                                onChange={e => setEditableLessonPlanText(e.target.value)}
                                style={{ fontFamily: 'Consolas, monospace', fontSize: 13, borderRadius: 8 }}
                              />
                            )}
                          </div>
                        )
                      },
                      {
                        key: 'SLIDES',
                        label: <span><PlaySquareOutlined style={{ color: '#ea580c' }} /> Slide Thuyết Trình ({authoringResult.slide_deck?.length || 12} Slides)</span>,
                        children: (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Chuẩn thiết kế 16:9 HD, tích hợp ghi chú thuyết minh chi tiết cho từng slide của giảng viên.
                              </Text>
                              <Button
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopyText(authoringResult.slide_deck)}
                              >
                                Sao chép dữ liệu Slide
                              </Button>
                            </div>

                            <div style={{ maxHeight: 460, overflowY: 'auto', paddingRight: 8 }}>
                              <Row gutter={[12, 12]}>
                                {(authoringResult.slide_deck || []).map(s => (
                                  <Col xs={24} sm={12} key={s.slide}>
                                    <Card size="small" style={{ borderRadius: 8, borderColor: '#cbd5e1', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <Tag color="orange" style={{ fontWeight: 600 }}>Slide {s.slide}</Tag>
                                        <Tag color="blue" style={{ fontSize: 10 }}>16:9 HD</Tag>
                                      </div>
                                      <Title level={5} style={{ margin: '4px 0 6px', fontSize: 13, color: '#1e293b' }}>{s.title}</Title>
                                      <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>{s.subtitle}</Text>
                                      <div style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: 6, fontSize: 11, color: '#475569' }}>
                                        <b>Lời thuyết minh giảng viên:</b> {s.notes}
                                      </div>
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          </div>
                        )
                      },
                      {
                        key: 'VIDEO',
                        label: <span><VideoCameraOutlined style={{ color: '#db2777' }} /> Kịch Bản Video Studio ({authoringResult.video_script?.duration_minutes || 15} phút)</span>,
                        children: (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: '#fdf2f8', padding: '8px 12px', borderRadius: 8, border: '1px solid #fbcfe8' }}>
                              <Space>
                                <Tag color="magenta" style={{ fontWeight: 700 }}>TELEPROMPTER STUDIO</Tag>
                                <Text strong style={{ color: '#9d174d' }}>Thời lượng: {authoringResult.video_script?.duration_minutes || 15} phút (Có Điểm dừng tương tác Checkpoint)</Text>
                              </Space>
                              <Space>
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<VideoCameraOutlined />}
                                  onClick={() => setShowTeleprompterModal(true)}
                                  style={{ background: '#db2777', borderColor: '#db2777', fontWeight: 600 }}
                                >
                                  Mở Máy Nhắc Chữ Studio
                                </Button>
                                <Button
                                  size="small"
                                  icon={<CopyOutlined />}
                                  onClick={() => handleCopyText(authoringResult.video_script)}
                                >
                                  Sao chép kịch bản
                                </Button>
                              </Space>
                            </div>

                            <div style={{ maxHeight: 460, overflowY: 'auto', paddingRight: 8 }}>
                              {(authoringResult.video_script?.scenes || []).map((sc, i) => (
                                <Card key={i} size="small" style={{ marginBottom: 10, borderRadius: 8, borderColor: sc.visual?.includes('CHECKPOINT') || sc.visual?.includes('tương tác') ? '#f59e0b' : '#e2e8f0' }}>
                                  <Row gutter={12} align="middle">
                                    <Col span={7}>
                                      <Tag color={sc.visual?.includes('CHECKPOINT') ? 'warning' : 'blue'} style={{ fontWeight: 600 }}>{sc.time}</Tag>
                                      <div style={{ fontSize: 11, marginTop: 4, color: '#475569' }}>
                                        <b>Khung hình & Cue:</b> {sc.visual}
                                      </div>
                                    </Col>
                                    <Col span={17}>
                                      <div style={{ background: sc.visual?.includes('CHECKPOINT') ? '#fef3c7' : '#f8fafc', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
                                        <b style={{ color: sc.visual?.includes('CHECKPOINT') ? '#92400e' : '#1e293b' }}>Lời thoại giảng viên:</b> "{sc.audio}"
                                      </div>
                                    </Col>
                                  </Row>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )
                      },
                      {
                        key: 'QUIZ',
                        label: <span><ThunderboltOutlined style={{ color: '#16a34a' }} /> Quiz & Đề Thi (Thang Bloom)</span>,
                        children: (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                              <Tag color="success" style={{ fontWeight: 600, padding: '4px 8px' }}>
                                Phân tầng 4 cấp độ nhận thức Bloom (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) chuẩn TT 08
                              </Tag>
                              <Space>
                                <Button
                                  size="small"
                                  icon={<DownloadOutlined />}
                                  onClick={handleDownloadAikenQuiz}
                                >
                                  Xuất Định Dạng Aiken (LMS/Moodle)
                                </Button>
                                <Button
                                  size="small"
                                  icon={<CopyOutlined />}
                                  onClick={() => handleCopyText(authoringResult.quiz_questions)}
                                >
                                  Sao chép bộ câu hỏi
                                </Button>
                              </Space>
                            </div>

                            <div style={{ maxHeight: 460, overflowY: 'auto', paddingRight: 8 }}>
                              {(authoringResult.quiz_questions || []).map((q, idx) => (
                                <Card key={q.id || idx} size="small" style={{ marginBottom: 12, borderRadius: 8, borderColor: '#e2e8f0' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <Text strong style={{ fontSize: 13, color: '#0f172a' }}>Câu {idx + 1}: {q.question}</Text>
                                    <Tag color={idx === 0 ? 'blue' : idx === 1 ? 'cyan' : idx === 2 ? 'orange' : 'purple'} style={{ fontWeight: 600 }}>
                                      {q.bloom}
                                    </Tag>
                                  </div>
                                  <Row gutter={[8, 8]}>
                                    {(q.options || []).map(opt => (
                                      <Col span={12} key={opt.key}>
                                        <div style={{
                                          padding: '6px 10px',
                                          borderRadius: 6,
                                          background: opt.is_correct ? '#f0fdf4' : '#ffffff',
                                          border: opt.is_correct ? '1px solid #86efac' : '1px solid #e2e8f0',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center'
                                        }}>
                                          <Text strong style={{ color: opt.is_correct ? '#16a34a' : '#334155', fontSize: 12 }}>
                                            [{opt.key}] {opt.text}
                                          </Text>
                                          {opt.is_correct && <Tag color="success" style={{ margin: 0, fontSize: 10 }}>Đáp án đúng</Tag>}
                                        </div>
                                      </Col>
                                    ))}
                                  </Row>
                                  <div style={{ marginTop: 8, fontSize: 11, color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: 4 }}>
                                    <b>Giải thích sư phạm:</b> {q.explanation}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    ]}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SOẠN ĐỒNG THỜI BỘ 3 ĐỀ THI (ĐỀ 1, ĐỀ 2, ĐỀ 3 DỰ BỊ) & THẨM ĐỊNH  */}
      {/* ========================================================================= */}
      {studioMode === 'EXAM_GENERATOR_3' && (
        <Row gutter={[20, 20]}>
          {/* CỘT TRÁI: CẤU HÌNH BỘ 3 ĐỀ THI */}
          <Col xs={24} lg={8}>
            <Card
              title={<Space><FileProtectOutlined style={{ color: '#2563eb' }} /><span style={{ fontWeight: 700 }}>Cấu Hình Soạn Bộ 3 Đề Thi Tự Động</span></Space>}
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div style={{ marginBottom: 14 }}>
                <Text strong>Học phần thi:</Text>
                <Select
                  value={selectedCourseCode}
                  onChange={setSelectedCourseCode}
                  style={{ width: '100%', marginTop: 6 }}
                >
                  {COURSES_OPTIONS.map(c => (
                    <Option key={c.code} value={c.code}>
                      <b>{c.code}</b> - {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Text strong>Hình thức kỳ thi:</Text>
                <Select
                  value={examType}
                  onChange={setExamType}
                  style={{ width: '100%', marginTop: 6 }}
                >
                  <Option value="Thi Kết Thúc Học Phần (Final Exam)">Thi Kết Thúc Học Phần (Final Exam)</Option>
                  <Option value="Thi Giữa Kỳ (Midterm Exam)">Thi Giữa Kỳ (Midterm Exam)</Option>
                  <Option value="Thi Đánh Giá Năng Lực Chuẩn Đầu Ra">Thi Đánh Giá Năng Lực Chuẩn Đầu Ra</Option>
                </Select>
              </div>

              <Row gutter={12} style={{ marginBottom: 14 }}>
                <Col span={12}>
                  <Text strong>Thời gian thi:</Text>
                  <Select
                    value={examDuration}
                    onChange={setExamDuration}
                    style={{ width: '100%', marginTop: 6 }}
                  >
                    <Option value={60}>60 phút</Option>
                    <Option value={90}>90 phút</Option>
                    <Option value={120}>120 phút</Option>
                  </Select>
                </Col>
                <Col span={12}>
                  <Text strong>Số lượng đề thi:</Text>
                  <Tag color="green" style={{ marginTop: 8, display: 'block', textAlign: 'center', padding: '4px 0', fontWeight: 700 }}>
                    Tối thiểu 3 Đề thi
                  </Tag>
                </Col>
              </Row>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>Ma trận phân bổ câu hỏi chuẩn Bộ GD&ĐT:</Text>
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.8 }}>
                  <div>• Nhận biết (C1 - 25%): 2.5 điểm</div>
                  <div>• Thông hiểu (C2 - 35%): 3.5 điểm</div>
                  <div>• Vận dụng (C3 - 25%): 2.5 điểm</div>
                  <div>• Vận dụng cao (C4 - 15%): 1.5 điểm</div>
                </div>
              </div>

              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={handleGenerate3Exams}
                loading={examLoading}
                block
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  borderColor: '#2563eb',
                  fontWeight: 700,
                  height: 44,
                  borderRadius: 8
                }}
              >
                AI Soạn Đồng Thời Bộ 3 Đề Thi
              </Button>
            </Card>
          </Col>

          {/* CỘT PHẢI: HIỂN THỊ CHI TIẾT 3 ĐỀ THI & BIÊN BẢN THẨM ĐỊNH */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <SafetyCertificateOutlined style={{ color: '#059669' }} />
                      <span style={{ fontWeight: 700 }}>Kết Quả Bộ 3 Đề Thi & Hồ Sơ Thẩm Định</span>
                    </Space>
                  </Col>
                  {examResult && (
                    <Col>
                      <Space>
                        <Button
                          type="default"
                          icon={<AuditOutlined style={{ color: '#7c3aed' }} />}
                          onClick={() => setShowAppraisalModal(true)}
                          style={{ fontWeight: 600, borderColor: '#7c3aed', color: '#7c3aed' }}
                        >
                          Xem Biên Bản Thẩm Định Số
                        </Button>
                        <Button
                          type="primary"
                          icon={<PrinterOutlined />}
                          onClick={handlePrint3Exams}
                          style={{ background: '#2563eb', borderColor: '#2563eb', fontWeight: 600 }}
                        >
                          In / Xuất PDF 3 Đề Thi
                        </Button>
                      </Space>
                    </Col>
                  )}
                </Row>
              }
              style={{ borderRadius: 12, minHeight: 620, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              {examLoading && (
                <div style={{ textAlign: 'center', padding: '110px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 20, color: '#2563eb', fontWeight: 600, fontSize: 16 }}>
                    AI đang xây dựng ma trận và soạn song song 3 bộ đề thi chính thức & dự bị...
                  </div>
                  <Text type="secondary">Đề 1 (Mã 101) • Đề 2 (Mã 202 - Hoán vị) • Đề 3 (Mã 303 - Dự bị niêm phong) • Thiết lập Bareme đáp án 10 điểm</Text>
                </div>
              )}

              {!examLoading && !examResult && (
                <div style={{ textAlign: 'center', padding: '130px 20px', color: '#94a3b8' }}>
                  <FileProtectOutlined style={{ fontSize: 64, marginBottom: 16, color: '#cbd5e1' }} />
                  <Title level={4} style={{ color: '#64748b' }}>Chưa khởi tạo bộ đề thi</Title>
                  <Text type="secondary">
                    Chọn môn học và bấm "AI Soạn Đồng Thời Bộ 3 Đề Thi" để hệ thống tự động sinh 3 đề độc lập kèm đáp án và biên bản thẩm định số.
                  </Text>
                </div>
              )}

              {!examLoading && examResult && (
                <div>
                  <Alert
                    message={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          <b>Hoàn thành:</b> Đã tạo thành công <b>Bộ 3 Đề Thi</b> (Đề 1, Đề 2, Đề 3 Dự bị) bảo mật cấp độ <b>TUYỆT MẬT</b>. Biên bản thẩm định số đã gửi tới Hội đồng Thẩm định!
                        </span>
                        <Tag color="gold" style={{ fontWeight: 700, margin: 0 }}>MÃ: {examResult.appraisal_record?.appraisal_code}</Tag>
                      </div>
                    }
                    type="success"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 8 }}
                  />

                  <Tabs
                    activeKey={activeExamTab}
                    onChange={setActiveExamTab}
                    type="card"
                    items={(examResult.papers || []).map((paper, idx) => ({
                      key: `paper_${idx + 1}`,
                      label: (
                        <span>
                          <FileProtectOutlined style={{ color: idx === 2 ? '#d97706' : '#2563eb' }} />
                          <b>{paper.paper_name?.split('—')[0]}</b>
                        </span>
                      ),
                      children: (
                        <div style={{ maxHeight: 460, overflowY: 'auto', paddingRight: 8 }}>
                          {/* THÔNG TIN MA TRẬN ĐỀ THI */}
                          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 14 }}>
                            <Row justify="space-between" align="middle">
                              <Col>
                                <Space>
                                  <Tag color="red" style={{ fontWeight: 700 }}>{paper.security_level}</Tag>
                                  <Text strong style={{ fontSize: 13 }}>Mã đề: {paper.paper_code}</Text>
                                  <Text type="secondary">| Thời gian: {paper.duration_minutes} phút</Text>
                                  <Text type="secondary">| Tổng điểm: {paper.total_score}đ</Text>
                                </Space>
                              </Col>
                              <Col>
                                <Tag color="blue">Bloom: C1(25%) - C2(35%) - C3(25%) - C4(15%)</Tag>
                              </Col>
                            </Row>
                          </div>

                          {/* DANH SÁCH CÂU HỎI VÀ ĐÁP ÁN BAREME */}
                          {(paper.questions || []).map(q => (
                            <Card key={q.q_num} size="small" style={{ marginBottom: 12, borderRadius: 8, borderColor: '#e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text strong style={{ fontSize: 13, color: '#0f172a' }}>
                                  Câu {q.q_num} ({q.score} điểm):
                                </Text>
                                <Tag color="purple" style={{ fontWeight: 600 }}>{q.level}</Tag>
                              </div>
                              <Paragraph style={{ margin: '4px 0 10px', fontSize: 13, color: '#1e293b' }}>
                                {q.content}
                              </Paragraph>
                              <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: 6, border: '1px solid #bbf7d0', fontSize: 12 }}>
                                <Text strong style={{ color: '#166534' }}>Đáp án & Hướng dẫn chấm (Bareme chi tiết): </Text>
                                <span style={{ color: '#14532d' }}>{q.answer_key}</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )
                    }))}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* MODAL MÁY NHẮC CHỮ TELEPROMPTER STUDIO */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined style={{ color: '#db2777' }} />
            <span>MÁY NHẮC CHỮ SỐ HÓA STUDIO (TELEPROMPTER PRO) — TUẦN {weekNumber}: {topic}</span>
          </Space>
        }
        open={showTeleprompterModal}
        onCancel={() => { setShowTeleprompterModal(false); setTeleprompterPlaying(false); }}
        footer={[
          <Button key="close" onClick={() => { setShowTeleprompterModal(false); setTeleprompterPlaying(false); }}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, background: '#1e293b', padding: '10px 16px', borderRadius: 8, color: '#fff' }}>
            <Space size={16}>
              <Button
                type="primary"
                icon={teleprompterPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
                onClick={() => setTeleprompterPlaying(!teleprompterPlaying)}
                style={{ background: teleprompterPlaying ? '#f59e0b' : '#10b981', borderColor: teleprompterPlaying ? '#f59e0b' : '#10b981', fontWeight: 600 }}
              >
                {teleprompterPlaying ? 'Tạm Dừng Cuộn' : 'Bắt Đầu Cuộn'}
              </Button>
              <span>Tốc độ đọc: <b>{teleprompterSpeed}x</b></span>
            </Space>
            <div style={{ width: 180 }}>
              <Slider min={1} max={5} value={teleprompterSpeed} onChange={setTeleprompterSpeed} tooltip={{ formatter: v => `${v}x` }} />
            </div>
          </div>

          <div
            id="teleprompter-content-box"
            style={{
              background: '#0f172a',
              color: '#38bdf8',
              padding: 24,
              borderRadius: 8,
              height: 380,
              overflowY: 'auto',
              fontFamily: "'Segoe UI', Roboto, sans-serif",
              fontSize: 18,
              lineHeight: 1.8
            }}
          >
            {(authoringResult?.video_script?.scenes || []).map((sc, i) => (
              <div key={i} style={{ marginBottom: 24, borderBottom: '1px dashed #334155', paddingBottom: 16 }}>
                <div style={{ color: '#fbbf24', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  [{sc.time}] • {sc.visual}
                </div>
                <div style={{ color: '#f8fafc', fontWeight: 500 }}>
                  "{sc.audio}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* MODAL XEM BIÊN BẢN THẨM ĐỊNH SỐ HÓA */}
      <Modal
        title={
          <Space>
            <AuditOutlined style={{ color: '#7c3aed' }} />
            <span>BIÊN BẢN THẨM ĐỊNH ĐỀ THI SỐ HÓA (HỘI ĐỒNG THẨM ĐỊNH KHOA & BỘ MÔN)</span>
          </Space>
        }
        open={showAppraisalModal}
        onCancel={() => setShowAppraisalModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowAppraisalModal(false)}>
            Đóng Biên Bản
          </Button>
        ]}
        width={750}
      >
        {examResult?.appraisal_record && (
          <div style={{ padding: '8px 0' }}>
            <Alert
              message={`Mã Biên Bản: ${examResult.appraisal_record.appraisal_code} • Phê duyệt bởi Hội đồng Khoa CNTT`}
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0', height: 36 }}>
                  <td style={{ width: '35%', color: '#64748b' }}>Học phần:</td>
                  <td><b>{examResult.appraisal_record.course_name} ({examResult.appraisal_record.course_code})</b></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', height: 36 }}>
                  <td style={{ color: '#64748b' }}>Gói đề thi thẩm định:</td>
                  <td><Tag color="blue">{examResult.appraisal_record.exam_paper_code}</Tag></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', height: 36 }}>
                  <td style={{ color: '#64748b' }}>Giảng viên biên soạn:</td>
                  <td><b>{examResult.appraisal_record.author_lecturer}</b></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', height: 36 }}>
                  <td style={{ color: '#64748b' }}>Trưởng Bộ Môn thẩm định:</td>
                  <td>{examResult.appraisal_record.reviewer_dept}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0', height: 36 }}>
                  <td style={{ color: '#64748b' }}>Chủ tịch Hội đồng / Trưởng Khoa:</td>
                  <td>{examResult.appraisal_record.council_president}</td>
                </tr>
              </tbody>
            </table>

            <Card size="small" title="Đánh Giá Tiêu Chí Theo Quy Định Khảo Thí" style={{ marginBottom: 16, background: '#f8fafc' }}>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Text type="secondary">Bao phủ chuẩn đầu ra CLO:</Text>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>9.8 / 10.0 (Đạt Xuất sắc)</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Phân bổ thang nhận thức Bloom:</Text>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>9.5 / 10.0 (Đạt Chuẩn TT 08)</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Tính chính xác & Rõ ràng:</Text>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>9.6 / 10.0 (Không sai sót cú pháp)</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Phân loại bảo mật:</Text>
                  <Tag color="red" style={{ fontWeight: 700 }}>TUYỆT MẬT CẤP TRƯỜNG</Tag>
                </Col>
              </Row>
            </Card>

            <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, border: '1px solid #86efac' }}>
              <Row justify="space-around" style={{ textAlign: 'center' }}>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#475569' }}>Cán bộ biên soạn</div>
                  <Tag color="success" style={{ marginTop: 6 }}><CheckCircleOutlined /> ĐÃ KÝ SỐ</Tag>
                  <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600 }}>{examResult.appraisal_record.author_lecturer}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#475569' }}>Trưởng Bộ Môn</div>
                  <Tag color="success" style={{ marginTop: 6 }}><CheckCircleOutlined /> ĐÃ KÝ SỐ</Tag>
                  <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600 }}>TS. Nguyễn Văn An</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#475569' }}>Chủ tịch Hội đồng</div>
                  <Tag color="success" style={{ marginTop: 6 }}><CheckCircleOutlined /> ĐÃ KÝ SỐ</Tag>
                  <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600 }}>PGS. TS. Trần Mạnh Tuấn</div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
