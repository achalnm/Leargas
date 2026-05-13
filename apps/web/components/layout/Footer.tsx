'use client';

import Link from 'next/link';
import { BarChart3, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-700 text-base text-[var(--color-foreground)]">
                Léargas
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--color-foreground-muted)]">
              Real-time analytics dashboards built on Irish public data from CSO, Met Éireann, and
              data.gov.ie.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold tracking-widest text-[var(--color-foreground-subtle)] uppercase">
              Dashboards
            </h4>
            <ul className="space-y-2.5">
              {(
                [
                  { href: '/dashboard/housing', label: 'Housing Prices' },
                  { href: '/dashboard/employment', label: 'Employment' },
                  { href: '/dashboard/weather', label: 'Weather & Climate' },
                ] as const
              ).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold tracking-widest text-[var(--color-foreground-subtle)] uppercase">
              Data Sources
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
                    className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            © {new Date().getFullYear()} Léargas. Open source portfolio project.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[var(--color-foreground-subtle)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <Github className="h-3.5 w-3.5" />
            View source
          </a>
        </div>
      </div>
    </footer>
  );
}
