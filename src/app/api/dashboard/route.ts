import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, bills, payments, employees, workOrders, meterReadings, connectionApplications, notifications } from '@/lib/drizzle/schema';
import { eq, sql, desc, and, gte, lte } from 'drizzle-orm';
import { subDays, startOfMonth, endOfMonth, format, addDays, parseISO, differenceInDays } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userType = session.user.userType;

    // Admin Dashboard
    if (userType === 'admin') {
      // Get key metrics
      const [customerCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(eq(customers.status, 'active'));

      const [employeeCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(employees)
        .where(eq(employees.status, 'active'));

      const currentMonth = new Date();
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);

      // Revenue this month
      const [monthlyRevenue] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${payments.paymentAmount}), 0)`,
        })
        .from(payments)
        .where(
          and(
            eq(payments.status, 'completed'),
            gte(payments.paymentDate, format(startDate, 'yyyy-MM-dd') as any),
            lte(payments.paymentDate, format(endDate, 'yyyy-MM-dd') as any)
          )
        );

      // Outstanding amount
      const [outstanding] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${bills.totalAmount}), 0)`,
        })
        .from(bills)
        .where(eq(bills.status, 'issued'));

      // Collection rate
      const [billStats] = await db
        .select({
          totalBills: sql<number>`count(*)`,
          paidBills: sql<number>`sum(case when ${bills.status} = 'paid' then 1 else 0 end)`,
        })
        .from(bills);

      const collectionRate = billStats.totalBills > 0
        ? (billStats.paidBills / billStats.totalBills * 100).toFixed(1)
        : '0';

      // Pending work orders
      const [pendingWorkOrders] = await db
        .select({ count: sql<number>`count(*)` })
        .from(workOrders)
        .where(eq(workOrders.status, 'assigned'));

      // Recent activities
      const recentBills = await db
        .select({
          id: bills.id,
          billNumber: bills.billNumber,
          customerName: customers.fullName,
          totalAmount: bills.totalAmount,
          status: bills.status,
          issueDate: bills.issueDate,
        })
        .from(bills)
        .leftJoin(customers, eq(bills.customerId, customers.id))
        .orderBy(desc(bills.issueDate))
        .limit(5);

      const recentPayments = await db
        .select({
          id: payments.id,
          customerName: customers.fullName,
          paymentAmount: payments.paymentAmount,
          paymentMethod: payments.paymentMethod,
          paymentDate: payments.paymentDate,
        })
        .from(payments)
        .leftJoin(customers, eq(payments.customerId, customers.id))
        .where(eq(payments.status, 'completed'))
        .orderBy(desc(payments.paymentDate))
        .limit(5);

      // Revenue by connection type
      const revenueByType = await db
        .select({
          connectionType: customers.connectionType,
          total: sql<number>`COALESCE(SUM(${payments.paymentAmount}), 0)`,
        })
        .from(payments)
        .leftJoin(customers, eq(payments.customerId, customers.id))
        .where(eq(payments.status, 'completed'))
        .groupBy(customers.connectionType);

      // Monthly revenue trend (last 6 months)
      const monthlyTrend = await db
        .select({
          month: sql<string>`DATE_FORMAT(${payments.paymentDate}, '%Y-%m')`,
          total: sql<number>`COALESCE(SUM(${payments.paymentAmount}), 0)`,
        })
        .from(payments)
        .where(
          and(
            eq(payments.status, 'completed'),
            gte(payments.paymentDate, format(subDays(new Date(), 180), 'yyyy-MM-dd') as any)
          )
        )
        .groupBy(sql`DATE_FORMAT(${payments.paymentDate}, '%Y-%m')`)
        .orderBy(sql`DATE_FORMAT(${payments.paymentDate}, '%Y-%m')`);

      return NextResponse.json({
        success: true,
        data: {
          metrics: {
            totalCustomers: customerCount.count,
            totalEmployees: employeeCount.count,
            monthlyRevenue: monthlyRevenue.total,
            outstandingAmount: outstanding.total,
            collectionRate: parseFloat(collectionRate),
            pendingWorkOrders: pendingWorkOrders.count,
          },
          recentBills,
          recentPayments,
          revenueByType,
          monthlyTrend,
        },
      });
    }

    // Employee Dashboard
    if (userType === 'employee') {
      const employeeId = session.user.employeeId;

      // Get employee's work orders
      const [assignedOrders] = await db
        .select({ count: sql<number>`count(*)` })
        .from(workOrders)
        .where(
          and(
            eq(workOrders.employeeId, employeeId!),
            eq(workOrders.status, 'assigned')
          )
        );

      const [completedOrders] = await db
        .select({ count: sql<number>`count(*)` })
        .from(workOrders)
        .where(
          and(
            eq(workOrders.employeeId, employeeId!),
            eq(workOrders.status, 'completed')
          )
        );

      // Recent meter readings by this employee
      const [readingsToday] = await db
        .select({ count: sql<number>`count(*)` })
        .from(meterReadings)
        .where(
          and(
            eq(meterReadings.employeeId, employeeId!),
            eq(meterReadings.readingDate, format(new Date(), 'yyyy-MM-dd') as any)
          )
        );

      // Recent work orders
      const recentWorkOrders = await db
        .select({
          id: workOrders.id,
          title: workOrders.title,
          workType: workOrders.workType,
          status: workOrders.status,
          priority: workOrders.priority,
          dueDate: workOrders.dueDate,
          customerName: customers.fullName,
        })
        .from(workOrders)
        .leftJoin(customers, eq(workOrders.customerId, customers.id))
        .where(eq(workOrders.employeeId, employeeId!))
        .orderBy(desc(workOrders.assignedDate))
        .limit(10);

      return NextResponse.json({
        success: true,
        data: {
          metrics: {
            assignedOrders: assignedOrders.count,
            completedOrders: completedOrders.count,
            readingsToday: readingsToday.count,
          },
          recentWorkOrders,
        },
      });
    }

    // Customer Dashboard
    if (userType === 'customer') {
      const customerId = session.user.customerId;

      // Get customer details
      const [customer] = await db
        .select({
          accountNumber: customers.accountNumber,
          fullName: customers.fullName,
          outstandingBalance: customers.outstandingBalance,
          lastBillAmount: customers.lastBillAmount,
          averageMonthlyUsage: customers.averageMonthlyUsage,
        })
        .from(customers)
        .where(eq(customers.id, customerId!))
        .limit(1);

      // Get recent bills
      const recentBills = await db
        .select({
          id: bills.id,
          billNumber: bills.billNumber,
          billingMonth: bills.billingMonth,
          unitsConsumed: bills.unitsConsumed,
          totalAmount: bills.totalAmount,
          status: bills.status,
          dueDate: bills.dueDate,
        })
        .from(bills)
        .where(eq(bills.customerId, customerId!))
        .orderBy(desc(bills.issueDate))
        .limit(6);

      // Get consumption trend from bills (last 6 months)
      const consumptionHistory = await db
        .select({
          billingPeriod: bills.billingMonth,
          unitsConsumed: bills.unitsConsumed,
          totalAmount: bills.totalAmount,
        })
        .from(bills)
        .where(eq(bills.customerId, customerId!))
        .orderBy(desc(bills.billingMonth))
        .limit(6);

      // Get last payment
      const [lastPayment] = await db
        .select({
          amount: payments.paymentAmount,
          paymentDate: payments.paymentDate,
        })
        .from(payments)
        .where(eq(payments.customerId, customerId!))
        .orderBy(desc(payments.paymentDate))
        .limit(1);

      // Calculate average consumption
      const avgConsumptionResult = await db
        .select({
          avg: sql<number>`AVG(CAST(${bills.unitsConsumed} AS DECIMAL(10,2)))`,
        })
        .from(bills)
        .where(eq(bills.customerId, customerId!));

      const avgConsumption = parseFloat(avgConsumptionResult[0]?.avg?.toString() || '0') || 0;

      // Get recent payments
      const recentPayments = await db
        .select({
          id: payments.id,
          paymentAmount: payments.paymentAmount,
          paymentMethod: payments.paymentMethod,
          paymentDate: payments.paymentDate,
          receiptNumber: payments.receiptNumber,
        })
        .from(payments)
        .where(eq(payments.customerId, customerId!))
        .orderBy(desc(payments.paymentDate))
        .limit(5);

      // Get current bill (most recent pending bill)
      const [currentBill] = await db
        .select({
          id: bills.id,
          billNumber: bills.billNumber,
          totalAmount: bills.totalAmount,
          dueDate: bills.dueDate,
        })
        .from(bills)
        .where(
          and(
            eq(bills.customerId, customerId!),
            eq(bills.status, 'issued')
          )
        )
        .orderBy(desc(bills.issueDate))
        .limit(1);

      // Auto-generate notifications for due date reminders and overdue bills
      if (currentBill && currentBill.dueDate) {
        const today = new Date();
        const dueDate = parseISO(currentBill.dueDate.toString());
        const daysUntilDue = differenceInDays(dueDate, today);

        const userId = session.user.id;

        // Check if notification already exists for this bill (to avoid duplicates)
        const existingNotif = await db
          .select()
          .from(notifications)
          .where(
            and(
              eq(notifications.userId, userId),
              sql`${notifications.message} LIKE ${`%${currentBill.billNumber}%`}`
            )
          )
          .limit(1);

        // Due date reminder (3 days before due date)
        if (daysUntilDue <= 3 && daysUntilDue > 0 && existingNotif.length === 0) {
          await db.insert(notifications).values({
            userId,
            notificationType: 'reminder',
            title: 'Bill Payment Reminder',
            message: `Your bill ${currentBill.billNumber} of Rs. ${currentBill.totalAmount} is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}. Please pay before ${format(dueDate, 'dd MMM yyyy')}.`,
            priority: 'medium',
            actionUrl: '/customer/payment',
            actionText: 'Pay Now',
            isRead: 0,
          } as any);
        }

        // Overdue bill alert (past due date)
        if (daysUntilDue < 0 && existingNotif.length === 0) {
          await db.insert(notifications).values({
            userId,
            notificationType: 'alert',
            title: 'Overdue Bill Alert',
            message: `Your bill ${currentBill.billNumber} of Rs. ${currentBill.totalAmount} is ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) > 1 ? 's' : ''} overdue. Please pay immediately to avoid late fees.`,
            priority: 'high',
            actionUrl: '/customer/payment',
            actionText: 'Pay Now',
            isRead: 0,
          } as any);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          accountNumber: customer.accountNumber,
          fullName: customer.fullName,
          outstandingBalance: customer.outstandingBalance?.toString() || '0',
          currentBill,
          avgConsumption: Math.round(avgConsumption),
          lastPayment,
          consumptionHistory,
          recentBills,
          recentPayments,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}