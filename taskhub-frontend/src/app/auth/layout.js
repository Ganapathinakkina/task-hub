import { Suspense } from 'react';

export default function AuthLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading auth page...</div>}>
      {children}
    </Suspense>
  );
}
