'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Text, Card, Button, ListItem } from '../../design-system/components';
import { getManagerFollowupsAPI } from '../../core/api/followups';
import { tokens } from '../../design-system/tokens';

export default function ManagerHome() {
  const router = useRouter();

  const { data: followups = [] as any[] } = useQuery({
    queryKey: ['manager-followups'],
    queryFn: () => getManagerFollowupsAPI('all').then((res: any) => res.data),
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const today = followups.filter((f: any) => f.follow_up_date === todayStr);
  const overdue = followups.filter((f: any) => f.follow_up_date < todayStr && f.status === 'open');
  const upcoming = followups.filter((f: any) => f.follow_up_date > todayStr);

  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Manager Dashboard</Text>
      <Card>
        <Text as="h2" size="lg">Today</Text>
        {today.map((f: any) => <ListItem key={f.id}><Text>{f.vendor_name} - {f.salesperson_name}</Text></ListItem>)}
      </Card>
      <Card>
        <Text as="h2" size="lg">Overdue</Text>
        {overdue.map((f: any) => <ListItem key={f.id}><Text>{f.vendor_name} - {f.salesperson_name}</Text></ListItem>)}
      </Card>
      <Card>
        <Text as="h2" size="lg">Upcoming</Text>
        {upcoming.map((f: any) => <ListItem key={f.id}><Text>{f.vendor_name} - {f.salesperson_name}</Text></ListItem>)}
      </Card>
      <Button onClick={() => router.push('/manager/followups')}>View All Follow-ups</Button>
    </div>
  );
}