'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, Briefcase, CloudRain, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/housing', label: 'Housing', icon: Home, exact: false },
  { href: '/dashboard/employment', label: 'Jobs', icon: Briefcase, exact: false },
  { href: '/dashboard/weather', label: 'Weather', icon: CloudRain, exact: false },
  { href: '/dashboard/saved', label: 'Saved', icon: Bookmark, exact: false },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
              active ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground-subtle)]'
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
