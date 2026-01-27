import { apiClient } from './client';
import { VisitEventsResponse, VisitEventsParams, VisitEvent, UpdateVisitPayload } from '../types/visit';
import { normalizeVisitEventsResponse } from './normalizers/visitEvents';

/**
 * API Layer Rules:
 * • List endpoints → may be normalized (handle pagination, response shape variations)
 * • Single-resource endpoints → never normalized (return backend response directly)
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
  // Detail endpoints return the raw domain object per backend contract
  const response = await apiClient.get<VisitEvent>(`/visit-events/${visitId}`);
  return response;
};

export const updateVisitByIdAPI = async (visitId: string, payload: UpdateVisitPayload): Promise<VisitEvent> => {
  // PATCH returns the updated domain object directly
  const response = await apiClient.patch<VisitEvent>(`/visit-events/${visitId}`, payload);
  return response;
};

export const getSalesVisitEventsAPI = async (params: VisitEventsParams): Promise<VisitEventsResponse> => {
  const queryParams = buildVisitEventsQueryParams(params);
  // List endpoints return the wrapped { data, meta } response
  const response = await apiClient.get<VisitEventsResponse>(`/visit-events?${queryParams}`);

  return normalizeVisitEventsResponse(response);
};

export const getManagerVisitEventsAPI = async (params: VisitEventsParams): Promise<VisitEventsResponse> => {
  const queryParams = buildVisitEventsQueryParams(params, { scope: 'all' });
  // List endpoints return the wrapped { data, meta } response
  const response = await apiClient.get<VisitEventsResponse>(`/visit-events?${queryParams}`);

  return normalizeVisitEventsResponse(response);
};