'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import DashboardLayout from '@/components/DashboardLayout';
import {
  ClipboardList,
  Calendar,
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Zap,
  Wrench,
  FileText,
  Phone,
  Navigation
} from 'lucide-react';

interface WorkOrder {
  id: string;
  orderNumber: string;
  type: string;
  priority: string;
  status: string;
  customerName: string;
  customerPhone: string;
  address: string;
  zone: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  startTime?: string;
  completionTime?: string;
  notes?: string;
}

export default function WorkOrders() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState('assigned');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock work orders data
  const workOrders: WorkOrder[] = [
    {
      id: '1',
      orderNumber: 'WO-2024-10-001',
      type: 'Meter Reading',
      priority: 'high',
      status: 'assigned',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 234-567-8901',
      address: '123 Oak Street, Sector 3',
      zone: 'North Zone',
      description: 'Regular monthly meter reading required. Customer preferred time: 9 AM - 12 PM',
      assignedDate: '2024-10-11',
      dueDate: '2024-10-12',
    },
    {
      id: '2',
      orderNumber: 'WO-2024-10-002',
      type: 'Meter Installation',
      priority: 'medium',
      status: 'assigned',
      customerName: 'Michael Brown',
      customerPhone: '+1 234-567-8902',
      address: '456 Pine Avenue, Sector 5',
      zone: 'East Zone',
      description: 'New meter installation for new connection. Equipment available in warehouse.',
      assignedDate: '2024-10-11',
      dueDate: '2024-10-13',
    },
    {
      id: '3',
      orderNumber: 'WO-2024-10-003',
      type: 'Complaint Resolution',
      priority: 'high',
      status: 'in-progress',
      customerName: 'Emily Davis',
      customerPhone: '+1 234-567-8903',
      address: '789 Maple Drive, Sector 2',
      zone: 'South Zone',
      description: 'Customer reports voltage fluctuations. Check transformer and wiring.',
      assignedDate: '2024-10-10',
      dueDate: '2024-10-11',
      startTime: '2024-10-11 08:30 AM',
    },
    {
      id: '4',
      orderNumber: 'WO-2024-10-004',
      type: 'Meter Repair',
      priority: 'low',
      status: 'assigned',
      customerName: 'David Wilson',
      customerPhone: '+1 234-567-8904',
      address: '321 Elm Street, Sector 4',
      zone: 'West Zone',
      description: 'Meter display malfunction. Replace display unit if necessary.',
      assignedDate: '2024-10-11',
      dueDate: '2024-10-14',
    },
    {
      id: '5',
      orderNumber: 'WO-2024-10-005',
      type: 'Meter Reading',
      priority: 'medium',
      status: 'completed',
      customerName: 'Lisa Anderson',
      customerPhone: '+1 234-567-8905',
      address: '654 Cedar Lane, Sector 1',
      zone: 'North Zone',
      description: 'Regular monthly meter reading completed successfully.',
      assignedDate: '2024-10-09',
      dueDate: '2024-10-10',
      startTime: '2024-10-10 10:00 AM',
      completionTime: '2024-10-10 10:15 AM',
      notes: 'Reading: 4532 kWh. Meter in good condition.'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <AlertCircle className="w-5 h-5" />;
      case 'in-progress': return <Play className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const filteredOrders = workOrders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;

    return matchesTab && matchesSearch && matchesPriority;
  });

  const handleStartWork = (orderId: string) => {
    console.log('Starting work order:', orderId);
    // In real app, update status to 'in-progress'
  };

  const handleCompleteWork = (orderId: string) => {
    console.log('Completing work order:', orderId);
    // In real app, update status to 'completed'
  };

  const stats = {
    assigned: workOrders.filter(o => o.status === 'assigned').length,
    inProgress: workOrders.filter(o => o.status === 'in-progress').length,
    completed: workOrders.filter(o => o.status === 'completed').length,
    total: workOrders.length,
  };

  return (
    <DashboardLayout userType="employee" userName={session?.user?.name || 'Employee'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Work Orders</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your assigned tasks and field work</p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center space-x-2 font-semibold">
              <Plus className="w-5 h-5" />
              <span>Request Work Order</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.assigned}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Assigned</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          </div>

          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">Done</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-1 border border-gray-200 dark:border-white/10">
          <div className="flex flex-wrap gap-1">
            {['assigned', 'in-progress', 'completed', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number, customer, or address..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400 font-medium"
            >
              <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Priorities</option>
              <option value="high" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">High Priority</option>
              <option value="medium" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Medium Priority</option>
              <option value="low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-gray-200 dark:border-white/10 text-center">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No work orders found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} flex items-center space-x-1`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status.replace('-', ' ')}</span>
                      </span>
                      <span className={`text-sm font-semibold ${getPriorityColor(order.priority)}`}>
                        {order.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {order.orderNumber}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {order.type}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{order.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Navigation className="w-4 h-4" />
                        <span>{order.zone}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {order.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Assigned: {order.assignedDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Due: {order.dueDate}</span>
                      </span>
                      {order.startTime && (
                        <span className="flex items-center space-x-1">
                          <Play className="w-3 h-3" />
                          <span>Started: {order.startTime}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    {order.status === 'assigned' && (
                      <button
                        onClick={() => handleStartWork(order.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center space-x-2 text-sm font-medium"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Work</span>
                      </button>
                    )}
                    {order.status === 'in-progress' && (
                      <button
                        onClick={() => handleCompleteWork(order.id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center space-x-2 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                      className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 dark:text-white rounded-lg hover:bg-white/20 transition-all flex items-center space-x-2 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Completion Notes:</p>
                    <p className="text-sm text-gray-900 dark:text-white">{order.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Order Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
                    <p className={`font-semibold ${getPriorityColor(selectedOrder.priority)}`}>
                      {selectedOrder.priority.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.customerPhone}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.zone}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedOrder.description}</p>
              </div>

              {selectedOrder.status === 'assigned' && (
                <button
                  onClick={() => {
                    handleStartWork(selectedOrder.id);
                    setShowDetails(false);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all font-medium"
                >
                  Start This Work Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
