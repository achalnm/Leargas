'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Home, Briefcase, CloudRain, Bookmark, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/housing', label: 'Housing', icon: Home, exact: false },
  { href: '/dashboard/employment', label: 'Employment', icon: Briefcase, exact: false },
  { href: '/dashboard/weather', label: 'Weather', icon: CloudRain, exact: false },
  { href: '/dashboard/saved', label: 'Saved', icon: Bookmark, exact: false },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-60 flex-shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)] transition-transform group-hover:scale-105">
            <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-700 text-base tracking-tight text-[var(--color-foreground)]">
            Léargas
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-widest text-[var(--color-foreground-subtle)] uppercase">
          Dashboards
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'border border-[var(--color-accent-muted)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-foreground)]'
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-foreground-subtle)] group-hover:text-[var(--color-foreground)]'
                )}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--color-border)] px-4 py-4">
        <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-raised)] px-3 py-2">
          <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-[var(--color-success)]" />
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-foreground-muted)]">
              CSO &amp; Met Éireann data
            </span>
            <span className="text-[10px] text-[var(--color-foreground-subtle)]">
              Housing &amp; employment updated weekly
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
