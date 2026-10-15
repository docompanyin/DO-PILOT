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

export const PART_7_SECTIONS: SectionContent[] = [
  {
    "id": "7-1-modules",
    "number": "7.1",
    "title": "Modules & Namespaces",
    "subtitle": "Import and utilize standard library modules with import, from-import, as aliases, and inspect with dir().",
    "readTime": "20 min",
    "objectives": [
      "Import Python standard modules using the import keyword",
      "Selectively import functions and constants with from module import name",
      "Use the as keyword to create clear namespace aliases",
      "Avoid wildcard imports (from module import *) and namespace pollution",
      "Inspect module contents dynamically using the built-in dir() function",
      "Understand standard library modules like math, sys, and os"
],
    "theoryBlocks": [
      {
        "heading": "Importing Modules with import",
        "text": "A module is a file containing Python definitions, functions, and statements. The import statement loads a module into your script, placing its contents inside a dedicated namespace accessible via dot notation (e.g. math.sqrt(25)). This namespace prevents function names from colliding with your own variables.",
        "codeSnippet": "import math\n\nprint(f\"Pi: {math.pi:.4f}\")\nprint(f\"Square root of 16: {math.sqrt(16)}\")\nprint(f\"Ceiling of 4.2: {math.ceil(4.2)}\")",
        "terminalOutput": "Pi: 3.1416\nSquare root of 16: 4.0\nCeiling of 4.2: 5",
        "tip": "Python comes with 'batteries included' \u2014 an extensive standard library available without installing third-party packages.",
        "mcq": {
          "id": "q-7.1-0-v1",
          "question": "What is the primary advantage of using import math and accessing math.sqrt() over importing sqrt directly into the global namespace?",
          "options": [
                    {
                              "id": "A",
                              "text": "It keeps functions inside their own namespace, preventing accidental name collisions with your own variables",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It makes math calculations 5x faster",
                              "explanationIfWrong": "Namespace qualification has no significant effect on math execution speed."
                    },
                    {
                              "id": "C",
                              "text": "It is required for compiled C code",
                              "explanationIfWrong": "Both import styles work identically with C extensions."
                    },
                    {
                              "id": "D",
                              "text": "It reduces memory usage to zero",
                              "explanationIfWrong": "The module object is loaded in both cases."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Qualifying calls with math. prevents collisions if you write your own sqrt function or variable."
},
        "retestMcq": {
          "id": "q-7.1-0-v2",
          "question": "What error occurs if you call sqrt(9) after writing only import math?",
          "options": [
                    {
                              "id": "A",
                              "text": "NameError: name 'sqrt' is not defined",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "AttributeError",
                              "explanationIfWrong": "sqrt is not in global scope; it resides inside the math module."
                    },
                    {
                              "id": "C",
                              "text": "ImportError",
                              "explanationIfWrong": "The import succeeded; the identifier lookup in global scope failed."
                    },
                    {
                              "id": "D",
                              "text": "TypeError",
                              "explanationIfWrong": "Undefined names raise NameError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "import math brings in the module object. You must call math.sqrt(9) or import it specifically."
},
        "questionPool": [
          {
            "id": "q-7.1-0-v1",
            "question": "What is the primary advantage of using import math and accessing math.sqrt() over importing sqrt directly into the global namespace?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It keeps functions inside their own namespace, preventing accidental name collisions with your own variables",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It makes math calculations 5x faster",
                                    "explanationIfWrong": "Namespace qualification has no significant effect on math execution speed."
                        },
                        {
                                    "id": "C",
                                    "text": "It is required for compiled C code",
                                    "explanationIfWrong": "Both import styles work identically with C extensions."
                        },
                        {
                                    "id": "D",
                                    "text": "It reduces memory usage to zero",
                                    "explanationIfWrong": "The module object is loaded in both cases."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Qualifying calls with math. prevents collisions if you write your own sqrt function or variable."
},
          {
            "id": "q-7.1-0-v2",
            "question": "What error occurs if you call sqrt(9) after writing only import math?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "NameError: name 'sqrt' is not defined",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "AttributeError",
                                    "explanationIfWrong": "sqrt is not in global scope; it resides inside the math module."
                        },
                        {
                                    "id": "C",
                                    "text": "ImportError",
                                    "explanationIfWrong": "The import succeeded; the identifier lookup in global scope failed."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Undefined names raise NameError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "import math brings in the module object. You must call math.sqrt(9) or import it specifically."
},
          {
            "id": "q-7.1-0-v3",
            "question": "What does math.floor(3.9) return?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "4",
                                    "explanationIfWrong": "math.floor rounds down to the nearest integer."
                        },
                        {
                                    "id": "C",
                                    "text": "3.9",
                                    "explanationIfWrong": "floor returns an integer."
                        },
                        {
                                    "id": "D",
                                    "text": "3.0",
                                    "explanationIfWrong": "In Python 3, math.floor() returns an int (3)."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "math.floor(x) returns the largest integer less than or equal to x (3)."
}
        ]
      },
      {
        "heading": "Selective Imports: from ... import",
        "text": "When you only need specific functions or constants from a module, you can import them directly into the current namespace using from module import item1, item2. This allows calling the functions without the module prefix.",
        "codeSnippet": "from math import sqrt, pi, sin\n\nradius = 5.0\narea = pi * (radius ** 2)\nprint(f\"Area: {area:.2f}\")\nprint(f\"Hypotenuse: {sqrt(3**2 + 4**2)}\")",
        "terminalOutput": "Area: 78.54\nHypotenuse: 5.0",
        "mcq": {
          "id": "q-7.1-1-v1",
          "question": "What is the result of from math import pow; print(pow(2, 3))?",
          "options": [
                    {
                              "id": "A",
                              "text": "8.0",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "6",
                              "explanationIfWrong": "pow(2, 3) computes 2 to the power of 3: 2 * 2 * 2 = 8.0."
                    },
                    {
                              "id": "C",
                              "text": "9",
                              "explanationIfWrong": "2**3 = 8."
                    },
                    {
                              "id": "D",
                              "text": "NameError",
                              "explanationIfWrong": "pow was imported directly into the current scope."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "math.pow(2, 3) calculates float exponentiation: 2^3 = 8.0."
},
        "retestMcq": {
          "id": "q-7.1-1-v2",
          "question": "Why is from math import * (wildcard import) discouraged in professional Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "It pollutes the local namespace with dozens of unknown names, making it hard to track where functions came from and risking accidental overwrites",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It raises a SyntaxError in Python 3.10+",
                              "explanationIfWrong": "Wildcard imports are valid syntax at module level, but poor practice."
                    },
                    {
                              "id": "C",
                              "text": "It doubles the download size of Python",
                              "explanationIfWrong": "Standard library modules are already installed locally."
                    },
                    {
                              "id": "D",
                              "text": "It only imports private functions",
                              "explanationIfWrong": "It imports all public names."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Wildcard imports obscure origin of names and cause silent variable shadowing."
},
        "questionPool": [
          {
            "id": "q-7.1-1-v1",
            "question": "What is the result of from math import pow; print(pow(2, 3))?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "8.0",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "6",
                                    "explanationIfWrong": "pow(2, 3) computes 2 to the power of 3: 2 * 2 * 2 = 8.0."
                        },
                        {
                                    "id": "C",
                                    "text": "9",
                                    "explanationIfWrong": "2**3 = 8."
                        },
                        {
                                    "id": "D",
                                    "text": "NameError",
                                    "explanationIfWrong": "pow was imported directly into the current scope."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "math.pow(2, 3) calculates float exponentiation: 2^3 = 8.0."
},
          {
            "id": "q-7.1-1-v2",
            "question": "Why is from math import * (wildcard import) discouraged in professional Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It pollutes the local namespace with dozens of unknown names, making it hard to track where functions came from and risking accidental overwrites",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It raises a SyntaxError in Python 3.10+",
                                    "explanationIfWrong": "Wildcard imports are valid syntax at module level, but poor practice."
                        },
                        {
                                    "id": "C",
                                    "text": "It doubles the download size of Python",
                                    "explanationIfWrong": "Standard library modules are already installed locally."
                        },
                        {
                                    "id": "D",
                                    "text": "It only imports private functions",
                                    "explanationIfWrong": "It imports all public names."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Wildcard imports obscure origin of names and cause silent variable shadowing."
},
          {
            "id": "q-7.1-1-v3",
            "question": "Can you import multiple items on a single from ... import line?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, separated by commas: from math import sqrt, ceil, floor",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, each import requires its own line",
                                    "explanationIfWrong": "Comma-separated imports are standard Python syntax."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if wrapped in a list [sqrt, ceil]",
                                    "explanationIfWrong": "Items are separated by commas without brackets."
                        },
                        {
                                    "id": "D",
                                    "text": "Only up to 2 items",
                                    "explanationIfWrong": "Any number of items can be imported."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiple names can be imported from a module separated by commas."
}
        ]
      },
      {
        "heading": "Aliasing with as",
        "text": "The as keyword creates an alias (an alternative name) for an imported module or function. This is commonly used to shorten long names, follow industry conventions (e.g. import datetime as dt), or avoid naming collisions.",
        "codeSnippet": "import math as m\nfrom math import factorial as fact\n\nprint(f\"5! = {fact(5)}\")\nprint(f\"Cosine of 0 = {m.cos(0)}\")",
        "terminalOutput": "5! = 120\nCosine of 0 = 1.0",
        "mcq": {
          "id": "q-7.1-2-v1",
          "question": "If you write import math as m, can you still call math.sqrt(4)?",
          "options": [
                    {
                              "id": "A",
                              "text": "No, because the module was bound to the name m; the name 'math' is not defined in the namespace",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Yes, both math and m are available",
                              "explanationIfWrong": "as rebinds the import to the alias only."
                    },
                    {
                              "id": "C",
                              "text": "Yes, but with a DeprecationWarning",
                              "explanationIfWrong": "NameError is raised for math."
                    },
                    {
                              "id": "D",
                              "text": "Only inside functions",
                              "explanationIfWrong": "The name math is completely unbound in that scope."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "import math as m binds the imported module object exclusively to the identifier m."
},
        "retestMcq": {
          "id": "q-7.1-2-v2",
          "question": "What is the common convention for aliasing the standard datetime module?",
          "options": [
                    {
                              "id": "A",
                              "text": "import datetime as dt",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "import datetime as d",
                              "explanationIfWrong": "dt is the standard convention."
                    },
                    {
                              "id": "C",
                              "text": "import datetime as time",
                              "explanationIfWrong": "time is another built-in module, so aliasing as time creates conflicts."
                    },
                    {
                              "id": "D",
                              "text": "import datetime as date_time_module",
                              "explanationIfWrong": "Aliases are chosen for brevity."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "import datetime as dt is standard across the Python community."
},
        "questionPool": [
          {
            "id": "q-7.1-2-v1",
            "question": "If you write import math as m, can you still call math.sqrt(4)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, because the module was bound to the name m; the name 'math' is not defined in the namespace",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, both math and m are available",
                                    "explanationIfWrong": "as rebinds the import to the alias only."
                        },
                        {
                                    "id": "C",
                                    "text": "Yes, but with a DeprecationWarning",
                                    "explanationIfWrong": "NameError is raised for math."
                        },
                        {
                                    "id": "D",
                                    "text": "Only inside functions",
                                    "explanationIfWrong": "The name math is completely unbound in that scope."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "import math as m binds the imported module object exclusively to the identifier m."
},
          {
            "id": "q-7.1-2-v2",
            "question": "What is the common convention for aliasing the standard datetime module?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "import datetime as dt",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "import datetime as d",
                                    "explanationIfWrong": "dt is the standard convention."
                        },
                        {
                                    "id": "C",
                                    "text": "import datetime as time",
                                    "explanationIfWrong": "time is another built-in module, so aliasing as time creates conflicts."
                        },
                        {
                                    "id": "D",
                                    "text": "import datetime as date_time_module",
                                    "explanationIfWrong": "Aliases are chosen for brevity."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "import datetime as dt is standard across the Python community."
},
          {
            "id": "q-7.1-2-v3",
            "question": "How do you rename a function during import to prevent shadowing your own function?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "from module import func as custom_func",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "from module import func -> custom_func",
                                    "explanationIfWrong": "Python uses as, not ->."
                        },
                        {
                                    "id": "C",
                                    "text": "import func from module rename custom_func",
                                    "explanationIfWrong": "as is the only renaming keyword in Python imports."
                        },
                        {
                                    "id": "D",
                                    "text": "alias func = custom_func",
                                    "explanationIfWrong": "Python does not have an alias keyword."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "from module import name as alias cleanly isolates the imported name."
}
        ]
      },
      {
        "heading": "Inspecting Modules with dir()",
        "text": "The built-in dir(module) function returns an alphabetically sorted list of all valid attribute names, functions, and classes defined within that module. It is a powerful tool for interactive exploration and debugging.",
        "codeSnippet": "import math\n\nmath_contents = dir(math)\n# Print first 5 items:\nprint(f\"First 5 attributes: {math_contents[:5]}\")\n# Filter functions starting with 's':\ns_funcs = [name for name in math_contents if name.startswith(\"s\")]\nprint(f\"S-functions: {s_funcs}\")",
        "terminalOutput": "First 5 attributes: ['__doc__', '__loader__', '__name__', '__package__', '__spec__']\nS-functions: ['sin', 'sinh', 'sqrt']",
        "mcq": {
          "id": "q-7.1-3-v1",
          "question": "What does dir(math) return?",
          "options": [
                    {
                              "id": "A",
                              "text": "A list of strings representing all functions, constants, and attributes in the math module",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The source code of the math module",
                              "explanationIfWrong": "dir() returns attribute names, not source code."
                    },
                    {
                              "id": "C",
                              "text": "The directory path where math.py is saved on disk",
                              "explanationIfWrong": "File path is in math.__file__."
                    },
                    {
                              "id": "D",
                              "text": "A dictionary of function docstrings",
                              "explanationIfWrong": "dir() returns a list of string identifiers."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "dir() inspects any object and returns a list of its available attribute and method names."
},
        "retestMcq": {
          "id": "q-7.1-3-v2",
          "question": "What do names beginning and ending with double underscores (e.g. '__doc__') represent in module inspection?",
          "options": [
                    {
                              "id": "A",
                              "text": "Special dunder (magic) attributes maintained automatically by the Python runtime",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Deprecated functions scheduled for deletion",
                              "explanationIfWrong": "Dunder attributes store metadata like documentation and module names."
                    },
                    {
                              "id": "C",
                              "text": "Syntax errors",
                              "explanationIfWrong": "Double underscore attributes are standard Python conventions."
                    },
                    {
                              "id": "D",
                              "text": "Private variables that cannot be read",
                              "explanationIfWrong": "They can be read freely (e.g. math.__doc__)."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dunder attributes (double underscore) store runtime metadata like __name__ and __doc__."
},
        "questionPool": [
          {
            "id": "q-7.1-3-v1",
            "question": "What does dir(math) return?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A list of strings representing all functions, constants, and attributes in the math module",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The source code of the math module",
                                    "explanationIfWrong": "dir() returns attribute names, not source code."
                        },
                        {
                                    "id": "C",
                                    "text": "The directory path where math.py is saved on disk",
                                    "explanationIfWrong": "File path is in math.__file__."
                        },
                        {
                                    "id": "D",
                                    "text": "A dictionary of function docstrings",
                                    "explanationIfWrong": "dir() returns a list of string identifiers."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "dir() inspects any object and returns a list of its available attribute and method names."
},
          {
            "id": "q-7.1-3-v2",
            "question": "What do names beginning and ending with double underscores (e.g. '__doc__') represent in module inspection?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Special dunder (magic) attributes maintained automatically by the Python runtime",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Deprecated functions scheduled for deletion",
                                    "explanationIfWrong": "Dunder attributes store metadata like documentation and module names."
                        },
                        {
                                    "id": "C",
                                    "text": "Syntax errors",
                                    "explanationIfWrong": "Double underscore attributes are standard Python conventions."
                        },
                        {
                                    "id": "D",
                                    "text": "Private variables that cannot be read",
                                    "explanationIfWrong": "They can be read freely (e.g. math.__doc__)."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dunder attributes (double underscore) store runtime metadata like __name__ and __doc__."
},
          {
            "id": "q-7.1-3-v3",
            "question": "What happens if you call dir() with no arguments?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It returns the list of names in the current local scope",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It raises a TypeError: missing required argument",
                                    "explanationIfWrong": "dir() with no arguments inspects current local scope."
                        },
                        {
                                    "id": "C",
                                    "text": "It prints all files in the current folder",
                                    "explanationIfWrong": "Folder files are listed by os.listdir(), not dir()."
                        },
                        {
                                    "id": "D",
                                    "text": "It deletes all variables",
                                    "explanationIfWrong": "dir() is read-only."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without arguments, dir() returns the names defined in the currently executing scope."
}
        ]
      },
      {
        "heading": "Standard Modules: math, string & sys",
        "text": "The Python standard library provides specialized modules: math offers advanced mathematical operations (trigonometry, logarithms, factorials); string provides convenient collections of characters (ascii_letters, digits); and sys provides interpreter parameters and command-line arguments (sys.argv).",
        "codeSnippet": "import string\nimport sys\n\nprint(f\"Digits: {string.digits}\")\nprint(f\"ASCII lowercase: {string.ascii_lowercase[:10]}...\")\nprint(f\"Python executable: {sys.executable}\")",
        "terminalOutput": "Digits: 0123456789\nASCII lowercase: abcdefghij...\nPython executable: C:\\Python313\\python.exe",
        "mcq": {
          "id": "q-7.1-4-v1",
          "question": "What does string.digits evaluate to?",
          "options": [
                    {
                              "id": "A",
                              "text": "'0123456789'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]",
                              "explanationIfWrong": "string.digits is a string, not a list of integers."
                    },
                    {
                              "id": "C",
                              "text": "10",
                              "explanationIfWrong": "It returns the string of digit characters."
                    },
                    {
                              "id": "D",
                              "text": "['0', '1', ...]",
                              "explanationIfWrong": "It is a plain string '0123456789'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "string.digits is the string constant '0123456789'."
},
        "retestMcq": {
          "id": "q-7.1-4-v2",
          "question": "How do you access command-line arguments passed to a Python script (e.g. python script.py arg1 arg2)?",
          "options": [
                    {
                              "id": "A",
                              "text": "sys.argv",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "os.args",
                              "explanationIfWrong": "Command line arguments reside in sys.argv."
                    },
                    {
                              "id": "C",
                              "text": "input.args",
                              "explanationIfWrong": "sys.argv is the standard list."
                    },
                    {
                              "id": "D",
                              "text": "python.args",
                              "explanationIfWrong": "sys.argv holds CLI arguments as a list of strings."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "sys.argv is a list containing command-line arguments, where sys.argv[0] is the script name."
},
        "questionPool": [
          {
            "id": "q-7.1-4-v1",
            "question": "What does string.digits evaluate to?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'0123456789'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]",
                                    "explanationIfWrong": "string.digits is a string, not a list of integers."
                        },
                        {
                                    "id": "C",
                                    "text": "10",
                                    "explanationIfWrong": "It returns the string of digit characters."
                        },
                        {
                                    "id": "D",
                                    "text": "['0', '1', ...]",
                                    "explanationIfWrong": "It is a plain string '0123456789'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "string.digits is the string constant '0123456789'."
},
          {
            "id": "q-7.1-4-v2",
            "question": "How do you access command-line arguments passed to a Python script (e.g. python script.py arg1 arg2)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "sys.argv",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "os.args",
                                    "explanationIfWrong": "Command line arguments reside in sys.argv."
                        },
                        {
                                    "id": "C",
                                    "text": "input.args",
                                    "explanationIfWrong": "sys.argv is the standard list."
                        },
                        {
                                    "id": "D",
                                    "text": "python.args",
                                    "explanationIfWrong": "sys.argv holds CLI arguments as a list of strings."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "sys.argv is a list containing command-line arguments, where sys.argv[0] is the script name."
},
          {
            "id": "q-7.1-4-v3",
            "question": "Which function in sys terminates a Python script immediately with a status code?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "sys.exit()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "sys.stop()",
                                    "explanationIfWrong": "The function is sys.exit()."
                        },
                        {
                                    "id": "C",
                                    "text": "sys.terminate()",
                                    "explanationIfWrong": "sys.exit() is standard."
                        },
                        {
                                    "id": "D",
                                    "text": "sys.quit_now()",
                                    "explanationIfWrong": "sys.exit() raises SystemExit to exit cleanly."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "sys.exit(0) exits the interpreter cleanly; non-zero codes indicate errors."
}
        ]
      },
      {
        "heading": "Module Execution & Import Mechanics",
        "text": "When Python imports a module for the first time, it compiles it to bytecode and executes all top-level statements inside the module from top to bottom. Python caches the module in sys.modules, so subsequent imports in the same process do not re-execute the code.",
        "codeSnippet": "import sys\nimport math\n\nprint(\"math\" in sys.modules)  # True (module is cached)",
        "terminalOutput": "True",
        "mcq": {
          "id": "q-7.1-5-v1",
          "question": "What happens if a module is imported 5 times across different files in the same Python program?",
          "options": [
                    {
                              "id": "A",
                              "text": "The module code executes only once on the first import; subsequent imports reuse the cached module from sys.modules",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The module executes 5 separate times",
                              "explanationIfWrong": "Python caches modules to avoid duplicate execution overhead."
                    },
                    {
                              "id": "C",
                              "text": "Python raises an ImportDuplicationError",
                              "explanationIfWrong": "Re-importing is standard and safe."
                    },
                    {
                              "id": "D",
                              "text": "The computer runs out of memory",
                              "explanationIfWrong": "Cached references share the same memory instance."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python executes a module only on its initial import, storing it in sys.modules for fast subsequent retrieval."
},
        "retestMcq": {
          "id": "q-7.1-5-v2",
          "question": "What is the __pycache__ directory created by Python when importing modules?",
          "options": [
                    {
                              "id": "A",
                              "text": "A folder storing compiled bytecode (.pyc files) to make future imports faster",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A backup copy of deleted code",
                              "explanationIfWrong": "__pycache__ contains compiled .pyc files."
                    },
                    {
                              "id": "C",
                              "text": "A virus quarantine folder",
                              "explanationIfWrong": "__pycache__ is normal Python bytecode caching."
                    },
                    {
                              "id": "D",
                              "text": "Temporary internet cache",
                              "explanationIfWrong": "It caches local Python bytecode."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": ".pyc files in __pycache__ store compiled bytecode so Python does not need to reparse source code on every run."
},
        "questionPool": [
          {
            "id": "q-7.1-5-v1",
            "question": "What happens if a module is imported 5 times across different files in the same Python program?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The module code executes only once on the first import; subsequent imports reuse the cached module from sys.modules",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The module executes 5 separate times",
                                    "explanationIfWrong": "Python caches modules to avoid duplicate execution overhead."
                        },
                        {
                                    "id": "C",
                                    "text": "Python raises an ImportDuplicationError",
                                    "explanationIfWrong": "Re-importing is standard and safe."
                        },
                        {
                                    "id": "D",
                                    "text": "The computer runs out of memory",
                                    "explanationIfWrong": "Cached references share the same memory instance."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python executes a module only on its initial import, storing it in sys.modules for fast subsequent retrieval."
},
          {
            "id": "q-7.1-5-v2",
            "question": "What is the __pycache__ directory created by Python when importing modules?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A folder storing compiled bytecode (.pyc files) to make future imports faster",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A backup copy of deleted code",
                                    "explanationIfWrong": "__pycache__ contains compiled .pyc files."
                        },
                        {
                                    "id": "C",
                                    "text": "A virus quarantine folder",
                                    "explanationIfWrong": "__pycache__ is normal Python bytecode caching."
                        },
                        {
                                    "id": "D",
                                    "text": "Temporary internet cache",
                                    "explanationIfWrong": "It caches local Python bytecode."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ".pyc files in __pycache__ store compiled bytecode so Python does not need to reparse source code on every run."
},
          {
            "id": "q-7.1-5-v3",
            "question": "Where does Python search for modules when you write import my_module?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "In the current directory, installed site-packages, and directories listed in sys.path",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Only in the Windows System32 folder",
                                    "explanationIfWrong": "sys.path includes script directories, PYTHONPATH, and site-packages."
                        },
                        {
                                    "id": "C",
                                    "text": "Only on the internet",
                                    "explanationIfWrong": "import only searches local directories in sys.path."
                        },
                        {
                                    "id": "D",
                                    "text": "In every folder on the hard drive",
                                    "explanationIfWrong": "Python searches only specific paths in sys.path."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "sys.path lists all directories searched by Python when attempting an import."
}
        ]
      }
    ]
  },
  {
    "id": "7-2-randomness",
    "number": "7.2",
    "title": "Randomness & Probabilities",
    "subtitle": "Generate pseudo-random numbers, simulate dice, pick random choices, shuffle sequences, and control seeds.",
    "readTime": "20 min",
    "objectives": [
      "Generate random integers with randint() and randrange()",
      "Generate random floating-point decimals with random.random()",
      "Pick random elements from sequences using random.choice() and random.sample()",
      "Shuffle mutable lists in-place using random.shuffle()",
      "Understand pseudo-random generation and replicate tests with random.seed()",
      "Simulate games of chance (dice, coins, lottery picks) accurately"
],
    "theoryBlocks": [
      {
        "heading": "Generating Random Integers: randint()",
        "text": "The random module provides tools for generating pseudo-random values. To generate a random integer between a and b (both endpoints inclusive), use random.randint(a, b).",
        "codeSnippet": "import random\n\n# Roll a standard 6-sided die:\ndie_roll = random.randint(1, 6)\nprint(f\"You rolled: {die_roll}\")",
        "terminalOutput": "You rolled: 4",
        "tip": "Unlike range(a, b), random.randint(a, b) INCLUDES the upper boundary b.",
        "mcq": {
          "id": "q-7.2-0-v1",
          "question": "What is the possible range of values returned by random.randint(1, 10)?",
          "options": [
                    {
                              "id": "A",
                              "text": "Any integer from 1 to 10 inclusive (1 and 10 can both be returned)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Integers from 1 to 9 only (10 is excluded)",
                              "explanationIfWrong": "randint() is inclusive of both endpoints, unlike range()."
                    },
                    {
                              "id": "C",
                              "text": "Floating point numbers like 1.5",
                              "explanationIfWrong": "randint returns only integers."
                    },
                    {
                              "id": "D",
                              "text": "0 to 10",
                              "explanationIfWrong": "The minimum boundary is 1."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "random.randint(a, b) includes both a and b in its possible outcomes."
},
        "retestMcq": {
          "id": "q-7.2-0-v2",
          "question": "How does random.randrange(1, 10) differ from random.randint(1, 10)?",
          "options": [
                    {
                              "id": "A",
                              "text": "randrange(1, 10) excludes 10 (generates 1 to 9), matching range() semantics",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "randrange() returns floating-point numbers",
                              "explanationIfWrong": "Both return integers."
                    },
                    {
                              "id": "C",
                              "text": "randrange() generates negative numbers",
                              "explanationIfWrong": "Bounds are respected."
                    },
                    {
                              "id": "D",
                              "text": "There is no difference",
                              "explanationIfWrong": "randint includes the stop value; randrange excludes it."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "randrange(start, stop) follows standard Python range semantics where stop is exclusive."
},
        "questionPool": [
          {
            "id": "q-7.2-0-v1",
            "question": "What is the possible range of values returned by random.randint(1, 10)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Any integer from 1 to 10 inclusive (1 and 10 can both be returned)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Integers from 1 to 9 only (10 is excluded)",
                                    "explanationIfWrong": "randint() is inclusive of both endpoints, unlike range()."
                        },
                        {
                                    "id": "C",
                                    "text": "Floating point numbers like 1.5",
                                    "explanationIfWrong": "randint returns only integers."
                        },
                        {
                                    "id": "D",
                                    "text": "0 to 10",
                                    "explanationIfWrong": "The minimum boundary is 1."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "random.randint(a, b) includes both a and b in its possible outcomes."
},
          {
            "id": "q-7.2-0-v2",
            "question": "How does random.randrange(1, 10) differ from random.randint(1, 10)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "randrange(1, 10) excludes 10 (generates 1 to 9), matching range() semantics",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "randrange() returns floating-point numbers",
                                    "explanationIfWrong": "Both return integers."
                        },
                        {
                                    "id": "C",
                                    "text": "randrange() generates negative numbers",
                                    "explanationIfWrong": "Bounds are respected."
                        },
                        {
                                    "id": "D",
                                    "text": "There is no difference",
                                    "explanationIfWrong": "randint includes the stop value; randrange excludes it."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "randrange(start, stop) follows standard Python range semantics where stop is exclusive."
},
          {
            "id": "q-7.2-0-v3",
            "question": "How do you simulate flipping a fair coin (returning 'Heads' or 'Tails' with equal probability)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'Heads' if random.randint(0, 1) == 0 else 'Tails'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "random.coin()",
                                    "explanationIfWrong": "Python does not have a random.coin() function."
                        },
                        {
                                    "id": "C",
                                    "text": "random.randint(1, 2) == 1",
                                    "explanationIfWrong": "This returns a boolean, not 'Heads' or 'Tails'."
                        },
                        {
                                    "id": "D",
                                    "text": "random.flip()",
                                    "explanationIfWrong": "There is no flip() function in random."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A 50/50 split between 0 and 1 simulates a fair coin flip."
}
        ]
      },
      {
        "heading": "Floating-Point Randomness: random()",
        "text": "The random.random() function returns a pseudo-random floating-point number in the range [0.0, 1.0) \u2014 inclusive of 0.0, but strictly less than 1.0. You can scale and shift this value to represent probabilities or custom float ranges.",
        "codeSnippet": "import random\n\nval = random.random()\nprint(f\"Float between 0.0 and 1.0: {val:.4f}\")\n\n# 80% chance of success:\nif random.random() < 0.8:\n    print(\"Success! (80% probability)\")",
        "terminalOutput": "Float between 0.0 and 1.0: 0.7421\nSuccess! (80% probability)",
        "mcq": {
          "id": "q-7.2-1-v1",
          "question": "What is the return range of random.random()?",
          "options": [
                    {
                              "id": "A",
                              "text": "0.0 <= x < 1.0 (float from 0.0 inclusive up to 1.0 exclusive)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "0 to 100",
                              "explanationIfWrong": "The range is normalized between 0.0 and 1.0."
                    },
                    {
                              "id": "C",
                              "text": "1.0 <= x <= 10.0",
                              "explanationIfWrong": "The maximum is strictly less than 1.0."
                    },
                    {
                              "id": "D",
                              "text": "-1.0 <= x <= 1.0",
                              "explanationIfWrong": "Outcomes are non-negative."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "random.random() produces a uniform float in the half-open interval [0.0, 1.0)."
},
        "retestMcq": {
          "id": "q-7.2-1-v2",
          "question": "Which function generates a random float between a and b (e.g. between 5.5 and 10.5)?",
          "options": [
                    {
                              "id": "A",
                              "text": "random.uniform(5.5, 10.5)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "random.float(5.5, 10.5)",
                              "explanationIfWrong": "The function is named uniform(), not float()."
                    },
                    {
                              "id": "C",
                              "text": "random.decimal(5.5, 10.5)",
                              "explanationIfWrong": "Python uses random.uniform()."
                    },
                    {
                              "id": "D",
                              "text": "random.randint(5.5, 10.5)",
                              "explanationIfWrong": "randint requires integer arguments."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "random.uniform(a, b) generates a random floating point number between a and b."
},
        "questionPool": [
          {
            "id": "q-7.2-1-v1",
            "question": "What is the return range of random.random()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "0.0 <= x < 1.0 (float from 0.0 inclusive up to 1.0 exclusive)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "0 to 100",
                                    "explanationIfWrong": "The range is normalized between 0.0 and 1.0."
                        },
                        {
                                    "id": "C",
                                    "text": "1.0 <= x <= 10.0",
                                    "explanationIfWrong": "The maximum is strictly less than 1.0."
                        },
                        {
                                    "id": "D",
                                    "text": "-1.0 <= x <= 1.0",
                                    "explanationIfWrong": "Outcomes are non-negative."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "random.random() produces a uniform float in the half-open interval [0.0, 1.0)."
},
          {
            "id": "q-7.2-1-v2",
            "question": "Which function generates a random float between a and b (e.g. between 5.5 and 10.5)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "random.uniform(5.5, 10.5)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "random.float(5.5, 10.5)",
                                    "explanationIfWrong": "The function is named uniform(), not float()."
                        },
                        {
                                    "id": "C",
                                    "text": "random.decimal(5.5, 10.5)",
                                    "explanationIfWrong": "Python uses random.uniform()."
                        },
                        {
                                    "id": "D",
                                    "text": "random.randint(5.5, 10.5)",
                                    "explanationIfWrong": "randint requires integer arguments."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "random.uniform(a, b) generates a random floating point number between a and b."
},
          {
            "id": "q-7.2-1-v3",
            "question": "How do you test for an event that has a 30% chance of occurring?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "if random.random() < 0.3:",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "if random.random() == 0.3:",
                                    "explanationIfWrong": "Checking float equality with == almost never succeeds."
                        },
                        {
                                    "id": "C",
                                    "text": "if random.randint(1, 100) < 30:",
                                    "explanationIfWrong": "1 to 29 is 29%, not 30% (< 0.3 on uniform is exact)."
                        },
                        {
                                    "id": "D",
                                    "text": "if random.chance(30):",
                                    "explanationIfWrong": "There is no chance() function in the random module."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since random.random() is uniformly distributed from 0.0 to 1.0, value < 0.3 has exactly a 30% probability."
}
        ]
      },
      {
        "heading": "Picking Random Items: choice() & sample()",
        "text": "random.choice(sequence) returns a single random element from a non-empty sequence. random.sample(sequence, k) picks k unique random elements without replacement (like drawing lottery numbers).",
        "codeSnippet": "import random\n\ncolors = [\"red\", \"green\", \"blue\", \"yellow\"]\n# Pick one:\npick = random.choice(colors)\n# Pick two unique colors:\npair = random.sample(colors, 2)\n\nprint(f\"One: {pick}, Sample of two: {pair}\")",
        "terminalOutput": "One: green, Sample of two: ['blue', 'red']",
        "mcq": {
          "id": "q-7.2-2-v1",
          "question": "What error occurs if you call random.choice([]) on an empty list?",
          "options": [
                    {
                              "id": "A",
                              "text": "IndexError: Cannot choose from an empty sequence",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "ValueError",
                              "explanationIfWrong": "random.choice() raises IndexError when empty."
                    },
                    {
                              "id": "C",
                              "text": "It returns None",
                              "explanationIfWrong": "It raises an exception rather than returning None."
                    },
                    {
                              "id": "D",
                              "text": "KeyError",
                              "explanationIfWrong": "Sequence lookups raise IndexError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "random.choice() requires at least one element; an empty sequence causes an IndexError."
},
        "retestMcq": {
          "id": "q-7.2-2-v2",
          "question": "What is the key difference between random.choices(seq, k=3) and random.sample(seq, 3)?",
          "options": [
                    {
                              "id": "A",
                              "text": "choices() allows duplicates (selection with replacement), while sample() guarantees unique elements (without replacement)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "sample() works on strings, choices() works on numbers",
                              "explanationIfWrong": "Both work on any sequence."
                    },
                    {
                              "id": "C",
                              "text": "sample() sorts the output",
                              "explanationIfWrong": "sample() preserves random draw order."
                    },
                    {
                              "id": "D",
                              "text": "choices() is deprecated",
                              "explanationIfWrong": "Both are active methods in Python 3."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "sample() draws without replacement (no duplicates); choices() allows replacement."
},
        "questionPool": [
          {
            "id": "q-7.2-2-v1",
            "question": "What error occurs if you call random.choice([]) on an empty list?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "IndexError: Cannot choose from an empty sequence",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ValueError",
                                    "explanationIfWrong": "random.choice() raises IndexError when empty."
                        },
                        {
                                    "id": "C",
                                    "text": "It returns None",
                                    "explanationIfWrong": "It raises an exception rather than returning None."
                        },
                        {
                                    "id": "D",
                                    "text": "KeyError",
                                    "explanationIfWrong": "Sequence lookups raise IndexError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "random.choice() requires at least one element; an empty sequence causes an IndexError."
},
          {
            "id": "q-7.2-2-v2",
            "question": "What is the key difference between random.choices(seq, k=3) and random.sample(seq, 3)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "choices() allows duplicates (selection with replacement), while sample() guarantees unique elements (without replacement)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "sample() works on strings, choices() works on numbers",
                                    "explanationIfWrong": "Both work on any sequence."
                        },
                        {
                                    "id": "C",
                                    "text": "sample() sorts the output",
                                    "explanationIfWrong": "sample() preserves random draw order."
                        },
                        {
                                    "id": "D",
                                    "text": "choices() is deprecated",
                                    "explanationIfWrong": "Both are active methods in Python 3."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "sample() draws without replacement (no duplicates); choices() allows replacement."
},
          {
            "id": "q-7.2-2-v3",
            "question": "What error occurs if you run random.sample([1, 2, 3], 5) where k > len(population)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError: Sample larger than population or is negative",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "IndexError",
                                    "explanationIfWrong": "The exception raised is ValueError."
                        },
                        {
                                    "id": "C",
                                    "text": "It pads the result with None values",
                                    "explanationIfWrong": "sample() refuses to sample more items than available."
                        },
                        {
                                    "id": "D",
                                    "text": "It returns all 3 elements",
                                    "explanationIfWrong": "Sampling without replacement fails if k > n."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "sample() cannot pick unique elements exceeding the population size."
}
        ]
      },
      {
        "heading": "Shuffling Lists in Place: shuffle()",
        "text": "The random.shuffle(list) method shuffles a mutable sequence in-place and returns None. It reorders elements into a random permutation.",
        "codeSnippet": "import random\n\ndeck = [\"Ace\", \"King\", \"Queen\", \"Jack\", \"10\"]\nrandom.shuffle(deck)\nprint(f\"Shuffled deck: {deck}\")",
        "terminalOutput": "Shuffled deck: ['Queen', '10', 'Ace', 'Jack', 'King']",
        "warning": "Never do deck = random.shuffle(deck)! Since shuffle returns None, this will overwrite your variable with None.",
        "mcq": {
          "id": "q-7.2-3-v1",
          "question": "What is the return value of random.shuffle(my_list)?",
          "options": [
                    {
                              "id": "A",
                              "text": "None (the list is modified in place)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The new shuffled list",
                              "explanationIfWrong": "shuffle() modifies in-place and returns None."
                    },
                    {
                              "id": "C",
                              "text": "A generator",
                              "explanationIfWrong": "It mutates the list directly."
                    },
                    {
                              "id": "D",
                              "text": "The length of the list",
                              "explanationIfWrong": "It returns None."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In-place mutating methods like random.shuffle() return None by design."
},
        "retestMcq": {
          "id": "q-7.2-3-v2",
          "question": "Can random.shuffle() be used directly on a string like 'hello'?",
          "options": [
                    {
                              "id": "A",
                              "text": "No, because strings are immutable and cannot be modified in place",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Yes, it returns a shuffled string",
                              "explanationIfWrong": "Strings are immutable; calling shuffle on a str raises TypeError."
                    },
                    {
                              "id": "C",
                              "text": "Only if converted to bytes first",
                              "explanationIfWrong": "Convert to a list of characters first: chars = list(s); random.shuffle(chars)."
                    },
                    {
                              "id": "D",
                              "text": "Yes, in Python 3.12+",
                              "explanationIfWrong": "Strings remain immutable."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "shuffle() requires a mutable sequence like a list. Strings cause a TypeError."
},
        "questionPool": [
          {
            "id": "q-7.2-3-v1",
            "question": "What is the return value of random.shuffle(my_list)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "None (the list is modified in place)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The new shuffled list",
                                    "explanationIfWrong": "shuffle() modifies in-place and returns None."
                        },
                        {
                                    "id": "C",
                                    "text": "A generator",
                                    "explanationIfWrong": "It mutates the list directly."
                        },
                        {
                                    "id": "D",
                                    "text": "The length of the list",
                                    "explanationIfWrong": "It returns None."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In-place mutating methods like random.shuffle() return None by design."
},
          {
            "id": "q-7.2-3-v2",
            "question": "Can random.shuffle() be used directly on a string like 'hello'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, because strings are immutable and cannot be modified in place",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, it returns a shuffled string",
                                    "explanationIfWrong": "Strings are immutable; calling shuffle on a str raises TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if converted to bytes first",
                                    "explanationIfWrong": "Convert to a list of characters first: chars = list(s); random.shuffle(chars)."
                        },
                        {
                                    "id": "D",
                                    "text": "Yes, in Python 3.12+",
                                    "explanationIfWrong": "Strings remain immutable."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "shuffle() requires a mutable sequence like a list. Strings cause a TypeError."
},
          {
            "id": "q-7.2-3-v3",
            "question": "How do you get a shuffled string from text = 'abcdef'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "chars = list(text); random.shuffle(chars); ''.join(chars)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "random.shuffle(text)",
                                    "explanationIfWrong": "This raises TypeError because strings are immutable."
                        },
                        {
                                    "id": "C",
                                    "text": "str(random.shuffle(list(text)))",
                                    "explanationIfWrong": "shuffle returns None, so str(None) is 'None'."
                        },
                        {
                                    "id": "D",
                                    "text": "text.shuffle()",
                                    "explanationIfWrong": "Strings do not have a shuffle method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Convert string to list, shuffle the list in place, and join back into a string."
}
        ]
      },
      {
        "heading": "Pseudo-Randomness & Seeds: seed()",
        "text": "Computers cannot generate true mathematical randomness. Python uses the Mersenne Twister algorithm to generate deterministic pseudo-random numbers based on an initial seed. Calling random.seed(x) initializes the generator so that subsequent calls produce identical sequences.",
        "codeSnippet": "import random\n\nrandom.seed(42)\nseq1 = [random.randint(1, 100) for _ in range(3)]\n\n# Reset with the same seed:\nrandom.seed(42)\nseq2 = [random.randint(1, 100) for _ in range(3)]\n\nprint(f\"Seq 1: {seq1}\")\nprint(f\"Seq 2: {seq2} (identical!)\")",
        "terminalOutput": "Seq 1: [82, 15, 4]\nSeq 2: [82, 15, 4] (identical!)",
        "tip": "Setting random.seed() is vital in automated tests and scientific simulations so that results are 100% reproducible.",
        "mcq": {
          "id": "q-7.2-4-v1",
          "question": "What is the primary purpose of setting random.seed(42) in a program?",
          "options": [
                    {
                              "id": "A",
                              "text": "To make pseudo-random generation completely reproducible across runs (ideal for testing and debugging)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "To make numbers truly random using atmospheric noise",
                              "explanationIfWrong": "True randomness requires the secrets module or hardware RNG."
                    },
                    {
                              "id": "C",
                              "text": "To increase random speed by 2x",
                              "explanationIfWrong": "Seed initializes the starting state of the generator."
                    },
                    {
                              "id": "D",
                              "text": "To restrict numbers to below 42",
                              "explanationIfWrong": "42 is the seed value, not a bound."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A fixed seed initializes the PRNG state, producing the exact same sequence every execution."
},
        "retestMcq": {
          "id": "q-7.2-4-v2",
          "question": "Why is the standard random module NOT recommended for generating passwords or cryptographic security tokens?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because Mersenne Twister is predictable: observing prior values allows an attacker to compute all future values",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because it only supports numbers up to 1000",
                              "explanationIfWrong": "It supports arbitrarily large integers, but lacks cryptographic entropy."
                    },
                    {
                              "id": "C",
                              "text": "Because it requires internet access",
                              "explanationIfWrong": "random runs offline."
                    },
                    {
                              "id": "D",
                              "text": "Because passwords must be uppercase",
                              "explanationIfWrong": "The issue is cryptographic unpredictability."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Mersenne Twister is not cryptographically secure. Use Python's secrets module for passwords and security tokens."
},
        "questionPool": [
          {
            "id": "q-7.2-4-v1",
            "question": "What is the primary purpose of setting random.seed(42) in a program?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To make pseudo-random generation completely reproducible across runs (ideal for testing and debugging)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "To make numbers truly random using atmospheric noise",
                                    "explanationIfWrong": "True randomness requires the secrets module or hardware RNG."
                        },
                        {
                                    "id": "C",
                                    "text": "To increase random speed by 2x",
                                    "explanationIfWrong": "Seed initializes the starting state of the generator."
                        },
                        {
                                    "id": "D",
                                    "text": "To restrict numbers to below 42",
                                    "explanationIfWrong": "42 is the seed value, not a bound."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A fixed seed initializes the PRNG state, producing the exact same sequence every execution."
},
          {
            "id": "q-7.2-4-v2",
            "question": "Why is the standard random module NOT recommended for generating passwords or cryptographic security tokens?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because Mersenne Twister is predictable: observing prior values allows an attacker to compute all future values",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because it only supports numbers up to 1000",
                                    "explanationIfWrong": "It supports arbitrarily large integers, but lacks cryptographic entropy."
                        },
                        {
                                    "id": "C",
                                    "text": "Because it requires internet access",
                                    "explanationIfWrong": "random runs offline."
                        },
                        {
                                    "id": "D",
                                    "text": "Because passwords must be uppercase",
                                    "explanationIfWrong": "The issue is cryptographic unpredictability."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Mersenne Twister is not cryptographically secure. Use Python's secrets module for passwords and security tokens."
},
          {
            "id": "q-7.2-4-v3",
            "question": "Which Python standard library module is designed specifically for cryptographically secure random generation?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "secrets",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "crypto",
                                    "explanationIfWrong": "The standard module is secrets."
                        },
                        {
                                    "id": "C",
                                    "text": "secure_random",
                                    "explanationIfWrong": "The built-in module is secrets."
                        },
                        {
                                    "id": "D",
                                    "text": "hashlib",
                                    "explanationIfWrong": "hashlib is for cryptographic hashing, not random generation."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "import secrets uses OS-level entropy for secure passwords and tokens."
}
        ]
      },
      {
        "heading": "Simulating Probability Experiments",
        "text": "By running random simulations thousands of times in a loop, you can approximate probabilities empirically (the Monte Carlo method).",
        "codeSnippet": "import random\n\ntrials = 10000\ndouble_sixes = 0\nfor _ in range(trials):\n    d1 = random.randint(1, 6)\n    d2 = random.randint(1, 6)\n    if d1 == 6 and d2 == 6:\n        double_sixes += 1\n\nexperimental_prob = double_sixes / trials\nprint(f\"Experimental: {experimental_prob:.4f}, Theoretical: {1/36:.4f}\")",
        "terminalOutput": "Experimental: 0.0278, Theoretical: 0.0278",
        "mcq": {
          "id": "q-7.2-5-v1",
          "question": "What is the theoretical probability of rolling two sixes on two fair dice?",
          "options": [
                    {
                              "id": "A",
                              "text": "1 / 36 (approx 2.78%)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "1 / 12",
                              "explanationIfWrong": "Probabilities multiply: 1/6 * 1/6 = 1/36."
                    },
                    {
                              "id": "C",
                              "text": "1 / 6",
                              "explanationIfWrong": "1/6 is the probability of a single six."
                    },
                    {
                              "id": "D",
                              "text": "2 / 6",
                              "explanationIfWrong": "Independent events multiply."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Rolling 6 on die 1 (1/6) and 6 on die 2 (1/6) gives 1/6 * 1/6 = 1/36."
},
        "retestMcq": {
          "id": "q-7.2-5-v2",
          "question": "What happens to the experimental probability in a Monte Carlo simulation as the number of trials increases towards infinity?",
          "options": [
                    {
                              "id": "A",
                              "text": "It converges towards the true theoretical probability (Law of Large Numbers)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It diverges and becomes completely random",
                              "explanationIfWrong": "The Law of Large Numbers states larger samples converge to theoretical value."
                    },
                    {
                              "id": "C",
                              "text": "It drops to zero",
                              "explanationIfWrong": "Probability stabilizes at the expected value."
                    },
                    {
                              "id": "D",
                              "text": "It increases to 1.0",
                              "explanationIfWrong": "It converges to the true ratio."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Law of Large Numbers dictates that empirical sample averages converge to theoretical expected values."
},
        "questionPool": [
          {
            "id": "q-7.2-5-v1",
            "question": "What is the theoretical probability of rolling two sixes on two fair dice?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "1 / 36 (approx 2.78%)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1 / 12",
                                    "explanationIfWrong": "Probabilities multiply: 1/6 * 1/6 = 1/36."
                        },
                        {
                                    "id": "C",
                                    "text": "1 / 6",
                                    "explanationIfWrong": "1/6 is the probability of a single six."
                        },
                        {
                                    "id": "D",
                                    "text": "2 / 6",
                                    "explanationIfWrong": "Independent events multiply."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Rolling 6 on die 1 (1/6) and 6 on die 2 (1/6) gives 1/6 * 1/6 = 1/36."
},
          {
            "id": "q-7.2-5-v2",
            "question": "What happens to the experimental probability in a Monte Carlo simulation as the number of trials increases towards infinity?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It converges towards the true theoretical probability (Law of Large Numbers)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It diverges and becomes completely random",
                                    "explanationIfWrong": "The Law of Large Numbers states larger samples converge to theoretical value."
                        },
                        {
                                    "id": "C",
                                    "text": "It drops to zero",
                                    "explanationIfWrong": "Probability stabilizes at the expected value."
                        },
                        {
                                    "id": "D",
                                    "text": "It increases to 1.0",
                                    "explanationIfWrong": "It converges to the true ratio."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Law of Large Numbers dictates that empirical sample averages converge to theoretical expected values."
},
          {
            "id": "q-7.2-5-v3",
            "question": "Why is _ used as the loop variable in for _ in range(trials):?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It is a Python convention indicating that the loop counter variable is unused inside the loop body",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It is required for random simulations",
                                    "explanationIfWrong": "Any variable name works, but _ indicates throwaway values."
                        },
                        {
                                    "id": "C",
                                    "text": "It runs 2x faster than using i",
                                    "explanationIfWrong": "Performance is identical."
                        },
                        {
                                    "id": "D",
                                    "text": "It prevents memory usage",
                                    "explanationIfWrong": "It is a readability convention."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "An underscore _ signals to developers and linters that the loop iteration index is intentionally discarded."
}
        ]
      }
    ]
  },
  {
    "id": "7-3-times-and-dates",
    "number": "7.3",
    "title": "Times and Dates",
    "subtitle": "Manipulate dates and times using the datetime module, calculate durations with timedelta, and format strings.",
    "readTime": "20 min",
    "objectives": [
      "Create specific dates using datetime.date(year, month, day)",
      "Get the current calendar date and time with date.today() and datetime.now()",
      "Perform date arithmetic and duration calculations using timedelta",
      "Format dates into human-readable strings using strftime() directives",
      "Parse date strings into date objects using strptime()",
      "Compare dates chronologically using standard comparison operators (<, >, ==)"
],
    "theoryBlocks": [
      {
        "heading": "The date Object: date(year, month, day)",
        "text": "The datetime module provides specialized classes for calendar arithmetic. A date object represents a specific calendar date (year, month, day). Create one using datetime.date(year, month, day) or fetch today's date with date.today().",
        "codeSnippet": "from datetime import date\n\nindependence_day = date(1917, 12, 6)\ntoday = date.today()\n\nprint(f\"Year: {independence_day.year}\")\nprint(f\"Month: {independence_day.month}\")\nprint(f\"Today: {today}\")",
        "terminalOutput": "Year: 1917\nMonth: 12\nToday: 2026-10-10",
        "warning": "date(year, month, day) requires valid calendar inputs. Passing date(2026, 2, 30) raises ValueError: day is out of range for month.",
        "mcq": {
          "id": "q-7.3-0-v1",
          "question": "What error occurs if you call date(2026, 4, 31) where April has only 30 days?",
          "options": [
                    {
                              "id": "A",
                              "text": "ValueError: day is out of range for month",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It automatically rolls over to May 1",
                              "explanationIfWrong": "date constructor validates calendar validity strictly."
                    },
                    {
                              "id": "C",
                              "text": "IndexError",
                              "explanationIfWrong": "Calendar validation raises ValueError."
                    },
                    {
                              "id": "D",
                              "text": "OverflowError",
                              "explanationIfWrong": "Invalid calendar values trigger ValueError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The datetime.date constructor validates the calendar parameters and raises ValueError on invalid dates."
},
        "retestMcq": {
          "id": "q-7.3-0-v2",
          "question": "How do you access the weekday of a date d in Python where Monday is 0 and Sunday is 6?",
          "options": [
                    {
                              "id": "A",
                              "text": "d.weekday()",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "d.day_of_week()",
                              "explanationIfWrong": "The method is d.weekday()."
                    },
                    {
                              "id": "C",
                              "text": "d.is_monday()",
                              "explanationIfWrong": "weekday() returns an integer from 0 to 6."
                    },
                    {
                              "id": "D",
                              "text": "d.day_index()",
                              "explanationIfWrong": "The standard method is d.weekday()."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "d.weekday() returns an integer from 0 (Monday) to 6 (Sunday)."
},
        "questionPool": [
          {
            "id": "q-7.3-0-v1",
            "question": "What error occurs if you call date(2026, 4, 31) where April has only 30 days?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError: day is out of range for month",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It automatically rolls over to May 1",
                                    "explanationIfWrong": "date constructor validates calendar validity strictly."
                        },
                        {
                                    "id": "C",
                                    "text": "IndexError",
                                    "explanationIfWrong": "Calendar validation raises ValueError."
                        },
                        {
                                    "id": "D",
                                    "text": "OverflowError",
                                    "explanationIfWrong": "Invalid calendar values trigger ValueError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The datetime.date constructor validates the calendar parameters and raises ValueError on invalid dates."
},
          {
            "id": "q-7.3-0-v2",
            "question": "How do you access the weekday of a date d in Python where Monday is 0 and Sunday is 6?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "d.weekday()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "d.day_of_week()",
                                    "explanationIfWrong": "The method is d.weekday()."
                        },
                        {
                                    "id": "C",
                                    "text": "d.is_monday()",
                                    "explanationIfWrong": "weekday() returns an integer from 0 to 6."
                        },
                        {
                                    "id": "D",
                                    "text": "d.day_index()",
                                    "explanationIfWrong": "The standard method is d.weekday()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "d.weekday() returns an integer from 0 (Monday) to 6 (Sunday)."
},
          {
            "id": "q-7.3-0-v3",
            "question": "Can two date objects be compared directly with < or >?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, earlier dates are considered less than later dates (chronological ordering)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, dates can only be checked for equality ==",
                                    "explanationIfWrong": "Dates support full relational ordering (<, <=, >, >=)."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if they are in the same year",
                                    "explanationIfWrong": "Comparisons work across any calendar dates."
                        },
                        {
                                    "id": "D",
                                    "text": "Dates must be converted to strings first",
                                    "explanationIfWrong": "Comparing date objects directly is native and reliable."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "date objects implement rich comparisons chronologically: d1 < d2 means d1 occurred before d2."
}
        ]
      },
      {
        "heading": "Date Differences & timedelta",
        "text": "Subtracting two date objects produces a timedelta object representing the duration between them. You can also add or subtract timedelta objects to calculate past or future dates.",
        "codeSnippet": "from datetime import date, timedelta\n\ntoday = date(2026, 10, 10)\nexam_day = date(2026, 10, 25)\n\n# Difference in days:\ndiff = exam_day - today\nprint(f\"Days until exam: {diff.days}\")\n\n# Future date in 30 days:\nnext_month = today + timedelta(days=30)\nprint(f\"In 30 days: {next_month}\")",
        "terminalOutput": "Days until exam: 15\nIn 30 days: 2026-11-09",
        "mcq": {
          "id": "q-7.3-1-v1",
          "question": "What type of object is returned when you subtract date2 - date1?",
          "options": [
                    {
                              "id": "A",
                              "text": "A timedelta object",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "An integer number of days",
                              "explanationIfWrong": "It returns a timedelta object; access its .days attribute for the integer."
                    },
                    {
                              "id": "C",
                              "text": "A float number of seconds",
                              "explanationIfWrong": "Date subtraction returns a timedelta."
                    },
                    {
                              "id": "D",
                              "text": "A tuple of (years, months, days)",
                              "explanationIfWrong": "It returns a timedelta."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Subtracting two dates yields a timedelta object."
},
        "retestMcq": {
          "id": "q-7.3-1-v2",
          "question": "How do you calculate yesterday's date given today = date.today()?",
          "options": [
                    {
                              "id": "A",
                              "text": "today - timedelta(days=1)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "today - 1",
                              "explanationIfWrong": "You cannot subtract an integer from a date; you must use timedelta(days=1)."
                    },
                    {
                              "id": "C",
                              "text": "today.yesterday()",
                              "explanationIfWrong": "date objects have no .yesterday() method."
                    },
                    {
                              "id": "D",
                              "text": "date.today() - 24",
                              "explanationIfWrong": "Subtracting integers raises a TypeError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Date arithmetic requires a timedelta: today - timedelta(days=1) correctly handles month and leap year boundaries."
},
        "questionPool": [
          {
            "id": "q-7.3-1-v1",
            "question": "What type of object is returned when you subtract date2 - date1?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A timedelta object",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "An integer number of days",
                                    "explanationIfWrong": "It returns a timedelta object; access its .days attribute for the integer."
                        },
                        {
                                    "id": "C",
                                    "text": "A float number of seconds",
                                    "explanationIfWrong": "Date subtraction returns a timedelta."
                        },
                        {
                                    "id": "D",
                                    "text": "A tuple of (years, months, days)",
                                    "explanationIfWrong": "It returns a timedelta."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Subtracting two dates yields a timedelta object."
},
          {
            "id": "q-7.3-1-v2",
            "question": "How do you calculate yesterday's date given today = date.today()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "today - timedelta(days=1)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "today - 1",
                                    "explanationIfWrong": "You cannot subtract an integer from a date; you must use timedelta(days=1)."
                        },
                        {
                                    "id": "C",
                                    "text": "today.yesterday()",
                                    "explanationIfWrong": "date objects have no .yesterday() method."
                        },
                        {
                                    "id": "D",
                                    "text": "date.today() - 24",
                                    "explanationIfWrong": "Subtracting integers raises a TypeError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Date arithmetic requires a timedelta: today - timedelta(days=1) correctly handles month and leap year boundaries."
},
          {
            "id": "q-7.3-1-v3",
            "question": "What attribute on a timedelta object diff gives the total day difference as an integer?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "diff.days",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "diff.total_days()",
                                    "explanationIfWrong": "The attribute is .days; total_seconds() exists for seconds."
                        },
                        {
                                    "id": "C",
                                    "text": "int(diff)",
                                    "explanationIfWrong": "timedelta objects cannot be cast directly to int."
                        },
                        {
                                    "id": "D",
                                    "text": "diff.count",
                                    "explanationIfWrong": "The attribute is diff.days."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "timedelta.days returns the count of days."
}
        ]
      },
      {
        "heading": "Formatting Dates with strftime()",
        "text": "The .strftime(format) method formats date and datetime objects into custom text strings using format directives: %Y (4-digit year), %m (2-digit month), %d (2-digit day), %B (full month name), and %A (weekday name).",
        "codeSnippet": "from datetime import date\n\nd = date(2026, 12, 25)\nprint(d.strftime(\"%d.%m.%Y\"))          # Finnish/European format: 25.12.2026\nprint(d.strftime(\"%B %d, %Y (%A)\"))   # December 25, 2026 (Friday)",
        "terminalOutput": "25.12.2026\nDecember 25, 2026 (Friday)",
        "tip": "Mnemonic: strftime = 'string format time'.",
        "mcq": {
          "id": "q-7.3-2-v1",
          "question": "What format string produces European date format '15.03.2026' from date(2026, 3, 15)?",
          "options": [
                    {
                              "id": "A",
                              "text": "\"%d.%m.%Y\"",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "\"%Y.%m.%d\"",
                              "explanationIfWrong": "%Y.%m.%d produces '2026.03.15'."
                    },
                    {
                              "id": "C",
                              "text": "\"%m.%d.%y\"",
                              "explanationIfWrong": "%y is 2-digit year ('26') and %m is month."
                    },
                    {
                              "id": "D",
                              "text": "\"%day.%month.%year\"",
                              "explanationIfWrong": "Directives use single letters preceded by %."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "%d is day, %m is month, %Y is 4-digit year, separated by dots: '%d.%m.%Y'."
},
        "retestMcq": {
          "id": "q-7.3-2-v2",
          "question": "What is the difference between %Y and %y in strftime?",
          "options": [
                    {
                              "id": "A",
                              "text": "%Y produces a 4-digit year (e.g. '2026'), while %y produces a 2-digit year (e.g. '26')",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "%Y is for leap years only",
                              "explanationIfWrong": "Both work on all years."
                    },
                    {
                              "id": "C",
                              "text": "%Y includes the month",
                              "explanationIfWrong": "%Y only formats the year component."
                    },
                    {
                              "id": "D",
                              "text": "%y produces Roman numerals",
                              "explanationIfWrong": "%y is 2-digit decimal."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Capital %Y gives 4 digits ('2026'), lowercase %y gives 2 digits ('26')."
},
        "questionPool": [
          {
            "id": "q-7.3-2-v1",
            "question": "What format string produces European date format '15.03.2026' from date(2026, 3, 15)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "\"%d.%m.%Y\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "\"%Y.%m.%d\"",
                                    "explanationIfWrong": "%Y.%m.%d produces '2026.03.15'."
                        },
                        {
                                    "id": "C",
                                    "text": "\"%m.%d.%y\"",
                                    "explanationIfWrong": "%y is 2-digit year ('26') and %m is month."
                        },
                        {
                                    "id": "D",
                                    "text": "\"%day.%month.%year\"",
                                    "explanationIfWrong": "Directives use single letters preceded by %."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "%d is day, %m is month, %Y is 4-digit year, separated by dots: '%d.%m.%Y'."
},
          {
            "id": "q-7.3-2-v2",
            "question": "What is the difference between %Y and %y in strftime?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "%Y produces a 4-digit year (e.g. '2026'), while %y produces a 2-digit year (e.g. '26')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "%Y is for leap years only",
                                    "explanationIfWrong": "Both work on all years."
                        },
                        {
                                    "id": "C",
                                    "text": "%Y includes the month",
                                    "explanationIfWrong": "%Y only formats the year component."
                        },
                        {
                                    "id": "D",
                                    "text": "%y produces Roman numerals",
                                    "explanationIfWrong": "%y is 2-digit decimal."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Capital %Y gives 4 digits ('2026'), lowercase %y gives 2 digits ('26')."
},
          {
            "id": "q-7.3-2-v3",
            "question": "Which directive in strftime outputs the full weekday name (e.g. 'Monday', 'Friday')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "%A",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "%a",
                                    "explanationIfWrong": "%a outputs the abbreviated weekday name (e.g. 'Mon', 'Fri')."
                        },
                        {
                                    "id": "C",
                                    "text": "%w",
                                    "explanationIfWrong": "%w outputs weekday as a decimal number (0-6)."
                        },
                        {
                                    "id": "D",
                                    "text": "%W",
                                    "explanationIfWrong": "%W is the week number of the year."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "%A outputs the full locale weekday name."
}
        ]
      },
      {
        "heading": "Parsing Strings into Dates with strptime()",
        "text": "The datetime.strptime(string, format) function parses a date string into a datetime object according to a specified format pattern.",
        "codeSnippet": "from datetime import datetime\n\ndate_str = \"24/12/2026\"\nparsed = datetime.strptime(date_str, \"%d/%m/%Y\")\nprint(f\"Parsed year: {parsed.year}, month: {parsed.month}, day: {parsed.day}\")",
        "terminalOutput": "Parsed year: 2026, month: 12, day: 24",
        "tip": "Mnemonic: strptime = 'string parse time'.",
        "mcq": {
          "id": "q-7.3-3-v1",
          "question": "What format string should be used to parse '2026-10-31' with datetime.strptime()?",
          "options": [
                    {
                              "id": "A",
                              "text": "\"%Y-%m-%d\"",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "\"%d-%m-%Y\"",
                              "explanationIfWrong": "The year is first in '2026-10-31'."
                    },
                    {
                              "id": "C",
                              "text": "\"%Y/%m/%d\"",
                              "explanationIfWrong": "The separator in the input string is a dash '-', not a slash '/'."
                    },
                    {
                              "id": "D",
                              "text": "\"ISO\"",
                              "explanationIfWrong": "Directives must match the exact string format."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "'%Y-%m-%d' matches 4-digit year, dash, 2-digit month, dash, 2-digit day."
},
        "retestMcq": {
          "id": "q-7.3-3-v2",
          "question": "What error occurs if the format string does not match the input string structure in strptime()?",
          "options": [
                    {
                              "id": "A",
                              "text": "ValueError: time data does not match format",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "TypeError",
                              "explanationIfWrong": "Format mismatches raise ValueError."
                    },
                    {
                              "id": "C",
                              "text": "It returns None silently",
                              "explanationIfWrong": "strptime raises ValueError on parsing failures."
                    },
                    {
                              "id": "D",
                              "text": "SyntaxError",
                              "explanationIfWrong": "This is a runtime ValueError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "strptime raises ValueError if the string data fails to match the provided directive pattern."
},
        "questionPool": [
          {
            "id": "q-7.3-3-v1",
            "question": "What format string should be used to parse '2026-10-31' with datetime.strptime()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "\"%Y-%m-%d\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "\"%d-%m-%Y\"",
                                    "explanationIfWrong": "The year is first in '2026-10-31'."
                        },
                        {
                                    "id": "C",
                                    "text": "\"%Y/%m/%d\"",
                                    "explanationIfWrong": "The separator in the input string is a dash '-', not a slash '/'."
                        },
                        {
                                    "id": "D",
                                    "text": "\"ISO\"",
                                    "explanationIfWrong": "Directives must match the exact string format."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'%Y-%m-%d' matches 4-digit year, dash, 2-digit month, dash, 2-digit day."
},
          {
            "id": "q-7.3-3-v2",
            "question": "What error occurs if the format string does not match the input string structure in strptime()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError: time data does not match format",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Format mismatches raise ValueError."
                        },
                        {
                                    "id": "C",
                                    "text": "It returns None silently",
                                    "explanationIfWrong": "strptime raises ValueError on parsing failures."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "This is a runtime ValueError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "strptime raises ValueError if the string data fails to match the provided directive pattern."
},
          {
            "id": "q-7.3-3-v3",
            "question": "How do you extract just the date part (excluding time) from a parsed datetime object dt?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "dt.date()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "dt.only_date()",
                                    "explanationIfWrong": "The method is dt.date()."
                        },
                        {
                                    "id": "C",
                                    "text": "date(dt)",
                                    "explanationIfWrong": "date() constructor expects year, month, day arguments."
                        },
                        {
                                    "id": "D",
                                    "text": "dt.strip_time()",
                                    "explanationIfWrong": "Use dt.date() to convert datetime to a date object."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "datetime.date() returns a date object with the same year, month, and day."
}
        ]
      },
      {
        "heading": "The datetime Object: Dates with Time",
        "text": "The datetime class combines date and time components (year, month, day, hour, minute, second, microsecond). Fetch the current system time using datetime.now().",
        "codeSnippet": "from datetime import datetime\n\nnow = datetime.now()\nprint(f\"Current hour: {now.hour}\")\nprint(f\"Formatted: {now.strftime('%Y-%m-%d %H:%M:%S')}\")",
        "terminalOutput": "Current hour: 21\nFormatted: 2026-10-10 21:30:00",
        "mcq": {
          "id": "q-7.3-4-v1",
          "question": "What method returns the current local date and time in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "datetime.now()",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "datetime.current()",
                              "explanationIfWrong": "The method is datetime.now() or datetime.today()."
                    },
                    {
                              "id": "C",
                              "text": "datetime.clock()",
                              "explanationIfWrong": "clock() is deprecated/removed in Python 3.8+."
                    },
                    {
                              "id": "D",
                              "text": "datetime.system()",
                              "explanationIfWrong": "Use datetime.now()."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "datetime.now() retrieves the current local system datetime."
},
        "retestMcq": {
          "id": "q-7.3-4-v2",
          "question": "Which format directives represent hours (24-hour format), minutes, and seconds?",
          "options": [
                    {
                              "id": "A",
                              "text": "%H:%M:%S",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "%h:%m:%s",
                              "explanationIfWrong": "%h is abbreviated month name; %m is month."
                    },
                    {
                              "id": "C",
                              "text": "%hour:%min:%sec",
                              "explanationIfWrong": "Directives are single capital letters preceded by %."
                    },
                    {
                              "id": "D",
                              "text": "%T",
                              "explanationIfWrong": "Standard ISO time is formatted with %H:%M:%S."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "%H is 24-hour format (00-23), %M is minute (00-59), and %S is second (00-59)."
},
        "questionPool": [
          {
            "id": "q-7.3-4-v1",
            "question": "What method returns the current local date and time in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "datetime.now()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "datetime.current()",
                                    "explanationIfWrong": "The method is datetime.now() or datetime.today()."
                        },
                        {
                                    "id": "C",
                                    "text": "datetime.clock()",
                                    "explanationIfWrong": "clock() is deprecated/removed in Python 3.8+."
                        },
                        {
                                    "id": "D",
                                    "text": "datetime.system()",
                                    "explanationIfWrong": "Use datetime.now()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "datetime.now() retrieves the current local system datetime."
},
          {
            "id": "q-7.3-4-v2",
            "question": "Which format directives represent hours (24-hour format), minutes, and seconds?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "%H:%M:%S",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "%h:%m:%s",
                                    "explanationIfWrong": "%h is abbreviated month name; %m is month."
                        },
                        {
                                    "id": "C",
                                    "text": "%hour:%min:%sec",
                                    "explanationIfWrong": "Directives are single capital letters preceded by %."
                        },
                        {
                                    "id": "D",
                                    "text": "%T",
                                    "explanationIfWrong": "Standard ISO time is formatted with %H:%M:%S."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "%H is 24-hour format (00-23), %M is minute (00-59), and %S is second (00-59)."
},
          {
            "id": "q-7.3-4-v3",
            "question": "Can you compare two datetime objects from different days?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, datetime objects support complete chronological comparison with <, >, and ==",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, you can only compare times within the same day",
                                    "explanationIfWrong": "Full datetime objects compare date and time together."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if they both have microsecond 0",
                                    "explanationIfWrong": "Microseconds are compared accurately."
                        },
                        {
                                    "id": "D",
                                    "text": "Only in UTC timezone",
                                    "explanationIfWrong": "Naive datetimes compare normally against naive datetimes."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "datetime objects compare across all date and time attributes chronologically."
}
        ]
      },
      {
        "heading": "Handling Time Zones (UTC vs. Local)",
        "text": "By default, datetime objects in Python are 'naive' (lacking timezone information). For servers and APIs, it is best practice to work in UTC (Coordinated Universal Time) using datetime.now(timezone.utc) to avoid daylight saving time ambiguities.",
        "codeSnippet": "from datetime import datetime, timezone\n\nutc_now = datetime.now(timezone.utc)\nprint(f\"UTC Time: {utc_now.isoformat()}\")",
        "terminalOutput": "UTC Time: 2026-10-10T16:00:00+00:00",
        "mcq": {
          "id": "q-7.3-5-v1",
          "question": "Why is storing timestamps in UTC recommended for backend databases and web applications?",
          "options": [
                    {
                              "id": "A",
                              "text": "UTC avoids daylight saving time shifts, eliminates ambiguity across international timezones, and provides a uniform global standard",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "UTC uses 50% less disk space",
                              "explanationIfWrong": "UTC is a standardization practice, not a compression algorithm."
                    },
                    {
                              "id": "C",
                              "text": "Local times are forbidden in JSON files",
                              "explanationIfWrong": "Any string can be saved in JSON."
                    },
                    {
                              "id": "D",
                              "text": "Python only runs in Greenwich UK",
                              "explanationIfWrong": "UTC is the global reference time."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Storing timestamps in UTC eliminates timezone discrepancies and daylight saving bugs."
},
        "retestMcq": {
          "id": "q-7.3-5-v2",
          "question": "What is a 'naive' datetime object in Python terminology?",
          "options": [
                    {
                              "id": "A",
                              "text": "A datetime object that has no timezone information attached (tzinfo is None)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A date that is mathematically inaccurate",
                              "explanationIfWrong": "Naive refers specifically to the absence of timezone metadata."
                    },
                    {
                              "id": "C",
                              "text": "A datetime object created before year 2000",
                              "explanationIfWrong": "Naive vs aware describes timezone awareness."
                    },
                    {
                              "id": "D",
                              "text": "A date that cannot be printed",
                              "explanationIfWrong": "Naive datetimes print normally."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A naive datetime lacks timezone info, whereas an 'aware' datetime contains tzinfo."
},
        "questionPool": [
          {
            "id": "q-7.3-5-v1",
            "question": "Why is storing timestamps in UTC recommended for backend databases and web applications?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "UTC avoids daylight saving time shifts, eliminates ambiguity across international timezones, and provides a uniform global standard",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "UTC uses 50% less disk space",
                                    "explanationIfWrong": "UTC is a standardization practice, not a compression algorithm."
                        },
                        {
                                    "id": "C",
                                    "text": "Local times are forbidden in JSON files",
                                    "explanationIfWrong": "Any string can be saved in JSON."
                        },
                        {
                                    "id": "D",
                                    "text": "Python only runs in Greenwich UK",
                                    "explanationIfWrong": "UTC is the global reference time."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Storing timestamps in UTC eliminates timezone discrepancies and daylight saving bugs."
},
          {
            "id": "q-7.3-5-v2",
            "question": "What is a 'naive' datetime object in Python terminology?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A datetime object that has no timezone information attached (tzinfo is None)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A date that is mathematically inaccurate",
                                    "explanationIfWrong": "Naive refers specifically to the absence of timezone metadata."
                        },
                        {
                                    "id": "C",
                                    "text": "A datetime object created before year 2000",
                                    "explanationIfWrong": "Naive vs aware describes timezone awareness."
                        },
                        {
                                    "id": "D",
                                    "text": "A date that cannot be printed",
                                    "explanationIfWrong": "Naive datetimes print normally."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A naive datetime lacks timezone info, whereas an 'aware' datetime contains tzinfo."
},
          {
            "id": "q-7.3-5-v3",
            "question": "What does dt.isoformat() return?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A standardized ISO 8601 string representation (e.g. '2026-10-10T21:30:00')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A binary bytes object",
                                    "explanationIfWrong": "isoformat() returns a str."
                        },
                        {
                                    "id": "C",
                                    "text": "The Unix epoch timestamp as an int",
                                    "explanationIfWrong": "Epoch timestamp is returned by dt.timestamp()."
                        },
                        {
                                    "id": "D",
                                    "text": "A tuple of strings",
                                    "explanationIfWrong": "It returns a standard ISO formatted string."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "isoformat() generates standard ISO 8601 strings, the universal standard for JSON and web APIs."
}
        ]
      }
    ]
  },
  {
    "id": "7-4-data-processing",
    "number": "7.4",
    "title": "Data Processing & JSON",
    "subtitle": "Process multi-source datasets, serialize structured data with the json module, and build aggregation pipelines.",
    "readTime": "20 min",
    "objectives": [
      "Serialize Python dictionaries and lists to JSON strings using json.dumps()",
      "Parse JSON strings into Python data structures with json.loads()",
      "Read and write JSON files directly with json.dump() and json.load()",
      "Aggregate datasets into summary statistics and grouping dictionaries",
      "Filter and transform records across multiple interrelated files",
      "Handle missing fields and data inconsistencies gracefully"
],
    "theoryBlocks": [
      {
        "heading": "Introduction to JSON in Python",
        "text": "JSON (JavaScript Object Notation) is the universal data-interchange format for web APIs, configuration files, and data storage. Python's built-in json module seamlessly converts between JSON text and Python dictionaries, lists, strings, numbers, booleans, and None.",
        "codeSnippet": "import json\n\nstudent = {\n    \"name\": \"Linus\",\n    \"credits\": 45,\n    \"is_active\": True,\n    \"courses\": [\"TKT10001\", \"TKT10002\"]\n}\n\n# Convert to JSON string:\njson_text = json.dumps(student, indent=2)\nprint(json_text)",
        "terminalOutput": "{\n  \"name\": \"Linus\",\n  \"credits\": 45,\n  \"is_active\": true,\n  \"courses\": [\n    \"TKT10001\",\n    \"TKT10002\"\n  ]\n}",
        "tip": "Notice how Python's True becomes JSON's lowercase true, and None becomes null.",
        "mcq": {
          "id": "q-7.4-0-v1",
          "question": "What is Python's None converted to when serialized into JSON with json.dumps()?",
          "options": [
                    {
                              "id": "A",
                              "text": "null",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "\"None\"",
                              "explanationIfWrong": "JSON standardizes null as its empty/none value."
                    },
                    {
                              "id": "C",
                              "text": "undefined",
                              "explanationIfWrong": "JSON specification defines null, not undefined."
                    },
                    {
                              "id": "D",
                              "text": "0",
                              "explanationIfWrong": "None maps to null in JSON."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In the JSON specification, null corresponds to Python's None."
},
        "retestMcq": {
          "id": "q-7.4-0-v2",
          "question": "What does the indent=2 argument in json.dumps(data, indent=2) do?",
          "options": [
                    {
                              "id": "A",
                              "text": "Pretty-prints the JSON string with 2-space indentation per nesting level, making it easy for humans to read",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Limits the JSON depth to 2 levels",
                              "explanationIfWrong": "indent controls whitespace formatting, not data depth."
                    },
                    {
                              "id": "C",
                              "text": "Sorts the keys 2 times",
                              "explanationIfWrong": "Key sorting is controlled by sort_keys=True."
                    },
                    {
                              "id": "D",
                              "text": "Multiplies numbers by 2",
                              "explanationIfWrong": "It formats output indentation."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "indent formats JSON with line breaks and specified indentation spaces."
},
        "questionPool": [
          {
            "id": "q-7.4-0-v1",
            "question": "What is Python's None converted to when serialized into JSON with json.dumps()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "null",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "\"None\"",
                                    "explanationIfWrong": "JSON standardizes null as its empty/none value."
                        },
                        {
                                    "id": "C",
                                    "text": "undefined",
                                    "explanationIfWrong": "JSON specification defines null, not undefined."
                        },
                        {
                                    "id": "D",
                                    "text": "0",
                                    "explanationIfWrong": "None maps to null in JSON."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In the JSON specification, null corresponds to Python's None."
},
          {
            "id": "q-7.4-0-v2",
            "question": "What does the indent=2 argument in json.dumps(data, indent=2) do?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Pretty-prints the JSON string with 2-space indentation per nesting level, making it easy for humans to read",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Limits the JSON depth to 2 levels",
                                    "explanationIfWrong": "indent controls whitespace formatting, not data depth."
                        },
                        {
                                    "id": "C",
                                    "text": "Sorts the keys 2 times",
                                    "explanationIfWrong": "Key sorting is controlled by sort_keys=True."
                        },
                        {
                                    "id": "D",
                                    "text": "Multiplies numbers by 2",
                                    "explanationIfWrong": "It formats output indentation."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "indent formats JSON with line breaks and specified indentation spaces."
},
          {
            "id": "q-7.4-0-v3",
            "question": "What error occurs if you try to serialize an un-serializable object (like a set or custom class) with json.dumps()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: Object of type ... is not JSON serializable",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ValueError",
                                    "explanationIfWrong": "Type mismatches in serialization raise TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "It converts it to an empty string",
                                    "explanationIfWrong": "json.dumps fails with an exception on unsupported types."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "This is a runtime TypeError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Sets, functions, and custom objects raise TypeError unless custom serializer encoders are provided."
}
        ]
      },
      {
        "heading": "Parsing JSON with json.loads()",
        "text": "The json.loads(string) function (load-string) parses a valid JSON string and converts it into corresponding Python objects (objects become dicts, arrays become lists, booleans become bools, and null becomes None).",
        "codeSnippet": "import json\n\nraw_json = '{\"title\": \"Python MOOC\", \"parts\": 14, \"passed\": true}'\ndata = json.loads(raw_json)\n\nprint(f\"Title: {data['title']}\")\nprint(f\"Parts: {data['parts']}\")\nprint(f\"Type of data: {type(data).__name__}\")",
        "terminalOutput": "Title: Python MOOC\nParts: 14\nType of data: dict",
        "mcq": {
          "id": "q-7.4-1-v1",
          "question": "What is the return type of json.loads('[1, 2, 3]')?",
          "options": [
                    {
                              "id": "A",
                              "text": "list",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "tuple",
                              "explanationIfWrong": "JSON arrays parse into Python lists."
                    },
                    {
                              "id": "C",
                              "text": "str",
                              "explanationIfWrong": "loads parses the string into native Python data structures."
                    },
                    {
                              "id": "D",
                              "text": "set",
                              "explanationIfWrong": "Arrays become lists."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "JSON arrays enclosed in brackets [] parse into Python list objects."
},
        "retestMcq": {
          "id": "q-7.4-1-v2",
          "question": "What error occurs if you attempt to parse invalid JSON, such as json.loads(\"{'single_quotes': 1}\")?",
          "options": [
                    {
                              "id": "A",
                              "text": "json.decoder.JSONDecodeError (valid JSON requires double quotes around keys)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "SyntaxError",
                              "explanationIfWrong": "The json module raises JSONDecodeError."
                    },
                    {
                              "id": "C",
                              "text": "It converts single quotes to double quotes automatically",
                              "explanationIfWrong": "The JSON standard strictly forbids single quotes around strings/keys."
                    },
                    {
                              "id": "D",
                              "text": "KeyError",
                              "explanationIfWrong": "JSON specification requires double quotes."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The JSON standard mandates double quotes (\") for strings and keys. Single quotes cause a JSONDecodeError."
},
        "questionPool": [
          {
            "id": "q-7.4-1-v1",
            "question": "What is the return type of json.loads('[1, 2, 3]')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "list",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "tuple",
                                    "explanationIfWrong": "JSON arrays parse into Python lists."
                        },
                        {
                                    "id": "C",
                                    "text": "str",
                                    "explanationIfWrong": "loads parses the string into native Python data structures."
                        },
                        {
                                    "id": "D",
                                    "text": "set",
                                    "explanationIfWrong": "Arrays become lists."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "JSON arrays enclosed in brackets [] parse into Python list objects."
},
          {
            "id": "q-7.4-1-v2",
            "question": "What error occurs if you attempt to parse invalid JSON, such as json.loads(\"{'single_quotes': 1}\")?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "json.decoder.JSONDecodeError (valid JSON requires double quotes around keys)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "The json module raises JSONDecodeError."
                        },
                        {
                                    "id": "C",
                                    "text": "It converts single quotes to double quotes automatically",
                                    "explanationIfWrong": "The JSON standard strictly forbids single quotes around strings/keys."
                        },
                        {
                                    "id": "D",
                                    "text": "KeyError",
                                    "explanationIfWrong": "JSON specification requires double quotes."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The JSON standard mandates double quotes (\") for strings and keys. Single quotes cause a JSONDecodeError."
},
          {
            "id": "q-7.4-1-v3",
            "question": "What is the key difference between json.load() and json.loads()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "json.load(f) reads from a file object, while json.loads(s) parses from a string directly",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "json.loads() is for lists only",
                                    "explanationIfWrong": "Both handle any valid JSON root element."
                        },
                        {
                                    "id": "C",
                                    "text": "json.load() is deprecated in Python 3",
                                    "explanationIfWrong": "Both are active standard functions."
                        },
                        {
                                    "id": "D",
                                    "text": "loads stands for load-secure",
                                    "explanationIfWrong": "loads stands for load-string."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The 's' in loads stands for string: loads(s) takes a string, load(fp) takes a file pointer."
}
        ]
      },
      {
        "heading": "Reading & Writing JSON Files: dump() & load()",
        "text": "Instead of converting to intermediate strings, you can write Python objects directly to a file using json.dump(obj, file), and read JSON files directly using data = json.load(file).",
        "codeSnippet": "import json\n\nsettings = {\"theme\": \"dark\", \"font_size\": 14, \"autosave\": True}\n\n# Writing to file:\nwith open(\"settings.json\", \"w\") as f:\n    json.dump(settings, f, indent=4)\n\n# Reading from file:\nwith open(\"settings.json\", \"r\") as f:\n    loaded = json.load(f)\n    print(f\"Theme loaded: {loaded['theme']}\")",
        "terminalOutput": "Theme loaded: dark",
        "mcq": {
          "id": "q-7.4-2-v1",
          "question": "Which function writes a Python dictionary directly into an open file as JSON?",
          "options": [
                    {
                              "id": "A",
                              "text": "json.dump(data, file)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "json.dumps(data, file)",
                              "explanationIfWrong": "dumps() takes data and returns a string; dump() takes data and a file pointer."
                    },
                    {
                              "id": "C",
                              "text": "file.write_json(data)",
                              "explanationIfWrong": "File objects do not have write_json."
                    },
                    {
                              "id": "D",
                              "text": "json.save(data, file)",
                              "explanationIfWrong": "The function is named json.dump()."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "json.dump(obj, fp) serializes obj directly into the writeable file stream fp."
},
        "retestMcq": {
          "id": "q-7.4-2-v2",
          "question": "What happens if you open settings.json in 'r' mode and call json.load(f) when the file is completely empty (0 bytes)?",
          "options": [
                    {
                              "id": "A",
                              "text": "json.decoder.JSONDecodeError (expecting value)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It returns None",
                              "explanationIfWrong": "An empty file is not valid JSON; JSON requires a root element."
                    },
                    {
                              "id": "C",
                              "text": "It returns an empty dict {}",
                              "explanationIfWrong": "An empty string is invalid JSON syntax."
                    },
                    {
                              "id": "D",
                              "text": "It creates a default JSON structure",
                              "explanationIfWrong": "JSON parser raises JSONDecodeError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "An empty file contains no JSON document, triggering JSONDecodeError: Expecting value: line 1 column 1 (char 0)."
},
        "questionPool": [
          {
            "id": "q-7.4-2-v1",
            "question": "Which function writes a Python dictionary directly into an open file as JSON?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "json.dump(data, file)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "json.dumps(data, file)",
                                    "explanationIfWrong": "dumps() takes data and returns a string; dump() takes data and a file pointer."
                        },
                        {
                                    "id": "C",
                                    "text": "file.write_json(data)",
                                    "explanationIfWrong": "File objects do not have write_json."
                        },
                        {
                                    "id": "D",
                                    "text": "json.save(data, file)",
                                    "explanationIfWrong": "The function is named json.dump()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "json.dump(obj, fp) serializes obj directly into the writeable file stream fp."
},
          {
            "id": "q-7.4-2-v2",
            "question": "What happens if you open settings.json in 'r' mode and call json.load(f) when the file is completely empty (0 bytes)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "json.decoder.JSONDecodeError (expecting value)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It returns None",
                                    "explanationIfWrong": "An empty file is not valid JSON; JSON requires a root element."
                        },
                        {
                                    "id": "C",
                                    "text": "It returns an empty dict {}",
                                    "explanationIfWrong": "An empty string is invalid JSON syntax."
                        },
                        {
                                    "id": "D",
                                    "text": "It creates a default JSON structure",
                                    "explanationIfWrong": "JSON parser raises JSONDecodeError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "An empty file contains no JSON document, triggering JSONDecodeError: Expecting value: line 1 column 1 (char 0)."
},
          {
            "id": "q-7.4-2-v3",
            "question": "How can you sort the keys alphabetically when saving JSON to a file?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "json.dump(data, f, sort_keys=True)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "data.sort_keys()",
                                    "explanationIfWrong": "Dicts do not have a sort_keys method."
                        },
                        {
                                    "id": "C",
                                    "text": "json.sort(data)",
                                    "explanationIfWrong": "sort_keys is a parameter of dump and dumps."
                        },
                        {
                                    "id": "D",
                                    "text": "json.dump(sorted(data), f)",
                                    "explanationIfWrong": "sorted(data) only yields keys as a list, discarding values."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing sort_keys=True ensures dictionary keys are output in alphabetical order."
}
        ]
      },
      {
        "heading": "Grouping & Aggregation Pipelines",
        "text": "Data processing often involves grouping records by an attribute (e.g. grouping students by major, or transactions by date). Use a dictionary where each key maps to a list of matching records.",
        "codeSnippet": "employees = [\n    {\"name\": \"Alice\", \"dept\": \"Engineering\"},\n    {\"name\": \"Bob\", \"dept\": \"HR\"},\n    {\"name\": \"Charlie\", \"dept\": \"Engineering\"}\n]\n\nby_dept = {}\nfor emp in employees:\n    dept = emp[\"dept\"]\n    if dept not in by_dept:\n        by_dept[dept] = []\n    by_dept[dept].append(emp[\"name\"])\n\nprint(by_dept)",
        "terminalOutput": "{'Engineering': ['Alice', 'Charlie'], 'HR': ['Bob']}",
        "mcq": {
          "id": "q-7.4-3-v1",
          "question": "What data structure pattern is used to group items under shared category keys?",
          "options": [
                    {
                              "id": "A",
                              "text": "A dictionary mapping each category key to a list of items: dict[key] = [item1, item2]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A 1D list of strings",
                              "explanationIfWrong": "A list cannot map categories to collections without searching."
                    },
                    {
                              "id": "C",
                              "text": "A single boolean variable",
                              "explanationIfWrong": "Grouping requires key-to-collection mapping."
                    },
                    {
                              "id": "D",
                              "text": "A tuple of integers",
                              "explanationIfWrong": "Grouping requires mutable collections per key."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A dictionary of lists (multimap pattern) cleanly organizes elements by category."
},
        "retestMcq": {
          "id": "q-7.4-3-v2",
          "question": "Which Python class from collections automates initializing missing list keys when grouping?",
          "options": [
                    {
                              "id": "A",
                              "text": "collections.defaultdict(list)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "collections.GroupList",
                              "explanationIfWrong": "The class is defaultdict."
                    },
                    {
                              "id": "C",
                              "text": "collections.auto_dict",
                              "explanationIfWrong": "defaultdict is the standard class."
                    },
                    {
                              "id": "D",
                              "text": "itertools.group",
                              "explanationIfWrong": "defaultdict(list) is the classic grouping tool."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "defaultdict(list) automatically creates an empty list when an unseen key is accessed."
},
        "questionPool": [
          {
            "id": "q-7.4-3-v1",
            "question": "What data structure pattern is used to group items under shared category keys?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A dictionary mapping each category key to a list of items: dict[key] = [item1, item2]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A 1D list of strings",
                                    "explanationIfWrong": "A list cannot map categories to collections without searching."
                        },
                        {
                                    "id": "C",
                                    "text": "A single boolean variable",
                                    "explanationIfWrong": "Grouping requires key-to-collection mapping."
                        },
                        {
                                    "id": "D",
                                    "text": "A tuple of integers",
                                    "explanationIfWrong": "Grouping requires mutable collections per key."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A dictionary of lists (multimap pattern) cleanly organizes elements by category."
},
          {
            "id": "q-7.4-3-v2",
            "question": "Which Python class from collections automates initializing missing list keys when grouping?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "collections.defaultdict(list)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "collections.GroupList",
                                    "explanationIfWrong": "The class is defaultdict."
                        },
                        {
                                    "id": "C",
                                    "text": "collections.auto_dict",
                                    "explanationIfWrong": "defaultdict is the standard class."
                        },
                        {
                                    "id": "D",
                                    "text": "itertools.group",
                                    "explanationIfWrong": "defaultdict(list) is the classic grouping tool."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "defaultdict(list) automatically creates an empty list when an unseen key is accessed."
},
          {
            "id": "q-7.4-3-v3",
            "question": "What is the result of by_dept['Engineering'] in the code above?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "['Alice', 'Charlie']",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'Alice'",
                                    "explanationIfWrong": "Both employees belong to Engineering."
                        },
                        {
                                    "id": "C",
                                    "text": "2",
                                    "explanationIfWrong": "The value is a list of names."
                        },
                        {
                                    "id": "D",
                                    "text": "{'Alice': 'Charlie'}",
                                    "explanationIfWrong": "It stores names in a list."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Both Alice and Charlie are appended to the 'Engineering' list."
}
        ]
      },
      {
        "heading": "Merging Multi-Source Datasets",
        "text": "Real applications frequently combine data from multiple files (e.g. merging student contact details from students.csv with grades from submissions.csv) using a shared identifier (such as student ID).",
        "codeSnippet": "# Students: id -> name\nstudents = {\"s01\": \"Alice\", \"s02\": \"Bob\"}\n# Points: id -> score\nscores = {\"s01\": 95, \"s02\": 82}\n\nreport = []\nfor s_id, name in students.items():\n    score = scores.get(s_id, 0)\n    report.append({\"id\": s_id, \"name\": name, \"score\": score})\n\nprint(report)",
        "terminalOutput": "[{'id': 's01', 'name': 'Alice', 'score': 95}, {'id': 's02', 'name': 'Bob', 'score': 82}]",
        "mcq": {
          "id": "q-7.4-4-v1",
          "question": "What role does student ID ('s01') play in merging the two dictionaries?",
          "options": [
                    {
                              "id": "A",
                              "text": "It acts as a primary foreign key (unique identifier) linking records across both datasets",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It sorts the names alphabetically",
                              "explanationIfWrong": "IDs provide unique identification, not sorting."
                    },
                    {
                              "id": "C",
                              "text": "It encrypts the students' names",
                              "explanationIfWrong": "The ID is a standard relational key."
                    },
                    {
                              "id": "D",
                              "text": "It calculates GPA automatically",
                              "explanationIfWrong": "It links data across tables/files."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A unique key enables fast O(1) matching between disparate data sources."
},
        "retestMcq": {
          "id": "q-7.4-4-v2",
          "question": "Why is scores.get(s_id, 0) used instead of scores[s_id] when merging?",
          "options": [
                    {
                              "id": "A",
                              "text": "If a student has not submitted any exam, .get() safely assigns 0 instead of crashing with a KeyError",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because square brackets [] cannot be used with strings",
                              "explanationIfWrong": "Bracket lookup is valid, but unsafe if missing."
                    },
                    {
                              "id": "C",
                              "text": "It rounds scores to whole numbers",
                              "explanationIfWrong": "It handles missing records safely."
                    },
                    {
                              "id": "D",
                              "text": "It is required by the Python interpreter",
                              "explanationIfWrong": "It prevents KeyError exceptions."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Using .get(s_id, 0) gracefully handles missing student submissions without crashes."
},
        "questionPool": [
          {
            "id": "q-7.4-4-v1",
            "question": "What role does student ID ('s01') play in merging the two dictionaries?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It acts as a primary foreign key (unique identifier) linking records across both datasets",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It sorts the names alphabetically",
                                    "explanationIfWrong": "IDs provide unique identification, not sorting."
                        },
                        {
                                    "id": "C",
                                    "text": "It encrypts the students' names",
                                    "explanationIfWrong": "The ID is a standard relational key."
                        },
                        {
                                    "id": "D",
                                    "text": "It calculates GPA automatically",
                                    "explanationIfWrong": "It links data across tables/files."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A unique key enables fast O(1) matching between disparate data sources."
},
          {
            "id": "q-7.4-4-v2",
            "question": "Why is scores.get(s_id, 0) used instead of scores[s_id] when merging?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "If a student has not submitted any exam, .get() safely assigns 0 instead of crashing with a KeyError",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because square brackets [] cannot be used with strings",
                                    "explanationIfWrong": "Bracket lookup is valid, but unsafe if missing."
                        },
                        {
                                    "id": "C",
                                    "text": "It rounds scores to whole numbers",
                                    "explanationIfWrong": "It handles missing records safely."
                        },
                        {
                                    "id": "D",
                                    "text": "It is required by the Python interpreter",
                                    "explanationIfWrong": "It prevents KeyError exceptions."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Using .get(s_id, 0) gracefully handles missing student submissions without crashes."
},
          {
            "id": "q-7.4-4-v3",
            "question": "What database operation does this Python merge pattern resemble?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "An INNER JOIN or LEFT JOIN",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A DROP TABLE operation",
                                    "explanationIfWrong": "It combines data, rather than deleting tables."
                        },
                        {
                                    "id": "C",
                                    "text": "A CREATE INDEX statement",
                                    "explanationIfWrong": "It joins data by matching keys."
                        },
                        {
                                    "id": "D",
                                    "text": "A TRUNCATE operation",
                                    "explanationIfWrong": "This is relational table joining."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Linking two tables on a matching key is the equivalent of a relational SQL JOIN."
}
        ]
      },
      {
        "heading": "Handling Corrupt or Missing Records",
        "text": "Real-world datasets often contain malformed rows, missing columns, or invalid numbers. A robust processing pipeline wraps parsing steps in try-except blocks to log warnings and skip bad rows without terminating the entire pipeline.",
        "codeSnippet": "raw_lines = [\"Alice,95\", \"Bob,invalid\", \"Charlie,88\", \"DamagedRow\"]\nclean_data = []\n\nfor line in raw_lines:\n    parts = line.split(\",\")\n    if len(parts) != 2:\n        print(f\"Skipping malformed row: {line}\")\n        continue\n    try:\n        name = parts[0]\n        score = int(parts[1])\n        clean_data.append((name, score))\n    except ValueError:\n        print(f\"Skipping invalid score in: {line}\")\n\nprint(f\"Clean records: {clean_data}\")",
        "terminalOutput": "Skipping invalid score in: Bob,invalid\nSkipping malformed row: DamagedRow\nClean records: [('Alice', 95), ('Charlie', 88)]",
        "mcq": {
          "id": "q-7.4-5-v1",
          "question": "Why should data parsing logic be wrapped in try-except blocks when reading external files?",
          "options": [
                    {
                              "id": "A",
                              "text": "To prevent a single malformed row or corrupted field from crashing the processing of thousands of valid rows",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because Python requires try-except for all for loops",
                              "explanationIfWrong": "try-except is only used when exceptions may occur."
                    },
                    {
                              "id": "C",
                              "text": "It automatically corrects bad data to valid data",
                              "explanationIfWrong": "It intercepts errors; correction logic must still be written."
                    },
                    {
                              "id": "D",
                              "text": "It speeds up parsing by 2x",
                              "explanationIfWrong": "It provides resilience and error isolation."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Isolating errors ensures that bad data rows can be logged or skipped while valid data is processed."
},
        "retestMcq": {
          "id": "q-7.4-5-v2",
          "question": "What check prevents IndexError when unpacking CSV rows like name, score = line.split(',')?",
          "options": [
                    {
                              "id": "A",
                              "text": "Verify that len(line.split(',')) == 2 before unpacking",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Wrap the line in str()",
                              "explanationIfWrong": "Unpacking requires the count of items to match."
                    },
                    {
                              "id": "C",
                              "text": "Call line.strip() only",
                              "explanationIfWrong": "Stripping doesn't ensure 2 columns exist."
                    },
                    {
                              "id": "D",
                              "text": "Use a while loop",
                              "explanationIfWrong": "Length validation prevents unpacking mismatches."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Verifying column count ensures unpacking won't raise ValueError or IndexError."
},
        "questionPool": [
          {
            "id": "q-7.4-5-v1",
            "question": "Why should data parsing logic be wrapped in try-except blocks when reading external files?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To prevent a single malformed row or corrupted field from crashing the processing of thousands of valid rows",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because Python requires try-except for all for loops",
                                    "explanationIfWrong": "try-except is only used when exceptions may occur."
                        },
                        {
                                    "id": "C",
                                    "text": "It automatically corrects bad data to valid data",
                                    "explanationIfWrong": "It intercepts errors; correction logic must still be written."
                        },
                        {
                                    "id": "D",
                                    "text": "It speeds up parsing by 2x",
                                    "explanationIfWrong": "It provides resilience and error isolation."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Isolating errors ensures that bad data rows can be logged or skipped while valid data is processed."
},
          {
            "id": "q-7.4-5-v2",
            "question": "What check prevents IndexError when unpacking CSV rows like name, score = line.split(',')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Verify that len(line.split(',')) == 2 before unpacking",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Wrap the line in str()",
                                    "explanationIfWrong": "Unpacking requires the count of items to match."
                        },
                        {
                                    "id": "C",
                                    "text": "Call line.strip() only",
                                    "explanationIfWrong": "Stripping doesn't ensure 2 columns exist."
                        },
                        {
                                    "id": "D",
                                    "text": "Use a while loop",
                                    "explanationIfWrong": "Length validation prevents unpacking mismatches."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Verifying column count ensures unpacking won't raise ValueError or IndexError."
},
          {
            "id": "q-7.4-5-v3",
            "question": "What is the best practice for documenting skipped or invalid data rows in production pipelines?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Log warnings containing the line number and raw contents using Python's logging module",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Silently ignore them without any output",
                                    "explanationIfWrong": "Silent failures make debugging corrupted data impossible."
                        },
                        {
                                    "id": "C",
                                    "text": "Delete the entire input file",
                                    "explanationIfWrong": "Deleting source data risks data loss."
                        },
                        {
                                    "id": "D",
                                    "text": "Raise an unhandled exception to crash the server",
                                    "explanationIfWrong": "Resilient pipelines log errors and proceed."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Logging malformed rows provides an audit trail without crashing the pipeline."
}
        ]
      }
    ]
  },
  {
    "id": "7-5-creating-modules",
    "number": "7.5",
    "title": "Creating Your Own Modules",
    "subtitle": "Structure multi-file Python applications, write reusable modules, and master if __name__ == '__main__':.",
    "readTime": "20 min",
    "objectives": [
      "Organize code into multiple modular Python files",
      "Import functions and variables from your own .py files",
      "Understand the special __name__ variable and its role",
      "Use if __name__ == '__main__': to separate executable scripts from reusable libraries",
      "Inspect and modify the module search path with sys.path",
      "Identify and avoid circular import dependencies"
],
    "theoryBlocks": [
      {
        "heading": "Writing Your Own Modules",
        "text": "Any Python source file (.py) can be imported as a module into another Python file in the same directory. Simply use import filename (without the .py extension). All functions, variables, and classes defined in that file become available.",
        "codeSnippet": "# File: calculations.py\ndef add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n\n# File: main.py\nimport calculations\nprint(calculations.add(10, 5))\nprint(calculations.multiply(4, 3))",
        "terminalOutput": "15\n12",
        "tip": "Module filenames should follow PEP 8: all lowercase letters, with underscores if necessary (e.g. string_helpers.py). Never name your module after a standard library module (like random.py or math.py).",
        "mcq": {
          "id": "q-7.5-0-v1",
          "question": "If you have a file named helpers.py in the same folder, how do you import its functions into main.py?",
          "options": [
                    {
                              "id": "A",
                              "text": "import helpers",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "import helpers.py",
                              "explanationIfWrong": "Do not include the .py extension in import statements."
                    },
                    {
                              "id": "C",
                              "text": "load 'helpers.py'",
                              "explanationIfWrong": "Python uses the import keyword."
                    },
                    {
                              "id": "D",
                              "text": "include helpers",
                              "explanationIfWrong": "include is C/C++ syntax, not Python."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python imports modules by name without the .py file extension."
},
        "retestMcq": {
          "id": "q-7.5-0-v2",
          "question": "What disaster occurs if you name your own script math.py and write import math inside it?",
          "options": [
                    {
                              "id": "A",
                              "text": "Python imports your local math.py instead of the standard library math module, causing an AttributeError when calling math.sqrt()",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Windows deletes the file",
                              "explanationIfWrong": "The issue is module name shadowing in sys.path."
                    },
                    {
                              "id": "C",
                              "text": "Python merges both files together",
                              "explanationIfWrong": "The local file completely masks the standard module."
                    },
                    {
                              "id": "D",
                              "text": "The computer freezes",
                              "explanationIfWrong": "An AttributeError or circular import occurs."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The current directory takes precedence in sys.path, shadowing the standard library module."
},
        "questionPool": [
          {
            "id": "q-7.5-0-v1",
            "question": "If you have a file named helpers.py in the same folder, how do you import its functions into main.py?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "import helpers",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "import helpers.py",
                                    "explanationIfWrong": "Do not include the .py extension in import statements."
                        },
                        {
                                    "id": "C",
                                    "text": "load 'helpers.py'",
                                    "explanationIfWrong": "Python uses the import keyword."
                        },
                        {
                                    "id": "D",
                                    "text": "include helpers",
                                    "explanationIfWrong": "include is C/C++ syntax, not Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python imports modules by name without the .py file extension."
},
          {
            "id": "q-7.5-0-v2",
            "question": "What disaster occurs if you name your own script math.py and write import math inside it?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Python imports your local math.py instead of the standard library math module, causing an AttributeError when calling math.sqrt()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Windows deletes the file",
                                    "explanationIfWrong": "The issue is module name shadowing in sys.path."
                        },
                        {
                                    "id": "C",
                                    "text": "Python merges both files together",
                                    "explanationIfWrong": "The local file completely masks the standard module."
                        },
                        {
                                    "id": "D",
                                    "text": "The computer freezes",
                                    "explanationIfWrong": "An AttributeError or circular import occurs."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The current directory takes precedence in sys.path, shadowing the standard library module."
},
          {
            "id": "q-7.5-0-v3",
            "question": "Can you import a specific function from your custom module using from helpers import my_func?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, custom modules support all standard Python import syntax identically to standard library modules",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, custom modules only support full import",
                                    "explanationIfWrong": "from-import works on any Python module."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if compiled to .exe first",
                                    "explanationIfWrong": "Python interprets .py files directly."
                        },
                        {
                                    "id": "D",
                                    "text": "Only if helpers is uploaded to PyPI",
                                    "explanationIfWrong": "Local modules import directly from disk."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Local modules have full support for import, from-import, and as aliasing."
}
        ]
      },
      {
        "heading": "The Special __name__ Variable",
        "text": "Every Python module has a built-in string variable called __name__. When a file is executed directly (e.g. python script.py), Python sets __name__ = '__main__'. When the file is imported into another script, Python sets __name__ equal to the module's actual filename (e.g. 'helpers').",
        "codeSnippet": "# File: test_name.py\nprint(f\"Value of __name__ is: {__name__}\")\n\n# Run directly:\n# python test_name.py -> \"Value of __name__ is: __main__\"\n\n# Run via import in another file:\n# import test_name    -> \"Value of __name__ is: test_name\"",
        "terminalOutput": "Value of __name__ is: __main__",
        "mcq": {
          "id": "q-7.5-1-v1",
          "question": "What is the value of __name__ when a Python file is run directly from the terminal (e.g. python app.py)?",
          "options": [
                    {
                              "id": "A",
                              "text": "'__main__'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'app'",
                              "explanationIfWrong": "__name__ is '__main__' when executed as the top-level script."
                    },
                    {
                              "id": "C",
                              "text": "'app.py'",
                              "explanationIfWrong": "The literal string is '__main__'."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "Python sets __name__ to '__main__' for the entrypoint."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The top-level script being executed directly always receives the name '__main__'."
},
        "retestMcq": {
          "id": "q-7.5-1-v2",
          "question": "What is the value of __name__ inside a file named utils.py when it is imported into another file (import utils)?",
          "options": [
                    {
                              "id": "A",
                              "text": "'utils'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'__main__'",
                              "explanationIfWrong": "Only the directly executed file is '__main__'; imported files take their module name."
                    },
                    {
                              "id": "C",
                              "text": "'__import__'",
                              "explanationIfWrong": "The value is the module's name as a string."
                    },
                    {
                              "id": "D",
                              "text": "'root'",
                              "explanationIfWrong": "It equals 'utils'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When imported, a module's __name__ is set to its module name ('utils')."
},
        "questionPool": [
          {
            "id": "q-7.5-1-v1",
            "question": "What is the value of __name__ when a Python file is run directly from the terminal (e.g. python app.py)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'__main__'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'app'",
                                    "explanationIfWrong": "__name__ is '__main__' when executed as the top-level script."
                        },
                        {
                                    "id": "C",
                                    "text": "'app.py'",
                                    "explanationIfWrong": "The literal string is '__main__'."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "Python sets __name__ to '__main__' for the entrypoint."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The top-level script being executed directly always receives the name '__main__'."
},
          {
            "id": "q-7.5-1-v2",
            "question": "What is the value of __name__ inside a file named utils.py when it is imported into another file (import utils)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'utils'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'__main__'",
                                    "explanationIfWrong": "Only the directly executed file is '__main__'; imported files take their module name."
                        },
                        {
                                    "id": "C",
                                    "text": "'__import__'",
                                    "explanationIfWrong": "The value is the module's name as a string."
                        },
                        {
                                    "id": "D",
                                    "text": "'root'",
                                    "explanationIfWrong": "It equals 'utils'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When imported, a module's __name__ is set to its module name ('utils')."
},
          {
            "id": "q-7.5-1-v3",
            "question": "Why does Python provide the __name__ variable?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To allow a file to determine whether it is being run as the standalone main program or imported as a reusable library in another file",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "To print the operating system username",
                                    "explanationIfWrong": "OS username is in getpass.getuser()."
                        },
                        {
                                    "id": "C",
                                    "text": "To name the computer's CPU",
                                    "explanationIfWrong": "__name__ is a module scope indicator."
                        },
                        {
                                    "id": "D",
                                    "text": "To enforce licensing agreements",
                                    "explanationIfWrong": "It distinguishes script execution from module import."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "__name__ allows code to behave as both an executable script and an importable module."
}
        ]
      },
      {
        "heading": "The if __name__ == '__main__': Idiom",
        "text": "By placing test code, CLI logic, or interactive prompts inside an if __name__ == '__main__': block, that code will execute ONLY when the file is run directly, and will NOT execute when the file is imported into another program.",
        "codeSnippet": "# File: math_tools.py\ndef cube(n):\n    return n ** 3\n\n# Only runs when testing this file directly:\nif __name__ == \"__main__\":\n    print(\"Testing cube()...\")\n    print(f\"cube(3) = {cube(3)}\")",
        "terminalOutput": "Testing cube()...\ncube(3) = 27",
        "tip": "Every reusable Python module should use if __name__ == '__main__': for its tests and demonstrations.",
        "mcq": {
          "id": "q-7.5-2-v1",
          "question": "What happens to the code inside if __name__ == '__main__': when another file imports that module?",
          "options": [
                    {
                              "id": "A",
                              "text": "The code inside the block is skipped and does NOT execute",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The code executes immediately upon import",
                              "explanationIfWrong": "Because __name__ != '__main__' on import, the if condition is False."
                    },
                    {
                              "id": "C",
                              "text": "A SyntaxError is raised",
                              "explanationIfWrong": "This is the standard, recommended idiom in Python."
                    },
                    {
                              "id": "D",
                              "text": "The functions are deleted",
                              "explanationIfWrong": "Only the code inside the block is bypassed."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "On import, __name__ is the module name, so the condition evaluates to False and the block is skipped."
},
        "retestMcq": {
          "id": "q-7.5-2-v2",
          "question": "What common nuisance occurs if you omit if __name__ == '__main__': and leave print() test statements at the top level of a module?",
          "options": [
                    {
                              "id": "A",
                              "text": "Every time another file imports the module, all the test print statements execute and clutter the terminal output",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python refuses to import the file",
                              "explanationIfWrong": "Python imports it, but executes all top-level statements."
                    },
                    {
                              "id": "C",
                              "text": "The functions return None",
                              "explanationIfWrong": "Function behavior is unaffected, but unwanted prints occur."
                    },
                    {
                              "id": "D",
                              "text": "The file cannot be saved",
                              "explanationIfWrong": "Top-level code runs unconditionally on import."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "All top-level code executes upon import. Wrapping tests in if __name__ == '__main__': prevents unwanted execution."
},
        "questionPool": [
          {
            "id": "q-7.5-2-v1",
            "question": "What happens to the code inside if __name__ == '__main__': when another file imports that module?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The code inside the block is skipped and does NOT execute",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The code executes immediately upon import",
                                    "explanationIfWrong": "Because __name__ != '__main__' on import, the if condition is False."
                        },
                        {
                                    "id": "C",
                                    "text": "A SyntaxError is raised",
                                    "explanationIfWrong": "This is the standard, recommended idiom in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "The functions are deleted",
                                    "explanationIfWrong": "Only the code inside the block is bypassed."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "On import, __name__ is the module name, so the condition evaluates to False and the block is skipped."
},
          {
            "id": "q-7.5-2-v2",
            "question": "What common nuisance occurs if you omit if __name__ == '__main__': and leave print() test statements at the top level of a module?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Every time another file imports the module, all the test print statements execute and clutter the terminal output",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python refuses to import the file",
                                    "explanationIfWrong": "Python imports it, but executes all top-level statements."
                        },
                        {
                                    "id": "C",
                                    "text": "The functions return None",
                                    "explanationIfWrong": "Function behavior is unaffected, but unwanted prints occur."
                        },
                        {
                                    "id": "D",
                                    "text": "The file cannot be saved",
                                    "explanationIfWrong": "Top-level code runs unconditionally on import."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "All top-level code executes upon import. Wrapping tests in if __name__ == '__main__': prevents unwanted execution."
},
          {
            "id": "q-7.5-2-v3",
            "question": "Where is if __name__ == '__main__': conventionally placed in a Python file?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "At the very bottom of the file, after all function and class definitions",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "On line 1 before imports",
                                    "explanationIfWrong": "Imports and functions must be defined before the main block executes them."
                        },
                        {
                                    "id": "C",
                                    "text": "Inside the first function definition",
                                    "explanationIfWrong": "It is placed at the module level."
                        },
                        {
                                    "id": "D",
                                    "text": "In a separate __main__.txt file",
                                    "explanationIfWrong": "It is written at the bottom of the .py file."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Placing it at the bottom ensures all functions are already defined when the block runs."
}
        ]
      },
      {
        "heading": "Module Search Path & sys.path",
        "text": "When you import a module, Python searches directories in the sys.path list in order: 1) The directory containing the input script; 2) PYTHONPATH environment variable directories; 3) Standard library directories; 4) Third-party site-packages.",
        "codeSnippet": "import sys\n\nprint(\"Search directories:\")\nfor p in sys.path[:3]:\n    print(f\" - {p}\")",
        "terminalOutput": "Search directories:\n - c:\\Users\\project\n - C:\\Python313\\python313.zip\n - C:\\Python313\\Lib",
        "mcq": {
          "id": "q-7.5-3-v1",
          "question": "What is the first directory Python searches when attempting to import a module?",
          "options": [
                    {
                              "id": "A",
                              "text": "The directory containing the script used to invoke the Python interpreter",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The Windows System directory",
                              "explanationIfWrong": "Python prioritizes the script's local folder."
                    },
                    {
                              "id": "C",
                              "text": "The internet package index (PyPI)",
                              "explanationIfWrong": "Python searches local disk paths only."
                    },
                    {
                              "id": "D",
                              "text": "The root drive C:\\",
                              "explanationIfWrong": "sys.path[0] is the current script folder."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "sys.path[0] is always the directory of the script that was executed."
},
        "retestMcq": {
          "id": "q-7.5-3-v2",
          "question": "How can you dynamically add a custom folder to Python's module search path during runtime?",
          "options": [
                    {
                              "id": "A",
                              "text": "sys.path.append('/path/to/my_folder')",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "os.add_path('/path/to/my_folder')",
                              "explanationIfWrong": "sys.path is a standard Python list that can be appended to."
                    },
                    {
                              "id": "C",
                              "text": "import.add_folder('/path/to/my_folder')",
                              "explanationIfWrong": "The list is sys.path."
                    },
                    {
                              "id": "D",
                              "text": "path.insert()",
                              "explanationIfWrong": "Use sys.path.append() or sys.path.insert()."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since sys.path is a standard list of directory strings, appending to it adds new search locations."
},
        "questionPool": [
          {
            "id": "q-7.5-3-v1",
            "question": "What is the first directory Python searches when attempting to import a module?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The directory containing the script used to invoke the Python interpreter",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The Windows System directory",
                                    "explanationIfWrong": "Python prioritizes the script's local folder."
                        },
                        {
                                    "id": "C",
                                    "text": "The internet package index (PyPI)",
                                    "explanationIfWrong": "Python searches local disk paths only."
                        },
                        {
                                    "id": "D",
                                    "text": "The root drive C:\\",
                                    "explanationIfWrong": "sys.path[0] is the current script folder."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "sys.path[0] is always the directory of the script that was executed."
},
          {
            "id": "q-7.5-3-v2",
            "question": "How can you dynamically add a custom folder to Python's module search path during runtime?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "sys.path.append('/path/to/my_folder')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "os.add_path('/path/to/my_folder')",
                                    "explanationIfWrong": "sys.path is a standard Python list that can be appended to."
                        },
                        {
                                    "id": "C",
                                    "text": "import.add_folder('/path/to/my_folder')",
                                    "explanationIfWrong": "The list is sys.path."
                        },
                        {
                                    "id": "D",
                                    "text": "path.insert()",
                                    "explanationIfWrong": "Use sys.path.append() or sys.path.insert()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since sys.path is a standard list of directory strings, appending to it adds new search locations."
},
          {
            "id": "q-7.5-3-v3",
            "question": "What environment variable can be configured on your operating system to permanently add search directories for Python imports?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "PYTHONPATH",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "PY_SEARCH",
                                    "explanationIfWrong": "The standard environment variable is PYTHONPATH."
                        },
                        {
                                    "id": "C",
                                    "text": "MODULE_PATH",
                                    "explanationIfWrong": "Python checks PYTHONPATH."
                        },
                        {
                                    "id": "D",
                                    "text": "IMPORT_DIR",
                                    "explanationIfWrong": "The variable is PYTHONPATH."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "PYTHONPATH defines additional directory paths inserted into sys.path."
}
        ]
      },
      {
        "heading": "Packages and __init__.py",
        "text": "A package is a folder containing multiple Python modules. In traditional Python, a folder must contain an __init__.py file (which can be empty) to be recognized as an importable package. Modules inside packages are imported with dot syntax: from package_name import module_name.",
        "codeSnippet": "# Directory structure:\n# my_package/\n#     __init__.py\n#     tools.py\n\n# Importing in main.py:\n# from my_package import tools\n# tools.do_something()",
        "terminalOutput": "Package module executed successfully!",
        "mcq": {
          "id": "q-7.5-4-v1",
          "question": "What is the purpose of an __init__.py file inside a folder?",
          "options": [
                    {
                              "id": "A",
                              "text": "It marks the directory as an importable Python package and can execute initialization code for the package",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It compiles all .py files to .exe",
                              "explanationIfWrong": "__init__.py defines package namespaces."
                    },
                    {
                              "id": "C",
                              "text": "It is required for files to be opened in VS Code",
                              "explanationIfWrong": "It is a Python packaging concept."
                    },
                    {
                              "id": "D",
                              "text": "It encrypts the source code",
                              "explanationIfWrong": "It indicates a package."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "__init__.py designates a directory as a package and initializes package-level imports."
},
        "retestMcq": {
          "id": "q-7.5-4-v2",
          "question": "Can an __init__.py file be completely empty?",
          "options": [
                    {
                              "id": "A",
                              "text": "Yes, an empty __init__.py file is completely valid and very common",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "No, it must contain at least 10 lines of code",
                              "explanationIfWrong": "Empty __init__.py files are standard."
                    },
                    {
                              "id": "C",
                              "text": "No, it must import all modules",
                              "explanationIfWrong": "Initialization code is optional."
                    },
                    {
                              "id": "D",
                              "text": "It must contain a class definition",
                              "explanationIfWrong": "An empty file is sufficient."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "An empty __init__.py file is standard in Python packages to signal package identity."
},
        "questionPool": [
          {
            "id": "q-7.5-4-v1",
            "question": "What is the purpose of an __init__.py file inside a folder?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It marks the directory as an importable Python package and can execute initialization code for the package",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It compiles all .py files to .exe",
                                    "explanationIfWrong": "__init__.py defines package namespaces."
                        },
                        {
                                    "id": "C",
                                    "text": "It is required for files to be opened in VS Code",
                                    "explanationIfWrong": "It is a Python packaging concept."
                        },
                        {
                                    "id": "D",
                                    "text": "It encrypts the source code",
                                    "explanationIfWrong": "It indicates a package."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "__init__.py designates a directory as a package and initializes package-level imports."
},
          {
            "id": "q-7.5-4-v2",
            "question": "Can an __init__.py file be completely empty?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, an empty __init__.py file is completely valid and very common",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, it must contain at least 10 lines of code",
                                    "explanationIfWrong": "Empty __init__.py files are standard."
                        },
                        {
                                    "id": "C",
                                    "text": "No, it must import all modules",
                                    "explanationIfWrong": "Initialization code is optional."
                        },
                        {
                                    "id": "D",
                                    "text": "It must contain a class definition",
                                    "explanationIfWrong": "An empty file is sufficient."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "An empty __init__.py file is standard in Python packages to signal package identity."
},
          {
            "id": "q-7.5-4-v3",
            "question": "Given package utils with module math_tools.py, how do you import the square function?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "from utils.math_tools import square",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "import square from utils/math_tools",
                                    "explanationIfWrong": "Python uses dot notation (utils.math_tools), not slashes."
                        },
                        {
                                    "id": "C",
                                    "text": "import utils -> math_tools -> square",
                                    "explanationIfWrong": "Python import syntax uses dot notation."
                        },
                        {
                                    "id": "D",
                                    "text": "load utils.math_tools.square",
                                    "explanationIfWrong": "Use standard from-import syntax."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dot notation navigates packages and submodules: from utils.math_tools import square."
}
        ]
      },
      {
        "heading": "Circular Imports & How to Avoid Them",
        "text": "A circular import occurs when module A imports module B, and module B simultaneously imports module A. When A is imported, it pauses to load B, but B attempts to load A before A has finished defining its functions, resulting in an ImportError: cannot import name.",
        "codeSnippet": "# Circular dependency trap:\n# a.py: from b import func_b\n# b.py: from a import func_a\n\n# Solution: Refactor shared logic into a third module: shared.py\n# a.py: from shared import common_data\n# b.py: from shared import common_data",
        "terminalOutput": "Circular import resolved cleanly!",
        "tip": "If you encounter a circular import, refactor the shared classes or functions into a separate helper module that both files import.",
        "mcq": {
          "id": "q-7.5-5-v1",
          "question": "What is a circular import in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "When two or more modules depend on each other directly or indirectly (A imports B and B imports A)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "When a for loop imports a module repeatedly",
                              "explanationIfWrong": "Circular imports refer to module dependency cycles."
                    },
                    {
                              "id": "C",
                              "text": "When a module is imported from a circular disk drive",
                              "explanationIfWrong": "It is an architectural dependency issue."
                    },
                    {
                              "id": "D",
                              "text": "When an import statement uses parentheses",
                              "explanationIfWrong": "It describes cyclical file dependencies."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A circular import occurs when modules require each other, causing unresolved references during initialization."
},
        "retestMcq": {
          "id": "q-7.5-5-v2",
          "question": "What is the best architectural solution to resolve a circular import between module A and module B?",
          "options": [
                    {
                              "id": "A",
                              "text": "Refactor the shared functions or data into a third common module (e.g. common.py) that both A and B can import without depending on each other",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Rename module A to module Z",
                              "explanationIfWrong": "Renaming does not break the cyclical dependency."
                    },
                    {
                              "id": "C",
                              "text": "Delete all type hints",
                              "explanationIfWrong": "Type hints do not cause runtime circular imports."
                    },
                    {
                              "id": "D",
                              "text": "Restart the operating system",
                              "explanationIfWrong": "Code structure must be refactored."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Extracting shared dependencies into a third module breaks the cycle cleanly."
},
        "questionPool": [
          {
            "id": "q-7.5-5-v1",
            "question": "What is a circular import in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "When two or more modules depend on each other directly or indirectly (A imports B and B imports A)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "When a for loop imports a module repeatedly",
                                    "explanationIfWrong": "Circular imports refer to module dependency cycles."
                        },
                        {
                                    "id": "C",
                                    "text": "When a module is imported from a circular disk drive",
                                    "explanationIfWrong": "It is an architectural dependency issue."
                        },
                        {
                                    "id": "D",
                                    "text": "When an import statement uses parentheses",
                                    "explanationIfWrong": "It describes cyclical file dependencies."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A circular import occurs when modules require each other, causing unresolved references during initialization."
},
          {
            "id": "q-7.5-5-v2",
            "question": "What is the best architectural solution to resolve a circular import between module A and module B?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Refactor the shared functions or data into a third common module (e.g. common.py) that both A and B can import without depending on each other",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Rename module A to module Z",
                                    "explanationIfWrong": "Renaming does not break the cyclical dependency."
                        },
                        {
                                    "id": "C",
                                    "text": "Delete all type hints",
                                    "explanationIfWrong": "Type hints do not cause runtime circular imports."
                        },
                        {
                                    "id": "D",
                                    "text": "Restart the operating system",
                                    "explanationIfWrong": "Code structure must be refactored."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Extracting shared dependencies into a third module breaks the cycle cleanly."
},
          {
            "id": "q-7.5-5-v3",
            "question": "Why does moving an import statement inside a function body sometimes temporarily work around a circular import?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because the import is deferred until the function is actually called, after both modules have finished top-level initialization",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because functions run with administrative privileges",
                                    "explanationIfWrong": "Deferral delays execution until both modules are in sys.modules."
                        },
                        {
                                    "id": "C",
                                    "text": "Because Python deletes imports inside functions",
                                    "explanationIfWrong": "It delays import timing."
                        },
                        {
                                    "id": "D",
                                    "text": "It converts the module to C code",
                                    "explanationIfWrong": "Local imports execute on call."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A function-level import defers execution until call-time, by which time both module namespaces are fully initialized."
}
        ]
      }
    ]
  },
  {
    "id": "7-6-more-features",
    "number": "7.6",
    "title": "More Python Features",
    "subtitle": "Explore Fractions, Decimal precision, zip() parallel iteration, string constants, and modern Python idioms.",
    "readTime": "20 min",
    "objectives": [
      "Use fractions.Fraction for exact rational arithmetic without floating-point drift",
      "Use decimal.Decimal for exact financial calculations and rounding",
      "Iterate through multiple collections in parallel using zip()",
      "Utilize the string module constants (ascii_letters, punctuation)",
      "Combine generator expressions with sum(), any(), and all()",
      "Apply modern Python idioms for clean, readable software"
],
    "theoryBlocks": [
      {
        "heading": "Exact Rational Math with fractions.Fraction",
        "text": "Standard floating-point numbers cannot represent some fractions exactly (e.g. 1/3 is 0.3333333333333333). The fractions.Fraction class represents numbers as exact numerator and denominator integer pairs, eliminating rounding errors.",
        "codeSnippet": "from fractions import Fraction\n\nf1 = Fraction(1, 3)\nf2 = Fraction(1, 6)\nresult = f1 + f2\nprint(f\"1/3 + 1/6 = {result}\")  # Exact 1/2!\nprint(f\"Numerator: {result.numerator}, Denominator: {result.denominator}\")",
        "terminalOutput": "1/3 + 1/6 = 1/2\nNumerator: 1, Denominator: 2",
        "mcq": {
          "id": "q-7.6-0-v1",
          "question": "What is the output of Fraction(2, 4) in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "Fraction(1, 2)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "0.5",
                              "explanationIfWrong": "Fraction retains rational form, reducing to lowest terms Fraction(1, 2)."
                    },
                    {
                              "id": "C",
                              "text": "Fraction(2, 4)",
                              "explanationIfWrong": "Fractions automatically reduce by greatest common divisor."
                    },
                    {
                              "id": "D",
                              "text": "2/4",
                              "explanationIfWrong": "String representation is Fraction(1, 2) or '1/2'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Fraction automatically simplifies rational fractions to their lowest terms (1/2)."
},
        "retestMcq": {
          "id": "q-7.6-0-v2",
          "question": "What is the primary benefit of Fraction over standard float?",
          "options": [
                    {
                              "id": "A",
                              "text": "It performs exact arithmetic without floating-point precision loss (e.g. 1/3 + 1/3 + 1/3 is exactly 1)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It uses 10x less RAM than float",
                              "explanationIfWrong": "Fraction stores two integers, using slightly more memory for exactness."
                    },
                    {
                              "id": "C",
                              "text": "It is implemented in GPU shaders",
                              "explanationIfWrong": "Fraction is part of the standard Python library."
                    },
                    {
                              "id": "D",
                              "text": "It can divide by zero safely",
                              "explanationIfWrong": "Division by zero raises ZeroDivisionError in Fraction too."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Fraction retains exact rational representations, preventing float rounding errors."
},
        "questionPool": [
          {
            "id": "q-7.6-0-v1",
            "question": "What is the output of Fraction(2, 4) in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Fraction(1, 2)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "0.5",
                                    "explanationIfWrong": "Fraction retains rational form, reducing to lowest terms Fraction(1, 2)."
                        },
                        {
                                    "id": "C",
                                    "text": "Fraction(2, 4)",
                                    "explanationIfWrong": "Fractions automatically reduce by greatest common divisor."
                        },
                        {
                                    "id": "D",
                                    "text": "2/4",
                                    "explanationIfWrong": "String representation is Fraction(1, 2) or '1/2'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Fraction automatically simplifies rational fractions to their lowest terms (1/2)."
},
          {
            "id": "q-7.6-0-v2",
            "question": "What is the primary benefit of Fraction over standard float?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It performs exact arithmetic without floating-point precision loss (e.g. 1/3 + 1/3 + 1/3 is exactly 1)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It uses 10x less RAM than float",
                                    "explanationIfWrong": "Fraction stores two integers, using slightly more memory for exactness."
                        },
                        {
                                    "id": "C",
                                    "text": "It is implemented in GPU shaders",
                                    "explanationIfWrong": "Fraction is part of the standard Python library."
                        },
                        {
                                    "id": "D",
                                    "text": "It can divide by zero safely",
                                    "explanationIfWrong": "Division by zero raises ZeroDivisionError in Fraction too."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Fraction retains exact rational representations, preventing float rounding errors."
},
          {
            "id": "q-7.6-0-v3",
            "question": "Can you multiply a Fraction with an int, e.g. Fraction(3, 4) * 2?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, yielding Fraction(3, 2)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, both operands must be Fractions",
                                    "explanationIfWrong": "Fraction seamlessly interoperates with integers."
                        },
                        {
                                    "id": "C",
                                    "text": "It converts to float 1.5",
                                    "explanationIfWrong": "It produces a Fraction result."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Integer multiplication is supported."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Fraction(3, 4) * 2 = Fraction(6, 4), which simplifies to Fraction(3, 2)."
}
        ]
      },
      {
        "heading": "Financial Calculations with decimal.Decimal",
        "text": "In financial and accounting software, floating-point inaccuracies like 0.1 + 0.2 = 0.30000000000000004 are unacceptable. The decimal module provides the Decimal class for exact fixed-point arithmetic.",
        "codeSnippet": "from decimal import Decimal\n\n# Standard float problem:\nprint(f\"Float 0.1 + 0.2 = {0.1 + 0.2}\")\n\n# Exact Decimal math:\nd1 = Decimal(\"0.1\")\nd2 = Decimal(\"0.2\")\nprint(f\"Decimal 0.1 + 0.2 = {d1 + d2}\")",
        "terminalOutput": "Float 0.1 + 0.2 = 0.30000000000000004\nDecimal 0.1 + 0.2 = 0.3",
        "warning": "Always initialize Decimal with strings, e.g. Decimal(\"0.1\"). Initializing with float Decimal(0.1) preserves the float's precision error!",
        "mcq": {
          "id": "q-7.6-1-v1",
          "question": "Why should you pass strings to Decimal, e.g. Decimal('0.1') instead of Decimal(0.1)?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because passing float 0.1 introduces the existing binary floating-point representation error before Decimal is created",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because Decimal rejects numbers with a TypeError",
                              "explanationIfWrong": "Decimal accepts floats, but inherits their inaccuracy."
                    },
                    {
                              "id": "C",
                              "text": "Because Decimal only stores text",
                              "explanationIfWrong": "Decimal parses exact digits from the string."
                    },
                    {
                              "id": "D",
                              "text": "String literals run 10x faster",
                              "explanationIfWrong": "Passing strings guarantees exactness."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Passing a string allows Decimal to parse the exact decimal digits without binary float corruption."
},
        "retestMcq": {
          "id": "q-7.6-1-v2",
          "question": "Which industry standard demands Decimal over binary float?",
          "options": [
                    {
                              "id": "A",
                              "text": "Banking, financial transactions, tax calculations, and billing systems",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Video game 3D physics rendering",
                              "explanationIfWrong": "Video games prioritize fast hardware floats over exact decimal cents."
                    },
                    {
                              "id": "C",
                              "text": "Machine learning tensor math",
                              "explanationIfWrong": "Machine learning uses 16-bit and 32-bit floats for speed."
                    },
                    {
                              "id": "D",
                              "text": "Audio compression",
                              "explanationIfWrong": "Financial systems require exact penny/cent precision."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Financial accounting mandates exact decimal arithmetic to prevent accumulated rounding discrepancies."
},
        "questionPool": [
          {
            "id": "q-7.6-1-v1",
            "question": "Why should you pass strings to Decimal, e.g. Decimal('0.1') instead of Decimal(0.1)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because passing float 0.1 introduces the existing binary floating-point representation error before Decimal is created",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because Decimal rejects numbers with a TypeError",
                                    "explanationIfWrong": "Decimal accepts floats, but inherits their inaccuracy."
                        },
                        {
                                    "id": "C",
                                    "text": "Because Decimal only stores text",
                                    "explanationIfWrong": "Decimal parses exact digits from the string."
                        },
                        {
                                    "id": "D",
                                    "text": "String literals run 10x faster",
                                    "explanationIfWrong": "Passing strings guarantees exactness."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing a string allows Decimal to parse the exact decimal digits without binary float corruption."
},
          {
            "id": "q-7.6-1-v2",
            "question": "Which industry standard demands Decimal over binary float?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Banking, financial transactions, tax calculations, and billing systems",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Video game 3D physics rendering",
                                    "explanationIfWrong": "Video games prioritize fast hardware floats over exact decimal cents."
                        },
                        {
                                    "id": "C",
                                    "text": "Machine learning tensor math",
                                    "explanationIfWrong": "Machine learning uses 16-bit and 32-bit floats for speed."
                        },
                        {
                                    "id": "D",
                                    "text": "Audio compression",
                                    "explanationIfWrong": "Financial systems require exact penny/cent precision."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Financial accounting mandates exact decimal arithmetic to prevent accumulated rounding discrepancies."
},
          {
            "id": "q-7.6-1-v3",
            "question": "What is the result of Decimal('10') / Decimal('3') in standard Python precision?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Decimal('3.333333333333333333333333333') (28 decimal places by default)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3.3333333333333335",
                                    "explanationIfWrong": "Decimal uses 28 decimal digits of precision by default, not 15."
                        },
                        {
                                    "id": "C",
                                    "text": "3",
                                    "explanationIfWrong": "Division / produces decimal division."
                        },
                        {
                                    "id": "D",
                                    "text": "Decimal('3')",
                                    "explanationIfWrong": "Decimal preserves fractional precision."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's decimal context defaults to 28 digits of decimal precision."
}
        ]
      },
      {
        "heading": "Parallel Iteration with zip()",
        "text": "The zip(*iterables) function pairs elements from multiple collections index-by-index, returning an iterator of tuples. Iteration stops as soon as the shortest input sequence is exhausted.",
        "codeSnippet": "names = [\"Alice\", \"Bob\", \"Charlie\"]\nscores = [95, 88, 76]\ngrades = [\"A\", \"B\", \"C\"]\n\nfor name, score, grade in zip(names, scores, grades):\n    print(f\"{name}: {score} ({grade})\")",
        "terminalOutput": "Alice: 95 (A)\nBob: 88 (B)\nCharlie: 76 (C)",
        "tip": "To iterate until the longest sequence completes, use itertools.zip_longest(..., fillvalue=None).",
        "mcq": {
          "id": "q-7.6-2-v1",
          "question": "What is list(zip(['a', 'b'], [1, 2])) in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "[('a', 1), ('b', 2)]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "['a', 1, 'b', 2]",
                              "explanationIfWrong": "zip pairs elements into tuples."
                    },
                    {
                              "id": "C",
                              "text": "{'a': 1, 'b': 2}",
                              "explanationIfWrong": "zip returns an iterator of tuples; dict(zip(...)) produces a dictionary."
                    },
                    {
                              "id": "D",
                              "text": "[['a', 'b'], [1, 2]]",
                              "explanationIfWrong": "zip pairs matching indices together."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "zip pairs corresponding items by position into 2-tuples: [('a', 1), ('b', 2)]."
},
        "retestMcq": {
          "id": "q-7.6-2-v2",
          "question": "What happens when zip() is called on two lists of different lengths, e.g. [1, 2, 3] and ['a', 'b']?",
          "options": [
                    {
                              "id": "A",
                              "text": "It stops pairing when the shortest list runs out, yielding 2 pairs: (1, 'a') and (2, 'b')",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It raises a ValueError: length mismatch",
                              "explanationIfWrong": "Default zip stops at the shortest length without error (use strict=True in 3.10+ to enforce equal length)."
                    },
                    {
                              "id": "C",
                              "text": "It pads the second list with None",
                              "explanationIfWrong": "Padding requires itertools.zip_longest."
                    },
                    {
                              "id": "D",
                              "text": "It only pairs the last item",
                              "explanationIfWrong": "It pairs from the start until the shortest list ends."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "By default, zip stops as soon as the shortest iterable is exhausted."
},
        "questionPool": [
          {
            "id": "q-7.6-2-v1",
            "question": "What is list(zip(['a', 'b'], [1, 2])) in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[('a', 1), ('b', 2)]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "['a', 1, 'b', 2]",
                                    "explanationIfWrong": "zip pairs elements into tuples."
                        },
                        {
                                    "id": "C",
                                    "text": "{'a': 1, 'b': 2}",
                                    "explanationIfWrong": "zip returns an iterator of tuples; dict(zip(...)) produces a dictionary."
                        },
                        {
                                    "id": "D",
                                    "text": "[['a', 'b'], [1, 2]]",
                                    "explanationIfWrong": "zip pairs matching indices together."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "zip pairs corresponding items by position into 2-tuples: [('a', 1), ('b', 2)]."
},
          {
            "id": "q-7.6-2-v2",
            "question": "What happens when zip() is called on two lists of different lengths, e.g. [1, 2, 3] and ['a', 'b']?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It stops pairing when the shortest list runs out, yielding 2 pairs: (1, 'a') and (2, 'b')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It raises a ValueError: length mismatch",
                                    "explanationIfWrong": "Default zip stops at the shortest length without error (use strict=True in 3.10+ to enforce equal length)."
                        },
                        {
                                    "id": "C",
                                    "text": "It pads the second list with None",
                                    "explanationIfWrong": "Padding requires itertools.zip_longest."
                        },
                        {
                                    "id": "D",
                                    "text": "It only pairs the last item",
                                    "explanationIfWrong": "It pairs from the start until the shortest list ends."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "By default, zip stops as soon as the shortest iterable is exhausted."
},
          {
            "id": "q-7.6-2-v3",
            "question": "How do you create a dictionary mapping keys = ['x', 'y'] to values = [10, 20] in one step?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "dict(zip(keys, values))",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "{keys: values}",
                                    "explanationIfWrong": "This attempts to make the entire list a key, which raises a TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "zip.to_dict(keys, values)",
                                    "explanationIfWrong": "The standard idiom is dict(zip(keys, values))."
                        },
                        {
                                    "id": "D",
                                    "text": "dict.from_lists(keys, values)",
                                    "explanationIfWrong": "dict(zip(...)) is standard Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing zip's pairs of (key, value) into dict() builds the dictionary directly."
}
        ]
      },
      {
        "heading": "Checking Conditions: any() and all()",
        "text": "The built-in any(iterable) function returns True if at least one element in the iterable is True. The all(iterable) function returns True only if every single element is True.",
        "codeSnippet": "scores = [85, 92, 78, 90]\n\n# Did anyone score 90 or higher?\nprint(any(s >= 90 for s in scores))  # True\n\n# Did everyone pass (score >= 50)?\nprint(all(s >= 50 for s in scores))  # True",
        "terminalOutput": "True\nTrue",
        "tip": "any() and all() short-circuit: any() stops evaluation as soon as the first True is found; all() stops on the first False.",
        "mcq": {
          "id": "q-7.6-3-v1",
          "question": "What is the return value of any([False, False, True, False])?",
          "options": [
                    {
                              "id": "A",
                              "text": "True",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "False",
                              "explanationIfWrong": "any() returns True if at least one item is True."
                    },
                    {
                              "id": "C",
                              "text": "None",
                              "explanationIfWrong": "any() returns a boolean."
                    },
                    {
                              "id": "D",
                              "text": "2",
                              "explanationIfWrong": "It returns True, not an index."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because one element is True, any() returns True."
},
        "retestMcq": {
          "id": "q-7.6-3-v2",
          "question": "What does all([True, True, False]) evaluate to?",
          "options": [
                    {
                              "id": "A",
                              "text": "False",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "True",
                              "explanationIfWrong": "all() requires every element to be True; the False causes it to return False."
                    },
                    {
                              "id": "C",
                              "text": "2",
                              "explanationIfWrong": "all() returns a boolean."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "It returns False."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since not all elements are True, all() evaluates to False."
},
        "questionPool": [
          {
            "id": "q-7.6-3-v1",
            "question": "What is the return value of any([False, False, True, False])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "True",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "False",
                                    "explanationIfWrong": "any() returns True if at least one item is True."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "any() returns a boolean."
                        },
                        {
                                    "id": "D",
                                    "text": "2",
                                    "explanationIfWrong": "It returns True, not an index."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because one element is True, any() returns True."
},
          {
            "id": "q-7.6-3-v2",
            "question": "What does all([True, True, False]) evaluate to?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "False",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "True",
                                    "explanationIfWrong": "all() requires every element to be True; the False causes it to return False."
                        },
                        {
                                    "id": "C",
                                    "text": "2",
                                    "explanationIfWrong": "all() returns a boolean."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "It returns False."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since not all elements are True, all() evaluates to False."
},
          {
            "id": "q-7.6-3-v3",
            "question": "What does all([]) evaluate to for an empty collection in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "True (vacuous truth: no element in the collection is False)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "False",
                                    "explanationIfWrong": "By mathematical convention (vacuous truth), all([]) is True."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "It returns True."
                        },
                        {
                                    "id": "D",
                                    "text": "ValueError",
                                    "explanationIfWrong": "all([]) is valid and evaluates to True."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In formal logic and Python, all on an empty collection is vacuously True (any([]) is False)."
}
        ]
      },
      {
        "heading": "Character Constants in the string Module",
        "text": "The string module contains pre-defined constant strings containing various character sets. These constants save time and prevent typos when validating passwords, usernames, or identifiers.",
        "codeSnippet": "import string\n\nprint(f\"Letters: {string.ascii_letters}\")\nprint(f\"Digits: {string.digits}\")\nprint(f\"Punctuation: {string.punctuation}\")\n\ndef is_strong_password(pwd):\n    has_upper = any(c in string.ascii_uppercase for c in pwd)\n    has_digit = any(c in string.digits for c in pwd)\n    return has_upper and has_digit and len(pwd) >= 8",
        "terminalOutput": "Letters: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\nDigits: 0123456789\nPunctuation: !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
        "mcq": {
          "id": "q-7.6-4-v1",
          "question": "What does string.ascii_letters contain?",
          "options": [
                    {
                              "id": "A",
                              "text": "All 52 ASCII letters (both lowercase a-z and uppercase A-Z)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Only lowercase letters a-z",
                              "explanationIfWrong": "Lowercase only is string.ascii_lowercase."
                    },
                    {
                              "id": "C",
                              "text": "Only uppercase letters A-Z",
                              "explanationIfWrong": "Uppercase only is string.ascii_uppercase."
                    },
                    {
                              "id": "D",
                              "text": "All letters including accented letters like \u00e4 and \u00f6",
                              "explanationIfWrong": "string.ascii_letters contains only the standard 52 ASCII characters."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "string.ascii_letters is the concatenation of ascii_lowercase and ascii_uppercase (52 letters)."
},
        "retestMcq": {
          "id": "q-7.6-4-v2",
          "question": "How can you check if a character ch is a standard ASCII punctuation mark?",
          "options": [
                    {
                              "id": "A",
                              "text": "ch in string.punctuation",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "ch.is_punct()",
                              "explanationIfWrong": "There is no is_punct method on Python strings."
                    },
                    {
                              "id": "C",
                              "text": "string.is_punctuation(ch)",
                              "explanationIfWrong": "Use the membership check ch in string.punctuation."
                    },
                    {
                              "id": "D",
                              "text": "ch == '!' or ch == '?'",
                              "explanationIfWrong": "string.punctuation includes all 32 standard punctuation symbols."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "string.punctuation contains all printable ASCII punctuation marks."
},
        "questionPool": [
          {
            "id": "q-7.6-4-v1",
            "question": "What does string.ascii_letters contain?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "All 52 ASCII letters (both lowercase a-z and uppercase A-Z)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Only lowercase letters a-z",
                                    "explanationIfWrong": "Lowercase only is string.ascii_lowercase."
                        },
                        {
                                    "id": "C",
                                    "text": "Only uppercase letters A-Z",
                                    "explanationIfWrong": "Uppercase only is string.ascii_uppercase."
                        },
                        {
                                    "id": "D",
                                    "text": "All letters including accented letters like \u00e4 and \u00f6",
                                    "explanationIfWrong": "string.ascii_letters contains only the standard 52 ASCII characters."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "string.ascii_letters is the concatenation of ascii_lowercase and ascii_uppercase (52 letters)."
},
          {
            "id": "q-7.6-4-v2",
            "question": "How can you check if a character ch is a standard ASCII punctuation mark?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ch in string.punctuation",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ch.is_punct()",
                                    "explanationIfWrong": "There is no is_punct method on Python strings."
                        },
                        {
                                    "id": "C",
                                    "text": "string.is_punctuation(ch)",
                                    "explanationIfWrong": "Use the membership check ch in string.punctuation."
                        },
                        {
                                    "id": "D",
                                    "text": "ch == '!' or ch == '?'",
                                    "explanationIfWrong": "string.punctuation includes all 32 standard punctuation symbols."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "string.punctuation contains all printable ASCII punctuation marks."
},
          {
            "id": "q-7.6-4-v3",
            "question": "What does string.whitespace include?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Space, tab (\\t), newline (\\n), carriage return (\\r), formfeed, and vertical tab",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Only the standard space character ' '",
                                    "explanationIfWrong": "It includes all ASCII whitespace characters."
                        },
                        {
                                    "id": "C",
                                    "text": "Empty strings \"\"",
                                    "explanationIfWrong": "It contains actual whitespace characters."
                        },
                        {
                                    "id": "D",
                                    "text": "Null byte \\0",
                                    "explanationIfWrong": "Null byte is not considered whitespace."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "string.whitespace contains all characters considered whitespace in ASCII."
}
        ]
      },
      {
        "heading": "Reflecting on Stage 1 Mastery",
        "text": "Congratulations on completing Part 7! You have mastered the entire Python Programming MOOC Core Introduction (Parts 1\u20137): from variables, conditionals, loops, functions, lists, and matrices, to references, dictionaries, file I/O, error handling, modules, and modern idioms.",
        "codeSnippet": "# Full Stage 1 Foundations Complete!\nskills = [\n    \"Syntax & Control Flow (Parts 1-3)\",\n    \"Functions & Data Structures (Parts 4-5)\",\n    \"Files, Errors & Modules (Parts 6-7)\"\n]\nfor part, skill in enumerate(skills, start=1):\n    print(f\"Milestone {part}: {skill}\")",
        "terminalOutput": "Milestone 1: Syntax & Control Flow (Parts 1-3)\nMilestone 2: Functions & Data Structures (Parts 4-5)\nMilestone 3: Files, Errors & Modules (Parts 6-7)",
        "mcq": {
          "id": "q-7.6-5-v1",
          "question": "What major milestone does Part 7 represent in the University of Helsinki Python curriculum?",
          "options": [
                    {
                              "id": "A",
                              "text": "Completion of the entire 'Introduction to Programming' sequence (Parts 1 to 7), preparing you for Stage 2: Object-Oriented Programming",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The end of all Python learning",
                              "explanationIfWrong": "Stage 2 (Parts 8-14) introduces OOP, classes, inheritance, and advanced architecture."
                    },
                    {
                              "id": "C",
                              "text": "Only basic math operations",
                              "explanationIfWrong": "Parts 1-7 form the complete foundations of programming."
                    },
                    {
                              "id": "D",
                              "text": "A beginner syntax test only",
                              "explanationIfWrong": "It is the foundational credential sequence."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Part 7 concludes the comprehensive Introduction to Programming (Parts 1-7) curriculum."
},
        "retestMcq": {
          "id": "q-7.6-5-v2",
          "question": "What is the core focus of the next module (Part 8)?",
          "options": [
                    {
                              "id": "A",
                              "text": "Object-Oriented Programming (OOP): Classes, Objects, Methods, and Constructors (__init__)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Installing Windows 11",
                              "explanationIfWrong": "Part 8 teaches Object-Oriented Programming."
                    },
                    {
                              "id": "C",
                              "text": "HTML and CSS basics",
                              "explanationIfWrong": "Part 8 focuses on Python classes and objects."
                    },
                    {
                              "id": "D",
                              "text": "Basic while loops",
                              "explanationIfWrong": "While loops were mastered in Parts 2 and 3."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Part 8 kicks off Stage 2 with Classes, Objects, and Object-Oriented design."
},
        "questionPool": [
          {
            "id": "q-7.6-5-v1",
            "question": "What major milestone does Part 7 represent in the University of Helsinki Python curriculum?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Completion of the entire 'Introduction to Programming' sequence (Parts 1 to 7), preparing you for Stage 2: Object-Oriented Programming",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The end of all Python learning",
                                    "explanationIfWrong": "Stage 2 (Parts 8-14) introduces OOP, classes, inheritance, and advanced architecture."
                        },
                        {
                                    "id": "C",
                                    "text": "Only basic math operations",
                                    "explanationIfWrong": "Parts 1-7 form the complete foundations of programming."
                        },
                        {
                                    "id": "D",
                                    "text": "A beginner syntax test only",
                                    "explanationIfWrong": "It is the foundational credential sequence."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Part 7 concludes the comprehensive Introduction to Programming (Parts 1-7) curriculum."
},
          {
            "id": "q-7.6-5-v2",
            "question": "What is the core focus of the next module (Part 8)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Object-Oriented Programming (OOP): Classes, Objects, Methods, and Constructors (__init__)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Installing Windows 11",
                                    "explanationIfWrong": "Part 8 teaches Object-Oriented Programming."
                        },
                        {
                                    "id": "C",
                                    "text": "HTML and CSS basics",
                                    "explanationIfWrong": "Part 8 focuses on Python classes and objects."
                        },
                        {
                                    "id": "D",
                                    "text": "Basic while loops",
                                    "explanationIfWrong": "While loops were mastered in Parts 2 and 3."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Part 8 kicks off Stage 2 with Classes, Objects, and Object-Oriented design."
},
          {
            "id": "q-7.6-5-v3",
            "question": "Which programming paradigm organizes code into reusable blueprints (classes) encapsulating state (attributes) and behavior (methods)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Object-Oriented Programming (OOP)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Assembly Programming",
                                    "explanationIfWrong": "Assembly is low-level machine instruction."
                        },
                        {
                                    "id": "C",
                                    "text": "Linear Scripting",
                                    "explanationIfWrong": "Classes and objects define OOP."
                        },
                        {
                                    "id": "D",
                                    "text": "Monolithic Coding",
                                    "explanationIfWrong": "OOP is the paradigm based on classes and objects."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Object-Oriented Programming structures programs around classes and objects."
}
        ]
      }
    ]
  }
];


// Function to get active questions for a level
// Supports dynamic variant rotation (v1, v2, v3) without duplicate repeat
export const getActiveQuestionsForLevelPart7 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part7_question_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part7_active_questions_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 7
export const getConsecutiveFailuresPart7 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part7_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart7 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part7_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart7 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part7_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart7 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part7_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart7 = (
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
  const currentAttempt = getLevelAttemptCountPart7(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part7_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part7_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part7_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part7_locked_${studentId}`);
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
      setLevelAttemptCountPart7(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart7(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart7(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part7_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part7_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part7_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart7 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part7_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part7_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part7_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part7_locked_progression_${studentId}`);
  } catch {}
};
