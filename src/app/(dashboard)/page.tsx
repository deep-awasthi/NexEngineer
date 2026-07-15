'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import {
  Zap,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const [stats, setStats] = useState({
    easySolved: 4,
    easyTotal: 10,
    mediumSolved: 2,
    mediumTotal: 15,
    hardSolved: 0,
    hardTotal: 5,
  });

  const [revisionList, setRevisionList] = useState<any[]>([]);
  const [recentRead, setRecentRead] = useState<any[]>([]);

  useEffect(() => {
    // Load some mock items or fetch actual data if Supabase is linked
    const fetchDashboardData = async () => {
      const supabase = createClient();
      
      // Fetch progress summary
      try {
        const { data: progressData } = await supabase
          .from('progress')
          .select('question_id, completed, questions(difficulty)');
        
        if (progressData && progressData.length > 0) {
          let easy = 0, med = 0, hard = 0;
          progressData.forEach((p: any) => {
            if (p.completed && p.questions) {
              const diff = p.questions.difficulty;
              if (diff === 'EASY') easy++;
              else if (diff === 'MEDIUM') med++;
              else if (diff === 'HARD') hard++;
            }
          });
          setStats(prev => ({
            ...prev,
            easySolved: easy,
            mediumSolved: med,
            hardSolved: hard
          }));
        }

        // Fetch revision queue
        const { data: revData } = await supabase
          .from('progress')
          .select('*, questions(name, slug, difficulty)')
          .eq('completed', true)
          .order('last_revision_at', { ascending: true })
          .limit(3);
        if (revData) {
          setRevisionList(revData);
        }

        // Fetch reading history
        const { data: readData } = await supabase
          .from('reading_history')
          .select('*, articles(title, slug, reading_time)')
          .order('last_read_at', { ascending: false })
          .limit(2);
        if (readData) {
          setRecentRead(readData);
        }
      } catch (err) {
        console.log('Using fallback dashboard values', err);
      }
    };

    fetchDashboardData();
  }, [profile]);

  // Mock activity chart data
  const activityData = [
    { name: 'Mon', problems: 1 },
    { name: 'Tue', problems: 3 },
    { name: 'Wed', problems: 2 },
    { name: 'Thu', problems: 5 },
    { name: 'Fri', problems: 3 },
    { name: 'Sat', problems: 0 },
    { name: 'Sun', problems: 2 },
  ];

  // Helper for progress bar
  const percent = (val: number, tot: number) => {
    return Math.round((val / (tot || 1)) * 100);
  };

  // Build full year contribution grid mock
  const heatmapDays = Array.from({ length: 53 * 7 }, (_, i) => {
    const values = [0, 0, 0, 1, 0, 2, 0, 0, 3, 0, 0, 1, 4, 0, 0, 0];
    return {
      day: i,
      level: values[i % values.length],
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="space-y-1 z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-indigo-400">{profile?.name || 'Engineer'}</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            Master the stack, one problem at a time. What are you building today?
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Link href="/dsa">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer">
              <span>Practice DSA</span>
              <ArrowRight size={14} />
            </button>
          </Link>
          <Link href="/studio">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium text-xs transition-all cursor-pointer">
              <span>Draw System Architecture</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak card */}
        <div className="flex items-center justify-between p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Practice Streak</p>
            <p className="text-3xl font-extrabold text-white">{profile?.streak_count || 0} Days</p>
            <p className="text-zinc-400 text-xs flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <span>Keep consistency going!</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Zap size={24} className="fill-amber-500/10" />
          </div>
        </div>

        {/* Experience Points card */}
        <div className="flex items-center justify-between p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Experience Points</p>
            <p className="text-3xl font-extrabold text-white">{profile?.xp || 0} XP</p>
            <p className="text-zinc-400 text-xs flex items-center gap-1">
              <Sparkles size={12} className="text-indigo-400" />
              <span>Rank: Novice Engineer</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Award size={24} className="fill-indigo-500/10" />
          </div>
        </div>

        {/* Overall Mastery bar */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">DSA Progress</p>
            <span className="text-xs text-zinc-400 font-bold">
              {stats.easySolved + stats.mediumSolved + stats.hardSolved} / {stats.easyTotal + stats.mediumTotal + stats.hardTotal} Solved
            </span>
          </div>
          <div className="space-y-2">
            {/* Easy Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-emerald-500 font-semibold">Easy</span>
                <span className="text-zinc-400">{percent(stats.easySolved, stats.easyTotal)}%</span>
              </div>
              <div className="h-1.5 bg-zinc-850 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent(stats.easySolved, stats.easyTotal)}%` }}
                />
              </div>
            </div>

            {/* Medium Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-amber-500 font-semibold">Medium</span>
                <span className="text-zinc-400">{percent(stats.mediumSolved, stats.mediumTotal)}%</span>
              </div>
              <div className="h-1.5 bg-zinc-850 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent(stats.mediumSolved, stats.mediumTotal)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white">Engineering Activity</h2>
            <p className="text-xs text-zinc-500">Practice tracking frequency for the calendar year</p>
          </div>
          <span className="text-xs text-zinc-400 font-medium">17 completed tasks</span>
        </div>
        
        {/* Scrollable Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-[3px] min-w-[700px] select-none">
            {heatmapDays.map((day) => {
              const bgClass =
                day.level === 1
                  ? 'bg-indigo-950 border border-indigo-900/30'
                  : day.level === 2
                  ? 'bg-indigo-800'
                  : day.level === 3
                  ? 'bg-indigo-600'
                  : day.level === 4
                  ? 'bg-indigo-400'
                  : 'bg-zinc-900';
              return (
                <div
                  key={day.day}
                  className={`w-[10px] h-[10px] rounded-[1px] transition-all hover:scale-125 ${bgClass}`}
                  title={`Day ${day.day}: Level ${day.level}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[10px] text-zinc-500">
          <span>Less</span>
          <div className="w-[10px] h-[10px] rounded-[1px] bg-zinc-900" />
          <div className="w-[10px] h-[10px] rounded-[1px] bg-indigo-950 border border-indigo-900/30" />
          <div className="w-[10px] h-[10px] rounded-[1px] bg-indigo-800" />
          <div className="w-[10px] h-[10px] rounded-[1px] bg-indigo-600" />
          <div className="w-[10px] h-[10px] rounded-[1px] bg-indigo-400" />
          <span>More</span>
        </div>
      </div>

      {/* Splitted panels (Activity Chart & Revision Reminders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Activity Line Chart */}
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-400" />
            <span>Weekly Progress Chart</span>
          </h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="problems" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorProblems)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revision Queue */}
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw size={16} className="text-amber-500" />
              <span>Revision Reminders</span>
            </h2>
            
            {revisionList.length > 0 ? (
              <div className="space-y-3">
                {revisionList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-200 truncate">{item.questions.name}</p>
                      <p className="text-xs text-zinc-500">
                        Revised {item.revision_count} times • Last revised {new Date(item.last_revision_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/ide/${item.questions.slug}`}>
                      <button className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white px-2.5 py-1.5 rounded transition-all cursor-pointer">
                        <span>Recode</span>
                        <ChevronRight size={10} />
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm">
                No questions pending revision. Excellent work!
              </div>
            )}
          </div>
          
          {/* Quick link */}
          <Link href="/dsa" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-4">
            <span>View complete Revision Tracker</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Reading Progress summary panel */}
      {recentRead.length > 0 && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen size={16} className="text-blue-400" />
            <span>Continue Reading</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentRead.map((item) => (
              <Link href={`/library/${item.articles.slug}`} key={item.id}>
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-indigo-500/40 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-zinc-500">{item.articles.reading_time} min read</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {item.progress_percentage}% completed
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                    {item.articles.title}
                  </h3>
                  <div className="mt-3 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${item.progress_percentage}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
