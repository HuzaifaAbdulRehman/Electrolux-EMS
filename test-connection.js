const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing database connection...\n');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'electricity_ems'
    });
    
    console.log('✅ Database connected successfully!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ Test query result:', rows[0]);
    
    // Show database name
    const [dbRows] = await connection.execute('SELECT DATABASE() as db');
    console.log('✅ Current database:', dbRows[0].db);
    
    await connection.end();
    console.log('\n✅ Connection test passed!');
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nCheck:');
    console.error('1. MySQL is running');
    console.error('2. Password in .env.local is correct');
    console.error('3. Database "electricity_ems" exists');
  }
}

testConnection();


