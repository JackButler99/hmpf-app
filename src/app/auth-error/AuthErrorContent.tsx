'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
      <p className="text-red-600">Error: {error}</p>
      <p className="mt-4">Please try again or contact the administrator.</p>
    </div>
  );
}
