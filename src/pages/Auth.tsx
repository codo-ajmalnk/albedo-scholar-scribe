
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { setIsAdmin, isAdmin } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated or admin (but only after auth loading is complete)
  useEffect(() => {
    if (!authLoading && (user || isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Show loading if auth is still initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="animate-pulse text-center">
          <svg
            className="w-10 h-10 text-primary mx-auto animate-spin"
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back! 🎉",
        description: "You have successfully signed in to Albedo AI.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      toast({
        title: "Account created! 🎊",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminPassword.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter the admin password.",
        variant: "destructive",
      });
      return;
    }

    setAdminLoading(true);
    
    try {
      if (adminPassword === 'codo1234') {
        setIsAdmin(true);
        setIsAdminDialogOpen(false);
        setAdminPassword('');
        
        toast({
          title: "👑 Royal Access Granted",
          description: "Welcome, Your Majesty! You now have administrative privileges in Albedo AI.",
          duration: 5000,
        });
        
        // Navigate to main page immediately
        navigate('/');
      } else {
        toast({
          title: "Access Denied ❌",
          description: "Incorrect admin password. Please verify your credentials.",
          variant: "destructive",
        });
        setAdminPassword('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during admin authentication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Albedo AI
          </CardTitle>
          <CardDescription className="text-lg">Your intelligent study companion</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-lg" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-lg" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Admin Access Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" size="lg">
                  <Settings className="h-4 w-4 mr-2" />
                  👑 Royal Admin Access
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">👑 Royal Admin Access</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    type="password"
                    placeholder="Enter the royal password..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !adminLoading && handleAdminLogin()}
                    disabled={adminLoading}
                    className="h-11"
                  />
                  <Button 
                    onClick={handleAdminLogin} 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                    disabled={adminLoading}
                  >
                    {adminLoading ? "Verifying..." : "👑 Enter as Admin"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
