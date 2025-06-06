
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Camera, 
  FileDown, 
  Image as ImageIcon,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle
} from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';

interface UsageHistory {
  date: string;
  chat: number;
  image_generation: number;
  image_upload: number;
  deep_research: number;
  pdf_downloads: number;
}

const CreditsHistory = () => {
  const [weeklyHistory, setWeeklyHistory] = useState<UsageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { usage, planLimits, userPlan, getRemainingUsage } = useUsageTracking();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (user) {
      loadWeeklyHistory();
    }
  }, [user]);

  const loadWeeklyHistory = async () => {
    if (!user) return;

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('daily_usage')
        .select('usage_date, usage_type, count')
        .eq('user_id', user.id)
        .gte('usage_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('usage_date', { ascending: false });

      if (error) throw error;

      // Group by date
      const historyMap: { [key: string]: UsageHistory } = {};
      
      data?.forEach((item) => {
        const date = item.usage_date;
        if (!historyMap[date]) {
          historyMap[date] = {
            date,
            chat: 0,
            image_generation: 0,
            image_upload: 0,
            deep_research: 0,
            pdf_downloads: 0
          };
        }
        historyMap[date][item.usage_type as keyof Omit<UsageHistory, 'date'>] = item.count;
      });

      setWeeklyHistory(Object.values(historyMap));
    } catch (error) {
      console.error('Error loading weekly history:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      name: 'Chat Messages',
      icon: MessageSquare,
      current: usage.chat,
      limit: planLimits.chat_limit,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Image Generation',
      icon: ImageIcon,
      current: usage.image_generation,
      limit: planLimits.image_generation_limit,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Image Uploads',
      icon: Camera,
      current: usage.image_upload,
      limit: planLimits.image_upload_limit,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Deep Research',
      icon: TrendingUp,
      current: usage.deep_research,
      limit: planLimits.deep_research_limit,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const getTotalWeeklyUsage = (type: keyof Omit<UsageHistory, 'date'>) => {
    return weeklyHistory.reduce((sum, day) => sum + day[type], 0);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Today's Usage</span>
            {!isAdmin && (
              <Badge variant={userPlan === 'free' ? 'secondary' : 'default'}>
                {userPlan.toUpperCase()} Plan
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isAdmin ? 'Admin - Unlimited Access' : 'Your daily activity and remaining credits'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => {
              const remaining = isAdmin ? 999 : Math.max(0, feature.limit - feature.current);
              const percentage = isAdmin ? 10 : Math.min((feature.current / feature.limit) * 100, 100);
              const isNearLimit = percentage > 80 && !isAdmin;
              
              return (
                <div key={feature.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <feature.icon className={`h-4 w-4 ${feature.color}`} />
                      </div>
                      <span className="text-sm font-medium">{feature.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {isAdmin ? `${feature.current} used` : `${feature.current}/${feature.limit}`}
                      </div>
                      {!isAdmin && (
                        <div className={`text-xs ${isNearLimit ? 'text-red-600' : 'text-gray-500'}`}>
                          {remaining} remaining
                        </div>
                      )}
                    </div>
                  </div>
                  {!isAdmin && (
                    <div className="space-y-1">
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${isNearLimit ? 'bg-red-100' : ''}`}
                      />
                      {isNearLimit && (
                        <div className="flex items-center space-x-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          <span>Near daily limit</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>7-Day Summary</span>
          </CardTitle>
          <CardDescription>Your activity over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-blue-600">
                {getTotalWeeklyUsage('chat')}
              </div>
              <div className="text-xs text-gray-600">Chat Messages</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <ImageIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-green-600">
                {getTotalWeeklyUsage('image_generation')}
              </div>
              <div className="text-xs text-gray-600">Images Created</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Camera className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-purple-600">
                {getTotalWeeklyUsage('image_upload')}
              </div>
              <div className="text-xs text-gray-600">Images Uploaded</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-orange-600">
                {getTotalWeeklyUsage('deep_research')}
              </div>
              <div className="text-xs text-gray-600">Research Queries</div>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Breakdown</h4>
            {weeklyHistory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No activity recorded this week</p>
            ) : (
              weeklyHistory.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex space-x-4 text-xs text-gray-600">
                    <span>💬 {day.chat}</span>
                    <span>🖼️ {day.image_generation}</span>
                    <span>📷 {day.image_upload}</span>
                    <span>🔍 {day.deep_research}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credits Information for Paid Users */}
      {!isAdmin && userPlan !== 'free' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Credits Information</span>
            </CardTitle>
            <CardDescription>Your subscription benefits and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-gold-100 to-yellow-100 rounded-lg">
                <h4 className="font-semibold text-gold-800 mb-2">Plan Benefits</h4>
                <div className="space-y-1 text-sm text-gold-700">
                  <div>• {planLimits.chat_limit} daily chat messages</div>
                  <div>• {planLimits.image_generation_limit} daily image generations</div>
                  <div>• {planLimits.image_upload_limit} daily image uploads</div>
                  <div>• {planLimits.deep_research_limit} daily research queries</div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Usage Tips</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <div>• Credits reset daily at midnight</div>
                  <div>• Unused credits don't roll over</div>
                  <div>• Upgrade for higher limits</div>
                  <div>• Download PDFs to save responses</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreditsHistory;
