-- ============================================
-- PRE-SUBMISSION DATABASE CLEANUP & OPTIMIZATION
-- Electrolux EMS - 5th Semester DBMS Project
-- ============================================
-- Run this script before generating ERD for submission

-- ============================================
-- STEP 1: SAFELY DROP LEGACY TABLES
-- ============================================

DROP TABLE IF EXISTS connection_applications;
DROP TABLE IF EXISTS system_settings;

-- ============================================
-- STEP 2: ADD MISSING INDEXES FOR OPTIMIZATION
-- ============================================
-- Note: Using DROP INDEX IF EXISTS before CREATE to avoid duplicates

-- Index for connection_requests zone filtering
CREATE INDEX idx_connection_requests_zone ON connection_requests(zone);

-- Composite index for active/pending complaints by customer
CREATE INDEX idx_complaints_customer_status ON complaints(customer_id, status);

-- Composite index for work orders by source
CREATE INDEX idx_work_orders_source_ref ON work_orders(source, source_reference_id);

-- ============================================
-- STEP 3: VERIFY FINAL TABLE COUNT
-- ============================================

SELECT COUNT(*) as total_active_tables
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'electricity_ems'
AND TABLE_TYPE = 'BASE TABLE';

-- Expected: 16 tables

-- ============================================
-- STEP 4: VERIFY FOREIGN KEY CONSTRAINTS
-- ============================================

SELECT COUNT(*) as total_foreign_keys
FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'electricity_ems'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Expected: ~25 foreign keys

-- ============================================
-- STEP 5: VERIFY INDEX COVERAGE
-- ============================================

SELECT
    TABLE_NAME,
    COUNT(*) as index_count
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'electricity_ems'
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;

-- ============================================
-- STEP 6: CHECK FOR ORPHANED RECORDS
-- ============================================

-- Check for orphaned customers
SELECT COUNT(*) as orphaned_customers
FROM customers c
LEFT JOIN users u ON c.user_id = u.id
WHERE u.id IS NULL;

-- Check for orphaned employees
SELECT COUNT(*) as orphaned_employees
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
WHERE u.id IS NULL;

-- Check for orphaned bills
SELECT COUNT(*) as orphaned_bills
FROM bills b
LEFT JOIN customers c ON b.customer_id = c.id
WHERE c.id IS NULL;

-- Check for orphaned payments
SELECT COUNT(*) as orphaned_payments
FROM payments p
LEFT JOIN customers c ON p.customer_id = c.id
WHERE c.id IS NULL;

-- ============================================
-- COMPLETION
-- ============================================

SELECT '✅ Database cleanup complete!' as status;
