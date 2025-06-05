
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Image, Upload, Search, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface UsageHistory {
  date: string;
  chat: number;
  image_generation: number;
  image_upload: number;
  deep_research: number;
}

const CreditsHistory = () => {
  const { user } = useAuth();
  const { subscription } = useUserProfile();
  const { usage, planLimits, userPlan, loading } = useUsageTracking();
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [weeklyUsage, setWeeklyUsage] = useState<UsageHistory[]>([]);

  useEffect(() => {
    if (user) {
      loadUsageHistory();
      loadWeeklyUsage();
    }
  }, [user]);

  const loadUsageHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_usage')
        .select('usage_date, usage_type, count')
        .eq('user_id', user.id)
        .order('usage_date', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Group by date
      const groupedData: { [key: string]: UsageHistory } = {};
      
      data?.forEach((item) => {
        const date = item.usage_date || '';
        if (!groupedData[date]) {
          groupedData[date] = {
            date,
            chat: 0,
            image_generation: 0,
            image_upload: 0,
            deep_research: 0,
          };
        }
        groupedData[date][item.usage_type as keyof Omit<UsageHistory, 'date'>] = item.count || 0;
      });

      setUsageHistory(Object.values(groupedData));
    } catch (error: any) {
      console.error('Error loading usage history:', error);
    }
  };

  const loadWeeklyUsage = async () => {
    if (!user) return;

    try {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const { data, error } = await supabase
        .from('daily_usage')
        .select('usage_date, usage_type, count')
        .eq('user_id', user.id)
        .gte('usage_date', lastWeek.toISOString().split('T')[0])
        .order('usage_date', { ascending: false });

      if (error) throw error;

      // Group by date
      const groupedData: { [key: string]: UsageHistory } = {};
      
      data?.forEach((item) => {
        const date = item.usage_date || '';
        if (!groupedData[date]) {
          groupedData[date] = {
            date,
            chat: 0,
            image_generation: 0,
            image_upload: 0,
            deep_research: 0,
          };
        }
        groupedData[date][item.usage_type as keyof Omit<UsageHistory, 'date'>] = item.count || 0;
      });

      setWeeklyUsage(Object.values(groupedData));
    } catch (error: any) {
      console.error('Error loading weekly usage:', error);
    }
  };

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

  const getTotalWeeklyUsage = (type: keyof Omit<UsageHistory, 'date'>) => {
    return weeklyUsage.reduce((total, day) => total + day[type], 0);
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit >= 999999) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Current Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Today's Usage Overview</span>
            <Badge variant={userPlan === 'free' ? 'secondary' : userPlan === 'gold' ? 'default' : 'destructive'} className="capitalize">
              {userPlan} Plan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usageItems.map(({ type, icon: Icon, label, color, limit }) => {
              const current = usage[type];
              const isUnlimited = limit >= 999999;
              const isAtLimit = current >= limit && !isUnlimited;
              const percentage = getUsagePercentage(current, limit);

              return (
                <div key={type} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    {isAtLimit && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  
                  {!isUnlimited && (
                    <div className="space-y-2">
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{current} used</span>
                        <span>{limit} limit</span>
                      </div>
                    </div>
                  )}
                  
                  {isUnlimited && (
                    <div className="text-sm text-green-600 font-medium">
                      Unlimited ✨
                    </div>
                  )}
                  
                  {isAtLimit && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      Daily limit reached! {userPlan === 'free' && 'Upgrade to get more access.'}
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
            <Calendar className="h-5 w-5" />
            <span>Weekly Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {usageItems.map(({ type, icon: Icon, label, color }) => {
              const weeklyTotal = getTotalWeeklyUsage(type);
              
              return (
                <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold text-gray-900">{weeklyTotal}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Credits Information for Paid Users */}
      {subscription && userPlan !== 'free' && (
        <Card>
          <CardHeader>
            <CardTitle>Credits Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Available Credits</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {subscription.credits}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Plan Status</h4>
                <p className={`text-2xl font-bold ${subscription.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {subscription.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900">Plan Type</h4>
                <p className="text-2xl font-bold text-purple-600 capitalize">
                  {subscription.subscription_plan}
                </p>
              </div>
            </div>
            
            {subscription.expires_at && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Subscription Expires</h4>
                <p className="text-yellow-700">
                  {format(new Date(subscription.expires_at), 'PPP')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle>Usage History (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {usageHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No usage history available</p>
            ) : (
              usageHistory.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">
                    {format(new Date(day.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{day.chat}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Image className="h-3 w-3" />
                      <span>{day.image_generation}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Upload className="h-3 w-3" />
                      <span>{day.image_upload}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Search className="h-3 w-3" />
                      <span>{day.deep_research}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditsHistory;
