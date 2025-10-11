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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Trend Chart */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Usage Trend
            </h3>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full">
                {/* Mock chart visualization */}
                <div className="flex items-end justify-between h-48 px-2">
                  {[65, 80, 45, 90, 70, 60, 85, 75, 95, 60, 70, 80].map((height, index) => (
                    <div key={index} className="flex-1 mx-1">
                      <div
                        className="bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-md hover:opacity-80 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Avg Daily</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">16.2 kWh</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Peak Day</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">28.5 kWh</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Lowest Day</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">8.3 kWh</p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Chart */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cost Breakdown
            </h3>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none"
                    className="text-gray-200 dark:text-gray-700" />
                  <circle cx="96" cy="96" r="88" stroke="url(#gradient1)" strokeWidth="8" fill="none"
                    strokeDasharray="276.46 276.46" strokeDashoffset="82.94" strokeLinecap="round" />
                  <circle cx="96" cy="96" r="88" stroke="url(#gradient2)" strokeWidth="8" fill="none"
                    strokeDasharray="276.46 276.46" strokeDashoffset="193.52" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient1">
                      <stop offset="0%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                    <linearGradient id="gradient2">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">$245.50</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Bill</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Energy Charge</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">$195.50 (80%)</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Fixed Charges</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">$50.00 (20%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time of Use Distribution */}
          <div className="lg:col-span-2 bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Time of Use Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Peak Hours (6PM-10PM)</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">45%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Normal Hours (6AM-6PM)</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">35%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Off-Peak (10PM-6AM)</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">20%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400">
                💡 Tip: Shift 10% of your usage to off-peak hours to save $15-20 monthly!
              </p>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Payments
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">October 2024</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Paid on Oct 5</p>
                </div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">$220.00</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">September 2024</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Paid on Sep 8</p>
                </div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">$198.50</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">August 2024</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Paid on Aug 10</p>
                </div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">$245.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
