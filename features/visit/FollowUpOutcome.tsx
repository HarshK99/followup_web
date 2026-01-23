import React from 'react';
import { Select, Input, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';

interface FollowUpOutcomeProps {
  response?: 'interested' | 'not_interested';
  potentialScore?: number;
  followUpDays?: number;
  followUpNote?: string;
  onResponseChange: (response: 'interested' | 'not_interested') => void;
  onPotentialScoreChange: (score: number | undefined) => void;
  onFollowUpDaysChange: (days: number | undefined) => void;
  onFollowUpNoteChange: (note: string) => void;
}

const responseOptions = [
  { value: 'interested', label: 'Interested' },
  { value: 'not_interested', label: 'Not Interested' },
];

export function FollowUpOutcome({
  response,
  potentialScore,
  followUpDays,
  followUpNote,
  onResponseChange,
  onPotentialScoreChange,
  onFollowUpDaysChange,
  onFollowUpNoteChange,
}: FollowUpOutcomeProps) {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Follow-up Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Select
          options={responseOptions}
          value={response || ''}
          onChange={(e) => onResponseChange(e.target.value as 'interested' | 'not_interested')}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Input
          placeholder="Potential score (0-10)"
          value={potentialScore?.toString() || ''}
          onChange={(e) => onPotentialScoreChange(parseInt(e.target.value) || undefined)}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Input
          placeholder="Follow-up days (optional)"
          value={followUpDays?.toString() || ''}
          onChange={(e) => onFollowUpDaysChange(parseInt(e.target.value) || undefined)}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Input
          placeholder="Follow-up note (optional)"
          value={followUpNote || ''}
          onChange={(e) => onFollowUpNoteChange(e.target.value)}
        />
      </div>
    </div>
  );
}