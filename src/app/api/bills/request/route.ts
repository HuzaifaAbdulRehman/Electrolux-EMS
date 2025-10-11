import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billingMonth, priority, notes } = body;

    // Validate inputs
    if (!billingMonth) {
      return NextResponse.json(
        { error: 'Billing month is required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Get customer ID from authenticated session
    // 2. Validate billing month
    // 3. Check if bill request already exists
    // 4. Create bill request in database

    const customerId = 1; // Replace with actual session customer ID

    // Generate request ID
    const requestId = `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Insert bill request into database
    const result = await query(
      `INSERT INTO bill_requests
        (request_id, customer_id, billing_month, priority, notes, status, request_date)
       VALUES (?, ?, ?, ?, ?, 'pending', CURDATE())`,
      [requestId, customerId, billingMonth, priority || 'medium', notes || null]
    );

    return NextResponse.json({
      success: true,
      message: 'Bill request submitted successfully',
      requestId: requestId,
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

    return NextResponse.json(
      { error: 'Failed to submit bill request. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch customer's bill requests
export async function GET(request: NextRequest) {
  try {
    // In a real application, get customer ID from session
    const customerId = 1; // Replace with actual session customer ID

    const requests = await query(
      `SELECT
        id, request_id, billing_month, priority, notes, status, request_date,
        created_at, updated_at
       FROM bill_requests
       WHERE customer_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [customerId]
    );

    return NextResponse.json({
      success: true,
      requests: requests
    });

  } catch (error: any) {
    console.error('Fetch requests error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch bill requests' },
      { status: 500 }
    );
  }
}
