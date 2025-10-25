import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { connectionRequests, workOrders, employees, customers } from '@/lib/drizzle/schema';
import { eq, sql, desc, and, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access connection requests
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    console.log('[Admin Connection Requests] Fetching requests with filters:', { search, status, page, limit });

    // Build where conditions (DBMS: Dynamic Query Building)
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(connectionRequests.applicantName, `%${search}%`),
          like(connectionRequests.applicationNumber, `%${search}%`),
          like(connectionRequests.email, `%${search}%`),
          like(connectionRequests.phone, `%${search}%`)
        )
      );
    }

    if (status !== 'all') {
      whereConditions.push(eq(connectionRequests.status, status as any));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count (DBMS: COUNT with WHERE)
    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(connectionRequests)
      .where(whereClause);

    // Get connection requests with pagination (DBMS: Complex JOIN)
    const requestsData = await db
      .select({
        id: connectionRequests.id,
        applicationNumber: connectionRequests.applicationNumber,
        applicantName: connectionRequests.applicantName,
        email: connectionRequests.email,
        phone: connectionRequests.phone,
        propertyAddress: connectionRequests.propertyAddress,
        city: connectionRequests.city,
        state: connectionRequests.state,
        connectionType: connectionRequests.connectionType,
        loadRequired: connectionRequests.loadRequired,
        status: connectionRequests.status,
        applicationDate: connectionRequests.applicationDate,
        preferredDate: connectionRequests.preferredDate,
        estimatedCharges: connectionRequests.estimatedCharges,
        inspectionDate: connectionRequests.inspectionDate,
        approvalDate: connectionRequests.approvalDate,
        installationDate: connectionRequests.installationDate
      })
      .from(connectionRequests)
      .where(whereClause)
      .orderBy(desc(connectionRequests.applicationDate))
      .limit(limit)
      .offset(offset);

    // Get status counts (DBMS: GROUP BY with COUNT)
    const statusCounts = await db
      .select({
        status: connectionRequests.status,
        count: sql<number>`COUNT(*)`
      })
      .from(connectionRequests)
      .groupBy(connectionRequests.status);

    // Get available employees for assignment (DBMS: JOIN with status filter)
    const availableEmployees = await db
      .select({
        id: employees.id,
        fullName: employees.fullName,
        email: employees.email,
        phone: employees.phone,
        department: employees.department,
        workLoad: sql<number>`COALESCE(COUNT(${workOrders.id}), 0)`
      })
      .from(employees)
      .leftJoin(workOrders, and(
        eq(workOrders.employeeId, employees.id),
        eq(workOrders.status, 'in_progress')
      ))
      .where(eq(employees.status, 'active'))
      .groupBy(employees.id, employees.fullName, employees.email, employees.phone, employees.department)
      .orderBy(sql`workLoad ASC`);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Format status counts
    const statusStats = statusCounts.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {} as Record<string, number>);

    console.log('[Admin Connection Requests] Requests fetched successfully:', {
      total,
      returned: requestsData.length,
      page,
      totalPages,
      availableEmployees: availableEmployees.length
    });

    return NextResponse.json({
      success: true,
      data: {
        requests: requestsData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        },
        statusStats,
        availableEmployees
      },
      message: 'Connection requests fetched successfully'
    });

  } catch (error: any) {
    console.error('[Admin Connection Requests] Error fetching requests:', error);
    return NextResponse.json({
      error: 'Failed to fetch connection requests',
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

    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { requestId, action, employeeId, estimatedCharges, inspectionDate, notes } = body;

    console.log('[Admin Connection Requests] Processing action:', { requestId, action, employeeId });

    // Get the connection request
    const [request] = await db
      .select()
      .from(connectionRequests)
      .where(eq(connectionRequests.id, requestId))
      .limit(1);

    if (!request) {
      return NextResponse.json({
        error: 'Connection request not found'
      }, { status: 404 });
    }

    let updateData: any = {};
    let workOrderData: any = null;

    // Handle different actions (DBMS: Conditional Updates)
    switch (action) {
      case 'approve':
        updateData = {
          status: 'approved',
          approvalDate: new Date().toISOString().split('T')[0],
          estimatedCharges: estimatedCharges || request.estimatedCharges,
          inspectionDate: inspectionDate || request.inspectionDate
        };
        
        // Create work order for installation (DBMS: Transaction with Foreign Key)
        workOrderData = {
          employeeId: employeeId,
          customerId: null, // Will be set when customer is created
          workType: 'new_connection',
          title: `New Connection Installation - ${request.applicationNumber}`,
          description: `Install new ${request.connectionType} connection for ${request.applicantName}`,
          priority: 'high',
          status: 'assigned',
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: request.preferredDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        break;

      case 'reject':
        updateData = {
          status: 'rejected',
          completionNotes: notes || 'Request rejected by admin'
        };
        break;

      case 'schedule_inspection':
        updateData = {
          status: 'under_review',
          inspectionDate: inspectionDate,
          estimatedCharges: estimatedCharges
        };
        break;

      case 'complete_installation':
        updateData = {
          status: 'connected',
          installationDate: new Date().toISOString().split('T')[0]
        };
        break;

      default:
        return NextResponse.json({
          error: 'Invalid action'
        }, { status: 400 });
    }

    // Update connection request (DBMS: UPDATE with WHERE)
    await db
      .update(connectionRequests)
      .set(updateData)
      .where(eq(connectionRequests.id, requestId));

    // Create work order if needed (DBMS: INSERT with Foreign Key)
    if (workOrderData) {
      const [workOrder] = await db
        .insert(workOrders)
        .values(workOrderData as any)
        .returning();

      console.log('[Admin Connection Requests] Work order created:', workOrder.id);
    }

    console.log('[Admin Connection Requests] Request updated successfully:', requestId);

    return NextResponse.json({
      success: true,
      message: `Connection request ${action}ed successfully`,
      data: {
        requestId,
        action,
        workOrderId: workOrderData ? workOrderData.id : null
      }
    });

  } catch (error: any) {
    console.error('[Admin Connection Requests] Error processing request:', error);
    return NextResponse.json({
      error: 'Failed to process connection request',
      details: error.message
    }, { status: 500 });
  }
}
