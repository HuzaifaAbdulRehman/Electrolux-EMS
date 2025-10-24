'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Gauge,
  Check,
  Zap,
  ArrowLeft,
  Shield,
  AlertCircle
} from 'lucide-react';

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  fullAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  meterNumber?: string;
  termsAccepted?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    fullAddress: '',
    city: '',
    state: '',
    pincode: '',
    meterNumber: '',
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return '';
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Full Name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone Number validation (Pakistani format: 11 digits starting with 0)
    const phoneRegex = /^0\d{10}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 11 digits (e.g., 03001234567)';
    }
    
    // Address validation
    if (!formData.fullAddress) {
      newErrors.fullAddress = 'Full address is required';
    }

    // City validation
    if (!formData.city) {
      newErrors.city = 'City is required';
    } else if (formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    // State validation
    if (!formData.state) {
      newErrors.state = 'State is required';
    } else if (formData.state.length < 2) {
      newErrors.state = 'State must be at least 2 characters';
    }

    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    // Meter Number validation (Format: MTR-XXX-XXXXXX)
    const meterRegex = /^MTR-[A-Z]{3}-\d{6}$/;
    if (!formData.meterNumber) {
      newErrors.meterNumber = 'Meter number is required';
    } else if (!meterRegex.test(formData.meterNumber)) {
      newErrors.meterNumber = 'Meter number must be in format MTR-XXX-XXXXXX (e.g., MTR-KHI-000001)';
    }

    // Terms validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullName: formData.fullName,
          phone: formData.phoneNumber.replace(/\D/g, '').substring(1), // Remove leading 0, send 10 digits
          address: formData.fullAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          meterNumber: formData.meterNumber.toUpperCase(), // Ensure uppercase
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMessage('Registration successful! Redirecting to email verification...');

      // Redirect to verification page with email and code
      setTimeout(() => {
        const params = new URLSearchParams({
          email: formData.email,
          code: data.verificationCode || '', // For development mode
        });
        window.location.href = `/verify-email?${params.toString()}`;
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4 flex items-center">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Info Section */}
          <div className="hidden lg:block space-y-4">
            <Link href="/" className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Electrolux</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                Join the Future of
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Energy Management
                </span>
              </h1>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Create your account and experience seamless electricity distribution management with real-time monitoring and smart billing.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Why Register?</h3>
              <div className="space-y-2">
                {[
                  { icon: <Shield />, text: "Secure account with encrypted data" },
                  { icon: <Gauge />, text: "Real-time consumption monitoring" },
                  { icon: <Phone />, text: "24/7 customer support access" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-50 dark:bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-yellow-400">
                      {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">4.9/5</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl"></div>
            <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fill in your details to get started</p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center">
                  <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Two Column Grid for Name and Email */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="Huzaifa Abdul Rehman"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="huzaifa@test.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Two Column Grid for Password and Confirm Password */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-green-400 text-xs mt-1 flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{getPasswordStrengthText()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-50 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Two Column Grid for Phone and Meter Number */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Phone Number */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="03001234567"
                        maxLength={11}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Meter Number */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Meter Number *</label>
                    <div className="relative">
                      <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type="text"
                        value={formData.meterNumber}
                        onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value.toUpperCase() })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="MTR-KHI-000001"
                        maxLength={14}
                      />
                    </div>
                    {errors.meterNumber && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.meterNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Full Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <textarea
                      value={formData.fullAddress}
                      onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                      placeholder="House 123, Street 5, Gulshan-e-Iqbal"
                      rows={2}
                    />
                  </div>
                  {errors.fullAddress && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.fullAddress}
                    </p>
                  )}
                </div>

                {/* City, State, Pincode Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* City */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Karachi"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Sindh"
                    />
                    {errors.state && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.state}
                      </p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Pincode *</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="75300"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="mt-0.5 w-4 h-4 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link href="/terms" className="text-yellow-400 hover:text-yellow-300 underline">
                        Terms & Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}