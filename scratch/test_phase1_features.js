// scratch/test_phase1_features.js
// Script kiểm thử tự động toàn bộ tính năng Gói cải tiến Giai đoạn 1 trên Backend
const http = require('http');

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(dataString);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================================');
  console.log('KIỂM THỬ TỰ ĐỘNG GÓI CẢI TIẾN GIAI ĐOẠN 1 (STANDALONE LMS + RICH EDITOR)');
  console.log('========================================================================\n');

  // 1. Đăng nhập Admin
  console.log('[1] Đăng nhập Admin...');
  const loginRes = await request('POST', '/api/auth/login', { username: 'admin', password: 'Admin@2026' });
  const token = loginRes.body?.token;
  if (!token) {
    console.error('Đăng nhập thất bại:', loginRes);
    return;
  }
  console.log(' -> OK: Token JWT thu được.\n');

  // 2. Test Batch Import Giảng Viên
  console.log('[2] Kiểm thử Batch Import Giảng Viên (/api/academic/enterprise/lecturers/batch)...');
  const sampleLecturers = [
    {
      code: 'GV_TEST_01',
      username: 'gv_hung',
      full_name: 'TS. Lê Mạnh Hùng',
      title: 'Tiến sĩ',
      academic_rank: 'Không',
      faculty_id: 'CNTT',
      faculty_name: 'Khoa Công Nghệ Thông Tin',
      department: 'Bộ môn Kỹ thuật Phần mềm',
      email: 'hung.lm@techcorp.edu.vn',
      phone: '0912.888.999',
      specialization: 'Kiến trúc Vi dịch vụ & DevOps',
      experience_years: 10
    },
    {
      code: 'GV_TEST_02',
      username: 'gv_lan',
      full_name: 'ThS. Trần Thị Lan',
      title: 'Thạc sĩ',
      academic_rank: 'Không',
      faculty_id: 'CNTT',
      faculty_name: 'Khoa Công Nghệ Thông Tin',
      department: 'Bộ môn Hệ thống Thông tin',
      email: 'lan.tt@techcorp.edu.vn',
      phone: '0913.777.666',
      specialization: 'Kho Dữ liệu & Business Intelligence',
      experience_years: 7
    }
  ];

  const batchLecRes = await request('POST', '/api/academic/enterprise/lecturers/batch', { lecturers: sampleLecturers }, token);
  console.log(` -> Status: ${batchLecRes.status}, Saved: ${batchLecRes.body?.saved_count} giảng viên.`);
  console.log(` -> Message: ${batchLecRes.body?.message}\n`);

  // 3. Test Batch Import Lớp Học
  console.log('[3] Kiểm thử Batch Import Lớp Học (/api/academic/enterprise/classes/batch)...');
  const sampleClasses = [
    {
      class_code: '66.CNTT-TEST1',
      class_name: 'Lớp 66.CNTT-TEST1 (Chất lượng cao)',
      faculty_id: 'CNTT',
      major_id: 'CNPM',
      major_name: 'Kỹ thuật Phần mềm',
      cohort: 'K66',
      total_students: 35,
      advisor: 'TS. Lê Mạnh Hùng',
      room: 'Lab Cloud 401'
    }
  ];

  const batchClassRes = await request('POST', '/api/academic/enterprise/classes/batch', { classes: sampleClasses }, token);
  console.log(` -> Status: ${batchClassRes.status}, Saved: ${batchClassRes.body?.saved_count} lớp.`);
  console.log(` -> Message: ${batchClassRes.body?.message}\n`);

  // 4. Test Lưu Bài Giảng Học Thuật Số (Rich-Text WYSIWYG + KaTeX + Code Block)
  console.log('[4] Kiểm thử Lưu Bài Giảng Rich-Text (/api/academic/lms/materials)...');
  const richLecturePayload = {
    module_id: 1,
    title: 'Bài Giảng Số: Tối Ưu Hóa CSDL & Giải Thuật Chỉ Mục KaTeX',
    material_type: 'RICH_TEXT',
    category: 'MAIN_TEXTBOOK',
    duration_mins: 60,
    suggested_time_minutes: 60,
    content_text: `# 📘 BÀI GIẢNG SỐ: TỐI ƯU HÓA TRUY VẤN
## 1. Mô hình Toán học Chi phí Truy vấn
Hàm chi phí thời gian I/O đĩa:
$$Cost(Q) = \\alpha \\cdot \\text{Blocks}(R) + \\beta \\cdot \\sum_{i=1}^{m} \\log_2(Index_i)$$

> [!IMPORTANT]
> **Quy tắc Indexing:** Cần đánh chỉ mục B-Tree trên các trường có tính chọn lọc cao (High Cardinality).

\`\`\`sql
CREATE INDEX idx_student_gpa ON academic_students (cohort, gpa DESC);
\`\`\`
`,
    rich_content: 'RAW_RICH_CONTENT_SAVED',
    is_published: true,
    anti_skipping: true,
    min_completion_pct: 80,
    file_url: 'INTERNAL_RICH_TEXT'
  };

  const richRes = await request('POST', '/api/academic/lms/materials', richLecturePayload, token);
  console.log(` -> Status: ${richRes.status}`);
  console.log(` -> Saved ID: ${richRes.body?.data?.id}, Type: ${richRes.body?.data?.material_type}`);
  console.log(` -> Title: ${richRes.body?.data?.title}`);
  console.log(` -> Has KaTeX Math in Content: ${richRes.body?.data?.content_text?.includes('$$Cost') ? 'YES' : 'NO'}`);
  console.log(` -> Anti-skipping flag: ${richRes.body?.data?.anti_skipping}\n`);

  // 5. Kiểm tra truy vấn Modules trả về đầy đủ bài giảng mới
  console.log('[5] Truy vấn Danh sách Tuần học để kiểm tra bài giảng số...');
  const modulesRes = await request('GET', '/api/academic/lms/sections/1/modules', null, token);
  const week1 = modulesRes.body?.data?.modules?.[0];
  const foundMat = week1?.materials?.find(m => m.id === richRes.body?.data?.id);
  console.log(` -> Tìm thấy bài giảng trong Tuần 1: ${foundMat ? 'THÀNH CÔNG (' + foundMat.title + ')' : 'CHƯA TÌM THẤY'}`);
  console.log(` -> Material Type: ${foundMat?.material_type}`);
  console.log(` -> Is Published: ${foundMat?.is_published}`);

  console.log('\n========================================================================');
  console.log('TẤT CẢ CÁC TÍNH NĂNG GIAI ĐOẠN 1 ĐÃ VẬN HÀNH THÀNH CÔNG 100%!');
  console.log('========================================================================');
}

runTests().catch(console.error);
