'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Calculator,
  Zap,
  DollarSign,
  TrendingUp,
  Info,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';

export default function BillCalculator() {
  const router = useRouter();
  const [units, setUnits] = useState('');
  const [connectionType, setConnectionType] = useState('residential');
  const [calculated, setCalculated] = useState(false);

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Downloading calculation...');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving calculation...');
  };

  // Tariff Rates (per kWh)
  const tariffRates: any = {
    residential: {
      name: 'Residential',
      slabs: [
        { min: 0, max: 100, rate: 0.35, label: '0-100 units' },
        { min: 100, max: 200, rate: 0.45, label: '101-200 units' },
        { min: 200, max: 300, rate: 0.55, label: '201-300 units' },
        { min: 300, max: Infinity, rate: 0.65, label: '301+ units' }
      ],
      fixedCharge: 50
    },
    commercial: {
      name: 'Commercial',
      slabs: [
        { min: 0, max: 200, rate: 0.60, label: '0-200 units' },
        { min: 200, max: 500, rate: 0.70, label: '201-500 units' },
        { min: 500, max: Infinity, rate: 0.80, label: '501+ units' }
      ],
      fixedCharge: 150
    },
    industrial: {
      name: 'Industrial',
      slabs: [
        { min: 0, max: 1000, rate: 0.50, label: '0-1000 units' },
        { min: 1000, max: Infinity, rate: 0.55, label: '1001+ units' }
      ],
      fixedCharge: 500
    }
  };

  const calculateBill = () => {
    const unitsConsumed = parseFloat(units);
    if (!unitsConsumed || unitsConsumed <= 0) {
      alert('Please enter valid units');
      return;
    }

    const selectedTariff = tariffRates[connectionType];
    let energyCharge = 0;
    let remainingUnits = unitsConsumed;

    // Calculate slab-wise energy charge
    for (const slab of selectedTariff.slabs) {
      if (remainingUnits <= 0) break;

      const slabUnits = Math.min(
        remainingUnits,
        slab.max === Infinity ? remainingUnits : slab.max - slab.min
      );

      energyCharge += slabUnits * slab.rate;
      remainingUnits -= slabUnits;
    }

    setCalculated(true);
  };

  const resetCalculator = () => {
    setUnits('');
    setConnectionType('residential');
    setCalculated(false);
  };

  // Calculate all charges
  const unitsConsumed = parseFloat(units) || 0;
  const selectedTariff = tariffRates[connectionType];

  let energyCharge = 0;
  let remainingUnits = unitsConsumed;

  for (const slab of selectedTariff.slabs) {
    if (remainingUnits <= 0) break;
    const slabUnits = Math.min(
      remainingUnits,
      slab.max === Infinity ? remainingUnits : slab.max - slab.min
    );
    energyCharge += slabUnits * slab.rate;
    remainingUnits -= slabUnits;
  }

  const fixedCharge = selectedTariff.fixedCharge;
  const subtotal = energyCharge + fixedCharge;
  const electricityDuty = subtotal * 0.05; // 5% duty
  const gst = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + electricityDuty + gst;

  return (
    <DashboardLayout userType="customer" userName="Huzaifa">
      <div className="h-full flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-yellow-500" />
                Bill Calculator
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calculate your electricity bill with accurate tariff rates
              </p>
            </div>
            <button
              onClick={resetCalculator}
              className="mt-3 sm:mt-0 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center space-x-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Section */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Enter Details
            </h2>

            <div className="space-y-4">
              {/* Connection Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Connection Type
                </label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 text-base font-medium"
                >
                  <option value="residential" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Residential</option>
                  <option value="commercial" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Commercial</option>
                  <option value="industrial" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Industrial</option>
                </select>
              </div>

              {/* Units Consumed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Units Consumed (kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="Enter units consumed"
                    className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-base"
                  />
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500" />
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateBill}
                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center space-x-2 font-semibold text-lg"
              >
                <Calculator className="w-5 h-5" />
                <span>Calculate Bill</span>
              </button>
            </div>

            {/* Tariff Info */}
            <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Info className="w-3 h-3 mr-1 text-blue-400" />
                Current Tariff Rates - {selectedTariff.name}
              </h3>
              <div className="space-y-1">
                {selectedTariff.slabs.map((slab: any, index: number) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{slab.label}</span>
                    <span className="text-gray-900 dark:text-white font-medium">${slab.rate}/unit</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs pt-1 border-t border-blue-500/20">
                  <span className="text-gray-600 dark:text-gray-400">Fixed Charge</span>
                  <span className="text-gray-900 dark:text-white font-medium">${selectedTariff.fixedCharge}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-500" />
              Bill Breakdown
            </h2>

            {calculated && unitsConsumed > 0 ? (
              <div className="space-y-4">
                {/* Bill Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">Energy Charges</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold">${energyCharge.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                    <span className="text-gray-600 dark:text-gray-400">Fixed Charges</span>
                    <span className="text-gray-900 dark:text-white font-semibold">${fixedCharge.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                    <span className="text-gray-600 dark:text-gray-400">Electricity Duty (5%)</span>
                    <span className="text-gray-900 dark:text-white font-semibold">${electricityDuty.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                    <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                    <span className="text-gray-900 dark:text-white font-semibold">${gst.toFixed(2)}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
                    </div>
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Units Consumed</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{unitsConsumed}</p>
                    <p className="text-xs text-yellow-400">kWh</p>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average Rate</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${(totalAmount / unitsConsumed).toFixed(2)}
                    </p>
                    <p className="text-xs text-green-400">per kWh</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={handleDownload}
                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Calculate Your Bill
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                  Enter connection type and units to get accurate estimate
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Info className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">How It Works</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Bills calculated using slab-based tariff rates encouraging conservation.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Save Money</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Reduce consumption to stay in lower slabs for more savings!
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Accurate Estimates</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Official tariff rates with all applicable taxes included.
            </p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
