
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Image, Upload, Search } from 'lucide-react';

const UsageIndicator = () => {
  const { usage, getRemainingUsage, FREE_LIMITS, loading } = useUsageTracking();

  if (loading) return null;

  const usageItems = [
    {
      type: 'chat' as const,
      icon: MessageSquare,
      label: 'Chat Messages',
      color: 'bg-blue-500',
    },
    {
      type: 'image_generation' as const,
      icon: Image,
      label: 'Image Generation',
      color: 'bg-purple-500',
    },
    {
      type: 'image_upload' as const,
      icon: Upload,
      label: 'Image Uploads',
      color: 'bg-green-500',
    },
    {
      type: 'deep_research' as const,
      icon: Search,
      label: 'Deep Research',
      color: 'bg-orange-500',
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Daily Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageItems.map(({ type, icon: Icon, label, color }) => {
          const current = usage[type];
          const limit = FREE_LIMITS[type];
          const remaining = getRemainingUsage(type);
          const percentage = remaining === 999 ? 100 : (current / limit) * 100;
          const isUnlimited = remaining === 999;

          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <Badge variant={isUnlimited ? "default" : current >= limit ? "destructive" : "secondary"}>
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
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UsageIndicator;
