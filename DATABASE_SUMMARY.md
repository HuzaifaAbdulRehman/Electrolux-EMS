## Electrolux EMS – Database and Analytics Handbook

This document is your single source of truth for the EMS database: schema, relationships, constraints, analytics definitions, normalization, ERD guidance, and viva-ready FAQs. Keep this file with the project during demo.

### Tech Stack Snapshot
- **DB**: MySQL (InnoDB, utf8mb4)
- **ORM**: Drizzle ORM (TypeScript)
- **App**: Next.js App Router, NextAuth
- **Migrations**: SQL files under `src/lib/drizzle/migrations`
- **Seed**: `src/lib/drizzle/seed.ts`

### Current Active Tables (16)
Grouped by domain (tables use `snake_case` in DB; Drizzle models in `camelCase`).

1) Authentication & Profiles
- `users` – master identity table; roles: admin | employee | customer
- `customers` – 1:1 with `users` for customers, customer-specific attributes
- `employees` – 1:1 with `users` for employees, employment attributes

2) Billing Core
- `meter_readings` – periodic readings per customer (and optional employee recorder)
- `bills` – generated per reading/month; references a reading
- `payments` – one bill may have multiple payments; supports partial payments
- `tariffs` – tariff plans
- `tariff_slabs` – 1:N slabs per tariff, progressive pricing

3) Service Management
- `work_orders` – tasks raised from complaints/reading requests/admin
- `complaints` – customer complaints, assignable to employees
- `reading_requests` – customer requests for meter reading
- `bill_requests` – bill reprints/adjustment inquiries
- `connection_requests` – new connection applications (customer onboarding path)

4) System & Auxiliary
- `notifications` – in-app notifications linked to `users`
- `outages` – planned/unplanned outages with severity and timing
- `password_reset_requests` – tokenized password reset flow

Removed/Not in use for demo:
- `connection_applications` – redundant with `connection_requests` (removed)
- `system_settings` – not used by UI; removed from exports for demo simplicity

### Key Relationships (Crow’s Foot in text)
- `users` 1—1 `customers` (unique FK on `customers.user_id`)
- `users` 1—1 `employees` (unique FK on `employees.user_id`)
- `customers` 1—N `meter_readings` (FK `customer_id`)
- `employees` 1—N `meter_readings` (optional FK `employee_id`)
- `meter_readings` 1—N `bills` (FK `meter_reading_id`)
- `bills` 1—N `payments` (FK `bill_id`)
- `customers` 1—N `reading_requests`, `complaints`, `work_orders`, `bill_requests`
- `employees` 1—N `work_orders`, `complaints` (assignment)
- `users` 1—N `notifications`, `password_reset_requests`
- `tariffs` 1—N `tariff_slabs`

All foreign keys use InnoDB; cascades applied where safe (customer deletion cascades to readings/bills/payments).

### Column Highlights and Constraints
- Surrogate integer PKs (`id`) across tables
- Natural keys where meaningful:
  - `connection_requests.application_number` unique
  - `users.email` unique
- Referential integrity: enforced via FKs
- Monetary fields use DECIMAL(10,2)
- Enumerations used for statuses/types to ensure domain integrity

### Normalization and Theoretical Compliance
- 1NF: All attributes atomic; repeating groups extracted to child tables (e.g., `tariff_slabs`, `payments`).
- 2NF: Tables with composite candidates avoided; non-key attributes fully depend on the key.
- 3NF: No transitive dependencies observed in core tables. Derived/aggregated data (e.g., outstanding balance) is held in `customers` for performance but computed sources remain traceable via `bills` and `payments`. This is a deliberate denormalization for read performance; invariants are maintained in application logic/transactions.
- Referential integrity: Enforced with FK constraints and cascades.
- Domain integrity: Enums and CHECK-like constraints (via enumerations) restrict values.

Notes on denormalization choices
- `customers.outstanding_balance` is maintained to reflect partial payments and provide fast dashboards. Source-of-truth transactions remain `payments` against `bills`.

### Data Lifecycles (High-level)
1) New Connection
- Applicant submits `connection_requests` → admin approves → user/customer record provisioned → service activation

2) Meter Reading → Bill → Payment
- `meter_readings` recorded (employee or auto)
- Bill generated (`bills`) from reading and tariff slabs
- Customer pays (`payments`); partial or full; updates `customers.outstanding_balance`

3) Service
- Customer submits `reading_requests` or `complaints`
- `work_orders` created/assigned and tracked until completion

4) Communication
- `notifications` created for events (billing, payment, tasks)
- `outages` scheduled and surfaced to users

### Analytics Definitions (as implemented)
- Outstanding Amount: SUM of `customers.outstanding_balance`
- Revenue (period): SUM of `payments.amount` within date range
- Avg Monthly Revenue (last N months): revenue over the period ÷ ACTUAL months that had bills
- Revenue Distribution by Category: computed grouping (e.g., connection type) with zero/near-zero categories filtered in UI
- Collection Rate: payments received ÷ bills issued for comparable periods
- Trend Arrows: compares current period to previous equivalent period

### Migrations and Seeding
- Migrations: `src/lib/drizzle/migrations/*.sql`
  - Base snapshot (`0000_*`), subsequent incremental fixes (`0001+`).
  - `connection_applications` exists in early migration but is logically removed in app. If present in your DB instance, it can be safely dropped now.
- Seed: `src/lib/drizzle/seed.ts`
  - Creates realistic users, customers, employees, tariffs+slabs, readings, bills, payments, and demo service data.

Recommended production order of operations
1) Run migrations to latest
2) Seed only if you want fresh demo data; otherwise retain current data for continuity

### ERD – Tooling Recommendation and Steps
Use **MySQL Workbench** for this project.
- Reason: Native MySQL features, reliable reverse engineering from the live schema, easy EER diagram export.
- Oracle SQL Developer can model MySQL generically, but Workbench provides better MySQL-specific DDL and diagram conventions.

Reverse engineer ERD in MySQL Workbench
1) Database → Reverse Engineer
2) Select your EMS database and connect
3) Include all active tables listed above
4) Finish to generate the EER diagram
5) Arrange by domains: Users, Billing Core, Service, System
6) Export as PNG/PDF for the viva

Optional: dbdiagram.io snippet starter
```dbml
Table users {
  id int [pk]
  name varchar
  email varchar [unique]
  user_type enum
  created_at timestamp
}

Table customers {
  id int [pk]
  user_id int [unique, ref: > users.id]
  account_number varchar [unique]
  status enum
  outstanding_balance decimal
}

Table employees {
  id int [pk]
  user_id int [unique, ref: > users.id]
  role enum
}

Table meter_readings {
  id int [pk]
  customer_id int [ref: > customers.id]
  employee_id int [ref: > employees.id]
  reading_date date
  units int
}

Table bills {
  id int [pk]
  meter_reading_id int [ref: > meter_readings.id]
  billing_month date
  total_amount decimal
  status enum
}

Table payments {
  id int [pk]
  bill_id int [ref: > bills.id]
  amount decimal
  payment_date datetime
  method enum
}

Table tariffs {
  id int [pk]
  name varchar
}

Table tariff_slabs {
  id int [pk]
  tariff_id int [ref: > tariffs.id]
  from_unit int
  to_unit int
  rate decimal
}

Table complaints {
  id int [pk]
  customer_id int [ref: > customers.id]
  employee_id int [ref: > employees.id]
  status enum
}

Table reading_requests {
  id int [pk]
  customer_id int [ref: > customers.id]
  status enum
}

Table work_orders {
  id int [pk]
  customer_id int [ref: > customers.id]
  employee_id int [ref: > employees.id]
  source enum
  status enum
}

Table bill_requests {
  id int [pk]
  customer_id int [ref: > customers.id]
  type enum
  status enum
}

Table connection_requests {
  id int [pk]
  application_number varchar [unique]
  applicant_name varchar
  status enum
}

Table notifications {
  id int [pk]
  user_id int [ref: > users.id]
  type enum
}

Table outages {
  id int [pk]
  zone varchar
  outage_type enum
  status enum
}

Table password_reset_requests {
  id int [pk]
  user_id int [ref: > users.id]
  token varchar
  expires_at datetime
}
```

### Viva-ready Explanations (Tricky Q&A)
- Why does Outstanding Balance come from `customers` and not `bills`? Because partial payments apply to the bill but the net receivable per customer is maintained as a single authoritative number for fast reads; underlying `payments` remain the transactional log.
- How do you avoid wrong averages? We divide by the count of months that actually have bills/payments in the period, not a fixed N.
- What ensures tariff calculation correctness? Progressive slabs are modeled as `tariff_slabs` linked to a `tariff`; billing picks slabs by unit ranges deterministically.
- Why separate `work_orders` from `complaints`? Work orders are the actionable tasks; complaints can generate work orders but tasks may also come from reading or admin operations.

### Health Checklist for Demo
- [ ] All migrations applied; no drift
- [ ] Seed data present (if chosen) and dashboards load
- [ ] Admin dashboard KPIs match definitions above
- [ ] Zero-value categories filtered in revenue distribution
- [ ] No references to removed tables/features

### Drop Statements (only if legacy tables still exist)
```sql
DROP TABLE IF EXISTS connection_applications;
-- DROP TABLE IF EXISTS system_settings; -- only if you chose to remove it entirely
```

### Change Log (recent)
- Replaced outstanding balance computation with SUM of `customers.outstanding_balance`
- Avg monthly revenue uses actual billed months
- Removed Data Import and redundant tables from UI/exports for a clean demo scope


