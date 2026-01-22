import React from 'react';
import { tokens } from '../tokens';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof tokens.spacing;
  shadow?: keyof typeof tokens.shadows;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = '4',
  shadow = 'md',
}) => {
  const style: React.CSSProperties = {
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.borderRadius.md,
    boxShadow: tokens.shadows[shadow],
    padding: tokens.spacing[padding as keyof typeof tokens.spacing],
  };

  return <div style={style}>{children}</div>;
};