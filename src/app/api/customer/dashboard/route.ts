import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, bills, payments, meterReadings } from '@/lib/drizzle/schema';
import { eq, sql, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow customers to access this endpoint
    if (session.user.userType !== 'customer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('[Customer Dashboard API] Fetching dashboard data for customer:', session.user.id);

    // Get customer details using the numeric userId
    const userId = parseInt(session.user.id);
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.userId, userId));

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().substring(0, 7);

    // Get current bill (most recent issued or paid bill)
    const [currentBill] = await db
      .select()
      .from(bills)
      .where(eq(bills.customerId, customer.id))
      .orderBy(desc(bills.createdAt))
      .limit(1);

    // Get recent bills (last 6 months)
    const recentBills = await db
      .select()
      .from(bills)
      .where(eq(bills.customerId, customer.id))
      .orderBy(desc(bills.billingMonth))
      .limit(6);

    // Get recent payments (last 5 payments)
    const recentPayments = await db
      .select({
        id: payments.id,
        billId: payments.billId,
        paymentAmount: payments.paymentAmount,
        paymentDate: payments.paymentDate,
        paymentMethod: payments.paymentMethod,
        receiptNumber: payments.receiptNumber
      })
      .from(payments)
      .innerJoin(bills, eq(payments.billId, bills.id))
      .where(eq(bills.customerId, customer.id))
      .orderBy(desc(payments.paymentDate))
      .limit(5);

    // Get consumption history (last 6 months from bills) - sorted chronologically
    const consumptionHistory = recentBills
      .map(bill => ({
        billingPeriod: bill.billingMonth,
        unitsConsumed: parseFloat(bill.unitsConsumed?.toString() || '0'),
        totalAmount: parseFloat(bill.totalAmount?.toString() || '0')
      }))
      .sort((a, b) => new Date(a.billingPeriod).getTime() - new Date(b.billingPeriod).getTime());

    // Calculate average consumption from last 6 months
    const avgConsumption = consumptionHistory.length > 0
      ? Math.round(consumptionHistory.reduce((sum, item) => sum + item.unitsConsumed, 0) / consumptionHistory.length)
      : 0;

    // Calculate average monthly cost
    const avgMonthlyCost = consumptionHistory.length > 0
      ? Math.round(consumptionHistory.reduce((sum, item) => sum + item.totalAmount, 0) / consumptionHistory.length)
      : 0;

    // Calculate consumption trend (comparing last 2 months)
    let consumptionTrend = 'stable';
    let trendPercentage = 0;
    if (consumptionHistory.length >= 2) {
      const current = consumptionHistory[consumptionHistory.length - 1].unitsConsumed;
      const previous = consumptionHistory[consumptionHistory.length - 2].unitsConsumed;
      if (previous > 0) {
        trendPercentage = Math.round(((current - previous) / previous) * 100);
        if (trendPercentage > 10) consumptionTrend = 'increasing';
        else if (trendPercentage < -10) consumptionTrend = 'decreasing';
      }
    }

    // Calculate outstanding balance (sum of all unpaid bills)
    const [outstandingResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${bills.totalAmount}), 0)`
      })
      .from(bills)
      .where(and(
        eq(bills.customerId, customer.id),
        eq(bills.status, 'issued')
      ));

    // Calculate total paid amount (lifetime)
    const [totalPaidResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${payments.paymentAmount}), 0)`
      })
      .from(payments)
      .innerJoin(bills, eq(payments.billId, bills.id))
      .where(eq(bills.customerId, customer.id));

    const dashboardData = {
      accountNumber: customer.accountNumber,
      currentBill: currentBill || null,
      recentBills: recentBills || [],
      recentPayments: recentPayments || [],
      consumptionHistory: consumptionHistory || [],
      avgConsumption: avgConsumption,
      avgMonthlyCost: avgMonthlyCost,
      consumptionTrend: consumptionTrend,
      trendPercentage: trendPercentage,
      outstandingBalance: outstandingResult?.total?.toString() || '0',
      totalPaid: totalPaidResult?.total?.toString() || '0'
    };

    console.log('[Customer Dashboard API] Dashboard data fetched successfully');
    console.log('[Customer Dashboard API] Outstanding balance:', dashboardData.outstandingBalance);

    return NextResponse.json({
      success: true,
      data: dashboardData,
      message: 'Customer dashboard data fetched successfully'
    });

  } catch (error: any) {
    console.error('[Customer Dashboard API] Error fetching dashboard data:', error);
    return NextResponse.json({
      error: 'Failed to fetch customer dashboard data',
      details: error.message
    }, { status: 500 });
  }
}
