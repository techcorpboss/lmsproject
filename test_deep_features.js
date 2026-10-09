// test_deep_features.js
const https = require('https');

async function apiRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve) => {
    const url = new URL(path, 'https://lms.techcorp.info.vn');
    const start = Date.now();
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TCU-Deep-Auditor/1.0'
    };
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = https.request(url, { method, headers, timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch(e) {}
        resolve({
          path,
          method,
          status: res.statusCode,
          duration: Date.now() - start,
          headers: res.headers,
          dataLength: data.length,
          snippet: data.slice(0, 300),
          json
        });
      });
    });
    req.on('error', err => resolve({ path, error: err.message, duration: Date.now() - start }));
    req.on('timeout', () => { req.destroy(); resolve({ path, error: 'TIMEOUT', duration: Date.now() - start }); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  console.log('=== 1. ĐĂNG NHẬP & PHÂN QUYỀN RBAC ===');
  const loginSuper = await apiRequest('/api/auth/login', 'POST', { username: 'superadmin', password: 'SuperAdmin@2026' });
  const superToken = loginSuper.json?.token;
  console.log('Superadmin Login:', loginSuper.status, `(${loginSuper.duration}ms)`, 'Token:', superToken ? 'CÓ' : 'KHÔNG');

  const loginTeacher = await apiRequest('/api/auth/login', 'POST', { username: 'em.hd', password: 'Teacher@2026' });
  const teacherToken = loginTeacher.json?.token;
  console.log('Giảng viên (em.hd) Login:', loginTeacher.status, `(${loginTeacher.duration}ms)`);

  const loginStudent = await apiRequest('/api/auth/login', 'POST', { username: 'sv_cntt', password: 'Student@2026' });
  const studentToken = loginStudent.json?.token;
  console.log('Sinh viên (sv_cntt) Login:', loginStudent.status, `(${loginStudent.duration}ms)`);

  console.log('\n=== 2. THỬ NGHIỆM VIRTUAL CLASSROOM (LỚP HỌC TRỰC TUYẾN WEBRTC) ===');
  const createRoom = await apiRequest('/api/elearning/virtual-classroom/room', 'POST', {
    courseId: 101,
    courseName: 'Cơ sở Dữ liệu Phân tán & Đám mây',
    weekIndex: 5,
    sectionId: '66.CNTT-1',
    title: 'Tuần 5: Thiết kế Kiến trúc Sharding & Replication'
  }, teacherToken);
  console.log('Tạo phòng học:', createRoom.status, `(${createRoom.duration}ms)`, createRoom.json?.room?.meetingUrl || createRoom.snippet);

  const roomId = createRoom.json?.room?.roomId;
  if (roomId) {
    const accessGv = await apiRequest(`/api/elearning/virtual-classroom/access/${roomId}`, 'GET', null, teacherToken);
    console.log('Giảng viên truy cập phòng:', accessGv.status, 'Vai trò:', accessGv.json?.userRole, 'isModerator:', accessGv.json?.isModerator);

    const accessSv = await apiRequest(`/api/elearning/virtual-classroom/access/${roomId}`, 'GET', null, studentToken);
    console.log('Sinh viên truy cập phòng:', accessSv.status, 'Vai trò:', accessSv.json?.userRole, 'isModerator:', accessSv.json?.isModerator);

    const attendance = await apiRequest(`/api/elearning/virtual-classroom/attendance/${roomId}`, 'GET', null, teacherToken);
    console.log('Sổ điểm danh tự động:', attendance.status, 'Tổng người tham gia:', attendance.json?.report?.totalParticipants);
  }

  console.log('\n=== 3. THỬ NGHIỆM KÝ SỐ PKI BẢNG ĐIỂM (TT 41/2017 & TT 08/2021) ===');
  const signGradebook = await apiRequest('/api/academic/enterprise/gradebook/sign', 'POST', {
    gradebookData: {
      section_id: '66.CNTT-1',
      course_code: 'IT101',
      course_name: 'Nhập môn Lập trình C/C++',
      semester: 'Học kỳ 1 - 2026-2027',
      grades: [
        { student_id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', attendance_score: 9.5, midterm_score: 9.0, final_score: 9.5, total_score_10: 9.35, letter_grade: 'A+' }
      ]
    },
    signerInfo: {
      id: 'GV-001',
      name: 'TS. Hoàng Đức Em',
      title: 'Giảng viên chính',
      department: 'Khoa Công nghệ Thông tin'
    }
  }, teacherToken);
  console.log('Ký số bảng điểm:', signGradebook.status, `(${signGradebook.duration}ms)`, 'Thuật toán:', signGradebook.json?.signatureEnvelope?.algorithm);

  const signatureEnvelope = signGradebook.json?.signatureEnvelope;
  if (signatureEnvelope) {
    const verifyNormal = await apiRequest('/api/academic/enterprise/gradebook/verify', 'POST', {
      gradebookData: {
        section_id: '66.CNTT-1',
        course_code: 'IT101',
        course_name: 'Nhập môn Lập trình C/C++',
        semester: 'Học kỳ 1 - 2026-2027',
        grades: [
          { student_id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', attendance_score: 9.5, midterm_score: 9.0, final_score: 9.5, total_score_10: 9.35, letter_grade: 'A+' }
        ]
      },
      signatureEnvelope
    }, teacherToken);
    console.log('Thẩm tra bảng điểm nguyên bản:', verifyNormal.status, 'Hợp lệ:', verifyNormal.json?.isValid, 'Thông điệp:', verifyNormal.json?.message);

    // Thẩm tra phát hiện can thiệp trộm điểm
    const verifyTampered = await apiRequest('/api/academic/enterprise/gradebook/verify', 'POST', {
      gradebookData: {
        section_id: '66.CNTT-1',
        course_code: 'IT101',
        course_name: 'Nhập môn Lập trình C/C++',
        semester: 'Học kỳ 1 - 2026-2027',
        grades: [
          { student_id: 1, student_code: '261IT001', full_name: 'Trần Văn Nam', attendance_score: 9.5, midterm_score: 9.0, final_score: 10.0, total_score_10: 9.75, letter_grade: 'A+' }
        ]
      },
      signatureEnvelope
    }, teacherToken);
    console.log('Thẩm tra khi có can thiệp sửa điểm:', verifyTampered.status, 'isTampered:', verifyTampered.json?.isTampered, 'Lỗi:', verifyTampered.json?.error);
  }

  console.log('\n=== 4. THỬ NGHIỆM SAFE EXAM BROWSER (SEB) & KHẢO THÍ ===');
  const sebConfig = await apiRequest('/api/exam/seb/config?scheduleId=6', 'GET', null, studentToken);
  console.log('Tạo tệp cấu hình SEB:', sebConfig.status, `(${sebConfig.duration}ms)`, 'File:', sebConfig.json?.data?.fileName, 'Khóa bài thi:', sebConfig.json?.data?.examKey?.slice(0, 16));

  const sebVerifyNormal = await apiRequest('/api/exam/seb/verify', 'GET', null, studentToken);
  console.log('Kiểm tra Client thông thường:', sebVerifyNormal.status, 'isSebBrowser:', sebVerifyNormal.json?.data?.isSebBrowser, 'Khuyến nghị:', sebVerifyNormal.json?.data?.recommendation);

  console.log('\n=== 5. THỬ NGHIỆM CẤP & XÁC MINH HUY HIỆU 1EDTECH OPEN BADGES V3.0 ===');
  const issueBadge = await apiRequest('/api/badges/issue', 'POST', {
    badgeCode: 'TCU-BADGE-DIGITAL-LEAD',
    student: {
      studentId: 12,
      studentCode: '261IT001',
      studentName: 'Trần Văn Nam',
      email: 'nam.tv@techcorp.edu.vn'
    },
    evidence: {
      scoreText: 'Hoàn thành đồ án AI và Chuyển đổi số Xuất sắc',
      courseName: 'Ứng dụng AI & Công nghệ Số trong Giảng dạy Đại học',
      decisionNo: 'QĐ-888/QĐ-TCU'
    }
  }, teacherToken);
  console.log('Cấp huy hiệu số mới:', issueBadge.status, `(${issueBadge.duration}ms)`, 'Assertion ID:', issueBadge.json?.assertion?.assertionId);

  const assertionId = issueBadge.json?.assertion?.assertionId;
  if (assertionId) {
    const publicVerify = await apiRequest(`/api/badges/verify/${assertionId}`, 'GET');
    console.log('Thẩm tra QR công khai (Không cần token):', publicVerify.status, 'Hợp lệ:', publicVerify.json?.isValid, 'Chủ sở hữu:', publicVerify.json?.recipientName, 'Huy hiệu:', publicVerify.json?.badgeName);
  }

  console.log('\n=== 6. ĐO LƯỜNG TỐC ĐỘ & HIỆU NĂNG TẢI ĐỒNG THỜI (CONCURRENCY BENCHMARK) ===');
  const CONCURRENT_REQUESTS = 30;
  const startConc = Date.now();
  const promises = [];
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    promises.push(apiRequest('/api/admin/cache/stats'));
  }
  const results = await Promise.all(promises);
  const totalConcTime = Date.now() - startConc;
  const successCount = results.filter(r => r.status === 200).length;
  const avgLatency = Math.round(results.reduce((acc, r) => acc + r.duration, 0) / results.length);
  console.log(`Gửi ${CONCURRENT_REQUESTS} yêu cầu đồng thời tới Cache API:`);
  console.log(`  - Thành công: ${successCount}/${CONCURRENT_REQUESTS} (${Math.round(successCount/CONCURRENT_REQUESTS*100)}%)`);
  console.log(`  - Tổng thời gian hoàn tất: ${totalConcTime}ms`);
  console.log(`  - Độ trễ trung bình mỗi request: ${avgLatency}ms`);

  console.log('\n=== 7. KIỂM TRA BỘ NHỚ & DUNG LƯỢNG MÁY CHỦ UBUNTU THỰC TẾ ===');
  const cacheStats = await apiRequest('/api/admin/cache/stats');
  console.log('Cache Engine:', cacheStats.json?.stats?.engine, 'Status:', cacheStats.json?.stats?.status);
})();
