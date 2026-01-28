import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorsAPI } from '../api/vendors';
import { createVisitAPI } from '../api/followups';

export type VisitType = 'order' | 'follow_up';

export interface Vendor {
  id?: string;
  name: string;
  phone?: string;
  area?: string;
  city?: string;
  state?: string;
}

export interface VisitFormData {
  vendor: Vendor | null;
  visit_type: VisitType;
  // Follow-up fields
  response?: 'interested' | 'not_interested';
  potential_score?: number;
  follow_up_days?: number;
  follow_up_date?: string;
  follow_up_note?: string;
  // Order fields
  order_note?: string;
}

export interface VisitFormState {
  data: VisitFormData & { vendors: any[] };
  selectedVendorOption: string;
  isSubmitting: boolean;
  error: string | null;
}

export interface VisitFormActions {
  updateForm: (updates: Partial<VisitFormData>) => void;
  updateVendor: (field: keyof Vendor, value: string) => void;
  selectVendor: (vendorId: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

const initialFormData: VisitFormData = {
  vendor: null,
  visit_type: 'follow_up',
};

export function useVisitForm(visitId?: string): VisitFormState & VisitFormActions {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<VisitFormData>(initialFormData);
  const [selectedVendorOption, setSelectedVendorOption] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch vendors (collection endpoint) — explicitly extract `.data`
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getVendorsAPI().then((res: any) => res.data),
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (visitData: any) => createVisitAPI(visitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-visit-events'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      router.push('/sales');
    },
    onError: (err: any) => {
      if (err?.status === 401 || err?.message === 'Unauthorized') {
        // centralized auth handler already cleared session on 401;
        // let layout/auth layer perform the redirect
        return;
      }
      setError(err.message || 'An error occurred');
    },
  });

  const updateForm = (updates: Partial<VisitFormData>) => {
    console.log('📝 Updating form data:', updates);
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log('📊 New form data:', newData);
      return newData;
    });
  };

  const updateVendor = (field: keyof Vendor, value: string) => {
    updateForm({
      vendor: formData.vendor ? { ...formData.vendor, [field]: value } : null
    });
  };

  const selectVendor = (vendorId: string) => {
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

  const validateForm = (): string | null => {
    console.log('🔍 Validating form data:', formData);

    if (!formData.vendor?.name?.trim()) {
      console.log('❌ Validation failed: Vendor name is required');
      return 'Vendor name is required';
    }

    if (formData.visit_type === 'follow_up') {
      console.log('📋 Validating follow-up fields:', {
        response: formData.response,
        potential_score: formData.potential_score,
        follow_up_days: formData.follow_up_days,
        follow_up_date: formData.follow_up_date
      });

      if (!formData.response) {
        console.log('❌ Validation failed: Please select a response for the follow-up');
        return 'Please select a response for the follow-up';
      }

      if (formData.potential_score === undefined || formData.potential_score < 0 || formData.potential_score > 10) {
        console.log('❌ Validation failed: Please provide a valid potential score (0-10)');
        return 'Please provide a valid potential score (0-10)';
      }

      // Timing rules only apply when user is interested
      if (formData.response === 'interested') {
        const hasDays = formData.follow_up_days !== undefined;
        const hasDate = !!formData.follow_up_date;

        if (hasDays && hasDate) {
          console.log('❌ Validation failed: Provide only one timing option (days OR date)');
          return 'Provide only one timing option: follow_up_days OR follow_up_date';
        }

        if (!hasDays && !hasDate) {
          console.log('❌ Validation failed: Please choose when to follow up');
          return 'Please choose when to follow up';
        }
      }
      // If response === 'not_interested', timing is optional and not required
    } else if (formData.visit_type === 'order') {
      console.log('📋 Validating order fields: order type requires no additional validation');
      // Order visits require no additional validation - status is handled server-side
    }

    console.log('✅ Validation passed');
    return null;
  };

  const buildVisitPayload = () => {
    if (!formData.vendor) return null;

    const payload: any = {
      vendor: formData.vendor.id
        ? { id: formData.vendor.id }
        : {
            name: formData.vendor.name,
            phone: formData.vendor.phone || undefined,
            area: formData.vendor.area || undefined,
            city: formData.vendor.city || undefined,
            state: formData.vendor.state || undefined,
          },
      visit: {
        visit_type: formData.visit_type,
      },
    };

    if (formData.visit_type === 'follow_up') {
      const followUpData: any = {
        response: formData.response,
        potential_score: formData.potential_score,
        note: formData.follow_up_note || undefined,
      };

      // Timing fields are only included when user is interested
      if (formData.response === 'interested') {
        // Send only one timing field, not both
        if (formData.follow_up_days !== undefined) {
          followUpData.follow_up_days = formData.follow_up_days;
        } else if (formData.follow_up_date) {
          followUpData.follow_up_date = formData.follow_up_date;
        }
      }

      payload.follow_up = followUpData;
    } else if (formData.visit_type === 'order') {
      payload.order = {
        note: formData.order_note || undefined,
      };
    }

    return payload;
  };

  const submit = async () => {
    console.log('🚀 Submit button clicked');
    console.log('📊 Current form data:', formData);

    setError(null);
    const validationError = validateForm();
    if (validationError) {
      console.log('❌ Submit blocked by validation:', validationError);
      setError(validationError);
      return;
    }

    const payload = buildVisitPayload();
    console.log('📦 Built payload:', payload);

    if (!payload) {
      console.log('❌ Submit blocked: No payload generated');
      setError('Please fill in all required fields');
      return;
    }

    console.log('📡 Making API call...');
    await submitMutation.mutateAsync(payload);
  };

  const reset = () => {
    setFormData(initialFormData);
    setSelectedVendorOption('');
    setError(null);
  };

  return {
    data: { ...formData, vendors },
    selectedVendorOption,
    isSubmitting: submitMutation.isPending,
    error,
    updateForm,
    updateVendor,
    selectVendor,
    submit,
    reset,
  };
}