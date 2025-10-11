'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Zap,
  DollarSign,
  Activity,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Download,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function CustomerDashboard() {
  const customerName = 'John Doe';

  // Summary Cards Data
  const summaryCards = [
    {
      title: 'Current Balance',
      value: '$245.50',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'This Month Usage',
      value: '485 kWh',
      change: '-5.2%',
      trend: 'down',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Average Daily',
      value: '16.2 kWh',
      change: '+2.3%',
      trend: 'up',
      icon: Activity,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Last Payment',
      value: '$220.00',
      change: 'Oct 5, 2024',
      trend: 'neutral',
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <DashboardLayout userType="customer" userName={customerName}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {customerName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Account: ELX-2024-001234 • Meter: MTR-485729
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
                <Download className="w-5 h-5" />
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                Pay Now
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
  {summaryCards.map((card, index) => (
    <div key={index} className="relative group h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 dark:from-white/5 to-gray-200/50 dark:to-white/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
      <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all h-full min-h-[180px] flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <div
            className={`flex items-center space-x-1 text-sm h-5 ${
              card.trend === 'up'
                ? 'text-green-400'
                : card.trend === 'down'
                ? 'text-red-400'
                : 'text-transparent'
            }`}
          >
            {card.trend === 'up' ? (
              <ArrowUp className="w-4 h-4" />
            ) : card.trend === 'down' ? (
              <ArrowDown className="w-4 h-4" />
            ) : (
              <span className="w-4 h-4 inline-block" />
            )}
            <span>{card.trend === 'neutral' ? '' : card.change}</span>
          </div>
        </div>

        <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{card.title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>

        <div className="mt-2 h-5">
          {card.trend === 'neutral' && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{card.change}</p>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-12 border border-yellow-400/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Advanced Dashboard Coming Soon!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            Charts, consumption analytics, and detailed billing information will be available soon.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Your dashboard is being enhanced with powerful features to help you manage your electricity usage better.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
