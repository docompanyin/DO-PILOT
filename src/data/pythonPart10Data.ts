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

export const PART_10_SECTIONS: SectionContent[] = [
  {
    "id": "10-1-class-hierarchies-inheritance",
    "number": "10.1",
    "title": "Class Hierarchies & Inheritance",
    "subtitle": "Model 'is-a' relationships by creating subclasses that inherit attributes and behaviors from base classes.",
    "readTime": "20 min",
    "objectives": [
      "Understand inheritance as the 'is-a' architectural relationship in OOP",
      "Define subclasses using the class SubClass(BaseClass): syntax",
      "Inherit methods and attributes from parent classes without re-writing code",
      "Check object types with isinstance() across inheritance trees",
      "Verify class relationships with issubclass()",
      "Contrast inheritance ('is-a') with composition ('has-a')"
    ],
    "theoryBlocks": [
      {
        "heading": "The 'Is-A' Relationship and Inheritance",
        "text": "Inheritance is an object-oriented mechanism where a new class (subclass or derived class) is based on an existing class (base class or parent class). Inheritance models an 'is-a' relationship: a Dog is-an Animal; an ElectricCar is-a Vehicle; an AdminUser is-a User. The subclass automatically inherits all attributes and methods of the parent class, enabling massive code reuse.",
        "codeSnippet": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def sleep(self):\n        return f\"{self.name} is sleeping peacefully... zzz\"\n\n# Dog inherits from Animal via (Animal) syntax\nclass Dog(Animal):\n    def bark(self):\n        return f\"{self.name} says Woof!\"\n\nd = Dog(\"Buddy\")\nprint(d.bark())   # Defined in Dog\nprint(d.sleep())  # Inherited directly from Animal!",
        "terminalOutput": "Buddy says Woof!\nBuddy is sleeping peacefully... zzz",
        "tip": "Inheritance allows you to place common behaviors in a general base class, and specialize behavior in derived subclasses.",
        "mcq": {
          "id": "q-10-1-class-hierarchies-inheritance-0-v1",
          "question": "What is the primary conceptual relationship modeled by inheritance?",
          "options": [
            {
              "id": "A",
              "text": "An 'is-a' relationship (e.g. a Manager is an Employee)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A 'has-a' relationship (e.g. a Car has an Engine)",
              "explanationIfWrong": "'Has-a' is composition, not inheritance."
            },
            {
              "id": "C",
              "text": "A 'uses-a' temporary network connection",
              "explanationIfWrong": "Inheritance models type hierarchies, not network connections."
            },
            {
              "id": "D",
              "text": "A database foreign key relationship",
              "explanationIfWrong": "Inheritance is an in-memory OOP concept."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Inheritance models generalization-specialization ('is-a') hierarchies where subclasses represent specific kinds of parent types."
        },
        "retestMcq": {
          "id": "q-10-1-class-hierarchies-inheritance-0-v2",
          "question": "How do you declare that a class Manager inherits from a parent class Employee in Python?",
          "options": [
            {
              "id": "A",
              "text": "class Manager(Employee):",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "class Manager extends Employee:",
              "explanationIfWrong": "'extends' is Java syntax; Python uses parentheses."
            },
            {
              "id": "C",
              "text": "class Manager inherits Employee:",
              "explanationIfWrong": "'inherits' is not a valid Python keyword."
            },
            {
              "id": "D",
              "text": "class Manager : public Employee:",
              "explanationIfWrong": "Colon-based inheritance is C++ syntax."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, inheritance is declared by placing the parent class name in parentheses after the subclass name: class Sub(Parent):."
        },
        "questionPool": [
          {
            "id": "q-10-1-class-hierarchies-inheritance-0-v1",
            "question": "What is the primary conceptual relationship modeled by inheritance?",
            "options": [
              {
                "id": "A",
                "text": "An 'is-a' relationship (e.g. a Manager is an Employee)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A 'has-a' relationship (e.g. a Car has an Engine)",
                "explanationIfWrong": "'Has-a' is composition, not inheritance."
              },
              {
                "id": "C",
                "text": "A 'uses-a' temporary network connection",
                "explanationIfWrong": "Inheritance models type hierarchies, not network connections."
              },
              {
                "id": "D",
                "text": "A database foreign key relationship",
                "explanationIfWrong": "Inheritance is an in-memory OOP concept."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Inheritance models generalization-specialization ('is-a') hierarchies where subclasses represent specific kinds of parent types."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-0-v2",
            "question": "How do you declare that a class Manager inherits from a parent class Employee in Python?",
            "options": [
              {
                "id": "A",
                "text": "class Manager(Employee):",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "class Manager extends Employee:",
                "explanationIfWrong": "'extends' is Java syntax; Python uses parentheses."
              },
              {
                "id": "C",
                "text": "class Manager inherits Employee:",
                "explanationIfWrong": "'inherits' is not a valid Python keyword."
              },
              {
                "id": "D",
                "text": "class Manager : public Employee:",
                "explanationIfWrong": "Colon-based inheritance is C++ syntax."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, inheritance is declared by placing the parent class name in parentheses after the subclass name: class Sub(Parent):."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-0-v3",
            "question": "Can an instance of a subclass call methods defined on its parent class?",
            "options": [
              {
                "id": "A",
                "text": "Yes, subclasses automatically inherit and can directly call all accessible parent methods",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, parent methods must be completely rewritten inside the subclass",
                "explanationIfWrong": "Code reuse is the foundational purpose of inheritance."
              },
              {
                "id": "C",
                "text": "Only if the parent method is decorated with @inherit",
                "explanationIfWrong": "No decorators are required; inheritance is automatic."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Inheritance is core to all Python versions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Subclasses automatically possess all non-mangled methods and attributes defined on their ancestors."
          }
        ]
      },
      {
        "heading": "Type Inspection: isinstance() and issubclass()",
        "text": "Because a subclass instance 'is-a' member of its parent class, Python's isinstance(obj, Class) function evaluates to True for the object's direct class AND for all its ancestor classes. To check relationships between class types themselves without an instance, use issubclass(ChildClass, ParentClass).",
        "codeSnippet": "class Vehicle: pass\nclass Car(Vehicle): pass\nclass SportsCar(Car): pass\n\nferrari = SportsCar()\n\nprint(f\"isinstance ferrari SportsCar: {isinstance(ferrari, SportsCar)}\")\nprint(f\"isinstance ferrari Car:       {isinstance(ferrari, Car)}\")\nprint(f\"isinstance ferrari Vehicle:   {isinstance(ferrari, Vehicle)}\")\nprint(f\"isinstance ferrari object:    {isinstance(ferrari, object)}\")\n\nprint(f\"issubclass SportsCar Vehicle: {issubclass(SportsCar, Vehicle)}\")\nprint(f\"issubclass Vehicle SportsCar: {issubclass(Vehicle, SportsCar)}\")",
        "terminalOutput": "isinstance ferrari SportsCar: True\nisinstance ferrari Car:       True\nisinstance ferrari Vehicle:   True\nisinstance ferrari object:    True\nissubclass SportsCar Vehicle: True\nissubclass Vehicle SportsCar: False",
        "tip": "In Python, every single class implicitly inherits from the root built-in class named object.",
        "mcq": {
          "id": "q-10-1-class-hierarchies-inheritance-1-v1",
          "question": "Given class Dog(Animal): pass and d = Dog(), what is the result of isinstance(d, Animal)?",
          "options": [
            {
              "id": "A",
              "text": "True, because a Dog instance is also considered an instance of its parent class Animal",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "False, because d was instantiated from Dog, not Animal directly",
              "explanationIfWrong": "isinstance checks the entire inheritance chain."
            },
            {
              "id": "C",
              "text": "Raises a TypeError",
              "explanationIfWrong": "isinstance() evaluates cleanly to a boolean."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "isinstance() returns True or False."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "isinstance() respects the 'is-a' hierarchy: an instance of a subclass is also an instance of all its parent classes."
        },
        "retestMcq": {
          "id": "q-10-1-class-hierarchies-inheritance-1-v2",
          "question": "What is the difference between isinstance() and issubclass()?",
          "options": [
            {
              "id": "A",
              "text": "isinstance(obj, Class) checks an object instance against a class; issubclass(ClassA, ClassB) checks if one class inherits from another",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "They are identical aliases of each other",
              "explanationIfWrong": "issubclass takes two class types; isinstance takes an instance and a class."
            },
            {
              "id": "C",
              "text": "isinstance is for numbers; issubclass is for strings",
              "explanationIfWrong": "Both are type introspection functions."
            },
            {
              "id": "D",
              "text": "issubclass was removed in Python 3",
              "explanationIfWrong": "Both are fundamental built-ins."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "isinstance tests instances against classes; issubclass tests inheritance relationships between class types."
        },
        "questionPool": [
          {
            "id": "q-10-1-class-hierarchies-inheritance-1-v1",
            "question": "Given class Dog(Animal): pass and d = Dog(), what is the result of isinstance(d, Animal)?",
            "options": [
              {
                "id": "A",
                "text": "True, because a Dog instance is also considered an instance of its parent class Animal",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "False, because d was instantiated from Dog, not Animal directly",
                "explanationIfWrong": "isinstance checks the entire inheritance chain."
              },
              {
                "id": "C",
                "text": "Raises a TypeError",
                "explanationIfWrong": "isinstance() evaluates cleanly to a boolean."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "isinstance() returns True or False."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "isinstance() respects the 'is-a' hierarchy: an instance of a subclass is also an instance of all its parent classes."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-1-v2",
            "question": "What is the difference between isinstance() and issubclass()?",
            "options": [
              {
                "id": "A",
                "text": "isinstance(obj, Class) checks an object instance against a class; issubclass(ClassA, ClassB) checks if one class inherits from another",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They are identical aliases of each other",
                "explanationIfWrong": "issubclass takes two class types; isinstance takes an instance and a class."
              },
              {
                "id": "C",
                "text": "isinstance is for numbers; issubclass is for strings",
                "explanationIfWrong": "Both are type introspection functions."
              },
              {
                "id": "D",
                "text": "issubclass was removed in Python 3",
                "explanationIfWrong": "Both are fundamental built-ins."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "isinstance tests instances against classes; issubclass tests inheritance relationships between class types."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-1-v3",
            "question": "What does type(d) == Animal return when d = Dog() and Dog inherits from Animal?",
            "options": [
              {
                "id": "A",
                "text": "False, because type() checks the exact concrete class, ignoring inheritance",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "True, because Dog inherits from Animal",
                "explanationIfWrong": "type() does NOT check parent classes; isinstance() does."
              },
              {
                "id": "C",
                "text": "None",
                "explanationIfWrong": "Equality check returns a boolean."
              },
              {
                "id": "D",
                "text": "Raises an error",
                "explanationIfWrong": "Type comparisons are valid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "type(d) is strictly Dog. Always prefer isinstance(d, Animal) over type equality to support polymorphism and inheritance."
          }
        ]
      },
      {
        "heading": "Inheriting Attributes and Methods",
        "text": "When a subclass does not define its own __init__ or methods, it completely adopts the __init__ and all methods of its parent class. Callers can instantiate the subclass by passing the arguments expected by the parent's constructor.",
        "codeSnippet": "class Publication:\n    def __init__(self, title, publisher):\n        self.title = title\n        self.publisher = publisher\n    \n    def get_citation(self):\n        return f\"{self.title} \u2014 Published by {self.publisher}\"\n\n# Magazine does not define __init__; it inherits Publication's\nclass Magazine(Publication):\n    def is_periodical(self):\n        return True\n\nmag = Magazine(\"National Geographic\", \"NatGeo Society\")\nprint(f\"Title: {mag.title}\")\nprint(f\"Citation: {mag.get_citation()}\")\nprint(f\"Periodical? {mag.is_periodical()}\")",
        "terminalOutput": "Title: National Geographic\nCitation: National Geographic \u2014 Published by NatGeo Society\nPeriodical? True",
        "tip": "If a subclass needs no extra attributes, you don't even need to write an __init__ method for it; the parent constructor runs automatically.",
        "mcq": {
          "id": "q-10-1-class-hierarchies-inheritance-2-v1",
          "question": "What happens if a subclass does not define an __init__ method?",
          "options": [
            {
              "id": "A",
              "text": "It automatically inherits and executes the parent class's __init__ constructor",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Objects of the subclass cannot be instantiated",
              "explanationIfWrong": "Instantiation succeeds using the inherited constructor."
            },
            {
              "id": "C",
              "text": "Python raises a NoConstructorError",
              "explanationIfWrong": "Python inherits constructors down the inheritance tree."
            },
            {
              "id": "D",
              "text": "The subclass is converted to a dictionary",
              "explanationIfWrong": "It remains a valid class instance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "If a subclass lacks __init__, Python walks up the inheritance tree and executes the first __init__ it finds."
        },
        "retestMcq": {
          "id": "q-10-1-class-hierarchies-inheritance-2-v2",
          "question": "If Publication requires title and publisher, how do you instantiate Magazine(Publication) when Magazine has no __init__?",
          "options": [
            {
              "id": "A",
              "text": "Magazine('Title', 'Publisher') passing the arguments required by Publication's constructor",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Magazine() with no arguments",
              "explanationIfWrong": "The inherited constructor requires title and publisher."
            },
            {
              "id": "C",
              "text": "Magazine.Publication('Title', 'Publisher')",
              "explanationIfWrong": "Direct instantiation is Magazine(...)."
            },
            {
              "id": "D",
              "text": "Publication(Magazine)",
              "explanationIfWrong": "You instantiate the derived class directly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since Magazine inherits Publication.__init__, you pass the arguments expected by that parent constructor."
        },
        "questionPool": [
          {
            "id": "q-10-1-class-hierarchies-inheritance-2-v1",
            "question": "What happens if a subclass does not define an __init__ method?",
            "options": [
              {
                "id": "A",
                "text": "It automatically inherits and executes the parent class's __init__ constructor",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Objects of the subclass cannot be instantiated",
                "explanationIfWrong": "Instantiation succeeds using the inherited constructor."
              },
              {
                "id": "C",
                "text": "Python raises a NoConstructorError",
                "explanationIfWrong": "Python inherits constructors down the inheritance tree."
              },
              {
                "id": "D",
                "text": "The subclass is converted to a dictionary",
                "explanationIfWrong": "It remains a valid class instance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "If a subclass lacks __init__, Python walks up the inheritance tree and executes the first __init__ it finds."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-2-v2",
            "question": "If Publication requires title and publisher, how do you instantiate Magazine(Publication) when Magazine has no __init__?",
            "options": [
              {
                "id": "A",
                "text": "Magazine('Title', 'Publisher') passing the arguments required by Publication's constructor",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Magazine() with no arguments",
                "explanationIfWrong": "The inherited constructor requires title and publisher."
              },
              {
                "id": "C",
                "text": "Magazine.Publication('Title', 'Publisher')",
                "explanationIfWrong": "Direct instantiation is Magazine(...)."
              },
              {
                "id": "D",
                "text": "Publication(Magazine)",
                "explanationIfWrong": "You instantiate the derived class directly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since Magazine inherits Publication.__init__, you pass the arguments expected by that parent constructor."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-2-v3",
            "question": "Can a parent class access methods defined specifically on one of its subclasses?",
            "options": [
              {
                "id": "A",
                "text": "No, inheritance is one-way: child classes inherit from parents, but parent instances know nothing about subclass methods",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, parent classes automatically gain all methods from all children",
                "explanationIfWrong": "Inheritance flows down, not up."
              },
              {
                "id": "C",
                "text": "Only if decorated with @downcast",
                "explanationIfWrong": "No such decorator exists in Python."
              },
              {
                "id": "D",
                "text": "Only if all classes are in the same folder",
                "explanationIfWrong": "Inheritance semantics are directional."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Inheritance is strictly top-down. An instance of Publication has no knowledge of Magazine.is_periodical()."
          }
        ]
      },
      {
        "heading": "Inheritance vs Composition: How to Choose",
        "text": "A classic design question is whether to use Inheritance ('is-a') or Composition ('has-a'). Use Inheritance when the subclass is a specialized version of the parent and can substitute for it everywhere (Liskov Substitution Principle). Use Composition when you want to combine capabilities from different components or when lifecycles can vary independently.",
        "codeSnippet": "# Inheritance: Square IS-A Shape\nclass Shape:\n    def __init__(self, color):\n        self.color = color\n\nclass Square(Shape):\n    def __init__(self, side, color):\n        super().__init__(color)\n        self.side = side\n\n# Composition: Car HAS-AN Engine (not a Car IS-AN Engine!)\nclass Engine: pass\nclass Car:\n    def __init__(self, engine):\n        self.engine = engine  # Composition!",
        "terminalOutput": "",
        "tip": "Ask yourself: Is A a specialized kind of B (use inheritance), or does A merely possess a B (use composition)? A Car is NOT an Engine; a Car HAS an Engine.",
        "mcq": {
          "id": "q-10-1-class-hierarchies-inheritance-3-v1",
          "question": "Which design approach is appropriate for modeling a Bird and a Wing?",
          "options": [
            {
              "id": "A",
              "text": "Composition: A Bird has Wings (not Bird inherits from Wing)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Inheritance: class Bird(Wing)",
              "explanationIfWrong": "A Bird is not a specialized wing."
            },
            {
              "id": "C",
              "text": "Inheritance: class Wing(Bird)",
              "explanationIfWrong": "A Wing is not a bird."
            },
            {
              "id": "D",
              "text": "Neither, classes cannot interact",
              "explanationIfWrong": "Classes interact through composition and inheritance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A Bird possesses wings as components ('has-a'), making composition the correct architectural model."
        },
        "retestMcq": {
          "id": "q-10-1-class-hierarchies-inheritance-3-v2",
          "question": "What is the Liskov Substitution Principle (LSP)?",
          "options": [
            {
              "id": "A",
              "text": "Objects of a superclass should be replaceable with objects of its subclasses without breaking application correctness",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Subclasses must always delete their parent's methods",
              "explanationIfWrong": "Subclasses should honor their parent's contract."
            },
            {
              "id": "C",
              "text": "Classes must never have more than 2 methods",
              "explanationIfWrong": "LSP is about behavioral subtyping."
            },
            {
              "id": "D",
              "text": "Only one instance of a class may ever exist",
              "explanationIfWrong": "That is the Singleton pattern."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "LSP states that any code expecting a base class should work seamlessly when given any derived subclass."
        },
        "questionPool": [
          {
            "id": "q-10-1-class-hierarchies-inheritance-3-v1",
            "question": "Which design approach is appropriate for modeling a Bird and a Wing?",
            "options": [
              {
                "id": "A",
                "text": "Composition: A Bird has Wings (not Bird inherits from Wing)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Inheritance: class Bird(Wing)",
                "explanationIfWrong": "A Bird is not a specialized wing."
              },
              {
                "id": "C",
                "text": "Inheritance: class Wing(Bird)",
                "explanationIfWrong": "A Wing is not a bird."
              },
              {
                "id": "D",
                "text": "Neither, classes cannot interact",
                "explanationIfWrong": "Classes interact through composition and inheritance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A Bird possesses wings as components ('has-a'), making composition the correct architectural model."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-3-v2",
            "question": "What is the Liskov Substitution Principle (LSP)?",
            "options": [
              {
                "id": "A",
                "text": "Objects of a superclass should be replaceable with objects of its subclasses without breaking application correctness",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Subclasses must always delete their parent's methods",
                "explanationIfWrong": "Subclasses should honor their parent's contract."
              },
              {
                "id": "C",
                "text": "Classes must never have more than 2 methods",
                "explanationIfWrong": "LSP is about behavioral subtyping."
              },
              {
                "id": "D",
                "text": "Only one instance of a class may ever exist",
                "explanationIfWrong": "That is the Singleton pattern."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "LSP states that any code expecting a base class should work seamlessly when given any derived subclass."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-3-v3",
            "question": "Why does the saying 'Favor object composition over class inheritance' exist in software architecture?",
            "options": [
              {
                "id": "A",
                "text": "Composition creates looser coupling, avoids rigid class hierarchies, and makes components easier to test and swap at runtime",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Inheritance is deprecated in modern programming languages",
                "explanationIfWrong": "Inheritance is still widely used when appropriate."
              },
              {
                "id": "C",
                "text": "Composition uses zero RAM",
                "explanationIfWrong": "Both use memory normally; the win is architectural flexibility."
              },
              {
                "id": "D",
                "text": "Inheritance crashes multi-core CPUs",
                "explanationIfWrong": "CPU architecture is unrelated."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Deep inheritance trees can be brittle; composition provides flexibility by assembling interchangeable parts."
          }
        ]
      },
      {
        "heading": "Extending Subclasses with New Methods",
        "text": "Subclasses can add brand-new methods and attributes that do not exist on the parent class. These new additions specialize the subclass for its specific domain while retaining all base capabilities.",
        "codeSnippet": "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n    \n    def get_details(self):\n        return f\"{self.name} (Salary: ${self.salary:,})\"\n\nclass Developer(Employee):\n    # New method specific to Developer\n    def write_code(self, language):\n        return f\"{self.name} is writing clean {language} code!\"\n\ndev = Developer(\"Linus\", 150000)\nprint(dev.get_details())           # Inherited from Employee\nprint(dev.write_code(\"Python\"))    # Specialized Developer method",
        "terminalOutput": "Linus (Salary: $150,000)\nLinus is writing clean Python code!",
        "tip": "Subclasses can freely mix inherited methods with specialized new methods.",
        "mcq": {
          "id": "q-10-1-class-hierarchies-inheritance-4-v1",
          "question": "Can a subclass define additional methods beyond what its parent class provides?",
          "options": [
            {
              "id": "A",
              "text": "Yes, subclasses can define any number of new methods and attributes to specialize their behavior",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, subclasses are strictly limited to the parent class's method signatures",
              "explanationIfWrong": "Subclasses routinely add specialized methods."
            },
            {
              "id": "C",
              "text": "Only if declared with @extend",
              "explanationIfWrong": "Standard def statements inside the subclass work directly."
            },
            {
              "id": "D",
              "text": "Only up to 3 extra methods",
              "explanationIfWrong": "There is no limit."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Specialization is the core purpose of subclassing: adopting base functionality and adding domain-specific methods."
        },
        "retestMcq": {
          "id": "q-10-1-class-hierarchies-inheritance-4-v2",
          "question": "If emp = Employee('Bob', 50000), what happens when executing emp.write_code('Python')?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: 'Employee' object has no attribute 'write_code'",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It executes cleanly",
              "explanationIfWrong": "write_code is defined on Developer, not Employee."
            },
            {
              "id": "C",
              "text": "It automatically converts emp into a Developer",
              "explanationIfWrong": "Instances do not automatically change their type."
            },
            {
              "id": "D",
              "text": "Returns None",
              "explanationIfWrong": "Looking up a non-existent method raises AttributeError."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "write_code() was added only to the Developer subclass; the base Employee class does not possess it."
        },
        "questionPool": [
          {
            "id": "q-10-1-class-hierarchies-inheritance-4-v1",
            "question": "Can a subclass define additional methods beyond what its parent class provides?",
            "options": [
              {
                "id": "A",
                "text": "Yes, subclasses can define any number of new methods and attributes to specialize their behavior",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, subclasses are strictly limited to the parent class's method signatures",
                "explanationIfWrong": "Subclasses routinely add specialized methods."
              },
              {
                "id": "C",
                "text": "Only if declared with @extend",
                "explanationIfWrong": "Standard def statements inside the subclass work directly."
              },
              {
                "id": "D",
                "text": "Only up to 3 extra methods",
                "explanationIfWrong": "There is no limit."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Specialization is the core purpose of subclassing: adopting base functionality and adding domain-specific methods."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-4-v2",
            "question": "If emp = Employee('Bob', 50000), what happens when executing emp.write_code('Python')?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: 'Employee' object has no attribute 'write_code'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It executes cleanly",
                "explanationIfWrong": "write_code is defined on Developer, not Employee."
              },
              {
                "id": "C",
                "text": "It automatically converts emp into a Developer",
                "explanationIfWrong": "Instances do not automatically change their type."
              },
              {
                "id": "D",
                "text": "Returns None",
                "explanationIfWrong": "Looking up a non-existent method raises AttributeError."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "write_code() was added only to the Developer subclass; the base Employee class does not possess it."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-4-v3",
            "question": "Can multiple subclasses inherit from the same parent class (e.g. Developer(Employee) and Designer(Employee))?",
            "options": [
              {
                "id": "A",
                "text": "Yes, many subclasses can inherit from a single common base class (hierarchical inheritance)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, a base class can only have one child in Python",
                "explanationIfWrong": "A base class can have unlimited derived subclasses."
              },
              {
                "id": "C",
                "text": "Only if using abstract base classes",
                "explanationIfWrong": "Standard classes support unlimited subclasses."
              },
              {
                "id": "D",
                "text": "Only in Linux",
                "explanationIfWrong": "Python OOP is platform independent."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Hierarchical inheritance allows many distinct subclasses to share common behavior from a single parent."
          }
        ]
      },
      {
        "heading": "The Built-In object Class",
        "text": "In Python 3, every class automatically inherits from the built-in object class, even if you don't explicitly specify it (class MyClass: is identical to class MyClass(object):). The object class provides default implementations for core dunder methods like __repr__, __eq__, __hash__, and __str__.",
        "codeSnippet": "class Simple:\n    pass\n\nprint(f\"Simple subclasses object? {issubclass(Simple, object)}\")\nprint(f\"object methods on Simple: {[m for m in dir(Simple) if m.startswith('__')][:5]}\")",
        "terminalOutput": "Simple subclasses object? True\nobject methods on Simple: ['__class__', '__delattr__', '__dir__', '__doc__', '__eq__']",
        "tip": "Because all classes descend from object, any custom class can immediately be printed, compared for identity, and passed anywhere an object is accepted.",
        "mcq": {
          "id": "q-10-1-class-hierarchies-inheritance-5-v1",
          "question": "What is the ultimate root base class of all classes in Python 3?",
          "options": [
            {
              "id": "A",
              "text": "object",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "type",
              "explanationIfWrong": "type is the metaclass; object is the root of the class inheritance hierarchy."
            },
            {
              "id": "C",
              "text": "BaseClass",
              "explanationIfWrong": "The built-in root class is named object."
            },
            {
              "id": "D",
              "text": "root",
              "explanationIfWrong": "The class is named object."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "All Python 3 classes automatically and implicitly inherit from the root object class."
        },
        "retestMcq": {
          "id": "q-10-1-class-hierarchies-inheritance-5-v2",
          "question": "What is the difference between writing class Person: pass and class Person(object): pass in Python 3?",
          "options": [
            {
              "id": "A",
              "text": "There is no difference; Python 3 implicitly inherits from object automatically",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "class Person: creates an old-style class",
              "explanationIfWrong": "Old-style classes were eliminated in Python 3."
            },
            {
              "id": "C",
              "text": "class Person(object): runs 10x slower",
              "explanationIfWrong": "They produce the exact same bytecode."
            },
            {
              "id": "D",
              "text": "class Person: is a SyntaxError",
              "explanationIfWrong": "Both are completely valid syntax."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python 3, omitting the parent class defaults to inheriting from object automatically."
        },
        "questionPool": [
          {
            "id": "q-10-1-class-hierarchies-inheritance-5-v1",
            "question": "What is the ultimate root base class of all classes in Python 3?",
            "options": [
              {
                "id": "A",
                "text": "object",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "type",
                "explanationIfWrong": "type is the metaclass; object is the root of the class inheritance hierarchy."
              },
              {
                "id": "C",
                "text": "BaseClass",
                "explanationIfWrong": "The built-in root class is named object."
              },
              {
                "id": "D",
                "text": "root",
                "explanationIfWrong": "The class is named object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "All Python 3 classes automatically and implicitly inherit from the root object class."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-5-v2",
            "question": "What is the difference between writing class Person: pass and class Person(object): pass in Python 3?",
            "options": [
              {
                "id": "A",
                "text": "There is no difference; Python 3 implicitly inherits from object automatically",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "class Person: creates an old-style class",
                "explanationIfWrong": "Old-style classes were eliminated in Python 3."
              },
              {
                "id": "C",
                "text": "class Person(object): runs 10x slower",
                "explanationIfWrong": "They produce the exact same bytecode."
              },
              {
                "id": "D",
                "text": "class Person: is a SyntaxError",
                "explanationIfWrong": "Both are completely valid syntax."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python 3, omitting the parent class defaults to inheriting from object automatically."
          },
          {
            "id": "q-10-1-class-hierarchies-inheritance-5-v3",
            "question": "Where does a class get its default __str__ and __repr__ implementations if none are defined?",
            "options": [
              {
                "id": "A",
                "text": "Inherited from the base object class",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "From the operating system shell",
                "explanationIfWrong": "Python's object class provides the default implementation."
              },
              {
                "id": "C",
                "text": "From the sys module",
                "explanationIfWrong": "It is inherited via the standard class hierarchy from object."
              },
              {
                "id": "D",
                "text": "They are generated by the hardware clock",
                "explanationIfWrong": "They are standard inherited Python methods."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Default dunder methods like __repr__ and __eq__ are inherited directly from the built-in object class."
          }
        ]
      }
    ]
  },
  {
    "id": "10-2-super-and-constructors",
    "number": "10.2",
    "title": "The super() Function & Constructors",
    "subtitle": "Delegate initialization to parent classes using super().__init__() and extend subclass state cleanly.",
    "readTime": "20 min",
    "objectives": [
      "Use super().__init__() to invoke parent class constructors reliably",
      "Pass necessary arguments up the hierarchy while binding new subclass attributes",
      "Understand the consequences of forgetting super().__init__() (uninitialized attributes)",
      "Distinguish between hardcoding Parent.__init__(self) vs modern super().__init__()",
      "Inspect class inheritance chains using __mro__ and .mro()",
      "Design clean constructor signatures across multi-level inheritance hierarchies"
    ],
    "theoryBlocks": [
      {
        "heading": "Why super() is Essential",
        "text": "When a subclass defines its own __init__ method, it overrides the parent class's constructor. Unless you explicitly call the parent constructor, the parent's attributes will never be initialized, causing an immediate AttributeError when any method attempts to access them. The built-in super() function provides a clean, dynamic way to delegate execution up to the parent class.",
        "codeSnippet": "class Person:\n    def __init__(self, name, email):\n        self.name = name\n        self.email = email\n\nclass Student(Person):\n    def __init__(self, name, email, student_id):\n        # Delegate name and email initialization to Person\n        super().__init__(name, email)\n        # Initialize Student-specific attribute\n        self.student_id = student_id\n\ns = Student(\"Alan Turing\", \"alan@cam.ac.uk\", \"STU-1912\")\nprint(f\"Name:       {s.name}\")        # Initialized by Person\nprint(f\"Email:      {s.email}\")       # Initialized by Person\nprint(f\"Student ID: {s.student_id}\")  # Initialized by Student",
        "terminalOutput": "Name:       Alan Turing\nEmail:      alan@cam.ac.uk\nStudent ID: STU-1912",
        "tip": "Notice that when calling super().__init__(...), you DO NOT pass self. Python binds the current instance automatically.",
        "mcq": {
          "id": "q-10-2-super-and-constructors-0-v1",
          "question": "What is the primary purpose of calling super().__init__() inside a subclass constructor?",
          "options": [
            {
              "id": "A",
              "text": "To invoke the parent class's constructor, ensuring base attributes and validations are initialized",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To convert the subclass into a dictionary",
              "explanationIfWrong": "super() delegates method execution, not type conversion."
            },
            {
              "id": "C",
              "text": "To delete the parent class from memory",
              "explanationIfWrong": "Classes are preserved in memory."
            },
            {
              "id": "D",
              "text": "To make all attributes global",
              "explanationIfWrong": "Attributes remain attached to self."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "super().__init__() executes the parent constructor to set up the inherited attributes on the current instance."
        },
        "retestMcq": {
          "id": "q-10-2-super-and-constructors-0-v2",
          "question": "Do you need to pass self when calling super().__init__(arg1, arg2)?",
          "options": [
            {
              "id": "A",
              "text": "No, super() automatically binds and passes the current instance (self) under the hood",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Yes, self must always be the first argument in super()",
              "explanationIfWrong": "super().__init__(self) is an error in Python 3."
            },
            {
              "id": "C",
              "text": "Only if the parent class has more than 3 attributes",
              "explanationIfWrong": "self is never passed explicitly to super()."
            },
            {
              "id": "D",
              "text": "Only in multi-threaded programs",
              "explanationIfWrong": "The zero-argument super() syntax handles instance binding automatically."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python 3, calling super() with no arguments automatically binds the current class and instance."
        },
        "questionPool": [
          {
            "id": "q-10-2-super-and-constructors-0-v1",
            "question": "What is the primary purpose of calling super().__init__() inside a subclass constructor?",
            "options": [
              {
                "id": "A",
                "text": "To invoke the parent class's constructor, ensuring base attributes and validations are initialized",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To convert the subclass into a dictionary",
                "explanationIfWrong": "super() delegates method execution, not type conversion."
              },
              {
                "id": "C",
                "text": "To delete the parent class from memory",
                "explanationIfWrong": "Classes are preserved in memory."
              },
              {
                "id": "D",
                "text": "To make all attributes global",
                "explanationIfWrong": "Attributes remain attached to self."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "super().__init__() executes the parent constructor to set up the inherited attributes on the current instance."
          },
          {
            "id": "q-10-2-super-and-constructors-0-v2",
            "question": "Do you need to pass self when calling super().__init__(arg1, arg2)?",
            "options": [
              {
                "id": "A",
                "text": "No, super() automatically binds and passes the current instance (self) under the hood",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, self must always be the first argument in super()",
                "explanationIfWrong": "super().__init__(self) is an error in Python 3."
              },
              {
                "id": "C",
                "text": "Only if the parent class has more than 3 attributes",
                "explanationIfWrong": "self is never passed explicitly to super()."
              },
              {
                "id": "D",
                "text": "Only in multi-threaded programs",
                "explanationIfWrong": "The zero-argument super() syntax handles instance binding automatically."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python 3, calling super() with no arguments automatically binds the current class and instance."
          },
          {
            "id": "q-10-2-super-and-constructors-0-v3",
            "question": "What is the key advantage of super().__init__() over hardcoding Parent.__init__(self, ...)?",
            "options": [
              {
                "id": "A",
                "text": "super() dynamically follows the Method Resolution Order (MRO), supporting cooperative multiple inheritance and class renaming without code changes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "super() runs in assembly language",
                "explanationIfWrong": "Both are Python method calls; super() is dynamic."
              },
              {
                "id": "C",
                "text": "Parent.__init__(self) is a syntax error in Python",
                "explanationIfWrong": "Hardcoding works, but is brittle and breaks multiple inheritance."
              },
              {
                "id": "D",
                "text": "super() uses zero CPU cycles",
                "explanationIfWrong": "super() is modern, maintainable Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "super() decouples the subclass from the hardcoded name of its parent and properly supports Python's MRO."
          }
        ]
      },
      {
        "heading": "The Danger of Forgetting super().__init__()",
        "text": "If a subclass implements its own __init__ but forgets to call super().__init__(), the parent constructor NEVER runs. Any inherited methods that rely on parent attributes will crash with an AttributeError the moment they are called.",
        "codeSnippet": "class BankAccount:\n    def __init__(self, balance):\n        self._balance = float(balance)\n    \n    def get_balance(self):\n        return self._balance\n\nclass BuggySavingsAccount(BankAccount):\n    def __init__(self, interest_rate):\n        # OOPS! Forgot super().__init__(balance)!\n        self.interest_rate = interest_rate\n\nacc = BuggySavingsAccount(0.05)\nprint(f\"Interest: {acc.interest_rate}\")\ntry:\n    # Crashes because self._balance was never initialized!\n    print(acc.get_balance())\nexcept AttributeError as err:\n    print(f\"CRASH: {err}\")",
        "terminalOutput": "Interest: 0.05\nCRASH: 'BuggySavingsAccount' object has no attribute '_balance'",
        "warning": "Always call super().__init__(...) whenever your subclass defines an __init__ method and inherits from a class with initialized state.",
        "mcq": {
          "id": "q-10-2-super-and-constructors-1-v1",
          "question": "What error typically occurs if a subclass defines its own __init__ but forgets to call super().__init__()?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError when calling inherited methods that rely on attributes set up by the parent constructor",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "SyntaxError at file import time",
              "explanationIfWrong": "The code is syntactically valid; it fails at runtime when accessing missing attributes."
            },
            {
              "id": "C",
              "text": "MemoryError",
              "explanationIfWrong": "Attributes are simply missing."
            },
            {
              "id": "D",
              "text": "Infinite recursion loop",
              "explanationIfWrong": "Recursion happens when methods call themselves; forgetting super leaves state uninitialized."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because the parent constructor never executed, the instance lacks the parent's attributes, causing AttributeError."
        },
        "retestMcq": {
          "id": "q-10-2-super-and-constructors-1-v2",
          "question": "How should BuggySavingsAccount's constructor be fixed to accept both balance and interest_rate?",
          "options": [
            {
              "id": "A",
              "text": "def __init__(self, balance, interest_rate): super().__init__(balance); self.interest_rate = interest_rate",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "def __init__(self): balance = 0",
              "explanationIfWrong": "Local variables do not set instance attributes."
            },
            {
              "id": "C",
              "text": "def __init__(self): return BankAccount",
              "explanationIfWrong": "__init__ cannot return values."
            },
            {
              "id": "D",
              "text": "Delete the class",
              "explanationIfWrong": "Calling super().__init__(balance) properly initializes the parent."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Accepting both parameters and passing the parent parameter to super().__init__(balance) properly initializes both layers."
        },
        "questionPool": [
          {
            "id": "q-10-2-super-and-constructors-1-v1",
            "question": "What error typically occurs if a subclass defines its own __init__ but forgets to call super().__init__()?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError when calling inherited methods that rely on attributes set up by the parent constructor",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "SyntaxError at file import time",
                "explanationIfWrong": "The code is syntactically valid; it fails at runtime when accessing missing attributes."
              },
              {
                "id": "C",
                "text": "MemoryError",
                "explanationIfWrong": "Attributes are simply missing."
              },
              {
                "id": "D",
                "text": "Infinite recursion loop",
                "explanationIfWrong": "Recursion happens when methods call themselves; forgetting super leaves state uninitialized."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because the parent constructor never executed, the instance lacks the parent's attributes, causing AttributeError."
          },
          {
            "id": "q-10-2-super-and-constructors-1-v2",
            "question": "How should BuggySavingsAccount's constructor be fixed to accept both balance and interest_rate?",
            "options": [
              {
                "id": "A",
                "text": "def __init__(self, balance, interest_rate): super().__init__(balance); self.interest_rate = interest_rate",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "def __init__(self): balance = 0",
                "explanationIfWrong": "Local variables do not set instance attributes."
              },
              {
                "id": "C",
                "text": "def __init__(self): return BankAccount",
                "explanationIfWrong": "__init__ cannot return values."
              },
              {
                "id": "D",
                "text": "Delete the class",
                "explanationIfWrong": "Calling super().__init__(balance) properly initializes the parent."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Accepting both parameters and passing the parent parameter to super().__init__(balance) properly initializes both layers."
          },
          {
            "id": "q-10-2-super-and-constructors-1-v3",
            "question": "If a subclass does NOT define an __init__ method at all, does it suffer from this uninitialized attribute bug?",
            "options": [
              {
                "id": "A",
                "text": "No, because without an __init__ in the subclass, Python automatically executes the parent's __init__ directly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, all subclasses must define __init__",
                "explanationIfWrong": "Omitting __init__ safely inherits the parent constructor."
              },
              {
                "id": "C",
                "text": "Only if the parent has no attributes",
                "explanationIfWrong": "The parent constructor executes normally."
              },
              {
                "id": "D",
                "text": "It raises a TypeError",
                "explanationIfWrong": "Inheriting the parent constructor is standard."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When the subclass defines no __init__, Python executes the parent constructor automatically with no risk of uninitialized state."
          }
        ]
      },
      {
        "heading": "Extending State Across Multi-Level Hierarchies",
        "text": "Inheritance can span multiple levels: Grandparent -> Parent -> Child. Each class in the hierarchy initializes its own specific attributes while using super().__init__() to pass the remaining parameters upward.",
        "codeSnippet": "class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n\nclass MotorizedVehicle(Vehicle):\n    def __init__(self, brand, engine_type):\n        super().__init__(brand)  # Pass brand up to Vehicle\n        self.engine_type = engine_type\n\nclass ElectricCar(MotorizedVehicle):\n    def __init__(self, brand, battery_kwh):\n        super().__init__(brand, \"Electric\")  # Pass brand and engine_type up\n        self.battery_kwh = battery_kwh\n\ntesla = ElectricCar(\"Tesla Model S\", 100)\nprint(f\"Brand:   {tesla.brand}\")\nprint(f\"Engine:  {tesla.engine_type}\")\nprint(f\"Battery: {tesla.battery_kwh} kWh\")",
        "terminalOutput": "Brand:   Tesla Model S\nEngine:  Electric\nBattery: 100 kWh",
        "tip": "Each class in a multi-level hierarchy is responsible only for its own attributes, delegating the rest to its superclass.",
        "mcq": {
          "id": "q-10-2-super-and-constructors-2-v1",
          "question": "In the 3-level hierarchy above, what does ElectricCar's call super().__init__(brand, 'Electric') invoke?",
          "options": [
            {
              "id": "A",
              "text": "MotorizedVehicle.__init__, which in turn calls Vehicle.__init__",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Vehicle.__init__ directly, skipping MotorizedVehicle",
              "explanationIfWrong": "super() resolves to the immediate next class in the MRO (MotorizedVehicle)."
            },
            {
              "id": "C",
              "text": "object.__init__",
              "explanationIfWrong": "It follows the inheritance chain step-by-step."
            },
            {
              "id": "D",
              "text": "A new thread",
              "explanationIfWrong": "Calls are synchronous in Python."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "super() delegates to the next class in the MRO, creating a clean chain of initialization up to the root."
        },
        "retestMcq": {
          "id": "q-10-2-super-and-constructors-2-v2",
          "question": "What is isinstance(tesla, Vehicle) in the multi-level hierarchy?",
          "options": [
            {
              "id": "A",
              "text": "True, because ElectricCar indirectly inherits from Vehicle",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "False, because MotorizedVehicle is in the middle",
              "explanationIfWrong": "isinstance traverses all ancestor classes."
            },
            {
              "id": "C",
              "text": "TypeError",
              "explanationIfWrong": "isinstance handles multi-level hierarchies cleanly."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "Returns boolean True."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "isinstance() checks the complete ancestry of the object, so tesla is an instance of ElectricCar, MotorizedVehicle, Vehicle, and object."
        },
        "questionPool": [
          {
            "id": "q-10-2-super-and-constructors-2-v1",
            "question": "In the 3-level hierarchy above, what does ElectricCar's call super().__init__(brand, 'Electric') invoke?",
            "options": [
              {
                "id": "A",
                "text": "MotorizedVehicle.__init__, which in turn calls Vehicle.__init__",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Vehicle.__init__ directly, skipping MotorizedVehicle",
                "explanationIfWrong": "super() resolves to the immediate next class in the MRO (MotorizedVehicle)."
              },
              {
                "id": "C",
                "text": "object.__init__",
                "explanationIfWrong": "It follows the inheritance chain step-by-step."
              },
              {
                "id": "D",
                "text": "A new thread",
                "explanationIfWrong": "Calls are synchronous in Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "super() delegates to the next class in the MRO, creating a clean chain of initialization up to the root."
          },
          {
            "id": "q-10-2-super-and-constructors-2-v2",
            "question": "What is isinstance(tesla, Vehicle) in the multi-level hierarchy?",
            "options": [
              {
                "id": "A",
                "text": "True, because ElectricCar indirectly inherits from Vehicle",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "False, because MotorizedVehicle is in the middle",
                "explanationIfWrong": "isinstance traverses all ancestor classes."
              },
              {
                "id": "C",
                "text": "TypeError",
                "explanationIfWrong": "isinstance handles multi-level hierarchies cleanly."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "Returns boolean True."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "isinstance() checks the complete ancestry of the object, so tesla is an instance of ElectricCar, MotorizedVehicle, Vehicle, and object."
          },
          {
            "id": "q-10-2-super-and-constructors-2-v3",
            "question": "How many total instance attributes does the tesla object possess in the example above?",
            "options": [
              {
                "id": "A",
                "text": "3 attributes: brand, engine_type, and battery_kwh",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Only 1 (battery_kwh)",
                "explanationIfWrong": "All 3 constructors ran and attached their attributes to the instance."
              },
              {
                "id": "C",
                "text": "Zero",
                "explanationIfWrong": "All 3 attributes are bound to self."
              },
              {
                "id": "D",
                "text": "100",
                "explanationIfWrong": "100 is the battery capacity."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each level of the hierarchy initialized its respective attribute onto the single shared self instance."
          }
        ]
      },
      {
        "heading": "Method Resolution Order (MRO)",
        "text": "Method Resolution Order (MRO) is the exact order in which Python searches for an attribute or method across an inheritance hierarchy. You can inspect any class's MRO using the __mro__ attribute or the .mro() method. Python uses the C3 Linearization algorithm to guarantee a consistent, predictable search path.",
        "codeSnippet": "class A: pass\nclass B(A): pass\nclass C(B): pass\n\n# Inspecting the MRO tuple\nprint(\"MRO of C:\")\nfor idx, cls in enumerate(C.__mro__):\n    print(f\"  {idx + 1}. {cls.__name__}\")",
        "terminalOutput": "MRO of C:\n  1. C\n  2. B\n  3. A\n  4. object",
        "tip": "When you call obj.method(), Python checks each class in the MRO from left to right, executing the first matching method it finds.",
        "mcq": {
          "id": "q-10-2-super-and-constructors-3-v1",
          "question": "What is Python's Method Resolution Order (MRO)?",
          "options": [
            {
              "id": "A",
              "text": "The ordered sequence of classes Python searches when looking up methods or attributes on an object",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A list of CPU instructions generated by the compiler",
              "explanationIfWrong": "MRO is class lookup order in the object model."
            },
            {
              "id": "C",
              "text": "The order in which files are imported in a directory",
              "explanationIfWrong": "MRO governs class attribute resolution."
            },
            {
              "id": "D",
              "text": "A sorting algorithm for numbers",
              "explanationIfWrong": "MRO searches class ancestry."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The MRO defines the exact path Python walks through ancestor classes when resolving attribute and method lookups."
        },
        "retestMcq": {
          "id": "q-10-2-super-and-constructors-3-v2",
          "question": "How can you view the MRO of a class named Employee in code?",
          "options": [
            {
              "id": "A",
              "text": "Employee.__mro__ or Employee.mro()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Employee.get_order()",
              "explanationIfWrong": "The standard attribute is __mro__ or method .mro()."
            },
            {
              "id": "C",
              "text": "dir(Employee)[0]",
              "explanationIfWrong": "dir() lists attribute names alphabetically."
            },
            {
              "id": "D",
              "text": "sys.mro(Employee)",
              "explanationIfWrong": "__mro__ is an attribute on the class itself."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "All Python classes expose their MRO via the __mro__ tuple or the .mro() method."
        },
        "questionPool": [
          {
            "id": "q-10-2-super-and-constructors-3-v1",
            "question": "What is Python's Method Resolution Order (MRO)?",
            "options": [
              {
                "id": "A",
                "text": "The ordered sequence of classes Python searches when looking up methods or attributes on an object",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A list of CPU instructions generated by the compiler",
                "explanationIfWrong": "MRO is class lookup order in the object model."
              },
              {
                "id": "C",
                "text": "The order in which files are imported in a directory",
                "explanationIfWrong": "MRO governs class attribute resolution."
              },
              {
                "id": "D",
                "text": "A sorting algorithm for numbers",
                "explanationIfWrong": "MRO searches class ancestry."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The MRO defines the exact path Python walks through ancestor classes when resolving attribute and method lookups."
          },
          {
            "id": "q-10-2-super-and-constructors-3-v2",
            "question": "How can you view the MRO of a class named Employee in code?",
            "options": [
              {
                "id": "A",
                "text": "Employee.__mro__ or Employee.mro()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Employee.get_order()",
                "explanationIfWrong": "The standard attribute is __mro__ or method .mro()."
              },
              {
                "id": "C",
                "text": "dir(Employee)[0]",
                "explanationIfWrong": "dir() lists attribute names alphabetically."
              },
              {
                "id": "D",
                "text": "sys.mro(Employee)",
                "explanationIfWrong": "__mro__ is an attribute on the class itself."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "All Python classes expose their MRO via the __mro__ tuple or the .mro() method."
          },
          {
            "id": "q-10-2-super-and-constructors-3-v3",
            "question": "Which algorithm does Python use to construct the MRO?",
            "options": [
              {
                "id": "A",
                "text": "C3 Linearization algorithm",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Binary Search",
                "explanationIfWrong": "Binary search is for sorted arrays."
              },
              {
                "id": "C",
                "text": "Dijkstra's Algorithm",
                "explanationIfWrong": "Dijkstra is for shortest path in graphs."
              },
              {
                "id": "D",
                "text": "Quicksort",
                "explanationIfWrong": "Python uses C3 Linearization for MRO."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python adopted the C3 Linearization algorithm in Python 2.3 to guarantee monotonic, collision-free MRO order."
          }
        ]
      },
      {
        "heading": "Keyword Arguments in Inherited Constructors",
        "text": "When constructors have many parameters, passing arguments by keyword makes code readable and avoids parameter position bugs across deep hierarchies.",
        "codeSnippet": "class BaseConfig:\n    def __init__(self, env=\"development\", debug=True):\n        self.env = env\n        self.debug = debug\n\nclass DatabaseConfig(BaseConfig):\n    def __init__(self, host=\"localhost\", port=5432, **kwargs):\n        # Pass remaining keyword arguments up to BaseConfig\n        super().__init__(**kwargs)\n        self.host = host\n        self.port = port\n\ncfg = DatabaseConfig(host=\"db.internal\", env=\"production\", debug=False)\nprint(f\"Host:  {cfg.host}:{cfg.port}\")\nprint(f\"Env:   {cfg.env} (Debug={cfg.debug})\")",
        "terminalOutput": "Host:  db.internal:5432\nEnv:   production (Debug=False)",
        "tip": "Using **kwargs in subclass constructors allows flexible forwarding of configuration options to base classes without manually repeating parameter names.",
        "mcq": {
          "id": "q-10-2-super-and-constructors-4-v1",
          "question": "What is the purpose of passing **kwargs to super().__init__(**kwargs)?",
          "options": [
            {
              "id": "A",
              "text": "To forward arbitrary keyword arguments up to parent class constructors without manually re-listing every parameter",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To convert keyword arguments into a list of tuples",
              "explanationIfWrong": "**kwargs unpacks a dictionary of keyword arguments."
            },
            {
              "id": "C",
              "text": "To encrypt passwords",
              "explanationIfWrong": "kwargs is standard Python argument forwarding."
            },
            {
              "id": "D",
              "text": "To shut down the interpreter on error",
              "explanationIfWrong": "It enables flexible constructor delegation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "**kwargs unpacks remaining keyword arguments and passes them up the inheritance chain."
        },
        "retestMcq": {
          "id": "q-10-2-super-and-constructors-4-v2",
          "question": "In DatabaseConfig(host='db.internal', env='production', debug=False), which class receives env and debug?",
          "options": [
            {
              "id": "A",
              "text": "BaseConfig via super().__init__(**kwargs)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Only DatabaseConfig",
              "explanationIfWrong": "DatabaseConfig pulls host, and forwards env and debug via **kwargs."
            },
            {
              "id": "C",
              "text": "They are discarded as unused",
              "explanationIfWrong": "kwargs forwards them directly to BaseConfig."
            },
            {
              "id": "D",
              "text": "The operating system environment",
              "explanationIfWrong": "They initialize attributes on self."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "DatabaseConfig consumes host and port, forwarding the remaining kwargs (env, debug) up to BaseConfig."
        },
        "questionPool": [
          {
            "id": "q-10-2-super-and-constructors-4-v1",
            "question": "What is the purpose of passing **kwargs to super().__init__(**kwargs)?",
            "options": [
              {
                "id": "A",
                "text": "To forward arbitrary keyword arguments up to parent class constructors without manually re-listing every parameter",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To convert keyword arguments into a list of tuples",
                "explanationIfWrong": "**kwargs unpacks a dictionary of keyword arguments."
              },
              {
                "id": "C",
                "text": "To encrypt passwords",
                "explanationIfWrong": "kwargs is standard Python argument forwarding."
              },
              {
                "id": "D",
                "text": "To shut down the interpreter on error",
                "explanationIfWrong": "It enables flexible constructor delegation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "**kwargs unpacks remaining keyword arguments and passes them up the inheritance chain."
          },
          {
            "id": "q-10-2-super-and-constructors-4-v2",
            "question": "In DatabaseConfig(host='db.internal', env='production', debug=False), which class receives env and debug?",
            "options": [
              {
                "id": "A",
                "text": "BaseConfig via super().__init__(**kwargs)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Only DatabaseConfig",
                "explanationIfWrong": "DatabaseConfig pulls host, and forwards env and debug via **kwargs."
              },
              {
                "id": "C",
                "text": "They are discarded as unused",
                "explanationIfWrong": "kwargs forwards them directly to BaseConfig."
              },
              {
                "id": "D",
                "text": "The operating system environment",
                "explanationIfWrong": "They initialize attributes on self."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "DatabaseConfig consumes host and port, forwarding the remaining kwargs (env, debug) up to BaseConfig."
          },
          {
            "id": "q-10-2-super-and-constructors-4-v3",
            "question": "What happens if a caller passes an unexpected keyword argument (e.g. unknown=123) and object.__init__ receives it?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: object.__init__() takes exactly one argument (the instance)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It is silently ignored",
                "explanationIfWrong": "object.__init__ rejects unexpected arguments with TypeError."
              },
              {
                "id": "C",
                "text": "It saves it to a text file",
                "explanationIfWrong": "A runtime exception is raised."
              },
              {
                "id": "D",
                "text": "It converts unknown to a string",
                "explanationIfWrong": "A TypeError is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "object.__init__ takes no keyword arguments; any unconsumed kwargs will trigger a TypeError at the top of the chain."
          }
        ]
      },
      {
        "heading": "Order of Execution in Constructors",
        "text": "A crucial nuance in constructor design is deciding whether to call super().__init__() at the start or end of the subclass constructor. In almost all cases, call super().__init__() FIRST, so that base attributes and invariants are fully established before the subclass adds its own specialized state.",
        "codeSnippet": "class BaseLogger:\n    def __init__(self, service_name):\n        self.service_name = service_name\n        self.logs = []\n        self.log(f\"Service '{service_name}' initialized.\")\n    \n    def log(self, message):\n        self.logs.append(message)\n\nclass AuditLogger(BaseLogger):\n    def __init__(self, service_name, audit_id):\n        # 1. Initialize base state first!\n        super().__init__(service_name)\n        # 2. Then initialize subclass attributes:\n        self.audit_id = audit_id\n        self.log(f\"Audit ID assigned: {audit_id}\")\n\nal = AuditLogger(\"PaymentService\", \"AUD-9901\")\nprint(\"Logs captured:\")\nfor msg in al.logs:\n    print(f\"  \u2022 {msg}\")",
        "terminalOutput": "Logs captured:\n  \u2022 Service 'PaymentService' initialized.\n  \u2022 Audit ID assigned: AUD-9901",
        "tip": "Calling super().__init__() at the beginning ensures that base collections (like self.logs = []) exist before any subclass code tries to append to them.",
        "mcq": {
          "id": "q-10-2-super-and-constructors-5-v1",
          "question": "Why is it best practice to invoke super().__init__() at the beginning of a subclass constructor?",
          "options": [
            {
              "id": "A",
              "text": "To guarantee that base class attributes and structures exist before the subclass executes logic or calls inherited methods",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because Python raises a SyntaxError if super() is not on line 1",
              "explanationIfWrong": "super() can appear anywhere in the body, but calling it first is safe design."
            },
            {
              "id": "C",
              "text": "Because calling super() last wipes out subclass attributes",
              "explanationIfWrong": "Calling it first ensures parent attributes exist before child logic runs."
            },
            {
              "id": "D",
              "text": "To prevent functions from returning",
              "explanationIfWrong": "It ensures reliable object initialization."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Calling super().__init__() first ensures the base foundation is established before the subclass executes logic that might depend on it."
        },
        "retestMcq": {
          "id": "q-10-2-super-and-constructors-5-v2",
          "question": "What would happen if AuditLogger called self.log() BEFORE super().__init__()?",
          "options": [
            {
              "id": "A",
              "text": "AttributeError: 'AuditLogger' object has no attribute 'logs', because self.logs is initialized inside BaseLogger.__init__",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It would run fine with no errors",
              "explanationIfWrong": "self.logs does not exist yet, so .append() fails."
            },
            {
              "id": "C",
              "text": "It would delete the log file",
              "explanationIfWrong": "It fails with an in-memory AttributeError."
            },
            {
              "id": "D",
              "text": "The log is printed to the printer",
              "explanationIfWrong": "AttributeError halts execution."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "self.log attempts to access self.logs, which does not exist until BaseLogger.__init__ executes."
        },
        "questionPool": [
          {
            "id": "q-10-2-super-and-constructors-5-v1",
            "question": "Why is it best practice to invoke super().__init__() at the beginning of a subclass constructor?",
            "options": [
              {
                "id": "A",
                "text": "To guarantee that base class attributes and structures exist before the subclass executes logic or calls inherited methods",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python raises a SyntaxError if super() is not on line 1",
                "explanationIfWrong": "super() can appear anywhere in the body, but calling it first is safe design."
              },
              {
                "id": "C",
                "text": "Because calling super() last wipes out subclass attributes",
                "explanationIfWrong": "Calling it first ensures parent attributes exist before child logic runs."
              },
              {
                "id": "D",
                "text": "To prevent functions from returning",
                "explanationIfWrong": "It ensures reliable object initialization."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling super().__init__() first ensures the base foundation is established before the subclass executes logic that might depend on it."
          },
          {
            "id": "q-10-2-super-and-constructors-5-v2",
            "question": "What would happen if AuditLogger called self.log() BEFORE super().__init__()?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: 'AuditLogger' object has no attribute 'logs', because self.logs is initialized inside BaseLogger.__init__",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It would run fine with no errors",
                "explanationIfWrong": "self.logs does not exist yet, so .append() fails."
              },
              {
                "id": "C",
                "text": "It would delete the log file",
                "explanationIfWrong": "It fails with an in-memory AttributeError."
              },
              {
                "id": "D",
                "text": "The log is printed to the printer",
                "explanationIfWrong": "AttributeError halts execution."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "self.log attempts to access self.logs, which does not exist until BaseLogger.__init__ executes."
          },
          {
            "id": "q-10-2-super-and-constructors-5-v3",
            "question": "In the example, how many entries are in al.logs after initialization?",
            "options": [
              {
                "id": "A",
                "text": "2 entries: the service initialization log and the audit ID log",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "1 entry",
                "explanationIfWrong": "BaseLogger added 1 log and AuditLogger added 1 log."
              },
              {
                "id": "C",
                "text": "Zero entries",
                "explanationIfWrong": "Both logs were appended to self.logs."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "self.logs contains 2 string messages."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "BaseLogger's constructor logged the service creation, and AuditLogger's constructor logged the audit ID assignment."
          }
        ]
      }
    ]
  },
  {
    "id": "10-3-method-overriding-extension",
    "number": "10.3",
    "title": "Method Overriding & Extension",
    "subtitle": "Customize inherited behaviors by redefining methods, augmenting logic with super(), and overriding dunder methods.",
    "readTime": "20 min",
    "objectives": [
      "Redefine inherited parent methods in subclasses (method overriding)",
      "Distinguish between complete method replacement and method extension",
      "Augment parent logic cleanly using super().method_name()",
      "Override __str__ and __repr__ in subclasses to include specialized attributes",
      "Implement composite equality (__eq__) across parent and child class fields",
      "Avoid fragile base class pitfalls by maintaining consistent return types and signatures"
    ],
    "theoryBlocks": [
      {
        "heading": "What is Method Overriding?",
        "text": "Method overriding occurs when a subclass defines a method with the exact same name as a method in its parent class. When the method is invoked on an instance of the subclass, Python's Method Resolution Order (MRO) finds and executes the subclass's version, completely bypassing the parent's implementation.",
        "codeSnippet": "class Animal:\n    def make_sound(self):\n        return \"Generic animal noise...\"\n\nclass Cat(Animal):\n    # Overriding make_sound for Cat\n    def make_sound(self):\n        return \"Meow!\"\n\nclass Cow(Animal):\n    # Overriding make_sound for Cow\n    def make_sound(self):\n        return \"Moo!\"\n\nprint(Animal().make_sound())\nprint(Cat().make_sound())\nprint(Cow().make_sound())",
        "terminalOutput": "Generic animal noise...\nMeow!\nMoo!",
        "tip": "Method overriding allows each derived subclass to fulfill a general interface with its own specialized behavior.",
        "mcq": {
          "id": "q-10-3-method-overriding-extension-0-v1",
          "question": "What is method overriding in object-oriented programming?",
          "options": [
            {
              "id": "A",
              "text": "A subclass defining a method with the same name as an inherited parent method, replacing or modifying its behavior for instances of the subclass",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A function that deletes a method from memory",
              "explanationIfWrong": "Overriding replaces execution for instances of that class."
            },
            {
              "id": "C",
              "text": "Calling a method 100 times in a loop",
              "explanationIfWrong": "Overriding is redefining a method in a derived class."
            },
            {
              "id": "D",
              "text": "Writing code in an external text file",
              "explanationIfWrong": "Overriding is a core OOP language feature."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Overriding redefines an inherited method so subclass instances execute their own specialized version."
        },
        "retestMcq": {
          "id": "q-10-3-method-overriding-extension-0-v2",
          "question": "When Cat().make_sound() is called, why does it return 'Meow!' instead of 'Generic animal noise...'?",
          "options": [
            {
              "id": "A",
              "text": "Python searches the subclass first; finding make_sound on Cat, it executes it and stops searching",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The Cat class deleted the Animal class",
              "explanationIfWrong": "Animal remains intact for other instances."
            },
            {
              "id": "C",
              "text": "The operating system chooses at random",
              "explanationIfWrong": "Python MRO is deterministic and inspects Cat first."
            },
            {
              "id": "D",
              "text": "Animal.make_sound is only called if Cat crashes",
              "explanationIfWrong": "Cat's definition overrides the parent."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "MRO searches the instance's class before checking parent classes, executing the subclass method."
        },
        "questionPool": [
          {
            "id": "q-10-3-method-overriding-extension-0-v1",
            "question": "What is method overriding in object-oriented programming?",
            "options": [
              {
                "id": "A",
                "text": "A subclass defining a method with the same name as an inherited parent method, replacing or modifying its behavior for instances of the subclass",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A function that deletes a method from memory",
                "explanationIfWrong": "Overriding replaces execution for instances of that class."
              },
              {
                "id": "C",
                "text": "Calling a method 100 times in a loop",
                "explanationIfWrong": "Overriding is redefining a method in a derived class."
              },
              {
                "id": "D",
                "text": "Writing code in an external text file",
                "explanationIfWrong": "Overriding is a core OOP language feature."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Overriding redefines an inherited method so subclass instances execute their own specialized version."
          },
          {
            "id": "q-10-3-method-overriding-extension-0-v2",
            "question": "When Cat().make_sound() is called, why does it return 'Meow!' instead of 'Generic animal noise...'?",
            "options": [
              {
                "id": "A",
                "text": "Python searches the subclass first; finding make_sound on Cat, it executes it and stops searching",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The Cat class deleted the Animal class",
                "explanationIfWrong": "Animal remains intact for other instances."
              },
              {
                "id": "C",
                "text": "The operating system chooses at random",
                "explanationIfWrong": "Python MRO is deterministic and inspects Cat first."
              },
              {
                "id": "D",
                "text": "Animal.make_sound is only called if Cat crashes",
                "explanationIfWrong": "Cat's definition overrides the parent."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "MRO searches the instance's class before checking parent classes, executing the subclass method."
          },
          {
            "id": "q-10-3-method-overriding-extension-0-v3",
            "question": "Does overriding make_sound in Cat affect how Animal().make_sound() behaves?",
            "options": [
              {
                "id": "A",
                "text": "No, instances of Animal still execute Animal's original version",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, Animal now returns 'Meow!' as well",
                "explanationIfWrong": "Subclass overrides do not alter parent class behavior."
              },
              {
                "id": "C",
                "text": "Animal is deleted",
                "explanationIfWrong": "Parent classes are completely unaffected by subclass overrides."
              },
              {
                "id": "D",
                "text": "It raises a CollisionError",
                "explanationIfWrong": "Overriding is standard, valid OOP."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Subclass overrides apply strictly to instances of that subclass (and its descendants); the parent class remains unaffected."
          }
        ]
      },
      {
        "heading": "Extending Methods with super()",
        "text": "Often, you don't want to completely replace the parent method's behavior; you want to extend (augment) it. By calling super().method_name() inside the overriding method, you run the parent's logic first, capture or use its result, and then perform additional subclass-specific operations.",
        "codeSnippet": "class Employee:\n    def __init__(self, name, base_salary):\n        self.name = name\n        self.base_salary = float(base_salary)\n    \n    def calculate_pay(self):\n        return self.base_salary\n\nclass SalesPerson(Employee):\n    def __init__(self, name, base_salary, commission):\n        super().__init__(name, base_salary)\n        self.commission = float(commission)\n    \n    # Augmenting the parent's calculate_pay method!\n    def calculate_pay(self):\n        # 1. Get base pay from parent\n        base = super().calculate_pay()\n        # 2. Add sales commission\n        return base + self.commission\n\nsp = SalesPerson(\"Maya\", 4000, 1500)\nprint(f\"{sp.name} Total Pay: ${sp.calculate_pay():,.2f}\")",
        "terminalOutput": "Maya Total Pay: $5,500.00",
        "tip": "Extending via super() honors the DRY (Don't Repeat Yourself) principle by reusing parent calculations rather than rewriting them.",
        "mcq": {
          "id": "q-10-3-method-overriding-extension-1-v1",
          "question": "What is the difference between complete method replacement and method extension?",
          "options": [
            {
              "id": "A",
              "text": "Replacement ignores the parent method entirely; extension calls super().method() to execute parent logic and augments it",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Extension is only for constructors",
              "explanationIfWrong": "Any method can be extended using super().method()."
            },
            {
              "id": "C",
              "text": "Replacement runs in C; extension runs in Python",
              "explanationIfWrong": "Both run in Python."
            },
            {
              "id": "D",
              "text": "They are identical terms",
              "explanationIfWrong": "Extension reuses parent logic; replacement discards it."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Method extension reuses the parent's implementation via super().method() and builds additional behavior on top."
        },
        "retestMcq": {
          "id": "q-10-3-method-overriding-extension-1-v2",
          "question": "In the SalesPerson example, what does super().calculate_pay() return?",
          "options": [
            {
              "id": "A",
              "text": "4000.0 (the base salary calculated by Employee.calculate_pay)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "5500.0",
              "explanationIfWrong": "5500 is the final total pay after adding commission."
            },
            {
              "id": "C",
              "text": "1500.0",
              "explanationIfWrong": "1500 is the commission attribute."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "Employee.calculate_pay returns self.base_salary."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "super().calculate_pay() calls Employee's calculate_pay, returning 4000.0."
        },
        "questionPool": [
          {
            "id": "q-10-3-method-overriding-extension-1-v1",
            "question": "What is the difference between complete method replacement and method extension?",
            "options": [
              {
                "id": "A",
                "text": "Replacement ignores the parent method entirely; extension calls super().method() to execute parent logic and augments it",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Extension is only for constructors",
                "explanationIfWrong": "Any method can be extended using super().method()."
              },
              {
                "id": "C",
                "text": "Replacement runs in C; extension runs in Python",
                "explanationIfWrong": "Both run in Python."
              },
              {
                "id": "D",
                "text": "They are identical terms",
                "explanationIfWrong": "Extension reuses parent logic; replacement discards it."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Method extension reuses the parent's implementation via super().method() and builds additional behavior on top."
          },
          {
            "id": "q-10-3-method-overriding-extension-1-v2",
            "question": "In the SalesPerson example, what does super().calculate_pay() return?",
            "options": [
              {
                "id": "A",
                "text": "4000.0 (the base salary calculated by Employee.calculate_pay)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "5500.0",
                "explanationIfWrong": "5500 is the final total pay after adding commission."
              },
              {
                "id": "C",
                "text": "1500.0",
                "explanationIfWrong": "1500 is the commission attribute."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "Employee.calculate_pay returns self.base_salary."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "super().calculate_pay() calls Employee's calculate_pay, returning 4000.0."
          },
          {
            "id": "q-10-3-method-overriding-extension-1-v3",
            "question": "Can super() be called on methods other than __init__?",
            "options": [
              {
                "id": "A",
                "text": "Yes, super() can be used to call ANY method defined in the parent class (e.g. super().save(), super().render())",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, super() is strictly restricted to __init__",
                "explanationIfWrong": "super() works on all methods throughout the class."
              },
              {
                "id": "C",
                "text": "Only on methods that return integers",
                "explanationIfWrong": "super() works with any return type."
              },
              {
                "id": "D",
                "text": "Only if decorated with @classmethod",
                "explanationIfWrong": "super() works in instance methods, class methods, etc."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "super() is a general delegation mechanism that can call any method in the parent class hierarchy."
          }
        ]
      },
      {
        "heading": "Overriding __str__ and __repr__ in Subclasses",
        "text": "When a subclass adds attributes, its string representations should reflect those new fields. You can override __str__ in the subclass and call super().__str__() to build upon the parent's formatted string.",
        "codeSnippet": "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    \n    def __str__(self):\n        return f\"'{self.title}' by {self.author}\"\n\nclass AudioBook(Book):\n    def __init__(self, title, author, length_minutes):\n        super().__init__(title, author)\n        self.length_minutes = length_minutes\n    \n    def __str__(self):\n        # Reuse parent formatting and append audiobook details!\n        base_str = super().__str__()\n        hours = self.length_minutes // 60\n        mins = self.length_minutes % 60\n        return f\"{base_str} [Audio: {hours}h {mins}m]\"\n\nab = AudioBook(\"Atomic Habits\", \"James Clear\", 335)\nprint(ab)",
        "terminalOutput": "'Atomic Habits' by James Clear [Audio: 5h 35m]",
        "tip": "Calling super().__str__() ensures that if the parent class's display format changes, subclasses automatically inherit the updated base formatting.",
        "mcq": {
          "id": "q-10-3-method-overriding-extension-2-v1",
          "question": "What is the benefit of calling super().__str__() inside a subclass's __str__ method?",
          "options": [
            {
              "id": "A",
              "text": "It reuses the parent class's string formatting logic, appending subclass fields without repeating base formatting code",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It converts the string to an integer",
              "explanationIfWrong": "Strings format text output."
            },
            {
              "id": "C",
              "text": "It speeds up network socket connections",
              "explanationIfWrong": "__str__ formats data for display in memory."
            },
            {
              "id": "D",
              "text": "It prevents subclasses from being instantiated",
              "explanationIfWrong": "It enhances string representations."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Reusing super().__str__() keeps formatting DRY and consistent across inheritance trees."
        },
        "retestMcq": {
          "id": "q-10-3-method-overriding-extension-2-v2",
          "question": "Given ab = AudioBook('Dune', 'Frank Herbert', 120), what is print(ab)?",
          "options": [
            {
              "id": "A",
              "text": "'Dune' by Frank Herbert [Audio: 2h 0m]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "<AudioBook object at 0x...>",
              "explanationIfWrong": "Custom __str__ is executed."
            },
            {
              "id": "C",
              "text": "'Dune' by Frank Herbert",
              "explanationIfWrong": "AudioBook's __str__ appends the audio duration."
            },
            {
              "id": "D",
              "text": "120",
              "explanationIfWrong": "print(ab) outputs the formatted string."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The combined output merges the base Book title/author with the AudioBook duration."
        },
        "questionPool": [
          {
            "id": "q-10-3-method-overriding-extension-2-v1",
            "question": "What is the benefit of calling super().__str__() inside a subclass's __str__ method?",
            "options": [
              {
                "id": "A",
                "text": "It reuses the parent class's string formatting logic, appending subclass fields without repeating base formatting code",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It converts the string to an integer",
                "explanationIfWrong": "Strings format text output."
              },
              {
                "id": "C",
                "text": "It speeds up network socket connections",
                "explanationIfWrong": "__str__ formats data for display in memory."
              },
              {
                "id": "D",
                "text": "It prevents subclasses from being instantiated",
                "explanationIfWrong": "It enhances string representations."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Reusing super().__str__() keeps formatting DRY and consistent across inheritance trees."
          },
          {
            "id": "q-10-3-method-overriding-extension-2-v2",
            "question": "Given ab = AudioBook('Dune', 'Frank Herbert', 120), what is print(ab)?",
            "options": [
              {
                "id": "A",
                "text": "'Dune' by Frank Herbert [Audio: 2h 0m]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "<AudioBook object at 0x...>",
                "explanationIfWrong": "Custom __str__ is executed."
              },
              {
                "id": "C",
                "text": "'Dune' by Frank Herbert",
                "explanationIfWrong": "AudioBook's __str__ appends the audio duration."
              },
              {
                "id": "D",
                "text": "120",
                "explanationIfWrong": "print(ab) outputs the formatted string."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The combined output merges the base Book title/author with the AudioBook duration."
          },
          {
            "id": "q-10-3-method-overriding-extension-2-v3",
            "question": "What happens if a subclass does NOT override __str__?",
            "options": [
              {
                "id": "A",
                "text": "It inherits and executes the parent class's __str__ method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python prints nothing",
                "explanationIfWrong": "Parent __str__ executes cleanly."
              },
              {
                "id": "C",
                "text": "Raises a TypeError",
                "explanationIfWrong": "Methods are inherited normally."
              },
              {
                "id": "D",
                "text": "It reverts to hexadecimal memory address",
                "explanationIfWrong": "It uses the parent's __str__ before falling back to object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "If the child omits __str__, Python uses the parent's __str__."
          }
        ]
      },
      {
        "heading": "Overriding Custom Equality (__eq__) in Hierarchies",
        "text": "When subclasses introduce new fields that define identity, overriding __eq__ requires checking that the other object is an instance of the subclass, verifying parent equality via super().__eq__(other), and comparing the subclass's own new attributes.",
        "codeSnippet": "class Card:\n    def __init__(self, suit, value):\n        self.suit = suit\n        self.value = value\n    \n    def __eq__(self, other):\n        if not isinstance(other, Card):\n            return False\n        return self.suit == other.suit and self.value == other.value\n\nclass SpecialCard(Card):\n    def __init__(self, suit, value, holo=False):\n        super().__init__(suit, value)\n        self.holo = holo\n    \n    def __eq__(self, other):\n        if not isinstance(other, SpecialCard):\n            return False\n        # Check parent equality and subclass holo attribute:\n        return super().__eq__(other) and self.holo == other.holo\n\nc1 = SpecialCard(\"Spades\", 10, holo=True)\nc2 = SpecialCard(\"Spades\", 10, holo=False)\nc3 = SpecialCard(\"Spades\", 10, holo=True)\n\nprint(f\"c1 == c2 (different holo): {c1 == c2}\")\nprint(f\"c1 == c3 (identical):      {c1 == c3}\")",
        "terminalOutput": "c1 == c2 (different holo): False\nc1 == c3 (identical):      True",
        "tip": "Using super().__eq__(other) guarantees that if the base Card class adds a color attribute later, SpecialCard's equality check automatically includes it!",
        "mcq": {
          "id": "q-10-3-method-overriding-extension-3-v1",
          "question": "Why should a subclass's __eq__ method call super().__eq__(other)?",
          "options": [
            {
              "id": "A",
              "text": "To verify that all parent class attributes match between the two objects before comparing subclass-specific fields",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To convert both objects into dictionaries",
              "explanationIfWrong": "Equality checking compares attributes."
            },
            {
              "id": "C",
              "text": "To prevent other developers from reading the code",
              "explanationIfWrong": "It ensures complete attribute comparison."
            },
            {
              "id": "D",
              "text": "Because Python forbids the == operator in subclasses",
              "explanationIfWrong": "== works cleanly via __eq__."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Delegating to super().__eq__(other) checks base attributes, keeping equality logic modular and complete."
        },
        "retestMcq": {
          "id": "q-10-3-method-overriding-extension-3-v2",
          "question": "What is the result of c1 == c2 in the SpecialCard example above?",
          "options": [
            {
              "id": "A",
              "text": "False, because c1.holo (True) != c2.holo (False)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "True, because suit and value match",
              "explanationIfWrong": "SpecialCard.__eq__ also requires self.holo == other.holo."
            },
            {
              "id": "C",
              "text": "Raises a ValueError",
              "explanationIfWrong": "== evaluates to False cleanly."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "== returns a boolean."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Although suit and value match, the holo attribute differs, so the equality check returns False."
        },
        "questionPool": [
          {
            "id": "q-10-3-method-overriding-extension-3-v1",
            "question": "Why should a subclass's __eq__ method call super().__eq__(other)?",
            "options": [
              {
                "id": "A",
                "text": "To verify that all parent class attributes match between the two objects before comparing subclass-specific fields",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To convert both objects into dictionaries",
                "explanationIfWrong": "Equality checking compares attributes."
              },
              {
                "id": "C",
                "text": "To prevent other developers from reading the code",
                "explanationIfWrong": "It ensures complete attribute comparison."
              },
              {
                "id": "D",
                "text": "Because Python forbids the == operator in subclasses",
                "explanationIfWrong": "== works cleanly via __eq__."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Delegating to super().__eq__(other) checks base attributes, keeping equality logic modular and complete."
          },
          {
            "id": "q-10-3-method-overriding-extension-3-v2",
            "question": "What is the result of c1 == c2 in the SpecialCard example above?",
            "options": [
              {
                "id": "A",
                "text": "False, because c1.holo (True) != c2.holo (False)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "True, because suit and value match",
                "explanationIfWrong": "SpecialCard.__eq__ also requires self.holo == other.holo."
              },
              {
                "id": "C",
                "text": "Raises a ValueError",
                "explanationIfWrong": "== evaluates to False cleanly."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "== returns a boolean."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Although suit and value match, the holo attribute differs, so the equality check returns False."
          },
          {
            "id": "q-10-3-method-overriding-extension-3-v3",
            "question": "What does c1 == Card('Spades', 10) return when evaluated in SpecialCard?",
            "options": [
              {
                "id": "A",
                "text": "False, because isinstance(other, SpecialCard) fails on the plain Card instance",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "True, because plain Cards have the same suit and value",
                "explanationIfWrong": "The type check guards against equating base and derived types."
              },
              {
                "id": "C",
                "text": "Raises an AttributeError: 'Card' object has no attribute 'holo'",
                "explanationIfWrong": "The isinstance check returns False before accessing .holo."
              },
              {
                "id": "D",
                "text": "Crashes Python",
                "explanationIfWrong": "Guard clauses prevent runtime crashes."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Checking isinstance(other, SpecialCard) safely returns False when comparing against a plain Card instance."
          }
        ]
      },
      {
        "heading": "The Fragile Base Class Problem",
        "text": "The Fragile Base Class problem occurs when changes to a parent class unintentionally break subclasses that override or depend on parent methods. To prevent this, always ensure your overriding methods maintain the same parameter types and return the same data types expected by callers of the parent method.",
        "codeSnippet": "class BaseParser:\n    def parse(self, text):\n        # Parent returns a list of tokens\n        return text.split()\n\n# BAD OVERRIDE: Changes return type from list to integer!\n# class BadParser(BaseParser):\n#     def parse(self, text): return len(text)\n\n# GOOD OVERRIDE: Retains return type contract (returns list)\nclass CaseInsensitiveParser(BaseParser):\n    def parse(self, text):\n        tokens = super().parse(text)\n        return [t.lower() for t in tokens]\n\np = CaseInsensitiveParser()\nprint(p.parse(\"Python Code Rocks\"))",
        "terminalOutput": "['python', 'code', 'rocks']",
        "warning": "Never change the return type or remove expected parameters when overriding a method. Doing so breaks the Liskov Substitution Principle and causes runtime bugs.",
        "mcq": {
          "id": "q-10-3-method-overriding-extension-4-v1",
          "question": "What is the 'Fragile Base Class' problem in object-oriented programming?",
          "options": [
            {
              "id": "A",
              "text": "An architectural risk where modifications to a base class inadvertently break the functionality of derived subclasses",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A class that runs out of memory when storing 100 attributes",
              "explanationIfWrong": "It is an architectural coupling issue, not a memory exhaustion problem."
            },
            {
              "id": "C",
              "text": "A class that has no __init__ method",
              "explanationIfWrong": "Omitting __init__ is valid."
            },
            {
              "id": "D",
              "text": "A class with corrupted bytecode",
              "explanationIfWrong": "It describes tight coupling vulnerabilities in inheritance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Tight coupling between parent and child can cause innocuous changes in the base class to break subclasses."
        },
        "retestMcq": {
          "id": "q-10-3-method-overriding-extension-4-v2",
          "question": "If BaseParser.parse() is documented to return a list of tokens, why is returning an integer in BadParser.parse() dangerous?",
          "options": [
            {
              "id": "A",
              "text": "Any external caller expecting a list will crash with TypeError or AttributeError when trying to iterate or index the result",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Integers are forbidden in Python subclasses",
              "explanationIfWrong": "Integers are valid types; the issue is breaking the method contract."
            },
            {
              "id": "C",
              "text": "The operating system refuses to execute it",
              "explanationIfWrong": "Python executes it, but callers crash with unexpected types."
            },
            {
              "id": "D",
              "text": "It deletes the text",
              "explanationIfWrong": "It violates behavioral subtyping."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Violating the method contract (changing return types) breaks client code that expects the base class interface."
        },
        "questionPool": [
          {
            "id": "q-10-3-method-overriding-extension-4-v1",
            "question": "What is the 'Fragile Base Class' problem in object-oriented programming?",
            "options": [
              {
                "id": "A",
                "text": "An architectural risk where modifications to a base class inadvertently break the functionality of derived subclasses",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A class that runs out of memory when storing 100 attributes",
                "explanationIfWrong": "It is an architectural coupling issue, not a memory exhaustion problem."
              },
              {
                "id": "C",
                "text": "A class that has no __init__ method",
                "explanationIfWrong": "Omitting __init__ is valid."
              },
              {
                "id": "D",
                "text": "A class with corrupted bytecode",
                "explanationIfWrong": "It describes tight coupling vulnerabilities in inheritance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Tight coupling between parent and child can cause innocuous changes in the base class to break subclasses."
          },
          {
            "id": "q-10-3-method-overriding-extension-4-v2",
            "question": "If BaseParser.parse() is documented to return a list of tokens, why is returning an integer in BadParser.parse() dangerous?",
            "options": [
              {
                "id": "A",
                "text": "Any external caller expecting a list will crash with TypeError or AttributeError when trying to iterate or index the result",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Integers are forbidden in Python subclasses",
                "explanationIfWrong": "Integers are valid types; the issue is breaking the method contract."
              },
              {
                "id": "C",
                "text": "The operating system refuses to execute it",
                "explanationIfWrong": "Python executes it, but callers crash with unexpected types."
              },
              {
                "id": "D",
                "text": "It deletes the text",
                "explanationIfWrong": "It violates behavioral subtyping."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Violating the method contract (changing return types) breaks client code that expects the base class interface."
          },
          {
            "id": "q-10-3-method-overriding-extension-4-v3",
            "question": "Which design principle helps prevent fragile base class bugs by ensuring subclasses can substitute for base classes?",
            "options": [
              {
                "id": "A",
                "text": "Liskov Substitution Principle (LSP)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Boyles' Law",
                "explanationIfWrong": "Boyle's Law is physics of gas pressure."
              },
              {
                "id": "C",
                "text": "Single Threading Rule",
                "explanationIfWrong": "LSP is the OOP principle governing subtyping."
              },
              {
                "id": "D",
                "text": "Occam's Razor",
                "explanationIfWrong": "LSP is the relevant software design principle."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "LSP ensures subclasses honor the interface and behavioral guarantees of the base class."
          }
        ]
      },
      {
        "heading": "Method Overriding vs Method Overloading",
        "text": "Do not confuse method overriding with method overloading. Method OVERRIDING means redefining an inherited method with the same name in a subclass. Method OVERLOADING (common in Java/C++) means having multiple methods with the same name but different parameter types in the same class. Python does NOT support traditional method overloading; instead, Python achieves flexibility using default parameter values (*args, **kwargs).",
        "codeSnippet": "# Python does not support multiple 'def calculate(self, x):' and 'def calculate(self, x, y):'\n# In Python, the last definition simply overwrites earlier ones!\n\n# Pythonic solution: default arguments\nclass Calculator:\n    def add(self, a, b, c=0):\n        return a + b + c\n\ncalc = Calculator()\nprint(f\"2 args: {calc.add(10, 20)}\")\nprint(f\"3 args: {calc.add(10, 20, 30)}\")",
        "terminalOutput": "2 args: 30\n3 args: 60",
        "tip": "Remember: Python only keeps the LAST definition of a method in a class. Use default parameters or *args for flexible argument handling.",
        "mcq": {
          "id": "q-10-3-method-overriding-extension-5-v1",
          "question": "What is the difference between Method Overriding and Method Overloading?",
          "options": [
            {
              "id": "A",
              "text": "Overriding redefines an inherited parent method in a subclass; overloading means defining multiple methods with the same name but different signatures in the same class",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "They are exact synonyms in Python",
              "explanationIfWrong": "They refer to completely different OOP concepts."
            },
            {
              "id": "C",
              "text": "Overloading is for strings; overriding is for lists",
              "explanationIfWrong": "Both apply to methods and functions."
            },
            {
              "id": "D",
              "text": "Overriding is banned in Python 3",
              "explanationIfWrong": "Overriding is fundamental to inheritance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Overriding alters inherited behavior in a subclass; overloading provides multiple signatures for one method name."
        },
        "retestMcq": {
          "id": "q-10-3-method-overriding-extension-5-v2",
          "question": "What happens if you define def compute(self, x): and then def compute(self, x, y): in the same class body in Python?",
          "options": [
            {
              "id": "A",
              "text": "The second definition completely overwrites the first; calling compute(5) with 1 argument will raise a TypeError",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python automatically overloads both methods",
              "explanationIfWrong": "Python does not support C++-style compile-time overloading."
            },
            {
              "id": "C",
              "text": "Raises a DuplicateMethodError at import time",
              "explanationIfWrong": "Python silently binds the last definition to the method name."
            },
            {
              "id": "D",
              "text": "Both methods are deleted",
              "explanationIfWrong": "The last definition wins."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python defines methods sequentially at runtime; the last def replaces any previous definition with that name."
        },
        "questionPool": [
          {
            "id": "q-10-3-method-overriding-extension-5-v1",
            "question": "What is the difference between Method Overriding and Method Overloading?",
            "options": [
              {
                "id": "A",
                "text": "Overriding redefines an inherited parent method in a subclass; overloading means defining multiple methods with the same name but different signatures in the same class",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They are exact synonyms in Python",
                "explanationIfWrong": "They refer to completely different OOP concepts."
              },
              {
                "id": "C",
                "text": "Overloading is for strings; overriding is for lists",
                "explanationIfWrong": "Both apply to methods and functions."
              },
              {
                "id": "D",
                "text": "Overriding is banned in Python 3",
                "explanationIfWrong": "Overriding is fundamental to inheritance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Overriding alters inherited behavior in a subclass; overloading provides multiple signatures for one method name."
          },
          {
            "id": "q-10-3-method-overriding-extension-5-v2",
            "question": "What happens if you define def compute(self, x): and then def compute(self, x, y): in the same class body in Python?",
            "options": [
              {
                "id": "A",
                "text": "The second definition completely overwrites the first; calling compute(5) with 1 argument will raise a TypeError",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python automatically overloads both methods",
                "explanationIfWrong": "Python does not support C++-style compile-time overloading."
              },
              {
                "id": "C",
                "text": "Raises a DuplicateMethodError at import time",
                "explanationIfWrong": "Python silently binds the last definition to the method name."
              },
              {
                "id": "D",
                "text": "Both methods are deleted",
                "explanationIfWrong": "The last definition wins."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python defines methods sequentially at runtime; the last def replaces any previous definition with that name."
          },
          {
            "id": "q-10-3-method-overriding-extension-5-v3",
            "question": "How do Python developers implement flexible method parameter counts without method overloading?",
            "options": [
              {
                "id": "A",
                "text": "Using default parameter values (e.g. def func(a, b=0):) or variable arguments (*args, **kwargs)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "By duplicating the class 5 times",
                "explanationIfWrong": "Default arguments handle varying parameter counts cleanly."
              },
              {
                "id": "C",
                "text": "By writing the class in Java",
                "explanationIfWrong": "Python's dynamic argument handling is expressive and concise."
              },
              {
                "id": "D",
                "text": "Using raw memory pointers",
                "explanationIfWrong": "Default arguments provide idiomatic flexibility."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Optional default parameters and *args / **kwargs eliminate the need for method overloading in Python."
          }
        ]
      }
    ]
  },
  {
    "id": "10-4-polymorphism-duck-typing",
    "number": "10.4",
    "title": "Polymorphism & Duck Typing",
    "subtitle": "Leverage polymorphism and duck typing to write flexible code that operates on shared behaviors rather than rigid types.",
    "readTime": "20 min",
    "objectives": [
      "Understand polymorphism ('many forms') as a cornerstone of object-oriented architecture",
      "Process heterogeneous collections of subclass instances using uniform method calls",
      "Master Python's dynamic 'duck typing' philosophy ('if it walks like a duck...')",
      "Implement custom duck-typed objects conforming to standard protocols (e.g. file-like, iterable)",
      "Overload Python operators using dunder methods (__add__, __len__) polymorphically",
      "Write loosely coupled consumer functions that depend strictly on behavior, not concrete types"
    ],
    "theoryBlocks": [
      {
        "heading": "What is Polymorphism?",
        "text": "Polymorphism is a Greek word meaning 'many forms'. In programming, it refers to the ability of different classes to respond to the same method call, each providing its own class-specific behavior. The caller treats all objects uniformly through a common interface without needing to know their specific underlying classes.",
        "codeSnippet": "class AudioFile:\n    def play(self): pass\n\nclass MP3(AudioFile):\n    def play(self):\n        return \"Playing MP3 compressed stream at 320kbps...\"\n\nclass WAV(AudioFile):\n    def play(self):\n        return \"Playing uncompressed WAV PCM stream...\"\n\nclass FLAC(AudioFile):\n    def play(self):\n        return \"Playing lossless FLAC audio...\"\n\nplaylist = [MP3(), WAV(), FLAC()]\n# Polymorphic loop: uniform method call across different classes!\nfor track in playlist:\n    print(track.play())",
        "terminalOutput": "Playing MP3 compressed stream at 320kbps...\nPlaying uncompressed WAV PCM stream...\nPlaying lossless FLAC audio...",
        "tip": "Polymorphism eliminates ugly if/elif chains (if type == 'mp3': ... elif type == 'wav': ...). Adding a new format requires zero changes to the playback loop.",
        "mcq": {
          "id": "q-10-4-polymorphism-duck-typing-0-v1",
          "question": "What is polymorphism in object-oriented programming?",
          "options": [
            {
              "id": "A",
              "text": "The ability of different objects to respond to the same method invocation with their own specialized behavior",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Converting a Python script into multiple executable files",
              "explanationIfWrong": "Polymorphism is an object-oriented behavioral concept."
            },
            {
              "id": "C",
              "text": "Creating 10 variables with the same name",
              "explanationIfWrong": "Identifiers cannot collide in the same scope."
            },
            {
              "id": "D",
              "text": "A database query language",
              "explanationIfWrong": "It is an OOP principle."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Polymorphism allows calling the same method on diverse objects, with each object executing its own implementation."
        },
        "retestMcq": {
          "id": "q-10-4-polymorphism-duck-typing-0-v2",
          "question": "Why is the polymorphic loop for track in playlist: track.play() considered superior to if/elif type checking?",
          "options": [
            {
              "id": "A",
              "text": "It adheres to the Open/Closed Principle: you can add new audio formats (e.g. OGG) without modifying or re-testing the playback loop",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It executes 1000x faster than loops",
              "explanationIfWrong": "Performance is similar; the win is architectural maintainability."
            },
            {
              "id": "C",
              "text": "if/elif is banned in Python 3",
              "explanationIfWrong": "if/elif is valid, but hardcoding types creates rigid, fragile code."
            },
            {
              "id": "D",
              "text": "It prevents memory from being allocated",
              "explanationIfWrong": "It structures code cleanly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Polymorphic code is open for extension (new classes) but closed for modification (existing loops don't need changes)."
        },
        "questionPool": [
          {
            "id": "q-10-4-polymorphism-duck-typing-0-v1",
            "question": "What is polymorphism in object-oriented programming?",
            "options": [
              {
                "id": "A",
                "text": "The ability of different objects to respond to the same method invocation with their own specialized behavior",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Converting a Python script into multiple executable files",
                "explanationIfWrong": "Polymorphism is an object-oriented behavioral concept."
              },
              {
                "id": "C",
                "text": "Creating 10 variables with the same name",
                "explanationIfWrong": "Identifiers cannot collide in the same scope."
              },
              {
                "id": "D",
                "text": "A database query language",
                "explanationIfWrong": "It is an OOP principle."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Polymorphism allows calling the same method on diverse objects, with each object executing its own implementation."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-0-v2",
            "question": "Why is the polymorphic loop for track in playlist: track.play() considered superior to if/elif type checking?",
            "options": [
              {
                "id": "A",
                "text": "It adheres to the Open/Closed Principle: you can add new audio formats (e.g. OGG) without modifying or re-testing the playback loop",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It executes 1000x faster than loops",
                "explanationIfWrong": "Performance is similar; the win is architectural maintainability."
              },
              {
                "id": "C",
                "text": "if/elif is banned in Python 3",
                "explanationIfWrong": "if/elif is valid, but hardcoding types creates rigid, fragile code."
              },
              {
                "id": "D",
                "text": "It prevents memory from being allocated",
                "explanationIfWrong": "It structures code cleanly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Polymorphic code is open for extension (new classes) but closed for modification (existing loops don't need changes)."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-0-v3",
            "question": "In the AudioFile example, what happens if an AAC class is added with def play(self): return 'Playing AAC'? does playlist loop need changing?",
            "options": [
              {
                "id": "A",
                "text": "No changes are needed; the loop immediately supports AAC instances seamlessly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, you must add an elif isinstance(track, AAC): check",
                "explanationIfWrong": "Polymorphism avoids type checks altogether."
              },
              {
                "id": "C",
                "text": "Yes, playlist must be sorted alphabetically",
                "explanationIfWrong": "Lists preserve insertion order."
              },
              {
                "id": "D",
                "text": "It raises a TypeError",
                "explanationIfWrong": "AAC responds to .play() cleanly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because AAC implements play(), the consumer loop executes it without any modifications."
          }
        ]
      },
      {
        "heading": "Python's Duck Typing Philosophy",
        "text": "In statically typed languages like Java or C++, polymorphism requires classes to explicitly inherit from a common base class or implement an interface. Python, however, uses Duck Typing, inspired by the phrase: 'If it walks like a duck and quacks like a duck, it's a duck.' Python doesn't care what class an object belongs to; it only cares whether the object has the required method when called.",
        "codeSnippet": "class Duck:\n    def quack(self):\n        return \"Quack, quack!\"\n\nclass Person:\n    # Person does NOT inherit from Duck, but has a quack method!\n    def quack(self):\n        return \"I'm impersonating a duck! Quack!\"\n\nclass Robot:\n    def quack(self):\n        return \"[SYNTHESIZED_QUACK_AUDIO]\"\n\ndef make_it_quack(entity):\n    # As long as entity has a quack() method, it works!\n    print(entity.quack())\n\nmake_it_quack(Duck())\nmake_it_quack(Person())\nmake_it_quack(Robot())",
        "terminalOutput": "Quack, quack!\nI'm impersonating a duck! Quack!\n[SYNTHESIZED_QUACK_AUDIO]",
        "tip": "Duck typing means you don't need an artificial Animal base class for Duck and Person to be used interchangeably by make_it_quack.",
        "mcq": {
          "id": "q-10-4-polymorphism-duck-typing-1-v1",
          "question": "What is the core idea of 'Duck Typing' in Python?",
          "options": [
            {
              "id": "A",
              "text": "An object's suitability is determined by the presence of specific methods and properties, rather than its explicit inheritance hierarchy",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A feature specifically for modeling water fowl in simulations",
              "explanationIfWrong": "It is a programming language typing philosophy."
            },
            {
              "id": "C",
              "text": "All classes must inherit from Duck",
              "explanationIfWrong": "Duck typing means no shared base class is needed."
            },
            {
              "id": "D",
              "text": "Python classes cannot define methods",
              "explanationIfWrong": "Methods define the object's interface."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Duck typing checks whether an object can perform the requested action (quack), ignoring its formal type ancestry."
        },
        "retestMcq": {
          "id": "q-10-4-polymorphism-duck-typing-1-v2",
          "question": "Why does make_it_quack(Person()) succeed even though Person does not inherit from Duck?",
          "options": [
            {
              "id": "A",
              "text": "Because Person defines a quack() method, satisfying the callable expectation of the function",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because Python converts Person to Duck automatically",
              "explanationIfWrong": "Person remains Person; Python calls .quack() dynamically."
            },
            {
              "id": "C",
              "text": "Because Person is an abstract class",
              "explanationIfWrong": "Person is a regular concrete class."
            },
            {
              "id": "D",
              "text": "Because the function imports the random module",
              "explanationIfWrong": "Duck typing resolves method calls at runtime."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "At runtime, Python inspects the object for a quack attribute; finding it, it executes the method successfully."
        },
        "questionPool": [
          {
            "id": "q-10-4-polymorphism-duck-typing-1-v1",
            "question": "What is the core idea of 'Duck Typing' in Python?",
            "options": [
              {
                "id": "A",
                "text": "An object's suitability is determined by the presence of specific methods and properties, rather than its explicit inheritance hierarchy",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A feature specifically for modeling water fowl in simulations",
                "explanationIfWrong": "It is a programming language typing philosophy."
              },
              {
                "id": "C",
                "text": "All classes must inherit from Duck",
                "explanationIfWrong": "Duck typing means no shared base class is needed."
              },
              {
                "id": "D",
                "text": "Python classes cannot define methods",
                "explanationIfWrong": "Methods define the object's interface."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Duck typing checks whether an object can perform the requested action (quack), ignoring its formal type ancestry."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-1-v2",
            "question": "Why does make_it_quack(Person()) succeed even though Person does not inherit from Duck?",
            "options": [
              {
                "id": "A",
                "text": "Because Person defines a quack() method, satisfying the callable expectation of the function",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python converts Person to Duck automatically",
                "explanationIfWrong": "Person remains Person; Python calls .quack() dynamically."
              },
              {
                "id": "C",
                "text": "Because Person is an abstract class",
                "explanationIfWrong": "Person is a regular concrete class."
              },
              {
                "id": "D",
                "text": "Because the function imports the random module",
                "explanationIfWrong": "Duck typing resolves method calls at runtime."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "At runtime, Python inspects the object for a quack attribute; finding it, it executes the method successfully."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-1-v3",
            "question": "What happens if you pass an object that lacks a quack method to make_it_quack(123)?",
            "options": [
              {
                "id": "A",
                "text": "AttributeError: 'int' object has no attribute 'quack'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It prints None",
                "explanationIfWrong": "Looking up a missing method raises an AttributeError."
              },
              {
                "id": "C",
                "text": "It converts 123 into a duck sound",
                "explanationIfWrong": "Integers have no quack method."
              },
              {
                "id": "D",
                "text": "It creates a new method on the integer",
                "explanationIfWrong": "Built-in types cannot be dynamically modified."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "If the object does not possess the requested method, an AttributeError is raised immediately."
          }
        ]
      },
      {
        "heading": "Duck Typing in Practice: Custom Protocols",
        "text": "Python's standard library relies heavily on duck typing protocols. For example, any object that implements a read(size) method is a 'file-like object' and can be passed into functions like json.load(), csv.reader(), or PIL.Image.open() \u2014 without needing to be an actual disk file!",
        "codeSnippet": "import io\nimport json\n\n# Standard disk file protocol simulated in memory via duck typing\nclass MockAPIStream:\n    def __init__(self, data_str):\n        self.stream = io.StringIO(data_str)\n    \n    # Implements file-like read() method\n    def read(self, *args):\n        return self.stream.read(*args)\n\nfake_file = MockAPIStream('{\"service\": \"auth\", \"status\": \"healthy\"}')\n# json.load expects a file-like object with a read() method:\npayload = json.load(fake_file)\nprint(f\"Service: {payload['service']}, Status: {payload['status']}\")",
        "terminalOutput": "Service: auth, Status: healthy",
        "tip": "By implementing standard protocols (like read() or write()), your custom objects integrate seamlessly with the entire Python ecosystem.",
        "mcq": {
          "id": "q-10-4-polymorphism-duck-typing-2-v1",
          "question": "Why can MockAPIStream be passed into json.load(stream) without inheriting from Python's internal file class?",
          "options": [
            {
              "id": "A",
              "text": "json.load() uses duck typing: it only requires the passed object to provide a callable read() method",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Python saves the mock stream to the hard drive first",
              "explanationIfWrong": "It operates purely in RAM."
            },
            {
              "id": "C",
              "text": "All classes are files in Python",
              "explanationIfWrong": "Only objects providing the file protocol can act like files."
            },
            {
              "id": "D",
              "text": "json.load() was recompiled in C",
              "explanationIfWrong": "It is standard duck-typed protocol consumption."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "json.load() doesn't check type; it simply calls stream.read(), illustrating duck typing in the standard library."
        },
        "retestMcq": {
          "id": "q-10-4-polymorphism-duck-typing-2-v2",
          "question": "What is a 'file-like object' in Python terminology?",
          "options": [
            {
              "id": "A",
              "text": "Any object that implements file methods like read() or write(), regardless of its actual class inheritance",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A file that has a .txt extension on the filesystem",
              "explanationIfWrong": "It is an in-memory protocol, not a file extension."
            },
            {
              "id": "C",
              "text": "A string containing file paths",
              "explanationIfWrong": "A file-like object provides read/write methods."
            },
            {
              "id": "D",
              "text": "A hard disk driver",
              "explanationIfWrong": "It is an object interface protocol."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A file-like object satisfies the file protocol by providing standard stream methods like read(), readline(), or write()."
        },
        "questionPool": [
          {
            "id": "q-10-4-polymorphism-duck-typing-2-v1",
            "question": "Why can MockAPIStream be passed into json.load(stream) without inheriting from Python's internal file class?",
            "options": [
              {
                "id": "A",
                "text": "json.load() uses duck typing: it only requires the passed object to provide a callable read() method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Python saves the mock stream to the hard drive first",
                "explanationIfWrong": "It operates purely in RAM."
              },
              {
                "id": "C",
                "text": "All classes are files in Python",
                "explanationIfWrong": "Only objects providing the file protocol can act like files."
              },
              {
                "id": "D",
                "text": "json.load() was recompiled in C",
                "explanationIfWrong": "It is standard duck-typed protocol consumption."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "json.load() doesn't check type; it simply calls stream.read(), illustrating duck typing in the standard library."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-2-v2",
            "question": "What is a 'file-like object' in Python terminology?",
            "options": [
              {
                "id": "A",
                "text": "Any object that implements file methods like read() or write(), regardless of its actual class inheritance",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A file that has a .txt extension on the filesystem",
                "explanationIfWrong": "It is an in-memory protocol, not a file extension."
              },
              {
                "id": "C",
                "text": "A string containing file paths",
                "explanationIfWrong": "A file-like object provides read/write methods."
              },
              {
                "id": "D",
                "text": "A hard disk driver",
                "explanationIfWrong": "It is an object interface protocol."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A file-like object satisfies the file protocol by providing standard stream methods like read(), readline(), or write()."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-2-v3",
            "question": "What is the built-in io.StringIO class used for in testing and duck typing?",
            "options": [
              {
                "id": "A",
                "text": "It wraps an in-memory text string so it behaves like an open file with read() and write() methods",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It converts audio files into strings",
                "explanationIfWrong": "StringIO operates on text streams."
              },
              {
                "id": "C",
                "text": "It formats numbers with commas",
                "explanationIfWrong": "f-strings format numbers."
              },
              {
                "id": "D",
                "text": "It connects to remote databases",
                "explanationIfWrong": "StringIO is an in-memory text buffer."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "io.StringIO provides an in-memory file-like buffer for reading and writing text without touching the disk."
          }
        ]
      },
      {
        "heading": "Operator Overloading as Polymorphism",
        "text": "Python's operators (+, -, *, ==, <, len()) are fully polymorphic. Writing a + b invokes a.__add__(b). By implementing dunder methods in your class, you teach Python how to use built-in operators with your custom objects.",
        "codeSnippet": "class Vector2D:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    # Operator overloading: + operator\n    def __add__(self, other):\n        if not isinstance(other, Vector2D):\n            return NotImplemented\n        return Vector2D(self.x + other.x, self.y + other.y)\n    \n    # Operator overloading: * scalar multiplication\n    def __mul__(self, scalar):\n        return Vector2D(self.x * scalar, self.y * scalar)\n    \n    def __repr__(self):\n        return f\"Vector2D({self.x}, {self.y})\"\n\nv1 = Vector2D(3, 4)\nv2 = Vector2D(1, 2)\nprint(f\"v1 + v2: {v1 + v2}\")\nprint(f\"v1 * 3:  {v1 * 3}\")",
        "terminalOutput": "v1 + v2: Vector2D(4, 6)\nv1 * 3:  Vector2D(9, 12)",
        "tip": "Returning NotImplemented in operator dunders lets Python try the reverse operator on the other object (e.g. other.__radd__(self)) before giving up with a TypeError.",
        "mcq": {
          "id": "q-10-4-polymorphism-duck-typing-3-v1",
          "question": "What dunder method is invoked when executing v1 + v2 on custom objects?",
          "options": [
            {
              "id": "A",
              "text": "v1.__add__(v2)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "v1.plus(v2)",
              "explanationIfWrong": "Python uses dunder __add__, not plus."
            },
            {
              "id": "C",
              "text": "add(v1, v2)",
              "explanationIfWrong": "The + operator maps to __add__."
            },
            {
              "id": "D",
              "text": "v1.__concat__(v2)",
              "explanationIfWrong": "Addition maps to __add__."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The + expression a + b is evaluated as a.__add__(b) in Python."
        },
        "retestMcq": {
          "id": "q-10-4-polymorphism-duck-typing-3-v2",
          "question": "Why should an operator method return NotImplemented if it doesn't support the other operand's type?",
          "options": [
            {
              "id": "A",
              "text": "It signals to Python to try the reflected operation on the other object (e.g. other.__radd__(self)) before raising a TypeError",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It crashes the program immediately",
              "explanationIfWrong": "Returning NotImplemented allows reverse operators to be attempted."
            },
            {
              "id": "C",
              "text": "It deletes the second object",
              "explanationIfWrong": "It is an operator protocol signaling mechanism."
            },
            {
              "id": "D",
              "text": "It converts the right operand to an integer",
              "explanationIfWrong": "It passes control to the fallback mechanism."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Returning NotImplemented indicates that this class cannot handle the combination, allowing Python to try the other operand."
        },
        "questionPool": [
          {
            "id": "q-10-4-polymorphism-duck-typing-3-v1",
            "question": "What dunder method is invoked when executing v1 + v2 on custom objects?",
            "options": [
              {
                "id": "A",
                "text": "v1.__add__(v2)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "v1.plus(v2)",
                "explanationIfWrong": "Python uses dunder __add__, not plus."
              },
              {
                "id": "C",
                "text": "add(v1, v2)",
                "explanationIfWrong": "The + operator maps to __add__."
              },
              {
                "id": "D",
                "text": "v1.__concat__(v2)",
                "explanationIfWrong": "Addition maps to __add__."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The + expression a + b is evaluated as a.__add__(b) in Python."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-3-v2",
            "question": "Why should an operator method return NotImplemented if it doesn't support the other operand's type?",
            "options": [
              {
                "id": "A",
                "text": "It signals to Python to try the reflected operation on the other object (e.g. other.__radd__(self)) before raising a TypeError",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It crashes the program immediately",
                "explanationIfWrong": "Returning NotImplemented allows reverse operators to be attempted."
              },
              {
                "id": "C",
                "text": "It deletes the second object",
                "explanationIfWrong": "It is an operator protocol signaling mechanism."
              },
              {
                "id": "D",
                "text": "It converts the right operand to an integer",
                "explanationIfWrong": "It passes control to the fallback mechanism."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Returning NotImplemented indicates that this class cannot handle the combination, allowing Python to try the other operand."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-3-v3",
            "question": "Which dunder method overloads the multiplication operator (*) in Python?",
            "options": [
              {
                "id": "A",
                "text": "__mul__",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "__mult__",
                "explanationIfWrong": "The correct dunder name is __mul__."
              },
              {
                "id": "C",
                "text": "__times__",
                "explanationIfWrong": "The method is __mul__."
              },
              {
                "id": "D",
                "text": "__product__",
                "explanationIfWrong": "Python specifies __mul__ for multiplication."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The * operator invokes __mul__(self, other) on the left operand."
          }
        ]
      },
      {
        "heading": "Writing Loosely Coupled Consumer Functions",
        "text": "By designing consumer functions that depend strictly on behavior (methods) rather than specific class names, you decouple components. This makes unit testing effortless, as you can pass mock objects that simulate behavior without touching databases or external networks.",
        "codeSnippet": "class NotificationService:\n    def __init__(self, sender):\n        # Accepts ANY object that has a send(recipient, message) method!\n        self.sender = sender\n    \n    def notify_user(self, user, message):\n        return self.sender.send(user.email, message)\n\n# Production email sender:\nclass RealEmailSender:\n    def send(self, recipient, message):\n        return f\"[SMTP NETWORK]: Sent email to {recipient}\"\n\n# Mock sender for unit tests:\nclass MockEmailSender:\n    def __init__(self):\n        self.sent_messages = []\n    def send(self, recipient, message):\n        self.sent_messages.append((recipient, message))\n        return \"[MOCK]: Recorded in test memory\"\n\n# Testing is simple and requires zero network access:\nmock = MockEmailSender()\nservice = NotificationService(mock)\n\nclass DummyUser: email = \"tester@example.com\"\nservice.notify_user(DummyUser(), \"Welcome to Stage 2!\")\nprint(f\"Mock captured: {mock.sent_messages}\")",
        "terminalOutput": "Mock captured: [('tester@example.com', 'Welcome to Stage 2!')]",
        "tip": "Duck typing makes Dependency Injection and automated Mock testing natural and elegant in Python without complex mocking frameworks.",
        "mcq": {
          "id": "q-10-4-polymorphism-duck-typing-4-v1",
          "question": "What is the primary benefit of passing dependencies into NotificationService rather than hardcoding RealEmailSender() inside it?",
          "options": [
            {
              "id": "A",
              "text": "Loose coupling: the service can work with RealEmailSender in production and MockEmailSender in automated tests",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It makes emails deliver twice as fast",
              "explanationIfWrong": "Dependency injection governs architecture, not network transmission speed."
            },
            {
              "id": "C",
              "text": "It compiles the Python script to a binary",
              "explanationIfWrong": "It is an architectural design pattern."
            },
            {
              "id": "D",
              "text": "Hardcoded classes take 10x more memory",
              "explanationIfWrong": "The primary benefit is testability and flexibility."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Injecting dependencies allows swapping real services with test doubles effortlessly."
        },
        "retestMcq": {
          "id": "q-10-4-polymorphism-duck-typing-4-v2",
          "question": "What requirements must an object satisfy to be used as a sender in NotificationService?",
          "options": [
            {
              "id": "A",
              "text": "It must provide a send(recipient, message) method",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It must inherit from EmailSenderBaseClass",
              "explanationIfWrong": "Duck typing requires only the method, not inheritance."
            },
            {
              "id": "C",
              "text": "It must be defined in the smtplib module",
              "explanationIfWrong": "Any custom class can be passed."
            },
            {
              "id": "D",
              "text": "It must have exactly 5 attributes",
              "explanationIfWrong": "Only the method interface matters."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Under duck typing, any object possessing a matching send() method satisfies the requirement."
        },
        "questionPool": [
          {
            "id": "q-10-4-polymorphism-duck-typing-4-v1",
            "question": "What is the primary benefit of passing dependencies into NotificationService rather than hardcoding RealEmailSender() inside it?",
            "options": [
              {
                "id": "A",
                "text": "Loose coupling: the service can work with RealEmailSender in production and MockEmailSender in automated tests",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It makes emails deliver twice as fast",
                "explanationIfWrong": "Dependency injection governs architecture, not network transmission speed."
              },
              {
                "id": "C",
                "text": "It compiles the Python script to a binary",
                "explanationIfWrong": "It is an architectural design pattern."
              },
              {
                "id": "D",
                "text": "Hardcoded classes take 10x more memory",
                "explanationIfWrong": "The primary benefit is testability and flexibility."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Injecting dependencies allows swapping real services with test doubles effortlessly."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-4-v2",
            "question": "What requirements must an object satisfy to be used as a sender in NotificationService?",
            "options": [
              {
                "id": "A",
                "text": "It must provide a send(recipient, message) method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It must inherit from EmailSenderBaseClass",
                "explanationIfWrong": "Duck typing requires only the method, not inheritance."
              },
              {
                "id": "C",
                "text": "It must be defined in the smtplib module",
                "explanationIfWrong": "Any custom class can be passed."
              },
              {
                "id": "D",
                "text": "It must have exactly 5 attributes",
                "explanationIfWrong": "Only the method interface matters."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Under duck typing, any object possessing a matching send() method satisfies the requirement."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-4-v3",
            "question": "What is an object called that mimics a production service inside automated tests (like MockEmailSender)?",
            "options": [
              {
                "id": "A",
                "text": "A Test Double (or Mock / Fake)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A Memory Leak",
                "explanationIfWrong": "It is an intentional testing construct."
              },
              {
                "id": "C",
                "text": "A Deadlock",
                "explanationIfWrong": "Deadlock is a concurrency bug."
              },
              {
                "id": "D",
                "text": "A Circular Reference",
                "explanationIfWrong": "Test doubles facilitate fast, isolated testing."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Test doubles substitute for real dependencies to verify behavior in isolated tests."
          }
        ]
      },
      {
        "heading": "Polymorphic Collections in Architecture",
        "text": "In large software architectures, managing collections of diverse objects that share a polymorphic interface allows complex workflows to execute with minimal, elegant code.",
        "codeSnippet": "class Button:\n    def render(self): return \"<button>Click Me</button>\"\nclass TextInput:\n    def render(self): return \"<input type='text' />\"\nclass Dropdown:\n    def render(self): return \"<select><option>Choose</option></select>\"\n\nclass WebPage:\n    def __init__(self, title):\n        self.title = title\n        self.widgets = []\n    \n    def add_widget(self, widget):\n        self.widgets.append(widget)\n    \n    def render_html(self):\n        html = [f\"<h1>{self.title}</h1>\"]\n        for w in self.widgets:\n            html.append(f\"  <div>{w.render()}</div>\")\n        return \"\\n\".join(html)\n\npage = WebPage(\"User Profile\")\npage.add_widget(TextInput())\npage.add_widget(Button())\npage.add_widget(Dropdown())\nprint(page.render_html())",
        "terminalOutput": "<h1>User Profile</h1>\n  <div><input type='text' /></div>\n  <div><button>Click Me</button></div>\n  <div><select><option>Choose</option></select></div>",
        "tip": "Each widget is responsible for its own rendering logic; the page simply coordinates layout.",
        "mcq": {
          "id": "q-10-4-polymorphism-duck-typing-5-v1",
          "question": "In the WebPage architecture, what allows TextInput, Button, and Dropdown to be stored together and rendered in a single loop?",
          "options": [
            {
              "id": "A",
              "text": "Polymorphism: all three classes implement a common render() method",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "They are all subclasses of str",
              "explanationIfWrong": "They are separate custom classes."
            },
            {
              "id": "C",
              "text": "Python converts all widgets into HTML strings upon instantiation",
              "explanationIfWrong": "They are instances stored in a list until render_html is called."
            },
            {
              "id": "D",
              "text": "The browser runs Python natively",
              "explanationIfWrong": "It is pure Python polymorphic design."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because each widget implements render(), the container iterates through them polymorphically."
        },
        "retestMcq": {
          "id": "q-10-4-polymorphism-duck-typing-5-v2",
          "question": "What would happen if you added a new DatePicker widget with def render(self): return '<date>' to the page?",
          "options": [
            {
              "id": "A",
              "text": "It renders seamlessly with zero changes required in WebPage.render_html()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "WebPage would crash with a WidgetCountError",
              "explanationIfWrong": "There is no limit on widget count."
            },
            {
              "id": "C",
              "text": "You must edit WebPage to add an if isinstance check",
              "explanationIfWrong": "Polymorphism avoids type checks."
            },
            {
              "id": "D",
              "text": "It deletes previous widgets",
              "explanationIfWrong": "It is appended to the list normally."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Polymorphic designs are extensible: new components plug in without modifying existing coordinator logic."
        },
        "questionPool": [
          {
            "id": "q-10-4-polymorphism-duck-typing-5-v1",
            "question": "In the WebPage architecture, what allows TextInput, Button, and Dropdown to be stored together and rendered in a single loop?",
            "options": [
              {
                "id": "A",
                "text": "Polymorphism: all three classes implement a common render() method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They are all subclasses of str",
                "explanationIfWrong": "They are separate custom classes."
              },
              {
                "id": "C",
                "text": "Python converts all widgets into HTML strings upon instantiation",
                "explanationIfWrong": "They are instances stored in a list until render_html is called."
              },
              {
                "id": "D",
                "text": "The browser runs Python natively",
                "explanationIfWrong": "It is pure Python polymorphic design."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because each widget implements render(), the container iterates through them polymorphically."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-5-v2",
            "question": "What would happen if you added a new DatePicker widget with def render(self): return '<date>' to the page?",
            "options": [
              {
                "id": "A",
                "text": "It renders seamlessly with zero changes required in WebPage.render_html()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "WebPage would crash with a WidgetCountError",
                "explanationIfWrong": "There is no limit on widget count."
              },
              {
                "id": "C",
                "text": "You must edit WebPage to add an if isinstance check",
                "explanationIfWrong": "Polymorphism avoids type checks."
              },
              {
                "id": "D",
                "text": "It deletes previous widgets",
                "explanationIfWrong": "It is appended to the list normally."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Polymorphic designs are extensible: new components plug in without modifying existing coordinator logic."
          },
          {
            "id": "q-10-4-polymorphism-duck-typing-5-v3",
            "question": "Which software architecture concept describes breaking rendering responsibility so each widget formats itself rather than WebPage having a massive switch statement?",
            "options": [
              {
                "id": "A",
                "text": "Encapsulation and Delegated Responsibility",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Linear Search",
                "explanationIfWrong": "Linear search is an algorithm for finding items."
              },
              {
                "id": "C",
                "text": "Memory Paging",
                "explanationIfWrong": "Memory paging is an OS memory management technique."
              },
              {
                "id": "D",
                "text": "Syntax Parsing",
                "explanationIfWrong": "It is an object-oriented architectural pattern."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Distributing responsibility to individual component classes keeps coordinator code minimal and clean."
          }
        ]
      }
    ]
  },
  {
    "id": "10-5-abstract-base-classes",
    "number": "10.5",
    "title": "Abstract Base Classes (ABCs)",
    "subtitle": "Enforce strict architectural contracts and prevent incomplete instantiations using the abc module and @abstractmethod.",
    "readTime": "20 min",
    "objectives": [
      "Understand why formal interface contracts are critical in team and enterprise codebases",
      "Inherit from abc.ABC to designate abstract base classes",
      "Declare mandatory method contracts using the @abstractmethod decorator",
      "Observe how Python blocks instantiation of incomplete subclasses at creation time",
      "Combine @property and @abstractmethod to enforce required attributes",
      "Design extensible plugin and driver architectures backed by abstract contracts"
    ],
    "theoryBlocks": [
      {
        "heading": "The Need for Formal Contracts",
        "text": "While duck typing is flexible, in large applications or team environments it has a weakness: if a developer writes a subclass and forgets to implement a required method (e.g. forgot calculate_tax()), the bug won't be caught until runtime when that specific method is called. Abstract Base Classes (ABCs) solve this by establishing formal contracts that Python enforces at the exact moment of instantiation.",
        "codeSnippet": "from abc import ABC, abstractmethod\n\n# Defining a formal interface\nclass PaymentGateway(ABC):\n    @abstractmethod\n    def process_payment(self, amount):\n        \"\"\"Must be implemented by all payment gateway providers.\"\"\"\n        pass\n    \n    @abstractmethod\n    def refund(self, transaction_id):\n        \"\"\"Must be implemented by all payment gateway providers.\"\"\"\n        pass",
        "terminalOutput": "",
        "tip": "An Abstract Base Class cannot be instantiated directly. It exists solely to define a template of required methods for its subclasses.",
        "mcq": {
          "id": "q-10-5-abstract-base-classes-0-v1",
          "question": "What is the primary advantage of Abstract Base Classes (ABCs) over informal duck typing in large projects?",
          "options": [
            {
              "id": "A",
              "text": "They enforce method contracts at instantiation time, raising an immediate error if a subclass fails to implement any required method",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "They make Python run on microcontrollers only",
              "explanationIfWrong": "ABCs are standard Python OOP constructs."
            },
            {
              "id": "C",
              "text": "They convert all data into binary format automatically",
              "explanationIfWrong": "ABCs govern class structure, not binary serialization."
            },
            {
              "id": "D",
              "text": "They bypass the Python garbage collector",
              "explanationIfWrong": "Memory management is unaffected."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "ABCs fail fast at object instantiation if any abstract method was omitted by the subclass developer."
        },
        "retestMcq": {
          "id": "q-10-5-abstract-base-classes-0-v2",
          "question": "Which standard library module provides the tools to create Abstract Base Classes in Python?",
          "options": [
            {
              "id": "A",
              "text": "abc",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "interface",
              "explanationIfWrong": "Python uses the abc module (Abstract Base Classes)."
            },
            {
              "id": "C",
              "text": "contract",
              "explanationIfWrong": "The module is named abc."
            },
            {
              "id": "D",
              "text": "types",
              "explanationIfWrong": "types contains dynamic type builders, not ABCs."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's abstract base class infrastructure resides in the built-in abc module (from abc import ABC, abstractmethod)."
        },
        "questionPool": [
          {
            "id": "q-10-5-abstract-base-classes-0-v1",
            "question": "What is the primary advantage of Abstract Base Classes (ABCs) over informal duck typing in large projects?",
            "options": [
              {
                "id": "A",
                "text": "They enforce method contracts at instantiation time, raising an immediate error if a subclass fails to implement any required method",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They make Python run on microcontrollers only",
                "explanationIfWrong": "ABCs are standard Python OOP constructs."
              },
              {
                "id": "C",
                "text": "They convert all data into binary format automatically",
                "explanationIfWrong": "ABCs govern class structure, not binary serialization."
              },
              {
                "id": "D",
                "text": "They bypass the Python garbage collector",
                "explanationIfWrong": "Memory management is unaffected."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "ABCs fail fast at object instantiation if any abstract method was omitted by the subclass developer."
          },
          {
            "id": "q-10-5-abstract-base-classes-0-v2",
            "question": "Which standard library module provides the tools to create Abstract Base Classes in Python?",
            "options": [
              {
                "id": "A",
                "text": "abc",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "interface",
                "explanationIfWrong": "Python uses the abc module (Abstract Base Classes)."
              },
              {
                "id": "C",
                "text": "contract",
                "explanationIfWrong": "The module is named abc."
              },
              {
                "id": "D",
                "text": "types",
                "explanationIfWrong": "types contains dynamic type builders, not ABCs."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's abstract base class infrastructure resides in the built-in abc module (from abc import ABC, abstractmethod)."
          },
          {
            "id": "q-10-5-abstract-base-classes-0-v3",
            "question": "What happens if you attempt to instantiate an Abstract Base Class directly (e.g. gateway = PaymentGateway())?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: Can't instantiate abstract class with abstract methods",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It creates an empty instance with None attributes",
                "explanationIfWrong": "Python actively prevents instantiation of classes with abstract methods."
              },
              {
                "id": "C",
                "text": "It deletes the class",
                "explanationIfWrong": "A TypeError is raised immediately."
              },
              {
                "id": "D",
                "text": "It returns False",
                "explanationIfWrong": "An exception is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Any class inheriting from ABC that contains un-implemented abstract methods cannot be instantiated."
          }
        ]
      },
      {
        "heading": "The @abstractmethod Decorator",
        "text": "You designate required methods by decorating them with @abstractmethod. Any subclass inheriting from this ABC MUST provide concrete implementations for every single @abstractmethod, or Python will refuse to let instances of that subclass be created.",
        "codeSnippet": "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n    \n    @abstractmethod\n    def perimeter(self):\n        pass\n\n# Incomplete subclass: implements area but forgets perimeter!\nclass IncompleteRectangle(Shape):\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    def area(self):\n        return self.w * self.h\n\ntry:\n    # Python blocks instantiation immediately!\n    r = IncompleteRectangle(5, 10)\nexcept TypeError as err:\n    print(f\"Instantiation blocked:\\n  {err}\")",
        "terminalOutput": "Instantiation blocked:\n  Can't instantiate abstract class IncompleteRectangle with abstract method perimeter",
        "warning": "The error occurs at INSTANTIATION time (r = IncompleteRectangle(5, 10)), not at import time, and identifies exactly which abstract method is missing.",
        "mcq": {
          "id": "q-10-5-abstract-base-classes-1-v1",
          "question": "When does Python raise an error if a subclass forgets to implement an @abstractmethod?",
          "options": [
            {
              "id": "A",
              "text": "At the exact moment of instantiation (when calling SubClass())",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "When the file is imported into memory",
              "explanationIfWrong": "Defining the subclass is valid; instantiating it triggers the error."
            },
            {
              "id": "C",
              "text": "Only when the missing method is explicitly invoked",
              "explanationIfWrong": "ABCs fail immediately at creation time, unlike plain duck typing."
            },
            {
              "id": "D",
              "text": "When the operating system restarts",
              "explanationIfWrong": "Python raises a TypeError at instantiation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python inspects the class at instantiation; if any abstract methods remain un-implemented, it raises a TypeError."
        },
        "retestMcq": {
          "id": "q-10-5-abstract-base-classes-1-v2",
          "question": "What is the error message produced by IncompleteRectangle above?",
          "options": [
            {
              "id": "A",
              "text": "TypeError: Can't instantiate abstract class IncompleteRectangle with abstract method perimeter",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "SyntaxError: missing perimeter method",
              "explanationIfWrong": "Syntax is valid; a runtime TypeError occurs during instantiation."
            },
            {
              "id": "C",
              "text": "AttributeError: perimeter not found",
              "explanationIfWrong": "Instantiation raises TypeError for abstract classes."
            },
            {
              "id": "D",
              "text": "NameError",
              "explanationIfWrong": "TypeError is the specific exception."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's TypeError explicitly lists the specific abstract methods that the subclass failed to implement."
        },
        "questionPool": [
          {
            "id": "q-10-5-abstract-base-classes-1-v1",
            "question": "When does Python raise an error if a subclass forgets to implement an @abstractmethod?",
            "options": [
              {
                "id": "A",
                "text": "At the exact moment of instantiation (when calling SubClass())",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "When the file is imported into memory",
                "explanationIfWrong": "Defining the subclass is valid; instantiating it triggers the error."
              },
              {
                "id": "C",
                "text": "Only when the missing method is explicitly invoked",
                "explanationIfWrong": "ABCs fail immediately at creation time, unlike plain duck typing."
              },
              {
                "id": "D",
                "text": "When the operating system restarts",
                "explanationIfWrong": "Python raises a TypeError at instantiation."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python inspects the class at instantiation; if any abstract methods remain un-implemented, it raises a TypeError."
          },
          {
            "id": "q-10-5-abstract-base-classes-1-v2",
            "question": "What is the error message produced by IncompleteRectangle above?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: Can't instantiate abstract class IncompleteRectangle with abstract method perimeter",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "SyntaxError: missing perimeter method",
                "explanationIfWrong": "Syntax is valid; a runtime TypeError occurs during instantiation."
              },
              {
                "id": "C",
                "text": "AttributeError: perimeter not found",
                "explanationIfWrong": "Instantiation raises TypeError for abstract classes."
              },
              {
                "id": "D",
                "text": "NameError",
                "explanationIfWrong": "TypeError is the specific exception."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's TypeError explicitly lists the specific abstract methods that the subclass failed to implement."
          },
          {
            "id": "q-10-5-abstract-base-classes-1-v3",
            "question": "Can an abstract method contain default code that subclasses can invoke via super()?",
            "options": [
              {
                "id": "A",
                "text": "Yes, @abstractmethod methods can contain base logic that subclasses can invoke with super().method()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, abstract methods can only contain pass",
                "explanationIfWrong": "Abstract methods can provide common default implementation."
              },
              {
                "id": "C",
                "text": "Only if they return None",
                "explanationIfWrong": "They can contain any Python code."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Default logic in abstract methods is supported in modern Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An abstract method can provide shared base logic; the subclass must still override it, but can call super().method()."
          }
        ]
      },
      {
        "heading": "Complete Subclasses of ABCs",
        "text": "Once a subclass provides concrete implementations for all abstract methods, it becomes a complete concrete class and can be instantiated without restrictions.",
        "codeSnippet": "import math\nfrom abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n    @abstractmethod\n    def perimeter(self):\n        pass\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = float(radius)\n    \n    def area(self):\n        return math.pi * (self.radius ** 2)\n    \n    def perimeter(self):\n        return 2 * math.pi * self.radius\n\nclass Rectangle(Shape):\n    def __init__(self, w, h):\n        self.w = float(w)\n        self.h = float(h)\n    \n    def area(self):\n        return self.w * self.h\n    \n    def perimeter(self):\n        return 2 * (self.w + self.h)\n\n# Both classes fully satisfy the contract:\nshapes = [Circle(3), Rectangle(4, 5)]\nfor s in shapes:\n    print(f\"{s.__class__.__name__} Area: {s.area():.2f}, Perimeter: {s.perimeter():.2f}\")",
        "terminalOutput": "Circle Area: 28.27, Perimeter: 18.85\nRectangle Area: 20.00, Perimeter: 18.00",
        "tip": "ABCs provide guaranteed polymorphism: any function accepting a Shape knows with 100% certainty that .area() and .perimeter() exist.",
        "mcq": {
          "id": "q-10-5-abstract-base-classes-2-v1",
          "question": "What condition must a subclass meet to be instantiated if its parent inherits from ABC?",
          "options": [
            {
              "id": "A",
              "text": "It must provide concrete implementations for every method decorated with @abstractmethod in its hierarchy",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It must be named in ALL_CAPS",
              "explanationIfWrong": "Class naming conventions use PascalCase."
            },
            {
              "id": "C",
              "text": "It must have at least 10 methods",
              "explanationIfWrong": "Only abstract methods must be implemented."
            },
            {
              "id": "D",
              "text": "It must import the os module",
              "explanationIfWrong": "No special imports are required."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "All abstract methods must be concretely implemented for a subclass to become instantiable."
        },
        "retestMcq": {
          "id": "q-10-5-abstract-base-classes-2-v2",
          "question": "What is isinstance(Circle(3), Shape)?",
          "options": [
            {
              "id": "A",
              "text": "True, because Circle inherits from Shape",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "False, because Shape is abstract",
              "explanationIfWrong": "isinstance works normally with abstract base classes."
            },
            {
              "id": "C",
              "text": "Raises an AbstractClassError",
              "explanationIfWrong": "Type checking on ABCs is completely valid."
            },
            {
              "id": "D",
              "text": "None",
              "explanationIfWrong": "isinstance returns a boolean."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Instances of concrete subclasses are recognized as instances of the abstract base class by isinstance()."
        },
        "questionPool": [
          {
            "id": "q-10-5-abstract-base-classes-2-v1",
            "question": "What condition must a subclass meet to be instantiated if its parent inherits from ABC?",
            "options": [
              {
                "id": "A",
                "text": "It must provide concrete implementations for every method decorated with @abstractmethod in its hierarchy",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It must be named in ALL_CAPS",
                "explanationIfWrong": "Class naming conventions use PascalCase."
              },
              {
                "id": "C",
                "text": "It must have at least 10 methods",
                "explanationIfWrong": "Only abstract methods must be implemented."
              },
              {
                "id": "D",
                "text": "It must import the os module",
                "explanationIfWrong": "No special imports are required."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "All abstract methods must be concretely implemented for a subclass to become instantiable."
          },
          {
            "id": "q-10-5-abstract-base-classes-2-v2",
            "question": "What is isinstance(Circle(3), Shape)?",
            "options": [
              {
                "id": "A",
                "text": "True, because Circle inherits from Shape",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "False, because Shape is abstract",
                "explanationIfWrong": "isinstance works normally with abstract base classes."
              },
              {
                "id": "C",
                "text": "Raises an AbstractClassError",
                "explanationIfWrong": "Type checking on ABCs is completely valid."
              },
              {
                "id": "D",
                "text": "None",
                "explanationIfWrong": "isinstance returns a boolean."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Instances of concrete subclasses are recognized as instances of the abstract base class by isinstance()."
          },
          {
            "id": "q-10-5-abstract-base-classes-2-v3",
            "question": "Why is an ABC called a 'contract' in software architecture?",
            "options": [
              {
                "id": "A",
                "text": "It legally binds any subclass to implement the declared methods, guaranteeing callers that the interface exists",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It requires signatures from software lawyers",
                "explanationIfWrong": "It is an architectural metaphor for interface guarantees."
              },
              {
                "id": "C",
                "text": "It encrypts the source code",
                "explanationIfWrong": "It is a structural code contract."
              },
              {
                "id": "D",
                "text": "It charges money per method call",
                "explanationIfWrong": "Contract refers to API guarantees."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "An interface contract guarantees that any conforming class fulfills the promised methods and signatures."
          }
        ]
      },
      {
        "heading": "Abstract Properties with @property and @abstractmethod",
        "text": "You can enforce that subclasses must define specific properties by stacking @property with @abstractmethod. Note the ordering: @property must always be the outermost decorator (placed above @abstractmethod).",
        "codeSnippet": "from abc import ABC, abstractmethod\n\nclass Vehicle(ABC):\n    # Enforcing an abstract property:\n    @property\n    @abstractmethod\n    def max_speed(self):\n        \"\"\"Subclasses must provide a max_speed property.\"\"\"\n        pass\n\nclass Bicycle(Vehicle):\n    # Satisfying the abstract property\n    @property\n    def max_speed(self):\n        return 35\n\nb = Bicycle()\nprint(f\"Bicycle Max Speed: {b.max_speed} km/h\")",
        "terminalOutput": "Bicycle Max Speed: 35 km/h",
        "warning": "Always stack @property on top of @abstractmethod (@property first, @abstractmethod second). Inverting the order will not work correctly in Python.",
        "mcq": {
          "id": "q-10-5-abstract-base-classes-3-v1",
          "question": "What is the correct decorator stacking order to create an abstract property?",
          "options": [
            {
              "id": "A",
              "text": "@property followed by @abstractmethod",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "@abstractmethod followed by @property",
              "explanationIfWrong": "@property must be the outer decorator."
            },
            {
              "id": "C",
              "text": "@abstractproperty (deprecated in modern Python)",
              "explanationIfWrong": "@abstractproperty is deprecated; use @property + @abstractmethod."
            },
            {
              "id": "D",
              "text": "@static_abstract",
              "explanationIfWrong": "Use @property with @abstractmethod."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In modern Python, stacking @property on top of @abstractmethod is the standard way to declare abstract properties."
        },
        "retestMcq": {
          "id": "q-10-5-abstract-base-classes-3-v2",
          "question": "What happens if a subclass of Vehicle fails to implement the max_speed property?",
          "options": [
            {
              "id": "A",
              "text": "TypeError at instantiation time: Can't instantiate abstract class with abstract method max_speed",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "max_speed defaults to 0",
              "explanationIfWrong": "Python blocks instantiation of incomplete classes."
            },
            {
              "id": "C",
              "text": "It compiles, but reading max_speed returns None",
              "explanationIfWrong": "Instantiation is aborted with a TypeError."
            },
            {
              "id": "D",
              "text": "The subclass is deleted",
              "explanationIfWrong": "An exception is raised."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Abstract properties are treated as abstract methods by ABC instantiation verification."
        },
        "questionPool": [
          {
            "id": "q-10-5-abstract-base-classes-3-v1",
            "question": "What is the correct decorator stacking order to create an abstract property?",
            "options": [
              {
                "id": "A",
                "text": "@property followed by @abstractmethod",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "@abstractmethod followed by @property",
                "explanationIfWrong": "@property must be the outer decorator."
              },
              {
                "id": "C",
                "text": "@abstractproperty (deprecated in modern Python)",
                "explanationIfWrong": "@abstractproperty is deprecated; use @property + @abstractmethod."
              },
              {
                "id": "D",
                "text": "@static_abstract",
                "explanationIfWrong": "Use @property with @abstractmethod."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In modern Python, stacking @property on top of @abstractmethod is the standard way to declare abstract properties."
          },
          {
            "id": "q-10-5-abstract-base-classes-3-v2",
            "question": "What happens if a subclass of Vehicle fails to implement the max_speed property?",
            "options": [
              {
                "id": "A",
                "text": "TypeError at instantiation time: Can't instantiate abstract class with abstract method max_speed",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "max_speed defaults to 0",
                "explanationIfWrong": "Python blocks instantiation of incomplete classes."
              },
              {
                "id": "C",
                "text": "It compiles, but reading max_speed returns None",
                "explanationIfWrong": "Instantiation is aborted with a TypeError."
              },
              {
                "id": "D",
                "text": "The subclass is deleted",
                "explanationIfWrong": "An exception is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Abstract properties are treated as abstract methods by ABC instantiation verification."
          },
          {
            "id": "q-10-5-abstract-base-classes-3-v3",
            "question": "Can an abstract property also require a setter?",
            "options": [
              {
                "id": "A",
                "text": "Yes, you can declare an abstract setter using @prop_name.setter followed by @abstractmethod",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, abstract properties are permanently read-only",
                "explanationIfWrong": "Abstract setters can be declared."
              },
              {
                "id": "C",
                "text": "Only if the class has no __init__",
                "explanationIfWrong": "Setters can be declared on any property."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Modern Python fully supports abstract setters."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Abstract setters can be declared using standard property setter syntax combined with @abstractmethod."
          }
        ]
      },
      {
        "heading": "Real-World Architecture: Plugin Systems with ABCs",
        "text": "ABCs are the backbone of extensible plugin architectures. The core system defines an abstract base class for plugins; third-party developers write concrete subclasses; and the core engine loads and executes them safely, knowing every plugin fulfills the contract.",
        "codeSnippet": "from abc import ABC, abstractmethod\n\nclass ExportPlugin(ABC):\n    @abstractmethod\n    def file_extension(self):\n        pass\n    \n    @abstractmethod\n    def export(self, data):\n        pass\n\nclass CSVExporter(ExportPlugin):\n    def file_extension(self): return \".csv\"\n    def export(self, data):\n        return \",\".join(str(x) for x in data)\n\nclass JSONExporter(ExportPlugin):\n    def file_extension(self): return \".json\"\n    def export(self, data):\n        import json\n        return json.dumps(data)\n\n# Core engine executes any registered plugin uniformly:\ndef save_report(data, exporter: ExportPlugin):\n    filename = f\"report{exporter.file_extension()}\"\n    content = exporter.export(data)\n    return f\"Saved to '{filename}': {content}\"\n\nprint(save_report([10, 20, 30], CSVExporter()))\nprint(save_report([10, 20, 30], JSONExporter()))",
        "terminalOutput": "Saved to 'report.csv': 10,20,30\nSaved to 'report.json': [10, 20, 30]",
        "tip": "Notice how save_report() is completely decoupled from export formats. New formats can be introduced at any time without touching save_report().",
        "mcq": {
          "id": "q-10-5-abstract-base-classes-4-v1",
          "question": "Why are ABCs ideal for designing plugin and driver architectures?",
          "options": [
            {
              "id": "A",
              "text": "They provide a formal blueprint that third-party plugin authors must follow, guaranteeing that all required hooks exist",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "They automatically download plugins from GitHub",
              "explanationIfWrong": "ABCs govern class interface definitions in code."
            },
            {
              "id": "C",
              "text": "They prevent plugins from using memory",
              "explanationIfWrong": "Plugins run as normal Python code."
            },
            {
              "id": "D",
              "text": "They convert plugins into C DLLs",
              "explanationIfWrong": "ABCs are native Python OOP constructs."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "ABCs act as contracts for plugin systems, ensuring third-party extensions provide all required methods."
        },
        "retestMcq": {
          "id": "q-10-5-abstract-base-classes-4-v2",
          "question": "If a developer writes class BrokenExporter(ExportPlugin): def file_extension(self): return '.xml' (forgetting export()), what happens when calling BrokenExporter()?",
          "options": [
            {
              "id": "A",
              "text": "TypeError: Can't instantiate abstract class BrokenExporter with abstract method export",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It defaults export() to returning an empty string",
              "explanationIfWrong": "Python rejects incomplete classes at instantiation."
            },
            {
              "id": "C",
              "text": "It crashes only when save_report() is called",
              "explanationIfWrong": "The error happens immediately upon calling BrokenExporter()."
            },
            {
              "id": "D",
              "text": "It converts the file to .csv",
              "explanationIfWrong": "Instantiation is blocked."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python halts instantiation of BrokenExporter immediately because export() was not implemented."
        },
        "questionPool": [
          {
            "id": "q-10-5-abstract-base-classes-4-v1",
            "question": "Why are ABCs ideal for designing plugin and driver architectures?",
            "options": [
              {
                "id": "A",
                "text": "They provide a formal blueprint that third-party plugin authors must follow, guaranteeing that all required hooks exist",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "They automatically download plugins from GitHub",
                "explanationIfWrong": "ABCs govern class interface definitions in code."
              },
              {
                "id": "C",
                "text": "They prevent plugins from using memory",
                "explanationIfWrong": "Plugins run as normal Python code."
              },
              {
                "id": "D",
                "text": "They convert plugins into C DLLs",
                "explanationIfWrong": "ABCs are native Python OOP constructs."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "ABCs act as contracts for plugin systems, ensuring third-party extensions provide all required methods."
          },
          {
            "id": "q-10-5-abstract-base-classes-4-v2",
            "question": "If a developer writes class BrokenExporter(ExportPlugin): def file_extension(self): return '.xml' (forgetting export()), what happens when calling BrokenExporter()?",
            "options": [
              {
                "id": "A",
                "text": "TypeError: Can't instantiate abstract class BrokenExporter with abstract method export",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It defaults export() to returning an empty string",
                "explanationIfWrong": "Python rejects incomplete classes at instantiation."
              },
              {
                "id": "C",
                "text": "It crashes only when save_report() is called",
                "explanationIfWrong": "The error happens immediately upon calling BrokenExporter()."
              },
              {
                "id": "D",
                "text": "It converts the file to .csv",
                "explanationIfWrong": "Instantiation is blocked."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python halts instantiation of BrokenExporter immediately because export() was not implemented."
          },
          {
            "id": "q-10-5-abstract-base-classes-4-v3",
            "question": "In save_report(data, exporter: ExportPlugin), what does the type annotation exporter: ExportPlugin communicate to developers?",
            "options": [
              {
                "id": "A",
                "text": "It signals that the function expects an instance conforming to the ExportPlugin abstract contract",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It forces Python to execute in C-mode",
                "explanationIfWrong": "Type hints are documentation and static analysis tools."
              },
              {
                "id": "C",
                "text": "It deletes the data variable",
                "explanationIfWrong": "Type hints do not mutate data."
              },
              {
                "id": "D",
                "text": "It is a compiler syntax error in Python",
                "explanationIfWrong": "Type annotations are standard in modern Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Type hints combined with ABCs clearly communicate the expected interface contract to callers and linters."
          }
        ]
      },
      {
        "heading": "ABC vs Protocols (PEP 544)",
        "text": "In modern Python, you can enforce interfaces in two ways: Nominal subtyping with ABCs (subclasses must explicitly inherit from ABC), or Structural subtyping with typing.Protocol (classes satisfy the contract purely by shape without inheriting). Both have their place: use ABCs when you want runtime instantiation enforcement; use Protocol when you want lightweight static type-checker verification.",
        "codeSnippet": "from abc import ABC, abstractmethod\nfrom typing import Protocol\n\n# Nominal: requires explicit class inheritance\nclass NominalReader(ABC):\n    @abstractmethod\n    def read(self): pass\n\n# Structural (Duck typing with static checks):\nclass StructuralReader(Protocol):\n    def read(self) -> str: ...\n\nclass CustomDataSource:\n    def read(self) -> str:\n        return \"data from source\"\n\n# CustomDataSource matches StructuralReader without inheriting!\nprint(f\"CustomDataSource has read: {hasattr(CustomDataSource, 'read')}\")",
        "terminalOutput": "CustomDataSource has read: True",
        "tip": "ABCs enforce contracts at runtime during class instantiation. Protocols enforce contracts during static analysis with mypy or IDE checks.",
        "mcq": {
          "id": "q-10-5-abstract-base-classes-5-v1",
          "question": "What is the key difference between an Abstract Base Class (ABC) and a typing.Protocol?",
          "options": [
            {
              "id": "A",
              "text": "ABCs require explicit inheritance and enforce contracts at runtime; Protocols use structural typing (duck typing) verified primarily by static type checkers",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "ABCs are for numbers; Protocols are for strings",
              "explanationIfWrong": "Both apply to general class architectures."
            },
            {
              "id": "C",
              "text": "Protocols were removed in Python 3",
              "explanationIfWrong": "Protocols were introduced in Python 3.8 via PEP 544."
            },
            {
              "id": "D",
              "text": "ABCs can only have 1 method",
              "explanationIfWrong": "ABCs can have any number of methods."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "ABCs enforce nominal inheritance at runtime; Protocols provide static duck-typing verification."
        },
        "retestMcq": {
          "id": "q-10-5-abstract-base-classes-5-v2",
          "question": "Does a class need to write class MySource(StructuralReader): to satisfy a Protocol?",
          "options": [
            {
              "id": "A",
              "text": "No, as long as it defines the required methods and signatures, it satisfies the Protocol implicitly (structural subtyping)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Yes, explicit inheritance is always mandatory in Python",
              "explanationIfWrong": "Protocols support structural subtyping without inheritance."
            },
            {
              "id": "C",
              "text": "Only if imported from sys",
              "explanationIfWrong": "Protocols work implicitly anywhere."
            },
            {
              "id": "D",
              "text": "Only in Python 2",
              "explanationIfWrong": "Protocols are a modern Python 3.8+ feature."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Protocols check 'shape' rather than ancestry, so no explicit inheritance is required."
        },
        "questionPool": [
          {
            "id": "q-10-5-abstract-base-classes-5-v1",
            "question": "What is the key difference between an Abstract Base Class (ABC) and a typing.Protocol?",
            "options": [
              {
                "id": "A",
                "text": "ABCs require explicit inheritance and enforce contracts at runtime; Protocols use structural typing (duck typing) verified primarily by static type checkers",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "ABCs are for numbers; Protocols are for strings",
                "explanationIfWrong": "Both apply to general class architectures."
              },
              {
                "id": "C",
                "text": "Protocols were removed in Python 3",
                "explanationIfWrong": "Protocols were introduced in Python 3.8 via PEP 544."
              },
              {
                "id": "D",
                "text": "ABCs can only have 1 method",
                "explanationIfWrong": "ABCs can have any number of methods."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "ABCs enforce nominal inheritance at runtime; Protocols provide static duck-typing verification."
          },
          {
            "id": "q-10-5-abstract-base-classes-5-v2",
            "question": "Does a class need to write class MySource(StructuralReader): to satisfy a Protocol?",
            "options": [
              {
                "id": "A",
                "text": "No, as long as it defines the required methods and signatures, it satisfies the Protocol implicitly (structural subtyping)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Yes, explicit inheritance is always mandatory in Python",
                "explanationIfWrong": "Protocols support structural subtyping without inheritance."
              },
              {
                "id": "C",
                "text": "Only if imported from sys",
                "explanationIfWrong": "Protocols work implicitly anywhere."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Protocols are a modern Python 3.8+ feature."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Protocols check 'shape' rather than ancestry, so no explicit inheritance is required."
          },
          {
            "id": "q-10-5-abstract-base-classes-5-v3",
            "question": "When should you prefer an ABC over a Protocol?",
            "options": [
              {
                "id": "A",
                "text": "When you want strict runtime guarantees that block instantiation of incomplete subclasses, or when sharing default method implementations",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "When writing code for web browsers",
                "explanationIfWrong": "It is an architectural decision regarding runtime vs static enforcement."
              },
              {
                "id": "C",
                "text": "When avoiding functions",
                "explanationIfWrong": "Both interact with functions."
              },
              {
                "id": "D",
                "text": "When using Python 1",
                "explanationIfWrong": "ABCs are standard modern Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "ABCs provide active runtime enforcement and allow base code sharing via super()."
          }
        ]
      }
    ]
  },
  {
    "id": "10-6-larger-modular-applications",
    "number": "10.6",
    "title": "Modular OOP Application Architecture",
    "subtitle": "Synthesize inheritance, ABCs, mixins, and multi-object collaboration to build production-grade modular systems.",
    "readTime": "25 min",
    "objectives": [
      "Architect layered modular applications with clean domain models and services",
      "Implement reusable capabilities using Mixin classes and multiple inheritance",
      "Understand Python's resolution of diamond inheritance via C3 MRO",
      "Build a multi-tier banking engine with specialized accounts and audit trails",
      "Enforce invariants reliably across multi-level inheritance boundaries",
      "Celebrate completion of Part 10 and prepare for Part 11 (Comprehensions & Recursion)"
    ],
    "theoryBlocks": [
      {
        "heading": "Layered Modular Architecture",
        "text": "As software grows, placing all logic into a few classes leads to unmaintainable spaghetti code. Professional Python applications separate code into distinct layers: Domain Entities (core business models), Services (business rules and workflows), and Repositories/Interfaces (storage and external I/O).",
        "codeSnippet": "# 1. Domain Model\nclass User:\n    def __init__(self, user_id, email):\n        self.user_id = user_id\n        self.email = email\n\n# 2. Service Layer (Orchestration & Rules)\nclass UserService:\n    def __init__(self, repo, notifier):\n        self.repo = repo\n        self.notifier = notifier\n    \n    def register_user(self, email):\n        if self.repo.exists(email):\n            raise ValueError(\"User already registered.\")\n        user = self.repo.create(email)\n        self.notifier.send(email, \"Welcome!\")\n        return user",
        "terminalOutput": "",
        "tip": "Layered architecture ensures that changing your database or UI doesn't require rewriting your core business rules.",
        "mcq": {
          "id": "q-10-6-larger-modular-applications-0-v1",
          "question": "What is the primary benefit of a layered software architecture in Python?",
          "options": [
            {
              "id": "A",
              "text": "Separation of concerns: business rules, data storage, and external communication remain decoupled and independently testable",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It eliminates the need for Python classes entirely",
              "explanationIfWrong": "Layered architecture organizes classes into logical layers."
            },
            {
              "id": "C",
              "text": "It converts code to run on GPUs automatically",
              "explanationIfWrong": "It is an architectural organization methodology."
            },
            {
              "id": "D",
              "text": "It bypasses all network security firewalls",
              "explanationIfWrong": "It structures application code cleanly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Layered architecture isolates business logic from data access and presentation layers, facilitating modularity and testing."
        },
        "retestMcq": {
          "id": "q-10-6-larger-modular-applications-0-v2",
          "question": "In the UserService example, why are repo and notifier passed into the constructor (Dependency Injection)?",
          "options": [
            {
              "id": "A",
              "text": "To allow UserService to be tested with mock repositories and mock notifiers without touching real databases or SMTP servers",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because Python forbids creating instances inside methods",
              "explanationIfWrong": "Instances can be created anywhere; injection enables loose coupling."
            },
            {
              "id": "C",
              "text": "To make variables global",
              "explanationIfWrong": "Injected dependencies remain scoped to the service instance."
            },
            {
              "id": "D",
              "text": "To increase compile times",
              "explanationIfWrong": "The goal is testability and flexibility."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dependency injection decouples the service from concrete infrastructure, allowing painless unit testing with mocks."
        },
        "questionPool": [
          {
            "id": "q-10-6-larger-modular-applications-0-v1",
            "question": "What is the primary benefit of a layered software architecture in Python?",
            "options": [
              {
                "id": "A",
                "text": "Separation of concerns: business rules, data storage, and external communication remain decoupled and independently testable",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It eliminates the need for Python classes entirely",
                "explanationIfWrong": "Layered architecture organizes classes into logical layers."
              },
              {
                "id": "C",
                "text": "It converts code to run on GPUs automatically",
                "explanationIfWrong": "It is an architectural organization methodology."
              },
              {
                "id": "D",
                "text": "It bypasses all network security firewalls",
                "explanationIfWrong": "It structures application code cleanly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Layered architecture isolates business logic from data access and presentation layers, facilitating modularity and testing."
          },
          {
            "id": "q-10-6-larger-modular-applications-0-v2",
            "question": "In the UserService example, why are repo and notifier passed into the constructor (Dependency Injection)?",
            "options": [
              {
                "id": "A",
                "text": "To allow UserService to be tested with mock repositories and mock notifiers without touching real databases or SMTP servers",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python forbids creating instances inside methods",
                "explanationIfWrong": "Instances can be created anywhere; injection enables loose coupling."
              },
              {
                "id": "C",
                "text": "To make variables global",
                "explanationIfWrong": "Injected dependencies remain scoped to the service instance."
              },
              {
                "id": "D",
                "text": "To increase compile times",
                "explanationIfWrong": "The goal is testability and flexibility."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dependency injection decouples the service from concrete infrastructure, allowing painless unit testing with mocks."
          },
          {
            "id": "q-10-6-larger-modular-applications-0-v3",
            "question": "What layer of an application is responsible for enforcing business rules (e.g. preventing duplicate emails)?",
            "options": [
              {
                "id": "A",
                "text": "The Service layer",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The Database driver only",
                "explanationIfWrong": "Domain rules belong in the application service layer."
              },
              {
                "id": "C",
                "text": "The CSS stylesheet",
                "explanationIfWrong": "Stylesheets handle visual styling only."
              },
              {
                "id": "D",
                "text": "The operating system bootloader",
                "explanationIfWrong": "Business logic lives in the application service layer."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Service layer orchestrates domain operations and enforces business rules."
          }
        ]
      },
      {
        "heading": "Multiple Inheritance and Mixin Classes",
        "text": "Python supports multiple inheritance \u2014 a class can inherit from more than one parent. A powerful design pattern utilizing this is the Mixin: a lightweight class that provides a specific bundle of helper methods without defining its own separate state. Mixins allow you to compose capabilities across unrelated classes cleanly.",
        "codeSnippet": "import json\n\n# Mixin class providing JSON serialization capability\nclass JSONSerializableMixin:\n    def to_json(self):\n        return json.dumps(self.__dict__)\n\n# Mixin class providing audit logging capability\nclass LoggableMixin:\n    def log(self, message):\n        print(f\"[{self.__class__.__name__} LOG]: {message}\")\n\n# Customer inherits from multiple mixins!\nclass Customer(JSONSerializableMixin, LoggableMixin):\n    def __init__(self, name, tier):\n        self.name = name\n        self.tier = tier\n\nc = Customer(\"Grace\", \"Gold\")\nc.log(\"Account accessed.\")\nprint(f\"JSON: {c.to_json()}\")",
        "terminalOutput": "[Customer LOG]: Account accessed.\nJSON: {\"name\": \"Grace\", \"tier\": \"Gold\"}",
        "tip": "Mixins should not have their own __init__ or store unique state; they are designed to add pure behavior to classes.",
        "mcq": {
          "id": "q-10-6-larger-modular-applications-1-v1",
          "question": "What is a Mixin in Python object-oriented design?",
          "options": [
            {
              "id": "A",
              "text": "A specialized class that provides reusable methods to other classes via multiple inheritance, without managing its own independent state",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A cocktail recipe program",
              "explanationIfWrong": "It is an OOP design pattern."
            },
            {
              "id": "C",
              "text": "A compiler error when classes have too many methods",
              "explanationIfWrong": "Mixins are an architectural pattern for behavior composition."
            },
            {
              "id": "D",
              "text": "A function that mixes two strings together",
              "explanationIfWrong": "Mixins are classes that add capabilities."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Mixins provide plug-and-play methods (like serialization, logging, or caching) without deep, rigid inheritance hierarchies."
        },
        "retestMcq": {
          "id": "q-10-6-larger-modular-applications-1-v2",
          "question": "How do you declare that class Order inherits from both AuditableMixin and SerializableMixin?",
          "options": [
            {
              "id": "A",
              "text": "class Order(AuditableMixin, SerializableMixin):",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "class Order with AuditableMixin, SerializableMixin:",
              "explanationIfWrong": "Python uses commas inside parentheses for multiple inheritance."
            },
            {
              "id": "C",
              "text": "class Order implements AuditableMixin, SerializableMixin:",
              "explanationIfWrong": "implements is not a Python keyword."
            },
            {
              "id": "D",
              "text": "class Order + AuditableMixin + SerializableMixin:",
              "explanationIfWrong": "Inheritance is specified in parentheses."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Multiple base classes are listed separated by commas within parentheses after the class name."
        },
        "questionPool": [
          {
            "id": "q-10-6-larger-modular-applications-1-v1",
            "question": "What is a Mixin in Python object-oriented design?",
            "options": [
              {
                "id": "A",
                "text": "A specialized class that provides reusable methods to other classes via multiple inheritance, without managing its own independent state",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A cocktail recipe program",
                "explanationIfWrong": "It is an OOP design pattern."
              },
              {
                "id": "C",
                "text": "A compiler error when classes have too many methods",
                "explanationIfWrong": "Mixins are an architectural pattern for behavior composition."
              },
              {
                "id": "D",
                "text": "A function that mixes two strings together",
                "explanationIfWrong": "Mixins are classes that add capabilities."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Mixins provide plug-and-play methods (like serialization, logging, or caching) without deep, rigid inheritance hierarchies."
          },
          {
            "id": "q-10-6-larger-modular-applications-1-v2",
            "question": "How do you declare that class Order inherits from both AuditableMixin and SerializableMixin?",
            "options": [
              {
                "id": "A",
                "text": "class Order(AuditableMixin, SerializableMixin):",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "class Order with AuditableMixin, SerializableMixin:",
                "explanationIfWrong": "Python uses commas inside parentheses for multiple inheritance."
              },
              {
                "id": "C",
                "text": "class Order implements AuditableMixin, SerializableMixin:",
                "explanationIfWrong": "implements is not a Python keyword."
              },
              {
                "id": "D",
                "text": "class Order + AuditableMixin + SerializableMixin:",
                "explanationIfWrong": "Inheritance is specified in parentheses."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiple base classes are listed separated by commas within parentheses after the class name."
          },
          {
            "id": "q-10-6-larger-modular-applications-1-v3",
            "question": "Why should Mixin classes generally avoid defining their own __init__ methods?",
            "options": [
              {
                "id": "A",
                "text": "To avoid interfering with the constructor signatures and parameter chains of the concrete classes that adopt them",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because Python forbids __init__ in classes with 'Mixin' in the name",
                "explanationIfWrong": "The restriction is a software design best practice, not a compiler syntax rule."
              },
              {
                "id": "C",
                "text": "Because Mixins run in the browser",
                "explanationIfWrong": "Mixins are standard Python classes."
              },
              {
                "id": "D",
                "text": "Mixins have no access to self",
                "explanationIfWrong": "Mixin methods use self normally."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Keeping Mixins stateless prevents constructor signature collisions when mixed into various different domain models."
          }
        ]
      },
      {
        "heading": "The Diamond Problem & C3 Linearization",
        "text": "The classic hazard of multiple inheritance is the 'Diamond Problem': Class B and Class C both inherit from Class A, and Class D inherits from both B and C (forming a diamond shape). If both B and C override a method from A, which one does D call? Python resolves this deterministically using the C3 Linearization algorithm to compute the MRO.",
        "codeSnippet": "class A:\n    def ping(self): return \"A\"\n\nclass B(A):\n    def ping(self): return \"B\"\n\nclass C(A):\n    def ping(self): return \"C\"\n\n# D inherits from both B and C (forming the diamond)\nclass D(B, C):\n    pass\n\nd = D()\nprint(f\"d.ping() returns: {d.ping()}\")\nprint(f\"D MRO: {[cls.__name__ for cls in D.__mro__]}\")",
        "terminalOutput": "d.ping() returns: B\nD MRO: ['D', 'B', 'C', 'A', 'object']",
        "tip": "Because B was listed before C in class D(B, C):, B appears before C in the MRO, so B.ping() is chosen.",
        "mcq": {
          "id": "q-10-6-larger-modular-applications-2-v1",
          "question": "What is the 'Diamond Problem' in multiple inheritance?",
          "options": [
            {
              "id": "A",
              "text": "An ambiguity where a class inherits from two parent classes that both derive from a single common ancestor",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A security vulnerability involving encryption keys",
              "explanationIfWrong": "It is an inheritance graph topology problem."
            },
            {
              "id": "C",
              "text": "An error when a class has 4 attributes",
              "explanationIfWrong": "It relates to multiple inheritance method resolution."
            },
            {
              "id": "D",
              "text": "A hardware defect in CPU transistors",
              "explanationIfWrong": "It is a programming language inheritance concept."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The diamond problem arises when two branches of an inheritance tree share a common ancestor and override the same method."
        },
        "retestMcq": {
          "id": "q-10-6-larger-modular-applications-2-v2",
          "question": "How does Python resolve the Diamond Problem in class D(B, C)?",
          "options": [
            {
              "id": "A",
              "text": "Using the C3 Linearization algorithm to establish a deterministic, conflict-free Method Resolution Order (MRO)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It picks one at random each time the program runs",
              "explanationIfWrong": "Python MRO is 100% deterministic and predictable."
            },
            {
              "id": "C",
              "text": "It raises a DiamondInheritanceError at compile time",
              "explanationIfWrong": "Python fully supports diamond inheritance via C3 MRO."
            },
            {
              "id": "D",
              "text": "It deletes class A from memory",
              "explanationIfWrong": "A appears at the appropriate position in the MRO."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's C3 Linearization produces a clean, consistent MRO order: [D, B, C, A, object]."
        },
        "questionPool": [
          {
            "id": "q-10-6-larger-modular-applications-2-v1",
            "question": "What is the 'Diamond Problem' in multiple inheritance?",
            "options": [
              {
                "id": "A",
                "text": "An ambiguity where a class inherits from two parent classes that both derive from a single common ancestor",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A security vulnerability involving encryption keys",
                "explanationIfWrong": "It is an inheritance graph topology problem."
              },
              {
                "id": "C",
                "text": "An error when a class has 4 attributes",
                "explanationIfWrong": "It relates to multiple inheritance method resolution."
              },
              {
                "id": "D",
                "text": "A hardware defect in CPU transistors",
                "explanationIfWrong": "It is a programming language inheritance concept."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The diamond problem arises when two branches of an inheritance tree share a common ancestor and override the same method."
          },
          {
            "id": "q-10-6-larger-modular-applications-2-v2",
            "question": "How does Python resolve the Diamond Problem in class D(B, C)?",
            "options": [
              {
                "id": "A",
                "text": "Using the C3 Linearization algorithm to establish a deterministic, conflict-free Method Resolution Order (MRO)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It picks one at random each time the program runs",
                "explanationIfWrong": "Python MRO is 100% deterministic and predictable."
              },
              {
                "id": "C",
                "text": "It raises a DiamondInheritanceError at compile time",
                "explanationIfWrong": "Python fully supports diamond inheritance via C3 MRO."
              },
              {
                "id": "D",
                "text": "It deletes class A from memory",
                "explanationIfWrong": "A appears at the appropriate position in the MRO."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's C3 Linearization produces a clean, consistent MRO order: [D, B, C, A, object]."
          },
          {
            "id": "q-10-6-larger-modular-applications-2-v3",
            "question": "If class D is declared as class D(C, B): instead, what would d.ping() return?",
            "options": [
              {
                "id": "A",
                "text": "'C', because C is now listed first and precedes B in the MRO",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'B'",
                "explanationIfWrong": "Class declaration order directly dictates precedence in the MRO."
              },
              {
                "id": "C",
                "text": "'A'",
                "explanationIfWrong": "Subclasses C and B both override A."
              },
              {
                "id": "D",
                "text": "Raises an AttributeError",
                "explanationIfWrong": "Lookup resolves cleanly to C."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The declaration order of base classes determines their relative priority in the C3 MRO calculation."
          }
        ]
      },
      {
        "heading": "Comprehensive Case Study: Banking Architecture",
        "text": "Let's synthesize inheritance, abstract base classes, property validation, and encapsulation into a full production-grade banking engine.",
        "codeSnippet": "from abc import ABC, abstractmethod\n\nclass Account(ABC):\n    def __init__(self, account_id, owner, balance=0.0):\n        self.account_id = account_id\n        self.owner = owner\n        self._balance = float(balance)\n        self._transactions = []\n    \n    @property\n    def balance(self):\n        return self._balance\n    \n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Deposit must be positive.\")\n        self._balance += amount\n        self._transactions.append(f\"Deposit: +${amount:.2f}\")\n        return self._balance\n    \n    # Abstract withdrawal: specialized by checking vs savings\n    @abstractmethod\n    def withdraw(self, amount):\n        pass\n\nclass CheckingAccount(Account):\n    def __init__(self, account_id, owner, balance=0.0, overdraft_limit=500.0):\n        super().__init__(account_id, owner, balance)\n        self.overdraft_limit = float(overdraft_limit)\n    \n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Withdrawal must be positive.\")\n        if amount > (self._balance + self.overdraft_limit):\n            raise ValueError(\"Exceeds overdraft limit.\")\n        self._balance -= amount\n        self._transactions.append(f\"Withdrawal: -${amount:.2f}\")\n        return self._balance\n\nchk = CheckingAccount(\"CHK-01\", \"Bimal\", 100.0, overdraft_limit=200.0)\nchk.withdraw(250.0)  # Allowed via overdraft!\nprint(f\"Checking Balance: ${chk.balance:.2f}\")",
        "terminalOutput": "Checking Balance: $-150.00",
        "tip": "The abstract Account class defines standard deposits and balance tracking, while CheckingAccount specializes withdrawal to allow overdrafts.",
        "mcq": {
          "id": "q-10-6-larger-modular-applications-3-v1",
          "question": "Why is withdraw declared as an @abstractmethod on the Account base class?",
          "options": [
            {
              "id": "A",
              "text": "Because withdrawal rules differ fundamentally between account types (e.g. checking allows overdrafts, savings does not)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because base classes cannot have methods that return numbers",
              "explanationIfWrong": "Base classes can implement methods normally (like deposit)."
            },
            {
              "id": "C",
              "text": "Because withdrawing money is illegal in Python",
              "explanationIfWrong": "It enforces specialization in concrete subclasses."
            },
            {
              "id": "D",
              "text": "To prevent anyone from checking the balance",
              "explanationIfWrong": "Balance is exposed cleanly via @property."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Declaring withdraw abstract forces each account subclass to implement its own specific rules and limits."
        },
        "retestMcq": {
          "id": "q-10-6-larger-modular-applications-3-v2",
          "question": "What is the balance of chk after withdrawing $250.00 from an initial $100.00 with a $200.00 overdraft limit?",
          "options": [
            {
              "id": "A",
              "text": "-$150.00 (within the allowed -$200.00 overdraft limit)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "$0.00",
              "explanationIfWrong": "Overdraft permits the balance to drop below zero."
            },
            {
              "id": "C",
              "text": "$100.00 (rejected)",
              "explanationIfWrong": "250 is within the total available funds (100 + 200 = 300)."
            },
            {
              "id": "D",
              "text": "Raises a ValueError",
              "explanationIfWrong": "The withdrawal is within overdraft limits and succeeds."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Available funds are $300 ($100 balance + $200 overdraft). Withdrawing $250 results in a balance of -$150.00."
        },
        "questionPool": [
          {
            "id": "q-10-6-larger-modular-applications-3-v1",
            "question": "Why is withdraw declared as an @abstractmethod on the Account base class?",
            "options": [
              {
                "id": "A",
                "text": "Because withdrawal rules differ fundamentally between account types (e.g. checking allows overdrafts, savings does not)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because base classes cannot have methods that return numbers",
                "explanationIfWrong": "Base classes can implement methods normally (like deposit)."
              },
              {
                "id": "C",
                "text": "Because withdrawing money is illegal in Python",
                "explanationIfWrong": "It enforces specialization in concrete subclasses."
              },
              {
                "id": "D",
                "text": "To prevent anyone from checking the balance",
                "explanationIfWrong": "Balance is exposed cleanly via @property."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Declaring withdraw abstract forces each account subclass to implement its own specific rules and limits."
          },
          {
            "id": "q-10-6-larger-modular-applications-3-v2",
            "question": "What is the balance of chk after withdrawing $250.00 from an initial $100.00 with a $200.00 overdraft limit?",
            "options": [
              {
                "id": "A",
                "text": "-$150.00 (within the allowed -$200.00 overdraft limit)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "$0.00",
                "explanationIfWrong": "Overdraft permits the balance to drop below zero."
              },
              {
                "id": "C",
                "text": "$100.00 (rejected)",
                "explanationIfWrong": "250 is within the total available funds (100 + 200 = 300)."
              },
              {
                "id": "D",
                "text": "Raises a ValueError",
                "explanationIfWrong": "The withdrawal is within overdraft limits and succeeds."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Available funds are $300 ($100 balance + $200 overdraft). Withdrawing $250 results in a balance of -$150.00."
          },
          {
            "id": "q-10-6-larger-modular-applications-3-v3",
            "question": "What would happen if chk attempted to withdraw $350.00 instead?",
            "options": [
              {
                "id": "A",
                "text": "Raises a ValueError('Exceeds overdraft limit.') and the balance remains -$150.00",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The balance drops to -$500.00",
                "explanationIfWrong": "The guard check blocks transactions exceeding the overdraft limit."
              },
              {
                "id": "C",
                "text": "The account is closed",
                "explanationIfWrong": "Exceptions reject the transaction without destroying objects."
              },
              {
                "id": "D",
                "text": "Returns None",
                "explanationIfWrong": "An explicit ValueError is raised."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because $350 exceeds total available funds (balance + overdraft limit), the validation exception is raised."
          }
        ]
      },
      {
        "heading": "Specializing Other Account Types",
        "text": "Now, adding a new SavingsAccount requires zero modifications to Account or CheckingAccount. Savings accounts forbid overdrafts and calculate monthly interest.",
        "codeSnippet": "class SavingsAccount(Account):\n    def __init__(self, account_id, owner, balance=0.0, interest_rate=0.03):\n        super().__init__(account_id, owner, balance)\n        self.interest_rate = float(interest_rate)\n    \n    # Specializing withdrawal: strictly no overdrafts!\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Withdrawal must be positive.\")\n        if amount > self._balance:\n            raise ValueError(\"Insufficient funds in savings account.\")\n        self._balance -= amount\n        return self._balance\n    \n    def apply_interest(self):\n        interest = self._balance * self.interest_rate\n        self._balance += interest\n        self._transactions.append(f\"Interest applied: +${interest:.2f}\")\n        return self._balance\n\nsav = SavingsAccount(\"SAV-02\", \"Bimal\", 1000.0, interest_rate=0.05)\nsav.apply_interest()\nprint(f\"Savings Balance after interest: ${sav.balance:.2f}\")",
        "terminalOutput": "Savings Balance after interest: $1050.00",
        "tip": "SavingsAccount satisfies the abstract Account contract while adding its own domain-specific apply_interest() behavior.",
        "mcq": {
          "id": "q-10-6-larger-modular-applications-4-v1",
          "question": "What invariant does SavingsAccount enforce on withdrawals that differs from CheckingAccount?",
          "options": [
            {
              "id": "A",
              "text": "Savings accounts strictly forbid negative balances (no overdrafts allowed)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Savings accounts only permit withdrawals on holidays",
              "explanationIfWrong": "There is no holiday restriction."
            },
            {
              "id": "C",
              "text": "Savings accounts allow unlimited overdraft up to $10,000",
              "explanationIfWrong": "Checking has overdrafts; savings does not."
            },
            {
              "id": "D",
              "text": "Savings accounts can never be withdrawn from",
              "explanationIfWrong": "Withdrawals are allowed up to the available balance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "SavingsAccount checks amount > self._balance, strictly enforcing that balance never falls below zero."
        },
        "retestMcq": {
          "id": "q-10-6-larger-modular-applications-4-v2",
          "question": "What is the new balance when sav.apply_interest() is called on $1000.00 at a 5% (0.05) interest rate?",
          "options": [
            {
              "id": "A",
              "text": "$1,050.00",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "$1,005.00",
              "explanationIfWrong": "1000 * 0.05 = 50; 1000 + 50 = 1050."
            },
            {
              "id": "C",
              "text": "$1,500.00",
              "explanationIfWrong": "0.05 is 5%, not 50%."
            },
            {
              "id": "D",
              "text": "$1,000.00",
              "explanationIfWrong": "Interest is applied and added to balance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Interest earned is $50.00 ($1000 * 0.05), bringing the new balance to $1,050.00."
        },
        "questionPool": [
          {
            "id": "q-10-6-larger-modular-applications-4-v1",
            "question": "What invariant does SavingsAccount enforce on withdrawals that differs from CheckingAccount?",
            "options": [
              {
                "id": "A",
                "text": "Savings accounts strictly forbid negative balances (no overdrafts allowed)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Savings accounts only permit withdrawals on holidays",
                "explanationIfWrong": "There is no holiday restriction."
              },
              {
                "id": "C",
                "text": "Savings accounts allow unlimited overdraft up to $10,000",
                "explanationIfWrong": "Checking has overdrafts; savings does not."
              },
              {
                "id": "D",
                "text": "Savings accounts can never be withdrawn from",
                "explanationIfWrong": "Withdrawals are allowed up to the available balance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "SavingsAccount checks amount > self._balance, strictly enforcing that balance never falls below zero."
          },
          {
            "id": "q-10-6-larger-modular-applications-4-v2",
            "question": "What is the new balance when sav.apply_interest() is called on $1000.00 at a 5% (0.05) interest rate?",
            "options": [
              {
                "id": "A",
                "text": "$1,050.00",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "$1,005.00",
                "explanationIfWrong": "1000 * 0.05 = 50; 1000 + 50 = 1050."
              },
              {
                "id": "C",
                "text": "$1,500.00",
                "explanationIfWrong": "0.05 is 5%, not 50%."
              },
              {
                "id": "D",
                "text": "$1,000.00",
                "explanationIfWrong": "Interest is applied and added to balance."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Interest earned is $50.00 ($1000 * 0.05), bringing the new balance to $1,050.00."
          },
          {
            "id": "q-10-6-larger-modular-applications-4-v3",
            "question": "Can CheckingAccount and SavingsAccount instances be managed together in a single accounts list and processed polymorphically?",
            "options": [
              {
                "id": "A",
                "text": "Yes, both inherit from Account and share common methods like deposit() and withdraw()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, Python forbids putting different subclasses in the same list",
                "explanationIfWrong": "Python lists can hold any combination of objects."
              },
              {
                "id": "C",
                "text": "Only if they have the exact same balance",
                "explanationIfWrong": "Objects maintain their own independent state."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Polymorphism is standard in modern Python."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Both subclasses share the common Account interface, enabling seamless polymorphic collection management."
          }
        ]
      },
      {
        "heading": "Stage 2 Architecture Mastery: Onward to Part 11",
        "text": "Congratulations! You have completed Part 10, achieving complete mastery over Object-Oriented Architecture: inheritance hierarchies ('is-a'), super() constructor delegation, Method Resolution Order (MRO), method overriding and extension, polymorphism, duck typing, Abstract Base Classes (ABCs), and multi-class systems. In Part 11, you will pivot into expressive computational patterns: List, Set, and Dictionary Comprehensions and Recursive Algorithms.",
        "codeSnippet": "# Sneak peek of Part 11 (Comprehensions & Recursion):\n# Concise list comprehension filtering accounts:\nactive_owners = [acc.owner for acc in [chk, sav] if acc.balance > 0]\nprint(f\"Positive balance accounts: {active_owners}\")\n\n# Classic recursion (Part 11):\ndef countdown(n):\n    if n <= 0:\n        return [\"Liftoff!\"]\n    return [n] + countdown(n - 1)\nprint(countdown(3))",
        "terminalOutput": "Positive balance accounts: ['Bimal']\n[3, 2, 1, 'Liftoff!']",
        "tip": "You now possess the foundational OOP tools used by professional Python architects worldwide. Stage 2 continues with algorithmic mastery!",
        "mcq": {
          "id": "q-10-6-larger-modular-applications-5-v1",
          "question": "Which of the following topics represents the focus of Part 11 in our curriculum?",
          "options": [
            {
              "id": "A",
              "text": "List, Set, and Dictionary Comprehensions, and Recursive Problem Solving",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "HTML and CSS styling",
              "explanationIfWrong": "Part 11 covers core Python comprehensions and recursion."
            },
            {
              "id": "C",
              "text": "Installing Windows drivers",
              "explanationIfWrong": "This is an advanced Python curriculum."
            },
            {
              "id": "D",
              "text": "Writing basic print statements",
              "explanationIfWrong": "Basic printing was mastered in Part 1."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Part 11 covers advanced expressive comprehensions and recursive problem solving."
        },
        "retestMcq": {
          "id": "q-10-6-larger-modular-applications-5-v2",
          "question": "What is the defining characteristic of a recursive function?",
          "options": [
            {
              "id": "A",
              "text": "A function that solves a problem by calling itself with a smaller input until it reaches a base condition",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A function that takes 100 arguments",
              "explanationIfWrong": "Recursion is self-referential execution."
            },
            {
              "id": "C",
              "text": "A function that runs only at compile time",
              "explanationIfWrong": "Recursion executes at runtime on the call stack."
            },
            {
              "id": "D",
              "text": "A function with no return statement",
              "explanationIfWrong": "Recursive functions must return values and have base cases."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Recursion decomposes problems into smaller subproblems by calling itself until hitting a base case."
        },
        "questionPool": [
          {
            "id": "q-10-6-larger-modular-applications-5-v1",
            "question": "Which of the following topics represents the focus of Part 11 in our curriculum?",
            "options": [
              {
                "id": "A",
                "text": "List, Set, and Dictionary Comprehensions, and Recursive Problem Solving",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "HTML and CSS styling",
                "explanationIfWrong": "Part 11 covers core Python comprehensions and recursion."
              },
              {
                "id": "C",
                "text": "Installing Windows drivers",
                "explanationIfWrong": "This is an advanced Python curriculum."
              },
              {
                "id": "D",
                "text": "Writing basic print statements",
                "explanationIfWrong": "Basic printing was mastered in Part 1."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Part 11 covers advanced expressive comprehensions and recursive problem solving."
          },
          {
            "id": "q-10-6-larger-modular-applications-5-v2",
            "question": "What is the defining characteristic of a recursive function?",
            "options": [
              {
                "id": "A",
                "text": "A function that solves a problem by calling itself with a smaller input until it reaches a base condition",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A function that takes 100 arguments",
                "explanationIfWrong": "Recursion is self-referential execution."
              },
              {
                "id": "C",
                "text": "A function that runs only at compile time",
                "explanationIfWrong": "Recursion executes at runtime on the call stack."
              },
              {
                "id": "D",
                "text": "A function with no return statement",
                "explanationIfWrong": "Recursive functions must return values and have base cases."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Recursion decomposes problems into smaller subproblems by calling itself until hitting a base case."
          },
          {
            "id": "q-10-6-larger-modular-applications-5-v3",
            "question": "What complete set of OOP architectural tools did you master across Parts 8, 9, and 10?",
            "options": [
              {
                "id": "A",
                "text": "Classes, constructors, methods, __str__/__repr__, memory references, composition, encapsulation, properties, class attributes, inheritance, super(), polymorphism, duck typing, and ABCs",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Only basic while loops",
                "explanationIfWrong": "Loops were mastered in Part 3."
              },
              {
                "id": "C",
                "text": "Only file reading",
                "explanationIfWrong": "File reading was mastered in Part 6."
              },
              {
                "id": "D",
                "text": "Only math functions",
                "explanationIfWrong": "Parts 8-10 deliver comprehensive enterprise OOP mastery."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Parts 8, 9, and 10 provide complete end-to-end mastery of object-oriented programming in Python."
          }
        ]
      }
    ]
  }
];

// Question pool selector for Part 10
export const getActiveQuestionsForLevelPart10 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part10_seen_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part10_active_qset_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 10
export const getConsecutiveFailuresPart10 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part10_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart10 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part10_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart10 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part10_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart10 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part10_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart10 = (
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
  const currentAttempt = getLevelAttemptCountPart10(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part10_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part10_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part10_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part10_locked_${studentId}`);
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
      setLevelAttemptCountPart10(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart10(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart10(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part10_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part10_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part10_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart10 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part10_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part10_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part10_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part10_locked_progression_${studentId}`);
  } catch {}
};
