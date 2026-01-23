import { apiClient } from './client';
import { VisitEventsResponse, VisitEventsParams } from '../types/visit';

export const getSalesVisitEventsAPI = async (params: VisitEventsParams): Promise<VisitEventsResponse> => {
  const queryParams = new URLSearchParams({
    timeframe: params.timeframe,
    limit: params.limit.toString(),
    offset: params.offset.toString(),
  });

  const response = await apiClient.get<VisitEventsResponse>(`/visit-events?${queryParams}`);

  // The apiClient returns ApiResponse<T> where T is VisitEventsResponse
  // But the backend might return VisitEventsResponse directly
  if (response?.data && response?.meta) {
    return response as unknown as VisitEventsResponse;
  }
  if (response?.data && Array.isArray(response.data)) {
    // If backend returns ApiResponse format, convert to expected format
    return {
      data: response.data,
      meta: response.meta || { limit: params.limit, offset: params.offset, total: response.data.length, has_more: false }
    };
  }

  throw new Error('Unexpected API response structure');
};

export const getManagerVisitEventsAPI = async (params: VisitEventsParams): Promise<VisitEventsResponse> => {
  const queryParams = new URLSearchParams({
    timeframe: params.timeframe,
    limit: params.limit.toString(),
    offset: params.offset.toString(),
    scope: 'all',
  });

  const response = await apiClient.get<VisitEventsResponse>(`/visit-events?${queryParams}`);

  // The apiClient returns ApiResponse<T> where T is VisitEventsResponse
  // But the backend might return VisitEventsResponse directly
  if (response?.data && response?.meta) {
    return response as unknown as VisitEventsResponse;
  }
  if (response?.data && Array.isArray(response.data)) {
    // If backend returns ApiResponse format, convert to expected format
    return {
      data: response.data,
      meta: response.meta || { limit: params.limit, offset: params.offset, total: response.data.length, has_more: false }
    };
  }

  throw new Error('Unexpected API response structure');
};