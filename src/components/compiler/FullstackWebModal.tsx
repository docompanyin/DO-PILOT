import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, RotateCcw, X, Maximize2, 
  Minimize2, Sparkles, AlertCircle, 
  Code, Copy, Check, Eye
} from 'lucide-react';

export interface FullstackTaskContext {
  id: string;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Challenge';
  description: string;
  sampleInput?: string;
  sampleOutput?: string;
  starterCode?: string;
}

interface FullstackWebModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: FullstackTaskContext | null;
  onClearTask?: () => void;
}

export const FullstackWebModal: React.FC<FullstackWebModalProps> = ({
  isOpen,
  onClose,
  activeTask
}) => {
  const defaultStarterCode = `// Full Stack Open Web Sandbox (JavaScript & DOM)
const notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser executes JavaScript", important: false },
  { id: 3, content: "GET and POST are key HTTP methods", important: true }
];

console.log("Total notes:", notes.length);

const importantNotes = notes.filter(n => n.important);
console.log("Important notes count:", importantNotes.length);

importantNotes.forEach(note => {
  console.log(\`[#\${note.id}] \${note.content}\`);
});
`;

  const [code, setCode] = useState<string>(
    activeTask?.starterCode || defaultStarterCode
  );
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('V8 JavaScript & Web Engine Ready');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'console' | 'preview' | 'task'>('console');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (activeTask?.starterCode) {
      setCode(activeTask.starterCode);
      setActiveTab('task');
    }
  }, [activeTask]);

  const handleRun = () => {
    setIsRunning(true);
    setStatusMessage('Executing JavaScript in browser sandbox...');
    setTerminalError(null);
    setActiveTab('console');

    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      },
      info: (...args: any[]) => {
        logs.push('[INFO] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      }
    };

    try {
      const startTime = performance.now();
      // Safe function evaluation with captured console
      const runFn = new Function('console', code);
      runFn(customConsole);
      const endTime = performance.now();

      const out = logs.length > 0 ? logs.join('\n') : '(Code executed successfully with no console output)';
      setTerminalOutput(out);
      setStatusMessage(`Executed successfully in ${Math.round(endTime - startTime)}ms`);
    } catch (err: any) {
      setTerminalError(err.message || String(err));
      setTerminalOutput(logs.join('\n'));
      setStatusMessage('Runtime Exception');
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(activeTask?.starterCode || defaultStarterCode);
    setTerminalOutput('');
    setTerminalError(null);
    setStatusMessage('Sandbox reset to default');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`bg-[#0a0d14] border border-white/15 rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 w-full ${
            isMaximized ? 'h-[96vh] max-w-[98vw]' : 'h-[85vh] max-w-5xl'
          }`}
        >
          {/* Header Bar */}
          <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-jakarta font-bold text-sm text-paper">
                    Full Stack Web Sandbox
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Modern JS & DOM
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate/70">
                  {statusMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 rounded-lg text-slate hover:text-paper hover:bg-white/5 transition-colors"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleResetCode}
                className="p-2 rounded-lg text-slate hover:text-paper hover:bg-white/5 transition-colors"
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 rounded-lg text-slate hover:text-paper hover:bg-white/5 transition-colors"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate hover:text-paper hover:bg-white/5 transition-colors"
                title="Close Sandbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Work Area (Editor Left, Terminal Right) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 min-h-0 overflow-hidden">
            {/* Left: Code Editor */}
            <div className="flex flex-col min-h-0 bg-[#080b11]">
              <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate">
                <span className="flex items-center gap-1.5 text-paper">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>main.js</span>
                </span>
                <span>JavaScript / ES6+</span>
              </div>
              <div className="flex-1 p-3 overflow-auto">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Enter JavaScript / Web app code here..."
                  className="w-full h-full bg-transparent text-paper font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed selection:bg-emerald-500/30"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Right: Output / Preview Tabs */}
            <div className="flex flex-col min-h-0 bg-black/50">
              <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('console')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeTab === 'console'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-slate hover:text-paper'
                    }`}
                  >
                    Console Output
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                      activeTab === 'preview'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-slate hover:text-paper'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Live Preview</span>
                  </button>

                  {activeTask && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('task')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeTab === 'task'
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-slate hover:text-paper'
                      }`}
                    >
                      Task Details
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 p-4 font-mono text-xs overflow-auto">
                {activeTab === 'console' && (
                  <div>
                    {terminalError && (
                      <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-xs">Runtime Error</p>
                          <pre className="text-[11px] mt-1 whitespace-pre-wrap">{terminalError}</pre>
                        </div>
                      </div>
                    )}
                    {terminalOutput ? (
                      <pre className="text-paper/90 whitespace-pre-wrap leading-relaxed">
                        {terminalOutput}
                      </pre>
                    ) : (
                      <div className="text-slate/60 italic flex flex-col items-center justify-center h-48 gap-2">
                        <Terminal className="w-8 h-8 opacity-40 text-slate" />
                        <span>Click "Run Code" to execute script and inspect output.</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="h-full flex flex-col">
                    <iframe
                      ref={iframeRef}
                      title="Preview Sandbox"
                      className="w-full flex-1 rounded-xl bg-white border border-white/20"
                      srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:sans-serif;padding:16px;color:#111;background:#fff;margin:0;}h2{margin-top:0;color:#059669;}pre{background:#f3f4f6;padding:10px;border-radius:6px;}</style></head><body><h2>Live HTML Preview</h2><div id="root"></div><script>try{${code}}catch(e){document.body.innerHTML += '<p style="color:red">Error: '+e.message+'</p>';}<\/script></body></html>`}
                      sandbox="allow-scripts"
                    />
                  </div>
                )}

                {activeTab === 'task' && activeTask && (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        {activeTask.difficulty || 'Exercise'}
                      </span>
                      <h4 className="font-jakarta font-bold text-sm text-paper">
                        {activeTask.title}
                      </h4>
                    </div>
                    <p className="text-slate text-xs leading-relaxed">
                      {activeTask.description}
                    </p>
                    {activeTask.sampleOutput && (
                      <div className="mt-3">
                        <span className="font-mono text-[10px] text-slate block mb-1 uppercase tracking-wider">
                          Expected Output:
                        </span>
                        <pre className="p-2.5 rounded-lg bg-black/60 border border-white/5 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap">
                          {activeTask.sampleOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footer Controls */}
          <div className="px-5 py-3 bg-black/70 border-t border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-slate/80">Interactive Sandbox</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning}
                className="px-6 py-2 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const FullstackCompilerLauncherButton: React.FC<{
  onClick: () => void;
  label?: string;
}> = ({ onClick, label = "Web Sandbox" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
      title="Open Full Stack Web Sandbox"
    >
      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
      <span>{label}</span>
    </button>
  );
};
