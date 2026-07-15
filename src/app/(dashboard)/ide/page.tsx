'use client';

import { IDEWorkspace } from '@/components/ide/ide-workspace';
import { Code2 } from 'lucide-react';

export default function IDEPlaygroundPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Code2 className="text-indigo-500 w-6 h-6" />
          <span>Code Playground</span>
        </h1>
        <p className="text-sm text-zinc-500">
          A blank coding sandbox supporting JavaScript, Python, C++, and Java execution runtimes.
        </p>
      </div>

      {/* Main IDE Workspace */}
      <IDEWorkspace question={null} />
    </div>
  );
}
