import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings, bills, tariffs } from '@/lib/drizzle/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

// GET /api/bills/preview - Preview bulk bill generation
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const billingMonth = searchParams.get('month');
    
    if (!billingMonth || !/^\d{4}-\d{2}-01$/.test(billingMonth)) {
      return NextResponse.json({ 
        error: 'Invalid billing month format. Use YYYY-MM-01' 
      }, { status: 400 });
    }

    console.log('[Bills Preview] Analyzing bulk generation for:', billingMonth);

    // Calculate month boundaries
    const monthStart = new Date(billingMonth);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    const monthEndStr = monthEnd.toISOString().split('T')[0];

    // 1. Get total active customers
    const [totalActiveCustomers] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(customers)
      .where(eq(customers.status, 'active'));

    // 2. Get customers with meter readings for this month
    const customersWithReadings = await db
      .select({
        customerId: meterReadings.customerId,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName,
        connectionType: customers.connectionType,
        unitsConsumed: meterReadings.unitsConsumed,
        readingDate: meterReadings.readingDate
      })
      .from(meterReadings)
      .innerJoin(customers, eq(meterReadings.customerId, customers.id))
      .where(
        and(
          eq(customers.status, 'active'),
          sql`${meterReadings.readingDate} >= ${billingMonth}`,
          sql`${meterReadings.readingDate} < ${monthEndStr}`
        )
      );

    // 3. Get customers who already have bills for this month (with detailed info)
    const existingBills = await db
      .select({
        customerId: bills.customerId,
        billId: bills.id,
        accountNumber: customers.accountNumber,
        fullName: customers.fullName,
        totalAmount: bills.totalAmount,
        status: bills.status,
        dueDate: bills.dueDate,
        generatedAt: bills.createdAt
      })
      .from(bills)
      .innerJoin(customers, eq(bills.customerId, customers.id))
      .where(
        sql`DATE(${bills.billingMonth}) = ${billingMonth}`
      );

    // Separate by status
    const billsByStatus = existingBills.reduce((acc, bill) => {
      const status = bill.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(bill);
      return acc;
    }, {} as Record<string, any[]>);

    const totalExistingBills = existingBills.length;
    const totalBillAmount = existingBills.reduce((sum, bill) => {
      const amount = parseFloat(String(bill.totalAmount || '0'));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // 4. Get available tariffs
    const availableTariffs = await db
      .select()
      .from(tariffs)
      .where(
        and(
          sql`${tariffs.effectiveDate} <= ${billingMonth}`,
          sql`(${tariffs.validUntil} IS NULL OR ${tariffs.validUntil} >= ${billingMonth})`
        )
      );

    // 5. Analyze customer categories
    const categoryAnalysis = customersWithReadings.reduce((acc, customer) => {
      const category = customer.connectionType || 'Residential';
      if (!acc[category]) {
        acc[category] = { count: 0, totalUnits: 0, hasTariff: false };
      }
      acc[category].count++;
      acc[category].totalUnits += parseFloat(customer.unitsConsumed || '0');
      return acc;
    }, {} as Record<string, { count: number; totalUnits: number; hasTariff: boolean }>);

    // Check which categories have tariffs
    const tariffCategories = new Set(availableTariffs.map(t => t.category));
    Object.keys(categoryAnalysis).forEach(category => {
      categoryAnalysis[category].hasTariff = tariffCategories.has(category);
    });

    // 6. Calculate eligible customers (have reading, no existing bill)
    const customersWithBillsSet = new Set(existingBills.map(b => b.customerId));
    const eligibleCustomers = customersWithReadings.filter(
      customer => !customersWithBillsSet.has(customer.customerId)
    );

    // 7. Calculate estimated revenue
    let estimatedRevenue = 0;
    const tariffMap = new Map(availableTariffs.map(t => [t.category, t]));
    
    for (const customer of eligibleCustomers) {
      const category = customer.connectionType || 'Residential';
      const tariff = tariffMap.get(category);
      
      if (tariff) {
        const units = parseFloat(customer.unitsConsumed || '0');
        const fixedCharges = parseFloat(tariff.fixedCharge);
        
        // Simple calculation for preview (first slab only)
        let baseAmount = 0;
        if (units <= parseFloat(tariff.slab1End)) {
          baseAmount = units * parseFloat(tariff.slab1Rate);
        } else {
          baseAmount = parseFloat(tariff.slab1End) * parseFloat(tariff.slab1Rate) +
                      (units - parseFloat(tariff.slab1End)) * parseFloat(tariff.slab2Rate);
        }
        
        const electricityDuty = baseAmount * (parseFloat(tariff.electricityDutyPercent) / 100);
        const gstAmount = (baseAmount + fixedCharges + electricityDuty) * (parseFloat(tariff.gstPercent) / 100);
        const totalAmount = baseAmount + fixedCharges + electricityDuty + gstAmount;
        
        estimatedRevenue += totalAmount;
      }
    }

    // 8. Identify potential issues
    const issues = [];
    
    // Check for customers without readings
    const customersWithoutReadings = totalActiveCustomers.count - customersWithReadings.length;
    if (customersWithoutReadings > 0) {
      issues.push({
        type: 'warning',
        message: `${customersWithoutReadings} customers don't have meter readings for this month`,
        count: customersWithoutReadings
      });
    }

    // Check for categories without tariffs
    const categoriesWithoutTariffs = Object.entries(categoryAnalysis)
      .filter(([_, data]) => !data.hasTariff)
      .map(([category, _]) => category);
    
    if (categoriesWithoutTariffs.length > 0) {
      issues.push({
        type: 'error',
        message: `No tariffs found for categories: ${categoriesWithoutTariffs.join(', ')}`,
        categories: categoriesWithoutTariffs
      });
    }

    // Check for customers with zero consumption
    const zeroConsumptionCustomers = customersWithReadings.filter(
      c => parseFloat(c.unitsConsumed || '0') === 0
    );
    
    if (zeroConsumptionCustomers.length > 0) {
      issues.push({
        type: 'info',
        message: `${zeroConsumptionCustomers.length} customers have zero consumption (will be charged fixed charges only)`,
        count: zeroConsumptionCustomers.length
      });
    }

    const preview = {
      billingMonth,
      summary: {
        totalActiveCustomers: totalActiveCustomers.count,
        customersWithReadings: customersWithReadings.length,
        customersWithoutReadings: customersWithoutReadings,
        customersWithExistingBills: totalExistingBills,
        eligibleForGeneration: eligibleCustomers.length,
        estimatedRevenue: Math.round(estimatedRevenue * 100) / 100
      },
      existingBills: {
        total: totalExistingBills,
        totalAmount: Math.round(totalBillAmount * 100) / 100,
        byStatus: billsByStatus,
        statusCounts: {
          pending: billsByStatus['pending']?.length || 0,
          issued: billsByStatus['issued']?.length || 0,
          paid: billsByStatus['paid']?.length || 0,
          overdue: billsByStatus['overdue']?.length || 0,
          cancelled: billsByStatus['cancelled']?.length || 0
        },
        details: existingBills.slice(0, 10), // First 10 for preview
        generatedAt: existingBills[0]?.generatedAt || null
      },
      categoryBreakdown: categoryAnalysis,
      issues,
      eligibleCustomers: eligibleCustomers.slice(0, 10), // First 10 for preview
      availableTariffs: availableTariffs.map(t => ({
        id: t.id,
        category: t.category,
        effectiveDate: t.effectiveDate,
        validUntil: t.validUntil
      }))
    };

    console.log('[Bills Preview] Analysis complete:', preview.summary);

    return NextResponse.json({
      success: true,
      data: preview
    });

  } catch (error) {
    console.error('[Bills Preview] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}