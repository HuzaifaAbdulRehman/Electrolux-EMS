'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Zap,
  ZapOff,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Bell,
  Info,
  Search
} from 'lucide-react';

export default function OutageSchedule() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Outage schedule data
  const outageSchedule = [
    {
      id: 1,
      area: 'Zone A - North District',
      startTime: '2024-10-12 06:00 AM',
      endTime: '2024-10-12 08:00 AM',
      duration: '2 hours',
      status: 'scheduled',
      reason: 'Maintenance',
      affectedCustomers: 1250,
      type: 'planned',
      notified: true
    },
    {
      id: 2,
      area: 'Zone B - Central Area',
      startTime: '2024-10-12 02:00 PM',
      endTime: '2024-10-12 04:00 PM',
      duration: '2 hours',
      status: 'scheduled',
      reason: 'Grid Upgrade',
      affectedCustomers: 890,
      type: 'planned',
      notified: true
    },
    {
      id: 3,
      area: 'Zone C - South District',
      startTime: '2024-10-11 10:00 AM',
      endTime: '2024-10-11 11:30 AM',
      duration: '1.5 hours',
      status: 'completed',
      reason: 'Equipment Repair',
      affectedCustomers: 620,
      type: 'planned',
      notified: true
    },
    {
      id: 4,
      area: 'Zone D - East Area',
      startTime: '2024-10-13 08:00 AM',
      endTime: '2024-10-13 12:00 PM',
      duration: '4 hours',
      status: 'scheduled',
      reason: 'Transformer Replacement',
      affectedCustomers: 1450,
      type: 'planned',
      notified: true
    },
    {
      id: 5,
      area: 'Zone A - North District',
      startTime: '2024-10-10 03:45 PM',
      endTime: '2024-10-10 05:20 PM',
      duration: '1 hour 35 mins',
      status: 'completed',
      reason: 'Technical Fault',
      affectedCustomers: 1100,
      type: 'unplanned',
      notified: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'ongoing': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'planned'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      : 'bg-orange-500/20 text-orange-400 border-orange-500/50';
  };

  const filteredSchedule = outageSchedule.filter(outage => {
    const matchesSearch = outage.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outage.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'all' || outage.area.includes(selectedArea);
    return matchesSearch && matchesArea;
  });

  const scheduledCount = outageSchedule.filter(o => o.status === 'scheduled').length;
  const completedCount = outageSchedule.filter(o => o.status === 'completed').length;
  const totalAffected = outageSchedule
    .filter(o => o.status === 'scheduled')
    .reduce((sum, o) => sum + o.affectedCustomers, 0);

  return (
    <DashboardLayout userType="customer" userName="John Doe">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <ZapOff className="w-8 h-8 mr-3 text-red-500" />
                Load Shedding & Outage Schedule
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay informed about planned and unplanned power outages in your area
              </p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Enable Alerts</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-yellow-400">Upcoming</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Scheduled Outages</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduledCount}</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-400">Done</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Customers</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Affected Users</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAffected.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Average</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Duration</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5 hrs</p>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-4 border border-orange-500/30">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Upcoming Outage Alert
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Zone A - North District</strong> will experience a planned power outage tomorrow from 6:00 AM to 8:00 AM for maintenance work.
              </p>
              <button className="text-orange-400 hover:text-orange-300 text-sm font-semibold flex items-center space-x-1">
                <Info className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by area or reason..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
              />
            </div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 text-sm"
            >
              <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">All Zones</option>
              <option value="Zone A" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Zone A - North</option>
              <option value="Zone B" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Zone B - Central</option>
              <option value="Zone C" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Zone C - South</option>
              <option value="Zone D" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Zone D - East</option>
            </select>
          </div>
        </div>

        {/* Outage Schedule Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Area</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Schedule</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Affected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredSchedule.map((outage) => (
                  <tr key={outage.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{outage.area}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm">{outage.startTime}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">to {outage.endTime}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">{outage.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{outage.reason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeColor(outage.type)}`}>
                        {outage.type === 'planned' ? <Calendar className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                        {outage.type.charAt(0).toUpperCase() + outage.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(outage.status)}`}>
                        {outage.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {outage.status.charAt(0).toUpperCase() + outage.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white text-sm">{outage.affectedCustomers.toLocaleString()} users</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-400" />
            Important Information
          </h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
            <p>• <strong>Planned Outages:</strong> You will receive SMS/Email notifications 24 hours in advance</p>
            <p>• <strong>Unplanned Outages:</strong> We work to restore power as quickly as possible, typically within 2-4 hours</p>
            <p>• <strong>Emergency Contact:</strong> For power emergencies, call our 24/7 helpline: <strong className="text-orange-400">1-800-POWER-HELP</strong></p>
            <p>• <strong>Compensation:</strong> Extended outages beyond scheduled time may qualify for bill credits</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
