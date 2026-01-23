import React from 'react';
import { tokens } from '../tokens';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: tokens.spacing[2],
        fontSize: '16px',
        color: tokens.colors.primary,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: tokens.borderRadius.sm,
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.colors.light;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      ←
    </button>
  );
};