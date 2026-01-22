import React from 'react';
import { tokens } from '../tokens';

interface SalesLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const SalesLayout: React.FC<SalesLayoutProps> = ({ children, actions }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colors.white,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: tokens.spacing[4],
    paddingBottom: actions ? '80px' : tokens.spacing[4], // space for bottom actions
  };

  const actionsStyle: React.CSSProperties = {
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

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>{children}</div>
      {actions && <div style={actionsStyle}>{actions}</div>}
    </div>
  );
};