'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  CreditCard,
  Download,
  Loader2,
  X,
  Mail
} from 'lucide-react';

export default function CustomerSettings() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState('security');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    billReminders: true,
    paymentConfirmations: true,
    serviceAlerts: true,
    promotionalOffers: false,
    newsletter: false
  });

  const [preferences, setPreferences] = useState({
    language: 'english',
    dateFormat: 'DD/MM/YYYY',
    currency: 'PKR',
    autoPayment: false,
    paperlessBilling: true,
    theme: 'auto'
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to change password');
      }

      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(null), 5000);

    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      const response = await fetch('/api/customers/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationSettings }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save notification preferences');
      }

      setSuccess('Notification preferences saved successfully!');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      const response = await fetch('/api/customers/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save preferences');
      }

      setSuccess('Preferences saved successfully!');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'billing', label: 'Billing Settings', icon: CreditCard }
  ];

  return (
    <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-400 font-semibold">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10">
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setError(null);
                      setSuccess(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {Object.entries({
                      emailNotifications: 'Email Notifications',
                      smsNotifications: 'SMS Notifications',
                      pushNotifications: 'Push Notifications',
                      billReminders: 'Bill Reminders',
                      paymentConfirmations: 'Payment Confirmations',
                      serviceAlerts: 'Service Alerts',
                      promotionalOffers: 'Promotional Offers',
                      newsletter: 'Newsletter'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          {key.includes('email') && <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                          {key.includes('sms') && <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                          {key.includes('push') && <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                          {!key.includes('email') && !key.includes('sms') && !key.includes('push') &&
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          }
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings[key as keyof typeof notificationSettings]}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked
                          })}
                          className="w-5 h-5"
                        />
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Security Settings
                  </h2>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="px-6 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    General Preferences
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400 font-medium"
                      >
                        <option value="english" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">English</option>
                        <option value="spanish" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Spanish</option>
                        <option value="french" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">French</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Format
                      </label>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400 font-medium"
                      >
                        <option value="MM/DD/YYYY" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400 font-medium"
                      >
                        <option value="PKR" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">PKR (Rs.)</option>
                        <option value="USD" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">USD ($)</option>
                        <option value="EUR" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">EUR (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Theme
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400 font-medium"
                      >
                        <option value="light" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Light</option>
                        <option value="dark" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Dark</option>
                        <option value="auto" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Auto (System)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Billing Settings */}
              {activeSection === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Billing Settings
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto Payment</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically pay bills on due date
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.autoPayment}
                        onChange={(e) => setPreferences({...preferences, autoPayment: e.target.checked})}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Paperless Billing</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive bills via email only
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.paperlessBilling}
                        onChange={(e) => setPreferences({...preferences, paperlessBilling: e.target.checked})}
                        className="w-5 h-5"
                      />
                    </label>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Billing History
                    </h3>
                    <button className="px-6 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all flex items-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Download All Statements</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}