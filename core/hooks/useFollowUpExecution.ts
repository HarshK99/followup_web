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
          note: f.note,
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
      const { followUpId, outcome } = variables;
      setLoadingStates((prev) => ({ ...prev, [followUpId]: false }));

      // Update the query data
      queryClient.setQueryData(['manager-followups'], (old: FollowUp[] | undefined) => {
        if (!old) return old;
        if (outcome === 'order_placed') {
          // Remove the follow-up
          return old.filter((f) => f.id !== followUpId);
        } else {
          // Update the follow-up with new data
          return old.map((f) =>
            f.id === followUpId
              ? { ...f, ...editingStates[followUpId] }
              : f
          );
        }
      });
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
      [id]: { ...prev[id], [field]: value },
    }));
  }, []);

  const handleSubmit = useCallback((id: string) => {
    const state = editingStates[id];
    if (!state) return;

    const payload = {
      followUpId: id,
      callStatus: state.callStatus,
      ...(state.outcome && { outcome: state.outcome }),
      ...(state.note && { note: state.note }),
      ...(state.followUpDate && { followUpDate: state.followUpDate }),
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