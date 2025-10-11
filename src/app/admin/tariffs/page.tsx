'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  DollarSign,
  Zap,
  Settings,
  Edit2,
  Save,
  Sun,
  Moon,
  CloudRain,
  Home,
  Building,
  Factory,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function TariffManagement() {
  const [selectedCategory, setSelectedCategory] = useState('residential');

  const categories = [
    { id: 'residential', name: 'Residential', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { id: 'commercial', name: 'Commercial', icon: Building, color: 'from-green-500 to-emerald-500' },
    { id: 'industrial', name: 'Industrial', icon: Factory, color: 'from-purple-500 to-pink-500' },
    { id: 'agricultural', name: 'Agricultural', icon: CloudRain, color: 'from-yellow-400 to-orange-500' }
  ];

  const tariffStructure = {
    residential: {
      fixedCharge: 50,
      slabs: [
        { range: '0-100 kWh', rate: 0.08 },
        { range: '101-200 kWh', rate: 0.10 },
        { range: '201-300 kWh', rate: 0.12 },
        { range: '301-500 kWh', rate: 0.15 },
        { range: '500+ kWh', rate: 0.18 }
      ],
      timeOfUse: {
        peak: { hours: '6PM-10PM', rate: 0.20 },
        normal: { hours: '6AM-6PM', rate: 0.12 },
        offPeak: { hours: '10PM-6AM', rate: 0.06 }
      }
    },
    commercial: {
      fixedCharge: 100,
      slabs: [
        { range: '0-500 kWh', rate: 0.10 },
        { range: '501-1000 kWh', rate: 0.12 },
        { range: '1001-2000 kWh', rate: 0.14 },
        { range: '2001-5000 kWh', rate: 0.16 },
        { range: '5000+ kWh', rate: 0.18 }
      ],
      timeOfUse: {
        peak: { hours: '9AM-5PM', rate: 0.22 },
        normal: { hours: '5PM-9PM', rate: 0.15 },
        offPeak: { hours: '9PM-9AM', rate: 0.08 }
      }
    },
    industrial: {
      fixedCharge: 200,
      slabs: [
        { range: '0-1000 kWh', rate: 0.09 },
        { range: '1001-5000 kWh', rate: 0.11 },
        { range: '5001-10000 kWh', rate: 0.13 },
        { range: '10001-20000 kWh', rate: 0.14 },
        { range: '20000+ kWh', rate: 0.15 }
      ],
      timeOfUse: {
        peak: { hours: '8AM-10PM', rate: 0.18 },
        normal: { hours: '6AM-8AM', rate: 0.12 },
        offPeak: { hours: '10PM-6AM', rate: 0.06 }
      }
    },
    agricultural: {
      fixedCharge: 30,
      slabs: [
        { range: '0-200 kWh', rate: 0.05 },
        { range: '201-500 kWh', rate: 0.07 },
        { range: '501-1000 kWh', rate: 0.09 },
        { range: '1001-2000 kWh', rate: 0.11 },
        { range: '2000+ kWh', rate: 0.13 }
      ],
      timeOfUse: {
        peak: { hours: '6AM-10AM', rate: 0.08 },
        normal: { hours: '10AM-6PM', rate: 0.06 },
        offPeak: { hours: '6PM-6AM', rate: 0.04 }
      }
    }
  };

  const currentTariff = tariffStructure[selectedCategory as keyof typeof tariffStructure] || tariffStructure.residential;

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tariff Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Configure electricity rates and pricing structures</p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative group ${selectedCategory === category.id ? 'scale-105' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-xl blur-xl opacity-${selectedCategory === category.id ? '50' : '0'} group-hover:opacity-30 transition-opacity`}></div>
              <div className={`relative flex items-center space-x-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl border ${
                selectedCategory === category.id ? 'border-yellow-400/50 bg-white/10' : 'border-gray-200 dark:border-white/10'
              } hover:border-gray-300 dark:border-gray-300 dark:border-white/20 transition-all`}>
                <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`font-medium ${selectedCategory === category.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {category.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Charges */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Charges</h2>
              <button className="p-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Fixed Monthly Charge</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${currentTariff.fixedCharge}</p>
              </div>
              <DollarSign className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          {/* Revenue Impact */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Revenue Impact</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Current Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$2.84M</p>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">+5.2%</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">vs last month</span>
              </div>
            </div>
          </div>

          {/* Slab Rates */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Slab Rates</h2>
            </div>
            <div className="space-y-3">
              {currentTariff.slabs.map((slab, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{slab.range}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Consumption Range</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${slab.rate}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">per kWh</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time of Use Rates */}
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Time of Use Rates</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl border border-red-500/20">
                <div className="flex items-center space-x-3">
                  <Sun className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-white font-medium">Peak Hours</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{currentTariff.timeOfUse.peak.hours}</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">${currentTariff.timeOfUse.peak.rate}/kWh</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Normal Hours</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{currentTariff.timeOfUse.normal.hours}</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">${currentTariff.timeOfUse.normal.rate}/kWh</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <Moon className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Off-Peak Hours</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{currentTariff.timeOfUse.offPeak.hours}</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">${currentTariff.timeOfUse.offPeak.rate}/kWh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-8 border border-yellow-400/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Tariff Analytics Coming Soon
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Revenue projections, seasonal adjustments, and detailed consumption analytics will be available soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
