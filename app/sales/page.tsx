'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Text, Button, BottomActionBar } from '../../design-system/components';
import { VisitList } from '../../features/visit';
import { getSalesVisitEventsAPI } from '../../core/api/visit-events';
import { tokens } from '../../design-system/tokens';
import { VisitEvent } from '../../core/types/visit';

export default function SalesHome() {
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const { data: visitEvents = [] } = useQuery({
    queryKey: ['sales-visit-events'],
    queryFn: getSalesVisitEventsAPI,
  });

  const filtered = visitEvents.filter((visit: VisitEvent) => {
    const today = new Date().toISOString().split('T')[0];
    const visitDate = new Date(visit.created_at).toISOString().split('T')[0];
    if (filter === 'today') return visitDate === today;
    if (filter === 'past') return visitDate < today;
    if (filter === 'upcoming') return visitDate > today;
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <VisitList visits={filtered} />
      </div>
      <BottomActionBar>
        <Button onClick={() => router.push('/sales/add-visit')}>Add Visit</Button>
      </BottomActionBar>
    </div>
  );
}