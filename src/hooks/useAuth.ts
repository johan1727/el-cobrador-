import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getAuthRedirectUrl, supabase, isSupabaseConfigured } from '../lib/supabase';

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

const AUTH_HASH_KEYS = ['access_token', 'expires_at', 'expires_in', 'provider_token', 'refresh_token', 'token_type', 'type'];
const AUTH_SEARCH_KEYS = ['code', 'error', 'error_code', 'error_description'];

const hasAuthCallbackParams = () => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const searchParams = new URLSearchParams(window.location.search);

  return AUTH_HASH_KEYS.some((key) => hashParams.has(key)) || AUTH_SEARCH_KEYS.some((key) => searchParams.has(key));
};

const clearAuthCallbackParams = () => {
  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));

  AUTH_SEARCH_KEYS.forEach((key) => {
    url.searchParams.delete(key);
  });

  AUTH_HASH_KEYS.forEach((key) => {
    hashParams.delete(key);
  });

  const nextHash = hashParams.toString();
  url.hash = nextHash ? `#${nextHash}` : '';

  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
};

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
        const hasAuthParams = hasAuthCallbackParams();
        console.log('[auth] init', {
          hasHash: !!window.location.hash,
          hasSearch: !!window.location.search,
          hasAuthParams,
        });

        const { data: { session }, error } = await supabase!.auth.getSession();

        if (error) {
          console.error('[auth] getSession error', error);
          alert(`Auth Fallido: ${error.message || JSON.stringify(error)}`);
        }

        if (session?.user) {
          console.log('[auth] hydrated session', session.user.email);
          setUser(mapSessionUser(session.user));
          if (hasAuthParams) {
            clearAuthCallbackParams();
          }
        } else {
          console.log('[auth] no session after init');
          setUser(null);
        }
      } catch (error) {
        console.error('[auth] checkSession exception', error);
      } finally {
        setLoading(false);
      }
    };

    void checkSession();

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((event, session) => {
      console.log('[auth] state change', event, !!session?.user);
      if (session?.user) {
        setUser(mapSessionUser(session.user));
        if (hasAuthCallbackParams()) {
          clearAuthCallbackParams();
        }
      } else if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signInWithGoogle = useCallback(async () => {
    if (!isConfigured) {
      return { error: new Error('Supabase no está configurado') };
    }

    try {
      const redirectUrl = getAuthRedirectUrl();
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
