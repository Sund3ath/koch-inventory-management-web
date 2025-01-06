import React from 'react';
import type { NotificationType } from '../../types/notification';

interface NotificationFiltersProps {
  currentFilter: NotificationType | undefined;
  onFilterChange: (filter: NotificationType | undefined) => void;
}

const FILTERS: { label: string; value: NotificationType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Devices', value: 'device_added' },
  { label: 'Employees', value: 'employee_added' },
  { label: 'Licenses', value: 'license_added' }
];

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({ 
  currentFilter, 
  onFilterChange 
}) => {
  return (
    <div className="flex space-x-2">
      {FILTERS.map(({ label, value }) => (
        <button
          key={label}
          onClick={() => onFilterChange(value)}
          className={`px-3 py-1 text-sm rounded-full ${
            currentFilter === value
              ? 'bg-indigo-100 text-indigo-800'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};