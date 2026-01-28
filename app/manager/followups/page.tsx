'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Text, Card, Button, Table, Modal, DatePicker, Input } from '../../../design-system/components';
import { getManagerFollowupsAPI, markOutcomeAPI, cancelFollowupAPI } from '../../../core/api/followups';
import { tokens } from '../../../design-system/tokens';

export default function FollowupsList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [outcomeNote, setOutcomeNote] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: followups = [] as any[] } = useQuery({
    queryKey: ['manager-followups'],
    // Manager followups is a collection endpoint — extract `.data` explicitly
    queryFn: () => getManagerFollowupsAPI('today').then((res: any) => res.followUps),
  });

  const outcomeMutation = useMutation({
    mutationFn: ({ id, outcome }: { id: string; outcome: any }) => markOutcomeAPI(id, outcome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-followups'] });
      setModalOpen(false);
      setRescheduleDate('');
      setOutcomeNote('');
    },
    onError: (err: any) => {
      if (err?.status === 401 || err?.message === 'Unauthorized') {
        // Auth handling is centralized in the API client (clears session).
        // Let the auth/layout layer react to session state instead of
        // performing page-level redirects here.
        return;
      }
      setError(err.message || 'An error occurred');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelFollowupAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-followups'] });
    },
    onError: (err: any) => {
      if (err?.status === 401 || err?.message === 'Unauthorized') {
        return;
      }
      setError(err.message || 'An error occurred');
    },
  });

  const handleOutcome = (id: string, outcome: string) => {
    setError('');
    if (outcome === 'cancel') {
      cancelMutation.mutate(id);
    } else {
      outcomeMutation.mutate({ id, outcome: { outcome, outcome_note: outcomeNote, next_follow_up_date: rescheduleDate } });
    }
  };

  const headers = ['Vendor', 'Creator', 'Note', 'Date', 'Status', 'Actions'];

  const rows = followups.map((f: any) => [
    f.vendor.name,
    f.creator.name,
    f.note || 'N/A',
    f.follow_up_date,
    f.status,
    <div key={f.id}>
      <Button size="sm" onClick={() => handleOutcome(f.id, 'completed')}>Complete</Button>
      <Button size="sm" variant="secondary" onClick={() => { setSelectedId(f.id); setModalOpen(true); }}>Reschedule</Button>
      <Button size="sm" variant="danger" onClick={() => handleOutcome(f.id, 'cancel')}>Cancel</Button>
    </div>
  ]);

  return (
    <div>
      <Text as="h1" size="xl" weight="bold">All Follow-ups</Text>
      {error && <Text color="danger" style={{ marginBottom: tokens.spacing[4] }}>{error}</Text>}
      <Card>
        <Table headers={headers} rows={rows} />
      </Card>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Text as="h3">Reschedule Follow-up</Text>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <DatePicker value={rescheduleDate} onChange={setRescheduleDate} />
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input placeholder="Outcome Note" value={outcomeNote} onChange={(e) => setOutcomeNote(e.target.value)} />
        </div>
        <Button onClick={() => handleOutcome(selectedId, 'postponed')}>Reschedule</Button>
      </Modal>
    </div>
  );
}