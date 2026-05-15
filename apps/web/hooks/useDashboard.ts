'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import type { DataModule, FilterState } from '@/types';

export function useDashboard(module: DataModule) {
  const { filters, setFilter, resetFilters } = useDashboardStore();
  const currentFilters = filters[module];

  return {
    filters: currentFilters,
    setFilter: (update: Partial<FilterState>) => setFilter(module, update),
    resetFilters: () => resetFilters(module),
  };
}
