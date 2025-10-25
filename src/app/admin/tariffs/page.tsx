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
    { id: 'agricultural', name: 'Agricultural', icon: CloudRain, color: 'from-yellow-400 to-orange-500' }
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

  // Fallback hardcoded data for demo purposes
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

  const handleEditToggle = () => {
    if (!isEditing) {
      // Enter edit mode - copy current tariff to editedTariffs
      const currentTariff = getCurrentTariff();
      setEditedTariffs(JSON.parse(JSON.stringify(currentTariff)));
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Here you would save to database
    console.log('Saving tariff changes:', editedTariffs);
    // Update the tariffStructure with edited values
    tariffStructure[selectedCategory as keyof typeof tariffStructure] = editedTariffs;
    setIsEditing(false);
    alert('Tariff rates updated successfully!');
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

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tariff Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Configure electricity rates and pricing structures</p>
              {error && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20 transition-all flex items-center space-x-2"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit Rates</span>
                </button>
              )}
            </div>
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading tariffs...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Charges */}
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Charges</h2>
              {isEditing && (
                <span className="text-xs text-yellow-400 px-2 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  Editing Mode
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl">
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Fixed Monthly Charge</p>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">$</span>
                    <input
                      type="number"
                      value={displayTariff.fixedCharge}
                      onChange={(e) => updateFixedCharge(e.target.value)}
                      step="0.01"
                      className="w-32 px-3 py-2 text-xl font-bold bg-gray-50 dark:bg-white/10 border border-yellow-400/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${displayTariff.fixedCharge}</p>
                )}
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Consumption Range</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">$</span>
                        <input
                          type="number"
                          value={slab.rate}
                          onChange={(e) => updateSlabRate(index, e.target.value)}
                          step="0.01"
                          className="w-24 px-2 py-1 text-lg font-bold bg-gray-50 dark:bg-white/10 border border-yellow-400/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${slab.rate}</p>
                    )}
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
                  <Zap className="w-6 h-6 text-blue-400" />
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
        )}
      </div>
    </DashboardLayout>
  );
}
