'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase/auth';
import { Loader2, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-700 tracking-tight mb-2">Reset your password</h1>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        <div className="surface p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center mx-auto">
                <span className="text-[var(--color-accent)] text-xl">✓</span>
              </div>
              <p className="text-sm text-[var(--color-foreground)]">
                Check <strong>{email}</strong> for a reset link.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-xs text-red-400">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send reset link
              </button>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
