// controllers/lessonController.js
const { Lesson, Enrollment, Course } = require('../models/index');

// @desc    Lấy nội dung chi tiết một bài học
// @route   GET /api/lessons/:id
// @access  Private (Enrolled Students)
exports.getLessonById = async (req, res) => {
    try {
        const lessonId = req.params.id;
        const userId = req.user.id;

        // 1. Lấy thông tin bài học
        const lesson = await Lesson.findByPk(lessonId, {
            include: { // Lấy cả thông tin khóa học chứa nó
                model: Course,
                attributes: ['id', 'title']
            }
        });

        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học.' });
        }

        // 2. Kiểm tra quyền truy cập của người dùng
        // Người dùng phải có một enrollment 'ACTIVE' với khóa học này
        const enrollment = await Enrollment.findOne({
            where: {
                user_id: userId,
                course_id: lesson.Course.id,
                status: 'ACTIVE'
            }
        });

        if (!enrollment && req.user.role === 'STUDENT') {
            return res.status(403).json({ message: 'Bạn chưa đăng ký hoặc chưa hoàn tất thanh toán cho khóa học này.' });
        }

        // 3. Nếu là học viên đã đăng ký hoặc là admin/teacher, trả về nội dung bài học
        res.status(200).json(lesson);

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- CÁC API CRUD CHO BÀI HỌC (cho Admin) ---

// @desc    Tạo bài học mới cho một khóa học
// @route   POST /api/courses/:courseId/lessons
// @access  Private/Admin
exports.createLesson = async (req, res) => {
    const { courseId } = req.params;
    try {
        const lesson = await Lesson.create({ ...req.body, course_id: courseId });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ message: 'Tạo bài học thất bại', error: error.message });
    }
};

// @desc    Cập nhật bài học
// @route   PUT /api/lessons/:id
// @access  Private/Admin
exports.updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (lesson) {
            await lesson.update(req.body);
            res.status(200).json(lesson);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài học' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật thất bại', error: error.message });
    }
};

// @desc    Xóa bài học
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (lesson) {
            await lesson.destroy();
            res.status(200).json({ message: 'Bài học đã được xóa' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài học' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};