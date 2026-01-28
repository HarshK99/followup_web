'use client';

import { useQuery } from '@tanstack/react-query';
import { Text, Stack } from '../../../design-system/components';
import { getManagerFollowupsAPI } from '../../../core/api/followups';
import { useFollowUpExecution } from '../../../core/hooks/useFollowUpExecution';
import { FollowUpRow } from '../../../features/follow-up/FollowUpRow';
import { tokens } from '../../../design-system/tokens';
import { ManagerFollowupsResponse, FollowUpRow as FollowUpRowType } from '../../../core/types/followup';

export default function FollowupsList() {
  const { data, isLoading, error } = useQuery<ManagerFollowupsResponse>({
    queryKey: ['manager-followups'],
    queryFn: () => getManagerFollowupsAPI('today'),
  });

  if (isLoading) {
    return <Text>Loading follow-ups...</Text>;
  }

  if (error) {
    return <Text>Error loading follow-ups: {error.message}</Text>;
  }

  if (!data) {
    return null;
  }

  const followups: FollowUpRowType[] = data.follow_ups.map((f) => ({
    id: f.id,
    vendorName: f.vendor.name,
    area: f.vendor.area,
    phone: f.vendor.phone,
    potentialScore: f.potential_score,
    note: f.note || '',
    followUpDate: f.follow_up_date,
    callStatus: f.call_status,
  }));

  const { editingStates, loadingStates, errorStates, handleChange, handleSubmit } = useFollowUpExecution(followups);

  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Follow-ups</Text>
      <Stack spacing={4}>
        {followups.map((f) => (
          <FollowUpRow
            key={f.id}
            followUp={f}
            editingState={editingStates[f.id]}
            loading={loadingStates[f.id]}
            error={errorStates[f.id]}
            onChange={(field, value) => handleChange(f.id, field, value)}
            onSubmit={() => handleSubmit(f.id)}
          />
        ))}
      </Stack>
    </div>
  );
}