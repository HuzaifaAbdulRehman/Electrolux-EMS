'use client';

import React, { useState, useEffect } from 'react';
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
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function TariffManagement() {
  const [selectedCategory, setSelectedCategory] = useState('residential');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTariffs, setEditedTariffs] = useState<any>(null);
  
  // Real data state management
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    { id: 'residential', name: 'Residential', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { id: 'commercial', name: 'Commercial', icon: Building, color: 'from-green-500 to-emerald-500' },
    { id: 'industrial', name: 'Industrial', icon: Factory, color: 'from-purple-500 to-pink-500' },
    { id: 'agricultural', name: 'Agricultural', icon: CloudRain, color: 'from-yellow-500 to-orange-500' }
  ];

  // Fetch tariffs from database
  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tariffs');
      const result = await response.json();
      
      if (result.success) {
        setTariffs(result.data);
      } else {
        setError(result.error || 'Failed to fetch tariffs');
      }
    } catch (err) {
      setError('Network error while fetching tariffs');
      console.error('Error fetching tariffs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTariff = () => {
    return tariffs.find(t => t.category.toLowerCase() === selectedCategory && !t.validUntil);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const currentTariff = getCurrentTariff();
      
      if (currentTariff) {
        // Update existing tariff (creates new version)
        const response = await fetch(`/api/tariffs/${currentTariff.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedTariffs)
        });
        
        if (response.ok) {
          await fetchTariffs(); // Refresh data
          setIsEditing(false);
        } else {
          const error = await response.json();
          setError(error.error || 'Failed to update tariff');
        }
      } else {
        // Create new tariff
        const response = await fetch('/api/tariffs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editedTariffs,
            category: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
          })
        });
        
        if (response.ok) {
          await fetchTariffs(); // Refresh data
          setIsEditing(false);
        } else {
          const error = await response.json();
          setError(error.error || 'Failed to create tariff');
        }
      }
    } catch (err) {
      setError('Network error while saving tariff');
      console.error('Error saving tariff:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      // Enter edit mode - copy current tariff to editedTariffs
      const currentTariff = getCurrentTariff();
      setEditedTariffs(JSON.parse(JSON.stringify(currentTariff)));
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditedTariffs(null);
    setIsEditing(false);
  };

  const updateSlabRate = (index: number, value: string) => {
    const newSlabs = [...editedTariffs.slabs];
    newSlabs[index] = { ...newSlabs[index], rate: parseFloat(value) || 0 };
    setEditedTariffs({ ...editedTariffs, slabs: newSlabs });
  };

  const updateFixedCharge = (value: string) => {
    setEditedTariffs({ ...editedTariffs, fixedCharge: parseFloat(value) || 0 });
  };

  const updateTimeOfUseRate = (period: 'peak' | 'normal' | 'offPeak', value: string) => {
    setEditedTariffs({
      ...editedTariffs,
      timeOfUse: {
        ...editedTariffs.timeOfUse,
        [period]: { ...editedTariffs.timeOfUse[period], rate: parseFloat(value) || 0 }
      }
    });
  };

  const currentTariff = getCurrentTariff();
  const displayTariff = isEditing ? editedTariffs : currentTariff;

  // Keep loading check before any early returns to avoid flashing "No data"
  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Admin User">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading tariffs...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!displayTariff) {
    return (
      <DashboardLayout userType="admin" userName="Admin User">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No tariff data available for the selected category.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tariff Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Configure electricity rates and pricing structures</p>
              {error && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center space-x-2"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Tariff</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-gray-300 dark:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`font-medium ${selectedCategory === category.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading tariffs...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Charges */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Charges</h2>
                {isEditing && (
                  <span className="text-xs text-yellow-400 px-2 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    Editing Mode
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Fixed Charge</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly base charge</p>
                  </div>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">$</span>
                    <input
                      type="number"
                      value={displayTariff.fixedCharge}
                      onChange={(e) => updateFixedCharge(e.target.value)}
                      step="0.01"
                      className="w-20 px-2 py-1 text-lg font-bold bg-gray-50 dark:bg-white/10 border border-yellow-400/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                ) : (
                  <p className="text-xl font-bold text-gray-900 dark:text-white">${displayTariff.fixedCharge}</p>
                )}
              </div>
            </div>

            {/* Revenue Impact */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
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
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Slab Rates</h2>
              </div>
              <div className="space-y-3">
                {displayTariff.slabs.map((slab: any, index: number) => (
                  <div key={index} className={`flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl transition-all ${
                    isEditing ? 'border-2 border-yellow-400/30' : 'hover:bg-gray-50 dark:bg-gray-50 dark:bg-white/10'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{slab.range}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Consumption range</p>
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">$</span>
                        <input
                          type="number"
                          value={slab.rate}
                          onChange={(e) => updateSlabRate(index, e.target.value)}
                          step="0.01"
                          className="w-20 px-2 py-1 text-lg font-bold bg-gray-50 dark:bg-white/10 border border-yellow-400/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">/kWh</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${slab.rate}/kWh</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">per kWh</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time of Use Rates */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Time of Use Rates</h2>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl border ${
                  isEditing ? 'border-yellow-400/30 border-2' : 'border-red-500/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Sun className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="text-white font-medium">Peak Hours</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{displayTariff.timeOfUse.peak.hours}</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">$</span>
                      <input
                        type="number"
                        value={displayTariff.timeOfUse.peak.rate}
                        onChange={(e) => updateTimeOfUseRate('peak', e.target.value)}
                        step="0.01"
                        className="w-20 px-2 py-1 text-lg font-bold bg-gray-50 dark:bg-white/10 border border-yellow-400/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">/kWh</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${displayTariff.timeOfUse.peak.rate}/kWh</p>
                  )}
                </div>

                <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border ${
                  isEditing ? 'border-yellow-400/30 border-2' : 'border-blue-500/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Sun className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Normal Hours</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{displayTariff.timeOfUse.normal.hours}</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">$</span>
                      <input
                        type="number"
                        value={displayTariff.timeOfUse.normal.rate}
                        onChange={(e) => updateTimeOfUseRate('normal', e.target.value)}
                        step="0.01"
                        className="w-20 px-2 py-1 text-lg font-bold bg-gray-50 dark:bg-white/10 border border-yellow-400/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">/kWh</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${displayTariff.timeOfUse.normal.rate}/kWh</p>
                  )}
                </div>

                <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border ${
                  isEditing ? 'border-yellow-400/30 border-2' : 'border-green-500/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Moon className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Off-Peak Hours</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{displayTariff.timeOfUse.offPeak.hours}</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">$</span>
                      <input
                        type="number"
                        value={displayTariff.timeOfUse.offPeak.rate}
                        onChange={(e) => updateTimeOfUseRate('offPeak', e.target.value)}
                        step="0.01"
                        className="w-20 px-2 py-1 text-lg font-bold bg-gray-50 dark:bg-white/10 border border-yellow-400/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">/kWh</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${displayTariff.timeOfUse.offPeak.rate}/kWh</p>
                  )}
                </div>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="lg:col-span-2 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-8 border border-yellow-400/20 text-center">
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
        )}
      </div>
    </DashboardLayout>
  );
}
