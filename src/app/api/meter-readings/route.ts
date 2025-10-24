import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { meterReadings, customers, employees } from '@/lib/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// GET /api/meter-readings - Get meter readings
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
        id: meterReadings.id,
        customerName: customers.fullName,
        accountNumber: customers.accountNumber,
        meterNumber: meterReadings.meterNumber,
        currentReading: meterReadings.currentReading,
        previousReading: meterReadings.previousReading,
        unitsConsumed: meterReadings.unitsConsumed,
        readingDate: meterReadings.readingDate,
        meterCondition: meterReadings.meterCondition,
        employeeName: employees.employeeName,
      })
      .from(meterReadings)
      .leftJoin(customers, eq(meterReadings.customerId, customers.id))
      .leftJoin(employees, eq(meterReadings.employeeId, employees.id))
      .$dynamic();

    const conditions = [];

    // Filter based on user type
    if (session.user.userType === 'customer') {
      conditions.push(eq(meterReadings.customerId, session.user.customerId!));
    } else if (customerId) {
      conditions.push(eq(meterReadings.customerId, parseInt(customerId)));
    }

    if (conditions.length > 0) {
      query = query.where(conditions[0] as any);
    }

    query = query.orderBy(desc(meterReadings.readingDate)).limit(limit).offset(offset);
    const result = await query;

    // Get total count
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(meterReadings).$dynamic();
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
    console.error('Error fetching meter readings:', error);
    return NextResponse.json({ error: 'Failed to fetch meter readings' }, { status: 500 });
  }
}

// POST /api/meter-readings - Record new meter reading
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('[Meter Readings POST] No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Meter Readings POST] Request from:', session.user.userType, 'employeeId:', session.user.employeeId);

    // Only employees can record meter readings
    if (session.user.userType !== 'employee') {
      console.error('[Meter Readings POST] User is not an employee');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { customerId, currentReading, meterCondition, accessibility, notes } = body;

    console.log('[Meter Readings POST] Request data:', { customerId, currentReading, meterCondition, accessibility });

    if (!customerId || !currentReading) {
      console.error('[Meter Readings POST] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    // Get previous reading
    const [previousReading] = await db
      .select()
      .from(meterReadings)
      .where(eq(meterReadings.customerId, customerId))
      .orderBy(desc(meterReadings.readingDate))
      .limit(1);

    const previousReadingValue = previousReading ? parseFloat(previousReading.currentReading) : 0;
    const currentReadingValue = parseFloat(currentReading);

    if (currentReadingValue < previousReadingValue) {
      return NextResponse.json({
        error: 'Current reading cannot be less than previous reading'
      }, { status: 400 });
    }

    const unitsConsumed = currentReadingValue - previousReadingValue;

    // Create meter reading
    const [reading] = await db.insert(meterReadings).values({
      customerId,
      meterNumber: customer.meterNumber,
      currentReading: currentReadingValue.toString(),
      previousReading: previousReadingValue.toString(),
      unitsConsumed: unitsConsumed.toString(),
      readingDate: new Date().toISOString().split('T')[0],
      readingTime: new Date(),
      meterCondition: meterCondition || 'good',
      accessibility: accessibility || 'accessible',
      employeeId: session.user.employeeId,
      notes,
    } as any);

    // Update customer's average monthly usage
    const avgUsage = await db
      .select({ avg: sql<number>`AVG(${meterReadings.unitsConsumed})` })
      .from(meterReadings)
      .where(eq(meterReadings.customerId, customerId));

    if (avgUsage[0]?.avg != null) {
      await db
        .update(customers)
        .set({
          averageMonthlyUsage: Number(avgUsage[0].avg).toFixed(2),
        })
        .where(eq(customers.id, customerId));
    }

    return NextResponse.json({
      success: true,
      message: 'Meter reading recorded successfully',
      data: {
        readingId: reading.insertId,
        unitsConsumed,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Meter Readings POST] Error recording meter reading:', error);
    console.error('[Meter Readings POST] Error stack:', error.stack);
    return NextResponse.json({
      error: 'Failed to record meter reading',
      details: error.message
    }, { status: 500 });
  }
}