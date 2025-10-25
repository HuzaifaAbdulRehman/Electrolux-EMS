'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Activity,
  Lock,
  Eye,
  Edit2,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: 'System Administrator',
    department: 'Administration',
    employeeId: 'ADMIN001',
    joinDate: '',
    location: 'Head Office',
    bio: 'System Administrator with full access to all system functions and data management capabilities.'
  });

  const [adminInfo, setAdminInfo] = useState({
    accessLevel: 'Super Admin',
    lastLogin: '2024-10-11 09:23 AM',
    accountStatus: 'Active',
    twoFactorEnabled: true,
    sessionsActive: 3
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/profile');
        const result = await response.json();
        
        if (result.success) {
          const data = result.data;
          setProfileData({
            fullName: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            position: 'System Administrator',
            department: 'Administration',
            employeeId: 'ADMIN001',
            joinDate: new Date(data.createdAt).toLocaleDateString(),
            location: 'Head Office',
            bio: 'System Administrator with full access to all system functions and data management capabilities.'
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);


  const permissions = [
    { module: 'User Management', access: ['Create', 'Read', 'Update', 'Delete'], enabled: true },
    { module: 'Billing System', access: ['Read', 'Update', 'Generate'], enabled: true },
    { module: 'Reports & Analytics', access: ['Read', 'Export', 'Schedule'], enabled: true },
    { module: 'System Settings', access: ['Read', 'Update'], enabled: true },
    { module: 'Customer Support', access: ['Read', 'Respond', 'Escalate'], enabled: true },
    { module: 'Employee Management', access: ['Read', 'Update', 'Assign'], enabled: true }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Updated system billing rates',
      module: 'Billing System',
      timestamp: '2024-10-11 09:15 AM',
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      action: 'Created new employee account',
      module: 'User Management',
      timestamp: '2024-10-11 08:45 AM',
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      id: 3,
      action: 'Generated monthly revenue report',
      module: 'Reports',
      timestamp: '2024-10-10 04:30 PM',
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      id: 4,
      action: 'Failed login attempt',
      module: 'Security',
      timestamp: '2024-10-10 02:15 PM',
      status: 'warning',
      ip: '203.45.67.89'
    },
    {
      id: 5,
      action: 'Updated zone configurations',
      module: 'System Settings',
      timestamp: '2024-10-10 11:20 AM',
      status: 'success',
      ip: '192.168.1.100'
    }
  ];

  const accessLogs = [
    {
      id: 1,
      device: 'Desktop - Chrome',
      location: 'New York, NY',
      ip: '192.168.1.100',
      time: '2024-10-11 09:23 AM',
      status: 'active'
    },
    {
      id: 2,
      device: 'Mobile - Safari',
      location: 'New York, NY',
      ip: '192.168.1.105',
      time: '2024-10-11 07:15 AM',
      status: 'active'
    },
    {
      id: 3,
      device: 'Tablet - Edge',
      location: 'New York, NY',
      ip: '192.168.1.102',
      time: '2024-10-10 06:45 PM',
      status: 'expired'
    }
  ];

  // Fetch admin profile data
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/profile');
      const result = await response.json();

      if (result.success) {
        const userData = result.data;

        // Load additional data from localStorage if available
        const storedLocation = localStorage.getItem('admin_location');
        const storedBio = localStorage.getItem('admin_bio');

        setProfileData({
          fullName: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          position: 'System Administrator',
          department: 'Administration',
          employeeId: `ADM-${userData.id}`,
          joinDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : '',
          location: storedLocation || '',
          bio: storedBio || ''
        });
      } else {
        setError(result.error || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');

      // Save to database
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.fullName,
          phone: profileData.phone
        })
      });

      const result = await response.json();

      if (result.success) {
        // Save location and bio to localStorage
        localStorage.setItem('admin_location', profileData.location);
        localStorage.setItem('admin_bio', profileData.bio);

        setIsEditing(false);
        // Show success message (you can add a toast notification here)
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save changes');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <DashboardLayout userType="admin" userName={profileData.fullName || 'Admin'}>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {/* Header with Profile Overview */}
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profileData.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profileData.fullName}</h1>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{profileData.position} • {profileData.department}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/50">
                    <Shield className="w-4 h-4 mr-1" />
                    {adminInfo.accessLevel}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/50">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {adminInfo.accountStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center space-x-2"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 text-white rounded-lg hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Actions Today</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Active Sessions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminInfo.sessionsActive}</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Last Login</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{adminInfo.lastLogin}</p>
          </div>

          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">2FA Status</p>
            <p className="text-lg font-bold text-green-400">Enabled</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-white/10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-red-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-red-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-red-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Position</label>
                    <div className="relative">
                      <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-red-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Department</label>
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-red-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Employee ID</label>
                    <input
                      type="text"
                      value={profileData.employeeId}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 opacity-50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Join Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={profileData.joinDate}
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-red-400 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-red-400 disabled:opacity-50 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-4">
                {permissions.map((permission, index) => (
                  <div key={index} className="bg-white dark:bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          permission.enabled
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gray-500/20'
                        }`}>
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{permission.module}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {permission.access.length} permissions
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        permission.enabled
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/50'
                      }`}>
                        {permission.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {permission.access.map((access, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-white/10"
                        >
                          {access}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="bg-white dark:bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{activity.action}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center">
                              <Settings className="w-4 h-4 mr-1" />
                              {activity.module}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {activity.timestamp}
                            </span>
                            <span className="flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              {activity.ip}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        activity.status === 'success'
                          ? 'bg-green-500/20 text-green-400'
                          : activity.status === 'warning'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Extra layer of security enabled</p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {accessLogs.map((log) => (
                      <div key={log.id} className="bg-white dark:bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {log.device.includes('Desktop') && <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                            {log.device.includes('Mobile') && <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                            {log.device.includes('Tablet') && <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                            <div>
                              <p className="text-white font-medium">{log.device}</p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">{log.location}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            log.status === 'active'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/50'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {log.ip}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {log.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="px-6 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 text-white rounded-lg hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all flex items-center justify-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Change Password</span>
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center space-x-2">
                    <X className="w-5 h-5" />
                    <span>End All Sessions</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
