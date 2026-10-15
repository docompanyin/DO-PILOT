// src/data/javaPart8Data.ts
// Helsinki MOOC Java Programming Part 8: Hash Maps, Similarity, Equals, HashCode, and Grouping

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
  // -------------------------------------------------------------
  // LEVEL 8.1: Short Recap of Theory
  // -------------------------------------------------------------
  {
    id: "8-1-recap",
    number: "8.1",
    title: "Short Recap of Theory",
    subtitle: "Encapsulation, instance variables, reference types, and constructor mechanics in Java OOP.",
    readTime: "20 min",
    objectives: [
      "Review class definitions, instance variables, constructors, and method invocations",
      "Reinforce strict encapsulation using private fields and public accessors",
      "Understand the difference between reference identity (==) and state equality (.equals())",
      "Trace reference variables in stack and heap memory during method parameter passing",
      "Identify the lifecycle of objects and garbage collection when references go out of scope",
      "Apply constructor overloading and 'this(...)' chaining cleanly"
    ],
    theoryBlocks: [
      {
        heading: "Encapsulation and Access Modifiers",
        text: "Encapsulation hides the internal representation of an object from the outside world. In Java, instance variables are declared 'private' so external code cannot modify state arbitrarily. Public getter and setter methods provide controlled access and enforce domain validation rules.",
        codeSnippet: "public class BankAccount {\n    private double balance;\n\n    public BankAccount(double initialBalance) {\n        if (initialBalance >= 0) {\n            this.balance = initialBalance;\n        } else {\n            this.balance = 0;\n        }\n    }\n\n    public void deposit(double amount) {\n        if (amount > 0) {\n            this.balance += amount;\n        }\n    }\n\n    public double getBalance() { return this.balance; }\n}",
        terminalOutput: "BankAccount acc = new BankAccount(100.0);\nacc.deposit(50.0);\nSystem.out.println(acc.getBalance()); // 150.0",
        tip: "By keeping 'balance' private, external code cannot assign negative numbers like 'acc.balance = -50000;'.",
        warning: "Never expose mutable internal collections or variables directly with public access modifiers.",
        mcq: {
          id: "j8-1-1",
          question: "Why should instance variables in a class almost always be declared with the 'private' access modifier?",
          options: [
            { id: "A", text: "To prevent external classes from directly altering internal state and bypassing validation logic", explanationIfWrong: "" },
            { id: "B", text: "Because private variables run faster in the CPU cache", explanationIfWrong: "Access modifiers enforce access control, not hardware speed." },
            { id: "C", text: "Java does not allow constructors to read non-private variables", explanationIfWrong: "Constructors can access variables of any access level in their class." },
            { id: "D", text: "To make the variables accessible to all classes in any package", explanationIfWrong: "Public makes variables accessible everywhere, private restricts access to the declaring class." }
          ],
          correctAnswer: "A",
          explanationNote: "Private fields ensure encapsulation: outside callers can only interact through validated methods."
        },
        questionPool: [
          {
            id: "j8-1-1-alt1",
            question: "What happens if external code tries to directly access 'acc.balance' when balance is declared private?",
            options: [
              { id: "A", text: "A compilation error occurs ('balance has private access in BankAccount')", explanationIfWrong: "" },
              { id: "B", text: "A NullPointerException is thrown at runtime", explanationIfWrong: "Access restrictions are enforced at compile time." },
              { id: "C", text: "The variable is read as 0.0 silently", explanationIfWrong: "The code will not compile." },
              { id: "D", text: "Java creates a public clone of the variable", explanationIfWrong: "No cloning occurs." }
            ],
            correctAnswer: "A",
            explanationNote: "The Java compiler enforces access modifiers at compile time, rejecting unauthorized access with a compile error."
          },
          {
            id: "j8-1-1-alt2",
            question: "Which keyword in Java refers to the current instance of the class?",
            options: [
              { id: "A", text: "this", explanationIfWrong: "" },
              { id: "B", text: "self", explanationIfWrong: "self is Python syntax, Java uses this." },
              { id: "C", text: "super", explanationIfWrong: "super refers to the superclass." },
              { id: "D", text: "me", explanationIfWrong: "me is not a Java keyword." }
            ],
            correctAnswer: "A",
            explanationNote: "'this' represents a reference to the current object instance in Java."
          }
        ]
      },
      {
        heading: "Stack vs. Heap Memory & Object References",
        text: "In Java, primitive variables (int, double, boolean) store their raw literal value directly on the call Stack. Reference variables (e.g. 'Person p = new Person(\"Alice\");') store a memory address on the Stack that points to the actual Person object allocated on the Heap.",
        codeSnippet: "Person p1 = new Person(\"Alice\");\nPerson p2 = p1; // p2 now points to the SAME object on the Heap!\n\np2.setAge(25);\nSystem.out.println(p1.getAge()); // Prints 25!",
        terminalOutput: "p1 and p2 are two references pointing to the exact same Heap object.\nModifying through p2 alters the object seen by p1.",
        tip: "When you pass an object into a method, Java copies the reference (pass-by-value of the reference), pointing to the same Heap object.",
        warning: "Comparing objects with '==' checks whether both references hold the same memory address, NOT whether their field values match!",
        mcq: {
          id: "j8-1-2",
          question: "Given: 'Person p1 = new Person(\"Bob\"); Person p2 = p1;', what is the effect of executing 'p2.setAge(30);'?",
          options: [
            { id: "A", text: "Both p1.getAge() and p2.getAge() will return 30 because both variables refer to the exact same object in Heap memory", explanationIfWrong: "" },
            { id: "B", text: "Only p2's age changes; p1 remains untouched because p2 was a deep clone", explanationIfWrong: "Assignment (=) copies the reference pointer, not the underlying object." },
            { id: "C", text: "A NullPointerException is thrown", explanationIfWrong: "Both references are valid non-null pointers." },
            { id: "D", text: "p1 becomes null", explanationIfWrong: "p1 remains unchanged." }
          ],
          correctAnswer: "A",
          explanationNote: "Reference assignment copies the memory address (aliasing). Both p1 and p2 point to the same object on the Heap."
        },
        questionPool: [
          {
            id: "j8-1-2-alt1",
            question: "Where are objects created with the 'new' keyword stored in Java memory?",
            options: [
              { id: "A", text: "On the Heap", explanationIfWrong: "" },
              { id: "B", text: "On the Call Stack", explanationIfWrong: "The Stack holds local primitive variables and reference address pointers." },
              { id: "C", text: "In the CPU cache exclusively", explanationIfWrong: "Objects live in the JVM heap space." },
              { id: "D", text: "In the file system", explanationIfWrong: "Heap memory resides in RAM." }
            ],
            correctAnswer: "A",
            explanationNote: "All dynamically allocated Java objects live on the Heap."
          },
          {
            id: "j8-1-2-alt2",
            question: "What happens to an object on the Heap when no active references point to it anymore?",
            options: [
              { id: "A", text: "It becomes eligible for Garbage Collection and its memory is automatically reclaimed", explanationIfWrong: "" },
              { id: "B", text: "It causes an immediate OutOfMemoryError", explanationIfWrong: "The JVM automatically cleans up unreachable objects." },
              { id: "C", text: "It persists forever until the computer shuts down", explanationIfWrong: "Java's garbage collector automatically reclaims unreachable memory." },
              { id: "D", text: "It is written to hard drive storage", explanationIfWrong: "No disk swap occurs automatically." }
            ],
            correctAnswer: "A",
            explanationNote: "Java Garbage Collection (GC) automatically frees Heap memory when objects become unreachable."
          }
        ]
      },
      {
        heading: "Equality: Reference (==) vs. Value (.equals())",
        text: "The '==' operator compares literal values: for primitives it checks value equality (5 == 5), but for reference variables it checks if both references point to the exact same memory address on the Heap. To compare whether two distinct objects contain identical logical data, you must use the '.equals()' method.",
        codeSnippet: "String s1 = new String(\"Java\");\nString s2 = new String(\"Java\");\n\nSystem.out.println(s1 == s2);      // false (different heap memory addresses!)\nSystem.out.println(s1.equals(s2));  // true (identical string content)",
        terminalOutput: "s1 == s2 -> false\ns1.equals(s2) -> true",
        tip: "Always use .equals() when comparing Strings and objects.",
        warning: "Never use '==' to compare Strings, Scanner inputs, or domain objects!",
        mcq: {
          id: "j8-1-3",
          question: "Why does 'new String(\"test\") == new String(\"test\")' evaluate to false in Java?",
          options: [
            { id: "A", text: "Because '==' compares memory addresses of reference types, and 'new' created two separate objects in heap memory", explanationIfWrong: "" },
            { id: "B", text: "Because the characters in the strings do not match", explanationIfWrong: "Both strings contain identical text 'test'." },
            { id: "C", text: "Because Java strings cannot be compared under any circumstances", explanationIfWrong: "Strings can be compared using .equals()." },
            { id: "D", text: "Because String is a primitive type", explanationIfWrong: "String is a reference class type." }
          ],
          correctAnswer: "A",
          explanationNote: "Each 'new' creates a distinct object with its own memory address. '==' checks address equality, not content."
        },
        questionPool: [
          {
            id: "j8-1-3-alt1",
            question: "How should you compare two Book objects (b1 and b2) to see if they represent the same title and author?",
            options: [
              { id: "A", text: "b1.equals(b2)", explanationIfWrong: "" },
              { id: "B", text: "b1 == b2", explanationIfWrong: "b1 == b2 only checks if they are the exact same instance in memory." },
              { id: "C", text: "b1.compareTo(b2) == false", explanationIfWrong: "compareTo returns an int (-1, 0, 1), not a boolean." },
              { id: "D", text: "b1 = b2", explanationIfWrong: "= is assignment, not comparison." }
            ],
            correctAnswer: "A",
            explanationNote: ".equals() is the designated method for logical value equality in Java."
          },
          {
            id: "j8-1-3-alt2",
            question: "What is the default implementation of .equals() in java.lang.Object?",
            options: [
              { id: "A", text: "It uses 'this == compared', checking memory address equality", explanationIfWrong: "" },
              { id: "B", text: "It compares all instance variable names alphabetically", explanationIfWrong: "Object.equals does not inspect field values." },
              { id: "C", text: "It always returns true", explanationIfWrong: "It returns true only if the references match." },
              { id: "D", text: "It throws an UnsupportedOperationException", explanationIfWrong: "It performs reference equality check." }
            ],
            correctAnswer: "A",
            explanationNote: "Inherited from Object, .equals() defaults to reference comparison (==). Classes must override it to compare fields."
          }
        ]
      },
      {
        heading: "Constructor Chaining with this(...)",
        text: "When a class has multiple overloaded constructors, duplicate initialization code should be eliminated by calling one constructor from another using 'this(...)'. The constructor call must be the very first statement in the constructor body.",
        codeSnippet: "public class Product {\n    private String name;\n    private double price;\n\n    // Detailed constructor:\n    public Product(String name, double price) {\n        this.name = name;\n        this.price = price;\n    }\n\n    // Overloaded constructor with default price:\n    public Product(String name) {\n        this(name, 0.0); // Chaining to the 2-argument constructor!\n    }\n}",
        terminalOutput: "Product p1 = new Product(\"Pen\", 1.50);\nProduct p2 = new Product(\"Sample\"); // price defaults to 0.0",
        tip: "Constructor chaining centralizes validation logic in one master constructor.",
        warning: "'this(...)' must always be the very first line inside the constructor.",
        mcq: {
          id: "j8-1-4",
          question: "Where must a constructor call to another overloaded constructor using 'this(...)' appear inside a constructor body?",
          options: [
            { id: "A", text: "As the very first statement on line 1 of the constructor", explanationIfWrong: "" },
            { id: "B", text: "At the very end of the constructor", explanationIfWrong: "Java requires this(...) to be the first statement." },
            { id: "C", text: "Anywhere, as long as it is inside a try block", explanationIfWrong: "It must be the first statement unconditionally." },
            { id: "D", text: "Outside the class definition", explanationIfWrong: "Constructors are defined inside classes." }
          ],
          correctAnswer: "A",
          explanationNote: "Java language specification mandates that explicit constructor invocations (this or super) must be the first statement."
        },
        questionPool: [
          {
            id: "j8-1-4-alt1",
            question: "What is the primary benefit of constructor chaining in Java?",
            options: [
              { id: "A", text: "Eliminates repetitive initialization code and ensures all field validation occurs in a single constructor", explanationIfWrong: "" },
              { id: "B", text: "Increases heap memory by 200%", explanationIfWrong: "It affects code organization, not memory consumption." },
              { id: "C", text: "Converts the class into an interface", explanationIfWrong: "Interfaces cannot have constructors." },
              { id: "D", text: "Allows constructors to return a boolean value", explanationIfWrong: "Constructors cannot return values." }
            ],
            correctAnswer: "A",
            explanationNote: "Chaining delegates initialization to a single master constructor, eliminating code duplication."
          },
          {
            id: "j8-1-4-alt2",
            question: "What compilation error occurs if 'this(...)' is placed after another statement inside a constructor?",
            options: [
              { id: "A", text: "'call to this must be first statement in constructor'", explanationIfWrong: "" },
              { id: "B", text: "'NullPointerException'", explanationIfWrong: "It is a compile-time syntax rule error, not a runtime exception." },
              { id: "C", text: "'ClassCastException'", explanationIfWrong: "No casting is involved." },
              { id: "D", text: "It compiles with a warning only", explanationIfWrong: "It is a fatal compilation error." }
            ],
            correctAnswer: "A",
            explanationNote: "The compiler strictly requires 'this(...)' or 'super(...)' to be the first line."
          }
        ]
      },
      {
        heading: "Null References & NullPointerException",
        text: "A reference variable that has not been initialized with an object contains the value 'null'. Calling any method or accessing any field on a null reference immediately throws a 'NullPointerException' (NPE), crashing the program.",
        codeSnippet: "Person person = null;\n\n// RISKY: Throws NullPointerException!\n// System.out.println(person.getName());\n\n// SAFE: Guard check with != null\nif (person != null) {\n    System.out.println(person.getName());\n} else {\n    System.out.println(\"No person provided!\");\n}",
        terminalOutput: "Null check prevents runtime crashes:\nNo person provided!",
        tip: "Initialize instance variable collections (e.g. this.items = new ArrayList<>();) in constructors so they are never null.",
        warning: "Never call methods on variables that could be null without a null check.",
        mcq: {
          id: "j8-1-5",
          question: "What happens if a program attempts to execute 'person.getName()' when the variable 'person' holds 'null'?",
          options: [
            { id: "A", text: "A NullPointerException is thrown at runtime, halting execution if unhandled", explanationIfWrong: "" },
            { id: "B", text: "It returns an empty string \"\"", explanationIfWrong: "Java does not silently invent empty strings for null targets." },
            { id: "C", text: "The compiler automatically instantiates a new Person", explanationIfWrong: "Java does not auto-instantiate objects." },
            { id: "D", text: "The method returns null without error", explanationIfWrong: "Dereferencing null throws an exception." }
          ],
          correctAnswer: "A",
          explanationNote: "Attempting to dereference a null pointer causes the JVM to throw a NullPointerException."
        },
        questionPool: [
          {
            id: "j8-1-5-alt1",
            question: "What is the default value of an uninitialized instance variable of an object reference type (e.g. 'private String name;')?",
            options: [
              { id: "A", text: "null", explanationIfWrong: "" },
              { id: "B", text: "\"\"", explanationIfWrong: "Empty string must be explicitly assigned." },
              { id: "C", text: "0", explanationIfWrong: "0 is the default for numeric primitives, not reference types." },
              { id: "D", text: "undefined", explanationIfWrong: "undefined is JavaScript; Java uses null." }
            ],
            correctAnswer: "A",
            explanationNote: "All object reference fields default to null if not explicitly assigned."
          },
          {
            id: "j8-1-5-alt2",
            question: "How can you safely test whether a String parameter 'str' is equal to \"yes\" even if 'str' might be null?",
            options: [
              { id: "A", text: "\"yes\".equals(str) — calling equals on the non-null literal", explanationIfWrong: "" },
              { id: "B", text: "str.equals(\"yes\")", explanationIfWrong: "If str is null, str.equals() throws a NullPointerException." },
              { id: "C", text: "str == \"yes\"", explanationIfWrong: "== checks reference identity, which fails for different string instances." },
              { id: "D", text: "str.compareTo(\"yes\")", explanationIfWrong: "Calling compareTo on null throws NPE." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling .equals() on the literal string (\"yes\".equals(str)) is null-safe and returns false if str is null."
          }
        ]
      },
      {
        heading: "Defensive Copying & Encapsulation Leaks",
        text: "If a getter method returns a direct reference to an internal mutable collection (such as an ArrayList), external code can modify, add, or clear items from that list without the owning object's knowledge! To preserve encapsulation, return a defensive copy: 'new ArrayList<>(this.items);'.",
        codeSnippet: "public class Playlist {\n    private ArrayList<String> songs = new ArrayList<>();\n\n    // LEAK: Callers can alter internal songs directly!\n    // public ArrayList<String> getSongs() { return this.songs; }\n\n    // SECURE: Defensive copy\n    public ArrayList<String> getSongs() {\n        return new ArrayList<>(this.songs);\n    }\n}",
        terminalOutput: "Defensive copy ensures outside modifications do not corrupt internal class state.",
        tip: "Alternatively, wrap the list using 'Collections.unmodifiableList(this.songs)'.",
        warning: "Returning a raw internal list reference breaks encapsulation.",
        mcq: {
          id: "j8-1-6",
          question: "Why should a getter method return 'new ArrayList<>(this.list)' instead of returning 'this.list' directly?",
          options: [
            { id: "A", text: "To prevent external callers from mutating or clearing the class's internal list without permission (defensive copy)", explanationIfWrong: "" },
            { id: "B", text: "Because ArrayLists cannot be returned from public methods", explanationIfWrong: "ArrayLists can be returned from methods." },
            { id: "C", text: "It converts the list to an array", explanationIfWrong: "It creates a new ArrayList with the same elements." },
            { id: "D", text: "It doubles the execution speed of loops", explanationIfWrong: "Defensive copying protects integrity, not speed." }
          ],
          correctAnswer: "A",
          explanationNote: "Returning a defensive copy prevents callers from modifying internal object state, upholding strict encapsulation."
        },
        questionPool: [
          {
            id: "j8-1-6-alt1",
            question: "What happens if a caller calls '.clear()' on the returned list if defensive copying was used?",
            options: [
              { id: "A", text: "Only the copy is cleared; the internal list inside the object remains intact", explanationIfWrong: "" },
              { id: "B", text: "Both the copy and the internal list are wiped", explanationIfWrong: "They are separate list instances in memory." },
              { id: "C", text: "An UnsupportedOperationException is thrown", explanationIfWrong: "The copy is a normal mutable ArrayList." },
              { id: "D", text: "The JVM terminates", explanationIfWrong: "Normal list operations do not crash the JVM." }
            ],
            correctAnswer: "A",
            explanationNote: "Because the copy is an independent object, clearing it has no effect on the original collection."
          },
          {
            id: "j8-1-6-alt2",
            question: "What wrapper method from java.util.Collections prevents any modifications to a returned list?",
            options: [
              { id: "A", text: "Collections.unmodifiableList(this.list)", explanationIfWrong: "" },
              { id: "B", text: "Collections.freeze(this.list)", explanationIfWrong: "Collections.freeze does not exist." },
              { id: "C", text: "Collections.lock(this.list)", explanationIfWrong: "Collections.lock does not exist." },
              { id: "D", text: "Collections.protect(this.list)", explanationIfWrong: "Collections.protect does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "Collections.unmodifiableList returns a view that throws UnsupportedOperationException if modification is attempted."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 8.2: Hash Map (HashMap<K, V>)
  // -------------------------------------------------------------
  {
    id: "8-2-hashmap",
    number: "8.2",
    title: "Hash Map (HashMap<K, V>)",
    subtitle: "Key-value associations, O(1) constant-time lookups, get, put, containsKey, and keySet iteration.",
    readTime: "25 min",
    objectives: [
      "Instantiate and use HashMap<KeyType, ValueType> for associative key-value mapping",
      "Insert and update entries using put(key, value)",
      "Retrieve values in O(1) time using get(key) and getOrDefault(key, defaultValue)",
      "Check for key existence using containsKey(key)",
      "Iterate through keys with keySet() and values with values()",
      "Use wrapper classes (Integer, Double) instead of primitive types in generics"
    ],
    theoryBlocks: [
      {
        heading: "Introduction to HashMaps: Key-Value Pairs",
        text: "An ArrayList stores elements by consecutive integer indices (0, 1, 2...). A 'HashMap<K, V>' stores pairs consisting of a 'key' and a 'value'. The key can be any object (such as a String or custom object). Looking up a value by its key in a HashMap runs in average O(1) constant time, making it exceptionally fast.",
        codeSnippet: "import java.util.HashMap;\n\nHashMap<String, String> nicknames = new HashMap<>();\nnicknames.put(\"matthew\", \"matt\");\nnicknames.put(\"michael\", \"mix\");\nnicknames.put(\"arthur\", \"artie\");\n\nSystem.out.println(nicknames.get(\"matthew\")); // Prints \"matt\"",
        terminalOutput: "HashMap Lookup:\nKey \"matthew\" -> Value \"matt\"\nKey \"unknown\" -> null",
        tip: "A key in a HashMap can only exist once! Adding another value with an existing key overwrites the old value.",
        warning: "If you call map.get(key) for a key that does not exist in the map, it returns 'null'.",
        mcq: {
          id: "j8-2-1",
          question: "What is the average time complexity of retrieving a value from a HashMap using a key (map.get(key))?",
          options: [
            { id: "A", text: "O(1) constant time", explanationIfWrong: "" },
            { id: "B", text: "O(N) linear time", explanationIfWrong: "ArrayList.contains takes O(N), but HashMap lookups are O(1)." },
            { id: "C", text: "O(log N) logarithmic time", explanationIfWrong: "TreeMap takes O(log N), but HashMap takes O(1)." },
            { id: "D", text: "O(N^2) quadratic time", explanationIfWrong: "Hash maps avoid nested scans entirely." }
          ],
          correctAnswer: "A",
          explanationNote: "HashMap uses hash codes to index directly into internal buckets, providing average O(1) constant-time lookups."
        },
        questionPool: [
          {
            id: "j8-2-1-alt1",
            question: "What happens if you invoke 'map.put(key, value)' with a key that is ALREADY present in the HashMap?",
            options: [
              { id: "A", text: "The existing value associated with that key is replaced with the new value", explanationIfWrong: "" },
              { id: "B", text: "A DuplicateKeyException is thrown", explanationIfWrong: "HashMaps overwrite values smoothly without throwing exceptions." },
              { id: "C", text: "The new value is silently rejected and ignored", explanationIfWrong: "The new value overwrites the old one." },
              { id: "D", text: "A second key with the same name is added", explanationIfWrong: "Keys in a HashMap must be strictly unique." }
            ],
            correctAnswer: "A",
            explanationNote: "HashMap keys are unique. Calling put() with an existing key updates its associated value."
          },
          {
            id: "j8-2-1-alt2",
            question: "What does 'map.get(key)' return if the specified key is NOT found in the map?",
            options: [
              { id: "A", text: "null", explanationIfWrong: "" },
              { id: "B", text: "An empty string \"\"", explanationIfWrong: "It returns null, not an empty string." },
              { id: "C", text: "0", explanationIfWrong: "It returns null for absent keys." },
              { id: "D", text: "NoSuchElementException", explanationIfWrong: "get() returns null instead of throwing an exception." }
            ],
            correctAnswer: "A",
            explanationNote: "If the requested key does not exist in the map, map.get(key) evaluates to null."
          }
        ]
      },
      {
        heading: "Safe Retrieval with getOrDefault() and containsKey()",
        text: "Because 'map.get(key)' returns null when a key is absent, attempting to auto-unbox the result to an 'int' (e.g. 'int count = map.get(\"apple\");') will trigger a NullPointerException if 'apple' is not in the map! Use 'map.containsKey(key)' or 'map.getOrDefault(key, defaultValue)' to guard against missing keys.",
        codeSnippet: "HashMap<String, Integer> inventory = new HashMap<>();\ninventory.put(\"apple\", 15);\n\n// SAFE with containsKey:\nif (inventory.containsKey(\"banana\")) {\n    System.out.println(inventory.get(\"banana\"));\n}\n\n// EVEN CLEANER with getOrDefault:\nint bananas = inventory.getOrDefault(\"banana\", 0); // Returns 0 instead of null!",
        terminalOutput: "banana count: 0 (default)\napple count: 15",
        tip: "Use getOrDefault(key, 0) when tallying frequency counts in text processing.",
        warning: "Never write 'int val = map.get(key);' without verifying the key exists first, or unboxing null will crash.",
        mcq: {
          id: "j8-2-2",
          question: "Why can 'int count = map.get(\"score\");' throw a NullPointerException if 'map' is a 'HashMap<String, Integer>'?",
          options: [
            { id: "A", text: "Because if \"score\" is missing, map.get returns null, and auto-unboxing null to primitive int throws NullPointerException", explanationIfWrong: "" },
            { id: "B", text: "Because HashMap cannot hold Strings", explanationIfWrong: "Strings are standard HashMap keys." },
            { id: "C", text: "Because primitive ints cannot hold numbers", explanationIfWrong: "ints hold 32-bit integers." },
            { id: "D", text: "Because get() requires double quotes", explanationIfWrong: "\"score\" is already in double quotes." }
          ],
          correctAnswer: "A",
          explanationNote: "The wrapper Integer is unboxed by calling .intValue(). If the returned Integer is null, calling .intValue() throws NPE."
        },
        questionPool: [
          {
            id: "j8-2-2-alt1",
            question: "What does 'inventory.getOrDefault(\"orange\", 5)' return if \"orange\" is NOT present in the map?",
            options: [
              { id: "A", text: "5", explanationIfWrong: "" },
              { id: "B", text: "0", explanationIfWrong: "5 was specified as the default parameter." },
              { id: "C", text: "null", explanationIfWrong: "getOrDefault returns the specified fallback, never null." },
              { id: "D", text: "-1", explanationIfWrong: "It returns the second argument (5)." }
            ],
            correctAnswer: "A",
            explanationNote: "getOrDefault(key, defaultVal) returns the mapped value if found, or defaultVal if absent."
          },
          {
            id: "j8-2-2-alt2",
            question: "What method checks if a specific key exists in a HashMap without retrieving it?",
            options: [
              { id: "A", text: "map.containsKey(key)", explanationIfWrong: "" },
              { id: "B", text: "map.hasKey(key)", explanationIfWrong: "hasKey does not exist in Java HashMap." },
              { id: "C", text: "map.exists(key)", explanationIfWrong: "exists does not exist." },
              { id: "D", text: "map.includes(key)", explanationIfWrong: "includes is JavaScript syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "containsKey(key) returns true if the map contains a mapping for the specified key."
          }
        ]
      },
      {
        heading: "Iterating Over HashMaps: keySet() and values()",
        text: "Unlike an ArrayList, a HashMap does not have sequential index numbers (0, 1, 2...). To iterate through a map, you use 'map.keySet()' to get a Set of all keys, or 'map.values()' to get a collection of all values. A for-each loop over 'keySet()' allows you to access both keys and their corresponding values.",
        codeSnippet: "HashMap<String, Integer> scores = new HashMap<>();\nscores.put(\"Alice\", 95);\nscores.put(\"Bob\", 82);\n\n// Iterate over all keys:\nfor (String name : scores.keySet()) {\n    int score = scores.get(name);\n    System.out.println(name + \": \" + score);\n}\n\n// Iterate over all values directly:\nfor (int score : scores.values()) {\n    System.out.println(\"Score: \" + score);\n}",
        terminalOutput: "Alice: 95\nBob: 82\nScore: 95\nScore: 82",
        tip: "A standard HashMap does NOT guarantee any specific ordering when iterating over keys!",
        warning: "Do not modify or remove items from a HashMap while iterating over it with a for-each loop, or ConcurrentModificationException will occur.",
        mcq: {
          id: "j8-2-3",
          question: "Does a standard HashMap guarantee that keys will be iterated in the exact order they were inserted?",
          options: [
            { id: "A", text: "No, standard HashMap does not guarantee any specific iteration order", explanationIfWrong: "" },
            { id: "B", text: "Yes, always alphabetical order", explanationIfWrong: "TreeMap provides sorted order, not HashMap." },
            { id: "C", text: "Yes, always exact insertion order", explanationIfWrong: "LinkedHashMap preserves insertion order, standard HashMap does not." },
            { id: "D", text: "Yes, always reverse order", explanationIfWrong: "Order is determined by bucket hash codes." }
          ],
          correctAnswer: "A",
          explanationNote: "Standard HashMap iteration order depends on internal hash bucket distribution and is not guaranteed."
        },
        questionPool: [
          {
            id: "j8-2-3-alt1",
            question: "Which Map implementation in Java guarantees insertion order iteration?",
            options: [
              { id: "A", text: "LinkedHashMap", explanationIfWrong: "" },
              { id: "B", text: "HashMap", explanationIfWrong: "HashMap does not guarantee order." },
              { id: "C", text: "Hashtable", explanationIfWrong: "Hashtable does not guarantee order." },
              { id: "D", text: "IdentityHashMap", explanationIfWrong: "IdentityHashMap does not preserve insertion order." }
            ],
            correctAnswer: "A",
            explanationNote: "LinkedHashMap maintains a doubly-linked list running through all of its entries, preserving insertion order."
          },
          {
            id: "j8-2-3-alt2",
            question: "What exception is thrown if you call map.remove(key) inside a standard for-each loop over map.keySet()?",
            options: [
              { id: "A", text: "ConcurrentModificationException", explanationIfWrong: "" },
              { id: "B", text: "ArrayIndexOutOfBoundsException", explanationIfWrong: "HashMaps do not use array indices directly in iteration." },
              { id: "C", text: "NullPointerException", explanationIfWrong: "The exception relates to collection structural modification." },
              { id: "D", text: "IllegalArgumentException", explanationIfWrong: "Concurrent modification triggers ConcurrentModificationException." }
            ],
            correctAnswer: "A",
            explanationNote: "Modifying a collection during for-each traversal invalidates the iterator, throwing ConcurrentModificationException."
          }
        ]
      },
      {
        heading: "Primitive Wrapper Types in Generics",
        text: "In Java, generic type parameters cannot be primitive types (int, double, char, boolean). You cannot write 'HashMap<String, int>'. Instead, you must use their object wrapper classes: 'Integer', 'Double', 'Character', 'Boolean'. Java automatically boxes and unboxes between primitives and wrappers.",
        codeSnippet: "// WRONG: Will not compile!\n// HashMap<String, int> badMap = new HashMap<>();\n\n// RIGHT: Using Wrapper Class Integer\nHashMap<String, Integer> validMap = new HashMap<>();\nvalidMap.put(\"points\", 100); // Autoboxing: int 100 -> Integer\nint p = validMap.get(\"points\"); // Auto-unboxing: Integer -> int p",
        terminalOutput: "Primitive wrappers:\nint -> Integer\ndouble -> Double\nchar -> Character\nboolean -> Boolean",
        tip: "Autoboxing happens automatically, making wrapper usage nearly seamless in everyday code.",
        warning: "Remember that wrapper types can be null! Auto-unboxing a null wrapper throws NullPointerException.",
        mcq: {
          id: "j8-2-4",
          question: "Which of the following HashMap declarations is syntactically valid in Java?",
          options: [
            { id: "A", text: "HashMap<String, Integer> map = new HashMap<>();", explanationIfWrong: "" },
            { id: "B", text: "HashMap<String, int> map = new HashMap<>();", explanationIfWrong: "Java generics do not accept primitive types like 'int'." },
            { id: "C", text: "HashMap<int, double> map = new HashMap<>();", explanationIfWrong: "Both keys and values must be object reference types." },
            { id: "D", text: "HashMap<char, String> map = new HashMap<>();", explanationIfWrong: "'char' is primitive; Character must be used." }
          ],
          correctAnswer: "A",
          explanationNote: "Java generics require reference types. The wrapper class Integer must be used instead of the primitive int."
        },
        questionPool: [
          {
            id: "j8-2-4-alt1",
            question: "What is the wrapper class for the primitive type 'double'?",
            options: [
              { id: "A", text: "Double", explanationIfWrong: "" },
              { id: "B", text: "Float", explanationIfWrong: "Float wraps 32-bit floats, Double wraps 64-bit doubles." },
              { id: "C", text: "Number", explanationIfWrong: "Number is the abstract superclass." },
              { id: "D", text: "Real", explanationIfWrong: "Real is not a Java type." }
            ],
            correctAnswer: "A",
            explanationNote: "java.lang.Double is the object wrapper for the primitive type double."
          },
          {
            id: "j8-2-4-alt2",
            question: "What is the process of converting a primitive value into its corresponding wrapper object called?",
            options: [
              { id: "A", text: "Autoboxing", explanationIfWrong: "" },
              { id: "B", text: "Typecasting", explanationIfWrong: "Typecasting is explicit cast syntax (e.g. (int) 3.14)." },
              { id: "C", text: "Polymorphism", explanationIfWrong: "Polymorphism is object subtype behavior." },
              { id: "D", text: "Serialization", explanationIfWrong: "Serialization converts objects to byte streams." }
            ],
            correctAnswer: "A",
            explanationNote: "The automatic conversion from primitive to wrapper (e.g. int to Integer) is called autoboxing."
          }
        ]
      },
      {
        heading: "Removing and Modifying HashMap Entries",
        text: "You can remove an entry from a HashMap using 'map.remove(key)'. This removes both the key and its mapped value and returns the value that was removed (or null if the key was not present). To update a value, simply call 'map.put(key, newValue)'.",
        codeSnippet: "HashMap<String, String> capitals = new HashMap<>();\ncapitals.put(\"Finland\", \"Helsinki\");\ncapitals.put(\"Sweden\", \"Stockholm\");\n\n// Update value:\ncapitals.put(\"Finland\", \"Helsinki City\");\n\n// Remove entry:\nString removed = capitals.remove(\"Sweden\"); // returns \"Stockholm\"\nSystem.out.println(capitals.containsKey(\"Sweden\")); // false",
        terminalOutput: "Removed: Stockholm\nRemaining keys: [Finland]",
        tip: "map.size() returns the total number of key-value pairs currently stored.",
        warning: "Calling capitals.remove(\"NonExistent\") returns null and does not throw an exception.",
        mcq: {
          id: "j8-2-5",
          question: "What does 'map.remove(key)' return when invoked on a HashMap?",
          options: [
            { id: "A", text: "The value previously associated with the key, or null if no mapping existed", explanationIfWrong: "" },
            { id: "B", text: "true or false", explanationIfWrong: "Set.remove returns a boolean, but Map.remove returns the removed value." },
            { id: "C", text: "The key that was removed", explanationIfWrong: "It returns the value, not the key." },
            { id: "D", text: "void", explanationIfWrong: "remove() has a non-void return type." }
          ],
          correctAnswer: "A",
          explanationNote: "Map.remove(key) returns the value that was mapped to the key, or null if the key was not present."
        },
        questionPool: [
          {
            id: "j8-2-5-alt1",
            question: "How do you completely clear all entries from a HashMap?",
            options: [
              { id: "A", text: "map.clear()", explanationIfWrong: "" },
              { id: "B", text: "map.removeAll()", explanationIfWrong: "removeAll is a Collection method, not a Map method." },
              { id: "C", text: "map.delete()", explanationIfWrong: "delete() does not exist in Map." },
              { id: "D", text: "map.reset()", explanationIfWrong: "reset() does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "map.clear() removes all key-value mappings from the map, resetting its size to 0."
          },
          {
            id: "j8-2-5-alt2",
            question: "How do you check if a HashMap contains zero entries?",
            options: [
              { id: "A", text: "map.isEmpty()", explanationIfWrong: "" },
              { id: "B", text: "map.empty()", explanationIfWrong: "The method name is isEmpty()." },
              { id: "C", text: "map.hasNone()", explanationIfWrong: "hasNone() does not exist." },
              { id: "D", text: "map.size == 0", explanationIfWrong: "size() is a method call in Java, not a property." }
            ],
            correctAnswer: "A",
            explanationNote: "map.isEmpty() returns true if the map contains no key-value mappings."
          }
        ]
      },
      {
        heading: "Searching & Text Normalization with HashMaps",
        text: "HashMaps are ideal for building fast dictionary lookup engines, abbreviation expanders, and translation tools. Because user input might vary in capitalization or contain leading/trailing spaces, keys should be normalized using '.trim().toLowerCase()' before inserting or querying.",
        codeSnippet: "public class SimpleDictionary {\n    private HashMap<String, String> translations = new HashMap<>();\n\n    public void add(String word, String translation) {\n        this.translations.put(clean(word), translation);\n    }\n\n    public String translate(String word) {\n        return this.translations.get(clean(word));\n    }\n\n    private String clean(String s) {\n        if (s == null) return \"\";\n        return s.trim().toLowerCase();\n    }\n}",
        terminalOutput: "add(\" Pike \", \"Hauki\")\ntranslate(\"pike\") -> \"Hauki\"\ntranslate(\"PIKE\") -> \"Hauki\"",
        tip: "Always sanitize and normalize user input keys so queries succeed regardless of user typing variance.",
        warning: "HashMaps are case-sensitive: 'Java' and 'java' are treated as two distinct keys unless normalized.",
        mcq: {
          id: "j8-2-6",
          question: "Why should keys be cleaned using '.trim().toLowerCase()' when building a dictionary with a HashMap?",
          options: [
            { id: "A", text: "Because HashMaps are strictly case-sensitive, so normalizing ensures 'Dog', 'dog', and ' dog ' all match the same key", explanationIfWrong: "" },
            { id: "B", text: "Because HashMaps crash if keys contain uppercase letters", explanationIfWrong: "HashMaps support uppercase letters without issue." },
            { id: "C", text: "Because spaces corrupt the JVM heap", explanationIfWrong: "Spaces are valid string characters." },
            { id: "D", text: "To make the keys sort alphabetically", explanationIfWrong: "Normalization affects matching, not sorting." }
          ],
          correctAnswer: "A",
          explanationNote: "HashMaps use exact String equality; normalizing ensures user variations in case and whitespace map to the same entry."
        },
        questionPool: [
          {
            id: "j8-2-6-alt1",
            question: "In a HashMap, will 'map.get(\"apple\")' retrieve the value stored under 'map.put(\"Apple\", 1)'?",
            options: [
              { id: "A", text: "No, it returns null because \"Apple\" and \"apple\" have different hash codes and characters", explanationIfWrong: "" },
              { id: "B", text: "Yes, HashMaps ignore casing automatically", explanationIfWrong: "Java strings and HashMaps are case-sensitive." },
              { id: "C", text: "It throws a MismatchedCaseException", explanationIfWrong: "No exception is thrown; null is returned." },
              { id: "D", text: "Yes, but only in Java 21", explanationIfWrong: "All Java versions treat them as different keys." }
            ],
            correctAnswer: "A",
            explanationNote: "String keys are case-sensitive; \"Apple\" and \"apple\" are different keys."
          },
          {
            id: "j8-2-6-alt2",
            question: "What does the method 's.trim()' do in Java?",
            options: [
              { id: "A", text: "Removes all leading and trailing whitespace characters from the string", explanationIfWrong: "" },
              { id: "B", text: "Deletes all spaces between words", explanationIfWrong: "Internal spaces between words are left untouched." },
              { id: "C", text: "Shortens the string to 10 characters", explanationIfWrong: "trim does not truncate text." },
              { id: "D", text: "Converts the string to lowercase", explanationIfWrong: "toLowerCase() converts case." }
            ],
            correctAnswer: "A",
            explanationNote: "trim() strips whitespace from the start and end of a string."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 8.3: Similarity of Objects (equals & hashCode)
  // -------------------------------------------------------------
  {
    id: "8-3-similarity",
    number: "8.3",
    title: "Similarity of Objects",
    subtitle: "Overriding equals(Object), the hashCode contract, bucket indexing, and using custom objects as HashMap keys.",
    readTime: "25 min",
    objectives: [
      "Understand why custom classes must override equals() and hashCode() to work correctly in HashMaps",
      "Implement the 4-step equals() pattern: reference check, null check, class/instanceof check, field comparison",
      "Master the hashCode contract: if two objects are equal according to equals(), their hashCodes MUST be equal",
      "Trace how HashMaps use hashCode() to select internal array buckets and equals() to resolve collisions",
      "Prevent object retrieval failures in HashMaps by ensuring hashCode consistency",
      "Generate clean hash codes using java.util.Objects.hash(...)"
    ],
    theoryBlocks: [
      {
        heading: "Why Custom Objects Need equals() and hashCode()",
        text: "When you use a custom object as a key in a 'HashMap<Book, String>' or check membership in a collection, Java uses the object's 'hashCode()' to locate its internal bucket and 'equals()' to confirm identity. If you do not override both methods, Java uses the default implementation from 'Object', which compares memory addresses, making two objects with identical fields appear different!",
        codeSnippet: "public class SimpleDate {\n    private int day;\n    private int month;\n    private int year;\n\n    public SimpleDate(int d, int m, int y) {\n        this.day = d; this.month = m; this.year = y;\n    }\n\n    // Without equals and hashCode:\n    // SimpleDate d1 = new SimpleDate(1, 2, 2026);\n    // SimpleDate d2 = new SimpleDate(1, 2, 2026);\n    // map.put(d1, \"Birthday\");\n    // map.get(d2) -> returns null! (FAIL)\n}",
        terminalOutput: "Default Object.equals: compares memory references (==)\nOverridden equals + hashCode: compares logical field values!",
        tip: "Whenever you override equals(), you MUST also override hashCode().",
        warning: "Failing to override hashCode() when equals() is overridden will break HashMaps and HashSets completely.",
        mcq: {
          id: "j8-3-1",
          question: "Why does 'map.get(new SimpleDate(1, 1, 2026))' return null even though an entry was added with 'map.put(new SimpleDate(1, 1, 2026), \"Holiday\")' if equals() and hashCode() were not overridden?",
          options: [
            { id: "A", text: "Because the default Object.hashCode() and Object.equals() compare memory addresses, treating the two separate instances as completely different keys", explanationIfWrong: "" },
            { id: "B", text: "Because HashMaps only support String keys", explanationIfWrong: "HashMaps support any object as a key." },
            { id: "C", text: "Because 2026 is an invalid year", explanationIfWrong: "Integer values do not restrict HashMap functionality." },
            { id: "D", text: "Because 'Holiday' is not a valid Java keyword", explanationIfWrong: "Values can be any object." }
          ],
          correctAnswer: "A",
          explanationNote: "Default Object methods compare references (==). Without custom equals and hashCode, new instances land in different buckets and fail equality."
        },
        questionPool: [
          {
            id: "j8-3-1-alt1",
            question: "What contract must hold between equals() and hashCode() in Java?",
            options: [
              { id: "A", text: "If two objects are equal according to equals(), their hashCode() methods MUST produce the same integer", explanationIfWrong: "" },
              { id: "B", text: "Objects with the same hashCode must always have different equals() results", explanationIfWrong: "Equal objects must have the same hash code." },
              { id: "C", text: "hashCode must always return a negative number", explanationIfWrong: "hashCodes can be any 32-bit signed integer." },
              { id: "D", text: "equals() must always return 0", explanationIfWrong: "equals() returns boolean." }
            ],
            correctAnswer: "A",
            explanationNote: "The hashCode contract requires that if obj1.equals(obj2) is true, obj1.hashCode() == obj2.hashCode()."
          },
          {
            id: "j8-3-1-alt2",
            question: "If two objects have the SAME hashCode(), are they guaranteed to be equal according to equals()?",
            options: [
              { id: "A", text: "No, two different objects may share the same hash code (known as a hash collision)", explanationIfWrong: "" },
              { id: "B", text: "Yes, hash codes are 100% unique across all objects", explanationIfWrong: "There are only 2^32 possible integer hash codes, so collisions are inevitable." },
              { id: "C", text: "Yes, otherwise Java throws a CollisionException", explanationIfWrong: "Collisions are normal and handled gracefully by HashMap bucket chains." },
              { id: "D", text: "Only for primitive integers", explanationIfWrong: "Collisions can occur in any type." }
            ],
            correctAnswer: "A",
            explanationNote: "Different objects can produce the same hash code; this is called a hash collision and is resolved via equals()."
          }
        ]
      },
      {
        heading: "The Standard 4-Step equals() Pattern",
        text: "To implement 'equals(Object compared)' properly according to the Java specification, follow these 4 steps:\n1. Reference check: 'if (this == compared) return true;'\n2. Null check: 'if (compared == null) return false;'\n3. Class check: 'if (getClass() != compared.getClass()) return false;'\n4. Field comparison: Cast to target type and compare fields.",
        codeSnippet: "@Override\npublic boolean equals(Object compared) {\n    // 1. Same memory address?\n    if (this == compared) return true;\n    // 2. Compared is null?\n    if (compared == null) return false;\n    // 3. Different classes?\n    if (this.getClass() != compared.getClass()) return false;\n    // 4. Compare relevant fields:\n    Book other = (Book) compared;\n    return this.year == other.year && this.name.equals(other.name);\n}",
        terminalOutput: "book1.equals(book2) -> true (same fields)\nbook1.equals(null) -> false (safe null handling)\nbook1.equals(\"other\") -> false (type safe)",
        tip: "Always ensure the parameter type is 'Object compared', NOT 'Book compared', or it will overload rather than override!",
        warning: "Writing 'public boolean equals(Book other)' is a subtle bug: it does NOT override Object.equals(Object)!",
        mcq: {
          id: "j8-3-2",
          question: "Why must the parameter type of the equals method be 'Object' (public boolean equals(Object compared)) instead of the class type?",
          options: [
            { id: "A", text: "Because Object.equals(Object) declares 'Object', and changing the parameter type overloads the method instead of overriding it", explanationIfWrong: "" },
            { id: "B", text: "Because Java does not allow class names in method parameters", explanationIfWrong: "Class names are used in parameters everywhere." },
            { id: "C", text: "Because Object uses less memory", explanationIfWrong: "Method signatures define polymorphism, not RAM size." },
            { id: "D", text: "Because the method would fail to compile", explanationIfWrong: "It compiles, but creates an overloaded method that Java collections ignore." }
          ],
          correctAnswer: "A",
          explanationNote: "Java collections call equals(Object). If you write equals(MyClass), the collection will invoke the default Object.equals(Object) instead!"
        },
        questionPool: [
          {
            id: "j8-3-2-alt1",
            question: "What happens in Step 1 of the equals pattern ('if (this == compared) return true;')?",
            options: [
              { id: "A", text: "It immediately returns true if both references point to the exact same object in memory, bypassing field checks", explanationIfWrong: "" },
              { id: "B", text: "It compares all integer fields", explanationIfWrong: "Step 1 is a fast reference identity shortcut." },
              { id: "C", text: "It throws a NullPointerException if compared is null", explanationIfWrong: "'this' is never null; if compared is null, this == null evaluates to false." },
              { id: "D", text: "It clones the compared object", explanationIfWrong: "No cloning occurs." }
            ],
            correctAnswer: "A",
            explanationNote: "Reference identity check (this == compared) is an instant O(1) shortcut: an object is always equal to itself."
          },
          {
            id: "j8-3-2-alt2",
            question: "Why is 'if (compared == null) return false;' required in the equals method?",
            options: [
              { id: "A", text: "The Java contract requires anyObject.equals(null) to return false without throwing a NullPointerException", explanationIfWrong: "" },
              { id: "B", text: "Because null equals null in Java", explanationIfWrong: "Calling a method on null crashes; an object compared to null is never equal." },
              { id: "C", text: "To convert null to an empty object", explanationIfWrong: "No object is created." },
              { id: "D", text: "To trigger garbage collection", explanationIfWrong: "GC is unrelated to equals logic." }
            ],
            correctAnswer: "A",
            explanationNote: "The equals contract states: for any non-null reference value x, x.equals(null) must return false."
          }
        ]
      },
      {
        heading: "Implementing hashCode() with Objects.hash()",
        text: "The 'hashCode()' method returns an integer hash value representing the object's contents. In Java 7+, the simplest and cleanest way to implement hashCode is using 'java.util.Objects.hash(...)', passing all the fields that are used in the 'equals()' method.",
        codeSnippet: "import java.util.Objects;\n\npublic class Book {\n    private String name;\n    private int publishingYear;\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(this.name, this.publishingYear);\n    }\n}",
        terminalOutput: "Book b1 = new Book(\"Java Guide\", 2024);\nBook b2 = new Book(\"Java Guide\", 2024);\nSystem.out.println(b1.hashCode() == b2.hashCode()); // true!",
        tip: "Any fields used to calculate equality in equals() should be included in Objects.hash(...).",
        warning: "Never include random numbers or memory addresses in hashCode(), or lookups will become non-deterministic.",
        mcq: {
          id: "j8-3-3",
          question: "How should you generate a consistent and well-distributed hashCode for an object with fields 'name' and 'year' in modern Java?",
          options: [
            { id: "A", text: "return Objects.hash(this.name, this.year);", explanationIfWrong: "" },
            { id: "B", text: "return new Random().nextInt();", explanationIfWrong: "Random hash codes violate the consistency contract: an object's hash code must remain constant." },
            { id: "C", text: "return this.name.length() * 1000;", explanationIfWrong: "Ignoring 'year' causes unnecessary collisions for books with same-length names." },
            { id: "D", text: "return System.currentTimeMillis();", explanationIfWrong: "Hash codes must not depend on current time." }
          ],
          correctAnswer: "A",
          explanationNote: "java.util.Objects.hash(...) combines field hash codes cleanly using prime multiplication algorithms."
        },
        questionPool: [
          {
            id: "j8-3-3-alt1",
            question: "What must happen if the fields of an object used in equals() do NOT change during program execution?",
            options: [
              { id: "A", text: "Repeated calls to hashCode() on that object must consistently return the same integer value", explanationIfWrong: "" },
              { id: "B", text: "hashCode() must double each time it is called", explanationIfWrong: "Hash codes must remain constant." },
              { id: "C", text: "hashCode() must return 0", explanationIfWrong: "It returns the computed integer hash." },
              { id: "D", text: "The object must be deleted from memory", explanationIfWrong: "Querying hashCode does not delete objects." }
            ],
            correctAnswer: "A",
            explanationNote: "The consistency requirement states: whenever hashCode is invoked on the same object, it must return the same value if state hasn't changed."
          },
          {
            id: "j8-3-3-alt2",
            question: "What happens if two unequal objects have the same hashCode?",
            options: [
              { id: "A", text: "They share the same hash bucket in a HashMap, and the HashMap uses equals() to differentiate them", explanationIfWrong: "" },
              { id: "B", text: "The second object overwrites the first one", explanationIfWrong: "HashMap stores both in the bucket chain." },
              { id: "C", text: "A DuplicateKeyException is thrown", explanationIfWrong: "Hash collisions are normal and handled automatically." },
              { id: "D", text: "The JVM crashes", explanationIfWrong: "Buckets use linked nodes or balanced trees for collisions." }
            ],
            correctAnswer: "A",
            explanationNote: "Hash collisions are resolved by storing multiple entries in the same bucket and using equals() to find the matching key."
          }
        ]
      },
      {
        heading: "How HashMaps Use Hash Codes Internally",
        text: "Internally, a HashMap contains an array of 'buckets'. When you call 'map.put(key, value)':\n1. It computes: 'int bucket = Math.abs(key.hashCode() % array.length);'\n2. It places the key-value pair in that bucket.\nWhen calling 'map.get(key)', it jumps directly to that bucket via hashCode in O(1) time and checks 'equals()' on items in that bucket.",
        codeSnippet: "// Conceptual HashMap internal lookup:\nint hash = key.hashCode();\nint bucketIndex = Math.abs(hash % buckets.length);\n\n// Jump directly to bucketIndex -> O(1)!\nfor (Entry entry : buckets[bucketIndex]) {\n    if (entry.key.equals(key)) {\n        return entry.value; // Found!\n    }\n}\nreturn null; // Not found",
        terminalOutput: "Key -> hashCode() -> bucket index (O(1)) -> equals() match",
        tip: "A good hashCode spreads objects uniformly across buckets to avoid long bucket chains.",
        warning: "If hashCode() always returns 1 for all objects, every item lands in the same bucket, degrading HashMap performance from O(1) to O(N)!",
        mcq: {
          id: "j8-3-4",
          question: "What happens to the performance of a HashMap if every custom object's hashCode() method simply returns 'return 1;'?",
          options: [
            { id: "A", text: "All entries land in the same bucket, degrading lookup performance from O(1) to O(N) linear time", explanationIfWrong: "" },
            { id: "B", text: "The HashMap runs 10x faster because hashing takes no time", explanationIfWrong: "All items form a long linear chain, making lookups slow." },
            { id: "C", text: "The HashMap throws an OutOfMemoryError immediately", explanationIfWrong: "It functions correctly, but runs very slowly." },
            { id: "D", text: "Only one entry can be stored in the entire map", explanationIfWrong: "Multiple entries are stored in the bucket's linked list or tree." }
          ],
          correctAnswer: "A",
          explanationNote: "Returning a constant hash code causes all entries to collide in bucket 1, forcing linear O(N) traversal."
        },
        questionPool: [
          {
            id: "j8-3-4-alt1",
            question: "How does Java 8+ optimize HashMap buckets that suffer from numerous hash collisions?",
            options: [
              { id: "A", text: "It transforms the bucket's linked list into a balanced red-black tree when the number of elements in a bucket exceeds 8", explanationIfWrong: "" },
              { id: "B", text: "It deletes the oldest elements automatically", explanationIfWrong: "HashMap does not discard data." },
              { id: "C", text: "It converts keys into integers", explanationIfWrong: "Keys remain the original objects." },
              { id: "D", text: "It forces garbage collection", explanationIfWrong: "Treeification is an internal data structure enhancement." }
            ],
            correctAnswer: "A",
            explanationNote: "When bucket size exceeds TREEIFY_THRESHOLD (8), HashMap replaces the linked list with a balanced tree, guaranteeing O(log N) worst-case lookup."
          },
          {
            id: "j8-3-4-alt2",
            question: "What is the primary factor determining which bucket an entry is placed into?",
            options: [
              { id: "A", text: "The hash code of the key", explanationIfWrong: "" },
              { id: "B", text: "The time of day", explanationIfWrong: "Placement is deterministic based on hash code." },
              { id: "C", text: "The length of the value object", explanationIfWrong: "Bucketing is based on the key, not the value." },
              { id: "D", text: "The number of CPU cores", explanationIfWrong: "Bucket indexing is mathematical: hash % array_size." }
            ],
            correctAnswer: "A",
            explanationNote: "The key's hashCode determines its bucket position in the underlying array."
          }
        ]
      },
      {
        heading: "Mutating Keys in a HashMap (Pitfall)",
        text: "If an object is used as a key in a HashMap and you subsequently mutate one of its fields that changes its hashCode, the key can no longer be found! The HashMap will calculate the new hashCode and search the wrong bucket, losing access to the entry.",
        codeSnippet: "SimpleDate date = new SimpleDate(1, 1, 2026);\nmap.put(date, \"New Year's Day\");\n\n// DANGEROUS MUTATION:\ndate.setYear(2030); // Hash code changes!\n\n// LOOKUP FAILS:\nSystem.out.println(map.get(date)); // returns null! Entry is lost in old bucket!",
        terminalOutput: "Mutating key fields breaks HashMap retrieval!\nmap.get(date) -> null",
        tip: "Always make objects used as HashMap keys IMMUTABLE (fields marked 'final' with no setter methods).",
        warning: "Never modify key objects after inserting them into a HashMap or HashSet.",
        mcq: {
          id: "j8-3-5",
          question: "Why should objects used as keys in a HashMap ideally be immutable?",
          options: [
            { id: "A", text: "Because if a key's fields are modified, its hashCode changes, making the HashMap look in the wrong bucket and fail to find the entry", explanationIfWrong: "" },
            { id: "B", text: "Because mutable objects cannot be passed as arguments in Java", explanationIfWrong: "Mutable objects can be passed anywhere in Java." },
            { id: "C", text: "Because immutable keys require zero memory", explanationIfWrong: "Immutable objects consume normal heap memory." },
            { id: "D", text: "Because Java prohibits setters in classes that override equals", explanationIfWrong: "Java does not prevent setters; it is a design best practice." }
          ],
          correctAnswer: "A",
          explanationNote: "If key state changes after insertion, its new hash code will point to a different bucket, making the entry unreachable."
        },
        questionPool: [
          {
            id: "j8-3-5-alt1",
            question: "Why is 'String' the most widely used and recommended key type in Java HashMaps?",
            options: [
              { id: "A", text: "String is completely immutable and its hashCode is cached for optimal performance", explanationIfWrong: "" },
              { id: "B", text: "Strings cannot be stored in ArrayLists", explanationIfWrong: "Strings can be stored in any collection." },
              { id: "C", text: "Strings take 1 byte of memory always", explanationIfWrong: "String memory depends on text length." },
              { id: "D", text: "Strings do not have hash codes", explanationIfWrong: "String implements a well-tested polynomial hashCode." }
            ],
            correctAnswer: "A",
            explanationNote: "Strings are immutable, thread-safe, and cache their hashCode, making them ideal HashMap keys."
          },
          {
            id: "j8-3-5-alt2",
            question: "How can you make a custom class immutable in Java?",
            options: [
              { id: "A", text: "Declare all fields 'private final' and do not provide any setter methods", explanationIfWrong: "" },
              { id: "B", text: "Declare all fields 'public static'", explanationIfWrong: "public static fields are mutable and shared globally." },
              { id: "C", text: "Implement the AutoCloseable interface", explanationIfWrong: "AutoCloseable is for try-with-resources." },
              { id: "D", text: "Extend Thread", explanationIfWrong: "Thread is for multithreading." }
            ],
            correctAnswer: "A",
            explanationNote: "Private final fields initialized only via constructors prevent post-creation modification, ensuring immutability."
          }
        ]
      },
      {
        heading: "HashSet and Set Uniqueness",
        text: "A 'HashSet<T>' is a collection that contains no duplicate elements. Internally, a HashSet is backed by a HashMap where the elements are stored as keys! Just like HashMap keys, objects stored in a HashSet MUST override both equals() and hashCode() to enforce uniqueness.",
        codeSnippet: "import java.util.HashSet;\n\nHashSet<Book> library = new HashSet<>();\nBook b1 = new Book(\"Clean Code\", 2008);\nBook b2 = new Book(\"Clean Code\", 2008);\n\nlibrary.add(b1);\nlibrary.add(b2); // Detected as duplicate! Not added!\n\nSystem.out.println(library.size()); // Prints 1!",
        terminalOutput: "HashSet enforces element uniqueness:\nAdded 2 identical books -> HashSet size is 1",
        tip: "Use HashSet when you need to track unique items (e.g. visited IDs, unique words) and ignore duplicates.",
        warning: "Without proper equals() and hashCode(), HashSet.add() will add duplicate objects.",
        mcq: {
          id: "j8-3-6",
          question: "What happens when you call 'set.add(item)' with an element that already exists in the HashSet according to equals() and hashCode()?",
          options: [
            { id: "A", text: "The set detects the duplicate and returns false without adding the item, leaving the set unchanged", explanationIfWrong: "" },
            { id: "B", text: "A DuplicateElementException is thrown", explanationIfWrong: "HashSet does not throw exceptions on duplicate additions; it returns false." },
            { id: "C", text: "Both elements are removed from the set", explanationIfWrong: "Existing elements remain in the set." },
            { id: "D", text: "The entire set is cleared", explanationIfWrong: "The set preserves all existing elements." }
          ],
          correctAnswer: "A",
          explanationNote: "Set.add() returns false if the element is already present, guaranteeing that Sets contain only unique items."
        },
        questionPool: [
          {
            id: "j8-3-6-alt1",
            question: "What is the average time complexity of checking 'set.contains(item)' in a HashSet?",
            options: [
              { id: "A", text: "O(1) constant time", explanationIfWrong: "" },
              { id: "B", text: "O(N) linear time", explanationIfWrong: "ArrayList.contains is O(N), but HashSet.contains is O(1)." },
              { id: "C", text: "O(N^2)", explanationIfWrong: "Hash sets provide constant time lookups." },
              { id: "D", text: "O(log N)", explanationIfWrong: "TreeSet is O(log N), HashSet is O(1)." }
            ],
            correctAnswer: "A",
            explanationNote: "HashSet is backed by a HashMap and checks membership in average O(1) constant time."
          },
          {
            id: "j8-3-6-alt2",
            question: "How does HashSet differentiate between two objects when inserting?",
            options: [
              { id: "A", text: "It checks hashCode() to locate the bucket and equals() to verify identity", explanationIfWrong: "" },
              { id: "B", text: "It compares their memory addresses exclusively", explanationIfWrong: "It uses equals(), not just memory addresses." },
              { id: "C", text: "It sorts the set alphabetically", explanationIfWrong: "HashSet does not maintain sorted order." },
              { id: "D", text: "It checks toString() outputs", explanationIfWrong: "toString() is not used for set uniqueness." }
            ],
            correctAnswer: "A",
            explanationNote: "HashSet relies on hashCode() for bucket selection and equals() for exact duplicate detection."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 8.4: Grouping Data Using HashMaps
  // -------------------------------------------------------------
  {
    id: "8-4-grouping",
    number: "8.4",
    title: "Grouping Data Using HashMaps",
    subtitle: "One-to-many associations, HashMap<K, ArrayList<V>>, phone books, and multi-value dictionaries.",
    readTime: "25 min",
    objectives: [
      "Model one-to-many relationships using HashMap<Key, ArrayList<Value>>",
      "Safely add values to a grouped list, instantiating a new ArrayList if the key is absent",
      "Use computeIfAbsent() for concise, clean group insertion in modern Java",
      "Build real-world multi-value systems (Dictionary with multiple translations, PhoneBook with multiple numbers)",
      "Iterate over grouped mappings and print formatted multi-line records",
      "Avoid NullPointerExceptions when looking up absent keys in grouped collections"
    ],
    theoryBlocks: [
      {
        heading: "One-to-Many Mappings: HashMap<K, ArrayList<V>>",
        text: "In many real-world scenarios, a single key must be associated with multiple values. For example, a person can have multiple phone numbers, or a word can have multiple translations. To represent this, the value type of the HashMap is an 'ArrayList<V>': 'HashMap<String, ArrayList<String>>'.",
        codeSnippet: "import java.util.HashMap;\nimport java.util.ArrayList;\n\nHashMap<String, ArrayList<String>> phoneNumbers = new HashMap<>();\n\n// Traditional 2-step add:\npublic void addNumber(String name, String number) {\n    if (!this.phoneNumbers.containsKey(name)) {\n        this.phoneNumbers.put(name, new ArrayList<>());\n    }\n    this.phoneNumbers.get(name).add(number);\n}",
        terminalOutput: "Add: Alice -> 555-1234\nAdd: Alice -> 555-5678\nLookup Alice: [555-1234, 555-5678]",
        tip: "Always check if the key exists and create the empty ArrayList if missing before attempting to .add() the item.",
        warning: "Never call 'phoneNumbers.get(name).add(number)' without creating the list first, or it will throw a NullPointerException!",
        mcq: {
          id: "j8-4-1",
          question: "What is the recommended data structure for representing a PhoneBook where each person's name can have multiple phone numbers?",
          options: [
            { id: "A", text: "HashMap<String, ArrayList<String>>", explanationIfWrong: "" },
            { id: "B", text: "HashMap<String, String>", explanationIfWrong: "HashMap<String, String> can only store one single number per person." },
            { id: "C", text: "ArrayList<String>", explanationIfWrong: "A simple list cannot associate names with numbers directly in O(1)." },
            { id: "D", text: "String[]", explanationIfWrong: "A raw array lacks dynamic associative mapping." }
          ],
          correctAnswer: "A",
          explanationNote: "Mapping a String key (name) to an ArrayList<String> allows an unlimited number of phone numbers per person."
        },
        questionPool: [
          {
            id: "j8-4-1-alt1",
            question: "What happens if you execute 'map.get(\"Dave\").add(\"555-9999\");' when \"Dave\" is NOT yet in the map?",
            options: [
              { id: "A", text: "A NullPointerException is thrown because map.get(\"Dave\") evaluates to null", explanationIfWrong: "" },
              { id: "B", text: "Java creates an empty list for Dave automatically", explanationIfWrong: "Java does not automatically instantiate lists for missing keys." },
              { id: "C", text: "The number is discarded", explanationIfWrong: "Dereferencing null causes an immediate runtime exception." },
              { id: "D", text: "The number becomes the key", explanationIfWrong: "Keys and values are not swapped." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling .add() on null throws NullPointerException. You must check and initialize the list first."
          },
          {
            id: "j8-4-1-alt2",
            question: "How do you check if a person 'name' has any phone numbers in the PhoneBook?",
            options: [
              { id: "A", text: "phoneNumbers.containsKey(name) && !phoneNumbers.get(name).isEmpty()", explanationIfWrong: "" },
              { id: "B", text: "phoneNumbers.contains(name)", explanationIfWrong: "contains() does not exist on Map; use containsKey()." },
              { id: "C", text: "phoneNumbers.get(name) == 0", explanationIfWrong: "get() returns an ArrayList, not an integer." },
              { id: "D", text: "phoneNumbers.hasNumbers(name)", explanationIfWrong: "hasNumbers is not a Map method." }
            ],
            correctAnswer: "A",
            explanationNote: "Verifying the key exists and the associated list is non-empty accurately checks for phone numbers."
          }
        ]
      },
      {
        heading: "Modern Grouping with computeIfAbsent()",
        text: "In Java 8+, the traditional 'if (!map.containsKey(key)) map.put(key, new ArrayList<>());' boilerplate can be written in a single clean statement using 'map.computeIfAbsent()'. If the key is not present, it creates and stores a new ArrayList, then returns it for immediate chained addition!",
        codeSnippet: "// Modern 1-line grouping insertion:\npublic void addNumber(String name, String number) {\n    this.phoneNumbers\n        .computeIfAbsent(name, k -> new ArrayList<>())\n        .add(number);\n}",
        terminalOutput: "computeIfAbsent eliminates boilerplate:\n1 line replaces 4 lines of if-checks!",
        tip: "'k -> new ArrayList<>()' is a lambda expression that is ONLY executed if the key is absent.",
        warning: "If the key already exists, computeIfAbsent returns the existing list without executing the lambda.",
        mcq: {
          id: "j8-4-2",
          question: "What does 'map.computeIfAbsent(key, k -> new ArrayList<>())' do if the key is ALREADY present in the map?",
          options: [
            { id: "A", text: "It immediately returns the existing ArrayList associated with that key without executing the lambda", explanationIfWrong: "" },
            { id: "B", text: "It wipes the existing list and replaces it with a blank one", explanationIfWrong: "Existing data is preserved; it only computes if ABSENT." },
            { id: "C", text: "It throws a DuplicateKeyException", explanationIfWrong: "computeIfAbsent handles existing keys gracefully." },
            { id: "D", text: "It returns null", explanationIfWrong: "It returns the existing list." }
          ],
          correctAnswer: "A",
          explanationNote: "computeIfAbsent only computes the value if the key is absent; otherwise, it returns the existing mapping."
        },
        questionPool: [
          {
            id: "j8-4-2-alt1",
            question: "What is 'k -> new ArrayList<>()' in the computeIfAbsent method?",
            options: [
              { id: "A", text: "A lambda mapping function (java.util.function.Function) that creates the default value when the key is absent", explanationIfWrong: "" },
              { id: "B", text: "A ternary operator shortcut", explanationIfWrong: "It is a lambda expression." },
              { id: "C", text: "A compiler directive", explanationIfWrong: "It is standard Java lambda syntax." },
              { id: "D", text: "A recursive loop", explanationIfWrong: "No recursion occurs." }
            ],
            correctAnswer: "A",
            explanationNote: "It is a functional lambda that receives the key 'k' and returns a newly instantiated ArrayList."
          },
          {
            id: "j8-4-2-alt2",
            question: "Can computeIfAbsent be used to initialize other collections like HashSets?",
            options: [
              { id: "A", text: "Yes: map.computeIfAbsent(key, k -> new HashSet<>())", explanationIfWrong: "" },
              { id: "B", text: "No, it only works with ArrayLists", explanationIfWrong: "It works with any value type." },
              { id: "C", text: "Only in Java 25", explanationIfWrong: "Available since Java 8." },
              { id: "D", text: "No, Sets cannot be values in Maps", explanationIfWrong: "Any object can be a value in a Map." }
            ],
            correctAnswer: "A",
            explanationNote: "computeIfAbsent works with any object creation lambda (HashSets, LinkedLists, custom objects)."
          }
        ]
      },
      {
        heading: "Multi-Value Dictionary (Synonyms / Translations)",
        text: "Consider a dictionary where one word can have multiple translations or synonyms. Using a grouped HashMap, we can look up all translations for a word, print them, or return an empty list if the word has not been added yet.",
        codeSnippet: "public class Dictionary {\n    private HashMap<String, ArrayList<String>> words = new HashMap<>();\n\n    public void add(String word, String translation) {\n        this.words.computeIfAbsent(word, k -> new ArrayList<>()).add(translation);\n    }\n\n    public ArrayList<String> translate(String word) {\n        return this.words.getOrDefault(word, new ArrayList<>());\n    }\n}",
        terminalOutput: "dict.add(\"piiri\", \"circuit\");\ndict.add(\"piiri\", \"circle\");\ndict.translate(\"piiri\") -> [\"circuit\", \"circle\"]\ndict.translate(\"unknown\") -> [] (empty list)",
        tip: "Returning 'new ArrayList<>()' instead of 'null' for absent words prevents NullPointerExceptions in client code.",
        warning: "Do not return null when returning collections; prefer returning empty collections.",
        mcq: {
          id: "j8-4-3",
          question: "Why is 'return this.words.getOrDefault(word, new ArrayList<>());' better than 'return this.words.get(word);' in a Dictionary class?",
          options: [
            { id: "A", text: "It returns an empty list instead of null if the word is absent, preventing NullPointerExceptions when callers loop over the results", explanationIfWrong: "" },
            { id: "B", text: "It speeds up disk access", explanationIfWrong: "In-memory collection operations do not involve disk." },
            { id: "C", text: "It translates the word automatically via Google Translate", explanationIfWrong: "It is an internal Java dictionary data structure." },
            { id: "D", text: "Because Java does not allow returning null from methods", explanationIfWrong: "Java allows returning null, but it causes NullPointerExceptions." }
          ],
          correctAnswer: "A",
          explanationNote: "Returning an empty collection instead of null is a best practice that avoids NPEs in calling loops."
        },
        questionPool: [
          {
            id: "j8-4-3-alt1",
            question: "How can callers iterate over the translations returned by 'dict.translate(word)' safely?",
            options: [
              { id: "A", text: "for (String tr : dict.translate(word)) { System.out.println(tr); }", explanationIfWrong: "" },
              { id: "B", text: "dict.translate(word).iterate()", explanationIfWrong: "iterate() is not an ArrayList method." },
              { id: "C", text: "while (dict.hasNext())", explanationIfWrong: "Dictionary is not an Iterator." },
              { id: "D", text: "Only with traditional array indexing", explanationIfWrong: "For-each loops work on any Iterable collection." }
            ],
            correctAnswer: "A",
            explanationNote: "Because translate() returns a non-null ArrayList, a simple for-each loop runs smoothly without throwing NPEs."
          },
          {
            id: "j8-4-3-alt2",
            question: "What helper method from java.util.Collections returns an empty immutable list?",
            options: [
              { id: "A", text: "Collections.emptyList()", explanationIfWrong: "" },
              { id: "B", text: "Collections.nullList()", explanationIfWrong: "nullList does not exist." },
              { id: "C", text: "Collections.zero()", explanationIfWrong: "zero does not exist." },
              { id: "D", text: "Collections.blank()", explanationIfWrong: "blank does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "Collections.emptyList() returns a shared, zero-allocation immutable empty list."
          }
        ]
      },
      {
        heading: "Iterating and Printing Grouped Records",
        text: "When printing grouped records (e.g. all people and their list of phone numbers), you iterate over 'map.keySet()', print the key header, and then run a nested loop over the 'ArrayList<V>' for that key to print each associated item.",
        codeSnippet: "public void printAll() {\n    for (String name : this.phoneNumbers.keySet()) {\n        System.out.println(name + \":\");\n        ArrayList<String> numbers = this.phoneNumbers.get(name);\n        for (String num : numbers) {\n            System.out.println(\"  \" + num);\n        }\n    }\n}",
        terminalOutput: "Alice:\n  555-1234\n  555-5678\nBob:\n  555-9012",
        tip: "Indenting grouped items with two spaces ('  ') makes console outputs visually clean and readable.",
        warning: "If a key's list is empty, the outer loop will print the name, and the inner loop will simply execute 0 times.",
        mcq: {
          id: "j8-4-4",
          question: "How do you display all grouped phone numbers for each person in a PhoneBook?",
          options: [
            { id: "A", text: "Loop through map.keySet() for each person, then use a nested loop over that person's ArrayList of numbers to print each number", explanationIfWrong: "" },
            { id: "B", text: "Print map.toString() on a single line", explanationIfWrong: "Printing map.toString() formats unreadable curly braces and brackets." },
            { id: "C", text: "Use Arrays.sort() on the map directly", explanationIfWrong: "Arrays.sort() cannot be called on Maps." },
            { id: "D", text: "Convert the map to an integer array", explanationIfWrong: "Maps contain names and numbers, not simple integer sequences." }
          ],
          correctAnswer: "A",
          explanationNote: "An outer loop iterates through people (keys), and an inner loop prints each phone number (values list)."
        },
        questionPool: [
          {
            id: "j8-4-4-alt1",
            question: "How do you print the total count of numbers associated with a person 'name'?",
            options: [
              { id: "A", text: "phoneNumbers.getOrDefault(name, new ArrayList<>()).size()", explanationIfWrong: "" },
              { id: "B", text: "phoneNumbers.length(name)", explanationIfWrong: "length() is not a Map method." },
              { id: "C", text: "phoneNumbers.count(name)", explanationIfWrong: "count() is not a Map method." },
              { id: "D", text: "phoneNumbers.get(name).length", explanationIfWrong: "ArrayLists use size(), not length." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling .size() on the retrieved (or empty) list gives the count safely without NPE risks."
          },
          {
            id: "j8-4-4-alt2",
            question: "How can you remove one specific phone number for a person without deleting the person completely?",
            options: [
              { id: "A", text: "if (phoneNumbers.containsKey(name)) { phoneNumbers.get(name).remove(number); }", explanationIfWrong: "" },
              { id: "B", text: "phoneNumbers.remove(name)", explanationIfWrong: "That deletes the entire person and all their numbers." },
              { id: "C", text: "phoneNumbers.delete(number)", explanationIfWrong: "delete() does not exist on Map." },
              { id: "D", text: "phoneNumbers.clear()", explanationIfWrong: "clear() wipes the entire database." }
            ],
            correctAnswer: "A",
            explanationNote: "Retrieving the person's ArrayList and calling .remove(number) on the list removes only that specific number."
          }
        ]
      },
      {
        heading: "Reverse Lookup: Finding Keys by Value",
        text: "A HashMap is optimized for looking up values by key in O(1) time. However, finding which person owns a given phone number (reverse lookup) requires iterating through every key in 'keySet()' and checking if its associated 'ArrayList<String>' contains the number. This is an O(N * M) linear scan.",
        codeSnippet: "public String getOwner(String number) {\n    for (String name : this.phoneNumbers.keySet()) {\n        ArrayList<String> numbers = this.phoneNumbers.get(name);\n        if (numbers.contains(number)) {\n            return name; // Found owner!\n        }\n    }\n    return \"not found\";\n}",
        terminalOutput: "getOwner(\"555-5678\") -> \"Alice\"\ngetOwner(\"555-0000\") -> \"not found\"",
        tip: "If reverse lookups occur frequently, maintain a second reverse map: 'HashMap<String, String> numberToOwner'.",
        warning: "Reverse searches through HashMaps require checking every entry, which is O(N) instead of O(1).",
        mcq: {
          id: "j8-4-5",
          question: "Why does finding the owner of a phone number in a 'HashMap<String, ArrayList<String>>' take O(N) linear time instead of O(1) constant time?",
          options: [
            { id: "A", text: "Because HashMaps only index by key, so searching by value requires scanning every entry in the map", explanationIfWrong: "" },
            { id: "B", text: "Because phone numbers are Strings instead of integers", explanationIfWrong: "Key hashing allows O(1) lookup regardless of data type." },
            { id: "C", text: "Because ArrayLists cannot be searched", explanationIfWrong: "ArrayList.contains() performs the search, but in O(M) time." },
            { id: "D", text: "Because Java requires a license for reverse lookups", explanationIfWrong: "It is a computer science data structure property." }
          ],
          correctAnswer: "A",
          explanationNote: "HashMaps are one-way indexes: fast O(1) by key, but finding keys by value requires a full O(N) scan."
        },
        questionPool: [
          {
            id: "j8-4-5-alt1",
            question: "How can you achieve O(1) lookup in both directions (name -> numbers AND number -> name)?",
            options: [
              { id: "A", text: "Maintain two synchronized HashMaps: one for name-to-numbers and a second for number-to-name (bidirectional mapping)", explanationIfWrong: "" },
              { id: "B", text: "Sort the HashMap with Arrays.sort()", explanationIfWrong: "HashMaps cannot be sorted with Arrays.sort." },
              { id: "C", text: "Use a single 1D array", explanationIfWrong: "1D arrays take O(N) search time." },
              { id: "D", text: "Call map.reverse()", explanationIfWrong: "reverse() does not exist in Map." }
            ],
            correctAnswer: "A",
            explanationNote: "Bi-directional mapping using two coordinated HashMaps provides O(1) lookups in both directions."
          },
          {
            id: "j8-4-5-alt2",
            question: "What does getOwner() return if the number does not belong to any registered user?",
            options: [
              { id: "A", text: "\"not found\" (or null)", explanationIfWrong: "" },
              { id: "B", text: "An ArrayIndexOutOfBoundsException", explanationIfWrong: "It finishes the loop and returns the default fallback." },
              { id: "C", text: "The first person in the database", explanationIfWrong: "It should report not found." },
              { id: "D", text: "The phone company's name", explanationIfWrong: "It only searches the local database." }
            ],
            correctAnswer: "A",
            explanationNote: "When no match is found after scanning all entries, the method returns the designated fallback string or null."
          }
        ]
      },
      {
        heading: "Filtering and Aggregating Across Grouped Collections",
        text: "Grouped HashMaps allow aggregating metrics across sub-collections, such as finding which student has the highest average grade or counting total books across all categories. By combining Map iteration with sub-collection traversal, complex analytical queries can be answered cleanly.",
        codeSnippet: "public class GradeBook {\n    private HashMap<String, ArrayList<Integer>> grades = new HashMap<>();\n\n    public double getAverage(String student) {\n        ArrayList<Integer> list = this.grades.get(student);\n        if (list == null || list.isEmpty()) return 0.0;\n        int sum = 0;\n        for (int g : list) sum += g;\n        return (double) sum / list.size();\n    }\n}",
        terminalOutput: "Alice: [90, 95, 100] -> Average: 95.0\nBob: [80, 85] -> Average: 82.5",
        tip: "Always guard against division by zero by checking 'if (list.isEmpty()) return 0.0;'.",
        warning: "Casting to (double) sum before dividing ensures floating-point precision.",
        mcq: {
          id: "j8-4-6",
          question: "In the GradeBook getAverage method, why is '(double) sum / list.size()' used instead of 'sum / list.size()'?",
          options: [
            { id: "A", text: "To prevent integer division truncation, ensuring a precise floating-point average (e.g. 82.5 instead of 82)", explanationIfWrong: "" },
            { id: "B", text: "Because list.size() returns a double", explanationIfWrong: "size() returns an int." },
            { id: "C", text: "Because sum is a String", explanationIfWrong: "sum is an int accumulator." },
            { id: "D", text: "To avoid NullPointerException", explanationIfWrong: "Casting avoids integer division truncation, not null pointers." }
          ],
          correctAnswer: "A",
          explanationNote: "Dividing two ints truncates decimal remainders; casting to double promotes the operation to floating-point division."
        },
        questionPool: [
          {
            id: "j8-4-6-alt1",
            question: "How do you count the total number of grades recorded across ALL students in the GradeBook?",
            options: [
              { id: "A", text: "int total = 0; for (ArrayList<Integer> list : grades.values()) { total += list.size(); }", explanationIfWrong: "" },
              { id: "B", text: "grades.size()", explanationIfWrong: "grades.size() gives the number of students (keys), not total grades." },
              { id: "C", text: "grades.values().length", explanationIfWrong: "Collection has size(), not length." },
              { id: "D", text: "grades.sum()", explanationIfWrong: "sum() does not exist on Map." }
            ],
            correctAnswer: "A",
            explanationNote: "Iterating through all values (lists) and summing their sizes computes the grand total of grades across all students."
          },
          {
            id: "j8-4-6-alt2",
            question: "What should getAverage() return if a student exists in the map but has zero grades in their list?",
            options: [
              { id: "A", text: "0.0, avoiding division by zero (0 / 0)", explanationIfWrong: "" },
              { id: "B", text: "Double.POSITIVE_INFINITY", explanationIfWrong: "Returning 0.0 is the domain standard for empty grade records." },
              { id: "C", text: "A fatal ArithmeticException", explanationIfWrong: "Integer division by zero throws ArithmeticException, which must be guarded against." },
              { id: "D", text: "-100.0", explanationIfWrong: "0.0 is the standard zero average." }
            ],
            correctAnswer: "A",
            explanationNote: "Checking list.isEmpty() and returning 0.0 prevents dividing by zero."
          }
        ]
      }
    ]
  }
];

// Helper functions for Level Failure, Question Pool Rotation, and Attempt Tracking

export function getActiveQuestionsForLevelPart8(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part8_seen_${studentId}_${section.id}`;
  let seenIds: string[] = [];
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(seenKey) : null;
    if (raw) seenIds = JSON.parse(raw);
  } catch {}

  const activeQuestions: McqQuestion[] = [];

  section.theoryBlocks.forEach((block) => {
    const pool = [block.mcq, ...(block.questionPool || []), block.retestMcq].filter(Boolean) as McqQuestion[];
    if (pool.length === 0) return;

    if (forceShuffle) {
      const unseen = pool.filter(q => q.id && !seenIds.includes(q.id));
      if (unseen.length > 0) {
        const picked = unseen[Math.floor(Math.random() * unseen.length)];
        activeQuestions.push(picked);
        if (picked.id) seenIds.push(picked.id);
      } else {
        // Alternative question or pool[1] if available, otherwise pool[0]
        const alt = pool.length > 1 ? pool[1] : pool[0];
        activeQuestions.push(alt);
      }
    } else {
      activeQuestions.push(pool[0]);
      if (pool[0].id && !seenIds.includes(pool[0].id)) {
        seenIds.push(pool[0].id);
      }
    }
  });

  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(seenKey, JSON.stringify(seenIds));
    }
  } catch {}

  return activeQuestions;
}

export function getConsecutiveFailedLevelsPart8(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part8_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart8(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part8_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart8(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part8_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart8(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part8_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart8 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart8(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart8 {
  const attemptKey = `dopilot_java_part8_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part8_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part8_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart8(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart8(studentId);
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(attemptKey);
      }
    } catch {}
    return {
      consecutiveFailedLevels: 0,
      attemptCount: attempts,
      isSecondFailureInLevel: false,
      isLocked: false
    };
  } else {
    const isSecondFailure = attempts >= 2;
    if (isSecondFailure) {
      streak += 1;
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem(streakKey, String(streak));
        }
      } catch {}
    }

    const isLocked = streak >= 3;
    if (isLocked) {
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem(lockKey, 'true');
        }
      } catch {}
    }

    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(attemptKey, String(attempts + 1));
      }
    } catch {}

    return {
      consecutiveFailedLevels: streak,
      attemptCount: attempts,
      isSecondFailureInLevel: isSecondFailure,
      isLocked
    };
  }
}
