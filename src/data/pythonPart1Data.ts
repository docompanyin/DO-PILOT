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

export const PART_1_SECTIONS: SectionContent[] = [
  {
    "id": "1-1-getting-started",
    "number": "1.1",
    "title": "Getting Started & The Print Command",
    "subtitle": "Write your first Python commands, execute scripts, and master formatting text and arithmetic.",
    "readTime": "15 min",
    "objectives": [
      "Write and execute your first Python commands line-by-line",
      "Use the print() function to display text on the screen",
      "Understand string syntax rules and avoid SyntaxErrors",
      "Print multiple items separated by commas",
      "Perform arithmetic calculations directly inside Python",
      "Use code comments (#) for documentation"
    ],
    "theoryBlocks": [
      {
        "heading": "Commands and Execution Flow",
        "text": "A computer program is a sequence of step-by-step instructions. In Python, code is executed strictly in sequential order, from the top line down to the bottom line.",
        "codeSnippet": "print(\"First instruction\")\nprint(\"Second instruction\")\nprint(\"Third instruction\")",
        "terminalOutput": "First instruction\nSecond instruction\nThird instruction",
        "mcq": {
          "id": "q-1.1-0-v1",
          "question": "In what order does Python execute lines of code in a program?",
          "options": [
            {
              "id": "A",
              "text": "From top to bottom, one line at a time sequentially",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "All lines at the exact same millisecond concurrently",
              "explanationIfWrong": "Python executes commands one line at a time in sequence."
            },
            {
              "id": "C",
              "text": "From bottom to top in reverse order",
              "explanationIfWrong": "Python executes from top to bottom."
            },
            {
              "id": "D",
              "text": "In arbitrary or random order",
              "explanationIfWrong": "Python follows written line order strictly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python reads and executes commands sequentially from top to bottom."
        },
        "retestMcq": {
          "id": "q-1.1-0-v2",
          "question": "Consider a script with three lines:\nline 1: print(\"Alpha\")\nline 2: print(\"Beta\")\nline 3: print(\"Gamma\")\nWhich line will execute first?",
          "options": [
            {
              "id": "A",
              "text": "Line 1 (Python starts at the very top line)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Line 3 (Python runs from bottom to top)",
              "explanationIfWrong": "Python starts at the top, not the bottom."
            },
            {
              "id": "C",
              "text": "All three lines run simultaneously",
              "explanationIfWrong": "Python runs step-by-step sequentially."
            },
            {
              "id": "D",
              "text": "Line 2 (Python starts in the middle)",
              "explanationIfWrong": "Python starts at line 1."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python begins execution on line 1 and proceeds downward in sequence."
        },
        "questionPool": [
          {
            "id": "q-1.1-0-v1",
            "question": "In what order does Python execute lines of code in a program?",
            "options": [
              {
                "id": "A",
                "text": "From top to bottom, one line at a time sequentially",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "All lines at the exact same millisecond concurrently",
                "explanationIfWrong": "Python executes commands one line at a time in sequence."
              },
              {
                "id": "C",
                "text": "From bottom to top in reverse order",
                "explanationIfWrong": "Python executes from top to bottom."
              },
              {
                "id": "D",
                "text": "In arbitrary or random order",
                "explanationIfWrong": "Python follows written line order strictly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python reads and executes commands sequentially from top to bottom."
          },
          {
            "id": "q-1.1-0-v2",
            "question": "Consider a script with three lines:\nline 1: print(\"Alpha\")\nline 2: print(\"Beta\")\nline 3: print(\"Gamma\")\nWhich line will execute first?",
            "options": [
              {
                "id": "A",
                "text": "Line 1 (Python starts at the very top line)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Line 3 (Python runs from bottom to top)",
                "explanationIfWrong": "Python starts at the top, not the bottom."
              },
              {
                "id": "C",
                "text": "All three lines run simultaneously",
                "explanationIfWrong": "Python runs step-by-step sequentially."
              },
              {
                "id": "D",
                "text": "Line 2 (Python starts in the middle)",
                "explanationIfWrong": "Python starts at line 1."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python begins execution on line 1 and proceeds downward in sequence."
          },
          {
            "id": "q-1.1-0-v3",
            "question": "If you place print(\"Step 1\") above print(\"Step 2\"), what order will appear in the terminal?",
            "options": [
              {
                "id": "A",
                "text": "Step 1 will print first, followed by Step 2",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Step 2 will print first, followed by Step 1",
                "explanationIfWrong": "Statements above execute before statements below."
              },
              {
                "id": "C",
                "text": "They will print on top of each other at the same time",
                "explanationIfWrong": "Each print statement executes in order."
              },
              {
                "id": "D",
                "text": "Python randomly shuffles the order each run",
                "explanationIfWrong": "Execution order is deterministic and sequential."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The statement on the earlier line completes before the next line begins."
          }
        ]
      },
      {
        "heading": "Printing Text and Quote Delimiters",
        "text": "Text in Python is called a string. Strings must be enclosed in matching quotes: either single quotes ('...') or double quotes (\"...\"). Using mismatched quotes causes a SyntaxError.",
        "codeSnippet": "print(\"Welcome to Python!\")\nprint('Single quotes work too')",
        "terminalOutput": "Welcome to Python!\nSingle quotes work too",
        "mcq": {
          "id": "q-1.1-1-v1",
          "question": "In Python, what is the difference between single quotes ('...') and double quotes (\"...\") for basic text strings?",
          "options": [
            {
              "id": "A",
              "text": "There is no functional difference; both represent standard strings",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Single quotes can only store a single letter",
              "explanationIfWrong": "Single quotes in Python can hold any length of text string."
            },
            {
              "id": "C",
              "text": "Double quotes only work for numbers",
              "explanationIfWrong": "Double quotes enclose any text strings in Python."
            },
            {
              "id": "D",
              "text": "Single quotes are invalid in modern Python 3",
              "explanationIfWrong": "Single quotes are completely valid in all versions of Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python treats single and double quotes identically for defining string literals."
        },
        "retestMcq": {
          "id": "q-1.1-1-v2",
          "question": "What error will occur if you execute: print(\"Hello World') with mismatched quotes?",
          "options": [
            {
              "id": "A",
              "text": "SyntaxError: unterminated string literal",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "ZeroDivisionError",
              "explanationIfWrong": "This has nothing to do with division by zero."
            },
            {
              "id": "C",
              "text": "TypeError: unsupported operand",
              "explanationIfWrong": "Mismatched quotes fail during parsing as a SyntaxError."
            },
            {
              "id": "D",
              "text": "The program will run normally and ignore the quote",
              "explanationIfWrong": "Opening and closing quotes must match."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python requires matching opening and closing quotes; mixing them triggers a SyntaxError."
        },
        "questionPool": [
          {
            "id": "q-1.1-1-v1",
            "question": "In Python, what is the difference between single quotes ('...') and double quotes (\"...\") for basic text strings?",
            "options": [
              {
                "id": "A",
                "text": "There is no functional difference; both represent standard strings",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Single quotes can only store a single letter",
                "explanationIfWrong": "Single quotes in Python can hold any length of text string."
              },
              {
                "id": "C",
                "text": "Double quotes only work for numbers",
                "explanationIfWrong": "Double quotes enclose any text strings in Python."
              },
              {
                "id": "D",
                "text": "Single quotes are invalid in modern Python 3",
                "explanationIfWrong": "Single quotes are completely valid in all versions of Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python treats single and double quotes identically for defining string literals."
          },
          {
            "id": "q-1.1-1-v2",
            "question": "What error will occur if you execute: print(\"Hello World') with mismatched quotes?",
            "options": [
              {
                "id": "A",
                "text": "SyntaxError: unterminated string literal",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "ZeroDivisionError",
                "explanationIfWrong": "This has nothing to do with division by zero."
              },
              {
                "id": "C",
                "text": "TypeError: unsupported operand",
                "explanationIfWrong": "Mismatched quotes fail during parsing as a SyntaxError."
              },
              {
                "id": "D",
                "text": "The program will run normally and ignore the quote",
                "explanationIfWrong": "Opening and closing quotes must match."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python requires matching opening and closing quotes; mixing them triggers a SyntaxError."
          },
          {
            "id": "q-1.1-1-v3",
            "question": "Which of the following print statements is written with correct Python string syntax?",
            "options": [
              {
                "id": "A",
                "text": "print(\"Learn Python\")",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "print(Learn Python)",
                "explanationIfWrong": "Unquoted text causes a NameError in Python."
              },
              {
                "id": "C",
                "text": "print(\"Learn Python')",
                "explanationIfWrong": "Opening double quote cannot be closed by a single quote."
              },
              {
                "id": "D",
                "text": "print('Learn Python\")",
                "explanationIfWrong": "Opening single quote cannot be closed by a double quote."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Text strings must be surrounded by matching pairs of quotes."
          }
        ]
      },
      {
        "heading": "Printing Multiple Items with Commas",
        "text": "The print() function can output multiple values separated by commas. Python automatically inserts a single space between each item when displayed.",
        "codeSnippet": "print(\"Hello\", \"World\", 2026)",
        "terminalOutput": "Hello World 2026",
        "mcq": {
          "id": "q-1.1-2-v1",
          "question": "What does Python automatically print between items separated by commas in a print() call?",
          "options": [
            {
              "id": "A",
              "text": "A single space character (\" \")",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A comma and a space (\", \")",
              "explanationIfWrong": "The comma in code is just an argument separator, not printed."
            },
            {
              "id": "C",
              "text": "Nothing (they are glued together directly)",
              "explanationIfWrong": "Commas in print() automatically insert a single space."
            },
            {
              "id": "D",
              "text": "A new line",
              "explanationIfWrong": "Commas do not create new lines; they insert a single space."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "By default, print() joins multiple comma-separated arguments with a single space."
        },
        "retestMcq": {
          "id": "q-1.1-2-v2",
          "question": "What will be printed to the console by running: print(\"Score:\", 100)?",
          "options": [
            {
              "id": "A",
              "text": "Score: 100 (with an automatic space after the colon)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Score:100 (without any space)",
              "explanationIfWrong": "The comma automatically adds a space between arguments."
            },
            {
              "id": "C",
              "text": "Score:, 100",
              "explanationIfWrong": "The comma in code separates parameters and is not printed."
            },
            {
              "id": "D",
              "text": "Error because text and numbers cannot be in print()",
              "explanationIfWrong": "print() can print any combination of text and numbers."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Comma separation in print() inserts a single space between the string and the number."
        },
        "questionPool": [
          {
            "id": "q-1.1-2-v1",
            "question": "What does Python automatically print between items separated by commas in a print() call?",
            "options": [
              {
                "id": "A",
                "text": "A single space character (\" \")",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "A comma and a space (\", \")",
                "explanationIfWrong": "The comma in code is just an argument separator, not printed."
              },
              {
                "id": "C",
                "text": "Nothing (they are glued together directly)",
                "explanationIfWrong": "Commas in print() automatically insert a single space."
              },
              {
                "id": "D",
                "text": "A new line",
                "explanationIfWrong": "Commas do not create new lines; they insert a single space."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "By default, print() joins multiple comma-separated arguments with a single space."
          },
          {
            "id": "q-1.1-2-v2",
            "question": "What will be printed to the console by running: print(\"Score:\", 100)?",
            "options": [
              {
                "id": "A",
                "text": "Score: 100 (with an automatic space after the colon)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Score:100 (without any space)",
                "explanationIfWrong": "The comma automatically adds a space between arguments."
              },
              {
                "id": "C",
                "text": "Score:, 100",
                "explanationIfWrong": "The comma in code separates parameters and is not printed."
              },
              {
                "id": "D",
                "text": "Error because text and numbers cannot be in print()",
                "explanationIfWrong": "print() can print any combination of text and numbers."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Comma separation in print() inserts a single space between the string and the number."
          },
          {
            "id": "q-1.1-2-v3",
            "question": "What is the output of print(\"A\", \"B\", \"C\")?",
            "options": [
              {
                "id": "A",
                "text": "A B C",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "ABC",
                "explanationIfWrong": "The comma argument separator inserts spaces."
              },
              {
                "id": "C",
                "text": "A, B, C",
                "explanationIfWrong": "Commas in code do not print as literal comma characters."
              },
              {
                "id": "D",
                "text": "\"A\" \"B\" \"C\"",
                "explanationIfWrong": "Quotes are string delimiters and are not printed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "print() outputs each argument separated by a single whitespace character."
          }
        ]
      },
      {
        "heading": "Multiple Lines and the Newline Character (\\n)",
        "text": "Every standard print() statement automatically ends with a newline, meaning the next print() call begins on a new line. You can also embed \"\\n\" inside any string to create an immediate line break.",
        "codeSnippet": "print(\"First line\\nSecond line\")\nprint(\"Third line\")",
        "terminalOutput": "First line\nSecond line\nThird line",
        "mcq": {
          "id": "q-1.1-3-v1",
          "question": "Which special escape character inserts a line break (newline) inside a Python string?",
          "options": [
            {
              "id": "A",
              "text": "\\n",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "/n",
              "explanationIfWrong": "Python escape characters use a backslash (\\), not forward slash (/)."
            },
            {
              "id": "C",
              "text": "<br>",
              "explanationIfWrong": "<br> is HTML, not Python."
            },
            {
              "id": "D",
              "text": "\\t",
              "explanationIfWrong": "\\t inserts a tab space, not a newline."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "\\n is the standard newline escape sequence in Python."
        },
        "retestMcq": {
          "id": "q-1.1-3-v2",
          "question": "How many total lines of terminal output will print(\"Line 1\\nLine 2\") produce?",
          "options": [
            {
              "id": "A",
              "text": "2 lines",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "1 line with literal \"\\n\" printed",
              "explanationIfWrong": "\\n is interpreted as an escape sequence for a line break."
            },
            {
              "id": "C",
              "text": "3 lines",
              "explanationIfWrong": "There is only one \\n, creating exactly two lines of text."
            },
            {
              "id": "D",
              "text": "None because \\n produces a syntax error",
              "explanationIfWrong": "\\n is standard valid Python syntax."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The \\n character splits the string into two separate lines on screen."
        },
        "questionPool": [
          {
            "id": "q-1.1-3-v1",
            "question": "Which special escape character inserts a line break (newline) inside a Python string?",
            "options": [
              {
                "id": "A",
                "text": "\\n",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "/n",
                "explanationIfWrong": "Python escape characters use a backslash (\\), not forward slash (/)."
              },
              {
                "id": "C",
                "text": "<br>",
                "explanationIfWrong": "<br> is HTML, not Python."
              },
              {
                "id": "D",
                "text": "\\t",
                "explanationIfWrong": "\\t inserts a tab space, not a newline."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "\\n is the standard newline escape sequence in Python."
          },
          {
            "id": "q-1.1-3-v2",
            "question": "How many total lines of terminal output will print(\"Line 1\\nLine 2\") produce?",
            "options": [
              {
                "id": "A",
                "text": "2 lines",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "1 line with literal \"\\n\" printed",
                "explanationIfWrong": "\\n is interpreted as an escape sequence for a line break."
              },
              {
                "id": "C",
                "text": "3 lines",
                "explanationIfWrong": "There is only one \\n, creating exactly two lines of text."
              },
              {
                "id": "D",
                "text": "None because \\n produces a syntax error",
                "explanationIfWrong": "\\n is standard valid Python syntax."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The \\n character splits the string into two separate lines on screen."
          },
          {
            "id": "q-1.1-3-v3",
            "question": "What is the output of the following code?\nprint(\"Hi\")\nprint(\"There\")",
            "options": [
              {
                "id": "A",
                "text": "Hi and There printed on two separate lines",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Hi There printed on one single line",
                "explanationIfWrong": "Each print() outputs on a new line by default."
              },
              {
                "id": "C",
                "text": "HiThere with no space",
                "explanationIfWrong": "print() adds a newline at the end of output."
              },
              {
                "id": "D",
                "text": "There replaces Hi in the terminal",
                "explanationIfWrong": "The terminal appends each line sequentially."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Every standard print() call ends with a newline, printing each word on its own line."
          }
        ]
      },
      {
        "heading": "Arithmetic Directly Inside Print",
        "text": "Python can calculate mathematical expressions inside print(). If you put an expression without quotes, Python computes the result. If you put quotes, it prints the literal characters.",
        "codeSnippet": "print(2 + 5 * 3)\nprint(\"2 + 5 * 3\")",
        "terminalOutput": "17\n2 + 5 * 3",
        "mcq": {
          "id": "q-1.1-4-v1",
          "question": "What is the exact output of print(2 + 3 * 4)?",
          "options": [
            {
              "id": "A",
              "text": "14 (multiplication happens before addition: 2 + 12 = 14)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "20 ((2 + 3) * 4 = 20)",
              "explanationIfWrong": "In Python, multiplication (*) has higher priority than addition (+)."
            },
            {
              "id": "C",
              "text": "\"2 + 3 * 4\"",
              "explanationIfWrong": "Without quotes, Python calculates the math result."
            },
            {
              "id": "D",
              "text": "24",
              "explanationIfWrong": "2 + (3 * 4) = 2 + 12 = 14."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python follows standard operator precedence: 3 * 4 is calculated first (12), then 2 is added (14)."
        },
        "retestMcq": {
          "id": "q-1.1-4-v2",
          "question": "What is the difference between print(5 + 5) and print(\"5 + 5\")?",
          "options": [
            {
              "id": "A",
              "text": "print(5 + 5) prints 10, while print(\"5 + 5\") prints the literal text 5 + 5",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Both print 10",
              "explanationIfWrong": "Quotes tell Python to treat content as literal text string."
            },
            {
              "id": "C",
              "text": "Both print 5 + 5",
              "explanationIfWrong": "Expressions without quotes are evaluated mathematically."
            },
            {
              "id": "D",
              "text": "print(5 + 5) produces a syntax error",
              "explanationIfWrong": "Mathematical expressions inside print() are fully valid."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Unquoted expressions evaluate the calculation; quoted expressions print the exact characters."
        },
        "questionPool": [
          {
            "id": "q-1.1-4-v1",
            "question": "What is the exact output of print(2 + 3 * 4)?",
            "options": [
              {
                "id": "A",
                "text": "14 (multiplication happens before addition: 2 + 12 = 14)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "20 ((2 + 3) * 4 = 20)",
                "explanationIfWrong": "In Python, multiplication (*) has higher priority than addition (+)."
              },
              {
                "id": "C",
                "text": "\"2 + 3 * 4\"",
                "explanationIfWrong": "Without quotes, Python calculates the math result."
              },
              {
                "id": "D",
                "text": "24",
                "explanationIfWrong": "2 + (3 * 4) = 2 + 12 = 14."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python follows standard operator precedence: 3 * 4 is calculated first (12), then 2 is added (14)."
          },
          {
            "id": "q-1.1-4-v2",
            "question": "What is the difference between print(5 + 5) and print(\"5 + 5\")?",
            "options": [
              {
                "id": "A",
                "text": "print(5 + 5) prints 10, while print(\"5 + 5\") prints the literal text 5 + 5",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Both print 10",
                "explanationIfWrong": "Quotes tell Python to treat content as literal text string."
              },
              {
                "id": "C",
                "text": "Both print 5 + 5",
                "explanationIfWrong": "Expressions without quotes are evaluated mathematically."
              },
              {
                "id": "D",
                "text": "print(5 + 5) produces a syntax error",
                "explanationIfWrong": "Mathematical expressions inside print() are fully valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Unquoted expressions evaluate the calculation; quoted expressions print the exact characters."
          },
          {
            "id": "q-1.1-4-v3",
            "question": "What will print(\"Result:\", 10 - 4) display on the screen?",
            "options": [
              {
                "id": "A",
                "text": "Result: 6",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Result: 10 - 4",
                "explanationIfWrong": "10 - 4 is not in quotes, so Python evaluates it to 6."
              },
              {
                "id": "C",
                "text": "Result:6",
                "explanationIfWrong": "The comma separator automatically inserts a space."
              },
              {
                "id": "D",
                "text": "Error: Cannot combine text with calculations",
                "explanationIfWrong": "Separating with commas allows text and calculations together."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The literal string \"Result:\" is followed by a space and the calculated number 6."
          }
        ]
      },
      {
        "heading": "Code Comments and Documentation (#)",
        "text": "A comment begins with the hash symbol (#). Python completely ignores everything from the # to the end of the line. Programmers use comments to explain their logic and leave notes for humans.",
        "codeSnippet": "# This line is a comment and will not run\nprint(\"Active code\") # Inline comment",
        "terminalOutput": "Active code",
        "mcq": {
          "id": "q-1.1-5-v1",
          "question": "Which character is used to create single-line comments in Python?",
          "options": [
            {
              "id": "A",
              "text": "# (hash / pound symbol)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "// (double forward slash)",
              "explanationIfWrong": "// is integer division in Python, not a comment."
            },
            {
              "id": "C",
              "text": "/* */",
              "explanationIfWrong": "/* */ is used in languages like C/JavaScript, not Python."
            },
            {
              "id": "D",
              "text": "--",
              "explanationIfWrong": "-- is used in SQL, not Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The # character starts a comment in Python, which is ignored during execution."
        },
        "retestMcq": {
          "id": "q-1.1-5-v2",
          "question": "What will be printed by the following code?\n# print(\"Welcome\")\nprint(\"Hello\")",
          "options": [
            {
              "id": "A",
              "text": "Hello only (the line starting with # is ignored)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Welcome and Hello",
              "explanationIfWrong": "The first print is commented out with #, so it never runs."
            },
            {
              "id": "C",
              "text": "Welcome only",
              "explanationIfWrong": "The line with Welcome is commented out."
            },
            {
              "id": "D",
              "text": "An error because # cannot be inside a script",
              "explanationIfWrong": "# comments are completely legal in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Python interpreter completely ignores lines starting with #."
        },
        "questionPool": [
          {
            "id": "q-1.1-5-v1",
            "question": "Which character is used to create single-line comments in Python?",
            "options": [
              {
                "id": "A",
                "text": "# (hash / pound symbol)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "// (double forward slash)",
                "explanationIfWrong": "// is integer division in Python, not a comment."
              },
              {
                "id": "C",
                "text": "/* */",
                "explanationIfWrong": "/* */ is used in languages like C/JavaScript, not Python."
              },
              {
                "id": "D",
                "text": "--",
                "explanationIfWrong": "-- is used in SQL, not Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The # character starts a comment in Python, which is ignored during execution."
          },
          {
            "id": "q-1.1-5-v2",
            "question": "What will be printed by the following code?\n# print(\"Welcome\")\nprint(\"Hello\")",
            "options": [
              {
                "id": "A",
                "text": "Hello only (the line starting with # is ignored)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Welcome and Hello",
                "explanationIfWrong": "The first print is commented out with #, so it never runs."
              },
              {
                "id": "C",
                "text": "Welcome only",
                "explanationIfWrong": "The line with Welcome is commented out."
              },
              {
                "id": "D",
                "text": "An error because # cannot be inside a script",
                "explanationIfWrong": "# comments are completely legal in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Python interpreter completely ignores lines starting with #."
          },
          {
            "id": "q-1.1-5-v3",
            "question": "Why do software developers write comments in their Python code?",
            "options": [
              {
                "id": "A",
                "text": "To explain code logic and make programs easier for humans to read and maintain",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "To make the Python interpreter run the code faster",
                "explanationIfWrong": "Comments do not speed up execution."
              },
              {
                "id": "C",
                "text": "To display help menus automatically to end users",
                "explanationIfWrong": "Comments are invisible to users and never printed."
              },
              {
                "id": "D",
                "text": "Python requires at least one comment per file to compile",
                "explanationIfWrong": "Comments are entirely optional."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Comments serve as notes for humans to understand the intention and logic of code."
          }
        ]
      }
    ]
  },
  {
    "id": "1-2-user-input",
    "number": "1.2",
    "title": "Information from the User",
    "subtitle": "Interact with users using input(), store strings, and master concatenation.",
    "readTime": "20 min",
    "objectives": [
      "Read keyboard input using the input() function",
      "Provide clear, guiding prompts inside input()",
      "Store input results into named variables",
      "Concatenate text strings using the + operator",
      "Understand that input() always returns string (str) values",
      "Repeat strings using the multiplication (*) operator"
    ],
    "theoryBlocks": [
      {
        "heading": "Reading Keyboard Input with input()",
        "text": "The input() function pauses program execution and waits for the user to type text using the keyboard and press Enter. Once Enter is pressed, execution resumes.",
        "codeSnippet": "print(\"Waiting for input...\")\nname = input()\nprint(\"Received:\", name)",
        "terminalOutput": "Waiting for input...\n[User types and presses Enter]\nReceived: [User input]",
        "mcq": {
          "id": "q-1.2-0-v1",
          "question": "What happens when Python encounters an input() function call in your code?",
          "options": [
            {
              "id": "A",
              "text": "Program execution pauses and waits for the user to type text and press Enter",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "It immediately prints a random number without waiting",
              "explanationIfWrong": "input() waits for keyboard entry."
            },
            {
              "id": "C",
              "text": "The program shuts down immediately",
              "explanationIfWrong": "input() pauses to accept data; it does not shut down."
            },
            {
              "id": "D",
              "text": "It reads files from the hard drive",
              "explanationIfWrong": "input() reads standard keyboard input."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "input() halts execution until the user enters text and presses the Enter key."
        },
        "retestMcq": {
          "id": "q-1.2-0-v2",
          "question": "Which key must the user press to signal that they have finished entering text into input()?",
          "options": [
            {
              "id": "A",
              "text": "Enter / Return key",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Spacebar",
              "explanationIfWrong": "The spacebar enters a space character into the text, not finishing it."
            },
            {
              "id": "C",
              "text": "Escape key",
              "explanationIfWrong": "The Enter key submits the input."
            },
            {
              "id": "D",
              "text": "Shift key",
              "explanationIfWrong": "The Enter key finishes keyboard input."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Pressing Enter signals to Python that the user has submitted their input line."
        },
        "questionPool": [
          {
            "id": "q-1.2-0-v1",
            "question": "What happens when Python encounters an input() function call in your code?",
            "options": [
              {
                "id": "A",
                "text": "Program execution pauses and waits for the user to type text and press Enter",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It immediately prints a random number without waiting",
                "explanationIfWrong": "input() waits for keyboard entry."
              },
              {
                "id": "C",
                "text": "The program shuts down immediately",
                "explanationIfWrong": "input() pauses to accept data; it does not shut down."
              },
              {
                "id": "D",
                "text": "It reads files from the hard drive",
                "explanationIfWrong": "input() reads standard keyboard input."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "input() halts execution until the user enters text and presses the Enter key."
          },
          {
            "id": "q-1.2-0-v2",
            "question": "Which key must the user press to signal that they have finished entering text into input()?",
            "options": [
              {
                "id": "A",
                "text": "Enter / Return key",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Spacebar",
                "explanationIfWrong": "The spacebar enters a space character into the text, not finishing it."
              },
              {
                "id": "C",
                "text": "Escape key",
                "explanationIfWrong": "The Enter key submits the input."
              },
              {
                "id": "D",
                "text": "Shift key",
                "explanationIfWrong": "The Enter key finishes keyboard input."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Pressing Enter signals to Python that the user has submitted their input line."
          },
          {
            "id": "q-1.2-0-v3",
            "question": "If a program runs user_data = input(), what does Python store in user_data?",
            "options": [
              {
                "id": "A",
                "text": "Whatever text the user typed before pressing Enter",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "The name of the computer operating system",
                "explanationIfWrong": "user_data stores the typed string."
              },
              {
                "id": "C",
                "text": "A random integer generated by Python",
                "explanationIfWrong": "It holds the user's entered string."
              },
              {
                "id": "D",
                "text": "The word \"input\"",
                "explanationIfWrong": "It stores the user's actual input."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "input() captures whatever sequence of characters the user entered."
          }
        ]
      },
      {
        "heading": "Input Prompts and Guiding the User",
        "text": "You can pass a message inside the parentheses of input(\"Prompt here: \"). Python displays this message on the screen right before waiting for user typing, informing them what to type.",
        "codeSnippet": "city = input(\"What city do you live in? \")\nprint(\"You live in \" + city)",
        "terminalOutput": "What city do you live in? Helsinki\nYou live in Helsinki",
        "mcq": {
          "id": "q-1.2-1-v1",
          "question": "What is the purpose of passing a string argument inside input(\"Enter your email: \")?",
          "options": [
            {
              "id": "A",
              "text": "It displays a prompt on screen so the user knows what information to enter",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "It forces the user to enter only that exact word",
              "explanationIfWrong": "The prompt is merely instructions; the user can type any input."
            },
            {
              "id": "C",
              "text": "It encrypts the entered password",
              "explanationIfWrong": "input() does not encrypt anything."
            },
            {
              "id": "D",
              "text": "It sets the default value if the user types nothing",
              "explanationIfWrong": "The prompt is displayed on screen, not used as a fallback."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The prompt string guides the user with clear instructions in the console."
        },
        "retestMcq": {
          "id": "q-1.2-1-v2",
          "question": "What will appear on the terminal when age = input(\"Please enter your age: \") runs?",
          "options": [
            {
              "id": "A",
              "text": "Please enter your age: (and the blinking cursor waits for typing)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A blank screen with no text shown",
              "explanationIfWrong": "The prompt string is printed before waiting."
            },
            {
              "id": "C",
              "text": "An error message",
              "explanationIfWrong": "Passing a prompt string to input() is standard Python practice."
            },
            {
              "id": "D",
              "text": "The word \"age\" only",
              "explanationIfWrong": "The entire prompt string inside quotes is printed."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python prints the prompt text and holds the cursor ready for input on the same line."
        },
        "questionPool": [
          {
            "id": "q-1.2-1-v1",
            "question": "What is the purpose of passing a string argument inside input(\"Enter your email: \")?",
            "options": [
              {
                "id": "A",
                "text": "It displays a prompt on screen so the user knows what information to enter",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It forces the user to enter only that exact word",
                "explanationIfWrong": "The prompt is merely instructions; the user can type any input."
              },
              {
                "id": "C",
                "text": "It encrypts the entered password",
                "explanationIfWrong": "input() does not encrypt anything."
              },
              {
                "id": "D",
                "text": "It sets the default value if the user types nothing",
                "explanationIfWrong": "The prompt is displayed on screen, not used as a fallback."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The prompt string guides the user with clear instructions in the console."
          },
          {
            "id": "q-1.2-1-v2",
            "question": "What will appear on the terminal when age = input(\"Please enter your age: \") runs?",
            "options": [
              {
                "id": "A",
                "text": "Please enter your age: (and the blinking cursor waits for typing)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "A blank screen with no text shown",
                "explanationIfWrong": "The prompt string is printed before waiting."
              },
              {
                "id": "C",
                "text": "An error message",
                "explanationIfWrong": "Passing a prompt string to input() is standard Python practice."
              },
              {
                "id": "D",
                "text": "The word \"age\" only",
                "explanationIfWrong": "The entire prompt string inside quotes is printed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python prints the prompt text and holds the cursor ready for input on the same line."
          },
          {
            "id": "q-1.2-1-v3",
            "question": "Why is it considered good practice to put a space at the end of a prompt like input(\"Name: \")?",
            "options": [
              {
                "id": "A",
                "text": "So the user's typed text doesn't stick directly to the colon",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Because Python throws a SyntaxError without a space",
                "explanationIfWrong": "Python allows prompts without spaces, but they look crowded."
              },
              {
                "id": "C",
                "text": "To automatically delete leading spaces in the input",
                "explanationIfWrong": "It does not modify input data; it just looks clean."
              },
              {
                "id": "D",
                "text": "To convert input automatically into numbers",
                "explanationIfWrong": "Prompts only affect the visual display."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A trailing space separates the prompt label cleanly from the user's typing."
          }
        ]
      },
      {
        "heading": "Storing Input in Variables",
        "text": "A variable acts like a labeled storage container in memory. By writing variable_name = input(...), Python stores the user's input so you can reference it anywhere later in the script.",
        "codeSnippet": "color = input(\"Favorite color: \")\nprint(\"Cool!\")\nprint(color + \" is a great color.\")",
        "terminalOutput": "Favorite color: Blue\nCool!\nBlue is a great color.",
        "mcq": {
          "id": "q-1.2-2-v1",
          "question": "In the code line name = input(\"Your name: \"), what role does the word name play?",
          "options": [
            {
              "id": "A",
              "text": "It is a variable that stores and labels the entered value in memory",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "It is a built-in Python command",
              "explanationIfWrong": "name is a custom variable name chosen by the programmer."
            },
            {
              "id": "C",
              "text": "It is a fixed keyword that cannot be changed",
              "explanationIfWrong": "You can name variables almost anything following syntax rules."
            },
            {
              "id": "D",
              "text": "It prints the name automatically to the printer",
              "explanationIfWrong": "Assignment saves data in RAM memory."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Variables store data values in program memory for later use."
        },
        "retestMcq": {
          "id": "q-1.2-2-v2",
          "question": "What happens if you run input(\"Your name: \") without assigning it to a variable?",
          "options": [
            {
              "id": "A",
              "text": "The user can type, but the entered value is discarded and cannot be used later",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Python saves it automatically into a variable named temp",
              "explanationIfWrong": "Python does not create a named variable unless you assign one."
            },
            {
              "id": "C",
              "text": "The program crashes with an error",
              "explanationIfWrong": "It is valid Python, but the data is lost immediately after Enter."
            },
            {
              "id": "D",
              "text": "It writes the input to a file",
              "explanationIfWrong": "Unassigned input is simply discarded from memory."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "To preserve the entered data for subsequent lines, you must assign it to a variable."
        },
        "questionPool": [
          {
            "id": "q-1.2-2-v1",
            "question": "In the code line name = input(\"Your name: \"), what role does the word name play?",
            "options": [
              {
                "id": "A",
                "text": "It is a variable that stores and labels the entered value in memory",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It is a built-in Python command",
                "explanationIfWrong": "name is a custom variable name chosen by the programmer."
              },
              {
                "id": "C",
                "text": "It is a fixed keyword that cannot be changed",
                "explanationIfWrong": "You can name variables almost anything following syntax rules."
              },
              {
                "id": "D",
                "text": "It prints the name automatically to the printer",
                "explanationIfWrong": "Assignment saves data in RAM memory."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Variables store data values in program memory for later use."
          },
          {
            "id": "q-1.2-2-v2",
            "question": "What happens if you run input(\"Your name: \") without assigning it to a variable?",
            "options": [
              {
                "id": "A",
                "text": "The user can type, but the entered value is discarded and cannot be used later",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Python saves it automatically into a variable named temp",
                "explanationIfWrong": "Python does not create a named variable unless you assign one."
              },
              {
                "id": "C",
                "text": "The program crashes with an error",
                "explanationIfWrong": "It is valid Python, but the data is lost immediately after Enter."
              },
              {
                "id": "D",
                "text": "It writes the input to a file",
                "explanationIfWrong": "Unassigned input is simply discarded from memory."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "To preserve the entered data for subsequent lines, you must assign it to a variable."
          },
          {
            "id": "q-1.2-2-v3",
            "question": "If you have fruit = input(\"Fruit: \") and the user enters \"Apple\", what does print(fruit) display?",
            "options": [
              {
                "id": "A",
                "text": "Apple",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "fruit",
                "explanationIfWrong": "Variable names without quotes print their stored value, not their name."
              },
              {
                "id": "C",
                "text": "\"Fruit: \"",
                "explanationIfWrong": "The prompt is not stored in the variable; the user's response is."
              },
              {
                "id": "D",
                "text": "Nothing",
                "explanationIfWrong": "print(fruit) displays the stored value \"Apple\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling print() on a variable outputs the data value currently held in that variable."
          }
        ]
      },
      {
        "heading": "String Concatenation with the + Operator",
        "text": "When you place the plus sign (+) between two text strings, Python joins (glues) them together into one longer string. Note that + does not automatically insert spaces.",
        "codeSnippet": "first = \"Ada\"\nlast = \"Lovelace\"\nfull = first + \" \" + last\nprint(full)",
        "terminalOutput": "Ada Lovelace",
        "mcq": {
          "id": "q-1.2-3-v1",
          "question": "What is the exact result of running \"Super\" + \"hero\" in Python?",
          "options": [
            {
              "id": "A",
              "text": "\"Superhero\" (glued end-to-end without extra spaces)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "\"Super hero\" (with an automatic space in between)",
              "explanationIfWrong": "The + operator does not insert spaces automatically."
            },
            {
              "id": "C",
              "text": "\"Super+hero\"",
              "explanationIfWrong": "+ combines string characters, it does not print the plus sign."
            },
            {
              "id": "D",
              "text": "TypeError",
              "explanationIfWrong": "Joining two strings with + is completely valid in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "String concatenation (+) glues strings directly together with no added space."
        },
        "retestMcq": {
          "id": "q-1.2-3-v2",
          "question": "How can you produce the string \"Hello World\" with a space using two variables a = \"Hello\" and b = \"World\"?",
          "options": [
            {
              "id": "A",
              "text": "a + \" \" + b",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "a + b",
              "explanationIfWrong": "a + b produces \"HelloWorld\" without any space."
            },
            {
              "id": "C",
              "text": "a - b",
              "explanationIfWrong": "Subtraction is not defined for strings in Python."
            },
            {
              "id": "D",
              "text": "a * b",
              "explanationIfWrong": "You cannot multiply two strings together."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Explicitly adding a space string \" \" between a and b creates \"Hello World\"."
        },
        "questionPool": [
          {
            "id": "q-1.2-3-v1",
            "question": "What is the exact result of running \"Super\" + \"hero\" in Python?",
            "options": [
              {
                "id": "A",
                "text": "\"Superhero\" (glued end-to-end without extra spaces)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "\"Super hero\" (with an automatic space in between)",
                "explanationIfWrong": "The + operator does not insert spaces automatically."
              },
              {
                "id": "C",
                "text": "\"Super+hero\"",
                "explanationIfWrong": "+ combines string characters, it does not print the plus sign."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "Joining two strings with + is completely valid in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "String concatenation (+) glues strings directly together with no added space."
          },
          {
            "id": "q-1.2-3-v2",
            "question": "How can you produce the string \"Hello World\" with a space using two variables a = \"Hello\" and b = \"World\"?",
            "options": [
              {
                "id": "A",
                "text": "a + \" \" + b",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "a + b",
                "explanationIfWrong": "a + b produces \"HelloWorld\" without any space."
              },
              {
                "id": "C",
                "text": "a - b",
                "explanationIfWrong": "Subtraction is not defined for strings in Python."
              },
              {
                "id": "D",
                "text": "a * b",
                "explanationIfWrong": "You cannot multiply two strings together."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Explicitly adding a space string \" \" between a and b creates \"Hello World\"."
          },
          {
            "id": "q-1.2-3-v3",
            "question": "What will be printed by: print(\"Fire\" + \"truck\")?",
            "options": [
              {
                "id": "A",
                "text": "Firetruck",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Fire truck",
                "explanationIfWrong": "+ does not add spaces automatically."
              },
              {
                "id": "C",
                "text": "Fire+truck",
                "explanationIfWrong": "+ performs concatenation, not literal plus printing."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "Concatenating string literals with + is standard Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "\"Fire\" and \"truck\" concatenate directly into \"Firetruck\"."
          }
        ]
      },
      {
        "heading": "Input Return Type is Always String (str)",
        "text": "The input() function ALWAYS returns whatever the user typed as a string (str). Even if the user types digits like 50, Python stores it as the text \"50\", not the number 50.",
        "codeSnippet": "val = input(\"Enter a number: \") # user enters 5\nprint(val + val) # prints \"55\", NOT 10!",
        "terminalOutput": "Enter a number: 5\n55",
        "mcq": {
          "id": "q-1.2-4-v1",
          "question": "If a user types 25 into age = input(\"Age: \"), what data type does age have in Python?",
          "options": [
            {
              "id": "A",
              "text": "str (string / text)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "int (integer number)",
              "explanationIfWrong": "input() never returns an int automatically; it always returns a string."
            },
            {
              "id": "C",
              "text": "float (decimal number)",
              "explanationIfWrong": "input() always returns text, not float."
            },
            {
              "id": "D",
              "text": "bool (boolean)",
              "explanationIfWrong": "input() return type is always string."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "input() always returns text as a string (str), regardless of what characters are typed."
        },
        "retestMcq": {
          "id": "q-1.2-4-v2",
          "question": "Consider the code:\nx = input() # User enters: 3\nprint(x + x)\nWhat will be printed?",
          "options": [
            {
              "id": "A",
              "text": "33 (because x is a string, + glues \"3\" + \"3\" together)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "6 (it adds 3 + 3 mathematically)",
              "explanationIfWrong": "x is a string, so + concatenates strings instead of adding numbers."
            },
            {
              "id": "C",
              "text": "9 (3 times 3)",
              "explanationIfWrong": "+ performs string concatenation here."
            },
            {
              "id": "D",
              "text": "TypeError",
              "explanationIfWrong": "String concatenation is fully legal, resulting in \"33\"."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since input() returns a string, + concatenates \"3\" + \"3\" to make \"33\"."
        },
        "questionPool": [
          {
            "id": "q-1.2-4-v1",
            "question": "If a user types 25 into age = input(\"Age: \"), what data type does age have in Python?",
            "options": [
              {
                "id": "A",
                "text": "str (string / text)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "int (integer number)",
                "explanationIfWrong": "input() never returns an int automatically; it always returns a string."
              },
              {
                "id": "C",
                "text": "float (decimal number)",
                "explanationIfWrong": "input() always returns text, not float."
              },
              {
                "id": "D",
                "text": "bool (boolean)",
                "explanationIfWrong": "input() return type is always string."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "input() always returns text as a string (str), regardless of what characters are typed."
          },
          {
            "id": "q-1.2-4-v2",
            "question": "Consider the code:\nx = input() # User enters: 3\nprint(x + x)\nWhat will be printed?",
            "options": [
              {
                "id": "A",
                "text": "33 (because x is a string, + glues \"3\" + \"3\" together)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "6 (it adds 3 + 3 mathematically)",
                "explanationIfWrong": "x is a string, so + concatenates strings instead of adding numbers."
              },
              {
                "id": "C",
                "text": "9 (3 times 3)",
                "explanationIfWrong": "+ performs string concatenation here."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "String concatenation is fully legal, resulting in \"33\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since input() returns a string, + concatenates \"3\" + \"3\" to make \"33\"."
          },
          {
            "id": "q-1.2-4-v3",
            "question": "What error will occur if you execute: val = input() (user types 10), followed by print(val + 5)?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: can only concatenate str (not \"int\") to str",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "SyntaxError",
                "explanationIfWrong": "The syntax is valid; the error happens at runtime due to mismatched types."
              },
              {
                "id": "C",
                "text": "ZeroDivisionError",
                "explanationIfWrong": "No division is occurring."
              },
              {
                "id": "D",
                "text": "It prints 15 with no error",
                "explanationIfWrong": "You cannot directly add an integer (5) to a string (\"10\")."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python does not allow adding an integer to a string; you must convert types first."
          }
        ]
      },
      {
        "heading": "Repeating Strings with Multiplication (*)",
        "text": "In Python, multiplying a string by an integer using * repeats that string multiple times. For example, \"ha\" * 3 evaluates to \"hahaha\".",
        "codeSnippet": "sound = \"Woof! \"\nprint(sound * 3)",
        "terminalOutput": "Woof! Woof! Woof! ",
        "mcq": {
          "id": "q-1.2-5-v1",
          "question": "What is the output of running print(\"Echo\" * 3)?",
          "options": [
            {
              "id": "A",
              "text": "EchoEchoEcho",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Echo 3",
              "explanationIfWrong": "String * int repeats the string, it does not append the number."
            },
            {
              "id": "C",
              "text": "TypeError: cannot multiply sequence by non-int",
              "explanationIfWrong": "Multiplying a string by an integer is a supported Python feature."
            },
            {
              "id": "D",
              "text": "Echo Echo Echo",
              "explanationIfWrong": "* repeats exactly what is inside the string without adding extra spaces."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Multiplying a string by an integer repeats the characters that number of times."
        },
        "retestMcq": {
          "id": "q-1.2-5-v2",
          "question": "What will line = \"-\" * 5 print?",
          "options": [
            {
              "id": "A",
              "text": "----- (five dash characters in a row)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "- 5",
              "explanationIfWrong": "The string \"-\" is repeated 5 times."
            },
            {
              "id": "C",
              "text": "-5",
              "explanationIfWrong": "It repeats the string, not turning it into negative 5."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "String repetition is completely valid in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The single character string \"-\" is repeated 5 times to form \"-----\"."
        },
        "questionPool": [
          {
            "id": "q-1.2-5-v1",
            "question": "What is the output of running print(\"Echo\" * 3)?",
            "options": [
              {
                "id": "A",
                "text": "EchoEchoEcho",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Echo 3",
                "explanationIfWrong": "String * int repeats the string, it does not append the number."
              },
              {
                "id": "C",
                "text": "TypeError: cannot multiply sequence by non-int",
                "explanationIfWrong": "Multiplying a string by an integer is a supported Python feature."
              },
              {
                "id": "D",
                "text": "Echo Echo Echo",
                "explanationIfWrong": "* repeats exactly what is inside the string without adding extra spaces."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiplying a string by an integer repeats the characters that number of times."
          },
          {
            "id": "q-1.2-5-v2",
            "question": "What will line = \"-\" * 5 print?",
            "options": [
              {
                "id": "A",
                "text": "----- (five dash characters in a row)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "- 5",
                "explanationIfWrong": "The string \"-\" is repeated 5 times."
              },
              {
                "id": "C",
                "text": "-5",
                "explanationIfWrong": "It repeats the string, not turning it into negative 5."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "String repetition is completely valid in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The single character string \"-\" is repeated 5 times to form \"-----\"."
          },
          {
            "id": "q-1.2-5-v3",
            "question": "What happens if you multiply a string by 0, such as print(\"Hello\" * 0)?",
            "options": [
              {
                "id": "A",
                "text": "It produces an empty string (\"\")",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It prints 0",
                "explanationIfWrong": "Multiplying a string by 0 produces 0 copies of the string, which is empty."
              },
              {
                "id": "C",
                "text": "It prints \"Hello0\"",
                "explanationIfWrong": "It repeats 0 times."
              },
              {
                "id": "D",
                "text": "It raises a ValueError",
                "explanationIfWrong": "Multiplying by 0 or negative numbers is legal and yields \"\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Repeating a string 0 times produces an empty string with length 0."
          }
        ]
      }
    ]
  },
  {
    "id": "1-3-variables-types",
    "number": "1.3",
    "title": "More About Variables & Data Types",
    "subtitle": "Master reassignment, naming rules, integers, floats, strings, and type conversion.",
    "readTime": "20 min",
    "objectives": [
      "Assign and reassign variables in memory",
      "Understand Python variable naming rules and snake_case",
      "Work with string (str) data type",
      "Work with integer (int) data type",
      "Work with floating-point (float) numbers",
      "Convert between types using int(), float(), and str()"
    ],
    "theoryBlocks": [
      {
        "heading": "Assigning and Reassigning Variables",
        "text": "A variable holds one value at a time. When you assign a new value to an existing variable with =, the old value is overwritten and replaced in memory.",
        "codeSnippet": "points = 10\nprint(points)\npoints = 25\nprint(points)",
        "terminalOutput": "10\n25",
        "mcq": {
          "id": "q-1.3-0-v1",
          "question": "Consider the code:\nscore = 10\nscore = 50\nprint(score)\nWhat will be printed?",
          "options": [
            {
              "id": "A",
              "text": "50 (the new assignment overwrites the previous value)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "10 (the first assignment is locked)",
              "explanationIfWrong": "Variables in Python can be freely reassigned."
            },
            {
              "id": "C",
              "text": "60 (10 + 50)",
              "explanationIfWrong": "Single = assigns a new value; it does not add to the old one."
            },
            {
              "id": "D",
              "text": "10 50",
              "explanationIfWrong": "Only the latest assigned value is stored."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Reassigning a variable replaces its previous value with the new one."
        },
        "retestMcq": {
          "id": "q-1.3-0-v2",
          "question": "What is the value of y after this code runs?\nx = 5\ny = x\nx = 100",
          "options": [
            {
              "id": "A",
              "text": "5 (y was assigned the value of x at that moment)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "100 (y automatically tracks x)",
              "explanationIfWrong": "Basic types like numbers copy their value at assignment time."
            },
            {
              "id": "C",
              "text": "105",
              "explanationIfWrong": "y received 5, and changing x afterwards does not alter y."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "y retains the value 5."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Assigning y = x copies the current value 5 into y; subsequent changes to x do not affect y."
        },
        "questionPool": [
          {
            "id": "q-1.3-0-v1",
            "question": "Consider the code:\nscore = 10\nscore = 50\nprint(score)\nWhat will be printed?",
            "options": [
              {
                "id": "A",
                "text": "50 (the new assignment overwrites the previous value)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "10 (the first assignment is locked)",
                "explanationIfWrong": "Variables in Python can be freely reassigned."
              },
              {
                "id": "C",
                "text": "60 (10 + 50)",
                "explanationIfWrong": "Single = assigns a new value; it does not add to the old one."
              },
              {
                "id": "D",
                "text": "10 50",
                "explanationIfWrong": "Only the latest assigned value is stored."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Reassigning a variable replaces its previous value with the new one."
          },
          {
            "id": "q-1.3-0-v2",
            "question": "What is the value of y after this code runs?\nx = 5\ny = x\nx = 100",
            "options": [
              {
                "id": "A",
                "text": "5 (y was assigned the value of x at that moment)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "100 (y automatically tracks x)",
                "explanationIfWrong": "Basic types like numbers copy their value at assignment time."
              },
              {
                "id": "C",
                "text": "105",
                "explanationIfWrong": "y received 5, and changing x afterwards does not alter y."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "y retains the value 5."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Assigning y = x copies the current value 5 into y; subsequent changes to x do not affect y."
          },
          {
            "id": "q-1.3-0-v3",
            "question": "In the expression count = count + 1, how does Python evaluate this line?",
            "options": [
              {
                "id": "A",
                "text": "It calculates count + 1 on the right first, then stores the result back into count",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It compares whether count equals count + 1",
                "explanationIfWrong": "Single = is assignment, not equality comparison (==)."
              },
              {
                "id": "C",
                "text": "It causes an immediate syntax error",
                "explanationIfWrong": "This is the standard programming pattern for incrementing."
              },
              {
                "id": "D",
                "text": "It resets count to 0",
                "explanationIfWrong": "It increases count by 1."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python evaluates the right-hand side expression first, then assigns the result into the variable on the left."
          }
        ]
      },
      {
        "heading": "Variable Naming Rules and Conventions",
        "text": "Variable names must begin with a letter or underscore (_). They cannot start with a digit, cannot contain spaces or hyphens, and cannot be Python keywords (like if, print, def). Python style recommends snake_case (e.g. user_age).",
        "codeSnippet": "user_score = 95 # Valid snake_case\n_private_id = 42 # Valid\n# 2nd_player = 10 # INVALID: starts with digit",
        "terminalOutput": "# Follow snake_case naming",
        "mcq": {
          "id": "q-1.3-1-v1",
          "question": "Which of the following is an ILLEGAL (invalid) variable name in Python?",
          "options": [
            {
              "id": "A",
              "text": "2nd_player (cannot start with a number)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "player_two",
              "explanationIfWrong": "player_two is a completely valid snake_case name."
            },
            {
              "id": "C",
              "text": "_user_id",
              "explanationIfWrong": "Starting with an underscore is legal in Python."
            },
            {
              "id": "D",
              "text": "player2",
              "explanationIfWrong": "Digits are allowed anywhere in a variable name except the first character."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Variable names in Python cannot begin with a numeric digit."
        },
        "retestMcq": {
          "id": "q-1.3-1-v2",
          "question": "Are high_score and High_Score treated as the same variable in Python?",
          "options": [
            {
              "id": "A",
              "text": "No, Python variable names are strictly case-sensitive",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Yes, Python ignores uppercase and lowercase letters",
              "explanationIfWrong": "Python is strictly case-sensitive."
            },
            {
              "id": "C",
              "text": "Only if they hold integer values",
              "explanationIfWrong": "Case sensitivity applies to all variable identifiers."
            },
            {
              "id": "D",
              "text": "Yes, unless they are inside a function",
              "explanationIfWrong": "Variables are always case-sensitive everywhere in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python is strictly case-sensitive; high_score and High_Score are two different variables."
        },
        "questionPool": [
          {
            "id": "q-1.3-1-v1",
            "question": "Which of the following is an ILLEGAL (invalid) variable name in Python?",
            "options": [
              {
                "id": "A",
                "text": "2nd_player (cannot start with a number)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "player_two",
                "explanationIfWrong": "player_two is a completely valid snake_case name."
              },
              {
                "id": "C",
                "text": "_user_id",
                "explanationIfWrong": "Starting with an underscore is legal in Python."
              },
              {
                "id": "D",
                "text": "player2",
                "explanationIfWrong": "Digits are allowed anywhere in a variable name except the first character."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Variable names in Python cannot begin with a numeric digit."
          },
          {
            "id": "q-1.3-1-v2",
            "question": "Are high_score and High_Score treated as the same variable in Python?",
            "options": [
              {
                "id": "A",
                "text": "No, Python variable names are strictly case-sensitive",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Yes, Python ignores uppercase and lowercase letters",
                "explanationIfWrong": "Python is strictly case-sensitive."
              },
              {
                "id": "C",
                "text": "Only if they hold integer values",
                "explanationIfWrong": "Case sensitivity applies to all variable identifiers."
              },
              {
                "id": "D",
                "text": "Yes, unless they are inside a function",
                "explanationIfWrong": "Variables are always case-sensitive everywhere in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python is strictly case-sensitive; high_score and High_Score are two different variables."
          },
          {
            "id": "q-1.3-1-v3",
            "question": "Which variable name follows the official Python PEP 8 style convention (snake_case)?",
            "options": [
              {
                "id": "A",
                "text": "student_total_score",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "studentTotalScore",
                "explanationIfWrong": "This is camelCase, common in JavaScript but not standard Python style."
              },
              {
                "id": "C",
                "text": "StudentTotalScore",
                "explanationIfWrong": "This is PascalCase, typically reserved for class names."
              },
              {
                "id": "D",
                "text": "student-total-score",
                "explanationIfWrong": "Hyphens are illegal in variable names (subtraction operator)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python PEP 8 recommends all-lowercase words joined by underscores (snake_case)."
          }
        ]
      },
      {
        "heading": "String Data Type (str)",
        "text": "The string (str) type represents text characters. Strings are always enclosed in single quotes ('...') or double quotes (\"...\"). Even numbers inside quotes are strings, not integers.",
        "codeSnippet": "greeting = \"Hello, World!\"\ncode = \"12345\"\nprint(type(greeting))\nprint(type(code))",
        "terminalOutput": "<class 'str'>\n<class 'str'>",
        "mcq": {
          "id": "q-1.3-2-v1",
          "question": "What is the data type of the value \"999\" enclosed in quotes in Python?",
          "options": [
            {
              "id": "A",
              "text": "str (string)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "int (integer)",
              "explanationIfWrong": "Because it is wrapped in quotes, Python treats it as text."
            },
            {
              "id": "C",
              "text": "float (float)",
              "explanationIfWrong": "Floats contain decimal points and no quotes."
            },
            {
              "id": "D",
              "text": "bool (boolean)",
              "explanationIfWrong": "Booleans are True or False."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Any value enclosed in quotation marks is recognized by Python as a string (str)."
        },
        "retestMcq": {
          "id": "q-1.3-2-v2",
          "question": "What function in Python lets you check the data type of a variable?",
          "options": [
            {
              "id": "A",
              "text": "type()",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "check()",
              "explanationIfWrong": "check() is not a built-in Python type inspection function."
            },
            {
              "id": "C",
              "text": "datatype()",
              "explanationIfWrong": "The built-in function is type()."
            },
            {
              "id": "D",
              "text": "kind()",
              "explanationIfWrong": "Python uses type() to determine data types."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "type(variable) returns the type class of the given value (e.g. <class 'str'>)."
        },
        "questionPool": [
          {
            "id": "q-1.3-2-v1",
            "question": "What is the data type of the value \"999\" enclosed in quotes in Python?",
            "options": [
              {
                "id": "A",
                "text": "str (string)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "int (integer)",
                "explanationIfWrong": "Because it is wrapped in quotes, Python treats it as text."
              },
              {
                "id": "C",
                "text": "float (float)",
                "explanationIfWrong": "Floats contain decimal points and no quotes."
              },
              {
                "id": "D",
                "text": "bool (boolean)",
                "explanationIfWrong": "Booleans are True or False."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Any value enclosed in quotation marks is recognized by Python as a string (str)."
          },
          {
            "id": "q-1.3-2-v2",
            "question": "What function in Python lets you check the data type of a variable?",
            "options": [
              {
                "id": "A",
                "text": "type()",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "check()",
                "explanationIfWrong": "check() is not a built-in Python type inspection function."
              },
              {
                "id": "C",
                "text": "datatype()",
                "explanationIfWrong": "The built-in function is type()."
              },
              {
                "id": "D",
                "text": "kind()",
                "explanationIfWrong": "Python uses type() to determine data types."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "type(variable) returns the type class of the given value (e.g. <class 'str'>)."
          },
          {
            "id": "q-1.3-2-v3",
            "question": "Which of the following is a valid Python string literal?",
            "options": [
              {
                "id": "A",
                "text": "\"Python is awesome\"",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Python is awesome",
                "explanationIfWrong": "Without quotes, Python interprets words as variable identifiers."
              },
              {
                "id": "C",
                "text": "\"Python is awesome'",
                "explanationIfWrong": "Quotes must match (both double or both single)."
              },
              {
                "id": "D",
                "text": "{Python is awesome}",
                "explanationIfWrong": "Braces define sets or dictionaries, not strings."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Text surrounded by matching quotation marks is a valid string literal."
          }
        ]
      },
      {
        "heading": "Integer Data Type (int)",
        "text": "The integer (int) type represents whole numbers with no fractional component (such as -10, 0, 42, 1000). Integers must NOT be enclosed in quotes.",
        "codeSnippet": "items = 5\ntemperature = -8\nprint(type(items))\nprint(items * 2)",
        "terminalOutput": "<class 'int'>\n10",
        "mcq": {
          "id": "q-1.3-3-v1",
          "question": "What is the data type of the number -42 written without quotes in Python?",
          "options": [
            {
              "id": "A",
              "text": "int (integer)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "float",
              "explanationIfWrong": "Floats have a decimal point; whole numbers are int."
            },
            {
              "id": "C",
              "text": "str",
              "explanationIfWrong": "Strings require quotes."
            },
            {
              "id": "D",
              "text": "bool",
              "explanationIfWrong": "Booleans are True or False."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Positive, negative, and zero whole numbers without decimals are integers (int)."
        },
        "retestMcq": {
          "id": "q-1.3-3-v2",
          "question": "What is the key difference between 100 and \"100\" in Python?",
          "options": [
            {
              "id": "A",
              "text": "100 is an integer number you can do math with, while \"100\" is text",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "There is no difference; Python treats them identically",
              "explanationIfWrong": "int and str are completely different data types."
            },
            {
              "id": "C",
              "text": "\"100\" is faster in calculations",
              "explanationIfWrong": "Text cannot be calculated directly."
            },
            {
              "id": "D",
              "text": "100 is a floating-point number",
              "explanationIfWrong": "100 has no decimal point, so it is an integer."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "100 is an int numeric value; \"100\" is a str text literal."
        },
        "questionPool": [
          {
            "id": "q-1.3-3-v1",
            "question": "What is the data type of the number -42 written without quotes in Python?",
            "options": [
              {
                "id": "A",
                "text": "int (integer)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "float",
                "explanationIfWrong": "Floats have a decimal point; whole numbers are int."
              },
              {
                "id": "C",
                "text": "str",
                "explanationIfWrong": "Strings require quotes."
              },
              {
                "id": "D",
                "text": "bool",
                "explanationIfWrong": "Booleans are True or False."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Positive, negative, and zero whole numbers without decimals are integers (int)."
          },
          {
            "id": "q-1.3-3-v2",
            "question": "What is the key difference between 100 and \"100\" in Python?",
            "options": [
              {
                "id": "A",
                "text": "100 is an integer number you can do math with, while \"100\" is text",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "There is no difference; Python treats them identically",
                "explanationIfWrong": "int and str are completely different data types."
              },
              {
                "id": "C",
                "text": "\"100\" is faster in calculations",
                "explanationIfWrong": "Text cannot be calculated directly."
              },
              {
                "id": "D",
                "text": "100 is a floating-point number",
                "explanationIfWrong": "100 has no decimal point, so it is an integer."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "100 is an int numeric value; \"100\" is a str text literal."
          },
          {
            "id": "q-1.3-3-v3",
            "question": "What does print(type(0)) output in Python?",
            "options": [
              {
                "id": "A",
                "text": "<class 'int'>",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "<class 'bool'>",
                "explanationIfWrong": "0 is an integer, False is boolean."
              },
              {
                "id": "C",
                "text": "<class 'float'>",
                "explanationIfWrong": "0.0 is float, 0 is int."
              },
              {
                "id": "D",
                "text": "<class 'none'>",
                "explanationIfWrong": "0 is a valid integer."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Zero written without a decimal point is an instance of the integer class."
          }
        ]
      },
      {
        "heading": "Floating-Point Numbers (float)",
        "text": "The float type represents numbers with a decimal fraction (such as 3.14, 0.5, -2.75, or 4.0). Any number containing a decimal point is treated as a float by Python.",
        "codeSnippet": "price = 19.99\nratio = 4.0\nprint(type(price))\nprint(type(ratio))",
        "terminalOutput": "<class 'float'>\n<class 'float'>",
        "mcq": {
          "id": "q-1.3-4-v1",
          "question": "What data type is the value 7.0 in Python?",
          "options": [
            {
              "id": "A",
              "text": "float (floating-point number)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "int (integer)",
              "explanationIfWrong": "Even though the fractional part is zero, the decimal point makes it a float."
            },
            {
              "id": "C",
              "text": "str",
              "explanationIfWrong": "It is not enclosed in quotes."
            },
            {
              "id": "D",
              "text": "decimal",
              "explanationIfWrong": "Python's standard built-in decimal type is called float."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The presence of the decimal point indicates a float in Python."
        },
        "retestMcq": {
          "id": "q-1.3-4-v2",
          "question": "Which of the following values is a Python float?",
          "options": [
            {
              "id": "A",
              "text": "3.14159",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "42",
              "explanationIfWrong": "42 is a whole number (int)."
            },
            {
              "id": "C",
              "text": "\"3.14\"",
              "explanationIfWrong": "Enclosed in quotes, this is a string (str)."
            },
            {
              "id": "D",
              "text": "True",
              "explanationIfWrong": "True is a boolean (bool)."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "3.14159 is a numeric value with decimal digits, making it a float."
        },
        "questionPool": [
          {
            "id": "q-1.3-4-v1",
            "question": "What data type is the value 7.0 in Python?",
            "options": [
              {
                "id": "A",
                "text": "float (floating-point number)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "int (integer)",
                "explanationIfWrong": "Even though the fractional part is zero, the decimal point makes it a float."
              },
              {
                "id": "C",
                "text": "str",
                "explanationIfWrong": "It is not enclosed in quotes."
              },
              {
                "id": "D",
                "text": "decimal",
                "explanationIfWrong": "Python's standard built-in decimal type is called float."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The presence of the decimal point indicates a float in Python."
          },
          {
            "id": "q-1.3-4-v2",
            "question": "Which of the following values is a Python float?",
            "options": [
              {
                "id": "A",
                "text": "3.14159",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "42",
                "explanationIfWrong": "42 is a whole number (int)."
              },
              {
                "id": "C",
                "text": "\"3.14\"",
                "explanationIfWrong": "Enclosed in quotes, this is a string (str)."
              },
              {
                "id": "D",
                "text": "True",
                "explanationIfWrong": "True is a boolean (bool)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "3.14159 is a numeric value with decimal digits, making it a float."
          },
          {
            "id": "q-1.3-4-v3",
            "question": "What is the output of print(type(0.25))?",
            "options": [
              {
                "id": "A",
                "text": "<class 'float'>",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "<class 'fraction'>",
                "explanationIfWrong": "Python categorizes decimal numbers as float."
              },
              {
                "id": "C",
                "text": "<class 'int'>",
                "explanationIfWrong": "0.25 has decimal digits and is not an integer."
              },
              {
                "id": "D",
                "text": "<class 'double'>",
                "explanationIfWrong": "In Python, real numbers are called float, not double."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Decimal numbers in Python belong to the float class."
          }
        ]
      },
      {
        "heading": "Type Conversion (int, float, str)",
        "text": "Python provides conversion functions: int() converts to integer, float() converts to decimal, and str() converts values to text. Converting user input with int(input()) is essential for math operations.",
        "codeSnippet": "text_num = \"50\"\nreal_num = int(text_num)\nprint(real_num + 10)\n\npi_float = float(\"3.14\")\nprint(pi_float * 2)",
        "terminalOutput": "60\n6.28",
        "mcq": {
          "id": "q-1.3-5-v1",
          "question": "How do you convert a string variable text_age = \"20\" into an integer so you can do math?",
          "options": [
            {
              "id": "A",
              "text": "int(text_age)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "str(text_age)",
              "explanationIfWrong": "str() converts to text; text_age is already text."
            },
            {
              "id": "C",
              "text": "to_number(text_age)",
              "explanationIfWrong": "to_number() does not exist in Python."
            },
            {
              "id": "D",
              "text": "float_to_int(text_age)",
              "explanationIfWrong": "The built-in function is int()."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "int() converts numeric string representations into actual integer values."
        },
        "retestMcq": {
          "id": "q-1.3-5-v2",
          "question": "What is the result of running int(\"15\") + 5?",
          "options": [
            {
              "id": "A",
              "text": "20 (the string \"15\" is converted to 15, then 5 is added)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "\"155\"",
              "explanationIfWrong": "int(\"15\") converts it to a number, so + performs arithmetic addition."
            },
            {
              "id": "C",
              "text": "TypeError",
              "explanationIfWrong": "Both operands are numbers (15 and 5), so addition is fully valid."
            },
            {
              "id": "D",
              "text": "\"20\"",
              "explanationIfWrong": "The math result is the integer 20, not a string."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "int(\"15\") yields the number 15, and 15 + 5 evaluates to 20."
        },
        "questionPool": [
          {
            "id": "q-1.3-5-v1",
            "question": "How do you convert a string variable text_age = \"20\" into an integer so you can do math?",
            "options": [
              {
                "id": "A",
                "text": "int(text_age)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "str(text_age)",
                "explanationIfWrong": "str() converts to text; text_age is already text."
              },
              {
                "id": "C",
                "text": "to_number(text_age)",
                "explanationIfWrong": "to_number() does not exist in Python."
              },
              {
                "id": "D",
                "text": "float_to_int(text_age)",
                "explanationIfWrong": "The built-in function is int()."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "int() converts numeric string representations into actual integer values."
          },
          {
            "id": "q-1.3-5-v2",
            "question": "What is the result of running int(\"15\") + 5?",
            "options": [
              {
                "id": "A",
                "text": "20 (the string \"15\" is converted to 15, then 5 is added)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "\"155\"",
                "explanationIfWrong": "int(\"15\") converts it to a number, so + performs arithmetic addition."
              },
              {
                "id": "C",
                "text": "TypeError",
                "explanationIfWrong": "Both operands are numbers (15 and 5), so addition is fully valid."
              },
              {
                "id": "D",
                "text": "\"20\"",
                "explanationIfWrong": "The math result is the integer 20, not a string."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "int(\"15\") yields the number 15, and 15 + 5 evaluates to 20."
          },
          {
            "id": "q-1.3-5-v3",
            "question": "What happens if you run int(\"hello\") where the string contains non-digit letters?",
            "options": [
              {
                "id": "A",
                "text": "ValueError: invalid literal for int()",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "It converts each letter to 0",
                "explanationIfWrong": "int() requires valid numeric digits to convert."
              },
              {
                "id": "C",
                "text": "It returns None",
                "explanationIfWrong": "It raises a ValueError runtime exception."
              },
              {
                "id": "D",
                "text": "It prints \"hello\"",
                "explanationIfWrong": "Python raises a ValueError because \"hello\" is not a valid number."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "int() raises a ValueError when the string does not represent a valid integer."
          }
        ]
      }
    ]
  },
  {
    "id": "1-4-arithmetic",
    "number": "1.4",
    "title": "Arithmetic Operations & Calculations",
    "subtitle": "Master operators, float vs integer division, modulo, powers, and precedence.",
    "readTime": "20 min",
    "objectives": [
      "Perform basic arithmetic with +, -, and *",
      "Understand floating-point division (/) and its return type",
      "Use floor division (//) for whole-number quotients",
      "Calculate remainders using the modulo operator (%)",
      "Raise numbers to powers using exponentiation (**)",
      "Control evaluation order using parentheses ()"
    ],
    "theoryBlocks": [
      {
        "heading": "Basic Arithmetic and Precedence (PEMDAS)",
        "text": "Python supports standard arithmetic: + (addition), - (subtraction), and * (multiplication). Multiplication and division have higher precedence and are calculated before addition and subtraction.",
        "codeSnippet": "result = 5 + 3 * 2\nprint(result) # 3 * 2 = 6, then 5 + 6 = 11",
        "terminalOutput": "11",
        "mcq": {
          "id": "q-1.4-0-v1",
          "question": "What is the output of print(10 - 2 * 3)?",
          "options": [
            {
              "id": "A",
              "text": "4 (2 * 3 is calculated first = 6, then 10 - 6 = 4)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "24 ((10 - 2) * 3 = 24)",
              "explanationIfWrong": "Multiplication (*) takes priority over subtraction (-)."
            },
            {
              "id": "C",
              "text": "6",
              "explanationIfWrong": "10 - 6 = 4."
            },
            {
              "id": "D",
              "text": "16",
              "explanationIfWrong": "Multiplication precedes subtraction."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "By operator precedence rules, 2 * 3 = 6 is computed first, then 10 - 6 = 4."
        },
        "retestMcq": {
          "id": "q-1.4-0-v2",
          "question": "What is the result of 4 + 4 * 0?",
          "options": [
            {
              "id": "A",
              "text": "4 (4 * 0 is 0, then 4 + 0 is 4)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "0 ((4 + 4) * 0 = 0)",
              "explanationIfWrong": "Multiplication is performed before addition."
            },
            {
              "id": "C",
              "text": "8",
              "explanationIfWrong": "4 * 0 is 0, not 4."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "Multiplying by 0 is standard arithmetic."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Multiplication has higher priority: 4 * 0 = 0, followed by 4 + 0 = 4."
        },
        "questionPool": [
          {
            "id": "q-1.4-0-v1",
            "question": "What is the output of print(10 - 2 * 3)?",
            "options": [
              {
                "id": "A",
                "text": "4 (2 * 3 is calculated first = 6, then 10 - 6 = 4)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "24 ((10 - 2) * 3 = 24)",
                "explanationIfWrong": "Multiplication (*) takes priority over subtraction (-)."
              },
              {
                "id": "C",
                "text": "6",
                "explanationIfWrong": "10 - 6 = 4."
              },
              {
                "id": "D",
                "text": "16",
                "explanationIfWrong": "Multiplication precedes subtraction."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "By operator precedence rules, 2 * 3 = 6 is computed first, then 10 - 6 = 4."
          },
          {
            "id": "q-1.4-0-v2",
            "question": "What is the result of 4 + 4 * 0?",
            "options": [
              {
                "id": "A",
                "text": "4 (4 * 0 is 0, then 4 + 0 is 4)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "0 ((4 + 4) * 0 = 0)",
                "explanationIfWrong": "Multiplication is performed before addition."
              },
              {
                "id": "C",
                "text": "8",
                "explanationIfWrong": "4 * 0 is 0, not 4."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "Multiplying by 0 is standard arithmetic."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiplication has higher priority: 4 * 0 = 0, followed by 4 + 0 = 4."
          },
          {
            "id": "q-1.4-0-v3",
            "question": "In the expression 20 - 5 * 2 + 3, what is the calculated value?",
            "options": [
              {
                "id": "A",
                "text": "13 (5 * 2 = 10, then 20 - 10 = 10, then 10 + 3 = 13)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "33",
                "explanationIfWrong": "Multiplication happens first."
              },
              {
                "id": "C",
                "text": "23",
                "explanationIfWrong": "Evaluate from left to right after multiplication."
              },
              {
                "id": "D",
                "text": "7",
                "explanationIfWrong": "20 - 10 + 3 = 13."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "5 * 2 evaluates to 10 first. Then 20 - 10 + 3 evaluates left-to-right to 13."
          }
        ]
      },
      {
        "heading": "Floating-Point Division (/)",
        "text": "In Python, the single forward slash (/) always performs floating-point division and returns a float, even if the numbers divide evenly without a remainder.",
        "codeSnippet": "print(8 / 2)\nprint(7 / 2)\nprint(type(8 / 2))",
        "terminalOutput": "4.0\n3.5\n<class 'float'>",
        "mcq": {
          "id": "q-1.4-1-v1",
          "question": "What is the exact result of running print(10 / 2) in Python 3?",
          "options": [
            {
              "id": "A",
              "text": "5.0 (floating-point number with decimal)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "5 (integer without decimal)",
              "explanationIfWrong": "Single slash division in Python 3 always returns a float."
            },
            {
              "id": "C",
              "text": "\"5.0\" (string)",
              "explanationIfWrong": "The result is a numeric float, not a string."
            },
            {
              "id": "D",
              "text": "5.2",
              "explanationIfWrong": "10 divided by 2 is exactly 5.0."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Single slash division (/) in Python always produces a float result (5.0)."
        },
        "retestMcq": {
          "id": "q-1.4-1-v2",
          "question": "What data type does the division expression 12 / 3 produce in Python?",
          "options": [
            {
              "id": "A",
              "text": "float",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "int",
              "explanationIfWrong": "Even when division is exact, / returns a float."
            },
            {
              "id": "C",
              "text": "str",
              "explanationIfWrong": "Division produces numeric floats, not text."
            },
            {
              "id": "D",
              "text": "decimal",
              "explanationIfWrong": "Python's standard type is float."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "All division operations with / return a float type in Python."
        },
        "questionPool": [
          {
            "id": "q-1.4-1-v1",
            "question": "What is the exact result of running print(10 / 2) in Python 3?",
            "options": [
              {
                "id": "A",
                "text": "5.0 (floating-point number with decimal)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "5 (integer without decimal)",
                "explanationIfWrong": "Single slash division in Python 3 always returns a float."
              },
              {
                "id": "C",
                "text": "\"5.0\" (string)",
                "explanationIfWrong": "The result is a numeric float, not a string."
              },
              {
                "id": "D",
                "text": "5.2",
                "explanationIfWrong": "10 divided by 2 is exactly 5.0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Single slash division (/) in Python always produces a float result (5.0)."
          },
          {
            "id": "q-1.4-1-v2",
            "question": "What data type does the division expression 12 / 3 produce in Python?",
            "options": [
              {
                "id": "A",
                "text": "float",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "int",
                "explanationIfWrong": "Even when division is exact, / returns a float."
              },
              {
                "id": "C",
                "text": "str",
                "explanationIfWrong": "Division produces numeric floats, not text."
              },
              {
                "id": "D",
                "text": "decimal",
                "explanationIfWrong": "Python's standard type is float."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "All division operations with / return a float type in Python."
          },
          {
            "id": "q-1.4-1-v3",
            "question": "What will print(type(4 / 2)) display?",
            "options": [
              {
                "id": "A",
                "text": "<class 'float'>",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "<class 'int'>",
                "explanationIfWrong": "Single slash / always produces a float."
              },
              {
                "id": "C",
                "text": "<class 'number'>",
                "explanationIfWrong": "The class is named float in Python."
              },
              {
                "id": "D",
                "text": "<class 'division'>",
                "explanationIfWrong": "Python uses the float data type."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "4 / 2 results in 2.0, which belongs to <class 'float'>."
          }
        ]
      },
      {
        "heading": "Integer Floor Division (//)",
        "text": "The double forward slash (//) is the floor division operator. It divides two numbers and rounds down to the nearest integer, discarding any fractional remainder.",
        "codeSnippet": "print(7 // 2) # 7 / 2 = 3.5 -> rounds down to 3\nprint(10 // 3) # 10 / 3 = 3.333 -> rounds down to 3",
        "terminalOutput": "3\n3",
        "mcq": {
          "id": "q-1.4-2-v1",
          "question": "What is the output of print(7 // 2) in Python?",
          "options": [
            {
              "id": "A",
              "text": "3 (it divides and truncates/rounds down to the integer quotient)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "3.5",
              "explanationIfWrong": "3.5 is the float division (7 / 2); // discards the fractional part."
            },
            {
              "id": "C",
              "text": "4",
              "explanationIfWrong": "Floor division rounds down, not up."
            },
            {
              "id": "D",
              "text": "1",
              "explanationIfWrong": "1 is the remainder (7 % 2), not the floor quotient."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Floor division (//) divides and drops the decimal part, returning 3."
        },
        "retestMcq": {
          "id": "q-1.4-2-v2",
          "question": "What is the result of 11 // 4?",
          "options": [
            {
              "id": "A",
              "text": "2 (4 fits into 11 two whole times)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "2.75",
              "explanationIfWrong": "2.75 is the float division result; // gives 2."
            },
            {
              "id": "C",
              "text": "3",
              "explanationIfWrong": "Floor division rounds down."
            },
            {
              "id": "D",
              "text": "8",
              "explanationIfWrong": "11 // 4 is 2."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "11 divided by 4 is 2.75; rounding down gives 2."
        },
        "questionPool": [
          {
            "id": "q-1.4-2-v1",
            "question": "What is the output of print(7 // 2) in Python?",
            "options": [
              {
                "id": "A",
                "text": "3 (it divides and truncates/rounds down to the integer quotient)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "3.5",
                "explanationIfWrong": "3.5 is the float division (7 / 2); // discards the fractional part."
              },
              {
                "id": "C",
                "text": "4",
                "explanationIfWrong": "Floor division rounds down, not up."
              },
              {
                "id": "D",
                "text": "1",
                "explanationIfWrong": "1 is the remainder (7 % 2), not the floor quotient."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Floor division (//) divides and drops the decimal part, returning 3."
          },
          {
            "id": "q-1.4-2-v2",
            "question": "What is the result of 11 // 4?",
            "options": [
              {
                "id": "A",
                "text": "2 (4 fits into 11 two whole times)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "2.75",
                "explanationIfWrong": "2.75 is the float division result; // gives 2."
              },
              {
                "id": "C",
                "text": "3",
                "explanationIfWrong": "Floor division rounds down."
              },
              {
                "id": "D",
                "text": "8",
                "explanationIfWrong": "11 // 4 is 2."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "11 divided by 4 is 2.75; rounding down gives 2."
          },
          {
            "id": "q-1.4-2-v3",
            "question": "How does // differ from / in Python?",
            "options": [
              {
                "id": "A",
                "text": "// returns the whole-number integer quotient (rounding down), while / returns a float with decimals",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "// is for comments while / is for division",
                "explanationIfWrong": "# is for comments in Python."
              },
              {
                "id": "C",
                "text": "// calculates square roots",
                "explanationIfWrong": "// is integer division."
              },
              {
                "id": "D",
                "text": "They are identical and produce the same output",
                "explanationIfWrong": "// returns an integer while / returns a float."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "// discards decimal fractions to give an integer, whereas / always keeps decimals as a float."
          }
        ]
      },
      {
        "heading": "The Modulo Operator (%)",
        "text": "The percent symbol (%) is the modulo operator. It calculates the remainder left over after dividing two integers. It is widely used to check whether a number is even (num % 2 == 0) or odd.",
        "codeSnippet": "print(10 % 3) # 3 goes into 10 three times (9), remainder is 1\nprint(8 % 2)  # 2 divides 8 evenly, remainder is 0",
        "terminalOutput": "1\n0",
        "mcq": {
          "id": "q-1.4-3-v1",
          "question": "What is the output of print(10 % 3)?",
          "options": [
            {
              "id": "A",
              "text": "1 (3 fits into 10 three times with 1 remaining)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "3 (the quotient)",
              "explanationIfWrong": "The quotient is given by //; % gives the remainder."
            },
            {
              "id": "C",
              "text": "3.333",
              "explanationIfWrong": "% calculates the integer remainder."
            },
            {
              "id": "D",
              "text": "0",
              "explanationIfWrong": "10 is not evenly divisible by 3."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "10 divided by 3 has a quotient of 3 with a remainder of 1."
        },
        "retestMcq": {
          "id": "q-1.4-3-v2",
          "question": "What is the value of 14 % 5 in Python?",
          "options": [
            {
              "id": "A",
              "text": "4 (5 * 2 = 10, remainder is 14 - 10 = 4)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "2 (the quotient)",
              "explanationIfWrong": "The remainder is 4."
            },
            {
              "id": "C",
              "text": "2.8",
              "explanationIfWrong": "% gives the integer remainder, not float division."
            },
            {
              "id": "D",
              "text": "5",
              "explanationIfWrong": "The remainder is 4."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "5 fits into 14 twice (10), leaving a remainder of 4."
        },
        "questionPool": [
          {
            "id": "q-1.4-3-v1",
            "question": "What is the output of print(10 % 3)?",
            "options": [
              {
                "id": "A",
                "text": "1 (3 fits into 10 three times with 1 remaining)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "3 (the quotient)",
                "explanationIfWrong": "The quotient is given by //; % gives the remainder."
              },
              {
                "id": "C",
                "text": "3.333",
                "explanationIfWrong": "% calculates the integer remainder."
              },
              {
                "id": "D",
                "text": "0",
                "explanationIfWrong": "10 is not evenly divisible by 3."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "10 divided by 3 has a quotient of 3 with a remainder of 1."
          },
          {
            "id": "q-1.4-3-v2",
            "question": "What is the value of 14 % 5 in Python?",
            "options": [
              {
                "id": "A",
                "text": "4 (5 * 2 = 10, remainder is 14 - 10 = 4)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "2 (the quotient)",
                "explanationIfWrong": "The remainder is 4."
              },
              {
                "id": "C",
                "text": "2.8",
                "explanationIfWrong": "% gives the integer remainder, not float division."
              },
              {
                "id": "D",
                "text": "5",
                "explanationIfWrong": "The remainder is 4."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "5 fits into 14 twice (10), leaving a remainder of 4."
          },
          {
            "id": "q-1.4-3-v3",
            "question": "How can you check if an integer n is an even number in Python?",
            "options": [
              {
                "id": "A",
                "text": "n % 2 == 0 (an even number has zero remainder when divided by 2)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "n // 2 == 0",
                "explanationIfWrong": "n // 2 gives half of n, not checking parity."
              },
              {
                "id": "C",
                "text": "n / 2 == 0",
                "explanationIfWrong": "Division only equals 0 if n is 0."
              },
              {
                "id": "D",
                "text": "n * 2 == 0",
                "explanationIfWrong": "This only equals 0 if n is 0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Even numbers divide by 2 with no remainder, so n % 2 equals 0."
          }
        ]
      },
      {
        "heading": "The Exponentiation Operator (**)",
        "text": "Python uses two asterisks (**) to raise a base number to an exponent (power). For example, 2 ** 3 means 2 cubed (2 * 2 * 2 = 8). Note that the caret symbol (^) in Python is bitwise XOR, NOT exponentiation!",
        "codeSnippet": "print(2 ** 3) # 2 to the power of 3 = 8\nprint(5 ** 2) # 5 squared = 25",
        "terminalOutput": "8\n25",
        "mcq": {
          "id": "q-1.4-4-v1",
          "question": "Which operator is used in Python to calculate powers (exponentiation)?",
          "options": [
            {
              "id": "A",
              "text": "** (two asterisks)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "^ (caret symbol)",
              "explanationIfWrong": "^ is bitwise XOR in Python, not exponentiation!"
            },
            {
              "id": "C",
              "text": "^^",
              "explanationIfWrong": "^^ is invalid syntax in Python."
            },
            {
              "id": "D",
              "text": "pow_op",
              "explanationIfWrong": "The standard operator is **."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "** is the power / exponentiation operator in Python."
        },
        "retestMcq": {
          "id": "q-1.4-4-v2",
          "question": "What is the output of print(3 ** 2)?",
          "options": [
            {
              "id": "A",
              "text": "9 (3 raised to the power of 2: 3 * 3 = 9)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "6 (3 * 2)",
              "explanationIfWrong": "3 * 2 is multiplication; 3 ** 2 is 3 squared (9)."
            },
            {
              "id": "C",
              "text": "1",
              "explanationIfWrong": "3 ** 2 is 9."
            },
            {
              "id": "D",
              "text": "32",
              "explanationIfWrong": "** calculates powers, not string concatenation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "3 ** 2 computes 3 squared, which is 9."
        },
        "questionPool": [
          {
            "id": "q-1.4-4-v1",
            "question": "Which operator is used in Python to calculate powers (exponentiation)?",
            "options": [
              {
                "id": "A",
                "text": "** (two asterisks)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "^ (caret symbol)",
                "explanationIfWrong": "^ is bitwise XOR in Python, not exponentiation!"
              },
              {
                "id": "C",
                "text": "^^",
                "explanationIfWrong": "^^ is invalid syntax in Python."
              },
              {
                "id": "D",
                "text": "pow_op",
                "explanationIfWrong": "The standard operator is **."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "** is the power / exponentiation operator in Python."
          },
          {
            "id": "q-1.4-4-v2",
            "question": "What is the output of print(3 ** 2)?",
            "options": [
              {
                "id": "A",
                "text": "9 (3 raised to the power of 2: 3 * 3 = 9)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "6 (3 * 2)",
                "explanationIfWrong": "3 * 2 is multiplication; 3 ** 2 is 3 squared (9)."
              },
              {
                "id": "C",
                "text": "1",
                "explanationIfWrong": "3 ** 2 is 9."
              },
              {
                "id": "D",
                "text": "32",
                "explanationIfWrong": "** calculates powers, not string concatenation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "3 ** 2 computes 3 squared, which is 9."
          },
          {
            "id": "q-1.4-4-v3",
            "question": "What does 2 ** 4 evaluate to in Python?",
            "options": [
              {
                "id": "A",
                "text": "16 (2 * 2 * 2 * 2 = 16)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "8 (2 * 4)",
                "explanationIfWrong": "2 ** 4 is 2 to the 4th power (16)."
              },
              {
                "id": "C",
                "text": "24",
                "explanationIfWrong": "2 to the 4th power is 16."
              },
              {
                "id": "D",
                "text": "6",
                "explanationIfWrong": "2 + 4 is 6; 2 ** 4 is 16."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "2 multiplied by itself 4 times is 16."
          }
        ]
      },
      {
        "heading": "Parentheses for Controlling Precedence",
        "text": "Just like in standard algebra, you can use parentheses () to group calculations and force them to evaluate first, overriding the default operator precedence.",
        "codeSnippet": "normal = 2 + 3 * 4   # 2 + 12 = 14\nforced = (2 + 3) * 4 # 5 * 4 = 20\nprint(normal)\nprint(forced)",
        "terminalOutput": "14\n20",
        "mcq": {
          "id": "q-1.4-5-v1",
          "question": "What is the output of print((3 + 4) * 2)?",
          "options": [
            {
              "id": "A",
              "text": "14 (parentheses evaluate first: 3 + 4 = 7, then 7 * 2 = 14)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "11 (3 + 8 = 11)",
              "explanationIfWrong": "Parentheses override default precedence, forcing addition first."
            },
            {
              "id": "C",
              "text": "24",
              "explanationIfWrong": "7 * 2 = 14."
            },
            {
              "id": "D",
              "text": "18",
              "explanationIfWrong": "3 + 4 is 7, and 7 * 2 is 14."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Expressions inside parentheses are always calculated first before outer operators."
        },
        "retestMcq": {
          "id": "q-1.4-5-v2",
          "question": "How can you ensure that 10 - 4 is computed before multiplying by 5 in Python?",
          "options": [
            {
              "id": "A",
              "text": "(10 - 4) * 5",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "10 - 4 * 5",
              "explanationIfWrong": "Without parentheses, 4 * 5 = 20 happens first."
            },
            {
              "id": "C",
              "text": "[10 - 4] * 5",
              "explanationIfWrong": "Square brackets create a list in Python, not mathematical grouping."
            },
            {
              "id": "D",
              "text": "{10 - 4} * 5",
              "explanationIfWrong": "Curly braces define sets or dictionaries."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Round parentheses () are the only grouping symbols for mathematical operations in Python."
        },
        "questionPool": [
          {
            "id": "q-1.4-5-v1",
            "question": "What is the output of print((3 + 4) * 2)?",
            "options": [
              {
                "id": "A",
                "text": "14 (parentheses evaluate first: 3 + 4 = 7, then 7 * 2 = 14)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "11 (3 + 8 = 11)",
                "explanationIfWrong": "Parentheses override default precedence, forcing addition first."
              },
              {
                "id": "C",
                "text": "24",
                "explanationIfWrong": "7 * 2 = 14."
              },
              {
                "id": "D",
                "text": "18",
                "explanationIfWrong": "3 + 4 is 7, and 7 * 2 is 14."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Expressions inside parentheses are always calculated first before outer operators."
          },
          {
            "id": "q-1.4-5-v2",
            "question": "How can you ensure that 10 - 4 is computed before multiplying by 5 in Python?",
            "options": [
              {
                "id": "A",
                "text": "(10 - 4) * 5",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "10 - 4 * 5",
                "explanationIfWrong": "Without parentheses, 4 * 5 = 20 happens first."
              },
              {
                "id": "C",
                "text": "[10 - 4] * 5",
                "explanationIfWrong": "Square brackets create a list in Python, not mathematical grouping."
              },
              {
                "id": "D",
                "text": "{10 - 4} * 5",
                "explanationIfWrong": "Curly braces define sets or dictionaries."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Round parentheses () are the only grouping symbols for mathematical operations in Python."
          },
          {
            "id": "q-1.4-5-v3",
            "question": "What is the value of 100 / (2 * 5) in Python?",
            "options": [
              {
                "id": "A",
                "text": "10.0 (2 * 5 = 10 first, then 100 / 10 = 10.0)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "250.0 ((100 / 2) * 5 = 250.0)",
                "explanationIfWrong": "Parentheses force 2 * 5 to evaluate before division."
              },
              {
                "id": "C",
                "text": "10 (integer)",
                "explanationIfWrong": "Single slash division always returns a float (10.0)."
              },
              {
                "id": "D",
                "text": "50.0",
                "explanationIfWrong": "100 / 10 is 10.0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The parentheses force 2 * 5 = 10 first, and 100 / 10 produces 10.0 as a float."
          }
        ]
      }
    ]
  },
  {
    "id": "1-5-conditionals",
    "number": "1.5",
    "title": "Conditional Statements & Logic",
    "subtitle": "Branch your code with if, else, elif, comparison operators, and logical and / or / not.",
    "readTime": "25 min",
    "objectives": [
      "Write branching code using the if statement",
      "Master Python 4-space indentation rules",
      "Compare values using ==, !=, <, >, <=, and >=",
      "Provide fallback alternatives using the else branch",
      "Chain multiple condition checks with elif",
      "Combine conditions with logical operators (and, or, not)"
    ],
    "theoryBlocks": [
      {
        "heading": "The if Statement and Conditions",
        "text": "An if statement evaluates a boolean condition (True or False). If the condition is True, the indented block of code directly underneath it is executed. If False, Python skips it.",
        "codeSnippet": "points = 85\nif points >= 80:\n    print(\"Exam Passed!\")\nprint(\"Done.\")",
        "terminalOutput": "Exam Passed!\nDone.",
        "mcq": {
          "id": "q-1.5-0-v1",
          "question": "Under what condition does the indented code inside an if block execute?",
          "options": [
            {
              "id": "A",
              "text": "Only when the condition expression evaluates to True",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Every time the program runs, regardless of the condition",
              "explanationIfWrong": "An if statement only executes when its condition is True."
            },
            {
              "id": "C",
              "text": "Only when the condition evaluates to False",
              "explanationIfWrong": "When False, the if block is skipped."
            },
            {
              "id": "D",
              "text": "Only if the user types input",
              "explanationIfWrong": "The if condition evaluates any boolean expression in code."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The body of an if statement executes if and only if its condition evaluates to True."
        },
        "retestMcq": {
          "id": "q-1.5-0-v2",
          "question": "Consider the code:\nage = 15\nif age >= 18:\n    print(\"Adult\")\nprint(\"Program finished\")\nWhat will print?",
          "options": [
            {
              "id": "A",
              "text": "Program finished (the if block is skipped because 15 >= 18 is False)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Adult",
              "explanationIfWrong": "15 >= 18 is False, so \"Adult\" is not printed."
            },
            {
              "id": "C",
              "text": "Adult followed by Program finished",
              "explanationIfWrong": "The condition is False, so the indented code is skipped."
            },
            {
              "id": "D",
              "text": "An error message",
              "explanationIfWrong": "The code is completely valid; it simply skips the false branch."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since 15 >= 18 evaluates to False, the indented print is skipped and execution continues after the block."
        },
        "questionPool": [
          {
            "id": "q-1.5-0-v1",
            "question": "Under what condition does the indented code inside an if block execute?",
            "options": [
              {
                "id": "A",
                "text": "Only when the condition expression evaluates to True",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Every time the program runs, regardless of the condition",
                "explanationIfWrong": "An if statement only executes when its condition is True."
              },
              {
                "id": "C",
                "text": "Only when the condition evaluates to False",
                "explanationIfWrong": "When False, the if block is skipped."
              },
              {
                "id": "D",
                "text": "Only if the user types input",
                "explanationIfWrong": "The if condition evaluates any boolean expression in code."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The body of an if statement executes if and only if its condition evaluates to True."
          },
          {
            "id": "q-1.5-0-v2",
            "question": "Consider the code:\nage = 15\nif age >= 18:\n    print(\"Adult\")\nprint(\"Program finished\")\nWhat will print?",
            "options": [
              {
                "id": "A",
                "text": "Program finished (the if block is skipped because 15 >= 18 is False)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Adult",
                "explanationIfWrong": "15 >= 18 is False, so \"Adult\" is not printed."
              },
              {
                "id": "C",
                "text": "Adult followed by Program finished",
                "explanationIfWrong": "The condition is False, so the indented code is skipped."
              },
              {
                "id": "D",
                "text": "An error message",
                "explanationIfWrong": "The code is completely valid; it simply skips the false branch."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since 15 >= 18 evaluates to False, the indented print is skipped and execution continues after the block."
          },
          {
            "id": "q-1.5-0-v3",
            "question": "Which symbol must appear at the end of the if condition line in Python?",
            "options": [
              {
                "id": "A",
                "text": ": (colon)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "; (semicolon)",
                "explanationIfWrong": "Python uses colons to start blocks, not semicolons."
              },
              {
                "id": "C",
                "text": "{ (open curly brace)",
                "explanationIfWrong": "Python does not use curly braces for code blocks."
              },
              {
                "id": "D",
                "text": "then",
                "explanationIfWrong": "Python does not use a \"then\" keyword."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A colon (:) is required at the end of an if statement header to introduce the indented block."
          }
        ]
      },
      {
        "heading": "Python Indentation Rules (4 Spaces)",
        "text": "Unlike other languages that use curly braces {}, Python uses whitespace indentation (standardly 4 spaces) to define which statements belong inside a block. Mismatched indentation triggers an IndentationError.",
        "codeSnippet": "if True:\n    print(\"This line is inside the if block\")\n    print(\"This line is also inside\")\nprint(\"This line is outside the block\")",
        "terminalOutput": "This line is inside the if block\nThis line is also inside\nThis line is outside the block",
        "mcq": {
          "id": "q-1.5-1-v1",
          "question": "How does the Python interpreter determine which lines of code belong inside an if block?",
          "options": [
            {
              "id": "A",
              "text": "By their indentation (consistent leading spaces)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "By surrounding them with curly braces { }",
              "explanationIfWrong": "Python does not use curly braces to delimit code blocks."
            },
            {
              "id": "C",
              "text": "By placing \"end if\" at the bottom",
              "explanationIfWrong": "Python has no \"end if\" keyword."
            },
            {
              "id": "D",
              "text": "By writing all commands on one single line",
              "explanationIfWrong": "Blocks are formatted on separate indented lines."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python strictly relies on consistent indentation levels to define code block scope."
        },
        "retestMcq": {
          "id": "q-1.5-1-v2",
          "question": "What error will occur if you write an if statement and forget to indent the line underneath it?",
          "options": [
            {
              "id": "A",
              "text": "IndentationError: expected an indented block",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "NameError",
              "explanationIfWrong": "NameError occurs when referencing an undefined variable."
            },
            {
              "id": "C",
              "text": "TypeError",
              "explanationIfWrong": "TypeError is about incompatible data types."
            },
            {
              "id": "D",
              "text": "The code runs normally",
              "explanationIfWrong": "Python strictly enforces indentation at parse time."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python raises an IndentationError when a block header (ending in :) is not followed by an indented block."
        },
        "questionPool": [
          {
            "id": "q-1.5-1-v1",
            "question": "How does the Python interpreter determine which lines of code belong inside an if block?",
            "options": [
              {
                "id": "A",
                "text": "By their indentation (consistent leading spaces)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "By surrounding them with curly braces { }",
                "explanationIfWrong": "Python does not use curly braces to delimit code blocks."
              },
              {
                "id": "C",
                "text": "By placing \"end if\" at the bottom",
                "explanationIfWrong": "Python has no \"end if\" keyword."
              },
              {
                "id": "D",
                "text": "By writing all commands on one single line",
                "explanationIfWrong": "Blocks are formatted on separate indented lines."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python strictly relies on consistent indentation levels to define code block scope."
          },
          {
            "id": "q-1.5-1-v2",
            "question": "What error will occur if you write an if statement and forget to indent the line underneath it?",
            "options": [
              {
                "id": "A",
                "text": "IndentationError: expected an indented block",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "NameError",
                "explanationIfWrong": "NameError occurs when referencing an undefined variable."
              },
              {
                "id": "C",
                "text": "TypeError",
                "explanationIfWrong": "TypeError is about incompatible data types."
              },
              {
                "id": "D",
                "text": "The code runs normally",
                "explanationIfWrong": "Python strictly enforces indentation at parse time."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python raises an IndentationError when a block header (ending in :) is not followed by an indented block."
          },
          {
            "id": "q-1.5-1-v3",
            "question": "What is the standard PEP 8 recommended indentation depth in Python?",
            "options": [
              {
                "id": "A",
                "text": "4 spaces per indentation level",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "1 space",
                "explanationIfWrong": "1 space is considered poor style and hard to read."
              },
              {
                "id": "C",
                "text": "8 spaces",
                "explanationIfWrong": "8 spaces is excessive; standard is 4 spaces."
              },
              {
                "id": "D",
                "text": "A random number of spaces",
                "explanationIfWrong": "Indentation must be strictly consistent."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 specifies exactly 4 spaces per indentation level for readable Python code."
          }
        ]
      },
      {
        "heading": "Comparison Operators (==, !=, <, >, <=, >=)",
        "text": "Comparison operators compare two values and produce a boolean (True or False). Remember: == tests for equality (are they equal?), while a single = assigns a value into a variable!",
        "codeSnippet": "x = 10\nprint(x == 10) # True\nprint(x != 5)  # True\nprint(x > 20)  # False",
        "terminalOutput": "True\nTrue\nFalse",
        "mcq": {
          "id": "q-1.5-2-v1",
          "question": "Which operator checks whether two values are equal in Python?",
          "options": [
            {
              "id": "A",
              "text": "== (double equals sign)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "= (single equals sign)",
              "explanationIfWrong": "Single = is the assignment operator, not equality comparison!"
            },
            {
              "id": "C",
              "text": "=== (triple equals sign)",
              "explanationIfWrong": "=== exists in JavaScript, but is invalid syntax in Python."
            },
            {
              "id": "D",
              "text": "equals",
              "explanationIfWrong": "Python uses the operator ==."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "== is the equality comparison operator; single = is variable assignment."
        },
        "retestMcq": {
          "id": "q-1.5-2-v2",
          "question": "What does the != operator mean in Python?",
          "options": [
            {
              "id": "A",
              "text": "Not equal to (returns True if the two values are different)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Strictly equal to",
              "explanationIfWrong": "== checks equality; != checks inequality."
            },
            {
              "id": "C",
              "text": "Factorial division",
              "explanationIfWrong": "!= is the inequality comparison operator."
            },
            {
              "id": "D",
              "text": "Assignment with negation",
              "explanationIfWrong": "!= is a comparison operator."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "!= evaluates to True when the two compared operands are not equal."
        },
        "questionPool": [
          {
            "id": "q-1.5-2-v1",
            "question": "Which operator checks whether two values are equal in Python?",
            "options": [
              {
                "id": "A",
                "text": "== (double equals sign)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "= (single equals sign)",
                "explanationIfWrong": "Single = is the assignment operator, not equality comparison!"
              },
              {
                "id": "C",
                "text": "=== (triple equals sign)",
                "explanationIfWrong": "=== exists in JavaScript, but is invalid syntax in Python."
              },
              {
                "id": "D",
                "text": "equals",
                "explanationIfWrong": "Python uses the operator ==."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "== is the equality comparison operator; single = is variable assignment."
          },
          {
            "id": "q-1.5-2-v2",
            "question": "What does the != operator mean in Python?",
            "options": [
              {
                "id": "A",
                "text": "Not equal to (returns True if the two values are different)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Strictly equal to",
                "explanationIfWrong": "== checks equality; != checks inequality."
              },
              {
                "id": "C",
                "text": "Factorial division",
                "explanationIfWrong": "!= is the inequality comparison operator."
              },
              {
                "id": "D",
                "text": "Assignment with negation",
                "explanationIfWrong": "!= is a comparison operator."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "!= evaluates to True when the two compared operands are not equal."
          },
          {
            "id": "q-1.5-2-v3",
            "question": "What will print(15 <= 15) output in Python?",
            "options": [
              {
                "id": "A",
                "text": "True (since 15 is less than OR EQUAL to 15)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "<= means less than or equal to, which is satisfied by 15."
              },
              {
                "id": "C",
                "text": "15",
                "explanationIfWrong": "Comparison operators return boolean True or False."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The boolean value True is returned."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "<= evaluates to True if the left operand is less than or equal to the right operand."
          }
        ]
      },
      {
        "heading": "The else Branch (Alternative Action)",
        "text": "The else block provides an alternative block of code that runs ONLY when the if condition evaluates to False. Exactly one of the two branches (either if or else) will execute.",
        "codeSnippet": "speed = 75\nif speed <= 60:\n    print(\"Safe driving\")\nelse:\n    print(\"Warning: Speeding!\")",
        "terminalOutput": "Warning: Speeding!",
        "mcq": {
          "id": "q-1.5-3-v1",
          "question": "When does the code inside an else block execute?",
          "options": [
            {
              "id": "A",
              "text": "When the preceding if condition evaluates to False",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "When the preceding if condition evaluates to True",
              "explanationIfWrong": "When if is True, the else block is skipped completely."
            },
            {
              "id": "C",
              "text": "It always executes regardless of the if condition",
              "explanationIfWrong": "else only runs when the if condition was not met."
            },
            {
              "id": "D",
              "text": "Only if an error occurs in the if block",
              "explanationIfWrong": "else is a standard logic branch, not error handling (except)."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The else block executes if and only if the preceding if condition is False."
        },
        "retestMcq": {
          "id": "q-1.5-3-v2",
          "question": "Consider the code:\nscore = 70\nif score >= 80:\n    print(\"Pass\")\nelse:\n    print(\"Retake\")\nWhat will be printed?",
          "options": [
            {
              "id": "A",
              "text": "Retake (because 70 >= 80 is False)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Pass",
              "explanationIfWrong": "70 is less than 80, so the if condition fails."
            },
            {
              "id": "C",
              "text": "Pass and Retake",
              "explanationIfWrong": "if and else are mutually exclusive; only one branch runs."
            },
            {
              "id": "D",
              "text": "Nothing is printed",
              "explanationIfWrong": "The else branch executes and prints \"Retake\"."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since 70 >= 80 is False, execution branches to the else block."
        },
        "questionPool": [
          {
            "id": "q-1.5-3-v1",
            "question": "When does the code inside an else block execute?",
            "options": [
              {
                "id": "A",
                "text": "When the preceding if condition evaluates to False",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "When the preceding if condition evaluates to True",
                "explanationIfWrong": "When if is True, the else block is skipped completely."
              },
              {
                "id": "C",
                "text": "It always executes regardless of the if condition",
                "explanationIfWrong": "else only runs when the if condition was not met."
              },
              {
                "id": "D",
                "text": "Only if an error occurs in the if block",
                "explanationIfWrong": "else is a standard logic branch, not error handling (except)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The else block executes if and only if the preceding if condition is False."
          },
          {
            "id": "q-1.5-3-v2",
            "question": "Consider the code:\nscore = 70\nif score >= 80:\n    print(\"Pass\")\nelse:\n    print(\"Retake\")\nWhat will be printed?",
            "options": [
              {
                "id": "A",
                "text": "Retake (because 70 >= 80 is False)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Pass",
                "explanationIfWrong": "70 is less than 80, so the if condition fails."
              },
              {
                "id": "C",
                "text": "Pass and Retake",
                "explanationIfWrong": "if and else are mutually exclusive; only one branch runs."
              },
              {
                "id": "D",
                "text": "Nothing is printed",
                "explanationIfWrong": "The else branch executes and prints \"Retake\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since 70 >= 80 is False, execution branches to the else block."
          },
          {
            "id": "q-1.5-3-v3",
            "question": "Can both the if block and its matching else block execute during the same program run?",
            "options": [
              {
                "id": "A",
                "text": "No, they are mutually exclusive; exactly one branch will execute",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Yes, if the condition is True for both",
                "explanationIfWrong": "A boolean condition can only be either True or False."
              },
              {
                "id": "C",
                "text": "Yes, if the program runs slowly",
                "explanationIfWrong": "Branch execution logic is strictly mutually exclusive."
              },
              {
                "id": "D",
                "text": "Only if there is no indentation",
                "explanationIfWrong": "They are mutually exclusive branching constructs."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An if/else construct executes either the if branch (if True) or the else branch (if False), never both."
          }
        ]
      },
      {
        "heading": "The elif Statement (Chained Conditions)",
        "text": "When you need to test more than two possibilities, use elif (short for \"else if\"). Python checks the conditions sequentially from top to bottom and runs ONLY the first matching True block.",
        "codeSnippet": "grade = 85\nif grade >= 90:\n    print(\"Grade A\")\nelif grade >= 80:\n    print(\"Grade B\")\nelse:\n    print(\"Grade C or below\")",
        "terminalOutput": "Grade B",
        "mcq": {
          "id": "q-1.5-4-v1",
          "question": "What is the purpose of the elif keyword in Python?",
          "options": [
            {
              "id": "A",
              "text": "To check an alternative condition if the preceding if/elif condition was False",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "To repeat a block of code 10 times",
              "explanationIfWrong": "Loops (while / for) repeat code; elif is for decision making."
            },
            {
              "id": "C",
              "text": "To terminate the entire program immediately",
              "explanationIfWrong": "exit() terminates programs; elif is a branch condition."
            },
            {
              "id": "D",
              "text": "To define a new function",
              "explanationIfWrong": "def defines functions; elif is for conditional branching."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "elif allows checking multiple mutually exclusive conditions in sequence."
        },
        "retestMcq": {
          "id": "q-1.5-4-v2",
          "question": "In a chain of if, two elif statements, and an else, what happens once one condition evaluates to True?",
          "options": [
            {
              "id": "A",
              "text": "Its block runs, and Python skips all remaining elif and else blocks in that chain",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Python continues checking all the remaining elif blocks anyway",
              "explanationIfWrong": "Python exits the chain after executing the first matching branch."
            },
            {
              "id": "C",
              "text": "All subsequent blocks run automatically",
              "explanationIfWrong": "Only the first matching branch executes."
            },
            {
              "id": "D",
              "text": "The program restarts from line 1",
              "explanationIfWrong": "Execution continues after the end of the entire if-elif-else construct."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python executes the first branch whose condition is True and skips the rest of the chain."
        },
        "questionPool": [
          {
            "id": "q-1.5-4-v1",
            "question": "What is the purpose of the elif keyword in Python?",
            "options": [
              {
                "id": "A",
                "text": "To check an alternative condition if the preceding if/elif condition was False",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "To repeat a block of code 10 times",
                "explanationIfWrong": "Loops (while / for) repeat code; elif is for decision making."
              },
              {
                "id": "C",
                "text": "To terminate the entire program immediately",
                "explanationIfWrong": "exit() terminates programs; elif is a branch condition."
              },
              {
                "id": "D",
                "text": "To define a new function",
                "explanationIfWrong": "def defines functions; elif is for conditional branching."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "elif allows checking multiple mutually exclusive conditions in sequence."
          },
          {
            "id": "q-1.5-4-v2",
            "question": "In a chain of if, two elif statements, and an else, what happens once one condition evaluates to True?",
            "options": [
              {
                "id": "A",
                "text": "Its block runs, and Python skips all remaining elif and else blocks in that chain",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "Python continues checking all the remaining elif blocks anyway",
                "explanationIfWrong": "Python exits the chain after executing the first matching branch."
              },
              {
                "id": "C",
                "text": "All subsequent blocks run automatically",
                "explanationIfWrong": "Only the first matching branch executes."
              },
              {
                "id": "D",
                "text": "The program restarts from line 1",
                "explanationIfWrong": "Execution continues after the end of the entire if-elif-else construct."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python executes the first branch whose condition is True and skips the rest of the chain."
          },
          {
            "id": "q-1.5-4-v3",
            "question": "Consider the code:\nx = 10\nif x > 20:\n    print(\"A\")\nelif x > 5:\n    print(\"B\")\nelif x > 2:\n    print(\"C\")\nelse:\n    print(\"D\")\nWhat is printed?",
            "options": [
              {
                "id": "A",
                "text": "B (x > 5 is True, so its block executes and the rest are skipped)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "B and C (because 10 is greater than both 5 and 2)",
                "explanationIfWrong": "Even though 10 > 2 is also True, Python stops after the first True branch (B)."
              },
              {
                "id": "C",
                "text": "A",
                "explanationIfWrong": "10 > 20 is False."
              },
              {
                "id": "D",
                "text": "D",
                "explanationIfWrong": "The else branch only runs if all previous conditions were False."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python checks top-to-bottom: 10 > 20 is False, 10 > 5 is True, so \"B\" prints and the remaining blocks are skipped."
          }
        ]
      },
      {
        "heading": "Logical Operators (and, or, not)",
        "text": "Logical operators combine or invert boolean values: \"and\" requires both sides to be True, \"or\" requires at least one side to be True, and \"not\" reverses True to False and False to True.",
        "codeSnippet": "age = 22\nhas_license = True\nif age >= 18 and has_license:\n    print(\"You can drive!\")\n\nraining = False\nif not raining:\n    print(\"Nice weather!\")",
        "terminalOutput": "You can drive!\nNice weather!",
        "mcq": {
          "id": "q-1.5-5-v1",
          "question": "When does a compound expression using the and operator evaluate to True?",
          "options": [
            {
              "id": "A",
              "text": "Only when BOTH condition expressions on either side are True",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "When at least one of the conditions is True",
              "explanationIfWrong": "That is the behavior of the \"or\" operator, not \"and\"."
            },
            {
              "id": "C",
              "text": "When both conditions are False",
              "explanationIfWrong": "Both must be True."
            },
            {
              "id": "D",
              "text": "Whenever the first condition is True, regardless of the second",
              "explanationIfWrong": "Both left and right must be True for \"and\"."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The and operator requires both operands to be True to yield True."
        },
        "retestMcq": {
          "id": "q-1.5-5-v2",
          "question": "What is the evaluated result of the expression: True or False in Python?",
          "options": [
            {
              "id": "A",
              "text": "True (the or operator requires at least one True condition)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "False",
              "explanationIfWrong": "Since the left side is True, the \"or\" expression evaluates to True."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "Boolean operations evaluate to True or False."
            },
            {
              "id": "D",
              "text": "TypeError",
              "explanationIfWrong": "Logical operators on booleans are fully valid."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The or operator returns True if either operand is True."
        },
        "questionPool": [
          {
            "id": "q-1.5-5-v1",
            "question": "When does a compound expression using the and operator evaluate to True?",
            "options": [
              {
                "id": "A",
                "text": "Only when BOTH condition expressions on either side are True",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "When at least one of the conditions is True",
                "explanationIfWrong": "That is the behavior of the \"or\" operator, not \"and\"."
              },
              {
                "id": "C",
                "text": "When both conditions are False",
                "explanationIfWrong": "Both must be True."
              },
              {
                "id": "D",
                "text": "Whenever the first condition is True, regardless of the second",
                "explanationIfWrong": "Both left and right must be True for \"and\"."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The and operator requires both operands to be True to yield True."
          },
          {
            "id": "q-1.5-5-v2",
            "question": "What is the evaluated result of the expression: True or False in Python?",
            "options": [
              {
                "id": "A",
                "text": "True (the or operator requires at least one True condition)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "Since the left side is True, the \"or\" expression evaluates to True."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "Boolean operations evaluate to True or False."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "Logical operators on booleans are fully valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The or operator returns True if either operand is True."
          },
          {
            "id": "q-1.5-5-v3",
            "question": "What does the expression not (10 > 5) evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "False (10 > 5 is True, and not inverts True to False)",
                "explanationIfWrong": ""
              },
              {
                "id": "B",
                "text": "True",
                "explanationIfWrong": "10 > 5 is True, and applying not turns it into False."
              },
              {
                "id": "C",
                "text": "10",
                "explanationIfWrong": "Logical operations return boolean values."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "The not operator can invert any boolean expression."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since 10 > 5 is True, not True evaluates to False."
          }
        ]
      }
    ]
  }
];

// Helper to retrieve or select active questions for a given level with duplicate prevention
export const getActiveQuestionsForLevel = (
  section: SectionContent,
  studentId: string,
  forceNewSet: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_question_history_${studentId}`;
  const activeSetKey = `dopilot_active_questions_${section.id}_${studentId}`;

  // If not forcing a new set, return previously assigned questions for this level if present
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

  // Retrieve student's seen question history
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
    // Get question pool for this concept
    const pool: McqQuestion[] = block.questionPool && block.questionPool.length > 0
      ? block.questionPool
      : [
          { ...block.mcq!, id: `q-${section.id}-${bIdx}-v1` },
          { ...(block.retestMcq || block.mcq!), id: `q-${section.id}-${bIdx}-v2` }
        ];

    // Filter out questions previously seen by this student
    const unseen = pool.filter(q => q.id && !seenIds.includes(q.id));

    let chosenQuestion: McqQuestion;
    if (unseen.length > 0) {
      chosenQuestion = unseen[0];
    } else {
      // If all questions in pool have already been seen across multiple resets, pick the least recently seen
      chosenQuestion = pool[pool.length - 1];
    }

    selectedQuestions.push(chosenQuestion);
    if (chosenQuestion.id && !seenIds.includes(chosenQuestion.id)) {
      newlySeenIds.push(chosenQuestion.id);
    }
  });

  // Save newly seen question IDs to student's persistent history
  const updatedHistory = [...seenIds, ...newlySeenIds];
  try {
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    localStorage.setItem(activeSetKey, JSON.stringify(selectedQuestions));
  } catch {}

  return selectedQuestions;
};

// Consecutive failure tracking helpers
export const getConsecutiveFailures = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevels = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCount = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCount = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResult = (
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
  const currentAttempt = getLevelAttemptCount(sectionId, studentId);

  if (isPassed) {
    // If student passed on Attempt 1 or Attempt 2:
    // Reset consecutive failed levels streak to 0!
    try {
      localStorage.setItem(`dopilot_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_locked_${studentId}`);
    } catch {}

    return {
      isPassed: true,
      attemptCount: currentAttempt,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    // FAILED this attempt (score <= 80%)
    if (currentAttempt === 1) {
      // First failure in this level
      // Prepare for Attempt 2
      setLevelAttemptCount(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevels(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      // Second failure in this level!
      const prevStreak = getConsecutiveFailedLevels(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailures = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_locked_${studentId}`);
    localStorage.removeItem(`dopilot_locked_progression_${studentId}`);
  } catch {}
};
