
import React, { createContext, useContext } from 'react';
import { useAdminState } from '@/hooks/useAdmin';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const adminState = useAdminState();
  
  return (
    <AdminContext.Provider value={adminState}>
      {children}
    </AdminContext.Provider>
  );
};
