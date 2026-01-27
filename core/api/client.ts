import { getToken, clearSession } from '../auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface ApiError {
  error: {
    code: string;
    message: string;
  };
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

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      clearSession();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: { code: 'UNKNOWN', message: 'Network error' }
      }));
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data as T;
  }

  async publicPost<T>(endpoint: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: { code: 'UNKNOWN', message: 'Network error' }
      }));
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data as T;
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