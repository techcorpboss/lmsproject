// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', // URL gốc của backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm một interceptor để đính kèm token vào mỗi request
axiosClient.interceptors.request.use(async (config) => {
  // Lấy thông tin user từ localStorage
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

export default axiosClient;