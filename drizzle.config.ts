import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/drizzle/schema/*.ts',
  out: './src/lib/drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: 'localhost',
    user: 'root',
    password: 'REDACTED',
    database: 'electricity_ems',
  },
} satisfies Config;

