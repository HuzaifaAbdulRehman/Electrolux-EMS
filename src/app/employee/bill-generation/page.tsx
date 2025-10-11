'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  FileText,
  Search,
  Calculator,
  Eye,
  Send,
  Download,
  CheckCircle,
  AlertCircle,
  Zap,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function BillGeneration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [billData, setBillData] = useState({
    currentReading: '',
    previousReading: '',
    additionalCharges: '0',
    discount: '0'
  });
  const [generatedBill, setGeneratedBill] = useState<any>(null);

  const mockCustomer = {
    accountNumber: 'ELX-2024-001234',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, Apt 4B',
    meterNumber: 'MTR-485729',
    previousReading: 12485,
    currentReading: 12945
  };

  const handleSearch = () => {
    if (searchQuery) {
      setSelectedCustomer(mockCustomer);
      setBillData({
        ...billData,
        previousReading: mockCustomer.previousReading.toString(),
        currentReading: mockCustomer.currentReading.toString()
      });
    }
  };

  const calculateBill = () => {
    const units = Number(billData.currentReading) - Number(billData.previousReading);
    const energyCharge = units * 0.12; // Simple calculation
    const fixedCharge = 50;
    const tax = (energyCharge + fixedCharge) * 0.15;
    const total = energyCharge + fixedCharge + tax + Number(billData.additionalCharges) - Number(billData.discount);

    return { units, energyCharge, fixedCharge, tax, total };
  };

  const handleGenerateBill = () => {
    const calculation = calculateBill();
    setGeneratedBill({
      billNumber: `BILL-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customer: selectedCustomer,
      ...calculation
    });
  };

  return (
    <DashboardLayout userType="employee" userName="Mike Johnson">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bill Generation</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate customer electricity bills</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Bills Today', value: '45', icon: FileText, color: 'from-blue-500 to-cyan-500' },
            { label: 'Pending', value: '12', icon: AlertCircle, color: 'from-yellow-400 to-orange-500' },
            { label: 'Total Amount', value: '$18.5K', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
            { label: 'Avg Bill', value: '$245', icon: Calculator, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Search */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Customer</h2>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter account number, meter number, or customer name"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Customer Info */}
        {selectedCustomer && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Information</h2>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Name:</span>
                  <span className="text-white font-semibold">{selectedCustomer.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Email:</span>
                  <span className="text-gray-900 dark:text-white">{selectedCustomer.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Phone:</span>
                  <span className="text-gray-900 dark:text-white">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Meter:</span>
                  <span className="text-gray-900 dark:text-white">{selectedCustomer.meterNumber}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Address:</span>
                  <span className="text-gray-900 dark:text-white">{selectedCustomer.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bill Form */}
        {selectedCustomer && !generatedBill && (
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Bill Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Previous Reading (kWh) *</label>
                <input
                  type="number"
                  value={billData.previousReading}
                  onChange={(e) => setBillData({ ...billData, previousReading: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Current Reading (kWh) *</label>
                <input
                  type="number"
                  value={billData.currentReading}
                  onChange={(e) => setBillData({ ...billData, currentReading: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Additional Charges ($)</label>
                <input
                  type="number"
                  value={billData.additionalCharges}
                  onChange={(e) => setBillData({ ...billData, additionalCharges: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Discount ($)</label>
                <input
                  type="number"
                  value={billData.discount}
                  onChange={(e) => setBillData({ ...billData, discount: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
            </div>

            {billData.currentReading && billData.previousReading && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Units Consumed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Number(billData.currentReading) - Number(billData.previousReading)} kWh
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Estimated Amount</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${calculateBill().total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateBill}
              className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all font-semibold flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>Generate Bill</span>
            </button>
          </div>
        )}

        {/* Bill Preview */}
        {generatedBill && (
          <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bill Preview</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setGeneratedBill(null)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all"
                >
                  Edit
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 text-gray-900">
              <div className="border-b-2 border-gray-200 pb-4 mb-4">
                <h1 className="text-2xl font-bold flex items-center">
                  <Zap className="w-6 h-6 text-yellow-500 mr-2" />
                  Electrolux - Electricity Bill
                </h1>
                <p className="text-sm">Bill No: {generatedBill.billNumber}</p>
                <p className="text-sm">Date: {generatedBill.date}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Customer: {generatedBill.customer.name}</h3>
                <p className="text-sm">Account: {generatedBill.customer.accountNumber}</p>
                <p className="text-sm">Meter: {generatedBill.customer.meterNumber}</p>
              </div>

              <table className="w-full mb-4">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2">Units Consumed</td>
                    <td className="py-2 text-right font-semibold">{generatedBill.units} kWh</td>
                  </tr>
                  <tr>
                    <td className="py-2">Energy Charges</td>
                    <td className="py-2 text-right">${generatedBill.energyCharge.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Fixed Charges</td>
                    <td className="py-2 text-right">${generatedBill.fixedCharge.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Tax (15%)</td>
                    <td className="py-2 text-right">${generatedBill.tax.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t-2 border-gray-800">
                    <td className="py-3 text-lg font-bold">Total Amount</td>
                    <td className="py-3 text-right text-2xl font-bold text-blue-600">${generatedBill.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Coming Soon Notice */}
        {!selectedCustomer && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-12 border border-green-500/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Advanced Bill Generation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Search for a customer to generate their electricity bill with detailed calculations and instant PDF generation.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
