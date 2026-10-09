// backend/services/courseEvaluationService.js
/**
 * Dịch vụ Khảo sát Đánh giá Giảng dạy của Người học (SET - Student Evaluation of Teaching)
 * Tuân thủ quy định Đảm bảo Chất lượng Giáo dục nội bộ và Thông tư 08/2021/TT-BGDĐT
 * Cung cấp Cổng chặn Khảo sát (Grade Gatekeeper) để mở khóa điểm thi
 */

const fs = require('fs');
const path = require('path');

const EVAL_DATA_FILE = path.join(__dirname, '../data_course_evaluations.json');

// Khung câu hỏi khảo sát chuẩn kiểm định chất lượng (Thang đo Likert 5 mức độ: 1 = Rất không đồng ý -> 5 = Rất đồng ý)
const EVALUATION_DIMENSIONS = [
  {
    id: "dim_1",
    key: "pedagogical_clarity",
    title: "1. Phương pháp Sư phạm & Truyền đạt",
    question: "Giảng viên truyền đạt bài giảng rõ ràng, logic, dễ hiểu và giải thích thấu đáo các thắc mắc chuyên môn của sinh viên.",
    weight: 0.25
  },
  {
    id: "dim_2",
    key: "professionalism_punctuality",
    title: "2. Tác phong Sư phạm & Đúng giờ",
    question: "Giảng viên lên lớp đúng giờ, chuẩn bị bài giảng chu đáo, có thái độ tôn trọng và chuẩn mực với sinh viên.",
    weight: 0.20
  },
  {
    id: "dim_3",
    key: "materials_usefulness",
    title: "3. Học liệu & Bài tập Thực hành",
    question: "Giáo trình, slide bài giảng, video e-learning và bài tập thực hành phong phú, bám sát đề cương chi tiết học phần.",
    weight: 0.20
  },
  {
    id: "dim_4",
    key: "fairness_transparency",
    title: "4. Công bằng & Minh bạch trong Đánh giá",
    question: "Quy chế điểm quá trình, điểm chuyên cần và bài thi được công khai rõ ràng; nhận xét chấm bài công tâm và phản hồi kịp thời.",
    weight: 0.20
  },
  {
    id: "dim_5",
    key: "inspiration_motivation",
    title: "5. Tạo Động lực & Hướng nghiệp",
    question: "Học phần khơi dậy niềm đam mê học hỏi, liên hệ tốt giữa lý thuyết với bài toán thực tế của doanh nghiệp.",
    weight: 0.15
  }
];

class CourseEvaluationService {
  constructor() {
    this.submissions = []; // Danh sách các phiếu khảo sát ẩn danh
    this.studentStatus = {}; // { [`${studentId}_${courseCode}`]: { completed: true, completedAt: '...' } }
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(EVAL_DATA_FILE)) {
        const raw = fs.readFileSync(EVAL_DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        this.submissions = data.submissions || [];
        this.studentStatus = data.studentStatus || {};
      }
    } catch (e) {
      console.error('[CourseEvaluationService] Lỗi nạp dữ liệu khảo sát:', e.message);
    }
  }

  saveData() {
    try {
      fs.writeFileSync(EVAL_DATA_FILE, JSON.stringify({
        submissions: this.submissions,
        studentStatus: this.studentStatus
      }, null, 2), 'utf8');
    } catch (e) {
      console.error('[CourseEvaluationService] Lỗi lưu dữ liệu khảo sát:', e.message);
    }
  }

  // Lấy bộ câu hỏi khảo sát
  getSurveyForm(courseCode, lecturerName) {
    return {
      courseCode,
      lecturerName: lecturerName || 'Giảng viên Phụ trách',
      scaleLegend: [
        { score: 1, label: "1 - Rất không hài lòng / Hoàn toàn không đồng ý" },
        { score: 2, label: "2 - Không hài lòng / Không đồng ý" },
        { score: 3, label: "3 - Bình thường / Trung lập" },
        { score: 4, label: "4 - Hài lòng / Đồng ý" },
        { score: 5, label: "5 - Rất hài lòng / Hoàn toàn đồng ý" }
      ],
      dimensions: EVALUATION_DIMENSIONS
    };
  }

  // Kiểm tra trạng thái sinh viên đã đánh giá môn học chưa
  hasStudentCompleted(studentId, courseCode) {
    const key = `${studentId}_${courseCode}`;
    return !!(this.studentStatus[key] && this.studentStatus[key].completed);
  }

  // Nộp phiếu khảo sát ẩn danh (Anonymized Submission)
  submitSurvey({ studentId, courseCode, courseName, lecturerId, lecturerName, ratings, generalFeedback }) {
    if (!studentId || !courseCode || !ratings) {
      throw new Error('Dữ liệu phiếu khảo sát không đầy đủ.');
    }

    // Tính điểm trung bình phiếu
    let totalWeightedScore = 0;
    let totalWeight = 0;
    EVALUATION_DIMENSIONS.forEach(dim => {
      const score = Number(ratings[dim.key] || 5);
      totalWeightedScore += score * dim.weight;
      totalWeight += dim.weight;
    });

    const averageRating = totalWeight > 0 ? Number((totalWeightedScore / totalWeight).toFixed(2)) : 5.0;

    // Lưu phiếu ẩn danh (không lưu studentId trong bản ghi khảo sát)
    const anonymousEntry = {
      submissionId: 'SET_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      courseCode,
      courseName: courseName || 'Học phần',
      lecturerId: lecturerId || 'GV-DEFAULT',
      lecturerName: lecturerName || 'Giảng viên',
      ratings,
      averageRating,
      generalFeedback: generalFeedback || '',
      submittedAt: new Date().toISOString()
    };
    this.submissions.push(anonymousEntry);

    // Đánh dấu sinh viên này đã hoàn tất môn học để mở khóa điểm
    const statusKey = `${studentId}_${courseCode}`;
    this.studentStatus[statusKey] = {
      completed: true,
      completedAt: new Date().toISOString()
    };

    this.saveData();

    return {
      success: true,
      message: 'Cảm ơn bạn đã hoàn thành khảo sát chất lượng giảng dạy ẩn danh! Điểm học phần của bạn đã được mở khóa.',
      submissionId: anonymousEntry.submissionId,
      unlockedCourseCode: courseCode
    };
  }

  // Thống kê kết quả khảo sát cho Giảng viên & Phòng Đảm bảo Chất lượng
  getStatistics(courseCode) {
    const matched = this.submissions.filter(s => s.courseCode === courseCode);
    if (matched.length === 0) {
      return {
        courseCode,
        totalResponses: 0,
        overallAverage: 0,
        dimensionAverages: {},
        feedbackList: []
      };
    }

    const dimensionSums = {};
    EVALUATION_DIMENSIONS.forEach(d => { dimensionSums[d.key] = 0; });
    let totalOverall = 0;

    matched.forEach(sub => {
      totalOverall += sub.averageRating;
      EVALUATION_DIMENSIONS.forEach(d => {
        dimensionSums[d.key] += Number(sub.ratings[d.key] || 0);
      });
    });

    const dimensionAverages = {};
    EVALUATION_DIMENSIONS.forEach(d => {
      dimensionAverages[d.key] = Number((dimensionSums[d.key] / matched.length).toFixed(2));
    });

    return {
      courseCode,
      totalResponses: matched.length,
      overallAverage: Number((totalOverall / matched.length).toFixed(2)),
      satisfactionRate: Math.round(((totalOverall / matched.length) / 5) * 100),
      dimensionAverages,
      feedbackList: matched.filter(s => s.generalFeedback).map(s => ({
        feedback: s.generalFeedback,
        submittedAt: s.submittedAt
      }))
    };
  }
}

module.exports = new CourseEvaluationService();
