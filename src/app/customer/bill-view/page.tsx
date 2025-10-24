'use client';

import React from 'react';
import {
  Zap,
  AlertTriangle,
  Lightbulb,
  Shield,
  Phone
} from 'lucide-react';

export default function BillView() {

  // Mock bill data (will come from backend)
  const billData = {
    billNumber: 'BILL-202410-001234',
    issueDate: '2024-10-10',
    dueDate: '2024-10-25',
    status: 'PENDING',
    customer: {
      name: 'Customer Name',
      accountNumber: 'ELX-2024-001234',
      meterNumber: 'MTR-485729',
      address: '123 Main Street, Apt 4B, Downtown Area, City 12345',
      connectionType: 'Residential',
      billingMonth: 'October 2024'
    },
    reading: {
      previous: 12485,
      current: 12945,
      previousDate: '2024-09-10',
      currentDate: '2024-10-10',
      unitsConsumed: 460
    },
    charges: {
      slabs: [
        { range: '0-100 units', units: 100, rate: 0.35, amount: 35.00 },
        { range: '101-200 units', units: 100, rate: 0.45, amount: 45.00 },
        { range: '201-300 units', units: 100, rate: 0.55, amount: 55.00 },
        { range: '301-460 units', units: 160, rate: 0.65, amount: 104.00 }
      ],
      energyCharge: 239.00,
      fixedCharge: 50.00,
      subtotal: 289.00,
      electricityDuty: 14.45,
      gst: 52.02,
      total: 355.47
    },
    history: [
      { month: 'May 2024', units: 420, amount: 310.50 },
      { month: 'Jun 2024', units: 450, amount: 335.00 },
      { month: 'Jul 2024', units: 485, amount: 365.75 },
      { month: 'Aug 2024', units: 440, amount: 325.00 },
      { month: 'Sep 2024', units: 465, amount: 345.25 },
      { month: 'Oct 2024', units: 460, amount: 355.47 }
    ]
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          html, body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          body, .print-container, .bg-white {
            background: white !important;
            box-shadow: none !important;
            color: #222 !important;
          }
          /* Ensure both ELECTROLUX company headers always print */
          .bg-gradient-to-r[from-yellow-400][to-orange-500],
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            background: linear-gradient(to right, #facc15, #f97316) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background-image: linear-gradient(to right, #facc15, #f97316) !important;
            background-blend-mode: normal !important;
            color: #fff !important;
          }
          .bg-gray-800 {
            background: #1f2937 !important;
            color: #fff !important;
          }
          /* Company name h1 and h2 always visible and bold */
          h1, h2, .print-company-header {
            color: #fff !important;
            font-weight: bold !important;
            text-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide navigation/topbar and only UI, not headers */
          .no-print, nav, .sidebar, .nav, .topbar {
            display: none !important;
            height: 0 !important;
            visibility: hidden !important;
          }
          .border, .border-yellow-400, .border-l-4, .border-orange-500, .border-green-500, .border-red-500, .border-blue-500, .border-t-2, .border-gray-300 {
            border-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .rounded-lg, .rounded-xl, .rounded-2xl {
            border-radius: 0.25rem !important;
          }
          .shadow, .shadow-lg {
            box-shadow: none !important;
          }
          .px-6, .py-4, .py-3, .p-4, .p-3, .p-2 {
            padding-left: 12px !important;
            padding-right: 12px !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
          .page-break {
            display: block !important;
            page-break-before: always !important;
            break-before: page !important;
            height: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: none !important;
            border: none !important;
          }
          @page {
            margin: 0.3cm;
          }
        }
      `}</style>

      {/* Bill Content */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 print-container">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Bill Container */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">ELECTROLUX</h1>
                  <p className="text-white/90 text-xs">Electricity Management System</p>
                </div>
                <div className="text-right text-xs text-white">
                  <p>1-800-ELECTRIC</p>
                  <p>www.electrolux.com</p>
                </div>
              </div>
            </div>

            {/* Bill Title */}
            <div className="bg-gray-800 px-6 py-2">
              <h2 className="text-xl font-bold text-white text-center">ELECTRICITY BILL</h2>
            </div>

            {/* Bill Body */}
            <div className="px-6 py-3 space-y-3">
              {/* Customer & Bill Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b-2 border-yellow-400">
                    CUSTOMER INFORMATION
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="text-gray-900 font-semibold">{billData.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Account No:</span>
                      <span className="text-gray-900 font-semibold">{billData.customer.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Meter No:</span>
                      <span className="text-gray-900 font-semibold">{billData.customer.meterNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Connection Type:</span>
                      <span className="text-gray-900 font-semibold">{billData.customer.connectionType}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-600 font-medium mb-1">Address:</p>
                      <p className="text-gray-900 text-sm">{billData.customer.address}</p>
                    </div>
                  </div>
                </div>

                {/* Bill Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b-2 border-yellow-400">
                    BILLING DETAILS
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Bill Number:</span>
                      <span className="text-gray-900 font-semibold">{billData.billNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Billing Month:</span>
                      <span className="text-gray-900 font-semibold">{billData.customer.billingMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Issue Date:</span>
                      <span className="text-gray-900 font-semibold">{billData.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Due Date:</span>
                      <span className="text-red-600 font-bold">{billData.dueDate}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600 font-medium">Payment Status:</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                        {billData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meter Reading */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b-2 border-yellow-400">
                  METER READING
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Previous</p>
                    <p className="text-lg font-bold text-gray-900">{billData.reading.previous.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{billData.reading.previousDate}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Current</p>
                    <p className="text-lg font-bold text-gray-900">{billData.reading.current.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{billData.reading.currentDate}</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Consumed</p>
                    <p className="text-lg font-bold text-orange-600">{billData.reading.unitsConsumed}</p>
                    <p className="text-xs text-gray-500">kWh</p>
                  </div>
                </div>
              </div>

              {/* Charges Breakdown */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 pb-1 border-b-2 border-yellow-400">
                  CHARGES BREAKDOWN
                </h3>

                {/* Slab Details */}
                <div className="mb-2">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left text-gray-700 font-semibold">Range</th>
                        <th className="px-2 py-1 text-right text-gray-700 font-semibold">Units</th>
                        <th className="px-2 py-1 text-right text-gray-700 font-semibold">Rate</th>
                        <th className="px-2 py-1 text-right text-gray-700 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {billData.charges.slabs.map((slab, index) => (
                        <tr key={index}>
                          <td className="px-2 py-1 text-gray-600">{slab.range}</td>
                          <td className="px-2 py-1 text-right text-gray-900">{slab.units}</td>
                          <td className="px-2 py-1 text-right text-gray-900">${slab.rate.toFixed(2)}</td>
                          <td className="px-2 py-1 text-right text-gray-900 font-semibold">${slab.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-2 rounded space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Energy Charges:</span>
                    <span className="text-gray-900 font-semibold">${billData.charges.energyCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Fixed Charges:</span>
                    <span className="text-gray-900 font-semibold">${billData.charges.fixedCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-gray-300">
                    <span className="text-gray-700 font-medium">Subtotal:</span>
                    <span className="text-gray-900 font-semibold">${billData.charges.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Electricity Duty (5%):</span>
                    <span className="text-gray-900 font-semibold">${billData.charges.electricityDuty.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="text-gray-900 font-semibold">${billData.charges.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t-2 border-gray-400">
                    <span className="text-gray-900">TOTAL AMOUNT DUE:</span>
                    <span className="text-orange-600">${billData.charges.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Page 1 */}
            <div className="bg-gray-100 px-4 py-2 border-t-2 border-gray-300">
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Computer-generated bill. Questions? support@electrolux.com | 1-800-ELECTRIC
                </p>
              </div>
            </div>
          </div>

          {/* PAGE BREAK - This forces 6-month history to print on Page 2 (back side) */}
          <div className="page-break"></div>

          {/* Page 2: Usage History & Payment Info - For Back of Paper */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6 print:mt-0">
            {/* Header for Page 2 */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">USAGE HISTORY & PAYMENT INFO</h2>
                  <p className="text-white/90 text-xs">{billData.billNumber} | {billData.customer.billingMonth}</p>
                </div>
                <p className="text-white text-xs">Page 2 of 2</p>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* Usage History & Payment Notice - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Payment Notice & QR Code */}
                <div className="space-y-2">
                  {/* Payment Notice */}
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                    <h3 className="text-sm font-bold text-orange-900 mb-2">PAYMENT DUE</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-800">Amount:</span>
                        <span className="text-xl font-bold text-orange-600">${billData.charges.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-orange-700">Due Date:</span>
                        <span className="font-bold text-orange-900">{billData.dueDate}</span>
                      </div>
                      <p className="text-xs text-orange-700 mt-2 pt-2 border-t border-orange-200">
                        Pay online at www.electrolux.com/pay or via mobile app
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs">
                    <p className="text-blue-800">
                      <span className="font-bold">Avg. Daily:</span> {(billData.reading.unitsConsumed / 30).toFixed(1)} kWh
                      <span className="mx-2">•</span>
                      <span className="font-bold">Tariff:</span> Residential Slab
                    </p>
                  </div>
                </div>

                {/* Right: 6-Month Usage History - Compact Bar Chart */}
                <div>
                  <h3 className="text-xs font-bold text-gray-900 mb-2 pb-1 border-b border-yellow-400 flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                    6-MONTH USAGE HISTORY
                  </h3>
                  <div className="grid grid-cols-6 gap-1">
                    {billData.history.map((record, index) => {
                      const maxUnits = Math.max(...billData.history.map(h => h.units));
                      const heightPercent = (record.units / maxUnits) * 100;
                      const isCurrentMonth = index === billData.history.length - 1;
                      return (
                        <div key={index} className="text-center">
                          <div className="h-14 flex flex-col justify-end mb-1">
                            <div
                              className={`w-full rounded-t transition-all ${
                                isCurrentMonth ? 'bg-yellow-500' : 'bg-blue-400'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                          </div>
                          <p className={`text-xs font-semibold ${isCurrentMonth ? 'text-yellow-600' : 'text-gray-700'}`}>
                            {record.units}
                          </p>
                          <p className="text-xs text-gray-500">{record.month.split(' ')[0]}</p>
                          <p className={`text-xs ${isCurrentMonth ? 'text-yellow-600 font-semibold' : 'text-gray-500'}`}>
                            ${record.amount.toFixed(0)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Important Information - Compact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Energy Saving Tips */}
                <div className="bg-green-50 border-l-2 border-green-500 p-1.5">
                  <h3 className="text-xs font-bold text-green-900 mb-0.5 flex items-center">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    TIPS
                  </h3>
                  <p className="text-xs text-green-800 leading-tight">
                    Use LED bulbs, set AC to 24°C, shift usage to off-peak hours (10PM-6AM)
                  </p>
                </div>

                {/* Electricity Theft Warning */}
                <div className="bg-red-50 border-l-2 border-red-500 p-1.5">
                  <h3 className="text-xs font-bold text-red-900 mb-0.5 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    THEFT WARNING
                  </h3>
                  <p className="text-xs text-red-800 leading-tight">
                    Criminal offense. Penalties: $100K fine OR 3 years jail. Report: 1800-XXX-XXXX
                  </p>
                </div>

                {/* Payment Options */}
                <div className="bg-blue-50 border-l-2 border-blue-500 p-1.5">
                  <h3 className="text-xs font-bold text-blue-900 mb-0.5 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    PAYMENT
                  </h3>
                  <p className="text-xs text-blue-800 leading-tight">
                    Online/App/Bank. ⚠️ Late fee: 1.5%/month
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-4 py-2 border-t-2 border-gray-300">
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Computer-generated bill. Questions? support@electrolux.com | 1-800-ELECTRIC
                </p>
              </div>
            </div>
          </div>

          {/* Print Instructions - Hidden on Print */}
          <div className="no-print mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">Printing Instructions:</p>
                <p>Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl+P</kbd> or use your browser's print function. You can save as PDF using "Save as PDF" or "Microsoft Print to PDF" option.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
