import React, { useState, useEffect } from 'react';
import { Text, Badge } from '../../../design-system/components';
import { tokens } from '../../../design-system/tokens';
import { VisitEvent } from '../../../core/types/visit';

interface VisitCardProps {
  visit: VisitEvent;
  onClick?: () => void;
}

const getVisitTypeLabel = (visitType: string): string => {
  switch (visitType) {
    case 'follow_up':
      return 'Follow-up';
    case 'order':
      return 'Order';
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

const getOutcomeSummary = (visit: VisitEvent): string => {
  if (visit.visit_type === 'follow_up') {
    const response = visit.follow_up?.response === 'interested' ? 'Interested' : visit.follow_up?.response === 'not_interested' ? 'Not Interested' : '';
    const timing = visit.follow_up?.follow_up_days ? `Follow up in ${visit.follow_up.follow_up_days} days` :
                  visit.follow_up?.follow_up_date ? `Follow up ${new Date(visit.follow_up.follow_up_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : '';
    const parts = [response, timing].filter(Boolean);
    return parts.length > 0 ? parts.join(' • ') : 'No outcome recorded';
  } else if (visit.visit_type === 'order') {
    return 'Order placed';
  }
  return '';
};

const getNoteText = (visit: VisitEvent): string => {
  if (visit.visit_type === 'follow_up' && visit.follow_up?.note) {
    return visit.follow_up.note;
  } else if (visit.visit_type === 'order' && visit.order?.note) {
    return visit.order.note;
  }
  return 'No notes added';
};

export const VisitCard: React.FC<VisitCardProps> = ({ visit, onClick }) => {
  const visitTypeLabel = getVisitTypeLabel(visit.visit_type);
  const visitTypeVariant = getVisitTypeVariant(visit.visit_type);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(formatVisitDate(visit.created_at));
  }, [visit.created_at]);

  const outcomeSummary = getOutcomeSummary(visit);
  const noteText = getNoteText(visit);

  return (
    <div
      style={{
        padding: `${tokens.spacing[3]} 0`,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[1],
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
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

      {/* Line 2: Outcome summary + note + visit date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text size="sm" color="secondary" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {outcomeSummary || noteText}
        </Text>
        <Text size="sm" color="secondary" style={{ marginLeft: tokens.spacing[2], flexShrink: 0 }}>
          {formattedDate}
        </Text>
      </div>
    </div>
  );
};