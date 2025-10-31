'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Upload,
  Download,
  Users,
  FileText,
  DollarSign,
  Zap,
  Gauge,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  FileCheck,
  TrendingUp,
  Info,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface DataType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  requiredFields: string[];
  sampleCount: string;
}

interface ImportHistory {
  id: number;
  dataType: string;
  fileName: string;
  recordsImported: number;
  status: 'success' | 'failed' | 'partial';
  timestamp: string;
  errors?: number;
}

export default function DataImport() {
  const [selectedDataType, setSelectedDataType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    previewData: any[];
  } | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importComplete, setImportComplete] = useState(false);
  
  // New features for enhanced functionality
  const [demoMode, setDemoMode] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'json'>('csv');
  const [sampleCount, setSampleCount] = useState(10);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'creating' | 'created' | 'error'>('idle');

  // Define data types with their configurations
  const dataTypes: DataType[] = [
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
      description: 'Import customer profiles and connection details',
      requiredFields: ['user_id', 'meter_number', 'address', 'connection_type', 'tariff_id'],
      sampleCount: '50 customer profiles'
    },
    {
      id: 'meter_readings',
      name: 'Meter Readings',
      icon: Gauge,
      color: 'from-purple-500 to-pink-500',
      description: 'Import historical meter readings',
      requiredFields: ['customer_id', 'reading_date', 'current_reading', 'previous_reading'],
      sampleCount: '300 readings (6 months)'
    },
    {
      id: 'bills',
      name: 'Bills',
      icon: FileText,
      color: 'from-yellow-400 to-orange-500',
      description: 'Import billing records and invoices',
      requiredFields: ['customer_id', 'billing_month', 'units_consumed', 'total_amount', 'due_date'],
      sampleCount: '300 bills (6 months)'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: DollarSign,
      color: 'from-red-500 to-pink-500',
      description: 'Import payment transactions',
      requiredFields: ['bill_id', 'payment_date', 'amount', 'payment_method', 'transaction_id'],
      sampleCount: '250+ payment records'
    },
    {
      id: 'tariffs',
      name: 'Tariffs',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500',
      description: 'Import tariff rates and slab structures',
      requiredFields: ['tariff_name', 'connection_type', 'slab_from', 'slab_to', 'rate_per_unit'],
      sampleCount: 'Multiple tariff structures'
    }
  ];

  // Mock import history
  const importHistory: ImportHistory[] = [
    {
      id: 1,
      dataType: 'Users',
      fileName: 'users_bulk_import.csv',
      recordsImported: 72,
      status: 'success',
      timestamp: '2024-10-10 14:30:00'
    },
    {
      id: 2,
      dataType: 'Customers',
      fileName: 'customer_profiles.csv',
      recordsImported: 50,
      status: 'success',
      timestamp: '2024-10-10 14:35:00'
    },
    {
      id: 3,
      dataType: 'Meter Readings',
      fileName: 'meter_readings_q2.csv',
      recordsImported: 285,
      status: 'partial',
      timestamp: '2024-10-10 14:40:00',
      errors: 15
    }
  ];

  const handleDataTypeSelect = (typeId: string) => {
    setSelectedDataType(typeId);
    setSelectedFile(null);
    setValidationResult(null);
    setImportComplete(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setValidationResult(null);
        setImportComplete(false);
      } else {
        alert('Please select a CSV file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setValidationResult(null);
        setImportComplete(false);
      } else {
        alert('Please select a CSV file');
      }
    }
  };

  const handleValidateFile = () => {
    if (!selectedFile) return;

    setIsValidating(true);

    // Simulate validation process
    setTimeout(() => {
      // Mock validation result
      setValidationResult({
        isValid: true,
        errors: [],
        warnings: [
          'Row 15: Phone number format inconsistent (will be normalized)',
          'Row 42: Missing optional field "alternate_phone"'
        ],
        previewData: [
          { email: 'john.doe@example.com', full_name: 'John Doe', user_type: 'customer', phone: '9876543210' },
          { email: 'jane.smith@example.com', full_name: 'Jane Smith', user_type: 'customer', phone: '9876543211' },
          { email: 'bob.wilson@example.com', full_name: 'Bob Wilson', user_type: 'employee', phone: '9876543212' },
          { email: 'alice.brown@example.com', full_name: 'Alice Brown', user_type: 'customer', phone: '9876543213' },
          { email: 'charlie.davis@example.com', full_name: 'Charlie Davis', user_type: 'admin', phone: '9876543214' }
        ]
      });
      setIsValidating(false);
    }, 2000);
  };

  const handleImportData = () => {
    if (!validationResult?.isValid) return;

    setIsImporting(true);
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          setImportComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownloadTemplate = (dataType: DataType) => {
    // In production, this would download actual CSV template
    alert(`Downloading ${dataType.name} template with fields: ${dataType.requiredFields.join(', ')}`);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setImportComplete(false);
    setImportProgress(0);
  };

  // Enhanced functionality handlers
  const handleExport = async (dataType: string) => {
    try {
      setIsExporting(true);
      console.log(`[Data Import] Exporting ${dataType} as ${exportType}`);
      
      const response = await fetch(`/api/admin/data-export?type=${dataType}&format=${exportType}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_export.${exportType}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log(`[Data Import] Export completed: ${dataType}`);
    } catch (error) {
      console.error('[Data Import] Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      setBackupStatus('creating');
      console.log('[Data Import] Creating database backup...');
      
      const response = await fetch('/api/admin/database-backup', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Backup failed');
      }
      
      const result = await response.json();
      setBackupStatus('created');
      console.log('[Data Import] Backup created successfully');
      
      // Auto-download backup file
      const blob = new Blob([JSON.stringify(result.data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('[Data Import] Backup error:', error);
      setBackupStatus('error');
      alert('Backup failed. Please try again.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleGenerateSample = async () => {
    try {
      setIsGeneratingSample(true);
      console.log(`[Data Import] Generating ${sampleCount} sample records...`);
      
      const response = await fetch('/api/admin/generate-sample-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: sampleCount,
          dataType: selectedDataType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Sample generation failed');
      }
      
      const result = await response.json();
      console.log(`[Data Import] Generated ${result.count} sample records`);
      alert(`Successfully generated ${result.count} sample records!`);
      
    } catch (error) {
      console.error('[Data Import] Sample generation error:', error);
      alert('Sample generation failed. Please try again.');
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'partial': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <DashboardLayout userType="admin" userName="Admin">
      <div className="max-w-[1920px] mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Data Import Center</h1>
              <p className="text-gray-600 dark:text-gray-400">Bulk import customer data, bills, payments, and more</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Database className="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        {/* Data Type Selection */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Select Data Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataTypes.map((dataType) => {
              const Icon = dataType.icon;
              const isSelected = selectedDataType === dataType.id;
              return (
                <div
                  key={dataType.id}
                  onClick={() => handleDataTypeSelect(dataType.id)}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-200 dark:border-white/10 hover:border-yellow-400/50 hover:bg-white/5'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                  )}
                  <div className={`w-12 h-12 bg-gradient-to-br ${dataType.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{dataType.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{dataType.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">{dataType.sampleCount}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadTemplate(dataType);
                      }}
                      className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Template</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Enhanced Data Management</h2>
          
          {/* Demo Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Demo Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {demoMode ? 'Validation only - no actual import' : 'Live mode - will import data'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  demoMode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {demoMode ? 'Demo Mode' : 'Live Mode'}
              </button>
            </div>
          </div>

          {/* Export Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Current Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${dataType.color} rounded-lg flex items-center justify-center`}>
                      <dataType.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{dataType.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Export as CSV or JSON</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleExport(dataType.id)}
                    disabled={isExporting}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Export</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Backup Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Backup</h3>
            <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Create Full Backup</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Export entire database as JSON</p>
                </div>
              </div>
              <button
                onClick={handleBackup}
                disabled={isBackingUp}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isBackingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                <span>
                  {backupStatus === 'created' ? 'Backup Created' : 
                   backupStatus === 'creating' ? 'Creating...' : 
                   backupStatus === 'error' ? 'Retry' : 'Backup'}
                </span>
              </button>
            </div>
          </div>

          {/* Sample Data Generation */}
          {selectedDataType && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generate Sample Data</h3>
              <div className="flex items-center space-x-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of records to generate
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={sampleCount}
                    onChange={(e) => setSampleCount(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleGenerateSample}
                  disabled={isGeneratingSample}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGeneratingSample ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>Generate</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        {selectedDataType && (
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Upload CSV File</h2>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-gray-300 dark:border-white/20 hover:border-yellow-400/50'
                }`}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isDragging ? 'Drop your file here' : 'Drag & drop your CSV file here'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">or click to browse</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Required fields: {dataTypes.find(dt => dt.id === selectedDataType)?.requiredFields.join(', ')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Validation Button */}
                {!validationResult && (
                  <button
                    onClick={handleValidateFile}
                    disabled={isValidating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidating ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Validating File...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-5 h-5" />
                        <span>Validate File</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Validation Results */}
        {validationResult && !importComplete && (
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Validation Results</h2>

            {/* Status */}
            <div className={`p-4 rounded-xl mb-4 ${
              validationResult.isValid
                ? 'bg-green-500/10 border border-green-500/50'
                : 'bg-red-500/10 border border-red-500/50'
            }`}>
              <div className="flex items-center space-x-3">
                {validationResult.isValid ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-semibold text-green-400">Validation Passed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">File is ready for import</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="font-semibold text-red-400">Validation Failed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Please fix errors before importing</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                <h3 className="font-semibold text-red-400 mb-2 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Errors ({validationResult.errors.length})</span>
                </h3>
                <ul className="space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {validationResult.warnings.length > 0 && (
              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl">
                <h3 className="font-semibold text-yellow-400 mb-2 flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Warnings ({validationResult.warnings.length})</span>
                </h3>
                <ul className="space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview Data */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Preview (First 5 rows)</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                    <tr>
                      {Object.keys(validationResult.previewData[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {validationResult.previewData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Import Button */}
            {validationResult.isValid && (
              <div>
                {isImporting ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Importing data...</span>
                      <span className="font-semibold">{importProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleImportData}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Import Data to Database</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Import Complete */}
        {importComplete && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-8 border border-green-500/50 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Import Successful!</h2>
            <p className="text-gray-300 mb-6">
              All records have been successfully imported to the database
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all font-semibold"
              >
                Import Another File
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Import History */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Import History</h2>
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>

          <div className="space-y-3">
            {importHistory.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{record.dataType}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.fileName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {record.recordsImported} records
                    {record.errors && <span className="text-yellow-400"> ({record.errors} warnings)</span>}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{record.timestamp}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

