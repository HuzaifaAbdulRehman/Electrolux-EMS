'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Zap,
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Activity
} from 'lucide-react';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Login attempted:', formData);
        setIsLoading(false);
        // Add your actual API call here
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4 flex items-center">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Welcome Back Section */}
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
                Welcome Back to
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Your Energy Portal
                </span>
              </h1>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Access your electricity account to monitor usage, view bills, and manage your energy consumption efficiently.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              {[
                {
                  icon: <Activity />,
                  title: "Real-time Monitoring",
                  desc: "Track your electricity usage live"
                },
                {
                  icon: <Shield />,
                  title: "Secure Access",
                  desc: "Your data is protected with encryption"
                },
                {
                  icon: <Clock />,
                  title: "Quick Actions",
                  desc: "Pay bills and manage services instantly"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-yellow-400 flex-shrink-0">
                    {React.cloneElement(feature.icon, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* System Status */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-2xl"></div>
              <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">System Status</span>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-green-400 text-xs">All Systems Operational</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">99.9%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">50ms</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">24/7</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl"></div>
            <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Sign In</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enter your credentials to access your account</p>
              </div>

              {/* Quick Login Options */}
              <div className="flex items-center justify-center space-x-3 mb-4">
                <button className="flex-1 py-2.5 px-3 bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-xs">Google</span>
                </button>
                <button className="flex-1 py-2.5 px-3 bg-gray-50 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-xs">GitHub</span>
                </button>
              </div>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300 dark:border-white/20"></div>
                <span className="px-3 text-gray-600 dark:text-gray-400 text-xs">or continue with email</span>
                <div className="flex-1 border-t border-gray-300 dark:border-white/20"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Field */}
                <div>
                  <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="john@example.com"
                      disabled={isLoading}
                    />
                    {formData.email && !errors.email && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      disabled={isLoading}
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-4 h-4 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0"
                      disabled={isLoading}
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg transition-all duration-300 transform ${
                    isLoading
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:shadow-lg hover:shadow-orange-500/50 hover:scale-[1.01]'
                  } flex items-center justify-center space-x-2`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Additional Options */}
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Don&apos;t have an account?{' '}
                      <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                        Create Account
                      </Link>
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-3">
                    <Link href="/help" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Need Help?
                    </Link>
                    <span className="text-gray-600">•</span>
                    <Link href="/contact" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Contact Support
                    </Link>
                  </div>
                </div>
              </form>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-700 dark:text-gray-300">Secure Connection</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      Your login information is encrypted and protected with industry-standard security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
