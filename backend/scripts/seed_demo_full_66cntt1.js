// backend/scripts/seed_demo_full_66cntt1.js
// Script nạp toàn diện dữ liệu mẫu cho Lớp 66.CNTT-1 (Khoa CNTT - K66):
// 4 Môn học chính khóa:
// 1. IT101 - Nhập môn Lập trình C/C++ (4 tín chỉ) - GV: TS. Hoàng Đức Em (Section 1 / Course 6)
// 2. IT201 - Cơ sở Dữ liệu (Database Systems) (3 tín chỉ) - GV: TS. Hoàng Đức Em (Section 2 / Course 7)
// 3. ENG101 - Tiếng Anh Học Thuật 1 (General English B1) (3 tín chỉ) - GV: TS. Phạm Thu Hương (Section 3 / Course 8)
// 4. MAT101 - Giải Tích 1 (Toán Cao Cấp 1) (3 tín chỉ) - GV: TS. Trần Văn Bình (Section 4 / Course 9)

'use strict';

const path = require('path');
const fs = require('fs');
require(path.resolve(__dirname, '../node_modules/dotenv')).config({ path: path.resolve(__dirname, '../.env') });

const {
  sequelize,
  Course,
  CourseSection,
  CourseLesson,
  AcademicMaterial,
  AcademicAssignment,
  AcademicAssignmentSubmission,
  AcademicAttendanceSession,
  AcademicAttendanceRecord,
  AcademicSectionGrade,
  QuizAssessment,
  QuizQuestion,
  QuizSubmission,
  AcademicExamSchedule,
  ExamPaper
} = require('../models');

const { SECTION_METADATA, generateStandard15Weeks } = require('../controllers/sectionData');
const examBank = require('../services/examBank');

// Danh sách 10 sinh viên chuẩn của Lớp 66.CNTT-1 (Khoa Công Nghệ Thông Tin)
const STUDENTS_66CNTT1 = [
  { id: 1, code: '261IT001', name: 'Trần Văn Nam', birth_date: '15/08/2004', gender: 'Nam', email: 'nam.tv@techcorp.edu.vn', phone: '0912.001.001', gpa: 3.87, cpa: 3.85, credits: 95, rank: 'XUẤT SẮC', role_desc: 'Lớp trưởng' },
  { id: 2, code: '261IT002', name: 'Nguyễn Thị Mai', birth_date: '20/11/2004', gender: 'Nữ', email: 'mai.nt@techcorp.edu.vn', phone: '0912.001.002', gpa: 3.82, cpa: 3.80, credits: 95, rank: 'XUẤT SẮC', role_desc: 'Bí thư Chi đoàn' },
  { id: 3, code: '261IT003', name: 'Lê Hoàng Long', birth_date: '02/05/2004', gender: 'Nam', email: 'long.lh@techcorp.edu.vn', phone: '0912.001.003', gpa: 3.35, cpa: 3.20, credits: 95, rank: 'GIỎI', role_desc: 'Lớp phó Học tập' },
  { id: 4, code: '261IT004', name: 'Phạm Quỳnh Như', birth_date: '18/07/2004', gender: 'Nữ', email: 'nhu.pq@techcorp.edu.vn', phone: '0912.001.004', gpa: 3.55, cpa: 3.50, credits: 92, rank: 'GIỎI', role_desc: 'Thành viên' },
  { id: 5, code: '261IT005', name: 'Vũ Hải Đăng', birth_date: '10/10/2004', gender: 'Nam', email: 'dang.vh@techcorp.edu.vn', phone: '0912.001.005', gpa: 1.95, cpa: 1.90, credits: 72, rank: 'CẢNH BÁO HỌC VỤ 1', role_desc: 'Thành viên (Cảnh báo vắng học)' },
  { id: 6, code: '261IT006', name: 'Hoàng Gia Bảo', birth_date: '12/03/2004', gender: 'Nam', email: 'bao.hg@techcorp.edu.vn', phone: '0912.001.006', gpa: 3.45, cpa: 3.40, credits: 92, rank: 'GIỎI', role_desc: 'Thành viên' },
  { id: 7, code: '261IT007', name: 'Đỗ Phương Thảo', birth_date: '25/09/2004', gender: 'Nữ', email: 'thao.dp@techcorp.edu.vn', phone: '0912.001.007', gpa: 3.75, cpa: 3.70, credits: 95, rank: 'XUẤT SẮC', role_desc: 'Thành viên' },
  { id: 8, code: '261IT008', name: 'Bùi Anh Tuấn', birth_date: '08/01/2004', gender: 'Nam', email: 'tuan.ba@techcorp.edu.vn', phone: '0912.001.008', gpa: 2.95, cpa: 2.90, credits: 88, rank: 'KHÁ', role_desc: 'Thành viên' },
  { id: 9, code: '261IT009', name: 'Ngô Minh Châu', birth_date: '14/06/2004', gender: 'Nữ', email: 'chau.nm@techcorp.edu.vn', phone: '0912.001.009', gpa: 3.65, cpa: 3.60, credits: 95, rank: 'GIỎI', role_desc: 'Thành viên' },
  { id: 10, code: '261IT010', name: 'Đặng Quốc Huy', birth_date: '30/12/2004', gender: 'Nam', email: 'huy.dq@techcorp.edu.vn', phone: '0912.001.010', gpa: 2.68, cpa: 2.65, credits: 85, rank: 'TRUNG BÌNH', role_desc: 'Thành viên' }
];

// Danh sách Cán bộ coi thi & Giảng viên phụ trách
const PROCTORS_DATA = [
  { code: 'GV001', username: 'em.hd', name: 'TS. Hoàng Đức Em', gender: 'Nam', title: 'Tiến sĩ', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', department: 'Bộ môn Kỹ thuật Phần mềm', email: 'em.hd@techcorp.edu.vn', phone: '0912.345.678', spec: 'Kỹ thuật Phần mềm & Kiến trúc Hệ thống Phân tán', role: 'teacher' },
  { code: 'GV002', username: 'anh.cq', name: 'ThS. Chu Quỳnh Anh', gender: 'Nữ', title: 'Thạc sĩ', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', department: 'Bộ môn Kỹ thuật Phần mềm', email: 'anh.cq@techcorp.edu.vn', phone: '0912.345.679', spec: 'Lập trình Hướng đối tượng & Công nghệ Web', role: 'teacher' },
  { code: 'GV003', username: 'dang.lh', name: 'TS. Lê Hải Đăng', gender: 'Nam', title: 'Tiến sĩ', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin', department: 'Bộ môn Hệ thống Thông tin & CSDL', email: 'dang.lh@techcorp.edu.vn', phone: '0912.345.680', spec: 'Hệ Quản trị Cơ sở Dữ liệu & Big Data', role: 'teacher' },
  { code: 'GV004', username: 'huong.pt', name: 'TS. Phạm Thu Hương', gender: 'Nữ', title: 'Tiến sĩ', faculty_id: 'NN', faculty_name: 'Khoa Ngoại Ngữ & Đào tạo Chung', department: 'Bộ môn Tiếng Anh Chuyên ngành', email: 'huong.pt@techcorp.edu.vn', phone: '0912.345.681', spec: 'Ngôn ngữ học Ứng dụng & Tiếng Anh Học thuật', role: 'teacher' },
  { code: 'GV005', username: 'ha.ntt', name: 'ThS. Nguyễn Thị Thu Hà', gender: 'Nữ', title: 'Thạc sĩ', faculty_id: 'NN', faculty_name: 'Khoa Ngoại Ngữ & Đào tạo Chung', department: 'Bộ môn Tiếng Anh Học thuật', email: 'ha.ntt@techcorp.edu.vn', phone: '0912.345.682', spec: 'Phương pháp Giảng dạy Tiếng Anh (TESOL)', role: 'teacher' },
  { code: 'GV006', username: 'binh.tv', name: 'TS. Trần Văn Bình', gender: 'Nam', title: 'Tiến sĩ', faculty_id: 'CNTT', faculty_name: 'Khoa Công Nghệ Thông Tin & Cơ Bản', department: 'Bộ môn Toán Ứng dụng', email: 'binh.tv@techcorp.edu.vn', phone: '0912.345.683', spec: 'Giải tích Toán học & Phương pháp Tính', role: 'teacher' },
  { code: 'CB001', username: 'kien.bt', name: 'ThS. Bùi Trung Kiên', gender: 'Nam', title: 'Thạc sĩ', faculty_id: 'KTDBCL', faculty_name: 'Phòng Khảo thí & Đảm bảo Chất lượng Giáo dục', department: 'Ban Tổ chức Thi & Khảo thí', email: 'kien.bt@techcorp.edu.vn', phone: '0912.345.684', spec: 'Đo lường & Đánh giá trong Giáo dục', role: 'proctor' }
];

// 4 môn của Lớp 66.CNTT-1
const SECTIONS_CONFIG = [
  {
    section_id: 1,
    course_id: 6,
    course_code: 'IT101',
    course_name: 'Nhập môn Lập trình C/C++',
    lecturer: 'TS. Hoàng Đức Em',
    credits: 4,
    room: 'P.401 (Nhà A3)',
    bankKey: 'it101'
  },
  {
    section_id: 2,
    course_id: 7,
    course_code: 'IT201',
    course_name: 'Cơ sở Dữ liệu (Database Systems)',
    lecturer: 'TS. Hoàng Đức Em',
    credits: 3,
    room: 'P.402 (Nhà A3)',
    bankKey: 'it201'
  },
  {
    section_id: 3,
    course_id: 8,
    course_code: 'ENG101',
    course_name: 'Tiếng Anh Học Thuật 1 (General English B1)',
    lecturer: 'TS. Phạm Thu Hương',
    credits: 3,
    room: 'P.301 (Nhà C)',
    bankKey: 'eng101'
  },
  {
    section_id: 4,
    course_id: 9,
    course_code: 'MAT101',
    course_name: 'Giải Tích 1 (Toán Cao Cấp 1)',
    lecturer: 'TS. Trần Văn Bình',
    credits: 3,
    room: 'Giảng đường A3-101',
    bankKey: 'mat101'
  }
];

// ==============================================================================
// 1. NỘI DUNG BÀI GIẢNG SỐ KATEX & CODE BLOCKS CHUYÊN SÂU CHO TỪNG MÔN
// ==============================================================================
const RICH_LECTURES = {
  1: [ // IT101
    {
      week_number: 10,
      title: 'Bài Giảng Số: Quản Lý Bộ Nhớ Động, Con Trỏ C++ & Giải Phóng Vùng Nhớ Heap',
      content: `# KỸ THUẬT QUẢN LÝ BỘ NHỚ ĐỘNG VÀ CON TRỎ NÂNG CAO TRONG C/C++
*Giảng viên phụ trách: TS. Hoàng Đức Em - Khoa Công Nghệ Thông Tin*
*Mục tiêu chuẩn đầu ra CLO3: Sinh viên hiểu rõ cơ chế cấp phát bộ nhớ động, tính toán địa chỉ con trỏ và phòng chống Memory Leak.*

---

## 1. Kiến Trúc Phân Vùng Bộ Nhớ Trong Hệ Thống (Memory Layout)

Khi một chương trình C++ được hệ điều hành nạp vào RAM, không gian địa chỉ ảo (Virtual Address Space) được chia thành 4 phân vùng chính:

1. **Stack Segment**: Chứa các biến cục bộ (Local variables), tham số hàm và địa chỉ trả về của Stack Frame. Quản lý tự động theo cơ chế LIFO.
2. **Heap Segment**: Vùng nhớ dùng cho cấp phát động tại thời điểm thực thi (Runtime). Do lập trình viên chủ động cấp phát và giải phóng.
3. **Data / BSS Segment**: Chứa biến toàn cục (Global) và biến tĩnh (Static).
4. **Code / Text Segment**: Chứa mã máy nhị phân thực thi của chương trình.

### Mô hình địa chỉ bộ nhớ Stack vs Heap:

$$\\text{Low Memory: 0x00000000} \\longrightarrow [\\text{Text}] \\longrightarrow [\\text{Data}] \\longrightarrow [\\text{Heap } \\Downarrow] \\dots [\\text{Stack } \\Uparrow] \\longrightarrow \\text{High Memory: 0xFFFFFFFF}$$

---

## 2. Số Học Con Trỏ (Pointer Arithmetic)

Khi thực hiện phép toán cộng/trừ một số nguyên $i$ với một con trỏ kiểu $T*$:

$$\\text{Address}(p + i) = \\text{Address}(p) + i \\times \\text{sizeof}(T)$$

*Ví dụ:* Nếu kiểu \`int\` chiếm 4 bytes ($\\text{sizeof}(int) = 4$) và con trỏ $p = \\text{0x7ffee4b60000}$:

$$(p + 3) = \\text{0x7ffee4b60000} + 3 \\times 4 = \\text{0x7ffee4b6000C}$$

---

## 3. Cài Đặt Thực Nghiệm Trong C++ Hiện Đại

\`\`\`cpp
#include <iostream>
#include <memory>

class DynamicArray {
private:
    int* data;
    size_t capacity;

public:
    DynamicArray(size_t size) : capacity(size) {
        data = new int[capacity]; // Cấp phát trên Heap
        std::cout << "[ALLOC] Đã cấp phát " << capacity * sizeof(int) << " bytes tại " << data << std::endl;
    }

    ~DynamicArray() {
        delete[] data; // Giải phóng chống rò rỉ RAM (Memory Leak)
        std::cout << "[DEALLOC] Đã thu hồi bộ nhớ Heap thành công!" << std::endl;
    }

    void setValue(size_t index, int value) {
        if (index < capacity) {
            *(data + index) = value; // Số học con trỏ tương đương data[index]
        }
    }

    int getValue(size_t index) const {
        return (index < capacity) ? *(data + index) : -1;
    }
};

int main() {
    DynamicArray arr(1024);
    arr.setValue(0, 100);
    arr.setValue(1, 200);
    std::cout << "Phần tử thứ 1: " << arr.getValue(1) << std::endl;
    return 0;
}
\`\`\`

---

## 4. Kiểm Soát Lỗi Rò Rỉ Vùng Nhớ (Memory Leak)
> [!IMPORTANT]
> Sinh viên BẮT BUỘC phải tuân thủ nguyên tắc: Mọi toán tử \`new\` phải có \`delete\` tương ứng, \`new[]\` phải có \`delete[]\`. Trước khi nộp bài tập lớn, hãy kiểm thử bằng công cụ Valgrind:
> \`valgrind --leak-check=full ./bai_tap_lon_it101\``
    },
    {
      week_number: 13,
      title: 'Bài Giảng Số: Cấu Trúc Dữ Liệu Danh Sách Liên Kết Đơn (Singly Linked List) & Kỹ Thuật Con Trỏ Cấp Hai',
      content: `# DANH SÁCH LIÊN KẾT ĐƠN (SINGLY LINKED LIST) VÀ CON TRỎ CẤP HAI
*Giảng viên: TS. Hoàng Đức Em - Khoa Công Nghệ Thông Tin*

---

## 1. Khái Niệm Cốt Lõi

Khác với mảng tĩnh có các phần tử nằm liên tiếp nhau trong bộ nhớ, **Danh sách liên kết đơn** là tập hợp các nút (Nodes) được phân bố rải rác trên vùng nhớ Heap, trong đó mỗi nút chứa:
- Trường dữ liệu (Data Payload)
- Con trỏ trỏ tới nút kế tiếp (Pointer to Next Node)

$$\\text{Head} \\longrightarrow [\\text{Data}_1 \\mid \\text{Next}] \\longrightarrow [\\text{Data}_2 \\mid \\text{Next}] \\longrightarrow [\\text{Data}_3 \\mid \\text{NULL}]$$

---

## 2. Độ Phức Tạp Thuật Toán (Time Complexity)

| Thao tác | Mảng tĩnh (Array) | Danh sách liên kết (Linked List) |
|---|---|---|
| Chèn vào đầu (Insert Head) | $\\mathcal{O}(n)$ | $\\mathcal{O}(1)$ |
| Xóa ở đầu (Delete Head) | $\\mathcal{O}(n)$ | $\\mathcal{O}(1)$ |
| Truy xuất theo chỉ số (Random Access) | $\\mathcal{O}(1)$ | $\\mathcal{O}(n)$ |
| Chèn/Xóa ở cuối (Insert/Delete Tail) | $\\mathcal{O}(1)$ nếu còn chỗ | $\\mathcal{O}(n)$ (hoặc $\\mathcal{O}(1)$ nếu có Tail Pointer) |

---

## 3. Cài Đặt Thuật Toán Chèn Bằng Con Trỏ Cấp Hai (\`Node**\`)

\`\`\`cpp
#include <iostream>

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

void insertAtHead(Node** headRef, int val) {
    Node* newNode = new Node(val);
    newNode->next = *headRef;
    *headRef = newNode;
}

void printList(Node* head) {
    Node* curr = head;
    while (curr != nullptr) {
        std::cout << curr->data << " -> ";
        curr = curr->next;
    }
    std::cout << "NULL" << std::endl;
}

void freeList(Node** headRef) {
    Node* curr = *headRef;
    while (curr != nullptr) {
        Node* temp = curr;
        curr = curr->next;
        delete temp;
    }
    *headRef = nullptr;
}
\`\`\``
    }
  ],

  2: [ // IT201
    {
      week_number: 2,
      title: 'Bài Giảng Số: Lý Thuyết Đại Số Quan Hệ (Relational Algebra) & Tối Ưu Hóa Cây Truy Vấn SQL',
      content: `# ĐẠI SỐ QUAN HỆ (RELATIONAL ALGEBRA) VÀ TỐI ƯU HÓA TRUY VẤN
*Giảng viên phụ trách: TS. Hoàng Đức Em - Khoa Công Nghệ Thông Tin*
*Mục tiêu chuẩn đầu ra CLO2: Nắm vững các phép toán đại số quan hệ và kỹ thuật tối ưu hóa cây truy vấn (Query Tree).*

---

## 1. Hệ Thống Các Phép Toán Đại Số Quan Hệ Cơ Bản

Đại số quan hệ là nền tảng toán học của ngôn ngữ SQL chuẩn ISO/IEC 9075:

### 1.1. Phép Chọn (Selection - $\\sigma$)
Lọc các bộ (tuples) trong quan hệ $R$ thỏa mãn biểu thức điều kiện logic $\\varphi$:
$$\\sigma_{\\varphi}(R) = \\{ t \\in R \\mid \\varphi(t) = \\text{true} \\}$$
*Ví dụ:* $\\sigma_{\\text{DiemTB} \\ge 8.0}(\\text{SINH\\_VIEN})$ tương đương \`SELECT * FROM SINH_VIEN WHERE DiemTB >= 8.0;\`

### 1.2. Phép Chiếu (Projection - $\\pi$)
Chọn ra các thuộc tính quan tâm $A_1, A_2, \\dots, A_k$ từ quan hệ $R$ và tự động loại bỏ các bộ trùng lặp:
$$\\pi_{A_1, A_2, \\dots, A_k}(R) = \\{ t[A_1, \\dots, A_k] \\mid t \\in R \\}$$

### 1.3. Phép Kết Nối Tự Nhiên (Natural Join - $\\bowtie$)
Kết nối các quan hệ trên tập thuộc tính chung và loại bỏ cột trùng:
$$R \\bowtie S = \\pi_{R \\cup S}(\\sigma_{R.A_1 = S.A_1 \\land \\dots \\land R.A_m = S.A_m}(R \\times S))$$

### 1.4. Phép Chia (Division - $\\div$)
Tìm các bộ trong $R(X, Y)$ có liên kết với TẤT CẢ các bộ trong $S(Y)$:
$$R \\div S = \\pi_X(R) - \\pi_X((\\pi_X(R) \\times S) - R)$$

---

## 2. Quy Tắc Tương Đương & Biến Đổi Cây Truy Vấn (Heuristic Query Optimization)

Trong hệ quản trị cơ sở dữ liệu (MySQL / PostgreSQL / Oracle), Optimizer thực hiện biến đổi cây truy vấn để tối thiểu hóa chi phí I/O đĩa:

$$\\sigma_{\\varphi}(R \\bowtie S) \\equiv (\\sigma_{\\varphi}(R)) \\bowtie S \\quad \\text{(Đẩy phép chọn xuống trước phép kết nối)}$$

$$\\pi_{A}(R \\bowtie S) \\equiv \\pi_A((\\pi_{A \\cap \\text{Attr}(R)}(R)) \\bowtie (\\pi_{A \\cap \\text{Attr}(S)}(S))) \\quad \\text{(Đẩy phép chiếu xuống)}$$

> [!TIP]
> Việc đẩy $\\sigma$ và $\\pi$ xuống gần các nút lá giúp giảm kích thước các bảng trung gian (Intermediate Relations) từ hàng triệu dòng xuống còn vài trăm dòng trước khi thực hiện phép Join tốn kém!

---

## 3. Câu Lệnh SQL Minh Họa Chuẩn

\`\`\`sql
-- Truy vấn tìm sinh viên Khoa CNTT có điểm rèn luyện >= 90
EXPLAIN ANALYZE
SELECT sv.student_code, sv.full_name, k.faculty_name
FROM academic_students sv
JOIN academic_faculties k ON sv.faculty_id = k.id
WHERE sv.conduct_score >= 90 AND k.code = 'CNTT';
\`\`\``
    },
    {
      week_number: 10,
      title: 'Bài Giảng Số: Lý Thuyết Chuẩn Hóa Cơ Sở Dữ Liệu (1NF, 2NF, 3NF, BCNF) & Bài Toán Phụ Thuộc Hàm',
      content: `# LÝ THUYẾT CHUẨN HÓA CƠ SỞ DỮ LIỆU & PHỤ THUỘC HÀM
*Giảng viên: TS. Hoàng Đức Em - Khoa Công Nghệ Thông Tin*

---

## 1. Phụ Thuộc Hàm (Functional Dependency - FD)

Cho lược đồ quan hệ $R(U)$ với tập thuộc tính $U$. Gọi $X, Y \\subseteq U$. Ta nói $X$ xác định hàm $Y$ (kí hiệu $X \\to Y$) nếu:
$$\\forall t_1, t_2 \\in R: t_1[X] = t_2[X] \\implies t_1[Y] = t_2[Y]$$

### Hệ Tiên Đề Armstrong:
1. **Phản xạ (Reflexivity):** Nếu $Y \\subseteq X$ thì $X \\to Y$.
2. **Tăng trưởng (Augmentation):** Nếu $X \\to Y$ thì $XZ \\to YZ$.
3. **Bắc cầu (Transitivity):** Nếu $X \\to Y$ và $Y \\to Z$ thì $X \\to Z$.

---

## 2. Các Cấp Độ Chuẩn Hóa Dữ Liệu (Normalization Forms)

### 2.1. Dạng Chuẩn 1 (1NF - First Normal Form)
- Mọi thuộc tính đều là giá trị nguyên tố (Atomic Values). Không chứa thuộc tính đa trị hoặc thuộc tính phức hợp.

### 2.2. Dạng Chuẩn 2 (2NF - Second Normal Form)
- Đạt 1NF.
- Mọi thuộc tính không khóa đều phụ thuộc đầy đủ vào khóa chính (Không phụ thuộc vào một phần của khóa chính ghép):
$$\\forall A \\notin \\text{Key}, \\forall X \\subsetneq \\text{CandidateKey}: X \\not\\to A$$

### 2.3. Dạng Chuẩn 3 (3NF - Third Normal Form)
- Đạt 2NF.
- Không tồn tại phụ thuộc hàm bắc cầu từ khóa chính tới thuộc tính không khóa:
$$\\forall X \\to A: (X \\text{ là siêu khóa}) \\lor (A \\text{ là thuộc tính khóa})$$

### 2.4. Dạng Chuẩn Boyce-Codd (BCNF)
- Mọi phụ thuộc hàm $X \\to A$ không tầm thường thì $X$ BẮT BUỘC phải là Siêu Khóa (Superkey):
$$\\forall X \\to A, A \\notin X \\implies X \\text{ is a Superkey}$$`
    }
  ],

  3: [ // ENG101
    {
      week_number: 3,
      title: 'Academic Lecture: Paragraph Architecture & Cohesion in Computing Research Essays',
      content: `# ACADEMIC PARAGRAPH ARCHITECTURE & COHESIVE DEVICES
*Instructor: Dr. Pham Thu Huong - Faculty of Foreign Languages*
*Course Learning Outcome (CLO2): Construct logically coherent, empirically supported academic paragraphs for computer science reports.*

---

## 1. The MEAL Framework for Technical Writing

Academic writing requires rigorous structural discipline. Every analytical body paragraph must adhere to the **MEAL** model:

1. **M - Main Idea (Topic Sentence):** States the central claim or hypothesis clearly.
2. **E - Evidence & Concrete Data:** Provides empirical benchmarks, algorithmic metrics, or scholarly citations.
3. **A - Analysis & Critical Evaluation:** Deconstructs why the evidence validates the assertion and explores caveats.
4. **L - Link back & Synthesis:** Reconnects with the overarching thesis and bridges to the subsequent discussion.

---

## 2. Advanced Cohesive Markers for Software Engineering Discourse

| Discourse Function | Ineffective / Colloquial | Academic & Formal Alternative |
|---|---|---|
| Contrast | *But, Anyway* | *Nevertheless, Conversely, In stark contrast to* |
| Causal Inference | *So, Because of that* | *Consequently, Hence, It plausibly follows that* |
| Exemplification | *Like, For example* | *As evidenced by, To substantiate this contention* |
| Concession | *Although, Even if* | *Albeit, Acknowledging the inherent computational overhead* |

---

## 3. Exemplary Model Paragraph (CEFR B2-C1 Level)

> **[M]** The deployment of microservices architecture inherently exacerbates inter-service network latency compared to monolithic deployments. **[E]** Empirical benchmarking conducted by Newman (2025) demonstrates that remote procedure calls (gRPC) over TLS introduce an average latency penalty of $\\Delta t = 4.2\\text{ ms}$ per traversal hop. **[A]** While container orchestration frameworks mitigate localized throughput bottlenecks, cumulative communication overhead across deep call graphs significantly degrades tail latency ($P_{99}$). **[L]** Therefore, distributed caching strategies and asynchronous event streaming must be integrated to sustain real-time responsiveness.`
    },
    {
      week_number: 11,
      title: 'Academic Lecture: Technical Data Commentary & Quantitative Graph Description',
      content: `# TECHNICAL DATA COMMENTARY & QUANTITATIVE GRAPH DESCRIPTION
*Instructor: Dr. Pham Thu Huong - Faculty of Foreign Languages*

---

## 1. Statistical Framework for Technical Descriptions

When commenting on visual diagrams, system throughput, or benchmarking plots in technical publications, researchers employ formal statistical formulations:

$$\\text{Confidence Interval: } CI = \\bar{x} \\pm z^* \\cdot \\frac{s}{\\sqrt{n}}$$

$$\\text{Relative Degradation Rate: } \\delta = \\frac{T_{\\text{peak}} - T_{\\text{baseline}}}{T_{\\text{baseline}}} \\times 100\\%$$

---

## 2. Linguistic Precision in Describing Data Trends

### Describing Upward Trends:
- *To witness an exponential surge* (Tăng vọt theo hàm mũ)
- *To climb steadily and reach a plateau at 10,000 req/sec* (Tăng đều và đạt trạng thái bão hòa)

### Describing Fluctuations & Variances:
- *To exhibit marginal fluctuations around the baseline median*
- *The error rate remained virtually negligible ($< 0.05\\%$)*

---

## 3. Checklist for Academic Graph Commentary
1. **Overview Sentence:** Identify what the graph depicts, including axes and metrics (e.g., *Figure 4 illustrates throughput measured in transactions per second versus concurrency levels*).
2. **Key Trend Identification:** Highlight significant trends, crossovers, and anomaly points.
3. **Quantitative Data Citation:** Quote specific numerical values from the graph with exact units.
4. **Interpretive Deduction:** Explain the underlying architectural causes of observed phenomena.`
    }
  ],

  4: [ // MAT101
    {
      week_number: 1,
      title: 'Bài Giảng Số: Giới Hạn Hàm Số, Khử Dạng Vô Định & Quy Tắc L\'Hôpital Nâng Cao',
      content: `# ĐỊNH LÝ GIỚI HẠN HÀM SỐ, CÁC DẠNG VÔ ĐỊNH VÀ QUY TẮC L'HÔPITAL
*Giảng viên: TS. Trần Văn Bình - Bộ môn Toán & Cơ bản*
*Mục tiêu chuẩn đầu ra CLO1: Vận dụng thành thạo các giới hạn cơ bản, quy tắc L'Hôpital và phương pháp khai triển Taylor để giải quyết bài toán giới hạn phức tạp trong kỹ thuật.*

---

## 1. Các Giới Hạn Cơ Bản và Vô Cùng Bé Tương Đương

Khi $x \\to 0$, ta có các hệ thức tương đương kinh điển:

$$\\sin x \\sim x, \\quad \\tan x \\sim x, \\quad \\arcsin x \\sim x, \\quad \\arctan x \\sim x$$

$$\\ln(1 + x) \\sim x, \\quad e^x - 1 \\sim x, \\quad 1 - \\cos x \\sim \\frac{x^2}{2}, \\quad (1 + x)^\\alpha - 1 \\sim \\alpha x$$

### Hai giới hạn cơ bản quan trọng:
$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\qquad \\text{và} \\qquad \\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e$$

---

## 2. Định Lý L'Hôpital Cho Dạng Vô Định $\\left[\\frac{0}{0}\\right]$ và $\\left[\\frac{\\infty}{\\infty}\\right]$

Giả sử $f(x)$ và $g(x)$ khả vi trong lân cận của $a$ (có thể $a = \\pm\\infty$) và $g'(x) \\neq 0$. Nếu:
$$\\lim_{x \\to a} f(x) = \\lim_{x \\to a} g(x) = 0 \\quad \\text{hoặc} \\quad \\lim_{x \\to a} |f(x)| = \\lim_{x \\to a} |g(x)| = \\infty$$

Khi đó, nếu tồn tại giới hạn $\\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$ (hữu hạn hoặc vô cực) thì:
$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$

---

## 3. Khai Triển Maclaurin Giải Giới Hạn Vô Định

Khi áp dụng L'Hôpital gặp đạo hàm quá cồng kềnh, sử dụng khai triển Maclaurin với phần dư Peano là phương pháp tối ưu:

$$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots + \\frac{x^n}{n!} + o(x^n)$$

$$\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} + \\dots + (-1)^k \\frac{x^{2k}}{(2k)!} + o(x^{2k})$$

### Bài toán mẫu:
Tính giới hạn:
$$L = \\lim_{x \\to 0} \\frac{e^x - \\cos x - x}{x^2}$$

*Lời giải:*
Thay khai triển cấp 2:
$$e^x = 1 + x + \\frac{x^2}{2} + o(x^2), \\qquad \\cos x = 1 - \\frac{x^2}{2} + o(x^2)$$
$$L = \\lim_{x \\to 0} \\frac{\\left(1 + x + \\frac{x^2}{2}\\right) - \\left(1 - \\frac{x^2}{2}\\right) - x + o(x^2)}{x^2} = \\lim_{x \\to 0} \\frac{x^2 + o(x^2)}{x^2} = 1$$`
    },
    {
      week_number: 7,
      title: 'Bài Giảng Số: Kỹ Thuật Tích Phân Từng Phần & Tích Phân Suy Rộng (Improper Integrals)',
      content: `# KỸ THUẬT TÍCH PHÂN TỪNG PHẦN VÀ TÍCH PHÂN SUY RỘNG
*Giảng viên: TS. Trần Văn Bình - Bộ môn Toán & Cơ bản*

---

## 1. Công Thức Tích Phân Từng Phần

$$\\int u(x) \\cdot v'(x) \\, dx = u(x) v(x) - \\int v(x) \\cdot u'(x) \\, dx$$

Viết dưới dạng vi phân:
$$\\int u \\, dv = uv - \\int v \\, du$$

### Thứ tự ưu tiên đặt hàm $u$:
$$\\text{Nhất Lô} (\\ln x) \\longrightarrow \\text{Nhì Đa} (P(x)) \\longrightarrow \\text{Tam Lượng} (\\sin, \\cos) \\longrightarrow \\text{Tứ Mũ} (e^x, a^x)$$

---

## 2. Tích Phân Suy Rộng Loại 1 (Khoảng Lấy Tích Phân Vô Hạn)

Định nghĩa tích phân trên khoảng $[a, +\\infty)$:
$$\\int_a^{+\\infty} f(x) \\, dx = \\lim_{M \\to +\\infty} \\int_a^M f(x) \\, dx$$

### Tiêu chuẩn hội tụ của p-integral:
$$\\int_1^{+\\infty} \\frac{1}{x^p} \\, dx = \\begin{cases} \\text{Hội tụ về } \\frac{1}{p - 1} & \\text{nếu } p > 1 \\\\ \\text{Phân kỳ} & \\text{nếu } p \\le 1 \\end{cases}$$

---

## 3. Tích Phân Gauss Kinh Điển (Ứng Dụng Trong Khoa Học Dữ Liệu & AI)

Trong lý thuyết xác suất và giải thuật phân phối chuẩn (Gaussian Normal Distribution):
$$I = \\int_{-\\infty}^{+\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}$$

Hàm mật độ phân phối chuẩn một chiều:
$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}} \\implies \\int_{-\\infty}^{+\\infty} f(x) \\, dx = 1$$`
    }
  ]
};

// ==============================================================================
// 2. DANH SÁCH 8 BÀI TẬP LỚN KÈM RUBRICS 4 TIÊU CHÍ (2 BÀI / MÔN)
// ==============================================================================
const ASSIGNMENTS_DATA = {
  1: [ // IT101
    {
      title: 'Bài Tập Lớn 01: Xây Dựng Hệ Thống Quản Lý Thư Viện Sinh Viên Bằng C++ (Struct & File I/O)',
      description: 'Sinh viên xây dựng chương trình quản lý sách và mượn trả tài liệu học tập bằng ngôn ngữ C++. Yêu cầu sử dụng mảng cấu trúc struct, đọc/ghi tệp nhị phân (.dat), tìm kiếm nhị phân và chuẩn hóa chuỗi tiếng Việt.',
      due_date: new Date(Date.now() + 86400000 * 14),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Tính đúng đắn của giải thuật & Chức năng hệ thống', weight: 40, max_points: 4.0, description: 'Đầy đủ chức năng CRUD sách, mượn trả, phân loại và lưu trữ bền vững vào tệp tin.' },
        { name: 'Kiến trúc mã nguồn & Quy chuẩn Clean Code', weight: 25, max_points: 2.5, description: 'Phân tách module header/cpp rõ ràng, đặt tên biến chuẩn camelCase/snake_case, chú thích đầy đủ.' },
        { name: 'Kiểm soát ca biên & Quản lý bộ nhớ an toàn', weight: 20, max_points: 2.0, description: 'Xử lý lỗi tệp không tồn tại, tràn mảng, dữ liệu nhập không hợp lệ, không có memory leak.' },
        { name: 'Báo cáo thuyết minh kỹ thuật & Video Demo', weight: 15, max_points: 1.5, description: 'Báo cáo định dạng PDF chuẩn IEEE/TCU, sơ đồ luồng dữ liệu DFD và video quay quá trình kiểm thử.' }
      ]
    },
    {
      title: 'Bài Tập Lớn 02: Thiết Kế & Cài Đặt Thư Viện Danh Sách Liên Kết Tự Tối Ưu Hóa Bộ Nhớ (OOP C++)',
      description: 'Xây dựng cấu trúc dữ liệu danh sách liên kết đơn tổng quát (Template Singly Linked List) hỗ trợ con trỏ cấp hai, sắp xếp Merge Sort trên Linked List và quản lý giải phóng bộ nhớ tự động tuân thủ nguyên tắc RAII.',
      due_date: new Date(Date.now() + 86400000 * 35),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Cài đặt chính xác các thuật toán thao tác danh sách', weight: 40, max_points: 4.0, description: 'Chèn, xóa, đảo ngược danh sách trong O(n), sắp xếp Merge Sort O(n log n).' },
        { name: 'Tính tổng quát (Template Class) & Tuân thủ RAII', weight: 25, max_points: 2.5, description: 'Sử dụng C++ Templates, Constructor, Destructor và Copy Constructor chống Shallow Copy.' },
        { name: 'Kiểm thử Memory Leak với Valgrind', weight: 20, max_points: 2.0, description: 'Báo cáo Valgrind đạt 0 errors from 0 contexts, 0 bytes in 0 blocks definitively lost.' },
        { name: 'Tài liệu hướng dẫn sử dụng API & Unit Test', weight: 15, max_points: 1.5, description: 'Mã kiểm thử tự động (Assert test cases) và tài liệu Markdown hướng dẫn tích hợp.' }
      ]
    }
  ],

  2: [ // IT201
    {
      title: 'Bài Tập Lớn 01: Thiết Kế Lược Đồ CSDL Quan Hệ & Chuẩn Hóa BCNF Cho Sàn Thương Mại Điện Tử',
      description: 'Khảo sát bài toán Sàn E-Commerce (Khách hàng, Gian hàng, Đơn hàng, Vận chuyển, Thanh toán). Thiết kế mô hình ERD chi tiết, chuyển đổi sang lược đồ quan hệ, chứng minh đạt chuẩn BCNF và viết script DDL MySQL.',
      due_date: new Date(Date.now() + 86400000 * 12),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Mô hình hóa ERD & Ràng buộc toàn vẹn', weight: 35, max_points: 3.5, description: 'Mô hình đầy đủ thực thể, thuộc tính, mối quan hệ 1-1, 1-N, N-N, khóa chính, khóa ngoại.' },
        { name: 'Chứng minh lý thuyết Chuẩn hóa BCNF', weight: 30, max_points: 3.0, description: 'Liệt kê tập phụ thuộc hàm, tính bao đóng, chứng minh mọi determinant đều là siêu khóa.' },
        { name: 'Script SQL DDL & Dữ liệu mẫu (Seed Data)', weight: 20, max_points: 2.0, description: 'Tạo bảng, ràng buộc CHECK, FOREIGN KEY CASCADE, chỉ mục INDEX và nạp ít nhất 20 dòng/bảng.' },
        { name: 'Thuyết minh thiết kế & Giải trình tối ưu', weight: 15, max_points: 1.5, description: 'Báo cáo kỹ thuật phân tích các quyết định thiết kế để loại bỏ dị thường cập nhật.' }
      ]
    },
    {
      title: 'Bài Tập Lớn 02: Lập Trình Stored Procedures, Triggers & Tối Ưu Hóa Chỉ Mục B-Tree Trên CSDL',
      description: 'Cài đặt nghiệp vụ thanh toán tự động, cập nhật tồn kho bằng Stored Procedures và Triggers. Phân tích chi phí truy vấn bằng lệnh EXPLAIN ANALYZE và tối ưu hóa hiệu năng bằng chỉ mục phức hợp B-Tree.',
      due_date: new Date(Date.now() + 86400000 * 30),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Cài đặt Stored Procedures & Transaction ACID', weight: 35, max_points: 3.5, description: 'Đảm bảo giao dịch Commit/Rollback an toàn khi có lỗi thiếu hàng hoặc lỗi thanh toán.' },
        { name: 'Hệ thống Triggers kiểm soát nghiệp vụ thời gian thực', weight: 25, max_points: 2.5, description: 'Trigger ghi log kiểm toán (Audit Trail) và trigger kiểm tra điều kiện giảm giá tự động.' },
        { name: 'Tối ưu hóa chỉ mục B-Tree & Phân tích Query Cost', weight: 25, max_points: 2.5, description: 'So sánh chỉ số chi phí trước và sau khi đánh Composite Index, loại bỏ Full Table Scan.' },
        { name: 'Báo cáo thực nghiệm hiệu năng (Benchmarking)', weight: 15, max_points: 1.5, description: 'Biểu đồ trực quan so sánh thời gian thực thi (Latency) khi xử lý 100,000 bản ghi.' }
      ]
    }
  ],

  3: [ // ENG101
    {
      title: 'Assignment 01: Academic Critical Review - Ethical Implications of Generative AI in Computing',
      description: 'Write a 1,500-word academic analytical essay evaluating the ethical dilemmas, intellectual property concerns, and labor market impacts of LLMs in software engineering. Adhere strictly to APA 7th edition referencing.',
      due_date: new Date(Date.now() + 86400000 * 10),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Content & Critical Depth of Evaluation', weight: 35, max_points: 3.5, description: 'Demonstrates sophisticated analysis of technological implications beyond superficial claims.' },
        { name: 'Academic Style, AWL Vocabulary & Syntax', weight: 25, max_points: 2.5, description: 'Proficient usage of Academic Word List (AWL), passive constructions, and varied sentence structures.' },
        { name: 'Structural Cohesion (MEAL) & Transitions', weight: 20, max_points: 2.0, description: 'Logical flow between paragraphs using advanced cohesive linkers and clear topic sentences.' },
        { name: 'APA 7th Referencing & Plagiarism Integrity', weight: 20, max_points: 2.0, description: 'At least 5 peer-reviewed sources accurately cited with Turnitin similarity index below 10%.' }
      ]
    },
    {
      title: 'Assignment 02: Technical Presentation & Written Abstract - Cloud Migration Case Study',
      description: 'Deliver an individual 8-minute recorded academic presentation accompanying a 300-word structured executive abstract outlining a cloud migration strategy for legacy enterprise banking systems.',
      due_date: new Date(Date.now() + 86400000 * 28),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Executive Abstract Construction & Clarity', weight: 30, max_points: 3.0, description: 'Concise background, methodology, empirical findings, and actionable recommendations in 300 words.' },
        { name: 'Oral Delivery, Pronunciation & Fluency', weight: 30, max_points: 3.0, description: 'Clear articulation, appropriate pausing, confidence, and minimal hesitation.' },
        { name: 'Slide Design & Quantitative Data Commentary', weight: 25, max_points: 2.5, description: 'Professional minimalist slides with accurate linguistic commentary on cloud cost charts.' },
        { name: 'Technical Accuracy & Strategic Defense', weight: 15, max_points: 1.5, description: 'Demonstrates thorough grasp of hybrid-cloud architectures and disaster recovery SLAs.' }
      ]
    }
  ],

  4: [ // MAT101
    {
      title: 'Bài Tập Lớn 01: Ứng Dụng Khai Triển Taylor-Maclaurin & Đạo Hàm Trong Bài Toán Tối Ưu Hóa Kỹ Thuật',
      description: 'Sinh viên vận dụng công thức Maclaurin của các hàm số sơ cấp để xấp xỉ giá trị, đánh giá sai số phần dư Lagrange, và giải quyết bài toán tìm cực trị có điều kiện trong mô hình hóa kỹ thuật phần mềm.',
      due_date: new Date(Date.now() + 86400000 * 11),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Tính toán chính xác các khai triển Maclaurin bậc cao', weight: 35, max_points: 3.5, description: 'Tìm đúng khai triển đến bậc n, biểu diễn chính xác phần dư Peano và Lagrange.' },
        { name: 'Đánh giá sai số xấp xỉ & Ứng dụng số học', weight: 25, max_points: 2.5, description: 'Chứng minh biên độ sai số tuyệt đối không vượt quá epsilon cho trước.' },
        { name: 'Giải bài toán tối ưu hóa kỹ thuật (Optimization)', weight: 25, max_points: 2.5, description: 'Thiết lập hàm mục tiêu, khảo sát đạo hàm cấp 1 và cấp 2 để kết luận điểm cực đại/cực tiểu.' },
        { name: 'Trình bày toán học chuẩn LaTeX & Lập luận chặt chẽ', weight: 15, max_points: 1.5, description: 'Báo cáo định dạng PDF xuất từ LaTeX, công thức rõ ràng, mạch lạc, lập luận logic.' }
      ]
    },
    {
      title: 'Bài Tập Lớn 02: Mô Hình Hóa Phương Trình Vi Phân Bậc 1 Và Bậc 2 Trong Phân Tích Mạch Tín Hiệu RLC',
      description: 'Thiết lập phương trình vi phân mô tả dao động điện từ trong mạch RLC nối tiếp. Giải bài toán Cauchy tìm nghiệm riêng ứng với điều kiện đầu cho trước và vẽ đồ thị đáp ứng quá độ của điện áp.',
      due_date: new Date(Date.now() + 86400000 * 32),
      max_score: 10.0,
      rubric_criteria: [
        { name: 'Thiết lập mô hình toán học từ định luật Kirchhoff', weight: 30, max_points: 3.0, description: 'Dẫn xuất đúng phương trình vi phân tuyến tính cấp 2 hệ số hằng từ hiện tượng vật lý.' },
        { name: 'Phương pháp giải giải tích & Nghiệm bài toán Cauchy', weight: 35, max_points: 3.5, description: 'Giải phương trình đặc trưng (các trường hợp delta âm, dương, kép) và xác định đúng hằng số C1, C2.' },
        { name: 'Phân tích đồ thị đáp ứng dao động (Overdamped, Underdamped)', weight: 20, max_points: 2.0, description: 'Đồ thị biểu diễn chính xác các chế độ suy giảm dao động theo thời gian.' },
        { name: 'Báo cáo thuyết minh chuẩn học thuật & Ứng dụng thực tiễn', weight: 15, max_points: 1.5, description: 'Phân tích liên hệ giữa nghiệm vi phân và xử lý tín hiệu số trong kỹ thuật máy tính.' }
      ]
    }
  ]
};

// ==============================================================================
// MAIN SEEDER FUNCTION
// ==============================================================================
async function runFullSeed() {
  console.log('\n=============================================================================');
  console.log('🚀 MASTER SEEDER: NẠP DỮ LIỆU ĐẦY ĐỦ 4 MÔN HỌC CHO LỚP 66.CNTT-1 (KHOA CNTT)');
  console.log('=============================================================================\n');

  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Gỡ bỏ các ràng buộc khóa ngoại cũ tham chiếu tới bảng không tồn tại (như academic_courses, employees)
    try {
      await sequelize.query('ALTER TABLE academic_exam_schedules DROP FOREIGN KEY academic_exam_schedules_ibfk_2;');
      console.log('  -> Đã gỡ bỏ ràng buộc academic_exam_schedules_ibfk_2');
    } catch (e) {}
    try {
      await sequelize.query('ALTER TABLE academic_exam_schedules DROP FOREIGN KEY academic_exam_schedules_ibfk_1;');
    } catch (e) {}
    try {
      await sequelize.query('ALTER TABLE courses DROP FOREIGN KEY courses_ibfk_1;');
    } catch (e) {}

    // -------------------------------------------------------------------------
    // BƯỚC 0: ĐỒNG BỘ 10 SINH VIÊN LỚP 66.CNTT-1 & HỘI ĐỒNG CÁN BỘ COI THI
    // -------------------------------------------------------------------------
    console.log('--- BƯỚC 0: ĐỒNG BỘ 10 SINH VIÊN LỚP 66.CNTT-1 & HỘI ĐỒNG CÁN BỘ COI THI ---');
    const defaultPasswordHash = '$2b$10$7ZalmpS3TnKHWrV6HcCEJ.nCKMnl.p0MXbnEJyS7BHZITl3C3EpYa';

    // 0.1 Nạp 10 sinh viên vào USERS và ACADEMIC_STUDENTS
    for (const stu of STUDENTS_66CNTT1) {
      // 1. users table
      const [uRows] = await sequelize.query(`SELECT id FROM users WHERE username = '${stu.code}' OR email = '${stu.email}' LIMIT 1`);
      if (uRows && uRows[0]) {
        await sequelize.query(`
          UPDATE users 
          SET full_name = '${stu.name.replace(/'/g, "''")}', email = '${stu.email}', student_code = '${stu.code}',
              class_name = '66.CNTT-1', faculty_id = 'CNTT', faculty_name = 'Khoa Công Nghệ Thông Tin',
              major_id = '7480103', major_name = 'Kỹ thuật Phần mềm', cohort = 'K66', phone = '${stu.phone}',
              role = 'student', status = '${stu.code === '261IT005' ? 'ACADEMIC_WARNING_1' : 'ACTIVE'}', updated_at = NOW()
          WHERE id = ${uRows[0].id}
        `);
      } else {
        await sequelize.query(`
          INSERT INTO users (
            username, email, password, full_name, role, student_code, class_name,
            faculty_id, faculty_name, major_id, major_name, cohort, phone, status, created_at, updated_at
          ) VALUES (
            '${stu.code}', '${stu.email}', '${defaultPasswordHash}', '${stu.name.replace(/'/g, "''")}', 'student',
            '${stu.code}', '66.CNTT-1', 'CNTT', 'Khoa Công Nghệ Thông Tin', '7480103', 'Kỹ thuật Phần mềm', 'K66',
            '${stu.phone}', '${stu.code === '261IT005' ? 'ACADEMIC_WARNING_1' : 'ACTIVE'}', NOW(), NOW()
          )
        `);
      }

      // 2. academic_students table
      const [stdRows] = await sequelize.query(`SELECT id FROM academic_students WHERE student_code = '${stu.code}' LIMIT 1`);
      const stdStatus = (stu.code === '261IT005' ? 'ACADEMIC_WARNING_1' : 'ACTIVE');
      if (stdRows && stdRows[0]) {
        await sequelize.query(`
          UPDATE academic_students
          SET full_name = '${stu.name.replace(/'/g, "''")}', birth_date = '${stu.birth_date}', gender = '${stu.gender}',
              email = '${stu.email}', phone = '${stu.phone}', gpa = ${stu.gpa}, cpa = ${stu.cpa}, credits_accumulated = ${stu.credits},
              academic_rank = '${stu.rank}', status = '${stdStatus}', advisor = 'TS. Hoàng Đức Em', updated_at = NOW()
          WHERE id = ${stdRows[0].id}
        `);
      } else {
        await sequelize.query(`
          INSERT INTO academic_students (
            student_code, full_name, birth_date, gender, faculty_id, faculty_name,
            major_id, major_name, cohort, class_name, email, phone, gpa, cpa,
            credits_accumulated, academic_rank, status, training_system, advisor, created_at, updated_at
          ) VALUES (
            '${stu.code}', '${stu.name.replace(/'/g, "''")}', '${stu.birth_date}', '${stu.gender}', 'CNTT', 'Khoa Công Nghệ Thông Tin',
            '7480103', 'Kỹ thuật Phần mềm', 'K66', '66.CNTT-1', '${stu.email}', '${stu.phone}', ${stu.gpa}, ${stu.cpa},
            ${stu.credits}, '${stu.rank}', '${stdStatus}', 'Đại học Chính quy (Tín chỉ TT 08/2021)', 'TS. Hoàng Đức Em', NOW(), NOW()
          )
        `);
      }
    }
    console.log('  ✅ Đã đồng bộ đầy đủ 10 sinh viên Lớp 66.CNTT-1 vào USERS và ACADEMIC_STUDENTS!');

    // 0.2 Nạp Cán bộ coi thi & Giảng viên
    for (const pr of PROCTORS_DATA) {
      // 1. users table
      const [puRows] = await sequelize.query(`SELECT id FROM users WHERE username = '${pr.username}' OR email = '${pr.email}' LIMIT 1`);
      if (puRows && puRows[0]) {
        await sequelize.query(`
          UPDATE users 
          SET full_name = '${pr.name.replace(/'/g, "''")}', email = '${pr.email}', role = '${pr.role}',
              faculty_id = '${pr.faculty_id}', faculty_name = '${pr.faculty_name.replace(/'/g, "''")}',
              department = '${pr.department.replace(/'/g, "''")}', title = '${pr.title}', phone = '${pr.phone}', updated_at = NOW()
          WHERE id = ${puRows[0].id}
        `);
      } else {
        await sequelize.query(`
          INSERT INTO users (
            username, email, password, full_name, role, faculty_id, faculty_name,
            department, title, phone, status, created_at, updated_at
          ) VALUES (
            '${pr.username}', '${pr.email}', '${defaultPasswordHash}', '${pr.name.replace(/'/g, "''")}', '${pr.role}',
            '${pr.faculty_id}', '${pr.faculty_name.replace(/'/g, "''")}', '${pr.department.replace(/'/g, "''")}',
            '${pr.title}', '${pr.phone}', 'ACTIVE', NOW(), NOW()
          )
        `);
      }

      // 2. academic_lecturers table
      const [lecRows] = await sequelize.query(`SELECT id FROM academic_lecturers WHERE code = '${pr.code}' OR email = '${pr.email}' LIMIT 1`);
      if (lecRows && lecRows[0]) {
        await sequelize.query(`
          UPDATE academic_lecturers
          SET full_name = '${pr.name.replace(/'/g, "''")}', gender = '${pr.gender}', title = '${pr.title}',
              faculty_id = '${pr.faculty_id}', faculty_name = '${pr.faculty_name.replace(/'/g, "''")}',
              department = '${pr.department.replace(/'/g, "''")}', email = '${pr.email}', phone = '${pr.phone}',
              specialization = '${pr.spec.replace(/'/g, "''")}', updated_at = NOW()
          WHERE id = ${lecRows[0].id}
        `);
      } else {
        await sequelize.query(`
          INSERT INTO academic_lecturers (
            code, username, full_name, gender, birth_date, title, academic_rank,
            faculty_id, faculty_name, department, email, phone, specialization, experience_years, status, created_at, updated_at
          ) VALUES (
            '${pr.code}', '${pr.username}', '${pr.name.replace(/'/g, "''")}', '${pr.gender}', '15/08/1982', '${pr.title}', 'Không',
            '${pr.faculty_id}', '${pr.faculty_name.replace(/'/g, "''")}', '${pr.department.replace(/'/g, "''")}',
            '${pr.email}', '${pr.phone}', '${pr.spec.replace(/'/g, "''")}', 12, 'Đang công tác', NOW(), NOW()
          )
        `);
      }
    }
    console.log('  ✅ Đã đồng bộ Hội đồng Cán bộ coi thi & Giảng viên vào USERS và ACADEMIC_LECTURERS!');

    // -------------------------------------------------------------------------
    // BƯỚC 1: XỬ LÝ KHUNG CHƯƠNG TRÌNH 15 TUẦN & HỌC LIỆU BỀN VỮNG (JSON + MYSQL)
    // -------------------------------------------------------------------------
    console.log('--- BƯỚC 1: CẬP NHẬT ĐỀ CƯƠNG 15 TUẦN & BÀI GIẢNG SỐ KATEX ---');
    const curriculumStoreFile = path.resolve(__dirname, '../data/lms_curriculum_store.json');
    let curriculumStore = {};
    if (fs.existsSync(curriculumStoreFile)) {
      try {
        curriculumStore = JSON.parse(fs.readFileSync(curriculumStoreFile, 'utf8'));
      } catch (e) {
        curriculumStore = {};
      }
    }

    // Đảm bảo 4 môn của Lớp 66.CNTT-1 có đủ 15 tuần học chuẩn
    for (const sec of SECTIONS_CONFIG) {
      const sIdStr = String(sec.section_id);
      console.log(`  -> Tạo/Cập nhật 15 tuần học cho Section ${sec.section_id} (${sec.course_code} - ${sec.course_name})...`);
      
      // Khởi tạo 15 tuần chuẩn
      curriculumStore[sIdStr] = generateStandard15Weeks(sec.course_code, sec.section_id);

      // Bổ sung các bài giảng số KaTeX chuyên sâu vào tuần tương ứng
      const richList = RICH_LECTURES[sec.section_id] || [];
      for (const rl of richList) {
        const targetModule = curriculumStore[sIdStr].find(m => m.week_number === rl.week_number);
        if (targetModule) {
          if (!targetModule.materials) targetModule.materials = [];
          
          // Kiểm tra xem đã có bài giảng Rich Text này chưa
          const existingIdx = targetModule.materials.findIndex(m => m.material_type === 'RICH_TEXT' && m.title.includes(rl.title.substring(0, 20)));
          const matObj = {
            id: Number(sec.section_id) * 100000 + rl.week_number * 10 + 5,
            module_id: targetModule.id,
            section_id: sec.section_id,
            title: rl.title,
            material_type: 'RICH_TEXT',
            category: 'MAIN_TEXTBOOK',
            external_source: 'TCU Academic Publishing',
            rich_content: rl.content,
            file_size_mb: 1.2,
            suggested_time_minutes: 60,
            duration_mins: 60,
            is_completed: false
          };

          if (existingIdx !== -1) {
            targetModule.materials[existingIdx] = { ...targetModule.materials[existingIdx], ...matObj };
          } else {
            targetModule.materials.push(matObj);
          }
        }
      }

      // Nạp câu hỏi thực thụ từ ExamBank vào các tuần Quiz
      const courseBank = examBank.COURSE_BANKS ? examBank.COURSE_BANKS.find(b => b.course && b.course.code === sec.course_code) : null;
      if (courseBank && courseBank.root_1) {
        curriculumStore[sIdStr].forEach((mod, wIdx) => {
          if (mod.quizzes && mod.quizzes.length > 0) {
            const quiz = mod.quizzes[0];
            // Lấy 5 câu hỏi từ ngân hàng phân bổ cho tuần này
            const startQ = (wIdx * 2) % (courseBank.root_1.length - 5);
            const selectedQs = courseBank.root_1.slice(startQ, startQ + 5);
            
            quiz.questions = selectedQs.map((q, qIdx) => ({
              id: Number(sec.section_id) * 1000000 + mod.week_number * 100 + qIdx + 1,
              question_text: q.content,
              content: q.content,
              options: q.answers.map(a => a.content),
              correct_answer: ['A', 'B', 'C', 'D'][q.answers.findIndex(a => a.is_correct)] || 'A',
              explanation: `Căn cứ chuẩn đầu ra CLO: Mức độ nhận thức ${q.difficulty}. Đề thi chuẩn hóa TCU COMPASS LMS.`,
              bloom_level: q.difficulty === 'EASY' ? 'Nhận biết' : q.difficulty === 'MEDIUM' ? 'Thông hiểu' : q.difficulty === 'HARD' ? 'Vận dụng' : 'Vận dụng cao',
              score: 2.0
            }));
            quiz.passing_score = 5.0;
            quiz.passing_score_pct = 70;
            quiz.time_limit_minutes = 15;
          }
        });
      }
    }

    // Ghi đĩa file lms_curriculum_store.json
    fs.writeFileSync(curriculumStoreFile, JSON.stringify(curriculumStore, null, 2), 'utf8');
    console.log('  ✅ Đã lưu cấu trúc 15 tuần học và bài giảng KaTeX vào backend/data/lms_curriculum_store.json!');

    // Đồng bộ vào bảng MySQL academic_materials
    console.log('\n--- BƯỚC 2: ĐỒNG BỘ HỌC LIỆU VÀO BẢNG MYSQL ACADEMIC_MATERIALS ---');
    await AcademicMaterial.sync().catch(() => {});
    let totalMaterialsCount = 0;

    for (const sec of SECTIONS_CONFIG) {
      const sIdStr = String(sec.section_id);
      const modules = curriculumStore[sIdStr] || [];

      for (const mod of modules) {
        const mats = mod.materials || [];
        for (let idx = 0; idx < mats.length; idx++) {
          const mat = mats[idx];
          const matId = mat.id || (Number(sec.section_id) * 10000 + mod.week_number * 10 + idx + 1);

          let existing = await AcademicMaterial.findByPk(matId);
          const matData = {
            id: matId,
            section_id: sec.section_id,
            module_id: mod.id || (Number(sec.section_id) * 1000 + mod.week_number),
            title: mat.title || 'Học liệu bài giảng số',
            material_type: mat.material_type || 'DOCUMENT',
            category: mat.category || 'MAIN_TEXTBOOK',
            url: mat.file_url || null,
            file_path: mat.file_url || null,
            file_size: `${mat.file_size_mb || 4.5} MB`,
            rich_content: mat.rich_content || null,
            duration_mins: mat.duration_mins || 45,
            is_mandatory: true,
            is_published: true,
            release_date: new Date(),
            anti_skipping: mat.material_type === 'VIDEO',
            min_completion_pct: 80,
            sort_order: idx + 1
          };

          if (existing) {
            await existing.update(matData);
          } else {
            await AcademicMaterial.create(matData);
          }
          totalMaterialsCount++;
        }
      }
    }
    console.log(`  ✅ Đã đồng bộ thành công ${totalMaterialsCount} học liệu vào bảng MySQL academic_materials!`);

    // -------------------------------------------------------------------------
    // BƯỚC 3: BÀI TẬP TỰ LUẬN, RUBRICS & BÀI NỘP SINH VIÊN DEMO
    // -------------------------------------------------------------------------
    console.log('\n--- BƯỚC 3: NẠP BÀI TẬP TỰ LUẬN, TIÊU CHÍ RUBRICS & BÀI NỘP MẪU ---');
    await AcademicAssignment.sync().catch(() => {});
    await AcademicAssignmentSubmission.sync().catch(() => {});

    let totalAssignmentsCreated = 0;
    let totalSubmissionsCreated = 0;

    for (const sec of SECTIONS_CONFIG) {
      const assignList = ASSIGNMENTS_DATA[sec.section_id] || [];

      for (let i = 0; i < assignList.length; i++) {
        const item = assignList[i];
        
        // Tìm hoặc tạo bài tập
        let assignment = await AcademicAssignment.findOne({
          where: { section_id: sec.section_id, title: item.title }
        });

        const assignData = {
          section_id: sec.section_id,
          module_id: Number(sec.section_id) * 1000 + (i === 0 ? 8 : 14),
          title: item.title,
          description: item.description,
          due_date: item.due_date,
          max_score: item.max_score,
          allowed_file_types: '.pdf,.zip,.docx,.cpp,.py,.sql',
          max_file_size_mb: 50,
          rubric_criteria: item.rubric_criteria,
          status: 'PUBLISHED',
          created_by: 1
        };

        if (assignment) {
          await assignment.update(assignData);
        } else {
          assignment = await AcademicAssignment.create(assignData);
        }
        totalAssignmentsCreated++;

        // Tạo bài nộp mẫu cho sinh viên Lớp 66.CNTT-1
        // Bài tập 1: Đã nộp và đã được giảng viên chấm điểm chi tiết kèm lời phê
        // Bài tập 2: Đang làm / Đã nộp
        for (const stu of STUDENTS_66CNTT1) {
          const isGraded = (i === 0); // Bài 1 đã chấm
          let score = null;
          let rubricScores = null;
          let feedback = null;
          let status = 'SUBMITTED';

          if (isGraded) {
            status = 'GRADED';
            if (stu.code === '261IT001') { // Trần Văn Nam - SV xuất sắc (Lớp trưởng)
              score = 9.5;
              rubricScores = {
                'Tính đúng đắn của giải thuật & Chức năng hệ thống': 3.8,
                'Kiến trúc mã nguồn & Quy chuẩn Clean Code': 2.5,
                'Kiểm soát ca biên & Quản lý bộ nhớ an toàn': 1.9,
                'Báo cáo thuyết minh kỹ thuật & Video Demo': 1.3,
                'Content & Critical Depth of Evaluation': 3.4,
                'Academic Style, AWL Vocabulary & Syntax': 2.4,
                'Structural Cohesion (MEAL) & Transitions': 1.9,
                'APA 7th Referencing & Plagiarism Integrity': 1.8,
                'Mô hình hóa ERD & Ràng buộc toàn vẹn': 3.4,
                'Chứng minh lý thuyết Chuẩn hóa BCNF': 2.9,
                'Script SQL DDL & Dữ liệu mẫu (Seed Data)': 1.9,
                'Thuyết minh thiết kế & Giải trình tối ưu': 1.3,
                'Tính toán chính xác các khai triển Maclaurin bậc cao': 3.4,
                'Đánh giá sai số xấp xỉ & Ứng dụng số học': 2.4,
                'Giải bài toán tối ưu hóa kỹ thuật (Optimization)': 2.4,
                'Trình bày toán học chuẩn LaTeX & Lập luận chặt chẽ': 1.3
              };
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nBài làm của sinh viên ${stu.name} (${stu.code}) đạt chất lượng xuất sắc. Cấu trúc mã nguồn/bài viết mạch lạc, tuân thủ chặt chẽ yêu cầu đề bài. Các ca kiểm thử biên (Edge Cases) được xử lý toàn diện, không phát hiện lỗi rò rỉ vùng nhớ. Khuyến khích tiếp tục phát huy năng lực nghiên cứu!`;
            } else if (stu.code === '261IT002') { // Nguyễn Thị Mai - Xuất sắc (Bí thư)
              score = 9.6;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nLời giải mẫu mực, trình bày khoa học và lập luận sâu sắc. Đạt chuẩn đầu ra CLO tuyệt đối.`;
            } else if (stu.code === '261IT003') { // Lê Hoàng Long - Khá Giỏi
              score = 8.5;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nBài giải đúng hướng, giải thuật chạy ổn định. Cần tối ưu thêm việc giải phóng tài nguyên trong các trường hợp ngoại lệ.`;
            } else if (stu.code === '261IT004') { // Phạm Quỳnh Như - Giỏi
              score = 8.8;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nNội dung đầy đủ, kiểm thử cẩn thận. Báo cáo kỹ thuật trình bày đẹp, đúng định dạng.`;
            } else if (stu.code === '261IT005') { // Vũ Hải Đăng - Cảnh báo học vụ
              score = 4.5;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nBài làm còn thiếu nhiều ca kiểm thử quan trọng. Cần chủ động gặp Giảng viên tại phòng bộ môn trong giờ tiếp sinh viên để được hướng dẫn bổ sung kiến thức.`;
            } else if (stu.code === '261IT006') { // Hoàng Gia Bảo - Giỏi
              score = 8.5;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nCấu trúc thuật toán tốt, mã nguồn viết rõ ràng. Cần chú ý thêm phần phân tích độ phức tạp thời gian O(n).`;
            } else if (stu.code === '261IT007') { // Đỗ Phương Thảo - Xuất sắc
              score = 9.2;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nBài làm rất chỉn chu, tài liệu tham khảo phong phú và trình bày chuẩn học thuật. Hoàn thành xuất sắc các yêu cầu.`;
            } else if (stu.code === '261IT008') { // Bùi Anh Tuấn - Khá
              score = 7.5;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nĐáp ứng đầy đủ các yêu cầu cơ bản. Cần bổ sung thêm phần kiểm thử các trường hợp dữ liệu lớn.`;
            } else if (stu.code === '261IT009') { // Ngô Minh Châu - Giỏi
              score = 9.0;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nKhả năng phân tích tốt, giải thuật xử lý chính xác và trực quan. Tiếp tục duy trì phong độ.`;
            } else { // 261IT010 - Đặng Quốc Huy - Trung bình khá
              score = 6.8;
              feedback = `[ĐÁNH GIÁ SƯ PHẠM - ${sec.lecturer}]\nĐạt yêu cầu mức trung bình khá. Cần củng cố thêm kiến thức lý thuyết nền tảng và viết tài liệu hướng dẫn chi tiết hơn.`;
            }
          }

          let sub = await AcademicAssignmentSubmission.findOne({
            where: { assignment_id: assignment.id, student_code: stu.code }
          });

          const subData = {
            assignment_id: assignment.id,
            student_id: stu.id,
            student_code: stu.code,
            student_name: stu.name,
            class_name: '66.CNTT-1',
            submission_text: `Kính gửi thầy/cô ${sec.lecturer},\nEm xin phép nộp bài tập lớn "${item.title}".\nMã nguồn và báo cáo chi tiết được đính kèm trong tệp lưu trữ. Em đã hoàn thành việc tự kiểm thử toàn bộ các ca kiểm thử theo hướng dẫn trong đề cương.\n\nTrân trọng cảm ơn Thầy/Cô!`,
            attachment_url: `/api/uploads/assignments/${sec.course_code.toLowerCase()}_btl_${stu.code}.pdf`,
            attachment_name: `${sec.course_code}_BTL_${stu.code}_${stu.name.replace(/\s+/g, '_')}.pdf`,
            attachment_size: 2450000,
            submitted_at: new Date(Date.now() - 86400000 * (i === 0 ? 3 : 1)),
            status: status,
            score: score,
            rubric_scores: rubricScores,
            feedback: feedback,
            graded_by: sec.lecturer,
            graded_at: isGraded ? new Date(Date.now() - 86400000 * 2) : null
          };

          if (sub) {
            await sub.update(subData);
          } else {
            await AcademicAssignmentSubmission.create(subData);
          }
          totalSubmissionsCreated++;
        }
      }
    }
    console.log(`  ✅ Đã tạo ${totalAssignmentsCreated} bài tập tự luận lớn kèm Rubrics cho 4 môn!`);
    console.log(`  ✅ Đã nạp ${totalSubmissionsCreated} bài nộp mẫu kèm điểm chấm và lời phê sư phạm!`);

    // -------------------------------------------------------------------------
    // BƯỚC 4: ĐIỂM DANH 15 BUỔI HỌC (THEO THÔNG TƯ 08/2021/TT-BGDĐT)
    // -------------------------------------------------------------------------
    console.log('\n--- BƯỚC 4: KHỞI TẠO 15 BUỔI ĐIỂM DANH HỌC KỲ CHO CẢ 4 MÔN ---');
    await AcademicAttendanceSession.sync().catch(() => {});
    await AcademicAttendanceRecord.sync().catch(() => {});

    let totalAttendanceSessions = 0;
    let totalAttendanceRecords = 0;

    for (const sec of SECTIONS_CONFIG) {
      console.log(`  -> Tạo 15 buổi điểm danh cho Section ${sec.section_id} (${sec.course_code})...`);

      for (let sNum = 1; sNum <= 15; sNum++) {
        // Tính ngày buổi học: Mỗi tuần 1 buổi, bắt đầu từ ngày 01/09/2026
        const sessionDate = new Date(2026, 8, 1 + (sNum - 1) * 7);
        const dateStr = sessionDate.toISOString().split('T')[0];

        let session = await AcademicAttendanceSession.findOne({
          where: { section_id: sec.section_id, session_number: sNum }
        });

        const sessionData = {
          section_id: sec.section_id,
          session_number: sNum,
          session_date: dateStr,
          start_time: '07:30',
          end_time: '11:00',
          topic: `Buổi ${sNum}: Giảng dạy & Thực hành Tuần ${sNum} học phần ${sec.course_code}`,
          room: sec.room,
          status: 'CLOSED',
          qr_code_token: `ATTENDANCE_SEC${sec.section_id}_W${sNum}_${Math.random().toString(36).substring(7).toUpperCase()}`,
          total_present: 9,
          total_excused: 0,
          total_absent: ([4, 8, 11, 14].includes(sNum)) ? 1 : 0, // Vũ Hải Đăng vắng các buổi 4, 8, 11, 14
          total_late: 0
        };

        if (session) {
          await session.update(sessionData);
        } else {
          session = await AcademicAttendanceSession.create(sessionData);
        }
        totalAttendanceSessions++;

        // Điểm danh chi tiết 10 sinh viên
        for (const stu of STUDENTS_66CNTT1) {
          let attStatus = 'PRESENT';
          let note = 'Có mặt đúng giờ';

          if (stu.code === '261IT005') { // Vũ Hải Đăng - Vắng 4/15 buổi (26.7% > 20% -> Bị cấm thi theo Đ14 TT 08/2021)
            if ([4, 8, 11, 14].includes(sNum)) {
              attStatus = 'ABSENT';
              note = 'Vắng mặt không phép (Gắn cờ cảnh báo TT 08/2021)';
            }
          } else if (stu.code === '261IT003' && sNum === 6) { // Long có phép 1 buổi
            attStatus = 'EXCUSED';
            note = 'Có đơn xin phép tham gia hội thảo khoa học';
          } else if (stu.code === '261IT004' && sNum === 9) { // Như đi muộn 1 buổi
            attStatus = 'LATE';
            note = 'Đến muộn 15 phút do thời tiết';
          } else if (stu.code === '261IT006' && sNum === 5) { // Bảo có phép 1 buổi
            attStatus = 'EXCUSED';
            note = 'Nghỉ có phép đi khám sức khỏe';
          } else if (stu.code === '261IT008' && [7, 12].includes(sNum)) { // Tuấn có phép 2 buổi
            attStatus = 'EXCUSED';
            note = 'Có đơn xin phép tham gia công tác Đoàn Thanh niên';
          } else if (stu.code === '261IT010' && [3, 10].includes(sNum)) { // Huy có phép 2 buổi
            attStatus = 'EXCUSED';
            note = 'Có đơn xin nghỉ phép việc gia đình';
          } else if (stu.code === '261IT010' && sNum === 13) {
            attStatus = 'LATE';
            note = 'Đến muộn 10 phút';
          }

          let rec = await AcademicAttendanceRecord.findOne({
            where: { session_id: session.id, student_code: stu.code }
          });

          const recData = {
            session_id: session.id,
            student_id: stu.id,
            student_code: stu.code,
            student_name: stu.name,
            class_name: '66.CNTT-1',
            status: attStatus,
            checkin_time: new Date(sessionDate.getTime() + 7 * 3600000 + 35 * 60000),
            notes: note
          };

          if (rec) {
            await rec.update(recData);
          } else {
            await AcademicAttendanceRecord.create(recData);
          }
          totalAttendanceRecords++;
        }
      }
    }
    console.log(`  ✅ Đã tạo ${totalAttendanceSessions} buổi điểm danh (15 buổi x 4 môn)!`);
    console.log(`  ✅ Đã ghi nhận ${totalAttendanceRecords} lượt điểm danh sinh viên Lớp 66.CNTT-1!`);

    // -------------------------------------------------------------------------
    // BƯỚC 5: SỔ ĐIỂM HỌC PHẦN (ACADEMIC_SECTION_GRADES) CHUẨN BỘ GD&ĐT
    // -------------------------------------------------------------------------
    console.log('\n--- BƯỚC 5: NẠP SỔ ĐIỂM HỌC PHẦN 4 MÔN VÀO ACADEMIC_SECTION_GRADES ---');
    await AcademicSectionGrade.sync().catch(() => {});

    const GRADE_PRESETS = {
      1: [ // IT101
        { code: '261IT001', name: 'Trần Văn Nam', att: 9.5, btl: 9.0, gk: 9.0, ck: 9.5, s10: 9.35, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT002', name: 'Nguyễn Thị Mai', att: 10.0, btl: 9.5, gk: 9.5, ck: 9.0, s10: 9.30, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT003', name: 'Lê Hoàng Long', att: 8.5, btl: 8.0, gk: 8.0, ck: 8.5, s10: 8.35, let: 'B+', s4: 3.5, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT004', name: 'Phạm Quỳnh Như', att: 9.0, btl: 8.5, gk: 9.0, ck: 8.5, s10: 8.70, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT005', name: 'Vũ Hải Đăng', att: 4.5, btl: 4.0, gk: 5.0, ck: 4.0, s10: 4.35, let: 'D', s4: 1.0, res: 'ĐẠT (PASS)', rank: 'CẢNH BÁO HỌC VỤ 1' },
        { code: '261IT006', name: 'Hoàng Gia Bảo', att: 9.0, btl: 8.5, gk: 8.5, ck: 8.5, s10: 8.55, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT007', name: 'Đỗ Phương Thảo', att: 10.0, btl: 9.0, gk: 9.0, ck: 9.0, s10: 9.10, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT008', name: 'Bùi Anh Tuấn', att: 8.0, btl: 7.5, gk: 7.0, ck: 7.5, s10: 7.45, let: 'B', s4: 3.0, res: 'ĐẠT (PASS)', rank: 'KHÁ' },
        { code: '261IT009', name: 'Ngô Minh Châu', att: 9.5, btl: 9.0, gk: 8.5, ck: 9.0, s10: 8.95, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT010', name: 'Đặng Quốc Huy', att: 7.5, btl: 7.0, gk: 6.5, ck: 6.5, s10: 6.70, let: 'C+', s4: 2.5, res: 'ĐẠT (PASS)', rank: 'TRUNG BÌNH' }
      ],
      2: [ // IT201
        { code: '261IT001', name: 'Trần Văn Nam', att: 10.0, btl: 9.5, gk: 9.0, ck: 9.5, s10: 9.45, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT002', name: 'Nguyễn Thị Mai', att: 9.5, btl: 9.0, gk: 9.0, ck: 9.0, s10: 9.05, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT003', name: 'Lê Hoàng Long', att: 9.0, btl: 8.5, gk: 8.5, ck: 8.5, s10: 8.60, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT004', name: 'Phạm Quỳnh Như', att: 9.5, btl: 9.0, gk: 8.5, ck: 9.0, s10: 8.95, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT005', name: 'Vũ Hải Đăng', att: 5.0, btl: 5.5, gk: 4.5, ck: 5.0, s10: 5.00, let: 'D', s4: 1.0, res: 'ĐẠT (PASS)', rank: 'TRUNG BÌNH' },
        { code: '261IT006', name: 'Hoàng Gia Bảo', att: 9.0, btl: 8.5, gk: 8.0, ck: 8.5, s10: 8.45, let: 'B+', s4: 3.5, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT007', name: 'Đỗ Phương Thảo', att: 9.5, btl: 9.0, gk: 9.0, ck: 9.5, s10: 9.30, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT008', name: 'Bùi Anh Tuấn', att: 8.5, btl: 7.5, gk: 7.5, ck: 7.0, s10: 7.35, let: 'B', s4: 3.0, res: 'ĐẠT (PASS)', rank: 'KHÁ' },
        { code: '261IT009', name: 'Ngô Minh Châu', att: 9.5, btl: 9.0, gk: 9.0, ck: 9.0, s10: 9.05, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT010', name: 'Đặng Quốc Huy', att: 8.0, btl: 6.5, gk: 6.5, ck: 6.5, s10: 6.65, let: 'C+', s4: 2.5, res: 'ĐẠT (PASS)', rank: 'TRUNG BÌNH' }
      ],
      3: [ // ENG101
        { code: '261IT001', name: 'Trần Văn Nam', att: 9.5, btl: 9.0, gk: 8.5, ck: 9.0, s10: 8.95, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT002', name: 'Nguyễn Thị Mai', att: 10.0, btl: 9.5, gk: 9.5, ck: 9.5, s10: 9.60, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT003', name: 'Lê Hoàng Long', att: 8.5, btl: 8.0, gk: 8.0, ck: 8.0, s10: 8.10, let: 'B', s4: 3.0, res: 'ĐẠT (PASS)', rank: 'KHÁ' },
        { code: '261IT004', name: 'Phạm Quỳnh Như', att: 9.0, btl: 9.0, gk: 8.5, ck: 9.0, s10: 8.90, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT005', name: 'Vũ Hải Đăng', att: 4.0, btl: 4.0, gk: 4.5, ck: 4.0, s10: 4.15, let: 'D', s4: 1.0, res: 'ĐẠT (PASS)', rank: 'CẢNH BÁO HỌC VỤ 1' },
        { code: '261IT006', name: 'Hoàng Gia Bảo', att: 9.5, btl: 8.5, gk: 8.5, ck: 8.5, s10: 8.60, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT007', name: 'Đỗ Phương Thảo', att: 10.0, btl: 9.5, gk: 9.0, ck: 9.5, s10: 9.45, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT008', name: 'Bùi Anh Tuấn', att: 8.0, btl: 7.0, gk: 7.5, ck: 7.0, s10: 7.20, let: 'B', s4: 3.0, res: 'ĐẠT (PASS)', rank: 'KHÁ' },
        { code: '261IT009', name: 'Ngô Minh Châu', att: 10.0, btl: 9.0, gk: 9.5, ck: 9.0, s10: 9.20, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT010', name: 'Đặng Quốc Huy', att: 7.5, btl: 6.5, gk: 7.0, ck: 6.5, s10: 6.70, let: 'C+', s4: 2.5, res: 'ĐẠT (PASS)', rank: 'TRUNG BÌNH' }
      ],
      4: [ // MAT101
        { code: '261IT001', name: 'Trần Văn Nam', att: 9.0, btl: 9.0, gk: 9.0, ck: 9.0, s10: 9.00, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT002', name: 'Nguyễn Thị Mai', att: 10.0, btl: 9.0, gk: 9.5, ck: 9.0, s10: 9.25, let: 'A+', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT003', name: 'Lê Hoàng Long', att: 8.5, btl: 8.5, gk: 8.0, ck: 8.5, s10: 8.40, let: 'B+', s4: 3.5, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT004', name: 'Phạm Quỳnh Như', att: 9.0, btl: 8.5, gk: 8.5, ck: 8.5, s10: 8.60, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT005', name: 'Vũ Hải Đăng', att: 4.5, btl: 5.0, gk: 4.0, ck: 4.5, s10: 4.50, let: 'D', s4: 1.0, res: 'ĐẠT (PASS)', rank: 'CẢNH BÁO HỌC VỤ 1' },
        { code: '261IT006', name: 'Hoàng Gia Bảo', att: 8.5, btl: 8.0, gk: 8.5, ck: 8.0, s10: 8.15, let: 'B', s4: 3.0, res: 'ĐẠT (PASS)', rank: 'KHÁ' },
        { code: '261IT007', name: 'Đỗ Phương Thảo', att: 9.5, btl: 9.0, gk: 9.0, ck: 9.0, s10: 9.05, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'XUẤT SẮC' },
        { code: '261IT008', name: 'Bùi Anh Tuấn', att: 8.0, btl: 7.5, gk: 7.0, ck: 7.0, s10: 7.20, let: 'B', s4: 3.0, res: 'ĐẠT (PASS)', rank: 'KHÁ' },
        { code: '261IT009', name: 'Ngô Minh Châu', att: 9.0, btl: 8.5, gk: 8.5, ck: 9.0, s10: 8.80, let: 'A', s4: 4.0, res: 'ĐẠT (PASS)', rank: 'GIỎI' },
        { code: '261IT010', name: 'Đặng Quốc Huy', att: 7.5, btl: 6.5, gk: 6.0, ck: 6.5, s10: 6.50, let: 'C+', s4: 2.5, res: 'ĐẠT (PASS)', rank: 'TRUNG BÌNH' }
      ]
    };

    let totalGradesSeeded = 0;
    for (const sec of SECTIONS_CONFIG) {
      const presets = GRADE_PRESETS[sec.section_id] || [];
      for (const p of presets) {
        let rec = await AcademicSectionGrade.findOne({
          where: { section_id: sec.section_id, student_code: p.code }
        });

        const gradeData = {
          section_id: sec.section_id,
          student_id: STUDENTS_66CNTT1.find(s => s.code === p.code)?.id || 1,
          student_code: p.code,
          full_name: p.name,
          attendance_score: p.att,
          assignment_score: p.btl,
          midterm_score: p.gk,
          final_exam_score: p.ck,
          course_score_10: p.s10,
          course_score_letter: p.let,
          course_score_4: p.s4,
          course_result: p.res,
          academic_rank: p.rank,
          notes: p.code === '261IT005' ? 'Cảnh báo vắng học và điểm tích lũy thấp' : 'Đủ điều kiện xét học bổng'
        };

        if (rec) {
          await rec.update(gradeData);
        } else {
          await AcademicSectionGrade.create(gradeData);
        }
        totalGradesSeeded++;
      }
    }
    console.log(`  ✅ Đã nạp đầy đủ ${totalGradesSeeded} bản ghi điểm học phần cho 4 môn của Lớp 66.CNTT-1!`);

    // -------------------------------------------------------------------------
    // BƯỚC 6: ĐỀ THI KẾT THÚC HỌC PHẦN & LỊCH THI TRỰC TUYẾN
    // -------------------------------------------------------------------------
    console.log('\n--- BƯỚC 6: ĐỒNG BỘ LỊCH THI & CẤP QUYỀN PHÒNG THI ONLINE ---');

    const EXAM_SCHEDULES = [
      {
        section_id: 1,
        course_id: 6,
        course_code: 'IT101',
        course_name: 'Nhập môn Lập trình C/C++',
        exam_date: '2026-12-15',
        start_time: '08:00',
        end_time: '09:30',
        room: 'Phòng Máy Lab 401 (Nhà A3)',
        proctor_1: 'TS. Hoàng Đức Em',
        proctor_2: 'ThS. Chu Quỳnh Anh'
      },
      {
        section_id: 2,
        course_id: 7,
        course_code: 'IT201',
        course_name: 'Cơ sở Dữ liệu (Database Systems)',
        exam_date: '2026-12-18',
        start_time: '08:00',
        end_time: '09:30',
        room: 'Phòng Máy Lab 402 (Nhà A3)',
        proctor_1: 'TS. Hoàng Đức Em',
        proctor_2: 'TS. Lê Hải Đăng'
      },
      {
        section_id: 3,
        course_id: 8,
        course_code: 'ENG101',
        course_name: 'Tiếng Anh Học Thuật 1 (General English B1)',
        exam_date: '2026-12-22',
        start_time: '13:30',
        end_time: '15:00',
        room: 'Phòng Lab Ngoại Ngữ C301 (Nhà C)',
        proctor_1: 'TS. Phạm Thu Hương',
        proctor_2: 'ThS. Nguyễn Thị Thu Hà'
      },
      {
        section_id: 4,
        course_id: 9,
        course_code: 'MAT101',
        course_name: 'Giải Tích 1 (Toán Cao Cấp 1)',
        exam_date: '2026-12-26',
        start_time: '08:00',
        end_time: '09:30',
        room: 'Giảng đường A3-101',
        proctor_1: 'TS. Trần Văn Bình',
        proctor_2: 'ThS. Bùi Trung Kiên'
      }
    ];

    for (const sch of EXAM_SCHEDULES) {
      const [schedRows] = await sequelize.query(`SELECT id FROM academic_exam_schedules WHERE course_code = '${sch.course_code}' ORDER BY id DESC LIMIT 1`);
      let schedId = schedRows && schedRows[0] ? schedRows[0].id : null;

      if (!schedId) {
        const [insertRes] = await sequelize.query(`
          INSERT INTO academic_exam_schedules (
            course_id, course_code, course_name, exam_code, exam_name, exam_date, start_time, end_time,
            room_code, proctor_1, proctor_2, status, duration_minutes, faculty_name, major_name, notes, created_at, updated_at
          ) VALUES (
            ${sch.course_id}, '${sch.course_code}', '${sch.course_name.replace(/'/g, "''")}', 'EXAM-${sch.course_code}-66CNTT1', 'Thi Kết Thúc Học Phần: ${sch.course_name.replace(/'/g, "''")} (Lớp 66.CNTT-1)',
            '${sch.exam_date}', '${sch.start_time}:00', '${sch.end_time}:00',
            '${sch.room}', '${sch.proctor_1}', '${sch.proctor_2}', 'SCHEDULED',
            90, 'Khoa Công Nghệ Thông Tin', 'Kỹ thuật Phần mềm', 'AI Proctoring Webcam trực tiếp', NOW(), NOW()
          )
        `);
        schedId = insertRes;
      } else {
        await sequelize.query(`
          UPDATE academic_exam_schedules
          SET course_id = ${sch.course_id}, course_name = '${sch.course_name.replace(/'/g, "''")}',
              exam_name = 'Thi Kết Thúc Học Phần: ${sch.course_name.replace(/'/g, "''")} (Lớp 66.CNTT-1)',
              exam_date = '${sch.exam_date}', start_time = '${sch.start_time}:00', end_time = '${sch.end_time}:00',
              room_code = '${sch.room}', proctor_1 = '${sch.proctor_1}', proctor_2 = '${sch.proctor_2}',
              status = 'SCHEDULED', duration_minutes = 90, faculty_name = 'Khoa Công Nghệ Thông Tin',
              major_name = 'Kỹ thuật Phần mềm', notes = 'AI Proctoring Webcam trực tiếp', updated_at = NOW()
          WHERE id = ${schedId}
        `);
      }

      if (schedId) {
        // Cấp quyền cho toàn bộ 10 sinh viên Lớp 66.CNTT-1 tham gia thi
        for (const stu of STUDENTS_66CNTT1) {
          const isBarred = (stu.code === '261IT005'); // Vũ Hải Đăng vắng nhiều bị cấm thi
          const authStatus = isBarred ? 'DENIED' : 'GRANTED';
          const condPassed = isBarred ? 0 : 1;
          const notes = isBarred
            ? 'Cấm thi theo Điều 14 TT 08/2021 (Vắng 4/15 buổi = 26.7% > 20% số tiết học)'
            : 'Đủ điều kiện dự thi chuẩn Thông tư 08/2021/TT-BGDĐT';
          const seatNum = `SBD-66CNTT-${stu.id < 10 ? '0' + stu.id : stu.id}`;
          const attRate = isBarred ? 73.3 : (stu.id === 8 ? 86.7 : (stu.id === 10 ? 80.0 : 96.0));

          await sequelize.query(`DELETE FROM exam_candidate_authorizations WHERE schedule_id = ${schedId} AND (student_code = '${stu.code}' OR student_id = ${stu.id})`);
          await sequelize.query(`
            INSERT INTO exam_candidate_authorizations (
              schedule_id, student_id, student_code, student_name, class_name,
              seat_number, subject_code, subject_name, attendance_pct,
              tuition_cleared, condition_passed, authorization_status, authorized_by,
              authorized_at, notes, created_at, updated_at
            ) VALUES (
              ${schedId}, ${stu.id}, '${stu.code}', '${stu.name.replace(/'/g, "''")}', '66.CNTT-1',
              '${seatNum}', '${sch.course_code}', '${sch.course_name.replace(/'/g, "''")}', ${attRate},
              1, ${condPassed}, '${authStatus}', 'Hội đồng Khảo thí TCU',
              NOW(), '${notes}', NOW(), NOW()
            )
          `);
        }
      }
    }
    console.log('  ✅ Đã đồng bộ 4 ca thi kết thúc học phần & Cấp quyền phòng thi cho Lớp 66.CNTT-1!');

    // -------------------------------------------------------------------------
    // BƯỚC 6.1: ĐỒNG BỘ QUIZ ASSESSMENTS CHO CẢ SECTION ID 1, 2, 3, 4
    // -------------------------------------------------------------------------
    console.log('\n--- BƯỚC 6.1: ĐỒNG BỘ QUIZ TRẮC NGHIỆM CHO CẢ SECTION 1, 2, 3, 4 ---');
    for (const sec of SECTIONS_CONFIG) {
      let qz = await QuizAssessment.findOne({
        where: { course_id: sec.section_id, title: `Đề Thi Đánh Giá Quá Trình: ${sec.course_name} (${sec.course_code})` }
      });

      if (!qz) {
        qz = await QuizAssessment.create({
          course_id: sec.section_id,
          title: `Đề Thi Đánh Giá Quá Trình: ${sec.course_name} (${sec.course_code})`,
          description: `Đề thi trắc nghiệm khách quan chuẩn Bộ GD&ĐT 40 câu hỏi phân bổ Bloom cho học phần ${sec.course_code}.`,
          time_limit_minutes: 60,
          passing_score_pct: 70,
          max_attempts: 3,
          shuffle_questions: true,
          shuffle_options: true,
          show_explanation: true,
          status: 'active'
        });

        // Nạp 40 câu hỏi từ ngân hàng đề thi
        const bank = examBank.COURSE_BANKS.find(b => b.course && b.course.code === sec.course_code);
        if (bank && bank.root_1) {
          for (let i = 0; i < bank.root_1.length; i++) {
            const q = bank.root_1[i];
            const correctAnsLetter = ['A', 'B', 'C', 'D'][q.answers.findIndex(a => a.is_correct)] || 'A';
            const optionsJson = q.answers.map(a => a.content);

            await QuizQuestion.create({
              quiz_id: qz.id,
              course_id: sec.section_id,
              question_type: 'single_choice',
              question_text: q.content,
              options_json: optionsJson,
              correct_answer: correctAnsLetter,
              explanation: `Căn cứ chuẩn đầu ra ${q.clo || sec.course_code}: Mức độ nhận thức ${q.difficulty}.`,
              points: 0.25,
              sort_order: i + 1
            });
          }
        }
      }
    }
    console.log('  ✅ Đã đồng bộ bộ đề trắc nghiệm chuẩn Bộ 40 câu vào quiz_assessments cho các Section 1, 2, 3, 4!');

    // -------------------------------------------------------------------------
    // BƯỚC 7: NẠP BÀI LÀM QUIZ MẪU CỦA SINH VIÊN TRẦN VĂN NAM (261IT001)
    // -------------------------------------------------------------------------
    console.log('\n--- BƯỚC 7: NẠP LỊCH SỬ LÀM BÀI QUIZ MẪU CỦA SINH VIÊN DEMO ---');
    await QuizSubmission.sync().catch(() => {});

    // Lấy danh sách quiz_assessments hiện có
    const quizzes = await QuizAssessment.findAll({
      where: { course_id: [1, 2, 3, 4, 6, 7, 8, 9] }
    });

    for (const qz of quizzes) {
      let sub = await QuizSubmission.findOne({
        where: { quiz_id: qz.id, user_id: 1 }
      });

      const qzSubData = {
        quiz_id: qz.id,
        course_id: qz.course_id,
        user_id: 1, // Trần Văn Nam
        attempt_number: 1,
        score_achieved: 9.0,
        score_percentage: 90.0,
        is_passed: true,
        time_spent_seconds: 720,
        answers_detail: {
          total_questions: 40,
          correct_count: 36,
          wrong_count: 4,
          feedback: 'Sinh viên nắm rất vững các kiến thức nền tảng và vận dụng cao.'
        },
        submitted_at: new Date(Date.now() - 86400000 * 5)
      };

      if (sub) {
        await sub.update(qzSubData);
      } else {
        await QuizSubmission.create(qzSubData);
      }
    }
    console.log(`  ✅ Đã nạp bài làm mẫu QuizSubmission cho sinh viên demo trên ${quizzes.length} bài kiểm tra!`);

    console.log('\n=============================================================================');
    console.log('🎉🎉🎉 HOÀN TẤT NẠP DỮ LIỆU TOÀN DIỆN CHO LỚP 66.CNTT-1! 🎉🎉🎉');
    console.log('=============================================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ LỖI TRONG QUÁ TRÌNH SEED DỮ LIỆU:', err);
    process.exit(1);
  } finally {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;').catch(() => {});
  }
}

runFullSeed();
