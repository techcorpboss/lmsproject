// backend/scripts/sync_database_schema.js
// Script đồng bộ CSDL và khởi tạo dữ liệu mẫu Ca thi & Cấp quyền dự thi chuẩn TT 08/2021/TT-BGDĐT
const path = require('path');
const fs = require('fs');

// Nạp biến môi trường
const envCandidates = [
  path.join(__dirname, '..', '.env'),
  path.join(process.cwd(), 'backend', '.env'),
  path.join(process.cwd(), '.env'),
  '/www/wwwroot/lms.techcorp.info.vn/backend/.env'
];

for (const envFile of envCandidates) {
  if (fs.existsSync(envFile)) {
    require('dotenv').config({ path: envFile });
    break;
  }
}

// Nếu có truyền mật khẩu qua dòng lệnh e.g: node sync_database_schema.js <pass>
if (process.argv[2]) {
  process.env.DB_PASSWORD = process.argv[2];
}

const { sequelize, User, AcademicExamSchedule, ExamCandidateAuthorization } = require('../models');

async function runSync() {
  console.log('\n=============================================================');
  console.log('🔄 ĐANG ĐỒNG BỘ CẤU TRÚC CSDL LMS & PHÂN HỆ TỔ CHỨC THI');
  console.log('=============================================================');

  try {
    // 1. Kiểm tra kết nối
    await sequelize.authenticate();
    console.log('✅ Kết nối CSDL MySQL thành công!');

    // 2. Đồng bộ bảng với Sequelize
    console.log('⏳ Đang đồng bộ hóa cấu trúc bảng (sequelize.sync alter: true)...');
    await sequelize.sync({ alter: true });
    console.log('✅ CSDL đã đồng bộ thành công!');

    // 3. Khởi tạo / cập nhật dữ liệu Ca thi mẫu chuẩn TT 08/2021
    console.log('🌱 Đang kiểm tra & khởi tạo dữ liệu Ca thi mẫu...');
    const [sched1] = await AcademicExamSchedule.findOrCreate({
      where: { exam_code: 'EXAM-2026-01' },
      defaults: {
        exam_code: 'EXAM-2026-01',
        exam_name: 'Kỳ Thi Khảo Thí Trực Tuyến — Chuẩn Quốc Tế 2026 (TCU & Pearson VUE)',
        subject_id: 1,
        exam_date: new Date().toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '23:59',
        room_code: 'ROOM-P01',
        proctor_1: 'ThS. Hoàng Minh Tuấn',
        proctor_2: 'TS. Lê Hồng Hạnh',
        semester: 'HK 2',
        academic_year: '2025-2026',
        duration_minutes: 60,
        exam_type: 'Trắc Nghiệm Số',
        security_level: 'STRICT',
        status: 'OPEN',
        notes: 'Ca thi chính thức chuẩn Thông tư 08/2021/TT-BGDĐT, kích hoạt Kiosk Lockdown và AI Proctoring.'
      }
    });

    const [sched2] = await AcademicExamSchedule.findOrCreate({
      where: { exam_code: 'EXAM-2026-02' },
      defaults: {
        exam_code: 'EXAM-2026-02',
        exam_name: 'Thi Đánh Giá Chuẩn Đầu Ra Công Nghệ Thông Tin & Dữ Liệu Số',
        subject_id: 2,
        exam_date: new Date().toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '23:59',
        room_code: 'ROOM-P02',
        proctor_1: 'ThS. Trần Văn Nam',
        proctor_2: 'KS. Phạm Thu Hà',
        semester: 'HK 2',
        academic_year: '2025-2026',
        duration_minutes: 90,
        exam_type: 'Trắc Nghiệm & Tự Luận Số',
        security_level: 'STRICT',
        status: 'OPEN',
        notes: 'Đợt khảo thí chuẩn đầu ra CNTT, yêu cầu thí sinh tuân thủ nghiêm ngặt quy chế.'
      }
    });

    console.log(`✅ Đã sẵn sàng các ca thi: [${sched1.exam_code}] & [${sched2.exam_code}]`);

    // 4. Khởi tạo danh sách Thí sinh & Cấp quyền mẫu
    const studentUsers = await User.findAll({
      where: { role: 'student' }
    });

    console.log(`🔍 Tìm thấy ${studentUsers.length} tài khoản sinh viên trong CSDL.`);

    if (studentUsers.length > 0) {
      for (const st of studentUsers) {
        // Cấp quyền cho ca thi 1: GRANTED (được thi để trải nghiệm thi)
        await ExamCandidateAuthorization.findOrCreate({
          where: {
            schedule_id: sched1.id,
            student_id: st.id
          },
          defaults: {
            schedule_id: sched1.id,
            student_id: st.id,
            student_code: st.student_code || st.username,
            student_name: st.full_name,
            class_name: st.class_name || 'ĐH CNTT K18',
            seat_number: `TCU-2026-${String(st.id).padStart(3, '0')}`,
            subject_code: sched1.exam_code,
            subject_name: sched1.exam_name,
            attendance_pct: 92.5,
            tuition_cleared: true,
            condition_passed: true,
            authorization_status: 'GRANTED',
            authorized_by: 'Ban Thư Ký Hội Đồng Khảo Thí',
            authorized_at: new Date(),
            notes: 'Đã thẩm định hồ sơ: Chuyên cần đạt 92.5%, học phí đã hoàn tất.'
          }
        });

        // Cấp quyền cho ca thi 2: PENDING (để kiểm tra giao diện chặn quyền thi)
        await ExamCandidateAuthorization.findOrCreate({
          where: {
            schedule_id: sched2.id,
            student_id: st.id
          },
          defaults: {
            schedule_id: sched2.id,
            student_id: st.id,
            student_code: st.student_code || st.username,
            student_name: st.full_name,
            class_name: st.class_name || 'ĐH CNTT K18',
            seat_number: `TCU-2026-${String(st.id + 50).padStart(3, '0')}`,
            subject_code: sched2.exam_code,
            subject_name: sched2.exam_name,
            attendance_pct: 76.0,
            tuition_cleared: false,
            condition_passed: false,
            authorization_status: 'PENDING',
            notes: 'Chưa được cấp quyền thi: Chuyên cần 76% (< 80% theo quy định Bộ GD&ĐT).'
          }
        });
      }
    }

    // Thêm các thí sinh giả định mẫu khác cho ca thi 1 để Admin trải nghiệm chức năng duyệt hàng loạt
    const mockDemoCandidates = [
      {
        schedule_id: sched1.id,
        student_id: 991,
        student_code: 'SV2026088',
        student_name: 'Trần Thị Bích Ngọc',
        class_name: 'K18-CNTT02',
        seat_number: 'TCU-2026-088',
        subject_code: sched1.exam_code,
        subject_name: sched1.exam_name,
        attendance_pct: 98.0,
        tuition_cleared: true,
        condition_passed: true,
        authorization_status: 'GRANTED',
        authorized_by: 'SuperAdmin',
        authorized_at: new Date(),
        notes: 'Đạt điều kiện xuất sắc.'
      },
      {
        schedule_id: sched1.id,
        student_id: 992,
        student_code: 'SV2026089',
        student_name: 'Lê Hoàng Long',
        class_name: 'K18-CNTT01',
        seat_number: 'TCU-2026-089',
        subject_code: sched1.exam_code,
        subject_name: sched1.exam_name,
        attendance_pct: 68.0,
        tuition_cleared: false,
        condition_passed: false,
        authorization_status: 'DENIED',
        authorized_by: 'Hội đồng Khảo thí',
        authorized_at: new Date(),
        notes: 'Từ chối cấp quyền: Nghỉ học quá 20% số tiết quy định.'
      },
      {
        schedule_id: sched1.id,
        student_id: 993,
        student_code: 'SV2026090',
        student_name: 'Vũ Quốc Bảo',
        class_name: 'K18-CNTT03',
        seat_number: 'TCU-2026-090',
        subject_code: sched1.exam_code,
        subject_name: sched1.exam_name,
        attendance_pct: 88.0,
        tuition_cleared: true,
        condition_passed: true,
        authorization_status: 'PENDING',
        notes: 'Đủ điều kiện, đang chờ Hội đồng phê duyệt hàng loạt.'
      }
    ];

    for (const c of mockDemoCandidates) {
      await ExamCandidateAuthorization.findOrCreate({
        where: {
          schedule_id: c.schedule_id,
          student_code: c.student_code
        },
        defaults: c
      });
    }

    const totalAuths = await ExamCandidateAuthorization.count();
    console.log(`✅ Đã khởi tạo hoàn tất danh sách thí sinh dự thi: ${totalAuths} bản ghi thẩm định.`);

    console.log('\n=============================================================');
    console.log('🎉 TẤT CẢ ĐÃ SẴN SÀNG ĐỂ HOẠT ĐỘNG!');
    console.log('👉 Đăng nhập Thí sinh (student / Student@2026):');
    console.log('   - Môn 1 (EXAM-2026-01): ĐÃ CẤP QUYỀN -> Thấy Thẻ Dự Thi Số và được thi ngay.');
    console.log('   - Môn 2 (EXAM-2026-02): CHƯA CẤP QUYỀN -> Bị chặn theo TT 08/2021 và có nút xin duyệt.');
    console.log('👉 Đăng nhập Quản trị (superadmin / admin):');
    console.log('   - Vào menu "Quản Lý Tổ Chức Thi & Cấp Quyền" để xem ca thi, cấp quyền hàng loạt và biên bản số.');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ [LỖI ĐỒNG BỘ CSDL]:', error.message);
    if (error.original) {
      console.error('Chi tiết SQL:', error.original.sqlMessage || error.original.message);
    }
    console.log('\n💡 Gợi ý: Nếu mật khẩu MySQL khác mặc định, vui lòng chạy lệnh kèm mật khẩu:');
    console.log('   node backend/scripts/sync_database_schema.js <mat_khau_mysql_vps>\n');
    process.exit(1);
  }
}

runSync();
