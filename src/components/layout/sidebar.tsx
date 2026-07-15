'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Library,
  PenTool,
  Code2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  User,
  Activity
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuthStore();

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'DSA Tracker', href: '/dsa', icon: BookOpen },
    { name: 'Engineering Library', href: '/library', icon: Library },
    { name: 'System Design Studio', href: '/studio', icon: PenTool },
    { name: 'Online IDE', href: '/ide', icon: Code2 },
    { name: 'My Library', href: '/bookmarks', icon: Bookmark },
  ];

  const isAdmin = profile?.badges?.includes('admin') || false;

  return (
    <motion.div
      animate={{ width: isCollapsed ? '64px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-zinc-400 select-none z-30"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex-shrink-0 shadow-lg shadow-indigo-500/30">
            N
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-white text-lg tracking-wider"
            >
              Nex<span className="text-indigo-400">Engineer</span>
            </motion.span>
          )}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3 flex items-center justify-center w-6 h-6 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-md z-40"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer",
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500"
                    : "hover:bg-zinc-900/60 hover:text-zinc-200"
                )}
              >
                <item.icon size={18} className={cn("flex-shrink-0", isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                {!isCollapsed && <span>{item.name}</span>}
                
                {/* Tooltip for collapsed view */}
                {isCollapsed && (
                  <div className="absolute left-16 scale-0 group-hover:scale-100 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1.5 rounded-md border border-zinc-800 shadow-xl transition-all origin-left duration-100">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-zinc-800/60">
            {!isCollapsed && <div className="px-3 mb-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Admin</div>}
            <Link href="/admin">
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer",
                  pathname.startsWith('/admin')
                    ? "bg-red-500/10 text-red-400 border-l-2 border-red-500"
                    : "hover:bg-zinc-900/60 hover:text-zinc-200"
                )}
              >
                <Shield size={18} className={cn("flex-shrink-0", pathname.startsWith('/admin') ? "text-red-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                {!isCollapsed && <span>Console</span>}
                {isCollapsed && (
                  <div className="absolute left-16 scale-0 group-hover:scale-100 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1.5 rounded-md border border-zinc-800 shadow-xl transition-all origin-left duration-100">
                    Admin Console
                  </div>
                )}
              </div>
            </Link>
          </div>
        )}
      </nav>

      {/* User Session Info Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40">
        {!isCollapsed ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-zinc-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-200 truncate">{profile?.name || 'Engineer'}</p>
                <p className="text-xs text-zinc-500 truncate">@{profile?.username || 'user'}</p>
              </div>
            </div>
            
            {/* Streak & XP Display */}
            {profile && (
              <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-zinc-900/50 border border-zinc-800/40 text-xs">
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  🔥 {profile.streak_count || 0}d
                </span>
                <span className="flex items-center gap-1 text-indigo-400 font-medium">
                  ✨ {profile.xp || 0} XP
                </span>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 mt-1 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-zinc-400" />
                )}
              </div>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
