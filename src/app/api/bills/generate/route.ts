import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, billingMonth } = body;

    // Validate inputs
    if (!customerId || !billingMonth) {
      return NextResponse.json(
        { error: 'Customer ID and billing month are required' },
        { status: 400 }
      );
    }

    // Call the stored procedure to generate bill
    const result = await query(
      'CALL generate_monthly_bill(?, ?)',
      [customerId, billingMonth]
    );

    // Get the generated bill details
    const [billData] = await query(
      `SELECT
        id, bill_number, billing_month, issue_date, due_date,
        units_consumed, base_amount, fixed_charges, electricity_duty,
        gst_amount, total_amount, status
      FROM bills
      WHERE customer_id = ?
      AND billing_month = ?
      ORDER BY created_at DESC
      LIMIT 1`,
      [customerId, billingMonth]
    ) as any[];

    if (!billData) {
      return NextResponse.json(
        { error: 'Bill generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bill generated successfully',
      bill: billData
    });

  } catch (error: any) {
    console.error('Bill generation error:', error);

    // Handle specific error cases
    if (error.message?.includes('No meter reading found')) {
      return NextResponse.json(
        { error: 'No meter reading found for this billing month. Please record meter reading first.' },
        { status: 400 }
      );
    }

    if (error.message?.includes('Bill already exists')) {
      return NextResponse.json(
        { error: 'Bill already exists for this billing month' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate bill. Please try again.' },
      { status: 500 }
    );
  }
}
