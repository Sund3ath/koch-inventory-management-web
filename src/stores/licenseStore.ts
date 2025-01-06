import { create } from 'zustand';
import { licenseApi } from '../services/api/licenses';
import type { License } from '../types';

interface LicenseStore {
  licenses: License[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: License['status'] | 'all';
  typeFilter: 'all' | 'software' | 'hardware';
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: License['status'] | 'all') => void;
  setTypeFilter: (type: 'all' | 'software' | 'hardware') => void;
  fetchLicenses: () => Promise<void>;
  addLicense: (license: Omit<License, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLicense: (id: string, license: Partial<License>) => Promise<void>;
  assignToEmployee: (licenseId: string, employeeId: string) => Promise<void>;
  unassignLicense: (assignmentId: string) => Promise<void>;
  getFilteredLicenses: () => License[];
}

export const useLicenseStore = create<LicenseStore>((set, get) => ({
  licenses: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  statusFilter: 'all',
  typeFilter: 'all',

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setStatusFilter: (status: License['status'] | 'all') => set({ statusFilter: status }),
  setTypeFilter: (type: 'all' | 'software' | 'hardware') => set({ typeFilter: type }),

  fetchLicenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const licenses = await licenseApi.getAll();
      set({ licenses, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch licenses';
      set({ error: message, isLoading: false });
    }
  },

  addLicense: async (license) => {
    try {
      await licenseApi.create(license);
      await get().fetchLicenses();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add license';
      set({ error: message });
      throw error;
    }
  },

  updateLicense: async (id, license) => {
    try {
      await licenseApi.update(id, license);
      await get().fetchLicenses();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update license';
      set({ error: message });
      throw error;
    }
  },

  assignToEmployee: async (licenseId, employeeId) => {
    try {
      await licenseApi.assignToEmployee(licenseId, employeeId);
      await get().fetchLicenses(); // Refresh licenses after assignment
    } catch (error) {
      console.error('Failed to assign license:', error);
      const message = error instanceof Error ? error.message : 'Failed to assign license';
      set({ error: message });
      throw error;
    }
  },

  unassignLicense: async (assignmentId) => {
    try {
      await licenseApi.unassignLicense(assignmentId);
      await get().fetchLicenses(); // Refresh licenses after unassignment
    } catch (error) {
      console.error('Failed to unassign license:', error);
      const message = error instanceof Error ? error.message : 'Failed to unassign license';
      set({ error: message });
      throw error;
    }
  },

  getFilteredLicenses: () => {
    const { licenses, searchTerm, statusFilter, typeFilter } = get();
    return licenses.filter(license => {
      const matchesSearch = 
        license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
      const matchesType = typeFilter === 'all' || license.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }
}));