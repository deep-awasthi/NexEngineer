'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const Github = ({ size = 24, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Google = ({ size = 24, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const setSession = useAuthStore((state) => state.setSession);

  // Check if we are running in Demo Mode
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl.includes('placeholder-project-id') || !supabaseUrl) {
      setIsDemoMode(true);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isDemoMode) {
      // Demo Mode login: Set mock cookies and update Zustand
      document.cookie = 'sb-mock-session=true; path=/; max-age=86400';
      setSession(
        { id: '11111111-2222-3333-4444-555555555555', email: email || 'demo@nexengineer.com' },
        {
          id: '11111111-2222-3333-4444-555555555555',
          name: 'Demo Engineer',
          username: email ? email.split('@')[0] : 'demo_engineer',
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
      router.push('/');
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setErrorMsg('');
    if (isDemoMode) {
      setErrorMsg('OAuth logins are disabled in Demo Mode. Use the Demo Account sign-in.');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    }
  };

  const triggerDemoLogin = () => {
    setEmail('demo@nexengineer.com');
    setPassword('demo-pass-123');
    document.cookie = 'sb-mock-session=true; path=/; max-age=86400';
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
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md shadow-2xl relative overflow-hidden z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-2xl shadow-lg shadow-indigo-600/30">
            N
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to NexEngineer</h1>
          <p className="text-sm text-zinc-500">A Portal for Software Engineers to Master Engineering</p>
        </div>

        {isDemoMode && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wider">Demo Mode Active</p>
              <p className="text-zinc-400 leading-normal">
                Supabase credentials are not configured. Click the button below to sign in instantly with a mock profile.
              </p>
              <button
                onClick={triggerDemoLogin}
                className="mt-2 flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest text-[9px] cursor-pointer"
              >
                <span>Instant Demo Login</span>
                <ArrowRight size={10} />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
              <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <LogIn size={16} />}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-3 text-zinc-500">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuthSignIn('github')}
            className="flex items-center justify-center gap-2 py-2 border border-zinc-850 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all text-xs font-semibold cursor-pointer"
          >
            <Github size={14} />
            <span>GitHub</span>
          </button>
          <button
            onClick={() => handleOAuthSignIn('google')}
            className="flex items-center justify-center gap-2 py-2 border border-zinc-850 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all text-xs font-semibold cursor-pointer"
          >
            <Google size={14} />
            <span>Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Don&rsquo;t have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
