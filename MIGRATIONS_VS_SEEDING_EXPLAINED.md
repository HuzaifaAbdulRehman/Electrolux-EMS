# 🔑 MIGRATIONS vs SEEDING - Complete Guide

## The CRITICAL Difference (Must Understand!)

### ❌ WRONG Understanding:
"I have SQL migration files AND a seed.ts file - which one should I use?"

### ✅ CORRECT Understanding:
"Migration files and seed files serve DIFFERENT purposes - I need BOTH!"

---

## 🏗️ MIGRATIONS (Structure/Schema)

**Purpose**: Define and modify database STRUCTURE (tables, columns, relationships)

**Location**: `src/lib/drizzle/migrations/*.sql`

**Examples**:
- `0000_real_sentry.sql` - Creates initial tables
- `0001_fix_dbms_normalization.sql` - Normalizes tariffs, adds views
- `0006_add_employee_number.sql` - Adds new column to employees

**When to run**:
- ✅ ONCE when setting up database
- ✅ ONCE when deploying to new environment
- ✅ After adding/modifying schema

**What they do**:
```sql
-- Create tables
CREATE TABLE customers (...);

-- Add columns
ALTER TABLE employees ADD COLUMN employee_number VARCHAR(20);

-- Create views
CREATE VIEW customers_normalized AS SELECT ...;

-- Create stored procedures
CREATE PROCEDURE process_payment(...);
```

**Run migrations**:
```bash
# Drizzle ORM runs migrations automatically
npx drizzle-kit push:mysql
# OR
npx drizzle-kit migrate
```

---

## 🌱 SEEDING (Test Data)

**Purpose**: Insert TEST/DEMO DATA into existing tables

**Location**: `src/lib/drizzle/seed.ts`

**Examples**:
- Creates 50 customers
- Creates 10 employees
- Generates 6 months of bills
- Creates sample payments

**When to run**:
- ✅ ANYTIME you want fresh test data
- ✅ Before viva/demo presentation
- ✅ After clearing database
- ✅ For development/testing

**What it does**:
```typescript
// Insert test data
await db.insert(users).values({...});
await db.insert(customers).values({...});
await db.insert(bills).values({...});
```

**Run seeding**:
```bash
npx tsx src/lib/drizzle/seed.ts
```

---

## 🔄 The Workflow

### 1️⃣ Initial Setup (First Time)
```bash
# Step 1: Run migrations (creates structure)
npx drizzle-kit push:mysql

# Step 2: Run seed (inserts test data)
npx tsx src/lib/drizzle/seed.ts
```

**Result**: Database with structure + test data

### 2️⃣ Adding New Feature (e.g., employeeNumber field)
```bash
# Step 1: Update schema in TypeScript
# Edit: src/lib/drizzle/schema/employees.ts
# Add: employeeNumber: varchar('employee_number', { length: 20 }).unique()

# Step 2: Generate migration
npx drizzle-kit generate:mysql

# Step 3: Run migration (adds column to existing database)
npx drizzle-kit push:mysql

# Step 4: Update seed file to include new field
# Edit: src/lib/drizzle/seed.ts
# Add employeeNumber to employee records

# Step 5: Re-seed (optional - for fresh data)
npx tsx src/lib/drizzle/seed.ts
```

### 3️⃣ Before Viva Presentation (Fresh Start)
```bash
# This ONLY clears DATA, keeps STRUCTURE
npx tsx src/lib/drizzle/seed.ts
```

**What happens**:
```typescript
// Inside seed.ts:
await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
await db.execute(sql`TRUNCATE TABLE users`);      // Clears data
await db.execute(sql`TRUNCATE TABLE customers`);  // Clears data
// ... tables still exist, just empty
await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

// Then inserts fresh data
await db.insert(users).values({...});
```

---

## 📂 Your Database Structure

```
src/lib/drizzle/
├── schema/              ← TypeScript definitions (source of truth)
│   ├── users.ts
│   ├── customers.ts
│   ├── employees.ts     ← We added employeeNumber here
│   ├── tariffs.ts
│   └── ...
│
├── migrations/          ← SQL files (generated from schema)
│   ├── 0000_real_sentry.sql          ← Initial structure
│   ├── 0001_fix_dbms_normalization.sql
│   ├── 0006_add_employee_number.sql  ← Adds column
│   └── ...
│
├── db.ts               ← Database connection
└── seed.ts             ← Test data insertion

```

**How they relate**:
1. **Schema (TypeScript)** → Defines what tables/columns should exist
2. **Migrations (SQL)** → Actually creates/modifies them in MySQL
3. **Seed (TypeScript)** → Inserts test data into those tables

---

## ❓ Your Questions Answered

### Q1: "The seed file is outdated after schema changes"
**A**: YES! We need to update seed.ts to include `employeeNumber` field

**Fix**: Add this to employee seeding in seed.ts:
```typescript
employeeNumber: `EMP-${String(i + 1).padStart(3, '0')}`, // EMP-001, EMP-002, etc.
```

### Q2: "Should I use seeded data OR SQL migration files?"
**A**: BOTH! They serve different purposes:
- **Migrations**: Define structure (run once per change)
- **Seeding**: Insert data (run anytime for fresh data)

### Q3: "Will re-seeding make my project inconsistent?"
**A**: NO! Seeding is DESIGNED to be run multiple times:

```typescript
// Seed.ts does this safely:
1. TRUNCATE tables (clears data, keeps structure)
2. INSERT fresh data
```

**Structure stays the same** (created by migrations)
**Data is replaced** (fresh test data)

**This is NORMAL and EXPECTED in development!**

### Q4: "All database code is in lib/drizzle folder?"
**A**: YES!

- ✅ Schema definitions: `lib/drizzle/schema/`
- ✅ Migrations: `lib/drizzle/migrations/`
- ✅ Seeding: `lib/drizzle/seed.ts`
- ✅ Connection: `lib/drizzle/db.ts`

**This is correct and organized!**

---

## 🎯 Recommendations for Your Project

### For Development:
```bash
# When you add a feature:
1. Update schema file (e.g., employees.ts)
2. Generate migration: npx drizzle-kit generate:mysql
3. Run migration: npx drizzle-kit push:mysql
4. Update seed.ts if needed
5. Re-seed: npx tsx src/lib/drizzle/seed.ts
```

### For Viva Presentation:
```bash
# Morning of viva:
npx tsx src/lib/drizzle/seed.ts

# This gives you:
- Clean, fresh data
- Known test accounts
- Predictable demo scenarios
```

### For Submission:
```bash
# Include in your project:
✅ All migration files (show evolution of schema)
✅ Seed file (show you can generate test data)
✅ Schema definitions (source of truth)

# Explain to professor:
"Migrations define our database structure based on DBMS theory.
Seeding provides test data for demonstration."
```

---

## 🔐 Safety of Re-Seeding

### Is it safe? YES!

**What TRUNCATE does**:
- ✅ Removes all rows from table
- ✅ Resets auto-increment to 1
- ✅ KEEPS table structure
- ✅ KEEPS constraints, indexes
- ✅ KEEPS stored procedures, views

**What TRUNCATE does NOT do**:
- ❌ Drop tables
- ❌ Remove columns
- ❌ Delete migrations
- ❌ Affect schema structure

**Example**:
```sql
-- Before seed:
customers table exists with 100 rows
employees table exists with 20 rows

-- After TRUNCATE (inside seed):
customers table exists with 0 rows ← Empty but still exists
employees table exists with 0 rows

-- After INSERT (inside seed):
customers table exists with 50 rows ← Fresh test data
employees table exists with 10 rows
```

---

## 🎓 For Your Viva

**When professor asks: "How do you manage database?"**

**Your answer**:
> "We use a two-layer approach:
>
> 1. **Migrations** define the schema structure following DBMS normalization principles. These are SQL files that create tables, views, stored procedures, and maintain referential integrity.
>
> 2. **Seeding** provides test data for development and demonstration. This can be run anytime without affecting the schema structure.
>
> This separation follows database best practices - schema changes are tracked through migrations, while test data is generated programmatically."

**Then demonstrate**:
```bash
# Show structure exists
SHOW TABLES;

# Clear and re-seed
npx tsx src/lib/drizzle/seed.ts

# Show fresh data
SELECT COUNT(*) FROM customers;
```

---

## ✅ Summary Table

| Aspect | Migrations | Seeding |
|--------|-----------|---------|
| **Purpose** | Define schema | Insert test data |
| **Location** | `migrations/*.sql` | `seed.ts` |
| **Run frequency** | Once per change | Anytime |
| **Safe to re-run** | Conditional | YES, always |
| **Affects structure** | YES | NO |
| **Affects data** | NO | YES |
| **For submission** | REQUIRED | OPTIONAL (but helpful) |
| **For viva** | Show evolution | Demonstrate features |

---

## 🚀 Next Steps

1. ✅ Keep all migration files (they show your schema evolution)
2. ✅ Update seed.ts to include new `employeeNumber` field
3. ✅ Test re-seeding multiple times
4. ✅ Use seeding before viva for clean demo
5. ✅ Explain the difference to professor

**You're doing it RIGHT! Both migrations and seeding are needed and serve different purposes.**
