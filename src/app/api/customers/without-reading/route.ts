import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings, bills } from '@/lib/drizzle/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only employees and admins can access this endpoint
    if (session.user.userType !== 'employee' && session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Current month (October 2025)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const billingMonth = `${currentYear}-${currentMonth}-01`;

    console.log('[API] ===== Customers Without Bills API =====');
    console.log('[API] Current billing month:', billingMonth);
    console.log('[API] Search:', search, 'Page:', page, 'Limit:', limit);

    // Step 1: Get all active customers
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
        averageMonthlyUsage: customers.averageMonthlyUsage
      })
      .from(customers)
      .where(eq(customers.status, 'active'));

    console.log('[API] Total active customers:', allCustomers.length);

    // Step 2: Check each customer for bill status and last reading
    const customersWithStatus = [];

    for (const customer of allCustomers) {
      // Check if customer has bill for current month (use DATE comparison for timezone handling)
      const customerBills = await db
          .select({ id: bills.id })
          .from(bills)
          .where(
            and(
              eq(bills.customerId, customer.id),
            sql`DATE(${bills.billingMonth}) = ${billingMonth}` // ✅ Compare DATE only
          )
          )
          .limit(1);

      const hasBill = customerBills.length > 0;

      // Get last meter reading for this customer (any month)
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
        lastReadingDate: lastReading ? lastReading.readingDate : null
      });
    }

    // Step 3: Filter to show only customers WITHOUT bills for current month
    let customersWithoutBills = customersWithStatus.filter(c => !c.hasBill);

    console.log('[API] Customers with bills:', customersWithStatus.filter(c => c.hasBill).length);
    console.log('[API] Customers without bills (before search):', customersWithoutBills.length);

    // ✅ Calculate GLOBAL stats BEFORE search filter (stats should always show totals)
    const globalStats = {
      totalCustomers: allCustomers.length,
      customersWithReading: customersWithStatus.filter(c => c.hasBill).length,
      customersWithoutReading: customersWithoutBills.length,
      withBill: customersWithStatus.filter(c => c.hasBill).length, // Keep for backwards compatibility
      withoutBill: customersWithoutBills.length, // Keep for backwards compatibility
      currentMonth: billingMonth
    };

    // Step 4: Apply search filter if provided (for results only, not stats)
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase().trim();
      customersWithoutBills = customersWithoutBills.filter(customer =>
        customer.fullName.toLowerCase().includes(searchLower) ||
        customer.accountNumber.toLowerCase().includes(searchLower) ||
        customer.meterNumber.toLowerCase().includes(searchLower) ||
        customer.phone.toLowerCase().includes(searchLower)
      );
      console.log('[API] After search filter:', customersWithoutBills.length, '(filtered from', globalStats.customersWithoutReading, ')');
    }

    // Step 5: Apply pagination (on search results, not global data)
    const totalCount = customersWithoutBills.length;
    const paginatedCustomers = customersWithoutBills.slice(offset, offset + limit);

    console.log('[API] Returning:', paginatedCustomers.length, 'customers (page', page, 'of', Math.ceil(totalCount / limit) + ')');
    console.log('[API] Stats remain global - not affected by search');

    const pagination = {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1
    };

    return NextResponse.json({
      success: true,
      data: paginatedCustomers,
      stats: globalStats, // ✅ Always return global stats, not search-filtered stats
      pagination
    });

  } catch (error: any) {
    console.error('[API] CRITICAL ERROR:', error);
    console.error('[API] Error stack:', error.stack);
    return NextResponse.json({
      error: 'Failed to fetch customers',
      details: error.message
    }, { status: 500 });
  }
}
