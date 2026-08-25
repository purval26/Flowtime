import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface UserRoleWithDetails {
  role: {
    name: 'owner' | 'admin' | 'editor' | 'user';
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles (
            name
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        // Map roles names
        const roleNames = data
          .map((item: any) => item.roles?.name)
          .filter(Boolean) as string[];
        setRoles(roleNames);
      } else {
        setRoles([]);
      }
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setRoles([]);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setLoading(true);
          await fetchUserRoles(newSession.user.id);
          setLoading(false);
        } else {
          setRoles([]);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
    setLoading(false);
  };

  const isStaff = roles.some(role => ['owner', 'admin', 'editor'].includes(role));
  const isOwner = roles.includes('owner');
  const isAdmin = roles.includes('admin');

  return {
    user,
    session,
    roles,
    loading,
    isStaff,
    isOwner,
    isAdmin,
    signOut,
  };
}
