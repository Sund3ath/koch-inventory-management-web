import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export const TranslationManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const translations = [
    { key: 'common.save', en: 'Save', es: 'Guardar', fr: 'Sauvegarder' },
    { key: 'common.cancel', en: 'Cancel', es: 'Cancelar', fr: 'Annuler' },
    { key: 'common.delete', en: 'Delete', es: 'Eliminar', fr: 'Supprimer' },
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search translations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Key
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                English
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spanish
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                French
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {translations.map((translation) => (
              <tr key={translation.key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {translation.key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {translation.en}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {translation.es}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {translation.fr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};