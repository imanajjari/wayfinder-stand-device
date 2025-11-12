// src\services\fileService.js
import api, { apiPublic } from '../api/api';
import { getCompanyData } from '../storage';

// upload QR code image
export const uploadQrCodeImage = async (formData) => {
  return api.post(`/file/map/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ipload any file
export const uploadFile = async (formData) => {
  return api.post('/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// get file URL
// example: <img src={getFileUrl(fileName)} />
export const getFileUrl = (fileName) => {
  const company = getCompanyData();
  return `http://45.159.150.16:3000/api/v1/file/${company.id}/${fileName}`;
};

// get file URL without company ID
// example: <img src={getFileUrlWithoutCompanyId(fileName, id)} />
export const getFileUrlWithoutCompanyId = (fileName,id) => {
  return `http://45.159.150.16:3000/api/v1/file/${id}/${fileName}`;
};

export const fetchImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

