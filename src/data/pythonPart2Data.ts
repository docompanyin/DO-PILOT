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

export const PART_2_SECTIONS: SectionContent[] = [
  {
    "id": "2-1-terminology",
    "number": "2.1",
    "title": "Programming Terminology",
    "subtitle": "Master expressions, statements, parameters, arguments, return values, and types of errors.",
    "readTime": "20 min",
    "objectives": [
      "Distinguish between expressions (values) and statements (actions)",
      "Understand function parameters and arguments",
      "Learn how return values pass data back to code",
      "Recognize SyntaxErrors before execution starts",
      "Identify RuntimeErrors (exceptions) during execution",
      "Diagnose LogicErrors (bugs) that produce incorrect results"
    ],
    "theoryBlocks": [
      {
        "heading": "Expressions vs. Statements",
        "text": "An expression is any piece of code that evaluates to a specific value (e.g. 5 + 3 evaluates to 8, or age >= 18 evaluates to True). A statement is a complete instruction that commands Python to do something (e.g. variable assignment, print(), or if conditions). Statements are composed of expressions.",
        "codeSnippet": "# 10 + 20 is an expression (evaluates to 30)\n# total = 30 is an assignment statement\ntotal = 10 + 20\n\n# print(total) is a function call statement\nprint(total)",
        "terminalOutput": "30",
        "mcq": {
          "id": "q-2.1-0-v1",
          "question": "What is the fundamental difference between an expression and a statement in Python?",
          "options": [
            {
              "id": "A",
              "text": "An expression evaluates to a value, while a statement is an action or instruction",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "An expression must contain numbers, while a statement only contains words",
              "explanationIfWrong": "Expressions can contain strings, booleans, and variables, not just numbers."
            },
            {
              "id": "C",
              "text": "There is no difference; they are interchangeable terms",
              "explanationIfWrong": "Expressions produce values; statements execute commands."
            },
            {
              "id": "D",
              "text": "A statement always returns True or False",
              "explanationIfWrong": "Boolean expressions return True or False; statements do not evaluate to values."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "An expression produces a value, whereas a statement carries out an action in the program."
        },
        "retestMcq": {
          "id": "q-2.1-0-v2",
          "question": "Which of the following code snippets is an expression (evaluates to a value)?",
          "options": [
            {
              "id": "A",
              "text": "25 * 4",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "import math",
              "explanationIfWrong": "import is a statement that loads a module."
            },
            {
              "id": "C",
              "text": "if x > 10:",
              "explanationIfWrong": "if x > 10: is a conditional control statement header."
            },
            {
              "id": "D",
              "text": "x = 100",
              "explanationIfWrong": "x = 100 is an assignment statement."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "25 * 4 evaluates to 100, making it an expression."
        },
        "questionPool": [
          {
            "id": "q-2.1-0-v1",
            "question": "What is the fundamental difference between an expression and a statement in Python?",
            "options": [
              {
                "id": "A",
                "text": "An expression evaluates to a value, while a statement is an action or instruction",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "An expression must contain numbers, while a statement only contains words",
                "explanationIfWrong": "Expressions can contain strings, booleans, and variables, not just numbers."
              },
              {
                "id": "C",
                "text": "There is no difference; they are interchangeable terms",
                "explanationIfWrong": "Expressions produce values; statements execute commands."
              },
              {
                "id": "D",
                "text": "A statement always returns True or False",
                "explanationIfWrong": "Boolean expressions return True or False; statements do not evaluate to values."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An expression produces a value, whereas a statement carries out an action in the program."
          },
          {
            "id": "q-2.1-0-v2",
            "question": "Which of the following code snippets is an expression (evaluates to a value)?",
            "options": [
              {
                "id": "A",
                "text": "25 * 4",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "import math",
                "explanationIfWrong": "import is a statement that loads a module."
              },
              {
                "id": "C",
                "text": "if x > 10:",
                "explanationIfWrong": "if x > 10: is a conditional control statement header."
              },
              {
                "id": "D",
                "text": "x = 100",
                "explanationIfWrong": "x = 100 is an assignment statement."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "25 * 4 evaluates to 100, making it an expression."
          },
          {
            "id": "q-2.1-0-v3",
            "question": "In the line score = 5 + 15, which part is the expression?",
            "options": [
              {
                "id": "A",
                "text": "5 + 15 (which evaluates to 20)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "The entire line score = 5 + 15",
                "explanationIfWrong": "The entire line is an assignment statement."
              },
              {
                "id": "C",
                "text": "The equals sign (=)",
                "explanationIfWrong": "The equals sign is the assignment operator."
              },
              {
                "id": "D",
                "text": "None of it",
                "explanationIfWrong": "5 + 15 is an arithmetic expression."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "5 + 15 is evaluated to produce the value 20, which is then assigned."
          }
        ]
      },
      {
        "heading": "Arguments vs. Parameters",
        "text": "A parameter is a variable listed in a function definition that accepts input. An argument is the actual value passed into the function when you call it. For example, when you call print(\"Hello\", 42), the strings \"Hello\" and 42 are the arguments.",
        "codeSnippet": "# \"Python\" and 2026 are arguments passed into print()\nprint(\"Python\", 2026)",
        "terminalOutput": "Python 2026",
        "mcq": {
          "id": "q-2.1-1-v1",
          "question": "In the code call print(\"Helsinki\", 2026), what are \"Helsinki\" and 2026 called?",
          "options": [
            {
              "id": "A",
              "text": "Arguments (the actual values supplied to the function call)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Parameters",
              "explanationIfWrong": "Parameters are the variable names in the function definition."
            },
            {
              "id": "C",
              "text": "Return values",
              "explanationIfWrong": "Return values are what the function sends back."
            },
            {
              "id": "D",
              "text": "Variables",
              "explanationIfWrong": "They are literal values passed as arguments."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Values passed into a function when calling it are called arguments."
        },
        "retestMcq": {
          "id": "q-2.1-1-v2",
          "question": "What is the distinction between a parameter and an argument?",
          "options": [
            {
              "id": "A",
              "text": "Parameters are defined in the function signature, while arguments are the actual values passed during a call",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Arguments are always numbers, while parameters are text",
              "explanationIfWrong": "Both can be of any data type."
            },
            {
              "id": "C",
              "text": "They are completely identical with no difference",
              "explanationIfWrong": "Parameters define the placeholder; arguments provide the data."
            },
            {
              "id": "D",
              "text": "Parameters are only used in math formulas",
              "explanationIfWrong": "Parameters exist in all programming functions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Parameters define what a function expects; arguments are the values actually provided."
        },
        "questionPool": [
          {
            "id": "q-2.1-1-v1",
            "question": "In the code call print(\"Helsinki\", 2026), what are \"Helsinki\" and 2026 called?",
            "options": [
              {
                "id": "A",
                "text": "Arguments (the actual values supplied to the function call)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Parameters",
                "explanationIfWrong": "Parameters are the variable names in the function definition."
              },
              {
                "id": "C",
                "text": "Return values",
                "explanationIfWrong": "Return values are what the function sends back."
              },
              {
                "id": "D",
                "text": "Variables",
                "explanationIfWrong": "They are literal values passed as arguments."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Values passed into a function when calling it are called arguments."
          },
          {
            "id": "q-2.1-1-v2",
            "question": "What is the distinction between a parameter and an argument?",
            "options": [
              {
                "id": "A",
                "text": "Parameters are defined in the function signature, while arguments are the actual values passed during a call",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Arguments are always numbers, while parameters are text",
                "explanationIfWrong": "Both can be of any data type."
              },
              {
                "id": "C",
                "text": "They are completely identical with no difference",
                "explanationIfWrong": "Parameters define the placeholder; arguments provide the data."
              },
              {
                "id": "D",
                "text": "Parameters are only used in math formulas",
                "explanationIfWrong": "Parameters exist in all programming functions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Parameters define what a function expects; arguments are the values actually provided."
          },
          {
            "id": "q-2.1-1-v3",
            "question": "When calling len(\"Python\"), what is \"Python\"?",
            "options": [
              {
                "id": "A",
                "text": "The argument passed to the len() function",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "The return value of len()",
                "explanationIfWrong": "The return value is 6, the length of the string."
              },
              {
                "id": "C",
                "text": "A syntax keyword",
                "explanationIfWrong": "\"Python\" is a string literal passed as an argument."
              },
              {
                "id": "D",
                "text": "A parameter",
                "explanationIfWrong": "The parameter is internal to the len() implementation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "\"Python\" is the argument input supplied to len()."
          }
        ]
      },
      {
        "heading": "Function Return Values",
        "text": "A function can compute an answer and pass it back to the caller. This produced result is called the return value. For example, input() returns a string typed by the user, and len(\"apple\") returns the integer 5.",
        "codeSnippet": "word_length = len(\"Banana\") # len() returns 6\nprint(\"Length is:\", word_length)",
        "terminalOutput": "Length is: 6",
        "mcq": {
          "id": "q-2.1-2-v1",
          "question": "What is a \"return value\" in programming?",
          "options": [
            {
              "id": "A",
              "text": "The data value that a function sends back to where it was called",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "The error message printed when code crashes",
              "explanationIfWrong": "Errors are exceptions, not return values."
            },
            {
              "id": "C",
              "text": "The variable name inside a function",
              "explanationIfWrong": "Variables inside functions are parameters or local variables."
            },
            {
              "id": "D",
              "text": "The time taken to run the code",
              "explanationIfWrong": "Return values represent computed data."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Functions return a result value to the location where they were invoked."
        },
        "retestMcq": {
          "id": "q-2.1-2-v2",
          "question": "What does the input() function return after the user presses Enter?",
          "options": [
            {
              "id": "A",
              "text": "The user's entered keystrokes as a string (str)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "An integer number",
              "explanationIfWrong": "input() always returns string text, never int."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "input() returns the entered text."
            },
            {
              "id": "D",
              "text": "True or False",
              "explanationIfWrong": "input() returns string data."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "input() returns the exact string entered by the user."
        },
        "questionPool": [
          {
            "id": "q-2.1-2-v1",
            "question": "What is a \"return value\" in programming?",
            "options": [
              {
                "id": "A",
                "text": "The data value that a function sends back to where it was called",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "The error message printed when code crashes",
                "explanationIfWrong": "Errors are exceptions, not return values."
              },
              {
                "id": "C",
                "text": "The variable name inside a function",
                "explanationIfWrong": "Variables inside functions are parameters or local variables."
              },
              {
                "id": "D",
                "text": "The time taken to run the code",
                "explanationIfWrong": "Return values represent computed data."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Functions return a result value to the location where they were invoked."
          },
          {
            "id": "q-2.1-2-v2",
            "question": "What does the input() function return after the user presses Enter?",
            "options": [
              {
                "id": "A",
                "text": "The user's entered keystrokes as a string (str)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "An integer number",
                "explanationIfWrong": "input() always returns string text, never int."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "input() returns the entered text."
              },
              {
                "id": "D",
                "text": "True or False",
                "explanationIfWrong": "input() returns string data."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "input() returns the exact string entered by the user."
          },
          {
            "id": "q-2.1-2-v3",
            "question": "In the code result = int(\"42\"), what is the return value of int(\"42\")?",
            "options": [
              {
                "id": "A",
                "text": "The integer number 42",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "The string \"42\"",
                "explanationIfWrong": "int() converts string \"42\" into the integer 42."
              },
              {
                "id": "C",
                "text": "result",
                "explanationIfWrong": "result is the variable that receives the return value."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "int() returns an integer object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "int(\"42\") computes and returns the integer value 42."
          }
        ]
      },
      {
        "heading": "Syntax Errors (Compile-Time / Parsing Errors)",
        "text": "A SyntaxError occurs when your code violates the grammar rules of Python (e.g. missing colon at the end of an if, unclosed parentheses, or invalid variable names). Python catches syntax errors BEFORE running any lines.",
        "codeSnippet": "# Syntax Error Examples:\n# if x > 5  <-- Missing colon (:)\n# print(\"Hello  <-- Missing closing quote and parenthesis",
        "terminalOutput": "SyntaxError: expected ':'",
        "mcq": {
          "id": "q-2.1-3-v1",
          "question": "When does Python detect a SyntaxError in your program?",
          "options": [
            {
              "id": "A",
              "text": "Before executing any code lines, during the initial parsing phase",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Only after the program has run for 5 minutes",
              "explanationIfWrong": "Syntax errors stop the program before it ever starts."
            },
            {
              "id": "C",
              "text": "Only when the user inputs invalid text",
              "explanationIfWrong": "Syntax errors are in the written code, not user input."
            },
            {
              "id": "D",
              "text": "At the very end of the program",
              "explanationIfWrong": "Parsing happens before execution begins."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python checks syntax first; if a SyntaxError exists, zero lines are executed."
        },
        "retestMcq": {
          "id": "q-2.1-3-v2",
          "question": "Which of the following will trigger an immediate SyntaxError in Python?",
          "options": [
            {
              "id": "A",
              "text": "if score >= 50 (missing colon at the end)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "print(10 / 2)",
              "explanationIfWrong": "print(10 / 2) has completely valid syntax."
            },
            {
              "id": "C",
              "text": "name = \"Ada\"",
              "explanationIfWrong": "Valid assignment syntax."
            },
            {
              "id": "D",
              "text": "total = 0",
              "explanationIfWrong": "Valid assignment syntax."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python requires a colon (:) at the end of an if statement header."
        },
        "questionPool": [
          {
            "id": "q-2.1-3-v1",
            "question": "When does Python detect a SyntaxError in your program?",
            "options": [
              {
                "id": "A",
                "text": "Before executing any code lines, during the initial parsing phase",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Only after the program has run for 5 minutes",
                "explanationIfWrong": "Syntax errors stop the program before it ever starts."
              },
              {
                "id": "C",
                "text": "Only when the user inputs invalid text",
                "explanationIfWrong": "Syntax errors are in the written code, not user input."
              },
              {
                "id": "D",
                "text": "At the very end of the program",
                "explanationIfWrong": "Parsing happens before execution begins."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python checks syntax first; if a SyntaxError exists, zero lines are executed."
          },
          {
            "id": "q-2.1-3-v2",
            "question": "Which of the following will trigger an immediate SyntaxError in Python?",
            "options": [
              {
                "id": "A",
                "text": "if score >= 50 (missing colon at the end)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "print(10 / 2)",
                "explanationIfWrong": "print(10 / 2) has completely valid syntax."
              },
              {
                "id": "C",
                "text": "name = \"Ada\"",
                "explanationIfWrong": "Valid assignment syntax."
              },
              {
                "id": "D",
                "text": "total = 0",
                "explanationIfWrong": "Valid assignment syntax."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python requires a colon (:) at the end of an if statement header."
          },
          {
            "id": "q-2.1-3-v3",
            "question": "If line 10 in a 10-line Python script has a SyntaxError, will line 1 execute?",
            "options": [
              {
                "id": "A",
                "text": "No, Python will not run any line because syntax parsing fails first",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Yes, lines 1 through 9 will run and line 10 will fail",
                "explanationIfWrong": "Unlike runtime errors, syntax errors prevent execution entirely."
              },
              {
                "id": "C",
                "text": "Only if line 1 contains a print statement",
                "explanationIfWrong": "The entire file must be syntactically valid to start running."
              },
              {
                "id": "D",
                "text": "Yes, because Python runs line-by-line",
                "explanationIfWrong": "Python parses the entire file structure before execution begins."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A SyntaxError stops the interpreter during compilation before any execution begins."
          }
        ]
      },
      {
        "heading": "Runtime Errors (Exceptions)",
        "text": "A RuntimeError happens while the code is actively running. The syntax is completely legal, but an impossible operation is attempted (e.g. dividing by zero, converting invalid text into a number, or using an undefined variable name).",
        "codeSnippet": "# Syntax is valid, but fails during execution:\nnumber = 10\nprint(number / 0) # ZeroDivisionError!",
        "terminalOutput": "ZeroDivisionError: division by zero",
        "mcq": {
          "id": "q-2.1-4-v1",
          "question": "What is a RuntimeError (Exception) in Python?",
          "options": [
            {
              "id": "A",
              "text": "An error that occurs while the program is actively executing an illegal operation",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A grammar error caught before the program runs",
              "explanationIfWrong": "That is a SyntaxError."
            },
            {
              "id": "C",
              "text": "A comment that starts with #",
              "explanationIfWrong": "Comments are not errors."
            },
            {
              "id": "D",
              "text": "An intentional feature to speed up code",
              "explanationIfWrong": "Runtime errors crash the program if unhandled."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Runtime errors occur when legal syntax attempts an impossible operation during execution."
        },
        "retestMcq": {
          "id": "q-2.1-4-v2",
          "question": "Which of the following operations will trigger a ZeroDivisionError runtime exception?",
          "options": [
            {
              "id": "A",
              "text": "print(50 / 0)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "print(0 / 50)",
              "explanationIfWrong": "0 divided by 50 is 0.0, which is completely valid."
            },
            {
              "id": "C",
              "text": "print(50 * 0)",
              "explanationIfWrong": "Multiplying by 0 is 0."
            },
            {
              "id": "D",
              "text": "print(50 - 0)",
              "explanationIfWrong": "Subtracting 0 is 50."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dividing any number by zero is mathematically undefined and raises ZeroDivisionError."
        },
        "questionPool": [
          {
            "id": "q-2.1-4-v1",
            "question": "What is a RuntimeError (Exception) in Python?",
            "options": [
              {
                "id": "A",
                "text": "An error that occurs while the program is actively executing an illegal operation",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "A grammar error caught before the program runs",
                "explanationIfWrong": "That is a SyntaxError."
              },
              {
                "id": "C",
                "text": "A comment that starts with #",
                "explanationIfWrong": "Comments are not errors."
              },
              {
                "id": "D",
                "text": "An intentional feature to speed up code",
                "explanationIfWrong": "Runtime errors crash the program if unhandled."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Runtime errors occur when legal syntax attempts an impossible operation during execution."
          },
          {
            "id": "q-2.1-4-v2",
            "question": "Which of the following operations will trigger a ZeroDivisionError runtime exception?",
            "options": [
              {
                "id": "A",
                "text": "print(50 / 0)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "print(0 / 50)",
                "explanationIfWrong": "0 divided by 50 is 0.0, which is completely valid."
              },
              {
                "id": "C",
                "text": "print(50 * 0)",
                "explanationIfWrong": "Multiplying by 0 is 0."
              },
              {
                "id": "D",
                "text": "print(50 - 0)",
                "explanationIfWrong": "Subtracting 0 is 50."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dividing any number by zero is mathematically undefined and raises ZeroDivisionError."
          },
          {
            "id": "q-2.1-4-v3",
            "question": "What error will occur when running int(\"hello\") during program execution?",
            "options": [
              {
                "id": "A",
                "text": "ValueError: invalid literal for int() with base 10",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "SyntaxError",
                "explanationIfWrong": "The syntax int(...) is valid; the value cannot be parsed."
              },
              {
                "id": "C",
                "text": "ZeroDivisionError",
                "explanationIfWrong": "No division is occurring."
              },
              {
                "id": "D",
                "text": "IndentationError",
                "explanationIfWrong": "Indentation is not involved."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing non-numeric characters to int() raises a ValueError runtime exception."
          }
        ]
      },
      {
        "heading": "Logic Errors (Bugs)",
        "text": "A logic error occurs when your code has no syntax errors and runs without crashing, but produces the WRONG result because your algorithm or formulas were flawed. For example, calculating average as (a + b) / 3 instead of 2.",
        "codeSnippet": "# Goal: Calculate area of rectangle (width * height)\nwidth = 5\nheight = 4\narea = width + height # BUG: Used + instead of *!\nprint(\"Area:\", area)",
        "terminalOutput": "Area: 9",
        "mcq": {
          "id": "q-2.1-5-v1",
          "question": "What is a logic error (bug) in software programming?",
          "options": [
            {
              "id": "A",
              "text": "The program runs without crashing, but outputs incorrect or unexpected results",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A missing colon at the end of a line",
              "explanationIfWrong": "A missing colon is a SyntaxError."
            },
            {
              "id": "C",
              "text": "Dividing a number by zero",
              "explanationIfWrong": "Dividing by zero causes a RuntimeError."
            },
            {
              "id": "D",
              "text": "Typing code in uppercase letters",
              "explanationIfWrong": "Logic errors are conceptual flaws in programming instructions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Logic errors produce wrong results even though the computer executes the code without crashing."
        },
        "retestMcq": {
          "id": "q-2.1-5-v2",
          "question": "A programmer writes profit = revenue + expenses instead of revenue - expenses. What type of error is this?",
          "options": [
            {
              "id": "A",
              "text": "Logic error",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Syntax error",
              "explanationIfWrong": "revenue + expenses is syntactically legal code."
            },
            {
              "id": "C",
              "text": "Runtime error",
              "explanationIfWrong": "Addition will execute cleanly without throwing an exception."
            },
            {
              "id": "D",
              "text": "ZeroDivisionError",
              "explanationIfWrong": "No division is involved."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The code runs cleanly, but calculates the wrong numerical answer due to a flawed formula."
        },
        "questionPool": [
          {
            "id": "q-2.1-5-v1",
            "question": "What is a logic error (bug) in software programming?",
            "options": [
              {
                "id": "A",
                "text": "The program runs without crashing, but outputs incorrect or unexpected results",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "A missing colon at the end of a line",
                "explanationIfWrong": "A missing colon is a SyntaxError."
              },
              {
                "id": "C",
                "text": "Dividing a number by zero",
                "explanationIfWrong": "Dividing by zero causes a RuntimeError."
              },
              {
                "id": "D",
                "text": "Typing code in uppercase letters",
                "explanationIfWrong": "Logic errors are conceptual flaws in programming instructions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Logic errors produce wrong results even though the computer executes the code without crashing."
          },
          {
            "id": "q-2.1-5-v2",
            "question": "A programmer writes profit = revenue + expenses instead of revenue - expenses. What type of error is this?",
            "options": [
              {
                "id": "A",
                "text": "Logic error",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Syntax error",
                "explanationIfWrong": "revenue + expenses is syntactically legal code."
              },
              {
                "id": "C",
                "text": "Runtime error",
                "explanationIfWrong": "Addition will execute cleanly without throwing an exception."
              },
              {
                "id": "D",
                "text": "ZeroDivisionError",
                "explanationIfWrong": "No division is involved."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The code runs cleanly, but calculates the wrong numerical answer due to a flawed formula."
          },
          {
            "id": "q-2.1-5-v3",
            "question": "Why are logic errors often harder to find than syntax or runtime errors?",
            "options": [
              {
                "id": "A",
                "text": "Because Python displays no error message; you must test output to notice the mistake",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Because Python deletes your script when a logic error occurs",
                "explanationIfWrong": "Python never deletes files on logic errors."
              },
              {
                "id": "C",
                "text": "Because computers refuse to run code with logic errors",
                "explanationIfWrong": "The computer happily runs the code exactly as instructed."
              },
              {
                "id": "D",
                "text": "Because logic errors only happen in external libraries",
                "explanationIfWrong": "Logic errors can happen in any user code."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python cannot know your true intention, so it runs without complaints; only testing reveals the bug."
          }
        ]
      }
    ]
  },
  {
    "id": "2-2-more-conditionals",
    "number": "2.2",
    "title": "More Conditionals & Nested Logic",
    "subtitle": "Master nested if blocks, multi-way branching, boundary edge cases, and boolean variables.",
    "readTime": "25 min",
    "objectives": [
      "Write nested if statements with 8-space indentation",
      "Distinguish independent if checks from elif chains",
      "Construct multi-category decision trees with elif",
      "Use fallback else blocks reliably in complex logic",
      "Test edge cases and boundary comparisons (< vs <=)",
      "Use boolean variables directly as condition flags"
    ],
    "theoryBlocks": [
      {
        "heading": "Nested if Statements",
        "text": "An if statement can be nested inside another if statement. The inner block is indented with 8 spaces and executes ONLY when both the outer condition and the inner condition are True.",
        "codeSnippet": "age = 20\nhas_ticket = True\n\nif age >= 18:\n    print(\"Age verified\")\n    if has_ticket:\n        print(\"Welcome to the event!\")",
        "terminalOutput": "Age verified\nWelcome to the event!",
        "mcq": {
          "id": "q-2.2-0-v1",
          "question": "When will the inner block of a nested if statement execute?",
          "options": [
            {
              "id": "A",
              "text": "Only when both the outer condition AND the inner condition are True",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Whenever the inner condition is True, even if the outer condition was False",
              "explanationIfWrong": "If the outer condition is False, the entire inner block is skipped."
            },
            {
              "id": "C",
              "text": "Every time the program runs",
              "explanationIfWrong": "Both conditions must evaluate to True."
            },
            {
              "id": "D",
              "text": "Only when both conditions are False",
              "explanationIfWrong": "Conditions must be True to execute."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Execution reaches the inner if only when the outer if condition is True."
        },
        "retestMcq": {
          "id": "q-2.2-0-v2",
          "question": "What is the standard PEP 8 indentation for the body of a nested if inside an outer if?",
          "options": [
            {
              "id": "A",
              "text": "8 spaces (4 spaces for outer + 4 spaces for inner)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "4 spaces",
              "explanationIfWrong": "4 spaces is for the outer block; nested blocks require an additional 4 spaces."
            },
            {
              "id": "C",
              "text": "2 spaces",
              "explanationIfWrong": "Standard Python indentation uses 4 spaces per nesting level."
            },
            {
              "id": "D",
              "text": "No indentation",
              "explanationIfWrong": "Unindented code causes an IndentationError."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Each level of nesting adds 4 spaces, so a doubly-nested block uses 8 spaces."
        },
        "questionPool": [
          {
            "id": "q-2.2-0-v1",
            "question": "When will the inner block of a nested if statement execute?",
            "options": [
              {
                "id": "A",
                "text": "Only when both the outer condition AND the inner condition are True",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Whenever the inner condition is True, even if the outer condition was False",
                "explanationIfWrong": "If the outer condition is False, the entire inner block is skipped."
              },
              {
                "id": "C",
                "text": "Every time the program runs",
                "explanationIfWrong": "Both conditions must evaluate to True."
              },
              {
                "id": "D",
                "text": "Only when both conditions are False",
                "explanationIfWrong": "Conditions must be True to execute."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Execution reaches the inner if only when the outer if condition is True."
          },
          {
            "id": "q-2.2-0-v2",
            "question": "What is the standard PEP 8 indentation for the body of a nested if inside an outer if?",
            "options": [
              {
                "id": "A",
                "text": "8 spaces (4 spaces for outer + 4 spaces for inner)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "4 spaces",
                "explanationIfWrong": "4 spaces is for the outer block; nested blocks require an additional 4 spaces."
              },
              {
                "id": "C",
                "text": "2 spaces",
                "explanationIfWrong": "Standard Python indentation uses 4 spaces per nesting level."
              },
              {
                "id": "D",
                "text": "No indentation",
                "explanationIfWrong": "Unindented code causes an IndentationError."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each level of nesting adds 4 spaces, so a doubly-nested block uses 8 spaces."
          },
          {
            "id": "q-2.2-0-v3",
            "question": "Consider the code:\nx = 10\ny = 2\nif x > 5:\n    if y > 5:\n        print(\"A\")\n    else:\n        print(\"B\")\nWhat is printed?",
            "options": [
              {
                "id": "A",
                "text": "B (x > 5 is True, but y > 5 is False, so inner else runs)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "A",
                "explanationIfWrong": "y is 2, which is not greater than 5."
              },
              {
                "id": "C",
                "text": "A and B",
                "explanationIfWrong": "Only one branch in an if-else can run."
              },
              {
                "id": "D",
                "text": "Nothing is printed",
                "explanationIfWrong": "The inner else branch executes and prints \"B\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The outer check passes (10 > 5), but the inner check fails (2 > 5 is False), executing inner else."
          }
        ]
      },
      {
        "heading": "Independent if Checks vs. elif Chains",
        "text": "When you write separate if statements, Python evaluates EVERY one of them independently. In contrast, in an if-elif chain, Python stops evaluating as soon as the first True condition is found.",
        "codeSnippet": "num = 15\n# Independent:\nif num > 10:\n    print(\"Greater than 10\")\nif num > 5:\n    print(\"Greater than 5\")",
        "terminalOutput": "Greater than 10\nGreater than 5",
        "mcq": {
          "id": "q-2.2-1-v1",
          "question": "If you have two independent if statements and both conditions are True, how many will execute?",
          "options": [
            {
              "id": "A",
              "text": "Both will execute",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Only the first one",
              "explanationIfWrong": "Separate if statements are evaluated independently."
            },
            {
              "id": "C",
              "text": "Only the second one",
              "explanationIfWrong": "Both independent checks run sequentially."
            },
            {
              "id": "D",
              "text": "Neither will execute",
              "explanationIfWrong": "True conditions always execute."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Independent if statements do not interfere with each other; each executes if its condition is True."
        },
        "retestMcq": {
          "id": "q-2.2-1-v2",
          "question": "Consider:\nx = 20\nif x > 10:\n    print(\"A\")\nelif x > 5:\n    print(\"B\")\nWhat will be printed?",
          "options": [
            {
              "id": "A",
              "text": "A only (the elif is skipped because the first if was True)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A and B",
              "explanationIfWrong": "In an if-elif chain, Python stops after the first True branch."
            },
            {
              "id": "C",
              "text": "B only",
              "explanationIfWrong": "The first check x > 10 is True, so it executes A."
            },
            {
              "id": "D",
              "text": "Nothing",
              "explanationIfWrong": "Branch A executes."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In an if-elif structure, only the first matching branch runs; subsequent elifs are ignored."
        },
        "questionPool": [
          {
            "id": "q-2.2-1-v1",
            "question": "If you have two independent if statements and both conditions are True, how many will execute?",
            "options": [
              {
                "id": "A",
                "text": "Both will execute",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Only the first one",
                "explanationIfWrong": "Separate if statements are evaluated independently."
              },
              {
                "id": "C",
                "text": "Only the second one",
                "explanationIfWrong": "Both independent checks run sequentially."
              },
              {
                "id": "D",
                "text": "Neither will execute",
                "explanationIfWrong": "True conditions always execute."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Independent if statements do not interfere with each other; each executes if its condition is True."
          },
          {
            "id": "q-2.2-1-v2",
            "question": "Consider:\nx = 20\nif x > 10:\n    print(\"A\")\nelif x > 5:\n    print(\"B\")\nWhat will be printed?",
            "options": [
              {
                "id": "A",
                "text": "A only (the elif is skipped because the first if was True)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "A and B",
                "explanationIfWrong": "In an if-elif chain, Python stops after the first True branch."
              },
              {
                "id": "C",
                "text": "B only",
                "explanationIfWrong": "The first check x > 10 is True, so it executes A."
              },
              {
                "id": "D",
                "text": "Nothing",
                "explanationIfWrong": "Branch A executes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In an if-elif structure, only the first matching branch runs; subsequent elifs are ignored."
          },
          {
            "id": "q-2.2-1-v3",
            "question": "When should you use independent if statements instead of an elif chain?",
            "options": [
              {
                "id": "A",
                "text": "When you want to check multiple non-exclusive conditions where more than one can be valid",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "When you want code to run faster",
                "explanationIfWrong": "Independent ifs evaluate more conditions, not fewer."
              },
              {
                "id": "C",
                "text": "Only when dealing with string data",
                "explanationIfWrong": "Control flow is independent of data types."
              },
              {
                "id": "D",
                "text": "When you only want at most one branch to execute",
                "explanationIfWrong": "For at most one branch, you use elif."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Independent ifs allow multiple separate conditions to execute if all are met."
          }
        ]
      },
      {
        "heading": "Multi-Way Branching with elif",
        "text": "The elif keyword enables multi-category decision trees (such as grading systems, price tiers, or menu options). You can chain as many elif blocks as needed.",
        "codeSnippet": "score = 75\nif score >= 90:\n    print(\"Grade: A\")\nelif score >= 80:\n    print(\"Grade: B\")\nelif score >= 70:\n    print(\"Grade: C\")\nelse:\n    print(\"Grade: D or F\")",
        "terminalOutput": "Grade: C",
        "mcq": {
          "id": "q-2.2-2-v1",
          "question": "How many elif clauses can you attach to a single if statement in Python?",
          "options": [
            {
              "id": "A",
              "text": "As many as needed (there is no strict limit)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Exactly one",
              "explanationIfWrong": "You can chain multiple elif statements."
            },
            {
              "id": "C",
              "text": "Maximum of 3",
              "explanationIfWrong": "Python allows unlimited elif branches."
            },
            {
              "id": "D",
              "text": "Maximum of 10",
              "explanationIfWrong": "There is no built-in limit."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "You can chain as many elif blocks as necessary to cover your condition categories."
        },
        "retestMcq": {
          "id": "q-2.2-2-v2",
          "question": "Why must score ranges in an elif ladder be arranged in proper descending or ascending order?",
          "options": [
            {
              "id": "A",
              "text": "Because Python evaluates top-to-bottom and stops at the first True match",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Because Python sorts the elif conditions automatically",
              "explanationIfWrong": "Python executes strictly in written order."
            },
            {
              "id": "C",
              "text": "Because a SyntaxError occurs if not ordered",
              "explanationIfWrong": "Disordered conditions are syntactically valid but cause logic bugs."
            },
            {
              "id": "D",
              "text": "It does not matter what order you write them",
              "explanationIfWrong": "Order is critical to ensure proper range matching."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "If a broader condition appears above a specific one, the specific condition will never be reached."
        },
        "questionPool": [
          {
            "id": "q-2.2-2-v1",
            "question": "How many elif clauses can you attach to a single if statement in Python?",
            "options": [
              {
                "id": "A",
                "text": "As many as needed (there is no strict limit)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Exactly one",
                "explanationIfWrong": "You can chain multiple elif statements."
              },
              {
                "id": "C",
                "text": "Maximum of 3",
                "explanationIfWrong": "Python allows unlimited elif branches."
              },
              {
                "id": "D",
                "text": "Maximum of 10",
                "explanationIfWrong": "There is no built-in limit."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "You can chain as many elif blocks as necessary to cover your condition categories."
          },
          {
            "id": "q-2.2-2-v2",
            "question": "Why must score ranges in an elif ladder be arranged in proper descending or ascending order?",
            "options": [
              {
                "id": "A",
                "text": "Because Python evaluates top-to-bottom and stops at the first True match",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Because Python sorts the elif conditions automatically",
                "explanationIfWrong": "Python executes strictly in written order."
              },
              {
                "id": "C",
                "text": "Because a SyntaxError occurs if not ordered",
                "explanationIfWrong": "Disordered conditions are syntactically valid but cause logic bugs."
              },
              {
                "id": "D",
                "text": "It does not matter what order you write them",
                "explanationIfWrong": "Order is critical to ensure proper range matching."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "If a broader condition appears above a specific one, the specific condition will never be reached."
          },
          {
            "id": "q-2.2-2-v3",
            "question": "Consider:\ntemp = 28\nif temp > 35:\n    print(\"Scorching\")\nelif temp > 25:\n    print(\"Warm\")\nelif temp > 15:\n    print(\"Mild\")\nWhat is printed?",
            "options": [
              {
                "id": "A",
                "text": "Warm",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Scorching",
                "explanationIfWrong": "28 is not greater than 35."
              },
              {
                "id": "C",
                "text": "Warm and Mild",
                "explanationIfWrong": "elif branches are mutually exclusive."
              },
              {
                "id": "D",
                "text": "Mild",
                "explanationIfWrong": "temp > 25 matched first, so execution stopped."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "28 > 35 is False, 28 > 25 is True -> \"Warm\" prints and the chain terminates."
          }
        ]
      },
      {
        "heading": "The Fallback else Block in Complex Chains",
        "text": "The else statement at the end of an if-elif ladder acts as a safety net or catch-all: it executes if and only if NONE of the preceding if or elif conditions were True.",
        "codeSnippet": "color = \"purple\"\nif color == \"red\":\n    print(\"Stop\")\nelif color == \"green\":\n    print(\"Go\")\nelse:\n    print(\"Unknown signal\")",
        "terminalOutput": "Unknown signal",
        "mcq": {
          "id": "q-2.2-3-v1",
          "question": "When will the final else block in an if-elif-else construct execute?",
          "options": [
            {
              "id": "A",
              "text": "When every preceding if and elif condition in the chain evaluates to False",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Whenever any elif condition is True",
              "explanationIfWrong": "If an elif is True, else is skipped."
            },
            {
              "id": "C",
              "text": "It always executes at the end of every run",
              "explanationIfWrong": "else is only executed when no prior conditions matched."
            },
            {
              "id": "D",
              "text": "Only if an exception was raised",
              "explanationIfWrong": "else handles boolean false outcomes, not exceptions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The else block provides the default action when none of the specified conditions are met."
        },
        "retestMcq": {
          "id": "q-2.2-3-v2",
          "question": "Is an else block strictly required at the end of an if-elif chain in Python?",
          "options": [
            {
              "id": "A",
              "text": "No, it is optional; if omitted and all conditions are False, nothing happens",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Yes, omitting else causes a SyntaxError",
              "explanationIfWrong": "else is completely optional."
            },
            {
              "id": "C",
              "text": "Yes, Python requires an else for safety",
              "explanationIfWrong": "You can write an if or if-elif without an else."
            },
            {
              "id": "D",
              "text": "Only when working with strings",
              "explanationIfWrong": "else is always optional regardless of type."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "You only include an else branch if you need a default fallback behavior."
        },
        "questionPool": [
          {
            "id": "q-2.2-3-v1",
            "question": "When will the final else block in an if-elif-else construct execute?",
            "options": [
              {
                "id": "A",
                "text": "When every preceding if and elif condition in the chain evaluates to False",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Whenever any elif condition is True",
                "explanationIfWrong": "If an elif is True, else is skipped."
              },
              {
                "id": "C",
                "text": "It always executes at the end of every run",
                "explanationIfWrong": "else is only executed when no prior conditions matched."
              },
              {
                "id": "D",
                "text": "Only if an exception was raised",
                "explanationIfWrong": "else handles boolean false outcomes, not exceptions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The else block provides the default action when none of the specified conditions are met."
          },
          {
            "id": "q-2.2-3-v2",
            "question": "Is an else block strictly required at the end of an if-elif chain in Python?",
            "options": [
              {
                "id": "A",
                "text": "No, it is optional; if omitted and all conditions are False, nothing happens",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Yes, omitting else causes a SyntaxError",
                "explanationIfWrong": "else is completely optional."
              },
              {
                "id": "C",
                "text": "Yes, Python requires an else for safety",
                "explanationIfWrong": "You can write an if or if-elif without an else."
              },
              {
                "id": "D",
                "text": "Only when working with strings",
                "explanationIfWrong": "else is always optional regardless of type."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "You only include an else branch if you need a default fallback behavior."
          },
          {
            "id": "q-2.2-3-v3",
            "question": "Consider:\nx = 5\nif x == 1:\n    print(\"One\")\nelif x == 2:\n    print(\"Two\")\nelse:\n    print(\"Other\")\nWhat is printed?",
            "options": [
              {
                "id": "A",
                "text": "Other",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "One",
                "explanationIfWrong": "x == 1 is False."
              },
              {
                "id": "C",
                "text": "Two",
                "explanationIfWrong": "x == 2 is False."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The else block executes and outputs \"Other\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Both the if and elif conditions are False, so the else branch executes."
          }
        ]
      },
      {
        "heading": "Boundary Edge Cases and Comparisons",
        "text": "Pay careful attention to the difference between strict inequality (< or >) and inclusive inequality (<= or >=). Testing boundary values (like 0, 18, or 100) is crucial to avoid \"off-by-one\" bugs.",
        "codeSnippet": "score = 80\n# Strict: score > 80 is False\n# Inclusive: score >= 80 is True\nprint(score > 80)  # False\nprint(score >= 80) # True",
        "terminalOutput": "False\nTrue",
        "mcq": {
          "id": "q-2.2-4-v1",
          "question": "If the passing benchmark is 80% or higher, which conditional expression correctly includes 80% as a pass?",
          "options": [
            {
              "id": "A",
              "text": "score >= 80",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "score > 80",
              "explanationIfWrong": "score > 80 requires strictly more than 80, failing someone with exactly 80."
            },
            {
              "id": "C",
              "text": "score == 80",
              "explanationIfWrong": "score == 80 only passes people with exactly 80."
            },
            {
              "id": "D",
              "text": "score < 80",
              "explanationIfWrong": "< is less than."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": ">= (greater than or equal to) includes the boundary number 80."
        },
        "retestMcq": {
          "id": "q-2.2-4-v2",
          "question": "What is the evaluated result of 15 < 15 in Python?",
          "options": [
            {
              "id": "A",
              "text": "False (15 is not strictly less than 15)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "True",
              "explanationIfWrong": "< is strict; 15 is equal to 15, not less."
            },
            {
              "id": "C",
              "text": "15",
              "explanationIfWrong": "Comparison operators return booleans."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "Comparison between integers is standard."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A number is never strictly less than itself, so 15 < 15 is False."
        },
        "questionPool": [
          {
            "id": "q-2.2-4-v1",
            "question": "If the passing benchmark is 80% or higher, which conditional expression correctly includes 80% as a pass?",
            "options": [
              {
                "id": "A",
                "text": "score >= 80",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "score > 80",
                "explanationIfWrong": "score > 80 requires strictly more than 80, failing someone with exactly 80."
              },
              {
                "id": "C",
                "text": "score == 80",
                "explanationIfWrong": "score == 80 only passes people with exactly 80."
              },
              {
                "id": "D",
                "text": "score < 80",
                "explanationIfWrong": "< is less than."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": ">= (greater than or equal to) includes the boundary number 80."
          },
          {
            "id": "q-2.2-4-v2",
            "question": "What is the evaluated result of 15 < 15 in Python?",
            "options": [
              {
                "id": "A",
                "text": "False (15 is not strictly less than 15)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "True",
                "explanationIfWrong": "< is strict; 15 is equal to 15, not less."
              },
              {
                "id": "C",
                "text": "15",
                "explanationIfWrong": "Comparison operators return booleans."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "Comparison between integers is standard."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A number is never strictly less than itself, so 15 < 15 is False."
          },
          {
            "id": "q-2.2-4-v3",
            "question": "In programming, what is an \"off-by-one error\"?",
            "options": [
              {
                "id": "A",
                "text": "A logic error where a boundary comparison is mistakenly off by 1 (e.g. using < instead of <=)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "An error where Python subtracts 1 from your code lines",
                "explanationIfWrong": "It refers to a human logical mistake at boundary limits."
              },
              {
                "id": "C",
                "text": "A syntax error with commas",
                "explanationIfWrong": "It is a classic algorithmic boundary bug."
              },
              {
                "id": "D",
                "text": "A hardware clock error",
                "explanationIfWrong": "It is a programmer boundary error."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An off-by-one error happens when a loop or comparison includes or excludes a boundary item incorrectly."
          }
        ]
      },
      {
        "heading": "Boolean Variables as Conditions",
        "text": "Since an if statement simply evaluates whether something is True or False, you can pass boolean variables directly to if conditions without needing to write == True.",
        "codeSnippet": "is_logged_in = True\nif is_logged_in:\n    print(\"Welcome back!\")\n\nhas_permission = False\nif not has_permission:\n    print(\"Access restricted\")",
        "terminalOutput": "Welcome back!\nAccess restricted",
        "mcq": {
          "id": "q-2.2-5-v1",
          "question": "If is_valid is a boolean variable holding True, which is the idiomatic Python way to check it?",
          "options": [
            {
              "id": "A",
              "text": "if is_valid: (direct boolean evaluation)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "if is_valid == True: (redundant comparison)",
              "explanationIfWrong": "While legal, writing == True is considered redundant in Python."
            },
            {
              "id": "C",
              "text": "if is_valid.isTrue():",
              "explanationIfWrong": "No such method exists in Python."
            },
            {
              "id": "D",
              "text": "if bool(is_valid == 1):",
              "explanationIfWrong": "Unnecessary and unidiomatic."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, if boolean_var: is clean, concise, and standard PEP 8 style."
        },
        "retestMcq": {
          "id": "q-2.2-5-v2",
          "question": "What is the output of:\nis_admin = False\nif is_admin:\n    print(\"Admin panel\")\nelse:\n    print(\"User view\")",
          "options": [
            {
              "id": "A",
              "text": "User view (since is_admin is False, else executes)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Admin panel",
              "explanationIfWrong": "is_admin is False, so the if block is skipped."
            },
            {
              "id": "C",
              "text": "Admin panel followed by User view",
              "explanationIfWrong": "Only one branch in an if-else executes."
            },
            {
              "id": "D",
              "text": "Nothing",
              "explanationIfWrong": "The else branch outputs \"User view\"."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The condition evaluates to False, branching to the else block."
        },
        "questionPool": [
          {
            "id": "q-2.2-5-v1",
            "question": "If is_valid is a boolean variable holding True, which is the idiomatic Python way to check it?",
            "options": [
              {
                "id": "A",
                "text": "if is_valid: (direct boolean evaluation)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "if is_valid == True: (redundant comparison)",
                "explanationIfWrong": "While legal, writing == True is considered redundant in Python."
              },
              {
                "id": "C",
                "text": "if is_valid.isTrue():",
                "explanationIfWrong": "No such method exists in Python."
              },
              {
                "id": "D",
                "text": "if bool(is_valid == 1):",
                "explanationIfWrong": "Unnecessary and unidiomatic."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, if boolean_var: is clean, concise, and standard PEP 8 style."
          },
          {
            "id": "q-2.2-5-v2",
            "question": "What is the output of:\nis_admin = False\nif is_admin:\n    print(\"Admin panel\")\nelse:\n    print(\"User view\")",
            "options": [
              {
                "id": "A",
                "text": "User view (since is_admin is False, else executes)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Admin panel",
                "explanationIfWrong": "is_admin is False, so the if block is skipped."
              },
              {
                "id": "C",
                "text": "Admin panel followed by User view",
                "explanationIfWrong": "Only one branch in an if-else executes."
              },
              {
                "id": "D",
                "text": "Nothing",
                "explanationIfWrong": "The else branch outputs \"User view\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The condition evaluates to False, branching to the else block."
          },
          {
            "id": "q-2.2-5-v3",
            "question": "How do you check if a boolean variable is_finished is False using clean Python syntax?",
            "options": [
              {
                "id": "A",
                "text": "if not is_finished:",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "if is_finished == False:",
                "explanationIfWrong": "Writing == False is functional but considered unidiomatic in Python."
              },
              {
                "id": "C",
                "text": "if !is_finished:",
                "explanationIfWrong": "! is not the NOT operator in Python; Python uses the word \"not\"."
              },
              {
                "id": "D",
                "text": "if is_finished != True:",
                "explanationIfWrong": "if not is_finished is the standard Python approach."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Using the not keyword (if not is_finished:) is the standard Python idiom."
          }
        ]
      }
    ]
  },
  {
    "id": "2-3-combining-conditions",
    "number": "2.3",
    "title": "Combining Conditions with Logical Operators",
    "subtitle": "Master and, or, not, chained range comparisons, and precedence rules.",
    "readTime": "25 min",
    "objectives": [
      "Combine multiple conditions using the and operator",
      "Use the or operator for alternative criteria",
      "Invert boolean conditions using not",
      "Understand logical operator precedence (not > and > or)",
      "Write natural chained comparisons (e.g. 10 <= x <= 50)",
      "Group compound boolean expressions with parentheses"
    ],
    "theoryBlocks": [
      {
        "heading": "The and Operator",
        "text": "The and operator combines two conditions and evaluates to True ONLY if BOTH conditions are True. If either the left side or the right side is False, the whole expression is False.",
        "codeSnippet": "age = 22\nhas_license = True\n\nif age >= 18 and has_license:\n    print(\"You can rent a car\")",
        "terminalOutput": "You can rent a car",
        "mcq": {
          "id": "q-2.3-0-v1",
          "question": "What is the evaluated result of True and False in Python?",
          "options": [
            {
              "id": "A",
              "text": "False (both operands must be True for and to return True)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "True",
              "explanationIfWrong": "The presence of False makes the and result False."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "Logical operators return boolean values."
            },
            {
              "id": "D",
              "text": "TypeError",
              "explanationIfWrong": "Boolean logic is fully supported in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "and requires all operands to be True; a single False makes the result False."
        },
        "retestMcq": {
          "id": "q-2.3-0-v2",
          "question": "Consider: x = 12, y = 5. What does (x > 10 and y < 3) evaluate to?",
          "options": [
            {
              "id": "A",
              "text": "False (12 > 10 is True, but 5 < 3 is False)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "True",
              "explanationIfWrong": "Both sides must be True; y < 3 fails."
            },
            {
              "id": "C",
              "text": "12",
              "explanationIfWrong": "Comparison with and returns a boolean value."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "The syntax and types are completely valid."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since 5 < 3 is False, True and False yields False."
        },
        "questionPool": [
          {
            "id": "q-2.3-0-v1",
            "question": "What is the evaluated result of True and False in Python?",
            "options": [
              {
                "id": "A",
                "text": "False (both operands must be True for and to return True)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "True",
                "explanationIfWrong": "The presence of False makes the and result False."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "Logical operators return boolean values."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "Boolean logic is fully supported in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "and requires all operands to be True; a single False makes the result False."
          },
          {
            "id": "q-2.3-0-v2",
            "question": "Consider: x = 12, y = 5. What does (x > 10 and y < 3) evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "False (12 > 10 is True, but 5 < 3 is False)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "True",
                "explanationIfWrong": "Both sides must be True; y < 3 fails."
              },
              {
                "id": "C",
                "text": "12",
                "explanationIfWrong": "Comparison with and returns a boolean value."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "The syntax and types are completely valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since 5 < 3 is False, True and False yields False."
          },
          {
            "id": "q-2.3-0-v3",
            "question": "When will an expression with three and operations: A and B and C evaluate to True?",
            "options": [
              {
                "id": "A",
                "text": "Only when A, B, and C are all True simultaneously",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "If at least one of them is True",
                "explanationIfWrong": "That is the behavior of or, not and."
              },
              {
                "id": "C",
                "text": "If two out of three are True",
                "explanationIfWrong": "All operands must be True."
              },
              {
                "id": "D",
                "text": "Whenever A is True",
                "explanationIfWrong": "B and C must also be True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In a chain of and operators, every single condition must be True."
          }
        ]
      },
      {
        "heading": "The or Operator",
        "text": "The or operator evaluates to True if AT LEAST ONE of the conditions is True. It only evaluates to False when BOTH conditions are False.",
        "codeSnippet": "day = \"Sunday\"\nif day == \"Saturday\" or day == \"Sunday\":\n    print(\"It is the weekend!\")",
        "terminalOutput": "It is the weekend!",
        "mcq": {
          "id": "q-2.3-1-v1",
          "question": "What is the evaluated result of False or True in Python?",
          "options": [
            {
              "id": "A",
              "text": "True (or needs only one True condition to evaluate to True)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "False",
              "explanationIfWrong": "or only yields False when both sides are False."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "or returns a boolean value."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "Boolean or operations are valid."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The or operator returns True as long as at least one operand is True."
        },
        "retestMcq": {
          "id": "q-2.3-1-v2",
          "question": "Under what circumstance does an or expression: condition_1 or condition_2 evaluate to False?",
          "options": [
            {
              "id": "A",
              "text": "Only when BOTH condition_1 AND condition_2 are False",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "When condition_1 is True and condition_2 is False",
              "explanationIfWrong": "That evaluates to True."
            },
            {
              "id": "C",
              "text": "Whenever condition_1 is False",
              "explanationIfWrong": "If condition_2 is True, the result is True."
            },
            {
              "id": "D",
              "text": "It can never be False",
              "explanationIfWrong": "False or False produces False."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "An or expression is False if and only if both sides evaluate to False."
        },
        "questionPool": [
          {
            "id": "q-2.3-1-v1",
            "question": "What is the evaluated result of False or True in Python?",
            "options": [
              {
                "id": "A",
                "text": "True (or needs only one True condition to evaluate to True)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "or only yields False when both sides are False."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "or returns a boolean value."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "Boolean or operations are valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The or operator returns True as long as at least one operand is True."
          },
          {
            "id": "q-2.3-1-v2",
            "question": "Under what circumstance does an or expression: condition_1 or condition_2 evaluate to False?",
            "options": [
              {
                "id": "A",
                "text": "Only when BOTH condition_1 AND condition_2 are False",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "When condition_1 is True and condition_2 is False",
                "explanationIfWrong": "That evaluates to True."
              },
              {
                "id": "C",
                "text": "Whenever condition_1 is False",
                "explanationIfWrong": "If condition_2 is True, the result is True."
              },
              {
                "id": "D",
                "text": "It can never be False",
                "explanationIfWrong": "False or False produces False."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An or expression is False if and only if both sides evaluate to False."
          },
          {
            "id": "q-2.3-1-v3",
            "question": "What is the output of print(10 > 20 or 5 < 10)?",
            "options": [
              {
                "id": "A",
                "text": "True (10 > 20 is False, but 5 < 10 is True)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "5 < 10 is True, satisfying the or operator."
              },
              {
                "id": "C",
                "text": "5",
                "explanationIfWrong": "Boolean logic returns True or False."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "True is output."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "False or True evaluates to True."
          }
        ]
      },
      {
        "heading": "The not Operator",
        "text": "The not operator inverts the boolean value: not True becomes False, and not False becomes True. It is placed immediately before the condition.",
        "codeSnippet": "is_raining = False\nif not is_raining:\n    print(\"Let's go for a walk\")",
        "terminalOutput": "Let's go for a walk",
        "mcq": {
          "id": "q-2.3-2-v1",
          "question": "What does the expression not (5 > 2) evaluate to?",
          "options": [
            {
              "id": "A",
              "text": "False (since 5 > 2 is True, not inverts it to False)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "True",
              "explanationIfWrong": "5 > 2 is True, and not True is False."
            },
            {
              "id": "C",
              "text": "5",
              "explanationIfWrong": "not produces a boolean value."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "Inverting boolean comparisons is standard."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "5 > 2 is True; applying not produces False."
        },
        "retestMcq": {
          "id": "q-2.3-2-v2",
          "question": "What is the result of not False in Python?",
          "options": [
            {
              "id": "A",
              "text": "True",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "False",
              "explanationIfWrong": "not inverts False to True."
            },
            {
              "id": "C",
              "text": "0",
              "explanationIfWrong": "The boolean literal True is returned."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "The result is True."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The not operator flips False into True."
        },
        "questionPool": [
          {
            "id": "q-2.3-2-v1",
            "question": "What does the expression not (5 > 2) evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "False (since 5 > 2 is True, not inverts it to False)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "True",
                "explanationIfWrong": "5 > 2 is True, and not True is False."
              },
              {
                "id": "C",
                "text": "5",
                "explanationIfWrong": "not produces a boolean value."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "Inverting boolean comparisons is standard."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "5 > 2 is True; applying not produces False."
          },
          {
            "id": "q-2.3-2-v2",
            "question": "What is the result of not False in Python?",
            "options": [
              {
                "id": "A",
                "text": "True",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "not inverts False to True."
              },
              {
                "id": "C",
                "text": "0",
                "explanationIfWrong": "The boolean literal True is returned."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The result is True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The not operator flips False into True."
          },
          {
            "id": "q-2.3-2-v3",
            "question": "What does not not True evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "True (double negation returns to the original value)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "First not flips True to False, second not flips it back to True."
              },
              {
                "id": "C",
                "text": "SyntaxError",
                "explanationIfWrong": "Chaining not operators is completely valid in Python."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The boolean True is returned."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "not True is False, and not False is True."
          }
        ]
      },
      {
        "heading": "Operator Precedence: not > and > or",
        "text": "Python evaluates logical operators in strict order of priority: 1) not (highest), 2) and, 3) or (lowest). Always use parentheses () to clarify complex logic and prevent subtle precedence bugs.",
        "codeSnippet": "# \"and\" evaluates before \"or\":\n# True or (False and False) -> True or False -> True\nresult = True or False and False\nprint(result)",
        "terminalOutput": "True",
        "mcq": {
          "id": "q-2.3-3-v1",
          "question": "What is the correct order of precedence for Python's logical operators (highest priority first)?",
          "options": [
            {
              "id": "A",
              "text": "not > and > or",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "or > and > not",
              "explanationIfWrong": "not has the highest priority, or has the lowest."
            },
            {
              "id": "C",
              "text": "and > or > not",
              "explanationIfWrong": "not has highest priority."
            },
            {
              "id": "D",
              "text": "All three have identical priority and evaluate left to right",
              "explanationIfWrong": "Logical operators have distinct precedence."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "not is evaluated first, then and, and finally or."
        },
        "retestMcq": {
          "id": "q-2.3-3-v2",
          "question": "What does False and False or True evaluate to?",
          "options": [
            {
              "id": "A",
              "text": "True (False and False evaluates to False, then False or True evaluates to True)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "False",
              "explanationIfWrong": "and binds first: False and False = False. Then False or True = True."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "Produces a boolean."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "Valid boolean expression."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "and takes precedence: (False and False) is False. Then False or True is True."
        },
        "questionPool": [
          {
            "id": "q-2.3-3-v1",
            "question": "What is the correct order of precedence for Python's logical operators (highest priority first)?",
            "options": [
              {
                "id": "A",
                "text": "not > and > or",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "or > and > not",
                "explanationIfWrong": "not has the highest priority, or has the lowest."
              },
              {
                "id": "C",
                "text": "and > or > not",
                "explanationIfWrong": "not has highest priority."
              },
              {
                "id": "D",
                "text": "All three have identical priority and evaluate left to right",
                "explanationIfWrong": "Logical operators have distinct precedence."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "not is evaluated first, then and, and finally or."
          },
          {
            "id": "q-2.3-3-v2",
            "question": "What does False and False or True evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "True (False and False evaluates to False, then False or True evaluates to True)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "and binds first: False and False = False. Then False or True = True."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "Produces a boolean."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "Valid boolean expression."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "and takes precedence: (False and False) is False. Then False or True is True."
          },
          {
            "id": "q-2.3-3-v3",
            "question": "How can you force the or operator to evaluate before the and operator in an expression?",
            "options": [
              {
                "id": "A",
                "text": "Enclose the or condition in parentheses ( )",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Place the or condition at the very end of the line",
                "explanationIfWrong": "Placement does not override operator precedence rules; parentheses do."
              },
              {
                "id": "C",
                "text": "Write OR in capital letters",
                "explanationIfWrong": "Python keywords must be lowercase."
              },
              {
                "id": "D",
                "text": "It is impossible to override precedence in Python",
                "explanationIfWrong": "Parentheses always override operator precedence."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Parentheses () have highest priority and explicitly group expressions."
          }
        ]
      },
      {
        "heading": "Chained Comparison Operators",
        "text": "Python allows chained comparisons like in mathematics. Instead of writing age >= 18 and age <= 65, you can write 18 <= age <= 65. Python evaluates both checks automatically.",
        "codeSnippet": "age = 25\nif 18 <= age <= 65:\n    print(\"Working age adult\")",
        "terminalOutput": "Working age adult",
        "mcq": {
          "id": "q-2.3-4-v1",
          "question": "What does the chained comparison 10 <= x <= 20 check in Python?",
          "options": [
            {
              "id": "A",
              "text": "Whether x is between 10 and 20 (inclusive of both 10 and 20)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Whether x equals 10 or 20 only",
              "explanationIfWrong": "It checks the continuous range from 10 to 20."
            },
            {
              "id": "C",
              "text": "It causes a SyntaxError in Python",
              "explanationIfWrong": "Chained comparisons are fully supported in Python."
            },
            {
              "id": "D",
              "text": "Whether 10 is less than 20, ignoring x",
              "explanationIfWrong": "x is tested against both boundaries."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "10 <= x <= 20 is shorthand for x >= 10 and x <= 20."
        },
        "retestMcq": {
          "id": "q-2.3-4-v2",
          "question": "If score = 85, what does 80 <= score < 90 evaluate to?",
          "options": [
            {
              "id": "A",
              "text": "True (85 is >= 80 and strictly < 90)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "False",
              "explanationIfWrong": "85 satisfies both 85 >= 80 and 85 < 90."
            },
            {
              "id": "C",
              "text": "85",
              "explanationIfWrong": "Returns a boolean."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "Returns True."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "85 satisfies both sides of the chained inequality."
        },
        "questionPool": [
          {
            "id": "q-2.3-4-v1",
            "question": "What does the chained comparison 10 <= x <= 20 check in Python?",
            "options": [
              {
                "id": "A",
                "text": "Whether x is between 10 and 20 (inclusive of both 10 and 20)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Whether x equals 10 or 20 only",
                "explanationIfWrong": "It checks the continuous range from 10 to 20."
              },
              {
                "id": "C",
                "text": "It causes a SyntaxError in Python",
                "explanationIfWrong": "Chained comparisons are fully supported in Python."
              },
              {
                "id": "D",
                "text": "Whether 10 is less than 20, ignoring x",
                "explanationIfWrong": "x is tested against both boundaries."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "10 <= x <= 20 is shorthand for x >= 10 and x <= 20."
          },
          {
            "id": "q-2.3-4-v2",
            "question": "If score = 85, what does 80 <= score < 90 evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "True (85 is >= 80 and strictly < 90)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "85 satisfies both 85 >= 80 and 85 < 90."
              },
              {
                "id": "C",
                "text": "85",
                "explanationIfWrong": "Returns a boolean."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "Returns True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "85 satisfies both sides of the chained inequality."
          },
          {
            "id": "q-2.3-4-v3",
            "question": "Is writing 1 < 2 < 3 < 4 legal syntax in Python?",
            "options": [
              {
                "id": "A",
                "text": "Yes, it checks if all comparisons are True in sequence and evaluates to True",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "No, Python only allows at most 2 comparison operators per line",
                "explanationIfWrong": "Python allows chaining multiple comparison operators."
              },
              {
                "id": "C",
                "text": "It is a SyntaxError",
                "explanationIfWrong": "Chained comparisons are valid in Python."
              },
              {
                "id": "D",
                "text": "It evaluates to 4",
                "explanationIfWrong": "It evaluates to boolean True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python evaluates chained comparisons as 1 < 2 and 2 < 3 and 3 < 4."
          }
        ]
      },
      {
        "heading": "Grouping Complex Conditions with Parentheses",
        "text": "In real-world applications with multiple business rules, grouping conditions with parentheses makes code readable, unambiguous, and safe from logic bugs.",
        "codeSnippet": "is_admin = False\nhas_pass = True\nis_banned = False\n\nif (is_admin or has_pass) and not is_banned:\n    print(\"Access granted\")",
        "terminalOutput": "Access granted",
        "mcq": {
          "id": "q-2.3-5-v1",
          "question": "Why should programmers use parentheses in compound boolean expressions like (A or B) and C?",
          "options": [
            {
              "id": "A",
              "text": "To ensure explicit execution order and prevent subtle operator precedence bugs",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Because Python requires parentheses around all if conditions",
              "explanationIfWrong": "Parentheses around entire if conditions are optional in Python."
            },
            {
              "id": "C",
              "text": "To make the program execute twice as fast",
              "explanationIfWrong": "Parentheses clarify logic; they do not alter speed."
            },
            {
              "id": "D",
              "text": "To convert booleans into strings",
              "explanationIfWrong": "Parentheses only affect order of evaluation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Parentheses make the intended logic explicit and prevent precedence mistakes."
        },
        "retestMcq": {
          "id": "q-2.3-5-v2",
          "question": "Consider: is_vip = True, has_ticket = False, on_guest_list = True. Does (is_vip or has_ticket) and on_guest_list evaluate to True?",
          "options": [
            {
              "id": "A",
              "text": "Yes (is_vip or has_ticket is True, and on_guest_list is True)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "No, because has_ticket is False",
              "explanationIfWrong": "has_ticket is inside an or with is_vip (True), so the left side is True."
            },
            {
              "id": "C",
              "text": "It produces a TypeError",
              "explanationIfWrong": "All operands are booleans."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "It evaluates to True."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "(True or False) is True. True and True is True."
        },
        "questionPool": [
          {
            "id": "q-2.3-5-v1",
            "question": "Why should programmers use parentheses in compound boolean expressions like (A or B) and C?",
            "options": [
              {
                "id": "A",
                "text": "To ensure explicit execution order and prevent subtle operator precedence bugs",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Because Python requires parentheses around all if conditions",
                "explanationIfWrong": "Parentheses around entire if conditions are optional in Python."
              },
              {
                "id": "C",
                "text": "To make the program execute twice as fast",
                "explanationIfWrong": "Parentheses clarify logic; they do not alter speed."
              },
              {
                "id": "D",
                "text": "To convert booleans into strings",
                "explanationIfWrong": "Parentheses only affect order of evaluation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Parentheses make the intended logic explicit and prevent precedence mistakes."
          },
          {
            "id": "q-2.3-5-v2",
            "question": "Consider: is_vip = True, has_ticket = False, on_guest_list = True. Does (is_vip or has_ticket) and on_guest_list evaluate to True?",
            "options": [
              {
                "id": "A",
                "text": "Yes (is_vip or has_ticket is True, and on_guest_list is True)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "No, because has_ticket is False",
                "explanationIfWrong": "has_ticket is inside an or with is_vip (True), so the left side is True."
              },
              {
                "id": "C",
                "text": "It produces a TypeError",
                "explanationIfWrong": "All operands are booleans."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "It evaluates to True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "(True or False) is True. True and True is True."
          },
          {
            "id": "q-2.3-5-v3",
            "question": "What is the value of not (True and False)?",
            "options": [
              {
                "id": "A",
                "text": "True (True and False is False, and not False is True)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "Parentheses evaluate first to False; not False is True."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "Produces a boolean."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "Standard boolean logic."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Inside parentheses: True and False = False. Inverting with not yields True."
          }
        ]
      }
    ]
  },
  {
    "id": "2-4-simple-loops",
    "number": "2.4",
    "title": "Simple Loops & while Statements",
    "subtitle": "Master while loops, infinite loops, break, continue, loop counters, and accumulators.",
    "readTime": "25 min",
    "objectives": [
      "Understand the while loop repeating mechanism",
      "Use while True: for continuous execution",
      "Terminate loops cleanly with the break statement",
      "Skip loop iterations using the continue statement",
      "Manage loop counter variables and incrementing",
      "Implement accumulator patterns for running totals"
    ],
    "theoryBlocks": [
      {
        "heading": "The while Loop Concept",
        "text": "A while loop repeatedly executes its indented code block as long as its condition remains True. Before each repetition (iteration), Python checks the condition. Once the condition becomes False, the loop terminates and execution continues below.",
        "codeSnippet": "count = 1\nwhile count <= 3:\n    print(\"Step\", count)\n    count = count + 1\nprint(\"Loop finished!\")",
        "terminalOutput": "Step 1\nStep 2\nStep 3\nLoop finished!",
        "mcq": {
          "id": "q-2.4-0-v1",
          "question": "How long does a while loop continue repeating its code block?",
          "options": [
            {
              "id": "A",
              "text": "As long as its condition expression evaluates to True",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Exactly 10 times always",
              "explanationIfWrong": "A while loop depends entirely on its condition, not a fixed count."
            },
            {
              "id": "C",
              "text": "Until the computer runs out of memory",
              "explanationIfWrong": "It stops as soon as the condition is False or break is called."
            },
            {
              "id": "D",
              "text": "Only once",
              "explanationIfWrong": "It repeats as long as the condition remains True."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A while loop checks its condition before every iteration and stops when it is False."
        },
        "retestMcq": {
          "id": "q-2.4-0-v2",
          "question": "What happens if a while loop's condition is already False before the loop even starts?",
          "options": [
            {
              "id": "A",
              "text": "The indented block is never executed at all; Python moves straight to the next line",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "The block executes exactly once anyway",
              "explanationIfWrong": "A while loop tests its condition before the first run."
            },
            {
              "id": "C",
              "text": "Python throws a RuntimeError",
              "explanationIfWrong": "A False condition simply skips the loop peacefully."
            },
            {
              "id": "D",
              "text": "The computer restarts",
              "explanationIfWrong": "It is normal Python control flow."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because the condition is checked first, a False condition skips the loop entirely."
        },
        "questionPool": [
          {
            "id": "q-2.4-0-v1",
            "question": "How long does a while loop continue repeating its code block?",
            "options": [
              {
                "id": "A",
                "text": "As long as its condition expression evaluates to True",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Exactly 10 times always",
                "explanationIfWrong": "A while loop depends entirely on its condition, not a fixed count."
              },
              {
                "id": "C",
                "text": "Until the computer runs out of memory",
                "explanationIfWrong": "It stops as soon as the condition is False or break is called."
              },
              {
                "id": "D",
                "text": "Only once",
                "explanationIfWrong": "It repeats as long as the condition remains True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A while loop checks its condition before every iteration and stops when it is False."
          },
          {
            "id": "q-2.4-0-v2",
            "question": "What happens if a while loop's condition is already False before the loop even starts?",
            "options": [
              {
                "id": "A",
                "text": "The indented block is never executed at all; Python moves straight to the next line",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "The block executes exactly once anyway",
                "explanationIfWrong": "A while loop tests its condition before the first run."
              },
              {
                "id": "C",
                "text": "Python throws a RuntimeError",
                "explanationIfWrong": "A False condition simply skips the loop peacefully."
              },
              {
                "id": "D",
                "text": "The computer restarts",
                "explanationIfWrong": "It is normal Python control flow."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because the condition is checked first, a False condition skips the loop entirely."
          },
          {
            "id": "q-2.4-0-v3",
            "question": "How many times will this loop print \"Hi\"?\nn = 0\nwhile n < 2:\n    print(\"Hi\")\n    n = n + 1",
            "options": [
              {
                "id": "A",
                "text": "2 times (when n is 0, and when n is 1)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "1 time",
                "explanationIfWrong": "n starts at 0, increments to 1, then increments to 2."
              },
              {
                "id": "C",
                "text": "3 times",
                "explanationIfWrong": "When n reaches 2, 2 < 2 is False, so it stops."
              },
              {
                "id": "D",
                "text": "Infinite times",
                "explanationIfWrong": "n is incremented each cycle, stopping at 2."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "n=0 (prints), n=1 (prints), n=2 (2 < 2 is False, terminates) -> total 2 times."
          }
        ]
      },
      {
        "heading": "Infinite Loops and while True:",
        "text": "An infinite loop occurs when the condition never becomes False. In University of Helsinki's curriculum, writing while True: is a standard design pattern for interactive programs, which continue looping until a break statement is triggered by user action.",
        "codeSnippet": "# while True creates an intentional loop\n# that runs until a break condition is met\nwhile True:\n    text = \"stop\" # simulated input\n    if text == \"stop\":\n        print(\"Exiting loop...\")\n        break",
        "terminalOutput": "Exiting loop...",
        "mcq": {
          "id": "q-2.4-1-v1",
          "question": "What is an \"infinite loop\" in computer programming?",
          "options": [
            {
              "id": "A",
              "text": "A loop whose condition never becomes False and has no break, repeating indefinitely",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A loop that calculates infinity",
              "explanationIfWrong": "It refers to execution repetition that does not stop."
            },
            {
              "id": "C",
              "text": "A loop with a syntax error",
              "explanationIfWrong": "The syntax is completely valid."
            },
            {
              "id": "D",
              "text": "A loop that finishes in 0 seconds",
              "explanationIfWrong": "It never finishes on its own."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "An infinite loop keeps running endlessly because its condition remains permanently True."
        },
        "retestMcq": {
          "id": "q-2.4-1-v2",
          "question": "Why do programmers intentionally write while True: in Python applications?",
          "options": [
            {
              "id": "A",
              "text": "To keep an interactive program or game loop running until a specific exit condition triggers break",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Because while loops cannot accept variables as conditions",
              "explanationIfWrong": "while loops can accept any boolean condition."
            },
            {
              "id": "C",
              "text": "To bypass Python's indentation rules",
              "explanationIfWrong": "Indentation is always required."
            },
            {
              "id": "D",
              "text": "To make functions return True automatically",
              "explanationIfWrong": "while True is for loop control."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "while True: is the standard pattern for interactive loops where exit conditions are handled inside."
        },
        "questionPool": [
          {
            "id": "q-2.4-1-v1",
            "question": "What is an \"infinite loop\" in computer programming?",
            "options": [
              {
                "id": "A",
                "text": "A loop whose condition never becomes False and has no break, repeating indefinitely",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "A loop that calculates infinity",
                "explanationIfWrong": "It refers to execution repetition that does not stop."
              },
              {
                "id": "C",
                "text": "A loop with a syntax error",
                "explanationIfWrong": "The syntax is completely valid."
              },
              {
                "id": "D",
                "text": "A loop that finishes in 0 seconds",
                "explanationIfWrong": "It never finishes on its own."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An infinite loop keeps running endlessly because its condition remains permanently True."
          },
          {
            "id": "q-2.4-1-v2",
            "question": "Why do programmers intentionally write while True: in Python applications?",
            "options": [
              {
                "id": "A",
                "text": "To keep an interactive program or game loop running until a specific exit condition triggers break",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Because while loops cannot accept variables as conditions",
                "explanationIfWrong": "while loops can accept any boolean condition."
              },
              {
                "id": "C",
                "text": "To bypass Python's indentation rules",
                "explanationIfWrong": "Indentation is always required."
              },
              {
                "id": "D",
                "text": "To make functions return True automatically",
                "explanationIfWrong": "while True is for loop control."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "while True: is the standard pattern for interactive loops where exit conditions are handled inside."
          },
          {
            "id": "q-2.4-1-v3",
            "question": "What keyboard shortcut stops an infinite loop running in a standard terminal console?",
            "options": [
              {
                "id": "A",
                "text": "Ctrl + C (KeyboardInterrupt)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Ctrl + S",
                "explanationIfWrong": "Ctrl + S freezes screen output or saves."
              },
              {
                "id": "C",
                "text": "Alt + F4 only",
                "explanationIfWrong": "Ctrl + C sends an interrupt signal to the process."
              },
              {
                "id": "D",
                "text": "Esc key",
                "explanationIfWrong": "Ctrl + C is the universal terminal interrupt."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Ctrl + C sends a SIGINT (KeyboardInterrupt) signal to terminate running terminal processes."
          }
        ]
      },
      {
        "heading": "The break Statement",
        "text": "The break command immediately stops execution of the current loop and jumps straight to the line after the loop block. It is typically triggered inside an if statement.",
        "codeSnippet": "while True:\n    number = 5\n    if number == 5:\n        print(\"Target reached!\")\n        break\nprint(\"Code continues here.\")",
        "terminalOutput": "Target reached!\nCode continues here.",
        "mcq": {
          "id": "q-2.4-2-v1",
          "question": "What does the break statement do when executed inside a loop?",
          "options": [
            {
              "id": "A",
              "text": "It immediately terminates the loop and jumps to the code following the loop",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "It pauses the loop for 5 seconds",
              "explanationIfWrong": "time.sleep() pauses; break exits immediately."
            },
            {
              "id": "C",
              "text": "It restarts the loop from iteration 1",
              "explanationIfWrong": "break leaves the loop permanently."
            },
            {
              "id": "D",
              "text": "It terminates the entire operating system",
              "explanationIfWrong": "break only exits the enclosing loop."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "break forces an immediate exit from the innermost loop."
        },
        "retestMcq": {
          "id": "q-2.4-2-v2",
          "question": "Consider:\nx = 0\nwhile True:\n    x = x + 1\n    if x == 3:\n        break\nprint(x)\nWhat is printed?",
          "options": [
            {
              "id": "A",
              "text": "3",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "1",
              "explanationIfWrong": "x increments until reaching 3."
            },
            {
              "id": "C",
              "text": "4",
              "explanationIfWrong": "The loop breaks as soon as x equals 3."
            },
            {
              "id": "D",
              "text": "Infinite loop",
              "explanationIfWrong": "The break statement terminates the loop when x is 3."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "When x becomes 3, the if condition is satisfied, break triggers, and print(x) displays 3."
        },
        "questionPool": [
          {
            "id": "q-2.4-2-v1",
            "question": "What does the break statement do when executed inside a loop?",
            "options": [
              {
                "id": "A",
                "text": "It immediately terminates the loop and jumps to the code following the loop",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It pauses the loop for 5 seconds",
                "explanationIfWrong": "time.sleep() pauses; break exits immediately."
              },
              {
                "id": "C",
                "text": "It restarts the loop from iteration 1",
                "explanationIfWrong": "break leaves the loop permanently."
              },
              {
                "id": "D",
                "text": "It terminates the entire operating system",
                "explanationIfWrong": "break only exits the enclosing loop."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "break forces an immediate exit from the innermost loop."
          },
          {
            "id": "q-2.4-2-v2",
            "question": "Consider:\nx = 0\nwhile True:\n    x = x + 1\n    if x == 3:\n        break\nprint(x)\nWhat is printed?",
            "options": [
              {
                "id": "A",
                "text": "3",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "1",
                "explanationIfWrong": "x increments until reaching 3."
              },
              {
                "id": "C",
                "text": "4",
                "explanationIfWrong": "The loop breaks as soon as x equals 3."
              },
              {
                "id": "D",
                "text": "Infinite loop",
                "explanationIfWrong": "The break statement terminates the loop when x is 3."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When x becomes 3, the if condition is satisfied, break triggers, and print(x) displays 3."
          },
          {
            "id": "q-2.4-2-v3",
            "question": "Does the break statement exit only the current loop or all surrounding code in a file?",
            "options": [
              {
                "id": "A",
                "text": "It only exits the innermost enclosing loop where it is placed",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It shuts down the entire Python program",
                "explanationIfWrong": "sys.exit() shuts down the program; break only leaves the loop."
              },
              {
                "id": "C",
                "text": "It deletes the variable values",
                "explanationIfWrong": "Variables retain their values."
              },
              {
                "id": "D",
                "text": "It only exits if statements, not loops",
                "explanationIfWrong": "break is specifically a loop control statement."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "break strictly exits the loop construct it is currently situated in."
          }
        ]
      },
      {
        "heading": "The continue Statement",
        "text": "The continue statement skips the rest of the code in the CURRENT iteration and jumps straight back to the loop header to begin the next iteration. Unlike break, it does NOT leave the loop.",
        "codeSnippet": "num = 0\nwhile num < 4:\n    num = num + 1\n    if num == 2:\n        continue # Skip printing 2\n    print(num)",
        "terminalOutput": "1\n3\n4",
        "mcq": {
          "id": "q-2.4-3-v1",
          "question": "What is the key difference between break and continue in a Python loop?",
          "options": [
            {
              "id": "A",
              "text": "break exits the loop entirely, while continue skips only the rest of the current iteration",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "continue stops the loop, while break skips one iteration",
              "explanationIfWrong": "This is the exact opposite."
            },
            {
              "id": "C",
              "text": "They do the exact same thing",
              "explanationIfWrong": "break terminates the loop; continue advances to next iteration."
            },
            {
              "id": "D",
              "text": "continue can only be used with numbers",
              "explanationIfWrong": "continue works in any loop regardless of data."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "break terminates the loop; continue jumps directly to the next iteration."
        },
        "retestMcq": {
          "id": "q-2.4-3-v2",
          "question": "In the code:\ni = 0\nwhile i < 3:\n    i = i + 1\n    if i == 2:\n        continue\n    print(i)\nWhich number will NOT be printed?",
          "options": [
            {
              "id": "A",
              "text": "2 (the continue skips the print call when i is 2)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "1",
              "explanationIfWrong": "1 is printed."
            },
            {
              "id": "C",
              "text": "3",
              "explanationIfWrong": "3 is printed."
            },
            {
              "id": "D",
              "text": "All numbers are printed",
              "explanationIfWrong": "continue bypasses the print statement for i == 2."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "When i == 2, continue skips print(i) and moves straight to i = 3."
        },
        "questionPool": [
          {
            "id": "q-2.4-3-v1",
            "question": "What is the key difference between break and continue in a Python loop?",
            "options": [
              {
                "id": "A",
                "text": "break exits the loop entirely, while continue skips only the rest of the current iteration",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "continue stops the loop, while break skips one iteration",
                "explanationIfWrong": "This is the exact opposite."
              },
              {
                "id": "C",
                "text": "They do the exact same thing",
                "explanationIfWrong": "break terminates the loop; continue advances to next iteration."
              },
              {
                "id": "D",
                "text": "continue can only be used with numbers",
                "explanationIfWrong": "continue works in any loop regardless of data."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "break terminates the loop; continue jumps directly to the next iteration."
          },
          {
            "id": "q-2.4-3-v2",
            "question": "In the code:\ni = 0\nwhile i < 3:\n    i = i + 1\n    if i == 2:\n        continue\n    print(i)\nWhich number will NOT be printed?",
            "options": [
              {
                "id": "A",
                "text": "2 (the continue skips the print call when i is 2)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "1",
                "explanationIfWrong": "1 is printed."
              },
              {
                "id": "C",
                "text": "3",
                "explanationIfWrong": "3 is printed."
              },
              {
                "id": "D",
                "text": "All numbers are printed",
                "explanationIfWrong": "continue bypasses the print statement for i == 2."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When i == 2, continue skips print(i) and moves straight to i = 3."
          },
          {
            "id": "q-2.4-3-v3",
            "question": "What happens to any statements located below a continue inside the same iteration?",
            "options": [
              {
                "id": "A",
                "text": "They are completely skipped for that iteration",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "They execute twice",
                "explanationIfWrong": "Execution jumps immediately back to the loop condition."
              },
              {
                "id": "C",
                "text": "They trigger a SyntaxError",
                "explanationIfWrong": "continue is valid Python syntax."
              },
              {
                "id": "D",
                "text": "They run in reverse order",
                "explanationIfWrong": "They are simply skipped."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "continue immediately aborts the remainder of the current iteration."
          }
        ]
      },
      {
        "heading": "Loop Counters and Incrementing",
        "text": "A loop counter is a variable used to count how many times a loop has run. You must ensure the counter is updated (e.g. i = i + 1 or i += 1) inside the loop, otherwise the loop condition may never become False, creating an accidental infinite loop.",
        "codeSnippet": "i = 1\nwhile i <= 4:\n    print(\"Iteration:\", i)\n    i += 1 # Increment counter by 1",
        "terminalOutput": "Iteration: 1\nIteration: 2\nIteration: 3\nIteration: 4",
        "mcq": {
          "id": "q-2.4-4-v1",
          "question": "What shorthand operator in Python is equivalent to writing count = count + 1?",
          "options": [
            {
              "id": "A",
              "text": "count += 1",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "count++",
              "explanationIfWrong": "count++ exists in C/Java/JS, but is INVALID syntax in Python!"
            },
            {
              "id": "C",
              "text": "count =+ 1",
              "explanationIfWrong": "=+ assigns positive 1 to count, it does not increment."
            },
            {
              "id": "D",
              "text": "++count",
              "explanationIfWrong": "++count evaluates as +(+count), not incrementing."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "+= is Python's in-place addition operator; count++ does not exist in Python."
        },
        "retestMcq": {
          "id": "q-2.4-4-v2",
          "question": "What will happen if you forget to increment the counter variable inside a while count < 5: loop?",
          "options": [
            {
              "id": "A",
              "text": "An accidental infinite loop occurs because count never reaches 5",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Python increments it automatically for you",
              "explanationIfWrong": "while loops do not auto-increment variables; you must write it."
            },
            {
              "id": "C",
              "text": "The program raises a SyntaxError",
              "explanationIfWrong": "The syntax is valid; it simply never stops running."
            },
            {
              "id": "D",
              "text": "The loop executes exactly 5 times anyway",
              "explanationIfWrong": "Without updating count, the condition remains permanently True."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "If the counter is not updated, the condition never changes, trapping execution in an infinite loop."
        },
        "questionPool": [
          {
            "id": "q-2.4-4-v1",
            "question": "What shorthand operator in Python is equivalent to writing count = count + 1?",
            "options": [
              {
                "id": "A",
                "text": "count += 1",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "count++",
                "explanationIfWrong": "count++ exists in C/Java/JS, but is INVALID syntax in Python!"
              },
              {
                "id": "C",
                "text": "count =+ 1",
                "explanationIfWrong": "=+ assigns positive 1 to count, it does not increment."
              },
              {
                "id": "D",
                "text": "++count",
                "explanationIfWrong": "++count evaluates as +(+count), not incrementing."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "+= is Python's in-place addition operator; count++ does not exist in Python."
          },
          {
            "id": "q-2.4-4-v2",
            "question": "What will happen if you forget to increment the counter variable inside a while count < 5: loop?",
            "options": [
              {
                "id": "A",
                "text": "An accidental infinite loop occurs because count never reaches 5",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Python increments it automatically for you",
                "explanationIfWrong": "while loops do not auto-increment variables; you must write it."
              },
              {
                "id": "C",
                "text": "The program raises a SyntaxError",
                "explanationIfWrong": "The syntax is valid; it simply never stops running."
              },
              {
                "id": "D",
                "text": "The loop executes exactly 5 times anyway",
                "explanationIfWrong": "Without updating count, the condition remains permanently True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "If the counter is not updated, the condition never changes, trapping execution in an infinite loop."
          },
          {
            "id": "q-2.4-4-v3",
            "question": "What is the final value of x after this loop finishes?\nx = 0\nwhile x < 5:\n    x += 2",
            "options": [
              {
                "id": "A",
                "text": "6 (x takes values 0 -> 2 -> 4 -> 6, where 6 < 5 is False)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "5",
                "explanationIfWrong": "x increments by 2 each time: 0, 2, 4, 6."
              },
              {
                "id": "C",
                "text": "4",
                "explanationIfWrong": "When x is 4, 4 < 5 is True, so x increments to 6."
              },
              {
                "id": "D",
                "text": "8",
                "explanationIfWrong": "When x reaches 6, the loop terminates immediately."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "x starts at 0, increments to 2, 4, and then 6. At 6, 6 < 5 is False, so the loop exits with x = 6."
          }
        ]
      },
      {
        "heading": "The Accumulator Pattern (Totals and Summaries)",
        "text": "The accumulator pattern is used to calculate totals, counts, or averages across multiple loop cycles. A variable (such as total = 0) is created BEFORE the loop and updated inside each iteration.",
        "codeSnippet": "total = 0\nnumber = 1\nwhile number <= 3:\n    total += number # 1 + 2 + 3\n    number += 1\nprint(\"Total sum:\", total)",
        "terminalOutput": "Total sum: 6",
        "mcq": {
          "id": "q-2.4-5-v1",
          "question": "In the accumulator pattern, where must the accumulator variable (e.g. total = 0) be initialized?",
          "options": [
            {
              "id": "A",
              "text": "Outside, BEFORE the loop starts",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Inside the loop at the very top of each cycle",
              "explanationIfWrong": "Initializing inside the loop would reset the total to 0 on every iteration!"
            },
            {
              "id": "C",
              "text": "After the loop finishes",
              "explanationIfWrong": "You cannot add to a variable before it has been defined."
            },
            {
              "id": "D",
              "text": "It does not need to be initialized at all",
              "explanationIfWrong": "Python raises NameError if you add to an undefined variable."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The accumulator must be initialized before the loop so its value persists and accumulates across iterations."
        },
        "retestMcq": {
          "id": "q-2.4-5-v2",
          "question": "Consider the code:\nsum_vals = 0\ni = 1\nwhile i <= 4:\n    sum_vals += i\n    i += 1\nprint(sum_vals)\nWhat is the output?",
          "options": [
            {
              "id": "A",
              "text": "10 (1 + 2 + 3 + 4 = 10)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "4",
              "explanationIfWrong": "It sums all integers from 1 up to 4."
            },
            {
              "id": "C",
              "text": "14",
              "explanationIfWrong": "1 + 2 + 3 + 4 is 10."
            },
            {
              "id": "D",
              "text": "6",
              "explanationIfWrong": "The loop includes 4."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "sum_vals accumulates: 0 + 1 = 1, + 2 = 3, + 3 = 6, + 4 = 10."
        },
        "questionPool": [
          {
            "id": "q-2.4-5-v1",
            "question": "In the accumulator pattern, where must the accumulator variable (e.g. total = 0) be initialized?",
            "options": [
              {
                "id": "A",
                "text": "Outside, BEFORE the loop starts",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Inside the loop at the very top of each cycle",
                "explanationIfWrong": "Initializing inside the loop would reset the total to 0 on every iteration!"
              },
              {
                "id": "C",
                "text": "After the loop finishes",
                "explanationIfWrong": "You cannot add to a variable before it has been defined."
              },
              {
                "id": "D",
                "text": "It does not need to be initialized at all",
                "explanationIfWrong": "Python raises NameError if you add to an undefined variable."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The accumulator must be initialized before the loop so its value persists and accumulates across iterations."
          },
          {
            "id": "q-2.4-5-v2",
            "question": "Consider the code:\nsum_vals = 0\ni = 1\nwhile i <= 4:\n    sum_vals += i\n    i += 1\nprint(sum_vals)\nWhat is the output?",
            "options": [
              {
                "id": "A",
                "text": "10 (1 + 2 + 3 + 4 = 10)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "4",
                "explanationIfWrong": "It sums all integers from 1 up to 4."
              },
              {
                "id": "C",
                "text": "14",
                "explanationIfWrong": "1 + 2 + 3 + 4 is 10."
              },
              {
                "id": "D",
                "text": "6",
                "explanationIfWrong": "The loop includes 4."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "sum_vals accumulates: 0 + 1 = 1, + 2 = 3, + 3 = 6, + 4 = 10."
          },
          {
            "id": "q-2.4-5-v3",
            "question": "How do you calculate the average of numbers accumulated in a loop?",
            "options": [
              {
                "id": "A",
                "text": "Divide the accumulated total by the count of items: total / count",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Multiply total * count",
                "explanationIfWrong": "Average is sum divided by quantity."
              },
              {
                "id": "C",
                "text": "total + count",
                "explanationIfWrong": "Arithmetic mean is total / count."
              },
              {
                "id": "D",
                "text": "total ** count",
                "explanationIfWrong": "Average is quotient of total divided by count."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The arithmetic average is calculated by dividing total sum by the count of items."
          }
        ]
      }
    ]
  }
];

// Helper to retrieve or select active questions for a given level with duplicate prevention (Part 2)
export const getActiveQuestionsForLevelPart2 = (
  section: SectionContent,
  studentId: string,
  forceNewSet: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part2_question_history_${studentId}`;
  const activeSetKey = `dopilot_part2_active_questions_${section.id}_${studentId}`;

  if (!forceNewSet) {
    try {
      const saved = localStorage.getItem(activeSetKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === section.theoryBlocks.length) {
          return parsed;
        }
      }
    } catch {}
  }

  let seenIds: string[] = [];
  try {
    const historySaved = localStorage.getItem(historyKey);
    if (historySaved) {
      seenIds = JSON.parse(historySaved);
    }
  } catch {}

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

// Consecutive failure tracking helpers for Part 2
export const getConsecutiveFailuresPart2 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part2_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart2 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part2_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart2 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part2_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart2 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part2_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart2 = (
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
  const currentAttempt = getLevelAttemptCountPart2(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part2_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part2_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part2_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part2_locked_${studentId}`);
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
      setLevelAttemptCountPart2(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart2(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart2(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part2_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part2_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part2_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart2 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part2_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part2_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part2_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part2_locked_progression_${studentId}`);
  } catch {}
};
