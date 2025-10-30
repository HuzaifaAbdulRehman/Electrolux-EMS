// Check customers with multiple unpaid bills
const mysql = require('mysql2/promise');

async function checkUnpaidBills() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'REDACTED',
    database: 'electricity_ems'
  });

  try {
    console.log('🔍 Checking unpaid bills distribution:\n');

    // Get customers with unpaid bills
    const [unpaidBillCounts] = await connection.execute(`
      SELECT
        c.id,
        c.full_name,
        c.meter_number,
        c.outstanding_balance,
        c.last_bill_amount,
        COUNT(b.id) as unpaid_bills_count,
        SUM(b.total_amount) as total_unpaid
      FROM customers c
      LEFT JOIN bills b ON c.id = b.customer_id AND b.status IN ('issued', 'generated')
      GROUP BY c.id
      HAVING unpaid_bills_count > 1
      ORDER BY unpaid_bills_count DESC
      LIMIT 10
    `);

    console.log('📊 Customers with MULTIPLE unpaid bills:');
    if (unpaidBillCounts.length === 0) {
      console.log('  None found - All customers have max 1 unpaid bill');
    } else {
      unpaidBillCounts.forEach(customer => {
        console.log(`  ${customer.full_name} (${customer.meter_number})`);
        console.log(`    Unpaid Bills: ${customer.unpaid_bills_count}`);
        console.log(`    Total Unpaid: Rs ${parseFloat(customer.total_unpaid).toFixed(2)}`);
        console.log(`    Outstanding Balance: Rs ${customer.outstanding_balance}`);
        console.log(`    Last Bill Amount: Rs ${customer.last_bill_amount}`);
        console.log(`    Match: ${parseFloat(customer.total_unpaid).toFixed(2) === customer.outstanding_balance ? '✅' : '❌'}\n`);
      });
    }

    // Overall statistics
    const [stats] = await connection.execute(`
      SELECT
        COUNT(DISTINCT CASE WHEN b.status IN ('issued', 'generated') THEN c.id END) as customers_with_unpaid,
        COUNT(*) as total_customers,
        SUM(CASE WHEN b.status IN ('issued', 'generated') THEN 1 ELSE 0 END) as total_unpaid_bills
      FROM customers c
      LEFT JOIN bills b ON c.id = b.customer_id
    `);

    console.log('\n📈 Overall Statistics:');
    console.log(`  Total Customers: ${stats[0].total_customers}`);
    console.log(`  Customers with Unpaid Bills: ${stats[0].customers_with_unpaid}`);
    console.log(`  Total Unpaid Bills: ${stats[0].total_unpaid_bills}`);
    console.log(`  Percentage with unpaid: ${((stats[0].customers_with_unpaid / stats[0].total_customers) * 100).toFixed(1)}%`);

    // Check outstanding vs last bill mismatch
    const [mismatches] = await connection.execute(`
      SELECT
        id,
        full_name,
        meter_number,
        outstanding_balance,
        last_bill_amount
      FROM customers
      WHERE outstanding_balance != last_bill_amount
      LIMIT 5
    `);

    console.log('\n\n💡 Customers where Outstanding Balance ≠ Last Bill Amount:');
    if (mismatches.length === 0) {
      console.log('  None found - All customers have matching values');
      console.log('  (This means all customers have exactly 1 unpaid bill)');
    } else {
      mismatches.forEach(customer => {
        console.log(`  ${customer.full_name} (${customer.meter_number})`);
        console.log(`    Outstanding Balance: Rs ${customer.outstanding_balance}`);
        console.log(`    Last Bill Amount: Rs ${customer.last_bill_amount}`);
        console.log(`    Difference: Rs ${(parseFloat(customer.outstanding_balance) - parseFloat(customer.last_bill_amount)).toFixed(2)}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkUnpaidBills();

