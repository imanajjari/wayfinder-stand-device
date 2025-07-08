import api from '../api/api';

// 📌 افزودن دسته‌بندی جدید
export const addCategory = async (data) => {
  return api.post('/api/category', data);
};

// 📌 ویرایش دسته‌بندی
export const editCategory = async (id, data) => {
  return api.put(`/api/category/${id}`, data);
};

// ✅ گرفتن همه دسته‌بندی‌ها
export const getAllCategories = async () => {
  return api.get('/api/category');
};

// ✅ گرفتن همه  امکانات 
export const getAllAmenities = async () => {
  return api.get('/api/amenity');
};
