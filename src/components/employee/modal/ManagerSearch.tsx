import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Manager } from '../../../types';

interface ManagerSearchProps {
  onSelect: (manager: Manager | null) => void;
  selectedManager: Manager | null;
}

export const ManagerSearch: React.FC<ManagerSearchProps> = ({ onSelect, selectedManager }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Manager[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchManagers = async (query: string) => {
    setIsSearching(true);
    try {
      // TODO: Implement manager search
      const mockResults = [
        {
          id: '1',
          name: 'Jane Smith',
          position: 'Engineering Manager',
          department: 'Engineering'
        }
      ];
      setResults(mockResults);
    } catch (error) {
      console.error('Error searching managers:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      {selectedManager ? (
        <div className="flex items-center justify-between p-2 border rounded-md">
          <div>
            <p className="text-sm font-medium">{selectedManager.name}</p>
            <p className="text-xs text-gray-500">{selectedManager.position}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search managers..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length >= 2) {
                searchManagers(e.target.value);
              }
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {isSearching && (
        <div className="text-sm text-gray-500">Searching...</div>
      )}

      {!selectedManager && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {results.map((manager) => (
            <li
              key={manager.id}
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
              onClick={() => {
                onSelect(manager);
                setQuery('');
                setResults([]);
              }}
            >
              <div className="flex items-center">
                <span className="font-normal block truncate">{manager.name}</span>
              </div>
              <span className="text-sm opacity-75 block truncate">
                {manager.position}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};