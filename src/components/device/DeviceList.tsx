import React from 'react';
import { Device } from '../../types';
import { DeviceCard } from './DeviceCard';

interface DeviceListProps {
  devices: Device[];
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices }) => {
  const handleDragStart = (e: React.DragEvent, device: Device) => {
    console.log('Starting drag with device:', device);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(device));
    // Set a backup copy of the data
    e.dataTransfer.setData('application/json', JSON.stringify(device));
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const isDraggable = (device: Device) => {
    return device.status === 'available';
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {devices.map(device => (
        <div
          key={device.id}
          draggable={isDraggable(device)}
          onDragStart={(e) => handleDragStart(e, device)}
          onDragEnd={handleDragEnd}
          className={`transition-transform duration-300 ease-out ${
            isDraggable(device)
              ? 'cursor-grab active:cursor-grabbing' 
              : 'opacity-50'
          }`}
        >
          <DeviceCard device={device} />
        </div>
      ))}

      {devices.length === 0 && (
        <p className="text-center text-gray-500 py-4">No devices found matching your criteria</p>
      )}
    </div>
  );
};