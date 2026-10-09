// backend/middleware/security.js
// Tường lửa ứng dụng (Application WAF), Giới hạn tần suất truy cập (Rate Limiting) & Bộ tiêu đề an ninh HTTP
// Tuân thủ OWASP Top 10, Nghị định 85/2016/NĐ-CP & Tiêu chuẩn An toàn thông tin Cấp độ 3
'use strict';

// -------------------------------------------------------------
// 1. IN-MEMORY SLIDING-WINDOW RATE LIMITER
// -------------------------------------------------------------
class InMemoryRateLimiter {
  constructor() {
    this.hits = new Map(); // key -> [timestamps]
    
    // Tự động dọn dẹp các bản ghi cũ mỗi 2 phút để giải phóng bộ nhớ
    setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of this.hits.entries()) {
        const validTimestamps = timestamps.filter(ts => now - ts < 120000);
        if (validTimestamps.length === 0) {
          this.hits.delete(key);
        } else {
          this.hits.set(key, validTimestamps);
        }
      }
    }, 120000);
  }

  /**
   * Tạo middleware giới hạn tần suất cho một nhóm route
   * @param {Object} options
   * @param {number} options.windowMs - Khung thời gian trượt (ms)
   * @param {number} options.max - Số lượng yêu cầu tối đa
   * @param {string} options.message - Thông báo lỗi khi vi phạm
   */
  limit({ windowMs = 60000, max = 60, message = 'Quá nhiều yêu cầu từ địa chỉ IP này.' }) {
    return (req, res, next) => {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const cleanIp = String(ip).split(',')[0].trim();
      const routePrefix = req.baseUrl || req.path;
      const key = `${cleanIp}:${routePrefix}`;

      const now = Date.now();
      const clientTimestamps = this.hits.get(key) || [];
      const windowStart = now - windowMs;

      // Loại bỏ các request đã hết hạn trong window
      const recentHits = clientTimestamps.filter(ts => ts > windowStart);

      if (recentHits.length >= max) {
        const oldestHit = recentHits[0];
        const retryAfterSeconds = Math.ceil((oldestHit + windowMs - now) / 1000);
        
        res.setHeader('Retry-After', String(Math.max(1, retryAfterSeconds)));
        res.setHeader('X-RateLimit-Limit', String(max));
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', String(Math.ceil((oldestHit + windowMs) / 1000)));

        return res.status(429).json({
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          message: `${message} Vui lòng thử lại sau ${Math.max(1, retryAfterSeconds)} giây (OWASP Anti-DDoS & Brute-force Guard).`,
          retry_after_seconds: Math.max(1, retryAfterSeconds)
        });
      }

      recentHits.push(now);
      this.hits.set(key, recentHits);

      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - recentHits.length)));
      next();
    };
  }
}

const rateLimiter = new InMemoryRateLimiter();

// Giới hạn xác thực: 5 lần/phút/IP (Chống dò quét mật khẩu & brute-force OTP)
const authRateLimiter = rateLimiter.limit({
  windowMs: 60 * 1000,
  max: 6, // 6 lần/phút
  message: 'Bạn đã thử đăng nhập quá nhiều lần.'
});

// Giới hạn nộp bài thi: 15 lần/phút/IP (Chống spam nộp đề làm nghẽn DB)
const examSubmitLimiter = rateLimiter.limit({
  windowMs: 60 * 1000,
  max: 15,
  message: 'Thao tác nộp bài diễn ra quá nhanh.'
});

// Giới hạn API chung: 300 lần/phút/IP
const globalApiLimiter = rateLimiter.limit({
  windowMs: 60 * 1000,
  max: 300,
  message: 'Lưu lượng truy cập vượt quá ngưỡng cho phép của máy chủ.'
});

// -------------------------------------------------------------
// 2. HTTP SECURITY HEADERS (Tương đương Helmet)
// -------------------------------------------------------------
function securityHeadersMiddleware(req, res, next) {
  // Chống MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Chống Clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Kích hoạt bộ lọc XSS của trình duyệt
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Ép kết nối HTTPS an toàn (HSTS 1 năm)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Chính sách Referrer an toàn
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Quyền truy cập thiết bị (hỗ trợ camera/mic cho phòng thi WebRTC)
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()');
  // Ẩn thông tin công nghệ nền tảng
  res.removeHeader('X-Powered-By');
  next();
}

// -------------------------------------------------------------
// 3. WAF PAYLOAD INSPECTOR (Chống SQLi & Malicious Scripts)
// -------------------------------------------------------------
const SQLI_PATTERNS = [
  /(\bunion\s+select\b)/i,
  /(\bdrop\s+table\b)/i,
  /(\binsert\s+into\b.*\bvalues\b)/i,
  /(--\s*$)/m,
  /(;\s*exec\s*\()/i,
  /('\s*or\s*'1'\s*=\s*'1)/i
];

const DANGEROUS_XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/i,
  /onerror\s*=\s*['"][^'"]*['"]/i
];

function wafInspectorMiddleware(req, res, next) {
  // Chỉ kiểm tra các phương thức có body hoặc query
  const checkString = (str) => {
    if (!str || typeof str !== 'string') return false;
    for (const pattern of SQLI_PATTERNS) {
      if (pattern.test(str)) return { type: 'SQL_INJECTION', pattern: pattern.toString() };
    }
    for (const pattern of DANGEROUS_XSS_PATTERNS) {
      if (pattern.test(str)) return { type: 'XSS_ATTACK', pattern: pattern.toString() };
    }
    return false;
  };

  const inspectObject = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    for (const key of Object.keys(obj)) {
      if (['public_key_pem', 'signature_base64', 'certificate_pem', 'signatureEnvelope'].includes(key)) {
        continue;
      }
      const val = obj[key];
      if (typeof val === 'string') {
        const threat = checkString(val);
        if (threat) return threat;
      } else if (typeof val === 'object' && val !== null) {
        const threat = inspectObject(val);
        if (threat) return threat;
      }
    }
    return false;
  };

  // Bỏ qua kiểm tra các trường nội dung bài giảng HTML / Markdown hợp lệ hoặc gói xác thực chữ ký số PKI
  if (
    req.path.startsWith('/api/elearning') || 
    req.path.startsWith('/api/academic/lms') ||
    req.path.startsWith('/api/academic/enterprise/gradebook')
  ) {
    return next();
  }

  const queryThreat = inspectObject(req.query);
  if (queryThreat) {
    console.warn(`[WAF Block] Phát hiện mẫu tấn công ${queryThreat.type} trong query từ IP ${req.ip}`);
    return res.status(403).json({
      success: false,
      code: 'WAF_BLOCKED',
      message: 'Yêu cầu bị từ chối bởi Tường lửa Ứng dụng LMS (Phát hiện cú pháp truy vấn không an toàn).'
    });
  }

  const bodyThreat = inspectObject(req.body);
  if (bodyThreat) {
    console.warn(`[WAF Block] Phát hiện mẫu tấn công ${bodyThreat.type} trong request body từ IP ${req.ip}`);
    return res.status(403).json({
      success: false,
      code: 'WAF_BLOCKED',
      message: 'Dữ liệu gửi lên bị chặn bởi Tường lửa Ứng dụng LMS (Phát hiện chuỗi mã độc hại).'
    });
  }

  next();
}

module.exports = {
  authRateLimiter,
  examSubmitLimiter,
  globalApiLimiter,
  securityHeadersMiddleware,
  wafInspectorMiddleware
};
