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

    let query = db
      .select({
        id: workOrders.id,
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
        employeeName: employees.employeeName,
      })
      .from(workOrders)
      .leftJoin(customers, eq(workOrders.customerId, customers.id))
      .leftJoin(employees, eq(workOrders.employeeId, employees.id))
      .$dynamic();

    const conditions = [];

    // Filter based on user type
    if (session.user.userType === 'employee') {
      conditions.push(eq(workOrders.employeeId, session.user.employeeId!));
    } else if (session.user.userType === 'customer') {
      conditions.push(eq(workOrders.customerId, session.user.customerId!));
    }

    if (status) {
      conditions.push(eq(workOrders.status, status as any));
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customerId, employeeId, workType, title, description, priority, dueDate } = body;

    // Customers can only create complaint_resolution work orders for themselves
    if (session.user.userType === 'customer') {
      if (workType !== 'complaint_resolution') {
        return NextResponse.json({ error: 'Customers can only submit complaints' }, { status: 403 });
      }

      if (!title || !description) {
        return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
      }

      // Auto-calculate due date (7 days from now for complaints)
      const calculatedDueDate = new Date();
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 7);

      const [workOrder] = await db.insert(workOrders).values({
        employeeId: null, // Will be assigned by admin/employee later
        customerId: session.user.customerId,
        workType: 'complaint_resolution',
        title,
        description,
        priority: priority || 'medium',
        status: 'assigned', // 'assigned' status means "awaiting assignment to employee"
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: calculatedDueDate.toISOString().split('T')[0],
      } as any);

      // Create notification for admin/employees about new complaint
      // (Optional: could notify specific admin users)

      return NextResponse.json({
        success: true,
        message: 'Complaint submitted successfully',
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
      priority: priority || 'medium',
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
  } catch (error) {
    console.error('Error creating work order:', error);
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 });
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