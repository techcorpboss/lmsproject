// test_live_system.js
const https = require('https');

async function testEndpoint(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(path, 'https://lms.techcorp.info.vn');
    const start = Date.now();
    const reqHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TCU-Live-Auditor/1.0',
      ...headers
    };
    if (body) {
      reqHeaders['Content-Type'] = 'application/json';
    }
    const req = https.request(url, { method, headers: reqHeaders, timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        let json = null;
        try { json = JSON.parse(data); } catch(e) {}
        resolve({
          path,
          method,
          status: res.statusCode,
          headers: res.headers,
          duration,
          dataLength: data.length,
          snippet: data.slice(0, 200),
          json
        });
      });
    });
    req.on('error', err => resolve({ path, method, error: err.message, duration: Date.now() - start }));
    req.on('timeout', () => { req.destroy(); resolve({ path, method, error: 'TIMEOUT', duration: Date.now() - start }); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  console.log('========================================================================');
  console.log('   KIỂM THỬ THỰC TẾ HỆ THỐNG LIVE: HTTPS://LMS.TECHCORP.INFO.VN');
  console.log('========================================================================\n');

  const tests = [
    { path: '/' },
    { path: '/api/notifications/vapid-key' },
    { path: '/api/badges/classes' },
    { path: '/api/standards/scorm/packages' },
    { path: '/api/academic/enterprise/catalogs/all' },
    { path: '/api/academic/enterprise/transcripts/class/1' },
    { path: '/api/academic/enterprise/curriculum/compliance' },
    { path: '/api/admin/cache/stats' },
    { path: '/api/exam/categories' },
    { path: '/api/exam/questions' },
    { path: '/api/exam/seb/config' },
    { path: '/api/auth/login', method: 'POST', body: { username: 'superadmin', password: 'SuperAdmin@2026' } },
    { path: '/api/auth/login', method: 'POST', body: { username: 'em.hd', password: 'Teacher@2026' } },
    { path: '/api/auth/login', method: 'POST', body: { username: 'sv_cntt', password: 'Student@2026' } },
    { path: '/manifest.json' },
    { path: '/service-worker.js' }
  ];

  let token = null;

  for (const t of tests) {
    const res = await testEndpoint(t.path, t.method || 'GET', t.body || null);
    const statusText = res.status ? `[${res.status}]` : `[ERR: ${res.error}]`;
    const preview = res.json ? JSON.stringify(res.json).slice(0, 140) : res.snippet.slice(0, 100).replace(/\r?\n|\r/g, ' ');
    console.log(`${statusText} ${t.method || 'GET'} ${t.path} (${res.duration}ms) => ${preview}`);

    if (t.path === '/api/auth/login' && res.json && res.json.token) {
      token = res.json.token;
    }
  }

  // If token received, test protected endpoints
  if (token) {
    console.log('\n--- Kiểm thử các API yêu cầu Token (Xác thực người dùng) ---');
    const protectedTests = [
      { path: '/api/elearning/courses' },
      { path: '/api/badges/my-badges' },
      { path: '/api/exam/my-eligible-exams' },
      { path: '/api/academic/enterprise/hierarchy' }
    ];
    for (const pt of protectedTests) {
      const res = await testEndpoint(pt.path, 'GET', null, { Authorization: `Bearer ${token}` });
      const statusText = res.status ? `[${res.status}]` : `[ERR: ${res.error}]`;
      const preview = res.json ? JSON.stringify(res.json).slice(0, 140) : res.snippet.slice(0, 100).replace(/\r?\n|\r/g, ' ');
      console.log(`${statusText} GET ${pt.path} (${res.duration}ms) => ${preview}`);
    }
  }

  // Test Security Headers on response
  console.log('\n--- Kiểm tra Tiêu đề Bảo mật (Security Headers) ---');
  const rootRes = await testEndpoint('/');
  const secHeaders = ['strict-transport-security', 'x-content-type-options', 'x-frame-options', 'x-xss-protection', 'content-security-policy'];
  for (const h of secHeaders) {
    console.log(`  ${h}: ${rootRes.headers ? rootRes.headers[h] || 'CHƯA CÓ (MISSING)' : 'N/A'}`);
  }
})();
