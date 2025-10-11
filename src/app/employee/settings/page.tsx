'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Settings,
  Bell,
  Shield,
  Calendar,
  MapPin,
  Clock,
  Sun,
  Moon,
  Mail,
  Smartphone,
  Lock,
  Key,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Navigation,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Languages,
  Monitor,
  Battery,
  Wifi,
  Wrench
} from 'lucide-react';

export default function EmployeeSettings() {
  const [activeSection, setActiveSection] = useState('work');
  const [showPassword, setShowPassword] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Initialize and handle theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    setSettings(prev => ({
      ...prev,
      device: { ...prev.device, theme: savedTheme as 'dark' | 'light' }
    }));

    // Listen for theme changes from header toggle
    const handleThemeChangeEvent = (e: CustomEvent) => {
      const newTheme = e.detail;
      setCurrentTheme(newTheme);
      setSettings(prev => ({
        ...prev,
        device: { ...prev.device, theme: newTheme }
      }));
    };

    window.addEventListener('themeChange' as any, handleThemeChangeEvent);

    return () => {
      window.removeEventListener('themeChange' as any, handleThemeChangeEvent);
    };
  }, []);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    setSettings({
      ...settings,
      device: { ...settings.device, theme }
    });

    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }

    // Dispatch custom event to notify DashboardLayout
    window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
  };

  const [settings, setSettings] = useState({
    work: {
      autoAcceptTasks: false,
      maxDailyTasks: '5',
      preferredZones: ['North', 'East'],
      workingHours: '8:00 AM - 5:00 PM',
      breakReminders: true,
      overtimeAlerts: true,
      taskPriority: 'distance'
    },
    notifications: {
      newTaskAlert: true,
      urgentTaskAlert: true,
      taskReminders: true,
      scheduleChanges: true,
      systemUpdates: false,
      performanceReports: true,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      soundAlerts: true
    },
    device: {
      gpsTracking: true,
      offlineMode: true,
      dataSaver: false,
      autoSync: true,
      syncInterval: '15',
      batteryOptimization: true,
      theme: 'dark'
    },
    security: {
      biometricLogin: false,
      autoLogout: '30',
      locationSharing: true,
      dataBackup: true
    }
  });

  const sections = [
    { id: 'work', name: 'Work Preferences', icon: Briefcase },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'device', name: 'Device & App', icon: Monitor },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'account', name: 'Account', icon: Settings }
  ];

  const zones = ['North', 'South', 'East', 'West', 'Central'];

  const handleToggle = (section: string, setting: string) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [setting]: !settings[section as keyof typeof settings][setting as keyof typeof settings[keyof typeof settings]]
      }
    });
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Save settings logic here
  };

  return (
    <DashboardLayout userType="employee" userName="Mike Johnson">
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your work preferences and account settings</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center space-x-2 font-semibold text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Settings Menu</h2>
              <nav className="space-y-1.5">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full px-3 py-2.5 rounded-lg text-left transition-all flex items-center justify-between group text-sm ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-500/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center space-x-2.5">
                      <section.icon className="w-4 h-4" />
                      <span>{section.name}</span>
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                      activeSection === section.id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeSection === 'work' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Work Preferences</h2>

                <div className="space-y-4">
                  {/* Task Management */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Task Management</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Auto-Accept Tasks</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Automatically accept assigned tasks</p>
                        </div>
                        <button
                          onClick={() => handleToggle('work', 'autoAcceptTasks')}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.work.autoAcceptTasks
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-white/20'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                            settings.work.autoAcceptTasks ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                        <label className="text-sm text-gray-900 dark:text-white block mb-1.5">Max Daily Tasks</label>
                        <select
                          value={settings.work.maxDailyTasks}
                          onChange={(e) => setSettings({
                            ...settings,
                            work: { ...settings.work, maxDailyTasks: e.target.value }
                          })}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400 font-medium"
                        >
                          <option value="3" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">3 tasks</option>
                          <option value="5" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">5 tasks</option>
                          <option value="8" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">8 tasks</option>
                          <option value="10" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">10 tasks</option>
                          <option value="unlimited" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Unlimited</option>
                        </select>
                      </div>

                      <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                        <label className="text-sm text-gray-900 dark:text-white block mb-1.5">Task Priority</label>
                        <select
                          value={settings.work.taskPriority}
                          onChange={(e) => setSettings({
                            ...settings,
                            work: { ...settings.work, taskPriority: e.target.value }
                          })}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400 font-medium"
                        >
                          <option value="distance" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Nearest first</option>
                          <option value="priority" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">High priority first</option>
                          <option value="deadline" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Earliest deadline</option>
                          <option value="type" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">By task type</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Work Zones */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Preferred Work Zones</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {zones.map((zone) => (
                        <label
                          key={zone}
                          className="flex items-center space-x-2 p-2.5 bg-white dark:bg-white/5 rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10"
                        >
                          <input
                            type="checkbox"
                            checked={settings.work.preferredZones.includes(zone)}
                            onChange={(e) => {
                              const newZones = e.target.checked
                                ? [...settings.work.preferredZones, zone]
                                : settings.work.preferredZones.filter(z => z !== zone);
                              setSettings({
                                ...settings,
                                work: { ...settings.work, preferredZones: newZones }
                              });
                            }}
                            className="w-4 h-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-green-400"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{zone} Zone</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Work Hours */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Working Hours</h3>
                    <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                      <label className="text-sm text-gray-900 dark:text-white block mb-1.5">Shift Timing</label>
                      <input
                        type="text"
                        value={settings.work.workingHours}
                        onChange={(e) => setSettings({
                          ...settings,
                          work: { ...settings.work, workingHours: e.target.value }
                        })}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <label className="flex items-center justify-between p-2.5 bg-white dark:bg-white/5 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Break Reminders</span>
                        <input
                          type="checkbox"
                          checked={settings.work.breakReminders}
                          onChange={() => handleToggle('work', 'breakReminders')}
                          className="w-4 h-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-green-400"
                        />
                      </label>
                      <label className="flex items-center justify-between p-2.5 bg-white dark:bg-white/5 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Overtime Alerts</span>
                        <input
                          type="checkbox"
                          checked={settings.work.overtimeAlerts}
                          onChange={() => handleToggle('work', 'overtimeAlerts')}
                          className="w-4 h-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-green-400"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>

                <div className="space-y-4">
                  {/* Communication Channels */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Communication Channels</h3>
                    <div className="space-y-2.5">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                        { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone },
                        { key: 'pushNotifications', label: 'Push Notifications', icon: Bell },
                        { key: 'soundAlerts', label: 'Sound Alerts', icon: Volume2 }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2.5">
                            <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">{item.label}</span>
                          </div>
                          <button
                            onClick={() => handleToggle('notifications', item.key)}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              settings.notifications[item.key as keyof typeof settings.notifications]
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-white/20'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                              settings.notifications[item.key as keyof typeof settings.notifications]
                                ? 'translate-x-6'
                                : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Notification Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {[
                        { key: 'newTaskAlert', label: 'New Task Assigned' },
                        { key: 'urgentTaskAlert', label: 'Urgent Tasks' },
                        { key: 'taskReminders', label: 'Task Reminders' },
                        { key: 'scheduleChanges', label: 'Schedule Changes' },
                        { key: 'systemUpdates', label: 'System Updates' },
                        { key: 'performanceReports', label: 'Performance Reports' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center space-x-2.5 p-2.5 bg-white dark:bg-white/5 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                            onChange={() => handleToggle('notifications', item.key)}
                            className="w-4 h-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-green-400"
                          />
                          <span className="text-gray-900 dark:text-white text-xs">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'device' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Device & App Settings</h2>

                <div className="space-y-4">
                  {/* App Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-2.5">
                        <Navigation className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">GPS Tracking</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Share location for task routing</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('device', 'gpsTracking')}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.device.gpsTracking
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-white/20'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                          settings.device.gpsTracking ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-2.5">
                        <Wifi className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Offline Mode</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Work without internet connection</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('device', 'offlineMode')}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.device.offlineMode
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-white/20'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                          settings.device.offlineMode ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-2.5">
                        <Battery className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Battery Optimization</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Reduce battery consumption</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle('device', 'batteryOptimization')}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.device.batteryOptimization
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-white/20'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                          settings.device.batteryOptimization ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                      <label className="text-sm text-gray-900 dark:text-white block mb-1.5">Auto Sync Interval</label>
                      <select
                        value={settings.device.syncInterval}
                        onChange={(e) => setSettings({
                          ...settings,
                          device: { ...settings.device, syncInterval: e.target.value }
                        })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400 font-medium"
                      >
                        <option value="5" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Every 5 minutes</option>
                        <option value="15" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Every 15 minutes</option>
                        <option value="30" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Every 30 minutes</option>
                        <option value="60" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Every hour</option>
                      </select>
                    </div>

                    <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                      <label className="text-sm text-gray-900 dark:text-white block mb-1.5">Theme</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 text-sm ${
                            currentTheme === 'dark'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" />
                          <span>Dark</span>
                        </button>
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 text-sm ${
                            currentTheme === 'light'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5" />
                          <span>Light</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Settings</h2>

                <div className="space-y-4">
                  {/* Password Change */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Change Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-700 dark:text-gray-300 mb-1.5 block">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-green-400"
                            placeholder="Enter current password"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-700 dark:text-gray-300 mb-1.5 block">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-green-400"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-700 dark:text-gray-300 mb-1.5 block">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-green-400"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all font-semibold text-sm">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Security Options */}
                  <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Security Options</h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Biometric Login</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Use fingerprint or face ID</p>
                        </div>
                        <button
                          onClick={() => handleToggle('security', 'biometricLogin')}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.security.biometricLogin
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-white/20'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                            settings.security.biometricLogin ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div className="p-3 bg-white dark:bg-white/5 rounded-lg">
                        <label className="text-sm text-gray-900 dark:text-white block mb-1.5">Auto Logout</label>
                        <select
                          value={settings.security.autoLogout}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, autoLogout: e.target.value }
                          })}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-400 font-medium"
                        >
                          <option value="15" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">15 minutes</option>
                          <option value="30" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">30 minutes</option>
                          <option value="60" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">1 hour</option>
                          <option value="never" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Never</option>
                        </select>
                      </div>

                      <label className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Location Sharing</span>
                        <input
                          type="checkbox"
                          checked={settings.security.locationSharing}
                          onChange={() => handleToggle('security', 'locationSharing')}
                          className="w-4 h-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-green-400"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Automatic Data Backup</span>
                        <input
                          type="checkbox"
                          checked={settings.security.dataBackup}
                          onChange={() => handleToggle('security', 'dataBackup')}
                          className="w-4 h-4 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-green-400"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Settings</h2>

                <div className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-white font-semibold">Account Status: Active</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Last login: Today at 8:30 AM</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                      <span className="flex items-center space-x-2.5">
                        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Export Data</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Download your work history</p>
                        </div>
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                      <span className="flex items-center space-x-2.5">
                        <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Import Settings</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Restore from backup</p>
                        </div>
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full p-3 bg-white dark:bg-white/5 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all flex items-center justify-between group">
                      <span className="flex items-center space-x-2.5">
                        <Languages className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Language</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">English (US)</p>
                        </div>
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
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
