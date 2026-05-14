'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { registerWithEmail, signInWithGoogle } from '@/lib/firebase/auth';

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
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
      await registerWithEmail(data.email, data.password, data.displayName);
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? friendlyError(e.message) : 'Registration failed');
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

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:border-[var(--color-accent)] transition-colors';

  return (
    <div className="surface p-8">
      <button
        onClick={handleGoogle}
        disabled={googleLoading || isSubmitting}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors disabled:opacity-50 mb-6"
      >
        {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-foreground-subtle)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">Name</label>
          <input {...register('displayName')} placeholder="Your name" className={inputClass} />
          {errors.displayName && <p className="mt-1.5 text-xs text-[var(--color-error)]">{errors.displayName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">Email</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className={inputClass} />
          {errors.email && <p className="mt-1.5 text-xs text-[var(--color-error)]">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">Password</label>
          <input {...register('password')} type="password" placeholder="At least 8 characters" className={inputClass} />
          {errors.password && <p className="mt-1.5 text-xs text-[var(--color-error)]">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">Confirm password</label>
          <input {...register('confirmPassword')} type="password" placeholder="••••••••" className={inputClass} />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-[var(--color-error)]">{errors.confirmPassword.message}</p>}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-xs text-red-400">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || googleLoading}
          className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create account
        </button>
      </form>

      <p className="text-center text-xs text-[var(--color-foreground-subtle)] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--color-accent)] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function friendlyError(message: string): string {
  if (message.includes('email-already-in-use')) return 'An account with that email already exists.';
  if (message.includes('network')) return 'Network error. Check your connection.';
  return 'Registration failed. Please try again.';
}
