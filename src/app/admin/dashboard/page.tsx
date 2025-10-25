'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  DollarSign,
  Users,
  FileText,
  AlertTriangle,
  CreditCard,
  Activity,
  BarChart3,
  Zap,
  PieChart,
  Loader2,
  RefreshCw
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Dashboard] Fetching dashboard data...');
      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API returned error');
      }

      if (!result.data) {
        throw new Error('No dashboard data received');
      }

      setDashboardData(result.data);
      setRetryCount(0);
      console.log('[Dashboard] Dashboard data loaded successfully');
    } catch (err: any) {
      console.error('[Dashboard] Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchDashboardData();
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
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-red-400 font-semibold">Dashboard Error</h3>
          </div>
          <p className="text-red-400 mb-4">{error || 'No data available'}</p>
          <div className="flex space-x-3">
            <button
              onClick={handleRetry}
              disabled={retryCount >= 3}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Retry ({retryCount}/3)
            </button>
            <button
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
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
        data: Object.values(paymentMethods).map((pm: any) => pm.count || 0),
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
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
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
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                Active: {metrics?.activeCustomers || 0}
              </span>
              {(metrics?.suspendedCustomers || 0) > 0 && (
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                  Suspended: {metrics?.suspendedCustomers || 0}
                </span>
              )}
              {(metrics?.inactiveCustomers || 0) > 0 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 rounded">
                  Inactive: {metrics?.inactiveCustomers || 0}
                </span>
              )}
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/admin/customers')}
            className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl hover:border-red-500/40 transition-all"
          >
            <Users className="w-6 h-6 text-red-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Manage Customers</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">View and manage customer accounts</p>
          </button>

          <button
            onClick={() => router.push('/admin/bills')}
            className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all"
          >
            <FileText className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Generate Bills</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Create new billing cycles</p>
          </button>


          <button
            onClick={() => router.push('/admin/outages')}
            className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl hover:border-orange-500/40 transition-all"
          >
            <Zap className="w-6 h-6 text-orange-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Outage Management</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Schedule and manage outages</p>
          </button>

          <button
            onClick={() => router.push('/admin/complaints')}
            className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all"
          >
            <AlertTriangle className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Complaint Management</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage customer complaints</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}