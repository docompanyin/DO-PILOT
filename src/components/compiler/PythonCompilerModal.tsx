import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, CheckCircle2, RotateCcw, X, Maximize2, 
  Minimize2, Trash2, Sparkles, ChevronRight, AlertCircle, 
  Code, Info, Check, Copy, Lightbulb, Trophy
} from 'lucide-react';
import { 
  runPythonCode, 
  runPythonUnitTest, 
  ExecutionResult, 
  UnitTestResult,
  getSimpleErrorExplanation, 
  checkOutputMatch,
  extractInputPrompts
} from '../../utils/pythonRunner';
import { useCoursePoints } from '../../context/CoursePointsContext';

export interface TaskContext {
  id: string;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Challenge';
  description: string;
  sampleInput?: string;
  sampleOutput: string;
  starterCode?: string;
  solutionCode?: string;
  isExercise?: boolean;
  testCode?: string;
}

interface PythonCompilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: TaskContext | null;
  onClearTask?: () => void;
}

export const PythonCompilerModal: React.FC<PythonCompilerModalProps> = ({
  isOpen,
  onClose,
  activeTask,
  onClearTask: _onClearTask
}) => {
  const { points, awardPoint, isTaskSolved } = useCoursePoints();

  const [code, setCode] = useState<string>(
    '# Welcome to DO PILOT Python Cloud IDE\n# Write Python 3.12 code here and click Run!\n\nprint("Hello, World!")\n'
  );
  const [interactiveInputVal, setInteractiveInputVal] = useState<string>('');
  const [showInputPrompt, setShowInputPrompt] = useState<boolean>(false);
  const [pendingMode, setPendingMode] = useState<'run' | 'test'>('run');
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Python 3.12 Ready');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'output' | 'task'>('output');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    passed: boolean;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  // Check if current code calls input()
  const promptMatch = code.match(/\binput\s*\(\s*(['"])(.*?)\1\s*\)/);
  const detectedPrompt = promptMatch ? promptMatch[2] : 'Program is waiting for input:';

  // When activeTask changes, setup editor
  useEffect(() => {
    if (activeTask) {
      setCode('# Write your Python program below:\n\n');
      setTerminalOutput('');
      setTerminalError(null);
      setTestResult(null);
      setInteractiveInputVal(activeTask.sampleInput || '');
      setShowInputPrompt(false);
      setActiveTab('output');
      setStatusMessage('Task loaded: Ready to code');
    }
  }, [activeTask]);

  // Scroll to bottom of terminal when output updates
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput, terminalError, showInputPrompt]);

  // Handle Tab key in code editor for 4-space indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      handleRunProgramClicked();
    }
  };

  const [modalInputQueue, setModalInputQueue] = useState<{
    prompts: string[];
    currentIndex: number;
    collectedValues: string[];
  } | null>(null);

  // Called when user clicks "Run Program"
  const handleRunProgramClicked = () => {
    if (isRunning) return;
    const detectedPrompts = extractInputPrompts(code);

    if (detectedPrompts.length > 0) {
      setPendingMode('run');
      setModalInputQueue({
        prompts: detectedPrompts.map(p => p.prompt),
        currentIndex: 0,
        collectedValues: []
      });
      setInteractiveInputVal('');
      setShowInputPrompt(true);
      setActiveTab('output');
      setStatusMessage(`Input required: ${detectedPrompts[0].prompt}`);
      setTimeout(() => {
        inputFieldRef.current?.focus();
      }, 80);
    } else {
      setShowInputPrompt(false);
      setModalInputQueue(null);
      executeCode('', 'run');
    }
  };

  // Called when user clicks "Test & Submit (+1 Pt)"
  const handleTestAndSubmitClicked = () => {
    if (!activeTask || isRunning) return;
    const detectedPrompts = extractInputPrompts(code);

    if (detectedPrompts.length > 0) {
      setPendingMode('test');
      setModalInputQueue({
        prompts: detectedPrompts.map(p => p.prompt),
        currentIndex: 0,
        collectedValues: []
      });
      setInteractiveInputVal(activeTask.sampleInput || '');
      setShowInputPrompt(true);
      setActiveTab('output');
      setStatusMessage(`Test input required: ${detectedPrompts[0].prompt}`);
      setTimeout(() => {
        inputFieldRef.current?.focus();
      }, 80);
    } else {
      setShowInputPrompt(false);
      setModalInputQueue(null);
      executeCode('', 'test');
    }
  };

  // Called ONLY after the user enters input and presses Enter or clicks Send
  const handleConfirmInputAndRun = (overrideInput?: string) => {
    const inputVal = typeof overrideInput === 'string' ? overrideInput : interactiveInputVal;

    if (modalInputQueue) {
      const nextValues = [...modalInputQueue.collectedValues, inputVal];
      const nextIndex = modalInputQueue.currentIndex + 1;

      if (nextIndex < modalInputQueue.prompts.length) {
        setModalInputQueue({
          ...modalInputQueue,
          currentIndex: nextIndex,
          collectedValues: nextValues
        });
        setInteractiveInputVal('');
        setStatusMessage(`Input required (${nextIndex + 1}/${modalInputQueue.prompts.length}): ${modalInputQueue.prompts[nextIndex]}`);
        setTimeout(() => {
          inputFieldRef.current?.focus();
        }, 80);
        return;
      }

      setShowInputPrompt(false);
      setModalInputQueue(null);
      executeCode(nextValues.join('\n'), pendingMode);
    } else {
      setShowInputPrompt(false);
      executeCode(inputVal, pendingMode);
    }
  };

  // Actual execution helper
  const executeCode = async (actualStdin: string, _mode: 'run' | 'test') => {
    setIsRunning(true);
    setTerminalError(null);
    setTestResult(null);
    setActiveTab('output');
    setStatusMessage('Executing Python 3.12...');

    try {
      // 1. If testing a task that specifies automated unit tests (unittest / pytest style)
      if (_mode === 'test' && activeTask?.testCode) {
        setStatusMessage('Running automated unit tests...');
        const unitRes: UnitTestResult = await runPythonUnitTest(
          code,
          activeTask.testCode,
          (msg) => setStatusMessage(msg)
        );

        setTerminalOutput(unitRes.rawOutput);
        if (unitRes.passed) {
          setTestResult({
            tested: true,
            passed: true,
            message: `🎉 All ${unitRes.totalTests} Unit Tests Passed! +1 Course Point Awarded!`
          });
          awardPoint(activeTask.id, activeTask.title, code);
        } else {
          const failDetail = unitRes.testDetails.find(t => !t.passed);
          setTestResult({
            tested: true,
            passed: false,
            message: `❌ Unit Test Failed: ${failDetail?.name || 'Assertion Error'}`
          });
          if (failDetail?.error) {
            setTerminalError(failDetail.error);
          }
        }
        setStatusMessage(`Unit Tests finished in ${unitRes.executionTimeMs}ms (${unitRes.engineUsed})`);
        return;
      }

      // 2. Functional STDOUT capture and execution
      const res: ExecutionResult = await runPythonCode(
        code,
        actualStdin,
        (msg) => setStatusMessage(msg)
      );

      setTerminalOutput(res.output || '');
      if (res.error) {
        setTerminalError(res.error);
        if (_mode === 'test' && activeTask) {
          setTestResult({
            tested: true,
            passed: false,
            message: '❌ Error in code execution. Review details below.'
          });
        }
      } else {
        // ONLY evaluate and award points when in TEST mode
        if (_mode === 'test' && activeTask && activeTask.sampleOutput) {
          const isMatch = checkOutputMatch(res.output || '', activeTask.sampleOutput);
          if (isMatch) {
            setTestResult({
              tested: true,
              passed: true,
              message: '🎉 Congratulations! Your output matches all task requirements. +1 Course Point Awarded!'
            });
            awardPoint(activeTask.id, activeTask.title, code);
          } else {
            setTestResult({
              tested: true,
              passed: false,
              message: '❌ Output mismatch (Wrong Answer). Points: 0 / 1. Review the comparison below.'
            });
          }
        }
      }
      setStatusMessage(`Finished in ${res.executionTimeMs}ms (${res.engineUsed})`);
    } catch (err: any) {
      setTerminalError(err?.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    if (activeTask) {
      setCode(activeTask.starterCode || `# Task: ${activeTask.title}\n\n`);
    } else {
      setCode('print("Hello, World!")\n');
    }
    setTerminalOutput('');
    setTerminalError(null);
    setTestResult(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Generate line numbers
  const lineCount = Math.max(code.split('\n').length, 12);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`w-full bg-[#0a0d12] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMaximized
              ? 'fixed inset-2 sm:inset-4 z-50 h-[calc(100vh-2rem)]'
              : 'max-w-6xl h-[88vh] max-h-[850px]'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-black/50">
            <div className="min-w-0 space-y-0.5">
              <h3 className="font-jakarta font-bold text-sm text-paper tracking-wide">
                DO PILOT • Cloud Python 3.12 Engine
              </h3>
              <p className="font-mono text-[11px] text-slate/70">
                {statusMessage}
              </p>
            </div>

            {/* Control Icons & Live Total Course Points */}
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-xs font-mono font-bold text-amber-300 shadow-sm shadow-amber-400/15"
                title="Your Total Course Points"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span>{points} pts</span>
              </div>

              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 rounded-xl text-slate hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                title="Close IDE"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Question & Instructions Banner */}
          {activeTask && (
            <div className="px-4 sm:px-6 py-3 bg-[#0d1219] border-b border-white/10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px] font-bold shrink-0">
                    PROGRAMMING TASK
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
                    isTaskSolved(activeTask.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'bg-amber-400/10 text-amber-300 border-amber-400/25'
                  }`}>
                    <Trophy className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                    <span>Points: {isTaskSolved(activeTask.id) ? '1 / 1' : '0 / 1'}</span>
                  </span>
                  <h4 className="font-jakarta font-bold text-sm text-paper truncate">
                    {activeTask.title}
                  </h4>
                </div>

                {/* Problem Instructions Box */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-paper leading-relaxed font-sans shadow-inner">
                  <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">
                    Problem Instructions (Type your solution below):
                  </span>
                  {activeTask.description}
                </div>
              </div>
            </div>
          )}

          {/* Main IDE Split: Editor (Left) & Output / Stdin (Right) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
            
            {/* Left Column: Code Editor (7 Cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 min-h-0 bg-black/60">
              
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate font-semibold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-primary" />
                    main.py
                  </span>
                  <span className="font-mono text-[10px] text-slate/50">
                    (Ctrl + Enter to Run)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2 py-1 rounded-lg text-slate hover:text-paper hover:bg-white/5 transition-colors font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="px-2 py-1 rounded-lg text-slate hover:text-paper hover:bg-white/5 transition-colors font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Reset to Template"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Editor Textarea with Line Numbers */}
              <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-black/50">
                {/* Line numbers gutter */}
                <div className="w-10 sm:w-12 py-3 select-none text-right pr-3 text-slate/30 bg-black/40 font-mono text-xs border-r border-white/5 overflow-hidden">
                  {lineNumbers.map((num) => (
                    <div key={num} className="leading-6">
                      {num}
                    </div>
                  ))}
                </div>

                {/* Code input */}
                <div className="flex-1 relative overflow-auto">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your Python code here..."
                    spellCheck={false}
                    className="w-full h-full p-3 bg-transparent text-paper font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none scrollbar-thin"
                    style={{ tabSize: 4 }}
                  />
                </div>
              </div>

              {/* Editor Bottom Action Strip */}
              <div className="p-3 border-t border-white/10 bg-black/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunProgramClicked}
                    disabled={isRunning}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span>Run Program</span>
                  </button>

                  {activeTask && (
                    <button
                      type="button"
                      onClick={handleTestAndSubmitClicked}
                      disabled={isRunning}
                      className="px-4 py-2 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs flex items-center gap-2 transition-all hover:bg-white hover:shadow-lg hover:shadow-primary/30 cursor-pointer disabled:opacity-50 shadow-md shadow-primary/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Test &amp; Submit (+1 Pt)</span>
                    </button>
                  )}
                </div>

                <div className="font-mono text-[11px] text-slate/60">
                  {lineCount} lines • Python 3.12 Engine
                </div>
              </div>
            </div>

            {/* Right Column: Terminal, Stdin, Task Info (5 Cols on desktop) */}
            <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#080b0f]">
              
              {/* Tab Selector */}
              <div className="flex items-center border-b border-white/10 bg-black/40 px-3 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('output')}
                  className={`px-3.5 py-2.5 font-mono text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'output'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate hover:text-paper'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal Output</span>
                </button>

                {activeTask && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('task')}
                    className={`px-3.5 py-2.5 font-mono text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'task'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate hover:text-paper'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Task Brief</span>
                  </button>
                )}

                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setTerminalOutput('');
                      setTerminalError(null);
                      setTestResult(null);
                    }}
                    className="p-1.5 text-slate hover:text-paper transition-colors cursor-pointer"
                    title="Clear Terminal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 p-4 overflow-auto font-mono text-xs min-h-0 space-y-3">
                
                {activeTab === 'output' && (
                  <div className="space-y-3">
                    
                    {/* Test Evaluation Feedback Box */}
                    {testResult && (
                      <div
                        className={`p-3.5 rounded-2xl border ${
                          testResult.passed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : terminalError
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        {terminalError ? (
                          (() => {
                            const expl = getSimpleErrorExplanation(terminalError);
                            return (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 font-jakarta font-bold text-xs text-rose-400">
                                  <AlertCircle className="w-4 h-4 shrink-0" />
                                  <span className="uppercase tracking-wider">{expl.title}</span>
                                </div>
                                <p className="font-sans text-xs font-semibold text-rose-200 leading-relaxed">
                                  {expl.simpleMessage}
                                </p>
                                {expl.hint && (
                                  <p className="font-sans text-xs text-rose-300/80 leading-relaxed pt-1.5 border-t border-rose-500/20">
                                    💡 <strong>Quick Fix:</strong> {expl.hint}
                                  </p>
                                )}
                              </div>
                            );
                          })()
                        ) : testResult.passed ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-jakarta font-bold text-xs text-emerald-400">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>CONGRATULATIONS! ALL TESTS PASSED (+1 Pt)</span>
                            </div>
                            <p className="font-sans text-xs opacity-90 leading-relaxed">
                              {testResult.message}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-jakarta font-bold text-xs text-amber-400">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>OUTPUT MISMATCH (WRONG ANSWER)</span>
                            </div>
                            <p className="font-sans text-xs opacity-90 leading-relaxed">
                              {testResult.message}
                            </p>

                            {activeTask && (
                              <div className="mt-2.5 pt-2 border-t border-amber-500/20 space-y-2">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate/80 block">
                                    Expected Output:
                                  </span>
                                  <pre className="p-2 rounded bg-black/60 text-paper font-mono text-xs whitespace-pre-wrap">
                                    {activeTask.sampleOutput}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate/80 block">
                                    Your Program Produced:
                                  </span>
                                  <pre className="p-2 rounded bg-black/60 text-amber-300 font-mono text-xs whitespace-pre-wrap">
                                    {terminalOutput || '(empty output)'}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Program Input Bar (ONLY shown after clicking Run/Test if code calls input()) */}
                    <AnimatePresence>
                      {showInputPrompt && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="p-3.5 rounded-2xl bg-[#0c1117] border-2 border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/20 space-y-2.5 my-2"
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 text-primary font-bold">
                              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                              <span>
                                {modalInputQueue
                                  ? modalInputQueue.prompts[modalInputQueue.currentIndex]
                                  : pendingMode === 'test'
                                  ? 'Test Input Required for input():'
                                  : `Program Input Required (${detectedPrompt}):`}
                              </span>
                              {modalInputQueue && modalInputQueue.prompts.length > 1 && (
                                <span className="text-[10px] text-slate font-mono font-normal">
                                  (Input {modalInputQueue.currentIndex + 1} of {modalInputQueue.prompts.length})
                                </span>
                              )}
                            </div>
                            {activeTask?.sampleInput && (
                              <button
                                type="button"
                                onClick={() => {
                                  setInteractiveInputVal(activeTask.sampleInput || '');
                                  setTimeout(() => inputFieldRef.current?.focus(), 50);
                                }}
                                className="text-[11px] text-amber-300 hover:text-white font-mono underline cursor-pointer"
                                title="Fill input box with sample data without running yet"
                              >
                                Fill Sample: &quot;{activeTask.sampleInput}&quot;
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              ref={inputFieldRef}
                              type="text"
                              value={interactiveInputVal}
                              onChange={(e) => setInteractiveInputVal(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleConfirmInputAndRun();
                                }
                              }}
                              placeholder={
                                modalInputQueue
                                  ? `Enter value for ${modalInputQueue.prompts[modalInputQueue.currentIndex]} (Press Enter)`
                                  : detectedPrompt
                                  ? `${detectedPrompt} (Press Enter to Run)`
                                  : 'Type your input and press Enter...'
                              }
                              className="flex-1 bg-black/90 rounded-xl px-3.5 py-2.5 text-xs font-mono text-paper placeholder-slate/50 border border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleConfirmInputAndRun()}
                              disabled={isRunning}
                              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 shrink-0"
                            >
                              {modalInputQueue && modalInputQueue.currentIndex + 1 < modalInputQueue.prompts.length
                                ? 'Next ↵'
                                : pendingMode === 'test'
                                ? 'Submit Test ↵'
                                : 'Run with Input ↵'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Standard Terminal Stream */}
                    <div className="space-y-2">
                      <div className="text-slate/50 text-[11px] flex items-center gap-1.5 font-mono">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>python3 main.py</span>
                      </div>

                      {terminalOutput ? (
                        <pre className="text-primary font-mono text-xs whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
                          {terminalOutput}
                        </pre>
                      ) : !terminalError && !isRunning ? (
                        <div className="text-slate/40 italic">
                          Click &quot;Run Program&quot; or press Ctrl+Enter to see the output here...
                        </div>
                      ) : null}

                      {/* Error output */}
                      {terminalError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
                          {terminalError}
                        </div>
                      )}

                      {/* Running spinner */}
                      {isRunning && (
                        <div className="flex items-center gap-2 text-primary font-mono text-xs py-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                          <span>{statusMessage}</span>
                        </div>
                      )}

                      <div ref={terminalEndRef} />
                    </div>
                  </div>
                )}

                {activeTab === 'task' && activeTask && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-jakarta font-black text-sm text-paper">
                          {activeTask.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold">
                          {activeTask.difficulty}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-slate leading-relaxed">
                        {activeTask.description}
                      </p>
                    </div>

                    {activeTask.sampleInput && (
                      <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">
                          Sample Input:
                        </span>
                        <pre className="font-mono text-xs text-paper whitespace-pre-wrap">
                          {activeTask.sampleInput}
                        </pre>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-primary/80 uppercase tracking-wider block">
                        Expected Output:
                      </span>
                      <pre className="font-mono text-xs text-primary/90 whitespace-pre-wrap">
                        {activeTask.sampleOutput}
                      </pre>
                    </div>

                    {activeTask.solutionCode && (
                      <details className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                        <summary className="font-sans font-semibold text-slate hover:text-paper cursor-pointer">
                          View Reference Solution
                        </summary>
                        <pre className="mt-2 p-2 rounded bg-black/80 text-paper font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                          {activeTask.solutionCode}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Floating Round Launcher Button
export const PythonCompilerLauncherButton: React.FC<{\n  onClick: () => void;\n  isOpen: boolean;\n}> = () => null;
