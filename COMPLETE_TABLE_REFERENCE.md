# Complete Table Reference Guide
## All 16 Tables - Attributes, Relationships, Cardinalities
### Electrolux EMS Database - VIVA Ready Reference

---

## TABLE 1: `users` (Strong Entity - Master Identity)

### Purpose
Master authentication table for all system users (admin, employee, customer)

### Attributes (10 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Unique user identifier |
| **email** | VARCHAR(255) | UNIQUE, NOT NULL | User login email |
| **password** | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| **userType** | ENUM | NOT NULL | 'admin', 'employee', 'customer' |
| **name** | VARCHAR(255) | NOT NULL | Full name |
| **phone** | VARCHAR(20) | NULL | Contact number |
| **isActive** | INT | DEFAULT 1, NOT NULL | 1=active, 0=inactive |
| **requiresPasswordChange** | INT | DEFAULT 0, NOT NULL | Force password change flag |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation time |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last update time |

### Relationships
- **1:1 with customers** (one user can be one customer via userId FK)
- **1:1 with employees** (one user can be one employee via userId FK)
- **1:N with notifications** (one user can have many notifications)
- **1:N with password_reset_requests** (one user can have many reset requests)
- **1:N with outages** (one user [admin] creates many outage records)

### Cardinality
- **Total**: Every user in system (admin: ~2-5, employees: ~50-100, customers: ~10,000+)
- **Participation**: Total (every user record must exist)
- **Specialization**: Overlapping NOT allowed (user is EITHER admin OR employee OR customer)

### Keys
- **Primary Key**: id
- **Candidate Keys**: email (unique constraint)
- **Foreign Keys**: None (strong entity)

### Indexes
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

---

## TABLE 2: `customers` (Weak Entity - 1:1 with users)

### Purpose
Customer-specific profile information and account details

### Attributes (26 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Customer unique ID |
| **userId** | INT | FK→users.id, UNIQUE, NOT NULL, CASCADE DELETE | Link to user account |
| **accountNumber** | VARCHAR(50) | UNIQUE, NOT NULL | Format: ELX-2024-XXXXXX |
| **meterNumber** | VARCHAR(50) | UNIQUE, NULL | Format: MTR-XXX-XXXXXX |
| **fullName** | VARCHAR(255) | NOT NULL | Customer full name |
| **email** | VARCHAR(255) | NOT NULL | Contact email |
| **phone** | VARCHAR(20) | NOT NULL | Primary phone |
| **address** | VARCHAR(500) | NOT NULL | Full street address |
| **city** | VARCHAR(100) | NOT NULL | City name |
| **state** | VARCHAR(100) | NOT NULL | State/Province |
| **pincode** | VARCHAR(10) | NOT NULL | Postal code |
| **zone** | VARCHAR(50) | NULL | Load shedding zone (A, B, C, etc.) |
| **connectionType** | ENUM | NOT NULL | 'Residential', 'Commercial', 'Industrial', 'Agricultural' |
| **status** | ENUM | DEFAULT 'active', NOT NULL | 'pending_installation', 'active', 'suspended', 'inactive' |
| **connectionDate** | DATE | NOT NULL | Service activation date |
| **dateOfBirth** | DATE | NULL | Customer DOB (optional) |
| **installationCharges** | DECIMAL(10,2) | NULL | Initial connection charges |
| **lastBillAmount** | DECIMAL(10,2) | DEFAULT 0.00 | Most recent bill amount |
| **lastPaymentDate** | DATE | NULL | Last payment received date |
| **averageMonthlyUsage** | DECIMAL(10,2) | DEFAULT 0.00 | Avg consumption in kWh |
| **outstandingBalance** | DECIMAL(10,2) | DEFAULT 0.00 | **Denormalized** - total unpaid amount |
| **paymentStatus** | ENUM | DEFAULT 'paid', NOT NULL | 'paid', 'pending', 'overdue' |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **1:1 with users** (identifying relationship via userId)
- **1:N with meter_readings** (one customer has many readings)
- **1:N with bills** (one customer has many bills)
- **1:N with payments** (one customer makes many payments)
- **1:N with complaints** (one customer can file many complaints)
- **1:N with work_orders** (one customer can have many work orders)
- **1:N with reading_requests** (one customer can request many readings)
- **1:N with bill_requests** (one customer can request many bill reprints)

### Cardinality
- **Total**: ~10,000+ customer records
- **Participation**: Total with users (every customer must have a user account)
- **Ratio**: 1:1 with users (exactly one user per customer)

### Keys
- **Primary Key**: id
- **Candidate Keys**: userId, accountNumber, meterNumber
- **Foreign Keys**: userId → users.id

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `user_id`
- UNIQUE on `account_number`
- UNIQUE on `meter_number`
- INDEX on `user_id` (FK index)
- INDEX on `status` (filtering)

---

## TABLE 3: `employees` (Weak Entity - 1:1 with users)

### Purpose
Employee-specific information for company staff

### Attributes (13 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Employee unique ID |
| **employeeNumber** | VARCHAR(20) | UNIQUE | Auto-generated employee number |
| **userId** | INT | FK→users.id, NOT NULL, CASCADE DELETE | Link to user account |
| **employeeName** | VARCHAR(255) | NOT NULL | Full name |
| **email** | VARCHAR(255) | NOT NULL | Official email |
| **phone** | VARCHAR(20) | NOT NULL | Contact number |
| **designation** | VARCHAR(100) | NOT NULL | Job title (Meter Reader, Supervisor, Technician) |
| **department** | VARCHAR(100) | NOT NULL | Dept (Operations, Billing, Maintenance) |
| **assignedZone** | VARCHAR(100) | NULL | Geographic work area |
| **status** | ENUM | DEFAULT 'active', NOT NULL | 'active', 'inactive' |
| **hireDate** | DATE | NOT NULL | Employment start date |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **1:1 with users** (identifying relationship via userId)
- **1:N with meter_readings** (one employee records many readings)
- **1:N with complaints** (one employee handles many complaints)
- **1:N with work_orders** (one employee is assigned many work orders)

### Cardinality
- **Total**: ~50-100 employees
- **Participation**: Total with users (every employee must have a user account)
- **Ratio**: 1:1 with users

### Keys
- **Primary Key**: id
- **Candidate Keys**: userId, employeeNumber
- **Foreign Keys**: userId → users.id

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `employee_number`
- INDEX on `user_id` (FK index)

---

## TABLE 4: `tariffs` (Strong Entity - Pricing Master)

### Purpose
Electricity tariff/pricing structures for different customer categories

### Attributes (11 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Tariff unique ID |
| **category** | ENUM | NOT NULL | 'Residential', 'Commercial', 'Industrial', 'Agricultural' |
| **fixedCharge** | DECIMAL(10,2) | NOT NULL | Monthly fixed fee (PKR) |
| **timeOfUsePeakRate** | DECIMAL(10,2) | NULL | Peak hour rate (optional) |
| **timeOfUseNormalRate** | DECIMAL(10,2) | NULL | Normal hour rate (optional) |
| **timeOfUseOffpeakRate** | DECIMAL(10,2) | NULL | Off-peak hour rate (optional) |
| **electricityDutyPercent** | DECIMAL(5,2) | DEFAULT 0.00 | Duty tax percentage |
| **gstPercent** | DECIMAL(5,2) | DEFAULT 18.00 | GST percentage |
| **effectiveDate** | DATE | NOT NULL | Tariff start date |
| **validUntil** | DATE | NULL | Tariff end date (NULL = active) |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **1:N with tariff_slabs** (one tariff has many progressive slabs)
- **1:N with bills** (one tariff is referenced by many bills for audit)

### Cardinality
- **Total**: ~4 active tariffs (one per category) + historical versions
- **Participation**: Mandatory in bills (for audit trail)

### Keys
- **Primary Key**: id
- **Foreign Keys**: None (strong entity)

### Indexes
- PRIMARY KEY on `id`
- COMPOSITE INDEX on `(category, effective_date, valid_until)`

---

## TABLE 5: `tariff_slabs` (Weak Entity - Progressive Pricing)

### Purpose
Progressive/slab-based pricing within each tariff (NORMALIZED from tariffs)

### Attributes (7 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Slab unique ID |
| **tariffId** | INT | FK→tariffs.id, NOT NULL, CASCADE DELETE | Parent tariff |
| **slabOrder** | INT | NOT NULL | Slab sequence (1, 2, 3...) |
| **startUnits** | INT | NOT NULL | Slab starting units (kWh) |
| **endUnits** | INT | NULL | Slab ending units (NULL = infinity) |
| **ratePerUnit** | DECIMAL(10,2) | NOT NULL | Price per kWh in this slab |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |

### Relationships
- **N:1 with tariffs** (many slabs belong to one tariff)

### Cardinality
- **Total**: ~15-20 slabs (3-5 slabs per tariff × 4 tariffs)
- **Participation**: Total with tariffs (every slab must have a parent tariff)

### Keys
- **Primary Key**: id
- **Composite Unique Key**: (tariffId, slabOrder)
- **Foreign Keys**: tariffId → tariffs.id

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `(tariff_id, slab_order)`
- INDEX on `tariff_id` (FK index)

### Business Rules
- CHECK: endUnits > startUnits OR endUnits IS NULL
- CHECK: ratePerUnit > 0
- Slabs must be sequential without gaps

---

## TABLE 6: `meter_readings` (Transaction Entity)

### Purpose
Monthly electricity consumption readings per customer meter

### Attributes (15 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Reading unique ID |
| **customerId** | INT | FK→customers.id, NOT NULL, CASCADE DELETE | Customer link |
| **meterNumber** | VARCHAR(50) | NOT NULL | Meter identifier |
| **currentReading** | DECIMAL(10,2) | NOT NULL | Current meter value (kWh) |
| **previousReading** | DECIMAL(10,2) | NOT NULL | Previous meter value (kWh) |
| **unitsConsumed** | DECIMAL(10,2) | NOT NULL | current - previous |
| **readingDate** | DATE | NOT NULL | Reading capture date |
| **readingTime** | TIMESTAMP | NOT NULL | Exact reading time |
| **meterCondition** | ENUM | DEFAULT 'good', NOT NULL | 'good', 'fair', 'poor', 'damaged' |
| **accessibility** | ENUM | DEFAULT 'accessible', NOT NULL | 'accessible', 'partially_accessible', 'inaccessible' |
| **employeeId** | INT | FK→employees.id, NULL | Who recorded the reading |
| **photoPath** | VARCHAR(500) | NULL | Meter photo evidence path |
| **notes** | TEXT | NULL | Additional observations |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with customers** (many readings per customer)
- **N:1 with employees** (many readings per employee - optional)
- **1:N with bills** (one reading can generate one bill)

### Cardinality
- **Total**: ~120,000 readings/year (10,000 customers × 12 months)
- **Growth**: 10,000 new readings per month

### Keys
- **Primary Key**: id
- **Foreign Keys**: customerId → customers.id, employeeId → employees.id

### Indexes
- PRIMARY KEY on `id`
- INDEX on `customer_id`
- INDEX on `employee_id`
- INDEX on `reading_date`
- COMPOSITE on `(customer_id, reading_date)`

---

## TABLE 7: `bills` (Transaction Entity)

### Purpose
Generated electricity bills based on consumption

### Attributes (18 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Bill unique ID |
| **customerId** | INT | FK→customers.id, NOT NULL, CASCADE DELETE | Customer link |
| **billNumber** | VARCHAR(50) | UNIQUE, NOT NULL | Format: BILL-2024-XXXXXX |
| **billingMonth** | DATE | NOT NULL | Format: YYYY-MM-01 |
| **issueDate** | DATE | NOT NULL | Bill generation date |
| **dueDate** | DATE | NOT NULL | Payment deadline |
| **unitsConsumed** | DECIMAL(10,2) | NOT NULL | Total kWh consumed |
| **meterReadingId** | INT | FK→meter_readings.id, NULL | Source reading reference |
| **baseAmount** | DECIMAL(10,2) | NOT NULL | units × tariff rate |
| **fixedCharges** | DECIMAL(10,2) | NOT NULL | Monthly fixed charge |
| **electricityDuty** | DECIMAL(10,2) | DEFAULT 0.00 | Duty tax amount |
| **gstAmount** | DECIMAL(10,2) | DEFAULT 0.00 | GST amount |
| **totalAmount** | DECIMAL(10,2) | NOT NULL | Final payable amount |
| **status** | ENUM | DEFAULT 'generated', NOT NULL | 'generated', 'issued', 'paid', 'overdue', 'cancelled' |
| **paymentDate** | DATE | NULL | Date when fully paid |
| **tariffId** | INT | FK→tariffs.id, NULL | Tariff used for calculation (audit trail) |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with customers** (many bills per customer)
- **N:1 with meter_readings** (one bill per reading - optional link)
- **N:1 with tariffs** (many bills use one tariff - for audit)
- **1:N with payments** (one bill can have multiple partial payments)

### Cardinality
- **Total**: ~120,000 bills/year
- **Growth**: 10,000 new bills per month

### Keys
- **Primary Key**: id
- **Candidate Keys**: billNumber
- **Foreign Keys**: customerId → customers.id, meterReadingId → meter_readings.id, tariffId → tariffs.id

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `bill_number`
- INDEX on `customer_id`
- INDEX on `meter_reading_id`
- INDEX on `tariff_id`
- INDEX on `billing_month`
- INDEX on `due_date`
- INDEX on `status`
- COMPOSITE on `(customer_id, status)`

---

## TABLE 8: `payments` (Transaction Entity)

### Purpose
Payment transactions (supports partial payments)

### Attributes (11 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Payment unique ID |
| **customerId** | INT | FK→customers.id, NOT NULL, CASCADE DELETE | Customer link |
| **billId** | INT | FK→bills.id, NULL | Related bill (NULL for advance payment) |
| **paymentAmount** | DECIMAL(10,2) | NOT NULL | Amount paid |
| **paymentMethod** | ENUM | NOT NULL | 'credit_card', 'debit_card', 'bank_transfer', 'cash', 'cheque', 'upi', 'wallet' |
| **paymentDate** | DATE | NOT NULL | Transaction date |
| **transactionId** | VARCHAR(100) | UNIQUE, NULL | External payment gateway ID |
| **receiptNumber** | VARCHAR(50) | UNIQUE, NULL | System receipt number |
| **status** | ENUM | DEFAULT 'completed', NOT NULL | 'pending', 'completed', 'failed', 'refunded' |
| **notes** | TEXT | NULL | Additional payment notes |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with customers** (many payments per customer)
- **N:1 with bills** (many payments per bill - partial payments)

### Cardinality
- **Total**: ~100,000 payments/year
- **Ratio**: 1:1 bills (most), 1:N for partial payments

### Keys
- **Primary Key**: id
- **Candidate Keys**: transactionId, receiptNumber
- **Foreign Keys**: customerId → customers.id, billId → bills.id

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `transaction_id`
- UNIQUE on `receipt_number`
- INDEX on `customer_id`
- INDEX on `bill_id`
- INDEX on `payment_date`

---

## TABLE 9: `complaints` (Service Entity)

### Purpose
Customer complaint management and tracking

### Attributes (18 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Complaint unique ID |
| **customerId** | INT | FK→customers.id, NOT NULL, CASCADE DELETE | Customer who filed |
| **employeeId** | INT | FK→employees.id, NULL, SET NULL | Assigned employee |
| **workOrderId** | INT | NULL | Linked work order (if created) |
| **category** | ENUM | NOT NULL | 'power_outage', 'billing', 'service', 'meter_issue', 'connection', 'other' |
| **title** | VARCHAR(255) | NOT NULL | Complaint subject |
| **description** | TEXT | NOT NULL | Detailed description |
| **status** | ENUM | DEFAULT 'submitted', NOT NULL | 'submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed' |
| **priority** | ENUM | DEFAULT 'medium', NOT NULL | 'low', 'medium', 'high', 'urgent' |
| **resolutionNotes** | TEXT | NULL | How it was resolved |
| **submittedAt** | TIMESTAMP | DEFAULT NOW() | Complaint submission time |
| **reviewedAt** | TIMESTAMP | NULL | When admin reviewed |
| **assignedAt** | TIMESTAMP | NULL | When assigned to employee |
| **resolvedAt** | TIMESTAMP | NULL | When marked resolved |
| **closedAt** | TIMESTAMP | NULL | When closed |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with customers** (many complaints per customer)
- **N:1 with employees** (many complaints per employee - assignment)
- **1:1 with work_orders** (optional - some complaints generate work orders)

### Cardinality
- **Total**: ~5,000 complaints/year
- **Distribution**: 70% power outage, 20% billing, 10% other

### Keys
- **Primary Key**: id
- **Foreign Keys**: customerId → customers.id, employeeId → employees.id

### Indexes
- PRIMARY KEY on `id`
- INDEX on `customer_id`
- INDEX on `employee_id`
- INDEX on `work_order_id`
- COMPOSITE on `(customer_id, status)`

---

## TABLE 10: `work_orders` (Operation Entity)

### Purpose
Field work tasks for employees (installation, repair, maintenance, reading)

### Attributes (14 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Work order unique ID |
| **employeeId** | INT | FK→employees.id, NULL | Assigned employee |
| **customerId** | INT | FK→customers.id, NULL | Related customer (if applicable) |
| **workType** | ENUM | NOT NULL | 'meter_reading', 'maintenance', 'complaint_resolution', 'new_connection', 'disconnection', 'reconnection' |
| **title** | VARCHAR(255) | NOT NULL | Task title |
| **description** | TEXT | NULL | Task details |
| **status** | ENUM | DEFAULT 'assigned', NOT NULL | 'assigned', 'in_progress', 'completed', 'cancelled' |
| **priority** | ENUM | DEFAULT 'medium', NOT NULL | 'low', 'medium', 'high', 'urgent' |
| **assignedDate** | DATE | NOT NULL | When task was assigned |
| **dueDate** | DATE | NOT NULL | Deadline for completion |
| **completionDate** | DATE | NULL | When actually completed |
| **completionNotes** | TEXT | NULL | Completion remarks |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with employees** (many work orders per employee)
- **N:1 with customers** (many work orders per customer - optional)
- **1:1 with complaints** (some work orders are from complaints)
- **1:1 with reading_requests** (some work orders are from reading requests)

### Cardinality
- **Total**: ~15,000 work orders/year
- **Distribution**: 60% meter_reading, 20% maintenance, 20% other

### Keys
- **Primary Key**: id
- **Foreign Keys**: employeeId → employees.id, customerId → customers.id

### Indexes
- PRIMARY KEY on `id`
- INDEX on `employee_id`
- INDEX on `customer_id`
- INDEX on `work_type`
- COMPOSITE on `(status, priority)`

---

## TABLE 11: `reading_requests` (Service Entity)

### Purpose
Customer requests for manual meter reading

### Attributes (9 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Request unique ID |
| **customerId** | INT | FK→customers.id, NOT NULL, CASCADE DELETE | Requesting customer |
| **requestDate** | DATE | NOT NULL | When request was made |
| **reason** | TEXT | NOT NULL | Why customer needs reading |
| **preferredDate** | DATE | NULL | Customer's preferred date |
| **status** | ENUM | DEFAULT 'pending', NOT NULL | 'pending', 'scheduled', 'completed', 'cancelled' |
| **workOrderId** | INT | FK→work_orders.id, NULL, SET NULL | Created work order |
| **completedDate** | DATE | NULL | When reading was done |
| **notes** | TEXT | NULL | Additional notes |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with customers** (many requests per customer)
- **1:1 with work_orders** (one request creates one work order)

### Cardinality
- **Total**: ~2,000 requests/year
- **Completion Rate**: ~90%

### Keys
- **Primary Key**: id
- **Foreign Keys**: customerId → customers.id, workOrderId → work_orders.id

### Indexes
- PRIMARY KEY on `id`
- INDEX on `status`
- INDEX on `customer_id`
- INDEX on `request_date`

---

## TABLE 12: `bill_requests` (Service Entity)

### Purpose
Customer requests for bill reprint, adjustment, or clarification

### Attributes (10 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Request unique ID |
| **customerId** | INT | FK→customers.id, NOT NULL, CASCADE DELETE | Requesting customer |
| **requestId** | VARCHAR(50) | UNIQUE, NOT NULL | System request number |
| **billingMonth** | DATE | NOT NULL | Which month's bill |
| **priority** | ENUM | DEFAULT 'medium', NOT NULL | 'low', 'medium', 'high' |
| **notes** | TEXT | NULL | Customer's notes |
| **status** | ENUM | DEFAULT 'pending', NOT NULL | 'pending', 'processing', 'completed', 'rejected' |
| **requestDate** | DATE | NOT NULL | When request was made |
| **createdBy** | INT | FK→users.id, NULL | Who created (system/admin) |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with customers** (many requests per customer)
- **N:1 with users** (many requests created by one user/admin)

### Cardinality
- **Total**: ~1,500 requests/year
- **Unique Constraint**: One request per customer per billing month

### Keys
- **Primary Key**: id
- **Candidate Keys**: requestId
- **Composite Unique**: (customerId, billingMonth)
- **Foreign Keys**: customerId → customers.id, createdBy → users.id

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `request_id`
- UNIQUE on `(customer_id, billing_month)`

---

## TABLE 13: `connection_requests` (Independent Entity)

### Purpose
New electricity connection applications (pre-customer stage)

### Attributes (31 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Application unique ID |
| **applicationNumber** | VARCHAR(50) | UNIQUE, NOT NULL | System application number |
| **applicantName** | VARCHAR(255) | NOT NULL | Applicant full name |
| **fatherName** | VARCHAR(255) | NULL | Father's name |
| **email** | VARCHAR(255) | NOT NULL | Contact email |
| **phone** | VARCHAR(20) | NOT NULL | Primary contact |
| **alternatePhone** | VARCHAR(20) | NULL | Alternate contact |
| **idType** | ENUM | NOT NULL | 'passport', 'drivers_license', 'national_id', 'voter_id', 'aadhaar' |
| **idNumber** | VARCHAR(100) | NOT NULL | ID document number |
| **propertyType** | ENUM | NOT NULL | 'Residential', 'Commercial', 'Industrial', 'Agricultural' |
| **connectionType** | ENUM | NOT NULL | 'single-phase', 'three-phase', 'industrial' |
| **loadRequired** | DECIMAL(10,2) | NULL | Requested load (kW) |
| **propertyAddress** | VARCHAR(500) | NOT NULL | Installation address |
| **city** | VARCHAR(100) | NOT NULL | City |
| **state** | VARCHAR(100) | NULL | State |
| **pincode** | VARCHAR(10) | NULL | Postal code |
| **landmark** | VARCHAR(255) | NULL | Nearby landmark |
| **zone** | VARCHAR(50) | NULL | Load shedding zone |
| **preferredDate** | DATE | NULL | Preferred installation date |
| **purposeOfConnection** | ENUM | NOT NULL | 'domestic', 'business', 'industrial', 'agricultural' |
| **existingConnection** | BOOLEAN | DEFAULT FALSE | Has existing connection? |
| **existingAccountNumber** | VARCHAR(50) | NULL | Existing account (if any) |
| **status** | ENUM | DEFAULT 'pending', NOT NULL | 'pending', 'under_review', 'approved', 'rejected', 'connected' |
| **estimatedCharges** | DECIMAL(10,2) | NULL | Estimated installation cost |
| **inspectionDate** | DATE | NULL | Site inspection date |
| **approvalDate** | DATE | NULL | When approved |
| **installationDate** | DATE | NULL | When installed |
| **applicationDate** | DATE | NOT NULL | Application submission date |
| **accountNumber** | VARCHAR(50) | NULL | Generated when approved |
| **temporaryPassword** | VARCHAR(255) | NULL | Initial login password |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **Independent** (no foreign keys - pre-customer)
- After approval → Creates customer record

### Cardinality
- **Total**: ~3,000 applications/year
- **Approval Rate**: ~85%

### Keys
- **Primary Key**: id
- **Candidate Keys**: applicationNumber
- **Foreign Keys**: None (independent entity)

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `application_number`
- INDEX on `status`
- INDEX on `email`
- INDEX on `zone`

---

## TABLE 14: `notifications` (Communication Entity)

### Purpose
In-app notification messages for users

### Attributes (9 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Notification unique ID |
| **userId** | INT | FK→users.id, NOT NULL, CASCADE DELETE | Recipient user |
| **type** | ENUM | NOT NULL | 'info', 'warning', 'success', 'error' |
| **title** | VARCHAR(255) | NOT NULL | Notification headline |
| **message** | TEXT | NOT NULL | Notification body |
| **linkUrl** | VARCHAR(500) | NULL | Action link URL |
| **isRead** | INT | DEFAULT 0, NOT NULL | 0=unread, 1=read |
| **readAt** | TIMESTAMP | NULL | When marked as read |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Notification creation time |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with users** (many notifications per user)

### Cardinality
- **Total**: ~50,000 notifications/year
- **Average**: 5 notifications per user per month

### Keys
- **Primary Key**: id
- **Foreign Keys**: userId → users.id

### Indexes
- PRIMARY KEY on `id`
- INDEX on `user_id`
- COMPOSITE on `(user_id, is_read)`

---

## TABLE 15: `outages` (System Entity)

### Purpose
Power outage schedule and reporting

### Attributes (12 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Outage unique ID |
| **zone** | VARCHAR(50) | NOT NULL | Affected zone (A, B, C, etc.) |
| **outageType** | ENUM | NOT NULL | 'planned', 'unplanned' |
| **severity** | ENUM | NOT NULL | 'low', 'medium', 'high', 'critical' |
| **startTime** | TIMESTAMP | NOT NULL | Outage start time |
| **endTime** | TIMESTAMP | NULL | Expected/actual end time |
| **affectedAreas** | TEXT | NULL | List of affected areas |
| **reason** | TEXT | NULL | Reason for outage |
| **status** | ENUM | NOT NULL | 'scheduled', 'in_progress', 'resolved' |
| **createdBy** | INT | FK→users.id, NULL | Admin who created |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with users** (many outages created by one admin)

### Cardinality
- **Total**: ~500 outages/year
- **Type Distribution**: 70% planned, 30% unplanned

### Keys
- **Primary Key**: id
- **Foreign Keys**: createdBy → users.id

### Indexes
- PRIMARY KEY on `id`
- INDEX on `zone`
- INDEX on `status`
- INDEX on `outage_type`
- INDEX on `created_by`

---

## TABLE 16: `password_reset_requests` (Security Entity)

### Purpose
Secure password reset token management

### Attributes (11 total)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **id** | INT | PK, AUTO_INCREMENT | Request unique ID |
| **userId** | INT | FK→users.id, NOT NULL, CASCADE DELETE | User requesting reset |
| **email** | VARCHAR(255) | NOT NULL | User's email |
| **token** | VARCHAR(255) | UNIQUE, NOT NULL | Reset token (hashed) |
| **expiresAt** | TIMESTAMP | NOT NULL | Token expiration time |
| **usedAt** | TIMESTAMP | NULL | When token was used |
| **status** | ENUM | NOT NULL | 'pending', 'used', 'expired' |
| **ipAddress** | VARCHAR(45) | NULL | Request IP address |
| **userAgent** | TEXT | NULL | Browser user agent |
| **processedBy** | INT | FK→users.id, NULL, SET NULL | Who processed (admin) |
| **createdAt** | TIMESTAMP | DEFAULT NOW() | Record creation |
| **updatedAt** | TIMESTAMP | ON UPDATE NOW() | Last modification |

### Relationships
- **N:1 with users** (many reset requests per user)
- **N:1 with users** (processedBy - admin who handled)

### Cardinality
- **Total**: ~1,000 requests/year
- **Expiry**: 1 hour from creation

### Keys
- **Primary Key**: id
- **Candidate Keys**: token
- **Foreign Keys**: userId → users.id, processedBy → users.id

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `token`
- INDEX on `status`
- INDEX on `email`
- INDEX on `user_id`

---

## Complete Relationship Summary

### All Relationships with Cardinalities

```
users (1) ──────────────── (1) customers
users (1) ──────────────── (1) employees
users (1) ──────────────── (N) notifications
users (1) ──────────────── (N) password_reset_requests
users (1) ──────────────── (N) outages [createdBy]

customers (1) ──────────── (N) meter_readings
customers (1) ──────────── (N) bills
customers (1) ──────────── (N) payments
customers (1) ──────────── (N) complaints
customers (1) ──────────── (N) work_orders
customers (1) ──────────── (N) reading_requests
customers (1) ──────────── (N) bill_requests

employees (1) ──────────── (N) meter_readings [recorder]
employees (1) ──────────── (N) complaints [assignedTo]
employees (1) ──────────── (N) work_orders [assignedTo]

tariffs (1) ────────────── (N) tariff_slabs
tariffs (1) ────────────── (N) bills [audit reference]

meter_readings (1) ──────── (1) bills [optional]

bills (1) ──────────────── (N) payments

complaints (1) ────────────(0-1) work_orders
reading_requests (1) ─────(0-1) work_orders
```

### Total Relationships: 24 Foreign Keys

---

## Database Statistics

| Metric | Value |
|--------|-------|
| **Total Tables** | 16 |
| **Total Attributes** | 235+ |
| **Total Foreign Keys** | 24 |
| **Total Indexes** | 53+ |
| **Strong Entities** | 3 (users, tariffs, outages) |
| **Weak Entities** | 6 (customers, employees, tariff_slabs, meter_readings, bills, payments) |
| **Independent Entities** | 1 (connection_requests) |
| **Service Entities** | 6 (complaints, work_orders, reading_requests, bill_requests, notifications, password_reset_requests) |

---

*Complete table reference for VIVA preparation*
*Last Updated: November 4, 2025*
