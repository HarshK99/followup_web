'use client';

import React from 'react';
import { tokens } from '../tokens';

interface StackProps {
  children: React.ReactNode;
  spacing?: number;
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end';
}

export function Stack({ children, spacing = 4, direction = 'vertical', align }: StackProps) {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: tokens.spacing[spacing],
    alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align === 'center' ? 'center' : undefined,
  };

  return <div style={style}>{children}</div>;
}