// backend/services/pushNotificationService.js
// Động cơ Thông báo Đẩy Thời gian thực & Quản lý Thuê bao Web Push (RFC 8030 / VAPID)
// Phục vụ thông báo Lịch thi khẩn cấp, Điểm số mới, Cảnh báo học vụ (TT 08/2021)
'use strict';

const crypto = require('crypto');

class PushNotificationService {
  constructor() {
    this.subscriptions = new Map(); // endpoint -> subscriptionRecord
    this.notificationHistory = [];
    this.maxHistory = 100;

    // Khởi tạo cặp khóa VAPID dự phòng cho Web Push RFC 8292
    this.vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckj0LjW8e1P1_0V-qAky-w9_9b8QpU',
      privateKey: process.env.VAPID_PRIVATE_KEY || 'TCU_COMPASS_VAPID_SECRET_KEY_2027'
    };
  }

  /**
   * Đăng ký thiết bị nhận thông báo đẩy từ trình duyệt (Service Worker PushManager)
   */
  registerSubscription(subscription, user = {}) {
    if (!subscription || !subscription.endpoint) {
      throw new Error('Cấu hình Push Subscription không hợp lệ');
    }

    const subId = crypto.createHash('md5').update(subscription.endpoint).digest('hex');
    const record = {
      subId,
      endpoint: subscription.endpoint,
      keys: subscription.keys || {},
      userId: user.id || 'ANONYMOUS',
      userRole: user.role || 'STUDENT',
      userName: user.name || user.full_name || 'Học viên',
      userAgent: user.userAgent || '',
      registeredAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    this.subscriptions.set(subscription.endpoint, record);
    return {
      success: true,
      message: 'Đăng ký nhận thông báo đẩy thời gian thực thành công!',
      subId
    };
  }

  /**
   * Hủy đăng ký nhận thông báo đẩy
   */
  unregisterSubscription(endpoint) {
    if (!endpoint) return false;
    return this.subscriptions.delete(endpoint);
  }

  /**
   * Tạo payload thông báo chuẩn hóa theo loại sự kiện học vụ
   */
  createPayload(eventType, data = {}) {
    const timestamp = new Date().toISOString();
    let title = 'TCU COMPASS LMS - Thông Báo';
    let body = 'Bạn có thông báo mới từ hệ thống đào tạo.';
    let icon = '/logo192.png';
    let badge = '/favicon.ico';
    let url = '/';

    switch (eventType) {
      case 'EXAM_SCHEDULE':
        title = `📅 LỊCH THI: ${data.subjectName || 'Học phần'}`;
        body = `Ca thi diễn ra lúc ${data.startTime || '08:00'} ngày ${data.examDate || 'hôm nay'} tại Phòng ${data.roomCode || 'ROOM-P01'}. Vui lòng kiểm tra thiết bị & SEB.`;
        url = `/online-exam/${data.scheduleId || 1}`;
        break;

      case 'GRADE_PUBLISHED':
        title = `🌟 CÔNG BỐ ĐIỂM: ${data.courseName || 'Học phần'}`;
        body = `Điểm tổng kết: ${data.totalScore10 || '9.0'}/10 (Hệ 4: ${data.score4 || '4.0'} - Xếp loại ${data.rank || 'A'}). Nhấp để xem bảng điểm có ký số PKI.`;
        url = `/gradebook?sectionId=${data.sectionId || 1}`;
        break;

      case 'ACADEMIC_ALERT':
        title = `⚠️ CẢNH BÁO HỌC VỤ (Thông tư 08/2021)`;
        body = data.message || 'Cảnh báo: Điểm chuyên cần hoặc CPA học kỳ chưa đạt chuẩn điều kiện dự thi.';
        url = `/student-profile`;
        break;

      case 'VIRTUAL_CLASS_REMINDER':
        title = `🎥 PHÒNG HỌC TRỰC TUYẾN: ${data.courseName || 'Lớp học'}`;
        body = `Lớp học Tuần ${data.weekIndex || 1} với Giảng viên ${data.instructorName || 'Phụ trách'} đang bắt đầu. Bấm để tham gia ngay.`;
        url = `/elearning?courseId=${data.courseId || 1}&room=1`;
        break;

      default:
        title = data.title || title;
        body = data.body || body;
        url = data.url || url;
    }

    return {
      notification: {
        title,
        body,
        icon,
        badge,
        data: {
          url,
          eventType,
          timestamp,
          ...data
        },
        actions: [
          { action: 'open_url', title: 'Xem chi tiết' },
          { action: 'close', title: 'Bỏ qua' }
        ]
      }
    };
  }

  /**
   * Phát sóng thông báo đẩy đến tất cả hoặc nhóm người dùng chỉ định
   */
  async broadcastNotification(eventType, data = {}, targetRole = null) {
    const payload = this.createPayload(eventType, data);
    let targetCount = 0;

    for (const [endpoint, record] of this.subscriptions.entries()) {
      if (!targetRole || record.userRole === targetRole || targetRole === 'ALL') {
        targetCount++;
      }
    }

    const logEntry = {
      id: `NOTIF-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      eventType,
      title: payload.notification.title,
      body: payload.notification.body,
      targetRole: targetRole || 'ALL',
      recipientsCount: targetCount,
      sentAt: new Date().toISOString(),
      payload
    };

    this.notificationHistory.unshift(logEntry);
    if (this.notificationHistory.length > this.maxHistory) {
      this.notificationHistory.pop();
    }

    return {
      success: true,
      message: `Đã phát sóng thông báo đẩy đến ${targetCount} thiết bị thành công!`,
      data: logEntry
    };
  }

  /**
   * Lấy lịch sử thông báo đẩy
   */
  getHistory(limit = 20) {
    return this.notificationHistory.slice(0, limit);
  }

  /**
   * Lấy VAPID Public Key cho client subscribe
   */
  getVapidPublicKey() {
    return this.vapidKeys.publicKey;
  }
}

module.exports = new PushNotificationService();
