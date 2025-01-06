import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (range: [Date, Date]) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const [startDate, endDate] = value;

  return (
    <div className="flex items-center space-x-4">
      <Calendar className="h-5 w-5 text-gray-400" />
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={startDate.toISOString().split('T')[0]}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            onChange([newDate, endDate]);
          }}
          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate.toISOString().split('T')[0]}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            onChange([startDate, newDate]);
          }}
          className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};