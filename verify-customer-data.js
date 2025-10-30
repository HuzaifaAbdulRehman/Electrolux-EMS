// Quick diagnostic script to check customer data
const mysql = require('mysql2/promise');

async function verifyData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'REDACTED',
    database: 'electricity_ems'
  });

  try {
    console.log('🔍 Checking Customer ID 1 data:\n');

    // Check customer record
    const [customers] = await connection.execute(
      'SELECT id, account_number, outstanding_balance, last_bill_amount, average_monthly_usage, payment_status FROM customers WHERE id = 1'
    );
    console.log('Customer Record:');
    console.log(customers[0]);
    console.log('\n');

    // Check bills for this customer
    const [bills] = await connection.execute(
      'SELECT id, bill_number, billing_month, total_amount, status, issue_date, due_date FROM bills WHERE customer_id = 1 ORDER BY billing_month DESC'
    );
    console.log(`Bills (${bills.length} found):`);
    bills.forEach(bill => {
      console.log(`  - ${bill.bill_number}: Rs ${bill.total_amount} [${bill.status}] (${bill.billing_month})`);
    });
    console.log('\n');

    // Check payments
    const [payments] = await connection.execute(
      'SELECT id, payment_amount, payment_date, status FROM payments WHERE customer_id = 1 ORDER BY payment_date DESC LIMIT 3'
    );
    console.log(`Recent Payments (${payments.length} found):`);
    payments.forEach(payment => {
      console.log(`  - Rs ${payment.payment_amount} on ${payment.payment_date} [${payment.status}]`);
    });
    console.log('\n');

    // Calculate what SHOULD be
    const unpaidBills = bills.filter(b => b.status === 'issued' || b.status === 'generated');
    const expectedBalance = unpaidBills.reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

    console.log('📊 Expected vs Actual:');
    console.log(`  Expected Outstanding Balance: Rs ${expectedBalance.toFixed(2)}`);
    console.log(`  Actual Outstanding Balance:   Rs ${customers[0].outstanding_balance}`);
    console.log(`  Match: ${expectedBalance.toFixed(2) === customers[0].outstanding_balance ? '✅' : '❌'}`);
    console.log('\n');

    if (expectedBalance.toFixed(2) !== customers[0].outstanding_balance) {
      console.log('⚠️  ISSUE DETECTED: Customer balance not updated!');
      console.log('   This means the seed script update logic did not run.');
      console.log('   Solution: Re-run seed script: npm run db:seed\n');
    } else {
      console.log('✅ Customer data is correct!\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

verifyData();


