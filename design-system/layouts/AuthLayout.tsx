import React from 'react';
import { tokens } from '../tokens';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colors.background, // Changed from light to background
    padding: tokens.spacing[4],
  };

  return <div style={style}>{children}</div>;
};