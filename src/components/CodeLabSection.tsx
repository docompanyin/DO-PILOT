import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, Play, RotateCcw, Copy, Check, 
  Code2, AlertCircle, Cpu
} from 'lucide-react';
import { runPythonCode, getSimpleErrorExplanation, extractInputPrompts } from '../utils/pythonRunner';
import { useSiteData } from '../context/DataContext';

const DEFAULT_STARTER_CODE = `print("Hello, World!")\n`;

export const CodeLabSection: React.FC = () => {
  const { data } = useSiteData();
  const codeLabData = data.codeLab;
  const initialStarter = codeLabData?.defaultCode || DEFAULT_STARTER_CODE;

  const [code, setCode] = useState<string>(initialStarter);
  const [output, setOutput] = useState<string>('Hello, World!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('CPython 3.12 • Ready');
  const [execTime, setExecTime] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (codeLabData?.defaultCode && code === DEFAULT_STARTER_CODE) {
      setCode(codeLabData.defaultCode);
    }
  }, [codeLabData?.defaultCode]);

  // Dynamic input session state (ONLY active when program calls input())
  const [inputSession, setInputSession] = useState<{
    prompts: string[];
    currentIndex: number;
    collectedValues: string[];
  } | null>(null);
  const [currentInputVal, setCurrentInputVal] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const handleResetCode = () => {
    const starter = codeLabData?.defaultCode || DEFAULT_STARTER_CODE;
    setCode(starter);
    setOutput('Hello, World!');
    setErrorMsg(null);
    setExecTime(null);
    setInputSession(null);
    setCurrentInputVal('');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleRun = () => {
    if (isRunning) return;

    // Detect if code actually requires user input through input()
    const detectedPrompts = extractInputPrompts(code);

    if (detectedPrompts.length > 0) {
      // Show input box ONLY when program requires input()!
      setInputSession({
        prompts: detectedPrompts.map(p => p.prompt),
        currentIndex: 0,
        collectedValues: []
      });
      setCurrentInputVal('');
      setStatusText(`Waiting for input: ${detectedPrompts[0].prompt}`);
      setTimeout(() => {
        inputFieldRef.current?.focus();
      }, 50);
    } else {
      // Program does NOT require input: execute directly with no input box!
      setInputSession(null);
      executeCodeWithInput('');
    }
  };

  const handleInputSubmit = () => {
    if (!inputSession) return;

    const nextValues = [...inputSession.collectedValues, currentInputVal];
    const nextIndex = inputSession.currentIndex + 1;

    if (nextIndex < inputSession.prompts.length) {
      // More inputs in the program: advance to next input prompt in order
      setInputSession({
        ...inputSession,
        currentIndex: nextIndex,
        collectedValues: nextValues
      });
      setCurrentInputVal('');
      setStatusText(`Waiting for input (${nextIndex + 1}/${inputSession.prompts.length}): ${inputSession.prompts[nextIndex]}`);
      setTimeout(() => {
        inputFieldRef.current?.focus();
      }, 50);
    } else {
      // All inputs collected in order! Execute program now
      setInputSession(null);
      executeCodeWithInput(nextValues.join('\n'));
    }
  };

  const executeCodeWithInput = async (stdin: string) => {
    setIsRunning(true);
    setErrorMsg(null);
    setStatusText('Executing Python 3.12 code...');

    try {
      const result = await runPythonCode(code, stdin, (msg) => {
        setStatusText(msg);
      });

      setExecTime(Math.round(result.executionTimeMs));

      if (result.error) {
        setErrorMsg(result.error);
        setOutput(result.output || '');
      } else {
        setOutput(result.output || '>>> Program executed successfully with no output.');
      }
      setStatusText('Execution finished');
    } catch (err: any) {
      setErrorMsg(err.message || 'Execution failed');
      setStatusText('Execution error');
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        if (terminalContainerRef.current) {
          terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key indentation (4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }

    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  return (
    <section id="code-lab" className="py-20 sm:py-28 bg-black relative border-t border-white/10 select-none overflow-hidden">
      {/* Background subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-panel border border-white/15 mb-4 shadow-sm">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
              {codeLabData?.badgeText || 'CODE LAB'}
            </span>
          </div>

          <h2 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight">
            {codeLabData?.title || 'Run Python Programs Instantly'}
          </h2>

          <p className="mt-4 text-slate text-base sm:text-lg leading-relaxed font-normal">
            {codeLabData?.description || 'Write, test, and execute Python 3.12 code directly in your browser.'}
          </p>
        </div>

        {/* The Clean Code Lab Workbench */}
        <div className="rounded-2xl border border-white/15 bg-panel/90 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Workbench Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/10">
            
            {/* Left: Window Dots & Active Tab */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]/80 inline-block" />
              </div>
              <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-panel-light border border-white/10 text-xs font-mono text-paper font-semibold">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span>main.py</span>
                <span className="text-[10px] text-slate font-normal">Python 3.12</span>
              </div>
            </div>

            {/* Right: Action Buttons & Run Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-panel border border-white/10 text-xs font-mono text-slate hover:text-paper hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy code to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleResetCode}
                className="px-3 py-1.5 rounded-lg bg-panel border border-white/10 text-xs font-mono text-slate hover:text-paper hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset code to starter program"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              {/* Big Run Button */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs tracking-wider uppercase hover:bg-white hover:shadow-[0_0_25px_rgba(0,255,157,0.5)] active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,255,157,0.3)]"
              >
                {isRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-ink" />
                    <span>Run Code</span>
                    <span className="hidden md:inline-block text-[10px] opacity-70 font-mono">(Ctrl+↵)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Split Panes: Editor (Left) & Terminal Output (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            
            {/* Left Pane: Code Editor (7 cols) */}
            <div className="lg:col-span-7 flex flex-col bg-panel/40 border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="flex-1 relative flex font-mono text-xs sm:text-sm">
                
                {/* Line numbers gutter */}
                <div className="py-4 px-2 sm:px-3 text-right text-slate/35 select-none bg-black/30 border-r border-white/5 font-mono text-xs leading-6 min-w-[2.75rem]">
                  {lineNumbers.map((num) => (
                    <div key={num}>{num}</div>
                  ))}
                </div>

                {/* Textarea */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    className="w-full h-full min-h-[360px] p-4 bg-transparent text-[#e6edf3] font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none placeholder-slate/40 selection:bg-primary/30 selection:text-white"
                    placeholder='print("Hello, World!")'
                  />
                </div>
              </div>

              {/* Editor bottom status bar */}
              <div className="px-4 py-2 bg-black/60 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate">
                <div className="flex items-center gap-3">
                  <span>Lines: {lineCount}</span>
                  <span>UTF-8</span>
                  <span className="text-primary hidden sm:inline">Python 3.12</span>
                </div>
                <div className="text-slate/60 text-[10px]">
                  Tab = 4 spaces • Ctrl + Enter to run
                </div>
              </div>
            </div>

            {/* Right Pane: Interactive Terminal / Output (5 cols) */}
            <div className="lg:col-span-5 flex flex-col bg-black/75 min-w-0">
              
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black/90 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span className="font-bold text-paper tracking-wider uppercase text-[11px]">Console Output</span>
                </div>

                <div className="flex items-center gap-2">
                  {execTime !== null && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-panel border border-white/10 text-primary font-mono">
                      ⚡ {execTime}ms
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setOutput('');
                      setErrorMsg(null);
                      setExecTime(null);
                    }}
                    className="text-[10px] text-slate hover:text-paper transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-white/5"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Input Box (ONLY shown when program requires input()) */}
              {inputSession && (
                <div className="p-3.5 bg-[#0a1510] border-b border-primary/40 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-primary font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                      <span>{inputSession.prompts[inputSession.currentIndex]}</span>
                    </span>
                    {inputSession.prompts.length > 1 && (
                      <span className="text-[11px] text-slate font-mono">
                        Input {inputSession.currentIndex + 1} of {inputSession.prompts.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputFieldRef}
                      type="text"
                      value={currentInputVal}
                      onChange={(e) => setCurrentInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleInputSubmit();
                        }
                      }}
                      placeholder="Type your answer and press Enter..."
                      className="flex-1 bg-black/90 border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3.5 py-2 text-xs font-mono text-paper placeholder-slate/50 outline-none transition-all shadow-inner"
                      autoFocus
                    />
                    <button
                      onClick={handleInputSubmit}
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shrink-0 shadow-md shadow-primary/20"
                    >
                      {inputSession.currentIndex + 1 < inputSession.prompts.length ? 'Next ↵' : 'Run Program ↵'}
                    </button>
                  </div>
                </div>
              )}

              {/* Terminal Screen Body */}
              <div 
                ref={terminalContainerRef}
                className="flex-1 p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-y-auto max-h-[440px] min-h-[320px] text-paper select-text w-full min-w-0"
              >
                {/* Standard Output */}
                {output && (
                  <pre className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-mono text-slate-200">
                    {output}
                  </pre>
                )}

                {/* Error diagnostics box */}
                {errorMsg && (
                  <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 font-mono text-xs">
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Traceback / Runtime Error:</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-red-300/90 text-[11px] leading-relaxed">
                      {errorMsg}
                    </pre>

                    {/* Beginner Explanation */}
                    {(() => {
                      const exp = getSimpleErrorExplanation(errorMsg);
                      if (!exp || (!exp.simpleMessage && !exp.hint)) return null;
                      return (
                        <div className="mt-2.5 pt-2 border-t border-red-500/20 text-red-100 text-[11px] flex items-start gap-1.5">
                          <span className="text-secondary shrink-0">💡 Fix tip:</span>
                          <span>
                            {exp.simpleMessage} {exp.hint && <span className="text-red-200/80">({exp.hint})</span>}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Terminal Status Footer */}
              <div className="px-4 py-2 bg-black/90 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2 text-slate">
                  <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-secondary animate-ping' : 'bg-primary'}`} />
                  <span className="text-slate/80">{statusText}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate/60 text-[10px]">
                  <Cpu className="w-3 h-3 text-primary" />
                  <span>Cloud CPython</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
