'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Building,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Award,
  CheckCircle,
  XCircle,
  UserPlus,
  Activity
} from 'lucide-react';

export default function EmployeeManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock employee data
  const employees = [
    {
      id: 1,
      employeeId: 'EMP-2024-0156',
      name: 'Mike Johnson',
      email: 'mike.j@electrolux.com',
      phone: '1234567890',
      department: 'Field Operations',
      position: 'Senior Technician',
      status: 'active',
      joinDate: '2022-03-15',
      salary: 45000,
      performance: 94,
      tasksCompleted: 1247
    },
    {
      id: 2,
      employeeId: 'EMP-2024-0157',
      name: 'Lisa Anderson',
      email: 'lisa.a@electrolux.com',
      phone: '9876543210',
      department: 'Customer Service',
      position: 'Support Manager',
      status: 'active',
      joinDate: '2021-11-20',
      salary: 52000,
      performance: 88,
      tasksCompleted: 892
    },
    {
      id: 3,
      employeeId: 'EMP-2024-0158',
      name: 'James Wilson',
      email: 'james.w@electrolux.com',
      phone: '5551234567',
      department: 'Billing',
      position: 'Billing Specialist',
      status: 'active',
      joinDate: '2023-01-10',
      salary: 38000,
      performance: 91,
      tasksCompleted: 654
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'on-leave': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-400';
    if (performance >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeId.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Employee Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your workforce and track performance</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Employees', value: '186', icon: Building, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Staff', value: '172', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'On Leave', value: '8', icon: XCircle, color: 'from-yellow-400 to-orange-500' },
            { label: 'Avg Performance', value: '89%', icon: Activity, color: 'from-purple-500 to-pink-500' },
            { label: 'Payroll/Month', value: '$485K', icon: Award, color: 'from-red-500 to-rose-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-gray-900 dark:text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, email, or department..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 border-b border-gray-200 dark:border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Performance</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white dark:bg-white dark:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{employee.name}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{employee.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 dark:text-white">{employee.department}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{employee.position}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{employee.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{employee.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`text-lg font-semibold ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance}%
                        </span>
                        <div className="w-24 h-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-full mt-1">
                          <div
                            className={`h-full rounded-full ${
                              employee.performance >= 90 ? 'bg-green-500' :
                              employee.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${employee.performance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(employee.status)}`}>
                        <span className="capitalize">{employee.status.replace('-', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Full Employee Management Coming Soon
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Add/Edit modals, advanced filters, and detailed employee profiles will be available soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
