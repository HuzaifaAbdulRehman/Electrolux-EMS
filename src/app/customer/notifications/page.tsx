'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Bell,
  BellOff,
  Filter,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  Zap,
  Calendar,
  MessageSquare,
  Settings,
  Trash2,
  Archive,
  Clock,
  ChevronRight,
  Mail,
  FileText,
  CreditCard,
  Wrench,
  Power
} from 'lucide-react';

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'billing',
      icon: DollarSign,
      title: 'New Bill Generated',
      message: 'Your October 2024 electricity bill of $245.50 is now available',
      time: '2 hours ago',
      date: '2024-10-10',
      read: false,
      priority: 'high',
      actionUrl: '/customer/bills',
      actionText: 'View Bill'
    },
    {
      id: 2,
      type: 'payment',
      icon: CreditCard,
      title: 'Payment Received',
      message: 'Payment of $220.00 has been successfully processed',
      time: '1 day ago',
      date: '2024-10-09',
      read: true,
      priority: 'normal',
      actionUrl: '/customer/payment',
      actionText: 'View Receipt'
    },
    {
      id: 3,
      type: 'usage',
      icon: Zap,
      title: 'High Usage Alert',
      message: 'Your electricity consumption is 25% higher than last month',
      time: '2 days ago',
      date: '2024-10-08',
      read: false,
      priority: 'medium',
      actionUrl: '/customer/usage',
      actionText: 'View Analytics'
    },
    {
      id: 4,
      type: 'outage',
      icon: Power,
      title: 'Planned Maintenance',
      message: 'Scheduled power outage on Oct 15, 2024 from 10 AM to 2 PM in North Zone',
      time: '3 days ago',
      date: '2024-10-07',
      read: true,
      priority: 'high',
      actionUrl: '#',
      actionText: 'Learn More'
    },
    {
      id: 5,
      type: 'service',
      icon: Wrench,
      title: 'Service Request Update',
      message: 'Your service request SR-2024-001 has been resolved',
      time: '4 days ago',
      date: '2024-10-06',
      read: false,
      priority: 'normal',
      actionUrl: '/customer/services',
      actionText: 'View Details'
    },
    {
      id: 6,
      type: 'system',
      icon: Info,
      title: 'System Update',
      message: 'New features have been added to your customer portal',
      time: '5 days ago',
      date: '2024-10-05',
      read: true,
      priority: 'low',
      actionUrl: '#',
      actionText: 'Explore'
    },
    {
      id: 7,
      type: 'reminder',
      icon: Calendar,
      title: 'Payment Due Soon',
      message: 'Your bill payment is due in 3 days. Amount: $245.50',
      time: '1 week ago',
      date: '2024-10-03',
      read: false,
      priority: 'high',
      actionUrl: '/customer/payment',
      actionText: 'Pay Now'
    }
  ];

  // Notification categories
  const categories = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'billing', label: 'Billing', count: notifications.filter(n => n.type === 'billing').length },
    { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { id: 'service', label: 'Service', count: notifications.filter(n => n.type === 'service').length },
    { id: 'outage', label: 'Outages', count: notifications.filter(n => n.type === 'outage').length }
  ];

  // Stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    highPriority: notifications.filter(n => n.priority === 'high').length,
    thisWeek: notifications.filter(n => {
      const notifDate = new Date(n.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return notifDate >= weekAgo;
    }).length
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    return notif.type === activeFilter;
  });

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'billing': return <DollarSign className={iconClass} />;
      case 'payment': return <CreditCard className={iconClass} />;
      case 'usage': return <Zap className={iconClass} />;
      case 'outage': return <Power className={iconClass} />;
      case 'service': return <Wrench className={iconClass} />;
      case 'reminder': return <Calendar className={iconClass} />;
      default: return <Info className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'billing': return 'from-green-500 to-emerald-500';
      case 'payment': return 'from-blue-500 to-cyan-500';
      case 'usage': return 'from-yellow-400 to-orange-500';
      case 'outage': return 'from-red-500 to-rose-500';
      case 'service': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleMarkAsRead = (id: number) => {
    // Mark as read logic
    console.log('Marking as read:', id);
  };

  const handleMarkAllRead = () => {
    // Mark all as read logic
    console.log('Marking all as read');
  };

  const handleDelete = (id: number) => {
    // Delete notification logic
    console.log('Deleting:', id);
  };

  return (
    <DashboardLayout userType="customer" userName="John Doe">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with your account activities and alerts</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all flex items-center space-x-2"
              >
                <CheckCheck className="w-5 h-5" />
                <span>Mark All Read</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Unread</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
              </div>
              <BellOff className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisWeek}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between ${
                      activeFilter === category.id
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border border-yellow-400/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-full text-xs">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center space-x-3">
                    <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Archive All</span>
                  </button>
                  <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center space-x-3">
                    <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Clear Old</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border transition-all hover:border-gray-300 dark:border-gray-300 dark:border-white/20 ${
                    notification.read ? 'border-gray-200 dark:border-white/10 opacity-75' : 'border-gray-300 dark:border-gray-300 dark:border-white/20'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTypeColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold flex items-center space-x-2">
                            {notification.title}
                            {!notification.read && (
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{notification.message}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{notification.time}</span>
                          </span>
                          <span>{notification.date}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="px-3 py-1 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all text-sm flex items-center space-x-1"
                            >
                              <span>{notification.actionText}</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 dark:hover:text-white transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-gray-200 dark:border-white/10 text-center">
                  <BellOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-gray-600 dark:text-gray-400">You're all caught up! Check back later for new updates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
