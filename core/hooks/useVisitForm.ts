import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorsAPI } from '../api/vendors';
import { createVisitAPI } from '../api/followups';

export type VisitType = 'order' | 'follow_up' | 'no_outcome';

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
  note: '',
};

export function useVisitForm(): VisitFormState & VisitFormActions {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<VisitFormData>(initialFormData);
  const [selectedVendorOption, setSelectedVendorOption] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch vendors
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getVendorsAPI().then((res: any) => res.vendors || []),
  });

  // Submit mutation
  const submitMutation = useMutation({
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

  const updateForm = (updates: Partial<VisitFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
    if (!formData.vendor?.name?.trim()) {
      return 'Vendor name is required';
    }

    if (formData.visit_type === 'follow_up') {
      if (!formData.response) {
        return 'Please select a response for the follow-up';
      }
      if (formData.potential_score === undefined || formData.potential_score < 0 || formData.potential_score > 10) {
        return 'Please provide a valid potential score (0-10)';
      }
    } else if (formData.visit_type === 'order') {
      if (!formData.order_status) {
        return 'Please select an order status';
      }
    }

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
        note: formData.note || undefined,
      },
    };

    if (formData.visit_type === 'follow_up') {
      payload.follow_up = {
        response: formData.response,
        potential_score: formData.potential_score,
        follow_up_days: formData.follow_up_days,
        note: formData.follow_up_note || undefined,
      };
    } else if (formData.visit_type === 'order') {
      payload.order = {
        status: formData.order_status,
        note: formData.order_note || undefined,
      };
    }

    return payload;
  };

  const submit = async () => {
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = buildVisitPayload();
    if (!payload) {
      setError('Please fill in all required fields');
      return;
    }

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