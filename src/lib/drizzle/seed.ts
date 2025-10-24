import { faker } from '@faker-js/faker';
import { db } from './db';
import { users, customers, employees, tariffs, meterReadings, bills, payments, workOrders, connectionApplications, notifications } from './schema';
import bcrypt from 'bcryptjs';
import { subMonths, format, addDays } from 'date-fns';

// Helper function to generate unique account numbers
function generateAccountNumber(index: number): string {
  return `ELX-2024-${String(index).padStart(6, '0')}`;
}

function generateMeterNumber(index: number): string {
  return `MTR-${String(index).padStart(6, '0')}`;
}

function generateBillNumber(month: number, customerId: number): string {
  return `BILL-2024-${String(month).padStart(2, '0')}-${String(customerId).padStart(4, '0')}`;
}

function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

function generateReceiptNumber(index: number): string {
  return `RCP-2024-${String(index).padStart(6, '0')}`;
}

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. SEED USERS (1 Admin + 10 Employees + 50 Customers)
    console.log('👤 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Admin user
    await db.insert(users).values({
      email: 'admin@electrolux.com',
      password: hashedPassword,
      userType: 'admin',
      name: 'Admin User',
      phone: '+1234567890',
      isActive: 1,
    });

    // Employee users
    const employeeUsers = [];
    for (let i = 1; i <= 10; i++) {
      employeeUsers.push({
        email: `employee${i}@electrolux.com`,
        password: hashedPassword,
        userType: 'employee' as const,
        name: faker.person.fullName(),
        phone: faker.string.numeric(10),
        isActive: 1,
      });
    }
    await db.insert(users).values(employeeUsers);

    // Customer users
    const customerUsers = [];
    for (let i = 1; i <= 50; i++) {
      customerUsers.push({
        email: `customer${i}@example.com`,
        password: hashedPassword,
        userType: 'customer' as const,
        name: faker.person.fullName(),
        phone: faker.string.numeric(10),
        isActive: 1,
      });
    }
    await db.insert(users).values(customerUsers);
    console.log('✅ Seeded 61 users (1 admin + 10 employees + 50 customers)\n');

    // 2. SEED EMPLOYEES
    console.log('👨‍💼 Seeding employees...');
    const designations = ['Meter Reader', 'Supervisor', 'Technician', 'Field Officer', 'Maintenance Staff'];
    const departments = ['Operations', 'Billing', 'Maintenance', 'Customer Service', 'Technical'];
    const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

    const employeeRecords = [];
    for (let i = 0; i < 10; i++) {
      employeeRecords.push({
        userId: i + 2, // Employee user IDs start from 2 (1 is admin)
        employeeName: employeeUsers[i].name,
        email: employeeUsers[i].email,
        phone: employeeUsers[i].phone,
        designation: designations[i % designations.length],
        department: departments[i % departments.length],
        assignedZone: zones[i % zones.length],
        status: 'active' as const,
        hireDate: format(faker.date.past({ years: 3 }), 'yyyy-MM-dd'),
      });
    }
    await db.insert(employees).values(employeeRecords as any);
    console.log('✅ Seeded 10 employees\n');

    // 3. SEED CUSTOMERS
    console.log('🏠 Seeding customers...');
    const connectionTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural'] as const;
    const customerRecords = [];

    for (let i = 0; i < 50; i++) {
      const connectionType = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
      const connectionDate = format(faker.date.past({ years: 2 }), 'yyyy-MM-dd');

      customerRecords.push({
        userId: i + 12, // Customer user IDs start from 12 (1 admin + 10 employees + 1)
        accountNumber: generateAccountNumber(i + 1),
        meterNumber: generateMeterNumber(i + 1),
        fullName: customerUsers[i].name,
        email: customerUsers[i].email,
        phone: customerUsers[i].phone,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        pincode: faker.location.zipCode(),
        connectionType: connectionType,
        status: 'active' as const,
        connectionDate: connectionDate,
        lastBillAmount: '0.00',
        lastPaymentDate: null,
        averageMonthlyUsage: '0.00',
        outstandingBalance: '0.00',
        paymentStatus: 'paid' as const,
      });
    }
    await db.insert(customers).values(customerRecords as any);
    console.log('✅ Seeded 50 customers\n');

    // 4. SEED TARIFFS (4 categories)
    console.log('💰 Seeding tariffs...');
    const tariffData = [
      {
        category: 'Residential' as const,
        fixedCharge: '50.00',
        slab1Start: 0, slab1End: 100, slab1Rate: '4.50',
        slab2Start: 101, slab2End: 200, slab2Rate: '6.00',
        slab3Start: 201, slab3End: 300, slab3Rate: '7.50',
        slab4Start: 301, slab4End: 500, slab4Rate: '9.00',
        slab5Start: 501, slab5End: null, slab5Rate: '10.50',
        timeOfUsePeakRate: '12.00',
        timeOfUseNormalRate: '7.50',
        timeOfUseOffpeakRate: '5.00',
        electricityDutyPercent: '6.00',
        gstPercent: '18.00',
        effectiveDate: '2024-01-01',
        validUntil: null,
      },
      {
        category: 'Commercial' as const,
        fixedCharge: '150.00',
        slab1Start: 0, slab1End: 200, slab1Rate: '7.00',
        slab2Start: 201, slab2End: 500, slab2Rate: '8.50',
        slab3Start: 501, slab3End: 1000, slab3Rate: '10.00',
        slab4Start: 1001, slab4End: 2000, slab4Rate: '11.50',
        slab5Start: 2001, slab5End: null, slab5Rate: '13.00',
        timeOfUsePeakRate: '15.00',
        timeOfUseNormalRate: '10.00',
        timeOfUseOffpeakRate: '7.00',
        electricityDutyPercent: '8.00',
        gstPercent: '18.00',
        effectiveDate: '2024-01-01',
        validUntil: null,
      },
      {
        category: 'Industrial' as const,
        fixedCharge: '500.00',
        slab1Start: 0, slab1End: 1000, slab1Rate: '6.50',
        slab2Start: 1001, slab2End: 5000, slab2Rate: '7.50',
        slab3Start: 5001, slab3End: 10000, slab3Rate: '8.50',
        slab4Start: 10001, slab4End: 20000, slab4Rate: '9.50',
        slab5Start: 20001, slab5End: null, slab5Rate: '10.50',
        timeOfUsePeakRate: '13.00',
        timeOfUseNormalRate: '8.50',
        timeOfUseOffpeakRate: '6.00',
        electricityDutyPercent: '10.00',
        gstPercent: '18.00',
        effectiveDate: '2024-01-01',
        validUntil: null,
      },
      {
        category: 'Agricultural' as const,
        fixedCharge: '30.00',
        slab1Start: 0, slab1End: 200, slab1Rate: '3.00',
        slab2Start: 201, slab2End: 500, slab2Rate: '4.00',
        slab3Start: 501, slab3End: 1000, slab3Rate: '5.00',
        slab4Start: 1001, slab4End: 2000, slab4Rate: '6.00',
        slab5Start: 2001, slab5End: null, slab5Rate: '7.00',
        timeOfUsePeakRate: '8.00',
        timeOfUseNormalRate: '5.00',
        timeOfUseOffpeakRate: '3.50',
        electricityDutyPercent: '4.00',
        gstPercent: '18.00',
        effectiveDate: '2024-01-01',
        validUntil: null,
      },
    ];
    await db.insert(tariffs).values(tariffData as any);
    console.log('✅ Seeded 4 tariff categories\n');

    // 5. SEED METER READINGS & BILLS (6 months for 50 customers = 300 records each)
    console.log('📊 Seeding meter readings and bills (6 months)...');

    const today = new Date();
    let billCounter = 1;
    let paymentCounter = 1;

    for (let customerId = 1; customerId <= 50; customerId++) {
      let previousReading = faker.number.int({ min: 1000, max: 5000 });

      // Get customer details
      const customer = customerRecords[customerId - 1];
      const tariffCategory = customer.connectionType;

      // Get tariff for this customer
      const tariff = tariffData.find(t => t.category === tariffCategory)!;

      for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
        const readingDate = subMonths(today, monthOffset);
        const billingMonth = format(readingDate, 'yyyy-MM-01');
        const issueDate = format(addDays(readingDate, 2), 'yyyy-MM-dd');
        const dueDate = format(addDays(readingDate, 17), 'yyyy-MM-dd');

        // Generate consumption based on connection type
        let monthlyConsumption;
        switch (tariffCategory) {
          case 'Residential':
            monthlyConsumption = faker.number.int({ min: 80, max: 400 });
            break;
          case 'Commercial':
            monthlyConsumption = faker.number.int({ min: 500, max: 2000 });
            break;
          case 'Industrial':
            monthlyConsumption = faker.number.int({ min: 5000, max: 15000 });
            break;
          case 'Agricultural':
            monthlyConsumption = faker.number.int({ min: 300, max: 1500 });
            break;
        }

        const currentReading = previousReading + monthlyConsumption;

        // Insert meter reading
        await db.insert(meterReadings).values({
          customerId: customerId,
          meterNumber: customer.meterNumber,
          currentReading: currentReading.toString(),
          previousReading: previousReading.toString(),
          unitsConsumed: monthlyConsumption.toString(),
          readingDate: format(readingDate, 'yyyy-MM-dd'),
          readingTime: readingDate,
          meterCondition: 'good',
          accessibility: 'accessible',
          employeeId: faker.number.int({ min: 1, max: 10 }), // Random employee
          photoPath: null,
          notes: null,
        } as any);

        // Calculate bill amount using tariff slabs
        let baseAmount = 0;
        let remainingUnits = monthlyConsumption;

        // Apply slab rates
        const slabs = [
          { start: tariff.slab1Start, end: tariff.slab1End, rate: parseFloat(tariff.slab1Rate) },
          { start: tariff.slab2Start, end: tariff.slab2End, rate: parseFloat(tariff.slab2Rate) },
          { start: tariff.slab3Start, end: tariff.slab3End, rate: parseFloat(tariff.slab3Rate) },
          { start: tariff.slab4Start, end: tariff.slab4End, rate: parseFloat(tariff.slab4Rate) },
          { start: tariff.slab5Start, end: tariff.slab5End || 999999, rate: parseFloat(tariff.slab5Rate) },
        ];

        for (const slab of slabs) {
          if (remainingUnits <= 0) break;

          const slabUnits = Math.min(remainingUnits, slab.end - slab.start + 1);
          baseAmount += slabUnits * slab.rate;
          remainingUnits -= slabUnits;
        }

        const fixedCharges = parseFloat(tariff.fixedCharge);
        const electricityDuty = baseAmount * (parseFloat(tariff.electricityDutyPercent) / 100);
        const subtotal = baseAmount + fixedCharges + electricityDuty;
        const gstAmount = subtotal * (parseFloat(tariff.gstPercent) / 100);
        const totalAmount = subtotal + gstAmount;

        // Insert bill
        const meterReadingId = (customerId - 1) * 6 + (6 - monthOffset);
        await db.insert(bills).values({
          customerId: customerId,
          billNumber: generateBillNumber(6 - monthOffset, customerId),
          billingMonth: billingMonth,
          issueDate: issueDate,
          dueDate: dueDate,
          unitsConsumed: monthlyConsumption.toString(),
          meterReadingId: meterReadingId,
          baseAmount: baseAmount.toFixed(2),
          fixedCharges: fixedCharges.toFixed(2),
          electricityDuty: electricityDuty.toFixed(2),
          gstAmount: gstAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          status: monthOffset === 0 ? 'issued' : 'paid', // Latest month unpaid, others paid
          paymentDate: monthOffset === 0 ? null : format(addDays(readingDate, faker.number.int({ min: 5, max: 15 })), 'yyyy-MM-dd'),
        } as any);

        // Insert payment (80% of bills are paid, skip latest month)
        if (monthOffset > 0 && Math.random() > 0.2) {
          const paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'upi', 'wallet'] as const;
          await db.insert(payments).values({
            customerId: customerId,
            billId: billCounter,
            paymentAmount: totalAmount.toFixed(2),
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            paymentDate: format(addDays(readingDate, faker.number.int({ min: 5, max: 15 })), 'yyyy-MM-dd'),
            transactionId: generateTransactionId(),
            receiptNumber: generateReceiptNumber(paymentCounter),
            status: 'completed',
            notes: null,
          } as any);
          paymentCounter++;
        }

        billCounter++;
        previousReading = currentReading;
      }
    }
    console.log('✅ Seeded 300 meter readings\n');
    console.log('✅ Seeded 300 bills\n');
    console.log(`✅ Seeded ~${paymentCounter - 1} payments\n`);

    // 6. SEED WORK ORDERS (20 recent work orders)
    console.log('📋 Seeding work orders...');
    const workOrderTypes = ['meter_reading', 'maintenance', 'complaint_resolution', 'new_connection', 'reconnection'] as const;
    const priorities = ['low', 'medium', 'high', 'urgent'] as const;
    const statuses = ['assigned', 'in_progress', 'completed'] as const;

    const workOrderRecords = [];
    for (let i = 0; i < 20; i++) {
      const assignedDate = format(faker.date.recent({ days: 30 }), 'yyyy-MM-dd');
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      workOrderRecords.push({
        employeeId: faker.number.int({ min: 1, max: 10 }),
        customerId: faker.number.int({ min: 1, max: 50 }),
        workType: workOrderTypes[Math.floor(Math.random() * workOrderTypes.length)],
        title: faker.company.catchPhrase(),
        description: faker.lorem.sentence(),
        status: status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignedDate: assignedDate,
        dueDate: format(addDays(new Date(assignedDate), faker.number.int({ min: 1, max: 7 })), 'yyyy-MM-dd'),
        completionDate: status === 'completed' ? format(addDays(new Date(assignedDate), faker.number.int({ min: 1, max: 5 })), 'yyyy-MM-dd') : null,
        completionNotes: status === 'completed' ? faker.lorem.sentence() : null,
      });
    }
    await db.insert(workOrders).values(workOrderRecords as any);
    console.log('✅ Seeded 20 work orders\n');

    // 7. SEED CONNECTION APPLICATIONS (10 applications)
    console.log('🔌 Seeding connection applications...');
    const applicationStatuses = ['pending', 'approved', 'under_inspection', 'connected'] as const;
    const connectionAppRecords = [];

    for (let i = 0; i < 10; i++) {
      connectionAppRecords.push({
        applicationNumber: `APP-2024-${String(i + 1).padStart(6, '0')}`,
        customerId: null,
        applicantName: faker.person.fullName(),
        fatherName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.string.numeric(10),
        alternatePhone: faker.phone.number(),
        idType: 'aadhaar' as const,
        idNumber: faker.string.numeric(12),
        propertyType: connectionTypes[Math.floor(Math.random() * connectionTypes.length)],
        connectionType: 'single_phase' as const,
        loadRequired: faker.number.int({ min: 2, max: 10 }).toString(),
        propertyAddress: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        pincode: faker.location.zipCode(),
        landmark: faker.location.street(),
        preferredConnectionDate: format(addDays(today, faker.number.int({ min: 7, max: 30 })), 'yyyy-MM-dd'),
        purposeOfConnection: 'domestic' as const,
        status: applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)],
        estimatedCharges: faker.number.int({ min: 5000, max: 15000 }).toString(),
        applicationFeePaid: 1,
        identityProofPath: null,
        addressProofPath: null,
        propertyProofPath: null,
        siteInspectionDate: null,
        estimatedConnectionDays: faker.number.int({ min: 7, max: 21 }),
        rejectionReason: null,
      });
    }
    await db.insert(connectionApplications).values(connectionAppRecords as any);
    console.log('✅ Seeded 10 connection applications\n');

    // 8. SEED NOTIFICATIONS (50 recent notifications)
    console.log('🔔 Seeding notifications...');
    const notificationTypes = ['payment', 'bill', 'maintenance', 'alert', 'info', 'work_order'] as const;
    const notificationRecords = [];

    for (let i = 0; i < 50; i++) {
      const userId = faker.number.int({ min: 12, max: 61 }); // Customer users
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

      let title = '';
      let message = '';

      switch (type) {
        case 'payment':
          title = 'Payment Successful';
          message = 'Your payment has been received successfully.';
          break;
        case 'bill':
          title = 'New Bill Generated';
          message = 'Your electricity bill for this month is ready.';
          break;
        case 'maintenance':
          title = 'Scheduled Maintenance';
          message = 'Power outage scheduled for maintenance in your area.';
          break;
        case 'alert':
          title = 'High Usage Alert';
          message = 'Your electricity consumption is higher than usual.';
          break;
        case 'info':
          title = 'System Update';
          message = 'New features have been added to your account.';
          break;
        case 'work_order':
          title = 'Work Order Update';
          message = 'Your service request has been assigned to a technician.';
          break;
      }

      notificationRecords.push({
        userId: userId,
        notificationType: type,
        title: title,
        message: message,
        isRead: Math.random() > 0.5 ? 1 : 0,
        readAt: Math.random() > 0.5 ? faker.date.recent({ days: 7 }) : null,
      });
    }
    await db.insert(notifications).values(notificationRecords as any);
    console.log('✅ Seeded 50 notifications\n');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('  - 61 users (1 admin + 10 employees + 50 customers)');
    console.log('  - 10 employees');
    console.log('  - 50 customers');
    console.log('  - 4 tariff categories');
    console.log('  - 300 meter readings (6 months)');
    console.log('  - 300 bills (6 months)');
    console.log('  - ~240 payments');
    console.log('  - 20 work orders');
    console.log('  - 10 connection applications');
    console.log('  - 50 notifications');
    console.log('\n✨ Total: ~900+ records created!\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('✅ Seeding script finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
