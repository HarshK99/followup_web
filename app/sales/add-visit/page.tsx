'use client';

import { useRouter } from 'next/navigation';
import { Text, Card, Button, BackButton } from '../../../design-system/components';
import { tokens } from '../../../design-system/tokens';
import { useVisitForm } from '../../../core/hooks/useVisitForm';
import {
  VendorSelector,
  VisitDetails,
  FollowUpOutcome,
  OrderOutcome,
  NoOutcome,
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

      <div style={{ marginBottom: tokens.spacing[6] }}>
        <Card padding={6}>
          <VendorSelector
            vendors={formData.vendors}
            selectedVendorOption={selectedVendorOption}
            vendor={formData.vendor}
            onVendorSelect={selectVendor}
            onVendorUpdate={updateVendor}
          />
        </Card>
      </div>

      <div style={{ marginBottom: tokens.spacing[6] }}>
        <Card padding={6}>
          <VisitDetails
            visitType={formData.visit_type}
            onVisitTypeChange={(value) => updateForm({ visit_type: value })}
          />
        </Card>
      </div>

      <div style={{ marginBottom: tokens.spacing[6] }}>
        <Card padding={6}>
          {formData.visit_type === 'follow_up' && (
            <FollowUpOutcome
              response={formData.response}
              potentialScore={formData.potential_score}
              followUpDays={formData.follow_up_days}
              followUpNote={formData.follow_up_note}
              onResponseChange={(value) => {
                console.log('📝 Page: onResponseChange called with:', value);
                updateForm({ response: value });
              }}
              onPotentialScoreChange={(value) => updateForm({ potential_score: value })}
              onFollowUpDaysChange={(value) => updateForm({ follow_up_days: value })}
              onFollowUpNoteChange={(value) => updateForm({ follow_up_note: value })}
            />
          )}

          {formData.visit_type === 'order' && (
            <OrderOutcome
              status={formData.order_status}
              note={formData.order_note}
              onStatusChange={(value: 'placed' | 'promised') => updateForm({ order_status: value })}
              onNoteChange={(value: string) => updateForm({ order_note: value })}
            />
          )}

          {formData.visit_type === 'no_outcome' && <NoOutcome />}
        </Card>
      </div>

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