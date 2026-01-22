import { apiClient } from './client';

export const createVendorAPI = async (vendor: any) => {
  // return apiClient.post('/vendors', vendor);
  // Mock
  return {
    data: {
      id: 'v-' + Math.random().toString(36).substr(2, 9),
      name: vendor.name,
      created: true,
      warning: null
    },
    meta: {}
  };
};

export const getVendorsAPI = async () => {
  // return apiClient.get('/vendors');
  // Mock
  return {
    data: [
      { id: 'v-001', name: 'Sharma General Store', area: 'Andheri East' },
      { id: 'v-002', name: 'Patel Shop', area: 'Bandra' }
    ],
    meta: {}
  };
};