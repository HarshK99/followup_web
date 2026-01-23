import React, { useState } from 'react';
import { tokens } from '../tokens';

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select an option',
  error = false,
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
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={style}
    >
      {!value && <option value="" disabled>{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};