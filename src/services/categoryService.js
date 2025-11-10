import api from '../api/api';

// get all categories
export const getAllCategories = async () => {
  return api.get('/category');
};

// get all amenities
export const getAllAmenities = async () => {
  return api.get('/amenity');
};
