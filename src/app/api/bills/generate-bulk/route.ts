import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, meterReadings, bills, tariffs, notifications } from '@/lib/drizzle/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

// POST /api/bills/generate-bulk - Generate bills for all eligible customers
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { billingMonth } = body;

    if (!billingMonth || !/^\d{4}-\d{2}-01$/.test(billingMonth)) {
      return NextResponse.json({ 
        error: 'Invalid billing month format. Use YYYY-MM-01' 
      }, { status: 400 });
    }

    console.log('[Bulk Generation] Starting bulk bill generation for:', billingMonth);

    const stats = {
      totalProcessed: 0,
      billsGenerated: 0,
      skipped: {
        noReading: 0,
        alreadyExists: 0,
        noTariff: 0,
        inactive: 0,
        zeroConsumption: 0
      },
      failed: [] as any[],
      generatedBills: [] as any[],
      startTime: new Date(),
      endTime: null as Date | null
    };

    try {
      // 1. Fetch all active customers
      const allCustomers = await db
        .select()
        .from(customers)
        .where(eq(customers.status, 'active'));

      console.log(`[Bulk Generation] Found ${allCustomers.length} active customers`);

      // 2. Fetch all tariffs (cache to avoid repeated queries)
      const tariffsList = await db
        .select()
        .from(tariffs)
        .where(
          and(
            sql`${tariffs.effectiveDate} <= ${billingMonth}`,
            sql`(${tariffs.validUntil} IS NULL OR ${tariffs.validUntil} >= ${billingMonth})`
          )
        );

      const tariffsMap = new Map(
        tariffsList.map(t => [t.category, t])
      );

      console.log(`[Bulk Generation] Found ${tariffsList.length} active tariffs`);

      // 3. Process in batches to avoid memory issues
      const BATCH_SIZE = 50;
      const monthStart = new Date(billingMonth);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      const monthEndStr = monthEnd.toISOString().split('T')[0];

      for (let i = 0; i < allCustomers.length; i += BATCH_SIZE) {
        const batch = allCustomers.slice(i, i + BATCH_SIZE);
        
        console.log(`[Bulk Generation] Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(allCustomers.length/BATCH_SIZE)}`);
        
        for (const customer of batch) {
          stats.totalProcessed++;
          
          try {
            // Check if customer is still active
            if (customer.status !== 'active') {
              stats.skipped.inactive++;
              continue;
            }

            // Check if bill already exists for this month
            const [existingBill] = await db
              .select()
              .from(bills)
              .where(
                and(
                  eq(bills.customerId, customer.id),
                  sql`DATE(${bills.billingMonth}) = ${billingMonth}`
                )
              )
              .limit(1);

            if (existingBill) {
              stats.skipped.alreadyExists++;
              continue;
            }

            // Get latest meter reading for this month
            const [reading] = await db
              .select()
              .from(meterReadings)
              .where(
                and(
                  eq(meterReadings.customerId, customer.id),
                  sql`${meterReadings.readingDate} >= ${billingMonth}`,
                  sql`${meterReadings.readingDate} < ${monthEndStr}`
                )
              )
              .orderBy(desc(meterReadings.readingDate))
              .limit(1);

            if (!reading) {
              stats.skipped.noReading++;
              continue;
            }

            // Check for zero consumption
            const unitsConsumed = parseFloat(reading.unitsConsumed || '0');
            if (unitsConsumed === 0) {
              stats.skipped.zeroConsumption++;
              // Still generate bill for zero consumption (fixed charges only)
            }

            // Get tariff for customer category
            const customerCategory = customer.connectionType || 'Residential';
            const tariff = tariffsMap.get(customerCategory);

            if (!tariff) {
              stats.skipped.noTariff++;
              stats.failed.push({
                customerId: customer.id,
                accountNumber: customer.accountNumber,
                fullName: customer.fullName,
                error: `No tariff found for category: ${customerCategory}`
              });
              continue;
            }

            // Calculate bill charges using slab-based calculation
            const billCalculation = calculateBillCharges(unitsConsumed, tariff);
            
            // Generate unique bill number
            const billNumber = generateBillNumber();
            const issueDate = new Date().toISOString().split('T')[0];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 15);

            // Insert bill into database
            const [newBill] = await db.insert(bills).values({
              customerId: customer.id,
              billNumber,
              billingMonth,
              issueDate,
              dueDate: dueDate.toISOString().split('T')[0],
              unitsConsumed: unitsConsumed.toFixed(2),
              meterReadingId: reading.id,
              baseAmount: billCalculation.baseAmount.toFixed(2),
              fixedCharges: billCalculation.fixedCharges.toFixed(2),
              electricityDuty: billCalculation.electricityDuty.toFixed(2),
              gstAmount: billCalculation.gstAmount.toFixed(2),
              totalAmount: billCalculation.totalAmount.toFixed(2),
              status: 'issued', // Bulk bills are auto-issued
              tariffId: tariff.id,
            } as any);

            // Update customer's outstanding balance
            const newOutstandingBalance = parseFloat(customer.outstandingBalance || '0') + billCalculation.totalAmount;
            await db
              .update(customers)
              .set({
                outstandingBalance: newOutstandingBalance.toFixed(2),
                lastBillAmount: billCalculation.totalAmount.toFixed(2),
              })
              .where(eq(customers.id, customer.id));

            // Send notification to customer (async, don't wait)
            if (customer.userId) {
              db.insert(notifications).values({
                userId: customer.userId,
                notificationType: 'billing',
                title: 'New Bill Generated',
                message: `Your bill for ${billingMonth} is ready. Amount: Rs ${billCalculation.totalAmount.toFixed(2)}. Due date: ${dueDate.toLocaleDateString()}`,
                priority: 'high',
                actionUrl: '/customer/view-bills',
                actionText: 'View Bill',
                isRead: 0,
              } as any).catch((err) => {
                console.error(`[Bulk Generation] Failed to send notification to customer ${customer.accountNumber}:`, err);
              });
            }

            stats.billsGenerated++;
            stats.generatedBills.push({
              billId: newBill.insertId,
              customerId: customer.id,
              accountNumber: customer.accountNumber,
              fullName: customer.fullName,
              amount: billCalculation.totalAmount,
              unitsConsumed: unitsConsumed
            });

            console.log(`[Bulk Generation] Generated bill for ${customer.accountNumber}: Rs ${billCalculation.totalAmount.toFixed(2)}`);

          } catch (error: any) {
            console.error(`[Bulk Generation] Error processing customer ${customer.accountNumber}:`, error);
            stats.failed.push({
              customerId: customer.id,
              accountNumber: customer.accountNumber,
              fullName: customer.fullName,
              error: error.message
            });
          }
        }
        
        // Yield control to event loop between batches
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      stats.endTime = new Date();
      const duration = stats.endTime.getTime() - stats.startTime.getTime();

      console.log('[Bulk Generation] Complete:', {
        duration: `${(duration / 1000).toFixed(2)}s`,
        stats
      });

      return NextResponse.json({
        success: true,
        message: `Bulk bill generation completed in ${(duration / 1000).toFixed(2)}s`,
        summary: {
          totalProcessed: stats.totalProcessed,
          billsGenerated: stats.billsGenerated,
          billingMonth,
          skipped: stats.skipped,
          failedCount: stats.failed.length,
          duration: `${(duration / 1000).toFixed(2)}s`,
          averageTimePerBill: `${(duration / stats.billsGenerated).toFixed(2)}ms`
        },
        generatedBills: stats.generatedBills.slice(0, 20), // First 20 bills
        failed: stats.failed.slice(0, 10) // First 10 failures
    });

  } catch (error: any) {
      console.error('[Bulk Generation] Fatal error:', error);
      return NextResponse.json({
        error: 'Bulk generation failed',
        details: error.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[Bulk Generation] Request error:', error);
    return NextResponse.json({ 
      error: 'Failed to process bulk generation request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function: Calculate bill charges using slab-based pricing
function calculateBillCharges(unitsConsumed: number, tariff: any) {
  let baseAmount = 0;

  // Parse tariff slab values once
  const slab1End = parseFloat(tariff.slab1End);
  const slab2End = parseFloat(tariff.slab2End);
  const slab3End = parseFloat(tariff.slab3End);
  const slab4End = parseFloat(tariff.slab4End);

  const slab1Rate = parseFloat(tariff.slab1Rate);
  const slab2Rate = parseFloat(tariff.slab2Rate);
  const slab3Rate = parseFloat(tariff.slab3Rate);
  const slab4Rate = parseFloat(tariff.slab4Rate);
  const slab5Rate = parseFloat(tariff.slab5Rate);

  // Progressive slab-based calculation
  // Each slab charges only for units within that specific range
  if (unitsConsumed <= slab1End) {
    // All units in slab 1 (e.g., 0-100 @ Rs 4.50/unit)
    baseAmount = unitsConsumed * slab1Rate;
  } else if (unitsConsumed <= slab2End) {
    // Slab 1 full + partial slab 2
    baseAmount = (slab1End * slab1Rate) +
                 ((unitsConsumed - slab1End) * slab2Rate);
  } else if (unitsConsumed <= slab3End) {
    // Slab 1 full + Slab 2 full + partial slab 3
    baseAmount = (slab1End * slab1Rate) +
                 ((slab2End - slab1End) * slab2Rate) +
                 ((unitsConsumed - slab2End) * slab3Rate);
  } else if (unitsConsumed <= slab4End) {
    // Slab 1 + Slab 2 + Slab 3 + partial slab 4
    baseAmount = (slab1End * slab1Rate) +
                 ((slab2End - slab1End) * slab2Rate) +
                 ((slab3End - slab2End) * slab3Rate) +
                 ((unitsConsumed - slab3End) * slab4Rate);
  } else {
    // All slabs full + slab 5 for excess
    baseAmount = (slab1End * slab1Rate) +
                 ((slab2End - slab1End) * slab2Rate) +
                 ((slab3End - slab2End) * slab3Rate) +
                 ((slab4End - slab3End) * slab4Rate) +
                 ((unitsConsumed - slab4End) * slab5Rate);
  }

  const fixedCharges = parseFloat(tariff.fixedCharge);
  const electricityDuty = baseAmount * (parseFloat(tariff.electricityDutyPercent) / 100);
  const gstAmount = (baseAmount + fixedCharges + electricityDuty) * (parseFloat(tariff.gstPercent) / 100);
  const totalAmount = baseAmount + fixedCharges + electricityDuty + gstAmount;

  return {
    baseAmount,
    fixedCharges,
    electricityDuty,
    gstAmount,
    totalAmount
  };
}

// Helper function: Generate unique bill number
function generateBillNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `BILL-${year}-${random}`;
}