import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings } from '@/lib/drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all customers
    const allCustomers = await db
      .select({ id: customers.id, fullName: customers.fullName, accountNumber: customers.accountNumber })
      .from(customers)
      .where(eq(customers.status, 'active'));

    // Get all meter readings
    const allReadings = await db
      .select({ 
        id: meterReadings.id, 
        customerId: meterReadings.customerId, 
        readingDate: meterReadings.readingDate,
        currentReading: meterReadings.currentReading
      })
      .from(meterReadings)
      .orderBy(meterReadings.readingDate);

    // Get readings for October 2025
    const octoberReadings = await db
      .select({ 
        id: meterReadings.id, 
        customerId: meterReadings.customerId, 
        readingDate: meterReadings.readingDate
      })
      .from(meterReadings)
      .where(sql`${meterReadings.readingDate} LIKE '2025-10%'`);

    // Get readings for different months
    const readingsByMonth = await db
      .select({ 
        readingDate: meterReadings.readingDate,
        count: sql<number>`COUNT(*)`
      })
      .from(meterReadings)
      .groupBy(meterReadings.readingDate)
      .orderBy(meterReadings.readingDate);

    return NextResponse.json({
      success: true,
      data: {
        totalCustomers: allCustomers.length,
        totalReadings: allReadings.length,
        octoberReadings: octoberReadings.length,
        sampleCustomers: allCustomers.slice(0, 5),
        sampleReadings: allReadings.slice(0, 5),
        octoberSampleReadings: octoberReadings.slice(0, 5),
        readingsByMonth: readingsByMonth.slice(0, 10)
      }
    });

  } catch (error: any) {
    console.error('[TEST] Error:', error);
    return NextResponse.json({
      error: 'Failed to test database',
      details: error.message
    }, { status: 500 });
  }
}
