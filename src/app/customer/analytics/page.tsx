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
  Clock
} from 'lucide-react';

export default function UsageAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [compareMode, setCompareMode] = useState(false);

  // Mock analytics data
  const currentMonthUsage = 485;
  const lastMonthUsage = 460;
  const avgDailyUsage = 16.2;
  const peakUsage = 28.5;
  const offPeakUsage = 12.3;
  const estimatedBill = 245.50;

  const savingsTips = [
    { icon: ThermometerSun, tip: 'Set AC to 24°C to save up to 15% on cooling costs', savings: '$30/month' },
    { icon: Lightbulb, tip: 'Switch to LED bulbs for 75% less energy consumption', savings: '$15/month' },
    { icon: Clock, tip: 'Run appliances during off-peak hours (10 PM - 6 AM)', savings: '$25/month' },
    { icon: Wind, tip: 'Use ceiling fans to reduce AC usage by 40%', savings: '$20/month' }
  ];

  return (
    <DashboardLayout userType="customer" userName="John Doe">
      <div className="h-full flex flex-col">
        {/* Header - Fixed height */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 mb-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Usage Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">Detailed insights and comparisons of your electricity consumption</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
              >
                <option value="month">This Month</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">This Year</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-6">

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className={`text-sm flex items-center ${currentMonthUsage > lastMonthUsage ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {currentMonthUsage > lastMonthUsage ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {Math.abs(((currentMonthUsage - lastMonthUsage) / lastMonthUsage) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Current Month</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentMonthUsage} kWh</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400">Daily</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Daily Usage</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgDailyUsage} kWh</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-red-400">6-10 PM</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Peak Usage</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{peakUsage} kWh</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400">Estimated</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Current Bill</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${estimatedBill}</p>
          </div>
        </div>

        {/* Usage Pattern Summary */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Usage Patterns</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white font-semibold">Daily Pattern</h3>
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Morning Peak</span>
                  <span className="text-gray-900 dark:text-white font-semibold">9 AM - 18 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Evening Peak</span>
                  <span className="text-gray-900 dark:text-white font-semibold">6 PM - 28 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Lowest Usage</span>
                  <span className="text-gray-900 dark:text-white font-semibold">3 AM - 6 kWh</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white font-semibold">By Category</h3>
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">AC/Heating</span>
                  <span className="text-gray-900 dark:text-white font-semibold">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Water Heater</span>
                  <span className="text-gray-900 dark:text-white font-semibold">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Lighting</span>
                  <span className="text-gray-900 dark:text-white font-semibold">15%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white font-semibold">Time of Use</h3>
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Peak Hours (45%)</span>
                  <span className="text-red-400 font-semibold">$0.20/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Normal (30%)</span>
                  <span className="text-blue-400 font-semibold">$0.12/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Off-Peak (25%)</span>
                  <span className="text-green-400 font-semibold">$0.06/kWh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Comparison Analysis</h2>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg transition-all ${
                compareMode
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
              }`}
            >
              {compareMode ? 'Hide' : 'Show'} Comparison
            </button>
          </div>

          {compareMode && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Your Usage vs Neighborhood</h3>
                  <div className="space-y-3">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                      const yourUsage = [380, 390, 410, 420, 395, 380][i];
                      const avgUsage = [420, 430, 445, 455, 440, 430][i];
                      return (
                        <div key={month}>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">{month}</span>
                            <span className="text-gray-900 dark:text-white text-sm">{yourUsage} kWh</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                              style={{ width: `${(yourUsage / 500) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Efficiency Score</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Energy Usage', score: 75, target: 85 },
                      { label: 'Peak Avoidance', score: 60, target: 80 },
                      { label: 'Consistency', score: 85, target: 90 },
                      { label: 'Conservation', score: 70, target: 85 }
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">{item.label}</span>
                          <span className="text-gray-900 dark:text-white text-sm">{item.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold">Great Job!</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Your usage is 8% lower than the neighborhood average</p>
                  </div>
                  <Award className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Energy Saving Tips */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personalized Savings Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white dark:bg-white/5 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white mb-1">{tip.tip}</p>
                  <p className="text-green-600 dark:text-green-400 font-semibold">Save {tip.savings}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-3">Total potential savings</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">$90/month</p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Chart.js Analytics Coming Soon
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Interactive line charts, bar charts, doughnut charts, radar charts, and weather impact analysis will be available soon.
          </p>
        </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
