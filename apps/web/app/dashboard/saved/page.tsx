import { Metadata } from 'next';
import { SavedDashboardsView } from '@/components/dashboard/SavedDashboardsView';

export const metadata: Metadata = { title: 'Saved Dashboards' };

export default function SavedPage() {
  return <SavedDashboardsView />;
}
