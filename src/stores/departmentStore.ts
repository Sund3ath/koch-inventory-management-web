import { create } from 'zustand';
import { departmentApi } from '../services/api/departments';

interface DepartmentHierarchyNode {
  id: string;
  name: string;
  manager?: {
    employee?: {
      first_name: string;
      last_name: string;
    };
  };
  children?: DepartmentHierarchyNode[];
}

interface Department {
  id: string;
  name: string;
  location: string | null;
  manager: {
    employee: {
      id: string;
      first_name: string;
      last_name: string;
    } | null;
  } | null;
  employees: { count: number };
  status: 'active' | 'inactive';
}

interface DepartmentStore {
  departments: Department[];
  hierarchy: DepartmentHierarchyNode[];
  isLoading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  fetchHierarchy: () => Promise<void>;
  createDepartment: (data: any) => Promise<void>;
  updateDepartment: (id: string, data: any) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  getActiveDepartments: () => Department[];
}

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
  departments: [],
  hierarchy: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    set({ isLoading: true, error: null });
    try {
      const departments = await departmentApi.getAll();
      set({ departments, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch departments';
      set({ error: message, isLoading: false });
    }
  },

  fetchHierarchy: async () => {
    try {
      const hierarchy = await departmentApi.getHierarchy();
      set({ hierarchy });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch department hierarchy';
      set({ error: message });
    }
  },

  createDepartment: async (data) => {
    try {
      await departmentApi.create(data);
      await get().fetchDepartments();
      await get().fetchHierarchy();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create department';
      set({ error: message });
      throw error;
    }
  },

  updateDepartment: async (id, data) => {
    try {
      await departmentApi.update(id, data);
      await get().fetchDepartments();
      await get().fetchHierarchy();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update department';
      set({ error: message });
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      await departmentApi.delete(id);
      await get().fetchDepartments();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete department';
      set({ error: message });
      throw error;
    }
  },

  getActiveDepartments: () => {
    return get().departments
      .filter(dept => dept.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}));