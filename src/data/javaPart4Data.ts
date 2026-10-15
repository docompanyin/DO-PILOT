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
    id: "4-1-oop-basics",
    number: "4.1",
    title: "Introduction to Object-Oriented Programming",
    subtitle: "Understand classes, objects, state, behavior, private instance variables, constructors, this keyword, and toString().",
    readTime: "25 min",
    objectives: [
      "Distinguish between a class (blueprint) and an object (instance)",
      "Declare instance variables with private visibility to enforce encapsulation",
      "Write class constructors to initialize object state with parameters and the this keyword",
      "Implement instance methods to modify state and return computed values",
      "Override toString() to provide clear textual representation of objects",
      "Overload constructors to allow multiple initialization techniques"
    ],
    theoryBlocks: [
      {
        heading: "Classes and Objects: Blueprints vs Instances",
        text: "In Java, an object is a bundle of state (data) and behavior (methods). A class defines the blueprint or template for creating objects. You create an instance of a class using the 'new' keyword, which allocates memory on the heap and executes the class constructor.",
        codeSnippet: "public class Person {\n    // Class blueprint for representing individuals\n}\n\n// Instantiation in Main:\nPerson ada = new Person();\nPerson alan = new Person();",
        terminalOutput: "// Two distinct Person instances exist in memory",
        tip: "A class is like an architectural blueprint for a house; objects are the actual houses built from that blueprint.",
        warning: "Declaring 'Person ada;' only creates a reference variable that initially holds null until assigned with 'new Person()'.",
        mcq: {
          id: "j4-1-1",
          question: "What is the relationship between a class and an object in Java?",
          options: [
            { id: "A", text: "A class is the blueprint/template, while an object is a concrete instance created from that class in memory", explanationIfWrong: "" },
            { id: "B", text: "An object is the source code file, while a class is created only when executing byte-code", explanationIfWrong: "Source files contain class definitions; objects are runtime instances." },
            { id: "C", text: "They are completely identical and interchangeable terms in Java", explanationIfWrong: "A class defines structure; an object is an instantiated memory entity." },
            { id: "D", text: "A class can only create a single object during the lifetime of a program", explanationIfWrong: "A class can instantiate an unlimited number of objects." }
          ],
          correctAnswer: "A",
          explanationNote: "A class defines instance variables and methods as a template. Objects are individual runtime instances instantiated with 'new'."
        },
        questionPool: [
          {
            id: "j4-1-1-alt1",
            question: "What keyword is used in Java to instantiate a new object from a class blueprint?",
            options: [
              { id: "A", text: "new", explanationIfWrong: "" },
              { id: "B", text: "create", explanationIfWrong: "'create' is not a Java keyword." },
              { id: "C", text: "instanceof", explanationIfWrong: "'instanceof' checks object types, it does not instantiate them." },
              { id: "D", text: "allocate", explanationIfWrong: "'allocate' is not a keyword in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "The 'new' keyword creates a new instance of a class and invokes its constructor."
          },
          {
            id: "j4-1-1-alt2",
            question: "Where are object instances stored in Java memory when created with 'new'?",
            options: [
              { id: "A", text: "On the Heap memory", explanationIfWrong: "" },
              { id: "B", text: "In the CPU instruction cache only", explanationIfWrong: "Objects reside in RAM on the JVM heap." },
              { id: "C", text: "On the Call Stack", explanationIfWrong: "Reference variables live on the stack; the actual object instances live on the heap." },
              { id: "D", text: "Directly in hard disk swap space", explanationIfWrong: "The JVM manages heap memory in RAM." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, all objects instantiated with 'new' live on the Heap, while local reference variables live on the Stack."
          }
        ]
      },
      {
        heading: "Instance Variables and Encapsulation",
        text: "Instance variables (fields) store the internal state of each individual object. In good object-oriented practice, instance variables are declared with 'private' access. This encapsulates the internal data so external code cannot corrupt or alter it without passing through controlled methods.",
        codeSnippet: "public class Person {\n    private String name;\n    private int age;\n\n    public Person(String initialName) {\n        this.name = initialName;\n        this.age = 0;\n    }\n}",
        terminalOutput: "// 'name' and 'age' cannot be accessed directly via person.age = -5 from outside",
        tip: "Always default instance variables to 'private' unless you have a specific, documented architectural need otherwise.",
        warning: "If an instance variable is public, any class in the project can set invalid values (such as negative ages or null names) directly.",
        mcq: {
          id: "j4-1-2",
          question: "Why should instance variables in a class typically be declared as 'private'?",
          options: [
            { id: "A", text: "To enforce encapsulation and prevent external code from directly modifying internal state without validation", explanationIfWrong: "" },
            { id: "B", text: "Because Java will not compile any class with public or package-private variables", explanationIfWrong: "Java compiles public variables, but it violates encapsulation design principles." },
            { id: "C", text: "To make the variables run 50% faster in the CPU cache", explanationIfWrong: "Access modifiers govern visibility, not CPU cache caching speed." },
            { id: "D", text: "To allow primitive types to be automatically converted to String", explanationIfWrong: "Access modifiers do not alter data types or type conversions." }
          ],
          correctAnswer: "A",
          explanationNote: "Encapsulation hides internal implementation details. Making fields private ensures external code cannot tamper with internal data directly."
        },
        questionPool: [
          {
            id: "j4-1-2-alt1",
            question: "What happens if code in another class tries to execute 'p.age = 25;' when 'age' is defined as 'private int age;'?",
            options: [
              { id: "A", text: "A compilation error occurs ('age has private access in Person')", explanationIfWrong: "" },
              { id: "B", text: "The code runs normally but prints a runtime warning to standard error", explanationIfWrong: "Access violations in Java are compile-time errors, not runtime warnings." },
              { id: "C", text: "The variable is set but marked as unverified", explanationIfWrong: "Java's compiler strictly rejects access to private members from outside." },
              { id: "D", text: "A NullPointerException is thrown", explanationIfWrong: "NullPointerException occurs when dereferencing null, not on private access violations." }
            ],
            correctAnswer: "A",
            explanationNote: "Private fields cannot be accessed outside the declaring class. The Java compiler rejects the code with an access error."
          },
          {
            id: "j4-1-2-alt2",
            question: "Which keyword is used to designate that an instance variable belongs to each individual object rather than the shared class?",
            options: [
              { id: "A", text: "Non-static declaration (omitting the static keyword)", explanationIfWrong: "" },
              { id: "B", text: "The 'static' keyword", explanationIfWrong: "'static' creates a class-level variable shared across all instances." },
              { id: "C", text: "The 'dynamic' keyword", explanationIfWrong: "'dynamic' is not a keyword in Java." },
              { id: "D", text: "The 'transient' keyword only", explanationIfWrong: "'transient' is used in serialization, not for standard instance fields." }
            ],
            correctAnswer: "A",
            explanationNote: "Variables declared inside a class without the 'static' keyword are instance variables belonging to individual object instances."
          }
        ]
      },
      {
        heading: "Constructors and the 'this' Keyword",
        text: "A constructor is a special method called automatically when creating an object with 'new'. It has the exact same name as the class and has NO return type (not even void). The 'this' keyword refers to the current object instance, and is commonly used to distinguish instance variables from constructor parameters when they share the same name.",
        codeSnippet: "public class Account {\n    private String owner;\n    private double balance;\n\n    public Account(String owner, double balance) {\n        this.owner = owner;       // 'this.owner' is field; 'owner' is parameter\n        this.balance = balance;\n    }\n}",
        terminalOutput: "Account acc = new Account(\"Ada\", 100.0);",
        tip: "If parameter names match field names (e.g. name, balance), prefix the field with 'this.' to avoid parameter shadowing.",
        warning: "If you declare a return type like 'public void Account(...)', Java treats it as a standard method, NOT a constructor!",
        mcq: {
          id: "j4-1-3",
          question: "What identifies a constructor in a Java class?",
          options: [
            { id: "A", text: "It shares the exact name of the class and has NO return type (not even void)", explanationIfWrong: "" },
            { id: "B", text: "It must be named 'init' and return an instance of the class", explanationIfWrong: "Python uses '__init__'; Java constructors match the class name with no return type." },
            { id: "C", text: "It must always return 'void' and begin with the word 'create'", explanationIfWrong: "Constructors have no return type at all." },
            { id: "D", text: "It must be declared static and return a boolean", explanationIfWrong: "Constructors are non-static and return no type." }
          ],
          correctAnswer: "A",
          explanationNote: "A Java constructor has the exact same name as the class, is called with 'new', and specifies no return type."
        },
        questionPool: [
          {
            id: "j4-1-3-alt1",
            question: "In the constructor statement 'this.name = name;', what does 'this.name' refer to?",
            options: [
              { id: "A", text: "The instance variable of the object being constructed", explanationIfWrong: "" },
              { id: "B", text: "The parameter passed into the constructor", explanationIfWrong: "The parameter is 'name' without 'this'." },
              { id: "C", text: "A global static variable shared across the JVM", explanationIfWrong: "'this' refers to the specific instance, not static variables." },
              { id: "D", text: "The name of the Java package", explanationIfWrong: "It refers to the object's instance field." }
            ],
            correctAnswer: "A",
            explanationNote: "'this' refers to the current object instance; 'this.name' designates the instance variable, distinguishing it from the parameter 'name'."
          },
          {
            id: "j4-1-3-alt2",
            question: "What happens if a class does NOT define any constructor explicitly?",
            options: [
              { id: "A", text: "The Java compiler automatically generates a default parameterless constructor with an empty body", explanationIfWrong: "" },
              { id: "B", text: "The class cannot be instantiated under any circumstances", explanationIfWrong: "The default constructor allows instantiation via 'new ClassName()'." },
              { id: "C", text: "The code fails to compile with an error", explanationIfWrong: "Java automatically adds a default constructor if none is written." },
              { id: "D", text: "All fields are initialized to random memory garbage", explanationIfWrong: "Fields are set to default values (0, 0.0, false, null)." }
            ],
            correctAnswer: "A",
            explanationNote: "If no constructor is provided, Java generates a default no-argument constructor. Once you write any custom constructor, the default is removed."
          }
        ]
      },
      {
        heading: "Instance Methods: State Modification & Getters",
        text: "Methods defined in a class specify the behaviors that objects can perform. Methods can inspect state ('getters'), alter state ('mutators/setters'), or perform computations. Unlike static methods, instance methods operate in the context of a specific object and can access 'this' and instance fields directly.",
        codeSnippet: "public class Counter {\n    private int value;\n\n    public Counter() {\n        this.value = 0;\n    }\n\n    public void increase() {\n        this.value++;\n    }\n\n    public int getValue() {\n        return this.value;\n    }\n}\n\n// Usage:\nCounter c = new Counter();\nc.increase();\nSystem.out.println(c.getValue());",
        terminalOutput: "1",
        tip: "Methods that don't return values specify 'void'. Methods returning information must specify the return type matching their return statement.",
        warning: "Do not put the 'static' keyword on instance methods that interact with instance variables.",
        mcq: {
          id: "j4-1-4",
          question: "How does an instance method differ from a static method in Java?",
          options: [
            { id: "A", text: "An instance method belongs to an individual object and can access instance variables; a static method belongs to the class as a whole", explanationIfWrong: "" },
            { id: "B", text: "Instance methods cannot have parameters, while static methods can", explanationIfWrong: "Both types of methods can take any parameters." },
            { id: "C", text: "Static methods can freely access private non-static variables without an object reference", explanationIfWrong: "Static methods cannot access instance variables without an object reference." },
            { id: "D", text: "Instance methods are written outside of classes", explanationIfWrong: "All Java methods must be inside a class." }
          ],
          correctAnswer: "A",
          explanationNote: "Instance methods are invoked on specific objects (e.g. person.growOlder()) and have access to that object's instance fields."
        },
        questionPool: [
          {
            id: "j4-1-4-alt1",
            question: "What is the primary role of a 'getter' method (accessor) in an encapsulated class?",
            options: [
              { id: "A", text: "To return the value of a private instance variable to callers in a controlled read-only manner", explanationIfWrong: "" },
              { id: "B", text: "To delete the object from memory when finished", explanationIfWrong: "The JVM garbage collector handles memory reclamation." },
              { id: "C", text: "To reset all variables back to 0 or null", explanationIfWrong: "Resetting state is done by mutators, not standard getters." },
              { id: "D", text: "To convert integers into float values", explanationIfWrong: "Getters simply return field values." }
            ],
            correctAnswer: "A",
            explanationNote: "Getters provide controlled read access to private instance variables without allowing direct assignment from outside."
          },
          {
            id: "j4-1-4-alt2",
            question: "Given: 'public boolean isLegalAge() { return this.age >= 18; }'. What does this method return?",
            options: [
              { id: "A", text: "true if the object's age is 18 or higher, false otherwise", explanationIfWrong: "" },
              { id: "B", text: "The numeric integer age", explanationIfWrong: "The return type is boolean, not int." },
              { id: "C", text: "The string \"true\" or \"false\"", explanationIfWrong: "It returns a boolean primitive, not a String." },
              { id: "D", text: "void", explanationIfWrong: "It returns a boolean value." }
            ],
            correctAnswer: "A",
            explanationNote: "The comparison 'this.age >= 18' evaluates to a boolean expression, returning true or false."
          }
        ]
      },
      {
        heading: "The toString() Method",
        text: "By default, printing an object outputs its class name and memory hash (e.g. 'Person@6f494c52'). To display meaningful text, override the 'public String toString()' method. Whenever an object is passed to System.out.println() or concatenated with a String ('\"User: \" + person'), Java automatically calls its toString() method.",
        codeSnippet: "public class Person {\n    private String name;\n    private int age;\n\n    public Person(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    public String toString() {\n        return this.name + \" (age \" + this.age + \")\";\n    }\n}\n\n// Usage in main:\nPerson p = new Person(\"Ada\", 28);\nSystem.out.println(p);",
        terminalOutput: "Ada (age 28)",
        tip: "Defining toString() makes debugging and printing objects effortless throughout your program.",
        warning: "The method signature must be exactly 'public String toString()' with no parameters and return a String.",
        mcq: {
          id: "j4-1-5",
          question: "What happens when you execute System.out.println(p) on an object 'p' whose class defines 'public String toString()'?",
          options: [
            { id: "A", text: "Java automatically invokes p.toString() and prints the returned String to the terminal", explanationIfWrong: "" },
            { id: "B", text: "A compilation error occurs unless you write System.out.println(p.toString()) explicitly", explanationIfWrong: "Java automatically calls toString() on objects passed to println." },
            { id: "C", text: "It prints the object's internal memory address hex code", explanationIfWrong: "That is the default Object behavior when toString() is NOT overridden." },
            { id: "D", text: "It deletes the object from the heap", explanationIfWrong: "Printing has no effect on object lifecycle." }
          ],
          correctAnswer: "A",
          explanationNote: "System.out.println() automatically calls .toString() on any object parameter to obtain its textual representation."
        },
        questionPool: [
          {
            id: "j4-1-5-alt1",
            question: "What is the return type of the standard 'toString()' method in Java?",
            options: [
              { id: "A", text: "String", explanationIfWrong: "" },
              { id: "B", text: "void", explanationIfWrong: "toString() returns a String, it cannot be void." },
              { id: "C", text: "char[]", explanationIfWrong: "It returns a java.lang.String object." },
              { id: "D", text: "StringBuilder", explanationIfWrong: "The contract specifies java.lang.String." }
            ],
            correctAnswer: "A",
            explanationNote: "The toString() signature inherited from java.lang.Object is 'public String toString()'."
          },
          {
            id: "j4-1-5-alt2",
            question: "What is the output of '\"Item: \" + item' if item's toString() returns 'Book: 400 pages'?",
            options: [
              { id: "A", text: "\"Item: Book: 400 pages\"", explanationIfWrong: "" },
              { id: "B", text: "\"Item: item@1a2b3c\"", explanationIfWrong: "Because toString() is defined, its returned String is concatenated." },
              { id: "C", text: "\"Item: \"", explanationIfWrong: "The result includes the concatenated object string." },
              { id: "D", text: "A TypeMismatchException", explanationIfWrong: "String concatenation (+) automatically converts objects via toString()." }
            ],
            correctAnswer: "A",
            explanationNote: "String concatenation automatically invokes item.toString() and joins the strings together."
          }
        ]
      },
      {
        heading: "Multiple Constructors & Constructor Overloading",
        text: "A class can declare multiple constructors with different parameter lists. This is called constructor overloading. For example, a Person can be created with just a name (defaulting age to 0), or with both a name and an initial age. You can even call one constructor from another using 'this(name, 0);'.",
        codeSnippet: "public class Person {\n    private String name;\n    private int age;\n\n    public Person(String name) {\n        this(name, 0); // Calls the two-parameter constructor\n    }\n\n    public Person(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n}",
        terminalOutput: "Person p1 = new Person(\"Ada\");      // age defaults to 0\nPerson p2 = new Person(\"Bob\", 25);  // age set to 25",
        tip: "Calling 'this(...)' from inside a constructor must be the very first statement in that constructor.",
        warning: "Constructors must have distinct parameter type signatures so the compiler knows which one to call.",
        mcq: {
          id: "j4-1-6",
          question: "What is constructor overloading in Java?",
          options: [
            { id: "A", text: "Defining multiple constructors in the same class with different parameter lists", explanationIfWrong: "" },
            { id: "B", text: "Calling a constructor more than 100 times in a loop", explanationIfWrong: "Overloading refers to multiple method/constructor signatures, not loop counts." },
            { id: "C", text: "Replacing a constructor with a private static method", explanationIfWrong: "Overloading means having multiple versions with different parameter types." },
            { id: "D", text: "Creating a constructor that takes unlimited infinite parameters", explanationIfWrong: "Each overloaded constructor has a concrete parameter signature." }
          ],
          correctAnswer: "A",
          explanationNote: "Constructor overloading allows a class to have multiple constructors that differ in their parameter counts or types."
        },
        questionPool: [
          {
            id: "j4-1-6-alt1",
            question: "When calling another constructor from within a constructor using 'this(...)', where must that call appear?",
            options: [
              { id: "A", text: "It must be the very first statement in the constructor body", explanationIfWrong: "" },
              { id: "B", text: "It must be the last statement right before the closing brace", explanationIfWrong: "Java requires constructor chaining calls to be the very first statement." },
              { id: "C", text: "Anywhere inside the constructor", explanationIfWrong: "The compiler produces an error if this(...) is not the first line." },
              { id: "D", text: "In a separate static block", explanationIfWrong: "'this(...)' is only legal inside a constructor." }
            ],
            correctAnswer: "A",
            explanationNote: "Constructor delegation with 'this(...)' must always be the first statement in the constructor."
          },
          {
            id: "j4-1-6-alt2",
            question: "Which of the following constructor pairs can coexist in the same class 'Product'?",
            options: [
              { id: "A", text: "public Product(String name) and public Product(String name, double price)", explanationIfWrong: "" },
              { id: "B", text: "public Product(String name) and public Product(String title)", explanationIfWrong: "Both have identical parameter types (one String); variable names do not differentiate signatures." },
              { id: "C", text: "public Product(int id) and public Product(int code)", explanationIfWrong: "Both have a single int parameter; signatures must differ by type or count." },
              { id: "D", text: "public void Product(String name) and public Product(String name)", explanationIfWrong: "The first one is a method with a void return type, not a constructor." }
            ],
            correctAnswer: "A",
            explanationNote: "The two constructors differ in parameter count (1 vs 2), allowing the compiler to differentiate them unambiguously."
          }
        ]
      }
    ]
  },
  {
    id: "4-2-objects-in-list",
    number: "4.2",
    title: "Objects in a List",
    subtitle: "Store custom objects in ArrayLists, read objects from user input, iterate, filter, and search domain objects.",
    readTime: "25 min",
    objectives: [
      "Instantiate ArrayLists parameterized with custom classes (e.g. ArrayList<Person>)",
      "Read interactive user input in a loop and construct objects dynamically",
      "Traverse lists of objects using enhanced for-each loops",
      "Filter objects based on internal properties (e.g. age thresholds)",
      "Find specific objects in a list using linear search patterns",
      "Understand reference equality vs field value equality"
    ],
    theoryBlocks: [
      {
        heading: "ArrayList of Custom Objects",
        text: "Just as you can store Strings or Integers in an ArrayList, you can store custom objects. The type parameter inside the angle brackets specifies the class of objects the list contains (e.g. ArrayList<Person> persons = new ArrayList<>()). When you add an object, the list stores a reference pointing to that object.",
        codeSnippet: "import java.util.ArrayList;\n\nArrayList<Person> people = new ArrayList<>();\npeople.add(new Person(\"Ada Lovelace\", 36));\npeople.add(new Person(\"Grace Hopper\", 85));\n\nSystem.out.println(\"Total: \" + people.size());",
        terminalOutput: "Total: 2",
        tip: "An ArrayList stores references to objects in heap memory. It does not create duplicate clones of the objects.",
        warning: "Remember to import java.util.ArrayList before using it in your code.",
        mcq: {
          id: "j4-2-1",
          question: "How do you declare and initialize an ArrayList that stores instances of a custom class named 'Book'?",
          options: [
            { id: "A", text: "ArrayList<Book> books = new ArrayList<>();", explanationIfWrong: "" },
            { id: "B", text: "Book[] books = new ArrayList<Book>();", explanationIfWrong: "Book[] is a fixed array, not an ArrayList." },
            { id: "C", text: "ArrayList books = new Book();", explanationIfWrong: "This tries to assign a single Book to an untyped list reference." },
            { id: "D", text: "List<Book> = new ArrayList();", explanationIfWrong: "Missing variable identifier and proper generic instantiation." }
          ],
          correctAnswer: "A",
          explanationNote: "ArrayList<Book> books = new ArrayList<>(); creates a typed dynamic collection specifically for Book objects."
        },
        questionPool: [
          {
            id: "j4-2-1-alt1",
            question: "What actually gets stored inside an ArrayList<Person> when you invoke list.add(p)?",
            options: [
              { id: "A", text: "A memory reference (pointer) to the Person object on the heap", explanationIfWrong: "" },
              { id: "B", text: "A completely disconnected deep copy of the person's source code", explanationIfWrong: "Java stores references, not deep clones." },
              { id: "C", text: "The name of the class as a String", explanationIfWrong: "It stores the reference to the actual object instance." },
              { id: "D", text: "A byte hash code only", explanationIfWrong: "The reference points to the full live object." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, collections of objects store references pointing to the instantiated objects on the heap."
          },
          {
            id: "j4-2-1-alt2",
            question: "If person p is added to list1 and list2, what happens if you call p.growOlder()?",
            options: [
              { id: "A", text: "The change is visible when inspecting the person through both list1 and list2, because both store references to the same object", explanationIfWrong: "" },
              { id: "B", text: "Only list1 reflects the change", explanationIfWrong: "Both lists reference the exact same object in heap memory." },
              { id: "C", text: "A ConcurrentModificationException occurs", explanationIfWrong: "Modifying an object's field does not modify list structure." },
              { id: "D", text: "list2 creates a duplicate backup automatically", explanationIfWrong: "Java does not automatically duplicate objects." }
            ],
            correctAnswer: "A",
            explanationNote: "Because both lists hold references to the identical object on the heap, mutations to that object are seen through all references."
          }
        ]
      },
      {
        heading: "Populating Objects from User Input",
        text: "A frequent programming pattern involves reading user input in a loop, constructing a new object from the input values, and adding it to an ArrayList until an empty line or sentinel string is entered.",
        codeSnippet: "Scanner scanner = new Scanner(System.in);\nArrayList<Person> people = new ArrayList<>();\n\nwhile (true) {\n    System.out.print(\"Enter name (empty to stop): \");\n    String name = scanner.nextLine();\n    if (name.isEmpty()) {\n        break;\n    }\n    System.out.print(\"Enter age: \");\n    int age = Integer.valueOf(scanner.nextLine());\n    people.add(new Person(name, age));\n}",
        terminalOutput: "Enter name (empty to stop): Ada\nEnter age: 36\nEnter name (empty to stop): \n// Loop ends, people list contains 1 object",
        tip: "Always use Integer.valueOf(scanner.nextLine()) rather than scanner.nextInt() to prevent trailing newline character bugs.",
        warning: "Never instantiate the ArrayList inside the loop; that would recreate a brand new empty list on every iteration!",
        mcq: {
          id: "j4-2-2",
          question: "What would happen if 'ArrayList<Person> people = new ArrayList<>();' was accidentally placed inside the while loop body?",
          options: [
            { id: "A", text: "On every iteration a new empty list would be created, keeping only the most recently entered person", explanationIfWrong: "" },
            { id: "B", text: "The code would not compile due to a duplicate variable error", explanationIfWrong: "It compiles fine, but has scope limited to each loop iteration." },
            { id: "C", text: "The loop would run infinitely without stopping", explanationIfWrong: "List declaration does not impact loop condition or break." },
            { id: "D", text: "All previous items would be doubled", explanationIfWrong: "Each iteration starts with a clean new empty list." }
          ],
          correctAnswer: "A",
          explanationNote: "Declaring the list inside the loop re-initializes an empty list on each turn, losing previously accumulated objects."
        },
        questionPool: [
          {
            id: "j4-2-2-alt1",
            question: "Why is 'Integer.valueOf(scanner.nextLine())' preferred over 'scanner.nextInt()' when reading mixed strings and numbers?",
            options: [
              { id: "A", text: "scanner.nextInt() leaves the newline character in the input buffer, causing subsequent scanner.nextLine() calls to read empty strings", explanationIfWrong: "" },
              { id: "B", text: "scanner.nextInt() is deprecated in modern Java versions", explanationIfWrong: "nextInt() is not deprecated, but has newline buffer quirks." },
              { id: "C", text: "Integer.valueOf runs 100 times faster", explanationIfWrong: "The distinction is newline buffer handling, not speed." },
              { id: "D", text: "scanner.nextInt() can only read negative numbers", explanationIfWrong: "nextInt() reads positive and negative integers." }
            ],
            correctAnswer: "A",
            explanationNote: "Using scanner.nextLine() consistently consumes entire lines including the trailing newline, preventing skipping in subsequent prompts."
          },
          {
            id: "j4-2-2-alt2",
            question: "Given 'if (name.isEmpty()) break;', what input terminates the loop?",
            options: [
              { id: "A", text: "Pressing Enter immediately without typing any text", explanationIfWrong: "" },
              { id: "B", text: "Typing 'null' and pressing Enter", explanationIfWrong: "The string \"null\" is not empty (length 4)." },
              { id: "C", text: "Typing '0' and pressing Enter", explanationIfWrong: "The string \"0\" has length 1." },
              { id: "D", text: "Typing 'stop'", explanationIfWrong: "'stop' is not empty; it would need a condition checking name.equals(\"stop\")." }
            ],
            correctAnswer: "A",
            explanationNote: "Pressing Enter without input yields an empty string (length 0), making .isEmpty() return true."
          }
        ]
      },
      {
        heading: "Iterating and Printing Objects in a List",
        text: "The enhanced for-each loop provides the cleanest syntax for iterating over a list of objects. In each iteration, the loop variable refers to the current object. Passing the object directly to System.out.println() invokes its toString() method.",
        codeSnippet: "ArrayList<Person> people = new ArrayList<>();\npeople.add(new Person(\"Ada\", 36));\npeople.add(new Person(\"Alan\", 41));\n\nfor (Person person : people) {\n    System.out.println(person);\n}",
        terminalOutput: "Ada (age 36)\nAlan (age 41)",
        tip: "Read the for-each syntax as: 'for each Person called person in the people list'.",
        warning: "Never remove elements directly from an ArrayList using list.remove() inside a standard for-each loop, as this throws ConcurrentModificationException.",
        mcq: {
          id: "j4-2-3",
          question: "Given 'for (Person person : people)', what is the type of the loop variable 'person'?",
          options: [
            { id: "A", text: "Person", explanationIfWrong: "" },
            { id: "B", text: "ArrayList<Person>", explanationIfWrong: "'people' is the list; each individual element is a Person." },
            { id: "C", text: "int (the index)", explanationIfWrong: "For-each loops directly provide the element, not an index integer." },
            { id: "D", text: "String", explanationIfWrong: "The list contains Person objects, not Strings." }
          ],
          correctAnswer: "A",
          explanationNote: "In 'for (Person person : people)', each iteration binds the variable 'person' of type Person to the next element in the list."
        },
        questionPool: [
          {
            id: "j4-2-3-alt1",
            question: "How do you access the name of each person in the loop if the class has a 'public String getName()' method?",
            options: [
              { id: "A", text: "System.out.println(person.getName());", explanationIfWrong: "" },
              { id: "B", text: "System.out.println(people.getName());", explanationIfWrong: "'people' is the list; it does not have a getName() method." },
              { id: "C", text: "System.out.println(Person.getName());", explanationIfWrong: "getName() is an instance method, called on 'person', not the class statically." },
              { id: "D", text: "System.out.println(person[0]);", explanationIfWrong: "Objects are not indexed with square brackets." }
            ],
            correctAnswer: "A",
            explanationNote: "Call the instance method on the iteration variable: person.getName()."
          },
          {
            id: "j4-2-3-alt2",
            question: "Which loop construct is best suited when you need both the element and its numeric 0-based position?",
            options: [
              { id: "A", text: "A standard indexed for loop: for (int i = 0; i < people.size(); i++)", explanationIfWrong: "" },
              { id: "B", text: "An enhanced for-each loop without any auxiliary variables", explanationIfWrong: "For-each loops do not track the numeric index." },
              { id: "C", text: "A do-while(false) loop", explanationIfWrong: "A do-while(false) executes only once." },
              { id: "D", text: "A switch-case statement", explanationIfWrong: "Switch statements are branch controls, not iteration loops." }
            ],
            correctAnswer: "A",
            explanationNote: "When index positions are required, a standard indexed for loop (for int i = 0...) provides explicit access to i and people.get(i)."
          }
        ]
      },
      {
        heading: "Filtering Objects in a List",
        text: "You can filter elements in a list by checking object properties inside a loop. For example, to print only people who are of legal age, test the person's age property or call a helper method before printing.",
        codeSnippet: "for (Person person : people) {\n    if (person.getAge() >= 18) {\n        System.out.println(person.getName() + \" is an adult\");\n    }\n}",
        terminalOutput: "Ada is an adult\nAlan is an adult",
        tip: "Filtering does not alter the original list; it selectively processes items that satisfy the condition.",
        warning: "Ensure your getter methods (like getAge()) are public so external callers can inspect the condition.",
        mcq: {
          id: "j4-2-4",
          question: "How can you count how many items in 'ArrayList<Book> books' have more than 300 pages?",
          options: [
            { id: "A", text: "Initialize a counter 'count = 0', loop through books with for-each, and increment 'count++' whenever book.getPages() > 300", explanationIfWrong: "" },
            { id: "B", text: "Write books.size() > 300", explanationIfWrong: "books.size() gives the total count of books, not page counts." },
            { id: "C", text: "books.contains(300)", explanationIfWrong: "contains checks if the list holds an object matching 300." },
            { id: "D", text: "books.removeIf(300)", explanationIfWrong: "removeIf requires a Predicate and deletes items rather than counting." }
          ],
          correctAnswer: "A",
          explanationNote: "Iterating through the collection with an accumulator counter testing 'book.getPages() > 300' is the standard counting pattern."
        },
        questionPool: [
          {
            id: "j4-2-4-alt1",
            question: "Given a list of Person objects, how would you collect all adults into a new separate list?",
            options: [
              { id: "A", text: "Create 'ArrayList<Person> adults = new ArrayList<>()', loop through the original list, and call 'adults.add(p)' if p.getAge() >= 18", explanationIfWrong: "" },
              { id: "B", text: "Call people.split(18)", explanationIfWrong: "ArrayList does not have a split() method." },
              { id: "C", text: "Assign 'adults = people;' and delete children", explanationIfWrong: "That would also delete children from the original list because both variables share the same reference." },
              { id: "D", text: "Use adults.addAll(18)", explanationIfWrong: "addAll takes a Collection, not an integer condition." }
            ],
            correctAnswer: "A",
            explanationNote: "Creating a target list and appending matching items during iteration safely filters elements into a distinct collection."
          },
          {
            id: "j4-2-4-alt2",
            question: "What will the following code print if people contains only Ada (age 16)?\nfor (Person p : people) { if (p.getAge() >= 18) { System.out.println(p); } }",
            options: [
              { id: "A", text: "Nothing (no output)", explanationIfWrong: "" },
              { id: "B", text: "Ada (age 16)", explanationIfWrong: "The condition 16 >= 18 evaluates to false." },
              { id: "C", text: "null", explanationIfWrong: "The println statement is never reached." },
              { id: "D", text: "An IndexOutOfBoundsException", explanationIfWrong: "Empty matching results produce no exceptions." }
            ],
            correctAnswer: "A",
            explanationNote: "Since Ada's age (16) is less than 18, the if-block body is skipped and no text is printed."
          }
        ]
      },
      {
        heading: "Searching for the Maximum or Best Object",
        text: "To find the 'oldest person' or 'most expensive product' in a list of objects, track a reference to the best object seen so far. Initialize it with the first element of the list, then iterate through the remaining elements, updating the reference whenever a better candidate is found.",
        codeSnippet: "if (people.isEmpty()) {\n    System.out.println(\"List is empty\");\n} else {\n    Person oldest = people.get(0);\n    for (Person p : people) {\n        if (p.getAge() > oldest.getAge()) {\n            oldest = p;\n        }\n    }\n    System.out.println(\"Oldest: \" + oldest);\n}",
        terminalOutput: "Oldest: Alan (age 41)",
        tip: "Always check if the list is empty before calling people.get(0) to prevent IndexOutOfBoundsException.",
        warning: "Do not initialize 'oldest' to null unless you add explicit null-checks inside the loop comparison.",
        mcq: {
          id: "j4-2-5",
          question: "When searching for the oldest person in a non-empty ArrayList<Person>, what is the recommended initialization for the candidate variable 'oldest'?",
          options: [
            { id: "A", text: "Person oldest = people.get(0);", explanationIfWrong: "" },
            { id: "B", text: "Person oldest = new Person(\"\", 9999);", explanationIfWrong: "Initializing with a huge dummy age prevents finding the actual oldest person." },
            { id: "C", text: "Person oldest = people.get(people.size());", explanationIfWrong: "Index 'size()' is out of bounds (valid indices are 0 to size - 1)." },
            { id: "D", text: "int oldest = 0;", explanationIfWrong: "We want to track the Person object reference, not just a primitive int." }
          ],
          correctAnswer: "A",
          explanationNote: "Initializing with people.get(0) guarantees that the candidate begins with a real element from the list."
        },
        questionPool: [
          {
            id: "j4-2-5-alt1",
            question: "What exception is thrown if you execute 'people.get(0)' when people has 0 elements?",
            options: [
              { id: "A", text: "IndexOutOfBoundsException", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "The list exists, but index 0 does not exist in an empty list." },
              { id: "C", text: "NoSuchElementException", explanationIfWrong: "ArrayList throws IndexOutOfBoundsException." },
              { id: "D", text: "ArithmeticException", explanationIfWrong: "ArithmeticException occurs on illegal math operations like division by zero." }
            ],
            correctAnswer: "A",
            explanationNote: "Attempting to retrieve index 0 on an empty list throws IndexOutOfBoundsException."
          },
          {
            id: "j4-2-5-alt2",
            question: "How do you find an object in a list by a specific name (e.g. \"Grace\")?",
            options: [
              { id: "A", text: "Loop through items and return the object when p.getName().equals(\"Grace\") is true", explanationIfWrong: "" },
              { id: "B", text: "Write people.get(\"Grace\")", explanationIfWrong: "ArrayList.get() takes an integer index, not a string key." },
              { id: "C", text: "Use people.hasName(\"Grace\")", explanationIfWrong: "ArrayList has no hasName() method." },
              { id: "D", text: "Convert the ArrayList to an int array", explanationIfWrong: "String name matching is done via linear search or maps." }
            ],
            correctAnswer: "A",
            explanationNote: "Iterating through the list and checking string equality with .equals() is standard linear search."
          }
        ]
      },
      {
        heading: "Comparing Object References vs Equality",
        text: "When comparing object variables using '==', Java tests whether both variables point to the exact same memory address on the heap. Two different objects with identical field values are NOT '==' unless they reference the identical memory location. To compare contents, classes implement or override the equals() method.",
        codeSnippet: "Person p1 = new Person(\"Ada\", 25);\nPerson p2 = new Person(\"Ada\", 25);\nPerson p3 = p1;\n\nSystem.out.println(p1 == p2); // false (distinct heap objects)\nSystem.out.println(p1 == p3); // true  (same memory reference)",
        terminalOutput: "false\ntrue",
        tip: "p3 = p1 copies the reference (address), not the object itself. Both variables now point to the exact same object.",
        warning: "Never use '==' to compare objects for value equality; use '.equals()' instead.",
        mcq: {
          id: "j4-2-6",
          question: "Given 'Person p1 = new Person(\"Ada\");' and 'Person p2 = new Person(\"Ada\");', why does 'p1 == p2' evaluate to false?",
          options: [
            { id: "A", text: "Because '==' compares memory addresses, and each 'new' call allocates a separate distinct object on the heap", explanationIfWrong: "" },
            { id: "B", text: "Because their names have different hash codes", explanationIfWrong: "Identical strings have identical hash codes." },
            { id: "C", text: "Because Java requires all names to be unique across objects", explanationIfWrong: "Different objects can share identical name strings." },
            { id: "D", text: "Because p2 overrides p1 automatically", explanationIfWrong: "Both objects exist independently." }
          ],
          correctAnswer: "A",
          explanationNote: "The '==' operator checks reference identity (memory addresses). Since p1 and p2 were created with separate 'new' calls, they occupy different addresses."
        },
        questionPool: [
          {
            id: "j4-2-6-alt1",
            question: "If 'p3 = p1;' is executed, what does 'p1 == p3' evaluate to?",
            options: [
              { id: "A", text: "true, because p3 now holds the exact same reference address as p1", explanationIfWrong: "" },
              { id: "B", text: "false, because they have different variable names", explanationIfWrong: "Variable names do not affect reference identity." },
              { id: "C", text: "null", explanationIfWrong: "'==' evaluates to a boolean (true or false)." },
              { id: "D", text: "A compilation error", explanationIfWrong: "Assigning reference variables is completely valid." }
            ],
            correctAnswer: "A",
            explanationNote: "Assigning reference variables copies the memory pointer, so both refer to the exact same heap object."
          },
          {
            id: "j4-2-6-alt2",
            question: "How does the 'list.contains(object)' method in ArrayList determine whether an object is in the list?",
            options: [
              { id: "A", text: "It iterates through elements calling .equals() on each element", explanationIfWrong: "" },
              { id: "B", text: "It only checks the memory size of the object", explanationIfWrong: "Equality is evaluated via the equals() method contract." },
              { id: "C", text: "It converts the entire list into an integer", explanationIfWrong: "No integer conversion occurs." },
              { id: "D", text: "It uses randomized binary search", explanationIfWrong: "ArrayList.contains() uses linear search with .equals()." }
            ],
            correctAnswer: "A",
            explanationNote: "ArrayList's contains() and indexOf() methods rely on the .equals() method of elements to determine matches."
          }
        ]
      }
    ]
  },
  {
    id: "4-3-files-and-reading-data",
    number: "4.3",
    title: "Files & Reading Data",
    subtitle: "Read external files using Scanner and Paths.get(), parse structured CSV records, instantiate domain objects, and handle exceptions.",
    readTime: "25 min",
    objectives: [
      "Use java.util.Scanner with java.nio.file.Paths.get() to open and read files",
      "Process text line by line using while (scanner.hasNextLine())",
      "Parse structured text with String.split(\",\") to separate fields",
      "Construct custom domain objects from file records and store in an ArrayList",
      "Manage resources safely using try-with-resources blocks",
      "Catch exceptions to prevent abrupt application crashes when files are missing"
    ],
    theoryBlocks: [
      {
        heading: "Reading Files with Scanner and Paths.get()",
        text: "In Java, reading from a file uses the familiar Scanner class, but initialized with a Path object created via 'Paths.get(\"filename.txt\")' instead of System.in. Because file reading can encounter missing files, it must be wrapped in a 'try' block with exception handling.",
        codeSnippet: "import java.util.Scanner;\nimport java.nio.file.Paths;\n\ntry (Scanner scanner = new Scanner(Paths.get(\"data.txt\"))) {\n    while (scanner.hasNextLine()) {\n        String line = scanner.nextLine();\n        System.out.println(line);\n    }\n} catch (Exception e) {\n    System.out.println(\"Error: \" + e.getMessage());\n}",
        terminalOutput: "First line of file\nSecond line of file",
        tip: "Always use try-with-resources 'try (Scanner scanner = ...)' so the file handle is automatically closed even if an exception occurs.",
        warning: "Remember to import java.nio.file.Paths as well as java.util.Scanner.",
        mcq: {
          id: "j4-3-1",
          question: "Which expression correctly initializes a Scanner to read from a text file named 'records.txt'?",
          options: [
            { id: "A", text: "new Scanner(Paths.get(\"records.txt\"))", explanationIfWrong: "" },
            { id: "B", text: "new Scanner(\"records.txt\")", explanationIfWrong: "Passing a raw String to Scanner causes it to scan the literal text characters of the string itself, NOT the file!" },
            { id: "C", text: "new Scanner(System.in.file(\"records.txt\"))", explanationIfWrong: "System.in represents standard keyboard input, not file paths." },
            { id: "D", text: "new FileScanner(\"records.txt\")", explanationIfWrong: "There is no built-in Java class named FileScanner." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing Paths.get(\"records.txt\") opens the actual file on the filesystem for reading via Scanner."
        },
        questionPool: [
          {
            id: "j4-3-1-alt1",
            question: "What happens if you pass a raw string like 'new Scanner(\"data.txt\")' instead of Paths.get(\"data.txt\")?",
            options: [
              { id: "A", text: "The Scanner reads the literal string \"data.txt\" itself rather than opening any file", explanationIfWrong: "" },
              { id: "B", text: "Java opens the file in read-only mode", explanationIfWrong: "Scanner(String) treats the string argument as the data source itself." },
              { id: "C", text: "A FileNotFoundException is immediately thrown", explanationIfWrong: "It succeeds immediately by scanning the 8 characters of \"data.txt\"." },
              { id: "D", text: "The file is deleted from disk", explanationIfWrong: "Scanner never deletes files." }
            ],
            correctAnswer: "A",
            explanationNote: "Scanner has a constructor taking a String which parses that string's literal text. To read a file, you must pass Paths.get(...)."
          },
          {
            id: "j4-3-1-alt2",
            question: "What is the primary benefit of the 'try-with-resources' syntax: 'try (Scanner scanner = ...)'?",
            options: [
              { id: "A", text: "It guarantees that the file stream will be automatically closed when the try block finishes", explanationIfWrong: "" },
              { id: "B", text: "It doubles reading performance from disk", explanationIfWrong: "It provides safe resource closure, not disk acceleration." },
              { id: "C", text: "It prevents any compiler errors from occurring in the file", explanationIfWrong: "Compiler errors still apply to all code within the block." },
              { id: "D", text: "It allows editing the file contents simultaneously", explanationIfWrong: "Scanner is strictly a reader." }
            ],
            correctAnswer: "A",
            explanationNote: "Try-with-resources automatically invokes .close() on AutoCloseable resources, preventing resource and file handle leaks."
          }
        ]
      },
      {
        heading: "Line-by-Line File Processing",
        text: "When reading files of unknown length, use 'while (scanner.hasNextLine())'. The hasNextLine() method returns true as long as there is unread content remaining, and scanner.nextLine() reads and returns the next line as a String.",
        codeSnippet: "int lineCount = 0;\ntry (Scanner scanner = new Scanner(Paths.get(\"data.txt\"))) {\n    while (scanner.hasNextLine()) {\n        String row = scanner.nextLine();\n        lineCount++;\n    }\n} catch (Exception e) {\n    System.out.println(\"Reading failed: \" + e.getMessage());\n}\nSystem.out.println(\"Total lines: \" + lineCount);",
        terminalOutput: "Total lines: 42",
        tip: "To read all lines into a collection, declare an ArrayList<String> before the try block and add each row inside the while loop.",
        warning: "Calling scanner.nextLine() without checking hasNextLine() will throw NoSuchElementException at the end of the file.",
        mcq: {
          id: "j4-3-2",
          question: "What loop condition is standard for reading all lines until the end of a file in Java?",
          options: [
            { id: "A", text: "while (scanner.hasNextLine())", explanationIfWrong: "" },
            { id: "B", text: "for (int i = 0; i < scanner.size(); i++)", explanationIfWrong: "Scanner does not have a size() method because file size is not known in advance." },
            { id: "C", text: "while (scanner.readLine() != null)", explanationIfWrong: "readLine() belongs to BufferedReader, not Scanner." },
            { id: "D", text: "while (true) with no break", explanationIfWrong: "An infinite loop without termination checks causes crashes." }
          ],
          correctAnswer: "A",
          explanationNote: "scanner.hasNextLine() safely checks whether another line exists in the file before attempting to read it."
        },
        questionPool: [
          {
            id: "j4-3-2-alt1",
            question: "What exception is thrown if you call 'scanner.nextLine()' after the end of the file has already been reached?",
            options: [
              { id: "A", text: "NoSuchElementException", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "NoSuchElementException indicates no more elements exist to return." },
              { id: "C", text: "ArrayIndexOutOfBoundsException", explanationIfWrong: "This occurs on arrays, not Scanner." },
              { id: "D", text: "StackOverflowError", explanationIfWrong: "StackOverflowError occurs on infinite recursion." }
            ],
            correctAnswer: "A",
            explanationNote: "When hasNextLine() is false and nextLine() is called, Scanner throws NoSuchElementException."
          },
          {
            id: "j4-3-2-alt2",
            question: "How can you count how many times the word 'Java' appears across all lines in a file?",
            options: [
              { id: "A", text: "Loop with hasNextLine(), and if row.contains(\"Java\") is true, increment a counter", explanationIfWrong: "" },
              { id: "B", text: "Use scanner.findWord(\"Java\")", explanationIfWrong: "Scanner does not provide a findWord() method." },
              { id: "C", text: "Call Paths.get(\"data.txt\").count(\"Java\")", explanationIfWrong: "Paths.get returns a Path object without search methods." },
              { id: "D", text: "By using System.out.println(file.contains(\"Java\"))", explanationIfWrong: "The file must be read line by line." }
            ],
            correctAnswer: "A",
            explanationNote: "Checking each line with row.contains(\"Java\") and incrementing a counter is the standard search and tally approach."
          }
        ]
      },
      {
        heading: "Parsing Structured Data (CSV Files)",
        text: "Many data files store comma-separated values (CSV), where each line contains multiple fields separated by commas. Use 'line.split(\",\")' to break the line into an array of Strings. You can then parse numbers using Integer.valueOf() or Double.valueOf().",
        codeSnippet: "String line = \"Ada Lovelace,36,London\";\nString[] parts = line.split(\",\");\n\nString name = parts[0];\nint age = Integer.valueOf(parts[1]);\nString city = parts[2];\n\nSystem.out.println(name + \" is \" + age + \" from \" + city);",
        terminalOutput: "Ada Lovelace is 36 from London",
        tip: "Always inspect the array length (parts.length) before indexing to ensure the line was not malformed.",
        warning: "If a line has fewer columns than expected, parts[1] will throw ArrayIndexOutOfBoundsException.",
        mcq: {
          id: "j4-3-3",
          question: "Given 'String line = \"apple,banana,cherry\"; String[] fruits = line.split(\",\");', what is stored in fruits[1]?",
          options: [
            { id: "A", text: "\"banana\"", explanationIfWrong: "" },
            { id: "B", text: "\"apple\"", explanationIfWrong: "fruits[0] is \"apple\" because arrays are zero-indexed." },
            { id: "C", text: "\"cherry\"", explanationIfWrong: "fruits[2] is \"cherry\"." },
            { id: "D", text: "\"apple,banana\"", explanationIfWrong: "split(\",\") breaks the string at each comma." }
          ],
          correctAnswer: "A",
          explanationNote: "Splitting on comma creates [\"apple\", \"banana\", \"cherry\"]. Index 1 yields \"banana\"."
        },
        questionPool: [
          {
            id: "j4-3-3-alt1",
            question: "How do you convert a string field 'parts[1]' representing an age into a primitive integer?",
            options: [
              { id: "A", text: "Integer.valueOf(parts[1])", explanationIfWrong: "" },
              { id: "B", text: "(int) parts[1]", explanationIfWrong: "Strings cannot be directly cast to int with (int)." },
              { id: "C", text: "parts[1].toInt()", explanationIfWrong: "Java's String class does not have a toInt() method." },
              { id: "D", text: "convert.integer(parts[1])", explanationIfWrong: "Integer parsing is performed via Integer.valueOf() or Integer.parseInt()." }
            ],
            correctAnswer: "A",
            explanationNote: "Integer.valueOf(str) or Integer.parseInt(str) parses numeric strings into integers."
          },
          {
            id: "j4-3-3-alt2",
            question: "What happens if parts[1] contains \"twenty\" when calling Integer.valueOf(parts[1])?",
            options: [
              { id: "A", text: "NumberFormatException is thrown", explanationIfWrong: "" },
              { id: "B", text: "It returns 20 automatically", explanationIfWrong: "Java does not parse English words into numbers." },
              { id: "C", text: "It defaults to 0", explanationIfWrong: "Non-numeric strings cause a NumberFormatException." },
              { id: "D", text: "NullPointerException", explanationIfWrong: "The string is not null; the format is invalid." }
            ],
            correctAnswer: "A",
            explanationNote: "Parsing a non-numeric string like \"twenty\" triggers a NumberFormatException."
          }
        ]
      },
      {
        heading: "Instantiating Domain Objects from File Data",
        text: "The real power of object-oriented programming comes when combining file reading with domain models. As you read each CSV row, parse the fields, instantiate a new domain object (e.g. new Person(name, age)), and append it to an ArrayList<Person>.",
        codeSnippet: "ArrayList<Person> people = new ArrayList<>();\ntry (Scanner scanner = new Scanner(Paths.get(\"people.csv\"))) {\n    while (scanner.hasNextLine()) {\n        String line = scanner.nextLine();\n        String[] parts = line.split(\",\");\n        String name = parts[0];\n        int age = Integer.valueOf(parts[1]);\n        people.add(new Person(name, age));\n    }\n} catch (Exception e) {\n    System.out.println(\"Error: \" + e.getMessage());\n}",
        terminalOutput: "// The people list now contains full Person instances created from CSV rows",
        tip: "By separating file reading from business logic, your program can easily sort, filter, or query the loaded objects in memory.",
        warning: "Skip empty lines in your CSV files with 'if (line.isEmpty()) continue;' to prevent parsing errors.",
        mcq: {
          id: "j4-3-4",
          question: "Why is loading file records into custom domain objects (e.g. ArrayList<Person>) advantageous over keeping raw Strings?",
          options: [
            { id: "A", text: "It encapsulates data into structured, strongly-typed entities with dedicated helper methods, validation, and clear behaviors", explanationIfWrong: "" },
            { id: "B", text: "Because Java will refuse to execute programs that store strings in lists", explanationIfWrong: "Java stores strings in lists without issue." },
            { id: "C", text: "It reduces memory consumption by 90%", explanationIfWrong: "Objects add slight metadata overhead, but provide structure and safety." },
            { id: "D", text: "It automatically saves the data to a remote cloud database", explanationIfWrong: "Java does not automatically upload data to the cloud." }
          ],
          correctAnswer: "A",
          explanationNote: "Domain objects provide type-safety, validation, readable methods, and encapsulation for business operations."
        },
        questionPool: [
          {
            id: "j4-3-4-alt1",
            question: "Where should the 'ArrayList<Person> people = new ArrayList<>();' variable be declared?",
            options: [
              { id: "A", text: "Before the try-with-resources block, so it remains accessible after the file stream closes", explanationIfWrong: "" },
              { id: "B", text: "Inside the while loop body", explanationIfWrong: "Declaring it in the while loop recreates a new empty list on every line." },
              { id: "C", text: "Inside the catch block only", explanationIfWrong: "The catch block only executes if an error occurs." },
              { id: "D", text: "In a separate text file", explanationIfWrong: "Variables are declared in Java source code." }
            ],
            correctAnswer: "A",
            explanationNote: "Declaring the list outside the try block ensures the populated collection can be used throughout the rest of the method."
          },
          {
            id: "j4-3-4-alt2",
            question: "If a CSV file has a header line 'name,age', how should it be handled when parsing data rows?",
            options: [
              { id: "A", text: "Read and discard the header with a single scanner.nextLine() call before entering the while loop", explanationIfWrong: "" },
              { id: "B", text: "Let Integer.valueOf() parse the word 'age' into 0", explanationIfWrong: "Parsing \"age\" throws a NumberFormatException." },
              { id: "C", text: "Delete the first line from the hard drive automatically", explanationIfWrong: "You should not alter files on disk unexpectedly." },
              { id: "D", text: "CSV files in Java cannot contain headers", explanationIfWrong: "Headers are standard in CSV files and easily skipped." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling scanner.nextLine() once before the while loop reads the header row and advances the cursor to the first data line."
          }
        ]
      },
      {
        heading: "Handling Missing Files & Exceptions",
        text: "When working with external files, errors like missing files, permission issues, or corrupt data are common. Java enforces exception handling using 'try-catch' blocks. If an error occurs inside 'try', Java jumps immediately to 'catch', allowing the program to handle the issue gracefully instead of crashing.",
        codeSnippet: "try (Scanner scanner = new Scanner(Paths.get(\"missing.txt\"))) {\n    while (scanner.hasNextLine()) {\n        System.out.println(scanner.nextLine());\n    }\n} catch (Exception e) {\n    System.out.println(\"Failed to read file: \" + e.getMessage());\n}\nSystem.out.println(\"Program continues safely...\");",
        terminalOutput: "Failed to read file: missing.txt\nProgram continues safely...",
        tip: "Printing 'e.getMessage()' or 'e.printStackTrace()' provides actionable debugging information about what caused the failure.",
        warning: "Never leave a catch block completely empty (silent failure); at least log an error message.",
        mcq: {
          id: "j4-3-5",
          question: "What happens if 'missing.txt' does not exist on disk in the example above?",
          options: [
            { id: "A", text: "An exception is caught by the catch block, printing an error message, and the program continues executing without crashing", explanationIfWrong: "" },
            { id: "B", text: "The operating system forcibly terminates the JVM immediately", explanationIfWrong: "Because of the catch block, the exception is handled gracefully." },
            { id: "C", text: "A blank file named 'missing.txt' is automatically created on disk", explanationIfWrong: "Scanner is a reader; it never creates missing files." },
            { id: "D", text: "The program enters an infinite loop", explanationIfWrong: "Exceptions break execution out of the try block immediately." }
          ],
          correctAnswer: "A",
          explanationNote: "The try-catch mechanism catches the exception and routes execution to the catch block, preventing an unhandled crash."
        },
        questionPool: [
          {
            id: "j4-3-5-alt1",
            question: "Which of the following is an exception specifically thrown when a requested file cannot be located on disk?",
            options: [
              { id: "A", text: "NoSuchFileException (or FileNotFoundException)", explanationIfWrong: "" },
              { id: "B", text: "ArithmeticException", explanationIfWrong: "ArithmeticException occurs on mathematical errors." },
              { id: "C", text: "ClassCastException", explanationIfWrong: "ClassCastException occurs when casting incompatible object types." },
              { id: "D", text: "NullPointerException", explanationIfWrong: "NullPointerException occurs when invoking methods on null." }
            ],
            correctAnswer: "A",
            explanationNote: "java.nio.file.NoSuchFileException or java.io.FileNotFoundException are thrown when a file path does not exist."
          },
          {
            id: "j4-3-5-alt2",
            question: "What will execute if NO exception occurs inside the 'try' block?",
            options: [
              { id: "A", text: "The entire try block completes, the catch block is skipped, and execution proceeds past the catch block", explanationIfWrong: "" },
              { id: "B", text: "The catch block runs as a confirmation", explanationIfWrong: "Catch blocks only execute when an exception is thrown." },
              { id: "C", text: "The program resets to line 1", explanationIfWrong: "Execution flows sequentially." },
              { id: "D", text: "The computer restarts", explanationIfWrong: "Standard normal execution." }
            ],
            correctAnswer: "A",
            explanationNote: "If no exception occurs, the try block finishes normally and all catch blocks associated with it are bypassed."
          }
        ]
      },
      {
        heading: "Searching & Querying Loaded File Data",
        text: "Once data from a file is loaded into an ArrayList of objects, your application can perform interactive queries repeatedly without re-reading the disk. Users can search for records by name, compute averages, or find maximum values instantly.",
        codeSnippet: "// Searching loaded 'people' list for a user query:\nScanner keyboard = new Scanner(System.in);\nSystem.out.print(\"Search name: \");\nString query = keyboard.nextLine();\n\nboolean found = false;\nfor (Person p : people) {\n    if (p.getName().equalsIgnoreCase(query)) {\n        System.out.println(\"Found record: \" + p);\n        found = true;\n        break;\n    }\n}\nif (!found) {\n    System.out.println(\"No record matching: \" + query);\n}",
        terminalOutput: "Search name: Ada\nFound record: Ada Lovelace (age 36)",
        tip: "Use 'equalsIgnoreCase()' for user input matching to make search case-insensitive.",
        warning: "Keep file I/O separate from user search queries for optimal architecture and performance.",
        mcq: {
          id: "j4-3-6",
          question: "Why is loading file records into an ArrayList in memory better than reopening the file every time a user executes a search query?",
          options: [
            { id: "A", text: "RAM access is thousands of times faster than disk I/O, providing instantaneous search responses", explanationIfWrong: "" },
            { id: "B", text: "Because files can only be opened once per day by the operating system", explanationIfWrong: "Files can be opened as often as needed, but disk I/O is slow." },
            { id: "C", text: "Java does not allow opening the same file twice in one program", explanationIfWrong: "A file can be reopened, but doing so repeatedly is inefficient." },
            { id: "D", text: "Disk files are deleted as soon as they are read", explanationIfWrong: "Reading does not delete files." }
          ],
          correctAnswer: "A",
          explanationNote: "Reading from disk is orders of magnitude slower than querying objects cached in RAM."
        },
        questionPool: [
          {
            id: "j4-3-6-alt1",
            question: "Which String method performs case-insensitive comparison (e.g. matching 'ada' with 'Ada')?",
            options: [
              { id: "A", text: ".equalsIgnoreCase(otherString)", explanationIfWrong: "" },
              { id: "B", text: ".equals(otherString)", explanationIfWrong: ".equals() is strictly case-sensitive." },
              { id: "C", text: ".compareAnyCase(otherString)", explanationIfWrong: "There is no compareAnyCase method in String." },
              { id: "D", text: ".matchCase(otherString)", explanationIfWrong: "Use .equalsIgnoreCase() in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "equalsIgnoreCase() compares two strings character-by-character ignoring capitalization differences."
          },
          {
            id: "j4-3-6-alt2",
            question: "How do you calculate the average age of all people loaded from a CSV file into ArrayList<Person>?",
            options: [
              { id: "A", text: "Sum all ages in a loop: 'sum += p.getAge()', then divide by '(double) people.size()'", explanationIfWrong: "" },
              { id: "B", text: "Write people.getAverageAge()", explanationIfWrong: "ArrayList does not have a getAverageAge() method." },
              { id: "C", text: "Call Math.average(people)", explanationIfWrong: "Math.average does not exist in java.lang.Math." },
              { id: "D", text: "Divide the file size in bytes by people.size()", explanationIfWrong: "Byte count does not represent ages." }
            ],
            correctAnswer: "A",
            explanationNote: "Tallying the sum of ages and dividing by (double) people.size() gives the accurate decimal average."
          }
        ]
      }
    ]
  }
];

// Helper functions matching Python Part 4 mechanics

export function getActiveQuestionsForLevelPart4(
  section: SectionContent,
  studentId: string,
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part4_seen_${studentId}_${section.id}`;
  let seenIds: string[] = [];
  try {
    const raw = localStorage.getItem(seenKey);
    if (raw) seenIds = JSON.parse(raw);
  } catch {}

  const activeQuestions: McqQuestion[] = [];

  section.theoryBlocks.forEach((block) => {
    const pool = [block.mcq, ...(block.questionPool || [])].filter(Boolean) as McqQuestion[];
    if (pool.length === 0) return;

    if (forceShuffle) {
      const unseen = pool.filter(q => q.id && !seenIds.includes(q.id));
      if (unseen.length > 0) {
        const picked = unseen[Math.floor(Math.random() * unseen.length)];
        activeQuestions.push(picked);
        if (picked.id) seenIds.push(picked.id);
      } else {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        activeQuestions.push(picked);
      }
    } else {
      activeQuestions.push(pool[0]);
      if (pool[0].id && !seenIds.includes(pool[0].id)) {
        seenIds.push(pool[0].id);
      }
    }
  });

  try {
    localStorage.setItem(seenKey, JSON.stringify(seenIds));
  } catch {}

  return activeQuestions;
}

export function getConsecutiveFailedLevelsPart4(studentId: string): number {
  try {
    const key = `dopilot_java_part4_consecutive_failures_${studentId}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart4(studentId: string): void {
  try {
    localStorage.setItem(`dopilot_java_part4_consecutive_failures_${studentId}`, '0');
  } catch {}
}

export function setLevelAttemptCountPart4(sectionId: string, studentId: string, count: number): void {
  try {
    localStorage.setItem(`dopilot_java_part4_attempt_${studentId}_${sectionId}`, String(count));
  } catch {}
}

export function getLevelAttemptCountPart4(sectionId: string, studentId: string): number {
  try {
    const raw = localStorage.getItem(`dopilot_java_part4_attempt_${studentId}_${sectionId}`);
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart4 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart4(
  sectionId: string,
  studentId: string,
  isPassed: boolean
): AttemptResultPart4 {
  const attemptKey = `dopilot_java_part4_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part4_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part4_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = localStorage.getItem(attemptKey);
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart4(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart4(studentId);
    try {
      localStorage.removeItem(attemptKey);
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
        localStorage.setItem(streakKey, String(streak));
      } catch {}
    }

    const isLocked = streak >= 3;
    if (isLocked) {
      try {
        localStorage.setItem(lockKey, 'true');
      } catch {}
    }

    try {
      localStorage.setItem(attemptKey, String(attempts + 1));
    } catch {}

    return {
      consecutiveFailedLevels: streak,
      attemptCount: attempts,
      isSecondFailureInLevel: isSecondFailure,
      isLocked
    };
  }
}
