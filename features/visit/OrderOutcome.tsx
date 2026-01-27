import React from 'react';
import { Select, Input, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';

interface OrderOutcomeProps {
  note?: string;
  onNoteChange: (note: string) => void;
}

export function OrderOutcome({
  note,
  onNoteChange,
}: OrderOutcomeProps) {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Order Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Input
          placeholder="Order note (optional)"
          value={note || ''}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </div>
    </div>
  );
}