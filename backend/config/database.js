// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Tự động tìm và nạp tệp .env dù lệnh được thực thi từ bất kỳ thư mục nào
const envCandidates = [
  path.join(__dirname, '..', '.env'),           // backend/.env
  path.join(process.cwd(), 'backend', '.env'),  // từ root project: backend/.env
  path.join(process.cwd(), '.env'),             // cwd/.env
  '/www/wwwroot/lms.techcorp.info.vn/backend/.env' // đường dẫn tuyệt đối trên VPS
];

for (const envFile of envCandidates) {
  if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
    break;
  }
}

// Hàm xác định mật khẩu tối ưu (hỗ trợ tự động dò mật khẩu aaPanel default.pass)
function getResolvedDbPassword() {
  const envPass = process.env.DB_PASSWORD;
  // Nếu env đã có mật khẩu khác mặc định root123@ thì ưu tiên dùng
  if (envPass && envPass !== 'root123@') {
    return envPass;
  }

  // Tự động nhận diện mật khẩu mặc định của aaPanel nếu có
  const aaPassFiles = [
    '/www/server/data/default.pass',
    '/www/server/panel/data/default.pass'
  ];
  for (const f of aaPassFiles) {
    if (fs.existsSync(f)) {
      try {
        const pass = fs.readFileSync(f, 'utf8').trim();
        if (pass) {
          return pass;
        }
      } catch (e) {}
    }
  }

  return envPass || 'root123@';
}

const dbUser = process.env.DB_USER || 'root';
const dbPass = getResolvedDbPassword();
const dbName = process.env.DB_NAME || 'lms_db';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPass,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;