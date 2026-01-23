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