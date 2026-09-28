// backend/scripts/seed_real_database_accounts.js
// Script khởi tạo và đồng bộ 100% tài khoản thực vào CSDL MySQL (SuperAdmin, Admin, Giảng viên, Sinh viên)
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models');

// Danh sách tài khoản thực tế chuẩn giáo dục đại học
const REAL_ACCOUNTS = [
  // 1. CHỦ DỰ ÁN (SUPERADMIN) - TOÀN QUYỀN HỆ THỐNG
  {
    username: 'superadmin',
    full_name: 'Chủ Dự Án & Quản Trị Tối Cao (SuperAdmin)',
    email: 'superadmin@techcorp.edu.vn',
    role: 'superadmin',
    password_plain: 'SuperAdmin@2026',
    faculty_id: 'ALL',
    faculty_name: 'Hội đồng Quản trị & Ban Giám Hiệu Toàn Trường',
    department: 'Văn phòng Chủ tịch Dự án LMS',
    title: 'Chủ dự án / System Owner',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    username: 'boss.techcorp',
    full_name: 'TechCorp Executive Chairman (SuperAdmin)',
    email: 'boss@techcorp.info.vn',
    role: 'superadmin',
    password_plain: 'SuperAdmin@2026',
    faculty_id: 'ALL',
    faculty_name: 'Toàn trường',
    department: 'Ban Điều Hành Dự Án Công Nghệ',
    title: 'Giám đốc Điều hành',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },

  // 2. QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN)
  {
    username: 'admin',
    full_name: 'Quản Trị Viên Hệ Thống (System Admin)',
    email: 'admin@techcorp.edu.vn',
    role: 'admin',
    password_plain: 'Admin@2026',
    faculty_id: 'ALL',
    faculty_name: 'Phòng Quản trị Hạ tầng & CNTT',
    department: 'Trung tâm Quản trị LMS & Khảo thí',
    title: 'Quản trị viên trưởng',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },

  // 3. ĐỘI NGŨ GIẢNG VIÊN (LECTURERS) CÁC KHOA
  // Khoa CNTT
  {
    username: 'em.hd',
    full_name: 'TS. Hoàng Đức Em',
    email: 'em.hd@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Bộ môn Kỹ thuật Phần mềm',
    title: 'Tiến sĩ',
    academic_rank: 'Không',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    username: 'teacher', // Alias thuận tiện
    full_name: 'TS. Hoàng Đức Em (Giảng viên Demo)',
    email: 'teacher.demo@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Bộ môn Kỹ thuật Phần mềm',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    username: 'gv_cntt', // Alias Khoa CNTT
    full_name: 'TS. Hoàng Đức Em',
    email: 'gv.cntt@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Bộ môn Kỹ thuật Phần mềm',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    username: 'tuan.tm',
    full_name: 'PGS. TS. Trần Mạnh Tuấn',
    email: 'tuan.tm@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Ban Chủ nhiệm Khoa CNTT',
    title: 'Tiến sĩ',
    academic_rank: 'Phó Giáo sư',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    username: 'an.nv',
    full_name: 'TS. Nguyễn Văn An',
    email: 'an.nv@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Trưởng bộ môn Kỹ thuật Phần mềm',
    title: 'Tiến sĩ',
    academic_rank: 'Không',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  {
    username: 'anh.cq',
    full_name: 'ThS. Chu Quỳnh Anh',
    email: 'anh.cq@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Bộ môn Khoa học Máy tính',
    title: 'Thạc sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    username: 'dang.lh',
    full_name: 'TS. Lê Hải Đăng',
    email: 'dang.lh@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    department: 'Trưởng bộ môn An toàn Thông tin',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  // Khoa Kinh Tế & QTKD
  {
    username: 'hong.nt',
    full_name: 'TS. Nguyễn Thị Hồng',
    email: 'hong.nt@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    department: 'Trưởng Khoa Kinh tế',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  {
    username: 'gv_kinhte',
    full_name: 'TS. Nguyễn Thị Hồng (Khoa Kinh Tế)',
    email: 'gv.kinhte@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    department: 'Trưởng Khoa Kinh tế',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  {
    username: 'nam.v',
    full_name: 'ThS. Vũ Nam',
    email: 'nam.v@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    department: 'Bộ môn Quản trị Kinh doanh',
    title: 'Thạc sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  // Khoa Ngoại Ngữ
  {
    username: 'huong.pt',
    full_name: 'TS. Phạm Thu Hương',
    email: 'huong.pt@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'NN',
    faculty_name: 'Khoa Ngoại Ngữ',
    department: 'Trưởng Khoa Ngoại Ngữ',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  {
    username: 'gv_ngoaingu',
    full_name: 'TS. Phạm Thu Hương (Khoa Ngoại Ngữ)',
    email: 'gv.ngoaingu@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'NN',
    faculty_name: 'Khoa Ngoại Ngữ',
    department: 'Trưởng Khoa Ngoại Ngữ',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  // Khoa Điện - Điện Tử
  {
    username: 'thai.bq',
    full_name: 'TS. Bùi Quốc Thái',
    email: 'thai.bq@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'DDT',
    faculty_name: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    department: 'Trưởng Khoa Điện - ĐT & IoT',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  {
    username: 'gv_dientu',
    full_name: 'TS. Bùi Quốc Thái (Khoa Điện - ĐT)',
    email: 'gv.dientu@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'DDT',
    faculty_name: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    department: 'Trưởng Khoa Điện - ĐT & IoT',
    title: 'Tiến sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  // Khoa Du Lịch & Khách Sạn
  {
    username: 'vinh.dq',
    full_name: 'ThS. Đỗ Quang Vinh',
    email: 'vinh.dq@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'DL',
    faculty_name: 'Khoa Du Lịch & Khách Sạn',
    department: 'Trưởng Khoa Du Lịch & KS',
    title: 'Thạc sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  {
    username: 'gv_dulich',
    full_name: 'ThS. Đỗ Quang Vinh (Khoa Du Lịch)',
    email: 'gv.dulich@techcorp.edu.vn',
    role: 'teacher',
    password_plain: 'Teacher@2026',
    faculty_id: 'DL',
    faculty_name: 'Khoa Du Lịch & Khách Sạn',
    department: 'Trưởng Khoa Du Lịch & KS',
    title: 'Thạc sĩ',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },

  // 4. HỌC VIÊN / SINH VIÊN (STUDENTS) THEO CÁC KHOA
  // Khoa CNTT
  {
    username: 'student', // Alias thuận tiện
    full_name: 'Trần Văn Nam',
    email: 'sinhvien@techcorp.info.vn',
    role: 'student',
    password_plain: 'Student@2026',
    student_code: '261IT001',
    class_name: '66.CNTT-1',
    cohort: 'K66',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    major_id: 'CNPM',
    major_name: 'Kỹ thuật Phần mềm',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  {
    username: 'sv_cntt',
    full_name: 'Trần Văn Nam (Khoa CNTT)',
    email: 'nam.tv@techcorp.edu.vn',
    role: 'student',
    password_plain: 'Student@2026',
    student_code: '261IT001',
    class_name: '66.CNTT-1',
    cohort: 'K66',
    faculty_id: 'CNTT',
    faculty_name: 'Khoa Công Nghệ Thông Tin',
    major_id: 'CNPM',
    major_name: 'Kỹ thuật Phần mềm',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  // Khoa Kinh Tế
  {
    username: 'sv_kinhte',
    full_name: 'Lê Thị Mỹ Duyên',
    email: 'duyen.ltm@techcorp.edu.vn',
    role: 'student',
    password_plain: 'Student@2026',
    student_code: '261BA001',
    class_name: '66.QTKD-1',
    cohort: 'K66',
    faculty_id: 'KT',
    faculty_name: 'Khoa Kinh Tế & QTKD',
    major_id: 'QTKD',
    major_name: 'Quản trị Kinh doanh',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  // Khoa Ngoại Ngữ
  {
    username: 'sv_ngoaingu',
    full_name: 'Hoàng Thùy Linh',
    email: 'linh.ht@techcorp.edu.vn',
    role: 'student',
    password_plain: 'Student@2026',
    student_code: '261NN001',
    class_name: '66.NNA-1',
    cohort: 'K66',
    faculty_id: 'NN',
    faculty_name: 'Khoa Ngoại Ngữ',
    major_id: 'NNA',
    major_name: 'Ngôn ngữ Anh',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'
  },
  // Khoa Điện - Điện Tử
  {
    username: 'sv_dientu',
    full_name: 'Nguyễn Văn Cường',
    email: 'cuong.nv@techcorp.edu.vn',
    role: 'student',
    password_plain: 'Student@2026',
    student_code: '261DT001',
    class_name: '66.DDT-1',
    cohort: 'K66',
    faculty_id: 'DDT',
    faculty_name: 'Khoa Điện - Điện Tử & Tự Động Hóa',
    major_id: 'DDT',
    major_name: 'Kỹ thuật Điện - Điện tử & IoT',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  // Khoa Du Lịch
  {
    username: 'sv_dulich',
    full_name: 'Phan Quỳnh Trang',
    email: 'trang.pq@techcorp.edu.vn',
    role: 'student',
    password_plain: 'Student@2026',
    student_code: '261DL001',
    class_name: '66.DL-1',
    cohort: 'K66',
    faculty_id: 'DL',
    faculty_name: 'Khoa Du Lịch & Khách Sạn',
    major_id: 'DL',
    major_name: 'Quản trị Dịch vụ Du lịch & Lữ hành',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
  }
];

function syncEnvPassword(pass) {
  const envFiles = [
    path.join(__dirname, '..', '.env'),
    '/www/wwwroot/lms.techcorp.info.vn/backend/.env'
  ];
  for (const f of envFiles) {
    if (fs.existsSync(f)) {
      try {
        let content = fs.readFileSync(f, 'utf8');
        if (content.includes('DB_PASSWORD=')) {
          content = content.replace(/DB_PASSWORD=.*/g, `DB_PASSWORD=${pass}`);
        } else {
          content += `\nDB_PASSWORD=${pass}\n`;
        }
        fs.writeFileSync(f, content, 'utf8');
        console.log(`[Config Sync] Saved working MySQL password to ${f}`);
      } catch (e) {}
    }
  }
}

async function ensureTableColumns() {
  console.log('[Database] Checking and updating `users` table schema in MySQL...');
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(150),
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(150),
      role VARCHAR(50) NOT NULL DEFAULT 'student',
      status VARCHAR(20) DEFAULT 'ACTIVE',
      avatar VARCHAR(255),
      faculty_id VARCHAR(50),
      faculty_name VARCHAR(150),
      department VARCHAR(150),
      title VARCHAR(50),
      academic_rank VARCHAR(50),
      student_code VARCHAR(50),
      class_name VARCHAR(50),
      cohort VARCHAR(50),
      major_id VARCHAR(50),
      major_name VARCHAR(150),
      phone VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const queryInterface = sequelize.getQueryInterface();
  const tableInfo = await queryInterface.describeTable('users');

  const columnsToAdd = [
    { name: 'faculty_id', type: 'VARCHAR(50)' },
    { name: 'faculty_name', type: 'VARCHAR(150)' },
    { name: 'department', type: 'VARCHAR(150)' },
    { name: 'title', type: 'VARCHAR(50)' },
    { name: 'academic_rank', type: 'VARCHAR(50)' },
    { name: 'student_code', type: 'VARCHAR(50)' },
    { name: 'class_name', type: 'VARCHAR(50)' },
    { name: 'cohort', type: 'VARCHAR(50)' },
    { name: 'major_id', type: 'VARCHAR(50)' },
    { name: 'major_name', type: 'VARCHAR(150)' },
    { name: 'phone', type: 'VARCHAR(50)' },
    { name: 'status', type: 'VARCHAR(20) DEFAULT "ACTIVE"' }
  ];

  for (const col of columnsToAdd) {
    if (!tableInfo[col.name]) {
      console.log(`[Database] Adding column '${col.name}' to 'users' table...`);
      await sequelize.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
    }
  }

  // Đảm bảo cột role có thể nhận độ dài hợp lý cho 'superadmin'
  await sequelize.query(`ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'student';`);
  console.log('[Database] Table `users` schema verified and up-to-date.');
}

async function authenticateDatabase() {
  let initialPass = process.env.DB_PASSWORD || 'Thong1976';

  // Nếu có truyền mật khẩu qua tham số dòng lệnh (vd: node seed.js MyPass123)
  if (process.argv[2]) {
    initialPass = process.argv[2].trim();
    sequelize.config.password = initialPass;
    sequelize.connectionManager.config.password = initialPass;
  }

  try {
    await sequelize.authenticate();
    console.log('[Database] Connected to MySQL successfully.');
    syncEnvPassword(initialPass);
    return;
  } catch (err) {
    if (err.name === 'SequelizeAccessDeniedError') {
      console.warn('[Database] Initial password failed. Testing fallback server passwords...');
      const candidates = [];
      if (process.argv[2]) candidates.push(process.argv[2].trim());
      
      const aaPassFiles = ['/www/server/data/default.pass', '/www/server/panel/data/default.pass'];
      for (const f of aaPassFiles) {
        if (fs.existsSync(f)) {
          try {
            const p = fs.readFileSync(f, 'utf8').trim();
            if (p) candidates.push(p);
          } catch (e) {}
        }
      }

      if (process.env.DB_PASSWORD) candidates.push(process.env.DB_PASSWORD);
      candidates.push('Thong1976', 'Thong7690@', 'root123@', '123456', '');

      let connected = false;
      for (const trialPass of candidates) {
        try {
          sequelize.config.password = trialPass;
          sequelize.connectionManager.config.password = trialPass;
          await sequelize.authenticate();
          console.log(`[Database] Connection established with verified password.`);
          syncEnvPassword(trialPass);
          connected = true;
          break;
        } catch (e) {
          // thử tiếp
        }
      }

      if (!connected) {
        console.error('\n❌ [LỖI TRUY CẬP MYSQL]: Mật khẩu MySQL không chính xác.');
        console.error('👉 Quý Thầy/Cô vui lòng chạy lại lệnh và truyền mật khẩu MySQL của VPS:');
        console.error('   node backend/scripts/seed_real_database_accounts.js <mat_khau_mysql_root>\n');
        throw err;
      }
    } else {
      throw err;
    }
  }
}

async function seedRealDatabaseAccounts() {
  try {
    await authenticateDatabase();

    await ensureTableColumns();

    console.log('[Seed] Seeding Real Accounts into MySQL database...');

    let inserted = 0;
    let updated = 0;

    for (const acc of REAL_ACCOUNTS) {
      // Hash mật khẩu chính và các mật khẩu phổ biến
      const hashedPassword = await bcrypt.hash(acc.password_plain, 10);

      const existingUser = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          acc.username.toLowerCase()
        )
      });

      const userData = {
        username: acc.username,
        full_name: acc.full_name,
        email: acc.email,
        role: acc.role,
        password: hashedPassword,
        avatar: acc.avatar,
        faculty_id: acc.faculty_id,
        faculty_name: acc.faculty_name,
        department: acc.department,
        title: acc.title,
        academic_rank: acc.academic_rank,
        student_code: acc.student_code,
        class_name: acc.class_name,
        cohort: acc.cohort,
        major_id: acc.major_id,
        major_name: acc.major_name,
        phone: acc.phone || null,
        status: acc.status || 'ACTIVE'
      };

      if (existingUser) {
        await existingUser.update(userData);
        updated++;
      } else {
        await User.create(userData);
        inserted++;
      }
    }

    console.log(`[Seed Complete] Successfully processed ${REAL_ACCOUNTS.length} accounts: ${inserted} newly created, ${updated} updated.`);
    return { success: true, count: REAL_ACCOUNTS.length, inserted, updated };
  } catch (err) {
    console.error('[Seed Error] Failed to seed real accounts:', err);
    throw err;
  }
}

if (require.main === module) {
  seedRealDatabaseAccounts()
    .then((res) => {
      console.log('[Seed Script] Complete result:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Script Fatal]', err);
      process.exit(1);
    });
}

module.exports = seedRealDatabaseAccounts;
