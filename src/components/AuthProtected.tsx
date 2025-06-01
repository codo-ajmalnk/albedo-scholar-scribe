
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

const AuthProtected = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we're still loading or user is authenticated or admin, allow access
    if (loading) return;
    
    // Allow access if user is authenticated OR if user is admin
    if (user || isAdmin) return;
    
    // Only redirect if no user and not admin
    navigate('/auth', { state: { returnUrl: location.pathname } });
  }, [user, loading, isAdmin, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="animate-pulse">
          <svg
            className="w-10 h-10 text-primary mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access if user is authenticated OR if user is admin
  if (user || isAdmin) {
    return <>{children}</>;
  }

  // If we reach here, user will be redirected
  return null;
};

export default AuthProtected;
