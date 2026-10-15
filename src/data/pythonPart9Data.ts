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

export const PART_9_SECTIONS: SectionContent[] = [
  {
    "id": "9-1-memory-references",
    "number": "9.1",
    "title": "Objects & Memory References",
    "subtitle": "Master how variables bind to memory addresses, alias mechanics, equality vs identity, and shallow vs deep copies.",
    "readTime": "20 min",
    "objectives": [
      "Understand that variables hold references to objects, not the objects themselves",
      "Distinguish between identity (is / id()) and value equality (==)",
      "Recognize aliasing bugs where modifying one variable unexpectedly alters another",
      "Use copy.copy() for shallow copying of container objects",
      "Use copy.deepcopy() for recursively copying nested compound objects",
      "Trace pass-by-object-reference mechanics when passing objects to functions"
    ],
    "theoryBlocks": [
      {
        "heading": "Variables are References to Objects",
        "text": "In Python, a variable is not a physical box holding data; it is a reference (or pointer) that points to an object stored in memory. When you execute b = a, Python does not duplicate the object. Instead, it binds the name b to the exact same object reference that a points to. Both variables now alias the same location in memory.",
        "codeSnippet": "class Pet:\n    def __init__(self, name):\n        self.name = name\n\np1 = Pet(\"Milo\")\np2 = p1  # p2 references the same object as p1\n\nprint(f\"p1 id: {id(p1)}, p2 id: {id(p2)}\")\nprint(f\"p1 is p2: {p1 is p2}\")\n\n# Modifying via p2 affects p1!\np2.name = \"Otis\"\nprint(f\"p1.name after p2 update: {p1.name}\")",
        "terminalOutput": "p1 id: 14028..., p2 id: 14028...\np1 is p2: True\np1.name after p2 update: Otis",
        "tip": "Think of variables in Python as sticky notes attached to an object in memory. Assigning b = a simply attaches a second sticky note to the exact same object.",
        "mcq": {
          "id": "q-9-1-memory-references-0-v1",
          "question": "What happens when you execute b = a where a is an instance of a custom class?",
          "options": [
            {
              "id": "A",
              "text": "b is assigned a reference to the same object as a; no new object is created",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A complete duplicate of the object is created and bound to b",
              "explanationIfWrong": "Assignment never duplicates objects in Python."
            },
            {
              "id": "C",
              "text": "a is deleted and replaced by b",
              "explanationIfWrong": "Both variables remain valid and point to the object."
            },
            {
              "id": "D",
              "text": "b becomes None",
              "explanationIfWrong": "b points to the object referenced by a."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Assignment copies the object reference, not the object itself. Both variables now point to the same object."
        },
        "retestMcq": {
          "id": "q-9-1-memory-references-0-v2",
          "question": "If p1 and p2 point to the same Pet object, what does p1.name output after running p2.name = 'Max'?",
          "options": [
            {
              "id": "A",
              "text": "'Max'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The original name before the change",
              "explanationIfWrong": "Both variables reference the exact same instance in memory."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "The attribute was updated to 'Max'."
            },
            {
              "id": "D",
              "text": "Raises an AttributeError",
              "explanationIfWrong": "Mutating an attribute on the shared reference is completely valid."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because p1 and p2 reference the same instance, mutating an attribute through p2 is immediately visible through p1."
        },
        "questionPool": [
          {
            "id": "q-9-1-memory-references-0-v1",
            "question": "What happens when you execute b = a where a is an instance of a custom class?",
            "options": [
              {
                "id": "A",
                "text": "b is assigned a reference to the same object as a; no new object is created",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A complete duplicate of the object is created and bound to b",
                "explanationIfWrong": "Assignment never duplicates objects in Python."
              },
              {
                "id": "C",
                "text": "a is deleted and replaced by b",
                "explanationIfWrong": "Both variables remain valid and point to the object."
              },
              {
                "id": "D",
                "text": "b becomes None",
                "explanationIfWrong": "b points to the object referenced by a."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Assignment copies the object reference, not the object itself. Both variables now point to the same object."
          },
          {
            "id": "q-9-1-memory-references-0-v2",
            "question": "If p1 and p2 point to the same Pet object, what does p1.name output after running p2.name = 'Max'?",
            "options": [
              {
                "id": "A",
                "text": "'Max'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The original name before the change",
                "explanationIfWrong": "Both variables reference the exact same instance in memory."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "The attribute was updated to 'Max'."
              },
              {
                "id": "D",
                "text": "Raises an AttributeError",
                "explanationIfWrong": "Mutating an attribute on the shared reference is completely valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because p1 and p2 reference the same instance, mutating an attribute through p2 is immediately visible through p1."
          },
          {
            "id": "q-9-1-memory-references-0-v3",
            "question": "How can you verify whether two variables point to the exact same memory location?",
            "options": [
              {
                "id": "A",
                "text": "Using the identity operator a is b (or comparing id(a) == id(b))",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Using a == b",
                "explanationIfWrong": "== checks value equality, which can be True even for distinct objects."
              },
              {
                "id": "C",
                "text": "Using type(a) == type(b)",
                "explanationIfWrong": "type() checks class, not memory identity."
              },
              {
                "id": "D",
                "text": "Using a in b",
                "explanationIfWrong": "in checks membership in collections."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The is operator tests object identity \u2014 whether both references point to the exact same address in memory."
          }
        ]
      },
      {
        "heading": "Equality (==) vs Identity (is)",
        "text": "The == operator evaluates equality of value (whether two objects represent the same data, defined by __eq__), whereas the is operator evaluates identity (whether two variables refer to the exact same object in memory, id(a) == id(b)). Two distinct objects can be equal in value while having distinct identities.",
        "codeSnippet": "list1 = [1, 2, 3]\nlist2 = [1, 2, 3]\nlist3 = list1\n\nprint(f\"list1 == list2: {list1 == list2}\")  # True: identical contents\nprint(f\"list1 is list2: {list1 is list2}\")  # False: separate memory allocations\nprint(f\"list1 is list3: {list1 is list3}\")  # True: identical memory reference",
        "terminalOutput": "list1 == list2: True\nlist1 is list2: False\nlist1 is list3: True",
        "tip": "Use == for comparing data values (strings, numbers, lists). Use is only when checking identity against singletons like None (if x is None:).",
        "mcq": {
          "id": "q-9-1-memory-references-1-v1",
          "question": "What is the crucial difference between the == operator and the is operator?",
          "options": [
            {
              "id": "A",
              "text": "== compares values (contents); is compares memory identities (whether they are the exact same object)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "== is for numbers; is is for strings",
              "explanationIfWrong": "Both operators can be used with any Python types."
            },
            {
              "id": "C",
              "text": "== modifies the left variable; is modifies the right",
              "explanationIfWrong": "Neither operator modifies variables."
            },
            {
              "id": "D",
              "text": "They are 100% synonymous and interchangeable in Python",
              "explanationIfWrong": "They have fundamentally different semantics."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "== checks if values are equivalent; is checks if both operands reference the identical object in memory."
        },
        "retestMcq": {
          "id": "q-9-1-memory-references-1-v2",
          "question": "What is the result of [1, 2] is [1, 2] in Python?",
          "options": [
            {
              "id": "A",
              "text": "False, because two separate list objects were allocated in memory",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "True, because the elements are identical",
              "explanationIfWrong": "Contents are identical, but they are two separate objects."
            },
            {
              "id": "C",
              "text": "TypeError",
              "explanationIfWrong": "is comparisons between lists are valid."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "is returns a boolean."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Each list literal [1, 2] creates a new list in memory, so their identities differ."
        },
        "questionPool": [
          {
            "id": "q-9-1-memory-references-1-v1",
            "question": "What is the crucial difference between the == operator and the is operator?",
            "options": [
              {
                "id": "A",
                "text": "== compares values (contents); is compares memory identities (whether they are the exact same object)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "== is for numbers; is is for strings",
                "explanationIfWrong": "Both operators can be used with any Python types."
              },
              {
                "id": "C",
                "text": "== modifies the left variable; is modifies the right",
                "explanationIfWrong": "Neither operator modifies variables."
              },
              {
                "id": "D",
                "text": "They are 100% synonymous and interchangeable in Python",
                "explanationIfWrong": "They have fundamentally different semantics."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "== checks if values are equivalent; is checks if both operands reference the identical object in memory."
          },
          {
            "id": "q-9-1-memory-references-1-v2",
            "question": "What is the result of [1, 2] is [1, 2] in Python?",
            "options": [
              {
                "id": "A",
                "text": "False, because two separate list objects were allocated in memory",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "True, because the elements are identical",
                "explanationIfWrong": "Contents are identical, but they are two separate objects."
              },
              {
                "id": "C",
                "text": "TypeError",
                "explanationIfWrong": "is comparisons between lists are valid."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "is returns a boolean."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each list literal [1, 2] creates a new list in memory, so their identities differ."
          },
          {
            "id": "q-9-1-memory-references-1-v3",
            "question": "Why is if val is None the recommended idiom rather than if val == None?",
            "options": [
              {
                "id": "A",
                "text": "None is a singleton in Python, and is checks directly against its unique identity without invoking custom __eq__ methods",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "== None raises a SyntaxError in Python 3",
                "explanationIfWrong": "== None is syntactically valid but discouraged by PEP 8."
              },
              {
                "id": "C",
                "text": "None cannot be compared with ==",
                "explanationIfWrong": "It can be compared, but custom classes can override __eq__."
              },
              {
                "id": "D",
                "text": "is None is only allowed in functions",
                "explanationIfWrong": "is None can be used anywhere."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 prescribes is None because None is a singleton, making identity checking faster and immune to custom __eq__ bugs."
          }
        ]
      },
      {
        "heading": "Shallow Copy with copy.copy()",
        "text": "When you want a real duplicate of an object rather than an alias, you can make a copy. A shallow copy creates a new compound object (such as a new list or class instance) and then inserts references into it to the objects found in the original.",
        "codeSnippet": "import copy\n\nclass Team:\n    def __init__(self, name, members):\n        self.name = name\n        self.members = members  # List of member names\n\nt1 = Team(\"Alpha\", [\"Alice\", \"Bob\"])\nt2 = copy.copy(t1)  # Shallow copy\n\nprint(f\"t1 is t2: {t1 is t2}\")                  # False: new Team instance\nprint(f\"Members shared? {t1.members is t2.members}\") # True: shares the same inner list!\n\nt2.members.append(\"Charlie\")\nprint(f\"t1 members: {t1.members}\")             # Alice, Bob, Charlie!",
        "terminalOutput": "t1 is t2: False\nMembers shared? True\nt1 members: ['Alice', 'Bob', 'Charlie']",
        "warning": "A shallow copy creates a new outer object, but nested mutable objects (like inner lists or dicts) are STILL shared between original and copy!",
        "mcq": {
          "id": "q-9-1-memory-references-2-v1",
          "question": "What is the primary characteristic of a shallow copy created with copy.copy()?",
          "options": [
            {
              "id": "A",
              "text": "It constructs a new container object, but populates it with references to the child objects contained in the original",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It recursively duplicates every child object down to the deepest nested level",
              "explanationIfWrong": "That is a deep copy."
            },
            {
              "id": "C",
              "text": "It converts all attributes into strings",
              "explanationIfWrong": "copy() preserves types."
            },
            {
              "id": "D",
              "text": "It deletes the original object from RAM",
              "explanationIfWrong": "The original is preserved."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A shallow copy duplicates only the top-level container; nested references are shared with the original."
        },
        "retestMcq": {
          "id": "q-9-1-memory-references-2-v2",
          "question": "In the Team example above, why did appending 'Charlie' to t2.members also modify t1.members?",
          "options": [
            {
              "id": "A",
              "text": "Because shallow copy copied the reference to the members list rather than duplicating the list itself",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because Python automatically syncs all class attributes",
              "explanationIfWrong": "Python does not sync attributes automatically."
            },
            {
              "id": "C",
              "text": "Because members was a tuple",
              "explanationIfWrong": "members is a list, and it was shared."
            },
            {
              "id": "D",
              "text": "Because Charlie is a reserved keyword",
              "explanationIfWrong": "Charlie is a string literal."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Both t1 and t2 point to the same inner list object in memory, so mutating it affects both."
        },
        "questionPool": [
          {
            "id": "q-9-1-memory-references-2-v1",
            "question": "What is the primary characteristic of a shallow copy created with copy.copy()?",
            "options": [
              {
                "id": "A",
                "text": "It constructs a new container object, but populates it with references to the child objects contained in the original",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It recursively duplicates every child object down to the deepest nested level",
                "explanationIfWrong": "That is a deep copy."
              },
              {
                "id": "C",
                "text": "It converts all attributes into strings",
                "explanationIfWrong": "copy() preserves types."
              },
              {
                "id": "D",
                "text": "It deletes the original object from RAM",
                "explanationIfWrong": "The original is preserved."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A shallow copy duplicates only the top-level container; nested references are shared with the original."
          },
          {
            "id": "q-9-1-memory-references-2-v2",
            "question": "In the Team example above, why did appending 'Charlie' to t2.members also modify t1.members?",
            "options": [
              {
                "id": "A",
                "text": "Because shallow copy copied the reference to the members list rather than duplicating the list itself",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python automatically syncs all class attributes",
                "explanationIfWrong": "Python does not sync attributes automatically."
              },
              {
                "id": "C",
                "text": "Because members was a tuple",
                "explanationIfWrong": "members is a list, and it was shared."
              },
              {
                "id": "D",
                "text": "Because Charlie is a reserved keyword",
                "explanationIfWrong": "Charlie is a string literal."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Both t1 and t2 point to the same inner list object in memory, so mutating it affects both."
          },
          {
            "id": "q-9-1-memory-references-2-v3",
            "question": "Which module in Python's standard library provides the shallow copy function copy()?",
            "options": [
              {
                "id": "A",
                "text": "copy",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "clone",
                "explanationIfWrong": "There is no clone module in Python standard library."
              },
              {
                "id": "C",
                "text": "sys",
                "explanationIfWrong": "sys provides system parameters."
              },
              {
                "id": "D",
                "text": "memory",
                "explanationIfWrong": "The module is named copy."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python provides both copy() and deepcopy() inside the standard library copy module."
          }
        ]
      },
      {
        "heading": "Deep Copy with copy.deepcopy()",
        "text": "A deep copy constructs a new compound object and then recursively inserts copies into it of the objects found in the original. With a deep copy, changes to nested mutable structures inside the clone have absolutely zero effect on the original object.",
        "codeSnippet": "import copy\n\nclass Config:\n    def __init__(self, name, settings):\n        self.name = name\n        self.settings = settings\n\ncfg1 = Config(\"Production\", {\"timeout\": 30, \"retries\": 3})\ncfg2 = copy.deepcopy(cfg1)  # Deep copy\n\nprint(f\"cfg1 is cfg2: {cfg1 is cfg2}\")\nprint(f\"Settings shared? {cfg1.settings is cfg2.settings}\") # False: independent dict!\n\ncfg2.settings[\"retries\"] = 10\nprint(f\"cfg1 retries: {cfg1.settings['retries']}\")\nprint(f\"cfg2 retries: {cfg2.settings['retries']}\")",
        "terminalOutput": "cfg1 is cfg2: False\nSettings shared? False\ncfg1 retries: 3\ncfg2 retries: 10",
        "tip": "Use copy.deepcopy() whenever you need completely isolated clones of complex domain objects containing nested lists, dicts, or other object instances.",
        "mcq": {
          "id": "q-9-1-memory-references-3-v1",
          "question": "How does copy.deepcopy() differ from copy.copy()?",
          "options": [
            {
              "id": "A",
              "text": "deepcopy() recursively duplicates all nested objects at every level, creating completely independent copies",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "deepcopy() only works on numbers and strings",
              "explanationIfWrong": "deepcopy works on all complex nested data structures."
            },
            {
              "id": "C",
              "text": "deepcopy() saves the object to an SQLite database",
              "explanationIfWrong": "deepcopy operates strictly in memory."
            },
            {
              "id": "D",
              "text": "deepcopy() runs 10x faster than shallow copy",
              "explanationIfWrong": "deepcopy is generally slower because it recursively duplicates all objects."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "deepcopy() recursively copies every child, grandchild, and nested structure, ensuring complete data isolation."
        },
        "retestMcq": {
          "id": "q-9-1-memory-references-3-v2",
          "question": "What is the value of cfg1.settings['retries'] after modifying cfg2.settings['retries'] = 10 via deepcopy?",
          "options": [
            {
              "id": "A",
              "text": "3 (unaffected by the modification)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "10",
              "explanationIfWrong": "cfg1 and cfg2 have separate dictionary instances."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "The original dictionary retains its value 3."
            },
            {
              "id": "D",
              "text": "Raises a KeyError",
              "explanationIfWrong": "retries key exists with value 3."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because deepcopy created a distinct dictionary instance for cfg2, changes to cfg2 do not affect cfg1."
        },
        "questionPool": [
          {
            "id": "q-9-1-memory-references-3-v1",
            "question": "How does copy.deepcopy() differ from copy.copy()?",
            "options": [
              {
                "id": "A",
                "text": "deepcopy() recursively duplicates all nested objects at every level, creating completely independent copies",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "deepcopy() only works on numbers and strings",
                "explanationIfWrong": "deepcopy works on all complex nested data structures."
              },
              {
                "id": "C",
                "text": "deepcopy() saves the object to an SQLite database",
                "explanationIfWrong": "deepcopy operates strictly in memory."
              },
              {
                "id": "D",
                "text": "deepcopy() runs 10x faster than shallow copy",
                "explanationIfWrong": "deepcopy is generally slower because it recursively duplicates all objects."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "deepcopy() recursively copies every child, grandchild, and nested structure, ensuring complete data isolation."
          },
          {
            "id": "q-9-1-memory-references-3-v2",
            "question": "What is the value of cfg1.settings['retries'] after modifying cfg2.settings['retries'] = 10 via deepcopy?",
            "options": [
              {
                "id": "A",
                "text": "3 (unaffected by the modification)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "10",
                "explanationIfWrong": "cfg1 and cfg2 have separate dictionary instances."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "The original dictionary retains its value 3."
              },
              {
                "id": "D",
                "text": "Raises a KeyError",
                "explanationIfWrong": "retries key exists with value 3."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because deepcopy created a distinct dictionary instance for cfg2, changes to cfg2 do not affect cfg1."
          },
          {
            "id": "q-9-1-memory-references-3-v3",
            "question": "Can copy.deepcopy() handle circular references (e.g. an object that references itself)?",
            "options": [
              {
                "id": "A",
                "text": "Yes, copy.deepcopy() maintains an internal memo dictionary tracking copied objects to prevent infinite loops",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, it immediately causes a RecursionError crash",
                "explanationIfWrong": "Python's deepcopy is specifically designed to handle cyclic references safely."
              },
              {
                "id": "C",
                "text": "Only if using Python 2",
                "explanationIfWrong": "Python 3 has full memoization support in deepcopy."
              },
              {
                "id": "D",
                "text": "Only for primitive types",
                "explanationIfWrong": "Circular references occur in complex objects, which deepcopy handles gracefully."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "deepcopy tracks previously visited objects in a memo table to handle circular references safely."
          }
        ]
      },
      {
        "heading": "Pass-by-Object-Reference in Functions",
        "text": "When you pass an object into a function or method, Python passes the object reference by value. This means the parameter inside the function becomes an alias to the caller's object. If you mutate the object's attributes inside the function, the caller's object changes. However, if you reassign the parameter itself, the caller's variable remains unchanged.",
        "codeSnippet": "class Player:\n    def __init__(self, name, score=0):\n        self.name = name\n        self.score = score\n\ndef level_up(player):\n    # Mutating attribute: affects caller!\n    player.score += 50\n\ndef replace_player(player):\n    # Reassigning parameter: DOES NOT affect caller!\n    player = Player(\"Replaced\", 999)\n\np = Player(\"Ada\", 10)\nlevel_up(p)\nprint(f\"After level_up: {p.name} has {p.score}\")\n\nreplace_player(p)\nprint(f\"After replace_player: {p.name} has {p.score}\")",
        "terminalOutput": "After level_up: Ada has 50\nAfter replace_player: Ada has 60",
        "tip": "Mutating an object modifies the shared underlying data. Rebinding the local variable name simply points that local variable to a different object.",
        "mcq": {
          "id": "q-9-1-memory-references-4-v1",
          "question": "What happens if a function modifies an attribute of an object passed as an argument (e.g. obj.status = 'active')?",
          "options": [
            {
              "id": "A",
              "text": "The change persists on the caller's object because both share the same reference",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The change is discarded when the function returns",
              "explanationIfWrong": "Modifications to mutable objects in-place persist."
            },
            {
              "id": "C",
              "text": "A new object is automatically returned",
              "explanationIfWrong": "The existing object was mutated directly."
            },
            {
              "id": "D",
              "text": "Raises a ParameterMutationError",
              "explanationIfWrong": "Python allows parameter object mutation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since Python passes object references, mutating the object's attributes inside a function affects the caller's instance."
        },
        "retestMcq": {
          "id": "q-9-1-memory-references-4-v2",
          "question": "What happens if a function reassigns its parameter (e.g. player = Player('Bob'))?",
          "options": [
            {
              "id": "A",
              "text": "The local variable player now points to the new object, leaving the caller's variable completely unchanged",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The caller's variable is updated to point to the new Player",
              "explanationIfWrong": "Rebinding a local variable name does not change the caller's variable binding."
            },
            {
              "id": "C",
              "text": "Both objects are merged into one",
              "explanationIfWrong": "Reassignment simply repoints the local identifier."
            },
            {
              "id": "D",
              "text": "The original object is destroyed",
              "explanationIfWrong": "The original object remains referenced by the caller."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Variable reassignment only rebinds the local scope variable name; it does not alter the caller's reference."
        },
        "questionPool": [
          {
            "id": "q-9-1-memory-references-4-v1",
            "question": "What happens if a function modifies an attribute of an object passed as an argument (e.g. obj.status = 'active')?",
            "options": [
              {
                "id": "A",
                "text": "The change persists on the caller's object because both share the same reference",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The change is discarded when the function returns",
                "explanationIfWrong": "Modifications to mutable objects in-place persist."
              },
              {
                "id": "C",
                "text": "A new object is automatically returned",
                "explanationIfWrong": "The existing object was mutated directly."
              },
              {
                "id": "D",
                "text": "Raises a ParameterMutationError",
                "explanationIfWrong": "Python allows parameter object mutation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since Python passes object references, mutating the object's attributes inside a function affects the caller's instance."
          },
          {
            "id": "q-9-1-memory-references-4-v2",
            "question": "What happens if a function reassigns its parameter (e.g. player = Player('Bob'))?",
            "options": [
              {
                "id": "A",
                "text": "The local variable player now points to the new object, leaving the caller's variable completely unchanged",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The caller's variable is updated to point to the new Player",
                "explanationIfWrong": "Rebinding a local variable name does not change the caller's variable binding."
              },
              {
                "id": "C",
                "text": "Both objects are merged into one",
                "explanationIfWrong": "Reassignment simply repoints the local identifier."
              },
              {
                "id": "D",
                "text": "The original object is destroyed",
                "explanationIfWrong": "The original object remains referenced by the caller."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Variable reassignment only rebinds the local scope variable name; it does not alter the caller's reference."
          },
          {
            "id": "q-9-1-memory-references-4-v3",
            "question": "Why is Python's parameter passing model accurately described as 'pass-by-object-reference' (or 'pass-by-assignment')?",
            "options": [
              {
                "id": "A",
                "text": "Parameters are assigned the reference to the passed object in the exact same manner as variable assignment (b = a)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Parameters are always cloned before function execution",
                "explanationIfWrong": "Python never implicitly clones arguments."
              },
              {
                "id": "C",
                "text": "Parameters are converted to C pointers",
                "explanationIfWrong": "It describes Python's high-level object model."
              },
              {
                "id": "D",
                "text": "All parameters are immutable integers",
                "explanationIfWrong": "Any object type can be passed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Function argument binding works identically to assignment (parameter = argument), passing the object reference."
          }
        ]
      },
      {
        "heading": "Comparing Object Identity vs Custom Equality",
        "text": "By default, the == operator on custom classes checks memory identity (just like is). If you want two distinct instances with identical attributes to be considered equal (e.g. pt1 == pt2), you must implement the __eq__ dunder method in your class.",
        "codeSnippet": "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __eq__(self, other):\n        if not isinstance(other, Point):\n            return False\n        return self.x == other.x and self.y == other.y\n\np1 = Point(3, 4)\np2 = Point(3, 4)\n\nprint(f\"p1 is p2: {p1 is p2}\")  # False: different objects\nprint(f\"p1 == p2: {p1 == p2}\")  # True: __eq__ compares x and y!",
        "terminalOutput": "p1 is p2: False\np1 == p2: True",
        "tip": "Always check isinstance(other, ClassName) in __eq__ so comparing your object against a different type returns False rather than crashing with an AttributeError.",
        "mcq": {
          "id": "q-9-1-memory-references-5-v1",
          "question": "What does the == operator compare on a custom class if __eq__ has NOT been defined?",
          "options": [
            {
              "id": "A",
              "text": "Memory identity (whether a is b), inherited from the default object implementation",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "All attributes automatically in alphabetical order",
              "explanationIfWrong": "Python does not automatically compare all attributes unless __eq__ is defined."
            },
            {
              "id": "C",
              "text": "The length of the class name",
              "explanationIfWrong": "Default equality uses memory identity."
            },
            {
              "id": "D",
              "text": "It raises a NotImplementedError",
              "explanationIfWrong": "object.__eq__ returns True only if a is b."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without a custom __eq__, classes inherit object.__eq__, which defaults to identity comparison (a is b)."
        },
        "retestMcq": {
          "id": "q-9-1-memory-references-5-v2",
          "question": "What is the purpose of implementing the __eq__ method in a class?",
          "options": [
            {
              "id": "A",
              "text": "To define custom value equality rules when comparing instances with ==",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To format strings for print()",
              "explanationIfWrong": "__str__ formats strings; __eq__ defines equality."
            },
            {
              "id": "C",
              "text": "To initialize constructor variables",
              "explanationIfWrong": "__init__ initializes variables."
            },
            {
              "id": "D",
              "text": "To measure length with len()",
              "explanationIfWrong": "__len__ defines length."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "__eq__ is the dunder method that implements the == operator for class instances."
        },
        "questionPool": [
          {
            "id": "q-9-1-memory-references-5-v1",
            "question": "What does the == operator compare on a custom class if __eq__ has NOT been defined?",
            "options": [
              {
                "id": "A",
                "text": "Memory identity (whether a is b), inherited from the default object implementation",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "All attributes automatically in alphabetical order",
                "explanationIfWrong": "Python does not automatically compare all attributes unless __eq__ is defined."
              },
              {
                "id": "C",
                "text": "The length of the class name",
                "explanationIfWrong": "Default equality uses memory identity."
              },
              {
                "id": "D",
                "text": "It raises a NotImplementedError",
                "explanationIfWrong": "object.__eq__ returns True only if a is b."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without a custom __eq__, classes inherit object.__eq__, which defaults to identity comparison (a is b)."
          },
          {
            "id": "q-9-1-memory-references-5-v2",
            "question": "What is the purpose of implementing the __eq__ method in a class?",
            "options": [
              {
                "id": "A",
                "text": "To define custom value equality rules when comparing instances with ==",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To format strings for print()",
                "explanationIfWrong": "__str__ formats strings; __eq__ defines equality."
              },
              {
                "id": "C",
                "text": "To initialize constructor variables",
                "explanationIfWrong": "__init__ initializes variables."
              },
              {
                "id": "D",
                "text": "To measure length with len()",
                "explanationIfWrong": "__len__ defines length."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "__eq__ is the dunder method that implements the == operator for class instances."
          },
          {
            "id": "q-9-1-memory-references-5-v3",
            "question": "Given p1 = Point(1, 2) and p2 = Point(1, 2) with the __eq__ method above, what is p1 == p2 and p1 is p2?",
            "options": [
              {
                "id": "A",
                "text": "p1 == p2 is True, while p1 is p2 is False",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Both evaluate to True",
                "explanationIfWrong": "They reside at different memory addresses, so is is False."
              },
              {
                "id": "C",
                "text": "Both evaluate to False",
                "explanationIfWrong": "__eq__ returns True because coordinates match."
              },
              {
                "id": "D",
                "text": "Raises a TypeError",
                "explanationIfWrong": "Comparison evaluates cleanly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "They are two distinct instances in memory (is False), but their coordinates match (== True)."
          }
        ]
      }
    ]
  },
  {
    "id": "9-2-composition-objects-as-attributes",
    "number": "9.2",
    "title": "Objects as Attributes (Composition)",
    "subtitle": "Structure complex software through composition by nesting custom class instances inside other objects.",
    "readTime": "20 min",
    "objectives": [
      "Understand object composition and the 'has-a' architectural relationship",
      "Store custom class instances as attributes within other class instances",
      "Navigate nested object structures cleanly using chained dot notation",
      "Implement method delegation to forward operations to inner component objects",
      "Distinguish composition (tight lifecycle) from aggregation (loose association)",
      "Model real-world multi-tiered domain hierarchies (Order -> Item -> Product)"
    ],
    "theoryBlocks": [
      {
        "heading": "Composition: The 'Has-A' Relationship",
        "text": "Composition is an object-oriented design technique where a complex class is built by combining simpler classes. Instead of packing all data into one giant monolithic class, each distinct concept is modeled as its own focused class. A Car 'has-an' Engine; a Student 'has-an' Address; an Order 'has-a' Customer.",
        "codeSnippet": "class Address:\n    def __init__(self, street, city, postal_code):\n        self.street = street\n        self.city = city\n        self.postal_code = postal_code\n\nclass Person:\n    def __init__(self, name, address):\n        self.name = name\n        self.address = address  # Address object stored as attribute!\n\naddr = Address(\"42 Tech Lane\", \"Helsinki\", \"00100\")\np = Person(\"Ada Lovelace\", addr)\n\nprint(f\"{p.name} lives in {p.address.city}, {p.address.postal_code}\")",
        "terminalOutput": "Ada Lovelace lives in Helsinki, 00100",
        "tip": "In software architecture, 'Favor composition over inheritance' is a premier design maxim because composed objects are modular and easy to test.",
        "mcq": {
          "id": "q-9-2-composition-objects-as-attributes-0-v1",
          "question": "What is object composition in Python?",
          "options": [
            {
              "id": "A",
              "text": "A design pattern where an object stores one or more instances of other classes as its attributes",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Writing two classes with the exact same name",
              "explanationIfWrong": "Class names must be distinct."
            },
            {
              "id": "C",
              "text": "Inheriting from 10 classes simultaneously",
              "explanationIfWrong": "That is multiple inheritance, not composition."
            },
            {
              "id": "D",
              "text": "Compressing Python files into a ZIP archive",
              "explanationIfWrong": "Composition is a structural software design principle."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Composition models 'has-a' relationships by containing instances of other classes inside an object."
        },
        "retestMcq": {
          "id": "q-9-2-composition-objects-as-attributes-0-v2",
          "question": "Which of the following is a classic example of a 'has-a' compositional relationship?",
          "options": [
            {
              "id": "A",
              "text": "A Computer has a Processor",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A Dog is an Animal",
              "explanationIfWrong": "This is an 'is-a' inheritance relationship."
            },
            {
              "id": "C",
              "text": "A Car is a Vehicle",
              "explanationIfWrong": "This is an 'is-a' inheritance relationship."
            },
            {
              "id": "D",
              "text": "An Integer is a Number",
              "explanationIfWrong": "This is a type hierarchy relationship."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A Computer possesses (has) a Processor as an internal component."
        },
        "questionPool": [
          {
            "id": "q-9-2-composition-objects-as-attributes-0-v1",
            "question": "What is object composition in Python?",
            "options": [
              {
                "id": "A",
                "text": "A design pattern where an object stores one or more instances of other classes as its attributes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Writing two classes with the exact same name",
                "explanationIfWrong": "Class names must be distinct."
              },
              {
                "id": "C",
                "text": "Inheriting from 10 classes simultaneously",
                "explanationIfWrong": "That is multiple inheritance, not composition."
              },
              {
                "id": "D",
                "text": "Compressing Python files into a ZIP archive",
                "explanationIfWrong": "Composition is a structural software design principle."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Composition models 'has-a' relationships by containing instances of other classes inside an object."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-0-v2",
            "question": "Which of the following is a classic example of a 'has-a' compositional relationship?",
            "options": [
              {
                "id": "A",
                "text": "A Computer has a Processor",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A Dog is an Animal",
                "explanationIfWrong": "This is an 'is-a' inheritance relationship."
              },
              {
                "id": "C",
                "text": "A Car is a Vehicle",
                "explanationIfWrong": "This is an 'is-a' inheritance relationship."
              },
              {
                "id": "D",
                "text": "An Integer is a Number",
                "explanationIfWrong": "This is a type hierarchy relationship."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A Computer possesses (has) a Processor as an internal component."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-0-v3",
            "question": "Why is composition preferred over massive single classes?",
            "options": [
              {
                "id": "A",
                "text": "It keeps classes focused on a single responsibility and makes components reusable across different parts of the application",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It eliminates the need for Python's garbage collector",
                "explanationIfWrong": "Python manages memory identically for all objects."
              },
              {
                "id": "C",
                "text": "It converts code to JavaScript automatically",
                "explanationIfWrong": "Composition is a universal OOP pattern."
              },
              {
                "id": "D",
                "text": "It bypasses all syntax errors",
                "explanationIfWrong": "Code must always be syntactically valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Breaking complex systems into smaller, cohesive classes improves modularity, maintainability, and testability."
          }
        ]
      },
      {
        "heading": "Accessing Nested Attributes via Chained Dots",
        "text": "When an object contains another object as an attribute, you access the nested object's attributes and methods by chaining dot notation: parent.child.grandchild_attribute. Each dot accesses the attribute on the object yielded by the previous step.",
        "codeSnippet": "class Engine:\n    def __init__(self, horsepower, fuel_type):\n        self.horsepower = horsepower\n        self.fuel_type = fuel_type\n\nclass Car:\n    def __init__(self, make, model, engine):\n        self.make = make\n        self.model = model\n        self.engine = engine\n\nv8 = Engine(450, \"Gasoline\")\nsport_car = Car(\"Ford\", \"Mustang\", v8)\n\n# Chained dot navigation\nprint(f\"Make: {sport_car.make}\")\nprint(f\"Engine HP: {sport_car.engine.horsepower}\")\nprint(f\"Fuel: {sport_car.engine.fuel_type}\")",
        "terminalOutput": "Make: Ford\nEngine HP: 450\nFuel: Gasoline",
        "tip": "If the intermediate attribute (like engine) is None, chaining sport_car.engine.horsepower raises an AttributeError ('NoneType' object has no attribute 'horsepower').",
        "mcq": {
          "id": "q-9-2-composition-objects-as-attributes-1-v1",
          "question": "In sport_car.engine.horsepower, how does Python resolve the expression?",
          "options": [
            {
              "id": "A",
              "text": "It accesses the engine attribute on sport_car, and then accesses the horsepower attribute on that Engine instance",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It searches for a global function named engine",
              "explanationIfWrong": "Dot notation navigates object attributes."
            },
            {
              "id": "C",
              "text": "It merges all three names into a single string",
              "explanationIfWrong": "It evaluates attribute lookups from left to right."
            },
            {
              "id": "D",
              "text": "It executes in reverse order",
              "explanationIfWrong": "Attribute lookup is evaluated left-to-right."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Chained dot lookups evaluate left-to-right, navigating through the nested object references."
        },
        "retestMcq": {
          "id": "q-9-2-composition-objects-as-attributes-1-v2",
          "question": "What error occurs if sport_car.engine is None and you attempt sport_car.engine.horsepower?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: 'NoneType' object has no attribute 'horsepower'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "NullPointerException",
              "explanationIfWrong": "Python raises AttributeError, not NullPointerException."
            },
            {
              "id": "C",
              "text": "ValueError",
              "explanationIfWrong": "Accessing missing attributes on objects raises AttributeError."
            },
            {
              "id": "D",
              "text": "It returns 0",
              "explanationIfWrong": "Python does not provide silent default values for missing attributes."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Attempting to access attributes on None triggers AttributeError: 'NoneType' object has no attribute."
        },
        "questionPool": [
          {
            "id": "q-9-2-composition-objects-as-attributes-1-v1",
            "question": "In sport_car.engine.horsepower, how does Python resolve the expression?",
            "options": [
              {
                "id": "A",
                "text": "It accesses the engine attribute on sport_car, and then accesses the horsepower attribute on that Engine instance",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It searches for a global function named engine",
                "explanationIfWrong": "Dot notation navigates object attributes."
              },
              {
                "id": "C",
                "text": "It merges all three names into a single string",
                "explanationIfWrong": "It evaluates attribute lookups from left to right."
              },
              {
                "id": "D",
                "text": "It executes in reverse order",
                "explanationIfWrong": "Attribute lookup is evaluated left-to-right."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Chained dot lookups evaluate left-to-right, navigating through the nested object references."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-1-v2",
            "question": "What error occurs if sport_car.engine is None and you attempt sport_car.engine.horsepower?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: 'NoneType' object has no attribute 'horsepower'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "NullPointerException",
                "explanationIfWrong": "Python raises AttributeError, not NullPointerException."
              },
              {
                "id": "C",
                "text": "ValueError",
                "explanationIfWrong": "Accessing missing attributes on objects raises AttributeError."
              },
              {
                "id": "D",
                "text": "It returns 0",
                "explanationIfWrong": "Python does not provide silent default values for missing attributes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Attempting to access attributes on None triggers AttributeError: 'NoneType' object has no attribute."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-1-v3",
            "question": "Can nested attributes be updated directly via chained assignment (sport_car.engine.horsepower = 500)?",
            "options": [
              {
                "id": "A",
                "text": "Yes, standard assignment updates the attribute on the nested Engine object directly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, nested attributes are permanently read-only",
                "explanationIfWrong": "Mutable objects can have their attributes updated through any reference."
              },
              {
                "id": "C",
                "text": "Only if the class has a setter method",
                "explanationIfWrong": "Python allows direct attribute assignment unless explicitly restricted."
              },
              {
                "id": "D",
                "text": "Only if using copy.copy()",
                "explanationIfWrong": "Direct modification operates on the live in-memory instance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "sport_car.engine returns the mutable Engine instance, allowing direct assignment to its attributes."
          }
        ]
      },
      {
        "heading": "Method Delegation",
        "text": "Method delegation occurs when an outer class provides a method that forwards work to one of its inner component objects. The outer class exposes a clean, high-level interface to callers while delegating the low-level details to its child object.",
        "codeSnippet": "class Printer:\n    def print_document(self, text):\n        return f\"[PHYSICAL PRINT]: {text}\"\n\nclass OfficeWorkstation:\n    def __init__(self, user, printer):\n        self.user = user\n        self.printer = printer\n    \n    # Delegating method\n    def print_report(self, title, content):\n        payload = f\"Report: {title} (Author: {self.user})\\n{content}\"\n        # Delegate to the printer component!\n        return self.printer.print_document(payload)\n\nhp = Printer()\nws = OfficeWorkstation(\"Elena\", hp)\noutput = ws.print_report(\"Q3 Sales\", \"Revenue up 24%\")\nprint(output)",
        "terminalOutput": "[PHYSICAL PRINT]: Report: Q3 Sales (Author: Elena)\nRevenue up 24%",
        "tip": "Delegation shields callers from knowing the internal details of how components interact (the Law of Demeter).",
        "mcq": {
          "id": "q-9-2-composition-objects-as-attributes-2-v1",
          "question": "What is method delegation in object-oriented programming?",
          "options": [
            {
              "id": "A",
              "text": "A method on an outer object calling a method on an internal component object to perform an action",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Deleting a method at runtime",
              "explanationIfWrong": "Delegation is forwarding work to a child object."
            },
            {
              "id": "C",
              "text": "Copying a class to another file",
              "explanationIfWrong": "It is an architectural interaction pattern."
            },
            {
              "id": "D",
              "text": "Executing code in parallel using threads",
              "explanationIfWrong": "Delegation is standard method forwarding."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The outer class delegates responsibility for a task to its internal child component."
        },
        "retestMcq": {
          "id": "q-9-2-composition-objects-as-attributes-2-v2",
          "question": "What is the primary advantage of delegating via ws.print_report() rather than requiring users to manually call ws.printer.print_document()?",
          "options": [
            {
              "id": "A",
              "text": "It encapsulates the printer details, meaning if the workstation switches to a CloudPrinter later, callers don't need to change their code",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It cuts RAM consumption by half",
              "explanationIfWrong": "Delegation has minimal impact on memory; the benefit is loose coupling."
            },
            {
              "id": "C",
              "text": "It prevents users from using printers",
              "explanationIfWrong": "It provides a cleaner way to use printers."
            },
            {
              "id": "D",
              "text": "It requires fewer CPU cycles",
              "explanationIfWrong": "The primary benefit is maintainability and loose coupling."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Delegation provides loose coupling, allowing internal implementation changes without breaking external callers."
        },
        "questionPool": [
          {
            "id": "q-9-2-composition-objects-as-attributes-2-v1",
            "question": "What is method delegation in object-oriented programming?",
            "options": [
              {
                "id": "A",
                "text": "A method on an outer object calling a method on an internal component object to perform an action",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Deleting a method at runtime",
                "explanationIfWrong": "Delegation is forwarding work to a child object."
              },
              {
                "id": "C",
                "text": "Copying a class to another file",
                "explanationIfWrong": "It is an architectural interaction pattern."
              },
              {
                "id": "D",
                "text": "Executing code in parallel using threads",
                "explanationIfWrong": "Delegation is standard method forwarding."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The outer class delegates responsibility for a task to its internal child component."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-2-v2",
            "question": "What is the primary advantage of delegating via ws.print_report() rather than requiring users to manually call ws.printer.print_document()?",
            "options": [
              {
                "id": "A",
                "text": "It encapsulates the printer details, meaning if the workstation switches to a CloudPrinter later, callers don't need to change their code",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It cuts RAM consumption by half",
                "explanationIfWrong": "Delegation has minimal impact on memory; the benefit is loose coupling."
              },
              {
                "id": "C",
                "text": "It prevents users from using printers",
                "explanationIfWrong": "It provides a cleaner way to use printers."
              },
              {
                "id": "D",
                "text": "It requires fewer CPU cycles",
                "explanationIfWrong": "The primary benefit is maintainability and loose coupling."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Delegation provides loose coupling, allowing internal implementation changes without breaking external callers."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-2-v3",
            "question": "Which design principle recommends that an object should only talk to its immediate collaborators rather than reaching deep into nested structures?",
            "options": [
              {
                "id": "A",
                "text": "Law of Demeter (Principle of Least Knowledge)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Moore's Law",
                "explanationIfWrong": "Moore's Law relates to transistor density in hardware."
              },
              {
                "id": "C",
                "text": "Archimedes' Principle",
                "explanationIfWrong": "Archimedes' Principle is about buoyancy in physics."
              },
              {
                "id": "D",
                "text": "Heisenberg's Uncertainty Principle",
                "explanationIfWrong": "That is a quantum physics principle."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Law of Demeter states that a module should not know about the innards of the objects it manipulates."
          }
        ]
      },
      {
        "heading": "Aggregation vs Composition Lifecycles",
        "text": "While both involve storing objects as attributes, their lifecycles distinguish them: in strict Composition, the child object is created by and bound to the lifetime of the parent (e.g., a Room exists only as part of a House). In Aggregation, the child object exists independently and can be shared among multiple parents (e.g., a Professor teaches at a University, but exists independently of it).",
        "codeSnippet": "class Battery:\n    def __init__(self, capacity_mah=4000):\n        self.capacity_mah = capacity_mah\n\nclass SmartPhone:\n    # Strict Composition: phone instantiates its own dedicated battery\n    def __init__(self, model):\n        self.model = model\n        self.battery = Battery(5000)\n\nclass Headset:\n    # Aggregation: accepts an already-existing shared audio source\n    def __init__(self, brand, audio_source):\n        self.brand = brand\n        self.source = audio_source\n\nphone = SmartPhone(\"Pixel 9\")\nheadset = Headset(\"Sony\", phone)\nprint(f\"Headset connected to: {headset.source.model} with {headset.source.battery.capacity_mah}mAh battery\")",
        "terminalOutput": "Headset connected to: Pixel 9 with 5000mAh battery",
        "tip": "Use aggregation when components can be swapped or shared (dependency injection); use composition when the child object has no meaning outside the parent.",
        "mcq": {
          "id": "q-9-2-composition-objects-as-attributes-3-v1",
          "question": "What is the key lifecycle distinction between strict Composition and Aggregation?",
          "options": [
            {
              "id": "A",
              "text": "In composition, the child object's lifecycle is bound to the parent; in aggregation, the child can exist independently of the parent",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Composition is for numbers; aggregation is for strings",
              "explanationIfWrong": "Both apply to objects and classes."
            },
            {
              "id": "C",
              "text": "Aggregation is banned in Python 3",
              "explanationIfWrong": "Aggregation is a standard OOP pattern."
            },
            {
              "id": "D",
              "text": "Composition requires database storage",
              "explanationIfWrong": "Both are in-memory design relationships."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Composition implies ownership and shared lifecycle; aggregation implies a weaker reference association."
        },
        "retestMcq": {
          "id": "q-9-2-composition-objects-as-attributes-3-v2",
          "question": "Passing a pre-existing DatabaseConnection into a UserRepository constructor is an example of which pattern?",
          "options": [
            {
              "id": "A",
              "text": "Aggregation / Dependency Injection",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Strict Composition",
              "explanationIfWrong": "The connection exists independently of the repository."
            },
            {
              "id": "C",
              "text": "Multiple Inheritance",
              "explanationIfWrong": "No inheritance is taking place."
            },
            {
              "id": "D",
              "text": "Monkey Patching",
              "explanationIfWrong": "Passing dependencies via constructor is clean dependency injection."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The DatabaseConnection exists independently of UserRepository and is passed in (aggregation / dependency injection)."
        },
        "questionPool": [
          {
            "id": "q-9-2-composition-objects-as-attributes-3-v1",
            "question": "What is the key lifecycle distinction between strict Composition and Aggregation?",
            "options": [
              {
                "id": "A",
                "text": "In composition, the child object's lifecycle is bound to the parent; in aggregation, the child can exist independently of the parent",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Composition is for numbers; aggregation is for strings",
                "explanationIfWrong": "Both apply to objects and classes."
              },
              {
                "id": "C",
                "text": "Aggregation is banned in Python 3",
                "explanationIfWrong": "Aggregation is a standard OOP pattern."
              },
              {
                "id": "D",
                "text": "Composition requires database storage",
                "explanationIfWrong": "Both are in-memory design relationships."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Composition implies ownership and shared lifecycle; aggregation implies a weaker reference association."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-3-v2",
            "question": "Passing a pre-existing DatabaseConnection into a UserRepository constructor is an example of which pattern?",
            "options": [
              {
                "id": "A",
                "text": "Aggregation / Dependency Injection",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Strict Composition",
                "explanationIfWrong": "The connection exists independently of the repository."
              },
              {
                "id": "C",
                "text": "Multiple Inheritance",
                "explanationIfWrong": "No inheritance is taking place."
              },
              {
                "id": "D",
                "text": "Monkey Patching",
                "explanationIfWrong": "Passing dependencies via constructor is clean dependency injection."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The DatabaseConnection exists independently of UserRepository and is passed in (aggregation / dependency injection)."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-3-v3",
            "question": "If a SmartPhone object creates its own internal Battery inside __init__ (self.battery = Battery()), what happens when the phone is garbage collected?",
            "options": [
              {
                "id": "A",
                "text": "The Battery instance is also garbage collected because no other references to it exist",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The Battery remains permanently in RAM forever",
                "explanationIfWrong": "When reference count drops to zero, Python reclaims memory."
              },
              {
                "id": "C",
                "text": "The Battery is saved to disk",
                "explanationIfWrong": "Garbage collection frees RAM; it doesn't write to disk."
              },
              {
                "id": "D",
                "text": "Python raises an OrphanError",
                "explanationIfWrong": "Unreferenced objects are freed silently."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "With composition, when the owner is collected, unreferenced child components are collected as well."
          }
        ]
      },
      {
        "heading": "Multi-Tiered Domain Hierarchies",
        "text": "Enterprise systems build hierarchies of collaborating objects. For example, an Order contains a list of OrderItem instances, and each OrderItem references a Product instance along with a quantity and discount.",
        "codeSnippet": "class Product:\n    def __init__(self, name, unit_price):\n        self.name = name\n        self.unit_price = float(unit_price)\n\nclass OrderItem:\n    def __init__(self, product, quantity):\n        self.product = product  # references Product object\n        self.quantity = int(quantity)\n    \n    def subtotal(self):\n        return self.product.unit_price * self.quantity\n\nclass Order:\n    def __init__(self, order_id):\n        self.order_id = order_id\n        self.items = []\n    \n    def add_item(self, product, quantity):\n        self.items.append(OrderItem(product, quantity))\n    \n    def total(self):\n        return sum(item.subtotal() for item in self.items)\n\np1 = Product(\"Monitor\", 200.0)\np2 = Product(\"HDMI Cable\", 15.0)\n\norder = Order(\"ORD-101\")\norder.add_item(p1, 2)  # 2 * 200 = 400\norder.add_item(p2, 3)  # 3 * 15 = 45\n\nprint(f\"Order {order.order_id} Total: ${order.total():.2f}\")",
        "terminalOutput": "Order ORD-101 Total: $445.00",
        "tip": "Notice how calculation responsibility is distributed: Order sums items; OrderItem multiplies unit_price by quantity; Product defines price.",
        "mcq": {
          "id": "q-9-2-composition-objects-as-attributes-4-v1",
          "question": "In the multi-tiered Order system, which class is responsible for calculating item.product.unit_price * item.quantity?",
          "options": [
            {
              "id": "A",
              "text": "OrderItem via its subtotal() method",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Product",
              "explanationIfWrong": "Product only knows its own unit price, not the quantity ordered."
            },
            {
              "id": "C",
              "text": "Order",
              "explanationIfWrong": "Order simply sums item.subtotal() for all items."
            },
            {
              "id": "D",
              "text": "The Python math module",
              "explanationIfWrong": "Business logic is encapsulated in the domain model."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "OrderItem pairs a product with an order quantity, so it naturally calculates subtotal."
        },
        "retestMcq": {
          "id": "q-9-2-composition-objects-as-attributes-4-v2",
          "question": "If the price of p1 (Monitor) is updated to $220.00 before order.total() is called, what is the new total?",
          "options": [
            {
              "id": "A",
              "text": "$485.00 (2 * 220 + 3 * 15)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "$445.00",
              "explanationIfWrong": "OrderItem references the live Product object; changing price immediately affects the calculation."
            },
            {
              "id": "C",
              "text": "Raises an error",
              "explanationIfWrong": "Reference lookups evaluate current attribute values dynamically."
            },
            {
              "id": "D",
              "text": "$220.00",
              "explanationIfWrong": "Both items are included."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because OrderItem holds a reference to the live Product instance, reading its price dynamically reflects the update."
        },
        "questionPool": [
          {
            "id": "q-9-2-composition-objects-as-attributes-4-v1",
            "question": "In the multi-tiered Order system, which class is responsible for calculating item.product.unit_price * item.quantity?",
            "options": [
              {
                "id": "A",
                "text": "OrderItem via its subtotal() method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Product",
                "explanationIfWrong": "Product only knows its own unit price, not the quantity ordered."
              },
              {
                "id": "C",
                "text": "Order",
                "explanationIfWrong": "Order simply sums item.subtotal() for all items."
              },
              {
                "id": "D",
                "text": "The Python math module",
                "explanationIfWrong": "Business logic is encapsulated in the domain model."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "OrderItem pairs a product with an order quantity, so it naturally calculates subtotal."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-4-v2",
            "question": "If the price of p1 (Monitor) is updated to $220.00 before order.total() is called, what is the new total?",
            "options": [
              {
                "id": "A",
                "text": "$485.00 (2 * 220 + 3 * 15)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "$445.00",
                "explanationIfWrong": "OrderItem references the live Product object; changing price immediately affects the calculation."
              },
              {
                "id": "C",
                "text": "Raises an error",
                "explanationIfWrong": "Reference lookups evaluate current attribute values dynamically."
              },
              {
                "id": "D",
                "text": "$220.00",
                "explanationIfWrong": "Both items are included."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because OrderItem holds a reference to the live Product instance, reading its price dynamically reflects the update."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-4-v3",
            "question": "Can multiple different OrderItem objects across different orders reference the same Product instance?",
            "options": [
              {
                "id": "A",
                "text": "Yes, multiple OrderItem instances can reference the exact same Product object in memory",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, a Product can only belong to one OrderItem at a time",
                "explanationIfWrong": "Many objects can hold references to the same product."
              },
              {
                "id": "C",
                "text": "Only if cloned with deepcopy",
                "explanationIfWrong": "Sharing reference to catalog data is standard practice."
              },
              {
                "id": "D",
                "text": "Only in multi-threaded code",
                "explanationIfWrong": "Reference sharing works in all Python code."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Shared domain entities (like products in a catalog) are routinely referenced by multiple orders."
          }
        ]
      },
      {
        "heading": "String Representations in Composed Objects",
        "text": "When building composed structures, implementing __str__ on child objects allows parent objects to build comprehensive string representations effortlessly.",
        "codeSnippet": "class CPU:\n    def __init__(self, brand, cores):\n        self.brand = brand\n        self.cores = cores\n    def __str__(self):\n        return f\"{self.brand} ({self.cores} cores)\"\n\nclass Laptop:\n    def __init__(self, model, cpu):\n        self.model = model\n        self.cpu = cpu\n    def __str__(self):\n        # Seamlessly incorporates child's __str__\n        return f\"Laptop: {self.model} with {self.cpu}\"\n\nl = Laptop(\"ZenBook Pro\", CPU(\"AMD Ryzen 9\", 16))\nprint(l)",
        "terminalOutput": "Laptop: ZenBook Pro with AMD Ryzen 9 (16 cores)",
        "tip": "F-strings automatically invoke the child object's __str__ method when interpolated (f\"{self.cpu}\").",
        "mcq": {
          "id": "q-9-2-composition-objects-as-attributes-5-v1",
          "question": "What happens when you interpolate a child object inside a parent's f-string (f\"... {self.cpu}\")?",
          "options": [
            {
              "id": "A",
              "text": "Python automatically invokes str(self.cpu), which calls the child's __str__ method",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It prints the raw hex memory address of self.cpu",
              "explanationIfWrong": "If __str__ is defined on CPU, it executes and prints the formatted string."
            },
            {
              "id": "C",
              "text": "It deletes the CPU object",
              "explanationIfWrong": "Formatting reads data without modifying objects."
            },
            {
              "id": "D",
              "text": "It raises a TypeError",
              "explanationIfWrong": "All objects support string conversion."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "F-strings automatically call __str__ on interpolated objects, allowing recursive formatting of composed hierarchies."
        },
        "retestMcq": {
          "id": "q-9-2-composition-objects-as-attributes-5-v2",
          "question": "What is printed if CPU does NOT define __str__ or __repr__?",
          "options": [
            {
              "id": "A",
              "text": "Laptop: ZenBook Pro with <__main__.CPU object at 0x...>",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "An empty string",
              "explanationIfWrong": "Default object representation includes class name and memory address."
            },
            {
              "id": "C",
              "text": "A crash with AttributeError",
              "explanationIfWrong": "Python falls back to object.__repr__ rather than crashing."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "The default representation is converted to string."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without custom formatting, Python falls back to the default object representation showing type and memory address."
        },
        "questionPool": [
          {
            "id": "q-9-2-composition-objects-as-attributes-5-v1",
            "question": "What happens when you interpolate a child object inside a parent's f-string (f\"... {self.cpu}\")?",
            "options": [
              {
                "id": "A",
                "text": "Python automatically invokes str(self.cpu), which calls the child's __str__ method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It prints the raw hex memory address of self.cpu",
                "explanationIfWrong": "If __str__ is defined on CPU, it executes and prints the formatted string."
              },
              {
                "id": "C",
                "text": "It deletes the CPU object",
                "explanationIfWrong": "Formatting reads data without modifying objects."
              },
              {
                "id": "D",
                "text": "It raises a TypeError",
                "explanationIfWrong": "All objects support string conversion."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "F-strings automatically call __str__ on interpolated objects, allowing recursive formatting of composed hierarchies."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-5-v2",
            "question": "What is printed if CPU does NOT define __str__ or __repr__?",
            "options": [
              {
                "id": "A",
                "text": "Laptop: ZenBook Pro with <__main__.CPU object at 0x...>",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "An empty string",
                "explanationIfWrong": "Default object representation includes class name and memory address."
              },
              {
                "id": "C",
                "text": "A crash with AttributeError",
                "explanationIfWrong": "Python falls back to object.__repr__ rather than crashing."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "The default representation is converted to string."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without custom formatting, Python falls back to the default object representation showing type and memory address."
          },
          {
            "id": "q-9-2-composition-objects-as-attributes-5-v3",
            "question": "Why is composing string representations better than having Laptop manually format CPU's attributes (f\"{self.cpu.brand} ({self.cpu.cores} cores)\")?",
            "options": [
              {
                "id": "A",
                "text": "It respects encapsulation: CPU owns the knowledge of how to format itself, preventing duplicate formatting logic",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It compiles faster in the Python bytecode interpreter",
                "explanationIfWrong": "The benefit is clean architecture and DRY code."
              },
              {
                "id": "C",
                "text": "It is required by PEP 8",
                "explanationIfWrong": "It is an object-oriented design principle (encapsulation)."
              },
              {
                "id": "D",
                "text": "Direct attribute formatting is illegal",
                "explanationIfWrong": "Direct access works, but violates encapsulation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Letting child classes format themselves ensures that if CPU adds a frequency attribute later, only CPU.__str__ needs updating."
          }
        ]
      }
    ]
  },
  {
    "id": "9-3-encapsulation-data-protection",
    "number": "9.3",
    "title": "Encapsulation & Data Protection",
    "subtitle": "Protect object state and communicate API boundaries using public attributes, _protected conventions, and __mangled private attributes.",
    "readTime": "20 min",
    "objectives": [
      "Understand the core principle of encapsulation in object-oriented architecture",
      "Recognize default public attribute accessibility in Python",
      "Adopt the single-underscore convention (_attribute) for non-public internal members",
      "Understand double-underscore (__attribute) name mangling mechanisms",
      "Inspect mangled attributes dynamically (_ClassName__attribute)",
      "Embrace Python's philosophy: 'We are all consenting adults here'"
    ],
    "theoryBlocks": [
      {
        "heading": "The Principle of Encapsulation",
        "text": "Encapsulation is the practice of bundling data (attributes) and the methods that operate on that data into a single unit (class), while restricting direct outside access to some of the object's internal components. This prevents external code from putting the object into an invalid state and allows the internal implementation to change without breaking external callers.",
        "codeSnippet": "class SafeVault:\n    def __init__(self, initial_code):\n        # Internal secret state\n        self._secret_code = str(initial_code)\n        self._is_unlocked = False\n    \n    def unlock(self, entered_code):\n        if entered_code == self._secret_code:\n            self._is_unlocked = True\n            return \"Vault unlocked!\"\n        return \"Access denied: incorrect code.\"\n    \n    def is_secure(self):\n        return not self._is_unlocked\n\nvault = SafeVault(\"9876\")\nprint(vault.unlock(\"1234\"))\nprint(vault.unlock(\"9876\"))\nprint(f\"Vault secure? {vault.is_secure()}\")",
        "terminalOutput": "Access denied: incorrect code.\nVault unlocked!\nVault secure? False",
        "tip": "Encapsulation ensures that callers interact through defined methods (like unlock()), rather than directly modifying raw boolean flags from the outside.",
        "mcq": {
          "id": "q-9-3-encapsulation-data-protection-0-v1",
          "question": "What is the primary objective of encapsulation in object-oriented design?",
          "options": [
            {
              "id": "A",
              "text": "To bundle data with its behaviors and protect internal state from unauthorized or invalid external changes",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To compile Python scripts into encrypted binaries",
              "explanationIfWrong": "Encapsulation is a software architecture principle, not encryption."
            },
            {
              "id": "C",
              "text": "To make all attributes accessible to any file on the operating system",
              "explanationIfWrong": "Encapsulation restricts and governs access, rather than opening it globally."
            },
            {
              "id": "D",
              "text": "To delete variables when they are no longer in scope",
              "explanationIfWrong": "Garbage collection handles memory cleanup."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Encapsulation protects object integrity by restricting direct attribute access and providing controlled method interfaces."
        },
        "retestMcq": {
          "id": "q-9-3-encapsulation-data-protection-0-v2",
          "question": "What risk arises if external code directly modifies an object's internal data (e.g. vault._is_unlocked = True)?",
          "options": [
            {
              "id": "A",
              "text": "It bypasses validation logic, password checks, and audit logging, potentially leaving the object in a corrupt or insecure state",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python shuts down immediately with a fatal OS error",
              "explanationIfWrong": "Python permits attribute assignment unless guarded."
            },
            {
              "id": "C",
              "text": "The entire file is overwritten with empty bytes",
              "explanationIfWrong": "File storage is not affected."
            },
            {
              "id": "D",
              "text": "No risk exists; direct modification is the recommended design pattern",
              "explanationIfWrong": "Direct modification of internal state is a major anti-pattern."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Bypassing method interfaces undermines validation, invariants, and system reliability."
        },
        "questionPool": [
          {
            "id": "q-9-3-encapsulation-data-protection-0-v1",
            "question": "What is the primary objective of encapsulation in object-oriented design?",
            "options": [
              {
                "id": "A",
                "text": "To bundle data with its behaviors and protect internal state from unauthorized or invalid external changes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To compile Python scripts into encrypted binaries",
                "explanationIfWrong": "Encapsulation is a software architecture principle, not encryption."
              },
              {
                "id": "C",
                "text": "To make all attributes accessible to any file on the operating system",
                "explanationIfWrong": "Encapsulation restricts and governs access, rather than opening it globally."
              },
              {
                "id": "D",
                "text": "To delete variables when they are no longer in scope",
                "explanationIfWrong": "Garbage collection handles memory cleanup."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Encapsulation protects object integrity by restricting direct attribute access and providing controlled method interfaces."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-0-v2",
            "question": "What risk arises if external code directly modifies an object's internal data (e.g. vault._is_unlocked = True)?",
            "options": [
              {
                "id": "A",
                "text": "It bypasses validation logic, password checks, and audit logging, potentially leaving the object in a corrupt or insecure state",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python shuts down immediately with a fatal OS error",
                "explanationIfWrong": "Python permits attribute assignment unless guarded."
              },
              {
                "id": "C",
                "text": "The entire file is overwritten with empty bytes",
                "explanationIfWrong": "File storage is not affected."
              },
              {
                "id": "D",
                "text": "No risk exists; direct modification is the recommended design pattern",
                "explanationIfWrong": "Direct modification of internal state is a major anti-pattern."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Bypassing method interfaces undermines validation, invariants, and system reliability."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-0-v3",
            "question": "Which of the following best defines an object's 'public interface'?",
            "options": [
              {
                "id": "A",
                "text": "The collection of public methods and attributes intended for callers outside the class to interact with",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The HTML web page generated by the Python interpreter",
                "explanationIfWrong": "Public interface refers to code APIs."
              },
              {
                "id": "C",
                "text": "A list of all global variables in the file",
                "explanationIfWrong": "Global variables are not part of an object's interface."
              },
              {
                "id": "D",
                "text": "The bytecode disassembled by dis()",
                "explanationIfWrong": "Bytecode is internal to the compiler."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An object's public interface consists of the documented methods and properties meant for client consumption."
          }
        ]
      },
      {
        "heading": "The Single Underscore (_attribute) Convention",
        "text": "Unlike C++ or Java which enforce private access at compile time, Python indicates internal attributes via a widely accepted naming convention: prefixing the attribute name with a single leading underscore (_name). This signals to other developers and IDEs: 'This attribute is internal implementation detail; do not touch it directly outside the class.'",
        "codeSnippet": "class BankCard:\n    def __init__(self, card_number, pin):\n        self.card_number = card_number  # Public attribute\n        self._pin = pin                # Internal/protected attribute by convention\n    \n    def verify_pin(self, entered_pin):\n        return entered_pin == self._pin\n\ncard = BankCard(\"4111-2222-3333-4444\", \"1234\")\nprint(f\"Card Number (Public): {card.card_number}\")\nprint(f\"PIN Verified: {card.verify_pin('1234')}\")\n# Direct access is syntactically possible, but strongly discouraged:\nprint(f\"Direct internal access (discouraged): {card._pin}\")",
        "terminalOutput": "Card Number (Public): 4111-2222-3333-4444\nPIN Verified: True\nDirect internal access (discouraged): 1234",
        "tip": "Python linters and IDEs (like PyCharm or VS Code) will warn you with a diagnostic inspection if you attempt to access a _single_underscore attribute from outside its class.",
        "mcq": {
          "id": "q-9-3-encapsulation-data-protection-1-v1",
          "question": "In Python, what does a single leading underscore on an attribute name (e.g. self._balance) signify?",
          "options": [
            {
              "id": "A",
              "text": "It is a convention indicating that the attribute is internal/protected and should not be accessed directly by external code",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The Python compiler physically prevents any access to the attribute",
              "explanationIfWrong": "Single underscore is a convention, not a hard compiler barrier."
            },
            {
              "id": "C",
              "text": "The attribute is a constant that cannot be assigned",
              "explanationIfWrong": "Constants use ALL_CAPS in Python."
            },
            {
              "id": "D",
              "text": "The attribute is automatically deleted after 10 seconds",
              "explanationIfWrong": "Underscores do not affect variable lifecycles."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "PEP 8 specifies that a single leading underscore serves as a strong convention marking internal API."
        },
        "retestMcq": {
          "id": "q-9-3-encapsulation-data-protection-1-v2",
          "question": "Can external code technically read or write obj._pin in Python?",
          "options": [
            {
              "id": "A",
              "text": "Yes, Python does not enforce private access; it relies on conventions and developer discipline",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, it raises a PrivateAttributeError",
              "explanationIfWrong": "Python has no PrivateAttributeError; direct access succeeds."
            },
            {
              "id": "C",
              "text": "Only if executed as the root/administrator user",
              "explanationIfWrong": "Python permissions are in-process language conventions."
            },
            {
              "id": "D",
              "text": "Only if imported via C code",
              "explanationIfWrong": "Python code can read it directly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python does not strictly prevent access to _protected members; it trusts developers to respect the convention."
        },
        "questionPool": [
          {
            "id": "q-9-3-encapsulation-data-protection-1-v1",
            "question": "In Python, what does a single leading underscore on an attribute name (e.g. self._balance) signify?",
            "options": [
              {
                "id": "A",
                "text": "It is a convention indicating that the attribute is internal/protected and should not be accessed directly by external code",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The Python compiler physically prevents any access to the attribute",
                "explanationIfWrong": "Single underscore is a convention, not a hard compiler barrier."
              },
              {
                "id": "C",
                "text": "The attribute is a constant that cannot be assigned",
                "explanationIfWrong": "Constants use ALL_CAPS in Python."
              },
              {
                "id": "D",
                "text": "The attribute is automatically deleted after 10 seconds",
                "explanationIfWrong": "Underscores do not affect variable lifecycles."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 specifies that a single leading underscore serves as a strong convention marking internal API."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-1-v2",
            "question": "Can external code technically read or write obj._pin in Python?",
            "options": [
              {
                "id": "A",
                "text": "Yes, Python does not enforce private access; it relies on conventions and developer discipline",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, it raises a PrivateAttributeError",
                "explanationIfWrong": "Python has no PrivateAttributeError; direct access succeeds."
              },
              {
                "id": "C",
                "text": "Only if executed as the root/administrator user",
                "explanationIfWrong": "Python permissions are in-process language conventions."
              },
              {
                "id": "D",
                "text": "Only if imported via C code",
                "explanationIfWrong": "Python code can read it directly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python does not strictly prevent access to _protected members; it trusts developers to respect the convention."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-1-v3",
            "question": "What is the primary benefit of respecting the _underscore convention when using third-party libraries?",
            "options": [
              {
                "id": "A",
                "text": "Internal attributes may be renamed, modified, or removed in future library updates without warning, breaking code that relies on them",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The library author will bill your credit card",
                "explanationIfWrong": "The concern is API stability and breaking changes."
              },
              {
                "id": "C",
                "text": "Your script will be blocked from downloading packages",
                "explanationIfWrong": "It is about runtime stability across updates."
              },
              {
                "id": "D",
                "text": "It slows down CPU clock speeds",
                "explanationIfWrong": "Performance is unaffected."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Libraries only maintain backward compatibility for their public API; internal (_prefixed) attributes can change anytime."
          }
        ]
      },
      {
        "heading": "Double Underscores (__attribute) and Name Mangling",
        "text": "If an attribute name begins with at least two leading underscores (and at most one trailing underscore, e.g. __balance), Python activates a mechanism called Name Mangling. The interpreter automatically renames the attribute internally by prefixing it with _ClassName, transforming __balance into _Account__balance.",
        "codeSnippet": "class Account:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.__balance = balance  # Name-mangled private attribute\n    \n    def get_balance(self):\n        return self.__balance\n\nacc = Account(\"Maya\", 1500)\nprint(f\"Balance via method: ${acc.get_balance()}\")\n\ntry:\n    # Accessing __balance directly raises AttributeError!\n    print(acc.__balance)\nexcept AttributeError as err:\n    print(f\"Direct access caught: {err}\")\n\n# The attribute exists under its mangled name:\nprint(f\"Mangled name: {acc._Account__balance}\")",
        "terminalOutput": "Balance via method: $1500\nDirect access caught: 'Account' object has no attribute '__balance'\nMangled name: 1500",
        "tip": "Name mangling is primarily designed to prevent accidental attribute collisions in subclasses, not as a bulletproof security barrier.",
        "mcq": {
          "id": "q-9-3-encapsulation-data-protection-2-v1",
          "question": "What is Python's name mangling mechanism?",
          "options": [
            {
              "id": "A",
              "text": "The interpreter automatically rewrites any attribute starting with __ to _ClassName__attribute",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "An encryption algorithm that scrambles text using AES-256",
              "explanationIfWrong": "It is an internal symbol rewriting mechanism."
            },
            {
              "id": "C",
              "text": "A garbage collector routine that deletes unused variables",
              "explanationIfWrong": "Name mangling alters identifier names at parse time."
            },
            {
              "id": "D",
              "text": "A tool that converts Python classes into C structs",
              "explanationIfWrong": "It occurs entirely inside the standard Python interpreter."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python prepends _ClassName to double-underscore identifiers (e.g. self.__x becomes self._MyClass__x)."
        },
        "retestMcq": {
          "id": "q-9-3-encapsulation-data-protection-2-v2",
          "question": "What happens if you attempt to access obj.__balance from outside the Account class?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: 'Account' object has no attribute '__balance'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It returns None",
              "explanationIfWrong": "Because the attribute was renamed to _Account__balance, __balance does not exist."
            },
            {
              "id": "C",
              "text": "It returns the balance value normally",
              "explanationIfWrong": "Direct access fails due to name mangling."
            },
            {
              "id": "D",
              "text": "SyntaxError",
              "explanationIfWrong": "It is valid syntax, but fails at runtime with AttributeError."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because Python renamed the attribute to _Account__balance, looking up __balance directly raises an AttributeError."
        },
        "questionPool": [
          {
            "id": "q-9-3-encapsulation-data-protection-2-v1",
            "question": "What is Python's name mangling mechanism?",
            "options": [
              {
                "id": "A",
                "text": "The interpreter automatically rewrites any attribute starting with __ to _ClassName__attribute",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "An encryption algorithm that scrambles text using AES-256",
                "explanationIfWrong": "It is an internal symbol rewriting mechanism."
              },
              {
                "id": "C",
                "text": "A garbage collector routine that deletes unused variables",
                "explanationIfWrong": "Name mangling alters identifier names at parse time."
              },
              {
                "id": "D",
                "text": "A tool that converts Python classes into C structs",
                "explanationIfWrong": "It occurs entirely inside the standard Python interpreter."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python prepends _ClassName to double-underscore identifiers (e.g. self.__x becomes self._MyClass__x)."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-2-v2",
            "question": "What happens if you attempt to access obj.__balance from outside the Account class?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: 'Account' object has no attribute '__balance'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It returns None",
                "explanationIfWrong": "Because the attribute was renamed to _Account__balance, __balance does not exist."
              },
              {
                "id": "C",
                "text": "It returns the balance value normally",
                "explanationIfWrong": "Direct access fails due to name mangling."
              },
              {
                "id": "D",
                "text": "SyntaxError",
                "explanationIfWrong": "It is valid syntax, but fails at runtime with AttributeError."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because Python renamed the attribute to _Account__balance, looking up __balance directly raises an AttributeError."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-2-v3",
            "question": "Can you still access a mangled attribute if you explicitly use its mangled name (obj._Account__balance)?",
            "options": [
              {
                "id": "A",
                "text": "Yes, Python mangling is obfuscation, not cryptographically secure access prevention",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, accessing mangled names is forbidden by the operating system",
                "explanationIfWrong": "Mangled attributes can still be accessed via their transformed name."
              },
              {
                "id": "C",
                "text": "Only from inside a C extension",
                "explanationIfWrong": "Standard Python code can read _Account__balance."
              },
              {
                "id": "D",
                "text": "Only if decorated with @override",
                "explanationIfWrong": "No decorators are needed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Name mangling is intended to prevent accidental naming collisions in subclasses, not to enforce absolute security."
          }
        ]
      },
      {
        "heading": "Why Name Mangling Exists: Subclass Collisions",
        "text": "The primary real-world purpose of name mangling is inheritance safety. When a subclass inherits from a base class, both might innocently define an attribute named __id or __status. Without name mangling, the child class would overwrite the parent class's attribute. With name mangling, _Parent__id and _Child__id coexist peacefully without collision.",
        "codeSnippet": "class Vehicle:\n    def __init__(self):\n        self.__id = \"VEHICLE-01\"  # Becomes _Vehicle__id\n    \n    def get_vehicle_id(self):\n        return self.__id\n\nclass Airplane(Vehicle):\n    def __init__(self):\n        super().__init__()\n        self.__id = \"PLANE-999\"   # Becomes _Airplane__id; does NOT overwrite parent!\n    \n    def get_airplane_id(self):\n        return self.__id\n\njet = Airplane()\nprint(f\"Vehicle ID:  {jet.get_vehicle_id()}\")\nprint(f\"Airplane ID: {jet.get_airplane_id()}\")\nprint(f\"Instance dictionary: {jet.__dict__}\")",
        "terminalOutput": "Vehicle ID:  VEHICLE-01\nAirplane ID: PLANE-999\nInstance dictionary: {'_Vehicle__id': 'VEHICLE-01', '_Airplane__id': 'PLANE-999'}",
        "tip": "Name mangling gives each class in an inheritance hierarchy its own private namespace for double-underscore attributes.",
        "mcq": {
          "id": "q-9-3-encapsulation-data-protection-3-v1",
          "question": "What is the primary architectural purpose of double-underscore name mangling in Python?",
          "options": [
            {
              "id": "A",
              "text": "To prevent name collisions between parent classes and subclasses when both use identical attribute names",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To make variables run in kernel mode",
              "explanationIfWrong": "It has no connection to OS kernel mode."
            },
            {
              "id": "C",
              "text": "To automatically convert variables into floats",
              "explanationIfWrong": "Variable types are unaffected."
            },
            {
              "id": "D",
              "text": "To hide code from decompilers",
              "explanationIfWrong": "Python bytecode retains the mangled symbols."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Name mangling prefixes the class name, allowing parent and child classes to use the same private variable name safely."
        },
        "retestMcq": {
          "id": "q-9-3-encapsulation-data-protection-3-v2",
          "question": "In the Airplane example above, how many attributes are stored in jet.__dict__?",
          "options": [
            {
              "id": "A",
              "text": "Two distinct attributes: '_Vehicle__id' and '_Airplane__id'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "One attribute named '__id'",
              "explanationIfWrong": "Both are renamed to include their respective class names."
            },
            {
              "id": "C",
              "text": "Zero, because private attributes are stored on disk",
              "explanationIfWrong": "Attributes reside in the instance's __dict__."
            },
            {
              "id": "D",
              "text": "Four attributes",
              "explanationIfWrong": "There are exactly two entries in the dictionary."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because of name mangling, each class gets its own unique key in the instance's __dict__."
        },
        "questionPool": [
          {
            "id": "q-9-3-encapsulation-data-protection-3-v1",
            "question": "What is the primary architectural purpose of double-underscore name mangling in Python?",
            "options": [
              {
                "id": "A",
                "text": "To prevent name collisions between parent classes and subclasses when both use identical attribute names",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To make variables run in kernel mode",
                "explanationIfWrong": "It has no connection to OS kernel mode."
              },
              {
                "id": "C",
                "text": "To automatically convert variables into floats",
                "explanationIfWrong": "Variable types are unaffected."
              },
              {
                "id": "D",
                "text": "To hide code from decompilers",
                "explanationIfWrong": "Python bytecode retains the mangled symbols."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Name mangling prefixes the class name, allowing parent and child classes to use the same private variable name safely."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-3-v2",
            "question": "In the Airplane example above, how many attributes are stored in jet.__dict__?",
            "options": [
              {
                "id": "A",
                "text": "Two distinct attributes: '_Vehicle__id' and '_Airplane__id'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "One attribute named '__id'",
                "explanationIfWrong": "Both are renamed to include their respective class names."
              },
              {
                "id": "C",
                "text": "Zero, because private attributes are stored on disk",
                "explanationIfWrong": "Attributes reside in the instance's __dict__."
              },
              {
                "id": "D",
                "text": "Four attributes",
                "explanationIfWrong": "There are exactly two entries in the dictionary."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because of name mangling, each class gets its own unique key in the instance's __dict__."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-3-v3",
            "question": "Does PEP 8 recommend using double underscores (__var) for everyday private attributes?",
            "options": [
              {
                "id": "A",
                "text": "No, PEP 8 recommends a single underscore (_var) for regular internal attributes, reserving double underscores (__var) only to avoid subclass collisions",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, all private variables must always have at least two underscores",
                "explanationIfWrong": "Single underscore is the standard PEP 8 convention."
              },
              {
                "id": "C",
                "text": "PEP 8 recommends four underscores",
                "explanationIfWrong": "Four underscores is not a Python convention."
              },
              {
                "id": "D",
                "text": "PEP 8 forbids all underscores in attribute names",
                "explanationIfWrong": "Underscores are fundamental to Python naming conventions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 states: 'Use one leading underscore only for non-public methods and instance variables. Use two leading underscores only when naming conflicts in subclasses could arise.'"
          }
        ]
      },
      {
        "heading": "'We Are All Consenting Adults Here'",
        "text": "A famous motto in the Python community coined by Guido van Rossum is: 'We are all consenting adults here.' It means Python does not erect ironclad compiler walls to prevent programmers from accessing internals. Instead, it relies on clear conventions, documentation, and mutual trust. If a developer deliberately touches _private attributes, they are consenting to bear the risk of breakage.",
        "codeSnippet": "class Engine:\n    def __init__(self):\n        self._temperature = 90  # Internal state\n    \n    def get_status(self):\n        return \"Normal\" if self._temperature < 105 else \"Overheating\"\n\ne = Engine()\n# A consenting adult can inspect or tweak internals for debugging or testing:\nprint(f\"Current internal temp: {e._temperature}\u00b0C\")\ne._temperature = 115  # Forcing state in a unit test\nprint(f\"Status during test: {e.get_status()}\")",
        "terminalOutput": "Current internal temp: 90\u00b0C\nStatus during test: Overheating",
        "tip": "Python's openness makes writing unit tests, mocking components, and interactive debugging dramatically simpler than in rigid languages.",
        "mcq": {
          "id": "q-9-3-encapsulation-data-protection-4-v1",
          "question": "What is the meaning behind the Python philosophy 'We are all consenting adults here'?",
          "options": [
            {
              "id": "A",
              "text": "Python uses conventions (_name) rather than hard enforcement, trusting developers to make informed choices while allowing internal access when necessary (e.g. testing)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python requires users to be at least 18 years old to write code",
              "explanationIfWrong": "It is a software philosophy regarding language design, not human age."
            },
            {
              "id": "C",
              "text": "All Python programs must be licensed for enterprise use",
              "explanationIfWrong": "Python is free and open-source."
            },
            {
              "id": "D",
              "text": "Classes cannot inherit from other classes without user consent",
              "explanationIfWrong": "Inheritance is a standard feature."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python prioritizes transparency and developer trust over artificial compiler barriers."
        },
        "retestMcq": {
          "id": "q-9-3-encapsulation-data-protection-4-v2",
          "question": "Why is Python's convention-based visibility particularly advantageous in automated testing?",
          "options": [
            {
              "id": "A",
              "text": "Test runners can inspect and mock internal states directly without needing complex reflection or friend classes",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Tests execute 1000x faster than in other languages",
              "explanationIfWrong": "Speed is comparable; the benefit is simplicity and inspectability."
            },
            {
              "id": "C",
              "text": "Tests write themselves automatically",
              "explanationIfWrong": "Developers still write tests."
            },
            {
              "id": "D",
              "text": "It bypasses the need for test assertions",
              "explanationIfWrong": "Assertions are still required."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Being able to inspect internal attributes simplifies testing edge cases without boilerplate."
        },
        "questionPool": [
          {
            "id": "q-9-3-encapsulation-data-protection-4-v1",
            "question": "What is the meaning behind the Python philosophy 'We are all consenting adults here'?",
            "options": [
              {
                "id": "A",
                "text": "Python uses conventions (_name) rather than hard enforcement, trusting developers to make informed choices while allowing internal access when necessary (e.g. testing)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python requires users to be at least 18 years old to write code",
                "explanationIfWrong": "It is a software philosophy regarding language design, not human age."
              },
              {
                "id": "C",
                "text": "All Python programs must be licensed for enterprise use",
                "explanationIfWrong": "Python is free and open-source."
              },
              {
                "id": "D",
                "text": "Classes cannot inherit from other classes without user consent",
                "explanationIfWrong": "Inheritance is a standard feature."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python prioritizes transparency and developer trust over artificial compiler barriers."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-4-v2",
            "question": "Why is Python's convention-based visibility particularly advantageous in automated testing?",
            "options": [
              {
                "id": "A",
                "text": "Test runners can inspect and mock internal states directly without needing complex reflection or friend classes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Tests execute 1000x faster than in other languages",
                "explanationIfWrong": "Speed is comparable; the benefit is simplicity and inspectability."
              },
              {
                "id": "C",
                "text": "Tests write themselves automatically",
                "explanationIfWrong": "Developers still write tests."
              },
              {
                "id": "D",
                "text": "It bypasses the need for test assertions",
                "explanationIfWrong": "Assertions are still required."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Being able to inspect internal attributes simplifies testing edge cases without boilerplate."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-4-v3",
            "question": "What responsibility does a developer assume when accessing an attribute prefixed with a single underscore (_attr)?",
            "options": [
              {
                "id": "A",
                "text": "They accept that the author may change or remove that attribute in future releases without maintaining backward compatibility",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They must pay royalties to the library author",
                "explanationIfWrong": "No royalties are involved."
              },
              {
                "id": "C",
                "text": "They must rewrite their code in C",
                "explanationIfWrong": "Code remains in Python."
              },
              {
                "id": "D",
                "text": "None, the author guarantees it will never change",
                "explanationIfWrong": "Internal attributes have no stability guarantees."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Accessing private internals means accepting the maintenance risk if the library changes its internal implementation."
          }
        ]
      },
      {
        "heading": "Getter and Setter Methods: The Traditional Approach",
        "text": "In languages like Java, developers write explicit getter and setter methods (get_balance() and set_balance(value)) for every attribute to enforce validation. In Python, this traditional pattern works, but it can make code verbose. Understanding this pattern sets the stage for Python's elegant @property decorator.",
        "codeSnippet": "class LegacyAccount:\n    def __init__(self, owner, balance):\n        self._owner = owner\n        self._balance = 0.0\n        self.set_balance(balance)  # Use setter to validate initial value\n    \n    def get_balance(self):\n        return self._balance\n    \n    def set_balance(self, value):\n        if value < 0:\n            raise ValueError(\"Balance cannot be negative.\")\n        self._balance = float(value)\n\nacc = LegacyAccount(\"Devon\", 250)\nprint(f\"Balance: ${acc.get_balance():.2f}\")\nacc.set_balance(400)\nprint(f\"Updated: ${acc.get_balance():.2f}\")",
        "terminalOutput": "Balance: $250.00\nUpdated: $400.00",
        "tip": "While get_x() and set_x() work, Python developers prefer using the @property decorator so callers can use natural dot notation (acc.balance = 400).",
        "mcq": {
          "id": "q-9-3-encapsulation-data-protection-5-v1",
          "question": "What is the primary role of a setter method like set_balance(value)?",
          "options": [
            {
              "id": "A",
              "text": "To validate incoming data and enforce invariants before writing to the internal attribute",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To print the balance to the terminal",
              "explanationIfWrong": "Setters write data; print displays data."
            },
            {
              "id": "C",
              "text": "To delete the attribute from memory",
              "explanationIfWrong": "Deleters remove attributes."
            },
            {
              "id": "D",
              "text": "To encrypt the account number",
              "explanationIfWrong": "Setters validate and store attributes."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Setters act as gatekeepers, validating inputs (e.g. checking value >= 0) before modifying internal state."
        },
        "retestMcq": {
          "id": "q-9-3-encapsulation-data-protection-5-v2",
          "question": "Why is writing get_x() and set_x() for every single attribute considered un-Pythonic?",
          "options": [
            {
              "id": "A",
              "text": "Python supports the @property decorator, allowing you to start with plain attributes and add validation later without breaking the public dot-notation syntax",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python's compiler refuses to compile functions starting with get_",
              "explanationIfWrong": "get_ methods are completely legal, just verbose."
            },
            {
              "id": "C",
              "text": "get_ methods take 10x more memory",
              "explanationIfWrong": "Memory overhead is minimal; the issue is idiom and readability."
            },
            {
              "id": "D",
              "text": "PEP 8 bans the word 'get'",
              "explanationIfWrong": "PEP 8 does not ban words."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, you can expose public attributes directly and transparently upgrade them to @property if validation is needed later."
        },
        "questionPool": [
          {
            "id": "q-9-3-encapsulation-data-protection-5-v1",
            "question": "What is the primary role of a setter method like set_balance(value)?",
            "options": [
              {
                "id": "A",
                "text": "To validate incoming data and enforce invariants before writing to the internal attribute",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To print the balance to the terminal",
                "explanationIfWrong": "Setters write data; print displays data."
              },
              {
                "id": "C",
                "text": "To delete the attribute from memory",
                "explanationIfWrong": "Deleters remove attributes."
              },
              {
                "id": "D",
                "text": "To encrypt the account number",
                "explanationIfWrong": "Setters validate and store attributes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Setters act as gatekeepers, validating inputs (e.g. checking value >= 0) before modifying internal state."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-5-v2",
            "question": "Why is writing get_x() and set_x() for every single attribute considered un-Pythonic?",
            "options": [
              {
                "id": "A",
                "text": "Python supports the @property decorator, allowing you to start with plain attributes and add validation later without breaking the public dot-notation syntax",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python's compiler refuses to compile functions starting with get_",
                "explanationIfWrong": "get_ methods are completely legal, just verbose."
              },
              {
                "id": "C",
                "text": "get_ methods take 10x more memory",
                "explanationIfWrong": "Memory overhead is minimal; the issue is idiom and readability."
              },
              {
                "id": "D",
                "text": "PEP 8 bans the word 'get'",
                "explanationIfWrong": "PEP 8 does not ban words."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, you can expose public attributes directly and transparently upgrade them to @property if validation is needed later."
          },
          {
            "id": "q-9-3-encapsulation-data-protection-5-v3",
            "question": "What happens if acc.set_balance(-100) is called on the LegacyAccount class above?",
            "options": [
              {
                "id": "A",
                "text": "Raises a ValueError('Balance cannot be negative.') and preserves the existing balance",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Sets the balance to -$100.00",
                "explanationIfWrong": "The validation check blocks negative numbers."
              },
              {
                "id": "C",
                "text": "Sets balance to 0",
                "explanationIfWrong": "An exception is raised instead of silent coercion."
              },
              {
                "id": "D",
                "text": "Returns None without error",
                "explanationIfWrong": "An explicit ValueError is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The validation guard clause raises a ValueError immediately before assignment can occur."
          }
        ]
      }
    ]
  },
  {
    "id": "9-4-properties-getters-setters",
    "number": "9.4",
    "title": "Properties (Getters & Setters)",
    "subtitle": "Use @property and @setter decorators to combine the syntax of attributes with the control of methods.",
    "readTime": "20 min",
    "objectives": [
      "Use the @property decorator to define getter methods accessed like plain attributes",
      "Define setter methods with @property_name.setter to intercept and validate assignments",
      "Create read-only properties by omitting the setter decorator",
      "Calculate derived properties dynamically on access (e.g. area, full_name)",
      "Implement property deletion with @property_name.deleter",
      "Refactor existing public attributes into validated properties with zero breaking changes"
    ],
    "theoryBlocks": [
      {
        "heading": "The @property Decorator",
        "text": "The @property decorator transforms an instance method into a getter that is accessed using standard attribute syntax (obj.attribute) rather than method syntax (obj.attribute()). This allows you to expose clean, natural attribute access while running code behind the scenes whenever the value is read.",
        "codeSnippet": "class Circle:\n    def __init__(self, radius):\n        self.radius = float(radius)\n    \n    # @property creates a getter\n    @property\n    def diameter(self):\n        return self.radius * 2\n\nc = Circle(5)\nprint(f\"Radius: {c.radius}\")\n# Accessed as an attribute, NOT c.diameter()!\nprint(f\"Diameter: {c.diameter}\")",
        "terminalOutput": "Radius: 5.0\nDiameter: 10.0",
        "tip": "Never call a property with parentheses (c.diameter()). Doing so raises a TypeError: 'float' object is not callable.",
        "mcq": {
          "id": "q-9-4-properties-getters-setters-0-v1",
          "question": "How do callers access a method decorated with @property?",
          "options": [
            {
              "id": "A",
              "text": "Using standard attribute dot notation without parentheses: obj.property_name",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Calling it with parentheses: obj.property_name()",
              "explanationIfWrong": "Calling a property with parentheses raises a TypeError."
            },
            {
              "id": "C",
              "text": "Using array indexing: obj['property_name']",
              "explanationIfWrong": "Indexing is for subscriptable mapping types."
            },
            {
              "id": "D",
              "text": "Using getattr(obj())",
              "explanationIfWrong": "Standard dot notation obj.attr works directly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "@property turns a method into a getter accessed without parentheses like a normal attribute."
        },
        "retestMcq": {
          "id": "q-9-4-properties-getters-setters-0-v2",
          "question": "What error occurs if you call a property with parentheses (e.g. c.diameter() when diameter returns 10.0)?",
          "options": [
            {
              "id": "A",
              "text": "TypeError: 'float' object is not callable",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "SyntaxError",
              "explanationIfWrong": "The syntax is valid; at runtime you are attempting to call the returned float."
            },
            {
              "id": "C",
              "text": "AttributeError",
              "explanationIfWrong": "The attribute exists, but the returned value is not a callable."
            },
            {
              "id": "D",
              "text": "It returns None",
              "explanationIfWrong": "A TypeError is raised."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since c.diameter evaluates to the float 10.0, adding () attempts to call 10.0(), raising a TypeError."
        },
        "questionPool": [
          {
            "id": "q-9-4-properties-getters-setters-0-v1",
            "question": "How do callers access a method decorated with @property?",
            "options": [
              {
                "id": "A",
                "text": "Using standard attribute dot notation without parentheses: obj.property_name",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Calling it with parentheses: obj.property_name()",
                "explanationIfWrong": "Calling a property with parentheses raises a TypeError."
              },
              {
                "id": "C",
                "text": "Using array indexing: obj['property_name']",
                "explanationIfWrong": "Indexing is for subscriptable mapping types."
              },
              {
                "id": "D",
                "text": "Using getattr(obj())",
                "explanationIfWrong": "Standard dot notation obj.attr works directly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "@property turns a method into a getter accessed without parentheses like a normal attribute."
          },
          {
            "id": "q-9-4-properties-getters-setters-0-v2",
            "question": "What error occurs if you call a property with parentheses (e.g. c.diameter() when diameter returns 10.0)?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: 'float' object is not callable",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "SyntaxError",
                "explanationIfWrong": "The syntax is valid; at runtime you are attempting to call the returned float."
              },
              {
                "id": "C",
                "text": "AttributeError",
                "explanationIfWrong": "The attribute exists, but the returned value is not a callable."
              },
              {
                "id": "D",
                "text": "It returns None",
                "explanationIfWrong": "A TypeError is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since c.diameter evaluates to the float 10.0, adding () attempts to call 10.0(), raising a TypeError."
          },
          {
            "id": "q-9-4-properties-getters-setters-0-v3",
            "question": "What does @property return when applied to a method inside a class?",
            "options": [
              {
                "id": "A",
                "text": "A property descriptor object that manages getter and setter dispatch",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A string containing the method's name",
                "explanationIfWrong": "It creates a descriptor object."
              },
              {
                "id": "C",
                "text": "A C pointer to the GPU",
                "explanationIfWrong": "Descriptors are standard Python objects implementing __get__."
              },
              {
                "id": "D",
                "text": "A new subclass",
                "explanationIfWrong": "It creates a property descriptor on the class."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, property is a built-in type implementing the descriptor protocol (__get__, __set__, __delete__)."
          }
        ]
      },
      {
        "heading": "The @name.setter Decorator",
        "text": "To allow callers to assign values to a property using standard assignment syntax (obj.attribute = value), you define a setter method with the same name decorated with @name.setter. The setter method accepts self and the incoming value, giving you complete power to validate or transform data before saving it.",
        "codeSnippet": "class Temperature:\n    def __init__(self, celsius=0.0):\n        # Uses setter directly for validation\n        self.celsius = celsius\n    \n    @property\n    def celsius(self):\n        return self._celsius\n    \n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(\"Temperature cannot be below absolute zero (-273.15\u00b0C)!\")\n        self._celsius = float(value)\n\nt = Temperature(25)\nprint(f\"Temp: {t.celsius}\u00b0C\")\nt.celsius = 100  # Invokes the setter transparently\nprint(f\"Boiling: {t.celsius}\u00b0C\")\n\ntry:\n    t.celsius = -300  # Caught by validation!\nexcept ValueError as err:\n    print(f\"Rejected: {err}\")",
        "terminalOutput": "Temp: 25.0\u00b0C\nBoiling: 100.0\u00b0C\nRejected: Temperature cannot be below absolute zero (-273.15\u00b0C)!",
        "tip": "Notice how inside __init__, writing self.celsius = celsius automatically triggers the @celsius.setter method, ensuring validation runs upon object creation!",
        "mcq": {
          "id": "q-9-4-properties-getters-setters-1-v1",
          "question": "How do you define a setter for a property named price?",
          "options": [
            {
              "id": "A",
              "text": "@price.setter followed by def price(self, value):",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "@setter followed by def set_price(self, value):",
              "explanationIfWrong": "The decorator must be @property_name.setter and the method must share the property name."
            },
            {
              "id": "C",
              "text": "@property(set=True) def price(self):",
              "explanationIfWrong": "That is not valid Python property syntax."
            },
            {
              "id": "D",
              "text": "def set_price(self):",
              "explanationIfWrong": "Plain methods do not intercept dot-notation assignments."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python requires @name.setter, where name matches the getter property method name."
        },
        "retestMcq": {
          "id": "q-9-4-properties-getters-setters-1-v2",
          "question": "What happens when executing t.celsius = 100 on the Temperature instance above?",
          "options": [
            {
              "id": "A",
              "text": "Python intercepts the assignment and executes the @celsius.setter method, passing 100 as value",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The property method is replaced with the integer 100",
              "explanationIfWrong": "The property descriptor intercepts assignment; it is not overwritten."
            },
            {
              "id": "C",
              "text": "An AttributeError is raised",
              "explanationIfWrong": "Because a setter is defined, assignment succeeds."
            },
            {
              "id": "D",
              "text": "It creates a global variable named celsius",
              "explanationIfWrong": "It executes the setter method on the instance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The property descriptor delegates assignments to the method decorated with @name.setter."
        },
        "questionPool": [
          {
            "id": "q-9-4-properties-getters-setters-1-v1",
            "question": "How do you define a setter for a property named price?",
            "options": [
              {
                "id": "A",
                "text": "@price.setter followed by def price(self, value):",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "@setter followed by def set_price(self, value):",
                "explanationIfWrong": "The decorator must be @property_name.setter and the method must share the property name."
              },
              {
                "id": "C",
                "text": "@property(set=True) def price(self):",
                "explanationIfWrong": "That is not valid Python property syntax."
              },
              {
                "id": "D",
                "text": "def set_price(self):",
                "explanationIfWrong": "Plain methods do not intercept dot-notation assignments."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python requires @name.setter, where name matches the getter property method name."
          },
          {
            "id": "q-9-4-properties-getters-setters-1-v2",
            "question": "What happens when executing t.celsius = 100 on the Temperature instance above?",
            "options": [
              {
                "id": "A",
                "text": "Python intercepts the assignment and executes the @celsius.setter method, passing 100 as value",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The property method is replaced with the integer 100",
                "explanationIfWrong": "The property descriptor intercepts assignment; it is not overwritten."
              },
              {
                "id": "C",
                "text": "An AttributeError is raised",
                "explanationIfWrong": "Because a setter is defined, assignment succeeds."
              },
              {
                "id": "D",
                "text": "It creates a global variable named celsius",
                "explanationIfWrong": "It executes the setter method on the instance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The property descriptor delegates assignments to the method decorated with @name.setter."
          },
          {
            "id": "q-9-4-properties-getters-setters-1-v3",
            "question": "Why is the internal backing attribute typically named with a leading underscore (self._celsius) inside property getters and setters?",
            "options": [
              {
                "id": "A",
                "text": "To avoid infinite recursion; writing self.celsius inside the setter would trigger the setter again forever",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python forbids storing variables without underscores",
                "explanationIfWrong": "Standard variables have no underscore requirement."
              },
              {
                "id": "C",
                "text": "Because underscores make floating point numbers more accurate",
                "explanationIfWrong": "Underscores are identifier naming characters."
              },
              {
                "id": "D",
                "text": "It is required by the operating system kernel",
                "explanationIfWrong": "It prevents infinite recursion loops in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "If you wrote self.celsius = value inside celsius.setter, it would call itself recursively until a RecursionError."
          }
        ]
      },
      {
        "heading": "Read-Only Properties",
        "text": "If you define a getter with @property but DO NOT define a corresponding @name.setter, the property becomes strictly read-only. Any attempt by external callers to assign to the property raises an AttributeError.",
        "codeSnippet": "class User:\n    def __init__(self, user_id, username):\n        self._user_id = user_id\n        self.username = username\n    \n    # Read-only property: no setter defined\n    @property\n    def user_id(self):\n        return self._user_id\n\nu = User(1042, \"ada_lovelace\")\nprint(f\"User ID: {u.user_id}\")\n\ntry:\n    # Attempting to reassign raises AttributeError\n    u.user_id = 9999\nexcept AttributeError as err:\n    print(f\"Assignment blocked: {err}\")",
        "terminalOutput": "User ID: 1042\nAssignment blocked: property 'user_id' of 'User' object has no setter",
        "tip": "Use read-only properties for immutable identifiers, creation timestamps, and values that must never change after instantiation.",
        "mcq": {
          "id": "q-9-4-properties-getters-setters-2-v1",
          "question": "What happens if a caller attempts to assign to a property that has no @name.setter defined?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: property 'name' of 'Class' object has no setter",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The assignment silently succeeds",
              "explanationIfWrong": "Python actively blocks assignment and raises an AttributeError."
            },
            {
              "id": "C",
              "text": "The object is deleted from memory",
              "explanationIfWrong": "An exception is raised; the object remains intact."
            },
            {
              "id": "D",
              "text": "The value becomes None",
              "explanationIfWrong": "No assignment occurs."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Properties without a setter are read-only; attempting to assign to them raises an AttributeError."
        },
        "retestMcq": {
          "id": "q-9-4-properties-getters-setters-2-v2",
          "question": "How do you create a read-only attribute in Python?",
          "options": [
            {
              "id": "A",
              "text": "Define a method decorated with @property and omit any @name.setter decorator",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Declare the attribute with const x = 5",
              "explanationIfWrong": "Python does not have a const keyword."
            },
            {
              "id": "C",
              "text": "Wrap the class in a tuple",
              "explanationIfWrong": "Tuples are sequences, not classes."
            },
            {
              "id": "D",
              "text": "Set the file permission to read-only in the OS",
              "explanationIfWrong": "Read-only properties are enforced via @property in code."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "An un-setted @property is the standard Python mechanism for creating read-only attributes."
        },
        "questionPool": [
          {
            "id": "q-9-4-properties-getters-setters-2-v1",
            "question": "What happens if a caller attempts to assign to a property that has no @name.setter defined?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: property 'name' of 'Class' object has no setter",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The assignment silently succeeds",
                "explanationIfWrong": "Python actively blocks assignment and raises an AttributeError."
              },
              {
                "id": "C",
                "text": "The object is deleted from memory",
                "explanationIfWrong": "An exception is raised; the object remains intact."
              },
              {
                "id": "D",
                "text": "The value becomes None",
                "explanationIfWrong": "No assignment occurs."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Properties without a setter are read-only; attempting to assign to them raises an AttributeError."
          },
          {
            "id": "q-9-4-properties-getters-setters-2-v2",
            "question": "How do you create a read-only attribute in Python?",
            "options": [
              {
                "id": "A",
                "text": "Define a method decorated with @property and omit any @name.setter decorator",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Declare the attribute with const x = 5",
                "explanationIfWrong": "Python does not have a const keyword."
              },
              {
                "id": "C",
                "text": "Wrap the class in a tuple",
                "explanationIfWrong": "Tuples are sequences, not classes."
              },
              {
                "id": "D",
                "text": "Set the file permission to read-only in the OS",
                "explanationIfWrong": "Read-only properties are enforced via @property in code."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An un-setted @property is the standard Python mechanism for creating read-only attributes."
          },
          {
            "id": "q-9-4-properties-getters-setters-2-v3",
            "question": "Can methods inside the class still modify the internal backing attribute (_user_id) of a read-only property?",
            "options": [
              {
                "id": "A",
                "text": "Yes, methods can still read and write directly to self._user_id",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, once @property is used, all internal writes are blocked forever",
                "explanationIfWrong": "The backing attribute remains a standard instance variable."
              },
              {
                "id": "C",
                "text": "Only in the __del__ method",
                "explanationIfWrong": "Any method on the class can access self._user_id."
              },
              {
                "id": "D",
                "text": "Only if unlocked with a password",
                "explanationIfWrong": "Internal access is unrestricted."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The property descriptor only intercepts access via the property name (user_id); internal methods can freely access _user_id."
          }
        ]
      },
      {
        "heading": "Dynamic Computed Properties",
        "text": "Properties can compute values on demand from other attributes without storing redundant copies. This guarantees complete consistency: if the underlying attributes change, the property immediately reflects the new calculation without risk of data drift.",
        "codeSnippet": "class Employee:\n    def __init__(self, first_name, last_name, monthly_salary):\n        self.first_name = first_name\n        self.last_name = last_name\n        self.monthly_salary = float(monthly_salary)\n    \n    @property\n    def full_name(self):\n        return f\"{self.first_name} {self.last_name}\"\n    \n    @property\n    def annual_salary(self):\n        return self.monthly_salary * 12\n\nemp = Employee(\"Grace\", \"Hopper\", 8000)\nprint(f\"Employee: {emp.full_name}, Annual: ${emp.annual_salary:,.2f}\")\n\n# Updating underlying state automatically updates computed properties!\nemp.last_name = \"Murray Hopper\"\nemp.monthly_salary = 9500\nprint(f\"Updated:  {emp.full_name}, Annual: ${emp.annual_salary:,.2f}\")",
        "terminalOutput": "Employee: Grace Hopper, Annual: $96,000.00\nUpdated:  Grace Murray Hopper, Annual: $114,000.00",
        "tip": "Computed properties eliminate synchronization bugs where full_name falls out of sync with first_name or last_name.",
        "mcq": {
          "id": "q-9-4-properties-getters-setters-3-v1",
          "question": "What is the primary advantage of computing annual_salary via a @property rather than storing it as self.annual_salary in __init__?",
          "options": [
            {
              "id": "A",
              "text": "It always computes the current value dynamically, avoiding stale data if monthly_salary is updated later",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It speeds up calculations by 500%",
              "explanationIfWrong": "Performance is identical; the win is data synchronization."
            },
            {
              "id": "C",
              "text": "It stores the salary on a blockchain",
              "explanationIfWrong": "It calculates in Python RAM."
            },
            {
              "id": "D",
              "text": "It prevents the salary from ever being viewed",
              "explanationIfWrong": "Properties expose values cleanly for viewing."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dynamic properties eliminate redundant state and synchronization bugs."
        },
        "retestMcq": {
          "id": "q-9-4-properties-getters-setters-3-v2",
          "question": "If emp.last_name is changed from 'Hopper' to 'Murray Hopper', what does emp.full_name return on the next call?",
          "options": [
            {
              "id": "A",
              "text": "'Grace Murray Hopper', dynamically recomputed on access",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "'Grace Hopper', because properties are cached permanently at startup",
              "explanationIfWrong": "Standard properties re-execute their getter on each access."
            },
            {
              "id": "C",
              "text": "None",
              "explanationIfWrong": "The getter evaluates and returns the new string."
            },
            {
              "id": "D",
              "text": "Raises an OutOfSyncError",
              "explanationIfWrong": "No error occurs."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Every time you read emp.full_name, the getter function executes afresh, using the latest attribute values."
        },
        "questionPool": [
          {
            "id": "q-9-4-properties-getters-setters-3-v1",
            "question": "What is the primary advantage of computing annual_salary via a @property rather than storing it as self.annual_salary in __init__?",
            "options": [
              {
                "id": "A",
                "text": "It always computes the current value dynamically, avoiding stale data if monthly_salary is updated later",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It speeds up calculations by 500%",
                "explanationIfWrong": "Performance is identical; the win is data synchronization."
              },
              {
                "id": "C",
                "text": "It stores the salary on a blockchain",
                "explanationIfWrong": "It calculates in Python RAM."
              },
              {
                "id": "D",
                "text": "It prevents the salary from ever being viewed",
                "explanationIfWrong": "Properties expose values cleanly for viewing."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dynamic properties eliminate redundant state and synchronization bugs."
          },
          {
            "id": "q-9-4-properties-getters-setters-3-v2",
            "question": "If emp.last_name is changed from 'Hopper' to 'Murray Hopper', what does emp.full_name return on the next call?",
            "options": [
              {
                "id": "A",
                "text": "'Grace Murray Hopper', dynamically recomputed on access",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'Grace Hopper', because properties are cached permanently at startup",
                "explanationIfWrong": "Standard properties re-execute their getter on each access."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "The getter evaluates and returns the new string."
              },
              {
                "id": "D",
                "text": "Raises an OutOfSyncError",
                "explanationIfWrong": "No error occurs."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Every time you read emp.full_name, the getter function executes afresh, using the latest attribute values."
          },
          {
            "id": "q-9-4-properties-getters-setters-3-v3",
            "question": "Can a computed property have a setter that unpacks data (e.g. assigning emp.full_name = 'Alan Turing' to update first and last names)?",
            "options": [
              {
                "id": "A",
                "text": "Yes, a @full_name.setter can split the input string and update self.first_name and self.last_name",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, computed properties can never have setters",
                "explanationIfWrong": "Any property can have a setter as long as you write the logic."
              },
              {
                "id": "C",
                "text": "Only if both names are less than 5 characters",
                "explanationIfWrong": "There is no length restriction."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Setters on computed properties are standard in all modern Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A setter can parse incoming compound values and distribute updates to underlying attributes."
          }
        ]
      },
      {
        "heading": "Refactoring to Properties Without Breaking APIs",
        "text": "One of Python's greatest design triumphs is that you can start simple with plain public attributes (obj.price). If you later need to add validation, logging, or caching, you can turn price into a @property with a setter \u2014 and external callers never have to change a single line of code!",
        "codeSnippet": "# Version 1: Plain attribute (no boilerplate getters/setters)\n# class Product: self.price = price\n\n# Version 2: Seamlessly refactored to @property when validation became needed:\nclass Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price  # Triggers setter transparently!\n    \n    @property\n    def price(self):\n        return self._price\n    \n    @price.setter\n    def price(self, val):\n        if val <= 0:\n            raise ValueError(\"Price must be greater than zero.\")\n        self._price = round(float(val), 2)\n\n# Existing client code written for Version 1 continues working with ZERO changes:\np = Product(\"Coffee Maker\", 49.99)\np.price = 55.00  # Validated seamlessly!\nprint(f\"Product: {p.name}, Price: ${p.price}\")",
        "terminalOutput": "Product: Coffee Maker, Price: $55.0",
        "tip": "Because of properties, you never need to write preemptive getters and setters in Python 'just in case'. Start with plain attributes and refactor when needed.",
        "mcq": {
          "id": "q-9-4-properties-getters-setters-4-v1",
          "question": "Why is the @property mechanism considered superior to Java-style preemptive getters and setters?",
          "options": [
            {
              "id": "A",
              "text": "You can start with simple public attributes, and seamlessly upgrade to @property with validation later without breaking external callers",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Properties delete the need for unit testing",
              "explanationIfWrong": "Testing is still required."
            },
            {
              "id": "C",
              "text": "Properties compile directly to assembly",
              "explanationIfWrong": "Properties are standard Python descriptors."
            },
            {
              "id": "D",
              "text": "Properties prevent all memory allocations",
              "explanationIfWrong": "Memory management is unchanged."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Properties preserve public syntax (obj.x = 5), making API evolution painless and backward-compatible."
        },
        "retestMcq": {
          "id": "q-9-4-properties-getters-setters-4-v2",
          "question": "If existing client code writes p.price = 30, does that code need to change when Product upgrades price to a @property?",
          "options": [
            {
              "id": "A",
              "text": "No, the syntax remains completely identical; Python transparently routes the assignment through the setter",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Yes, the client must rewrite it to p.set_price(30)",
              "explanationIfWrong": "The beauty of properties is that p.price = 30 syntax is preserved."
            },
            {
              "id": "C",
              "text": "Yes, client code must import the property module",
              "explanationIfWrong": "No imports are required by callers."
            },
            {
              "id": "D",
              "text": "The client must recompile Python",
              "explanationIfWrong": "Properties work dynamically at runtime."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Callers continue using p.price = 30 without knowing or caring that a setter is executing."
        },
        "questionPool": [
          {
            "id": "q-9-4-properties-getters-setters-4-v1",
            "question": "Why is the @property mechanism considered superior to Java-style preemptive getters and setters?",
            "options": [
              {
                "id": "A",
                "text": "You can start with simple public attributes, and seamlessly upgrade to @property with validation later without breaking external callers",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Properties delete the need for unit testing",
                "explanationIfWrong": "Testing is still required."
              },
              {
                "id": "C",
                "text": "Properties compile directly to assembly",
                "explanationIfWrong": "Properties are standard Python descriptors."
              },
              {
                "id": "D",
                "text": "Properties prevent all memory allocations",
                "explanationIfWrong": "Memory management is unchanged."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Properties preserve public syntax (obj.x = 5), making API evolution painless and backward-compatible."
          },
          {
            "id": "q-9-4-properties-getters-setters-4-v2",
            "question": "If existing client code writes p.price = 30, does that code need to change when Product upgrades price to a @property?",
            "options": [
              {
                "id": "A",
                "text": "No, the syntax remains completely identical; Python transparently routes the assignment through the setter",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, the client must rewrite it to p.set_price(30)",
                "explanationIfWrong": "The beauty of properties is that p.price = 30 syntax is preserved."
              },
              {
                "id": "C",
                "text": "Yes, client code must import the property module",
                "explanationIfWrong": "No imports are required by callers."
              },
              {
                "id": "D",
                "text": "The client must recompile Python",
                "explanationIfWrong": "Properties work dynamically at runtime."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Callers continue using p.price = 30 without knowing or caring that a setter is executing."
          },
          {
            "id": "q-9-4-properties-getters-setters-4-v3",
            "question": "What is the recommended Python approach when designing a new class attribute that currently requires no validation?",
            "options": [
              {
                "id": "A",
                "text": "Expose it as a simple public attribute (self.price = price); convert to @property only if validation is required later",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Write get_price() and set_price() immediately just in case",
                "explanationIfWrong": "Preemptive getter/setter methods are considered un-Pythonic."
              },
              {
                "id": "C",
                "text": "Store it in an external text file",
                "explanationIfWrong": "Store attributes in the class instance."
              },
              {
                "id": "D",
                "text": "Prefix it with four underscores",
                "explanationIfWrong": "Four underscores is not a Python convention."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python best practice is to keep code simple with plain attributes until validation is actually needed."
          }
        ]
      },
      {
        "heading": "Deleting Properties with @name.deleter",
        "text": "Just as properties can intercept read and write operations, they can also intercept attribute deletion requests (del obj.attribute) by providing a method decorated with @name.deleter.",
        "codeSnippet": "class CacheEntry:\n    def __init__(self, key, value):\n        self.key = key\n        self._value = value\n    \n    @property\n    def value(self):\n        if self._value is None:\n            raise ValueError(\"Cache entry has been cleared.\")\n        return self._value\n    \n    @value.deleter\n    def value(self):\n        print(f\"Clearing cached value for key '{self.key}'...\")\n        self._value = None\n\nc = CacheEntry(\"user_101\", {\"name\": \"Alice\", \"role\": \"Admin\"})\nprint(f\"Cached: {c.value}\")\n# Triggering the deleter:\ndel c.value\nprint(f\"Internal _value after del: {c._value}\")",
        "terminalOutput": "Cached: {'name': 'Alice', 'role': 'Admin'}\nClearing cached value for key 'user_101'...\nInternal _value after del: None",
        "tip": "Property deleters are useful for releasing resources, clearing cached data, or logging deletions when del obj.prop is executed.",
        "mcq": {
          "id": "q-9-4-properties-getters-setters-5-v1",
          "question": "Which decorator allows a property to intercept the del obj.attribute command?",
          "options": [
            {
              "id": "A",
              "text": "@property_name.deleter",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "@delete_property",
              "explanationIfWrong": "The decorator is @name.deleter."
            },
            {
              "id": "C",
              "text": "@del",
              "explanationIfWrong": "del is a statement, not a decorator."
            },
            {
              "id": "D",
              "text": "@destroy",
              "explanationIfWrong": "The decorator name is deleter."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "@property_name.deleter intercepts calls to del obj.property_name."
        },
        "retestMcq": {
          "id": "q-9-4-properties-getters-setters-5-v2",
          "question": "What happens if a caller executes del obj.prop on a property that has NO deleter defined?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: can't delete attribute",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The entire object is destroyed",
              "explanationIfWrong": "Python blocks deletion of property without deleter."
            },
            {
              "id": "C",
              "text": "The property returns None forever",
              "explanationIfWrong": "An AttributeError is raised immediately."
            },
            {
              "id": "D",
              "text": "The file is deleted",
              "explanationIfWrong": "It affects in-memory attributes only."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without a deleter method, the property descriptor raises AttributeError: can't delete attribute."
        },
        "questionPool": [
          {
            "id": "q-9-4-properties-getters-setters-5-v1",
            "question": "Which decorator allows a property to intercept the del obj.attribute command?",
            "options": [
              {
                "id": "A",
                "text": "@property_name.deleter",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "@delete_property",
                "explanationIfWrong": "The decorator is @name.deleter."
              },
              {
                "id": "C",
                "text": "@del",
                "explanationIfWrong": "del is a statement, not a decorator."
              },
              {
                "id": "D",
                "text": "@destroy",
                "explanationIfWrong": "The decorator name is deleter."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "@property_name.deleter intercepts calls to del obj.property_name."
          },
          {
            "id": "q-9-4-properties-getters-setters-5-v2",
            "question": "What happens if a caller executes del obj.prop on a property that has NO deleter defined?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: can't delete attribute",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The entire object is destroyed",
                "explanationIfWrong": "Python blocks deletion of property without deleter."
              },
              {
                "id": "C",
                "text": "The property returns None forever",
                "explanationIfWrong": "An AttributeError is raised immediately."
              },
              {
                "id": "D",
                "text": "The file is deleted",
                "explanationIfWrong": "It affects in-memory attributes only."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without a deleter method, the property descriptor raises AttributeError: can't delete attribute."
          },
          {
            "id": "q-9-4-properties-getters-setters-5-v3",
            "question": "In the CacheEntry example, what does del c.value do to the internal self._value?",
            "options": [
              {
                "id": "A",
                "text": "Executes the custom deleter logic which sets self._value to None",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Removes the python interpreter from memory",
                "explanationIfWrong": "The deleter method customizes the deletion behavior."
              },
              {
                "id": "C",
                "text": "Raises a KeyError",
                "explanationIfWrong": "The custom deleter executes smoothly."
              },
              {
                "id": "D",
                "text": "Deletes the variable c",
                "explanationIfWrong": "del c.value acts on the property, not the variable c."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The custom deleter executes the defined block, setting self._value to None."
          }
        ]
      }
    ]
  },
  {
    "id": "9-5-class-vs-instance-attributes",
    "number": "9.5",
    "title": "Class vs Instance Attributes",
    "subtitle": "Differentiate shared class-level state from individual instance state, avoid shadowing traps, and use @classmethod.",
    "readTime": "20 min",
    "objectives": [
      "Define class attributes in the class body that are shared across all instances",
      "Contrast class attributes (shared state) with instance attributes (individual state)",
      "Understand attribute shadowing when assigning to self.class_attr",
      "Implement instance counters and registries using class attributes",
      "Define class-level configuration constants and defaults",
      "Create alternative constructors using @classmethod and the cls parameter"
    ],
    "theoryBlocks": [
      {
        "heading": "What is a Class Attribute?",
        "text": "A class attribute is a variable defined directly inside the class body outside of any methods. Unlike instance attributes (which belong to a specific object and are stored in self.__dict__), class attributes belong to the class object itself and are shared by all instances of that class.",
        "codeSnippet": "class Dog:\n    # Class attribute: shared by all dogs\n    species = \"Canis familiaris\"\n    \n    def __init__(self, name):\n        # Instance attribute: unique to each dog\n        self.name = name\n\nd1 = Dog(\"Buddy\")\nd2 = Dog(\"Bella\")\n\nprint(f\"{d1.name} species: {d1.species}\")\nprint(f\"{d2.name} species: {d2.species}\")\nprint(f\"Accessed via class: {Dog.species}\")\nprint(f\"Shared identity? {d1.species is d2.species}\")",
        "terminalOutput": "Buddy species: Canis familiaris\nBella species: Canis familiaris\nAccessed via class: Canis familiaris\nShared identity? True",
        "tip": "Access class attributes via ClassName.attribute (e.g. Dog.species) when reading or modifying them, to make your intent crystal clear.",
        "mcq": {
          "id": "q-9-5-class-vs-instance-attributes-0-v1",
          "question": "What is the defining characteristic of a class attribute in Python?",
          "options": [
            {
              "id": "A",
              "text": "It is defined directly in the class body and its value is shared across all instances of the class",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It can only be accessed using the sys module",
              "explanationIfWrong": "Class attributes are accessed via standard dot notation."
            },
            {
              "id": "C",
              "text": "It is re-instantiated and reset to None for every new object",
              "explanationIfWrong": "Class attributes persist on the class object."
            },
            {
              "id": "D",
              "text": "It is stored on the hard drive rather than RAM",
              "explanationIfWrong": "All Python objects and attributes reside in memory."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Class attributes belong to the class definition itself and are shared by every instance."
        },
        "retestMcq": {
          "id": "q-9-5-class-vs-instance-attributes-0-v2",
          "question": "Where does Python look for an attribute when you evaluate instance.attribute?",
          "options": [
            {
              "id": "A",
              "text": "First in the instance's own __dict__; if not found there, it searches the class's __dict__",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Only in the class's __dict__",
              "explanationIfWrong": "Instance attributes take precedence."
            },
            {
              "id": "C",
              "text": "Only in global variables",
              "explanationIfWrong": "Attributes are looked up on the instance and class hierarchy."
            },
            {
              "id": "D",
              "text": "In the operating system environment",
              "explanationIfWrong": "Lookup follows Python's MRO (Method Resolution Order)."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python searches instance attributes first. If absent on the instance, it falls back to the class attributes."
        },
        "questionPool": [
          {
            "id": "q-9-5-class-vs-instance-attributes-0-v1",
            "question": "What is the defining characteristic of a class attribute in Python?",
            "options": [
              {
                "id": "A",
                "text": "It is defined directly in the class body and its value is shared across all instances of the class",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It can only be accessed using the sys module",
                "explanationIfWrong": "Class attributes are accessed via standard dot notation."
              },
              {
                "id": "C",
                "text": "It is re-instantiated and reset to None for every new object",
                "explanationIfWrong": "Class attributes persist on the class object."
              },
              {
                "id": "D",
                "text": "It is stored on the hard drive rather than RAM",
                "explanationIfWrong": "All Python objects and attributes reside in memory."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Class attributes belong to the class definition itself and are shared by every instance."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-0-v2",
            "question": "Where does Python look for an attribute when you evaluate instance.attribute?",
            "options": [
              {
                "id": "A",
                "text": "First in the instance's own __dict__; if not found there, it searches the class's __dict__",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Only in the class's __dict__",
                "explanationIfWrong": "Instance attributes take precedence."
              },
              {
                "id": "C",
                "text": "Only in global variables",
                "explanationIfWrong": "Attributes are looked up on the instance and class hierarchy."
              },
              {
                "id": "D",
                "text": "In the operating system environment",
                "explanationIfWrong": "Lookup follows Python's MRO (Method Resolution Order)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python searches instance attributes first. If absent on the instance, it falls back to the class attributes."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-0-v3",
            "question": "What is the best practice for accessing a class attribute shared across all instances?",
            "options": [
              {
                "id": "A",
                "text": "Access it directly via the class name (e.g. Dog.species)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Always access it through a local variable",
                "explanationIfWrong": "ClassName.attr is explicit and prevents shadowing bugs."
              },
              {
                "id": "C",
                "text": "Import it from the builtins module",
                "explanationIfWrong": "Class attributes belong to their specific class."
              },
              {
                "id": "D",
                "text": "Pass it as a command-line argument",
                "explanationIfWrong": "Direct class access is standard."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Qualifying with the class name (ClassName.attr) makes it explicit that you are interacting with class-level state."
          }
        ]
      },
      {
        "heading": "The Shadowing Trap",
        "text": "A famous pitfall in Python is attempting to modify a class attribute through an instance (e.g. self.species = 'Canis lupus'). This DOES NOT modify the shared class attribute! Instead, it creates a brand-new instance attribute with that name on that single object, shadowing the class attribute for that instance while leaving all other instances untouched.",
        "codeSnippet": "class Counter:\n    count = 0  # Class attribute\n\nc1 = Counter()\nc2 = Counter()\n\n# THE SHADOWING TRAP:\nc1.count = 42  # Creates instance attribute on c1! DOES NOT update Counter.count!\n\nprint(f\"c1.count:        {c1.count}\")        # 42 (from c1.__dict__)\nprint(f\"c2.count:        {c2.count}\")        # 0  (from Counter.count)\nprint(f\"Counter.count:   {Counter.count}\")   # 0  (unchanged!)\nprint(f\"c1.__dict__:     {c1.__dict__}\")\nprint(f\"c2.__dict__:     {c2.__dict__}\")",
        "terminalOutput": "c1.count:        42\nc2.count:        0\nCounter.count:   0\nc1.__dict__:     {'count': 42}\nc2.__dict__:     {}",
        "warning": "To update a class attribute, ALWAYS assign directly through the class: Counter.count += 1, NOT self.count += 1!",
        "mcq": {
          "id": "q-9-5-class-vs-instance-attributes-1-v1",
          "question": "What happens if you execute c1.count = 42 when count is a class attribute?",
          "options": [
            {
              "id": "A",
              "text": "It creates a new instance attribute named count on c1, shadowing the class attribute without altering Counter.count",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It updates Counter.count so that all other instances also see 42",
              "explanationIfWrong": "Assigning via instance never alters class attributes; it creates an instance attribute."
            },
            {
              "id": "C",
              "text": "It raises an AttributeError: class attribute is immutable",
              "explanationIfWrong": "No error occurs; assignment creates an instance attribute."
            },
            {
              "id": "D",
              "text": "It deletes c2 from memory",
              "explanationIfWrong": "c2 is unaffected."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Instance assignment (c1.attr = val) always writes to the instance's __dict__, shadowing any class attribute of the same name."
        },
        "retestMcq": {
          "id": "q-9-5-class-vs-instance-attributes-1-v2",
          "question": "How must you modify a class attribute so that the update is visible across all instances?",
          "options": [
            {
              "id": "A",
              "text": "Assign to it directly through the class name: ClassName.attribute = new_value",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Assign to it through an instance: self.attribute = new_value",
              "explanationIfWrong": "This causes the shadowing trap."
            },
            {
              "id": "C",
              "text": "Use the global keyword",
              "explanationIfWrong": "global is for module-level variables, not class attributes."
            },
            {
              "id": "D",
              "text": "Reboot the Python runtime",
              "explanationIfWrong": "Assigning via ClassName updates it immediately in memory."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Modifying through ClassName.attribute writes directly to the class's attribute storage."
        },
        "questionPool": [
          {
            "id": "q-9-5-class-vs-instance-attributes-1-v1",
            "question": "What happens if you execute c1.count = 42 when count is a class attribute?",
            "options": [
              {
                "id": "A",
                "text": "It creates a new instance attribute named count on c1, shadowing the class attribute without altering Counter.count",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It updates Counter.count so that all other instances also see 42",
                "explanationIfWrong": "Assigning via instance never alters class attributes; it creates an instance attribute."
              },
              {
                "id": "C",
                "text": "It raises an AttributeError: class attribute is immutable",
                "explanationIfWrong": "No error occurs; assignment creates an instance attribute."
              },
              {
                "id": "D",
                "text": "It deletes c2 from memory",
                "explanationIfWrong": "c2 is unaffected."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Instance assignment (c1.attr = val) always writes to the instance's __dict__, shadowing any class attribute of the same name."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-1-v2",
            "question": "How must you modify a class attribute so that the update is visible across all instances?",
            "options": [
              {
                "id": "A",
                "text": "Assign to it directly through the class name: ClassName.attribute = new_value",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Assign to it through an instance: self.attribute = new_value",
                "explanationIfWrong": "This causes the shadowing trap."
              },
              {
                "id": "C",
                "text": "Use the global keyword",
                "explanationIfWrong": "global is for module-level variables, not class attributes."
              },
              {
                "id": "D",
                "text": "Reboot the Python runtime",
                "explanationIfWrong": "Assigning via ClassName updates it immediately in memory."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Modifying through ClassName.attribute writes directly to the class's attribute storage."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-1-v3",
            "question": "What is in c2.__dict__ in the Counter example above?",
            "options": [
              {
                "id": "A",
                "text": "{}, an empty dictionary because c2 has no instance attributes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "{'count': 0}",
                "explanationIfWrong": "count is stored on the class, not in c2's instance dictionary."
              },
              {
                "id": "C",
                "text": "{'count': 42}",
                "explanationIfWrong": "42 was set only on c1."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "__dict__ is a dictionary."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "c2 has set no instance attributes, so its __dict__ is empty; lookups fall through to the class."
          }
        ]
      },
      {
        "heading": "Tracking Instances with Class Counters",
        "text": "A classic use case for class attributes is tracking metrics across all instances of a class, such as counting how many active instances have been created or maintaining a registry of unique IDs.",
        "codeSnippet": "class Robot:\n    # Class-level counters\n    population = 0\n    \n    def __init__(self, name):\n        self.name = name\n        # Increment shared class counter\n        Robot.population += 1\n        self.serial_number = f\"ROBOT-{Robot.population:04d}\"\n    \n    def decommission(self):\n        Robot.population -= 1\n        print(f\"{self.name} decommissioned. Remaining: {Robot.population}\")\n\nr1 = Robot(\"Optimus\")\nr2 = Robot(\"Bumblebee\")\nr3 = Robot(\"Megatron\")\n\nprint(f\"Total robots created: {Robot.population}\")\nprint(f\"r2 serial: {r2.serial_number}\")\nr3.decommission()\nprint(f\"Current active population: {Robot.population}\")",
        "terminalOutput": "Total robots created: 3\nr2 serial: ROBOT-0002\nMegatron decommissioned. Remaining: 2\nCurrent active population: 2",
        "tip": "Class attributes provide a shared memory space for instances to coordinate without needing external global variables.",
        "mcq": {
          "id": "q-9-5-class-vs-instance-attributes-2-v1",
          "question": "Why is Robot.population += 1 written inside __init__ rather than self.population += 1?",
          "options": [
            {
              "id": "A",
              "text": "Robot.population += 1 correctly modifies the shared class attribute; self.population += 1 would create an instance variable shadow",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "self.population is forbidden by Python",
              "explanationIfWrong": "self.population += 1 is syntactically allowed, but causes the shadowing bug."
            },
            {
              "id": "C",
              "text": "Robot is a global keyword",
              "explanationIfWrong": "Robot is the identifier of the class."
            },
            {
              "id": "D",
              "text": "self can only hold strings",
              "explanationIfWrong": "self attributes can be any type."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Explicitly referencing Robot.population modifies the shared class attribute directly."
        },
        "retestMcq": {
          "id": "q-9-5-class-vs-instance-attributes-2-v2",
          "question": "What is the serial_number of r2 when Robot.population is incremented on each initialization?",
          "options": [
            {
              "id": "A",
              "text": "'ROBOT-0002'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "'ROBOT-0001'",
              "explanationIfWrong": "r1 was created first (0001), r2 is second (0002)."
            },
            {
              "id": "C",
              "text": "'ROBOT-0003'",
              "explanationIfWrong": "r3 is the third robot created."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "serial_number is assigned formatted string."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "As the second created instance, Robot.population was 2 when r2 was initialized."
        },
        "questionPool": [
          {
            "id": "q-9-5-class-vs-instance-attributes-2-v1",
            "question": "Why is Robot.population += 1 written inside __init__ rather than self.population += 1?",
            "options": [
              {
                "id": "A",
                "text": "Robot.population += 1 correctly modifies the shared class attribute; self.population += 1 would create an instance variable shadow",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "self.population is forbidden by Python",
                "explanationIfWrong": "self.population += 1 is syntactically allowed, but causes the shadowing bug."
              },
              {
                "id": "C",
                "text": "Robot is a global keyword",
                "explanationIfWrong": "Robot is the identifier of the class."
              },
              {
                "id": "D",
                "text": "self can only hold strings",
                "explanationIfWrong": "self attributes can be any type."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Explicitly referencing Robot.population modifies the shared class attribute directly."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-2-v2",
            "question": "What is the serial_number of r2 when Robot.population is incremented on each initialization?",
            "options": [
              {
                "id": "A",
                "text": "'ROBOT-0002'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'ROBOT-0001'",
                "explanationIfWrong": "r1 was created first (0001), r2 is second (0002)."
              },
              {
                "id": "C",
                "text": "'ROBOT-0003'",
                "explanationIfWrong": "r3 is the third robot created."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "serial_number is assigned formatted string."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "As the second created instance, Robot.population was 2 when r2 was initialized."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-2-v3",
            "question": "Can a class attribute be a mutable collection like a list or registry of all instances?",
            "options": [
              {
                "id": "A",
                "text": "Yes, e.g. all_instances = [] can store references to every created instance for global querying",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, class attributes can only hold integers",
                "explanationIfWrong": "Class attributes can hold any Python object."
              },
              {
                "id": "C",
                "text": "Only if using SQLite",
                "explanationIfWrong": "In-memory lists work directly."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Class-level collections are standard in modern Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Class-level registries (e.g. registry = []) are widely used to maintain catalogs of active instances."
          }
        ]
      },
      {
        "heading": "Class-Level Constants and Configuration",
        "text": "Class attributes are the ideal home for constants, default configurations, error messages, and operational modes that are identical across all instances of a class. By PEP 8 convention, class constants are named in ALL_CAPS.",
        "codeSnippet": "class HTTPRequest:\n    # Class-level constants\n    DEFAULT_TIMEOUT = 30\n    ALLOWED_METHODS = (\"GET\", \"POST\", \"PUT\", \"DELETE\")\n    \n    def __init__(self, method, url, timeout=None):\n        if method.upper() not in HTTPRequest.ALLOWED_METHODS:\n            raise ValueError(f\"Invalid HTTP method: '{method}'.\")\n        self.method = method.upper()\n        self.url = url\n        self.timeout = timeout if timeout is not None else HTTPRequest.DEFAULT_TIMEOUT\n\nreq = HTTPRequest(\"get\", \"https://api.dopilot.com/data\")\nprint(f\"Method: {req.method}\")\nprint(f\"Timeout: {req.timeout}s (Default: {HTTPRequest.DEFAULT_TIMEOUT}s)\")",
        "terminalOutput": "Method: GET\nTimeout: 30s (Default: 30s)",
        "tip": "Defining constants at the class level keeps related magic numbers and strings grouped cleanly with the class that uses them.",
        "mcq": {
          "id": "q-9-5-class-vs-instance-attributes-3-v1",
          "question": "According to PEP 8, what naming convention is used for class-level constants?",
          "options": [
            {
              "id": "A",
              "text": "ALL_CAPS with underscores (e.g. DEFAULT_TIMEOUT)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "camelCase (e.g. defaultTimeout)",
              "explanationIfWrong": "camelCase is not standard PEP 8."
            },
            {
              "id": "C",
              "text": "Leading double underscores (__default_timeout)",
              "explanationIfWrong": "Double underscores trigger name mangling."
            },
            {
              "id": "D",
              "text": "Title_Case",
              "explanationIfWrong": "ALL_CAPS is the standard constant style."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "PEP 8 prescribes ALL_CAPS with underscores for constants at both module and class levels."
        },
        "retestMcq": {
          "id": "q-9-5-class-vs-instance-attributes-3-v2",
          "question": "What is the benefit of grouping constants like ALLOWED_METHODS inside HTTPRequest rather than as global variables?",
          "options": [
            {
              "id": "A",
              "text": "Namespace organization: constants are logically scoped to the class that owns them, avoiding global pollution",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It makes HTTP requests 10x faster",
              "explanationIfWrong": "Execution speed is essentially identical."
            },
            {
              "id": "C",
              "text": "It encrypts the URL",
              "explanationIfWrong": "Scoping does not encrypt data."
            },
            {
              "id": "D",
              "text": "It bypasses firewalls",
              "explanationIfWrong": "It is a code organization best practice."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Class constants keep related configuration in the class's namespace, keeping global scope clean."
        },
        "questionPool": [
          {
            "id": "q-9-5-class-vs-instance-attributes-3-v1",
            "question": "According to PEP 8, what naming convention is used for class-level constants?",
            "options": [
              {
                "id": "A",
                "text": "ALL_CAPS with underscores (e.g. DEFAULT_TIMEOUT)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "camelCase (e.g. defaultTimeout)",
                "explanationIfWrong": "camelCase is not standard PEP 8."
              },
              {
                "id": "C",
                "text": "Leading double underscores (__default_timeout)",
                "explanationIfWrong": "Double underscores trigger name mangling."
              },
              {
                "id": "D",
                "text": "Title_Case",
                "explanationIfWrong": "ALL_CAPS is the standard constant style."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 prescribes ALL_CAPS with underscores for constants at both module and class levels."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-3-v2",
            "question": "What is the benefit of grouping constants like ALLOWED_METHODS inside HTTPRequest rather than as global variables?",
            "options": [
              {
                "id": "A",
                "text": "Namespace organization: constants are logically scoped to the class that owns them, avoiding global pollution",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It makes HTTP requests 10x faster",
                "explanationIfWrong": "Execution speed is essentially identical."
              },
              {
                "id": "C",
                "text": "It encrypts the URL",
                "explanationIfWrong": "Scoping does not encrypt data."
              },
              {
                "id": "D",
                "text": "It bypasses firewalls",
                "explanationIfWrong": "It is a code organization best practice."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Class constants keep related configuration in the class's namespace, keeping global scope clean."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-3-v3",
            "question": "What happens if a caller passes method='PATCH' to HTTPRequest above?",
            "options": [
              {
                "id": "A",
                "text": "Raises a ValueError because 'PATCH' is not in HTTPRequest.ALLOWED_METHODS",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It silently converts PATCH to GET",
                "explanationIfWrong": "The validation check raises a ValueError explicitly."
              },
              {
                "id": "C",
                "text": "It automatically adds PATCH to ALLOWED_METHODS",
                "explanationIfWrong": "ALLOWED_METHODS is an immutable tuple."
              },
              {
                "id": "D",
                "text": "Returns None",
                "explanationIfWrong": "An exception is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The validation guard checks against the class constant and raises a ValueError if invalid."
          }
        ]
      },
      {
        "heading": "Class Methods with @classmethod and cls",
        "text": "A class method is a method that receives the class object itself (cls) as its first argument rather than an instance (self). Decorated with @classmethod, class methods are commonly used to create alternative constructors (e.g. creating an object from a JSON string, a dictionary, or a formatted timestamp).",
        "codeSnippet": "class Date:\n    def __init__(self, year, month, day):\n        self.year = year\n        self.month = month\n        self.day = day\n    \n    # Alternative constructor via @classmethod\n    @classmethod\n    def from_string(cls, date_str):\n        \"\"\"Creates a Date instance from 'YYYY-MM-DD' format.\"\"\"\n        parts = [int(p) for p in date_str.split(\"-\")]\n        # cls refers to the Date class; calling cls(...) creates an instance!\n        return cls(parts[0], parts[1], parts[2])\n    \n    def __str__(self):\n        return f\"{self.year:04d}-{self.month:02d}-{self.day:02d}\"\n\nd1 = Date(2026, 10, 10)                  # Standard constructor\nd2 = Date.from_string(\"2026-12-25\")      # Alternative constructor!\n\nprint(f\"Standard:    {d1}\")\nprint(f\"From string: {d2}\")",
        "terminalOutput": "Standard:    2026-10-10\nFrom string: 2026-12-25",
        "tip": "Using cls(...) inside a class method rather than hardcoding Date(...) ensures that if a subclass inherits the class method, calling Subclass.from_string(...) creates an instance of the subclass (polymorphic factory)!",
        "mcq": {
          "id": "q-9-5-class-vs-instance-attributes-4-v1",
          "question": "What is the primary purpose of @classmethod in Python?",
          "options": [
            {
              "id": "A",
              "text": "To define methods that operate on the class itself (receiving cls) rather than an individual instance (self), often used for alternative constructors",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To convert a class into a C++ header",
              "explanationIfWrong": "It is standard Python method dispatch."
            },
            {
              "id": "C",
              "text": "To make all attributes in the class read-only",
              "explanationIfWrong": "@property handles read-only attributes."
            },
            {
              "id": "D",
              "text": "To prevent classes from being inherited",
              "explanationIfWrong": "Class methods fully support inheritance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "@classmethod receives cls as its first parameter, allowing factory instantiation and class-level operations."
        },
        "retestMcq": {
          "id": "q-9-5-class-vs-instance-attributes-4-v2",
          "question": "Why is it best practice to write return cls(...) inside a @classmethod factory instead of return MyClass(...)?",
          "options": [
            {
              "id": "A",
              "text": "If a subclass inherits the class method, cls(...) correctly instantiates the subclass rather than the parent",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "cls(...) runs 50x faster in bytecode",
              "explanationIfWrong": "Performance is identical; the win is correct polymorphism."
            },
            {
              "id": "C",
              "text": "MyClass(...) is a SyntaxError inside class methods",
              "explanationIfWrong": "It is syntactically legal, but breaks inheritance."
            },
            {
              "id": "D",
              "text": "cls is a compiled C function",
              "explanationIfWrong": "cls is the class object passed as the first argument."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Using cls preserves polymorphism: calling SubClass.from_string() will instantiate SubClass."
        },
        "questionPool": [
          {
            "id": "q-9-5-class-vs-instance-attributes-4-v1",
            "question": "What is the primary purpose of @classmethod in Python?",
            "options": [
              {
                "id": "A",
                "text": "To define methods that operate on the class itself (receiving cls) rather than an individual instance (self), often used for alternative constructors",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To convert a class into a C++ header",
                "explanationIfWrong": "It is standard Python method dispatch."
              },
              {
                "id": "C",
                "text": "To make all attributes in the class read-only",
                "explanationIfWrong": "@property handles read-only attributes."
              },
              {
                "id": "D",
                "text": "To prevent classes from being inherited",
                "explanationIfWrong": "Class methods fully support inheritance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "@classmethod receives cls as its first parameter, allowing factory instantiation and class-level operations."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-4-v2",
            "question": "Why is it best practice to write return cls(...) inside a @classmethod factory instead of return MyClass(...)?",
            "options": [
              {
                "id": "A",
                "text": "If a subclass inherits the class method, cls(...) correctly instantiates the subclass rather than the parent",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "cls(...) runs 50x faster in bytecode",
                "explanationIfWrong": "Performance is identical; the win is correct polymorphism."
              },
              {
                "id": "C",
                "text": "MyClass(...) is a SyntaxError inside class methods",
                "explanationIfWrong": "It is syntactically legal, but breaks inheritance."
              },
              {
                "id": "D",
                "text": "cls is a compiled C function",
                "explanationIfWrong": "cls is the class object passed as the first argument."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Using cls preserves polymorphism: calling SubClass.from_string() will instantiate SubClass."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-4-v3",
            "question": "What is passed as the first parameter to a method decorated with @classmethod?",
            "options": [
              {
                "id": "A",
                "text": "The class object itself (conventionally named cls)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "An instance of the class (self)",
                "explanationIfWrong": "Standard instance methods receive self; class methods receive cls."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "The class object is always passed."
              },
              {
                "id": "D",
                "text": "A list of all instances",
                "explanationIfWrong": "It receives the class type itself."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Class methods automatically receive the class object as their first parameter (cls)."
          }
        ]
      },
      {
        "heading": "Static Methods with @staticmethod",
        "text": "A static method is a function defined inside a class that does NOT receive an automatic first argument (neither self nor cls). Decorated with @staticmethod, it behaves like an ordinary function that lives in the class's namespace, useful for self-contained utility methods.",
        "codeSnippet": "class MathUtils:\n    @staticmethod\n    def is_even(num):\n        return num % 2 == 0\n    \n    @staticmethod\n    def clamp(value, min_val, max_val):\n        return max(min_val, min(max_val, value))\n\nprint(MathUtils.is_even(10))\nprint(MathUtils.is_even(7))\nprint(f\"Clamped: {MathUtils.clamp(150, 0, 100)}\")",
        "terminalOutput": "True\nFalse\nClamped: 100",
        "tip": "Rule of thumb: If a method doesn't need self or cls, make it a @staticmethod. If it needs cls, use @classmethod. If it needs self, use a standard instance method.",
        "mcq": {
          "id": "q-9-5-class-vs-instance-attributes-5-v1",
          "question": "How does a @staticmethod differ from a regular instance method and a @classmethod?",
          "options": [
            {
              "id": "A",
              "text": "It receives no automatic first argument (neither self nor cls); it is essentially an ordinary function scoped inside the class",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It can only be called once per program execution",
              "explanationIfWrong": "Static methods can be called unlimited times."
            },
            {
              "id": "C",
              "text": "It cannot return any values",
              "explanationIfWrong": "Static methods return values like any function."
            },
            {
              "id": "D",
              "text": "It modifies class variables automatically",
              "explanationIfWrong": "Static methods have no direct reference to the class unless passed."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "@staticmethod does not inject self or cls; it is a self-contained helper function inside the class namespace."
        },
        "retestMcq": {
          "id": "q-9-5-class-vs-instance-attributes-5-v2",
          "question": "When should you use @staticmethod instead of @classmethod or an instance method?",
          "options": [
            {
              "id": "A",
              "text": "When the method performs a utility calculation that doesn't need to read or modify instance state (self) or class state (cls)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "When creating an alternative constructor",
              "explanationIfWrong": "Alternative constructors should use @classmethod."
            },
            {
              "id": "C",
              "text": "When mutating self attributes",
              "explanationIfWrong": "Mutating self requires an instance method."
            },
            {
              "id": "D",
              "text": "When connecting to a SQL database",
              "explanationIfWrong": "Database connections typically manage state on self."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Use @staticmethod when the function belongs logically inside the class but requires no access to self or cls."
        },
        "questionPool": [
          {
            "id": "q-9-5-class-vs-instance-attributes-5-v1",
            "question": "How does a @staticmethod differ from a regular instance method and a @classmethod?",
            "options": [
              {
                "id": "A",
                "text": "It receives no automatic first argument (neither self nor cls); it is essentially an ordinary function scoped inside the class",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It can only be called once per program execution",
                "explanationIfWrong": "Static methods can be called unlimited times."
              },
              {
                "id": "C",
                "text": "It cannot return any values",
                "explanationIfWrong": "Static methods return values like any function."
              },
              {
                "id": "D",
                "text": "It modifies class variables automatically",
                "explanationIfWrong": "Static methods have no direct reference to the class unless passed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "@staticmethod does not inject self or cls; it is a self-contained helper function inside the class namespace."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-5-v2",
            "question": "When should you use @staticmethod instead of @classmethod or an instance method?",
            "options": [
              {
                "id": "A",
                "text": "When the method performs a utility calculation that doesn't need to read or modify instance state (self) or class state (cls)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "When creating an alternative constructor",
                "explanationIfWrong": "Alternative constructors should use @classmethod."
              },
              {
                "id": "C",
                "text": "When mutating self attributes",
                "explanationIfWrong": "Mutating self requires an instance method."
              },
              {
                "id": "D",
                "text": "When connecting to a SQL database",
                "explanationIfWrong": "Database connections typically manage state on self."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Use @staticmethod when the function belongs logically inside the class but requires no access to self or cls."
          },
          {
            "id": "q-9-5-class-vs-instance-attributes-5-v3",
            "question": "Can you call MathUtils.is_even(4) without creating an instance (m = MathUtils())?",
            "options": [
              {
                "id": "A",
                "text": "Yes, static methods can be invoked directly on the class name without instantiation",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, an instance must always be instantiated first",
                "explanationIfWrong": "Static methods do not require instantiation."
              },
              {
                "id": "C",
                "text": "Only if using Python 2",
                "explanationIfWrong": "Direct calling is standard in modern Python."
              },
              {
                "id": "D",
                "text": "Only from inside another method",
                "explanationIfWrong": "Static methods can be called anywhere."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Static methods can be called directly via ClassName.method(args) without creating an instance."
          }
        ]
      }
    ]
  },
  {
    "id": "9-6-scope-methods-class-design",
    "number": "9.6",
    "title": "Scope of Methods & Class Design",
    "subtitle": "Decompose complex systems using private helper methods, clean separation of concerns, and robust multi-object architecture.",
    "readTime": "25 min",
    "objectives": [
      "Decompose large monolithic methods into focused private helper methods (_method)",
      "Maintain clean separation of concerns between business logic, formatting, and I/O",
      "Enforce multi-object business invariants across collaborating instances",
      "Synthesize encapsulation, composition, @property, and class attributes in a real-world case study",
      "Protect data integrity while exposing minimal, intuitive public interfaces",
      "Prepare architectural foundations for Part 10 (Class Hierarchies & Inheritance)"
    ],
    "theoryBlocks": [
      {
        "heading": "Private Helper Methods",
        "text": "Just as attributes can be internal, methods can also be internal helper methods prefixed with a single underscore (_method_name). Private helper methods decompose complex algorithms into small, readable, testable steps while keeping the class's public API clean and minimal.",
        "codeSnippet": "class OrderProcessor:\n    def __init__(self, tax_rate=0.08):\n        self.tax_rate = tax_rate\n    \n    # Internal private helper methods:\n    def _validate_items(self, items):\n        if not items:\n            raise ValueError(\"Order must contain at least one item.\")\n    \n    def _calculate_subtotal(self, items):\n        return sum(item['price'] * item['qty'] for item in items)\n    \n    def _apply_tax(self, subtotal):\n        return subtotal * (1 + self.tax_rate)\n    \n    # Clean, concise public method:\n    def process_order(self, customer_id, items):\n        self._validate_items(items)\n        subtotal = self._calculate_subtotal(items)\n        total = self._apply_tax(subtotal)\n        return {\"customer\": customer_id, \"subtotal\": subtotal, \"total\": round(total, 2)}\n\nprocessor = OrderProcessor(0.10)\nresult = processor.process_order(\"CUST-42\", [{\"price\": 50, \"qty\": 2}, {\"price\": 20, \"qty\": 1}])\nprint(result)",
        "terminalOutput": "{'customer': 'CUST-42', 'subtotal': 120, 'total': 132.0}",
        "tip": "Public methods should tell the high-level 'what' story (orchestration); private helper methods execute the low-level 'how' details.",
        "mcq": {
          "id": "q-9-6-scope-methods-class-design-0-v1",
          "question": "What is the primary benefit of decomposing complex tasks into private helper methods (_helper())?",
          "options": [
            {
              "id": "A",
              "text": "It keeps the public API clean, reduces code duplication, and makes methods easier to read, test, and maintain",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It prevents the Python garbage collector from running",
              "explanationIfWrong": "Helper methods have no effect on garbage collection."
            },
            {
              "id": "C",
              "text": "Private methods execute on remote cloud servers",
              "explanationIfWrong": "Helper methods run locally in the same process."
            },
            {
              "id": "D",
              "text": "It compresses the Python source code into a zip file",
              "explanationIfWrong": "Decomposition is an architectural clean-code practice."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Private helper methods break large tasks into modular, readable pieces while presenting a minimal public interface."
        },
        "retestMcq": {
          "id": "q-9-6-scope-methods-class-design-0-v2",
          "question": "Should external client code directly call an internal method like processor._calculate_subtotal()?",
          "options": [
            {
              "id": "A",
              "text": "No, leading underscores indicate internal implementation details that may change or be removed without notice",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Yes, internal methods are meant for external users",
              "explanationIfWrong": "External users should only call the public interface (process_order)."
            },
            {
              "id": "C",
              "text": "Only on Tuesdays",
              "explanationIfWrong": "The underscore convention applies at all times."
            },
            {
              "id": "D",
              "text": "Only if passed through JSON",
              "explanationIfWrong": "Internal methods are intended for internal class use."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Callers should interact only with public methods, respecting the leading underscore as internal implementation."
        },
        "questionPool": [
          {
            "id": "q-9-6-scope-methods-class-design-0-v1",
            "question": "What is the primary benefit of decomposing complex tasks into private helper methods (_helper())?",
            "options": [
              {
                "id": "A",
                "text": "It keeps the public API clean, reduces code duplication, and makes methods easier to read, test, and maintain",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It prevents the Python garbage collector from running",
                "explanationIfWrong": "Helper methods have no effect on garbage collection."
              },
              {
                "id": "C",
                "text": "Private methods execute on remote cloud servers",
                "explanationIfWrong": "Helper methods run locally in the same process."
              },
              {
                "id": "D",
                "text": "It compresses the Python source code into a zip file",
                "explanationIfWrong": "Decomposition is an architectural clean-code practice."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Private helper methods break large tasks into modular, readable pieces while presenting a minimal public interface."
          },
          {
            "id": "q-9-6-scope-methods-class-design-0-v2",
            "question": "Should external client code directly call an internal method like processor._calculate_subtotal()?",
            "options": [
              {
                "id": "A",
                "text": "No, leading underscores indicate internal implementation details that may change or be removed without notice",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, internal methods are meant for external users",
                "explanationIfWrong": "External users should only call the public interface (process_order)."
              },
              {
                "id": "C",
                "text": "Only on Tuesdays",
                "explanationIfWrong": "The underscore convention applies at all times."
              },
              {
                "id": "D",
                "text": "Only if passed through JSON",
                "explanationIfWrong": "Internal methods are intended for internal class use."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Callers should interact only with public methods, respecting the leading underscore as internal implementation."
          },
          {
            "id": "q-9-6-scope-methods-class-design-0-v3",
            "question": "What happens if an internal method like _validate_items() raises a ValueError?",
            "options": [
              {
                "id": "A",
                "text": "The exception halts execution of process_order() and propagates outward to the caller",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The error is silently ignored because the method starts with an underscore",
                "explanationIfWrong": "Underscores do not suppress exceptions."
              },
              {
                "id": "C",
                "text": "Python deletes the OrderProcessor class",
                "explanationIfWrong": "Exceptions do not delete classes."
              },
              {
                "id": "D",
                "text": "It returns False automatically",
                "explanationIfWrong": "Exceptions propagate unless explicitly caught with try/except."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Exceptions raised inside helper methods propagate up the call stack normally unless handled."
          }
        ]
      },
      {
        "heading": "Separation of Concerns",
        "text": "A fundamental rule of software engineering is Separation of Concerns: a class or method should focus strictly on doing one job well. In particular, domain logic (calculations, business rules) should be strictly separated from display formatting and terminal I/O (print() or input()).",
        "codeSnippet": "# Anti-Pattern: Mixing business logic with input/print\n# def calculate(self): num = input(); print(num * 2)\n\n# Best Practice: Clean separation\nclass GradeCalculator:\n    def __init__(self, scores):\n        self.scores = list(scores)\n    \n    # Pure calculation (no print, no input, 100% testable!)\n    def average(self):\n        return sum(self.scores) / len(self.scores) if self.scores else 0.0\n    \n    def letter_grade(self):\n        avg = self.average()\n        if avg >= 90: return \"A\"\n        if avg >= 80: return \"B\"\n        if avg >= 70: return \"C\"\n        return \"F\"\n\ncalc = GradeCalculator([88, 92, 79, 95])\n# Display logic is kept separate in user-facing layer:\nprint(f\"Average: {calc.average():.1f} | Grade: {calc.letter_grade()}\")",
        "terminalOutput": "Average: 88.5 | Grade: B",
        "tip": "Methods that perform calculations without print() or input() can be easily tested with automated unit tests and reused in web APIs or graphical interfaces.",
        "mcq": {
          "id": "q-9-6-scope-methods-class-design-1-v1",
          "question": "Why should domain calculation methods return values rather than calling print() directly?",
          "options": [
            {
              "id": "A",
              "text": "It separates business logic from presentation, making the method reusable in web apps, mobile apps, and automated unit tests",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "print() statements permanently crash modern cloud servers",
              "explanationIfWrong": "print() works in servers, but pollutes stdout and cannot be queried by code."
            },
            {
              "id": "C",
              "text": "Returning values makes Python run at the speed of C++",
              "explanationIfWrong": "The advantage is testability and modularity, not raw speed."
            },
            {
              "id": "D",
              "text": "Methods with print() cannot have return values",
              "explanationIfWrong": "Methods can print and return, but mixing them is poor architecture."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Returning data allows other functions, tests, or web frameworks to consume the result however they choose."
        },
        "retestMcq": {
          "id": "q-9-6-scope-methods-class-design-1-v2",
          "question": "What principle is violated when a single class handles database queries, mathematical calculations, email sending, and HTML rendering all in one?",
          "options": [
            {
              "id": "A",
              "text": "Single Responsibility Principle (SRP)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Newton's First Law",
              "explanationIfWrong": "That is a physics law of inertia."
            },
            {
              "id": "C",
              "text": "The DRY principle",
              "explanationIfWrong": "DRY is 'Don't Repeat Yourself'; SRP is about single responsibility."
            },
            {
              "id": "D",
              "text": "Pythagorean Theorem",
              "explanationIfWrong": "That is geometry."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Single Responsibility Principle states that a class should have one, and only one, reason to change."
        },
        "questionPool": [
          {
            "id": "q-9-6-scope-methods-class-design-1-v1",
            "question": "Why should domain calculation methods return values rather than calling print() directly?",
            "options": [
              {
                "id": "A",
                "text": "It separates business logic from presentation, making the method reusable in web apps, mobile apps, and automated unit tests",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "print() statements permanently crash modern cloud servers",
                "explanationIfWrong": "print() works in servers, but pollutes stdout and cannot be queried by code."
              },
              {
                "id": "C",
                "text": "Returning values makes Python run at the speed of C++",
                "explanationIfWrong": "The advantage is testability and modularity, not raw speed."
              },
              {
                "id": "D",
                "text": "Methods with print() cannot have return values",
                "explanationIfWrong": "Methods can print and return, but mixing them is poor architecture."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Returning data allows other functions, tests, or web frameworks to consume the result however they choose."
          },
          {
            "id": "q-9-6-scope-methods-class-design-1-v2",
            "question": "What principle is violated when a single class handles database queries, mathematical calculations, email sending, and HTML rendering all in one?",
            "options": [
              {
                "id": "A",
                "text": "Single Responsibility Principle (SRP)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Newton's First Law",
                "explanationIfWrong": "That is a physics law of inertia."
              },
              {
                "id": "C",
                "text": "The DRY principle",
                "explanationIfWrong": "DRY is 'Don't Repeat Yourself'; SRP is about single responsibility."
              },
              {
                "id": "D",
                "text": "Pythagorean Theorem",
                "explanationIfWrong": "That is geometry."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Single Responsibility Principle states that a class should have one, and only one, reason to change."
          },
          {
            "id": "q-9-6-scope-methods-class-design-1-v3",
            "question": "How can you test a method that returns a value (e.g. calc.average()) in automated tests?",
            "options": [
              {
                "id": "A",
                "text": "Directly assert the return value: assert calc.average() == 88.5",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "You must record the terminal monitor with a video camera",
                "explanationIfWrong": "Return values are directly assertable in test suites."
              },
              {
                "id": "C",
                "text": "Automated testing of methods is impossible in Python",
                "explanationIfWrong": "Python has rich testing frameworks like pytest and unittest."
              },
              {
                "id": "D",
                "text": "You must inspect the bytecode manually",
                "explanationIfWrong": "Assertions evaluate returned data directly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Returning values makes automated testing straightforward with simple equality assertions."
          }
        ]
      },
      {
        "heading": "Comprehensive Case Study: Inventory Architecture",
        "text": "Here we bring together encapsulation, composition, @property with validation, and class-level constants into a clean, cohesive real-world architecture.",
        "codeSnippet": "class StockItem:\n    def __init__(self, sku, name, unit_price, quantity=0):\n        self.sku = sku\n        self.name = name\n        self.unit_price = unit_price  # Uses property setter\n        self.quantity = quantity      # Uses property setter\n    \n    @property\n    def unit_price(self):\n        return self._unit_price\n    @unit_price.setter\n    def unit_price(self, val):\n        if val < 0:\n            raise ValueError(\"Unit price cannot be negative.\")\n        self._unit_price = round(float(val), 2)\n    \n    @property\n    def quantity(self):\n        return self._quantity\n    @quantity.setter\n    def quantity(self, val):\n        if int(val) < 0:\n            raise ValueError(\"Quantity cannot be negative.\")\n        self._quantity = int(val)\n    \n    @property\n    def inventory_value(self):\n        return self.unit_price * self.quantity\n\nitem = StockItem(\"SKU-99\", \"Wireless Mouse\", 29.99, 10)\nprint(f\"{item.name}: ${item.unit_price} x {item.quantity} = ${item.inventory_value:.2f}\")",
        "terminalOutput": "Wireless Mouse: $29.99 x 10 = $299.90",
        "tip": "Notice how unit_price and quantity setters validate on assignment, while inventory_value is a dynamic computed read-only property.",
        "mcq": {
          "id": "q-9-6-scope-methods-class-design-2-v1",
          "question": "In the StockItem class, what type of property is inventory_value?",
          "options": [
            {
              "id": "A",
              "text": "A dynamic computed read-only property that recalculates automatically when unit_price or quantity changes",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A static method",
              "explanationIfWrong": "It is an instance property using @property."
            },
            {
              "id": "C",
              "text": "A class attribute shared by all items",
              "explanationIfWrong": "It calculates the value of that specific item instance."
            },
            {
              "id": "D",
              "text": "A mutable list",
              "explanationIfWrong": "It returns a float value."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "inventory_value has only a getter (@property), making it dynamically computed and read-only."
        },
        "retestMcq": {
          "id": "q-9-6-scope-methods-class-design-2-v2",
          "question": "What happens if a user attempts item.inventory_value = 500 on a StockItem instance?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: property 'inventory_value' of 'StockItem' object has no setter",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It sets the price to 500",
              "explanationIfWrong": "Read-only properties block assignment."
            },
            {
              "id": "C",
              "text": "It resets quantity to zero",
              "explanationIfWrong": "An exception is raised; no state changes."
            },
            {
              "id": "D",
              "text": "It deletes the item",
              "explanationIfWrong": "Python protects read-only properties."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because inventory_value has no @inventory_value.setter, direct assignment raises an AttributeError."
        },
        "questionPool": [
          {
            "id": "q-9-6-scope-methods-class-design-2-v1",
            "question": "In the StockItem class, what type of property is inventory_value?",
            "options": [
              {
                "id": "A",
                "text": "A dynamic computed read-only property that recalculates automatically when unit_price or quantity changes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A static method",
                "explanationIfWrong": "It is an instance property using @property."
              },
              {
                "id": "C",
                "text": "A class attribute shared by all items",
                "explanationIfWrong": "It calculates the value of that specific item instance."
              },
              {
                "id": "D",
                "text": "A mutable list",
                "explanationIfWrong": "It returns a float value."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "inventory_value has only a getter (@property), making it dynamically computed and read-only."
          },
          {
            "id": "q-9-6-scope-methods-class-design-2-v2",
            "question": "What happens if a user attempts item.inventory_value = 500 on a StockItem instance?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: property 'inventory_value' of 'StockItem' object has no setter",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It sets the price to 500",
                "explanationIfWrong": "Read-only properties block assignment."
              },
              {
                "id": "C",
                "text": "It resets quantity to zero",
                "explanationIfWrong": "An exception is raised; no state changes."
              },
              {
                "id": "D",
                "text": "It deletes the item",
                "explanationIfWrong": "Python protects read-only properties."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because inventory_value has no @inventory_value.setter, direct assignment raises an AttributeError."
          },
          {
            "id": "q-9-6-scope-methods-class-design-2-v3",
            "question": "What happens if a user executes item.quantity = -5?",
            "options": [
              {
                "id": "A",
                "text": "The setter raises a ValueError('Quantity cannot be negative.') and the quantity remains 10",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The quantity becomes -5",
                "explanationIfWrong": "The setter validation blocks negative values."
              },
              {
                "id": "C",
                "text": "The quantity becomes 0",
                "explanationIfWrong": "The setter raises an error rather than silently altering input."
              },
              {
                "id": "D",
                "text": "Returns False",
                "explanationIfWrong": "An explicit ValueError is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The @quantity.setter validates the value and prevents negative values from corrupting the inventory count."
          }
        ]
      },
      {
        "heading": "Collaborating Objects & Container Management",
        "text": "Now let's build the InventoryManager container class that manages a collection of StockItem objects, implementing search, restock, and total valuation methods.",
        "codeSnippet": "class InventoryManager:\n    def __init__(self, warehouse_name):\n        self.warehouse_name = warehouse_name\n        self._items = {}  # SKU -> StockItem mapping\n    \n    def add_item(self, item):\n        if item.sku in self._items:\n            raise ValueError(f\"Item with SKU '{item.sku}' already exists.\")\n        self._items[item.sku] = item\n    \n    def restock(self, sku, additional_qty):\n        if sku not in self._items:\n            raise KeyError(f\"SKU '{sku}' not found.\")\n        self._items[sku].quantity += additional_qty\n    \n    def total_valuation(self):\n        return sum(item.inventory_value for item in self._items.values())\n\nmgr = InventoryManager(\"Central Depot\")\nmgr.add_item(StockItem(\"A1\", \"Laptop\", 999.00, 5))\nmgr.add_item(StockItem(\"B2\", \"Mouse\", 25.00, 20))\nmgr.restock(\"B2\", 10)  # Now 30 mice\n\nprint(f\"{mgr.warehouse_name} Total Value: ${mgr.total_valuation():,.2f}\")",
        "terminalOutput": "Central Depot Total Value: $5,745.00",
        "tip": "Container classes encapsulate data storage (like dicts or lists) behind clean business methods (add_item, restock, total_valuation).",
        "mcq": {
          "id": "q-9-6-scope-methods-class-design-3-v1",
          "question": "Why does InventoryManager store items in an internal dictionary self._items rather than exposing raw dict operations to callers?",
          "options": [
            {
              "id": "A",
              "text": "It encapsulates lookup mechanics and enforces duplicate SKU checks during add_item()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Dictionaries are illegal outside classes in Python",
              "explanationIfWrong": "Dictionaries can be used anywhere."
            },
            {
              "id": "C",
              "text": "Dictionaries only work if prefixed with an underscore",
              "explanationIfWrong": "The underscore is a privacy convention."
            },
            {
              "id": "D",
              "text": "It prevents memory leaks in CPython",
              "explanationIfWrong": "The reason is encapsulation and invariant protection."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Encapsulating the collection enables the manager to validate keys, prevent duplicates, and manage updates cleanly."
        },
        "retestMcq": {
          "id": "q-9-6-scope-methods-class-design-3-v2",
          "question": "What is the calculated total valuation for 5 laptops ($999.00 each) and 30 mice ($25.00 each)?",
          "options": [
            {
              "id": "A",
              "text": "$5,745.00 (4,995 + 750)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "$5,000.00",
              "explanationIfWrong": "5 * 999 = 4995; 30 * 25 = 750; 4995 + 750 = 5745."
            },
            {
              "id": "C",
              "text": "$6,000.00",
              "explanationIfWrong": "The math is 4995 + 750 = 5745."
            },
            {
              "id": "D",
              "text": "$5,495.00",
              "explanationIfWrong": "Mice quantity was restocked from 20 to 30."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "5 laptops * $999 = $4,995; 30 mice * $25 = $750; Total = $5,745.00."
        },
        "questionPool": [
          {
            "id": "q-9-6-scope-methods-class-design-3-v1",
            "question": "Why does InventoryManager store items in an internal dictionary self._items rather than exposing raw dict operations to callers?",
            "options": [
              {
                "id": "A",
                "text": "It encapsulates lookup mechanics and enforces duplicate SKU checks during add_item()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Dictionaries are illegal outside classes in Python",
                "explanationIfWrong": "Dictionaries can be used anywhere."
              },
              {
                "id": "C",
                "text": "Dictionaries only work if prefixed with an underscore",
                "explanationIfWrong": "The underscore is a privacy convention."
              },
              {
                "id": "D",
                "text": "It prevents memory leaks in CPython",
                "explanationIfWrong": "The reason is encapsulation and invariant protection."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Encapsulating the collection enables the manager to validate keys, prevent duplicates, and manage updates cleanly."
          },
          {
            "id": "q-9-6-scope-methods-class-design-3-v2",
            "question": "What is the calculated total valuation for 5 laptops ($999.00 each) and 30 mice ($25.00 each)?",
            "options": [
              {
                "id": "A",
                "text": "$5,745.00 (4,995 + 750)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "$5,000.00",
                "explanationIfWrong": "5 * 999 = 4995; 30 * 25 = 750; 4995 + 750 = 5745."
              },
              {
                "id": "C",
                "text": "$6,000.00",
                "explanationIfWrong": "The math is 4995 + 750 = 5745."
              },
              {
                "id": "D",
                "text": "$5,495.00",
                "explanationIfWrong": "Mice quantity was restocked from 20 to 30."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "5 laptops * $999 = $4,995; 30 mice * $25 = $750; Total = $5,745.00."
          },
          {
            "id": "q-9-6-scope-methods-class-design-3-v3",
            "question": "What happens if a caller calls mgr.restock('NONEXISTENT_SKU', 5)?",
            "options": [
              {
                "id": "A",
                "text": "Raises a KeyError('SKU not found.')",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Creates a new item with blank name",
                "explanationIfWrong": "The method explicitly raises a KeyError."
              },
              {
                "id": "C",
                "text": "Returns None silently",
                "explanationIfWrong": "An explicit exception is raised."
              },
              {
                "id": "D",
                "text": "Crashes the operating system",
                "explanationIfWrong": "Python exceptions can be caught by try/except."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The guard check if sku not in self._items raises a descriptive KeyError."
          }
        ]
      },
      {
        "heading": "Invariant Enforcement Across Multiple Objects",
        "text": "When collaborating objects interact (such as transferring stock between two warehouses), the operation must be atomic: if any step fails (e.g. insufficient quantity in source warehouse), the entire transaction must abort without leaving the system in a half-updated state.",
        "codeSnippet": "def transfer_stock(source_mgr, target_mgr, sku, qty):\n    if qty <= 0:\n        raise ValueError(\"Transfer quantity must be positive.\")\n    \n    # Verify both warehouses have valid state before mutating\n    if sku not in source_mgr._items:\n        raise KeyError(f\"Source warehouse does not stock SKU '{sku}'.\")\n    if sku not in target_mgr._items:\n        raise KeyError(f\"Target warehouse does not stock SKU '{sku}'.\")\n    if source_mgr._items[sku].quantity < qty:\n        raise ValueError(f\"Insufficient stock. Available: {source_mgr._items[sku].quantity}\")\n    \n    # Atomic transfer\n    source_mgr._items[sku].quantity -= qty\n    target_mgr._items[sku].quantity += qty\n    print(f\"Successfully transferred {qty} units of '{sku}'.\")",
        "terminalOutput": "Successfully transferred 5 units of 'A1'.",
        "tip": "Validate all preconditions before modifying any state to avoid leaving objects in half-mutated corrupt states.",
        "mcq": {
          "id": "q-9-6-scope-methods-class-design-4-v1",
          "question": "Why should preconditions be verified before performing state mutations across multiple objects?",
          "options": [
            {
              "id": "A",
              "text": "To prevent partial mutations where the first object is updated but the second fails, leaving data corrupted",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because Python forbids more than one mutation per function",
              "explanationIfWrong": "Functions can perform multiple mutations."
            },
            {
              "id": "C",
              "text": "To reduce network traffic",
              "explanationIfWrong": "Precondition checks ensure transaction consistency in memory."
            },
            {
              "id": "D",
              "text": "To convert the data to JSON",
              "explanationIfWrong": "It is an atomicity best practice."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Verifying all preconditions before modifying state ensures atomicity: operations either succeed completely or fail cleanly."
        },
        "retestMcq": {
          "id": "q-9-6-scope-methods-class-design-4-v2",
          "question": "What happens if source_mgr has 3 units and the caller requests transfer_stock(..., qty=5)?",
          "options": [
            {
              "id": "A",
              "text": "Raises a ValueError('Insufficient stock.') before any quantities are changed",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Source drops to -2 and target gains 5",
              "explanationIfWrong": "Precondition check blocks the transfer."
            },
            {
              "id": "C",
              "text": "Transfers 3 and leaves 0",
              "explanationIfWrong": "The function rejects the transaction entirely."
            },
            {
              "id": "D",
              "text": "Returns None silently",
              "explanationIfWrong": "An explicit ValueError is raised."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because 5 > 3, the guard check raises a ValueError before source quantity is subtracted."
        },
        "questionPool": [
          {
            "id": "q-9-6-scope-methods-class-design-4-v1",
            "question": "Why should preconditions be verified before performing state mutations across multiple objects?",
            "options": [
              {
                "id": "A",
                "text": "To prevent partial mutations where the first object is updated but the second fails, leaving data corrupted",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python forbids more than one mutation per function",
                "explanationIfWrong": "Functions can perform multiple mutations."
              },
              {
                "id": "C",
                "text": "To reduce network traffic",
                "explanationIfWrong": "Precondition checks ensure transaction consistency in memory."
              },
              {
                "id": "D",
                "text": "To convert the data to JSON",
                "explanationIfWrong": "It is an atomicity best practice."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Verifying all preconditions before modifying state ensures atomicity: operations either succeed completely or fail cleanly."
          },
          {
            "id": "q-9-6-scope-methods-class-design-4-v2",
            "question": "What happens if source_mgr has 3 units and the caller requests transfer_stock(..., qty=5)?",
            "options": [
              {
                "id": "A",
                "text": "Raises a ValueError('Insufficient stock.') before any quantities are changed",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Source drops to -2 and target gains 5",
                "explanationIfWrong": "Precondition check blocks the transfer."
              },
              {
                "id": "C",
                "text": "Transfers 3 and leaves 0",
                "explanationIfWrong": "The function rejects the transaction entirely."
              },
              {
                "id": "D",
                "text": "Returns None silently",
                "explanationIfWrong": "An explicit ValueError is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because 5 > 3, the guard check raises a ValueError before source quantity is subtracted."
          },
          {
            "id": "q-9-6-scope-methods-class-design-4-v3",
            "question": "What software pattern describes guaranteeing that a multi-step operation either completes entirely or leaves all systems untouched?",
            "options": [
              {
                "id": "A",
                "text": "Atomicity (all-or-nothing)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Polymorphism",
                "explanationIfWrong": "Polymorphism relates to shared interfaces across subclasses."
              },
              {
                "id": "C",
                "text": "Recursion",
                "explanationIfWrong": "Recursion is functions calling themselves."
              },
              {
                "id": "D",
                "text": "Method chaining",
                "explanationIfWrong": "Method chaining returns self."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Atomicity guarantees that all steps of a transaction succeed, or the system remains in its original state."
          }
        ]
      },
      {
        "heading": "Stage 2 Architecture Readiness: What's Next in Part 10",
        "text": "Congratulations on completing Part 9! You have mastered object references, aliasing, deep copying, composition ('has-a'), data encapsulation, Python's consenting adults philosophy, @property getters and setters, class attributes, and multi-object design. In Part 10, you will unlock Class Hierarchies & Inheritance \u2014 learning how to model 'is-a' relationships, subclassing, method overriding, super(), and polymorphism.",
        "codeSnippet": "# Sneak peek of Part 10 (Inheritance building on Part 9 Encapsulation):\nclass Vehicle:\n    def __init__(self, brand):\n        self._brand = brand\n    @property\n    def brand(self):\n        return self._brand\n\n# ElectricCar inherits Vehicle's brand property\nclass ElectricCar(Vehicle):\n    def __init__(self, brand, battery_kwh):\n        super().__init__(brand)  # Delegates to parent constructor!\n        self.battery_kwh = battery_kwh\n\ntesla = ElectricCar(\"Tesla\", 85)\nprint(f\"{tesla.brand} with {tesla.battery_kwh}kWh battery\")",
        "terminalOutput": "Tesla with 85kWh battery",
        "tip": "Encapsulation and composition (Part 9) combined with inheritance and polymorphism (Part 10) constitute the complete foundation of object-oriented architecture.",
        "mcq": {
          "id": "q-9-6-scope-methods-class-design-5-v1",
          "question": "How does the 'has-a' relationship learned in Part 9 contrast with the 'is-a' relationship coming in Part 10?",
          "options": [
            {
              "id": "A",
              "text": "'Has-a' is composition (a Car has an Engine); 'Is-a' is inheritance (an ElectricCar is a Vehicle)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "'Has-a' is for functions; 'Is-a' is for variables",
              "explanationIfWrong": "Both are class relationships."
            },
            {
              "id": "C",
              "text": "'Has-a' is deprecated in modern Python",
              "explanationIfWrong": "Composition is a primary architectural principle."
            },
            {
              "id": "D",
              "text": "'Is-a' is only available in Java",
              "explanationIfWrong": "Python fully supports inheritance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Composition ('has-a') and inheritance ('is-a') are the two foundational pillars of object-oriented modeling."
        },
        "retestMcq": {
          "id": "q-9-6-scope-methods-class-design-5-v2",
          "question": "What is the primary role of super().__init__() in a subclass?",
          "options": [
            {
              "id": "A",
              "text": "To invoke the parent class's constructor, ensuring base class attributes are properly initialized",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To speed up Python execution",
              "explanationIfWrong": "super() delegates method calls to parent classes."
            },
            {
              "id": "C",
              "text": "To delete private attributes",
              "explanationIfWrong": "It initializes inherited attributes."
            },
            {
              "id": "D",
              "text": "To restart the operating system",
              "explanationIfWrong": "It executes the parent class's __init__ method."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "super().__init__() calls the parent class's constructor to set up inherited state."
        },
        "questionPool": [
          {
            "id": "q-9-6-scope-methods-class-design-5-v1",
            "question": "How does the 'has-a' relationship learned in Part 9 contrast with the 'is-a' relationship coming in Part 10?",
            "options": [
              {
                "id": "A",
                "text": "'Has-a' is composition (a Car has an Engine); 'Is-a' is inheritance (an ElectricCar is a Vehicle)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'Has-a' is for functions; 'Is-a' is for variables",
                "explanationIfWrong": "Both are class relationships."
              },
              {
                "id": "C",
                "text": "'Has-a' is deprecated in modern Python",
                "explanationIfWrong": "Composition is a primary architectural principle."
              },
              {
                "id": "D",
                "text": "'Is-a' is only available in Java",
                "explanationIfWrong": "Python fully supports inheritance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Composition ('has-a') and inheritance ('is-a') are the two foundational pillars of object-oriented modeling."
          },
          {
            "id": "q-9-6-scope-methods-class-design-5-v2",
            "question": "What is the primary role of super().__init__() in a subclass?",
            "options": [
              {
                "id": "A",
                "text": "To invoke the parent class's constructor, ensuring base class attributes are properly initialized",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To speed up Python execution",
                "explanationIfWrong": "super() delegates method calls to parent classes."
              },
              {
                "id": "C",
                "text": "To delete private attributes",
                "explanationIfWrong": "It initializes inherited attributes."
              },
              {
                "id": "D",
                "text": "To restart the operating system",
                "explanationIfWrong": "It executes the parent class's __init__ method."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "super().__init__() calls the parent class's constructor to set up inherited state."
          },
          {
            "id": "q-9-6-scope-methods-class-design-5-v3",
            "question": "Which of the following represents the complete set of OOP architectural tools mastered by the end of Part 9?",
            "options": [
              {
                "id": "A",
                "text": "Memory references, deep copying, composition, encapsulation conventions, @property getters/setters, and class-level attributes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Only basic if/else statements",
                "explanationIfWrong": "Part 9 covers advanced object architecture."
              },
              {
                "id": "C",
                "text": "Only HTML and CSS tags",
                "explanationIfWrong": "This is a core Python software architecture course."
              },
              {
                "id": "D",
                "text": "Only print() and input()",
                "explanationIfWrong": "Part 9 builds production-grade OOP design patterns."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Part 9 equips students with complete object references, composition, encapsulation, and property design skills."
          }
        ]
      }
    ]
  }
];

// Question pool selector for Part 9
export const getActiveQuestionsForLevelPart9 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part9_seen_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part9_active_qset_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 9
export const getConsecutiveFailuresPart9 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part9_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart9 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part9_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart9 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part9_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart9 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part9_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart9 = (
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
  const currentAttempt = getLevelAttemptCountPart9(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part9_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part9_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part9_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part9_locked_${studentId}`);
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
      setLevelAttemptCountPart9(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart9(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart9(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part9_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part9_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part9_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart9 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part9_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part9_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part9_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part9_locked_progression_${studentId}`);
  } catch {}
};
