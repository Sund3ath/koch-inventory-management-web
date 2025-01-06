import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 ${
          view === 'grid'
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-500 hover:text-indigo-600'
        }`}
        title="Grid view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 ${
          view === 'list'
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-500 hover:text-indigo-600'
        }`}
        title="List view"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
};