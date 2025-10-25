import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { bills, meterReadings, customers, billRequests } from '@/lib/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('[Bills Generate POST] No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only employees can generate bills
    if (session.user.userType !== 'employee') {
      console.error('[Bills Generate POST] User is not an employee');
      return NextResponse.json({ error: 'Forbidden - Only employees can generate bills' }, { status: 403 });
    }

    const body = await request.json();
    const { customerId, billingMonth } = body;

    console.log('[Bills Generate POST] Request data:', { customerId, billingMonth });

    // Validate inputs
    if (!customerId || !billingMonth) {
      return NextResponse.json(
        { error: 'Customer ID and billing month are required' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check if bill already exists for this month
    const [existingBill] = await db
      .select()
      .from(bills)
      .where(
        and(
          eq(bills.customerId, customerId),
          eq(bills.billingMonth, billingMonth)
        )
      )
      .limit(1);

    if (existingBill) {
      return NextResponse.json(
        { error: 'Bill already exists for this billing month' },
        { status: 400 }
      );
    }

    // Get the most recent meter reading for this month
    const billingMonthStart = new Date(billingMonth);
    const billingMonthEnd = new Date(billingMonthStart);
    billingMonthEnd.setMonth(billingMonthEnd.getMonth() + 1);

    const [latestReading] = await db
      .select()
      .from(meterReadings)
      .where(
        and(
          eq(meterReadings.customerId, customerId),
          sql`${meterReadings.readingDate} >= ${billingMonth}`,
          sql`${meterReadings.readingDate} < ${billingMonthEnd.toISOString().split('T')[0]}`
        )
      )
      .orderBy(desc(meterReadings.readingDate))
      .limit(1);

    if (!latestReading) {
      return NextResponse.json(
        { error: 'No meter reading found for this billing month. Please record meter reading first.' },
        { status: 400 }
      );
    }

    // Calculate bill amounts based on Pakistani electricity tariff (simplified)
    const unitsConsumed = parseFloat(latestReading.unitsConsumed);
    const tariffRate = 5.50; // PKR per kWh (simplified - real system has slabs)
    const fixedCharges = 100.00; // PKR

    const baseAmount = unitsConsumed * tariffRate;
    const electricityDuty = baseAmount * 0.16; // 16% electricity duty
    const gstAmount = (baseAmount + fixedCharges + electricityDuty) * 0.18; // 18% GST
    const totalAmount = baseAmount + fixedCharges + electricityDuty + gstAmount;

    // Generate bill number: BILL-YYYY-XXXXXXXX
    const billNumber = `BILL-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15); // 15 days from issue
    const dueDateStr = dueDate.toISOString().split('T')[0];

    console.log('[Bills Generate POST] Calculated bill:', {
      billNumber,
      unitsConsumed,
      baseAmount,
      totalAmount
    });

    // Insert bill
    const [newBill] = await db.insert(bills).values({
      customerId,
      billNumber,
      billingMonth,
      issueDate,
      dueDate: dueDateStr,
      unitsConsumed: unitsConsumed.toFixed(2),
      meterReadingId: latestReading.id,
      baseAmount: baseAmount.toFixed(2),
      fixedCharges: fixedCharges.toFixed(2),
      electricityDuty: electricityDuty.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      status: 'generated',
    } as any);

    // Update customer's outstanding balance and last bill amount
    const newOutstandingBalance = parseFloat(customer.outstandingBalance || '0') + totalAmount;
    await db
      .update(customers)
      .set({
        outstandingBalance: newOutstandingBalance.toFixed(2),
        lastBillAmount: totalAmount.toFixed(2),
      })
      .where(eq(customers.id, customerId));

    console.log('[Bills Generate POST] Bill generated successfully:', newBill.insertId);

    // Update bill_request status to 'completed' if exists
    await db
      .update(billRequests)
      .set({
        status: 'completed',
        updatedAt: new Date()
      })
      .where(
        and(
          eq(billRequests.customerId, customerId),
          eq(billRequests.billingMonth, billingMonth),
          eq(billRequests.status, 'pending')
        )
      );

    console.log('[Bills Generate POST] Bill request marked as completed');

    // Fetch the created bill
    const [createdBill] = await db
      .select()
      .from(bills)
      .where(eq(bills.id, newBill.insertId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: 'Bill generated successfully',
      bill: {
        id: createdBill.id,
        bill_number: createdBill.billNumber,
        total_amount: createdBill.totalAmount,
        billing_month: createdBill.billingMonth,
        units_consumed: createdBill.unitsConsumed,
        base_amount: createdBill.baseAmount,
        fixed_charges: createdBill.fixedCharges,
        electricity_duty: createdBill.electricityDuty,
        gst_amount: createdBill.gstAmount,
        status: createdBill.status,
        issue_date: createdBill.issueDate,
        due_date: createdBill.dueDate
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Bills Generate POST] Error:', error);
    console.error('[Bills Generate POST] Error stack:', error.stack);

    return NextResponse.json({
      error: 'Failed to generate bill',
      details: error.message
    }, { status: 500 });
  }
}
