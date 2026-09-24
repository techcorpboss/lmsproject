// controllers/courseController.js
const { Course, CourseCategory, Lesson } = require('../models/index');
const { Op } = require('sequelize'); 
// @desc    Tạo khóa học mới
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Tạo khóa học thất bại', error: error.message });
  }
};

// @desc    Lấy tất cả khóa học (có phân trang và filter)
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword, categoryId, level } = req.query;

    const offset = (page - 1) * limit;

    // Build the where clause for filtering
    let whereClause = {};
    if (keyword) {
      whereClause.title = { [Op.like]: `%${keyword}%` }; // Tìm kiếm theo tiêu đề
    }
    if (categoryId) {
      whereClause.category_id = categoryId;
    }
    if (level) {
      whereClause.level = level;
    }

    // Sử dụng findAndCountAll để lấy cả dữ liệu và tổng số bản ghi
    const { count, rows } = await Course.findAndCountAll({
      where: whereClause,
      include: [{ model: CourseCategory, attributes: ['name'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // Quan trọng khi có include để count cho đúng
    });

    res.status(200).json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Lấy thông tin chi tiết một khóa học (bao gồm cả bài học)
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: CourseCategory, attributes: ['name'] },
        { 
          model: Lesson, 
          attributes: ['id', 'title', 'lesson_order', 'type'], // Chỉ lấy các trường cần thiết
          order: [['lesson_order', 'ASC']]
        }
      ]
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Cập nhật khóa học
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật thất bại', error: error.message });
    }
};

// @desc    Xóa khóa học
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.destroy();
            res.status(200).json({ message: 'Khóa học đã được xóa' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};