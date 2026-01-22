'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Text, Card, Button, ListItem, BottomActionBar } from '../../design-system/components';
import { getSalesFollowupsAPI } from '../../core/api/followups';
import { tokens } from '../../design-system/tokens';

export default function SalesHome() {
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const { data: followups = [] } = useQuery({
    queryKey: ['sales-followups'],
    queryFn: () => getSalesFollowupsAPI().then(res => res.data),
  });

  const filtered = followups.filter(f => {
    const today = new Date().toISOString().split('T')[0];
    if (filter === 'today') return f.follow_up_date === today;
    if (filter === 'past') return f.follow_up_date < today;
    if (filter === 'upcoming') return f.follow_up_date > today;
    return true;
  });

  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Sales Dashboard</Text>
      <div style={{ display: 'flex', gap: tokens.spacing[2], marginBottom: tokens.spacing[4] }}>
        <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'today' ? 'primary' : 'secondary'} onClick={() => setFilter('today')}>Today</Button>
        <Button variant={filter === 'past' ? 'primary' : 'secondary'} onClick={() => setFilter('past')}>Past</Button>
        <Button variant={filter === 'upcoming' ? 'primary' : 'secondary'} onClick={() => setFilter('upcoming')}>Upcoming</Button>
      </div>
      <Card>
        {filtered.map(f => (
          <ListItem key={f.id}>
            <Text>{f.vendor_name} - {f.reason} - {f.follow_up_date} - {f.status}</Text>
          </ListItem>
        ))}
      </Card>
      <BottomActionBar>
        <Button onClick={() => router.push('/sales/add-followup')}>Add Follow-up</Button>
      </BottomActionBar>
    </div>
  );
}