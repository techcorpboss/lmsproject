// backend/services/interactiveVideoService.js
/**
 * Dịch vụ Video Tương tác H5P & Checkpoint Quizzes
 * Quản lý các điểm dừng câu hỏi trắc nghiệm trong video bài giảng
 * Ghi nhận tiến độ và điểm số tương tác của sinh viên
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data_interactive_video.json');

// Dữ liệu mẫu khởi tạo ban đầu cho các bài học
const INITIAL_CHECKPOINTS = {
  // Lesson 1: Giới thiệu Ngôn ngữ C/C++ và Môi trường Lập trình
  "1": [
    {
      id: "cp_1_1",
      timestamp_seconds: 15,
      timestamp_display: "00:15",
      title: "Kiểm tra nhanh: Bản chất con trỏ trong C++",
      question: "Trong ngôn ngữ C/C++, toán tử nào sau đây dùng để lấy địa chỉ ô nhớ của một biến?",
      options: [
        { key: "A", text: "Toán tử sao (*)" },
        { key: "B", text: "Toán tử và (&)" },
        { key: "C", text: "Toán tử mũi tên (->)" },
        { key: "D", text: "Toán tử hai dấu chấm (::)" }
      ],
      correct_answer: "B",
      points: 10,
      explanation: "Toán tử '&' (Address-of operator) được sử dụng để trích xuất địa chỉ bộ nhớ vật lý của một biến. Toán tử '*' dùng để truy xuất giá trị tại địa chỉ mà con trỏ trỏ tới (dereference)."
    },
    {
      id: "cp_1_2",
      timestamp_seconds: 45,
      timestamp_display: "00:45",
      title: "Khái niệm Cấp phát động",
      question: "Hành động nào sau đây sẽ gây ra lỗi Memory Leak (rò rỉ bộ nhớ) trong C++?",
      options: [
        { key: "A", text: "Cấp phát biến tĩnh trong hàm main()" },
        { key: "B", text: "Dùng từ khóa new cấp phát vùng nhớ trên Heap nhưng quên gọi delete trước khi kết thúc chương trình" },
        { key: "C", text: "Khai báo con trỏ NULL" },
        { key: "D", text: "Gọi hàm free() sau khi dùng malloc()" }
      ],
      correct_answer: "B",
      points: 10,
      explanation: "Vùng nhớ Heap được cấp phát bởi 'new' phải được giải phóng tường minh bằng 'delete'. Nếu không giải phóng, hệ điều hành không thể thu hồi vùng nhớ đó cho đến khi tiến trình kết thúc hoàn toàn."
    }
  ],
  // Lesson 2: Lớp và Đối tượng (OOP C++)
  "2": [
    {
      id: "cp_2_1",
      timestamp_seconds: 25,
      timestamp_display: "00:25",
      title: "Tính đóng gói trong OOP",
      question: "Từ khóa phạm vi truy cập nào giúp ẩn giấu dữ liệu thành viên trong Class để chỉ các phương thức nội bộ mới truy xuất được?",
      options: [
        { key: "A", text: "public" },
        { key: "B", text: "protected" },
        { key: "C", text: "private" },
        { key: "D", text: "internal" }
      ],
      correct_answer: "C",
      points: 10,
      explanation: "Trong C++, thuộc tính khai báo 'private' chỉ có thể truy xuất từ chính các hàm thành viên bên trong lớp đó, đảm bảo tính đóng gói (Encapsulation)."
    }
  ]
};

// Lưu trữ tiến độ sinh viên trả lời
let studentProgressStore = {};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('[InteractiveVideoService] Lỗi đọc file data:', e.message);
  }
  return INITIAL_CHECKPOINTS;
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('[InteractiveVideoService] Lỗi ghi file data:', e.message);
  }
}

class InteractiveVideoService {
  constructor() {
    this.checkpoints = loadData();
  }

  // Lấy danh sách checkpoints của một bài học
  getCheckpointsByLesson(lessonId) {
    const key = String(lessonId);
    return this.checkpoints[key] || [];
  }

  // Thêm hoặc cập nhật checkpoint cho bài học (Dành cho Giảng viên)
  saveCheckpoint(lessonId, checkpointData) {
    const key = String(lessonId);
    if (!this.checkpoints[key]) {
      this.checkpoints[key] = [];
    }

    const { id, timestamp_seconds, title, question, options, correct_answer, points, explanation } = checkpointData;

    const min = Math.floor(timestamp_seconds / 60);
    const sec = timestamp_seconds % 60;
    const timestamp_display = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;

    if (id) {
      // Cập nhật
      const idx = this.checkpoints[key].findIndex(cp => cp.id === id);
      if (idx !== -1) {
        this.checkpoints[key][idx] = {
          ...this.checkpoints[key][idx],
          timestamp_seconds: Number(timestamp_seconds),
          timestamp_display,
          title,
          question,
          options,
          correct_answer,
          points: Number(points || 10),
          explanation
        };
      }
    } else {
      // Tạo mới
      const newCp = {
        id: `cp_${lessonId}_${Date.now()}`,
        timestamp_seconds: Number(timestamp_seconds),
        timestamp_display,
        title: title || `Câu hỏi kiểm tra tại ${timestamp_display}`,
        question,
        options,
        correct_answer,
        points: Number(points || 10),
        explanation: explanation || 'Chúc mừng bạn đã trả lời chính xác!'
      };
      this.checkpoints[key].push(newCp);
    }

    // Sắp xếp tăng dần theo mốc thời gian
    this.checkpoints[key].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
    saveData(this.checkpoints);

    return this.checkpoints[key];
  }

  // Xóa checkpoint (Giảng viên)
  deleteCheckpoint(lessonId, checkpointId) {
    const key = String(lessonId);
    if (!this.checkpoints[key]) return [];
    this.checkpoints[key] = this.checkpoints[key].filter(cp => cp.id !== checkpointId);
    saveData(this.checkpoints);
    return this.checkpoints[key];
  }

  // Nộp câu trả lời tại checkpoint (Sinh viên)
  submitAnswer(lessonId, studentId, { checkpointId, selectedAnswer }) {
    const key = String(lessonId);
    const list = this.checkpoints[key] || [];
    const checkpoint = list.find(cp => cp.id === checkpointId);

    if (!checkpoint) {
      throw new Error('Không tìm thấy điểm dừng câu hỏi tương ứng.');
    }

    const isCorrect = checkpoint.correct_answer === selectedAnswer;
    const studentKey = `${studentId}_${lessonId}`;

    if (!studentProgressStore[studentKey]) {
      studentProgressStore[studentKey] = {
        studentId,
        lessonId,
        answers: {},
        totalPointsEarned: 0,
        completedCheckpointsCount: 0
      };
    }

    const prog = studentProgressStore[studentKey];
    prog.answers[checkpointId] = {
      selectedAnswer,
      isCorrect,
      answeredAt: new Date().toISOString()
    };

    // Tính lại điểm
    let points = 0;
    let completedCount = 0;
    list.forEach(cp => {
      if (prog.answers[cp.id] && prog.answers[cp.id].isCorrect) {
        points += cp.points;
        completedCount++;
      }
    });

    prog.totalPointsEarned = points;
    prog.completedCheckpointsCount = completedCount;

    return {
      isCorrect,
      correctAnswer: checkpoint.correct_answer,
      explanation: checkpoint.explanation,
      pointsEarned: isCorrect ? checkpoint.points : 0,
      totalPointsEarned: prog.totalPointsEarned,
      completedCheckpointsCount: prog.completedCheckpointsCount,
      totalCheckpoints: list.length
    };
  }

  // Lấy tiến độ của sinh viên đối với video
  getStudentProgress(lessonId, studentId) {
    const key = String(lessonId);
    const list = this.checkpoints[key] || [];
    const studentKey = `${studentId}_${lessonId}`;
    const prog = studentProgressStore[studentKey] || {
      studentId,
      lessonId,
      answers: {},
      totalPointsEarned: 0,
      completedCheckpointsCount: 0
    };

    return {
      totalCheckpoints: list.length,
      completedCheckpointsCount: prog.completedCheckpointsCount,
      totalPointsEarned: prog.totalPointsEarned,
      answeredIds: Object.keys(prog.answers),
      isCompleted: list.length > 0 && prog.completedCheckpointsCount === list.length
    };
  }
}

module.exports = new InteractiveVideoService();
