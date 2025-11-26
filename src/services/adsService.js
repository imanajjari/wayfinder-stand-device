// src\services\adsService.js
import api from '../api/api';
/**
 * get list of ads from server
 * @returns {Promise<Object>} 
 */
export const fetchAds = async (key) => {
  try {
    const response = await api.get(`ads?k=${key}`);
    return response.data;  // شامل message و data
  } catch (error) {
    console.error('❌ خطا در دریافت تبلیغات:', error);
    throw error;
  }
};
