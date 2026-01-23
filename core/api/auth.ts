import { authApiClient } from './client';

export const loginAPI = async (phone_number: string, password: string) => {
  return authApiClient.publicPost('/auth/login', { phone_number, password });
};