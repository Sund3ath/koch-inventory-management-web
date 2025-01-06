import React from 'react';
import { Clock } from 'lucide-react';

export const SyncScheduler: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sync Frequency
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue="daily"
          >
            <option value="hourly">Every Hour</option>
            <option value="daily">Once Daily</option>
            <option value="weekly">Once Weekly</option>
            <option value="manual">Manual Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Time
          </label>
          <input
            type="time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue="00:00"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Last sync: 2 hours ago</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sync Now
          </button>
        </div>
      </div>
    </div>
  );
};