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

  const [profileData, setProfileData] = useState({
    fullName: 'Mike Johnson',
    email: 'mike.johnson@electrolux.com',
    phone: '(555) 234-5678',
    address: '456 Oak Street, City 12345',
    emergencyContact: '(555) 876-5432',
    dateOfBirth: '1990-03-25',
    department: 'Field Operations',
    position: 'Senior Technician'
  });

  // Employee information
  const employeeInfo = {
    employeeId: 'EMP-2024-0156',
    department: 'Field Operations',
    position: 'Senior Technician',
    joinDate: '2019-06-15',
    experience: '5 years 4 months',
    supervisor: 'Robert Williams',
    workZone: 'North & East',
    status: 'Active',
    certifications: ['Meter Installation', 'Safety Protocol', 'Customer Service'],
    performanceScore: 92
  };

  // Work statistics
  const workStats = {
    totalTasks: 1250,
    completedThisMonth: 67,
    avgDaily: 3.2,
    successRate: '98.5%',
    customerRating: 4.8,
    onTimeCompletion: '96%',
    overtimeHours: 12,
    leavesTaken: 5
  };

  // Achievements
  const achievements = [
    { icon: Award, title: 'Employee of the Month', date: 'September 2024', color: 'from-yellow-400 to-orange-500' },
    { icon: Star, title: '5-Star Rating', date: 'August 2024', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, title: '1000 Tasks Milestone', date: 'July 2024', color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, title: 'Performance Leader', date: 'June 2024', color: 'from-purple-500 to-pink-500' }
  ];

  // Recent performance
  const recentPerformance = [
    { month: 'October', score: 92, tasks: 67, rating: 4.8 },
    { month: 'September', score: 95, tasks: 89, rating: 4.9 },
    { month: 'August', score: 88, tasks: 78, rating: 4.7 },
    { month: 'July', score: 90, tasks: 85, rating: 4.8 }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <DashboardLayout userType="employee" userName="Mike Johnson">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-900 dark:text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-100 dark:bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
                  <Camera className="w-4 h-4 text-gray-900 dark:text-white" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profileData.fullName}</h1>
                <p className="text-gray-600 dark:text-gray-400">{employeeInfo.position} • {employeeInfo.department}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full font-semibold border border-green-500/50">
                    {employeeInfo.status}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">ID: {employeeInfo.employeeId}</span>
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">Performance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employeeInfo.performanceScore}%</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workStats.totalTasks}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Customer Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">⭐ {workStats.customerRating}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">On-Time Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workStats.onTimeCompletion}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-1">
          {['personal', 'work', 'performance', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 dark:text-white'
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
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Work Email</label>
                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
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
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Emergency Contact</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.emergencyContact}
                        onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{profileData.emergencyContact}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Address</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400"
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
              </div>
            )}

            {activeTab === 'work' && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Work Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Employee ID</p>
                    <p className="text-white font-semibold">{employeeInfo.employeeId}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Department</p>
                    <p className="text-white font-semibold">{employeeInfo.department}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Position</p>
                    <p className="text-white font-semibold">{employeeInfo.position}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Supervisor</p>
                    <p className="text-white font-semibold">{employeeInfo.supervisor}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Join Date</p>
                    <p className="text-white font-semibold">{employeeInfo.joinDate}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Experience</p>
                    <p className="text-white font-semibold">{employeeInfo.experience}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Work Zone</p>
                    <p className="text-white font-semibold">{employeeInfo.workZone}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Status</p>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                      {employeeInfo.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {employeeInfo.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Performance History</h2>
                <div className="space-y-4">
                  {recentPerformance.map((month, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold">{month.month} 2024</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          month.score >= 90
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                        }`}>
                          {month.score}% Score
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Tasks Completed</p>
                          <p className="text-white font-semibold">{month.tasks}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Customer Rating</p>
                          <p className="text-white font-semibold">⭐ {month.rating}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements & Recognition</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center`}>
                          <achievement.icon className="w-6 h-6 text-gray-900 dark:text-white" />
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
            <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
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
                  <span className="text-gray-600 dark:text-gray-400">Overtime Hours</span>
                  <span className="text-white font-semibold">{workStats.overtimeHours} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Leaves Taken</span>
                  <span className="text-white font-semibold">{workStats.leavesTaken} days</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Request Leave</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="w-full p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                  <span className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">View Payslip</span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="w-full p-3 bg-white dark:bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
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
