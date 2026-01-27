'use client';

import React from 'react';
import { tokens } from '../tokens';

interface SectionProps {
  children: React.ReactNode;
  spacing?: keyof typeof tokens.spacing;
}

export function Section({ children, spacing = 6 }: SectionProps) {
  const style: React.CSSProperties = {
    marginBottom: tokens.spacing[spacing],
  };

  return <div style={style}>{children}</div>;
}