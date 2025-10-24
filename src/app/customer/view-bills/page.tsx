'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FileText,
  Download,
  Printer,
  Send,
  X,
  Calendar,
  Zap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Bill {
  id: number;
  billNumber: string;
  month: string;
  issueDate: string;
  dueDate: string;
  units: number;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  breakdown?: {
    baseAmount: number;
    fixedCharges: number;
    electricityDuty: number;
    gst: number;
    totalAmount: number;
    tariffSlabs: Array<{
      units: number;
      rate: number;
      amount: number;
    }>;
  };
}

export default function ViewBills() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [requestForm, setRequestForm] = useState({
    billingMonth: '',
    priority: 'medium',
    notes: ''
  });

  // Fetch real bills data
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bills?limit=50');

      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }

      const result = await response.json();

      // Transform API data to match Bill interface
      const transformedBills = result.data.map((bill: any) => ({
        id: bill.id,
        billNumber: bill.billNumber,
        month: new Date(bill.billingMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        issueDate: bill.issueDate,
        dueDate: bill.dueDate,
        units: bill.unitsConsumed,
        amount: parseFloat(bill.totalAmount),
        status: bill.status,
        paidDate: bill.paymentDate,
        paymentMethod: bill.status === 'paid' ? 'Online Banking' : undefined,
        breakdown: {
          baseAmount: parseFloat(bill.baseAmount || 0),
          fixedCharges: parseFloat(bill.fixedCharges || 0),
          electricityDuty: parseFloat(bill.electricityDuty || 0),
          gst: parseFloat(bill.gstAmount || 0),
          totalAmount: parseFloat(bill.totalAmount),
          tariffSlabs: []
        }
      }));

      setBills(transformedBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      // Fallback to mock data if API fails
      setBills([
    {
      id: 1,
      billNumber: 'BILL-202410-001234',
      month: 'October 2024',
      issueDate: '2024-10-01',
      dueDate: '2024-10-15',
      units: 460,
      amount: 245.50,
      status: 'paid',
      paidDate: '2024-10-05',
      paymentMethod: 'Online Banking',
      breakdown: {
        baseAmount: 184.00,
        fixedCharges: 25.00,
        electricityDuty: 10.45,
        gst: 39.50,
        totalAmount: 258.95,
        tariffSlabs: [
          { units: 100, rate: 3.50, amount: 350.00 },
          { units: 200, rate: 4.00, amount: 800.00 },
          { units: 160, rate: 5.00, amount: 800.00 }
        ]
      }
    },
    {
      id: 2,
      billNumber: 'BILL-202409-001234',
      month: 'September 2024',
      issueDate: '2024-09-01',
      dueDate: '2024-09-15',
      units: 420,
      amount: 220.00,
      status: 'paid',
      paidDate: '2024-09-12',
      paymentMethod: 'Credit Card'
    },
    {
      id: 3,
      billNumber: 'BILL-202408-001234',
      month: 'August 2024',
      issueDate: '2024-08-01',
      dueDate: '2024-08-15',
      units: 485,
      amount: 258.75,
      status: 'paid'
    },
    {
      id: 4,
      billNumber: 'BILL-202407-001234',
      month: 'July 2024',
      issueDate: '2024-07-01',
      dueDate: '2024-07-15',
      units: 510,
      amount: 275.00,
      status: 'paid'
    },
    {
      id: 5,
      billNumber: 'BILL-202406-001234',
      month: 'June 2024',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      units: 380,
      amount: 195.50,
      status: 'paid'
    },
    {
      id: 6,
      billNumber: 'BILL-202405-001234',
      month: 'May 2024',
      issueDate: '2024-05-01',
      dueDate: '2024-05-15',
      units: 445,
      amount: 235.00,
      status: 'paid'
    }
  ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.month.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Analytics calculations with safe checks
  const totalPaid = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const avgConsumption = bills.length > 0 ? Math.round(bills.reduce((sum, b) => sum + b.units, 0) / bills.length) : 0;
  const avgAmount = bills.length > 0 ? (bills.reduce((sum, b) => sum + b.amount, 0) / bills.length).toFixed(2) : '0';
  const currentMonth = bills[0];
  const lastMonth = bills[1];
  const consumptionChange = currentMonth && lastMonth ? ((currentMonth.units - lastMonth.units) / lastMonth.units * 100).toFixed(1) : '0';
  const amountChange = currentMonth && lastMonth ? ((currentMonth.amount - lastMonth.amount) / lastMonth.amount * 100).toFixed(1) : '0';

  // Combined Chart Data - Shows both consumption and cost
  const combinedTrendData = {
    labels: bills.map(b => b.month.split(' ')[0]).reverse(),
    datasets: [
      {
        label: 'Units Consumed (kWh)',
        data: bills.map(b => b.units).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y'
      },
      {
        label: 'Bill Amount (₹)',
        data: bills.map(b => b.amount).reverse(),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2,
        borderRadius: 8,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: { size: 13 },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        bodySpacing: 6,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
          font: { size: 12 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawOnChartArea: false
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units (kWh)',
          color: 'rgb(59, 130, 246)',
          font: { size: 12, weight: 'bold' as const }
        },
        ticks: {
          color: 'rgb(59, 130, 246)',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(59, 130, 246, 0.1)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)',
          color: 'rgb(251, 191, 36)',
          font: { size: 12, weight: 'bold' as const }
        },
        ticks: {
          color: 'rgb(251, 191, 36)',
          font: { size: 11 }
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleRequestBill = async () => {
    // API call to create bill request
    try {
      const response = await fetch('/api/bills/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestForm),
      });

      if (response.ok) {
        alert('Bill request submitted successfully! You will receive your bill within 24 hours.');
        setShowRequestModal(false);
        setRequestForm({ billingMonth: '', priority: 'medium', notes: '' });
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Request error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDownloadPDF = async (bill: Bill) => {
    try {
      // In production, this would call API endpoint to generate PDF
      // For now, create a simple HTML version and use browser print
      const response = await fetch(`/api/bills/${bill.id}/pdf`, {
        method: 'POST',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${bill.billNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Fallback: Open bill in new window for user to save as PDF
        window.open(`/bills/pdf/${bill.id}`, '_blank');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      // Fallback: Show print dialog
      handlePrint(bill);
    }
  };

  const handlePrint = (bill: Bill) => {
    // Open bill in modal and trigger print
    setSelectedBill(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) {
    return (
      <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="customer" userName={session?.user?.name || 'Customer'}>
      <div className="max-w-[1920px] mx-auto space-y-6 pb-8">
        {/* Header with Request Button */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bills & Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">View detailed bill history, analytics, and request new bills</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Request Bill</span>
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <FileText className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">Total Paid</p>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalPaid.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last 6 months</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">Avg Consumption</p>
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgConsumption}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">kWh/month</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">Avg Bill Amount</p>
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{avgAmount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">per month</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">This Month</p>
              {parseFloat(consumptionChange) > 0 ?
                <TrendingUp className="w-6 h-6 text-red-400" /> :
                <TrendingDown className="w-6 h-6 text-green-400" />
              }
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentMonth.units} kWh</p>
            <p className={`text-sm mt-1 ${parseFloat(consumptionChange) > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {parseFloat(consumptionChange) > 0 ? '+' : ''}{consumptionChange}% vs last month
            </p>
          </div>
        </div>

        {/* Combined Usage & Cost Analytics */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Consumption & Cost Trend Analysis</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">6-month historical comparison of energy usage and billing amounts</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Energy Usage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Bill Amount</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <Bar data={combinedTrendData} options={chartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Units/Month</p>
              <p className="text-2xl font-bold text-blue-500">{avgConsumption} kWh</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-xl p-4 border border-yellow-400/20">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Bill/Month</p>
              <p className="text-2xl font-bold text-yellow-400">₹{avgAmount}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cost per Unit</p>
              <p className="text-2xl font-bold text-purple-400">₹{(parseFloat(avgAmount) / avgConsumption).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by bill number or month..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 font-medium"
              >
                <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">All Status</option>
                <option value="paid" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Paid</option>
                <option value="pending" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Pending</option>
                <option value="overdue" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bills Table */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Bill Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Billing Period</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Units (kWh)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{bill.billNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">{bill.month}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Issued: {bill.issueDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{bill.units}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-yellow-400">₹{bill.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bill.dueDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.status)}`}>
                        {getStatusIcon(bill.status)}
                        <span className="capitalize">{bill.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/customer/bill-view?id=${bill.id}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 group"
                        aria-label="View and print bill"
                      >
                        <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>View</span>
                        <span className="text-blue-200 dark:text-blue-300">/</span>
                        <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill Details Modal */}
        {selectedBill && selectedBill.breakdown && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Bill Details</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedBill.billNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Bill Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Billing Period</p>
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedBill.month}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Due Date</p>
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedBill.dueDate}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Units Consumed</p>
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedBill.units} kWh</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(selectedBill.status)}
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Status</p>
                    </div>
                    <p className={`font-semibold capitalize ${
                      selectedBill.status === 'paid' ? 'text-green-400' :
                      selectedBill.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {selectedBill.status}
                    </p>
                  </div>
                </div>

                {/* Tariff Slab Breakdown */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tariff Slab Breakdown</h3>
                  <div className="space-y-3">
                    {selectedBill.breakdown.tariffSlabs.map((slab, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-semibold">{slab.units} kWh</p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">@ ₹{slab.rate}/kWh</p>
                          </div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-bold">₹{slab.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Charges Breakdown */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Charges Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">Base Amount (Energy Charges)</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.baseAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">Fixed Charges</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.fixedCharges.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">Electricity Duty (5%)</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.electricityDuty.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-gray-400">GST (18%)</p>
                      <p className="text-gray-900 dark:text-white font-semibold">₹{selectedBill.breakdown.gst.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between py-3 pt-4 border-t-2 border-gray-300 dark:border-white/20">
                      <p className="text-gray-900 dark:text-white font-bold text-lg">Total Amount</p>
                      <p className="text-yellow-400 font-bold text-2xl">₹{selectedBill.breakdown.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info (if paid) */}
                {selectedBill.status === 'paid' && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-500/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-bold text-white">Payment Received</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Payment Date</p>
                        <p className="text-white font-semibold">{selectedBill.paidDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Payment Method</p>
                        <p className="text-white font-semibold">{selectedBill.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => selectedBill && handleDownloadPDF(selectedBill)}
                    disabled={selectedBill?.status !== 'paid'}
                    className={`flex-1 px-6 py-3 rounded-xl transition-all font-semibold flex items-center justify-center space-x-2 ${
                      selectedBill?.status === 'paid'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/50'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    <span>{selectedBill?.status === 'paid' ? 'Download PDF' : 'PDF Available After Payment'}</span>
                  </button>
                  <button
                    onClick={() => selectedBill && handlePrint(selectedBill)}
                    className="flex-1 px-6 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print Bill</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Bill Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 max-w-2xl w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request New Bill</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your bill will be generated within 24 hours</p>
                  </div>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Billing Month <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="month"
                    value={requestForm.billingMonth}
                    onChange={(e) => setRequestForm({ ...requestForm, billingMonth: e.target.value })}
                    max={new Date().toISOString().slice(0, 7)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Priority</label>
                  <select
                    value={requestForm.priority}
                    onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 font-medium"
                  >
                    <option value="low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Low - Normal processing</option>
                    <option value="medium" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Medium - Within 24 hours</option>
                    <option value="high" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">High - Urgent (within 12 hours)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Notes (Optional)</label>
                  <textarea
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Add any special instructions or reasons for this request..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">What happens next?</h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Your request will be sent to our billing team</li>
                        <li>• We'll verify your meter reading for the selected month</li>
                        <li>• Bill will be generated and sent to your registered email</li>
                        <li>• You'll receive a notification once it's ready</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleRequestBill}
                    disabled={!requestForm.billingMonth}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl transition-all font-semibold flex items-center justify-center space-x-2 ${
                      !requestForm.billingMonth
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-lg hover:shadow-blue-500/50'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Request</span>
                  </button>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-6 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
