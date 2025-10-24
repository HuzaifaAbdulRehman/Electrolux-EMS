'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Gauge,
  Search,
  User,
  MapPin,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
  Zap,
  Loader2,
  Phone,
  Building
} from 'lucide-react';

interface Customer {
  id: number;
  accountNumber: string;
  meterNumber: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  connectionType: string;
  averageMonthlyUsage: string;
}

interface MeterReading {
  readingId: number;
  unitsConsumed: number;
  previousReading: number;
  currentReading: number;
}

export default function MeterReadingForm() {
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lastReading, setLastReading] = useState<number | null>(null);
  const [lastReadingDate, setLastReadingDate] = useState<string | null>(null);

  const [readingData, setReadingData] = useState({
    currentReading: '',
    readingDate: new Date().toISOString().split('T')[0],
    readingTime: new Date().toTimeString().slice(0, 5),
    meterCondition: 'good',
    accessibility: 'accessible',
    notes: '',
  });

  const [autoGenerateBill, setAutoGenerateBill] = useState(true);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [billGenerated, setBillGenerated] = useState<any>(null);
  const [savedReading, setSavedReading] = useState<MeterReading | null>(null);

  // Real customer search with API
  const handleCustomerSearch = async () => {
    // Validate search query
    if (!searchQuery || searchQuery.trim().length < 3) {
      setErrors({ search: 'Please enter at least 3 characters to search' });
      setSelectedCustomer(null);
      return;
    }

    try {
      setSearching(true);
      setErrors({});

      const response = await fetch(`/api/customers?search=${encodeURIComponent(searchQuery.trim())}&limit=1`);

      if (!response.ok) {
        throw new Error('Failed to search customer');
      }

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const customer = result.data[0];
        setSelectedCustomer(customer);

        // Fetch last meter reading for this customer
        await fetchLastReading(customer.id);

        setErrors({});
      } else {
        setSelectedCustomer(null);
        setLastReading(null);
        setLastReadingDate(null);
        setErrors({ search: 'No customer found with this information' });
      }
    } catch (error: any) {
      console.error('Customer search error:', error);
      setErrors({ search: error.message || 'Failed to search customer' });
      setSelectedCustomer(null);
    } finally {
      setSearching(false);
    }
  };

  // Fetch last meter reading for customer
  const fetchLastReading = async (customerId: number) => {
    try {
      const response = await fetch(`/api/meter-readings?customerId=${customerId}&limit=1`);

      if (!response.ok) {
        // No previous readings - that's okay for new customers
        setLastReading(0);
        setLastReadingDate(null);
        return;
      }

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const reading = result.data[0];
        setLastReading(parseFloat(reading.currentReading));
        setLastReadingDate(reading.readingDate);
      } else {
        // No previous readings
        setLastReading(0);
        setLastReadingDate(null);
      }
    } catch (error) {
      console.error('Error fetching last reading:', error);
      setLastReading(0);
      setLastReadingDate(null);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: any = {};

    if (!selectedCustomer) {
      newErrors.customer = 'Please select a customer first';
    }

    if (!readingData.currentReading) {
      newErrors.currentReading = 'Current reading is required';
    } else if (isNaN(Number(readingData.currentReading))) {
      newErrors.currentReading = 'Reading must be a valid number';
    } else if (lastReading !== null && Number(readingData.currentReading) < lastReading) {
      newErrors.currentReading = `Current reading cannot be less than previous reading (${lastReading} kWh)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit meter reading
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const response = await fetch('/api/meter-readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedCustomer!.id,
          currentReading: readingData.currentReading,
          meterCondition: readingData.meterCondition,
          accessibility: readingData.accessibility,
          notes: readingData.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit reading');
      }

      // Success!
      setSavedReading({
        readingId: result.data.readingId,
        unitsConsumed: result.data.unitsConsumed,
        previousReading: lastReading || 0,
        currentReading: parseFloat(readingData.currentReading),
      });
      setShowSuccess(true);

      // Auto-generate bill if enabled
      if (autoGenerateBill) {
        await handleGenerateBill();
      }
    } catch (error: any) {
      console.error('Meter reading submission error:', error);
      alert(`Error: ${error.message || 'Failed to submit meter reading'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate bill
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

      if (response.ok && data.success) {
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

  // Reset form
  const handleReset = () => {
    setShowSuccess(false);
    setBillGenerated(null);
    setSavedReading(null);
    setSelectedCustomer(null);
    setLastReading(null);
    setLastReadingDate(null);
    setReadingData({
      currentReading: '',
      readingDate: new Date().toISOString().split('T')[0],
      readingTime: new Date().toTimeString().slice(0, 5),
      meterCondition: 'good',
      accessibility: 'accessible',
      notes: '',
    });
    setSearchQuery('');
    setErrors({});
  };

  // Calculate consumption
  const calculateConsumption = () => {
    if (lastReading !== null && readingData.currentReading) {
      const current = Number(readingData.currentReading);
      return current - lastReading;
    }
    return 0;
  };

  return (
    <DashboardLayout userType="employee" userName={session?.user?.name || 'Employee'}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4 py-2">
            {/* Header */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
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

            {/* Success Message - Reading Saved */}
            {showSuccess && !billGenerated && !autoGenerateBill && savedReading && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-4 border border-green-500/50">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold text-base">Reading Submitted Successfully!</h3>
                    <p className="text-gray-300 text-xs">
                      Consumption: {savedReading.unitsConsumed.toFixed(2)} kWh
                      ({savedReading.previousReading} → {savedReading.currentReading} kWh)
                    </p>
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
                        <Loader2 className="w-4 h-4 animate-spin" />
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
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                  <div>
                    <h3 className="text-white font-semibold text-base">Auto-Generating Bill...</h3>
                    <p className="text-gray-300 text-xs">Reading saved successfully. Creating customer bill automatically...</p>
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
                    <p className="text-gray-300 text-xs">Customer bill has been created and is now available for viewing.</p>
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
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Customer Search</h2>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedCustomer) {
                        setSelectedCustomer(null);
                        setLastReading(null);
                        setLastReadingDate(null);
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
                    disabled={searching}
                    className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleCustomerSearch}
                  disabled={!searchQuery || searchQuery.trim().length < 3 || searching}
                  className={`px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    !searchQuery || searchQuery.trim().length < 3 || searching
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-lg hover:shadow-orange-500/50'
                  }`}
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </>
                  )}
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
                    <div className="flex items-start space-x-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Customer Name</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Account Number</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.accountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Phone</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Address</p>
                        <p className="text-white text-sm">{selectedCustomer.address}, {selectedCustomer.city}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Gauge className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Meter Number</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.meterNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Connection Type</p>
                        <p className="text-white font-semibold text-sm">{selectedCustomer.connectionType}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Zap className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Last Reading</p>
                        <p className="text-white font-semibold text-sm">
                          {lastReading !== null ? `${lastReading} kWh` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-xs">Last Reading Date</p>
                        <p className="text-white text-sm">
                          {lastReadingDate ? new Date(lastReadingDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reading Form */}
            {selectedCustomer && !showSuccess && (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 space-y-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Meter Reading Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Reading */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Current Reading (kWh) *</label>
                    <input
                      type="text"
                      value={readingData.currentReading}
                      onChange={(e) => {
                        setReadingData({ ...readingData, currentReading: e.target.value });
                        // Clear error when user types
                        if (errors.currentReading) {
                          setErrors({ ...errors, currentReading: undefined });
                        }
                      }}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Enter current meter reading"
                    />
                    {errors.currentReading && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.currentReading}
                      </p>
                    )}
                    {readingData.currentReading && !errors.currentReading && lastReading !== null && (
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
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>

                  {/* Reading Time */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Reading Time *</label>
                    <input
                      type="time"
                      value={readingData.readingTime}
                      onChange={(e) => setReadingData({ ...readingData, readingTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors"
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

                  {/* Accessibility */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Meter Accessibility</label>
                    <select
                      value={readingData.accessibility}
                      onChange={(e) => setReadingData({ ...readingData, accessibility: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 transition-colors font-medium"
                    >
                      <option value="accessible" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Accessible</option>
                      <option value="restricted" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Restricted Access</option>
                      <option value="inaccessible" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Inaccessible</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Notes (Optional)</label>
                  <textarea
                    value={readingData.notes}
                    onChange={(e) => setReadingData({ ...readingData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
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
                    onClick={() => {
                      setSelectedCustomer(null);
                      setLastReading(null);
                      setLastReadingDate(null);
                      setErrors({});
                    }}
                    className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-white/20 transition-all"
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
                        <Loader2 className="w-4 h-4 animate-spin" />
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
