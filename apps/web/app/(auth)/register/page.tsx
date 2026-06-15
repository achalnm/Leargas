import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register · Léargas',
};

export default function RegisterPage() {
  return (
    <div>
      <p className="mb-3 font-mono text-[9px] tracking-[0.2em] text-[var(--color-ink-soft)]">
        NEW ACCOUNT · FREE ACCESS
      </p>
      <h1
        className="font-display mb-6 text-3xl font-semibold tracking-tight text-[var(--color-ink)]"
        style={{ fontVariationSettings: '"opsz" 36' }}
      >
        Create your account
      </h1>
      <RegisterForm />
      <p className="mt-5 text-center font-mono text-[10px] text-[var(--color-ink-soft)]">
        Already registered?{' '}
        <Link href="/login" className="text-[var(--color-atlantic)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
