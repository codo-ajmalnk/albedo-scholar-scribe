
import React from 'react';
import { AdminContext } from '@/hooks/useAdmin';
import { useAdminState } from '@/hooks/useAdmin';

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const adminState = useAdminState();
  
  return (
    <AdminContext.Provider value={adminState}>
      {children}
    </AdminContext.Provider>
  );
};
