'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

// Helper to read cookies on the client side
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const isDemoMode = supabaseUrl.includes('placeholder-project-id') || !supabaseUrl;

    if (isDemoMode) {
      const mockSession = getCookie('sb-mock-session') === 'true';
      if (mockSession) {
        // Set simulated user and profile details in store
        setSession(
          { id: '11111111-2222-3333-4444-555555555555', email: 'demo@nexengineer.com' },
          {
            id: '11111111-2222-3333-4444-555555555555',
            name: 'Demo Engineer',
            username: 'demo_engineer',
            avatar_url: null,
            bio: 'Senior Software Engineer mastering DSA and system architectures.',
            social_links: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
            badges: ['admin', 'pro-member'],
            achievements: ['DSA Starter', 'Architect Core'],
            xp: 340,
            streak_count: 7,
            last_activity: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }
        );
      } else {
        setSession(null, null);
      }
      return;
    }

    const supabase = createClient();

    // Check active session on mount
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setSession(session.user, profile);
        } else {
          setSession(null, null);
        }
      } catch (error) {
        console.error('Session sync error:', error);
        setSession(null, null);
      }
    };

    checkSession();

    // Listen to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setSession(session.user, profile);
        } catch (error) {
          console.error('Auth state change profile fetch error:', error);
          setSession(session.user, null);
        }
      } else {
        setSession(null, null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
