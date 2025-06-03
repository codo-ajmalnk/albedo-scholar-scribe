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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="animate-pulse text-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>🧑 Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <TextInputWithLength
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <TextInputWithLength
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Your username"
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <Label htmlFor="albedo_name">Albedo's Name</Label>
                    <TextInputWithLength
                      id="albedo_name"
                      value={formData.albedo_name}
                      onChange={(e) => handleInputChange('albedo_name', e.target.value)}
                      placeholder="Customize your AI assistant's name"
                      maxLength={25}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)} value={formData.gender}>
                      <SelectTrigger>
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
                    <Label htmlFor="location">Location</Label>
                    <TextInputWithLength
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                      maxLength={50}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <TextareaWithLength
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={200}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>🔒 Security & Login</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <CreditCards />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
