'use client';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div>
      <h1>Authentication Failed</h1>
      <p>Error: {error}</p>
      <p>Please try again or contact the administrator.</p>
    </div>
  );
}
