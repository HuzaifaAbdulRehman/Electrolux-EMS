'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Zap,
  ArrowLeft,
  Shield,
  AlertCircle,
  CheckCircle,
  Send,
  KeyRound,
  RefreshCw
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleResend = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Resending email to:', email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4 flex items-center">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Info Section */}
          <div className="hidden lg:block space-y-4">
            <Link href="/login" className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Electrolux</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                Reset Your
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Password Securely
                </span>
              </h1>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Don&apos;t worry, it happens to the best of us. Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Security Measures</h3>
              {[
                {
                  icon: <Shield />,
                  text: "Secure password reset link valid for 1 hour"
                },
                {
                  icon: <Mail />,
                  text: "Verification sent to your registered email"
                },
                {
                  icon: <KeyRound />,
                  text: "Create a new strong password"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-50 dark:bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-yellow-400">
                    {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Help Section */}
            <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <h3 className="text-white font-semibold text-sm mb-2">Need Additional Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
                If you&apos;re still having trouble accessing your account, our support team is here to help.
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <span className="text-xs">📧 support@electrolux.com</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <span className="text-xs">📞 1-800-ELECTRO</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <span className="text-xs">💬 Live Chat Available 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Reset Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl"></div>
            <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              {!isSubmitted ? (
                <>
                  {/* Form Header */}
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <KeyRound className="w-8 h-8 text-gray-900 dark:text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Forgot Password?</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No worries, we&apos;ll send you reset instructions</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                          }}
                          className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
                          placeholder="john@example.com"
                          disabled={isLoading}
                        />
                        {email && validateEmail(email) && !error && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                        )}
                      </div>
                      {error && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {error}
                        </p>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-white/10">
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                      </p>
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
                          <span className="text-sm">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span className="text-sm">Send Reset Link</span>
                        </>
                      )}
                    </button>

                    {/* Alternative Options */}
                    <div className="flex items-center justify-center space-x-3 pt-2">
                      <Link href="/login" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Remember your password?
                      </Link>
                      <span className="text-gray-600">•</span>
                      <Link href="/register" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Create new account
                      </Link>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* Success Message */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      We&apos;ve sent a password reset link to:
                    </p>
                    <div className="bg-gray-50 dark:bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-gray-300 dark:border-white/20 mb-4">
                      <p className="text-white font-semibold text-sm">{email}</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Click the link in the email to reset your password. The link will expire in 1 hour for security reasons.
                      </p>

                      <div className="bg-white dark:bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-white/10">
                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Didn&apos;t receive the email?</p>
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          <p>• Check your spam or junk folder</p>
                          <p>• Make sure {email} is correct</p>
                          <p>• Wait a few minutes and try again</p>
                        </div>
                      </div>

                      <button
                        onClick={handleResend}
                        disabled={isLoading}
                        className={`w-full py-2.5 bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-lg text-white transition-all duration-300 ${
                          isLoading
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:bg-gray-200 dark:hover:bg-white/20'
                        } flex items-center justify-center space-x-2`}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs">Resending...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-xs">Resend Email</span>
                          </>
                        )}
                      </button>

                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center w-full py-2.5 text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="text-xs">Back to Login</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
