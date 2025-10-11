'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Gauge,
  Search,
  User,
  MapPin,
  Calendar,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
  Zap
} from 'lucide-react';

export default function MeterReadingForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [readingData, setReadingData] = useState({
    currentReading: '',
    readingDate: new Date().toISOString().split('T')[0],
    readingTime: new Date().toTimeString().slice(0, 5),
    meterCondition: 'good',
    accessibility: 'accessible',
    notes: '',
    photoUploaded: false
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock customer data
  const mockCustomers = [
    {
      id: 1,
      accountNumber: 'ELX-2024-001234',
      name: 'John Doe',
      address: '123 Main Street, Apt 4B',
      meterNumber: 'MTR-485729',
      lastReading: 12485,
      lastReadingDate: '2024-09-10',
      avgConsumption: 450
    }
  ];

  const handleCustomerSearch = () => {
    const customer = mockCustomers.find(c =>
      c.accountNumber.includes(searchQuery) ||
      c.meterNumber.includes(searchQuery) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSelectedCustomer(customer || null);
    if (!customer) {
      setErrors({ search: 'No customer found with this information' });
    } else {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!selectedCustomer) {
      newErrors.customer = 'Please select a customer first';
    }

    if (!readingData.currentReading) {
      newErrors.currentReading = 'Current reading is required';
    } else if (isNaN(Number(readingData.currentReading))) {
      newErrors.currentReading = 'Reading must be a valid number';
    } else if (selectedCustomer && Number(readingData.currentReading) < selectedCustomer.lastReading) {
      newErrors.currentReading = 'Current reading cannot be less than previous reading';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedCustomer(null);
          setReadingData({
            currentReading: '',
            readingDate: new Date().toISOString().split('T')[0],
            readingTime: new Date().toTimeString().slice(0, 5),
            meterCondition: 'good',
            accessibility: 'accessible',
            notes: '',
            photoUploaded: false
          });
          setSearchQuery('');
        }, 3000);
      }, 1500);
    }
  };

  const calculateConsumption = () => {
    if (selectedCustomer && readingData.currentReading) {
      const current = Number(readingData.currentReading);
      const previous = selectedCustomer.lastReading;
      return current - previous;
    }
    return 0;
  };

  return (
    <DashboardLayout userType="employee" userName="Mike Johnson">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meter Reading Entry</h1>
              <p className="text-gray-600 dark:text-gray-400">Record customer meter readings accurately</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Gauge className="w-9 h-9 text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/50 flex items-center space-x-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-white font-semibold text-lg">Reading Submitted Successfully!</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">Meter reading has been recorded and saved.</p>
            </div>
          </div>
        )}

        {/* Customer Search */}
        <div className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Search</h2>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomerSearch()}
                placeholder="Enter account number, meter number, or customer name"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <button
              onClick={handleCustomerSearch}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all font-semibold"
            >
              Search
            </button>
          </div>
          {errors.search && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.search}
            </p>
          )}
        </div>

        {/* Customer Information */}
        {selectedCustomer && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Information</h2>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Customer Name</p>
                    <p className="text-white font-semibold">{selectedCustomer.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Account Number</p>
                    <p className="text-white font-semibold">{selectedCustomer.accountNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Address</p>
                    <p className="text-gray-900 dark:text-white">{selectedCustomer.address}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Gauge className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Meter Number</p>
                    <p className="text-white font-semibold">{selectedCustomer.meterNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Last Reading</p>
                    <p className="text-white font-semibold">{selectedCustomer.lastReading} kWh</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Last Reading Date</p>
                    <p className="text-gray-900 dark:text-white">{selectedCustomer.lastReadingDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading Form */}
        {selectedCustomer && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-white/10 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Meter Reading Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Reading */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Current Reading (kWh) *</label>
                <input
                  type="text"
                  value={readingData.currentReading}
                  onChange={(e) => setReadingData({ ...readingData, currentReading: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Enter current meter reading"
                />
                {errors.currentReading && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.currentReading}
                  </p>
                )}
                {readingData.currentReading && !errors.currentReading && (
                  <div className="mt-3 p-3 bg-green-500/20 rounded-lg border border-green-500/50">
                    <p className="text-green-400 text-sm">
                      Consumption: {calculateConsumption()} kWh
                    </p>
                  </div>
                )}
              </div>

              {/* Reading Date */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Reading Date *</label>
                <input
                  type="date"
                  value={readingData.readingDate}
                  onChange={(e) => setReadingData({ ...readingData, readingDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              {/* Reading Time */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Reading Time *</label>
                <input
                  type="time"
                  value={readingData.readingTime}
                  onChange={(e) => setReadingData({ ...readingData, readingTime: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              {/* Meter Condition */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Meter Condition</label>
                <select
                  value={readingData.meterCondition}
                  onChange={(e) => setReadingData({ ...readingData, meterCondition: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
                >
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor - Needs Replacement</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Notes (Optional)</label>
              <textarea
                value={readingData.notes}
                onChange={(e) => setReadingData({ ...readingData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                rows={3}
                placeholder="Add any additional notes or observations..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl transition-all font-semibold flex items-center space-x-2 ${
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:shadow-lg hover:shadow-green-500/50'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Submit Reading</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
