import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FilterSelectProps {
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  label?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  icon: Icon,
  value,
  onChange,
  options,
  label
}) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Icon className="h-5 w-5 text-gray-400" />
      <select
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};