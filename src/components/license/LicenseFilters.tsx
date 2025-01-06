import React from 'react';
import { Filter, SortAsc, Calendar } from 'lucide-react';
import { SearchInput } from './filters/SearchInput';
import { FilterSelect } from './filters/FilterSelect';

interface LicenseFiltersProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  sortBy: string;
  expirationFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onExpirationChange: (value: string) => void;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'saas', label: 'SaaS' },
  { value: 'subscription', label: 'Subscription' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'pending', label: 'Pending' },
  { value: 'expiring', label: 'Expiring Soon' }
];

const EXPIRATION_OPTIONS = [
  { value: 'all', label: 'All Expiration' },
  { value: '30', label: 'Next 30 Days' },
  { value: '60', label: 'Next 60 Days' },
  { value: '90', label: 'Next 90 Days' },
  { value: 'expired', label: 'Expired' }
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'expiration', label: 'Expiration Date' },
  { value: 'cost', label: 'Cost' },
  { value: 'utilization', label: 'Utilization' }
];

export const LicenseFilters: React.FC<LicenseFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  sortBy,
  expirationFilter,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
  onExpirationChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
      <SearchInput 
        value={searchTerm}
        onChange={onSearchChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterSelect
          icon={Filter}
          value={typeFilter}
          onChange={onTypeChange}
          options={TYPE_OPTIONS}
          label="Filter by type"
        />

        <FilterSelect
          icon={Filter}
          value={statusFilter}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
          label="Filter by status"
        />
        
        <FilterSelect
          icon={Calendar}
          value={expirationFilter}
          onChange={onExpirationChange}
          options={EXPIRATION_OPTIONS}
          label="Filter by expiration"
        />

        <FilterSelect
          icon={SortAsc}
          value={sortBy}
          onChange={onSortChange}
          options={SORT_OPTIONS}
          label="Sort by"
        />
      </div>
    </div>
  );
};