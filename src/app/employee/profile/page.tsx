'use client';

import React, { useState, useEffect } from 'react';
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
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Target,
  Activity,
  Briefcase,
  Hash,
  CreditCard,
  FileText
} from 'lucide-react';

export default function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });

  // Fetch employee profile data
  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee/profile');

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();

      if (result.success) {
        setEmployeeData(result.data);
        setProfileData({
          fullName: result.data.fullName,
          email: result.data.email,
          phone: result.data.phone,
          department: result.data.department,
          position: result.data.designation
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract data with fallbacks
  const employeeInfo = employeeData ? {
    employeeId: employeeData.employeeId,
    department: employeeData.department,
    designation: employeeData.designation,
    email: employeeData.email,
    phone: employeeData.phone,
    hireDate: employeeData.hireDate,
    experience: employeeData.experience,
    assignedZone: employeeData.assignedZone,
    status: employeeData.status,
    workStats: employeeData.workStats,
    performanceScore: Math.round(parseFloat(employeeData.workStats?.successRate || '0'))
  } : null;

  const workStats = employeeData?.workStats || {
    totalTasks: 0,
    completedThisMonth: 0,
    avgDaily: 0,
    successRate: '0',
    inProgressTasks: 0,
    pendingTasks: 0
  };

  // Achievements based on real data
  const achievements = [];
  if (workStats.totalTasks >= 100) {
    achievements.push({ icon: Target, title: `${workStats.totalTasks} Tasks Milestone`, date: 'Achievement', color: 'from-green-500 to-emerald-500' });
  }
  if (parseFloat(workStats.successRate) >= 90) {
    achievements.push({ icon: Star, title: `${workStats.successRate} Success Rate`, date: 'High Performance', color: 'from-blue-500 to-cyan-500' });
  }
  if (workStats.completedThisMonth >= 20) {
    achievements.push({ icon: Award, title: 'Productive Month', date: `${workStats.completedThisMonth} tasks completed`, color: 'from-yellow-400 to-orange-500' });
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/employee/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: profileData.phone,
          email: profileData.email
        })
      });

      if (response.ok) {
        setIsEditing(false);
        fetchEmployeeProfile();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="employee" userName="Employee">
        <div className="flex items-center justify-center h-64">
          <Activity className="w-8 h-8 animate-spin text-green-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employeeData) {
    return (
      <DashboardLayout userType="employee" userName="Employee">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error || 'Failed to load profile'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="employee" userName={profileData.fullName || 'Employee'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-100 dark:bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profileData.fullName}</h1>
                <p className="text-gray-600 dark:text-gray-400">{employeeInfo?.position || 'N/A'} • {employeeInfo?.department || 'N/A'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-semibold border border-green-500/50">
                    {employeeInfo?.status || 'Active'}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">ID: {employeeInfo?.employeeId || 'N/A'}</span>
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
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Performance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employeeInfo?.performanceScore || 0}%</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workStats.totalTasks}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workStats.completedThisMonth}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workStats.inProgressTasks}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-1">
          {['personal', 'work', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
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
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white/5 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Work Email</label>
                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white/5 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profileData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white/5 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'work' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Work Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Employee ID</p>
                    <p className="text-white font-semibold">{employeeInfo?.employeeId || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Department</p>
                    <p className="text-white font-semibold">{employeeInfo?.department || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Position</p>
                    <p className="text-white font-semibold">{employeeInfo?.designation || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Work Zone</p>
                    <p className="text-white font-semibold">{employeeInfo?.assignedZone || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Join Date</p>
                    <p className="text-white font-semibold">{employeeInfo?.hireDate || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Experience</p>
                    <p className="text-white font-semibold">{employeeInfo?.experience || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-semibold">{employeeInfo?.email || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Status</p>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                      {employeeInfo?.status || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Work Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                      <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
                      <p className="text-2xl font-bold text-white">{employeeInfo?.workStats?.totalTasks || 0}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
                      <p className="text-gray-400 text-sm mb-1">Completed</p>
                      <p className="text-2xl font-bold text-white">{employeeInfo?.workStats?.completedThisMonth || 0}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/30">
                      <p className="text-gray-400 text-sm mb-1">In Progress</p>
                      <p className="text-2xl font-bold text-white">{employeeInfo?.workStats?.inProgressTasks || 0}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
                      <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-white">{employeeInfo?.workStats?.successRate || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements & Recognition</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center`}>
                          <achievement.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{achievement.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{achievement.date}</p>
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
            {/* Work Statistics */}
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">This Month</span>
                  <span className="text-white font-semibold">{workStats.completedThisMonth} tasks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Average</span>
                  <span className="text-white font-semibold">{workStats.avgDaily}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">{workStats.successRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pending Tasks</span>
                  <span className="text-yellow-400 font-semibold">{workStats.pendingTasks}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Request Leave</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">View Payslip</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Training Modules</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
