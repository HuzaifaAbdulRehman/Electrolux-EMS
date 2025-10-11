import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billingMonth } = body;

    // Validate input
    if (!billingMonth) {
      return NextResponse.json(
        { error: 'Billing month is required' },
        { status: 400 }
      );
    }

    // Call the stored procedure for bulk generation
    const result = await query(
      'CALL bulk_generate_bills(?)',
      [billingMonth]
    ) as any;

    // Extract the result from the stored procedure
    // The result structure depends on your MySQL stored procedure output
    const summaryData = result[0][0];

    return NextResponse.json({
      success: true,
      message: 'Bills generated successfully',
      total_processed: summaryData.total_processed,
      bills_generated: summaryData.bills_generated,
      failed: summaryData.failed,
      billing_month: summaryData.billing_month,
      details: {
        no_meter_reading: summaryData.failed,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Bulk bill generation error:', error);

    return NextResponse.json(
      { error: 'Failed to generate bills. Please try again.' },
      { status: 500 }
    );
  }
}
