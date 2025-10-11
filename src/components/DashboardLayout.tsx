'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Database
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'employee' | 'admin';
  userName?: string;
}

export default function DashboardLayout({ children, userType, userName = 'User' }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      applyTheme(isDark);
    } else {
      // Default to dark mode
      applyTheme(true);
    }

    // Listen for theme changes from other components (like settings page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const isDark = e.newValue === 'dark';
        setIsDarkMode(isDark);
        applyTheme(isDark);
      }
    };

    // Custom event listener for same-tab changes
    const handleThemeChange = (e: CustomEvent) => {
      const isDark = e.detail === 'dark';
      setIsDarkMode(isDark);
      applyTheme(isDark);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChange' as any, handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange' as any, handleThemeChange);
    };
  }, []);

  // Apply theme to the document
  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    const newTheme = newDarkMode ? 'dark' : 'light';
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newTheme);
    applyTheme(newDarkMode);

    // Dispatch custom event to notify settings page and other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };

  // Define navigation items based on user type
  const getNavItems = () => {
    switch (userType) {
      case 'customer':
        return [
          { icon: Home, label: 'Dashboard', href: '/customer/dashboard' },
          { icon: FileText, label: 'View Bills', href: '/customer/view-bills' },
          { icon: Calculator, label: 'Bill Calculator', href: '/customer/bill-calculator' },
          { icon: Gauge, label: 'Request Reading', href: '/customer/request-reading' },
          { icon: BarChart3, label: 'Analytics', href: '/customer/analytics' },
          { icon: DollarSign, label: 'Payment', href: '/customer/payment' },
          { icon: ZapOff, label: 'Outage Schedule', href: '/customer/outage-schedule' },
          { icon: MessageSquare, label: 'Support Tickets', href: '/customer/complaints' },
          { icon: Bell, label: 'Service Center', href: '/customer/services' },
          { icon: Settings, label: 'Settings', href: '/customer/settings' },
        ];
      case 'employee':
        return [
          { icon: Home, label: 'Dashboard', href: '/employee/dashboard' },
          { icon: Gauge, label: 'Meter Reading', href: '/employee/meter-reading' },
          { icon: Users, label: 'Customers', href: '/employee/customers' },
          { icon: FileText, label: 'Bill Generation', href: '/employee/bill-generation' },
          { icon: ClipboardList, label: 'Work Orders', href: '/employee/work-orders' },
          { icon: Settings, label: 'Settings', href: '/employee/settings' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
          { icon: Database, label: 'Import Data', href: '/admin/data-import' },
          { icon: Users, label: 'Customers', href: '/admin/customers' },
          { icon: Building, label: 'Employees', href: '/admin/employees' },
          { icon: FileText, label: 'Generate Bills', href: '/admin/bills/generate' },
          { icon: DollarSign, label: 'Tariffs', href: '/admin/tariffs' },
          { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
          { icon: Activity, label: 'Analytics', href: '/admin/analytics' },
          { icon: Settings, label: 'Settings', href: '/admin/settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getUserTypeColor = () => {
    switch (userType) {
      case 'admin': return 'from-red-500 to-pink-500';
      case 'employee': return 'from-green-500 to-emerald-500';
      default: return 'from-yellow-400 to-orange-500';
    }
  };

  const getUserTypeBadge = () => {
    switch (userType) {
      case 'admin': return 'Admin';
      case 'employee': return 'Employee';
      default: return 'Customer';
    }
  };

  // Mock notifications data
  const getNotifications = () => {
    const baseNotifications = [
      {
        id: 1,
        type: 'success',
        icon: CheckCircle,
        title: 'Payment Successful',
        message: 'Your bill payment of ₹2,450 has been processed',
        time: '5 min ago',
        read: false
      },
      {
        id: 2,
        type: 'info',
        icon: Info,
        title: 'New Bill Generated',
        message: 'Your electricity bill for January 2025 is ready',
        time: '2 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'warning',
        icon: AlertCircle,
        title: 'Scheduled Maintenance',
        message: 'Power outage scheduled for tomorrow 10 AM - 2 PM',
        time: '1 day ago',
        read: true
      },
      {
        id: 4,
        type: 'info',
        icon: Clock,
        title: 'Meter Reading Update',
        message: 'Your meter reading has been recorded: 1,234 kWh',
        time: '2 days ago',
        read: true
      }
    ];

    if (userType === 'employee') {
      return [
        {
          id: 1,
          type: 'warning',
          icon: AlertCircle,
          title: 'New Work Order',
          message: '5 new meter reading assignments in your area',
          time: '10 min ago',
          read: false
        },
        {
          id: 2,
          type: 'info',
          icon: Info,
          title: 'Customer Query',
          message: 'Customer #12345 has raised a billing query',
          time: '1 hour ago',
          read: false
        },
        ...baseNotifications.slice(2)
      ];
    }

    if (userType === 'admin') {
      return [
        {
          id: 1,
          type: 'warning',
          icon: AlertCircle,
          title: 'System Alert',
          message: 'High load detected in Zone-A. Immediate attention required',
          time: '15 min ago',
          read: false
        },
        {
          id: 2,
          type: 'info',
          icon: Info,
          title: 'Monthly Report Ready',
          message: 'Revenue report for January 2025 is available',
          time: '3 hours ago',
          read: false
        },
        {
          id: 3,
          type: 'success',
          icon: CheckCircle,
          title: 'Employee Added',
          message: 'New employee "Huzaifa" has been successfully onboarded',
          time: '1 day ago',
          read: true
        },
        ...baseNotifications.slice(2)
      ];
    }

    return baseNotifications;
  };

  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl rounded-full blur-3xl transition-opacity duration-500 ${
          isDarkMode ? 'from-yellow-400/5 to-transparent' : 'from-yellow-400/10 to-transparent'
        }`}></div>
        <div className={`absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr rounded-full blur-3xl transition-opacity duration-500 ${
          isDarkMode ? 'from-orange-500/5 to-transparent' : 'from-orange-500/10 to-transparent'
        }`}></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10'
          : 'bg-white/60 border-gray-200'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`lg:hidden p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-3 ml-4 lg:ml-0">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold transition-colors ${
                  isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
                }`}>Electrolux</span>
                <span className={`px-2 py-1 bg-gradient-to-r ${getUserTypeColor()} text-white text-xs rounded-full font-semibold`}>
                  {getUserTypeBadge()}
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600 dark:text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-10 pr-4 py-2 backdrop-blur-sm border rounded-lg focus:outline-none focus:border-yellow-400 transition-colors w-64 ${
                    isDarkMode
                      ? 'bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative p-2 rounded-lg transition-all ${
                    isDarkMode
                      ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className={`absolute right-0 mt-2 w-96 max-h-[500px] overflow-y-auto backdrop-blur-xl rounded-lg shadow-lg border ${
                    isDarkMode
                      ? 'bg-white dark:bg-black/80 border-gray-200 dark:border-white/10'
                      : 'bg-white/90 border-gray-200'
                  }`}>
                    {/* Header */}
                    <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-200 dark:border-white/10' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-yellow-400/20 text-yellow-400'
                              : 'bg-yellow-400/30 text-yellow-600'
                          }`}>
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="py-2">
                      {notifications.length === 0 ? (
                        <div className={`px-4 py-8 text-center ${
                          isDarkMode ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600'
                        }`}>
                          <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const NotificationIcon = notification.icon;
                          const iconColor =
                            notification.type === 'success' ? 'text-green-500' :
                            notification.type === 'warning' ? 'text-yellow-500' :
                            'text-blue-500';

                          return (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 transition-colors border-l-2 ${
                                !notification.read
                                  ? isDarkMode
                                    ? 'bg-yellow-400/5 border-yellow-400'
                                    : 'bg-yellow-400/10 border-yellow-400'
                                  : 'border-transparent'
                              } ${
                                isDarkMode
                                  ? 'hover:bg-white/5'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`mt-0.5 ${iconColor}`}>
                                  <NotificationIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <p className={`font-medium text-sm ${
                                      isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
                                    }`}>
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                    )}
                                  </div>
                                  <p className={`text-sm mt-1 ${
                                    isDarkMode ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <p className={`text-xs mt-1 ${
                                    isDarkMode ? 'text-gray-500 dark:text-gray-500' : 'text-gray-500'
                                  }`}>
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-gray-200 dark:border-white/10' : 'border-gray-200'}`}>
                        <button className={`text-sm font-medium transition-colors ${
                          isDarkMode
                            ? 'text-yellow-400 hover:text-yellow-300'
                            : 'text-yellow-600 hover:text-yellow-700'
                        }`}>
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                    isDarkMode ? 'hover:bg-gray-50 dark:bg-white/10' : 'hover:bg-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className={`hidden md:block transition-colors ${
                    isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
                  }`}>{userName}</span>
                  <ChevronDown className={`hidden md:block h-4 w-4 ${
                    isDarkMode ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600'
                  }`} />
                </button>

                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-48 backdrop-blur-xl rounded-lg shadow-lg border py-2 ${
                    isDarkMode
                      ? 'bg-white dark:bg-black/80 border-gray-200 dark:border-white/10'
                      : 'bg-white/90 border-gray-200'
                  }`}>
                    <Link href={`/${userType}/profile`} className={`flex items-center px-4 py-2 transition-colors ${
                      isDarkMode
                        ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link href={`/${userType}/settings`} className={`flex items-center px-4 py-2 transition-colors ${
                      isDarkMode
                        ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <hr className={`my-2 ${isDarkMode ? 'border-gray-200 dark:border-white/10' : 'border-gray-200'}`} />
                    <button className={`flex items-center w-full px-4 py-2 transition-colors ${
                      isDarkMode
                        ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-30 w-64 backdrop-blur-xl border-r transform transition-all duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        isDarkMode
          ? 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10'
          : 'bg-white/60 border-gray-200'
      }`}>
        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border border-yellow-400/50'
                        : 'bg-gradient-to-r from-yellow-400/30 to-orange-500/30 text-gray-900 border border-yellow-400/60'
                      : isDarkMode
                      ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-white/10'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 lg:pl-64`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
