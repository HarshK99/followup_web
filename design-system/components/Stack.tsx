'use client';

import React from 'react';
import { tokens } from '../tokens';

interface StackProps {
  children: React.ReactNode;
  spacing?: keyof typeof tokens.spacing;
  direction?: 'vertical' | 'horizontal';
}

export function Stack({ children, spacing = 4, direction = 'vertical' }: StackProps) {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: tokens.spacing[spacing],
  };

  return <div style={style}>{children}</div>;
}