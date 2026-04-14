import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ data?: unknown; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapSessionUser = (sessionUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}) => ({
  id: sessionUser.id,
  email: sessionUser.email || '',
  name:
    (typeof sessionUser.user_metadata?.full_name === 'string' && sessionUser.user_metadata.full_name) ||
    sessionUser.email?.split('@')[0] ||
    'Usuario',
  avatar_url:
    typeof sessionUser.user_metadata?.avatar_url === 'string'
      ? sessionUser.user_metadata.avatar_url
      : undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = useMemo(() => isSupabaseConfigured(), []);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const hasAuthParams = window.location.hash.includes('access_token') || window.location.search.includes('code=');
        console.log('[auth] init', {
          hasHash: !!window.location.hash,
          hasSearch: !!window.location.search,
          hasAuthParams,
        });

        const { data: { session }, error } = await supabase!.auth.getSession();

        if (error) {
          console.error('[auth] getSession error', error);
        }

        if (session?.user) {
          console.log('[auth] hydrated session', session.user.email);
          setUser(mapSessionUser(session.user));
          if (window.location.hash || window.location.search.includes('access_token') || window.location.search.includes('code=')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          console.log('[auth] no session after init');
        }
      } catch (error) {
        console.error('[auth] checkSession exception', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = window.setTimeout(checkSession, 500);

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((event, session) => {
      console.log('[auth] state change', event, !!session?.user);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(mapSessionUser(session.user));
        if (window.location.hash || window.location.search.includes('access_token') || window.location.search.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signInWithGoogle = useCallback(async () => {
    if (!isConfigured) {
      return { error: new Error('Supabase no está configurado') };
    }

    try {
      const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      console.log('[auth] signInWithGoogle', { redirectUrl });
      const { data, error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      return { data, error: error ?? null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [isConfigured]);

  const signOut = useCallback(async () => {
    if (!isConfigured) {
      setUser(null);
      return { error: null };
    }

    try {
      const { error } = await supabase!.auth.signOut();
      if (!error) {
        setUser(null);
      }
      return { error: error ?? null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [isConfigured]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isConfigured,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  }), [user, loading, isConfigured, signInWithGoogle, signOut]);

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
