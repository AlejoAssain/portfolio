import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function verifyAdmin(user: User | null) {
  if (!user) return false;
  const { data, error } = await supabase.rpc('is_admin');
  if (error) throw error;
  return data === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let authCheck = 0;

    async function syncAuthState(nextUser: User | null) {
      const currentCheck = ++authCheck;

      try {
        const admin = await verifyAdmin(nextUser);
        if (active && currentCheck === authCheck) {
          setUser(nextUser);
          setIsAdmin(admin);
        }
      } catch (error) {
        if (active && currentCheck === authCheck) {
          console.error('Failed to verify admin access.', error);
          setUser(nextUser);
          setIsAdmin(false);
        }
      } finally {
        if (active && currentCheck === authCheck) {
          setLoading(false);
        }
      }
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        return syncAuthState(data.session?.user ?? null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Failed to restore the Supabase session.', error);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null;

        if (!nextUser) {
          authCheck += 1;
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setLoading(true);
        window.setTimeout(() => {
          void syncAuthState(nextUser);
        }, 0);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      isAdmin,
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        const admin = await verifyAdmin(data.user);
        if (!admin) {
          await supabase.auth.signOut();
          throw new Error('This account does not have admin access.');
        }
        setUser(data.user);
        setIsAdmin(true);
        setLoading(false);
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      },
    }),
    [isAdmin, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
