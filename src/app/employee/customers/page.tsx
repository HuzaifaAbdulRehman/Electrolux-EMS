'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  FileText,
  Zap,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Activity,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function EmployeeCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock customer data
  const customers = [
    {
      id: 1,
      accountNumber: 'ELX-2024-001234',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '1234567890',
      address: '123 Main Street, Apt 4B',
      meterNumber: 'MTR-485729',
      status: 'active',
      lastReading: 12485,
      lastBill: 245.50,
      avgConsumption: 450,
      connectionDate: '2022-01-15'
    },
    {
      id: 2,
      accountNumber: 'ELX-2024-001235',
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '9876543210',
      address: '456 Oak Avenue',
      meterNumber: 'MTR-485730',
      status: 'active',
      lastReading: 8942,
      lastBill: 189.30,
      avgConsumption: 380,
      connectionDate: '2021-08-20'
    },
    {
      id: 3,
      accountNumber: 'ELX-2024-001236',
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '5551234567',
      address: '789 Pine Road',
      meterNumber: 'MTR-485731',
      status: 'overdue',
      lastReading: 15623,
      lastBill: 312.75,
      avgConsumption: 625,
      connectionDate: '2020-03-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.accountNumber.includes(searchQuery) ||
    customer.meterNumber.includes(searchQuery)) &&
    (selectedFilter === 'all' || customer.status === selectedFilter)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout userType="employee" userName="Mike Johnson">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Database</h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage customer information</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Customers', value: '9,847', icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active', value: '9,234', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'Overdue Bills', value: '156', icon: AlertCircle, color: 'from-red-500 to-rose-500' },
            { label: 'Avg Consumption', value: '438 kWh', icon: Activity, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-gray-900 dark:text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, account, or meter number..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 border-b border-gray-200 dark:border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Meter Info</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Usage</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white dark:bg-white dark:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{customer.name}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{customer.accountNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{customer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{customer.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-900 dark:text-white">{customer.meterNumber}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Reading: {customer.lastReading} kWh</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold">{customer.avgConsumption} kWh/mo</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Last Bill: ${customer.lastBill}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(customer.status)}`}>
                        <span className="capitalize">{customer.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-white dark:bg-white dark:bg-white/5 border-t border-gray-200 dark:border-gray-200 dark:border-white/10 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-gray-900 dark:text-white">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
