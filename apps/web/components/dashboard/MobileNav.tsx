'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', ref: '00', exact: true },
  { href: '/dashboard/housing', label: 'Housing', ref: 'O', exact: false },
  { href: '/dashboard/employment', label: 'Jobs', ref: 'M', exact: false },
  { href: '/dashboard/weather', label: 'Weather', ref: 'G', exact: false },
  { href: '/dashboard/saved', label: 'Saved', ref: 'S', exact: false },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex border-t border-[var(--color-graticule)] bg-[var(--color-ground)] md:hidden">
      {NAV_ITEMS.map(({ href, label, ref, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-3 transition-colors',
              active ? 'text-[var(--color-atlantic)]' : 'text-[var(--color-graticule)]'
            )}
          >
            <span className="font-mono text-[9px] font-medium tracking-wider">{ref}</span>
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
