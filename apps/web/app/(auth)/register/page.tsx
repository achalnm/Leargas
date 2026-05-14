import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display font-700 mb-2 text-2xl tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            Free, no credit card required
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
