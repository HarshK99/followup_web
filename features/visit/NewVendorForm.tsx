import React from 'react';
import { Input, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';
import type { Vendor } from '../../core/hooks/useVisitForm';

interface NewVendorFormProps {
  vendor: Vendor;
  onVendorUpdate: (field: keyof Vendor, value: string) => void;
}

export function NewVendorForm({ vendor, onVendorUpdate }: NewVendorFormProps) {
  return (
    <div style={{
      padding: tokens.spacing[4],
      backgroundColor: tokens.colors.surfaceSecondary, // Changed from light to surfaceSecondary
      borderRadius: tokens.borderRadius.md
    }}>
      <Text as="h3" size="sm" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        New Vendor Details
      </Text>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <Input
          placeholder="Vendor Name *"
          value={vendor.name}
          onChange={(e) => onVendorUpdate('name', e.target.value)}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <Input
          placeholder="Phone"
          value={vendor.phone || ''}
          onChange={(e) => onVendorUpdate('phone', e.target.value)}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <Input
          placeholder="Area"
          value={vendor.area || ''}
          onChange={(e) => onVendorUpdate('area', e.target.value)}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <Input
          placeholder="City"
          value={vendor.city || ''}
          onChange={(e) => onVendorUpdate('city', e.target.value)}
        />
      </div>

      <div style={{ marginBottom: tokens.spacing[3] }}>
        <Input
          placeholder="State"
          value={vendor.state || ''}
          onChange={(e) => onVendorUpdate('state', e.target.value)}
        />
      </div>
    </div>
  );
}