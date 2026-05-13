'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass fixed top-0 right-0 left-0 z-50 border-b border-[var(--color-border)]"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] transition-transform group-hover:scale-105">
            <BarChart3 className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-[var(--color-foreground)]">
            Léargas
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {(
            [
              { href: '#features', label: 'Features' },
              { href: '#data', label: 'Data Sources' },
              { href: '#about', label: 'About' },
            ] as const
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
