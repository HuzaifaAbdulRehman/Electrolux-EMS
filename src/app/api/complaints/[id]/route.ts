import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { complaints, workOrders, notifications, employees } from '@/lib/drizzle/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/complaints/[id] - Get single complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const complaint = await db
      .select()
      .from(complaints)
      .where(eq(complaints.id, parseInt(params.id)))
      .limit(1);

    if (!complaint.length) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    // Check permissions
    const complaintData = complaint[0];
    if (session.user.userType === 'customer' && complaintData.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (session.user.userType === 'employee' && complaintData.employeeId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: complaint[0],
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json({ error: 'Failed to fetch complaint' }, { status: 500 });
  }
}

// PATCH /api/complaints/[id] - Update complaint status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, resolutionNotes, employeeId } = body;
    
    console.log('Complaint update request:', { complaintId: params.id, status, employeeId, resolutionNotes });

    const complaint = await db
      .select()
      .from(complaints)
      .where(eq(complaints.id, parseInt(params.id)))
      .limit(1);

    if (!complaint.length) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const complaintData = complaint[0];
    let updateData: any = { status };

    // Handle different status transitions
    if (status === 'under_review') {
      updateData.reviewedAt = new Date().toISOString();
    } else if (status === 'assigned') {
      updateData.assignedAt = new Date().toISOString();
      updateData.employeeId = parseInt(employeeId);
    } else if (status === 'in_progress') {
      updateData.assignedAt = new Date().toISOString();
    } else if (status === 'resolved') {
      updateData.resolvedAt = new Date().toISOString();
      updateData.resolutionNotes = resolutionNotes;
    } else if (status === 'closed') {
      updateData.closedAt = new Date().toISOString();
    }

    console.log('Updating complaint with data:', updateData);
    
    await db
      .update(complaints)
      .set(updateData)
      .where(eq(complaints.id, parseInt(params.id)));

    console.log('Complaint updated successfully');

    // Send notifications based on status change (simplified)
    try {
      if (status === 'assigned' && employeeId) {
        // Get employee user ID for notification
        const employee = await db
          .select({ userId: employees.userId })
          .from(employees)
          .where(eq(employees.id, parseInt(employeeId)))
          .limit(1);
        
        if (employee.length) {
          await db.insert(notifications).values({
            userId: employee[0].userId,
            notificationType: 'complaint',
            title: 'New Complaint Assigned',
            message: `You have been assigned complaint: ${complaintData.title}`,
            priority: complaintData.priority === 'urgent' ? 'high' : 'medium',
            actionUrl: '/employee/work-orders',
            isRead: 0,
          } as any);
        }
      }
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // Don't fail the complaint update if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint updated successfully',
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      error: 'Failed to update complaint', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
