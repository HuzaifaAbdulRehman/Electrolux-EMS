'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Zap,
  DollarSign,
  CreditCard,
  Gauge,
  TrendingUp,
  Database,
  AlertTriangle,
  FileSpreadsheet,
  Eye,
  Trash2,
  RefreshCw,
  Clock,
  XCircle
} from 'lucide-react';

export default function DataImport() {
  const [selectedType, setSelectedType] = useState('users');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'validating' | 'importing' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<any>(null);

  // Data types with their configurations
  const dataTypes = [
    {
      id: 'users',
      name: 'Users',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Import customer, employee, and admin users',
      requiredFields: ['email', 'password', 'user_type', 'full_name', 'phone'],
      sampleCount: '50 customers + 15 employees + 7 admins'
    },
    {
      id: 'customers',
      name: 'Customers',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      description: 'Import customer-specific information',
      requiredFields: ['account_number', 'address', 'connection_type', 'meter_number'],
      sampleCount: '50 customer records'
    },
    {
      id: 'meter_readings',
      name: 'Meter Readings',
      icon: Gauge,
      color: 'from-purple-500 to-pink-500',
      description: 'Import historical meter readings',
      requiredFields: ['customer_id', 'meter_number', 'current_reading', 'reading_date'],
      sampleCount: '300 readings (6 months × 50 customers)'
    },
    {
      id: 'bills',
      name: 'Bills',
      icon: FileText,
      color: 'from-yellow-400 to-orange-500',
      description: 'Import billing records',
      requiredFields: ['customer_id', 'bill_number', 'billing_month', 'units_consumed', 'total_amount'],
      sampleCount: '300 bill records'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: CreditCard,
      color: 'from-red-500 to-pink-500',
      description: 'Import payment transactions',
      requiredFields: ['bill_id', 'transaction_id', 'amount', 'payment_method', 'payment_date'],
      sampleCount: 'Variable (based on paid bills)'
    },
    {
      id: 'tariffs',
      name: 'Tariffs',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      description: 'Import tariff rate structures',
      requiredFields: ['connection_type', 'slab_min', 'slab_max', 'rate_per_unit', 'fixed_charge'],
      sampleCount: 'Tariff slabs for all connection types'
    }
  ];

  // Import history (mock data)
  const importHistory = [
    {
      id: 1,
      type: 'users',
      fileName: 'users_seed.csv',
      recordsImported: 72,
      status: 'success',
      importedAt: '2024-10-10 14:30:00',
      importedBy: 'Sarah Admin'
    },
    {
      id: 2,
      type: 'customers',
      fileName: 'customers_seed.csv',
      recordsImported: 50,
      status: 'success',
      importedAt: '2024-10-10 14:35:00',
      importedBy: 'Sarah Admin'
    },
    {
      id: 3,
      type: 'meter_readings',
      fileName: 'readings_partial.csv',
      recordsImported: 0,
      status: 'error',
      importedAt: '2024-10-10 15:00:00',
      importedBy: 'Sarah Admin',
      error: 'Validation failed: Invalid meter numbers'
    }
  ];

  const selectedTypeConfig = dataTypes.find(t => t.id === selectedType);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setShowPreview(false);
      setValidationErrors([]);
      setImportStatus('idle');

      // Parse CSV for preview (simplified - real implementation would use a CSV parser)
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(0, 6); // First 5 rows + header
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => {
          const values = line.split(',');
          const row: any = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
          });
          return row;
        });
        setPreviewData(rows);
      };
      reader.readAsText(file);
    }
  };

  const validateData = () => {
    setImportStatus('validating');
    const errors: string[] = [];

    // Simulate validation
    setTimeout(() => {
      // Mock validation errors
      if (uploadedFile?.name.includes('invalid')) {
        errors.push('Row 15: Email format is invalid');
        errors.push('Row 23: Phone number must be 10 digits');
        errors.push('Row 45: Duplicate account number found');
        setValidationErrors(errors);
        setImportStatus('error');
      } else {
        setValidationErrors([]);
        setShowPreview(true);
        setImportStatus('idle');
      }
    }, 1500);
  };

  const handleImport = () => {
    setImporting(true);
    setImportStatus('importing');
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          setImportStatus('success');
          setImportResult({
            totalRecords: previewData.length * 50, // Simulated
            successfulImports: previewData.length * 48,
            failedImports: previewData.length * 2,
            duration: '3.2s'
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const downloadTemplate = (type: string) => {
    // This would generate and download a CSV template
    // For now, we'll just show an alert
    alert(`Downloading ${type} template CSV...`);

    // In real implementation:
    // const csv = generateTemplateCSV(type);
    // downloadFile(csv, `${type}_template.csv`);
  };

  const resetImport = () => {
    setUploadedFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setImporting(false);
    setImportProgress(0);
    setImportStatus('idle');
    setValidationErrors([]);
    setImportResult(null);
  };

  return (
    <DashboardLayout userType="admin" userName="Sarah Johnson">
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                <Database className="w-6 h-6 mr-2 text-red-400" />
                Data Import Center
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Import bulk data from CSV files with validation and preview
              </p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-2">
              <button
                onClick={resetImport}
                className="px-4 py-2 bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all text-sm flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Sidebar - Data Type Selection */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Select Data Type
                </h2>
                <div className="space-y-2">
                  {dataTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        resetImport();
                      }}
                      className={`w-full p-3 rounded-xl border transition-all text-left ${
                        selectedType === type.id
                          ? 'border-red-400/50 bg-red-500/10'
                          : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <type.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{type.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{type.sampleCount}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-4 border border-red-500/20">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Import Guidelines</h3>
                <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>CSV files only (UTF-8 encoded)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Max file size: 10MB</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>First row must be headers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Use templates for format</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Import Configuration */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      <selectedTypeConfig!.icon className="w-5 h-5 mr-2" />
                      Import {selectedTypeConfig?.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedTypeConfig?.description}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadTemplate(selectedType)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Template</span>
                  </button>
                </div>

                {/* Required Fields */}
                <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Required Fields:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypeConfig?.requiredFields.map((field) => (
                      <span
                        key={field}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-mono"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* File Upload Area */}
                {!uploadedFile && importStatus === 'idle' && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center hover:border-red-400 dark:hover:border-red-400 transition-all">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload CSV File</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Drag and drop your file here, or click to browse
                    </p>
                    <label className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all cursor-pointer font-semibold">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      Choose File
                    </label>
                  </div>
                )}

                {/* Uploaded File Info */}
                {uploadedFile && importStatus !== 'success' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {(uploadedFile.size / 1024).toFixed(2)} KB • {previewData.length * 50} estimated rows
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={resetImport}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                        <div className="flex items-center space-x-2 mb-3">
                          <XCircle className="w-5 h-5 text-red-400" />
                          <h3 className="text-sm font-bold text-red-400">Validation Errors Found</h3>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {validationErrors.map((error, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-red-300">{error}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {!showPreview && importStatus === 'idle' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={validateData}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-5 h-5" />
                          <span>Validate & Preview</span>
                        </button>
                      </div>
                    )}

                    {/* Validating State */}
                    {importStatus === 'validating' && (
                      <div className="p-6 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm font-semibold text-blue-400">Validating data...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Preview Data */}
                {showPreview && previewData.length > 0 && importStatus !== 'success' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <p className="text-sm font-semibold text-green-400">
                          Validation successful! Preview first 5 rows:
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                          <tr>
                            {previewData[0] && Object.keys(previewData[0]).map((key) => (
                              <th key={key} className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                          {previewData.slice(0, 5).map((row, index) => (
                            <tr key={index} className="hover:bg-white dark:hover:bg-white/5">
                              {Object.values(row).map((value: any, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Import Button */}
                    {!importing && importStatus !== 'importing' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={resetImport}
                          className="flex-1 px-6 py-3 bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleImport}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all font-semibold flex items-center justify-center space-x-2"
                        >
                          <Upload className="w-5 h-5" />
                          <span>Start Import</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Importing Progress */}
                {importStatus === 'importing' && (
                  <div className="space-y-4">
                    <div className="p-6 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm font-semibold text-blue-400 mb-2">Importing data...</p>
                      <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${importProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{importProgress}% complete</p>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {importStatus === 'success' && importResult && (
                  <div className="space-y-4">
                    <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Import Completed!</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Data has been successfully imported into the database
                      </p>
                    </div>

                    {/* Import Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Records</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{importResult.totalRecords}</p>
                      </div>
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Successful</p>
                        <p className="text-2xl font-bold text-green-400">{importResult.successfulImports}</p>
                      </div>
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Failed</p>
                        <p className="text-2xl font-bold text-red-400">{importResult.failedImports}</p>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                        <p className="text-2xl font-bold text-blue-400">{importResult.duration}</p>
                      </div>
                    </div>

                    <button
                      onClick={resetImport}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all font-semibold"
                    >
                      Import Another File
                    </button>
                  </div>
                )}
              </div>

              {/* Import History */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Import History
                  </h2>
                </div>
                <div className="space-y-3">
                  {importHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.status === 'success'
                            ? 'bg-green-500/20'
                            : 'bg-red-500/20'
                        }`}>
                          {item.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.fileName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.importedAt}
                          </p>
                          {item.error && (
                            <p className="text-xs text-red-400 mt-1">{item.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          item.status === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {item.status === 'success' ? `${item.recordsImported} records` : 'Failed'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.importedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
