'use client';

import { useAuth } from '@/hooks/useAuth';

function getGreeting(hour: number, firstName: string): string {
  if (hour < 12) return `Good morning, ${firstName}`;
  if (hour < 17) return `Good afternoon, ${firstName}`;
  return `Good evening, ${firstName}`;
}

export function DashboardGreeting() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const firstName = user.displayName?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'there';
  const greeting = getGreeting(new Date().getHours(), firstName);

  return (
    <p className="text-sm text-[var(--color-foreground-muted)]">
      {greeting}.{' '}
      <span className="text-[var(--color-foreground-subtle)]">
        Here&apos;s Ireland at a glance.
      </span>
    </p>
  );
}
