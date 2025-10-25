'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import DashboardLayout from '@/components/DashboardLayout';
import { safeNumber, formatCurrency, safeDate, formatUnits } from '@/lib/utils/dataHandlers';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Zap,
  Lightbulb,
  ThermometerSun,
  Wind,
  Clock
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function UsageAnalytics() {
  const { data: session } = useSession();

  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [compareMode, setCompareMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Fetch real analytics data from database
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/customer/dashboard');
        const data = await response.json();

        console.log('[Analytics] API Response:', data);

        if (data.success) {
          setAnalyticsData(data);
        } else {
          throw new Error(data.error || 'Failed to fetch analytics');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Fallback to basic data
        setAnalyticsData({
          success: true,
          data: {
            currentBill: null,
            recentBills: [],
            consumptionHistory: [],
            avgConsumption: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600 dark:text-gray-400">Loading analytics...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Extract real data from dashboard API response
  const consumptionHistory = analyticsData?.data?.consumptionHistory || [];
  const recentBills = analyticsData?.data?.recentBills || [];
  const currentBill = analyticsData?.data?.currentBill || null;

  // Calculate metrics from real data
  const currentMonthUsage = consumptionHistory.length > 0
    ? safeNumber(consumptionHistory[0]?.unitsConsumed, 0)
    : 0;

  const lastMonthUsage = consumptionHistory.length > 1
    ? safeNumber(consumptionHistory[1]?.unitsConsumed, 0)
    : 0;

  const avgConsumption = analyticsData?.data?.avgConsumption || 0;
  const avgDailyUsage = avgConsumption > 0 ? Math.round(avgConsumption / 30) : 0;

  const estimatedBill = currentBill
    ? safeNumber(currentBill.totalAmount, 0)
    : 0;

  const monthlyChange = lastMonthUsage > 0
    ? ((currentMonthUsage - lastMonthUsage) / lastMonthUsage * 100).toFixed(1)
    : '0';

  // Monthly Usage Trend - Use real consumptionHistory from database
  const monthlyUsageTrendData = {
    labels: consumptionHistory.map((item: any) => {
      const date = new Date(item.billingPeriod);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }).reverse().slice(0, 6),
    datasets: [
      {
        label: 'Monthly Usage (kWh)',
        data: consumptionHistory.map((item: any) => safeNumber(item.unitsConsumed, 0)).reverse().slice(0, 6),
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(251, 146, 60)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  // Usage by Appliance (Doughnut Chart)
  const applianceUsageData = {
    labels: ['AC/Heating', 'Water Heater', 'Lighting', 'Kitchen', 'Electronics', 'Others'],
    datasets: [
      {
        data: [35, 20, 15, 12, 10, 8],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8
      }
    ]
  };

  // Efficiency Radar Chart
  const efficiencyRadarData = {
    labels: ['Usage Efficiency', 'Peak Avoidance', 'Consistency', 'Conservation', 'Cost Management'],
    datasets: [
      {
        label: 'Your Performance',
        data: [75, 60, 85, 70, 80],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Target',
        data: [85, 80, 90, 85, 90],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      }
    ]
  };

  // Cost Breakdown (Vertical Bar Chart) - Use real bill data
  const costBreakdownData = {
    labels: consumptionHistory.map((item: any) => {
      const date = new Date(item.billingPeriod);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }).reverse().slice(0, 6),
    datasets: [
      {
        label: 'Total Amount (Rs.)',
        data: consumptionHistory.map((item: any) => item.totalAmount).reverse().slice(0, 6),
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderRadius: 4,
      }
    ]
  };

  const savingsTips = [
    { icon: ThermometerSun, tip: 'Set AC to 24°C to save up to 15% on cooling costs', savings: 'Rs. 300/month', priority: 'high' },
    { icon: Lightbulb, tip: 'Switch to LED bulbs for 75% less energy consumption', savings: 'Rs. 150/month', priority: 'medium' },
    { icon: Clock, tip: 'Run appliances during off-peak hours (10 PM - 6 AM)', savings: 'Rs. 250/month', priority: 'high' },
    { icon: Wind, tip: 'Use ceiling fans to reduce AC usage by 40%', savings: 'Rs. 200/month', priority: 'medium' }
  ];

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(156, 163, 175, 0.8)',
          padding: 15,
          font: { size: 11 },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(251, 146, 60, 0.5)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'rgba(156, 163, 175, 0.6)', font: { size: 10 } }
      },
      x: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'rgba(156, 163, 175, 0.6)', font: { size: 10 } }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(156, 163, 175, 0.8)',
          padding: 15,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(251, 146, 60, 0.5)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'rgba(156, 163, 175, 0.6)', font: { size: 10 } }
      },
      x: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'rgba(156, 163, 175, 0.6)', font: { size: 10 } }
      }
    }
  };

  return (
    <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Usage Analytics</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deep insights into your electricity consumption patterns</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-white"
              >
                <option value="month" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">This Month</option>
                <option value="6months" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Last 6 Months</option>
                <option value="year" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-4">

            {/* Key Metrics - Real Data from Database */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-xs flex items-center ${parseFloat(monthlyChange) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {parseFloat(monthlyChange) > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(parseFloat(monthlyChange))}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">This Month Usage</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatUnits(currentMonthUsage)}</p>
              </div>

              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">Daily</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Avg. Daily Usage</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatUnits(avgDailyUsage)}</p>
              </div>

              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-green-400">Est.</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Current Bill</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(estimatedBill, 'Rs.')}</p>
              </div>
            </div>

            {/* Monthly Usage Trend - Real Data from Database */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    6-Month Usage Trend
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Track your electricity consumption patterns</p>
                </div>
              </div>
              <div className="h-80">
                <Line data={monthlyUsageTrendData} options={lineChartOptions} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Highest</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatUnits(Math.max(...consumptionHistory.map((item: any) => safeNumber(item.unitsConsumed, 0))))}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Last 6 months</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lowest</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatUnits(consumptionHistory.length > 0 ? Math.min(...consumptionHistory.map((item: any) => safeNumber(item.unitsConsumed, 0))) : 0)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Last 6 months</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Average</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatUnits(avgConsumption)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">6 months</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown - Full Width */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Monthly Cost Breakdown (Last 6 Months)
              </h3>
              <div className="h-72">
                <Bar
                  data={costBreakdownData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: 'rgba(156, 163, 175, 0.8)',
                          padding: 15,
                          font: { size: 11 }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        callbacks: {
                          label: function(context: any) {
                            return `${context.dataset.label}: Rs. ${context.parsed.y}`;
                          },
                          footer: function(items: any) {
                            let sum = 0;
                            items.forEach((item: any) => {
                              sum += item.parsed.y;
                            });
                            return `Total: Rs. ${sum}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        stacked: true,
                        grid: { color: 'rgba(156, 163, 175, 0.1)' },
                        ticks: {
                          color: 'rgba(156, 163, 175, 0.6)',
                          callback: function(value: any) {
                            return 'Rs. ' + value;
                          }
                        }
                      },
                      x: {
                        stacked: true,
                        grid: { display: false },
                        ticks: { color: 'rgba(156, 163, 175, 0.6)' }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Usage Insights - Based on Real Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Month-over-Month Analysis */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-5 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Monthly Analysis</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Your usage {parseFloat(monthlyChange) > 0 ? 'increased' : 'decreased'} by {Math.abs(parseFloat(monthlyChange))}% compared to last month.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      Current: {formatUnits(currentMonthUsage)} | Last: {formatUnits(lastMonthUsage)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Savings Opportunity */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-5 border border-green-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Save Energy</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Reducing consumption by 10% can save approximately {formatCurrency(estimatedBill * 0.1, 'Rs.')}/month.
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      Target: {formatUnits(Math.round(currentMonthUsage * 0.9))} next month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Savings Tips */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-5 border border-green-500/20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-green-500" />
                Personalized Energy Saving Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savingsTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-white/5 rounded-xl border border-green-200 dark:border-white/10 hover:border-green-400 dark:hover:border-green-500 transition-all">
                    <div className={`w-10 h-10 ${tip.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <tip.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${tip.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                          {tip.priority === 'high' ? 'High Impact' : 'Medium Impact'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white mb-1">{tip.tip}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">💰 Save {tip.savings}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center p-4 bg-white dark:bg-white/5 rounded-xl border border-green-200 dark:border-white/10">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Savings Potential</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">Rs. 900/month</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">or Rs. 10,800/year if you implement all tips</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
