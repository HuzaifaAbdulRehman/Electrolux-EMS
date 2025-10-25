// Reset Database and Auto-Reseed with Fresh Faker Data
const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function resetAndReseed() {
  try {
    console.log('🧹 Starting database reset and re-seeding...\n');
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'SteveSmith@12345',
      database: 'electricity_ems'
    });

    console.log('📊 Current database state:');
    
    // Check current data before reset
    const [billsCount] = await connection.execute('SELECT COUNT(*) as count FROM bills');
    const [paymentsCount] = await connection.execute('SELECT COUNT(*) as count FROM payments');
    const [workOrdersCount] = await connection.execute('SELECT COUNT(*) as count FROM work_orders');
    const [notificationsCount] = await connection.execute('SELECT COUNT(*) as count FROM notifications');
    const [meterReadingsCount] = await connection.execute('SELECT COUNT(*) as count FROM meter_readings');
    const [customersCount] = await connection.execute('SELECT COUNT(*) as count FROM customers');
    const [employeesCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
    
    console.log(`  - Bills: ${billsCount[0].count}`);
    console.log(`  - Payments: ${paymentsCount[0].count}`);
    console.log(`  - Work Orders: ${workOrdersCount[0].count}`);
    console.log(`  - Notifications: ${notificationsCount[0].count}`);
    console.log(`  - Meter Readings: ${meterReadingsCount[0].count}`);
    console.log(`  - Customers: ${customersCount[0].count}`);
    console.log(`  - Employees: ${employeesCount[0].count}`);

    console.log('\n🗑️ Removing all data...');
    
    // Remove all data (complete reset)
    await connection.execute('DELETE FROM payments');
    console.log('  ✅ Payments deleted');
    
    await connection.execute('DELETE FROM bills');
    console.log('  ✅ Bills deleted');
    
    await connection.execute('DELETE FROM notifications');
    console.log('  ✅ Notifications deleted');
    
    await connection.execute('DELETE FROM work_orders');
    console.log('  ✅ Work Orders deleted');
    
    await connection.execute('DELETE FROM meter_readings');
    console.log('  ✅ Meter Readings deleted');
    
    await connection.execute('DELETE FROM customers');
    console.log('  ✅ Customers deleted');
    
    await connection.execute('DELETE FROM employees');
    console.log('  ✅ Employees deleted');
    
    // Try to delete optional tables
    try {
      await connection.execute('DELETE FROM connection_requests');
      console.log('  ✅ Connection Requests deleted');
    } catch (e) {
      console.log('  ⚠️ Connection Requests table not found (skipped)');
    }
    
    try {
      await connection.execute('DELETE FROM connection_applications');
      console.log('  ✅ Connection Applications deleted');
    } catch (e) {
      console.log('  ⚠️ Connection Applications table not found (skipped)');
    }
    
    try {
      await connection.execute('DELETE FROM bill_requests');
      console.log('  ✅ Bill Requests deleted');
    } catch (e) {
      console.log('  ⚠️ Bill Requests table not found (skipped)');
    }

    // Keep essential tables
    console.log('\n✅ Keeping essential data:');
    console.log('  ✅ Users (authentication)');
    console.log('  ✅ Tariffs (pricing data)');
    console.log('  ✅ Database structure');

    await connection.end();
    
    console.log('\n🌱 Re-seeding database with fresh faker data...');
    
    // Run the seeding script
    try {
      const { stdout, stderr } = await execAsync('npm run db:seed');
      if (stderr) {
        console.log('⚠️ Seeding warnings:', stderr);
      }
      console.log('✅ Database re-seeded successfully');
    } catch (error) {
      console.error('❌ Error during seeding:', error.message);
      throw error;
    }

    console.log('\n📊 Final database state:');
    
    // Reconnect to check final state
    const finalConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'SteveSmith@12345',
      database: 'electricity_ems'
    });
    
    const [finalBillsCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM bills');
    const [finalPaymentsCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM payments');
    const [finalWorkOrdersCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM work_orders');
    const [finalNotificationsCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM notifications');
    const [finalMeterReadingsCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM meter_readings');
    const [finalCustomersCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM customers');
    const [finalEmployeesCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM employees');
    
    console.log(`  - Bills: ${finalBillsCount[0].count} ✅`);
    console.log(`  - Payments: ${finalPaymentsCount[0].count} ✅`);
    console.log(`  - Work Orders: ${finalWorkOrdersCount[0].count} ✅`);
    console.log(`  - Notifications: ${finalNotificationsCount[0].count} ✅`);
    console.log(`  - Meter Readings: ${finalMeterReadingsCount[0].count} ✅`);
    console.log(`  - Customers: ${finalCustomersCount[0].count} ✅`);
    console.log(`  - Employees: ${finalEmployeesCount[0].count} ✅`);

    // Verify seeded data
    console.log('\n✅ Fresh seeded data verification:');
    const [activeCustomers] = await finalConnection.execute('SELECT COUNT(*) as count FROM customers WHERE status = "active"');
    const [activeEmployees] = await finalConnection.execute('SELECT COUNT(*) as count FROM employees WHERE status = "active"');
    const [tariffsCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM tariffs');
    const [usersCount] = await finalConnection.execute('SELECT COUNT(*) as count FROM users');
    
    console.log(`  - Active Customers: ${activeCustomers[0].count} ✅`);
    console.log(`  - Active Employees: ${activeEmployees[0].count} ✅`);
    console.log(`  - Tariffs: ${tariffsCount[0].count} ✅`);
    console.log(`  - Users: ${usersCount[0].count} ✅`);

    await finalConnection.end();
    
    console.log('\n🎉 Database reset and re-seeding complete!');
    console.log('\n📋 What was done:');
    console.log('  ✅ Complete database reset');
    console.log('  ✅ Fresh faker.js data generated');
    console.log('  ✅ New customers created');
    console.log('  ✅ New employees created');
    console.log('  ✅ New meter readings generated');
    console.log('  ✅ New work orders created');
    console.log('  ✅ Fresh bills generated');
    console.log('  ✅ New notifications created');
    
    console.log('\n🚀 You now have:');
    console.log('  - Fresh customer data');
    console.log('  - Fresh employee data');
    console.log('  - Fresh meter readings');
    console.log('  - Fresh bills (if seeded)');
    console.log('  - Fresh work orders');
    console.log('  - Clean database for testing');
    
    console.log('\n💡 Perfect for:');
    console.log('  - Demo presentations');
    console.log('  - Fresh testing scenarios');
    console.log('  - Clean system state');
    console.log('  - New development cycles');
    
  } catch (error) {
    console.error('❌ Error during reset and re-seeding:', error.message);
    process.exit(1);
  }
}

// Run the reset and re-seed
resetAndReseed();
