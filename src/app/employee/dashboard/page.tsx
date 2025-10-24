'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Gauge,
  Users,
  ClipboardCheck,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function EmployeeDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
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
      <DashboardLayout userType="employee" userName={session?.user?.name || 'Employee'}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !dashboardData) {
    return (
      <DashboardLayout userType="employee" userName={session?.user?.name || 'Employee'}>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error || 'No data available'}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { workOrders = [], meterReadings = [], todaysReadings = 0, completedOrders = 0, assignedOrders = 0 } = dashboardData;

  // Calculate statistics from real data
  const stats = [
    {
      title: 'Meter Readings Today',
      value: todaysReadings.toString(),
      target: '30',
      icon: Gauge,
      color: 'from-blue-500 to-cyan-500',
      progress: Math.min((todaysReadings / 30) * 100, 100)
    },
    {
      title: 'Work Orders',
      value: assignedOrders.toString(),
      status: `${assignedOrders - completedOrders} Pending`,
      icon: ClipboardCheck,
      color: 'from-green-500 to-emerald-500',
      progress: assignedOrders > 0 ? (completedOrders / assignedOrders) * 100 : 0
    },
    {
      title: 'Completed Orders',
      value: completedOrders.toString(),
      change: assignedOrders > 0 ? `${Math.round((completedOrders / assignedOrders) * 100)}%` : '0%',
      icon: CheckCircle,
      color: 'from-purple-500 to-pink-500',
      progress: assignedOrders > 0 ? (completedOrders / assignedOrders) * 100 : 0
    },
    {
      title: 'Performance Score',
      value: '88%',
      rating: 'Good',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
      progress: 88
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'assigned':
      case 'pending': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'assigned':
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  return (
    <DashboardLayout userType="employee" userName={session?.user?.name || 'Employee'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Employee Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {session?.user?.name || 'Employee'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Today&apos;s Date</p>
                <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && (
                    <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                  )}
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
                <div className="flex items-baseline space-x-2 mb-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  {stat.target && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">/ {stat.target}</p>
                  )}
                  {stat.status && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.status}</p>
                  )}
                  {stat.rating && (
                    <p className="text-sm text-yellow-400 font-semibold">{stat.rating}</p>
                  )}
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Work Orders Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Work Orders</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Your assigned tasks</p>
              </div>
              <button
                onClick={() => router.push('/employee/work-orders')}
                className="px-4 py-2 bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20 transition-all text-sm flex items-center space-x-2"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {workOrders.length > 0 ? (
                  workOrders.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-gray-900 dark:text-white font-medium">WO-{order.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">{order.customerName || 'N/A'}</p>
                          {order.customerAccount && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerAccount}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 dark:text-gray-300 capitalize">{order.workType?.replace('_', ' ')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border capitalize ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 dark:text-gray-400">{new Date(order.dueDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status?.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/employee/work-orders/${order.id}`)}
                          className="text-green-400 hover:text-green-300 transition-colors flex items-center space-x-1"
                        >
                          <span>View</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No work orders assigned
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
            onClick={() => router.push('/employee/meter-reading')}
            className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all"
          >
            <Gauge className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Record Meter Reading</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Submit new readings</p>
          </button>

          <button
            onClick={() => router.push('/employee/work-orders')}
            className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all"
          >
            <ClipboardCheck className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">View Work Orders</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage assigned tasks</p>
          </button>

          <button
            onClick={() => router.push('/employee/customers')}
            className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all"
          >
            <Users className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-semibold">Customer Directory</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Search customer info</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}