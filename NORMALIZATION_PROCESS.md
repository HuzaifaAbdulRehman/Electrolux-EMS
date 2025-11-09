# Electrolux EMS - Database Normalization Process

## Project Overview
**Project Name:** Electrolux Electricity Management System (EMS)
**Database Type:** MySQL 8.0
**DBMS Version:** MySQL 8.4
**ORM:** Drizzle ORM
**Framework:** Next.js 14 + TypeScript
**Semester:** 5th (Fall 2025)
**Final Tables:** 17
**Final Relationships:** 25 Foreign Keys
**Normalization Level:** BCNF (Boyce-Codd Normal Form)

---

## Table of Contents
1. [Unnormalized Form (UNF)](#1-unnormalized-form-unf)
2. [First Normal Form (1NF)](#2-first-normal-form-1nf)
3. [Second Normal Form (2NF)](#3-second-normal-form-2nf)
4. [Third Normal Form (3NF)](#4-third-normal-form-3nf)
5. [Boyce-Codd Normal Form (BCNF)](#5-boyce-codd-normal-form-bcnf)
6. [Final Normalized Schema](#6-final-normalized-schema)
7. [ERD Diagram Description](#7-erd-diagram-description)
8. [Summary & Viva Points](#8-summary--viva-points)

---

## 1. Unnormalized Form (UNF)

### Initial Business Requirements
An electricity management system needs to track:
- ✅ Customer information with multiple bills
- ✅ Bill generation with multiple tariff slabs
- ✅ Multiple payments per bill
- ✅ Meter readings over time
- ✅ Employee assignments to zones
- ✅ Complaints with resolution history
- ✅ Connection requests with approval workflow
- ✅ Power outage schedules affecting zones

### Unnormalized Table

Imagine storing everything in **ONE GIANT TABLE**:

**ELECTRICITY_SYSTEM (All-in-One Table)**

| Column Name | Sample Data | Problems |
|------------|-------------|----------|
| CustomerID | 1 | OK - Unique |
| CustomerName | "John Doe" | Repeated for each bill |
| Email | john@example.com | Repeated for each bill |
| Phone | +1234567890 | Repeated for each bill |
| Address | "123 Main St" | Repeated for each bill |
| City | "New York" | Repeated for each bill |
| State | "NY" | Repeated for each bill |
| Pincode | "10001" | Repeated for each bill |
| AccountNumber | "ELX-2024-000001" | Repeated for each bill |
| MeterNumber | "MTR-NYC-000001" | Repeated for each bill |
| ConnectionType | "Residential" | Repeated for each bill |
| Zone | "Zone A" | Repeated for each bill |
| Status | "active" | Repeated for each bill |
| **BillNumber** | "BILL-2024-000001" | **One row per bill** |
| BillingMonth | "2024-01-01" | Changes per bill |
| IssueDate | "2024-01-05" | Changes per bill |
| DueDate | "2024-01-20" | Changes per bill |
| UnitsConsumed | 150.00 | Changes per bill |
| BaseAmount | 1500.00 | Changes per bill |
| FixedCharges | 100.00 | Changes per bill |
| TotalAmount | 1600.00 | Changes per bill |
| BillStatus | "paid" | Changes per bill |
| **PaymentID** | 101 | **Repeating group!** |
| PaymentAmount | 1600.00 | Multiple per bill |
| PaymentMethod | "credit_card" | Multiple per bill |
| PaymentDate | "2024-01-15" | Multiple per bill |
| TransactionID | "TXN123456" | Multiple per bill |
| **ReadingID** | 201 | **Repeating group!** |
| CurrentReading | 5150.00 | Multiple per customer |
| PreviousReading | 5000.00 | Multiple per customer |
| ReadingDate | "2024-01-03" | Multiple per customer |
| MeterCondition | "good" | Multiple per customer |
| **EmployeeNumber** | "EMP-001" | Repeated |
| EmployeeName | "Mike Smith" | Repeated |
| EmployeeEmail | mike@electrolux.com | Repeated |
| Designation | "Meter Reader" | Repeated |
| Department | "Operations" | Repeated |
| **TariffCategory** | "Residential" | Repeated |
| FixedCharge | 100.00 | Repeated |
| **Slab1Min** | 0 | Repeating group! |
| **Slab1Max** | 100 | Repeating group! |
| **Slab1Rate** | 8.00 | Repeating group! |
| **Slab2Min** | 101 | Repeating group! |
| **Slab2Max** | 200 | Repeating group! |
| **Slab2Rate** | 10.00 | Repeating group! |
| **Slab3Min** | 201 | Repeating group! |
| **Slab3Max** | 300 | Repeating group! |
| **Slab3Rate** | 12.00 | Repeating group! |
| **Slab4Min** | 301 | Repeating group! |
| **Slab4Max** | 500 | Repeating group! |
| **Slab4Rate** | 14.00 | Repeating group! |
| **Slab5Min** | 501 | Repeating group! |
| **Slab5Max** | NULL | Repeating group! |
| **Slab5Rate** | 16.00 | Repeating group! |

### Sample Data Showing the Problem

| CustomerID | CustomerName | Email | BillNumber | BillingMonth | PaymentID | PaymentAmount | Slab1Min | Slab1Max | Slab1Rate | Slab2Min | Slab2Max |
|-----------|--------------|-------|------------|--------------|-----------|---------------|----------|----------|-----------|----------|----------|
| 1 | John Doe | john@mail.com | BILL-001 | 2024-01 | 101 | 800.00 | 0 | 100 | 8.00 | 101 | 200 |
| 1 | John Doe | john@mail.com | BILL-001 | 2024-01 | 102 | 800.00 | 0 | 100 | 8.00 | 101 | 200 |
| 1 | John Doe | john@mail.com | BILL-002 | 2024-02 | 103 | 900.00 | 0 | 100 | 8.00 | 101 | 200 |

**Problems:**
1. ❌ Customer "John Doe" details repeated in every row
2. ❌ Tariff slabs (15 columns!) repeated for every bill
3. ❌ Multiple payments create duplicate rows
4. ❌ Can't add tariff without adding customer

### Problems with UNF

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Repeating Groups** | Multiple bills per customer<br>Multiple payments per bill<br>Multiple tariff slabs | Customer has 12 bills → 12 rows with duplicate info |
| **Data Redundancy** | Customer details repeated for every bill | John's email stored 12 times (once per month) |
| **Update Anomalies** | Changing customer address requires updating many records | Update John's phone → Must update 12 rows |
| **Insertion Anomalies** | Cannot add tariff without having a customer | Cannot add new rate structure independently |
| **Deletion Anomalies** | Deleting last bill removes customer information | Delete John's only bill → Lose all John's data |
| **Multi-valued Dependencies** | Tariff slabs create 15 columns (Slab1-5 × 3 fields) | 15 columns for 5 slabs: Min, Max, Rate |

---

## 2. First Normal Form (1NF)

### Definition & Rules
A relation is in **1NF** if:
1. ✅ All attributes contain only **atomic (indivisible)** values
2. ✅ There are **no repeating groups**
3. ✅ Each column contains values of a **single type**
4. ✅ Each column has a **unique name**
5. ✅ The **order of rows** doesn't matter

### Normalization to 1NF

#### Step 2.1: Separate CUSTOMERS from BILLS

**Before (UNF):** Customer details repeated in every bill row

**After (1NF):** Create separate CUSTOMERS table

**CUSTOMERS Table**

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | Unique identifier |
| `user_id` | INT | NOT NULL, FK → users(id), UNIQUE | 5 | Links to users table |
| `account_number` | VARCHAR(50) | NOT NULL, UNIQUE | ELX-2024-000001 | Account number |
| `meter_number` | VARCHAR(50) | UNIQUE | MTR-NYC-000001 | Meter serial number |
| `full_name` | VARCHAR(255) | NOT NULL | John Doe | Customer name |
| `email` | VARCHAR(255) | NOT NULL | john@mail.com | Contact email |
| `phone` | VARCHAR(20) | NOT NULL | +1234567890 | Phone number |
| `address` | VARCHAR(500) | NOT NULL | 123 Main St | Full address |
| `city` | VARCHAR(100) | NOT NULL | New York | City |
| `state` | VARCHAR(100) | NOT NULL | NY | State |
| `pincode` | VARCHAR(10) | NOT NULL | 10001 | Postal code |
| `zone` | VARCHAR(50) | NULL | Zone A | Load shedding zone |
| `connection_type` | ENUM | NOT NULL | Residential | Type of connection |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | active | Account status |
| `connection_date` | DATE | NOT NULL | 2024-01-01 | Activation date |
| `outstanding_balance` | DECIMAL(10,2) | DEFAULT 0.00 | 0.00 | Unpaid amount |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2024-01-01 10:00:00 | Created timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-01 10:00:00 | Updated timestamp |

**Functional Dependency:**
```
CustomerID → AccountNumber, MeterNumber, FullName, Email, Phone, Address,
             City, State, Pincode, Zone, ConnectionType, Status, ...
```

---

**BILLS Table**

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | Bill unique ID |
| `customer_id` | INT | NOT NULL, FK → customers(id) | 1 | Customer reference |
| `bill_number` | VARCHAR(50) | NOT NULL, UNIQUE | BILL-2024-000001 | Bill number |
| `billing_month` | DATE | NOT NULL | 2024-01-01 | Billing period |
| `issue_date` | DATE | NOT NULL | 2024-01-05 | Bill issue date |
| `due_date` | DATE | NOT NULL | 2024-01-20 | Payment due date |
| `units_consumed` | DECIMAL(10,2) | NOT NULL | 150.00 | kWh consumed |
| `meter_reading_id` | INT | FK → meter_readings(id) | 5 | Related reading |
| `base_amount` | DECIMAL(10,2) | NOT NULL | 1500.00 | Units × Rate |
| `fixed_charges` | DECIMAL(10,2) | NOT NULL | 100.00 | Fixed monthly fee |
| `electricity_duty` | DECIMAL(10,2) | DEFAULT 0.00 | 90.00 | Duty charges |
| `gst_amount` | DECIMAL(10,2) | DEFAULT 0.00 | 286.20 | GST @ 18% |
| `total_amount` | DECIMAL(10,2) | NOT NULL | 1976.20 | Total payable |
| `status` | ENUM | DEFAULT 'generated' | paid | Bill status |
| `payment_date` | DATE | NULL | 2024-01-15 | Date paid |
| `tariff_id` | INT | FK → tariffs(id) | 1 | Tariff used |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2024-01-05 12:00:00 | Created |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-15 14:30:00 | Updated |

**Functional Dependency:**
```
BillID → CustomerID, BillNumber, BillingMonth, UnitsConsumed, TotalAmount, Status, ...
```

**Achievement:** ✅ Customer details now stored ONCE, referenced by `customer_id`

---

#### Step 2.2: Separate PAYMENTS from BILLS

**Before (UNF):** Multiple payments create duplicate bill rows

**After (1NF):** Create separate PAYMENTS table

**PAYMENTS Table**

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | Payment ID |
| `customer_id` | INT | NOT NULL, FK → customers(id) | 1 | Customer reference |
| `bill_id` | INT | FK → bills(id) | 1 | Related bill (optional) |
| `payment_amount` | DECIMAL(10,2) | NOT NULL | 1976.20 | Amount paid |
| `payment_method` | ENUM | NOT NULL | credit_card | Payment method |
| `payment_date` | DATE | NOT NULL | 2024-01-15 | Payment date |
| `transaction_id` | VARCHAR(100) | UNIQUE | TXN20240115123456 | Transaction ref |
| `receipt_number` | VARCHAR(50) | UNIQUE | REC-2024-000001 | Receipt number |
| `status` | ENUM | DEFAULT 'completed' | completed | Payment status |
| `notes` | TEXT | NULL | Paid via online portal | Additional info |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2024-01-15 14:30:00 | Created |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-15 14:30:00 | Updated |

**Functional Dependency:**
```
PaymentID → CustomerID, BillID, PaymentAmount, PaymentMethod, PaymentDate,
            TransactionID, ReceiptNumber, Status, ...
```

**Achievement:** ✅ Multiple payments can exist for one bill without duplication

---

#### Step 2.3: Separate METER_READINGS

**METER_READINGS Table**

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | Reading ID |
| `customer_id` | INT | NOT NULL, FK → customers(id) | 1 | Customer reference |
| `meter_number` | VARCHAR(50) | NOT NULL | MTR-NYC-000001 | Meter serial |
| `current_reading` | DECIMAL(10,2) | NOT NULL | 5150.00 | Current value (kWh) |
| `previous_reading` | DECIMAL(10,2) | NOT NULL | 5000.00 | Previous value (kWh) |
| `units_consumed` | DECIMAL(10,2) | NOT NULL | 150.00 | Difference |
| `reading_date` | DATE | NOT NULL | 2024-01-03 | Date of reading |
| `reading_time` | TIMESTAMP | NOT NULL | 2024-01-03 09:30:00 | Time of reading |
| `meter_condition` | ENUM | DEFAULT 'good' | good | Meter state |
| `accessibility` | ENUM | DEFAULT 'accessible' | accessible | Access status |
| `employee_id` | INT | FK → employees(id) | 3 | Reader employee |
| `photo_path` | VARCHAR(500) | NULL | /uploads/meter_001.jpg | Photo proof |
| `notes` | TEXT | NULL | All readings normal | Additional notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2024-01-03 09:30:00 | Created |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-03 09:30:00 | Updated |

**Functional Dependency:**
```
ReadingID → CustomerID, MeterNumber, CurrentReading, PreviousReading,
            UnitsConsumed, ReadingDate, EmployeeID, ...
```

**Achievement:** ✅ Historical meter readings stored independently

---

#### Step 2.4: Remove Tariff Slab Repeating Groups (Critical!)

**Before (UNF):** 15 columns for 5 slabs

```
TARIFFS (BAD DESIGN - NOT IN 1NF)
TariffID, Category, FixedCharge,
Slab1Min, Slab1Max, Slab1Rate,
Slab2Min, Slab2Max, Slab2Rate,
Slab3Min, Slab3Max, Slab3Rate,
Slab4Min, Slab4Max, Slab4Rate,
Slab5Min, Slab5Max, Slab5Rate,
ElectricityDuty, GST
```

**Problem:** What if we need 6 slabs? 7 slabs? Add 3 more columns each time!

**After (1NF):** Split into two tables

**TARIFFS Table**

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | Tariff ID |
| `category` | ENUM | NOT NULL | Residential | Connection type |
| `fixed_charge` | DECIMAL(10,2) | NOT NULL | 100.00 | Monthly fixed fee |
| `time_of_use_peak_rate` | DECIMAL(10,2) | NULL | 15.00 | Peak hours rate |
| `time_of_use_normal_rate` | DECIMAL(10,2) | NULL | 10.00 | Normal hours rate |
| `time_of_use_offpeak_rate` | DECIMAL(10,2) | NULL | 6.00 | Off-peak rate |
| `electricity_duty_percent` | DECIMAL(5,2) | DEFAULT 0.00 | 6.00 | Duty % |
| `gst_percent` | DECIMAL(5,2) | DEFAULT 18.00 | 18.00 | GST % |
| `effective_date` | DATE | NOT NULL | 2024-01-01 | Rate start date |
| `valid_until` | DATE | NULL | 2024-12-31 | Rate end date |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2024-01-01 00:00:00 | Created |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-01 00:00:00 | Updated |

**TARIFF_SLABS Table** (NEW - Eliminates repeating groups!)

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | Slab ID |
| `tariff_id` | INT | NOT NULL, FK → tariffs(id) | 1 | Parent tariff |
| `slab_number` | INT | NOT NULL | 1 | Slab sequence |
| `min_units` | DECIMAL(10,2) | NOT NULL | 0 | Minimum kWh |
| `max_units` | DECIMAL(10,2) | NULL | 100 | Maximum kWh |
| `rate_per_unit` | DECIMAL(10,4) | NOT NULL | 8.0000 | Rate per kWh |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2024-01-01 | Created |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-01 | Updated |
| **UNIQUE** | (tariff_id, slab_number) | Composite unique | - | No duplicate slabs |

**Example Data:**

| id | tariff_id | slab_number | min_units | max_units | rate_per_unit |
|----|-----------|-------------|-----------|-----------|---------------|
| 1 | 1 | 1 | 0 | 100 | 8.00 |
| 2 | 1 | 2 | 101 | 200 | 10.00 |
| 3 | 1 | 3 | 201 | 300 | 12.00 |
| 4 | 1 | 4 | 301 | 500 | 14.00 |
| 5 | 1 | 5 | 501 | NULL | 16.00 |

**Functional Dependency:**
```
TariffID → Category, FixedCharge, ElectricityDutyPercent, GSTPercent, ...
SlabID → TariffID, SlabNumber, MinUnits, MaxUnits, RatePerUnit
(TariffID, SlabNumber) → SlabID, MinUnits, MaxUnits, RatePerUnit
```

**Achievement:**
✅ 15 columns reduced to clean parent-child relationship
✅ Can now have unlimited slabs without schema changes
✅ Easy to add/remove slabs per tariff

---

#### Step 2.5: Separate User Authentication

**USERS Table**

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | User ID |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | john@mail.com | Login email |
| `password` | VARCHAR(255) | NOT NULL | $2a$10$... | Bcrypt hash |
| `user_type` | ENUM | NOT NULL | customer | admin/employee/customer |
| `name` | VARCHAR(255) | NOT NULL | John Doe | Full name |
| `phone` | VARCHAR(20) | NULL | +1234567890 | Phone number |
| `is_active` | INT | DEFAULT 1 | 1 | Active status |
| `requires_password_change` | INT | DEFAULT 0 | 0 | Force password change |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2024-01-01 | Created |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-01 | Updated |

**Functional Dependency:**
```
UserID → Email, Password, UserType, Name, Phone, IsActive
Email → UserID, Password, UserType, Name, Phone (Email is also candidate key)
```

---

#### Step 2.6: Separate Employees

**EMPLOYEES Table**

| Column | Data Type | Constraints | Sample Data | Description |
|--------|-----------|-------------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 | Employee ID |
| `employee_number` | VARCHAR(20) | UNIQUE | EMP-001 | Employee number |
| `user_id` | INT | NOT NULL, FK → users(id), UNIQUE | 3 | User account |
| `employee_name` | VARCHAR(255) | NOT NULL | Mike Smith | Full name |
| `email` | VARCHAR(255) | NOT NULL | mike@electrolux.com | Email |
| `phone` | VARCHAR(20) | NOT NULL | +1234567891 | Phone |
| `designation` | VARCHAR(100) | NOT NULL | Meter Reader | Job title |
| `department` | VARCHAR(100) | NOT NULL | Operations | Department |
| `assigned_zone` | VARCHAR(100) | NULL | Zone A | Service area |
| `status` | ENUM | DEFAULT 'active' | active | Employment status |
| `hire_date` | DATE | NOT NULL | 2023-06-01 | Joining date |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 2023-06-01 | Created |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | 2024-01-01 | Updated |

**Functional Dependency:**
```
EmployeeID → EmployeeNumber, UserID, EmployeeName, Email, Designation, ...
EmployeeNumber → EmployeeID, UserID, ... (candidate key)
UserID → EmployeeID, ... (candidate key due to UNIQUE constraint)
```

---

#### Step 2.7: Other Supporting Tables (1NF Compliant)

**COMPLAINTS Table**

| Column | Data Type | Description |
|--------|-----------|-------------|
| `id` | INT PK AUTO_INCREMENT | Complaint ID |
| `customer_id` | INT FK → customers(id) | Customer reference |
| `employee_id` | INT FK → employees(id) | Assigned employee |
| `work_order_id` | INT FK → work_orders(id) | Related work order |
| `category` | ENUM | power_outage/billing/service/meter_issue/connection/other |
| `title` | VARCHAR(255) | Brief description |
| `description` | TEXT | Detailed description |
| `status` | ENUM | submitted/under_review/assigned/in_progress/resolved/closed |
| `priority` | ENUM | low/medium/high/urgent |
| `resolution_notes` | TEXT | Resolution details |
| `submitted_at` | TIMESTAMP | Submission time |
| `resolved_at` | TIMESTAMP | Resolution time |
| `created_at` | TIMESTAMP | Record created |
| `updated_at` | TIMESTAMP | Record updated |

**CONNECTION_REQUESTS Table**

| Column | Data Type | Description |
|--------|-----------|-------------|
| `id` | INT PK AUTO_INCREMENT | Request ID |
| `application_number` | VARCHAR(50) UNIQUE | Unique application number |
| `applicant_name` | VARCHAR(255) | Applicant full name |
| `email` | VARCHAR(255) | Contact email |
| `phone` | VARCHAR(20) | Contact phone |
| `id_type` | ENUM | passport/drivers_license/national_id/voter_id/aadhaar |
| `id_number` | VARCHAR(100) | ID document number |
| `property_type` | ENUM | Residential/Commercial/Industrial/Agricultural |
| `connection_type` | ENUM | single-phase/three-phase/industrial |
| `load_required` | DECIMAL(10,2) | kW load requested |
| `property_address` | VARCHAR(500) | Installation address |
| `city` | VARCHAR(100) | City |
| `zone` | VARCHAR(50) | Assigned zone |
| `status` | ENUM | pending/under_review/approved/rejected/connected |
| `estimated_charges` | DECIMAL(10,2) | Installation cost |
| `application_date` | DATE | Application date |
| `approval_date` | DATE | Approval date |
| `account_number` | VARCHAR(50) | Generated account (after approval) |
| `temporary_password` | VARCHAR(255) | Initial password |
| `created_at` | TIMESTAMP | Created |
| `updated_at` | TIMESTAMP | Updated |

**OUTAGES Table**

| Column | Data Type | Description |
|--------|-----------|-------------|
| `id` | INT PK AUTO_INCREMENT | Outage ID |
| `area_name` | VARCHAR(255) | Affected area |
| `zone` | VARCHAR(50) | Affected zone |
| `outage_type` | ENUM | planned/unplanned |
| `reason` | TEXT | Outage reason |
| `severity` | ENUM | low/medium/high/critical |
| `scheduled_start_time` | DATETIME | Planned start |
| `scheduled_end_time` | DATETIME | Planned end |
| `actual_start_time` | DATETIME | Actual start |
| `actual_end_time` | DATETIME | Actual end |
| `affected_customer_count` | INT | Number of customers affected |
| `status` | ENUM | scheduled/ongoing/restored/cancelled |
| `created_by` | INT FK → users(id) | Admin who created |
| `created_at` | TIMESTAMP | Created |
| `updated_at` | TIMESTAMP | Updated |

### Summary of 1NF Transformations

| Before (UNF) | After (1NF) | Achievement |
|--------------|-------------|-------------|
| 1 giant table | 11 separate tables | ✅ Atomic values |
| Repeating bill data | Bills table | ✅ No repeating groups |
| Repeating payment data | Payments table | ✅ One row = one payment |
| Repeating reading data | Meter_readings table | ✅ Historical data preserved |
| 15 tariff slab columns | Tariffs + Tariff_slabs | ✅ Flexible slab structure |
| Mixed user data | Users + Customers + Employees | ✅ Clear separation |

### Functional Dependencies in 1NF

```
USERS:          UserID → Email, Password, UserType, Name, ...
CUSTOMERS:      CustomerID → UserID, AccountNumber, FullName, Address, ...
EMPLOYEES:      EmployeeID → UserID, EmployeeNumber, Designation, ...
BILLS:          BillID → CustomerID, BillNumber, TotalAmount, Status, ...
PAYMENTS:       PaymentID → CustomerID, BillID, PaymentAmount, ...
METER_READINGS: ReadingID → CustomerID, CurrentReading, UnitsConsumed, ...
TARIFFS:        TariffID → Category, FixedCharge, ElectricityDuty, ...
TARIFF_SLABS:   SlabID → TariffID, SlabNumber, MinUnits, RatePerUnit
                (TariffID, SlabNumber) → SlabID, MinUnits, RatePerUnit
COMPLAINTS:     ComplaintID → CustomerID, Category, Status, ...
CONNECTION_REQUESTS: RequestID → ApplicationNumber, ApplicantName, ...
OUTAGES:        OutageID → AreaName, Zone, OutageType, Status, ...
```

**Achievement:** ✅ **All tables now in 1NF** - Ready for 2NF analysis

---

## 3. Second Normal Form (2NF)

### Definition & Rules
A relation is in **2NF** if:
1. ✅ It is in 1NF
2. ✅ All non-key attributes are **fully functionally dependent** on the **entire primary key**
3. ✅ No **partial dependencies** exist

**Note:** Partial dependencies can only occur with **composite (multi-column) primary keys**

### Analysis for 2NF

#### Key Observation
All our tables use **single-column surrogate keys** (AUTO_INCREMENT):
- USERS: `id` (single column PK)
- CUSTOMERS: `id` (single column PK)
- BILLS: `id` (single column PK)
- PAYMENTS: `id` (single column PK)
- TARIFFS: `id` (single column PK)
- TARIFF_SLABS: `id` (single column PK)

**Result:** **No partial dependencies possible!**

With a single-column PK, all attributes depend on the entire key (because there's only one column).

#### Example: What We Avoided

**Bad Design (Violates 2NF):**

**BILLS_BAD (Composite Key: CustomerID, BillingMonth)**

| Column | Depends On | Type |
|--------|-----------|------|
| `customer_id` | *Part of PK* | - |
| `billing_month` | *Part of PK* | - |
| `bill_number` | (customer_id, billing_month) | ✅ Full dependency |
| `units_consumed` | (customer_id, billing_month) | ✅ Full dependency |
| `total_amount` | (customer_id, billing_month) | ✅ Full dependency |
| `customer_name` | **customer_id only** | ❌ **Partial dependency!** |
| `customer_address` | **customer_id only** | ❌ **Partial dependency!** |
| `customer_zone` | **customer_id only** | ❌ **Partial dependency!** |

**Functional Dependencies:**
```
(CustomerID, BillingMonth) → BillNumber, UnitsConsumed, TotalAmount  ✅
CustomerID → CustomerName, CustomerAddress, CustomerZone  ❌ Partial!
```

**Solution (Our Design - 2NF Compliant):**

**CUSTOMERS Table:**
```
CustomerID → CustomerName, CustomerAddress, CustomerZone
```

**BILLS Table:**
```
BillID → CustomerID, BillingMonth, BillNumber, UnitsConsumed, TotalAmount
```

Now `CustomerID` is just a **foreign key**, not part of the primary key, so no partial dependency!

### 2NF Verification for All Tables

#### TARIFF_SLABS (Special Case)

This is the only table that *could* have had a composite key issue:

**Alternative Design (Composite PK):**
```sql
PRIMARY KEY (tariff_id, slab_number)
```

**Functional Dependencies:**
```
(TariffID, SlabNumber) → MinUnits, MaxUnits, RatePerUnit  ✅ Full dependency
TariffID → FixedCharge, Category  ✗ (But these are in TARIFFS table!)
```

**Our Design (Surrogate Key):**
```sql
PRIMARY KEY (id)
UNIQUE KEY (tariff_id, slab_number)
```

**Functional Dependencies:**
```
SlabID → TariffID, SlabNumber, MinUnits, MaxUnits, RatePerUnit  ✅
(TariffID, SlabNumber) → SlabID  ✅ (Alternative candidate key)
```

**Result:** ✅ No partial dependencies - 2NF compliant!

### Summary of 2NF Compliance

| Table | Primary Key | Type | 2NF Status | Reason |
|-------|-------------|------|-----------|--------|
| users | id | Single | ✅ Compliant | No composite key |
| customers | id | Single | ✅ Compliant | No composite key |
| employees | id | Single | ✅ Compliant | No composite key |
| bills | id | Single | ✅ Compliant | No composite key |
| payments | id | Single | ✅ Compliant | No composite key |
| meter_readings | id | Single | ✅ Compliant | No composite key |
| tariffs | id | Single | ✅ Compliant | No composite key |
| tariff_slabs | id | Single | ✅ Compliant | Surrogate key prevents partial dependency |
| complaints | id | Single | ✅ Compliant | No composite key |
| work_orders | id | Single | ✅ Compliant | No composite key |
| connection_requests | id | Single | ✅ Compliant | No composite key |
| outages | id | Single | ✅ Compliant | No composite key |
| notifications | id | Single | ✅ Compliant | No composite key |
| bill_requests | id | Single | ✅ Compliant | No composite key |
| reading_requests | id | Single | ✅ Compliant | No composite key |
| password_reset_requests | id | Single | ✅ Compliant | No composite key |

### Functional Dependencies in 2NF

All functional dependencies remain the same as 1NF because we already had proper single-column primary keys:

```
USERS:          UserID → {all user attributes}
CUSTOMERS:      CustomerID → {all customer attributes, including UserID FK}
BILLS:          BillID → {all bill attributes, including CustomerID FK}
PAYMENTS:       PaymentID → {all payment attributes, including CustomerID, BillID FKs}
TARIFFS:        TariffID → {all tariff attributes}
TARIFF_SLABS:   SlabID → {TariffID FK, SlabNumber, MinUnits, MaxUnits, RatePerUnit}
```

**Achievement:** ✅ **All tables in 2NF** - Ready for 3NF analysis

---

## 4. Third Normal Form (3NF)

### Definition & Rules
A relation is in **3NF** if:
1. ✅ It is in 2NF
2. ✅ No **transitive dependencies** exist
3. ✅ All non-key attributes depend **directly** on the primary key, not on other non-key attributes

**Transitive Dependency:** `A → B → C` where:
- A = Primary Key
- B = Non-key attribute
- C = Another non-key attribute dependent on B

### Identifying Transitive Dependencies

#### Problem Example (NOT IN 3NF)

**CUSTOMERS_BAD Table:**

| Column | Depends On | Issue |
|--------|-----------|-------|
| `id` (PK) | - | Primary Key |
| `user_id` (FK) | id | ✅ Direct |
| `account_number` | id | ✅ Direct |
| `full_name` | id | ✅ Direct |
| `email` | id | ✅ Direct (Business copy) |
| `phone` | id | ✅ Direct (Business copy) |
| `user_email` | **user_id** | ❌ **Transitive!** |
| `user_phone` | **user_id** | ❌ **Transitive!** |
| `user_name` | **user_id** | ❌ **Transitive!** |

**Transitive Dependency:**
```
CustomerID → UserID → UserEmail, UserPhone, UserName
```

**Solution:** Separate USERS table (already done!)

---

### Analysis of CUSTOMERS Table (3NF)

**Current Design:**

**CUSTOMERS**

| Column | Type | Depends On | Transitive? |
|--------|------|-----------|------------|
| `id` | PK | - | - |
| `user_id` | FK UNIQUE | id | ✅ Direct |
| `account_number` | UNIQUE | id | ✅ Direct |
| `full_name` | VARCHAR | id | ✅ Direct |
| `email` | VARCHAR | id | ✅ Direct (intentional duplicate for business) |
| `phone` | VARCHAR | id | ✅ Direct (intentional duplicate for business) |
| `address` | VARCHAR | id | ✅ Direct |
| `city` | VARCHAR | id | ✅ Direct |
| `zone` | VARCHAR | id | ✅ Direct |
| `connection_type` | ENUM | id | ✅ Direct |
| `outstanding_balance` | DECIMAL | id | ⚠️ **Strategic denormalization** |

**Question:** Is `email` and `phone` transitive through `user_id`?

**Answer:** No! Business decision:
- Customer `email/phone` = Primary contact for billing/service
- User `email` = Login credential
- They can differ (e.g., customer uses office email for login, personal for bills)
- This is **intentional controlled redundancy** for business logic

**USERS**

| Column | Type | Depends On |
|--------|------|-----------|
| `id` | PK | - |
| `email` | VARCHAR UNIQUE | id |
| `password` | VARCHAR | id |
| `user_type` | ENUM | id |
| `name` | VARCHAR | id |
| `phone` | VARCHAR | id |

**Functional Dependencies:**
```
CustomerID → UserID, AccountNumber, FullName, Email, Phone, Address, Zone, ...
UserID → UserEmail, UserPassword, UserType, UserName, UserPhone
```

**No Transitive Dependency** because:
- Customer email/phone are **business attributes** (not derived from user table)
- They serve different purposes
- Both are necessary for operations

---

### Analysis of BILLS Table (3NF)

**BILLS**

| Column | Type | Depends On | Transitive? |
|--------|------|-----------|------------|
| `id` | PK | - | - |
| `customer_id` | FK | id | ✅ Direct FK |
| `bill_number` | UNIQUE | id | ✅ Direct |
| `billing_month` | DATE | id | ✅ Direct |
| `units_consumed` | DECIMAL | id | ✅ Direct |
| `base_amount` | DECIMAL | id | ✅ Direct |
| `fixed_charges` | DECIMAL | id | ✅ Direct |
| `total_amount` | DECIMAL | id | ✅ Direct |
| `meter_reading_id` | FK | id | ✅ Direct FK |
| `tariff_id` | FK | id | ✅ Direct FK |

**Potential Issue:**
```
BillID → CustomerID → CustomerName, CustomerAddress
```

**Solution:** We DON'T store customer name/address in BILLS table!
- Only `customer_id` foreign key
- Join CUSTOMERS table when needed
- ✅ No transitive dependency

**Correct Design:**
```
BillID → CustomerID (FK only - join to get customer details)
```

---

### Analysis of EMPLOYEES Table (3NF)

**EMPLOYEES**

| Column | Depends On | Transitive? |
|--------|-----------|------------|
| `id` (PK) | - | - |
| `employee_number` | id | ✅ Direct |
| `user_id` (FK UNIQUE) | id | ✅ Direct |
| `employee_name` | id | ✅ Direct (business copy) |
| `email` | id | ✅ Direct (business copy) |
| `phone` | id | ✅ Direct (business copy) |
| `designation` | id | ✅ Direct |
| `department` | id | ✅ Direct |
| `assigned_zone` | id | ✅ Direct |
| `hire_date` | id | ✅ Direct |

**Same logic as CUSTOMERS:**
- Employee email/phone = Official work contact
- User email = Login credential
- Intentional controlled redundancy

**Functional Dependencies:**
```
EmployeeID → EmployeeNumber, UserID, Designation, Department, ...
UserID → UserEmail, UserPassword, UserType
```

**No transitive dependency** - Both email/phone sets serve different purposes.

---

### Analysis of TARIFF_SLABS Table (3NF)

**TARIFF_SLABS**

| Column | Depends On | Transitive? |
|--------|-----------|------------|
| `id` (PK) | - | - |
| `tariff_id` (FK) | id | ✅ Direct |
| `slab_number` | id | ✅ Direct |
| `min_units` | id | ✅ Direct |
| `max_units` | id | ✅ Direct |
| `rate_per_unit` | id | ✅ Direct |

**Potential Transitive:**
```
SlabID → TariffID → TariffCategory, FixedCharge
```

**Solution:** We DON'T store tariff category/fixed charge in TARIFF_SLABS!
- Only `tariff_id` foreign key
- Join TARIFFS table when needed
- ✅ No transitive dependency

---

### Analysis of COMPLAINTS Table (3NF)

**COMPLAINTS**

| Column | Depends On | Transitive? |
|--------|-----------|------------|
| `id` (PK) | - | - |
| `customer_id` (FK) | id | ✅ Direct |
| `employee_id` (FK) | id | ✅ Direct |
| `work_order_id` (FK) | id | ✅ Direct |
| `category` | id | ✅ Direct |
| `title` | id | ✅ Direct |
| `description` | id | ✅ Direct |
| `status` | id | ✅ Direct |
| `priority` | id | ✅ Direct |

**Potential Transitive:**
```
ComplaintID → WorkOrderID → WorkOrderDetails
```

**Solution:** Work order details stored in separate WORK_ORDERS table!

**WORK_ORDERS**

| Column | Description |
|--------|-------------|
| `id` | PK |
| `complaint_id` | FK → complaints(id) |
| `employee_id` | FK → employees(id) |
| `title` | Work order title |
| `description` | Task description |
| `priority` | Task priority |
| `status` | pending/assigned/in_progress/completed/cancelled |
| `scheduled_date` | Scheduled date |
| `completion_date` | Actual completion date |

**Functional Dependencies:**
```
ComplaintID → CustomerID, EmployeeID, WorkOrderID (FKs only)
WorkOrderID → ComplaintID, Title, Description, Status (in separate table)
```

✅ No transitive dependency - work order details properly separated

---

### Strategic Denormalization (Intentional 3NF Violations)

#### CUSTOMERS.outstanding_balance

**Normalized Design (Strict 3NF):**
```sql
-- Calculate outstanding balance on-the-fly
SELECT SUM(total_amount)
FROM bills
WHERE customer_id = ? AND status != 'paid'
```

**Our Design (Denormalized for Performance):**
```sql
-- Stored as a column
outstanding_balance DECIMAL(10,2) DEFAULT 0.00
```

**Why?**
- Dashboard loads 1000+ customers → 1000+ queries too slow
- Frequently accessed value
- Calculated and cached via triggers or application logic
- **Trade-off:** Performance > Strict normalization

**Justification:**
- ✅ Query performance: O(1) vs O(n)
- ✅ Dashboard loads instantly
- ✅ Maintained via triggers/app logic
- ❌ Slight redundancy (acceptable trade-off)

#### CUSTOMERS.last_bill_amount, last_payment_date

Same reasoning - frequently displayed data, cached for performance.

---

### Summary of 3NF Compliance

| Table | Transitive Dependencies? | 3NF Status | Notes |
|-------|-------------------------|-----------|-------|
| users | None | ✅ Compliant | All attributes directly depend on UserID |
| customers | None | ✅ Compliant | Email/phone are business copies, not transitive |
| employees | None | ✅ Compliant | Email/phone are business copies, not transitive |
| bills | None | ✅ Compliant | Only FKs stored, no customer details duplicated |
| payments | None | ✅ Compliant | Only FKs stored |
| meter_readings | None | ✅ Compliant | Only FKs stored |
| tariffs | None | ✅ Compliant | All attributes directly depend on TariffID |
| tariff_slabs | None | ✅ Compliant | Only TariffID FK, no tariff details duplicated |
| complaints | None | ✅ Compliant | Only FKs stored |
| work_orders | None | ✅ Compliant | Separate entity, not transitive |
| connection_requests | None | ✅ Compliant | Independent entity |
| outages | None | ✅ Compliant | All attributes direct |

### Functional Dependencies in 3NF

```
USERS:
UserID → Email, Password, UserType, Name, Phone

CUSTOMERS:
CustomerID → UserID (FK), AccountNumber, FullName, Email, Phone, Address,
             City, Zone, ConnectionType, OutstandingBalance
UserID (FK) → References USERS (join for user account details)

EMPLOYEES:
EmployeeID → EmployeeNumber, UserID (FK), Designation, Department, AssignedZone
UserID (FK) → References USERS

BILLS:
BillID → CustomerID (FK), MeterReadingID (FK), TariffID (FK), BillNumber,
         TotalAmount, Status
CustomerID (FK) → References CUSTOMERS
MeterReadingID (FK) → References METER_READINGS
TariffID (FK) → References TARIFFS

PAYMENTS:
PaymentID → CustomerID (FK), BillID (FK), PaymentAmount, TransactionID, Status
CustomerID (FK) → References CUSTOMERS
BillID (FK) → References BILLS

TARIFFS:
TariffID → Category, FixedCharge, ElectricityDutyPercent, GSTPercent

TARIFF_SLABS:
SlabID → TariffID (FK), SlabNumber, MinUnits, MaxUnits, RatePerUnit
TariffID (FK) → References TARIFFS

COMPLAINTS:
ComplaintID → CustomerID (FK), EmployeeID (FK), WorkOrderID (FK), Status
CustomerID (FK) → References CUSTOMERS
EmployeeID (FK) → References EMPLOYEES
WorkOrderID (FK) → References WORK_ORDERS

WORK_ORDERS:
WorkOrderID → ComplaintID (FK), EmployeeID (FK), Title, Description, Status
ComplaintID (FK) → References COMPLAINTS
```

**Achievement:** ✅ **All tables in 3NF** - Ready for BCNF analysis

---

## 5. Boyce-Codd Normal Form (BCNF)

### Definition & Rules
A relation is in **BCNF** if:
1. ✅ It is in 3NF
2. ✅ For **every functional dependency X → Y**, X must be a **superkey**
3. ✅ Eliminates ALL anomalies where a non-superkey determines another attribute

**BCNF vs 3NF:**
- **3NF:** Allows some transitive dependencies if determinant is a candidate key
- **BCNF:** **Stricter** - ALL determinants must be superkeys (no exceptions)

**Superkey:** A set of attributes that uniquely identifies a row (can have extra attributes)
**Candidate Key:** Minimal superkey (no redundant attributes)

---

### BCNF Analysis Methodology

For each table:
1. List all functional dependencies
2. Identify all candidate keys
3. Check if every determinant (left side of →) is a superkey
4. If YES → BCNF compliant ✅
5. If NO → Violates BCNF ❌ (decompose table)

---

### Table 1: USERS

**Schema:**
```sql
users (
  id INT PK AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  user_type ENUM,
  name VARCHAR(255),
  phone VARCHAR(20)
)
```

**Functional Dependencies:**
```
id → email, password, user_type, name, phone
email → id, password, user_type, name, phone
```

**Candidate Keys:** `{id}`, `{email}`

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |
| email → all | email | ✅ YES (UNIQUE) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 2: CUSTOMERS

**Schema:**
```sql
customers (
  id INT PK,
  user_id INT UNIQUE FK,
  account_number VARCHAR(50) UNIQUE,
  meter_number VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  ...
)
```

**Functional Dependencies:**
```
id → user_id, account_number, meter_number, full_name, email, ...
user_id → id, account_number, meter_number, ...
account_number → id, user_id, meter_number, ...
meter_number → id, user_id, account_number, ...
```

**Candidate Keys:** `{id}`, `{user_id}`, `{account_number}`, `{meter_number}`

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |
| user_id → all | user_id | ✅ YES (UNIQUE) | ✅ |
| account_number → all | account_number | ✅ YES (UNIQUE) | ✅ |
| meter_number → all | meter_number | ✅ YES (UNIQUE) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 3: EMPLOYEES

**Schema:**
```sql
employees (
  id INT PK,
  employee_number VARCHAR(20) UNIQUE,
  user_id INT UNIQUE FK,
  employee_name VARCHAR(255),
  email VARCHAR(255),
  ...
)
```

**Functional Dependencies:**
```
id → employee_number, user_id, employee_name, email, ...
employee_number → id, user_id, employee_name, ...
user_id → id, employee_number, employee_name, ...
```

**Candidate Keys:** `{id}`, `{employee_number}`, `{user_id}`

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |
| employee_number → all | employee_number | ✅ YES (UNIQUE) | ✅ |
| user_id → all | user_id | ✅ YES (UNIQUE FK) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 4: BILLS

**Schema:**
```sql
bills (
  id INT PK,
  bill_number VARCHAR(50) UNIQUE,
  customer_id INT FK,
  billing_month DATE,
  units_consumed DECIMAL,
  total_amount DECIMAL,
  ...
)
```

**Functional Dependencies:**
```
id → bill_number, customer_id, billing_month, units_consumed, total_amount, ...
bill_number → id, customer_id, billing_month, ...
```

**Candidate Keys:** `{id}`, `{bill_number}`

**Potential Composite Dependency (NOT a determinant in our design):**
```
(customer_id, billing_month) → ???
```

**Is this a determinant?** NO!
- A customer can have multiple bills in same month (corrections, adjustments)
- We use `id` and `bill_number` as definitive unique identifiers
- `(customer_id, billing_month)` is NOT a candidate key

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |
| bill_number → all | bill_number | ✅ YES (UNIQUE) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 5: PAYMENTS

**Schema:**
```sql
payments (
  id INT PK,
  transaction_id VARCHAR(100) UNIQUE,
  receipt_number VARCHAR(50) UNIQUE,
  customer_id INT FK,
  bill_id INT FK,
  payment_amount DECIMAL,
  ...
)
```

**Functional Dependencies:**
```
id → transaction_id, receipt_number, customer_id, bill_id, payment_amount, ...
transaction_id → id, receipt_number, customer_id, ...
receipt_number → id, transaction_id, customer_id, ...
```

**Candidate Keys:** `{id}`, `{transaction_id}`, `{receipt_number}`

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |
| transaction_id → all | transaction_id | ✅ YES (UNIQUE) | ✅ |
| receipt_number → all | receipt_number | ✅ YES (UNIQUE) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 6: TARIFFS

**Schema:**
```sql
tariffs (
  id INT PK,
  category ENUM('Residential', 'Commercial', 'Industrial', 'Agricultural'),
  fixed_charge DECIMAL,
  electricity_duty_percent DECIMAL,
  gst_percent DECIMAL,
  effective_date DATE,
  valid_until DATE
)
```

**Functional Dependencies:**
```
id → category, fixed_charge, electricity_duty_percent, effective_date, ...
```

**Potential Composite Dependency:**
```
(category, effective_date) → ???
```

**Is this a determinant?** NO!
- Multiple tariffs can exist for same category at different times
- Multiple tariffs can be active simultaneously (transitional periods)
- `(category, effective_date)` is NOT a candidate key

**Candidate Keys:** `{id}` only

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 7: TARIFF_SLABS (Most Complex!)

**Schema:**
```sql
tariff_slabs (
  id INT PK,
  tariff_id INT FK,
  slab_number INT,
  min_units DECIMAL,
  max_units DECIMAL,
  rate_per_unit DECIMAL,
  UNIQUE (tariff_id, slab_number)
)
```

**Functional Dependencies:**
```
id → tariff_id, slab_number, min_units, max_units, rate_per_unit
(tariff_id, slab_number) → id, min_units, max_units, rate_per_unit
```

**Candidate Keys:** `{id}`, `{tariff_id, slab_number}`

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |
| (tariff_id, slab_number) → all | (tariff_id, slab_number) | ✅ YES (UNIQUE composite) | ✅ |

**Potential Issue:**
```
tariff_id → tariff_category, fixed_charge
```

**Is this a problem?** NO!
- `tariff_category` and `fixed_charge` are **NOT in tariff_slabs table**
- They are in the **tariffs** table (parent)
- We only store `tariff_id` as a foreign key
- Join tariffs table when needed
- ✅ No BCNF violation

**Result:** ✅ **BCNF Compliant**

---

### Table 8: METER_READINGS

**Schema:**
```sql
meter_readings (
  id INT PK,
  customer_id INT FK,
  employee_id INT FK,
  meter_number VARCHAR(50),
  current_reading DECIMAL,
  reading_date DATE,
  ...
)
```

**Functional Dependencies:**
```
id → customer_id, employee_id, meter_number, current_reading, reading_date, ...
```

**Potential Composite:**
```
(customer_id, reading_date) → ???
```

**Is this a determinant?** NO!
- Customer can have multiple readings on same date (re-reads, corrections)
- `id` is the sole definitive identifier

**Candidate Keys:** `{id}` only

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 9: COMPLAINTS

**Schema:**
```sql
complaints (
  id INT PK,
  customer_id INT FK,
  employee_id INT FK,
  work_order_id INT FK,
  category ENUM,
  title VARCHAR,
  status ENUM,
  ...
)
```

**Functional Dependencies:**
```
id → customer_id, employee_id, work_order_id, category, title, status, ...
```

**Candidate Keys:** `{id}` only

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 10: CONNECTION_REQUESTS

**Schema:**
```sql
connection_requests (
  id INT PK,
  application_number VARCHAR(50) UNIQUE,
  applicant_name VARCHAR,
  email VARCHAR,
  ...
)
```

**Functional Dependencies:**
```
id → application_number, applicant_name, email, ...
application_number → id, applicant_name, email, ...
```

**Candidate Keys:** `{id}`, `{application_number}`

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |
| application_number → all | application_number | ✅ YES (UNIQUE) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### Table 11: OUTAGES

**Schema:**
```sql
outages (
  id INT PK,
  area_name VARCHAR,
  zone VARCHAR,
  outage_type ENUM,
  status ENUM,
  ...
)
```

**Functional Dependencies:**
```
id → area_name, zone, outage_type, status, ...
```

**Candidate Keys:** `{id}` only

**Analysis:**
| Dependency | Determinant | Is Superkey? | BCNF? |
|-----------|-------------|--------------|-------|
| id → all | id | ✅ YES (PK) | ✅ |

**Result:** ✅ **BCNF Compliant**

---

### All Remaining Tables (Quick Summary)

**WORK_ORDERS, NOTIFICATIONS, BILL_REQUESTS, READING_REQUESTS, PASSWORD_RESET_REQUESTS**

All follow same pattern:
- Single-column primary key `id`
- Some have additional UNIQUE columns (e.g., token in password_reset_requests)
- All functional dependencies have determinants that are superkeys
- ✅ All BCNF compliant

---

### BCNF Summary Table

| Table | Primary Key | Additional Candidate Keys | BCNF Status |
|-------|-------------|--------------------------|-------------|
| users | id | email | ✅ Compliant |
| customers | id | user_id, account_number, meter_number | ✅ Compliant |
| employees | id | employee_number, user_id | ✅ Compliant |
| bills | id | bill_number | ✅ Compliant |
| payments | id | transaction_id, receipt_number | ✅ Compliant |
| meter_readings | id | - | ✅ Compliant |
| tariffs | id | - | ✅ Compliant |
| tariff_slabs | id | (tariff_id, slab_number) | ✅ Compliant |
| complaints | id | - | ✅ Compliant |
| work_orders | id | - | ✅ Compliant |
| connection_requests | id | application_number | ✅ Compliant |
| outages | id | - | ✅ Compliant |
| notifications | id | - | ✅ Compliant |
| bill_requests | id | - | ✅ Compliant |
| reading_requests | id | - | ✅ Compliant |
| password_reset_requests | id | token | ✅ Compliant |
| **ALL 17 TABLES** | - | - | ✅ **100% BCNF Compliant** |

### Why All Tables Are in BCNF

**Design Principles Applied:**

1. ✅ **Surrogate Keys** - Auto-increment `id` as primary key
2. ✅ **Natural Keys as UNIQUE** - Email, account_number, bill_number defined as UNIQUE constraints
3. ✅ **All UNIQUE = Candidate Keys** - Every UNIQUE constraint is a valid superkey
4. ✅ **Foreign Keys Only** - Parent table details not duplicated in child tables
5. ✅ **Proper Decomposition** - Separated entities properly (users, customers, employees)

**Result:**
- No update anomalies
- No insertion anomalies
- No deletion anomalies
- Optimal data integrity
- Production-ready schema

---

## 6. Final Normalized Schema

### Complete Database Structure (BCNF Compliant)

**Total Tables:** 17
**Total Foreign Keys:** 25
**Normalization Level:** BCNF (Highest)

---

### Category 1: Authentication & User Management

#### 1. USERS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | User ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| user_type | ENUM | NOT NULL | admin/employee/customer |
| name | VARCHAR(255) | NOT NULL | Full name |
| phone | VARCHAR(20) | NULL | Phone |
| is_active | INT | DEFAULT 1 | Active status |
| requires_password_change | INT | DEFAULT 0 | Password change flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`, `email`
**Foreign Keys:** None (root table)

#### 2. PASSWORD_RESET_REQUESTS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Request ID |
| user_id | INT | FK → users(id), CASCADE | User reference |
| token | VARCHAR(255) | UNIQUE | Reset token |
| expires_at | TIMESTAMP | NOT NULL | Token expiry |
| is_used | TINYINT | DEFAULT 0 | Used flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |

**Candidate Keys:** `id`, `token`
**Foreign Keys:** `user_id` → `users(id)` ON DELETE CASCADE

---

### Category 2: Customer Management

#### 3. CUSTOMERS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Customer ID |
| user_id | INT | FK → users(id), UNIQUE, CASCADE | User account |
| account_number | VARCHAR(50) | UNIQUE | ELX-YYYY-XXXXXX |
| meter_number | VARCHAR(50) | UNIQUE | MTR-XXX-XXXXXX |
| full_name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | NOT NULL | Contact email |
| phone | VARCHAR(20) | NOT NULL | Phone |
| address | VARCHAR(500) | NOT NULL | Address |
| city | VARCHAR(100) | NOT NULL | City |
| state | VARCHAR(100) | NOT NULL | State |
| pincode | VARCHAR(10) | NOT NULL | Postal code |
| zone | VARCHAR(50) | NULL | Zone A-E |
| connection_type | ENUM | NOT NULL | Residential/Commercial/Industrial/Agricultural |
| status | ENUM | DEFAULT 'active' | active/suspended/inactive |
| connection_date | DATE | NOT NULL | Activation date |
| date_of_birth | DATE | NULL | DOB |
| installation_charges | DECIMAL(10,2) | NULL | Installation fee |
| last_bill_amount | DECIMAL(10,2) | DEFAULT 0.00 | Last bill (cached) |
| last_payment_date | DATE | NULL | Last payment (cached) |
| average_monthly_usage | DECIMAL(10,2) | DEFAULT 0.00 | Avg kWh (cached) |
| outstanding_balance | DECIMAL(10,2) | DEFAULT 0.00 | **Denormalized** |
| payment_status | ENUM | DEFAULT 'paid' | paid/pending/overdue |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`, `user_id`, `account_number`, `meter_number`
**Foreign Keys:** `user_id` → `users(id)` ON DELETE CASCADE

---

### Category 3: Employee Management

#### 4. EMPLOYEES

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Employee ID |
| employee_number | VARCHAR(20) | UNIQUE | EMP-XXX |
| user_id | INT | FK → users(id), UNIQUE, CASCADE | User account |
| employee_name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | NOT NULL | Work email |
| phone | VARCHAR(20) | NOT NULL | Phone |
| designation | VARCHAR(100) | NOT NULL | Job title |
| department | VARCHAR(100) | NOT NULL | Department |
| assigned_zone | VARCHAR(100) | NULL | Service area |
| status | ENUM | DEFAULT 'active' | active/inactive |
| hire_date | DATE | NOT NULL | Hire date |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`, `employee_number`, `user_id`
**Foreign Keys:** `user_id` → `users(id)` ON DELETE CASCADE

---

### Category 4: Billing & Tariffs

#### 5. TARIFFS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Tariff ID |
| category | ENUM | NOT NULL | Residential/Commercial/Industrial/Agricultural |
| fixed_charge | DECIMAL(10,2) | NOT NULL | Monthly fixed fee |
| time_of_use_peak_rate | DECIMAL(10,2) | NULL | Peak rate (optional) |
| time_of_use_normal_rate | DECIMAL(10,2) | NULL | Normal rate (optional) |
| time_of_use_offpeak_rate | DECIMAL(10,2) | NULL | Off-peak rate (optional) |
| electricity_duty_percent | DECIMAL(5,2) | DEFAULT 0.00 | Duty % |
| gst_percent | DECIMAL(5,2) | DEFAULT 18.00 | GST % |
| effective_date | DATE | NOT NULL | Start date |
| valid_until | DATE | NULL | End date |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`
**Foreign Keys:** None

#### 6. TARIFF_SLABS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Slab ID |
| tariff_id | INT | FK → tariffs(id), CASCADE | Parent tariff |
| slab_number | INT | NOT NULL | Slab sequence (1, 2, 3...) |
| min_units | DECIMAL(10,2) | NOT NULL | Min kWh |
| max_units | DECIMAL(10,2) | NULL | Max kWh (NULL = unlimited) |
| rate_per_unit | DECIMAL(10,4) | NOT NULL | Rate per kWh |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |
| **UNIQUE** | (tariff_id, slab_number) | Composite unique | No duplicate slabs |

**Candidate Keys:** `id`, `(tariff_id, slab_number)`
**Foreign Keys:** `tariff_id` → `tariffs(id)` ON DELETE CASCADE

#### 7. METER_READINGS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Reading ID |
| customer_id | INT | FK → customers(id), CASCADE | Customer |
| meter_number | VARCHAR(50) | NOT NULL | Meter serial |
| current_reading | DECIMAL(10,2) | NOT NULL | Current kWh |
| previous_reading | DECIMAL(10,2) | NOT NULL | Previous kWh |
| units_consumed | DECIMAL(10,2) | NOT NULL | Difference |
| reading_date | DATE | NOT NULL | Reading date |
| reading_time | TIMESTAMP | NOT NULL | Reading time |
| meter_condition | ENUM | DEFAULT 'good' | good/fair/poor/damaged |
| accessibility | ENUM | DEFAULT 'accessible' | accessible/partially_accessible/inaccessible |
| employee_id | INT | FK → employees(id) | Reader employee |
| photo_path | VARCHAR(500) | NULL | Photo path |
| notes | TEXT | NULL | Notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`
**Foreign Keys:**
- `customer_id` → `customers(id)` ON DELETE CASCADE
- `employee_id` → `employees(id)`

#### 8. BILLS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Bill ID |
| customer_id | INT | FK → customers(id), CASCADE | Customer |
| bill_number | VARCHAR(50) | UNIQUE | BILL-YYYY-XXXXXX |
| billing_month | DATE | NOT NULL | YYYY-MM-01 |
| issue_date | DATE | NOT NULL | Issue date |
| due_date | DATE | NOT NULL | Due date |
| units_consumed | DECIMAL(10,2) | NOT NULL | kWh consumed |
| meter_reading_id | INT | FK → meter_readings(id) | Related reading |
| base_amount | DECIMAL(10,2) | NOT NULL | Units × rate |
| fixed_charges | DECIMAL(10,2) | NOT NULL | Fixed fee |
| electricity_duty | DECIMAL(10,2) | DEFAULT 0.00 | Duty |
| gst_amount | DECIMAL(10,2) | DEFAULT 0.00 | GST |
| total_amount | DECIMAL(10,2) | NOT NULL | Total |
| status | ENUM | DEFAULT 'generated' | generated/issued/paid/overdue/cancelled |
| payment_date | DATE | NULL | Date paid |
| tariff_id | INT | FK → tariffs(id) | Tariff used |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`, `bill_number`
**Foreign Keys:**
- `customer_id` → `customers(id)` ON DELETE CASCADE
- `meter_reading_id` → `meter_readings(id)`
- `tariff_id` → `tariffs(id)`

#### 9. PAYMENTS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Payment ID |
| customer_id | INT | FK → customers(id), CASCADE | Customer |
| bill_id | INT | FK → bills(id) | Related bill |
| payment_amount | DECIMAL(10,2) | NOT NULL | Amount paid |
| payment_method | ENUM | NOT NULL | credit_card/debit_card/upi/cash/cheque/wallet |
| payment_date | DATE | NOT NULL | Payment date |
| transaction_id | VARCHAR(100) | UNIQUE | Transaction ref |
| receipt_number | VARCHAR(50) | UNIQUE | Receipt number |
| status | ENUM | DEFAULT 'completed' | pending/completed/failed/refunded |
| notes | TEXT | NULL | Notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`, `transaction_id`, `receipt_number`
**Foreign Keys:**
- `customer_id` → `customers(id)` ON DELETE CASCADE
- `bill_id` → `bills(id)`

---

### Category 5: Service Management

#### 10. COMPLAINTS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Complaint ID |
| customer_id | INT | FK → customers(id), CASCADE | Customer |
| employee_id | INT | FK → employees(id) | Assigned to |
| work_order_id | INT | FK → work_orders(id) | Related work order |
| category | ENUM | NOT NULL | power_outage/billing/service/meter_issue/connection/other |
| title | VARCHAR(255) | NOT NULL | Title |
| description | TEXT | NOT NULL | Description |
| status | ENUM | DEFAULT 'submitted' | submitted/under_review/assigned/in_progress/resolved/closed |
| priority | ENUM | DEFAULT 'medium' | low/medium/high/urgent |
| resolution_notes | TEXT | NULL | Resolution |
| submitted_at | TIMESTAMP | DEFAULT NOW() | Submitted |
| reviewed_at | TIMESTAMP | NULL | Reviewed |
| assigned_at | TIMESTAMP | NULL | Assigned |
| resolved_at | TIMESTAMP | NULL | Resolved |
| closed_at | TIMESTAMP | NULL | Closed |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`
**Foreign Keys:**
- `customer_id` → `customers(id)` ON DELETE CASCADE
- `employee_id` → `employees(id)`

#### 11. WORK_ORDERS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Work Order ID |
| complaint_id | INT | FK → complaints(id) | Related complaint |
| employee_id | INT | FK → employees(id) | Assigned to |
| title | VARCHAR(255) | NOT NULL | Title |
| description | TEXT | NOT NULL | Description |
| priority | ENUM | DEFAULT 'medium' | low/medium/high/urgent |
| status | ENUM | DEFAULT 'pending' | pending/assigned/in_progress/completed/cancelled |
| scheduled_date | DATE | NULL | Scheduled |
| completion_date | DATE | NULL | Completed |
| notes | TEXT | NULL | Notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`
**Foreign Keys:**
- `complaint_id` → `complaints(id)`
- `employee_id` → `employees(id)`

---

### Category 6: Infrastructure

#### 12. OUTAGES

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Outage ID |
| area_name | VARCHAR(255) | NOT NULL | Affected area |
| zone | VARCHAR(50) | NOT NULL | Zone A-E |
| outage_type | ENUM | NOT NULL | planned/unplanned |
| reason | TEXT | NULL | Reason |
| severity | ENUM | NOT NULL | low/medium/high/critical |
| scheduled_start_time | DATETIME | NULL | Scheduled start |
| scheduled_end_time | DATETIME | NULL | Scheduled end |
| actual_start_time | DATETIME | NULL | Actual start |
| actual_end_time | DATETIME | NULL | Actual end |
| affected_customer_count | INT | DEFAULT 0 | Customers affected |
| status | ENUM | NOT NULL | scheduled/ongoing/restored/cancelled |
| restoration_notes | TEXT | NULL | Restoration notes |
| created_by | INT | FK → users(id) | Created by |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`
**Foreign Keys:** `created_by` → `users(id)`

#### 13. NOTIFICATIONS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Notification ID |
| user_id | INT | FK → users(id), CASCADE | User |
| notification_type | ENUM | NOT NULL | bill_generated/payment_received/outage_alert/complaint_update/connection_approved/general |
| title | VARCHAR(255) | NOT NULL | Title |
| message | TEXT | NOT NULL | Message |
| related_entity_type | VARCHAR(50) | NULL | Entity type |
| related_entity_id | INT | NULL | Entity ID |
| is_read | TINYINT | DEFAULT 0 | Read flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |

**Candidate Keys:** `id`
**Foreign Keys:** `user_id` → `users(id)` ON DELETE CASCADE

---

### Category 7: Workflows & Requests

#### 14. CONNECTION_REQUESTS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Request ID |
| application_number | VARCHAR(50) | UNIQUE | APP-YYYYMMDD-XXXXX |
| applicant_name | VARCHAR(255) | NOT NULL | Name |
| father_name | VARCHAR(255) | NULL | Father name |
| email | VARCHAR(255) | NOT NULL | Email |
| phone | VARCHAR(20) | NOT NULL | Phone |
| alternate_phone | VARCHAR(20) | NULL | Alternate phone |
| id_type | ENUM | NOT NULL | passport/drivers_license/national_id/voter_id/aadhaar |
| id_number | VARCHAR(100) | NOT NULL | ID number |
| property_type | ENUM | NOT NULL | Residential/Commercial/Industrial/Agricultural |
| connection_type | ENUM | NOT NULL | single-phase/three-phase/industrial |
| load_required | DECIMAL(10,2) | NULL | kW load |
| property_address | VARCHAR(500) | NOT NULL | Address |
| city | VARCHAR(100) | NOT NULL | City |
| state | VARCHAR(100) | NULL | State |
| pincode | VARCHAR(10) | NULL | Postal code |
| landmark | VARCHAR(255) | NULL | Landmark |
| zone | VARCHAR(50) | NULL | Assigned zone |
| preferred_date | DATE | NULL | Preferred date |
| purpose_of_connection | ENUM | NOT NULL | domestic/business/industrial/agricultural |
| existing_connection | BOOLEAN | DEFAULT FALSE | Existing connection |
| existing_account_number | VARCHAR(50) | NULL | Existing account |
| status | ENUM | DEFAULT 'pending' | pending/under_review/approved/rejected/connected |
| estimated_charges | DECIMAL(10,2) | NULL | Estimated cost |
| inspection_date | DATE | NULL | Inspection date |
| approval_date | DATE | NULL | Approval date |
| installation_date | DATE | NULL | Installation date |
| application_date | DATE | NOT NULL | Application date |
| account_number | VARCHAR(50) | NULL | Generated account |
| temporary_password | VARCHAR(255) | NULL | Initial password |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`, `application_number`
**Foreign Keys:** None (becomes customer after approval)
**Indexes:** `status`, `email`

#### 15. BILL_REQUESTS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Request ID |
| customer_id | INT | FK → customers(id), CASCADE | Customer |
| requested_month | DATE | NOT NULL | Month requested |
| status | ENUM | DEFAULT 'pending' | pending/approved/rejected/completed |
| notes | TEXT | NULL | Notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`
**Foreign Keys:** `customer_id` → `customers(id)` ON DELETE CASCADE

#### 16. READING_REQUESTS

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Request ID |
| customer_id | INT | FK → customers(id), CASCADE | Customer |
| employee_id | INT | FK → employees(id) | Assigned to |
| requested_date | DATE | NOT NULL | Requested date |
| status | ENUM | DEFAULT 'pending' | pending/scheduled/completed/cancelled |
| priority | ENUM | DEFAULT 'normal' | normal/high/urgent |
| notes | TEXT | NULL | Notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Created |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Updated |

**Candidate Keys:** `id`
**Foreign Keys:**
- `customer_id` → `customers(id)` ON DELETE CASCADE
- `employee_id` → `employees(id)`

---

## 7. ERD Diagram Description

### Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ER DIAGRAM OVERVIEW                          │
└─────────────────────────────────────────────────────────────────────┘

                           ┌─────────────┐
                           │    USERS    │ (Central Authentication)
                           │     (PK)    │
                           └──────┬──────┘
                                  │ 1
                  ┌───────────────┼───────────────┬─────────────┐
                  │               │               │             │
                  │ 1:1           │ 1:1           │ 1:N         │ 1:N
         ┌────────▼────────┐ ┌───▼──────┐  ┌─────▼────────┐ ┌─▼──────────┐
         │   CUSTOMERS     │ │EMPLOYEES │  │PASSWORD_RESET│ │NOTIFICATIONS│
         │  (customer_id)  │ │(emp_id)  │  │  REQUESTS    │ │ (notif_id) │
         └────────┬────────┘ └────┬─────┘  └──────────────┘ └────────────┘
                  │ 1             │ 1
          ┌───────┼───────────────┼──────────────┬──────────┐
          │       │               │              │          │
          │ N     │ N             │ N            │ N        │ N
   ┌──────▼────┐ ┌▼───────────┐ ┌▼──────────┐ ┌─▼────────┐ ┌▼───────────┐
   │   BILLS   │ │METER       │ │WORK       │ │COMPLAINTS│ │BILL        │
   │ (bill_id) │ │READINGS    │ │ORDERS     │ │ (comp_id)│ │REQUESTS    │
   └─────┬─────┘ │(reading_id)│ │(order_id) │ └──────────┘ └────────────┘
         │ 1     └────────────┘ └───────────┘
         │ N
   ┌─────▼─────┐
   │  PAYMENTS │
   │ (pay_id)  │
   └───────────┘

         ┌─────────────┐
         │  TARIFFS    │ (Pricing)
         │ (tariff_id) │
         └──────┬──────┘
                │ 1
                │ N
         ┌──────▼──────┐
         │TARIFF_SLABS │
         │  (slab_id)  │
         └─────────────┘

   ┌──────────────────┐
   │CONNECTION        │ (Independent)
   │REQUESTS          │
   │ (request_id)     │
   └──────────────────┘

   ┌──────────────────┐
   │OUTAGES           │
   │ (outage_id)      │
   │ Created by USER  │
   └──────────────────┘
```

### Relationship Details

| Relationship | Type | Cardinality | Description | Foreign Key |
|--------------|------|-------------|-------------|-------------|
| Users → Customers | Identifying | 1:1 | One user = one customer | customers.user_id → users.id |
| Users → Employees | Identifying | 1:1 | One user = one employee | employees.user_id → users.id |
| Users → Notifications | Non-Identifying | 1:N | User receives many notifications | notifications.user_id → users.id |
| Users → Password Reset | Non-Identifying | 1:N | User can have multiple reset requests | password_reset_requests.user_id → users.id |
| Customers → Bills | Non-Identifying | 1:N | Customer has many bills | bills.customer_id → customers.id |
| Customers → Payments | Non-Identifying | 1:N | Customer makes many payments | payments.customer_id → customers.id |
| Customers → Meter Readings | Non-Identifying | 1:N | Customer has many readings | meter_readings.customer_id → customers.id |
| Customers → Complaints | Non-Identifying | 1:N | Customer files many complaints | complaints.customer_id → customers.id |
| Customers → Bill Requests | Non-Identifying | 1:N | Customer requests many bills | bill_requests.customer_id → customers.id |
| Customers → Reading Requests | Non-Identifying | 1:N | Customer requests readings | reading_requests.customer_id → customers.id |
| Employees → Meter Readings | Non-Identifying | 1:N | Employee records readings | meter_readings.employee_id → employees.id |
| Employees → Work Orders | Non-Identifying | 1:N | Employee handles work orders | work_orders.employee_id → employees.id |
| Employees → Complaints | Non-Identifying | 1:N | Employee assigned complaints | complaints.employee_id → employees.id |
| Bills → Payments | Non-Identifying | 1:N | Bill can have multiple payments | payments.bill_id → bills.id |
| Bills → Meter Readings | Non-Identifying | 1:1 (Optional) | Bill from one reading | bills.meter_reading_id → meter_readings.id |
| Tariffs → Tariff Slabs | Identifying | 1:N | Tariff has multiple slabs | tariff_slabs.tariff_id → tariffs.id |
| Tariffs → Bills | Non-Identifying | 1:N | Tariff used in many bills | bills.tariff_id → tariffs.id |
| Complaints → Work Orders | Non-Identifying | 1:1 (Optional) | Complaint creates work order | complaints.work_order_id → work_orders.id |
| Users → Outages | Non-Identifying | 1:N | User creates outages | outages.created_by → users.id |

### Cardinality Notation

- **1:1** (One-to-One): User ↔ Customer, User ↔ Employee
- **1:N** (One-to-Many): Customer → Bills, Tariff → Tariff Slabs
- **M:N** (Many-to-Many): **None** (all normalized to 1:N with junction tables if needed)

---

## 8. Summary & Viva Points

### Normalization Journey

| Form | Tables | Key Achievement | Anomalies Fixed |
|------|--------|----------------|----------------|
| **UNF** | 1 giant table | Starting point | ❌ All anomalies present |
| **1NF** | 11 tables | Atomic values, no repeating groups | ✅ Repeating groups eliminated |
| **2NF** | 17 tables | No partial dependencies | ✅ All attributes depend on full PK |
| **3NF** | 17 tables | No transitive dependencies | ✅ Direct dependencies only |
| **BCNF** | 17 tables | All determinants are superkeys | ✅ **All anomalies eliminated** |

### Final Statistics

**Database:** `electricity_ems`
**DBMS:** MySQL 8.4
**Normalization Level:** **BCNF** (Highest)
**Total Tables:** 17
**Total Foreign Keys:** 25
**Total Unique Constraints:** 18
**Total Enum Types:** 35+
**Total Columns:** 265+

### Key Viva Points

#### 1. **Why did we separate USERS, CUSTOMERS, and EMPLOYEES?**
**Answer:**
- **USERS** = Authentication (login, password, user_type)
- **CUSTOMERS** = Business data (account number, meter, billing address)
- **EMPLOYEES** = HR data (designation, department, hire date)
- **Reason:** One user can be either customer OR employee, not both
- Avoids NULL columns and mixed responsibilities
- ✅ 3NF compliant - no transitive dependencies through user_id

#### 2. **Why did we create TARIFF_SLABS table instead of storing slabs in TARIFFS?**
**Answer:**
- **Before (UNF):** 15 columns (Slab1Min, Slab1Max, Slab1Rate... through Slab5)
- **Problem:** Repeating groups violate 1NF
- **Solution:** Create TARIFF_SLABS table with parent-child relationship
- **Benefit:** Can have unlimited slabs without schema changes
- **Normalization:** Moved from UNF to 1NF

#### 3. **What is the difference between 3NF and BCNF?**
**Answer:**
- **3NF:** Allows transitive dependencies if determinant is a candidate key
- **BCNF:** Stricter - ALL determinants must be superkeys
- **Our Design:** All tables BCNF compliant because:
  - Single-column surrogate keys as PK
  - All UNIQUE constraints are candidate keys
  - No non-superkey determinants

#### 4. **Why is `outstanding_balance` in CUSTOMERS table? Isn't it redundant?**
**Answer:**
- **Yes, it's denormalized!** (SUM of unpaid bills)
- **Reason:** Strategic performance optimization
- **Trade-off:** Slight redundancy for massive performance gain
- **Calculation:** `SELECT SUM(total_amount) FROM bills WHERE customer_id = ? AND status != 'paid'`
- **Solution:** Updated via triggers/application logic
- **Result:** Dashboard loads 1000+ customers instantly
- **Justification:** Controlled denormalization for **read-heavy** operations

#### 5. **Show functional dependencies for BILLS table**
**Answer:**
```
BillID → CustomerID, BillNumber, BillingMonth, UnitsConsumed, TotalAmount, Status, ...
BillNumber → BillID, CustomerID, BillingMonth, ... (BillNumber is UNIQUE candidate key)
CustomerID (FK) → References CUSTOMERS table (join for customer details)
```

**Candidate Keys:** `{BillID}`, `{BillNumber}`

#### 6. **How did you handle composite keys?**
**Answer:**
- **Design Decision:** Use surrogate keys (AUTO_INCREMENT) everywhere
- **Example:** TARIFF_SLABS
  - Primary Key: `id` (surrogate)
  - Alternative Key: `(tariff_id, slab_number)` as UNIQUE constraint
- **Benefit:** Simplifies foreign key references
- **BCNF:** Both `id` and `(tariff_id, slab_number)` are superkeys

#### 7. **What is the difference between identifying and non-identifying relationships?**
**Answer:**
- **Identifying:** Child cannot exist without parent
  - Example: TARIFF_SLABS cannot exist without TARIFFS
  - Cascade delete: Delete tariff → Delete all its slabs
- **Non-Identifying:** Child can exist independently
  - Example: BILLS references CUSTOMERS but can exist (for audit)
  - Usually set to CASCADE or SET NULL based on business rules

#### 8. **How many candidate keys does CUSTOMERS table have?**
**Answer:** **4 candidate keys**
1. `id` (Primary key)
2. `user_id` (UNIQUE foreign key)
3. `account_number` (UNIQUE business key)
4. `meter_number` (UNIQUE physical identifier)

All are superkeys, so no BCNF violations.

#### 9. **Explain the normalization of tariff slabs step by step**
**Answer:**

**UNF (Unnormalized):**
```
TARIFFS: TariffID, Category, Slab1Min, Slab1Max, Slab1Rate, Slab2Min, ...
         (15 columns for 5 slabs)
```

**1NF (Remove Repeating Groups):**
```
TARIFFS: TariffID, Category, FixedCharge, ElectricityDuty, GST
TARIFF_SLABS: SlabID, TariffID, SlabNumber, MinUnits, MaxUnits, RatePerUnit
```

**2NF (No Partial Dependencies):**
```
SlabID → TariffID, SlabNumber, MinUnits, RatePerUnit  ✅
(No composite PK, so automatically in 2NF)
```

**3NF (No Transitive Dependencies):**
```
SlabID → TariffID (FK only)
TariffID → Category, FixedCharge (in TARIFFS table, not duplicated)
✅ No transitive dependency
```

**BCNF (All Determinants are Superkeys):**
```
SlabID → all attributes  ✅ (SlabID is PK = superkey)
(TariffID, SlabNumber) → all attributes  ✅ (UNIQUE = candidate key = superkey)
```

#### 10. **What anomalies did normalization fix?**
**Answer:**

| Anomaly Type | Before (UNF) | After (BCNF) |
|--------------|--------------|--------------|
| **Update Anomaly** | Change customer phone → Update 12 bill rows | Change once in CUSTOMERS table |
| **Insertion Anomaly** | Cannot add tariff without customer | Can add tariff independently |
| **Deletion Anomaly** | Delete last bill → Lose customer data | Delete bill → Customer data preserved |
| **Redundancy** | Customer details repeated in every bill | Stored once, referenced by FK |

### Viva Preparation Checklist

✅ Explain UNF → 1NF → 2NF → 3NF → BCNF with examples
✅ Draw ERD showing all 17 tables and 25 relationships
✅ List all functional dependencies for any table
✅ Identify candidate keys for CUSTOMERS, BILLS, TARIFF_SLABS
✅ Explain why all tables are in BCNF
✅ Justify strategic denormalization (outstanding_balance)
✅ Explain tariff slab normalization step-by-step
✅ Differentiate 3NF vs BCNF with examples
✅ Show cascade delete examples (users → customers → bills)
✅ Explain why we separated USERS, CUSTOMERS, EMPLOYEES

---

**Document Prepared By:** Electrolux EMS Team
**For:** Phase 1 DBMS Viva Presentation
**Date:** November 9, 2025
**Database:** `electricity_ems`
**Normalization Level:** **BCNF (Highest)**
**Total Tables:** 17
**Total Relationships:** 25 Foreign Keys

**Ready for Viva! 🎓**
