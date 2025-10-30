'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Smartphone,
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="fixed w-full top-0 z-50 bg-white dark:bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Electrolux</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-gray-900 dark:text-white transition-colors">Features</a>
              <a href="#services" className="text-gray-300 hover:text-gray-900 dark:text-white transition-colors">Services</a>
              <a href="#about" className="text-gray-300 hover:text-gray-900 dark:text-white transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-gray-900 dark:text-white transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/track-application" className="px-6 py-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors border border-gray-300 dark:border-white/20 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                Track Application
              </Link>
              <Link href="/login" className="px-6 py-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Login
              </Link>
              <Link href="/apply-connection" className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300">
                Apply for Connection
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                <span className="text-sm text-gray-300">Powering 10,000+ Homes</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Smart Energy
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Distribution System
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Experience the future of electricity management with real-time monitoring, 
                intelligent distribution, and seamless billing solutions.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/apply-connection" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300">
                  <span className="font-semibold">Apply for New Connection</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center px-8 py-4 bg-gray-50 dark:bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300">
                  <span className="font-semibold">Watch Demo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50ms</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl"></div>
              <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                {/* Placeholder for electricity grid visualization */}
                <div className="aspect-square bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Zap className="w-24 h-24 text-yellow-400 mx-auto animate-pulse" />
                    <p className="text-white/60">Interactive Grid Visualization</p>
                    <p className="text-white/40 text-sm">Replace with your preferred image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage electricity distribution efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Real-Time Analytics",
                description: "Monitor consumption patterns and distribution metrics with live dashboards",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Infrastructure",
                description: "Enterprise-grade security with encrypted data transmission and storage",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Customer Management",
                description: "Comprehensive customer portal with self-service capabilities",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Automated Billing",
                description: "Streamlined billing process with automatic meter reading integration",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile Access",
                description: "Access your account and monitor usage from anywhere, anytime",
                color: "from-red-500 to-rose-500"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Usage Predictions",
                description: "AI-powered consumption forecasting and optimization recommendations",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${feature.color}"></div>
                <div className="relative bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">
                  Why Choose Electrolux?
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  We&apos;re revolutionizing electricity distribution with cutting-edge technology
                  and customer-centric solutions.
                </p>
                <div className="space-y-4">
                  {[
                    "Smart meter integration with real-time data",
                    "Automated fault detection and resolution",
                    "Transparent billing with detailed usage reports",
                    "24/7 customer support and emergency response",
                    "Eco-friendly energy management solutions"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "50K+", label: "Active Users" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "15min", label: "Avg Response" },
                  { value: "4.9/5", label: "User Rating" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-900 dark:text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust Electrolux for their electricity management needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply-connection" className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300">
                  <Zap className="w-5 h-5 mr-2" />
                  <span>Apply for New Connection</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/login" className="inline-flex items-center px-8 py-4 bg-white/90 text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Already a Customer? Login</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Electrolux</span>
            </div>
            <p className="text-gray-400">© 2025 Electrolux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

