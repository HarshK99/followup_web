'use client';

import { useRouter } from 'next/navigation';
import { Text, Section, Button, BackButton } from '../../../design-system/components';
import { tokens } from '../../../design-system/tokens';
import { useVisitForm } from '../../../core/hooks/useVisitForm';
import {
  VendorSelector,
  VisitDetails,
  FollowUpOutcome,
  OrderOutcome,
} from '../../../features/visit';

export default function AddVisit() {
  const router = useRouter();
  const {
    data: formData,
    selectedVendorOption,
    isSubmitting,
    error,
    updateForm,
    updateVendor,
    selectVendor,
    submit,
  } = useVisitForm();

  const handleBack = () => {
    router.push('/sales');
  };

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
          Add New Visit
        </Text>
      </div>

      <Section>
        <VendorSelector
          vendors={formData.vendors}
          selectedVendorOption={selectedVendorOption}
          vendor={formData.vendor}
          onVendorSelect={selectVendor}
          onVendorUpdate={updateVendor}
        />
      </Section>

      <Section>
        <VisitDetails
          visitType={formData.visit_type}
          onVisitTypeChange={(value) => updateForm({ visit_type: value })}
        />
      </Section>

      <Section>
        {formData.visit_type === 'follow_up' && (
          <FollowUpOutcome
            response={formData.response}
            potentialScore={formData.potential_score}
            followUpDays={formData.follow_up_days}
            followUpDate={formData.follow_up_date}
            followUpNote={formData.follow_up_note}
            onResponseChange={(value) => {
              console.log('📝 Page: onResponseChange called with:', value);
              updateForm({ response: value });
            }}
            onPotentialScoreChange={(value) => updateForm({ potential_score: value })}
            onFollowUpDaysChange={(value) => updateForm({ follow_up_days: value })}
            onFollowUpDateChange={(value) => updateForm({ follow_up_date: value })}
            onFollowUpNoteChange={(value) => updateForm({ follow_up_note: value })}
          />
        )}

        {formData.visit_type === 'order' && (
          <OrderOutcome
            note={formData.order_note}
            onNoteChange={(value: string) => updateForm({ order_note: value })}
          />
        )}
      </Section>

      {error && (
        <Text
          size="md"
          color="danger"
          style={{
            marginBottom: tokens.spacing[4],
            textAlign: 'center',
          }}
        >
          {error}
        </Text>
      )}

      <div style={{ display: 'flex', gap: tokens.spacing[3] }}>
        <div style={{ flex: 1 }}>
          <Button
            variant="primary"
            onClick={() => {
              console.log('🔘 Create Visit button clicked in page component');
              submit();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Visit...' : 'Create Visit'}
          </Button>
        </div>
      </div>
    </div>
  );
}