import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, bills, payments, meterReadings, workOrders, employees, outages } from '@/lib/drizzle/schema';
import { eq, sql, desc, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Dashboard API] Fetching dashboard data for:', session.user.userType, session.user.id);

    // Get current month for calculations
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().substring(0, 7);

    // 1. BASIC METRICS (DBMS: Aggregate Functions)
    // Get customer count by status
    const customersByStatus = await db
      .select({
        status: customers.status,
        count: sql<number>`COUNT(*)`
      })
      .from(customers)
      .groupBy(customers.status);

    const activeCustomers = customersByStatus.find(c => c.status === 'active')?.count || 0;
    const suspendedCustomers = customersByStatus.find(c => c.status === 'suspended')?.count || 0;
    const inactiveCustomers = customersByStatus.find(c => c.status === 'inactive')?.count || 0;
    const totalCustomersAll = activeCustomers + suspendedCustomers + inactiveCustomers;

    const [totalEmployees] = await db
      .select({ count: sql<number>`COUNT(*)` })
        .from(employees)
        .where(eq(employees.status, 'active'));

    const [totalBills] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bills)
      .where(sql`${bills.billingMonth} LIKE ${currentMonth + '%'}`);

    const [activeBills] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bills)
      .where(eq(bills.status, 'issued'));

    const [totalRevenue] = await db
        .select({
        total: sql<number>`COALESCE(SUM(${bills.totalAmount}), 0)`
      })
      .from(bills)
      .where(sql`${bills.billingMonth} LIKE ${currentMonth + '%'}`);

    const [outstandingAmount] = await db
        .select({
        total: sql<number>`COALESCE(SUM(${bills.totalAmount}), 0)`
        })
        .from(bills)
        .where(eq(bills.status, 'issued'));

    const [paidBills] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bills)
      .where(and(
        sql`${bills.billingMonth} LIKE ${currentMonth + '%'}`,
        eq(bills.status, 'paid')
      ));

    // 2. RECENT BILLS (DBMS: JOIN Operations)
      const recentBills = await db
        .select({
          id: bills.id,
          billNumber: bills.billNumber,
          customerName: customers.fullName,
        accountNumber: customers.accountNumber,
          totalAmount: bills.totalAmount,
          status: bills.status,
        billingMonth: bills.billingMonth,
        dueDate: bills.dueDate
        })
        .from(bills)
      .innerJoin(customers, eq(bills.customerId, customers.id))
      .where(sql`${bills.billingMonth} >= '2024-01-01'`)
      .orderBy(desc(bills.createdAt))
        .limit(5);

    // 3. REVENUE BY CONNECTION TYPE (DBMS: JOIN + GROUP BY)
    const revenueByCategory = await db
        .select({
        category: customers.connectionType,
        total: sql<number>`SUM(${bills.totalAmount})`,
        billCount: sql<number>`COUNT(${bills.id})`
      })
      .from(bills)
      .innerJoin(customers, eq(bills.customerId, customers.id))
      .where(sql`${bills.billingMonth} >= '2024-01-01'`)
      .groupBy(customers.connectionType)
      .orderBy(sql`SUM(${bills.totalAmount}) DESC`);

    // 4. MONTHLY REVENUE TREND (DBMS: Date Functions)
    const monthlyRevenue = await db
        .select({
        month: sql<string>`DATE_FORMAT(${bills.billingMonth}, '%Y-%m')`,
        revenue: sql<number>`SUM(${bills.totalAmount})`
      })
      .from(bills)
      .where(sql`${bills.billingMonth} >= '2024-01-01'`)
      .groupBy(sql`DATE_FORMAT(${bills.billingMonth}, '%Y-%m')`)
      .orderBy(sql`DATE_FORMAT(${bills.billingMonth}, '%Y-%m')`);

    // 5. PAYMENT METHODS (DBMS: JOIN with Payments)
    const paymentMethods = await db
        .select({
        method: payments.paymentMethod,
        count: sql<number>`COUNT(*)`,
        total: sql<number>`SUM(${payments.paymentAmount})`
        })
        .from(payments)
      .innerJoin(bills, eq(payments.billId, bills.id))
      .where(sql`${bills.billingMonth} LIKE ${currentMonth + '%'}`)
      .groupBy(payments.paymentMethod);

    // 6. WORK ORDERS STATUS (DBMS: Conditional Aggregation)
    const workOrderStats = await db
      .select({
        status: workOrders.status,
        count: sql<number>`COUNT(*)`
      })
      .from(workOrders)
      .groupBy(workOrders.status);

    // 7. BILLS STATUS DISTRIBUTION (DBMS: Grouping by Status)
    const billsStatusDistribution = await db
      .select({
        status: bills.status,
        count: sql<number>`COUNT(*)`,
        totalAmount: sql<number>`COALESCE(SUM(${bills.totalAmount}), 0)`
      })
      .from(bills)
      .where(sql`${bills.billingMonth} >= '2024-01-01'`)
      .groupBy(bills.status);

    // 8. CONNECTION TYPE DISTRIBUTION (DBMS: Customer Grouping)
    const connectionTypeDistribution = await db
      .select({
        connectionType: customers.connectionType,
        count: sql<number>`COUNT(*)`,
        activeCount: sql<number>`SUM(CASE WHEN ${customers.status} = 'active' THEN 1 ELSE 0 END)`
      })
      .from(customers)
      .groupBy(customers.connectionType)
      .orderBy(sql`COUNT(*) DESC`);

    // Calculate derived metrics
    const metrics = {
      totalCustomers: totalCustomersAll,
      activeCustomers: activeCustomers,
      suspendedCustomers: suspendedCustomers,
      inactiveCustomers: inactiveCustomers,
      totalEmployees: totalEmployees.count,
      activeBills: activeBills.count,
      monthlyRevenue: totalRevenue.total || 0,
      outstandingAmount: outstandingAmount.total || 0,
      collectionRate: totalBills.count > 0 ? parseFloat(((paidBills.count / totalBills.count) * 100).toFixed(1)) : 0,
      totalBills: totalBills.count,
      paidBills: paidBills.count,
      pendingBills: totalBills.count - paidBills.count,
      paymentRate: totalBills.count > 0 ? (paidBills.count / totalBills.count) * 100 : 0,
      averageBillAmount: totalBills.count > 0 ? (totalRevenue.total || 0) / totalBills.count : 0
    };

    // Format data for charts
    const revenueByCategoryFormatted = revenueByCategory.reduce((acc, item) => {
      acc[item.category] = item.total;
      return acc;
    }, {} as Record<string, number>);

    const monthlyRevenueFormatted = monthlyRevenue.map(item => ({
      month: item.month,
      revenue: item.revenue || 0
    }));

    const paymentMethodsFormatted = paymentMethods.reduce((acc, item) => {
      acc[item.method] = {
        count: item.count,
        total: item.total || 0
      };
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    const billsStatusFormatted = billsStatusDistribution.reduce((acc, item) => {
      acc[item.status] = {
        count: item.count,
        amount: item.totalAmount
      };
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    const connectionTypeFormatted = connectionTypeDistribution.reduce((acc, item) => {
      acc[item.connectionType] = {
        count: item.count,
        activeCount: item.activeCount
      };
      return acc;
    }, {} as Record<string, { count: number; activeCount: number }>);

    const dashboardData = {
      metrics,
      recentBills,
      revenueByCategory: revenueByCategoryFormatted,
      monthlyRevenue: monthlyRevenueFormatted,
      paymentMethods: paymentMethodsFormatted,
      workOrderStats: workOrderStats.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {} as Record<string, number>),
      billsStatus: billsStatusFormatted,
      connectionTypeDistribution: connectionTypeFormatted
    };

    console.log('[Dashboard API] Dashboard data fetched successfully');
    console.log('[Dashboard API] Metrics:', metrics);

      return NextResponse.json({
        success: true,
      data: dashboardData,
      message: 'Dashboard data fetched successfully'
    });

  } catch (error: any) {
    console.error('[Dashboard API] Error fetching dashboard data:', error);
    return NextResponse.json({
      error: 'Failed to fetch dashboard data',
      details: error.message
    }, { status: 500 });
  }
}