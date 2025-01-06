import React from 'react';
import { Filter } from 'lucide-react';
import { useDepartmentStore } from '../../stores/departmentStore';

interface DepartmentFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const DepartmentFilter: React.FC<DepartmentFilterProps> = ({ 
  value, 
  onChange
}) => {
  const { departments, getActiveDepartments } = useDepartmentStore();
  const activeDepartments = getActiveDepartments();

  return (
    <div className="flex items-center space-x-2">
      <Filter className="h-5 w-5 text-gray-400" />
      <select
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Departments</option>
        {activeDepartments.map(dept => (
          <option key={dept.id} value={dept.name}>
            {dept.name}
          </option>
        ))}
      </select>
    </div>
  );
};