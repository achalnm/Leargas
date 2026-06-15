'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  'w-full border border-[var(--color-graticule)] bg-[var(--color-ground)] px-3 py-2.5 font-sans text-sm text-[var(--color-ink)] placeholder:text-[var(--color-graticule)] focus:border-[var(--color-atlantic)] focus:outline-none transition-colors';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      await signInWithEmail(data.email, data.password);
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? friendlyError(e.message) : 'Sign in failed');
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? friendlyError(e.message) : 'Google sign in failed');
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="survey-frame bg-[var(--color-surface)] p-8">
      {/* Google OAuth */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading || isSubmitting}
        className="mb-6 flex w-full items-center justify-center gap-3 border border-[var(--color-graticule)] bg-[var(--color-ground)] px-6 py-3 font-mono text-[11px] tracking-wider text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] disabled:opacity-50"
        style={{ borderRadius: '2px' }}
      >
        {googleLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GoogleIcon />}
        CONTINUE WITH GOOGLE
      </button>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-graticule)]" />
        <span className="font-mono text-[9px] tracking-widest text-[var(--color-graticule)]">
          OR
        </span>
        <div className="h-px flex-1 bg-[var(--color-graticule)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)]">
            EMAIL ADDRESS
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            style={{ borderRadius: '2px' }}
          />
          {errors.email && (
            <p className="mt-1.5 font-mono text-[10px] text-[var(--color-madder)]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-[10px] tracking-wider text-[var(--color-ink-soft)]">
              PASSWORD
            </label>
            <Link
              href="/forgot-password"
              className="font-mono text-[10px] text-[var(--color-atlantic)] hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className={inputClass}
            style={{ borderRadius: '2px' }}
          />
          {errors.password && (
            <p className="mt-1.5 font-mono text-[10px] text-[var(--color-madder)]">
              {errors.password.message}
            </p>
          )}
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
          disabled={isSubmitting || googleLoading}
          className="flex w-full items-center justify-center gap-2 bg-[var(--color-atlantic)] px-6 py-3 font-mono text-[11px] tracking-wider text-[var(--color-ground)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          style={{ borderRadius: '2px' }}
        >
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          SIGN IN
        </button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function friendlyError(message: string): string {
  if (
    message.includes('user-not-found') ||
    message.includes('wrong-password') ||
    message.includes('invalid-credential')
  )
    return 'Incorrect email or password.';
  if (message.includes('too-many-requests')) return 'Too many attempts. Please try again later.';
  if (message.includes('network')) return 'Network error. Check your connection.';
  return 'Sign in failed. Please try again.';
}
