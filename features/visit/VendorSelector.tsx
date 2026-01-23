import React, { useState, useMemo } from 'react';
import { SearchSelect, Text } from '../../design-system/components';
import { tokens } from '../../design-system/tokens';
import { NewVendorForm } from './NewVendorForm';
import type { Vendor } from '../../core/hooks/useVisitForm';

interface VendorItem {
  id: string;
  name: string;
}

interface VendorSelectorProps {
  vendors: VendorItem[];
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
  const [searchValue, setSearchValue] = useState('');

  // Map vendors to SearchSelect items
  const vendorItems = useMemo(() =>
    vendors.map((v: VendorItem) => ({ id: v.id, label: v.name })),
    [vendors]
  );

  // Determine if we're in new vendor mode
  const isNewVendorMode = selectedVendorOption === 'new';

  // Get the display value for SearchSelect
  const displayValue = useMemo(() => {
    if (isNewVendorMode) {
      return searchValue; // Show the typed value when adding new
    }
    if (selectedVendorOption && !isNewVendorMode) {
      // Show selected vendor name
      const selectedVendor = vendors.find((v: VendorItem) => v.id === selectedVendorOption);
      return selectedVendor?.name || '';
    }
    return searchValue; // Show search value when searching or empty
  }, [selectedVendorOption, vendors, searchValue, isNewVendorMode]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // If we have a selected vendor and user types something different, clear selection
    if (selectedVendorOption && selectedVendorOption !== 'new') {
      const selectedVendor = vendors.find((v: VendorItem) => v.id === selectedVendorOption);
      if (selectedVendor && value !== selectedVendor.name) {
        onVendorSelect('');
      }
    }
  };

  const handleVendorSelect = (item: { id: string; label: string }) => {
    setSearchValue(''); // Clear search when selecting
    onVendorSelect(item.id);
  };

  const handleAddNew = (query: string) => {
    setSearchValue(query); // Prefill the search value as vendor name
    onVendorSelect('new');
    // Prefill the vendor name with the search query
    onVendorUpdate('name', query);
  };

  const handleQuickAdd = () => {
    setSearchValue(''); // Clear search for new vendor
    onVendorSelect('new');
  };

  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <Text as="h2" size="md" weight="bold" style={{ marginBottom: tokens.spacing[3] }}>
        Select or Create Vendor
      </Text>

      <div style={{ marginBottom: tokens.spacing[4] }}>
        <SearchSelect
          value={displayValue}
          onChange={handleSearchChange}
          items={vendorItems}
          onSelect={handleVendorSelect}
          onAddNew={handleAddNew}
          placeholder="Search vendors..."
          rightAction={{
            icon: '+',
            onClick: handleQuickAdd,
            ariaLabel: 'Add new vendor'
          }}
          emptyStateLabel="No vendors found"
          addNewLabel={(query) => `Add "${query}" as new vendor`}
        />
      </div>

      {isNewVendorMode && vendor && (
        <NewVendorForm
          vendor={vendor}
          onVendorUpdate={onVendorUpdate}
        />
      )}
    </div>
  );
}