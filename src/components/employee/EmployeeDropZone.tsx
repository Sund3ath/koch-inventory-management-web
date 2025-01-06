import React, { useState } from 'react';
import { useDeviceStore } from '../../stores/deviceStore';
import type { Device } from '../../types';

interface EmployeeDropZoneProps {
  employee: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export const EmployeeDropZone: React.FC<EmployeeDropZoneProps> = ({ employee }) => {
  const [isOver, setIsOver] = useState(false);
  const { assignDevice } = useDeviceStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    try {
      let deviceData = e.dataTransfer.getData('text/plain');
      if (!deviceData) {
        deviceData = e.dataTransfer.getData('application/json');
      }
      console.log('Device data received:', deviceData);
      
      if (deviceData) {
        const device = JSON.parse(deviceData) as Device;
        console.log('Parsed device:', device);
        if (device && device.id && employee.id) {
          console.log('Assigning device to employee:', { deviceId: device.id, employeeId: employee.id });
          await assignDevice(device.id, employee.id);
        } else {
          console.error('Invalid device or employee data:', { device, employee });
        }
      }
    } catch (error) {
      console.error('Error assigning device:', error);
    }
  };


  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        mt-2 p-4 rounded-lg border-2 border-dashed transition-all duration-200
        ${isOver 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-300 hover:border-indigo-300'
        }
      `}
    >
      <div className="text-center">
        <p className="text-sm text-gray-500">
          {isOver ? 'Drop to assign device' : 'Drag device here to assign'}
        </p>
      </div>
    </div>
  );
};