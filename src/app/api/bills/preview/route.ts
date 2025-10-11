import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { error: 'Month parameter is required' },
        { status: 400 }
      );
    }

    // Get total active customers
    const [totalCustomers] = await query(
      `SELECT COUNT(*) as total FROM customers WHERE status = 'active'`
    ) as any[];

    // Get customers with meter readings for the month
    const [withReadings] = await query(
      `SELECT COUNT(DISTINCT customer_id) as count
       FROM meter_readings
       WHERE DATE_FORMAT(reading_date, '%Y-%m') = ?`,
      [month]
    ) as any[];

    const total = totalCustomers.total;
    const withReadingsCount = withReadings.count;
    const withoutReadingsCount = total - withReadingsCount;

    return NextResponse.json({
      total_customers: total,
      with_readings: withReadingsCount,
      without_readings: withoutReadingsCount,
      month: month
    });

  } catch (error: any) {
    console.error('Preview load error:', error);

    return NextResponse.json(
      { error: 'Failed to load preview data' },
      { status: 500 }
    );
  }
}
