# 🎓 VIVA DEMONSTRATION SEED DATA GUIDE

## Why You Need a Viva-Specific Seed Script

**YES, it is HIGHLY RECOMMENDED** to have a dedicated seed script for your viva presentation because:

1. **Predictable Data**: Faker generates random data - during viva you want to know exactly what's in the database
2. **Clean Slate**: Start fresh every time you demonstrate
3. **Professional**: Shows you understand database initialization
4. **Easy Demo**: Specific test accounts make demonstration smooth
5. **Time Management**: Quick reset between demos/tests

## Quick Start - Using Your Existing Seed

Your project already has a seed file at `src/lib/drizzle/seed.ts`. You can use it:

```bash
# Method 1: Using ts-node (if installed)
npx ts-node src/lib/drizzle/seed.ts

# Method 2: Using tsx (recommended)
npx tsx src/lib/drizzle/seed.ts

# Method 3: Compile and run
npx tsc src/lib/drizzle/seed.ts --skipLibCheck
node src/lib/drizzle/seed.js
```

## For Viva: Create a Simple JavaScript Version

Create a file called `seed-viva.js` in your project root:

```javascript
// seed-viva.js - Simple seed for viva demonstration
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DEMO_PASSWORD = 'demo123';

async function seedForViva() {
  console.log('🎓 Seeding database for VIVA...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'electricity_ems'
  });

  // Clear all data
  await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
  const tables = ['outages', 'notifications', 'bill_requests', 'connection_applications',
    'work_orders', 'complaints', 'payments', 'bills', 'meter_readings',
    'tariff_slabs', 'tariffs', 'customers', 'employees', 'users'];

  for (const table of tables) {
    await connection.execute(`TRUNCATE TABLE ${table}`);
  }
  await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✅ Cleared all data\n');

  // Create demo users
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  await connection.execute(
    `INSERT INTO users (email, password, user_type, name, phone, is_active) VALUES
     ('admin@electrolux.com', ?, 'admin', 'Admin User', '+92-300-1234567', 1),
     ('employee@electrolux.com', ?, 'employee', 'Employee User', '+92-300-2222222', 1),
     ('customer@gmail.com', ?, 'customer', 'Customer User', '+92-301-3333333', 1)`,
    [hashedPassword, hashedPassword, hashedPassword]
  );
  console.log('✅ Created demo users (all password: demo123)\n');

  // Add more seed data as needed...

  console.log('\n🎯 VIVA CREDENTIALS:');
  console.log('Admin:    admin@electrolux.com / demo123');
  console.log('Employee: employee@electrolux.com / demo123');
  console.log('Customer: customer@gmail.com / demo123\n');

  await connection.end();
}

seedForViva().catch(console.error);
```

## Running the Seed Script

### Before Viva/Demo:
```bash
# Run your seed script
node seed-viva.js

# Or use the existing TypeScript seed
npx tsx src/lib/drizzle/seed.ts
```

### During Viva:
1. Mention: "Let me show you our database seeding process"
2. Run: `node seed-viva.js`
3. Explain: "This demonstrates INSERT operations and data initialization"
4. Show: Database now has clean, predictable data

## Advantages for Viva Presentation

| Aspect | Without Seed Script | With Seed Script |
|--------|-------------------|------------------|
| Data Quality | Random/messy | Clean and predictable |
| Login Credentials | Have to remember | Fixed (admin/demo123) |
| Demo Flow | Unpredictable | Smooth and professional |
| Professor Questions | Hard to answer about specific data | Easy to explain exact data |
| Time Management | Wasted finding right data | Instant access to test cases |

## What to Show During Viva

### 1. Database Schema
```sql
-- Show tables
SHOW TABLES;

-- Show a table structure
DESCRIBE customers;

-- Show relationships
SELECT * FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'electricity_ems'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### 2. Normalization Evidence
```sql
-- Before normalization (explain): tariffs had slab1_rate, slab2_rate... (1NF violation)

-- After normalization (show):
SELECT t.category, ts.slab_order, ts.start_units, ts.end_units, ts.rate_per_unit
FROM tariffs t
JOIN tariff_slabs ts ON t.id = ts.tariff_id
WHERE t.category = 'Residential'
ORDER BY ts.slab_order;
```

### 3. Views
```sql
-- Show normalized customer view
SELECT * FROM customers_normalized LIMIT 5;

-- Show derived metrics view
SELECT * FROM customer_metrics LIMIT 5;
```

### 4. Stored Procedures
```sql
-- Show procedure definition
SHOW CREATE PROCEDURE process_payment;

-- Execute procedure
CALL process_payment(1, 1, 1000.00, 'online_banking', 'TXN-DEMO-123', 1);
```

### 5. Triggers
```sql
-- Show trigger definition
SHOW CREATE TRIGGER after_bill_insert;

-- Demonstrate trigger (insert bill, show customer record updates automatically)
INSERT INTO bills (...) VALUES (...);
SELECT outstanding_balance FROM customers WHERE id = 1;
```

## Viva Presentation Flow

1. **Start**: "Let me seed the database with demo data"
   ```bash
   node seed-viva.js
   ```

2. **Show Structure**:
   - Open MySQL Workbench
   - Show ER Diagram
   - Explain 16 tables, 5 entities

3. **Demonstrate Features**:
   - Login as admin (admin@electrolux.com / demo123)
   - Show customer list
   - Generate a bill
   - Process a payment
   - Create a complaint

4. **Show SQL**:
   - Run queries from above
   - Explain normalization
   - Show views working
   - Execute stored procedure
   - Demonstrate trigger

5. **Answer Questions**: You have clean, predictable data to reference

## Testing Before Viva

```bash
# Test 1: Seed database
node seed-viva.js

# Test 2: Login to application
npm run dev
# Visit http://localhost:3000
# Login with admin@electrolux.com / demo123

# Test 3: Check database
mysql -u root -p
use electricity_ems;
SELECT COUNT(*) FROM customers;
SELECT * FROM customers LIMIT 5;

# Test 4: Re-seed (should work multiple times)
node seed-viva.js
# Verify it cleared and re-created data
```

## Common Viva Questions & Answers

**Q: How do you ensure data consistency?**
A: "We use foreign keys, CHECK constraints, triggers, and stored procedures with transactions. Let me show you..."

**Q: Why did you normalize the tariffs table?**
A: "Originally we had repeating groups (slab1, slab2...) violating 1NF. We created tariff_slabs table to achieve BCNF. Let me show the queries..."

**Q: How do you handle concurrent payments?**
A: "We use stored procedures with transactions. The process_payment procedure uses START TRANSACTION and ROLLBACK on errors..."

**Q: Can you demonstrate a complex query?**
A: "Yes, our customer_metrics view uses correlated subqueries and aggregates. Let me show you..."

## Benefits Summary

✅ **Professional**: Shows database initialization expertise
✅ **Reproducible**: Same data every time
✅ **Fast**: Quick reset between demos
✅ **Clear**: Known credentials and test cases
✅ **Confidence**: No surprises during presentation
✅ **Flexible**: Can re-run anytime

## Final Checklist

- [ ] Create seed-viva.js script
- [ ] Test seed script works
- [ ] Memorize demo credentials (admin@electrolux.com / demo123)
- [ ] Prepare ER diagram in MySQL Workbench
- [ ] Practice running seed + demo flow
- [ ] Prepare SQL queries to demonstrate features
- [ ] Know your normalization explanation
- [ ] Understand all stored procedures/triggers
- [ ] Have backup if internet/database fails

**Recommendation**: Run your seed script at the START of your viva presentation to show a clean slate!
