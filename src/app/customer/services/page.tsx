'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  MessageSquare,
  Plus,
  AlertTriangle,
  Wrench,
  FileQuestion,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Search,
  Calendar,
  User,
  ChevronRight,
  MessageCircle,
  Activity
} from 'lucide-react';

export default function ServiceRequests() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('requests');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleConfigureAlerts = () => {
    router.push('/customer/settings');
  };

  const [newRequest, setNewRequest] = useState({
    type: '',
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    attachment: false
  });

  // Mock service requests data
  const serviceRequests = [
    {
      id: 'SR-2024-001',
      type: 'complaint',
      category: 'Billing Issue',
      subject: 'Incorrect bill amount for October',
      description: 'My bill shows 600 kWh but my meter reading is only 460 kWh',
      status: 'in-progress',
      priority: 'high',
      createdDate: '2024-10-08',
      assignedTo: 'Billing Department',
      lastUpdate: '2 hours ago',
      responses: [
        {
          from: 'Support Team',
          message: 'We are investigating your meter reading discrepancy.',
          time: '2 hours ago'
        }
      ]
    },
    {
      id: 'SR-2024-002',
      type: 'service',
      category: 'Meter Problem',
      subject: 'Meter display not working',
      description: 'The digital display on my meter is blank',
      status: 'pending',
      priority: 'medium',
      createdDate: '2024-10-07',
      assignedTo: 'Technical Team',
      lastUpdate: '1 day ago',
      responses: []
    },
    {
      id: 'SR-2024-003',
      type: 'inquiry',
      category: 'Connection',
      subject: 'New connection for second property',
      description: 'I need a new electricity connection for my rental property',
      status: 'resolved',
      priority: 'low',
      createdDate: '2024-10-05',
      assignedTo: 'Customer Service',
      lastUpdate: '3 days ago',
      resolution: 'Application form sent via email. Please submit with required documents.',
      responses: [
        {
          from: 'Customer Service',
          message: 'Thank you for your inquiry. We have sent the application form to your email.',
          time: '3 days ago'
        }
      ]
    },
    {
      id: 'SR-2024-004',
      type: 'complaint',
      category: 'Power Quality',
      subject: 'Frequent voltage fluctuations',
      description: 'Experiencing voltage fluctuations multiple times daily',
      status: 'assigned',
      priority: 'high',
      createdDate: '2024-10-06',
      assignedTo: 'Field Team',
      lastUpdate: '5 hours ago',
      responses: [
        {
          from: 'Technical Team',
          message: 'Field team scheduled to visit tomorrow between 10 AM - 12 PM.',
          time: '5 hours ago'
        }
      ]
    }
  ];

  // Outage notifications
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

  const requestCategories = {
    complaint: ['Billing Issue', 'Meter Problem', 'Power Quality', 'Service Issue', 'Other'],
    service: ['New Connection', 'Disconnection', 'Load Change', 'Meter Relocation', 'Name Change'],
    inquiry: ['Tariff Information', 'Payment Options', 'Energy Saving Tips', 'General Query']
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'closed': return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
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

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSubmitRequest = () => {
    console.log('Submitting request:', newRequest);
    setShowNewRequest(false);
    // Reset form
    setNewRequest({
      type: '',
      category: '',
      subject: '',
      description: '',
      priority: 'medium',
      attachment: false
    });
  };

  return (
    <DashboardLayout userType="customer" userName="Huzaifa">
      <div className="h-full flex flex-col">
        {/* Header - Fixed height */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Service Center</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage service requests, complaints, and view outage notifications</p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-2">
              <a
                href="/customer/new-connection"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center space-x-2 font-medium text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>New Connection</span>
              </a>
              <button
                onClick={() => setShowNewRequest(true)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2 font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Service Request</span>
              </button>
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
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{serviceRequests.length}</p>
                      </div>
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">In Progress</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {serviceRequests.filter(r => r.status === 'in-progress').length}
                        </p>
                      </div>
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Resolved</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {serviceRequests.filter(r => r.status === 'resolved').length}
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Avg. Response</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">4 hrs</p>
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
                      <option value="pending" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Pending</option>
                      <option value="assigned" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Assigned</option>
                      <option value="in-progress" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">In Progress</option>
                      <option value="resolved" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Service Requests List */}
                <div className="space-y-3">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-gray-300 dark:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            request.type === 'complaint' ? 'bg-red-500/20' :
                            request.type === 'service' ? 'bg-blue-500/20' : 'bg-green-500/20'
                          }`}>
                            {request.type === 'complaint' ? <AlertTriangle className="w-5 h-5 text-red-400" /> :
                             request.type === 'service' ? <Wrench className="w-5 h-5 text-blue-400" /> :
                             <FileQuestion className="w-5 h-5 text-green-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{request.subject}</h3>
                              <span className={`text-xs ${getPriorityColor(request.priority)}`}>
                                {request.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{request.id} • {request.category}</p>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{request.description}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                          {request.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10">
                        <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{request.createdDate}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{request.assignedTo}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Updated {request.lastUpdate}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all flex items-center space-x-1"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {request.responses.length > 0 && (
                        <div className="mt-3 p-2 bg-white dark:bg-white/5 rounded-lg border-l-4 border-blue-500">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Latest Response:</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">{request.responses[0].message}</p>
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

        {/* New Request Modal */}
        {showNewRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Request</h2>

              <form className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Request Type *</label>
                  <select
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value, category: '' })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors font-medium"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Select Type</option>
                    <option value="complaint" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Complaint</option>
                    <option value="service" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Service Request</option>
                    <option value="inquiry" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">General Inquiry</option>
                  </select>
                </div>

                {newRequest.type && (
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Category *</label>
                    <select
                      value={newRequest.category}
                      onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors font-medium"
                    >
                      <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Select Category</option>
                      {requestCategories[newRequest.type as keyof typeof requestCategories]?.map((cat) => (
                        <option key={cat} value={cat} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Subject *</label>
                  <input
                    type="text"
                    value={newRequest.subject}
                    onChange={(e) => setNewRequest({ ...newRequest, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Brief description of your request"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Description *</label>
                  <textarea
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    rows={4}
                    placeholder="Provide detailed information about your request..."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors font-medium"
                  >
                    <option value="low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Low</option>
                    <option value="medium" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Medium</option>
                    <option value="high" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">High</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRequest.attachment}
                      onChange={(e) => setNewRequest({ ...newRequest, attachment: e.target.checked })}
                      className="w-5 h-5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-yellow-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">I have documents to attach</span>
                  </label>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewRequest(false)}
                    className="flex-1 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitRequest}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Request Info */}
                <div className="bg-white dark:bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedRequest.subject}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{selectedRequest.id}</span>
                        <span>•</span>
                        <span>{selectedRequest.category}</span>
                        <span>•</span>
                        <span className={getPriorityColor(selectedRequest.priority)}>
                          {selectedRequest.priority.toUpperCase()} Priority
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('-', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedRequest.description}</p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Created Date</p>
                      <p className="text-gray-900 dark:text-white">{selectedRequest.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Assigned To</p>
                      <p className="text-gray-900 dark:text-white">{selectedRequest.assignedTo}</p>
                    </div>
                  </div>
                </div>

                {/* Response Thread */}
                {selectedRequest.responses.length > 0 && (
                  <div className="bg-white dark:bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Thread</h3>
                    <div className="space-y-3">
                      {selectedRequest.responses.map((response: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-medium">{response.from}</span>
                              <span className="text-gray-500 text-xs">{response.time}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{response.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Response */}
                {selectedRequest.status !== 'resolved' && (
                  <div className="bg-white dark:bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Response</h3>
                    <textarea
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                      rows={3}
                      placeholder="Type your message..."
                    />
                    <button className="mt-3 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
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
