// src/api/api.js
import axios from "axios";
import { tokenStorage } from "./tokenStorage.secure";

const BASE = import.meta.env.VITE_API_BASE;
if (!BASE) {
  throw new Error("VITE_API_BASE is missing (check your .env)");
}

// singleton pattern (جلوگیری از اینترسپتورهای تکراری تو HMR)
let _apiPublic, _apiPrivate;

_apiPublic = axios.create({
  baseURL: `${BASE}/api/v1`,
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

_apiPrivate = axios.create({
  baseURL: `${BASE}/api/v2`,
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

const attachMainApiKey = (config) => {
  // برای endpoint لاگین/ستاپ هدر نزن
  const url = (config.url || "").toLowerCase();
  if (url.startsWith("/setting")) return config;

  const key = tokenStorage.getAccess();
  if (key) config.headers["X-Main-Api-Key"] = key;
  return config;
};

_apiPublic.interceptors.request.use(attachMainApiKey);
_apiPrivate.interceptors.request.use(attachMainApiKey);

// 401 → پاک‌سازی و هدایت
const onRespError = (error) => {
  const status = error?.response?.status;
  if (status === 401) {
    tokenStorage.clear();
    // مثال: ریدایرکت
    // if (window.location.pathname !== "/login") window.location.assign("/login");
  }
  return Promise.reject(error);
};

_apiPublic.interceptors.response.use((r) => r, onRespError);
_apiPrivate.interceptors.response.use((r) => r, onRespError);

export const apiPublic = _apiPublic;
export const apiPrivate = _apiPrivate;

// سازگاری با import قدیمی
const api = apiPrivate;
export default api;
