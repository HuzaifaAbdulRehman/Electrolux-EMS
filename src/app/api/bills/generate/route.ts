import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { bills, meterReadings, customers, billRequests, notifications, tariffs } from '@/lib/drizzle/schema';
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
          sql`DATE(${bills.billingMonth}) = ${billingMonth}` // ✅ Compare DATE only, ignore time/timezone
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

    // Parse tariff values once for clarity
    const slab1End = Number(activeTariff.slab1End);
    const slab2End = Number(activeTariff.slab2End);
    const slab3End = Number(activeTariff.slab3End);
    const slab4End = Number(activeTariff.slab4End);

    const slab1Rate = Number(activeTariff.slab1Rate);
    const slab2Rate = Number(activeTariff.slab2Rate);
    const slab3Rate = Number(activeTariff.slab3Rate);
    const slab4Rate = Number(activeTariff.slab4Rate);
    const slab5Rate = Number(activeTariff.slab5Rate);

    // Progressive slab-based calculation
    // Each slab charges only for units within that specific range
    if (unitsConsumed <= slab1End) {
      // All units in slab 1 (e.g., 0-100 @ Rs 4.50/unit)
      baseAmount = unitsConsumed * slab1Rate;
    } else if (unitsConsumed <= slab2End) {
      // Slab 1 full + partial slab 2 (e.g., 100@4.50 + 50@6.00 for 150 units)
      baseAmount = (slab1End * slab1Rate) +
                   ((unitsConsumed - slab1End) * slab2Rate);
    } else if (unitsConsumed <= slab3End) {
      // Slab 1 full + Slab 2 full + partial slab 3
      baseAmount = (slab1End * slab1Rate) +
                   ((slab2End - slab1End) * slab2Rate) +
                   ((unitsConsumed - slab2End) * slab3Rate);
    } else if (unitsConsumed <= slab4End) {
      // Slab 1 + Slab 2 + Slab 3 + partial slab 4
      baseAmount = (slab1End * slab1Rate) +
                   ((slab2End - slab1End) * slab2Rate) +
                   ((slab3End - slab2End) * slab3Rate) +
                   ((unitsConsumed - slab3End) * slab4Rate);
    } else {
      // All slabs full + slab 5 for excess (500+ units)
      baseAmount = (slab1End * slab1Rate) +
                   ((slab2End - slab1End) * slab2Rate) +
                   ((slab3End - slab2End) * slab3Rate) +
                   ((slab4End - slab3End) * slab4Rate) +
                   ((unitsConsumed - slab4End) * slab5Rate);
    }

    const fixedCharges = parseFloat(activeTariff.fixedCharge);
    const electricityDuty = baseAmount * (parseFloat(activeTariff.electricityDutyPercent || '0') / 100);
    const gstAmount = (baseAmount + fixedCharges + electricityDuty) * (parseFloat(activeTariff.gstPercent || '0') / 100);
    const totalAmount = baseAmount + fixedCharges + electricityDuty + gstAmount;

    console.log('[Bill Generation] Calculation:', {
      unitsConsumed,
      tariffCategory: customerCategory,
      slabBreakdown: {
        slab1: unitsConsumed <= slab1End ? unitsConsumed * slab1Rate : slab1End * slab1Rate,
        slab2: unitsConsumed > slab1End && unitsConsumed <= slab2End ? (unitsConsumed - slab1End) * slab2Rate : unitsConsumed > slab2End ? (slab2End - slab1End) * slab2Rate : 0,
        slab3: unitsConsumed > slab2End && unitsConsumed <= slab3End ? (unitsConsumed - slab2End) * slab3Rate : unitsConsumed > slab3End ? (slab3End - slab2End) * slab3Rate : 0,
        slab4: unitsConsumed > slab3End && unitsConsumed <= slab4End ? (unitsConsumed - slab3End) * slab4Rate : unitsConsumed > slab4End ? (slab4End - slab3End) * slab4Rate : 0,
        slab5: unitsConsumed > slab4End ? (unitsConsumed - slab4End) * slab5Rate : 0,
      },
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
    const billingMonthDate = new Date(billingMonth);
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15); // 15 days from issue

    console.log('[Bills Generate POST] Calculated bill:', {
      billNumber,
      unitsConsumed,
      baseAmount,
      totalAmount
    });

    // Insert bill into database
    console.log('[Bills Generate POST] ✅ Inserting bill into database...');
    const [newBill] = await db.insert(bills).values({
      customerId,
      billNumber,
      billingMonth: billingMonthDate,
      issueDate,
      dueDate: dueDate,
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

    console.log('[Bills Generate POST] ✅ Bill inserted successfully - ID:', newBill.id);
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
      .where(eq(bills.id, newBill.id))
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
