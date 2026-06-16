'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IrelandMap } from '@/components/map/IrelandMap';

const READINGS = [
  { county: 'dublin', label: 'Dublin median · ', value: '€428k' },
  { county: 'mayo', label: 'Mayo rainfall · ', value: '1,400mm' },
  { county: 'cork', label: 'Unemployed · ', value: '4.4%' },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16">
      {/* Survey paper graticule background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-graticule) 1px, transparent 1px), linear-gradient(90deg, var(--color-graticule) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Left - text */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-6 font-mono text-[10px] tracking-[0.2em] text-[var(--color-ink-soft)]">
            SHEET O · PUBLIC DATA SURVEY · LÉARGAS
          </p>

          <h1
            className="font-display mb-6 text-5xl leading-[1.08] font-semibold tracking-tight text-[var(--color-ink)] lg:text-6xl"
            style={{ fontVariationSettings: '"opsz" 36' }}
          >
            Ireland&rsquo;s public data,
            <br />
            surveyed and charted.
          </h1>

          <p className="mb-2 font-sans text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Housing prices. Employment rates. Weather records. All official. All live.
          </p>

          <p className="mb-10 font-mono text-xs text-[var(--color-graticule)]">
            Source: CSO &amp; Met Éireann &nbsp;·&nbsp; Surveyed: June 2026
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center border border-[var(--color-atlantic)] bg-[var(--color-atlantic)] px-6 py-3 font-mono text-sm tracking-wider text-[var(--color-ground)] transition-all hover:bg-[var(--color-accent-hover)]"
              style={{ borderRadius: '2px' }}
            >
              Survey the data
            </Link>
            <Link
              href="#sheets"
              className="inline-flex items-center justify-center border border-[var(--color-graticule)] px-6 py-3 font-mono text-sm tracking-wider text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              style={{ borderRadius: '2px' }}
            >
              See the sheets
            </Link>
          </div>
        </motion.div>

        {/* Right - SVG Ireland map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="survey-frame relative mx-auto w-full max-w-[420px] bg-[var(--color-ground)] p-4 lg:max-w-none"
          style={{ minHeight: '420px' }}
        >
          <p className="mb-2 font-mono text-[9px] tracking-widest text-[var(--color-ink-soft)]">
            IRELAND · SURVEY PLOT · LIVE READINGS
          </p>
          <IrelandMap variant="landing" readings={READINGS} />
        </motion.div>
      </div>
    </section>
  );
}
