import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DataModule, FilterState } from '@/types';

interface DashboardState {
  activeModule: DataModule;
  filters: Record<DataModule, FilterState>;
  setActiveModule: (module: DataModule) => void;
  setFilter: (module: DataModule, filter: Partial<FilterState>) => void;
  resetFilters: (module: DataModule) => void;
}

const DEFAULT_FILTERS: FilterState = {
  county: 'All',
  startYear: 2014,
  endYear: 2026,
  chartType: 'line',
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      activeModule: 'housing',
      filters: {
        housing: { ...DEFAULT_FILTERS },
        employment: { ...DEFAULT_FILTERS },
        weather: { ...DEFAULT_FILTERS, chartType: 'bar' },
      },
      setActiveModule: (module) => set({ activeModule: module }),
      setFilter: (module, filter) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [module]: { ...state.filters[module], ...filter },
          },
        })),
      resetFilters: (module) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [module]: { ...DEFAULT_FILTERS },
          },
        })),
    }),
    {
      name: 'leargas-dashboard-v2',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
