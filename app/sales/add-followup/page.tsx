'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Text, Card, Button, Select, DatePicker, Input } from '../../../design-system/components';
import { getVendorsAPI } from '../../../core/api/vendors';
import { createFollowupAPI } from '../../../core/api/followups';
import { tokens } from '../../../design-system/tokens';

export default function AddFollowup() {
  const [vendorId, setVendorId] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: vendors = [] as any[] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getVendorsAPI().then((res: any) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (followup: any) => createFollowupAPI(followup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-followups'] });
      router.push('/sales');
    },
    onError: (err: Error) => {
      if (err.message === 'Unauthorized') {
        router.push('/auth/login');
      } else {
        setError(err.message);
      }
    },
  });

  const handleSubmit = () => {
    setError('');
    mutation.mutate({ vendor_id: vendorId, reason, follow_up_date: date, note });
  };

  const vendorOptions = vendors.map((v: any) => ({ value: v.id, label: v.name }));
  const reasonOptions = [
    { value: 'promised_order', label: 'Promised Order' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'complaint', label: 'Complaint' },
  ];

  return (
    <div>
      <Text as="h1" size="lg" weight="bold">Add Follow-up</Text>
      <Card>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Select options={vendorOptions} value={vendorId} onChange={(e) => setVendorId(e.target.value)} />
          <Button variant="secondary" onClick={() => router.push('/sales/add-vendor')}>Add New Vendor</Button>
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Select options={reasonOptions} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        {error && <Text color="danger" style={{ marginBottom: tokens.spacing[4] }}>{error}</Text>}
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </Card>
    </div>
  );
}