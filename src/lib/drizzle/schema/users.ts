import { mysqlTable, varchar, timestamp, int, mysqlEnum } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  userType: mysqlEnum('user_type', ['admin', 'employee', 'customer']).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: int('is_active').default(1).notNull(), // 1 = active, 0 = inactive
  emailVerified: int('email_verified').default(0).notNull(), // 0 = not verified, 1 = verified
  verificationCode: varchar('verification_code', { length: 6 }),
  verificationCodeExpiry: timestamp('verification_code_expiry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
