'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FileText,
  Download,
  Printer,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Activity,
  ArrowUp,
  ArrowDown,
  CreditCard,
  X,
  Zap,
  Calendar
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BillHistory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const handleViewBill = (billId: string) => {
    router.push(`/customer/bill-view?id=${billId}`);
  };

  const handleDownloadAll = () => {
    // TODO: Implement bulk download functionality
    console.log('Download all bills');
  };

  const handleDownloadPDF = (billId: string) => {
    // TODO: Implement individual PDF download
    console.log('Download PDF for bill:', billId);
  };

  const handlePrintBill = (billId: string) => {
    router.push(`/customer/bill-view?id=${billId}&print=true`);
  };

  const billHistory = [
    {
      id: 1,
      billNumber: 'BILL-202410-001234',
      month: 'October 2024',
      issueDate: '2024-10-01',
      dueDate: '2024-10-15',
      units: 460,
      amount: 245.50,
      status: 'paid',
      paidDate: '2024-10-05',
      paymentMethod: 'Online Banking',
      breakdown: {
        baseAmount: 184.00,
        fixedCharges: 25.00,
        electricityDuty: 10.45, // 5% of base + fixed
        gst: 39.50, // 18% of base + fixed + duty
        totalAmount: 258.95,
        tariffSlabs: [
          { units: 100, rate: 3.50, amount: 350.00 },
          { units: 200, rate: 4.00, amount: 800.00 },
          { units: 160, rate: 5.00, amount: 800.00 }
        ]
      }
    },
    {
      id: 2,
      billNumber: 'BILL-202409-001234',
      month: 'September 2024',
      issueDate: '2024-09-01',
      dueDate: '2024-09-15',
      units: 420,
      amount: 220.00,
      status: 'paid',
      paidDate: '2024-09-12',
      paymentMethod: 'Credit Card'
    },
    {
      id: 3,
      billNumber: 'BILL-202408-001234',
      month: 'August 2024',
      issueDate: '2024-08-01',
      dueDate: '2024-08-15',
      units: 485,
      amount: 258.75,
      status: 'paid',
      paidDate: '2024-08-14',
      paymentMethod: 'Payment Center'
    },
    {
      id: 4,
      billNumber: 'BILL-202407-001234',
      month: 'July 2024',
      issueDate: '2024-07-01',
      dueDate: '2024-07-15',
      units: 510,
      amount: 275.00,
      status: 'paid',
      paidDate: '2024-07-18',
      paymentMethod: 'Online Banking'
    },
    {
      id: 5,
      billNumber: 'BILL-202406-001234',
      month: 'June 2024',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      units: 380,
      amount: 195.50,
      status: 'paid',
      paidDate: '2024-06-10',
      paymentMethod: 'Auto Debit'
    }
  ];

  const totalAmount = billHistory.reduce((sum, bill) => sum + bill.amount, 0);
  const avgConsumption = Math.round(billHistory.reduce((sum, bill) => sum + bill.units, 0) / billHistory.length);
  const totalUnits = billHistory.reduce((sum, bill) => sum + bill.units, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBills = billHistory.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.month.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Billing Trend Bar Chart Data - Like Local Electricity Company
  const billingTrendData = {
    labels: billHistory.map(b => b.month.split(' ')[0]).reverse(),
    datasets: [
      {
        label: 'Usage (kWh)',
        data: billHistory.map(b => b.units).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y',
      },
      {
        label: 'Amount ($)',
        data: billHistory.map(b => b.amount).reverse(),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y1',
      }
    ]
  };

  // Payment Method Distribution
  const paymentMethodData = {
    labels: ['Online Banking', 'Credit Card', 'Auto Debit', 'Payment Center'],
    datasets: [
      {
        data: [40, 20, 20, 20],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Monthly Comparison Bar Chart
  const monthlyComparisonData = {
    labels: billHistory.map(b => b.month.split(' ')[0]).reverse(),
    datasets: [
      {
        label: 'Bill Amount ($)',
        data: billHistory.map(b => b.amount).reverse(),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderWidth: 0
      }
    ]
  };

  return (
    <DashboardLayout userType="customer" userName="Huzaifa">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bill History</h1>
              <p className="text-gray-600 dark:text-gray-400">View and download your past electricity bills</p>
            </div>
            <button 
              onClick={handleDownloadAll}
              className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">6 months</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Average</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Consumption</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgConsumption} kWh</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Units Consumed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUnits} kWh</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">On-time</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Payment Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
          </div>
        </div>

        {/* Professional Billing Analytics - Single Clean Chart */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Billing & Usage Trend Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">6-month historical comparison</p>
            </div>
          </div>
          <div className="h-80">
            <Bar
              data={billingTrendData}
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
                    position: 'top',
                    labels: {
                      color: 'rgba(156, 163, 175, 0.8)',
                      padding: 20,
                      usePointStyle: true,
                      font: { size: 13 }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' as const },
                    bodyFont: { size: 13 },
                    bodySpacing: 6
                  }
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Usage (kWh)',
                      color: 'rgb(59, 130, 246)',
                      font: { size: 12, weight: 'bold' as const }
                    },
                    grid: { color: 'rgba(156, 163, 175, 0.1)' },
                    ticks: {
                      color: 'rgb(59, 130, 246)',
                      font: { size: 11 }
                    },
                    beginAtZero: true
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Bill Amount ($)',
                      color: 'rgb(251, 191, 36)',
                      font: { size: 12, weight: 'bold' as const }
                    },
                    grid: { drawOnChartArea: false },
                    ticks: {
                      color: 'rgb(251, 191, 36)',
                      font: { size: 11 },
                      callback: function(value: any) {
                        return '$' + value;
                      }
                    },
                    beginAtZero: true
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(156, 163, 175, 0.8)', font: { size: 12 } }
                  }
                }
              }}
            />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lowest Bill</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">$195.50</p>
              <p className="text-xs text-green-400">June 2024</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl border border-red-500/20 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Highest Bill</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">$275.00</p>
              <p className="text-xs text-red-400">July 2024</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average Bill</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${(totalAmount / billHistory.length).toFixed(2)}</p>
              <p className="text-xs text-blue-400">Last 6 months</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bills..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 text-sm font-medium"
            >
              <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Status</option>
              <option value="paid" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Paid</option>
              <option value="pending" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Pending</option>
              <option value="overdue" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Overdue</option>
            </select>
          </div>
        </div>

        {/* Bills Table */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white dark:bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Bill Period</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Bill Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Usage</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-white dark:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{bill.month}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Due: {bill.dueDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{bill.billNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{bill.units} kWh</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                          {bill.units > avgConsumption ? (
                            <>
                              <ArrowUp className="w-3 h-3 text-red-400 mr-1" />
                              <span className="text-red-400">Above avg</span>
                            </>
                          ) : (
                            <>
                              <ArrowDown className="w-3 h-3 text-green-400 mr-1" />
                              <span className="text-green-400">Below avg</span>
                            </>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold">${bill.amount.toFixed(2)}</p>
                        {bill.paidDate && (
                          <p className="text-gray-600 dark:text-gray-400 text-xs">Paid: {bill.paidDate}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.status)}`}>
                        {getStatusIcon(bill.status)}
                        <span className="capitalize">{bill.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all border border-blue-200 dark:border-blue-500/30"
                          aria-label="View bill details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handlePrintBill(bill.id.toString())}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-all"
                          title="Print Bill"
                          aria-label="Print bill"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill Details Modal */}
        {selectedBill && selectedBill.breakdown && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Bill Details</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedBill.billNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Bill Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Billing Period</p>
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedBill.month}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Due Date</p>
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedBill.dueDate}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Units Consumed</p>
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedBill.units} kWh</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(selectedBill.status)}
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Status</p>
                    </div>
                    <p className={`font-semibold capitalize ${
                      selectedBill.status === 'paid' ? 'text-green-400' :
                      selectedBill.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {selectedBill.status}
                    </p>
                  </div>
                </div>

                {/* Tariff Slab Breakdown */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tariff Slab Breakdown</h3>
                  <div className="space-y-3">
                    {selectedBill.breakdown.tariffSlabs.map((slab: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-semibold">{slab.units} kWh</p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">@ ₹{slab.rate}/kWh</p>
                          </div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-bold">₹{slab.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Charges Breakdown */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Charges Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">Base Amount (Energy Charges)</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.baseAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">Fixed Charges</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.fixedCharges.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">Electricity Duty (5%)</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.electricityDuty.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">GST (18%)</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.gst.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-3 pt-4 border-t-2 border-gray-300 dark:border-white/20">
                      <p className="text-gray-900 dark:text-white font-bold text-lg">Total Amount</p>
                      <p className="text-yellow-400 font-bold text-2xl">₹{selectedBill.breakdown.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info (if paid) */}
                {selectedBill.status === 'paid' && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-500/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-bold text-white">Payment Received</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Payment Date</p>
                        <p className="text-white font-semibold">{selectedBill.paidDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Payment Method</p>
                        <p className="text-white font-semibold">{selectedBill.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* View Full Bill Button */}
                  <button
                    onClick={() => handleViewBill(selectedBill.id.toString())}
                    className="px-5 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-semibold flex items-center justify-center gap-2.5 group"
                    aria-label="View full bill details"
                  >
                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>View Bill</span>
                  </button>

                  {/* Download PDF Button */}
                  <button
                    onClick={() => handleDownloadPDF(selectedBill.id)}
                    className="px-5 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:from-yellow-500 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 font-semibold flex items-center justify-center gap-2.5 group"
                    aria-label="Download bill as PDF"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    <span>Download</span>
                  </button>

                  {/* Print Bill Button */}
                  <button
                    onClick={() => handlePrintBill(selectedBill.id)}
                    className="px-5 py-3.5 bg-white dark:bg-white/10 border-2 border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 hover:border-gray-400 dark:hover:border-white/30 hover:shadow-md transition-all duration-200 font-semibold flex items-center justify-center gap-2.5 group"
                    aria-label="Print bill"
                  >
                    <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
