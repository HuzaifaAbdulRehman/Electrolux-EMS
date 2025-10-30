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

    // Get current month - use October 2025 for seeded data
    const currentDate = new Date();
    const currentMonth = '2025-10'; // Force to October 2025 for seeded data
    
    console.log('[DEBUG] Current month:', currentMonth);

    // Get all active customers
    const allCustomers = await db
      .select({ id: customers.id, fullName: customers.fullName, accountNumber: customers.accountNumber })
      .from(customers)
      .where(eq(customers.status, 'active'));

    // Get all meter readings for current month
    const readingsThisMonth = await db
      .select({ 
        id: meterReadings.id, 
        customerId: meterReadings.customerId, 
        readingDate: meterReadings.readingDate,
        currentReading: meterReadings.currentReading
      })
      .from(meterReadings)
      .where(sql`${meterReadings.readingDate} LIKE ${currentMonth + '%'}`);

    // Get all meter readings (for comparison)
    const allReadings = await db
      .select({ 
        id: meterReadings.id, 
        customerId: meterReadings.customerId, 
        readingDate: meterReadings.readingDate
      })
      .from(meterReadings)
      .limit(10);

    // Calculate stats
    const customerIdsWithReadings = new Set(readingsThisMonth.map(r => r.customerId));
    const customersWithoutReadings = allCustomers.filter(customer => 
      !customerIdsWithReadings.has(customer.id)
    );

    return NextResponse.json({
      success: true,
      debug: {
        currentMonth,
        totalCustomers: allCustomers.length,
        readingsThisMonth: readingsThisMonth.length,
        customersWithReadings: customerIdsWithReadings.size,
        customersWithoutReadings: customersWithoutReadings.length,
        sampleCustomers: allCustomers.slice(0, 5),
        sampleReadings: readingsThisMonth.slice(0, 5),
        allReadingsSample: allReadings,
        customerIdsWithReadings: Array.from(customerIdsWithReadings)
      }
    });

  } catch (error: any) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json({
      error: 'Failed to debug stats',
      details: error.message
    }, { status: 500 });
  }
}

