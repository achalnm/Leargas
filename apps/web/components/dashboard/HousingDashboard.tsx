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
import { formatCurrency, formatYoY, downloadCsv } from '@/lib/utils';
import { SaveDashboardButton } from './SaveDashboardButton';
import { DashboardFilters } from './DashboardFilters';
import { useDashboard } from '@/hooks/useDashboard';
import type { HousingDataPoint, HousingStats } from '@/types';

const PLACEHOLDER_DATA: HousingDataPoint[] = [
  { year: 2015, nationalMedianPrice: 195000, dublinMedianPrice: 310000 },
  { year: 2016, nationalMedianPrice: 215000, dublinMedianPrice: 340000 },
  { year: 2017, nationalMedianPrice: 240000, dublinMedianPrice: 370000 },
  { year: 2018, nationalMedianPrice: 258000, dublinMedianPrice: 385000 },
  { year: 2019, nationalMedianPrice: 268000, dublinMedianPrice: 390000 },
  { year: 2020, nationalMedianPrice: 270000, dublinMedianPrice: 388000 },
  { year: 2021, nationalMedianPrice: 285000, dublinMedianPrice: 400000 },
  { year: 2022, nationalMedianPrice: 318000, dublinMedianPrice: 415000 },
  { year: 2023, nationalMedianPrice: 335000, dublinMedianPrice: 425000 },
  { year: 2024, nationalMedianPrice: 352000, dublinMedianPrice: 438000 },
  { year: 2025, nationalMedianPrice: 395000, dublinMedianPrice: 495000 },
];

const PLACEHOLDER_COUNTY_DATA = [
  { county: 'Dublin', medianPrice: 495000 },
  { county: 'Wicklow', medianPrice: 420000 },
  { county: 'Kildare', medianPrice: 380000 },
  { county: 'Meath', medianPrice: 365000 },
  { county: 'Cork', medianPrice: 340000 },
  { county: 'Galway', medianPrice: 310000 },
  { county: 'Limerick', medianPrice: 270000 },
  { county: 'Waterford', medianPrice: 255000 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-xs shadow-xl">
      <p className="mb-2 font-medium text-[var(--color-foreground-muted)]">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-2">
          <span>{p.name}:</span>
          <span className="font-mono font-semibold">{formatCurrency(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

export function HousingDashboard() {
  const [allData, setAllData] = useState<HousingDataPoint[]>(PLACEHOLDER_DATA);
  const [countyData, setCountyData] = useState(PLACEHOLDER_COUNTY_DATA);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { filters, setFilter, resetFilters } = useDashboard('housing');

  useEffect(() => {
    fetch('/api/data/housing')
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.length > 0) setAllData(json.data);
        if (json.countyData?.length > 0) setCountyData(json.countyData);
        if (json.lastUpdated) setLastUpdated(json.lastUpdated);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Apply year range filter
  const data = allData.filter((d) => d.year >= filters.startYear && d.year <= filters.endYear);

  const showNational = filters.county === 'All' || filters.county === 'National';
  const showDublin = filters.county === 'All' || filters.county === 'Dublin';

  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const stats: HousingStats = {
    nationalMedianPrice: latest?.nationalMedianPrice ?? 0,
    dublinMedianPrice: latest?.dublinMedianPrice ?? 0,
    yoyChangeNational: prev
      ? ((latest.nationalMedianPrice - prev.nationalMedianPrice) / prev.nationalMedianPrice) * 100
      : 0,
    yoyChangeDublin: prev
      ? ((latest.dublinMedianPrice - prev.dublinMedianPrice) / prev.dublinMedianPrice) * 100
      : 0,
  };

  const latestYear = latest?.year ?? 2025;
  const summaryStats = [
    ...(showNational
      ? [
          {
            label: 'National median',
            value: formatCurrency(stats.nationalMedianPrice),
            change: formatYoY(stats.yoyChangeNational),
          },
        ]
      : []),
    ...(showDublin
      ? [
          {
            label: 'Dublin median',
            value: formatCurrency(stats.dublinMedianPrice),
            change: formatYoY(stats.yoyChangeDublin),
          },
        ]
      : []),
    {
      label: 'Data source',
      value: 'CSO RPPI',
      change: loading ? 'Loading…' : `Latest: ${latestYear}`,
    },
  ];

  return (
    <div className="animate-enter space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-display font-700 mb-1 text-2xl tracking-tight">Housing Market</h2>
          <p className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)]">
            Residential Property Price Index, CSO Ireland
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
          <SaveDashboardButton module="housing" />
          <button
            onClick={() =>
              downloadCsv(data as unknown as Record<string, unknown>[], 'leargas-housing')
            }
            className="flex flex-shrink-0 items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-foreground)]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <DashboardFilters
        filters={filters}
        minYear={2015}
        maxYear={Math.max(allData[allData.length - 1]?.year ?? 2026, new Date().getFullYear())}
        showRegion
        regionLabels={['All', 'National', 'Dublin']}
        onFilter={setFilter}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryStats.map((s) => (
          <div key={s.label} className="surface p-4">
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
        className="surface p-6"
      >
        <h3 className="mb-6 text-sm font-semibold text-[var(--color-foreground)]">
          Median house prices, {filters.startYear} to {filters.endYear}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
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
              tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-foreground-muted)' }} />
            {showNational && (
              <Line
                type="monotone"
                dataKey="nationalMedianPrice"
                name="National"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
            {showDublin && (
              <Line
                type="monotone"
                dataKey="dublinMedianPrice"
                name="Dublin"
                stroke="var(--color-chart-2)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="surface p-6"
      >
        <h3 className="mb-6 text-sm font-semibold text-[var(--color-foreground)]">
          Median price by county ({latestYear})
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={countyData}
            layout="vertical"
            margin={{ top: 4, right: 48, bottom: 4, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="county"
              tick={{ fontSize: 11, fill: 'var(--color-foreground-subtle)' }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              formatter={(v: number) => [formatCurrency(v), 'Median price']}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="medianPrice" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
