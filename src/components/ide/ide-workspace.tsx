'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Save,
  RotateCcw,
  Sliders,
  Terminal,
  Settings,
  HelpCircle,
  FileCode,
  FolderOpen,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

// Free sandboxes default codes
const FREE_BOILERPLATES: Record<string, string> = {
  javascript: `// JavaScript Playground\nconsole.log("Hello, NexEngineer!");\n`,
  python: `# Python Playground\nprint("Hello, NexEngineer!")\n`,
  cpp: `// C++ Playground\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, NexEngineer!" << std::endl;\n    return 0;\n}\n`,
  java: `// Java Playground\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, NexEngineer!");\n    }\n}\n`
};

interface QuestionData {
  id: string;
  name: string;
  slug: string;
  difficulty: string;
  estimated_time: number;
  leetcode_url?: string;
  default_code?: Record<string, string>;
  description?: string;
}

interface IDEWorkspaceProps {
  question?: QuestionData | null;
}

export function IDEWorkspace({ question }: IDEWorkspaceProps) {
  const { profile } = useAuthStore();
  const [language, setLanguage] = useState('javascript');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [code, setCode] = useState('');
  
  const [stdin, setStdin] = useState('');
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveHistory, setSaveHistory] = useState<any[]>([]);

  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project-id');

  // Load boilerplates or saved code
  useEffect(() => {
    const loadCode = async () => {
      // 1. If it's a LeetCode problem, check if there is custom default_code
      if (question) {
        if (question.default_code && question.default_code[language]) {
          setCode(question.default_code[language]);
        } else {
          setCode(FREE_BOILERPLATES[language]);
        }
      } else {
        setCode(FREE_BOILERPLATES[language]);
      }

      // Check if there is saved code in database / localstorage for this question & language
      const key = `nex_saved_code_${question?.slug || 'playground'}_${language}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        setCode(stored);
      } else if (!isDemo && question) {
        const supabase = createClient();
        try {
          const { data } = await supabase
            .from('saved_code')
            .select('code')
            .eq('user_id', profile?.id)
            .eq('question_id', question.id)
            .eq('language', language)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();
          if (data?.code) {
            setCode(data.code);
          }
        } catch (err) {
          console.log('No database code copy found, loading default', err);
        }
      }
    };

    loadCode();
  }, [language, question, profile, isDemo]);

  // Fetch execution versions log
  useEffect(() => {
    const fetchSaveHistory = async () => {
      if (isDemo) return;
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from('saved_code')
          .select('id, name, created_at')
          .eq('user_id', profile?.id)
          .eq('question_id', question?.id || null)
          .order('created_at', { ascending: false })
          .limit(5);
        if (data) {
          setSaveHistory(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaveHistory();
  }, [question, profile, isDemo, isSaving]);

  // Handle run request
  const handleRunCode = async () => {
    setIsRunning(true);
    setStdout('');
    setStderr('');

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          stdin,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStdout(data.stdout || '');
        setStderr(data.stderr || '');
      } else {
        setStderr(data.error || 'Execution server returned an error.');
      }
    } catch (err: any) {
      setStderr(err.message || 'Network error executing code.');
    }
    setIsRunning(false);
  };

  // Handle save request
  const handleSaveCode = async () => {
    setIsSaving(true);
    const key = `nex_saved_code_${question?.slug || 'playground'}_${language}`;
    localStorage.setItem(key, code);

    if (isDemo) {
      setIsSaving(false);
      alert('Code saved locally! (Demo mode)');
      return;
    }

    const supabase = createClient();
    try {
      await supabase.from('saved_code').insert({
        user_id: profile?.id,
        name: question ? `Solution: ${question.name}` : `Playground ${language.toUpperCase()}`,
        language,
        code,
        question_id: question?.id || null,
        updated_at: new Date().toISOString(),
      });
      alert('Code saved successfully to your cloud account!');
    } catch (err) {
      console.error(err);
      alert('Failed to save code to account.');
    }
    setIsSaving(false);
  };

  const handleResetCode = () => {
    if (confirm('Are you sure you want to reset your code to the default template?')) {
      setCode(question?.default_code?.[language] || FREE_BOILERPLATES[language]);
      localStorage.removeItem(`nex_saved_code_${question?.slug || 'playground'}_${language}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* 1. LEFT PANE: Question Details (only if question is provided) */}
      {question && (
        <div className="w-full lg:w-[400px] bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between overflow-y-auto max-h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  question.difficulty === 'EASY'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : question.difficulty === 'MEDIUM'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {question.difficulty}
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                ⏱️ Est: {question.estimated_time}m
              </span>
            </div>

            <h2 className="text-lg font-bold text-white leading-snug">{question.name}</h2>
            
            {/* Hardcoded visual representation of the problem description */}
            <div className="text-xs text-zinc-400 leading-relaxed space-y-3 pt-2 select-text">
              <p>
                Given an array of integers <code>nums</code> and an integer <code>target</code>, return 
                <em> indices of the two numbers such that they add up to <code>target</code></em>.
              </p>
              <p>
                You may assume that each input would have <strong>exactly one solution</strong>, and you may 
                not use the <em>same</em> element twice.
              </p>
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg font-mono text-[10px] space-y-1.5">
                <p className="text-zinc-500">// Example 1:</p>
                <p><span className="text-indigo-400">Input:</span> nums = [2,7,11,15], target = 9</p>
                <p><span className="text-indigo-400">Output:</span> [0,1]</p>
                <p><span className="text-zinc-550">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</span></p>
              </div>
            </div>
          </div>

          {question.leetcode_url && (
            <a
              href={question.leetcode_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-1.5 py-2 border border-zinc-800 rounded-lg bg-zinc-950/40 hover:bg-zinc-950 text-zinc-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            >
              <span>Solve on LeetCode</span>
              <ArrowRight size={12} />
            </a>
          )}
        </div>
      )}

      {/* 2. RIGHT PANE: Monaco Editor + Console Workspace */}
      <div className="flex-1 flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden min-h-[400px]">
        {/* Editor Toolbar header */}
        <div className="h-12 border-b border-zinc-850 bg-zinc-900/40 px-4 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Language Selection */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-400 outline-none focus:border-indigo-500 cursor-pointer appearance-none pr-6 font-semibold"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <Settings size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCode}
              className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Reset boilerplate template"
            >
              <RotateCcw size={13} />
            </button>

            <button
              onClick={handleSaveCode}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1 text-zinc-300 hover:text-white bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1 px-4 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              <span>{isRunning ? 'Running' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[180px] bg-zinc-950">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme={editorTheme}
            options={{
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 12, bottom: 12 }
            }}
          />
        </div>

        {/* Console Stdin & Output footer panels */}
        <div className="h-44 border-t border-zinc-850 bg-zinc-950/80 flex flex-col sm:flex-row flex-shrink-0">
          {/* Stdin Area */}
          <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-zinc-850 p-3 flex flex-col">
            <label className="text-[10px] text-zinc-550 font-bold uppercase flex items-center gap-1 mb-1">
              <Terminal size={11} />
              <span>Custom Stdin</span>
            </label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide terminal inputs here..."
              className="w-full flex-1 bg-zinc-950 border border-zinc-850 rounded p-2 text-xs text-zinc-300 placeholder-zinc-700 outline-none focus:border-indigo-500 transition-colors resize-none font-mono"
            />
          </div>

          {/* Stderr/Stdout Log Area */}
          <div className="flex-1 p-3 flex flex-col overflow-hidden">
            <span className="text-[10px] text-zinc-550 font-bold uppercase flex items-center gap-1 mb-1">
              <FileCode size={11} />
              <span>Compilation Logs</span>
            </span>
            <div className="flex-1 bg-zinc-950 border border-zinc-850 rounded p-2 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 select-text">
              {isRunning && (
                <div className="flex items-center gap-2 text-zinc-500 py-2">
                  <Loader2 size={12} className="animate-spin text-indigo-500" />
                  <span>Compiling runtime file against Piston container...</span>
                </div>
              )}
              {!isRunning && stdout && (
                <div className="text-emerald-400 whitespace-pre-wrap">{stdout}</div>
              )}
              {!isRunning && stderr && (
                <div className="text-red-400 whitespace-pre-wrap">{stderr}</div>
              )}
              {!isRunning && !stdout && !stderr && (
                <span className="text-zinc-700">Click &ldquo;Run Code&rdquo; to fetch execution reports.</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
