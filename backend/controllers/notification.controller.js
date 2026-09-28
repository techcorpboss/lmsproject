// backend/controllers/notification.controller.js
// Modern Full-System Academic Notification & Alert Engine — TT 08/2021 & Institutional Broadcasts
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const notificationsFile = path.join(dataDir, 'notifications_store.json');

// Mẫu dữ liệu hạt giống phong phú chuẩn giáo dục đại học (TT 08/2021/TT-BGDĐT & Khảo thí)
const DEFAULT_NOTIFICATIONS = [
  // --- SINH VIÊN ---
  {
    id: 'notif_std_001',
    title: 'Cảnh báo học vụ: Nguy cơ cấm thi do vắng quá 20% số tiết',
    content: 'Theo Điều 11 - Thông tư 08/2021/TT-BGDĐT của Bộ GD&ĐT, học phần "Lập trình Web nâng cao (IT302)" bạn đã vắng 7/30 tiết (đạt 23.3%). Bạn có nguy cơ bị cấm thi kết thúc học phần nếu tiếp tục vắng. Đề nghị liên hệ Giảng viên bộ môn hoặc Cố vấn học tập để giải trình lý do chính đáng.',
    category: 'ACADEMIC_ALERT',
    priority: 'CRITICAL',
    target_role: 'student',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Phòng Quản Lý Đào Tạo & Khảo Thí',
    sender_role: 'admin',
    action_menu_key: 'lms_workspace',
    action_label: 'Kiểm tra điểm danh lớp học',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString() // 25 phút trước
  },
  {
    id: 'notif_std_002',
    title: 'Nhắc nhở hạn nộp bài tập lớn Tuần 5 (Còn 18 giờ)',
    content: 'Bài tập lớn "Xây dựng RESTful API với Express.js và MySQL" thuộc học phần Công nghệ Phần mềm sẽ khóa cổng nộp vào lúc 23h59 hôm nay. Vui lòng nộp tệp mã nguồn (.zip) hoặc đường dẫn GitHub repository đúng thời hạn.',
    category: 'EXAM_DEADLINE',
    priority: 'WARNING',
    target_role: 'student',
    target_faculty: 'CNTT',
    target_class: 'ALL',
    sender_name: 'TS. Hoàng Minh Trí (Bộ môn CNPM)',
    sender_role: 'teacher',
    action_menu_key: 'lesson_qa_assignments',
    action_label: 'Đến trang nộp bài tập',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 giờ trước
  },
  {
    id: 'notif_std_003',
    title: 'Công bố điểm đánh giá quá trình & Quiz tuần 4',
    content: 'Điểm bài trắc nghiệm trực tuyến (Quiz 4: Chuẩn hóa CSDL quan hệ) đã được hệ thống tự động ghi nhận và đồng bộ vào Sổ điểm cá nhân. Vui lòng kiểm tra và gửi phản hồi trong vòng 48 giờ nếu có sai sót.',
    category: 'ACADEMIC_ALERT',
    priority: 'SUCCESS',
    target_role: 'student',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Hệ thống Khảo Thí Trực Tuyến LMS',
    sender_role: 'system',
    action_menu_key: 'moet_gradebook',
    action_label: 'Xem bảng điểm cá nhân',
    read_by: ['sv_cntt'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString() // 14 giờ trước
  },
  {
    id: 'notif_std_004',
    title: 'Đã có lịch thi kết thúc học phần Học kỳ 1 (2026-2027)',
    content: 'Phòng Khảo thí đã sắp xếp lịch thi chính thức các môn học đại cương và chuyên ngành. Sinh viên vào phân hệ Phòng Thi Trực Tuyến để kiểm tra ca thi, phòng máy và quy chế thi có giám thị AI.',
    category: 'EXAM_DEADLINE',
    priority: 'INFO',
    target_role: 'student',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Hội đồng Thi & Đảm bảo chất lượng',
    sender_role: 'admin',
    action_menu_key: 'exam_room',
    action_label: 'Xem phòng thi & ca thi',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString() // hôm qua
  },

  // --- GIẢNG VIÊN ---
  {
    id: 'notif_tch_001',
    title: 'Nhắc nhở: Hạn chót nộp bảng điểm bộ phận học kỳ 1',
    content: 'Kính gửi Quý Thầy/Cô, theo kế hoạch đào tạo của Nhà trường, hạn cuối nộp bảng điểm chuyên cần và bài tập quá trình cho các lớp học phần đợt 1 là 17h00 ngày 30/09. Đề nghị Thầy/Cô hoàn tất khóa sổ điểm trên hệ thống.',
    category: 'TEACHING',
    priority: 'CRITICAL',
    target_role: 'teacher',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Phòng Quản Lý Đào Tạo',
    sender_role: 'admin',
    action_menu_key: 'moet_gradebook',
    action_label: 'Mở sổ điểm học phần',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'notif_tch_002',
    title: 'Có 14 sinh viên vừa nộp bài tập cần chấm điểm',
    content: 'Lớp 66.CNTT-1 vừa có 14 sinh viên hoàn thành bài tập thực hành "Lập trình mạng socket đa luồng". Thầy/Cô có thể sử dụng công cụ chấm điểm tự động và phản hồi trực tiếp cho sinh viên.',
    category: 'TEACHING',
    priority: 'WARNING',
    target_role: 'teacher',
    target_faculty: 'CNTT',
    target_class: 'ALL',
    sender_name: 'Hệ thống Quản lý Học tập LMS',
    sender_role: 'system',
    action_menu_key: 'lesson_qa_assignments',
    action_label: 'Xem và chấm bài tập',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'notif_tch_003',
    title: 'Thẩm định đề thi kết thúc học phần IT101 hoàn tất',
    content: 'Chủ tịch Hội đồng Thẩm định đề thi đã ký số phê duyệt đề thi môn "Nhập môn Lập trình C/C++". Đề thi đã được chuyển an toàn vào Ngân hàng đề thi chính thức phục vụ kỳ thi sắp tới.',
    category: 'EXAM_DEADLINE',
    priority: 'SUCCESS',
    target_role: 'teacher',
    target_faculty: 'CNTT',
    target_class: 'ALL',
    sender_name: 'Ban Thẩm Định Đề Thi Trường',
    sender_role: 'admin',
    action_menu_key: 'exam_appraisal',
    action_label: 'Xem biên bản thẩm định',
    read_by: ['gv_nam'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  },
  {
    id: 'notif_tch_004',
    title: 'Câu hỏi mới trên Diễn đàn trao đổi học thuật',
    content: 'Sinh viên Trần Văn Nam vừa đặt câu hỏi thảo luận về: "Cách khắc phục lỗi con trỏ null pointer khi phân trang bộ nhớ ảo". Thầy/Cô vui lòng phản hồi để khuyến khích sinh viên tương tác.',
    category: 'TEACHING',
    priority: 'INFO',
    target_role: 'teacher',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Diễn đàn Thảo luận Lớp học phần',
    sender_role: 'system',
    action_menu_key: 'lesson_qa_assignments',
    action_label: 'Phản hồi trên diễn đàn',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  },

  // --- QUẢN TRỊ VIÊN (ADMIN) ---
  {
    id: 'notif_adm_001',
    title: 'Báo cáo cảnh báo học vụ toàn trường (TT 08/2021)',
    content: 'Hệ thống tự động phát hiện 38 sinh viên có số tiết vắng vượt 20% và 12 sinh viên có nguy cơ nhận cảnh báo học lực mức 1 trong đợt rà soát giữa kỳ. Cần xuất danh sách gửi về các Khoa chuyên môn để phối hợp xử lý học vụ.',
    category: 'ACADEMIC_ALERT',
    priority: 'CRITICAL',
    target_role: 'admin',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Hệ thống Giám sát Học vụ AI',
    sender_role: 'system',
    action_menu_key: 'student_directory',
    action_label: 'Xem danh sách học viên cảnh báo',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'notif_adm_002',
    title: 'Đồng bộ dữ liệu CSDL Quốc gia HEMIS thành công',
    content: 'Tiến trình đồng bộ tự động 3,420 hồ sơ sinh viên, 142 chương trình đào tạo và dữ liệu điểm số lên Cổng HEMIS - Bộ GD&ĐT đã hoàn tất (Mã phiên: HEMIS-SYNC-2026-928). Không ghi nhận lỗi bản ghi.',
    category: 'SYSTEM',
    priority: 'SUCCESS',
    target_role: 'admin',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Cổng Liên Thông ERP & HEMIS',
    sender_role: 'system',
    action_menu_key: 'erp_sync',
    action_label: 'Xem chi tiết đồng bộ',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: 'notif_adm_003',
    title: 'Lịch bảo trì và tối ưu hóa hệ thống máy chủ LMS',
    content: 'Hạ tầng máy chủ sẽ tiến hành sao lưu định kỳ và nâng cấp vi dịch vụ Giám thị AI vào 02h00 sáng Chủ Nhật ngày 04/10 (Dự kiến gián đoạn dịch vụ khoảng 15 phút). Các phiên thi trực tuyến đã được xếp tránh khung giờ này.',
    category: 'SYSTEM',
    priority: 'WARNING',
    target_role: 'admin',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Trung Tâm Công Nghệ Thông Tin & Hạ Tầng',
    sender_role: 'admin',
    action_menu_key: 'system_monitor',
    action_label: 'Kiểm tra tài nguyên máy chủ',
    read_by: ['admin'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
  },

  // --- THÔNG BÁO TOÀN TRƯỜNG (BROADCAST ALL) ---
  {
    id: 'notif_all_001',
    title: 'Khai mạc Cuộc thi Sáng tạo Công nghệ & AI Hackathon 2026',
    content: 'Đoàn Thanh niên và Khoa CNTT phối hợp tổ chức Cuộc thi Sáng tạo Công nghệ số dành cho toàn thể sinh viên và giảng viên. Tổng giá trị giải thưởng lên đến 120.000.000 VNĐ cùng cơ hội thực tập tại các tập đoàn công nghệ hàng đầu.',
    category: 'SYSTEM',
    priority: 'INFO',
    target_role: 'ALL',
    target_faculty: 'ALL',
    target_class: 'ALL',
    sender_name: 'Ban Tổ Chức Hackathon 2026',
    sender_role: 'admin',
    action_menu_key: 'lms_workspace',
    action_label: 'Xem thể lệ cuộc thi',
    read_by: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

// Helper: Đọc dữ liệu bền vững
function readNotifications() {
  try {
    if (!fs.existsSync(notificationsFile)) {
      fs.writeFileSync(notificationsFile, JSON.stringify(DEFAULT_NOTIFICATIONS, null, 2), 'utf-8');
      return DEFAULT_NOTIFICATIONS;
    }
    const raw = fs.readFileSync(notificationsFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(notificationsFile, JSON.stringify(DEFAULT_NOTIFICATIONS, null, 2), 'utf-8');
      return DEFAULT_NOTIFICATIONS;
    }
    return parsed;
  } catch (err) {
    console.error('Lỗi khi đọc notifications_store.json:', err);
    return DEFAULT_NOTIFICATIONS;
  }
}

// Helper: Lưu dữ liệu bền vững
function writeNotifications(notifications) {
  try {
    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Lỗi khi ghi notifications_store.json:', err);
    return false;
  }
}

// 1. LẤY DANH SÁCH THÔNG BÁO THEO BỘ LỌC VAI TRÒ & NGƯỜI DÙNG
exports.getNotifications = async (req, res) => {
  try {
    const { role, user_id, username, faculty_id, category, unread_only, search } = req.query;
    const notifications = readNotifications();

    const userKey = username || user_id || (role ? `user_${role}` : 'anonymous');

    // Lọc theo đối tượng nhận
    let filtered = notifications.filter(item => {
      // Vai trò: 'ALL' hoặc khớp với vai trò người dùng (SuperAdmin xem được toàn bộ)
      if (role !== 'superadmin' && item.target_role && item.target_role !== 'ALL' && role && item.target_role !== role) {
        return false;
      }
      // Khoa: 'ALL' hoặc khớp với khoa của người dùng (trừ admin & superadmin xem được hết)
      if (role !== 'admin' && role !== 'superadmin' && item.target_faculty && item.target_faculty !== 'ALL' && faculty_id && item.target_faculty !== faculty_id) {
        return false;
      }
      // Danh mục
      if (category && category !== 'ALL' && item.category !== category) {
        return false;
      }
      // Lọc chưa đọc
      const isRead = Array.isArray(item.read_by) && (
        item.read_by.includes(userKey) ||
        (user_id && item.read_by.includes(String(user_id))) ||
        (username && item.read_by.includes(username)) ||
        (role && item.read_by.includes(`user_${role}`))
      );
      if (unread_only === 'true' && isRead) {
        return false;
      }
      // Tìm kiếm từ khóa
      if (search && search.trim()) {
        const q = search.toLowerCase();
        const inTitle = (item.title || '').toLowerCase().includes(q);
        const inContent = (item.content || '').toLowerCase().includes(q);
        const inSender = (item.sender_name || '').toLowerCase().includes(q);
        if (!inTitle && !inContent && !inSender) return false;
      }
      return true;
    });

    // Sắp xếp theo độ ưu tiên và thời gian mới nhất
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Thống kê số lượng
    const totalCount = filtered.length;
    const unreadList = filtered.filter(item => {
      const isRead = Array.isArray(item.read_by) && (
        item.read_by.includes(userKey) ||
        (user_id && item.read_by.includes(String(user_id))) ||
        (username && item.read_by.includes(username)) ||
        (role && item.read_by.includes(`user_${role}`))
      );
      return !isRead;
    });

    const stats = {
      total: totalCount,
      unread: unreadList.length,
      academic_alerts: filtered.filter(i => i.category === 'ACADEMIC_ALERT').length,
      critical_alerts: filtered.filter(i => i.priority === 'CRITICAL').length,
      teaching: filtered.filter(i => i.category === 'TEACHING').length,
      system: filtered.filter(i => i.category === 'SYSTEM').length,
      exam: filtered.filter(i => i.category === 'EXAM_DEADLINE').length
    };

    // Đánh dấu thuộc tính is_read cho từng item đối với người dùng hiện tại
    const itemsWithReadStatus = filtered.map(item => ({
      ...item,
      is_read: Array.isArray(item.read_by) && (
        item.read_by.includes(userKey) ||
        (user_id && item.read_by.includes(String(user_id))) ||
        (username && item.read_by.includes(username)) ||
        (role && item.read_by.includes(`user_${role}`))
      )
    }));

    return res.json({
      success: true,
      stats,
      data: itemsWithReadStatus
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách thông báo: ' + error.message });
  }
};

// 2. ĐÁNH DẤU MỘT THÔNG BÁO LÀ ĐÃ ĐỌC
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, username, role } = req.body;
    const userKey = username || (user_id ? String(user_id) : (role ? `user_${role}` : 'anonymous'));

    const notifications = readNotifications();
    const target = notifications.find(n => n.id === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
    }

    if (!Array.isArray(target.read_by)) {
      target.read_by = [];
    }

    const keysToAdd = [userKey];
    if (username) keysToAdd.push(username);
    if (user_id) keysToAdd.push(String(user_id));
    if (role) keysToAdd.push(`user_${role}`);

    let hasChange = false;
    keysToAdd.forEach(k => {
      if (k && !target.read_by.includes(k)) {
        target.read_by.push(k);
        hasChange = true;
      }
    });

    if (hasChange) {
      writeNotifications(notifications);
    }

    return res.json({
      success: true,
      message: 'Đã đánh dấu thông báo là đã đọc',
      data: target
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái: ' + error.message });
  }
};

// 3. ĐÁNH DẤU TẤT CẢ THÔNG BÁO LÀ ĐÃ ĐỌC
exports.markAllAsRead = async (req, res) => {
  try {
    const { user_id, username, role, faculty_id } = req.body;
    const userKey = username || (user_id ? String(user_id) : (role ? `user_${role}` : 'anonymous'));

    const notifications = readNotifications();
    let updatedCount = 0;

    const keysToAdd = [userKey];
    if (username) keysToAdd.push(username);
    if (user_id) keysToAdd.push(String(user_id));
    if (role) keysToAdd.push(`user_${role}`);

    const isSuper = role === 'superadmin' || username === 'superadmin' || username === 'boss.techcorp';

    notifications.forEach(item => {
      // SuperAdmin có quyền đánh dấu tất cả thông báo trong toàn hệ thống
      const matchesRole = isSuper || !item.target_role || item.target_role === 'ALL' || item.target_role === role;
      const matchesFaculty = isSuper || role === 'admin' || !item.target_faculty || item.target_faculty === 'ALL' || item.target_faculty === faculty_id;

      if (matchesRole && matchesFaculty) {
        if (!Array.isArray(item.read_by)) {
          item.read_by = [];
        }
        let added = false;
        keysToAdd.forEach(k => {
          if (k && !item.read_by.includes(k)) {
            item.read_by.push(k);
            added = true;
          }
        });
        if (added) updatedCount++;
      }
    });

    writeNotifications(notifications);

    return res.json({
      success: true,
      message: `Đã đánh dấu ${updatedCount} thông báo là đã đọc`,
      updated_count: updatedCount
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật tất cả đã đọc: ' + error.message });
  }
};

// 4. PHÁT THÔNG BÁO MỚI / TẠO CẢNH BÁO (Dành cho Admin & Giảng viên)
exports.createNotification = async (req, res) => {
  try {
    const {
      title,
      content,
      category = 'ACADEMIC_ALERT',
      priority = 'INFO',
      target_role = 'ALL',
      target_faculty = 'ALL',
      target_class = 'ALL',
      sender_name,
      sender_role = 'admin',
      action_menu_key,
      action_label
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung thông báo là bắt buộc' });
    }

    const notifications = readNotifications();

    const newNotification = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      content: content.trim(),
      category: ['ACADEMIC_ALERT', 'EXAM_DEADLINE', 'TEACHING', 'SYSTEM'].includes(category) ? category : 'ACADEMIC_ALERT',
      priority: ['CRITICAL', 'WARNING', 'INFO', 'SUCCESS'].includes(priority) ? priority : 'INFO',
      target_role: ['ALL', 'student', 'teacher', 'admin'].includes(target_role) ? target_role : 'ALL',
      target_faculty: target_faculty || 'ALL',
      target_class: target_class || 'ALL',
      sender_name: sender_name || 'Hệ thống Quản lý LMS',
      sender_role: sender_role || 'admin',
      action_menu_key: action_menu_key || null,
      action_label: action_label || null,
      read_by: [],
      created_at: new Date().toISOString()
    };

    notifications.unshift(newNotification);
    writeNotifications(notifications);

    // Gửi realtime qua Socket.io nếu khả dụng
    const io = req.app.get('io');
    if (io) {
      io.emit('notification_received', newNotification);
    }

    return res.status(201).json({
      success: true,
      message: 'Đã phát thông báo thành công đến toàn hệ thống',
      data: newNotification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tạo thông báo: ' + error.message });
  }
};

// 5. XÓA THÔNG BÁO
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    let notifications = readNotifications();
    const initialLen = notifications.length;

    notifications = notifications.filter(n => n.id !== id);

    if (notifications.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo để xóa' });
    }

    writeNotifications(notifications);

    return res.json({
      success: true,
      message: 'Đã xóa thông báo thành công'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xóa thông báo: ' + error.message });
  }
};
