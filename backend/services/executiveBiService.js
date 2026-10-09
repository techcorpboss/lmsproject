// backend/services/executiveBiService.js
/**
 * Dịch vụ Phân Tích Dữ Liệu Học Thuật & Khảo Thí Chiến Lược (Executive BI Dashboard)
 * Cung cấp thông tin điều hành thời gian thực cho Ban Giám Hiệu, Trưởng Khoa và Phòng ĐBCL
 */

class ExecutiveBiService {
  constructor() {
    this.academicYear = "2026-2027";
    this.semester = "Học kỳ 1";
  }

  // Tổng hợp toàn diện chỉ số KPI chiến lược
  getExecutiveKpiOverview() {
    return {
      success: true,
      meta: {
        university: "Trường Đại học Công nghệ TechCorp",
        academicYear: this.academicYear,
        semester: this.semester,
        updatedAt: new Date().toISOString()
      },
      // 1. Quy mô người học
      enrollment: {
        totalStudents: 6850,
        activeRegularStudents: 6520,
        postgraduateStudents: 330,
        facultiesBreakdown: [
          { name: "Khoa Công nghệ Thông tin", students: 2840, percentage: 41.5, majors: ["Kỹ thuật Phần mềm", "Khoa học Máy tính", "ATTT"] },
          { name: "Khoa Kinh tế & Quản trị", students: 2110, percentage: 30.8, majors: ["Quản trị Kinh doanh", "Thương mại Điện tử", "Tài chính"] },
          { name: "Khoa Ngoại ngữ Học thuật", students: 1900, percentage: 27.7, majors: ["Tiếng Anh Thương mại", "Tiếng Nhật CNTT"] }
        ]
      },
      // 2. Phổ điểm tích lũy toàn trường (GPA Distribution)
      gpaDistribution: [
        { rank: "Xuất Sắc (3.60 - 4.00)", count: 575, percentage: 8.4, color: "#7c3aed" },
        { rank: "Giỏi (3.20 - 3.59)", count: 1658, percentage: 24.2, color: "#16a34a" },
        { rank: "Khá (2.50 - 3.19)", count: 3206, percentage: 46.8, color: "#2563eb" },
        { rank: "Trung Bình (2.00 - 2.49)", count: 1130, percentage: 16.5, color: "#d97706" },
        { rank: "Yếu / Kém (< 2.00)", count: 281, percentage: 4.1, color: "#dc2626" }
      ],
      // 3. Dự báo rủi ro & Cảnh báo học vụ (Thông tư 08/2021)
      academicWarningStats: {
        totalWarned: 280,
        warningRate: 4.09, // 4.09% toàn trường
        levels: [
          { level: "Cảnh báo Mức 1 (GPA < 1.0 kỳ 1)", count: 182, status: "EARLY_INTERVENTION", action: "Cố vấn học tập gặp gỡ" },
          { level: "Cảnh báo Mức 2 (2 kỳ liên tiếp)", count: 74, status: "HIGH_RISK", action: "Giới hạn đăng ký tối đa 14 tín chỉ" },
          { level: "Cảnh báo Mức 3 (Nguy cơ Buộc thôi học)", count: 24, status: "CRITICAL", action: "Hội đồng học vụ họp xét duyệt" }
        ]
      },
      // 4. Doanh thu học phí số hóa VietQR NAPAS 24/7
      tuitionCollection: {
        totalReceivableBillion: 34.2, // 34.2 Tỷ VNĐ
        collectedBillion: 31.8,       // 31.8 Tỷ VNĐ
        collectionRate: 93.0,          // 93.0%
        outstandingBillion: 2.4,      // 2.4 Tỷ VNĐ
        automatedQrPercentage: 96.5    // 96.5% thanh toán tự động qua VietQR NAPAS
      },
      // 5. Kiểm soát tỷ lệ đào tạo trực tuyến (Tuân thủ trần <= 30% của Thông tư 08)
      deliveryCompliance: {
        directFaceToFaceRate: 74.2,   // 74.2% Trực tiếp trên lớp
        onlineLmsRate: 25.8,          // 25.8% Trực tuyến (<= 30% ĐẠT CHUẨN BỘ)
        moetCeiling: 30.0,
        isCompliant: true
      },
      // 6. Kiểm định chất lượng AUN-QA 4.0 & ABET
      accreditationAttainment: {
        overallPloAttainment: 91.8,   // 91.8% sinh viên đạt chuẩn đầu ra
        coursesAssessedCount: 184,
        graduatedEmploymentRate: 94.6 // 94.6% sinh viên có việc làm sau 6 tháng
      }
    };
  }
}

module.exports = new ExecutiveBiService();
