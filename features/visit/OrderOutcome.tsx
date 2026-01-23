import React from 'react';
import { Select, Input, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';

interface OrderOutcomeProps {
  status?: 'placed' | 'promised';
  note?: string;
  onStatusChange: (status: 'placed' | 'promised') => void;
  onNoteChange: (note: string) => void;
}

const orderStatusOptions = [
  { value: 'placed', label: 'Order Placed' },
  { value: 'promised', label: 'Order Promised' },
];

export function OrderOutcome({
  status,
  note,
  onStatusChange,
  onNoteChange,
}: OrderOutcomeProps) {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Order Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Select
          options={orderStatusOptions}
          value={status || ''}
          placeholder="Select order status"
          onChange={(e) => onStatusChange(e.target.value as 'placed' | 'promised')}
        />
      </div>

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