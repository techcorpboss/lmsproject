// backend/services/semesterOperationalSeeder.js
// Dịch vụ nạp dữ liệu vận hành hoàn chỉnh cho Lớp 66.CNTT-1 - Học kỳ 1:
// 1. 4 Môn học chính khóa (IT101, IT201, ENG101, MAT101)
// 2. Bài giảng mẫu (mỗi môn ít nhất 3 bài với đầy đủ slide, video, tài liệu, bài tập)
// 3. Ngân hàng đề thi (mỗi môn 3 đề thi chuẩn hóa x 40 câu hỏi trắc nghiệm Bloom = 120 câu/môn)
// 4. Lịch thi kết thúc học phần & Cấp quyền phòng thi trực tuyến
'use strict';

const examBank = require('./examBank');
const {
  sequelize,
  Course,
  CourseSection,
  CourseLesson,
  QuizAssessment,
  QuizQuestion,
  AcademicExamSchedule,
  CurriculumCourse
} = require('../models');

class SemesterOperationalSeeder {
  constructor() {
    this.className = '66.CNTT-1';
    this.cohort = 'K66';
    this.semester = 'Học kỳ 1';
    this.academicYear = '2026-2027';
  }

  async runSeed() {
    console.log(`\n================================================================`);
    console.log(`🚀 BẮT ĐẦU NẠP DỮ LIỆU VẬN HÀNH: LỚP ${this.className} - ${this.semester}`);
    console.log(`================================================================\n`);

    try {
      // Tắt kiểm tra khóa ngoại để tránh lỗi tham chiếu tới bảng không tồn tại (vd: employees)
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

      // 1. Đảm bảo cấu trúc các bảng
      await this.ensureTableIntegrity();

      // 2. Nạp/Cập nhật 4 Môn học chính khóa vào bảng courses & curriculum_courses
      const courses = await this.seedCourses();

      // 3. Nạp các lớp học phần và bài giảng mẫu (>= 3 bài/môn)
      await this.seedSampleLessons(courses);

      // 4. Nạp Ngân hàng Đề thi (mỗi môn 3 đề x 40 câu = 120 câu) vào MySQL
      await this.seedExamPapersAndQuestions();

      // 5. Lên lịch thi kết thúc học phần cho lớp 66.CNTT-1
      await this.seedExamSchedules();

      // 6. Đồng bộ bài thi vào quiz_assessments để thi online trực tiếp
      await this.syncToOnlineQuizRooms();

      console.log(`\n================================================================`);
      console.log(`✅ NẠP DỮ LIỆU VẬN HÀNH THÀNH CÔNG CHO LỚP ${this.className}!`);
      console.log(`================================================================\n`);

      return {
        success: true,
        class_name: this.className,
        semester: this.semester,
        courses_count: courses.length,
        lessons_per_course: 3,
        exams_per_course: 3,
        questions_per_exam: 40
      };
    } catch (err) {
      console.error('[OperationalSeeder Error]:', err);
      throw err;
    } finally {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;').catch(() => {});
    }
  }

  async ensureTableIntegrity() {
    // 0. Gỡ bỏ ràng buộc foreign key trỏ đến bảng không tồn tại nếu có
    try {
      await sequelize.query('ALTER TABLE courses DROP FOREIGN KEY courses_ibfk_1;');
      console.log('  -> Đã gỡ bỏ ràng buộc courses_ibfk_1 tham chiếu employees');
    } catch (e) {
      // Đã gỡ hoặc không tồn tại
    }

    // 1. Thêm cột updated_at vào courses nếu chưa có
    try {
      const [cols] = await sequelize.query('DESCRIBE courses');
      const hasUpdatedAt = cols.some(c => c.Field === 'updated_at');
      if (!hasUpdatedAt) {
        await sequelize.query(`
          ALTER TABLE courses ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
        `);
        console.log('  -> Đã bổ sung cột updated_at vào bảng courses');
      }
    } catch (e) {
      console.warn('  -> Kiểm tra cột updated_at:', e.message);
    }
  }

  async seedCourses() {
    console.log('📌 1. Nạp danh mục 4 Môn học chính khóa cho Lớp 66.CNTT-1...');
    const courseDefs = [
      {
        course_code: 'IT101',
        course_name: 'Nhập môn Lập trình C/C++',
        description: 'Học phần nền tảng rèn luyện tư duy thuật toán, cấu trúc điều khiển, mảng, con trỏ, quản lý bộ nhớ RAM và kỹ thuật lập trình nâng cao.',
        credit_hours: 4,
        duration_hours: 60,
        category: 'Chuyên môn nghiệp vụ'
      },
      {
        course_code: 'IT201',
        course_name: 'Cơ sở Dữ liệu (Database Systems)',
        description: 'Hệ thống hóa mô hình dữ liệu quan hệ, thiết kế lược đồ ER/EER, đại số quan hệ, ngôn ngữ SQL và chuẩn hóa dữ liệu 3NF/BCNF.',
        credit_hours: 3,
        duration_hours: 45,
        category: 'Chuyên môn nghiệp vụ'
      },
      {
        course_code: 'ENG101',
        course_name: 'Tiếng Anh Học thuật 1 (General English B1)',
        description: 'Phát triển năng lực đọc hiểu tài liệu kỹ thuật, viết đoạn văn học thuật, thuyết trình báo cáo và từ vựng chuyên ngành CNTT.',
        credit_hours: 3,
        duration_hours: 45,
        category: 'Tin học/Ngoại ngữ'
      },
      {
        course_code: 'MAT101',
        course_name: 'Giải tích 1 (Toán Cao Cấp 1)',
        description: 'Cung cấp nền tảng toán học giải tích: Giới hạn, đạo hàm, vi phân, tích phân xác định/bất định, chuỗi số và phương trình vi phân ứng dụng kỹ thuật.',
        credit_hours: 3,
        duration_hours: 45,
        category: 'Chuyên môn nghiệp vụ'
      }
    ];

    const results = [];
    for (const c of courseDefs) {
      await sequelize.query(`
        INSERT INTO courses (course_code, course_name, description, credit_hours, duration_hours, category, status, created_by, created_at, updated_at)
        VALUES ('${c.course_code}', '${c.course_name}', '${c.description.replace(/'/g, "''")}', ${c.credit_hours}, ${c.duration_hours}, '${c.category}', 'Đang diễn ra', 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE course_name=VALUES(course_name), description=VALUES(description), credit_hours=VALUES(credit_hours), updated_at=NOW()
      `);

      const [rows] = await sequelize.query(`SELECT id, course_code, course_name, credit_hours FROM courses WHERE course_code = '${c.course_code}'`);
      if (rows && rows.length > 0) {
        results.push(rows[0]);
      }
    }

    console.log(`  -> Đã cập nhật thành công ${results.length} môn học vào CSDL MySQL.`);
    return results;
  }

  async seedSampleLessons(courses) {
    console.log('📌 2. Nạp bài giảng mẫu chuyên sâu (ít nhất 3 bài/môn) có slide & video...');

    const sampleLessonsData = {
      IT101: [
        {
          week: 1,
          title: 'Bài 1: Tổng quan Ngôn ngữ C/C++, Môi trường Biên dịch & Cấu trúc Chương trình',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/it101-lesson01-intro.mp4',
          document_url: 'https://slides.techcorp.edu.vn/it101-week1-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO1)</h3>
            <p>Sau bài học này, sinh viên hiểu được kiến trúc máy tính Von Neumann, nguyên lý hoạt động của trình biên dịch GCC/Clang, cấu trúc hàm <code>main()</code> và cách khai báo biến, kiểu dữ liệu trong C++.</p>
            <h3>2. Nội dung cốt lõi</h3>
            <ul>
              <li>Cấu trúc tệp mã nguồn C++: <code>#include &lt;iostream&gt;</code>, <code>using namespace std;</code></li>
              <li>Kiểu dữ liệu cơ bản: <code>int</code> (4B), <code>float</code> (4B), <code>double</code> (8B), <code>char</code> (1B), <code>bool</code> (1B).</li>
              <li>Luồng nhập xuất dữ liệu: <code>cin >> x;</code> và <code>cout << "Hello World!";</code></li>
            </ul>
            <h3>3. Mã nguồn thực hành mẫu</h3>
            <pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    int n;
    cout &lt;&lt; "Nhập số lượng sinh viên: ";
    cin &gt;&gt; n;
    cout &lt;&lt; "Lớp 66.CNTT-1 có: " &lt;&lt; n &lt;&lt; " sinh viên." &lt;&lt; endl;
    return 0;
}</code></pre>
            <h3>4. Yêu cầu tự học</h3>
            <p>Sinh viên cài đặt VSCode và GCC compiler, hoàn thành bài tập 1.1 trong giáo trình và xem trước bài 2 về Cấu trúc Rẽ nhánh.</p>
          `
        },
        {
          week: 2,
          title: 'Bài 2: Cấu trúc Rẽ Nhánh (if-else, switch), Vòng Lặp & Tối Ưu Giải Thuật',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/it101-lesson02-control.mp4',
          document_url: 'https://slides.techcorp.edu.vn/it101-week2-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO2)</h3>
            <p>Trang bị kỹ năng phân tích luồng điều khiển, tối ưu độ phức tạp vòng lặp và xử lý các ca kiểm thử biên.</p>
            <h3>2. Nội dung cốt lõi</h3>
            <ul>
              <li>Cấu trúc điều kiện <code>if - else if - else</code> và toán tử 3 ngôi <code>cond ? val1 : val2</code>.</li>
              <li>Cấu trúc <code>switch - case</code> và kỹ thuật tối ưu hóa bảng nhảy (Jump Table).</li>
              <li>Vòng lặp xác định <code>for</code>, vòng lặp điều kiện <code>while</code>, <code>do - while</code>.</li>
              <li>Kỹ thuật lồng vòng lặp và tránh lỗi lặp vô hạn (Infinite Loop).</li>
            </ul>
            <h3>3. Thuật toán kiểm tra số nguyên tố tối ưu O(sqrt(N))</h3>
            <pre><code>bool isPrime(int n) {
    if (n &lt; 2) return false;
    for (int i = 2; i * i &lt;= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}</code></pre>
          `
        },
        {
          week: 3,
          title: 'Bài 3: Con Trỏ (Pointers), Quản Lý Bộ Nhớ Động & Cấu Trúc Dữ Liệu Struct',
          type: 'video',
          duration: 50,
          media_url: 'https://cdn.techcorp.edu.vn/videos/it101-lesson03-pointers.mp4',
          document_url: 'https://slides.techcorp.edu.vn/it101-week3-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO3)</h3>
            <p>Nắm vững bản chất con trỏ trong bộ nhớ ảo, toán tử <code>&</code> và <code>*</code>, quản lý vùng nhớ Heap bằng <code>new</code> / <code>delete</code>.</p>
            <h3>2. Nội dung cốt lõi</h3>
            <ul>
              <li>Bộ nhớ Stack vs Bộ nhớ Heap trong hệ điều hành.</li>
              <li>Cấp phát mảng động 1 chiều: <code>int *arr = new int[n];</code></li>
              <li>Giải phóng bộ nhớ chống rò rỉ RAM (Memory Leak): <code>delete[] arr; arr = nullptr;</code></li>
              <li>Khai báo kiểu cấu trúc <code>struct Student</code> để quản lý thông tin sinh viên lớp 66.CNTT-1.</li>
            </ul>
            <h3>3. Mã nguồn quản lý danh sách sinh viên bằng Struct</h3>
            <pre><code>struct Student {
    string id;
    string name;
    float gpa;
};

void printStudent(const Student &s) {
    cout &lt;&lt; s.id &lt;&lt; " - " &lt;&lt; s.name &lt;&lt; " - GPA: " &lt;&lt; s.gpa &lt;&lt; endl;
}</code></pre>
          `
        }
      ],
      IT201: [
        {
          week: 1,
          title: 'Bài 1: Tổng Quan Hệ Quản Trị CSDL & Mô Hình Thực Thể Liên Kết (ER/EER Diagram)',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/it201-lesson01-er.mp4',
          document_url: 'https://slides.techcorp.edu.vn/it201-week1-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO1)</h3>
            <p>Hiểu bản chất của cơ sở dữ liệu quan hệ, vai trò của DBMS và kỹ năng vẽ sơ đồ ER từ yêu cầu bài toán nghiệp vụ.</p>
            <h3>2. Nội dung chính</h3>
            <ul>
              <li>Thực thể (Entity), Thuộc tính (Attribute: đơn trị, đa trị, suy diễn, khóa).</li>
              <li>Mối liên kết (Relationship: 1-1, 1-N, N-N) và bậc kết hợp.</li>
              <li>Quy tắc chuyển từ sơ đồ ER sang mô hình quan hệ (Relational Schema).</li>
            </ul>
          `
        },
        {
          week: 2,
          title: 'Bài 2: Ngôn Ngữ Truy Vấn SQL Nâng Cao: JOIN, GROUP BY & Subqueries',
          type: 'video',
          duration: 50,
          media_url: 'https://cdn.techcorp.edu.vn/videos/it201-lesson02-sql.mp4',
          document_url: 'https://slides.techcorp.edu.vn/it201-week2-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO2)</h3>
            <p>Thành thạo viết các truy vấn SQL phức tạp liên kết nhiều bảng và phân tích thống kê theo nhóm.</p>
            <h3>2. Ví dụ truy vấn SQL thực tế trên CSDL Đại học</h3>
            <pre><code>SELECT s.class_name, COUNT(s.id) AS total_students, AVG(s.gpa) AS avg_gpa
FROM academic_students s
WHERE s.status = 'ACTIVE'
GROUP BY s.class_name
HAVING AVG(s.gpa) >= 3.0
ORDER BY avg_gpa DESC;</code></pre>
          `
        },
        {
          week: 3,
          title: 'Bài 3: Chuẩn Hóa Cơ Sở Dữ Liệu (1NF, 2NF, 3NF, BCNF) & Ràng Buộc Toàn Vẹn',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/it201-lesson03-normalization.mp4',
          document_url: 'https://slides.techcorp.edu.vn/it201-week3-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO3)</h3>
            <p>Hiểu khái niệm Phụ thuộc hàm (Functional Dependency), khóa ứng viên và các thuật toán phân rã đạt chuẩn 3NF và BCNF.</p>
            <h3>2. Nội dung cốt lõi</h3>
            <ul>
              <li>Dạng chuẩn 1 (1NF): Mọi thuộc tính đều mang giá trị nguyên tố (Atomic).</li>
              <li>Dạng chuẩn 2 (2NF): Đạt 1NF và không có thuộc tính không khóa phụ thuộc một phần vào khóa chính.</li>
              <li>Dạng chuẩn 3 (3NF): Đạt 2NF và không có phụ thuộc bắc cầu qua thuộc tính không khóa.</li>
            </ul>
          `
        }
      ],
      ENG101: [
        {
          week: 1,
          title: 'Bài 1: Academic Reading & Vocabulary in Computer Science & Technology',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/eng101-lesson01-reading.mp4',
          document_url: 'https://slides.techcorp.edu.vn/eng101-week1-slides.pdf',
          content_html: `
            <h3>1. Learning Objectives (CLO1)</h3>
            <p>Master academic scanning and skimming strategies to extract technical information from IEEE and ACM research papers.</p>
            <h3>2. Key Content</h3>
            <ul>
              <li>Academic Word List (AWL): algorithm, abstraction, concurrency, framework.</li>
              <li>Identifying topic sentences and supporting technical evidence.</li>
            </ul>
          `
        },
        {
          week: 2,
          title: 'Bài 2: Academic Writing: Paragraph Cohesion & Cause-and-Effect Analysis',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/eng101-lesson02-writing.mp4',
          document_url: 'https://slides.techcorp.edu.vn/eng101-week2-slides.pdf',
          content_html: `
            <h3>1. Learning Objectives (CLO2)</h3>
            <p>Learn how to formulate coherent analytical essays evaluating software engineering problems and architectural trade-offs.</p>
            <h3>2. Structure of an Academic Paragraph</h3>
            <p>Topic sentence &rarr; Explanation &rarr; Empirical evidence &rarr; Concluding synthesis.</p>
          `
        },
        {
          week: 3,
          title: 'Bài 3: Technical Presentation Skills & Data Commentary for Engineers',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/eng101-lesson03-speaking.mp4',
          document_url: 'https://slides.techcorp.edu.vn/eng101-week3-slides.pdf',
          content_html: `
            <h3>1. Learning Objectives (CLO3)</h3>
            <p>Present complex technical concepts to both engineering audiences and non-technical stakeholders.</p>
            <h3>2. Language of Data Trends</h3>
            <p>Describing graphs: sharp increase, plateau, marginal fluctuation, exponential growth.</p>
          `
        }
      ],
      MAT101: [
        {
          week: 1,
          title: 'Bài 1: Giới Hạn Dãy Số, Giới Hạn Hàm Số & Tính Liên Tục của Hàm Một Biến',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/mat101-lesson01-limits.mp4',
          document_url: 'https://slides.techcorp.edu.vn/mat101-week1-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO1)</h3>
            <p>Nắm vững khái niệm giới hạn theo ngôn ngữ Epsilon-Delta, các dạng vô định cơ bản (0/0, inf/inf) và ứng dụng quy tắc L'Hôpital.</p>
            <h3>2. Công thức giới hạn đáng nhớ</h3>
            <ul>
              <li><code>lim (x &rarr; 0) [sin(x) / x] = 1</code></li>
              <li><code>lim (x &rarr; inf) (1 + 1/x)^x = e &asymp; 2.71828</code></li>
              <li><code>lim (x &rarr; 0) [ln(1 + x) / x] = 1</code></li>
            </ul>
          `
        },
        {
          week: 2,
          title: 'Bài 2: Đạo Hàm, Vi Phân & Ứng Dụng Khảo Sát Tối Ưu Hóa (Cực Trị, Điểm Uốn)',
          type: 'video',
          duration: 45,
          media_url: 'https://cdn.techcorp.edu.vn/videos/mat101-lesson02-derivatives.mp4',
          document_url: 'https://slides.techcorp.edu.vn/mat101-week2-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO2)</h3>
            <p>Vận dụng vi phân tính xấp xỉ giá trị hàm số và tìm điểm cực trị trong bài toán tối ưu hóa chi phí sản xuất và thuật toán Gradient Descent.</p>
            <h3>2. Khai triển Taylor & Maclaurin</h3>
            <p>Biểu diễn hàm phức tạp thành chuỗi đa thức xấp xỉ quanh điểm x0.</p>
          `
        },
        {
          week: 3,
          title: 'Bài 3: Tích Phân Bất Định, Tích Phân Xác Định & Ứng Dụng Tính Diện Tích, Thể Tích',
          type: 'video',
          duration: 50,
          media_url: 'https://cdn.techcorp.edu.vn/videos/mat101-lesson03-integrals.mp4',
          document_url: 'https://slides.techcorp.edu.vn/mat101-week3-slides.pdf',
          content_html: `
            <h3>1. Mục tiêu bài học (CLO3)</h3>
            <p>Nắm vững phương pháp tích phân đổi biến, tích phân từng phần và ứng dụng tính diện tích miền phẳng và khối tròn xoay.</p>
            <h3>2. Công thức Newton - Leibniz</h3>
            <p><code>int_a^b f(x) dx = F(b) - F(a)</code> với F'(x) = f(x).</p>
          `
        }
      ]
    };

    let totalLessonsCount = 0;
    for (const course of courses) {
      const lessons = sampleLessonsData[course.course_code] || [];
      
      // Tạo section trong course_sections nếu chưa có
      await sequelize.query(`
        INSERT INTO course_sections (id, course_id, title, description, sort_order, created_at, updated_at)
        VALUES (${course.id}, ${course.id}, 'Học phần: ${course.course_name} (Lớp ${this.className})', 'Chương trình giảng dạy chính khóa', 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE title=VALUES(title), updated_at=NOW()
      `);

      for (let i = 0; i < lessons.length; i++) {
        const l = lessons[i];
        const lessonId = course.id * 100 + l.week;

        await sequelize.query(`
          INSERT INTO course_lessons (
            id, section_id, course_id, title, lesson_type, media_url, document_url, content_html, duration_minutes, sort_order, is_mandatory, created_at, updated_at
          ) VALUES (
            ${lessonId}, ${course.id}, ${course.id}, '${l.title.replace(/'/g, "''")}', '${l.type}',
            '${l.media_url}', '${l.document_url}', '${l.content_html.replace(/'/g, "''")}', ${l.duration}, ${l.week}, 1, NOW(), NOW()
          ) ON DUPLICATE KEY UPDATE
            title=VALUES(title), media_url=VALUES(media_url), document_url=VALUES(document_url), content_html=VALUES(content_html), updated_at=NOW()
        `);
        totalLessonsCount++;
      }
      console.log(`  -> Đã nạp ${lessons.length} bài giảng mẫu cho môn ${course.course_code} - ${course.course_name}`);
    }

    console.log(`  -> Tổng cộng đã nạp thành công ${totalLessonsCount} bài giảng mẫu vào CSDL.`);
  }

  async seedExamPapersAndQuestions() {
    console.log('📌 3. Nạp Ngân hàng Đề thi chuẩn hóa (3 đề/môn x 40 câu/đề = 120 câu/môn)...');

    const targetCourseCodes = ['IT101', 'IT201', 'ENG101', 'MAT101'];
    let totalQuestionsCount = 0;
    let totalPapersCount = 0;

    for (const code of targetCourseCodes) {
      const bank = examBank.COURSE_BANKS.find(b => b.course.code === code);
      if (!bank) {
        console.warn(`[Warning] Không tìm thấy ngân hàng câu hỏi cho môn: ${code}`);
        continue;
      }

      // Lấy thông tin môn học
      const [cRows] = await sequelize.query(`SELECT id, course_name FROM courses WHERE course_code = '${code}' LIMIT 1`);
      const courseId = cRows && cRows[0] ? cRows[0].id : 1;

      // 1. Tạo danh mục ngân hàng câu hỏi trong qbank_categories
      const [catRows] = await sequelize.query(`SELECT id FROM qbank_categories WHERE course_id = ${courseId} LIMIT 1`);
      let catId;
      if (catRows && catRows.length > 0) {
        catId = catRows[0].id;
      } else {
        const [insertRes] = await sequelize.query(`
          INSERT INTO qbank_categories (course_id, name, description, clo_tag, created_at, updated_at)
          VALUES (${courseId}, 'Ngân hàng câu hỏi: ${bank.course.name.replace(/'/g, "''")} (${code})', 'Ngân hàng chuẩn 120 câu hỏi trắc nghiệm 4 mức độ Bloom', '${code}', NOW(), NOW())
        `);
        catId = insertRes;
      }

      // 2. Nạp toàn bộ 120 câu hỏi vào qbank_questions & qbank_answers
      // Xóa câu hỏi cũ của category để nạp mới tinh
      const [oldQs] = await sequelize.query(`SELECT id FROM qbank_questions WHERE category_id = ${catId}`);
      if (oldQs && oldQs.length > 0) {
        const oldQIds = oldQs.map(q => q.id).join(',');
        await sequelize.query(`DELETE FROM qbank_answers WHERE question_id IN (${oldQIds})`).catch(() => {});
        await sequelize.query(`DELETE FROM qbank_questions WHERE category_id = ${catId}`);
      }

      const allQ = bank.getAllQuestions();
      const questionMap = {};

      for (const q of allQ) {
        const diff = q.difficulty || 'MEDIUM';
        const contentSafe = q.content.replace(/'/g, "''");
        
        const [qInsertRes] = await sequelize.query(`
          INSERT INTO qbank_questions (category_id, question_type, difficulty, content, default_mark, general_feedback, status, created_at, updated_at)
          VALUES (${catId}, 'MULTIPLE_CHOICE', '${diff}', '${contentSafe}', 0.25, 'Chuẩn đầu ra ${q.clo || code}', 'APPROVED', NOW(), NOW())
        `);
        const qId = qInsertRes;
        questionMap[q.id] = qId;

        if (Array.isArray(q.answers)) {
          for (let aIdx = 0; aIdx < q.answers.length; aIdx++) {
            const a = q.answers[aIdx];
            const aContent = a.content.replace(/'/g, "''");
            const fraction = a.is_correct ? 1.0 : 0.0;
            await sequelize.query(`
              INSERT INTO qbank_answers (question_id, content, fraction, sort_order, created_at, updated_at)
              VALUES (${qId}, '${aContent}', ${fraction}, ${aIdx + 1}, NOW(), NOW())
            `);
          }
        }
        totalQuestionsCount++;
      }

      // 3. Nạp 3 đề thi gốc chính thức (Mỗi đề 40 câu) vào exam_papers
      const roots = [
        { num: 1, code: `${code}-GOC-01`, name: `Đề Thi Kết Thúc Môn: ${bank.course.name} (Đề 01 - 40 câu)`, questions: bank.root_1 },
        { num: 2, code: `${code}-GOC-02`, name: `Đề Thi Kết Thúc Môn: ${bank.course.name} (Đề 02 - 40 câu)`, questions: bank.root_2 },
        { num: 3, code: `${code}-GOC-03`, name: `Đề Thi Kết Thúc Môn: ${bank.course.name} (Đề 03 - 40 câu)`, questions: bank.root_3 }
      ];

      for (const r of roots) {
        // Nạp đề thi
        await sequelize.query(`
          INSERT INTO exam_papers (
            paper_code, name, total_marks, status, approved_by, created_at, updated_at
          ) VALUES (
            '${r.code}', '${r.name.replace(/'/g, "''")}', 10.00, 'APPROVED', 1, NOW(), NOW()
          ) ON DUPLICATE KEY UPDATE name=VALUES(name), status='APPROVED', updated_at=NOW()
        `);

        // Lấy paper_id vừa tạo
        const [pRows] = await sequelize.query(`SELECT id FROM exam_papers WHERE paper_code = '${r.code}'`);
        const paperId = pRows && pRows[0] ? pRows[0].id : null;

        if (paperId && Array.isArray(r.questions)) {
          // Xóa câu hỏi cũ của đề này nếu có
          await sequelize.query(`DELETE FROM exam_paper_questions WHERE paper_id = ${paperId}`);
          
          // Thêm 40 câu hỏi vào đề
          for (let qIdx = 0; qIdx < r.questions.length; qIdx++) {
            const q = r.questions[qIdx];
            const qDbId = questionMap[q.id];
            if (qDbId) {
              await sequelize.query(`
                INSERT INTO exam_paper_questions (paper_id, question_id, mark_allocated, sort_order)
                VALUES (${paperId}, ${qDbId}, 0.25, ${qIdx + 1})
              `);
            }
          }
        }
        totalPapersCount++;
      }

      console.log(`  -> Đã nạp thành công 3 đề thi chính thức (120 câu hỏi) cho môn ${code} - ${bank.course.name}`);
    }

    console.log(`  -> Tổng cộng: Nạp hoàn tất ${totalPapersCount} đề thi chính thức với ${totalQuestionsCount} câu hỏi chuẩn hóa.`);
  }

  async seedExamSchedules() {
    console.log('📌 4. Lập lịch thi kết thúc học phần cho Lớp 66.CNTT-1 trong Học kỳ 1...');

    const schedules = [
      {
        course_code: 'IT101',
        exam_name: 'Thi Kết Thúc Học Phần: Nhập môn Lập trình C/C++ (Lớp 66.CNTT-1)',
        exam_date: '2026-11-15',
        start_time: '08:00:00',
        end_time: '09:00:00',
        paper_code: 'IT101-GOC-01',
        room_name: 'P.401 (Nhà A3)',
        proctor_1: 'TS. Hoàng Đức Em',
        proctor_2: 'ThS. Nguyễn Văn Quản'
      },
      {
        course_code: 'IT201',
        exam_name: 'Thi Kết Thúc Học Phần: Cơ sở Dữ liệu (Lớp 66.CNTT-1)',
        exam_date: '2026-11-18',
        start_time: '08:00:00',
        end_time: '09:00:00',
        paper_code: 'IT201-GOC-01',
        room_name: 'P.402 (Nhà A3)',
        proctor_1: 'TS. Hoàng Đức Em',
        proctor_2: 'TS. Nguyễn Văn An'
      },
      {
        course_code: 'ENG101',
        exam_name: 'Thi Kết Thúc Học Phần: Tiếng Anh Học thuật 1 (Lớp 66.CNTT-1)',
        exam_date: '2026-11-21',
        start_time: '09:30:00',
        end_time: '10:30:00',
        paper_code: 'ENG101-GOC-01',
        room_name: 'Lab Ngoại Ngữ 01',
        proctor_1: 'TS. Phạm Thu Hương',
        proctor_2: 'ThS. Đỗ Quang Vinh'
      },
      {
        course_code: 'MAT101',
        exam_name: 'Thi Kết Thúc Học Phần: Giải tích 1 (Toán Cao Cấp) (Lớp 66.CNTT-1)',
        exam_date: '2026-11-24',
        start_time: '14:00:00',
        end_time: '15:00:00',
        paper_code: 'MAT101-GOC-01',
        room_name: 'Giảng đường A3-101',
        proctor_1: 'TS. Trần Văn Bình',
        proctor_2: 'ThS. Vũ Nam'
      }
    ];

    for (const s of schedules) {
      const [cRows] = await sequelize.query(`SELECT id FROM courses WHERE course_code = '${s.course_code}' LIMIT 1`);
      const courseId = cRows && cRows[0] ? cRows[0].id : 1;

      const [pRows] = await sequelize.query(`SELECT id FROM exam_papers WHERE paper_code = '${s.paper_code}' LIMIT 1`);
      const paperId = pRows && pRows[0] ? pRows[0].id : 1;

      // Xóa lịch thi cũ cùng tên môn nếu có
      await sequelize.query(`DELETE FROM academic_exam_schedules WHERE course_id = ${courseId}`);

      await sequelize.query(`
        INSERT INTO academic_exam_schedules (
          section_id, course_id, semester_id, exam_name, exam_date, exam_shift, start_time, end_time,
          room_name, proctor_1, proctor_2, total_candidates, barred_candidates, status,
          exam_format, paper_id, duration_minutes, faculty_name, major_name, notes, created_at, updated_at
        ) VALUES (
          ${courseId}, ${courseId}, 1, '${s.exam_name}', '${s.exam_date}', 1, '${s.start_time}', '${s.end_time}',
          '${s.room_name}', '${s.proctor_1}', '${s.proctor_2}', 45, 0, 'SCHEDULED',
          'Trắc nghiệm khách quan trực tuyến 40 câu', ${paperId}, 60, 'Khoa Công Nghệ Thông Tin',
          'Công nghệ Thông tin', 'AI Proctoring Webcam trực tiếp', NOW(), NOW()
        )
      `);
      // Lấy ID ca thi vừa tạo
      const [schedRows] = await sequelize.query(`SELECT id FROM academic_exam_schedules WHERE course_id = ${courseId} ORDER BY id DESC LIMIT 1`);
      const schedId = schedRows && schedRows[0] ? schedRows[0].id : null;

      if (schedId) {
        // Xóa candidate cũ của ca thi này
        await sequelize.query(`DELETE FROM exam_candidate_authorizations WHERE schedule_id = ${schedId}`);

        // Cấp quyền chính thức cho sinh viên demo lớp 66.CNTT-1
        const demoStudents = [
          { id: 12, code: 'sv_cntt', name: 'Trần Văn Nam', class_name: '66.CNTT-1', seat: 'SBD-66CNTT-01' },
          { id: 3, code: 'student', name: 'Trần Văn Nam', class_name: '66.CNTT-1', seat: 'SBD-66CNTT-02' }
        ];

        for (const st of demoStudents) {
          const courseTitle = (cRows && cRows[0] && cRows[0].course_name) || s.course_code;
          await sequelize.query(`
            INSERT INTO exam_candidate_authorizations (
              schedule_id, student_id, student_code, student_name, class_name,
              seat_number, subject_code, subject_name, attendance_pct,
              tuition_cleared, condition_passed, authorization_status, authorized_by,
              authorized_at, notes, created_at, updated_at
            ) VALUES (
              ${schedId}, ${st.id}, '${st.code}', '${st.name}', '${st.class_name}',
              '${st.seat}', '${s.course_code}', '${courseTitle.replace(/'/g, "''")}', 95.5,
              1, 1, 'GRANTED', 'Hội đồng Khảo thí TCU',
              NOW(), 'Đủ điều kiện dự thi chuẩn Thông tư 08/2021/TT-BGDĐT', NOW(), NOW()
            )
          `);
        }
      }

      console.log(`  -> Đã lên lịch thi & cấp quyền dự thi môn ${s.course_code} ngày ${s.exam_date} phòng ${s.room_name}`);
    }
  }

  async syncToOnlineQuizRooms() {
    console.log('📌 5. Đồng bộ đề thi 40 câu vào hệ thống Phòng Thi Trực Tuyến (OnlineExamRoom)...');
    const targetCourses = ['IT101', 'IT201', 'ENG101', 'MAT101'];

    for (const code of targetCourses) {
      const [cRows] = await sequelize.query(`SELECT id, course_name FROM courses WHERE course_code = '${code}' LIMIT 1`);
      if (!cRows || cRows.length === 0) continue;
      const c = cRows[0];

      const bank = examBank.COURSE_BANKS.find(b => b.course.code === code);
      if (!bank || !bank.root_1) continue;

      // Xóa bài quiz cũ của course nếu có
      const [oldQuizzes] = await sequelize.query(`SELECT id FROM quiz_assessments WHERE course_id = ${c.id}`);
      if (oldQuizzes && oldQuizzes.length > 0) {
        for (const oq of oldQuizzes) {
          await sequelize.query(`DELETE FROM quiz_questions WHERE quiz_id = ${oq.id}`);
        }
        await sequelize.query(`DELETE FROM quiz_assessments WHERE course_id = ${c.id}`);
      }

      // 1. Tạo bài thi trong quiz_assessments
      const [insQuiz] = await sequelize.query(`
        INSERT INTO quiz_assessments (
          course_id, title, description, time_limit_minutes, passing_score_pct, max_attempts,
          shuffle_questions, shuffle_options, show_explanation, status, created_at, updated_at
        ) VALUES (
          ${c.id}, 'Đề Thi Kết Thúc Học Phần: ${c.course_name.replace(/'/g, "''")} (Chuẩn Bộ 40 câu)',
          'Đề thi trắc nghiệm khách quan 40 câu hỏi thời gian 60 phút, giám sát bởi Giám thị AI webcam trực tiếp.',
          60, 50, 1, 1, 1, 1, 'active', NOW(), NOW()
        )
      `);
      const quizId = insQuiz;

      // 2. Nạp 40 câu hỏi vào quiz_questions
      for (let i = 0; i < bank.root_1.length; i++) {
        const q = bank.root_1[i];
        const correctAnsLetter = ['A', 'B', 'C', 'D'][q.answers.findIndex(a => a.is_correct)] || 'A';
        const optionsJson = JSON.stringify(q.answers.map(a => a.content));

        await sequelize.query(`
          INSERT INTO quiz_questions (
            quiz_id, course_id, question_type, question_text, options_json, correct_answer,
            explanation, points, sort_order, created_at, updated_at
          ) VALUES (?, ?, 'single_choice', ?, ?, ?, ?, 0.25, ?, NOW(), NOW())
        `, {
          replacements: [
            quizId,
            c.id,
            q.content,
            optionsJson,
            correctAnsLetter,
            `Căn cứ chuẩn đầu ra ${q.clo}: Mức độ nhận thức ${q.difficulty}`,
            i + 1
          ]
        });
      }
      console.log(`  -> Đã đồng bộ 40 câu hỏi trắc nghiệm của môn ${code} vào Phòng thi trực tuyến.`);
    }
  }
}

module.exports = new SemesterOperationalSeeder();
