'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { Zap, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function ToastTestButton() {
  const testSuccess = () => {
    toast.success('Test success notification!', {
      duration: 4000,
    });
  };

  const testError = () => {
    toast.error('Test error notification!', {
      duration: 4000,
    });
  };

  const testLoading = () => {
    const loadingToast = toast.loading('Processing...', {
      duration: 2000,
    });
    
    setTimeout(() => {
      toast.success('Processing complete!', {
        id: loadingToast,
      });
    }, 2000);
  };

  const testCustom = () => {
    toast.custom((t) => (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
        <Zap className="w-5 h-5" />
        <span>Custom notification with gradient!</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-4 text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    ), {
      duration: 5000,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Toast Test</h3>
        <div className="space-y-2">
          <button
            onClick={testSuccess}
            className="w-full px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <CheckCircle className="w-3 h-3" />
            <span>Success</span>
          </button>
          <button
            onClick={testError}
            className="w-full px-3 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <AlertCircle className="w-3 h-3" />
            <span>Error</span>
          </button>
          <button
            onClick={testLoading}
            className="w-full px-3 py-2 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors flex items-center space-x-2"
          >
            <Loader2 className="w-3 h-3" />
            <span>Loading</span>
          </button>
          <button
            onClick={testCustom}
            className="w-full px-3 py-2 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors flex items-center space-x-2"
          >
            <Zap className="w-3 h-3" />
            <span>Custom</span>
          </button>
        </div>
      </div>
    </div>
  );
}
