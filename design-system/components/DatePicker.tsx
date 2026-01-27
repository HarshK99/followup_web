'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { tokens } from '../tokens';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoOpen?: boolean;
}

export interface DatePickerRef {
  openPicker: () => void;
}

export const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(({
  value,
  onChange,
  error = false,
  disabled = false,
  autoOpen = false
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openPicker: () => {
      if (inputRef.current && !disabled) {
        inputRef.current.showPicker?.();
      }
    }
  }));

  useEffect(() => {
    if (autoOpen && inputRef.current && !disabled) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        inputRef.current?.showPicker?.();
      }, 10);
    }
  }, [autoOpen, disabled]);

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
    backgroundColor: 'transparent', // Ensure no background changes
    transition: 'border-color 0.2s, border-width 0.2s',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <input
      ref={inputRef}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={style}
    />
  );
});