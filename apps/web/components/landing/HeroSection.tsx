'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, TrendingUp, CloudRain } from 'lucide-react';

const STAT_CARDS = [
  {
    icon: BarChart3,
    label: 'Avg Dublin house price',
    value: '€428,000',
    change: '+6.2% YoY',
    colour: 'var(--color-chart-1)',
  },
  {
    icon: TrendingUp,
    label: 'Unemployment rate',
    value: '4.4%',
    change: '−0.3pp YoY',
    colour: 'var(--color-chart-2)',
  },
  {
    icon: CloudRain,
    label: 'Annual rainfall (Dublin)',
    value: '714mm',
    change: 'Historical avg',
    colour: 'var(--color-chart-3)',
  },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-muted)] bg-[var(--color-accent-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
            Live Irish public data
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-800 mb-6 text-5xl leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Ireland&apos;s data, <span className="text-gradient">finally visible</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-foreground-muted)] sm:text-xl"
        >
          Léargas turns raw CSO statistics, Met Éireann climate records, and government open data
          into beautiful, interactive analytics dashboards, updated weekly from live APIs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/register"
            className="glow-accent flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
          >
            Explore dashboards
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-foreground-muted)] transition-all hover:border-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)]"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Stat preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {STAT_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              className="surface group p-5 text-left transition-colors hover:border-[var(--color-accent)]"
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ backgroundColor: card.colour + '22' }}
                >
                  <card.icon
                    className="h-3.5 w-3.5"
                    style={{ color: card.colour }}
                    strokeWidth={2}
                  />
                </div>
                <span className="text-xs text-[var(--color-foreground-subtle)]">{card.label}</span>
              </div>
              <p className="font-display font-700 mb-0.5 text-2xl text-[var(--color-foreground)]">
                {card.value}
              </p>
              <p className="text-xs text-[var(--color-foreground-muted)]">{card.change}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
