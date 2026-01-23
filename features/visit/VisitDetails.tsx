import React from 'react';
import { Select, Input, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';
import type { VisitType } from '../../core/hooks/useVisitForm';

interface VisitDetailsProps {
  visitType: VisitType;
  note: string;
  onVisitTypeChange: (type: VisitType) => void;
  onNoteChange: (note: string) => void;
}

const visitTypeOptions = [
  { value: 'follow_up', label: 'Follow-up Visit' },
  { value: 'order', label: 'Order Visit' },
  { value: 'no_outcome', label: 'Visit (No Specific Outcome)' },
];

export function VisitDetails({
  visitType,
  note,
  onVisitTypeChange,
  onNoteChange,
}: VisitDetailsProps) {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Visit Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Select
          options={visitTypeOptions}
          value={visitType}
          onChange={(e) => onVisitTypeChange(e.target.value as VisitType)}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Input
          placeholder="Visit note (optional)"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </div>
    </div>
  );
}