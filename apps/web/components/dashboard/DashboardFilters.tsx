'use client';

import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterState } from '@/types';

interface Props {
  filters: FilterState;
  minYear?: number;
  maxYear?: number;
  showRegion?: boolean;
  regionLabels?: string[];
  onFilter: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

export function DashboardFilters({
  filters,
  minYear = 2015,
  maxYear = 2025,
  showRegion = false,
  regionLabels = ['All', 'National', 'Dublin'],
  onFilter,
  onReset,
}: Props) {
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const selectClass =
    'text-xs px-2.5 py-1.5 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer';

  return (
    <div className="flex items-center gap-3 flex-wrap p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
      <span className="text-xs font-semibold text-[var(--color-foreground-subtle)] uppercase tracking-wider">
        Filter
      </span>

      {/* Year range */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-foreground-muted)]">From</span>
        <select
          value={filters.startYear}
          onChange={(e) => onFilter({ startYear: Number(e.target.value) })}
          className={selectClass}
        >
          {years.filter((y) => y <= filters.endYear).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-foreground-muted)]">To</span>
        <select
          value={filters.endYear}
          onChange={(e) => onFilter({ endYear: Number(e.target.value) })}
          className={selectClass}
        >
          {years.filter((y) => y >= filters.startYear).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Region toggle */}
      {showRegion && (
        <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
          {regionLabels.map((label) => (
            <button
              key={label}
              onClick={() => onFilter({ county: label })}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                filters.county === label
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] transition-colors ml-auto"
      >
        <RotateCcw className="w-3 h-3" />
        Reset
      </button>
    </div>
  );
}
