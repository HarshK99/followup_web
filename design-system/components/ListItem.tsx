import React from 'react';
import { tokens } from '../tokens';

interface ListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({ children, onClick }) => {
  const style: React.CSSProperties = {
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
    borderBottom: `1px solid ${tokens.colors.light}`,
    cursor: onClick ? 'pointer' : 'default',
    backgroundColor: tokens.colors.white,
    transition: 'background-color 0.2s',
  };

  const hoverStyle = onClick ? { ':hover': { backgroundColor: tokens.colors.light } } : {};

  return (
    <div style={style} onClick={onClick}>
      {children}
    </div>
  );
};