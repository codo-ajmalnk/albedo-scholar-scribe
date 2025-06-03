
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, setIsAdmin } = useAdmin();
  const { toast } = useToast();

  const handleSignOut = async () => {
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
      
      // Force page reload to ensure clean state
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

  if (!user && !isAdmin) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
        <DropdownMenuItem disabled className="flex-col items-start">
          <span className="font-medium">
            {isAdmin ? '👑 Admin Access' : user?.email}
          </span>
          <span className="text-xs text-gray-500">
            {isAdmin ? 'Your Majesty' : 'Signed in'}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center w-full">
            <Settings className="w-4 h-4 mr-2" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
