/**
 * Setup script for system_settings table
 * Run this once to create the table and insert default values
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function setup() {
  let connection;

  try {
    console.log('\n🔧 Setting up system_settings table...\n');

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'SteveSmith@12345',
      database: process.env.DB_NAME || 'electricity_ems',
    });

    console.log('✓ Connected to database');

    // Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`system_settings\` (
        \`id\` INT PRIMARY KEY AUTO_INCREMENT,
        \`setting_key\` VARCHAR(100) NOT NULL UNIQUE,
        \`setting_value\` TEXT,
        \`category\` ENUM('general', 'billing', 'security', 'system') NOT NULL,
        \`data_type\` ENUM('string', 'number', 'boolean') NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        INDEX \`idx_category\` (\`category\`),
        INDEX \`idx_setting_key\` (\`setting_key\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✓ Table created successfully');

    // Insert default settings
    const defaultSettings = [
      ['company_name', 'Electrolux Distribution Co.', 'general', 'string'],
      ['timezone', 'UTC-5', 'general', 'string'],
      ['currency', 'USD', 'general', 'string'],
      ['language', 'English', 'general', 'string'],
      ['date_format', 'MM/DD/YYYY', 'general', 'string'],
      ['fiscal_year_start', 'January', 'general', 'string'],
      ['auto_logout', '60', 'general', 'number'],
      ['maintenance_mode', 'false', 'general', 'boolean'],
      ['billing_cycle', 'monthly', 'billing', 'string'],
      ['payment_due_days', '15', 'billing', 'number'],
      ['late_fee_percentage', '2', 'billing', 'number'],
      ['grace_period', '5', 'billing', 'number'],
      ['auto_generate_bills', 'true', 'billing', 'boolean'],
      ['enable_auto_pay', 'true', 'billing', 'boolean'],
      ['tax_rate', '15', 'billing', 'number'],
      ['minimum_payment', '10', 'billing', 'number'],
      ['password_min_length', '8', 'security', 'number'],
      ['password_complexity', 'true', 'security', 'boolean'],
      ['two_factor_auth', 'optional', 'security', 'string'],
      ['session_timeout', '30', 'security', 'number'],
      ['max_login_attempts', '5', 'security', 'number'],
      ['ip_whitelist', 'false', 'security', 'boolean'],
      ['api_rate_limit', '100', 'security', 'number'],
      ['data_encryption', 'true', 'security', 'boolean'],
      ['audit_logging', 'true', 'security', 'boolean'],
      ['backup_frequency', 'daily', 'security', 'string'],
      ['cache_enabled', 'true', 'system', 'boolean'],
      ['cdn_enabled', 'true', 'system', 'boolean'],
      ['debug_mode', 'false', 'system', 'boolean'],
      ['performance_monitoring', 'true', 'system', 'boolean'],
      ['error_tracking', 'true', 'system', 'boolean'],
      ['analytics_enabled', 'true', 'system', 'boolean'],
      ['database_backup', 'daily', 'system', 'string'],
      ['log_retention', '90', 'system', 'number'],
    ];

    await connection.query(
      `INSERT INTO \`system_settings\`
       (\`setting_key\`, \`setting_value\`, \`category\`, \`data_type\`)
       VALUES ?
       ON DUPLICATE KEY UPDATE \`setting_value\` = VALUES(\`setting_value\`)`,
      [defaultSettings]
    );

    console.log('✓ Default settings inserted');
    console.log('\n✅ Setup completed successfully!\n');

    // Show sample data
    const [rows] = await connection.query(
      'SELECT COUNT(*) as count FROM system_settings'
    );
    console.log(`📊 Total settings in database: ${rows[0].count}`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL is running');
    console.error('2. Database credentials in .env.local are correct');
    console.error('3. Database "electricity_ems" exists\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setup();
