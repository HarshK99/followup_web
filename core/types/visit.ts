export interface VisitEvent {
  id: string;
  vendor: {
    id: string;
    name: string;
  };
  visit_type: 'follow_up' | 'order';
  note?: string;
  created_at: string;
  // Follow-up specific fields
  response?: 'interested' | 'not_interested';
  potential_score?: number;
  follow_up_days?: number;
  follow_up_date?: string;
  follow_up_note?: string;
  // Order specific fields
  order_note?: string;
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

export interface UpdateVisitPayload {
  visit?: {
    note?: string;
  };
  follow_up?: {
    response?: 'interested' | 'not_interested';
    potential_score?: number;
    follow_up_days?: number;
    follow_up_date?: string;
    note?: string;
  };
  order?: {
    note?: string;
    status?: string; // TODO: Define proper status type when available
  };
}