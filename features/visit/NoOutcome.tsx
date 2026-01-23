import React from 'react';
import { Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';

export function NoOutcome() {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text size="sm" color="secondary">
        No specific outcome recorded for this visit.
      </Text>
    </div>
  );
}