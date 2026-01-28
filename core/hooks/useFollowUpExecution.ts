import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { executeCallAPI } from '../api/followups';

interface FollowUp {
  id: string;
  vendorName: string;
  area: string;
  phone: string;
  potentialScore: number;
  note: string;
  followUpDate: string;
  callStatus: string;
  status: string;
}

interface EditingState {
  callStatus: string;
  outcome?: string;
  note?: string;
  followUpDate?: string;
}

export const useFollowUpExecution = (followUps: FollowUp[]) => {
  const queryClient = useQueryClient();

  const [editingStates, setEditingStates] = useState<Record<string, EditingState>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string>>({});

  // Initialize editing states for new followUps
  followUps.forEach((f) => {
    if (!editingStates[f.id]) {
      setEditingStates((prev) => ({
        ...prev,
        [f.id]: {
          callStatus: f.callStatus,
          outcome: undefined,
          note: undefined,
          followUpDate: f.followUpDate,
        },
      }));
    }
  });

  const mutation = useMutation({
    mutationFn: executeCallAPI,
    onMutate: (variables) => {
      const { followUpId } = variables;
      setLoadingStates((prev) => ({ ...prev, [followUpId]: true }));
      setErrorStates((prev) => ({ ...prev, [followUpId]: '' }));
    },
    onSuccess: (data, variables) => {
      const { followUpId } = variables;
      setLoadingStates((prev) => ({ ...prev, [followUpId]: false }));

      // Invalidate and refetch follow-ups
      queryClient.invalidateQueries({ queryKey: ['manager-followups'] });
    },
    onError: (error, variables) => {
      const { followUpId } = variables;
      setLoadingStates((prev) => ({ ...prev, [followUpId]: false }));
      setErrorStates((prev) => ({ ...prev, [followUpId]: error.message || 'Error' }));
    },
  });

  const handleChange = useCallback((id: string, field: keyof EditingState, value: string) => {
    setEditingStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        ...(field === 'callStatus' && value !== 'picked_up' ? { outcome: undefined } : {}),
      },
    }));
  }, []);

  const handleSubmit = useCallback((id: string) => {
    const state = editingStates[id];
    if (!state || state.callStatus === 'not_called') return;

    const payload = {
      follow_up_id: id,
      call_status: state.callStatus,
      ...(state.outcome && { outcome: state.outcome }),
      ...(state.note && { note: state.note }),
      ...(state.followUpDate && { follow_up_date: state.followUpDate }),
    };

    mutation.mutate(payload);
  }, [editingStates, mutation]);

  return {
    editingStates,
    loadingStates,
    errorStates,
    handleChange,
    handleSubmit,
  };
};