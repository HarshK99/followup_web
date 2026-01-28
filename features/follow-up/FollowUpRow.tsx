import React from 'react';
import { Button, Input, Select, Text, Stack } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';

interface FollowUp {
  id: string;
  vendorName: string;
  area: string;
  phone: string;
  potentialScore: number;
  note: string;
  followUpDate: string;
  callStatus: string;
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

export const FollowUpRow: React.FC<FollowUpRowProps> = ({
  followUp,
  editingState,
  loading,
  error,
  onChange,
  onSubmit,
}) => {
  const callStatusOptions = [
    { value: 'not_called', label: 'Not Called' },
    { value: 'not_picked_up', label: 'Not Picked Up' },
    { value: 'picked_up', label: 'Picked Up' },
  ];

  const outcomeOptions = [
    { value: 'order_placed', label: 'Order Placed' },
    { value: 'follow_up_requested', label: 'Follow Up Requested' },
  ];

  return (
    <Stack direction="row" spacing={tokens.spacing[4]} align="center">
      <Text>{followUp.vendorName}</Text>
      <Text>{followUp.area}</Text>
      <Text>{followUp.phone}</Text>
      <Text>{followUp.potentialScore}</Text>
      <Select
        value={editingState.callStatus}
        onChange={(value) => onChange('callStatus', value)}
        options={callStatusOptions}
        disabled={loading}
      />
      {editingState.callStatus === 'picked_up' && (
        <Select
          value={editingState.outcome || ''}
          onChange={(value) => onChange('outcome', value)}
          options={outcomeOptions}
          disabled={loading}
        />
      )}
      {editingState.outcome === 'order_placed' && (
        <Input
          value={editingState.note || ''}
          onChange={(e) => onChange('note', e.target.value)}
          placeholder="Note"
          disabled={loading}
        />
      )}
      {editingState.outcome === 'follow_up_requested' && (
        <>
          <Input
            value={editingState.note || ''}
            onChange={(e) => onChange('note', e.target.value)}
            placeholder="Note"
            disabled={loading}
          />
          <Input
            type="date"
            value={editingState.followUpDate || ''}
            onChange={(e) => onChange('followUpDate', e.target.value)}
            disabled={loading}
          />
        </>
      )}
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
      {error && <Text color="danger">{error}</Text>}
    </Stack>
  );
};