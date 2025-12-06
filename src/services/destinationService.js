// src\services\destinationService.js
import api from '../api/api';

// search destinations by category name
export const searchDestinationsByCategory = async (categoryName) => {
  const response = await api.post('/search/category',{"data": categoryName });
  return response.data; 
};

// search destinations by name
export const searchDestinationsByName = async (destinationName) => {
  const response = await api.post(`/search`,{"data": destinationName });
  return response.data; 
};

// get all destinations data
export const getDestinationById = async (id) => {
  console.log('id:',id);
  
  const response = await api.get(`/destination/${id}`);
  return response.data; 
};

// get all destinations data
export const getAllDestinations = async () => {
  const response = await api.get(`/destination/all`);
  return response.data; 
};