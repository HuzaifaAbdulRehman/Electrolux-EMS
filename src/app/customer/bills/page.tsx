'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FileText,
  Download,
  Eye,
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
  CreditCard
} from 'lucide-react';

export default function BillHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      paymentMethod: 'Online Banking'
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

  return (
    <DashboardLayout userType="customer" userName="John Doe">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bill History</h1>
              <p className="text-gray-600 dark:text-gray-400">View and download your past electricity bills</p>
            </div>
            <button className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2">
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
              className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 text-sm"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
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
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg transition-all" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg transition-all" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg transition-all" title="Print">
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

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-8 border border-yellow-400/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Analytics Coming Soon
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Consumption trends, payment method analytics, and detailed bill breakdowns with charts will be available soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
