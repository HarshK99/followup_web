import { apiClient } from './client';

export const createFollowupAPI = async (followup: any) => {
  // return apiClient.post('/follow-ups', followup);
  // Mock
  return {
    data: {
      id: 'f-' + Math.random().toString(36).substr(2, 9),
      status: 'open',
      follow_up_date: followup.follow_up_date
    },
    meta: {}
  };
};

export const getSalesFollowupsAPI = async () => {
  // return apiClient.get('/follow-ups?scope=mine');
  // Mock
  return {
    data: [
      { id: 'f-001', vendor_name: 'Sharma General Store', reason: 'promised_order', follow_up_date: '2026-01-10', status: 'open' },
      { id: 'f-002', vendor_name: 'Patel Shop', reason: 'follow_up', follow_up_date: '2026-01-05', status: 'completed' },
      { id: 'f-003', vendor_name: 'Gupta Store', reason: 'complaint', follow_up_date: '2026-01-15', status: 'open' }
    ],
    meta: {}
  };
};

export const getManagerFollowupsAPI = async (filter: string) => {
  // return apiClient.get(`/follow-ups?scope=all&filter=${filter}`);
  // Mock
  return {
    data: [
      { id: 'f-001', vendor_name: 'Sharma General Store', salesperson_name: 'Ramesh Patel', reason: 'promised_order', follow_up_date: '2026-01-10', status: 'open' },
      { id: 'f-002', vendor_name: 'Patel Shop', salesperson_name: 'Ramesh Patel', reason: 'follow_up', follow_up_date: '2026-01-05', status: 'completed' },
      { id: 'f-003', vendor_name: 'Gupta Store', salesperson_name: 'Suresh Kumar', reason: 'complaint', follow_up_date: '2026-01-15', status: 'open' }
    ],
    meta: {}
  };
};

export const markOutcomeAPI = async (id: string, outcome: any) => {
  // return apiClient.post(`/follow-ups/${id}/outcome`, outcome);
  // Mock
  return {
    data: {
      id,
      status: outcome.outcome === 'completed' ? 'completed' : 'open',
      next_follow_up_date: outcome.next_follow_up_date || null
    },
    meta: {}
  };
};

export const cancelFollowupAPI = async (id: string) => {
  // return apiClient.post(`/follow-ups/${id}/cancel`);
  // Mock
  return {
    data: {
      id,
      status: 'cancelled'
    },
    meta: {}
  };
};