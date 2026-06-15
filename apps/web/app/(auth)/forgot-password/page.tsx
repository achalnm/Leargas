'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="mb-3 font-mono text-[9px] tracking-[0.2em] text-[var(--color-ink-soft)]">
        ACCOUNT RECOVERY
      </p>
      <h1
        className="font-display mb-6 text-3xl font-semibold tracking-tight text-[var(--color-ink)]"
        style={{ fontVariationSettings: '"opsz" 36' }}
      >
        Reset password
      </h1>

      <div className="survey-frame bg-[var(--color-surface)] p-8">
        {sent ? (
          <div className="space-y-5 text-center">
            <p className="font-mono text-[10px] tracking-wider text-[var(--color-atlantic)]">
              ✓ &nbsp; DISPATCH CONFIRMED
            </p>
            <p className="font-sans text-sm text-[var(--color-ink)]">
              Check <strong>{email}</strong> for a reset link.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider text-[var(--color-atlantic)] hover:underline"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)]">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-[var(--color-graticule)] bg-[var(--color-ground)] px-3 py-2.5 font-sans text-sm text-[var(--color-ink)] transition-colors placeholder:text-[var(--color-graticule)] focus:border-[var(--color-atlantic)] focus:outline-none"
                style={{ borderRadius: '2px' }}
              />
            </div>

            {error && (
              <p
                className="border border-[var(--color-madder)] bg-[var(--color-ground)] px-3 py-2 font-mono text-[10px] text-[var(--color-madder)]"
                style={{ borderRadius: '2px' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-[var(--color-atlantic)] px-6 py-3 font-mono text-[11px] tracking-wider text-[var(--color-ground)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
              style={{ borderRadius: '2px' }}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              SEND RESET LINK
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                ← Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
