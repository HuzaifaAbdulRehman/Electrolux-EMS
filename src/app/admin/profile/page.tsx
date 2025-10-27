'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle
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
    joinDate: '',
    accountStatus: 'Active'
  });

  const permissions = [
    { module: 'User Management', access: ['Create', 'Read', 'Update', 'Delete'], enabled: true },
    { module: 'Billing System', access: ['Read', 'Update', 'Generate'], enabled: true },
    { module: 'Reports & Analytics', access: ['Read', 'Export', 'Schedule'], enabled: true },
    { module: 'System Settings', access: ['Read', 'Update'], enabled: true },
    { module: 'Customer Support', access: ['Read', 'Respond', 'Escalate'], enabled: true },
    { module: 'Employee Management', access: ['Read', 'Update', 'Assign'], enabled: true }
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

        setProfileData({
          fullName: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          joinDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : '',
          accountStatus: userData.isActive === 1 ? 'Active' : 'Inactive'
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
        setIsEditing(false);
        await fetchAdminProfile();
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save changes');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'permissions', label: 'Permissions', icon: Shield }
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
                <p className="text-gray-700 dark:text-gray-300 mb-2">System Administrator</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/50">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/50">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {profileData.accountStatus}
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
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 opacity-50 cursor-not-allowed"
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
                    <label className="text-gray-600 dark:text-gray-400 text-sm mb-2 block">Account Created</label>
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

          </div>
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
