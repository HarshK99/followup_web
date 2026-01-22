import React from 'react';
import { tokens } from '../tokens';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const style: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize.md,
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
    border: `1px solid ${tokens.colors.secondary}`,
    borderRadius: tokens.borderRadius.md,
    outline: 'none',
  };

  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
    />
  );
};