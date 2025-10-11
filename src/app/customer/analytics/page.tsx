'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  Sun,
  DollarSign,
  Zap,
  Award,
  Lightbulb,
  ThermometerSun,
  Wind,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
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

export default function UsageAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [compareMode, setCompareMode] = useState(false);

  // Mock analytics data
  const currentMonthUsage = 485;
  const lastMonthUsage = 460;
  const avgDailyUsage = 16.2;
  const peakUsage = 28.5;
  const estimatedBill = 245.50;
  const comparisonToNeighbors = -8; // -8% means using 8% less
  const efficiencyScore = 73;

  // Historical Usage Trend (Line Chart)
  const usageTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Your Usage (kWh)',
        data: [380, 390, 410, 420, 395, 485],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(251, 146, 60)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
      {
        label: 'Neighborhood Avg (kWh)',
        data: [420, 430, 445, 455, 440, 520],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.4,
        fill: false,
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(156, 163, 175)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }
    ]
  };

  // Hourly Usage Pattern (Bar Chart)
  const hourlyUsageData = {
    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [
      {
        label: 'Average Usage (kWh)',
        data: [6, 5, 8, 15, 18, 20, 28, 22],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderRadius: 6,
        borderWidth: 0,
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

  // Cost Breakdown (Vertical Bar Chart)
  const costBreakdownData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Energy Charges',
        data: [152, 156, 164, 168, 158, 194],
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Fixed Charges',
        data: [50, 50, 50, 50, 50, 50],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Taxes & Duties',
        data: [28, 29, 31, 32, 30, 37],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderRadius: 4,
      }
    ]
  };

  const savingsTips = [
    { icon: ThermometerSun, tip: 'Set AC to 24°C to save up to 15% on cooling costs', savings: '$30/month', priority: 'high' },
    { icon: Lightbulb, tip: 'Switch to LED bulbs for 75% less energy consumption', savings: '$15/month', priority: 'medium' },
    { icon: Clock, tip: 'Run appliances during off-peak hours (10 PM - 6 AM)', savings: '$25/month', priority: 'high' },
    { icon: Wind, tip: 'Use ceiling fans to reduce AC usage by 40%', savings: '$20/month', priority: 'medium' }
  ];

  const chartOptions = {
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
    <DashboardLayout userType="customer" userName="Huzaifa">
      <div className="h-full flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Usage Analytics</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deep insights into your electricity consumption patterns</p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 text-sm bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
              >
                <option value="month">This Month</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">This Year</option>
              </select>
              <button className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 text-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-4">

            {/* Key Metrics - Compact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-xs flex items-center ${currentMonthUsage > lastMonthUsage ? 'text-red-400' : 'text-green-400'}`}>
                    {currentMonthUsage > lastMonthUsage ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(((currentMonthUsage - lastMonthUsage) / lastMonthUsage) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{currentMonthUsage} kWh</p>
              </div>

              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">Daily</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Avg. Daily</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{avgDailyUsage} kWh</p>
              </div>

              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-green-400">Better</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">vs Neighbors</p>
                <p className="text-xl font-bold text-green-400">{comparisonToNeighbors}%</p>
              </div>

              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-purple-400">Score</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Efficiency</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{efficiencyScore}/100</p>
              </div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Usage Trend vs Neighborhood */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Usage Trend vs Neighborhood
                </h3>
                <div className="h-64">
                  <Line data={usageTrendData} options={chartOptions} />
                </div>
              </div>

              {/* Hourly Usage Pattern */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Hourly Usage Pattern
                </h3>
                <div className="h-64">
                  <Bar
                    data={hourlyUsageData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: { display: false }
                      }
                    }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-green-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-400">Off-Peak</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-orange-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-400">Normal</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-red-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-400">Peak</span>
                  </div>
                </div>
              </div>

              {/* Usage by Appliance */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-500" />
                  Usage by Appliance Category
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <Doughnut
                    data={applianceUsageData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            color: 'rgba(156, 163, 175, 0.8)',
                            padding: 10,
                            font: { size: 10 }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          padding: 12,
                          callbacks: {
                            label: function(context: any) {
                              return `${context.label}: ${context.parsed}%`;
                            }
                          }
                        }
                      },
                      cutout: '60%'
                    }}
                  />
                </div>
              </div>

              {/* Efficiency Radar */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-500" />
                  Performance vs Target
                </h3>
                <div className="h-64">
                  <Radar
                    data={efficiencyRadarData}
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
                        }
                      },
                      scales: {
                        r: {
                          grid: { color: 'rgba(156, 163, 175, 0.2)' },
                          angleLines: { color: 'rgba(156, 163, 175, 0.2)' },
                          ticks: {
                            color: 'rgba(156, 163, 175, 0.6)',
                            backdropColor: 'transparent',
                            font: { size: 10 }
                          },
                          pointLabels: {
                            color: 'rgba(156, 163, 175, 0.8)',
                            font: { size: 10 }
                          }
                        }
                      }
                    }}
                  />
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
                            return `${context.dataset.label}: $${context.parsed.y}`;
                          },
                          footer: function(items: any) {
                            let sum = 0;
                            items.forEach((item: any) => {
                              sum += item.parsed.y;
                            });
                            return `Total: $${sum}`;
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
                            return '$' + value;
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

            {/* Insights & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Key Insight */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-5 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Peak Usage Alert</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Your highest consumption is between 6-9 PM, costing 40% more during peak hours.</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Potential savings: $25/month</p>
                  </div>
                </div>
              </div>

              {/* Achievement */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-5 border border-green-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Great Progress!</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">You're using 8% less than your neighbors. Keep up the excellent conservation efforts!</p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">You saved $35 this month</p>
                  </div>
                </div>
              </div>

              {/* Action Item */}
              <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 backdrop-blur-xl rounded-2xl p-5 border border-orange-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quick Win</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">AC accounts for 35% of your bill. Raising temperature by 2°C can save significantly.</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">Easy savings: $30/month</p>
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
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">$90/month</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">or $1,080/year if you implement all tips</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
