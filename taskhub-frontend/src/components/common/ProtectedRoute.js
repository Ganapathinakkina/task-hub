'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/auth?view=login');
    }
  }, [user, router]);

  if (!user) return null;

  return children;
}
