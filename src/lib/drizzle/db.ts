import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Create MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'SteveSmith@12345',
  database: process.env.DB_NAME || 'electricity_ems',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Initialize Drizzle ORM with the connection pool
export const db = drizzle(pool);
