import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { billingMonth, priority, notes } = body;

    // Validate inputs
    if (!billingMonth) {
      return NextResponse.json(
        { error: 'Billing month is required' },
        { status: 400 }
      );
    }

    // Get customer ID from authenticated session
    let customerId: number;

    if (session.user.userType === 'customer') {
      // For customers, get their customer record
      const customerRecord = await db
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.userId, parseInt(session.user.id)))
        .limit(1);

      if (!customerRecord.length) {
        return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
      }

      customerId = customerRecord[0].id;
    } else if (session.user.userType === 'admin' || session.user.userType === 'employee') {
      // For admin/employee, customer ID should be provided in request
      if (!body.customerId) {
        return NextResponse.json({ error: 'Customer ID is required for admin/employee requests' }, { status: 400 });
      }
      customerId = body.customerId;
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 403 });
    }

    // Generate request ID
    const requestId = `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Insert bill request into database
    // Note: bill_requests table needs to be created if it doesn't exist
    const result = await query(
      `INSERT INTO bill_requests
        (request_id, customer_id, billing_month, priority, notes, status, request_date, created_by)
       VALUES (?, ?, ?, ?, ?, 'pending', CURDATE(), ?)
       ON DUPLICATE KEY UPDATE
         priority = VALUES(priority),
         notes = VALUES(notes),
         updated_at = NOW()`,
      [requestId, customerId, billingMonth, priority || 'medium', notes || null, session.user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Bill request submitted successfully',
      requestId: requestId,
      customerId: customerId,
      estimatedTime: priority === 'high' ? '12 hours' : '24 hours'
    });

  } catch (error: any) {
    console.error('Bill request error:', error);

    // Handle specific error cases
    if (error.message?.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'You have already requested a bill for this month' },
        { status: 400 }
      );
    }

    if (error.message?.includes('bill_requests')) {
      return NextResponse.json(
        { error: 'Bill request feature is not available. Please contact support.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit bill request. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch customer's bill requests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let customerId: number;

    if (session.user.userType === 'customer') {
      // For customers, get their customer record
      const customerRecord = await db
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.userId, parseInt(session.user.id)))
        .limit(1);

      if (!customerRecord.length) {
        return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
      }

      customerId = customerRecord[0].id;
    } else if (session.user.userType === 'admin' || session.user.userType === 'employee') {
      // For admin/employee, optionally filter by customer ID from query params
      const searchParams = request.nextUrl.searchParams;
      const customerIdParam = searchParams.get('customerId');

      if (customerIdParam) {
        customerId = parseInt(customerIdParam);
        if (isNaN(customerId)) {
          return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
        }
      } else {
        // Return all requests for admin/employee
        const requests = await query(
          `SELECT
            br.id, br.request_id, br.customer_id, br.billing_month, br.priority,
            br.notes, br.status, br.request_date, br.created_at, br.updated_at,
            c.full_name as customer_name, c.account_number
           FROM bill_requests br
           LEFT JOIN customers c ON br.customer_id = c.id
           ORDER BY br.created_at DESC
           LIMIT 100`
        );

        return NextResponse.json({
          success: true,
          requests: requests || []
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 403 });
    }

    // Fetch requests for specific customer
    const requests = await query(
      `SELECT
        br.id, br.request_id, br.billing_month, br.priority, br.notes,
        br.status, br.request_date, br.created_at, br.updated_at
       FROM bill_requests br
       WHERE br.customer_id = ?
       ORDER BY br.created_at DESC
       LIMIT 50`,
      [customerId]
    );

    return NextResponse.json({
      success: true,
      customerId: customerId,
      requests: requests || []
    });

  } catch (error: any) {
    console.error('Fetch requests error:', error);

    if (error.message?.includes('bill_requests')) {
      return NextResponse.json({
        success: true,
        requests: [],
        message: 'Bill request history not available'
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch bill requests' },
      { status: 500 }
    );
  }
}