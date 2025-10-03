// src/hooks/QrCode/useQrCodeUpload.js
import { useState } from 'react';
import { uploadQrCodeImage } from '../../services/fileService';


export const useQrCodeUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUploadQr = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      const res = await uploadQrCodeImage(formData);
      setUploadedFile(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUploadQr, loading, error, uploadedFile };
};
