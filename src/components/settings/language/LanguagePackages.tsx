import React from 'react';
import { Download, Upload, RefreshCw } from 'lucide-react';

export const LanguagePackages: React.FC = () => {
  const packages = [
    { 
      language: 'English',
      code: 'en',
      lastUpdated: '2024-01-15',
      status: 'up-to-date'
    },
    { 
      language: 'Spanish',
      code: 'es',
      lastUpdated: '2024-01-10',
      status: 'needs-update'
    },
    { 
      language: 'French',
      code: 'fr',
      lastUpdated: '2024-01-05',
      status: 'up-to-date'
    }
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-end space-x-4 mb-6">
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Upload className="h-5 w-5 mr-2" />
          Import Package
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Download className="h-5 w-5 mr-2" />
          Export All
        </button>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.code}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {pkg.language}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pkg.lastUpdated}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pkg.status === 'up-to-date' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pkg.status === 'up-to-date' ? 'Up to date' : 'Needs update'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};