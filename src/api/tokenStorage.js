// src/api/tokenStorage.js
const ACCESS_KEY = 'access_token'; // == apiKey

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  setAccess: (t) => localStorage.setItem(ACCESS_KEY, t),
  clear: () => localStorage.removeItem(ACCESS_KEY),
};
