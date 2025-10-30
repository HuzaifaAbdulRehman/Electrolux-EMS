// Migration: Add accountNumber and temporaryPassword to connection_requests table
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'electrolux_ems'
  });

  console.log('Connected to database');

  try {
    // Check if columns already exist
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'connection_requests'
      AND COLUMN_NAME IN ('account_number', 'temporary_password')
    `, [process.env.DB_NAME || 'electrolux_ems']);

    if (columns.length === 2) {
      console.log('✓ Columns already exist. No migration needed.');
      await connection.end();
      return;
    }

    console.log('Adding new columns to connection_requests table...');

    // Add accountNumber column if it doesn't exist
    if (!columns.find(col => col.COLUMN_NAME === 'account_number')) {
      await connection.query(`
        ALTER TABLE connection_requests
        ADD COLUMN account_number VARCHAR(50) NULL
        AFTER application_date
      `);
      console.log('✓ Added account_number column');
    }

    // Add temporaryPassword column if it doesn't exist
    if (!columns.find(col => col.COLUMN_NAME === 'temporary_password')) {
      await connection.query(`
        ALTER TABLE connection_requests
        ADD COLUMN temporary_password VARCHAR(255) NULL
        AFTER account_number
      `);
      console.log('✓ Added temporary_password column');
    }

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

migrate().catch(console.error);

