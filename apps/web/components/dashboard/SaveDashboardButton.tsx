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
    setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent-muted)] hover:bg-[var(--color-accent-subtle)] transition-colors flex-shrink-0"
      >
        <Bookmark className="w-4 h-4" />
        Save view
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative surface w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-700 text-base text-[var(--color-foreground)]">Save this view</h3>
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {saved ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center mx-auto mb-2">
                  <Bookmark className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <p className="text-sm text-[var(--color-foreground)]">Saved!</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[var(--color-foreground-muted)] mb-4">
                  Give this view a name to find it later in Saved Dashboards.
                </p>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="e.g. Dublin Housing 2020–2024"
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:border-[var(--color-accent)] transition-colors mb-4"
                />
                <button
                  onClick={handleSave}
                  disabled={!name.trim() || saving}
                  className="w-full py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save dashboard
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
