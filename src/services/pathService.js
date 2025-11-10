// src/services/pathService.js
import api from '../api/api';

// get paths between one start point and many end points
export const findManyPaths = async ({ start, ends, skipPoints = 0, mapId }) => {
  try {
    const response = await api.post('paths', {
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

// get path between one start point and one end point
export const findOnePath = async ({ start, end, skip = 0, floorId }) => {
  try {
    const response = await api.post('path', {
      start,
      end,
      skip,
      floorId
    });
    console.error('چیزی که دریافت کرده :', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching single path:', error);
    throw error;
  }
};

// get path between one start point and one end point for multi-floor maps (version 2)
export const findOnePathMulityfloorV2 = async ({ start, end, userId, skip = 100 }) => {
  console.log('در سرویس مسیر چند طبقه با پارامترها:', { start, end, userId, skip });
  
  try {
    const response = await api.post('path/v2', {
      start,
      end,
      userId,
      skip
    });
    console.error('چیزی که دریافت کرده :', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching single path:', error);
    throw error;
  }
};