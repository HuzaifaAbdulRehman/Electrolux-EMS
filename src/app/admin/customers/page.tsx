'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  User,
  Zap,
  PieChart,
  Loader2,
  Save,
  X
} from 'lucide-react';

export default function AdminCustomers() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConnectionType, setFilterConnectionType] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]); // For statistics
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    connectionType: 'Residential'
  });

  // Fetch ALL customers for statistics ONCE on mount
  useEffect(() => {
    fetchAllCustomers();
  }, []);

  // Fetch filtered customers when search/filter/page changes
  useEffect(() => {
    fetchCustomers();
  }, [searchQuery, filterStatus, filterConnectionType, pagination.page]);

  const fetchAllCustomers = async () => {
    try {
      const response = await fetch('/api/customers?limit=1000');
      const result = await response.json();
      if (result.success) {
        setAllCustomers(result.data);
      }
    } catch (err) {
      console.error('Error fetching all customers:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch filtered results
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterConnectionType !== 'all') params.append('connectionType', filterConnectionType);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/customers?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setCustomers(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
          hasNext: result.pagination.page < result.pagination.totalPages,
          hasPrev: result.pagination.page > 1
        }));
      } else {
        setError(result.error || 'Failed to fetch customers');
      }
    } catch (err) {
      setError('Network error while fetching customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      if (response.ok) {
        await fetchCustomers(); // Refresh the list
        setShowAddCustomer(false);
        setNewCustomer({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          connectionType: 'Residential'
        });
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to create customer');
      }
    } catch (err) {
      setError('Network error while creating customer');
      console.error('Error creating customer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportCustomers = () => {
    if (customers.length === 0) {
      setError('No customers to export');
      return;
    }

    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'City', 'State', 'Pincode', 'Connection Type', 'Meter Number', 'Status', 'Outstanding Balance', 'Avg Monthly Usage'];
    const csvRows = [
      headers.join(','),
      ...customers.map(customer => [
        customer.id || '',
        `"${customer.fullName || ''}"`,
        customer.email || '',
        customer.phone || '',
        `"${customer.address || ''}"`,
        `"${customer.city || ''}"`,
        `"${customer.state || ''}"`,
        customer.pincode || '',
        customer.connectionType || '',
        customer.meterNumber || '',
        customer.status || 'active',
        customer.outstandingBalance || '0',
        customer.averageMonthlyUsage || '0'
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'Residential': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Commercial': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Industrial': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Agricultural': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage customer accounts and billing information</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={handleExportCustomers}
                disabled={loading || customers.length === 0}
                className="px-4 py-2 bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setShowAddCustomer(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: 'Total Customers',
              value: loading ? '...' : allCustomers.length.toString(),
              icon: Users,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              label: 'Active Customers',
              value: loading ? '...' : allCustomers.filter(c => c.status === 'active').length.toString(),
              icon: CheckCircle,
              color: 'from-green-500 to-emerald-500'
            },
            {
              label: 'Overdue Payments',
              value: loading ? '...' : allCustomers.filter(c => c.paymentStatus === 'overdue').length.toString(),
              icon: AlertCircle,
              color: 'from-red-500 to-rose-500'
            },
            {
              label: 'Total Outstanding',
              value: loading ? '...' : `Rs ${allCustomers.reduce((sum, c) => sum + (parseFloat(c.outstandingBalance) || 0), 0).toLocaleString()}`,
              icon: DollarSign,
              color: 'from-yellow-500 to-orange-500'
            },
            {
              label: 'Avg Monthly Usage',
              value: loading ? '...' : `${Math.round(allCustomers.reduce((sum, c) => sum + (parseFloat(c.averageMonthlyUsage) || 0), 0) / Math.max(allCustomers.length, 1))} kWh`, 
              icon: Activity, 
              color: 'from-purple-500 to-pink-500' 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Status</option>
                  <option value="active" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Active</option>
                  <option value="inactive" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Inactive</option>
                  <option value="suspended" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Suspended</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filterConnectionType}
                  onChange={(e) => setFilterConnectionType(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Types</option>
                  <option value="Residential" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Residential</option>
                  <option value="Commercial" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Commercial</option>
                  <option value="Industrial" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Industrial</option>
                  <option value="Agricultural" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Agricultural</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading customers...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Billing</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {customer.fullName?.charAt(0) || 'C'}
                              </span>
                            </div>
                            <div>
                              <p className="text-gray-900 dark:text-white font-medium">{customer.fullName}</p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">#{customer.accountNumber}</p>
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
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{customer.city}, {customer.state}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConnectionTypeColor(customer.connectionType)}`}>
                                {customer.connectionType}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Meter: {customer.meterNumber}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Avg: {customer.averageMonthlyUsage} kWh
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Outstanding</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Rs {parseFloat(customer.outstandingBalance || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Last Bill</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Rs {parseFloat(customer.lastBillAmount || 0).toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(customer.paymentStatus)}`}>
                                {customer.paymentStatus || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(customer.status)}`}>
                            <span className="capitalize">{customer.status || 'Unknown'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setSelectedCustomer(customer.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({...prev, page: prev.page - 1}))}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg hover:bg-gray-50 dark:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({...prev, page: prev.page + 1}))}
                        disabled={!pagination.hasNext}
                        className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg hover:bg-gray-50 dark:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {(() => {
                const customer = customers.find(c => c.id === selectedCustomer);
                if (!customer) return null;

                return (
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{customer.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="text-gray-900 dark:text-white">{customer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="text-gray-900 dark:text-white">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                          <p className="text-gray-900 dark:text-white">{customer.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">City, State</p>
                          <p className="text-gray-900 dark:text-white">{customer.city}, {customer.state}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Billing Information */}
                    <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Account Number</p>
                          <p className="text-gray-900 dark:text-white font-mono">{customer.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Meter Number</p>
                          <p className="text-gray-900 dark:text-white font-mono">{customer.meterNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Connection Type</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConnectionTypeColor(customer.connectionType)}`}>
                            {customer.connectionType}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(customer.paymentStatus)}`}>
                            {customer.paymentStatus || 'Unknown'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding Balance</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            Rs {parseFloat(customer.outstandingBalance || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Last Bill Amount</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            Rs {parseFloat(customer.lastBillAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Average Monthly Usage</p>
                          <p className="text-gray-900 dark:text-white">{customer.averageMonthlyUsage} kWh</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Connection Date</p>
                          <p className="text-gray-900 dark:text-white">{customer.connectionDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-white/10">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                        Edit Customer
                      </button>
                      <button 
                        onClick={() => router.push(`/customer/view-bills?customerId=${customer.id}`)}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:bg-white/20 transition-all"
                      >
                        View Bills
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Add Customer Modal */}
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Customer</h2>
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.fullName}
                    onChange={(e) => setNewCustomer({...newCustomer, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                  <textarea
                    required
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({...newCustomer, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.pincode}
                    onChange={(e) => setNewCustomer({...newCustomer, pincode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connection Type</label>
                  <select
                    required
                    value={newCustomer.connectionType}
                    onChange={(e) => setNewCustomer({...newCustomer, connectionType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Residential" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Residential</option>
                    <option value="Commercial" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Commercial</option>
                    <option value="Industrial" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Industrial</option>
                    <option value="Agricultural" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Agricultural</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-gray-200 dark:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Create Customer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
