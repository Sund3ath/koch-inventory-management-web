import { create } from 'zustand';
import { vendorApi } from '../services/api/vendors';
import type { Vendor } from '../types';

interface VendorStore {
  vendors: Vendor[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  categoryFilter: string;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  fetchVendors: () => Promise<void>;
  createVendor: (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateVendor: (id: string, vendor: Partial<Vendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  getFilteredVendors: () => Vendor[];
}

export const useVendorStore = create<VendorStore>((set, get) => ({
  vendors: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  categoryFilter: 'all',

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setCategoryFilter: (category: string) => set({ categoryFilter: category }),

  fetchVendors: async () => {
    set({ isLoading: true, error: null });
    try {
      const vendors = await vendorApi.getAll();
      set({ vendors, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch vendors';
      set({ error: message, isLoading: false });
    }
  },

  createVendor: async (vendor) => {
    try {
      await vendorApi.create(vendor);
      await get().fetchVendors();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create vendor';
      set({ error: message });
      throw error;
    }
  },

  updateVendor: async (id, vendor) => {
    try {
      await vendorApi.update(id, vendor);
      await get().fetchVendors();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update vendor';
      set({ error: message });
      throw error;
    }
  },

  deleteVendor: async (id) => {
    try {
      await vendorApi.delete(id);
      await get().fetchVendors();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete vendor';
      set({ error: message });
      throw error;
    }
  },

  getFilteredVendors: () => {
    const { vendors, searchTerm, categoryFilter } = get();
    return vendors.filter(vendor => {
      const matchesSearch = 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }
}));