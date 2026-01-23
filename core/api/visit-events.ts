import { apiClient } from './client';

export const getSalesVisitEventsAPI = async () => {
  return apiClient.get('/visit-events');
};

export const getManagerVisitEventsAPI = async () => {
  return apiClient.get('/visit-events?scope=all');
};