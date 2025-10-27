import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings } from '@/lib/drizzle/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current month
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().substring(0, 7);
    const currentMonthStart = currentMonth + '-01';
    const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString().substring(0, 10);

    console.log('[DEBUG API] Current month:', currentMonth);
    console.log('[DEBUG API] Date range:', currentMonthStart, 'to', nextMonthStart);

    // Get all active customers
    const allCustomers = await db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName,
        phone: customers.phone
      })
      .from(customers)
      .where(eq(customers.status, 'active'))
      .limit(10);

    // Get customers with readings this month
    const customersWithReadings = await db
      .select({ customerId: meterReadings.customerId })
      .from(meterReadings)
      .where(
        and(
          sql`${meterReadings.readingDate} >= ${currentMonthStart}`,
          sql`${meterReadings.readingDate} < ${nextMonthStart}`
        )
      );

    // Get customers without readings
    const customerIdsWithReadings = new Set(customersWithReadings.map(r => r.customerId));
    const customersWithoutReadings = allCustomers.filter(customer => 
      !customerIdsWithReadings.has(customer.id)
    );

    return NextResponse.json({
      success: true,
      debug: {
        currentMonth,
        dateRange: { currentMonthStart, nextMonthStart },
        totalCustomers: allCustomers.length,
        customersWithReadingsCount: customersWithReadings.length,
        customersWithoutReadingsCount: customersWithoutReadings.length,
        allCustomers: allCustomers,
        customersWithReadings: customersWithReadings,
        customersWithoutReadings: customersWithoutReadings
      }
    });

  } catch (error: any) {
    console.error('[DEBUG API] Error:', error);
    return NextResponse.json({
      error: 'Failed to debug customers',
      details: error.message
    }, { status: 500 });
  }
}
