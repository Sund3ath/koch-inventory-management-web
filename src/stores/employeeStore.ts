import { create } from 'zustand';
import { Employee } from '../types';
import { employeeApi } from '../services/api/employees';
import type { Database } from '../lib/supabase/types';

type Department = Database['public']['Tables']['departments']['Row'];

interface EmployeeStore {
  employees: Employee[];
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  departmentFilter: string;
  setSearchTerm: (term: string) => void;
  setDepartmentFilter: (department: string) => void;
  fetchEmployees: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  getFilteredEmployees: () => Employee[];
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  departments: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  departmentFilter: 'all',

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setDepartmentFilter: (department: string) => {
    set({ departmentFilter: department });
  },

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const employees = await employeeApi.getAll();
      set({ employees, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch employees';
      set({ error: message, isLoading: false });
    }
  },

  fetchDepartments: async () => {
    try {
      const departments = await employeeApi.getDepartments();
      set({ departments });
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    try {
      const updatedEmployee = await employeeApi.update(id, data);
      const employees = get().employees.map(emp => 
        emp.id === id ? updatedEmployee : emp
      );
      set({ employees });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update employee');
    }
  },

  getFilteredEmployees: () => {
    const { employees, searchTerm, departmentFilter } = get();
    return employees.filter(employee => {
      const matchesSearch = 
        `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || employee.department.name === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    });
  }
}));