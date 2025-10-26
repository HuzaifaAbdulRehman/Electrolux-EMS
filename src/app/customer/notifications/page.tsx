'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';
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
  Clock,
  ChevronRight,
  Mail,
  FileText,
  CreditCard,
  Wrench,
  Power
} from 'lucide-react';

export default function Notifications() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?filter=${activeFilter}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch notifications');
      }

      setNotifications(result.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filter changes
  useEffect(() => {
    fetchNotifications();
  }, [activeFilter]);

  const handleNotificationAction = (actionUrl: string) => {
    if (actionUrl && actionUrl !== '#') {
      router.push(actionUrl);
    }
  };

  const handleSettings = () => {
    router.push('/customer/settings');
  };

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

  // Notifications are already filtered by API based on activeFilter

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

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to mark as read');
      }

      // Update local state
      setNotifications(prev => prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (err: any) {
      console.error('Error marking as read:', err);
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to mark all as read');
      }

      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      setError(err.message || 'Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete notification');
      }

      // Remove from local state
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      setError(err.message || 'Failed to delete notification');
    }
  };

  return (
    <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with your account activities and alerts</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center space-x-2"
              >
                <CheckCheck className="w-5 h-5" />
                <span>Mark All Read</span>
              </button>
              <button 
                onClick={handleSettings}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Unread</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
              </div>
              <BellOff className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-gray-700">
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
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between ${
                      activeFilter === category.id
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 border border-yellow-400/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === category.id
                        ? 'bg-yellow-400/20 text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {loading && (
                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
                </div>
              )}

              {error && !loading && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-400 font-semibold">{error}</p>
                  <button
                    onClick={fetchNotifications}
                    className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl p-6 border transition-all hover:border-gray-400 dark:hover:border-gray-600 ${
                    notification.read ? 'border-gray-200 dark:border-gray-700 opacity-75' : 'border-gray-300 dark:border-gray-600'
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
                          <h3 className="text-gray-900 dark:text-white font-semibold flex items-center space-x-2">
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
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {notification.actionUrl && notification.actionUrl !== '#' && (
                            <button
                              onClick={() => handleNotificationAction(notification.actionUrl)}
                              className="p-1 text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors"
                              title={notification.actionText || 'View details'}
                            >
                              <ChevronRight className="w-4 h-4" />
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

              {!loading && !error && notifications.length === 0 && (
                <div className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
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
