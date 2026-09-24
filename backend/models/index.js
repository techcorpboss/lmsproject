// models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 1. User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  full_name: { type: DataTypes.STRING(150), allowNull: false },
  role: { type: DataTypes.STRING(50), defaultValue: 'student' }, // admin, teacher, student, proctor
  avatar: { type: DataTypes.STRING(255) }
}, { tableName: 'users', underscored: true, timestamps: true });

// 2. Course Model
const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  course_name: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  type: { type: DataTypes.ENUM('Nội bộ', 'Bên ngoài'), defaultValue: 'Nội bộ' },
  duration_hours: { type: DataTypes.INTEGER, defaultValue: 30 },
  status: { type: DataTypes.ENUM('Sắp diễn ra', 'Đang diễn ra', 'Đã kết thúc'), defaultValue: 'Đang diễn ra' },
  category: { type: DataTypes.STRING(100), defaultValue: 'Chuyên môn nghiệp vụ' },
  cost: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
  credit_hours: { type: DataTypes.INTEGER, defaultValue: 3 },
  created_by: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { tableName: 'courses', underscored: true, timestamps: true });

// 3. Course Section Model
const CourseSection = sequelize.define('CourseSection', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { tableName: 'course_sections', underscored: true, timestamps: true });

// 4. Course Lesson Model
const CourseLesson = sequelize.define('CourseLesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  section_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  lesson_type: { type: DataTypes.ENUM('video', 'document', 'html', 'quiz'), defaultValue: 'video' },
  media_url: { type: DataTypes.STRING(500) },
  document_url: { type: DataTypes.STRING(500) },
  content_html: { type: DataTypes.TEXT('long') },
  duration_minutes: { type: DataTypes.INTEGER, defaultValue: 15 },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 1 },
  is_mandatory: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'course_lessons', underscored: true, timestamps: true });

// 5. Quiz Assessment Model
const QuizAssessment = sequelize.define('QuizAssessment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  time_limit_minutes: { type: DataTypes.INTEGER, defaultValue: 15 },
  passing_score_pct: { type: DataTypes.INTEGER, defaultValue: 70 },
  max_attempts: { type: DataTypes.INTEGER, defaultValue: 3 },
  shuffle_questions: { type: DataTypes.BOOLEAN, defaultValue: true },
  shuffle_options: { type: DataTypes.BOOLEAN, defaultValue: true },
  show_explanation: { type: DataTypes.BOOLEAN, defaultValue: true },
  random_question_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('active', 'draft', 'closed'), defaultValue: 'active' }
}, { tableName: 'quiz_assessments', underscored: true, timestamps: true });

// 6. Quiz Question Model
const QuizQuestion = sequelize.define('QuizQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quiz_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  question_type: { type: DataTypes.ENUM('single_choice', 'multiple_choice', 'true_false'), defaultValue: 'single_choice' },
  question_text: { type: DataTypes.TEXT, allowNull: false },
  options_json: { type: DataTypes.JSON, allowNull: false },
  correct_answer: { type: DataTypes.STRING(50), allowNull: false },
  explanation: { type: DataTypes.TEXT },
  points: { type: DataTypes.FLOAT, defaultValue: 10 },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { tableName: 'quiz_questions', underscored: true, timestamps: true });

// 7. Quiz Submission Model
const QuizSubmission = sequelize.define('QuizSubmission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quiz_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false, field: 'employee_id' },
  attempt_number: { type: DataTypes.INTEGER, defaultValue: 1 },
  score_achieved: { type: DataTypes.FLOAT, allowNull: false },
  score_percentage: { type: DataTypes.FLOAT, allowNull: false },
  is_passed: { type: DataTypes.BOOLEAN, allowNull: false },
  time_spent_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  answers_detail: { type: DataTypes.JSON },
  submitted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'quiz_submissions', underscored: true, timestamps: false });

// 8. Course Certificate Model
const CourseCertificate = sequelize.define('CourseCertificate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  certificate_code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false, field: 'employee_id' },
  final_score: { type: DataTypes.FLOAT, allowNull: false },
  pdf_url: { type: DataTypes.STRING(500) },
  issued_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'course_certificates', underscored: true, timestamps: false });

// 9. QBank Category Model
const QbankCategory = sequelize.define('QbankCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  parent_id: { type: DataTypes.INTEGER, allowNull: true },
  code: { type: DataTypes.STRING(50), allowNull: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  course_code: { type: DataTypes.STRING(50), allowNull: true }
}, { tableName: 'qbank_categories', underscored: true, timestamps: true });

// 10. QBank Question Model
const QbankQuestion = sequelize.define('QbankQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  question_type: { type: DataTypes.ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'ESSAY', 'TRUE_FALSE'), defaultValue: 'SINGLE_CHOICE' },
  difficulty: { type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD', 'EXPERT'), defaultValue: 'MEDIUM' },
  default_mark: { type: DataTypes.DECIMAL(4, 2), defaultValue: 1.0 },
  status: { type: DataTypes.ENUM('DRAFT', 'APPROVED', 'REJECTED'), defaultValue: 'APPROVED' }
}, { tableName: 'qbank_questions', underscored: true, timestamps: true });

// 11. QBank Answer Model
const QbankAnswer = sequelize.define('QbankAnswer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question_id: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
  fraction: { type: DataTypes.DECIMAL(4, 2), defaultValue: 0.00 }
}, { tableName: 'qbank_answers', underscored: true, timestamps: true });

// 12. Exam Template Model
const ExamTemplate = sequelize.define('ExamTemplate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false },
  total_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 10.0 },
  duration_minutes: { type: DataTypes.INTEGER, defaultValue: 60 }
}, { tableName: 'exam_templates', underscored: true, timestamps: true });

// 13. Exam Template Rule Model
const ExamTemplateRule = sequelize.define('ExamTemplateRule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  template_id: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  difficulty: { type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD', 'EXPERT', 'ANY'), defaultValue: 'ANY' },
  question_type: { type: DataTypes.ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'ESSAY', 'TRUE_FALSE', 'ANY'), defaultValue: 'ANY' },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  mark_per_question: { type: DataTypes.DECIMAL(4, 2), defaultValue: 1.0 }
}, { tableName: 'exam_template_rules', underscored: true, timestamps: true });

// 14. Exam Paper Model
const ExamPaper = sequelize.define('ExamPaper', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  template_id: { type: DataTypes.INTEGER, allowNull: true },
  paper_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  total_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 10.0 },
  status: { type: DataTypes.ENUM('DRAFT', 'APPROVED', 'USED'), defaultValue: 'APPROVED' }
}, { tableName: 'exam_papers', underscored: true, timestamps: true });

// 15. Exam Paper Question Model
const ExamPaperQuestion = sequelize.define('ExamPaperQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paper_id: { type: DataTypes.INTEGER, allowNull: false },
  question_id: { type: DataTypes.INTEGER, allowNull: false },
  mark_allocated: { type: DataTypes.DECIMAL(4, 2), defaultValue: 1.0 },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { tableName: 'exam_paper_questions', underscored: true, timestamps: false });

// 16. Academic Exam Schedule Model
const AcademicExamSchedule = sequelize.define('AcademicExamSchedule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  exam_name: { type: DataTypes.STRING(255), allowNull: false },
  exam_date: { type: DataTypes.DATEONLY, allowNull: false },
  start_time: { type: DataTypes.STRING(10), defaultValue: '07:30' },
  end_time: { type: DataTypes.STRING(10), defaultValue: '09:00' },
  course_id: { type: DataTypes.INTEGER, allowNull: true },
  course_name: { type: DataTypes.STRING(255), allowNull: true },
  paper_id: { type: DataTypes.INTEGER, allowNull: true },
  status: { type: DataTypes.STRING(50), defaultValue: 'SCHEDULED' }
}, { tableName: 'academic_exam_schedules', underscored: true, timestamps: true });

// Associations
Course.hasMany(CourseSection, { foreignKey: 'course_id', as: 'sections' });
CourseSection.belongsTo(Course, { foreignKey: 'course_id' });

CourseSection.hasMany(CourseLesson, { foreignKey: 'section_id', as: 'lessons' });
CourseLesson.belongsTo(CourseSection, { foreignKey: 'section_id' });

Course.hasMany(QuizAssessment, { foreignKey: 'course_id', as: 'quizzes' });
QuizAssessment.belongsTo(Course, { foreignKey: 'course_id' });

QuizAssessment.hasMany(QuizQuestion, { foreignKey: 'quiz_id', as: 'questions' });
QuizQuestion.belongsTo(QuizAssessment, { foreignKey: 'quiz_id' });

QuizAssessment.hasMany(QuizSubmission, { foreignKey: 'quiz_id', as: 'submissions' });
QuizSubmission.belongsTo(QuizAssessment, { foreignKey: 'quiz_id' });

QbankCategory.hasMany(QbankQuestion, { foreignKey: 'category_id', as: 'questions' });
QbankQuestion.belongsTo(QbankCategory, { foreignKey: 'category_id', as: 'category' });

QbankQuestion.hasMany(QbankAnswer, { foreignKey: 'question_id', as: 'answers' });
QbankAnswer.belongsTo(QbankQuestion, { foreignKey: 'question_id' });

ExamTemplate.hasMany(ExamTemplateRule, { foreignKey: 'template_id', as: 'rules' });
ExamTemplateRule.belongsTo(ExamTemplate, { foreignKey: 'template_id' });

ExamPaper.belongsToMany(QbankQuestion, { through: ExamPaperQuestion, foreignKey: 'paper_id', otherKey: 'question_id', as: 'questions' });
QbankQuestion.belongsToMany(ExamPaper, { through: ExamPaperQuestion, foreignKey: 'question_id', otherKey: 'paper_id' });

module.exports = {
  sequelize,
  User,
  Course,
  CourseSection,
  CourseLesson,
  QuizAssessment,
  QuizQuestion,
  QuizSubmission,
  CourseCertificate,
  QbankCategory,
  QbankQuestion,
  QbankAnswer,
  ExamTemplate,
  ExamTemplateRule,
  ExamPaper,
  ExamPaperQuestion,
  AcademicExamSchedule
};