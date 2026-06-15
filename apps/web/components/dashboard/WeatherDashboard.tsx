'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { cn, downloadCsv } from '@/lib/utils';
import { SaveDashboardButton } from './SaveDashboardButton';
import { useDashboard } from '@/hooks/useDashboard';
import type { WeatherDataPoint } from '@/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PLACEHOLDER_DATA: WeatherDataPoint[] = MONTHS.map((m, i) => ({
  month: i + 1,
  monthName: m,
  avgTemperatureC: [5.7, 5.9, 7.8, 9.9, 12.8, 15.4, 17.2, 17.0, 14.3, 11.2, 7.8, 6.0][i],
  rainfallMm: [71.6, 52.4, 57.1, 53.9, 59.8, 59.8, 54.5, 71.6, 68.1, 76.1, 73.0, 79.5][i],
  sunshinehours: [55.1, 74.9, 107.3, 155.0, 183.1, 172.9, 158.5, 152.2, 116.7, 91.3, 57.8, 45.1][i],
}));

const CHART_TYPES = [
  { value: 'area', label: 'Smooth' },
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
] as const;

export function WeatherDashboard() {
  const [data, setData] = useState<WeatherDataPoint[]>(PLACEHOLDER_DATA);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { filters, setFilter } = useDashboard('weather');
  const chartType = filters.chartType ?? 'area';

  useEffect(() => {
    fetch('/api/data/weather')
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.length > 0) setData(json.data);
        if (json.lastUpdated) setLastUpdated(json.lastUpdated);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRain = data.reduce((s, d) => s + d.rainfallMm, 0);
  const avgTemp = (data.reduce((s, d) => s + d.avgTemperatureC, 0) / data.length).toFixed(1);
  const totalSun = data.reduce((s, d) => s + d.sunshinehours, 0).toFixed(0);

  const summaryStats = [
    {
      label: 'Avg annual temperature',
      value: `${avgTemp}°C`,
      change: loading ? 'Loading…' : 'Dublin Airport, 1991–2020 normals',
    },
    {
      label: 'Annual rainfall',
      value: `${totalRain.toFixed(0)}mm`,
      change: 'Dublin Airport, historical avg',
    },
    {
      label: 'Annual sunshine hours',
      value: `${totalSun}h`,
      change: 'Dublin Airport, historical avg',
    },
  ];

  const tempTooltipStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    fontSize: 12,
  };
  const tempAxisProps = {
    x: {
      dataKey: 'monthName' as const,
      tick: { fontSize: 11, fill: 'var(--color-foreground-subtle)' },
      axisLine: false,
      tickLine: false,
    },
    y: {
      tick: { fontSize: 11, fill: 'var(--color-foreground-subtle)' },
      axisLine: false,
      tickLine: false,
      tickFormatter: (v: number) => `${v}°`,
    },
  };

  return (
    <div className="animate-enter space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-display font-700 mb-1 text-2xl tracking-tight">Weather & Climate</h2>
          <p className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)]">
            Historical Climate Data, Met Éireann (Dublin Airport)
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
          <SaveDashboardButton module="weather" />
          <button
            onClick={() =>
              downloadCsv(data as unknown as Record<string, unknown>[], 'leargas-weather')
            }
            className="flex flex-shrink-0 items-center gap-2 border border-[var(--color-graticule)] px-4 py-2 font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            style={{ borderRadius: '2px' }}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Chart type toggle */}
      <div className="survey-frame flex flex-wrap items-center gap-3 bg-[var(--color-surface)] p-4">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--color-ink-soft)]">
          TEMPERATURE CHART
        </span>
        <div
          className="flex overflow-hidden border border-[var(--color-graticule)]"
          style={{ borderRadius: '2px' }}
        >
          {CHART_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter({ chartType: value })}
              className={cn(
                'px-3 py-1.5 font-mono text-[10px] tracking-wide transition-colors',
                chartType === value
                  ? 'bg-[var(--color-atlantic)] text-[var(--color-ground)]'
                  : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-ground-shade)] hover:text-[var(--color-ink)]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

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
          Average monthly temperature (°C)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis {...tempAxisProps.x} />
              <YAxis {...tempAxisProps.y} />
              <Tooltip
                formatter={(v: number) => [`${v}°C`, 'Avg temp']}
                contentStyle={tempTooltipStyle}
              />
              <Bar dataKey="avgTemperatureC" fill="var(--color-chart-3)" radius={[3, 3, 0, 0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis {...tempAxisProps.x} />
              <YAxis {...tempAxisProps.y} />
              <Tooltip
                formatter={(v: number) => [`${v}°C`, 'Avg temp']}
                contentStyle={tempTooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="avgTemperatureC"
                stroke="var(--color-chart-3)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: 'var(--color-chart-3)' }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis {...tempAxisProps.x} />
              <YAxis {...tempAxisProps.y} />
              <Tooltip
                formatter={(v: number) => [`${v}°C`, 'Avg temp']}
                contentStyle={tempTooltipStyle}
              />
              <Area
                type="monotone"
                dataKey="avgTemperatureC"
                stroke="var(--color-chart-3)"
                strokeWidth={2.5}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="surface card-lift p-6"
        >
          <h3 className="mb-6 text-sm font-semibold text-[var(--color-foreground)]">
            Rainfall (mm)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="monthName"
                tick={{ fontSize: 10, fill: 'var(--color-foreground-subtle)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-foreground-subtle)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [`${v}mm`, 'Rainfall']}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="rainfallMm" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="surface card-lift p-6"
        >
          <h3 className="mb-6 text-sm font-semibold text-[var(--color-foreground)]">
            Sunshine hours
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="monthName"
                tick={{ fontSize: 10, fill: 'var(--color-foreground-subtle)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-foreground-subtle)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [`${v}h`, 'Sunshine']}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="sunshinehours" fill="var(--color-chart-3)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
