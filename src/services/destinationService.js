import api from '../api/api';

export const addDestination = async (data) => {
  return api.post('/api/destination', data);
};

export const editDestination = async (id, data) => {
  return api.put(`/api/destination/${id}`, data);
};

// جستجوی فروشگاه‌ها بر اساس نام دسته‌بندی
export const searchDestinationsByCategory = async (categoryName) => {
  const response = await api.get(`/api/search?category=${categoryName}`);
  return response.data; // چون بک‌اند مستقیم array برمی‌گردونه
};

// جستجوی فروشگاه‌ها بر اساس نام دسته‌بندی
export const searchDestinationsByName = async (destinationName) => {
  const response = await api.get(`/api/search?query=${destinationName}`);
  return response.data; // چون بک‌اند مستقیم array برمی‌گردونه
};

// جستجوی فروشگاه‌ها بر اساس نام دسته‌بندی
export const getAllDestinations = async () => {
  const response = await api.get(`/api/search?query=l`);
  return response.data; // چون بک‌اند مستقیم array برمی‌گردونه
};