'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Calendar,
  CreditCard,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BillingOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedZone, setSelectedZone] = useState('all');

  // Financial Metrics
  const metrics = {
    totalRevenue: 2847500,
    collected: 2456800,
    outstanding: 285600,
    overdue: 105100,
    avgBillAmount: 245.50,
    collectionRate: 86.3
  };

  // Revenue by Category
  const categoryData = {
    labels: ['Residential', 'Commercial', 'Industrial', 'Agricultural'],
    datasets: [
      {
        data: [45, 30, 20, 5],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Monthly Revenue Trend
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Revenue',
        data: [2100000, 2250000, 2180000, 2350000, 2420000, 2380000, 2500000, 2650000, 2720000, 2847500],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Target',
        data: [2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2600000, 2700000, 2800000, 2900000],
        borderColor: 'rgba(236, 72, 153, 1)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  // Payment Methods
  const paymentMethodsData = {
    labels: ['Online Banking', 'Credit Card', 'Debit Card', 'Cash', 'Auto Debit', 'Mobile Wallet'],
    datasets: [
      {
        label: 'Transactions',
        data: [3500, 2800, 2200, 1500, 1800, 2400],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12 },
          padding: 15
        }
      }
    }
  };

  // Recent Transactions
  const recentTransactions = [
    {
      id: 1,
      customer: 'John Doe',
      accountNumber: 'ELX-2024-001234',
      amount: 245.50,
      method: 'Online Banking',
      status: 'completed',
      date: '2024-10-11 09:23 AM'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      accountNumber: 'ELX-2024-002156',
      amount: 189.00,
      method: 'Credit Card',
      status: 'completed',
      date: '2024-10-11 09:15 AM'
    },
    {
      id: 3,
      customer: 'Robert Johnson',
      accountNumber: 'ELX-2024-003789',
      amount: 320.75,
      method: 'Mobile Wallet',
      status: 'pending',
      date: '2024-10-11 09:08 AM'
    },
    {
      id: 4,
      customer: 'Emily Davis',
      accountNumber: 'ELX-2024-004512',
      amount: 275.25,
      method: 'Auto Debit',
      status: 'completed',
      date: '2024-10-11 08:55 AM'
    },
    {
      id: 5,
      customer: 'Michael Brown',
      accountNumber: 'ELX-2024-005234',
      amount: 198.50,
      method: 'Debit Card',
      status: 'failed',
      date: '2024-10-11 08:42 AM'
    }
  ];

  // Outstanding Bills
  const outstandingBills = [
    {
      id: 1,
      customer: 'Sarah Wilson',
      accountNumber: 'ELX-2024-006891',
      amount: 450.00,
      dueDate: '2024-10-15',
      daysOverdue: 0,
      risk: 'low',
      billMonth: 'October 2024'
    },
    {
      id: 2,
      customer: 'David Martinez',
      accountNumber: 'ELX-2024-007234',
      amount: 380.50,
      dueDate: '2024-10-10',
      daysOverdue: 1,
      risk: 'medium',
      billMonth: 'October 2024'
    },
    {
      id: 3,
      customer: 'Lisa Anderson',
      accountNumber: 'ELX-2024-008567',
      amount: 525.75,
      dueDate: '2024-10-05',
      daysOverdue: 6,
      risk: 'high',
      billMonth: 'October 2024'
    },
    {
      id: 4,
      customer: 'James Taylor',
      accountNumber: 'ELX-2024-009123',
      amount: 295.00,
      dueDate: '2024-09-30',
      daysOverdue: 11,
      risk: 'high',
      billMonth: 'September 2024'
    },
    {
      id: 5,
      customer: 'Patricia Moore',
      accountNumber: 'ELX-2024-010456',
      amount: 410.25,
      dueDate: '2024-10-12',
      daysOverdue: 0,
      risk: 'low',
      billMonth: 'October 2024'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout userType="admin" userName="Sarah Johnson">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing Overview</h1>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive financial dashboard and billing analytics</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${(metrics.totalRevenue / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-green-400 mt-1">+12.5% from last month</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Collected</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${(metrics.collected / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-green-400 mt-1">+8.3% from last month</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <TrendingDown className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Outstanding</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${(metrics.outstanding / 1000).toFixed(0)}K</p>
            <p className="text-xs text-yellow-400 mt-1">-3.2% from last month</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Overdue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${(metrics.overdue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-red-400 mt-1">+5.7% from last month</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Bill Amount</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${metrics.avgBillAmount}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Per customer</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Collection Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.collectionRate}%</p>
            <p className="text-xs text-green-400 mt-1">+2.1% from last month</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly performance vs target</p>
              </div>
              <BarChart3 className="w-6 h-6 text-red-400" />
            </div>
            <div className="h-64">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue by Category</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Customer type distribution</p>
              </div>
              <PieChart className="w-6 h-6 text-pink-400" />
            </div>
            <div className="h-64">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Transaction volume by payment type</p>
            </div>
            <CreditCard className="w-6 h-6 text-purple-400" />
          </div>
          <div className="h-64">
            <Bar data={paymentMethodsData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Latest payment activities</p>
              </div>
              <button className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all text-sm">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 border-b border-gray-200 dark:border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Account</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-white dark:bg-white dark:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{transaction.customer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{transaction.accountNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">${transaction.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{transaction.method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="capitalize">{transaction.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{transaction.date}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outstanding Bills */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Outstanding Bills</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Unpaid bills requiring attention</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all text-sm flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 border-b border-gray-200 dark:border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Account</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Bill Period</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Days Overdue</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {outstandingBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-white dark:bg-white dark:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{bill.customer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{bill.accountNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{bill.billMonth}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">${bill.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{bill.dueDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-medium ${
                        bill.daysOverdue === 0 ? 'text-green-400' :
                        bill.daysOverdue <= 5 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {bill.daysOverdue === 0 ? 'Not due' : `${bill.daysOverdue} days`}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getRiskColor(bill.risk)}`}>
                        {bill.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Billing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Bills Generated Today</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,247</p>
            <p className="text-sm text-green-400 mt-2">+18% from yesterday</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Payments Received Today</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$86,420</p>
            <p className="text-sm text-blue-400 mt-2">742 transactions</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Active Customers</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">11,598</p>
            <p className="text-sm text-purple-400 mt-2">96.5% payment rate</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
