import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      try {
        // Obtener sesión actual (incluye tokens de URL si existen)
        const { data: { session }, error } = await supabase!.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (session?.user) {
          console.log('✅ User authenticated:', session.user.email);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
            avatar_url: session.user.user_metadata?.avatar_url
          });
          // Limpiar URL si hay tokens
          if (window.location.hash || window.location.search.includes('access_token')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    if (isConfigured) {
      const { data: { subscription } } = supabase!.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
            avatar_url: session.user.user_metadata?.avatar_url
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConfigured]);

  const signInWithGoogle = useCallback(async () => {
    if (!isConfigured) {
      return { error: new Error('Supabase no está configurado') };
    }

    try {
      // Usar VITE_APP_URL si está disponible, sino window.location.origin
      const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const { data, error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      return { data, error };
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
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }, [isConfigured]);

  return {
    user,
    loading,
    isConfigured,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
}
