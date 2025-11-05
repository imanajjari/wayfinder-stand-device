// src/api/api.js
import axios from 'axios';
import { tokenStorage } from './tokenStorage';

const BASE = 'http://45.159.150.16:3000';

export const apiPublic = axios.create({
  baseURL: `${BASE}/api/v1`,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

export const apiPrivate = axios.create({
  baseURL: `${BASE}/api/v2`,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

// فقط هدر سفارشی را ست کن
const attachMainApiKey = (config) => {
  const key = tokenStorage.getAccess();
  if (key) {
    // نام دقیق هدر شما
    config.headers['X-Main-Api-key'] = key;
  }
  return config;
};

apiPublic.interceptors.request.use(attachMainApiKey);
apiPrivate.interceptors.request.use(attachMainApiKey);

// برای سازگاری با import قدیمی
const api = apiPrivate;
export default api;
