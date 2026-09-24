// routes/exam.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const examService = require('../services/examService');
const { QbankCategory, QbankQuestion, QbankAnswer, ExamTemplate, ExamPaper } = require('../models');

router.use(protect);

// 1. Ngân hàng câu hỏi: Danh mục
router.get('/categories', async (req, res) => {
  try {
    const data = await examService.getCategories();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Ngân hàng câu hỏi: Lấy câu hỏi
router.get('/questions', async (req, res) => {
  try {
    const { category_id, difficulty } = req.query;
    const data = await examService.getQuestions(category_id, difficulty);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Ngân hàng câu hỏi: Tạo câu hỏi mới
router.post('/questions', async (req, res) => {
  try {
    const { category_id, content, question_type, difficulty, default_mark, answers } = req.body;
    const q = await QbankQuestion.create({
      category_id: category_id || 1,
      content,
      question_type: question_type || 'SINGLE_CHOICE',
      difficulty: difficulty || 'MEDIUM',
      default_mark: default_mark || 1.0,
      status: 'APPROVED'
    });

    if (answers && Array.isArray(answers)) {
      for (const a of answers) {
        await QbankAnswer.create({
          question_id: q.id,
          content: a.content,
          is_correct: !!a.is_correct,
          fraction: a.fraction || (a.is_correct ? 1.0 : 0.0)
        });
      }
    }

    res.json({ success: true, data: q });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Ma trận đề thi: Danh sách mẫu ma trận
router.get('/templates', async (req, res) => {
  try {
    const data = await ExamTemplate.findAll({
      order: [['id', 'DESC']]
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Ma trận đề thi: Tạo mẫu ma trận mới
router.post('/templates', async (req, res) => {
  try {
    const { template, rules } = req.body;
    const data = await examService.createTemplate(template, rules);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Động cơ sinh đề: Bốc đề ngẫu nhiên theo ma trận
router.post('/templates/:id/generate', async (req, res) => {
  try {
    const { paper_name, paper_code } = req.body;
    const paper = await examService.generatePaperFromTemplate(req.params.id, paper_name, paper_code);
    res.json({ success: true, data: paper, message: 'Đã sinh đề thi thành công theo ma trận chuẩn Bloom!' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Phòng thi trực tuyến: Kiểm tra quyền vào phòng thi & tải đề
router.get('/access', async (req, res) => {
  try {
    const { schedule_id } = req.query;
    const data = await examService.checkExamAccess(schedule_id, req.user);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Phòng thi trực tuyến: Nộp bài thi
router.post('/submit', async (req, res) => {
  try {
    const { paper_id, answers, time_spent_seconds, violation_count } = req.body;
    
    // Tự động chấm điểm trắc nghiệm
    const paper = await ExamPaper.findByPk(paper_id, {
      include: [{
        model: QbankQuestion,
        as: 'questions',
        include: [{ model: QbankAnswer, as: 'answers' }]
      }]
    });

    if (!paper) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy đề thi.' });
    }

    let totalMarks = 0;
    let earnedMarks = 0;
    const details = [];

    for (const q of paper.questions) {
      const qMark = Number(q.ExamPaperQuestion?.mark_allocated || q.default_mark || 1);
      totalMarks += qMark;

      const chosenAnswerId = answers ? answers[q.id] : null;
      const correctAnswer = q.answers.find(a => a.is_correct);
      const isCorrect = correctAnswer && Number(chosenAnswerId) === Number(correctAnswer.id);

      if (isCorrect) {
        earnedMarks += qMark;
      }

      details.push({
        question_id: q.id,
        chosen_answer_id: chosenAnswerId,
        correct_answer_id: correctAnswer ? correctAnswer.id : null,
        is_correct: isCorrect,
        mark: isCorrect ? qMark : 0
      });
    }

    const finalScore = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 10 * 10) / 10 : 0;

    res.json({
      success: true,
      data: {
        paper_id,
        user_id: req.user.id,
        student_name: req.user.full_name,
        total_marks: totalMarks,
        earned_marks: earnedMarks,
        score_10: finalScore,
        time_spent_seconds: time_spent_seconds || 0,
        violation_count: violation_count || 0,
        details
      },
      message: 'Nộp bài thi thành công!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Chuẩn trao đổi đề thi quốc tế IMS QTI v2.1 / v3.0
const examAdvanced = require('../controllers/examAdvanced.controller');
router.get('/qti/export/:paperId', examAdvanced.exportPaperToQti);
router.post('/qti/import', examAdvanced.importQtiPackage);

// 10. Cấu hình & Xác thực Safe Exam Browser (SEB) / Kiosk Mode
router.get('/seb/config', examAdvanced.generateSebConfigFile);
router.get('/seb/verify', examAdvanced.verifySebClient);

// 11. Giám thị thời gian thực: Báo cáo vi phạm, AI snapshot & Danh sách vi phạm
router.post('/proctor/violation-log', examAdvanced.reportProctoringIncident);
router.get('/proctor/incidents', examAdvanced.getProctoringIncidents);
router.put('/proctor/incidents/:id/resolve', examAdvanced.resolveIncident);

module.exports = router;
