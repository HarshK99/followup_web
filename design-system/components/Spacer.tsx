'use client';

import React from 'react';
import { tokens } from '../tokens';

interface SpacerProps {
  size?: keyof typeof tokens.spacing;
}

export function Spacer({ size = 4 }: SpacerProps) {
  const style: React.CSSProperties = {
    height: tokens.spacing[size],
  };

  return <div style={style} />;
}