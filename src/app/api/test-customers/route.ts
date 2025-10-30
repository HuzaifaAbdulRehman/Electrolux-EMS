import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings } from '@/lib/drizzle/schema';
import { eq, and, sql, notExists, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current month
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().substring(0, 7); // YYYY-MM format

    console.log('[TEST API] Current month:', currentMonth);

    // Get all customers
    const allCustomers = await db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName,
        status: customers.status
      })
      .from(customers)
      .where(eq(customers.status, 'active'))
      .limit(10);

    // Get customers with meter readings this month
    const customersWithReadings = await db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName
      })
      .from(customers)
      .innerJoin(meterReadings, eq(customers.id, meterReadings.customerId))
      .where(
        and(
          eq(customers.status, 'active'),
          sql`${meterReadings.readingDate} >= ${currentMonth + '-01'}`,
          sql`${meterReadings.readingDate} < ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString().substring(0, 10)}`
        )
      )
      .groupBy(customers.id)
      .limit(10);

    // Get customers without meter readings this month
    const customersWithoutReadings = await db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName
      })
      .from(customers)
      .where(
        and(
          eq(customers.status, 'active'),
          notExists(
            db.select()
              .from(meterReadings)
              .where(
                and(
                  eq(meterReadings.customerId, customers.id),
                  sql`${meterReadings.readingDate} >= ${currentMonth + '-01'}`,
                  sql`${meterReadings.readingDate} < ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString().substring(0, 10)}`
                )
              )
          )
        )
      )
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        currentMonth,
        totalCustomers: allCustomers.length,
        customersWithReadingsCount: customersWithReadings.length,
        customersWithoutReadingsCount: customersWithoutReadings.length,
        allCustomers: allCustomers,
        customersWithReadings,
        customersWithoutReadings
      }
    });

  } catch (error: any) {
    console.error('[TEST API] Error:', error);
    return NextResponse.json({
      error: 'Failed to test customers',
      details: error.message
    }, { status: 500 });
  }
}

