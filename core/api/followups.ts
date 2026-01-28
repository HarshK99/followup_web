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

  const isDev = process.env.NODE_ENV !== 'production';

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const url = `${base}/api${path}`;

  if (isDev) {
    try {
      console.log('[followups] request start', { url });
    } catch (_) {}
  }

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

    if (isDev) {
      try {
        // sanitize parsed object by redacting common sensitive keys
        const sanitize = (obj: any): any => {
          if (!obj || typeof obj !== 'object') return obj;
          if (Array.isArray(obj)) return obj.map(sanitize);
          const out: any = {};
          for (const k of Object.keys(obj)) {
            if (['password', 'token', 'access_token', 'refresh_token'].includes(k)) {
              out[k] = '[REDACTED]';
            } else {
              out[k] = sanitize(obj[k]);
            }
          }
          return out;
        };

        console.log('[followups] response status', { status: resp.status });
        console.log('[followups] parsed JSON', sanitize(parsed));
      } catch (_) {}
    }

    // Normalize different API shapes to a consistent return value
    if (parsed?.data && Array.isArray(parsed.data)) return parsed;
    if (Array.isArray(parsed)) return { data: parsed };

    // If API returned an object with `followUps` (current shape), return as is
    if (parsed?.followUps && Array.isArray(parsed.followUps)) return parsed;

    // If API returned an object with `followups` (older shape), map it
    if (parsed?.followups && Array.isArray(parsed.followups)) return { data: parsed.followups };

    // Fallback: return empty array in `data` to ensure callers never get undefined
    return { data: [] };
  } catch (err) {
    if (isDev) {
      try { console.error('[followups] request error', err); } catch (_) {}
    }
    return { data: [] };
  }
};

export const markOutcomeAPI = async (id: string, outcome: any) => {
  return apiClient.post(`/follow-ups/${id}/outcome`, outcome);
};

export const cancelFollowupAPI = async (id: string) => {
  return apiClient.post(`/follow-ups/${id}/cancel`);
};