
import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, CreditCard, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreditCards from './CreditCards';
import UsageIndicator from './UsageIndicator';
import SecuritySettings from './SecuritySettings';
import ActivityPage from './ActivityPage';
import AlbedoAvatar from './AlbedoAvatar';
import { TextInputWithLength, TextareaWithLength } from './TextInputWithLength';

const ProfileSettings = () => {
  const { profile, subscription, loading, updateProfile } = useUserProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    albedo_name: 'Albedo',
    phone_number: '',
    date_of_birth: '',
    gender: '' as 'male' | 'female' | 'other' | 'prefer_not_to_say' | '',
    location: '',
    bio: '',
  });
  const [previousGender, setPreviousGender] = useState<string>('');
  const [previousAlbedoName, setPreviousAlbedoName] = useState<string>('Albedo');

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        username: profile.username || '',
        albedo_name: profile.albedo_name || 'Albedo',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for gender change
    if (formData.gender !== previousGender && formData.gender) {
      const genderResponses = {
        male: "Hello sir! I've updated your gender preference. How may I assist you today?",
        female: "Hello madam! I've updated your gender preference. How may I assist you today?",
        other: "Hello! I've updated your gender preference. How may I assist you today?",
        prefer_not_to_say: "Hello! I've updated your preference. How may I assist you today?"
      };
      
      toast({
        title: `${formData.albedo_name || 'Albedo'} says:`,
        description: genderResponses[formData.gender],
      });
      setPreviousGender(formData.gender);
    }

    // Check for Albedo name change
    if (formData.albedo_name !== previousAlbedoName && formData.albedo_name) {
      toast({
        title: `${formData.albedo_name} says:`,
        description: `Hello! My name is now ${formData.albedo_name}. It's nice to meet you with my new name!`,
      });
      setPreviousAlbedoName(formData.albedo_name);
    }

    const updateData = {
      ...formData,
      gender: formData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined
    };
    if (!updateData.gender) {
      delete updateData.gender;
    }
    await updateProfile(updateData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
        <div className="animate-pulse text-center">
          <AlbedoAvatar size="lg" animated />
          <p className="mt-4 text-gray-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <AlbedoAvatar size="lg" animated />
        <div>
          <h1 className="text-2xl font-bold text-black">Profile Settings</h1>
          <p className="text-gray-600">Customize your experience with Albedo</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100/80 via-purple-100/80 to-cyan-100/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg overflow-hidden">
          <TabsTrigger value="personal" className="flex items-center space-x-2 transition-all duration-300">
            <User className="h-4 w-4 text-black" />
            <span className="text-black font-medium">Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2 transition-all duration-300">
            <Shield className="h-4 w-4 text-black" />
            <span className="text-black font-medium">Security</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2 transition-all duration-300">
            <CreditCard className="h-4 w-4 text-black" />
            <span className="text-black font-medium">Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2 transition-all duration-300">
            <Activity className="h-4 w-4 text-black" />
            <span className="text-black font-medium">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 border-2 border-blue-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-100/70 to-purple-100/70 border-b border-blue-200">
              <CardTitle className="text-black flex items-center space-x-2">
                <AlbedoAvatar size="sm" animated />
                <span>🧑 Personal Information</span>
              </CardTitle>
              <CardDescription className="text-gray-700">
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-black font-medium">Name</Label>
                    <TextInputWithLength
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      maxLength={50}
                      className="border-2 border-gray-300 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-black font-medium">Username</Label>
                    <TextInputWithLength
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Your username"
                      maxLength={30}
                      className="border-2 border-gray-300 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="albedo_name" className="text-black font-medium">Albedo's Name</Label>
                    <TextInputWithLength
                      id="albedo_name"
                      value={formData.albedo_name}
                      onChange={(e) => handleInputChange('albedo_name', e.target.value)}
                      placeholder="Customize your AI assistant's name"
                      maxLength={25}
                      className="border-2 border-gray-300 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-black font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="border-2 border-gray-300 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob" className="text-black font-medium">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      className="border-2 border-gray-300 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-black font-medium">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)} value={formData.gender}>
                      <SelectTrigger className="border-2 border-gray-300 focus:border-purple-500 transition-colors">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-black font-medium">Location</Label>
                    <TextInputWithLength
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                      maxLength={50}
                      className="border-2 border-gray-300 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio" className="text-black font-medium">Bio</Label>
                  <TextareaWithLength
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={200}
                    className="border-2 border-gray-300 focus:border-purple-500 transition-colors"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 border-2 border-blue-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-100/70 to-orange-100/70 border-b border-blue-200">
              <CardTitle className="text-black flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>🔒 Security & Login</span>
              </CardTitle>
              <CardDescription className="text-gray-700">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <div className="bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 rounded-lg border-2 border-blue-200 shadow-xl backdrop-blur-sm">
            <CreditCards />
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 rounded-lg border-2 border-blue-200 shadow-xl backdrop-blur-sm">
            <ActivityPage />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
