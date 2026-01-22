import { apiClient } from './client';

export const loginAPI = async (phone_number: string, password: string) => {
  return apiClient.publicPost('/auth/login', { phone_number, password });
};