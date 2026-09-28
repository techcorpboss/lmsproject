// frontend/src/services/notificationApi.js
// Client API for LMS Notifications & Academic Alerts
import apiClient from './apiClient';

export const notificationApi = {
  // Lấy danh sách thông báo và số liệu thống kê
  getNotifications: async (params = {}) => {
    return await apiClient.get('/notifications', { params });
  },

  // Đánh dấu 1 thông báo đã đọc
  markAsRead: async (id, userInfo = {}) => {
    return await apiClient.put(`/notifications/${id}/read`, userInfo);
  },

  // Đánh dấu tất cả thông báo là đã đọc
  markAllAsRead: async (userInfo = {}) => {
    return await apiClient.put('/notifications/read-all', userInfo);
  },

  // Phát thông báo mới (Admin & Giảng viên)
  createNotification: async (payload) => {
    return await apiClient.post('/notifications', payload);
  },

  // Xóa thông báo
  deleteNotification: async (id) => {
    return await apiClient.delete(`/notifications/${id}`);
  }
};

export default notificationApi;
