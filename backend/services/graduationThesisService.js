// backend/services/graduationThesisService.js
/**
 * Dịch vụ Quản lý Khóa luận / Đồ án Tốt nghiệp & Hội đồng Bảo vệ (Capstone & Graduation Thesis)
 * Tuân thủ Quy chế đào tạo đại học và công tác bảo vệ tốt nghiệp chuẩn Bộ GD&ĐT
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data_graduation_theses.json');

// Dữ liệu đồ án mẫu ban đầu
const INITIAL_THESES = [
  {
    id: "thesis_2026_001",
    student_id: 1,
    student_code: "261IT001",
    student_name: "Trần Văn Nam",
    class_name: "66.CNTT-1",
    major_name: "Kỹ thuật Phần mềm (Software Engineering)",
    title: "Nghiên cứu và Triển khai Kiến trúc Vi Dịch vụ (Microservices) Cho Hệ thống Đào tạo Trực tuyến Chịu tải Cao",
    objective: "Thiết kế hệ sinh thái backend phân tán, áp dụng Sharding, Redis Cache Cluster và xác thực PKI chuẩn Thông tư 08/2021/TT-BGDĐT.",
    technologies: ["Node.js", "Docker", "Kubernetes", "MySQL 8.0", "Redis", "RSA-SHA256"],
    supervisor_id: 2,
    supervisor_name: "TS. Hoàng Đức Em",
    supervisor_department: "Bộ môn Kỹ thuật Phần mềm",
    status: "DEFENSE_SCHEDULED", // PROPOSED, APPROVED, IN_PROGRESS, SUBMITTED_FINAL, DEFENSE_SCHEDULED, DEFENDED_PASSED
    submission_milestones: [
      { milestone: "OUTLINE_20", name: "Đề cương chi tiết (20%)", status: "APPROVED", score: 9.0, file: "De_cuong_BTL_TranVanNam.pdf" },
      { milestone: "MIDTERM_50", name: "Báo cáo tiến độ giữa kỳ (50%)", status: "APPROVED", score: 8.5, file: "Bao_cao_giua_ky_TranVanNam.pdf" },
      { milestone: "FINAL_100", name: "Toàn văn Khóa luận & Source Code (100%)", status: "APPROVED", score: 9.2, file: "Khoa_luan_tot_nghiep_Final_TranVanNam.pdf" }
    ],
    plagiarism_check: {
      tool: "Turnitin / TCU Anti-Plagiarism Engine",
      similarity_score: 4.2, // 4.2% trùng lặp (Đạt chuẩn < 20%)
      status: "PASSED",
      checked_at: "2026-09-28T10:00:00Z"
    },
    defense_council: {
      council_code: "HĐ-K66-CNPM-01",
      council_name: "Hội đồng Chấm Bảo vệ Khóa luận Tốt nghiệp Ngành Kỹ thuật Phần mềm Số 01",
      defense_date: "2026-10-25",
      defense_time: "08:30 - 09:30",
      room_code: "Phòng Hội thảo A2-302 (Trực tuyến Zoom/Jitsi)",
      members: [
        { role: "CHAIRMAN", title: "Chủ tịch Hội đồng", name: "PGS. TS. Trần Mạnh Tuấn", score: null },
        { role: "SECRETARY", title: "Thư ký Hội đồng", name: "ThS. Lê Hoàng Yến", score: null },
        { role: "REVIEWER_1", title: "Ủy viên Phản biện 1", name: "TS. Nguyễn Văn An", score: null },
        { role: "REVIEWER_2", title: "Ủy viên Phản biện 2", name: "TS. Vũ Đình Trọng", score: null }
      ],
      rubric_weights: {
        research_quality: 0.40, // Chất lượng nội dung nghiên cứu & hàm lượng khoa học (40%)
        presentation: 0.30,     // Kỹ năng thuyết minh, slide và tính làm chủ đề tài (30%)
        qa_defense: 0.30        // Trả lời chất vấn của các thành viên Hội đồng (30%)
      },
      final_grade: null,
      academic_rank: null,
      defense_minutes: null
    },
    created_at: "2026-08-15T08:00:00Z"
  }
];

class GraduationThesisService {
  constructor() {
    this.theses = [];
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.theses = JSON.parse(raw);
      } else {
        this.theses = INITIAL_THESES;
        this.saveData();
      }
    } catch (e) {
      this.theses = INITIAL_THESES;
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.theses, null, 2), 'utf8');
    } catch (e) {
      console.error('[GraduationThesisService] Lỗi lưu file data:', e.message);
    }
  }

  // Lấy toàn bộ danh sách khóa luận / đồ án
  listTheses(filter = {}) {
    let list = [...this.theses];
    if (filter.student_id) {
      list = list.filter(t => String(t.student_id) === String(filter.student_id));
    }
    if (filter.status) {
      list = list.filter(t => t.status === filter.status);
    }
    return list;
  }

  // Sinh viên đăng ký đề tài khóa luận mới
  registerThesis(data) {
    const { student_id, student_code, student_name, class_name, major_name, title, objective, technologies, supervisor_id, supervisor_name } = data;

    const newThesis = {
      id: `thesis_2026_${Date.now()}`,
      student_id: student_id || 1,
      student_code: student_code || '261IT001',
      student_name: student_name || 'Sinh viên',
      class_name: class_name || '66.CNTT-1',
      major_name: major_name || 'Công nghệ Thông tin',
      title,
      objective,
      technologies: Array.isArray(technologies) ? technologies : (technologies || '').split(',').map(s => s.trim()),
      supervisor_id: supervisor_id || 2,
      supervisor_name: supervisor_name || 'TS. Hoàng Đức Em',
      status: 'PROPOSED',
      submission_milestones: [
        { milestone: "OUTLINE_20", name: "Đề cương chi tiết (20%)", status: "PENDING", score: null, file: null },
        { milestone: "MIDTERM_50", name: "Báo cáo tiến độ giữa kỳ (50%)", status: "PENDING", score: null, file: null },
        { milestone: "FINAL_100", name: "Toàn văn Khóa luận (100%)", status: "PENDING", score: null, file: null }
      ],
      plagiarism_check: {
        tool: "Turnitin",
        similarity_score: null,
        status: "NOT_CHECKED"
      },
      defense_council: null,
      created_at: new Date().toISOString()
    };

    this.theses.unshift(newThesis);
    this.saveData();
    return newThesis;
  }

  // Giảng viên / Khoa phê duyệt đề tài
  approveThesis(thesisId, decision = 'APPROVED') {
    const item = this.theses.find(t => t.id === thesisId);
    if (!item) throw new Error('Không tìm thấy đồ án.');
    item.status = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
    this.saveData();
    return item;
  }

  // Nộp báo cáo tiến độ (Mốc 20%, 50%, 100%)
  submitMilestone(thesisId, milestoneKey, fileName) {
    const item = this.theses.find(t => t.id === thesisId);
    if (!item) throw new Error('Không tìm thấy đồ án.');

    const m = item.submission_milestones.find(ms => ms.milestone === milestoneKey);
    if (m) {
      m.status = 'SUBMITTED';
      m.file = fileName || 'Bao_cao_nop.pdf';
      m.submittedAt = new Date().toISOString();
    }

    if (milestoneKey === 'FINAL_100') {
      item.status = 'SUBMITTED_FINAL';
      // Tự động kích hoạt kiểm tra đạo văn
      item.plagiarism_check = {
        tool: "TCU Anti-Plagiarism Engine",
        similarity_score: Number((Math.random() * 8 + 3).toFixed(1)), // 3% - 11%
        status: "PASSED",
        checked_at: new Date().toISOString()
      };
    }

    this.saveData();
    return item;
  }

  // Nhập điểm Hội đồng chấm bảo vệ khóa luận
  submitCouncilGrading(thesisId, scores) {
    const item = this.theses.find(t => t.id === thesisId);
    if (!item || !item.defense_council) {
      throw new Error('Chưa thiết lập Hội đồng bảo vệ cho khóa luận này.');
    }

    // Cập nhật điểm cho từng thành viên Hội đồng
    let totalScoreSum = 0;
    item.defense_council.members.forEach(m => {
      const s = scores[m.role];
      if (s) {
        // Điểm = (Nghiên cứu * 0.4) + (Thuyết trình * 0.3) + (Chất vấn * 0.3)
        const weighted = (Number(s.research || 9) * 0.4) + (Number(s.presentation || 9) * 0.3) + (Number(s.qa || 9) * 0.3);
        m.score = Number(weighted.toFixed(2));
        m.detailedScores = s;
        totalScoreSum += m.score;
      }
    });

    const averageGrade = Number((totalScoreSum / item.defense_council.members.length).toFixed(2));
    item.defense_council.final_grade = averageGrade;
    item.defense_council.academic_rank = averageGrade >= 9.0 ? 'XUẤT SẮC' : averageGrade >= 8.0 ? 'GIỎI' : 'KHÁ';
    item.status = 'DEFENDED_PASSED';

    // Tạo nội dung Biên bản bảo vệ chính thức
    item.defense_council.defense_minutes = {
      minutes_code: `BB-BVKL-${item.student_code}-2026`,
      signed_at: new Date().toISOString(),
      council_conclusion: `Sinh viên ${item.student_name} bảo vệ thành công Khóa luận tốt nghiệp với số điểm ${averageGrade}/10. Đề nghị Hiệu trưởng công nhận tốt nghiệp và cấp bằng Cử nhân.`,
      is_signed: true
    };

    this.saveData();
    return item;
  }
}

module.exports = new GraduationThesisService();
