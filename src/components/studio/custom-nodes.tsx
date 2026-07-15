'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Server, Cpu, Layers, GitCommit, HelpCircle } from 'lucide-react';

// Common styling wrapper for design studio nodes
function NodeWrapper({
  title,
  icon: Icon,
  colorClass,
  selected,
  children
}: {
  title: string;
  icon: any;
  colorClass: string;
  selected?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`px-4 py-3 rounded-xl bg-zinc-900 border backdrop-blur-md shadow-lg transition-all min-w-[150px] select-none text-zinc-100 ${
        selected ? 'border-indigo-500 shadow-indigo-500/10 scale-105' : 'border-zinc-800'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-1.5 mb-1.5">
        <div className={`p-1.5 rounded-lg ${colorClass} text-white flex items-center justify-center`}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-bold tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

// 1. DATABASE NODE
export function DatabaseNode({ data, selected }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
      <NodeWrapper title={data.label || 'Database'} icon={Database} colorClass="bg-blue-600" selected={selected}>
        <div className="text-[10px] text-zinc-500 space-y-0.5">
          <p>Type: {data.dbType || 'Postgres'}</p>
          <p className="font-mono text-[9px]">{data.ip || '10.0.4.12'}</p>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
    </div>
  );
}

// 2. SERVER NODE
export function ServerNode({ data, selected }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
      <NodeWrapper title={data.label || 'Web Server'} icon={Server} colorClass="bg-emerald-600" selected={selected}>
        <div className="text-[10px] text-zinc-500 space-y-0.5">
          <p>Runtime: {data.runtime || 'Next.js API'}</p>
          <p className="font-mono text-[9px]">CPU: {data.cpuLoad || '12%'}</p>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
    </div>
  );
}

// 3. CACHE NODE
export function CacheNode({ data, selected }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
      <NodeWrapper title={data.label || 'Redis Cache'} icon={Cpu} colorClass="bg-rose-600" selected={selected}>
        <div className="text-[10px] text-zinc-500 space-y-0.5">
          <p>Memory: {data.memory || '2.4 GB / 8 GB'}</p>
          <p>Hit Rate: {data.hitRate || '94%'}</p>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
    </div>
  );
}

// 4. QUEUE NODE (Kafka / RabbitMQ)
export function QueueNode({ data, selected }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
      <NodeWrapper title={data.label || 'Kafka Queue'} icon={GitCommit} colorClass="bg-purple-600" selected={selected}>
        <div className="text-[10px] text-zinc-500 space-y-0.5">
          <p>Topics: {data.topicsCount || '3 partitions'}</p>
          <p>Lag: {data.lag || '0 ms'}</p>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
    </div>
  );
}

// 5. LOAD BALANCER NODE
export function LoadBalancerNode({ data, selected }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
      <NodeWrapper title={data.label || 'Nginx Proxy'} icon={Layers} colorClass="bg-amber-600" selected={selected}>
        <div className="text-[10px] text-zinc-500 space-y-0.5">
          <p>Algorithm: {data.balancingAlgo || 'Round Robin'}</p>
          <p>Active Conns: {data.activeConns || '142'}</p>
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !border-zinc-800 !w-2.5 !h-2.5" />
    </div>
  );
}
