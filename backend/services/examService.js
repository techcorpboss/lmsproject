// services/examService.js
// Modern Online Exam & Question Bank Generator Service — lms.techcorp.info.vn
'use strict';

const {
  sequelize,
  QbankCategory,
  QbankQuestion,
  QbankAnswer,
  ExamTemplate,
  ExamTemplateRule,
  ExamPaper,
  ExamPaperQuestion,
  AcademicExamSchedule
} = require('../models');

class ExamService {

  // 1. Quản lý danh mục ngân hàng câu hỏi
  async getCategories() {
    return await QbankCategory.findAll({
      order: [['id', 'ASC']]
    });
  }

  // 2. Lấy danh sách câu hỏi trong ngân hàng
  async getQuestions(categoryId, difficulty) {
    const where = {};
    if (categoryId) where.category_id = categoryId;
    if (difficulty && difficulty !== 'ALL') where.difficulty = difficulty;

    return await QbankQuestion.findAll({
      where,
      include: [{ model: QbankAnswer, as: 'answers' }],
      order: [['id', 'DESC']]
    });
  }

  // 3. Tạo mẫu ma trận đề thi (Template & Rules)
  async createTemplate(data, rules) {
    const transaction = await sequelize.transaction();
    try {
      const template = await ExamTemplate.create(data, { transaction });
      
      if (rules && rules.length > 0) {
        const rulesData = rules.map(r => ({ ...r, template_id: template.id }));
        await ExamTemplateRule.bulkCreate(rulesData, { transaction });
      }
      
      await transaction.commit();
      return await ExamTemplate.findByPk(template.id, {
        include: [{ model: ExamTemplateRule, as: 'rules' }]
      });
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  // 4. ĐỘNG CƠ SINH ĐỀ THI TỰ ĐỘNG THEO MA TRẬN CHUẨN BLOOM
  async generatePaperFromTemplate(templateId, paperName, paperCode) {
    const template = await ExamTemplate.findByPk(templateId, {
      include: [{ model: ExamTemplateRule, as: 'rules' }]
    });
    if (!template) throw new Error('Không tìm thấy mẫu ma trận đề thi.');

    const transaction = await sequelize.transaction();
    try {
      const paper = await ExamPaper.create({
        template_id: template.id,
        paper_code: paperCode || ('EXAM_' + Date.now()),
        name: paperName || (template.name + ' - Đề ' + Math.floor(Math.random() * 1000)),
        total_marks: template.total_marks,
        status: 'APPROVED'
      }, { transaction });

      let sortOrder = 1;
      const paperQuestions = [];

      for (const rule of template.rules) {
        const whereClause = { category_id: rule.category_id, status: 'APPROVED' };
        if (rule.difficulty && rule.difficulty !== 'ANY') whereClause.difficulty = rule.difficulty;
        if (rule.question_type && rule.question_type !== 'ANY') whereClause.question_type = rule.question_type;

        const questions = await QbankQuestion.findAll({
          where: whereClause,
          order: [sequelize.fn('RAND')],
          limit: rule.quantity,
          transaction
        });

        if (questions.length < rule.quantity) {
          throw new Error(`Ngân hàng câu hỏi không đủ! Cần: ${rule.quantity} câu (${rule.difficulty}), nhưng danh mục chỉ có ${questions.length} câu.`);
        }

        for (const q of questions) {
          paperQuestions.push({
            paper_id: paper.id,
            question_id: q.id,
            mark_allocated: rule.mark_per_question,
            sort_order: sortOrder++
          });
        }
      }

      await ExamPaperQuestion.bulkCreate(paperQuestions, { transaction });
      await transaction.commit();

      return await ExamPaper.findByPk(paper.id, {
        include: [
          {
            model: QbankQuestion,
            as: 'questions',
            include: [{ model: QbankAnswer, as: 'answers' }]
          }
        ]
      });
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  // 5. Kiểm tra quyền vào phòng thi & Lấy đề thi cho thí sinh
  async checkExamAccess(scheduleId, user) {
    const { ExamCandidateAuthorization, sequelize } = require('../models');
    let schedule = null;
    
    if (scheduleId) {
      schedule = await AcademicExamSchedule.findByPk(scheduleId);
    }
    if (!schedule) {
      schedule = await AcademicExamSchedule.findOne({ order: [['id', 'ASC']] });
    }

    if (!schedule) {
      return {
        status: 'CLOSED',
        can_enter: false,
        message: 'Không tìm thấy ca thi nào đang mở trên hệ thống.'
      };
    }

    const isPrivileged = user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'teacher');

    if (!isPrivileged && user) {
      const studentCode = user.student_code || user.username;
      const authRecord = await ExamCandidateAuthorization.findOne({
        where: {
          schedule_id: schedule.id,
          [sequelize.Sequelize.Op.or]: [
            { student_code: studentCode },
            { student_id: user.id },
            { student_name: user.full_name }
          ]
        }
      });

      if (!authRecord || authRecord.authorization_status !== 'GRANTED') {
        const status = authRecord ? authRecord.authorization_status : 'PENDING';
        const reason = authRecord?.notes || 'Chưa được Admin hoặc SuperAdmin phê duyệt đủ điều kiện dự thi theo quy chế Bộ GD&ĐT (chuyên cần, học phí).';

        return {
          status: 'UNAUTHORIZED',
          can_enter: false,
          authorization_status: status,
          reason,
          seat_number: authRecord?.seat_number || 'Chưa xếp SBD',
          student_info: {
            name: user.full_name,
            code: studentCode,
            class_name: user.class_name || authRecord?.class_name || 'Chưa phân lớp',
            attendance_pct: authRecord?.attendance_pct || 75,
            tuition_cleared: authRecord?.tuition_cleared || false
          },
          schedule: {
            id: schedule.id,
            exam_name: schedule.exam_name,
            course_name: schedule.course_name,
            course_code: schedule.course_code,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            duration_minutes: schedule.duration_minutes
          },
          message: `Thí sinh [${user.full_name}] chưa được cấp quyền tham gia ca thi này. Vui lòng liên hệ Hội đồng Khảo thí hoặc Quản trị viên để được phê duyệt điều kiện dự thi.`
        };
      }

      // Đã được cấp quyền dự thi chính thức!
      return {
        status: 'GRANTED',
        can_enter: true,
        authorization_status: 'GRANTED',
        seat_number: authRecord.seat_number,
        student_info: {
          name: user.full_name,
          code: studentCode,
          seat_number: authRecord.seat_number,
          class_name: authRecord.class_name
        },
        schedule,
        paper: await this.getSampleOrFirstPaper(schedule.paper_id),
        message: `Chào mừng thí sinh ${user.full_name} (${authRecord.seat_number}). Bạn đã được cấp quyền dự thi chính thức!`
      };
    }

    // Admin, SuperAdmin, Giảng viên có quyền xem trước (Preview) hoặc giám thị
    return {
      status: 'ADMIN_PREVIEW',
      can_enter: true,
      authorization_status: 'GRANTED',
      is_admin_mode: true,
      seat_number: 'GIÁM THỊ / ADMIN',
      student_info: {
        name: user?.full_name || 'Quản trị viên',
        code: user?.username || 'admin',
        seat_number: 'ADMIN'
      },
      schedule,
      paper: await this.getSampleOrFirstPaper(schedule.paper_id),
      message: 'Chế độ xem trước & giám sát đề thi dành cho Quản trị viên / Hội đồng thi.'
    };
  }

  // Lấy đề thi chuẩn cho ca thi
  async getSampleOrFirstPaper(paperId) {
    let paper = null;
    if (paperId) {
      paper = await ExamPaper.findByPk(paperId, {
        include: [{
          model: QbankQuestion,
          as: 'questions',
          include: [{ model: QbankAnswer, as: 'answers', attributes: ['id', 'content'] }]
        }]
      });
    }

    if (!paper) {
      paper = await ExamPaper.findOne({
        include: [{
          model: QbankQuestion,
          as: 'questions',
          include: [{ model: QbankAnswer, as: 'answers', attributes: ['id', 'content'] }]
        }]
      });
    }

    return paper;
  }
}

module.exports = new ExamService();
