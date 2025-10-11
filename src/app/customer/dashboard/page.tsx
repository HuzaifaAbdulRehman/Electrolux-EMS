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
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CustomerDashboard() {
  const customerName = 'Huzaifa';

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
      title: 'Avg Monthly Usage',
      value: '457 kWh',
      change: 'last 6 months',
      trend: 'neutral',
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

  // Usage Trend Chart Data (Line Chart)
  const usageTrendData = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Consumption (kWh)',
        data: [380, 510, 485, 420, 460, 485],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(251, 146, 60)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };


  return (
    <DashboardLayout userType="customer" userName={customerName}>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header - Compact */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Welcome back, {customerName}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Account: ELX-2024-001234 • Meter: MTR-485729
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all text-sm">
                Pay Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-4">

        {/* Summary Cards - Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {summaryCards.map((card, index) => (
    <div key={index} className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
      <div className="flex items-center justify-between mb-1">
        <div className={`w-8 h-8 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
          <card.icon className="w-4 h-4 text-white" />
        </div>
        {card.trend !== 'neutral' && (
          <span className={`text-xs flex items-center space-x-1 ${
            card.trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            {card.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            <span>{card.change}</span>
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-xs">{card.title}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
      {card.trend === 'neutral' && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{card.change}</p>
      )}
    </div>
  ))}
</div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Usage Trend Chart - Takes 2/3 width */}
          <div className="lg:col-span-2 bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
              Monthly Consumption Trend
            </h3>
            <div className="h-80">
              <Line
                data={usageTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        color: 'rgba(156, 163, 175, 0.8)',
                        padding: 15,
                        font: { size: 12 }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      padding: 12,
                      borderColor: 'rgba(251, 146, 60, 0.5)',
                      borderWidth: 1,
                      callbacks: {
                        label: function(context: any) {
                          return `${context.dataset.label}: ${context.parsed.y} kWh`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      grid: { color: 'rgba(156, 163, 175, 0.1)' },
                      ticks: {
                        color: 'rgba(156, 163, 175, 0.6)',
                        callback: function(value: any) {
                          return value + ' kWh';
                        }
                      }
                    },
                    x: {
                      grid: { color: 'rgba(156, 163, 175, 0.1)' },
                      ticks: { color: 'rgba(156, 163, 175, 0.6)' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Recent Payments - Takes 1/3 width */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
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
        </div>
      </div>
    </DashboardLayout>
  );
}
