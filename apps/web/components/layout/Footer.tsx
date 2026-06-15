'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-graticule)] bg-[var(--color-ground-shade)]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p
              className="font-display mb-1 text-base font-semibold text-[var(--color-ink)]"
              style={{ fontVariationSettings: '"opsz" 28' }}
            >
              Léargas
            </p>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-[var(--color-ink-soft)]">
              IRISH DATA SURVEY · OPEN SOURCE
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--color-ink-soft)]">
              Real-time analytics dashboards built on Irish public data from CSO and Met Éireann.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[10px] tracking-widest text-[var(--color-ink-soft)]">
              SHEETS
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/dashboard/housing', label: 'Housing Prices' },
                { href: '/dashboard/employment', label: 'Employment' },
                { href: '/dashboard/weather', label: 'Weather & Climate' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[10px] tracking-widest text-[var(--color-ink-soft)]">
              SOURCES
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'CSO Ireland', href: 'https://data.cso.ie' },
                { label: 'Met Éireann', href: 'https://data.met.ie' },
                { label: 'data.gov.ie', href: 'https://data.gov.ie' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-graticule)] pt-6 sm:flex-row">
          <p className="font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)]">
            © {new Date().getFullYear()} LÉARGAS · PORTFOLIO PROJECT
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
          >
            <Github className="h-3.5 w-3.5" />
            VIEW SOURCE
          </a>
        </div>
      </div>
    </footer>
  );
}
