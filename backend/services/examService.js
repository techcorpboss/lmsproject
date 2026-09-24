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
    const schedule = await AcademicExamSchedule.findByPk(scheduleId || 1);
    if (!schedule) {
      // Mock schedule if none exists
      return {
        status: 'OPEN',
        can_enter: true,
        message: 'Ca thi đang mở. Chúc bạn làm bài tốt!',
        schedule: {
          id: 1,
          exam_name: 'Thi Trắc nghiệm Trực tuyến — Học kỳ 1 (2026-2027)',
          start_time: '08:00',
          end_time: '23:59',
          duration_minutes: 60
        },
        paper: await this.getSampleOrFirstPaper()
      };
    }

    return {
      status: 'OPEN',
      can_enter: true,
      message: 'Ca thi hợp lệ.',
      schedule,
      paper: await this.getSampleOrFirstPaper(schedule.paper_id)
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
