import { apiClient } from './client';
import { VisitEventsResponse, VisitEventsParams, VisitEvent, UpdateVisitPayload } from '../types/visit';
import { normalizeVisitEventsResponse } from './normalizers/visitEvents';

/**
 * Builds query parameters for visit events API calls
 */
function buildVisitEventsQueryParams(params: VisitEventsParams, additionalParams: Record<string, string> = {}): URLSearchParams {
  const queryParams = new URLSearchParams({
    timeframe: params.timeframe,
    limit: params.limit.toString(),
    offset: params.offset.toString(),
    ...additionalParams
  });

  return queryParams;
}

export const getVisitByIdAPI = async (visitId: string): Promise<VisitEvent> => {
  const response = await apiClient.get<VisitEvent>(`/visit-events/${visitId}`);
  return response.data;
};

export const updateVisitByIdAPI = async (visitId: string, payload: UpdateVisitPayload): Promise<VisitEvent> => {
  const response = await apiClient.patch<VisitEvent>(`/visit-events/${visitId}`, payload);
  return response.data;
};

export const getSalesVisitEventsAPI = async (params: VisitEventsParams): Promise<VisitEventsResponse> => {
  const queryParams = buildVisitEventsQueryParams(params);
  const response = await apiClient.get<VisitEvent[]>(`/visit-events?${queryParams}`);

  return normalizeVisitEventsResponse(response, {
    limit: params.limit,
    offset: params.offset
  });
};

export const getManagerVisitEventsAPI = async (params: VisitEventsParams): Promise<VisitEventsResponse> => {
  const queryParams = buildVisitEventsQueryParams(params, { scope: 'all' });
  const response = await apiClient.get<VisitEvent[]>(`/visit-events?${queryParams}`);

  return normalizeVisitEventsResponse(response, {
    limit: params.limit,
    offset: params.offset
  });
};