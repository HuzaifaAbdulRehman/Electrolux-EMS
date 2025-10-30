import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, users } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer data based on user ID
    const userId = parseInt(session.user.id);

    const [customerData] = await db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        meterNumber: customers.meterNumber,
        zone: customers.zone,
        fullName: customers.fullName,
        email: customers.email,
        phone: customers.phone,
        address: customers.address,
        city: customers.city,
        state: customers.state,
        pincode: customers.pincode,
        connectionType: customers.connectionType,
        status: customers.status,
        connectionDate: customers.connectionDate,
        lastBillAmount: customers.lastBillAmount,
        lastPaymentDate: customers.lastPaymentDate,
        averageMonthlyUsage: customers.averageMonthlyUsage,
        outstandingBalance: customers.outstandingBalance,
        paymentStatus: customers.paymentStatus,
      })
      .from(customers)
      .where(eq(customers.userId, userId))
      .limit(1);

    if (!customerData) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: customerData,
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

