import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserPlan } from '../types';

const FREE_DAILY_LIMIT = 10;

export function useUsageLimit() {
  const [userPlan, setUserPlan] = useLocalStorage<UserPlan>('userPlan', {
    type: 'free',
    dailyMessages: 0,
    maxDailyMessages: FREE_DAILY_LIMIT,
    lastResetDate: new Date().toISOString().split('T')[0]
  });

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const canGenerate = useMemo(() => {
    if (userPlan.type === 'pro') return true;
    
    // Reset if it's a new day
    if (userPlan.lastResetDate !== today) {
      return true;
    }
    
    return userPlan.dailyMessages < userPlan.maxDailyMessages;
  }, [userPlan, today]);

  const remainingMessages = useMemo(() => {
    if (userPlan.type === 'pro') return Infinity;
    if (userPlan.lastResetDate !== today) return FREE_DAILY_LIMIT;
    return Math.max(0, userPlan.maxDailyMessages - userPlan.dailyMessages);
  }, [userPlan, today]);

  // Calculate time until next reset (midnight)
  const getTimeUntilReset = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, totalMs: diff };
  }, []);

  // Format time as "Xh Ym" or "X horas Y min"
  const getTimeUntilResetFormatted = useCallback((lang: 'es' | 'en' = 'es') => {
    const { hours, minutes } = getTimeUntilReset();
    if (lang === 'es') {
      if (hours === 0) return `${minutes}m`;
      return `${hours}h ${minutes}m`;
    }
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  }, [getTimeUntilReset]);

  // Check if limit is almost reached (< 3 remaining)
  const isLimitAlmostReached = useMemo(() => {
    if (userPlan.type === 'pro') return false;
    return remainingMessages <= 3 && remainingMessages > 0;
  }, [userPlan.type, remainingMessages]);

  // Check if limit is reached
  const isLimitReached = useMemo(() => {
    if (userPlan.type === 'pro') return false;
    return remainingMessages === 0;
  }, [userPlan.type, remainingMessages]);

  // Get progress percentage (0-100)
  const getProgressPercentage = useMemo(() => {
    if (userPlan.type === 'pro') return 100;
    return (userPlan.dailyMessages / FREE_DAILY_LIMIT) * 100;
  }, [userPlan.type, userPlan.dailyMessages]);

  const incrementUsage = useCallback(() => {
    setUserPlan(prev => {
      const isNewDay = prev.lastResetDate !== today;
      
      return {
        ...prev,
        dailyMessages: isNewDay ? 1 : prev.dailyMessages + 1,
        lastResetDate: today
      };
    });
  }, [setUserPlan, today]);

  const upgradeToPro = useCallback(() => {
    setUserPlan({
      type: 'pro',
      dailyMessages: 0,
      maxDailyMessages: Infinity,
      lastResetDate: today
    });
  }, [setUserPlan, today]);

  // Reset usage (for testing or manual reset)
  const resetUsage = useCallback(() => {
    setUserPlan(prev => ({
      ...prev,
      dailyMessages: 0,
      lastResetDate: today
    }));
  }, [setUserPlan, today]);

  return {
    userPlan,
    canGenerate,
    remainingMessages,
    incrementUsage,
    upgradeToPro,
    resetUsage,
    isPro: userPlan.type === 'pro',
    isLimitAlmostReached,
    isLimitReached,
    getTimeUntilReset,
    getTimeUntilResetFormatted,
    getProgressPercentage,
    FREE_DAILY_LIMIT
  };
}
