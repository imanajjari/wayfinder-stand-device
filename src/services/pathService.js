// src/services/pathService.js
import api from '../api/api';

export const findManyPaths = async ({ start, ends, skipPoints = 0, mapId }) => {
  try {
    const response = await api.post('api/paths', {
      start,
      ends,
      skipPoints,
      mapId,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple paths:', error);
    throw error;
  }
};

// 📍 مسیر بین یک مبدا و یک مقصد
export const findOnePath = async ({ start, end, skipPoints = 0, mapId }) => {
  try {
    console.log('====================================');
    console.log("omad");
    console.log('====================================');
    const response = await api.post('api/path', {
      start,
      end,
      skipPoints,
      mapId,
    });
    console.log('====================================');
    console.log("response",response);
    console.log('====================================');
    console.error('چیزی که دریافت کرده :', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching single path:', error);
    throw error;
  }
};
