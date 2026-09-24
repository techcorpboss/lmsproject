// controllers/enrollmentController.js
const { Enrollment, Course, Payment, sequelize } = require('../models/index');

// @desc    Đăng ký một khóa học
// @route   POST /api/enrollments/register
// @access  Private (Student)
exports.registerCourse = async (req, res) => {
  const { course_id, payment_method } = req.body;
  const user_id = req.user.id; // Lấy từ middleware 'protect'

  // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
  const t = await sequelize.transaction();

  try {
    // 1. Kiểm tra xem người dùng đã đăng ký khóa học này chưa
    const existingEnrollment = await Enrollment.findOne({
      where: { user_id, course_id },
      transaction: t
    });

    if (existingEnrollment) {
      await t.rollback();
      return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi.' });
    }

    // 2. Lấy thông tin khóa học để biết giá
    const course = await Course.findByPk(course_id, { transaction: t });
    if (!course) {
      await t.rollback();
      return res.status(404).json({ message: 'Không tìm thấy khóa học.' });
    }

    // 3. Tạo bản ghi Enrollment
    const newEnrollment = await Enrollment.create({
      user_id,
      course_id,
      status: 'PENDING' // Chờ thanh toán
    }, { transaction: t });

    // 4. Tạo bản ghi Payment
    await Payment.create({
      user_id,
      enrollment_id: newEnrollment.id,
      amount: course.price,
      method: payment_method,
      status: 'PENDING'
    }, { transaction: t });

    // Nếu mọi thứ thành công, commit transaction
    await t.commit();

    res.status(201).json({ 
      message: 'Đăng ký thành công! Vui lòng hoàn tất thanh toán.',
      enrollment: newEnrollment 
    });

  } catch (error) {
    // Nếu có lỗi, rollback tất cả thay đổi
    await t.rollback();
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Admin xác nhận thanh toán thành công
// @route   POST /api/enrollments/confirm-payment
// @access  Private (Admin/Manager)
exports.confirmPayment = async (req, res) => {
    const { payment_id, transaction_code } = req.body;

    const t = await sequelize.transaction();

    try {
        const payment = await Payment.findByPk(payment_id, { include: [Enrollment], transaction: t });

        if (!payment) {
            await t.rollback();
            return res.status(404).json({ message: 'Không tìm thấy thông tin thanh toán.' });
        }
        
        if (payment.status === 'SUCCESS') {
            await t.rollback();
            return res.status(400).json({ message: 'Thanh toán này đã được xác nhận trước đó.' });
        }

        // Cập nhật thanh toán
        payment.status = 'SUCCESS';
        payment.transaction_code = transaction_code || `CONFIRMED_BY_ADMIN_${Date.now()}`;
        await payment.save({ transaction: t });

        // Cập nhật trạng thái ghi danh
        if (payment.Enrollment) {
            payment.Enrollment.status = 'ACTIVE';
            await payment.Enrollment.save({ transaction: t });
        }
        
        await t.commit();

        res.status(200).json({ message: 'Xác nhận thanh toán thành công!', payment });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy danh sách các khóa học của tôi
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
exports.getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { user_id: req.user.id, status: 'ACTIVE' },
            include: [{
                model: Course,
                attributes: ['id', 'title', 'thumbnail']
            }]
        });

        const myCourses = enrollments.map(e => ({
            enrollment_id: e.id,
            progress: e.progress,
            course: e.Course
        }));

        res.status(200).json(myCourses);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};