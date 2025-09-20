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
export const findOnePath = async ({ start, end, skip = 0, mapId, floorId }) => {
  try {
    const response = await api.post('api/path', {
      start,
      end,
      skip,
      mapId,
      floorId
    });
    // console.error('چیزی که دریافت کرده :', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching single path:', error);
    throw error;
  }
};
