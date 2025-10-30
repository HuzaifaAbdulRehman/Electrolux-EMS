/**
 * Type definitions for ElectroLux EMS
 * Centralized type definitions to replace 'any' types throughout the application
 */

// ========== USER TYPES ==========

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'admin' | 'employee' | 'customer';
  customerId?: number;
  employeeId?: number;
  accountNumber?: string;
  meterNumber?: string;
}

export interface Customer {
  id: number;
  userId: string;
  accountNumber: string;
  meterNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  connectionType: 'residential' | 'commercial' | 'industrial' | 'agricultural';
  status: 'active' | 'suspended' | 'pending_installation' | 'disconnected';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  userId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// ========== BILLING TYPES ==========

export interface Bill {
  id: number;
  customerId: number;
  accountNumber: string;
  meterNumber: string;
  billingPeriod: string;
  dueDate: string;
  unitsConsumed: number;
  previousReading: number;
  currentReading: number;
  tariffId: number;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'issued' | 'paid' | 'overdue' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  tariff?: Tariff;
}

export interface TariffSlab {
  id: number;
  tariffId: number;
  slabOrder: number;
  startUnits: number;
  endUnits: number | null;
  ratePerUnit: number;
  createdAt: string;
}

export interface Tariff {
  id: number;
  category: 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural';
  fixedCharge: number;
  electricityDutyPercent: number;
  gstPercent: number;
  effectiveDate: string;
  validUntil: string | null;
  slabs?: TariffSlab[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  billId: number;
  customerId: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'online';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;
  createdAt: string;
  bill?: Bill;
}

// ========== METER READING TYPES ==========

export interface MeterReading {
  id: number;
  customerId: number;
  meterNumber: string;
  readingValue: number;
  readingDate: string;
  readingType: 'manual' | 'automatic' | 'estimated';
  employeeId?: number;
  notes?: string;
  createdAt: string;
  customer?: Customer;
  employee?: Employee;
}

// ========== COMPLAINT TYPES ==========

export interface Complaint {
  id: number;
  customerId: number;
  category: 'power_outage' | 'billing_issue' | 'meter_problem' | 'service_request' | 'other';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: number;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  assignedEmployee?: Employee;
}

// ========== OUTAGE TYPES ==========

export interface Outage {
  id: number;
  areaName: string;
  zone: string;
  outageType: 'planned' | 'unplanned';
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  affectedCustomerCount: number;
  status: 'scheduled' | 'ongoing' | 'restored' | 'cancelled';
  restorationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ========== WORK ORDER TYPES ==========

export interface WorkOrder {
  id: number;
  title: string;
  description: string;
  type: 'maintenance' | 'repair' | 'installation' | 'inspection' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: number;
  customerId?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedEmployee?: Employee;
  customer?: Customer;
}

// ========== CONNECTION REQUEST TYPES ==========

export interface ConnectionRequest {
  id: number;
  customerId: number;
  connectionType: 'residential' | 'commercial' | 'industrial' | 'agricultural';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  requiredCapacity: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  applicationDate: string;
  processedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

// ========== NOTIFICATION TYPES ==========

export interface Notification {
  id: number;
  userId: string;
  type: 'billing' | 'payment' | 'work_order' | 'complaint' | 'alert' | 'reminder' | 'outage';
  title: string;
  message: string;
  isRead: boolean;
  time: string;
  createdAt: string;
}

// ========== DASHBOARD TYPES ==========

export interface DashboardMetrics {
  totalCustomers: number;
  activeCustomers?: number;
  suspendedCustomers?: number;
  inactiveCustomers?: number;
  totalEmployees?: number;
  totalBills: number;
  activeBills?: number;
  totalRevenue: number;
  outstandingAmount?: number;
  pendingComplaints: number;
  activeOutages: number;
  monthlyRevenue: number;
  paymentCollectionRate: number;
  collectionRate?: number;
  averageBillAmount: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface RevenueByCategory {
  [key: string]: {
    total: number;
    count: number;
  };
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface PaymentMethods {
  [key: string]: number | { count?: number; amount?: number };
}

export interface BillsStatus {
  [key: string]: number | { count?: number; amount?: number };
}

export interface ConnectionTypeDistribution {
  [key: string]: number | { count?: number; activeCount?: number };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentBills: Bill[];
  revenueByCategory: RevenueByCategory;
  monthlyRevenue: MonthlyRevenue[];
  paymentMethods: PaymentMethods;
  billsStatus: BillsStatus;
  connectionTypeDistribution: ConnectionTypeDistribution;
}

// ========== API RESPONSE TYPES ==========

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// ========== FORM TYPES ==========

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  connectionType: 'residential' | 'commercial' | 'industrial' | 'agricultural';
  termsAccepted: boolean;
}

export interface ComplaintForm {
  category: 'power_outage' | 'billing_issue' | 'meter_problem' | 'service_request' | 'other';
  title: string;
  description: string;
}

// ========== UTILITY TYPES ==========

export type UserType = 'admin' | 'employee' | 'customer';
export type ConnectionType = 'residential' | 'commercial' | 'industrial' | 'agricultural';
export type BillStatus = 'issued' | 'paid' | 'overdue' | 'cancelled';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type OutageStatus = 'scheduled' | 'ongoing' | 'restored' | 'cancelled';
export type WorkOrderStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// ========== COMPONENT PROPS TYPES ==========

export interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: UserType;
  userName?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ========== EXPORT ALL ==========

export * from './index';

