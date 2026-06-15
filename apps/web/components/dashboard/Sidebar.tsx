'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', ref: '00', exact: true },
  { href: '/dashboard/housing', label: 'Housing', ref: 'O', exact: false },
  { href: '/dashboard/employment', label: 'Employment', ref: 'M', exact: false },
  { href: '/dashboard/weather', label: 'Weather', ref: 'G', exact: false },
  { href: '/dashboard/saved', label: 'Saved', ref: 'S', exact: false },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-56 flex-shrink-0 flex-col border-r border-[var(--color-graticule)] bg-[var(--color-ground-shade)] md:flex">
      {/* Wordmark */}
      <div className="flex h-14 items-center border-b border-[var(--color-graticule)] px-5">
        <Link href="/" className="flex flex-col">
          <span
            className="font-display text-base font-semibold text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 28' }}
          >
            Léargas
          </span>
          <span className="font-mono text-[8px] tracking-widest text-[var(--color-ink-soft)]">
            IRISH DATA SURVEY
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-3 px-2 font-mono text-[9px] tracking-widest text-[var(--color-ink-soft)]">
          SHEETS
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-2 py-2.5 text-sm transition-colors',
                isActive
                  ? 'border-l-2 border-[var(--color-atlantic)] bg-[var(--color-accent-subtle)] pl-[6px] text-[var(--color-atlantic)]'
                  : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-ground)] hover:text-[var(--color-ink)]'
              )}
            >
              <span
                className={cn(
                  'w-5 text-center font-mono text-[9px] tracking-wider',
                  isActive ? 'text-[var(--color-atlantic)]' : 'text-[var(--color-graticule)]'
                )}
              >
                {item.ref}
              </span>
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Source status */}
      <div className="border-t border-[var(--color-graticule)] px-4 py-4">
        <div className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-atlantic)]" />
          <div>
            <p className="font-mono text-[9px] leading-relaxed tracking-wider text-[var(--color-ink-soft)]">
              CSO &amp; MET ÉIREANN
            </p>
            <p className="font-mono text-[9px] leading-relaxed text-[var(--color-graticule)]">
              WEEKLY UPDATES
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
