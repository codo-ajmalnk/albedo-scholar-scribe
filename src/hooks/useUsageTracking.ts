
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

const FREE_LIMITS = {
  chat: 50,
  image_generation: 4,
  image_upload: 4,
  deep_research: 2,
};

export const useUsageTracking = () => {
  const [usage, setUsage] = useState<DailyUsage>({
    chat: 0,
    image_generation: 0,
    image_upload: 0,
    deep_research: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTodayUsage();
    }
  }, [user]);

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
    const limit = FREE_LIMITS[type];
    
    if (currentUsage >= limit) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${limit} ${type.replace('_', ' ')}s. Upgrade to get unlimited access!`,
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
    return Math.max(0, FREE_LIMITS[type] - usage[type]);
  };

  return {
    usage,
    loading,
    checkLimit,
    incrementUsage,
    getRemainingUsage,
    loadTodayUsage,
    FREE_LIMITS,
  };
};
