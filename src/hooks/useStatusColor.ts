import { Device } from '../types';

export const useStatusColor = (status: Device['status']) => {
  switch (status) {
    case 'assigned':
      return 'bg-green-100 text-green-800';
    case 'available':
      return 'bg-blue-100 text-blue-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    case 'retired':
      return 'bg-red-100 text-red-800';
  }
};