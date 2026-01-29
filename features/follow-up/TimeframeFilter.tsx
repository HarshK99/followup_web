import React from 'react';
import { Select, Text, Stack } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';

interface TimeframeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const timeframeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'all', label: 'All' },
];

export const TimeframeFilter: React.FC<TimeframeFilterProps> = ({ value, onChange }) => {
  return (
    <Stack direction="horizontal" spacing="4" align="center">
      <Text size="md" weight="medium">Filter:</Text>
      <Select
        value={value}
        onChange={onChange}
        options={timeframeOptions}
        style={{ minWidth: '120px' }}
      />
    </Stack>
  );
};