import { fetchImageAsBase64, getFileUrl, getFileUrlWithoutCompanyId  } from './fileService';

/**
 * ذخیره اطلاعات کمپانی در localStorage
 * @param {Object} companyData - اطلاعات کمپانی
 */
export const saveCompanyData = (companyData) => {
    try {
      localStorage.setItem('companyData', JSON.stringify(companyData));
    } catch (error) {
      console.error('خطا در ذخیره companyData در localStorage:', error);
    }
  };
  


  /**
 * دریافت اطلاعات کمپانی از localStorage
 * @returns {Object|null} اطلاعات کمپانی یا null
 */
export const getCompanyData = () => {
    try {
      const data = localStorage.getItem('companyData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('خطا در دریافت companyData از localStorage:', error);
      return null;
    }
  };
  

  /**
 * پاک کردن اطلاعات کمپانی از localStorage
 */
export const clearCompanyData = () => {
    try {
      localStorage.removeItem('companyData');
    } catch (error) {
      console.error('خطا در پاک کردن companyData از localStorage:', error);
    }
  };



  /**
 * ذخیره کمپانی همراه با تبدیل آیکون به Base64
 * @param {Object} companyData - اطلاعات کمپانی از API
 */
export const saveCompanyWithLogo = async (companyData) => {
  console.log('companyData :', companyData);
  
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

    saveCompanyData(companyData);
    // console.log('✅ اطلاعات کمپانی همراه با لوگو ذخیره شد.');
  } catch (error) {
    console.error('خطا در ذخیره کمپانی همراه با لوگو:', error);
  }
};