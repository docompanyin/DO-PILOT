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

export const PART_11_SECTIONS: SectionContent[] = [
  {
    "id": "11-1-list-comprehensions",
    "number": "11.1",
    "title": "List Comprehensions & Concise Syntax",
    "subtitle": "Transform and filter sequence data cleanly and expressively using Python's iconic list comprehension syntax.",
    "readTime": "20 min",
    "objectives": [
      "Understand list comprehension syntax: [expression for item in iterable]",
      "Replace multi-line for loops and .append() calls with concise one-liners",
      "Filter sequence elements conditionally using trailing if clauses",
      "Perform element-wise transformation using inline ternary conditionals (if-else before for)",
      "Process, clean, and normalize string collections efficiently",
      "Recognize when traditional loops are superior for readability and side-effect management"
    ],
    "theoryBlocks": [
      {
        "heading": "The Anatomy of List Comprehensions",
        "text": "A list comprehension provides a concise syntax for creating a new list by applying an expression to each item in an existing iterable. In traditional Python, transforming elements requires declaring an empty list, looping through items, and invoking .append(). List comprehensions condense this entire pattern into [expression for item in iterable]. Beyond brevity, list comprehensions are noticeably faster in CPython because they execute at C-level bytecode speed using the specialized LIST_APPEND instruction without the overhead of method attribute lookups.",
        "codeSnippet": "# Traditional iterative approach\nnumbers = [1, 2, 3, 4, 5]\nsquares_loop = []\nfor n in numbers:\n    squares_loop.append(n ** 2)\n\n# Modern list comprehension approach\nsquares_comp = [n ** 2 for n in numbers]\n\nprint(\"Loop result:\", squares_loop)\nprint(\"Comp result:\", squares_comp)",
        "terminalOutput": "Loop result: [1, 4, 9, 16, 25]\nComp result: [1, 4, 9, 16, 25]",
        "tip": "List comprehensions read naturally in English: 'Give me n squared for each n in numbers'.",
        "mcq": {
          "question": "What is the primary syntactical structure of a standard list comprehension in Python?",
          "options": [
            {
              "id": "A",
              "text": "[expression for item in iterable]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "{for item in iterable: expression}",
              "explanationIfWrong": "Curly braces denote dicts or sets, and for comes after expression."
            },
            {
              "id": "C",
              "text": "list(item -> expression in iterable)",
              "explanationIfWrong": "This is arrow syntax from JavaScript or Java, not Python."
            },
            {
              "id": "D",
              "text": "[for item in iterable -> expression]",
              "explanationIfWrong": "The expression must precede the 'for' clause in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python list comprehensions place the output expression first, followed by the 'for item in iterable' clause inside square brackets: [expr for item in iterable].",
          "id": "q-11-1-list-comprehensions-0-v1"
        },
        "retestMcq": {
          "question": "Why are list comprehensions generally faster in CPython than equivalent for loops using .append()?",
          "options": [
            {
              "id": "A",
              "text": "They use optimized bytecode (LIST_APPEND) and avoid repetitive Python-level method lookup and function call overhead",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "They run asynchronously on separate CPU threads",
              "explanationIfWrong": "List comprehensions are strictly synchronous."
            },
            {
              "id": "C",
              "text": "They skip Python type checking altogether",
              "explanationIfWrong": "Python type rules remain identical."
            },
            {
              "id": "D",
              "text": "They compile directly into GPU machine code",
              "explanationIfWrong": "CPython runs on the CPU bytecode interpreter."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "List comprehensions run in optimized C bytecode where the list size and appending mechanism avoid repeated attribute lookups of the '.append' method.",
          "id": "q-11-1-list-comprehensions-0-v2"
        },
        "questionPool": [
          {
            "question": "What is the primary syntactical structure of a standard list comprehension in Python?",
            "options": [
              {
                "id": "A",
                "text": "[expression for item in iterable]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "{for item in iterable: expression}",
                "explanationIfWrong": "Curly braces denote dicts or sets, and for comes after expression."
              },
              {
                "id": "C",
                "text": "list(item -> expression in iterable)",
                "explanationIfWrong": "This is arrow syntax from JavaScript or Java, not Python."
              },
              {
                "id": "D",
                "text": "[for item in iterable -> expression]",
                "explanationIfWrong": "The expression must precede the 'for' clause in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python list comprehensions place the output expression first, followed by the 'for item in iterable' clause inside square brackets: [expr for item in iterable].",
            "id": "q-11-1-list-comprehensions-0-v1"
          },
          {
            "question": "Why are list comprehensions generally faster in CPython than equivalent for loops using .append()?",
            "options": [
              {
                "id": "A",
                "text": "They use optimized bytecode (LIST_APPEND) and avoid repetitive Python-level method lookup and function call overhead",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They run asynchronously on separate CPU threads",
                "explanationIfWrong": "List comprehensions are strictly synchronous."
              },
              {
                "id": "C",
                "text": "They skip Python type checking altogether",
                "explanationIfWrong": "Python type rules remain identical."
              },
              {
                "id": "D",
                "text": "They compile directly into GPU machine code",
                "explanationIfWrong": "CPython runs on the CPU bytecode interpreter."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "List comprehensions run in optimized C bytecode where the list size and appending mechanism avoid repeated attribute lookups of the '.append' method.",
            "id": "q-11-1-list-comprehensions-0-v2"
          },
          {
            "question": "What is the result of evaluating: [x * 3 for x in [1, 2, 3]]?",
            "options": [
              {
                "id": "A",
                "text": "[3, 6, 9]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[1, 2, 3, 1, 2, 3, 1, 2, 3]",
                "explanationIfWrong": "Each integer is multiplied by 3; list repetition applies to lists, not elements."
              },
              {
                "id": "C",
                "text": "(3, 6, 9)",
                "explanationIfWrong": "Square brackets produce a list, not a tuple."
              },
              {
                "id": "D",
                "text": "[1, 4, 9]",
                "explanationIfWrong": "Multiplication by 3 produces 3, 6, 9, not powers."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The comprehension multiplies each integer x by 3, yielding [1*3, 2*3, 3*3] which is [3, 6, 9].",
            "id": "q-11-1-list-comprehensions-0-v3"
          }
        ]
      },
      {
        "heading": "Filtering Elements with Trailing 'if' Clauses",
        "text": "You can filter items by appending an if clause to the end of the comprehension: [expression for item in iterable if condition]. In this structure, the output expression is evaluated and appended to the new list ONLY IF the condition evaluates to True. Items that do not satisfy the condition are skipped entirely. This eliminates the need for an explicit if statement nested inside a loop body.",
        "codeSnippet": "numbers = [12, -7, 5, 0, -3, 18, 9, -1, 4]\n\n# Filter only positive even numbers\npos_evens = [n for n in numbers if n > 0 and n % 2 == 0]\n\nprint(\"Original:\", numbers)\nprint(\"Positive Evens:\", pos_evens)",
        "terminalOutput": "Original: [12, -7, 5, 0, -3, 18, 9, -1, 4]\nPositive Evens: [12, 18, 4]",
        "tip": "When filtering, the 'if' condition appears at the VERY END of the list comprehension (after the 'for' clause).",
        "mcq": {
          "question": "Where does a filtering condition belong in a list comprehension?",
          "options": [
            {
              "id": "A",
              "text": "At the very end of the comprehension, following the 'for ... in ...' clause",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Before the output expression at the start of brackets",
              "explanationIfWrong": "The output expression comes first."
            },
            {
              "id": "C",
              "text": "Between the 'for' and 'in' keywords",
              "explanationIfWrong": "The 'for item in iterable' clause cannot be split."
            },
            {
              "id": "D",
              "text": "Inside the iterable parentheses",
              "explanationIfWrong": "The iterable is a standard Python collection or generator."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python list comprehensions, trailing 'if' clauses act as filters: [expr for item in iterable if condition].",
          "id": "q-11-1-list-comprehensions-1-v1"
        },
        "retestMcq": {
          "question": "What is the output of: [n for n in range(10) if n % 3 == 0]?",
          "options": [
            {
              "id": "A",
              "text": "[0, 3, 6, 9]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[3, 6, 9]",
              "explanationIfWrong": "0 % 3 is 0, which satisfies the condition; 0 is included."
            },
            {
              "id": "C",
              "text": "[0, 3, 6, 9, 10]",
              "explanationIfWrong": "range(10) stops at 9."
            },
            {
              "id": "D",
              "text": "[1, 2, 4, 5, 7, 8]",
              "explanationIfWrong": "This would be n % 3 != 0."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "range(10) yields integers 0 through 9. For n = 0, 3, 6, 9, n % 3 == 0 is True.",
          "id": "q-11-1-list-comprehensions-1-v2"
        },
        "questionPool": [
          {
            "question": "Where does a filtering condition belong in a list comprehension?",
            "options": [
              {
                "id": "A",
                "text": "At the very end of the comprehension, following the 'for ... in ...' clause",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Before the output expression at the start of brackets",
                "explanationIfWrong": "The output expression comes first."
              },
              {
                "id": "C",
                "text": "Between the 'for' and 'in' keywords",
                "explanationIfWrong": "The 'for item in iterable' clause cannot be split."
              },
              {
                "id": "D",
                "text": "Inside the iterable parentheses",
                "explanationIfWrong": "The iterable is a standard Python collection or generator."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python list comprehensions, trailing 'if' clauses act as filters: [expr for item in iterable if condition].",
            "id": "q-11-1-list-comprehensions-1-v1"
          },
          {
            "question": "What is the output of: [n for n in range(10) if n % 3 == 0]?",
            "options": [
              {
                "id": "A",
                "text": "[0, 3, 6, 9]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[3, 6, 9]",
                "explanationIfWrong": "0 % 3 is 0, which satisfies the condition; 0 is included."
              },
              {
                "id": "C",
                "text": "[0, 3, 6, 9, 10]",
                "explanationIfWrong": "range(10) stops at 9."
              },
              {
                "id": "D",
                "text": "[1, 2, 4, 5, 7, 8]",
                "explanationIfWrong": "This would be n % 3 != 0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "range(10) yields integers 0 through 9. For n = 0, 3, 6, 9, n % 3 == 0 is True.",
            "id": "q-11-1-list-comprehensions-1-v2"
          },
          {
            "question": "Given words = ['cat', 'elephant', 'dog', 'tiger'], what does [w for w in words if len(w) > 3] evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "['elephant', 'tiger']",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "['cat', 'dog']",
                "explanationIfWrong": "'cat' and 'dog' have length 3, not > 3."
              },
              {
                "id": "C",
                "text": "[8, 5]",
                "explanationIfWrong": "The expression is 'w' (the string), not 'len(w)'."
              },
              {
                "id": "D",
                "text": "['elephant']",
                "explanationIfWrong": "'tiger' has length 5, which is > 3."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The filter keeps strings whose length strictly exceeds 3 characters: 'elephant' (8) and 'tiger' (5).",
            "id": "q-11-1-list-comprehensions-1-v3"
          }
        ]
      },
      {
        "heading": "Inline Ternary Conditional Transformation",
        "text": "A crucial distinction in Python comprehensions is between FILTERING (keeping/dropping items) and TRANSFORMING (mapping every item to one of two values). If you want an if-else decision to determine the transformed output, you place a Python ternary conditional expression BEFORE the for keyword: [val_if_true if condition else val_if_false for item in iterable]. Notice that 'else' is strictly required here; omitting 'else' before 'for' is a syntax error.",
        "codeSnippet": "scores = [85, 42, 91, 60, 33, 78]\n\n# Map each score to 'Pass' or 'Fail' (Transforming every item)\nstatus = [\"Pass\" if s >= 60 else \"Fail\" for s in scores]\n\nprint(\"Scores:\", scores)\nprint(\"Status:\", status)",
        "terminalOutput": "Scores: [85, 42, 91, 60, 33, 78]\nStatus: ['Pass', 'Fail', 'Pass', 'Pass', 'Fail', 'Pass']",
        "tip": "Mnemonic: 'if' at the end FILTERS. 'if-else' at the start TRANSFORMS.",
        "mcq": {
          "question": "Which comprehension correctly replaces negative values with 0 while keeping positive numbers intact?",
          "options": [
            {
              "id": "A",
              "text": "[x if x >= 0 else 0 for x in numbers]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[x for x in numbers if x >= 0 else 0]",
              "explanationIfWrong": "Trailing 'if' cannot take an 'else' clause; that is a SyntaxError."
            },
            {
              "id": "C",
              "text": "[if x >= 0: x else: 0 for x in numbers]",
              "explanationIfWrong": "Statements with colons cannot appear inside expressions."
            },
            {
              "id": "D",
              "text": "[x if x >= 0 for x in numbers]",
              "explanationIfWrong": "A ternary operator before 'for' requires both 'if' and 'else'."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, ternary mapping syntax placed before the 'for' loop is 'val_true if cond else val_false'.",
          "id": "q-11-1-list-comprehensions-2-v1"
        },
        "retestMcq": {
          "question": "What happens if you write [x for x in data if x > 0 else 0] in Python?",
          "options": [
            {
              "id": "A",
              "text": "Python raises a SyntaxError: invalid syntax",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python replaces numbers <= 0 with 0",
              "explanationIfWrong": "This syntax is invalid; 'else' cannot follow a trailing filter."
            },
            {
              "id": "C",
              "text": "Python ignores the else and only filters positives",
              "explanationIfWrong": "The code will not compile or run at all."
            },
            {
              "id": "D",
              "text": "Python converts data to a set",
              "explanationIfWrong": "It produces a SyntaxError."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Trailing 'if' is strictly a filter condition without 'else'. To use 'else', place the full ternary expression before 'for'.",
          "id": "q-11-1-list-comprehensions-2-v2"
        },
        "questionPool": [
          {
            "question": "Which comprehension correctly replaces negative values with 0 while keeping positive numbers intact?",
            "options": [
              {
                "id": "A",
                "text": "[x if x >= 0 else 0 for x in numbers]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[x for x in numbers if x >= 0 else 0]",
                "explanationIfWrong": "Trailing 'if' cannot take an 'else' clause; that is a SyntaxError."
              },
              {
                "id": "C",
                "text": "[if x >= 0: x else: 0 for x in numbers]",
                "explanationIfWrong": "Statements with colons cannot appear inside expressions."
              },
              {
                "id": "D",
                "text": "[x if x >= 0 for x in numbers]",
                "explanationIfWrong": "A ternary operator before 'for' requires both 'if' and 'else'."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, ternary mapping syntax placed before the 'for' loop is 'val_true if cond else val_false'.",
            "id": "q-11-1-list-comprehensions-2-v1"
          },
          {
            "question": "What happens if you write [x for x in data if x > 0 else 0] in Python?",
            "options": [
              {
                "id": "A",
                "text": "Python raises a SyntaxError: invalid syntax",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python replaces numbers <= 0 with 0",
                "explanationIfWrong": "This syntax is invalid; 'else' cannot follow a trailing filter."
              },
              {
                "id": "C",
                "text": "Python ignores the else and only filters positives",
                "explanationIfWrong": "The code will not compile or run at all."
              },
              {
                "id": "D",
                "text": "Python converts data to a set",
                "explanationIfWrong": "It produces a SyntaxError."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Trailing 'if' is strictly a filter condition without 'else'. To use 'else', place the full ternary expression before 'for'.",
            "id": "q-11-1-list-comprehensions-2-v2"
          },
          {
            "question": "What does ['Even' if n % 2 == 0 else 'Odd' for n in [1, 2, 3, 4]] produce?",
            "options": [
              {
                "id": "A",
                "text": "['Odd', 'Even', 'Odd', 'Even']",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "['Even', 'Odd', 'Even', 'Odd']",
                "explanationIfWrong": "1 is Odd, 2 is Even, 3 is Odd, 4 is Even."
              },
              {
                "id": "C",
                "text": "[2, 4]",
                "explanationIfWrong": "Ternary expressions transform all elements rather than filtering."
              },
              {
                "id": "D",
                "text": "['Even', 'Even']",
                "explanationIfWrong": "All 4 inputs are mapped."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "1 is Odd, 2 is Even, 3 is Odd, 4 is Even, yielding ['Odd', 'Even', 'Odd', 'Even'].",
            "id": "q-11-1-list-comprehensions-2-v3"
          }
        ]
      },
      {
        "heading": "String Normalization & Text Processing",
        "text": "List comprehensions are widely used in data pipelines for parsing, stripping whitespace, and normalizing text. Because strings in Python are iterable sequences of characters, you can perform character-level filtering (such as stripping vowels or digits) or word-level transformations (such as stripping surrounding quotes and capitalizing).",
        "codeSnippet": "raw_names = [\"  alice  \", \"BOB\\n\", \"  Charlie \", \"   \"]\n\n# Strip whitespace, capitalize, and filter out empty strings\ncleaned = [name.strip().title() for name in raw_names if name.strip()]\n\nprint(\"Raw:\", raw_names)\nprint(\"Cleaned:\", cleaned)",
        "terminalOutput": "Raw: ['  alice  ', 'BOB\\n', '  Charlie ', '   ']\nCleaned: ['Alice', 'Bob', 'Charlie']",
        "tip": "Checking `if name.strip()` filters out empty strings or strings that only contain whitespace, since an empty string is falsy.",
        "mcq": {
          "question": "What does [char for char in 'Python' if char not in 'aeiouAEIOU'] produce?",
          "options": [
            {
              "id": "A",
              "text": "['P', 'y', 't', 'h', 'n']",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "['y', 'o']",
              "explanationIfWrong": "'o' is a vowel and was excluded."
            },
            {
              "id": "C",
              "text": "'Pythn'",
              "explanationIfWrong": "List comprehension produces a list of characters, not a joined string."
            },
            {
              "id": "D",
              "text": "['P', 't', 'h', 'n']",
              "explanationIfWrong": "'y' is not in the vowel string 'aeiouAEIOU'."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The comprehension iterates over the string 'Python', excluding 'o' because it is in 'aeiouAEIOU', yielding ['P', 'y', 't', 'h', 'n'].",
          "id": "q-11-1-list-comprehensions-3-v1"
        },
        "retestMcq": {
          "question": "How can you convert a list of strings messy = [' hello ', ' WORLD '] into trimmed lowercase strings?",
          "options": [
            {
              "id": "A",
              "text": "[s.strip().lower() for s in messy]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[s.trim().toLower() for s in messy]",
              "explanationIfWrong": ".trim() and .toLower() are JavaScript methods, not Python."
            },
            {
              "id": "C",
              "text": "messy.strip().lower()",
              "explanationIfWrong": "Lists do not have .strip() or .lower() methods."
            },
            {
              "id": "D",
              "text": "[lower(strip(s)) for s in messy]",
              "explanationIfWrong": "strip and lower are string methods, not built-in top-level functions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "s.strip() removes leading/trailing whitespace, and .lower() normalizes casing on each string element.",
          "id": "q-11-1-list-comprehensions-3-v2"
        },
        "questionPool": [
          {
            "question": "What does [char for char in 'Python' if char not in 'aeiouAEIOU'] produce?",
            "options": [
              {
                "id": "A",
                "text": "['P', 'y', 't', 'h', 'n']",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "['y', 'o']",
                "explanationIfWrong": "'o' is a vowel and was excluded."
              },
              {
                "id": "C",
                "text": "'Pythn'",
                "explanationIfWrong": "List comprehension produces a list of characters, not a joined string."
              },
              {
                "id": "D",
                "text": "['P', 't', 'h', 'n']",
                "explanationIfWrong": "'y' is not in the vowel string 'aeiouAEIOU'."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The comprehension iterates over the string 'Python', excluding 'o' because it is in 'aeiouAEIOU', yielding ['P', 'y', 't', 'h', 'n'].",
            "id": "q-11-1-list-comprehensions-3-v1"
          },
          {
            "question": "How can you convert a list of strings messy = [' hello ', ' WORLD '] into trimmed lowercase strings?",
            "options": [
              {
                "id": "A",
                "text": "[s.strip().lower() for s in messy]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[s.trim().toLower() for s in messy]",
                "explanationIfWrong": ".trim() and .toLower() are JavaScript methods, not Python."
              },
              {
                "id": "C",
                "text": "messy.strip().lower()",
                "explanationIfWrong": "Lists do not have .strip() or .lower() methods."
              },
              {
                "id": "D",
                "text": "[lower(strip(s)) for s in messy]",
                "explanationIfWrong": "strip and lower are string methods, not built-in top-level functions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "s.strip() removes leading/trailing whitespace, and .lower() normalizes casing on each string element.",
            "id": "q-11-1-list-comprehensions-3-v2"
          },
          {
            "question": "Given sentences = 'apple banana cherry', what does [len(w) for w in sentences.split()] return?",
            "options": [
              {
                "id": "A",
                "text": "[5, 6, 6]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[19]",
                "explanationIfWrong": "sentences.split() creates a list of 3 words, mapped individually."
              },
              {
                "id": "C",
                "text": "17",
                "explanationIfWrong": "Output is a list of lengths, not a total integer."
              },
              {
                "id": "D",
                "text": "['apple', 'banana', 'cherry']",
                "explanationIfWrong": "len(w) returns the integer length, not the word itself."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "sentences.split() yields ['apple', 'banana', 'cherry']. Their lengths are 5, 6, and 6 respectively.",
            "id": "q-11-1-list-comprehensions-3-v3"
          }
        ]
      },
      {
        "heading": "Comprehensions with Custom Functions & Type Casting",
        "text": "The expression at the beginning of a list comprehension can be any valid Python expression, including calls to user-defined functions, built-in functions like int(), float(), or complex calculations. When processing raw inputs (such as reading numbers from an HTTP request or CSV file), list comprehensions provide an elegant one-line solution for type casting and validation.",
        "codeSnippet": "def celsius_to_fahrenheit(c):\n    return round((c * 9/5) + 32, 1)\n\ncelsius_temps = [0, 15, 22, 35, 100]\nfahrenheit_temps = [celsius_to_fahrenheit(t) for t in celsius_temps]\n\nprint(\"Celsius:\", celsius_temps)\nprint(\"Fahrenheit:\", fahrenheit_temps)",
        "terminalOutput": "Celsius: [0, 15, 22, 35, 100]\nFahrenheit: [32.0, 59.0, 71.6, 95.0, 212.0]",
        "tip": "You can call helper functions directly inside the comprehension: `[sanitize(x) for x in raw_records]`.",
        "mcq": {
          "question": "Which comprehension parses a comma-separated string '10, 20, 30, 40' into a list of integers?",
          "options": [
            {
              "id": "A",
              "text": "[int(x.strip()) for x in '10, 20, 30, 40'.split(',')]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "int(['10, 20, 30, 40'.split(',')])",
              "explanationIfWrong": "int() cannot take a list as an argument."
            },
            {
              "id": "C",
              "text": "[x.toInt() for x in '10, 20, 30, 40'.split(',')]",
              "explanationIfWrong": "Python strings do not have a .toInt() method."
            },
            {
              "id": "D",
              "text": "[int(x) for x in '10, 20, 30, 40']",
              "explanationIfWrong": "Iterating over the string directly yields individual characters like '1', '0', ',', ' '."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Splitting by ',' produces string tokens. x.strip() removes whitespace, and int() parses each token into an integer.",
          "id": "q-11-1-list-comprehensions-4-v1"
        },
        "retestMcq": {
          "question": "Can a user-defined function be invoked in the expression part of a list comprehension?",
          "options": [
            {
              "id": "A",
              "text": "Yes, any valid callable or function expression can be used",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, only built-in functions like len() or int() are permitted",
              "explanationIfWrong": "Any Python callable or custom function is valid."
            },
            {
              "id": "C",
              "text": "Only if the function is decorated with @comprehension",
              "explanationIfWrong": "No special decorators are needed."
            },
            {
              "id": "D",
              "text": "Only lambda functions are permitted",
              "explanationIfWrong": "Regular named functions work completely normally."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python evaluates whatever expression is specified before 'for' on every iteration, including custom functions.",
          "id": "q-11-1-list-comprehensions-4-v2"
        },
        "questionPool": [
          {
            "question": "Which comprehension parses a comma-separated string '10, 20, 30, 40' into a list of integers?",
            "options": [
              {
                "id": "A",
                "text": "[int(x.strip()) for x in '10, 20, 30, 40'.split(',')]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "int(['10, 20, 30, 40'.split(',')])",
                "explanationIfWrong": "int() cannot take a list as an argument."
              },
              {
                "id": "C",
                "text": "[x.toInt() for x in '10, 20, 30, 40'.split(',')]",
                "explanationIfWrong": "Python strings do not have a .toInt() method."
              },
              {
                "id": "D",
                "text": "[int(x) for x in '10, 20, 30, 40']",
                "explanationIfWrong": "Iterating over the string directly yields individual characters like '1', '0', ',', ' '."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Splitting by ',' produces string tokens. x.strip() removes whitespace, and int() parses each token into an integer.",
            "id": "q-11-1-list-comprehensions-4-v1"
          },
          {
            "question": "Can a user-defined function be invoked in the expression part of a list comprehension?",
            "options": [
              {
                "id": "A",
                "text": "Yes, any valid callable or function expression can be used",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, only built-in functions like len() or int() are permitted",
                "explanationIfWrong": "Any Python callable or custom function is valid."
              },
              {
                "id": "C",
                "text": "Only if the function is decorated with @comprehension",
                "explanationIfWrong": "No special decorators are needed."
              },
              {
                "id": "D",
                "text": "Only lambda functions are permitted",
                "explanationIfWrong": "Regular named functions work completely normally."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python evaluates whatever expression is specified before 'for' on every iteration, including custom functions.",
            "id": "q-11-1-list-comprehensions-4-v2"
          },
          {
            "question": "Given def double(n): return n * 2, what does [double(x) for x in [1, 2, 3]] evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "[2, 4, 6]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[1, 2, 3, 1, 2, 3]",
                "explanationIfWrong": "double(x) multiplies each number by 2."
              },
              {
                "id": "C",
                "text": "[<function double>, <function double>, <function double>]",
                "explanationIfWrong": "double(x) is invoked, returning integers."
              },
              {
                "id": "D",
                "text": "Error: functions cannot be called inside brackets",
                "explanationIfWrong": "Function calls inside comprehensions are standard Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The function double(x) is evaluated for x=1, x=2, and x=3, resulting in [2, 4, 6].",
            "id": "q-11-1-list-comprehensions-4-v3"
          }
        ]
      },
      {
        "heading": "Pragmatism, Readability & Zen of Python",
        "text": "The Zen of Python states: 'Readability counts' and 'Simple is better than complex'. While list comprehensions are concise, abusing them to write deeply nested or side-effect-laden one-liners degrades maintainability. Never use list comprehensions purely for side effects (such as [print(x) for x in items] or writing to a file), because creating a throwaway list of None values in memory wastes resources and miscommunicates developer intent. If logic spans multiple lines or requires complex error handling, use a standard for-loop.",
        "codeSnippet": "# ANTI-PATTERN: List comprehension for side effects (DO NOT DO THIS)\nnames = [\"Ada\", \"Grace\", \"Linus\"]\n[print(f\"Hello {n}\") for n in names]  # Creates [None, None, None] in RAM!\n\n# CORRECT: Standard for-loop for side effects\nfor n in names:\n    print(f\"Hello {n}\")",
        "terminalOutput": "Hello Ada\nHello Grace\nHello Linus\nHello Ada\nHello Grace\nHello Linus",
        "tip": "Rule of thumb: If you aren't using the returned list, don't use a list comprehension; write a regular `for` loop.",
        "mcq": {
          "question": "Why is [print(x) for x in items] considered an anti-pattern in Python?",
          "options": [
            {
              "id": "A",
              "text": "It constructs an unnecessary list of [None, None, ...] in memory when no return value is needed",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "print() is not allowed inside square brackets in Python",
              "explanationIfWrong": "It runs without error, but it is poor design."
            },
            {
              "id": "C",
              "text": "It causes a RecursionError",
              "explanationIfWrong": "It is an iterative loop, not recursive."
            },
            {
              "id": "D",
              "text": "It prints the items in reverse order",
              "explanationIfWrong": "It prints in standard forward order."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "print() returns None. Building a list of [None, None, ...] consumes memory unnecessarily. Use a plain for-loop when executing side effects.",
          "id": "q-11-1-list-comprehensions-5-v1"
        },
        "retestMcq": {
          "question": "When should you prefer a standard for loop over a list comprehension?",
          "options": [
            {
              "id": "A",
              "text": "When the loop body involves complex multi-step logic, exception handling, or non-trivial side effects",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Only when working with lists containing fewer than 5 items",
              "explanationIfWrong": "List size does not dictate comprehension usage."
            },
            {
              "id": "C",
              "text": "When transforming numbers into strings",
              "explanationIfWrong": "Type mapping is a prime use case for comprehensions."
            },
            {
              "id": "D",
              "text": "Never; comprehensions must always replace loops",
              "explanationIfWrong": "Readability and simplicity take precedence over forced one-liners."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Comprehensions are meant for creating collections. When operations involve error handling (try/except) or multi-step logic, explicit loops are much more readable.",
          "id": "q-11-1-list-comprehensions-5-v2"
        },
        "questionPool": [
          {
            "question": "Why is [print(x) for x in items] considered an anti-pattern in Python?",
            "options": [
              {
                "id": "A",
                "text": "It constructs an unnecessary list of [None, None, ...] in memory when no return value is needed",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "print() is not allowed inside square brackets in Python",
                "explanationIfWrong": "It runs without error, but it is poor design."
              },
              {
                "id": "C",
                "text": "It causes a RecursionError",
                "explanationIfWrong": "It is an iterative loop, not recursive."
              },
              {
                "id": "D",
                "text": "It prints the items in reverse order",
                "explanationIfWrong": "It prints in standard forward order."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "print() returns None. Building a list of [None, None, ...] consumes memory unnecessarily. Use a plain for-loop when executing side effects.",
            "id": "q-11-1-list-comprehensions-5-v1"
          },
          {
            "question": "When should you prefer a standard for loop over a list comprehension?",
            "options": [
              {
                "id": "A",
                "text": "When the loop body involves complex multi-step logic, exception handling, or non-trivial side effects",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Only when working with lists containing fewer than 5 items",
                "explanationIfWrong": "List size does not dictate comprehension usage."
              },
              {
                "id": "C",
                "text": "When transforming numbers into strings",
                "explanationIfWrong": "Type mapping is a prime use case for comprehensions."
              },
              {
                "id": "D",
                "text": "Never; comprehensions must always replace loops",
                "explanationIfWrong": "Readability and simplicity take precedence over forced one-liners."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Comprehensions are meant for creating collections. When operations involve error handling (try/except) or multi-step logic, explicit loops are much more readable.",
            "id": "q-11-1-list-comprehensions-5-v2"
          },
          {
            "question": "What is the result stored in res after executing: res = [print(n) for n in [1, 2]]?",
            "options": [
              {
                "id": "A",
                "text": "[None, None]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[1, 2]",
                "explanationIfWrong": "print() prints to stdout and returns None."
              },
              {
                "id": "C",
                "text": "['1', '2']",
                "explanationIfWrong": "print() does not return string values."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The result is a list containing the return values of print()."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, print() always returns None. Evaluating print(n) twice creates the list [None, None].",
            "id": "q-11-1-list-comprehensions-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "11-2-more-comprehensions",
    "number": "11.2",
    "title": "More Comprehensions (Dicts, Sets & Generators)",
    "subtitle": "Expand comprehension power across dictionaries, deduplicating sets, nested 2D matrices, and memory-efficient generator expressions.",
    "readTime": "22 min",
    "objectives": [
      "Construct dictionary comprehensions using {key_expr: val_expr for item in iterable}",
      "Invert dictionaries and filter key-value pairs using .items()",
      "Build set comprehensions {expr for item in iterable} for automatic deduplication",
      "Flatten nested two-dimensional grids and construct coordinate matrices",
      "Understand generator expressions (expr for item in iterable) for lazy, low-memory evaluation",
      "Recognize Python 3 comprehension scoping rules and variable isolation"
    ],
    "theoryBlocks": [
      {
        "heading": "Dictionary Comprehensions",
        "text": "Just as list comprehensions generate lists, dictionary comprehensions generate dictionaries using curly braces and key-value colons: {key_expr: value_expr for item in iterable}. They are ideal for building fast lookup maps, indexing objects by unique IDs, and inverting existing dictionaries (swapping keys and values).",
        "codeSnippet": "words = [\"apple\", \"banana\", \"cherry\", \"date\"]\n\n# Create a dictionary mapping word -> character length\nword_lengths = {w: len(w) for w in words}\n\n# Invert a dictionary (mapping code -> country to country -> code)\ncountry_codes = {\"FI\": \"Finland\", \"SE\": \"Sweden\", \"NO\": \"Norway\"}\ninverted = {name: code for code, name in country_codes.items()}\n\nprint(\"Lengths:\", word_lengths)\nprint(\"Inverted:\", inverted)",
        "terminalOutput": "Lengths: {'apple': 5, 'banana': 6, 'cherry': 6, 'date': 4}\nInverted: {'Finland': 'FI', 'Sweden': 'SE', 'Norway': 'NO'}",
        "tip": "Remember to use `.items()` when iterating over both keys and values of an existing dictionary.",
        "mcq": {
          "question": "What is the general syntax for creating a dictionary comprehension in Python?",
          "options": [
            {
              "id": "A",
              "text": "{key_expression: value_expression for item in iterable}",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[key_expression -> value_expression for item in iterable]",
              "explanationIfWrong": "Square brackets create lists, not dicts."
            },
            {
              "id": "C",
              "text": "dict(for item in iterable: key = value)",
              "explanationIfWrong": "Invalid Python syntax."
            },
            {
              "id": "D",
              "text": "{item in iterable: (key, value)}",
              "explanationIfWrong": "Key and value expressions must precede the 'for' loop."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dictionary comprehensions use curly braces {} with key: value separated by a colon, followed by the 'for ... in ...' loop.",
          "id": "q-11-2-more-comprehensions-0-v1"
        },
        "retestMcq": {
          "question": "Given original = {'a': 1, 'b': 2}, what is the output of {v: k for k, v in original.items()}?",
          "options": [
            {
              "id": "A",
              "text": "{1: 'a', 2: 'b'}",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "{'a': 1, 'b': 2}",
              "explanationIfWrong": "The comprehension swaps key and value (v: k)."
            },
            {
              "id": "C",
              "text": "[(1, 'a'), (2, 'b')]",
              "explanationIfWrong": "Output is a dictionary, not a list of tuples."
            },
            {
              "id": "D",
              "text": "{'1': 'a', '2': 'b'}",
              "explanationIfWrong": "Values 1 and 2 are integers, not strings."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The comprehension sets v as the new key and k as the new value, effectively inverting the mapping to {1: 'a', 2: 'b'}.",
          "id": "q-11-2-more-comprehensions-0-v2"
        },
        "questionPool": [
          {
            "question": "What is the general syntax for creating a dictionary comprehension in Python?",
            "options": [
              {
                "id": "A",
                "text": "{key_expression: value_expression for item in iterable}",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[key_expression -> value_expression for item in iterable]",
                "explanationIfWrong": "Square brackets create lists, not dicts."
              },
              {
                "id": "C",
                "text": "dict(for item in iterable: key = value)",
                "explanationIfWrong": "Invalid Python syntax."
              },
              {
                "id": "D",
                "text": "{item in iterable: (key, value)}",
                "explanationIfWrong": "Key and value expressions must precede the 'for' loop."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dictionary comprehensions use curly braces {} with key: value separated by a colon, followed by the 'for ... in ...' loop.",
            "id": "q-11-2-more-comprehensions-0-v1"
          },
          {
            "question": "Given original = {'a': 1, 'b': 2}, what is the output of {v: k for k, v in original.items()}?",
            "options": [
              {
                "id": "A",
                "text": "{1: 'a', 2: 'b'}",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "{'a': 1, 'b': 2}",
                "explanationIfWrong": "The comprehension swaps key and value (v: k)."
              },
              {
                "id": "C",
                "text": "[(1, 'a'), (2, 'b')]",
                "explanationIfWrong": "Output is a dictionary, not a list of tuples."
              },
              {
                "id": "D",
                "text": "{'1': 'a', '2': 'b'}",
                "explanationIfWrong": "Values 1 and 2 are integers, not strings."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The comprehension sets v as the new key and k as the new value, effectively inverting the mapping to {1: 'a', 2: 'b'}.",
            "id": "q-11-2-more-comprehensions-0-v2"
          },
          {
            "question": "What does {x: x**2 for x in [2, 3]} produce?",
            "options": [
              {
                "id": "A",
                "text": "{2: 4, 3: 9}",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[4, 9]",
                "explanationIfWrong": "Curly braces with a colon produce a dict, not a list."
              },
              {
                "id": "C",
                "text": "{4, 9}",
                "explanationIfWrong": "Without colons it would be a set; with colons it is a dictionary."
              },
              {
                "id": "D",
                "text": "{(2, 4), (3, 9)}",
                "explanationIfWrong": "This would be a set of tuples."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "For x=2, key is 2 and value is 4; for x=3, key is 3 and value is 9, producing {2: 4, 3: 9}.",
            "id": "q-11-2-more-comprehensions-0-v3"
          }
        ]
      },
      {
        "heading": "Filtering in Dictionary Comprehensions",
        "text": "Similar to list comprehensions, dictionary comprehensions support trailing if conditions. You can filter based on keys, values, or combinations of both. This pattern is prevalent when filtering configuration dictionaries, selecting records above thresholds, or pruning null/invalid values.",
        "codeSnippet": "student_scores = {\n    \"Alice\": 92,\n    \"Bob\": 58,\n    \"Charlie\": 81,\n    \"Diana\": 45,\n    \"Evan\": 77\n}\n\n# Filter students who scored 75 or higher\nhonor_roll = {name: score for name, score in student_scores.items() if score >= 75}\n\nprint(\"Honor Roll:\", honor_roll)",
        "terminalOutput": "Honor Roll: {'Alice': 92, 'Charlie': 81, 'Evan': 77}",
        "tip": "When filtering on values, iterating over `dict.items()` gives you direct access to both key and value.",
        "mcq": {
          "question": "How do you filter a dictionary prices = {'milk': 2.5, 'bread': 1.8, 'meat': 12.0} to keep only items costing more than $2.00?",
          "options": [
            {
              "id": "A",
              "text": "{k: v for k, v in prices.items() if v > 2.0}",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "{k: v for k in prices if prices[k] > 2.0 else None}",
              "explanationIfWrong": "Trailing if cannot have an else."
            },
            {
              "id": "C",
              "text": "[k: v for k, v in prices if v > 2.0]",
              "explanationIfWrong": "Dict comprehensions use curly braces, not square brackets."
            },
            {
              "id": "D",
              "text": "prices.filter(v > 2.0)",
              "explanationIfWrong": "Python dicts do not have a .filter() method."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "prices.items() yields (key, value) pairs. The trailing if v > 2.0 filters items correctly.",
          "id": "q-11-2-more-comprehensions-1-v1"
        },
        "retestMcq": {
          "question": "Given d = {'a': 1, 'b': 2, 'c': 3}, what is the output of {k: v * 10 for k, v in d.items() if k != 'b'}?",
          "options": [
            {
              "id": "A",
              "text": "{'a': 10, 'c': 30}",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "{'a': 1, 'c': 3}",
              "explanationIfWrong": "v * 10 multiplies values by 10."
            },
            {
              "id": "C",
              "text": "{'b': 20}",
              "explanationIfWrong": "k != 'b' excludes 'b'."
            },
            {
              "id": "D",
              "text": "{'a': 10, 'b': 20, 'c': 30}",
              "explanationIfWrong": "'b' is filtered out by k != 'b'."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "'b' is skipped because of k != 'b'. 'a' (1*10) and 'c' (3*10) are included, giving {'a': 10, 'c': 30}.",
          "id": "q-11-2-more-comprehensions-1-v2"
        },
        "questionPool": [
          {
            "question": "How do you filter a dictionary prices = {'milk': 2.5, 'bread': 1.8, 'meat': 12.0} to keep only items costing more than $2.00?",
            "options": [
              {
                "id": "A",
                "text": "{k: v for k, v in prices.items() if v > 2.0}",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "{k: v for k in prices if prices[k] > 2.0 else None}",
                "explanationIfWrong": "Trailing if cannot have an else."
              },
              {
                "id": "C",
                "text": "[k: v for k, v in prices if v > 2.0]",
                "explanationIfWrong": "Dict comprehensions use curly braces, not square brackets."
              },
              {
                "id": "D",
                "text": "prices.filter(v > 2.0)",
                "explanationIfWrong": "Python dicts do not have a .filter() method."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "prices.items() yields (key, value) pairs. The trailing if v > 2.0 filters items correctly.",
            "id": "q-11-2-more-comprehensions-1-v1"
          },
          {
            "question": "Given d = {'a': 1, 'b': 2, 'c': 3}, what is the output of {k: v * 10 for k, v in d.items() if k != 'b'}?",
            "options": [
              {
                "id": "A",
                "text": "{'a': 10, 'c': 30}",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "{'a': 1, 'c': 3}",
                "explanationIfWrong": "v * 10 multiplies values by 10."
              },
              {
                "id": "C",
                "text": "{'b': 20}",
                "explanationIfWrong": "k != 'b' excludes 'b'."
              },
              {
                "id": "D",
                "text": "{'a': 10, 'b': 20, 'c': 30}",
                "explanationIfWrong": "'b' is filtered out by k != 'b'."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "'b' is skipped because of k != 'b'. 'a' (1*10) and 'c' (3*10) are included, giving {'a': 10, 'c': 30}.",
            "id": "q-11-2-more-comprehensions-1-v2"
          },
          {
            "question": "What happens if a dictionary comprehension evaluates multiple items that have the same key?",
            "options": [
              {
                "id": "A",
                "text": "Later entries overwrite earlier entries, keeping only the final value for that key",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python raises a DuplicateKeyError",
                "explanationIfWrong": "Dictionary keys are overwritten silently in Python."
              },
              {
                "id": "C",
                "text": "The values are automatically combined into a list",
                "explanationIfWrong": "Python does not automatically convert values to lists."
              },
              {
                "id": "D",
                "text": "The first entry is preserved and subsequent ones are ignored",
                "explanationIfWrong": "Later assignments overwrite earlier ones."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dictionary keys are strictly unique; assigning to an existing key overwrites its previous value.",
            "id": "q-11-2-more-comprehensions-1-v3"
          }
        ]
      },
      {
        "heading": "Set Comprehensions & Deduplication",
        "text": "Set comprehensions use curly braces without colons: {expression for item in iterable}. Because sets can never contain duplicate elements, set comprehensions automatically deduplicate results during construction. This is ideal for extracting unique word stems, distinct domain names, or finding unique lengths.",
        "codeSnippet": "words = [\"hello\", \"WORLD\", \"Hello\", \"world\", \"PYTHON\", \"python\"]\n\n# Extract unique lowercase words\nunique_words = {w.lower() for w in words}\n\n# Extract unique word lengths\nunique_lens = {len(w) for w in words}\n\nprint(\"Unique words:\", sorted(unique_words))\nprint(\"Unique lengths:\", sorted(unique_lens))",
        "terminalOutput": "Unique words: ['hello', 'python', 'world']\nUnique lengths: [5, 6]",
        "tip": "Distinguish sets from dicts: `{x for x in data}` creates a set; `{x: y for x, y in data}` creates a dictionary.",
        "mcq": {
          "question": "What is the type of the object produced by {x % 3 for x in range(10)}?",
          "options": [
            {
              "id": "A",
              "text": "set",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "dict",
              "explanationIfWrong": "There is no colon, so it is a set, not a dict."
            },
            {
              "id": "C",
              "text": "list",
              "explanationIfWrong": "Lists use square brackets []."
            },
            {
              "id": "D",
              "text": "tuple",
              "explanationIfWrong": "Tuples use parentheses (or commas)."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Curly braces containing an expression without a colon form a set comprehension, yielding a set.",
          "id": "q-11-2-more-comprehensions-2-v1"
        },
        "retestMcq": {
          "question": "What is the content of {x % 3 for x in [0, 1, 2, 3, 4, 5, 6]}?",
          "options": [
            {
              "id": "A",
              "text": "{0, 1, 2}",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[0, 1, 2, 0, 1, 2, 0]",
              "explanationIfWrong": "Sets eliminate duplicate elements."
            },
            {
              "id": "C",
              "text": "{0, 1, 2, 3, 4, 5, 6}",
              "explanationIfWrong": "Modulo 3 only produces remainders 0, 1, or 2."
            },
            {
              "id": "D",
              "text": "{3, 6}",
              "explanationIfWrong": "0 % 3 is 0, 1 % 3 is 1, 2 % 3 is 2."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The remainders for x % 3 across all items are 0, 1, and 2. Because sets deduplicate, the result is {0, 1, 2}.",
          "id": "q-11-2-more-comprehensions-2-v2"
        },
        "questionPool": [
          {
            "question": "What is the type of the object produced by {x % 3 for x in range(10)}?",
            "options": [
              {
                "id": "A",
                "text": "set",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "dict",
                "explanationIfWrong": "There is no colon, so it is a set, not a dict."
              },
              {
                "id": "C",
                "text": "list",
                "explanationIfWrong": "Lists use square brackets []."
              },
              {
                "id": "D",
                "text": "tuple",
                "explanationIfWrong": "Tuples use parentheses (or commas)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Curly braces containing an expression without a colon form a set comprehension, yielding a set.",
            "id": "q-11-2-more-comprehensions-2-v1"
          },
          {
            "question": "What is the content of {x % 3 for x in [0, 1, 2, 3, 4, 5, 6]}?",
            "options": [
              {
                "id": "A",
                "text": "{0, 1, 2}",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[0, 1, 2, 0, 1, 2, 0]",
                "explanationIfWrong": "Sets eliminate duplicate elements."
              },
              {
                "id": "C",
                "text": "{0, 1, 2, 3, 4, 5, 6}",
                "explanationIfWrong": "Modulo 3 only produces remainders 0, 1, or 2."
              },
              {
                "id": "D",
                "text": "{3, 6}",
                "explanationIfWrong": "0 % 3 is 0, 1 % 3 is 1, 2 % 3 is 2."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The remainders for x % 3 across all items are 0, 1, and 2. Because sets deduplicate, the result is {0, 1, 2}.",
            "id": "q-11-2-more-comprehensions-2-v2"
          },
          {
            "question": "How do you define an empty set in Python?",
            "options": [
              {
                "id": "A",
                "text": "set()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "{}",
                "explanationIfWrong": "{} creates an empty dictionary, not an empty set."
              },
              {
                "id": "C",
                "text": "set{}",
                "explanationIfWrong": "set{} is invalid syntax."
              },
              {
                "id": "D",
                "text": "[]",
                "explanationIfWrong": "[] creates an empty list."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, {} is reserved for an empty dictionary. An empty set must be instantiated using set().",
            "id": "q-11-2-more-comprehensions-2-v3"
          }
        ]
      },
      {
        "heading": "Nested Comprehensions & 2D Matrix Flattening",
        "text": "List comprehensions can contain multiple for clauses to iterate over nested structures. When flattening a 2D matrix (a list of lists), the order of 'for' clauses in the comprehension matches the order of nested for loops in standard Python: outer loop first, followed by inner loop.",
        "codeSnippet": "matrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\n# Flatten matrix into a 1D list: [item for row in matrix for item in row]\nflat = [val for row in matrix for val in row]\n\n# Generate a 3x3 coordinate grid: [(r, c) for r in range(3) for c in range(3)]\ncoords = [(r, c) for r in range(2) for c in range(3)]\n\nprint(\"Flattened:\", flat)\nprint(\"Coordinates:\", coords)",
        "terminalOutput": "Flattened: [1, 2, 3, 4, 5, 6, 7, 8, 9]\nCoordinates: [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]",
        "tip": "Mnemonic: Read multiple 'for' clauses from left to right, exactly as if they were written as indented nested loops.",
        "mcq": {
          "question": "Which comprehension correctly flattens a 2D list matrix = [[1, 2], [3, 4]] into [1, 2, 3, 4]?",
          "options": [
            {
              "id": "A",
              "text": "[x for row in matrix for x in row]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[x for x in row for row in matrix]",
              "explanationIfWrong": "'row' is referenced before it is defined by 'for row in matrix'."
            },
            {
              "id": "C",
              "text": "[[x for x in row] for row in matrix]",
              "explanationIfWrong": "This preserves the 2D nested structure instead of flattening."
            },
            {
              "id": "D",
              "text": "[matrix[i][j] for i, j in matrix]",
              "explanationIfWrong": "matrix yields rows, not index pairs."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python comprehensions, the outer loop comes first ('for row in matrix'), followed by the inner loop ('for x in row').",
          "id": "q-11-2-more-comprehensions-3-v1"
        },
        "retestMcq": {
          "question": "What is the output of [[0 for _ in range(3)] for _ in range(2)]?",
          "options": [
            {
              "id": "A",
              "text": "[[0, 0, 0], [0, 0, 0]]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[[0, 0], [0, 0], [0, 0]]",
              "explanationIfWrong": "Inner range(3) creates rows of 3 columns; outer range(2) creates 2 rows."
            },
            {
              "id": "C",
              "text": "[0, 0, 0, 0, 0, 0]",
              "explanationIfWrong": "This produces a nested 2D list of lists, not a flat 1D list."
            },
            {
              "id": "D",
              "text": "[[0, 1, 2], [0, 1, 2]]",
              "explanationIfWrong": "The expression is 0, not the iteration variable."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The inner comprehension creates a list of 3 zeros [0, 0, 0]. The outer comprehension repeats this to form 2 independent rows.",
          "id": "q-11-2-more-comprehensions-3-v2"
        },
        "questionPool": [
          {
            "question": "Which comprehension correctly flattens a 2D list matrix = [[1, 2], [3, 4]] into [1, 2, 3, 4]?",
            "options": [
              {
                "id": "A",
                "text": "[x for row in matrix for x in row]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[x for x in row for row in matrix]",
                "explanationIfWrong": "'row' is referenced before it is defined by 'for row in matrix'."
              },
              {
                "id": "C",
                "text": "[[x for x in row] for row in matrix]",
                "explanationIfWrong": "This preserves the 2D nested structure instead of flattening."
              },
              {
                "id": "D",
                "text": "[matrix[i][j] for i, j in matrix]",
                "explanationIfWrong": "matrix yields rows, not index pairs."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python comprehensions, the outer loop comes first ('for row in matrix'), followed by the inner loop ('for x in row').",
            "id": "q-11-2-more-comprehensions-3-v1"
          },
          {
            "question": "What is the output of [[0 for _ in range(3)] for _ in range(2)]?",
            "options": [
              {
                "id": "A",
                "text": "[[0, 0, 0], [0, 0, 0]]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[[0, 0], [0, 0], [0, 0]]",
                "explanationIfWrong": "Inner range(3) creates rows of 3 columns; outer range(2) creates 2 rows."
              },
              {
                "id": "C",
                "text": "[0, 0, 0, 0, 0, 0]",
                "explanationIfWrong": "This produces a nested 2D list of lists, not a flat 1D list."
              },
              {
                "id": "D",
                "text": "[[0, 1, 2], [0, 1, 2]]",
                "explanationIfWrong": "The expression is 0, not the iteration variable."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The inner comprehension creates a list of 3 zeros [0, 0, 0]. The outer comprehension repeats this to form 2 independent rows.",
            "id": "q-11-2-more-comprehensions-3-v2"
          },
          {
            "question": "Why is [[0] * 3 for _ in range(2)] safer than [[0] * 3] * 2 when creating a 2D grid?",
            "options": [
              {
                "id": "A",
                "text": "The comprehension creates distinct list objects for each row, preventing shared row mutation bugs",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[[0] * 3] * 2 causes a SyntaxError in Python 3",
                "explanationIfWrong": "[[0] * 3] * 2 is valid syntax, but creates duplicate references to the same row."
              },
              {
                "id": "C",
                "text": "The comprehension runs in parallel",
                "explanationIfWrong": "It runs synchronously."
              },
              {
                "id": "D",
                "text": "Comprehensions are immutable",
                "explanationIfWrong": "Lists created by comprehensions are fully mutable."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiplying an inner list by 2 copies the reference to the same row. A list comprehension evaluates [0]*3 independently for each iteration, generating isolated row objects.",
            "id": "q-11-2-more-comprehensions-3-v3"
          }
        ]
      },
      {
        "heading": "Generator Expressions & Memory Conservation",
        "text": "When processing millions of items, creating a list comprehension with square brackets allocates all elements in memory simultaneously. If you only need to iterate over items once (such as passing them to sum(), min(), max(), or any()), a generator expression with parentheses (expr for item in iterable) computes values lazily on-demand, consuming virtually zero memory ($O(1)$ space).",
        "codeSnippet": "import sys\n\n# List comprehension: All 1,000,000 items held in RAM simultaneously\nlist_comp = [x ** 2 for x in range(1_000_000)]\n\n# Generator expression: Items generated one-at-a-time on demand (Lazy)\ngen_exp = (x ** 2 for x in range(1_000_000))\n\nprint(\"List Comp RAM:\", sys.getsizeof(list_comp), \"bytes\")\nprint(\"Gen Exp RAM:  \", sys.getsizeof(gen_exp), \"bytes\")\n\n# Directly feeding a generator expression into sum()\ntotal = sum(x ** 2 for x in range(10))\nprint(\"Sum of squares (0..9):\", total)",
        "terminalOutput": "List Comp RAM: 8448728 bytes\nGen Exp RAM:   104 bytes\nSum of squares (0..9): 285",
        "tip": "When a generator expression is the ONLY argument to a function like `sum()`, you can omit the outer parentheses: `sum(x for x in data)`.",
        "mcq": {
          "question": "How do you syntax a generator expression in Python?",
          "options": [
            {
              "id": "A",
              "text": "(expression for item in iterable)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[expression for item in iterable]",
              "explanationIfWrong": "Square brackets create a list comprehension."
            },
            {
              "id": "C",
              "text": "gen(expression for item in iterable)",
              "explanationIfWrong": "'gen' is not a Python built-in keyword."
            },
            {
              "id": "D",
              "text": "<expression for item in iterable>",
              "explanationIfWrong": "Angle brackets are not valid comprehension syntax."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Generator expressions use round parentheses (expr for item in iterable) and evaluate elements lazily.",
          "id": "q-11-2-more-comprehensions-4-v1"
        },
        "retestMcq": {
          "question": "What is the primary advantage of a generator expression over a list comprehension?",
          "options": [
            {
              "id": "A",
              "text": "It produces values lazily on-the-fly, requiring minimal O(1) memory regardless of stream size",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It allows direct indexing like gen[5]",
              "explanationIfWrong": "Generators do not support indexing."
            },
            {
              "id": "C",
              "text": "It can be iterated over multiple times without exhausting",
              "explanationIfWrong": "Generators are exhausted after a single traversal."
            },
            {
              "id": "D",
              "text": "It automatically sorts the output items",
              "explanationIfWrong": "Generators yield items in sequence order without sorting."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Generators yield items one by one on demand rather than storing the entire dataset in memory.",
          "id": "q-11-2-more-comprehensions-4-v2"
        },
        "questionPool": [
          {
            "question": "How do you syntax a generator expression in Python?",
            "options": [
              {
                "id": "A",
                "text": "(expression for item in iterable)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[expression for item in iterable]",
                "explanationIfWrong": "Square brackets create a list comprehension."
              },
              {
                "id": "C",
                "text": "gen(expression for item in iterable)",
                "explanationIfWrong": "'gen' is not a Python built-in keyword."
              },
              {
                "id": "D",
                "text": "<expression for item in iterable>",
                "explanationIfWrong": "Angle brackets are not valid comprehension syntax."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Generator expressions use round parentheses (expr for item in iterable) and evaluate elements lazily.",
            "id": "q-11-2-more-comprehensions-4-v1"
          },
          {
            "question": "What is the primary advantage of a generator expression over a list comprehension?",
            "options": [
              {
                "id": "A",
                "text": "It produces values lazily on-the-fly, requiring minimal O(1) memory regardless of stream size",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It allows direct indexing like gen[5]",
                "explanationIfWrong": "Generators do not support indexing."
              },
              {
                "id": "C",
                "text": "It can be iterated over multiple times without exhausting",
                "explanationIfWrong": "Generators are exhausted after a single traversal."
              },
              {
                "id": "D",
                "text": "It automatically sorts the output items",
                "explanationIfWrong": "Generators yield items in sequence order without sorting."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Generators yield items one by one on demand rather than storing the entire dataset in memory.",
            "id": "q-11-2-more-comprehensions-4-v2"
          },
          {
            "question": "What does type((x for x in [1, 2, 3])) evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "<class 'generator'>",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "<class 'tuple'>",
                "explanationIfWrong": "To create a tuple, you must pass the generator to tuple(): tuple(x for x in ...)."
              },
              {
                "id": "C",
                "text": "<class 'list'>",
                "explanationIfWrong": "Lists use square brackets []."
              },
              {
                "id": "D",
                "text": "<class 'iterator_list'>",
                "explanationIfWrong": "There is no 'iterator_list' type in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Parentheses with comprehension syntax construct a generator object (<class 'generator'>), NOT a tuple.",
            "id": "q-11-2-more-comprehensions-4-v3"
          }
        ]
      },
      {
        "heading": "Comprehension Scope & Namespace Isolation",
        "text": "In Python 2, the loop variable in a list comprehension leaked into the enclosing scope, frequently overwriting variables of the same name. In Python 3, all comprehensions (list, dict, set, and generator expressions) run inside their own private local scope. The iteration variable is completely isolated and cannot contaminate or overwrite outer variables.",
        "codeSnippet": "x = \"OUTER\"\n\n# In Python 3, 'x' inside the comprehension does NOT overwrite outer 'x'\nsquares = [x ** 2 for x in [1, 2, 3, 4]]\n\nprint(\"Squares:\", squares)\nprint(\"Outer x is preserved:\", x)",
        "terminalOutput": "Squares: [1, 4, 9, 16]\nOuter x is preserved: OUTER",
        "tip": "Comprehension scoping rules in Python 3 guarantee clean variable isolation, preventing subtle variable shadowing bugs.",
        "mcq": {
          "question": "What happens to the outer variable x when executing: x = 'safe'; [x for x in range(5)] in Python 3?",
          "options": [
            {
              "id": "A",
              "text": "Outer x remains 'safe' because comprehension iteration variables are isolated to their own scope",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Outer x is overwritten with 4",
              "explanationIfWrong": "This occurred in Python 2, but was fixed in Python 3."
            },
            {
              "id": "C",
              "text": "Python raises an UnboundLocalError",
              "explanationIfWrong": "No error occurs; scoping is isolated cleanly."
            },
            {
              "id": "D",
              "text": "Outer x becomes a list of numbers",
              "explanationIfWrong": "The outer variable is unchanged."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python 3, comprehensions have their own local function scope; iteration variables do not leak into the enclosing scope.",
          "id": "q-11-2-more-comprehensions-5-v1"
        },
        "retestMcq": {
          "question": "Can a list comprehension access read-only variables from the surrounding outer scope?",
          "options": [
            {
              "id": "A",
              "text": "Yes, comprehensions can read variables from enclosing scopes via standard LEGB scoping rules",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, comprehensions cannot see any variables outside their brackets",
              "explanationIfWrong": "They have full read access to enclosing variables."
            },
            {
              "id": "C",
              "text": "Only if the variable is declared global",
              "explanationIfWrong": "Standard enclosing scope resolution works without global."
            },
            {
              "id": "D",
              "text": "Only if the variable is an integer",
              "explanationIfWrong": "Any variable type can be accessed."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Comprehensions follow standard Python LEGB (Local, Enclosing, Global, Built-in) lookup rules, allowing them to read outer variables.",
          "id": "q-11-2-more-comprehensions-5-v2"
        },
        "questionPool": [
          {
            "question": "What happens to the outer variable x when executing: x = 'safe'; [x for x in range(5)] in Python 3?",
            "options": [
              {
                "id": "A",
                "text": "Outer x remains 'safe' because comprehension iteration variables are isolated to their own scope",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Outer x is overwritten with 4",
                "explanationIfWrong": "This occurred in Python 2, but was fixed in Python 3."
              },
              {
                "id": "C",
                "text": "Python raises an UnboundLocalError",
                "explanationIfWrong": "No error occurs; scoping is isolated cleanly."
              },
              {
                "id": "D",
                "text": "Outer x becomes a list of numbers",
                "explanationIfWrong": "The outer variable is unchanged."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python 3, comprehensions have their own local function scope; iteration variables do not leak into the enclosing scope.",
            "id": "q-11-2-more-comprehensions-5-v1"
          },
          {
            "question": "Can a list comprehension access read-only variables from the surrounding outer scope?",
            "options": [
              {
                "id": "A",
                "text": "Yes, comprehensions can read variables from enclosing scopes via standard LEGB scoping rules",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, comprehensions cannot see any variables outside their brackets",
                "explanationIfWrong": "They have full read access to enclosing variables."
              },
              {
                "id": "C",
                "text": "Only if the variable is declared global",
                "explanationIfWrong": "Standard enclosing scope resolution works without global."
              },
              {
                "id": "D",
                "text": "Only if the variable is an integer",
                "explanationIfWrong": "Any variable type can be accessed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Comprehensions follow standard Python LEGB (Local, Enclosing, Global, Built-in) lookup rules, allowing them to read outer variables.",
            "id": "q-11-2-more-comprehensions-5-v2"
          },
          {
            "question": "What is the value of i after running: i = 99; res = [i * 2 for i in [1, 2, 3]] in Python 3?",
            "options": [
              {
                "id": "A",
                "text": "99",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "3",
                "explanationIfWrong": "Comprehension iteration variables do not leak into outer scope."
              },
              {
                "id": "C",
                "text": "6",
                "explanationIfWrong": "i in the outer scope is untouched."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "i remains bound to 99."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Outer variable i remains 99. The comprehension's iteration variable i existed only within the comprehension's private scope.",
            "id": "q-11-2-more-comprehensions-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "11-3-recursion-fundamentals",
    "number": "11.3",
    "title": "Recursion Fundamentals & Call Stack",
    "subtitle": "Master recursive problem solving by breaking complex tasks into self-calling subproblems with robust base cases.",
    "readTime": "22 min",
    "objectives": [
      "Define recursion and recognize how self-calling functions divide problems into smaller subproblems",
      "Identify the two mandatory components of every recursive algorithm: Base Case and Recursive Step",
      "Trace execution frames on the computer Call Stack during recursive descents and returns",
      "Prevent infinite recursion loops and understand Python's RecursionError limit",
      "Implement classic numerical recursive functions including factorial and countdowns",
      "Compare recursion with iteration regarding execution speed, stack memory, and absence of TCO"
    ],
    "theoryBlocks": [
      {
        "heading": "The Anatomy of Recursion",
        "text": "Recursion is a programming technique where a function calls itself to solve a smaller instance of the same problem. Every valid recursive function MUST contain two essential components: 1) A Base Case (the terminating condition where the function returns a known value without making further recursive calls), and 2) A Recursive Step (where the function reduces the problem and calls itself with simpler input, making progress toward the base case). Without a base case, recursion continues indefinitely until system memory limits are reached.",
        "codeSnippet": "def countdown(n):\n    # 1. Base Case: Stop when n reaches 0\n    if n <= 0:\n        print(\"Blastoff!\")\n        return\n    \n    # 2. Recursive Step: Print current number, then recurse with n - 1\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)",
        "terminalOutput": "3\n2\n1\nBlastoff!",
        "tip": "Always write and verify your base case FIRST before writing the recursive step.",
        "mcq": {
          "question": "What are the two mandatory components required in any functional recursive algorithm?",
          "options": [
            {
              "id": "A",
              "text": "A base case (termination condition) and a recursive step (making progress toward the base case)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A while loop and a break statement",
              "explanationIfWrong": "Recursion replaces explicit loops with self-invoking function calls."
            },
            {
              "id": "C",
              "text": "A try-except block and a global counter",
              "explanationIfWrong": "Recursion does not require exception handling or globals."
            },
            {
              "id": "D",
              "text": "A yield keyword and a generator expression",
              "explanationIfWrong": "yield creates generators, not recursion."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Every recursive function must have a base case to terminate execution and a recursive step that moves closer to the base case.",
          "id": "q-11-3-recursion-fundamentals-0-v1"
        },
        "retestMcq": {
          "question": "What happens if a recursive function does not include a base case?",
          "options": [
            {
              "id": "A",
              "text": "It enters an infinite recursive loop and raises a RecursionError when the call stack limit is exceeded",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python automatically terminates the function after 5 iterations",
              "explanationIfWrong": "Python does not guess termination; it continues until stack overflow."
            },
            {
              "id": "C",
              "text": "The function returns None immediately",
              "explanationIfWrong": "It will continue calling itself until maximum depth is exceeded."
            },
            {
              "id": "D",
              "text": "Python converts it into a while loop at compile time",
              "explanationIfWrong": "Python executes recursive calls as genuine stack frames."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without a base case, the function keeps calling itself indefinitely, exhausting the call stack and raising RecursionError.",
          "id": "q-11-3-recursion-fundamentals-0-v2"
        },
        "questionPool": [
          {
            "question": "What are the two mandatory components required in any functional recursive algorithm?",
            "options": [
              {
                "id": "A",
                "text": "A base case (termination condition) and a recursive step (making progress toward the base case)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A while loop and a break statement",
                "explanationIfWrong": "Recursion replaces explicit loops with self-invoking function calls."
              },
              {
                "id": "C",
                "text": "A try-except block and a global counter",
                "explanationIfWrong": "Recursion does not require exception handling or globals."
              },
              {
                "id": "D",
                "text": "A yield keyword and a generator expression",
                "explanationIfWrong": "yield creates generators, not recursion."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Every recursive function must have a base case to terminate execution and a recursive step that moves closer to the base case.",
            "id": "q-11-3-recursion-fundamentals-0-v1"
          },
          {
            "question": "What happens if a recursive function does not include a base case?",
            "options": [
              {
                "id": "A",
                "text": "It enters an infinite recursive loop and raises a RecursionError when the call stack limit is exceeded",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python automatically terminates the function after 5 iterations",
                "explanationIfWrong": "Python does not guess termination; it continues until stack overflow."
              },
              {
                "id": "C",
                "text": "The function returns None immediately",
                "explanationIfWrong": "It will continue calling itself until maximum depth is exceeded."
              },
              {
                "id": "D",
                "text": "Python converts it into a while loop at compile time",
                "explanationIfWrong": "Python executes recursive calls as genuine stack frames."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without a base case, the function keeps calling itself indefinitely, exhausting the call stack and raising RecursionError.",
            "id": "q-11-3-recursion-fundamentals-0-v2"
          },
          {
            "question": "In the function def f(n): if n == 1: return 1; return n + f(n - 1), what is the base case?",
            "options": [
              {
                "id": "A",
                "text": "if n == 1: return 1",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "return n + f(n - 1)",
                "explanationIfWrong": "This is the recursive step."
              },
              {
                "id": "C",
                "text": "def f(n):",
                "explanationIfWrong": "This is the function header."
              },
              {
                "id": "D",
                "text": "n - 1",
                "explanationIfWrong": "This is the argument decrement."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "if n == 1: return 1 stops the recursion and provides the base solution without further self-calls.",
            "id": "q-11-3-recursion-fundamentals-0-v3"
          }
        ]
      },
      {
        "heading": "The Call Stack & Stack Frames",
        "text": "When a function is called in Python, the runtime creates a 'stack frame' in memory storing the function's local variables, arguments, and return address. When a function calls another function (or itself), the new frame is pushed onto the top of the Call Stack. The calling function pauses its execution until the child call returns. Once a base case is hit, frames are popped off the stack one by one in reverse order (Last-In, First-Out: LIFO), returning values back to the paused callers.",
        "codeSnippet": "def factorial(n):\n    if n <= 1:\n        return 1\n    # Pauses factorial(n) while factorial(n - 1) resolves on stack\n    sub_result = factorial(n - 1)\n    return n * sub_result\n\nprint(\"5! =\", factorial(5))",
        "terminalOutput": "5! = 120",
        "tip": "Visualizing the stack: `fact(3)` calls `fact(2)`, which calls `fact(1)`. `fact(1)` returns 1; `fact(2)` computes `2*1=2`; `fact(3)` computes `3*2=6`.",
        "mcq": {
          "question": "What data structure does the computer use internally to manage active recursive function calls and local variables?",
          "options": [
            {
              "id": "A",
              "text": "A Call Stack (LIFO: Last-In, First-Out)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A Queue (FIFO: First-In, First-Out)",
              "explanationIfWrong": "Queues are FIFO; function calls use a LIFO stack."
            },
            {
              "id": "C",
              "text": "A Binary Search Tree",
              "explanationIfWrong": "Trees organize sorted data, not runtime function frames."
            },
            {
              "id": "D",
              "text": "A Hash Map",
              "explanationIfWrong": "Hash maps store key-value pairs, not call hierarchies."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Function execution frames are pushed onto and popped off the Call Stack using Last-In, First-Out order.",
          "id": "q-11-3-recursion-fundamentals-1-v1"
        },
        "retestMcq": {
          "question": "When factorial(4) is executing, how many stack frames for factorial exist when n reaches the base case 1?",
          "options": [
            {
              "id": "A",
              "text": "4 frames (for n=4, n=3, n=2, and n=1)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "1 frame",
              "explanationIfWrong": "Each nested call maintains its own active stack frame."
            },
            {
              "id": "C",
              "text": "24 frames",
              "explanationIfWrong": "24 is the final return value (4!), not the frame count."
            },
            {
              "id": "D",
              "text": "0 frames",
              "explanationIfWrong": "Stack frames remain active until the function returns."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "At the base case n=1, all parent calls (n=4, n=3, n=2) are suspended on the stack waiting for results, making 4 active frames.",
          "id": "q-11-3-recursion-fundamentals-1-v2"
        },
        "questionPool": [
          {
            "question": "What data structure does the computer use internally to manage active recursive function calls and local variables?",
            "options": [
              {
                "id": "A",
                "text": "A Call Stack (LIFO: Last-In, First-Out)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A Queue (FIFO: First-In, First-Out)",
                "explanationIfWrong": "Queues are FIFO; function calls use a LIFO stack."
              },
              {
                "id": "C",
                "text": "A Binary Search Tree",
                "explanationIfWrong": "Trees organize sorted data, not runtime function frames."
              },
              {
                "id": "D",
                "text": "A Hash Map",
                "explanationIfWrong": "Hash maps store key-value pairs, not call hierarchies."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Function execution frames are pushed onto and popped off the Call Stack using Last-In, First-Out order.",
            "id": "q-11-3-recursion-fundamentals-1-v1"
          },
          {
            "question": "When factorial(4) is executing, how many stack frames for factorial exist when n reaches the base case 1?",
            "options": [
              {
                "id": "A",
                "text": "4 frames (for n=4, n=3, n=2, and n=1)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "1 frame",
                "explanationIfWrong": "Each nested call maintains its own active stack frame."
              },
              {
                "id": "C",
                "text": "24 frames",
                "explanationIfWrong": "24 is the final return value (4!), not the frame count."
              },
              {
                "id": "D",
                "text": "0 frames",
                "explanationIfWrong": "Stack frames remain active until the function returns."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "At the base case n=1, all parent calls (n=4, n=3, n=2) are suspended on the stack waiting for results, making 4 active frames.",
            "id": "q-11-3-recursion-fundamentals-1-v2"
          },
          {
            "question": "Do different stack frames of the same recursive function share their local variables?",
            "options": [
              {
                "id": "A",
                "text": "No, each stack frame has its own independent copy of local variables and parameter values",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, local variables are automatically shared across all frames",
                "explanationIfWrong": "Local variables are strictly private to each frame."
              },
              {
                "id": "C",
                "text": "Only if variables are named identically",
                "explanationIfWrong": "Each frame has its own isolated namespace."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Stack frame isolation is universal in programming languages."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Every function call creates a separate stack frame with its own isolated set of local parameters and variables.",
            "id": "q-11-3-recursion-fundamentals-1-v3"
          }
        ]
      },
      {
        "heading": "Base Cases & Guarding Against RecursionError",
        "text": "CPython protects against infinite recursion and thread stack overflow by enforcing a maximum recursion depth (default is 1000). When a program exceeds this limit, Python raises `RecursionError: maximum recursion depth exceeded while calling a Python object`. You can inspect this limit using `sys.getrecursionlimit()`. Never increase this limit blindly to mask a broken base case; an absent base case is an algorithmic bug.",
        "codeSnippet": "import sys\n\nprint(\"Default recursion limit:\", sys.getrecursionlimit())\n\ndef infinite_recurse(count):\n    # Missing base case!\n    return infinite_recurse(count + 1)\n\ntry:\n    infinite_recurse(1)\nexcept RecursionError as e:\n    print(\"Caught expected error:\", type(e).__name__)",
        "terminalOutput": "Default recursion limit: 1000\nCaught expected error: RecursionError",
        "tip": "If your recursive function throws `RecursionError`, check whether your base case is reachable from your initial input.",
        "mcq": {
          "question": "What exception does Python raise when a recursive function exceeds the maximum call stack depth?",
          "options": [
            {
              "id": "A",
              "text": "RecursionError",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "StackOverflowError",
              "explanationIfWrong": "Java/C# use StackOverflowError; Python raises RecursionError."
            },
            {
              "id": "C",
              "text": "MemoryLimitExceeded",
              "explanationIfWrong": "The specific built-in exception is RecursionError."
            },
            {
              "id": "D",
              "text": "InfiniteLoopException",
              "explanationIfWrong": "Python has no InfiniteLoopException."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python raises RecursionError (which inherits from RuntimeError) when maximum stack depth is exceeded.",
          "id": "q-11-3-recursion-fundamentals-2-v1"
        },
        "retestMcq": {
          "question": "What is the typical default maximum recursion limit in CPython?",
          "options": [
            {
              "id": "A",
              "text": "1000",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "10",
              "explanationIfWrong": "10 would be far too low for practical recursion."
            },
            {
              "id": "C",
              "text": "1,000,000",
              "explanationIfWrong": "A million frames would overflow C stack memory."
            },
            {
              "id": "D",
              "text": "Unlimited",
              "explanationIfWrong": "CPython enforces a finite limit to prevent OS segmentation faults."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "sys.getrecursionlimit() defaults to 1000 in standard CPython installations.",
          "id": "q-11-3-recursion-fundamentals-2-v2"
        },
        "questionPool": [
          {
            "question": "What exception does Python raise when a recursive function exceeds the maximum call stack depth?",
            "options": [
              {
                "id": "A",
                "text": "RecursionError",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "StackOverflowError",
                "explanationIfWrong": "Java/C# use StackOverflowError; Python raises RecursionError."
              },
              {
                "id": "C",
                "text": "MemoryLimitExceeded",
                "explanationIfWrong": "The specific built-in exception is RecursionError."
              },
              {
                "id": "D",
                "text": "InfiniteLoopException",
                "explanationIfWrong": "Python has no InfiniteLoopException."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python raises RecursionError (which inherits from RuntimeError) when maximum stack depth is exceeded.",
            "id": "q-11-3-recursion-fundamentals-2-v1"
          },
          {
            "question": "What is the typical default maximum recursion limit in CPython?",
            "options": [
              {
                "id": "A",
                "text": "1000",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "10",
                "explanationIfWrong": "10 would be far too low for practical recursion."
              },
              {
                "id": "C",
                "text": "1,000,000",
                "explanationIfWrong": "A million frames would overflow C stack memory."
              },
              {
                "id": "D",
                "text": "Unlimited",
                "explanationIfWrong": "CPython enforces a finite limit to prevent OS segmentation faults."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "sys.getrecursionlimit() defaults to 1000 in standard CPython installations.",
            "id": "q-11-3-recursion-fundamentals-2-v2"
          },
          {
            "question": "If calling sum_down(5) with def sum_down(n): return n + sum_down(n - 1) fails, what was missing?",
            "options": [
              {
                "id": "A",
                "text": "A base case (such as if n <= 0: return 0) to stop the recursive descent",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A return type annotation",
                "explanationIfWrong": "Type annotations do not affect runtime execution."
              },
              {
                "id": "C",
                "text": "A while loop",
                "explanationIfWrong": "Recursion does not require loops."
              },
              {
                "id": "D",
                "text": "An import of math",
                "explanationIfWrong": "No external module is needed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without a base case, sum_down continues into negative numbers (-1, -2, -3...) until RecursionError is raised.",
            "id": "q-11-3-recursion-fundamentals-2-v3"
          }
        ]
      },
      {
        "heading": "Numerical Recursive Algorithms",
        "text": "Many mathematical definitions are naturally recursive. For example: $n! = n \\times (n-1)!$ with $0! = 1$. Similarly, computing powers $a^b$ can be expressed recursively: $a^b = a \\times a^{b-1}$. Even more efficiently, fast exponentiation can divide the exponent in half: $a^b = (a^{b/2})^2$ for even $b$, reducing time complexity from $O(b)$ to $O(\\log b)$.",
        "codeSnippet": "def power(base, exp):\n    # Base case: any number to power 0 is 1\n    if exp == 0:\n        return 1\n    # Divide and conquer for even exponents\n    if exp % 2 == 0:\n        half = power(base, exp // 2)\n        return half * half\n    # Odd exponents\n    return base * power(base, exp - 1)\n\nprint(\"2^10 =\", power(2, 10))\nprint(\"3^4  =\", power(3, 4))",
        "terminalOutput": "2^10 = 1024\n3^4  = 81",
        "tip": "Mathematical recurrence relations translate directly into recursive code: base cases represent initial conditions.",
        "mcq": {
          "question": "What is the return value of factorial(0) according to standard mathematical definitions?",
          "options": [
            {
              "id": "A",
              "text": "1",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "0",
              "explanationIfWrong": "0! is mathematically defined as 1."
            },
            {
              "id": "C",
              "text": "-1",
              "explanationIfWrong": "Factorial of 0 is positive 1."
            },
            {
              "id": "D",
              "text": "RecursionError",
              "explanationIfWrong": "0! is the base case and returns 1."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "By mathematical convention and definition, 0! = 1. A robust recursive factorial base case returns 1 for n <= 1.",
          "id": "q-11-3-recursion-fundamentals-3-v1"
        },
        "retestMcq": {
          "question": "Given def rec_sum(n): return n if n <= 1 else n + rec_sum(n - 1), what does rec_sum(4) return?",
          "options": [
            {
              "id": "A",
              "text": "10 (computed as 4 + 3 + 2 + 1)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "24 (computed as 4 * 3 * 2 * 1)",
              "explanationIfWrong": "rec_sum performs addition (+), not multiplication (*)."
            },
            {
              "id": "C",
              "text": "4",
              "explanationIfWrong": "It recursively sums all numbers down to 1."
            },
            {
              "id": "D",
              "text": "14",
              "explanationIfWrong": "4 + 3 + 2 + 1 = 10."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "rec_sum(4) evaluates to 4 + rec_sum(3) -> 4 + 3 + rec_sum(2) -> 4 + 3 + 2 + 1 = 10.",
          "id": "q-11-3-recursion-fundamentals-3-v2"
        },
        "questionPool": [
          {
            "question": "What is the return value of factorial(0) according to standard mathematical definitions?",
            "options": [
              {
                "id": "A",
                "text": "1",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "0",
                "explanationIfWrong": "0! is mathematically defined as 1."
              },
              {
                "id": "C",
                "text": "-1",
                "explanationIfWrong": "Factorial of 0 is positive 1."
              },
              {
                "id": "D",
                "text": "RecursionError",
                "explanationIfWrong": "0! is the base case and returns 1."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "By mathematical convention and definition, 0! = 1. A robust recursive factorial base case returns 1 for n <= 1.",
            "id": "q-11-3-recursion-fundamentals-3-v1"
          },
          {
            "question": "Given def rec_sum(n): return n if n <= 1 else n + rec_sum(n - 1), what does rec_sum(4) return?",
            "options": [
              {
                "id": "A",
                "text": "10 (computed as 4 + 3 + 2 + 1)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "24 (computed as 4 * 3 * 2 * 1)",
                "explanationIfWrong": "rec_sum performs addition (+), not multiplication (*)."
              },
              {
                "id": "C",
                "text": "4",
                "explanationIfWrong": "It recursively sums all numbers down to 1."
              },
              {
                "id": "D",
                "text": "14",
                "explanationIfWrong": "4 + 3 + 2 + 1 = 10."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "rec_sum(4) evaluates to 4 + rec_sum(3) -> 4 + 3 + rec_sum(2) -> 4 + 3 + 2 + 1 = 10.",
            "id": "q-11-3-recursion-fundamentals-3-v2"
          },
          {
            "question": "Why is fast exponentiation (dividing exponent by 2 each recursive call) superior to linear exponentiation?",
            "options": [
              {
                "id": "A",
                "text": "It reduces the number of operations and stack depth from O(N) to O(log N)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It avoids using integer multiplication",
                "explanationIfWrong": "It still uses multiplication."
              },
              {
                "id": "C",
                "text": "It eliminates the need for a base case",
                "explanationIfWrong": "It still requires a base case when exp == 0."
              },
              {
                "id": "D",
                "text": "It runs in O(1) constant time",
                "explanationIfWrong": "Halving the exponent yields logarithmic O(log N) time, not constant time."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Repeatedly halving the exponent reduces the problem size logarithmically, taking only log2(N) steps.",
            "id": "q-11-3-recursion-fundamentals-3-v3"
          }
        ]
      },
      {
        "heading": "Tracing Order: Pre-Recursion vs Post-Recursion",
        "text": "The placement of statements relative to the recursive call determines when they execute: 1) Statements written BEFORE the recursive call execute on the way DOWN the stack (during the recursive descent); 2) Statements written AFTER the recursive call execute on the way BACK UP the stack (during stack unwinding). This property is foundational for reversing sequences and tree traversals.",
        "codeSnippet": "def print_descent_and_ascent(n):\n    if n == 0:\n        print(\"--- Base Case Reached ---\")\n        return\n    \n    print(\"Descending:\", n)          # Pre-recursion (top-down)\n    print_descent_and_ascent(n - 1)  # Recursive descent\n    print(\"Ascending: \", n)          # Post-recursion (unwinding)\n\nprint_descent_and_ascent(3)",
        "terminalOutput": "Descending: 3\nDescending: 2\nDescending: 1\n--- Base Case Reached ---\nAscending:  1\nAscending:  2\nAscending:  3",
        "tip": "Notice how the ascending phase prints numbers in reverse order (1, 2, 3) because frames pop in LIFO order.",
        "mcq": {
          "question": "In what order do statements executed AFTER the recursive call run when the call stack unwinds?",
          "options": [
            {
              "id": "A",
              "text": "In reverse order of their invocation (from deepest call back to initial caller)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "In forward order (same order as the descent)",
              "explanationIfWrong": "The stack unwinds in Last-In, First-Out (LIFO) order."
            },
            {
              "id": "C",
              "text": "In random order",
              "explanationIfWrong": "Stack execution order is strictly deterministic."
            },
            {
              "id": "D",
              "text": "They do not execute at all",
              "explanationIfWrong": "All paused statements resume as frames pop."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because stack frames pop in LIFO order, any code after the recursive call executes from the bottom-most base case back to the top.",
          "id": "q-11-3-recursion-fundamentals-4-v1"
        },
        "retestMcq": {
          "question": "What is printed by: def show(n): if n > 0: show(n - 1); print(n); show(3)?",
          "options": [
            {
              "id": "A",
              "text": "1 2 3 (each on a new line)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "3 2 1 (each on a new line)",
              "explanationIfWrong": "print(n) comes AFTER show(n-1), so it prints during stack unwinding."
            },
            {
              "id": "C",
              "text": "3 3 3",
              "explanationIfWrong": "Each frame has its own distinct n value."
            },
            {
              "id": "D",
              "text": "0 1 2 3",
              "explanationIfWrong": "if n > 0 prevents n=0 from entering."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "show(3) calls show(2) -> show(1) -> show(0). Once base case returns, show(1) prints 1, show(2) prints 2, and show(3) prints 3.",
          "id": "q-11-3-recursion-fundamentals-4-v2"
        },
        "questionPool": [
          {
            "question": "In what order do statements executed AFTER the recursive call run when the call stack unwinds?",
            "options": [
              {
                "id": "A",
                "text": "In reverse order of their invocation (from deepest call back to initial caller)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "In forward order (same order as the descent)",
                "explanationIfWrong": "The stack unwinds in Last-In, First-Out (LIFO) order."
              },
              {
                "id": "C",
                "text": "In random order",
                "explanationIfWrong": "Stack execution order is strictly deterministic."
              },
              {
                "id": "D",
                "text": "They do not execute at all",
                "explanationIfWrong": "All paused statements resume as frames pop."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because stack frames pop in LIFO order, any code after the recursive call executes from the bottom-most base case back to the top.",
            "id": "q-11-3-recursion-fundamentals-4-v1"
          },
          {
            "question": "What is printed by: def show(n): if n > 0: show(n - 1); print(n); show(3)?",
            "options": [
              {
                "id": "A",
                "text": "1 2 3 (each on a new line)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "3 2 1 (each on a new line)",
                "explanationIfWrong": "print(n) comes AFTER show(n-1), so it prints during stack unwinding."
              },
              {
                "id": "C",
                "text": "3 3 3",
                "explanationIfWrong": "Each frame has its own distinct n value."
              },
              {
                "id": "D",
                "text": "0 1 2 3",
                "explanationIfWrong": "if n > 0 prevents n=0 from entering."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "show(3) calls show(2) -> show(1) -> show(0). Once base case returns, show(1) prints 1, show(2) prints 2, and show(3) prints 3.",
            "id": "q-11-3-recursion-fundamentals-4-v2"
          },
          {
            "question": "If you want to process items in forward order without reversing, where should the processing action occur?",
            "options": [
              {
                "id": "A",
                "text": "Before the recursive call (during descent)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "After the recursive call (during unwinding)",
                "explanationIfWrong": "Post-recursion processes in reverse LIFO order."
              },
              {
                "id": "C",
                "text": "Inside the base case only",
                "explanationIfWrong": "The base case only handles the termination point."
              },
              {
                "id": "D",
                "text": "In a finally block",
                "explanationIfWrong": "Pre-recursion placement handles forward ordering naturally."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Actions placed before the recursive call execute in natural forward order as calls are pushed onto the stack.",
            "id": "q-11-3-recursion-fundamentals-4-v3"
          }
        ]
      },
      {
        "heading": "Recursion vs Iteration & Lack of TCO in Python",
        "text": "Any problem solvable by recursion can also be solved using iteration (loops), and vice-versa. In many languages (like Scheme, Haskell, or ES6 JavaScript), 'tail call optimization' (TCO) allows recursive calls in tail position to reuse the current stack frame, achieving $O(1)$ space. Python intentionally DOES NOT implement TCO. Guido van Rossum decided against TCO because maintaining a complete stack trace is essential for debugging and inspecting stack frames. Therefore, deep recursion in Python carries an $O(N)$ memory overhead.",
        "codeSnippet": "# Iterative Factorial: O(1) space, no stack frame overhead\ndef factorial_iterative(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n\n# Recursive Factorial: O(N) space on Call Stack\ndef factorial_recursive(n):\n    return 1 if n <= 1 else n * factorial_recursive(n - 1)\n\nprint(\"Iterative 6! =\", factorial_iterative(6))\nprint(\"Recursive 6! =\", factorial_recursive(6))",
        "terminalOutput": "Iterative 6! = 720\nRecursive 6! = 720",
        "tip": "Use iteration for simple linear counting loops; reserve recursion for branching structures like trees, graphs, and divide-and-conquer algorithms.",
        "mcq": {
          "question": "Does Python implement Tail Call Optimization (TCO)?",
          "options": [
            {
              "id": "A",
              "text": "No, Python never optimizes tail calls to preserve complete stack traces for debugging",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Yes, all tail-recursive functions run in O(1) memory in Python 3",
              "explanationIfWrong": "Python does not support TCO in any version."
            },
            {
              "id": "C",
              "text": "Only if decorated with @tail_rec",
              "explanationIfWrong": "There is no built-in @tail_rec decorator in Python."
            },
            {
              "id": "D",
              "text": "Only in Python 3.12+",
              "explanationIfWrong": "Python core developers have explicitly rejected TCO."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "CPython intentionally omits TCO so that full tracebacks are preserved for error inspection and debugging.",
          "id": "q-11-3-recursion-fundamentals-5-v1"
        },
        "retestMcq": {
          "question": "What is the primary memory drawback of recursive algorithms over iterative loops in Python?",
          "options": [
            {
              "id": "A",
              "text": "Each recursive call consumes memory for a new stack frame, creating O(N) memory overhead",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Recursion leaks memory permanently into global variables",
              "explanationIfWrong": "Stack memory is freed as soon as frames return."
            },
            {
              "id": "C",
              "text": "Recursion cannot allocate lists",
              "explanationIfWrong": "Lists can be allocated anywhere."
            },
            {
              "id": "D",
              "text": "Recursive functions cannot return integers",
              "explanationIfWrong": "Functions can return any Python type."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Every recursive level requires a separate stack frame. For N calls, recursion requires O(N) auxiliary space on the call stack.",
          "id": "q-11-3-recursion-fundamentals-5-v2"
        },
        "questionPool": [
          {
            "question": "Does Python implement Tail Call Optimization (TCO)?",
            "options": [
              {
                "id": "A",
                "text": "No, Python never optimizes tail calls to preserve complete stack traces for debugging",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, all tail-recursive functions run in O(1) memory in Python 3",
                "explanationIfWrong": "Python does not support TCO in any version."
              },
              {
                "id": "C",
                "text": "Only if decorated with @tail_rec",
                "explanationIfWrong": "There is no built-in @tail_rec decorator in Python."
              },
              {
                "id": "D",
                "text": "Only in Python 3.12+",
                "explanationIfWrong": "Python core developers have explicitly rejected TCO."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "CPython intentionally omits TCO so that full tracebacks are preserved for error inspection and debugging.",
            "id": "q-11-3-recursion-fundamentals-5-v1"
          },
          {
            "question": "What is the primary memory drawback of recursive algorithms over iterative loops in Python?",
            "options": [
              {
                "id": "A",
                "text": "Each recursive call consumes memory for a new stack frame, creating O(N) memory overhead",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Recursion leaks memory permanently into global variables",
                "explanationIfWrong": "Stack memory is freed as soon as frames return."
              },
              {
                "id": "C",
                "text": "Recursion cannot allocate lists",
                "explanationIfWrong": "Lists can be allocated anywhere."
              },
              {
                "id": "D",
                "text": "Recursive functions cannot return integers",
                "explanationIfWrong": "Functions can return any Python type."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Every recursive level requires a separate stack frame. For N calls, recursion requires O(N) auxiliary space on the call stack.",
            "id": "q-11-3-recursion-fundamentals-5-v2"
          },
          {
            "question": "For which category of problems is recursion generally more natural and elegant than flat iteration?",
            "options": [
              {
                "id": "A",
                "text": "Hierarchical, branching, or divide-and-conquer structures (trees, nested folders, merge sort)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Printing numbers 1 to 100",
                "explanationIfWrong": "A simple for loop with range() is best for linear counting."
              },
              {
                "id": "C",
                "text": "Infinite event loops in web servers",
                "explanationIfWrong": "Servers use while True loops; recursion would crash with RecursionError."
              },
              {
                "id": "D",
                "text": "Reading lines one by one from a flat text file",
                "explanationIfWrong": "A simple for line in file loop is far superior."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Recursion shines on nested and branching problems (trees, JSON structures, divide-and-conquer) where the call stack naturally tracks branching paths.",
            "id": "q-11-3-recursion-fundamentals-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "11-4-practical-recursion-data-structures",
    "number": "11.4",
    "title": "Practical Recursion & Data Structures",
    "subtitle": "Solve real-world recursive problems: binary search, nested JSON/tree traversal, and memoization optimization.",
    "readTime": "24 min",
    "objectives": [
      "Process strings and sequences recursively without indexing loops",
      "Implement recursive binary search on sorted sequences achieving O(log N) time",
      "Traverse and transform arbitrarily nested lists, dictionaries, and tree structures",
      "Model hierarchical file system traversals recursively",
      "Understand the Divide-and-Conquer algorithmic paradigm (Merge Sort breakdown)",
      "Optimize overlapping recursive subproblems using Memoization and functools.lru_cache"
    ],
    "theoryBlocks": [
      {
        "heading": "Recursive Sequence & String Processing",
        "text": "Sequential data (strings and lists) can be decomposed into a head (first element) and a tail (the remainder of the sequence). In a recursive function, the base case is reached when the sequence is empty (or has length 1). Processing strings recursively demonstrates how complex operations like reversing text or checking palindromes can be solved without explicit pointers.",
        "codeSnippet": "def reverse_string(s):\n    # Base case: empty string or single character\n    if len(s) <= 1:\n        return s\n    # Recursive step: reverse tail, then append first char\n    return reverse_string(s[1:]) + s[0]\n\ndef is_palindrome(s):\n    # Clean string to lowercase alphanumeric\n    if len(s) <= 1:\n        return True\n    if s[0] != s[-1]:\n        return False\n    return is_palindrome(s[1:-1])\n\nprint(\"Reversed 'python':\", reverse_string(\"python\"))\nprint(\"Is 'radar' palindrome?\", is_palindrome(\"radar\"))\nprint(\"Is 'pilot' palindrome?\", is_palindrome(\"pilot\"))",
        "terminalOutput": "Reversed 'python': nohtyp\nIs 'radar' palindrome? True\nIs 'pilot' palindrome? False",
        "tip": "Slicing `s[1:]` creates a new string copy in Python. For large collections, passing index bounds (`start`, `end`) avoids $O(N)$ string slicing overhead.",
        "mcq": {
          "question": "What is the base case when recursively calculating the sum of elements in a Python list?",
          "options": [
            {
              "id": "A",
              "text": "An empty list (if not lst: return 0)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "When the list has 100 elements",
              "explanationIfWrong": "Recursion shrinks the list toward 0 elements."
            },
            {
              "id": "C",
              "text": "When a negative number is encountered",
              "explanationIfWrong": "Lists may contain negative numbers."
            },
            {
              "id": "D",
              "text": "When the list contains duplicates",
              "explanationIfWrong": "Duplicates do not affect list summation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "When the list is empty (len == 0), the sum of zero elements is 0. This forms the base case.",
          "id": "q-11-4-practical-recursion-data-structures-0-v1"
        },
        "retestMcq": {
          "question": "Given def rec_len(lst): return 0 if not lst else 1 + rec_len(lst[1:]), what does rec_len(['a', 'b', 'c']) evaluate to?",
          "options": [
            {
              "id": "A",
              "text": "3",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "['a', 'b', 'c']",
              "explanationIfWrong": "The function returns an integer count, not the list."
            },
            {
              "id": "C",
              "text": "0",
              "explanationIfWrong": "0 is only returned for an empty list."
            },
            {
              "id": "D",
              "text": "1",
              "explanationIfWrong": "It accumulates 1 + 1 + 1 + 0 = 3."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The function adds 1 for each element until the list is empty, computing length 3.",
          "id": "q-11-4-practical-recursion-data-structures-0-v2"
        },
        "questionPool": [
          {
            "question": "What is the base case when recursively calculating the sum of elements in a Python list?",
            "options": [
              {
                "id": "A",
                "text": "An empty list (if not lst: return 0)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "When the list has 100 elements",
                "explanationIfWrong": "Recursion shrinks the list toward 0 elements."
              },
              {
                "id": "C",
                "text": "When a negative number is encountered",
                "explanationIfWrong": "Lists may contain negative numbers."
              },
              {
                "id": "D",
                "text": "When the list contains duplicates",
                "explanationIfWrong": "Duplicates do not affect list summation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When the list is empty (len == 0), the sum of zero elements is 0. This forms the base case.",
            "id": "q-11-4-practical-recursion-data-structures-0-v1"
          },
          {
            "question": "Given def rec_len(lst): return 0 if not lst else 1 + rec_len(lst[1:]), what does rec_len(['a', 'b', 'c']) evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "3",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "['a', 'b', 'c']",
                "explanationIfWrong": "The function returns an integer count, not the list."
              },
              {
                "id": "C",
                "text": "0",
                "explanationIfWrong": "0 is only returned for an empty list."
              },
              {
                "id": "D",
                "text": "1",
                "explanationIfWrong": "It accumulates 1 + 1 + 1 + 0 = 3."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The function adds 1 for each element until the list is empty, computing length 3.",
            "id": "q-11-4-practical-recursion-data-structures-0-v2"
          },
          {
            "question": "In the palindrome checker is_palindrome(s): if s[0] != s[-1]: return False; return is_palindrome(s[1:-1]), how does the problem shrink?",
            "options": [
              {
                "id": "A",
                "text": "By 2 characters each step (stripping the matched first and last characters)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "By 1 character each step",
                "explanationIfWrong": "s[1:-1] strips both the first and last characters."
              },
              {
                "id": "C",
                "text": "It cuts the string in half",
                "explanationIfWrong": "It strips two outer endpoints."
              },
              {
                "id": "D",
                "text": "It does not shrink",
                "explanationIfWrong": "s[1:-1] reduces string length by 2."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Checking and discarding both matching endpoints reduces string length by 2 on each recursive step.",
            "id": "q-11-4-practical-recursion-data-structures-0-v3"
          }
        ]
      },
      {
        "heading": "Recursive Binary Search",
        "text": "Binary search is the quintessential divide-and-conquer algorithm. On a SORTED collection, it compares the target with the middle element. If the target matches, it returns the index. If the target is smaller, it recursively searches the left half. If larger, it recursively searches the right half. Because the search space is halved at each step, binary search achieves logarithmic $O(\\log N)$ time, locating an item among 1,000,000 items in fewer than 20 comparisons.",
        "codeSnippet": "def binary_search(arr, target, low, high):\n    # Base case: Search window is exhausted (not found)\n    if low > high:\n        return -1\n    \n    mid = (low + high) // 2\n    \n    # Target found at midpoint\n    if arr[mid] == target:\n        return mid\n    # Search left half\n    elif arr[mid] > target:\n        return binary_search(arr, target, low, mid - 1)\n    # Search right half\n    else:\n        return binary_search(arr, target, mid + 1, high)\n\nsorted_nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(\"Index of 23:\", binary_search(sorted_nums, 23, 0, len(sorted_nums) - 1))\nprint(\"Index of 50:\", binary_search(sorted_nums, 50, 0, len(sorted_nums) - 1))",
        "terminalOutput": "Index of 23: 5\nIndex of 50: -1",
        "tip": "Passing `low` and `high` index pointers keeps space complexity at $O(\\log N)$ stack frames without creating costly list copies.",
        "mcq": {
          "question": "What fundamental precondition MUST be satisfied before binary search can be performed on a list?",
          "options": [
            {
              "id": "A",
              "text": "The list elements must already be sorted in ascending order",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The list must contain only positive integers",
              "explanationIfWrong": "Binary search works on any sortable data type."
            },
            {
              "id": "C",
              "text": "The list must have an even length",
              "explanationIfWrong": "Binary search works on any length list."
            },
            {
              "id": "D",
              "text": "The list must contain no duplicate elements",
              "explanationIfWrong": "Binary search works with duplicates (though index found may vary)."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Binary search relies on sorted order to decide whether the target lies in the left or right sub-array.",
          "id": "q-11-4-practical-recursion-data-structures-1-v1"
        },
        "retestMcq": {
          "question": "What is the worst-case time complexity of binary search on a sorted list of size N?",
          "options": [
            {
              "id": "A",
              "text": "O(log N)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "O(N)",
              "explanationIfWrong": "Linear search is O(N); binary search is O(log N)."
            },
            {
              "id": "C",
              "text": "O(N^2)",
              "explanationIfWrong": "O(N^2) is quadratic (like nested loops)."
            },
            {
              "id": "D",
              "text": "O(1)",
              "explanationIfWrong": "O(1) is constant time."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Halving the search space on each comparison yields logarithmic O(log N) time.",
          "id": "q-11-4-practical-recursion-data-structures-1-v2"
        },
        "questionPool": [
          {
            "question": "What fundamental precondition MUST be satisfied before binary search can be performed on a list?",
            "options": [
              {
                "id": "A",
                "text": "The list elements must already be sorted in ascending order",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The list must contain only positive integers",
                "explanationIfWrong": "Binary search works on any sortable data type."
              },
              {
                "id": "C",
                "text": "The list must have an even length",
                "explanationIfWrong": "Binary search works on any length list."
              },
              {
                "id": "D",
                "text": "The list must contain no duplicate elements",
                "explanationIfWrong": "Binary search works with duplicates (though index found may vary)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Binary search relies on sorted order to decide whether the target lies in the left or right sub-array.",
            "id": "q-11-4-practical-recursion-data-structures-1-v1"
          },
          {
            "question": "What is the worst-case time complexity of binary search on a sorted list of size N?",
            "options": [
              {
                "id": "A",
                "text": "O(log N)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "O(N)",
                "explanationIfWrong": "Linear search is O(N); binary search is O(log N)."
              },
              {
                "id": "C",
                "text": "O(N^2)",
                "explanationIfWrong": "O(N^2) is quadratic (like nested loops)."
              },
              {
                "id": "D",
                "text": "O(1)",
                "explanationIfWrong": "O(1) is constant time."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Halving the search space on each comparison yields logarithmic O(log N) time.",
            "id": "q-11-4-practical-recursion-data-structures-1-v2"
          },
          {
            "question": "In recursive binary search with low and high bounds, what indicates that the target does not exist in the list?",
            "options": [
              {
                "id": "A",
                "text": "The low pointer exceeds the high pointer (low > high)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "mid == 0",
                "explanationIfWrong": "mid == 0 is a valid index."
              },
              {
                "id": "C",
                "text": "arr[mid] == 0",
                "explanationIfWrong": "arr[mid] == 0 means 0 is stored at mid."
              },
              {
                "id": "D",
                "text": "len(arr) == 0",
                "explanationIfWrong": "With pointer bounds, low > high signals an empty sub-range."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When low > high, the search interval has collapsed with no match found, signaling a target absence.",
            "id": "q-11-4-practical-recursion-data-structures-1-v3"
          }
        ]
      },
      {
        "heading": "Traversing Arbitrarily Nested Structures",
        "text": "Real-world data structures such as JSON responses, HTML DOM nodes, and file directory trees can have arbitrary levels of nesting. Standard iterative loops cannot handle arbitrary nesting without managing their own manual stack. Recursion handles nested structures effortlessly: if an element is a primitive value, process it; if it is a list or container, call the recursive function on that container.",
        "codeSnippet": "def deep_sum(data):\n    total = 0\n    for item in data:\n        if isinstance(item, list):\n            # Recursive step: recursively sum inner nested list\n            total += deep_sum(item)\n        elif isinstance(item, (int, float)):\n            # Base step for individual number\n            total += item\n    return total\n\nnested = [1, [2, [3, 4], 5], 6, [7, [8, [9, 10]]]]\nprint(\"Deep sum of nested structure:\", deep_sum(nested))",
        "terminalOutput": "Deep sum of nested structure: 55",
        "tip": "Checking `isinstance(item, list)` determines whether to recurse deeper or apply the base operation.",
        "mcq": {
          "question": "Why is recursion significantly superior to flat for-loops when dealing with arbitrarily nested structures?",
          "options": [
            {
              "id": "A",
              "text": "The call stack automatically tracks navigation across unknown and arbitrary levels of nesting",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Flat loops cannot inspect list elements",
              "explanationIfWrong": "Flat loops can inspect elements, but fixed loop nesting cannot handle arbitrary depth."
            },
            {
              "id": "C",
              "text": "Recursion converts lists into strings",
              "explanationIfWrong": "Lists remain native Python objects."
            },
            {
              "id": "D",
              "text": "Python syntax disallows more than two nested for loops",
              "explanationIfWrong": "Any number of loops can be written, but the depth must be known in advance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "With unknown nesting depth, recursion leverages the call stack to traverse down to any level of depth and unwind cleanly.",
          "id": "q-11-4-practical-recursion-data-structures-2-v1"
        },
        "retestMcq": {
          "question": "Given def count_leaves(tree): return 1 if not isinstance(tree, list) else sum(count_leaves(child) for child in tree), what does count_leaves([1, [2, 3], 4]) return?",
          "options": [
            {
              "id": "A",
              "text": "4",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "3",
              "explanationIfWrong": "There are 4 leaf numbers: 1, 2, 3, and 4."
            },
            {
              "id": "C",
              "text": "10",
              "explanationIfWrong": "The function counts leaves (items), not their sum."
            },
            {
              "id": "D",
              "text": "2",
              "explanationIfWrong": "All elements down to primitives are counted."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The leaf values are 1, 2, 3, and 4. Each returns 1, summing to 4 leaves.",
          "id": "q-11-4-practical-recursion-data-structures-2-v2"
        },
        "questionPool": [
          {
            "question": "Why is recursion significantly superior to flat for-loops when dealing with arbitrarily nested structures?",
            "options": [
              {
                "id": "A",
                "text": "The call stack automatically tracks navigation across unknown and arbitrary levels of nesting",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Flat loops cannot inspect list elements",
                "explanationIfWrong": "Flat loops can inspect elements, but fixed loop nesting cannot handle arbitrary depth."
              },
              {
                "id": "C",
                "text": "Recursion converts lists into strings",
                "explanationIfWrong": "Lists remain native Python objects."
              },
              {
                "id": "D",
                "text": "Python syntax disallows more than two nested for loops",
                "explanationIfWrong": "Any number of loops can be written, but the depth must be known in advance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "With unknown nesting depth, recursion leverages the call stack to traverse down to any level of depth and unwind cleanly.",
            "id": "q-11-4-practical-recursion-data-structures-2-v1"
          },
          {
            "question": "Given def count_leaves(tree): return 1 if not isinstance(tree, list) else sum(count_leaves(child) for child in tree), what does count_leaves([1, [2, 3], 4]) return?",
            "options": [
              {
                "id": "A",
                "text": "4",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "3",
                "explanationIfWrong": "There are 4 leaf numbers: 1, 2, 3, and 4."
              },
              {
                "id": "C",
                "text": "10",
                "explanationIfWrong": "The function counts leaves (items), not their sum."
              },
              {
                "id": "D",
                "text": "2",
                "explanationIfWrong": "All elements down to primitives are counted."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The leaf values are 1, 2, 3, and 4. Each returns 1, summing to 4 leaves.",
            "id": "q-11-4-practical-recursion-data-structures-2-v2"
          },
          {
            "question": "What is the base case when recursively flattening a nested structure of lists?",
            "options": [
              {
                "id": "A",
                "text": "When an item is a scalar/primitive (not a list), it is yielded or collected directly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "When the list has exactly 2 elements",
                "explanationIfWrong": "Lists of any size can be nested."
              },
              {
                "id": "C",
                "text": "When encountering a string",
                "explanationIfWrong": "The condition checks if the element is a container."
              },
              {
                "id": "D",
                "text": "When the list contains 0",
                "explanationIfWrong": "0 is a valid data element."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In flattening, non-list items represent the base cases that are appended to the output collection.",
            "id": "q-11-4-practical-recursion-data-structures-2-v3"
          }
        ]
      },
      {
        "heading": "Hierarchical Tree & Directory Traversal",
        "text": "File systems are organized as hierarchical trees of directories and files. Each directory can contain both files (leaf nodes) and subdirectories (branch nodes). A recursive directory traversal visits all files by scanning the current directory: if an entry is a file, it records it; if an entry is a directory, it recursively calls itself on the subdirectory path.",
        "codeSnippet": "# Simulated directory structure as nested dictionaries\nfile_system = {\n    \"name\": \"project\",\n    \"type\": \"dir\",\n    \"children\": [\n        {\"name\": \"README.md\", \"type\": \"file\", \"size\": 1200},\n        {\"name\": \"src\", \"type\": \"dir\", \"children\": [\n            {\"name\": \"main.py\", \"type\": \"file\", \"size\": 3400},\n            {\"name\": \"utils.py\", \"type\": \"file\", \"size\": 2100}\n        ]},\n        {\"name\": \"tests\", \"type\": \"dir\", \"children\": [\n            {\"name\": \"test_main.py\", \"type\": \"file\", \"size\": 1800}\n        ]}\n    ]\n}\n\ndef total_dir_size(node):\n    if node[\"type\"] == \"file\":\n        return node[\"size\"]\n    # Recursive sum of all children inside directory\n    return sum(total_dir_size(child) for child in node.get(\"children\", []))\n\nprint(\"Total project size:\", total_dir_size(file_system), \"bytes\")",
        "terminalOutput": "Total project size: 8500 bytes",
        "tip": "Standard library `os.walk()` uses this exact recursive tree traversal principle behind the scenes.",
        "mcq": {
          "question": "In a file system tree hierarchy, what represents the leaf nodes of the tree?",
          "options": [
            {
              "id": "A",
              "text": "Files (items that contain no children)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Directories (folders)",
              "explanationIfWrong": "Directories are branch/internal nodes that contain children."
            },
            {
              "id": "C",
              "text": "The root directory /",
              "explanationIfWrong": "The root is the topmost parent node."
            },
            {
              "id": "D",
              "text": "The operating system kernel",
              "explanationIfWrong": "The tree structure represents file paths."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In hierarchical tree models, files have no child nodes and thus act as the terminating leaf nodes.",
          "id": "q-11-4-practical-recursion-data-structures-3-v1"
        },
        "retestMcq": {
          "question": "What type of tree traversal visits the parent directory before visiting its subdirectories and files?",
          "options": [
            {
              "id": "A",
              "text": "Pre-order traversal",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Post-order traversal",
              "explanationIfWrong": "Post-order visits children before processing the parent."
            },
            {
              "id": "C",
              "text": "In-order traversal",
              "explanationIfWrong": "In-order applies strictly to binary trees."
            },
            {
              "id": "D",
              "text": "Random traversal",
              "explanationIfWrong": "Tree traversals are strictly ordered."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Pre-order traversal processes the current (parent) node first, then recursively descends into child nodes.",
          "id": "q-11-4-practical-recursion-data-structures-3-v2"
        },
        "questionPool": [
          {
            "question": "In a file system tree hierarchy, what represents the leaf nodes of the tree?",
            "options": [
              {
                "id": "A",
                "text": "Files (items that contain no children)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Directories (folders)",
                "explanationIfWrong": "Directories are branch/internal nodes that contain children."
              },
              {
                "id": "C",
                "text": "The root directory /",
                "explanationIfWrong": "The root is the topmost parent node."
              },
              {
                "id": "D",
                "text": "The operating system kernel",
                "explanationIfWrong": "The tree structure represents file paths."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In hierarchical tree models, files have no child nodes and thus act as the terminating leaf nodes.",
            "id": "q-11-4-practical-recursion-data-structures-3-v1"
          },
          {
            "question": "What type of tree traversal visits the parent directory before visiting its subdirectories and files?",
            "options": [
              {
                "id": "A",
                "text": "Pre-order traversal",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Post-order traversal",
                "explanationIfWrong": "Post-order visits children before processing the parent."
              },
              {
                "id": "C",
                "text": "In-order traversal",
                "explanationIfWrong": "In-order applies strictly to binary trees."
              },
              {
                "id": "D",
                "text": "Random traversal",
                "explanationIfWrong": "Tree traversals are strictly ordered."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Pre-order traversal processes the current (parent) node first, then recursively descends into child nodes.",
            "id": "q-11-4-practical-recursion-data-structures-3-v2"
          },
          {
            "question": "If you want to calculate total disk space of a directory by summing subdirectories first, which traversal is used?",
            "options": [
              {
                "id": "A",
                "text": "Post-order traversal (bottom-up aggregation)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Pre-order traversal",
                "explanationIfWrong": "Pre-order descends before knowing children sizes."
              },
              {
                "id": "C",
                "text": "Breadth-first only",
                "explanationIfWrong": "Depth-first post-order is standard for bottom-up aggregation."
              },
              {
                "id": "D",
                "text": "Linear scan",
                "explanationIfWrong": "Directories require recursive hierarchy traversal."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Post-order traversal resolves all child subtree sizes before computing the total aggregate size of the parent directory.",
            "id": "q-11-4-practical-recursion-data-structures-3-v3"
          }
        ]
      },
      {
        "heading": "The Divide-and-Conquer Paradigm",
        "text": "Divide and Conquer is an algorithmic design paradigm based on multi-branched recursion: 1) DIVIDE the problem into smaller subproblems of the same type; 2) CONQUER the subproblems by solving them recursively (or directly at base case); 3) COMBINE the solutions to form the answer. Merge Sort is the classic example: it divides an unsorted list in half, recursively sorts both halves, and merges the two sorted halves in $O(N)$ time, achieving an optimal $O(N \\log N)$ total sorting runtime.",
        "codeSnippet": "def merge_sort(arr):\n    # Base case: 0 or 1 element is already sorted\n    if len(arr) <= 1:\n        return arr\n    \n    mid = len(arr) // 2\n    # Divide and conquer: recursively sort left and right halves\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    # Combine: merge sorted sublists\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nunsorted = [38, 27, 43, 3, 9, 82, 10]\nprint(\"Sorted with Merge Sort:\", merge_sort(unsorted))",
        "terminalOutput": "Sorted with Merge Sort: [3, 9, 10, 27, 38, 43, 82]",
        "tip": "Merge Sort guarantees $O(N \\log N)$ time complexity in all cases (best, average, and worst).",
        "mcq": {
          "question": "What are the three core steps in the Divide and Conquer algorithmic paradigm?",
          "options": [
            {
              "id": "A",
              "text": "Divide into subproblems, Conquer via recursive solution, Combine results",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Sort the input, Filter duplicates, Print output",
              "explanationIfWrong": "This is a data pipeline, not divide and conquer."
            },
            {
              "id": "C",
              "text": "Allocate stack, Catch exception, Return default",
              "explanationIfWrong": "This is error handling."
            },
            {
              "id": "D",
              "text": "Map values, Reduce total, Flush cache",
              "explanationIfWrong": "This is MapReduce."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Divide and Conquer consists of dividing into subproblems, conquering them recursively, and combining their results.",
          "id": "q-11-4-practical-recursion-data-structures-4-v1"
        },
        "retestMcq": {
          "question": "What is the time complexity of the merge step in Merge Sort when combining two sorted lists of length N/2?",
          "options": [
            {
              "id": "A",
              "text": "O(N) linear time",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "O(N^2) quadratic time",
              "explanationIfWrong": "Because lists are already sorted, merging requires only a single linear pass."
            },
            {
              "id": "C",
              "text": "O(1) constant time",
              "explanationIfWrong": "Every element must be inspected at least once."
            },
            {
              "id": "D",
              "text": "O(log N)",
              "explanationIfWrong": "Merging N items takes O(N) comparisons."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Merging two sorted sub-lists requires iterating through their combined elements once, taking O(N) linear time.",
          "id": "q-11-4-practical-recursion-data-structures-4-v2"
        },
        "questionPool": [
          {
            "question": "What are the three core steps in the Divide and Conquer algorithmic paradigm?",
            "options": [
              {
                "id": "A",
                "text": "Divide into subproblems, Conquer via recursive solution, Combine results",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Sort the input, Filter duplicates, Print output",
                "explanationIfWrong": "This is a data pipeline, not divide and conquer."
              },
              {
                "id": "C",
                "text": "Allocate stack, Catch exception, Return default",
                "explanationIfWrong": "This is error handling."
              },
              {
                "id": "D",
                "text": "Map values, Reduce total, Flush cache",
                "explanationIfWrong": "This is MapReduce."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Divide and Conquer consists of dividing into subproblems, conquering them recursively, and combining their results.",
            "id": "q-11-4-practical-recursion-data-structures-4-v1"
          },
          {
            "question": "What is the time complexity of the merge step in Merge Sort when combining two sorted lists of length N/2?",
            "options": [
              {
                "id": "A",
                "text": "O(N) linear time",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "O(N^2) quadratic time",
                "explanationIfWrong": "Because lists are already sorted, merging requires only a single linear pass."
              },
              {
                "id": "C",
                "text": "O(1) constant time",
                "explanationIfWrong": "Every element must be inspected at least once."
              },
              {
                "id": "D",
                "text": "O(log N)",
                "explanationIfWrong": "Merging N items takes O(N) comparisons."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Merging two sorted sub-lists requires iterating through their combined elements once, taking O(N) linear time.",
            "id": "q-11-4-practical-recursion-data-structures-4-v2"
          },
          {
            "question": "What is the overall worst-case time complexity of Merge Sort on an array of N items?",
            "options": [
              {
                "id": "A",
                "text": "O(N log N)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "O(N^2)",
                "explanationIfWrong": "Bubble Sort and Insertion Sort are O(N^2); Merge Sort is O(N log N)."
              },
              {
                "id": "C",
                "text": "O(N)",
                "explanationIfWrong": "Comparison-based sorting cannot beat O(N log N)."
              },
              {
                "id": "D",
                "text": "O(2^N)",
                "explanationIfWrong": "O(2^N) is exponential."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "There are log2(N) levels of division, each performing O(N) merge work, yielding O(N log N) complexity.",
            "id": "q-11-4-practical-recursion-data-structures-4-v3"
          }
        ]
      },
      {
        "heading": "Memoization & Optimizing Redundant Calls",
        "text": "Naive recursive algorithms can suffer from catastrophic performance when subproblems overlap. For example, naive recursive Fibonacci: `fib(n) = fib(n-1) + fib(n-2)` recomputes identical values millions of times, exhibiting exponential $O(2^N)$ time complexity. Memoization is an optimization technique where the return values of expensive function calls are cached in a hash map. Python provides a built-in decorator `@functools.lru_cache(maxsize=None)` that automatically memoizes recursive functions, transforming exponential $O(2^N)$ algorithms into blistering $O(N)$ linear speed.",
        "codeSnippet": "import time\nfrom functools import lru_cache\n\n# Without memoization: fib(35) takes ~2 seconds and ~29,000,000 function calls!\n# With memoization: fib(35) takes < 0.0001 seconds and exactly 35 calls!\n\n@lru_cache(maxsize=None)\ndef fib_memo(n):\n    if n <= 1:\n        return n\n    return fib_memo(n - 1) + fib_memo(n - 2)\n\nt0 = time.perf_counter()\nres = fib_memo(35)\nt1 = time.perf_counter()\n\nprint(f\"fib(35) = {res} (Computed in {(t1 - t0)*1000:.4f} ms)\")",
        "terminalOutput": "fib(35) = 9227465 (Computed in 0.0412 ms)",
        "tip": "Always consider memoization when a recursive function branches into two or more calls with overlapping arguments.",
        "mcq": {
          "question": "Why does the naive recursive Fibonacci algorithm have exponential O(2^N) time complexity?",
          "options": [
            {
              "id": "A",
              "text": "It repeatedly recalculates the exact same subproblems exponentially many times across branching call trees",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because integers in Python require 64 bits",
              "explanationIfWrong": "Integer size does not affect algorithmic time complexity."
            },
            {
              "id": "C",
              "text": "Because Python does not support recursion",
              "explanationIfWrong": "Python fully supports recursion."
            },
            {
              "id": "D",
              "text": "Because of Python's Global Interpreter Lock (GIL)",
              "explanationIfWrong": "The GIL affects multi-threading, not algorithmic recurrence."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Computing fib(5) computes fib(3) twice, fib(2) three times, and fib(1) five times. At n=40, over 2 billion redundant calls are made.",
          "id": "q-11-4-practical-recursion-data-structures-5-v1"
        },
        "retestMcq": {
          "question": "What Python standard library decorator provides automatic function memoization caching?",
          "options": [
            {
              "id": "A",
              "text": "@functools.lru_cache",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "@memoize.cache",
              "explanationIfWrong": "'memoize' is not a standard library module in Python."
            },
            {
              "id": "C",
              "text": "@sys.fast_recursion",
              "explanationIfWrong": "No such decorator exists in sys."
            },
            {
              "id": "D",
              "text": "@itertools.cache",
              "explanationIfWrong": "itertools provides combinatorics; caching is in functools."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "functools.lru_cache (or functools.cache in Python 3.9+) provides built-in memoization.",
          "id": "q-11-4-practical-recursion-data-structures-5-v2"
        },
        "questionPool": [
          {
            "question": "Why does the naive recursive Fibonacci algorithm have exponential O(2^N) time complexity?",
            "options": [
              {
                "id": "A",
                "text": "It repeatedly recalculates the exact same subproblems exponentially many times across branching call trees",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because integers in Python require 64 bits",
                "explanationIfWrong": "Integer size does not affect algorithmic time complexity."
              },
              {
                "id": "C",
                "text": "Because Python does not support recursion",
                "explanationIfWrong": "Python fully supports recursion."
              },
              {
                "id": "D",
                "text": "Because of Python's Global Interpreter Lock (GIL)",
                "explanationIfWrong": "The GIL affects multi-threading, not algorithmic recurrence."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Computing fib(5) computes fib(3) twice, fib(2) three times, and fib(1) five times. At n=40, over 2 billion redundant calls are made.",
            "id": "q-11-4-practical-recursion-data-structures-5-v1"
          },
          {
            "question": "What Python standard library decorator provides automatic function memoization caching?",
            "options": [
              {
                "id": "A",
                "text": "@functools.lru_cache",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "@memoize.cache",
                "explanationIfWrong": "'memoize' is not a standard library module in Python."
              },
              {
                "id": "C",
                "text": "@sys.fast_recursion",
                "explanationIfWrong": "No such decorator exists in sys."
              },
              {
                "id": "D",
                "text": "@itertools.cache",
                "explanationIfWrong": "itertools provides combinatorics; caching is in functools."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "functools.lru_cache (or functools.cache in Python 3.9+) provides built-in memoization.",
            "id": "q-11-4-practical-recursion-data-structures-5-v2"
          },
          {
            "question": "What requirement must function arguments satisfy for @lru_cache memoization to work?",
            "options": [
              {
                "id": "A",
                "text": "The arguments must be hashable (such as ints, strings, or tuples, but NOT mutable lists/dicts)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "All arguments must be integers",
                "explanationIfWrong": "Any hashable type (including strings and tuples) is valid."
              },
              {
                "id": "C",
                "text": "The function must accept exactly one argument",
                "explanationIfWrong": "Functions can take multiple arguments."
              },
              {
                "id": "D",
                "text": "The arguments must be global variables",
                "explanationIfWrong": "Global variables are not required."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because lru_cache stores cached results in an internal dictionary, all function arguments must be hashable to act as dictionary keys.",
            "id": "q-11-4-practical-recursion-data-structures-5-v3"
          }
        ]
      }
    ]
  }
];

// Question pool selector for Part 11
export const getActiveQuestionsForLevelPart11 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part11_seen_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part11_active_qset_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 11
export const getConsecutiveFailuresPart11 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part11_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart11 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part11_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart11 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part11_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart11 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part11_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart11 = (
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
  const currentAttempt = getLevelAttemptCountPart11(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part11_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part11_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part11_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part11_locked_${studentId}`);
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
      setLevelAttemptCountPart11(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart11(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart11(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part11_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part11_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part11_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart11 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part11_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part11_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part11_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part11_locked_progression_${studentId}`);
  } catch {}
};
