import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-700 tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-[var(--color-foreground-muted)]">Sign in to access your saved dashboards</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
