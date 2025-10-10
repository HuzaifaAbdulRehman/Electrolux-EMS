'use client';

import React from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function EmployeeDashboard() {
  const employeeName = 'Mike Johnson';
  const employeeId = 'EMP-2024-0156';
  const department = 'Field Operations';

  // Summary Statistics
  const stats = [
    {
      title: 'Meter Readings Today',
      value: '24',
      target: '30',
      icon: Gauge,
      color: 'from-blue-500 to-cyan-500',
      progress: 80
    },
    {
      title: 'Work Orders',
      value: '8',
      status: '2 Pending',
      icon: ClipboardCheck,
      color: 'from-green-500 to-emerald-500',
      progress: 75
    },
    {
      title: 'Customers Visited',
      value: '18',
      change: '+12%',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      progress: 90
    },
    {
      title: 'Monthly Performance',
      value: '94%',
      rating: 'Excellent',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
      progress: 94
    }
  ];

  // Pending Work Orders
  const workOrders = [
    {
      id: 'WO-2024-1847',
      customer: 'Sarah Williams',
      address: '123 Main St, Apt 4B',
      type: 'Meter Reading',
      priority: 'high',
      time: '10:30 AM',
      status: 'pending'
    },
    {
      id: 'WO-2024-1848',
      customer: 'Robert Chen',
      address: '456 Oak Avenue',
      type: 'Installation',
      priority: 'medium',
      time: '2:00 PM',
      status: 'pending'
    },
    {
      id: 'WO-2024-1849',
      customer: 'Emily Davis',
      address: '789 Pine Road',
      type: 'Maintenance',
      priority: 'low',
      time: '4:30 PM',
      status: 'in-progress'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout userType="employee" userName={employeeName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Employee Dashboard
              </h1>
              <p className="text-gray-400">
                ID: {employeeId} • Department: {department}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-400">Today&apos;s Date</p>
                <p className="text-white font-semibold">October 10, 2024</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && (
                    <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                  )}
                </div>
                <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                {stat.target && (
                  <p className="text-xs text-gray-500">Target: {stat.target}</p>
                )}
                {stat.status && (
                  <p className="text-xs text-yellow-400">{stat.status}</p>
                )}
                {stat.rating && (
                  <p className="text-xs text-green-400">{stat.rating}</p>
                )}
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Work Orders */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Pending Work Orders</h2>
            <button className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workOrders.map((order) => (
              <div key={order.id} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-white font-semibold text-sm">{order.id}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(order.priority)}`}>
                    {order.priority.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{order.customer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-xs">{order.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-xs">{order.time}</span>
                    </div>
                    <button className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold flex items-center space-x-1">
                      <span>Start</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Gauge, label: 'New Reading', href: '/employee/meter-reading' },
              { icon: ClipboardCheck, label: 'Work Orders', href: '/employee/work-orders' },
              { icon: Users, label: 'Customers', href: '/employee/customers' },
              { icon: Calendar, label: 'Schedule', href: '/employee/schedule' }
            ].map((action, index) => (
              <button key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                <div className="relative flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
