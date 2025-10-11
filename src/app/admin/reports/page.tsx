'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Mail,
  Printer,
  Eye
} from 'lucide-react';

export default function ReportGeneration() {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('2024-10-01');
  const [endDate, setEndDate] = useState('2024-10-31');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const reportTypes = [
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Detailed revenue and billing analysis',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      fields: ['Total Revenue', 'Collection Rate', 'Outstanding Amount', 'Payment Methods']
    },
    {
      id: 'consumption',
      name: 'Consumption Analysis',
      description: 'Energy consumption patterns and trends',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      fields: ['Total kWh', 'Peak Usage', 'Average per Customer', 'Time of Use']
    },
    {
      id: 'customer',
      name: 'Customer Report',
      description: 'Customer demographics and statistics',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      fields: ['Total Customers', 'New Registrations', 'Active Users', 'Churn Rate']
    },
    {
      id: 'billing',
      name: 'Billing Report',
      description: 'Billing cycles and payment status',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      fields: ['Bills Generated', 'Paid Bills', 'Pending Bills', 'Overdue Bills']
    },
    {
      id: 'employee',
      name: 'Employee Performance',
      description: 'Employee productivity and metrics',
      icon: Activity,
      color: 'from-red-500 to-rose-500',
      fields: ['Meter Readings', 'Bills Generated', 'Efficiency Score', 'Work Orders']
    },
    {
      id: 'tariff',
      name: 'Tariff Analysis',
      description: 'Tariff structure and revenue impact',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      fields: ['Tariff Categories', 'Rate Changes', 'Revenue Impact', 'Usage Distribution']
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Revenue Report - September 2024',
      type: 'revenue',
      date: '2024-10-01',
      generatedBy: 'Admin',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Consumption Analysis - Q3 2024',
      type: 'consumption',
      date: '2024-09-30',
      generatedBy: 'Admin',
      size: '3.1 MB'
    },
    {
      id: 3,
      name: 'Customer Report - August 2024',
      type: 'customer',
      date: '2024-09-01',
      generatedBy: 'Admin',
      size: '1.8 MB'
    }
  ];

  const reportStats = [
    { label: 'Total Reports', value: '156', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'This Month', value: '24', icon: Calendar, color: 'from-green-500 to-emerald-500' },
    { label: 'Scheduled', value: '8', icon: Clock, color: 'from-yellow-400 to-orange-500' },
    { label: 'Automated', value: '12', icon: Activity, color: 'from-purple-500 to-pink-500' }
  ];

  const selectedReportData = reportTypes.find(r => r.id === selectedReport);

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      setReportGenerated(true);
    }, 3000);
  };

  const getReportIcon = (type: string) => {
    const report = reportTypes.find(r => r.id === type);
    return report ? report.icon : FileText;
  };

  return (
    <DashboardLayout userType="admin" userName="Sarah Johnson">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Report Generation</h1>
              <p className="text-gray-600 dark:text-gray-400">Generate comprehensive reports and analytics</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Schedule</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Automate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {reportStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Report Type</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => {
                      setSelectedReport(report.id);
                      setReportGenerated(false);
                    }}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedReport === report.id
                        ? 'border-red-400/50 bg-white/10'
                        : 'border-gray-200 dark:border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-gray-300 dark:border-white/20'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${report.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <report.icon className="w-5 h-5 text-gray-900 dark:text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{report.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{report.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Report Configuration */}
            {selectedReportData && !reportGenerated && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Configure Report</h2>

                <div className="space-y-6">
                  {/* Date Range */}
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block">Date Range</label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'This Week' },
                        { value: 'month', label: 'This Month' },
                        { value: 'custom', label: 'Custom' }
                      ].map((range) => (
                        <button
                          key={range.value}
                          onClick={() => setDateRange(range.value)}
                          className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                            dateRange === range.value
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-gray-900 dark:text-white'
                              : 'bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-200 dark:hover:bg-white/20'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>

                    {dateRange === 'custom' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Report Fields */}
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block">Include Fields</label>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedReportData.fields.map((field) => (
                        <label key={field} className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5"
                          />
                          <span className="text-gray-900 dark:text-white text-sm">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Export Format */}
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block">Export Format</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'pdf', label: 'PDF', icon: FileText },
                        { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
                        { value: 'csv', label: 'CSV', icon: FileSpreadsheet }
                      ].map((format) => (
                        <label key={format.value} className="flex items-center space-x-2 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10">
                          <input type="radio" name="format" defaultChecked={format.value === 'pdf'} className="w-4 h-4" />
                          <format.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-white text-sm">{format.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <span className="text-gray-700 dark:text-gray-300">Include charts and visualizations</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <span className="text-gray-700 dark:text-gray-300">Send email notification when ready</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <span className="text-gray-700 dark:text-gray-300">Save report configuration</span>
                    </label>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className={`w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      generatingReport ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-pink-500/50'
                    }`}
                  >
                    {generatingReport ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Report...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Generate Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Report Preview */}
            {reportGenerated && selectedReportData && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Generated Successfully</h2>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${selectedReportData.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <selectedReportData.icon className="w-6 h-6 text-gray-900 dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{selectedReportData.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{selectedReportData.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Period: </span>
                          <span className="text-gray-900 dark:text-white">{startDate} to {endDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Size: </span>
                          <span className="text-gray-900 dark:text-white">2.8 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
                  </button>
                  <button className="py-3 px-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="py-3 px-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all">
                    <Printer className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setReportGenerated(false)}
                  className="w-full mt-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
                >
                  Generate Another Report
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
              <h3 className="text-white font-semibold mb-4">Report Information</h3>
              {selectedReportData && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Average generation time: 30-60 seconds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Reports are stored for 90 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Multiple export formats available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Reports */}
            <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {recentReports.map((report) => {
                  const ReportIcon = getReportIcon(report.type);
                  return (
                    <div key={report.id} className="p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <ReportIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-white text-sm font-medium truncate">{report.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{report.date}</span>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{report.size}</span>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Help */}
            <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Need Help?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Learn more about generating and customizing reports in our documentation.
              </p>
              <button className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all text-sm">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
