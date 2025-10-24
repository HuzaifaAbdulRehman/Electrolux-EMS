'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Zap,
  Home,
  FileText,
  BarChart3,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
  Moon,
  Sun,
  Users,
  Building,
  DollarSign,
  Activity,
  Gauge,
  ClipboardList,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  Calculator,
  ZapOff,
  Database,
  Plus,
  Loader2
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'employee' | 'admin';
  userName?: string;
}

export default function DashboardLayout({ children, userType, userName }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasActiveConnection, setHasActiveConnection] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  // Use session data if available
  const displayName = session?.user?.name || userName || 'User';
  const userEmail = session?.user?.email || '';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Get navigation items based on user type
  const getNavigationItems = () => {
    if (userType === 'customer') {
      return [
        { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
        { name: 'My Bills', href: '/customer/bills', icon: FileText },
        { name: 'View & Print Bills', href: '/customer/view-bills', icon: FileText },
        { name: 'Payment', href: '/customer/payment', icon: DollarSign },
        { name: 'Analytics', href: '/customer/analytics', icon: BarChart3 },
        { name: 'New Connection', href: '/customer/new-connection', icon: Plus },
        { name: 'Services', href: '/customer/services', icon: Activity },
        { name: 'Complaints', href: '/customer/complaints', icon: MessageSquare },
        { name: 'Outage Schedule', href: '/customer/outage-schedule', icon: ZapOff },
        { name: 'Bill Calculator', href: '/customer/bill-calculator', icon: Calculator },
        { name: 'Profile', href: '/customer/profile', icon: User },
        { name: 'Settings', href: '/customer/settings', icon: Settings },
      ];
    } else if (userType === 'employee') {
      return [
        { name: 'Dashboard', href: '/employee/dashboard', icon: Home },
        { name: 'Meter Reading', href: '/employee/meter-reading', icon: Gauge },
        { name: 'Work Orders', href: '/employee/work-orders', icon: ClipboardList },
        { name: 'Customers', href: '/employee/customers', icon: Users },
        { name: 'Bill Generation', href: '/employee/bill-generation', icon: FileText },
        { name: 'Profile', href: '/employee/profile', icon: User },
        { name: 'Settings', href: '/employee/settings', icon: Settings },
      ];
    } else if (userType === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Employees', href: '/admin/employees', icon: Building },
        { name: 'Generate Bills', href: '/admin/bills/generate', icon: FileText },
        { name: 'Tariffs', href: '/admin/tariffs', icon: DollarSign },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Reports', href: '/admin/reports', icon: Activity },
        { name: 'Data Import', href: '/admin/data-import', icon: Database },
        { name: 'Profile', href: '/admin/profile', icon: User },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check connection status from event or localStorage
    const checkConnectionStatus = () => {
      const connectionStatus = localStorage.getItem('connectionStatus');
      setHasActiveConnection(connectionStatus === 'active');
    };

    checkConnectionStatus();

    // Listen for connection status changes
    const handleConnectionChange = (e: CustomEvent) => {
      setHasActiveConnection(e.detail.status === 'active');
    };

    window.addEventListener('connectionStatusChange' as any, handleConnectionChange);

    return () => {
      window.removeEventListener('connectionStatusChange' as any, handleConnectionChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDark: newTheme } }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/login'
      });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Sample notifications
  const notifications = [
    { id: 1, title: 'Bill Generated', message: 'Your monthly bill is ready', time: '2 hours ago', type: 'info' as const },
    { id: 2, title: 'Payment Received', message: 'Payment of $150 received', time: '1 day ago', type: 'success' as const },
    { id: 3, title: 'High Usage Alert', message: 'Your usage is 20% higher than last month', time: '3 days ago', type: 'warning' as const },
  ];

  const getNotificationIcon = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getUserTypeColor = () => {
    switch (userType) {
      case 'admin': return 'from-red-500 to-pink-500';
      case 'employee': return 'from-green-500 to-emerald-500';
      default: return 'from-yellow-400 to-orange-500';
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'admin': return 'Administrator';
      case 'employee': return 'Employee';
      default: return 'Customer';
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform bg-white dark:bg-gray-800 shadow-xl`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b dark:border-gray-700">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">ElectroLux</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Energy Management</p>
              </div>
            </Link>
          </div>

          {/* User type badge */}
          <div className="px-4 py-3 border-b dark:border-gray-700">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getUserTypeColor()}`}>
              {getUserTypeLabel()}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Connection Status (for customers) */}
          {userType === 'customer' && (
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Connection</span>
                <span className={`flex items-center space-x-1 text-sm ${
                  hasActiveConnection ? 'text-green-500' : 'text-gray-500'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    hasActiveConnection ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                  <span>{hasActiveConnection ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
            </div>
          )}

          {/* Logout button */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Search bar */}
            <div className="hidden md:block flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsProfileOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50">
                    <div className="p-4 border-b dark:border-gray-700">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center">
                      <Link href="/notifications" className="text-sm text-yellow-500 hover:text-yellow-600">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">{displayName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50">
                    <div className="p-4 border-b dark:border-gray-700">
                      <p className="font-semibold">{displayName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href={`/${userType}/profile`}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href={`/${userType}/settings`}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}