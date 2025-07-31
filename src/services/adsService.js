import api from '../api/api';
import { appendCompanyIdToUrl } from './urlBuilder';
/**
 * دریافت لیست تبلیغات
 * @returns {Promise<Object>} داده تبلیغات یا خطا
 */
export const fetchAds = async (key) => {
  const url = await appendCompanyIdToUrl('api/ads');
  try {
    const response = await api.get(`${url}?k=${key}`);
    return response.data;  // شامل message و data
  } catch (error) {
    console.error('❌ خطا در دریافت تبلیغات:', error);
    throw error;
  }
};
