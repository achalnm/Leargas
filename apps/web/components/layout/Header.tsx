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
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-border)]"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center group-hover:scale-105 transition-transform">
            <BarChart3 className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-[var(--color-foreground)]">
            Léargas
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {([
            { href: '#features', label: 'Features' },
            { href: '#data', label: 'Data Sources' },
            { href: '#about', label: 'About' },
          ] as const).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
