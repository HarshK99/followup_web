export interface VisitEvent {
  id: string;
  vendor: {
    id: string;
    name: string;
  };
  visit_type: 'follow_up' | 'order' | 'no_outcome';
  note?: string;
  created_at: string;
}

export interface VisitEventsResponse {
  data: VisitEvent[];
  meta: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

export type TimeframeFilter = 'today' | 'past' | 'upcoming' | 'all';

export interface VisitEventsParams {
  timeframe: TimeframeFilter;
  limit: number;
  offset: number;
}