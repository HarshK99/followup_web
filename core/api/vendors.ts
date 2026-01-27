import { apiClient } from './client';

/**
 * Create a vendor (returns the created domain object)
 */
export const createVendorAPI = async (vendor: any) => {
  return apiClient.post('/vendors', vendor);
};

/**
 * Get vendors list.
 * The backend may return `{ vendors: [...] }` or a wrapped `{ data, meta }`.
 * Normalize into the frontend collection contract: `{ data, meta }`.
 */
export const getVendorsAPI = async () => {
  const res = await apiClient.get('/vendors');

  // Known backend shape: { vendors: Vendor[] }
  if (res && (res as any).vendors && Array.isArray((res as any).vendors)) {
    const vendors = (res as any).vendors;
    return {
      data: vendors,
      meta: {
        limit: vendors.length,
        offset: 0,
        total: vendors.length,
        has_more: false,
      },
    };
  }

  // Already wrapped shape: { data, meta }
  if (res && (res as any).data && Array.isArray((res as any).data)) {
    return res;
  }

  // Array response (unlikely) — wrap it
  if (Array.isArray(res)) {
    const arr = res as any[];
    return {
      data: arr,
      meta: {
        limit: arr.length,
        offset: 0,
        total: arr.length,
        has_more: false,
      },
    };
  }

  throw new Error('Unexpected vendors API response structure');
};