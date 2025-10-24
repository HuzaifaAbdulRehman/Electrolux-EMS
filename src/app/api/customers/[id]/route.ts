import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, bills, payments, meterReadings } from '@/lib/drizzle/schema';
import { eq, desc, sql } from 'drizzle-orm';

// GET /api/customers/[id] - Get customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerId = parseInt(params.id);

    // Customers can only view their own data
    if (session.user.userType === 'customer' && session.user.customerId !== customerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get customer details
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get recent bills
    const recentBills = await db
      .select({
        id: bills.id,
        billNumber: bills.billNumber,
        billingMonth: bills.billingMonth,
        totalAmount: bills.totalAmount,
        status: bills.status,
        dueDate: bills.dueDate,
      })
      .from(bills)
      .where(eq(bills.customerId, customerId))
      .orderBy(desc(bills.issueDate))
      .limit(5);

    // Get recent payments
    const recentPayments = await db
      .select({
        id: payments.id,
        paymentAmount: payments.paymentAmount,
        paymentMethod: payments.paymentMethod,
        paymentDate: payments.paymentDate,
        status: payments.status,
      })
      .from(payments)
      .where(eq(payments.customerId, customerId))
      .orderBy(desc(payments.paymentDate))
      .limit(5);

    // Get recent meter readings
    const recentReadings = await db
      .select({
        id: meterReadings.id,
        currentReading: meterReadings.currentReading,
        previousReading: meterReadings.previousReading,
        unitsConsumed: meterReadings.unitsConsumed,
        readingDate: meterReadings.readingDate,
      })
      .from(meterReadings)
      .where(eq(meterReadings.customerId, customerId))
      .orderBy(desc(meterReadings.readingDate))
      .limit(6);

    // Get statistics
    const [stats] = await db
      .select({
        totalBills: sql<number>`count(distinct ${bills.id})`,
        totalPaid: sql<number>`sum(case when ${bills.status} = 'paid' then ${bills.totalAmount} else 0 end)`,
        totalOutstanding: sql<number>`sum(case when ${bills.status} != 'paid' then ${bills.totalAmount} else 0 end)`,
        avgMonthlyConsumption: sql<number>`avg(${meterReadings.unitsConsumed})`,
      })
      .from(bills)
      .leftJoin(meterReadings, eq(bills.customerId, meterReadings.customerId))
      .where(eq(bills.customerId, customerId));

    return NextResponse.json({
      success: true,
      data: {
        customer,
        recentBills,
        recentPayments,
        recentReadings,
        statistics: stats,
      },
    });

  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer details' },
      { status: 500 }
    );
  }
}

// PATCH /api/customers/[id] - Update customer
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerId = parseInt(params.id);

    // Only admin can update any customer
    // Customers can update their own limited fields
    if (session.user.userType === 'customer' && session.user.customerId !== customerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // If customer is updating their own profile, limit the fields they can update
    if (session.user.userType === 'customer') {
      const allowedFields = ['phone', 'address', 'city', 'state', 'pincode'];
      const filteredBody: any = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          filteredBody[field] = body[field];
        }
      }
      body = filteredBody;
    }

    // Update customer
    await db
      .update(customers)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully',
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete customer (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can delete customers
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const customerId = parseInt(params.id);

    // Soft delete by setting status to inactive
    await db
      .update(customers)
      .set({
        status: 'inactive',
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));

    return NextResponse.json({
      success: true,
      message: 'Customer deactivated successfully',
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}