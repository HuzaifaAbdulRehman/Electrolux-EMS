'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Settings,
  Shield,
  Database,
  Globe,
  Users,
  CreditCard,
  Bell,
  Mail,
  Lock,
  Key,
  Server,
  Cloud,
  Save,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  DollarSign,
  Calendar,
  Clock,
  Languages,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      companyName: 'Electrolux Distribution Co.',
      timezone: 'UTC-5',
      currency: 'USD',
      language: 'English',
      dateFormat: 'MM/DD/YYYY',
      fiscalYearStart: 'January',
      autoLogout: '60',
      maintenanceMode: false
    },
    billing: {
      billingCycle: 'monthly',
      paymentDueDays: '15',
      lateFeePercentage: '2',
      gracePeriod: '5',
      autoGenerateBills: true,
      enableAutoPay: true,
      taxRate: '15',
      minimumPayment: '10'
    },
    security: {
      passwordMinLength: '8',
      passwordComplexity: true,
      twoFactorAuth: 'optional',
      sessionTimeout: '30',
      maxLoginAttempts: '5',
      ipWhitelist: false,
      apiRateLimit: '100',
      dataEncryption: true,
      auditLogging: true,
      backupFrequency: 'daily'
    },
    system: {
      apiKey: 'sk_live_4eC39HqLyjWDarjtT1zdp7dc',
      databaseBackup: 'daily',
      logRetention: '90',
      cacheEnabled: true,
      cdnEnabled: true,
      debugMode: false,
      performanceMonitoring: true,
      errorTracking: true,
      analyticsEnabled: true
    }
  });

  const sections = [
    { id: 'general', name: 'General Settings', icon: Settings },
    { id: 'billing', name: 'Billing Configuration', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Server }
  ];

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const handleToggle = (section: string, setting: string) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [setting]: !settings[section as keyof typeof settings][setting as keyof typeof settings[keyof typeof settings]]
      }
    });
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Configure global system settings and preferences</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {saveStatus === 'saved' && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-lg border border-green-500/50">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">Settings Saved</span>
                </div>
              )}
              <button
                onClick={handleSaveSettings}
                disabled={saveStatus === 'saving'}
                className={`px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg transition-all flex items-center space-x-2 font-semibold ${
                  saveStatus === 'saving' ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-pink-500/50'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between group ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-white border border-red-500/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <section.icon className="w-5 h-5" />
                      <span>{section.name}</span>
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      activeSection === section.id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </button>
                ))}
              </nav>

              {/* System Status */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-white font-semibold mb-3">System Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Version</span>
                    <span className="text-gray-900 dark:text-white text-sm">v2.4.1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Status</span>
                    <span className="text-green-400 text-sm">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Last Backup</span>
                    <span className="text-gray-900 dark:text-white text-sm">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeSection === 'general' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">General Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Company Name</label>
                    <input
                      type="text"
                      value={settings.general.companyName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, companyName: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, timezone: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                    >
                      <option value="UTC-5" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">UTC-5 (Eastern)</option>
                      <option value="UTC-6" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">UTC-6 (Central)</option>
                      <option value="UTC-7" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">UTC-7 (Mountain)</option>
                      <option value="UTC-8" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">UTC-8 (Pacific)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, currency: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                    >
                      <option value="USD" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">USD ($)</option>
                      <option value="EUR" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">EUR (€)</option>
                      <option value="GBP" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">GBP (£)</option>
                      <option value="INR" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">INR (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Language</label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, language: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                    >
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">English</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Spanish</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">French</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Date Format</label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, dateFormat: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                    >
                      <option value="MM/DD/YYYY" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Fiscal Year Start</label>
                    <select
                      value={settings.general.fiscalYearStart}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, fiscalYearStart: e.target.value }
                      })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                    >
                      <option value="January" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">January</option>
                      <option value="April" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">April</option>
                      <option value="July" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">July</option>
                      <option value="October" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">October</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-semibold">Maintenance Mode</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Temporarily disable user access for system updates</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('general', 'maintenanceMode')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.general.maintenanceMode
                          ? 'bg-gradient-to-r from-red-500 to-rose-500'
                          : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                        settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Billing Configuration</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Billing Cycle</label>
                      <select
                        value={settings.billing.billingCycle}
                        onChange={(e) => setSettings({
                          ...settings,
                          billing: { ...settings.billing, billingCycle: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                      >
                        <option value="monthly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Monthly</option>
                        <option value="bimonthly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Bi-Monthly</option>
                        <option value="quarterly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Quarterly</option>
                        <option value="annually" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Annually</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Payment Due Days</label>
                      <input
                        type="number"
                        value={settings.billing.paymentDueDays}
                        onChange={(e) => setSettings({
                          ...settings,
                          billing: { ...settings.billing, paymentDueDays: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Late Fee (%)</label>
                      <input
                        type="number"
                        value={settings.billing.lateFeePercentage}
                        onChange={(e) => setSettings({
                          ...settings,
                          billing: { ...settings.billing, lateFeePercentage: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Grace Period (Days)</label>
                      <input
                        type="number"
                        value={settings.billing.gracePeriod}
                        onChange={(e) => setSettings({
                          ...settings,
                          billing: { ...settings.billing, gracePeriod: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settings.billing.taxRate}
                        onChange={(e) => setSettings({
                          ...settings,
                          billing: { ...settings.billing, taxRate: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Payment ($)</label>
                      <input
                        type="number"
                        value={settings.billing.minimumPayment}
                        onChange={(e) => setSettings({
                          ...settings,
                          billing: { ...settings.billing, minimumPayment: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-lg">
                      <div>
                        <span className="text-gray-900 dark:text-white">Auto-Generate Bills</span>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Automatically create bills at cycle end</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.billing.autoGenerateBills}
                        onChange={() => handleToggle('billing', 'autoGenerateBills')}
                        className="w-5 h-5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-red-400"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-lg">
                      <div>
                        <span className="text-gray-900 dark:text-white">Enable Auto-Pay</span>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Allow customers to set up automatic payments</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.billing.enableAutoPay}
                        onChange={() => handleToggle('billing', 'enableAutoPay')}
                        className="w-5 h-5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-red-400"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Password Min Length</label>
                      <input
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, passwordMinLength: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Two-Factor Authentication</label>
                      <select
                        value={settings.security.twoFactorAuth}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorAuth: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                      >
                        <option value="disabled" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Disabled</option>
                        <option value="optional" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Optional</option>
                        <option value="required" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Required</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Login Attempts</label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, maxLoginAttempts: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">API Rate Limit (per hour)</label>
                      <input
                        type="number"
                        value={settings.security.apiRateLimit}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, apiRateLimit: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Backup Frequency</label>
                      <select
                        value={settings.security.backupFrequency}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, backupFrequency: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-red-400 font-medium"
                      >
                        <option value="hourly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Hourly</option>
                        <option value="daily" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Daily</option>
                        <option value="weekly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Weekly</option>
                        <option value="monthly" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'passwordComplexity', label: 'Password Complexity', desc: 'Require uppercase, lowercase, numbers, and symbols' },
                      { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict access to specific IP addresses' },
                      { key: 'dataEncryption', label: 'Data Encryption', desc: 'Encrypt sensitive data at rest' },
                      { key: 'auditLogging', label: 'Audit Logging', desc: 'Log all system activities and changes' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-lg">
                        <div>
                          <span className="text-gray-900 dark:text-white">{item.label}</span>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(settings.security[item.key as keyof typeof settings.security])}
                          onChange={() => handleToggle('security', item.key)}
                          className="w-5 h-5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-red-400"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'system' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Configuration</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-white dark:bg-white/5 rounded-lg">
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">API Key</label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={settings.system.apiKey}
                        readOnly
                        className="w-full pr-24 px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 dark:hover:text-white transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'cacheEnabled', label: 'Cache Enabled', desc: 'Enable caching for better performance' },
                      { key: 'cdnEnabled', label: 'CDN Enabled', desc: 'Use content delivery network' },
                      { key: 'debugMode', label: 'Debug Mode', desc: 'Enable detailed error logging' },
                      { key: 'performanceMonitoring', label: 'Performance Monitoring', desc: 'Track system performance metrics' },
                      { key: 'errorTracking', label: 'Error Tracking', desc: 'Log and track application errors' },
                      { key: 'analyticsEnabled', label: 'Analytics', desc: 'Enable usage analytics' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-lg">
                        <div>
                          <span className="text-gray-900 dark:text-white">{item.label}</span>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(settings.system[item.key as keyof typeof settings.system])}
                          onChange={() => handleToggle('system', item.key)}
                          className="w-5 h-5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-red-400"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
