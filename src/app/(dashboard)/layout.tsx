'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthStore();

  // Show a dark, minimalist loader while syncing Supabase auth state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
        <span className="text-sm font-medium tracking-wide">Initializing workspace...</span>
      </div>
    );
  }

  // If auth middleware didn't redirect yet, block render to avoid layout flashing
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Side Navigation Panel */}
      <Sidebar />

      {/* Main Panel Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header Panel */}
        <Topbar />

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
