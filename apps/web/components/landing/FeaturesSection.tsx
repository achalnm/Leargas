'use client';

import { motion } from 'framer-motion';

const SHEETS = [
  {
    ref: 'SHEET O',
    title: 'Housing Market',
    body: 'Residential property prices and rental indices by county, from CSO RPPI data going back a decade.',
    figure: '€352,000',
    figureLabel: 'National median 2024',
    delta: '+5.1% YoY',
  },
  {
    ref: 'SHEET M',
    title: 'Employment',
    body: 'Unemployment rates, sectoral breakdowns, and Ireland vs EU comparisons from the Labour Force Survey.',
    figure: '4.4%',
    figureLabel: 'Unemployment rate',
    delta: '−0.1pp YoY',
  },
  {
    ref: 'SHEET G',
    title: 'Weather & Climate',
    body: "Monthly temperature, rainfall, and sunshine hours from Met Éireann's historical climate records.",
    figure: '10.5°C',
    figureLabel: 'Annual avg temp',
    delta: '714mm annual rain',
  },
  {
    ref: 'FIG. D',
    title: 'Saved Dashboards',
    body: 'Save your filter configurations as named dashboards and pick up exactly where you left off.',
    figure: '—',
    figureLabel: 'Persistent configs',
    delta: 'Stored in Firestore',
  },
  {
    ref: 'FIG. E',
    title: 'CSV Export',
    body: 'Download any dataset as a clean CSV, ready to open in Excel, R, or a Jupyter notebook.',
    figure: '.csv',
    figureLabel: 'Machine-readable',
    delta: 'All fields included',
  },
  {
    ref: 'FIG. F',
    title: 'Secure Auth',
    body: 'Sign in with Google or email. Your saved dashboards are private to your account.',
    figure: '✓',
    figureLabel: 'Google OAuth',
    delta: 'Firebase Auth',
  },
];

export function FeaturesSection() {
  return (
    <section id="sheets" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[var(--color-ink-soft)]">
            CONTENTS
          </p>
          <h2
            className="font-display text-4xl font-semibold tracking-tight text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 36' }}
          >
            What&rsquo;s in the almanac
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SHEETS.map((s, i) => (
            <motion.div
              key={s.ref}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="survey-frame card-lift bg-[var(--color-ground)] p-5"
            >
              <p className="mb-4 font-mono text-[9px] tracking-widest text-[var(--color-ink-soft)]">
                {s.ref}
              </p>
              <h3
                className="font-display mb-2 text-lg font-semibold text-[var(--color-ink)]"
                style={{ fontVariationSettings: '"opsz" 28' }}
              >
                {s.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[var(--color-ink-soft)]">{s.body}</p>

              {/* Ruled stat row */}
              <div className="border-t border-[var(--color-graticule)] pt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xl font-medium text-[var(--color-atlantic)]">
                    {s.figure}
                  </span>
                  <span className="font-mono text-[9px] tracking-wider text-[var(--color-ink-soft)]">
                    {s.figureLabel}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-[var(--color-graticule)]">
                  {s.delta}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
