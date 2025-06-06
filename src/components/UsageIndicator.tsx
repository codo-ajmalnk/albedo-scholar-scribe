
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Image, Upload, Search, Crown, User, Calendar } from 'lucide-react';
import AlbedoAvatar from './AlbedoAvatar';

const UsageIndicator = () => {
  const { usage, getRemainingUsage, planLimits, userPlan, loading } = useUsageTracking();
  const { profile } = useUserProfile();

  if (loading) return null;

  const usageItems = [
    {
      type: 'chat' as const,
      icon: MessageSquare,
      label: 'Chat Messages',
      color: 'bg-blue-500',
      limit: planLimits.chat_limit,
    },
    {
      type: 'image_generation' as const,
      icon: Image,
      label: 'Image Generation',
      color: 'bg-purple-500',
      limit: planLimits.image_generation_limit,
    },
    {
      type: 'image_upload' as const,
      icon: Upload,
      label: 'Image Uploads',
      color: 'bg-green-500',
      limit: planLimits.image_upload_limit,
    },
    {
      type: 'deep_research' as const,
      icon: Search,
      label: 'Deep Research',
      color: 'bg-orange-500',
      limit: planLimits.deep_research_limit,
    },
  ];

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white via-gray-50 to-blue-50 border-2 border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlbedoAvatar size="sm" animated />
            <div>
              <CardTitle className="text-lg text-black">
                {profile?.name ? `${profile.name}'s Usage` : 'Your Daily Usage'}
              </CardTitle>
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Today's Activity</span>
              </p>
            </div>
          </div>
          <Badge 
            variant={userPlan === 'free' ? 'secondary' : userPlan === 'gold' ? 'default' : 'destructive'} 
            className="capitalize font-semibold"
          >
            {userPlan} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {/* User Info Section */}
        {profile && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-semibold text-black">
                  {profile.name || 'Anonymous User'}
                </h4>
                <p className="text-sm text-gray-600">
                  {profile.username ? `@${profile.username}` : 'Welcome to Albedo!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black flex items-center space-x-2">
            <span>📊 Feature Usage Breakdown</span>
          </h4>
          {usageItems.map(({ type, icon: Icon, label, color, limit }) => {
            const current = usage[type];
            const remaining = getRemainingUsage(type);
            const percentage = remaining === 999 ? 100 : (current / limit) * 100;
            const isUnlimited = limit >= 999999;
            const isAtLimit = current >= limit && !isUnlimited;

            return (
              <div key={type} className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
                      <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-black">{label}</span>
                      <p className="text-xs text-gray-500">
                        Used today: {current} {isUnlimited ? '' : `/ ${limit}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isUnlimited ? "default" : isAtLimit ? "destructive" : "secondary"}>
                    {isUnlimited ? 'Unlimited' : `${remaining} left`}
                  </Badge>
                </div>
                {!isUnlimited && (
                  <div className="space-y-2">
                    <Progress 
                      value={percentage} 
                      className={`h-3 ${isAtLimit ? 'bg-red-100' : 'bg-gray-200'}`} 
                    />
                    {isAtLimit && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        ⚠️ Daily limit reached! {userPlan === 'free' ? 'Upgrade to get more access.' : 'Limit resets tomorrow.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {userPlan === 'free' && (
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105" 
              size="sm"
            >
              <Crown className="h-4 w-4 mr-2" />
              ✨ Upgrade Your Plan for More Features
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageIndicator;
