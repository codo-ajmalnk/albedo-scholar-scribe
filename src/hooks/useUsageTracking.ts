
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAdmin } from './useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface DailyUsage {
  chat: number;
  image_generation: number;
  image_upload: number;
  deep_research: number;
}

interface PlanLimits {
  chat_limit: number;
  image_generation_limit: number;
  image_upload_limit: number;
  deep_research_limit: number;
  price: number;
  duration_months: number;
}

export const useUsageTracking = () => {
  const [usage, setUsage] = useState<DailyUsage>({
    chat: 0,
    image_generation: 0,
    image_upload: 0,
    deep_research: 0,
  });
  const [planLimits, setPlanLimits] = useState<PlanLimits>({
    chat_limit: 25,
    image_generation_limit: 2,
    image_upload_limit: 4,
    deep_research_limit: 2,
    price: 0,
    duration_months: 0,
  });
  const [userPlan, setUserPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTodayUsage();
      loadUserPlan();
    }
  }, [user]);

  const loadUserPlan = async () => {
    if (!user) return;

    try {
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('subscription_plan')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const plan = subscription?.subscription_plan || 'free';
      setUserPlan(plan);

      // Load plan limits
      const { data: limits, error: limitsError } = await supabase
        .from('plan_limits')
        .select('*')
        .eq('plan_type', plan)
        .single();

      if (limitsError) throw limitsError;

      setPlanLimits(limits);
    } catch (error: any) {
      console.error('Error loading user plan:', error);
    }
  };

  const loadTodayUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_usage')
        .select('usage_type, count')
        .eq('user_id', user.id)
        .eq('usage_date', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      const usageMap: DailyUsage = {
        chat: 0,
        image_generation: 0,
        image_upload: 0,
        deep_research: 0,
      };

      data?.forEach((item) => {
        usageMap[item.usage_type as keyof DailyUsage] = item.count;
      });

      setUsage(usageMap);
    } catch (error: any) {
      console.error('Error loading usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkLimit = async (type: keyof DailyUsage): Promise<boolean> => {
    if (isAdmin) return true; // Admin has unlimited access

    const currentUsage = usage[type];
    const limitKey = `${type}_limit` as keyof PlanLimits;
    const limit = planLimits[limitKey] as number;
    
    if (currentUsage >= limit) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${limit} ${type.replace('_', ' ')}s. Upgrade to get more access!`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const incrementUsage = async (type: keyof DailyUsage) => {
    if (!user || isAdmin) return; // Don't track admin usage

    try {
      const { error } = await supabase.rpc('increment_usage', {
        user_id_param: user.id,
        usage_type_param: type,
      });

      if (error) throw error;

      setUsage(prev => ({
        ...prev,
        [type]: prev[type] + 1,
      }));
    } catch (error: any) {
      console.error('Error incrementing usage:', error);
    }
  };

  const getRemainingUsage = (type: keyof DailyUsage): number => {
    if (isAdmin) return 999; // Show unlimited for admin
    
    const limitKey = `${type}_limit` as keyof PlanLimits;
    const limit = planLimits[limitKey] as number;
    
    return Math.max(0, limit - usage[type]);
  };

  return {
    usage,
    planLimits,
    userPlan,
    loading,
    checkLimit,
    incrementUsage,
    getRemainingUsage,
    loadTodayUsage,
    loadUserPlan,
  };
};
