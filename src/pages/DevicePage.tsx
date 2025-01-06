import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { DeviceListView } from '../components/device/views/DeviceListView';
import { SearchBar } from '../components/SearchBar';
import { StatusFilter } from '../components/StatusFilter';
import { DeviceModal } from '../components/device/modal/DeviceModal';
import { useDeviceStore } from '../stores/deviceStore';

export const DevicePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    devices,
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-600">
            <p>Error loading devices: {error}</p>
            <button 
              onClick={() => fetchDevices()}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container-fluid px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Device Inventory</h2>
            <p className="mt-1 text-sm text-gray-500">Manage and track all company devices</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Device
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        </div>

        <DeviceListView devices={filteredDevices} />
        
        <DeviceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  );
};