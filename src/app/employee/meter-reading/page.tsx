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
  const [autoGenerateBill, setAutoGenerateBill] = useState(true); // NEW: Auto-generate bill option
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [billGenerated, setBillGenerated] = useState<any>(null);

  // Mock customer data
  const mockCustomers = [
    {
      id: 1,
      accountNumber: 'ELX-2024-001234',
      name: 'Huzaifa',
      address: '123 Main Street, Apt 4B',
      meterNumber: 'MTR-485729',
      lastReading: 12485,
      lastReadingDate: '2024-09-10',
      avgConsumption: 450
    }
  ];

  const handleCustomerSearch = () => {
    // Require at least 3 characters to search
    if (!searchQuery || searchQuery.trim().length < 3) {
      setErrors({ search: 'Please enter at least 3 characters to search' });
      setSelectedCustomer(null);
      return;
    }

    const customer = mockCustomers.find(c =>
      c.accountNumber.includes(searchQuery.trim()) ||
      c.meterNumber.includes(searchQuery.trim()) ||
      c.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
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

        // Auto-generate bill if option is enabled
        if (autoGenerateBill) {
          handleGenerateBill();
        }
      }, 1500);
    }
  };

  const handleGenerateBill = async () => {
    if (!selectedCustomer) return;

    setGeneratingBill(true);
    try {
      const response = await fetch('/api/bills/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          billingMonth: new Date(readingData.readingDate).toISOString().split('T')[0].slice(0, 7) + '-01'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBillGenerated(data.bill);
      } else {
        alert(data.error || 'Failed to generate bill');
      }
    } catch (error) {
      console.error('Bill generation error:', error);
      alert('Failed to generate bill. Please try again.');
    } finally {
      setGeneratingBill(false);
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    setBillGenerated(null);
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
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4 py-2">
            {/* Header */}
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Meter Reading Entry</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Record customer meter readings accurately</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Gauge className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && !billGenerated && !autoGenerateBill && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-4 border border-green-500/50">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold text-base">Reading Submitted Successfully!</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-xs">Meter reading has been recorded and saved. You can now generate the bill manually.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleGenerateBill}
                    disabled={generatingBill}
                    className={`px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg transition-all font-medium flex items-center space-x-2 ${
                      generatingBill
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg hover:shadow-blue-500/50'
                    }`}
                  >
                    {generatingBill ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Bill...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Generate Bill Now</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all font-medium"
                  >
                    Record Another Reading
                  </button>
                </div>
              </div>
            )}

            {/* Auto-Generating Bill Message */}
            {showSuccess && !billGenerated && autoGenerateBill && generatingBill && (
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h3 className="text-white font-semibold text-base">Auto-Generating Bill...</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-xs">Reading saved successfully. Creating customer bill automatically...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bill Generated Success */}
            {billGenerated && (
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/50">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold text-base">Bill Generated Successfully!</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-xs">Customer bill has been created and is now available for viewing.</p>
                  </div>
                </div>

                {/* Bill Details */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 mb-3">
                  <h4 className="text-white font-semibold text-sm mb-3">Bill Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Bill Number</p>
                      <p className="text-white font-semibold text-xs">{billGenerated.bill_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Units Consumed</p>
                      <p className="text-white font-semibold text-xs">{billGenerated.units_consumed} kWh</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Amount</p>
                      <p className="text-green-400 font-bold text-xs">₹{billGenerated.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Due Date</p>
                      <p className="text-white font-semibold text-xs">{new Date(billGenerated.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all font-medium flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Record Another Reading</span>
                </button>
              </div>
            )}

            {/* Customer Search */}
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Customer Search</h2>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      // Clear any previous customer selection and errors when typing
                      if (selectedCustomer) {
                        setSelectedCustomer(null);
                      }
                      if (errors.search) {
                        setErrors({});
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomerSearch();
                      }
                    }}
                    placeholder="Enter account number, meter number, or customer name (min 3 chars)"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <button
                  onClick={handleCustomerSearch}
                  disabled={!searchQuery || searchQuery.trim().length < 3}
                  className={`px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium transition-all ${
                    !searchQuery || searchQuery.trim().length < 3
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-lg hover:shadow-orange-500/50'
                  }`}
                >
                  Search
                </button>
              </div>
              {errors.search && (
                <p className="text-red-400 text-xs mt-2 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.search}
                </p>
              )}
            </div>

            {/* Customer Information */}
            {selectedCustomer && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Customer Information</h2>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Customer Name</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Account Number</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.accountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Address</p>
                        <p className="text-gray-900 dark:text-white text-sm">{selectedCustomer.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Gauge className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Meter Number</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.meterNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Last Reading</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.lastReading} kWh</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">Last Reading Date</p>
                        <p className="text-gray-900 dark:text-white text-sm">{selectedCustomer.lastReadingDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reading Form */}
            {selectedCustomer && (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 space-y-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Meter Reading Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Reading */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Current Reading (kWh) *</label>
                    <input
                      type="text"
                      value={readingData.currentReading}
                      onChange={(e) => setReadingData({ ...readingData, currentReading: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Enter current meter reading"
                    />
                    {errors.currentReading && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.currentReading}
                      </p>
                    )}
                    {readingData.currentReading && !errors.currentReading && (
                      <div className="mt-2 p-2 bg-green-500/20 rounded-lg border border-green-500/50">
                        <p className="text-green-400 text-xs">
                          Consumption: {calculateConsumption()} kWh
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reading Date */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Reading Date *</label>
                    <input
                      type="date"
                      value={readingData.readingDate}
                      onChange={(e) => setReadingData({ ...readingData, readingDate: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>

                  {/* Reading Time */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Reading Time *</label>
                    <input
                      type="time"
                      value={readingData.readingTime}
                      onChange={(e) => setReadingData({ ...readingData, readingTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>

                  {/* Meter Condition */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Meter Condition</label>
                    <select
                      value={readingData.meterCondition}
                      onChange={(e) => setReadingData({ ...readingData, meterCondition: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors font-medium"
                    >
                      <option value="good" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Good</option>
                      <option value="fair" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Fair</option>
                      <option value="poor" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Poor - Needs Replacement</option>
                      <option value="damaged" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Damaged</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Notes (Optional)</label>
                  <textarea
                    value={readingData.notes}
                    onChange={(e) => setReadingData({ ...readingData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    rows={2}
                    placeholder="Add any additional notes or observations..."
                  />
                </div>

                {/* Auto-Generate Bill Option */}
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoGenerateBill}
                      onChange={(e) => setAutoGenerateBill(e.target.checked)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400 focus:ring-2 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Auto-Generate Bill</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Automatically generate customer bill immediately after saving the meter reading. If disabled, you can manually generate the bill later.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                    className="px-4 py-2 text-sm bg-gray-50 dark:bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg transition-all font-medium flex items-center space-x-2 ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg hover:shadow-green-500/50'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Submit Reading</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
