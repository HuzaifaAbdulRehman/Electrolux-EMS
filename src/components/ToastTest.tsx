'use client';

import React from 'react';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';

export default function ToastTest() {
  const toast = useToast();

  const testSuccess = () => {
    toast.success('This is a success message!');
  };

  const testError = () => {
    toast.error('This is an error message!');
  };

  const testInfo = () => {
    toast.info('This is an info message!');
  };

  const testWarning = () => {
    toast.warning('This is a warning message!');
  };

  const testLoading = () => {
    const loadingToast = toast.loading('Loading...');
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success('Loading complete!');
    }, 2000);
  };

  const testPromise = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Failed!');
      }, 2000);
    });

    toast.promise(promise, {
      loading: 'Processing...',
      success: 'Operation completed successfully!',
      error: 'Operation failed!',
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Toast Notification Test</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button onClick={testSuccess} className="bg-green-600 hover:bg-green-700">
          Test Success
        </Button>
        <Button onClick={testError} className="bg-red-600 hover:bg-red-700">
          Test Error
        </Button>
        <Button onClick={testInfo} className="bg-blue-600 hover:bg-blue-700">
          Test Info
        </Button>
        <Button onClick={testWarning} className="bg-yellow-600 hover:bg-yellow-700">
          Test Warning
        </Button>
        <Button onClick={testLoading} className="bg-purple-600 hover:bg-purple-700">
          Test Loading
        </Button>
        <Button onClick={testPromise} className="bg-indigo-600 hover:bg-indigo-700">
          Test Promise
        </Button>
      </div>
    </div>
  );
}

