import React from 'react';
import { tokens } from '../tokens';

interface BottomActionBarProps {
  children: React.ReactNode;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({ children }) => {
  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.white,
    borderTop: `1px solid ${tokens.colors.light}`,
    padding: tokens.spacing[3],
    display: 'flex',
    justifyContent: 'space-around',
    boxShadow: tokens.shadows.lg,
  };

  return <div style={style}>{children}</div>;
};