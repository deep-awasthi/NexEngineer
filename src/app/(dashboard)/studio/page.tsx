'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import {
  PenTool,
  Plus,
  Layers,
  Clock,
  Trash2,
  ChevronRight,
  GitCommit,
  LayoutTemplate
} from 'lucide-react';

const STATIC_DIAGRAMS = [
  {
    id: 'd1111111-2222-3333-4444-555555555551',
    name: '3-Tier Web Application Architecture',
    description: 'Nginx Load Balancer, Next.js Server Nodes, Redis Cache, and PostgreSQL replica databases.',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'd1111111-2222-3333-4444-555555555552',
    name: 'Event-Driven Message Bus Integration',
    description: 'Producer microservices feeding logs and analytics events into Kafka partitions with consumers logging to BigQuery.',
    updated_at: new Date().toISOString(),
  }
];

export default function StudioListPage() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const [diagrams, setDiagrams] = useState<any[]>(STATIC_DIAGRAMS);
  
  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  useEffect(() => {
    const fetchDiagrams = async () => {
      if (isDemo) {
        const stored = localStorage.getItem('nex_saved_diagrams');
        if (stored) {
          setDiagrams(JSON.parse(stored));
        }
        return;
      }

      const supabase = createClient();
      try {
        const { data } = await supabase
          .from('diagrams')
          .select('*')
          .eq('user_id', profile?.id)
          .order('updated_at', { ascending: false });
        if (data && data.length > 0) {
          setDiagrams(data);
        }
      } catch (err) {
        console.error('Failed to load diagrams from Supabase database:', err);
      }
    };

    fetchDiagrams();
  }, [profile, isDemo]);

  // Create a new diagram
  const handleCreateDiagram = async (templateType?: 'blank' | '3tier' | 'event') => {
    const id = crypto.randomUUID();
    const newDiagram = {
      id,
      name: templateType === '3tier' 
        ? '3-Tier App Topology' 
        : templateType === 'event' 
        ? 'Event Pipeline Diagram'
        : 'Untitled System Diagram',
      description: templateType === '3tier'
        ? 'Preloaded Load Balancer, App server, Cache and DB cluster.'
        : templateType === 'event'
        ? 'Preloaded Kafka cluster with Producers and Consumer pipelines.'
        : 'Blank canvas for drawing system designs.',
      user_id: profile?.id || 'demo-user',
      updated_at: new Date().toISOString(),
    };

    // Preloaded node structures based on templates
    let content: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] };
    if (templateType === '3tier') {
      content = {
        nodes: [
          { id: '1', type: 'loadBalancer', position: { x: 250, y: 50 }, data: { label: 'Nginx Proxy', activeConns: '320', balancingAlgo: 'Round Robin' } },
          { id: '2', type: 'server', position: { x: 150, y: 180 }, data: { label: 'Web Server A', runtime: 'Next.js App', cpuLoad: '8%' } },
          { id: '3', type: 'server', position: { x: 350, y: 180 }, data: { label: 'Web Server B', runtime: 'Next.js App', cpuLoad: '14%' } },
          { id: '4', type: 'cache', position: { x: 150, y: 310 }, data: { label: 'Redis Cluster', hitRate: '96%', memory: '1.2 GB' } },
          { id: '5', type: 'database', position: { x: 350, y: 310 }, data: { label: 'Postgres DB', dbType: 'Postgres', ip: '10.0.12.8' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e1-3', source: '1', target: '3', animated: true },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-5', source: '3', target: '5', animated: true },
        ],
      };
    } else if (templateType === 'event') {
      content = {
        nodes: [
          { id: '1', type: 'server', position: { x: 50, y: 150 }, data: { label: 'Producer A', runtime: 'Go Microservice', cpuLoad: '4%' } },
          { id: '2', type: 'queue', position: { x: 250, y: 150 }, data: { label: 'Kafka Broker', topicsCount: '8 partitions', lag: '0.2 ms' } },
          { id: '3', type: 'server', position: { x: 480, y: 150 }, data: { label: 'Consumer Backend', runtime: 'Node Worker', cpuLoad: '42%' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
          { id: 'e2-3', source: '2', target: '3', animated: true },
        ],
      };
    }

    const updated = [newDiagram, ...diagrams];
    setDiagrams(updated);

    if (isDemo) {
      localStorage.setItem('nex_saved_diagrams', JSON.stringify(updated));
      localStorage.setItem(`nex_diagram_flow_${id}`, JSON.stringify(content));
      router.push(`/studio/${id}`);
      return;
    }

    const supabase = createClient();
    try {
      await supabase.from('diagrams').insert(newDiagram);
      await supabase.from('diagram_versions').insert({
        diagram_id: id,
        content
      });
      router.push(`/studio/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete diagram
  const handleDeleteDiagram = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = diagrams.filter((d) => d.id !== id);
    setDiagrams(updated);

    if (isDemo) {
      localStorage.setItem('nex_saved_diagrams', JSON.stringify(updated));
      localStorage.removeItem(`nex_diagram_flow_${id}`);
      return;
    }

    const supabase = createClient();
    try {
      await supabase.from('diagrams').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PenTool className="text-indigo-500 w-6 h-6" />
            <span>System Design Studio</span>
          </h1>
          <p className="text-sm text-zinc-500">Design microservices, API meshes, databases, load balancers, and network diagrams.</p>
        </div>
        <button
          onClick={() => handleCreateDiagram('blank')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>New Blank Diagram</span>
        </button>
      </div>

      {/* Quickstart template list */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <LayoutTemplate size={14} className="text-zinc-500" />
          <span>Select Architecture Templates</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => handleCreateDiagram('3tier')}
            className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                Web Topology
              </span>
            </div>
            <h4 className="text-xs font-bold text-zinc-200 mt-2 group-hover:text-white">3-Tier Web Application</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              Deploys Nginx Proxy, 2x Next.js API servers, Redis storage, and PostgreSQL databases.
            </p>
          </div>

          <div
            onClick={() => handleCreateDiagram('event')}
            className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
                Event-Driven
              </span>
            </div>
            <h4 className="text-xs font-bold text-zinc-200 mt-2 group-hover:text-white">Kafka Message Pipelines</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              Sets up Kafka broker linked between Go producers and Node processing consumer loops.
            </p>
          </div>
        </div>
      </div>

      {/* Saved Diagrams Table/Cards list */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layers size={14} className="text-zinc-500" />
          <span>My Saved Architectures</span>
        </h3>

        {diagrams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diagrams.map((d) => (
              <Link key={d.id} href={`/studio/${d.id}`} className="group cursor-pointer block">
                <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-700 transition-colors flex flex-col justify-between h-40">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white leading-normal truncate max-w-[200px]">
                        {d.name}
                      </span>
                      <button
                        onClick={(e) => handleDeleteDiagram(e, d.id)}
                        className="p-1 rounded text-zinc-650 hover:text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                        title="Delete Diagram"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal line-clamp-2">
                      {d.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-850/60 pt-3 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>Updated {new Date(d.updated_at).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-indigo-400 group-hover:text-indigo-300 font-semibold uppercase tracking-wider text-[9px]">
                      <span>Open Canvas</span>
                      <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
            No system diagrams saved. Create one to start designing architecture!
          </div>
        )}
      </div>
    </div>
  );
}
