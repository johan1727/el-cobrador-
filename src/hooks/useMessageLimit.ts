import { useState, useEffect, useCallback, useMemo } from 'react';

interface LimitState {
  anonymousCount: number;
  loginBonusUsed: boolean;
  lastResetDate: string;
}

const STORAGE_KEY = 'el-cobrador-message-limit';
const ANONYMOUS_LIMIT = 5;
const LOGIN_BONUS = 5;

export function useMessageLimit(isAuthenticated: boolean) {
  const [limitState, setLimitState] = useState<LimitState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if we need to reset (new month)
      const now = new Date();
      const lastReset = new Date(parsed.lastResetDate);
      if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
        return {
          anonymousCount: 0,
          loginBonusUsed: false,
          lastResetDate: now.toISOString()
        };
      }
      return parsed;
    }
    return {
      anonymousCount: 0,
      loginBonusUsed: false,
      lastResetDate: new Date().toISOString()
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitState));
  }, [limitState]);

  // Calculate remaining messages
  const remainingMessages = useMemo(() => {
    if (isAuthenticated) {
      // User gets anonymous limit + login bonus if not used
      const totalLimit = ANONYMOUS_LIMIT + (limitState.loginBonusUsed ? 0 : LOGIN_BONUS);
      return Math.max(0, totalLimit - limitState.anonymousCount);
    }
    // Anonymous user
    return Math.max(0, ANONYMOUS_LIMIT - limitState.anonymousCount);
  }, [limitState, isAuthenticated]);

  const hasReachedLimit = remainingMessages === 0;

  // Track message usage
  const useMessage = useCallback(() => {
    setLimitState(prev => ({
      ...prev,
      anonymousCount: prev.anonymousCount + 1
    }));
  }, []);

  // Claim login bonus
  const claimLoginBonus = useCallback(() => {
    setLimitState(prev => ({
      ...prev,
      loginBonusUsed: false // Reset bonus for new login
    }));
  }, []);

  // Mark login bonus as used
  const markLoginBonusUsed = useCallback(() => {
    setLimitState(prev => ({
      ...prev,
      loginBonusUsed: true
    }));
  }, []);

  // Get limit info for UI
  const getLimitInfo = useCallback(() => {
    const used = limitState.anonymousCount;
    const total = isAuthenticated ? ANONYMOUS_LIMIT + LOGIN_BONUS : ANONYMOUS_LIMIT;
    
    return {
      used,
      remaining: remainingMessages,
      total,
      isAnonymous: !isAuthenticated,
      hasLoginBonus: isAuthenticated && !limitState.loginBonusUsed && used < ANONYMOUS_LIMIT + LOGIN_BONUS
    };
  }, [limitState, isAuthenticated, remainingMessages]);

  return {
    remainingMessages,
    hasReachedLimit,
    useMessage,
    claimLoginBonus,
    markLoginBonusUsed,
    getLimitInfo
  };
}
