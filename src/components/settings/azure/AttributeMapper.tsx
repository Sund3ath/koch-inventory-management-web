import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Mapping {
  azure: string;
  system: string;
}

export const AttributeMapper: React.FC = () => {
  const [mappings, setMappings] = useState<Mapping[]>([
    { azure: 'userPrincipalName', system: 'email' },
    { azure: 'givenName', system: 'firstName' },
    { azure: 'surname', system: 'lastName' },
    { azure: 'department', system: 'departmentName' }
  ]);

  const handleMappingChange = (index: number, field: keyof Mapping, value: string) => {
    const newMappings = [...mappings];
    newMappings[index][field] = value;
    setMappings(newMappings);
  };

  const addMapping = () => {
    setMappings([...mappings, { azure: '', system: '' }]);
  };

  const removeMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving mappings:', mappings);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-900">Attribute Mappings</h4>
          <button 
            onClick={addMapping}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Mapping
          </button>
        </div>

        <div className="space-y-2">
          {mappings.map((mapping, index) => (
            <div key={index} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md">
              <div className="flex-1">
                <input
                  type="text"
                  value={mapping.azure}
                  onChange={(e) => handleMappingChange(index, 'azure', e.target.value)}
                  placeholder="Azure AD attribute"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="text-gray-500">→</div>
              <div className="flex-1">
                <input
                  type="text"
                  value={mapping.system}
                  onChange={(e) => handleMappingChange(index, 'system', e.target.value)}
                  placeholder="System field"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button 
                onClick={() => removeMapping(index)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Mappings
          </button>
        </div>
      </div>
    </div>
  );
};