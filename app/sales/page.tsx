'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Text, Button, BottomActionBar } from '../../design-system/components';
import { VisitList } from '../../features/visit';
import { getSalesVisitEventsAPI } from '../../core/api/visit-events';
import { tokens } from '../../design-system/tokens';
import { TimeframeFilter } from '../../core/types/visit';
import { VISIT_EVENTS_DEFAULT_LIMIT } from '../../core/constants/visit-events';

export default function SalesHome() {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('today');
  const [offset, setOffset] = useState(0);
  const router = useRouter();

  const { data: response, isLoading } = useQuery({
    queryKey: ['sales-visit-events', timeframe, offset],
    queryFn: () => getSalesVisitEventsAPI({
      timeframe,
      limit: VISIT_EVENTS_DEFAULT_LIMIT,
      offset,
    }),
  });

  const visitEvents = response?.data || [];
  const meta = response?.meta;

  const handleTimeframeChange = (newTimeframe: TimeframeFilter) => {
    setTimeframe(newTimeframe);
    setOffset(0); // Reset pagination when changing timeframe
  };

  const handleVisitClick = (visitId: string) => {
    router.push(`/sales/edit-visit/${visitId}`);
  };

  const handleLoadMore = () => {
    if (meta?.has_more) {
      setOffset(prev => prev + VISIT_EVENTS_DEFAULT_LIMIT);
    }
  };

  const getEmptyMessage = (timeframe: TimeframeFilter): string => {
    switch (timeframe) {
      case 'today':
        return 'No visits scheduled for today';
      case 'past':
        return 'No past visits found';
      case 'upcoming':
        return 'No upcoming visits scheduled';
      default:
        return 'No visits found';
    }
  };

  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Sales Dashboard</Text>
      <div style={{ display: 'flex', gap: tokens.spacing[2], marginBottom: tokens.spacing[4] }}>
        <Button variant={timeframe === 'all' ? 'primary' : 'secondary'} onClick={() => handleTimeframeChange('all')}>All</Button>
        <Button variant={timeframe === 'today' ? 'primary' : 'secondary'} onClick={() => handleTimeframeChange('today')}>Today</Button>
        <Button variant={timeframe === 'past' ? 'primary' : 'secondary'} onClick={() => handleTimeframeChange('past')}>Past</Button>
        <Button variant={timeframe === 'upcoming' ? 'primary' : 'secondary'} onClick={() => handleTimeframeChange('upcoming')}>Upcoming</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <VisitList
          visits={visitEvents}
          emptyMessage={getEmptyMessage(timeframe)}
          onVisitClick={handleVisitClick}
        />
        {meta?.has_more && (
          <div style={{ padding: tokens.spacing[4], textAlign: 'center' }}>
            <Button onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
      <BottomActionBar>
        <Button onClick={() => router.push('/sales/add-visit')}>Add Visit</Button>
      </BottomActionBar>
    </div>
  );
}