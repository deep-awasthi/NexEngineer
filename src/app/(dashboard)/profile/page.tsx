'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Shield,
  Award,
  Zap,
  Globe,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const Github = ({ size = 24, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ProfilePage() {
  const { profile, updateProfile, refreshProfile } = useAuthStore();
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [github, setGithub] = useState(profile?.social_links?.github || '');
  const [linkedin, setLinkedin] = useState(profile?.social_links?.linkedin || '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setStatusMsg('');

    const updates = {
      name,
      bio,
      social_links: {
        github,
        linkedin,
      },
      updated_at: new Date().toISOString(),
    };

    // If running in Demo Mode (placeholder db), update local store state directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl.includes('placeholder-project-id') || !supabaseUrl) {
      updateProfile(updates);
      setStatus('success');
      setStatusMsg('Demo profile updated successfully! (Local state only)');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile?.id);

    if (error) {
      setStatus('error');
      setStatusMsg(error.message);
    } else {
      setStatus('success');
      setStatusMsg('Profile updated successfully!');
      updateProfile(updates);
      await refreshProfile();
    }
    setLoading(false);
  };

  const badgeIcons: Record<string, string> = {
    admin: '🛡️ Admin Access',
    'pro-member': '⭐ Pro Member',
    moderator: '🛡️ Moderator',
  };

  const achievementsList = [
    { title: 'DSA Starter', description: 'Solved your first coding question.', xp: 20 },
    { title: 'Consistent Coder', description: 'Maintained a 7-day practice streak.', xp: 50 },
    { title: 'System Architect', description: 'Created your first system design architecture.', xp: 40 },
    { title: 'Heavy Reader', description: 'Completed reading 3 library articles.', xp: 30 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Your Profile</h1>
        <p className="text-sm text-zinc-500">Manage your developer persona, badges, and learning credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Stats & Badges card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-zinc-500" />
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">{profile?.name || 'Engineer'}</h2>
              <p className="text-xs text-zinc-500">@{profile?.username || 'user'}</p>
            </div>

            {/* Streak and XP widgets */}
            <div className="flex gap-2 justify-center py-2">
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs px-2.5 py-1 rounded-full font-bold">
                <Zap size={12} className="fill-amber-500/10" />
                <span>{profile?.streak_count || 0}d Streak</span>
              </div>
              <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded-full font-bold">
                <Award size={12} className="fill-indigo-500/10" />
                <span>{profile?.xp || 0} XP</span>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={14} className="text-zinc-500" />
              <span>Unlocked Badges</span>
            </h3>
            
            {profile?.badges && profile.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-md"
                  >
                    {badgeIcons[badge] || badge}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-550 italic">No badges unlocked yet. Start solving questions to earn them!</p>
            )}
          </div>
        </div>

        {/* Right Side: Account Details & Achievements */}
        <div className="md:col-span-2 space-y-6">
          {/* Settings form */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <h3 className="text-sm font-bold text-white">Profile Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">GitHub URL</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-550" />
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-indigo-500 transition-colors"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-550" />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-3 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Share a short summary about your engineering goals..."
                />
              </div>

              {status === 'success' && (
                <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2">
                  <CheckCircle size={14} />
                  <span>{statusMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{statusMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                <Save size={12} />
                <span>{loading ? 'Saving Changes...' : 'Save Settings'}</span>
              </button>
            </form>
          </div>

          {/* Achievements Cards list */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-indigo-400" />
              <span>Earned Achievements</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievementsList.map((ach) => {
                const unlocked = profile?.achievements?.includes(ach.title) || false;
                return (
                  <div
                    key={ach.title}
                    className={`p-4 rounded-xl border transition-all ${
                      unlocked
                        ? 'bg-zinc-950 border-zinc-800/80'
                        : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        unlocked ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-850 text-zinc-550'
                      }`}>
                        {unlocked ? '🏆 Unlocked' : '🔒 Locked'}
                      </span>
                      <span className="text-[10px] text-zinc-500">+{ach.xp} XP</span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-200 mt-2">{ach.title}</h4>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-normal">{ach.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
