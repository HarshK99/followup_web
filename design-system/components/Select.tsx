import React from 'react';
import { tokens } from '../tokens';

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
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
    <select value={value} onChange={onChange} disabled={disabled} style={style}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};