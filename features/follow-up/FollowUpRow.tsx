import React from 'react';
import { Button, Input, Select, Text, TableRow, TableCell } from '../../design-system/components';

interface FollowUp {
  id: string;
  vendorName: string;
  area: string;
  phone: string;
  potentialScore: number;
  note: string;
  followUpDate: string;
  callStatus: string;
  status: string;
}

interface EditingState {
  callStatus: string;
  outcome?: string;
  note?: string;
  followUpDate?: string;
}

interface FollowUpRowProps {
  followUp: FollowUp;
  editingState: EditingState;
  loading: boolean;
  error: string;
  onChange: (field: keyof EditingState, value: string) => void;
  onSubmit: () => void;
}

const callStatusOptions = [
  { value: 'not_called', label: 'Not Called' },
  { value: 'not_picked_up', label: 'Not Picked Up' },
  { value: 'picked_up', label: 'Picked Up' },
];

const outcomeOptions = [
  { value: 'order_placed', label: 'Order Placed' },
  { value: 'follow_up_requested', label: 'Follow Up Requested' },
];

export const FollowUpRow: React.FC<FollowUpRowProps> = ({
  followUp,
  editingState,
  loading,
  error,
  onChange,
  onSubmit,
}) => {
  const isCompleted = followUp.status === 'completed';
  return (
    <TableRow>
      <TableCell><Text>{followUp.vendorName}</Text></TableCell>
      <TableCell><Text>{followUp.area}</Text></TableCell>
      <TableCell><Text>{followUp.phone}</Text></TableCell>
      <TableCell><Text>{followUp.potentialScore}</Text></TableCell>
      <TableCell><Text>{followUp.note}</Text></TableCell>
      <TableCell>
        <Select
          value={editingState.callStatus}
          onChange={(value) => onChange('callStatus', value)}
          options={callStatusOptions}
          disabled={loading || isCompleted}
        />
      </TableCell>
      <TableCell>
        {editingState.callStatus === 'picked_up' && (
          <Select
            value={editingState.outcome || ''}
            onChange={(value) => onChange('outcome', value)}
            options={outcomeOptions}
            disabled={loading || isCompleted}
          />
        )}
      </TableCell>
      <TableCell>
        {editingState.outcome === 'order_placed' && (
          <Input
            value={editingState.note || ''}
            onChange={(e) => onChange('note', e.target.value)}
            placeholder="Note"
            disabled={loading || isCompleted}
          />
        )}
        {editingState.outcome === 'follow_up_requested' && (
          <Input
            value={editingState.note || ''}
            onChange={(e) => onChange('note', e.target.value)}
            placeholder="Note"
            disabled={loading || isCompleted}
          />
        )}
      </TableCell>
      <TableCell>
        {editingState.outcome === 'follow_up_requested' && (
          <Input
            type="date"
            value={editingState.followUpDate || ''}
            onChange={(e) => onChange('followUpDate', e.target.value)}
            disabled={loading || isCompleted}
          />
        )}
      </TableCell>
      <TableCell>
        {isCompleted ? (
          <Text color="success" size="sm">Completed</Text>
        ) : (
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        )}
        {error && <Text color="danger" size="sm">{error}</Text>}
      </TableCell>
    </TableRow>
  );
};