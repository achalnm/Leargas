import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { EmploymentDataPoint, ApiResponse } from '@/types';

export const revalidate = 86400;

export async function GET() {
  try {
    const db = adminDb();
    const snapshot = await db.collection('employmentTimeSeries').orderBy('year').get();
    const data: EmploymentDataPoint[] = snapshot.docs.map(
      (doc) => doc.data() as EmploymentDataPoint
    );

    const response: ApiResponse<EmploymentDataPoint[]> = {
      data,
      lastUpdated: new Date().toISOString(),
      source: 'CSO Ireland: Labour Force Survey',
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch employment data', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
