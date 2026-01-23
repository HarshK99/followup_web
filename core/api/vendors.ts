import { apiClient } from './client';

export const createVendorAPI = async (vendor: any) => {
  return apiClient.post('/vendors', vendor);
};

export const getVendorsAPI = async () => {
  return apiClient.get('/vendors');
};