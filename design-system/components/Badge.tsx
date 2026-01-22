import React from 'react';
import { tokens } from '../tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: tokens.borderRadius.full,
    fontFamily: tokens.typography.fontFamily,
    fontWeight: tokens.typography.fontWeight.medium,
    textAlign: 'center',
  };

  const variantStyles = {
    primary: { backgroundColor: tokens.colors.primary, color: tokens.colors.white },
    secondary: { backgroundColor: tokens.colors.secondary, color: tokens.colors.white },
    success: { backgroundColor: tokens.colors.success, color: tokens.colors.white },
    danger: { backgroundColor: tokens.colors.danger, color: tokens.colors.white },
  };

  const sizeStyles = {
    sm: { padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`, fontSize: tokens.typography.fontSize.xs },
    md: { padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`, fontSize: tokens.typography.fontSize.sm },
  };

  const style = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return <span style={style}>{children}</span>;
};