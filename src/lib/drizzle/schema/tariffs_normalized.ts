import { mysqlTable, int, varchar, decimal, date, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

/**
 * NORMALIZED TARIFFS TABLE
 * This is the properly normalized version of the tariffs table
 * after removing the repeating slab groups (2NF violation fixed).
 *
 * The slab data is now stored in the separate tariff_slabs table
 * following proper database normalization principles.
 *
 * DBMS Theory Compliance:
 * - No repeating groups (1NF compliant)
 * - No partial dependencies (2NF compliant)
 * - No transitive dependencies (3NF compliant)
 */
export const tariffsNormalized = mysqlTable('tariffs', {
  id: int('id').primaryKey().autoincrement(),

  // Tariff identification
  category: mysqlEnum('category', ['residential', 'commercial', 'industrial', 'agricultural']).notNull(),

  // Base charges
  baseLoad: int('base_load').notNull(), // in kW
  fixedCharge: decimal('fixed_charge', { precision: 10, scale: 2 }).notNull(),

  // Validity period
  effectiveDate: date('effective_date').notNull(),
  validUntil: date('valid_until'),

  // Status
  status: mysqlEnum('status', ['active', 'inactive']).default('active').notNull(),

  // Audit timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

/**
 * Relationship with tariff_slabs:
 * One tariff can have many slabs (1:N relationship)
 *
 * To get complete tariff with slabs:
 * SELECT t.*, ts.*
 * FROM tariffs t
 * LEFT JOIN tariff_slabs ts ON t.id = ts.tariff_id
 * WHERE t.id = ?
 * ORDER BY ts.slab_order
 */

// Type inference
export type TariffNormalized = typeof tariffsNormalized.$inferSelect;
export type NewTariffNormalized = typeof tariffsNormalized.$inferInsert;