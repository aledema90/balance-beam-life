import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          // Check if user is allowed
          const { data: allowed } = await supabase.rpc('is_user_allowed', {
            user_email: session.user.email
          });
          setIsAllowed(!!allowed);
        } else {
          setIsAllowed(false);
        }
        
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