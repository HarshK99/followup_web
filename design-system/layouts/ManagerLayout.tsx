import React from 'react';
import { tokens } from '../tokens';

interface ManagerLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children, sidebar, header }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: tokens.colors.light,
  };

  const sidebarStyle: React.CSSProperties = {
    width: '250px',
    backgroundColor: tokens.colors.white,
    borderRight: `1px solid ${tokens.colors.secondary}`,
    padding: tokens.spacing[4],
    boxShadow: tokens.shadows.md,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: tokens.colors.white,
    borderBottom: `1px solid ${tokens.colors.secondary}`,
    padding: tokens.spacing[4],
    boxShadow: tokens.shadows.sm,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: tokens.spacing[4],
    backgroundColor: tokens.colors.white,
    margin: tokens.spacing[4],
    borderRadius: tokens.borderRadius.md,
    boxShadow: tokens.shadows.md,
  };

  return (
    <div style={containerStyle}>
      {sidebar && <div style={sidebarStyle}>{sidebar}</div>}
      <div style={mainStyle}>
        {header && <div style={headerStyle}>{header}</div>}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};