
import ProfileSettings from '@/components/ProfileSettings';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  if (!user && !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <ProfileSettings />
    </div>
  );
};

export default Profile;
