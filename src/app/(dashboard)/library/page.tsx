'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Library,
  Search,
  BookOpen,
  Clock,
  Heart,
  Bookmark,
  Share2,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';

// Static categories fallback
const STATIC_CATEGORIES = [
  { id: 'cat-all', slug: 'all', name: 'All Categories' },
  { id: '11111111-aaaa-bbbb-cccc-000000000001', slug: 'system-design', name: 'System Design' },
  { id: '11111111-aaaa-bbbb-cccc-000000000002', slug: 'dsa', name: 'Data Structures & Algorithms' },
  { id: '11111111-aaaa-bbbb-cccc-000000000003', slug: 'databases', name: 'Databases' },
  { id: '11111111-aaaa-bbbb-cccc-000000000004', slug: 'microservices', name: 'Microservices' },
  { id: '11111111-aaaa-bbbb-cccc-000000000005', slug: 'devops', name: 'DevOps & Infrastructure' }
];

// Static articles fallback
const STATIC_ARTICLES = [
  {
    id: 'a1',
    slug: 'demystifying-rate-limiters',
    title: 'Demystifying Rate Limiters: Token Bucket vs Leaky Bucket',
    description: 'Deep dive into the architecture and mathematics behind API rate limiters. We compare Token Bucket, Leaky Bucket, and Sliding Window Log algorithms with code.',
    cover_url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop',
    reading_time: 10,
    likes_count: 24,
    published_at: new Date().toISOString(),
    category_id: '11111111-aaaa-bbbb-cccc-000000000001'
  },
  {
    id: 'a2',
    slug: 'understanding-consistent-hashing',
    title: 'Understanding Consistent Hashing in Distributed Systems',
    description: 'How to scale cache nodes and databases without reshuffling the entire keyspace. Learn how consistent hashing works visually with virtual nodes.',
    cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    reading_time: 8,
    likes_count: 18,
    published_at: new Date().toISOString(),
    category_id: '11111111-aaaa-bbbb-cccc-000000000001'
  }
];

export default function LibraryPage() {
  const { profile } = useAuthStore();
  const [categories, setCategories] = useState<any[]>(STATIC_CATEGORIES);
  const [articles, setArticles] = useState<any[]>(STATIC_ARTICLES);
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  useEffect(() => {
    const fetchLibraryData = async () => {
      if (isDemo) {
        // Load demo states from localStorage
        const bookmarks = localStorage.getItem('nex_library_bookmarks');
        const likes = localStorage.getItem('nex_library_likes');
        if (bookmarks) setUserBookmarks(JSON.parse(bookmarks));
        if (likes) setUserLikes(JSON.parse(likes));
        return;
      }

      const supabase = createClient();
      try {
        // Fetch published articles & categories
        const { data: catData } = await supabase.from('article_categories').select('*');
        const { data: artData } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (catData && catData.length > 0) {
          setCategories([{ id: 'cat-all', slug: 'all', name: 'All Categories' }, ...catData]);
        }
        if (artData && artData.length > 0) {
          setArticles(artData);
        }

        // Fetch bookmarks
        const { data: bookmarkData } = await supabase
          .from('bookmarks')
          .select('target_id')
          .eq('user_id', profile?.id)
          .eq('type', 'ARTICLE');
        if (bookmarkData) {
          const bMap: Record<string, boolean> = {};
          bookmarkData.forEach((b) => {
            bMap[b.target_id] = true;
          });
          setUserBookmarks(bMap);
        }
      } catch (err) {
        console.error('Failed to load library database elements:', err);
      }
    };

    fetchLibraryData();
  }, [profile, isDemo]);

  // Handle bookmark trigger
  const handleBookmarkToggle = async (e: React.MouseEvent, articleSlug: string) => {
    e.preventDefault();
    e.stopPropagation();

    const nextBookmarked = !userBookmarks[articleSlug];
    const updatedBooks = { ...userBookmarks, [articleSlug]: nextBookmarked };
    setUserBookmarks(updatedBooks);

    if (isDemo) {
      localStorage.setItem('nex_library_bookmarks', JSON.stringify(updatedBooks));
      return;
    }

    const supabase = createClient();
    try {
      if (nextBookmarked) {
        await supabase.from('bookmarks').insert({
          user_id: profile?.id,
          type: 'ARTICLE',
          target_id: articleSlug
        });
      } else {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', profile?.id)
          .eq('type', 'ARTICLE')
          .eq('target_id', articleSlug);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Like trigger
  const handleLikeToggle = async (e: React.MouseEvent, articleId: string, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const nextLiked = !userLikes[articleId];
    const updatedLikes = { ...userLikes, [articleId]: nextLiked };
    setUserLikes(updatedLikes);

    // Optimistic counts
    const updatedArticles = [...articles];
    updatedArticles[index].likes_count = (updatedArticles[index].likes_count || 0) + (nextLiked ? 1 : -1);
    setArticles(updatedArticles);

    if (isDemo) {
      localStorage.setItem('nex_library_likes', JSON.stringify(updatedLikes));
      return;
    }

    const supabase = createClient();
    try {
      // Run RPC or standard increment update
      await supabase
        .from('articles')
        .update({ likes_count: updatedArticles[index].likes_count })
        .eq('id', articleId);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter articles
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'all' || art.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Library className="text-indigo-500 w-6 h-6" />
            <span>Engineering Library</span>
          </h1>
          <p className="text-sm text-zinc-500">Read core concepts written by engineers for engineers. Deep dive on architecture.</p>
        </div>
      </div>

      {/* Category selector row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-900">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug === 'all' ? 'all' : cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              (selectedCategory === 'all' && cat.slug === 'all') || selectedCategory === cat.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search and stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search articles by title or description keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex justify-end text-xs text-zinc-500 font-semibold px-1">
          Showing {filteredArticles.length} of {articles.length} posts
        </div>
      </div>

      {/* Articles Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((art, index) => (
            <Link key={art.id} href={`/library/${art.slug}`} className="group block cursor-pointer">
              <article className="flex flex-col h-full rounded-2xl bg-zinc-900/40 border border-zinc-800 overflow-hidden hover:border-indigo-500/30 transition-all hover:translate-y-[-2px] relative duration-300">
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                  {art.cover_url ? (
                    <img
                      src={art.cover_url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                      <BookOpen size={48} />
                    </div>
                  )}
                  {/* Category marker overlay */}
                  <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider bg-zinc-900/90 border border-zinc-800 text-zinc-400 px-2 py-1 rounded">
                    {STATIC_CATEGORIES.find((c) => c.id === art.category_id)?.name || 'Category'}
                  </span>
                </div>

                {/* Article Info details */}
                <div className="flex-1 p-6 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                      <Clock size={11} />
                      <span>{art.reading_time} min read</span>
                      <span>•</span>
                      <span>{new Date(art.published_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-base font-bold text-zinc-200 group-hover:text-white group-hover:underline decoration-indigo-500/60 decoration-2 underline-offset-4 transition-colors leading-snug">
                      {art.title}
                    </h2>
                    <p className="text-xs text-zinc-450 leading-relaxed line-clamp-3">
                      {art.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-850/60 pt-4 mt-2">
                    <div className="flex items-center gap-3">
                      {/* Likes triggers */}
                      <button
                        onClick={(e) => handleLikeToggle(e, art.id, index)}
                        className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                          userLikes[art.id] ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-400'
                        }`}
                      >
                        <Heart size={14} className={userLikes[art.id] ? 'fill-rose-500/10' : ''} />
                        <span>{art.likes_count || 0}</span>
                      </button>

                      {/* Bookmark triggers */}
                      <button
                        onClick={(e) => handleBookmarkToggle(e, art.slug)}
                        className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors ${
                          userBookmarks[art.slug] ? 'text-amber-500' : 'text-zinc-500 hover:text-amber-400'
                        }`}
                      >
                        <Bookmark size={14} className={userBookmarks[art.slug] ? 'fill-amber-500/10' : ''} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors uppercase tracking-wider text-[10px]">
                      <span>Read Article</span>
                      <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="md:col-span-2 text-center py-16 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
            No articles found matching &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
