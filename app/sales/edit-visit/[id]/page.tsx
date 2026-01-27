'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Text, Section, Button, BackButton } from '../../../../design-system/components';
import { tokens } from '../../../../design-system/tokens';
import { getVisitByIdAPI, updateVisitByIdAPI } from '../../../../core/api/visit-events';
import { VisitEvent, UpdateVisitPayload } from '../../../../core/types/visit';
import {
  FollowUpOutcome,
  OrderOutcome,
} from '../../../../features/visit';

export default function EditVisit() {
  const params = useParams();
  const visitId = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  // Local state for editable fields
  const [note, setNote] = useState<string>('');
  const [response, setResponse] = useState<'interested' | 'not_interested' | undefined>();
  const [potentialScore, setPotentialScore] = useState<number | undefined>();
  const [followUpDays, setFollowUpDays] = useState<number | undefined>();
  const [followUpDate, setFollowUpDate] = useState<string | undefined>();
  const [followUpNote, setFollowUpNote] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');

  // Fetch visit data
  const { data: visit, isLoading, error: fetchError } = useQuery({
    queryKey: ['visit', visitId],
    queryFn: () => getVisitByIdAPI(visitId),
    enabled: !!visitId,
  });

  // Initialize local state when visit data loads
  useEffect(() => {
    if (visit) {
      setNote(visit.note || '');
      setResponse(visit.follow_up?.response);
      setPotentialScore(visit.follow_up?.potential_score);
      setFollowUpDays(visit.follow_up?.follow_up_days);
      setFollowUpDate(visit.follow_up?.follow_up_date);
      setFollowUpNote(visit.follow_up?.note || '');
      setOrderNote(visit.order?.note || '');
    }
  }, [visit]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateVisitPayload) => updateVisitByIdAPI(visitId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-visit-events'] });
      router.push('/sales');
    },
    onError: (error: any) => {
      console.error('Update failed:', error);
    },
  });

  const handleBack = () => {
    router.push('/sales');
  };

  const handleSubmit = () => {
    if (!visit) return;

    // Build PATCH payload according to requirements
    const payload: UpdateVisitPayload = {};

    // Add editable visit fields
    if (note !== (visit.note || '')) {
      payload.visit = { note };
    }

    // Add follow-up or order specific fields
    if (visit.visit_type === 'follow_up') {
      const followUpPayload: NonNullable<UpdateVisitPayload['follow_up']> = {};
      let hasFollowUpChanges = false;

      if (response !== visit.follow_up?.response) {
        followUpPayload.response = response;
        hasFollowUpChanges = true;
      }
      if (potentialScore !== visit.follow_up?.potential_score) {
        followUpPayload.potential_score = potentialScore;
        hasFollowUpChanges = true;
      }
      if (followUpDays !== visit.follow_up?.follow_up_days) {
        followUpPayload.follow_up_days = followUpDays;
        hasFollowUpChanges = true;
      }
      if (followUpDate !== visit.follow_up?.follow_up_date) {
        followUpPayload.follow_up_date = followUpDate;
        hasFollowUpChanges = true;
      }
      if (followUpNote !== (visit.follow_up?.note || '')) {
        followUpPayload.note = followUpNote;
        hasFollowUpChanges = true;
      }

      if (hasFollowUpChanges) {
        payload.follow_up = followUpPayload;
      }
    } else if (visit.visit_type === 'order') {
      if (orderNote !== (visit.order?.note || '')) {
        payload.order = { note: orderNote };
      }
    }

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div style={{ padding: tokens.spacing[1] }}>
        <Text>Loading visit...</Text>
      </div>
    );
  }

  if (fetchError || !visit) {
    return (
      <div style={{ padding: tokens.spacing[1] }}>
        <Text color="danger">Failed to load visit data</Text>
        <div style={{ marginTop: tokens.spacing[4] }}>
          <Button onClick={handleBack}>
            Back to Sales
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: tokens.spacing[1] }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[4],
        marginBottom: tokens.spacing[6]
      }}>
        <BackButton onClick={handleBack} />
        <Text as="h1" size="xl" weight="bold">
          Edit Visit
        </Text>
      </div>

      {/* Read-only vendor display */}
      <Section>
        <Text size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
          Vendor
        </Text>
        <Text size="md">{visit.vendor.name}</Text>
      </Section>

      {/* Read-only visit type display */}
      <Section>
        <Text size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
          Visit Type
        </Text>
        <Text size="md" style={{ textTransform: 'capitalize' }}>
          {visit.visit_type.replace('_', ' ')}
        </Text>
      </Section>

      {/* Editable sections based on visit type */}
      <Section>
        {visit.visit_type === 'follow_up' && (
          <FollowUpOutcome
            response={response}
            potentialScore={potentialScore}
            followUpDays={followUpDays}
            followUpDate={followUpDate}
            followUpNote={followUpNote}
            onResponseChange={setResponse}
            onPotentialScoreChange={setPotentialScore}
            onFollowUpDaysChange={setFollowUpDays}
            onFollowUpDateChange={setFollowUpDate}
            onFollowUpNoteChange={setFollowUpNote}
          />
        )}

        {visit.visit_type === 'order' && (
          <OrderOutcome
            note={orderNote}
            onNoteChange={setOrderNote}
          />
        )}
      </Section>

      {(updateMutation.error || fetchError) && (
        <Text
          size="md"
          color="danger"
          style={{
            marginBottom: tokens.spacing[4],
            textAlign: 'center',
          }}
        >
          {updateMutation.error?.message || 'An error occurred'}
        </Text>
      )}

      <div style={{ display: 'flex', gap: tokens.spacing[3] }}>
        <div style={{ flex: 1 }}>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Updating Visit...' : 'Update Visit'}
          </Button>
        </div>
      </div>
    </div>
  );
}