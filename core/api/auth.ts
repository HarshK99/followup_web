import { apiClient } from './client';

export const loginAPI = async (phone_number: string, password: string) => {
  // Mock implementation matching API spec
  // In real implementation: return apiClient.publicPost('/auth/login', { phone_number, password });
  if (phone_number === '+919812345678' && password === 'password') {
    return {
      data: {
        token: 'jwt-token-sales',
        user: {
          id: 'u-001',
          name: 'Ramesh Patel',
          role: 'salesperson',
          organization_id: 'org-001'
        }
      },
      meta: {}
    };
  }
  if (phone_number === '+919876543210' && password === 'password') {
    return {
      data: {
        token: 'jwt-token-manager',
        user: {
          id: 'u-002',
          name: 'Manager User',
          role: 'manager',
          organization_id: 'org-001'
        }
      },
      meta: {}
    };
  }
  throw new Error('Invalid credentials');
};