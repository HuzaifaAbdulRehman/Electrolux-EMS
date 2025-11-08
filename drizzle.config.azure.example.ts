import type { Config } from 'drizzle-kit';

// Azure MySQL Configuration EXAMPLE
//
// INSTRUCTIONS FOR TEAM MEMBERS:
// 1. Copy this file and rename it to: drizzle.config.azure.ts
// 2. Replace the placeholder values with actual Azure credentials
// 3. NEVER commit drizzle.config.azure.ts (it's in .gitignore)
//
// Usage:
// npx drizzle-kit push:mysql --config=drizzle.config.azure.ts

export default {
  schema: './src/lib/drizzle/schema/*.ts',
  out: './src/lib/drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: 'your-server-name.mysql.database.azure.com', // Replace with your Azure MySQL host
    user: 'your-admin-username',                        // Replace with your admin username
    password: 'your-password-here',                     // Replace with your password
    database: 'electricity_ems',
    port: 3306,
    ssl: { rejectUnauthorized: true }, // Azure requires SSL
  },
} satisfies Config;
