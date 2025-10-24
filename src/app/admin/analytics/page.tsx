'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Zap,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Globe,
  Cpu,
  Database,
  Shield
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
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
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [refreshing, setRefreshing] = useState(false);

  // Key Performance Indicators - Only realistic DB-driven metrics
  const kpis = {
    revenue: { value: 'Rs 245M', change: '+12.5%', trend: 'up' },
    customers: { value: '15,234', change: '+8.2%', trend: 'up' },
    consumption: { value: '145,000 kWh', change: '+5.7%', trend: 'up' }, // Total kWh This Month
    collections: { value: '96.8%', change: '+2.1%', trend: 'up' }
  };

  // Revenue trend data
  const revenueTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Revenue',
        data: [2.1, 2.2, 2.3, 2.25, 2.35, 2.4, 2.38, 2.42, 2.44, 2.45],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Target',
        data: [2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.5, 2.5, 2.5, 2.5],
        borderColor: 'rgb(156, 163, 175)',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  // Zone performance data
  const zonePerformanceData = {
    labels: ['North', 'South', 'East', 'West', 'Central'],
    datasets: [
      {
        label: 'Revenue',
        data: [580, 490, 520, 410, 450],
        backgroundColor: 'rgba(34, 197, 94, 0.8)'
      },
      {
        label: 'Consumption',
        data: [32, 28, 30, 25, 30],
        backgroundColor: 'rgba(250, 204, 21, 0.8)'
      }
    ]
  };

  // Customer segmentation
  const customerSegmentData = {
    labels: ['Residential', 'Commercial', 'Industrial', 'Agricultural'],
    datasets: [
      {
        data: [65, 20, 12, 3],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  // REMOVED: System health metrics, Peak demand analysis, Predictive analytics
  // These require infrastructure monitoring, smart meters, and AI/ML - not available in DBMS project

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Insights</h1>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive system analytics and performance metrics</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
              >
                <option value="day" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Today</option>
                <option value="week" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">This Week</option>
                <option value="month" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">This Month</option>
                <option value="quarter" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">This Quarter</option>
                <option value="year" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">This Year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`px-4 py-2 bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-200 dark:hover:bg-white/20 transition-all flex items-center space-x-2 ${
                  refreshing ? 'opacity-70' : ''
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards - Only realistic DB-driven metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(kpis).map(([key, data]) => (
            <div key={key} className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <p className="text-gray-600 dark:text-gray-400 text-sm capitalize mb-1">{key}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.value}</p>
              <div className={`flex items-center space-x-1 text-sm ${
                data.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{data.change}</span>
              </div>
              {/* MySQL queries for each KPI:
                  revenue: SELECT SUM(amount) FROM bills WHERE MONTH(bill_date) = CURRENT_MONTH
                  customers: SELECT COUNT(*) FROM customers WHERE status='active'
                  consumption: SELECT SUM(units) FROM bills WHERE MONTH(bill_date) = CURRENT_MONTH
                  collections: SELECT (SUM(paid_amount)/SUM(total_amount))*100 FROM bills WHERE MONTH(bill_date) = CURRENT_MONTH
              */}
            </div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all">
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-64">
              <Line
                data={revenueTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { color: 'rgba(255, 255, 255, 0.6)' }
                    }
                  },
                  scales: {
                    x: {
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      ticks: { color: 'rgba(255, 255, 255, 0.6)' }
                    },
                    y: {
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        callback: function(value: any) {
                          return '$' + value + 'M';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Zone Performance */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Zone Performance</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-64">
              <Bar
                data={zonePerformanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { color: 'rgba(255, 255, 255, 0.6)' }
                    }
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: 'rgba(255, 255, 255, 0.6)' }
                    },
                    y: {
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      ticks: { color: 'rgba(255, 255, 255, 0.6)' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Customer Segmentation */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Segmentation</h2>
            <div className="h-64">
              <Doughnut
                data={customerSegmentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: { color: 'rgba(255, 255, 255, 0.6)', padding: 20 }
                    }
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-xs">Highest Growth</p>
                <p className="text-white font-semibold">Commercial +15%</p>
              </div>
              <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-xs">Largest Segment</p>
                <p className="text-white font-semibold">Residential 65%</p>
              </div>
            </div>
          </div>

          {/* Monthly Consumption Summary */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Consumption Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total kWh This Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">145,000 kWh</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-sm text-blue-400 mt-2">+5.7% from last month</p>
                {/* MySQL: SELECT SUM(units) FROM bills WHERE MONTH(bill_date) = CURRENT_MONTH */}
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Average Bill Amount</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">Rs 24,550</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-green-400 mt-2">Per customer this month</p>
                {/* MySQL: SELECT AVG(amount) FROM bills WHERE MONTH(bill_date) = CURRENT_MONTH */}
              </div>
            </div>
          </div>
        </div>

        {/* REMOVED: Peak Demand Analysis, Predictive Analytics, Real-time Metrics */}
        {/* These sections required smart meters, AI/ML, and real-time infrastructure monitoring */}
        {/* which are not available in a DBMS project scope */}
      </div>
    </DashboardLayout>
  );
}
