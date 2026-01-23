import React from 'react';
import { Select, Input, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';
import type { Vendor } from '../../core/hooks/useVisitForm';

interface VendorSelectorProps {
  vendors: any[];
  selectedVendorOption: string;
  vendor: Vendor | null;
  onVendorSelect: (vendorId: string) => void;
  onVendorUpdate: (field: keyof Vendor, value: string) => void;
}

export function VendorSelector({
  vendors,
  selectedVendorOption,
  vendor,
  onVendorSelect,
  onVendorUpdate,
}: VendorSelectorProps) {
  const vendorOptions = [
    ...vendors.map((v: any) => ({ value: v.id, label: v.name })),
    { value: 'new', label: '+ Add New Vendor' },
  ];

  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Select or Create Vendor
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <Select
          options={vendorOptions}
          value={selectedVendorOption}
          placeholder="Choose a vendor or add new"
          onChange={(e) => onVendorSelect(e.target.value)}
        />
      </div>

      {selectedVendorOption === 'new' && vendor && (
        <div style={{
          padding: tokens.spacing[4],
          backgroundColor: tokens.colors.light,
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
      )}
    </div>
  );
}