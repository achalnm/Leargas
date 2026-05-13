'use client';

import { motion } from 'framer-motion';

const SOURCES = [
  {
    name: 'CSO Ireland',
    url: 'data.cso.ie',
    description: 'Central Statistics Office: housing prices, employment, population, and more.',
    datasets: ['Residential Property Price Index', 'Labour Force Survey', 'Population & Migration'],
    badge: 'Government',
  },
  {
    name: 'Met Éireann',
    url: 'data.met.ie',
    description: "Ireland's National Meteorological Service: historical climate data since 1942.",
    datasets: ['Monthly Temperature Records', 'Rainfall Measurements', 'Sunshine Duration'],
    badge: 'Government',
  },
  {
    name: 'data.gov.ie',
    url: 'data.gov.ie',
    description: "Ireland's Open Data Portal: transport, infrastructure, and public services.",
    datasets: ['Dublin Bus Routes', 'Planning Applications', 'Public Spending'],
    badge: 'Open Data',
  },
];

export function DataSourcesSection() {
  return (
    <section id="data" className="bg-[var(--color-surface)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase"
          >
            Transparent by design
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-display font-700 mb-4 text-4xl tracking-tight"
          >
            Real data. Real sources.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto max-w-xl text-[var(--color-foreground-muted)]"
          >
            Every number on Léargas is sourced directly from Irish government open data APIs. No
            estimates. No scraping private sites. Always cited.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {SOURCES.map((source, i) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="surface-raised p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-display font-600 mb-0.5 text-[var(--color-foreground)]">
                    {source.name}
                  </h3>
                  <code className="font-mono text-xs text-[var(--color-foreground-subtle)]">
                    {source.url}
                  </code>
                </div>
                <span className="rounded-md border border-[var(--color-accent-muted)] bg-[var(--color-accent-subtle)] px-2 py-1 text-[10px] font-semibold tracking-wide text-[var(--color-accent)] uppercase">
                  {source.badge}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                {source.description}
              </p>
              <ul className="space-y-1.5">
                {source.datasets.map((dataset) => (
                  <li
                    key={dataset}
                    className="flex items-center gap-2 text-xs text-[var(--color-foreground-subtle)]"
                  >
                    <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {dataset}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
