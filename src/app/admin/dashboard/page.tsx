'use client';

import React, { useState, useEffect } from 'react';
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
  PieChart,
  Loader2
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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedZone, setSelectedZone] = useState('all');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setDashboardData(result.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !dashboardData) {
    return (
      <DashboardLayout userType="admin" userName="Admin">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error || 'No data available'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const { metrics, recentBills = [], revenueByCategory = {}, monthlyRevenue = [], paymentMethods = {} } = dashboardData;

  // Chart data from API
  const categoryData = {
    labels: Object.keys(revenueByCategory),
    datasets: [
      {
        label: 'Revenue ($)',
        data: Object.values(revenueByCategory),
        backgroundColor: [
          'rgba(239, 68, 68, 0.85)',
          'rgba(236, 72, 153, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(59, 130, 246, 0.85)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  // Monthly Revenue Trend from actual data
  const revenueData = {
    labels: monthlyRevenue.map((item: any) => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue.map((item: any) => item.revenue),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Payment Methods from actual data
  const paymentMethodsData = {
    labels: Object.keys(paymentMethods),
    datasets: [
      {
        label: 'Transactions',
        data: Object.values(paymentMethods),
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
      case 'issued': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  return (
    <DashboardLayout userType="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive overview of ElectroLux EMS</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics from API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.totalCustomers || 0}</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.totalEmployees || 0}</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Rs {(parseFloat(metrics?.monthlyRevenue || 0) / 1000).toFixed(1)}K
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Outstanding</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Rs {(parseFloat(metrics?.outstandingAmount || 0) / 1000).toFixed(1)}K
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Active Bills</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.activeBills || 0}</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Collection Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.collectionRate || 0}%
            </p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly revenue over time</p>
              </div>
              <BarChart3 className="w-6 h-6 text-red-400" />
            </div>
            <div className="h-64">
              {monthlyRevenue.length > 0 ? (
                <Line data={revenueData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No revenue data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue by Category</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Connection type breakdown</p>
              </div>
              <PieChart className="w-6 h-6 text-pink-400" />
            </div>
            <div className="h-64">
              {Object.keys(revenueByCategory).length > 0 ? (
                <Bar data={categoryData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No category data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        {Object.keys(paymentMethods).length > 0 && (
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Distribution by payment type</p>
              </div>
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div className="h-64">
              <Doughnut data={paymentMethodsData} options={doughnutOptions} />
            </div>
          </div>
        )}

        {/* Recent Bills Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bills</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Latest billing activities</p>
              </div>
              <button
                onClick={() => window.location.href = '/admin/bills'}
                className="px-4 py-2 bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20 transition-all text-sm"
              >
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Bill No</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentBills.length > 0 ? (
                  recentBills.slice(0, 5).map((bill: any) => (
                    <tr key={bill.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-gray-900 dark:text-white font-medium">{bill.billNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 dark:text-gray-300">{bill.customerName}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{bill.accountNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 dark:text-white font-semibold">Rs {parseFloat(bill.totalAmount).toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 dark:text-gray-400">{new Date(bill.dueDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No recent bills available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin/customers'}
            className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl hover:border-red-500/40 transition-all"
          >
            <Users className="w-6 h-6 text-red-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Manage Customers</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">View and manage customer accounts</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/bills'}
            className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all"
          >
            <FileText className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Generate Bills</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Create new billing cycles</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/reports'}
            className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all"
          >
            <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">View Reports</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Analytics and insights</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}