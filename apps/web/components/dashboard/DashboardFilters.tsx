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
    'text-xs px-2.5 py-1.5 bg-[var(--color-ground)] border border-[var(--color-graticule)] text-[var(--color-ink)] font-mono tracking-wide focus:outline-none focus:border-[var(--color-atlantic)] transition-colors cursor-pointer';

  return (
    <div className="survey-frame flex flex-wrap items-center gap-3 bg-[var(--color-surface)] p-4">
      <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--color-ink-soft)]">
        FILTER
      </span>

      {/* Year range */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-[var(--color-ink-soft)]">From</span>
        <select
          value={filters.startYear}
          onChange={(e) => onFilter({ startYear: Number(e.target.value) })}
          className={selectClass}
          style={{ borderRadius: '2px' }}
        >
          {years
            .filter((y) => y <= filters.endYear)
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-[var(--color-ink-soft)]">To</span>
        <select
          value={filters.endYear}
          onChange={(e) => onFilter({ endYear: Number(e.target.value) })}
          className={selectClass}
          style={{ borderRadius: '2px' }}
        >
          {years
            .filter((y) => y >= filters.startYear)
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
        </select>
      </div>

      {/* Region toggle */}
      {showRegion && (
        <div
          className="flex overflow-hidden border border-[var(--color-graticule)]"
          style={{ borderRadius: '2px' }}
        >
          {regionLabels.map((label) => (
            <button
              key={label}
              onClick={() => onFilter({ county: label })}
              className={cn(
                'px-3 py-1.5 font-mono text-[10px] tracking-wide transition-colors',
                filters.county === label
                  ? 'bg-[var(--color-atlantic)] text-[var(--color-ground)]'
                  : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-ground-shade)] hover:text-[var(--color-ink)]'
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
        className="ml-auto flex items-center gap-1.5 text-xs text-[var(--color-foreground-subtle)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <RotateCcw className="h-3 w-3" />
        Reset
      </button>
    </div>
  );
}
