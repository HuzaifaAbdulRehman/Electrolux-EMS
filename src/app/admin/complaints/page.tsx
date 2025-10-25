'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  RefreshCw,
  Assign,
  MessageCircle,
  Star,
  Flag
} from 'lucide-react';

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  workType: string;
  customerId: number;
  employeeId: number | null;
  assignedDate: string;
  dueDate: string;
  completionDate: string | null;
  completionNotes: string | null;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  employeeName: string | null;
}

export default function AdminComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    avgResolutionTime: 0
  });

  useEffect(() => {
    fetchComplaints();
    fetchEmployees();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/work-orders?workType=complaint_resolution&${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setComplaints(data.data || []);
        calculateStats(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch complaints');
      }
    } catch (err) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      if (data.success) {
        setAvailableEmployees(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const calculateStats = (complaintData: Complaint[]) => {
    const now = new Date();
    const total = complaintData.length;
    const pending = complaintData.filter(c => c.status === 'assigned').length;
    const inProgress = complaintData.filter(c => c.status === 'in_progress').length;
    const completed = complaintData.filter(c => c.status === 'completed').length;
    const overdue = complaintData.filter(c => {
      if (c.status === 'completed') return false;
      return new Date(c.dueDate) < now;
    }).length;

    // Calculate average resolution time for completed complaints
    const completedComplaints = complaintData.filter(c => c.status === 'completed' && c.completionDate);
    let avgResolutionTime = 0;
    if (completedComplaints.length > 0) {
      const totalHours = completedComplaints.reduce((sum, c) => {
        const created = new Date(c.createdAt);
        const completed = new Date(c.completionDate!);
        return sum + (completed.getTime() - created.getTime()) / (1000 * 60 * 60);
      }, 0);
      avgResolutionTime = Math.round(totalHours / completedComplaints.length);
    }

    setStats({
      total,
      pending,
      inProgress,
      completed,
      overdue,
      avgResolutionTime
    });
  };

  const handleAssignComplaint = async () => {
    if (!selectedComplaint || !selectedEmployee) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/work-orders/${selectedComplaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          status: 'assigned'
        })
      });

      if (response.ok) {
        setShowAssignModal(false);
        setSelectedComplaint(null);
        setSelectedEmployee(null);
        fetchComplaints();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign complaint');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteComplaint = async () => {
    if (!selectedComplaint) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/work-orders/${selectedComplaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          completionNotes: completionNotes
        })
      });

      if (response.ok) {
        setShowDetailsModal(false);
        setSelectedComplaint(null);
        setCompletionNotes('');
        fetchComplaints();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete complaint');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Flag className="w-3 h-3" />;
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer complaints and feedback</p>
          </div>
          <button
            onClick={fetchComplaints}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgResolutionTime}h</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {complaint.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {complaint.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {complaint.customerName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {complaint.customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(complaint.priority)}`}>
                          {getPriorityIcon(complaint.priority)}
                          <span className="ml-1">{complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {complaint.employeeName || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(complaint.dueDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {complaint.status === 'assigned' && !complaint.employeeId && (
                            <button
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowAssignModal(true);
                              }}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <Assign className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Complaints Found</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No complaints match your search criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Modal */}
        {showAssignModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Assign Complaint
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedComplaint.title}
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign to Employee
                </label>
                <select
                  value={selectedEmployee || ''}
                  onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Employee</option>
                  {availableEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAssignComplaint}
                  disabled={!selectedEmployee || isProcessing}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Assigning...' : 'Assign'}
                </button>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedComplaint(null);
                    setSelectedEmployee(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Complaint Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedComplaint.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(selectedComplaint.priority)}`}>
                      {getPriorityIcon(selectedComplaint.priority)}
                      <span className="ml-1">{selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Information</label>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-white"><strong>Name:</strong> {selectedComplaint.customerName}</p>
                    <p className="text-sm text-gray-900 dark:text-white"><strong>Phone:</strong> {selectedComplaint.customerPhone}</p>
                    <p className="text-sm text-gray-900 dark:text-white"><strong>Email:</strong> {selectedComplaint.customerEmail}</p>
                    <p className="text-sm text-gray-900 dark:text-white"><strong>Address:</strong> {selectedComplaint.customerAddress}</p>
                  </div>
                </div>

                {selectedComplaint.employeeName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Employee</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedComplaint.employeeName}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
                    <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                    <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedComplaint.dueDate).toLocaleString()}</p>
                  </div>
                </div>

                {selectedComplaint.completionNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Completion Notes</label>
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{selectedComplaint.completionNotes}</p>
                  </div>
                )}

                {selectedComplaint.status !== 'completed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Completion Notes
                    </label>
                    <textarea
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter resolution details..."
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                {selectedComplaint.status !== 'completed' && (
                  <button
                    onClick={handleCompleteComplaint}
                    disabled={isProcessing}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Completing...' : 'Mark as Completed'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedComplaint(null);
                    setCompletionNotes('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
