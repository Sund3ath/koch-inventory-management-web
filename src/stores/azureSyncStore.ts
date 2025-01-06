import { create } from 'zustand';
import { azureSyncApi, SyncLog } from '../services/api/azureSync';

interface AzureSyncStore {
  logs: SyncLog[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  createLog: (log: Omit<SyncLog, 'id' | 'created_at'>) => Promise<void>;
}

export const useAzureSyncStore = create<AzureSyncStore>((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const logs = await azureSyncApi.getLogs();
      set({ logs, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sync logs';
      set({ error: message, isLoading: false });
    }
  },

  createLog: async (log) => {
    try {
      await azureSyncApi.createLog(log);
      await get().fetchLogs();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create sync log';
      set({ error: message });
      throw error;
    }
  }
}));