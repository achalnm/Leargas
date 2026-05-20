'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, ExternalLink, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSavedDashboards } from '@/hooks/useFirestore';
import { useDashboardStore } from '@/store/dashboardStore';
import type { SavedDashboard } from '@/types';

const MODULE_LABELS: Record<string, string> = {
  housing: 'Housing Market',
  employment: 'Employment',
  weather: 'Weather & Climate',
};

const MODULE_PATHS = {
  housing: '/dashboard/housing',
  employment: '/dashboard/employment',
  weather: '/dashboard/weather',
} as const;

export function SavedDashboardsView() {
  const { user, loading: authLoading } = useAuth();
  const { dashboards, loading, error, fetch, remove } = useSavedDashboards(user?.uid);
  const { setFilter, setActiveModule } = useDashboardStore();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetch();
  }, [user, fetch]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await remove(id);
    setDeletingId(null);
  }

  function handleLoad(dashboard: SavedDashboard) {
    setActiveModule(dashboard.module);
    setFilter(dashboard.module, dashboard.filters);
    router.push(MODULE_PATHS[dashboard.module]);
  }

  if (authLoading) return <Skeleton />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-raised)]">
          <Bookmark className="h-6 w-6 text-[var(--color-foreground-subtle)]" />
        </div>
        <h3 className="font-display font-600 text-[var(--color-foreground)]">
          Sign in to save dashboards
        </h3>
        <p className="max-w-xs text-sm text-[var(--color-foreground-muted)]">
          Create a free account to save your filter configurations and pick up where you left off.
        </p>
        <a
          href="/login"
          className="mt-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="font-display font-700 mb-1 text-2xl tracking-tight">Saved Dashboards</h2>
        <p className="text-sm text-[var(--color-foreground-muted)]">
          Your saved filter configurations. Click any to reload it instantly.
        </p>
      </div>

      {loading && <Skeleton />}

      {!loading && error && (
        <div className="surface p-6 text-center text-sm text-[var(--color-error)]">{error}</div>
      )}

      {!loading && !error && dashboards.length === 0 && (
        <div className="surface flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-raised)]">
            <LayoutDashboard className="h-6 w-6 text-[var(--color-foreground-subtle)]" />
          </div>
          <div>
            <h3 className="font-display font-600 mb-1 text-[var(--color-foreground)]">
              No saved dashboards yet
            </h3>
            <p className="text-sm text-[var(--color-foreground-muted)]">
              Go to any dashboard, apply filters, and save your view.
            </p>
          </div>
        </div>
      )}

      {!loading && dashboards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboards.map((dashboard, i) => (
            <motion.div
              key={dashboard.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="surface group p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="font-display font-600 truncate text-[var(--color-foreground)]">
                    {dashboard.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-[var(--color-foreground-subtle)]">
                    {MODULE_LABELS[dashboard.module]}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(dashboard.id)}
                  disabled={deletingId === dashboard.id}
                  className="ml-3 flex-shrink-0 rounded-lg p-1.5 text-[var(--color-foreground-subtle)] opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-950/30 hover:text-[var(--color-error)]"
                  aria-label="Delete dashboard"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {dashboard.filters.county !== 'All' && (
                  <FilterBadge label={dashboard.filters.county} />
                )}
                <FilterBadge
                  label={`${dashboard.filters.startYear}–${dashboard.filters.endYear}`}
                />
                <FilterBadge label={dashboard.filters.chartType} />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-[var(--color-foreground-subtle)]">
                  Saved{' '}
                  {new Date(dashboard.createdAt).toLocaleDateString('en-IE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <button
                  onClick={() => handleLoad(dashboard)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                >
                  Load
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBadge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 py-0.5 text-[10px] text-[var(--color-foreground-muted)]">
      {label}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="surface animate-pulse space-y-3 p-5">
          <div className="h-4 w-3/4 rounded bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-1/2 rounded bg-[var(--color-surface-raised)]" />
          <div className="h-8 rounded bg-[var(--color-surface-raised)]" />
        </div>
      ))}
    </div>
  );
}
