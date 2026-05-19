import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { WeatherDataPoint, ApiResponse } from '@/types';

export const revalidate = 86400;

export async function GET() {
  try {
    const db = adminDb();
    const snapshot = await db.collection('weatherMonthly').orderBy('month').get();
    const data: WeatherDataPoint[] = snapshot.docs.map((doc) => doc.data() as WeatherDataPoint);

    const response: ApiResponse<WeatherDataPoint[]> = {
      data,
      lastUpdated: new Date().toISOString(),
      source: 'Met Éireann: Historical Climate Data',
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch weather data', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
