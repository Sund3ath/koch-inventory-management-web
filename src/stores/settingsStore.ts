import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';

interface SettingsState {
  isLoading: boolean;
  error: string | null;
  departments: any[];
  vendors: any[];
  azureConfig: any;
  languageConfig: any;
  fetchSettings: () => Promise<void>;
  updateSettings: (section: string, data: any) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isLoading: false,
  error: null,
  departments: [],
  vendors: [],
  azureConfig: null,
  languageConfig: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const [
        { data: departments },
        { data: vendors },
        { data: azureConfig },
        { data: languageConfig }
      ] = await Promise.all([
        supabase.from('departments').select('*'),
        supabase.from('vendors').select('*'),
        supabase.from('settings').select('*').eq('type', 'azure').single(),
        supabase.from('settings').select('*').eq('type', 'language').single()
      ]);

      set({
        departments: departments || [],
        vendors: vendors || [],
        azureConfig: azureConfig || null,
        languageConfig: languageConfig || null,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load settings',
        isLoading: false 
      });
    }
  },

  updateSettings: async (section: string, data: any) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ type: section, data });

      if (error) throw error;
      await get().fetchSettings();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update settings');
    }
  }
}));