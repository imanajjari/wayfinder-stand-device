import api from '../api/api';

/**
 * دریافت لیست تبلیغات
 * @returns {Promise<Object>} داده تبلیغات یا خطا
 */
export const fetchAds = async () => {
  try {
    const response = await api.get('api/ads');
    return response.data;  // شامل message و data
  } catch (error) {
    console.error('❌ خطا در دریافت تبلیغات:', error);
    throw error;
  }
};
