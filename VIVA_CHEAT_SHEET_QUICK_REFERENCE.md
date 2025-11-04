# VIVA Quick Reference Cheat Sheet
## Electrolux EMS Database - 5th Semester DBMS

---

## 🎯 Database At A Glance

**Database**: `electricity_ems` | **Engine**: MySQL 8.0 InnoDB | **Tables**: 16 active | **Normalization**: BCNF

---

## 📊 Quick Stats to Remember

```
Total Tables: 16 active (+ 2 legacy removed)
Total Relationships: 25+ foreign keys
Total Indexes: 45+ indexes
Migration Files: 13 sequential
Primary Keys: All use AUTO_INCREMENT INT
Character Set: utf8mb4_unicode_ci
```

---

## 🔑 Core Entities (Remember These!)

### Master Tables
1. **users** - Authentication (admin/employee/customer)
2. **customers** - Customer profiles (1:1 with users)
3. **employees** - Employee profiles (1:1 with users)

### Transaction Tables
4. **meter_readings** - Monthly consumption
5. **bills** - Generated bills
6. **payments** - Payment records
7. **tariffs** + **tariff_slabs** - Pricing (normalized!)

### Service Tables
8. **complaints** - Customer complaints
9. **work_orders** - Field work
10. **connection_requests** - New connections
11. **notifications** - User messages

---

## 🎓 Normalization Quick Answers

### How We Achieved Each Normal Form:

**1NF** ✅
- Problem: Tariffs had slab1, slab2, slab3... columns (repeating groups)
- Solution: Created separate `tariff_slabs` table
- Result: All attributes atomic, no repeating groups

**2NF** ✅
- We use single-column primary keys (id)
- No partial dependencies possible
- All non-key attributes depend on entire PK

**3NF** ✅
- Separated users from customers/employees
- No transitive dependencies
- Example: email doesn't determine password through userType

**BCNF** ✅
- All determinants are candidate keys
- Example: In users table, both id and email are candidate keys

---

## 🔗 Key Relationships (Draw These!)

```
users ──┬── 1:1 ── customers ──┬── 1:N ── meter_readings
        │                      ├── 1:N ── bills ── 1:N ── payments
        │                      └── 1:N ── complaints
        │
        ├── 1:1 ── employees ──┬── 1:N ── meter_readings (recorder)
        │                      └── 1:N ── work_orders (assigned)
        │
        └── 1:N ── notifications

tariffs ── 1:N ── tariff_slabs (NORMALIZED!)
```

---

## 🛡️ Integrity Constraints

### Domain Integrity
- **ENUM**: userType, status, connectionType, priority
- **DECIMAL(10,2)**: All monetary values
- **VARCHAR lengths**: email(255), phone(20), address(500)

### Entity Integrity
- **Primary Keys**: All tables have non-null id
- **AUTO_INCREMENT**: Automatic unique generation

### Referential Integrity
- **CASCADE DELETE**: users→customers, customers→bills
- **SET NULL**: employees→complaints (when employee deleted)
- **NO ACTION**: bills→meter_readings (preserve history)

---

## 📈 Indexing Strategy

### Types of Indexes We Use:
1. **Primary Index** (Clustered): On id column
2. **Foreign Key Indexes**: All FKs indexed
3. **Query Optimization**:
   - `idx_bills_billing_month` - Monthly reports
   - `idx_bills_due_date` - Overdue checks
   - `idx_customers_status` - Active filtering
4. **Composite Indexes**:
   - `(customerId, status)` - Filtered queries
   - `(userId, isRead)` - Unread notifications

---

## 💪 ACID Properties

**Atomicity**: InnoDB transactions (START TRANSACTION, COMMIT, ROLLBACK)
**Consistency**: FK constraints + application validation
**Isolation**: REPEATABLE READ (default InnoDB level)
**Durability**: Redo logs + write-ahead logging

---

## ❓ Top 10 VIVA Questions & Answers

### 1. "Why separate tariff_slabs table?"
**Answer**: To achieve 1NF by eliminating repeating groups (slab1, slab2, slab3...).

### 2. "Why use surrogate keys (id) instead of natural keys?"
**Answer**: Ensures uniqueness, simplifies joins, allows natural attributes to change.

### 3. "Explain CASCADE DELETE vs SET NULL"
**Answer**: CASCADE for existence dependencies (user→customer), SET NULL for assignments (employee→complaint).

### 4. "Why store outstandingBalance in customers?"
**Answer**: Deliberate denormalization for dashboard performance. Source of truth in bills/payments.

### 5. "How do you prevent SQL injection?"
**Answer**: Parameterized queries via Drizzle ORM, input validation, type safety.

### 6. "What's your indexing strategy?"
**Answer**: Index all FKs, frequent WHERE clauses, composite for multi-column queries.

### 7. "How do you handle concurrent updates?"
**Answer**: InnoDB MVCC with row-level locking, REPEATABLE READ isolation.

### 8. "Why no stored procedures?"
**Answer**: Business logic in application for better version control, testing, debugging.

### 9. "How is password security handled?"
**Answer**: Bcrypt hashing before storage, never store plain text.

### 10. "What's the purpose of migrations?"
**Answer**: Version control for database schema, track changes, enable rollbacks.

---

## 🚀 Performance Optimizations

1. **Connection Pooling**: 5 connection limit
2. **Indexed Foreign Keys**: All FKs have indexes
3. **Composite Indexes**: For complex queries
4. **Denormalized Aggregates**: outstandingBalance cached
5. **Prepared Statements**: Via ORM prevents SQL injection

---

## 📝 Important Patterns

### Unique ID Formats
- Account: `ELX-2024-XXXXXX`
- Meter: `MTR-XXX-XXXXXX`
- Bill: `BILL-2024-XXXXXX`

### Status Enums
- Customer: `pending_installation`, `active`, `suspended`, `inactive`
- Bill: `generated`, `issued`, `paid`, `overdue`, `cancelled`
- Payment: `pending`, `completed`, `failed`, `refunded`

### User Types
- `admin` - System administrators
- `employee` - Company staff
- `customer` - Electricity consumers

---

## 🔧 Quick SQL Commands

```sql
-- Show all tables
SHOW TABLES;

-- View table structure
DESCRIBE customers;

-- Check indexes
SHOW INDEX FROM bills;

-- View foreign keys
SELECT * FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'electricity_ems'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Find overdue bills
SELECT * FROM bills
WHERE status = 'overdue' AND due_date < CURRENT_DATE;
```

---

## ⚠️ Known Issues (Be Honest!)

1. **Missing Indexes**: Some FKs need explicit indexes
2. **No Partitioning**: Large tables might need partitioning at scale
3. **No Audit Trail**: Consider adding for production
4. **Legacy Tables**: connection_applications, system_settings (safe to remove)

---

## ✨ Strengths to Highlight

1. **Perfect BCNF normalization** with justified denormalization
2. **Comprehensive indexing** (45+ indexes)
3. **Complete referential integrity** (25+ FKs)
4. **Type safety** via Drizzle ORM
5. **Security** (password hashing, parameterized queries)
6. **Clear migration history** (13 migrations)
7. **Well-documented** code and schema

---

## 🎯 Final Tips for VIVA

1. **Start with confidence**: "Our database is in BCNF with 16 active tables..."
2. **Draw the ER diagram** while explaining relationships
3. **Use examples**: "For instance, when we delete a user..."
4. **Admit trade-offs**: "We denormalized outstandingBalance for performance..."
5. **Show the migrations**: Demonstrates iterative improvement
6. **Mention security**: Password hashing, SQL injection prevention
7. **Be ready with SQL**: Show some queries if asked

---

## 📚 Theory Concepts Checklist

✅ **Normalization**: 1NF, 2NF, 3NF, BCNF
✅ **Keys**: Primary, Foreign, Candidate, Unique
✅ **Constraints**: Domain, Entity, Referential, User-defined
✅ **ACID**: Atomicity, Consistency, Isolation, Durability
✅ **Indexes**: Clustered, Non-clustered, Composite, Covering
✅ **Relationships**: 1:1, 1:N, N:M (none in our design)
✅ **ER Model**: Strong entities, Weak entities, Relationships
✅ **SQL**: DDL, DML, DCL, TCL
✅ **Joins**: Inner, Left, Right (used in queries)
✅ **Transactions**: START, COMMIT, ROLLBACK

---

## 🏆 Key Achievement

**"We successfully normalized a complex energy management system to BCNF while maintaining performance through strategic denormalization and comprehensive indexing."**

---

**Remember**: Be confident, use examples, and show your understanding of trade-offs!

*Good luck with your VIVA! 🎓*