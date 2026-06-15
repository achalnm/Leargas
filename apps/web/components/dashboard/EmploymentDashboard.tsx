'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { downloadCsv } from '@/lib/utils';
import { SaveDashboardButton } from './SaveDashboardButton';
import { DashboardFilters } from './DashboardFilters';
import { useDashboard } from '@/hooks/useDashboard';
import type { EmploymentDataPoint } from '@/types';

const PLACEHOLDER_DATA: EmploymentDataPoint[] = [
  { year: 2015, quarter: 'Q1', unemploymentRate: 9.8, euAverageRate: 10.2 },
  { year: 2016, quarter: 'Q1', unemploymentRate: 8.1, euAverageRate: 9.6 },
  { year: 2017, quarter: 'Q1', unemploymentRate: 6.4, euAverageRate: 8.8 },
  { year: 2018, quarter: 'Q1', unemploymentRate: 5.5, euAverageRate: 8.2 },
  { year: 2019, quarter: 'Q1', unemploymentRate: 4.7, euAverageRate: 7.6 },
  { year: 2020, quarter: 'Q1', unemploymentRate: 5.9, euAverageRate: 8.1 },
  { year: 2021, quarter: 'Q1', unemploymentRate: 7.8, euAverageRate: 8.4 },
  { year: 2022, quarter: 'Q1', unemploymentRate: 5.5, euAverageRate: 7.2 },
  { year: 2023, quarter: 'Q1', unemploymentRate: 4.5, euAverageRate: 6.8 },
  { year: 2024, quarter: 'Q1', unemploymentRate: 4.4, euAverageRate: 6.5 },
  { year: 2025, quarter: 'Q1', unemploymentRate: 4.2, euAverageRate: 6.3 },
];

const SECTOR_DATA = [
  { sector: 'Services', employedThousands: 1620 },
  { sector: 'Industry', employedThousands: 380 },
  { sector: 'Construction', employedThousands: 180 },
  { sector: 'Agriculture', employedThousands: 95 },
  { sector: 'Public Admin', employedThousands: 175 },
];

function collapseToAnnual(records: EmploymentDataPoint[]): EmploymentDataPoint[] {
  const byYear = new Map<number, EmploymentDataPoint>();
  for (const r of records) {
    const existing = byYear.get(r.year);
    if (!existing || (r.quarter ?? '') > (existing.quarter ?? '')) {
      byYear.set(r.year, r);
    }
  }
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

export function EmploymentDashboard() {
  const [rawData, setRawData] = useState<EmploymentDataPoint[]>(PLACEHOLDER_DATA);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { filters, setFilter, resetFilters } = useDashboard('employment');

  useEffect(() => {
    fetch('/api/data/employment')
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.length > 0) setRawData(json.data);
        if (json.lastUpdated) setLastUpdated(json.lastUpdated);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allAnnual = collapseToAnnual(rawData);
  const chartData = allAnnual.filter(
    (d) => d.year >= filters.startYear && d.year <= filters.endYear
  );

  const latest = chartData[chartData.length - 1];
  const prev = chartData[chartData.length - 2];
  const yoyChange = prev ? (latest.unemploymentRate - prev.unemploymentRate).toFixed(1) : '0.0';
  const yoyLabel = Number(yoyChange) <= 0 ? `${yoyChange}pp YoY` : `+${yoyChange}pp YoY`;

  const summaryStats = [
    { label: 'Unemployment rate', value: `${latest?.unemploymentRate ?? 0}%`, change: yoyLabel },
    {
      label: 'EU average rate',
      value: `${latest?.euAverageRate ?? 'N/A'}%`,
      change: `${latest?.year ?? ''} ${latest?.quarter ?? ''}`.trim(),
    },
    {
      label: 'Data source',
      value: 'CSO LFS',
      change: loading
        ? 'Loading…'
        : `Latest: ${latest?.year ?? ''} ${latest?.quarter ?? ''} · quarterly`.trim(),
    },
  ];

  return (
    <div className="animate-enter space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-display font-700 mb-1 text-2xl tracking-tight">Employment</h2>
          <p className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)]">
            Labour Force Survey, CSO Ireland
            {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
          </p>
          {lastUpdated && (
            <p className="mt-0.5 text-xs text-[var(--color-foreground-subtle)]">
              Updated{' '}
              {new Date(lastUpdated).toLocaleDateString('en-IE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SaveDashboardButton module="employment" />
          <button
            onClick={() =>
              downloadCsv(rawData as unknown as Record<string, unknown>[], 'leargas-employment')
            }
            className="flex flex-shrink-0 items-center gap-2 border border-[var(--color-graticule)] px-4 py-2 font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            style={{ borderRadius: '2px' }}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <DashboardFilters
        filters={filters}
        minYear={2015}
        maxYear={allAnnual[allAnnual.length - 1]?.year ?? new Date().getFullYear()}
        onFilter={setFilter}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryStats.map((s) => (
          <div key={s.label} className="surface card-lift p-4">
            <p className="mb-1 text-xs text-[var(--color-foreground-muted)]">{s.label}</p>
            <p className="font-display font-700 text-xl text-[var(--color-foreground)]">
              {s.value}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-foreground-subtle)]">{s.change}</p>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="surface card-lift p-6"
      >
        <h3 className="mb-6 text-sm font-semibold text-[var(--color-foreground)]">
          Unemployment rate: Ireland vs EU, {filters.startYear} to {filters.endYear}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              formatter={(v: number) => [`${v}%`]}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-foreground-muted)' }} />
            <Line
              type="monotone"
              dataKey="unemploymentRate"
              name="Ireland"
              stroke="var(--color-chart-1)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="euAverageRate"
              name="EU Average"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="surface card-lift p-6"
      >
        <h3 className="mb-6 text-sm font-semibold text-[var(--color-foreground)]">
          Employment by sector (thousands)
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={SECTOR_DATA} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="sector"
              tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}k`}
            />
            <Tooltip
              formatter={(v: number) => [`${v}k`, 'Employed']}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="employedThousands" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
