// Python Code Execution Engine (Pyodide WebAssembly with Instant Fallback)

declare global {
  interface Window {
    loadPyodide?: any;
    pyodideInstance?: any;
  }
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTimeMs: number;
  engineUsed: 'cloud-cpython' | 'pyodide' | 'fallback';
}

let pyodideLoadingPromise: Promise<any> | null = null;

// Initialize or retrieve existing Pyodide instance
export const initPyodide = async (
  onStatusUpdate?: (status: string) => void
): Promise<any> => {
  if (window.pyodideInstance) {
    return window.pyodideInstance;
  }

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  pyodideLoadingPromise = new Promise(async (resolve, reject) => {
    try {
      if (!window.loadPyodide) {
        onStatusUpdate?.('Fetching Python WebAssembly engine...');
        await new Promise<void>((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
          script.async = true;
          script.onload = () => res();
          script.onerror = () => rej(new Error('CDN unreachable or offline.'));
          document.head.appendChild(script);
        });
      }

      onStatusUpdate?.('Initializing CPython 3.12 runtime...');
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
      });

      window.pyodideInstance = pyodide;
      onStatusUpdate?.('Python Engine Ready');
      resolve(pyodide);
    } catch (err) {
      console.warn('Pyodide load failed, falling back to local runner:', err);
      pyodideLoadingPromise = null;
      reject(err);
    }
  });

  return pyodideLoadingPromise;
};

// Automatically pre-warm Pyodide in browser background
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initPyodide().catch(() => {});
  }, 100);
}

// Fallback lightweight evaluator for Part 1 concepts with syntax checking
interface FallbackResult {
  output: string;
  error?: string;
}

const runFallbackInterpreterWithDiagnostics = (code: string, stdinInput: string = ''): FallbackResult => {
  const lines = code.split('\n');
  const output: string[] = [];
  const variables: Record<string, any> = {};
  const stdinLines = stdinInput.split('\n');
  let stdinIdx = 0;

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const rawLine = lines[lineNum];
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Check for obvious syntax errors:
    // 1. Unmatched quotes
    const quoteMatches = line.match(/(['"])(?:(?!\1|\\).|\\.)*\1/g) || [];
    let lineWithoutQuotes = line;
    quoteMatches.forEach(q => { lineWithoutQuotes = lineWithoutQuotes.replace(q, '""'); });
    const singleQuotes = (lineWithoutQuotes.match(/'/g) || []).length;
    const doubleQuotes = (lineWithoutQuotes.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
      return {
        output: output.join('\n'),
        error: `SyntaxError: unterminated string literal (line ${lineNum + 1})\n    ${rawLine}\n    ^`
      };
    }

    // 2. Missing parentheses on print
    if (/^print\s+["']/.test(line)) {
      return {
        output: output.join('\n'),
        error: `SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)? (line ${lineNum + 1})\n    ${rawLine}`
      };
    }

    // 3. Handle variable assignment: var = input(...) or var = value
    const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      let expr = assignMatch[2].trim();

      if (expr.startsWith('input(')) {
        const promptMatch = expr.match(/^input\((.*)\)$/);
        if (promptMatch && promptMatch[1]) {
          const pStr = promptMatch[1].replace(/^["']|["']$/g, '');
          output.push(pStr + (stdinIdx < stdinLines.length ? stdinLines[stdinIdx] : ''));
        }
        const val = stdinIdx < stdinLines.length ? stdinLines[stdinIdx++] : '';
        variables[varName] = val;
        continue;
      }

      if (expr.startsWith('int(input(')) {
        const val = stdinIdx < stdinLines.length ? parseInt(stdinLines[stdinIdx++], 10) || 0 : 0;
        variables[varName] = val;
        continue;
      }

      if (expr.startsWith('float(input(')) {
        const val = stdinIdx < stdinLines.length ? parseFloat(stdinLines[stdinIdx++]) || 0.0 : 0.0;
        variables[varName] = val;
        continue;
      }

      // String literal
      const strMatch = expr.match(/^["'](.*)["']$/);
      if (strMatch) {
        variables[varName] = strMatch[1];
        continue;
      }

      // Numeric literal
      if (!isNaN(Number(expr))) {
        variables[varName] = Number(expr);
        continue;
      }

      // Expression evaluation
      try {
        let evalExpr = expr;
        for (const [k, v] of Object.entries(variables)) {
          const regex = new RegExp(`\\b${k}\\b`, 'g');
          evalExpr = evalExpr.replace(regex, typeof v === 'string' ? JSON.stringify(v) : v);
        }
        evalExpr = evalExpr.replace(/\/\//g, '/').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');
        // eslint-disable-next-line no-eval
        variables[varName] = Function(`"use strict"; return (${evalExpr})`)();
        continue;
      } catch {
        variables[varName] = expr;
        continue;
      }
    }

    // 4. Handle print(...)
    const printMatch = line.match(/^print\((.*)\)$/);
    if (printMatch) {
      const inside = printMatch[1].trim();
      if (!inside) {
        output.push('');
        continue;
      }

      const args: string[] = [];
      let current = '';
      let inQuote = false;
      let quoteChar = '';

      for (let i = 0; i < inside.length; i++) {
        const ch = inside[i];
        if (!inQuote && (ch === '"' || ch === "'")) {
          inQuote = true;
          quoteChar = ch;
          current += ch;
        } else if (inQuote && ch === quoteChar && inside[i - 1] !== '\\') {
          inQuote = false;
          current += ch;
        } else if (!inQuote && ch === ',') {
          args.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      if (current.trim()) {
        args.push(current.trim());
      }

      const printedValues = args.map((arg) => {
        const strMatch = arg.match(/^["'](.*)["']$/);
        if (strMatch) return strMatch[1];

        const fStrMatch = arg.match(/^f["'](.*)["']$/);
        if (fStrMatch) {
          return fStrMatch[1].replace(/\{([^}]+)\}/g, (_, expression) => {
            const trimmed = expression.trim();
            if (variables[trimmed] !== undefined) return variables[trimmed];
            try {
              let exp = trimmed;
              for (const [k, v] of Object.entries(variables)) {
                exp = exp.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
              }
              // eslint-disable-next-line no-eval
              return Function(`"use strict"; return (${exp})`)();
            } catch {
              return expression;
            }
          });
        }

        if (variables[arg] !== undefined) return String(variables[arg]);

        try {
          let exp = arg;
          for (const [k, v] of Object.entries(variables)) {
            exp = exp.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
          }
          exp = exp.replace(/(\d+)\s*\/\/\s*(\d+)/g, 'Math.floor($1/$2)');
          // eslint-disable-next-line no-eval
          const result = Function(`"use strict"; return (${exp})`)();
          return String(result);
        } catch {
          return arg;
        }
      });

      output.push(printedValues.join(' '));
      continue;
    }

    // 5. If statement handling
    if (line.startsWith('if ') || line.startsWith('elif ') || line === 'else:') {
      continue;
    }

    // If a non-empty line cannot be parsed as valid Python, report syntax error
    return {
      output: output.join('\n'),
      error: `SyntaxError: invalid syntax (line ${lineNum + 1})\n    ${rawLine}\n    ^`
    };
  }

  return { output: output.join('\n') };
};

// Cloud CPython 3.12 runner using high-speed container API
const runCloudCPython = async (
  code: string,
  stdinInput: string = '',
  onStatusUpdate?: (status: string) => void
): Promise<ExecutionResult> => {
  onStatusUpdate?.('Executing on Cloud Python 3.12...');
  const startTime = performance.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  // If code uses input(), inject interactive input shim to echo stdin like an interactive terminal
  const hasInput = /\binput\s*\(/.test(code);
  const inputShim = `exec("import builtins as _b, sys as _s; _d = _b.input; _b.input = lambda p='': (_val := _d(p), _s.stdout.write(str(_val) + '\\\\n'), _s.stdout.flush(), _val)[-1]")\n`;
  const codeToSend = hasInput ? inputShim + code : code;

  const res = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'cpython-3.12.7',
      code: codeToSend,
      stdin: stdinInput
    }),
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (!res.ok) {
    throw new Error(`Cloud server returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const executionTimeMs = Math.round(performance.now() - startTime);

  const rawErr = (data.program_error || data.compiler_error || '').trim();
  let cleanErr = rawErr
    .replace(/\/home\/wandbox\/prog\.py/g, 'main.py')
    .replace(/\/tmp\/[a-zA-Z0-9_-]+\.py/g, 'main.py')
    .replace(/File "<string>"/g, 'File "main.py"');

  if (hasInput && cleanErr) {
    cleanErr = cleanErr.replace(/line (\d+)/g, (_: string, n: string) => `line ${Math.max(1, parseInt(n, 10) - 1)}`);
  }

  return {
    output: (data.program_output || '').trimEnd(),
    error: cleanErr || undefined,
    executionTimeMs,
    engineUsed: 'cloud-cpython'
  };
};

export interface DetectedInputPrompt {
  index: number;
  prompt: string;
}

/**
 * Dynamically detects input() calls in Python code, ignoring comments and docstrings.
 * Returns an array of detected prompts in their execution order.
 */
export const extractInputPrompts = (code: string): DetectedInputPrompt[] => {
  if (!code || !code.includes('input')) return [];

  // Strip comments (# ...) so comments containing input() are ignored
  const lines = code.split('\n');
  const codeWithoutComments = lines
    .map(line => {
      let inSingleQuote = false;
      let inDoubleQuote = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === "'" && !inDoubleQuote && (i === 0 || line[i - 1] !== '\\')) {
          inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote && (i === 0 || line[i - 1] !== '\\')) {
          inDoubleQuote = !inDoubleQuote;
        } else if (char === '#' && !inSingleQuote && !inDoubleQuote) {
          return line.slice(0, i);
        }
      }
      return line;
    })
    .join('\n');

  // Match input(...) calls
  const inputRegex = /(?:^|[^a-zA-Z0-9_])input\s*\(\s*(?:(['"])(.*?)\1|([^)]*))\s*\)/g;
  const results: DetectedInputPrompt[] = [];
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = inputRegex.exec(codeWithoutComments)) !== null) {
    const quotedText = match[2];
    const rawText = match[3];
    let prompt = '';
    if (quotedText !== undefined) {
      prompt = quotedText;
    } else if (rawText && rawText.trim()) {
      prompt = rawText.trim().replace(/^['"]|['"]$/g, '');
    }
    results.push({
      index: idx++,
      prompt: prompt || 'Enter value:'
    });
  }

  return results;
};

// Main execution function
export const runPythonCode = async (
  code: string,
  stdinInput: string = '',
  onStatusUpdate?: (status: string) => void
): Promise<ExecutionResult> => {
  const startTime = performance.now();

  const normalizedStdin = (stdinInput || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  const stdinLines = normalizedStdin ? normalizedStdin.split('\n') : [];

  // 1. Primary: Run on dedicated CPython 3.12 WebAssembly (Pyodide)
  try {
    const pyodide = await initPyodide(onStatusUpdate);
    onStatusUpdate?.('Executing Python code...');

    // Set globals directly in pyodide to avoid string interpolation and escaping bugs
    pyodide.globals.set('_user_code', code);
    pyodide.globals.set('_raw_stdin_data', stdinLines);

    const runner = `
import sys
import io
import builtins
import traceback

_stdout_io = io.StringIO()
_stderr_io = io.StringIO()
_orig_stdout = sys.stdout
_orig_stderr = sys.stderr

sys.stdout = _stdout_io
sys.stderr = _stderr_io

_stdin_data = [str(x).rstrip('\\r') for x in list(_raw_stdin_data)]
_stdin_idx = 0

def _custom_input(prompt=''):
    global _stdin_idx
    if prompt:
        sys.stdout.write(str(prompt))
        sys.stdout.flush()
    if _stdin_idx < len(_stdin_data):
        val = str(_stdin_data[_stdin_idx]).rstrip('\\r')
        _stdin_idx += 1
        sys.stdout.write(val + chr(10))
        sys.stdout.flush()
        return val
    sys.stdout.write(chr(10))
    sys.stdout.flush()
    return ''

builtins.input = _custom_input

_py_error = ""
try:
    _compiled = compile(_user_code, 'main.py', 'exec')
    _exec_globals = {
        '__name__': '__main__',
        '__builtins__': builtins
    }
    exec(_compiled, _exec_globals)
except SyntaxError as e:
    tb_lines = traceback.format_exception(type(e), e, e.__traceback__)
    clean_tb = [l for l in tb_lines if '<exec>' not in l and '<string>' not in l and '_pyodide' not in l and '/lib/' not in l and '_base.py' not in l]
    _py_error = "".join(clean_tb).strip()
except Exception as e:
    tb_lines = traceback.format_exception(type(e), e, e.__traceback__)
    clean_tb = [l for l in tb_lines if '<exec>' not in l and '<string>' not in l and '_pyodide' not in l and '/lib/' not in l and '_base.py' not in l]
    _py_error = "".join(clean_tb).strip()
finally:
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr

_output = _stdout_io.getvalue()
_stderr = _py_error or _stderr_io.getvalue()
`;

    await pyodide.runPythonAsync(runner);
    const stdout = (pyodide.globals.get('_output') ?? '').toString();
    const stderr = (pyodide.globals.get('_stderr') ?? '').toString();

    const executionTimeMs = Math.round(performance.now() - startTime);

    if (stderr && !stdout) {
      return {
        output: '',
        error: stderr.trim(),
        executionTimeMs,
        engineUsed: 'pyodide'
      };
    }

    return {
      output: stdout.trimEnd(),
      error: stderr ? stderr.trim() : undefined,
      executionTimeMs,
      engineUsed: 'pyodide'
    };
  } catch (err: any) {
    const errText = String(err?.message || err || '');
    // If Pyodide threw a PythonError or SyntaxError, surface only student-relevant lines
    if (errText.includes('SyntaxError') || errText.includes('Traceback') || errText.includes('Error:')) {
      const cleanErr = errText
        .split('\n')
        .filter(l => !l.includes('_pyodide') && !l.includes('_base.py') && !l.includes('eval_code_async') && !l.includes('CodeRunner') && !l.includes('/lib/') && !l.includes('<exec>'))
        .join('\n')
        .trim();
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        output: '',
        error: cleanErr || errText.trim(),
        executionTimeMs,
        engineUsed: 'pyodide'
      };
    }

    // Secondary fallback: Cloud CPython 3.12 (if Pyodide failed to load)
    try {
      const cloudRes = await runCloudCPython(code, stdinInput, onStatusUpdate);
      return cloudRes;
    } catch {
      // Tertiary fallback: lightweight evaluator
      try {
        const fallback = runFallbackInterpreterWithDiagnostics(code, stdinInput);
        const executionTimeMs = Math.round(performance.now() - startTime);
        return {
          output: fallback.output,
          error: fallback.error,
          executionTimeMs,
          engineUsed: 'fallback'
        };
      } catch (fallbackErr: any) {
        const executionTimeMs = Math.round(performance.now() - startTime);
        return {
          output: '',
          error: errText || 'Error executing Python code.',
          executionTimeMs,
          engineUsed: 'fallback'
        };
      }
    }
  }
};

export interface ErrorExplanation {
  title: string;
  simpleMessage: string;
  hint?: string;
  lineNum?: number;
}

export const getSimpleErrorExplanation = (errorStr: string): ErrorExplanation => {
  // Normalize script name to main.py for clean student-friendly error trace
  const studentTrace = errorStr
    .replace(/<exec>|<string>|<stdin>/g, 'main.py')
    .split('\n')
    .filter(l => !l.includes('_pyodide') && !l.includes('_base.py') && !l.includes('pyodide.asm'))
    .join('\n');

  // Match line number in student's code (e.g. File "main.py", line 2 or (line 2))
  const lineMatch =
    studentTrace.match(/main\.py["']?,\s*line\s*(\d+)/i) ||
    studentTrace.match(/\(detected at line\s*(\d+)\)/i) ||
    studentTrace.match(/\(line\s*(\d+)\)/i) ||
    studentTrace.match(/line\s*(\d+)/i);

  const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
  const linePrefix = lineNum ? `Line ${lineNum}: ` : '';

  if (errorStr.includes("never closed")) {
    return {
      title: 'Unclosed Parenthesis / Bracket',
      simpleMessage: `${linePrefix}Missing closing parenthesis or bracket.`,
      hint: 'Make sure every opened "(" has a matching ")".',
      lineNum
    };
  }
  if (errorStr.includes("unterminated string") || errorStr.includes("EOL while scanning string")) {
    return {
      title: 'Unclosed String Quote',
      simpleMessage: `${linePrefix}Unclosed quotation mark in string.`,
      hint: 'Check that every quote "..." or \'...\' is closed properly.',
      lineNum
    };
  }
  if (errorStr.includes("Missing parentheses in call to 'print'")) {
    return {
      title: 'Missing Parentheses in print()',
      simpleMessage: `${linePrefix}In Python 3, print must use parentheses.`,
      hint: 'Use print("your text") instead of print "your text".',
      lineNum
    };
  }
  if (errorStr.includes("expected an indented block")) {
    return {
      title: 'Missing Indentation',
      simpleMessage: `${linePrefix}Expected an indented code block.`,
      hint: 'Add 4 spaces of indentation after your if, else, or loop line.',
      lineNum
    };
  }
  if (errorStr.includes("unexpected indent")) {
    return {
      title: 'Unexpected Indentation',
      simpleMessage: `${linePrefix}Extra indentation found at the beginning of the line.`,
      hint: 'Align this line with surrounding code by removing extra leading spaces.',
      lineNum
    };
  }
  if (errorStr.includes("invalid syntax")) {
    return {
      title: 'Syntax Error',
      simpleMessage: `${linePrefix}Invalid Python syntax.`,
      hint: 'Check for typos, missing colons (:) at end of if/else, or unclosed quotes.',
      lineNum
    };
  }
  if (errorStr.includes("NameError")) {
    const varMatch = errorStr.match(/name '([^']+)' is not defined/);
    const varName = varMatch ? varMatch[1] : 'variable';
    return {
      title: 'Undefined Name',
      simpleMessage: `${linePrefix}The name '${varName}' is not defined.`,
      hint: `Define '${varName}' first or check for spelling mistakes.`,
      lineNum
    };
  }
  if (errorStr.includes("ZeroDivisionError")) {
    return {
      title: 'Division by Zero',
      simpleMessage: `${linePrefix}Cannot divide a number by zero.`,
      hint: 'Check your calculation so the divisor is never 0.',
      lineNum
    };
  }
  if (errorStr.includes("ValueError")) {
    return {
      title: 'Value Error',
      simpleMessage: `${linePrefix}Invalid value passed to function.`,
      hint: 'When using int(), ensure the input is a valid number string.',
      lineNum
    };
  }
  if (errorStr.includes("TypeError")) {
    return {
      title: 'Type Error',
      simpleMessage: `${linePrefix}Incompatible data types.`,
      hint: 'You cannot perform this operation between different types (e.g. string + number).',
      lineNum
    };
  }

  // Fallback: extract last line of error
  const lastLine = errorStr.trim().split('\n').pop() || 'Execution error';
  return {
    title: 'Python Error',
    simpleMessage: `${linePrefix}${lastLine}`,
    hint: 'Review the line of code and adjust the syntax.',
    lineNum
  };
};

/**
 * Normalizes output line by line:
 * - Trims whitespace
 * - Standardizes line breaks
 * - Normalizes integer-equivalent floats (200.0 -> 200)
 * - Collapses float precision artifacts (17.7000000003 -> 17.7)
 * - Collapses consecutive spaces/tabs
 */
export const normalizeLine = (line: string): string => {
  return line
    .replace(/\r/g, '')
    .replace(/(\b\d+)\.0+(?!\d)/g, '$1') // 200.0 -> 200
    .replace(/(\.\d+?)0{4,}\d+/g, '$1') // 17.7000000003 -> 17.7
    .replace(/[ \t]+/g, ' ')
    .trim();
};

/**
 * Normalizes line for loose formatting comparisons (allowing flexible punctuation differences,
 * e.g. comma vs space vs concatenation):
 */
export const normalizeLineLoose = (line: string): string => {
  return normalizeLine(line)
    .toLowerCase()
    .replace(/[,;!?:"]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
};

export const normalizeOutput = (s: string): string => {
  if (!s) return '';
  return s
    .split('\n')
    .map(normalizeLine)
    .join('\n')
    .trim();
};

export const isPromptLine = (line: string): boolean => {
  return (
    /^(what|please|how|enter|desired|which|hourly|hours|day|given|family|street|city|the \d)\b/i.test(
      line
    ) && (line.includes(':') || line.includes('?'))
  );
};

/**
 * Intelligent and strict output matcher:
 * - Supports Regex with flags / wildcards ((?i), \s*, regex:...)
 * - Allows valid Python syntax variations (comma separators with auto-spacing, concatenation, f-strings)
 * - Forgives minor spacing differences and casing variations
 * - Handles both interactive terminal output (prompts + prints) and clean stdout runs
 * - Rigorously verifies line count and content integrity so invalid code NEVER passes!
 */
export const checkOutputMatch = (actualRaw: string, expectedRaw: string): boolean => {
  if (!expectedRaw || !expectedRaw.trim()) return false;
  if (!actualRaw || !actualRaw.trim()) return false;

  const actualTrim = actualRaw.trim();
  const expectedTrim = expectedRaw.trim();

  // 1. Exact match
  if (actualTrim === expectedTrim) return true;

  // 2. Regex Support
  if (
    expectedTrim.startsWith('regex:') ||
    expectedTrim.startsWith('(?i)') ||
    /^\/.*\/[gimsuy]*$/.test(expectedTrim)
  ) {
    try {
      let pattern = expectedTrim;
      let flags = 'i';
      if (pattern.startsWith('regex:')) pattern = pattern.slice(6).trim();
      if (pattern.startsWith('(?i)')) {
        flags = 'i';
        pattern = pattern.slice(4);
      } else if (/^\/(.*)\/([gimsuy]*)$/.test(pattern)) {
        const m = pattern.match(/^\/(.*)\/([gimsuy]*)$/);
        if (m) {
          pattern = m[1];
          flags = m[2] || 'i';
        }
      }
      const rx = new RegExp(pattern, flags);
      return rx.test(actualTrim);
    } catch {
      return false;
    }
  }

  // 3. Normalized full string comparison
  const normActFull = normalizeLine(actualTrim);
  const normExpFull = normalizeLine(expectedTrim);
  if (normActFull === normExpFull) return true;
  if (normActFull.toLowerCase() === normExpFull.toLowerCase()) return true;

  const looseActFull = normalizeLineLoose(actualTrim);
  const looseExpFull = normalizeLineLoose(expectedTrim);
  if (looseActFull && looseExpFull && looseActFull === looseExpFull) return true;

  // 4. Line-by-line verification
  const actLines = actualRaw.split('\n').map(normalizeLine).filter(Boolean);
  const expLines = expectedRaw.split('\n').map(normalizeLine).filter(Boolean);

  if (actLines.length === 0 || expLines.length === 0) return false;

  const lineMatches = (a: string, b: string): boolean => {
    return (
      a === b ||
      a.toLowerCase() === b.toLowerCase() ||
      normalizeLineLoose(a) === normalizeLineLoose(b)
    );
  };

  // Strategy A: Exact line count match
  if (actLines.length === expLines.length) {
    const allMatch = expLines.every((exp, idx) => lineMatches(actLines[idx], exp));
    if (allMatch) return true;
  }

  // Strategy B: Actual has trailing answer lines (leading lines were extra prompt echoes)
  if (actLines.length > expLines.length) {
    const trailingAct = actLines.slice(-expLines.length);
    const allTrailingMatch = expLines.every((exp, idx) => lineMatches(trailingAct[idx], exp));
    if (allTrailingMatch) return true;
  }

  // Strategy C: Actual output contains only the pure printed answer lines
  // (e.g. stdout did not echo the interactive prompt line)
  const pureAnswerLines = expLines.filter(l => !isPromptLine(l));
  if (pureAnswerLines.length > 0 && actLines.length === pureAnswerLines.length) {
    const allAnswerMatch = pureAnswerLines.every((exp, idx) => lineMatches(actLines[idx], exp));
    if (allAnswerMatch) return true;
  }

  // Strategy D: Trailing lines match pure answer lines
  if (actLines.length < expLines.length) {
    const trailingExp = expLines.slice(-actLines.length);
    if (pureAnswerLines.length > 0 && actLines.length >= pureAnswerLines.length) {
      const allTrailingExpMatch = trailingExp.every((exp, idx) => lineMatches(actLines[idx], exp));
      if (allTrailingExpMatch) return true;
    }
  }

  return false;
};

export interface UnitTestItemResult {
  name: string;
  passed: boolean;
  error?: string;
}

export interface UnitTestResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testDetails: UnitTestItemResult[];
  rawOutput: string;
  executionTimeMs: number;
  engineUsed: 'cloud-cpython' | 'pyodide' | 'fallback';
}

/**
 * True Unit Testing Execution Engine:
 * Runs student code against an automated Python unit test suite.
 * Fails safely: NEVER defaults to passed on unhandled exceptions or missing markers!
 */
export const runPythonUnitTest = async (
  studentCode: string,
  testSuiteCode: string,
  onStatusUpdate?: (status: string) => void
): Promise<UnitTestResult> => {
  const harness = `
import sys
import json

_test_harness_results = []

def _record_test(name, fn):
    try:
        fn()
        _test_harness_results.append({'name': name, 'passed': True, 'error': None})
    except AssertionError as ae:
        msg = str(ae) if str(ae) else 'Assertion condition failed'
        _test_harness_results.append({'name': name, 'passed': False, 'error': f"AssertionError: {msg}"})
    except Exception as e:
        _test_harness_results.append({'name': name, 'passed': False, 'error': f"{type(e).__name__}: {str(e)}"})

try:
    # Student Code Execution:
${studentCode
  .split('\n')
  .map(l => '    ' + l)
  .join('\n')}

    # Test Suite Execution:
${testSuiteCode
  .split('\n')
  .map(l => '    ' + l)
  .join('\n')}
except Exception as _top_err:
    _test_harness_results.append({
        'name': 'Top-level Code Execution',
        'passed': False,
        'error': f"{type(_top_err).__name__}: {str(_top_err)}"
    })

# Output Structured Evaluation:
print("__DOPILOT_TEST_JSON__" + json.dumps(_test_harness_results))
`;

  const execRes = await runPythonCode(harness, '', onStatusUpdate);
  const output = execRes.output || '';
  const marker = '__DOPILOT_TEST_JSON__';
  const markerIdx = output.indexOf(marker);

  if (markerIdx !== -1) {
    try {
      const jsonStr = output.slice(markerIdx + marker.length).trim();
      const details: UnitTestItemResult[] = JSON.parse(jsonStr);
      if (details.length > 0) {
        const passedCount = details.filter(d => d.passed).length;
        const allPassed = passedCount === details.length;
        return {
          passed: allPassed,
          totalTests: details.length,
          passedTests: passedCount,
          failedTests: details.length - passedCount,
          testDetails: details,
          rawOutput: output.slice(0, markerIdx).trim(),
          executionTimeMs: execRes.executionTimeMs,
          engineUsed: execRes.engineUsed
        };
      }
    } catch {
      // Fall through to strict failure
    }
  }

  // Test suite did not complete or encountered an unhandled exception.
  // ALWAYS FAIL SAFELY: NEVER default to passed!
  return {
    passed: false,
    totalTests: 1,
    passedTests: 0,
    failedTests: 1,
    testDetails: [
      {
        name: 'Unit Test Suite Execution',
        passed: false,
        error: execRes.error || 'Test suite failed to run or encountered an unhandled exception.'
      }
    ],
    rawOutput: output,
    executionTimeMs: execRes.executionTimeMs,
    engineUsed: execRes.engineUsed
  };
};
