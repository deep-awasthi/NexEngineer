'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Library,
  PenTool,
  Plus,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const { profile } = useAuthStore();
  const [stats, setStats] = useState({
    users: 42,
    questions: 18,
    articles: 2,
    diagrams: 14
  });

  // Forms states
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleDesc, setArticleDesc] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCategory, setArticleCategory] = useState('11111111-aaaa-bbbb-cccc-000000000001');

  const [questionName, setQuestionName] = useState('');
  const [questionSlug, setQuestionSlug] = useState('');
  const [questionDiff, setQuestionDiff] = useState('EASY');
  const [questionTopic, setQuestionTopic] = useState('a1111111-1111-1111-1111-111111111111');
  const [questionTime, setQuestionTime] = useState(30);

  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  useEffect(() => {
    if (isDemo) return;

    const loadAdminStats = async () => {
      const supabase = createClient();
      try {
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: qCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });
        const { count: aCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
        const { count: dCount } = await supabase.from('diagrams').select('*', { count: 'exact', head: true });

        setStats({
          users: usersCount || 42,
          questions: qCount || 18,
          articles: aCount || 2,
          diagrams: dCount || 14
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadAdminStats();
  }, [isDemo]);

  // Handle article submit
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const newArticle = {
      slug: articleSlug,
      title: articleTitle,
      description: articleDesc,
      content: articleContent,
      reading_time: Math.ceil(articleContent.split(/\s+/).length / 200) || 5, // roughly 200 words per min
      published: true,
      published_at: new Date().toISOString(),
      category_id: articleCategory,
      author_id: profile?.id,
      likes_count: 0
    };

    if (isDemo) {
      setStatus('success');
      setStatusMsg('Demo Article created successfully! (Local state simulation only)');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    try {
      const { error } = await supabase.from('articles').insert(newArticle);
      if (error) {
        setStatus('error');
        setStatusMsg(error.message);
      } else {
        setStatus('success');
        setStatusMsg('Article published successfully!');
        setArticleTitle('');
        setArticleSlug('');
        setArticleDesc('');
        setArticleContent('');
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.message || 'Error occurred.');
    }
    setLoading(false);
  };

  // Handle question submit
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const newQuestion = {
      topic_id: questionTopic,
      name: questionName,
      slug: questionSlug,
      difficulty: questionDiff,
      estimated_time: questionTime,
      companies: ['Google', 'Facebook'],
      frequency: 0.5,
      default_code: {
        javascript: `function solve() {\n    // Write solution\n}`,
        python: `def solve():\n    pass`,
        cpp: `class Solution {\npublic:\n    void solve() {}\n};`,
        java: `class Solution {\n    public void solve() {}\n}`
      }
    };

    if (isDemo) {
      setStatus('success');
      setStatusMsg('Demo Question inserted successfully! (Local state simulation only)');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    try {
      const { error } = await supabase.from('questions').insert(newQuestion);
      if (error) {
        setStatus('error');
        setStatusMsg(error.message);
      } else {
        setStatus('success');
        setStatusMsg('Question inserted successfully!');
        setQuestionName('');
        setQuestionSlug('');
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.message || 'Error occurred.');
    }
    setLoading(false);
  };

  const isAdmin = profile?.badges?.includes('admin') || false;

  // Render check
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold text-white">Access Denied</h1>
        <p className="text-zinc-400 text-sm max-w-sm">
          You do not have administrative privileges to access this console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="text-red-500 w-6 h-6" />
          <span>Admin Control Console</span>
        </h1>
        <p className="text-sm text-zinc-500">Inject code challenges, publish engineering logs, and review system stats.</p>
      </div>

      {/* Grid of stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
          <Users className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total Users</p>
          <p className="text-xl font-extrabold text-white mt-1">{stats.users}</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
          <BookOpen className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">DSA Questions</p>
          <p className="text-xl font-extrabold text-white mt-1">{stats.questions}</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
          <Library className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Articles</p>
          <p className="text-xl font-extrabold text-white mt-1">{stats.articles}</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
          <PenTool className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Canvas Diagrams</p>
          <p className="text-xl font-extrabold text-white mt-1">{stats.diagrams}</p>
        </div>
      </div>

      {/* Feedback banner */}
      {status === 'success' && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{statusMsg}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Management panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Publish Article form */}
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Plus size={16} className="text-indigo-400" />
            <span>Publish New Article</span>
          </h2>

          <form onSubmit={handleCreateArticle} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Article Title</label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 outline-none"
                  placeholder="e.g. Scaling Database Clusters"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Slug Path</label>
                <input
                  type="text"
                  value={articleSlug}
                  onChange={(e) => setArticleSlug(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 outline-none"
                  placeholder="scaling-database-clusters"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">Category</label>
              <select
                value={articleCategory}
                onChange={(e) => setArticleCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-400 outline-none cursor-pointer"
              >
                <option value="11111111-aaaa-bbbb-cccc-000000000001">System Design</option>
                <option value="11111111-aaaa-bbbb-cccc-000000000002">DSA</option>
                <option value="11111111-aaaa-bbbb-cccc-000000000003">Databases</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">Short Description</label>
              <input
                type="text"
                value={articleDesc}
                onChange={(e) => setArticleDesc(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 outline-none"
                placeholder="A short summary detailing cache replication topologies."
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">Content (Markdown/MDX)</label>
              <textarea
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                className="w-full h-40 bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 outline-none font-mono resize-none"
                placeholder="# Heading 1\nType article paragraphs here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer transition-colors"
            >
              <Save size={12} />
              <span>Publish Post</span>
            </button>
          </form>
        </div>

        {/* Inject DSA Question form */}
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Plus size={16} className="text-indigo-400" />
            <span>Inject DSA Question</span>
          </h2>

          <form onSubmit={handleCreateQuestion} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Question Name</label>
                <input
                  type="text"
                  value={questionName}
                  onChange={(e) => setQuestionName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 outline-none"
                  placeholder="e.g. Binary Tree Maximum Path"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Slug Path</label>
                <input
                  type="text"
                  value={questionSlug}
                  onChange={(e) => setQuestionSlug(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 outline-none"
                  placeholder="binary-tree-max-path"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Difficulty</label>
                <select
                  value={questionDiff}
                  onChange={(e) => setQuestionDiff(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-400 outline-none cursor-pointer"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Topic Tag</label>
                <select
                  value={questionTopic}
                  onChange={(e) => setQuestionTopic(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-400 outline-none cursor-pointer"
                >
                  <option value="a1111111-1111-1111-1111-111111111111">Arrays</option>
                  <option value="77777777-7777-7777-7777-777777777777">Trees</option>
                  <option value="cccccccc-cccc-cccc-cccc-cccccccccccc">Dynamic Programming</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase">Estimated solving time (minutes)</label>
              <input
                type="number"
                value={questionTime}
                onChange={(e) => setQuestionTime(parseInt(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer transition-colors"
            >
              <Save size={12} />
              <span>Inject Question</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
