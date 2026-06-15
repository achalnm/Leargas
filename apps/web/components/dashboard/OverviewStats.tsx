'use client';

import { motion } from 'framer-motion';
import { Home, TrendingDown, Thermometer, Users } from 'lucide-react';
import { formatWithNumberFormat, formatPopulation } from '@/lib/utils';
import type { NumberFormat } from '@/types';

interface Props {
  numberFormat: NumberFormat;
  eurToInr?: number | null;
}

export function OverviewStats({ numberFormat, eurToInr }: Props) {
  const STATS = [
    {
      label: 'National Median House Price',
      value: formatWithNumberFormat(340000, numberFormat, eurToInr),
      change: '+6.2%',
      changeLabel: 'year-on-year',
      positive: true,
      icon: Home,
      colour: 'var(--color-chart-1)',
      source: 'CSO RPPI',
    },
    {
      label: 'Unemployment Rate',
      value: '4.4%',
      change: '−0.3pp',
      changeLabel: 'year-on-year',
      positive: true,
      icon: TrendingDown,
      colour: 'var(--color-chart-2)',
      source: 'CSO LFS',
    },
    {
      label: 'Annual Avg Temperature',
      value: '10.1°C',
      change: '+0.4°C',
      changeLabel: 'vs 1981–2010 avg',
      positive: false,
      icon: Thermometer,
      colour: 'var(--color-chart-3)',
      source: 'Met Éireann',
    },
    {
      label: 'Population',
      value: formatPopulation(5_150_000, numberFormat),
      change: '+1.2%',
      changeLabel: 'year-on-year',
      positive: true,
      icon: Users,
      colour: 'var(--color-chart-4)',
      source: 'CSO',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="surface card-lift p-5"
        >
          <div className="mb-4 flex items-start justify-between">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-[var(--color-graticule)]"
              style={{ backgroundColor: stat.colour + '18', borderRadius: '2px' }}
            >
              <stat.icon className="h-4 w-4" style={{ color: stat.colour }} strokeWidth={1.75} />
            </div>
            <span
              className="border border-[var(--color-graticule)] bg-[var(--color-ground)] px-2 py-0.5 font-mono text-[9px] tracking-wide text-[var(--color-ink-soft)]"
              style={{ borderRadius: '2px' }}
            >
              {stat.source}
            </span>
          </div>
          <p className="mb-1 text-xs text-[var(--color-foreground-muted)]">{stat.label}</p>
          <p className="font-display font-700 mb-1 text-2xl text-[var(--color-foreground)]">
            {stat.value}
          </p>
          <p className="text-xs">
            <span
              className={
                stat.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'
              }
            >
              {stat.change}
            </span>
            <span className="ml-1 text-[var(--color-foreground-subtle)]">{stat.changeLabel}</span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}
