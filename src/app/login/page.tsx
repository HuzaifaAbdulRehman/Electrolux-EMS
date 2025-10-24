'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
      } else if (result?.ok) {
        // Fetch session to get user type
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (session?.user?.userType) {
          // Redirect based on user type
          switch (session.user.userType) {
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'employee':
              router.push('/employee/dashboard');
              break;
            case 'customer':
              router.push('/customer/dashboard');
              break;
            default:
              router.push('/');
          }
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Quick login for demo
  const quickLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setIsLoading(false);
      } else if (result?.ok) {
        // Fetch session to get user type
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (session?.user?.userType) {
          switch (session.user.userType) {
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'employee':
              router.push('/employee/dashboard');
              break;
            case 'customer':
              router.push('/customer/dashboard');
              break;
            default:
              router.push('/');
          }
        }
      }
    } catch (error) {
      console.error('Quick login error:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full mb-4">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ElectroLux EMS</h1>
            <p className="text-white/90 mt-2">Electricity Management System</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
                Demo Accounts (Password: password123)
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('admin@electrolux.com', 'password123')}
                  disabled={isLoading}
                  className="w-full py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Login as Admin
                </button>
                <button
                  onClick={() => quickLogin('employee1@electrolux.com', 'password123')}
                  disabled={isLoading}
                  className="w-full py-2 px-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Login as Employee
                </button>
                <button
                  onClick={() => quickLogin('customer1@example.com', 'password123')}
                  disabled={isLoading}
                  className="w-full py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Login as Customer
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="text-orange-500 hover:text-orange-600 font-medium">
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 ElectroLux EMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}