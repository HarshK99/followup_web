import { apiClient } from './client';
import { VisitEvent } from '../types/visit';

export const getSalesVisitEventsAPI = async (): Promise<VisitEvent[]> => {
  const response = await apiClient.get<VisitEvent[]>('/visit-events');
  // Handle different response structures
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  console.warn('Unexpected visit events API response structure:', response);
  return [];
};

export const getManagerVisitEventsAPI = async (): Promise<VisitEvent[]> => {
  const response = await apiClient.get<VisitEvent[]>('/visit-events?scope=all');
  // Handle different response structures
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  console.warn('Unexpected visit events API response structure:', response);
  return [];
};