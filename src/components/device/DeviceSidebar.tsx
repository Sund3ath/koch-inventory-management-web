import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useDeviceIcon } from '../../hooks/useDeviceIcon';
import { useStatusColor } from '../../hooks/useStatusColor';
import type { Device } from '../../types';
import { formatDate } from '../../utils/formatters';

interface DeviceSidebarProps {
  devices: Device[];
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const DeviceListItem: React.FC<{ device: Device }> = ({ device }) => {
  const icon = useDeviceIcon(device.type);
  const statusColor = useStatusColor(device.status);

  const handleDragStart = (e: React.DragEvent) => {
    console.log('Sidebar: Starting drag with device:', device);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(device));
    e.dataTransfer.setData('application/json', JSON.stringify(device));
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const isDraggable = device.status === 'available';

  return (
    <div 
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        flex items-center p-3 rounded-lg border border-gray-200
        ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:bg-gray-50' : 'opacity-50'}
      `}
    >
      <div className="flex-shrink-0 mr-3">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {device.brand} {device.model}
          </p>
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {device.status}
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          <p className="truncate">S/N: {device.serial_number}</p>
          <p className="truncate">Domain ID: {device.device_domain_id || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export const DeviceSidebar: React.FC<DeviceSidebarProps> = ({
  devices,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Devices</h2>
      
      <div className="space-y-4 mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search devices..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
        {devices.map((device) => (
          <DeviceListItem key={device.id} device={device} />
        ))}
        
        {devices.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4">
            No devices found
          </p>
        )}
      </div>
    </div>
  );
};