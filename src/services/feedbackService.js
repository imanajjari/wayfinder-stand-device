// src/services/feedbackService.js
import api from '../api/api';

/**
 * ارسال انتقاد یا پیشنهاد
 * @param {string} title - عنوان موضوع
 * @param {string} content - متن اصلی
 * @param {number} kind - ۱ = پیشنهاد، ۲ = انتقاد
 * @returns {Promise} پاسخ axios شامل { message, data: true }
 */
export const submitFeedback = async (title, content, kind) => {
  return api.post('/feedback', { title, content, kind });
};