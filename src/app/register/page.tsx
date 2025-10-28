'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to apply-connection page
    router.replace('/apply-connection');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Redirecting to connection application...</p>
      </div>
    </div>
  );
}
