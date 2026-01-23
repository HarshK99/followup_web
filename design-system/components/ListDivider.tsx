import React from 'react';
import { tokens } from '../tokens';

interface ListDividerProps {
  spacing?: keyof typeof tokens.spacing;
}

export const ListDivider: React.FC<ListDividerProps> = ({
  spacing = 3
}) => {
  return (
    <div style={{
      height: '1px',
      backgroundColor: tokens.colors.light,
      marginTop: tokens.spacing[spacing],
      marginBottom: tokens.spacing[spacing],
    }} />
  );
};