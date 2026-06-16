import type { HousingDataPoint, CountyHousingData, HousingStats, ApiResponse } from '@/types';

export async function fetchHousingTimeSeries(): Promise<ApiResponse<HousingDataPoint[]>> {
  const res = await fetch('/api/data/housing', { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch housing data');
  return res.json() as Promise<ApiResponse<HousingDataPoint[]>>;
}

export async function fetchHousingByCounty(): Promise<ApiResponse<CountyHousingData[]>> {
  const res = await fetch('/api/data/housing/county', { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch county housing data');
  return res.json() as Promise<ApiResponse<CountyHousingData[]>>;
}

export function computeHousingStats(data: HousingDataPoint[]): HousingStats {
  if (data.length === 0) {
    return {
      nationalMedianPrice: 0,
      dublinMedianPrice: 0,
      yoyChangeNational: 0,
      yoyChangeDublin: 0,
    };
  }
  const latest = data[data.length - 1];
  const previousYear = data[data.length - 4] ?? data[0];
  const yoyNational =
    ((latest.nationalMedianPrice - previousYear.nationalMedianPrice) /
      previousYear.nationalMedianPrice) *
    100;
  const yoyDublin =
    ((latest.dublinMedianPrice - previousYear.dublinMedianPrice) / previousYear.dublinMedianPrice) *
    100;
  return {
    nationalMedianPrice: latest.nationalMedianPrice,
    dublinMedianPrice: latest.dublinMedianPrice,
    yoyChangeNational: parseFloat(yoyNational.toFixed(1)),
    yoyChangeDublin: parseFloat(yoyDublin.toFixed(1)),
  };
}
