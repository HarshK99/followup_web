import React from 'react';
import { tokens } from '../tokens';

interface InputProps {
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
}) => {
  const style: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize.md,
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
    border: `1px solid ${tokens.colors.secondary}`,
    borderRadius: tokens.borderRadius.md,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={style}
    />
  );
};