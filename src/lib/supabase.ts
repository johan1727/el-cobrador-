import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only if credentials exist
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Auth helpers
export const signInWithGoogle = async () => {
  if (!supabase) return { error: new Error('Supabase no configurado') };
  
  const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });
  
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) return { error: new Error('Supabase no configurado') };
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  if (!supabase) return { data: { user: null }, error: null };
  return await supabase.auth.getUser();
};

// Database helpers for subscriptions
export const getSubscription = async (userId: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase no configurado') };
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  return { data, error };
};

// Local fallback when Supabase is not configured
export const useLocalFallback = () => {
  return {
    isConfigured: false,
    message: 'Usando modo local - los datos se guardan en tu dispositivo'
  };
};
