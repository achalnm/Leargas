import { Metadata } from 'next';
import { HousingDashboard } from '@/components/dashboard/HousingDashboard';

export const metadata: Metadata = { title: 'Housing Market' };

export default function HousingPage() {
  return <HousingDashboard />;
}
