import { supabase } from '@/lib/supabase/client';
import type { Notification } from '../../types/notification';

export const notificationApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUnread() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .is('read_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async markAllAsRead() {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .is('read_at', null);

    if (error) throw error;
  }
};