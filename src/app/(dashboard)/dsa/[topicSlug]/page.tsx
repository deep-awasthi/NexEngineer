'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Code,
  Info,
  Sliders,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

// ALGORITHM PSEUDOCODES
const PSEUDOCODES: Record<string, string[]> = {
  'bubble-sort': [
    '1. for i = 0 to n - 2:',
    '2.   for j = 0 to n - i - 2:',
    '3.     if array[j] > array[j + 1]:',
    '4.       swap(array[j], array[j + 1])',
    '5. return sorted_array'
  ],
  'binary-search': [
    '1. set low = 0, high = n - 1',
    '2. while low <= high:',
    '3.   mid = floor((low + high) / 2)',
    '4.   if array[mid] == target: return mid',
    '5.   else if array[mid] < target: low = mid + 1',
    '6.   else: high = mid - 1',
    '7. return -1 (not found)'
  ]
};

const EXPLANATIONS: Record<string, string> = {
  'bubble-sort': 'Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This pass-through is repeated until no swaps are needed, which indicates that the list is sorted. The algorithm is named for the way smaller elements "bubble" to the top of the list.',
  'binary-search': 'Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you have narrowed down the possible locations to just one. It has a logarithmic run-time, making it significantly faster than linear search for large datasets.'
};

const COMPLEXITIES: Record<string, { time: string; space: string }> = {
  'bubble-sort': { time: 'O(N²)', space: 'O(1)' },
  'binary-search': { time: 'O(log N)', space: 'O(1)' }
};

interface PageProps {
  params: Promise<{
    topicSlug: string;
  }>;
}

export default function VisualizerPage({ params }: PageProps) {
  const { topicSlug } = use(params);
  const router = useRouter();
  
  const [customInput, setCustomInput] = useState('8, 3, 5, 2, 9');
  const [targetInput, setTargetInput] = useState('5');
  const [array, setArray] = useState<number[]>([8, 3, 5, 2, 9]);

  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800); // ms per step
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize visualizer steps based on algorithm slug
  useEffect(() => {
    generateSteps();
    // Clean up timers on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topicSlug, array, targetInput]);

  // Generate complete execution logs
  const generateSteps = () => {
    setIsPlaying(false);
    setCurrentStep(0);

    if (topicSlug === 'bubble-sort') {
      const a = [...array];
      const n = a.length;
      const stepLogs = [];
      
      // Step 0: start
      stepLogs.push({ array: [...a], comparing: [], swapped: [], sorted: [], line: 0 });

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          // Compare
          stepLogs.push({ array: [...a], comparing: [j, j + 1], swapped: [], sorted: Array.from({ length: i }, (_, k) => n - 1 - k), line: 1 });
          
          if (a[j] > a[j + 1]) {
            // Highlight Swapping
            stepLogs.push({ array: [...a], comparing: [j, j + 1], swapped: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k), line: 2 });
            const temp = a[j];
            a[j] = a[j + 1];
            a[j + 1] = temp;
            
            // Swapped state
            stepLogs.push({ array: [...a], comparing: [j, j + 1], swapped: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k), line: 3 });
          }
        }
        // Element i is sorted
        stepLogs.push({ array: [...a], comparing: [], swapped: [], sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k), line: 0 });
      }
      
      // All sorted
      stepLogs.push({ array: [...a], comparing: [], swapped: [], sorted: Array.from({ length: n }, (_, k) => k), line: 4 });
      setSteps(stepLogs);
    } 
    else if (topicSlug === 'binary-search') {
      const sortedArray = [...array].sort((x, y) => x - y);
      const target = parseInt(targetInput) || 5;
      const stepLogs: any[] = [];
      
      let low = 0;
      let high = sortedArray.length - 1;
      
      stepLogs.push({ array: [...sortedArray], low, high, mid: -1, found: false, failed: false, line: 0 });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        stepLogs.push({ array: [...sortedArray], low, high, mid, found: false, failed: false, line: 2 });
        
        if (sortedArray[mid] === target) {
          stepLogs.push({ array: [...sortedArray], low, high, mid, found: true, failed: false, line: 3 });
          setSteps(stepLogs);
          return;
        } else if (sortedArray[mid] < target) {
          low = mid + 1;
          stepLogs.push({ array: [...sortedArray], low, high, mid, found: false, failed: false, line: 4 });
        } else {
          high = mid - 1;
          stepLogs.push({ array: [...sortedArray], low, high, mid, found: false, failed: false, line: 5 });
        }
      }
      
      stepLogs.push({ array: [...sortedArray], low, high, mid: -1, found: false, failed: true, line: 6 });
      setSteps(stepLogs);
    }
  };

  // Playback timer ticker
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed]);

  const handleCustomInput = (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = customInput
      .split(',')
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
    if (numbers.length > 0) {
      setArray(numbers.slice(0, 10)); // restrict to 10 elements to keep layout pretty
    }
  };

  const activeState = steps[currentStep] || { array: [], comparing: [], swapped: [], sorted: [], line: 0 };
  const pseudocode = PSEUDOCODES[topicSlug] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Link href="/dsa" className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 font-semibold uppercase tracking-wider">
          <ArrowLeft size={12} />
          <span>Back to Tracker</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Visualizer Canvas & Timeline */}
        <div className="flex-1 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col justify-between min-h-[380px] relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl" />
            
            {/* Header Info */}
            <div className="flex justify-between items-start z-10">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                  {topicSlug.replace('-', ' ')}
                </h2>
                <p className="text-xs text-zinc-500">Visualizing algorithms in real-time step parameters</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold font-mono">
                  Step {currentStep} / {Math.max(steps.length - 1, 0)}
                </span>
              </div>
            </div>

            {/* Canvas Bars/Nodes Render */}
            <div className="flex-1 flex items-end justify-center gap-4 py-8 z-10 min-h-[200px]">
              {topicSlug === 'bubble-sort' && (
                <div className="flex items-end justify-center gap-2.5 w-full max-w-md h-40">
                  {activeState.array.map((value: number, index: number) => {
                    const isComparing = activeState.comparing.includes(index);
                    const isSwapped = activeState.swapped.includes(index);
                    const isSorted = activeState.sorted.includes(index);
                    
                    const barColor = isSwapped
                      ? 'bg-rose-500 border-rose-400'
                      : isComparing
                      ? 'bg-amber-500 border-amber-400'
                      : isSorted
                      ? 'bg-emerald-500 border-emerald-400'
                      : 'bg-zinc-800 border-zinc-700';

                    const height = (value / Math.max(...array, 1)) * 100;

                    return (
                      <motion.div
                        key={index}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="flex flex-col items-center justify-end w-10 flex-1 group"
                        style={{ height: '100%' }}
                      >
                        <div
                          className={`w-full rounded-t-lg border-t ${barColor} shadow-lg transition-colors flex items-center justify-center`}
                          style={{ height: `${Math.max(height, 15)}%` }}
                        >
                          <span className="text-[10px] font-bold text-white mb-2">{value}</span>
                        </div>
                        <span className="text-[9px] text-zinc-600 mt-2 font-semibold">[{index}]</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {topicSlug === 'binary-search' && (
                <div className="flex items-center justify-center gap-2 w-full flex-wrap max-w-xl">
                  {activeState.array.map((value: number, index: number) => {
                    const isMid = activeState.mid === index;
                    const isRange = index >= activeState.low && index <= activeState.high;
                    const isFound = activeState.found && isMid;

                    let bgClass = 'bg-zinc-900 border-zinc-800 text-zinc-500';
                    if (isRange) bgClass = 'bg-zinc-800 border-zinc-700 text-zinc-300';
                    if (isMid) bgClass = 'bg-amber-500/10 border-amber-500 text-amber-500';
                    if (isFound) bgClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold';

                    return (
                      <motion.div
                        key={index}
                        layout
                        className={`flex flex-col items-center p-3 rounded-lg border text-center w-12 h-16 justify-between select-none ${bgClass}`}
                      >
                        <span className="text-xs font-semibold">{value}</span>
                        <span className="text-[9px] opacity-40 font-mono">[{index}]</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Playback Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-850 pt-4 gap-4 z-10">
              <div className="flex items-center gap-2">
                {/* Reset */}
                <button
                  onClick={() => setCurrentStep(0)}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Reset Simulation"
                >
                  <RotateCcw size={14} />
                </button>

                {/* Back step */}
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                  disabled={currentStep === 0}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                {/* Forward step */}
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
                  disabled={currentStep === steps.length - 1}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Speed Slider control */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Sliders size={14} className="text-zinc-550 flex-shrink-0" />
                <span className="text-[10px] text-zinc-500 whitespace-nowrap">Speed: {Math.round(2000 - speed)}ms</span>
                <input
                  type="range"
                  min="200"
                  max="1900"
                  value={2000 - speed}
                  onChange={(e) => setSpeed(2000 - parseInt(e.target.value))}
                  className="w-full sm:w-28 accent-indigo-500 h-1 bg-zinc-950 rounded-lg outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Custom Input Panel */}
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} className="text-indigo-400" />
              <span>Simulation Input Configurator</span>
            </h3>
            
            <form onSubmit={handleCustomInput} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] text-zinc-500 font-semibold uppercase">Array values (comma-separated)</label>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-300 placeholder-zinc-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {topicSlug === 'binary-search' && (
                <div className="w-full sm:w-24 space-y-1">
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase">Target</label>
                  <input
                    type="number"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-300 placeholder-zinc-700 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
              >
                Reload Array
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Pseudocode Trace, Explanation, and Complexity */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Complexity analysis */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} className="text-zinc-500" />
              <span>Complexity Boundings</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-center">
                <p className="text-[9px] text-zinc-500 font-semibold uppercase">Time Complexity</p>
                <p className="text-lg font-black text-indigo-400 mt-1">{COMPLEXITIES[topicSlug]?.time || 'O(N)'}</p>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-center">
                <p className="text-[9px] text-zinc-500 font-semibold uppercase">Space Complexity</p>
                <p className="text-lg font-black text-indigo-400 mt-1">{COMPLEXITIES[topicSlug]?.space || 'O(1)'}</p>
              </div>
            </div>
          </div>

          {/* Pseudocode line highlight trace */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Code size={14} className="text-zinc-500" />
              <span>Pseudocode Trace</span>
            </h3>
            <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg font-mono text-[10px] space-y-1.5 overflow-x-auto select-none leading-relaxed text-zinc-400">
              {pseudocode.map((line, idx) => {
                const isActive = activeState.line === idx;
                return (
                  <div
                    key={idx}
                    className={`py-0.5 px-1.5 rounded transition-all ${
                      isActive ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 font-bold' : ''
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed explanation */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} className="text-zinc-500" />
              <span>Algorithm Breakdown</span>
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {EXPLANATIONS[topicSlug] || 'Detailed algorithmic explanation load.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
