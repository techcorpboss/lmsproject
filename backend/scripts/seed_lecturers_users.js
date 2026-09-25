// backend/scripts/seed_lecturers_users.js
// Migration & Seed script: Synchronizes the 7 standard Enterprise Lecturers and Students into the MySQL 'users' table
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models');

const LECTURERS_DATA = [
  {
    username: 'em.hd',
    full_name: 'TS. Hoàng Đức Em',
    email: 'em.hd@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    username: 'teacher', // Alias for primary demo lecturer
    full_name: 'TS. Hoàng Đức Em',
    email: 'teacher.demo@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    username: 'tuan.tm',
    full_name: 'PGS. TS. Trần Mạnh Tuấn',
    email: 'tuan.tm@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    username: 'an.nv',
    full_name: 'TS. Nguyễn Văn An',
    email: 'an.nv@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    username: 'anh.cq',
    full_name: 'ThS. Chu Quỳnh Anh',
    email: 'anh.cq@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    username: 'dang.lh',
    full_name: 'TS. Lê Hải Đăng',
    email: 'dang.lh@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    username: 'hong.nt',
    full_name: 'TS. Nguyễn Thị Hồng',
    email: 'hong.nt@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  {
    username: 'gv_kinhte', // Alias for demo
    full_name: 'TS. Nguyễn Thị Hồng',
    email: 'gv.kinhte@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  {
    username: 'nam.v',
    full_name: 'ThS. Vũ Nam',
    email: 'nam.v@techcorp.edu.vn',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  }
];

const STUDENTS_AND_ADMIN_DATA = [
  {
    username: 'admin',
    full_name: 'Quản trị viên Hệ thống (Admin)',
    email: 'admin@techcorp.info.vn',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  {
    username: 'student',
    full_name: 'Trần Văn Nam',
    email: 'sinhvien@techcorp.info.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  {
    username: 'sv_cntt',
    full_name: 'Trần Văn Nam',
    email: 'nam.tv@techcorp.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  {
    username: 'sv_kinhte',
    full_name: 'Lê Thị Mỹ Duyên',
    email: 'duyen.ltm@techcorp.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  {
    username: 'sv_ngoaingu',
    full_name: 'Hoàng Thùy Linh',
    email: 'linh.ht@techcorp.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'
  },
  {
    username: 'sv_dientu',
    full_name: 'Nguyễn Văn Cường',
    email: 'cuong.nv@techcorp.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  {
    username: 'sv_dulich',
    full_name: 'Phan Quỳnh Trang',
    email: 'trang.pq@techcorp.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
  }
];

async function seedEnterpriseLecturers() {
  try {
    console.log('[Seed] Starting Enterprise Lecturers and Accounts synchronization...');
    await sequelize.authenticate();

    const hashedPassword = await bcrypt.hash('root123@', 10);
    const allUsersToSeed = [...LECTURERS_DATA, ...STUDENTS_AND_ADMIN_DATA];

    let createdCount = 0;
    let updatedCount = 0;

    for (const userData of allUsersToSeed) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (existingUser) {
        await existingUser.update({
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          password: hashedPassword
        });
        updatedCount++;
      } else {
        await User.create({
          username: userData.username,
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          password: hashedPassword
        });
        createdCount++;
      }
    }

    console.log(`[Seed] Synchronization complete: ${createdCount} created, ${updatedCount} updated.`);
    return { success: true, createdCount, updatedCount };
  } catch (error) {
    console.error('[Seed Error] Failed to seed enterprise accounts:', error.message);
    throw error;
  }
}

if (require.main === module) {
  seedEnterpriseLecturers()
    .then(() => {
      console.log('[Seed] Database integrity established successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Fatal]', err);
      process.exit(1);
    });
}

module.exports = seedEnterpriseLecturers;
