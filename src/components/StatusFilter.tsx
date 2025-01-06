import React from 'react';
import { Filter } from 'lucide-react';
import { Device } from '../types';

interface StatusFilterProps {
  value: Device['status'] | 'all';
  onChange: (value: Device['status'] | 'all') => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="h-5 w-5 text-gray-400" />
      <select
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={value}
        onChange={(e) => onChange(e.target.value as Device['status'] | 'all')}
      >
        <option value="all">All Status</option>
        <option value="assigned">Assigned</option>
        <option value="available">Available</option>
        <option value="maintenance">Maintenance</option>
        <option value="retired">Retired</option>
      </select>
    </div>
  );
};