import api from '../api/api';

export const getServerStatus = async () => {
  return api.get('/api/test');
};
