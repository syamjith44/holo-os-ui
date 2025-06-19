import { create } from 'zustand';
import type { SystemMetrics } from '@shared/schema';

interface SystemStore {
  metrics: SystemMetrics | null;
  isLoading: boolean;
  lastUpdated: Date | null;
  
  // Actions
  setMetrics: (metrics: SystemMetrics) => void;
  setLoading: (loading: boolean) => void;
  updateLastUpdated: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  metrics: null,
  isLoading: false,
  lastUpdated: null,

  setMetrics: (metrics) => {
    set({ metrics, lastUpdated: new Date() });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  updateLastUpdated: () => {
    set({ lastUpdated: new Date() });
  },
}));
