// src/services/productService.js
import api from '../api/api';

export const getAllShop = () => {
  return api.get('/shops'); // فرض بر اینکه روت /Shop وجود داره
};
