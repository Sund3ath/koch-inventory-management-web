import React, { useEffect } from 'react';
import { SearchBar } from '../SearchBar';
import { StatusFilter } from '../StatusFilter';
import { DeviceList } from './DeviceList';
import { useDeviceStore } from '../../stores/deviceStore';

export const DevicePool: React.FC = () => {
  const { 
    searchTerm, 
    statusFilter, 
    setSearchTerm, 
    setStatusFilter,
    fetchDevices,
    getFilteredDevices,
    isLoading,
    error
  } = useDeviceStore();
  
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const filteredDevices = getFilteredDevices();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600">
          <p>Error loading devices: {error}</p>
          <button 
            onClick={() => fetchDevices()}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Available Devices</h2>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      <DeviceList devices={filteredDevices} />
    </div>
  );
};