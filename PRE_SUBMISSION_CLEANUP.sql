-- ============================================
-- PRE-SUBMISSION DATABASE CLEANUP & OPTIMIZATION
-- Electrolux EMS - 5th Semester DBMS Project
-- ============================================
-- Run this script before generating ERD for submission
-- This script will:
-- 1. Remove legacy tables
-- 2. Add missing indexes for optimization
-- 3. Verify integrity constraints
-- 4. Clean up any redundant data

-- ============================================
-- STEP 1: VERIFY LEGACY TABLES ARE EMPTY
-- ============================================

-- Check if connection_applications has any data
SELECT 'Checking connection_applications...' as step;
SELECT COUNT(*) as records_in_connection_applications FROM connection_applications;

-- Check if system_settings has any data
SELECT 'Checking system_settings...' as step;
SELECT COUNT(*) as records_in_system_settings FROM system_settings;

-- ============================================
-- STEP 2: CHECK FOR FOREIGN KEY DEPENDENCIES
-- ============================================

SELECT 'Checking foreign key dependencies...' as step;
SELECT
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA='electricity_ems'
AND (REFERENCED_TABLE_NAME='connection_applications' OR REFERENCED_TABLE_NAME='system_settings');

-- ============================================
-- STEP 3: SAFELY DROP LEGACY TABLES
-- ============================================
-- These tables are not used in the application and are redundant

SELECT 'Dropping legacy table: connection_applications...' as step;
DROP TABLE IF EXISTS connection_applications;

SELECT 'Dropping legacy table: system_settings...' as step;
DROP TABLE IF EXISTS system_settings;

-- ============================================
-- STEP 4: ADD MISSING INDEXES FOR OPTIMIZATION
-- ============================================

-- Index for reading_requests status lookups
SELECT 'Adding index on reading_requests.status...' as step;
CREATE INDEX IF NOT EXISTS idx_reading_requests_status ON reading_requests(status);

-- Index for connection_requests zone filtering
SELECT 'Adding index on connection_requests.zone...' as step;
CREATE INDEX IF NOT EXISTS idx_connection_requests_zone ON connection_requests(zone);

-- Index for password_reset_requests token lookups
SELECT 'Adding index on password_reset_requests.token...' as step;
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_requests(token);

-- Index for password_reset_requests email lookups
-- Note: This may already exist from migration, IF NOT EXISTS prevents error
CREATE INDEX IF NOT EXISTS idx_password_reset_email ON password_reset_requests(email);

-- Composite index for active/pending complaints by customer
SELECT 'Adding composite index on complaints...' as step;
CREATE INDEX IF NOT EXISTS idx_complaints_customer_status ON complaints(customer_id, status);

-- Composite index for work orders by source
SELECT 'Adding composite index on work_orders...' as step;
CREATE INDEX IF NOT EXISTS idx_work_orders_source_ref ON work_orders(source, source_reference_id);

-- Index for outage zone lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_outages_zone ON outages(zone);

-- Index for outage status lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_outages_status ON outages(status);

-- ============================================
-- STEP 5: VERIFY DATABASE INTEGRITY
-- ============================================

SELECT 'Verifying table counts...' as step;
SELECT
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'tariffs', COUNT(*) FROM tariffs
UNION ALL SELECT 'tariff_slabs', COUNT(*) FROM tariff_slabs
UNION ALL SELECT 'meter_readings', COUNT(*) FROM meter_readings
UNION ALL SELECT 'bills', COUNT(*) FROM bills
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'complaints', COUNT(*) FROM complaints
UNION ALL SELECT 'work_orders', COUNT(*) FROM work_orders
UNION ALL SELECT 'connection_requests', COUNT(*) FROM connection_requests
UNION ALL SELECT 'reading_requests', COUNT(*) FROM reading_requests
UNION ALL SELECT 'bill_requests', COUNT(*) FROM bill_requests
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'outages', COUNT(*) FROM outages
UNION ALL SELECT 'password_reset_requests', COUNT(*) FROM password_reset_requests;

-- ============================================
-- STEP 6: VERIFY FOREIGN KEY CONSTRAINTS
-- ============================================

SELECT 'Checking foreign key constraints...' as step;
SELECT
    CONCAT(TABLE_NAME, '.', COLUMN_NAME) as foreign_key,
    CONCAT(REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME) as references,
    CONSTRAINT_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'electricity_ems'
AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;

-- ============================================
-- STEP 7: VERIFY UNIQUE CONSTRAINTS
-- ============================================

SELECT 'Checking unique constraints...' as step;
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'electricity_ems'
AND CONSTRAINT_NAME LIKE '%unique%' OR CONSTRAINT_NAME LIKE '%email%' OR CONSTRAINT_NAME LIKE '%number%'
ORDER BY TABLE_NAME;

-- ============================================
-- STEP 8: CHECK FOR ORPHANED RECORDS
-- ============================================

SELECT 'Checking for orphaned customer records...' as step;
SELECT COUNT(*) as orphaned_customers
FROM customers c
LEFT JOIN users u ON c.user_id = u.id
WHERE u.id IS NULL;

SELECT 'Checking for orphaned employee records...' as step;
SELECT COUNT(*) as orphaned_employees
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
WHERE u.id IS NULL;

SELECT 'Checking for orphaned bills...' as step;
SELECT COUNT(*) as orphaned_bills
FROM bills b
LEFT JOIN customers c ON b.customer_id = c.id
WHERE c.id IS NULL;

SELECT 'Checking for orphaned payments...' as step;
SELECT COUNT(*) as orphaned_payments
FROM payments p
LEFT JOIN customers c ON p.customer_id = c.id
WHERE c.id IS NULL;

-- ============================================
-- STEP 9: VERIFY INDEX COVERAGE
-- ============================================

SELECT 'Verifying index coverage...' as step;
SELECT
    TABLE_NAME,
    COUNT(*) as index_count
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'electricity_ems'
GROUP BY TABLE_NAME
ORDER BY index_count DESC;

-- ============================================
-- STEP 10: FINAL TABLE COUNT
-- ============================================

SELECT 'Final table count verification...' as step;
SELECT COUNT(*) as total_active_tables
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'electricity_ems'
AND TABLE_TYPE = 'BASE TABLE';

-- Expected: 16 tables (after removing 2 legacy tables)

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

SELECT '✅ Database cleanup and optimization complete!' as status;
SELECT 'Your database is ready for ERD generation and submission!' as message;
SELECT 'Next steps:' as action;
SELECT '1. Generate ERD using MySQL Workbench (Database → Reverse Engineer)' as step_1;
SELECT '2. Export ERD as PNG/PDF for submission' as step_2;
SELECT '3. Review COMPREHENSIVE_DATABASE_ANALYSIS_VIVA_2025.md' as step_3;
SELECT '4. Print VIVA_CHEAT_SHEET_QUICK_REFERENCE.md for quick reference' as step_4;
