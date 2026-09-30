// backend/services/curriculumComplianceService.js
// Dịch vụ Kiểm soát Tuân thủ Quy chế Đào tạo Đại học theo Thông tư 08/2021/TT-BGDĐT
// Điều 12: Giới hạn trần tối đa 30% khối lượng chương trình đào tạo trực tuyến
'use strict';

const { CurriculumCourse, sequelize } = require('../models');

const STATUTORY_ONLINE_CEILING_PERCENT = 30.0; // 30.0% theo Điều 12 Thông tư 08/2021/TT-BGDĐT

class CurriculumComplianceService {
  /**
   * Tính toán và thẩm định tỷ lệ đào tạo trực tuyến cho toàn bộ CTĐT hoặc theo từng chuyên ngành
   * @param {Object} filter - { major_id, faculty_id }
   */
  async getComplianceReport(filter = {}) {
    const whereClause = { is_deleted: false };
    if (filter.major_id) whereClause.major_id = filter.major_id;
    if (filter.faculty_id) whereClause.faculty_id = filter.faculty_id;

    const courses = await CurriculumCourse.findAll({
      where: whereClause,
      order: [['semester', 'ASC'], ['id', 'ASC']]
    });

    let totalProgramCredits = 0;
    let totalOnlineCredits = 0;
    let totalOfflineCredits = 0;
    let totalCompulsoryCredits = 0;
    let totalElectiveCredits = 0;

    const semesterMap = {};

    courses.forEach(c => {
      const cr = Number(c.credits) || 0;
      totalProgramCredits += cr;

      let onlineCr = 0;
      const mode = (c.teaching_mode || 'TRUC_TIEP').toUpperCase();
      if (mode === 'TRUC_TUYEN') {
        onlineCr = cr;
      } else if (mode === 'KET_HOP') {
        onlineCr = Number(c.online_credits) > 0 ? Number(c.online_credits) : cr * 0.5;
      } else {
        onlineCr = Number(c.online_credits) || 0;
      }

      totalOnlineCredits += onlineCr;
      totalOfflineCredits += Math.max(0, cr - onlineCr);

      if (c.is_compulsory) {
        totalCompulsoryCredits += cr;
      } else {
        totalElectiveCredits += cr;
      }

      // Nhóm theo từng học kỳ (Kỳ 1 -> Kỳ 8)
      const sem = c.semester || 1;
      if (!semesterMap[sem]) {
        semesterMap[sem] = {
          semester: sem,
          semester_name: `Học kỳ ${sem}`,
          courses_count: 0,
          total_credits: 0,
          online_credits: 0,
          offline_credits: 0,
          courses: []
        };
      }

      semesterMap[sem].courses_count += 1;
      semesterMap[sem].total_credits += cr;
      semesterMap[sem].online_credits += onlineCr;
      semesterMap[sem].offline_credits += Math.max(0, cr - onlineCr);
      semesterMap[sem].courses.push({
        id: c.id,
        code: c.code,
        name: c.name,
        credits: cr,
        teaching_mode: mode,
        online_credits: onlineCr,
        is_compulsory: c.is_compulsory
      });
    });

    // Tính tỷ lệ phần trăm trực tuyến
    const onlineRatio = totalProgramCredits > 0
      ? Number(((totalOnlineCredits / totalProgramCredits) * 100).toFixed(2))
      : 0;

    // Giới hạn tín chỉ trực tuyến tối đa được phép theo luật
    const maxAllowedOnlineCredits = Number(((totalProgramCredits * STATUTORY_ONLINE_CEILING_PERCENT) / 100).toFixed(1));
    const remainingOnlineCreditsQuota = Number((maxAllowedOnlineCredits - totalOnlineCredits).toFixed(1));

    // Đánh giá mức độ tuân thủ
    let status = 'COMPLIANT';
    let statusLabel = 'ĐẠT CHUẨN THÔNG TƯ 08/2021 (HỢP PHÁP)';
    let statusColor = '#52c41a'; // xanh lá
    let recommendation = 'Tỷ lệ đào tạo trực tuyến nằm trong ngưỡng cho phép theo quy định của Bộ Giáo dục & Đào tạo.';

    if (onlineRatio > STATUTORY_ONLINE_CEILING_PERCENT) {
      status = 'VIOLATION_EXCEEDED';
      statusLabel = 'VƯỢT TRẦN QUY ĐỊNH (VI PHẠM ĐIỀU 12 TT 08/2021)';
      statusColor = '#f5222d'; // đỏ
      recommendation = `Chương trình đã vượt trần ${onlineRatio}% so với mức 30.0% tối đa. Cần chuyển đổi ít nhất ${Math.abs(remainingOnlineCreditsQuota)} tín chỉ sang hình thức học trực tiếp.`;
    } else if (onlineRatio >= 25.0) {
      status = 'WARNING_APPROACHING';
      statusLabel = 'CẬN NGƯỠNG TRẦN 30% (CẦN GIÁM SÁT)';
      statusColor = '#faad14'; // vàng cam
      recommendation = `Tỷ lệ học trực tuyến đã đạt ${onlineRatio}%. Chỉ còn dư địa ${remainingOnlineCreditsQuota} tín chỉ trực tuyến trước khi chạm trần tối đa.`;
    }

    const semesterList = Object.values(semesterMap).map(s => ({
      ...s,
      online_ratio: s.total_credits > 0 ? Number(((s.online_credits / s.total_credits) * 100).toFixed(1)) : 0
    }));

    return {
      success: true,
      legal_reference: 'Thông tư 08/2021/TT-BGDĐT Điều 12 & Quyết định 4725/QĐ-BGDĐT',
      curriculum_meta: {
        total_courses: courses.length,
        total_program_credits: totalProgramCredits,
        total_online_credits: totalOnlineCredits,
        total_offline_credits: totalOfflineCredits,
        total_compulsory_credits: totalCompulsoryCredits,
        total_elective_credits: totalElectiveCredits,
        cohort: 'K66 - K68',
        major_name: 'Kỹ thuật Phần mềm & CNTT'
      },
      compliance: {
        online_ratio_percentage: onlineRatio,
        statutory_ceiling_percentage: STATUTORY_ONLINE_CEILING_PERCENT,
        max_allowed_online_credits: maxAllowedOnlineCredits,
        remaining_online_credits_quota: remainingOnlineCreditsQuota,
        status,
        status_label: statusLabel,
        status_color: statusColor,
        recommendation
      },
      semester_breakdown: semesterList
    };
  }

  /**
   * Thẩm định trước khi lưu một môn học mới hoặc sửa hình thức đào tạo của môn học
   */
  async validateCourseChange({ courseId = null, credits = 3, teaching_mode = 'TRUC_TIEP', online_credits = 0, major_id = '7480103' }) {
    const report = await this.getComplianceReport({ major_id });
    const current = report.curriculum_meta;

    let deltaOnline = 0;
    const mode = (teaching_mode || 'TRUC_TIEP').toUpperCase();
    if (mode === 'TRUC_TUYEN') deltaOnline = Number(credits);
    else if (mode === 'KET_HOP') deltaOnline = Number(online_credits) > 0 ? Number(online_credits) : Number(credits) * 0.5;

    // Giả định nếu thêm môn học này
    const projectedTotalCredits = current.total_program_credits + (courseId ? 0 : Number(credits));
    const projectedOnlineCredits = current.total_online_credits + deltaOnline;
    const projectedRatio = projectedTotalCredits > 0
      ? Number(((projectedOnlineCredits / projectedTotalCredits) * 100).toFixed(2))
      : 0;

    const wouldViolate = projectedRatio > STATUTORY_ONLINE_CEILING_PERCENT;

    return {
      allowed: !wouldViolate,
      current_ratio: report.compliance.online_ratio_percentage,
      projected_ratio: projectedRatio,
      threshold: STATUTORY_ONLINE_CEILING_PERCENT,
      message: wouldViolate
        ? `Không thể đặt môn học này sang trực tuyến vì sẽ đẩy tỷ lệ toàn khóa lên ${projectedRatio}%, vượt trần 30.0% theo Thông tư 08/2021/TT-BGDĐT!`
        : `Hợp lệ. Tỷ lệ trực tuyến sau cập nhật là ${projectedRatio}% (Trong hạn mức cho phép < 30.0%).`
    };
  }
}

module.exports = new CurriculumComplianceService();
