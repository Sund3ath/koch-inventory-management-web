import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Device = Database['public']['Tables']['devices']['Row'];

export const deviceApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        assignments:device_assignments!device_id(
          id,
          assigned_at,
          employee:employees!employee_id(
            id,
            first_name,
            last_name,
            department:departments!employees_department_id_fkey(
              name
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createBulkDevices(devices: ProcessedDeviceData[]) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    // Start a Supabase transaction
    const { data, error } = await supabase.rpc('create_bulk_devices', {
      p_devices: devices.map(device => ({
        ...device,
        created_by: userData.user.id,
        purchase_date: new Date().toISOString()
      }))
    });

    if (error) throw error;
    return data;
  },

  async unassignDevice(deviceId: string) {
    console.log('API: Unassigning device:', deviceId);
    const { data, error } = await supabase.rpc('unassign_device', {
      p_device_id: deviceId
    });

    if (error) {
      console.error('API: Error unassigning device:', error);
      throw error;
    }
    console.log('API: Device unassigned successfully:', data);
    return data;
  },

  async assignToEmployee(deviceId: string, employeeId: string) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    // Start device usage log
    await supabase.rpc('log_device_usage', {
      p_device_id: deviceId,
      p_user_id: userData.user.id,
      p_notes: `Device assigned to employee ${employeeId}`
    });

    const { data, error } = await supabase.rpc('assign_device', {
      p_device_id: deviceId,
      p_employee_id: employeeId
    });

    if (error) throw error;
    return data;
  }
};