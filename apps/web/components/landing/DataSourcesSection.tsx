'use client';

import { motion } from 'framer-motion';

const SOURCES = [
  {
    ref: 'SOURCE 01',
    name: 'CSO Ireland',
    url: 'data.cso.ie',
    desc: 'Central Statistics Office: housing prices, employment, population, and more.',
    datasets: ['Residential Property Price Index', 'Labour Force Survey', 'Population & Migration'],
  },
  {
    ref: 'SOURCE 02',
    name: 'Met Éireann',
    url: 'data.met.ie',
    desc: "Ireland's National Meteorological Service: historical climate data since 1942.",
    datasets: ['Monthly Temperature Records', 'Rainfall Measurements', 'Sunshine Duration'],
  },
  {
    ref: 'SOURCE 03',
    name: 'data.gov.ie',
    url: 'data.gov.ie',
    desc: "Ireland's Open Data Portal: transport, infrastructure, and public services.",
    datasets: ['Dublin Bus Routes', 'Planning Applications', 'Public Spending'],
  },
];

export function DataSourcesSection() {
  return (
    <section id="sources" className="bg-[var(--color-ground-shade)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[var(--color-ink-soft)]">
            PROVENANCE
          </p>
          <h2
            className="font-display text-4xl font-semibold tracking-tight text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 36' }}
          >
            Real data. Real sources.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Every number on Léargas is sourced directly from Irish government open data APIs. No
            estimates. No scraping. Always cited.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {SOURCES.map((src, i) => (
            <motion.div
              key={src.ref}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="survey-frame bg-[var(--color-ground)] p-5"
            >
              <p className="mb-4 font-mono text-[9px] tracking-widest text-[var(--color-ink-soft)]">
                {src.ref}
              </p>

              <div className="mb-1 flex items-start justify-between gap-2">
                <h3
                  className="font-display text-lg font-semibold text-[var(--color-ink)]"
                  style={{ fontVariationSettings: '"opsz" 28' }}
                >
                  {src.name}
                </h3>
                <span className="border border-[var(--color-atlantic)] px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-[var(--color-atlantic)]">
                  GOV
                </span>
              </div>

              <p className="mb-1 font-mono text-[10px] text-[var(--color-graticule)]">{src.url}</p>
              <p className="mb-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {src.desc}
              </p>

              <ul className="space-y-1.5 border-t border-[var(--color-graticule)] pt-3">
                {src.datasets.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 font-mono text-[10px] text-[var(--color-ink-soft)]"
                  >
                    <span className="text-[var(--color-atlantic)]">+</span>
                    {d}
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
