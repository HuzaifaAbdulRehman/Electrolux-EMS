'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('complaints');
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSendMessage = () => {
    // TODO: Implement send message functionality
    console.log('Sending message...');
  };

  // Form state for new complaint
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  // Mock data for existing complaints
  const complaints = [
    {
      id: 1,
      ticketNumber: 'TKT-2024-001234',
      category: 'Billing',
      subject: 'Incorrect bill amount for October',
      description: 'My bill shows 650 units but my meter reading is only 485 units.',
      status: 'in_progress',
      priority: 'high',
      createdDate: '2024-10-28',
      lastUpdated: '2024-10-29',
      assignedTo: 'John Smith',
      responses: [
        {
          from: 'Support Team',
          date: '2024-10-29',
          message: 'We are investigating your billing issue. Our team will verify your meter reading.'
        }
      ]
    },
    {
      id: 2,
      ticketNumber: 'TKT-2024-001233',
      category: 'Service',
      subject: 'Frequent power outages in my area',
      description: 'There have been 3 power outages this week in Sector 5.',
      status: 'resolved',
      priority: 'medium',
      createdDate: '2024-10-25',
      lastUpdated: '2024-10-27',
      assignedTo: 'Sarah Johnson',
      responses: [
        {
          from: 'Support Team',
          date: '2024-10-26',
          message: 'We identified the issue with the transformer in your area.'
        },
        {
          from: 'Support Team',
          date: '2024-10-27',
          message: 'The transformer has been repaired. The issue should be resolved now.'
        }
      ]
    },
    {
      id: 3,
      ticketNumber: 'TKT-2024-001232',
      category: 'Technical',
      subject: 'Smart meter not working properly',
      description: 'My smart meter display is blank and not showing readings.',
      status: 'pending',
      priority: 'low',
      createdDate: '2024-10-30',
      lastUpdated: '2024-10-30',
      assignedTo: 'Pending Assignment',
      responses: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'pending': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
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

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle complaint submission
    console.log('Submitting complaint:', formData);
    setShowNewComplaint(false);
    setFormData({
      category: '',
      subject: '',
      description: '',
      priority: 'medium'
    });
  };

  return (
    <DashboardLayout userType="customer" userName="Huzaifa">
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Complaints</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Closed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4.5/5</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
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
                  <option value="pending" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Pending</option>
                  <option value="in_progress" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">In Progress</option>
                  <option value="resolved" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Resolved</option>
                </select>
              </div>
            </div>

            {/* Complaints List */}
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {complaint.ticketNumber}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority.toUpperCase()} Priority
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {complaint.subject}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {complaint.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{complaint.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{complaint.createdDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{complaint.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedComplaint(selectedComplaint === complaint.id ? null : complaint.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <ChevronRight className={`w-5 h-5 transform transition-transform ${selectedComplaint === complaint.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded View with Responses */}
                  {selectedComplaint === complaint.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Response History</h4>
                      {complaint.responses.length > 0 ? (
                        <div className="space-y-3">
                          {complaint.responses.map((response, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {response.from}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {response.date}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {response.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No responses yet. We'll update you soon.
                        </p>
                      )}

                      {/* Add Response */}
                      {complaint.status !== 'resolved' && (
                        <div className="mt-4">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 px-4 py-2 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                            />
                            <button 
                              onClick={handleSendMessage}
                              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Feedback Tab Content
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              We Value Your Feedback
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How satisfied are you with our service?
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What can we improve?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Billing', 'Customer Service', 'App Experience', 'Power Quality', 'Response Time', 'Communication'].map((area) => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-yellow-400 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts with us..."
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all font-medium"
              >
                Submit Feedback
              </button>
            </form>
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
                    <option value="billing" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Billing Issues</option>
                    <option value="service" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Service Disruption</option>
                    <option value="technical" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Technical Problems</option>
                    <option value="meter" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Meter Reading</option>
                    <option value="payment" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Payment Issues</option>
                    <option value="other" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Other</option>
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

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Paperclip className="w-4 h-4" />
                  <span>Attach files (optional)</span>
                  <input type="file" className="hidden" />
                  <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Browse
                  </button>
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all font-medium"
                  >
                    Submit Complaint
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