import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  social_links: Record<string, string>;
  badges: string[];
  achievements: string[];
  xp: number;
  streak_count: number;
  last_activity: string | null;
  created_at: string;
}

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setSession: (user: any | null, profile: UserProfile | null) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  setSession: (user, profile) => set({ user, profile, isLoading: false }),
  updateProfile: (profileUpdates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...profileUpdates } : null,
    })),
  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null, isLoading: false });
  },
  refreshProfile: async () => {
    const { user, profile } = get();
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      set({ profile: data as UserProfile });
    }
  },
}));
