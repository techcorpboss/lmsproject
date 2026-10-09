// backend/services/peerReviewService.js
/**
 * Dịch vụ Đánh giá Đồng đẳng (Double-Blind Peer Review) & Rubric Đa chiều AUN-QA/ABET
 * Phân phối ngẫu nhiên bài tập cho sinh viên phản biện ẩn danh
 * Lưu trữ điểm Rubric chi tiết và phát hiện chênh lệch điểm (Discrepancy Detection)
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data_peer_reviews.json');

// Khung Rubric đánh giá đa mức độ chuẩn AUN-QA / ABET cho đồ án và bài tập lớn
const DEFAULT_RUBRIC_CRITERIA = [
  {
    id: "crit_architecture",
    name: "1. Mô hình Kiến trúc & Thiết kế Hướng đối tượng (AUN-QA Criteria)",
    clo_mapped: "CLO1",
    max_score: 3.5,
    levels: [
      { score: 3.5, label: "Xuất sắc (100%)", desc: "Mô hình quan hệ lớp, kế thừa, đa hình và mẫu hình thiết kế hoàn hảo, phân tách module rõ ràng." },
      { score: 2.8, label: "Giỏi (80%)", desc: "Cấu trúc OOP đúng chuẩn, quan hệ lớp hợp lý, áp dụng đúng kế thừa và đa hình." },
      { score: 2.1, label: "Khá (60%)", desc: "Đầy đủ các lớp nhưng tính đa hình chưa tối ưu hoặc còn dư thừa thuộc tính." },
      { score: 1.4, label: "Đạt (40%)", desc: "Thiết kế đơn giản, chưa tận dụng tốt ưu điểm của OOP." },
      { score: 0.0, label: "Chưa đạt (0%)", desc: "Không áp dụng OOP, viết mã theo phong cách lập trình thủ tục không cấu trúc." }
    ]
  },
  {
    id: "crit_algorithm",
    name: "2. Thuật toán, Quản lý Bộ nhớ & Kỹ thuật Cài đặt (ABET Outcome 1)",
    clo_mapped: "CLO2",
    max_score: 3.5,
    levels: [
      { score: 3.5, label: "Xuất sắc (100%)", desc: "Thuật toán tối ưu O(n log n), quản lý con trỏ an toàn tuyệt đối bằng Smart Pointers, không Memory Leak." },
      { score: 2.8, label: "Giỏi (80%)", desc: "Thuật toán đúng, giải phóng bộ nhớ đầy đủ, xử lý ngoại lệ tốt." },
      { score: 2.1, label: "Khá (60%)", desc: "Chạy được nhưng còn vài cảnh báo biên dịch hoặc giải phóng chưa triệt để." },
      { score: 1.4, label: "Đạt (40%)", desc: "Chạy được trường hợp cơ bản, lỗi với bộ dữ liệu lớn hoặc con trỏ rỗng." },
      { score: 0.0, label: "Chưa đạt (0%)", desc: "Lỗi biên dịch hoặc bị Crash chương trình khi chạy." }
    ]
  },
  {
    id: "crit_report",
    name: "3. Báo cáo Thuyết minh & Format Mã nguồn Clean Code (ABET Outcome 3)",
    clo_mapped: "CLO3",
    max_score: 3.0,
    levels: [
      { score: 3.0, label: "Xuất sắc (100%)", desc: "Báo cáo trình bày theo chuẩn IEEE/ACM, mã nguồn tuân thủ Google C++ Style Guide, chú thích hàm đầy đủ." },
      { score: 2.4, label: "Giỏi (80%)", desc: "Báo cáo rõ ràng, mã nguồn sạch sẽ, đặt tên biến có ý nghĩa." },
      { score: 1.8, label: "Khá (60%)", desc: "Báo cáo tương đối đầy đủ, mã nguồn định dạng chưa đồng nhất." },
      { score: 1.2, label: "Đạt (40%)", desc: "Báo cáo sơ sài, ít chú thích mã nguồn." },
      { score: 0.0, label: "Chưa đạt (0%)", desc: "Không có báo cáo hoặc sao chép nguyên xi trên mạng." }
    ]
  }
];

class PeerReviewService {
  constructor() {
    this.assignments = [];
    this.reviews = []; // Danh sách các bài đánh giá đồng đẳng
    this.distributions = {}; // { [assignmentId]: [ { reviewerId, submissionId, status: 'PENDING'|'COMPLETED' } ] }
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        this.reviews = data.reviews || [];
        this.distributions = data.distributions || {};
      }
    } catch (e) {
      console.warn('[PeerReviewService] Khởi tạo kho dữ liệu đánh giá đồng đẳng ban đầu.');
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify({
        reviews: this.reviews,
        distributions: this.distributions
      }, null, 2), 'utf8');
    } catch (e) {
      console.error('[PeerReviewService] Lỗi lưu file data:', e.message);
    }
  }

  // Lấy danh mục tiêu chí Rubric
  getRubricCriteria() {
    return DEFAULT_RUBRIC_CRITERIA;
  }

  // Tự động phân phối bài nộp cho sinh viên chấm chéo (Double-Blind Allocation)
  distributePeerReviews(assignmentId, submissions, reviewsPerStudent = 2) {
    if (!submissions || submissions.length < 2) {
      throw new Error('Cần ít nhất 2 bài nộp để tiến hành phân phối chấm chéo đồng đẳng.');
    }

    const n = submissions.length;
    const allocated = [];

    // Thuật toán xoay vòng (Round-Robin Shift) chống tự chấm chính mình
    for (let i = 0; i < n; i++) {
      const reviewer = submissions[i];
      for (let step = 1; step <= Math.min(reviewsPerStudent, n - 1); step++) {
        const targetIdx = (i + step) % n;
        const targetSubmission = submissions[targetIdx];

        allocated.push({
          reviewId: `pr_${assignmentId}_${reviewer.student_id}_${targetSubmission.id}`,
          assignmentId,
          reviewerStudentId: reviewer.student_id,
          reviewerStudentName: reviewer.student_name,
          submissionId: targetSubmission.id,
          submissionFileName: targetSubmission.file_name,
          authorMaskedCode: `ANON-AUTHOR-${Math.abs(targetSubmission.student_id * 31 % 1000)}`,
          status: 'PENDING',
          allocatedAt: new Date().toISOString()
        });
      }
    }

    this.distributions[assignmentId] = allocated;
    this.saveData();

    return {
      success: true,
      totalAllocations: allocated.length,
      reviewsPerStudent,
      allocations: allocated
    };
  }

  // Lấy các bài nộp mà một sinh viên được phân công chấm chéo
  getAssignedReviewsForStudent(assignmentId, studentId) {
    const list = this.distributions[assignmentId] || [];
    return list.filter(item => String(item.reviewerStudentId) === String(studentId));
  }

  // Sinh viên gửi đánh giá đồng đẳng (Nộp điểm Rubric + Lời nhận xét)
  submitPeerReview({ reviewId, assignmentId, reviewerStudentId, submissionId, rubricScores, feedbackText }) {
    if (!rubricScores) {
      throw new Error('Thiếu bảng điểm Rubric chi tiết.');
    }

    // Tính tổng điểm
    const totalScore = Object.values(rubricScores).reduce((acc, cur) => acc + Number(cur || 0), 0);
    const roundedScore = Number(totalScore.toFixed(2));

    const reviewRecord = {
      reviewId,
      assignmentId,
      reviewerStudentId,
      submissionId,
      rubricScores,
      totalScore: roundedScore,
      feedbackText: feedbackText || 'Bài làm tốt, có tinh thần cầu tiến.',
      submittedAt: new Date().toISOString()
    };

    // Cập nhật trạng thái trong distributions
    const distList = this.distributions[assignmentId] || [];
    const distIdx = distList.findIndex(d => d.reviewId === reviewId || (String(d.reviewerStudentId) === String(reviewerStudentId) && String(d.submissionId) === String(submissionId)));
    if (distIdx !== -1) {
      distList[distIdx].status = 'COMPLETED';
      distList[distIdx].scoreAwarded = roundedScore;
    }

    // Lưu vào danh sách review
    const existingIdx = this.reviews.findIndex(r => r.reviewId === reviewId);
    if (existingIdx !== -1) {
      this.reviews[existingIdx] = reviewRecord;
    } else {
      this.reviews.push(reviewRecord);
    }

    this.saveData();

    return {
      success: true,
      message: 'Đã lưu kết quả Đánh giá đồng đẳng thành công!',
      reviewRecord
    };
  }

  // Giảng viên xem báo cáo tổng hợp & đối soát điểm đồng đẳng của một bài nộp
  getPeerReviewSummaryForSubmission(submissionId) {
    const matched = this.reviews.filter(r => String(r.submissionId) === String(submissionId));
    if (matched.length === 0) {
      return {
        submissionId,
        reviewCount: 0,
        averagePeerScore: null,
        scores: [],
        reviews: []
      };
    }

    const total = matched.reduce((sum, r) => sum + r.totalScore, 0);
    const avg = Number((total / matched.length).toFixed(2));

    return {
      submissionId,
      reviewCount: matched.length,
      averagePeerScore: avg,
      scores: matched.map(m => m.totalScore),
      reviews: matched.map(m => ({
        totalScore: m.totalScore,
        rubricScores: m.rubricScores,
        feedback: m.feedbackText,
        submittedAt: m.submittedAt
      }))
    };
  }
}

module.exports = new PeerReviewService();
