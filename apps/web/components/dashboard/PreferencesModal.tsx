'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import type { NumberFormat, UserPreferences } from '@/types';

const FORMAT_OPTIONS: { value: NumberFormat; label: string; description: string }[] = [
  {
    value: 'western',
    label: 'Western (€)',
    description: 'Thousands, millions, billions: €340K, €1.2M',
  },
  {
    value: 'indian',
    label: 'Indian (₹)',
    description: 'Converts EUR → INR at live rate, shows lakhs & crores',
  },
];

interface Props {
  preferences: UserPreferences;
  onSave: (patch: Partial<UserPreferences>) => Promise<void>;
  onClose: () => void;
}

export function PreferencesModal({ preferences, onSave, onClose }: Props) {
  const [format, setFormat] = useState<NumberFormat>(preferences.numberFormat);
  const [saving, setSaving] = useState(false);
  const { rate: eurToInr, loading: rateLoading } = useExchangeRate();

  async function handleSave() {
    setSaving(true);
    await onSave({ numberFormat: format });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="surface relative w-full max-w-md p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display font-700 text-lg text-[var(--color-foreground)]">
            Preferences
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-foreground-subtle)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold tracking-widest text-[var(--color-foreground-subtle)] uppercase">
            Number Format
          </p>
          <div className="space-y-2">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormat(opt.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all',
                  format === opt.value
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-foreground-subtle)]'
                )}
              >
                <div>
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      format === opt.value
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-foreground)]'
                    )}
                  >
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-foreground-subtle)]">
                    {opt.description}
                  </p>
                  {opt.value === 'indian' && (
                    <p className="mt-1 font-mono text-xs text-[var(--color-foreground-muted)]">
                      {rateLoading
                        ? 'Fetching rate…'
                        : eurToInr
                          ? `1 EUR = ₹${eurToInr.toFixed(2)}`
                          : 'Rate unavailable'}
                    </p>
                  )}
                </div>
                {format === opt.value && (
                  <div className="ml-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
}
