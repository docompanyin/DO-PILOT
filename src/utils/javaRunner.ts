// Java Code Execution & Simulation Engine for DO PILOT
export interface JavaExecutionResult {
  output: string;
  error?: string;
  executionTimeMs: number;
}

export interface JavaUnitTestResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  error?: string;
  feedback: string;
}

// Beginner-friendly error explanation helper
export const getSimpleJavaErrorExplanation = (rawError: string): string => {
  if (!rawError) return 'An unexpected error occurred during execution.';

  if (rawError.includes('missing semicolon') || rawError.includes('; expected')) {
    return 'Syntax Error: Semicolon missing! In Java, every statement must end with a semicolon (;).';
  }
  if (rawError.includes('cannot find symbol') && rawError.includes('System')) {
    return 'Case Sensitivity Error: "System" must be capitalized with an uppercase "S".';
  }
  if (rawError.includes('cannot find symbol') && rawError.includes('Scanner')) {
    return 'Missing Import Error: You must include "import java.util.Scanner;" at the top of your program.';
  }
  if (rawError.includes('unclosed string literal') || rawError.includes('illegal start of expression')) {
    return 'String Quote Error: Strings must be enclosed in matching double quotes ("). Single quotes are only for single char characters.';
  }
  if (rawError.includes('incompatible types: String cannot be converted to int')) {
    return 'Type Mismatch: You attempted to assign text to an integer variable. Use Integer.valueOf(...) to parse numbers.';
  }
  if (rawError.includes('ArithmeticException: / by zero')) {
    return 'Runtime Error: Division by zero is mathematically undefined and throws an ArithmeticException.';
  }
  if (rawError.includes('NumberFormatException')) {
    return 'Input Error: The user entered non-numeric text when a number was expected by Integer.valueOf() or Double.valueOf().';
  }

  return rawError;
};

// Check if terminal output matches expected output
export const checkOutputMatch = (actual: string, expected: string): boolean => {
  const normActual = actual.replace(/\r\n/g, '\n').trim();
  const normExpected = expected.replace(/\r\n/g, '\n').trim();
  return normActual === normExpected;
};

// Simulated Java Interpreter for in-browser client execution
export const runJavaCode = async (
  code: string,
  providedInput?: string
): Promise<JavaExecutionResult> => {
  const startTime = performance.now();

  try {
    // 1. Basic Syntax Validation
    const cleanCode = code.trim();
    if (!cleanCode) {
      return {
        output: '',
        error: 'Cannot execute empty code.',
        executionTimeMs: 0
      };
    }

    // Check for lowercase 'system.out'
    if (/system\.out\.(println|print)/.test(cleanCode)) {
      return {
        output: '',
        error: 'error: package system does not exist. Remember: Java is case-sensitive; use System.out.println().',
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // Check for missing semicolons on print statements
    const printLines = cleanCode.split('\n').filter(l => l.trim().startsWith('System.out.print'));
    for (const line of printLines) {
      const trimmed = line.trim();
      if (!trimmed.endsWith(';') && !trimmed.endsWith('{')) {
        return {
          output: '',
          error: `error: ';' expected on statement: ${trimmed}`,
          executionTimeMs: Math.round(performance.now() - startTime)
        };
      }
    }

    // Check Scanner usage without import
    if (cleanCode.includes('new Scanner') && !cleanCode.includes('import java.util.Scanner') && !cleanCode.includes('java.util.Scanner')) {
      return {
        output: '',
        error: 'error: cannot find symbol: class Scanner. Add "import java.util.Scanner;" at the top of your program.',
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // 2. Parse & Simulate Program Output
    const outputs: string[] = [];
    const inputsQueue: string[] = providedInput ? providedInput.split('\n') : [];
    const variables: Record<string, any> = {};

    const lines = cleanCode.split('\n');
    let currentLineBuffer = '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;

      // Handle String variables
      const stringVarMatch = line.match(/^String\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+?);?$/);
      if (stringVarMatch) {
        const varName = stringVarMatch[1];
        let valExpr = stringVarMatch[2].replace(/;$/, '').trim();

        if (valExpr.includes('scanner.nextLine()')) {
          variables[varName] = inputsQueue.shift() || 'Ada';
        } else if (valExpr.startsWith('"') && valExpr.endsWith('"')) {
          variables[varName] = valExpr.slice(1, -1);
        } else {
          variables[varName] = valExpr;
        }
        continue;
      }

      // Handle int variables
      const intVarMatch = line.match(/^int\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+?);?$/);
      if (intVarMatch) {
        const varName = intVarMatch[1];
        let valExpr = intVarMatch[2].replace(/;$/, '').trim();

        if (valExpr.includes('Integer.valueOf(scanner.nextLine())') || valExpr.includes('scanner.nextInt()')) {
          const nextIn = inputsQueue.shift() || '42';
          const num = parseInt(nextIn, 10);
          if (isNaN(num)) {
            return {
              output: outputs.join('\n'),
              error: `Exception in thread "main" java.lang.NumberFormatException: For input string: "${nextIn}"`,
              executionTimeMs: Math.round(performance.now() - startTime)
            };
          }
          variables[varName] = num;
        } else {
          try {
            // Evaluate basic integer math expressions safely
            let safeExpr = valExpr;
            Object.keys(variables).forEach(k => {
              safeExpr = safeExpr.replace(new RegExp(`\\b${k}\\b`, 'g'), String(variables[k]));
            });
            // eslint-disable-next-line no-eval
            const calculated = Math.floor(Function(`'use strict'; return (${safeExpr})`)());
            variables[varName] = calculated;
          } catch {
            variables[varName] = 0;
          }
        }
        continue;
      }

      // Handle double variables
      const doubleVarMatch = line.match(/^double\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+?);?$/);
      if (doubleVarMatch) {
        const varName = doubleVarMatch[1];
        let valExpr = doubleVarMatch[2].replace(/;$/, '').trim();

        if (valExpr.includes('Double.valueOf(scanner.nextLine())') || valExpr.includes('scanner.nextDouble()')) {
          const nextIn = inputsQueue.shift() || '3.14';
          const num = parseFloat(nextIn);
          if (isNaN(num)) {
            return {
              output: outputs.join('\n'),
              error: `Exception in thread "main" java.lang.NumberFormatException: For input string: "${nextIn}"`,
              executionTimeMs: Math.round(performance.now() - startTime)
            };
          }
          variables[varName] = num;
        } else {
          try {
            let safeExpr = valExpr.replace(/\(double\)/g, '');
            Object.keys(variables).forEach(k => {
              safeExpr = safeExpr.replace(new RegExp(`\\b${k}\\b`, 'g'), String(variables[k]));
            });
            // eslint-disable-next-line no-eval
            const calculated = Function(`'use strict'; return (${safeExpr})`)();
            variables[varName] = Number(calculated);
          } catch {
            variables[varName] = 0.0;
          }
        }
        continue;
      }

      // Handle boolean variables
      const boolVarMatch = line.match(/^boolean\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+?);?$/);
      if (boolVarMatch) {
        const varName = boolVarMatch[1];
        let valExpr = boolVarMatch[2].replace(/;$/, '').trim();
        if (valExpr.includes('Boolean.valueOf(scanner.nextLine())')) {
          const nextIn = inputsQueue.shift() || 'true';
          variables[varName] = nextIn.toLowerCase() === 'true';
        } else {
          variables[varName] = valExpr === 'true';
        }
        continue;
      }

      // Handle System.out.println(...)
      const printlnMatch = line.match(/System\.out\.println\((.*)\);?/);
      if (printlnMatch) {
        const arg = printlnMatch[1].trim();
        const evaluatedText = evaluatePrintExpression(arg, variables);
        outputs.push(currentLineBuffer + evaluatedText);
        currentLineBuffer = '';
        continue;
      }

      // Handle System.out.print(...)
      const printMatch = line.match(/System\.out\.print\((.*)\);?/);
      if (printMatch) {
        const arg = printMatch[1].trim();
        const evaluatedText = evaluatePrintExpression(arg, variables);
        currentLineBuffer += evaluatedText;
        continue;
      }
    }

    if (currentLineBuffer) {
      outputs.push(currentLineBuffer);
    }

    const finalOutput = outputs.length > 0 ? outputs.join('\n') : 'Program executed successfully with no console output.';

    return {
      output: finalOutput,
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime))
    };
  } catch (err: any) {
    return {
      output: '',
      error: `Execution Error: ${err.message || String(err)}`,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }
};

function evaluatePrintExpression(expr: string, vars: Record<string, any>): string {
  if (!expr) return '';
  if (vars[expr] !== undefined) {
    return String(vars[expr]);
  }

  // Check simple string literal
  if (expr.startsWith('"') && expr.endsWith('"') && !expr.slice(1, -1).includes('" +')) {
    return expr.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }

  // Handle concatenation
  try {
    let replaced = expr;
    // Replace variables
    Object.keys(vars).forEach(v => {
      replaced = replaced.replace(new RegExp(`\\b${v}\\b`, 'g'), JSON.stringify(vars[v]));
    });
    // eslint-disable-next-line no-eval
    const res = Function(`'use strict'; return (${replaced})`)();
    return String(res);
  } catch {
    return expr.replace(/"/g, '');
  }
}
