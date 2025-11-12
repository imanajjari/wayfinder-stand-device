// src/services/settingService.js
import { apiPublic } from '../api/api';
import { tokenStorage } from '../api/tokenStorage.secure';

/**
 * save setting data to server and get apiKey
 * @param {{id:string, email:string, password:string}} data
 */
export const postSetting = async (data) => {
  try {
    const { data: res } = await apiPublic.post('/setting', data);
    // save access key in tokenStorage
    const apiKey = res?.data?.apiKey;
    console.log("apiKey received:", apiKey);
    
    if (apiKey) tokenStorage.setAccess(apiKey);
    return res;
  } catch (error) {
    console.error('❌ خطا در ارسال تنظیمات:', error);
    throw error;
  }
};
