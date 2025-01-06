import { supabase } from '@/lib/supabase/client';

export interface SyncLog {
  id: string;
  status: 'success' | 'failed';
  type: 'users' | 'groups';
  items_processed: number;
  items_created: number;
  items_updated: number;
  items_failed: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
  performed_by: string;
}

export const azureSyncApi = {
  async getLogs() {
    const { data, error } = await supabase
      .from('azure_sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  async createLog(log: Omit<SyncLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('azure_sync_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};