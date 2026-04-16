import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
const ADMIN_EMAIL = 'michele.fay@sfr.fr';
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession()
      .then(({ data: { session } }) => { if (!ignore) setUser(session?.user ?? null); })
      .finally(() => { if (!ignore) setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!ignore) setUser(session?.user ?? null);
    });
    return () => { ignore = true; subscription.unsubscribe(); };
  }, []);
  return {
    user, loading,
    isAdmin: user?.email === ADMIN_EMAIL,
    isAuthenticated: !!user,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };
}
