import { Metadata } from 'next';
import { EmploymentDashboard } from '@/components/dashboard/EmploymentDashboard';

export const metadata: Metadata = { title: 'Employment' };

export default function EmploymentPage() {
  return <EmploymentDashboard />;
}
