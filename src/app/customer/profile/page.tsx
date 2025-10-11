'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Shield,
  Zap,
  Home,
  CreditCard,
  FileText,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  Bell,
  Hash,
  DollarSign
} from 'lucide-react';

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, Apt 4B, North Zone, City 12345',
    secondaryEmail: 'johndoe.backup@example.com',
    emergencyContact: '(555) 987-6543',
    dateOfBirth: '1985-06-15'
  });

  // Account information
  const accountInfo = {
    accountNumber: 'ELX-2024-001234',
    meterNumber: 'MTR-485729',
    connectionType: 'Residential',
    loadSanction: '5 kW',
    connectionDate: '2020-03-15',
    category: 'Domestic',
    phase: 'Single Phase',
    status: 'Active',
    creditScore: 850,
    accountAge: '4 years 7 months'
  };

  // Usage statistics
  const usageStats = {
    totalConsumption: '24,580 kWh',
    averageMonthly: '410 kWh',
    peakMonth: 'July 2024',
    lowestMonth: 'March 2024',
    totalPayments: '$12,450',
    onTimePayments: '98%',
    savedAmount: '$1,250',
    co2Reduced: '2.4 tons'
  };

  // Achievements
  const achievements = [
    { icon: Award, title: 'Green Consumer', description: '10% reduction in usage', color: 'from-green-500 to-emerald-500' },
    { icon: CreditCard, title: 'Prompt Payer', description: '12 months on-time', color: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, title: 'Energy Saver', description: 'Below avg consumption', color: 'from-yellow-400 to-orange-500' },
    { icon: Shield, title: 'Loyal Customer', description: '4+ years with us', color: 'from-purple-500 to-pink-500' }
  ];

  // Recent activities
  const recentActivities = [
    { date: '2024-10-10', activity: 'Bill payment completed', amount: '$245.50', status: 'success' },
    { date: '2024-10-08', activity: 'Meter reading submitted', amount: '460 kWh', status: 'info' },
    { date: '2024-10-05', activity: 'Service request resolved', amount: 'SR-2024-001', status: 'success' },
    { date: '2024-09-15', activity: 'Profile updated', amount: 'Email changed', status: 'info' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <DashboardLayout userType="customer" userName="John Doe">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-900 dark:text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-100 dark:bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
                  <Camera className="w-4 h-4 text-gray-900 dark:text-white" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profileData.fullName}</h1>
                <p className="text-gray-600 dark:text-gray-400">Account: {accountInfo.accountNumber}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-semibold border border-green-500/50">
                    {accountInfo.status}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Member since {accountInfo.connectionDate}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  isEditing
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                    : 'bg-white/10 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-300 dark:border-white/20 hover:bg-gray-200 dark:hover:bg-gray-200 dark:hover:bg-white/20'
                }`}
              >
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Credit Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{accountInfo.creditScore}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{usageStats.savedAmount}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">On-time Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{usageStats.onTimePayments}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">CO₂ Reduced</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{usageStats.co2Reduced}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-1">
          {['personal', 'account', 'usage', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'personal' && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.dateOfBirth}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Full Address</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                        rows={2}
                      />
                    ) : (
                      <div className="flex items-start space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                        <span className="text-gray-900 dark:text-white">{profileData.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(accountInfo).map(([key, value]) => (
                    <div key={key} className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-white font-semibold flex items-center">
                        {key === 'status' ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Usage Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(usageStats).map(([key, value]) => (
                    <div key={key} className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements & Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center`}>
                          <achievement.icon className="w-6 h-6 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{achievement.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Change Password</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="w-full p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Notification Settings</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="w-full p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Payment Methods</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="w-full p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Privacy Settings</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white text-sm">{activity.activity}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{activity.date}</p>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{activity.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Health */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Healthy</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">All systems normal</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Profile Completion</span>
                  <span className="text-green-400 font-semibold">95%</span>
                </div>
                <div className="w-full bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-full h-2">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
