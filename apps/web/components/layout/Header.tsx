'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-14 border-b border-[var(--color-graticule)] bg-[var(--color-ground)]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="font-display text-xl font-semibold tracking-tight text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 36' }}
          >
            Léargas
          </span>
          <span className="hidden font-mono text-[10px] tracking-widest text-[var(--color-ink-soft)] sm:inline">
            IRISH DATA SURVEY
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: '#sheets', label: 'Sheets' },
            { href: '#sources', label: 'Sources' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs tracking-wider text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="font-mono text-xs tracking-wider text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="border border-[var(--color-atlantic)] px-4 py-1.5 font-mono text-xs tracking-wider text-[var(--color-atlantic)] transition-colors hover:bg-[var(--color-atlantic)] hover:text-[var(--color-ground)]"
            style={{ borderRadius: '2px' }}
          >
            Survey the data
          </Link>
        </div>
      </div>
    </header>
  );
}
