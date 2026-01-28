import React from 'react';
import { tokens } from '../tokens';

interface TableContainerProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableContainerProps> = ({ children }) => {
  return (
    <div style={{ width: '100%' }}>
      {children}
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      padding: `${tokens.spacing[3]} 0`,
      borderBottom: `1px solid ${tokens.colors.border}`,
    }}>
      {children}
    </div>
  );
};

interface TableRowProps {
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      padding: `${tokens.spacing[3]} 0`,
      borderBottom: `1px solid ${tokens.colors.border}`,
    }}>
      {children}
    </div>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  flex?: number;
}

export const TableCell: React.FC<TableCellProps> = ({ children, flex = 1 }) => {
  return (
    <div style={{
      flex,
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${tokens.spacing[2]}`,
    }}>
      {children}
    </div>
  );
};

interface SeparatorProps {
  margin?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ margin = '0' }) => {
  return (
    <div style={{
      height: '1px',
      backgroundColor: tokens.colors.border,
      margin,
    }} />
  );
};