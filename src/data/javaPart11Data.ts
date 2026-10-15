// src/data/javaPart11Data.ts
// Helsinki MOOC Java Programming Part 11: Class Diagrams, Packages, Exceptions, and File Processing

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
  // -------------------------------------------------------------
  // LEVEL 11.1: Class Diagrams and Packages
  // -------------------------------------------------------------
  {
    id: "11-1-diagrams-packages",
    number: "11.1",
    title: "Class Diagrams and Packages",
    subtitle: "UML notation, class relationships, package declarations, importing, and package-private access.",
    readTime: "25 min",
    objectives: [
      "Interpret UML class diagrams including attributes, methods, visibility indicators (+ and -), and constructors",
      "Model inheritance and association relationships accurately using UML arrows",
      "Organize Java source code into hierarchical packages using reverse-domain naming conventions",
      "Import classes from packages with explicit imports and wildcard imports",
      "Understand package-private (default) access visibility versus public, protected, and private",
      "Recognize that subpackages in Java are completely independent packages from their parent namespaces"
    ],
    theoryBlocks: [
      {
        heading: "UML Class Diagram Representation",
        text: `In software engineering, Unified Modeling Language (UML) class diagrams visually describe the structure of a system by showing the system's classes, their attributes, operations (methods), and the relationships among objects.\n\nA class is represented as a rectangle divided into three compartments:\n1. Top compartment: The class name (bold/centered).\n2. Middle compartment: The attributes/variables with their visibility and types, written as: [visibility] name: type (e.g. '- name: String', '- age: int').\n3. Bottom compartment: The methods and constructors, written as: [visibility] methodName(paramName: paramType): returnType (e.g. '+ getName(): String', '+ setAge(age: int): void').\n\nVisibility is denoted by symbols:\n• '+' denotes public (accessible everywhere)\n• '-' denotes private (accessible only within the class)\n• '#' denotes protected (accessible in same package and subclasses)\n• '~' denotes package-private / default (accessible anywhere within the same package).`,
        codeSnippet: `// Representation of a UML class diagram:
// +-------------------------------+
// |             Person            |
// +-------------------------------+
// | - name: String                |
// | - age: int                    |
// +-------------------------------+
// | + Person(name: String)        |
// | + getName(): String           |
// | + getAge(): int               |
// | + celebrateBirthday(): void   |
// +-------------------------------+

public class Person {
    private String name;
    private int age;

    public Person(String name) {
        this.name = name;
        this.age = 0;
    }

    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }

    public void celebrateBirthday() {
        this.age++;
    }
}`,
        terminalOutput: `Person person = new Person("Ada");
person.celebrateBirthday();
System.out.println(person.getName() + " is " + person.getAge());
// Output: Ada is 1`,
        tip: "Notice that in UML diagrams, the variable or parameter name comes first, followed by a colon and the data type. This differs from Java code syntax where the type precedes the name.",
        mcq: {
          id: "11-1-1",
          question: "In a standard UML class diagram, which symbol represents 'private' visibility for an attribute or method?",
          options: [
            { id: "A", text: "The plus sign (+)" },
            { id: "B", text: "The minus sign (-)" },
            { id: "C", text: "The hash symbol (#)" },
            { id: "D", text: "The tilde symbol (~)" }
          ],
          correctAnswer: "B",
          explanationNote: "In UML notation, '-' indicates private, '+' indicates public, '#' represents protected, and '~' represents package-private (default)."
        },
        questionPool: [
          {
            id: "11-1-1-alt",
            question: "How is an attribute 'private double balance;' expressed in UML class diagram notation?",
            options: [
              { id: "A", text: "+ balance: double" },
              { id: "B", text: "- balance: double" },
              { id: "C", text: "private double balance;" },
              { id: "D", text: "# double balance" }
            ],
            correctAnswer: "B",
            explanationNote: "UML uses '- balance: double' where '-' denotes private, followed by attribute name, colon, and type."
          }
        ]
      },
      {
        heading: "Relationships: Inheritance vs Association in UML",
        text: `Classes rarely exist in isolation; they interact and form relationships:\n\n1. Inheritance ('is-a' relationship):\nIn UML, inheritance is drawn with a solid line pointing from the subclass to the superclass with a hollow, closed triangle arrowhead at the superclass end.\nFor interface implementation, a dashed line with a hollow triangle arrowhead is used.\n\n2. Association / Composition ('has-a' relationship):\nWhen a class contains or references an instance of another class (for example, a 'BookClub' containing an 'ArrayList<Person>'), it is an association.\nAn association is drawn as a solid line between the two classes. An open arrow (->) indicates navigability (e.g., BookClub knows its members, but members don't necessarily keep a reference to the club). Cardinality/multiplicity can be specified near the arrow (e.g., '1', '0..*', or '1..*').`,
        codeSnippet: `// Superclass: Engine
// Subclass: TurboEngine extends Engine
// Class Car has an Engine (Composition)

public class Engine {
    private int horsepower;
    public Engine(int hp) { this.horsepower = hp; }
    public int getHorsepower() { return this.horsepower; }
}

public class Car {
    private String model;
    private Engine engine; // Association: Car 'has-a' Engine

    public Car(String model, Engine engine) {
        this.model = model;
        this.engine = engine;
    }
}`,
        terminalOutput: `Car car = new Car("Roadster", new Engine(450));
System.out.println("Car ready with 450hp engine.");`,
        tip: "A solid line with a hollow triangle pointing to a class signifies 'extends'. A dashed line with a hollow triangle pointing to an interface signifies 'implements'.",
        mcq: {
          id: "11-1-2",
          question: "In UML diagrams, what arrowhead visual denotes class inheritance (extends)?",
          options: [
            { id: "A", text: "A solid black diamond at the superclass end" },
            { id: "B", text: "A hollow, closed triangle at the superclass end of a solid line" },
            { id: "C", text: "A simple open arrow pointing to the subclass" },
            { id: "D", text: "A dashed line with a circular endpoint" }
          ],
          correctAnswer: "B",
          explanationNote: "In UML, inheritance is represented by a solid line with a hollow, closed triangle pointing toward the superclass."
        },
        questionPool: [
          {
            id: "11-1-2-alt",
            question: "How is interface realization ('implements') visually distinguished from class inheritance in UML?",
            options: [
              { id: "A", text: "Realization uses a dashed line with a hollow triangle arrowhead instead of a solid line" },
              { id: "B", text: "Realization uses a wavy line with a red square" },
              { id: "C", text: "Realization uses a double solid line with no arrowheads" },
              { id: "D", text: "There is no visual difference in standard UML" }
            ],
            correctAnswer: "A",
            explanationNote: "Interface realization is depicted using a dashed line terminating in a hollow triangle pointing to the interface."
          }
        ]
      },
      {
        heading: "Declaring and Organizing Packages",
        text: `As software projects grow to hundreds or thousands of classes, keeping all classes in the root namespace causes naming collisions and chaos. Java solves this using 'packages'.\n\nA package is a directory-based namespace mechanism. The package declaration must be the very first non-comment statement in a Java source file:\n\npackage mooc.logic;\n\nBy convention, package names are written completely in lowercase letters to avoid confusion with class names. Worldwide conventions use reversed Internet domain names as prefixes to ensure global uniqueness (e.g., 'com.company.project.module' or 'org.helsinki.mooc').\n\nThe folder structure on disk must exactly mirror the package name:\nFor package 'mooc.logic', the file 'ApplicationLogic.java' must physically reside in directory 'mooc/logic/ApplicationLogic.java'.`,
        codeSnippet: `// File: src/mooc/logic/ApplicationLogic.java
package mooc.logic;

import mooc.ui.UserInterface;

public class ApplicationLogic {
    private UserInterface ui;

    public ApplicationLogic(UserInterface ui) {
        this.ui = ui;
    }

    public void execute(int times) {
        for (int i = 0; i < times; i++) {
            System.out.println("Application logic is working");
            this.ui.update();
        }
    }
}`,
        terminalOutput: `// ApplicationLogic.java placed inside directory:
// src/mooc/logic/ApplicationLogic.java`,
        tip: "Package declarations prevent class name conflicts. For example, java.util.Date and java.sql.Date can coexist without conflict because of their distinct package namespaces.",
        mcq: {
          id: "11-1-3",
          question: "Where must the 'package' declaration statement be placed in a Java source file?",
          options: [
            { id: "A", text: "Directly inside the public class definition block" },
            { id: "B", text: "As the very first non-comment statement of the file, before any import statements" },
            { id: "C", text: "Directly after all import statements" },
            { id: "D", text: "Anywhere in the file as long as it precedes the main method" }
          ],
          correctAnswer: "B",
          explanationNote: "The package statement must be the very first non-comment statement in a Java source file, appearing before imports and class declarations."
        },
        questionPool: [
          {
            id: "11-1-3-alt",
            question: "If a class has the declaration 'package fi.helsinki.domain;', on which relative disk directory path must its .java file reside?",
            options: [
              { id: "A", text: "domain/helsinki/fi/" },
              { id: "B", text: "fi/helsinki/domain/" },
              { id: "C", text: "fi-helsinki-domain/" },
              { id: "D", text: "In the root source folder directly" }
            ],
            correctAnswer: "B",
            explanationNote: "Java package hierarchies map 1-to-1 to directory folder structures: fi.helsinki.domain maps to folder path fi/helsinki/domain/."
          }
        ]
      },
      {
        heading: "Importing Classes and Packages",
        text: `When code in one package wants to use a public class from another package, it must import it.\n\nJava provides two styles of imports:\n1. Explicit class import: 'import java.util.ArrayList;' (preferred for clarity)\n2. Wildcard import: 'import java.util.*;' (imports all public classes in that package, but NOT subpackages!)\n\nNote:\n• Classes in the same package do not require an import statement; they are automatically visible to each other.\n• The 'java.lang' package (containing String, Math, Integer, System, Object, etc.) is automatically imported into every Java program without any import statement.\n• If two imported packages contain a class with the exact same name (e.g. java.util.Date and java.sql.Date), you must explicitly use the fully qualified class name for at least one of them: java.sql.Date sqlDate = new java.sql.Date(millis);`,
        codeSnippet: `package mooc.demo;

// Explicit imports:
import java.util.List;
import java.util.ArrayList;

// Fully qualified usage to resolve ambiguity:
// java.util.Date utilDate = new java.util.Date();
// java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis());

public class ImportDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("Linus");
        System.out.println(names.get(0));
    }
}`,
        terminalOutput: `Linus`,
        tip: "Wildcard imports like 'import java.util.*' do not import classes in subpackages (e.g. java.util.concurrent is NOT imported). Each package level must be imported individually.",
        mcq: {
          id: "11-1-4",
          question: "Which Java package is automatically imported into every Java source file without requiring an explicit import statement?",
          options: [
            { id: "A", text: "java.util" },
            { id: "B", text: "java.io" },
            { id: "C", text: "java.lang" },
            { id: "D", text: "java.text" }
          ],
          correctAnswer: "C",
          explanationNote: "java.lang (containing fundamental types like System, String, Math, Exception) is implicitly imported into all Java compilation units."
        },
        questionPool: [
          {
            id: "11-1-4-alt",
            question: "Does the wildcard import 'import java.util.*;' automatically import classes located in 'java.util.concurrent'?",
            options: [
              { id: "A", text: "Yes, wildcards recursively import all nested subpackages" },
              { id: "B", text: "No, subpackages are distinct packages and must be imported separately" },
              { id: "C", text: "Only if the compiler flag -recursive is passed" },
              { id: "D", text: "Yes, but only for interface types" }
            ],
            correctAnswer: "B",
            explanationNote: "In Java, subpackages are completely distinct packages. A wildcard on a parent package does not import classes from child packages."
          }
        ]
      },
      {
        heading: "Package-Private (Default) vs Other Access Modifiers",
        text: `Java has four access visibility levels:\n\n1. 'public': Accessible from any class in any package.\n2. 'protected': Accessible within the same package, and accessible by subclasses even if they reside in different packages.\n3. 'package-private' (no keyword / default): When no modifier is specified, the class, method, or field is accessible ONLY by classes located within the exact same package. It cannot be accessed by any class in a different package, even subclasses!\n4. 'private': Accessible ONLY within the enclosing class body.\n\nTop-level classes can only be 'public' or 'package-private' (no top-level private or protected classes allowed). Package-private classes and methods are widely used in libraries to expose an internal clean API without leaking implementation classes to external consumers.`,
        codeSnippet: `package mooc.internal;

// Package-private class: no public keyword
class InternalHelper {
    // Package-private method
    static void compute() {
        System.out.println("Secret computation inside mooc.internal");
    }
}

// Public facade class
public class PublicService {
    public void run() {
        InternalHelper.compute(); // OK: Same package
    }
}`,
        terminalOutput: `PublicService service = new PublicService();
service.run();
// Output: Secret computation inside mooc.internal
// A class in 'com.other' cannot access InternalHelper!`,
        tip: "If you omit 'public', 'private', and 'protected', Java defaults to package-private access (sometimes called friendly or default access).",
        mcq: {
          id: "11-1-5",
          question: "If a method has no access modifier keyword specified before its return type, what is its access level in Java?",
          options: [
            { id: "A", text: "public" },
            { id: "B", text: "private" },
            { id: "C", text: "package-private (accessible only within the same package)" },
            { id: "D", text: "protected" }
          ],
          correctAnswer: "C",
          explanationNote: "When no modifier keyword is provided, the member receives default package-private access, making it visible only to classes in the same package."
        },
        questionPool: [
          {
            id: "11-1-5-alt",
            question: "Can a subclass in package 'com.client' access a package-private method declared by its superclass in package 'com.library'?",
            options: [
              { id: "A", text: "Yes, inheritance always grants access across packages" },
              { id: "B", text: "No, package-private members are invisible outside their defining package, even to subclasses" },
              { id: "C", text: "Yes, but only via the 'super' keyword" },
              { id: "D", text: "Only if the subclass is declared public" }
            ],
            correctAnswer: "B",
            explanationNote: "Package-private members are strictly invisible outside the package. To allow subclass access from other packages, 'protected' must be used."
          }
        ]
      },
      {
        heading: "Subpackages are Separate Packages",
        text: `In Java, the package hierarchy reflects a namespace convention, but language-wise, 'mooc.logic' and 'mooc.logic.core' are completely separate, independent packages.\n\nA common misunderstanding:\n• Code in 'mooc.logic' CANNOT access package-private members of 'mooc.logic.core'.\n• An import statement 'import mooc.logic.*;' does NOT import classes in 'mooc.logic.core'.\n• Classes in 'mooc.logic' must import classes from 'mooc.logic.core' just like they would import from an entirely different library like 'java.util'.`,
        codeSnippet: `// File: src/mooc/logic/core/Engine.java
package mooc.logic.core;

public class Engine {
    public void start() { System.out.println("Engine started"); }
}

// File: src/mooc/logic/Manager.java
package mooc.logic;

// Must import because mooc.logic.core is a distinct package!
import mooc.logic.core.Engine;

public class Manager {
    private Engine engine = new Engine();
    public void run() { engine.start(); }
}`,
        terminalOutput: `Manager mgr = new Manager();
mgr.run();
// Output: Engine started`,
        tip: "Remember: To the Java compiler and virtual machine, there is no inheritance or containment between 'parent' packages and 'subpackages'. They are distinct namespaces.",
        mcq: {
          id: "11-1-6",
          question: "How does the Java compiler view the relationship between package 'com.company' and package 'com.company.utils'?",
          options: [
            { id: "A", text: "com.company automatically inherits all members from com.company.utils" },
            { id: "B", text: "They are completely distinct, independent packages with no implicit access to each other" },
            { id: "C", text: "com.company.utils automatically imports everything from com.company" },
            { id: "D", text: "Nested packages share package-private visibility" }
          ],
          correctAnswer: "B",
          explanationNote: "Java treats each package as completely separate. Package nesting is a organizational naming convention with no special compiler privileges between parent and subpackages."
        },
        questionPool: [
          {
            id: "11-1-6-alt",
            question: "Why does Java require an import statement for a class in 'a.b.c' when referenced from a class in 'a.b'?",
            options: [
              { id: "A", text: "Because subpackages are independent packages, not child containers in Java's type system" },
              { id: "B", text: "Because only java.lang classes are known to the JVM" },
              { id: "C", text: "Because packages cannot contain dots in modern Java" },
              { id: "D", text: "It is an optional warning that can be disabled" }
            ],
            correctAnswer: "A",
            explanationNote: "Subpackages are separate packages. Java requires explicit imports or fully qualified names when referencing classes across distinct packages."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 11.2: Exceptions
  // -------------------------------------------------------------
  {
    id: "11-2-exceptions",
    number: "11.2",
    title: "Exceptions and Error Handling",
    subtitle: "try-catch blocks, the finally clause, throwing exceptions, and checked vs unchecked exceptions.",
    readTime: "25 min",
    objectives: [
      "Handle runtime failures gracefully using try and catch blocks",
      "Understand the execution flow of the finally block for reliable resource cleanup",
      "Throw exceptions explicitly using the throw keyword to enforce invariants",
      "Distinguish between checked exceptions (subclasses of Exception) and unchecked exceptions (subclasses of RuntimeException)",
      "Declare checked exceptions using the throws keyword in method signatures",
      "Create and throw custom application-specific exceptions"
    ],
    theoryBlocks: [
      {
        heading: "Handling Exceptions with try-catch",
        text: `Exceptions are events that disrupt the normal flow of program instructions during execution. Examples include parsing an invalid integer ('NumberFormatException'), dividing by zero ('ArithmeticException'), or accessing an invalid index ('IndexOutOfBoundsException').\n\nTo prevent program crashes, Java provides the 'try-catch' construct:\n\ntry {\n    // Code that might throw an exception\n} catch (ExceptionType e) {\n    // Recovery code executed if ExceptionType is thrown\n}\n\nWhen an exception occurs inside the try block, execution immediately halts at the failing line and jumps directly to the matching catch block. If no exception occurs, the catch block is skipped entirely.`,
        codeSnippet: `public class ExceptionDemo {
    public static int parseSafeInt(String text) {
        try {
            return Integer.parseInt(text);
        } catch (NumberFormatException e) {
            System.out.println("Could not parse '" + text + "' as integer. Using 0.");
            return 0;
        }
    }

    public static void main(String[] args) {
        int val1 = parseSafeInt("42");
        int val2 = parseSafeInt("not_a_number");
        System.out.println("Sum: " + (val1 + val2));
    }
}`,
        terminalOutput: `Could not parse 'not_a_number' as integer. Using 0.
Sum: 42`,
        tip: "You can chain multiple catch blocks to handle different exception types, but place more specific exception types before general ones (e.g. NumberFormatException before Exception).",
        mcq: {
          id: "11-2-1",
          question: "What happens when an exception is thrown inside a 'try' block?",
          options: [
            { id: "A", text: "The try block runs to completion, then invokes the catch block" },
            { id: "B", text: "Execution immediately jumps to the first matching catch block, skipping the rest of the try block" },
            { id: "C", text: "The entire JVM terminates immediately without running any catch blocks" },
            { id: "D", text: "The offending line is re-executed with default null arguments" }
          ],
          correctAnswer: "B",
          explanationNote: "When an exception occurs in a try block, normal execution halts immediately and jumps to the matching catch handler block."
        },
        questionPool: [
          {
            id: "11-2-1-alt",
            question: "In a try block with multiple catch clauses, how must the catch clauses be ordered?",
            options: [
              { id: "A", text: "From most general exception (e.g. Exception) to most specific" },
              { id: "B", text: "From most specific subclass exception to more general superclass exception" },
              { id: "C", text: "Alphabetical order of class names" },
              { id: "D", text: "The order does not matter in Java" }
            ],
            correctAnswer: "B",
            explanationNote: "Catch clauses must be ordered from most specific to most general; placing a general Exception catch first causes compiler errors because subsequent catches become unreachable."
          }
        ]
      },
      {
        heading: "The finally Block",
        text: `The 'finally' block is an optional addition to a try-catch statement. The crucial property of the finally block is that its code is ALWAYS executed, regardless of whether:\n1. The try block completed successfully without exceptions.\n2. An exception was thrown and successfully caught by a catch block.\n3. An exception was thrown that was NOT caught (it executes before propagating upward).\n4. A 'return' statement was encountered inside the try or catch block!\n\nThe finally block is primarily used for releasing system resources, closing database connections, or flushing output buffers to prevent resource leaks.`,
        codeSnippet: `public class FinallyDemo {
    public static int testMethod(boolean shouldThrow) {
        try {
            System.out.println("1. In try block");
            if (shouldThrow) {
                throw new RuntimeException("Error occurred");
            }
            return 100;
        } catch (RuntimeException e) {
            System.out.println("2. In catch block: " + e.getMessage());
            return -1;
        } finally {
            System.out.println("3. In finally block (always runs!)");
        }
    }

    public static void main(String[] args) {
        testMethod(false);
        System.out.println("---");
        testMethod(true);
    }
}`,
        terminalOutput: `1. In try block
3. In finally block (always runs!)
---
1. In try block
2. In catch block: Error occurred
3. In finally block (always runs!)`,
        tip: "Even if a return statement is executed inside try or catch, the finally block will execute before the method actually returns to the caller.",
        mcq: {
          id: "11-2-2",
          question: "When is the 'finally' block executed in a try-catch-finally statement?",
          options: [
            { id: "A", text: "Only when an exception is thrown and caught" },
            { id: "B", text: "Only when NO exceptions occur in the try block" },
            { id: "C", text: "Always, regardless of whether an exception occurred, was caught, or a return statement was executed" },
            { id: "D", text: "Only when the JVM is about to run out of memory" }
          ],
          correctAnswer: "C",
          explanationNote: "The finally block is guaranteed to execute whether an exception occurred, was caught, unhandled, or if a return statement was triggered in try/catch."
        },
        questionPool: [
          {
            id: "11-2-2-alt",
            question: "If a method encounters 'return 5;' inside a try block, will its associated finally block run?",
            options: [
              { id: "A", text: "Yes, the finally block runs right before the method returns" },
              { id: "B", text: "No, return bypasses finally" },
              { id: "C", text: "Only if an exception was also logged" },
              { id: "D", text: "Only in debug mode" }
            ],
            correctAnswer: "A",
            explanationNote: "The finally block always runs before the method finishes and returns its value."
          }
        ]
      },
      {
        heading: "Throwing Exceptions with 'throw'",
        text: `In addition to catching exceptions generated by the Java runtime or external libraries, your own methods can explicitly throw exceptions using the 'throw' keyword.\n\nThis is the idiomatic Java approach to enforcing preconditions and invariants, preventing objects from entering invalid states (such as creating a Person with a negative age or a null name).\n\nSyntax:\nthrow new IllegalArgumentException(\"Age cannot be negative: \" + age);\n\nCommon standard unchecked exceptions to throw:\n• 'IllegalArgumentException': A method was passed an illegal or inappropriate argument.\n• 'IllegalStateException': The object is in an unsuitable state for the requested method invocation.\n• 'NullPointerException': An unexpected null reference was passed.\n• 'IndexOutOfBoundsException': An index is out of range.`,
        codeSnippet: `public class BankAccount {
    private double balance;

    public BankAccount(double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative: " + initialBalance);
        }
        this.balance = initialBalance;
    }

    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        if (amount > this.balance) {
            throw new IllegalStateException("Insufficient funds: balance is " + this.balance);
        }
        this.balance -= amount;
    }
}`,
        terminalOutput: `BankAccount acc = new BankAccount(100);
// acc.withdraw(-20); -> throws IllegalArgumentException
// acc.withdraw(500); -> throws IllegalStateException`,
        tip: "Always include a descriptive error message when throwing an exception. It saves hours of debugging time in production logs.",
        mcq: {
          id: "11-2-3",
          question: "Which keyword is used in Java to explicitly trigger and throw an exception object?",
          options: [
            { id: "A", text: "throws" },
            { id: "B", text: "throw" },
            { id: "C", text: "raise" },
            { id: "D", text: "catch" }
          ],
          correctAnswer: "B",
          explanationNote: "The 'throw' keyword is used to throw an exception instance. 'throws' is used in method signatures to declare checked exceptions."
        },
        questionPool: [
          {
            id: "11-2-3-alt",
            question: "Which standard Java exception is most appropriate when a constructor receives a negative value for a person's age?",
            options: [
              { id: "A", text: "IllegalArgumentException" },
              { id: "B", text: "ArithmeticException" },
              { id: "C", text: "ClassCastException" },
              { id: "D", text: "NullPointerException" }
            ],
            correctAnswer: "A",
            explanationNote: "IllegalArgumentException is the standard Java exception thrown to indicate that a method/constructor has been passed an inappropriate argument."
          }
        ]
      },
      {
        heading: "Checked vs Unchecked Exceptions",
        text: `Java divides exceptions into two fundamental categories:\n\n1. Unchecked Exceptions (Subclasses of RuntimeException):\nThese represent programming bugs, logic errors, or preconditions violated by the caller (e.g. NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException).\nThe compiler does NOT force you to catch or declare unchecked exceptions. They can be thrown anywhere without declaring 'throws'.\n\n2. Checked Exceptions (Subclasses of Exception, excluding RuntimeException):\nThese represent anticipated failure conditions outside the program's control, such as missing files, network interruptions, or invalid database credentials (e.g. IOException, FileNotFoundException, SQLException).\nThe Java compiler STRICTLY enforces the 'Catch or Specify' requirement: You MUST either catch the checked exception in a try-catch block, OR declare it in the method signature using the 'throws' keyword:\npublic void readFile() throws IOException { ... }`,
        codeSnippet: `import java.io.IOException;

public class ExceptionTypesDemo {
    // Unchecked: RuntimeException (no 'throws' needed)
    public static void divide(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Divisor cannot be zero");
        }
        System.out.println(a / b);
    }

    // Checked: IOException (compiler forces 'throws' or 'try-catch')
    public static void connect() throws IOException {
        throw new IOException("Server connection failed");
    }

    public static void main(String[] args) {
        divide(10, 2); // Compiles fine without try-catch

        try {
            connect();
        } catch (IOException e) {
            System.out.println("Caught checked exception: " + e.getMessage());
        }
    }
}`,
        terminalOutput: `5
Caught checked exception: Server connection failed`,
        tip: "If a class extends 'Exception', it is a checked exception. If it extends 'RuntimeException', it is an unchecked exception.",
        mcq: {
          id: "11-2-4",
          question: "What is the defining compiler characteristic of a 'checked exception' in Java?",
          options: [
            { id: "A", text: "It cannot be caught by a catch block" },
            { id: "B", text: "The compiler mandates that it must be either caught with try-catch or declared with the 'throws' keyword" },
            { id: "C", text: "It crashes the computer hardware when thrown" },
            { id: "D", text: "It only occurs in unit tests" }
          ],
          correctAnswer: "B",
          explanationNote: "Checked exceptions are checked at compile time. The compiler enforces that any code throwing a checked exception must handle it or declare 'throws'."
        },
        questionPool: [
          {
            id: "11-2-4-alt",
            question: "Which of the following is an unchecked (RuntimeException) exception in Java?",
            options: [
              { id: "A", text: "java.io.IOException" },
              { id: "B", text: "java.lang.NullPointerException" },
              { id: "C", text: "java.sql.SQLException" },
              { id: "D", text: "java.lang.ClassNotFoundException" }
            ],
            correctAnswer: "B",
            explanationNote: "NullPointerException inherits from RuntimeException, making it an unchecked exception. The other three are checked exceptions."
          }
        ]
      },
      {
        heading: "Declaring Exceptions with 'throws'",
        text: `When a method contains code that could cause a checked exception and does NOT handle it with a try-catch block, it must delegate responsibility to its caller.\n\nThis is done by appending 'throws ExceptionName' to the method signature:\n\npublic void loadConfig(String path) throws IOException, ParseException {\n    // Method body\n}\n\nKey rules:\n• A method can declare multiple exceptions separated by commas: 'throws IOException, SQLException'.\n• If a method calls another method that declares a checked exception, the calling method must either wrap the call in a try-catch or declare 'throws' in its own signature.\n• When overriding a method, the subclass method cannot declare broader checked exceptions than the superclass method, though it can declare fewer or none.`,
        codeSnippet: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class ConfigLoader {
    // Delegates handling of IOException to whoever calls readConfig()
    public static List<String> readConfig(String filename) throws IOException {
        return Files.readAllLines(Paths.get(filename));
    }

    public static void main(String[] args) {
        try {
            List<String> lines = readConfig("config.txt");
            System.out.println("Lines read: " + lines.size());
        } catch (IOException e) {
            System.err.println("Failed to read configuration: " + e.getMessage());
        }
    }
}`,
        terminalOutput: `Failed to read configuration: config.txt (No such file or directory)`,
        tip: "Notice the difference in spelling: 'throw' (singular) throws an instance inside code; 'throws' (plural) declares exception classes in the method header.",
        mcq: {
          id: "11-2-5",
          question: "Where is the 'throws' keyword used in Java?",
          options: [
            { id: "A", text: "Inside a loop to break out" },
            { id: "B", text: "In the method signature header to declare checked exceptions that may be propagated" },
            { id: "C", text: "Directly after the try keyword" },
            { id: "D", text: "In place of the return statement" }
          ],
          correctAnswer: "B",
          explanationNote: "The 'throws' keyword is part of the method header, declaring that the method might throw the specified checked exceptions."
        },
        questionPool: [
          {
            id: "11-2-5-alt",
            question: "Can a method declare 'throws' for an unchecked exception like IllegalArgumentException?",
            options: [
              { id: "A", text: "No, the compiler will refuse to compile it" },
              { id: "B", text: "Yes, it is allowed for documentation purposes, but not required by the compiler" },
              { id: "C", text: "Only if the method is private" },
              { id: "D", text: "Only in abstract classes" }
            ],
            correctAnswer: "B",
            explanationNote: "You are allowed to list unchecked exceptions in the 'throws' clause for documentation purposes, but the compiler does not enforce catching them."
          }
        ]
      },
      {
        heading: "Custom Application Exceptions",
        text: `For domain-specific error conditions, Java lets you create custom exception classes by extending either 'Exception' (for a custom checked exception) or 'RuntimeException' (for a custom unchecked exception).\n\nTypically, custom exceptions provide two constructors:\n1. A default no-argument constructor.\n2. A constructor accepting a String message that delegates to super(message).\n\nCustom exceptions make error handling more explicit, allowing specific catch blocks for application domain events (e.g. 'catch (UserNotFoundException e)').`,
        codeSnippet: `// Custom unchecked domain exception
public class InsufficientFundsException extends RuntimeException {
    private final double attemptedAmount;
    private final double currentBalance;

    public InsufficientFundsException(double attempted, double current) {
        super("Cannot withdraw " + attempted + "; current balance is only " + current);
        this.attemptedAmount = attempted;
        this.currentBalance = current;
    }

    public double getAttemptedAmount() { return attemptedAmount; }
    public double getCurrentBalance() { return currentBalance; }
}

// In application code:
// if (amount > balance) {
//     throw new InsufficientFundsException(amount, balance);
// }`,
        terminalOutput: `try {
    throw new InsufficientFundsException(200.0, 50.0);
} catch (InsufficientFundsException e) {
    System.out.println(e.getMessage());
}
// Output: Cannot withdraw 200.0; current balance is only 50.0`,
        tip: "Prefer extending RuntimeException for custom exceptions unless callers are genuinely expected to recover programmatically from the error.",
        mcq: {
          id: "11-2-6",
          question: "How do you create a custom UNCHECKED exception in Java?",
          options: [
            { id: "A", text: "Extend java.lang.Throwable directly" },
            { id: "B", text: "Extend java.lang.RuntimeException" },
            { id: "C", text: "Extend java.lang.Exception directly without RuntimeException" },
            { id: "D", text: "Implement the java.lang.Runnable interface" }
          ],
          correctAnswer: "B",
          explanationNote: "To make an unchecked custom exception, extend RuntimeException. Extending Exception creates a checked exception."
        },
        questionPool: [
          {
            id: "11-2-6-alt",
            question: "Why would a developer create a custom domain exception like 'OrderAlreadyShippedException'?",
            options: [
              { id: "A", text: "To make the program execute twice as fast" },
              { id: "B", text: "To allow precise, domain-meaningful error handling and clearer diagnostic messages" },
              { id: "C", text: "Because Java prohibits throwing standard library exceptions" },
              { id: "D", text: "To bypass memory management" }
            ],
            correctAnswer: "B",
            explanationNote: "Custom exceptions provide clear domain semantics, enabling callers to handle distinct business failure scenarios specifically."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 11.3: Processing Files
  // -------------------------------------------------------------
  {
    id: "11-3-processing-files",
    number: "11.3",
    title: "Processing Files",
    subtitle: "Reading text files, Paths, Scanner with files, Files.lines Streams, and writing files with PrintWriter.",
    readTime: "25 min",
    objectives: [
      "Read text files line by line using Scanner and Paths.get()",
      "Process file streams declaratively using modern Files.lines() and the Stream API",
      "Use try-with-resources to automatically close file handles and prevent resource leaks",
      "Handle IOException and NoSuchFileException properly during file I/O operations",
      "Write data to files using PrintWriter and Files.write()",
      "Understand file paths: relative paths versus absolute paths across different operating systems"
    ],
    theoryBlocks: [
      {
        heading: "Reading Files with Scanner and Paths",
        text: `To read text from a file, Java's 'Scanner' class can be initialized with a 'Paths.get(\"filename.txt\")' reference instead of 'System.in'.\n\nBecause opening a file can fail if the file does not exist or permissions are denied, Scanner with a file can throw an 'IOException' or 'NoSuchFileException'. It must be enclosed in a try-catch block or try-with-resources.\n\nKey pattern:\ntry (Scanner scanner = new Scanner(Paths.get(\"records.txt\"))) {\n    while (scanner.hasNextLine()) {\n        String row = scanner.nextLine();\n        System.out.println(row);\n    }\n} catch (Exception e) {\n    System.out.println(\"Error: \" + e.getMessage());\n}`,
        codeSnippet: `import java.util.Scanner;
import java.nio.file.Paths;
import java.util.ArrayList;

public class FileReaderScanner {
    public static ArrayList<String> readLines(String filename) {
        ArrayList<String> lines = new ArrayList<>();
        try (Scanner scanner = new Scanner(Paths.get(filename))) {
            while (scanner.hasNextLine()) {
                String row = scanner.nextLine();
                lines.add(row);
            }
        } catch (Exception e) {
            System.out.println("Reading file failed: " + e.getMessage());
        }
        return lines;
    }

    public static void main(String[] args) {
        ArrayList<String> data = readLines("data.txt");
        System.out.println("Read " + data.size() + " rows.");
    }
}`,
        terminalOutput: `Read 3 rows.`,
        tip: "Notice the 'try (Scanner scanner = ...)' syntax. This is try-with-resources: Java automatically closes the scanner (and the underlying file) when the try block ends, even if an exception occurs!",
        mcq: {
          id: "11-3-1",
          question: "What is the primary benefit of using try-with-resources (e.g. try (Scanner s = ...)) when opening a file?",
          options: [
            { id: "A", text: "It prevents the file from ever throwing any exceptions" },
            { id: "B", text: "It automatically closes the resource when the block exits, preventing file handle leaks" },
            { id: "C", text: "It encrypts the file on disk automatically" },
            { id: "D", text: "It makes file reading run on multiple CPU cores" }
          ],
          correctAnswer: "B",
          explanationNote: "try-with-resources ensures that any resource implementing AutoCloseable (like Scanner, streams, readers) is automatically closed when execution finishes."
        },
        questionPool: [
          {
            id: "11-3-1-alt",
            question: "Which interface must a resource class implement to be eligible for use in a try-with-resources statement?",
            options: [
              { id: "A", text: "java.lang.AutoCloseable (or java.io.Closeable)" },
              { id: "B", text: "java.lang.Cloneable" },
              { id: "C", text: "java.io.Serializable" },
              { id: "D", text: "java.lang.Iterable" }
            ],
            correctAnswer: "A",
            explanationNote: "Any class implementing AutoCloseable or Closeable can be managed by try-with-resources."
          }
        ]
      },
      {
        heading: "Modern File Processing: Files.lines()",
        text: `Since Java 8, 'java.nio.file.Files.lines(Paths.get(filename))' provides an elegant, modern way to process files using the Stream API.\n\n'Files.lines()' returns a 'Stream<String>' where each element is a line of text from the file. The lines are read lazily on-demand, which means huge multi-gigabyte files can be processed without consuming all your computer's RAM!\n\nBecause Files.lines opens an OS file handle, it must also be managed in a try-with-resources block to ensure the underlying stream is closed.`,
        codeSnippet: `import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamFileReading {
    public static List<String> findMatchingLines(String file, String searchWord) {
        try (Stream<String> stream = Files.lines(Paths.get(file))) {
            return stream
                .filter(line -> line.contains(searchWord))
                .map(String::trim)
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error reading " + file + ": " + e.getMessage());
            return List.of();
        }
    }
}`,
        terminalOutput: `List<String> matches = findMatchingLines("server.log", "ERROR");
System.out.println("Found " + matches.size() + " errors.");
// Output: Found 4 errors.`,
        tip: "Files.lines() combined with .filter() and .map() replaces dozens of lines of repetitive loop and buffering boilerplate code.",
        mcq: {
          id: "11-3-2",
          question: "What return type does 'Files.lines(Paths.get(\"data.txt\"))' produce in Java?",
          options: [
            { id: "A", text: "ArrayList<String>" },
            { id: "B", text: "Stream<String>" },
            { id: "C", text: "String[]" },
            { id: "D", text: "Scanner" }
          ],
          correctAnswer: "B",
          explanationNote: "Files.lines() returns a Stream<String>, allowing declarative stream processing (.filter, .map, .forEach) directly on the lines of the file."
        },
        questionPool: [
          {
            id: "11-3-2-alt",
            question: "Why is Files.lines() memory-efficient even for very large files compared to Files.readAllLines()?",
            options: [
              { id: "A", text: "It compresses the text in memory with gzip" },
              { id: "B", text: "It reads lines lazily on demand rather than loading all lines into memory at once" },
              { id: "C", text: "It bypasses the Java garbage collector" },
              { id: "D", text: "It stores the strings in CPU registers" }
            ],
            correctAnswer: "B",
            explanationNote: "Files.lines() processes lines lazily as the stream is consumed, while readAllLines() loads every line into a List<String> in memory simultaneously."
          }
        ]
      },
      {
        heading: "Relative vs Absolute File Paths",
        text: `When referencing a file by name, Java interprets the path relative to the program's working directory:\n\n1. Relative Path: 'Paths.get(\"data.txt\")' looks for data.txt in the root of the project directory (the folder where the Java program was launched).\nIf the file is inside a subfolder: 'Paths.get(\"src/data/info.csv\")'.\n\n2. Absolute Path: Specifies the complete path starting from the root of the file system:\n• On Windows: 'Paths.get(\"C:\\\\Users\\\\bimal\\\\data.txt\")'\n• On Unix/Mac/Linux: 'Paths.get(\"/home/user/data.txt\")'\n\nRelative paths are strongly preferred because they allow your program to run on other computers and operating systems without changing hardcoded disk paths.`,
        codeSnippet: `import java.nio.file.Path;
import java.nio.file.Paths;

public class PathDemo {
    public static void main(String[] args) {
        Path relativePath = Paths.get("data.txt");
        System.out.println("Relative: " + relativePath);
        System.out.println("Absolute: " + relativePath.toAbsolutePath());
        System.out.println("File exists: " + relativePath.toFile().exists());
    }
}`,
        terminalOutput: `Relative: data.txt
Absolute: /home/workspace/project/data.txt
File exists: true`,
        tip: "In Java code strings, the Windows backslash must be escaped with a double backslash: 'C:\\\\folder\\\\file.txt', or you can simply use forward slashes 'C:/folder/file.txt' which Java automatically translates on Windows!",
        mcq: {
          id: "11-3-3",
          question: "Where does 'Paths.get(\"names.txt\")' look for the file when run without a directory prefix?",
          options: [
            { id: "A", text: "In the C:\\Windows root directory" },
            { id: "B", text: "In the current working directory from which the Java application was executed" },
            { id: "C", text: "Always in the user's Desktop folder" },
            { id: "D", text: "In the Java JDK installation bin directory" }
          ],
          correctAnswer: "B",
          explanationNote: "Relative paths are evaluated relative to the current working directory (usually the root folder of the project in IDEs)."
        },
        questionPool: [
          {
            id: "11-3-3-alt",
            question: "Why should developers generally avoid hardcoding absolute paths like 'C:\\\\Users\\\\John\\\\file.txt' in applications?",
            options: [
              { id: "A", text: "Because absolute paths make the code non-portable across different user accounts and operating systems" },
              { id: "B", text: "Because Java prohibits the use of drive letters" },
              { id: "C", text: "Because absolute paths run 50% slower" },
              { id: "D", text: "Because Paths.get() only accepts relative paths" }
            ],
            correctAnswer: "A",
            explanationNote: "Hardcoded absolute paths will fail whenever the application is moved to another computer, user account, or operating system like Linux."
          }
        ]
      },
      {
        heading: "Writing Files with PrintWriter",
        text: `Writing text to files is straightforward using 'java.io.PrintWriter'.\n\nPrintWriter provides the same familiar 'print()' and 'println()' methods that you use with 'System.out'!\n\nSyntax:\ntry (PrintWriter writer = new PrintWriter(\"output.txt\")) {\n    writer.println(\"Hello, world!\");\n    writer.println(\"Writing to files is easy with PrintWriter.\");\n} catch (Exception e) {\n    System.out.println(\"Error writing: \" + e.getMessage());\n}\n\nImportant warning:\nBy default, 'new PrintWriter(\"filename.txt\")' OVERWRITES the existing file completely! If you want to append to an existing file, wrap a FileWriter in append mode: 'new PrintWriter(new FileWriter(\"filename.txt\", true))'.`,
        codeSnippet: `import java.io.PrintWriter;
import java.io.FileWriter;

public class FileWritingDemo {
    public static void saveScores(String filename, String name, int score) {
        // Appending data: pass true to FileWriter
        try (PrintWriter writer = new PrintWriter(new FileWriter(filename, true))) {
            writer.println(name + ":" + score);
            System.out.println("Saved score for " + name);
        } catch (Exception e) {
            System.out.println("Writing failed: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        saveScores("scores.txt", "Ada", 98);
        saveScores("scores.txt", "Charles", 85);
    }
}`,
        terminalOutput: `Saved score for Ada
Saved score for Charles`,
        tip: "Always use try-with-resources with PrintWriter. If you forget to close the writer, the buffered data might never be flushed to disk and the file may end up empty!",
        mcq: {
          id: "11-3-4",
          question: "What happens by default if you execute 'new PrintWriter(\"existing_file.txt\")' when 'existing_file.txt' already contains data?",
          options: [
            { id: "A", text: "It throws a FileAlreadyExistsException" },
            { id: "B", text: "The existing file content is erased and overwritten from the beginning" },
            { id: "C", text: "The new data is appended to the bottom of the existing text" },
            { id: "D", text: "It creates a backup copy called existing_file.bak" }
          ],
          correctAnswer: "B",
          explanationNote: "Standard PrintWriter constructor with a filename overwrites the file, truncating existing content. To append, FileWriter with true must be passed."
        },
        questionPool: [
          {
            id: "11-3-4-alt",
            question: "Why might a newly written file remain completely empty if try-with-resources or writer.close() is omitted?",
            options: [
              { id: "A", text: "Because output is buffered in memory and never flushed to disk until closed" },
              { id: "B", text: "Because the JVM deletes files on normal exit" },
              { id: "C", text: "Because PrintWriter requires admin privileges to write" },
              { id: "D", text: "Because strings must be converted to binary first" }
            ],
            correctAnswer: "A",
            explanationNote: "PrintWriter uses an internal memory buffer. If the writer is not closed, buffered bytes are not flushed to disk before the program exits."
          }
        ]
      },
      {
        heading: "Writing with Files.write()",
        text: `Java's 'java.nio.file.Files' class also provides convenient static helper methods to write collections of strings directly in a single line:\n\n'Files.write(Paths.get(\"output.txt\"), listOfStrings);'\n\nThis method:\n1. Opens the file (creating it if it does not exist).\n2. Writes each element of the Iterable (such as an ArrayList or List) on its own line.\n3. Closes the file cleanly upon completion.\n\nFor simple operations where you already have a List<String> in memory, this is the most concise and error-free approach in modern Java.`,
        codeSnippet: `import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class QuickFileWrite {
    public static void main(String[] args) {
        List<String> cities = List.of("Helsinki", "Espoo", "Tampere", "Turku", "Oulu");
        
        try {
            Files.write(Paths.get("cities.txt"), cities);
            System.out.println("Wrote " + cities.size() + " cities successfully!");
        } catch (Exception e) {
            System.err.println("Write error: " + e.getMessage());
        }
    }
}`,
        terminalOutput: `Wrote 5 cities successfully!`,
        tip: "Files.write() throws IOException (a checked exception), so it must be enclosed in a try-catch block or declared in a throws clause.",
        mcq: {
          id: "11-3-5",
          question: "Which one-liner method writes an entire List<String> to a file, handling file opening, writing, and closing automatically?",
          options: [
            { id: "A", text: "Files.write(Paths.get(\"output.txt\"), list)" },
            { id: "B", text: "System.out.save(list, \"output.txt\")" },
            { id: "C", text: "list.saveToFile(\"output.txt\")" },
            { id: "D", text: "File.dump(list, \"output.txt\")" }
          ],
          correctAnswer: "A",
          explanationNote: "java.nio.file.Files.write(Path, Iterable<? extends CharSequence>) writes lines and safely closes the file in a single convenient call."
        },
        questionPool: [
          {
            id: "11-3-5-alt",
            question: "What exception type does Files.write() declare in its method signature?",
            options: [
              { id: "A", text: "NullPointerException" },
              { id: "B", text: "IOException (checked exception)" },
              { id: "C", text: "IllegalArgumentException" },
              { id: "D", text: "It does not declare any exceptions" }
            ],
            correctAnswer: "B",
            explanationNote: "Files.write() declares throws IOException, a checked exception that must be caught or declared by the calling method."
          }
        ]
      },
      {
        heading: "Handling CSV and Structured Text Files",
        text: `Real-world data files are commonly formatted as Comma-Separated Values (CSV) or delimited with semicolons or tabs.\n\nProcessing CSV files typically involves:\n1. Reading line by line using Scanner or Files.lines().\n2. Splitting each line with 'line.split(\",\")' or 'line.split(\";\")'.\n3. Parsing tokens into appropriate types (e.g. 'Integer.parseInt(parts[1])').\n4. Creating domain model objects (e.g. 'new Item(parts[0], price)').\n\nAlways guard against blank lines and check that 'parts.length' meets the expected column count to avoid 'ArrayIndexOutOfBoundsException' on corrupt rows.`,
        codeSnippet: `import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class CsvParserDemo {
    record StudentScore(String name, int score) {}

    public static List<StudentScore> parseCsv(String filename) {
        List<StudentScore> results = new ArrayList<>();
        try {
            List<String> lines = Files.readAllLines(Paths.get(filename));
            for (String line : lines) {
                if (line.isBlank()) continue;
                String[] parts = line.split(",");
                if (parts.length >= 2) {
                    String name = parts[0].trim();
                    int score = Integer.parseInt(parts[1].trim());
                    results.add(new StudentScore(name, score));
                }
            }
        } catch (Exception e) {
            System.out.println("CSV parsing error: " + e.getMessage());
        }
        return results;
    }
}`,
        terminalOutput: `// Reading 'students.csv':
// Alice, 95
// Bob, 88
// Parsed 2 student records successfully.`,
        tip: "Always call .trim() on split tokens to remove accidental surrounding whitespace before converting with Integer.parseInt() or Double.parseDouble().",
        mcq: {
          id: "11-3-6",
          question: "When parsing a row 'John, 25' with line.split(\",\"), what should you call before Integer.parseInt(parts[1]) to avoid NumberFormatException caused by the leading space?",
          options: [
            { id: "A", text: "parts[1].trim()" },
            { id: "B", text: "parts[1].toLowerCase()" },
            { id: "C", text: "parts[1].length()" },
            { id: "D", text: "parts[1].reverse()" }
          ],
          correctAnswer: "A",
          explanationNote: "Calling .trim() removes leading and trailing whitespace characters, ensuring clean strings like '25' are passed to Integer.parseInt()."
        },
        questionPool: [
          {
            id: "11-3-6-alt",
            question: "Why is checking 'if (parts.length < 2) continue;' a best practice when parsing a 2-column CSV file?",
            options: [
              { id: "A", text: "It prevents ArrayIndexOutOfBoundsException on corrupted or empty rows" },
              { id: "B", text: "It encrypts incomplete rows" },
              { id: "C", text: "It accelerates file decompression" },
              { id: "D", text: "It forces the garbage collector to free memory" }
            ],
            correctAnswer: "A",
            explanationNote: "Guarding with parts.length checks ensures malformed or blank lines in the CSV file do not cause unexpected ArrayIndexOutOfBoundsException crashes."
          }
        ]
      }
    ]
  }
];

// Helper functions for state, pools, and streak tracking

export function getActiveQuestionsForLevelPart11(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part11_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart11(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part11_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart11(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part11_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart11(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part11_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart11(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part11_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart11 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart11(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart11 {
  const attemptKey = `dopilot_java_part11_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part11_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part11_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart11(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart11(studentId);
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
