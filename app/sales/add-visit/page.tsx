'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Text, Card, Button, Select, Input } from '../../../design-system/components';
import { getVendorsAPI } from '../../../core/api/vendors';
import { createVisitAPI } from '../../../core/api/followups';
import { tokens } from '../../../design-system/tokens';

type VisitType = 'order' | 'follow_up' | 'no_outcome';

interface Vendor {
  id?: string;
  name: string;
  phone?: string;
  area?: string;
  city?: string;
  state?: string;
}

interface VisitForm {
  vendor: Vendor | null;
  visit_type: VisitType;
  note: string;
  // Follow-up fields
  response?: 'interested' | 'not_interested';
  potential_score?: number;
  follow_up_days?: number;
  follow_up_note?: string;
  // Order fields
  order_status?: 'placed' | 'promised';
  order_note?: string;
}

export default function AddVisit() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<VisitForm>({
    vendor: null,
    visit_type: 'follow_up',
    note: '',
  });

  const [selectedVendorOption, setSelectedVendorOption] = useState<string>('');
  const [error, setError] = useState('');

  const { data: vendors = [] as any[] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getVendorsAPI().then((res: any) => res.data.vendors),
  });

  const visitMutation = useMutation({
    mutationFn: (visitData: any) => createVisitAPI(visitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-followups'] });
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

  const updateForm = (updates: Partial<VisitForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendorOption(vendorId);
    
    if (vendorId === 'new') {
      updateForm({
        vendor: { name: '', phone: '', area: '', city: '', state: '' }
      });
    } else {
      const vendor = vendors.find((v: any) => v.id === vendorId);
      if (vendor) {
        updateForm({
          vendor: { id: vendor.id, name: vendor.name }
        });
      }
    }
  };

  const handleVendorFieldChange = (field: keyof Vendor, value: string) => {
    updateForm({
      vendor: form.vendor ? { ...form.vendor, [field]: value } : null
    });
  };

  const buildVisitPayload = () => {
    if (!form.vendor) return null;

    const payload: any = {
      vendor: form.vendor.id
        ? { id: form.vendor.id }
        : {
            name: form.vendor.name,
            phone: form.vendor.phone || undefined,
            area: form.vendor.area || undefined,
            city: form.vendor.city || undefined,
            state: form.vendor.state || undefined,
          },
      visit: {
        visit_type: form.visit_type,
        note: form.note || undefined,
      },
    };

    if (form.visit_type === 'follow_up') {
      payload.follow_up = {
        response: form.response,
        potential_score: form.potential_score,
        follow_up_days: form.follow_up_days,
        note: form.follow_up_note || undefined,
      };
    } else if (form.visit_type === 'order') {
      payload.order = {
        status: form.order_status,
        note: form.order_note || undefined,
      };
    }

    return payload;
  };

  const handleSubmit = () => {
    setError('');
    const payload = buildVisitPayload();
    if (!payload) {
      setError('Please fill in all required fields');
      return;
    }

    // Validation
    if (!form.vendor?.name?.trim()) {
      setError('Vendor name is required');
      return;
    }

    if (form.visit_type === 'follow_up') {
      if (!form.response) {
        setError('Please select a response for the follow-up');
        return;
      }
      if (form.potential_score === undefined || form.potential_score < 0 || form.potential_score > 10) {
        setError('Please provide a valid potential score (0-10)');
        return;
      }
    } else if (form.visit_type === 'order') {
      if (!form.order_status) {
        setError('Please select an order status');
        return;
      }
    }

    visitMutation.mutate(payload);
  };

  const vendorOptions = [
    ...vendors.map((v: any) => ({ value: v.id, label: v.name })),
    { value: 'new', label: '+ Add New Vendor' },
  ];

  const visitTypeOptions = [
    { value: 'follow_up', label: 'Follow-up Visit' },
    { value: 'order', label: 'Order Visit' },
    { value: 'no_outcome', label: 'Visit (No Specific Outcome)' },
  ];

  const responseOptions = [
    { value: 'interested', label: 'Interested' },
    { value: 'not_interested', label: 'Not Interested' },
  ];

  const orderStatusOptions = [
    { value: 'placed', label: 'Order Placed' },
    { value: 'promised', label: 'Order Promised' },
  ];

  return (
    <div>
      <Text as="h1" size="lg" weight="bold">Add Visit</Text>

      <Card>
        {/* Step 1: Vendor Selection/Creation */}
        <div style={{ marginBottom: tokens.spacing[6] }}>
          <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
            Select or Create Vendor
          </Text>

          <div style={{ marginBottom: tokens.spacing[4] }}>
            <Select
              options={vendorOptions}
              value={selectedVendorOption}
              onChange={(e) => handleVendorSelect(e.target.value)}
            />
          </div>

          {selectedVendorOption === 'new' && form.vendor && (
            <div style={{ padding: tokens.spacing[4], backgroundColor: tokens.colors.light, borderRadius: tokens.borderRadius.md }}>
              <Text as="h3" size="sm" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
                New Vendor Details
              </Text>

              <div style={{ marginBottom: tokens.spacing[3] }}>
                <Input
                  placeholder="Vendor Name *"
                  value={form.vendor.name}
                  onChange={(e) => handleVendorFieldChange('name', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: tokens.spacing[3] }}>
                <Input
                  placeholder="Phone"
                  value={form.vendor.phone || ''}
                  onChange={(e) => handleVendorFieldChange('phone', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: tokens.spacing[3] }}>
                <Input
                  placeholder="Area"
                  value={form.vendor.area || ''}
                  onChange={(e) => handleVendorFieldChange('area', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: tokens.spacing[3] }}>
                <Input
                  placeholder="City"
                  value={form.vendor.city || ''}
                  onChange={(e) => handleVendorFieldChange('city', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: tokens.spacing[3] }}>
                <Input
                  placeholder="State"
                  value={form.vendor.state || ''}
                  onChange={(e) => handleVendorFieldChange('state', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Visit Details */}
        <div style={{ marginBottom: tokens.spacing[6] }}>
          <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
            Visit Details
          </Text>

          <div style={{ marginBottom: tokens.spacing[4] }}>
            <Select
              options={visitTypeOptions}
              value={form.visit_type}
              onChange={(e) => updateForm({ visit_type: e.target.value as VisitType })}
            />
          </div>

          <div style={{ marginBottom: tokens.spacing[4] }}>
            <Input
              placeholder="Visit note (optional)"
              value={form.note}
              onChange={(e) => updateForm({ note: e.target.value })}
            />
          </div>
        </div>

        {/* Step 3: Conditional Outcome */}
        {form.visit_type === 'follow_up' && (
          <div style={{ marginBottom: tokens.spacing[6] }}>
            <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
              Follow-up Details
            </Text>

            <div style={{ marginBottom: tokens.spacing[4] }}>
              <Select
                options={responseOptions}
                value={form.response || ''}
                onChange={(e) => updateForm({ response: e.target.value as 'interested' | 'not_interested' })}
              />
            </div>

            <div style={{ marginBottom: tokens.spacing[4] }}>
              <Input
                placeholder="Potential score (0-10)"
                value={form.potential_score?.toString() || ''}
                onChange={(e) => updateForm({ potential_score: parseInt(e.target.value) || undefined })}
              />
            </div>

            <div style={{ marginBottom: tokens.spacing[4] }}>
              <Input
                placeholder="Follow-up days (optional)"
                value={form.follow_up_days?.toString() || ''}
                onChange={(e) => updateForm({ follow_up_days: parseInt(e.target.value) || undefined })}
              />
            </div>

            <div style={{ marginBottom: tokens.spacing[4] }}>
              <Input
                placeholder="Follow-up note (optional)"
                value={form.follow_up_note || ''}
                onChange={(e) => updateForm({ follow_up_note: e.target.value })}
              />
            </div>
          </div>
        )}

        {form.visit_type === 'order' && (
          <div style={{ marginBottom: tokens.spacing[6] }}>
            <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
              Order Details
            </Text>

            <div style={{ marginBottom: tokens.spacing[4] }}>
              <Select
                options={orderStatusOptions}
                value={form.order_status || ''}
                onChange={(e) => updateForm({ order_status: e.target.value as 'placed' | 'promised' })}
              />
            </div>

            <div style={{ marginBottom: tokens.spacing[4] }}>
              <Input
                placeholder="Order note (optional)"
                value={form.order_note || ''}
                onChange={(e) => updateForm({ order_note: e.target.value })}
              />
            </div>
          </div>
        )}

        {form.visit_type === 'no_outcome' && (
          <div style={{ marginBottom: tokens.spacing[6] }}>
            <Text size="sm" color="secondary">
              No specific outcome recorded for this visit.
            </Text>
          </div>
        )}

        {/* Submit */}
        {error && (
          <Text color="danger" style={{ marginBottom: tokens.spacing[4] }}>
            {error}
          </Text>
        )}

        <div style={{ width: '100%' }}>
          <Button
            onClick={handleSubmit}
            disabled={visitMutation.isPending}
          >
            {visitMutation.isPending ? 'Recording Visit...' : 'Record Visit'}
          </Button>
        </div>
      </Card>
    </div>
  );
}