import React from 'react';
import { tokens } from '../tokens';
import { KeyboardAwareContainer } from '../components';

interface SalesLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const SalesLayout: React.FC<SalesLayoutProps> = ({ children, actions }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colors.surface, // Changed from white to surface
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: tokens.spacing[4],
    // Remove bottom padding as KeyboardAwareContainer will handle it
  };

  const actionsStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.surface, // Changed from white to surface
    borderTop: `1px solid ${tokens.colors.border}`, // Changed from light to border
    padding: tokens.spacing[3],
    display: 'flex',
    justifyContent: 'space-around',
    boxShadow: tokens.shadows.lg,
    // Ensure actions stay above keyboard padding
    zIndex: 10,
  };

  return (
    <div style={containerStyle}>
      <KeyboardAwareContainer style={contentStyle}>
        {children}
      </KeyboardAwareContainer>
      {actions && <div style={actionsStyle}>{actions}</div>}
    </div>
  );
};