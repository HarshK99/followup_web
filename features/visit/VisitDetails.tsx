import React from 'react';
import { SegmentedControl, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';
import type { VisitType } from '../../core/hooks/useVisitForm';

interface VisitDetailsProps {
  visitType: VisitType;
  onVisitTypeChange: (type: VisitType) => void;
}

const visitTypeOptions = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'order', label: 'Order' },
];

export function VisitDetails({ visitType, onVisitTypeChange }: VisitDetailsProps) {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Visit Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <SegmentedControl
          options={visitTypeOptions}
          value={visitType}
          onChange={(value) => onVisitTypeChange(value as VisitType)}
        />
      </div>
    </div>
  );
}