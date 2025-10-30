const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function verifyData() {
  console.log('📊 Database Statistics:\n');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const tables = [
    'users',
    'customers',
    'employees',
    'tariffs',
    'meter_readings',
    'bills',
    'payments',
    'work_orders',
    'connection_applications',
    'notifications'
  ];

  for (const table of tables) {
    const [rows] = await conn.execute(`SELECT COUNT(*) as count FROM ${table}`);
    console.log(`  ${table.padEnd(25)} ${rows[0].count} records`);
  }

  console.log('\n📋 Sample Data:\n');

  // Show admin user
  const [adminUser] = await conn.execute("SELECT email, name, user_type FROM users WHERE user_type = 'admin' LIMIT 1");
  console.log('  Admin User:', adminUser[0]);

  // Show sample customer
  const [sampleCustomer] = await conn.execute('SELECT account_number, full_name, connection_type, status FROM customers LIMIT 1');
  console.log('  Sample Customer:', sampleCustomer[0]);

  // Show sample bill
  const [sampleBill] = await conn.execute('SELECT bill_number, billing_month, units_consumed, total_amount, status FROM bills LIMIT 1');
  console.log('  Sample Bill:', sampleBill[0]);

  console.log('\n✅ Database verification complete!');
  console.log('\n🔑 Login Credentials:');
  console.log('  Admin:    admin@electrolux.com / password123');
  console.log('  Employee: employee1@electrolux.com / password123');
  console.log('  Customer: customer1@example.com / password123');

  await conn.end();
  process.exit(0);
}

verifyData();


