'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  User,
  Calendar,
  Zap,
  Send,
  AlertCircle,
  Filter,
  Download,
  Eye,
  X
} from 'lucide-react';

interface BillRequest {
  id: number;
  requestId: string;
  customerId: number;
  customerName: string;
  accountNumber: string;
  billingMonth: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  meterReading?: {
    previous: number;
    current: number;
    consumption: number;
  };
}

export default function EmployeeBillGeneration() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<BillRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock bill requests data
  const billRequests: BillRequest[] = [
    {
      id: 1,
      requestId: 'REQ-2024-0001',
      customerId: 1,
      customerName: 'John Doe',
      accountNumber: 'ELX-2024-001234',
      billingMonth: 'October 2024',
      requestDate: '2024-10-10',
      status: 'pending',
      priority: 'high',
      notes: 'Customer needs urgent bill for loan application',
      meterReading: {
        previous: 12485,
        current: 12945,
        consumption: 460
      }
    },
    {
      id: 2,
      requestId: 'REQ-2024-0002',
      customerId: 2,
      customerName: 'Sarah Smith',
      accountNumber: 'ELX-2024-001235',
      billingMonth: 'October 2024',
      requestDate: '2024-10-09',
      status: 'pending',
      priority: 'medium',
      meterReading: {
        previous: 10230,
        current: 10650,
        consumption: 420
      }
    },
    {
      id: 3,
      requestId: 'REQ-2024-0003',
      customerId: 3,
      customerName: 'Mike Johnson',
      accountNumber: 'ELX-2024-001236',
      billingMonth: 'September 2024',
      requestDate: '2024-10-08',
      status: 'completed',
      priority: 'low'
    },
    {
      id: 4,
      requestId: 'REQ-2024-0004',
      customerId: 4,
      customerName: 'Emily Davis',
      accountNumber: 'ELX-2024-001237',
      billingMonth: 'October 2024',
      requestDate: '2024-10-09',
      status: 'pending',
      priority: 'high',
      notes: 'Urgent - Customer moving abroad',
      meterReading: {
        previous: 8900,
        current: 9400,
        consumption: 500
      }
    }
  ];

  const pendingRequests = billRequests.filter(req =>
    req.status === 'pending' || req.status === 'processing'
  );

  const completedRequests = billRequests.filter(req =>
    req.status === 'completed' || req.status === 'rejected'
  );

  const filteredRequests = (activeTab === 'pending' ? pendingRequests : completedRequests).filter(req => {
    const matchesSearch = req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.requestId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const stats = {
    pending: pendingRequests.length,
    completed: completedRequests.length,
    high: billRequests.filter(r => r.priority === 'high' && r.status === 'pending').length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleGenerateBill = async (request: BillRequest) => {
    setIsProcessing(true);

    try {
      // API call to generate bill
      const response = await fetch('/api/bills/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: request.customerId,
          billingMonth: request.billingMonth,
          requestId: request.requestId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Bill generated successfully!\nBill Number: ${data.bill.bill_number}\nTotal Amount: ₹${data.bill.total_amount}`);
        setSelectedRequest(null);
      } else {
        alert(data.error || 'Failed to generate bill');
      }
    } catch (error) {
      console.error('Bill generation error:', error);
      alert('Failed to generate bill. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout userType="employee" userName="Mike Johnson">
      <div className="max-w-[1920px] mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bill Generation</h1>
              <p className="text-gray-600 dark:text-gray-400">Process customer bill requests and generate bills</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">Pending Requests</p>
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Waiting for processing</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">Completed Today</p>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bills generated & sent</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">High Priority</p>
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.high}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Urgent requests</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          {/* Tabs */}
          <div className="flex items-center space-x-2 mb-6 p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'completed'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, account number, or request ID..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-green-400 font-medium"
                >
                  <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Priority</option>
                  <option value="high" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">High</option>
                  <option value="medium" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Medium</option>
                  <option value="low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bill Requests Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Billing Month</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Request Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.requestId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.customerName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{request.accountNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">{request.billingMonth}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{request.requestDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                            title="Generate Bill"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {request.status === 'completed' && (
                          <button
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="View Bill"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">No bill requests found</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'All requests have been processed'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generate Bill Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Bill</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{selectedRequest.requestId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Name</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedRequest.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Account Number</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedRequest.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Billing Month</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedRequest.billingMonth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Priority</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {selectedRequest.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Customer Notes</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>

                {/* Meter Reading Info */}
                {selectedRequest.meterReading && (
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Meter Reading Status</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Previous</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedRequest.meterReading.previous.toLocaleString()} kWh</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedRequest.meterReading.current.toLocaleString()} kWh</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Consumption</p>
                            <p className="text-lg font-bold text-green-400">{selectedRequest.meterReading.consumption} kWh</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Message */}
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Before You Generate</h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Verify meter reading is accurate</li>
                        <li>• Bill will be automatically sent to customer</li>
                        <li>• Customer will receive notification via email and SMS</li>
                        <li>• This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleGenerateBill(selectedRequest)}
                    disabled={isProcessing}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl transition-all font-semibold flex items-center justify-center space-x-2 ${
                      isProcessing
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg hover:shadow-green-500/50'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Generate & Send Bill</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all font-semibold"
                  >
                    Cancel
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
