'use client';

import { useState } from 'react';
import { Bookmark, Loader2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSavedDashboards } from '@/hooks/useFirestore';
import { useDashboardStore } from '@/store/dashboardStore';
import type { DataModule } from '@/types';

interface Props {
  module: DataModule;
}

export function SaveDashboardButton({ module }: Props) {
  const { user } = useAuth();
  const { save } = useSavedDashboards(user?.uid);
  const filters = useDashboardStore((s) => s.filters[module]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await save(name.trim(), module, filters);
    setSaving(false);
    setSaved(true);
    setName('');
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1200);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-shrink-0 items-center gap-2 border border-[var(--color-graticule)] px-4 py-2 font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-atlantic)] hover:text-[var(--color-atlantic)]"
        style={{ borderRadius: '2px' }}
      >
        <Bookmark className="h-4 w-4" />
        Save view
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[var(--color-ink)]/40"
            onClick={() => setOpen(false)}
          />
          <div className="survey-frame relative w-full max-w-sm bg-[var(--color-ground)] p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-mono text-[9px] tracking-widest text-[var(--color-ink-soft)]">
                SAVE VIEW
              </p>
              <button
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center border border-[var(--color-graticule)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                style={{ borderRadius: '2px' }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {saved ? (
              <div className="space-y-3 py-4 text-center">
                <p className="font-mono text-[10px] tracking-wider text-[var(--color-atlantic)]">
                  ✓ &nbsp; SAVED
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 font-sans text-xs text-[var(--color-ink-soft)]">
                  Name this view to find it later in Saved Dashboards.
                </p>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="e.g. Dublin Housing 2020–2024"
                  className="mb-4 w-full border border-[var(--color-graticule)] bg-[var(--color-surface)] px-3 py-2.5 font-sans text-sm text-[var(--color-ink)] transition-colors placeholder:text-[var(--color-graticule)] focus:border-[var(--color-atlantic)] focus:outline-none"
                  style={{ borderRadius: '2px' }}
                />
                <button
                  onClick={handleSave}
                  disabled={!name.trim() || saving}
                  className="flex w-full items-center justify-center gap-2 bg-[var(--color-atlantic)] py-2.5 font-mono text-[11px] tracking-wider text-[var(--color-ground)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
                  style={{ borderRadius: '2px' }}
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  SAVE DASHBOARD
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
