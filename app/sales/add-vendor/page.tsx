'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Text, Card, Button, Input } from '../../../design-system/components';
import { createVendorAPI } from '../../../core/api/vendors';
import { tokens } from '../../../design-system/tokens';

export default function AddVendor() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gst, setGst] = useState('');
  const [area, setArea] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (vendor: any) => createVendorAPI(vendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
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
    mutation.mutate({ name, phone, gst_number: gst, area });
  };

  return (
    <div>
      <Text as="h1" size="lg" weight="bold">Add Vendor</Text>
      <Card>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input placeholder="GST" value={gst} onChange={(e) => setGst(e.target.value)} />
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        {error && <Text color="danger" style={{ marginBottom: tokens.spacing[4] }}>{error}</Text>}
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </Card>
    </div>
  );
}