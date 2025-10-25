// Check meter number formats across cities
const mysql = require('mysql2/promise');

async function checkMeterNumbers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SteveSmith@12345',
    database: 'electricity_ems'
  });

  try {
    console.log('🔍 Checking meter numbers by city:\n');

    // Get meter numbers grouped by city
    const [customers] = await connection.execute(`
      SELECT city, meter_number, full_name
      FROM customers
      ORDER BY city, meter_number
      LIMIT 20
    `);

    let currentCity = '';
    customers.forEach(customer => {
      if (customer.city !== currentCity) {
        currentCity = customer.city;
        console.log(`\n📍 ${currentCity}:`);
      }
      console.log(`  ${customer.meter_number} - ${customer.full_name}`);
    });

    // Count by city
    console.log('\n\n📊 Distribution by city:');
    const [cityCounts] = await connection.execute(`
      SELECT city, COUNT(*) as count
      FROM customers
      GROUP BY city
      ORDER BY count DESC
    `);

    cityCounts.forEach(row => {
      console.log(`  ${row.city}: ${row.count} customers`);
    });

    // Test search for MTR-KHI
    console.log('\n\n🔎 Testing search for "MTR-KHI":');
    const [khiCustomers] = await connection.execute(`
      SELECT meter_number, full_name, city
      FROM customers
      WHERE meter_number LIKE '%MTR-KHI%'
      LIMIT 5
    `);

    khiCustomers.forEach(customer => {
      console.log(`  ${customer.meter_number} - ${customer.full_name} (${customer.city})`);
    });
    console.log(`  Total matching: ${khiCustomers.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkMeterNumbers();
