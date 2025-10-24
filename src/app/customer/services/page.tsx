'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  MessageSquare,
  AlertTriangle,
  Wrench,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Calendar,
  User,
  ChevronRight,
  Activity
} from 'lucide-react';

export default function ServiceRequests() {
  const { data: session } = useSession();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleConfigureAlerts = () => {
    alert('⚡ Feature Coming Soon!\n\nOutage alert configuration will be available in a future update. For now, you can manage general notification preferences in Settings.');
  };

  // Fetch work orders from API
  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/work-orders');

      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }

      const result = await response.json();

      if (result.success) {
        setWorkOrders(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch work orders');
      }
    } catch (err: any) {
      console.error('Error fetching work orders:', err);
      setError(err.message || 'Failed to load work orders');
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Outage notifications (placeholder data for demonstration)
  const outageNotifications = [
    {
      id: 1,
      type: 'planned',
      area: 'North Zone - Sectors 1-5',
      date: '2024-10-15',
      time: '10:00 AM - 2:00 PM',
      reason: 'Maintenance work on transformer',
      affected: '450 customers',
      status: 'upcoming'
    },
    {
      id: 2,
      type: 'unplanned',
      area: 'East Zone - Main Street',
      date: '2024-10-10',
      time: '3:30 PM',
      reason: 'Equipment failure',
      affected: '120 customers',
      status: 'resolved',
      resolutionTime: '2 hours'
    },
    {
      id: 3,
      type: 'planned',
      area: 'West Zone - Industrial Area',
      date: '2024-10-20',
      time: '11:00 PM - 5:00 AM',
      reason: 'Grid upgradation',
      affected: '80 customers',
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getOutageTypeColor = (type: string) => {
    return type === 'planned'
      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      : 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  // Transform work orders to match expected format and filter
  const filteredRequests = workOrders.filter(workOrder => {
    const matchesSearch = (workOrder.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (workOrder.id || '').toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || workOrder.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
      <div className="h-full flex flex-col">
        {/* Header - Fixed height */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Service Center</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage service requests, complaints, and view outage notifications</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <a
                href="/customer/new-connection"
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2 font-medium text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>New Connection</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Area - Fills remaining space */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tabs */}
          <div className="flex space-x-1 bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-1 mb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            Service Requests
          </button>
          <button
            onClick={() => setActiveTab('outages')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'outages'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            Outage Notifications
          </button>
          </div>

          {/* Tab Content - Scrollable area */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeTab === 'requests' ? (
              <div className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Total Requests</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{workOrders.length}</p>
                      </div>
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">In Progress</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {workOrders.filter(w => w.status === 'in_progress').length}
                        </p>
                      </div>
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Completed</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {workOrders.filter(w => w.status === 'completed').length}
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Assigned</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {workOrders.filter(w => w.status === 'assigned').length}
                        </p>
                      </div>
                      <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search requests..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 font-medium"
                    >
                      <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Status</option>
                      <option value="assigned" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Assigned</option>
                      <option value="in_progress" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">In Progress</option>
                      <option value="completed" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Service Requests List */}
                <div className="space-y-3">
                  {loading && (
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-gray-200 dark:border-white/10 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading work orders...</p>
                    </div>
                  )}

                  {error && !loading && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                      <p className="text-red-400 font-semibold">{error}</p>
                      <button
                        onClick={fetchWorkOrders}
                        className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!loading && !error && filteredRequests.length === 0 && (
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-gray-200 dark:border-white/10 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-2">No work orders found</h3>
                      <p className="text-gray-600 dark:text-gray-400">You don't have any service requests yet.</p>
                    </div>
                  )}

                  {!loading && !error && filteredRequests.map((workOrder) => (
                    <div key={workOrder.id} className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-gray-300 dark:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            workOrder.workType === 'repair' ? 'bg-red-500/20' :
                            workOrder.workType === 'maintenance' ? 'bg-blue-500/20' :
                            workOrder.workType === 'inspection' ? 'bg-green-500/20' : 'bg-purple-500/20'
                          }`}>
                            {workOrder.workType === 'repair' ? <AlertTriangle className="w-5 h-5 text-red-400" /> :
                             <Wrench className="w-5 h-5 text-blue-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{workOrder.title}</h3>
                              <span className={`text-xs ${getPriorityColor(workOrder.priority)}`}>
                                {(workOrder.priority || 'medium').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">WO-{workOrder.id} • {workOrder.workType || 'General'}</p>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{workOrder.description || 'No description provided'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(workOrder.status)}`}>
                          {(workOrder.status || 'assigned').replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10">
                        <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{workOrder.assignedDate || 'N/A'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{workOrder.employeeName || 'Not assigned'}</span>
                          </span>
                          {workOrder.dueDate && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Due: {workOrder.dueDate}</span>
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedRequest(workOrder)}
                          className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all flex items-center space-x-1"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {workOrder.completionDate && (
                        <div className="mt-3 p-2 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Completed: {workOrder.completionDate}</p>
                          {workOrder.completionNotes && (
                            <p className="text-xs text-gray-700 dark:text-gray-300">{workOrder.completionNotes}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Outage Notifications Tab */
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Current Outages */}
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                      Current & Upcoming Outages
                    </h2>
                    <div className="space-y-3">
                      {outageNotifications.filter(o => o.status === 'upcoming').map((outage) => (
                        <div key={outage.id} className="p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getOutageTypeColor(outage.type)}`}>
                              {outage.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{outage.date}</span>
                          </div>
                          <h3 className="text-sm text-white font-semibold mb-1">{outage.area}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{outage.reason}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {outage.time}
                            </span>
                            <span className="text-yellow-400">
                              {outage.affected} affected
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outage Map/Statistics */}
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Outage Statistics</h2>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                          <p className="text-gray-600 dark:text-gray-400 text-xs">System Reliability</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">99.8%</p>
                          <p className="text-green-400 text-xs">This month</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg border border-red-500/20">
                          <p className="text-gray-600 dark:text-gray-400 text-xs">Avg. Restoration</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">2.5 hrs</p>
                          <p className="text-red-400 text-xs">Unplanned outages</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                        <h3 className="text-sm text-white font-semibold mb-2">Recent Resolutions</h3>
                        {outageNotifications.filter(o => o.status === 'resolved').map((outage) => (
                          <div key={outage.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10 last:border-0">
                            <div>
                              <p className="text-gray-900 dark:text-white text-xs">{outage.area}</p>
                              <p className="text-gray-600 dark:text-gray-400 text-xs">{outage.date} • Resolved in {outage.resolutionTime}</p>
                            </div>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outage Alert Settings */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Outage Alert Preferences</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Configure how you receive outage notifications</p>
                    </div>
                    <button 
                      onClick={handleConfigureAlerts}
                      className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
                    >
                      Configure Alerts
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work Order Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Order Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Work Order Info */}
                <div className="bg-white dark:bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedRequest.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>WO-{selectedRequest.id}</span>
                        <span>•</span>
                        <span>{selectedRequest.workType || 'General'}</span>
                        <span>•</span>
                        <span className={getPriorityColor(selectedRequest.priority)}>
                          {(selectedRequest.priority || 'medium').toUpperCase()} Priority
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedRequest.status)}`}>
                      {(selectedRequest.status || 'assigned').replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedRequest.description || 'No description provided'}</p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Assigned Date</p>
                      <p className="text-gray-900 dark:text-white">{selectedRequest.assignedDate || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Due Date</p>
                      <p className="text-gray-900 dark:text-white">{selectedRequest.dueDate || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Assigned To</p>
                      <p className="text-gray-900 dark:text-white">{selectedRequest.employeeName || 'Not assigned'}</p>
                    </div>
                    {selectedRequest.completionDate && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Date</p>
                        <p className="text-gray-900 dark:text-white">{selectedRequest.completionDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Notes */}
                {selectedRequest.completionNotes && (
                  <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Completion Notes
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedRequest.completionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
