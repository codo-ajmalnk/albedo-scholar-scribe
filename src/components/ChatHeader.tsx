
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import UserMenu from './UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

interface ChatHeaderProps {
  messageCount: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ messageCount }) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { isAdmin, setIsAdmin } = useAdmin();
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAdminLogin = () => {
    if (password === 'codo1234') {
      setIsAdmin(true);
      setIsDialogOpen(false);
      toast({
        title: "Admin Access Granted",
        description: "Welcome, Admin! You now have admin privileges.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
    setPassword('');
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {!isMobile && (
          <div className="flex-1">
            <h1 className="font-semibold text-lg text-gray-800 ml-2">Albedo AI</h1>
          </div>
        )}
        
        <div className="flex-1 flex justify-center">
          {messageCount > 0 && (
            <span className="text-sm text-gray-500">
              {messageCount} message{messageCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-2">
          {!isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admin Access</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                  <Button onClick={handleAdminLogin} className="w-full">
                    Login as Admin
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">Admin</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAdmin(false)}
              >
                Logout Admin
              </Button>
            </div>
          )}
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
