# VIVA COMMAND REFERENCE - Electrolux EMS
**Database Management System Project - 5th Semester**

---

## Table of Contents
1. [Quick Start Commands](#quick-start-commands)
2. [Database Backup & Restore](#database-backup--restore)
3. [Database Seeding](#database-seeding)
4. [MySQL Workbench Usage](#mysql-workbench-usage)
5. [PowerShell Query Commands](#powershell-query-commands)
6. [Drizzle Studio Usage](#drizzle-studio-usage)
7. [Common VIVA Queries](#common-viva-queries)
8. [Application Testing](#application-testing)
9. [Troubleshooting](#troubleshooting)

---

## 1. Quick Start Commands

### Start MySQL Service
```powershell
# Windows PowerShell (Run as Administrator)
net start MySQL84
```

### Check MySQL Service Status
```powershell
# PowerShell
Get-Service MySQL84
```

### Start Development Server
```powershell
# In project directory
npm run dev
```

### Open Application
```
http://localhost:3000
```

---

## 2. Database Backup & Restore

### Create Backup
```bash
# PowerShell or CMD
mysqldump -u root -pREDACTED electricity_ems > backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
```

### Create Backup (Simple Name)
```bash
mysqldump -u root -pREDACTED electricity_ems > backup.sql
```

### Restore from Backup
```bash
mysql -u root -pREDACTED electricity_ems < backup.sql
```

### Check Backup File Size
```bash
ls -lh backup*.sql
```

---

## 3. Database Seeding

### Reseed Entire Database
```bash
# IMPORTANT: Creates fresh test data (880+ records)
npm run db:seed
```

### What Gets Seeded:
- **64 users** (1 admin + 10 employees + 53 customers)
- **4 tariff categories** with 20 slabs
- **253 bills** (5 months of history)
- **243 payments** (95% payment rate)
- **20 work orders**
- **20 outages**

### Seeding Output:
```
✅ Seeded 61 users (1 admin + 10 employees + 50 customers)
✅ Seeded 10 employees
✅ Seeded 50 customers
✅ Seeded 4 tariff categories with normalized slabs
✅ Seeded 250 bills (5 previous months only)
✅ Seeded ~240 payments
```

---

## 4. MySQL Workbench Usage

### Opening MySQL Workbench
1. **Open MySQL Workbench** application
2. **Click** on your connection: `root@localhost`
3. **Enter password**: `REDACTED` (check .env.local)
4. **Press** "OK"

### Running Queries in Workbench

#### Method 1: Query Tab
1. Click "Create a new SQL tab" (📄+ icon)
2. Type your query
3. Click "Execute" (⚡ lightning icon) or press `Ctrl+Enter`

#### Method 2: Schema Browser
1. Right-click on `electricity_ems` database
2. Select "Set as Default Schema"
3. Type queries in the query editor

### Example Queries to Run in Workbench

```sql
-- 1. Show all tables
SHOW TABLES;

-- 2. Count total customers
SELECT COUNT(*) as total_customers FROM customers;

-- 3. View customer details
SELECT id, account_number, full_name, connection_type, status
FROM customers
LIMIT 10;

-- 4. Check bill amounts (all whole numbers)
SELECT bill_number, units_consumed, base_amount,
       fixed_charges, electricity_duty, gst_amount, total_amount
FROM bills
LIMIT 5;

-- 5. View tariff slabs
SELECT t.category, ts.slab_order, ts.start_units,
       ts.end_units, ts.rate_per_unit
FROM tariffs t
JOIN tariff_slabs ts ON t.id = ts.tariff_id
ORDER BY t.category, ts.slab_order;

-- 6. Customer payment summary
SELECT c.full_name, c.connection_type,
       COUNT(b.id) as total_bills,
       SUM(b.total_amount) as total_amount,
       c.outstanding_balance
FROM customers c
LEFT JOIN bills b ON c.id = b.customer_id
GROUP BY c.id
LIMIT 10;
```

### Viewing Results
- Results appear in **"Result Grid"** tab below
- Click column headers to sort
- Right-click results to export to CSV/JSON

---

## 5. PowerShell Query Commands

### Basic Query Syntax
```powershell
mysql -u root -pREDACTED electricity_ems -e "YOUR_QUERY_HERE"
```

### Suppress Warning Messages
```powershell
mysql -u root -pREDACTED electricity_ems -e "YOUR_QUERY_HERE" 2>&1 | Select-String -Pattern "^(?!mysql:)"
```

### Common PowerShell Queries

#### 1. Count Records in Each Table
```powershell
mysql -u root -pREDACTED electricity_ems -e "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'customers', COUNT(*) FROM customers UNION ALL SELECT 'bills', COUNT(*) FROM bills UNION ALL SELECT 'payments', COUNT(*) FROM payments;"
```

#### 2. Show User Distribution
```powershell
mysql -u root -pREDACTED electricity_ems -e "SELECT user_type, COUNT(*) as count FROM users GROUP BY user_type;"
```

#### 3. View Recent Bills
```powershell
mysql -u root -pREDACTED electricity_ems -e "SELECT bill_number, billing_month, total_amount, status FROM bills ORDER BY issue_date DESC LIMIT 10;"
```

#### 4. Check Outstanding Balances
```powershell
mysql -u root -pREDACTED electricity_ems -e "SELECT COUNT(*) as customers_with_balance, SUM(CAST(outstanding_balance AS DECIMAL(10,2))) as total_outstanding FROM customers WHERE CAST(outstanding_balance AS DECIMAL(10,2)) > 0;"
```

#### 5. Verify Whole-Number Billing
```powershell
mysql -u root -pREDACTED electricity_ems -e "SELECT bill_number, base_amount, fixed_charges, electricity_duty, gst_amount, total_amount FROM bills WHERE customer_id = 1 LIMIT 1;"
```

---

## 6. Drizzle Studio Usage

### Opening Drizzle Studio
```bash
# In project directory
npx drizzle-kit studio
```

### Accessing Drizzle Studio
1. Terminal shows: `Drizzle Studio is running on https://local.drizzle.studio`
2. **Open browser** and go to: `https://local.drizzle.studio`
3. Studio automatically connects to your database

### Features of Drizzle Studio
- **Browse Tables**: Click on any table in left sidebar
- **View Data**: See all records in grid format
- **Filter Data**: Click column headers to filter
- **Edit Records**: Click any cell to edit (use with caution in VIVA!)
- **Add Records**: Click "+ Add Row" button
- **Delete Records**: Select row and click delete icon
- **Run Queries**: Use SQL tab at top

### Recommended Tables to Show in VIVA
1. **customers** - Shows customer information
2. **bills** - Demonstrates whole-number billing
3. **tariff_slabs** - Shows normalized pricing structure
4. **payments** - Payment history
5. **meter_readings** - Reading history

### Closing Drizzle Studio
- Press `Ctrl+C` in terminal where it's running

---

## 7. Common VIVA Queries

### Database Structure Queries

#### Show All Tables
```sql
SHOW TABLES;
```

#### Describe Table Structure
```sql
DESCRIBE customers;
DESCRIBE bills;
DESCRIBE tariff_slabs;
```

#### Show Foreign Keys
```sql
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'electricity_ems'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Data Validation Queries

#### Check BCNF Normalization
```sql
-- Show tariffs with slabs (normalized)
SELECT t.category, COUNT(ts.id) as slab_count
FROM tariffs t
LEFT JOIN tariff_slabs ts ON t.id = ts.tariff_id
GROUP BY t.id, t.category;
```

#### Verify Whole-Number Billing
```sql
-- All amounts should be whole numbers (no decimals)
SELECT
    bill_number,
    base_amount,
    fixed_charges,
    electricity_duty,
    gst_amount,
    total_amount,
    -- Check if any have decimals (should return 0.00 for all)
    (base_amount - FLOOR(base_amount)) as base_decimal,
    (total_amount - FLOOR(total_amount)) as total_decimal
FROM bills
LIMIT 10;
```

#### Check Data Integrity
```sql
-- Verify all bills have corresponding customers
SELECT
    (SELECT COUNT(*) FROM bills) as total_bills,
    (SELECT COUNT(*) FROM bills b
     WHERE EXISTS (SELECT 1 FROM customers c WHERE c.id = b.customer_id)) as bills_with_customers,
    'All bills have valid customers' as status;
```

### Business Logic Queries

#### Monthly Revenue Report
```sql
SELECT
    billing_month,
    COUNT(*) as total_bills,
    SUM(CAST(total_amount AS DECIMAL(10,2))) as total_revenue,
    AVG(CAST(total_amount AS DECIMAL(10,2))) as avg_bill_amount
FROM bills
GROUP BY billing_month
ORDER BY billing_month DESC;
```

#### Customer Consumption Analysis
```sql
SELECT
    c.connection_type,
    COUNT(DISTINCT c.id) as customer_count,
    AVG(CAST(c.average_monthly_usage AS DECIMAL(10,2))) as avg_consumption,
    SUM(CAST(c.outstanding_balance AS DECIMAL(10,2))) as total_outstanding
FROM customers c
WHERE c.status = 'active'
GROUP BY c.connection_type;
```

#### Payment Collection Rate
```sql
SELECT
    (SELECT COUNT(*) FROM bills WHERE status = 'paid') as paid_bills,
    (SELECT COUNT(*) FROM bills WHERE status IN ('issued', 'generated')) as unpaid_bills,
    (SELECT COUNT(*) FROM bills) as total_bills,
    ROUND(
        (SELECT COUNT(*) FROM bills WHERE status = 'paid') * 100.0 /
        (SELECT COUNT(*) FROM bills),
        2
    ) as payment_rate_percent;
```

#### Zone-wise Customer Distribution
```sql
SELECT
    zone,
    COUNT(*) as customer_count,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count,
    SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_count
FROM customers
GROUP BY zone
ORDER BY zone;
```

### Advanced Queries for Professor

#### Bill Calculation Verification
```sql
-- Verify bill calculation matches formula
-- Formula: Total = Base + Fixed + Duty + GST
SELECT
    bill_number,
    base_amount,
    fixed_charges,
    electricity_duty,
    gst_amount,
    total_amount,
    (CAST(base_amount AS DECIMAL(10,2)) +
     CAST(fixed_charges AS DECIMAL(10,2)) +
     CAST(electricity_duty AS DECIMAL(10,2)) +
     CAST(gst_amount AS DECIMAL(10,2))) as calculated_total,
    CASE
        WHEN ABS(
            CAST(total_amount AS DECIMAL(10,2)) -
            (CAST(base_amount AS DECIMAL(10,2)) +
             CAST(fixed_charges AS DECIMAL(10,2)) +
             CAST(electricity_duty AS DECIMAL(10,2)) +
             CAST(gst_amount AS DECIMAL(10,2)))
        ) < 0.01 THEN 'CORRECT'
        ELSE 'ERROR'
    END as validation_status
FROM bills
LIMIT 10;
```

#### Meter Reading Consistency Check
```sql
-- Verify meter readings are monotonically increasing
SELECT
    mr1.id,
    mr1.customer_id,
    mr1.reading_date,
    CAST(mr1.current_reading AS DECIMAL(10,2)) as current_reading,
    CAST(mr1.previous_reading AS DECIMAL(10,2)) as previous_reading,
    CAST(mr1.units_consumed AS DECIMAL(10,2)) as units_consumed,
    CASE
        WHEN CAST(mr1.current_reading AS DECIMAL(10,2)) >=
             CAST(mr1.previous_reading AS DECIMAL(10,2))
        THEN 'VALID'
        ELSE 'ERROR'
    END as validation_status
FROM meter_readings mr1
LIMIT 10;
```

---

## 8. Application Testing

### Test Credentials

#### Admin Login
```
Email: admin@electrolux.com
Password: password123
```

#### Employee Login (Any of these)
```
Email: employee1@electrolux.com to employee10@electrolux.com
Password: password123
```

#### Customer Login (Any of these)
```
Email: customer1@example.com to customer53@example.com
Password: password123
```

### Testing Workflow for VIVA

#### 1. Admin Bulk Bill Generation
```
1. Login as admin
2. Go to: http://localhost:3000/admin/bills/generate
3. Select current month (November 2025)
4. Click "Load Preview"
5. Show preview statistics
6. Click "Generate Bills"
7. Show success message
```

#### 2. Employee Meter Reading
```
1. Login as employee1
2. Go to: http://localhost:3000/employee/meter-reading
3. Show "All Customers" tab (should be empty - all readings done)
4. Show "Work Orders" tab
5. Explain workflow
```

#### 3. Customer Dashboard
```
1. Login as customer1
2. Go to: http://localhost:3000/customer/dashboard
3. Show dashboard metrics
4. Go to Bill Calculator
5. Enter units: 307 kWh
6. Show calculated amount (should be whole number)
7. Go to View Bills
8. Compare calculator amount with actual bill
```

---

## 9. Troubleshooting

### MySQL Service Not Running
```powershell
# Start MySQL service
net start MySQL84

# Check if running
Get-Service MySQL84
```

### Cannot Connect to Database
```powershell
# Test connection
mysql -u root -pREDACTED -e "SELECT 1;"

# If fails, check credentials in .env.local
```

### Port 3000 Already in Use
```powershell
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
$env:PORT=3001; npm run dev
```

### Backup File Not Found
```powershell
# List all backup files
ls backup*.sql

# Create new backup
mysqldump -u root -pREDACTED electricity_ems > backup_new.sql
```

### Drizzle Studio Won't Start
```bash
# Install dependencies
npm install

# Try again
npx drizzle-kit studio
```

---

## Quick Command Cheat Sheet

| Task | Command |
|------|---------|
| **Start MySQL** | `net start MySQL84` |
| **Start Dev Server** | `npm run dev` |
| **Create Backup** | `mysqldump -u root -pREDACTED electricity_ems > backup.sql` |
| **Restore Backup** | `mysql -u root -pREDACTED electricity_ems < backup.sql` |
| **Reseed Database** | `npm run db:seed` |
| **Open Drizzle Studio** | `npx drizzle-kit studio` |
| **Run Query** | `mysql -u root -pREDACTED electricity_ems -e "QUERY"` |
| **Check TypeScript** | `npx tsc --noEmit` |
| **Build Project** | `npm run build` |

---

## VIVA Demonstration Flow

### Recommended Order:
1. ✅ **Start services** (MySQL + Dev Server)
2. ✅ **Open MySQL Workbench** - Show database structure
3. ✅ **Run key queries** - Demonstrate data integrity
4. ✅ **Open Drizzle Studio** - Visual data browser
5. ✅ **Test Application** - Show all 3 user types
6. ✅ **Explain architecture** - Next.js + Drizzle + MySQL
7. ✅ **Show code** - Highlight key files

### Key Points to Mention:
- ✅ BCNF Normalized (tariffs separated from slabs)
- ✅ 16 tables, 24 foreign keys
- ✅ Whole-number billing (no decimal paisa)
- ✅ Real-world business logic (meter reading workflow)
- ✅ 3-tier architecture (Frontend + API + Database)
- ✅ Type-safe with TypeScript + Drizzle ORM
- ✅ 880+ seeded records for testing

---

**Project**: Electricity Management System (EMS)
**Database**: electricity_ems (MySQL 8.4)
**Framework**: Next.js 14 + TypeScript + Drizzle ORM
**Total Tables**: 16
**Total Records**: 880+

**Last Updated**: November 8, 2025
