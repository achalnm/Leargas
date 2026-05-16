'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePreferences } from '@/hooks/usePreferences';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { DashboardGreeting } from './DashboardGreeting';
import { OverviewStats } from './OverviewStats';

export function OverviewContent() {
  const { user } = useAuth();
  const { preferences } = usePreferences(user?.uid);
  const { rate: eurToInr } = useExchangeRate();

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h2 className="text-2xl font-display font-700 tracking-tight mb-1">Ireland at a glance</h2>
        <DashboardGreeting />
      </div>
      <OverviewStats numberFormat={preferences.numberFormat} eurToInr={eurToInr} />
    </div>
  );
}
