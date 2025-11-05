// src/services/settingService.js
import { apiPublic } from '../api/api';
import { tokenStorage } from '../api/tokenStorage';

/**
 * ارسال تنظیمات به سرور (v1) و ذخیره ACCESS_KEY
 * @param {{id:string, email:string, password:string}} data
 */
export const postSetting = async (data) => {
  try {
    const { data: res } = await apiPublic.post('/setting', data);

    // طبق پاسخ نمونه شما:
    // res.data.apiKey را به‌عنوان ACCESS_KEY ذخیره می‌کنیم
    const apiKey = res?.data?.apiKey;
    if (apiKey) tokenStorage.setAccess(apiKey);
    console.log('apiKey :', apiKey);
    console.log('res :', res.data);

    return res; // شامل message, data, ...
  } catch (error) {
    console.error('❌ خطا در ارسال تنظیمات:', error);
    throw error;
  }
};
