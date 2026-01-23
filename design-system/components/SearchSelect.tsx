import React, { useState, useRef, useEffect } from 'react';
import { Input, Card, ListItem, Text, Button } from '../components';
import { tokens } from '../tokens';

interface SearchSelectItem {
  id: string;
  label: string;
}

interface SearchSelectRightAction {
  icon: string; // Simple icon representation, e.g., "+" or "×"
  onClick: () => void;
  ariaLabel: string;
}

interface SearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  items: SearchSelectItem[];
  onSelect: (item: SearchSelectItem) => void;
  onAddNew?: (query: string) => void;
  placeholder?: string;
  rightAction?: SearchSelectRightAction;
  emptyStateLabel?: string;
  addNewLabel?: (query: string) => string;
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  value,
  onChange,
  items,
  onSelect,
  onAddNew,
  placeholder = 'Search...',
  rightAction,
  emptyStateLabel = 'No items found',
  addNewLabel = (query) => `Add "${query}"`,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter items based on current input value
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.trim().length > 0);
  };

  const handleItemSelect = (item: SearchSelectItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (onAddNew && value.trim()) {
      onAddNew(value.trim());
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && value.trim();
  const showAddNew = onAddNew && value.trim() && filteredItems.length === 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input and right action button container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        width: '100%'
      }}>
        <div style={{ flex: 1 }}>
          <Input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
          />
        </div>

        {rightAction && (
          <Button
            size="sm"
            variant="secondary"
            onClick={rightAction.onClick}
            aria-label={rightAction.ariaLabel}
          >
            {rightAction.icon}
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: tokens.spacing[1],
        }}>
          <Card shadow="md">
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              margin: `-${tokens.spacing[4]}`, // Negative margin to counteract Card padding
              padding: tokens.spacing[4], // Restore padding inside scrollable area
            }}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ListItem
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                  >
                    <Text size="sm">{item.label}</Text>
                  </ListItem>
                ))
              ) : showAddNew ? (
                <ListItem onClick={handleAddNew}>
                  <Text size="sm" color="primary">
                    + {addNewLabel(value.trim())}
                  </Text>
                </ListItem>
              ) : (
                <ListItem>
                  <Text size="sm" color="secondary">
                    {emptyStateLabel}
                  </Text>
                </ListItem>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};