'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, BookOpen, Library, PenTool, Code, AlertCircle } from 'lucide-react';
import Fuse from 'fuse.js';
import { createClient } from '@/lib/supabase/client';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'DSA Question' | 'Article' | 'Diagram' | 'Algorithm Visualizer';
  url: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [, startTransition] = useTransition();
  const router = useRouter();

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch searchable items index on load
  useEffect(() => {
    const fetchSearchIndex = async () => {
      const supabase = createClient();
      
      const index: SearchItem[] = [];

      // Add static paths (Visualizers)
      const visualizers = [
        { name: 'Bubble Sort', slug: 'bubble-sort' },
        { name: 'Merge Sort', slug: 'merge-sort' },
        { name: 'Binary Search', slug: 'binary-search' },
        { name: 'Linked List Operations', slug: 'linked-list' },
        { name: 'Graph DFS/BFS', slug: 'graphs' },
      ];
      visualizers.forEach(v => {
        index.push({
          id: `vis-${v.slug}`,
          title: v.name,
          subtitle: 'Interactive visualizer with animated steps',
          category: 'Algorithm Visualizer',
          url: `/dsa/${v.slug}`
        });
      });

      try {
        // Fetch Questions
        const { data: qData } = await supabase
          .from('questions')
          .select('id, name, slug, difficulty');
        if (qData) {
          qData.forEach((q) => {
            index.push({
              id: q.id,
              title: q.name,
              subtitle: `DSA Question • Difficulty: ${q.difficulty}`,
              category: 'DSA Question',
              url: `/ide/${q.slug}`,
            });
          });
        }

        // Fetch Articles
        const { data: aData } = await supabase
          .from('articles')
          .select('id, title, slug, description')
          .eq('published', true);
        if (aData) {
          aData.forEach((a) => {
            index.push({
              id: a.id,
              title: a.title,
              subtitle: a.description,
              category: 'Article',
              url: `/library/${a.slug}`,
            });
          });
        }

        // Fetch Diagrams
        const { data: dData } = await supabase
          .from('diagrams')
          .select('id, name, description');
        if (dData) {
          dData.forEach((d) => {
            index.push({
              id: d.id,
              title: d.name,
              subtitle: d.description || 'System Design Diagram',
              category: 'Diagram',
              url: `/studio/${d.id}`,
            });
          });
        }
      } catch (err) {
        console.error('Failed to pre-cache search indexes:', err);
      }

      setItems(index);
    };

    fetchSearchIndex();
  }, [isOpen]);

  // Execute fuzzy search using Fuse.js
  useEffect(() => {
    if (!query) {
      setResults(items.slice(0, 5)); // show first few default matches when empty
      return;
    }

    const fuse = new Fuse(items, {
      keys: ['title', 'subtitle', 'category'],
      threshold: 0.4,
    });

    startTransition(() => {
      const searchRes = fuse.search(query).map((res) => res.item);
      setResults(searchRes);
    });
  }, [query, items]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'DSA Question':
        return <Code className="text-emerald-500 w-4 h-4" />;
      case 'Article':
        return <Library className="text-blue-500 w-4 h-4" />;
      case 'Diagram':
        return <PenTool className="text-purple-500 w-4 h-4" />;
      case 'Algorithm Visualizer':
        return <BookOpen className="text-amber-500 w-4 h-4" />;
      default:
        return <AlertCircle className="text-zinc-500 w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Global Command Palette Trigger Button in Topbar will open this */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300" />
          <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50 text-zinc-100 animate-in fade-in duration-200">
            
            {/* Search Input Box */}
            <div className="flex items-center border-b border-zinc-800 px-4 py-3">
              <Search className="text-zinc-400 w-5 h-5 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search code challenges, articles, or diagrams..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-zinc-200 text-sm placeholder-zinc-500 focus:ring-0"
                autoFocus
              />
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 font-mono">
                ESC
              </span>
            </div>

            {/* Search Results list */}
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/80 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-950 border border-zinc-800/80 group-hover:border-zinc-700 transition-colors">
                      {getIcon(item.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-500 bg-zinc-950 border border-zinc-800/80 group-hover:text-zinc-400 group-hover:border-zinc-700 px-2 py-0.5 rounded font-medium transition-colors">
                      {item.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-zinc-500 text-sm">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-t border-zinc-800/60 text-[10px] text-zinc-500">
              <span>Use arrow keys to navigate</span>
              <span>Press enter to select</span>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Button widget trigger inside topbars */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800/60 hover:bg-zinc-800/50 hover:border-zinc-700 text-zinc-400 text-xs px-3 py-2 rounded-lg w-full max-w-sm transition-all text-left shadow-sm cursor-pointer"
      >
        <Search size={14} className="text-zinc-500" />
        <span className="flex-1">Search topics, articles, diagrams...</span>
        <span className="text-[10px] bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-500">
          ⌘K
        </span>
      </button>
    </>
  );
}
