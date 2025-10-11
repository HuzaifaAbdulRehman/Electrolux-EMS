'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  User,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Save,
  AlertCircle,
  CheckCircle,
  Lock,
  Smartphone,
  Monitor,
  Globe,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Languages,
  CreditCard,
  FileText,
  Download
} from 'lucide-react';

export default function CustomerSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    accountNumber: 'ELX-2024-001234',
    meterNumber: 'MTR-485729'
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
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    autoPayment: false,
    paperlessBilling: true,
    theme: 'auto'
  });

  const handleSaveProfile = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic
    console.log('Password change submitted');
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'billing', label: 'Billing Settings', icon: CreditCard }
  ];

  return (
    <DashboardLayout userType="customer" userName="John Doe">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10">
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
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
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Account Information</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Account Number: <span className="font-mono">{profileData.accountNumber}</span>
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Meter Number: <span className="font-mono">{profileData.meterNumber}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}

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

                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                    Save Preferences
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
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                    >
                      Update Password
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
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Format
                      </label>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-400"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                    Save Preferences
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