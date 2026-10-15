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

export const PART_5_SECTIONS: SectionContent[] = [
  {
    id: "5-1-learning-oop",
    number: "5.1",
    title: "Learning Object-Oriented Programming",
    subtitle: "Composing systems of cooperating objects, modular class design, passing objects as method parameters, and equals() implementation.",
    readTime: "25 min",
    objectives: [
      "Decompose complex systems into smaller collaborating objects (e.g. Clock using ClockHand)",
      "Pass object references as arguments into methods",
      "Overload methods with differing parameter signatures",
      "Implement equals(Object compared) to test meaningful content equality",
      "Identify the difference between reference equality (==) and value equality (.equals())",
      "Compare dates and custom domain models reliably"
    ],
    theoryBlocks: [
      {
        heading: "Decomposing Concepts into Collaborating Classes",
        text: "In object-oriented design, larger problems are solved by dividing them into smaller, self-contained concepts. Each class encapsulates its own state and behavior. For example, a Clock can be built from three ClockHand objects (hours, minutes, seconds), where each ClockHand manages its own advance and rollover logic.",
        codeSnippet: "public class ClockHand {\n    private int value;\n    private int limit;\n\n    public ClockHand(int limit) {\n        this.limit = limit;\n        this.value = 0;\n    }\n\n    public void advance() {\n        this.value = this.value + 1;\n        if (this.value >= this.limit) {\n            this.value = 0;\n        }\n    }\n\n    public int getValue() {\n        return this.value;\n    }\n}",
        terminalOutput: "// Each ClockHand handles rollover (e.g. 60 for minutes, 24 for hours)",
        tip: "Modular decomposition makes individual components simpler to test and maintain independently.",
        warning: "Avoid creating monolithic classes that try to do everything; delegate specific sub-tasks to dedicated classes.",
        mcq: {
          id: "j5-1-1",
          question: "Why is decomposing a complex problem into multiple smaller cooperating classes beneficial?",
          options: [
            { id: "A", text: "Each class has a single clear responsibility, making code modular, easier to understand, test, and reuse", explanationIfWrong: "" },
            { id: "B", text: "Because Java requires every method to be defined in its own separate class file", explanationIfWrong: "A single class can contain multiple methods." },
            { id: "C", text: "It prevents memory consumption on the heap", explanationIfWrong: "Modular design organizes code; it does not eliminate heap allocations." },
            { id: "D", text: "Classes with fewer than 10 lines of code compile 100 times faster", explanationIfWrong: "Decomposition is an architectural principle, not a compiler speed hack." }
          ],
          correctAnswer: "A",
          explanationNote: "Decomposition breaks big problems into focused classes with clear responsibilities, increasing reusability and maintainability."
        },
        questionPool: [
          {
            id: "j5-1-1-alt1",
            question: "In the Clock example, what role does the Clock class play relative to the ClockHand objects?",
            options: [
              { id: "A", text: "The Clock orchestrates multiple ClockHand instances to model hours, minutes, and seconds as a cohesive unit", explanationIfWrong: "" },
              { id: "B", text: "The Clock deletes the ClockHand objects every minute", explanationIfWrong: "Clock coordinates them, it does not delete them." },
              { id: "C", text: "The Clock converts primitive integers to floating-point numbers", explanationIfWrong: "Clock coordinates time progression." },
              { id: "D", text: "Clock inherits from ClockHand", explanationIfWrong: "Clock *has* ClockHand objects (composition), it does not inherit from them." }
            ],
            correctAnswer: "A",
            explanationNote: "The Clock uses composition (holding ClockHand instances as fields) to coordinate hours, minutes, and seconds."
          },
          {
            id: "j5-1-1-alt2",
            question: "What design relationship is represented when a 'Car' class contains an 'Engine' object as an instance variable?",
            options: [
              { id: "A", text: "Composition (a 'has-a' relationship)", explanationIfWrong: "" },
              { id: "B", text: "Inheritance (an 'is-a' relationship)", explanationIfWrong: "A Car *has* an Engine, it *is not* an Engine." },
              { id: "C", text: "Static polymorphism only", explanationIfWrong: "This is object composition." },
              { id: "D", text: "Primitive wrapping", explanationIfWrong: "Engine is a custom class, not a primitive wrapper." }
            ],
            correctAnswer: "A",
            explanationNote: "Composition represents a 'has-a' relationship where one object contains another as part of its internal state."
          }
        ]
      },
      {
        heading: "Objects as Method Parameters",
        text: "Methods can accept custom objects as arguments just like primitive types. When passing an object to a method, you are passing the reference to that object. The method can inspect the object's state via getters or invoke its behaviors.",
        codeSnippet: "public class AmusementParkRide {\n    private String name;\n    private int minimumHeight;\n\n    public AmusementParkRide(String name, int minHeight) {\n        this.name = name;\n        this.minimumHeight = minHeight;\n    }\n\n    public boolean isAllowedOn(Person person) {\n        return person.getHeight() >= this.minimumHeight;\n    }\n}",
        terminalOutput: "Person ada = new Person(\"Ada\", 160);\nride.isAllowedOn(ada); // returns true if 160 >= minHeight",
        tip: "Passing domain objects as parameters creates natural, highly expressive domain-driven code.",
        warning: "Always check for null if there is any chance an external caller could pass a null reference.",
        mcq: {
          id: "j5-1-2",
          question: "In 'public boolean isAllowedOn(Person person)', what does the method receive when invoked with 'ride.isAllowedOn(ada)'?",
          options: [
            { id: "A", text: "A copy of the reference pointing to the existing 'ada' Person object on the heap", explanationIfWrong: "" },
            { id: "B", text: "A deep duplicate clone of the entire Person object and its variables", explanationIfWrong: "Java does not automatically make deep copies of objects when passed to methods." },
            { id: "C", text: "Only the string name of the person", explanationIfWrong: "The entire object reference is passed, allowing access to all public methods." },
            { id: "D", text: "An integer representing the memory address in byte hex", explanationIfWrong: "Java passes references transparently as typed object handles." }
          ],
          correctAnswer: "A",
          explanationNote: "Java passes object references by value. The method receives a copy of the reference pointing to the original object on the heap."
        },
        questionPool: [
          {
            id: "j5-1-2-alt1",
            question: "If a method modifies an object passed as a parameter (e.g. 'person.setHeight(170)'), will the caller see the change?",
            options: [
              { id: "A", text: "Yes, because both the caller and the method refer to the exact same object in heap memory", explanationIfWrong: "" },
              { id: "B", text: "No, because method parameters in Java are completely isolated from callers", explanationIfWrong: "Modifying internal state via the reference alters the shared object on the heap." },
              { id: "C", text: "Only if the method has a return type of Person", explanationIfWrong: "State mutations on the referenced object take effect regardless of return type." },
              { id: "D", text: "Only if the Person class is declared static", explanationIfWrong: "Instance mutations affect heap objects directly." }
            ],
            correctAnswer: "A",
            explanationNote: "Because the parameter holds a reference to the same heap object, modifying that object's fields is immediately observed by the caller."
          },
          {
            id: "j5-1-2-alt2",
            question: "What happens if a caller passes 'null' to 'ride.isAllowedOn(null)' and the method immediately calls 'person.getHeight()'?",
            options: [
              { id: "A", text: "A NullPointerException is thrown at runtime", explanationIfWrong: "" },
              { id: "B", text: "The method returns false automatically", explanationIfWrong: "Java does not auto-handle null; calling methods on null throws NPE." },
              { id: "C", text: "person is initialized to a new Person()", explanationIfWrong: "Java does not instantiate default objects on null calls." },
              { id: "D", text: "The code fails to compile", explanationIfWrong: "Passing null compiles fine; the error occurs at runtime when dereferencing." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling any method on a reference that is null produces a NullPointerException at runtime."
          }
        ]
      },
      {
        heading: "Method Overloading",
        text: "Method overloading allows a class to define multiple methods with the exact same name, as long as their parameter lists differ in type, number, or order. The Java compiler automatically selects the appropriate version at compile time based on the arguments supplied.",
        codeSnippet: "public class Counter {\n    private int value;\n\n    public void increase() {\n        this.increase(1); // Delegates to the overloaded version\n    }\n\n    public void increase(int amount) {\n        if (amount > 0) {\n            this.value += amount;\n        }\n    }\n}",
        terminalOutput: "c.increase();   // increases by 1\nc.increase(5);  // increases by 5",
        tip: "Delegating simpler overloads to a more comprehensive overload removes repetitive code and centralizes validation.",
        warning: "Overloading requires different parameter types or counts; methods cannot differ by return type alone.",
        mcq: {
          id: "j5-1-3",
          question: "Which of the following method signatures is a valid overload of 'public void print(String message)'?",
          options: [
            { id: "A", text: "public void print(String message, int times)", explanationIfWrong: "" },
            { id: "B", text: "public int print(String message)", explanationIfWrong: "Methods cannot differ only by return type; the parameter list must differ." },
            { id: "C", text: "public void print(String text)", explanationIfWrong: "Changing the parameter name alone does not change the signature (both take 1 String)." },
            { id: "D", text: "private void print(String message)", explanationIfWrong: "Changing access modifiers does not overload a method signature." }
          ],
          correctAnswer: "A",
          explanationNote: "Method overloading requires different parameter types, numbers, or order. 'print(String, int)' has 2 parameters instead of 1."
        },
        questionPool: [
          {
            id: "j5-1-3-alt1",
            question: "Can two overloaded methods in the same class have different return types?",
            options: [
              { id: "A", text: "Yes, as long as their parameter lists are also different", explanationIfWrong: "" },
              { id: "B", text: "No, overloaded methods must always share the exact same return type", explanationIfWrong: "Return types can differ provided the parameter signatures are distinct." },
              { id: "C", text: "Only if both methods are declared static", explanationIfWrong: "Static status has no bearing on overloading return type rules." },
              { id: "D", text: "Only if the return types are primitives", explanationIfWrong: "Any return types are allowed if parameter lists differ." }
            ],
            correctAnswer: "A",
            explanationNote: "Overloaded methods can have different return types, provided that their parameter lists differ."
          },
          {
            id: "j5-1-3-alt2",
            question: "When does the Java compiler decide which overloaded method to invoke?",
            options: [
              { id: "A", text: "At compile time, based on the types and number of arguments provided", explanationIfWrong: "" },
              { id: "B", text: "At runtime, through random selection", explanationIfWrong: "Method resolution is strictly deterministic." },
              { id: "C", text: "During garbage collection", explanationIfWrong: "Garbage collection manages memory, not method binding." },
              { id: "D", text: "Only when the program terminates", explanationIfWrong: "Calls are bound during compilation." }
            ],
            correctAnswer: "A",
            explanationNote: "Overload resolution (static polymorphism) is determined at compile time based on parameter types."
          }
        ]
      },
      {
        heading: "Comparing Objects and the equals() Method",
        text: "The default '==' operator tests reference equality (whether both variables point to the exact same memory location). To compare whether two distinct objects contain equivalent values, classes override the equals(Object compared) method inherited from Object.",
        codeSnippet: "public class SimpleDate {\n    private int day;\n    private int month;\n    private int year;\n\n    public boolean equals(Object compared) {\n        if (this == compared) return true; // Same memory reference\n        if (!(compared instanceof SimpleDate)) return false; // Null or wrong type\n        SimpleDate other = (SimpleDate) compared;\n        return this.day == other.day && this.month == other.month && this.year == other.year;\n    }\n}",
        terminalOutput: "SimpleDate d1 = new SimpleDate(1, 1, 2026);\nSimpleDate d2 = new SimpleDate(1, 1, 2026);\nd1.equals(d2); // true!",
        tip: "A standard equals() method checks: 1. same reference (this == compared), 2. type check (instanceof), 3. field-by-field equality.",
        warning: "The parameter type MUST be 'Object compared', NOT your custom class like 'SimpleDate compared', otherwise it overloads instead of overrides!",
        mcq: {
          id: "j5-1-4",
          question: "Why must the parameter of the overridden equals method be 'Object compared' rather than 'SimpleDate compared'?",
          options: [
            { id: "A", text: "Because the method signature in java.lang.Object is 'equals(Object)', and changing the parameter type overloads the method instead of overriding it", explanationIfWrong: "" },
            { id: "B", text: "Because Java does not permit classes to appear as parameter types", explanationIfWrong: "Classes can be parameter types in any method." },
            { id: "C", text: "To make the method run faster in 64-bit systems", explanationIfWrong: "It is about satisfying the inherited method contract, not performance." },
            { id: "D", text: "Because Object is a primitive type", explanationIfWrong: "Object is the root class of Java's class hierarchy." }
          ],
          correctAnswer: "A",
          explanationNote: "To properly override Object.equals(), the parameter must be of type Object. Writing equals(SimpleDate) creates an overload that Java collections will ignore."
        },
        questionPool: [
          {
            id: "j5-1-4-alt1",
            question: "In an overridden equals() method, what is the purpose of 'if (this == compared) return true;'?",
            options: [
              { id: "A", text: "An optimization that immediately returns true if both variables point to the exact same memory address", explanationIfWrong: "" },
              { id: "B", text: "It resets the fields of both objects to 0", explanationIfWrong: "equals() never modifies object fields." },
              { id: "C", text: "It converts both objects into Strings", explanationIfWrong: "No string conversion occurs." },
              { id: "D", text: "It prevents garbage collection", explanationIfWrong: "equals has no effect on garbage collection." }
            ],
            correctAnswer: "A",
            explanationNote: "If both references point to the same memory location, they are guaranteed to be equal, avoiding unnecessary field checks."
          },
          {
            id: "j5-1-4-alt2",
            question: "What does '!(compared instanceof SimpleDate)' evaluate to if 'compared' is null?",
            options: [
              { id: "A", text: "true, so the method safely returns false without throwing a NullPointerException", explanationIfWrong: "" },
              { id: "B", text: "It throws a NullPointerException immediately", explanationIfWrong: "The 'instanceof' operator safely evaluates to false for null." },
              { id: "C", text: "false", explanationIfWrong: "'null instanceof AnyClass' is false, so '!(false)' is true." },
              { id: "D", text: "It causes a compilation error", explanationIfWrong: "'instanceof' with null is completely legal and safe in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "'null instanceof Type' returns false in Java. Thus '!(null instanceof Type)' is true, safely returning false."
          }
        ]
      },
      {
        heading: "Comparing Object Properties: String & Object Fields",
        text: "When comparing object fields inside equals() (such as String name), you must use '.equals()' on object fields, and '==' on primitive fields. Comparing String fields with '==' tests reference equality, which fails if strings were constructed separately.",
        codeSnippet: "public class Person {\n    private String name;\n    private int age;\n\n    public boolean equals(Object compared) {\n        if (this == compared) return true;\n        if (!(compared instanceof Person)) return false;\n        Person other = (Person) compared;\n        return this.age == other.age && this.name.equals(other.name);\n    }\n}",
        terminalOutput: "p1.equals(p2); // checks age with == and name with .equals()",
        tip: "Use 'Objects.equals(this.name, other.name)' if there is a chance 'this.name' might be null.",
        warning: "Never use '==' to compare String instance variables inside an equals() method.",
        mcq: {
          id: "j5-1-5",
          question: "Why should 'this.name.equals(other.name)' be used instead of 'this.name == other.name' inside equals()?",
          options: [
            { id: "A", text: "Because String is an object, and '==' only checks if they share the same memory address rather than identical characters", explanationIfWrong: "" },
            { id: "B", text: "Because '==' does not compile when comparing Strings", explanationIfWrong: "It compiles, but performs reference equality comparison which leads to subtle bugs." },
            { id: "C", text: "Because .equals() converts both strings to uppercase first", explanationIfWrong: ".equals() checks exact character matches case-sensitively." },
            { id: "D", text: "Because '==' only works on boolean variables", explanationIfWrong: "'==' works on all primitive types and references." }
          ],
          correctAnswer: "A",
          explanationNote: "Strings are objects. '==' checks whether both pointers reference the same memory address, whereas .equals() checks character content."
        },
        questionPool: [
          {
            id: "j5-1-5-alt1",
            question: "What utility method from java.util.Objects safely compares two objects or strings even if one or both are null?",
            options: [
              { id: "A", text: "Objects.equals(obj1, obj2)", explanationIfWrong: "" },
              { id: "B", text: "Objects.compareNull(obj1, obj2)", explanationIfWrong: "There is no compareNull method." },
              { id: "C", text: "obj1.safeEquals(obj2)", explanationIfWrong: "safeEquals is not a standard Java method." },
              { id: "D", text: "Math.equals(obj1, obj2)", explanationIfWrong: "Math deals with mathematical functions, not object equality." }
            ],
            correctAnswer: "A",
            explanationNote: "java.util.Objects.equals(a, b) handles nulls gracefully without throwing NullPointerException."
          },
          {
            id: "j5-1-5-alt2",
            question: "How does ArrayList.contains(item) determine if an item is present?",
            options: [
              { id: "A", text: "It loops through elements calling item.equals(element)", explanationIfWrong: "" },
              { id: "B", text: "It uses the '==' operator exclusively", explanationIfWrong: "Collections use .equals() so value equality works properly." },
              { id: "C", text: "It inspects variable names", explanationIfWrong: "Variable names are lost at runtime." },
              { id: "D", text: "It hashes the file size", explanationIfWrong: "No file hashing is involved." }
            ],
            correctAnswer: "A",
            explanationNote: "ArrayList.contains() iterates through elements and checks equality using the element's .equals() method."
          }
        ]
      },
      {
        heading: "Comparing Complex Objects (e.g. SimpleDate)",
        text: "When an object has custom objects as instance variables (e.g. Person has a SimpleDate birthday), the Person equals() method delegates comparison to birthday.equals(other.birthday). This cascades comparison down through the object hierarchy cleanly.",
        codeSnippet: "public class Person {\n    private String name;\n    private SimpleDate birthday;\n\n    public boolean equals(Object compared) {\n        if (this == compared) return true;\n        if (!(compared instanceof Person)) return false;\n        Person other = (Person) compared;\n        return this.name.equals(other.name) && this.birthday.equals(other.birthday);\n    }\n}",
        terminalOutput: "// Evaluates true only if names and birthdays match",
        tip: "By giving SimpleDate its own equals() method, Person can simply delegate the date comparison.",
        warning: "Ensure all collaborating classes implement equals() properly for cascading comparison to work.",
        mcq: {
          id: "j5-1-6",
          question: "What happens when 'this.birthday.equals(other.birthday)' is evaluated in Person's equals method?",
          options: [
            { id: "A", text: "It invokes SimpleDate's equals method, checking if day, month, and year are identical", explanationIfWrong: "" },
            { id: "B", text: "It converts both birthdays to strings and compares lengths", explanationIfWrong: "It executes the equals method of SimpleDate." },
            { id: "C", text: "It only checks if both birthdays occurred in the same century", explanationIfWrong: "SimpleDate.equals() checks exact equality of its fields." },
            { id: "D", text: "It resets the birthday to today's date", explanationIfWrong: "equals() is non-mutating." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling .equals() on the birthday delegate executes SimpleDate's equals() implementation to compare year, month, and day."
        },
        questionPool: [
          {
            id: "j5-1-6-alt1",
            question: "What is this cascading pattern of comparison called?",
            options: [
              { id: "A", text: "Delegation (delegating component equality to component classes)", explanationIfWrong: "" },
              { id: "B", text: "Reflection inversion", explanationIfWrong: "Reflection is dynamic introspection, not standard method delegation." },
              { id: "C", text: "Implicit recursion", explanationIfWrong: "It calls a different class's method, not itself recursively." },
              { id: "D", text: "Data shadowing", explanationIfWrong: "Shadowing refers to scoping conflicts." }
            ],
            correctAnswer: "A",
            explanationNote: "Delegation allows a class to rely on its helper objects to perform their own comparisons and actions."
          },
          {
            id: "j5-1-6-alt2",
            question: "If SimpleDate did NOT override equals(), what would 'birthday.equals(other.birthday)' do?",
            options: [
              { id: "A", text: "It would fall back to Object's default equals(), which checks reference identity (==) only", explanationIfWrong: "" },
              { id: "B", text: "It would cause a compilation error", explanationIfWrong: "All Java classes inherit Object.equals()." },
              { id: "C", text: "It would compare birthdays alphabetically", explanationIfWrong: "Default equals() only checks memory addresses." },
              { id: "D", text: "It would crash the JVM", explanationIfWrong: "It runs smoothly, but might return false for distinct instances with identical dates." }
            ],
            correctAnswer: "A",
            explanationNote: "Without an overridden equals(), the inherited Object.equals() compares memory addresses (==), failing for distinct instances with equal fields."
          }
        ]
      }
    ]
  },
  {
    id: "5-2-removing-repetitive-code",
    number: "5.2",
    title: "Removing Repetitive Code",
    subtitle: "Master constructor chaining with this(...), method delegation, and eliminating boilerplate logic in object designs.",
    readTime: "20 min",
    objectives: [
      "Use constructor chaining with this(...) to avoid duplicating initialization code",
      "Ensure this(...) is positioned as the first statement in a constructor",
      "Delegate overloaded methods to a canonical implementation",
      "Refactor repetitive validation checks into unified private helper methods",
      "Maintain clean, single-point-of-truth code architectures"
    ],
    theoryBlocks: [
      {
        heading: "Constructor Chaining with this(...)",
        text: "When a class provides multiple constructors, repeating initialization code in every constructor leads to duplication and bugs. Java allows one constructor to call another constructor in the same class using 'this(...)'. The constructor with the fewest parameters typically calls the more detailed constructor with default values.",
        codeSnippet: "public class SimpleDate {\n    private int day;\n    private int month;\n    private int year;\n\n    public SimpleDate(int day, int month) {\n        this(day, month, 2026); // Calls the 3-parameter constructor\n    }\n\n    public SimpleDate(int day, int month, int year) {\n        this.day = day;\n        this.month = month;\n        this.year = year;\n    }\n}",
        terminalOutput: "SimpleDate d = new SimpleDate(12, 5); // year automatically defaults to 2026",
        tip: "By routing through a single master constructor, field assignments and validations happen in exactly one place.",
        warning: "Calling 'this(...)' MUST be the very first statement inside the constructor body.",
        mcq: {
          id: "j5-2-1",
          question: "What is the primary benefit of constructor chaining using 'this(...)'?",
          options: [
            { id: "A", text: "It avoids duplicating initialization and validation logic across multiple constructors by funneling them through a master constructor", explanationIfWrong: "" },
            { id: "B", text: "It makes the class extend java.lang.Thread automatically", explanationIfWrong: "Threading is unrelated to constructor chaining." },
            { id: "C", text: "It eliminates the need for instance variables", explanationIfWrong: "Instance variables are still required to store object state." },
            { id: "D", text: "It allows constructors to return integers", explanationIfWrong: "Constructors never return any value." }
          ],
          correctAnswer: "A",
          explanationNote: "Constructor chaining centralizes initialization and prevents copy-pasted assignments across constructors."
        },
        questionPool: [
          {
            id: "j5-2-1-alt1",
            question: "Where must 'this(...)' be located within a constructor body?",
            options: [
              { id: "A", text: "It must be the first statement in the constructor", explanationIfWrong: "" },
              { id: "B", text: "It must be the final statement right before the closing brace", explanationIfWrong: "Java requires this(...) to be the very first statement." },
              { id: "C", text: "Anywhere inside an if statement", explanationIfWrong: "Constructor calls cannot be nested inside conditions or after statements." },
              { id: "D", text: "In a static block", explanationIfWrong: "this(...) belongs exclusively inside constructors." }
            ],
            correctAnswer: "A",
            explanationNote: "Java language rules mandate that constructor delegation via this(...) must be the very first statement in the constructor."
          },
          {
            id: "j5-2-1-alt2",
            question: "What happens if constructor A calls constructor B with this(), and constructor B calls constructor A with this()?",
            options: [
              { id: "A", text: "The Java compiler detects recursive constructor invocation and produces a compile error", explanationIfWrong: "" },
              { id: "B", text: "The code runs into an infinite loop and crashes with OutOfMemoryError", explanationIfWrong: "The compiler detects circular constructor calls before runtime." },
              { id: "C", text: "It instantiates two objects simultaneously", explanationIfWrong: "Circular constructor calls are illegal." },
              { id: "D", text: "All fields are nullified", explanationIfWrong: "The code will not compile." }
            ],
            correctAnswer: "A",
            explanationNote: "The compiler checks for circular constructor calls and halts compilation with 'recursive constructor invocation'."
          }
        ]
      },
      {
        heading: "Overloaded Method Delegation",
        text: "Just like constructors, overloaded methods can delegate to one another. Rather than writing duplicate logic for a default action, have the zero-argument or simple method call the parameterized method.",
        codeSnippet: "public class Counter {\n    private int value;\n\n    public void increase() {\n        this.increase(1); // Delegates\n    }\n\n    public void increase(int amount) {\n        if (amount > 0) {\n            this.value += amount;\n        }\n    }\n}",
        terminalOutput: "// Both increase() and increase(5) share the single boundary check logic",
        tip: "If the business logic for increasing changes in the future, you only need to modify one method.",
        warning: "Make sure you do not create circular calls between methods without a base case.",
        mcq: {
          id: "j5-2-2",
          question: "Why does 'public void increase() { this.increase(1); }' represent good software engineering practice?",
          options: [
            { id: "A", text: "It follows the DRY (Don't Repeat Yourself) principle, establishing increase(int) as the single source of truth for value increments", explanationIfWrong: "" },
            { id: "B", text: "It forces the garbage collector to clear unused integers", explanationIfWrong: "Delegation has nothing to do with garbage collection." },
            { id: "C", text: "It makes the method execute asynchronously in a background thread", explanationIfWrong: "Method calls are synchronous unless explicitly threaded." },
            { id: "D", text: "It converts primitive integers to strings", explanationIfWrong: "No string conversion occurs." }
          ],
          correctAnswer: "A",
          explanationNote: "Delegating simpler overloads to a comprehensive one eliminates code duplication (DRY principle)."
        },
        questionPool: [
          {
            id: "j5-2-2-alt1",
            question: "What would happen if 'increase()' called 'increase(1)' and 'increase(int amount)' called 'increase()'?",
            options: [
              { id: "A", text: "A StackOverflowError would occur at runtime due to infinite mutual recursion", explanationIfWrong: "" },
              { id: "B", text: "The value would increase by exactly 2", explanationIfWrong: "Infinite mutual recursion never terminates." },
              { id: "C", text: "The compiler would rewrite the methods into a while loop", explanationIfWrong: "Java compilers do not auto-rewrite infinite mutual recursion." },
              { id: "D", text: "The program executes normally", explanationIfWrong: "The call stack fills up until a StackOverflowError is thrown." }
            ],
            correctAnswer: "A",
            explanationNote: "Mutual calls between methods without a termination base condition cause infinite recursion and crash with StackOverflowError."
          },
          {
            id: "j5-2-2-alt2",
            question: "Which term describes designing code where every piece of business logic is defined in exactly one place?",
            options: [
              { id: "A", text: "Single Source of Truth (DRY principle)", explanationIfWrong: "" },
              { id: "B", text: "Method shadowing", explanationIfWrong: "Shadowing refers to identifier conflicts." },
              { id: "C", text: "Dynamic dispatching", explanationIfWrong: "Dynamic dispatch is runtime polymorphism." },
              { id: "D", text: "Constructor hoarding", explanationIfWrong: "Not a real term." }
            ],
            correctAnswer: "A",
            explanationNote: "The Single Source of Truth / DRY principle ensures each business rule lives in one authoritative location."
          }
        ]
      },
      {
        heading: "Default Values in Objects",
        text: "Instance variables have default values in Java: numeric primitives are 0 (or 0.0), booleans are false, and object references are null. However, relying on implicit nulls can lead to NullPointerExceptions. Explicitly initializing defaults in constructors or field declarations is much safer.",
        codeSnippet: "public class Player {\n    private String name;\n    private int score;\n    private boolean active;\n\n    public Player(String name) {\n        this(name, 0, true); // Explicit defaults: 0 score, active = true\n    }\n\n    public Player(String name, int score, boolean active) {\n        this.name = name;\n        this.score = score;\n        this.active = active;\n    }\n}",
        terminalOutput: "Player p = new Player(\"Ada\");\n// name = \"Ada\", score = 0, active = true",
        tip: "Providing sensible default constructors reduces cognitive overhead for callers.",
        warning: "Never allow string fields to remain null if your class methods assume they can call .length() or .toUpperCase().",
        mcq: {
          id: "j5-2-3",
          question: "What is the default value of an uninitialized object reference field (e.g. 'private String name;') in a Java class?",
          options: [
            { id: "A", text: "null", explanationIfWrong: "" },
            { id: "B", text: "\"\"", explanationIfWrong: "Empty string is an object; Java does not instantiate empty strings automatically." },
            { id: "C", text: "0", explanationIfWrong: "0 is the default for numeric primitives, not object references." },
            { id: "D", text: "undefined", explanationIfWrong: "'undefined' is a JavaScript concept, not a Java keyword or value." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, all uninitialized object reference fields default to null."
        },
        questionPool: [
          {
            id: "j5-2-3-alt1",
            question: "What is the default value of an uninitialized primitive boolean field in a Java class?",
            options: [
              { id: "A", text: "false", explanationIfWrong: "" },
              { id: "B", text: "true", explanationIfWrong: "Java defaults primitive booleans to false." },
              { id: "C", text: "null", explanationIfWrong: "Primitive booleans cannot hold null." },
              { id: "D", text: "-1", explanationIfWrong: "Booleans hold boolean values (true/false), not integers." }
            ],
            correctAnswer: "A",
            explanationNote: "Uninitialized primitive boolean fields always default to false."
          },
          {
            id: "j5-2-3-alt2",
            question: "Why is initializing string fields to \"\" or providing explicit constructor values better than leaving them as null?",
            options: [
              { id: "A", text: "It prevents unexpected NullPointerExceptions when calling methods like .length() or .equals() on the field", explanationIfWrong: "" },
              { id: "B", text: "Because null strings are forbidden by the compiler", explanationIfWrong: "Null fields compile fine, but risk runtime crashes." },
              { id: "C", text: "It makes the object immutable", explanationIfWrong: "Default initialization does not make fields final or immutable." },
              { id: "D", text: "It allows primitives to be converted into arrays", explanationIfWrong: "Initialization does not convert primitives." }
            ],
            correctAnswer: "A",
            explanationNote: "Ensuring reference fields are non-null prevents accidental NullPointerExceptions when accessing their methods."
          }
        ]
      },
      {
        heading: "Private Helper Methods for Repetitive Validation",
        text: "When multiple methods perform the same verification (such as validating that a percentage is between 0 and 100, or a string is non-empty), extract that logic into a 'private' helper method. Private methods cannot be called from outside the class, keeping the public API clean.",
        codeSnippet: "public class HealthScore {\n    private int score;\n\n    public HealthScore(int initial) {\n        setScore(initial);\n    }\n\n    public void setScore(int score) {\n        if (!isValid(score)) return;\n        this.score = score;\n    }\n\n    private boolean isValid(int value) {\n        return value >= 0 && value <= 100;\n    }\n}",
        terminalOutput: "// Validation logic is encapsulated inside the private isValid() helper",
        tip: "Mark helper methods as 'private' unless external callers have a clear reason to use them.",
        warning: "Public validation methods expose internal validation details that external callers shouldn't depend on.",
        mcq: {
          id: "j5-2-4",
          question: "Why should internal validation methods like 'isValid(int value)' be declared 'private'?",
          options: [
            { id: "A", text: "To hide internal implementation details and keep the public class interface minimal and focused", explanationIfWrong: "" },
            { id: "B", text: "Because private methods execute twice as fast as public methods", explanationIfWrong: "Visibility modifiers do not alter execution speed." },
            { id: "C", text: "Because Java does not permit boolean methods to be public", explanationIfWrong: "Boolean methods can have any visibility." },
            { id: "D", text: "To prevent the JVM from compiling the method", explanationIfWrong: "Private methods are compiled normally." }
          ],
          correctAnswer: "A",
          explanationNote: "Encapsulation principle: mark internal helper methods private to protect internal mechanics from external coupling."
        },
        questionPool: [
          {
            id: "j5-2-4-alt1",
            question: "What happens if code in an external class tries to call a private method directly?",
            options: [
              { id: "A", text: "A compilation error occurs ('has private access in...')", explanationIfWrong: "" },
              { id: "B", text: "The method returns null", explanationIfWrong: "Private access violations fail at compile time." },
              { id: "C", text: "The method executes in a sandbox", explanationIfWrong: "Java's compiler strictly rejects access to private members." },
              { id: "D", text: "A runtime SecurityException is thrown", explanationIfWrong: "It is a compile-time error, not a runtime exception." }
            ],
            correctAnswer: "A",
            explanationNote: "The Java compiler enforces access control and rejects compilation if external code attempts to access private members."
          },
          {
            id: "j5-2-4-alt2",
            question: "What is the benefit of extracting repetitive validation into a single helper method?",
            options: [
              { id: "A", text: "If validation rules change, they only need to be updated in one place", explanationIfWrong: "" },
              { id: "B", text: "It doubles the heap memory allocated for each object", explanationIfWrong: "It reduces code duplication, not memory usage." },
              { id: "C", text: "It automatically saves valid objects to disk", explanationIfWrong: "Validation helpers do not interact with disk storage." },
              { id: "D", text: "It converts loops into recursion", explanationIfWrong: "Validation has nothing to do with recursion." }
            ],
            correctAnswer: "A",
            explanationNote: "Centralizing validation in a single method ensures consistency and effortless future maintenance."
          }
        ]
      },
      {
        heading: "Refactoring toString() with Helper Methods",
        text: "Complex objects often need formatted text representations. When toString() formats several fields (like zero-padding days or formatting currencies), break formatting into smaller helper methods or delegate to component objects.",
        codeSnippet: "public class SimpleDate {\n    private int day;\n    private int month;\n    private int year;\n\n    public String toString() {\n        return formatTwoDigits(this.day) + \".\" + formatTwoDigits(this.month) + \".\" + this.year;\n    }\n\n    private String formatTwoDigits(int number) {\n        if (number < 10) return \"0\" + number;\n        return String.valueOf(number);\n    }\n}",
        terminalOutput: "SimpleDate d = new SimpleDate(5, 7, 2026);\nSystem.out.println(d); // Outputs: 05.07.2026",
        tip: "Reusable formatting helpers keep toString() clean, readable, and easy to adjust.",
        warning: "Never perform heavy file reading or network requests inside a toString() method.",
        mcq: {
          id: "j5-2-5",
          question: "What output does the SimpleDate class above produce for 'new SimpleDate(5, 7, 2026)'?",
          options: [
            { id: "A", text: "\"05.07.2026\"", explanationIfWrong: "" },
            { id: "B", text: "\"5.7.2026\"", explanationIfWrong: "The formatTwoDigits method adds a leading zero for numbers under 10." },
            { id: "C", text: "\"2026-07-05\"", explanationIfWrong: "The code formats day.month.year with dots." },
            { id: "D", text: "\"5/7/2026\"", explanationIfWrong: "Dots are used as delimiters in the implementation." }
          ],
          correctAnswer: "A",
          explanationNote: "Since 5 and 7 are less than 10, formatTwoDigits prefixes them with '0', producing \"05.07.2026\"."
        },
        questionPool: [
          {
            id: "j5-2-5-alt1",
            question: "Why should toString() methods be fast and side-effect free?",
            options: [
              { id: "A", text: "Because toString() is called implicitly during debugging, logging, and string concatenation, so side effects could cause unpredictable behavior", explanationIfWrong: "" },
              { id: "B", text: "Because Java will terminate any toString() that takes longer than 1 millisecond", explanationIfWrong: "Java does not kill slow methods, but slow toString() degrades performance." },
              { id: "C", text: "Because toString() can only return static strings", explanationIfWrong: "toString() dynamically formats instance fields." },
              { id: "D", text: "Because toString() deletes the object after printing", explanationIfWrong: "Printing does not alter object lifecycle." }
            ],
            correctAnswer: "A",
            explanationNote: "toString() is called implicitly throughout logging, debugging, and UI tools. It should never alter state or perform heavy operations."
          },
          {
            id: "j5-2-5-alt2",
            question: "What does 'String.valueOf(number)' do?",
            options: [
              { id: "A", text: "Converts the primitive integer into its equivalent String representation", explanationIfWrong: "" },
              { id: "B", text: "Returns the square root of the number", explanationIfWrong: "That is Math.sqrt()." },
              { id: "C", text: "Converts the number to ASCII binary bytes", explanationIfWrong: "It produces a human-readable decimal String." },
              { id: "D", text: "Throws a NumberFormatException", explanationIfWrong: "String.valueOf() safely converts primitives to Strings." }
            ],
            correctAnswer: "A",
            explanationNote: "String.valueOf(number) converts primitive values into their string representations."
          }
        ]
      },
      {
        heading: "Eliminating Repeated Calculations with Cached Fields",
        text: "If an expensive calculation is required repeatedly and the underlying state rarely changes, consider caching the result in an instance variable. Alternatively, compute it on demand if the data updates frequently to prevent cache invalidation bugs.",
        codeSnippet: "public class Rectangle {\n    private int width;\n    private int height;\n\n    public Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int area() {\n        return this.width * this.height;\n    }\n}",
        terminalOutput: "Rectangle r = new Rectangle(10, 5);\nSystem.out.println(r.area()); // 50",
        tip: "For simple operations like area, calculating on demand avoids having to sync a 'cachedArea' field whenever width or height changes.",
        warning: "Storing redundant derived data as fields requires carefully updating them whenever base fields change.",
        mcq: {
          id: "j5-2-6",
          question: "Why is calculating 'area()' on-the-fly via a method often safer than storing an 'area' instance variable?",
          options: [
            { id: "A", text: "It prevents state desynchronization bugs where width or height is modified without updating the cached area", explanationIfWrong: "" },
            { id: "B", text: "Because multiplication is illegal in constructor bodies", explanationIfWrong: "Constructors can perform any valid arithmetic." },
            { id: "C", text: "Because methods do not consume CPU cycles", explanationIfWrong: "All code consumes CPU cycles." },
            { id: "D", text: "Because instance variables cannot store integers", explanationIfWrong: "Instance variables regularly store primitive integers." }
          ],
          correctAnswer: "A",
          explanationNote: "Computing derived values dynamically avoids stale/out-of-sync data if source fields are mutated."
        },
        questionPool: [
          {
            id: "j5-2-6-alt1",
            question: "What is derived data in an object-oriented model?",
            options: [
              { id: "A", text: "Data that can be calculated or deduced directly from existing base instance variables", explanationIfWrong: "" },
              { id: "B", text: "Data downloaded from an external website", explanationIfWrong: "Derived data is computed from other fields." },
              { id: "C", text: "Variables declared with the 'derived' keyword", explanationIfWrong: "There is no 'derived' keyword in Java." },
              { id: "D", text: "Code compiled in debug mode", explanationIfWrong: "Derived data refers to computed values." }
            ],
            correctAnswer: "A",
            explanationNote: "Derived data is any value computed directly from fundamental attributes (e.g. age from birthday, or area from width and height)."
          },
          {
            id: "j5-2-6-alt2",
            question: "If a class has mutable fields and caches derived values, what must mutator methods do?",
            options: [
              { id: "A", text: "Recalculate or invalidate the cached derived values whenever base fields are modified", explanationIfWrong: "" },
              { id: "B", text: "Delete the class definition from the JVM", explanationIfWrong: "Mutators should update state cleanly." },
              { id: "C", text: "Make the fields public", explanationIfWrong: "Fields should remain encapsulated." },
              { id: "D", text: "Throw an UnsupportedOperationException", explanationIfWrong: "Mutator methods should keep internal state synchronized." }
            ],
            correctAnswer: "A",
            explanationNote: "When caching derived fields, mutators must ensure cached values are kept synchronized with base field changes."
          }
        ]
      }
    ]
  },
  {
    id: "5-3-primitive-and-reference",
    number: "5.3",
    title: "Primitive and Reference Variables",
    subtitle: "Understand Stack vs Heap memory, pass-by-value semantics, object references, and null pointer mechanics.",
    readTime: "25 min",
    objectives: [
      "Distinguish between primitive types (stored directly in variable memory) and reference types (storing memory addresses)",
      "Explain how the JVM Call Stack and Heap collaborate during program execution",
      "Understand pass-by-value semantics for both primitives and object references",
      "Diagnose and prevent NullPointerExceptions",
      "Inspect memory diagrams of object references and heap instances",
      "Safely handle null checks using defensive programming"
    ],
    theoryBlocks: [
      {
        heading: "Primitive vs Reference Variables in Memory",
        text: "Java categorizes types into two fundamental groups: primitive types (int, double, boolean, char, etc.) and reference types (all classes and arrays). A primitive variable directly holds the literal value in its memory slot on the call stack. A reference variable holds the memory address of an object located in the heap.",
        codeSnippet: "int number = 10;            // Primitive: holds literal value 10\nPerson ada = new Person();  // Reference: holds memory address of Person object in Heap",
        terminalOutput: "// 'number' holds 10 directly\n// 'ada' holds a pointer like @0x7f4a pointing to Heap memory",
        tip: "Primitive values are stored directly inside the variable. Reference variables store a pointer (address) to where the object lives on the heap.",
        warning: "Assigning reference variables (p2 = p1) does NOT copy the object; it only copies the memory address!",
        mcq: {
          id: "j5-3-1",
          question: "What is the key difference between what is stored in a primitive variable versus a reference variable?",
          options: [
            { id: "A", text: "A primitive variable stores the literal value itself; a reference variable stores a memory address pointing to an object on the heap", explanationIfWrong: "" },
            { id: "B", text: "Primitive variables are stored on the hard drive; references are stored in CPU registers only", explanationIfWrong: "Both variables reside in memory (RAM)." },
            { id: "C", text: "Primitive variables can hold null; reference variables cannot", explanationIfWrong: "Primitives can never be null; only reference types can hold null." },
            { id: "D", text: "There is no difference in modern Java versions", explanationIfWrong: "The distinction between primitive and reference types is fundamental to the JVM architecture." }
          ],
          correctAnswer: "A",
          explanationNote: "Primitives store raw binary values directly. Reference variables store memory addresses referencing heap-allocated objects."
        },
        questionPool: [
          {
            id: "j5-3-1-alt1",
            question: "Which of the following is a primitive type in Java?",
            options: [
              { id: "A", text: "double", explanationIfWrong: "" },
              { id: "B", text: "String", explanationIfWrong: "String is a reference class." },
              { id: "C", text: "ArrayList", explanationIfWrong: "ArrayList is a collection class." },
              { id: "D", text: "Scanner", explanationIfWrong: "Scanner is a reference class." }
            ],
            correctAnswer: "A",
            explanationNote: "Java has 8 primitive types: byte, short, int, long, float, double, boolean, and char."
          },
          {
            id: "j5-3-1-alt2",
            question: "Can a primitive variable of type 'int' ever hold the value 'null'?",
            options: [
              { id: "A", text: "No, primitive types can never hold null; only reference types can be null", explanationIfWrong: "" },
              { id: "B", text: "Yes, if assigned explicitly like: int x = null;", explanationIfWrong: "Writing 'int x = null;' produces a compile-time type mismatch error." },
              { id: "C", text: "Only in Java 21 and above", explanationIfWrong: "Primitives cannot hold null in any Java version." },
              { id: "D", text: "Only inside while loops", explanationIfWrong: "Primitives never hold null regardless of context." }
            ],
            correctAnswer: "A",
            explanationNote: "Primitives always store literal numbers, characters, or booleans. Only reference types can point to null."
          }
        ]
      },
      {
        heading: "Copying Variables: Primitives vs References",
        text: "When you assign one variable to another ('b = a'), Java ALWAYS copies the value stored in 'a' into 'b'. For primitive types, this copies the actual number. For reference types, it copies the memory address, meaning both variables now point to the exact same object in heap memory.",
        codeSnippet: "// Primitives:\nint a = 10;\nint b = a;\nb = 20; // 'a' is still 10!\n\n// References:\nPerson p1 = new Person(\"Ada\");\nPerson p2 = p1;\np2.growOlder(); // Modifies the object both p1 and p2 point to!",
        terminalOutput: "System.out.println(p1.getAge()); // 1! p1 reflects the change!",
        tip: "Assigning reference variables creates an alias (another name) for the same object, not a clone.",
        warning: "If two references point to the same object, mutations through one reference are immediately visible through the other.",
        mcq: {
          id: "j5-3-2",
          question: "Given: 'Person p1 = new Person(\"Ada\"); Person p2 = p1; p2.growOlder();', what does 'p1.getAge()' return if age started at 0?",
          options: [
            { id: "A", text: "1, because p1 and p2 point to the exact same Person instance on the heap", explanationIfWrong: "" },
            { id: "B", text: "0, because p2 was a completely separate independent copy of p1", explanationIfWrong: "Assignment copies the reference, not the underlying object." },
            { id: "C", text: "null", explanationIfWrong: "The getAge() method returns an int." },
            { id: "D", text: "A NullPointerException is thrown", explanationIfWrong: "Both references are valid non-null pointers." }
          ],
          correctAnswer: "A",
          explanationNote: "Assigning p2 = p1 copies the reference address. Both variables point to the identical object on the heap, so calling p2.growOlder() mutates the object observed by p1."
        },
        questionPool: [
          {
            id: "j5-3-2-alt1",
            question: "Given: 'int x = 5; int y = x; y = 15;'. What is the value of 'x'?",
            options: [
              { id: "A", text: "5", explanationIfWrong: "" },
              { id: "B", text: "15", explanationIfWrong: "Primitives copy their value; changing y has zero effect on x." },
              { id: "C", text: "20", explanationIfWrong: "No addition takes place." },
              { id: "D", text: "0", explanationIfWrong: "x remains 5." }
            ],
            correctAnswer: "A",
            explanationNote: "Primitives copy raw values. Changing 'y' does not modify 'x'."
          },
          {
            id: "j5-3-2-alt2",
            question: "How do you create a truly independent second Person object with the same attributes as an existing one?",
            options: [
              { id: "A", text: "Instantiate a new object with 'new Person(p1.getName(), p1.getAge())'", explanationIfWrong: "" },
              { id: "B", text: "Write Person p2 = p1;", explanationIfWrong: "That creates a reference alias, not an independent object." },
              { id: "C", text: "Write Person p2 = (Person) p1.address();", explanationIfWrong: "Not valid Java syntax." },
              { id: "D", text: "Call p1.duplicate()", explanationIfWrong: "Classes do not have duplicate() unless explicitly implemented." }
            ],
            correctAnswer: "A",
            explanationNote: "To create an independent copy, allocate a new instance on the heap with 'new' and copy the field values."
          }
        ]
      },
      {
        heading: "Pass-by-Value Semantics in Java",
        text: "Java is strictly pass-by-value. When a method is called, Java copies the argument's value into the parameter variable on the stack. For primitives, changes to the parameter inside the method do NOT affect the caller's variable. For reference variables, copying the address means both point to the same heap object.",
        codeSnippet: "public class Test {\n    public static void modifyPrimitive(int x) {\n        x = 99;\n    }\n\n    public static void modifyObject(Person p) {\n        p.growOlder();\n    }\n}\n\n// In main:\nint val = 5;\nTest.modifyPrimitive(val); // val is STILL 5!\n\nPerson ada = new Person(\"Ada\");\nTest.modifyObject(ada);    // ada's age IS modified!",
        terminalOutput: "val: 5\nada age: 1",
        tip: "Remember: the reference (memory address) is passed by value. Reassigning the parameter ('p = new Person()') will NOT reassign the caller's variable!",
        warning: "Reassigning a parameter variable inside a method only changes the local copy on the stack, not the caller's reference.",
        mcq: {
          id: "j5-3-3",
          question: "If a method executes 'p = new Person(\"Bob\");' on an object parameter 'p', what happens to the caller's variable that was passed into the method?",
          options: [
            { id: "A", text: "The caller's variable remains completely unchanged, because parameter 'p' only changed its local reference address copy on the stack", explanationIfWrong: "" },
            { id: "B", text: "The caller's variable now points to the new Bob Person object", explanationIfWrong: "Java passes references by value. Reassigning the parameter does not reassign the caller's variable." },
            { id: "C", text: "The original object is deleted from memory", explanationIfWrong: "The caller still holds a reference to the original object." },
            { id: "D", text: "A compilation error occurs", explanationIfWrong: "Reassigning parameter variables is valid Java code." }
          ],
          correctAnswer: "A",
          explanationNote: "Java passes copies of reference addresses. Reassigning the parameter variable only repoints the local stack variable; the caller's variable still points to its original object."
        },
        questionPool: [
          {
            id: "j5-3-3-alt1",
            question: "Why does 'modifyPrimitive(int x)' not alter the caller's original integer variable?",
            options: [
              { id: "A", text: "Because the parameter receives a copy of the integer literal on its own stack frame", explanationIfWrong: "" },
              { id: "B", text: "Because primitives are stored in read-only memory", explanationIfWrong: "Primitives are stored on the mutable stack." },
              { id: "C", text: "Because Java requires pointers to modify integers", explanationIfWrong: "Java does not expose pointer arithmetic." },
              { id: "D", text: "Because methods can only mutate Strings", explanationIfWrong: "Strings are actually immutable in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "The method's parameter is an isolated local variable initialized with a copy of the caller's argument value."
          },
          {
            id: "j5-3-3-alt2",
            question: "Which of the following operations inside 'public static void doSomething(Person p)' WILL affect the caller's object?",
            options: [
              { id: "A", text: "p.setName(\"Grace\");", explanationIfWrong: "" },
              { id: "B", text: "p = null;", explanationIfWrong: "Setting p to null only clears the local parameter variable, not the caller's variable." },
              { id: "C", text: "p = new Person(\"Grace\");", explanationIfWrong: "Reassigning p repoints only the local stack variable." },
              { id: "D", text: "int p = 5;", explanationIfWrong: "This is a compilation error (duplicate local variable name)." }
            ],
            correctAnswer: "A",
            explanationNote: "Invoking a mutator method through the reference modifies the internal state of the shared object on the heap."
          }
        ]
      },
      {
        heading: "The null Reference and NullPointerException",
        text: "The literal 'null' represents the absence of an object. A reference variable initialized to null points to no memory address on the heap. Attempting to call methods or access fields on a null reference immediately throws a NullPointerException (NPE).",
        codeSnippet: "Person person = null;\n\n// Safe null check:\nif (person != null) {\n    System.out.println(person.getName());\n} else {\n    System.out.println(\"Person reference is null!\");\n}",
        terminalOutput: "Person reference is null!",
        tip: "Always check for null before invoking methods on objects returned from searches or external inputs.",
        warning: "Never call '.equals()' on a variable that might be null: write '\"constant\".equals(var)' instead of 'var.equals(\"constant\")'.",
        mcq: {
          id: "j5-3-4",
          question: "What error occurs if code executes 'person.getName()' when 'person' holds the value 'null'?",
          options: [
            { id: "A", text: "NullPointerException at runtime", explanationIfWrong: "" },
            { id: "B", text: "A compilation error ('person cannot be null')", explanationIfWrong: "Holding null is syntactically valid; dereferencing null causes a runtime exception." },
            { id: "C", text: "It returns an empty string \"\"", explanationIfWrong: "Java does not substitute empty strings for null dereferences." },
            { id: "D", text: "The JVM restarts", explanationIfWrong: "The JVM throws a standard runtime exception." }
          ],
          correctAnswer: "A",
          explanationNote: "Attempting to dereference null (invoking methods or accessing fields on null) throws NullPointerException."
        },
        questionPool: [
          {
            id: "j5-3-4-alt1",
            question: "Why is '\"exit\".equals(command)' safer than 'command.equals(\"exit\")'?",
            options: [
              { id: "A", text: "Because the literal \"exit\" is guaranteed non-null, so it will never throw NullPointerException even if 'command' is null", explanationIfWrong: "" },
              { id: "B", text: "Because literal strings compile faster", explanationIfWrong: "The safety advantage is preventing NullPointerException." },
              { id: "C", text: "Because command.equals is private", explanationIfWrong: "String.equals is public." },
              { id: "D", text: "Because \"exit\" is stored in binary code", explanationIfWrong: "Both strings are in memory." }
            ],
            correctAnswer: "A",
            explanationNote: "Placing the non-null constant on the left (\"exit\".equals(input)) safely returns false if input is null without throwing an NPE."
          },
          {
            id: "j5-3-4-alt2",
            question: "What does the method call 'Objects.requireNonNull(person, \"Person cannot be null\")' do?",
            options: [
              { id: "A", text: "Throws a NullPointerException with the custom message if person is null, otherwise returns person", explanationIfWrong: "" },
              { id: "B", text: "Creates a new Person if person is null", explanationIfWrong: "It validates and throws an exception, it does not instantiate default objects." },
              { id: "C", text: "Deletes person from memory", explanationIfWrong: "It performs validation." },
              { id: "D", text: "Converts person to JSON", explanationIfWrong: "Objects.requireNonNull is a validation utility." }
            ],
            correctAnswer: "A",
            explanationNote: "Objects.requireNonNull enforces non-null constraints and provides clear, descriptive error messages."
          }
        ]
      },
      {
        heading: "Garbage Collection & Object Lifecycle",
        text: "In Java, developers do not manually free memory. The Java Virtual Machine features an automatic Garbage Collector (GC). When an object on the heap no longer has any active references pointing to it, the JVM marks it as eligible for garbage collection and reclaims its memory.",
        codeSnippet: "Person p = new Person(\"Ada\");\np = new Person(\"Bob\"); \n// The \"Ada\" Person object no longer has any references pointing to it.\n// It is now eligible for Garbage Collection!",
        terminalOutput: "// \"Ada\" memory is automatically reclaimed by the JVM Garbage Collector",
        tip: "Setting reference variables to null or letting them fall out of scope allows the GC to reclaim heap memory.",
        warning: "You do not need to call System.gc() in standard Java applications; the JVM manages garbage collection automatically.",
        mcq: {
          id: "j5-3-5",
          question: "When does an object on the heap become eligible for Garbage Collection in Java?",
          options: [
            { id: "A", text: "When there are no longer any reachable references pointing to it in the program", explanationIfWrong: "" },
            { id: "B", text: "Exactly 10 seconds after it is instantiated with 'new'", explanationIfWrong: "Garbage collection is based on reachability, not time." },
            { id: "C", text: "Only when the user closes the application window", explanationIfWrong: "The GC runs periodically while the application is active." },
            { id: "D", text: "Only when the programmer manually executes the 'delete' keyword", explanationIfWrong: "Java has no 'delete' keyword." }
          ],
          correctAnswer: "A",
          explanationNote: "An object is eligible for garbage collection as soon as it is unreachable by any active thread or reference chain."
        },
        questionPool: [
          {
            id: "j5-3-5-alt1",
            question: "Does Java have a 'delete' or 'free' keyword like C++ for manual memory deallocation?",
            options: [
              { id: "A", text: "No, Java memory is automatically managed by the Garbage Collector", explanationIfWrong: "" },
              { id: "B", text: "Yes, 'delete objectName;' is standard in Java", explanationIfWrong: "There is no 'delete' operator for memory deallocation in Java." },
              { id: "C", text: "Only for arrays", explanationIfWrong: "Arrays are objects and are also garbage collected." },
              { id: "D", text: "Only inside static methods", explanationIfWrong: "Java uses automatic GC everywhere." }
            ],
            correctAnswer: "A",
            explanationNote: "Java eliminates manual memory management and dangling pointer vulnerabilities via automatic garbage collection."
          },
          {
            id: "j5-3-5-alt2",
            question: "What happens to objects created inside a method once the method finishes execution?",
            options: [
              { id: "A", text: "Local reference variables on the stack are popped off, making unreturned objects unreachable and eligible for GC", explanationIfWrong: "" },
              { id: "B", text: "They are permanently saved to disk", explanationIfWrong: "Heap memory is in RAM, not persisted to disk." },
              { id: "C", text: "They are converted into global static variables", explanationIfWrong: "Local variables are discarded." },
              { id: "D", text: "The JVM crashes", explanationIfWrong: "Standard stack frame deallocation." }
            ],
            correctAnswer: "A",
            explanationNote: "When a method returns, its stack frame is popped. If references to objects created inside weren't returned or saved elsewhere, they become eligible for GC."
          }
        ]
      },
      {
        heading: "Stack Memory vs Heap Memory",
        text: "The JVM divides memory primarily into the Call Stack and the Heap. Method invocations and local primitive variables live on the Stack in isolated stack frames. All object instances (including Strings and Arrays) live on the Heap. Reference variables on the Stack simply hold pointers to the Heap.",
        codeSnippet: "public void createData() {\n    int count = 5;                // 'count' lives on the Stack\n    String text = \"Hello\";        // 'text' reference on Stack points to String on Heap\n    Person p = new Person(\"Ada\"); // 'p' reference on Stack points to Person on Heap\n}",
        terminalOutput: "// When createData() finishes, its stack frame vanishes!",
        tip: "Stack allocation is extremely fast and scoped to method calls. Heap allocation is for persistent objects with dynamic lifetimes.",
        warning: "Stack overflow occurs if recursion is too deep; OutOfMemory occurs if the heap runs out of RAM.",
        mcq: {
          id: "j5-3-6",
          question: "Where are local primitive variables stored during method execution in Java?",
          options: [
            { id: "A", text: "On the Call Stack inside the method's stack frame", explanationIfWrong: "" },
            { id: "B", text: "On the shared Heap memory", explanationIfWrong: "Objects live on the heap; local primitives live on the stack." },
            { id: "C", text: "Directly in the hard drive swap partition", explanationIfWrong: "The JVM operates in RAM." },
            { id: "D", text: "Inside the byte-code .class file", explanationIfWrong: "Bytecode defines instructions; runtime execution values are on the stack." }
          ],
          correctAnswer: "A",
          explanationNote: "Method execution frames and their local variables reside on the Call Stack."
        },
        questionPool: [
          {
            id: "j5-3-6-alt1",
            question: "Where do instance variables declared inside a class (e.g. 'private int age;') live in memory?",
            options: [
              { id: "A", text: "On the Heap, inside the memory allocated for the object instance", explanationIfWrong: "" },
              { id: "B", text: "On the Call Stack", explanationIfWrong: "Local variables are on the stack; instance variables live with their object on the heap." },
              { id: "C", text: "In the CPU registers permanently", explanationIfWrong: "Objects reside in heap memory in RAM." },
              { id: "D", text: "In the Java installation directory", explanationIfWrong: "All program data resides in RAM." }
            ],
            correctAnswer: "A",
            explanationNote: "Because an object lives on the heap, all of its instance variables live inside that object on the heap."
          },
          {
            id: "j5-3-6-alt2",
            question: "What exception is thrown when infinite recursion exhausts all available memory on the Call Stack?",
            options: [
              { id: "A", text: "StackOverflowError", explanationIfWrong: "" },
              { id: "B", text: "OutOfMemoryError", explanationIfWrong: "OutOfMemoryError occurs when the heap runs out of space; infinite recursion exhausts the stack." },
              { id: "C", text: "NullPointerException", explanationIfWrong: "NPE occurs when dereferencing null." },
              { id: "D", text: "ArrayIndexOutOfBoundsException", explanationIfWrong: "This occurs on invalid array indexing." }
            ],
            correctAnswer: "A",
            explanationNote: "Infinite recursion adds stack frames until the stack limit is exceeded, throwing StackOverflowError."
          }
        ]
      }
    ]
  },
  {
    id: "5-4-objects-and-references",
    number: "5.4",
    title: "Objects and References",
    subtitle: "Returning objects from methods, defensive copying, handling multiple references, and immutability.",
    readTime: "25 min",
    objectives: [
      "Return object references from methods safely",
      "Understand the implications of aliasing and multiple references to the same object",
      "Implement defensive copying to protect encapsulated object state from external mutation",
      "Construct clone/copy constructors for custom classes",
      "Distinguish between mutable and immutable object architectures",
      "Model complex real-world relationships between domain objects"
    ],
    theoryBlocks: [
      {
        heading: "Returning Objects from Methods",
        text: "Methods can return object references just like they return primitives. When a method returns an object, it hands back a reference pointing to the object on the heap. The caller can store this reference in a variable, invoke methods on it, or pass it to other methods.",
        codeSnippet: "public class Counter {\n    private int value;\n\n    public Counter clone() {\n        Counter copy = new Counter();\n        copy.value = this.value;\n        return copy; // Returns a reference to the newly instantiated Counter\n    }\n}",
        terminalOutput: "Counter c1 = new Counter();\nCounter c2 = c1.clone(); // c2 is a completely independent object",
        tip: "Returning a new object instance rather than internal mutable references protects encapsulation.",
        warning: "Returning a reference to an internal private mutable object allows external code to modify your internal state without your knowledge!",
        mcq: {
          id: "j5-4-1",
          question: "When a method creates a new object and returns it ('return new Person(name, age);'), where does the object exist after the method completes?",
          options: [
            { id: "A", text: "On the Heap, remaining alive as long as the caller holds a reference to it", explanationIfWrong: "" },
            { id: "B", text: "It is destroyed immediately because the method finished", explanationIfWrong: "Because the caller receives the reference, the object remains reachable and alive." },
            { id: "C", text: "It moves into the CPU register permanently", explanationIfWrong: "Objects reside in heap memory." },
            { id: "D", text: "It converts into an integer hash code", explanationIfWrong: "It remains a full live object." }
          ],
          correctAnswer: "A",
          explanationNote: "Objects created on the heap survive method execution as long as at least one reachable reference points to them."
        },
        questionPool: [
          {
            id: "j5-4-1-alt1",
            question: "What does the following method return: 'public Person getOldest(Person p1, Person p2) { return p1.getAge() > p2.getAge() ? p1 : p2; }'?",
            options: [
              { id: "A", text: "A reference to either p1 or p2 (whichever has the greater age)", explanationIfWrong: "" },
              { id: "B", text: "A new third Person object", explanationIfWrong: "It returns an existing reference, it does not call 'new'." },
              { id: "C", text: "The numeric age integer", explanationIfWrong: "The return type is Person, not int." },
              { id: "D", text: "null always", explanationIfWrong: "It returns whichever reference is older." }
            ],
            correctAnswer: "A",
            explanationNote: "The method returns the reference to whichever existing Person object satisfies the condition."
          },
          {
            id: "j5-4-1-alt2",
            question: "Can a method return 'null' if its return type is a class (e.g. Person)?",
            options: [
              { id: "A", text: "Yes, any method with an object return type can return null to signify 'no object found'", explanationIfWrong: "" },
              { id: "B", text: "No, Java requires methods to return instantiated objects only", explanationIfWrong: "Returning null is standard when an item is not found." },
              { id: "C", text: "Only if the method is void", explanationIfWrong: "void methods cannot return any value." },
              { id: "D", text: "Only in catch blocks", explanationIfWrong: "Methods can return null anywhere." }
            ],
            correctAnswer: "A",
            explanationNote: "Reference types can be null. Returning null is a common pattern to indicate that no matching object was found."
          }
        ]
      },
      {
        heading: "Encapsulation Leaks & Defensive Copying",
        text: "If a getter method directly returns a reference to an internal mutable object (such as an ArrayList or Date), external callers can modify that internal object directly, bypassing the class's validation and encapsulation. To prevent this, return a defensive copy.",
        codeSnippet: "public class Playlist {\n    private ArrayList<String> songs = new ArrayList<>();\n\n    // LEAK:\n    // public ArrayList<String> getSongs() { return this.songs; }\n\n    // SAFE (Defensive Copy):\n    public ArrayList<String> getSongs() {\n        return new ArrayList<>(this.songs); // Returns a new list copy\n    }\n}",
        terminalOutput: "// External callers can add/remove songs from their copy without corrupting Playlist!",
        tip: "Returning 'new ArrayList<>(this.list)' creates a shallow copy of the list, preventing external code from clearing or mutating your internal collection.",
        warning: "Never return direct references to private mutable collections or dates if you want true immutability.",
        mcq: {
          id: "j5-4-2",
          question: "What is the danger of returning 'return this.songs;' directly when 'songs' is a private ArrayList in Playlist?",
          options: [
            { id: "A", text: "External callers can call getSongs().clear() or add songs directly, modifying the class's internal state without validation", explanationIfWrong: "" },
            { id: "B", text: "Java will throw an AccessControlException", explanationIfWrong: "Returning the reference compiles and runs, but violates encapsulation." },
            { id: "C", text: "The songs will be permanently deleted from the hard drive", explanationIfWrong: "No disk deletion occurs." },
            { id: "D", text: "The method will return null", explanationIfWrong: "It returns the internal list reference." }
          ],
          correctAnswer: "A",
          explanationNote: "Exposing the internal reference allows external code to manipulate the list directly, bypassing class encapsulation."
        },
        questionPool: [
          {
            id: "j5-4-2-alt1",
            question: "How does defensive copying solve the encapsulation leak problem?",
            options: [
              { id: "A", text: "It creates and returns a separate copy of the collection, so external modifications only affect the copy, leaving the original intact", explanationIfWrong: "" },
              { id: "B", text: "It encrypts the collection with a password", explanationIfWrong: "Defensive copying duplicates data, not encryption." },
              { id: "C", text: "It converts all elements into integers", explanationIfWrong: "Elements retain their types." },
              { id: "D", text: "It makes the JVM run in single-threaded mode", explanationIfWrong: "Threading is unaffected." }
            ],
            correctAnswer: "A",
            explanationNote: "By returning a clone or new collection, external changes only affect the returned copy, preserving the internal object."
          },
          {
            id: "j5-4-2-alt2",
            question: "Which of the following creates a safe defensive copy of 'ArrayList<String> original'?",
            options: [
              { id: "A", text: "new ArrayList<>(original)", explanationIfWrong: "" },
              { id: "B", text: "original", explanationIfWrong: "That returns the exact same reference, not a copy." },
              { id: "C", text: "(ArrayList) original.cloneMemory()", explanationIfWrong: "cloneMemory is not a valid Java method." },
              { id: "D", text: "original.toString()", explanationIfWrong: "toString() returns a String, not an ArrayList." }
            ],
            correctAnswer: "A",
            explanationNote: "'new ArrayList<>(original)' copies all elements into a brand-new list instance."
          }
        ]
      },
      {
        heading: "Immutable Objects (e.g. String)",
        text: "An immutable object is an object whose internal state cannot be modified after it is created. In Java, String is the classic example of an immutable class: methods like '.toUpperCase()' or '.replace()' do NOT modify the existing string; they construct and return a brand-new String.",
        codeSnippet: "String text = \"hello\";\ntext.toUpperCase(); // Returns \"HELLO\", but doesn't modify 'text'!\n\nSystem.out.println(text); // Still \"hello\"!\ntext = text.toUpperCase(); // Must reassign to capture the new object!",
        terminalOutput: "hello\nHELLO (after reassigning)",
        tip: "Immutable objects are inherently thread-safe, cannot be corrupted by external callers, and require no defensive copying.",
        warning: "Remember to reassign: 'str = str.trim();' or the result of string manipulation will be lost.",
        mcq: {
          id: "j5-4-3",
          question: "Given 'String s = \"java\"; s.concat(\" rules\"); System.out.println(s);', what is printed?",
          options: [
            { id: "A", text: "\"java\"", explanationIfWrong: "" },
            { id: "B", text: "\"java rules\"", explanationIfWrong: "Strings are immutable! s.concat(...) returns a new String, but 's' was not reassigned." },
            { id: "C", text: "\" rules\"", explanationIfWrong: "'s' remains unchanged as \"java\"." },
            { id: "D", text: "null", explanationIfWrong: "'s' was initialized to \"java\"." }
          ],
          correctAnswer: "A",
          explanationNote: "Strings are immutable. 'concat' returns a new String; without reassigning 's = s.concat(...)', 's' remains \"java\"."
        },
        questionPool: [
          {
            id: "j5-4-3-alt1",
            question: "How do you make a custom class immutable in Java?",
            options: [
              { id: "A", text: "Declare all fields as 'private final', provide no setter methods, and return defensive copies of any mutable fields", explanationIfWrong: "" },
              { id: "B", text: "Add the 'immutable' keyword before class", explanationIfWrong: "There is no 'immutable' keyword in Java." },
              { id: "C", text: "Delete all constructors", explanationIfWrong: "Constructors are needed to initialize the final fields." },
              { id: "D", text: "Make all methods return void", explanationIfWrong: "Getters returning values are standard in immutable classes." }
            ],
            correctAnswer: "A",
            explanationNote: "Making fields private final and omitting mutator methods ensures state cannot change after instantiation."
          },
          {
            id: "j5-4-3-alt2",
            question: "Why are immutable objects especially valuable in concurrent multi-threaded programs?",
            options: [
              { id: "A", text: "Multiple threads can read them simultaneously without risk of data races or synchronization corruption", explanationIfWrong: "" },
              { id: "B", text: "They run 100 times faster than mutable objects", explanationIfWrong: "The key benefit is thread safety, not CPU acceleration." },
              { id: "C", text: "They bypass garbage collection", explanationIfWrong: "All heap objects are subject to garbage collection." },
              { id: "D", text: "They cannot be stored in ArrayLists", explanationIfWrong: "Immutable objects work seamlessly with all collections." }
            ],
            correctAnswer: "A",
            explanationNote: "Because immutable objects never change their internal state, concurrent threads can read them without locks or synchronization."
          }
        ]
      },
      {
        heading: "Object References as Instance Variables",
        text: "Objects frequently contain references to other domain objects. For example, a Person has a Pet, or an Order has a Customer. The containing object holds a reference pointing to the associated object on the heap, creating rich domain networks.",
        codeSnippet: "public class Person {\n    private String name;\n    private Pet pet;\n\n    public Person(String name, Pet pet) {\n        this.name = name;\n        this.pet = pet;\n    }\n\n    public String toString() {\n        return this.name + \" has a pet: \" + this.pet;\n    }\n}",
        terminalOutput: "Pet toothless = new Pet(\"Toothless\");\nPerson hiccup = new Person(\"Hiccup\", toothless);\nSystem.out.println(hiccup); // Hiccup has a pet: Toothless",
        tip: "This association models real-world domain relationships cleanly and intuitively.",
        warning: "If a person's pet can be null (e.g. they have no pet), handle null safely in toString().",
        mcq: {
          id: "j5-4-4",
          question: "In the example above, what does the 'this.pet' instance variable in Person store?",
          options: [
            { id: "A", text: "A reference address pointing to the Pet object on the heap", explanationIfWrong: "" },
            { id: "B", text: "A copy of the Pet class source code file", explanationIfWrong: "It stores an object reference." },
            { id: "C", text: "Only the string name of the pet", explanationIfWrong: "It stores the reference to the full Pet object." },
            { id: "D", text: "A primitive integer index", explanationIfWrong: "References in Java are typed object pointers, not manual array indices." }
          ],
          correctAnswer: "A",
          explanationNote: "Reference instance variables store memory pointers referencing their corresponding heap objects."
        },
        questionPool: [
          {
            id: "j5-4-4-alt1",
            question: "How can Person's toString() safely handle the case where 'pet' might be null?",
            options: [
              { id: "A", text: "Check: 'this.pet != null ? this.pet.toString() : \"no pet\"'", explanationIfWrong: "" },
              { id: "B", text: "Always call this.pet.toString() without checking", explanationIfWrong: "If pet is null, calling pet.toString() throws NullPointerException." },
              { id: "C", text: "Delete the pet variable", explanationIfWrong: "A ternary check cleanly resolves null representation." },
              { id: "D", text: "Catch OutOfMemoryError", explanationIfWrong: "The risk is NullPointerException, not OutOfMemoryError." }
            ],
            correctAnswer: "A",
            explanationNote: "Checking whether 'pet' is non-null before invoking methods prevents NullPointerExceptions."
          },
          {
            id: "j5-4-4-alt2",
            question: "If two Person objects (e.g. siblings) are created with the same Pet reference, what happens if pet.growOlder() is called?",
            options: [
              { id: "A", text: "Both siblings see the pet's updated age because both point to the exact same Pet object on the heap", explanationIfWrong: "" },
              { id: "B", text: "Only the first sibling sees the change", explanationIfWrong: "Both references share the identical object on the heap." },
              { id: "C", text: "The pet is duplicated into two pets", explanationIfWrong: "Java does not auto-duplicate shared references." },
              { id: "D", text: "A ConcurrentModificationException occurs", explanationIfWrong: "Modifying field values does not trigger collection exceptions." }
            ],
            correctAnswer: "A",
            explanationNote: "When multiple objects hold references to the same shared instance, any mutation to that instance is seen across all holding objects."
          }
        ]
      },
      {
        heading: "Copy Constructors",
        text: "A copy constructor is a constructor that creates a new object by copying the fields of an existing object of the same class. This provides an elegant, explicit technique for creating independent clones without relying on Java's legacy Object.clone().",
        codeSnippet: "public class SimpleDate {\n    private int day;\n    private int month;\n    private int year;\n\n    // Standard constructor:\n    public SimpleDate(int d, int m, int y) {\n        this.day = d; this.month = m; this.year = y;\n    }\n\n    // Copy constructor:\n    public SimpleDate(SimpleDate other) {\n        this(other.day, other.month, other.year);\n    }\n}",
        terminalOutput: "SimpleDate date1 = new SimpleDate(1, 1, 2026);\nSimpleDate date2 = new SimpleDate(date1); // Independent copy!",
        tip: "Copy constructors are easy to write, type-safe, and avoid the checked exceptions of Object.clone().",
        warning: "Ensure deep copying is performed if any of the copied fields are themselves mutable objects.",
        mcq: {
          id: "j5-4-5",
          question: "What is the primary role of a copy constructor like 'public SimpleDate(SimpleDate other)'?",
          options: [
            { id: "A", text: "To instantiate a new, independent object whose initial state is copied from an existing instance", explanationIfWrong: "" },
            { id: "B", text: "To delete the other object from memory", explanationIfWrong: "Constructors only create objects; they never delete other objects." },
            { id: "C", text: "To convert SimpleDate to String", explanationIfWrong: "That is the purpose of toString()." },
            { id: "D", text: "To compare two SimpleDates for equality", explanationIfWrong: "That is the role of equals()." }
          ],
          correctAnswer: "A",
          explanationNote: "Copy constructors initialize a brand new instance on the heap using the field values of an existing instance."
        },
        questionPool: [
          {
            id: "j5-4-5-alt1",
            question: "If 'date2' is created with 'new SimpleDate(date1)', does modifying date2 alter date1?",
            options: [
              { id: "A", text: "No, because date2 is a distinct object located at a separate heap memory address", explanationIfWrong: "" },
              { id: "B", text: "Yes, because they share the same constructor", explanationIfWrong: "They are separate objects in memory." },
              { id: "C", text: "Only if date1 is static", explanationIfWrong: "Instances are independent." },
              { id: "D", text: "Only on weekdays", explanationIfWrong: "Memory allocation is independent of calendar days." }
            ],
            correctAnswer: "A",
            explanationNote: "Because 'new' allocated a new object for date2, mutations to date2 do not affect date1."
          },
          {
            id: "j5-4-5-alt2",
            question: "Why are copy constructors preferred over Java's built-in 'clone()' method?",
            options: [
              { id: "A", text: "They are simple, type-safe, do not require implementing Cloneable, and avoid CloneNotSupportedException", explanationIfWrong: "" },
              { id: "B", text: "Because clone() was removed from Java in version 8", explanationIfWrong: "clone() still exists on Object, but is widely discouraged." },
              { id: "C", text: "Because copy constructors run in the GPU", explanationIfWrong: "Constructors run in the standard JVM on the CPU." },
              { id: "D", text: "Because clone() can only duplicate numbers", explanationIfWrong: "clone() creates shallow copies, but has clunky syntax and design flaws." }
            ],
            correctAnswer: "A",
            explanationNote: "Copy constructors avoid the complexities, awkward casting, and checked exceptions of Java's Cloneable interface."
          }
        ]
      },
      {
        heading: "Comparing Object Identity vs State Equality",
        text: "To summarize object-oriented references: '==' compares memory addresses (identity), while '.equals()' compares internal state (equivalence). Two variables pointing to different heap locations are never '==', even if every field is identical. Always use '.equals()' when checking whether two domain objects represent the same entity.",
        codeSnippet: "Person a = new Person(\"Ada\", 30);\nPerson b = new Person(\"Ada\", 30);\n\nSystem.out.println(a == b);      // false (different heap addresses)\nSystem.out.println(a.equals(b)); // true  (same name and age)",
        terminalOutput: "false\ntrue",
        tip: "Think of '==' as asking 'Are these the exact same physical instance?' and .equals() as 'Do these have the same values?'.",
        warning: "Using '==' on objects is one of the most common beginner bugs in Java programming.",
        mcq: {
          id: "j5-4-6",
          question: "In what scenario will 'a == b' evaluate to true for two object variables 'a' and 'b'?",
          options: [
            { id: "A", text: "Only when both variables point to the exact same object at the identical memory address on the heap", explanationIfWrong: "" },
            { id: "B", text: "Whenever both objects have identical field values", explanationIfWrong: "That is value equality tested by .equals()." },
            { id: "C", text: "Whenever both objects are of the same class", explanationIfWrong: "Belonging to the same class does not make distinct objects '=='." },
            { id: "D", text: "Whenever both objects have the same hashCode()", explanationIfWrong: "Hash collisions can occur between distinct objects." }
          ],
          correctAnswer: "A",
          explanationNote: "The '==' operator strictly evaluates whether both reference variables hold the identical memory address."
        },
        questionPool: [
          {
            id: "j5-4-6-alt1",
            question: "If 'Person c = a;' is executed, what does 'a == c' evaluate to?",
            options: [
              { id: "A", text: "true, because 'c' now holds the exact same heap reference address as 'a'", explanationIfWrong: "" },
              { id: "B", text: "false, because their variable names are different", explanationIfWrong: "Reference equality checks memory addresses, not variable names." },
              { id: "C", text: "null", explanationIfWrong: "'==' evaluates to a boolean." },
              { id: "D", text: "It throws an IllegalAccessException", explanationIfWrong: "Assigning reference variables is standard and legal." }
            ],
            correctAnswer: "A",
            explanationNote: "Assignment copies the reference pointer, so 'a' and 'c' point to the exact same memory location."
          },
          {
            id: "j5-4-6-alt2",
            question: "Why should you always override both 'equals()' and 'hashCode()' together in custom Java classes?",
            options: [
              { id: "A", text: "To maintain the contract that equal objects must have identical hash codes when stored in HashMaps or HashSets", explanationIfWrong: "" },
              { id: "B", text: "Because Java will refuse to compile classes that only override equals()", explanationIfWrong: "It compiles, but breaks HashSet/HashMap behavior." },
              { id: "C", text: "To speed up file reading", explanationIfWrong: "hashCode() is for hash tables, not file I/O." },
              { id: "D", text: "To convert objects to integers for sorting", explanationIfWrong: "Sorting uses Comparable/Comparator, not hashCode()." }
            ],
            correctAnswer: "A",
            explanationNote: "The Java contract requires that if a.equals(b) is true, then a.hashCode() must equal b.hashCode() for correct hashing collection behavior."
          }
        ]
      }
    ]
  }
];

// Helper functions matching Python & Java Part 1-4 mechanics

export function getActiveQuestionsForLevelPart5(
  section: SectionContent,
  studentId: string,
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part5_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart5(studentId: string): number {
  try {
    const key = `dopilot_java_part5_consecutive_failures_${studentId}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart5(studentId: string): void {
  try {
    localStorage.setItem(`dopilot_java_part5_consecutive_failures_${studentId}`, '0');
  } catch {}
}

export function setLevelAttemptCountPart5(sectionId: string, studentId: string, count: number): void {
  try {
    localStorage.setItem(`dopilot_java_part5_attempt_${studentId}_${sectionId}`, String(count));
  } catch {}
}

export function getLevelAttemptCountPart5(sectionId: string, studentId: string): number {
  try {
    const raw = localStorage.getItem(`dopilot_java_part5_attempt_${studentId}_${sectionId}`);
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart5 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart5(
  sectionId: string,
  studentId: string,
  isPassed: boolean
): AttemptResultPart5 {
  const attemptKey = `dopilot_java_part5_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part5_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part5_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = localStorage.getItem(attemptKey);
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart5(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart5(studentId);
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
