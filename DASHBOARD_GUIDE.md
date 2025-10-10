# Electrolux EMS - Dashboard Components Guide

## Overview

The Electrolux EMS system now includes fully functional dashboard components with role-based access control for Customers, Employees, and Admins.

## Components Created

### 1. **DashboardLayout Component**
**Location**: `src/components/DashboardLayout.tsx`

A reusable layout component that provides:
- **Top Navigation Bar** with logo, search, notifications, and profile dropdown
- **Sidebar Navigation** with role-based menu items
- **Mobile-responsive** design with hamburger menu
- **Theme consistency** with purple/yellow gradient background
- **User type badge** (Customer/Employee/Admin)

#### Props:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'employee' | 'admin';
  userName?: string;
}
```

#### Navigation Items by Role:

**Customer**:
- Dashboard
- Bills
- Usage
- Notifications
- Settings

**Employee**:
- Dashboard
- Meter Reading
- Customers
- Work Orders
- Settings

**Admin**:
- Dashboard
- Customers
- Employees
- Tariffs
- Reports
- Analytics
- Settings

---

### 2. **Customer Dashboard**
**Location**: `src/app/customer/dashboard/page.tsx`
**Route**: `/customer/dashboard`

Features:
- Welcome header with account and meter information
- 4 summary cards showing:
  - Current Balance
  - This Month Usage
  - Average Daily consumption
  - Last Payment
- "Pay Now" quick action button
- Placeholder for future charts and analytics

---

### 3. **Employee Dashboard**
**Location**: `src/app/employee/dashboard/page.tsx`
**Route**: `/employee/dashboard`

Features:
- Employee information header (ID, Department, Date)
- 4 performance statistics cards with progress bars:
  - Meter Readings Today (with target)
  - Work Orders status
  - Customers Visited
  - Monthly Performance rating
- Pending Work Orders grid with:
  - Priority badges (High/Medium/Low)
  - Customer information
  - Address and time
  - Status indicators
  - Quick "Start" action
- Quick Actions panel for common tasks

---

### 4. **Meter Reading Form**
**Location**: `src/app/employee/meter-reading/page.tsx`
**Route**: `/employee/meter-reading`

Features:
- **Customer Search**: Search by account number, meter number, or name
- **Customer Information Display**: Shows selected customer details
- **Reading Form** with:
  - Current reading input with automatic consumption calculation
  - Date and time fields
  - Meter condition selector
  - Optional notes field
- **Form Validation**:
  - Ensures reading is greater than previous reading
  - Required field validation
  - Number validation
- **Success feedback** after submission
- **Auto-reset** form after successful submission

---

## Installed Dependencies

```json
"chart.js": "^4.5.0",
"react-chartjs-2": "^5.3.0"
```

These are ready for future implementation of:
- Line charts (consumption trends)
- Bar charts (usage comparisons)
- Doughnut/Pie charts (cost breakdowns)
- Area charts (historical data)

---

## Theme Consistency

All dashboard pages maintain the Electrolux theme:

### Colors:
- **Background**: `from-slate-900 via-purple-900 to-slate-900`
- **Cards**: `bg-white/5 backdrop-blur-xl`
- **Borders**: `border-white/10`
- **Primary Gradient**: `from-yellow-400 to-orange-500`

### Role-Specific Colors:
- **Customer**: Yellow/Orange gradient
- **Employee**: Green/Emerald gradient
- **Admin**: Red/Pink gradient

---

## Usage Examples

### Customer Dashboard:
```tsx
import { redirect } from 'next/navigation';

export default function CustomerPage() {
  // In a real app, check authentication here
  // const session = await getServerSession();
  // if (!session) redirect('/login');

  redirect('/customer/dashboard');
}
```

### Employee Dashboard:
```tsx
import { redirect } from 'next/navigation';

export default function EmployeePage() {
  redirect('/employee/dashboard');
}
```

---

## Navigation Structure

```
/
├── / (Home)
├── /login
├── /register
├── /forgot-password
├── /customer
│   └── /dashboard
├── /employee
│   ├── /dashboard
│   └── /meter-reading
└── /admin (To be implemented)
```

---

## Mobile Responsiveness

All dashboard components are fully responsive:
- **Mobile (< 768px)**: Sidebar collapses, hamburger menu appears
- **Tablet (768px - 1024px)**: Sidebar remains, compact layout
- **Desktop (> 1024px)**: Full sidebar, expanded search bar, all features visible

---

## Next Steps

### Recommended Implementations:

1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Add route protection middleware
   - Create role-based access control

2. **Database Integration**
   - Connect to MySQL database
   - Implement API routes for data fetching
   - Add real-time data updates

3. **Advanced Charts**
   - Implement Chart.js components for:
     - 6-month consumption trends
     - Cost breakdown pie charts
     - Daily usage bar charts
     - Comparison analytics

4. **Additional Pages**
   - Customer Bills page
   - Customer Usage history
   - Employee Customers list
   - Employee Work Orders management
   - Admin dashboard with analytics

5. **Real-time Features**
   - WebSocket for live meter readings
   - Push notifications
   - Real-time usage alerts

---

## File Structure

```
src/
├── components/
│   └── DashboardLayout.tsx
├── app/
│   ├── customer/
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── employee/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── meter-reading/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── forgot-password/
        └── page.tsx
```

---

## Testing the Dashboards

1. **Start the dev server**: `npm run dev`
2. **Navigate to**:
   - Customer: http://localhost:3002/customer/dashboard
   - Employee: http://localhost:3002/employee/dashboard
   - Meter Reading: http://localhost:3002/employee/meter-reading

---

## Notes

- All components use **TypeScript** for type safety
- **Tailwind CSS** v3 for styling
- **Lucide React** for icons
- **Next.js 14.1.0** App Router
- Charts are ready for implementation but not yet integrated

---

## Support

For questions or issues:
- Check `THEME_COLORS.md` for design system details
- Reference component props in each file
- See Next.js 14 documentation for routing
