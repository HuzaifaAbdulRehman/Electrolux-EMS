-- ============================================
-- FINAL PRE-SUBMISSION DATABASE CLEANUP
-- Electrolux EMS - 5th Semester DBMS Project
-- ============================================

-- ============================================
-- STEP 1: DROP LEGACY TABLES
-- ============================================

DROP TABLE IF EXISTS connection_applications;
DROP TABLE IF EXISTS system_settings;

-- ============================================
-- STEP 2: ADD OPTIMIZATION INDEXES
-- ============================================

-- Index for connection_requests zone filtering (load shedding)
CREATE INDEX idx_connection_requests_zone ON connection_requests(zone);

-- Composite index for complaints by customer and status
CREATE INDEX idx_complaints_customer_status ON complaints(customer_id, status);

-- Index for work_type filtering
CREATE INDEX idx_work_orders_type ON work_orders(work_type);

-- Index for work_orders status filtering
CREATE INDEX idx_work_orders_status_priority ON work_orders(status, priority);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count active tables (should be 16)
SELECT 'Total Active Tables:' as verification, COUNT(*) as count
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'electricity_ems'
AND TABLE_TYPE = 'BASE TABLE';

-- Count foreign keys (should be ~25)
SELECT 'Total Foreign Keys:' as verification, COUNT(*) as count
FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'electricity_ems'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- List all tables
SELECT 'Active Tables:' as info;
SELECT TABLE_NAME as table_name
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'electricity_ems'
AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Check for orphaned records
SELECT 'Orphaned Customers:' as check, COUNT(*) as count
FROM customers c
LEFT JOIN users u ON c.user_id = u.id
WHERE u.id IS NULL;

SELECT 'Orphaned Employees:' as check, COUNT(*) as count
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
WHERE u.id IS NULL;

SELECT 'Orphaned Bills:' as check, COUNT(*) as count
FROM bills b
LEFT JOIN customers c ON b.customer_id = c.id
WHERE c.id IS NULL;

SELECT 'Orphaned Payments:' as check, COUNT(*) as count
FROM payments p
LEFT JOIN customers c ON p.customer_id = c.id
WHERE c.id IS NULL;

-- Index coverage by table
SELECT 'Index Coverage:' as info;
SELECT
    TABLE_NAME as table_name,
    COUNT(*) as index_count
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'electricity_ems'
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;

SELECT '✅ Cleanup Complete!' as status;
