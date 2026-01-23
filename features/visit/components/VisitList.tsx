import React from 'react';
import { Text, ListDivider } from '../../../design-system/components';
import { VisitCard } from './VisitCard';
import { tokens } from '../../../design-system/tokens';
import { VisitEvent } from '../../../core/types/visit';

interface VisitListProps {
  visits: VisitEvent[];
  emptyMessage?: string;
}

export const VisitList: React.FC<VisitListProps> = ({
  visits,
  emptyMessage = "No visits found"
}) => {
  if (visits.length === 0) {
    return (
      <div style={{
        padding: tokens.spacing[4],
        textAlign: 'center'
      }}>
        <Text color="secondary">{emptyMessage}</Text>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {visits.map((visit, index) => (
        <React.Fragment key={visit.id}>
          <VisitCard visit={visit} />
          {index < visits.length - 1 && <ListDivider spacing={1} />}
        </React.Fragment>
      ))}
    </div>
  );
};