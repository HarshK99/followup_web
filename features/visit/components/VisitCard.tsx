import React from 'react';
import { Text, Badge } from '../../../design-system/components';
import { tokens } from '../../../design-system/tokens';
import { VisitEvent } from '../../../core/types/visit';

interface VisitCardProps {
  visit: VisitEvent;
}

const getVisitTypeLabel = (visitType: string): string => {
  switch (visitType) {
    case 'follow_up':
      return 'Follow-up';
    case 'order':
      return 'Order';
    case 'no_outcome':
      return 'Visit';
    default:
      return visitType;
  }
};

const getVisitTypeVariant = (visitType: string): 'primary' | 'secondary' | 'success' | 'danger' => {
  switch (visitType) {
    case 'follow_up':
      return 'primary';
    case 'order':
      return 'success';
    case 'no_outcome':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const formatVisitDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const visitDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (visitDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (visitDate.getTime() === today.getTime() - 86400000) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const VisitCard: React.FC<VisitCardProps> = ({ visit }) => {
  const visitTypeLabel = getVisitTypeLabel(visit.visit_type);
  const visitTypeVariant = getVisitTypeVariant(visit.visit_type);
  const formattedDate = formatVisitDate(visit.created_at);

  return (
    <div style={{
      padding: `${tokens.spacing[3]} 0`,
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing[1]
    }}>
      {/* Line 1: Vendor name + visit type badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text size="md" weight="bold" style={{ flex: 1 }}>
          {visit.vendor.name}
        </Text>
        <Badge variant={visitTypeVariant} size="sm">
          {visitTypeLabel}
        </Badge>
      </div>

      {/* Line 2: Outcome summary + visit date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text size="sm" color="secondary" style={{ flex: 1 }}>
          {visit.note || 'No additional notes'}
        </Text>
        <Text size="sm" color="secondary" style={{ marginLeft: tokens.spacing[2] }}>
          {formattedDate}
        </Text>
      </div>
    </div>
  );
};