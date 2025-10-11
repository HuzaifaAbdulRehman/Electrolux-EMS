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

  // Key Performance Indicators
  const kpis = {
    revenue: { value: '$2.45M', change: '+12.5%', trend: 'up' },
    customers: { value: '15,234', change: '+8.2%', trend: 'up' },
    consumption: { value: '145 GWh', change: '+5.7%', trend: 'up' },
    efficiency: { value: '94.2%', change: '-0.8%', trend: 'down' },
    satisfaction: { value: '4.6/5', change: '+0.3', trend: 'up' },
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

  // System health metrics
  const systemHealthData = {
    labels: ['Uptime', 'Response Time', 'Error Rate', 'Security', 'Backup Status'],
    datasets: [
      {
        label: 'Current',
        data: [99.8, 95, 98, 100, 100],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      },
      {
        label: 'Threshold',
        data: [99, 90, 95, 95, 100],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }
    ]
  };

  // Peak demand analysis
  const peakDemandData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Today',
        data: [120, 80, 180, 220, 280, 240],
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        tension: 0.4
      },
      {
        label: 'Average',
        data: [100, 70, 160, 200, 250, 220],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Predictive analytics
  const predictions = [
    { metric: 'Revenue Next Month', value: '$2.52M', confidence: '92%', trend: 'up' },
    { metric: 'Peak Demand', value: '312 MW', confidence: '88%', trend: 'up' },
    { metric: 'New Connections', value: '245', confidence: '85%', trend: 'stable' },
    { metric: 'System Load', value: '78%', confidence: '90%', trend: 'down' }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Insights</h1>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive system analytics and performance metrics</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Object.entries(kpis).map(([key, data]) => (
            <div key={key} className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <p className="text-gray-600 dark:text-gray-400 text-sm capitalize mb-1">{key}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.value}</p>
              <div className={`flex items-center space-x-1 text-sm ${
                data.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{data.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
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
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
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
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
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
              <div className="p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-xs">Highest Growth</p>
                <p className="text-white font-semibold">Commercial +15%</p>
              </div>
              <div className="p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-xs">Largest Segment</p>
                <p className="text-white font-semibold">Residential 65%</p>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Health Metrics</h2>
            <div className="h-64">
              <Radar
                data={systemHealthData}
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
                    r: {
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      pointLabels: { color: 'rgba(255, 255, 255, 0.6)' },
                      ticks: { display: false }
                    }
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Demand Analysis */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Peak Demand Analysis</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Average</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <Line
              data={peakDemandData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
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
                        return value + ' MW';
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400 text-xs">Current Load</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">245 MW</p>
            </div>
            <div className="p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400 text-xs">Peak Today</p>
              <p className="text-xl font-bold text-yellow-400">280 MW</p>
            </div>
            <div className="p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400 text-xs">Capacity</p>
              <p className="text-xl font-bold text-green-400">400 MW</p>
            </div>
            <div className="p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400 text-xs">Utilization</p>
              <p className="text-xl font-bold text-blue-400">70%</p>
            </div>
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Predictive Analytics</h2>
            <div className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 rounded-full">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm">AI Powered</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictions.map((pred, index) => (
              <div key={index} className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{pred.metric}</p>
                  {pred.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-green-400" />
                  ) : pred.trend === 'down' ? (
                    <ArrowDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Activity className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{pred.value}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: pred.confidence }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{pred.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Connections</h3>
              <Activity className="w-5 h-5 text-green-400 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="text-white font-semibold">3,542</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">New Today</span>
                <span className="text-green-400 font-semibold">+48</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Disconnected</span>
                <span className="text-red-400 font-semibold">-12</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Today</h3>
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Collections</span>
                <span className="text-white font-semibold">$84,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Outstanding</span>
                <span className="text-yellow-400 font-semibold">$12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Target</span>
                <span className="text-gray-600 dark:text-gray-400">$100,000</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                <span className="text-green-400 font-semibold">99.98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="text-white font-semibold">124ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className="text-green-400 font-semibold">0.02%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
