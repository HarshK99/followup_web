import { VisitEventsResponse } from '../../types/visit';

/**
 * Accepts the wrapped VisitEventsResponse shape only.
 * No fallback logic or shape-guessing — caller must pass { data, meta }.
 */
export function normalizeVisitEventsResponse(
  response: VisitEventsResponse
): VisitEventsResponse {
  if (!response || !Array.isArray(response.data) || !response.meta) {
    throw new Error('normalizeVisitEventsResponse expects a wrapped VisitEventsResponse');
  }

  // Identity normalization for now — place for mapping/transform if needed.
  return response;
}