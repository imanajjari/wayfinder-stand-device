import api from '../api/api';

// 📌 آپلود فایل (عکس دسته‌بندی مثلاً)
export const uploadFile = async (formData) => {
  return api.post('/api/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 📌 گرفتن URL مستقیم عکس برای <img src=...>
export const getFileUrl = (fileName) => {
  return `http://45.159.150.16:3000/api/file/${fileName}`;
};



export const fetchImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};