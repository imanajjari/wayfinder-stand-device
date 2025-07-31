import api from '../api/api';
import {getCompanyData} from './companyService'
import { appendCompanyIdToUrl } from './urlBuilder';


// 📌 افزودن دسته‌بندی جدید
export const addCategory = async (data) => {
  const url = await appendCompanyIdToUrl(`/api/category/`);
  return api.post(url, data);
};

// 📌 ویرایش دسته‌بندی
export const editCategory = async (id, data) => {
  const url = await appendCompanyIdToUrl(`/api/category/${id}`);
  return api.put(url, data);
};

// ✅ گرفتن همه دسته‌بندی‌ها
export const getAllCategories = async () => {
  const url = await appendCompanyIdToUrl('/api/category');
  return api.get(url);
};

// ✅ گرفتن همه  امکانات 
export const getAllAmenities = async () => {
  const url = await appendCompanyIdToUrl('/api/amenity');
  return api.get(url);
};
