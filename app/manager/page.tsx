'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Text, Card, Button, ListItem } from '../../design-system/components';
import { getManagerFollowupsAPI } from '../../core/api/followups';
import { tokens } from '../../design-system/tokens';
import { ManagerFollowupsResponse, FollowUpFromAPI } from '../../core/types/followup';

export default function ManagerHome() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery<ManagerFollowupsResponse>({
    queryKey: ['manager-followups'],
    queryFn: () => getManagerFollowupsAPI(),
  });

  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  if (isLoading) {
    return <Text>Loading follow-ups...</Text>;
  }

  if (error) {
    return <Text>Error loading follow-ups: {error.message}</Text>;
  }

  if (!data) {
    return null;
  }

  const followups = data.follow_ups;

  const today = followups.filter((f: FollowUpFromAPI) => f.follow_up_date === todayStr);
  const overdue = followups.filter((f: FollowUpFromAPI) => f.follow_up_date < todayStr && f.status === 'open');
  const upcoming = followups.filter((f: FollowUpFromAPI) => f.follow_up_date > todayStr);

  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Manager Dashboard</Text>
      {followups.length === 0 ? (
        <Text>No follow-ups today</Text>
      ) : (
        <>
          <Card>
            <Text as="h2" size="lg">Today</Text>
            {today.map((f: FollowUpFromAPI) => <ListItem key={f.id}><Text>{f.vendor.name}  ({f.status})</Text></ListItem>)}
          </Card>
          <Card>
            <Text as="h2" size="lg">Overdue</Text>
            {overdue.map((f: FollowUpFromAPI) => <ListItem key={f.id}><Text>{f.vendor.name}  ({f.status})</Text></ListItem>)}
          </Card>
          <Card>
            <Text as="h2" size="lg">Upcoming</Text>
            {upcoming.map((f: FollowUpFromAPI) => <ListItem key={f.id}><Text>{f.vendor.name}  ({f.status})</Text></ListItem>)}
          </Card>
        </>
      )}
      <Button onClick={() => router.push('/manager/followups')}>View All Follow-ups</Button>
    </div>
  );
}