import { createClient } from '@/lib/supabase/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ReadingProgressBar, ArticleActions } from '@/components/library/article-client';
import { Clock, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Static seed articles backup
const STATIC_ARTICLES_MARKDOWN: Record<string, any> = {
  'demystifying-rate-limiters': {
    id: 'a1',
    slug: 'demystifying-rate-limiters',
    title: 'Demystifying Rate Limiters: Token Bucket vs Leaky Bucket',
    description: 'Deep dive into the architecture and mathematics behind API rate limiters. We compare Token Bucket, Leaky Bucket, and Sliding Window Log algorithms with code.',
    reading_time: 10,
    cover_url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop',
    published_at: new Date().toISOString(),
    likes_count: 24,
    content: `# Demystifying Rate Limiters

Rate limiting is a critical component of any public API. It protects your infrastructure from starvation, brute-force attacks, and DDoS attempts. In this post, we will walk through the core algorithms.

## 1. Token Bucket Algorithm

The **Token Bucket** algorithm is widely used because it is intuitive and allows for bursts of traffic.

### How it Works:
- A bucket is filled with tokens at a constant rate $r$ tokens/sec up to capacity $C$.
- Each request consumes 1 token.
- If tokens are available, the request is processed; otherwise, it is dropped or delayed.

\`\`\`python
import time

class TokenBucket:
    def __init__(self, capacity: int, fill_rate: float):
        self.capacity = capacity
        self.fill_rate = fill_rate
        self.tokens = capacity
        self.last_update = time.time()

    def allow_request(self) -> bool:
        now = time.time()
        elapsed = now - self.last_update
        self.last_update = now
        
        # Add new tokens
        self.tokens = min(self.capacity, self.tokens + elapsed * self.fill_rate)
        
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
\`\`\`

## 2. Leaky Bucket Algorithm

Unlike Token Bucket, the **Leaky Bucket** algorithm enforces a strict, smooth egress rate.

### How it Works:
- Requests flow into a queue (the bucket).
- If the queue exceeds capacity, incoming requests are rejected immediately.
- Requests are processed (leaked) at a constant rate.

---

Stay tuned for our next article on Distributed Rate Limiting using Redis!`
  },
  'understanding-consistent-hashing': {
    id: 'a2',
    slug: 'understanding-consistent-hashing',
    title: 'Understanding Consistent Hashing in Distributed Systems',
    description: 'How to scale cache nodes and databases without reshuffling the entire keyspace. Learn how consistent hashing works visually with virtual nodes.',
    reading_time: 8,
    cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    published_at: new Date().toISOString(),
    likes_count: 18,
    content: `# Understanding Consistent Hashing

When building distributed caches or databases, we need a way to distribute keys across multiple nodes.

## The Problem with Simple Hashing

If we have $N$ cache nodes, the simplest way to map a key to a node is:
$$\\text{node\\_index} = \\text{hash}(key) \\pmod N$$

However, when $N$ changes (a node crashes or a new node is added), almost all keys map to different nodes. This triggers a **cache storm**, thrashing the backend.

## The Solution: Consistent Hashing

Consistent hashing maps both **keys** and **nodes** onto a circular ring (often called the hash ring).

### Steps:
1. Hash the server IP/Name and place it on the ring.
2. Hash the key to find its position on the ring.
3. Move clockwise from the key's position until you hit a server node. That server handles the key.

### Virtual Nodes (VNodes)
To avoid hotspots (skewed distribution), we map each physical server to multiple **virtual nodes** on the ring.`
  }
};

// Custom MDX styling components mapper
const mdxComponents = {
  h1: (props: any) => <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight border-b border-zinc-800 pb-2" {...props} />,
  h2: (props: any) => <h2 className="text-xl font-bold text-white mt-6 mb-3 tracking-tight" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-bold text-zinc-200 mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="text-sm text-zinc-400 leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside space-y-2 mb-4 text-sm text-zinc-400 pl-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside space-y-2 mb-4 text-sm text-zinc-400 pl-4" {...props} />,
  li: (props: any) => <li className="text-zinc-400" {...props} />,
  code: (props: any) => <code className="bg-zinc-900 border border-zinc-800 text-indigo-400 rounded px-1.5 py-0.5 text-xs font-mono" {...props} />,
  pre: (props: any) => <pre className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 overflow-x-auto my-6 font-mono text-xs text-zinc-300 shadow-inner" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-indigo-500 bg-indigo-500/5 px-4 py-2 rounded-r-lg my-4 text-zinc-300 italic" {...props} />,
};

interface PageProps {
  params: Promise<{
    articleSlug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { articleSlug } = await params;
  
  let article = STATIC_ARTICLES_MARKDOWN[articleSlug] || null;
  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  if (!isDemo) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', articleSlug)
        .single();
      
      if (data) {
        article = data;
      }
    } catch (err) {
      console.log('Failed to fetch article from Supabase, loading fallback', err);
    }
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-zinc-500" />
        <h1 className="text-xl font-bold text-white">Article Not Found</h1>
        <p className="text-zinc-400 text-sm max-w-sm">
          We could not locate this article slug. Please verify the URL.
        </p>
        <Link href="/library" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 animate-in fade-in duration-300 relative">
      {/* Scroll reader pointer */}
      <ReadingProgressBar />

      {/* Floating back button */}
      <div className="mb-6">
        <Link href="/library" className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider">
          &larr; Back to Library
        </Link>
      </div>

      <article className="space-y-6">
        {/* Title & Metadata */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              <span>{article.reading_time} min read</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Cover Photo */}
        {article.cover_url && (
          <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
            <img src={article.cover_url} alt={article.title} className="w-full h-full object-cover opacity-90" />
          </div>
        )}

        {/* Interactive Bottom Actions */}
        <ArticleActions articleId={article.id} articleSlug={article.slug} initialLikes={article.likes_count || 0} />

        {/* Rendered MDX Content */}
        <div className="pb-16 selection:bg-indigo-500 selection:text-white">
          <MDXRemote source={article.content} components={mdxComponents} />
        </div>
      </article>
    </div>
  );
}
