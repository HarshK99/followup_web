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
    backgroundColor: tokens.colors.background, // Changed from light to background
  };

  const sidebarStyle: React.CSSProperties = {
    // Sidebar width is intentionally not fixed here so the passed `sidebar`
    // node can control its own width (expanded vs collapsed).
    backgroundColor: tokens.colors.surface,
    borderRight: `1px solid ${tokens.colors.border}`,
    boxShadow: tokens.shadows.md,
    display: 'flex',
    alignItems: 'stretch',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: tokens.colors.surface, // Changed from white to surface
    borderBottom: `1px solid ${tokens.colors.border}`, // Changed from secondary to border
    padding: tokens.spacing[4],
    boxShadow: tokens.shadows.sm,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: tokens.spacing[4],
    backgroundColor: tokens.colors.surface, // Changed from white to surface
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