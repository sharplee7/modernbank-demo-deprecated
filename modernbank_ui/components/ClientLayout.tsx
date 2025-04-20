"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/store/store';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAuthState = () => {
      try {
        const storedState = localStorage.getItem('authState');
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          if (parsedState.user && parsedState.isAuthenticated) {
            dispatch(setUser(parsedState.user));
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthState();
  }, [dispatch]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated && !pathname.startsWith('/sign')) {
      router.push('/signin');
    }
  }, [isChecking, isAuthenticated, pathname, router]);

  if (!mounted || isChecking) {
    return null;
  }

  return <>{children}</>;
} 