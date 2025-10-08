// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://45.159.150.16:3000/', // آدرس بک‌اند محلی
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// اینترسپتور برای اضافه کردن توکن (در صورت نیاز)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // اگر توکن ذخیره شده داری
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// هندل خطاهای پاسخ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('توکن معتبر نیست یا منقضی شده!');
      // می‌تونی اینجا به صفحه لاگین منتقل بشی یا رفرش توکن بزنی
    }
    return Promise.reject(error);
  }
);

export default api;
