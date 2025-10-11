'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Zap,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Info,
  Building,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Save,
  Send
} from 'lucide-react';

export default function NewConnection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    applicantName: '',
    fatherName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    idType: '',
    idNumber: '',

    // Property Details
    propertyType: '',
    connectionType: '',
    loadRequired: '',
    propertyAddress: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',

    // Connection Details
    preferredDate: '',
    purposeOfConnection: '',
    existingConnection: false,
    existingAccountNumber: '',

    // Documents
    identityProof: null,
    addressProof: null,
    propertyProof: null,

    // Agreement
    termsAccepted: false,
    declarationAccepted: false
  });

  const totalSteps = 4;

  const propertyTypes = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'agricultural', label: 'Agricultural' }
  ];

  const connectionTypes = [
    { value: 'single-phase', label: 'Single Phase', load: 'Up to 5 KW' },
    { value: 'three-phase', label: 'Three Phase', load: '5 KW to 50 KW' },
    { value: 'industrial', label: 'Industrial Connection', load: 'Above 50 KW' }
  ];

  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'drivers-license', label: "Driver's License" },
    { value: 'national-id', label: 'National ID Card' },
    { value: 'voter-id', label: 'Voter ID' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (field: string, file: any) => {
    setFormData({ ...formData, [field]: file });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting application:', formData);
    // Handle form submission
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.applicantName && formData.email && formData.phone && formData.idType && formData.idNumber;
      case 2:
        return formData.propertyType && formData.connectionType && formData.propertyAddress && formData.city;
      case 3:
        return formData.preferredDate && formData.purposeOfConnection;
      case 4:
        return formData.termsAccepted && formData.declarationAccepted;
      default:
        return false;
    }
  };

  return (
    <DashboardLayout userType="customer" userName="Huzaifa">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">New Connection Application</h1>
              <p className="text-gray-600 dark:text-gray-400">Apply for a new electricity connection in just a few steps</p>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep === step
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-110'
                        : currentStep > step
                        ? 'bg-green-500 text-gray-900 dark:text-white'
                        : 'bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {step === 1 && 'Personal Info'}
                    {step === 2 && 'Property Details'}
                    {step === 3 && 'Connection Info'}
                    {step === 4 && 'Review & Submit'}
                  </p>
                </div>
                {index < 3 && (
                  <div className="flex-1 h-1 mx-2">
                    <div
                      className={`h-full rounded transition-all ${
                        currentStep > step ? 'bg-green-500' : 'bg-white/10'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => handleInputChange('applicantName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Father's/Spouse Name</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter father's or spouse name"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Alternate Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <input
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    ID Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.idType}
                    onChange={(e) => handleInputChange('idType', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors font-medium"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Select ID Type</option>
                    {idTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    ID Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter ID number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Home className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Property & Connection Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Property Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors font-medium"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Select Property Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Connection Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => handleInputChange('connectionType', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors font-medium"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Select Connection Type</option>
                    {connectionTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">
                        {type.label} ({type.load})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Property Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <textarea
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      rows={3}
                      placeholder="Enter complete property address"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="000000"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Nearby landmark"
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-300 text-sm font-semibold mb-1">Estimated Connection Charges</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Single Phase: $150 | Three Phase: $350 | Industrial: Custom Quote
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Connection Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Additional Information & Documents</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Preferred Connection Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                    Purpose of Connection <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.purposeOfConnection}
                    onChange={(e) => handleInputChange('purposeOfConnection', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors font-medium"
                  >
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Select Purpose</option>
                    <option value="domestic" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Domestic Use</option>
                    <option value="business" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Business Use</option>
                    <option value="industrial" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Industrial Use</option>
                    <option value="agricultural" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2">Agricultural Use</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.existingConnection}
                      onChange={(e) => handleInputChange('existingConnection', e.target.checked)}
                      className="w-5 h-5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-blue-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">I have an existing connection with Electrolux</span>
                  </label>
                </div>

                {formData.existingConnection && (
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Existing Account Number</label>
                    <input
                      type="text"
                      value={formData.existingAccountNumber}
                      onChange={(e) => handleInputChange('existingAccountNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="ACC-XXXXX"
                    />
                  </div>
                )}
              </div>

              {/* Document Upload Section */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Required Documents</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Identity Proof</span>
                      <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('identityProof', e.target.files?.[0])}
                      className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-gray-900 dark:text-white hover:file:bg-blue-600 file:cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG or PNG (Max 5MB)</p>
                  </div>

                  <div className="bg-white dark:bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Address Proof</span>
                      <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('addressProof', e.target.files?.[0])}
                      className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-gray-900 dark:text-white hover:file:bg-blue-600 file:cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG or PNG (Max 5MB)</p>
                  </div>

                  <div className="bg-white dark:bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Property Proof</span>
                      <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('propertyProof', e.target.files?.[0])}
                      className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-gray-900 dark:text-white hover:file:bg-blue-600 file:cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG or PNG (Max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review & Submit Application</h2>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.applicantName || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.email || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">ID Type:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.idType || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Property Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Property Type:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.propertyType || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Connection Type:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.connectionType || 'Not provided'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Address:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.propertyAddress || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Connection Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Preferred Date:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.preferredDate || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Purpose:</span>
                      <span className="text-gray-900 dark:text-white ml-2">{formData.purposeOfConnection || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Terms & Conditions</h3>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-blue-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    I agree to the terms and conditions of Electrolux Distribution Co. and understand that providing false information may result in application rejection.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declarationAccepted}
                    onChange={(e) => handleInputChange('declarationAccepted', e.target.checked)}
                    className="w-5 h-5 mt-0.5 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-300 dark:border-white/20 rounded text-blue-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    I declare that all the information provided above is true and correct to the best of my knowledge.
                  </span>
                </label>
              </div>

              {/* Application Fee Notice */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 font-semibold mb-1">Application Fee</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      A non-refundable application processing fee of $25 will be charged. Connection charges will be communicated after site inspection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
                currentStep === 1
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-200 dark:hover:bg-white/20'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              <button className="px-6 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-white/10 text-white rounded-lg hover:bg-gray-100 dark:bg-gray-100 dark:bg-white/20 transition-all font-semibold flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Save Draft</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepComplete(currentStep)}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
                    isStepComplete(currentStep)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepComplete(currentStep)}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
                    isStepComplete(currentStep)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50'
                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Application</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-blue-400 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                If you have any questions or need assistance with your application, please contact our customer support team.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+15551234567" className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </a>
                <a href="mailto:newconnection@electrolux.com" className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>newconnection@electrolux.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
