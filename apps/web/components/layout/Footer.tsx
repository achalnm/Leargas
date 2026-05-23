'use client';

import Link from 'next/link';
import { BarChart3, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-700 text-base text-[var(--color-foreground)]">Léargas</span>
            </Link>
            <p className="text-sm text-[var(--color-foreground-muted)] max-w-xs leading-relaxed">
              Real-time analytics dashboards built on Irish public data from CSO, Met Éireann, and data.gov.ie.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-foreground-subtle)] mb-4">
              Dashboards
            </h4>
            <ul className="space-y-2.5">
              {([
                { href: '/dashboard/housing', label: 'Housing Prices' },
                { href: '/dashboard/employment', label: 'Employment' },
                { href: '/dashboard/weather', label: 'Weather & Climate' },
              ] as const).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-foreground-subtle)] mb-4">
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
                    className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-foreground-subtle)]">
            © {new Date().getFullYear()} Léargas. Open source portfolio project.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            View source
          </a>
        </div>
      </div>
    </footer>
  );
}
