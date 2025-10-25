import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { workOrders, customers, employees, notifications } from '@/lib/drizzle/schema';
import { eq, and, desc, or } from 'drizzle-orm';

// GET /api/work-orders - Get work orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const workType = searchParams.get('workType') || '';
    const customerId = searchParams.get('customerId') || '';

    let query = db
      .select({
        id: workOrders.id,
        customerId: workOrders.customerId,
        title: workOrders.title,
        description: workOrders.description,
        workType: workOrders.workType,
        status: workOrders.status,
        priority: workOrders.priority,
        assignedDate: workOrders.assignedDate,
        dueDate: workOrders.dueDate,
        completionDate: workOrders.completionDate,
        completionNotes: workOrders.completionNotes,
        customerName: customers.fullName,
        customerAccount: customers.accountNumber,
        customerPhone: customers.phone,
        customerAddress: customers.address,
        customerCity: customers.city,
        meterNumber: customers.meterNumber,
        employeeName: employees.employeeName,
      })
      .from(workOrders)
      .leftJoin(customers, eq(workOrders.customerId, customers.id))
      .leftJoin(employees, eq(workOrders.employeeId, employees.id))
      .$dynamic();

    const conditions = [];

    // Filter based on user type
    if (session.user.userType === 'employee') {
      // For employees, show ALL unassigned work orders OR work orders assigned to them
      const { sql } = await import('drizzle-orm');
      conditions.push(
        or(
          eq(workOrders.employeeId, session.user.employeeId!),
          sql`${workOrders.employeeId} IS NULL`
        ) as any
      );
    } else if (session.user.userType === 'customer') {
      conditions.push(eq(workOrders.customerId, session.user.customerId!));
    }

    // Filter by status (can be comma-separated like "assigned,in_progress")
    if (status) {
      const statuses = status.split(',');
      if (statuses.length > 1) {
        const { sql } = await import('drizzle-orm');
        const statusConditions = statuses.map(s => `'${s.trim()}'`).join(',');
        conditions.push(sql`${workOrders.status} IN (${sql.raw(statusConditions)})` as any);
      } else {
        conditions.push(eq(workOrders.status, status as any));
      }
    }

    // Filter by work type
    if (workType) {
      conditions.push(eq(workOrders.workType, workType as any));
    }

    // Filter by customer ID
    if (customerId) {
      conditions.push(eq(workOrders.customerId, parseInt(customerId)));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions) as any);
    }

    const result = await query.orderBy(desc(workOrders.assignedDate));

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json({ error: 'Failed to fetch work orders' }, { status: 500 });
  }
}

// POST /api/work-orders - Create work order (Admin/Employee) or complaint (Customer)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('[Work Orders POST] No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customerId, employeeId, workType, title, description, priority, dueDate } = body;

    // Sanitize priority: map 'normal' to 'medium' to match schema
    const sanitizedPriority = priority === 'normal' ? 'medium' : priority;

    console.log('[Work Orders POST] Request from:', session.user.userType, 'workType:', workType, 'customerId:', session.user.customerId);

    // Customers can create complaint_resolution and meter_reading work orders
    if (session.user.userType === 'customer') {
      if (workType !== 'complaint_resolution' && workType !== 'meter_reading') {
        console.error('[Work Orders POST] Invalid work type for customer:', workType);
        return NextResponse.json({ error: 'Customers can only submit complaints or meter reading requests' }, { status: 403 });
      }

      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }

      // Auto-calculate due date based on work type
      const calculatedDueDate = new Date();
      if (workType === 'complaint_resolution') {
        calculatedDueDate.setDate(calculatedDueDate.getDate() + 7); // 7 days for complaints
      } else if (workType === 'meter_reading') {
        calculatedDueDate.setDate(calculatedDueDate.getDate() + 3); // 3 days for meter readings
      }

      const workOrderData = {
        employeeId: null, // Will be assigned by admin/employee later
        customerId: session.user.customerId,
        workType: workType,
        title,
        description: description || '',
        priority: sanitizedPriority || 'medium',
        status: 'assigned', // 'assigned' status means "awaiting assignment to employee"
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate || calculatedDueDate.toISOString().split('T')[0],
      };

      console.log('[Work Orders POST] Inserting work order:', workOrderData);

      const [workOrder] = await db.insert(workOrders).values(workOrderData as any);

      // Create notification for admin/employees about new request
      // (Optional: could notify specific admin users)

      const message = workType === 'complaint_resolution'
        ? 'Complaint submitted successfully'
        : 'Meter reading request submitted successfully';

      return NextResponse.json({
        success: true,
        message,
        data: {
          workOrderId: workOrder.insertId,
        },
      }, { status: 201 });
    }

    // Admin/Employee creating work orders
    if (!employeeId || !workType || !title || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [workOrder] = await db.insert(workOrders).values({
      employeeId,
      customerId: customerId || null,
      workType,
      title,
      description,
      priority: sanitizedPriority || 'medium',
      status: 'assigned',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Work order created successfully',
      data: {
        workOrderId: workOrder.insertId,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Work Orders POST] Error creating work order:', error);
    console.error('[Work Orders POST] Error stack:', error.stack);
    return NextResponse.json({
      error: 'Failed to create work order',
      details: error.message
    }, { status: 500 });
  }
}

// PATCH /api/work-orders - Update work order status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract ID from URL path if present, otherwise from body
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idFromPath = pathParts[pathParts.length - 1];

    const body = await request.json();
    const id = idFromPath && !isNaN(parseInt(idFromPath)) ? parseInt(idFromPath) : body.id;
    const { status, completionNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get work order
    const [workOrder] = await db
      .select()
      .from(workOrders)
      .where(eq(workOrders.id, id))
      .limit(1);

    if (!workOrder) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    // Verify employee owns this work order
    if (session.user.userType === 'employee' && workOrder.employeeId !== session.user.employeeId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = { status };

    if (status === 'completed') {
      updateData.completionDate = new Date().toISOString().split('T')[0];
      if (completionNotes) {
        updateData.completionNotes = completionNotes;
      }
    }

    await db
      .update(workOrders)
      .set(updateData)
      .where(eq(workOrders.id, id));

    // Create notification for customer when work order is completed
    if (status === 'completed' && workOrder.customerId) {
      // Get customer's userId
      const [customer] = await db
        .select({ userId: customers.userId })
        .from(customers)
        .where(eq(customers.id, workOrder.customerId))
        .limit(1);

      if (customer?.userId) {
        await db.insert(notifications).values({
          userId: customer.userId,
          notificationType: 'work_order',
          title: 'Work Order Completed',
          message: `Your work order "${workOrder.title}" has been completed successfully. ${completionNotes || ''}`,
          priority: 'normal',
          actionUrl: '/customer/services',
          actionText: 'View Details',
          isRead: 0,
        } as any);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Work order updated successfully',
    });
  } catch (error) {
    console.error('Error updating work order:', error);
    return NextResponse.json({ error: 'Failed to update work order' }, { status: 500 });
  }
}