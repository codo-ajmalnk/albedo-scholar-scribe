
import { useState, useEffect, useContext } from 'react';
import { AdminContext } from '@/components/AdminProvider';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const useAdminState = () => {
  const [isAdmin, setIsAdminState] = useState(() => {
    // Initialize from localStorage
    const savedAdminState = localStorage.getItem('albedo-admin-state');
    return savedAdminState === 'true';
  });

  const setIsAdmin = (value: boolean) => {
    setIsAdminState(value);
    // Persist to localStorage
    localStorage.setItem('albedo-admin-state', value.toString());
  };

  useEffect(() => {
    // Listen for storage changes (in case admin state is changed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'albedo-admin-state') {
        setIsAdminState(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { isAdmin, setIsAdmin };
};
