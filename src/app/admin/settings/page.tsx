'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Settings,
  Building,
  CreditCard,
  Zap,
  Users,
  FileText,
  Bell,
  ChevronRight,
  Loader2,
  Save,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  UserCog,
  BarChart3,
  CloudOff,
  Monitor,
  Moon,
  Sun,
  Palette
} from 'lucide-react';

export default function AdminSettingsHub() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeSuccess, setThemeSuccess] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Electrolux EMS',
    supportEmail: 'support@electrolux.com',
    supportPhone: '0300-1234567'
  });

  const [billingConfig, setBillingConfig] = useState({
    paymentDueDays: '15',
    lateFeePercentage: '2',
    taxRate: '15'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        if (result.data.general) {
          setCompanyInfo(prev => ({
            ...prev,
            companyName: result.data.general.company_name || prev.companyName
          }));
        }
        if (result.data.billing) {
          setBillingConfig({
            paymentDueDays: result.data.billing.payment_due_days || billingConfig.paymentDueDays,
            lateFeePercentage: result.data.billing.late_fee_percentage || billingConfig.lateFeePercentage,
            taxRate: result.data.billing.tax_rate || billingConfig.taxRate
          });
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBilling = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const settings = {
        billing: billingConfig
      };

      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save settings');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Management sections that link to specific pages
  const managementSections = [
    {
      title: 'Tariff Management',
      description: 'Configure electricity tariff rates for different customer types',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      link: '/admin/tariffs',
      enabled: true
    },
    {
      title: 'Employee Management',
      description: 'Manage employees, assignments, and work schedules',
      icon: UserCog,
      color: 'from-green-500 to-emerald-500',
      link: '/admin/employees',
      enabled: true
    },
    {
      title: 'Customer Management',
      description: 'View and manage customer accounts and meter connections',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/customers',
      enabled: true
    },
    {
      title: 'Connection Requests',
      description: 'Review and approve new meter connection applications',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/connection-requests',
      enabled: true
    },
    {
      title: 'Outage Management',
      description: 'Schedule and manage power outage notifications',
      icon: CloudOff,
      color: 'from-orange-500 to-red-500',
      link: '/admin/outages',
      enabled: true
    },
    {
      title: 'Notifications Center',
      description: 'Manage system notifications and alerts',
      icon: Bell,
      color: 'from-indigo-500 to-purple-500',
      link: '/admin/notifications',
      enabled: true
    },
    {
      title: 'Analytics & Reports',
      description: 'View system analytics and generate reports',
      icon: BarChart3,
      color: 'from-teal-500 to-green-500',
      link: '/admin/analytics',
      enabled: true
    }
  ];

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Admin">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings & Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Central hub for all system configuration and management</p>
            </div>
          </div>
        </div>

        {/* Company Information (Read-Only) */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <Building className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Company Information</h2>
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Read Only</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Company Name</p>
              <p className="text-gray-900 dark:text-white font-semibold">{companyInfo.companyName}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Support Email</p>
              <p className="text-gray-900 dark:text-white font-semibold">{companyInfo.supportEmail}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Support Phone</p>
              <p className="text-gray-900 dark:text-white font-semibold">{companyInfo.supportPhone}</p>
            </div>
          </div>
        </div>

        {/* Billing Configuration (Editable) */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Billing Configuration</h2>
            </div>
            <button
              onClick={handleSaveBilling}
              disabled={saving}
              className={`px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg transition-all flex items-center space-x-2 font-semibold ${
                saving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-pink-500/50'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {success && (
            <div className="mb-4 flex items-center space-x-2 px-4 py-3 bg-green-500/20 rounded-lg border border-green-500/50">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Billing settings saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center space-x-2 px-4 py-3 bg-red-500/20 rounded-lg border border-red-500/50">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">Payment Due Days</label>
              <input
                type="number"
                value={billingConfig.paymentDueDays}
                onChange={(e) => setBillingConfig({ ...billingConfig, paymentDueDays: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                min="1"
                max="90"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Days after bill generation</p>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">Late Fee (%)</label>
              <input
                type="number"
                value={billingConfig.lateFeePercentage}
                onChange={(e) => setBillingConfig({ ...billingConfig, lateFeePercentage: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Percentage of bill amount</p>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block font-medium">Tax Rate (%)</label>
              <input
                type="number"
                value={billingConfig.taxRate}
                onChange={(e) => setBillingConfig({ ...billingConfig, taxRate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Applied to all bills</p>
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Display Preferences</h2>
          </div>

          {themeSuccess && (
            <div className="mb-4 flex items-center space-x-2 px-4 py-3 bg-green-500/20 rounded-lg border border-green-500/50">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Theme preference saved successfully!</span>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block font-medium">Theme Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Light Theme */}
              <button
                onClick={() => {
                  setTheme('light');
                  setSavingTheme(true);
                  setThemeSuccess(true);
                  setTimeout(() => {
                    setSavingTheme(false);
                    setThemeSuccess(false);
                  }, 2000);
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-300 dark:border-white/20 hover:border-red-400'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <span className={`font-semibold ${theme === 'light' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    Light
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Light color scheme
                  </span>
                </div>
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => {
                  setTheme('dark');
                  setSavingTheme(true);
                  setThemeSuccess(true);
                  setTimeout(() => {
                    setSavingTheme(false);
                    setThemeSuccess(false);
                  }, 2000);
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-300 dark:border-white/20 hover:border-red-400'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    Dark
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Dark color scheme
                  </span>
                </div>
              </button>

              {/* System Theme */}
              <button
                onClick={() => {
                  setTheme('system');
                  setSavingTheme(true);
                  setThemeSuccess(true);
                  setTimeout(() => {
                    setSavingTheme(false);
                    setThemeSuccess(false);
                  }, 2000);
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'system'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-300 dark:border-white/20 hover:border-red-400'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-lg ${theme === 'system' ? 'bg-red-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>
                    <Monitor className={`w-6 h-6 ${theme === 'system' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <span className={`font-semibold ${theme === 'system' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    System
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Follow system preference
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Management Hub - Navigation Cards */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Management Hub</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Quick access to all system management features</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managementSections.map((section, index) => (
              <button
                key={index}
                onClick={() => router.push(section.link)}
                disabled={!section.enabled}
                className={`group p-6 bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:shadow-xl transition-all text-left ${
                  section.enabled ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${section.color} rounded-xl`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{section.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
