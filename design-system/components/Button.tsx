import React from 'react';
import { tokens } from '../tokens';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
}) => {
  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: tokens.borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: tokens.typography.fontFamily,
    fontWeight: tokens.typography.fontWeight.medium,
    transition: 'background-color 0.2s',
  };

  const variantStyles = {
    primary: { backgroundColor: tokens.colors.primary, color: tokens.colors.white },
    secondary: { backgroundColor: tokens.colors.secondary, color: tokens.colors.white },
    success: { backgroundColor: tokens.colors.success, color: tokens.colors.white },
    danger: { backgroundColor: tokens.colors.danger, color: tokens.colors.white },
  };

  const sizeStyles = {
    sm: { padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`, fontSize: tokens.typography.fontSize.sm },
    md: { padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`, fontSize: tokens.typography.fontSize.md },
    lg: { padding: `${tokens.spacing[4]} ${tokens.spacing[5]}`, fontSize: tokens.typography.fontSize.lg },
  };

  const style = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};