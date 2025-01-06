import { useState } from 'react';
import { Device } from '../../../types';

export const useDeviceDrag = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent, device: Device) => {
    e.dataTransfer.setData('device', JSON.stringify(device));
    e.currentTarget.classList.add('scale-105', 'shadow-lg');
    setIsDragging(true);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('scale-105', 'shadow-lg');
    setIsDragging(false);
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd
  };
};