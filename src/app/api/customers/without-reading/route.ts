import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings, bills } from '@/lib/drizzle/schema';
import { eq, and, sql, or, desc } from 'drizzle-orm';

// GET /api/customers/without-reading - Get customers without bill for current month
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.userType !== 'employee' && session.user.userType !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const month = searchParams.get('month') || new Date().toISOString().split('T')[0].substring(0, 7) + '-01';

    console.log('[API] Starting customer fetch. Month:', month, 'Search:', search);

    // Build WHERE condition
    let whereCondition: any = eq(customers.status, 'active');

    if (search && search.trim().length > 0) {
      whereCondition = and(
        eq(customers.status, 'active'),
        or(
          sql`${customers.fullName} LIKE ${`%${search}%`}`,
          sql`${customers.accountNumber} LIKE ${`%${search}%`}`,
          sql`${customers.meterNumber} LIKE ${`%${search}%`}`
        )
      );
    }

    // Fetch all active customers
    const allCustomers = await db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        meterNumber: customers.meterNumber,
        fullName: customers.fullName,
        phone: customers.phone,
        address: customers.address,
        city: customers.city,
        state: customers.state,
        connectionType: customers.connectionType,
        tariffType: customers.tariffType,
        zone: customers.zone,
      })
      .from(customers)
      .where(whereCondition);

    console.log('[API] Total customers fetched:', allCustomers.length);

    // For each customer, check bill status and get last reading
    const customersWithStatus = [];

    for (const customer of allCustomers) {
      try {
        // Check if customer has bill for current month
        const billsForMonth = await db
          .select({ id: bills.id })
          .from(bills)
          .where(
            and(
              eq(bills.customerId, customer.id),
              eq(bills.billingMonth, month)
            )
          )
          .limit(1);

        const hasBill = billsForMonth.length > 0;

        // Get last meter reading (from any month)
        const lastReadings = await db
          .select({
            currentReading: meterReadings.currentReading,
            readingDate: meterReadings.readingDate
          })
          .from(meterReadings)
          .where(eq(meterReadings.customerId, customer.id))
          .orderBy(desc(meterReadings.readingDate))
          .limit(1);

        const lastReading = lastReadings.length > 0 ? lastReadings[0] : null;

        customersWithStatus.push({
          ...customer,
          hasBill: hasBill,
          lastReading: lastReading ? parseFloat(lastReading.currentReading) : 0,
          lastReadingDate: lastReading ? lastReading.readingDate : null,
        });
      } catch (customerError: any) {
        console.error(`[API] Error processing customer ${customer.id}:`, customerError.message);
        // Continue with next customer
      }
    }

    console.log('[API] Processed customers with status:', customersWithStatus.length);

    // Filter to show only customers WITHOUT bills for current month
    const customersWithoutBills = customersWithStatus.filter(c => !c.hasBill);

    console.log('[API] Customers without bills:', customersWithoutBills.length);
    console.log('[API] Customers with bills:', customersWithStatus.filter(c => c.hasBill).length);

    // Get total customer count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.status, 'active'));

    const totalCustomers = totalCount[0]?.count || 0;
    const customersWithBill = customersWithStatus.filter(c => c.hasBill).length;

    console.log('[API] Final stats - Total:', totalCustomers, 'With Bill:', customersWithBill, 'Without Bill:', customersWithoutBills.length);

    return NextResponse.json({
      success: true,
      data: customersWithoutBills,
      stats: {
        totalCustomers,
        withBill: customersWithBill,
        withoutBill: customersWithoutBills.length,
        currentMonth: month
      }
    });

  } catch (error: any) {
    console.error('[API] CRITICAL ERROR:', error);
    console.error('[API] Error stack:', error.stack);
    return NextResponse.json({
      error: 'Failed to fetch customers',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
