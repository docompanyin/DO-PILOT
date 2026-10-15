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

export const PART_8_SECTIONS: SectionContent[] = [
  {
    "id": "8-1-objects-and-methods",
    "number": "8.1",
    "title": "Objects & Methods",
    "subtitle": "Discover how Python models data as objects with types, identities, and callable methods via dot notation.",
    "readTime": "20 min",
    "objectives": [
      "Understand that everything in Python is an object with type, id, and value",
      "Inspect types using type() and unique memory addresses using id()",
      "Call methods on built-in objects using dot notation (object.method())",
      "Distinguish between standalone functions and object-bound methods",
      "Contrast non-mutating string methods with mutating list methods",
      "Explore object capabilities interactively using dir() and help()"
    ],
    "theoryBlocks": [
      {
        "heading": "Everything in Python is an Object",
        "text": "In Python, every piece of data \u2014 numbers, strings, lists, dictionaries, and even functions themselves \u2014 is an object. Each object possesses three fundamental properties: an identity (a unique integer representing its memory address, returned by id()), a type (defining what kind of data it represents and what operations it supports, returned by type()), and a value (the actual content stored inside it).",
        "codeSnippet": "x = 42\ntext = \"hello\"\nnumbers = [1, 2, 3]\n\nprint(type(x))         # <class 'int'>\nprint(type(text))      # <class 'str'>\nprint(type(numbers))   # <class 'list'>\nprint(isinstance(text, str)) # True",
        "terminalOutput": "<class 'int'>\n<class 'str'>\n<class 'list'>\nTrue",
        "tip": "Since types in Python are classes, writing text = 'hello' actually creates an instance of the built-in str class.",
        "mcq": {
          "id": "q-8-1-objects-and-methods-0-v1",
          "question": "What are the three fundamental attributes possessed by every object in Python?",
          "options": [
            {
              "id": "A",
              "text": "Identity, type, and value",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Name, scope, and visibility",
              "explanationIfWrong": "Names are identifiers pointing to objects, not properties of the objects themselves."
            },
            {
              "id": "C",
              "text": "Pointer, size, and address",
              "explanationIfWrong": "These are low-level C concepts, not the Python object model."
            },
            {
              "id": "D",
              "text": "Key, index, and hash",
              "explanationIfWrong": "These apply only to specific mapping or container types."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Every Python object has an identity (id()), a type (type()), and a value."
        },
        "retestMcq": {
          "id": "q-8-1-objects-and-methods-0-v2",
          "question": "What does the built-in function id(obj) return in standard CPython?",
          "options": [
            {
              "id": "A",
              "text": "A unique integer representing the memory address of the object",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The length of the object in bytes",
              "explanationIfWrong": "sys.getsizeof() returns the size in bytes."
            },
            {
              "id": "C",
              "text": "The variable name assigned to the object",
              "explanationIfWrong": "Objects do not know the variable names that point to them."
            },
            {
              "id": "D",
              "text": "A random UUID generated at script startup",
              "explanationIfWrong": "id() returns the actual memory address in CPython."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In CPython, id(x) returns the memory location where object x resides."
        },
        "questionPool": [
          {
            "id": "q-8-1-objects-and-methods-0-v1",
            "question": "What are the three fundamental attributes possessed by every object in Python?",
            "options": [
              {
                "id": "A",
                "text": "Identity, type, and value",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Name, scope, and visibility",
                "explanationIfWrong": "Names are identifiers pointing to objects, not properties of the objects themselves."
              },
              {
                "id": "C",
                "text": "Pointer, size, and address",
                "explanationIfWrong": "These are low-level C concepts, not the Python object model."
              },
              {
                "id": "D",
                "text": "Key, index, and hash",
                "explanationIfWrong": "These apply only to specific mapping or container types."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Every Python object has an identity (id()), a type (type()), and a value."
          },
          {
            "id": "q-8-1-objects-and-methods-0-v2",
            "question": "What does the built-in function id(obj) return in standard CPython?",
            "options": [
              {
                "id": "A",
                "text": "A unique integer representing the memory address of the object",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The length of the object in bytes",
                "explanationIfWrong": "sys.getsizeof() returns the size in bytes."
              },
              {
                "id": "C",
                "text": "The variable name assigned to the object",
                "explanationIfWrong": "Objects do not know the variable names that point to them."
              },
              {
                "id": "D",
                "text": "A random UUID generated at script startup",
                "explanationIfWrong": "id() returns the actual memory address in CPython."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In CPython, id(x) returns the memory location where object x resides."
          },
          {
            "id": "q-8-1-objects-and-methods-0-v3",
            "question": "What is returned by isinstance(42, int)?",
            "options": [
              {
                "id": "A",
                "text": "True",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "42 is an instance of the int class."
              },
              {
                "id": "C",
                "text": "<class 'int'>",
                "explanationIfWrong": "type(42) returns the class, isinstance returns a boolean."
              },
              {
                "id": "D",
                "text": "1",
                "explanationIfWrong": "isinstance returns a boolean True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "isinstance(object, classinfo) returns True if the object is an instance of that class."
          }
        ]
      },
      {
        "heading": "Calling Methods with Dot Notation",
        "text": "A method is a function that belongs to a specific object. Unlike standalone functions which are called by passing arguments (e.g. print(x)), methods are called directly on an object using dot notation: object.method_name(arguments). The object preceding the dot is automatically the receiver on which the method operates.",
        "codeSnippet": "greeting = \"  python programming  \"\nclean = greeting.strip().title()\nprint(clean)\n\nwords = clean.split()\nprint(words)\nprint(\"-\".join(words))",
        "terminalOutput": "Python Programming\n['Python', 'Programming']\nPython-Programming",
        "tip": "Methods can be chained sequentially as long as each method returns an object that supports the next method call in the chain.",
        "mcq": {
          "id": "q-8-1-objects-and-methods-1-v1",
          "question": "In the expression word.upper(), what role does word play?",
          "options": [
            {
              "id": "A",
              "text": "The target object (receiver) on which the method is invoked",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A parameter passed into a global function",
              "explanationIfWrong": "word precedes the dot, so it is the object calling the method."
            },
            {
              "id": "C",
              "text": "A module containing the upper definition",
              "explanationIfWrong": "word is an instance of str, not a module."
            },
            {
              "id": "D",
              "text": "A class definition defining upper",
              "explanationIfWrong": "word is an instance, not the class definition."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In object.method(), object is the receiver instance upon which the method acts."
        },
        "retestMcq": {
          "id": "q-8-1-objects-and-methods-1-v2",
          "question": "What will \"apple,banana,cherry\".split(\",\") return?",
          "options": [
            {
              "id": "A",
              "text": "['apple', 'banana', 'cherry']",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "('apple', 'banana', 'cherry')",
              "explanationIfWrong": "split() returns a list, not a tuple."
            },
            {
              "id": "C",
              "text": "\"apple banana cherry\"",
              "explanationIfWrong": "split() breaks a string into a list of substrings."
            },
            {
              "id": "D",
              "text": "{'apple', 'banana', 'cherry'}",
              "explanationIfWrong": "split() returns a list, not a set."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "str.split(separator) returns a list of substrings split at each occurrence of the separator."
        },
        "questionPool": [
          {
            "id": "q-8-1-objects-and-methods-1-v1",
            "question": "In the expression word.upper(), what role does word play?",
            "options": [
              {
                "id": "A",
                "text": "The target object (receiver) on which the method is invoked",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A parameter passed into a global function",
                "explanationIfWrong": "word precedes the dot, so it is the object calling the method."
              },
              {
                "id": "C",
                "text": "A module containing the upper definition",
                "explanationIfWrong": "word is an instance of str, not a module."
              },
              {
                "id": "D",
                "text": "A class definition defining upper",
                "explanationIfWrong": "word is an instance, not the class definition."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In object.method(), object is the receiver instance upon which the method acts."
          },
          {
            "id": "q-8-1-objects-and-methods-1-v2",
            "question": "What will \"apple,banana,cherry\".split(\",\") return?",
            "options": [
              {
                "id": "A",
                "text": "['apple', 'banana', 'cherry']",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "('apple', 'banana', 'cherry')",
                "explanationIfWrong": "split() returns a list, not a tuple."
              },
              {
                "id": "C",
                "text": "\"apple banana cherry\"",
                "explanationIfWrong": "split() breaks a string into a list of substrings."
              },
              {
                "id": "D",
                "text": "{'apple', 'banana', 'cherry'}",
                "explanationIfWrong": "split() returns a list, not a set."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "str.split(separator) returns a list of substrings split at each occurrence of the separator."
          },
          {
            "id": "q-8-1-objects-and-methods-1-v3",
            "question": "What happens when chaining methods like \" hello \".strip().upper()?",
            "options": [
              {
                "id": "A",
                "text": "strip() produces a new string 'hello', on which upper() is then invoked to produce 'HELLO'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It causes a SyntaxError because only one method can be called per line",
                "explanationIfWrong": "Method chaining is completely valid in Python."
              },
              {
                "id": "C",
                "text": "Both methods execute in reverse order from right to left",
                "explanationIfWrong": "Expressions evaluate left-to-right."
              },
              {
                "id": "D",
                "text": "The original string is mutated in place twice",
                "explanationIfWrong": "Strings are immutable; new string objects are returned."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Method chaining passes the result of the left method call as the target of the right method call."
          }
        ]
      },
      {
        "heading": "Methods vs Standalone Functions",
        "text": "A standalone function is defined independently in global or module scope and called with arguments, such as len(my_list), max(1, 5), or round(3.1415, 2). A method, by contrast, is defined inside a class and intimately bound to the object that invokes it. For example, len(items) is a global built-in function, while items.count(5) is an instance method of the list class.",
        "codeSnippet": "data = [10, 20, 30, 20, 40, 20]\n\n# Standalone functions: pass object as argument\ntotal_items = len(data)\nhighest = max(data)\n\n# Instance methods: called on the object\noccurrences = data.count(20)\nidx = data.index(30)\n\nprint(f\"Len: {total_items}, Max: {highest}\")\nprint(f\"20 appears {occurrences} times; 30 is at index {idx}\")",
        "terminalOutput": "Len: 6, Max: 70\n20 appears 3 times; 30 is at index 2",
        "tip": "Python often uses functions (len(), sum(), sorted()) for generic protocols across multiple data structures, and methods for type-specific behaviors.",
        "mcq": {
          "id": "q-8-1-objects-and-methods-2-v1",
          "question": "What is the structural difference between len(data) and data.count(x)?",
          "options": [
            {
              "id": "A",
              "text": "len() is a standalone built-in function taking an argument; data.count() is an instance method called on the data object",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "len() is only for numbers while count() is only for lists",
              "explanationIfWrong": "len() works on all collections including strings, dicts, tuples."
            },
            {
              "id": "C",
              "text": "data.count() can only run inside a class definition",
              "explanationIfWrong": "Instance methods can be called anywhere an instance exists."
            },
            {
              "id": "D",
              "text": "len() mutates the list while data.count() does not",
              "explanationIfWrong": "Neither len() nor count() mutates the list."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Functions take arguments like func(arg); methods belong to an object and are called like obj.method()."
        },
        "retestMcq": {
          "id": "q-8-1-objects-and-methods-2-v2",
          "question": "Which of the following is a standalone function rather than an instance method?",
          "options": [
            {
              "id": "A",
              "text": "sorted(items)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "items.sort()",
              "explanationIfWrong": "items.sort() is an instance method."
            },
            {
              "id": "C",
              "text": "text.upper()",
              "explanationIfWrong": "text.upper() is an instance method."
            },
            {
              "id": "D",
              "text": "items.append(5)",
              "explanationIfWrong": "items.append() is an instance method."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "sorted() is a global built-in function that accepts an iterable and returns a new sorted list."
        },
        "questionPool": [
          {
            "id": "q-8-1-objects-and-methods-2-v1",
            "question": "What is the structural difference between len(data) and data.count(x)?",
            "options": [
              {
                "id": "A",
                "text": "len() is a standalone built-in function taking an argument; data.count() is an instance method called on the data object",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "len() is only for numbers while count() is only for lists",
                "explanationIfWrong": "len() works on all collections including strings, dicts, tuples."
              },
              {
                "id": "C",
                "text": "data.count() can only run inside a class definition",
                "explanationIfWrong": "Instance methods can be called anywhere an instance exists."
              },
              {
                "id": "D",
                "text": "len() mutates the list while data.count() does not",
                "explanationIfWrong": "Neither len() nor count() mutates the list."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Functions take arguments like func(arg); methods belong to an object and are called like obj.method()."
          },
          {
            "id": "q-8-1-objects-and-methods-2-v2",
            "question": "Which of the following is a standalone function rather than an instance method?",
            "options": [
              {
                "id": "A",
                "text": "sorted(items)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "items.sort()",
                "explanationIfWrong": "items.sort() is an instance method."
              },
              {
                "id": "C",
                "text": "text.upper()",
                "explanationIfWrong": "text.upper() is an instance method."
              },
              {
                "id": "D",
                "text": "items.append(5)",
                "explanationIfWrong": "items.append() is an instance method."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "sorted() is a global built-in function that accepts an iterable and returns a new sorted list."
          },
          {
            "id": "q-8-1-objects-and-methods-2-v3",
            "question": "What does data.index(val) do when val is not present in data?",
            "options": [
              {
                "id": "A",
                "text": "Raises a ValueError",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Returns -1",
                "explanationIfWrong": "str.find() returns -1, but list.index() raises ValueError."
              },
              {
                "id": "C",
                "text": "Returns None",
                "explanationIfWrong": "list.index() raises ValueError on missing items."
              },
              {
                "id": "D",
                "text": "Appends val to the list",
                "explanationIfWrong": "index() only performs lookups."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python lists, calling list.index(x) when x is absent raises a ValueError."
          }
        ]
      },
      {
        "heading": "Non-Mutating Methods on Immutable Objects",
        "text": "Strings, integers, floats, and tuples are immutable in Python \u2014 once created, their internal content cannot be modified. Therefore, any method called on an immutable object that appears to alter it (such as replace(), upper(), or strip()) actually constructs and returns a brand-new object, leaving the original object completely unchanged.",
        "codeSnippet": "original = \"  antigravity  \"\n# Calling a method without capturing its return value\noriginal.strip()\nprint(f\"After strip without assignment: '{original}'\")\n\n# Must capture the returned new string\ncleaned = original.strip()\nprint(f\"Original: '{original}'\")\nprint(f\"Cleaned:  '{cleaned}'\")",
        "terminalOutput": "After strip without assignment: '  antigravity  '\nOriginal: '  antigravity  '\nCleaned:  'antigravity'",
        "tip": "Beginner mistake: calling text.replace('a', 'b') without reassigning text = text.replace('a', 'b'). Remember strings cannot be mutated in place.",
        "mcq": {
          "id": "q-8-1-objects-and-methods-3-v1",
          "question": "Given s = 'hello', what does s.upper() do to the variable s?",
          "options": [
            {
              "id": "A",
              "text": "Leaves s completely unchanged ('hello') and returns a new string 'HELLO'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Modifies s in place so that s becomes 'HELLO'",
              "explanationIfWrong": "Strings are immutable; methods cannot modify them in place."
            },
            {
              "id": "C",
              "text": "Deletes s from memory",
              "explanationIfWrong": "s remains intact."
            },
            {
              "id": "D",
              "text": "Raises an ImmutableError",
              "explanationIfWrong": "Calling methods on strings does not raise errors; it returns new strings."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because strings are immutable, methods return a new string rather than modifying the existing one."
        },
        "retestMcq": {
          "id": "q-8-1-objects-and-methods-3-v2",
          "question": "What is the output of:\ns = \"python\"\ns.replace(\"p\", \"j\")\nprint(s)",
          "options": [
            {
              "id": "A",
              "text": "python",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "jython",
              "explanationIfWrong": "The return value of replace() was not assigned back to s."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "s still holds 'python'."
            },
            {
              "id": "D",
              "text": "Error",
              "explanationIfWrong": "No error occurs; the returned string is simply discarded."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The result of s.replace() was discarded because it was not assigned to a variable."
        },
        "questionPool": [
          {
            "id": "q-8-1-objects-and-methods-3-v1",
            "question": "Given s = 'hello', what does s.upper() do to the variable s?",
            "options": [
              {
                "id": "A",
                "text": "Leaves s completely unchanged ('hello') and returns a new string 'HELLO'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Modifies s in place so that s becomes 'HELLO'",
                "explanationIfWrong": "Strings are immutable; methods cannot modify them in place."
              },
              {
                "id": "C",
                "text": "Deletes s from memory",
                "explanationIfWrong": "s remains intact."
              },
              {
                "id": "D",
                "text": "Raises an ImmutableError",
                "explanationIfWrong": "Calling methods on strings does not raise errors; it returns new strings."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because strings are immutable, methods return a new string rather than modifying the existing one."
          },
          {
            "id": "q-8-1-objects-and-methods-3-v2",
            "question": "What is the output of:\ns = \"python\"\ns.replace(\"p\", \"j\")\nprint(s)",
            "options": [
              {
                "id": "A",
                "text": "python",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "jython",
                "explanationIfWrong": "The return value of replace() was not assigned back to s."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "s still holds 'python'."
              },
              {
                "id": "D",
                "text": "Error",
                "explanationIfWrong": "No error occurs; the returned string is simply discarded."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The result of s.replace() was discarded because it was not assigned to a variable."
          },
          {
            "id": "q-8-1-objects-and-methods-3-v3",
            "question": "How do you permanently update word to lowercase in Python?",
            "options": [
              {
                "id": "A",
                "text": "word = word.lower()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "word.lower()",
                "explanationIfWrong": "Without reassignment, word remains unmodified."
              },
              {
                "id": "C",
                "text": "lower(word)",
                "explanationIfWrong": "There is no global lower() function; it is a str method."
              },
              {
                "id": "D",
                "text": "word.to_lower()",
                "explanationIfWrong": "The method name is lower(), not to_lower()."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "You must rebind the variable word to the new lowercase string returned by word.lower()."
          }
        ]
      },
      {
        "heading": "Mutating Methods on Mutable Objects",
        "text": "Lists, dictionaries, and sets are mutable. Methods designed to alter these objects (such as list.append(), list.sort(), and list.reverse()) modify the object directly in memory and return None. A common bug is writing items = items.sort(), which wipes out the list by assigning None to the variable.",
        "codeSnippet": "scores = [88, 42, 95, 71]\n\n# Correct: mutate in place\nresult = scores.sort()\nprint(f\"Return value of sort(): {result}\")\nprint(f\"Sorted list: {scores}\")\n\n# Contrast with sorted() which returns a new list\nnums = [3, 1, 2]\nnew_nums = sorted(nums)\nprint(f\"Original nums: {nums}, New nums: {new_nums}\")",
        "terminalOutput": "Return value of sort(): None\nSorted list: [42, 71, 88, 95]\nOriginal nums: [3, 1, 2], New nums: [1, 2, 3]",
        "warning": "Never write items = items.append(x) or items = items.sort(). Both methods return None, so items will become None.",
        "mcq": {
          "id": "q-8-1-objects-and-methods-4-v1",
          "question": "What is the return value of items.sort() on a list?",
          "options": [
            {
              "id": "A",
              "text": "None",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A new sorted list",
              "explanationIfWrong": "sorted(items) returns a new list; items.sort() returns None."
            },
            {
              "id": "C",
              "text": "The length of the list",
              "explanationIfWrong": "sort() does not return the length."
            },
            {
              "id": "D",
              "text": "True",
              "explanationIfWrong": "sort() returns None."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In-place mutation methods on mutable objects in Python return None by convention to signal mutation."
        },
        "retestMcq": {
          "id": "q-8-1-objects-and-methods-4-v2",
          "question": "What is the value of result after executing:\nnumbers = [3, 1, 2]\nresult = numbers.append(4)",
          "options": [
            {
              "id": "A",
              "text": "None",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[3, 1, 2, 4]",
              "explanationIfWrong": "numbers now holds [3, 1, 2, 4], but result holds None."
            },
            {
              "id": "C",
              "text": "4",
              "explanationIfWrong": "append() does not return the appended item."
            },
            {
              "id": "D",
              "text": "True",
              "explanationIfWrong": "append() returns None."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "append() modifies the list in place and returns None."
        },
        "questionPool": [
          {
            "id": "q-8-1-objects-and-methods-4-v1",
            "question": "What is the return value of items.sort() on a list?",
            "options": [
              {
                "id": "A",
                "text": "None",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A new sorted list",
                "explanationIfWrong": "sorted(items) returns a new list; items.sort() returns None."
              },
              {
                "id": "C",
                "text": "The length of the list",
                "explanationIfWrong": "sort() does not return the length."
              },
              {
                "id": "D",
                "text": "True",
                "explanationIfWrong": "sort() returns None."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In-place mutation methods on mutable objects in Python return None by convention to signal mutation."
          },
          {
            "id": "q-8-1-objects-and-methods-4-v2",
            "question": "What is the value of result after executing:\nnumbers = [3, 1, 2]\nresult = numbers.append(4)",
            "options": [
              {
                "id": "A",
                "text": "None",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[3, 1, 2, 4]",
                "explanationIfWrong": "numbers now holds [3, 1, 2, 4], but result holds None."
              },
              {
                "id": "C",
                "text": "4",
                "explanationIfWrong": "append() does not return the appended item."
              },
              {
                "id": "D",
                "text": "True",
                "explanationIfWrong": "append() returns None."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "append() modifies the list in place and returns None."
          },
          {
            "id": "q-8-1-objects-and-methods-4-v3",
            "question": "If you want to sort a list while preserving the original list unchanged, which should you use?",
            "options": [
              {
                "id": "A",
                "text": "new_list = sorted(original_list)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "new_list = original_list.sort()",
                "explanationIfWrong": "original_list.sort() mutates the original and returns None."
              },
              {
                "id": "C",
                "text": "new_list = original_list.order()",
                "explanationIfWrong": "There is no order() method on lists."
              },
              {
                "id": "D",
                "text": "original_list.reverse()",
                "explanationIfWrong": "reverse() mutates the list and reverses order rather than sorting."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The built-in sorted() function returns a brand new sorted list leaving the input list intact."
          }
        ]
      },
      {
        "heading": "Inspecting Objects with dir() and help()",
        "text": "Python offers built-in introspection tools. The dir(obj) function returns a sorted list of all valid attribute and method names available on that object. Special methods surrounded by double underscores (dunder methods like __init__, __str__, __add__) govern how the object behaves when used with Python operators.",
        "codeSnippet": "s = \"hello\"\nall_attrs = dir(s)\n# Filter out dunder methods to see user-facing methods\nmethods = [m for m in all_attrs if not m.startswith(\"__\")]\n\nprint(f\"Total attributes/methods on str: {len(all_attrs)}\")\nprint(f\"Sample string methods: {methods[:6]}\")\nprint(f\"Check for upper: {'upper' in methods}\")",
        "terminalOutput": "Total attributes/methods on str: 80\nSample string methods: ['capitalize', 'casefold', 'center', 'count', 'encode', 'endswith']\nCheck for upper: True",
        "tip": "When experimenting with unfamiliar libraries or data types, calling dir(object) in an interactive shell reveals every available method instantly.",
        "mcq": {
          "id": "q-8-1-objects-and-methods-5-v1",
          "question": "What is the purpose of the built-in dir() function?",
          "options": [
            {
              "id": "A",
              "text": "To list all attributes and methods associated with an object or scope",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To delete all attributes from an object",
              "explanationIfWrong": "dir() only inspects; it does not delete anything."
            },
            {
              "id": "C",
              "text": "To list the files in the current operating system directory",
              "explanationIfWrong": "os.listdir() lists files, not dir()."
            },
            {
              "id": "D",
              "text": "To compile the object into bytecode",
              "explanationIfWrong": "dir() provides object introspection."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "dir(x) returns a list of valid attribute and method names for the object x."
        },
        "retestMcq": {
          "id": "q-8-1-objects-and-methods-5-v2",
          "question": "What distinguishes dunder methods (like __add__ or __len__) from regular methods?",
          "options": [
            {
              "id": "A",
              "text": "They are special methods invoked under the hood by Python operators and built-in functions",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "They can only be called from inside C modules",
              "explanationIfWrong": "Dunder methods are standard Python methods."
            },
            {
              "id": "C",
              "text": "They cannot be overridden by user classes",
              "explanationIfWrong": "User classes frequently define dunder methods."
            },
            {
              "id": "D",
              "text": "They are deprecated in modern Python",
              "explanationIfWrong": "Dunder methods form the backbone of Python's data model."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dunder (double underscore) methods implement operator overloading and built-in protocols (like + or len())."
        },
        "questionPool": [
          {
            "id": "q-8-1-objects-and-methods-5-v1",
            "question": "What is the purpose of the built-in dir() function?",
            "options": [
              {
                "id": "A",
                "text": "To list all attributes and methods associated with an object or scope",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To delete all attributes from an object",
                "explanationIfWrong": "dir() only inspects; it does not delete anything."
              },
              {
                "id": "C",
                "text": "To list the files in the current operating system directory",
                "explanationIfWrong": "os.listdir() lists files, not dir()."
              },
              {
                "id": "D",
                "text": "To compile the object into bytecode",
                "explanationIfWrong": "dir() provides object introspection."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "dir(x) returns a list of valid attribute and method names for the object x."
          },
          {
            "id": "q-8-1-objects-and-methods-5-v2",
            "question": "What distinguishes dunder methods (like __add__ or __len__) from regular methods?",
            "options": [
              {
                "id": "A",
                "text": "They are special methods invoked under the hood by Python operators and built-in functions",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They can only be called from inside C modules",
                "explanationIfWrong": "Dunder methods are standard Python methods."
              },
              {
                "id": "C",
                "text": "They cannot be overridden by user classes",
                "explanationIfWrong": "User classes frequently define dunder methods."
              },
              {
                "id": "D",
                "text": "They are deprecated in modern Python",
                "explanationIfWrong": "Dunder methods form the backbone of Python's data model."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dunder (double underscore) methods implement operator overloading and built-in protocols (like + or len())."
          },
          {
            "id": "q-8-1-objects-and-methods-5-v3",
            "question": "What does \"__len__\" in dir([1, 2, 3]) indicate?",
            "options": [
              {
                "id": "A",
                "text": "The list object supports the len() function via its __len__ method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The list is private and cannot be measured",
                "explanationIfWrong": "Lists can be measured with len()."
              },
              {
                "id": "C",
                "text": "The list contains private variables",
                "explanationIfWrong": "Dunder methods are not private variables."
              },
              {
                "id": "D",
                "text": "The list has reached maximum capacity",
                "explanationIfWrong": "Python lists are dynamically sized."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling len(x) internally invokes x.__len__()."
          }
        ]
      }
    ]
  },
  {
    "id": "8-2-classes-and-instances",
    "number": "8.2",
    "title": "Classes & Object Instances",
    "subtitle": "Define custom blueprints using class, create instances, and manipulate dynamic object attributes.",
    "readTime": "20 min",
    "objectives": [
      "Distinguish between a class (blueprint) and an instance (concrete object)",
      "Define new custom classes using the class keyword and PascalCase naming",
      "Instantiate objects by calling the class name like a function",
      "Attach dynamic attributes to instances using dot notation",
      "Understand that separate instances maintain independent attribute namespaces",
      "Handle AttributeError and safely inspect attributes with hasattr()"
    ],
    "theoryBlocks": [
      {
        "heading": "What is a Class?",
        "text": "A class is a blueprint or template from which individual objects (instances) are created. Just as an architect's blueprint describes the dimensions and structure of a house without being a physical house itself, a class defines the properties and behaviors that its instances will have. By creating a class, you define a brand-new custom data type in Python.",
        "codeSnippet": "# Defining a blueprint\nclass Student:\n    \"\"\"Represents a student enrolled in the academy.\"\"\"\n    pass\n\n# Creating instances from the blueprint\nalice = Student()\nbob = Student()\n\nprint(type(alice))\nprint(alice is bob)  # Separate distinct objects in memory",
        "terminalOutput": "<class '__main__.Student'>\nFalse",
        "tip": "By PEP 8 convention, class names use PascalCase (CapitalizedWords), while functions and variable names use snake_case.",
        "mcq": {
          "id": "q-8-2-classes-and-instances-0-v1",
          "question": "What is the relationship between a class and an instance in Python?",
          "options": [
            {
              "id": "A",
              "text": "A class is the blueprint/type; an instance is a concrete object created from that blueprint",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A class is an individual object, while an instance is a collection of classes",
              "explanationIfWrong": "It is the opposite: instances are created from classes."
            },
            {
              "id": "C",
              "text": "A class runs only at compile time and disappears at runtime",
              "explanationIfWrong": "Classes are first-class runtime objects in Python."
            },
            {
              "id": "D",
              "text": "Classes and instances are completely synonymous terms with no distinction",
              "explanationIfWrong": "They represent type vs instantiated data."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A class defines the structure and behavior; an instance is a specific object created from that class."
        },
        "retestMcq": {
          "id": "q-8-2-classes-and-instances-0-v2",
          "question": "According to PEP 8 styling conventions, which name correctly adheres to class naming standards?",
          "options": [
            {
              "id": "A",
              "text": "BankCustomer",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "bank_customer",
              "explanationIfWrong": "snake_case is used for functions and variables, not classes."
            },
            {
              "id": "C",
              "text": "bankCustomer",
              "explanationIfWrong": "camelCase is standard in Java/JS, but PEP 8 prescribes PascalCase."
            },
            {
              "id": "D",
              "text": "BANK_CUSTOMER",
              "explanationIfWrong": "ALL_CAPS is reserved for constants."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "PEP 8 specifies PascalCase (CapitalizedWords with no underscores) for class names."
        },
        "questionPool": [
          {
            "id": "q-8-2-classes-and-instances-0-v1",
            "question": "What is the relationship between a class and an instance in Python?",
            "options": [
              {
                "id": "A",
                "text": "A class is the blueprint/type; an instance is a concrete object created from that blueprint",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A class is an individual object, while an instance is a collection of classes",
                "explanationIfWrong": "It is the opposite: instances are created from classes."
              },
              {
                "id": "C",
                "text": "A class runs only at compile time and disappears at runtime",
                "explanationIfWrong": "Classes are first-class runtime objects in Python."
              },
              {
                "id": "D",
                "text": "Classes and instances are completely synonymous terms with no distinction",
                "explanationIfWrong": "They represent type vs instantiated data."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A class defines the structure and behavior; an instance is a specific object created from that class."
          },
          {
            "id": "q-8-2-classes-and-instances-0-v2",
            "question": "According to PEP 8 styling conventions, which name correctly adheres to class naming standards?",
            "options": [
              {
                "id": "A",
                "text": "BankCustomer",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "bank_customer",
                "explanationIfWrong": "snake_case is used for functions and variables, not classes."
              },
              {
                "id": "C",
                "text": "bankCustomer",
                "explanationIfWrong": "camelCase is standard in Java/JS, but PEP 8 prescribes PascalCase."
              },
              {
                "id": "D",
                "text": "BANK_CUSTOMER",
                "explanationIfWrong": "ALL_CAPS is reserved for constants."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 specifies PascalCase (CapitalizedWords with no underscores) for class names."
          },
          {
            "id": "q-8-2-classes-and-instances-0-v3",
            "question": "What is the value of alice is bob when alice = Student() and bob = Student()?",
            "options": [
              {
                "id": "A",
                "text": "False, because each instantiation creates a separate object in memory with a distinct id",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "True, because both are Student objects",
                "explanationIfWrong": "is checks memory identity, not type."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "The is operator returns a boolean."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "Identity comparison between objects never raises a TypeError."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each call to Student() allocates a new object in memory with its own unique identity."
          }
        ]
      },
      {
        "heading": "Defining Classes with class and pass",
        "text": "In Python, you define a class using the class keyword followed by the class name, a colon, and an indented body. If you are drafting a class skeleton and have not yet implemented its methods or attributes, you can use the pass statement as a syntactic placeholder to keep the code valid.",
        "codeSnippet": "class Robot:\n    pass\n\n# Creating an instance\nr = Robot()\nprint(r)\nprint(isinstance(r, Robot))",
        "terminalOutput": "<__main__.Robot object at 0x...>\nTrue",
        "tip": "The pass keyword acts as a no-op statement. You can also use a docstring (\"\"\"Documentation\"\"\") as a valid non-empty body.",
        "mcq": {
          "id": "q-8-2-classes-and-instances-1-v1",
          "question": "Why is the pass statement used when defining an empty class?",
          "options": [
            {
              "id": "A",
              "text": "Python requires an indented block after a colon; pass serves as a syntactic placeholder",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It passes control to the operating system",
              "explanationIfWrong": "pass does nothing; it is a no-op."
            },
            {
              "id": "C",
              "text": "It enables inheritance from other classes",
              "explanationIfWrong": "Inheritance is declared in parentheses after the class name."
            },
            {
              "id": "D",
              "text": "It bypasses Python's memory management",
              "explanationIfWrong": "pass has no effect on memory management."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's indentation-based syntax requires at least one statement in any block following a colon."
        },
        "retestMcq": {
          "id": "q-8-2-classes-and-instances-1-v2",
          "question": "What is printed by print(Robot) when class Robot: pass is defined?",
          "options": [
            {
              "id": "A",
              "text": "<class '__main__.Robot'>",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Robot()",
              "explanationIfWrong": "Robot refers to the class object itself, not an instance string."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "Classes are first-class objects in Python and have string representations."
            },
            {
              "id": "D",
              "text": "SyntaxError",
              "explanationIfWrong": "Printing a class object is completely valid."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, classes are themselves objects; printing a class shows its type and qualified name."
        },
        "questionPool": [
          {
            "id": "q-8-2-classes-and-instances-1-v1",
            "question": "Why is the pass statement used when defining an empty class?",
            "options": [
              {
                "id": "A",
                "text": "Python requires an indented block after a colon; pass serves as a syntactic placeholder",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It passes control to the operating system",
                "explanationIfWrong": "pass does nothing; it is a no-op."
              },
              {
                "id": "C",
                "text": "It enables inheritance from other classes",
                "explanationIfWrong": "Inheritance is declared in parentheses after the class name."
              },
              {
                "id": "D",
                "text": "It bypasses Python's memory management",
                "explanationIfWrong": "pass has no effect on memory management."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's indentation-based syntax requires at least one statement in any block following a colon."
          },
          {
            "id": "q-8-2-classes-and-instances-1-v2",
            "question": "What is printed by print(Robot) when class Robot: pass is defined?",
            "options": [
              {
                "id": "A",
                "text": "<class '__main__.Robot'>",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Robot()",
                "explanationIfWrong": "Robot refers to the class object itself, not an instance string."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "Classes are first-class objects in Python and have string representations."
              },
              {
                "id": "D",
                "text": "SyntaxError",
                "explanationIfWrong": "Printing a class object is completely valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, classes are themselves objects; printing a class shows its type and qualified name."
          },
          {
            "id": "q-8-2-classes-and-instances-1-v3",
            "question": "Which of the following is an alternate valid way to define a minimal class without pass?",
            "options": [
              {
                "id": "A",
                "text": "class Robot:\n    \"\"\"Represents an automaton.\"\"\"",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "class Robot {}",
                "explanationIfWrong": "Python does not use curly braces for class bodies."
              },
              {
                "id": "C",
                "text": "class Robot;",
                "explanationIfWrong": "A colon and an indented body are required."
              },
              {
                "id": "D",
                "text": "def Robot: pass",
                "explanationIfWrong": "def defines functions, class defines classes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A docstring literal inside the class body satisfies Python's block requirement."
          }
        ]
      },
      {
        "heading": "Instantiating Objects",
        "text": "Instantiating means creating a concrete instance of a class. In Python, instantiation is performed by calling the class name followed by parentheses: obj = MyClass(). This syntax invokes Python's object creation machinery, allocating memory and returning a fresh instance of that type.",
        "codeSnippet": "class Point:\n    pass\n\np1 = Point()\np2 = Point()\n\nprint(f\"p1 id: {hex(id(p1))}\")\nprint(f\"p2 id: {hex(id(p2))}\")\nprint(f\"Are p1 and p2 the same object? {p1 is p2}\")",
        "terminalOutput": "p1 id: 0x...\np2 id: 0x...\nAre p1 and p2 the same object? False",
        "tip": "Calling Point() behaves like a factory function: each call returns a distinct, independent instance.",
        "mcq": {
          "id": "q-8-2-classes-and-instances-2-v1",
          "question": "How do you instantiate an object of class Car in Python?",
          "options": [
            {
              "id": "A",
              "text": "my_car = Car()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Car my_car = new Car()",
              "explanationIfWrong": "Python does not use static type declarations or the 'new' keyword."
            },
            {
              "id": "C",
              "text": "my_car = new Car()",
              "explanationIfWrong": "Python has no 'new' keyword; calling the class directly instantiates it."
            },
            {
              "id": "D",
              "text": "my_car = create(Car)",
              "explanationIfWrong": "There is no create() keyword in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, instances are created simply by calling the class name as if it were a function: Car()."
        },
        "retestMcq": {
          "id": "q-8-2-classes-and-instances-2-v2",
          "question": "What happens in memory when executing:\na = Point()\nb = a",
          "options": [
            {
              "id": "A",
              "text": "Both a and b reference the exact same Point instance in memory",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A deep copy of the Point instance is created for b",
              "explanationIfWrong": "Assignment copies object references, not the underlying objects."
            },
            {
              "id": "C",
              "text": "b becomes None",
              "explanationIfWrong": "b is assigned the object reference currently held by a."
            },
            {
              "id": "D",
              "text": "a is deleted from memory",
              "explanationIfWrong": "a remains bound to the object."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Variable assignment in Python binds a new name to the existing object reference without duplicating it."
        },
        "questionPool": [
          {
            "id": "q-8-2-classes-and-instances-2-v1",
            "question": "How do you instantiate an object of class Car in Python?",
            "options": [
              {
                "id": "A",
                "text": "my_car = Car()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Car my_car = new Car()",
                "explanationIfWrong": "Python does not use static type declarations or the 'new' keyword."
              },
              {
                "id": "C",
                "text": "my_car = new Car()",
                "explanationIfWrong": "Python has no 'new' keyword; calling the class directly instantiates it."
              },
              {
                "id": "D",
                "text": "my_car = create(Car)",
                "explanationIfWrong": "There is no create() keyword in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, instances are created simply by calling the class name as if it were a function: Car()."
          },
          {
            "id": "q-8-2-classes-and-instances-2-v2",
            "question": "What happens in memory when executing:\na = Point()\nb = a",
            "options": [
              {
                "id": "A",
                "text": "Both a and b reference the exact same Point instance in memory",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A deep copy of the Point instance is created for b",
                "explanationIfWrong": "Assignment copies object references, not the underlying objects."
              },
              {
                "id": "C",
                "text": "b becomes None",
                "explanationIfWrong": "b is assigned the object reference currently held by a."
              },
              {
                "id": "D",
                "text": "a is deleted from memory",
                "explanationIfWrong": "a remains bound to the object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Variable assignment in Python binds a new name to the existing object reference without duplicating it."
          },
          {
            "id": "q-8-2-classes-and-instances-2-v3",
            "question": "What is the result of a == b when a = Point() and b = a?",
            "options": [
              {
                "id": "A",
                "text": "True",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "a and b point to the identical object."
              },
              {
                "id": "C",
                "text": "TypeError",
                "explanationIfWrong": "Equality check between references is valid."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "== returns a boolean."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since a and b refer to the exact same object, both a is b and a == b evaluate to True by default."
          }
        ]
      },
      {
        "heading": "Adding Dynamic Attributes to Instances",
        "text": "Python objects are dynamic. You can attach new attributes to an instance at any time by simply assigning to them using dot notation: instance.attribute_name = value. These attributes reside inside the instance's private dictionary (__dict__) and do not affect any other instances of the same class.",
        "codeSnippet": "class Pet:\n    pass\n\ndog = Pet()\ncat = Pet()\n\n# Dynamically assign attributes to dog\ndog.name = \"Rover\"\ndog.age = 4\n\n# Dynamically assign attributes to cat\ncat.name = \"Luna\"\ncat.is_indoor = True\n\nprint(f\"Dog: {dog.name}, Age: {dog.age}\")\nprint(f\"Cat: {cat.name}, Indoor: {cat.is_indoor}\")\nprint(f\"Does dog have is_indoor? {hasattr(dog, 'is_indoor')}\")",
        "terminalOutput": "Dog: Rover, Age: 4\nCat: Luna, Indoor: True\nDoes dog have is_indoor? False",
        "tip": "While adding attributes on the fly is supported, the best practice is to initialize all known attributes inside a constructor (__init__) for predictability.",
        "mcq": {
          "id": "q-8-2-classes-and-instances-3-v1",
          "question": "What happens if you assign an attribute to one instance (dog.breed = 'Golden')?",
          "options": [
            {
              "id": "A",
              "text": "The attribute is added only to that specific dog instance; other Pet instances are unaffected",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Every existing and future Pet instance automatically receives the breed attribute",
              "explanationIfWrong": "Instance attributes are attached to individual instances, not the class."
            },
            {
              "id": "C",
              "text": "It raises an AttributeError because attributes must be declared inside the class",
              "explanationIfWrong": "Python objects permit dynamic attribute assignment by default."
            },
            {
              "id": "D",
              "text": "It converts the Pet class into a dictionary",
              "explanationIfWrong": "The instance remains an instance of Pet."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Instance attributes are stored in the instance's individual namespace (__dict__)."
        },
        "retestMcq": {
          "id": "q-8-2-classes-and-instances-3-v2",
          "question": "Where does Python store an object's dynamic instance attributes under the hood?",
          "options": [
            {
              "id": "A",
              "text": "Inside the instance's __dict__ mapping",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "In a global compiler registry",
              "explanationIfWrong": "Attributes are kept in the instance's __dict__."
            },
            {
              "id": "C",
              "text": "In an external JSON configuration file",
              "explanationIfWrong": "They reside in memory inside the object's __dict__."
            },
            {
              "id": "D",
              "text": "In the class's docstring",
              "explanationIfWrong": "Docstrings hold documentation, not instance attributes."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Most standard Python objects maintain an internal dictionary named __dict__ storing their instance attributes."
        },
        "questionPool": [
          {
            "id": "q-8-2-classes-and-instances-3-v1",
            "question": "What happens if you assign an attribute to one instance (dog.breed = 'Golden')?",
            "options": [
              {
                "id": "A",
                "text": "The attribute is added only to that specific dog instance; other Pet instances are unaffected",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Every existing and future Pet instance automatically receives the breed attribute",
                "explanationIfWrong": "Instance attributes are attached to individual instances, not the class."
              },
              {
                "id": "C",
                "text": "It raises an AttributeError because attributes must be declared inside the class",
                "explanationIfWrong": "Python objects permit dynamic attribute assignment by default."
              },
              {
                "id": "D",
                "text": "It converts the Pet class into a dictionary",
                "explanationIfWrong": "The instance remains an instance of Pet."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Instance attributes are stored in the instance's individual namespace (__dict__)."
          },
          {
            "id": "q-8-2-classes-and-instances-3-v2",
            "question": "Where does Python store an object's dynamic instance attributes under the hood?",
            "options": [
              {
                "id": "A",
                "text": "Inside the instance's __dict__ mapping",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "In a global compiler registry",
                "explanationIfWrong": "Attributes are kept in the instance's __dict__."
              },
              {
                "id": "C",
                "text": "In an external JSON configuration file",
                "explanationIfWrong": "They reside in memory inside the object's __dict__."
              },
              {
                "id": "D",
                "text": "In the class's docstring",
                "explanationIfWrong": "Docstrings hold documentation, not instance attributes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Most standard Python objects maintain an internal dictionary named __dict__ storing their instance attributes."
          },
          {
            "id": "q-8-2-classes-and-instances-3-v3",
            "question": "If p = Pet() and p.name = 'Rex', what does print(p.__dict__) show?",
            "options": [
              {
                "id": "A",
                "text": "{'name': 'Rex'}",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "['name', 'Rex']",
                "explanationIfWrong": "__dict__ is a dictionary, not a list."
              },
              {
                "id": "C",
                "text": "('Rex',)",
                "explanationIfWrong": "__dict__ is a key-value mapping."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "__dict__ stores instance attributes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The __dict__ attribute of an object exposes its attribute names and values as a dictionary."
          }
        ]
      },
      {
        "heading": "Accessing and Modifying Attributes",
        "text": "You access an object's attributes using the same dot notation: print(student.name). You can also update attribute values by reassigning them: student.name = 'New Name' or student.age += 1. Python reads and writes directly to that instance's attribute storage.",
        "codeSnippet": "class Counter:\n    pass\n\nc = Counter()\nc.count = 0\n\n# Incrementing attributes\nc.count += 1\nc.count += 5\nprint(f\"Current count: {c.count}\")\n\n# Modifying directly\nc.count = 100\nprint(f\"Updated count: {c.count}\")",
        "terminalOutput": "Current count: 6\nUpdated count: 100",
        "tip": "Attributes can hold any Python object, including lists, dictionaries, or even other custom class instances.",
        "mcq": {
          "id": "q-8-2-classes-and-instances-4-v1",
          "question": "Given c = Counter() and c.count = 5, what happens when executing c.count += 2?",
          "options": [
            {
              "id": "A",
              "text": "c.count is read (5), incremented by 2, and 7 is written back to c.count",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A new Counter instance is created with count set to 7",
              "explanationIfWrong": "The existing instance is modified; no new instance is created."
            },
            {
              "id": "C",
              "text": "It raises an ImmutableError",
              "explanationIfWrong": "User instances are mutable by default."
            },
            {
              "id": "D",
              "text": "It appends 2 to a list",
              "explanationIfWrong": "c.count is an integer, so += performs integer addition."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "c.count += 2 modifies the count attribute on the existing c instance in place."
        },
        "retestMcq": {
          "id": "q-8-2-classes-and-instances-4-v2",
          "question": "Can an instance attribute hold a mutable collection like a list?",
          "options": [
            {
              "id": "A",
              "text": "Yes, attributes can reference any valid Python object, including lists and dicts",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, attributes can only hold primitive numbers and strings",
              "explanationIfWrong": "Python attributes can reference any object whatsoever."
            },
            {
              "id": "C",
              "text": "Only if the class inherits from Collection",
              "explanationIfWrong": "No special inheritance is required."
            },
            {
              "id": "D",
              "text": "Only if declared as a global variable",
              "explanationIfWrong": "Attributes belong to instances, not global scope."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Attributes are simply references to objects; they can hold lists, dictionaries, functions, etc."
        },
        "questionPool": [
          {
            "id": "q-8-2-classes-and-instances-4-v1",
            "question": "Given c = Counter() and c.count = 5, what happens when executing c.count += 2?",
            "options": [
              {
                "id": "A",
                "text": "c.count is read (5), incremented by 2, and 7 is written back to c.count",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A new Counter instance is created with count set to 7",
                "explanationIfWrong": "The existing instance is modified; no new instance is created."
              },
              {
                "id": "C",
                "text": "It raises an ImmutableError",
                "explanationIfWrong": "User instances are mutable by default."
              },
              {
                "id": "D",
                "text": "It appends 2 to a list",
                "explanationIfWrong": "c.count is an integer, so += performs integer addition."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "c.count += 2 modifies the count attribute on the existing c instance in place."
          },
          {
            "id": "q-8-2-classes-and-instances-4-v2",
            "question": "Can an instance attribute hold a mutable collection like a list?",
            "options": [
              {
                "id": "A",
                "text": "Yes, attributes can reference any valid Python object, including lists and dicts",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, attributes can only hold primitive numbers and strings",
                "explanationIfWrong": "Python attributes can reference any object whatsoever."
              },
              {
                "id": "C",
                "text": "Only if the class inherits from Collection",
                "explanationIfWrong": "No special inheritance is required."
              },
              {
                "id": "D",
                "text": "Only if declared as a global variable",
                "explanationIfWrong": "Attributes belong to instances, not global scope."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Attributes are simply references to objects; they can hold lists, dictionaries, functions, etc."
          },
          {
            "id": "q-8-2-classes-and-instances-4-v3",
            "question": "If p = Point() with p.coords = [10, 20], what does p.coords.append(30) do?",
            "options": [
              {
                "id": "A",
                "text": "Mutates the list referenced by p.coords so it becomes [10, 20, 30]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Raises an AttributeError",
                "explanationIfWrong": "coords is a list, and lists have an append method."
              },
              {
                "id": "C",
                "text": "Replaces p.coords with 30",
                "explanationIfWrong": "append() appends to the list; it does not replace the reference."
              },
              {
                "id": "D",
                "text": "Returns a new Point instance",
                "explanationIfWrong": "The existing list inside p is mutated."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Accessing p.coords yields the list object, and calling .append(30) mutates that list directly."
          }
        ]
      },
      {
        "heading": "AttributeError and hasattr()",
        "text": "Attempting to access an attribute that does not exist on an object immediately raises an AttributeError. To safely check whether an object possesses an attribute before accessing it, use the built-in hasattr(obj, 'attr_name') function, or use getattr(obj, 'attr_name', default_value) to provide a fallback value.",
        "codeSnippet": "class Item:\n    pass\n\nbook = Item()\nbook.title = \"Python Mastery\"\n\n# Checking existence safely with hasattr\nif hasattr(book, \"price\"):\n    print(f\"Price: {book.price}\")\nelse:\n    print(\"Price attribute is not set!\")\n\n# Providing default fallback with getattr\ncategory = getattr(book, \"category\", \"General\")\nprint(f\"Category: {category}\")",
        "terminalOutput": "Price attribute is not set!\nCategory: General",
        "warning": "Never assume an attribute exists without either verifying with hasattr() or guaranteeing its presence inside the constructor (__init__).",
        "mcq": {
          "id": "q-8-2-classes-and-instances-5-v1",
          "question": "What exception is raised when attempting to access an undefined attribute on an object?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "KeyError",
              "explanationIfWrong": "KeyError occurs when a key is absent from a dictionary."
            },
            {
              "id": "C",
              "text": "NameError",
              "explanationIfWrong": "NameError occurs when a global or local variable name is undefined."
            },
            {
              "id": "D",
              "text": "IndexError",
              "explanationIfWrong": "IndexError occurs when a sequence index is out of bounds."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Accessing an absent attribute via dot notation raises an AttributeError."
        },
        "retestMcq": {
          "id": "q-8-2-classes-and-instances-5-v2",
          "question": "What does hasattr(obj, 'score') return if obj has no attribute named score?",
          "options": [
            {
              "id": "A",
              "text": "False",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "None",
              "explanationIfWrong": "hasattr() always returns a boolean (True or False)."
            },
            {
              "id": "C",
              "text": "Raises AttributeError",
              "explanationIfWrong": "hasattr() catches AttributeError internally and returns False."
            },
            {
              "id": "D",
              "text": "0",
              "explanationIfWrong": "hasattr() returns False, not 0."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "hasattr(obj, name) returns True if the attribute exists and False otherwise."
        },
        "questionPool": [
          {
            "id": "q-8-2-classes-and-instances-5-v1",
            "question": "What exception is raised when attempting to access an undefined attribute on an object?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "KeyError",
                "explanationIfWrong": "KeyError occurs when a key is absent from a dictionary."
              },
              {
                "id": "C",
                "text": "NameError",
                "explanationIfWrong": "NameError occurs when a global or local variable name is undefined."
              },
              {
                "id": "D",
                "text": "IndexError",
                "explanationIfWrong": "IndexError occurs when a sequence index is out of bounds."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Accessing an absent attribute via dot notation raises an AttributeError."
          },
          {
            "id": "q-8-2-classes-and-instances-5-v2",
            "question": "What does hasattr(obj, 'score') return if obj has no attribute named score?",
            "options": [
              {
                "id": "A",
                "text": "False",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "None",
                "explanationIfWrong": "hasattr() always returns a boolean (True or False)."
              },
              {
                "id": "C",
                "text": "Raises AttributeError",
                "explanationIfWrong": "hasattr() catches AttributeError internally and returns False."
              },
              {
                "id": "D",
                "text": "0",
                "explanationIfWrong": "hasattr() returns False, not 0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "hasattr(obj, name) returns True if the attribute exists and False otherwise."
          },
          {
            "id": "q-8-2-classes-and-instances-5-v3",
            "question": "What does getattr(user, 'email', 'not_found@example.com') return if user has no email attribute?",
            "options": [
              {
                "id": "A",
                "text": "'not_found@example.com'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Raises an AttributeError",
                "explanationIfWrong": "Because a default value is supplied, getattr will not raise an error."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "The specified default value ('not_found@example.com') is returned."
              },
              {
                "id": "D",
                "text": "False",
                "explanationIfWrong": "getattr returns the provided fallback argument."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "getattr(object, name, default) returns default if the attribute is absent, avoiding an AttributeError."
          }
        ]
      }
    ]
  },
  {
    "id": "8-3-constructors-init",
    "number": "8.3",
    "title": "Constructors & __init__",
    "subtitle": "Initialize object state reliably upon creation using the __init__ constructor and self binding.",
    "readTime": "20 min",
    "objectives": [
      "Define constructor methods using the special __init__ dunder name",
      "Understand that Python automatically calls __init__ whenever an instance is created",
      "Use the self parameter to bind instance variables to the specific object being initialized",
      "Pass mandatory parameters into the constructor during instantiation",
      "Assign default parameter values for flexible object initialization",
      "Validate arguments and protect class invariants using raise ValueError inside __init__"
    ],
    "theoryBlocks": [
      {
        "heading": "The __init__ Constructor Method",
        "text": "The __init__ method (short for 'initialize') is Python's constructor. When you instantiate a class by calling ClassName(), Python first allocates the new object in memory and then immediately and automatically executes the class's __init__ method to set up its initial attributes.",
        "codeSnippet": "class Book:\n    def __init__(self, title, author):\n        print(f\"Initializing new book: '{title}'\")\n        self.title = title\n        self.author = author\n\n# __init__ runs automatically when called\nb1 = Book(\"1984\", \"George Orwell\")\nprint(f\"Created: {b1.title} by {b1.author}\")",
        "terminalOutput": "Initializing new book: '1984'\nCreated: 1984 by George Orwell",
        "tip": "__init__ should never return a value; returning anything other than None raises a TypeError.",
        "mcq": {
          "id": "q-8-3-constructors-init-0-v1",
          "question": "When does Python automatically invoke the __init__ method of a class?",
          "options": [
            {
              "id": "A",
              "text": "Immediately upon creating an instance of that class",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Only when the object is about to be deleted by garbage collection",
              "explanationIfWrong": "__del__ runs at deletion; __init__ runs at creation."
            },
            {
              "id": "C",
              "text": "When the file containing the class is imported",
              "explanationIfWrong": "Importing does not instantiate classes."
            },
            {
              "id": "D",
              "text": "Only if explicitly called like obj.__init__() in user code",
              "explanationIfWrong": "Python invokes __init__ automatically during instantiation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Calling MyClass() creates the object and automatically passes it to __init__ for initialization."
        },
        "retestMcq": {
          "id": "q-8-3-constructors-init-0-v2",
          "question": "What happens if you write return \"success\" inside an __init__ method?",
          "options": [
            {
              "id": "A",
              "text": "Python raises a TypeError because __init__ must return None",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The string 'success' is returned from the constructor call",
              "explanationIfWrong": "Instantiation must return the newly created instance, so __init__ cannot return non-None."
            },
            {
              "id": "C",
              "text": "It prints 'success' to the terminal",
              "explanationIfWrong": "return does not print."
            },
            {
              "id": "D",
              "text": "The object is discarded",
              "explanationIfWrong": "A TypeError is raised before execution continues."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, __init__ must return None; returning any explicit value raises a TypeError."
        },
        "questionPool": [
          {
            "id": "q-8-3-constructors-init-0-v1",
            "question": "When does Python automatically invoke the __init__ method of a class?",
            "options": [
              {
                "id": "A",
                "text": "Immediately upon creating an instance of that class",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Only when the object is about to be deleted by garbage collection",
                "explanationIfWrong": "__del__ runs at deletion; __init__ runs at creation."
              },
              {
                "id": "C",
                "text": "When the file containing the class is imported",
                "explanationIfWrong": "Importing does not instantiate classes."
              },
              {
                "id": "D",
                "text": "Only if explicitly called like obj.__init__() in user code",
                "explanationIfWrong": "Python invokes __init__ automatically during instantiation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling MyClass() creates the object and automatically passes it to __init__ for initialization."
          },
          {
            "id": "q-8-3-constructors-init-0-v2",
            "question": "What happens if you write return \"success\" inside an __init__ method?",
            "options": [
              {
                "id": "A",
                "text": "Python raises a TypeError because __init__ must return None",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The string 'success' is returned from the constructor call",
                "explanationIfWrong": "Instantiation must return the newly created instance, so __init__ cannot return non-None."
              },
              {
                "id": "C",
                "text": "It prints 'success' to the terminal",
                "explanationIfWrong": "return does not print."
              },
              {
                "id": "D",
                "text": "The object is discarded",
                "explanationIfWrong": "A TypeError is raised before execution continues."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, __init__ must return None; returning any explicit value raises a TypeError."
          },
          {
            "id": "q-8-3-constructors-init-0-v3",
            "question": "Why is it best practice to initialize all instance attributes inside __init__ rather than attaching them dynamically outside?",
            "options": [
              {
                "id": "A",
                "text": "It guarantees that every instance starts in a known, consistent state with all required attributes present",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Dynamic attributes are forbidden by the Python compiler",
                "explanationIfWrong": "Dynamic attributes are allowed, but fragile."
              },
              {
                "id": "C",
                "text": "It makes the class 100x smaller in bytecode",
                "explanationIfWrong": "The primary benefit is predictability and preventing AttributeError."
              },
              {
                "id": "D",
                "text": "It is required for mathematical calculations",
                "explanationIfWrong": "It is an architectural best practice for all types of classes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Setting up all attributes in __init__ prevents accidental AttributeError exceptions when other methods access them."
          }
        ]
      },
      {
        "heading": "The self Parameter",
        "text": "The first parameter of an instance method (including __init__) is always named self by convention. self represents the specific instance being operated on. When you call b = Book('Hamlet', 'Shakespeare'), Python automatically passes the freshly allocated instance as the self argument.",
        "codeSnippet": "class Account:\n    def __init__(self, owner, balance):\n        # self refers to the instance currently being configured\n        self.owner = owner\n        self.balance = balance\n\nacc1 = Account(\"Alice\", 500)\nacc2 = Account(\"Bob\", 1200)\n\nprint(f\"{acc1.owner}: ${acc1.balance}\")\nprint(f\"{acc2.owner}: ${acc2.balance}\")",
        "terminalOutput": "Alice: $500\nBob: $1200",
        "tip": "Although self is technically just a parameter name that could be named anything, violating the PEP 8 convention self will confuse every Python developer and linter.",
        "mcq": {
          "id": "q-8-3-constructors-init-1-v1",
          "question": "What does the self parameter represent inside __init__ and instance methods?",
          "options": [
            {
              "id": "A",
              "text": "A reference to the specific object instance currently being initialized or manipulated",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The class definition object itself",
              "explanationIfWrong": "cls represents the class; self represents the instance."
            },
            {
              "id": "C",
              "text": "The module containing the class",
              "explanationIfWrong": "self points to the instance, not a module."
            },
            {
              "id": "D",
              "text": "A global pointer to the Python runtime engine",
              "explanationIfWrong": "self is strictly local to the instance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "self is the reference to the current instance, allowing you to access and assign its attributes."
        },
        "retestMcq": {
          "id": "q-8-3-constructors-init-1-v2",
          "question": "When you execute a = Account('Alice', 100), how many arguments are explicitly passed in user code, and how many are received by def __init__(self, owner, balance)?",
          "options": [
            {
              "id": "A",
              "text": "You pass 2 arguments ('Alice', 100); Python automatically injects the instance as the 1st parameter (self), making 3 received",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "You pass 3 arguments, with self being passed as None",
              "explanationIfWrong": "You do not pass self manually."
            },
            {
              "id": "C",
              "text": "You pass 1 argument and 2 are received",
              "explanationIfWrong": "'Alice' and 100 are two distinct arguments."
            },
            {
              "id": "D",
              "text": "self is never received by __init__",
              "explanationIfWrong": "self is the first parameter of __init__."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python automatically supplies the newly created instance as the first argument (self) behind the scenes."
        },
        "questionPool": [
          {
            "id": "q-8-3-constructors-init-1-v1",
            "question": "What does the self parameter represent inside __init__ and instance methods?",
            "options": [
              {
                "id": "A",
                "text": "A reference to the specific object instance currently being initialized or manipulated",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The class definition object itself",
                "explanationIfWrong": "cls represents the class; self represents the instance."
              },
              {
                "id": "C",
                "text": "The module containing the class",
                "explanationIfWrong": "self points to the instance, not a module."
              },
              {
                "id": "D",
                "text": "A global pointer to the Python runtime engine",
                "explanationIfWrong": "self is strictly local to the instance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "self is the reference to the current instance, allowing you to access and assign its attributes."
          },
          {
            "id": "q-8-3-constructors-init-1-v2",
            "question": "When you execute a = Account('Alice', 100), how many arguments are explicitly passed in user code, and how many are received by def __init__(self, owner, balance)?",
            "options": [
              {
                "id": "A",
                "text": "You pass 2 arguments ('Alice', 100); Python automatically injects the instance as the 1st parameter (self), making 3 received",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "You pass 3 arguments, with self being passed as None",
                "explanationIfWrong": "You do not pass self manually."
              },
              {
                "id": "C",
                "text": "You pass 1 argument and 2 are received",
                "explanationIfWrong": "'Alice' and 100 are two distinct arguments."
              },
              {
                "id": "D",
                "text": "self is never received by __init__",
                "explanationIfWrong": "self is the first parameter of __init__."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python automatically supplies the newly created instance as the first argument (self) behind the scenes."
          },
          {
            "id": "q-8-3-constructors-init-1-v3",
            "question": "What happens if you define def __init__(owner, balance): (forgetting self) and call Account('Alice', 100)?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: __init__() takes 2 positional arguments but 3 were given",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It silently assigns self to owner",
                "explanationIfWrong": "Python passes 3 arguments (instance, 'Alice', 100), so a TypeError occurs."
              },
              {
                "id": "C",
                "text": "It compiles fine and ignores the instance",
                "explanationIfWrong": "Argument count mismatch causes a runtime TypeError."
              },
              {
                "id": "D",
                "text": "SyntaxError during file import",
                "explanationIfWrong": "It is valid syntax, but fails at call time."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because Python automatically passes the instance as the first argument, an __init__ expecting 2 parameters receives 3, causing a TypeError."
          }
        ]
      },
      {
        "heading": "Passing Arguments to Constructors",
        "text": "Any parameters defined in __init__ after self become mandatory constructor arguments. If you attempt to instantiate the class without providing the required parameters, Python raises a TypeError.",
        "codeSnippet": "class User:\n    def __init__(self, username, email):\n        self.username = username\n        self.email = email\n\n# Correct call with 2 required arguments\nu = User(\"bimal_dev\", \"bimal@dopilot.com\")\nprint(f\"User: {u.username} <{u.email}>\")\n\ntry:\n    # Missing arguments raise TypeError\n    User()\nexcept TypeError as err:\n    print(f\"Caught error: {err}\")",
        "terminalOutput": "User: bimal_dev <bimal@dopilot.com>\nCaught error: User.__init__() missing 2 required positional arguments: 'username' and 'email'",
        "tip": "Keyword arguments can be used when calling constructors: User(username='bimal_dev', email='bimal@dopilot.com').",
        "mcq": {
          "id": "q-8-3-constructors-init-2-v1",
          "question": "What error is triggered if a class defines def __init__(self, id, name): and is called as obj = MyClass()?",
          "options": [
            {
              "id": "A",
              "text": "TypeError indicating missing required positional arguments",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "AttributeError",
              "explanationIfWrong": "AttributeError is for missing attributes, not missing arguments."
            },
            {
              "id": "C",
              "text": "ValueError",
              "explanationIfWrong": "Argument count mismatch raises TypeError."
            },
            {
              "id": "D",
              "text": "NullPointerException",
              "explanationIfWrong": "Python has no NullPointerException."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Omitting mandatory parameters declared in a function or method signature raises a TypeError."
        },
        "retestMcq": {
          "id": "q-8-3-constructors-init-2-v2",
          "question": "Can you use keyword arguments when calling a constructor, such as User(email='a@b.com', username='alice')?",
          "options": [
            {
              "id": "A",
              "text": "Yes, standard Python keyword argument rules apply to class instantiation",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, constructors only accept positional arguments",
              "explanationIfWrong": "Constructors accept keyword arguments like any Python function."
            },
            {
              "id": "C",
              "text": "Only if the class has a **kwargs parameter",
              "explanationIfWrong": "Named parameters accept keyword arguments directly."
            },
            {
              "id": "D",
              "text": "Only in Python 2",
              "explanationIfWrong": "Keyword arguments are standard in all modern Python versions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Constructors behave just like functions; arguments can be passed by position or by keyword."
        },
        "questionPool": [
          {
            "id": "q-8-3-constructors-init-2-v1",
            "question": "What error is triggered if a class defines def __init__(self, id, name): and is called as obj = MyClass()?",
            "options": [
              {
                "id": "A",
                "text": "TypeError indicating missing required positional arguments",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "AttributeError",
                "explanationIfWrong": "AttributeError is for missing attributes, not missing arguments."
              },
              {
                "id": "C",
                "text": "ValueError",
                "explanationIfWrong": "Argument count mismatch raises TypeError."
              },
              {
                "id": "D",
                "text": "NullPointerException",
                "explanationIfWrong": "Python has no NullPointerException."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Omitting mandatory parameters declared in a function or method signature raises a TypeError."
          },
          {
            "id": "q-8-3-constructors-init-2-v2",
            "question": "Can you use keyword arguments when calling a constructor, such as User(email='a@b.com', username='alice')?",
            "options": [
              {
                "id": "A",
                "text": "Yes, standard Python keyword argument rules apply to class instantiation",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, constructors only accept positional arguments",
                "explanationIfWrong": "Constructors accept keyword arguments like any Python function."
              },
              {
                "id": "C",
                "text": "Only if the class has a **kwargs parameter",
                "explanationIfWrong": "Named parameters accept keyword arguments directly."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Keyword arguments are standard in all modern Python versions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Constructors behave just like functions; arguments can be passed by position or by keyword."
          },
          {
            "id": "q-8-3-constructors-init-2-v3",
            "question": "Given class Box: def __init__(self, w, h): self.w = w; self.h = h, what does b = Box(3, 4) store in b.w?",
            "options": [
              {
                "id": "A",
                "text": "3",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "4",
                "explanationIfWrong": "3 is passed to w and 4 to h."
              },
              {
                "id": "C",
                "text": "12",
                "explanationIfWrong": "w is assigned 3, not the product."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "b.w is assigned 3."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Positional arguments bind in order: self is the new instance, w is 3, h is 4."
          }
        ]
      },
      {
        "heading": "Default Parameter Values in Constructors",
        "text": "Just like standard Python functions, __init__ parameters can be assigned default values. Parameters with defaults become optional during instantiation. If the caller provides a value, it overrides the default; otherwise, the default is applied.",
        "codeSnippet": "class Server:\n    def __init__(self, host=\"localhost\", port=8080, secure=False):\n        self.host = host\n        self.port = port\n        self.secure = secure\n\n# Using all defaults\ns1 = Server()\n# Overriding select values\ns2 = Server(host=\"api.dopilot.com\", secure=True)\n\nprint(f\"s1: {s1.host}:{s1.port} (secure={s1.secure})\")\nprint(f\"s2: {s2.host}:{s2.port} (secure={s2.secure})\")",
        "terminalOutput": "s1: localhost:8080 (secure=False)\ns2: api.dopilot.com:8080 (secure=True)",
        "tip": "Always place parameters without defaults before parameters with defaults in the method definition signature.",
        "mcq": {
          "id": "q-8-3-constructors-init-3-v1",
          "question": "What happens if a caller omits an argument that has a default value in __init__?",
          "options": [
            {
              "id": "A",
              "text": "The parameter automatically adopts its specified default value",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It raises a TypeError",
              "explanationIfWrong": "Default parameters are optional; omitting them is valid."
            },
            {
              "id": "C",
              "text": "The attribute is initialized to None",
              "explanationIfWrong": "It takes whatever default value was assigned in the signature."
            },
            {
              "id": "D",
              "text": "The class crashes at import time",
              "explanationIfWrong": "Default arguments are standard practice."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Parameters with defaults use that value when no argument is supplied by the caller."
        },
        "retestMcq": {
          "id": "q-8-3-constructors-init-3-v2",
          "question": "Which constructor signature has correct parameter ordering in Python?",
          "options": [
            {
              "id": "A",
              "text": "def __init__(self, name, age=18, active=True):",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "def __init__(self, age=18, name):",
              "explanationIfWrong": "Parameters without defaults cannot follow parameters with defaults."
            },
            {
              "id": "C",
              "text": "def __init__(self, age=18, active=True, name):",
              "explanationIfWrong": "Non-default parameters must come first."
            },
            {
              "id": "D",
              "text": "def __init__(name, self, age=18):",
              "explanationIfWrong": "self must be the first parameter."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Positional parameters without defaults must precede any parameters with default values."
        },
        "questionPool": [
          {
            "id": "q-8-3-constructors-init-3-v1",
            "question": "What happens if a caller omits an argument that has a default value in __init__?",
            "options": [
              {
                "id": "A",
                "text": "The parameter automatically adopts its specified default value",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It raises a TypeError",
                "explanationIfWrong": "Default parameters are optional; omitting them is valid."
              },
              {
                "id": "C",
                "text": "The attribute is initialized to None",
                "explanationIfWrong": "It takes whatever default value was assigned in the signature."
              },
              {
                "id": "D",
                "text": "The class crashes at import time",
                "explanationIfWrong": "Default arguments are standard practice."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Parameters with defaults use that value when no argument is supplied by the caller."
          },
          {
            "id": "q-8-3-constructors-init-3-v2",
            "question": "Which constructor signature has correct parameter ordering in Python?",
            "options": [
              {
                "id": "A",
                "text": "def __init__(self, name, age=18, active=True):",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "def __init__(self, age=18, name):",
                "explanationIfWrong": "Parameters without defaults cannot follow parameters with defaults."
              },
              {
                "id": "C",
                "text": "def __init__(self, age=18, active=True, name):",
                "explanationIfWrong": "Non-default parameters must come first."
              },
              {
                "id": "D",
                "text": "def __init__(name, self, age=18):",
                "explanationIfWrong": "self must be the first parameter."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Positional parameters without defaults must precede any parameters with default values."
          },
          {
            "id": "q-8-3-constructors-init-3-v3",
            "question": "Given class Lamp: def __init__(self, on=False): self.on = on. What is Lamp().on?",
            "options": [
              {
                "id": "A",
                "text": "False",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "True",
                "explanationIfWrong": "Default is False."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "The default value False is used."
              },
              {
                "id": "D",
                "text": "Raises an error",
                "explanationIfWrong": "Calling Lamp() with no arguments is valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since no argument was provided, self.on receives the default value False."
          }
        ]
      },
      {
        "heading": "Validation and Invariants in __init__",
        "text": "A class constructor is the gatekeeper of object integrity. By validating incoming parameters inside __init__ and raising exceptions (such as ValueError or TypeError) when inputs are invalid, you guarantee that an invalid or corrupt object can never exist in your program.",
        "codeSnippet": "class BankAccount:\n    def __init__(self, owner, balance=0.0):\n        if not owner or not owner.strip():\n            raise ValueError(\"Owner name cannot be empty.\")\n        if balance < 0:\n            raise ValueError(\"Initial balance cannot be negative.\")\n        \n        self.owner = owner.strip()\n        self.balance = float(balance)\n\nvalid = BankAccount(\"Alice\", 150.0)\nprint(f\"Account for {valid.owner}: ${valid.balance:.2f}\")\n\ntry:\n    invalid = BankAccount(\"Bob\", -50.0)\nexcept ValueError as err:\n    print(f\"Rejected creation: {err}\")",
        "terminalOutput": "Account for Alice: $150.00\nRejected creation: Initial balance cannot be negative.",
        "warning": "If __init__ raises an exception, the object construction fails immediately and no valid reference is returned to the caller.",
        "mcq": {
          "id": "q-8-3-constructors-init-4-v1",
          "question": "What is the primary benefit of raising a ValueError inside __init__ when invalid data is provided?",
          "options": [
            {
              "id": "A",
              "text": "It enforces invariants and prevents corrupt or invalid objects from ever being instantiated",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It automatically converts negative numbers to positive numbers",
              "explanationIfWrong": "Raising an exception aborts instantiation rather than fixing data."
            },
            {
              "id": "C",
              "text": "It resets the system clock",
              "explanationIfWrong": "Exceptions handle errors, not system clocks."
            },
            {
              "id": "D",
              "text": "It shuts down the Python interpreter",
              "explanationIfWrong": "Exceptions can be caught with try/except."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Validating in __init__ ensures that every live instance satisfies the class's business rules (invariants)."
        },
        "retestMcq": {
          "id": "q-8-3-constructors-init-4-v2",
          "question": "If an exception is raised inside __init__, does the variable receiving the instantiation hold an object?",
          "options": [
            {
              "id": "A",
              "text": "No, object creation is aborted and the variable is not bound to any object",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Yes, it holds a partially constructed object with missing fields",
              "explanationIfWrong": "The assignment never completes; the exception propagates outward."
            },
            {
              "id": "C",
              "text": "The variable is bound to None",
              "explanationIfWrong": "The variable assignment is never reached."
            },
            {
              "id": "D",
              "text": "The variable is deleted from the filesystem",
              "explanationIfWrong": "Python variables exist in memory scopes."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "When __init__ raises an error, the assignment statement fails, leaving the variable unbound."
        },
        "questionPool": [
          {
            "id": "q-8-3-constructors-init-4-v1",
            "question": "What is the primary benefit of raising a ValueError inside __init__ when invalid data is provided?",
            "options": [
              {
                "id": "A",
                "text": "It enforces invariants and prevents corrupt or invalid objects from ever being instantiated",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It automatically converts negative numbers to positive numbers",
                "explanationIfWrong": "Raising an exception aborts instantiation rather than fixing data."
              },
              {
                "id": "C",
                "text": "It resets the system clock",
                "explanationIfWrong": "Exceptions handle errors, not system clocks."
              },
              {
                "id": "D",
                "text": "It shuts down the Python interpreter",
                "explanationIfWrong": "Exceptions can be caught with try/except."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Validating in __init__ ensures that every live instance satisfies the class's business rules (invariants)."
          },
          {
            "id": "q-8-3-constructors-init-4-v2",
            "question": "If an exception is raised inside __init__, does the variable receiving the instantiation hold an object?",
            "options": [
              {
                "id": "A",
                "text": "No, object creation is aborted and the variable is not bound to any object",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, it holds a partially constructed object with missing fields",
                "explanationIfWrong": "The assignment never completes; the exception propagates outward."
              },
              {
                "id": "C",
                "text": "The variable is bound to None",
                "explanationIfWrong": "The variable assignment is never reached."
              },
              {
                "id": "D",
                "text": "The variable is deleted from the filesystem",
                "explanationIfWrong": "Python variables exist in memory scopes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When __init__ raises an error, the assignment statement fails, leaving the variable unbound."
          },
          {
            "id": "q-8-3-constructors-init-4-v3",
            "question": "Which check inside def __init__(self, age): properly forbids negative ages?",
            "options": [
              {
                "id": "A",
                "text": "if age < 0: raise ValueError('Age cannot be negative')",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "if age < 0: return False",
                "explanationIfWrong": "__init__ cannot return False; it raises TypeError."
              },
              {
                "id": "C",
                "text": "if age < 0: pass",
                "explanationIfWrong": "pass does not stop negative ages from being stored."
              },
              {
                "id": "D",
                "text": "age = abs(age)",
                "explanationIfWrong": "Silently altering input may hide bugs instead of flagging errors."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Raising a ValueError is the standard, idiomatic way to reject invalid arguments in constructors."
          }
        ]
      },
      {
        "heading": "Default Non-Argument Attributes & Mutable Traps",
        "text": "Not every instance attribute needs to come from a constructor argument. Many attributes are initialized to fixed baseline states, like empty lists, empty dictionaries, timestamps, or counters. Beware: never use a mutable object (like a list or dict) as a default parameter in the function signature (def __init__(self, items=[]):); always use None and initialize inside the body.",
        "codeSnippet": "class ShoppingCart:\n    def __init__(self, customer_name, items=None):\n        self.customer_name = customer_name\n        # Safe initialization of mutable attribute\n        if items is None:\n            self.items = []\n        else:\n            self.items = list(items)  # Copy to avoid sharing\n        self.total_spent = 0.0\n\ncart1 = ShoppingCart(\"Alice\")\ncart1.items.append(\"Laptop\")\n\ncart2 = ShoppingCart(\"Bob\")\nprint(f\"cart1 items: {cart1.items}\")\nprint(f\"cart2 items: {cart2.items}\")  # Independent empty list!",
        "terminalOutput": "cart1 items: ['Laptop']\ncart2 items: []",
        "warning": "Writing def __init__(self, items=[]): shares a single list among ALL instances created with default arguments. Always use items=None!",
        "mcq": {
          "id": "q-8-3-constructors-init-5-v1",
          "question": "Why is def __init__(self, items=[]): dangerous in Python?",
          "options": [
            {
              "id": "A",
              "text": "Default argument expressions are evaluated once at definition time, causing all instances to share the exact same list",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python refuses to compile functions with empty list defaults",
              "explanationIfWrong": "It compiles, but causes subtle shared-state bugs."
            },
            {
              "id": "C",
              "text": "Lists can only hold strings inside constructors",
              "explanationIfWrong": "Lists can hold any type."
            },
            {
              "id": "D",
              "text": "The list is deleted when __init__ finishes",
              "explanationIfWrong": "The default object persists in function metadata across all calls."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Mutable default arguments are shared across all invocations. The safe pattern is def __init__(self, items=None): self.items = [] if items is None else list(items)."
        },
        "retestMcq": {
          "id": "q-8-3-constructors-init-5-v2",
          "question": "What is the idiomatic pattern for initializing a list attribute that defaults to empty?",
          "options": [
            {
              "id": "A",
              "text": "def __init__(self, items=None): self.items = [] if items is None else list(items)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "def __init__(self, items=[]): self.items = items",
              "explanationIfWrong": "This exhibits the mutable default argument bug."
            },
            {
              "id": "C",
              "text": "def __init__(self): self.items = items",
              "explanationIfWrong": "items is not defined in this scope."
            },
            {
              "id": "D",
              "text": "def __init__(self): return []",
              "explanationIfWrong": "__init__ cannot return values."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Using None as the default sentinel value ensures each instance gets a fresh list allocated in memory."
        },
        "questionPool": [
          {
            "id": "q-8-3-constructors-init-5-v1",
            "question": "Why is def __init__(self, items=[]): dangerous in Python?",
            "options": [
              {
                "id": "A",
                "text": "Default argument expressions are evaluated once at definition time, causing all instances to share the exact same list",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python refuses to compile functions with empty list defaults",
                "explanationIfWrong": "It compiles, but causes subtle shared-state bugs."
              },
              {
                "id": "C",
                "text": "Lists can only hold strings inside constructors",
                "explanationIfWrong": "Lists can hold any type."
              },
              {
                "id": "D",
                "text": "The list is deleted when __init__ finishes",
                "explanationIfWrong": "The default object persists in function metadata across all calls."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Mutable default arguments are shared across all invocations. The safe pattern is def __init__(self, items=None): self.items = [] if items is None else list(items)."
          },
          {
            "id": "q-8-3-constructors-init-5-v2",
            "question": "What is the idiomatic pattern for initializing a list attribute that defaults to empty?",
            "options": [
              {
                "id": "A",
                "text": "def __init__(self, items=None): self.items = [] if items is None else list(items)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "def __init__(self, items=[]): self.items = items",
                "explanationIfWrong": "This exhibits the mutable default argument bug."
              },
              {
                "id": "C",
                "text": "def __init__(self): self.items = items",
                "explanationIfWrong": "items is not defined in this scope."
              },
              {
                "id": "D",
                "text": "def __init__(self): return []",
                "explanationIfWrong": "__init__ cannot return values."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Using None as the default sentinel value ensures each instance gets a fresh list allocated in memory."
          },
          {
            "id": "q-8-3-constructors-init-5-v3",
            "question": "Can an attribute be initialized to a fixed value (e.g. self.status = 'active') without being in the __init__ parameter list?",
            "options": [
              {
                "id": "A",
                "text": "Yes, attributes can be set to any fixed initial value directly in the body of __init__",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, every attribute must be listed in the __init__ parameters",
                "explanationIfWrong": "Only values supplied by the caller need to be parameters."
              },
              {
                "id": "C",
                "text": "Only if declared as global",
                "explanationIfWrong": "self.status belongs to the instance, not global scope."
              },
              {
                "id": "D",
                "text": "Only if status is an integer",
                "explanationIfWrong": "Attributes can be any type."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Initial state (like status='active' or balance=0) is commonly set directly on self in __init__."
          }
        ]
      }
    ]
  },
  {
    "id": "8-4-methods-and-self",
    "number": "8.4",
    "title": "Defining Methods & self",
    "subtitle": "Equip classes with behavior by defining instance methods, mutating state, and calling helper methods.",
    "readTime": "20 min",
    "objectives": [
      "Define custom instance methods inside a class with def and self",
      "Understand how Python binds object.method(arg) to Class.method(object, arg)",
      "Mutate internal instance state safely through well-defined method interfaces",
      "Return computed values and query internal state without exposing raw variables",
      "Invoke sibling methods on the same object using self.other_method()",
      "Implement method chaining patterns by returning self"
    ],
    "theoryBlocks": [
      {
        "heading": "Defining Instance Methods",
        "text": "An instance method is a function defined inside a class body whose first parameter is self. Methods define what actions an object can perform. When invoked via dot notation (e.g. account.deposit(100)), the instance account is automatically passed as the self argument.",
        "codeSnippet": "class Dog:\n    def __init__(self, name, bark_sound=\"Woof!\"):\n        self.name = name\n        self.bark_sound = bark_sound\n    \n    def bark(self):\n        return f\"{self.name} says {self.bark_sound}\"\n\nd = Dog(\"Buddy\", \"Arf!\")\nprint(d.bark())",
        "terminalOutput": "Buddy says Arf!",
        "tip": "Methods bridge data and behavior, allowing objects to encapsulate both what they know (attributes) and what they can do (methods).",
        "mcq": {
          "id": "q-8-4-methods-and-self-0-v1",
          "question": "What is the defining characteristic of an instance method in a Python class?",
          "options": [
            {
              "id": "A",
              "text": "It is defined inside the class body and has self as its first parameter",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It can only be executed by importing the math module",
              "explanationIfWrong": "Methods are standard Python functions within a class."
            },
            {
              "id": "C",
              "text": "It cannot accept any arguments other than self",
              "explanationIfWrong": "Methods can accept any number of parameters after self."
            },
            {
              "id": "D",
              "text": "It must always return None",
              "explanationIfWrong": "Methods can return any value or object."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Instance methods take self as their first parameter, receiving the instance on which they are called."
        },
        "retestMcq": {
          "id": "q-8-4-methods-and-self-0-v2",
          "question": "When you call rover.bark(), what is Python doing behind the scenes?",
          "options": [
            {
              "id": "A",
              "text": "Dog.bark(rover)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "bark(Dog, rover)",
              "explanationIfWrong": "Dog.bark is the function on the class, taking rover as self."
            },
            {
              "id": "C",
              "text": "rover.__call__()",
              "explanationIfWrong": "Calling a method is bound method dispatch to the class method."
            },
            {
              "id": "D",
              "text": "global.bark(rover)",
              "explanationIfWrong": "bark is not in global scope."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "rover.bark() is syntactic sugar for Dog.bark(rover), where rover is bound to self."
        },
        "questionPool": [
          {
            "id": "q-8-4-methods-and-self-0-v1",
            "question": "What is the defining characteristic of an instance method in a Python class?",
            "options": [
              {
                "id": "A",
                "text": "It is defined inside the class body and has self as its first parameter",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It can only be executed by importing the math module",
                "explanationIfWrong": "Methods are standard Python functions within a class."
              },
              {
                "id": "C",
                "text": "It cannot accept any arguments other than self",
                "explanationIfWrong": "Methods can accept any number of parameters after self."
              },
              {
                "id": "D",
                "text": "It must always return None",
                "explanationIfWrong": "Methods can return any value or object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Instance methods take self as their first parameter, receiving the instance on which they are called."
          },
          {
            "id": "q-8-4-methods-and-self-0-v2",
            "question": "When you call rover.bark(), what is Python doing behind the scenes?",
            "options": [
              {
                "id": "A",
                "text": "Dog.bark(rover)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "bark(Dog, rover)",
                "explanationIfWrong": "Dog.bark is the function on the class, taking rover as self."
              },
              {
                "id": "C",
                "text": "rover.__call__()",
                "explanationIfWrong": "Calling a method is bound method dispatch to the class method."
              },
              {
                "id": "D",
                "text": "global.bark(rover)",
                "explanationIfWrong": "bark is not in global scope."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "rover.bark() is syntactic sugar for Dog.bark(rover), where rover is bound to self."
          },
          {
            "id": "q-8-4-methods-and-self-0-v3",
            "question": "Can an instance method accept additional parameters beyond self?",
            "options": [
              {
                "id": "A",
                "text": "Yes, any number of positional, keyword, or default parameters can follow self",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, instance methods can only take self",
                "explanationIfWrong": "Methods accept parameters like any Python function."
              },
              {
                "id": "C",
                "text": "Only up to 2 extra parameters",
                "explanationIfWrong": "Python has no arbitrary limit on method parameters."
              },
              {
                "id": "D",
                "text": "Only if all parameters are strings",
                "explanationIfWrong": "Parameters can be of any data type."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Instance methods accept whatever parameters are necessary after the mandatory first self argument."
          }
        ]
      },
      {
        "heading": "Why self is Explicit in Python",
        "text": "Unlike languages like Java or C++ where this is implicit, Python chose explicit self to keep scoping rules clear and prevent ambiguity between local variables and instance attributes. If you omit self. inside a method, Python searches local variables and then global variables \u2014 it will never look inside the object.",
        "codeSnippet": "class Counter:\n    def __init__(self):\n        self.val = 0\n    \n    def bad_increment(self):\n        val = 10  # Creates a local variable; DOES NOT TOUCH self.val!\n    \n    def good_increment(self):\n        self.val += 1  # Updates instance attribute directly\n\nc = Counter()\nc.bad_increment()\nprint(f\"After bad_increment: {c.val}\")\n\nc.good_increment()\nprint(f\"After good_increment: {c.val}\")",
        "terminalOutput": "After bad_increment: 0\nAfter good_increment: 1",
        "warning": "Always prefix instance attribute references with self. (e.g. self.balance). Omitting self. creates an isolated local variable that vanishes when the method exits.",
        "mcq": {
          "id": "q-8-4-methods-and-self-1-v1",
          "question": "What happens if you write balance += 10 instead of self.balance += 10 inside an instance method?",
          "options": [
            {
              "id": "A",
              "text": "An UnboundLocalError occurs because balance is treated as an uninitialized local variable",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python automatically updates self.balance",
              "explanationIfWrong": "Python never implicitly looks in self for unqualified variable names."
            },
            {
              "id": "C",
              "text": "A global variable named balance is created",
              "explanationIfWrong": "Without global keyword, assignments create local variables."
            },
            {
              "id": "D",
              "text": "The entire class is deleted",
              "explanationIfWrong": "Scoping errors raise standard exceptions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without self., Python treats balance as a local variable. Since it hasn't been defined locally, += raises UnboundLocalError."
        },
        "retestMcq": {
          "id": "q-8-4-methods-and-self-1-v2",
          "question": "Why did the creators of Python design self to be explicit rather than implicit?",
          "options": [
            {
              "id": "A",
              "text": "To follow 'Explicit is better than implicit' and avoid confusing instance attributes with local variables",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because Python's compiler is unable to parse method names",
              "explanationIfWrong": "It was an intentional Zen of Python design choice."
            },
            {
              "id": "C",
              "text": "To prevent functions from calling methods",
              "explanationIfWrong": "Functions can call methods on objects freely."
            },
            {
              "id": "D",
              "text": "Because memory pointers require 4-letter words",
              "explanationIfWrong": "self is just a parameter name convention."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Zen of Python states: 'Explicit is better than implicit'. self. explicitly signals an instance attribute."
        },
        "questionPool": [
          {
            "id": "q-8-4-methods-and-self-1-v1",
            "question": "What happens if you write balance += 10 instead of self.balance += 10 inside an instance method?",
            "options": [
              {
                "id": "A",
                "text": "An UnboundLocalError occurs because balance is treated as an uninitialized local variable",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python automatically updates self.balance",
                "explanationIfWrong": "Python never implicitly looks in self for unqualified variable names."
              },
              {
                "id": "C",
                "text": "A global variable named balance is created",
                "explanationIfWrong": "Without global keyword, assignments create local variables."
              },
              {
                "id": "D",
                "text": "The entire class is deleted",
                "explanationIfWrong": "Scoping errors raise standard exceptions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without self., Python treats balance as a local variable. Since it hasn't been defined locally, += raises UnboundLocalError."
          },
          {
            "id": "q-8-4-methods-and-self-1-v2",
            "question": "Why did the creators of Python design self to be explicit rather than implicit?",
            "options": [
              {
                "id": "A",
                "text": "To follow 'Explicit is better than implicit' and avoid confusing instance attributes with local variables",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python's compiler is unable to parse method names",
                "explanationIfWrong": "It was an intentional Zen of Python design choice."
              },
              {
                "id": "C",
                "text": "To prevent functions from calling methods",
                "explanationIfWrong": "Functions can call methods on objects freely."
              },
              {
                "id": "D",
                "text": "Because memory pointers require 4-letter words",
                "explanationIfWrong": "self is just a parameter name convention."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Zen of Python states: 'Explicit is better than implicit'. self. explicitly signals an instance attribute."
          },
          {
            "id": "q-8-4-methods-and-self-1-v3",
            "question": "In a method header def calculate(self, rate):, which parameter must be passed explicitly by the caller when doing obj.calculate(0.05)?",
            "options": [
              {
                "id": "A",
                "text": "Only rate (0.05); Python automatically supplies obj as self",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Both obj and 0.05",
                "explanationIfWrong": "You only pass 0.05 when calling obj.calculate(0.05)."
              },
              {
                "id": "C",
                "text": "Neither",
                "explanationIfWrong": "rate is a required parameter."
              },
              {
                "id": "D",
                "text": "self only",
                "explanationIfWrong": "self is injected automatically."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When calling through dot notation (obj.calculate(0.05)), Python supplies obj as self; the caller only supplies rate."
          }
        ]
      },
      {
        "heading": "Mutating State with Methods",
        "text": "The primary role of methods in Object-Oriented Programming is to safely manipulate the object's internal state while enforcing rules and preventing invalid states from occurring.",
        "codeSnippet": "class Wallet:\n    def __init__(self, initial_cash=0.0):\n        self.cash = float(initial_cash)\n    \n    def add_cash(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Deposit amount must be positive.\")\n        self.cash += amount\n        return self.cash\n    \n    def spend_cash(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Spend amount must be positive.\")\n        if amount > self.cash:\n            return False  # Insufficient funds\n        self.cash -= amount\n        return True\n\nw = Wallet(50)\nw.add_cash(25)\nprint(f\"Current cash: ${w.cash:.2f}\")\nsuccess = w.spend_cash(100)\nprint(f\"Spent $100? {success}, Balance: ${w.cash:.2f}\")",
        "terminalOutput": "Current cash: $75.00\nSpent $100? False, Balance: $75.00",
        "tip": "Encapsulating mutations inside methods allows you to add validation, logging, and events whenever state changes.",
        "mcq": {
          "id": "q-8-4-methods-and-self-2-v1",
          "question": "Why is it preferable to modify object data through methods (e.g. w.spend_cash(50)) rather than directly updating attributes (w.cash -= 50)?",
          "options": [
            {
              "id": "A",
              "text": "Methods can validate inputs, enforce constraints (like preventing negative balances), and log changes",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Direct attribute modification is illegal in Python and triggers a SyntaxError",
              "explanationIfWrong": "Direct modification is syntactically allowed, but poor design."
            },
            {
              "id": "C",
              "text": "Methods run in separate CPU threads automatically",
              "explanationIfWrong": "Methods execute synchronously on the same thread."
            },
            {
              "id": "D",
              "text": "Direct modification always deletes the variable",
              "explanationIfWrong": "Direct modification changes the value directly without checks."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Methods encapsulate business logic and prevent the object from entering an inconsistent or corrupt state."
        },
        "retestMcq": {
          "id": "q-8-4-methods-and-self-2-v2",
          "question": "What is the cash balance if a user attempts to spend $100 from a wallet with $75 using spend_cash above?",
          "options": [
            {
              "id": "A",
              "text": "$75.00, because the method rejects the spend and leaves balance untouched",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "-$25.00",
              "explanationIfWrong": "The method checks if amount > self.cash and returns False without subtracting."
            },
            {
              "id": "C",
              "text": "$0.00",
              "explanationIfWrong": "The balance is not modified when funds are insufficient."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "The cash attribute remains 75.0."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because amount (100) exceeds cash (75), the guard clause returns False without deducting funds."
        },
        "questionPool": [
          {
            "id": "q-8-4-methods-and-self-2-v1",
            "question": "Why is it preferable to modify object data through methods (e.g. w.spend_cash(50)) rather than directly updating attributes (w.cash -= 50)?",
            "options": [
              {
                "id": "A",
                "text": "Methods can validate inputs, enforce constraints (like preventing negative balances), and log changes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Direct attribute modification is illegal in Python and triggers a SyntaxError",
                "explanationIfWrong": "Direct modification is syntactically allowed, but poor design."
              },
              {
                "id": "C",
                "text": "Methods run in separate CPU threads automatically",
                "explanationIfWrong": "Methods execute synchronously on the same thread."
              },
              {
                "id": "D",
                "text": "Direct modification always deletes the variable",
                "explanationIfWrong": "Direct modification changes the value directly without checks."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Methods encapsulate business logic and prevent the object from entering an inconsistent or corrupt state."
          },
          {
            "id": "q-8-4-methods-and-self-2-v2",
            "question": "What is the cash balance if a user attempts to spend $100 from a wallet with $75 using spend_cash above?",
            "options": [
              {
                "id": "A",
                "text": "$75.00, because the method rejects the spend and leaves balance untouched",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "-$25.00",
                "explanationIfWrong": "The method checks if amount > self.cash and returns False without subtracting."
              },
              {
                "id": "C",
                "text": "$0.00",
                "explanationIfWrong": "The balance is not modified when funds are insufficient."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The cash attribute remains 75.0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because amount (100) exceeds cash (75), the guard clause returns False without deducting funds."
          },
          {
            "id": "q-8-4-methods-and-self-2-v3",
            "question": "What happens if add_cash(-10) is called on Wallet?",
            "options": [
              {
                "id": "A",
                "text": "Raises a ValueError('Deposit amount must be positive.')",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Deducts 10 from cash",
                "explanationIfWrong": "The guard clause checks amount <= 0 and raises an error."
              },
              {
                "id": "C",
                "text": "Returns False",
                "explanationIfWrong": "The method explicitly raises a ValueError."
              },
              {
                "id": "D",
                "text": "Silently ignores the call",
                "explanationIfWrong": "The exception halts execution if unhandled."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The validation check raises a ValueError immediately when amount <= 0."
          }
        ]
      },
      {
        "heading": "Methods with Return Values",
        "text": "Methods can perform calculations on their attributes and return results to the caller without changing any internal state. These are often called query or getter methods.",
        "codeSnippet": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n    \n    def perimeter(self):\n        return 2 * (self.width + self.height)\n    \n    def is_square(self):\n        return self.width == self.height\n\nrect = Rectangle(10, 5)\nprint(f\"Area: {rect.area()}\")\nprint(f\"Perimeter: {rect.perimeter()}\")\nprint(f\"Is Square? {rect.is_square()}\")",
        "terminalOutput": "Area: 50\nPerimeter: 30\nIs Square? False",
        "tip": "Query methods calculate derived values dynamically, so if width changes later, rect.area() automatically reflects the new value without needing stored copies.",
        "mcq": {
          "id": "q-8-4-methods-and-self-3-v1",
          "question": "What is the benefit of computing area() dynamically via a method rather than storing self.area = width * height in __init__?",
          "options": [
            {
              "id": "A",
              "text": "If width or height is modified later, area() always calculates the accurate current area without becoming stale",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Methods are cached in GPU memory",
              "explanationIfWrong": "Methods run on standard Python CPU execution."
            },
            {
              "id": "C",
              "text": "Storing attributes takes 1000x more disk space",
              "explanationIfWrong": "Memory overhead is minimal; the issue is data consistency and staleness."
            },
            {
              "id": "D",
              "text": "Dynamic calculation prevents garbage collection",
              "explanationIfWrong": "It has nothing to do with garbage collection."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Calculating derived values on demand avoids stale data bugs when the underlying attributes change."
        },
        "retestMcq": {
          "id": "q-8-4-methods-and-self-3-v2",
          "question": "Given r = Rectangle(4, 4), what does r.is_square() return?",
          "options": [
            {
              "id": "A",
              "text": "True",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "False",
              "explanationIfWrong": "4 == 4 evaluates to True."
            },
            {
              "id": "C",
              "text": "16",
              "explanationIfWrong": "is_square returns a boolean, not the area."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "The return statement returns the boolean comparison result."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since width == height (4 == 4), is_square() returns True."
        },
        "questionPool": [
          {
            "id": "q-8-4-methods-and-self-3-v1",
            "question": "What is the benefit of computing area() dynamically via a method rather than storing self.area = width * height in __init__?",
            "options": [
              {
                "id": "A",
                "text": "If width or height is modified later, area() always calculates the accurate current area without becoming stale",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Methods are cached in GPU memory",
                "explanationIfWrong": "Methods run on standard Python CPU execution."
              },
              {
                "id": "C",
                "text": "Storing attributes takes 1000x more disk space",
                "explanationIfWrong": "Memory overhead is minimal; the issue is data consistency and staleness."
              },
              {
                "id": "D",
                "text": "Dynamic calculation prevents garbage collection",
                "explanationIfWrong": "It has nothing to do with garbage collection."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calculating derived values on demand avoids stale data bugs when the underlying attributes change."
          },
          {
            "id": "q-8-4-methods-and-self-3-v2",
            "question": "Given r = Rectangle(4, 4), what does r.is_square() return?",
            "options": [
              {
                "id": "A",
                "text": "True",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "False",
                "explanationIfWrong": "4 == 4 evaluates to True."
              },
              {
                "id": "C",
                "text": "16",
                "explanationIfWrong": "is_square returns a boolean, not the area."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The return statement returns the boolean comparison result."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since width == height (4 == 4), is_square() returns True."
          },
          {
            "id": "q-8-4-methods-and-self-3-v3",
            "question": "What is returned if a method executes to completion without reaching a return statement?",
            "options": [
              {
                "id": "A",
                "text": "None",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "0",
                "explanationIfWrong": "Python functions/methods return None by default."
              },
              {
                "id": "C",
                "text": "False",
                "explanationIfWrong": "None is the implicit return value."
              },
              {
                "id": "D",
                "text": "Raises a NoReturnError",
                "explanationIfWrong": "Omitting return is valid and implicitly returns None."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "All Python functions and methods return None implicitly if no return statement is executed."
          }
        ]
      },
      {
        "heading": "Calling Sibling Methods with self",
        "text": "An instance method can call any other method belonging to the same object by using self.method_name(). This allows complex behaviors to be broken down into clean, reusable helper methods.",
        "codeSnippet": "class Order:\n    def __init__(self, item_name, price, quantity):\n        self.item_name = item_name\n        self.price = price\n        self.quantity = quantity\n    \n    def subtotal(self):\n        return self.price * self.quantity\n    \n    def tax(self, rate=0.08):\n        # Calling sibling method subtotal() using self\n        return self.subtotal() * rate\n    \n    def total(self):\n        # Combining sibling methods\n        return self.subtotal() + self.tax()\n\no = Order(\"Keyboard\", 75.0, 2)\nprint(f\"Subtotal: ${o.subtotal():.2f}\")\nprint(f\"Tax:      ${o.tax():.2f}\")\nprint(f\"Total:    ${o.total():.2f}\")",
        "terminalOutput": "Subtotal: $150.00\nTax:      $12.00\nTotal:    $162.00",
        "tip": "Calling sibling methods with self. ensures that if a subclass overrides a helper method, the calling method automatically uses the updated version (polymorphism).",
        "mcq": {
          "id": "q-8-4-methods-and-self-4-v1",
          "question": "How does a method inside a class call another method defined on the same class instance?",
          "options": [
            {
              "id": "A",
              "text": "Using self.sibling_method(args)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Using this.sibling_method(args)",
              "explanationIfWrong": "this is Java/C++ syntax; Python uses self."
            },
            {
              "id": "C",
              "text": "Calling sibling_method(args) directly without self",
              "explanationIfWrong": "Without self, Python looks for a global function, not an instance method."
            },
            {
              "id": "D",
              "text": "Using super().sibling_method()",
              "explanationIfWrong": "super() calls parent class methods, not the current instance's methods."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "To call another method on the current instance, you must prefix the call with self."
        },
        "retestMcq": {
          "id": "q-8-4-methods-and-self-4-v2",
          "question": "What happens if you call subtotal() inside total() without self. (e.g. return subtotal() + tax())?",
          "options": [
            {
              "id": "A",
              "text": "NameError: name 'subtotal' is not defined",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python automatically calls self.subtotal()",
              "explanationIfWrong": "Python does not automatically resolve unqualified names to self attributes."
            },
            {
              "id": "C",
              "text": "A RecursionError is raised",
              "explanationIfWrong": "Recursion requires calling itself; here it fails to find the function."
            },
            {
              "id": "D",
              "text": "It returns 0",
              "explanationIfWrong": "A NameError is raised immediately."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Methods are stored in the class namespace, so calling them requires qualification via self.method()."
        },
        "questionPool": [
          {
            "id": "q-8-4-methods-and-self-4-v1",
            "question": "How does a method inside a class call another method defined on the same class instance?",
            "options": [
              {
                "id": "A",
                "text": "Using self.sibling_method(args)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Using this.sibling_method(args)",
                "explanationIfWrong": "this is Java/C++ syntax; Python uses self."
              },
              {
                "id": "C",
                "text": "Calling sibling_method(args) directly without self",
                "explanationIfWrong": "Without self, Python looks for a global function, not an instance method."
              },
              {
                "id": "D",
                "text": "Using super().sibling_method()",
                "explanationIfWrong": "super() calls parent class methods, not the current instance's methods."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "To call another method on the current instance, you must prefix the call with self."
          },
          {
            "id": "q-8-4-methods-and-self-4-v2",
            "question": "What happens if you call subtotal() inside total() without self. (e.g. return subtotal() + tax())?",
            "options": [
              {
                "id": "A",
                "text": "NameError: name 'subtotal' is not defined",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python automatically calls self.subtotal()",
                "explanationIfWrong": "Python does not automatically resolve unqualified names to self attributes."
              },
              {
                "id": "C",
                "text": "A RecursionError is raised",
                "explanationIfWrong": "Recursion requires calling itself; here it fails to find the function."
              },
              {
                "id": "D",
                "text": "It returns 0",
                "explanationIfWrong": "A NameError is raised immediately."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Methods are stored in the class namespace, so calling them requires qualification via self.method()."
          },
          {
            "id": "q-8-4-methods-and-self-4-v3",
            "question": "In the Order example, what is the computed total() for 1 item costing $100 with an 8% tax rate?",
            "options": [
              {
                "id": "A",
                "text": "$108.00",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "$100.00",
                "explanationIfWrong": "Subtotal (100) + tax (8) = 108."
              },
              {
                "id": "C",
                "text": "$116.00",
                "explanationIfWrong": "Quantity is 1, so subtotal is 100."
              },
              {
                "id": "D",
                "text": "$92.00",
                "explanationIfWrong": "Tax is added to subtotal, not subtracted."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Subtotal is $100, tax is $8 (100 * 0.08), totaling $108.00."
          }
        ]
      },
      {
        "heading": "Method Chaining and Fluent Interfaces",
        "text": "By having state-mutating methods return self (the object reference itself), you enable method chaining \u2014 calling multiple methods in a single, elegant line of code.",
        "codeSnippet": "class QueryBuilder:\n    def __init__(self, table):\n        self.table = table\n        self.filters = []\n        self.limit_num = None\n    \n    def where(self, condition):\n        self.filters.append(condition)\n        return self  # Return self to enable chaining!\n    \n    def limit(self, count):\n        self.limit_num = count\n        return self  # Return self to enable chaining!\n    \n    def build(self):\n        q = f\"SELECT * FROM {self.table}\"\n        if self.filters:\n            q += f\" WHERE {' AND '.join(self.filters)}\"\n        if self.limit_num is not None:\n            q += f\" LIMIT {self.limit_num}\"\n        return q\n\nquery = QueryBuilder(\"users\").where(\"age >= 18\").where(\"active = 1\").limit(10).build()\nprint(query)",
        "terminalOutput": "SELECT * FROM users WHERE age >= 18 AND active = 1 LIMIT 10",
        "tip": "Fluent interfaces are widely used in modern Python libraries such as pandas, SQLAlchemy, and Django QuerySets.",
        "mcq": {
          "id": "q-8-4-methods-and-self-5-v1",
          "question": "What must an instance method return to allow consecutive chained calls like obj.step1().step2().step3()?",
          "options": [
            {
              "id": "A",
              "text": "self (the instance itself)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "None",
              "explanationIfWrong": "Returning None breaks the chain because None has no methods like step2()."
            },
            {
              "id": "C",
              "text": "True",
              "explanationIfWrong": "booleans do not possess the class's methods."
            },
            {
              "id": "D",
              "text": "A new copy of the class type",
              "explanationIfWrong": "Returning self operates on and returns the active instance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Returning self passes the active object to the next method in the chain."
        },
        "retestMcq": {
          "id": "q-8-4-methods-and-self-5-v2",
          "question": "What error occurs when chaining a method that returns None (e.g. items.append(1).append(2))?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: 'NoneType' object has no attribute 'append'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "TypeError: append takes exactly 2 arguments",
              "explanationIfWrong": "The error happens because the first append returned None."
            },
            {
              "id": "C",
              "text": "ValueError",
              "explanationIfWrong": "AttributeError occurs on NoneType."
            },
            {
              "id": "D",
              "text": "SyntaxError",
              "explanationIfWrong": "The syntax is valid; it fails at runtime because the intermediate result is None."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because append() returns None, attempting to call .append() on that return value triggers AttributeError on NoneType."
        },
        "questionPool": [
          {
            "id": "q-8-4-methods-and-self-5-v1",
            "question": "What must an instance method return to allow consecutive chained calls like obj.step1().step2().step3()?",
            "options": [
              {
                "id": "A",
                "text": "self (the instance itself)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "None",
                "explanationIfWrong": "Returning None breaks the chain because None has no methods like step2()."
              },
              {
                "id": "C",
                "text": "True",
                "explanationIfWrong": "booleans do not possess the class's methods."
              },
              {
                "id": "D",
                "text": "A new copy of the class type",
                "explanationIfWrong": "Returning self operates on and returns the active instance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Returning self passes the active object to the next method in the chain."
          },
          {
            "id": "q-8-4-methods-and-self-5-v2",
            "question": "What error occurs when chaining a method that returns None (e.g. items.append(1).append(2))?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: 'NoneType' object has no attribute 'append'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "TypeError: append takes exactly 2 arguments",
                "explanationIfWrong": "The error happens because the first append returned None."
              },
              {
                "id": "C",
                "text": "ValueError",
                "explanationIfWrong": "AttributeError occurs on NoneType."
              },
              {
                "id": "D",
                "text": "SyntaxError",
                "explanationIfWrong": "The syntax is valid; it fails at runtime because the intermediate result is None."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because append() returns None, attempting to call .append() on that return value triggers AttributeError on NoneType."
          },
          {
            "id": "q-8-4-methods-and-self-5-v3",
            "question": "In the QueryBuilder example, what does QueryBuilder('products').where('price < 50') return?",
            "options": [
              {
                "id": "A",
                "text": "The same QueryBuilder instance with the filter recorded in its list",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The SQL query string directly",
                "explanationIfWrong": "build() returns the SQL string; where() returns self."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "where() returns self explicitly."
              },
              {
                "id": "D",
                "text": "A list of products",
                "explanationIfWrong": "It builds the query specification."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "where() mutates self.filters and returns self so further methods can be called."
          }
        ]
      }
    ]
  },
  {
    "id": "8-5-str-and-repr",
    "number": "8.5",
    "title": "String Representations (__str__ & __repr__)",
    "subtitle": "Customize how objects display when printed or inspected in debuggers using __str__ and __repr__.",
    "readTime": "20 min",
    "objectives": [
      "Recognize Python's default string representation (<__main__.Class object at 0x...>)",
      "Implement __str__ to provide user-friendly, human-readable string formatting",
      "Implement __repr__ to provide unambiguous, developer-focused debug representations",
      "Understand how print(), str(), and f-strings delegate to __str__",
      "Master the fallback mechanism: Python falls back to __repr__ if __str__ is missing",
      "Format numerical, currency, and compound fields elegantly inside __str__"
    ],
    "theoryBlocks": [
      {
        "heading": "Default Object Representation",
        "text": "By default, when you print an instance of a custom class or convert it to a string with str(obj), Python outputs a generic fallback string containing the module name, class name, and memory address in hexadecimal: <__main__.Person object at 0x7fa28c12b940>. While informative regarding memory location, this output is useless to end users and unhelpful for quick debugging.",
        "codeSnippet": "class Coordinate:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\npt = Coordinate(12, 45)\nprint(pt)         # Uses default object representation\nprint(f\"Point: {pt}\")",
        "terminalOutput": "<__main__.Coordinate object at 0x...>\nPoint: <__main__.Coordinate object at 0x...>",
        "tip": "Whenever you build a class that represents domain data, you should always define a readable representation.",
        "mcq": {
          "id": "q-8-5-str-and-repr-0-v1",
          "question": "What is the default output when printing an object of a class that has not defined __str__ or __repr__?",
          "options": [
            {
              "id": "A",
              "text": "A string containing the class name and hexadecimal memory address (e.g. <__main__.Class object at 0x...>)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "An empty string \"\"",
              "explanationIfWrong": "Python outputs the type and memory address."
            },
            {
              "id": "C",
              "text": "The object's attribute dictionary as JSON",
              "explanationIfWrong": "Default representation does not format attributes as JSON."
            },
            {
              "id": "D",
              "text": "A TypeError: object not printable",
              "explanationIfWrong": "All objects in Python are printable."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python inherits a default __repr__ from the base object class showing class name and memory address."
        },
        "retestMcq": {
          "id": "q-8-5-str-and-repr-0-v2",
          "question": "Why is the default <__main__.Class object at 0x...> representation considered insufficient for application development?",
          "options": [
            {
              "id": "A",
              "text": "It hides the actual attribute values of the instance, making logging, debugging, and user interfaces difficult to inspect",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It uses 90% of available CPU resources",
              "explanationIfWrong": "Printing has negligible CPU cost."
            },
            {
              "id": "C",
              "text": "It causes memory leaks in the operating system",
              "explanationIfWrong": "Memory address output does not leak memory."
            },
            {
              "id": "D",
              "text": "It crashes modern terminals",
              "explanationIfWrong": "It prints standard text."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Readable representations make logs, debug traces, and UI output clear and actionable."
        },
        "questionPool": [
          {
            "id": "q-8-5-str-and-repr-0-v1",
            "question": "What is the default output when printing an object of a class that has not defined __str__ or __repr__?",
            "options": [
              {
                "id": "A",
                "text": "A string containing the class name and hexadecimal memory address (e.g. <__main__.Class object at 0x...>)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "An empty string \"\"",
                "explanationIfWrong": "Python outputs the type and memory address."
              },
              {
                "id": "C",
                "text": "The object's attribute dictionary as JSON",
                "explanationIfWrong": "Default representation does not format attributes as JSON."
              },
              {
                "id": "D",
                "text": "A TypeError: object not printable",
                "explanationIfWrong": "All objects in Python are printable."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python inherits a default __repr__ from the base object class showing class name and memory address."
          },
          {
            "id": "q-8-5-str-and-repr-0-v2",
            "question": "Why is the default <__main__.Class object at 0x...> representation considered insufficient for application development?",
            "options": [
              {
                "id": "A",
                "text": "It hides the actual attribute values of the instance, making logging, debugging, and user interfaces difficult to inspect",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It uses 90% of available CPU resources",
                "explanationIfWrong": "Printing has negligible CPU cost."
              },
              {
                "id": "C",
                "text": "It causes memory leaks in the operating system",
                "explanationIfWrong": "Memory address output does not leak memory."
              },
              {
                "id": "D",
                "text": "It crashes modern terminals",
                "explanationIfWrong": "It prints standard text."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Readable representations make logs, debug traces, and UI output clear and actionable."
          },
          {
            "id": "q-8-5-str-and-repr-0-v3",
            "question": "Where does the default string representation come from if your class doesn't define one?",
            "options": [
              {
                "id": "A",
                "text": "The built-in base class object from which all Python classes inherit",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The operating system's kernel",
                "explanationIfWrong": "Python's object model defines it."
              },
              {
                "id": "C",
                "text": "The sys module",
                "explanationIfWrong": "object.__repr__ provides the default."
              },
              {
                "id": "D",
                "text": "The Python compiler bytecode optimizer",
                "explanationIfWrong": "It is inherited from the base object class."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "All classes inherit from object, which provides the default __repr__ implementation."
          }
        ]
      },
      {
        "heading": "Implementing __str__ for Human-Readable Output",
        "text": "The __str__ dunder method is designed to return a friendly, human-readable string representation of the object. When you call print(obj), str(obj), or format with an f-string (f\"{obj}\"), Python automatically executes your class's __str__ method. __str__ must always return a string object.",
        "codeSnippet": "class Movie:\n    def __init__(self, title, year, rating):\n        self.title = title\n        self.year = year\n        self.rating = rating\n    \n    def __str__(self):\n        return f\"{self.title} ({self.year}) \u2014 \u2b50 {self.rating}/10\"\n\nm = Movie(\"Interstellar\", 2014, 8.7)\nprint(m)             # Directly invokes __str__\nprint(str(m))        # Explicit conversion\nmessage = f\"Now playing: {m}\" # F-string interpolation\nprint(message)",
        "terminalOutput": "Interstellar (2014) \u2014 \u2b50 8.7/10\nInterstellar (2014) \u2014 \u2b50 8.7/10\nNow playing: Interstellar (2014) \u2014 \u2b50 8.7/10",
        "tip": "__str__ must return a string (str). Returning an int, list, or None causes a TypeError.",
        "mcq": {
          "id": "q-8-5-str-and-repr-1-v1",
          "question": "Which Python operations automatically invoke an object's __str__ method?",
          "options": [
            {
              "id": "A",
              "text": "print(obj), str(obj), and string formatting such as f\"{obj}\"",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Mathematical operators like + and *",
              "explanationIfWrong": "+ calls __add__, * calls __mul__."
            },
            {
              "id": "C",
              "text": "len(obj)",
              "explanationIfWrong": "len() calls __len__."
            },
            {
              "id": "D",
              "text": "obj.strip()",
              "explanationIfWrong": "strip is a method on string objects."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "print(), str(), and f-string conversions all look for and execute __str__."
        },
        "retestMcq": {
          "id": "q-8-5-str-and-repr-1-v2",
          "question": "What happens if __str__ returns an integer instead of a string (e.g. return self.year)?",
          "options": [
            {
              "id": "A",
              "text": "TypeError: __str__ returned non-string (type int)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python automatically casts the integer to a string",
              "explanationIfWrong": "Python requires __str__ to explicitly return a str object."
            },
            {
              "id": "C",
              "text": "It prints the number without complaint",
              "explanationIfWrong": "A runtime TypeError is raised immediately."
            },
            {
              "id": "D",
              "text": "It returns None",
              "explanationIfWrong": "A TypeError is raised."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python enforces that __str__() must return an object of type str; returning any other type raises a TypeError."
        },
        "questionPool": [
          {
            "id": "q-8-5-str-and-repr-1-v1",
            "question": "Which Python operations automatically invoke an object's __str__ method?",
            "options": [
              {
                "id": "A",
                "text": "print(obj), str(obj), and string formatting such as f\"{obj}\"",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Mathematical operators like + and *",
                "explanationIfWrong": "+ calls __add__, * calls __mul__."
              },
              {
                "id": "C",
                "text": "len(obj)",
                "explanationIfWrong": "len() calls __len__."
              },
              {
                "id": "D",
                "text": "obj.strip()",
                "explanationIfWrong": "strip is a method on string objects."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "print(), str(), and f-string conversions all look for and execute __str__."
          },
          {
            "id": "q-8-5-str-and-repr-1-v2",
            "question": "What happens if __str__ returns an integer instead of a string (e.g. return self.year)?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: __str__ returned non-string (type int)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python automatically casts the integer to a string",
                "explanationIfWrong": "Python requires __str__ to explicitly return a str object."
              },
              {
                "id": "C",
                "text": "It prints the number without complaint",
                "explanationIfWrong": "A runtime TypeError is raised immediately."
              },
              {
                "id": "D",
                "text": "It returns None",
                "explanationIfWrong": "A TypeError is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python enforces that __str__() must return an object of type str; returning any other type raises a TypeError."
          },
          {
            "id": "q-8-5-str-and-repr-1-v3",
            "question": "Given class Person: def __init__(self, name): self.name = name; def __str__(self): return self.name. What is str(Person('Ada'))?",
            "options": [
              {
                "id": "A",
                "text": "'Ada'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "<Person Ada>",
                "explanationIfWrong": "__str__ returns exactly what is specified in its return statement."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "It returns 'Ada'."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "The method returns a valid string."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "str() invokes __str__, which returns the self.name string ('Ada')."
          }
        ]
      },
      {
        "heading": "Implementing __repr__ for Developers & Debugging",
        "text": "While __str__ is aimed at end users, __repr__ (representation) is aimed at developers and debugging. The goal of __repr__ is to be unambiguous and, whenever practical, look like valid Python code that could recreate the object if passed to eval().",
        "codeSnippet": "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __repr__(self):\n        return f\"Point(x={self.x}, y={self.y})\"\n\np = Point(3, 7)\nprint(repr(p))  # Explicit repr\nprint([p, Point(0, 0)]) # Containers display elements using __repr__!",
        "terminalOutput": "Point(x=3, y=7)\n[Point(x=3, y=7), Point(x=0, y=0)]",
        "tip": "When objects are printed inside a list or dictionary (e.g. print([obj1, obj2])), Python prints the elements using their __repr__, NOT their __str__.",
        "mcq": {
          "id": "q-8-5-str-and-repr-2-v1",
          "question": "What is the primary objective of implementing __repr__ on a class?",
          "options": [
            {
              "id": "A",
              "text": "To provide an unambiguous, technical representation useful for developers and debugging",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To format data for non-technical website visitors",
              "explanationIfWrong": "That is the role of __str__."
            },
            {
              "id": "C",
              "text": "To serialize the object to binary format",
              "explanationIfWrong": "pickle or bytes handle binary serialization."
            },
            {
              "id": "D",
              "text": "To hide private attributes from being viewed",
              "explanationIfWrong": "__repr__ exposes technical details for debugging."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "__repr__ is intended for developers, debugging logs, and interactive consoles."
        },
        "retestMcq": {
          "id": "q-8-5-str-and-repr-2-v2",
          "question": "When you print a list of objects print([obj1, obj2]), which method is used to display each item inside the brackets?",
          "options": [
            {
              "id": "A",
              "text": "__repr__",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "__str__",
              "explanationIfWrong": "Collections (lists, tuples, dicts) display contents using __repr__."
            },
            {
              "id": "C",
              "text": "__init__",
              "explanationIfWrong": "__init__ initializes, it does not format output."
            },
            {
              "id": "D",
              "text": "__print__",
              "explanationIfWrong": "There is no __print__ dunder method in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Containers format their elements by calling repr() on each item, not str()."
        },
        "questionPool": [
          {
            "id": "q-8-5-str-and-repr-2-v1",
            "question": "What is the primary objective of implementing __repr__ on a class?",
            "options": [
              {
                "id": "A",
                "text": "To provide an unambiguous, technical representation useful for developers and debugging",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To format data for non-technical website visitors",
                "explanationIfWrong": "That is the role of __str__."
              },
              {
                "id": "C",
                "text": "To serialize the object to binary format",
                "explanationIfWrong": "pickle or bytes handle binary serialization."
              },
              {
                "id": "D",
                "text": "To hide private attributes from being viewed",
                "explanationIfWrong": "__repr__ exposes technical details for debugging."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "__repr__ is intended for developers, debugging logs, and interactive consoles."
          },
          {
            "id": "q-8-5-str-and-repr-2-v2",
            "question": "When you print a list of objects print([obj1, obj2]), which method is used to display each item inside the brackets?",
            "options": [
              {
                "id": "A",
                "text": "__repr__",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "__str__",
                "explanationIfWrong": "Collections (lists, tuples, dicts) display contents using __repr__."
              },
              {
                "id": "C",
                "text": "__init__",
                "explanationIfWrong": "__init__ initializes, it does not format output."
              },
              {
                "id": "D",
                "text": "__print__",
                "explanationIfWrong": "There is no __print__ dunder method in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Containers format their elements by calling repr() on each item, not str()."
          },
          {
            "id": "q-8-5-str-and-repr-2-v3",
            "question": "What is the classic rule of thumb for a great __repr__ string format?",
            "options": [
              {
                "id": "A",
                "text": "Ideally, it should look like the Python code used to construct the object (e.g. f'ClassName({self.arg})')",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It should be as short as possible, strictly under 5 characters",
                "explanationIfWrong": "Clarity and reproducibility matter more than brevity."
              },
              {
                "id": "C",
                "text": "It must always return HTML code",
                "explanationIfWrong": "repr returns plain Python string representations."
              },
              {
                "id": "D",
                "text": "It must only return the memory address",
                "explanationIfWrong": "The default returns the address; custom repr shows the data."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A good __repr__ is unambiguous and ideally evaluable code like Point(x=3, y=7)."
          }
        ]
      },
      {
        "heading": "Difference Between __str__ and __repr__",
        "text": "The distinction can be summarized as: __str__ is for human beings; __repr__ is for Python developers. For example, datetime.date(2026, 10, 10) has a __str__ of '2026-10-10' (clean and readable) and a __repr__ of 'datetime.date(2026, 10, 10)' (exact code).",
        "codeSnippet": "import datetime\n\ntoday = datetime.date(2026, 10, 10)\nprint(f\"str() output:  {str(today)}\")\nprint(f\"repr() output: {repr(today)}\")",
        "terminalOutput": "str() output:  2026-10-10\nrepr() output: datetime.date(2026, 10, 10)",
        "tip": "Rule: If you can only write one method, write __repr__, because Python uses __repr__ as a fallback whenever __str__ is missing!",
        "mcq": {
          "id": "q-8-5-str-and-repr-3-v1",
          "question": "How do __str__ and __repr__ differ in their target audience and intent?",
          "options": [
            {
              "id": "A",
              "text": "__str__ is for end-user readability; __repr__ is for developers and debugging precision",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "__str__ is for numbers; __repr__ is for text",
              "explanationIfWrong": "Both work on any Python class."
            },
            {
              "id": "C",
              "text": "__str__ is called by C code; __repr__ is called by Python code",
              "explanationIfWrong": "Both are Python methods."
            },
            {
              "id": "D",
              "text": "__str__ is required; __repr__ is forbidden",
              "explanationIfWrong": "Both are optional, but recommended."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "__str__ provides an easy-to-read representation for users; __repr__ provides an exact, detailed representation for developers."
        },
        "retestMcq": {
          "id": "q-8-5-str-and-repr-3-v2",
          "question": "For the string 'hello', what are str('hello') and repr('hello') respectively?",
          "options": [
            {
              "id": "A",
              "text": "'hello' without quotes, and \"'hello'\" including quotation marks",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Both produce 'hello' without quotes",
              "explanationIfWrong": "repr shows quotes to indicate it is a string."
            },
            {
              "id": "C",
              "text": "repr('hello') produces an integer hash",
              "explanationIfWrong": "repr produces a string with quotes."
            },
            {
              "id": "D",
              "text": "str('hello') raises an error",
              "explanationIfWrong": "Strings format cleanly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "str() prints the content hello; repr() includes quotes 'hello' to make the string type explicit."
        },
        "questionPool": [
          {
            "id": "q-8-5-str-and-repr-3-v1",
            "question": "How do __str__ and __repr__ differ in their target audience and intent?",
            "options": [
              {
                "id": "A",
                "text": "__str__ is for end-user readability; __repr__ is for developers and debugging precision",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "__str__ is for numbers; __repr__ is for text",
                "explanationIfWrong": "Both work on any Python class."
              },
              {
                "id": "C",
                "text": "__str__ is called by C code; __repr__ is called by Python code",
                "explanationIfWrong": "Both are Python methods."
              },
              {
                "id": "D",
                "text": "__str__ is required; __repr__ is forbidden",
                "explanationIfWrong": "Both are optional, but recommended."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "__str__ provides an easy-to-read representation for users; __repr__ provides an exact, detailed representation for developers."
          },
          {
            "id": "q-8-5-str-and-repr-3-v2",
            "question": "For the string 'hello', what are str('hello') and repr('hello') respectively?",
            "options": [
              {
                "id": "A",
                "text": "'hello' without quotes, and \"'hello'\" including quotation marks",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Both produce 'hello' without quotes",
                "explanationIfWrong": "repr shows quotes to indicate it is a string."
              },
              {
                "id": "C",
                "text": "repr('hello') produces an integer hash",
                "explanationIfWrong": "repr produces a string with quotes."
              },
              {
                "id": "D",
                "text": "str('hello') raises an error",
                "explanationIfWrong": "Strings format cleanly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "str() prints the content hello; repr() includes quotes 'hello' to make the string type explicit."
          },
          {
            "id": "q-8-5-str-and-repr-3-v3",
            "question": "Why is it recommended to implement __repr__ first if you only implement one of them?",
            "options": [
              {
                "id": "A",
                "text": "Python automatically falls back to __repr__ if __str__ is not defined",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "__repr__ uses less RAM",
                "explanationIfWrong": "Fallback behavior is the design reason."
              },
              {
                "id": "C",
                "text": "__str__ cannot be called without __repr__",
                "explanationIfWrong": "__str__ can exist independently."
              },
              {
                "id": "D",
                "text": "Python deletes classes that only have __str__",
                "explanationIfWrong": "Both work, but __repr__ serves as a universal fallback."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "If __str__ is missing, Python invokes __repr__ instead for print() and str()."
          }
        ]
      },
      {
        "heading": "The __repr__ Fallback Mechanism",
        "text": "When you execute print(obj), Python searches for __str__ on the class. If __str__ is not implemented, Python automatically falls back to calling __repr__. However, the reverse is NOT true: if you implement __str__ but omit __repr__, Python will NOT use __str__ inside lists or containers \u2014 it falls back to the default <object at 0x...>!",
        "codeSnippet": "class OnlyRepr:\n    def __init__(self, val):\n        self.val = val\n    def __repr__(self):\n        return f\"OnlyRepr({self.val})\"\n\nclass OnlyStr:\n    def __init__(self, val):\n        self.val = val\n    def __str__(self):\n        return f\"Value: {self.val}\"\n\nr = OnlyRepr(42)\ns = OnlyStr(99)\n\nprint(f\"OnlyRepr printed: {r}\")        # Falls back to __repr__!\nprint(f\"OnlyStr in a list: {[s]}\")     # OOPS! Falls back to default <object at 0x...>!",
        "terminalOutput": "OnlyRepr printed: OnlyRepr(42)\nOnlyStr in a list: [<__main__.OnlyStr object at 0x...>]",
        "warning": "Never implement ONLY __str__ without __repr__. Your objects will look like <object at 0x...> inside lists, tuples, and dictionaries.",
        "mcq": {
          "id": "q-8-5-str-and-repr-4-v1",
          "question": "What happens when printing an instance of a class that defines __repr__ but does NOT define __str__?",
          "options": [
            {
              "id": "A",
              "text": "Python automatically uses __repr__ as the fallback for printing",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python raises a NotImplementedError",
              "explanationIfWrong": "Python gracefully falls back to __repr__."
            },
            {
              "id": "C",
              "text": "Python prints nothing",
              "explanationIfWrong": "The __repr__ output is printed."
            },
            {
              "id": "D",
              "text": "The program crashes",
              "explanationIfWrong": "Fallback is a built-in language feature."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Python runtime falls back to __repr__ whenever __str__ is queried but undefined."
        },
        "retestMcq": {
          "id": "q-8-5-str-and-repr-4-v2",
          "question": "What happens if a class defines __str__ but omits __repr__, and you print a list containing that object print([obj])?",
          "options": [
            {
              "id": "A",
              "text": "It prints the default <__main__.Class object at 0x...>, because containers inspect __repr__, which was not defined",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It prints using __str__",
              "explanationIfWrong": "Containers do not fall back from __repr__ to __str__."
            },
            {
              "id": "C",
              "text": "It raises a TypeError",
              "explanationIfWrong": "It falls back to the default object.__repr__."
            },
            {
              "id": "D",
              "text": "It prints an empty list []",
              "explanationIfWrong": "The list contains the item, printed via object.__repr__."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Containers query __repr__. Since custom __repr__ is absent, Python inherits object.__repr__."
        },
        "questionPool": [
          {
            "id": "q-8-5-str-and-repr-4-v1",
            "question": "What happens when printing an instance of a class that defines __repr__ but does NOT define __str__?",
            "options": [
              {
                "id": "A",
                "text": "Python automatically uses __repr__ as the fallback for printing",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python raises a NotImplementedError",
                "explanationIfWrong": "Python gracefully falls back to __repr__."
              },
              {
                "id": "C",
                "text": "Python prints nothing",
                "explanationIfWrong": "The __repr__ output is printed."
              },
              {
                "id": "D",
                "text": "The program crashes",
                "explanationIfWrong": "Fallback is a built-in language feature."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Python runtime falls back to __repr__ whenever __str__ is queried but undefined."
          },
          {
            "id": "q-8-5-str-and-repr-4-v2",
            "question": "What happens if a class defines __str__ but omits __repr__, and you print a list containing that object print([obj])?",
            "options": [
              {
                "id": "A",
                "text": "It prints the default <__main__.Class object at 0x...>, because containers inspect __repr__, which was not defined",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It prints using __str__",
                "explanationIfWrong": "Containers do not fall back from __repr__ to __str__."
              },
              {
                "id": "C",
                "text": "It raises a TypeError",
                "explanationIfWrong": "It falls back to the default object.__repr__."
              },
              {
                "id": "D",
                "text": "It prints an empty list []",
                "explanationIfWrong": "The list contains the item, printed via object.__repr__."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Containers query __repr__. Since custom __repr__ is absent, Python inherits object.__repr__."
          },
          {
            "id": "q-8-5-str-and-repr-4-v3",
            "question": "Which single method definition ensures that both print(obj) AND print([obj]) produce meaningful custom text?",
            "options": [
              {
                "id": "A",
                "text": "def __repr__(self):",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "def __str__(self):",
                "explanationIfWrong": "__str__ alone leaves lists showing <object at 0x...>."
              },
              {
                "id": "C",
                "text": "def __init__(self):",
                "explanationIfWrong": "__init__ does not control string formatting."
              },
              {
                "id": "D",
                "text": "def __len__(self):",
                "explanationIfWrong": "__len__ returns length, not string representation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "__repr__ satisfies both direct printing (via fallback) and container display."
          }
        ]
      },
      {
        "heading": "Formatting Attributes Dynamically in __str__",
        "text": "Inside __str__, you can format currency, pad dates, round floating-point numbers, or iterate through child objects to build rich, professional representations of complex domain objects.",
        "codeSnippet": "class Product:\n    def __init__(self, sku, name, price, stock):\n        self.sku = sku\n        self.name = name\n        self.price = float(price)\n        self.stock = int(stock)\n    \n    def __str__(self):\n        availability = f\"{self.stock} in stock\" if self.stock > 0 else \"OUT OF STOCK\"\n        return f\"[{self.sku}] {self.name:<20} | ${self.price:>7.2f} | ({availability})\"\n    \n    def __repr__(self):\n        return f\"Product(sku={self.sku!r}, name={self.name!r}, price={self.price}, stock={self.stock})\"\n\np1 = Product(\"TECH-101\", \"Mechanical Keyboard\", 89.99, 14)\np2 = Product(\"TECH-202\", \"USB-C Hub\", 24.50, 0)\n\nprint(p1)\nprint(p2)",
        "terminalOutput": "[TECH-101] Mechanical Keyboard  | $  89.99 | (14 in stock)\n[TECH-202] USB-C Hub            | $  24.50 | (OUT OF STOCK)",
        "tip": "Notice how !r in f-strings (self.sku!r) formats strings with their quotes, making writing __repr__ fast and clean.",
        "mcq": {
          "id": "q-8-5-str-and-repr-5-v1",
          "question": "In an f-string, what does {self.name!r} do?",
          "options": [
            {
              "id": "A",
              "text": "Formats the value using repr(self.name), adding quotation marks around strings",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Reverses the string characters",
              "explanationIfWrong": "!r invokes repr(), not reverse."
            },
            {
              "id": "C",
              "text": "Rounds numbers to the nearest integer",
              "explanationIfWrong": "!r stands for repr conversion flag."
            },
            {
              "id": "D",
              "text": "Raises a runtime error",
              "explanationIfWrong": "!r is a standard Python f-string conversion specifier."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The !r conversion flag calls repr() on the interpolated expression."
        },
        "retestMcq": {
          "id": "q-8-5-str-and-repr-5-v2",
          "question": "Can __str__ contain conditional logic (e.g. if self.stock > 0)?",
          "options": [
            {
              "id": "A",
              "text": "Yes, __str__ is a standard Python method that can execute any expressions, conditions, and loops to construct its return string",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, __str__ can only contain a single f-string with no logic",
              "explanationIfWrong": "Any valid Python code can execute inside __str__."
            },
            {
              "id": "C",
              "text": "Only if using ternary operators",
              "explanationIfWrong": "Standard if/else statements and loops are fully supported."
            },
            {
              "id": "D",
              "text": "Only in Python 3.12+",
              "explanationIfWrong": "Dynamic methods have been supported since Python 1."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "__str__ is a standard method that can perform any calculations or checks needed to build the string."
        },
        "questionPool": [
          {
            "id": "q-8-5-str-and-repr-5-v1",
            "question": "In an f-string, what does {self.name!r} do?",
            "options": [
              {
                "id": "A",
                "text": "Formats the value using repr(self.name), adding quotation marks around strings",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Reverses the string characters",
                "explanationIfWrong": "!r invokes repr(), not reverse."
              },
              {
                "id": "C",
                "text": "Rounds numbers to the nearest integer",
                "explanationIfWrong": "!r stands for repr conversion flag."
              },
              {
                "id": "D",
                "text": "Raises a runtime error",
                "explanationIfWrong": "!r is a standard Python f-string conversion specifier."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The !r conversion flag calls repr() on the interpolated expression."
          },
          {
            "id": "q-8-5-str-and-repr-5-v2",
            "question": "Can __str__ contain conditional logic (e.g. if self.stock > 0)?",
            "options": [
              {
                "id": "A",
                "text": "Yes, __str__ is a standard Python method that can execute any expressions, conditions, and loops to construct its return string",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, __str__ can only contain a single f-string with no logic",
                "explanationIfWrong": "Any valid Python code can execute inside __str__."
              },
              {
                "id": "C",
                "text": "Only if using ternary operators",
                "explanationIfWrong": "Standard if/else statements and loops are fully supported."
              },
              {
                "id": "D",
                "text": "Only in Python 3.12+",
                "explanationIfWrong": "Dynamic methods have been supported since Python 1."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "__str__ is a standard method that can perform any calculations or checks needed to build the string."
          },
          {
            "id": "q-8-5-str-and-repr-5-v3",
            "question": "Given p = Product('A1', 'Pen', 1.5, 3), what does print(p) output based on the code above?",
            "options": [
              {
                "id": "A",
                "text": "The formatted string returned by p.__str__()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "None",
                "explanationIfWrong": "print() outputs the string returned by __str__."
              },
              {
                "id": "C",
                "text": "Product(sku='A1')",
                "explanationIfWrong": "print(p) invokes __str__, not __repr__."
              },
              {
                "id": "D",
                "text": "A list of attributes",
                "explanationIfWrong": "It outputs the string returned by __str__."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "print(p) evaluates p.__str__() and displays the resulting string in the terminal."
          }
        ]
      }
    ]
  },
  {
    "id": "8-6-classes-in-practice",
    "number": "8.6",
    "title": "Classes in Practice & State",
    "subtitle": "Build production-grade systems modeling real entities, state transitions, object collections, and inter-object collaboration.",
    "readTime": "25 min",
    "objectives": [
      "Model cohesive real-world domains with private state and public methods",
      "Implement state machines that manage lifecycle transitions (e.g. pending -> active -> completed)",
      "Build container classes that manage collections of other custom objects",
      "Pass objects into functions and methods to collaborate and transfer data",
      "Implement factory methods and queries that return newly constructed objects",
      "Establish foundational Stage 2 architecture principles for future object design"
    ],
    "theoryBlocks": [
      {
        "heading": "Modeling Real-World Entities",
        "text": "Classes shine when modeling domain concepts that combine persistent state with business operations. A BankAccount entity encapsulates account ownership, balance tracking, and transaction history, ensuring that the balance can only change through valid audited operations.",
        "codeSnippet": "class BankAccount:\n    def __init__(self, account_id, owner, initial_deposit=0.0):\n        if initial_deposit < 0:\n            raise ValueError(\"Initial deposit cannot be negative.\")\n        self.account_id = account_id\n        self.owner = owner\n        self.balance = float(initial_deposit)\n        self.history = [f\"Account created with ${self.balance:.2f}\"]\n    \n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Deposit must be positive.\")\n        self.balance += amount\n        self.history.append(f\"Deposit: +${amount:.2f} (Balance: ${self.balance:.2f})\")\n        return self.balance\n    \n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Withdrawal must be positive.\")\n        if amount > self.balance:\n            raise ValueError(f\"Insufficient funds. Current balance: ${self.balance:.2f}\")\n        self.balance -= amount\n        self.history.append(f\"Withdraw: -${amount:.2f} (Balance: ${self.balance:.2f})\")\n        return self.balance\n\nacc = BankAccount(\"ACC-901\", \"Bimal\", 200.0)\nacc.deposit(150.0)\nacc.withdraw(50.0)\nprint(f\"{acc.owner} Final Balance: ${acc.balance:.2f}\")\nprint(f\"Transactions ({len(acc.history)}): {acc.history[-1]}\")",
        "terminalOutput": "Bimal Final Balance: $300.00\nTransactions (3): Withdraw: -$50.00 (Balance: $300.00)",
        "tip": "Encapsulating transaction history alongside balance guarantees an accurate audit log for every balance modification.",
        "mcq": {
          "id": "q-8-6-classes-in-practice-0-v1",
          "question": "What invariant does the BankAccount class enforce on withdrawals?",
          "options": [
            {
              "id": "A",
              "text": "Withdrawals must be positive and cannot exceed the current available balance",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Withdrawals are only permitted on weekends",
              "explanationIfWrong": "There is no day-of-week restriction in the code."
            },
            {
              "id": "C",
              "text": "Withdrawals can reduce balance to negative infinity",
              "explanationIfWrong": "The check amount > self.balance raises a ValueError."
            },
            {
              "id": "D",
              "text": "Withdrawals must be integers only",
              "explanationIfWrong": "amount can be a float."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The method raises a ValueError if amount <= 0 or if amount > self.balance."
        },
        "retestMcq": {
          "id": "q-8-6-classes-in-practice-0-v2",
          "question": "Why is keeping a self.history list inside BankAccount considered good object-oriented practice?",
          "options": [
            {
              "id": "A",
              "text": "It keeps related data and audit state together with the entity responsible for changing it",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Lists take zero memory when stored inside classes",
              "explanationIfWrong": "Lists take standard memory; the benefit is cohesion and encapsulation."
            },
            {
              "id": "C",
              "text": "It is required by the Python interpreter",
              "explanationIfWrong": "Keeping history is an architectural choice, not a language requirement."
            },
            {
              "id": "D",
              "text": "It prevents other classes from being created",
              "explanationIfWrong": "Classes operate independently."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "High cohesion means keeping state and the history of operations together inside the object that owns them."
        },
        "questionPool": [
          {
            "id": "q-8-6-classes-in-practice-0-v1",
            "question": "What invariant does the BankAccount class enforce on withdrawals?",
            "options": [
              {
                "id": "A",
                "text": "Withdrawals must be positive and cannot exceed the current available balance",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Withdrawals are only permitted on weekends",
                "explanationIfWrong": "There is no day-of-week restriction in the code."
              },
              {
                "id": "C",
                "text": "Withdrawals can reduce balance to negative infinity",
                "explanationIfWrong": "The check amount > self.balance raises a ValueError."
              },
              {
                "id": "D",
                "text": "Withdrawals must be integers only",
                "explanationIfWrong": "amount can be a float."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The method raises a ValueError if amount <= 0 or if amount > self.balance."
          },
          {
            "id": "q-8-6-classes-in-practice-0-v2",
            "question": "Why is keeping a self.history list inside BankAccount considered good object-oriented practice?",
            "options": [
              {
                "id": "A",
                "text": "It keeps related data and audit state together with the entity responsible for changing it",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Lists take zero memory when stored inside classes",
                "explanationIfWrong": "Lists take standard memory; the benefit is cohesion and encapsulation."
              },
              {
                "id": "C",
                "text": "It is required by the Python interpreter",
                "explanationIfWrong": "Keeping history is an architectural choice, not a language requirement."
              },
              {
                "id": "D",
                "text": "It prevents other classes from being created",
                "explanationIfWrong": "Classes operate independently."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "High cohesion means keeping state and the history of operations together inside the object that owns them."
          },
          {
            "id": "q-8-6-classes-in-practice-0-v3",
            "question": "What happens if acc.withdraw(500.0) is called when acc.balance is $300.00?",
            "options": [
              {
                "id": "A",
                "text": "A ValueError is raised and the balance remains exactly $300.00",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The balance becomes -$200.00",
                "explanationIfWrong": "The exception halts execution before balance is updated."
              },
              {
                "id": "C",
                "text": "The account is deleted",
                "explanationIfWrong": "Raising an exception does not delete objects."
              },
              {
                "id": "D",
                "text": "It returns None",
                "explanationIfWrong": "It raises a ValueError explicitly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because 500 > 300, a ValueError is raised and the balance subtraction never executes."
          }
        ]
      },
      {
        "heading": "State Management and Transitions",
        "text": "Many real-world objects transition between discrete states (e.g., a Task moving from 'TODO' to 'IN_PROGRESS' to 'COMPLETED'). Methods can validate whether a requested transition is legally allowed based on the current state.",
        "codeSnippet": "class Task:\n    VALID_STATES = (\"TODO\", \"IN_PROGRESS\", \"DONE\")\n    \n    def __init__(self, title):\n        self.title = title\n        self.status = \"TODO\"\n    \n    def start(self):\n        if self.status != \"TODO\":\n            raise ValueError(f\"Cannot start task from status '{self.status}'.\")\n        self.status = \"IN_PROGRESS\"\n    \n    def complete(self):\n        if self.status != \"IN_PROGRESS\":\n            raise ValueError(f\"Cannot complete task before starting it. Current: '{self.status}'.\")\n        self.status = \"DONE\"\n    \n    def __repr__(self):\n        return f\"Task({self.title!r}, status={self.status!r})\"\n\nt = Task(\"Learn Python Classes\")\nprint(t)\nt.start()\nprint(t)\nt.complete()\nprint(t)",
        "terminalOutput": "Task('Learn Python Classes', status='TODO')\nTask('Learn Python Classes', status='IN_PROGRESS')\nTask('Learn Python Classes', status='DONE')",
        "tip": "State machine validation prevents impossible workflows, such as completing a task before it has even started.",
        "mcq": {
          "id": "q-8-6-classes-in-practice-1-v1",
          "question": "What happens if a user calls t.complete() on a new Task that is still in status 'TODO'?",
          "options": [
            {
              "id": "A",
              "text": "A ValueError is raised because completing requires the task to be 'IN_PROGRESS'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The status silently becomes 'DONE'",
              "explanationIfWrong": "The validation check raises a ValueError."
            },
            {
              "id": "C",
              "text": "The task is reset to None",
              "explanationIfWrong": "An exception is raised."
            },
            {
              "id": "D",
              "text": "It automatically calls t.start() first",
              "explanationIfWrong": "The code requires the caller to manage transitions explicitly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Enforcing transition guards ensures business process integrity."
        },
        "retestMcq": {
          "id": "q-8-6-classes-in-practice-1-v2",
          "question": "What is VALID_STATES in class Task: VALID_STATES = ('TODO', 'IN_PROGRESS', 'DONE')?",
          "options": [
            {
              "id": "A",
              "text": "A class attribute shared across all instances of Task",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A local variable inside a method",
              "explanationIfWrong": "It is defined directly in the class block, making it a class attribute."
            },
            {
              "id": "C",
              "text": "A global OS environment variable",
              "explanationIfWrong": "It belongs to the Task class."
            },
            {
              "id": "D",
              "text": "A private method",
              "explanationIfWrong": "It is a tuple constant attribute."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Attributes defined directly in the class body are class attributes accessible via Task.VALID_STATES or self.VALID_STATES."
        },
        "questionPool": [
          {
            "id": "q-8-6-classes-in-practice-1-v1",
            "question": "What happens if a user calls t.complete() on a new Task that is still in status 'TODO'?",
            "options": [
              {
                "id": "A",
                "text": "A ValueError is raised because completing requires the task to be 'IN_PROGRESS'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The status silently becomes 'DONE'",
                "explanationIfWrong": "The validation check raises a ValueError."
              },
              {
                "id": "C",
                "text": "The task is reset to None",
                "explanationIfWrong": "An exception is raised."
              },
              {
                "id": "D",
                "text": "It automatically calls t.start() first",
                "explanationIfWrong": "The code requires the caller to manage transitions explicitly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Enforcing transition guards ensures business process integrity."
          },
          {
            "id": "q-8-6-classes-in-practice-1-v2",
            "question": "What is VALID_STATES in class Task: VALID_STATES = ('TODO', 'IN_PROGRESS', 'DONE')?",
            "options": [
              {
                "id": "A",
                "text": "A class attribute shared across all instances of Task",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A local variable inside a method",
                "explanationIfWrong": "It is defined directly in the class block, making it a class attribute."
              },
              {
                "id": "C",
                "text": "A global OS environment variable",
                "explanationIfWrong": "It belongs to the Task class."
              },
              {
                "id": "D",
                "text": "A private method",
                "explanationIfWrong": "It is a tuple constant attribute."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Attributes defined directly in the class body are class attributes accessible via Task.VALID_STATES or self.VALID_STATES."
          },
          {
            "id": "q-8-6-classes-in-practice-1-v3",
            "question": "Why is representing states as a state machine beneficial in object design?",
            "options": [
              {
                "id": "A",
                "text": "It prevents invalid state transitions (like reopening a closed invoice or double-completing a task)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It makes programs 100% immune to all network failures",
                "explanationIfWrong": "It governs logic state, not network connections."
              },
              {
                "id": "C",
                "text": "It compiles Python to assembly language",
                "explanationIfWrong": "State machines are a logical design pattern."
              },
              {
                "id": "D",
                "text": "It removes the need for __init__",
                "explanationIfWrong": "__init__ is still required."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "State machines eliminate bug-prone impossible states by strictly defining permitted transitions."
          }
        ]
      },
      {
        "heading": "Collections of Objects",
        "text": "Real applications frequently manage collections of custom objects. Rather than working with raw lists of dictionaries, you can create dedicated container classes (e.g. Project, TodoList, Course) that organize and filter child objects.",
        "codeSnippet": "class TodoList:\n    def __init__(self, name):\n        self.name = name\n        self.tasks = []\n    \n    def add_task(self, title):\n        task = Task(title)  # Instantiate child object\n        self.tasks.append(task)\n        return task\n    \n    def get_pending(self):\n        return [t for t in self.tasks if t.status != \"DONE\"]\n    \n    def summary(self):\n        total = len(self.tasks)\n        done = sum(1 for t in self.tasks if t.status == \"DONE\")\n        return f\"{self.name}: {done}/{total} completed\"\n\ntodos = TodoList(\"Launch Sprint\")\nt1 = todos.add_task(\"Build UI\")\nt2 = todos.add_task(\"Write Unit Tests\")\nt1.start(); t1.complete()\n\nprint(todos.summary())\nprint(f\"Pending tasks: {todos.get_pending()}\")",
        "terminalOutput": "Launch Sprint: 1/2 completed\nPending tasks: [Task('Write Unit Tests', status='TODO')]",
        "tip": "Container classes encapsulate collection logic, such as filtering, searching, and calculating aggregates.",
        "mcq": {
          "id": "q-8-6-classes-in-practice-2-v1",
          "question": "What is the relationship between TodoList and Task in this example?",
          "options": [
            {
              "id": "A",
              "text": "Composition / Aggregation: TodoList manages and holds a collection of Task instances",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "TodoList inherits from Task",
              "explanationIfWrong": "TodoList has tasks (composition); it does not inherit from Task."
            },
            {
              "id": "C",
              "text": "Task is a subclass of TodoList",
              "explanationIfWrong": "There is no inheritance between them."
            },
            {
              "id": "D",
              "text": "They are identical classes",
              "explanationIfWrong": "One is an individual item, the other is a collection manager."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "TodoList has a 'has-a' relationship with Task instances, known as composition/aggregation."
        },
        "retestMcq": {
          "id": "q-8-6-classes-in-practice-2-v2",
          "question": "What does todos.get_pending() return?",
          "options": [
            {
              "id": "A",
              "text": "A list of Task objects whose status is not 'DONE'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A list of string titles",
              "explanationIfWrong": "It returns the actual Task instances [t for t in ...]."
            },
            {
              "id": "C",
              "text": "An integer count of tasks",
              "explanationIfWrong": "It returns a filtered list of objects."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "It returns a list."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The list comprehension filters self.tasks and returns the matching Task instances."
        },
        "questionPool": [
          {
            "id": "q-8-6-classes-in-practice-2-v1",
            "question": "What is the relationship between TodoList and Task in this example?",
            "options": [
              {
                "id": "A",
                "text": "Composition / Aggregation: TodoList manages and holds a collection of Task instances",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "TodoList inherits from Task",
                "explanationIfWrong": "TodoList has tasks (composition); it does not inherit from Task."
              },
              {
                "id": "C",
                "text": "Task is a subclass of TodoList",
                "explanationIfWrong": "There is no inheritance between them."
              },
              {
                "id": "D",
                "text": "They are identical classes",
                "explanationIfWrong": "One is an individual item, the other is a collection manager."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "TodoList has a 'has-a' relationship with Task instances, known as composition/aggregation."
          },
          {
            "id": "q-8-6-classes-in-practice-2-v2",
            "question": "What does todos.get_pending() return?",
            "options": [
              {
                "id": "A",
                "text": "A list of Task objects whose status is not 'DONE'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A list of string titles",
                "explanationIfWrong": "It returns the actual Task instances [t for t in ...]."
              },
              {
                "id": "C",
                "text": "An integer count of tasks",
                "explanationIfWrong": "It returns a filtered list of objects."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "It returns a list."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The list comprehension filters self.tasks and returns the matching Task instances."
          },
          {
            "id": "q-8-6-classes-in-practice-2-v3",
            "question": "Can modifying a task object retrieved from todos.tasks mutate the task inside the TodoList?",
            "options": [
              {
                "id": "A",
                "text": "Yes, because the list holds a reference to the exact same Task object in memory",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, retrieving an object creates an isolated deep copy",
                "explanationIfWrong": "Python passes and stores object references without copying."
              },
              {
                "id": "C",
                "text": "Only if the task is saved to disk",
                "explanationIfWrong": "Reference semantics apply immediately in memory."
              },
              {
                "id": "D",
                "text": "Only if using global variables",
                "explanationIfWrong": "Object references work everywhere."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python collections store references to objects. Modifying the object via any reference updates its single in-memory state."
          }
        ]
      },
      {
        "heading": "Passing Objects as Arguments to Functions & Methods",
        "text": "Objects can be passed as arguments into other functions or methods. Because Python passes references, a function or method can inspect and invoke methods on the passed object directly.",
        "codeSnippet": "def transfer_funds(source, target, amount):\n    \"\"\"Transfers amount from source BankAccount to target BankAccount.\"\"\"\n    print(f\"Initiating transfer of ${amount:.2f} from {source.owner} to {target.owner}...\")\n    # Atomic transfer\n    source.withdraw(amount)\n    target.deposit(amount)\n    print(\"Transfer successful!\")\n\na1 = BankAccount(\"A1\", \"Alice\", 500)\na2 = BankAccount(\"A2\", \"Bob\", 100)\n\ntransfer_funds(a1, a2, 150)\nprint(f\"Alice: ${a1.balance:.2f}, Bob: ${a2.balance:.2f}\")",
        "terminalOutput": "Initiating transfer of $150.00 from Alice to Bob...\nTransfer successful!\nAlice: $350.00, Bob: $250.00",
        "tip": "Notice how transfer_funds relies on BankAccount's own withdraw and deposit methods to enforce validation and record history.",
        "mcq": {
          "id": "q-8-6-classes-in-practice-3-v1",
          "question": "When passing an object into a function def transfer(source, target):, what is passed?",
          "options": [
            {
              "id": "A",
              "text": "The reference to the original object in memory",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A cloned copy of all attributes",
              "explanationIfWrong": "Python passes object references, not copies."
            },
            {
              "id": "C",
              "text": "A JSON string representation",
              "explanationIfWrong": "Direct object references are passed."
            },
            {
              "id": "D",
              "text": "Only the class name",
              "explanationIfWrong": "The full object instance is passed."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python uses pass-by-object-reference; changes made to mutable objects inside functions affect the original object."
        },
        "retestMcq": {
          "id": "q-8-6-classes-in-practice-3-v2",
          "question": "What happens if source has insufficient funds when transfer_funds is executed?",
          "options": [
            {
              "id": "A",
              "text": "source.withdraw() raises a ValueError, preventing target.deposit() from executing",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Money is created out of thin air for Bob",
              "explanationIfWrong": "The exception halts execution before deposit() is reached."
            },
            {
              "id": "C",
              "text": "Both accounts are wiped to zero",
              "explanationIfWrong": "source was not changed, and deposit never ran."
            },
            {
              "id": "D",
              "text": "The function returns False silently",
              "explanationIfWrong": "The ValueError propagates unless caught."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because source.withdraw() executes first and raises an error, the subsequent target.deposit() is never called."
        },
        "questionPool": [
          {
            "id": "q-8-6-classes-in-practice-3-v1",
            "question": "When passing an object into a function def transfer(source, target):, what is passed?",
            "options": [
              {
                "id": "A",
                "text": "The reference to the original object in memory",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A cloned copy of all attributes",
                "explanationIfWrong": "Python passes object references, not copies."
              },
              {
                "id": "C",
                "text": "A JSON string representation",
                "explanationIfWrong": "Direct object references are passed."
              },
              {
                "id": "D",
                "text": "Only the class name",
                "explanationIfWrong": "The full object instance is passed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python uses pass-by-object-reference; changes made to mutable objects inside functions affect the original object."
          },
          {
            "id": "q-8-6-classes-in-practice-3-v2",
            "question": "What happens if source has insufficient funds when transfer_funds is executed?",
            "options": [
              {
                "id": "A",
                "text": "source.withdraw() raises a ValueError, preventing target.deposit() from executing",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Money is created out of thin air for Bob",
                "explanationIfWrong": "The exception halts execution before deposit() is reached."
              },
              {
                "id": "C",
                "text": "Both accounts are wiped to zero",
                "explanationIfWrong": "source was not changed, and deposit never ran."
              },
              {
                "id": "D",
                "text": "The function returns False silently",
                "explanationIfWrong": "The ValueError propagates unless caught."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because source.withdraw() executes first and raises an error, the subsequent target.deposit() is never called."
          },
          {
            "id": "q-8-6-classes-in-practice-3-v3",
            "question": "Can a method on an object accept another instance of the same class (e.g. def transfer_to(self, other_account, amount))?",
            "options": [
              {
                "id": "A",
                "text": "Yes, methods can accept instances of their own class or any other class as parameters",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, a class cannot reference itself in method signatures",
                "explanationIfWrong": "Self-referencing parameters are standard in OOP."
              },
              {
                "id": "C",
                "text": "Only in C++",
                "explanationIfWrong": "Python fully supports passing instances of the same class."
              },
              {
                "id": "D",
                "text": "Only if wrapped in a dictionary",
                "explanationIfWrong": "Objects can be passed directly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Methods frequently interact with other instances of the same class (like transfer_to(self, target))."
          }
        ]
      },
      {
        "heading": "Objects Returning Objects (Factory Patterns)",
        "text": "Methods can construct and return new instances of their own class or other classes. This is commonly used for arithmetic operations, filters, transformations, or factory methods.",
        "codeSnippet": "class Money:\n    def __init__(self, amount, currency=\"USD\"):\n        self.amount = round(float(amount), 2)\n        self.currency = currency\n    \n    def add(self, other):\n        if self.currency != other.currency:\n            raise ValueError(f\"Cannot add {self.currency} and {other.currency}.\")\n        # Returns a brand-new Money instance!\n        return Money(self.amount + other.amount, self.currency)\n    \n    def __repr__(self):\n        return f\"Money({self.amount}, '{self.currency}')\"\n\nm1 = Money(15.50)\nm2 = Money(10.25)\nm3 = m1.add(m2)  # Brand-new instance\n\nprint(f\"m1: {m1}\")\nprint(f\"m2: {m2}\")\nprint(f\"m3 (combined): {m3}\")",
        "terminalOutput": "m1: Money(15.5, 'USD')\nm2: Money(10.25, 'USD')\nm3 (combined): Money(25.75, 'USD')",
        "tip": "Returning new instances rather than mutating self makes objects immutable and thread-safe, a cornerstone of functional programming in Python.",
        "mcq": {
          "id": "q-8-6-classes-in-practice-4-v1",
          "question": "What is the result of m1.add(m2) in the Money example above?",
          "options": [
            {
              "id": "A",
              "text": "A brand-new Money instance with amount 25.75, leaving m1 and m2 unchanged",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "m1 is mutated to 25.75 and m2 is destroyed",
              "explanationIfWrong": "m1 is not mutated; a new Money object is returned."
            },
            {
              "id": "C",
              "text": "A float number 25.75",
              "explanationIfWrong": "The method returns a Money instance, not a raw float."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "It returns the new Money instance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "m1.add(m2) constructs and returns a new Money instance without altering m1 or m2."
        },
        "retestMcq": {
          "id": "q-8-6-classes-in-practice-4-v2",
          "question": "What is an object called when its methods return new instances rather than modifying internal state?",
          "options": [
            {
              "id": "A",
              "text": "Immutable object",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Dynamic pointer",
              "explanationIfWrong": "Immutable objects preserve state."
            },
            {
              "id": "C",
              "text": "Transient class",
              "explanationIfWrong": "The term is immutable."
            },
            {
              "id": "D",
              "text": "Recursive variable",
              "explanationIfWrong": "Recursion refers to self-calling functions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Objects that cannot be modified after creation (or whose operations produce new instances) are called immutable."
        },
        "questionPool": [
          {
            "id": "q-8-6-classes-in-practice-4-v1",
            "question": "What is the result of m1.add(m2) in the Money example above?",
            "options": [
              {
                "id": "A",
                "text": "A brand-new Money instance with amount 25.75, leaving m1 and m2 unchanged",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "m1 is mutated to 25.75 and m2 is destroyed",
                "explanationIfWrong": "m1 is not mutated; a new Money object is returned."
              },
              {
                "id": "C",
                "text": "A float number 25.75",
                "explanationIfWrong": "The method returns a Money instance, not a raw float."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "It returns the new Money instance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "m1.add(m2) constructs and returns a new Money instance without altering m1 or m2."
          },
          {
            "id": "q-8-6-classes-in-practice-4-v2",
            "question": "What is an object called when its methods return new instances rather than modifying internal state?",
            "options": [
              {
                "id": "A",
                "text": "Immutable object",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Dynamic pointer",
                "explanationIfWrong": "Immutable objects preserve state."
              },
              {
                "id": "C",
                "text": "Transient class",
                "explanationIfWrong": "The term is immutable."
              },
              {
                "id": "D",
                "text": "Recursive variable",
                "explanationIfWrong": "Recursion refers to self-calling functions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Objects that cannot be modified after creation (or whose operations produce new instances) are called immutable."
          },
          {
            "id": "q-8-6-classes-in-practice-4-v3",
            "question": "What happens if you try to add m1 = Money(10, 'USD') and m2 = Money(10, 'EUR')?",
            "options": [
              {
                "id": "A",
                "text": "A ValueError is raised due to mismatched currencies",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python automatically fetches today's live exchange rate",
                "explanationIfWrong": "Python does not fetch exchange rates automatically."
              },
              {
                "id": "C",
                "text": "It returns Money(20, 'USD')",
                "explanationIfWrong": "The currency check guards against mixing currencies."
              },
              {
                "id": "D",
                "text": "It returns None",
                "explanationIfWrong": "An exception is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The check if self.currency != other.currency prevents invalid addition across different currencies."
          }
        ]
      },
      {
        "heading": "Stage 2 Architecture: Cohesion & Principles",
        "text": "As you advance into Stage 2 (Parts 8\u201314), class architecture forms the foundation of all advanced projects. Three core principles guide sound object design: High Cohesion (each class has a single, focused responsibility), Invariant Protection (objects guarantee they are never in an invalid state), and Clear Interfaces (methods expose what an object can do, hiding implementation details).",
        "codeSnippet": "# Example of clean Stage 2 architecture:\nclass Temperature:\n    \"\"\"Immutable temperature value object with unit conversions.\"\"\"\n    def __init__(self, celsius):\n        if celsius < -273.15:\n            raise ValueError(\"Temperature cannot be below absolute zero (-273.15\u00b0C).\")\n        self._celsius = float(celsius)\n    \n    @property\n    def celsius(self):\n        return self._celsius\n    \n    @property\n    def fahrenheit(self):\n        return (self._celsius * 9/5) + 32\n    \n    def __repr__(self):\n        return f\"Temperature({self._celsius}\u00b0C / {self.fahrenheit:.1f}\u00b0F)\"\n\nt = Temperature(25)\nprint(t)\nprint(f\"Fahrenheit: {t.fahrenheit}\u00b0F\")",
        "terminalOutput": "Temperature(25.0\u00b0C / 77.0\u00b0F)\nFahrenheit: 77.0\u00b0F",
        "tip": "Congratulations! You have completed Part 8, mastering objects, classes, constructors, methods, string representations, and state architecture.",
        "mcq": {
          "id": "q-8-6-classes-in-practice-5-v1",
          "question": "What does the principle of 'High Cohesion' mean in object-oriented design?",
          "options": [
            {
              "id": "A",
              "text": "A class should have a single, well-defined responsibility where all attributes and methods closely relate to that purpose",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Every class must have at least 50 methods",
              "explanationIfWrong": "Cohesion is about focus, not method count."
            },
            {
              "id": "C",
              "text": "All classes must be written in a single file",
              "explanationIfWrong": "Modularity often separates classes into files."
            },
            {
              "id": "D",
              "text": "All variables must be global",
              "explanationIfWrong": "Global variables reduce cohesion."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "High cohesion means a class focuses strictly on its core responsibility without doing unrelated jobs."
        },
        "retestMcq": {
          "id": "q-8-6-classes-in-practice-5-v2",
          "question": "What invariant does the Temperature class enforce in its constructor?",
          "options": [
            {
              "id": "A",
              "text": "Temperature cannot be below absolute zero (-273.15\u00b0C)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Temperature must be an even integer",
              "explanationIfWrong": "There is no even integer constraint."
            },
            {
              "id": "C",
              "text": "Temperature cannot exceed 100\u00b0C",
              "explanationIfWrong": "High temperatures are permitted."
            },
            {
              "id": "D",
              "text": "Temperature must be entered in Kelvin only",
              "explanationIfWrong": "Celsius is accepted."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Enforcing physical invariants in __init__ prevents logically impossible values from existing."
        },
        "questionPool": [
          {
            "id": "q-8-6-classes-in-practice-5-v1",
            "question": "What does the principle of 'High Cohesion' mean in object-oriented design?",
            "options": [
              {
                "id": "A",
                "text": "A class should have a single, well-defined responsibility where all attributes and methods closely relate to that purpose",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Every class must have at least 50 methods",
                "explanationIfWrong": "Cohesion is about focus, not method count."
              },
              {
                "id": "C",
                "text": "All classes must be written in a single file",
                "explanationIfWrong": "Modularity often separates classes into files."
              },
              {
                "id": "D",
                "text": "All variables must be global",
                "explanationIfWrong": "Global variables reduce cohesion."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "High cohesion means a class focuses strictly on its core responsibility without doing unrelated jobs."
          },
          {
            "id": "q-8-6-classes-in-practice-5-v2",
            "question": "What invariant does the Temperature class enforce in its constructor?",
            "options": [
              {
                "id": "A",
                "text": "Temperature cannot be below absolute zero (-273.15\u00b0C)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Temperature must be an even integer",
                "explanationIfWrong": "There is no even integer constraint."
              },
              {
                "id": "C",
                "text": "Temperature cannot exceed 100\u00b0C",
                "explanationIfWrong": "High temperatures are permitted."
              },
              {
                "id": "D",
                "text": "Temperature must be entered in Kelvin only",
                "explanationIfWrong": "Celsius is accepted."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Enforcing physical invariants in __init__ prevents logically impossible values from existing."
          },
          {
            "id": "q-8-6-classes-in-practice-5-v3",
            "question": "Why is Stage 2 (Parts 8\u201314) focused on Object-Oriented Architecture?",
            "options": [
              {
                "id": "A",
                "text": "Large-scale software and industry projects require structured blueprints, clean state management, and reusable components",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python 3 has banned standalone functions",
                "explanationIfWrong": "Functions are still widely used in Python."
              },
              {
                "id": "C",
                "text": "Classes execute 100x faster than functions",
                "explanationIfWrong": "Both execute similarly in Python bytecode."
              },
              {
                "id": "D",
                "text": "Classes use zero memory",
                "explanationIfWrong": "Classes structure data in memory cleanly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "OOP provides the architectural tools to build scalable, maintainable real-world applications."
          }
        ]
      }
    ]
  }
];

// Question pool selector for Part 8
export const getActiveQuestionsForLevelPart8 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part8_seen_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part8_active_qset_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 8
export const getConsecutiveFailuresPart8 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part8_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart8 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part8_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart8 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part8_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart8 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part8_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart8 = (
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
  const currentAttempt = getLevelAttemptCountPart8(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part8_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part8_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part8_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part8_locked_${studentId}`);
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
      setLevelAttemptCountPart8(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart8(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart8(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part8_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part8_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part8_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart8 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part8_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part8_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part8_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part8_locked_progression_${studentId}`);
  } catch {}
};
