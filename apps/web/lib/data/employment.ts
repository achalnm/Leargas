import type { EmploymentDataPoint, SectorEmploymentData, EmploymentStats, ApiResponse } from '@/types';

export async function fetchEmploymentTimeSeries(): Promise<ApiResponse<EmploymentDataPoint[]>> {
  const res = await fetch('/api/data/employment', { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch employment data');
  return res.json() as Promise<ApiResponse<EmploymentDataPoint[]>>;
}

export async function fetchEmploymentBySector(): Promise<ApiResponse<SectorEmploymentData[]>> {
  const res = await fetch('/api/data/employment/sector', { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch sector employment data');
  return res.json() as Promise<ApiResponse<SectorEmploymentData[]>>;
}

export function computeEmploymentStats(data: EmploymentDataPoint[]): EmploymentStats {
  if (data.length === 0) {
    return { currentUnemploymentRate: 0, euAverageRate: 0, yoyChange: 0, totalEmployed: 0 };
  }
  const latest = data[data.length - 1];
  const previousYear = data[data.length - 5] ?? data[0];
  const yoyChange = latest.unemploymentRate - previousYear.unemploymentRate;
  return {
    currentUnemploymentRate: latest.unemploymentRate,
    euAverageRate: latest.euAverageRate ?? 0,
    yoyChange: parseFloat(yoyChange.toFixed(1)),
    totalEmployed: 2_450_000,
  };
}
