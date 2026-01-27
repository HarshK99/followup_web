import { VisitEventsResponse, VisitEvent, VisitEventsParams } from '../../types/visit';

interface RawVisitEventsResponse {
  data?: VisitEvent[] | VisitEventsResponse;
  meta?: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

/**
 * Normalizes raw API responses into a consistent VisitEventsResponse format.
 * Handles both direct array responses and {data, meta} wrapper responses.
 */
export function normalizeVisitEventsResponse(
  response: RawVisitEventsResponse,
  fallbackMeta: { limit: number; offset: number }
): VisitEventsResponse {
  // Case 1: Response has data and meta (standard ApiResponse format)
  if (response?.data && response?.meta) {
    // Check if data is already a VisitEventsResponse
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        meta: response.meta
      };
    }
    // If data is a VisitEventsResponse object, return it directly
    if (typeof response.data === 'object' && 'data' in response.data && 'meta' in response.data) {
      return response.data as VisitEventsResponse;
    }
  }

  // Case 2: Response has data array but no meta (fallback to provided meta)
  if (response?.data && Array.isArray(response.data)) {
    return {
      data: response.data,
      meta: response.meta || {
        ...fallbackMeta,
        total: response.data.length,
        has_more: response.data.length >= fallbackMeta.limit
      }
    };
  }

  // Case 3: Invalid response structure
  throw new Error('Unexpected API response structure for visit events');
}