import { Metadata } from 'next';
import { OverviewContent } from '@/components/dashboard/OverviewContent';

export const metadata: Metadata = { title: 'Overview' };

export default function DashboardPage() {
  return <OverviewContent />;
}
