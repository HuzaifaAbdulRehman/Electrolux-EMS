import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, employees, notifications } from '@/lib/drizzle/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { generateMeterNumber } from '@/lib/utils/meterNumberGenerator';

// GET - Fetch pending meter installations for the logged-in employee
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.userType !== 'employee') {
      return NextResponse.json({
        error: 'Unauthorized - Employee access required'
      }, { status: 401 });
    }

    const employeeId = session.user.employeeId;

    if (!employeeId) {
      return NextResponse.json({
        error: 'Employee ID not found'
      }, { status: 400 });
    }

    console.log(`[Employee] Fetching meter installations for employee ${employeeId}`);

    // Get all customers assigned to this employee for meter installation
    const pendingInstallations = await db
      .select({
        customerId: customers.id,
        userId: customers.userId,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName,
        email: customers.email,
        phone: customers.phone,
        address: customers.address,
        city: customers.city,
        state: customers.state,
        pincode: customers.pincode,
        connectionType: customers.connectionType,
        registeredAt: customers.createdAt,
        status: customers.status,
      })
      .from(customers)
      .where(and(
        eq(customers.assignedEmployeeId, employeeId),
        eq(customers.status, 'pending_installation'),
        isNull(customers.meterNumber)
      ));

    // Get completed installations today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await db
      .select({
        customerId: customers.id,
        meterNumber: customers.meterNumber,
        fullName: customers.fullName,
        installedAt: customers.updatedAt,
      })
      .from(customers)
      .where(and(
        eq(customers.assignedEmployeeId, employeeId),
        eq(customers.status, 'active')
      ));

    const completedTodayCount = completedToday.filter(c =>
      c.installedAt && new Date(c.installedAt) >= today
    ).length;

    console.log(`[Employee] Found ${pendingInstallations.length} pending installations`);

    return NextResponse.json({
      pendingInstallations,
      completedToday: completedTodayCount,
      totalPending: pendingInstallations.length,
      recentCompletions: completedToday.slice(0, 5)
    });

  } catch (error: any) {
    console.error('[Employee] Error fetching meter installations:', error);
    return NextResponse.json({
      error: 'Failed to fetch meter installations',
      details: error.message
    }, { status: 500 });
  }
}

// PATCH - Complete meter installation
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.userType !== 'employee') {
      return NextResponse.json({
        error: 'Unauthorized - Employee access required'
      }, { status: 401 });
    }

    const employeeId = session.user.employeeId;

    if (!employeeId) {
      return NextResponse.json({
        error: 'Employee ID not found'
      }, { status: 400 });
    }

    const body = await request.json();
    const { customerId, zone } = body;

    if (!customerId) {
      return NextResponse.json({
        error: 'Customer ID is required'
      }, { status: 400 });
    }

    console.log(`[Employee] Installing meter for customer ${customerId}`);

    // Get customer details
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (!customer) {
      return NextResponse.json({
        error: 'Customer not found'
      }, { status: 404 });
    }

    // Verify this customer is assigned to this employee
    if (customer.assignedEmployeeId !== employeeId) {
      return NextResponse.json({
        error: 'Unauthorized',
        details: 'This customer is not assigned to you'
      }, { status: 403 });
    }

    if (customer.status !== 'pending_installation') {
      return NextResponse.json({
        error: 'Invalid customer status',
        details: 'Customer is not pending installation'
      }, { status: 400 });
    }

    // Generate meter number
    const meterNumber = await generateMeterNumber(customer.city);

    console.log(`[Employee] Generated meter number: ${meterNumber}`);

    // Update customer with meter number and activate account
    await db
      .update(customers)
      .set({
        meterNumber,
        zone: zone || null,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));

    // Create notification for customer
    await db.insert(notifications).values({
      userId: customer.userId,
      title: 'Meter Installation Completed',
      message: `Your electricity meter has been successfully installed! Your meter number is ${meterNumber}. You can now login to your account and start using all features.`,
      type: 'success',
      isRead: 0,
      relatedType: 'meter_installation',
      relatedId: customerId,
      actionUrl: '/login',
      createdAt: new Date(),
    } as any);

    // Get employee details for response
    const [employee] = await db
      .select({
        name: employees.employeeName,
      })
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);

    console.log(`[Employee] Meter installation completed for customer ${customerId}`);

    return NextResponse.json({
      success: true,
      message: 'Meter installation completed successfully',
      data: {
        customerId,
        meterNumber,
        zone,
        installedBy: employee?.name || 'Unknown',
        installedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[Employee] Error completing meter installation:', error);
    return NextResponse.json({
      error: 'Failed to complete meter installation',
      details: error.message
    }, { status: 500 });
  }
}