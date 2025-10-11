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
  MessageSquare
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'employee' | 'admin';
  userName?: string;
}

export default function DashboardLayout({ children, userType, userName = 'User' }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    applyTheme(newDarkMode);
  };

  // Define navigation items based on user type
  const getNavItems = () => {
    switch (userType) {
      case 'customer':
        return [
          { icon: Home, label: 'Dashboard', href: '/customer/dashboard' },
          { icon: FileText, label: 'Bills', href: '/customer/bills' },
          { icon: BarChart3, label: 'Analytics', href: '/customer/analytics' },
          { icon: DollarSign, label: 'Payment', href: '/customer/payment' },
          { icon: Bell, label: 'Service Center', href: '/customer/services' },
          { icon: MessageSquare, label: 'Complaints', href: '/customer/complaints' },
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
          { icon: Users, label: 'Customers', href: '/admin/customers' },
          { icon: Building, label: 'Employees', href: '/admin/employees' },
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
          ? 'bg-black/20 border-white/10'
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
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
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
                  isDarkMode ? 'text-white' : 'text-gray-900'
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
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-10 pr-4 py-2 backdrop-blur-sm border rounded-lg focus:outline-none focus:border-yellow-400 transition-colors w-64 ${
                    isDarkMode
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button className={`relative p-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                    isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className={`hidden md:block transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{userName}</span>
                  <ChevronDown className={`hidden md:block h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </button>

                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-48 backdrop-blur-xl rounded-lg shadow-lg border py-2 ${
                    isDarkMode
                      ? 'bg-black/80 border-white/10'
                      : 'bg-white/90 border-gray-200'
                  }`}>
                    <Link href={`/${userType}/profile`} className={`flex items-center px-4 py-2 transition-colors ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link href={`/${userType}/settings`} className={`flex items-center px-4 py-2 transition-colors ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <hr className={`my-2 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`} />
                    <button className={`flex items-center w-full px-4 py-2 transition-colors ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
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
          ? 'bg-black/20 border-white/10'
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
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
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
