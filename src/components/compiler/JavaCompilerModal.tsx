import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, RotateCcw, X, Maximize2, 
  Minimize2, Trash2, Sparkles, ChevronRight, AlertCircle, 
  Code, Copy, Check, Trophy
} from 'lucide-react';
import { 
  runJavaCode, 
  getSimpleJavaErrorExplanation 
} from '../../utils/javaRunner';
import { useCoursePoints } from '../../context/CoursePointsContext';

export interface JavaTaskContext {
  id: string;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Challenge';
  description: string;
  sampleInput?: string;
  sampleOutput: string;
  starterCode?: string;
}

interface JavaCompilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: JavaTaskContext | null;
  onClearTask?: () => void;
}

export const JavaCompilerModal: React.FC<JavaCompilerModalProps> = ({
  isOpen,
  onClose,
  activeTask,
  onClearTask
}) => {
  const defaultStarterCode = `import java.util.Scanner;\n\npublic class Program {\n    public static void main(String[] args) {\n        // Write your Java code here\n        System.out.println("Hello, Java World!");\n    }\n}\n`;

  const [code, setCode] = useState<string>(
    activeTask?.starterCode || defaultStarterCode
  );
  const [interactiveInputVal, setInteractiveInputVal] = useState<string>(activeTask?.sampleInput || '');
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Java 21 JDK Ready');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'output' | 'task'>('output');
  const [copied, setCopied] = useState(false);

  // Sync starter code when activeTask changes
  React.useEffect(() => {
    if (activeTask?.starterCode) {
      setCode(activeTask.starterCode);
      if (activeTask.sampleInput) {
        setInteractiveInputVal(activeTask.sampleInput);
      }
      setActiveTab('task');
    }
  }, [activeTask]);

  const handleRun = async () => {
    setIsRunning(true);
    setStatusMessage('Compiling and running Java...');
    setTerminalError(null);
    setActiveTab('output');

    try {
      const res = await runJavaCode(code, interactiveInputVal);
      if (res.error) {
        setTerminalError(res.error);
        setTerminalOutput(res.output);
        setStatusMessage(`Build Error (${res.executionTimeMs}ms)`);
      } else {
        setTerminalOutput(res.output);
        setStatusMessage(`Executed successfully in ${res.executionTimeMs}ms`);
      }
    } catch (e: any) {
      setTerminalError(e.message || String(e));
      setStatusMessage('Execution Failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(activeTask?.starterCode || defaultStarterCode);
    setTerminalOutput('');
    setTerminalError(null);
    setStatusMessage('Code reset to default');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`bg-panel border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all ${
            isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[88vh]'
          }`}
        >
          {/* Top Bar */}
          <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <Code className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-jakarta font-black text-sm text-paper">
                    DO PILOT Java Cloud IDE
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                    Java 21 LTS
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate/70">
                  {statusMessage}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate hover:text-paper transition-all cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate hover:text-paper transition-all cursor-pointer"
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-slate hover:text-red-400 transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Task Banner if provided */}
          {activeTask && (
            <div className="px-5 py-2.5 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span className="font-jakarta font-bold text-xs text-paper truncate">
                  Active Challenge: {activeTask.title}
                </span>
              </div>
              {onClearTask && (
                <button
                  type="button"
                  onClick={onClearTask}
                  className="font-mono text-[11px] text-slate hover:text-paper underline cursor-pointer"
                >
                  Clear Task
                </button>
              )}
            </div>
          )}

          {/* Middle Layout: Code Editor + Terminal Split */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {/* Editor Pane (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col min-h-0 bg-black/40">
              <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Program.java
                </span>
                <button
                  type="button"
                  onClick={handleResetCode}
                  className="hover:text-paper flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Write Java code here..."
                spellCheck={false}
                className="flex-1 w-full p-4 font-mono text-xs sm:text-sm bg-transparent text-paper resize-none outline-none focus:outline-none leading-relaxed selection:bg-primary/30"
              />

              {/* Console Input area */}
              <div className="p-3 bg-black/60 border-t border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] text-slate uppercase tracking-wider">
                    Console Input (for Scanner System.in):
                  </label>
                  <span className="font-mono text-[10px] text-slate/50">One entry per line</span>
                </div>
                <input
                  type="text"
                  value={interactiveInputVal}
                  onChange={e => setInteractiveInputVal(e.target.value)}
                  placeholder="e.g. Ada Lovelace"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs text-paper outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Terminal Output Pane (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col min-h-0 bg-black/70">
              <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('output')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'output' ? 'bg-primary/20 text-primary font-bold' : 'text-slate hover:text-paper'
                    }`}
                  >
                    Console Output
                  </button>
                  {activeTask && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('task')}
                      className={`font-mono text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeTab === 'task' ? 'bg-primary/20 text-primary font-bold' : 'text-slate hover:text-paper'
                      }`}
                    >
                      Task Instructions
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTerminalOutput('');
                    setTerminalError(null);
                  }}
                  className="text-slate hover:text-paper transition-colors p-1"
                  title="Clear Terminal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-3">
                {activeTab === 'task' && activeTask ? (
                  <div className="space-y-3 font-sans text-paper">
                    <h4 className="font-jakarta font-bold text-sm text-primary">
                      {activeTask.title}
                    </h4>
                    <p className="text-xs text-slate leading-relaxed whitespace-pre-wrap">
                      {activeTask.description}
                    </p>
                    {activeTask.sampleOutput && (
                      <div className="mt-3 p-3 rounded-xl bg-black border border-white/10 font-mono text-xs">
                        <span className="text-[10px] text-slate/70 uppercase block mb-1">Expected Output:</span>
                        <pre className="text-emerald-300 whitespace-pre-wrap">{activeTask.sampleOutput}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {terminalError ? (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>Compilation / Runtime Exception</span>
                        </div>
                        <pre className="text-[11px] whitespace-pre-wrap font-mono text-red-200">
                          {terminalError}
                        </pre>
                        <div className="pt-2 border-t border-red-500/20 text-xs text-red-300/90 font-sans">
                          💡 <strong>Hint:</strong> {getSimpleJavaErrorExplanation(terminalError)}
                        </div>
                      </div>
                    ) : null}

                    {terminalOutput ? (
                      <pre className="text-paper whitespace-pre-wrap leading-relaxed font-mono">
                        {terminalOutput}
                      </pre>
                    ) : !terminalError ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate/60">
                        <Terminal className="w-8 h-8 mb-2 stroke-[1.5] text-slate/40" />
                        <p className="text-xs">Click "Run Code" to compile and execute.</p>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Execution Action Bar */}
          <div className="px-5 py-3 bg-black/80 border-t border-white/10 flex items-center justify-between shrink-0">
            <div className="font-mono text-xs text-slate">
              Entry: <span className="text-paper">public static void main(String[] args)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning}
                className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-md shadow-primary/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Floating Round Launcher Button for Java IDE
export const JavaCompilerLauncherButton: React.FC<{
  onClick: () => void;
  isOpen: boolean;
}> = ({ onClick, isOpen }) => {
  const { points } = useCoursePoints();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className={`relative group w-14 h-14 rounded-full bg-gradient-to-br from-panel-light via-black to-panel border-2 text-paper shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] flex items-center justify-center transition-all cursor-pointer overflow-visible ${
          isOpen ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-amber-400/60'
        }`}
        title={isOpen ? 'Java IDE Open' : 'Open Java 21 Cloud IDE'}
      >
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-amber-400/20 animate-ping pointer-events-none" />
        )}

        <div className="relative z-10 flex items-center justify-center text-amber-400 group-hover:text-white transition-colors">
          <Code className="w-6 h-6 stroke-[2.2]" />
        </div>

        <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black border border-black shadow-md flex items-center gap-1">
          <Trophy className="w-2.5 h-2.5 fill-black/25" />
          <span>{points}pt</span>
        </span>

        <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-black/95 border border-white/15 text-paper font-jakarta font-bold text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl flex items-center gap-1.5">
          <span>Java 21 Cloud IDE</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </motion.button>
    </div>
  );
};
