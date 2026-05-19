import { Metadata } from 'next';
import { WeatherDashboard } from '@/components/dashboard/WeatherDashboard';

export const metadata: Metadata = { title: 'Weather & Climate' };

export default function WeatherPage() {
  return <WeatherDashboard />;
}
