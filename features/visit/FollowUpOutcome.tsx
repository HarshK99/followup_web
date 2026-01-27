import React, { useState, useRef, useEffect } from 'react';
import { SegmentedControl, Input, Text, DatePicker, Button } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';
import { DatePickerRef } from '../../design-system/components/DatePicker';

interface FollowUpOutcomeProps {
  response?: 'interested' | 'not_interested';
  potentialScore?: number;
  followUpDays?: number;
  followUpDate?: string;
  followUpNote?: string;
  onResponseChange: (response: 'interested' | 'not_interested') => void;
  onPotentialScoreChange: (score: number | undefined) => void;
  onFollowUpDaysChange: (days: number | undefined) => void;
  onFollowUpDateChange: (date: string | undefined) => void;
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
  followUpDate,
  followUpNote,
  onResponseChange,
  onPotentialScoreChange,
  onFollowUpDaysChange,
  onFollowUpDateChange,
  onFollowUpNoteChange,
}: FollowUpOutcomeProps) {
  const [timingMode, setTimingMode] = useState<'days' | 'date'>('days');
  const datePickerRef = useRef<DatePickerRef>(null);

  console.log('🎨 FollowUpOutcome rendered with props:', {
    response,
    potentialScore,
    followUpDays,
    followUpDate,
    followUpNote,
    timingMode
  });

  // Sync mode with form data
  useEffect(() => {
    if (followUpDate && !followUpDays) {
      setTimingMode('date');
    } else if (followUpDays && !followUpDate) {
      setTimingMode('days');
    }
    // If both are empty or both have values, keep current mode (default to 'days')
  }, [followUpDays, followUpDate]);

  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Follow-up Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <SegmentedControl
          options={responseOptions}
          value={response || ''}
          onChange={(value) => {
            console.log('📝 Response changed:', value);
            onResponseChange(value as 'interested' | 'not_interested');
          }}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Potential score (0-10)"
          value={potentialScore?.toString() || ''}
          onChange={(e) => {
            console.log('📝 Potential score changed:', e.target.value);
            onPotentialScoreChange(parseInt(e.target.value) || undefined);
          }}
        />
      </div>

      {timingMode === 'days' && (
        <>
          <div style={{ marginBottom: tokens.spacing[4] }}>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Follow-up in days"
              value={followUpDays?.toString() || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || undefined;
                onFollowUpDaysChange(value);
                // Clear date when days is entered
                if (value !== undefined) {
                  onFollowUpDateChange(undefined);
                }
              }}
            />
          </div>

          <div style={{ marginBottom: tokens.spacing[4] }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setTimingMode('date');
                const currentDate = new Date().toISOString().split('T')[0];
                onFollowUpDateChange(currentDate);
              }}
              fullWidth={false}
            >
              Or choose a date
            </Button>
          </div>
        </>
      )}

      {timingMode === 'date' && (
        <>
          <div style={{ marginBottom: tokens.spacing[4] }}>
            <DatePicker
              ref={datePickerRef}
              value={followUpDate || ''}
              onChange={(value) => {
                onFollowUpDateChange(value || undefined);
                // Clear days when date is selected
                if (value) {
                  onFollowUpDaysChange(undefined);
                }
              }}
            />
          </div>

          <div style={{ marginBottom: tokens.spacing[4] }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setTimingMode('days');
                onFollowUpDateChange(undefined); // Clear date when switching back
              }}
              fullWidth={false}
            >
              Use days instead
            </Button>
          </div>
        </>
      )}

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