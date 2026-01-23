'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Text, Card, Button, ListItem, BottomActionBar } from '../../design-system/components';
import { getSalesVisitEventsAPI } from '../../core/api/visit-events';
import { tokens } from '../../design-system/tokens';

export default function SalesHome() {
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const { data: visitEvents = [] as any[] } = useQuery({
    queryKey: ['sales-visit-events'],
    queryFn: () => getSalesVisitEventsAPI().then((res: any) => {
      // Handle different response structures
      if (res?.visitEvents && Array.isArray(res.visitEvents)) return res.visitEvents;
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (Array.isArray(res)) return res;
      console.warn('Unexpected visit events API response structure:', res);
      return [];
    }),
  });

  const filtered = visitEvents.filter((visit: any) => {
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
      <Card>
        {filtered.map((visit: any) => (
          <ListItem key={visit.id}>
            <Text>{visit.vendor.name} - {visit.visit_type} - {new Date(visit.created_at).toLocaleDateString()}</Text>
          </ListItem>
        ))}
      </Card>
      <BottomActionBar>
        <Button onClick={() => router.push('/sales/add-visit')}>Add Visit</Button>
      </BottomActionBar>
    </div>
  );
}