'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  User,
  Zap,
  PieChart
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Mock customer data
  const customers = [
    {
      id: 1,
      accountNumber: 'ELX-2024-001234',
      name: 'Huzaifa',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      meterNumber: 'MTR-485729',
      connectionType: 'Residential',
      status: 'active',
      joinDate: '2024-01-15',
      lastBillAmount: 245.50,
      lastPaymentDate: '2024-10-05',
      averageMonthlyUsage: 485,
      outstandingBalance: 0,
      paymentStatus: 'paid'
    },
    {
      id: 2,
      accountNumber: 'ELX-2024-001235',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      meterNumber: 'MTR-485730',
      connectionType: 'Commercial',
      status: 'active',
      joinDate: '2024-02-20',
      lastBillAmount: 892.30,
      lastPaymentDate: '2024-10-08',
      averageMonthlyUsage: 1250,
      outstandingBalance: 0,
      paymentStatus: 'paid'
    },
    {
      id: 3,
      accountNumber: 'ELX-2024-001236',
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Elm St, Chicago, IL 60601',
      meterNumber: 'MTR-485731',
      connectionType: 'Residential',
      status: 'suspended',
      joinDate: '2024-03-10',
      lastBillAmount: 315.75,
      lastPaymentDate: '2024-09-15',
      averageMonthlyUsage: 520,
      outstandingBalance: 631.50,
      paymentStatus: 'overdue'
    },
    {
      id: 4,
      accountNumber: 'ELX-2024-001237',
      name: 'Tech Corp Inc.',
      email: 'billing@techcorp.com',
      phone: '+1 (555) 456-7890',
      address: '100 Tech Plaza, San Francisco, CA 94105',
      meterNumber: 'MTR-485732',
      connectionType: 'Industrial',
      status: 'active',
      joinDate: '2023-11-05',
      lastBillAmount: 4580.90,
      lastPaymentDate: '2024-10-10',
      averageMonthlyUsage: 8500,
      outstandingBalance: 0,
      paymentStatus: 'paid'
    },
    {
      id: 5,
      accountNumber: 'ELX-2024-001238',
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      phone: '+1 (555) 567-8901',
      address: '321 Pine St, Seattle, WA 98101',
      meterNumber: 'MTR-485733',
      connectionType: 'Residential',
      status: 'active',
      joinDate: '2024-04-25',
      lastBillAmount: 198.40,
      lastPaymentDate: '2024-10-12',
      averageMonthlyUsage: 380,
      outstandingBalance: 0,
      paymentStatus: 'paid'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'suspended': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'inactive': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 dark:text-green-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'overdue': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'Residential': return 'from-blue-500 to-cyan-500';
      case 'Commercial': return 'from-yellow-400 to-orange-500';
      case 'Industrial': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          customer.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.lastBillAmount, 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  // Customer Growth Trend Chart Data
  const customerGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Total Customers',
        data: [4850, 4920, 5050, 5180, 5280, 5380, 5450, 5520, 5600, 5678],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Active Customers',
        data: [4650, 4710, 4840, 4960, 5050, 5140, 5200, 5260, 5330, 5400],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'New Signups',
        data: [85, 95, 145, 160, 125, 135, 95, 100, 110, 105],
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.3)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Connection Type Distribution Chart Data
  const connectionTypeData = {
    labels: ['Residential', 'Commercial', 'Industrial'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(250, 204, 21)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2
      }
    ]
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Customer Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage customer accounts, connections, and billing information
              </p>
            </div>
            <button
              onClick={() => setShowAddCustomer(true)}
              className="mt-4 sm:mt-0 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCustomers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Accounts</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-red-600 dark:text-red-400">Outstanding</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalOutstanding.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Outstanding</p>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Growth Trend Chart */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Growth Trend</h2>
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="h-64">
              <Line
                data={customerGrowthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { color: 'rgba(156, 163, 175, 0.8)' }
                    }
                  },
                  scales: {
                    x: {
                      grid: { color: 'rgba(156, 163, 175, 0.1)' },
                      ticks: { color: 'rgba(156, 163, 175, 0.6)' }
                    },
                    y: {
                      grid: { color: 'rgba(156, 163, 175, 0.1)' },
                      ticks: {
                        color: 'rgba(156, 163, 175, 0.6)',
                        callback: function(value: any) {
                          return value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Growth Rate</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">+17.1%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Monthly</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">+112</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Churn Rate</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">1.2%</p>
              </div>
            </div>
          </div>

          {/* Connection Type Distribution Chart */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connection Type Distribution</h2>
              <PieChart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={connectionTypeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: { color: 'rgba(156, 163, 175, 0.8)', padding: 20 }
                    }
                  },
                  cutout: '65%'
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
              <div className="text-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Residential</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">3,691</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-1"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Commercial</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">1,420</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Industrial</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, account, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400 font-medium"
            >
              <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Status</option>
              <option value="active" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Active</option>
              <option value="suspended" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Suspended</option>
              <option value="inactive" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Inactive</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    Connection
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    Billing
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">
                          {customer.accountNumber}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Meter: {customer.meterNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getConnectionTypeColor(customer.connectionType)} text-white`}>
                        {customer.connectionType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {customer.averageMonthlyUsage} kWh
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${customer.lastBillAmount}
                        </p>
                        <p className={`text-xs ${getPaymentStatusColor(customer.paymentStatus)}`}>
                          {customer.paymentStatus === 'paid' ? 'Paid' :
                           customer.paymentStatus === 'overdue' ? `Overdue: $${customer.outstandingBalance}` :
                           'Pending'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(customer.id)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Customer Details
                </h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {(() => {
                const customer = customers.find(c => c.id === selectedCustomer);
                if (!customer) return null;

                return (
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{customer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="text-gray-900 dark:text-white">{customer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="text-gray-900 dark:text-white">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                          <p className="text-gray-900 dark:text-white">{customer.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                          <p className="text-gray-900 dark:text-white">{customer.joinDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Billing Information */}
                    <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Billing Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Last Bill</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            ${customer.lastBillAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            ${customer.outstandingBalance}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Usage</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {customer.averageMonthlyUsage} kWh
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Last Payment</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {customer.lastPaymentDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-white/10">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                        Edit Customer
                      </button>
                      <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
                        View Bills
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}