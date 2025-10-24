import { mysqlTable, int, decimal, timestamp, uniqueIndex } from 'drizzle-orm/mysql-core';
import { tariffs } from './tariffs';

/**
 * NORMALIZED TARIFF SLABS TABLE
 * This table fixes the 2NF violation in the original tariffs table
 * by properly normalizing the repeating slab groups (slab1-5).
 *
 * DBMS Theory Compliance:
 * - Satisfies 1NF: Atomic values, no repeating groups
 * - Satisfies 2NF: No partial dependencies
 * - Satisfies 3NF: No transitive dependencies
 * - Satisfies BCNF: All determinants are candidate keys
 */
export const tariffSlabs = mysqlTable('tariff_slabs', {
  id: int('id').primaryKey().autoincrement(),

  // Foreign key to tariffs table
  tariffId: int('tariff_id')
    .notNull()
    .references(() => tariffs.id, { onDelete: 'cascade' }),

  // Slab ordering (1, 2, 3, etc.)
  slabOrder: int('slab_order').notNull(),

  // Unit range for this slab
  startUnits: int('start_units').notNull(),
  endUnits: int('end_units'), // NULL means unlimited

  // Rate for this slab
  ratePerUnit: decimal('rate_per_unit', { precision: 10, scale: 2 }).notNull(),

  // Audit
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // Composite unique constraint ensures no duplicate slabs for same tariff
  uniqueTariffSlab: uniqueIndex('unique_tariff_slab').on(table.tariffId, table.slabOrder),
}));

// Type inference
export type TariffSlab = typeof tariffSlabs.$inferSelect;
export type NewTariffSlab = typeof tariffSlabs.$inferInsert;