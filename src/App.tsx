
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/hooks/useAuth';
import { AdminProvider } from '@/components/AdminProvider';
import AuthProtected from '@/components/AuthProtected';
import { Toaster } from '@/components/ui/toaster';
import Profile from '@/pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={
              <AuthProtected>
                <Profile />
              </AuthProtected>
            } />
            <Route path="/" element={
              <AuthProtected>
                <Index />
              </AuthProtected>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
