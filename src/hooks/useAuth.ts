import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    console.log('useAuth: Setting up auth state listener');
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed', { event, hasSession: !!session, userEmail: session?.user?.email });
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          console.log('useAuth: Checking if user is allowed');
          try {
            // Check if user is allowed with timeout
            const { data: allowed, error } = await supabase.rpc('is_user_allowed', {
              user_email: session.user.email
            });
            console.log('useAuth: User allowed check result', { allowed, error });
            setIsAllowed(!!allowed);
          } catch (err) {
            console.error('useAuth: Error checking user allowed', err);
            setIsAllowed(false);
          }
        } else {
          console.log('useAuth: No session or email, setting not allowed');
          setIsAllowed(false);
        }
        
        console.log('useAuth: Setting loading to false');
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.email) {
        const { data: allowed } = await supabase.rpc('is_user_allowed', {
          user_email: session.user.email
        });
        setIsAllowed(!!allowed);
      } else {
        setIsAllowed(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setIsAllowed(false);
    }
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAllowed,
    signOut,
    isAuthenticated: !!user && isAllowed
  };
};