import React from 'react';
import { tokens } from '../tokens';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  value?: string;
  options: SegmentedControlOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  options,
  onChange,
  disabled = false,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    borderRadius: tokens.borderRadius.md,
    border: `${tokens.borderWidth.thin} solid ${tokens.colors.border}`, // Changed from subtle to border
    overflow: 'hidden',
    backgroundColor: tokens.colors.surfaceSecondary, // Changed from light to surfaceSecondary
    opacity: disabled ? 0.6 : 1,
  };

  const getButtonStyle = (optionValue: string): React.CSSProperties => {
    const isActive = value === optionValue;
    const isLast = options[options.length - 1]?.value === optionValue;

    return {
      flex: 1,
      padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      border: 'none',
      backgroundColor: isActive ? tokens.colors.primary : 'transparent',
      color: isActive ? tokens.colors.white : tokens.colors.textPrimary, // Changed from dark to textPrimary
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize.md,
      fontWeight: tokens.typography.fontWeight.medium,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s, color 0.2s',
      borderRight: !isLast ? `${tokens.borderWidth.thin} solid ${tokens.colors.border}` : 'none', // Changed from subtle to border
      outline: 'none',
      minHeight: '44px', // Ensure good touch targets for mobile
    };
  };

  return (
    <div style={containerStyle}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          style={getButtonStyle(option.value)}
          onClick={() => !disabled && onChange(option.value)}
          disabled={disabled}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};