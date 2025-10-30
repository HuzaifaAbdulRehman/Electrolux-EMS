import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { bills, meterReadings, customers, billRequests, notifications, tariffs, tariffSlabs } from '@/lib/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { ApiResponse } from '@/types';

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
    
    // Debug: Check existing bills for this customer
    const allBills = await db
      .select()
      .from(bills)
      .where(eq(bills.customerId, customerId))
      .orderBy(desc(bills.createdAt));
    
    console.log('[Bills Generate POST] All bills for customer:', allBills);

    // Validate inputs
    if (!customerId || !billingMonth) {
      return NextResponse.json(
        { error: 'Customer ID and billing month are required' },
        { status: 400 }
      );
    }

    // Validate billing month format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(billingMonth)) {
      return NextResponse.json(
        { error: 'Invalid billing month format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Check if customer exists and is active
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (customer.status !== 'active') {
      return NextResponse.json(
        { error: `Cannot generate bill for ${customer.status} customer` },
        { status: 400 }
      );
    }

    // Check if bill already exists for this month - use DATE matching (handles timezone)
    console.log('[Bills Generate POST] Checking for existing bill...');
    console.log('[Bills Generate POST] Customer ID:', customerId);
    console.log('[Bills Generate POST] Billing Month (requested):', billingMonth);

    const [existingBill] = await db
      .select()
      .from(bills)
      .where(
        and(
          eq(bills.customerId, customerId),
          eq(bills.billingMonth, billingMonth) // Direct DATE comparison (billingMonth is DATE type)
        )
      )
      .limit(1);

    console.log('[Bills Generate POST] Existing bill check result:', existingBill ? 'FOUND' : 'NOT FOUND');

    if (existingBill) {
      console.log('[Bills Generate POST] ❌ Bill already exists - preventing duplicate');
      console.log('[Bills Generate POST] Existing bill ID:', existingBill.id);
      console.log('[Bills Generate POST] Existing bill month:', existingBill.billingMonth);
      console.log('[Bills Generate POST] Requested month:', billingMonth);

      return NextResponse.json(
        {
          success: false,
          error: 'Bill already exists for this billing month',
          details: `Customer ${customerId} already has a bill for ${existingBill.billingMonth}`,
          existingBillId: existingBill.id
        },
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

    // Get customer's tariff category
    const customerCategory = customer.connectionType || 'Residential';
    console.log('[Bill Generation] Customer category:', customerCategory);

    // Fetch active tariff for this category
    const [activeTariff] = await db
      .select()
      .from(tariffs)
      .where(
        and(
          eq(tariffs.category, customerCategory),
          sql`${tariffs.effectiveDate} <= ${billingMonth}`,
          sql`(${tariffs.validUntil} IS NULL OR ${tariffs.validUntil} >= ${billingMonth})`
        )
      )
      .orderBy(desc(tariffs.effectiveDate))
      .limit(1);

    if (!activeTariff) {
      console.error('[Bill Generation] No active tariff found for category:', customerCategory);
      return NextResponse.json(
        { error: `No active tariff found for ${customerCategory} customers` },
        { status: 400 }
      );
    }

    console.log('[Bill Generation] Using tariff:', activeTariff.id, 'for category:', customerCategory);

    // Calculate bill amounts using tariff slabs
    const unitsConsumed = parseFloat(latestReading.unitsConsumed);

    // Validate consumption
    if (isNaN(unitsConsumed) || unitsConsumed < 0) {
      return NextResponse.json(
        { error: 'Invalid units consumed. Meter reading may be incorrect.' },
        { status: 400 }
      );
    }

    // Warning for zero consumption (still allow but log)
    if (unitsConsumed === 0) {
      console.log('[Bill Generation] WARNING: Zero consumption detected for customer', customerId);
    }
    let baseAmount = 0;
    // Fetch normalized slabs for the active tariff
    const slabs = await db
      .select()
      .from(tariffSlabs)
      .where(eq(tariffSlabs.tariffId, activeTariff.id))
      .orderBy(tariffSlabs.slabOrder);

    // Validate slab configuration
    if (slabs.length === 0) {
      throw new Error(`No tariff slabs found for tariff ID ${activeTariff.id}`);
    }

    // Validate slab structure: check for overlaps and gaps
    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];

      // Validate that rate is positive
      const rate = parseFloat(String(slab.ratePerUnit));
      if (isNaN(rate) || rate < 0) {
        throw new Error(`Invalid rate ${slab.ratePerUnit} for slab ${i + 1}`);
      }

      // Validate slab boundaries
      const start = slab.startUnits ?? 0;
      const end = slab.endUnits;

      if (start < 0) {
        throw new Error(`Slab ${i + 1} has negative start: ${start}`);
      }

      if (end !== null && end < start) {
        throw new Error(`Slab ${i + 1} has end (${end}) less than start (${start})`);
      }

      // Check for overlaps with next slab
      if (i < slabs.length - 1) {
        const nextSlab = slabs[i + 1];
        const nextStart = nextSlab.startUnits ?? 0;

        if (end !== null && end >= nextStart) {
          throw new Error(`Slab ${i + 1} overlaps with slab ${i + 2}: end=${end}, nextStart=${nextStart}`);
        }
      }
    }

    // Calculate bill amount using validated slabs
    let remaining = unitsConsumed;
    for (const s of slabs) {
      if (remaining <= 0) break;
      const start = s.startUnits ?? 0;
      const end = s.endUnits;
      const rate = parseFloat(String(s.ratePerUnit));

      // Calculate slab span: if end is null, it's unbounded (use all remaining units)
      const slabSpan = end === null ? remaining : (end - start + 1);
      const usedInSlab = Math.min(remaining, slabSpan);

      baseAmount += usedInSlab * rate;
      remaining -= usedInSlab;
    }

    const fixedCharges = Number(activeTariff.fixedCharge);
    const electricityDuty = baseAmount * (Number(activeTariff.electricityDutyPercent ?? 0) / 100);
    const gstAmount = (baseAmount + fixedCharges + electricityDuty) * (Number(activeTariff.gstPercent ?? 0) / 100);
    const totalAmount = baseAmount + fixedCharges + electricityDuty + gstAmount;

    console.log('[Bill Generation] Calculation:', {
      unitsConsumed,
      tariffCategory: customerCategory,
      slabsUsed: slabs.map(s => ({ order: s.slabOrder, start: s.startUnits, end: s.endUnits, rate: s.ratePerUnit })),
      baseAmount,
      fixedCharges,
      electricityDuty,
      gstAmount,
      totalAmount
    });

    // Generate unique bill number: BILL-YYYY-XXXXXXXX
    let billNumber: string = '';
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      billNumber = `BILL-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;

      // Check if bill number already exists
      const [existingBill] = await db
        .select()
        .from(bills)
        .where(eq(bills.billNumber, billNumber))
        .limit(1);

      if (!existingBill) break;
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique bill number. Please try again.' },
        { status: 500 }
      );
    }

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

    // Insert bill into database
    console.log('[Bills Generate POST] ✅ Inserting bill into database...');
    const insertResult = await db.insert(bills).values({
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
      // Add tariff reference for audit trail
      tariffId: activeTariff.id,
    } as any);

    const billId = (insertResult as any).insertId;
    console.log('[Bills Generate POST] ✅ Bill inserted successfully - ID:', billId);
    console.log('[Bills Generate POST] Customer ID:', customerId);
    console.log('[Bills Generate POST] Billing Month:', billingMonth);
    console.log('[Bills Generate POST] Total Amount:', totalAmount.toFixed(2));

    // Update customer's outstanding balance and last bill amount
    const newOutstandingBalance = parseFloat(customer.outstandingBalance || '0') + totalAmount;
    await db
      .update(customers)
      .set({
        outstandingBalance: newOutstandingBalance.toFixed(2),
        lastBillAmount: totalAmount.toFixed(2),
      })
      .where(eq(customers.id, customerId));

    console.log('[Bills Generate POST] ✅ Customer balance updated');

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

    // Create notification for customer about new bill
    if (customer.userId) {
      await db.insert(notifications).values({
        userId: customer.userId,
        notificationType: 'billing',
        title: 'New Bill Generated',
        message: `Your bill for ${billingMonth} has been generated. Amount: Rs ${totalAmount.toFixed(2)}. Due date: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
        priority: 'high',
        actionUrl: '/customer/view-bills',
        actionText: 'View Bill',
        isRead: 0,
      } as any);
    }

    // Fetch the created bill
    const [createdBill] = await db
      .select()
      .from(bills)
      .where(eq(bills.id, billId))
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
