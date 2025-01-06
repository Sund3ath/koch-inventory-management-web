import React from 'react';
import { Filter, SortAsc } from 'lucide-react';
import { SearchInput } from '../SearchInput';
import { FilterSelect } from '../FilterSelect';
import { useDepartmentStore } from '../../stores/departmentStore';

interface EmployeeFiltersProps {
  searchTerm: string;
  departmentFilter: string;
  statusFilter: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'department', label: 'Department' },
  { value: 'hireDate', label: 'Hire Date' }
];

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchTerm,
  departmentFilter,
  statusFilter,
  sortBy,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onSortChange
}) => {
  const { departments } = useDepartmentStore();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
      <SearchInput 
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search employees..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FilterSelect
          icon={Filter}
          value={statusFilter}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
          label="Filter by status"
        />

        <FilterSelect
          icon={Filter}
          value={departmentFilter}
          onChange={onDepartmentChange}
          options={[
            { value: 'all', label: 'All Departments' },
            ...departments.map(dept => ({
              value: dept.id,
              label: dept.name
            }))
          ]}
          label="Filter by department"
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