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

export const PART_12_SECTIONS: SectionContent[] = [
  {
    "id": "12-1-functions-as-arguments",
    "number": "12.1",
    "title": "Functions as First-Class Citizens",
    "subtitle": "Treat functions as values: pass functions into functions, return functions, and build customizable sorting and callbacks.",
    "readTime": "22 min",
    "objectives": [
      "Understand what 'first-class functions' means in Python",
      "Pass functions as arguments into other functions (higher-order functions)",
      "Customize sorting logic with the key= parameter in sorted() and list.sort()",
      "Sort complex data structures (tuples, dictionaries, custom objects) by arbitrary criteria",
      "Construct function factories that return new specialized functions",
      "Grasp lexical scoping, enclosing scopes, and closures"
    ],
    "theoryBlocks": [
      {
        "heading": "Functions as First-Class Objects",
        "text": "In Python, functions are first-class citizens. This means functions are treated just like any other object (such as integers, strings, or lists). You can assign a function to a variable, store functions inside data structures (lists, dictionaries), pass functions as arguments into other functions, and return functions from other functions. When referring to a function itself without calling it, omit the parentheses: `my_func` refers to the function object, while `my_func()` invokes it.",
        "codeSnippet": "def greet(name):\n    return f\"Hello, {name}!\"\n\n# 1. Assign function to a variable\nsay_hi = greet\nprint(say_hi(\"Ada\"))\n\n# 2. Store functions in a dictionary (command dispatch map)\ndef add(a, b): return a + b\ndef multiply(a, b): return a * b\n\noperations = {\"+\": add, \"*\": multiply}\ncalc = operations[\"*\"]\nprint(\"5 * 4 =\", calc(5, 4))",
        "terminalOutput": "Hello, Ada!\n5 * 4 = 20",
        "tip": "Omitting parentheses `func` references the function itself; adding parentheses `func()` executes the function.",
        "mcq": {
          "question": "What does it mean that functions are 'first-class citizens' in Python?",
          "options": [
            {
              "id": "A",
              "text": "Functions can be assigned to variables, stored in data structures, passed as arguments, and returned from other functions",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Functions execute faster than standard loops",
              "explanationIfWrong": "First-class refers to value semantics, not execution speed."
            },
            {
              "id": "C",
              "text": "Functions must always be declared at the top of a file",
              "explanationIfWrong": "Python supports functions defined anywhere, including nested scopes."
            },
            {
              "id": "D",
              "text": "Functions can only accept integers as arguments",
              "explanationIfWrong": "Python functions accept any object types."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "First-class citizen status means functions have the exact same rights as data values: passing, returning, assigning, and storing.",
          "id": "q-12-1-functions-as-arguments-0-v1"
        },
        "retestMcq": {
          "question": "What is the difference between my_function and my_function() in Python?",
          "options": [
            {
              "id": "A",
              "text": "my_function refers to the function object itself; my_function() invokes and executes the function",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "my_function is a variable; my_function() is a class definition",
              "explanationIfWrong": "Both refer to the same function, one referenced and one called."
            },
            {
              "id": "C",
              "text": "my_function() is deprecated in Python 3",
              "explanationIfWrong": "Parentheses are standard call syntax in all Python versions."
            },
            {
              "id": "D",
              "text": "There is no difference; Python treats them identically",
              "explanationIfWrong": "Omitting parentheses does not call the function."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without parentheses, you obtain a reference to the function object. With parentheses, you invoke it.",
          "id": "q-12-1-functions-as-arguments-0-v2"
        },
        "questionPool": [
          {
            "question": "What does it mean that functions are 'first-class citizens' in Python?",
            "options": [
              {
                "id": "A",
                "text": "Functions can be assigned to variables, stored in data structures, passed as arguments, and returned from other functions",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Functions execute faster than standard loops",
                "explanationIfWrong": "First-class refers to value semantics, not execution speed."
              },
              {
                "id": "C",
                "text": "Functions must always be declared at the top of a file",
                "explanationIfWrong": "Python supports functions defined anywhere, including nested scopes."
              },
              {
                "id": "D",
                "text": "Functions can only accept integers as arguments",
                "explanationIfWrong": "Python functions accept any object types."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "First-class citizen status means functions have the exact same rights as data values: passing, returning, assigning, and storing.",
            "id": "q-12-1-functions-as-arguments-0-v1"
          },
          {
            "question": "What is the difference between my_function and my_function() in Python?",
            "options": [
              {
                "id": "A",
                "text": "my_function refers to the function object itself; my_function() invokes and executes the function",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "my_function is a variable; my_function() is a class definition",
                "explanationIfWrong": "Both refer to the same function, one referenced and one called."
              },
              {
                "id": "C",
                "text": "my_function() is deprecated in Python 3",
                "explanationIfWrong": "Parentheses are standard call syntax in all Python versions."
              },
              {
                "id": "D",
                "text": "There is no difference; Python treats them identically",
                "explanationIfWrong": "Omitting parentheses does not call the function."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without parentheses, you obtain a reference to the function object. With parentheses, you invoke it.",
            "id": "q-12-1-functions-as-arguments-0-v2"
          },
          {
            "question": "Given def shout(text): return text.upper(); funcs = [shout]; what does funcs[0]('pilot') evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "'PILOT'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Error: functions cannot be indexed in lists",
                "explanationIfWrong": "Lists can store any Python object, including functions."
              },
              {
                "id": "C",
                "text": "'pilot'",
                "explanationIfWrong": "shout applies .upper(), converting to uppercase."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "shout returns the uppercase string."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "funcs[0] retrieves the shout function object, and calling it with ('pilot') returns 'PILOT'.",
            "id": "q-12-1-functions-as-arguments-0-v3"
          }
        ]
      },
      {
        "heading": "Passing Functions as Arguments (Higher-Order Functions)",
        "text": "A function that takes another function as an argument (or returns a function) is called a 'higher-order function'. Passing functions as arguments allows you to write generic algorithms where the specific behavior is injected from the outside. For instance, a data pipeline runner can accept an arbitrary transformation function and apply it to each item.",
        "codeSnippet": "def apply_operation(numbers, transform_func):\n    # Higher-order function: accepts a function as an argument\n    return [transform_func(x) for x in numbers]\n\ndef square(n): return n ** 2\ndef cube(n): return n ** 3\n\nnums = [1, 2, 3, 4]\nprint(\"Squared:\", apply_operation(nums, square))\nprint(\"Cubed:  \", apply_operation(nums, cube))",
        "terminalOutput": "Squared: [1, 4, 9, 16]\nCubed:   [1, 8, 27, 64]",
        "tip": "Passing functions decouples algorithm flow from specific element-wise calculations.",
        "mcq": {
          "question": "What is a 'higher-order function' in Python?",
          "options": [
            {
              "id": "A",
              "text": "A function that takes one or more functions as arguments, or returns a function as its result",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A function defined with more than 10 parameters",
              "explanationIfWrong": "Parameter count does not make a function higher-order."
            },
            {
              "id": "C",
              "text": "A function that runs with administrator privileges",
              "explanationIfWrong": "Higher-order is a functional programming concept."
            },
            {
              "id": "D",
              "text": "A recursive function with depth > 100",
              "explanationIfWrong": "Higher-order relates to function passing/returning, not recursion depth."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "By definition, a higher-order function operates on other functions by accepting them as inputs or producing them as outputs.",
          "id": "q-12-1-functions-as-arguments-1-v1"
        },
        "retestMcq": {
          "question": "When passing a callback function do_work to execute(do_work), why do you NOT write execute(do_work())?",
          "options": [
            {
              "id": "A",
              "text": "Writing do_work() would execute the function immediately and pass its return value instead of the function itself",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "execute() only accepts strings",
              "explanationIfWrong": "Higher-order functions accept function references."
            },
            {
              "id": "C",
              "text": "Parentheses are forbidden inside function arguments",
              "explanationIfWrong": "Parentheses evaluate the call immediately."
            },
            {
              "id": "D",
              "text": "It raises a SyntaxError",
              "explanationIfWrong": "It is valid syntax, but passes the return value rather than the function callback."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "do_work() executes immediately and passes whatever do_work returns. To pass the callable callback, omit the parentheses.",
          "id": "q-12-1-functions-as-arguments-1-v2"
        },
        "questionPool": [
          {
            "question": "What is a 'higher-order function' in Python?",
            "options": [
              {
                "id": "A",
                "text": "A function that takes one or more functions as arguments, or returns a function as its result",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A function defined with more than 10 parameters",
                "explanationIfWrong": "Parameter count does not make a function higher-order."
              },
              {
                "id": "C",
                "text": "A function that runs with administrator privileges",
                "explanationIfWrong": "Higher-order is a functional programming concept."
              },
              {
                "id": "D",
                "text": "A recursive function with depth > 100",
                "explanationIfWrong": "Higher-order relates to function passing/returning, not recursion depth."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "By definition, a higher-order function operates on other functions by accepting them as inputs or producing them as outputs.",
            "id": "q-12-1-functions-as-arguments-1-v1"
          },
          {
            "question": "When passing a callback function do_work to execute(do_work), why do you NOT write execute(do_work())?",
            "options": [
              {
                "id": "A",
                "text": "Writing do_work() would execute the function immediately and pass its return value instead of the function itself",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "execute() only accepts strings",
                "explanationIfWrong": "Higher-order functions accept function references."
              },
              {
                "id": "C",
                "text": "Parentheses are forbidden inside function arguments",
                "explanationIfWrong": "Parentheses evaluate the call immediately."
              },
              {
                "id": "D",
                "text": "It raises a SyntaxError",
                "explanationIfWrong": "It is valid syntax, but passes the return value rather than the function callback."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "do_work() executes immediately and passes whatever do_work returns. To pass the callable callback, omit the parentheses.",
            "id": "q-12-1-functions-as-arguments-1-v2"
          },
          {
            "question": "Given def run(f, val): return f(val); def inc(x): return x + 1; what does run(inc, 10) return?",
            "options": [
              {
                "id": "A",
                "text": "11",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "10",
                "explanationIfWrong": "inc(10) computes 10 + 1 = 11."
              },
              {
                "id": "C",
                "text": "<function inc>",
                "explanationIfWrong": "run invokes f(val), returning the computed integer."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "Passing a function and calling it is completely valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "run calls inc(10), which evaluates to 11.",
            "id": "q-12-1-functions-as-arguments-1-v3"
          }
        ]
      },
      {
        "heading": "Custom Sorting with key= Functions",
        "text": "Python's built-in `sorted(iterable, key=...)` function and `list.sort(key=...)` method accept a `key` parameter. The `key` must be a function that takes one element and returns a comparison value used for sorting. For example, sorting strings by length is achieved by passing `key=len`. Case-insensitive sorting is achieved with `key=str.lower`. Python never compares elements directly when a key is provided; it compares the values returned by the key function.",
        "codeSnippet": "words = [\"elephant\", \"cat\", \"hippopotamus\", \"dog\", \"antelope\"]\n\n# 1. Default alphabetical sort\nprint(\"Alphabetical:\", sorted(words))\n\n# 2. Sort by length using built-in len function as key\nprint(\"By length:   \", sorted(words, key=len))\n\n# 3. Sort by length in descending order\nprint(\"Longest first:\", sorted(words, key=len, reverse=True))",
        "terminalOutput": "Alphabetical: ['antelope', 'cat', 'dog', 'elephant', 'hippopotamus']\nBy length:    ['cat', 'dog', 'elephant', 'antelope', 'hippopotamus']\nLongest first: ['hippopotamus', 'elephant', 'antelope', 'cat', 'dog']",
        "tip": "The `key` function is called exactly once for each item in the collection (Schwartzian transform), making it extremely fast.",
        "mcq": {
          "question": "How do you sort a list of strings by their character length from shortest to longest?",
          "options": [
            {
              "id": "A",
              "text": "sorted(words, key=len)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "sorted(words, key=len())",
              "explanationIfWrong": "len() would call the function with no arguments and fail; pass the function reference 'len'."
            },
            {
              "id": "C",
              "text": "words.sort(by='length')",
              "explanationIfWrong": "Python uses the 'key' argument, not 'by'."
            },
            {
              "id": "D",
              "text": "sorted(words, length=True)",
              "explanationIfWrong": "'length' is not a valid parameter for sorted()."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "sorted(words, key=len) uses the built-in len function to extract integer lengths for comparison.",
          "id": "q-12-1-functions-as-arguments-2-v1"
        },
        "retestMcq": {
          "question": "How do you perform a case-insensitive alphabetical sort on names = ['bob', 'Alice', 'charlie']?",
          "options": [
            {
              "id": "A",
              "text": "sorted(names, key=str.lower)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "sorted(names, case=False)",
              "explanationIfWrong": "'case' is not a valid parameter for sorted()."
            },
            {
              "id": "C",
              "text": "names.lower().sort()",
              "explanationIfWrong": "Lists do not have a .lower() method."
            },
            {
              "id": "D",
              "text": "sorted(names, ignore_case=True)",
              "explanationIfWrong": "Python uses the key= parameter for custom comparison."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Passing key=str.lower normalizes each string to lowercase for comparison purposes without altering original capitalization in the output.",
          "id": "q-12-1-functions-as-arguments-2-v2"
        },
        "questionPool": [
          {
            "question": "How do you sort a list of strings by their character length from shortest to longest?",
            "options": [
              {
                "id": "A",
                "text": "sorted(words, key=len)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "sorted(words, key=len())",
                "explanationIfWrong": "len() would call the function with no arguments and fail; pass the function reference 'len'."
              },
              {
                "id": "C",
                "text": "words.sort(by='length')",
                "explanationIfWrong": "Python uses the 'key' argument, not 'by'."
              },
              {
                "id": "D",
                "text": "sorted(words, length=True)",
                "explanationIfWrong": "'length' is not a valid parameter for sorted()."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "sorted(words, key=len) uses the built-in len function to extract integer lengths for comparison.",
            "id": "q-12-1-functions-as-arguments-2-v1"
          },
          {
            "question": "How do you perform a case-insensitive alphabetical sort on names = ['bob', 'Alice', 'charlie']?",
            "options": [
              {
                "id": "A",
                "text": "sorted(names, key=str.lower)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "sorted(names, case=False)",
                "explanationIfWrong": "'case' is not a valid parameter for sorted()."
              },
              {
                "id": "C",
                "text": "names.lower().sort()",
                "explanationIfWrong": "Lists do not have a .lower() method."
              },
              {
                "id": "D",
                "text": "sorted(names, ignore_case=True)",
                "explanationIfWrong": "Python uses the key= parameter for custom comparison."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing key=str.lower normalizes each string to lowercase for comparison purposes without altering original capitalization in the output.",
            "id": "q-12-1-functions-as-arguments-2-v2"
          },
          {
            "question": "What is the return value of sorted([-5, 3, -1, 4, -2], key=abs)?",
            "options": [
              {
                "id": "A",
                "text": "[-1, -2, 3, 4, -5]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[-5, -2, -1, 3, 4]",
                "explanationIfWrong": "This is standard numerical order, not absolute value order."
              },
              {
                "id": "C",
                "text": "[1, 2, 3, 4, 5]",
                "explanationIfWrong": "The key function is used only for comparisons; original values are preserved."
              },
              {
                "id": "D",
                "text": "[5, 4, 3, 2, 1]",
                "explanationIfWrong": "The default order is ascending absolute value."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The elements are sorted by their absolute values: |-1|=1, |-2|=2, |3|=3, |4|=4, |-5|=5. Original negative signs are kept.",
            "id": "q-12-1-functions-as-arguments-2-v3"
          }
        ]
      },
      {
        "heading": "Sorting Complex Structures by Custom Criteria",
        "text": "When sorting tuples, dictionaries, or custom objects, you can define custom key functions that return specific fields or even multiple comparison criteria as a tuple. Python compares tuples lexicographically (first element, then second element to break ties). You can also use `operator.itemgetter()` or `operator.attrgetter()` for clean extraction.",
        "codeSnippet": "students = [\n    (\"Alice\", 85),\n    (\"Bob\", 92),\n    (\"Charlie\", 85),\n    (\"Diana\", 95)\n]\n\ndef by_grade_then_name(item):\n    name, grade = item\n    # Sort descending by grade (-grade), then ascending by name\n    return (-grade, name)\n\nsorted_students = sorted(students, key=by_grade_then_name)\nfor name, grade in sorted_students:\n    print(f\"{name}: {grade}\")",
        "terminalOutput": "Diana: 95\nBob: 92\nAlice: 85\nCharlie: 85",
        "tip": "Returning a tuple `(criterion1, criterion2)` in a key function effortlessly implements tie-breaking!",
        "mcq": {
          "question": "How does Python break ties when a key function returns a tuple (a, b)?",
          "options": [
            {
              "id": "A",
              "text": "It compares 'a' first; if 'a' values are equal, it compares 'b'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It adds 'a' and 'b' together",
              "explanationIfWrong": "Tuples are compared item-by-item, not summed."
            },
            {
              "id": "C",
              "text": "It raises a TieError",
              "explanationIfWrong": "Python handles ties deterministically using tuple ordering."
            },
            {
              "id": "D",
              "text": "It chooses randomly",
              "explanationIfWrong": "Python sorting is completely deterministic."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python compares tuples position-by-position from left to right, comparing the second element only when the first matches.",
          "id": "q-12-1-functions-as-arguments-3-v1"
        },
        "retestMcq": {
          "question": "Given people = [{'name': 'Ada', 'age': 30}, {'name': 'Alan', 'age': 25}], how do you sort them by age using a custom function?",
          "options": [
            {
              "id": "A",
              "text": "def get_age(p): return p['age']\nsorted(people, key=get_age)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "sorted(people, key='age')",
              "explanationIfWrong": "The key must be a callable function, not a string."
            },
            {
              "id": "C",
              "text": "people.sort('age')",
              "explanationIfWrong": ".sort() requires key= callable parameter."
            },
            {
              "id": "D",
              "text": "sorted(people, by=people['age'])",
              "explanationIfWrong": "people['age'] is invalid because people is a list."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The key function extracts the 'age' value from each dictionary for comparison.",
          "id": "q-12-1-functions-as-arguments-3-v2"
        },
        "questionPool": [
          {
            "question": "How does Python break ties when a key function returns a tuple (a, b)?",
            "options": [
              {
                "id": "A",
                "text": "It compares 'a' first; if 'a' values are equal, it compares 'b'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It adds 'a' and 'b' together",
                "explanationIfWrong": "Tuples are compared item-by-item, not summed."
              },
              {
                "id": "C",
                "text": "It raises a TieError",
                "explanationIfWrong": "Python handles ties deterministically using tuple ordering."
              },
              {
                "id": "D",
                "text": "It chooses randomly",
                "explanationIfWrong": "Python sorting is completely deterministic."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python compares tuples position-by-position from left to right, comparing the second element only when the first matches.",
            "id": "q-12-1-functions-as-arguments-3-v1"
          },
          {
            "question": "Given people = [{'name': 'Ada', 'age': 30}, {'name': 'Alan', 'age': 25}], how do you sort them by age using a custom function?",
            "options": [
              {
                "id": "A",
                "text": "def get_age(p): return p['age']\nsorted(people, key=get_age)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "sorted(people, key='age')",
                "explanationIfWrong": "The key must be a callable function, not a string."
              },
              {
                "id": "C",
                "text": "people.sort('age')",
                "explanationIfWrong": ".sort() requires key= callable parameter."
              },
              {
                "id": "D",
                "text": "sorted(people, by=people['age'])",
                "explanationIfWrong": "people['age'] is invalid because people is a list."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The key function extracts the 'age' value from each dictionary for comparison.",
            "id": "q-12-1-functions-as-arguments-3-v2"
          },
          {
            "question": "What is the stability guarantee of Python's Timsort algorithm used by sorted()?",
            "options": [
              {
                "id": "A",
                "text": "It is stable: elements with equal keys maintain their original relative order",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It is unstable: equal items are shuffled randomly",
                "explanationIfWrong": "Timsort guarantees stability."
              },
              {
                "id": "C",
                "text": "It is only stable for integers, not strings",
                "explanationIfWrong": "Stability applies to all types."
              },
              {
                "id": "D",
                "text": "Stability is disabled when using key=",
                "explanationIfWrong": "Keyed sorting remains completely stable."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's Timsort is strictly stable: items with equal comparison keys are guaranteed to preserve their relative input order.",
            "id": "q-12-1-functions-as-arguments-3-v3"
          }
        ]
      },
      {
        "heading": "Returning Functions: Function Factories",
        "text": "Because functions are first-class values, a function can create and return another function. This design pattern is called a 'function factory'. A factory takes configuration parameters and constructs a specialized inner function tailored to those settings.",
        "codeSnippet": "def make_multiplier(factor):\n    # Factory function returns a specialized inner function\n    def multiplier(number):\n        return number * factor\n    return multiplier\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\n\nprint(\"Double 5 =\", double(5))\nprint(\"Triple 5 =\", triple(5))\nprint(\"Double 12 =\", double(12))",
        "terminalOutput": "Double 5 = 10\nTriple 5 = 15\nDouble 12 = 24",
        "tip": "Notice how `double` remembers `factor=2` even after `make_multiplier` has finished executing!",
        "mcq": {
          "question": "What is a 'function factory' in Python?",
          "options": [
            {
              "id": "A",
              "text": "An outer function that configures and returns a new inner function",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A class with a __call__ method",
              "explanationIfWrong": "While callable classes exist, a function factory refers to a function returning functions."
            },
            {
              "id": "C",
              "text": "A built-in module for compiling C extensions",
              "explanationIfWrong": "Function factories are pure Python closures."
            },
            {
              "id": "D",
              "text": "A generator that yields integers",
              "explanationIfWrong": "Factories return function objects, not data streams."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A function factory encapsulates creation logic and returns specialized function objects.",
          "id": "q-12-1-functions-as-arguments-4-v1"
        },
        "retestMcq": {
          "question": "In def maker(n): def f(x): return x + n; return f; what does maker(5)(10) evaluate to?",
          "options": [
            {
              "id": "A",
              "text": "15",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "50",
              "explanationIfWrong": "The function performs addition (+), not multiplication (*)."
            },
            {
              "id": "C",
              "text": "<function f>",
              "explanationIfWrong": "maker(5) returns f; the second call (10) invokes f(10) which returns 15."
            },
            {
              "id": "D",
              "text": "TypeError",
              "explanationIfWrong": "Chained calling maker(5)(10) is valid in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "maker(5) produces a function that adds 5. Calling it with argument 10 yields 10 + 5 = 15.",
          "id": "q-12-1-functions-as-arguments-4-v2"
        },
        "questionPool": [
          {
            "question": "What is a 'function factory' in Python?",
            "options": [
              {
                "id": "A",
                "text": "An outer function that configures and returns a new inner function",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A class with a __call__ method",
                "explanationIfWrong": "While callable classes exist, a function factory refers to a function returning functions."
              },
              {
                "id": "C",
                "text": "A built-in module for compiling C extensions",
                "explanationIfWrong": "Function factories are pure Python closures."
              },
              {
                "id": "D",
                "text": "A generator that yields integers",
                "explanationIfWrong": "Factories return function objects, not data streams."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A function factory encapsulates creation logic and returns specialized function objects.",
            "id": "q-12-1-functions-as-arguments-4-v1"
          },
          {
            "question": "In def maker(n): def f(x): return x + n; return f; what does maker(5)(10) evaluate to?",
            "options": [
              {
                "id": "A",
                "text": "15",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "50",
                "explanationIfWrong": "The function performs addition (+), not multiplication (*)."
              },
              {
                "id": "C",
                "text": "<function f>",
                "explanationIfWrong": "maker(5) returns f; the second call (10) invokes f(10) which returns 15."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "Chained calling maker(5)(10) is valid in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "maker(5) produces a function that adds 5. Calling it with argument 10 yields 10 + 5 = 15.",
            "id": "q-12-1-functions-as-arguments-4-v2"
          },
          {
            "question": "Can a returned inner function have different behavior depending on the arguments passed to the outer factory?",
            "options": [
              {
                "id": "A",
                "text": "Yes, the returned function captures the outer factory arguments in its closure",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, all returned inner functions are identical",
                "explanationIfWrong": "Each call to the factory creates a unique closure with distinct captured values."
              },
              {
                "id": "C",
                "text": "Only if the factory is a class",
                "explanationIfWrong": "Standard functions capture closures without classes."
              },
              {
                "id": "D",
                "text": "Only if global variables are used",
                "explanationIfWrong": "Closures avoid globals by binding to local enclosing scopes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each invocation of the factory produces a distinct inner function with its own private closure environment.",
            "id": "q-12-1-functions-as-arguments-4-v3"
          }
        ]
      },
      {
        "heading": "Lexical Closures & Enclosing Scope",
        "text": "A 'closure' is a function that retains access to variables from its enclosing lexical scope even after that enclosing scope has finished executing. In Python's LEGB (Local, Enclosing, Global, Built-in) rule, inner functions look up 'free variables' in their enclosing scope. To modify an enclosing variable inside an inner function, use the `nonlocal` keyword.",
        "codeSnippet": "def make_counter(start=0):\n    count = start  # Enclosing variable\n    \n    def counter():\n        nonlocal count  # Declare intention to mutate enclosing variable\n        count += 1\n        return count\n    \n    return counter\n\nc1 = make_counter(0)\nc2 = make_counter(100)\n\nprint(\"c1:\", c1(), c1(), c1())\nprint(\"c2:\", c2(), c2())\nprint(\"c1 again:\", c1())",
        "terminalOutput": "c1: 1 2 3\nc2: 101 102\nc1 again: 4",
        "tip": "Closures provide lightweight state encapsulation without needing full class definitions.",
        "mcq": {
          "question": "What is a closure in Python?",
          "options": [
            {
              "id": "A",
              "text": "An inner function that remembers and can access variables from its enclosing scope even after the outer function has returned",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A function that has been deleted using del",
              "explanationIfWrong": "A closure is an active callable object with bound enclosing variables."
            },
            {
              "id": "C",
              "text": "A file handle that was closed using .close()",
              "explanationIfWrong": "Closures refer to functional variable scope, not files."
            },
            {
              "id": "D",
              "text": "A function that cannot take arguments",
              "explanationIfWrong": "Closures can accept any arguments."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Closures bundle a function with its lexical environment, preserving variables from the outer scope across subsequent invocations.",
          "id": "q-12-1-functions-as-arguments-5-v1"
        },
        "retestMcq": {
          "question": "What keyword is required to rebind/mutate a variable in the enclosing (outer function) scope?",
          "options": [
            {
              "id": "A",
              "text": "nonlocal",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "global",
              "explanationIfWrong": "'global' targets module-level variables, not enclosing nested scopes."
            },
            {
              "id": "C",
              "text": "outer",
              "explanationIfWrong": "'outer' is not a Python keyword."
            },
            {
              "id": "D",
              "text": "enclose",
              "explanationIfWrong": "'enclose' is not a Python keyword."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The 'nonlocal' keyword allows an inner function to assign to a variable defined in the nearest enclosing non-global scope.",
          "id": "q-12-1-functions-as-arguments-5-v2"
        },
        "questionPool": [
          {
            "question": "What is a closure in Python?",
            "options": [
              {
                "id": "A",
                "text": "An inner function that remembers and can access variables from its enclosing scope even after the outer function has returned",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A function that has been deleted using del",
                "explanationIfWrong": "A closure is an active callable object with bound enclosing variables."
              },
              {
                "id": "C",
                "text": "A file handle that was closed using .close()",
                "explanationIfWrong": "Closures refer to functional variable scope, not files."
              },
              {
                "id": "D",
                "text": "A function that cannot take arguments",
                "explanationIfWrong": "Closures can accept any arguments."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Closures bundle a function with its lexical environment, preserving variables from the outer scope across subsequent invocations.",
            "id": "q-12-1-functions-as-arguments-5-v1"
          },
          {
            "question": "What keyword is required to rebind/mutate a variable in the enclosing (outer function) scope?",
            "options": [
              {
                "id": "A",
                "text": "nonlocal",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "global",
                "explanationIfWrong": "'global' targets module-level variables, not enclosing nested scopes."
              },
              {
                "id": "C",
                "text": "outer",
                "explanationIfWrong": "'outer' is not a Python keyword."
              },
              {
                "id": "D",
                "text": "enclose",
                "explanationIfWrong": "'enclose' is not a Python keyword."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The 'nonlocal' keyword allows an inner function to assign to a variable defined in the nearest enclosing non-global scope.",
            "id": "q-12-1-functions-as-arguments-5-v2"
          },
          {
            "question": "Are the states of c1 and c2 independent when created by c1 = make_counter(); c2 = make_counter()?",
            "options": [
              {
                "id": "A",
                "text": "Yes, each call to make_counter() creates a separate, independent closure environment",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, they share the same counter variable in memory",
                "explanationIfWrong": "Each factory invocation creates independent local frame storage."
              },
              {
                "id": "C",
                "text": "Only until c1 reaches 10",
                "explanationIfWrong": "Their closures remain permanently isolated."
              },
              {
                "id": "D",
                "text": "They overwrite each other",
                "explanationIfWrong": "Python maintains distinct closures for separate function instances."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Every invocation of the factory produces fresh local frame variables, guaranteeing complete closure isolation.",
            "id": "q-12-1-functions-as-arguments-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "12-2-generators-and-iterators",
    "number": "12.2",
    "title": "Generators & the 'yield' Keyword",
    "subtitle": "Construct memory-efficient streaming pipelines using generator functions and the iterator protocol.",
    "readTime": "24 min",
    "objectives": [
      "Master the iterator protocol: iter(), next(), and the StopIteration exception",
      "Define generator functions using the yield statement",
      "Understand generator lifecycle: pausing, resuming, and state preservation",
      "Process multi-gigabyte datasets in constant O(1) memory using streaming generators",
      "Construct infinite sequences safely without exhausting RAM",
      "Chain generator stages together and delegate execution with yield from"
    ],
    "theoryBlocks": [
      {
        "heading": "The Iterator Protocol: iter() and next()",
        "text": "In Python, iteration is governed by two methods: `__iter__()` and `__next__()`. An 'iterable' is any object that can return an iterator (via `iter(obj)`). An 'iterator' is an object with a state that yields the next element when `next(iterator)` is called. When there are no more items, `__next__()` raises the `StopIteration` exception. A `for` loop in Python is simply syntactic sugar over `iter()`, `next()`, and catching `StopIteration`.",
        "codeSnippet": "numbers = [10, 20, 30]\n\n# 1. Obtain iterator from iterable list\nit = iter(numbers)\n\n# 2. Retrieve items manually\nprint(next(it))\nprint(next(it))\nprint(next(it))\n\n# 3. Next call raises StopIteration\ntry:\n    print(next(it))\nexcept StopIteration:\n    print(\"StopIteration: sequence exhausted!\")",
        "terminalOutput": "10\n20\n30\nStopIteration: sequence exhausted!",
        "tip": "Any object that implements `__iter__()` and `__next__()` satisfies Python's iterator protocol.",
        "mcq": {
          "question": "What exception is raised by an iterator when no more elements are available?",
          "options": [
            {
              "id": "A",
              "text": "StopIteration",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "IndexError",
              "explanationIfWrong": "IndexError is for invalid sequence indexing; iterators raise StopIteration."
            },
            {
              "id": "C",
              "text": "EOFError",
              "explanationIfWrong": "EOFError is for end-of-file reading."
            },
            {
              "id": "D",
              "text": "IteratorExhaustedError",
              "explanationIfWrong": "Python's standard exception is named StopIteration."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The iterator protocol specifies that __next__() signals completion by raising the StopIteration exception.",
          "id": "q-12-2-generators-and-iterators-0-v1"
        },
        "retestMcq": {
          "question": "What does a standard 'for item in collection:' loop do behind the scenes?",
          "options": [
            {
              "id": "A",
              "text": "Calls iter() on collection to get an iterator, repeatedly calls next(), and terminates cleanly on StopIteration",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Converts the entire collection to a C array",
              "explanationIfWrong": "Python uses the iterator protocol directly."
            },
            {
              "id": "C",
              "text": "Uses integer indexing collection[0], collection[1] exclusively",
              "explanationIfWrong": "Many iterables (like sets and generators) cannot be indexed."
            },
            {
              "id": "D",
              "text": "Spawns a background thread",
              "explanationIfWrong": "Iteration is strictly synchronous."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Python for loop is built directly on the iterator protocol: iter(), next(), and catching StopIteration.",
          "id": "q-12-2-generators-and-iterators-0-v2"
        },
        "questionPool": [
          {
            "question": "What exception is raised by an iterator when no more elements are available?",
            "options": [
              {
                "id": "A",
                "text": "StopIteration",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "IndexError",
                "explanationIfWrong": "IndexError is for invalid sequence indexing; iterators raise StopIteration."
              },
              {
                "id": "C",
                "text": "EOFError",
                "explanationIfWrong": "EOFError is for end-of-file reading."
              },
              {
                "id": "D",
                "text": "IteratorExhaustedError",
                "explanationIfWrong": "Python's standard exception is named StopIteration."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The iterator protocol specifies that __next__() signals completion by raising the StopIteration exception.",
            "id": "q-12-2-generators-and-iterators-0-v1"
          },
          {
            "question": "What does a standard 'for item in collection:' loop do behind the scenes?",
            "options": [
              {
                "id": "A",
                "text": "Calls iter() on collection to get an iterator, repeatedly calls next(), and terminates cleanly on StopIteration",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Converts the entire collection to a C array",
                "explanationIfWrong": "Python uses the iterator protocol directly."
              },
              {
                "id": "C",
                "text": "Uses integer indexing collection[0], collection[1] exclusively",
                "explanationIfWrong": "Many iterables (like sets and generators) cannot be indexed."
              },
              {
                "id": "D",
                "text": "Spawns a background thread",
                "explanationIfWrong": "Iteration is strictly synchronous."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Python for loop is built directly on the iterator protocol: iter(), next(), and catching StopIteration.",
            "id": "q-12-2-generators-and-iterators-0-v2"
          },
          {
            "question": "Can next() accept a default fallback value to avoid raising StopIteration?",
            "options": [
              {
                "id": "A",
                "text": "Yes: next(it, default_value) returns default_value when exhausted without raising an exception",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, next() only takes a single argument",
                "explanationIfWrong": "next(iterator, default) is built into Python."
              },
              {
                "id": "C",
                "text": "Only if default_value is None",
                "explanationIfWrong": "Any object can be used as the default value."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "This is standard in all modern Python versions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling next(it, fallback) returns fallback if the iterator is exhausted, preventing a StopIteration exception.",
            "id": "q-12-2-generators-and-iterators-0-v3"
          }
        ]
      },
      {
        "heading": "Generator Functions & the 'yield' Statement",
        "text": "A generator function is a function that contains one or more `yield` statements instead of `return`. When called, a generator function DOES NOT execute its code immediately; instead, it returns a generator iterator object. When `next()` is called on this generator, code executes until it hits `yield`. It produces the yielded value and pauses its execution, preserving all local variables and instruction state. When `next()` is called again, execution resumes immediately after the `yield` statement.",
        "codeSnippet": "def countdown_generator(n):\n    print(f\"[Generator started with n={n}]\")\n    while n > 0:\n        yield n  # Pauses execution and returns value\n        n -= 1\n    print(\"[Generator completed]\")\n\ngen = countdown_generator(3)\nprint(\"Calling next:\", next(gen))\nprint(\"Calling next:\", next(gen))\nprint(\"Calling next:\", next(gen))",
        "terminalOutput": "[Generator started with n=3]\nCalling next: 3\nCalling next: 2\nCalling next: 1",
        "tip": "A generator function is like a function that can pause and resume across multiple calls without losing its local state.",
        "mcq": {
          "question": "What keyword transforms a regular Python function into a generator function?",
          "options": [
            {
              "id": "A",
              "text": "yield",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "generator",
              "explanationIfWrong": "'generator' is not a Python keyword."
            },
            {
              "id": "C",
              "text": "emit",
              "explanationIfWrong": "'emit' is used in event systems, not Python generators."
            },
            {
              "id": "D",
              "text": "return_stream",
              "explanationIfWrong": "Python uses the standard 'yield' keyword."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Any function containing the 'yield' keyword compiles into a generator function in Python.",
          "id": "q-12-2-generators-and-iterators-1-v1"
        },
        "retestMcq": {
          "question": "What happens when you call a generator function gen_func() directly?",
          "options": [
            {
              "id": "A",
              "text": "It returns a generator iterator object immediately without running the function body yet",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It executes the entire function body and returns a list",
              "explanationIfWrong": "Generators evaluate lazily on next() calls."
            },
            {
              "id": "C",
              "text": "It yields the first value immediately",
              "explanationIfWrong": "Execution begins only when next() or a for loop is applied."
            },
            {
              "id": "D",
              "text": "It raises a TypeError",
              "explanationIfWrong": "Invoking a generator returns a generator object."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Calling a generator function instantiates the generator iterator. The function code only begins running upon the first next() call.",
          "id": "q-12-2-generators-and-iterators-1-v2"
        },
        "questionPool": [
          {
            "question": "What keyword transforms a regular Python function into a generator function?",
            "options": [
              {
                "id": "A",
                "text": "yield",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "generator",
                "explanationIfWrong": "'generator' is not a Python keyword."
              },
              {
                "id": "C",
                "text": "emit",
                "explanationIfWrong": "'emit' is used in event systems, not Python generators."
              },
              {
                "id": "D",
                "text": "return_stream",
                "explanationIfWrong": "Python uses the standard 'yield' keyword."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Any function containing the 'yield' keyword compiles into a generator function in Python.",
            "id": "q-12-2-generators-and-iterators-1-v1"
          },
          {
            "question": "What happens when you call a generator function gen_func() directly?",
            "options": [
              {
                "id": "A",
                "text": "It returns a generator iterator object immediately without running the function body yet",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It executes the entire function body and returns a list",
                "explanationIfWrong": "Generators evaluate lazily on next() calls."
              },
              {
                "id": "C",
                "text": "It yields the first value immediately",
                "explanationIfWrong": "Execution begins only when next() or a for loop is applied."
              },
              {
                "id": "D",
                "text": "It raises a TypeError",
                "explanationIfWrong": "Invoking a generator returns a generator object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling a generator function instantiates the generator iterator. The function code only begins running upon the first next() call.",
            "id": "q-12-2-generators-and-iterators-1-v2"
          },
          {
            "question": "What happens to a generator's local variables when a yield statement is reached?",
            "options": [
              {
                "id": "A",
                "text": "They are frozen in memory, preserving their exact state until execution resumes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They are deleted and re-initialized on the next call",
                "explanationIfWrong": "Generators maintain full local state between yields."
              },
              {
                "id": "C",
                "text": "They are converted to global variables",
                "explanationIfWrong": "Local variables remain private to the generator frame."
              },
              {
                "id": "D",
                "text": "They are written to a temporary disk cache",
                "explanationIfWrong": "State is held in-memory in the generator object frame."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Yield suspends execution and freezes local variables and instruction pointers so execution can resume seamlessly.",
            "id": "q-12-2-generators-and-iterators-1-v3"
          }
        ]
      },
      {
        "heading": "Memory Profiling: Lists vs Generators",
        "text": "The primary superpower of generators is memory efficiency. A list that stores 10 million integers requires hundreds of megabytes of RAM because all values must reside in memory simultaneously. A generator yielding 10 million integers uses only a few bytes ($O(1)$ memory) because it computes each value on-the-fly and discards it after use.",
        "codeSnippet": "import sys\n\n# 1. Range generator function\ndef number_stream(limit):\n    num = 0\n    while num < limit:\n        yield num\n        num += 1\n\nstream = number_stream(10_000_000)\nprint(\"Generator RAM size:\", sys.getsizeof(stream), \"bytes\")\n\n# First 3 values\nprint(\"First item:\", next(stream))\nprint(\"Second item:\", next(stream))\nprint(\"Third item:\", next(stream))",
        "terminalOutput": "Generator RAM size: 104 bytes\nFirst item: 0\nSecond item: 1\nThird item: 2",
        "tip": "For large datasets (server access logs, machine learning data loaders, sensor streams), always use generators!",
        "mcq": {
          "question": "Why is a generator preferred over a list when processing a 10 GB server log file?",
          "options": [
            {
              "id": "A",
              "text": "The generator streams line-by-line using negligible memory (~few KB), whereas a list would attempt to load all 10 GB into RAM and crash",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Generators compress text using gzip automatically",
              "explanationIfWrong": "Generators do not compress; they stream lazily."
            },
            {
              "id": "C",
              "text": "Generators run faster than CPU clock speed",
              "explanationIfWrong": "Speed is governed by CPU/IO; memory footprint is the big gain."
            },
            {
              "id": "D",
              "text": "Lists cannot store string characters",
              "explanationIfWrong": "Lists can store strings, but memory allocation is eager."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Streaming data line-by-line with generators avoids out-of-memory crashes by maintaining an O(1) memory footprint.",
          "id": "q-12-2-generators-and-iterators-2-v1"
        },
        "retestMcq": {
          "question": "What is the space complexity of a generator function yielding N items?",
          "options": [
            {
              "id": "A",
              "text": "O(1) constant auxiliary space",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "O(N) linear space",
              "explanationIfWrong": "Lists require O(N); generators require only O(1) memory."
            },
            {
              "id": "C",
              "text": "O(N^2) quadratic space",
              "explanationIfWrong": "Generators never use quadratic space."
            },
            {
              "id": "D",
              "text": "O(log N)",
              "explanationIfWrong": "No tree structures are allocated."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because items are yielded one at a time on demand, a generator consumes a fixed O(1) amount of memory regardless of N.",
          "id": "q-12-2-generators-and-iterators-2-v2"
        },
        "questionPool": [
          {
            "question": "Why is a generator preferred over a list when processing a 10 GB server log file?",
            "options": [
              {
                "id": "A",
                "text": "The generator streams line-by-line using negligible memory (~few KB), whereas a list would attempt to load all 10 GB into RAM and crash",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Generators compress text using gzip automatically",
                "explanationIfWrong": "Generators do not compress; they stream lazily."
              },
              {
                "id": "C",
                "text": "Generators run faster than CPU clock speed",
                "explanationIfWrong": "Speed is governed by CPU/IO; memory footprint is the big gain."
              },
              {
                "id": "D",
                "text": "Lists cannot store string characters",
                "explanationIfWrong": "Lists can store strings, but memory allocation is eager."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Streaming data line-by-line with generators avoids out-of-memory crashes by maintaining an O(1) memory footprint.",
            "id": "q-12-2-generators-and-iterators-2-v1"
          },
          {
            "question": "What is the space complexity of a generator function yielding N items?",
            "options": [
              {
                "id": "A",
                "text": "O(1) constant auxiliary space",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "O(N) linear space",
                "explanationIfWrong": "Lists require O(N); generators require only O(1) memory."
              },
              {
                "id": "C",
                "text": "O(N^2) quadratic space",
                "explanationIfWrong": "Generators never use quadratic space."
              },
              {
                "id": "D",
                "text": "O(log N)",
                "explanationIfWrong": "No tree structures are allocated."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because items are yielded one at a time on demand, a generator consumes a fixed O(1) amount of memory regardless of N.",
            "id": "q-12-2-generators-and-iterators-2-v2"
          },
          {
            "question": "Can you iterate through the same generator instance a second time after it has finished?",
            "options": [
              {
                "id": "A",
                "text": "No, once an iterator is exhausted, calling next() continues to raise StopIteration; you must create a new generator instance",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, generators automatically rewind to the beginning",
                "explanationIfWrong": "Generators are strictly single-pass and do not rewind."
              },
              {
                "id": "C",
                "text": "Only if reset() is called",
                "explanationIfWrong": "Generators do not have a reset() method."
              },
              {
                "id": "D",
                "text": "Yes, infinitely many times",
                "explanationIfWrong": "Generators are one-way streams."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Generators are consumable, single-pass iterators. Once exhausted, a new generator object must be created to iterate again.",
            "id": "q-12-2-generators-and-iterators-2-v3"
          }
        ]
      },
      {
        "heading": "Infinite Generators",
        "text": "Because generators produce values lazily on-demand, they can model infinite mathematical sequences without infinite loops or memory crashes. As long as the consumer controls when to stop requesting items (such as breaking after 10 items), an infinite generator is completely safe.",
        "codeSnippet": "def fibonacci_infinite():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci_infinite()\nfirst_8_fibs = [next(fib) for _ in range(8)]\nprint(\"First 8 Fibonacci numbers:\", first_8_fibs)",
        "terminalOutput": "First 8 Fibonacci numbers: [0, 1, 1, 2, 3, 5, 8, 13]",
        "tip": "Infinite generators: `while True: yield ...` works because `yield` pauses execution on every step until the caller asks for the next item.",
        "mcq": {
          "question": "Why does a while True loop inside a generator function NOT cause an infinite freeze?",
          "options": [
            {
              "id": "A",
              "text": "Because yield pauses execution on each loop iteration, handing control back to the caller until next() is invoked",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because Python automatically breaks while True loops after 1000 steps",
              "explanationIfWrong": "Python does not break loops automatically."
            },
            {
              "id": "C",
              "text": "Because while True is ignored by generators",
              "explanationIfWrong": "The loop executes normally between yield statements."
            },
            {
              "id": "D",
              "text": "Because it runs in a background OS thread",
              "explanationIfWrong": "Generators are synchronous."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The yield keyword pauses execution immediately, waiting until the consumer requests the next item.",
          "id": "q-12-2-generators-and-iterators-3-v1"
        },
        "retestMcq": {
          "question": "What happens if you evaluate list(infinite_generator()) on an infinite generator?",
          "options": [
            {
              "id": "A",
              "text": "The program hangs indefinitely until memory is exhausted and raises MemoryError",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It takes the first 10 items",
              "explanationIfWrong": "list() consumes until StopIteration, which an infinite generator never raises."
            },
            {
              "id": "C",
              "text": "It returns an empty list",
              "explanationIfWrong": "list() attempts to drain the generator."
            },
            {
              "id": "D",
              "text": "It raises a TypeError",
              "explanationIfWrong": "Generators are valid iterables, but infinite ones cannot be fully collected."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "list() attempts to read until StopIteration. Since the generator never stops, it attempts to consume infinite memory.",
          "id": "q-12-2-generators-and-iterators-3-v2"
        },
        "questionPool": [
          {
            "question": "Why does a while True loop inside a generator function NOT cause an infinite freeze?",
            "options": [
              {
                "id": "A",
                "text": "Because yield pauses execution on each loop iteration, handing control back to the caller until next() is invoked",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python automatically breaks while True loops after 1000 steps",
                "explanationIfWrong": "Python does not break loops automatically."
              },
              {
                "id": "C",
                "text": "Because while True is ignored by generators",
                "explanationIfWrong": "The loop executes normally between yield statements."
              },
              {
                "id": "D",
                "text": "Because it runs in a background OS thread",
                "explanationIfWrong": "Generators are synchronous."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The yield keyword pauses execution immediately, waiting until the consumer requests the next item.",
            "id": "q-12-2-generators-and-iterators-3-v1"
          },
          {
            "question": "What happens if you evaluate list(infinite_generator()) on an infinite generator?",
            "options": [
              {
                "id": "A",
                "text": "The program hangs indefinitely until memory is exhausted and raises MemoryError",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It takes the first 10 items",
                "explanationIfWrong": "list() consumes until StopIteration, which an infinite generator never raises."
              },
              {
                "id": "C",
                "text": "It returns an empty list",
                "explanationIfWrong": "list() attempts to drain the generator."
              },
              {
                "id": "D",
                "text": "It raises a TypeError",
                "explanationIfWrong": "Generators are valid iterables, but infinite ones cannot be fully collected."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "list() attempts to read until StopIteration. Since the generator never stops, it attempts to consume infinite memory.",
            "id": "q-12-2-generators-and-iterators-3-v2"
          },
          {
            "question": "How do you safely extract the first N items from an infinite generator gen?",
            "options": [
              {
                "id": "A",
                "text": "[next(gen) for _ in range(N)]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "gen[:N]",
                "explanationIfWrong": "Generators do not support slice indexing."
              },
              {
                "id": "C",
                "text": "list(gen, limit=N)",
                "explanationIfWrong": "list() does not take a limit parameter."
              },
              {
                "id": "D",
                "text": "gen.take(N)",
                "explanationIfWrong": "Python generators do not have a .take() method."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Using a list comprehension with range(N) and next(gen) cleanly pulls exactly N items.",
            "id": "q-12-2-generators-and-iterators-3-v3"
          }
        ]
      },
      {
        "heading": "Generator Pipelines & Chaining",
        "text": "Generators can be chained together in pipelines, reminiscent of Unix pipes (`cat log.txt | grep ERROR | cut`). Each generator takes an input stream, applies a transformation or filter, and yields items to the next generator downstream. Data flows element-by-element through the entire pipeline without allocating intermediate lists in RAM.",
        "codeSnippet": "# Simulated data stream\ndef raw_lines():\n    lines = [\"  INFO: Server started \", \"  ERROR: Disk full \", \" DEBUG: ping \", \" ERROR: Timeout \"]\n    for line in lines:\n        yield line\n\n# Stage 1: Strip whitespace\ndef clean_lines(lines):\n    for line in lines:\n        yield line.strip()\n\n# Stage 2: Filter only ERROR logs\ndef error_filter(lines):\n    for line in lines:\n        if line.startswith(\"ERROR\"):\n            yield line\n\n# Assemble streaming pipeline\npipeline = error_filter(clean_lines(raw_lines()))\nfor err in pipeline:\n    print(\"Found alert:\", err)",
        "terminalOutput": "Found alert: ERROR: Disk full\nFound alert: ERROR: Timeout",
        "tip": "In a generator pipeline, each element travels through the entire pipeline before the next element is pulled.",
        "mcq": {
          "question": "What is the primary benefit of designing data processing with generator pipelines?",
          "options": [
            {
              "id": "A",
              "text": "Elements flow one by one through all stages without creating intermediate collections in memory",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Pipelines automatically multi-thread across all CPU cores",
              "explanationIfWrong": "Generators are single-threaded unless explicitly distributed."
            },
            {
              "id": "C",
              "text": "Pipelines eliminate the need for error handling",
              "explanationIfWrong": "Exceptions still propagate through generators."
            },
            {
              "id": "D",
              "text": "It converts data into SQL tables",
              "explanationIfWrong": "Generators operate on arbitrary Python objects."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Generator pipelines process records element-by-element lazily, keeping memory consumption minimal at every stage.",
          "id": "q-12-2-generators-and-iterators-4-v1"
        },
        "retestMcq": {
          "question": "In a pipeline out = filter_gen(transform_gen(source_gen())), which stage runs first when next(out) is called?",
          "options": [
            {
              "id": "A",
              "text": "out asks filter_gen for an item, which asks transform_gen, which asks source_gen (pull-based demand)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "source_gen runs to completion before transform_gen starts",
              "explanationIfWrong": "Generators do not buffer entire streams."
            },
            {
              "id": "C",
              "text": "All stages run simultaneously on separate processes",
              "explanationIfWrong": "Standard generators are pull-based and synchronous."
            },
            {
              "id": "D",
              "text": "filter_gen transforms the entire dataset upfront",
              "explanationIfWrong": "Nothing runs until downstream requests an item."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python generator pipelines are pull-based: requests cascade upstream on-demand to fetch the next single item.",
          "id": "q-12-2-generators-and-iterators-4-v2"
        },
        "questionPool": [
          {
            "question": "What is the primary benefit of designing data processing with generator pipelines?",
            "options": [
              {
                "id": "A",
                "text": "Elements flow one by one through all stages without creating intermediate collections in memory",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Pipelines automatically multi-thread across all CPU cores",
                "explanationIfWrong": "Generators are single-threaded unless explicitly distributed."
              },
              {
                "id": "C",
                "text": "Pipelines eliminate the need for error handling",
                "explanationIfWrong": "Exceptions still propagate through generators."
              },
              {
                "id": "D",
                "text": "It converts data into SQL tables",
                "explanationIfWrong": "Generators operate on arbitrary Python objects."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Generator pipelines process records element-by-element lazily, keeping memory consumption minimal at every stage.",
            "id": "q-12-2-generators-and-iterators-4-v1"
          },
          {
            "question": "In a pipeline out = filter_gen(transform_gen(source_gen())), which stage runs first when next(out) is called?",
            "options": [
              {
                "id": "A",
                "text": "out asks filter_gen for an item, which asks transform_gen, which asks source_gen (pull-based demand)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "source_gen runs to completion before transform_gen starts",
                "explanationIfWrong": "Generators do not buffer entire streams."
              },
              {
                "id": "C",
                "text": "All stages run simultaneously on separate processes",
                "explanationIfWrong": "Standard generators are pull-based and synchronous."
              },
              {
                "id": "D",
                "text": "filter_gen transforms the entire dataset upfront",
                "explanationIfWrong": "Nothing runs until downstream requests an item."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python generator pipelines are pull-based: requests cascade upstream on-demand to fetch the next single item.",
            "id": "q-12-2-generators-and-iterators-4-v2"
          },
          {
            "question": "Can you use generator expressions (x for x in stream) as stages in a pipeline?",
            "options": [
              {
                "id": "A",
                "text": "Yes, generator expressions produce generator objects that chain seamlessly with generator functions",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, generator expressions can only be used once at the end",
                "explanationIfWrong": "Generator expressions can be chained indefinitely."
              },
              {
                "id": "C",
                "text": "Only if wrapped in list()",
                "explanationIfWrong": "Wrapping in list() would destroy lazy streaming."
              },
              {
                "id": "D",
                "text": "Only for numeric data",
                "explanationIfWrong": "Any Python types can be streamed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Generator expressions are fully-fledged generator objects and can be piped into one another effortlessly.",
            "id": "q-12-2-generators-and-iterators-4-v3"
          }
        ]
      },
      {
        "heading": "Delegating Generators with 'yield from'",
        "text": "Introduced in Python 3.3 (PEP 380), the `yield from <iterable>` syntax allows a generator to delegate a portion of its operations to another generator or iterable. It replaces the boilerplate `for item in sub_generator: yield item` loop with a single expressive line. Beyond brevity, `yield from` transparently establishes a bi-directional communication channel between caller and sub-generator.",
        "codeSnippet": "def sub_sequence(start, end):\n    for i in range(start, end + 1):\n        yield i\n\ndef combined_sequence():\n    yield \"--- Start A ---\"\n    yield from sub_sequence(1, 3)   # Delegates directly to sub-generator\n    yield \"--- Start B ---\"\n    yield from [10, 20, 30]          # Delegates to any iterable (list, tuple)\n    yield \"--- Done ---\"\n\nfor val in combined_sequence():\n    print(val)",
        "terminalOutput": "--- Start A ---\n1\n2\n3\n--- Start B ---\n10\n20\n30\n--- Done ---",
        "tip": "`yield from` can delegate to any iterable, including lists, tuples, dictionaries, and custom generator functions.",
        "mcq": {
          "question": "What does yield from sub_gen do inside a generator function?",
          "options": [
            {
              "id": "A",
              "text": "Delegates yielding to sub_gen, yielding all its items directly to the caller without an explicit loop",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Imports the generator from another file",
              "explanationIfWrong": "'from' in yield from delegates iteration, not module imports."
            },
            {
              "id": "C",
              "text": "Yields a tuple containing all items of sub_gen simultaneously",
              "explanationIfWrong": "It yields items one-by-one lazily."
            },
            {
              "id": "D",
              "text": "Terminates the generator immediately",
              "explanationIfWrong": "It continues after sub_gen is exhausted."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "yield from iterates through the target iterable/sub-generator and yields each element directly to the outer consumer.",
          "id": "q-12-2-generators-and-iterators-5-v1"
        },
        "retestMcq": {
          "question": "Which of the following is equivalent to: for x in iterable: yield x?",
          "options": [
            {
              "id": "A",
              "text": "yield from iterable",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "yield iterable",
              "explanationIfWrong": "yield iterable yields the entire collection as a single object."
            },
            {
              "id": "C",
              "text": "return iterable",
              "explanationIfWrong": "return terminates generator iteration."
            },
            {
              "id": "D",
              "text": "from iterable yield",
              "explanationIfWrong": "Invalid Python syntax."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "'yield from iterable' is the standard concise idiom replacing 'for x in iterable: yield x'.",
          "id": "q-12-2-generators-and-iterators-5-v2"
        },
        "questionPool": [
          {
            "question": "What does yield from sub_gen do inside a generator function?",
            "options": [
              {
                "id": "A",
                "text": "Delegates yielding to sub_gen, yielding all its items directly to the caller without an explicit loop",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Imports the generator from another file",
                "explanationIfWrong": "'from' in yield from delegates iteration, not module imports."
              },
              {
                "id": "C",
                "text": "Yields a tuple containing all items of sub_gen simultaneously",
                "explanationIfWrong": "It yields items one-by-one lazily."
              },
              {
                "id": "D",
                "text": "Terminates the generator immediately",
                "explanationIfWrong": "It continues after sub_gen is exhausted."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "yield from iterates through the target iterable/sub-generator and yields each element directly to the outer consumer.",
            "id": "q-12-2-generators-and-iterators-5-v1"
          },
          {
            "question": "Which of the following is equivalent to: for x in iterable: yield x?",
            "options": [
              {
                "id": "A",
                "text": "yield from iterable",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "yield iterable",
                "explanationIfWrong": "yield iterable yields the entire collection as a single object."
              },
              {
                "id": "C",
                "text": "return iterable",
                "explanationIfWrong": "return terminates generator iteration."
              },
              {
                "id": "D",
                "text": "from iterable yield",
                "explanationIfWrong": "Invalid Python syntax."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "'yield from iterable' is the standard concise idiom replacing 'for x in iterable: yield x'.",
            "id": "q-12-2-generators-and-iterators-5-v2"
          },
          {
            "question": "Can yield from be used to flatten a list of lists recursively?",
            "options": [
              {
                "id": "A",
                "text": "Yes, by delegating yield from to inner lists and yielding scalar elements directly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, yield from only works on flat lists",
                "explanationIfWrong": "yield from works in recursive generator functions seamlessly."
              },
              {
                "id": "C",
                "text": "Only if all elements are integers",
                "explanationIfWrong": "It works on any Python types."
              },
              {
                "id": "D",
                "text": "Only in Python 2.7",
                "explanationIfWrong": "yield from was introduced in Python 3.3."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Recursive generator functions combining yield and yield from form an elegant pattern for flattening arbitrarily nested structures.",
            "id": "q-12-2-generators-and-iterators-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "12-3-functional-programming-lambda",
    "number": "12.3",
    "title": "Functional Programming (map, filter, lambda)",
    "subtitle": "Harness anonymous functions and functional data pipelines to process sequences declaratively.",
    "readTime": "22 min",
    "objectives": [
      "Create concise anonymous functions using the lambda keyword",
      "Apply transformations across iterables using the map() function",
      "Select matching sequence elements using the filter() function",
      "Perform cumulative sequence folding using functools.reduce()",
      "Compare functional constructs (map/filter) with Pythonic comprehensions",
      "Understand function decorator foundations using closures and wrapper functions"
    ],
    "theoryBlocks": [
      {
        "heading": "Anonymous Functions: The 'lambda' Keyword",
        "text": "A lambda function is a small, anonymous function defined inline without a name using the syntax: `lambda arguments: expression`. The body of a lambda must be a single expression; it cannot contain statements (such as `return`, `pass`, `assert`, or assignments). The evaluated result of the single expression is automatically returned. Lambdas are most commonly used for quick, disposable callback functions in `sorted()`, `map()`, or `filter()`.",
        "codeSnippet": "# Standard function\ndef add(x, y):\n    return x + y\n\n# Equivalent lambda function\nadd_lambda = lambda x, y: x + y\n\nprint(\"Standard add(3, 4):\", add(3, 4))\nprint(\"Lambda add(3, 4):  \", add_lambda(3, 4))\n\n# Using lambda directly as a sort key\npairs = [(1, 'one'), (3, 'three'), (2, 'two')]\npairs_sorted = sorted(pairs, key=lambda p: p[0])\nprint(\"Sorted by first element:\", pairs_sorted)",
        "terminalOutput": "Standard add(3, 4): 7\nLambda add(3, 4):   7\nSorted by first element: [(1, 'one'), (2, 'two'), (3, 'three')]",
        "tip": "PEP 8 recommendation: Do not bind lambdas to variable names (`f = lambda x: ...`); use `def` for named functions and reserve `lambda` for inline callbacks.",
        "mcq": {
          "question": "What is the general syntax for creating a lambda function in Python?",
          "options": [
            {
              "id": "A",
              "text": "lambda arguments: expression",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "def lambda(arguments) -> expression",
              "explanationIfWrong": "def cannot be combined with the lambda keyword."
            },
            {
              "id": "C",
              "text": "fn(arguments) => expression",
              "explanationIfWrong": "This is JavaScript/Rust arrow syntax, not Python."
            },
            {
              "id": "D",
              "text": "lambda: arguments -> expression",
              "explanationIfWrong": "Arguments precede the colon in Python lambdas."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, anonymous functions use the syntax: lambda arg1, arg2: expression.",
          "id": "q-12-3-functional-programming-lambda-0-v1"
        },
        "retestMcq": {
          "question": "Which of the following statements CANNOT be placed inside a Python lambda body?",
          "options": [
            {
              "id": "A",
              "text": "An explicit return statement (e.g. return x + 1)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A ternary operator (e.g. a if cond else b)",
              "explanationIfWrong": "Ternary operators are expressions and are permitted in lambdas."
            },
            {
              "id": "C",
              "text": "A function call (e.g. str(x))",
              "explanationIfWrong": "Function calls are valid expressions."
            },
            {
              "id": "D",
              "text": "An arithmetic operation (e.g. x * 2)",
              "explanationIfWrong": "Arithmetic operations are valid expressions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A lambda can only contain a single expression whose value is returned implicitly; explicit 'return' statements cause a SyntaxError.",
          "id": "q-12-3-functional-programming-lambda-0-v2"
        },
        "questionPool": [
          {
            "question": "What is the general syntax for creating a lambda function in Python?",
            "options": [
              {
                "id": "A",
                "text": "lambda arguments: expression",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "def lambda(arguments) -> expression",
                "explanationIfWrong": "def cannot be combined with the lambda keyword."
              },
              {
                "id": "C",
                "text": "fn(arguments) => expression",
                "explanationIfWrong": "This is JavaScript/Rust arrow syntax, not Python."
              },
              {
                "id": "D",
                "text": "lambda: arguments -> expression",
                "explanationIfWrong": "Arguments precede the colon in Python lambdas."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, anonymous functions use the syntax: lambda arg1, arg2: expression.",
            "id": "q-12-3-functional-programming-lambda-0-v1"
          },
          {
            "question": "Which of the following statements CANNOT be placed inside a Python lambda body?",
            "options": [
              {
                "id": "A",
                "text": "An explicit return statement (e.g. return x + 1)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A ternary operator (e.g. a if cond else b)",
                "explanationIfWrong": "Ternary operators are expressions and are permitted in lambdas."
              },
              {
                "id": "C",
                "text": "A function call (e.g. str(x))",
                "explanationIfWrong": "Function calls are valid expressions."
              },
              {
                "id": "D",
                "text": "An arithmetic operation (e.g. x * 2)",
                "explanationIfWrong": "Arithmetic operations are valid expressions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A lambda can only contain a single expression whose value is returned implicitly; explicit 'return' statements cause a SyntaxError.",
            "id": "q-12-3-functional-programming-lambda-0-v2"
          },
          {
            "question": "Given words = ['banana', 'pie', 'apple'], what does sorted(words, key=lambda w: w[-1]) sort by?",
            "options": [
              {
                "id": "A",
                "text": "The last character of each word",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The length of each word",
                "explanationIfWrong": "len(w) sorts by length; w[-1] accesses the last character."
              },
              {
                "id": "C",
                "text": "The first character in reverse order",
                "explanationIfWrong": "w[-1] is the last index."
              },
              {
                "id": "D",
                "text": "Vowel count",
                "explanationIfWrong": "It inspects the character at index -1."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "w[-1] extracts the last character ('a', 'e', 'e'), sorting words by their ending letters.",
            "id": "q-12-3-functional-programming-lambda-0-v3"
          }
        ]
      },
      {
        "heading": "The map() Function",
        "text": "The built-in `map(function, iterable, ...)` applies a function to every item in an iterable and returns an iterator yielding the results. In Python 3, `map()` evaluates lazily. If you need a concrete list, pass the map object to `list()`. You can also pass multiple iterables to `map()`; the function will receive one element from each iterable in parallel until the shortest iterable is exhausted.",
        "codeSnippet": "numbers = [1, 2, 3, 4, 5]\n\n# 1. Square numbers lazily with map and lambda\nsquares = map(lambda x: x ** 2, numbers)\nprint(\"Map object:\", squares)\nprint(\"Converted to list:\", list(squares))\n\n# 2. Map with multiple iterables (parallel addition)\na = [10, 20, 30]\nb = [1, 2, 3]\nsums = list(map(lambda x, y: x + y, a, b))\nprint(\"Parallel sums:\", sums)",
        "terminalOutput": "Map object: <map object at 0x...>\nConverted to list: [1, 4, 9, 16, 25]\nParallel sums: [11, 22, 33]",
        "tip": "`map(int, ['1', '2', '3'])` is a common idiom for converting string numbers to integers.",
        "mcq": {
          "question": "What type of object does map(func, iterable) return in Python 3?",
          "options": [
            {
              "id": "A",
              "text": "A lazy map iterator (<map object>)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A list",
              "explanationIfWrong": "In Python 2 it returned a list, but in Python 3 it returns a lazy iterator."
            },
            {
              "id": "C",
              "text": "A dictionary",
              "explanationIfWrong": "map yields sequential transformed elements, not key-value pairs."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "It returns a valid iterator object."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python 3, map() returns a lazy map iterator that yields items on demand.",
          "id": "q-12-3-functional-programming-lambda-1-v1"
        },
        "retestMcq": {
          "question": "What is the result of list(map(int, ['10', '20', '30']))?",
          "options": [
            {
              "id": "A",
              "text": "[10, 20, 30]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "['10', '20', '30']",
              "explanationIfWrong": "int() converted the strings to integers."
            },
            {
              "id": "C",
              "text": "60",
              "explanationIfWrong": "map converts elements; it does not sum them."
            },
            {
              "id": "D",
              "text": "TypeError",
              "explanationIfWrong": "int is a valid callable and converts strings successfully."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "map applies int() to each string token, yielding integers [10, 20, 30].",
          "id": "q-12-3-functional-programming-lambda-1-v2"
        },
        "questionPool": [
          {
            "question": "What type of object does map(func, iterable) return in Python 3?",
            "options": [
              {
                "id": "A",
                "text": "A lazy map iterator (<map object>)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A list",
                "explanationIfWrong": "In Python 2 it returned a list, but in Python 3 it returns a lazy iterator."
              },
              {
                "id": "C",
                "text": "A dictionary",
                "explanationIfWrong": "map yields sequential transformed elements, not key-value pairs."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "It returns a valid iterator object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python 3, map() returns a lazy map iterator that yields items on demand.",
            "id": "q-12-3-functional-programming-lambda-1-v1"
          },
          {
            "question": "What is the result of list(map(int, ['10', '20', '30']))?",
            "options": [
              {
                "id": "A",
                "text": "[10, 20, 30]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "['10', '20', '30']",
                "explanationIfWrong": "int() converted the strings to integers."
              },
              {
                "id": "C",
                "text": "60",
                "explanationIfWrong": "map converts elements; it does not sum them."
              },
              {
                "id": "D",
                "text": "TypeError",
                "explanationIfWrong": "int is a valid callable and converts strings successfully."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "map applies int() to each string token, yielding integers [10, 20, 30].",
            "id": "q-12-3-functional-programming-lambda-1-v2"
          },
          {
            "question": "What happens if map() is given two iterables of different lengths?",
            "options": [
              {
                "id": "A",
                "text": "It stops as soon as the shortest iterable is exhausted",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It pads missing values with None",
                "explanationIfWrong": "itertools.zip_longest pads; standard map stops at shortest."
              },
              {
                "id": "C",
                "text": "It raises a ValueError",
                "explanationIfWrong": "map handles unequal lengths gracefully by truncating."
              },
              {
                "id": "D",
                "text": "It loops back to the start of the shorter list",
                "explanationIfWrong": "It terminates once the shorter sequence ends."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "map() with multiple iterables halts evaluation as soon as the shortest input sequence is exhausted.",
            "id": "q-12-3-functional-programming-lambda-1-v3"
          }
        ]
      },
      {
        "heading": "The filter() Function",
        "text": "The built-in `filter(predicate_function, iterable)` selects elements from an iterable for which the `predicate_function` returns `True`. Like `map()`, it returns a lazy iterator. If you pass `None` as the predicate function (`filter(None, iterable)`), it acts as a boolean filter, keeping only truthy elements and discarding falsy ones (`0`, `''`, `None`, `[]`).",
        "codeSnippet": "data = [12, -7, 0, 15, -3, 8, None, \"\", \"hello\"]\n\n# 1. Filter positive numbers\npositives = list(filter(lambda x: isinstance(x, (int, float)) and x > 0, data))\n\n# 2. Filter truthy values by passing None as function\ntruthy_only = list(filter(None, data))\n\nprint(\"Positives:\", positives)\nprint(\"Truthy:   \", truthy_only)",
        "terminalOutput": "Positives: [12, 15, 8]\nTruthy:    [12, -7, 15, -3, 8, 'hello']",
        "tip": "`filter(None, items)` is a high-speed Pythonic trick to strip empty strings and falsy items from a collection.",
        "mcq": {
          "question": "What does filter(None, [0, 1, False, True, '', 'text']) evaluate to when cast to a list?",
          "options": [
            {
              "id": "A",
              "text": "[1, True, 'text']",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[0, 1, False, True, '', 'text']",
              "explanationIfWrong": "Falsy values are removed when function is None."
            },
            {
              "id": "C",
              "text": "[0, False, '']",
              "explanationIfWrong": "These are falsy; filter keeps truthy values."
            },
            {
              "id": "D",
              "text": "[]",
              "explanationIfWrong": "1, True, and 'text' are truthy and preserved."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "When function is None, filter() removes all falsy elements (0, False, '') and preserves truthy elements (1, True, 'text').",
          "id": "q-12-3-functional-programming-lambda-2-v1"
        },
        "retestMcq": {
          "question": "What must the function passed to filter() return?",
          "options": [
            {
              "id": "A",
              "text": "A truthy or falsy value indicating whether to keep the element",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The transformed new element",
              "explanationIfWrong": "map() transforms elements; filter() tests membership."
            },
            {
              "id": "C",
              "text": "The integer index of the element",
              "explanationIfWrong": "filter inspects values directly."
            },
            {
              "id": "D",
              "text": "A tuple of (key, value)",
              "explanationIfWrong": "A simple truth value is expected."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The predicate function must return a boolean (or truthy/falsy) result to determine if the item is kept.",
          "id": "q-12-3-functional-programming-lambda-2-v2"
        },
        "questionPool": [
          {
            "question": "What does filter(None, [0, 1, False, True, '', 'text']) evaluate to when cast to a list?",
            "options": [
              {
                "id": "A",
                "text": "[1, True, 'text']",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[0, 1, False, True, '', 'text']",
                "explanationIfWrong": "Falsy values are removed when function is None."
              },
              {
                "id": "C",
                "text": "[0, False, '']",
                "explanationIfWrong": "These are falsy; filter keeps truthy values."
              },
              {
                "id": "D",
                "text": "[]",
                "explanationIfWrong": "1, True, and 'text' are truthy and preserved."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When function is None, filter() removes all falsy elements (0, False, '') and preserves truthy elements (1, True, 'text').",
            "id": "q-12-3-functional-programming-lambda-2-v1"
          },
          {
            "question": "What must the function passed to filter() return?",
            "options": [
              {
                "id": "A",
                "text": "A truthy or falsy value indicating whether to keep the element",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The transformed new element",
                "explanationIfWrong": "map() transforms elements; filter() tests membership."
              },
              {
                "id": "C",
                "text": "The integer index of the element",
                "explanationIfWrong": "filter inspects values directly."
              },
              {
                "id": "D",
                "text": "A tuple of (key, value)",
                "explanationIfWrong": "A simple truth value is expected."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The predicate function must return a boolean (or truthy/falsy) result to determine if the item is kept.",
            "id": "q-12-3-functional-programming-lambda-2-v2"
          },
          {
            "question": "What does list(filter(lambda n: n % 2 == 0, [1, 2, 3, 4, 5])) return?",
            "options": [
              {
                "id": "A",
                "text": "[2, 4]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[1, 3, 5]",
                "explanationIfWrong": "n % 2 == 0 tests for even numbers."
              },
              {
                "id": "C",
                "text": "[True, False, True, False, True]",
                "explanationIfWrong": "filter returns the matched elements, not booleans."
              },
              {
                "id": "D",
                "text": "[0, 0]",
                "explanationIfWrong": "filter returns the original matching items (2 and 4)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "2 and 4 are even (n % 2 == 0 is True) and are retained in the output list.",
            "id": "q-12-3-functional-programming-lambda-2-v3"
          }
        ]
      },
      {
        "heading": "The functools.reduce() Function",
        "text": "While `map()` transforms and `filter()` selects, `functools.reduce(function, iterable[, initializer])` aggregates. It applies a two-argument function cumulatively to the items of a sequence, from left to right, reducing the entire sequence to a single accumulated value. For example, `reduce(lambda a, b: a * b, [1, 2, 3, 4])` calculates `(((1 * 2) * 3) * 4) = 24`.",
        "codeSnippet": "from functools import reduce\n\nnumbers = [1, 2, 3, 4, 5]\n\n# 1. Cumulative product (factorial)\nproduct = reduce(lambda acc, x: acc * x, numbers)\nprint(\"Product:\", product)\n\n# 2. Finding maximum with reduce\nfind_max = reduce(lambda a, b: a if a > b else b, [45, 12, 89, 34, 67])\nprint(\"Max value:\", find_max)\n\n# 3. Reduce with initializer\nsum_plus_100 = reduce(lambda acc, x: acc + x, numbers, 100)\nprint(\"Sum + 100:\", sum_plus_100)",
        "terminalOutput": "Product: 120\nMax value: 89\nSum + 100: 115",
        "tip": "In modern Python, built-in functions like `sum()`, `max()`, and `min()` are preferred over `reduce()` for common aggregations.",
        "mcq": {
          "question": "Where is the reduce() function located in Python 3?",
          "options": [
            {
              "id": "A",
              "text": "In the functools module (must be imported via: from functools import reduce)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It is a built-in top-level function",
              "explanationIfWrong": "It was a built-in in Python 2, but moved to functools in Python 3."
            },
            {
              "id": "C",
              "text": "In the itertools module",
              "explanationIfWrong": "reduce is in functools, not itertools."
            },
            {
              "id": "D",
              "text": "In the sys module",
              "explanationIfWrong": "sys provides runtime system parameters."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Guido van Rossum moved reduce() into functools in Python 3 to encourage more readable alternatives like sum() or explicit loops.",
          "id": "q-12-3-functional-programming-lambda-3-v1"
        },
        "retestMcq": {
          "question": "What is the return value of reduce(lambda x, y: x + y, [1, 2, 3, 4], 0)?",
          "options": [
            {
              "id": "A",
              "text": "10",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[1, 2, 3, 4]",
              "explanationIfWrong": "reduce collapses the sequence to a single scalar value."
            },
            {
              "id": "C",
              "text": "24",
              "explanationIfWrong": "The function performs addition (+), not multiplication."
            },
            {
              "id": "D",
              "text": "0",
              "explanationIfWrong": "0 is the initializer; 0 + 1 + 2 + 3 + 4 = 10."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Starting with 0, reduce accumulates 0+1=1, 1+2=3, 3+3=6, 6+4=10.",
          "id": "q-12-3-functional-programming-lambda-3-v2"
        },
        "questionPool": [
          {
            "question": "Where is the reduce() function located in Python 3?",
            "options": [
              {
                "id": "A",
                "text": "In the functools module (must be imported via: from functools import reduce)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It is a built-in top-level function",
                "explanationIfWrong": "It was a built-in in Python 2, but moved to functools in Python 3."
              },
              {
                "id": "C",
                "text": "In the itertools module",
                "explanationIfWrong": "reduce is in functools, not itertools."
              },
              {
                "id": "D",
                "text": "In the sys module",
                "explanationIfWrong": "sys provides runtime system parameters."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Guido van Rossum moved reduce() into functools in Python 3 to encourage more readable alternatives like sum() or explicit loops.",
            "id": "q-12-3-functional-programming-lambda-3-v1"
          },
          {
            "question": "What is the return value of reduce(lambda x, y: x + y, [1, 2, 3, 4], 0)?",
            "options": [
              {
                "id": "A",
                "text": "10",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[1, 2, 3, 4]",
                "explanationIfWrong": "reduce collapses the sequence to a single scalar value."
              },
              {
                "id": "C",
                "text": "24",
                "explanationIfWrong": "The function performs addition (+), not multiplication."
              },
              {
                "id": "D",
                "text": "0",
                "explanationIfWrong": "0 is the initializer; 0 + 1 + 2 + 3 + 4 = 10."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Starting with 0, reduce accumulates 0+1=1, 1+2=3, 3+3=6, 6+4=10.",
            "id": "q-12-3-functional-programming-lambda-3-v2"
          },
          {
            "question": "How many arguments must the function passed to functools.reduce() accept?",
            "options": [
              {
                "id": "A",
                "text": "Exactly 2 arguments (the accumulator and the current element)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "1 argument",
                "explanationIfWrong": "1-argument functions cannot combine two values."
              },
              {
                "id": "C",
                "text": "3 arguments",
                "explanationIfWrong": "reduce functions only take (accumulator, current_item)."
              },
              {
                "id": "D",
                "text": "Any number of arguments",
                "explanationIfWrong": "The accumulator and element require exactly 2 arguments."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The binary folding function takes two arguments: the running accumulator and the next item in the iterable.",
            "id": "q-12-3-functional-programming-lambda-3-v3"
          }
        ]
      },
      {
        "heading": "Python Philosophy: Comprehensions vs map/filter",
        "text": "In Python, list comprehensions and generator expressions are almost universally preferred over `map()` and `filter()` with `lambda`. Comprehensions are easier to read, eliminate the visual noise of lambda arguments, avoid lambda function call overhead, and naturally combine mapping and filtering into a single unified construct: `[func(x) for x in data if cond(x)]` instead of `map(func, filter(cond, data))`.",
        "codeSnippet": "numbers = [1, 2, 3, 4, 5, 6]\n\n# Functional approach with map, filter, and lambda\nfunc_style = list(map(lambda x: x ** 2, filter(lambda x: x % 2 == 0, numbers)))\n\n# Pythonic comprehension approach (Much cleaner and idiomatic)\ncomp_style = [x ** 2 for x in numbers if x % 2 == 0]\n\nprint(\"Functional style:\", func_style)\nprint(\"Pythonic comp:   \", comp_style)",
        "terminalOutput": "Functional style: [4, 16, 36]\nPythonic comp:    [4, 16, 36]",
        "tip": "Use `map()` only when you already have an existing named function like `map(int, strings)`. When a `lambda` is needed, use a comprehension.",
        "mcq": {
          "question": "Why does the Python community generally prefer list comprehensions over map() + filter() + lambda?",
          "options": [
            {
              "id": "A",
              "text": "Comprehensions are more readable, avoid nested syntax, and combine mapping and filtering cleanly in one expression",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "map() and filter() have been deprecated in Python 3.12",
              "explanationIfWrong": "map and filter remain permanent built-ins."
            },
            {
              "id": "C",
              "text": "Comprehensions can only run on integers",
              "explanationIfWrong": "Comprehensions work on all types."
            },
            {
              "id": "D",
              "text": "map() does not work with lists",
              "explanationIfWrong": "map works with any iterable."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Comprehensions read naturally and avoid cumbersome lambda definitions and nested functional calls.",
          "id": "q-12-3-functional-programming-lambda-4-v1"
        },
        "retestMcq": {
          "question": "Which of the following is equivalent to: list(map(lambda x: x * 10, data))?",
          "options": [
            {
              "id": "A",
              "text": "[x * 10 for x in data]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "[x for x in data if x * 10]",
              "explanationIfWrong": "This filters, rather than transforms."
            },
            {
              "id": "C",
              "text": "{x * 10 for x in data}",
              "explanationIfWrong": "Curly braces create a set, not a list."
            },
            {
              "id": "D",
              "text": "(x * 10 for x in data)",
              "explanationIfWrong": "Parentheses create a generator, not a list."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "[x * 10 for x in data] transforms every item by multiplying by 10 into a new list.",
          "id": "q-12-3-functional-programming-lambda-4-v2"
        },
        "questionPool": [
          {
            "question": "Why does the Python community generally prefer list comprehensions over map() + filter() + lambda?",
            "options": [
              {
                "id": "A",
                "text": "Comprehensions are more readable, avoid nested syntax, and combine mapping and filtering cleanly in one expression",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "map() and filter() have been deprecated in Python 3.12",
                "explanationIfWrong": "map and filter remain permanent built-ins."
              },
              {
                "id": "C",
                "text": "Comprehensions can only run on integers",
                "explanationIfWrong": "Comprehensions work on all types."
              },
              {
                "id": "D",
                "text": "map() does not work with lists",
                "explanationIfWrong": "map works with any iterable."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Comprehensions read naturally and avoid cumbersome lambda definitions and nested functional calls.",
            "id": "q-12-3-functional-programming-lambda-4-v1"
          },
          {
            "question": "Which of the following is equivalent to: list(map(lambda x: x * 10, data))?",
            "options": [
              {
                "id": "A",
                "text": "[x * 10 for x in data]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "[x for x in data if x * 10]",
                "explanationIfWrong": "This filters, rather than transforms."
              },
              {
                "id": "C",
                "text": "{x * 10 for x in data}",
                "explanationIfWrong": "Curly braces create a set, not a list."
              },
              {
                "id": "D",
                "text": "(x * 10 for x in data)",
                "explanationIfWrong": "Parentheses create a generator, not a list."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "[x * 10 for x in data] transforms every item by multiplying by 10 into a new list.",
            "id": "q-12-3-functional-programming-lambda-4-v2"
          },
          {
            "question": "When is using map() considered equally clean or better than a list comprehension in Python?",
            "options": [
              {
                "id": "A",
                "text": "When applying an existing built-in or named function without requiring a lambda (e.g. map(str, numbers))",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "When writing complex multi-statement lambdas",
                "explanationIfWrong": "Lambdas cannot have multiple statements."
              },
              {
                "id": "C",
                "text": "When filtering even numbers",
                "explanationIfWrong": "Comprehensions are cleaner for filtering."
              },
              {
                "id": "D",
                "text": "Only when working with dictionaries",
                "explanationIfWrong": "map applies to sequence iterables."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing an existing named function like map(int, tokens) or map(str.strip, lines) is concise and avoids redundant dummy variables.",
            "id": "q-12-3-functional-programming-lambda-4-v3"
          }
        ]
      },
      {
        "heading": "Basic Decorator Foundations",
        "text": "Decorators are a direct application of first-class functions and closures. A decorator is a function that takes another function as input, extends or modifies its behavior using an inner wrapper function, and returns the wrapper. The `@decorator` syntax is syntactic sugar for `my_func = decorator(my_func)`. Use `@functools.wraps(func)` on the inner wrapper to preserve the original function's name and docstring.",
        "codeSnippet": "from functools import wraps\n\ndef announce(func):\n    @wraps(func)  # Preserves func.__name__\n    def wrapper(*args, **kwargs):\n        print(f\"-> Calling {func.__name__}...\")\n        result = func(*args, **kwargs)\n        print(f\"<- Finished {func.__name__}!\")\n        return result\n    return wrapper\n\n@announce\ndef calculate_total(price, tax_rate):\n    return price * (1 + tax_rate)\n\nprint(\"Final Total:\", calculate_total(100, 0.2))",
        "terminalOutput": "-> Calling calculate_total...\n<- Finished calculate_total!\nFinal Total: 120.0",
        "tip": "Decorators allow cross-cutting concerns (logging, authentication, timing, caching) to be added without modifying the target function's code.",
        "mcq": {
          "question": "What is @my_decorator above a def greet(): function equivalent to in standard Python?",
          "options": [
            {
              "id": "A",
              "text": "greet = my_decorator(greet)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "my_decorator = greet()",
              "explanationIfWrong": "The decorator receives the function object and replaces its binding."
            },
            {
              "id": "C",
              "text": "greet.my_decorator()",
              "explanationIfWrong": "Decorators wrap functions from the outside."
            },
            {
              "id": "D",
              "text": "import my_decorator",
              "explanationIfWrong": "Decorators are function wrappers, not module imports."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The '@' decorator syntax is syntactic sugar for passing the decorated function to the decorator and re-binding the name: func = dec(func).",
          "id": "q-12-3-functional-programming-lambda-5-v1"
        },
        "retestMcq": {
          "question": "Why is @functools.wraps(func) applied to the inner wrapper function of a decorator?",
          "options": [
            {
              "id": "A",
              "text": "To copy metadata (such as __name__ and __doc__) from the original function onto the wrapper",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To make the decorator run asynchronously",
              "explanationIfWrong": "wraps does not alter concurrency."
            },
            {
              "id": "C",
              "text": "To prevent other decorators from running",
              "explanationIfWrong": "Multiple decorators can be stacked safely."
            },
            {
              "id": "D",
              "text": "To convert return values to strings",
              "explanationIfWrong": "wraps preserves signatures and metadata only."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "@functools.wraps preserves introspection metadata so tools and debuggers see the original function name and docstring.",
          "id": "q-12-3-functional-programming-lambda-5-v2"
        },
        "questionPool": [
          {
            "question": "What is @my_decorator above a def greet(): function equivalent to in standard Python?",
            "options": [
              {
                "id": "A",
                "text": "greet = my_decorator(greet)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "my_decorator = greet()",
                "explanationIfWrong": "The decorator receives the function object and replaces its binding."
              },
              {
                "id": "C",
                "text": "greet.my_decorator()",
                "explanationIfWrong": "Decorators wrap functions from the outside."
              },
              {
                "id": "D",
                "text": "import my_decorator",
                "explanationIfWrong": "Decorators are function wrappers, not module imports."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The '@' decorator syntax is syntactic sugar for passing the decorated function to the decorator and re-binding the name: func = dec(func).",
            "id": "q-12-3-functional-programming-lambda-5-v1"
          },
          {
            "question": "Why is @functools.wraps(func) applied to the inner wrapper function of a decorator?",
            "options": [
              {
                "id": "A",
                "text": "To copy metadata (such as __name__ and __doc__) from the original function onto the wrapper",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To make the decorator run asynchronously",
                "explanationIfWrong": "wraps does not alter concurrency."
              },
              {
                "id": "C",
                "text": "To prevent other decorators from running",
                "explanationIfWrong": "Multiple decorators can be stacked safely."
              },
              {
                "id": "D",
                "text": "To convert return values to strings",
                "explanationIfWrong": "wraps preserves signatures and metadata only."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "@functools.wraps preserves introspection metadata so tools and debuggers see the original function name and docstring.",
            "id": "q-12-3-functional-programming-lambda-5-v2"
          },
          {
            "question": "How do you ensure a decorator wrapper function can accept any arbitrary arguments?",
            "options": [
              {
                "id": "A",
                "text": "Define wrapper(*args, **kwargs) and pass them as func(*args, **kwargs)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Define wrapper(args: list, kwargs: dict)",
                "explanationIfWrong": "Positional and keyword arguments require * and ** unpacking syntax."
              },
              {
                "id": "C",
                "text": "Leave parameter list empty: def wrapper():",
                "explanationIfWrong": "An empty parameter list fails if arguments are passed."
              },
              {
                "id": "D",
                "text": "Use eval(args)",
                "explanationIfWrong": "eval is unnecessary and insecure."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Using *args and **kwargs accepts any number of positional and keyword arguments, forwarding them transparently.",
            "id": "q-12-3-functional-programming-lambda-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "12-4-regular-expressions",
    "number": "12.4",
    "title": "Regular Expressions & Pattern Matching",
    "subtitle": "Search, validate, parse, and substitute complex text patterns using Python's standard re engine.",
    "readTime": "24 min",
    "objectives": [
      "Understand regular expression fundamentals and raw string r'...' notation",
      "Master character classes, quantifiers (*, +, ?), and anchor metacharacters (^, $)",
      "Distinguish between re.search(), re.match(), and re.findall()",
      "Extract structured data from text using capture groups and named groups",
      "Clean, sanitize, and replace text patterns using re.sub()",
      "Optimize regex performance in loops with pre-compiled patterns via re.compile()"
    ],
    "theoryBlocks": [
      {
        "heading": "Introduction to Regex & Raw Strings",
        "text": "A Regular Expression (regex) is a specialized string of characters defining a search pattern. Python provides regex support via the built-in `re` module. In regex, backslashes `\\` are used for escape sequences (e.g., `\\d` for digit). In standard Python strings, backslashes are also escape characters (`\\n`, `\\t`). To prevent Python from interpreting backslashes before passing the pattern to the regex engine, ALWAYS write regex patterns as raw string literals prefixed with `r`, such as `r'\\d+'`.",
        "codeSnippet": "import re\n\n# Without raw string: '\\\\d' needed to escape backslash\n# With raw string: r'\\d+' is clean and unambiguous\ntext = \"Order #4092 completed on 2026-10-10.\"\n\nmatch = re.search(r\"\\d+\", text)\nif match:\n    print(\"First number found:\", match.group())\n    print(\"Span position:     \", match.span())",
        "terminalOutput": "First number found: 4092\nSpan position:      (7, 11)",
        "tip": "Always use raw strings `r'...'` for regular expression patterns to avoid backslash escaping issues.",
        "mcq": {
          "question": "Why should regular expression patterns in Python always be written as raw strings (e.g. r'\\d+')?",
          "options": [
            {
              "id": "A",
              "text": "Raw strings prevent Python from interpreting backslashes as string escape sequences before the regex engine receives them",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Raw strings compile directly to machine code",
              "explanationIfWrong": "Raw strings only change escape handling during string parsing."
            },
            {
              "id": "C",
              "text": "The re module raises a ValueError if strings are not raw",
              "explanationIfWrong": "Non-raw strings work, but require awkward double-escaping \\\\\\\\."
            },
            {
              "id": "D",
              "text": "Raw strings make text uppercase",
              "explanationIfWrong": "Raw strings preserve exact character bytes."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The 'r' prefix instructs Python not to interpret backslashes, ensuring the regex engine receives literal '\\d', '\\w', etc.",
          "id": "q-12-4-regular-expressions-0-v1"
        },
        "retestMcq": {
          "question": "What module in Python's standard library provides regular expression functionality?",
          "options": [
            {
              "id": "A",
              "text": "re",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "regex_lib",
              "explanationIfWrong": "The built-in module is simply named 're'."
            },
            {
              "id": "C",
              "text": "pattern",
              "explanationIfWrong": "'pattern' is not in Python's standard library."
            },
            {
              "id": "D",
              "text": "text_search",
              "explanationIfWrong": "The standard module is 're'."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's standard library regular expression module is imported with: import re.",
          "id": "q-12-4-regular-expressions-0-v2"
        },
        "questionPool": [
          {
            "question": "Why should regular expression patterns in Python always be written as raw strings (e.g. r'\\d+')?",
            "options": [
              {
                "id": "A",
                "text": "Raw strings prevent Python from interpreting backslashes as string escape sequences before the regex engine receives them",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Raw strings compile directly to machine code",
                "explanationIfWrong": "Raw strings only change escape handling during string parsing."
              },
              {
                "id": "C",
                "text": "The re module raises a ValueError if strings are not raw",
                "explanationIfWrong": "Non-raw strings work, but require awkward double-escaping \\\\\\\\."
              },
              {
                "id": "D",
                "text": "Raw strings make text uppercase",
                "explanationIfWrong": "Raw strings preserve exact character bytes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The 'r' prefix instructs Python not to interpret backslashes, ensuring the regex engine receives literal '\\d', '\\w', etc.",
            "id": "q-12-4-regular-expressions-0-v1"
          },
          {
            "question": "What module in Python's standard library provides regular expression functionality?",
            "options": [
              {
                "id": "A",
                "text": "re",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "regex_lib",
                "explanationIfWrong": "The built-in module is simply named 're'."
              },
              {
                "id": "C",
                "text": "pattern",
                "explanationIfWrong": "'pattern' is not in Python's standard library."
              },
              {
                "id": "D",
                "text": "text_search",
                "explanationIfWrong": "The standard module is 're'."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's standard library regular expression module is imported with: import re.",
            "id": "q-12-4-regular-expressions-0-v2"
          },
          {
            "question": "What does match.group() return on a successful regex Match object?",
            "options": [
              {
                "id": "A",
                "text": "The entire matched substring of text",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A list of line numbers",
                "explanationIfWrong": "group() returns the matched text string."
              },
              {
                "id": "C",
                "text": "True",
                "explanationIfWrong": "It returns the string itself, not a boolean."
              },
              {
                "id": "D",
                "text": "The index positions only",
                "explanationIfWrong": "match.span() returns index positions; match.group() returns text."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "match.group() (or match.group(0)) returns the complete substring that matched the pattern.",
            "id": "q-12-4-regular-expressions-0-v3"
          }
        ]
      },
      {
        "heading": "Metacharacters & Character Classes",
        "text": "Regex patterns utilize metacharacters and shorthand character classes to specify matching rules: `\\d` matches any digit [0-9]; `\\w` matches any alphanumeric word character [a-zA-Z0-9_]; `\\s` matches whitespace; `.` matches any character except newline. Anchors specify boundary positions: `^` asserts start of string; `$` asserts end of string. Quantifiers specify repetition: `*` (0 or more), `+` (1 or more), `?` (0 or 1 optional), `{n,m}` (between n and m times).",
        "codeSnippet": "import re\n\n# Match a 4-digit year at the end of string: r'\\d{4}$'\nprint(\"2026 ends in year?:\", bool(re.search(r\"\\d{4}$\", \"The year is 2026\")))\nprint(\"2026 inside text?: \", bool(re.search(r\"\\d{4}$\", \"2026 is current year\")))\n\n# Character class: any vowel followed by 't'\ntext = \"cat bat hit cot put\"\nprint(\"Vowel + t matches:\", re.findall(r\"[aeiou]t\", text))",
        "terminalOutput": "2026 ends in year?: True\n2026 inside text?:  False\nVowel + t matches: ['at', 'at', 'it', 'ot', 'ut']",
        "tip": "A caret inside square brackets `[^0-9]` negates the class: matches any character that is NOT a digit.",
        "mcq": {
          "question": "What shorthand character class matches any decimal digit [0-9]?",
          "options": [
            {
              "id": "A",
              "text": "\\d",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "\\w",
              "explanationIfWrong": "\\w matches word characters (letters, digits, underscores)."
            },
            {
              "id": "C",
              "text": "\\s",
              "explanationIfWrong": "\\s matches whitespace characters (spaces, tabs, newlines)."
            },
            {
              "id": "D",
              "text": "\\b",
              "explanationIfWrong": "\\b matches word boundaries."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "\\d is the standard shorthand for any decimal digit character.",
          "id": "q-12-4-regular-expressions-1-v1"
        },
        "retestMcq": {
          "question": "What is the difference between quantifiers * and + in regular expressions?",
          "options": [
            {
              "id": "A",
              "text": "* matches 0 or more occurrences; + matches 1 or more occurrences",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "* matches digits; + matches letters",
              "explanationIfWrong": "Quantifiers control repetition count, not character types."
            },
            {
              "id": "C",
              "text": "+ is optional (0 or 1); * is infinite",
              "explanationIfWrong": "? is 0 or 1; + is 1 or more."
            },
            {
              "id": "D",
              "text": "They are completely identical",
              "explanationIfWrong": "+ requires at least one occurrence to match; * does not."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "'*' represents zero or more repetitions, while '+' requires at least one occurrence.",
          "id": "q-12-4-regular-expressions-1-v2"
        },
        "questionPool": [
          {
            "question": "What shorthand character class matches any decimal digit [0-9]?",
            "options": [
              {
                "id": "A",
                "text": "\\d",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "\\w",
                "explanationIfWrong": "\\w matches word characters (letters, digits, underscores)."
              },
              {
                "id": "C",
                "text": "\\s",
                "explanationIfWrong": "\\s matches whitespace characters (spaces, tabs, newlines)."
              },
              {
                "id": "D",
                "text": "\\b",
                "explanationIfWrong": "\\b matches word boundaries."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "\\d is the standard shorthand for any decimal digit character.",
            "id": "q-12-4-regular-expressions-1-v1"
          },
          {
            "question": "What is the difference between quantifiers * and + in regular expressions?",
            "options": [
              {
                "id": "A",
                "text": "* matches 0 or more occurrences; + matches 1 or more occurrences",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "* matches digits; + matches letters",
                "explanationIfWrong": "Quantifiers control repetition count, not character types."
              },
              {
                "id": "C",
                "text": "+ is optional (0 or 1); * is infinite",
                "explanationIfWrong": "? is 0 or 1; + is 1 or more."
              },
              {
                "id": "D",
                "text": "They are completely identical",
                "explanationIfWrong": "+ requires at least one occurrence to match; * does not."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "'*' represents zero or more repetitions, while '+' requires at least one occurrence.",
            "id": "q-12-4-regular-expressions-1-v2"
          },
          {
            "question": "What do the anchor characters ^ and $ represent in regex?",
            "options": [
              {
                "id": "A",
                "text": "^ asserts the start of the string; $ asserts the end of the string",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "^ represents uppercase letters; $ represents currency symbols",
                "explanationIfWrong": "They are position anchors."
              },
              {
                "id": "C",
                "text": "^ matches numbers; $ matches words",
                "explanationIfWrong": "Anchors match positions, not characters."
              },
              {
                "id": "D",
                "text": "^ asserts whitespace; $ asserts punctuation",
                "explanationIfWrong": "\\s matches whitespace."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "^ and $ anchor patterns to the beginning and end of the string respectively.",
            "id": "q-12-4-regular-expressions-1-v3"
          }
        ]
      },
      {
        "heading": "re.search() vs re.match() vs re.findall()",
        "text": "The `re` module offers several primary matching functions with distinct search scopes: 1) `re.search(pattern, text)` scans through the string looking for the FIRST location where the pattern matches anywhere; 2) `re.match(pattern, text)` matches ONLY IF the pattern matches from the very BEGINNING of the string; 3) `re.findall(pattern, text)` returns a list of ALL non-overlapping matches throughout the entire string.",
        "codeSnippet": "import re\n\nsentence = \"Contact: user@dopilot.com or support@dopilot.com\"\n\n# 1. re.match only looks at start of string\nprint(\"re.match from start:  \", re.match(r\"\\w+@\\w+\\.\\w+\", sentence))\n\n# 2. re.search looks anywhere in string (returns first match)\nfirst_email = re.search(r\"\\w+@\\w+\\.\\w+\", sentence)\nprint(\"re.search anywhere:   \", first_email.group() if first_email else None)\n\n# 3. re.findall extracts ALL occurrences\nall_emails = re.findall(r\"\\w+@\\w+\\.\\w+\", sentence)\nprint(\"re.findall all matches:\", all_emails)",
        "terminalOutput": "re.match from start:   None\nre.search anywhere:    user@dopilot.com\nre.findall all matches: ['user@dopilot.com', 'support@dopilot.com']",
        "tip": "Use `re.search()` to find a single match anywhere in text. Use `re.findall()` to extract all matches.",
        "mcq": {
          "question": "Why does re.match(r'\\d+', 'Price: 50 USD') return None?",
          "options": [
            {
              "id": "A",
              "text": "re.match() only searches from the very beginning (index 0) of the string, and 'Price' does not match digits",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "50 is not a valid digit",
              "explanationIfWrong": "50 contains valid digits."
            },
            {
              "id": "C",
              "text": "The pattern syntax is invalid",
              "explanationIfWrong": "r'\\d+' is valid syntax."
            },
            {
              "id": "D",
              "text": "re.match() requires an exact match for the entire string",
              "explanationIfWrong": "re.fullmatch requires full string; re.match requires matching from start."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "re.match() anchors strictly to the beginning of the string. To search anywhere in the string, use re.search().",
          "id": "q-12-4-regular-expressions-2-v1"
        },
        "retestMcq": {
          "question": "What does re.findall(r'\\d+', 'Room 101, Floor 2, Building 8') return?",
          "options": [
            {
              "id": "A",
              "text": "['101', '2', '8']",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "'101'",
              "explanationIfWrong": "re.search returns the first match; re.findall returns all matches as a list."
            },
            {
              "id": "C",
              "text": "[101, 2, 8]",
              "explanationIfWrong": "Matches are returned as string tokens, not parsed integers."
            },
            {
              "id": "D",
              "text": "3",
              "explanationIfWrong": "It returns a list of matched strings, not a count."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "re.findall() returns a list containing all substrings matching the pattern throughout the text: ['101', '2', '8'].",
          "id": "q-12-4-regular-expressions-2-v2"
        },
        "questionPool": [
          {
            "question": "Why does re.match(r'\\d+', 'Price: 50 USD') return None?",
            "options": [
              {
                "id": "A",
                "text": "re.match() only searches from the very beginning (index 0) of the string, and 'Price' does not match digits",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "50 is not a valid digit",
                "explanationIfWrong": "50 contains valid digits."
              },
              {
                "id": "C",
                "text": "The pattern syntax is invalid",
                "explanationIfWrong": "r'\\d+' is valid syntax."
              },
              {
                "id": "D",
                "text": "re.match() requires an exact match for the entire string",
                "explanationIfWrong": "re.fullmatch requires full string; re.match requires matching from start."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "re.match() anchors strictly to the beginning of the string. To search anywhere in the string, use re.search().",
            "id": "q-12-4-regular-expressions-2-v1"
          },
          {
            "question": "What does re.findall(r'\\d+', 'Room 101, Floor 2, Building 8') return?",
            "options": [
              {
                "id": "A",
                "text": "['101', '2', '8']",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'101'",
                "explanationIfWrong": "re.search returns the first match; re.findall returns all matches as a list."
              },
              {
                "id": "C",
                "text": "[101, 2, 8]",
                "explanationIfWrong": "Matches are returned as string tokens, not parsed integers."
              },
              {
                "id": "D",
                "text": "3",
                "explanationIfWrong": "It returns a list of matched strings, not a count."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "re.findall() returns a list containing all substrings matching the pattern throughout the text: ['101', '2', '8'].",
            "id": "q-12-4-regular-expressions-2-v2"
          },
          {
            "question": "Which function should you use to verify that a string consists ENTIRELY of digits from start to finish?",
            "options": [
              {
                "id": "A",
                "text": "re.fullmatch(r'\\d+', text)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "re.search(r'\\d+', text)",
                "explanationIfWrong": "re.search succeeds even if other characters exist before or after."
              },
              {
                "id": "C",
                "text": "re.split(r'\\d+', text)",
                "explanationIfWrong": "re.split divides strings by delimiters."
              },
              {
                "id": "D",
                "text": "re.sub(r'\\d+', text)",
                "explanationIfWrong": "re.sub performs replacement."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "re.fullmatch() requires the entire string to match the pattern from start to finish.",
            "id": "q-12-4-regular-expressions-2-v3"
          }
        ]
      },
      {
        "heading": "Capture Groups & Substring Extraction",
        "text": "Parentheses `(...)` in a regex define 'capture groups'. Groups allow you to extract specific subcomponents from a match. For example, in a date pattern `r'(\\d{4})-(\\d{2})-(\\d{2})'`, group(1) extracts the year, group(2) the month, and group(3) the day. You can also name groups using `(?P<name>...)` and retrieve them with `match.group('name')` or as a dictionary with `match.groupdict()`.",
        "codeSnippet": "import re\n\nlog_entry = \"2026-10-10 [ERROR] Database connection failed\"\npattern = r\"(?P<date>\\d{4}-\\d{2}-\\d{2}) \\[(?P<level>\\w+)\\] (?P<msg>.*)\"\n\nmatch = re.search(pattern, log_entry)\nif match:\n    print(\"Date: \", match.group(\"date\"))\n    print(\"Level:\", match.group(\"level\"))\n    print(\"Msg:  \", match.group(\"msg\"))\n    print(\"Dictionary:\", match.groupdict())",
        "terminalOutput": "Date:  2026-10-10\nLevel: ERROR\nMsg:   Database connection failed\nDictionary: {'date': '2026-10-10', 'level': 'ERROR', 'msg': 'Database connection failed'}",
        "tip": "Capture groups enable clean, robust parsing of complex structured log formats without manual substring slicing.",
        "mcq": {
          "question": "In the pattern r'(\\w+): (\\d+)', what does match.group(2) retrieve?",
          "options": [
            {
              "id": "A",
              "text": "The substring matched by the second capture group (\\d+)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The entire match",
              "explanationIfWrong": "match.group(0) returns the entire match."
            },
            {
              "id": "C",
              "text": "The first capture group",
              "explanationIfWrong": "match.group(1) returns the first capture group."
            },
            {
              "id": "D",
              "text": "The second character of the match",
              "explanationIfWrong": "group(2) indexes by group, not character index."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Capture groups are 1-indexed. group(1) corresponds to (\\w+) and group(2) corresponds to (\\d+).",
          "id": "q-12-4-regular-expressions-3-v1"
        },
        "retestMcq": {
          "question": "How do you define a named capture group called 'user' in a regular expression?",
          "options": [
            {
              "id": "A",
              "text": "(?P<user>\\w+)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "(name=user:\\w+)",
              "explanationIfWrong": "Invalid Python regex syntax."
            },
            {
              "id": "C",
              "text": "<user>(\\w+)",
              "explanationIfWrong": "Angle brackets outside parentheses are literal characters."
            },
            {
              "id": "D",
              "text": "(user: \\w+)",
              "explanationIfWrong": "This matches literal string 'user: ' followed by word characters."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's syntax for named capture groups is (?P<name>pattern).",
          "id": "q-12-4-regular-expressions-3-v2"
        },
        "questionPool": [
          {
            "question": "In the pattern r'(\\w+): (\\d+)', what does match.group(2) retrieve?",
            "options": [
              {
                "id": "A",
                "text": "The substring matched by the second capture group (\\d+)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The entire match",
                "explanationIfWrong": "match.group(0) returns the entire match."
              },
              {
                "id": "C",
                "text": "The first capture group",
                "explanationIfWrong": "match.group(1) returns the first capture group."
              },
              {
                "id": "D",
                "text": "The second character of the match",
                "explanationIfWrong": "group(2) indexes by group, not character index."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Capture groups are 1-indexed. group(1) corresponds to (\\w+) and group(2) corresponds to (\\d+).",
            "id": "q-12-4-regular-expressions-3-v1"
          },
          {
            "question": "How do you define a named capture group called 'user' in a regular expression?",
            "options": [
              {
                "id": "A",
                "text": "(?P<user>\\w+)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "(name=user:\\w+)",
                "explanationIfWrong": "Invalid Python regex syntax."
              },
              {
                "id": "C",
                "text": "<user>(\\w+)",
                "explanationIfWrong": "Angle brackets outside parentheses are literal characters."
              },
              {
                "id": "D",
                "text": "(user: \\w+)",
                "explanationIfWrong": "This matches literal string 'user: ' followed by word characters."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's syntax for named capture groups is (?P<name>pattern).",
            "id": "q-12-4-regular-expressions-3-v2"
          },
          {
            "question": "What does match.groupdict() return on a Match object with named capture groups?",
            "options": [
              {
                "id": "A",
                "text": "A dictionary mapping group names to their matched substrings",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A list of group numbers",
                "explanationIfWrong": "groupdict() produces a dictionary."
              },
              {
                "id": "C",
                "text": "A tuple of all groups",
                "explanationIfWrong": "match.groups() returns a tuple; groupdict() returns a dictionary."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "It returns a dictionary containing all named group matches."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "match.groupdict() converts all named capture groups into a key-value dictionary.",
            "id": "q-12-4-regular-expressions-3-v3"
          }
        ]
      },
      {
        "heading": "Text Substitution & Cleaning with re.sub()",
        "text": "The `re.sub(pattern, replacement, string, count=0)` function finds all occurrences of `pattern` in `string` and replaces them with `replacement`. Beyond static string replacements, the replacement can reference capture groups (using `\\1`, `\\2` or `\\g<name>`), or it can even be a callable function that dynamically computes the replacement string based on the match object.",
        "codeSnippet": "import re\n\n# 1. Clean extra whitespace\nraw_text = \"Too    many   irregular      spaces.\"\ncleaned = re.sub(r\"\\s+\", \" \", raw_text)\nprint(\"Cleaned spaces:\", cleaned)\n\n# 2. Reformat dates from YYYY-MM-DD to DD/MM/YYYY using backreferences\ndate_text = \"Release dates: 2024-05-12 and 2026-10-10.\"\nreformatted = re.sub(r\"(\\d{4})-(\\d{2})-(\\d{2})\", r\"\\3/\\2/\\1\", date_text)\nprint(\"Reformatted:   \", reformatted)\n\n# 3. Dynamic replacement using a function\ndef censor_word(match):\n    return \"*\" * len(match.group())\n\nsensitive = re.sub(r\"\\b(password|secret)\\b\", censor_word, \"My password is a secret\")\nprint(\"Censored:      \", sensitive)",
        "terminalOutput": "Cleaned spaces: Too many irregular spaces.\nReformatted:    Release dates: 12/05/2024 and 10/10/2026.\nCensored:       My ******** is a ******",
        "tip": "Passing a function as the replacement argument to `re.sub()` gives you complete programmatic control over how each match is substituted.",
        "mcq": {
          "question": "What is the output of re.sub(r'\\d+', '#', 'Order 123 for Item 456')?",
          "options": [
            {
              "id": "A",
              "text": "'Order # for Item #'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "'Order ### for Item ###'",
              "explanationIfWrong": "\\d+ matches entire number blocks at once, replacing each with a single '#'"
            },
            {
              "id": "C",
              "text": "'Order 123 for Item 456'",
              "explanationIfWrong": "re.sub substitutes the matching numbers."
            },
            {
              "id": "D",
              "text": "['Order #', 'Item #']",
              "explanationIfWrong": "re.sub returns a single string with replacements made."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Each consecutive sequence of digits (\\d+) is replaced by '#', producing 'Order # for Item #'. Use \\d instead of \\d+ to replace digit-by-digit.",
          "id": "q-12-4-regular-expressions-4-v1"
        },
        "retestMcq": {
          "question": "How do you reference the first capture group inside the replacement string of re.sub()?",
          "options": [
            {
              "id": "A",
              "text": "r'\\1' or r'\\g<1>'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "$1",
              "explanationIfWrong": "$1 is JavaScript/Perl syntax; Python regex uses \\1 or \\g<1>."
            },
            {
              "id": "C",
              "text": "%1",
              "explanationIfWrong": "%1 is C/printf syntax."
            },
            {
              "id": "D",
              "text": "group[1]",
              "explanationIfWrong": "In substitution strings, backreferences use backslash notation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's re.sub() interprets \\1 or \\g<1> (and \\g<name>) as backreferences to captured groups in the replacement string.",
          "id": "q-12-4-regular-expressions-4-v2"
        },
        "questionPool": [
          {
            "question": "What is the output of re.sub(r'\\d+', '#', 'Order 123 for Item 456')?",
            "options": [
              {
                "id": "A",
                "text": "'Order # for Item #'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'Order ### for Item ###'",
                "explanationIfWrong": "\\d+ matches entire number blocks at once, replacing each with a single '#'"
              },
              {
                "id": "C",
                "text": "'Order 123 for Item 456'",
                "explanationIfWrong": "re.sub substitutes the matching numbers."
              },
              {
                "id": "D",
                "text": "['Order #', 'Item #']",
                "explanationIfWrong": "re.sub returns a single string with replacements made."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each consecutive sequence of digits (\\d+) is replaced by '#', producing 'Order # for Item #'. Use \\d instead of \\d+ to replace digit-by-digit.",
            "id": "q-12-4-regular-expressions-4-v1"
          },
          {
            "question": "How do you reference the first capture group inside the replacement string of re.sub()?",
            "options": [
              {
                "id": "A",
                "text": "r'\\1' or r'\\g<1>'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "$1",
                "explanationIfWrong": "$1 is JavaScript/Perl syntax; Python regex uses \\1 or \\g<1>."
              },
              {
                "id": "C",
                "text": "%1",
                "explanationIfWrong": "%1 is C/printf syntax."
              },
              {
                "id": "D",
                "text": "group[1]",
                "explanationIfWrong": "In substitution strings, backreferences use backslash notation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's re.sub() interprets \\1 or \\g<1> (and \\g<name>) as backreferences to captured groups in the replacement string.",
            "id": "q-12-4-regular-expressions-4-v2"
          },
          {
            "question": "Can the replacement argument in re.sub() be a Python function?",
            "options": [
              {
                "id": "A",
                "text": "Yes, re.sub passes each Match object to the function and replaces the match with the string it returns",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, replacement must always be a plain string",
                "explanationIfWrong": "Passing a callable is fully supported and a core feature of re.sub."
              },
              {
                "id": "C",
                "text": "Only if the function returns an integer",
                "explanationIfWrong": "The function must return a string."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Callable replacement is standard in all modern Python versions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When replacement is a function, re.sub invokes it for every match, taking the returned string as the replacement text.",
            "id": "q-12-4-regular-expressions-4-v3"
          }
        ]
      },
      {
        "heading": "Pattern Compilation & Validation Architecture",
        "text": "When a regex pattern is used repeatedly (such as inside a loop over thousands of rows), calling `re.search(pattern, text)` repeatedly re-parses and re-compiles the regex pattern into internal bytecode on each iteration. Using `re.compile(pattern)` pre-compiles the pattern once into a reusable Regex Object. This dramatically accelerates matching loops and centralizes pattern definitions.",
        "codeSnippet": "import re\n\n# Compile pattern once upfront\nEMAIL_REGEX = re.compile(r\"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$\")\n\ndef is_valid_email(email):\n    # Fast matching using pre-compiled regex object\n    return bool(EMAIL_REGEX.fullmatch(email))\n\ntest_emails = [\"student@dopilot.com\", \"invalid.email@\", \"support@helsinki.fi\", \"bad@domain\"]\nfor e in test_emails:\n    status = \"VALID\" if is_valid_email(e) else \"INVALID\"\n    print(f\"{e:25} -> {status}\")",
        "terminalOutput": "student@dopilot.com        -> VALID\ninvalid.email@            -> INVALID\nsupport@helsinki.fi       -> VALID\nbad@domain                -> INVALID",
        "tip": "Pre-compile regular expressions as module-level constants (e.g. `URL_PATTERN = re.compile(r'...')`) for optimal performance and clean organization.",
        "mcq": {
          "question": "Why should you use re.compile() when applying the same regex pattern repeatedly in a loop?",
          "options": [
            {
              "id": "A",
              "text": "It parses and compiles the regex pattern into internal bytecode once, avoiding repetitive compilation overhead",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It converts the regex into a C++ binary extension",
              "explanationIfWrong": "It compiles to Python regex bytecode, not C++ binaries."
            },
            {
              "id": "C",
              "text": "It prevents memory leaks in Python",
              "explanationIfWrong": "re.search caches recent patterns, but compile provides explicit performance gains."
            },
            {
              "id": "D",
              "text": "It allows patterns to match without raw strings",
              "explanationIfWrong": "Raw strings should still be used when defining patterns."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "re.compile() stores the compiled pattern object, eliminating pattern parsing and bytecode generation on every loop iteration.",
          "id": "q-12-4-regular-expressions-5-v1"
        },
        "retestMcq": {
          "question": "Given compiled = re.compile(r'\\d+'), how do you find all matches in a string text?",
          "options": [
            {
              "id": "A",
              "text": "compiled.findall(text)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "text.findall(compiled)",
              "explanationIfWrong": "Strings do not have a .findall() method."
            },
            {
              "id": "C",
              "text": "re.findall(text, compiled)",
              "explanationIfWrong": "The pattern comes first in top-level re functions."
            },
            {
              "id": "D",
              "text": "compiled(text)",
              "explanationIfWrong": "Pattern objects are not directly callable; call .findall(), .search(), etc."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A compiled regex pattern object has methods like compiled.search(text), compiled.match(text), and compiled.findall(text).",
          "id": "q-12-4-regular-expressions-5-v2"
        },
        "questionPool": [
          {
            "question": "Why should you use re.compile() when applying the same regex pattern repeatedly in a loop?",
            "options": [
              {
                "id": "A",
                "text": "It parses and compiles the regex pattern into internal bytecode once, avoiding repetitive compilation overhead",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It converts the regex into a C++ binary extension",
                "explanationIfWrong": "It compiles to Python regex bytecode, not C++ binaries."
              },
              {
                "id": "C",
                "text": "It prevents memory leaks in Python",
                "explanationIfWrong": "re.search caches recent patterns, but compile provides explicit performance gains."
              },
              {
                "id": "D",
                "text": "It allows patterns to match without raw strings",
                "explanationIfWrong": "Raw strings should still be used when defining patterns."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "re.compile() stores the compiled pattern object, eliminating pattern parsing and bytecode generation on every loop iteration.",
            "id": "q-12-4-regular-expressions-5-v1"
          },
          {
            "question": "Given compiled = re.compile(r'\\d+'), how do you find all matches in a string text?",
            "options": [
              {
                "id": "A",
                "text": "compiled.findall(text)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "text.findall(compiled)",
                "explanationIfWrong": "Strings do not have a .findall() method."
              },
              {
                "id": "C",
                "text": "re.findall(text, compiled)",
                "explanationIfWrong": "The pattern comes first in top-level re functions."
              },
              {
                "id": "D",
                "text": "compiled(text)",
                "explanationIfWrong": "Pattern objects are not directly callable; call .findall(), .search(), etc."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A compiled regex pattern object has methods like compiled.search(text), compiled.match(text), and compiled.findall(text).",
            "id": "q-12-4-regular-expressions-5-v2"
          },
          {
            "question": "What flag can be passed to re.compile() to make matching case-insensitive?",
            "options": [
              {
                "id": "A",
                "text": "re.IGNORECASE (or re.I)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "re.NOCASE",
                "explanationIfWrong": "The correct constant is re.IGNORECASE or re.I."
              },
              {
                "id": "C",
                "text": "re.LOWER",
                "explanationIfWrong": "No re.LOWER flag exists."
              },
              {
                "id": "D",
                "text": "re.CASELESS",
                "explanationIfWrong": "The standard flag is re.IGNORECASE."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing re.IGNORECASE (or re.I) enables case-insensitive pattern matching across the regex.",
            "id": "q-12-4-regular-expressions-5-v3"
          }
        ]
      }
    ]
  }
];

// Question pool selector for Part 12
export const getActiveQuestionsForLevelPart12 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part12_seen_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part12_active_qset_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 12
export const getConsecutiveFailuresPart12 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part12_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart12 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part12_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart12 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part12_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart12 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part12_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart12 = (
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
  const currentAttempt = getLevelAttemptCountPart12(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part12_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part12_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part12_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part12_locked_${studentId}`);
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
      setLevelAttemptCountPart12(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart12(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart12(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part12_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part12_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part12_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart12 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part12_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part12_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part12_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part12_locked_progression_${studentId}`);
  } catch {}
};
