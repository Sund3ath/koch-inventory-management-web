import { supabase } from '@/lib/supabase/client';
import type { Vendor } from '../../types';

export const vendorApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async create(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('vendors')
      .insert({
        ...vendor,
        created_by: userData.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, vendor: Partial<Vendor>) {
    const { data, error } = await supabase
      .from('vendors')
      .update(vendor)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};