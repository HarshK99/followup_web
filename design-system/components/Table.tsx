import React from 'react';
import { tokens } from '../tokens';
import { Text } from './Text';

interface TableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    padding: tokens.spacing[3],
    borderBottom: `1px solid ${tokens.colors.light}`,
    textAlign: 'left',
    fontWeight: tokens.typography.fontWeight.bold,
  };

  const tdStyle: React.CSSProperties = {
    padding: tokens.spacing[3],
    borderBottom: `1px solid ${tokens.colors.light}`,
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i} style={thStyle}><Text>{h}</Text></th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j} style={tdStyle}>{typeof cell === 'string' ? <Text>{cell}</Text> : cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};