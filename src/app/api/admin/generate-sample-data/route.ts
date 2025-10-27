import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { users, customers, meterReadings, bills, workOrders } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can generate sample data
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { count, dataType } = body;

    if (!count || count < 1 || count > 100) {
      return NextResponse.json({
        error: 'Invalid count. Must be between 1 and 100'
      }, { status: 400 });
    }

    console.log(`[Sample Data] Generating ${count} ${dataType} records...`);

    let generatedCount = 0;

    // Generate sample data based on type (DBMS: Bulk Insert Operations)
    switch (dataType) {
      case 'users':
        const userData = Array.from({ length: count }, () => ({
          email: faker.internet.email() as string,
          password: 'password123' as string,
          userType: faker.helpers.arrayElement(['customer', 'employee', 'admin'] as const),
          name: faker.person.fullName() as string,
          phone: faker.phone.number() as string,
          isActive: 1 as number
        }));

        await db.insert(users).values(userData as any);
        generatedCount = userData.length;
        break;

      case 'customers':
        // First get some user IDs to use as foreign keys
        const existingUsers = await db.select({ id: users.id }).from(users).limit(10);
        if (existingUsers.length === 0) {
          return NextResponse.json({
            error: 'No users found. Please generate users first.'
          }, { status: 400 });
        }

        const customerData = Array.from({ length: count }, () => ({
          userId: faker.helpers.arrayElement(existingUsers).id,
          accountNumber: `ELX-2024-${faker.string.numeric(6)}`,
          meterNumber: `MTR-${faker.string.alpha(3).toUpperCase()}-${faker.string.numeric(6)}`,
          fullName: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          pincode: faker.location.zipCode(),
          connectionType: faker.helpers.arrayElement(['Residential', 'Commercial', 'Industrial', 'Agricultural'] as const),
          status: 'active' as const,
          connectionDate: faker.date.past({ years: 2 }).toISOString().split('T')[0],
          averageMonthlyUsage: faker.number.float({ min: 100, max: 2000, fractionDigits: 2 }).toString()
        }));

        await db.insert(customers).values(customerData as any);
        generatedCount = customerData.length;
        break;

      case 'meter_readings':
        // Get some customers with meter numbers
        const existingCustomersWithMeters = await db.select({
          id: customers.id,
          meterNumber: customers.meterNumber
        }).from(customers).limit(20);

        if (existingCustomersWithMeters.length === 0) {
          return NextResponse.json({
            error: 'No customers found. Please generate customers first.'
          }, { status: 400 });
        }

        const readingData = Array.from({ length: count }, () => {
          const customer = faker.helpers.arrayElement(existingCustomersWithMeters);
          const previousReading = faker.number.int({ min: 1000, max: 5000 });
          const currentReading = previousReading + faker.number.int({ min: 50, max: 500 });
          const readingDateTime = faker.date.past({ years: 0.1 }); // Within last ~36 days

          return {
            customerId: customer.id,
            meterNumber: customer.meterNumber || `MTR-${faker.string.alpha(3).toUpperCase()}-${faker.string.numeric(6)}`,
            readingDate: readingDateTime.toISOString().split('T')[0],
            readingTime: readingDateTime.toISOString(),
            currentReading: currentReading.toString(),
            previousReading: previousReading.toString(),
            unitsConsumed: (currentReading - previousReading).toString()
          };
        });

        await db.insert(meterReadings).values(readingData as any);
        generatedCount = readingData.length;
        break;

      case 'bills':
        // Get some customer IDs and meter readings
        const customersForBills = await db.select({ id: customers.id }).from(customers).limit(20);
        if (customersForBills.length === 0) {
          return NextResponse.json({
            error: 'No customers found. Please generate customers first.'
          }, { status: 400 });
        }

        const billData = Array.from({ length: count }, () => {
          const customerId = faker.helpers.arrayElement(customersForBills).id;
          const unitsConsumed = faker.number.float({ min: 100, max: 1000, fractionDigits: 2 });
          const baseAmount = unitsConsumed * 5; // Assuming ₹5 per unit
          const fixedCharges = 50;
          const totalAmount = baseAmount + fixedCharges;
          const billingDate = faker.date.past({ years: 1 });

          return {
            customerId,
            billNumber: `BILL-${faker.string.numeric(8)}`,
            billingMonth: new Date(billingDate.getFullYear(), billingDate.getMonth(), 1).toISOString().split('T')[0],
            issueDate: billingDate.toISOString().split('T')[0],
            dueDate: new Date(billingDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            unitsConsumed: unitsConsumed.toString(),
            baseAmount: baseAmount.toString(),
            fixedCharges: fixedCharges.toString(),
            totalAmount: totalAmount.toString(),
            status: faker.helpers.arrayElement(['generated', 'issued', 'paid', 'overdue'] as const)
          };
        });

        await db.insert(bills).values(billData as any);
        generatedCount = billData.length;
        break;

      case 'work_orders':
        // Get some customer and employee IDs
        const customersForWork = await db.select({ id: customers.id }).from(customers).limit(10);
        const employeesForWork = await db.select({ id: users.id }).from(users).where(eq(users.userType, 'employee')).limit(5);
        
        if (customersForWork.length === 0 || employeesForWork.length === 0) {
          return NextResponse.json({
            error: 'No customers or employees found. Please generate them first.'
          }, { status: 400 });
        }

        const workOrderData = Array.from({ length: count }, () => {
          const assignedDate = faker.date.past({ years: 0.1 }); // Within last ~36 days
          const dueDate = new Date(assignedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

          return {
            employeeId: faker.helpers.arrayElement(employeesForWork).id,
            customerId: faker.helpers.arrayElement(customersForWork).id,
            workType: faker.helpers.arrayElement(['meter_reading', 'maintenance', 'complaint_resolution', 'new_connection'] as const),
            title: faker.lorem.sentence(4),
            description: faker.lorem.paragraph(),
            status: faker.helpers.arrayElement(['assigned', 'in_progress', 'completed'] as const),
            priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent'] as const),
            assignedDate: assignedDate,
            dueDate: dueDate
          };
        });
        
        await db.insert(workOrders).values(workOrderData as any);
        generatedCount = workOrderData.length;
        break;

      default:
        return NextResponse.json({
          error: 'Invalid data type'
        }, { status: 400 });
    }

    console.log(`[Sample Data] Successfully generated ${generatedCount} ${dataType} records`);

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${generatedCount} ${dataType} records`,
      data: {
        type: dataType,
        count: generatedCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[Sample Data] Error generating sample data:', error);
    return NextResponse.json({
      error: 'Failed to generate sample data',
      details: error.message
    }, { status: 500 });
  }
}
