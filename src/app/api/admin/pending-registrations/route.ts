import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, users, employees } from '@/lib/drizzle/schema';
import { eq, and, isNull } from 'drizzle-orm';

// GET - Fetch all pending customer registrations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json({
        error: 'Unauthorized - Admin access required'
      }, { status: 401 });
    }

    console.log('[Admin] Fetching pending customer registrations');

    // Get all customers with pending_installation status
    const pendingRegistrations = await db
      .select({
        customerId: customers.id,
        userId: customers.userId,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName,
        email: customers.email,
        phone: customers.phone,
        address: customers.address,
        city: customers.city,
        registeredAt: customers.createdAt,
        status: customers.status,
        assignedEmployeeId: customers.assignedEmployeeId,
      })
      .from(customers)
      .where(and(
        eq(customers.status, 'pending_installation'),
        isNull(customers.meterNumber)
      ));

    // Get assigned employee details if any
    const registrationsWithEmployees = await Promise.all(
      pendingRegistrations.map(async (reg) => {
        let assignedEmployee = null;

        if (reg.assignedEmployeeId) {
          const [employee] = await db
            .select({
              id: employees.id,
              name: employees.employeeName,
              designation: employees.designation,
              phone: employees.phone,
            })
            .from(employees)
            .where(eq(employees.id, reg.assignedEmployeeId))
            .limit(1);

          assignedEmployee = employee || null;
        }

        return {
          ...reg,
          assignedEmployee
        };
      })
    );

    // Get available employees for assignment
    const availableEmployees = await db
      .select({
        id: employees.id,
        name: employees.employeeName,
        designation: employees.designation,
        department: employees.department,
        assignedZone: employees.assignedZone,
      })
      .from(employees)
      .where(eq(employees.status, 'active'));

    console.log(`[Admin] Found ${pendingRegistrations.length} pending registrations`);

    return NextResponse.json({
      pendingRegistrations: registrationsWithEmployees,
      availableEmployees,
      total: registrationsWithEmployees.length
    });

  } catch (error: any) {
    console.error('[Admin] Error fetching pending registrations:', error);
    return NextResponse.json({
      error: 'Failed to fetch pending registrations',
      details: error.message
    }, { status: 500 });
  }
}

// PATCH - Approve registration and assign employee
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json({
        error: 'Unauthorized - Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { customerId, employeeId, action } = body;

    if (!customerId || !action) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'customerId and action are required'
      }, { status: 400 });
    }

    console.log(`[Admin] Processing registration: Customer ${customerId}, Action: ${action}`);

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

    if (customer.status !== 'pending_installation') {
      return NextResponse.json({
        error: 'Invalid customer status',
        details: 'Customer is not in pending_installation status'
      }, { status: 400 });
    }

    if (action === 'approve') {
      if (!employeeId) {
        return NextResponse.json({
          error: 'Employee assignment required',
          details: 'Please select an employee for meter installation'
        }, { status: 400 });
      }

      // Verify employee exists
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, employeeId))
        .limit(1);

      if (!employee) {
        return NextResponse.json({
          error: 'Employee not found'
        }, { status: 404 });
      }

      // Update customer with assigned employee
      await db
        .update(customers)
        .set({
          assignedEmployeeId: employeeId,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customerId));

      console.log(`[Admin] Approved registration for customer ${customerId}, assigned to employee ${employeeId}`);

      return NextResponse.json({
        success: true,
        message: 'Registration approved and employee assigned',
        data: {
          customerId,
          employeeId,
          employeeName: employee.employeeName,
          status: 'assigned_for_installation'
        }
      });

    } else if (action === 'reject') {
      // Update customer status to inactive
      await db
        .update(customers)
        .set({
          status: 'inactive',
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customerId));

      // Also deactivate the user account
      await db
        .update(users)
        .set({
          isActive: 0,
          updatedAt: new Date(),
        })
        .where(eq(users.id, customer.userId));

      console.log(`[Admin] Rejected registration for customer ${customerId}`);

      return NextResponse.json({
        success: true,
        message: 'Registration rejected',
        data: {
          customerId,
          status: 'rejected'
        }
      });

    } else {
      return NextResponse.json({
        error: 'Invalid action',
        details: 'Action must be either approve or reject'
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('[Admin] Error processing registration:', error);
    return NextResponse.json({
      error: 'Failed to process registration',
      details: error.message
    }, { status: 500 });
  }
}