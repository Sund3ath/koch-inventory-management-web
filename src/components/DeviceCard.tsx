import React from 'react';
import { Device } from '../types';
import { useDeviceIcon } from '../hooks/useDeviceIcon';
import { useStatusColor } from '../hooks/useStatusColor';
import { formatDate } from '../utils/formatters';

interface DeviceCardProps {
  device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const icon = useDeviceIcon(device.type);
  const statusColor = useStatusColor(device.status);
  const currentAssignment = device.assignments?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-lg font-semibold">{device.brand} {device.model}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {device.status}
        </span>
      </div>
      
      <div className="space-y-2 text-gray-600">
        <p><span className="font-medium">Serial:</span> {device.serial_number}</p>
        <p><span className="font-medium">Purchased:</span> {formatDate(device.purchase_date)}</p>
        
        {currentAssignment && (
          <div className="mt-4 pt-4 border-t">
            <p className="font-medium text-gray-700">Assigned to:</p>
            <p>{currentAssignment.employee.first_name} {currentAssignment.employee.last_name}</p>
            <p className="text-sm text-gray-500">{currentAssignment.employee.department.name}</p>
            <p className="text-xs text-gray-400 mt-1">
              Since {formatDate(currentAssignment.assigned_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};