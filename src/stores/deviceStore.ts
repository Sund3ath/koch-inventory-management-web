import { create } from 'zustand';
import { Device } from '../types';
import { deviceApi } from '../services/api/devices';
import { supabase } from '../lib/supabase/client';

interface DeviceStore {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: Device['status'] | 'all';
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: Device['status'] | 'all') => void;
  fetchDevices: () => Promise<void>;
  assignDevice: (deviceId: string, employeeId: string) => Promise<void>;
  unassignDevice: (deviceId: string) => Promise<void>;
  createBulkDevices: (devices: ProcessedDeviceData[]) => Promise<void>;
  getFilteredDevices: () => Device[];
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  statusFilter: 'all',

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setStatusFilter: (status: Device['status'] | 'all') => set({ statusFilter: status }),

  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const devices = await deviceApi.getAll();
      set({ devices, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch devices';
      set({ error: message, isLoading: false });
    }
  },

  assignDevice: async (deviceId: string, employeeId: string) => {
    try {
      console.log('Store: Starting device assignment', { deviceId, employeeId });
      const user = await supabase.auth.getUser();
      console.log('Current user:', user.data.user);

      const { data, error } = await supabase.rpc('assign_device', {
        p_device_id: deviceId,
        p_employee_id: employeeId,
        p_assigned_by: user.data.user?.id
      });

      console.log('Assignment response:', { data, error });
      if (error) throw error;
      console.log('Assignment successful, refreshing devices');
      await get().fetchDevices(); // Refresh devices after assignment
    } catch (error) {
      console.error('Store: Assignment failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to assign device';
      set({ error: message });
      throw error;
    }
  },

  unassignDevice: async (deviceId: string) => {
    try {
      await deviceApi.unassignDevice(deviceId);
      await get().fetchDevices(); // Refresh devices after unassignment
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unassign device';
      set({ error: message });
      throw error;
    }
  },

  createBulkDevices: async (devices: ProcessedDeviceData[]) => {
    try {
      const data = await deviceApi.createBulkDevices(devices);
      await get().fetchDevices();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create devices';
      set({ error: message });
      throw error;
    }
  },

  getFilteredDevices: () => {
    const { devices, searchTerm, statusFilter } = get();
    return devices.filter(device => {
      const matchesSearch = 
        device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }
}));