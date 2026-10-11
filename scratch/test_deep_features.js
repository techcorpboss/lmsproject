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

async function deepAudit() {
  console.log('=== ĐÁNH GIÁ CHUYÊN SÂU TỪNG PHÂN HỆ TRÊN https://lms.techcorp.info.vn ===\n');

  // Đăng nhập 3 tài khoản
  const adminLogin = await request('https://lms.techcorp.info.vn/api/auth/login', 'POST', { username: 'admin', password: 'Admin@2026' });
  const gvLogin = await request('https://lms.techcorp.info.vn/api/auth/login', 'POST', { username: 'gv_cntt', password: 'Teacher@2026' });
  const svLogin = await request('https://lms.techcorp.info.vn/api/auth/login', 'POST', { username: 'sv_cntt', password: 'Student@2026' });

  const adminToken = adminLogin.data?.token;
  const gvToken = gvLogin.data?.token;
  const svToken = svLogin.data?.token;

  console.log('Tokens obtained:', { admin: !!adminToken, gv: !!gvToken, sv: !!svToken });

  // 1. Phân hệ Chuẩn e-Learning (SCORM / xAPI / LTI)
  console.log('\n--- 1. Kiểm tra Chuẩn e-Learning (SCORM/xAPI/LTI) ---');
  const scormRes = await request('https://lms.techcorp.info.vn/api/standards/scorm/packages', 'GET', null, adminToken);
  console.log('SCORM Packages:', scormRes.status, 'Count:', scormRes.data?.data?.length ?? (scormRes.data ? 'Object' : 'None'));

  const ltiRes = await request('https://lms.techcorp.info.vn/api/standards/lti/tools', 'GET', null, adminToken);
  console.log('LTI 1.3 Tools:', ltiRes.status, 'Count:', ltiRes.data?.data?.length ?? (ltiRes.data ? 'Object' : 'None'));

  const xapiRes = await request('https://lms.techcorp.info.vn/api/standards/xapi/statements', 'GET', null, adminToken);
  console.log('xAPI Statements:', xapiRes.status, 'Count:', xapiRes.data?.data?.length ?? (xapiRes.data ? 'Object' : 'None'));

  // 2. Phân hệ Khảo thí & Đề thi
  console.log('\n--- 2. Kiểm tra Phân hệ Khảo thí & Tổ chức Thi ---');
  const papersRes = await request('https://lms.techcorp.info.vn/api/exam/papers', 'GET', null, gvToken);
  console.log('Tổng số đề thi trong ngân hàng:', papersRes.status, papersRes.data?.data?.length);

  // Thử lấy chi tiết 1 đề thi 40 câu
  if (papersRes.data?.data?.length > 0) {
    const paperId = papersRes.data.data[0].id;
    const paperDetail = await request(`https://lms.techcorp.info.vn/api/exam/papers/${paperId}`, 'GET', null, gvToken);
    console.log(`Chi tiết đề thi #${paperId} (${papersRes.data.data[0].paper_code}):`, paperDetail.status, {
      name: paperDetail.data?.data?.name,
      questions_count: paperDetail.data?.data?.questions?.length || 0,
      total_marks: paperDetail.data?.data?.total_marks
    });
  }

  // 3. Phân hệ Diễn đàn & Thảo luận
  console.log('\n--- 3. Kiểm tra Diễn đàn Thảo luận lớp học phần ---');
  const discRes = await request('https://lms.techcorp.info.vn/api/academic/lms/sections/1/discussions', 'GET', null, svToken);
  console.log('Diễn đàn Section 1:', discRes.status, 'Số bài thảo luận:', discRes.data?.data?.length);

  // Sinh viên gửi câu hỏi mới
  const postDisc = await request('https://lms.techcorp.info.vn/api/academic/lms/discussions', 'POST', {
    section_id: 1,
    title: 'Câu hỏi kiểm thử tự động về con trỏ hàm trong C++',
    content: 'Thầy cho em hỏi sự khác biệt giữa con trỏ hàm (function pointer) và con trỏ void* trong lập trình nhúng?',
    author_name: 'Trần Văn Nam (66.CNTT-1)'
  }, svToken);
  console.log('Sinh viên gửi thảo luận mới:', postDisc.status, 'Success:', postDisc.data?.success);

  // 4. Phân hệ Quiz quá trình (Tuần 1)
  console.log('\n--- 4. Kiểm tra Quiz quá trình tuần ---');
  const modRes = await request('https://lms.techcorp.info.vn/api/academic/lms/sections/1/modules', 'GET', null, svToken);
  const week1Quiz = modRes.data?.modules?.[0]?.quizzes?.[0];
  console.log('Week 1 Quiz:', week1Quiz ? { id: week1Quiz.id, title: week1Quiz.title, q_count: week1Quiz.questions?.length } : 'None');

  if (week1Quiz) {
    // Sinh viên nộp bài quiz tuần 1
    const submitQuizRes = await request(`https://lms.techcorp.info.vn/api/academic/lms/quizzes/${week1Quiz.id}/submit`, 'POST', {
      answers: { "1": 0, "2": 1, "3": 0, "4": 2, "5": 1 },
      student_id: 12
    }, svToken);
    console.log('Sinh viên nộp bài Quiz tuần 1:', submitQuizRes.status, submitQuizRes.data);
  }

  // 5. Phân hệ Enterprise & Sổ điểm MOET
  console.log('\n--- 5. Kiểm tra Sổ điểm chuẩn MOET (Thông tư 08) ---');
  const gradebookRes = await request('https://lms.techcorp.info.vn/api/academic/enterprise/gradebook/1', 'GET', null, gvToken);
  console.log('Sổ điểm Section 1:', gradebookRes.status, gradebookRes.data?.data ? 'Có dữ liệu' : gradebookRes.data?.message || 'Không có');

  // 6. Phân hệ Huy hiệu số (Open Badges)
  console.log('\n--- 6. Kiểm tra Open Badges ---');
  const badgesRes = await request('https://lms.techcorp.info.vn/api/badges/my-badges', 'GET', null, svToken);
  console.log('Huy hiệu của sinh viên:', badgesRes.status, 'Số lượng:', badgesRes.data?.data?.length ?? 0);

  // 7. Phân hệ Thông báo hệ thống
  console.log('\n--- 7. Kiểm tra Thông báo (Notifications) ---');
  const notifRes = await request('https://lms.techcorp.info.vn/api/notifications', 'GET', null, svToken);
  console.log('Thông báo của sinh viên:', notifRes.status, 'Số lượng:', notifRes.data?.data?.length ?? 0);

  console.log('\n=== HOÀN TẤT ĐÁNH GIÁ CHUYÊN SÂU ===');
}

deepAudit();
