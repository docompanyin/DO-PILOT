export interface McqOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  explanationIfWrong?: string;
}

export interface McqQuestion {
  id?: string;
  question: string;
  options: McqOption[];
  correctAnswer: string;
  explanationNote: string;
}

export interface TheoryBlock {
  heading: string;
  text: string;
  codeSnippet?: string;
  terminalOutput?: string;
  tip?: string;
  warning?: string;
  sampleInput?: string;
  mcq?: McqQuestion;
  retestMcq?: McqQuestion;
  questionPool?: McqQuestion[];
}

export interface SectionContent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  readTime: string;
  objectives: string[];
  theoryBlocks: TheoryBlock[];
}

export const PART_4_SECTIONS: SectionContent[] = [
  {
    "id": "4-1-developer-tools",
    "number": "4.1",
    "title": "Developer Tools & Debugging",
    "subtitle": "Master the Python interpreter, VS Code debugging, breakpoints, call stacks, and reading traceback errors.",
    "readTime": "20 min",
    "objectives": [
      "Understand how the Python interpreter executes scripts from the terminal",
      "Set breakpoints and step through execution line by line",
      "Inspect variable values live during runtime execution",
      "Understand the call stack and function execution frames",
      "Read and interpret Python error tracebacks from top to bottom",
      "Diagnose semantic bugs using interactive debugging over print debugging"
],
    "theoryBlocks": [
      {
        "heading": "The Python Interpreter & CLI Execution",
        "text": "The Python interpreter reads Python source code, compiles it into bytecode, and executes it on the Python Virtual Machine (PVM). You run Python programs from the command line using python script_name.py. Interactive mode (running python with no arguments) provides a Read-Eval-Print Loop (REPL) for testing code snippets directly.",
        "codeSnippet": "# Running in terminal:\n# python main.py\n\nimport sys\nprint(f\"Python Version: {sys.version.split()[0]}\")\nprint(\"Script executed successfully!\")",
        "terminalOutput": "Python Version: 3.13.14\nScript executed successfully!",
        "tip": "In the terminal, python -i main.py runs the script and leaves the interpreter open in interactive mode with all defined variables preserved.",
        "mcq": {
          "id": "q-4.1-0-v1",
          "question": "What is the primary role of the Python interpreter when you run python app.py?",
          "options": [
                    {
                              "id": "A",
                              "text": "It parses the source code, compiles it into bytecode, and executes instructions line by line",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It compiles Python directly into a standalone Windows .exe machine binary",
                              "explanationIfWrong": "Python uses bytecode executed by the PVM, not direct native compilation."
                    },
                    {
                              "id": "C",
                              "text": "It formats the indentation of your source code file",
                              "explanationIfWrong": "Indentation formatting is done by formatters (like black), not the interpreter."
                    },
                    {
                              "id": "D",
                              "text": "It runs the code inside a web browser sandbox",
                              "explanationIfWrong": "Standard Python runs natively on your operating system."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The interpreter reads Python source code, converts it to bytecode, and executes the instructions sequentially."
},
        "retestMcq": {
          "id": "q-4.1-0-v2",
          "question": "What does REPL stand for in the context of the Python interactive shell?",
          "options": [
                    {
                              "id": "A",
                              "text": "Read-Eval-Print Loop",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Run-Execute-Program-Load",
                              "explanationIfWrong": "The standard acronym is Read-Eval-Print Loop."
                    },
                    {
                              "id": "C",
                              "text": "Runtime-Environment-Python-Language",
                              "explanationIfWrong": "REPL describes the interactive loop mechanism."
                    },
                    {
                              "id": "D",
                              "text": "Remote-Execution-Process-Line",
                              "explanationIfWrong": "REPL means Read-Eval-Print Loop."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "REPL stands for Read-Eval-Print Loop, the interactive command prompt where expressions are immediately evaluated."
},
        "questionPool": [
          {
            "id": "q-4.1-0-v1",
            "question": "What is the primary role of the Python interpreter when you run python app.py?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It parses the source code, compiles it into bytecode, and executes instructions line by line",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It compiles Python directly into a standalone Windows .exe machine binary",
                                    "explanationIfWrong": "Python uses bytecode executed by the PVM, not direct native compilation."
                        },
                        {
                                    "id": "C",
                                    "text": "It formats the indentation of your source code file",
                                    "explanationIfWrong": "Indentation formatting is done by formatters (like black), not the interpreter."
                        },
                        {
                                    "id": "D",
                                    "text": "It runs the code inside a web browser sandbox",
                                    "explanationIfWrong": "Standard Python runs natively on your operating system."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The interpreter reads Python source code, converts it to bytecode, and executes the instructions sequentially."
},
          {
            "id": "q-4.1-0-v2",
            "question": "What does REPL stand for in the context of the Python interactive shell?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Read-Eval-Print Loop",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Run-Execute-Program-Load",
                                    "explanationIfWrong": "The standard acronym is Read-Eval-Print Loop."
                        },
                        {
                                    "id": "C",
                                    "text": "Runtime-Environment-Python-Language",
                                    "explanationIfWrong": "REPL describes the interactive loop mechanism."
                        },
                        {
                                    "id": "D",
                                    "text": "Remote-Execution-Process-Line",
                                    "explanationIfWrong": "REPL means Read-Eval-Print Loop."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "REPL stands for Read-Eval-Print Loop, the interactive command prompt where expressions are immediately evaluated."
},
          {
            "id": "q-4.1-0-v3",
            "question": "Which flag allows running a Python module as a script from the terminal (e.g. python -m venv env)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "-m",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "-r",
                                    "explanationIfWrong": "-r is not a standard Python module execution flag."
                        },
                        {
                                    "id": "C",
                                    "text": "-s",
                                    "explanationIfWrong": "-s disables user site directories."
                        },
                        {
                                    "id": "D",
                                    "text": "-run",
                                    "explanationIfWrong": "Python CLI flags use single letters or standard double dashes."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The -m flag searches sys.path for the named module and executes its contents as the __main__ script."
}
        ]
      },
      {
        "heading": "Breakpoints in Debugging",
        "text": "A breakpoint is a designated stopping point placed on a specific line of code. When you run a program under a debugger (such as in VS Code), execution halts immediately before that line executes, allowing you to examine the current state of variables and step through instructions manually.",
        "codeSnippet": "def calculate_discount(price, rate):\n    # Breakpoint placed on the line below:\n    discount = price * rate\n    final_price = price - discount\n    return final_price\n\nresult = calculate_discount(100, 0.15)\nprint(f\"Final: ${result}\")",
        "terminalOutput": "Final: $85.0",
        "tip": "In modern Python (3.7+), you can also insert a programmatic breakpoint anywhere in code by writing breakpoint().",
        "mcq": {
          "id": "q-4.1-1-v1",
          "question": "What happens when a running program reaches an active breakpoint in a debugger?",
          "options": [
                    {
                              "id": "A",
                              "text": "Execution pauses immediately before executing that line, allowing inspection of state",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The program terminates and deletes the file",
                              "explanationIfWrong": "Breakpoints pause execution; they do not terminate or delete files."
                    },
                    {
                              "id": "C",
                              "text": "The line is skipped completely without running",
                              "explanationIfWrong": "The line will execute once the developer clicks 'Step Over' or 'Continue'."
                    },
                    {
                              "id": "D",
                              "text": "Python raises an unhandled BreakpointError",
                              "explanationIfWrong": "Breakpoints are standard debugging tools, not unhandled errors."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Execution pauses before the breakpoint line runs, giving you full control to inspect memory and variables."
},
        "retestMcq": {
          "id": "q-4.1-1-v2",
          "question": "Which built-in Python function triggers the interactive debugger at runtime without requiring IDE setup?",
          "options": [
                    {
                              "id": "A",
                              "text": "breakpoint()",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "pause()",
                              "explanationIfWrong": "Python has no built-in pause() function."
                    },
                    {
                              "id": "C",
                              "text": "debug()",
                              "explanationIfWrong": "There is no built-in debug() function; use breakpoint()."
                    },
                    {
                              "id": "D",
                              "text": "stop()",
                              "explanationIfWrong": "stop() does not exist in standard Python."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since Python 3.7, calling breakpoint() invokes sys.breakpointhook() to launch the debugger."
},
        "questionPool": [
          {
            "id": "q-4.1-1-v1",
            "question": "What happens when a running program reaches an active breakpoint in a debugger?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Execution pauses immediately before executing that line, allowing inspection of state",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The program terminates and deletes the file",
                                    "explanationIfWrong": "Breakpoints pause execution; they do not terminate or delete files."
                        },
                        {
                                    "id": "C",
                                    "text": "The line is skipped completely without running",
                                    "explanationIfWrong": "The line will execute once the developer clicks 'Step Over' or 'Continue'."
                        },
                        {
                                    "id": "D",
                                    "text": "Python raises an unhandled BreakpointError",
                                    "explanationIfWrong": "Breakpoints are standard debugging tools, not unhandled errors."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Execution pauses before the breakpoint line runs, giving you full control to inspect memory and variables."
},
          {
            "id": "q-4.1-1-v2",
            "question": "Which built-in Python function triggers the interactive debugger at runtime without requiring IDE setup?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "breakpoint()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "pause()",
                                    "explanationIfWrong": "Python has no built-in pause() function."
                        },
                        {
                                    "id": "C",
                                    "text": "debug()",
                                    "explanationIfWrong": "There is no built-in debug() function; use breakpoint()."
                        },
                        {
                                    "id": "D",
                                    "text": "stop()",
                                    "explanationIfWrong": "stop() does not exist in standard Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since Python 3.7, calling breakpoint() invokes sys.breakpointhook() to launch the debugger."
},
          {
            "id": "q-4.1-1-v3",
            "question": "What is the key advantage of using a debugger with breakpoints over inserting print() statements?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "You can inspect all variables dynamically, evaluate expressions, and step backwards without modifying source code",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A debugger makes your code run 10x faster",
                                    "explanationIfWrong": "Debuggers add overhead; they do not speed up code."
                        },
                        {
                                    "id": "C",
                                    "text": "Debuggers fix syntax errors automatically",
                                    "explanationIfWrong": "Debuggers help diagnose logic errors; they do not rewrite code."
                        },
                        {
                                    "id": "D",
                                    "text": "print() statements are prohibited in production Python",
                                    "explanationIfWrong": "print() is valid, but cluttering code with temporary prints is messy."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Breakpoints give interactive visibility into variables, call stack, and step-by-step execution without cluttering source code."
}
        ]
      },
      {
        "heading": "Step Controls: Over, Into, and Out",
        "text": "When paused at a breakpoint, debuggers provide three primary stepping controls: Step Over (F10) runs the current line and pauses at the next line; Step Into (F11) enters inside a called function to inspect its internals; Step Out (Shift+F11) finishes the remaining execution of the current function and returns to the caller.",
        "codeSnippet": "def helper(val):\n    return val * 2  # Step Into enters here!\n\nx = 10\ny = helper(x)       # Step Over executes helper and moves to next line\nprint(y)",
        "terminalOutput": "20",
        "mcq": {
          "id": "q-4.1-2-v1",
          "question": "If you are paused on y = helper(x) and want to see how helper() works internally, which action do you take?",
          "options": [
                    {
                              "id": "A",
                              "text": "Step Into",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Step Over",
                              "explanationIfWrong": "Step Over executes helper without entering its body."
                    },
                    {
                              "id": "C",
                              "text": "Step Out",
                              "explanationIfWrong": "Step Out finishes the current function, not the callee."
                    },
                    {
                              "id": "D",
                              "text": "Restart",
                              "explanationIfWrong": "Restart restarts the program from scratch."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Step Into jumps inside the function definition on the current line to debug its body line-by-line."
},
        "retestMcq": {
          "id": "q-4.1-2-v2",
          "question": "What does 'Step Over' do when the current line contains a function call?",
          "options": [
                    {
                              "id": "A",
                              "text": "Executes the function in its entirety and pauses at the next line in the current function",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Cancels the function execution and returns None",
                              "explanationIfWrong": "Step Over runs the function normally."
                    },
                    {
                              "id": "C",
                              "text": "Jumps to the first line of the called function",
                              "explanationIfWrong": "That is Step Into, not Step Over."
                    },
                    {
                              "id": "D",
                              "text": "Skips the line without running it",
                              "explanationIfWrong": "The function is executed; the debugger just doesn't step into it."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Step Over executes the entire called function and pauses on the very next line of the current scope."
},
        "questionPool": [
          {
            "id": "q-4.1-2-v1",
            "question": "If you are paused on y = helper(x) and want to see how helper() works internally, which action do you take?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Step Into",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Step Over",
                                    "explanationIfWrong": "Step Over executes helper without entering its body."
                        },
                        {
                                    "id": "C",
                                    "text": "Step Out",
                                    "explanationIfWrong": "Step Out finishes the current function, not the callee."
                        },
                        {
                                    "id": "D",
                                    "text": "Restart",
                                    "explanationIfWrong": "Restart restarts the program from scratch."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Step Into jumps inside the function definition on the current line to debug its body line-by-line."
},
          {
            "id": "q-4.1-2-v2",
            "question": "What does 'Step Over' do when the current line contains a function call?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Executes the function in its entirety and pauses at the next line in the current function",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Cancels the function execution and returns None",
                                    "explanationIfWrong": "Step Over runs the function normally."
                        },
                        {
                                    "id": "C",
                                    "text": "Jumps to the first line of the called function",
                                    "explanationIfWrong": "That is Step Into, not Step Over."
                        },
                        {
                                    "id": "D",
                                    "text": "Skips the line without running it",
                                    "explanationIfWrong": "The function is executed; the debugger just doesn't step into it."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Step Over executes the entire called function and pauses on the very next line of the current scope."
},
          {
            "id": "q-4.1-2-v3",
            "question": "When should you use 'Step Out'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "When you are inside a function and want to finish it immediately and return to the caller",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "When you want to terminate the Python process",
                                    "explanationIfWrong": "Use Stop / Disconnect to terminate the process."
                        },
                        {
                                    "id": "C",
                                    "text": "When you want to restart the loop from iteration 0",
                                    "explanationIfWrong": "Step Out exits the current function frame."
                        },
                        {
                                    "id": "D",
                                    "text": "When a breakpoint is hit",
                                    "explanationIfWrong": "Step Out is used while actively stepping inside a function."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Step Out runs until the current function returns, pausing immediately after the call in the calling scope."
}
        ]
      },
      {
        "heading": "The Call Stack",
        "text": "The call stack is a data structure maintained by the runtime that tracks the active sequence of function calls. When function A calls function B, a new frame for B is pushed onto the stack. When B returns, its frame is popped, and execution resumes in frame A.",
        "codeSnippet": "def level_three():\n    # Top of stack: level_three\n    return 42\n\ndef level_two():\n    # Middle: level_two -> level_three\n    return level_three()\n\ndef level_one():\n    # Bottom: level_one -> level_two\n    return level_two()\n\nprint(level_one())",
        "terminalOutput": "42",
        "tip": "If a recursive function calls itself endlessly, Python raises RecursionError: maximum recursion depth exceeded because the call stack overflows.",
        "mcq": {
          "id": "q-4.1-3-v1",
          "question": "What happens to a function's stack frame when the function finishes executing and returns?",
          "options": [
                    {
                              "id": "A",
                              "text": "It is popped from the stack and its local variables are cleaned up",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It remains permanently in memory",
                              "explanationIfWrong": "Stack frames are deallocated upon function return."
                    },
                    {
                              "id": "C",
                              "text": "It is moved to the global scope",
                              "explanationIfWrong": "Local variables do not migrate to global scope."
                    },
                    {
                              "id": "D",
                              "text": "It is converted to a dictionary",
                              "explanationIfWrong": "The runtime manages stack frames internally."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Returning from a function pops its frame from the call stack, reclaiming its local scope."
},
        "retestMcq": {
          "id": "q-4.1-3-v2",
          "question": "In the call stack view of a debugger, which frame represents the line currently executing?",
          "options": [
                    {
                              "id": "A",
                              "text": "The frame at the top of the stack",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The frame at the very bottom of the stack",
                              "explanationIfWrong": "The bottom frame is the initial entrypoint (e.g. <module>)."
                    },
                    {
                              "id": "C",
                              "text": "The global frame",
                              "explanationIfWrong": "The global frame sits at the bottom of the call hierarchy."
                    },
                    {
                              "id": "D",
                              "text": "The middle frame",
                              "explanationIfWrong": "The topmost frame is always the currently active function."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The call stack operates as a LIFO structure; the current active execution point is at the top."
},
        "questionPool": [
          {
            "id": "q-4.1-3-v1",
            "question": "What happens to a function's stack frame when the function finishes executing and returns?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It is popped from the stack and its local variables are cleaned up",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It remains permanently in memory",
                                    "explanationIfWrong": "Stack frames are deallocated upon function return."
                        },
                        {
                                    "id": "C",
                                    "text": "It is moved to the global scope",
                                    "explanationIfWrong": "Local variables do not migrate to global scope."
                        },
                        {
                                    "id": "D",
                                    "text": "It is converted to a dictionary",
                                    "explanationIfWrong": "The runtime manages stack frames internally."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Returning from a function pops its frame from the call stack, reclaiming its local scope."
},
          {
            "id": "q-4.1-3-v2",
            "question": "In the call stack view of a debugger, which frame represents the line currently executing?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The frame at the top of the stack",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The frame at the very bottom of the stack",
                                    "explanationIfWrong": "The bottom frame is the initial entrypoint (e.g. <module>)."
                        },
                        {
                                    "id": "C",
                                    "text": "The global frame",
                                    "explanationIfWrong": "The global frame sits at the bottom of the call hierarchy."
                        },
                        {
                                    "id": "D",
                                    "text": "The middle frame",
                                    "explanationIfWrong": "The topmost frame is always the currently active function."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The call stack operates as a LIFO structure; the current active execution point is at the top."
},
          {
            "id": "q-4.1-3-v3",
            "question": "What error indicates that too many function frames have accumulated on the call stack without returning?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "RecursionError: maximum recursion depth exceeded",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "MemoryError: RAM exhausted",
                                    "explanationIfWrong": "Python guards against stack overflow with a specific RecursionError."
                        },
                        {
                                    "id": "C",
                                    "text": "StackOverflowSyntaxError",
                                    "explanationIfWrong": "Python calls this exception RecursionError."
                        },
                        {
                                    "id": "D",
                                    "text": "IndexError",
                                    "explanationIfWrong": "IndexError is for sequence lookups, not call stack frames."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python enforces a recursion limit (default 1000) and raises RecursionError if exceeded."
}
        ]
      },
      {
        "heading": "Reading Tracebacks",
        "text": "When an unhandled exception occurs, Python prints a traceback. Tracebacks are printed in chronological order from top to bottom: the earliest call is at the top, and the exact line that triggered the crash is at the bottom, followed by the exception type and error description.",
        "codeSnippet": "# Example traceback structure:\n# Traceback (most recent call last):\n#   File \"calc.py\", line 10, in <module>\n#     run_app()\n#   File \"calc.py\", line 4, in run_app\n#     print(10 / 0)\n# ZeroDivisionError: division by zero",
        "terminalOutput": "ZeroDivisionError: division by zero",
        "warning": "Always read the bottom-most line first to discover the error type and message, then check the line number immediately above it.",
        "mcq": {
          "id": "q-4.1-4-v1",
          "question": "Where in a Python traceback do you find the exact exception type and message describing what went wrong?",
          "options": [
                    {
                              "id": "A",
                              "text": "At the very bottom of the traceback output",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "At the very top line",
                              "explanationIfWrong": "The top line says 'Traceback (most recent call last):'."
                    },
                    {
                              "id": "C",
                              "text": "In the middle line only",
                              "explanationIfWrong": "The middle lines display call hierarchy and filenames."
                    },
                    {
                              "id": "D",
                              "text": "In the terminal window title bar",
                              "explanationIfWrong": "Tracebacks print directly to standard error output."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The last line of a traceback always states the exception name (e.g. ValueError) and the explanatory message."
},
        "retestMcq": {
          "id": "q-4.1-4-v2",
          "question": "What does 'Traceback (most recent call last):' signify?",
          "options": [
                    {
                              "id": "A",
                              "text": "The calls are listed in order of execution, with the most recent (the failing line) listed last at the bottom",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The code ran in reverse order",
                              "explanationIfWrong": "Code runs forward; 'most recent call last' describes output sorting."
                    },
                    {
                              "id": "C",
                              "text": "The program crashed during module import only",
                              "explanationIfWrong": "It applies to any runtime crash."
                    },
                    {
                              "id": "D",
                              "text": "The error was automatically suppressed",
                              "explanationIfWrong": "The traceback indicates an unhandled crash."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python tracebacks list the call chain chronologically, placing the final offending line at the end."
},
        "questionPool": [
          {
            "id": "q-4.1-4-v1",
            "question": "Where in a Python traceback do you find the exact exception type and message describing what went wrong?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "At the very bottom of the traceback output",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "At the very top line",
                                    "explanationIfWrong": "The top line says 'Traceback (most recent call last):'."
                        },
                        {
                                    "id": "C",
                                    "text": "In the middle line only",
                                    "explanationIfWrong": "The middle lines display call hierarchy and filenames."
                        },
                        {
                                    "id": "D",
                                    "text": "In the terminal window title bar",
                                    "explanationIfWrong": "Tracebacks print directly to standard error output."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The last line of a traceback always states the exception name (e.g. ValueError) and the explanatory message."
},
          {
            "id": "q-4.1-4-v2",
            "question": "What does 'Traceback (most recent call last):' signify?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The calls are listed in order of execution, with the most recent (the failing line) listed last at the bottom",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The code ran in reverse order",
                                    "explanationIfWrong": "Code runs forward; 'most recent call last' describes output sorting."
                        },
                        {
                                    "id": "C",
                                    "text": "The program crashed during module import only",
                                    "explanationIfWrong": "It applies to any runtime crash."
                        },
                        {
                                    "id": "D",
                                    "text": "The error was automatically suppressed",
                                    "explanationIfWrong": "The traceback indicates an unhandled crash."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python tracebacks list the call chain chronologically, placing the final offending line at the end."
},
          {
            "id": "q-4.1-4-v3",
            "question": "If line 14 shows ZeroDivisionError: division by zero, what was the root cause?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "An arithmetic division or modulo operation had a denominator of 0 on line 14",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A variable name was misspelled",
                                    "explanationIfWrong": "Misspelled names cause NameError."
                        },
                        {
                                    "id": "C",
                                    "text": "A string could not be converted to float",
                                    "explanationIfWrong": "Invalid conversions cause ValueError."
                        },
                        {
                                    "id": "D",
                                    "text": "Indentation was misaligned",
                                    "explanationIfWrong": "Indentation errors cause IndentationError before execution."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "ZeroDivisionError occurs whenever an expression attempts to divide by 0 or modulo by 0."
}
        ]
      },
      {
        "heading": "Debugging Logic Errors",
        "text": "Logic errors (bugs) do not produce error messages or crash the program; instead, they cause the program to produce incorrect results. Using a debugger to watch variable values change across iterations is the most effective way to identify the moment a calculation diverges from expectations.",
        "codeSnippet": "# Bug: finding average with integer division\ntotal = 15\ncount = 2\navg = total / count  # Using / gives 7.5 float (correct)\nprint(f\"Average: {avg}\")",
        "terminalOutput": "Average: 7.5",
        "tip": "Use the Watch window in VS Code to track custom expressions like (i < len(items)) or (total / count) live during stepping.",
        "mcq": {
          "id": "q-4.1-5-v1",
          "question": "Why are logic errors often harder to detect than syntax or runtime errors?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because Python doesn't crash or print an error message; the program runs but yields wrong output",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because debuggers refuse to inspect logic errors",
                              "explanationIfWrong": "Debuggers are specifically designed to uncover logic errors."
                    },
                    {
                              "id": "C",
                              "text": "Because they prevent bytecode compilation",
                              "explanationIfWrong": "Logic errors compile and run without issue."
                    },
                    {
                              "id": "D",
                              "text": "Because they only happen on Linux operating systems",
                              "explanationIfWrong": "Logic errors occur regardless of operating system."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since logic errors are syntactically and operationally valid, the interpreter runs them silently, requiring manual diagnosis."
},
        "retestMcq": {
          "id": "q-4.1-5-v2",
          "question": "What is the purpose of the 'Watch' panel in the VS Code debugger?",
          "options": [
                    {
                              "id": "A",
                              "text": "To monitor specific variables or custom expressions continuously as you step through code",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "To record video of your debugging session",
                              "explanationIfWrong": "The Watch panel evaluates data expressions, not video."
                    },
                    {
                              "id": "C",
                              "text": "To measure CPU clock speed",
                              "explanationIfWrong": "CPU profiling is handled by profilers, not the Watch panel."
                    },
                    {
                              "id": "D",
                              "text": "To prevent unauthorized edits to the file",
                              "explanationIfWrong": "The Watch window is for live expression evaluation."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Watch panel allows you to enter any variable or expression and see its evaluated result update after each step."
},
        "questionPool": [
          {
            "id": "q-4.1-5-v1",
            "question": "Why are logic errors often harder to detect than syntax or runtime errors?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because Python doesn't crash or print an error message; the program runs but yields wrong output",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because debuggers refuse to inspect logic errors",
                                    "explanationIfWrong": "Debuggers are specifically designed to uncover logic errors."
                        },
                        {
                                    "id": "C",
                                    "text": "Because they prevent bytecode compilation",
                                    "explanationIfWrong": "Logic errors compile and run without issue."
                        },
                        {
                                    "id": "D",
                                    "text": "Because they only happen on Linux operating systems",
                                    "explanationIfWrong": "Logic errors occur regardless of operating system."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since logic errors are syntactically and operationally valid, the interpreter runs them silently, requiring manual diagnosis."
},
          {
            "id": "q-4.1-5-v2",
            "question": "What is the purpose of the 'Watch' panel in the VS Code debugger?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To monitor specific variables or custom expressions continuously as you step through code",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "To record video of your debugging session",
                                    "explanationIfWrong": "The Watch panel evaluates data expressions, not video."
                        },
                        {
                                    "id": "C",
                                    "text": "To measure CPU clock speed",
                                    "explanationIfWrong": "CPU profiling is handled by profilers, not the Watch panel."
                        },
                        {
                                    "id": "D",
                                    "text": "To prevent unauthorized edits to the file",
                                    "explanationIfWrong": "The Watch window is for live expression evaluation."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Watch panel allows you to enter any variable or expression and see its evaluated result update after each step."
},
          {
            "id": "q-4.1-5-v3",
            "question": "What is the term for a logic error where a loop runs one time too many or one time too few?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Off-by-one error",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Deadlock error",
                                    "explanationIfWrong": "Deadlock involves concurrent lock contention."
                        },
                        {
                                    "id": "C",
                                    "text": "Segmentation fault",
                                    "explanationIfWrong": "Segmentation fault is memory violation in low-level languages."
                        },
                        {
                                    "id": "D",
                                    "text": "Type coercion error",
                                    "explanationIfWrong": "Off-by-one is the standard term for loop boundary indexing mistakes."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Off-by-one errors typically occur when confusing < with <= or starting an index at 1 instead of 0."
}
        ]
      }
    ]
  },
  {
    "id": "4-2-more-functions",
    "number": "4.2",
    "title": "More Functions",
    "subtitle": "Explore default parameter values, keyword arguments, type hints, docstrings, and multiple return statements.",
    "readTime": "20 min",
    "objectives": [
      "Assign default values to function parameters",
      "Call functions using keyword arguments regardless of position",
      "Add type hints for clearer function signatures and tooling support",
      "Document functions using triple-quoted docstrings",
      "Return multiple values using tuple packing and unpacking",
      "Structure clean guard clauses using early return patterns"
],
    "theoryBlocks": [
      {
        "heading": "Default Parameter Values",
        "text": "You can assign default values to parameters in the function definition header. If the caller omits an argument for that parameter, Python automatically uses the default value. Parameters with default values must always follow parameters without default values.",
        "codeSnippet": "def greet(name, greeting=\"Hello\"):\n    print(f\"{greeting}, {name}!\")\n\ngreet(\"Alice\")            # Uses default 'Hello'\ngreet(\"Bob\", \"Welcome\")   # Overrides with 'Welcome'",
        "terminalOutput": "Hello, Alice!\nWelcome, Bob!",
        "warning": "Non-default parameters cannot follow default parameters. def func(a=1, b): causes a SyntaxError: non-default argument follows default argument.",
        "mcq": {
          "id": "q-4.2-0-v1",
          "question": "What is printed by calculate(5) if defined as:\n\ndef calculate(a, b=10):\n    return a + b",
          "options": [
                    {
                              "id": "A",
                              "text": "15",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "5",
                              "explanationIfWrong": "b takes its default value of 10, so 5 + 10 = 15."
                    },
                    {
                              "id": "C",
                              "text": "TypeError: missing 1 required argument",
                              "explanationIfWrong": "b is optional because it has a default value."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "It returns a + b = 15."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because b has a default value of 10, calculate(5) evaluates 5 + 10 = 15."
},
        "retestMcq": {
          "id": "q-4.2-0-v2",
          "question": "Which function header causes a SyntaxError in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "def test(x=1, y):",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "def test(x, y=1):",
                              "explanationIfWrong": "Default arguments placed at the end are completely valid."
                    },
                    {
                              "id": "C",
                              "text": "def test(x=1, y=2):",
                              "explanationIfWrong": "Multiple default arguments are valid."
                    },
                    {
                              "id": "D",
                              "text": "def test(x, y):",
                              "explanationIfWrong": "Standard parameters without defaults are valid."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python syntax requires all positional parameters without defaults to appear before any parameter with a default."
},
        "questionPool": [
          {
            "id": "q-4.2-0-v1",
            "question": "What is printed by calculate(5) if defined as:\n\ndef calculate(a, b=10):\n    return a + b",
            "options": [
                        {
                                    "id": "A",
                                    "text": "15",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "5",
                                    "explanationIfWrong": "b takes its default value of 10, so 5 + 10 = 15."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError: missing 1 required argument",
                                    "explanationIfWrong": "b is optional because it has a default value."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "It returns a + b = 15."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because b has a default value of 10, calculate(5) evaluates 5 + 10 = 15."
},
          {
            "id": "q-4.2-0-v2",
            "question": "Which function header causes a SyntaxError in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "def test(x=1, y):",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "def test(x, y=1):",
                                    "explanationIfWrong": "Default arguments placed at the end are completely valid."
                        },
                        {
                                    "id": "C",
                                    "text": "def test(x=1, y=2):",
                                    "explanationIfWrong": "Multiple default arguments are valid."
                        },
                        {
                                    "id": "D",
                                    "text": "def test(x, y):",
                                    "explanationIfWrong": "Standard parameters without defaults are valid."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python syntax requires all positional parameters without defaults to appear before any parameter with a default."
},
          {
            "id": "q-4.2-0-v3",
            "question": "Why should you avoid using mutable objects (like empty lists []) as default arguments in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The default object is created once when the function is defined and shared across all subsequent calls",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python raises a TypeError during function declaration",
                                    "explanationIfWrong": "It is syntactically allowed, but causes notorious shared-state bugs."
                        },
                        {
                                    "id": "C",
                                    "text": "Lists cannot be passed into functions",
                                    "explanationIfWrong": "Lists can freely be passed into functions."
                        },
                        {
                                    "id": "D",
                                    "text": "The list is deleted after the first call",
                                    "explanationIfWrong": "The list persists across all calls, mutating continuously."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Default arguments are evaluated once at definition time. Use None as default and initialize inside the body instead."
}
        ]
      },
      {
        "heading": "Keyword Arguments",
        "text": "When calling a function, arguments can be specified by parameter name in the format parameter_name=value. When using keyword arguments, the order in which arguments are passed does not matter. Positional arguments must appear before keyword arguments in a call.",
        "codeSnippet": "def create_profile(name, age, city):\n    print(f\"{name} ({age}) from {city}\")\n\n# Calling with keyword arguments in different order\ncreate_profile(city=\"Helsinki\", name=\"Liisa\", age=22)",
        "terminalOutput": "Liisa (22) from Helsinki",
        "mcq": {
          "id": "q-4.2-1-v1",
          "question": "What is the main benefit of using keyword arguments when calling functions?",
          "options": [
                    {
                              "id": "A",
                              "text": "Code readability is improved and arguments can be supplied in any order regardless of position",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Keyword arguments make functions execute in parallel",
                              "explanationIfWrong": "Keyword arguments have no effect on concurrency."
                    },
                    {
                              "id": "C",
                              "text": "Keyword arguments prevent functions from returning None",
                              "explanationIfWrong": "Return values are controlled by function logic."
                    },
                    {
                              "id": "D",
                              "text": "Keyword arguments convert strings to numbers automatically",
                              "explanationIfWrong": "Argument passing preserves original types."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Explicitly naming arguments makes intent obvious and removes dependence on positional order."
},
        "retestMcq": {
          "id": "q-4.2-1-v2",
          "question": "What error occurs if you call send(recipient='Alice', 'Hello') where recipient is a keyword argument placed before a positional argument?",
          "options": [
                    {
                              "id": "A",
                              "text": "SyntaxError: positional argument follows keyword argument",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "TypeError: duplicate parameter name",
                              "explanationIfWrong": "It is a syntax violation caught at compile time."
                    },
                    {
                              "id": "C",
                              "text": "ValueError: invalid ordering",
                              "explanationIfWrong": "The exception raised is SyntaxError."
                    },
                    {
                              "id": "D",
                              "text": "It executes successfully",
                              "explanationIfWrong": "Positional arguments can never follow keyword arguments in Python."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python enforces that all positional arguments must precede any keyword arguments in a call expression."
},
        "questionPool": [
          {
            "id": "q-4.2-1-v1",
            "question": "What is the main benefit of using keyword arguments when calling functions?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Code readability is improved and arguments can be supplied in any order regardless of position",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Keyword arguments make functions execute in parallel",
                                    "explanationIfWrong": "Keyword arguments have no effect on concurrency."
                        },
                        {
                                    "id": "C",
                                    "text": "Keyword arguments prevent functions from returning None",
                                    "explanationIfWrong": "Return values are controlled by function logic."
                        },
                        {
                                    "id": "D",
                                    "text": "Keyword arguments convert strings to numbers automatically",
                                    "explanationIfWrong": "Argument passing preserves original types."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Explicitly naming arguments makes intent obvious and removes dependence on positional order."
},
          {
            "id": "q-4.2-1-v2",
            "question": "What error occurs if you call send(recipient='Alice', 'Hello') where recipient is a keyword argument placed before a positional argument?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "SyntaxError: positional argument follows keyword argument",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "TypeError: duplicate parameter name",
                                    "explanationIfWrong": "It is a syntax violation caught at compile time."
                        },
                        {
                                    "id": "C",
                                    "text": "ValueError: invalid ordering",
                                    "explanationIfWrong": "The exception raised is SyntaxError."
                        },
                        {
                                    "id": "D",
                                    "text": "It executes successfully",
                                    "explanationIfWrong": "Positional arguments can never follow keyword arguments in Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python enforces that all positional arguments must precede any keyword arguments in a call expression."
},
          {
            "id": "q-4.2-1-v3",
            "question": "What is printed by func(b=3, a=7) if def func(a, b): return a - b?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "4",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "-4",
                                    "explanationIfWrong": "a=7 and b=3; a - b = 7 - 3 = 4."
                        },
                        {
                                    "id": "C",
                                    "text": "10",
                                    "explanationIfWrong": "The function performs subtraction, not addition."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Keyword arguments bind correctly by name regardless of order."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since a=7 and b=3, a - b evaluates to 7 - 3 = 4."
}
        ]
      },
      {
        "heading": "Type Hints in Functions",
        "text": "Type hints (annotations) declare the expected data types of parameters and return values. Type hints do not change runtime behavior (Python does not enforce them at runtime), but they significantly assist static analyzers, IDE autocompletion, and human readability.",
        "codeSnippet": "def repeat_text(text: str, times: int) -> str:\n    return text * times\n\noutput: str = repeat_text(\"Hi! \", 3)\nprint(output)",
        "terminalOutput": "Hi! Hi! Hi! ",
        "tip": "Tools like mypy can check your entire codebase against type hints before runtime to catch bugs early.",
        "mcq": {
          "id": "q-4.2-2-v1",
          "question": "Does Python raise a TypeError at runtime if you pass an int into a parameter annotated as text: str?",
          "options": [
                    {
                              "id": "A",
                              "text": "No, type hints are purely annotations and not enforced by the Python runtime",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Yes, Python strictly enforces type hints during execution",
                              "explanationIfWrong": "Python remains dynamically typed; type hints are advisory."
                    },
                    {
                              "id": "C",
                              "text": "Yes, but only in Python 3.12+",
                              "explanationIfWrong": "Runtime behavior ignores type hints unless third-party validation libraries are used."
                    },
                    {
                              "id": "D",
                              "text": "It converts the int to str automatically",
                              "explanationIfWrong": "Python does not automatically coerce types based on annotations."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Type hints serve as documentation for developers and linters; Python's runtime does not enforce them."
},
        "retestMcq": {
          "id": "q-4.2-2-v2",
          "question": "What syntax declares that a function returns a boolean value?",
          "options": [
                    {
                              "id": "A",
                              "text": "def is_valid(code: str) -> bool:",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "def is_valid(code: str): bool",
                              "explanationIfWrong": "The arrow -> is required before the return type."
                    },
                    {
                              "id": "C",
                              "text": "bool def is_valid(code: str):",
                              "explanationIfWrong": "Return types are placed after parameters with ->."
                    },
                    {
                              "id": "D",
                              "text": "def is_valid(code: str) returns bool:",
                              "explanationIfWrong": "Python uses ->, not the keyword returns."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The syntax -> bool before the colon specifies the return type annotation in Python."
},
        "questionPool": [
          {
            "id": "q-4.2-2-v1",
            "question": "Does Python raise a TypeError at runtime if you pass an int into a parameter annotated as text: str?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, type hints are purely annotations and not enforced by the Python runtime",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, Python strictly enforces type hints during execution",
                                    "explanationIfWrong": "Python remains dynamically typed; type hints are advisory."
                        },
                        {
                                    "id": "C",
                                    "text": "Yes, but only in Python 3.12+",
                                    "explanationIfWrong": "Runtime behavior ignores type hints unless third-party validation libraries are used."
                        },
                        {
                                    "id": "D",
                                    "text": "It converts the int to str automatically",
                                    "explanationIfWrong": "Python does not automatically coerce types based on annotations."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Type hints serve as documentation for developers and linters; Python's runtime does not enforce them."
},
          {
            "id": "q-4.2-2-v2",
            "question": "What syntax declares that a function returns a boolean value?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "def is_valid(code: str) -> bool:",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "def is_valid(code: str): bool",
                                    "explanationIfWrong": "The arrow -> is required before the return type."
                        },
                        {
                                    "id": "C",
                                    "text": "bool def is_valid(code: str):",
                                    "explanationIfWrong": "Return types are placed after parameters with ->."
                        },
                        {
                                    "id": "D",
                                    "text": "def is_valid(code: str) returns bool:",
                                    "explanationIfWrong": "Python uses ->, not the keyword returns."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The syntax -> bool before the colon specifies the return type annotation in Python."
},
          {
            "id": "q-4.2-2-v3",
            "question": "Which tool is standard in the Python ecosystem for checking type hint consistency statically?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "mypy",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "pytest",
                                    "explanationIfWrong": "pytest is a unit testing framework, not a static type checker."
                        },
                        {
                                    "id": "C",
                                    "text": "pip",
                                    "explanationIfWrong": "pip is a package installer."
                        },
                        {
                                    "id": "D",
                                    "text": "venv",
                                    "explanationIfWrong": "venv creates virtual environments."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "mypy is the official, widely adopted static type checker for Python."
}
        ]
      },
      {
        "heading": "Docstrings and Documentation",
        "text": "A docstring is a string literal written as the first statement in a function body, enclosed in triple quotes (\"\"\" ... \"\"\"). Python stores it in the function's __doc__ attribute, allowing help(func_name) and IDE hover tooltips to show usage details.",
        "codeSnippet": "def area(width: float, height: float) -> float:\n    \"\"\"Calculate and return the area of a rectangle.\"\"\"\n    return width * height\n\nprint(area(5, 4))\nprint(area.__doc__)",
        "terminalOutput": "20\nCalculate and return the area of a rectangle.",
        "mcq": {
          "id": "q-4.2-3-v1",
          "question": "How are multi-line docstrings conventionally formatted in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "Enclosed within triple double quotes (\"\"\" ... \"\"\") on the first lines of the function body",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Preceded by # on every line before the def statement",
                              "explanationIfWrong": "Comments before def are not stored in __doc__."
                    },
                    {
                              "id": "C",
                              "text": "Enclosed in /* ... */ blocks",
                              "explanationIfWrong": "/* */ is C/Java syntax, invalid in Python."
                    },
                    {
                              "id": "D",
                              "text": "In a separate README.txt file only",
                              "explanationIfWrong": "Docstrings are written directly inside the function body."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "PEP 257 dictates using triple double quotes (\"\"\") as the first statement inside a function definition."
},
        "retestMcq": {
          "id": "q-4.2-3-v2",
          "question": "How can a user inspect the docstring of a function named greet in the Python interactive shell?",
          "options": [
                    {
                              "id": "A",
                              "text": "help(greet) or greet.__doc__",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "greet.info()",
                              "explanationIfWrong": "Functions do not have an .info() method."
                    },
                    {
                              "id": "C",
                              "text": "print(doc(greet))",
                              "explanationIfWrong": "There is no built-in doc() function."
                    },
                    {
                              "id": "D",
                              "text": "read(greet)",
                              "explanationIfWrong": "read() is not a function documentation tool."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "help() formats the docstring cleanly, and __doc__ retrieves the raw string attribute."
},
        "questionPool": [
          {
            "id": "q-4.2-3-v1",
            "question": "How are multi-line docstrings conventionally formatted in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Enclosed within triple double quotes (\"\"\" ... \"\"\") on the first lines of the function body",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Preceded by # on every line before the def statement",
                                    "explanationIfWrong": "Comments before def are not stored in __doc__."
                        },
                        {
                                    "id": "C",
                                    "text": "Enclosed in /* ... */ blocks",
                                    "explanationIfWrong": "/* */ is C/Java syntax, invalid in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "In a separate README.txt file only",
                                    "explanationIfWrong": "Docstrings are written directly inside the function body."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 257 dictates using triple double quotes (\"\"\") as the first statement inside a function definition."
},
          {
            "id": "q-4.2-3-v2",
            "question": "How can a user inspect the docstring of a function named greet in the Python interactive shell?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "help(greet) or greet.__doc__",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "greet.info()",
                                    "explanationIfWrong": "Functions do not have an .info() method."
                        },
                        {
                                    "id": "C",
                                    "text": "print(doc(greet))",
                                    "explanationIfWrong": "There is no built-in doc() function."
                        },
                        {
                                    "id": "D",
                                    "text": "read(greet)",
                                    "explanationIfWrong": "read() is not a function documentation tool."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "help() formats the docstring cleanly, and __doc__ retrieves the raw string attribute."
},
          {
            "id": "q-4.2-3-v3",
            "question": "What is the primary difference between a # comment and a docstring in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Comments are discarded by the interpreter at compile time, while docstrings are preserved at runtime in the __doc__ attribute",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Docstrings execute faster than comments",
                                    "explanationIfWrong": "Neither comments nor docstrings represent executable computation logic."
                        },
                        {
                                    "id": "C",
                                    "text": "Comments can only be 10 characters long",
                                    "explanationIfWrong": "Comments have no length limit."
                        },
                        {
                                    "id": "D",
                                    "text": "Docstrings are mandatory for every function",
                                    "explanationIfWrong": "Docstrings are optional, though highly recommended."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Comments are stripped out during parsing, but docstrings remain accessible objects at runtime."
}
        ]
      },
      {
        "heading": "Returning Multiple Values",
        "text": "A function can return multiple values separated by commas. Python packs these values into a single tuple automatically. The calling code can unpack them into separate variables in a single assignment.",
        "codeSnippet": "def min_and_max(a, b):\n    if a < b:\n        return a, b\n    return b, a\n\nlow, high = min_and_max(14, 8)\nprint(f\"Lowest: {low}, Highest: {high}\")",
        "terminalOutput": "Lowest: 8, Highest: 14",
        "tip": "return a, b is identical to return (a, b). Python tuple packing and unpacking makes multiple returns concise.",
        "mcq": {
          "id": "q-4.2-4-v1",
          "question": "What data type does a Python function return when you write return x, y?",
          "options": [
                    {
                              "id": "A",
                              "text": "A tuple",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A list",
                              "explanationIfWrong": "Comma-separated items without brackets form a tuple, not a list."
                    },
                    {
                              "id": "C",
                              "text": "A dictionary",
                              "explanationIfWrong": "Dictionaries require key: value pairs."
                    },
                    {
                              "id": "D",
                              "text": "A set",
                              "explanationIfWrong": "Sets are declared with curly braces {}."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Comma-separated values in a return statement are packed into an immutable tuple."
},
        "retestMcq": {
          "id": "q-4.2-4-v2",
          "question": "Given def get_coords(): return 10, 20, what is the value of pt after pt = get_coords()?",
          "options": [
                    {
                              "id": "A",
                              "text": "(10, 20)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[10, 20]",
                              "explanationIfWrong": "Tuples use parentheses (), not square brackets []."
                    },
                    {
                              "id": "C",
                              "text": "10",
                              "explanationIfWrong": "Without unpacking, the entire tuple is assigned to pt."
                    },
                    {
                              "id": "D",
                              "text": "30",
                              "explanationIfWrong": "It does not add the numbers; it returns them as a pair."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Assigning to a single variable stores the packed tuple (10, 20)."
},
        "questionPool": [
          {
            "id": "q-4.2-4-v1",
            "question": "What data type does a Python function return when you write return x, y?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A tuple",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A list",
                                    "explanationIfWrong": "Comma-separated items without brackets form a tuple, not a list."
                        },
                        {
                                    "id": "C",
                                    "text": "A dictionary",
                                    "explanationIfWrong": "Dictionaries require key: value pairs."
                        },
                        {
                                    "id": "D",
                                    "text": "A set",
                                    "explanationIfWrong": "Sets are declared with curly braces {}."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Comma-separated values in a return statement are packed into an immutable tuple."
},
          {
            "id": "q-4.2-4-v2",
            "question": "Given def get_coords(): return 10, 20, what is the value of pt after pt = get_coords()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "(10, 20)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[10, 20]",
                                    "explanationIfWrong": "Tuples use parentheses (), not square brackets []."
                        },
                        {
                                    "id": "C",
                                    "text": "10",
                                    "explanationIfWrong": "Without unpacking, the entire tuple is assigned to pt."
                        },
                        {
                                    "id": "D",
                                    "text": "30",
                                    "explanationIfWrong": "It does not add the numbers; it returns them as a pair."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Assigning to a single variable stores the packed tuple (10, 20)."
},
          {
            "id": "q-4.2-4-v3",
            "question": "What error occurs if a function returns 3 values but the caller writes a, b = func()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError: too many values to unpack (expected 2)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "TypeError: invalid assignment",
                                    "explanationIfWrong": "Unpacking count mismatches raise ValueError."
                        },
                        {
                                    "id": "C",
                                    "text": "The third value is silently stored in None",
                                    "explanationIfWrong": "Python strictly checks unpacking counts."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "The error occurs at runtime when assigning the returned tuple."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The number of variables on the left must exactly equal the number of items in the returned sequence."
}
        ]
      },
      {
        "heading": "Early Returns & Guard Clauses",
        "text": "A guard clause is a condition check placed at the start of a function that returns immediately if arguments are invalid or if a simple edge case is met. This technique eliminates deep nesting and makes function logic cleaner and easier to read.",
        "codeSnippet": "def divide(a: float, b: float):\n    if b == 0:\n        return None  # Guard clause handles edge case early\n    return a / b\n\nprint(divide(10, 2))\nprint(divide(5, 0))",
        "terminalOutput": "5.0\nNone",
        "tip": "Prefer guard clauses over deeply nested if-else ladders.",
        "mcq": {
          "id": "q-4.2-5-v1",
          "question": "What is the primary architectural benefit of using guard clauses with early returns?",
          "options": [
                    {
                              "id": "A",
                              "text": "It reduces nested indentation levels and separates edge-case handling from main logic",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It speeds up Python memory allocation by 50%",
                              "explanationIfWrong": "Guard clauses improve readability and structure, not raw CPU performance."
                    },
                    {
                              "id": "C",
                              "text": "It allows functions to have multiple return types in C",
                              "explanationIfWrong": "This is a Python design practice."
                    },
                    {
                              "id": "D",
                              "text": "It replaces while loops completely",
                              "explanationIfWrong": "Guard clauses structure conditional function exits, not loops."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Early returns exit immediately on boundary conditions, keeping the main happy-path logic unnested and clean."
},
        "retestMcq": {
          "id": "q-4.2-5-v2",
          "question": "What is returned when calculate(-5) executes?\n\ndef calculate(n):\n    if n < 0:\n        return -1\n    return n * 2",
          "options": [
                    {
                              "id": "A",
                              "text": "-1",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "-10",
                              "explanationIfWrong": "The guard clause if n < 0 fires first, returning -1 immediately."
                    },
                    {
                              "id": "C",
                              "text": "None",
                              "explanationIfWrong": "It explicitly returns -1."
                    },
                    {
                              "id": "D",
                              "text": "ValueError",
                              "explanationIfWrong": "The function returns -1 rather than raising an exception."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because -5 < 0 is True, return -1 executes immediately, skipping return n * 2."
},
        "questionPool": [
          {
            "id": "q-4.2-5-v1",
            "question": "What is the primary architectural benefit of using guard clauses with early returns?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It reduces nested indentation levels and separates edge-case handling from main logic",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It speeds up Python memory allocation by 50%",
                                    "explanationIfWrong": "Guard clauses improve readability and structure, not raw CPU performance."
                        },
                        {
                                    "id": "C",
                                    "text": "It allows functions to have multiple return types in C",
                                    "explanationIfWrong": "This is a Python design practice."
                        },
                        {
                                    "id": "D",
                                    "text": "It replaces while loops completely",
                                    "explanationIfWrong": "Guard clauses structure conditional function exits, not loops."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Early returns exit immediately on boundary conditions, keeping the main happy-path logic unnested and clean."
},
          {
            "id": "q-4.2-5-v2",
            "question": "What is returned when calculate(-5) executes?\n\ndef calculate(n):\n    if n < 0:\n        return -1\n    return n * 2",
            "options": [
                        {
                                    "id": "A",
                                    "text": "-1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "-10",
                                    "explanationIfWrong": "The guard clause if n < 0 fires first, returning -1 immediately."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "It explicitly returns -1."
                        },
                        {
                                    "id": "D",
                                    "text": "ValueError",
                                    "explanationIfWrong": "The function returns -1 rather than raising an exception."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because -5 < 0 is True, return -1 executes immediately, skipping return n * 2."
},
          {
            "id": "q-4.2-5-v3",
            "question": "Is it valid in Python for a function to have multiple return statements?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, a function can contain multiple return statements, and the first one reached terminates execution",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, Python only allows exactly one return statement per function",
                                    "explanationIfWrong": "Multiple returns are completely valid and idiomatic."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if all return statements return integers",
                                    "explanationIfWrong": "Any types can be returned."
                        },
                        {
                                    "id": "D",
                                    "text": "Yes, but they must all be grouped on the final line",
                                    "explanationIfWrong": "Return statements can appear anywhere in the function body."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiple return statements provide clean branching; whichever return executes first terminates the call."
}
        ]
      }
    ]
  },
  {
    "id": "4-3-lists",
    "number": "4.3",
    "title": "Lists: Creation & Methods",
    "subtitle": "Work with mutable ordered sequences, list indexing, appending, inserting, popping, and searching.",
    "readTime": "20 min",
    "objectives": [
      "Create empty and pre-populated lists using square brackets []",
      "Access and modify list elements in place by index",
      "Add elements to lists using append() and insert()",
      "Remove elements using pop(), remove(), and del",
      "Determine list length and check element membership with in",
      "Understand list mutability compared to string immutability"
],
    "theoryBlocks": [
      {
        "heading": "Creating and Indexing Lists",
        "text": "A list is an ordered, mutable sequence of items enclosed in square brackets []. Unlike strings, lists can be modified in-place: you can change, add, or delete elements after creation. Elements in a list do not need to be of the same type, though homogeneous lists are most common.",
        "codeSnippet": "numbers = [10, 20, 30, 40]\nprint(numbers[0])   # 10 (first item)\nprint(numbers[-1])  # 40 (last item)\n\n# Modifying an element in-place:\nnumbers[1] = 99\nprint(numbers)",
        "terminalOutput": "10\n40\n[10, 99, 30, 40]",
        "tip": "An empty list can be created using [] or list().",
        "mcq": {
          "id": "q-4.3-0-v1",
          "question": "What is the key difference between Python strings and Python lists regarding item modification?",
          "options": [
                    {
                              "id": "A",
                              "text": "Lists are mutable (elements can be modified in place), while strings are immutable",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Strings can hold numbers, while lists can only hold text",
                              "explanationIfWrong": "Lists can hold any data type."
                    },
                    {
                              "id": "C",
                              "text": "Lists do not support negative indexing",
                              "explanationIfWrong": "Lists support negative indexing identically to strings."
                    },
                    {
                              "id": "D",
                              "text": "Strings are ordered, while lists are unordered",
                              "explanationIfWrong": "Both strings and lists are ordered sequences."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Strings cannot be modified in place (s[0] = 'a' fails), whereas lists allow item reassignment."
},
        "retestMcq": {
          "id": "q-4.3-0-v2",
          "question": "Given items = ['apple', 'banana', 'cherry'], what is items[1]?",
          "options": [
                    {
                              "id": "A",
                              "text": "'banana'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'apple'",
                              "explanationIfWrong": "'apple' is at index 0."
                    },
                    {
                              "id": "C",
                              "text": "'cherry'",
                              "explanationIfWrong": "'cherry' is at index 2 (or -1)."
                    },
                    {
                              "id": "D",
                              "text": "['banana']",
                              "explanationIfWrong": "Single indexing returns the item itself, not a list."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Lists are 0-indexed: index 0 is 'apple', index 1 is 'banana'."
},
        "questionPool": [
          {
            "id": "q-4.3-0-v1",
            "question": "What is the key difference between Python strings and Python lists regarding item modification?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Lists are mutable (elements can be modified in place), while strings are immutable",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Strings can hold numbers, while lists can only hold text",
                                    "explanationIfWrong": "Lists can hold any data type."
                        },
                        {
                                    "id": "C",
                                    "text": "Lists do not support negative indexing",
                                    "explanationIfWrong": "Lists support negative indexing identically to strings."
                        },
                        {
                                    "id": "D",
                                    "text": "Strings are ordered, while lists are unordered",
                                    "explanationIfWrong": "Both strings and lists are ordered sequences."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Strings cannot be modified in place (s[0] = 'a' fails), whereas lists allow item reassignment."
},
          {
            "id": "q-4.3-0-v2",
            "question": "Given items = ['apple', 'banana', 'cherry'], what is items[1]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'banana'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'apple'",
                                    "explanationIfWrong": "'apple' is at index 0."
                        },
                        {
                                    "id": "C",
                                    "text": "'cherry'",
                                    "explanationIfWrong": "'cherry' is at index 2 (or -1)."
                        },
                        {
                                    "id": "D",
                                    "text": "['banana']",
                                    "explanationIfWrong": "Single indexing returns the item itself, not a list."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Lists are 0-indexed: index 0 is 'apple', index 1 is 'banana'."
},
          {
            "id": "q-4.3-0-v3",
            "question": "What happens when you execute numbers = [1, 2, 3]; numbers[5] = 10?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "IndexError: list assignment index out of range",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python automatically expands the list to index 5 with None values",
                                    "explanationIfWrong": "Python does not auto-expand lists on assignment; use append() or insert()."
                        },
                        {
                                    "id": "C",
                                    "text": "numbers becomes [1, 2, 3, 10]",
                                    "explanationIfWrong": "Assignment only works for existing valid indices."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "This is a runtime IndexError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "You cannot assign to an index that does not yet exist; an IndexError is raised."
}
        ]
      },
      {
        "heading": "Adding Elements: append() and insert()",
        "text": "The .append(item) method adds an element to the very end of the list. The .insert(index, item) method inserts an element at the specified index, shifting existing elements to the right. Both methods modify the list in place and return None.",
        "codeSnippet": "fruits = [\"apple\", \"banana\"]\nfruits.append(\"cherry\")      # Adds to end\nfruits.insert(1, \"orange\")   # Inserts at index 1\nprint(fruits)",
        "terminalOutput": "['apple', 'orange', 'banana', 'cherry']",
        "warning": "Never do fruits = fruits.append('item')! Because .append() returns None, this will overwrite your list with None.",
        "mcq": {
          "id": "q-4.3-1-v1",
          "question": "What is the return value of fruits.append('grape')?",
          "options": [
                    {
                              "id": "A",
                              "text": "None",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The updated list",
                              "explanationIfWrong": ".append() mutates in-place and returns None."
                    },
                    {
                              "id": "C",
                              "text": "The new length of the list",
                              "explanationIfWrong": ".append() returns None, not an integer."
                    },
                    {
                              "id": "D",
                              "text": "'grape'",
                              "explanationIfWrong": ".append() returns None."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In-place mutating list methods like append() and sort() return None by design."
},
        "retestMcq": {
          "id": "q-4.3-1-v2",
          "question": "What will nums be after:\n\nnums = [10, 30]\nnums.insert(1, 20)",
          "options": [
                    {
                              "id": "A",
                              "text": "[10, 20, 30]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[20, 10, 30]",
                              "explanationIfWrong": "insert(1, 20) inserts at index 1, not index 0."
                    },
                    {
                              "id": "C",
                              "text": "[10, 30, 20]",
                              "explanationIfWrong": "insert(1, 20) places 20 before 30."
                    },
                    {
                              "id": "D",
                              "text": "[10, 20]",
                              "explanationIfWrong": "insert shifts items right rather than replacing them."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "insert(1, 20) puts 20 at index 1 and shifts 30 to index 2, resulting in [10, 20, 30]."
},
        "questionPool": [
          {
            "id": "q-4.3-1-v1",
            "question": "What is the return value of fruits.append('grape')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "None",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The updated list",
                                    "explanationIfWrong": ".append() mutates in-place and returns None."
                        },
                        {
                                    "id": "C",
                                    "text": "The new length of the list",
                                    "explanationIfWrong": ".append() returns None, not an integer."
                        },
                        {
                                    "id": "D",
                                    "text": "'grape'",
                                    "explanationIfWrong": ".append() returns None."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In-place mutating list methods like append() and sort() return None by design."
},
          {
            "id": "q-4.3-1-v2",
            "question": "What will nums be after:\n\nnums = [10, 30]\nnums.insert(1, 20)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[10, 20, 30]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[20, 10, 30]",
                                    "explanationIfWrong": "insert(1, 20) inserts at index 1, not index 0."
                        },
                        {
                                    "id": "C",
                                    "text": "[10, 30, 20]",
                                    "explanationIfWrong": "insert(1, 20) places 20 before 30."
                        },
                        {
                                    "id": "D",
                                    "text": "[10, 20]",
                                    "explanationIfWrong": "insert shifts items right rather than replacing them."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "insert(1, 20) puts 20 at index 1 and shifts 30 to index 2, resulting in [10, 20, 30]."
},
          {
            "id": "q-4.3-1-v3",
            "question": "What is the result of running items = [1, 2]; items = items.append(3); print(items)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "None",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[1, 2, 3]",
                                    "explanationIfWrong": "items.append() returns None, which overwrites the variable items."
                        },
                        {
                                    "id": "C",
                                    "text": "3",
                                    "explanationIfWrong": "It prints None."
                        },
                        {
                                    "id": "D",
                                    "text": "AttributeError",
                                    "explanationIfWrong": "append is valid, but the reassignment destroys the list."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because append() returns None, assigning items = items.append(3) replaces items with None."
}
        ]
      },
      {
        "heading": "Removing Elements: pop(), remove(), and del",
        "text": "The .pop(index) method removes and returns the element at the given index (defaults to the last element if no index is given). The .remove(value) method removes the first occurrence of a specific value. The del statement deletes an item or slice by index.",
        "codeSnippet": "colors = [\"red\", \"green\", \"blue\", \"green\"]\n\nlast = colors.pop()         # Removes & returns 'green'\ncolors.remove(\"green\")     # Removes first 'green'\ndel colors[0]               # Deletes element at index 0\nprint(f\"Remaining: {colors}, Popped: {last}\")",
        "terminalOutput": "Remaining: ['blue'], Popped: green",
        "mcq": {
          "id": "q-4.3-2-v1",
          "question": "What does numbers.pop() do if no argument is passed?",
          "options": [
                    {
                              "id": "A",
                              "text": "Removes and returns the last element of the list",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Removes the first element of the list",
                              "explanationIfWrong": "To remove the first element, call .pop(0)."
                    },
                    {
                              "id": "C",
                              "text": "Clears the entire list",
                              "explanationIfWrong": "Use .clear() to empty the list."
                    },
                    {
                              "id": "D",
                              "text": "Raises a TypeError",
                              "explanationIfWrong": "The index argument in pop() is optional and defaults to -1."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without arguments, pop() removes and returns the final element (index -1)."
},
        "retestMcq": {
          "id": "q-4.3-2-v2",
          "question": "What error occurs if you call list.remove('zebra') when 'zebra' is not in the list?",
          "options": [
                    {
                              "id": "A",
                              "text": "ValueError: list.remove(x): x not in list",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "IndexError: item out of range",
                              "explanationIfWrong": "remove() searches by value, so it raises ValueError."
                    },
                    {
                              "id": "C",
                              "text": "KeyError: zebra not found",
                              "explanationIfWrong": "KeyError occurs with dictionaries or sets, not list.remove()."
                    },
                    {
                              "id": "D",
                              "text": "Nothing; it fails silently",
                              "explanationIfWrong": "Python raises a ValueError if the value to remove is absent."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "list.remove(x) raises a ValueError if the target element cannot be found in the list."
},
        "questionPool": [
          {
            "id": "q-4.3-2-v1",
            "question": "What does numbers.pop() do if no argument is passed?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Removes and returns the last element of the list",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Removes the first element of the list",
                                    "explanationIfWrong": "To remove the first element, call .pop(0)."
                        },
                        {
                                    "id": "C",
                                    "text": "Clears the entire list",
                                    "explanationIfWrong": "Use .clear() to empty the list."
                        },
                        {
                                    "id": "D",
                                    "text": "Raises a TypeError",
                                    "explanationIfWrong": "The index argument in pop() is optional and defaults to -1."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without arguments, pop() removes and returns the final element (index -1)."
},
          {
            "id": "q-4.3-2-v2",
            "question": "What error occurs if you call list.remove('zebra') when 'zebra' is not in the list?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError: list.remove(x): x not in list",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "IndexError: item out of range",
                                    "explanationIfWrong": "remove() searches by value, so it raises ValueError."
                        },
                        {
                                    "id": "C",
                                    "text": "KeyError: zebra not found",
                                    "explanationIfWrong": "KeyError occurs with dictionaries or sets, not list.remove()."
                        },
                        {
                                    "id": "D",
                                    "text": "Nothing; it fails silently",
                                    "explanationIfWrong": "Python raises a ValueError if the value to remove is absent."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "list.remove(x) raises a ValueError if the target element cannot be found in the list."
},
          {
            "id": "q-4.3-2-v3",
            "question": "If a list has multiple identical items, e.g. [1, 2, 2, 3], what does list.remove(2) do?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Removes only the first occurrence of 2",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Removes all occurrences of 2",
                                    "explanationIfWrong": "remove() stops after deleting the first matching item."
                        },
                        {
                                    "id": "C",
                                    "text": "Raises a ValueError due to duplicates",
                                    "explanationIfWrong": "Duplicates are permitted; only the first is removed."
                        },
                        {
                                    "id": "D",
                                    "text": "Removes the last occurrence of 2",
                                    "explanationIfWrong": "It searches from left to right."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "remove() searches from index 0 and deletes only the first instance of the value found."
}
        ]
      },
      {
        "heading": "Searching Lists with 'in' and .index()",
        "text": "The in keyword checks if an item exists anywhere in a list, returning True or False. The .index(item) method returns the index of the first occurrence of the item, raising a ValueError if the item is not present.",
        "codeSnippet": "pets = [\"cat\", \"dog\", \"bird\"]\nprint(\"dog\" in pets)        # True\nprint(\"fish\" in pets)       # False\nprint(pets.index(\"bird\"))   # 2",
        "terminalOutput": "True\nFalse\n2",
        "tip": "Always check if item in list before calling list.index(item) to avoid ValueError crashes.",
        "mcq": {
          "id": "q-4.3-3-v1",
          "question": "What is the safest way to find the index of an element in a list without risking a crash?",
          "options": [
                    {
                              "id": "A",
                              "text": "Check if item in my_list: first, then call my_list.index(item)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Always call my_list.index(item) directly",
                              "explanationIfWrong": "This raises ValueError if the item is absent."
                    },
                    {
                              "id": "C",
                              "text": "Use my_list.find(item)",
                              "explanationIfWrong": "Lists do not have a .find() method; only strings do."
                    },
                    {
                              "id": "D",
                              "text": "Check if len(my_list) > 0",
                              "explanationIfWrong": "Length check does not confirm the presence of the specific item."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Verifying presence with the in operator guards against ValueError from .index()."
},
        "retestMcq": {
          "id": "q-4.3-3-v2",
          "question": "What does [1, 2, 3].index(2) return?",
          "options": [
                    {
                              "id": "A",
                              "text": "1",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "2",
                              "explanationIfWrong": "Value 2 is at index 1."
                    },
                    {
                              "id": "C",
                              "text": "True",
                              "explanationIfWrong": ".index() returns the integer position, not a boolean."
                    },
                    {
                              "id": "D",
                              "text": "0",
                              "explanationIfWrong": "Index 0 contains 1."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Value 1 is at index 0, and value 2 is at index 1."
},
        "questionPool": [
          {
            "id": "q-4.3-3-v1",
            "question": "What is the safest way to find the index of an element in a list without risking a crash?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Check if item in my_list: first, then call my_list.index(item)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Always call my_list.index(item) directly",
                                    "explanationIfWrong": "This raises ValueError if the item is absent."
                        },
                        {
                                    "id": "C",
                                    "text": "Use my_list.find(item)",
                                    "explanationIfWrong": "Lists do not have a .find() method; only strings do."
                        },
                        {
                                    "id": "D",
                                    "text": "Check if len(my_list) > 0",
                                    "explanationIfWrong": "Length check does not confirm the presence of the specific item."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Verifying presence with the in operator guards against ValueError from .index()."
},
          {
            "id": "q-4.3-3-v2",
            "question": "What does [1, 2, 3].index(2) return?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "2",
                                    "explanationIfWrong": "Value 2 is at index 1."
                        },
                        {
                                    "id": "C",
                                    "text": "True",
                                    "explanationIfWrong": ".index() returns the integer position, not a boolean."
                        },
                        {
                                    "id": "D",
                                    "text": "0",
                                    "explanationIfWrong": "Index 0 contains 1."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Value 1 is at index 0, and value 2 is at index 1."
},
          {
            "id": "q-4.3-3-v3",
            "question": "Does 'cat' in ['c', 'a', 't'] evaluate to True or False?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "False, because 'cat' as a full string is not an element of the list",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "True, because the characters concatenate",
                                    "explanationIfWrong": "List in checks equality against individual list elements, not substring concatenation."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError",
                                    "explanationIfWrong": "in works on any sequence."
                        },
                        {
                                    "id": "D",
                                    "text": "True in Python 3.10+",
                                    "explanationIfWrong": "List element equality applies consistently."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The list contains individual single-character strings; none of them equals 'cat'."
}
        ]
      },
      {
        "heading": "List Slicing and Length",
        "text": "Like strings, lists can be sliced using list[start:end:step]. Slicing a list produces a new independent shallow copy containing the selected elements. The len() function returns the number of elements in the list.",
        "codeSnippet": "letters = [\"a\", \"b\", \"c\", \"d\", \"e\"]\nprint(len(letters))         # 5\nprint(letters[1:4])         # ['b', 'c', 'd']\nprint(letters[:2])          # ['a', 'b']\nprint(letters[::-1])        # ['e', 'd', 'c', 'b', 'a']",
        "terminalOutput": "5\n['b', 'c', 'd']\n['a', 'b']\n['e', 'd', 'c', 'b', 'a']",
        "mcq": {
          "id": "q-4.3-4-v1",
          "question": "Given nums = [10, 20, 30, 40, 50], what is nums[1:3]?",
          "options": [
                    {
                              "id": "A",
                              "text": "[20, 30]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[20, 30, 40]",
                              "explanationIfWrong": "Index 3 is exclusive, so it takes indices 1 and 2 only."
                    },
                    {
                              "id": "C",
                              "text": "[10, 20]",
                              "explanationIfWrong": "Starts at index 1, which is 20."
                    },
                    {
                              "id": "D",
                              "text": "20",
                              "explanationIfWrong": "Slicing returns a list, not a single element."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Indices 1 and 2 are selected: [20, 30]. Index 3 (40) is excluded."
},
        "retestMcq": {
          "id": "q-4.3-4-v2",
          "question": "Does modifying a slice, such as sub = nums[:]; sub[0] = 99, alter the original list nums?",
          "options": [
                    {
                              "id": "A",
                              "text": "No, slicing creates a new list (shallow copy), so modifying sub does not change nums",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Yes, slices are always live views of the original list",
                              "explanationIfWrong": "In Python, list slicing returns a new list object, not a view."
                    },
                    {
                              "id": "C",
                              "text": "Only if nums contains numbers",
                              "explanationIfWrong": "List slice copies are independent regardless of primitive contents."
                    },
                    {
                              "id": "D",
                              "text": "Raises a TypeError",
                              "explanationIfWrong": "Slice copying is standard Python syntax."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "nums[:] returns a distinct list copy. Reassigning items in the copy leaves the original unchanged."
},
        "questionPool": [
          {
            "id": "q-4.3-4-v1",
            "question": "Given nums = [10, 20, 30, 40, 50], what is nums[1:3]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[20, 30]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[20, 30, 40]",
                                    "explanationIfWrong": "Index 3 is exclusive, so it takes indices 1 and 2 only."
                        },
                        {
                                    "id": "C",
                                    "text": "[10, 20]",
                                    "explanationIfWrong": "Starts at index 1, which is 20."
                        },
                        {
                                    "id": "D",
                                    "text": "20",
                                    "explanationIfWrong": "Slicing returns a list, not a single element."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Indices 1 and 2 are selected: [20, 30]. Index 3 (40) is excluded."
},
          {
            "id": "q-4.3-4-v2",
            "question": "Does modifying a slice, such as sub = nums[:]; sub[0] = 99, alter the original list nums?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, slicing creates a new list (shallow copy), so modifying sub does not change nums",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, slices are always live views of the original list",
                                    "explanationIfWrong": "In Python, list slicing returns a new list object, not a view."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if nums contains numbers",
                                    "explanationIfWrong": "List slice copies are independent regardless of primitive contents."
                        },
                        {
                                    "id": "D",
                                    "text": "Raises a TypeError",
                                    "explanationIfWrong": "Slice copying is standard Python syntax."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "nums[:] returns a distinct list copy. Reassigning items in the copy leaves the original unchanged."
},
          {
            "id": "q-4.3-4-v3",
            "question": "What is the length of letters after letters = ['x', 'y']; letters.extend(['z', 'w'])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "4",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3",
                                    "explanationIfWrong": "extend() unpacks both elements into the list: 2 + 2 = 4."
                        },
                        {
                                    "id": "C",
                                    "text": "2",
                                    "explanationIfWrong": "extend() appends each element of the iterable."
                        },
                        {
                                    "id": "D",
                                    "text": "1",
                                    "explanationIfWrong": "The list has 4 elements total."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "extend() appends each element from the argument iterable, expanding the list from 2 to 4 items."
}
        ]
      },
      {
        "heading": "Built-in Functions with Lists",
        "text": "Python includes several built-in functions optimized for lists of numbers: sum() computes the total, min() finds the smallest item, and max() finds the largest item. To count occurrences of an item, use the list method list.count(value).",
        "codeSnippet": "scores = [85, 92, 78, 92, 88]\nprint(f\"Sum: {sum(scores)}\")\nprint(f\"Min: {min(scores)}\")\nprint(f\"Max: {max(scores)}\")\nprint(f\"Times 92 appeared: {scores.count(92)}\")",
        "terminalOutput": "Sum: 435\nMin: 78\nMax: 92\nTimes 92 appeared: 2",
        "mcq": {
          "id": "q-4.3-5-v1",
          "question": "How do you calculate the arithmetic average of a non-empty list of numbers named values?",
          "options": [
                    {
                              "id": "A",
                              "text": "sum(values) / len(values)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "values.average()",
                              "explanationIfWrong": "Python lists have no built-in .average() method."
                    },
                    {
                              "id": "C",
                              "text": "avg(values)",
                              "explanationIfWrong": "There is no built-in avg() function in Python standard library."
                    },
                    {
                              "id": "D",
                              "text": "sum(values) // 2",
                              "explanationIfWrong": "You must divide by the count of elements (len), using true division /."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The standard Python idiom for average is the sum of items divided by their length."
},
        "retestMcq": {
          "id": "q-4.3-5-v2",
          "question": "What does [1, 2, 2, 2, 3].count(2) evaluate to?",
          "options": [
                    {
                              "id": "A",
                              "text": "3",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "2",
                              "explanationIfWrong": "The number 2 appears 3 times in the list."
                    },
                    {
                              "id": "C",
                              "text": "1",
                              "explanationIfWrong": "It counts all occurrences of 2."
                    },
                    {
                              "id": "D",
                              "text": "5",
                              "explanationIfWrong": "5 is the total length, not the count of 2."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The .count() method tallies occurrences of the specified value, which is 3."
},
        "questionPool": [
          {
            "id": "q-4.3-5-v1",
            "question": "How do you calculate the arithmetic average of a non-empty list of numbers named values?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "sum(values) / len(values)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "values.average()",
                                    "explanationIfWrong": "Python lists have no built-in .average() method."
                        },
                        {
                                    "id": "C",
                                    "text": "avg(values)",
                                    "explanationIfWrong": "There is no built-in avg() function in Python standard library."
                        },
                        {
                                    "id": "D",
                                    "text": "sum(values) // 2",
                                    "explanationIfWrong": "You must divide by the count of elements (len), using true division /."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The standard Python idiom for average is the sum of items divided by their length."
},
          {
            "id": "q-4.3-5-v2",
            "question": "What does [1, 2, 2, 2, 3].count(2) evaluate to?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "2",
                                    "explanationIfWrong": "The number 2 appears 3 times in the list."
                        },
                        {
                                    "id": "C",
                                    "text": "1",
                                    "explanationIfWrong": "It counts all occurrences of 2."
                        },
                        {
                                    "id": "D",
                                    "text": "5",
                                    "explanationIfWrong": "5 is the total length, not the count of 2."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The .count() method tallies occurrences of the specified value, which is 3."
},
          {
            "id": "q-4.3-5-v3",
            "question": "What error occurs if you call min([]) on an empty list without providing a default argument?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError: min() arg is an empty sequence",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "IndexError: list index out of range",
                                    "explanationIfWrong": "min() raises a ValueError on empty sequences."
                        },
                        {
                                    "id": "C",
                                    "text": "It returns None",
                                    "explanationIfWrong": "It raises an exception unless min([], default=None) is specified."
                        },
                        {
                                    "id": "D",
                                    "text": "It returns 0",
                                    "explanationIfWrong": "Python does not assume 0 for empty sequences."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling min() or max() on an empty collection raises ValueError unless a default value is supplied."
}
        ]
      }
    ]
  },
  {
    "id": "4-4-definite-iteration",
    "number": "4.4",
    "title": "Definite Iteration with For Loops",
    "subtitle": "Iterate cleanly over sequences using for loops, range(), enumerate(), and loop control statements.",
    "readTime": "20 min",
    "objectives": [
      "Use for loops to iterate directly through lists and strings",
      "Generate integer sequences with range(stop), range(start, stop), and step",
      "Access both index and value simultaneously using enumerate()",
      "Calculate totals, counts, and filters with for loop patterns",
      "Apply break and continue correctly within for loops",
      "Compare when to choose for loops versus while loops"
],
    "theoryBlocks": [
      {
        "heading": "The For Loop Syntax",
        "text": "While loops are indefinite (they run until a condition changes). A for loop provides definite iteration: it executes once for each element in an iterable sequence (like a list or string), automatically assigning the current element to the loop variable.",
        "codeSnippet": "languages = [\"Python\", \"TypeScript\", \"Rust\"]\nfor lang in languages:\n    print(f\"I am learning {lang}\")",
        "terminalOutput": "I am learning Python\nI am learning TypeScript\nI am learning Rust",
        "tip": "Choose a for loop whenever you want to process every item in a collection or repeat a fixed number of times.",
        "mcq": {
          "id": "q-4.4-0-v1",
          "question": "How many times does this loop execute?\n\nfor char in 'code':\n    print(char)",
          "options": [
                    {
                              "id": "A",
                              "text": "4 times",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "1 time",
                              "explanationIfWrong": "The for loop iterates over each character in the string sequence."
                    },
                    {
                              "id": "C",
                              "text": "5 times",
                              "explanationIfWrong": "'code' contains exactly 4 characters: 'c', 'o', 'd', 'e'."
                    },
                    {
                              "id": "D",
                              "text": "Infinite loop",
                              "explanationIfWrong": "for loops over finite collections always terminate."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Strings are sequences. A for loop over 'code' iterates 4 times, once per character."
},
        "retestMcq": {
          "id": "q-4.4-0-v2",
          "question": "What is the value of item during the second iteration of for item in [10, 20, 30]:?",
          "options": [
                    {
                              "id": "A",
                              "text": "20",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "10",
                              "explanationIfWrong": "10 is the element in the first iteration."
                    },
                    {
                              "id": "C",
                              "text": "1",
                              "explanationIfWrong": "The loop variable receives the elements, not the index."
                    },
                    {
                              "id": "D",
                              "text": "30",
                              "explanationIfWrong": "30 is the third iteration."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Iteration 1: item = 10. Iteration 2: item = 20. Iteration 3: item = 30."
},
        "questionPool": [
          {
            "id": "q-4.4-0-v1",
            "question": "How many times does this loop execute?\n\nfor char in 'code':\n    print(char)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "4 times",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1 time",
                                    "explanationIfWrong": "The for loop iterates over each character in the string sequence."
                        },
                        {
                                    "id": "C",
                                    "text": "5 times",
                                    "explanationIfWrong": "'code' contains exactly 4 characters: 'c', 'o', 'd', 'e'."
                        },
                        {
                                    "id": "D",
                                    "text": "Infinite loop",
                                    "explanationIfWrong": "for loops over finite collections always terminate."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Strings are sequences. A for loop over 'code' iterates 4 times, once per character."
},
          {
            "id": "q-4.4-0-v2",
            "question": "What is the value of item during the second iteration of for item in [10, 20, 30]:?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "20",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "10",
                                    "explanationIfWrong": "10 is the element in the first iteration."
                        },
                        {
                                    "id": "C",
                                    "text": "1",
                                    "explanationIfWrong": "The loop variable receives the elements, not the index."
                        },
                        {
                                    "id": "D",
                                    "text": "30",
                                    "explanationIfWrong": "30 is the third iteration."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iteration 1: item = 10. Iteration 2: item = 20. Iteration 3: item = 30."
},
          {
            "id": "q-4.4-0-v3",
            "question": "What is the primary advantage of a for loop over a while loop when iterating through a list?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No manual index variable or increment is needed, eliminating off-by-one errors and infinite loops",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "for loops can modify strings in place",
                                    "explanationIfWrong": "Strings remain immutable."
                        },
                        {
                                    "id": "C",
                                    "text": "for loops run in a separate thread",
                                    "explanationIfWrong": "Execution is sequential in standard Python."
                        },
                        {
                                    "id": "D",
                                    "text": "for loops don't support break",
                                    "explanationIfWrong": "for loops fully support break and continue."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "for loops directly yield elements without requiring index counters or condition maintenance."
}
        ]
      },
      {
        "heading": "The range() Function",
        "text": "The range() function produces an iterable sequence of integers. It accepts up to three arguments: range(stop) goes from 0 up to stop - 1; range(start, stop) goes from start up to stop - 1; and range(start, stop, step) increments by step.",
        "codeSnippet": "# 0 to 4:\nfor i in range(5):\n    print(i, end=\" \")\nprint()\n\n# 10 down to 2 by -2:\nfor i in range(10, 0, -2):\n    print(i, end=\" \")",
        "terminalOutput": "0 1 2 3 4 \n10 8 6 4 2 ",
        "mcq": {
          "id": "q-4.4-1-v1",
          "question": "What numbers are printed by for i in range(2, 5): print(i, end=' ')?",
          "options": [
                    {
                              "id": "A",
                              "text": "2 3 4",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "2 3 4 5",
                              "explanationIfWrong": "The stop value (5) is exclusive."
                    },
                    {
                              "id": "C",
                              "text": "0 1 2 3 4",
                              "explanationIfWrong": "The start value is explicitly 2, not 0."
                    },
                    {
                              "id": "D",
                              "text": "3 4 5",
                              "explanationIfWrong": "Start (2) is inclusive."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "range(2, 5) generates integers starting at 2 up to but excluding 5: 2, 3, 4."
},
        "retestMcq": {
          "id": "q-4.4-1-v2",
          "question": "How do you generate the even numbers 0, 2, 4, 6, 8 using range()?",
          "options": [
                    {
                              "id": "A",
                              "text": "range(0, 10, 2)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "range(0, 8, 2)",
                              "explanationIfWrong": "range(0, 8, 2) stops before 8, producing 0, 2, 4, 6."
                    },
                    {
                              "id": "C",
                              "text": "range(2, 10)",
                              "explanationIfWrong": "Without step, range increments by 1."
                    },
                    {
                              "id": "D",
                              "text": "range(0, 8)",
                              "explanationIfWrong": "Step defaults to 1."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "range(0, 10, 2) starts at 0, adds 2 each step, and stops before 10: 0, 2, 4, 6, 8."
},
        "questionPool": [
          {
            "id": "q-4.4-1-v1",
            "question": "What numbers are printed by for i in range(2, 5): print(i, end=' ')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "2 3 4",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "2 3 4 5",
                                    "explanationIfWrong": "The stop value (5) is exclusive."
                        },
                        {
                                    "id": "C",
                                    "text": "0 1 2 3 4",
                                    "explanationIfWrong": "The start value is explicitly 2, not 0."
                        },
                        {
                                    "id": "D",
                                    "text": "3 4 5",
                                    "explanationIfWrong": "Start (2) is inclusive."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "range(2, 5) generates integers starting at 2 up to but excluding 5: 2, 3, 4."
},
          {
            "id": "q-4.4-1-v2",
            "question": "How do you generate the even numbers 0, 2, 4, 6, 8 using range()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "range(0, 10, 2)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "range(0, 8, 2)",
                                    "explanationIfWrong": "range(0, 8, 2) stops before 8, producing 0, 2, 4, 6."
                        },
                        {
                                    "id": "C",
                                    "text": "range(2, 10)",
                                    "explanationIfWrong": "Without step, range increments by 1."
                        },
                        {
                                    "id": "D",
                                    "text": "range(0, 8)",
                                    "explanationIfWrong": "Step defaults to 1."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "range(0, 10, 2) starts at 0, adds 2 each step, and stops before 10: 0, 2, 4, 6, 8."
},
          {
            "id": "q-4.4-1-v3",
            "question": "What is list(range(3)) in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[0, 1, 2]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[1, 2, 3]",
                                    "explanationIfWrong": "range(3) defaults to starting at 0."
                        },
                        {
                                    "id": "C",
                                    "text": "[0, 1, 2, 3]",
                                    "explanationIfWrong": "Stop is exclusive, so 3 is not included."
                        },
                        {
                                    "id": "D",
                                    "text": "(0, 1, 2)",
                                    "explanationIfWrong": "list() converts to a list [0, 1, 2]."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "range(3) yields 0, 1, 2. Converting with list() creates [0, 1, 2]."
}
        ]
      },
      {
        "heading": "The enumerate() Function",
        "text": "When you need both the index and the value of items during iteration, use enumerate(). It wraps an iterable and yields pairs of (index, item) in each iteration, avoiding the anti-pattern of manual index counters or range(len(list)).",
        "codeSnippet": "runners = [\"Alice\", \"Bob\", \"Charlie\"]\nfor index, name in enumerate(runners, start=1):\n    print(f\"Place {index}: {name}\")",
        "terminalOutput": "Place 1: Alice\nPlace 2: Bob\nPlace 3: Charlie",
        "tip": "You can customize the initial count using the start keyword argument, e.g. enumerate(items, start=1).",
        "mcq": {
          "id": "q-4.4-2-v1",
          "question": "What does enumerate(['a', 'b']) yield on its first iteration?",
          "options": [
                    {
                              "id": "A",
                              "text": "(0, 'a')",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "(1, 'a')",
                              "explanationIfWrong": "enumerate() defaults to index 0 unless start is specified."
                    },
                    {
                              "id": "C",
                              "text": "'a'",
                              "explanationIfWrong": "enumerate() yields a tuple containing both index and value."
                    },
                    {
                              "id": "D",
                              "text": "0",
                              "explanationIfWrong": "It yields both the index and the element."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Default enumerate indexing starts at 0, pairing index 0 with element 'a': (0, 'a')."
},
        "retestMcq": {
          "id": "q-4.4-2-v2",
          "question": "Why is for i, val in enumerate(my_list): preferred over for i in range(len(my_list)):?",
          "options": [
                    {
                              "id": "A",
                              "text": "It is more pythonic, easier to read, and avoids looking up my_list[i] manually",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "enumerate() prevents memory leaks",
                              "explanationIfWrong": "Both consume similar memory; enumerate is cleaner and idiomatic."
                    },
                    {
                              "id": "C",
                              "text": "range(len()) is deprecated in Python 3",
                              "explanationIfWrong": "It is not deprecated, but enumerate is the cleaner idiom."
                    },
                    {
                              "id": "D",
                              "text": "enumerate() reverses the list automatically",
                              "explanationIfWrong": "enumerate preserves forward order."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "enumerate unpacks the index and item simultaneously, producing cleaner, less error-prone code."
},
        "questionPool": [
          {
            "id": "q-4.4-2-v1",
            "question": "What does enumerate(['a', 'b']) yield on its first iteration?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "(0, 'a')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "(1, 'a')",
                                    "explanationIfWrong": "enumerate() defaults to index 0 unless start is specified."
                        },
                        {
                                    "id": "C",
                                    "text": "'a'",
                                    "explanationIfWrong": "enumerate() yields a tuple containing both index and value."
                        },
                        {
                                    "id": "D",
                                    "text": "0",
                                    "explanationIfWrong": "It yields both the index and the element."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Default enumerate indexing starts at 0, pairing index 0 with element 'a': (0, 'a')."
},
          {
            "id": "q-4.4-2-v2",
            "question": "Why is for i, val in enumerate(my_list): preferred over for i in range(len(my_list)):?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It is more pythonic, easier to read, and avoids looking up my_list[i] manually",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "enumerate() prevents memory leaks",
                                    "explanationIfWrong": "Both consume similar memory; enumerate is cleaner and idiomatic."
                        },
                        {
                                    "id": "C",
                                    "text": "range(len()) is deprecated in Python 3",
                                    "explanationIfWrong": "It is not deprecated, but enumerate is the cleaner idiom."
                        },
                        {
                                    "id": "D",
                                    "text": "enumerate() reverses the list automatically",
                                    "explanationIfWrong": "enumerate preserves forward order."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "enumerate unpacks the index and item simultaneously, producing cleaner, less error-prone code."
},
          {
            "id": "q-4.4-2-v3",
            "question": "What does enumerate(['apple'], start=5) yield?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "(5, 'apple')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "(0, 'apple')",
                                    "explanationIfWrong": "start=5 sets the initial index counter to 5."
                        },
                        {
                                    "id": "C",
                                    "text": "IndexError",
                                    "explanationIfWrong": "start can be any integer."
                        },
                        {
                                    "id": "D",
                                    "text": "(1, 'apple')",
                                    "explanationIfWrong": "The specified start is 5."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Setting start=5 causes the first yielded index to be 5: (5, 'apple')."
}
        ]
      },
      {
        "heading": "Filtering & Accumulation with For Loops",
        "text": "For loops excel at filtering elements and computing aggregations. A common pattern is initializing an accumulator (such as an empty list or counter) before the loop, evaluating each element with an if statement, and updating the accumulator.",
        "codeSnippet": "numbers = [12, -7, 5, -3, 8]\npositive_nums = []\ntotal_sum = 0\n\nfor n in numbers:\n    if n > 0:\n        positive_nums.append(n)\n        total_sum += n\n\nprint(f\"Positives: {positive_nums}, Sum: {total_sum}\")",
        "terminalOutput": "Positives: [12, 5, 8], Sum: 25",
        "mcq": {
          "id": "q-4.4-3-v1",
          "question": "What will count be after this loop?\n\ncount = 0\nfor x in [1, 4, 7, 2, 9]:\n    if x > 3:\n        count += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "3",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "5",
                              "explanationIfWrong": "Only numbers > 3 (4, 7, 9) increment count."
                    },
                    {
                              "id": "C",
                              "text": "2",
                              "explanationIfWrong": "Numbers > 3 are 4, 7, 9 (3 items)."
                    },
                    {
                              "id": "D",
                              "text": "20",
                              "explanationIfWrong": "count increments by 1, it does not sum x."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Numbers greater than 3 are 4, 7, and 9 (3 items). count reaches 3."
},
        "retestMcq": {
          "id": "q-4.4-3-v2",
          "question": "What is the bug in this code attempting to collect even numbers?\n\nevens = []\nfor n in [1, 2, 3, 4]:\n    if n % 2 == 0:\n        evens = [n]",
          "options": [
                    {
                              "id": "A",
                              "text": "evens is overwritten with [n] on each match instead of using evens.append(n)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "n % 2 == 0 is incorrect logic for even numbers",
                              "explanationIfWrong": "n % 2 == 0 correctly checks for even numbers."
                    },
                    {
                              "id": "C",
                              "text": "for loops cannot modify empty lists",
                              "explanationIfWrong": "Lists can be freely modified."
                    },
                    {
                              "id": "D",
                              "text": "A SyntaxError occurs on evens = [n]",
                              "explanationIfWrong": "The code is syntactically valid but logically buggy."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Reassigning evens = [n] discards earlier items, leaving only the final even number [4]."
},
        "questionPool": [
          {
            "id": "q-4.4-3-v1",
            "question": "What will count be after this loop?\n\ncount = 0\nfor x in [1, 4, 7, 2, 9]:\n    if x > 3:\n        count += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "5",
                                    "explanationIfWrong": "Only numbers > 3 (4, 7, 9) increment count."
                        },
                        {
                                    "id": "C",
                                    "text": "2",
                                    "explanationIfWrong": "Numbers > 3 are 4, 7, 9 (3 items)."
                        },
                        {
                                    "id": "D",
                                    "text": "20",
                                    "explanationIfWrong": "count increments by 1, it does not sum x."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Numbers greater than 3 are 4, 7, and 9 (3 items). count reaches 3."
},
          {
            "id": "q-4.4-3-v2",
            "question": "What is the bug in this code attempting to collect even numbers?\n\nevens = []\nfor n in [1, 2, 3, 4]:\n    if n % 2 == 0:\n        evens = [n]",
            "options": [
                        {
                                    "id": "A",
                                    "text": "evens is overwritten with [n] on each match instead of using evens.append(n)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "n % 2 == 0 is incorrect logic for even numbers",
                                    "explanationIfWrong": "n % 2 == 0 correctly checks for even numbers."
                        },
                        {
                                    "id": "C",
                                    "text": "for loops cannot modify empty lists",
                                    "explanationIfWrong": "Lists can be freely modified."
                        },
                        {
                                    "id": "D",
                                    "text": "A SyntaxError occurs on evens = [n]",
                                    "explanationIfWrong": "The code is syntactically valid but logically buggy."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Reassigning evens = [n] discards earlier items, leaving only the final even number [4]."
},
          {
            "id": "q-4.4-3-v3",
            "question": "What does this loop calculate?\n\nlargest = None\nfor num in items:\n    if largest is None or num > largest:\n        largest = num",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The maximum value in items",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The sum of all items",
                                    "explanationIfWrong": "It does not perform addition."
                        },
                        {
                                    "id": "C",
                                    "text": "The average value in items",
                                    "explanationIfWrong": "It finds the maximum element."
                        },
                        {
                                    "id": "D",
                                    "text": "The first negative number",
                                    "explanationIfWrong": "It tracks the largest value seen."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "This is the canonical pattern for finding the maximum value in an iterable."
}
        ]
      },
      {
        "heading": "break and continue in For Loops",
        "text": "The break statement terminates a for loop immediately, abandoning any remaining elements in the sequence. The continue statement skips the rest of the current iteration's body and advances to the next element in the sequence.",
        "codeSnippet": "for n in [1, 2, 3, 4, 5]:\n    if n == 3:\n        continue  # Skips 3\n    if n == 5:\n        break     # Stops before printing 5\n    print(n, end=\" \")",
        "terminalOutput": "1 2 4 ",
        "mcq": {
          "id": "q-4.4-4-v1",
          "question": "What is printed by this loop?\n\nfor x in [10, 20, 30, 40]:\n    if x == 30:\n        break\n    print(x, end=' ')",
          "options": [
                    {
                              "id": "A",
                              "text": "10 20",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "10 20 30",
                              "explanationIfWrong": "The break triggers before print(x) when x == 30."
                    },
                    {
                              "id": "C",
                              "text": "10 20 40",
                              "explanationIfWrong": "break terminates the entire loop, skipping 40 as well."
                    },
                    {
                              "id": "D",
                              "text": "30 40",
                              "explanationIfWrong": "The loop starts at 10."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When x == 30, break executes immediately. The loop ends; 10 and 20 are printed."
},
        "retestMcq": {
          "id": "q-4.4-4-v2",
          "question": "What is printed by this loop?\n\nfor c in 'cat':\n    if c == 'a':\n        continue\n    print(c, end='')",
          "options": [
                    {
                              "id": "A",
                              "text": "ct",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "c",
                              "explanationIfWrong": "continue only skips 'a'; 't' runs on the next iteration."
                    },
                    {
                              "id": "C",
                              "text": "cat",
                              "explanationIfWrong": "'a' is skipped by continue."
                    },
                    {
                              "id": "D",
                              "text": "a",
                              "explanationIfWrong": "'c' and 't' are printed."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Iteration 'c' prints. Iteration 'a' is skipped by continue. Iteration 't' prints. Output is 'ct'."
},
        "questionPool": [
          {
            "id": "q-4.4-4-v1",
            "question": "What is printed by this loop?\n\nfor x in [10, 20, 30, 40]:\n    if x == 30:\n        break\n    print(x, end=' ')",
            "options": [
                        {
                                    "id": "A",
                                    "text": "10 20",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "10 20 30",
                                    "explanationIfWrong": "The break triggers before print(x) when x == 30."
                        },
                        {
                                    "id": "C",
                                    "text": "10 20 40",
                                    "explanationIfWrong": "break terminates the entire loop, skipping 40 as well."
                        },
                        {
                                    "id": "D",
                                    "text": "30 40",
                                    "explanationIfWrong": "The loop starts at 10."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When x == 30, break executes immediately. The loop ends; 10 and 20 are printed."
},
          {
            "id": "q-4.4-4-v2",
            "question": "What is printed by this loop?\n\nfor c in 'cat':\n    if c == 'a':\n        continue\n    print(c, end='')",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ct",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "c",
                                    "explanationIfWrong": "continue only skips 'a'; 't' runs on the next iteration."
                        },
                        {
                                    "id": "C",
                                    "text": "cat",
                                    "explanationIfWrong": "'a' is skipped by continue."
                        },
                        {
                                    "id": "D",
                                    "text": "a",
                                    "explanationIfWrong": "'c' and 't' are printed."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iteration 'c' prints. Iteration 'a' is skipped by continue. Iteration 't' prints. Output is 'ct'."
},
          {
            "id": "q-4.4-4-v3",
            "question": "Where does execution continue after a break executes inside a for loop?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "At the first statement immediately after the for loop block",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "At the next element of the iterable",
                                    "explanationIfWrong": "That is continue, not break."
                        },
                        {
                                    "id": "C",
                                    "text": "At the beginning of the program",
                                    "explanationIfWrong": "break only exits the enclosing loop."
                        },
                        {
                                    "id": "D",
                                    "text": "It raises an exception",
                                    "explanationIfWrong": "break is normal control flow."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "break immediately finishes the loop structure and resumes code after the loop."
}
        ]
      },
      {
        "heading": "The for-else Construct",
        "text": "Python supports an optional else block on for loops. The else block executes only if the for loop finishes iterating through all elements naturally without encountering a break statement. If break triggers, the else block is skipped.",
        "codeSnippet": "target = 7\nnumbers = [1, 3, 5, 9]\n\nfor n in numbers:\n    if n == target:\n        print(\"Found!\")\n        break\nelse:\n    print(\"Target not found in list.\")",
        "terminalOutput": "Target not found in list.",
        "tip": "Think of for-else as 'for-nobreak'. It is ideal for search algorithms where an action is needed only when no match was found.",
        "mcq": {
          "id": "q-4.4-5-v1",
          "question": "When does the else block attached to a for loop execute in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "Only when the loop completes all iterations without hitting a break",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Whenever the loop encounters a break statement",
                              "explanationIfWrong": "Hitting break skips the else block entirely."
                    },
                    {
                              "id": "C",
                              "text": "On every single iteration",
                              "explanationIfWrong": "The else block executes once after the loop finishes."
                    },
                    {
                              "id": "D",
                              "text": "Only if the sequence was initially empty",
                              "explanationIfWrong": "It executes for empty sequences as well, but also whenever no break occurred."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A loop's else clause runs when the loop exhausts its sequence without being interrupted by break."
},
        "retestMcq": {
          "id": "q-4.4-5-v2",
          "question": "What is printed by:\n\nfor x in [1, 2]:\n    if x == 1:\n        break\nelse:\n    print('Complete')",
          "options": [
                    {
                              "id": "A",
                              "text": "Nothing",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Complete",
                              "explanationIfWrong": "Because break executed on x=1, the else clause is skipped."
                    },
                    {
                              "id": "C",
                              "text": "1",
                              "explanationIfWrong": "There is no print(x) inside the loop."
                    },
                    {
                              "id": "D",
                              "text": "SyntaxError",
                              "explanationIfWrong": "for-else is valid Python syntax."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because the loop is terminated early by break on the first element, the else block does not run."
},
        "questionPool": [
          {
            "id": "q-4.4-5-v1",
            "question": "When does the else block attached to a for loop execute in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Only when the loop completes all iterations without hitting a break",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Whenever the loop encounters a break statement",
                                    "explanationIfWrong": "Hitting break skips the else block entirely."
                        },
                        {
                                    "id": "C",
                                    "text": "On every single iteration",
                                    "explanationIfWrong": "The else block executes once after the loop finishes."
                        },
                        {
                                    "id": "D",
                                    "text": "Only if the sequence was initially empty",
                                    "explanationIfWrong": "It executes for empty sequences as well, but also whenever no break occurred."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A loop's else clause runs when the loop exhausts its sequence without being interrupted by break."
},
          {
            "id": "q-4.4-5-v2",
            "question": "What is printed by:\n\nfor x in [1, 2]:\n    if x == 1:\n        break\nelse:\n    print('Complete')",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Nothing",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Complete",
                                    "explanationIfWrong": "Because break executed on x=1, the else clause is skipped."
                        },
                        {
                                    "id": "C",
                                    "text": "1",
                                    "explanationIfWrong": "There is no print(x) inside the loop."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "for-else is valid Python syntax."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because the loop is terminated early by break on the first element, the else block does not run."
},
          {
            "id": "q-4.4-5-v3",
            "question": "What common programming problem is elegantly solved by the for-else construct?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Searching for an item in a collection and executing fallback code if no item matches, without needing a boolean flag",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Sorting lists in reverse order",
                                    "explanationIfWrong": "Sorting is handled by sort() or sorted()."
                        },
                        {
                                    "id": "C",
                                    "text": "Converting while loops to for loops",
                                    "explanationIfWrong": "while loops also have an else clause."
                        },
                        {
                                    "id": "D",
                                    "text": "Handling division by zero",
                                    "explanationIfWrong": "Zero division is handled with try-except."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "for-else replaces the traditional pattern of creating a found = False flag variable."
}
        ]
      }
    ]
  },
  {
    "id": "4-5-formatting",
    "number": "4.5",
    "title": "Print Formatting & F-Strings",
    "subtitle": "Format numbers, decimal precision, text alignment, padding, and tables using modern Python f-strings.",
    "readTime": "20 min",
    "objectives": [
      "Use f-strings (formatted string literals) to interpolate expressions",
      "Format floating-point numbers with specified decimal precision :.2f",
      "Align text left, right, and centered using :<, :>, and :^",
      "Pad numbers with leading zeros using :04d",
      "Format large numbers with thousands comma separators :,",
      "Print clean tabular data and reports using fixed-width columns"
],
    "theoryBlocks": [
      {
        "heading": "Modern F-Strings Basics",
        "text": "Introduced in Python 3.6, formatted string literals (f-strings) prefix string quotes with f or F. Inside an f-string, curly braces {} evaluate any valid Python expression at runtime and convert the result to a string.",
        "codeSnippet": "name = \"Python\"\nyear = 1991\nprint(f\"{name} was created in {year}.\")\nprint(f\"In 5 years it will be {2026 + 5}.\")",
        "terminalOutput": "Python was created in 1991.\nIn 5 years it will be 2031.",
        "tip": "You can include method calls and calculations inside f-string braces, e.g. f\"{name.upper()}: {10 * 2}\".",
        "mcq": {
          "id": "q-4.5-0-v1",
          "question": "What prefix is required before the opening quote to declare an f-string in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "f or F",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "$",
                              "explanationIfWrong": "$ is used in Bash or JavaScript template literals, not Python."
                    },
                    {
                              "id": "C",
                              "text": "@",
                              "explanationIfWrong": "@ is used for decorators in Python."
                    },
                    {
                              "id": "D",
                              "text": "format",
                              "explanationIfWrong": "Python uses the prefix letter f or F."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Prefixing quotes with f (e.g. f\"Value: {x}\") designates a formatted string literal."
},
        "retestMcq": {
          "id": "q-4.5-0-v2",
          "question": "What is the output of print(f\"{2 * 3 + 1}\")?",
          "options": [
                    {
                              "id": "A",
                              "text": "7",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "{2 * 3 + 1}",
                              "explanationIfWrong": "Expressions inside {} are evaluated in f-strings."
                    },
                    {
                              "id": "C",
                              "text": "2 * 3 + 1",
                              "explanationIfWrong": "The math expression inside {} is calculated."
                    },
                    {
                              "id": "D",
                              "text": "TypeError",
                              "explanationIfWrong": "Arithmetic expressions are fully valid inside f-string replacements."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python evaluates the expression 2 * 3 + 1 = 7 and inserts it into the string."
},
        "questionPool": [
          {
            "id": "q-4.5-0-v1",
            "question": "What prefix is required before the opening quote to declare an f-string in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "f or F",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "$",
                                    "explanationIfWrong": "$ is used in Bash or JavaScript template literals, not Python."
                        },
                        {
                                    "id": "C",
                                    "text": "@",
                                    "explanationIfWrong": "@ is used for decorators in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "format",
                                    "explanationIfWrong": "Python uses the prefix letter f or F."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Prefixing quotes with f (e.g. f\"Value: {x}\") designates a formatted string literal."
},
          {
            "id": "q-4.5-0-v2",
            "question": "What is the output of print(f\"{2 * 3 + 1}\")?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "7",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "{2 * 3 + 1}",
                                    "explanationIfWrong": "Expressions inside {} are evaluated in f-strings."
                        },
                        {
                                    "id": "C",
                                    "text": "2 * 3 + 1",
                                    "explanationIfWrong": "The math expression inside {} is calculated."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Arithmetic expressions are fully valid inside f-string replacements."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python evaluates the expression 2 * 3 + 1 = 7 and inserts it into the string."
},
          {
            "id": "q-4.5-0-v3",
            "question": "How do you include literal curly brace characters { and } in an f-string?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "By doubling them: {{ and }}",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "By escaping with a backslash: \\{ and \\}",
                                    "explanationIfWrong": "Backslash escapes inside f-string braces were restricted; {{ is the standard escaping rule."
                        },
                        {
                                    "id": "C",
                                    "text": "By wrapping them in quotes: '{' and '}'",
                                    "explanationIfWrong": "Doubling {{ is Python's syntax."
                        },
                        {
                                    "id": "D",
                                    "text": "Literal braces are not allowed in f-strings",
                                    "explanationIfWrong": "Doubling braces renders them literally."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In f-strings, {{ becomes a single literal { and }} becomes a single literal }."
}
        ]
      },
      {
        "heading": "Floating-Point Precision",
        "text": "To format floating-point numbers to a specific number of decimal places, use the format specifier :.Nf inside the replacement field. The number is rounded according to standard IEEE rules.",
        "codeSnippet": "pi = 3.14159265\nprice = 19.5\nprint(f\"Pi to 2 decimals: {pi:.2f}\")\nprint(f\"Pi to 4 decimals: {pi:.4f}\")\nprint(f\"Price: ${price:.2f}\")",
        "terminalOutput": "Pi to 2 decimals: 3.14\nPi to 4 decimals: 3.1416\nPrice: $19.50",
        "mcq": {
          "id": "q-4.5-1-v1",
          "question": "What is the output of val = 4.5678; print(f\"{val:.2f}\")?",
          "options": [
                    {
                              "id": "A",
                              "text": "4.57",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "4.56",
                              "explanationIfWrong": "The 7 after 6 rounds 6 up to 7."
                    },
                    {
                              "id": "C",
                              "text": "4.5",
                              "explanationIfWrong": ":.2f formats to exactly two decimal places."
                    },
                    {
                              "id": "D",
                              "text": "4.568",
                              "explanationIfWrong": "Two decimals means two numbers after the dot."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "4.5678 rounded to 2 decimal places with :.2f yields '4.57'."
},
        "retestMcq": {
          "id": "q-4.5-1-v2",
          "question": "What does print(f\"{5:.2f}\") output when formatting an integer with :.2f?",
          "options": [
                    {
                              "id": "A",
                              "text": "5.00",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "5",
                              "explanationIfWrong": "The .2f specifier ensures two trailing decimal digits."
                    },
                    {
                              "id": "C",
                              "text": "TypeError: cannot format int with f",
                              "explanationIfWrong": "Python converts numeric types to float when formatting with :f."
                    },
                    {
                              "id": "D",
                              "text": "0.05",
                              "explanationIfWrong": "It formats 5 with two zeros after the decimal point."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": ":.2f formats numeric values with 2 decimal places, producing '5.00'."
},
        "questionPool": [
          {
            "id": "q-4.5-1-v1",
            "question": "What is the output of val = 4.5678; print(f\"{val:.2f}\")?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "4.57",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "4.56",
                                    "explanationIfWrong": "The 7 after 6 rounds 6 up to 7."
                        },
                        {
                                    "id": "C",
                                    "text": "4.5",
                                    "explanationIfWrong": ":.2f formats to exactly two decimal places."
                        },
                        {
                                    "id": "D",
                                    "text": "4.568",
                                    "explanationIfWrong": "Two decimals means two numbers after the dot."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "4.5678 rounded to 2 decimal places with :.2f yields '4.57'."
},
          {
            "id": "q-4.5-1-v2",
            "question": "What does print(f\"{5:.2f}\") output when formatting an integer with :.2f?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "5.00",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "5",
                                    "explanationIfWrong": "The .2f specifier ensures two trailing decimal digits."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError: cannot format int with f",
                                    "explanationIfWrong": "Python converts numeric types to float when formatting with :f."
                        },
                        {
                                    "id": "D",
                                    "text": "0.05",
                                    "explanationIfWrong": "It formats 5 with two zeros after the decimal point."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ":.2f formats numeric values with 2 decimal places, producing '5.00'."
},
          {
            "id": "q-4.5-1-v3",
            "question": "Which specifier rounds a percentage number 0.852 to '85.2%'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "{0.852:.1%}",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "{0.852:.1f}%",
                                    "explanationIfWrong": "This produces '0.9%' without multiplying by 100."
                        },
                        {
                                    "id": "C",
                                    "text": "{0.852 * 100}%",
                                    "explanationIfWrong": "The % format specifier automatically multiplies by 100."
                        },
                        {
                                    "id": "D",
                                    "text": "{0.852:percent}",
                                    "explanationIfWrong": "Python uses % as the format type character."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The % format specifier multiplies by 100 and appends %, so :.1% yields '85.2%'."
}
        ]
      },
      {
        "heading": "Text Alignment & Column Widths",
        "text": "You can control field width and text alignment using format specifiers: :<N aligns left (default for strings), :>N aligns right (default for numbers), and :^N centers text within a field of width N.",
        "codeSnippet": "word = \"Python\"\nprint(f\"{word:<10}!\")  # Left-aligned in 10 spaces\nprint(f\"{word:>10}!\")  # Right-aligned in 10 spaces\nprint(f\"{word:^10}!\")  # Centered in 10 spaces",
        "terminalOutput": "Python    !\n    Python!\n  Python  !",
        "mcq": {
          "id": "q-4.5-2-v1",
          "question": "Which alignment specifier centers the text 'TEST' within a width of 10 characters?",
          "options": [
                    {
                              "id": "A",
                              "text": "f\"{'TEST':^10}\"",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "f\"{'TEST':<10}\"",
                              "explanationIfWrong": "< aligns text to the left."
                    },
                    {
                              "id": "C",
                              "text": "f\"{'TEST':>10}\"",
                              "explanationIfWrong": "> aligns text to the right."
                    },
                    {
                              "id": "D",
                              "text": "f\"{'TEST':c10}\"",
                              "explanationIfWrong": "The caret symbol ^ designates centering."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The caret character ^ specifies centered alignment within the target field width."
},
        "retestMcq": {
          "id": "q-4.5-2-v2",
          "question": "What is the total length of the resulting string from f\"{'Hi':>5}\"?",
          "options": [
                    {
                              "id": "A",
                              "text": "5 characters (3 spaces followed by 'Hi')",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "7 characters",
                              "explanationIfWrong": "5 specifies the total field width, not the padding count."
                    },
                    {
                              "id": "C",
                              "text": "2 characters",
                              "explanationIfWrong": "The field is padded to width 5."
                    },
                    {
                              "id": "D",
                              "text": "3 characters",
                              "explanationIfWrong": "Total width is 5."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Field width 5 reserves 5 spaces; right-aligning 'Hi' pads it with 3 leading spaces."
},
        "questionPool": [
          {
            "id": "q-4.5-2-v1",
            "question": "Which alignment specifier centers the text 'TEST' within a width of 10 characters?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "f\"{'TEST':^10}\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "f\"{'TEST':<10}\"",
                                    "explanationIfWrong": "< aligns text to the left."
                        },
                        {
                                    "id": "C",
                                    "text": "f\"{'TEST':>10}\"",
                                    "explanationIfWrong": "> aligns text to the right."
                        },
                        {
                                    "id": "D",
                                    "text": "f\"{'TEST':c10}\"",
                                    "explanationIfWrong": "The caret symbol ^ designates centering."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The caret character ^ specifies centered alignment within the target field width."
},
          {
            "id": "q-4.5-2-v2",
            "question": "What is the total length of the resulting string from f\"{'Hi':>5}\"?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "5 characters (3 spaces followed by 'Hi')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "7 characters",
                                    "explanationIfWrong": "5 specifies the total field width, not the padding count."
                        },
                        {
                                    "id": "C",
                                    "text": "2 characters",
                                    "explanationIfWrong": "The field is padded to width 5."
                        },
                        {
                                    "id": "D",
                                    "text": "3 characters",
                                    "explanationIfWrong": "Total width is 5."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Field width 5 reserves 5 spaces; right-aligning 'Hi' pads it with 3 leading spaces."
},
          {
            "id": "q-4.5-2-v3",
            "question": "How can you specify a custom fill character other than space, such as filling with asterisks *?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Place the character before the alignment symbol, e.g. f\"{'Title':*^20}\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "f\"{'Title':^20*fill}\"",
                                    "explanationIfWrong": "The fill character must precede the alignment operator."
                        },
                        {
                                    "id": "C",
                                    "text": "f\"{'Title':fill('*')}\"",
                                    "explanationIfWrong": "Standard format syntax uses fill char + alignment + width."
                        },
                        {
                                    "id": "D",
                                    "text": "Custom fill characters are not supported in f-strings",
                                    "explanationIfWrong": "Custom fill characters are fully supported."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Syntax :*^20 uses * as the fill character, ^ for centering, and 20 for total width."
}
        ]
      },
      {
        "heading": "Padding Numbers with Leading Zeros",
        "text": "When formatting serial numbers, dates, times, or invoice IDs, you often need numbers padded with leading zeros. Using the format specifier :0Nd pads the integer with zeros until it reaches N characters wide.",
        "codeSnippet": "hour = 9\nminute = 5\nid_num = 42\nprint(f\"Time: {hour:02d}:{minute:02d}\")\nprint(f\"Invoice #{id_num:06d}\")",
        "terminalOutput": "Time: 09:05\nInvoice #000042",
        "mcq": {
          "id": "q-4.5-3-v1",
          "question": "What is printed by print(f\"{7:03d}\")?",
          "options": [
                    {
                              "id": "A",
                              "text": "007",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "700",
                              "explanationIfWrong": "The zero padding appears on the left."
                    },
                    {
                              "id": "C",
                              "text": "07",
                              "explanationIfWrong": "Width 3 pads to 3 total digits: '007'."
                    },
                    {
                              "id": "D",
                              "text": "7",
                              "explanationIfWrong": "03d pads with leading zeros up to width 3."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Specifier :03d pads the integer 7 to a width of 3 with leading zeros, giving '007'."
},
        "retestMcq": {
          "id": "q-4.5-3-v2",
          "question": "What happens if the number already has more digits than the width in :02d (e.g. f\"{1234:02d}\")?",
          "options": [
                    {
                              "id": "A",
                              "text": "It prints '1234' without truncation",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It truncates the number to '12'",
                              "explanationIfWrong": "Python format specifiers never truncate numbers."
                    },
                    {
                              "id": "C",
                              "text": "It raises an OverflowError",
                              "explanationIfWrong": "Field width is a minimum; larger numbers print fully."
                    },
                    {
                              "id": "D",
                              "text": "It prints '00'",
                              "explanationIfWrong": "The full value is preserved."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Width specifiers define a minimum width. Numbers exceeding that width are never truncated."
},
        "questionPool": [
          {
            "id": "q-4.5-3-v1",
            "question": "What is printed by print(f\"{7:03d}\")?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "007",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "700",
                                    "explanationIfWrong": "The zero padding appears on the left."
                        },
                        {
                                    "id": "C",
                                    "text": "07",
                                    "explanationIfWrong": "Width 3 pads to 3 total digits: '007'."
                        },
                        {
                                    "id": "D",
                                    "text": "7",
                                    "explanationIfWrong": "03d pads with leading zeros up to width 3."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Specifier :03d pads the integer 7 to a width of 3 with leading zeros, giving '007'."
},
          {
            "id": "q-4.5-3-v2",
            "question": "What happens if the number already has more digits than the width in :02d (e.g. f\"{1234:02d}\")?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It prints '1234' without truncation",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It truncates the number to '12'",
                                    "explanationIfWrong": "Python format specifiers never truncate numbers."
                        },
                        {
                                    "id": "C",
                                    "text": "It raises an OverflowError",
                                    "explanationIfWrong": "Field width is a minimum; larger numbers print fully."
                        },
                        {
                                    "id": "D",
                                    "text": "It prints '00'",
                                    "explanationIfWrong": "The full value is preserved."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Width specifiers define a minimum width. Numbers exceeding that width are never truncated."
},
          {
            "id": "q-4.5-3-v3",
            "question": "How do you format a digital clock display for hours and minutes (e.g. 8 hours, 4 minutes -> '08:04')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "f\"{h:02d}:{m:02d}\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "f\"{h:2}:{m:2}\"",
                                    "explanationIfWrong": "Without 0, this pads with spaces, producing ' 8: 4'."
                        },
                        {
                                    "id": "C",
                                    "text": "f\"{h}.{m}\"",
                                    "explanationIfWrong": "This does not apply two-digit zero padding."
                        },
                        {
                                    "id": "D",
                                    "text": "f\"{h:pad2}:{m:pad2}\"",
                                    "explanationIfWrong": ":02d is the correct Python format specification."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ":02d ensures both hour and minute are formatted as two digits with leading zeros."
}
        ]
      },
      {
        "heading": "Thousands Separators with Commas",
        "text": "For readable financial and scientific data, Python allows formatting large numbers with thousands separators by placing a comma : , inside the format specifier.",
        "codeSnippet": "population = 5540720\nbudget = 12500000.75\nprint(f\"Population: {population:,}\")\nprint(f\"Budget: ${budget:,.2f}\")",
        "terminalOutput": "Population: 5,540,720\nBudget: $12,500,000.75",
        "tip": "You can combine comma separators with decimal precision using :,.2f.",
        "mcq": {
          "id": "q-4.5-4-v1",
          "question": "What is the output of print(f\"{1000000:,}\")?",
          "options": [
                    {
                              "id": "A",
                              "text": "1,000,000",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "1000000",
                              "explanationIfWrong": "The comma specifier inserts thousands separators."
                    },
                    {
                              "id": "C",
                              "text": "1.000.000",
                              "explanationIfWrong": "The standard comma specifier uses commas, not dots."
                    },
                    {
                              "id": "D",
                              "text": "1_000_000",
                              "explanationIfWrong": "To get underscores, use :_ instead of :,."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The format specifier :, inserts commas at every three orders of magnitude: '1,000,000'."
},
        "retestMcq": {
          "id": "q-4.5-4-v2",
          "question": "How do you format 12500.5 as currency with a dollar sign, commas, and exactly 2 decimal places?",
          "options": [
                    {
                              "id": "A",
                              "text": "f\"${val:,.2f}\"",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "f\"{val:$,.2f}\"",
                              "explanationIfWrong": "The dollar sign is placed outside the braces as a literal."
                    },
                    {
                              "id": "C",
                              "text": "f\"${val:comma_2}\"",
                              "explanationIfWrong": ":,.2f is standard format syntax."
                    },
                    {
                              "id": "D",
                              "text": "f\"${round(val, 2)}\"",
                              "explanationIfWrong": "round() does not insert commas or trailing zeros."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "f\"${val:,.2f}\" produces '$12,500.50'."
},
        "questionPool": [
          {
            "id": "q-4.5-4-v1",
            "question": "What is the output of print(f\"{1000000:,}\")?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "1,000,000",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1000000",
                                    "explanationIfWrong": "The comma specifier inserts thousands separators."
                        },
                        {
                                    "id": "C",
                                    "text": "1.000.000",
                                    "explanationIfWrong": "The standard comma specifier uses commas, not dots."
                        },
                        {
                                    "id": "D",
                                    "text": "1_000_000",
                                    "explanationIfWrong": "To get underscores, use :_ instead of :,."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The format specifier :, inserts commas at every three orders of magnitude: '1,000,000'."
},
          {
            "id": "q-4.5-4-v2",
            "question": "How do you format 12500.5 as currency with a dollar sign, commas, and exactly 2 decimal places?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "f\"${val:,.2f}\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "f\"{val:$,.2f}\"",
                                    "explanationIfWrong": "The dollar sign is placed outside the braces as a literal."
                        },
                        {
                                    "id": "C",
                                    "text": "f\"${val:comma_2}\"",
                                    "explanationIfWrong": ":,.2f is standard format syntax."
                        },
                        {
                                    "id": "D",
                                    "text": "f\"${round(val, 2)}\"",
                                    "explanationIfWrong": "round() does not insert commas or trailing zeros."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "f\"${val:,.2f}\" produces '$12,500.50'."
},
          {
            "id": "q-4.5-4-v3",
            "question": "What separator does Python use if you write f\"{1000000:_}\"?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Underscores: 1_000_000",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Spaces: 1 000 000",
                                    "explanationIfWrong": "The :_ specifier uses underscores."
                        },
                        {
                                    "id": "C",
                                    "text": "Raises a ValueError",
                                    "explanationIfWrong": ":_ is valid standard Python format syntax."
                        },
                        {
                                    "id": "D",
                                    "text": "Dashes: 1-000-000",
                                    "explanationIfWrong": "It produces underscores."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ":_ formats thousands separators with underscores, matching Python's numeric literal syntax."
}
        ]
      },
      {
        "heading": "Formatting Tables & Clean Reports",
        "text": "By combining loops, fixed column widths, and alignment specifiers, you can format clean ASCII data tables in terminal output.",
        "codeSnippet": "data = [(\"Alice\", 95), (\"Bob\", 82), (\"Charlie\", 67)]\n\n# Header\nprint(f\"{'Name':<10} {'Score':>5}\")\nprint(\"-\" * 16)\n\n# Rows\nfor name, score in data:\n    print(f\"{name:<10} {score:>5}\")",
        "terminalOutput": "Name       Score\n----------------\nAlice         95\nBob           82\nCharlie       67",
        "mcq": {
          "id": "q-4.5-5-v1",
          "question": "Why is print(f\"{name:<10} {score:>5}\") ideal for printing tabular columns?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because every name occupies exactly 10 characters and every score occupies 5, keeping columns aligned vertically",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because it automatically creates an Excel spreadsheet file",
                              "explanationIfWrong": "It prints formatted text to the console, not an Excel file."
                    },
                    {
                              "id": "C",
                              "text": "Because tab characters \\t are prohibited in Python",
                              "explanationIfWrong": "\\t is valid, but tab stops vary across terminal configurations."
                    },
                    {
                              "id": "D",
                              "text": "Because it sorts the rows alphabetically",
                              "explanationIfWrong": "Formatting controls display width, not sorting."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Explicit field widths ensure that data columns align into crisp vertical grids regardless of individual word lengths."
},
        "retestMcq": {
          "id": "q-4.5-5-v2",
          "question": "What is a disadvantage of relying solely on tab characters ('\\t') for column alignment?",
          "options": [
                    {
                              "id": "A",
                              "text": "Different terminals configure tab stop widths differently, and long strings cause adjacent columns to misalign",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "\\t raises a SyntaxError in Python 3",
                              "explanationIfWrong": "\\t is standard escape sequence syntax."
                    },
                    {
                              "id": "C",
                              "text": "\\t only works on Windows",
                              "explanationIfWrong": "\\t works across all platforms."
                    },
                    {
                              "id": "D",
                              "text": "\\t deletes previous characters",
                              "explanationIfWrong": "\\t is a horizontal tab."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Fixed-width f-string specifiers provide consistent alignment across all terminals, unlike variable tab stops."
},
        "questionPool": [
          {
            "id": "q-4.5-5-v1",
            "question": "Why is print(f\"{name:<10} {score:>5}\") ideal for printing tabular columns?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because every name occupies exactly 10 characters and every score occupies 5, keeping columns aligned vertically",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because it automatically creates an Excel spreadsheet file",
                                    "explanationIfWrong": "It prints formatted text to the console, not an Excel file."
                        },
                        {
                                    "id": "C",
                                    "text": "Because tab characters \\t are prohibited in Python",
                                    "explanationIfWrong": "\\t is valid, but tab stops vary across terminal configurations."
                        },
                        {
                                    "id": "D",
                                    "text": "Because it sorts the rows alphabetically",
                                    "explanationIfWrong": "Formatting controls display width, not sorting."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Explicit field widths ensure that data columns align into crisp vertical grids regardless of individual word lengths."
},
          {
            "id": "q-4.5-5-v2",
            "question": "What is a disadvantage of relying solely on tab characters ('\\t') for column alignment?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Different terminals configure tab stop widths differently, and long strings cause adjacent columns to misalign",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "\\t raises a SyntaxError in Python 3",
                                    "explanationIfWrong": "\\t is standard escape sequence syntax."
                        },
                        {
                                    "id": "C",
                                    "text": "\\t only works on Windows",
                                    "explanationIfWrong": "\\t works across all platforms."
                        },
                        {
                                    "id": "D",
                                    "text": "\\t deletes previous characters",
                                    "explanationIfWrong": "\\t is a horizontal tab."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Fixed-width f-string specifiers provide consistent alignment across all terminals, unlike variable tab stops."
},
          {
            "id": "q-4.5-5-v3",
            "question": "How do you create a separator line of 20 dashes '-' in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'-' * 20",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'-' + 20",
                                    "explanationIfWrong": "You cannot add a string and an integer."
                        },
                        {
                                    "id": "C",
                                    "text": "repeat('-', 20)",
                                    "explanationIfWrong": "Python uses string multiplication * for repetition."
                        },
                        {
                                    "id": "D",
                                    "text": "['-'] * 20",
                                    "explanationIfWrong": "This creates a list of 20 strings rather than a single string."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "String multiplication '-' * 20 creates a single string composed of 20 consecutive dashes."
}
        ]
      }
    ]
  },
  {
    "id": "4-6-strings-and-lists",
    "number": "4.6",
    "title": "Working with Strings and Lists Together",
    "subtitle": "Convert between strings and lists using split() and join(), mutate lists in functions, and master sorting.",
    "readTime": "25 min",
    "objectives": [
      "Split strings into lists of words using .split() and custom delimiters",
      "Join lists of strings into a single string using .join()",
      "Pass lists into functions and observe in-place mutations",
      "Differentiate between shallow copies and shared list references",
      "Sort lists in-place with .sort() vs returning a new sorted list with sorted()",
      "Build complete string-parsing and data-processing pipelines"
],
    "theoryBlocks": [
      {
        "heading": "Splitting Strings with .split()",
        "text": "The .split() method splits a string into a list of substrings. Called without arguments, .split() separates by any whitespace (spaces, tabs, newlines) and discards consecutive whitespace. You can also pass an explicit delimiter, e.g. .split(',').",
        "codeSnippet": "sentence = \"Python is   fun to  learn\"\nwords = sentence.split()\nprint(words)\n\ncsv_data = \"apple,banana,cherry\"\nitems = csv_data.split(\",\")\nprint(items)",
        "terminalOutput": "['Python', 'is', 'fun', 'to', 'learn']\n['apple', 'banana', 'cherry']",
        "mcq": {
          "id": "q-4.6-0-v1",
          "question": "What is the result of 'one two  three'.split()?",
          "options": [
                    {
                              "id": "A",
                              "text": "['one', 'two', 'three']",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "['one', 'two', '', 'three']",
                              "explanationIfWrong": "Default split() groups consecutive whitespace together."
                    },
                    {
                              "id": "C",
                              "text": "('one', 'two', 'three')",
                              "explanationIfWrong": ".split() returns a list, not a tuple."
                    },
                    {
                              "id": "D",
                              "text": "'one, two, three'",
                              "explanationIfWrong": ".split() returns a list of strings."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without arguments, .split() treats runs of whitespace as single delimiters and strips empty entries."
},
        "retestMcq": {
          "id": "q-4.6-0-v2",
          "question": "What is returned by '2026-10-15'.split('-')?",
          "options": [
                    {
                              "id": "A",
                              "text": "['2026', '10', '15']",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[2026, 10, 15]",
                              "explanationIfWrong": ".split() produces a list of strings, not integers."
                    },
                    {
                              "id": "C",
                              "text": "'2026 10 15'",
                              "explanationIfWrong": ".split() returns a list."
                    },
                    {
                              "id": "D",
                              "text": "['2026-10-15']",
                              "explanationIfWrong": "It splits wherever the delimiter '-' appears."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Splitting on '-' divides the string into three string segments: ['2026', '10', '15']."
},
        "questionPool": [
          {
            "id": "q-4.6-0-v1",
            "question": "What is the result of 'one two  three'.split()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "['one', 'two', 'three']",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "['one', 'two', '', 'three']",
                                    "explanationIfWrong": "Default split() groups consecutive whitespace together."
                        },
                        {
                                    "id": "C",
                                    "text": "('one', 'two', 'three')",
                                    "explanationIfWrong": ".split() returns a list, not a tuple."
                        },
                        {
                                    "id": "D",
                                    "text": "'one, two, three'",
                                    "explanationIfWrong": ".split() returns a list of strings."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without arguments, .split() treats runs of whitespace as single delimiters and strips empty entries."
},
          {
            "id": "q-4.6-0-v2",
            "question": "What is returned by '2026-10-15'.split('-')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "['2026', '10', '15']",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[2026, 10, 15]",
                                    "explanationIfWrong": ".split() produces a list of strings, not integers."
                        },
                        {
                                    "id": "C",
                                    "text": "'2026 10 15'",
                                    "explanationIfWrong": ".split() returns a list."
                        },
                        {
                                    "id": "D",
                                    "text": "['2026-10-15']",
                                    "explanationIfWrong": "It splits wherever the delimiter '-' appears."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Splitting on '-' divides the string into three string segments: ['2026', '10', '15']."
},
          {
            "id": "q-4.6-0-v3",
            "question": "What does 'hello'.split('z') produce if 'z' is not in the string?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "['hello']",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[]",
                                    "explanationIfWrong": "If the delimiter is not found, the entire string is returned as the sole element."
                        },
                        {
                                    "id": "C",
                                    "text": "ValueError",
                                    "explanationIfWrong": ".split() does not raise an exception if delimiter is missing."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": ".split() always returns a list of strings."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "If the delimiter does not occur in the string, split returns a single-item list containing the whole string."
}
        ]
      },
      {
        "heading": "Joining Lists with .join()",
        "text": "The .join() method joins a list of strings into a single string, using the string on which it is called as the separator between elements. Crucially, .join() is called on the separator string: separator.join(list_of_strings).",
        "codeSnippet": "words = [\"Python\", \"is\", \"awesome\"]\nsentence = \" \".join(words)\ncsv_line = \", \".join(words)\nprint(sentence)\nprint(csv_line)",
        "terminalOutput": "Python is awesome\nPython, is, awesome",
        "warning": "All elements in the list must be strings. If the list contains numbers, you must convert them first: ', '.join(str(x) for x in numbers). Otherwise, a TypeError is raised.",
        "mcq": {
          "id": "q-4.6-1-v1",
          "question": "What is the output of '-'.join(['a', 'b', 'c'])?",
          "options": [
                    {
                              "id": "A",
                              "text": "'a-b-c'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'-a-b-c-'",
                              "explanationIfWrong": ".join() places the separator between elements only, not at start or end."
                    },
                    {
                              "id": "C",
                              "text": "['a-b-c']",
                              "explanationIfWrong": ".join() returns a single string."
                    },
                    {
                              "id": "D",
                              "text": "'abc'",
                              "explanationIfWrong": "The separator '-' is placed between each item."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The separator '-' is inserted strictly between each pair of adjacent elements: 'a-b-c'."
},
        "retestMcq": {
          "id": "q-4.6-1-v2",
          "question": "What error occurs if you run ', '.join([1, 2, 3])?",
          "options": [
                    {
                              "id": "A",
                              "text": "TypeError: sequence item 0: expected str instance, int found",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "ValueError: cannot join numbers",
                              "explanationIfWrong": "Type mismatches in Python raise TypeError."
                    },
                    {
                              "id": "C",
                              "text": "It converts them to strings automatically and prints '1, 2, 3'",
                              "explanationIfWrong": "Python does not automatically convert list items to strings in join()."
                    },
                    {
                              "id": "D",
                              "text": "SyntaxError",
                              "explanationIfWrong": "This is a runtime TypeError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "join() requires every item in the iterable to be of type str. Numbers must be converted with str()."
},
        "questionPool": [
          {
            "id": "q-4.6-1-v1",
            "question": "What is the output of '-'.join(['a', 'b', 'c'])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'a-b-c'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'-a-b-c-'",
                                    "explanationIfWrong": ".join() places the separator between elements only, not at start or end."
                        },
                        {
                                    "id": "C",
                                    "text": "['a-b-c']",
                                    "explanationIfWrong": ".join() returns a single string."
                        },
                        {
                                    "id": "D",
                                    "text": "'abc'",
                                    "explanationIfWrong": "The separator '-' is placed between each item."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The separator '-' is inserted strictly between each pair of adjacent elements: 'a-b-c'."
},
          {
            "id": "q-4.6-1-v2",
            "question": "What error occurs if you run ', '.join([1, 2, 3])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: sequence item 0: expected str instance, int found",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ValueError: cannot join numbers",
                                    "explanationIfWrong": "Type mismatches in Python raise TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "It converts them to strings automatically and prints '1, 2, 3'",
                                    "explanationIfWrong": "Python does not automatically convert list items to strings in join()."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "This is a runtime TypeError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "join() requires every item in the iterable to be of type str. Numbers must be converted with str()."
},
          {
            "id": "q-4.6-1-v3",
            "question": "How do you combine a list of characters ['P', 'y', 't', 'h', 'o', 'n'] into a single word without spaces?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "''.join(chars)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "' '.join(chars)",
                                    "explanationIfWrong": "' ' places a space between every letter."
                        },
                        {
                                    "id": "C",
                                    "text": "str(chars)",
                                    "explanationIfWrong": "str(chars) produces the literal representation \"['P', 'y', ...]\"."
                        },
                        {
                                    "id": "D",
                                    "text": "chars.join()",
                                    "explanationIfWrong": "join() is a string method, not a list method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Using an empty string '' as separator concatenates the elements directly without spaces."
}
        ]
      },
      {
        "heading": "Lists as Function Arguments & Mutation",
        "text": "In Python, arguments are passed by object reference. When you pass a list into a function, the function receives a reference to the same list object in memory. Modifying the list inside the function (e.g. append or pop) mutates the caller's original list.",
        "codeSnippet": "def add_tax(prices):\n    for i in range(len(prices)):\n        prices[i] *= 1.1\n\nitems = [100.0, 50.0]\nadd_tax(items)\nprint(items)  # Caller's list was modified in-place!",
        "terminalOutput": "[110.00000000000001, 55.0]",
        "tip": "If a function should not modify the original list, pass a shallow copy items[:] or make a copy inside the function with prices = prices.copy().",
        "mcq": {
          "id": "q-4.6-2-v1",
          "question": "What is printed by this code?\n\ndef modify(lst):\n    lst.append(99)\n\nnums = [1, 2]\nmodify(nums)\nprint(nums)",
          "options": [
                    {
                              "id": "A",
                              "text": "[1, 2, 99]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[1, 2]",
                              "explanationIfWrong": "Lists are mutable and passed by reference; modify() affects nums."
                    },
                    {
                              "id": "C",
                              "text": "None",
                              "explanationIfWrong": "nums is a list; it is not None."
                    },
                    {
                              "id": "D",
                              "text": "[99]",
                              "explanationIfWrong": "append adds to the existing elements."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because lists are mutable objects, operations like append() modify the caller's list directly."
},
        "retestMcq": {
          "id": "q-4.6-2-v2",
          "question": "What is printed by this code?\n\ndef reassign(lst):\n    lst = [99]\n\nnums = [1, 2]\nreassign(nums)\nprint(nums)",
          "options": [
                    {
                              "id": "A",
                              "text": "[1, 2]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[99]",
                              "explanationIfWrong": "Reassigning the parameter variable lst = [99] only changes the local variable reference."
                    },
                    {
                              "id": "C",
                              "text": "[1, 2, 99]",
                              "explanationIfWrong": "No appending occurred."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "nums retains its original values."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Reassigning lst = [99] re-binds the local name lst to a new list, leaving the caller's nums untouched."
},
        "questionPool": [
          {
            "id": "q-4.6-2-v1",
            "question": "What is printed by this code?\n\ndef modify(lst):\n    lst.append(99)\n\nnums = [1, 2]\nmodify(nums)\nprint(nums)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[1, 2, 99]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[1, 2]",
                                    "explanationIfWrong": "Lists are mutable and passed by reference; modify() affects nums."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "nums is a list; it is not None."
                        },
                        {
                                    "id": "D",
                                    "text": "[99]",
                                    "explanationIfWrong": "append adds to the existing elements."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because lists are mutable objects, operations like append() modify the caller's list directly."
},
          {
            "id": "q-4.6-2-v2",
            "question": "What is printed by this code?\n\ndef reassign(lst):\n    lst = [99]\n\nnums = [1, 2]\nreassign(nums)\nprint(nums)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[1, 2]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[99]",
                                    "explanationIfWrong": "Reassigning the parameter variable lst = [99] only changes the local variable reference."
                        },
                        {
                                    "id": "C",
                                    "text": "[1, 2, 99]",
                                    "explanationIfWrong": "No appending occurred."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "nums retains its original values."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Reassigning lst = [99] re-binds the local name lst to a new list, leaving the caller's nums untouched."
},
          {
            "id": "q-4.6-2-v3",
            "question": "How can a caller protect their list numbers from being modified by a function process(numbers)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Pass a copy of the list: process(numbers.copy()) or process(numbers[:])",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Pass process(tuple(numbers)) and convert back",
                                    "explanationIfWrong": "Passing a copy is the standard direct solution."
                        },
                        {
                                    "id": "C",
                                    "text": "Prefix the variable with const: process(const numbers)",
                                    "explanationIfWrong": "Python does not have a const keyword."
                        },
                        {
                                    "id": "D",
                                    "text": "Python automatically protects lists from mutation",
                                    "explanationIfWrong": "Python passes mutable references by default."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing a copy ensures the function works on its own independent instance, protecting the original."
}
        ]
      },
      {
        "heading": "List References vs. Copies",
        "text": "Writing b = a does NOT copy a list; it merely creates a second variable pointing to the same list in memory. To create an independent copy, use the .copy() method, the slice operator a[:], or the list() constructor.",
        "codeSnippet": "a = [1, 2, 3]\nb = a           # Same reference!\nc = a.copy()    # Independent copy\n\na.append(4)\nprint(f\"a: {a}\")\nprint(f\"b: {b} (shared!)\")\nprint(f\"c: {c} (independent!)\")",
        "terminalOutput": "a: [1, 2, 3, 4]\nb: [1, 2, 3, 4] (shared!)\nc: [1, 2, 3] (independent!)",
        "mcq": {
          "id": "q-4.6-3-v1",
          "question": "What is printed by:\n\nx = [10, 20]\ny = x\ny.append(30)\nprint(x)",
          "options": [
                    {
                              "id": "A",
                              "text": "[10, 20, 30]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[10, 20]",
                              "explanationIfWrong": "y = x makes both variables refer to the exact same list."
                    },
                    {
                              "id": "C",
                              "text": "[30]",
                              "explanationIfWrong": "append adds 30 to [10, 20]."
                    },
                    {
                              "id": "D",
                              "text": "TypeError",
                              "explanationIfWrong": "Assignment creates a shared reference without error."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "y = x does not create a new list. Both x and y point to the same object, so mutating y mutates x."
},
        "retestMcq": {
          "id": "q-4.6-3-v2",
          "question": "Which operator checks whether two variables refer to the exact same memory object (identity) rather than equal values?",
          "options": [
                    {
                              "id": "A",
                              "text": "is",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "==",
                              "explanationIfWrong": "== checks value equality; is checks object identity."
                    },
                    {
                              "id": "C",
                              "text": "equals",
                              "explanationIfWrong": "Python uses the is keyword."
                    },
                    {
                              "id": "D",
                              "text": "in",
                              "explanationIfWrong": "in checks sequence membership."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "a is b checks if both variables point to the same memory address (id(a) == id(b))."
},
        "questionPool": [
          {
            "id": "q-4.6-3-v1",
            "question": "What is printed by:\n\nx = [10, 20]\ny = x\ny.append(30)\nprint(x)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[10, 20, 30]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[10, 20]",
                                    "explanationIfWrong": "y = x makes both variables refer to the exact same list."
                        },
                        {
                                    "id": "C",
                                    "text": "[30]",
                                    "explanationIfWrong": "append adds 30 to [10, 20]."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Assignment creates a shared reference without error."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "y = x does not create a new list. Both x and y point to the same object, so mutating y mutates x."
},
          {
            "id": "q-4.6-3-v2",
            "question": "Which operator checks whether two variables refer to the exact same memory object (identity) rather than equal values?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "is",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "==",
                                    "explanationIfWrong": "== checks value equality; is checks object identity."
                        },
                        {
                                    "id": "C",
                                    "text": "equals",
                                    "explanationIfWrong": "Python uses the is keyword."
                        },
                        {
                                    "id": "D",
                                    "text": "in",
                                    "explanationIfWrong": "in checks sequence membership."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "a is b checks if both variables point to the same memory address (id(a) == id(b))."
},
          {
            "id": "q-4.6-3-v3",
            "question": "If a = [1, 2] and b = [1, 2], what do a == b and a is b evaluate to?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "a == b is True, but a is b is False",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Both are True",
                                    "explanationIfWrong": "They are distinct list objects in memory, so a is b is False."
                        },
                        {
                                    "id": "C",
                                    "text": "Both are False",
                                    "explanationIfWrong": "They contain the exact same values, so a == b is True."
                        },
                        {
                                    "id": "D",
                                    "text": "a == b is False, but a is b is True",
                                    "explanationIfWrong": "Their values are equal."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "They have identical contents (== is True), but reside at separate memory locations (is is False)."
}
        ]
      },
      {
        "heading": "Sorting: .sort() vs. sorted()",
        "text": "The .sort() method sorts a list in-place and returns None. The built-in sorted(iterable) function returns a new sorted list without modifying the original. Both support reverse=True for descending order.",
        "codeSnippet": "nums = [5, 2, 8, 1]\n\n# Using sorted() -> returns new list:\nnew_nums = sorted(nums)\nprint(f\"Original: {nums}, Sorted: {new_nums}\")\n\n# Using .sort() -> modifies in-place:\nnums.sort(reverse=True)\nprint(f\"In-place reversed: {nums}\")",
        "terminalOutput": "Original: [5, 2, 8, 1], Sorted: [1, 2, 5, 8]\nIn-place reversed: [8, 5, 2, 1]",
        "mcq": {
          "id": "q-4.6-4-v1",
          "question": "What is the key difference between list.sort() and sorted(list)?",
          "options": [
                    {
                              "id": "A",
                              "text": "list.sort() modifies the list in place and returns None, while sorted() leaves the original unchanged and returns a new sorted list",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "list.sort() only works on numbers, while sorted() only works on strings",
                              "explanationIfWrong": "Both work on any comparable sequence."
                    },
                    {
                              "id": "C",
                              "text": "sorted() is deprecated in Python 3",
                              "explanationIfWrong": "Both are standard built-in features."
                    },
                    {
                              "id": "D",
                              "text": "list.sort() sorts descending by default",
                              "explanationIfWrong": "Both default to ascending order."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Method .sort() mutates the list object directly; built-in sorted() builds and returns a fresh list."
},
        "retestMcq": {
          "id": "q-4.6-4-v2",
          "question": "What will be printed by nums = [3, 1, 2]; nums = nums.sort(); print(nums)?",
          "options": [
                    {
                              "id": "A",
                              "text": "None",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[1, 2, 3]",
                              "explanationIfWrong": "nums.sort() returns None, so assigning to nums overwrites the list with None."
                    },
                    {
                              "id": "C",
                              "text": "[3, 2, 1]",
                              "explanationIfWrong": "nums.sort() returns None."
                    },
                    {
                              "id": "D",
                              "text": "Error",
                              "explanationIfWrong": "It executes cleanly and prints None."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because .sort() mutates in-place and returns None, reassigning nums = nums.sort() results in nums being None."
},
        "questionPool": [
          {
            "id": "q-4.6-4-v1",
            "question": "What is the key difference between list.sort() and sorted(list)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "list.sort() modifies the list in place and returns None, while sorted() leaves the original unchanged and returns a new sorted list",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "list.sort() only works on numbers, while sorted() only works on strings",
                                    "explanationIfWrong": "Both work on any comparable sequence."
                        },
                        {
                                    "id": "C",
                                    "text": "sorted() is deprecated in Python 3",
                                    "explanationIfWrong": "Both are standard built-in features."
                        },
                        {
                                    "id": "D",
                                    "text": "list.sort() sorts descending by default",
                                    "explanationIfWrong": "Both default to ascending order."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Method .sort() mutates the list object directly; built-in sorted() builds and returns a fresh list."
},
          {
            "id": "q-4.6-4-v2",
            "question": "What will be printed by nums = [3, 1, 2]; nums = nums.sort(); print(nums)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "None",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[1, 2, 3]",
                                    "explanationIfWrong": "nums.sort() returns None, so assigning to nums overwrites the list with None."
                        },
                        {
                                    "id": "C",
                                    "text": "[3, 2, 1]",
                                    "explanationIfWrong": "nums.sort() returns None."
                        },
                        {
                                    "id": "D",
                                    "text": "Error",
                                    "explanationIfWrong": "It executes cleanly and prints None."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because .sort() mutates in-place and returns None, reassigning nums = nums.sort() results in nums being None."
},
          {
            "id": "q-4.6-4-v3",
            "question": "How do you sort words = ['banana', 'apple', 'cherry'] alphabetically in reverse (Z to A)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "sorted(words, reverse=True) or words.sort(reverse=True)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "words.reverse_sort()",
                                    "explanationIfWrong": "There is no reverse_sort() method."
                        },
                        {
                                    "id": "C",
                                    "text": "words.sort(-1)",
                                    "explanationIfWrong": "The keyword argument is reverse=True."
                        },
                        {
                                    "id": "D",
                                    "text": "desc(words)",
                                    "explanationIfWrong": "Python uses reverse=True."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing reverse=True to sort() or sorted() orders elements in descending order."
}
        ]
      },
      {
        "heading": "Text Parsing & Data Pipelines",
        "text": "By chaining string methods and list functions, you can build powerful data processing pipelines: reading lines, stripping whitespace with .strip(), splitting fields with .split(), and filtering or converting items.",
        "codeSnippet": "raw_scores = \" 88, 92, 75, 100 \"\n# Clean, split, convert to integers:\nclean_scores = [int(s.strip()) for s in raw_scores.split(\",\")]\nprint(f\"Scores: {clean_scores}\")\nprint(f\"Average: {sum(clean_scores) / len(clean_scores):.1f}\")",
        "terminalOutput": "Scores: [88, 92, 75, 100]\nAverage: 88.8",
        "mcq": {
          "id": "q-4.6-5-v1",
          "question": "What does '  hello  \\n'.strip() return?",
          "options": [
                    {
                              "id": "A",
                              "text": "'hello'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'hello  \\n'",
                              "explanationIfWrong": ".strip() removes whitespace from both ends."
                    },
                    {
                              "id": "C",
                              "text": "'  hello'",
                              "explanationIfWrong": ".strip() cleans both leading and trailing whitespace."
                    },
                    {
                              "id": "D",
                              "text": "['hello']",
                              "explanationIfWrong": ".strip() returns a string, not a list."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "str.strip() removes all leading and trailing whitespace characters, including spaces and newlines."
},
        "retestMcq": {
          "id": "q-4.6-5-v2",
          "question": "Given line = 'Alice:25:Admin', which code extracts the age as an integer?",
          "options": [
                    {
                              "id": "A",
                              "text": "int(line.split(':')[1])",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "line.split(':')[1]",
                              "explanationIfWrong": "This leaves '25' as a string, not an integer."
                    },
                    {
                              "id": "C",
                              "text": "int(line[1])",
                              "explanationIfWrong": "line[1] is the character 'l', not the age."
                    },
                    {
                              "id": "D",
                              "text": "line.find(25)",
                              "explanationIfWrong": "find searches for substrings, returning an index."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "line.split(':') produces ['Alice', '25', 'Admin']. Index 1 is '25', converted with int() to 25."
},
        "questionPool": [
          {
            "id": "q-4.6-5-v1",
            "question": "What does '  hello  \\n'.strip() return?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'hello'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'hello  \\n'",
                                    "explanationIfWrong": ".strip() removes whitespace from both ends."
                        },
                        {
                                    "id": "C",
                                    "text": "'  hello'",
                                    "explanationIfWrong": ".strip() cleans both leading and trailing whitespace."
                        },
                        {
                                    "id": "D",
                                    "text": "['hello']",
                                    "explanationIfWrong": ".strip() returns a string, not a list."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "str.strip() removes all leading and trailing whitespace characters, including spaces and newlines."
},
          {
            "id": "q-4.6-5-v2",
            "question": "Given line = 'Alice:25:Admin', which code extracts the age as an integer?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "int(line.split(':')[1])",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "line.split(':')[1]",
                                    "explanationIfWrong": "This leaves '25' as a string, not an integer."
                        },
                        {
                                    "id": "C",
                                    "text": "int(line[1])",
                                    "explanationIfWrong": "line[1] is the character 'l', not the age."
                        },
                        {
                                    "id": "D",
                                    "text": "line.find(25)",
                                    "explanationIfWrong": "find searches for substrings, returning an index."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "line.split(':') produces ['Alice', '25', 'Admin']. Index 1 is '25', converted with int() to 25."
},
          {
            "id": "q-4.6-5-v3",
            "question": "What is the result of running text = 'apple banana cherry'; print(len(text.split()))?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "19",
                                    "explanationIfWrong": "len(text) is 19, but text.split() is a list of 3 words."
                        },
                        {
                                    "id": "C",
                                    "text": "2",
                                    "explanationIfWrong": "There are 3 words in the list."
                        },
                        {
                                    "id": "D",
                                    "text": "Error",
                                    "explanationIfWrong": "len() on a list returns the count of elements."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "text.split() yields ['apple', 'banana', 'cherry']. Its length is 3."
}
        ]
      }
    ]
  }
];


// Function to get active questions for a level
// Supports dynamic variant rotation (v1, v2, v3) without duplicate repeat
export const getActiveQuestionsForLevelPart4 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part4_question_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part4_active_questions_${section.id}_${studentId}`;

  let seenIds: string[] = [];
  try {
    const raw = localStorage.getItem(historyKey);
    if (raw) seenIds = JSON.parse(raw);
  } catch {}

  // If not forcing new questions and an active set is stored, use it
  if (!forceNewQuestions) {
    try {
      const activeRaw = localStorage.getItem(activeSetKey);
      if (activeRaw) {
        const saved = JSON.parse(activeRaw);
        if (Array.isArray(saved) && saved.length === section.theoryBlocks.length) {
          return saved;
        }
      }
    } catch {}
  }

  const selectedQuestions: McqQuestion[] = [];
  const newlySeenIds: string[] = [];

  section.theoryBlocks.forEach((block, bIdx) => {
    const pool: McqQuestion[] = block.questionPool && block.questionPool.length > 0
      ? block.questionPool
      : [
          { ...block.mcq!, id: `q-${section.id}-${bIdx}-v1` },
          { ...(block.retestMcq || block.mcq!), id: `q-${section.id}-${bIdx}-v2` }
        ];

    const unseen = pool.filter(q => q.id && !seenIds.includes(q.id));

    let chosenQuestion: McqQuestion;
    if (unseen.length > 0) {
      chosenQuestion = unseen[0];
    } else {
      chosenQuestion = pool[pool.length - 1];
    }

    selectedQuestions.push(chosenQuestion);
    if (chosenQuestion.id && !seenIds.includes(chosenQuestion.id)) {
      newlySeenIds.push(chosenQuestion.id);
    }
  });

  const updatedHistory = [...seenIds, ...newlySeenIds];
  try {
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    localStorage.setItem(activeSetKey, JSON.stringify(selectedQuestions));
  } catch {}

  return selectedQuestions;
};

// Consecutive failure tracking helpers for Part 4
export const getConsecutiveFailuresPart4 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part4_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart4 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part4_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart4 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part4_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart4 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part4_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart4 = (
  sectionId: string,
  studentId: string,
  isPassed: boolean
): {
  isPassed: boolean;
  attemptCount: number; // 1 or 2
  isSecondFailureInLevel: boolean;
  consecutiveFailedLevels: number; // 0, 1, 2, 3
  isLocked: boolean;
} => {
  const currentAttempt = getLevelAttemptCountPart4(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part4_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part4_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part4_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part4_locked_${studentId}`);
    } catch {}

    return {
      isPassed: true,
      attemptCount: currentAttempt,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    if (currentAttempt === 1) {
      setLevelAttemptCountPart4(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart4(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart4(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part4_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part4_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part4_locked_${studentId}`, 'true');
        }
      } catch {}

      return {
        isPassed: false,
        attemptCount: 2,
        isSecondFailureInLevel: true,
        consecutiveFailedLevels: newStreak,
        isLocked
      };
    }
  }
};

export const resetConsecutiveFailuresPart4 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part4_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part4_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part4_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part4_locked_progression_${studentId}`);
  } catch {}
};
