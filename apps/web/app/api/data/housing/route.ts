import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { HousingDataPoint, ApiResponse } from '@/types';

export const revalidate = 86400;

export async function GET() {
  try {
    const db = adminDb();
    const [tsSnap, countySnap] = await Promise.all([
      db.collection('housingTimeSeries').orderBy('year').get(),
      db.collection('housingByCounty').orderBy('medianPrice', 'desc').get(),
    ]);

    const data: HousingDataPoint[] = tsSnap.docs.map((doc) => doc.data() as HousingDataPoint);
    const countyData = countySnap.docs.map((doc) => doc.data());

    const response: ApiResponse<HousingDataPoint[]> & { countyData: unknown[] } = {
      data,
      countyData,
      lastUpdated: new Date().toISOString(),
      source: 'CSO Ireland: Residential Property Price Index',
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch housing data', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
