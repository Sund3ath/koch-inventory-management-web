import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';

interface DashboardMetrics {
  devices: {
    total_devices: number;
    active_devices: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    recent_assignments: number;
  };
  licenses: {
    total_licenses: number;
    active_licenses: number;
    expiring_soon: number;
    total_cost: number;
    utilization: number;
  };
  employees: {
    total_employees: number;
    active_employees: number;
    by_department: Record<string, number>;
    new_hires: number;
    device_allocation: number;
  };
  departments: {
    total_departments: number;
    active_departments: number;
    avg_team_size: number;
    device_distribution: Record<string, number>;
  };
}

interface DashboardState {
  metrics: DashboardMetrics;
  isLoading: boolean;
  error: string | null;
  dateRange: [Date, Date];
  fetchDashboardData: () => Promise<void>;
  updateDateRange: (range: [Date, Date]) => void;
}

const initialMetrics: DashboardMetrics = {
  devices: {
    total_devices: 0,
    active_devices: 0,
    by_type: {},
    by_status: {},
    recent_assignments: 0
  },
  licenses: {
    total_licenses: 0,
    active_licenses: 0,
    expiring_soon: 0,
    total_cost: 0,
    utilization: 0
  },
  employees: {
    total_employees: 0,
    active_employees: 0,
    by_department: {},
    new_hires: 0,
    device_allocation: 0
  },
  departments: {
    total_departments: 0,
    active_departments: 0,
    avg_team_size: 0,
    device_distribution: {}
  }
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  metrics: initialMetrics,
  isLoading: false,
  error: null,
  dateRange: [
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  ],

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [startDate, endDate] = get().dateRange;

      const { data, error } = await supabase.rpc('get_dashboard_metrics', {
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString()
      });

      if (error) throw error;

      set({ 
        metrics: data || initialMetrics,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        isLoading: false,
        metrics: initialMetrics
      });
    }
  },

  updateDateRange: (range: [Date, Date]) => {
    set({ dateRange: range });
    get().fetchDashboardData();
  }
}));