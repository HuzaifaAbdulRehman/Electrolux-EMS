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
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Zap,
  DollarSign,
  AlertCircle,
  Check,
  X,
  Calendar as CalendarIcon,
  UserPlus,
  Wrench,
  Loader2
} from 'lucide-react';

export default function AdminConnectionRequests() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [estimatedCharges, setEstimatedCharges] = useState<string>('');
  const [inspectionDate, setInspectionDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch connection requests from API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        search: searchQuery,
        status: filterStatus,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      console.log('[Admin Connection Requests] Fetching requests with params:', params.toString());
      const response = await fetch(`/api/admin/connection-requests?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch connection requests');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API returned error');
      }

      setRequests(result.data.requests);
      setPagination(result.data.pagination);
      setStatusStats(result.data.statusStats);
      setAvailableEmployees(result.data.availableEmployees);
      
      console.log('[Admin Connection Requests] Requests fetched successfully:', {
        count: result.data.requests.length,
        total: result.data.pagination.total
      });
    } catch (err: any) {
      console.error('[Admin Connection Requests] Error fetching requests:', err);
      setError(err.message || 'Failed to load connection requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [searchQuery, filterStatus, pagination.page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchRequests();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleAction = (request: any, action: string) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowActionModal(true);
    setEstimatedCharges(request.estimatedCharges || '');
    setInspectionDate(request.inspectionDate || '');
    setNotes('');
    setSelectedEmployee(null);
  };

  const handleProcessAction = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      console.log('[Admin Connection Requests] Processing action:', { 
        requestId: selectedRequest.id, 
        action: actionType,
        employeeId: selectedEmployee 
      });

      const response = await fetch('/api/admin/connection-requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          action: actionType,
          employeeId: selectedEmployee,
          estimatedCharges: estimatedCharges ? parseFloat(estimatedCharges) : null,
          inspectionDate: inspectionDate || null,
          notes: notes || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process request');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API returned error');
      }

      console.log('[Admin Connection Requests] Action processed successfully');
      setShowActionModal(false);
      setSelectedRequest(null);
      fetchRequests(); // Refresh the list
      
    } catch (err: any) {
      console.error('[Admin Connection Requests] Error processing action:', err);
      setError(err.message || 'Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'connected': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'connected': return <Zap className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="admin" userName="Admin">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-red-400 font-semibold">Error Loading Connection Requests</h3>
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connection Requests</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage new connection applications</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(statusStats).map(([status, count]) => (
            <div key={status} className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status.replace('_', ' ')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, application number, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="connected">Connected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Connection Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.applicationNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.connectionType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.applicantName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {request.propertyAddress}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.city}, {request.state}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Load: {request.loadRequired} kW
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(request, 'schedule_inspection')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <CalendarIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(request, 'approve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(request, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleAction(request, 'complete_installation')}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 dark:bg-white/10 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-white/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-white/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Modal */}
        {showActionModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-white/10 backdrop-blur-xl rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {actionType === 'approve' && 'Approve Connection Request'}
                {actionType === 'reject' && 'Reject Connection Request'}
                {actionType === 'schedule_inspection' && 'Schedule Inspection'}
                {actionType === 'complete_installation' && 'Complete Installation'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Application: {selectedRequest.applicationNumber}
                  </label>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Applicant: {selectedRequest.applicantName}
                  </label>
                </div>

                {actionType === 'approve' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Assign Employee
                      </label>
                      <select
                        value={selectedEmployee || ''}
                        onChange={(e) => setSelectedEmployee(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Employee</option>
                        {availableEmployees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.fullName} ({emp.department}) - {emp.workLoad} active tasks
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estimated Charges
                      </label>
                      <input
                        type="number"
                        value={estimatedCharges}
                        onChange={(e) => setEstimatedCharges(e.target.value)}
                        placeholder="Enter estimated charges"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {actionType === 'schedule_inspection' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Inspection Date
                    </label>
                    <input
                      type="date"
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {(actionType === 'reject' || actionType === 'complete_installation') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter notes or comments"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessAction}
                  disabled={isProcessing || (actionType === 'approve' && !selectedEmployee)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {actionType === 'approve' && 'Approve'}
                    {actionType === 'reject' && 'Reject'}
                    {actionType === 'schedule_inspection' && 'Schedule'}
                    {actionType === 'complete_installation' && 'Complete'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
