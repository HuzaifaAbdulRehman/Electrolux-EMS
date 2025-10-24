import { mysqlTable, varchar, timestamp, int, decimal, date, mysqlEnum } from 'drizzle-orm/mysql-core';

export const tariffs = mysqlTable('tariffs', {
  id: int('id').primaryKey().autoincrement(),
  category: mysqlEnum('category', ['Residential', 'Commercial', 'Industrial', 'Agricultural']).notNull(),
  fixedCharge: decimal('fixed_charge', { precision: 10, scale: 2 }).notNull(), // Monthly fixed charge

  // Consumption slabs (in kWh) and rates (per kWh)
  slab1Start: int('slab1_start').default(0).notNull(),
  slab1End: int('slab1_end').notNull(),
  slab1Rate: decimal('slab1_rate', { precision: 10, scale: 2 }).notNull(),

  slab2Start: int('slab2_start').notNull(),
  slab2End: int('slab2_end').notNull(),
  slab2Rate: decimal('slab2_rate', { precision: 10, scale: 2 }).notNull(),

  slab3Start: int('slab3_start').notNull(),
  slab3End: int('slab3_end').notNull(),
  slab3Rate: decimal('slab3_rate', { precision: 10, scale: 2 }).notNull(),

  slab4Start: int('slab4_start').notNull(),
  slab4End: int('slab4_end').notNull(),
  slab4Rate: decimal('slab4_rate', { precision: 10, scale: 2 }).notNull(),

  slab5Start: int('slab5_start').notNull(),
  slab5End: int('slab5_end'), // NULL means unlimited
  slab5Rate: decimal('slab5_rate', { precision: 10, scale: 2 }).notNull(),

  // Time of Use rates (optional advanced pricing)
  timeOfUsePeakRate: decimal('time_of_use_peak_rate', { precision: 10, scale: 2 }),
  timeOfUseNormalRate: decimal('time_of_use_normal_rate', { precision: 10, scale: 2 }),
  timeOfUseOffpeakRate: decimal('time_of_use_offpeak_rate', { precision: 10, scale: 2 }),

  // Additional charges
  electricityDutyPercent: decimal('electricity_duty_percent', { precision: 5, scale: 2 }).default('0.00'), // e.g., 6%
  gstPercent: decimal('gst_percent', { precision: 5, scale: 2 }).default('18.00'), // e.g., 18%

  effectiveDate: date('effective_date').notNull(),
  validUntil: date('valid_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type Tariff = typeof tariffs.$inferSelect;
export type NewTariff = typeof tariffs.$inferInsert;
