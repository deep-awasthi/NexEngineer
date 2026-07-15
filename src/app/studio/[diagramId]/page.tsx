'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Connection,
  Edge,
  Node,
  useReactFlow,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  ServerNode,
  DatabaseNode,
  CacheNode,
  QueueNode,
  LoadBalancerNode
} from '@/components/studio/custom-nodes';

import {
  ArrowLeft,
  Save,
  Download,
  Undo,
  Redo,
  Database,
  Server,
  Cpu,
  Layers,
  GitCommit,
  Trash2,
  Edit3,
  HelpCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

// Register custom node renderers
const nodeTypes = {
  database: DatabaseNode,
  server: ServerNode,
  cache: CacheNode,
  queue: QueueNode,
  loadBalancer: LoadBalancerNode
};

interface PageProps {
  params: Promise<{
    diagramId: string;
  }>;
}

function CanvasEditor({ diagramId }: { diagramId: string }) {
  const router = useRouter();
  const { profile } = useAuthStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [diagramName, setDiagramName] = useState('Loading Diagram...');

  // Undo / Redo histories stacks
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  // Load canvas details
  useEffect(() => {
    const loadDiagramContent = async () => {
      // 1. Load details in Demo Mode
      if (isDemo) {
        const list = localStorage.getItem('nex_saved_diagrams');
        if (list) {
          const matched = JSON.parse(list).find((d: any) => d.id === diagramId);
          if (matched) setDiagramName(matched.name);
        }
        
        const storedFlow = localStorage.getItem(`nex_diagram_flow_${diagramId}`);
        if (storedFlow) {
          const parsed = JSON.parse(storedFlow);
          setNodes(parsed.nodes || []);
          setEdges(parsed.edges || []);
          // Seed initial history
          setHistory([{ nodes: parsed.nodes || [], edges: parsed.edges || [] }]);
          setHistoryIndex(0);
        }
        return;
      }

      // 2. Load from Supabase
      const supabase = createClient();
      try {
        const { data: diagramInfo } = await supabase
          .from('diagrams')
          .select('name')
          .eq('id', diagramId)
          .single();
        if (diagramInfo) setDiagramName(diagramInfo.name);

        const { data: flowData } = await supabase
          .from('diagram_versions')
          .select('content')
          .eq('diagram_id', diagramId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (flowData?.content) {
          const content = flowData.content as any;
          setNodes(content.nodes || []);
          setEdges(content.edges || []);
          setHistory([{ nodes: content.nodes || [], edges: content.edges || [] }]);
          setHistoryIndex(0);
        }
      } catch (err) {
        console.error('Failed to load canvas state:', err);
      }
    };

    loadDiagramContent();
  }, [diagramId, isDemo, setNodes, setEdges]);

  // Connect Nodes helper
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds));
      saveHistoryState();
    },
    [setEdges]
  );

  // Push state to Undo stack
  const saveHistoryState = useCallback(() => {
    const nextState = { nodes, edges };
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, nextState]);
    setHistoryIndex(nextHistory.length);
  }, [nodes, edges, history, historyIndex]);

  // Undo triggers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setNodes(history[prevIndex].nodes);
      setEdges(history[prevIndex].edges);
    }
  };

  // Redo triggers
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setNodes(history[nextIndex].nodes);
      setEdges(history[nextIndex].edges);
    }
  };

  // Dragstart event for toolbar icons
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Dragover event helper
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Drop on Canvas handler
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      // Calculate position coordinate relative to canvas
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          ip: `10.0.1.${Math.floor(Math.random() * 254) + 1}`,
          runtime: 'Go API',
          cpuLoad: '4%',
          balancingAlgo: 'Round Robin',
          activeConns: '10',
          memory: '512 MB',
          hitRate: '98%',
          topicsCount: '2 partitions',
          lag: '0 ms',
          dbType: 'PostgreSQL'
        },
      };

      setNodes((nds) => nds.concat(newNode));
      saveHistoryState();
    },
    [reactFlowInstance, setNodes, saveHistoryState]
  );

  // Monitor node selections to show editing property sidebar on the right
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Close editing panel when clicking background canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Modify active node custom properties
  const updateNodeData = (field: string, val: string) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          const updatedNode = {
            ...n,
            data: {
              ...n.data,
              [field]: val,
              label: field === 'label' ? val : n.data.label
            },
          };
          // Keep active details highlighted
          setSelectedNode(updatedNode);
          return updatedNode;
        }
        return n;
      })
    );
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
    saveHistoryState();
  };

  // Save changes back to DB / LocalStorage
  const handleSaveDiagram = async () => {
    const flow = { nodes, edges };

    if (isDemo) {
      localStorage.setItem(`nex_diagram_flow_${diagramId}`, JSON.stringify(flow));
      alert('Diagram saved successfully to local storage!');
      return;
    }

    const supabase = createClient();
    try {
      await supabase.from('diagram_versions').insert({
        diagram_id: diagramId,
        content: flow
      });
      await supabase.from('diagrams').update({ updated_at: new Date().toISOString() }).eq('id', diagramId);
      alert('Diagram saved successfully to Supabase DB!');
    } catch (err) {
      console.error(err);
      alert('Failed to save diagram content.');
    }
  };

  // Export JSON configs
  const handleExportJSON = () => {
    const flow = { nodes, edges };
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramName.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-200">
      {/* Editor Navbar header */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link href="/studio">
            <button className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer">
              <ArrowLeft size={14} />
            </button>
          </Link>
          <input
            type="text"
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-sm text-zinc-100 focus:border-b focus:border-zinc-700 py-1"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="Undo"
          >
            <Undo size={14} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="Redo"
          >
            <Redo size={14} />
          </button>

          {/* Export Options */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
          >
            <Download size={12} />
            <span>Export JSON</span>
          </button>

          {/* Save Action */}
          <button
            onClick={handleSaveDiagram}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Save size={12} />
            <span>Save Canvas</span>
          </button>
        </div>
      </header>

      {/* Editor Main Canvas Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Components Drawer Panel */}
        <aside className="w-56 border-r border-zinc-850 bg-zinc-900/60 p-4 space-y-4 select-none">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Node Palette</h3>
            <p className="text-[10px] text-zinc-500">Drag components onto the drawing canvas</p>
          </div>

          <div className="space-y-2 pt-2">
            {/* Draggable Load Balancer */}
            <div
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, 'loadBalancer')}
            >
              <div className="p-1.5 rounded bg-amber-600 text-white"><Layers size={13} /></div>
              <span className="text-xs font-medium">Load Balancer</span>
            </div>

            {/* Draggable Web Server */}
            <div
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, 'server')}
            >
              <div className="p-1.5 rounded bg-emerald-600 text-white"><Server size={13} /></div>
              <span className="text-xs font-medium">App Server</span>
            </div>

            {/* Draggable Database */}
            <div
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, 'database')}
            >
              <div className="p-1.5 rounded bg-blue-600 text-white"><Database size={13} /></div>
              <span className="text-xs font-medium">Postgres DB</span>
            </div>

            {/* Draggable Redis Cache */}
            <div
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, 'cache')}
            >
              <div className="p-1.5 rounded bg-rose-600 text-white"><Cpu size={13} /></div>
              <span className="text-xs font-medium">Redis Cache</span>
            </div>

            {/* Draggable Queue */}
            <div
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, 'queue')}
            >
              <div className="p-1.5 rounded bg-purple-600 text-white"><GitCommit size={13} /></div>
              <span className="text-xs font-medium">Kafka Message</span>
            </div>
          </div>
        </aside>

        {/* Center: React Flow Canvas Panel */}
        <div ref={reactFlowWrapper} className="flex-1 h-full relative bg-zinc-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} color="#27272a" gap={16} />
            <Controls className="!bg-zinc-900 !border-zinc-850 !text-zinc-200 hover:!bg-zinc-800" />
            <MiniMap
              className="!bg-zinc-900/90 !border-zinc-850"
              nodeColor={() => '#18181b'}
              maskColor="rgba(9, 9, 11, 0.6)"
            />
          </ReactFlow>
        </div>

        {/* Right Side: Properties configuration sidebar panel */}
        {selectedNode && (
          <aside className="w-64 border-l border-zinc-850 bg-zinc-900/60 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 size={13} className="text-indigo-400" />
                <span>Node Inspector</span>
              </h3>
              <button
                onClick={deleteSelectedNode}
                className="p-1 rounded text-zinc-550 hover:text-red-400 hover:bg-zinc-950 transition-colors cursor-pointer"
                title="Remove Node"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Common Label Edit */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-550 font-bold uppercase">Node Tag / Label</label>
                <input
                  type="text"
                  value={selectedNode.data.label as string || ''}
                  onChange={(e) => updateNodeData('label', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Database custom options */}
              {selectedNode.type === 'database' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Database Type</label>
                    <input
                      type="text"
                      value={selectedNode.data.dbType as string || ''}
                      onChange={(e) => updateNodeData('dbType', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">IP Address</label>
                    <input
                      type="text"
                      value={selectedNode.data.ip as string || ''}
                      onChange={(e) => updateNodeData('ip', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Server custom options */}
              {selectedNode.type === 'server' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Runtime Platform</label>
                    <input
                      type="text"
                      value={selectedNode.data.runtime as string || ''}
                      onChange={(e) => updateNodeData('runtime', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">CPU Load</label>
                    <input
                      type="text"
                      value={selectedNode.data.cpuLoad as string || ''}
                      onChange={(e) => updateNodeData('cpuLoad', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Cache custom options */}
              {selectedNode.type === 'cache' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Memory Usage</label>
                    <input
                      type="text"
                      value={selectedNode.data.memory as string || ''}
                      onChange={(e) => updateNodeData('memory', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Cache Hit Rate</label>
                    <input
                      type="text"
                      value={selectedNode.data.hitRate as string || ''}
                      onChange={(e) => updateNodeData('hitRate', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Queue custom options */}
              {selectedNode.type === 'queue' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Partition Configurations</label>
                    <input
                      type="text"
                      value={selectedNode.data.topicsCount as string || ''}
                      onChange={(e) => updateNodeData('topicsCount', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Consumer Lag</label>
                    <input
                      type="text"
                      value={selectedNode.data.lag as string || ''}
                      onChange={(e) => updateNodeData('lag', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Load Balancer custom options */}
              {selectedNode.type === 'loadBalancer' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Load Algo</label>
                    <input
                      type="text"
                      value={selectedNode.data.balancingAlgo as string || ''}
                      onChange={(e) => updateNodeData('balancingAlgo', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-550 font-bold uppercase">Active Connections</label>
                    <input
                      type="text"
                      value={selectedNode.data.activeConns as string || ''}
                      onChange={(e) => updateNodeData('activeConns', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

// ReactFlow context requires ReactFlowProvider to wrap the node operations
export default function CanvasPage({ params }: PageProps) {
  const { diagramId } = use(params);
  return (
    <ReactFlowProvider>
      <CanvasEditor diagramId={diagramId} />
    </ReactFlowProvider>
  );
}
