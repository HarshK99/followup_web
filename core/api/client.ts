import { getToken, clearSession } from '../auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;


interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export class ApiClientError extends Error {
  status: number;
  code?: string;
  original?: any;

  constructor(message: string, status = 0, code?: string, original?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.original = original;
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (err) {
      throw new ApiClientError('Network error', 0, 'NETWORK_ERROR', err);
    }

    const parsedBody = await response.json().catch(() => null);

    // Handle explicit unauthorized or token-expired codes centrally
    if (response.status === 401 || parsedBody?.error?.code === 'TOKEN_EXPIRED' || parsedBody?.error?.code === 'INVALID_TOKEN') {
      clearSession();
      const msg = parsedBody?.error?.message || 'Unauthorized';
      throw new ApiClientError(msg, 401, parsedBody?.error?.code, parsedBody);
    }

    if (!response.ok) {
      const errMsg = parsedBody?.error?.message || 'API error';
      const errCode = parsedBody?.error?.code;
      throw new ApiClientError(errMsg, response.status, errCode, parsedBody);
    }

    return (parsedBody as T) as T;
  }

  async publicPost<T>(endpoint: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      throw new ApiClientError('Network error', 0, 'NETWORK_ERROR', err);
    }

    const parsedBody = await response.json().catch(() => null);

    if (response.status === 401 || parsedBody?.error?.code === 'TOKEN_EXPIRED' || parsedBody?.error?.code === 'INVALID_TOKEN') {
      clearSession();
      const msg = parsedBody?.error?.message || 'Unauthorized';
      throw new ApiClientError(msg, 401, parsedBody?.error?.code, parsedBody);
    }

    if (!response.ok) {
      const errMsg = parsedBody?.error?.message || 'API error';
      const errCode = parsedBody?.error?.code;
      throw new ApiClientError(errMsg, response.status, errCode, parsedBody);
    }

    return (parsedBody as T) as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Auth API client - no /api prefix for auth endpoints
export const authApiClient = new ApiClient(`${API_BASE}`);

// Core REST API client - includes /api prefix for all endpoints
export const apiClient = new ApiClient(`${API_BASE}/api`);