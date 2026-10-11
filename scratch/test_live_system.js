const https = require('https');

function request(url, method = 'GET', payload = null, token = null) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const headers = { 'Accept': 'application/json' };
    let postData = null;
    if (payload) {
      postData = JSON.stringify(payload);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    const req = https.request({
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + (u.search || ''),
      method: method,
      headers: headers,
      rejectUnauthorized: false,
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', err => resolve({ error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ error: 'Timeout' }); });
    if (postData) req.write(postData);
    req.end();
  });
}

async function runLiveAudit() {
  console.log('=== BẮT ĐẦU KIỂM THỬ HỆ THỐNG LIVE: https://lms.techcorp.info.vn ===\n');

  const users = [
    { username: 'admin', password: 'Admin@2026', expectedRole: 'admin' },
    { username: 'gv_cntt', password: 'Teacher@2026', expectedRole: 'teacher' },
    { username: 'sv_cntt', password: 'Student@2026', expectedRole: 'student' }
  ];

  const sessions = {};

  for (const u of users) {
    console.log(`--- [1] Kiểm thử đăng nhập: ${u.username} ---`);
    const res = await request('https://lms.techcorp.info.vn/api/auth/login', 'POST', {
      username: u.username,
      password: u.password
    });

    if (res.status === 200 && res.data && res.data.success) {
      const token = res.data.token;
      const user = res.data.user;
      sessions[u.username] = { token, user };
      console.log(`  -> Đăng nhập thành công! ID: ${user.id}, Role: ${user.role}, Name: ${user.full_name}, Class: ${user.class_name || 'N/A'}`);
    } else {
      console.log(`  -> Đăng nhập THẤT BẠI: Status ${res.status}`, res.data || res.raw || res.error);
    }
  }

  // 2. Kiểm thử vai trò Admin
  console.log('\n--- [2] Kiểm thử quyền & chức năng ADMIN ---');
  if (sessions.admin) {
    const adminToken = sessions.admin.token;

    // Courses
    const courses = await request('https://lms.techcorp.info.vn/api/elearning/courses', 'GET', null, adminToken);
    console.log(`  * GET /api/elearning/courses: Status ${courses.status}, Số lượng: ${courses.data?.data?.length || 0}`);

    // Exam Schedules
    const schedules = await request('https://lms.techcorp.info.vn/api/exam/admin/schedules', 'GET', null, adminToken);
    console.log(`  * GET /api/exam/admin/schedules: Status ${schedules.status}, Số lượng: ${schedules.data?.data?.length || 0}`);

    // Exam Papers
    const papers = await request('https://lms.techcorp.info.vn/api/exam/papers', 'GET', null, adminToken);
    console.log(`  * GET /api/exam/papers: Status ${papers.status}, Số lượng: ${papers.data?.data?.length || 0}`);

    // Question Bank Categories
    const categories = await request('https://lms.techcorp.info.vn/api/exam/categories', 'GET', null, adminToken);
    console.log(`  * GET /api/exam/categories: Status ${categories.status}, Số lượng: ${categories.data?.data?.length || 0}`);

    // Academic Sections modules
    const sec1 = await request('https://lms.techcorp.info.vn/api/academic/lms/sections/1/modules', 'GET', null, adminToken);
    console.log(`  * GET /api/academic/lms/sections/1/modules: Status ${sec1.status}, Số tuần: ${sec1.data?.data?.length || 0}`);
  }

  // 3. Kiểm thử vai trò Giảng viên (gv_cntt)
  console.log('\n--- [3] Kiểm thử quyền & chức năng GIẢNG VIÊN (gv_cntt) ---');
  if (sessions.gv_cntt) {
    const gvToken = sessions.gv_cntt.token;

    // Lấy danh sách lớp phân công
    const gvCourses = await request('https://lms.techcorp.info.vn/api/elearning/courses', 'GET', null, gvToken);
    console.log(`  * GET /api/elearning/courses: Status ${gvCourses.status}, Số môn: ${gvCourses.data?.data?.length || 0}`);

    // Xem chi tiết lớp học phần IT101 (Section 1)
    const sec1 = await request('https://lms.techcorp.info.vn/api/academic/lms/sections/1/modules', 'GET', null, gvToken);
    console.log(`  * GET /api/academic/lms/sections/1/modules: Status ${sec1.status}, Số tuần bài giảng: ${sec1.data?.data?.length || 0}`);

    // Thử tạo module / bài giảng mới
    const addModuleRes = await request('https://lms.techcorp.info.vn/api/academic/lms/modules', 'POST', {
      section_id: 1,
      title: 'Tuần 16 (Bổ trợ): Ôn tập kiến thức & Giải đề mẫu K66',
      week_number: 16,
      learning_objectives: 'Hệ thống hóa kiến thức C++ trước kỳ thi KTHP'
    }, gvToken);
    console.log(`  * POST /api/academic/lms/modules (Giảng viên thêm tuần): Status ${addModuleRes.status}, Thành công: ${addModuleRes.data?.success}`);

    // Ngân hàng câu hỏi
    const qbank = await request('https://lms.techcorp.info.vn/api/exam/categories', 'GET', null, gvToken);
    console.log(`  * GET /api/exam/categories: Status ${qbank.status}, Số danh mục: ${qbank.data?.data?.length || 0}`);

    // Đề thi
    const papers = await request('https://lms.techcorp.info.vn/api/exam/papers', 'GET', null, gvToken);
    console.log(`  * GET /api/exam/papers: Status ${papers.status}, Số đề thi: ${papers.data?.data?.length || 0}`);
  }

  // 4. Kiểm thử vai trò Sinh viên (sv_cntt)
  console.log('\n--- [4] Kiểm thử quyền & chức năng SINH VIÊN (sv_cntt) ---');
  if (sessions.sv_cntt) {
    const svToken = sessions.sv_cntt.token;

    // Môn học sinh viên
    const svCourses = await request('https://lms.techcorp.info.vn/api/elearning/courses', 'GET', null, svToken);
    console.log(`  * GET /api/elearning/courses: Status ${svCourses.status}, Số môn: ${svCourses.data?.data?.length || 0}`);

    // Xem bài giảng môn học (Section 1)
    const svSec1 = await request('https://lms.techcorp.info.vn/api/academic/lms/sections/1/modules', 'GET', null, svToken);
    console.log(`  * GET /api/academic/lms/sections/1/modules: Status ${svSec1.status}, Số tuần sinh viên thấy: ${svSec1.data?.data?.length || 0}`);

    // Đánh dấu hoàn thành bài học (Progress)
    const progRes = await request('https://lms.techcorp.info.vn/api/academic/lms/progress', 'POST', {
      section_id: 1,
      material_id: 1,
      completed: true
    }, svToken);
    console.log(`  * POST /api/academic/lms/progress (Ghi nhận tiến độ học): Status ${progRes.status}, Success: ${progRes.data?.success}`);

    // Quyền dự thi
    const eligibleExams = await request('https://lms.techcorp.info.vn/api/exam/my-eligible-exams', 'GET', null, svToken);
    console.log(`  * GET /api/exam/my-eligible-exams: Status ${eligibleExams.status}, Số môn đủ điều kiện thi: ${eligibleExams.data?.data?.length || 0}`);

    // Kiểm tra vào phòng thi trực tuyến
    const examAccess = await request('https://lms.techcorp.info.vn/api/exam/access?schedule_id=16', 'GET', null, svToken);
    console.log(`  * GET /api/exam/access?schedule_id=16: Status ${examAccess.status}, Quyền thi: ${examAccess.data?.success ? 'HỢP LỆ' : 'TỪ CHỐI'}`);
    if (examAccess.data?.data?.paper) {
      console.log(`    - Đề thi: ${examAccess.data.data.paper.name}, Số câu hỏi: ${examAccess.data.data.paper.questions?.length || 0}`);
    }
  }

  console.log('\n=== KẾT THÚC KIỂM THỬ SƠ BỘ ===');
}

runLiveAudit();
