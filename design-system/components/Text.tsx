import React from 'react';
import { tokens } from '../tokens';

interface TextProps {
  children: React.ReactNode;
  size?: keyof typeof tokens.typography.fontSize;
  weight?: keyof typeof tokens.typography.fontWeight;
  color?: keyof typeof tokens.colors;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'md',
  weight = 'normal',
  color = 'dark',
  as: Component = 'p',
  style = {},
}) => {
  const defaultStyle: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize[size],
    fontWeight: tokens.typography.fontWeight[weight],
    color: tokens.colors[color],
    margin: 0,
    lineHeight: tokens.typography.lineHeight.normal,
  };

  return <Component style={{ ...defaultStyle, ...style }}>{children}</Component>;
};