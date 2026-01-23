import { apiClient } from './client';

export const createVisitAPI = async (visit: any) => {
  return apiClient.post('/visits', visit);
};

export const createFollowupAPI = async (followup: any) => {
  return apiClient.post('/follow-ups', followup);
};

export const getSalesFollowupsAPI = async () => {
  return apiClient.get('/follow-ups?scope=mine');
};

export const getManagerFollowupsAPI = async (filter: string) => {
  return apiClient.get(`/follow-ups?scope=all&filter=${filter}`);
};

export const markOutcomeAPI = async (id: string, outcome: any) => {
  return apiClient.post(`/follow-ups/${id}/outcome`, outcome);
};

export const cancelFollowupAPI = async (id: string) => {
  return apiClient.post(`/follow-ups/${id}/cancel`);
};