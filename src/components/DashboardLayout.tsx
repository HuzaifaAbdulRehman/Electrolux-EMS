'use client';

import React, { useState } from 'react';
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
  ClipboardList
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

  // Define navigation items based on user type
  const getNavItems = () => {
    switch (userType) {
      case 'customer':
        return [
          { icon: Home, label: 'Dashboard', href: '/customer/dashboard' },
          { icon: FileText, label: 'Bills', href: '/customer/bills' },
          { icon: BarChart3, label: 'Usage', href: '/customer/usage' },
          { icon: Bell, label: 'Notifications', href: '/customer/notifications' },
          { icon: Settings, label: 'Settings', href: '/customer/settings' },
        ];
      case 'employee':
        return [
          { icon: Home, label: 'Dashboard', href: '/employee/dashboard' },
          { icon: Gauge, label: 'Meter Reading', href: '/employee/meter-reading' },
          { icon: Users, label: 'Customers', href: '/employee/customers' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-yellow-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-3 ml-4 lg:ml-0">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Electrolux</span>
                <span className={`px-2 py-1 bg-gradient-to-r ${getUserTypeColor()} text-white text-xs rounded-full font-semibold`}>
                  {getUserTypeBadge()}
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors w-64"
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden md:block text-white">{userName}</span>
                  <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl rounded-lg shadow-lg border border-white/10 py-2">
                    <Link href={`/${userType}/profile`} className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link href={`/${userType}/settings`} className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <hr className="my-2 border-white/10" />
                    <button className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
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
      <aside className={`fixed left-0 top-16 bottom-0 z-30 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border border-yellow-400/50'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
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
