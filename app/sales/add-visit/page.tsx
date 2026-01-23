'use client';

import { Text, Card, Button } from '../../../design-system/components';
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

  return (
    <div style={{ padding: tokens.spacing[6] }}>
      <Text as="h1" size="xl" weight="bold" style={{ marginBottom: tokens.spacing[8] }}>
        Add New Visit
      </Text>

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
            note={formData.note}
            onVisitTypeChange={(value) => updateForm({ visit_type: value })}
            onNoteChange={(value) => updateForm({ note: value })}
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
              onResponseChange={(value) => updateForm({ response: value })}
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
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Visit...' : 'Create Visit'}
          </Button>
        </div>
      </div>
    </div>
  );
}