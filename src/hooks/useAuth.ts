import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[onAuthStateChange] event:", event, "session:", session);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        console.log(
          "[onAuthStateChange] Checking if user is allowed for email:",
          session.user.email
        );
        try {
          const { data: allowed, error } = await supabase.rpc(
            "is_user_allowed",
            {
              user_email: session.user.email,
            }
          );
          if (error) {
            console.error(
              "[onAuthStateChange] Error from is_user_allowed:",
              error
            );
          }
          setIsAllowed(!!allowed);
          console.log("[onAuthStateChange] isAllowed:", !!allowed);
        } catch (err) {
          console.error(
            "[onAuthStateChange] Exception during is_user_allowed:",
            err
          );
          setIsAllowed(false);
        }
      } else {
        setIsAllowed(false);
      }

      setLoading(false);
      console.log("[onAuthStateChange] Loading set to false");
    });

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("[getSession] session:", session);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        console.log(
          "[getSession] Checking if user is allowed for email:",
          session.user.email
        );
        try {
          const { data: allowed, error } = await supabase.rpc(
            "is_user_allowed",
            {
              user_email: session.user.email,
            }
          );
          if (error) {
            console.error("[getSession] Error from is_user_allowed:", error);
          }
          setIsAllowed(!!allowed);
          console.log("[getSession] isAllowed:", !!allowed);
        } catch (err) {
          console.error("[getSession] Exception during is_user_allowed:", err);
          setIsAllowed(false);
        }
      } else {
        setIsAllowed(false);
      }

      setLoading(false);
      console.log("[getSession] Loading set to false");
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
    isAuthenticated: !!user && isAllowed,
  };
};
