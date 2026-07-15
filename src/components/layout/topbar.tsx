'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { CommandPalette } from '@/components/search/command-palette';
import { Award, Zap, User, Settings, ShieldAlert } from 'lucide-react';

export function Topbar() {
  const { profile } = useAuthStore();
  const isAdmin = profile?.badges?.includes('admin') || false;

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md z-20">
      {/* Search Input Button */}
      <div className="flex-1 max-w-sm">
        <CommandPalette />
      </div>

      {/* User Stats & Navigation Links */}
      <div className="flex items-center gap-5">
        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-500 shadow-sm cursor-help hover:border-zinc-700 transition-colors" title="Your daily learning streak!">
          <Zap size={14} className="fill-amber-500/20" />
          <span>{profile?.streak_count || 0} Day Streak</span>
        </div>

        {/* XP stats */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-indigo-400 shadow-sm" title="Accumulated Mastery Points">
          <Award size={14} className="fill-indigo-500/10" />
          <span>{profile?.xp || 0} XP</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
          {isAdmin && (
            <Link href="/admin">
              <button
                className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800/80 cursor-pointer"
                title="Admin Control Center"
              >
                <ShieldAlert size={16} />
              </button>
            </Link>
          )}

          <Link href="/profile">
            <button
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800/80 cursor-pointer"
              title="Profile Settings"
            >
              <Settings size={16} />
            </button>
          </Link>
          
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <User size={14} className="text-zinc-400" />
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
