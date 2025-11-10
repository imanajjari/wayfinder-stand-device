// src/storage/companyStorage.js
import { fetchImageAsBase64, getFileUrlWithoutCompanyId } from '../services/fileService';
import { saveToStorage, getFromStorage, removeFromStorage } from './storageService';


const COMPANY_KEY = 'companyData';

/**
 * save company data to localStorage
 * @param {Object} companyData - company data
 */
export const saveCompanyData = (companyData) => {
  saveToStorage(COMPANY_KEY, companyData);
};

/**
 * get company data from localStorage
 * @returns {Object|null} company data or null
 */
export const getCompanyData = () => {
  return getFromStorage(COMPANY_KEY);
};

/**
 * remove company data from localStorage
 */
export const clearCompanyData = () => {
  removeFromStorage(COMPANY_KEY);
};

/**
 * save company with logo converted to Base64
 * @param {Object} companyData - company data from API
 */
export const saveCompanyWithLogo  = async (companyData) => {
  try {
      if (companyData.icon) {
        const imageUrl = getFileUrlWithoutCompanyId(companyData.icon,companyData.id);
        try {
          const base64Logo = await fetchImageAsBase64(imageUrl);
          companyData.logoBase64 = base64Logo;
        } catch (err) {
          console.error('خطا در تبدیل آیکون به Base64:', err);
        }
      }
  
      saveToStorage(COMPANY_KEY, companyData);
    } catch (error) {
      console.error('خطا در ذخیره کمپانی همراه با لوگو:', error);
    }
};