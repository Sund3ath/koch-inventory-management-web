import React from 'react';
import { X, Check } from 'lucide-react';
import { Device, Employee } from '../../types';
import { useDeviceStore } from '../../stores/deviceStore';

interface AssignmentConfirmationModalProps {
  device: Device;
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignmentConfirmationModal: React.FC<AssignmentConfirmationModalProps> = ({
  device,
  employee,
  isOpen,
  onClose
}) => {
  const { assignDevice } = useDeviceStore();

  const handleConfirm = async () => {
    try {
      await assignDevice(device.id, employee.id);
      onClose();
    } catch (error) {
      console.error('Error assigning device:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all pop-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Confirm Device Assignment
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to assign this device to {employee.name}?
            </p>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">Device Details</h4>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900">{device.type}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Model</dt>
                  <dd className="text-sm text-gray-900">{device.brand} {device.model}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Serial Number</dt>
                  <dd className="text-sm text-gray-900">{device.serialNumber}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};