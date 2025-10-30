const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function clearDatabase() {
  console.log('🗑️  Clearing all database tables...\n');

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');

    const tables = [
      'notifications',
      'work_orders',
      'connection_applications',
      'payments',
      'bills',
      'meter_readings',
      'tariffs',
      'employees',
      'customers',
      'users'
    ];

    for (const table of tables) {
      await conn.execute(`TRUNCATE TABLE ${table}`);
      console.log(`  ✓ Truncated ${table}`);
    }

    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('\n✅ All tables cleared successfully!');
    await conn.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearDatabase();


