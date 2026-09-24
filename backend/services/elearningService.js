// services/elearningService.js
// Modern International E-Learning (LMS) Service — lms.techcorp.info.vn
// Quản lý học tập, bài giảng đa phương tiện, ngân hàng đề thi & chấm điểm tự động 100%
'use strict';

const mysql = require('mysql2/promise');

const getDbConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123@',
    database: process.env.DB_NAME || 'lms_db'
  });
};

/**
 * Lấy danh sách khóa học kèm tiến độ học tập thực tế của học viên
 */
const listCoursesWithProgress = async (userId) => {
  const db = await getDbConnection();
  try {
    const [courses] = await db.execute(`
      SELECT 
        c.id, c.course_code, c.course_name, c.description, c.type, 
        c.duration_hours, c.status, c.category, c.credit_hours,
        cert.certificate_code,
        cert.issued_at as certificate_issued_at,
        cert.final_score as certificate_score
      FROM courses c
      LEFT JOIN course_certificates cert ON c.id = cert.course_id AND cert.employee_id = ?
      WHERE c.deleted_at IS NULL
      ORDER BY c.id ASC
    `, [userId || 0]);

    for (const course of courses) {
      const [lessons] = await db.execute(`
        SELECT COUNT(*) as total_lessons FROM course_lessons WHERE course_id = ?
      `, [course.id]);
      
      const totalLessons = lessons[0]?.total_lessons || 5;
      course.total_lessons = totalLessons;

      // Điểm thi quiz cao nhất
      const [submissions] = await db.execute(`
        SELECT MAX(score_percentage) as max_score, MAX(is_passed) as passed
        FROM quiz_submissions
        WHERE course_id = ? AND employee_id = ?
      `, [course.id, userId || 0]);

      const isPassed = submissions[0]?.passed === 1;
      const maxScore = submissions[0]?.max_score || 0;

      course.is_passed = isPassed;
      course.max_score = maxScore;
      course.progress_pct = isPassed ? 100 : (maxScore > 0 ? 50 : 25);
    }

    return courses;
  } finally {
    await db.end();
  }
};

/**
 * Lấy chi tiết đề cương, bài giảng đa phương tiện của khóa học
 */
const getCourseCurriculum = async (courseId, userId) => {
  const db = await getDbConnection();
  try {
    const [courses] = await db.execute(`
      SELECT * FROM courses WHERE id = ? AND deleted_at IS NULL
    `, [courseId]);

    if (!courses.length) {
      throw new Error('Không tìm thấy khóa học.');
    }
    const course = courses[0];

    const [sections] = await db.execute(`
      SELECT * FROM course_sections WHERE course_id = ? ORDER BY sort_order ASC, id ASC
    `, [courseId]);

    for (const sec of sections) {
      const [lessons] = await db.execute(`
        SELECT id, section_id, course_id, title, lesson_type, media_url, document_url, 
               content_html, duration_minutes, sort_order, is_mandatory
        FROM course_lessons 
        WHERE section_id = ? 
        ORDER BY sort_order ASC, id ASC
      `, [sec.id]);
      sec.lessons = lessons;
    }

    // Thông tin bài kiểm tra cuối khóa
    const [quizzes] = await db.execute(`
      SELECT id, course_id, title, description, time_limit_minutes, passing_score_pct, max_attempts
      FROM quiz_assessments
      WHERE course_id = ? AND status = 'active'
      LIMIT 1
    `, [courseId]);

    let quizInfo = null;
    if (quizzes.length > 0) {
      quizInfo = quizzes[0];
      const [subs] = await db.execute(`
        SELECT id, attempt_number, score_achieved, score_percentage, is_passed, time_spent_seconds, submitted_at
        FROM quiz_submissions
        WHERE quiz_id = ? AND employee_id = ?
        ORDER BY attempt_number DESC
      `, [quizInfo.id, userId || 0]);
      quizInfo.my_submissions = subs;
    }

    return {
      course,
      sections,
      quiz: quizInfo
    };
  } finally {
    await db.end();
  }
};

/**
 * Lưu cấu trúc chương và bài học
 */
const saveCourseCurriculum = async (courseId, payload) => {
  const db = await getDbConnection();
  try {
    const { sections } = payload;
    if (!sections || !Array.isArray(sections)) {
      throw new Error('Cấu trúc chương bài học không hợp lệ.');
    }

    await db.beginTransaction();
    await db.execute('DELETE FROM course_lessons WHERE course_id = ?', [courseId]);
    await db.execute('DELETE FROM course_sections WHERE course_id = ?', [courseId]);

    let secOrder = 1;
    for (const sec of sections) {
      const [insSec] = await db.execute(`
        INSERT INTO course_sections (course_id, title, description, sort_order)
        VALUES (?, ?, ?, ?)
      `, [courseId, sec.title, sec.description || '', secOrder++]);

      const sectionId = insSec.insertId;

      if (sec.lessons && Array.isArray(sec.lessons)) {
        let lesOrder = 1;
        for (const les of sec.lessons) {
          await db.execute(`
            INSERT INTO course_lessons (section_id, course_id, title, lesson_type, media_url, document_url, content_html, duration_minutes, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            sectionId,
            courseId,
            les.title,
            les.lesson_type || 'video',
            les.media_url || null,
            les.document_url || null,
            les.content_html || null,
            les.duration_minutes || 15,
            lesOrder++
          ]);
        }
      }
    }

    await db.commit();
    return { success: true, message: 'Đã lưu cấu trúc đề cương bài học thành công!' };
  } catch (err) {
    await db.rollback();
    throw err;
  } finally {
    await db.end();
  }
};

/**
 * Lấy bài thi trắc nghiệm để làm bài (ẨN ĐÁP ÁN ĐÚNG để bảo mật)
 */
const getQuizForTaking = async (courseId, userId) => {
  const db = await getDbConnection();
  try {
    const [quizzes] = await db.execute(`
      SELECT * FROM quiz_assessments WHERE course_id = ? AND status = 'active' LIMIT 1
    `, [courseId]);

    if (!quizzes.length) {
      throw new Error('Khóa học này hiện chưa mở bài kiểm tra đánh giá.');
    }

    const quiz = quizzes[0];

    const [submissions] = await db.execute(`
      SELECT COUNT(*) as count FROM quiz_submissions WHERE quiz_id = ? AND employee_id = ?
    `, [quiz.id, userId || 0]);

    const attemptsCount = submissions[0]?.count || 0;
    if (quiz.max_attempts > 0 && attemptsCount >= quiz.max_attempts) {
      throw new Error(`Bạn đã hết lượt làm bài thi này (Tối đa ${quiz.max_attempts} lần).`);
    }

    const [questions] = await db.execute(`
      SELECT id, quiz_id, course_id, question_type, question_text, options_json, points, sort_order
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY sort_order ASC, id ASC
    `, [quiz.id]);

    const safeQuestions = questions.map(q => {
      let options = [];
      try {
        options = typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json;
      } catch (e) {
        options = [];
      }
      return {
        id: q.id,
        quiz_id: q.quiz_id,
        question_type: q.question_type,
        question_text: q.question_text,
        options: options,
        points: q.points
      };
    });

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        time_limit_minutes: quiz.time_limit_minutes,
        passing_score_pct: quiz.passing_score_pct,
        total_questions: safeQuestions.length,
        current_attempt: attemptsCount + 1,
        max_attempts: quiz.max_attempts
      },
      questions: safeQuestions
    };
  } finally {
    await db.end();
  }
};

/**
 * Nộp bài thi và chấm điểm tự động 100%
 */
const submitQuizAndAutoGrade = async (quizId, userId, payload) => {
  const db = await getDbConnection();
  try {
    const { answers, time_spent_seconds } = payload; // answers = { [question_id]: selectedKey }
    
    const [quizzes] = await db.execute(`
      SELECT * FROM quiz_assessments WHERE id = ?
    `, [quizId]);

    if (!quizzes.length) {
      throw new Error('Không tìm thấy cấu hình bài kiểm tra.');
    }
    const quiz = quizzes[0];

    const [questions] = await db.execute(`
      SELECT id, correct_answer, points, explanation FROM quiz_questions WHERE quiz_id = ?
    `, [quizId]);

    let totalPoints = 0;
    let earnedPoints = 0;
    const gradingDetails = [];

    for (const q of questions) {
      const qPoints = Number(q.points) || 10;
      totalPoints += qPoints;
      const studentAnswer = answers ? answers[q.id] : null;
      const isCorrect = String(studentAnswer).trim().toUpperCase() === String(q.correct_answer).trim().toUpperCase();

      if (isCorrect) {
        earnedPoints += qPoints;
      }

      gradingDetails.push({
        question_id: q.id,
        student_answer: studentAnswer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        points_earned: isCorrect ? qPoints : 0,
        explanation: q.explanation
      });
    }

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100 * 10) / 10 : 0;
    const isPassed = percentage >= quiz.passing_score_pct;

    const [attempts] = await db.execute(`
      SELECT COUNT(*) as count FROM quiz_submissions WHERE quiz_id = ? AND employee_id = ?
    `, [quizId, userId || 0]);
    const attemptNumber = (attempts[0]?.count || 0) + 1;

    // Lưu kết quả bài làm
    const [subRes] = await db.execute(`
      INSERT INTO quiz_submissions (quiz_id, course_id, employee_id, attempt_number, score_achieved, score_percentage, is_passed, time_spent_seconds, answers_detail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      quizId,
      quiz.course_id,
      userId || 0,
      attemptNumber,
      earnedPoints,
      percentage,
      isPassed ? 1 : 0,
      time_spent_seconds || 0,
      JSON.stringify(gradingDetails)
    ]);

    // Tự động cấp chứng chỉ điện tử số hóa nếu Đạt chuẩn
    let certificate = null;
    if (isPassed) {
      const certCode = `CERT-${quiz.course_id}-${userId}-${Date.now().toString().slice(-6)}`;
      const [existingCert] = await db.execute(`
        SELECT * FROM course_certificates WHERE course_id = ? AND employee_id = ?
      `, [quiz.course_id, userId || 0]);

      if (existingCert.length === 0) {
        await db.execute(`
          INSERT INTO course_certificates (certificate_code, course_id, employee_id, final_score)
          VALUES (?, ?, ?, ?)
        `, [certCode, quiz.course_id, userId || 0, percentage]);
        certificate = { certificate_code: certCode, final_score: percentage, issued_at: new Date() };
      } else {
        certificate = existingCert[0];
      }
    }

    return {
      submission_id: subRes.insertId,
      score_achieved: earnedPoints,
      total_points: totalPoints,
      score_percentage: percentage,
      is_passed: isPassed,
      passing_score_pct: quiz.passing_score_pct,
      attempt_number: attemptNumber,
      grading_details: gradingDetails,
      certificate
    };
  } finally {
    await db.end();
  }
};

/**
 * Lấy chứng chỉ điện tử của học viên
 */
const getCourseCertificate = async (courseId, userId) => {
  const db = await getDbConnection();
  try {
    const [certs] = await db.execute(`
      SELECT cert.*, c.course_name, c.course_code, c.duration_hours, u.full_name as student_name
      FROM course_certificates cert
      JOIN courses c ON cert.course_id = c.id
      LEFT JOIN users u ON cert.employee_id = u.id
      WHERE cert.course_id = ? AND cert.employee_id = ?
      LIMIT 1
    `, [courseId, userId || 0]);

    if (!certs.length) {
      throw new Error('Chưa có chứng chỉ số cho khóa học này.');
    }
    return certs[0];
  } finally {
    await db.end();
  }
};

module.exports = {
  listCoursesWithProgress,
  getCourseCurriculum,
  saveCourseCurriculum,
  getQuizForTaking,
  submitQuizAndAutoGrade,
  getCourseCertificate
};
