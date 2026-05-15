'use client';

import { usePathname } from 'next/navigation';
import { Bell, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePreferences } from '@/hooks/usePreferences';
import { logOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PreferencesModal } from './PreferencesModal';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/housing': 'Housing Market',
  '/dashboard/employment': 'Employment',
  '/dashboard/weather': 'Weather & Climate',
  '/dashboard/saved': 'Saved Dashboards',
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { preferences, update } = usePreferences(user?.uid);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  async function handleSignOut() {
    await logOut();
    router.push('/');
  }

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0">
        <div>
          <h1 className="text-base font-display font-600 text-[var(--color-foreground)]">{title}</h1>
          <p className="text-xs text-[var(--color-foreground-subtle)]">CSO Ireland · Met Éireann · data.gov.ie</p>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => setPrefsOpen(true)}
              aria-label="Preferences"
              className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-colors"
              >
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName ?? 'User'} width={28} height={28} className="rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium text-[var(--color-foreground)] hidden sm:block max-w-[120px] truncate">
                  {user.displayName ?? user.email}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-foreground-subtle)]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 surface-raised shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={() => { setMenuOpen(false); setPrefsOpen(true); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Preferences
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-error)] hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Sign in
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
