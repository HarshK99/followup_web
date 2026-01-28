'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Text, Table, TableHeader, TableCell } from '../../../design-system/components';
import { getManagerFollowupsAPI } from '../../../core/api/followups';
import { useFollowUpExecution } from '../../../core/hooks/useFollowUpExecution';
import { FollowUpRow } from '../../../features/follow-up/FollowUpRow';
import { TimeframeFilter } from '../../../features/follow-up/TimeframeFilter';
import { ManagerFollowupsResponse, FollowUpRow as FollowUpRowType } from '../../../core/types/followup';

export default function FollowupsList() {
  const [filter, setFilter] = useState('today');

  const { data, isLoading, error } = useQuery<ManagerFollowupsResponse>({
    queryKey: ['manager-followups', filter],
    queryFn: () => getManagerFollowupsAPI(filter),
  });

  const followups: FollowUpRowType[] = data?.follow_ups
    .map((f) => ({
      id: f.id,
      vendorName: f.vendor.name,
      area: f.vendor.area,
      phone: f.vendor.phone,
      potentialScore: f.potential_score,
      note: f.note || '',
      followUpDate: f.follow_up_date,
      callStatus: f.call_status,
      status: f.status,
    })) || [];

  const { editingStates, loadingStates, errorStates, handleChange, handleSubmit } = useFollowUpExecution(followups);

  if (isLoading) {
    return <Text>Loading follow-ups...</Text>;
  }

  if (error) {
    return <Text>Error loading follow-ups: {error.message}</Text>;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Follow-ups</Text>
      <TimeframeFilter value={filter} onChange={setFilter} />
      <Table>
        <TableHeader>
          <TableCell>Vendor</TableCell>
          <TableCell>Area</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell flex={0.5}>Score</TableCell>
          <TableCell>Existing Note</TableCell>
          <TableCell>Call Status</TableCell>
          <TableCell>Outcome</TableCell>
          <TableCell>New Note</TableCell>
          <TableCell>Follow-up Date</TableCell>
          <TableCell flex={0.5}>Actions</TableCell>
        </TableHeader>
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
      </Table>
    </div>
  );
}