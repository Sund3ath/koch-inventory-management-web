import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ActiveDirectorySearchProps {
  onSelect: (employee: any) => void;
}

export const ActiveDirectorySearch: React.FC<ActiveDirectorySearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchAD = async (query: string) => {
    setIsSearching(true);
    try {
      // TODO: Implement AD search
      const mockResults = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          department: 'Engineering',
          position: 'Senior Developer'
        }
      ];
      setResults(mockResults);
    } catch (error) {
      console.error('Error searching AD:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search Active Directory..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 3) {
              searchAD(e.target.value);
            }
          }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {isSearching && (
        <div className="text-sm text-gray-500">Searching...</div>
      )}

      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-gray-200 max-h-60 overflow-auto">
          {results.map((result) => (
            <li
              key={result.id}
              className="py-2 px-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(result)}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {result.firstName} {result.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{result.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {result.department}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};