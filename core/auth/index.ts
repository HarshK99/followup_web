// Mock auth service
export type Role = 'sales' | 'manager';

export interface User {
  id: string;
  role: Role;
  name: string;
}

export const login = async (email: string, password: string): Promise<User | null> => {
  // Mock implementation
  if (email === 'sales@example.com' && password === 'password') {
    return { id: '1', role: 'sales', name: 'Sales User' };
  }
  if (email === 'manager@example.com' && password === 'password') {
    return { id: '2', role: 'manager', name: 'Manager User' };
  }
  return null;
};

export const getRoleHome = (role: Role): string => {
  return role === 'sales' ? '/sales' : '/manager';
};