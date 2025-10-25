import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { outages, customers } from '@/lib/drizzle/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let zone = searchParams.get('zone');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    // If customer user, get their zone and filter automatically
    let customerZone = null;
    if (session.user.userType === 'customer') {
      const userId = parseInt(session.user.id);
      const [customer] = await db
        .select({ zone: customers.zone })
        .from(customers)
        .where(eq(customers.userId, userId));

      if (customer?.zone) {
        customerZone = customer.zone;
        zone = customer.zone; // Override zone parameter with customer's zone
      }
    }

    // Build where conditions
    const conditions = [];
    if (zone) conditions.push(eq(outages.zone, zone));
    if (status) conditions.push(eq(outages.status, status as any));
    if (type) conditions.push(eq(outages.outageType, type as any));

    // Get outages with pagination
    const outagesList = await db
      .select()
      .from(outages)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(outages.scheduledStartTime))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(outages)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: outagesList,
      customerZone: customerZone,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('[Outages API] Error fetching outages:', error);
    return NextResponse.json({
      error: 'Failed to fetch outages',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can create outages
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      areaName,
      zone,
      outageType,
      reason,
      severity,
      scheduledStartTime,
      scheduledEndTime,
      affectedCustomerCount
    } = body;

    // Validate required fields
    if (!areaName || !zone || !outageType || !severity) {
      return NextResponse.json({
        error: 'Missing required fields: areaName, zone, outageType, severity'
      }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const newOutage = await db.insert(outages).values({
      areaName,
      zone,
      outageType,
      reason,
      severity,
      scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime) : null,
      scheduledEndTime: scheduledEndTime ? new Date(scheduledEndTime) : null,
      affectedCustomerCount: affectedCustomerCount || 0,
      status: 'scheduled',
      createdBy: userId
    });

    return NextResponse.json({
      success: true,
      message: 'Outage created successfully',
      data: { id: newOutage.insertId }
    });

  } catch (error: any) {
    console.error('[Outages API] Error creating outage:', error);
    return NextResponse.json({
      error: 'Failed to create outage',
      details: error.message
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can update outages
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Outage ID is required' }, { status: 400 });
    }

    // Convert datetime strings to Date objects if present
    if (updateData.scheduledStartTime) {
      updateData.scheduledStartTime = new Date(updateData.scheduledStartTime);
    }
    if (updateData.scheduledEndTime) {
      updateData.scheduledEndTime = new Date(updateData.scheduledEndTime);
    }
    if (updateData.actualStartTime) {
      updateData.actualStartTime = new Date(updateData.actualStartTime);
    }
    if (updateData.actualEndTime) {
      updateData.actualEndTime = new Date(updateData.actualEndTime);
    }

    await db.update(outages)
      .set(updateData)
      .where(eq(outages.id, id));

    return NextResponse.json({
      success: true,
      message: 'Outage updated successfully'
    });

  } catch (error: any) {
    console.error('[Outages API] Error updating outage:', error);
    return NextResponse.json({
      error: 'Failed to update outage',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can delete outages
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Outage ID is required' }, { status: 400 });
    }

    await db.delete(outages).where(eq(outages.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Outage deleted successfully'
    });

  } catch (error: any) {
    console.error('[Outages API] Error deleting outage:', error);
    return NextResponse.json({
      error: 'Failed to delete outage',
      details: error.message
    }, { status: 500 });
  }
}
