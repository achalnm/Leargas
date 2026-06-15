'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePreferences } from '@/hooks/usePreferences';
import { logOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PreferencesModal } from './PreferencesModal';

const PAGE_META: Record<string, { title: string; ref: string }> = {
  '/dashboard': { title: 'Overview', ref: 'SHEET 00' },
  '/dashboard/housing': { title: 'Housing Market', ref: 'SHEET O · CSO RPPI' },
  '/dashboard/employment': { title: 'Employment', ref: 'SHEET M · CSO LFS' },
  '/dashboard/weather': { title: 'Weather', ref: 'SHEET G · MET ÉIREANN' },
  '/dashboard/saved': { title: 'Saved Dashboards', ref: 'SHEET S' },
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { preferences, update } = usePreferences(user?.uid);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const meta = PAGE_META[pathname] ?? { title: 'Dashboard', ref: 'LÉARGAS' };

  async function handleSignOut() {
    await logOut();
    router.push('/');
  }

  return (
    <>
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[var(--color-graticule)] bg-[var(--color-ground)] px-6">
        <div>
          <h1
            className="font-display text-base font-semibold text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 28' }}
          >
            {meta.title}
          </h1>
          <p className="font-mono text-[9px] tracking-widest text-[var(--color-ink-soft)]">
            {meta.ref}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => setPrefsOpen(true)}
              aria-label="Preferences"
              className="flex h-8 w-8 items-center justify-center border border-[var(--color-graticule)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              style={{ borderRadius: '2px' }}
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 border border-[var(--color-graticule)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--color-ink)]"
                style={{ borderRadius: '2px' }}
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? 'User'}
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-atlantic)]">
                    <User className="h-3 w-3 text-[var(--color-ground)]" />
                  </div>
                )}
                <span className="hidden max-w-[100px] truncate font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] sm:block">
                  {(user.displayName ?? user.email ?? '').split(' ')[0].toUpperCase()}
                </span>
                <ChevronDown className="h-3 w-3 text-[var(--color-graticule)]" />
              </button>

              {menuOpen && (
                <div
                  className="absolute top-full right-0 z-50 mt-1 w-40 border border-[var(--color-graticule)] bg-[var(--color-ground)] shadow-sm"
                  style={{ borderRadius: '2px' }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setPrefsOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-ground-shade)] hover:text-[var(--color-ink)]"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Preferences
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 border-t border-[var(--color-graticule)] px-3 py-2.5 font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-ground-shade)] hover:text-[var(--color-madder)]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="border border-[var(--color-atlantic)] px-4 py-1.5 font-mono text-[10px] tracking-wider text-[var(--color-atlantic)] transition-colors hover:bg-[var(--color-atlantic)] hover:text-[var(--color-ground)]"
              style={{ borderRadius: '2px' }}
            >
              SIGN IN
            </a>
          )}
        </div>
      </header>

      {prefsOpen && (
        <PreferencesModal
          preferences={preferences}
          onSave={update}
          onClose={() => setPrefsOpen(false)}
        />
      )}
    </>
  );
}
