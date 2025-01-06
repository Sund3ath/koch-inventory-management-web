import React from 'react';
import { Trash2, History, Tool } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';
import type { Device } from '../../../types';
import { useDeviceIcon } from '../../../hooks/useDeviceIcon';
import { useStatusColor } from '../../../hooks/useStatusColor';
import { useDeviceStore } from '../../../stores/deviceStore';
import { DeviceHistoryModal } from '../modal/DeviceHistoryModal';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

interface TimelineEvent {
  event_date: string;
  event_type: string;
  details: any;
  notes: string | null;
  performed_by_name: string;
}

interface DeviceListViewProps {
  devices: Device[];
}

export const DeviceListView: React.FC<DeviceListViewProps> = ({ devices }) => {
  const { unassignDevice } = useDeviceStore();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnassign = async (deviceId: string) => {
    try {
      await unassignDevice(deviceId);
    } catch (error) {
      console.error('Failed to unassign device:', error);
    }
  };

  const handleViewHistory = async (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_device_timeline', { p_device_id: deviceId });
      
      if (error) throw error;
      setTimeline(data || []);
    } catch (error) {
      console.error('Error fetching device timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Device
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Serial Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Domain ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purchase Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              History
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {devices.map((device) => (
            <DeviceListItem 
              key={device.id} 
              device={device} 
              onUnassign={handleUnassign} 
              onViewHistory={handleViewHistory} 
            />
          ))}
        </tbody>
      </table>
      
      <DeviceHistoryModal
        isOpen={!!selectedDeviceId}
        onClose={() => setSelectedDeviceId(null)}
        deviceId={selectedDeviceId || ''}
        timeline={timeline}
        isLoading={isLoading}
      />
    </div>
  );
};

const DeviceListItem: React.FC<{ 
  device: Device; 
  onUnassign: (deviceId: string) => void;
  onViewHistory: (deviceId: string) => void;
}> = ({ device, onUnassign, onViewHistory }) => {
  const icon = useDeviceIcon(device.type);
  const statusColor = useStatusColor(device.status);
  const currentAssignment = device.assignments?.find(a => device.status === 'assigned');

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
            {icon}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {device.brand} {device.model}
            </div>
            <div className="text-sm text-gray-500">{device.type}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {device.serial_number}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {device.device_domain_id || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
          {device.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(device.purchase_date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onViewHistory(device.id)}
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <History className="h-4 w-4 mr-1" />
          View History
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {currentAssignment ? (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {currentAssignment.employee.first_name} {currentAssignment.employee.last_name}
            </div>
            <div className="text-gray-500">
              {currentAssignment.employee.department.name}
            </div>
            <div className="text-xs text-gray-400">
              Since {formatDate(currentAssignment.assigned_at)}
            </div>
            {device.status === 'assigned' && (
              <button
                onClick={() => onUnassign(device.id)}
                className="mt-1 text-red-600 hover:text-red-700 text-xs flex items-center"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Unassign
              </button>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        )}
      </td>
    </tr>
  );
};