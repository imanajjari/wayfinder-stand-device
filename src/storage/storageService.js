// src\storage\storageService.js
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`خطا در ذخیره ${key} در localStorage:`, error);
  }
};

export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`خطا در دریافت ${key} از localStorage:`, error);
    return null;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`خطا در پاک کردن ${key} از localStorage:`, error);
  }
};