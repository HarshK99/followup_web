import React from 'react';
import { Select, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';
import type { VisitType } from '../../core/hooks/useVisitForm';

interface VisitDetailsProps {
  visitType: VisitType;
  onVisitTypeChange: (type: VisitType) => void;
}

const visitTypeOptions = [
  { value: 'follow_up', label: 'Follow-up Visit' },
  { value: 'order', label: 'Order Visit' },
  { value: 'no_outcome', label: 'Visit (No Specific Outcome)' },
];

export function VisitDetails({ visitType, onVisitTypeChange }: VisitDetailsProps) {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Visit Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Select
          options={visitTypeOptions}
          value={visitType}
          placeholder="Select visit type"
          onChange={(e) => onVisitTypeChange(e.target.value as VisitType)}
        />
      </div>
    </div>
  );
}