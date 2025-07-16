import api from '../api/api';

/**
 * ارسال تنظیمات به سرور
 * @param {Object} data - شامل id و password
 * @returns {Promise<Object>} پاسخ سرور
 */
export const postSetting = async (data) => {
  try {
    const response = await api.post('/api/setting', data);
    return response.data;
  } catch (error) {
    console.error('❌ خطا در ارسال تنظیمات:', error);
    throw error;
  }
};
