'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Bookmark, Share2, ArrowLeft, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

// 1. READING PROGRESS BAR
export function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight === 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-zinc-950 z-50">
      <div
        className="h-full bg-indigo-500 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// 2. ARTICLE ACTION TOOLBAR
interface ArticleActionsProps {
  articleId: string;
  articleSlug: string;
  initialLikes: number;
}

export function ArticleActions({ articleId, articleSlug, initialLikes }: ArticleActionsProps) {
  const router = useRouter();
  const { profile } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [shared, setShared] = useState(false);

  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  useEffect(() => {
    // Load local storage states in Demo
    if (isDemo) {
      const likes = localStorage.getItem('nex_library_likes');
      const bookmarks = localStorage.getItem('nex_library_bookmarks');
      if (likes) {
        setLiked(JSON.parse(likes)[articleId] || false);
      }
      if (bookmarks) {
        setBookmarked(JSON.parse(bookmarks)[articleSlug] || false);
      }
      return;
    }

    const fetchUserInteractions = async () => {
      const supabase = createClient();
      
      // Fetch liked state
      // (For this demo, likes state can be tracked via bookmarks/local profile metadata if no likes join table is created, or via bookmarks select)
      const { data: bookmarkedData } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', profile?.id)
        .eq('type', 'ARTICLE')
        .eq('target_id', articleSlug)
        .single();
      
      if (bookmarkedData) {
        setBookmarked(true);
      }
    };

    fetchUserInteractions();
  }, [profile, articleId, articleSlug, isDemo]);

  const handleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => prev + (nextLiked ? 1 : -1));

    if (isDemo) {
      const likes = localStorage.getItem('nex_library_likes') || '{}';
      const parsed = JSON.parse(likes);
      parsed[articleId] = nextLiked;
      localStorage.setItem('nex_library_likes', JSON.stringify(parsed));
      return;
    }

    const supabase = createClient();
    try {
      await supabase
        .from('articles')
        .update({ likes_count: likesCount + (nextLiked ? 1 : -1) })
        .eq('id', articleId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);

    if (isDemo) {
      const books = localStorage.getItem('nex_library_bookmarks') || '{}';
      const parsed = JSON.parse(books);
      parsed[articleSlug] = nextBookmarked;
      localStorage.setItem('nex_library_bookmarks', JSON.stringify(parsed));
      return;
    }

    const supabase = createClient();
    try {
      if (nextBookmarked) {
        await supabase.from('bookmarks').insert({
          user_id: profile?.id,
          type: 'ARTICLE',
          target_id: articleSlug,
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="flex items-center justify-between border-t border-b border-zinc-800 py-4 my-8">
      {/* Back to Library */}
      <button
        onClick={() => router.push('/library')}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer font-medium"
      >
        <ArrowLeft size={14} />
        <span>Back to Articles</span>
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            liked
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-500'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Heart size={14} className={liked ? 'fill-rose-500/10' : ''} />
          <span>{likesCount} Likes</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`flex items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
            bookmarked
              ? 'bg-amber-500/10 border-amber-500/25 text-amber-500'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title="Save to Library Bookmarks"
        >
          <Bookmark size={14} className={bookmarked ? 'fill-amber-500/10' : ''} />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
        >
          {shared ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
