import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in · Léargas',
};

export default function LoginPage() {
  return (
    <div>
      <p className="mb-3 font-mono text-[9px] tracking-[0.2em] text-[var(--color-ink-soft)]">
        SIGN IN · ACCESS YOUR SHEETS
      </p>
      <h1
        className="font-display mb-6 text-3xl font-semibold tracking-tight text-[var(--color-ink)]"
        style={{ fontVariationSettings: '"opsz" 36' }}
      >
        Welcome back
      </h1>
      <LoginForm />
      <p className="mt-5 text-center font-mono text-[10px] text-[var(--color-ink-soft)]">
        No account?{' '}
        <Link href="/register" className="text-[var(--color-atlantic)] hover:underline">
          Register free
        </Link>
      </p>
    </div>
  );
}
