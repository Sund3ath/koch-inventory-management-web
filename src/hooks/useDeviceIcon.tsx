import { Laptop, Smartphone, Tablet, Monitor, Package } from 'lucide-react';
import { Device } from '../types';

export const useDeviceIcon = (type: Device['type']) => {
  switch (type) {
    case 'laptop':
      return <Laptop className="w-6 h-6" />;
    case 'phone':
      return <Smartphone className="w-6 h-6" />;
    case 'tablet':
      return <Tablet className="w-6 h-6" />;
    case 'monitor':
      return <Monitor className="w-6 h-6" />;
    default:
      return <Package className="w-6 h-6" />;
  }
};