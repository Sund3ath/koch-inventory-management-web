import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Employee = Database['public']['Tables']['employees']['Row'];
type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
type EmployeeUpdate = Database['public']['Tables']['employees']['Update'];

export const employeeApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        department:departments!employees_department_id_fkey(
          id,
          name
        ),
        devices:device_assignments!employee_id(
          device:devices(*)
        )
      `)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async create(employee: EmployeeInsert) {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select(`
        *,
        department:departments!employees_department_id_fkey(
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, employee: EmployeeUpdate) {
    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select(`
        *,
        department:departments!employees_department_id_fkey(
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }
};