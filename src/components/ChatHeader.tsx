
import React from 'react';
import AlbedoAvatar from '@/components/AlbedoAvatar';
import UserMenu from '@/components/UserMenu';
import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  messageCount: number;
}

const ChatHeader = ({ messageCount }: ChatHeaderProps) => {
  const { signOut } = useAuth();
  const { isAdmin, setIsAdmin } = useAdmin();
  const { toast } = useToast();

  const handleQuickSignOut = async () => {
    try {
      await signOut();
      
      // Clear admin state if it was set
      if (isAdmin) {
        setIsAdmin(false);
      }
      
      toast({
        title: "Signed out successfully! 👋",
        description: "You have been logged out. See you next time!",
      });
      window.location.href = '/auth';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <AlbedoAvatar size="sm" />
        <div>
          <h1 className="font-semibold text-lg text-gray-900">
            {isAdmin ? '👑 Albedo AI - Admin Mode' : 'Albedo AI'}
          </h1>
          <p className="text-sm text-gray-600">
            {isAdmin 
              ? 'Your Majesty, how may I serve you today?' 
              : messageCount > 0 
                ? `${messageCount} messages in this conversation` 
                : 'Ready to help you learn and research'
            }
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/profile"
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </Link>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleQuickSignOut}
          className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default ChatHeader;
