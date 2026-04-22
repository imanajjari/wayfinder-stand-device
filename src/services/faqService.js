// src/services/faqService.js
import api from '../api/api';

/**
 * دریافت لیست تیتر سوالات متداول (با صفحه‌بندی)
 * @param {number} page - شماره صفحه
 * @param {number} perpage - تعداد آیتم در هر صفحه
 * @returns {Promise} پاسخ axios شامل { message, data: { faqs, total, pages } }
 */
export const getFaqs = async (page, perpage) => {
  return api.get('/faq', {
    params: { page, perpage }
  });
};

/**
 * دریافت جزئیات یک سوال با شناسه
 * @param {number|string} id - شناسه سوال
 * @returns {Promise} پاسخ axios شامل { message, data: { question, answer, file } }
 */
export const getFaqById = async (id) => {
  return api.get(`/faq/${id}`);
};