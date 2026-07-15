'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Star,
  Video,
  Play,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Seed topics list
const STATIC_TOPICS = [
  { id: 'a1111111-1111-1111-1111-111111111111', slug: 'arrays', name: 'Arrays', category: 'Data Structures' },
  { id: 'b2222222-2222-2222-2222-222222222222', slug: 'strings', name: 'Strings', category: 'Data Structures' },
  { id: 'c3333333-3333-3333-3333-333333333333', slug: 'linked-list', name: 'Linked List', category: 'Data Structures' },
  { id: 'd4444444-4444-4444-4444-444444444444', slug: 'stack', name: 'Stack', category: 'Data Structures' },
  { id: 'e5555555-5555-5555-5555-555555555555', slug: 'queue', name: 'Queue', category: 'Data Structures' },
  { id: 'f6666666-6666-6666-6666-666666666666', slug: 'hashing', name: 'Hashing', category: 'Data Structures' },
  { id: '77777777-7777-7777-7777-777777777777', slug: 'trees', name: 'Trees', category: 'Data Structures' },
  { id: '88888888-8888-8888-8888-888888888888', slug: 'bst', name: 'BST', category: 'Data Structures' },
  { id: '99999999-9999-9999-9999-999999999999', slug: 'heap', name: 'Heap', category: 'Data Structures' },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', slug: 'trie', name: 'Trie', category: 'Data Structures' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', slug: 'graph', name: 'Graph', category: 'Data Structures' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', slug: 'dynamic-programming', name: 'Dynamic Programming', category: 'Algorithms' },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', slug: 'greedy', name: 'Greedy', category: 'Algorithms' },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', slug: 'backtracking', name: 'Backtracking', category: 'Algorithms' },
  { id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', slug: 'binary-search', name: 'Binary Search', category: 'Algorithms' },
  { id: 'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', slug: 'sliding-window', name: 'Sliding Window', category: 'Algorithms' },
  { id: '0f0f0f0f-0f0f-0f0f-0f0f-0f0f0f0f0f0f', slug: 'two-pointer', name: 'Two Pointer', category: 'Algorithms' },
  { id: '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', slug: 'prefix-sum', name: 'Prefix Sum', category: 'Algorithms' },
  { id: '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', slug: 'segment-tree', name: 'Segment Tree', category: 'Advanced Techniques' },
  { id: '3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', slug: 'fenwick-tree', name: 'Fenwick Tree', category: 'Advanced Techniques' },
  { id: '4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4d', slug: 'union-find', name: 'Union Find', category: 'Advanced Techniques' },
  { id: '5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e', slug: 'bit-manipulation', name: 'Bit Manipulation', category: 'Advanced Techniques' },
  { id: '6f6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f6f', slug: 'math', name: 'Math', category: 'Advanced Techniques' },
  { id: '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a7a', slug: 'monotonic-stack', name: 'Monotonic Stack', category: 'Advanced Techniques' },
  { id: '8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b', slug: 'intervals', name: 'Intervals', category: 'Advanced Techniques' }
];

// Seed questions list
const STATIC_QUESTIONS = [
  {
    id: 'q1',
    topic_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'EASY',
    companies: ['Google', 'Amazon', 'Facebook', 'Apple'],
    frequency: 1.0,
    leetcode_url: 'https://leetcode.com/problems/two-sum/',
    video_url: 'https://www.youtube.com/watch?v=KLlXCFG5Tk0',
    estimated_time: 15
  },
  {
    id: 'q2',
    topic_id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'EASY',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    frequency: 0.9,
    leetcode_url: 'https://leetcode.com/problems/reverse-linked-list/',
    video_url: 'https://www.youtube.com/watch?v=G0_I-ZF0S38',
    estimated_time: 15
  },
  {
    id: 'q3',
    topic_id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'EASY',
    companies: ['Google', 'Bloomberg', 'Netflix'],
    frequency: 0.85,
    leetcode_url: 'https://leetcode.com/problems/valid-parentheses/',
    video_url: 'https://www.youtube.com/watch?v=WTzjTskDFMg',
    estimated_time: 15
  },
  {
    id: 'q4',
    topic_id: 'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0',
    name: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'MEDIUM',
    companies: ['Amazon', 'Google', 'Uber'],
    frequency: 0.95,
    leetcode_url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    video_url: 'https://www.youtube.com/watch?v=wiGpG14cmac',
    estimated_time: 30
  },
  {
    id: 'q5',
    topic_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'MEDIUM',
    companies: ['Google', 'Amazon', 'Microsoft', 'Bloomberg'],
    frequency: 0.95,
    leetcode_url: 'https://leetcode.com/problems/number-of-islands/',
    video_url: 'https://www.youtube.com/watch?v=pV2kpPD66PE',
    estimated_time: 35
  }
];

export default function DSATrackerPage() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const [topics, setTopics] = useState<any[]>(STATIC_TOPICS);
  const [questions, setQuestions] = useState<any[]>(STATIC_QUESTIONS);
  const [userProgress, setUserProgress] = useState<Record<string, { completed: boolean; favorite: boolean }>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'a1111111-1111-1111-1111-111111111111': true, // expand Arrays by default
  });

  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');
  const [, startTransition] = useTransition();

  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  // Load from DB or Demo Storage
  useEffect(() => {
    const loadDSAData = async () => {
      if (isDemo) {
        // Load demo progress from localStorage
        const stored = localStorage.getItem('nex_dsa_progress');
        if (stored) {
          setUserProgress(JSON.parse(stored));
        }
        return;
      }

      const supabase = createClient();
      try {
        // Load real topics & questions
        const { data: topicsData } = await supabase.from('topics').select('*').order('order_index');
        const { data: questionsData } = await supabase.from('questions').select('*').order('frequency', { ascending: false });
        
        if (topicsData && topicsData.length > 0) setTopics(topicsData);
        if (questionsData && questionsData.length > 0) setQuestions(questionsData);

        // Load user progress
        const { data: progressData } = await supabase
          .from('progress')
          .select('question_id, completed, favorite')
          .eq('user_id', profile?.id);

        if (progressData) {
          const progMap: Record<string, { completed: boolean; favorite: boolean }> = {};
          progressData.forEach((p) => {
            progMap[p.question_id] = { completed: p.completed, favorite: p.favorite };
          });
          setUserProgress(progMap);
        }
      } catch (err) {
        console.error('Failed to load DSA info from Supabase:', err);
      }
    };

    loadDSAData();
  }, [profile, isDemo]);

  // Toggle Completion
  const toggleComplete = async (questionId: string) => {
    const current = userProgress[questionId] || { completed: false, favorite: false };
    const nextCompleted = !current.completed;
    const nextState = { ...current, completed: nextCompleted };
    
    // UI update optimistic
    const updatedProg = { ...userProgress, [questionId]: nextState };
    setUserProgress(updatedProg);

    if (isDemo) {
      localStorage.setItem('nex_dsa_progress', JSON.stringify(updatedProg));
      return;
    }

    const supabase = createClient();
    try {
      await supabase.from('progress').upsert({
        user_id: profile?.id,
        question_id: questionId,
        completed: nextCompleted,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,question_id' });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (questionId: string) => {
    const current = userProgress[questionId] || { completed: false, favorite: false };
    const nextFavorite = !current.favorite;
    const nextState = { ...current, favorite: nextFavorite };

    const updatedProg = { ...userProgress, [questionId]: nextState };
    setUserProgress(updatedProg);

    if (isDemo) {
      localStorage.setItem('nex_dsa_progress', JSON.stringify(updatedProg));
      return;
    }

    const supabase = createClient();
    try {
      await supabase.from('progress').upsert({
        user_id: profile?.id,
        question_id: questionId,
        favorite: nextFavorite,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,question_id' });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle expanded state
  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // Extract all distinct companies for filter dropdown
  const allCompanies = Array.from(
    new Set(questions.flatMap((q) => q.companies || []))
  );

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.name.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesCompany = companyFilter === 'ALL' || q.companies?.includes(companyFilter);
    return matchesSearch && matchesDiff && matchesCompany;
  });

  // Pick random unsolved question
  const pickRandomUnsolved = () => {
    const unsolved = filteredQuestions.filter((q) => !userProgress[q.id]?.completed);
    const pool = unsolved.length > 0 ? unsolved : filteredQuestions;
    if (pool.length === 0) return;
    const randomQuestion = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/ide/${randomQuestion.slug}`);
  };

  const solvedCount = Object.values(userProgress).filter((p) => p.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="text-indigo-500 w-6 h-6" />
            <span>DSA Mastery Tracker</span>
          </h1>
          <p className="text-sm text-zinc-500">Track solved problems, set revision flags, and verify company weights.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={pickRandomUnsolved}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Pick Random Question</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Overall Solved</p>
          <p className="text-2xl font-extrabold text-white mt-1">
            {solvedCount} / {questions.length}
          </p>
          <div className="h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(solvedCount / (questions.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Easy Solved</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">
            {questions.filter((q) => q.difficulty === 'EASY' && userProgress[q.id]?.completed).length} /{' '}
            {questions.filter((q) => q.difficulty === 'EASY').length}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Medium / Hard Solved</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {questions.filter((q) => q.difficulty !== 'EASY' && userProgress[q.id]?.completed).length} /{' '}
            {questions.filter((q) => q.difficulty !== 'EASY').length}
          </p>
        </div>
      </div>

      {/* Filtering Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search questions by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Difficulty filter */}
        <div className="relative">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-400 outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-550 pointer-events-none" />
        </div>

        {/* Company filter */}
        <div className="relative">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-400 outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="ALL">All Companies</option>
            {allCompanies.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-550 pointer-events-none" />
        </div>
      </div>

      {/* Accordion Topics List */}
      <div className="space-y-3">
        {topics.map((topic) => {
          // Find questions mapping to current topic
          const topicQuestions = filteredQuestions.filter((q) => q.topic_id === topic.id);
          const totalInTopic = questions.filter((q) => q.topic_id === topic.id).length;
          const completedInTopic = questions.filter(
            (q) => q.topic_id === topic.id && userProgress[q.id]?.completed
          ).length;

          // If filtering questions and there are none matching this topic, we skip rendering it
          if (topicQuestions.length === 0 && (search || difficultyFilter !== 'ALL' || companyFilter !== 'ALL')) {
            return null;
          }

          const isExpanded = expandedTopics[topic.id] || false;

          return (
            <div
              key={topic.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 overflow-hidden"
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleExpand(topic.id)}
                className="flex items-center justify-between p-4 bg-zinc-900/60 cursor-pointer hover:bg-zinc-900 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-zinc-200">{topic.name}</span>
                  <span className="text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                    {topic.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  {/* Topic Completion Stats */}
                  <span className="text-zinc-400 font-semibold">
                    {completedInTopic} / {totalInTopic} Solved
                  </span>

                  {isExpanded ? (
                    <ChevronUp size={16} className="text-zinc-500" />
                  ) : (
                    <ChevronDown size={16} className="text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Accordion Body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-850 bg-zinc-950/20"
                  >
                    <div className="divide-y divide-zinc-850/60 p-1">
                      {topicQuestions.length > 0 ? (
                        topicQuestions.map((q) => {
                          const prog = userProgress[q.id] || { completed: false, favorite: false };
                          return (
                            <div
                              key={q.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 hover:bg-zinc-900/40 rounded-lg group transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Completed Action check */}
                                <button
                                  onClick={() => toggleComplete(q.id)}
                                  className={`flex-shrink-0 cursor-pointer transition-colors ${
                                    prog.completed ? 'text-indigo-500' : 'text-zinc-700 hover:text-zinc-500'
                                  }`}
                                >
                                  <CheckCircle2 size={18} className={prog.completed ? 'fill-indigo-500/10' : ''} />
                                </button>

                                {/* Name & URL parameters */}
                                <Link
                                  href={`/ide/${q.slug}`}
                                  className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors truncate"
                                >
                                  {q.name}
                                </Link>

                                {/* Difficulty Badge */}
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                                    q.difficulty === 'EASY'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : q.difficulty === 'MEDIUM'
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  }`}
                                >
                                  {q.difficulty}
                                </span>
                              </div>

                              {/* Right column details */}
                              <div className="flex items-center gap-4 text-xs text-zinc-550 justify-between sm:justify-end">
                                {/* Companies list */}
                                {q.companies && q.companies.length > 0 && (
                                  <div className="hidden lg:flex items-center gap-1">
                                    <Tag size={10} className="text-zinc-650" />
                                    <span className="text-[10px] text-zinc-500 max-w-[150px] truncate" title={q.companies.join(', ')}>
                                      {q.companies.slice(0, 2).join(', ')}
                                      {q.companies.length > 2 && '...'}
                                    </span>
                                  </div>
                                )}

                                {/* Estimated Time */}
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                  <Clock size={10} />
                                  <span>{q.estimated_time}m</span>
                                </div>

                                {/* External Video tutorials link */}
                                {q.video_url && (
                                  <a
                                    href={q.video_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
                                    title="Watch LeetCode video walkthrough"
                                  >
                                    <Video size={14} />
                                  </a>
                                )}

                                <div className="flex items-center gap-2">
                                  {/* Bookmark toggler */}
                                  <button
                                    onClick={() => toggleFavorite(q.id)}
                                    className={`p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer ${
                                      prog.favorite ? 'text-amber-500' : 'text-zinc-700 hover:text-zinc-500'
                                    }`}
                                  >
                                    <Star size={14} className={prog.favorite ? 'fill-amber-500/10' : ''} />
                                  </button>

                                  {/* Run code trigger */}
                                  <Link href={`/ide/${q.slug}`}>
                                    <button className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold bg-zinc-900 border border-zinc-850 hover:bg-indigo-600 hover:text-white px-2.5 py-1.5 rounded transition-all cursor-pointer">
                                      <Play size={8} />
                                      <span>Code</span>
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-zinc-550 text-xs">
                          No matching problems in this topic.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
