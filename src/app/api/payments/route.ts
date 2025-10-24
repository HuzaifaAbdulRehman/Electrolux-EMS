import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { payments, bills, customers } from '@/lib/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// GET /api/payments - Get payments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: payments.id,
        customerName: customers.fullName,
        accountNumber: customers.accountNumber,
        paymentAmount: payments.paymentAmount,
        paymentMethod: payments.paymentMethod,
        paymentDate: payments.paymentDate,
        transactionId: payments.transactionId,
        receiptNumber: payments.receiptNumber,
        status: payments.status,
        billNumber: bills.billNumber,
      })
      .from(payments)
      .leftJoin(customers, eq(payments.customerId, customers.id))
      .leftJoin(bills, eq(payments.billId, bills.id));

    const conditions = [];

    // Filter based on user type
    if (session.user.userType === 'customer') {
      conditions.push(eq(payments.customerId, session.user.customerId!));
    } else if (customerId) {
      conditions.push(eq(payments.customerId, parseInt(customerId)));
    }

    if (conditions.length > 0) {
      query = query.where(conditions[0] as any);
    }

    query = query.orderBy(desc(payments.paymentDate)).limit(limit).offset(offset);
    const result = await query;

    // Get total count
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(payments);
    if (conditions.length > 0) {
      countQuery = countQuery.where(conditions[0] as any);
    }
    const [{ count }] = await countQuery;

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// POST /api/payments - Process payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { billId, paymentMethod, amount } = body;

    if (!billId || !paymentMethod || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get bill details
    const [bill] = await db
      .select()
      .from(bills)
      .where(eq(bills.id, billId))
      .limit(1);

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // Verify customer owns this bill (if customer)
    if (session.user.userType === 'customer' && bill.customerId !== session.user.customerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate transaction and receipt numbers
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;

    // Create payment
    const [payment] = await db.insert(payments).values({
      customerId: bill.customerId,
      billId: bill.id,
      paymentAmount: amount.toString(),
      paymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId,
      receiptNumber,
      status: 'completed',
    });

    // Update bill status
    await db
      .update(bills)
      .set({
        status: 'paid',
        paymentDate: new Date().toISOString().split('T')[0],
      })
      .where(eq(bills.id, billId));

    // Update customer outstanding balance
    await db
      .update(customers)
      .set({
        outstandingBalance: sql`GREATEST(0, ${customers.outstandingBalance} - ${amount})`,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'paid',
      })
      .where(eq(customers.id, bill.customerId));

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        paymentId: payment.insertId,
        transactionId,
        receiptNumber,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}