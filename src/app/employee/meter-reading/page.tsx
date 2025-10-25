'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Building,
  ClipboardList,
  Users
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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Two-tab system state
  const [activeTab, setActiveTab] = useState<'work-orders' | 'all-customers'>('work-orders');
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loadingWorkOrders, setLoadingWorkOrders] = useState(false);

  // All Customers tab state
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStats, setCustomerStats] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lastReading, setLastReading] = useState<number | null>(null);
  const [lastReadingDate, setLastReadingDate] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalCustomer, setModalCustomer] = useState<any>(null);

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

  // Load customer from URL parameters (from bill generation page)
  useEffect(() => {
    const customerId = searchParams.get('customerId');
    const customerName = searchParams.get('customerName');
    const accountNumber = searchParams.get('accountNumber');

    if (customerId && customerName && accountNumber) {
      // Pre-fill customer from URL params
      setSelectedCustomer({
        id: parseInt(customerId),
        fullName: decodeURIComponent(customerName),
        accountNumber: decodeURIComponent(accountNumber),
        meterNumber: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        connectionType: '',
        averageMonthlyUsage: ''
      });
      // Fetch full customer details and last reading
      fetchCustomerById(parseInt(customerId));
    }
  }, [searchParams]);

  // Fetch work orders on mount
  useEffect(() => {
    if (activeTab === 'work-orders') {
      fetchWorkOrders();
    } else if (activeTab === 'all-customers') {
      fetchCustomersWithoutReading();
    }
  }, [activeTab]);

  // Fetch customers without current month reading
  const fetchCustomersWithoutReading = async () => {
    try {
      setLoadingCustomers(true);
      const response = await fetch(`/api/customers/without-reading?search=${customerSearch}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAllCustomers(result.data || []);
          setCustomerStats(result.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching customers without reading:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Fetch work orders for employee
  const fetchWorkOrders = async () => {
    try {
      setLoadingWorkOrders(true);
      const response = await fetch('/api/work-orders?workType=meter_reading&status=assigned,in_progress');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setWorkOrders(result.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching work orders:', error);
    } finally {
      setLoadingWorkOrders(false);
    }
  };

  // Fetch customer by ID (from URL params)
  const fetchCustomerById = async (customerId: number) => {
    try {
      const response = await fetch(`/api/customers?id=${customerId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          const customer = result.data[0];
          setSelectedCustomer(customer);
          await fetchLastReading(customer.id);
        }
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

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

    if (!selectedCustomer && !modalCustomer) {
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

    const customer = modalCustomer || selectedCustomer;
    if (!customer) {
      alert('No customer selected');
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
          customerId: customer.id,
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

      // Auto-generate bill if enabled
      if (autoGenerateBill) {
        await handleGenerateBill();
      } else {
        setShowSuccess(true);
      }

      // Complete any pending work orders for this customer (meter_reading type)
      try {
        const woResponse = await fetch(`/api/work-orders?customerId=${selectedCustomer!.id}&workType=meter_reading&status=assigned,in_progress`);
        if (woResponse.ok) {
          const woResult = await woResponse.json();
          if (woResult.success && woResult.data && woResult.data.length > 0) {
            // Complete all pending meter reading work orders for this customer
            for (const wo of woResult.data) {
              await fetch(`/api/work-orders/${wo.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 'completed',
                  completionNotes: `Meter reading completed. Reading: ${readingData.currentReading} kWh. ${autoGenerateBill ? 'Bill auto-generated.' : 'Bill not generated.'}`
                }),
              });
            }
          }
        }
      } catch (woError) {
        console.error('Error completing work orders:', woError);
        // Don't fail the whole operation if work order update fails
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
    if (!selectedCustomer && !modalCustomer) return;

    const customerId = selectedCustomer?.id || modalCustomer?.id;
    const readingDate = readingData.readingDate;

    setGeneratingBill(true);
    try {
      // Format billing month correctly as YYYY-MM-01
      const dateObj = new Date(readingDate);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const billingMonth = `${year}-${month}-01`;

      console.log('[Bill Generation] Request:', { customerId, billingMonth, readingDate });

      const response = await fetch('/api/bills/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          billingMonth: billingMonth
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBillGenerated(data.bill);
        setShowSuccess(true); // Show success modal when bill is auto-generated
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

  return(
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

            {/* Two-Tab System */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
                <button
                  onClick={() => setActiveTab('work-orders')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                    activeTab === 'work-orders'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>My Work Orders ({workOrders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('all-customers')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                    activeTab === 'all-customers'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>All Customers</span>
                </button>
              </div>

              {/* Work Orders Tab Content */}
              {activeTab === 'work-orders' && (
                <div className="mt-4">
                  {loadingWorkOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading work orders...</span>
                    </div>
                  ) : workOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">No pending work orders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Switch to "All Customers" tab for proactive readings</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workOrders.map((wo: any) => (
                        <div
                          key={wo.id}
                          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-mono text-blue-400">WO-{wo.id}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  wo.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                  wo.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {wo.priority?.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-gray-900 dark:text-white font-semibold">{wo.customerName || 'Unknown Customer'}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Account: {wo.customerAccount || 'N/A'}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Meter: {wo.meterNumber || 'N/A'}</p>
                              {wo.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{wo.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  // Fetch customer details and last reading
                                  const custResponse = await fetch(`/api/customers?customerId=${wo.customerId}`);
                                  if (custResponse.ok) {
                                    const custResult = await custResponse.json();
                                    if (custResult.success && custResult.data && custResult.data.length > 0) {
                                      const customer = custResult.data[0];

                                      // Fetch last reading
                                      const readingResponse = await fetch(`/api/meter-readings?customerId=${wo.customerId}&limit=1`);
                                      let lastRead = 0;
                                      let lastDate = null;
                                      if (readingResponse.ok) {
                                        const readingResult = await readingResponse.json();
                                        if (readingResult.success && readingResult.data && readingResult.data.length > 0) {
                                          lastRead = parseFloat(readingResult.data[0].currentReading);
                                          lastDate = readingResult.data[0].readingDate;
                                        }
                                      }

                                      setModalCustomer({ ...customer, workOrderId: wo.id });
                                      setLastReading(lastRead);
                                      setLastReadingDate(lastDate);
                                      setShowModal(true);
                                      setReadingData({
                                        currentReading: '',
                                        readingDate: new Date().toISOString().split('T')[0],
                                        readingTime: new Date().toTimeString().slice(0, 5),
                                        meterCondition: 'good',
                                        accessibility: 'accessible',
                                        notes: '',
                                      });
                                    }
                                  }
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                              >
                                Enter Reading
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* All Customers Tab Content */}
              {activeTab === 'all-customers' && !selectedCustomer && (
                <div className="mt-4">
                  {/* Stats Banner */}
                  {customerStats && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{customerStats.totalCustomers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">With Reading</p>
                          <p className="text-2xl font-bold text-green-400">{customerStats.withReading}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Without Reading</p>
                          <p className="text-2xl font-bold text-orange-400">{customerStats.withoutReading}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search Box */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchCustomersWithoutReading()}
                        placeholder="Search by name, account, or meter number..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                      />
                    </div>
                  </div>

                  {loadingCustomers ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading customers...</span>
                    </div>
                  ) : allCustomers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">All customers have readings for this month!</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Great job! No pending meter readings.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allCustomers.map((customer: any) => (
                        <div
                          key={customer.id}
                          className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-gray-900 dark:text-white font-semibold">{customer.fullName}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Account:</span> {customer.accountNumber}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Meter:</span> {customer.meterNumber}
                                </p>
                              </div>
                              {customer.lastReading > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  Last Reading: {customer.lastReading} kWh on {new Date(customer.lastReadingDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalCustomer(customer);
                                  setLastReading(customer.lastReading);
                                  setLastReadingDate(customer.lastReadingDate);
                                  setShowModal(true);
                                  // Reset form
                                  setReadingData({
                                    currentReading: '',
                                    readingDate: new Date().toISOString().split('T')[0],
                                    readingTime: new Date().toTimeString().slice(0, 5),
                                    meterCondition: 'good',
                                    accessibility: 'accessible',
                                    notes: '',
                                  });
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                              >
                                Enter Reading
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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

            {/* Customer Search - Only show in All Customers tab */}
            {activeTab === 'all-customers' && (
              <>
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
        </>
      )}
          </div>
        </div>
      </div>
      
  </DashboardLayout >
      
  );
  
}
