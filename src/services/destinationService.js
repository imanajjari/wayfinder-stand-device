import api from '../api/api';
import { getCompanyData } from './companyService';
import { appendCompanyIdToUrl } from './urlBuilder';

export const addDestination = async (data) => {
  const url = await appendCompanyIdToUrl('/api/destination');
  return api.post(url, data);
};

export const editDestination = async (id, data) => {
  const url = await appendCompanyIdToUrl(`/api/destination/${id}`);
  return api.put(url, data);
};

// جستجوی فروشگاه‌ها بر اساس نام دسته‌بندی
// export const searchDestinationsByCategoryOld = async (categoryName) => {
//   const url = await appendCompanyIdToUrl(`/api/search?category=${categoryName}`);
//   const response = await api.get(url);
//   return response.data; // چون بک‌اند مستقیم array برمی‌گردونه
// };


// جستجوی فروشگاه‌ها بر اساس نام دسته‌بندی
export const searchDestinationsByCategory = async (categoryName) => {
  const company = getCompanyData();
  const response = await api.post('/api/search/category',{"id": company.id,"data": categoryName });
  return response.data; // چون بک‌اند مستقیم array برمی‌گردونه
};


// جستجوی فروشگاه‌ها بر اساس نام دسته‌بندی 
//قدیمی
// export const searchDestinationsByNameOld = async (destinationName) => {
//   const url = await appendCompanyIdToUrl(`/api/search?query=${destinationName}`);
//   const response = await api.get(url);
//   return response.data; // چون بک‌اند مستقیم array برمی‌گردونه
// };

export const searchDestinationsByName = async (destinationName) => {
  const company = getCompanyData();
  const response = await api.post(`/api/search`,{"userId": company.id,"data": destinationName });
  return response.data; 
};

// جستجوی فروشگاه‌ها بر اساس نام دسته‌بندی
export const getAllDestinations = async () => {
  const url = await appendCompanyIdToUrl(`/api/destination/all`);
  const response = await api.get(url);
  return response.data; // چون بک‌اند مستقیم array برمی‌گردونه
};