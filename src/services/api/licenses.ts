import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { License } from '../../types';

export const licenseApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('licenses')
      .select(`
        *,
        assignments:license_assignments!license_id(
          id,
          assigned_at,
          employee:employees!employee_id(
            id,
            first_name,
            last_name,
            department:departments!department_id(
              name
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async assignToEmployee(licenseId: string, employeeId: string) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase.rpc('assign_license', {
      p_license_id: licenseId,
      p_employee_id: employeeId,
      p_assigned_by: userData.user.id
    });

    if (error) throw error;
    return data;
  },

  async unassignLicense(assignmentId: string) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase.rpc('unassign_license', {
      p_assignment_id: assignmentId,
      p_performed_by: userData.user.id
    });

    if (error) throw error;
    return data;
  },

  async create(license: Omit<License, 'id' | 'created_at' | 'updated_at'>) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase.rpc('add_license', {
      p_name: license.name,
      p_vendor: license.vendor,
      p_type: license.type,
      p_key: license.key,
      p_total_quantity: license.total_quantity,
      p_purchase_date: license.purchase_date,
      p_expiration_date: license.expiration_date,
      p_cost: license.cost,
      p_notes: license.notes,
      p_created_by: userData.user.id
    });

    if (error) throw error;
    return data;
  },

  async update(id: string, license: Partial<License>) {
    const { data, error } = await supabase.rpc('update_license', {
      p_license_id: id,
      p_name: license.name,
      p_vendor: license.vendor,
      p_type: license.type,
      p_key: license.key,
      p_total_quantity: license.total_quantity,
      p_purchase_date: license.purchase_date,
      p_expiration_date: license.expiration_date,
      p_cost: license.cost,
      p_notes: license.notes
    });

    if (error) throw error;
    return data;
  }
};