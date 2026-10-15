// src/data/javaPart9Data.ts
// Helsinki MOOC Java Programming Part 9: Class Inheritance, Interfaces, and Polymorphism

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
  // -------------------------------------------------------------
  // LEVEL 9.1: Class Inheritance
  // -------------------------------------------------------------
  {
    id: "9-1-class-inheritance",
    number: "9.1",
    title: "Class Inheritance",
    subtitle: "Extends keyword, superclass & subclass hierarchy, super() constructor calls, and method overriding.",
    readTime: "25 min",
    objectives: [
      "Inherit common attributes and behavior from a superclass using the 'extends' keyword",
      "Invoke superclass constructors using 'super(...)' as the first line of subclass constructors",
      "Override superclass methods with the '@Override' annotation to customize subclass behavior",
      "Reuse superclass method implementations using 'super.methodName()'",
      "Distinguish between private, protected, package-private, and public visibility in class hierarchies",
      "Prevent class inheritance using the 'final' class modifier"
    ],
    theoryBlocks: [
      {
        heading: "Superclass and Subclass with 'extends'",
        text: "Inheritance allows a class (subclass or child class) to inherit instance variables and methods from another class (superclass or parent class) using the 'extends' keyword. A subclass can add new instance variables and methods, or customize inherited behavior.",
        codeSnippet: "// Superclass:\npublic class Person {\n    private String name;\n    private String address;\n\n    public Person(String name, String address) {\n        this.name = name;\n        this.address = address;\n    }\n    public String getName() { return this.name; }\n}\n\n// Subclass inherits Person:\npublic class Student extends Person {\n    private int credits;\n\n    public Student(String name, String address) {\n        super(name, address); // Call Person constructor!\n        this.credits = 0;\n    }\n    public int getCredits() { return this.credits; }\n    public void study() { this.credits++; }\n}",
        terminalOutput: "Student ollie = new Student(\"Ollie\", \"6381 Hollywood Blvd\");\nSystem.out.println(ollie.getName()); // Inherited: \"Ollie\"\nollie.study();\nSystem.out.println(ollie.getCredits()); // Subclass method: 1",
        tip: "A subclass inherits all public and protected members of its superclass automatically.",
        warning: "In Java, a class can extend only ONE single superclass (single class inheritance).",
        mcq: {
          id: "j9-1-1",
          question: "Which keyword is used in Java to inherit from another class?",
          options: [
            { id: "A", text: "extends", explanationIfWrong: "" },
            { id: "B", text: "implements", explanationIfWrong: "'implements' is used for interfaces, not class inheritance." },
            { id: "C", text: "inherits", explanationIfWrong: "'inherits' is not a Java keyword." },
            { id: "D", text: "super", explanationIfWrong: "'super' refers to the superclass instance, not the inheritance declaration." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'extends' keyword specifies the superclass that the current class inherits from."
        },
        questionPool: [
          {
            id: "j9-1-1-alt1",
            question: "How many superclasses can a Java class directly extend with 'extends'?",
            options: [
              { id: "A", text: "Exactly one (Java supports single class inheritance only)", explanationIfWrong: "" },
              { id: "B", text: "Up to 5", explanationIfWrong: "Java does not permit multiple class inheritance." },
              { id: "C", text: "Unlimited", explanationIfWrong: "Only interfaces can be implemented multiply." },
              { id: "D", text: "Zero", explanationIfWrong: "Any class can extend another class (and all classes extend Object by default)." }
            ],
            correctAnswer: "A",
            explanationNote: "Java does not support multiple class inheritance (a class can only extend one parent class) to avoid the Diamond Problem."
          },
          {
            id: "j9-1-1-alt2",
            question: "What is the ultimate root superclass of all classes in Java?",
            options: [
              { id: "A", text: "java.lang.Object", explanationIfWrong: "" },
              { id: "B", text: "java.lang.Class", explanationIfWrong: "Class is for reflection; Object is the root of the hierarchy." },
              { id: "C", text: "java.lang.System", explanationIfWrong: "System provides system utilities." },
              { id: "D", text: "java.lang.Main", explanationIfWrong: "Main is not an SDK root class." }
            ],
            correctAnswer: "A",
            explanationNote: "Every class in Java directly or indirectly inherits from java.lang.Object."
          }
        ]
      },
      {
        heading: "Calling Superclass Constructors with super(...)",
        text: "When a subclass object is instantiated, the superclass constructor must execute first to initialize inherited fields. If the superclass does not have a no-argument constructor, the subclass constructor MUST explicitly call 'super(args)' as its very first statement.",
        codeSnippet: "public class Teacher extends Person {\n    private int salary;\n\n    public Teacher(String name, String address, int salary) {\n        super(name, address); // Mandatory: Must be line 1!\n        this.salary = salary;\n    }\n}",
        terminalOutput: "Teacher ada = new Teacher(\"Ada Lovelace\", \"24 Mayfair\", 1200);\nInitializes Person fields (name, address) then Teacher field (salary).",
        tip: "If a superclass has a default parameterless constructor, the compiler inserts 'super()' automatically if omitted.",
        warning: "'super(...)' must always be the very first line inside the subclass constructor.",
        mcq: {
          id: "j9-1-2",
          question: "Where must the call to the superclass constructor 'super(...)' be placed in a subclass constructor?",
          options: [
            { id: "A", text: "As the very first statement inside the constructor body", explanationIfWrong: "" },
            { id: "B", text: "At the end of the constructor body", explanationIfWrong: "The superclass must be initialized before the subclass executes." },
            { id: "C", text: "Anywhere within the class", explanationIfWrong: "It must be the first statement of the constructor." },
            { id: "D", text: "Inside the superclass itself", explanationIfWrong: "The subclass constructor calls super(...)." }
          ],
          correctAnswer: "A",
          explanationNote: "Java language rules mandate that super(...) or this(...) must be the very first line of a constructor."
        },
        questionPool: [
          {
            id: "j9-1-2-alt1",
            question: "What happens if a superclass does not have a no-argument constructor and the subclass constructor omits 'super(...)'?",
            options: [
              { id: "A", text: "A compilation error occurs ('constructor in class cannot be applied to given types')", explanationIfWrong: "" },
              { id: "B", text: "The superclass fields are initialized to null and 0 silently", explanationIfWrong: "The compiler rejects the code." },
              { id: "C", text: "A runtime NullPointerException is thrown", explanationIfWrong: "It fails at compile time, not runtime." },
              { id: "D", text: "Java creates a blank constructor automatically in the superclass", explanationIfWrong: "The compiler only adds a default constructor if NO constructors were declared." }
            ],
            correctAnswer: "A",
            explanationNote: "Because the compiler tries to insert super() without arguments, it fails to compile if no matching constructor exists."
          },
          {
            id: "j9-1-2-alt2",
            question: "Can a constructor contain BOTH 'this(...)' and 'super(...)'?",
            options: [
              { id: "A", text: "No, because both are required to be the very first statement, which is impossible", explanationIfWrong: "" },
              { id: "B", text: "Yes, separated by a semicolon on line 1", explanationIfWrong: "Only one can be the first statement." },
              { id: "C", text: "Yes, in Java 21 only", explanationIfWrong: "It is illegal in all Java versions." },
              { id: "D", text: "Only if the class is abstract", explanationIfWrong: "The rule applies to all classes." }
            ],
            correctAnswer: "A",
            explanationNote: "Since both must be the first statement, a constructor can call either another constructor with this(...) OR the superclass with super(...), never both directly."
          }
        ]
      },
      {
        heading: "Method Overriding and @Override Annotation",
        text: "A subclass can override a method inherited from its superclass by providing a method with the exact same name, return type, and parameters. The '@Override' annotation instructs the compiler to verify that the method actually overrides a superclass method, catching accidental spelling mistakes at compile time.",
        codeSnippet: "public class Person {\n    private String name;\n    public Person(String name) { this.name = name; }\n    \n    public String toString() {\n        return this.name;\n    }\n}\n\npublic class Student extends Person {\n    private int credits;\n    public Student(String name) { super(name); this.credits = 0; }\n\n    @Override\n    public String toString() {\n        // Calls Person.toString() and adds credits info:\n        return super.toString() + \" (credits: \" + this.credits + \")\";\n    }\n}",
        terminalOutput: "Person p = new Person(\"Ada\");\nSystem.out.println(p); // Prints \"Ada\"\n\nStudent s = new Student(\"Ada\");\nSystem.out.println(s); // Prints \"Ada (credits: 0)\"",
        tip: "Always use 'super.methodName()' if you want to extend or reuse the parent method's behavior rather than replacing it entirely.",
        warning: "If method parameters differ, you have overloaded the method rather than overridden it!",
        mcq: {
          id: "j9-1-3",
          question: "What is the primary purpose of writing the '@Override' annotation above a method in a subclass?",
          options: [
            { id: "A", text: "It asks the compiler to verify that the method correctly overrides an existing method in a superclass or interface, catching typos at compile time", explanationIfWrong: "" },
            { id: "B", text: "It makes the method execute 50% faster in bytecode", explanationIfWrong: "Annotations do not directly optimize CPU bytecode speed." },
            { id: "C", text: "It allows the method to access private fields of the superclass", explanationIfWrong: "Private fields remain inaccessible regardless of annotations." },
            { id: "D", text: "It prevents other classes from calling the method", explanationIfWrong: "Access modifiers control visibility, not @Override." }
          ],
          correctAnswer: "A",
          explanationNote: "@Override is a compile-time check that guarantees the method signature matches a superclass method exactly."
        },
        questionPool: [
          {
            id: "j9-1-3-alt1",
            question: "What compilation error occurs if you put '@Override' above a method that does NOT exist in the superclass?",
            options: [
              { id: "A", text: "'method does not override or implement a method from a supertype'", explanationIfWrong: "" },
              { id: "B", text: "'NullPointerException'", explanationIfWrong: "It is a compile error, not a runtime exception." },
              { id: "C", text: "'ClassCastException'", explanationIfWrong: "ClassCastException happens at runtime." },
              { id: "D", text: "No error, it compiles normally", explanationIfWrong: "The compiler strictly flags invalid @Override annotations." }
            ],
            correctAnswer: "A",
            explanationNote: "The compiler flags an error because the annotated method fails to override any existing superclass method."
          },
          {
            id: "j9-1-3-alt2",
            question: "How can an overridden method in a subclass invoke the original implementation from its superclass?",
            options: [
              { id: "A", text: "super.methodName()", explanationIfWrong: "" },
              { id: "B", text: "this.methodName()", explanationIfWrong: "this.methodName() recursively calls the overridden method, causing infinite recursion!" },
              { id: "C", text: "parent.methodName()", explanationIfWrong: "'parent' is not a Java keyword." },
              { id: "D", text: "base.methodName()", explanationIfWrong: "'base' is C# syntax; Java uses 'super'." }
            ],
            correctAnswer: "A",
            explanationNote: "'super.methodName()' invokes the superclass version of the method from within the subclass."
          }
        ]
      },
      {
        heading: "Access Modifiers: private vs. protected vs. public",
        text: "In class hierarchies, visibility rules are essential:\n• 'private': Accessible ONLY within the defining class (subclasses CANNOT access private fields directly).\n• 'protected': Accessible within the defining class, package, AND all subclasses.\n• 'public': Accessible everywhere.\nTo access private superclass fields in subclasses, use public/protected getters.",
        codeSnippet: "public class Person {\n    private String secretSsn; // Subclasses cannot access directly!\n    protected String name;     // Subclasses CAN access directly!\n\n    public Person(String name, String ssn) {\n        this.name = name;\n        this.secretSsn = ssn;\n    }\n}\n\npublic class Student extends Person {\n    public Student(String name, String ssn) { super(name, ssn); }\n    public void show() {\n        System.out.println(this.name); // OK: protected\n        // System.out.println(this.secretSsn); // ERROR: private!\n    }\n}",
        terminalOutput: "protected: visible to all subclasses\nprivate: visible only in declaring class",
        tip: "Prefer keeping fields private and providing protected/public methods for clean encapsulation.",
        warning: "Marking fields protected can expose internal implementation details across an entire package.",
        mcq: {
          id: "j9-1-4",
          question: "Can a subclass directly access a 'private' instance variable declared in its superclass?",
          options: [
            { id: "A", text: "No, private fields are strictly hidden from subclasses; the subclass must use public or protected getter methods", explanationIfWrong: "" },
            { id: "B", text: "Yes, subclasses have unrestricted access to all private members", explanationIfWrong: "Private restricts access exclusively to the declaring class." },
            { id: "C", text: "Yes, but only if the subclass is in the same folder", explanationIfWrong: "Package-private allows package access, private never does." },
            { id: "D", text: "Only on Tuesdays", explanationIfWrong: "Access rules are constant." }
          ],
          correctAnswer: "A",
          explanationNote: "Private variables are encapsulated within the class that declared them. Subclasses must call inherited getters."
        },
        questionPool: [
          {
            id: "j9-1-4-alt1",
            question: "Which access modifier allows access within the defining class, its package, AND any subclasses located in different packages?",
            options: [
              { id: "A", text: "protected", explanationIfWrong: "" },
              { id: "B", text: "private", explanationIfWrong: "private is restricted to the declaring class." },
              { id: "C", text: "package-private (default with no modifier)", explanationIfWrong: "Package-private does not allow access from subclasses in different packages." },
              { id: "D", text: "final", explanationIfWrong: "'final' is a non-access modifier that prevents modification." }
            ],
            correctAnswer: "A",
            explanationNote: "'protected' grants access to all subclasses regardless of what package they belong to."
          },
          {
            id: "j9-1-4-alt2",
            question: "What modifier prevents a class from being extended by any subclass?",
            options: [
              { id: "A", text: "final (e.g. public final class String)", explanationIfWrong: "" },
              { id: "B", text: "static", explanationIfWrong: "Classes can be static only when nested." },
              { id: "C", text: "abstract", explanationIfWrong: "abstract classes MUST be extended to be useful." },
              { id: "D", text: "const", explanationIfWrong: "const is an unused reserved keyword in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "Declaring a class 'final' forbids inheritance (e.g. java.lang.String is final and cannot be extended)."
          }
        ]
      },
      {
        heading: "The 'is-a' Relationship and Substitutability",
        text: "Inheritance establishes an 'is-a' relationship: a Student IS-A Person. Because a Student is a Person, a Student object can be assigned to a variable of type Person, stored in an ArrayList<Person>, or passed to any method expecting a Person. This fundamental rule is called the Liskov Substitution Principle.",
        codeSnippet: "// Substitutability:\nPerson person = new Student(\"Ada\", \"London\"); // Perfectly valid!\n\nArrayList<Person> people = new ArrayList<>();\npeople.add(new Person(\"Alice\", \"Helsinki\"));\npeople.add(new Student(\"Ollie\", \"Espoo\")); // Student is a Person!\n\nfor (Person p : people) {\n    System.out.println(p.getName()); // Works for both Person and Student!\n}",
        terminalOutput: "Alice\nOllie",
        tip: "Always ask: 'Is a Dog an Animal?' (Yes -> inheritance). 'Does a Car have an Engine?' (Yes -> composition, NOT inheritance).",
        warning: "Do not use inheritance when classes only share fields but lack a true conceptual 'is-a' relationship.",
        mcq: {
          id: "j9-1-5",
          question: "If class 'Student' extends class 'Person', which of the following assignments is valid in Java?",
          options: [
            { id: "A", text: "Person p = new Student(\"Ada\", \"Main St\");", explanationIfWrong: "" },
            { id: "B", text: "Student s = new Person(\"Ada\", \"Main St\"); // Without casting", explanationIfWrong: "A Person is not necessarily a Student." },
            { id: "C", text: "Person p = new Object();", explanationIfWrong: "An Object is not necessarily a Person." },
            { id: "D", text: "Student s = (Student) new Object();", explanationIfWrong: "This will throw a ClassCastException at runtime." }
          ],
          correctAnswer: "A",
          explanationNote: "Because Student 'is-a' Person, an instance of Student can be referenced by a variable of type Person."
        },
        questionPool: [
          {
            id: "j9-1-5-alt1",
            question: "What design relationship does inheritance model between two classes?",
            options: [
              { id: "A", text: "An 'is-a' relationship (e.g. a Circle is a Shape)", explanationIfWrong: "" },
              { id: "B", text: "A 'has-a' relationship (e.g. a Car has an Engine)", explanationIfWrong: "'has-a' is composition (instance variables), not inheritance." },
              { id: "C", text: "A 'uses-a' relationship exclusively", explanationIfWrong: "'uses-a' is dependency injection or method parameters." },
              { id: "D", text: "A temporal 'happens-before' relationship", explanationIfWrong: "Happens-before is a concurrency memory model concept." }
            ],
            correctAnswer: "A",
            explanationNote: "Inheritance represents an 'is-a' hierarchy. 'has-a' relationships are modeled via composition."
          },
          {
            id: "j9-1-5-alt2",
            question: "If 'Person p = new Student(\"Ada\", \"London\");', can you directly call 'p.study()' without casting?",
            options: [
              { id: "A", text: "No, because the variable type 'Person' does not declare the 'study()' method; the compiler checks methods against the reference type", explanationIfWrong: "" },
              { id: "B", text: "Yes, because the object in memory is a Student", explanationIfWrong: "The compiler only allows methods declared on the variable type." },
              { id: "C", text: "Yes, Java automatically converts reference types", explanationIfWrong: "Explicit casting ((Student) p).study() is required." },
              { id: "D", text: "Only in static methods", explanationIfWrong: "Compiler type checking applies to all methods." }
            ],
            correctAnswer: "A",
            explanationNote: "The compiler restricts callable methods to those defined on the reference variable type (Person)."
          }
        ]
      },
      {
        heading: "Abstract Classes: Incomplete Blueprints",
        text: "An 'abstract class' is a class that cannot be directly instantiated with 'new'. It serves as a base class containing common functionality and can declare 'abstract methods' (methods with no body) that all non-abstract subclasses MUST implement.",
        codeSnippet: "public abstract class Operation {\n    private String name;\n    public Operation(String name) { this.name = name; }\n    public String getName() { return this.name; }\n\n    // Abstract method: Every subclass MUST implement this!\n    public abstract void execute(Scanner scanner);\n}\n\npublic class PlusOperation extends Operation {\n    public PlusOperation() { super(\"Plus\"); }\n\n    @Override\n    public void execute(Scanner scanner) {\n        int a = Integer.parseInt(scanner.nextLine());\n        int b = Integer.parseInt(scanner.nextLine());\n        System.out.println(\"Sum: \" + (a + b));\n    }\n}",
        terminalOutput: "Operation op = new PlusOperation();\nop.execute(scanner); // Executes PlusOperation's logic!",
        tip: "Use abstract classes when several related classes share code and state, but a general instance shouldn't exist.",
        warning: "Attempting to instantiate an abstract class with 'new Operation()' causes a compilation error.",
        mcq: {
          id: "j9-1-6",
          question: "Can an abstract class be instantiated directly using the 'new' keyword (e.g. 'new Shape()')?",
          options: [
            { id: "A", text: "No, abstract classes cannot be instantiated directly; they must be extended by concrete subclasses", explanationIfWrong: "" },
            { id: "B", text: "Yes, but only if it contains no methods", explanationIfWrong: "Abstract classes cannot be instantiated regardless of method count." },
            { id: "C", text: "Yes, if all fields are public", explanationIfWrong: "Modifiers do not allow abstract instantiation." },
            { id: "D", text: "Yes, using the 'super' operator", explanationIfWrong: "'new' cannot instantiate abstract classes." }
          ],
          correctAnswer: "A",
          explanationNote: "Abstract classes are incomplete blueprints and cannot be directly instantiated."
        },
        questionPool: [
          {
            id: "j9-1-6-alt1",
            question: "What must a concrete (non-abstract) subclass do if its superclass contains abstract methods?",
            options: [
              { id: "A", text: "It must implement (override with a method body) every abstract method declared in the superclass", explanationIfWrong: "" },
              { id: "B", text: "It can ignore them completely", explanationIfWrong: "Failing to implement abstract methods causes a compile error." },
              { id: "C", text: "It must delete the abstract methods", explanationIfWrong: "Methods cannot be deleted." },
              { id: "D", text: "It must be declared static", explanationIfWrong: "Static is unrelated to abstract method implementation." }
            ],
            correctAnswer: "A",
            explanationNote: "A concrete subclass must provide implementations for all inherited abstract methods to compile."
          },
          {
            id: "j9-1-6-alt2",
            question: "Can an abstract class have constructors?",
            options: [
              { id: "A", text: "Yes, abstract classes can have constructors that are called by subclass constructors via 'super(...)'", explanationIfWrong: "" },
              { id: "B", text: "No, constructors are forbidden in abstract classes", explanationIfWrong: "Abstract classes can and frequently do have constructors." },
              { id: "C", text: "Only if they are private", explanationIfWrong: "Constructors are typically public or protected." },
              { id: "D", text: "Only in interfaces", explanationIfWrong: "Interfaces cannot have constructors at all." }
            ],
            correctAnswer: "A",
            explanationNote: "Abstract class constructors initialize inherited instance variables when subclasses invoke super(...)."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 9.2: Interfaces
  // -------------------------------------------------------------
  {
    id: "9-2-interfaces",
    number: "9.2",
    title: "Interfaces",
    subtitle: "Interface definitions, implements keyword, multiple interfaces, and interface references.",
    readTime: "25 min",
    objectives: [
      "Define interfaces as behavioral contracts using the 'interface' keyword",
      "Implement interfaces in classes using the 'implements' keyword",
      "Implement multiple interfaces in a single class separated by commas",
      "Use interface types for variable declarations and method parameter types",
      "Store diverse classes implementing the same interface inside a single collection",
      "Understand standard Java interfaces: Readable, Comparable<T>, CharSequence, List"
    ],
    theoryBlocks: [
      {
        heading: "Interfaces as Behavioral Contracts",
        text: "An 'interface' defines a contract of behaviors (method signatures) without implementing them. It specifies WHAT a class can do, not HOW it does it. Classes agree to fulfill this contract using the 'implements' keyword and must provide public implementations for all interface methods.",
        codeSnippet: "// Interface definition:\npublic interface Readable {\n    String read(); // Method signature with no body!\n}\n\n// Class fulfilling the contract:\npublic class Book implements Readable {\n    private String content;\n    public Book(String content) { this.content = content; }\n\n    @Override\n    public String read() {\n        return this.content;\n    }\n}",
        terminalOutput: "Readable r = new Book(\"Once upon a time...\");\nSystem.out.println(r.read()); // \"Once upon a time...\"",
        tip: "By default, all methods declared in an interface are 'public abstract'.",
        warning: "A class implementing an interface must declare its implementation methods as 'public'.",
        mcq: {
          id: "j9-2-1",
          question: "Which keyword does a class use to declare that it fulfills an interface contract?",
          options: [
            { id: "A", text: "implements", explanationIfWrong: "" },
            { id: "B", text: "extends", explanationIfWrong: "'extends' is for extending a superclass or an interface extending another interface." },
            { id: "C", text: "inherits", explanationIfWrong: "'inherits' is not a keyword." },
            { id: "D", text: "uses", explanationIfWrong: "'uses' is not a Java keyword." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'implements' keyword declares that a class will provide implementations for the methods in an interface."
        },
        questionPool: [
          {
            id: "j9-2-1-alt1",
            question: "Can an interface have instance variables (e.g. private int x;)?",
            options: [
              { id: "A", text: "No, interfaces cannot store instance state; any fields declared in an interface are automatically public static final constants", explanationIfWrong: "" },
              { id: "B", text: "Yes, any instance variables are allowed", explanationIfWrong: "Interfaces do not have instance state." },
              { id: "C", text: "Only boolean variables", explanationIfWrong: "Fields in interfaces are always public static final." },
              { id: "D", text: "Yes, but they must be private", explanationIfWrong: "Interface fields cannot be private (until private static in Java 9 for internal constants)." }
            ],
            correctAnswer: "A",
            explanationNote: "Interfaces define behavior contracts, not state. Any variables declared in an interface are public, static, and final constants."
          },
          {
            id: "j9-2-1-alt2",
            question: "What access level must methods implementing an interface have in the implementing class?",
            options: [
              { id: "A", text: "public, because interface methods are public and visibility cannot be reduced", explanationIfWrong: "" },
              { id: "B", text: "private", explanationIfWrong: "Reducing visibility from public to private causes a compile error." },
              { id: "C", text: "protected", explanationIfWrong: "Protected also reduces visibility from public." },
              { id: "D", text: "package-private", explanationIfWrong: "It must be explicitly marked public." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, an overriding method cannot reduce the visibility of the method it implements; interface methods are public."
          }
        ]
      },
      {
        heading: "Implementing Multiple Interfaces",
        text: "While Java permits extending only one single class, a class can implement as many interfaces as needed, separated by commas. This allows a class to satisfy multiple diverse contracts simultaneously.",
        codeSnippet: "public interface Identifiable {\n    String getId();\n}\n\npublic interface Packable {\n    double weight();\n}\n\n// Implementing two interfaces simultaneously:\npublic class Book implements Identifiable, Packable {\n    private String isbn;\n    private double weight;\n\n    public Book(String isbn, double weight) {\n        this.isbn = isbn;\n        this.weight = weight;\n    }\n\n    @Override\n    public String getId() { return this.isbn; }\n\n    @Override\n    public double weight() { return this.weight; }\n}",
        terminalOutput: "Book satisfies both Identifiable and Packable contracts!",
        tip: "Multiple interface implementation gives Java the flexibility of multiple behavioral roles without the complexity of multiple class inheritance.",
        warning: "The implementing class must implement all abstract methods from all implemented interfaces.",
        mcq: {
          id: "j9-2-2",
          question: "Can a single Java class implement multiple interfaces?",
          options: [
            { id: "A", text: "Yes, a class can implement any number of interfaces separated by commas (e.g. implements A, B, C)", explanationIfWrong: "" },
            { id: "B", text: "No, a class can only implement one interface", explanationIfWrong: "Classes can implement unlimited interfaces." },
            { id: "C", text: "Only if all interfaces have the exact same methods", explanationIfWrong: "Interfaces usually declare completely different methods." },
            { id: "D", text: "Only in abstract classes", explanationIfWrong: "Any concrete or abstract class can implement multiple interfaces." }
          ],
          correctAnswer: "A",
          explanationNote: "Java allows a class to implement multiple interfaces, cleanly supporting multiple behavioral capabilities."
        },
        questionPool: [
          {
            id: "j9-2-2-alt1",
            question: "Can an interface extend another interface?",
            options: [
              { id: "A", text: "Yes, an interface can extend one or more other interfaces using 'extends'", explanationIfWrong: "" },
              { id: "B", text: "No, interfaces cannot be extended", explanationIfWrong: "Interface inheritance is fully supported." },
              { id: "C", text: "Interfaces use 'implements' to inherit other interfaces", explanationIfWrong: "Interfaces use 'extends' when inheriting from other interfaces." },
              { id: "D", text: "Only if both interfaces are empty", explanationIfWrong: "They can have any method declarations." }
            ],
            correctAnswer: "A",
            explanationNote: "Interfaces inherit from other interfaces using the 'extends' keyword, and an interface can extend multiple interfaces."
          },
          {
            id: "j9-2-2-alt2",
            question: "Which of the following class declarations correctly extends a class AND implements two interfaces?",
            options: [
              { id: "A", text: "public class Student extends Person implements Readable, Identifiable", explanationIfWrong: "" },
              { id: "B", text: "public class Student implements Readable extends Person", explanationIfWrong: "'extends' must precede 'implements'." },
              { id: "C", text: "public class Student extends Person, Readable, Identifiable", explanationIfWrong: "'extends' is only for the single superclass." },
              { id: "D", text: "public class Student implements Person, Readable, Identifiable", explanationIfWrong: "Person is a class, not an interface." }
            ],
            correctAnswer: "A",
            explanationNote: "The syntax order is: 'class Name extends SuperClass implements Interface1, Interface2'."
          }
        ]
      },
      {
        heading: "Interface as a Variable and Parameter Type",
        text: "You can declare a variable or method parameter whose type is an interface. Any object whose class implements that interface can be assigned to that variable. This decouples code: methods depend on what an object can DO, not what specific class it IS.",
        codeSnippet: "// Method accepts ANY Readable (Book, SMSMessage, Article, etc.):\npublic void printReadable(Readable readable) {\n    System.out.println(readable.read());\n}\n\n// Calling with different concrete classes:\nReadable book = new Book(\"Java Complete\");\nReadable text = new TextMessage(\"Hello!\");\n\nprintReadable(book);\nprintReadable(text);",
        terminalOutput: "Java Complete\nHello!",
        tip: "Always program to an interface, not an implementation (e.g. use 'List<String> list = new ArrayList<>()').",
        warning: "When using an interface reference, you can only call methods declared in that interface.",
        mcq: {
          id: "j9-2-3",
          question: "Why is declaring 'List<String> names = new ArrayList<>();' preferred over 'ArrayList<String> names = new ArrayList<>();' in professional Java?",
          options: [
            { id: "A", text: "Programming to the 'List' interface decouples code, allowing the implementation to be swapped (e.g. to LinkedList) without changing downstream code", explanationIfWrong: "" },
            { id: "B", text: "Because List consumes 0 bytes of RAM", explanationIfWrong: "The underlying object is still an ArrayList in heap memory." },
            { id: "C", text: "Because ArrayList is deprecated in Java", explanationIfWrong: "ArrayList is actively used and supported." },
            { id: "D", text: "To prevent adding items to the list", explanationIfWrong: "List declares add(), get(), size(), and all standard collection methods." }
          ],
          correctAnswer: "A",
          explanationNote: "Programming to interfaces maximizes flexibility and loose coupling."
        },
        questionPool: [
          {
            id: "j9-2-3-alt1",
            question: "If 'Readable r = new Book(\"Title\", 300);' is declared, can you call 'r.getPages()' if 'getPages()' is only in Book and NOT in Readable?",
            options: [
              { id: "A", text: "No, because the compiler only allows invoking methods declared on the reference type (Readable)", explanationIfWrong: "" },
              { id: "B", text: "Yes, because the object in memory is a Book", explanationIfWrong: "The compiler restricts method calls to the reference type." },
              { id: "C", text: "Yes, Java automatically casts interfaces to classes", explanationIfWrong: "Explicit casting ((Book) r).getPages() is required." },
              { id: "D", text: "Only inside static methods", explanationIfWrong: "Compiler type checking applies universally." }
            ],
            correctAnswer: "A",
            explanationNote: "The compiler only checks the methods available on the interface type 'Readable'."
          },
          {
            id: "j9-2-3-alt2",
            question: "How can you call 'getPages()' on 'Readable r' if you know r is guaranteed to be a Book?",
            options: [
              { id: "A", text: "((Book) r).getPages() — using an explicit type cast", explanationIfWrong: "" },
              { id: "B", text: "r.asBook().getPages()", explanationIfWrong: "asBook() is not an interface method." },
              { id: "C", text: "r->getPages()", explanationIfWrong: "-> is C++ pointer or Java lambda syntax." },
              { id: "D", text: "Book.getPages(r)", explanationIfWrong: "getPages is an instance method." }
            ],
            correctAnswer: "A",
            explanationNote: "Explicit casting ((Book) r) tells the compiler to treat the reference as a Book."
          }
        ]
      },
      {
        heading: "Collections of Interface Types",
        text: "Collections can store interface types: 'ArrayList<Packable> box = new ArrayList<>();'. You can add Books, CDs, Chocolates, and any other object into this list as long as their classes implement 'Packable'. You can iterate over them and call interface methods uniformly.",
        codeSnippet: "public class Box {\n    private double maxCapacity;\n    private ArrayList<Packable> items = new ArrayList<>();\n\n    public Box(double maxCapacity) { this.maxCapacity = maxCapacity; }\n\n    public void add(Packable item) {\n        if (this.weight() + item.weight() <= maxCapacity) {\n            this.items.add(item);\n        }\n    }\n\n    public double weight() {\n        double total = 0;\n        for (Packable p : this.items) total += p.weight();\n        return total;\n    }\n}",
        terminalOutput: "Box contains Books and CDs.\nTotal weight calculated uniformly across all Packable items!",
        tip: "Box doesn't need to know whether an item is a Book, CD, or Furniture; it only needs to know that each item has a '.weight()' method.",
        warning: "Heterogeneous collections are type-safe as long as they are unified by a common interface.",
        mcq: {
          id: "j9-2-4",
          question: "How does storing interface types in an 'ArrayList<Packable>' promote clean software architecture?",
          options: [
            { id: "A", text: "It allows diverse, unrelated classes (Book, CD, Furniture) to be stored in the same collection and processed uniformly without modifying the Box class", explanationIfWrong: "" },
            { id: "B", text: "It converts all stored items into raw text strings", explanationIfWrong: "Objects remain distinct typed instances in memory." },
            { id: "C", text: "It restricts the list to exactly 10 items", explanationIfWrong: "ArrayList capacity is dynamic." },
            { id: "D", text: "It eliminates the need for constructors", explanationIfWrong: "Classes still require constructors." }
          ],
          correctAnswer: "A",
          explanationNote: "The Open-Closed Principle: Box is open to new packable items without modifying Box's source code."
        },
        questionPool: [
          {
            id: "j9-2-4-alt1",
            question: "Can a Box class that implements Packable be added inside another Box?",
            options: [
              { id: "A", text: "Yes! Because Box implements Packable, boxes can be nested inside other boxes recursively (Composite pattern)", explanationIfWrong: "" },
              { id: "B", text: "No, Java forbids recursive collections", explanationIfWrong: "Composite object hierarchies are standard in OOP." },
              { id: "C", text: "Only if the inner box is empty", explanationIfWrong: "The inner box computes its own weight, which adds to the outer box." },
              { id: "D", text: "It causes an infinite compile loop", explanationIfWrong: "It compiles and runs cleanly." }
            ],
            correctAnswer: "A",
            explanationNote: "By implementing Packable, a Box becomes packable itself, enabling nested packaging."
          },
          {
            id: "j9-2-4-alt2",
            question: "What built-in Java interface allows sorting a collection with Collections.sort()?",
            options: [
              { id: "A", text: "Comparable<T>", explanationIfWrong: "" },
              { id: "B", text: "Sortable", explanationIfWrong: "Sortable does not exist in java.lang." },
              { id: "C", text: "Orderable", explanationIfWrong: "Orderable does not exist." },
              { id: "D", text: "Iterator", explanationIfWrong: "Iterator is for stepping through collections, not sorting." }
            ],
            correctAnswer: "A",
            explanationNote: "Comparable<T> declares compareTo(T other) and is the standard interface for natural sorting."
          }
        ]
      },
      {
        heading: "Default and Static Methods in Interfaces (Java 8+)",
        text: "Since Java 8, interfaces can contain 'default' methods (methods with a concrete implementation body) and 'static' utility methods. Default methods allow library developers to add new methods to existing interfaces without breaking backward compatibility for older implementing classes.",
        codeSnippet: "public interface Greeter {\n    // Abstract method (mandatory implementation):\n    String getName();\n\n    // Default method (subclasses can use or override):\n    default void greet() {\n        System.out.println(\"Hello, \" + getName() + \"!\");\n    }\n\n    // Static utility method:\n    static void printHelp() {\n        System.out.println(\"Greeter interface v2.0\");\n    }\n}",
        terminalOutput: "Greeter.printHelp(); // Calls static method\nuser.greet(); // Calls default method",
        tip: "Default methods use the 'default' keyword and must provide a method body enclosed in curly braces.",
        warning: "Default methods cannot access instance variables because interfaces do not possess instance state.",
        mcq: {
          id: "j9-2-5",
          question: "Why were 'default methods' introduced into Java interfaces in Java 8?",
          options: [
            { id: "A", text: "To allow adding new methods to interfaces without breaking binary compatibility with existing classes that implement the interface", explanationIfWrong: "" },
            { id: "B", text: "To replace abstract classes completely", explanationIfWrong: "Abstract classes are still used for stateful inheritance." },
            { id: "C", text: "To remove the 'public' keyword from Java", explanationIfWrong: "public is still fundamental." },
            { id: "D", text: "To make interfaces run in C++", explanationIfWrong: "Java features are for the JVM." }
          ],
          correctAnswer: "A",
          explanationNote: "Default methods allowed adding methods like forEach() and stream() to Collection without breaking existing code."
        },
        questionPool: [
          {
            id: "j9-2-5-alt1",
            question: "How do you invoke a static method declared inside an interface named 'MathUtils'?",
            options: [
              { id: "A", text: "MathUtils.methodName()", explanationIfWrong: "" },
              { id: "B", text: "new MathUtils().methodName()", explanationIfWrong: "Interfaces cannot be instantiated." },
              { id: "C", text: "this.methodName()", explanationIfWrong: "Interface static methods are invoked on the interface name." },
              { id: "D", text: "super.methodName()", explanationIfWrong: "super is for superclasses." }
            ],
            correctAnswer: "A",
            explanationNote: "Interface static methods are called directly on the interface name: InterfaceName.method()."
          },
          {
            id: "j9-2-5-alt2",
            question: "Can a class implementing an interface override a default method provided by that interface?",
            options: [
              { id: "A", text: "Yes, implementing classes can choose to override default methods with their own customized implementation", explanationIfWrong: "" },
              { id: "B", text: "No, default methods are strictly final", explanationIfWrong: "Default methods are open for overriding unless marked final (which is not allowed in interfaces)." },
              { id: "C", text: "Only if the class is abstract", explanationIfWrong: "Any implementing class can override default methods." },
              { id: "D", text: "Only with super() syntax", explanationIfWrong: "It overrides normally with @Override." }
            ],
            correctAnswer: "A",
            explanationNote: "Default methods provide a fallback that any implementing class can override if needed."
          }
        ]
      },
      {
        heading: "Functional Interfaces & Lambdas",
        text: "A 'functional interface' is an interface that contains EXACTLY ONE abstract method (Single Abstract Method or SAM). It can be annotated with '@FunctionalInterface'. Because it has only one method, it can be implemented concisely using lambda expressions '() -> { ... }'.",
        codeSnippet: "@FunctionalInterface\npublic interface Condition {\n    boolean test(int number);\n}\n\n// Traditional implementation vs. Lambda:\n// Traditional: new Condition() { public boolean test(int n) { return n > 0; } }\n\n// Modern Lambda Expression:\nCondition isPositive = n -> n > 0;\nSystem.out.println(isPositive.test(5));  // true\nSystem.out.println(isPositive.test(-3)); // false",
        terminalOutput: "Lambda evaluation:\nisPositive.test(5) -> true\nisPositive.test(-3) -> false",
        tip: "Standard functional interfaces in java.util.function include: Predicate<T>, Consumer<T>, Function<T, R>, and Supplier<T>.",
        warning: "If an interface declares two abstract methods, it CANNOT be used as a lambda target.",
        mcq: {
          id: "j9-2-6",
          question: "What is the defining requirement for an interface to be considered a 'Functional Interface' in Java?",
          options: [
            { id: "A", text: "It must have exactly one abstract method", explanationIfWrong: "" },
            { id: "B", text: "It must have at least 10 methods", explanationIfWrong: "It must have exactly one abstract method." },
            { id: "C", text: "It cannot have any default methods", explanationIfWrong: "It can have multiple default and static methods, as long as it has only ONE abstract method." },
            { id: "D", text: "It must be declared inside a method", explanationIfWrong: "Functional interfaces can be declared anywhere." }
          ],
          correctAnswer: "A",
          explanationNote: "The Single Abstract Method (SAM) rule is the foundation of functional interfaces and lambda expressions in Java."
        },
        questionPool: [
          {
            id: "j9-2-6-alt1",
            question: "Which built-in functional interface in java.util.function accepts an argument and returns a boolean?",
            options: [
              { id: "A", text: "Predicate<T>", explanationIfWrong: "" },
              { id: "B", text: "Consumer<T>", explanationIfWrong: "Consumer accepts an argument and returns void." },
              { id: "C", text: "Supplier<T>", explanationIfWrong: "Supplier takes no arguments and returns a value." },
              { id: "D", text: "Function<T, R>", explanationIfWrong: "Function maps T to any R, Predicate specifically returns boolean." }
            ],
            correctAnswer: "A",
            explanationNote: "Predicate<T> defines boolean test(T t) and represents a boolean-valued function."
          },
          {
            id: "j9-2-6-alt2",
            question: "What is the syntax for a lambda taking two integers (a, b) and returning their sum?",
            options: [
              { id: "A", text: "(a, b) -> a + b", explanationIfWrong: "" },
              { id: "B", text: "(a, b) => a + b", explanationIfWrong: "=> is JavaScript; Java uses ->." },
              { id: "C", text: "lambda(a, b) { a + b }", explanationIfWrong: "Python uses lambda keyword; Java uses -> arrow." },
              { id: "D", text: "a + b -> (a, b)", explanationIfWrong: "Parameters precede the arrow." }
            ],
            correctAnswer: "A",
            explanationNote: "Java lambda syntax uses parameter list + single arrow -> + expression: (a, b) -> a + b."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 9.3: Polymorphism
  // -------------------------------------------------------------
  {
    id: "9-3-polymorphism",
    number: "9.3",
    title: "Polymorphism",
    subtitle: "Dynamic method dispatch, runtime type resolution, instanceof operator, and safe downcasting.",
    readTime: "25 min",
    objectives: [
      "Understand polymorphism (Greek: 'many forms') and dynamic method dispatch at runtime",
      "Trace how Java executes the method of the actual object in memory rather than the reference type",
      "Write flexible methods that operate on superclass or interface abstractions",
      "Check object types safely using the 'instanceof' operator before casting",
      "Use Java 16+ pattern matching for instanceof (e.g. 'if (obj instanceof Book b)')",
      "Avoid ClassCastException through proper type checking"
    ],
    theoryBlocks: [
      {
        heading: "Dynamic Method Dispatch (Runtime Polymorphism)",
        text: "Polymorphism means 'many forms'. In Java, when a method is called on an object through a superclass or interface reference, Java determines WHICH method implementation to execute at RUNTIME based on the actual object created in Heap memory, NOT the reference type! This is called Dynamic Method Dispatch.",
        codeSnippet: "public class Animal {\n    public void speak() {\n        System.out.println(\"Animal sound\");\n    }\n}\n\npublic class Dog extends Animal {\n    @Override\n    public void speak() {\n        System.out.println(\"Woof!\");\n    }\n}\n\n// Polymorphism in action:\nAnimal a = new Dog(); // Reference is Animal, Object is Dog!\na.speak(); // Prints \"Woof!\" (Dog's method is dispatched at runtime!)",
        terminalOutput: "Dynamic Dispatch:\na.speak() -> Output: \"Woof!\"",
        tip: "Dynamic dispatch allows you to write code that interacts with abstract concepts, and the right specific code runs automatically.",
        warning: "Field access in Java is NOT polymorphic: only instance methods are dispatched dynamically.",
        mcq: {
          id: "j9-3-1",
          question: "Given 'Animal a = new Dog();', what output is printed when 'a.speak()' is executed if Dog overrides speak()?",
          options: [
            { id: "A", text: "\"Woof!\" — Java dynamically dispatches the method of the actual object in memory (Dog)", explanationIfWrong: "" },
            { id: "B", text: "\"Animal sound\" — because the variable type is Animal", explanationIfWrong: "Java uses runtime dynamic dispatch for instance methods." },
            { id: "C", text: "Both \"Animal sound\" and \"Woof!\"", explanationIfWrong: "Only the overriding method runs." },
            { id: "D", text: "A compilation error occurs", explanationIfWrong: "The code is completely valid polymorphism." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, instance method calls are resolved at runtime according to the actual object type in memory."
        },
        questionPool: [
          {
            id: "j9-3-1-alt1",
            question: "Which of the following cannot be overridden polymorphically in Java?",
            options: [
              { id: "A", text: "Static methods and private methods", explanationIfWrong: "" },
              { id: "B", text: "Public instance methods", explanationIfWrong: "Public instance methods are fully polymorphic." },
              { id: "C", text: "Protected instance methods", explanationIfWrong: "Protected instance methods are polymorphic." },
              { id: "D", text: "Methods in subclasses", explanationIfWrong: "Subclass methods participate in inheritance." }
            ],
            correctAnswer: "A",
            explanationNote: "Static methods are bound at compile time based on class names; private methods are not inherited or polymorphic."
          },
          {
            id: "j9-3-1-alt2",
            question: "What is the technical term for the JVM mechanism that selects the method to execute at runtime?",
            options: [
              { id: "A", text: "Dynamic Method Dispatch", explanationIfWrong: "" },
              { id: "B", text: "Static Compilation Inversion", explanationIfWrong: "This is not a real Java term." },
              { id: "C", text: "Bytecode Decoupling", explanationIfWrong: "Not a JVM dispatch term." },
              { id: "D", text: "Garbage Rebinding", explanationIfWrong: "Garbage collection manages memory, not method dispatch." }
            ],
            correctAnswer: "A",
            explanationNote: "Dynamic method dispatch is how the JVM resolves virtual method calls at runtime."
          }
        ]
      },
      {
        heading: "Polymorphic Collections and Parameters",
        text: "Polymorphism shines when processing collections of heterogeneous objects. A single loop over 'ArrayList<Animal>' can invoke 'speak()' on Dogs, Cats, Birds, and Cows. Each animal makes its own unique sound without a single if-else statement!",
        codeSnippet: "ArrayList<Animal> sanctuary = new ArrayList<>();\nsanctuary.add(new Dog());\nsanctuary.add(new Cat());\nsanctuary.add(new Cow());\n\nfor (Animal a : sanctuary) {\n    a.speak(); // Each responds with its own voice!\n}",
        terminalOutput: "Woof!\nMeow!\nMoo!",
        tip: "If you find yourself writing 'if (type == DOG) ... else if (type == CAT)', replace it with a polymorphic method call!",
        warning: "Never use type flags or switches when polymorphism can handle the behavioral variation cleanly.",
        mcq: {
          id: "j9-3-2",
          question: "What major code smell is eliminated by using polymorphism in object-oriented programs?",
          options: [
            { id: "A", text: "Long chains of if-else or switch statements checking object types or type flags", explanationIfWrong: "" },
            { id: "B", text: "Memory leaks in garbage collection", explanationIfWrong: "Polymorphism is an architectural pattern, not GC tuning." },
            { id: "C", text: "The need to write unit tests", explanationIfWrong: "Polymorphic classes still require thorough unit testing." },
            { id: "D", text: "Having to use constructors", explanationIfWrong: "Constructors are still required." }
          ],
          correctAnswer: "A",
          explanationNote: "Polymorphism replaces brittle if-else type checks with dynamic dispatch, adhering to the Open-Closed Principle."
        },
        questionPool: [
          {
            id: "j9-3-2-alt1",
            question: "How do you add a new Animal (e.g. 'Duck') to the animal sanctuary without changing the sanctuary loop code?",
            options: [
              { id: "A", text: "Create class Duck extending Animal and override speak(); the loop processes it automatically", explanationIfWrong: "" },
              { id: "B", text: "Rewrite the sanctuary class completely", explanationIfWrong: "Polymorphism avoids modifying existing runner code." },
              { id: "C", text: "Add an if-condition inside the loop", explanationIfWrong: "No if-conditions are needed." },
              { id: "D", text: "Recompile the Java Virtual Machine", explanationIfWrong: "JVM requires no changes." }
            ],
            correctAnswer: "A",
            explanationNote: "New subclasses seamlessly integrate into existing polymorphic loops without any edits to caller code."
          },
          {
            id: "j9-3-2-alt2",
            question: "What principle states that software entities should be open for extension but closed for modification?",
            options: [
              { id: "A", text: "Open-Closed Principle (OCP)", explanationIfWrong: "" },
              { id: "B", text: "Single Responsibility Principle", explanationIfWrong: "SRP is about one reason to change." },
              { id: "C", text: "Interface Segregation Principle", explanationIfWrong: "ISP is about small client-specific interfaces." },
              { id: "D", text: "Dependency Inversion Principle", explanationIfWrong: "DIP is about depending on abstractions." }
            ],
            correctAnswer: "A",
            explanationNote: "The Open-Closed Principle states classes should allow new behavior (open) without editing existing code (closed)."
          }
        ]
      },
      {
        heading: "The 'instanceof' Type Check Operator",
        text: "The 'instanceof' operator tests whether an object is an instance of a specific class or interface. It evaluates to true if the object is of that type or any of its subclasses. If the reference is null, 'instanceof' safely returns false without throwing an exception.",
        codeSnippet: "Animal a = new Dog();\n\nSystem.out.println(a instanceof Dog);    // true\nSystem.out.println(a instanceof Animal); // true (Dog is an Animal!)\nSystem.out.println(a instanceof Cat);    // false\n\nAnimal nullAnimal = null;\nSystem.out.println(nullAnimal instanceof Dog); // false (null safe!)",
        terminalOutput: "instanceof checks:\na is Dog: true\na is Animal: true\na is Cat: false\nnull is Dog: false",
        tip: "'instanceof' safely checks null references without throwing NullPointerException.",
        warning: "Use instanceof sparingly; overusing it in business logic usually indicates that polymorphism should have been used instead.",
        mcq: {
          id: "j9-3-3",
          question: "What does 'obj instanceof MyClass' evaluate to if 'obj' is null?",
          options: [
            { id: "A", text: "false, safely without throwing any exception", explanationIfWrong: "" },
            { id: "B", text: "true", explanationIfWrong: "null is not an instance of any class." },
            { id: "C", text: "Throws a NullPointerException", explanationIfWrong: "instanceof is specifically designed to be null-safe." },
            { id: "D", text: "Throws a ClassCastException", explanationIfWrong: "No exception is thrown." }
          ],
          correctAnswer: "A",
          explanationNote: "By language definition, any reference containing null evaluates to false when checked with instanceof."
        },
        questionPool: [
          {
            id: "j9-3-3-alt1",
            question: "If class 'Dog extends Animal', will 'new Dog() instanceof Animal' evaluate to true?",
            options: [
              { id: "A", text: "Yes, because a Dog is an instance of Animal via inheritance", explanationIfWrong: "" },
              { id: "B", text: "No, only 'instanceof Dog' is true", explanationIfWrong: "instanceof evaluates to true for all superclasses and implemented interfaces." },
              { id: "C", text: "Only if Animal is an interface", explanationIfWrong: "It works for both classes and interfaces." },
              { id: "D", text: "Only if Animal is abstract", explanationIfWrong: "It works for concrete and abstract classes." }
            ],
            correctAnswer: "A",
            explanationNote: "instanceof returns true for the object's class, all its superclasses, and all interfaces it implements."
          },
          {
            id: "j9-3-3-alt2",
            question: "Can 'instanceof' check if an object implements an interface?",
            options: [
              { id: "A", text: "Yes (e.g. 'book instanceof Packable' returns true if Book implements Packable)", explanationIfWrong: "" },
              { id: "B", text: "No, instanceof only works on classes", explanationIfWrong: "instanceof works seamlessly with interfaces." },
              { id: "C", text: "Only in Java 21", explanationIfWrong: "It has worked with interfaces since Java 1.0." },
              { id: "D", text: "Only for java.io.Serializable", explanationIfWrong: "It works with all interfaces." }
            ],
            correctAnswer: "A",
            explanationNote: "instanceof verifies whether an object implements a given interface."
          }
        ]
      },
      {
        heading: "Pattern Matching for instanceof (Java 16+)",
        text: "In older Java, checking type and casting required two redundant steps: 'if (obj instanceof Book) { Book b = (Book) obj; ... }'. In modern Java, 'Pattern Matching for instanceof' combines the check and the cast into a single clean statement: 'if (obj instanceof Book b) { ... }'. The variable 'b' is automatically cast and in scope!",
        codeSnippet: "// OLD STYLE (Verbose & redundant):\nif (obj instanceof Book) {\n    Book b = (Book) obj; // Manual downcast\n    System.out.println(b.getAuthor());\n}\n\n// MODERN STYLE (Java 16+ Pattern Matching):\nif (obj instanceof Book b) {\n    // 'b' is already of type Book!\n    System.out.println(b.getAuthor());\n}",
        terminalOutput: "Modern Java pattern matching:\nCleaner, safer, and zero redundant casting!",
        tip: "Pattern matching for instanceof eliminates boilerplate casts and makes equals() implementations much shorter.",
        warning: "The pattern variable is only in scope where the pattern match is guaranteed to have succeeded.",
        mcq: {
          id: "j9-3-4",
          question: "What is the primary advantage of Pattern Matching for instanceof in modern Java ('if (obj instanceof Book b)')?",
          options: [
            { id: "A", text: "It combines the type check and the cast into a single statement, creating a typed variable 'b' and eliminating manual downcasting boilerplate", explanationIfWrong: "" },
            { id: "B", text: "It converts Book into an interface", explanationIfWrong: "Book remains a class." },
            { id: "C", text: "It forces the JVM to execute in single-threaded mode", explanationIfWrong: "It is pure language syntax improvement." },
            { id: "D", text: "It prevents Book from throwing checked exceptions", explanationIfWrong: "Exception rules are unchanged." }
          ],
          correctAnswer: "A",
          explanationNote: "Pattern matching for instanceof combines the instanceof check and assignment into a single safe operation."
        },
        questionPool: [
          {
            id: "j9-3-4-alt1",
            question: "In 'if (obj instanceof Book b)', what is the compile-time type of variable 'b'?",
            options: [
              { id: "A", text: "Book", explanationIfWrong: "" },
              { id: "B", text: "Object", explanationIfWrong: "obj is Object, but b is Book." },
              { id: "C", text: "Class", explanationIfWrong: "b is a Book reference." },
              { id: "D", text: "var", explanationIfWrong: "b has the explicit type Book." }
            ],
            correctAnswer: "A",
            explanationNote: "The pattern variable 'b' is statically typed as Book within the conditional block."
          },
          {
            id: "j9-3-4-alt2",
            question: "Can pattern matching for instanceof be combined with additional conditions using &&?",
            options: [
              { id: "A", text: "Yes: 'if (obj instanceof Book b && b.getPages() > 100)'", explanationIfWrong: "" },
              { id: "B", text: "No, no additional conditions are allowed in an if statement with instanceof", explanationIfWrong: "b is in scope for the subsequent && conditions." },
              { id: "C", text: "Only with || (OR)", explanationIfWrong: "|| cannot be used because b might not have been matched." },
              { id: "D", text: "Only inside switch expressions", explanationIfWrong: "It works in standard if statements." }
            ],
            correctAnswer: "A",
            explanationNote: "Because short-circuit && only evaluates the right side if the pattern matches, 'b' is safely accessible on the right."
          }
        ]
      },
      {
        heading: "Downcasting and ClassCastException",
        text: "Assigning a superclass reference to a subclass variable is called 'downcasting' and requires an explicit cast: '(Student) person'. If the object in memory is NOT actually an instance of the target subclass, the JVM will throw a 'ClassCastException' at runtime! Always verify with 'instanceof' before downcasting.",
        codeSnippet: "Person person = new Person(\"John\", \"Main St\");\n\n// UNSAFE: Throws ClassCastException!\n// Student s = (Student) person; // John is NOT a Student in memory!\n\n// SAFE:\nif (person instanceof Student s) {\n    s.study();\n} else {\n    System.out.println(\"Not a student; cannot call study()!\");\n}",
        terminalOutput: "Safe type verification avoids:\njava.lang.ClassCastException: Person cannot be cast to Student",
        tip: "Avoid casting whenever possible. If you must cast, always guard with instanceof.",
        warning: "Never downcast blindly without an instanceof check or pattern match.",
        mcq: {
          id: "j9-3-5",
          question: "What exception is thrown at runtime if you attempt to cast a Person object to a Student when the actual object in memory is NOT a Student ('(Student) new Person(...)')?",
          options: [
            { id: "A", text: "ClassCastException", explanationIfWrong: "" },
            { id: "B", text: "NullPointerException", explanationIfWrong: "The object is not null; its type is incompatible." },
            { id: "C", text: "IllegalArgumentException", explanationIfWrong: "Casting failures throw ClassCastException." },
            { id: "D", text: "ArrayIndexOutOfBoundsException", explanationIfWrong: "Arrays are not involved." }
          ],
          correctAnswer: "A",
          explanationNote: "Attempting to downcast an object to a type it does not belong to throws ClassCastException."
        },
        questionPool: [
          {
            id: "j9-3-5-alt1",
            question: "Why does the Java compiler permit '(Student) person' to compile even if 'person' might not be a Student at runtime?",
            options: [
              { id: "A", text: "Because 'person' is of type Person, and a Person could potentially hold a Student at runtime; the compiler defers verification to the JVM", explanationIfWrong: "" },
              { id: "B", text: "Because the compiler ignores all casts", explanationIfWrong: "The compiler rejects casts between completely unrelated types." },
              { id: "C", text: "Because Student and Person have the same name", explanationIfWrong: "They have different names." },
              { id: "D", text: "It is a bug in javac", explanationIfWrong: "It is intentional explicit downcasting semantics." }
            ],
            correctAnswer: "A",
            explanationNote: "Since Student extends Person, the reference could hold a Student, so the cast compiles and is verified at runtime."
          },
          {
            id: "j9-3-5-alt2",
            question: "Will the compiler permit casting between two completely unrelated classes, like '(String) new Integer(5)'?",
            options: [
              { id: "A", text: "No, the compiler immediately rejects it: 'inconvertible types: Integer cannot be converted to String'", explanationIfWrong: "" },
              { id: "B", text: "Yes, it compiles and runs", explanationIfWrong: "Compiler detects that String and Integer have no subtype relationship." },
              { id: "C", text: "It converts 5 into \"5\"", explanationIfWrong: "Casting does not convert data formats." },
              { id: "D", text: "Only in Java 8", explanationIfWrong: "It is rejected in all versions." }
            ],
            correctAnswer: "A",
            explanationNote: "When two classes share no inheritance relationship, the compiler knows the cast can never succeed and rejects it."
          }
        ]
      },
      {
        heading: "Polymorphism with Abstract Syntax Trees (Expressions)",
        text: "A classic application of polymorphism is evaluating mathematical expression trees. An 'Expression' interface defines 'int evaluate()'. A 'Number' class returns its value. An 'Add' class holds two sub-Expressions (left and right) and returns 'left.evaluate() + right.evaluate()'. Complex nested trees compute automatically through recursion!",
        codeSnippet: "public interface Expression {\n    int evaluate();\n}\n\npublic class Number implements Expression {\n    private int val;\n    public Number(int val) { this.val = val; }\n    public int evaluate() { return this.val; }\n}\n\npublic class Add implements Expression {\n    private Expression left, right;\n    public Add(Expression l, Expression r) { this.left = l; this.right = r; }\n    public int evaluate() { return this.left.evaluate() + this.right.evaluate(); }\n}",
        terminalOutput: "// Expression: (3 + 5) + 10\nExpression expr = new Add(new Add(new Number(3), new Number(5)), new Number(10));\nSystem.out.println(expr.evaluate()); // 18",
        tip: "This is the Composite design pattern: individual elements and groups of elements are treated uniformly through the same interface.",
        warning: "Make sure base cases (like Number) return values directly to prevent infinite evaluation loops.",
        mcq: {
          id: "j9-3-6",
          question: "In the Expression tree example, why can an 'Add' expression contain other 'Add' expressions inside its 'left' and 'right' fields?",
          options: [
            { id: "A", text: "Because both fields are typed as the interface 'Expression', which 'Add' itself implements, enabling recursive nesting", explanationIfWrong: "" },
            { id: "B", text: "Because Java loops automatically duplicate code", explanationIfWrong: "It is object composition, not loop duplication." },
            { id: "C", text: "Because Add is declared static", explanationIfWrong: "Add is a normal domain class." },
            { id: "D", text: "Because math requires special GPU instructions", explanationIfWrong: "It is standard object-oriented programming." }
          ],
          correctAnswer: "A",
          explanationNote: "Typed as Expression, fields can hold any Expression implementer (Numbers, Adds, Multiplications), creating arbitrarily deep composite trees."
        },
        questionPool: [
          {
            id: "j9-3-6-alt1",
            question: "What design pattern is exemplified by treating individual objects (Number) and compositions of objects (Add) identically through an interface (Expression)?",
            options: [
              { id: "A", text: "Composite Pattern", explanationIfWrong: "" },
              { id: "B", text: "Singleton Pattern", explanationIfWrong: "Singleton ensures only one instance exists." },
              { id: "C", text: "Factory Pattern", explanationIfWrong: "Factory creates objects." },
              { id: "D", text: "Observer Pattern", explanationIfWrong: "Observer is for event publishing/subscribing." }
            ],
            correctAnswer: "A",
            explanationNote: "The Composite pattern composes objects into tree structures and lets clients treat individual objects and compositions uniformly."
          },
          {
            id: "j9-3-6-alt2",
            question: "What is the result of evaluating: new Add(new Number(4), new Number(7)).evaluate()?",
            options: [
              { id: "A", text: "11", explanationIfWrong: "" },
              { id: "B", text: "47", explanationIfWrong: "It performs integer addition, not string concatenation." },
              { id: "C", text: "0", explanationIfWrong: "It sums 4 + 7 = 11." },
              { id: "D", text: "28", explanationIfWrong: "28 would be multiplication." }
            ],
            correctAnswer: "A",
            explanationNote: "The evaluate() method computes 4 + 7, returning 11."
          }
        ]
      }
    ]
  }
];

// Helper functions for Level Failure, Question Pool Rotation, and Attempt Tracking

export function getActiveQuestionsForLevelPart9(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part9_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart9(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part9_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart9(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part9_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart9(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part9_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart9(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part9_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart9 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart9(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart9 {
  const attemptKey = `dopilot_java_part9_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part9_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part9_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart9(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart9(studentId);
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
