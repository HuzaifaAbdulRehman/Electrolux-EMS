import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings, bills } from '@/lib/drizzle/schema';
import { eq, and, sql, notInArray, isNull, or } from 'drizzle-orm';

// GET /api/customers/without-reading - Get customers without meter reading for current month
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.userType !== 'employee' && session.user.userType !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const month = searchParams.get('month') || new Date().toISOString().split('T')[0].substring(0, 7) + '-01';

    const offset = (page - 1) * limit;

    // Get all customers with their latest meter reading
    let query = db
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
      .where(eq(customers.status, 'active'))
      .$dynamic();

    // Add search filter
    if (search) {
      query = query.where(
        or(
          sql`${customers.fullName} LIKE ${`%${search}%`}`,
          sql`${customers.accountNumber} LIKE ${`%${search}%`}`,
          sql`${customers.meterNumber} LIKE ${`%${search}%`}`
        )
      ) as any;
    }

    const allCustomers = await query.limit(limit).offset(offset);

    // For each customer, check if they have reading for current month
    const customersWithoutReading = await Promise.all(
      allCustomers.map(async (customer) => {
        // Check meter reading for current month
        const [reading] = await db
          .select()
          .from(meterReadings)
          .where(
            and(
              eq(meterReadings.customerId, customer.id),
              sql`DATE_FORMAT(${meterReadings.readingDate}, '%Y-%m-01') = ${month}`
            )
          )
          .limit(1);

        // Check bill for current month
        const [bill] = await db
          .select()
          .from(bills)
          .where(
            and(
              eq(bills.customerId, customer.id),
              eq(bills.billingMonth, month)
            )
          )
          .limit(1);

        // Get last reading for this customer
        const [lastReading] = await db
          .select()
          .from(meterReadings)
          .where(eq(meterReadings.customerId, customer.id))
          .orderBy(sql`${meterReadings.readingDate} DESC`)
          .limit(1);

        return {
          ...customer,
          hasReading: !!reading,
          hasBill: !!bill,
          lastReading: lastReading?.currentReading || 0,
          lastReadingDate: lastReading?.readingDate || null,
        };
      })
    );

    // Filter only customers without reading for current month
    const filtered = customersWithoutReading.filter(c => !c.hasReading && !c.hasBill);

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.status, 'active'));

    const totalCustomers = countResult?.count || 0;
    const customersWithReading = customersWithoutReading.filter(c => c.hasReading || c.hasBill).length;

    return NextResponse.json({
      success: true,
      data: filtered,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasMore: page * limit < filtered.length
      },
      stats: {
        totalCustomers,
        withReading: customersWithReading,
        withoutReading: filtered.length,
        currentMonth: month
      }
    });

  } catch (error: any) {
    console.error('Error fetching customers without reading:', error);
    return NextResponse.json({
      error: 'Failed to fetch customers',
      details: error.message
    }, { status: 500 });
  }
}
