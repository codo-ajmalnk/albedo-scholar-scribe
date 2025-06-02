
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Image, Upload, Search, Crown } from 'lucide-react';

const UsageIndicator = () => {
  const { usage, getRemainingUsage, planLimits, userPlan, loading } = useUsageTracking();

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
    // This would navigate to the pricing page or open upgrade modal
    console.log('Upgrade clicked');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Daily Usage</CardTitle>
          <Badge variant={userPlan === 'free' ? 'secondary' : userPlan === 'gold' ? 'default' : 'destructive'} className="capitalize">
            {userPlan} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageItems.map(({ type, icon: Icon, label, color, limit }) => {
          const current = usage[type];
          const remaining = getRemainingUsage(type);
          const percentage = remaining === 999 ? 100 : (current / limit) * 100;
          const isUnlimited = limit >= 999999;
          const isAtLimit = current >= limit && !isUnlimited;

          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <Badge variant={isUnlimited ? "default" : isAtLimit ? "destructive" : "secondary"}>
                  {isUnlimited ? 'Unlimited' : `${remaining} left`}
                </Badge>
              </div>
              {!isUnlimited && (
                <div className="space-y-1">
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {current} / {limit} used today
                  </p>
                </div>
              )}
              {isAtLimit && userPlan === 'free' && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  Limit reached! Upgrade to get more access.
                </div>
              )}
            </div>
          );
        })}
        
        {userPlan === 'free' && (
          <div className="pt-4 border-t">
            <Button 
              onClick={handleUpgrade}
              className="w-full" 
              variant="outline"
              size="sm"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Your Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageIndicator;
