// backend/scripts/migrate_json_to_mysql.js
// 🔄 Chuyển Đổi Toàn Bộ Dữ Liệu Học Liệu Từ File JSON Sang CSDL Quan Hệ MySQL
const path = require('path');
const fs = require('fs');

const envCandidates = [
  path.join(__dirname, '..', '.env'),
  path.join(process.cwd(), 'backend', '.env'),
  path.join(process.cwd(), '.env'),
  '/www/wwwroot/lms.techcorp.info.vn/backend/.env'
];

for (const envFile of envCandidates) {
  if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
    console.log(`[ENV] Đã nạp cấu hình từ: ${envFile}`);
    break;
  }
}

if (process.argv[2]) {
  process.env.DB_PASSWORD = process.argv[2];
}

const {
  sequelize,
  AcademicMaterial,
  AcademicNotification
} = require('../models');

async function migrate() {
  console.log('========================================================================');
  console.log('🔄 BẮT ĐẦU CHUYỂN ĐỔI HỌC LIỆU TỪ JSON SANG CSDL MYSQL THUẦN NHẤT');
  console.log('========================================================================');

  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công!');

    await AcademicMaterial.sync({ alter: true });
    console.log('✅ Bảng academic_materials: OK');

    await AcademicNotification.sync({ alter: true });
    console.log('✅ Bảng academic_notifications: OK');

    // Đọc file json
    const jsonPath = path.resolve(__dirname, '../data/lms_curriculum_store.json');
    if (!fs.existsSync(jsonPath)) {
      console.log('⚠️ Không tìm thấy file lms_curriculum_store.json, bỏ qua nạp cũ.');
      process.exit(0);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const curriculumStore = JSON.parse(rawData);

    let totalImported = 0;

    for (const [secIdKey, modules] of Object.entries(curriculumStore)) {
      const sectionId = parseInt(secIdKey) || 1;
      if (!Array.isArray(modules)) continue;

      for (const m of modules) {
        const moduleId = m.id || m.week_number;
        const materials = m.materials || [];

        for (const mat of materials) {
          const title = mat.title || `Học liệu Tuần ${m.week_number}`;
          const matType = mat.material_type || 'DOCUMENT';
          const cat = mat.category || 'MAIN_TEXTBOOK';
          const url = mat.file_url || mat.url || '';
          const richContent = mat.rich_content || mat.content_text || null;
          const durationMins = mat.duration_mins || mat.suggested_time_minutes || 45;
          const isMandatory = mat.is_mandatory !== false;
          const isPublished = mat.is_published !== false;
          const releaseDate = mat.release_date || null;
          const antiSkipping = !!mat.anti_skipping;
          const minComp = mat.min_completion_pct || 80;

          // Kiểm tra xem đã tồn tại chưa
          let existing = null;
          if (mat.id && Number.isInteger(Number(mat.id)) && Number(mat.id) < 2147483647) {
            existing = await AcademicMaterial.findByPk(mat.id);
          }

          if (existing) {
            await existing.update({
              section_id: sectionId,
              module_id: moduleId,
              title,
              material_type: matType,
              category: cat,
              url,
              rich_content: richContent,
              duration_mins: durationMins,
              is_mandatory: isMandatory,
              is_published: isPublished,
              release_date: releaseDate,
              anti_skipping: antiSkipping,
              min_completion_pct: minComp
            });
          } else {
            await AcademicMaterial.create({
              section_id: sectionId,
              module_id: moduleId,
              title,
              material_type: matType,
              category: cat,
              url,
              rich_content: richContent,
              duration_mins: durationMins,
              is_mandatory: isMandatory,
              is_published: isPublished,
              release_date: releaseDate,
              anti_skipping: antiSkipping,
              min_completion_pct: minComp
            });
          }
          totalImported++;
        }
      }
    }

    console.log(`✅ Đã nạp thành công ${totalImported} học liệu (Video, Slide, KaTeX) vào bảng MySQL academic_materials!`);

    // Tạo các thông báo mẫu thực tế cho hệ thống
    const notifCount = await AcademicNotification.count();
    if (notifCount === 0) {
      await AcademicNotification.bulkCreate([
        {
          recipient_type: 'CLASS',
          recipient_id: '66.CNTT-1',
          title: '📋 Bài Tập Lớn Mới Được Giao: Quản Lý Đào Tạo C++',
          message: 'Giảng viên TS. Hoàng Đức Em đã công bố đề bài và khung tiêu chí Rubric cho Bài Tập Lớn 1. Hạn chót: 7 ngày tới.',
          type: 'ASSIGNMENT',
          action_url: '/elearning',
          is_read: false
        },
        {
          recipient_type: 'USER',
          recipient_id: '261IT001',
          title: '✓ Điểm Bài Tập Đã Được Công Bố',
          message: 'Bài tập của bạn đã được chấm 9.25/10 điểm theo Rubric với nhận xét: "Thiết kế module hóa xuất sắc, thuật toán tối ưu".',
          type: 'GRADE',
          action_url: '/elearning',
          is_read: false
        },
        {
          recipient_type: 'CLASS',
          recipient_id: '66.CNTT-1',
          title: '⚠️ Cảnh Báo Quy Chế Chuyên Cần TT 08/2021',
          message: 'Nhà trường nhắc nhở: Sinh viên vắng quá 20% tổng số buổi học sẽ tự động bị đình chỉ tư cách dự thi kết thúc học phần.',
          type: 'ATTENDANCE',
          action_url: '/elearning',
          is_read: false
        },
        {
          recipient_type: 'ALL',
          recipient_id: 'ALL',
          title: '🏛️ Lịch Thi Kết Thúc Học Phần Học Kỳ 1 Đã Sẵn Sàng',
          message: 'Phòng Khảo thí đã cấp quyền phòng thi trực tuyến AI Proctoring cho Lớp 66.CNTT-1 tại Phòng 401 & 402 Nhà A3.',
          type: 'COURSE',
          action_url: '/exam',
          is_read: false
        }
      ]);
      console.log('✅ Đã khởi tạo 4 thông báo mẫu hệ thống vào academic_notifications!');
    }

    console.log('========================================================================');
    console.log('🎉 HOÀN TẤT CHUYỂN ĐỔI SANG CSDL MYSQL THUẦN NHẤT THÀNH CÔNG 100%!');
    console.log('========================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi chuyển đổi CSDL:', err);
    process.exit(1);
  }
}

migrate();
