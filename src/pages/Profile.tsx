
import ProfileSettings from '@/components/ProfileSettings';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  if (!user && !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Glacial water-like animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-purple-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/30 via-transparent to-purple-200/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-cyan-200/20 via-transparent to-blue-200/20 animate-slow-spin"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-300/10 via-cyan-300/10 to-purple-300/10 animate-wave"></div>
      </div>
      
      {/* Floating ice-like particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-200/40 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-cyan-200/40 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-purple-200/40 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-300/40 rounded-full animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-700 hover:text-blue-900 bg-white/70 hover:bg-white/90 backdrop-blur-sm border-2 border-blue-300/50 hover:border-blue-400 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chat</span>
          </Button>
        </div>
        <ProfileSettings />
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wave {
          0%, 100% { transform: translateX(-100px) translateY(-50px); }
          50% { transform: translateX(100px) translateY(50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        .animate-wave {
          animation: wave 15s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
