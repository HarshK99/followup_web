import React, { useState } from 'react';
import { tokens } from '../tokens';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  prefix?: string; // New prefix prop
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  prefix,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return tokens.colors.danger;
    if (isFocused) return tokens.colors.primary;
    return tokens.colors.subtle;
  };

  const getBorderWidth = () => {
    return isFocused ? tokens.borderWidth.medium : tokens.borderWidth.thin;
  };

  const style: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize.md,
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]} ${tokens.spacing[3]} 0`, // Remove bottom padding to align with border
    border: 'none', // Remove all borders
    borderBottom: `${getBorderWidth()} solid ${getBorderColor()}`,
    borderRadius: 0, // Remove border radius for bottom-border-only style
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'transparent', // Ensure no background changes
    transition: 'border-color 0.2s, border-width 0.2s',
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={style}
    />
  );
};