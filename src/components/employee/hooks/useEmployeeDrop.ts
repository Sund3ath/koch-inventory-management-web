import { useState } from 'react';
import { Employee, Device } from '../../../types';
import { useDeviceStore } from '../../../stores/deviceStore';

export const useEmployeeDrop = (employee: Employee) => {
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
    
    const deviceData = e.dataTransfer.getData('device');
    if (deviceData) {
      const device = JSON.parse(deviceData) as Device;
      await assignDevice(device.id, employee.id);
    }
  };

  return {
    isOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};