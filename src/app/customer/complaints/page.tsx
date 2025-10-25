'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Paperclip,
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  ChevronRight,
  MessageCircle,
  User,
  Calendar,
  Tag,
  TrendingUp
} from 'lucide-react';

export default function ComplaintsFeedback() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('complaints');
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for new complaint
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  // Complaint categories for better organization
  const complaintCategories = [
    { value: 'billing', label: 'Billing Issues', icon: '💳' },
    { value: 'service', label: 'Service Quality', icon: '⚡' },
    { value: 'technical', label: 'Technical Problems', icon: '🔧' },
    { value: 'outage', label: 'Power Outage', icon: '⚡' },
    { value: 'connection', label: 'Connection Issues', icon: '🔌' },
    { value: 'meter', label: 'Meter Reading', icon: '📊' },
    { value: 'payment', label: 'Payment Problems', icon: '💰' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  // Fetch complaints (work orders with type='complaint_resolution') from API
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/work-orders');

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const result = await response.json();

      if (result.success) {
        // Filter only complaint_resolution work orders
        const complaintOrders = (result.data || []).filter(
          (order: any) => order.workType === 'complaint_resolution'
        );
        setComplaints(complaintOrders);
      } else {
        throw new Error(result.error || 'Failed to fetch complaints');
      }
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      setError(err.message || 'Failed to load complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'assigned': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'cancelled': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Create work order with type 'complaint_resolution'
      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workType: 'complaint_resolution',
          title: formData.subject,
          description: `Category: ${formData.category}\n\n${formData.description}`,
          priority: formData.priority,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const result = await response.json();

      if (result.success) {
        // Success - refresh complaints list
        await fetchComplaints();
        setShowNewComplaint(false);
        setFormData({
          category: '',
          subject: '',
          description: '',
          priority: 'medium',
        });
        alert('✅ Complaint submitted successfully! We will review it shortly.');
      } else {
        throw new Error(result.error || 'Failed to submit complaint');
      }
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      alert(`❌ Error: ${err.message || 'Failed to submit complaint'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Complaints & Feedback
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Submit and track your complaints, provide feedback about our services
              </p>
            </div>
            <button
              onClick={() => setShowNewComplaint(true)}
              className="mt-4 sm:mt-0 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Complaint</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{complaints.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Complaints</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {complaints.filter(c => c.status === 'in_progress' || c.status === 'assigned').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Closed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {complaints.filter(c => c.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {complaints.filter(c => c.status === 'assigned').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting Action</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-gray-200 dark:border-white/10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'complaints'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              My Complaints
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'feedback'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Give Feedback
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'complaints' ? (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400 font-medium"
                >
                  <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Status</option>
                  <option value="assigned" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Assigned</option>
                  <option value="in_progress" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">In Progress</option>
                  <option value="completed" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Completed</option>
                  <option value="cancelled" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load complaints</p>
                <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchComplaints}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && complaints.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <MessageSquare className="mx-auto h-16 w-16" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">No complaints found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Submit your first complaint using the button above</p>
              </div>
            )}

            {/* Complaints List */}
            {!loading && !error && complaints
              .filter((complaint) => filterStatus === 'all' || complaint.status === filterStatus)
              .map((complaint) => {
                // Extract category from description (format: "Category: billing\n\ndescription")
                const descriptionParts = complaint.description?.split('\n\n') || [];
                const categoryLine = descriptionParts[0] || '';
                const extractedCategory = categoryLine.startsWith('Category:')
                  ? categoryLine.replace('Category:', '').trim()
                  : 'General';
                const actualDescription = descriptionParts.slice(1).join('\n\n') || complaint.description;

                return (
                  <div
                    key={complaint.id}
                    className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                              TKT-{complaint.id}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                              {complaint.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority.toUpperCase()} Priority
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {complaint.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {actualDescription}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Tag className="w-4 h-4" />
                              <span className="capitalize">{extractedCategory}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(complaint.assignedDate || complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                            {complaint.employeeName && (
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{complaint.employeeName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedComplaint(selectedComplaint === complaint.id ? null : complaint.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <ChevronRight className={`w-5 h-5 transform transition-transform ${selectedComplaint === complaint.id ? 'rotate-90' : ''}`} />
                        </button>
                      </div>

                      {/* Expanded View */}
                      {selectedComplaint === complaint.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Complaint Details</h4>
                          <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {actualDescription}
                            </p>
                          </div>

                          {complaint.completionNotes && (
                            <div className="mb-4">
                              <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-400 mb-2">Staff Notes:</h5>
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{complaint.completionNotes}</p>
                              </div>
                            </div>
                          )}

                          {/* Coming Soon Message */}
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                              <MessageCircle className="w-4 h-4 inline mr-1" />
                              Response messaging feature coming soon
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // Feedback Tab Content
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              We Value Your Feedback
            </h2>

            {/* Coming Soon Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Feedback System Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We're working on a comprehensive feedback system to better serve you. This feature will allow you to rate our services and provide valuable insights.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                In the meantime, you can submit any concerns through the Complaints tab
              </p>
            </div>

            {/* Preview of upcoming features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50">
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                <Star className="w-8 h-8 text-yellow-400 mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Rate Services</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Provide star ratings for our services</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                <ThumbsUp className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Improvement Areas</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select areas where we can improve</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                <MessageCircle className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Detailed Comments</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share your thoughts and suggestions</p>
              </div>
            </div>
          </div>
        )}

        {/* New Complaint Modal */}
        {showNewComplaint && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Submit New Complaint
                </h2>
                <button
                  onClick={() => setShowNewComplaint(false)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitComplaint} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400 font-medium"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Select Category</option>
                    {complaintCategories.map((category) => (
                      <option key={category.value} value={category.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Please provide detailed information about your complaint..."
                    className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <div className="flex space-x-4">
                    {['low', 'medium', 'high'].map((priority) => (
                      <label key={priority} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData.priority === priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* File attachment - Coming Soon */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Paperclip className="w-4 h-4" />
                  <span>File attachment feature coming soon</span>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewComplaint(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Complaint'}
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