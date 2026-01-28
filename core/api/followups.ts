import { apiClient } from './client';
import { getToken } from '../auth';

export const createVisitAPI = async (visit: any) => {
  return apiClient.post('/visits', visit);
};

export const createFollowupAPI = async (followup: any) => {
  return apiClient.post('/follow-ups', followup);
};

export const getSalesFollowupsAPI = async () => {
  return apiClient.get('/follow-ups?scope=mine');
};

export const getManagerFollowupsAPI = async (filter: string = 'today') => {
  // Default and normalization
  const normalized = filter === 'all' ? 'today' : filter || 'today';
  const path = `/manager/follow-ups?filter=${normalized}&limit=20&offset=0`;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const url = `${base}/api${path}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(url, { method: 'GET', headers });

    let parsed: any = null;
    try {
      parsed = await resp.json();
    } catch (e) {
      parsed = null;
    }

    // Normalize different API shapes to a consistent return value
    if (parsed?.data && Array.isArray(parsed.data)) return { follow_ups: parsed.data, meta: parsed.meta || {} };
    if (Array.isArray(parsed)) return { follow_ups: parsed, meta: {} };

    // If API returned an object with `follow_ups` (current shape), return as is
    if (parsed?.follow_ups && Array.isArray(parsed.follow_ups)) return { follow_ups: parsed.follow_ups, meta: parsed.meta || {} };

    // If API returned an object with `followUps` (older shape), return as is
    if (parsed?.followUps && Array.isArray(parsed.followUps)) return { follow_ups: parsed.followUps, meta: parsed.meta || {} };

    // If API returned an object with `followups` (older shape), return the array
    if (parsed?.followups && Array.isArray(parsed.followups)) return { follow_ups: parsed.followups, meta: parsed.meta || {} };

    // Fallback: return empty object
    return { follow_ups: [], meta: {} };
  } catch (err) {
    return { follow_ups: [], meta: {} };
  }
};

export const markOutcomeAPI = async (id: string, outcome: any) => {
  return apiClient.post(`/follow-ups/${id}/outcome`, outcome);
};

export const cancelFollowupAPI = async (id: string) => {
  return apiClient.post(`/follow-ups/${id}/cancel`);
};

export const executeCallAPI = async (payload: any) => {
  return apiClient.post('/manager/calls/execute', payload);
};