const { db } = require('./src/lib/drizzle/db');
const { users, customers, bills, payments } = require('./src/lib/drizzle/schema');
const { sql, eq } = require('drizzle-orm');

async function checkData() {
  try {
    console.log('=== CHECKING DATABASE SEEDED DATA ===\n');

    // Count records
    const [userCount] = await db.select({ count: sql`COUNT(*)` }).from(users);
    const [custCount] = await db.select({ count: sql`COUNT(*)` }).from(customers);
    const [billCount] = await db.select({ count: sql`COUNT(*)` }).from(bills);
    const [paymentCount] = await db.select({ count: sql`COUNT(*)` }).from(payments);

    console.log('Total Users:', userCount.count);
    console.log('Total Customers:', custCount.count);
    console.log('Total Bills:', billCount.count);
    console.log('Total Payments:', paymentCount.count);

    // Check sample customer
    const [sampleCustomer] = await db.select().from(customers).limit(1);
    console.log('\n=== SAMPLE CUSTOMER ===');
    console.log('ID:', sampleCustomer.id);
    console.log('Name:', sampleCustomer.fullName);
    console.log('Email:', sampleCustomer.email);
    console.log('Account:', sampleCustomer.accountNumber);

    // Check bills for this customer
    const customerBills = await db.select().from(bills).where(eq(bills.customerId, sampleCustomer.id));
    console.log('\n=== BILLS FOR THIS CUSTOMER ===');
    console.log('Total Bills:', customerBills.length);

    if (customerBills.length > 0) {
      console.log('\nBill Details:');
      customerBills.forEach((bill, idx) => {
        console.log(`${idx + 1}. Bill: ${bill.billNumber}, Month: ${bill.billingMonth}, Units: ${bill.unitsConsumed}, Amount: ${bill.totalAmount}, Status: ${bill.status}`);
      });
    }

    // Check if admin user exists
    const adminUser = await db.select().from(users).where(eq(users.email, 'admin@electrolux.com')).limit(1);
    console.log('\n=== ADMIN USER ===');
    if (adminUser.length > 0) {
      console.log('✅ Admin exists:', adminUser[0].email);
    } else {
      console.log('❌ Admin does NOT exist!');
      console.log('You need to run: npm run db:seed');
    }

    // Check customer user
    const custUser = await db.select().from(users).where(eq(users.email, 'customer1@electrolux.com')).limit(1);
    console.log('\n=== CUSTOMER USER ===');
    if (custUser.length > 0) {
      console.log('✅ Customer1 exists:', custUser[0].email);
    } else {
      console.log('❌ Customer1 does NOT exist!');
      console.log('You need to run: npm run db:seed');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkData();

