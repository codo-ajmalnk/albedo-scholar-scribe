
import { useState, createContext, useContext } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const useAdminState = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  return { isAdmin, setIsAdmin };
};
