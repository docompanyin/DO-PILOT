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

export const PART_1_SECTIONS: SectionContent[] = [
  {
    id: "1-1-getting-started",
    number: "1.1",
    title: "Getting Started & Java Execution",
    subtitle: "Understand Java program architecture, public static void main, syntax rules, and line-by-line execution.",
    readTime: "15 min",
    objectives: [
      "Understand the structure of a Java program and the main method",
      "Write and execute your first Java statements with System.out.println()",
      "Understand semicolons, curly braces, and Java case-sensitivity",
      "Follow sequential top-to-bottom program execution",
      "Print classic messages including Ada Lovelace",
      "Use single-line and multi-line comments for clean code documentation"
    ],
    theoryBlocks: [
      {
        heading: "Java Program Structure & Main Method",
        text: "In Java, all executable code resides inside a class definition. Every standalone Java program requires a designated entry point called the 'main' method. When you launch a Java program, the Java Virtual Machine (JVM) looks specifically for 'public static void main(String[] args)' and begins execution at the opening curly brace '{'.",
        codeSnippet: "public class Sandbox {\n    public static void main(String[] args) {\n        System.out.println(\"Java program started!\");\n    }\n}",
        terminalOutput: "Java program started!",
        tip: "Class names in Java must begin with an uppercase letter and strictly match the file name (e.g. Sandbox.java defines class Sandbox).",
        warning: "Java is strictly case-sensitive: 'Main' or 'system' will result in compilation errors.",
        mcq: {
          id: "q-1.1-0-v1",
          question: "What is the exact entry point where the JVM begins executing any Java application?",
          options: [
            { id: "A", text: "public static void main(String[] args)", explanationIfWrong: "" },
            { id: "B", text: "public void start()", explanationIfWrong: "start() is not the default Java application entry point." },
            { id: "C", text: "public static run(String args)", explanationIfWrong: "The method must return void and be named main." },
            { id: "D", text: "private int main()", explanationIfWrong: "The entry point must be public, static, and return void." }
          ],
          correctAnswer: "A",
          explanationNote: "The JVM strictly looks for public static void main(String[] args) to start execution."
        },
        retestMcq: {
          id: "q-1.1-0-v2",
          question: "If a Java file is named 'Program.java', what must the public class inside be named?",
          options: [
            { id: "A", text: "Program (must match file name case-sensitively)", explanationIfWrong: "" },
            { id: "B", text: "program (lowercase is required for classes)", explanationIfWrong: "Java classes follow PascalCase and must match the filename exactly." },
            { id: "C", text: "Any random name the programmer chooses", explanationIfWrong: "A public class must match its source file name." },
            { id: "D", text: "MainClass only", explanationIfWrong: "The class name must match Program.java." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, a public class must match the name of the file (Program.java contains class Program)."
        },
        questionPool: [
          {
            id: "q-1.1-0-v1",
            question: "What is the exact entry point where the JVM begins executing any Java application?",
            options: [
              { id: "A", text: "public static void main(String[] args)", explanationIfWrong: "" },
              { id: "B", text: "public void start()", explanationIfWrong: "start() is not the default Java application entry point." },
              { id: "C", text: "public static run(String args)", explanationIfWrong: "The method must return void and be named main." },
              { id: "D", text: "private int main()", explanationIfWrong: "The entry point must be public, static, and return void." }
            ],
            correctAnswer: "A",
            explanationNote: "The JVM strictly looks for public static void main(String[] args) to start execution."
          },
          {
            id: "q-1.1-0-v2",
            question: "If a Java file is named 'Program.java', what must the public class inside be named?",
            options: [
              { id: "A", text: "Program (must match file name case-sensitively)", explanationIfWrong: "" },
              { id: "B", text: "program (lowercase is required for classes)", explanationIfWrong: "Java classes follow PascalCase and must match the filename exactly." },
              { id: "C", text: "Any random name the programmer chooses", explanationIfWrong: "A public class must match its source file name." },
              { id: "D", text: "MainClass only", explanationIfWrong: "The class name must match Program.java." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, a public class must match the name of the file (Program.java contains class Program)."
          },
          {
            id: "q-1.1-0-v3",
            question: "What does the keyword 'void' mean in 'public static void main(String[] args)'?",
            options: [
              { id: "A", text: "The method does not return any value", explanationIfWrong: "" },
              { id: "B", text: "The method accepts no parameters", explanationIfWrong: "The parameter is String[] args." },
              { id: "C", text: "The method can only be executed once", explanationIfWrong: "void specifies return type, not call frequency." },
              { id: "D", text: "The method runs asynchronously in the background", explanationIfWrong: "void is simply a return type." }
            ],
            correctAnswer: "A",
            explanationNote: "The keyword 'void' indicates that the method does not return any value to its caller."
          }
        ]
      },
      {
        heading: "Commands and Execution Flow",
        text: "A computer program is a sequence of instructions. In Java, instructions inside a method block are executed sequentially, one statement after another, from top to bottom. Each command must terminate with a semicolon ';'.",
        codeSnippet: "public class ExecutionFlow {\n    public static void main(String[] args) {\n        System.out.println(\"First command\");\n        System.out.println(\"Second command\");\n        System.out.println(\"Third command\");\n    }\n}",
        terminalOutput: "First command\nSecond command\nThird command",
        tip: "Notice how each statement ends with a semicolon. Forgetting a semicolon is the most common beginner syntax error.",
        mcq: {
          id: "q-1.1-1-v1",
          question: "In what order does Java execute statements located inside the main method?",
          options: [
            { id: "A", text: "Sequentially from top to bottom, one statement after another", explanationIfWrong: "" },
            { id: "B", text: "Concurrently at the exact same millisecond", explanationIfWrong: "Standard Java execution flow is strictly sequential." },
            { id: "C", text: "From bottom to top in reverse order", explanationIfWrong: "Java executes statements from top to bottom." },
            { id: "D", text: "In random order determined by the CPU scheduler", explanationIfWrong: "Java follows the written order of statements." }
          ],
          correctAnswer: "A",
          explanationNote: "Java reads and executes statements sequentially from top to bottom."
        },
        retestMcq: {
          id: "q-1.1-1-v2",
          question: "What character must be placed at the end of every executable Java statement?",
          options: [
            { id: "A", text: "; (semicolon)", explanationIfWrong: "" },
            { id: "B", text: ": (colon)", explanationIfWrong: "Colons are not statement terminators in Java." },
            { id: "C", text: ". (period)", explanationIfWrong: "Periods are used for member access, not statement termination." },
            { id: "D", text: "No character is required if on a new line", explanationIfWrong: "Java requires a semicolon regardless of line breaks." }
          ],
          correctAnswer: "A",
          explanationNote: "Every executable statement in Java must end with a semicolon (;)."
        },
        questionPool: [
          {
            id: "q-1.1-1-v1",
            question: "In what order does Java execute statements located inside the main method?",
            options: [
              { id: "A", text: "Sequentially from top to bottom, one statement after another", explanationIfWrong: "" },
              { id: "B", text: "Concurrently at the exact same millisecond", explanationIfWrong: "Standard Java execution flow is strictly sequential." },
              { id: "C", text: "From bottom to top in reverse order", explanationIfWrong: "Java executes statements from top to bottom." },
              { id: "D", text: "In random order determined by the CPU scheduler", explanationIfWrong: "Java follows the written order of statements." }
            ],
            correctAnswer: "A",
            explanationNote: "Java reads and executes statements sequentially from top to bottom."
          },
          {
            id: "q-1.1-1-v2",
            question: "What character must be placed at the end of every executable Java statement?",
            options: [
              { id: "A", text: "; (semicolon)", explanationIfWrong: "" },
              { id: "B", text: ": (colon)", explanationIfWrong: "Colons are not statement terminators in Java." },
              { id: "C", text: ". (period)", explanationIfWrong: "Periods are used for member access, not statement termination." },
              { id: "D", text: "No character is required if on a new line", explanationIfWrong: "Java requires a semicolon regardless of line breaks." }
            ],
            correctAnswer: "A",
            explanationNote: "Every executable statement in Java must end with a semicolon (;)."
          }
        ]
      },
      {
        heading: "System.out.println & Text Output",
        text: "To print text to the screen in Java, we use the command 'System.out.println(...)'. The text to be printed must be enclosed inside double quotation marks (\"). When println completes its print operation, it automatically adds a line break, moving the cursor to the next line.",
        codeSnippet: "public class Message {\n    public static void main(String[] args) {\n        System.out.println(\"Hello world!\");\n        System.out.println(\"...and the universe!\");\n    }\n}",
        terminalOutput: "Hello world!\n...and the universe!",
        warning: "Single quotes (') are reserved for single characters (char), like 'a'. For strings of text, you MUST use double quotes (\").",
        mcq: {
          id: "q-1.1-2-v1",
          question: "Which of the following is valid Java syntax to print 'Hello world!' to the console?",
          options: [
            { id: "A", text: "System.out.println(\"Hello world!\");", explanationIfWrong: "" },
            { id: "B", text: "system.out.println('Hello world!');", explanationIfWrong: "System must be capitalized, and double quotes are required for strings." },
            { id: "C", text: "print(\"Hello world!\");", explanationIfWrong: "Java requires System.out.println, not standalone print." },
            { id: "D", text: "System.out.printLine(\"Hello world!\")", explanationIfWrong: "The method is println, and it must end with a semicolon." }
          ],
          correctAnswer: "A",
          explanationNote: "System.out.println(\"Hello world!\"); is the correct syntax."
        },
        retestMcq: {
          id: "q-1.1-2-v2",
          question: "What happens after System.out.println() finishes printing its content?",
          options: [
            { id: "A", text: "It automatically outputs a newline character, moving the cursor to the next line", explanationIfWrong: "" },
            { id: "B", text: "It keeps the cursor on the same line right after the text", explanationIfWrong: "System.out.print keeps it on the same line; println adds a newline." },
            { id: "C", text: "It clears the entire terminal screen", explanationIfWrong: "println does not clear the terminal." },
            { id: "D", text: "It terminates the JVM immediately", explanationIfWrong: "println only prints; it does not stop the program." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'ln' in println stands for line; it appends a newline at the end."
        },
        questionPool: [
          {
            id: "q-1.1-2-v1",
            question: "Which of the following is valid Java syntax to print 'Hello world!' to the console?",
            options: [
              { id: "A", text: "System.out.println(\"Hello world!\");", explanationIfWrong: "" },
              { id: "B", text: "system.out.println('Hello world!');", explanationIfWrong: "System must be capitalized, and double quotes are required for strings." },
              { id: "C", text: "print(\"Hello world!\");", explanationIfWrong: "Java requires System.out.println, not standalone print." },
              { id: "D", text: "System.out.printLine(\"Hello world!\")", explanationIfWrong: "The method is println, and it must end with a semicolon." }
            ],
            correctAnswer: "A",
            explanationNote: "System.out.println(\"Hello world!\"); is the correct syntax."
          },
          {
            id: "q-1.1-2-v2",
            question: "What happens after System.out.println() finishes printing its content?",
            options: [
              { id: "A", text: "It automatically outputs a newline character, moving the cursor to the next line", explanationIfWrong: "" },
              { id: "B", text: "It keeps the cursor on the same line right after the text", explanationIfWrong: "System.out.print keeps it on the same line; println adds a newline." },
              { id: "C", text: "It clears the entire terminal screen", explanationIfWrong: "println does not clear the terminal." },
              { id: "D", text: "It terminates the JVM immediately", explanationIfWrong: "println only prints; it does not stop the program." }
            ],
            correctAnswer: "A",
            explanationNote: "The 'ln' in println stands for line; it appends a newline at the end."
          }
        ]
      },
      {
        heading: "Printing Ada Lovelace (Helsinki MOOC Task 1)",
        text: "The official University of Helsinki Java MOOC starts with a tribute to Ada Lovelace, considered the world's first computer programmer. In this task, you write a Java program that outputs the name 'Ada Lovelace' exactly as requested.",
        codeSnippet: "public class AdaLovelace {\n    public static void main(String[] args) {\n        System.out.println(\"Ada Lovelace\");\n    }\n}",
        terminalOutput: "Ada Lovelace",
        tip: "Notice that string literals inside println are printed verbatim, preserving spaces and exact capitalization.",
        mcq: {
          id: "q-1.1-3-v1",
          question: "What exact output does the program System.out.println(\"Ada Lovelace\"); produce?",
          options: [
            { id: "A", text: "Ada Lovelace", explanationIfWrong: "" },
            { id: "B", text: "\"Ada Lovelace\" (with quotes)", explanationIfWrong: "The quotation marks delimit the string and are not printed." },
            { id: "C", text: "ada lovelace", explanationIfWrong: "Java preserves the exact case of characters within quotes." },
            { id: "D", text: "Ada_Lovelace", explanationIfWrong: "Spaces inside strings are preserved as spaces." }
          ],
          correctAnswer: "A",
          explanationNote: "Quotation marks define the string boundary and are omitted from the output."
        },
        retestMcq: {
          id: "q-1.1-3-v2",
          question: "If we execute: System.out.println(\"Once upon a time\"); System.out.println(\"there was\"); how many lines are printed?",
          options: [
            { id: "A", text: "Two lines", explanationIfWrong: "" },
            { id: "B", text: "One line combined", explanationIfWrong: "Each println moves output to a fresh line." },
            { id: "C", text: "Three lines", explanationIfWrong: "Two println statements output exactly two lines." },
            { id: "D", text: "None, it causes a syntax error", explanationIfWrong: "This is completely valid Java syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "Two calls to System.out.println output text onto two distinct lines."
        },
        questionPool: [
          {
            id: "q-1.1-3-v1",
            question: "What exact output does the program System.out.println(\"Ada Lovelace\"); produce?",
            options: [
              { id: "A", text: "Ada Lovelace", explanationIfWrong: "" },
              { id: "B", text: "\"Ada Lovelace\" (with quotes)", explanationIfWrong: "The quotation marks delimit the string and are not printed." },
              { id: "C", text: "ada lovelace", explanationIfWrong: "Java preserves the exact case of characters within quotes." },
              { id: "D", text: "Ada_Lovelace", explanationIfWrong: "Spaces inside strings are preserved as spaces." }
            ],
            correctAnswer: "A",
            explanationNote: "Quotation marks define the string boundary and are omitted from the output."
          },
          {
            id: "q-1.1-3-v2",
            question: "If we execute: System.out.println(\"Once upon a time\"); System.out.println(\"there was\"); how many lines are printed?",
            options: [
              { id: "A", text: "Two lines", explanationIfWrong: "" },
              { id: "B", text: "One line combined", explanationIfWrong: "Each println moves output to a fresh line." },
              { id: "C", text: "Three lines", explanationIfWrong: "Two println statements output exactly two lines." },
              { id: "D", text: "None, it causes a syntax error", explanationIfWrong: "This is completely valid Java syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "Two calls to System.out.println output text onto two distinct lines."
          }
        ]
      },
      {
        heading: "Comments in Java Source Code",
        text: "Comments are human-readable notes written inside source code to explain logic. The Java compiler completely ignores comments during compilation. Java provides two primary comment styles: single-line comments using '//' and multi-line block comments using '/* ... */'.",
        codeSnippet: "// This is a single line comment\npublic class Comments {\n    public static void main(String[] args) {\n        /* This is a multi-line\n           comment block */\n        System.out.println(\"Comments do not affect runtime output\");\n    }\n}",
        terminalOutput: "Comments do not affect runtime output",
        tip: "Use comments to explain *why* a particular piece of logic is written, rather than restating obvious syntax.",
        mcq: {
          id: "q-1.1-4-v1",
          question: "How do you start a single-line comment in Java?",
          options: [
            { id: "A", text: "//", explanationIfWrong: "" },
            { id: "B", text: "#", explanationIfWrong: "# is used in Python and Bash, not in Java." },
            { id: "C", text: "<!--", explanationIfWrong: "<!-- is for HTML/XML comments." },
            { id: "D", text: "--", explanationIfWrong: "-- is for SQL comments or Java decrement operator." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, double forward slashes (//) denote a single-line comment."
        },
        retestMcq: {
          id: "q-1.1-4-v2",
          question: "Which syntax defines a valid multi-line comment in Java?",
          options: [
            { id: "A", text: "/* comment text here */", explanationIfWrong: "" },
            { id: "B", text: "\"\"\" comment text here \"\"\"", explanationIfWrong: "\"\"\" is used for text blocks in Java 15+, not multi-line comments." },
            { id: "C", text: "#* comment text *#", explanationIfWrong: "Invalid Java comment syntax." },
            { id: "D", text: "{* comment text *}", explanationIfWrong: "Curly brackets denote code blocks, not comments." }
          ],
          correctAnswer: "A",
          explanationNote: "Multi-line comments in Java begin with /* and conclude with */."
        },
        questionPool: [
          {
            id: "q-1.1-4-v1",
            question: "How do you start a single-line comment in Java?",
            options: [
              { id: "A", text: "//", explanationIfWrong: "" },
              { id: "B", text: "#", explanationIfWrong: "# is used in Python and Bash, not in Java." },
              { id: "C", text: "<!--", explanationIfWrong: "<!-- is for HTML/XML comments." },
              { id: "D", text: "--", explanationIfWrong: "-- is for SQL comments or Java decrement operator." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, double forward slashes (//) denote a single-line comment."
          },
          {
            id: "q-1.1-4-v2",
            question: "Which syntax defines a valid multi-line comment in Java?",
            options: [
              { id: "A", text: "/* comment text here */", explanationIfWrong: "" },
              { id: "B", text: "\"\"\" comment text here \"\"\"", explanationIfWrong: "\"\"\" is used for text blocks in Java 15+, not multi-line comments." },
              { id: "C", text: "#* comment text *#", explanationIfWrong: "Invalid Java comment syntax." },
              { id: "D", text: "{* comment text *}", explanationIfWrong: "Curly brackets denote code blocks, not comments." }
            ],
            correctAnswer: "A",
            explanationNote: "Multi-line comments in Java begin with /* and conclude with */."
          }
        ]
      },
      {
        heading: "Compiler Errors vs Runtime Errors",
        text: "Java is a compiled, strongly typed language. Before your program can run, the 'javac' compiler inspects your code for syntax compliance. If you miss a semicolon, misspell a keyword, or forget closing quotes, the compiler generates a compilation error and stops. If your code compiles successfully, it is turned into bytecode executed by the JVM.",
        codeSnippet: "// COMPILATION ERROR EXAMPLE:\n// System.out.println(\"Missing semicolon\")\n\n// VALID COMPILED CODE:\npublic class Valid {\n    public static void main(String[] args) {\n        System.out.println(\"Compilation successful!\");\n    }\n}",
        terminalOutput: "Compilation successful!",
        warning: "Always read compiler error messages carefully. They tell you the exact line number and the nature of the error.",
        mcq: {
          id: "q-1.1-5-v1",
          question: "What will happen if you forget the semicolon at the end of System.out.println(\"Hello\") in Java?",
          options: [
            { id: "A", text: "The Java compiler will report a compile-time error and the program will not run", explanationIfWrong: "" },
            { id: "B", text: "The program will run normally by guessing the missing semicolon", explanationIfWrong: "Java does not have automatic semicolon insertion." },
            { id: "C", text: "The JVM will output a runtime warning in red text but still finish", explanationIfWrong: "Compilation completely fails before bytecode is generated." },
            { id: "D", text: "The computer will reboot", explanationIfWrong: "A syntax error merely halts the compiler." }
          ],
          correctAnswer: "A",
          explanationNote: "Missing semicolons prevent Java compilation completely."
        },
        retestMcq: {
          id: "q-1.1-5-v2",
          question: "Which software component transforms Java source code (.java) into platform-independent bytecode (.class)?",
          options: [
            { id: "A", text: "The Java Compiler (javac)", explanationIfWrong: "" },
            { id: "B", text: "The Web Browser", explanationIfWrong: "Browsers run JavaScript, not Java compilation." },
            { id: "C", text: "The Operating System Kernel", explanationIfWrong: "The Java Compiler is part of the JDK." },
            { id: "D", text: "The Text Editor", explanationIfWrong: "Text editors only edit text; javac compiles." }
          ],
          correctAnswer: "A",
          explanationNote: "The Java compiler (javac) compiles human-readable source code into bytecode."
        },
        questionPool: [
          {
            id: "q-1.1-5-v1",
            question: "What will happen if you forget the semicolon at the end of System.out.println(\"Hello\") in Java?",
            options: [
              { id: "A", text: "The Java compiler will report a compile-time error and the program will not run", explanationIfWrong: "" },
              { id: "B", text: "The program will run normally by guessing the missing semicolon", explanationIfWrong: "Java does not have automatic semicolon insertion." },
              { id: "C", text: "The JVM will output a runtime warning in red text but still finish", explanationIfWrong: "Compilation completely fails before bytecode is generated." },
              { id: "D", text: "The computer will reboot", explanationIfWrong: "A syntax error merely halts the compiler." }
            ],
            correctAnswer: "A",
            explanationNote: "Missing semicolons prevent Java compilation completely."
          },
          {
            id: "q-1.1-5-v2",
            question: "Which software component transforms Java source code (.java) into platform-independent bytecode (.class)?",
            options: [
              { id: "A", text: "The Java Compiler (javac)", explanationIfWrong: "" },
              { id: "B", text: "The Web Browser", explanationIfWrong: "Browsers run JavaScript, not Java compilation." },
              { id: "C", text: "The Operating System Kernel", explanationIfWrong: "The Java Compiler is part of the JDK." },
              { id: "D", text: "The Text Editor", explanationIfWrong: "Text editors only edit text; javac compiles." }
            ],
            correctAnswer: "A",
            explanationNote: "The Java compiler (javac) compiles human-readable source code into bytecode."
          }
        ]
      }
    ]
  },
  {
    id: "1-2-printing-output",
    number: "1.2",
    title: "Printing & Output Formatting",
    subtitle: "Master System.out.println() vs System.out.print(), string concatenation, and escape characters.",
    readTime: "15 min",
    objectives: [
      "Understand the key difference between println() and print()",
      "Concatenate text and variables using the plus operator (+)",
      "Print arithmetic expressions and numbers directly",
      "Use escape sequences (\\n, \\\") correctly",
      "Format clean console outputs and multi-line art"
    ],
    theoryBlocks: [
      {
        heading: "println() vs print()",
        text: "Java provides two fundamental printing methods on System.out: 'println()' prints the provided content and then moves the cursor to a new line. In contrast, 'print()' prints the text but leaves the cursor on the exact same line. Consecutive calls to print() will output side-by-side.",
        codeSnippet: "public class PrintComparison {\n    public static void main(String[] args) {\n        System.out.print(\"Hello \");\n        System.out.print(\"World\");\n        System.out.println(\"!\");\n        System.out.println(\"Next line\");\n    }\n}",
        terminalOutput: "Hello World!\nNext line",
        tip: "Use System.out.print() when prompting a user for input on the same line (e.g. 'Enter name: ').",
        mcq: {
          id: "q-1.2-0-v1",
          question: "What is the output of executing:\nSystem.out.print(\"One\");\nSystem.out.print(\"Two\");",
          options: [
            { id: "A", text: "OneTwo", explanationIfWrong: "" },
            { id: "B", text: "One\nTwo (on separate lines)", explanationIfWrong: "print() does not insert a newline character." },
            { id: "C", text: "One Two (with space)", explanationIfWrong: "print() only outputs the exact characters provided, no auto-spacing." },
            { id: "D", text: "TwoOne", explanationIfWrong: "Java executes statements sequentially." }
          ],
          correctAnswer: "A",
          explanationNote: "System.out.print does not add a newline, so 'One' and 'Two' appear contiguously as 'OneTwo'."
        },
        retestMcq: {
          id: "q-1.2-0-v2",
          question: "Which method moves the cursor to a new line AFTER printing?",
          options: [
            { id: "A", text: "System.out.println()", explanationIfWrong: "" },
            { id: "B", text: "System.out.print()", explanationIfWrong: "print() keeps the cursor on the current line." },
            { id: "C", text: "System.out.write()", explanationIfWrong: "write() outputs raw bytes without newline." },
            { id: "D", text: "System.in.read()", explanationIfWrong: "System.in.read() reads input rather than printing." }
          ],
          correctAnswer: "A",
          explanationNote: "println appends a newline character automatically after outputting the text."
        },
        questionPool: [
          {
            id: "q-1.2-0-v1",
            question: "What is the output of executing:\nSystem.out.print(\"One\");\nSystem.out.print(\"Two\");",
            options: [
              { id: "A", text: "OneTwo", explanationIfWrong: "" },
              { id: "B", text: "One\nTwo (on separate lines)", explanationIfWrong: "print() does not insert a newline character." },
              { id: "C", text: "One Two (with space)", explanationIfWrong: "print() only outputs the exact characters provided, no auto-spacing." },
              { id: "D", text: "TwoOne", explanationIfWrong: "Java executes statements sequentially." }
            ],
            correctAnswer: "A",
            explanationNote: "System.out.print does not add a newline, so 'One' and 'Two' appear contiguously as 'OneTwo'."
          },
          {
            id: "q-1.2-0-v2",
            question: "Which method moves the cursor to a new line AFTER printing?",
            options: [
              { id: "A", text: "System.out.println()", explanationIfWrong: "" },
              { id: "B", text: "System.out.print()", explanationIfWrong: "print() keeps the cursor on the current line." },
              { id: "C", text: "System.out.write()", explanationIfWrong: "write() outputs raw bytes without newline." },
              { id: "D", text: "System.in.read()", explanationIfWrong: "System.in.read() reads input rather than printing." }
            ],
            correctAnswer: "A",
            explanationNote: "println appends a newline character automatically after outputting the text."
          }
        ]
      },
      {
        heading: "String Concatenation with +",
        text: "In Java, the plus '+' operator is overloaded. When applied to numbers, it performs mathematical addition. However, when applied between a String and another operand, it concatenates (joins) them together into a single unified String.",
        codeSnippet: "public class Concatenation {\n    public static void main(String[] args) {\n        System.out.println(\"Hello\" + \" \" + \"World\");\n        System.out.println(\"Total: \" + (5 + 10));\n    }\n}",
        terminalOutput: "Hello World\nTotal: 15",
        warning: "Be mindful of precedence! System.out.println(\"Sum: \" + 5 + 10) evaluates to 'Sum: 510'. Use parentheses (5 + 10) to force mathematical addition first.",
        mcq: {
          id: "q-1.2-1-v1",
          question: "What does System.out.println(\"Result: \" + 2 + 3); output in Java?",
          options: [
            { id: "A", text: "Result: 23", explanationIfWrong: "" },
            { id: "B", text: "Result: 5", explanationIfWrong: "Without parentheses, + is evaluated left-to-right as string concatenation." },
            { id: "C", text: "Result: 6", explanationIfWrong: "2 + 3 is not multiplication." },
            { id: "D", text: "Compilation Error", explanationIfWrong: "This is completely valid Java syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "Left-to-right evaluation converts 2 to string ('Result: 2'), then 3 to string ('Result: 23')."
        },
        retestMcq: {
          id: "q-1.2-1-v2",
          question: "How do you ensure 2 + 3 is added mathematically when printed after 'Result: '?",
          options: [
            { id: "A", text: "System.out.println(\"Result: \" + (2 + 3));", explanationIfWrong: "" },
            { id: "B", text: "System.out.println(\"Result: \" + [2 + 3]);", explanationIfWrong: "Square brackets are for array indexing in Java." },
            { id: "C", text: "System.out.println(\"Result: \" + {2 + 3});", explanationIfWrong: "Curly braces are for blocks and initializers." },
            { id: "D", text: "System.out.println(\"Result: \" + Math.add(2, 3));", explanationIfWrong: "Parentheses (2 + 3) are the standard idiomatic way." }
          ],
          correctAnswer: "A",
          explanationNote: "Parentheses (2 + 3) give arithmetic addition priority before string concatenation."
        },
        questionPool: [
          {
            id: "q-1.2-1-v1",
            question: "What does System.out.println(\"Result: \" + 2 + 3); output in Java?",
            options: [
              { id: "A", text: "Result: 23", explanationIfWrong: "" },
              { id: "B", text: "Result: 5", explanationIfWrong: "Without parentheses, + is evaluated left-to-right as string concatenation." },
              { id: "C", text: "Result: 6", explanationIfWrong: "2 + 3 is not multiplication." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "This is completely valid Java syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "Left-to-right evaluation converts 2 to string ('Result: 2'), then 3 to string ('Result: 23')."
          },
          {
            id: "q-1.2-1-v2",
            question: "How do you ensure 2 + 3 is added mathematically when printed after 'Result: '?",
            options: [
              { id: "A", text: "System.out.println(\"Result: \" + (2 + 3));", explanationIfWrong: "" },
              { id: "B", text: "System.out.println(\"Result: \" + [2 + 3]);", explanationIfWrong: "Square brackets are for array indexing in Java." },
              { id: "C", text: "System.out.println(\"Result: \" + {2 + 3});", explanationIfWrong: "Curly braces are for blocks and initializers." },
              { id: "D", text: "System.out.println(\"Result: \" + Math.add(2, 3));", explanationIfWrong: "Parentheses (2 + 3) are the standard idiomatic way." }
            ],
            correctAnswer: "A",
            explanationNote: "Parentheses (2 + 3) give arithmetic addition priority before string concatenation."
          }
        ]
      },
      {
        heading: "Escape Sequences (\\n, \\\")",
        text: "Special characters such as double quotes or line breaks cannot be inserted directly into a string literal without causing a syntax ambiguity. Java uses the backslash '\\' as an escape character. '\\n' inserts a newline, '\\\"' inserts a double quote, and '\\\\' inserts a literal backslash.",
        codeSnippet: "public class EscapeCharacters {\n    public static void main(String[] args) {\n        System.out.println(\"Line 1\\nLine 2\");\n        System.out.println(\"She said \\\"Java is great!\\\"\");\n    }\n}",
        terminalOutput: "Line 1\nLine 2\nShe said \"Java is great!\"",
        tip: "Remember: backslash (\\) is the escape character, while forward slash (/) is used for division and comments.",
        mcq: {
          id: "q-1.2-2-v1",
          question: "Which escape sequence represents a newline inside a Java string literal?",
          options: [
            { id: "A", text: "\\n", explanationIfWrong: "" },
            { id: "B", text: "/n", explanationIfWrong: "Forward slash is not an escape character in Java." },
            { id: "C", text: "\\newline", explanationIfWrong: "The escape code is simply \\n." },
            { id: "D", text: "<br>", explanationIfWrong: "<br> is an HTML tag, not a Java escape sequence." }
          ],
          correctAnswer: "A",
          explanationNote: "\\n is the standard escape sequence for a newline character in Java."
        },
        retestMcq: {
          id: "q-1.2-2-v2",
          question: "How do you include a literal double quotation mark inside a Java String literal?",
          options: [
            { id: "A", text: "\\\"", explanationIfWrong: "" },
            { id: "B", text: "\"\"", explanationIfWrong: "Two quotes ends and begins another string." },
            { id: "C", text: "/\"", explanationIfWrong: "Backslash \\ is required for escaping." },
            { id: "D", text: "'\"'", explanationIfWrong: "This creates a char literal, not an escaped quote inside a string." }
          ],
          correctAnswer: "A",
          explanationNote: "\\\" escapes the quote so the compiler knows it is part of the text."
        },
        questionPool: [
          {
            id: "q-1.2-2-v1",
            question: "Which escape sequence represents a newline inside a Java string literal?",
            options: [
              { id: "A", text: "\\n", explanationIfWrong: "" },
              { id: "B", text: "/n", explanationIfWrong: "Forward slash is not an escape character in Java." },
              { id: "C", text: "\\newline", explanationIfWrong: "The escape code is simply \\n." },
              { id: "D", text: "<br>", explanationIfWrong: "<br> is an HTML tag, not a Java escape sequence." }
            ],
            correctAnswer: "A",
            explanationNote: "\\n is the standard escape sequence for a newline character in Java."
          },
          {
            id: "q-1.2-2-v2",
            question: "How do you include a literal double quotation mark inside a Java String literal?",
            options: [
              { id: "A", text: "\\\"", explanationIfWrong: "" },
              { id: "B", text: "\"\"", explanationIfWrong: "Two quotes ends and begins another string." },
              { id: "C", text: "/\"", explanationIfWrong: "Backslash \\ is required for escaping." },
              { id: "D", text: "'\"'", explanationIfWrong: "This creates a char literal, not an escaped quote inside a string." }
            ],
            correctAnswer: "A",
            explanationNote: "\\\" escapes the quote so the compiler knows it is part of the text."
          }
        ]
      },
      {
        heading: "Printing Numbers & Pure Math",
        text: "System.out.println can print numbers and math expressions directly without any quotes. When you omit quotes around mathematical terms, Java calculates the result first and prints the resulting numeric value.",
        codeSnippet: "public class Numbers {\n    public static void main(String[] args) {\n        System.out.println(42);\n        System.out.println(10 + 20);\n        System.out.println(5 * 8);\n    }\n}",
        terminalOutput: "42\n30\n40",
        tip: "Notice that numbers do not require quotes. Quotes turn numbers into literal text strings.",
        mcq: {
          id: "q-1.2-3-v1",
          question: "What is printed by: System.out.println(5 + 5); vs System.out.println(\"5 + 5\");?",
          options: [
            { id: "A", text: "10 on the first line, and 5 + 5 on the second line", explanationIfWrong: "" },
            { id: "B", text: "10 on both lines", explanationIfWrong: "Quoted text is printed literally as '5 + 5'." },
            { id: "C", text: "55 on the first line, 10 on the second line", explanationIfWrong: "5 + 5 without quotes is integer addition equaling 10." },
            { id: "D", text: "Compilation Error on the first line", explanationIfWrong: "Printing numeric calculations is completely valid." }
          ],
          correctAnswer: "A",
          explanationNote: "Without quotes, Java computes 5 + 5 = 10. With quotes, it prints the literal text '5 + 5'."
        },
        retestMcq: {
          id: "q-1.2-3-v2",
          question: "What does System.out.println(10 * 3); output?",
          options: [
            { id: "A", text: "30", explanationIfWrong: "" },
            { id: "B", text: "10 * 3", explanationIfWrong: "Without quotes, the multiplication is computed." },
            { id: "C", text: "103", explanationIfWrong: "* multiplies numbers, it does not concatenate." },
            { id: "D", text: "33.3", explanationIfWrong: "10 * 3 = 30." }
          ],
          correctAnswer: "A",
          explanationNote: "The multiplication 10 * 3 evaluates to 30."
        },
        questionPool: [
          {
            id: "q-1.2-3-v1",
            question: "What is printed by: System.out.println(5 + 5); vs System.out.println(\"5 + 5\");?",
            options: [
              { id: "A", text: "10 on the first line, and 5 + 5 on the second line", explanationIfWrong: "" },
              { id: "B", text: "10 on both lines", explanationIfWrong: "Quoted text is printed literally as '5 + 5'." },
              { id: "C", text: "55 on the first line, 10 on the second line", explanationIfWrong: "5 + 5 without quotes is integer addition equaling 10." },
              { id: "D", text: "Compilation Error on the first line", explanationIfWrong: "Printing numeric calculations is completely valid." }
            ],
            correctAnswer: "A",
            explanationNote: "Without quotes, Java computes 5 + 5 = 10. With quotes, it prints the literal text '5 + 5'."
          },
          {
            id: "q-1.2-3-v2",
            question: "What does System.out.println(10 * 3); output?",
            options: [
              { id: "A", text: "30", explanationIfWrong: "" },
              { id: "B", text: "10 * 3", explanationIfWrong: "Without quotes, the multiplication is computed." },
              { id: "C", text: "103", explanationIfWrong: "* multiplies numbers, it does not concatenate." },
              { id: "D", text: "33.3", explanationIfWrong: "10 * 3 = 30." }
            ],
            correctAnswer: "A",
            explanationNote: "The multiplication 10 * 3 evaluates to 30."
          }
        ]
      },
      {
        heading: "Dinosaur & ASCII Multi-Line Art (MOOC Exercise)",
        text: "In the Helsinki MOOC 'Dinosaur' exercise, students write multiple println statements to output formatted multi-line ASCII text. Maintaining indentation, punctuation, and character alignment requires careful attention to sequential output.",
        codeSnippet: "public class Dinosaur {\n    public static void main(String[] args) {\n        System.out.println(\"Once upon a time\");\n        System.out.println(\"there was\");\n        System.out.println(\"a dinosaur\");\n    }\n}",
        terminalOutput: "Once upon a time\nthere was\na dinosaur",
        tip: "Each call to System.out.println creates exactly one line of text in terminal output.",
        mcq: {
          id: "q-1.2-4-v1",
          question: "How many lines of terminal output are produced by 3 consecutive calls to System.out.println()?",
          options: [
            { id: "A", text: "Exactly 3 lines", explanationIfWrong: "" },
            { id: "B", text: "1 line", explanationIfWrong: "println automatically produces a line break each time." },
            { id: "C", text: "4 lines", explanationIfWrong: "3 calls produce 3 lines." },
            { id: "D", text: "Dependent on screen resolution", explanationIfWrong: "Console newlines are strictly governed by println." }
          ],
          correctAnswer: "A",
          explanationNote: "Each System.out.println statement outputs its content followed by a newline."
        },
        retestMcq: {
          id: "q-1.2-4-v2",
          question: "What will System.out.println(\"\"); print to the terminal?",
          options: [
            { id: "A", text: "An empty blank line", explanationIfWrong: "" },
            { id: "B", text: "The word 'null'", explanationIfWrong: "Empty string is not null." },
            { id: "C", text: "It causes an empty string compilation error", explanationIfWrong: "Printing empty strings is completely allowed." },
            { id: "D", text: "Nothing at all, no line break", explanationIfWrong: "println always outputs a newline even with empty text." }
          ],
          correctAnswer: "A",
          explanationNote: "System.out.println(\"\") outputs an empty line with a newline break."
        },
        questionPool: [
          {
            id: "q-1.2-4-v1",
            question: "How many lines of terminal output are produced by 3 consecutive calls to System.out.println()?",
            options: [
              { id: "A", text: "Exactly 3 lines", explanationIfWrong: "" },
              { id: "B", text: "1 line", explanationIfWrong: "println automatically produces a line break each time." },
              { id: "C", text: "4 lines", explanationIfWrong: "3 calls produce 3 lines." },
              { id: "D", text: "Dependent on screen resolution", explanationIfWrong: "Console newlines are strictly governed by println." }
            ],
            correctAnswer: "A",
            explanationNote: "Each System.out.println statement outputs its content followed by a newline."
          },
          {
            id: "q-1.2-4-v2",
            question: "What will System.out.println(\"\"); print to the terminal?",
            options: [
              { id: "A", text: "An empty blank line", explanationIfWrong: "" },
              { id: "B", text: "The word 'null'", explanationIfWrong: "Empty string is not null." },
              { id: "C", text: "It causes an empty string compilation error", explanationIfWrong: "Printing empty strings is completely allowed." },
              { id: "D", text: "Nothing at all, no line break", explanationIfWrong: "println always outputs a newline even with empty text." }
            ],
            correctAnswer: "A",
            explanationNote: "System.out.println(\"\") outputs an empty line with a newline break."
          }
        ]
      },
      {
        heading: "Common Printing Pitfalls",
        text: "Common beginner mistakes in Java printing include forgetting the capital 'S' in System, using single quotes for strings, forgetting semicolons, and missing matching parentheses. In Java, all parentheses and quotation marks must be balanced in pairs.",
        codeSnippet: "// WRONG: system.out.println('Hello');\n// CORRECT:\npublic class CleanPrint {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, cleanly compiled Java!\");\n    }\n}",
        terminalOutput: "Hello, cleanly compiled Java!",
        warning: "Never mix single quotes (') and double quotes (\"). In Java, 'A' is a single char primitive, while \"A\" is a java.lang.String object.",
        mcq: {
          id: "q-1.2-5-v1",
          question: "Which of the following lines will fail to compile in Java?",
          options: [
            { id: "A", text: "System.out.println('Hello world');", explanationIfWrong: "" },
            { id: "B", text: "System.out.println(\"Hello world\");", explanationIfWrong: "This is valid syntax." },
            { id: "C", text: "System.out.print(12345);", explanationIfWrong: "Printing numeric literals is valid." },
            { id: "D", text: "System.out.println(\"Result: \" + 10);", explanationIfWrong: "String concatenation is valid." }
          ],
          correctAnswer: "A",
          explanationNote: "Single quotes can only wrap a single char (e.g. 'H'). Multi-character text requires double quotes."
        },
        retestMcq: {
          id: "q-1.2-5-v2",
          question: "Why does system.out.println(\"Hi\"); with a lowercase 's' fail in Java?",
          options: [
            { id: "A", text: "Java is case-sensitive, and the class is named 'System', not 'system'", explanationIfWrong: "" },
            { id: "B", text: "The word 'system' is a reserved keyword for the OS", explanationIfWrong: "System is a class in java.lang." },
            { id: "C", text: "Java requires all keywords to be lowercase", explanationIfWrong: "System is a class name, and Java enforces exact casing." },
            { id: "D", text: "println cannot print words shorter than 3 letters", explanationIfWrong: "Length of string is irrelevant." }
          ],
          correctAnswer: "A",
          explanationNote: "Java is strictly case-sensitive; System starts with an uppercase 'S'."
        },
        questionPool: [
          {
            id: "q-1.2-5-v1",
            question: "Which of the following lines will fail to compile in Java?",
            options: [
              { id: "A", text: "System.out.println('Hello world');", explanationIfWrong: "" },
              { id: "B", text: "System.out.println(\"Hello world\");", explanationIfWrong: "This is valid syntax." },
              { id: "C", text: "System.out.print(12345);", explanationIfWrong: "Printing numeric literals is valid." },
              { id: "D", text: "System.out.println(\"Result: \" + 10);", explanationIfWrong: "String concatenation is valid." }
            ],
            correctAnswer: "A",
            explanationNote: "Single quotes can only wrap a single char (e.g. 'H'). Multi-character text requires double quotes."
          },
          {
            id: "q-1.2-5-v2",
            question: "Why does system.out.println(\"Hi\"); with a lowercase 's' fail in Java?",
            options: [
              { id: "A", text: "Java is case-sensitive, and the class is named 'System', not 'system'", explanationIfWrong: "" },
              { id: "B", text: "The word 'system' is a reserved keyword for the OS", explanationIfWrong: "System is a class in java.lang." },
              { id: "C", text: "Java requires all keywords to be lowercase", explanationIfWrong: "System is a class name, and Java enforces exact casing." },
              { id: "D", text: "println cannot print words shorter than 3 letters", explanationIfWrong: "Length of string is irrelevant." }
            ],
            correctAnswer: "A",
            explanationNote: "Java is strictly case-sensitive; System starts with an uppercase 'S'."
          }
        ]
      }
    ]
  },
  {
    id: "1-3-reading-input",
    number: "1.3",
    title: "Reading Input with Scanner",
    subtitle: "Read keyboard inputs from console using java.util.Scanner and convert text to numbers.",
    readTime: "18 min",
    objectives: [
      "Import java.util.Scanner into your Java program",
      "Initialize Scanner attached to standard input (System.in)",
      "Read lines of text with scanner.nextLine()",
      "Read and convert integer inputs with Integer.valueOf()",
      "Read floating-point numbers with Double.valueOf()",
      "Read booleans with Boolean.valueOf()"
    ],
    theoryBlocks: [
      {
        heading: "Scanner Initialization & Import",
        text: "To read input from the user in Java, we utilize the 'Scanner' tool provided by Java's standard library. Because Scanner belongs to the 'java.util' package, we must import it at the very top of our source file using 'import java.util.Scanner;'. Inside the main method, we initialize it by passing System.in (the standard keyboard input stream).",
        codeSnippet: "import java.util.Scanner;\n\npublic class ReadName {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print(\"What is your name? \");\n        String name = scanner.nextLine();\n        System.out.println(\"Hi \" + name);\n    }\n}",
        sampleInput: "Ada",
        terminalOutput: "What is your name? Ada\nHi Ada",
        tip: "Scanner only needs to be instantiated once per program: Scanner scanner = new Scanner(System.in);",
        mcq: {
          id: "q-1.3-0-v1",
          question: "Which statement correctly imports the Scanner class in Java?",
          options: [
            { id: "A", text: "import java.util.Scanner;", explanationIfWrong: "" },
            { id: "B", text: "include <Scanner>;", explanationIfWrong: "include is C/C++ syntax, not Java." },
            { id: "C", text: "using System.Scanner;", explanationIfWrong: "using is C# syntax, not Java." },
            { id: "D", text: "require 'scanner';", explanationIfWrong: "require is Ruby/Node.js syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, standard utility classes are imported using 'import java.util.Scanner;'."
        },
        retestMcq: {
          id: "q-1.3-0-v2",
          question: "What parameter must be passed to new Scanner(...) to read from standard keyboard input?",
          options: [
            { id: "A", text: "System.in", explanationIfWrong: "" },
            { id: "B", text: "System.out", explanationIfWrong: "System.out is for output, not input." },
            { id: "C", text: "Console.Read", explanationIfWrong: "Console.Read is C# syntax." },
            { id: "D", text: "keyboard", explanationIfWrong: "System.in is the standard input stream in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "System.in represents the standard input stream connected to the keyboard."
        },
        questionPool: [
          {
            id: "q-1.3-0-v1",
            question: "Which statement correctly imports the Scanner class in Java?",
            options: [
              { id: "A", text: "import java.util.Scanner;", explanationIfWrong: "" },
              { id: "B", text: "include <Scanner>;", explanationIfWrong: "include is C/C++ syntax, not Java." },
              { id: "C", text: "using System.Scanner;", explanationIfWrong: "using is C# syntax, not Java." },
              { id: "D", text: "require 'scanner';", explanationIfWrong: "require is Ruby/Node.js syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, standard utility classes are imported using 'import java.util.Scanner;'."
          },
          {
            id: "q-1.3-0-v2",
            question: "What parameter must be passed to new Scanner(...) to read from standard keyboard input?",
            options: [
              { id: "A", text: "System.in", explanationIfWrong: "" },
              { id: "B", text: "System.out", explanationIfWrong: "System.out is for output, not input." },
              { id: "C", text: "Console.Read", explanationIfWrong: "Console.Read is C# syntax." },
              { id: "D", text: "keyboard", explanationIfWrong: "System.in is the standard input stream in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "System.in represents the standard input stream connected to the keyboard."
          }
        ]
      },
      {
        heading: "Reading Strings with scanner.nextLine()",
        text: "The method 'scanner.nextLine()' pauses program execution and waits for the user to type text into the console and press Enter. It reads the entire line up until the Enter key and returns it as a Java String.",
        codeSnippet: "import java.util.Scanner;\n\npublic class MessageReader {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.println(\"Write a message: \");\n        String message = scanner.nextLine();\n        System.out.println(message);\n    }\n}",
        sampleInput: "Hello from DO PILOT!",
        terminalOutput: "Write a message: \nHello from DO PILOT!\nHello from DO PILOT!",
        tip: "scanner.nextLine() reads everything typed on that line, including internal spaces.",
        mcq: {
          id: "q-1.3-1-v1",
          question: "Which Scanner method reads an entire line of user text until the Enter key is pressed?",
          options: [
            { id: "A", text: "scanner.nextLine()", explanationIfWrong: "" },
            { id: "B", text: "scanner.readLine()", explanationIfWrong: "readLine() belongs to BufferedReader, not Scanner." },
            { id: "C", text: "scanner.readString()", explanationIfWrong: "There is no readString() method on Scanner." },
            { id: "D", text: "scanner.input()", explanationIfWrong: "input() is Python syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "scanner.nextLine() reads the complete line of text entered by the user."
        },
        retestMcq: {
          id: "q-1.3-1-v2",
          question: "What type of data does scanner.nextLine() return?",
          options: [
            { id: "A", text: "String", explanationIfWrong: "" },
            { id: "B", text: "int", explanationIfWrong: "nextLine() returns text as a String." },
            { id: "C", text: "char", explanationIfWrong: "It returns a full String, not a single char." },
            { id: "D", text: "boolean", explanationIfWrong: "It returns textual input as a String." }
          ],
          correctAnswer: "A",
          explanationNote: "scanner.nextLine() returns a String object containing the user's input."
        },
        questionPool: [
          {
            id: "q-1.3-1-v1",
            question: "Which Scanner method reads an entire line of user text until the Enter key is pressed?",
            options: [
              { id: "A", text: "scanner.nextLine()", explanationIfWrong: "" },
              { id: "B", text: "scanner.readLine()", explanationIfWrong: "readLine() belongs to BufferedReader, not Scanner." },
              { id: "C", text: "scanner.readString()", explanationIfWrong: "There is no readString() method on Scanner." },
              { id: "D", text: "scanner.input()", explanationIfWrong: "input() is Python syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "scanner.nextLine() reads the complete line of text entered by the user."
          },
          {
            id: "q-1.3-1-v2",
            question: "What type of data does scanner.nextLine() return?",
            options: [
              { id: "A", text: "String", explanationIfWrong: "" },
              { id: "B", text: "int", explanationIfWrong: "nextLine() returns text as a String." },
              { id: "C", text: "char", explanationIfWrong: "It returns a full String, not a single char." },
              { id: "D", text: "boolean", explanationIfWrong: "It returns textual input as a String." }
            ],
            correctAnswer: "A",
            explanationNote: "scanner.nextLine() returns a String object containing the user's input."
          }
        ]
      },
      {
        heading: "Reading Integers with Integer.valueOf()",
        text: "Console input is initially read as a text String. In the University of Helsinki Java MOOC curriculum, reading numbers is taught using 'Integer.valueOf(scanner.nextLine())'. This reads the line as text first and safely parses it into a genuine 'int' whole number.",
        codeSnippet: "import java.util.Scanner;\n\npublic class ReadInteger {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print(\"Give a number: \");\n        int value = Integer.valueOf(scanner.nextLine());\n        System.out.println(\"You gave the number \" + value);\n    }\n}",
        sampleInput: "42",
        terminalOutput: "Give a number: 42\nYou gave the number 42",
        tip: "Using Integer.valueOf(scanner.nextLine()) prevents the infamous newline-skipping bug associated with scanner.nextInt().",
        mcq: {
          id: "q-1.3-2-v1",
          question: "In Helsinki Java MOOC, how is an integer input recommended to be read from Scanner?",
          options: [
            { id: "A", text: "Integer.valueOf(scanner.nextLine())", explanationIfWrong: "" },
            { id: "B", text: "(int) scanner.nextLine()", explanationIfWrong: "Strings cannot be directly cast to int with (int)." },
            { id: "C", text: "scanner.toInt()", explanationIfWrong: "There is no toInt() method on Scanner." },
            { id: "D", text: "int(scanner.nextLine())", explanationIfWrong: "int() is Python type-conversion syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "Integer.valueOf(scanner.nextLine()) parses a line of string input into an integer."
        },
        retestMcq: {
          id: "q-1.3-2-v2",
          question: "What exception occurs if a user enters 'hello' when Integer.valueOf(scanner.nextLine()) expects a number?",
          options: [
            { id: "A", text: "NumberFormatException", explanationIfWrong: "" },
            { id: "B", text: "NullPointerException", explanationIfWrong: "The string is not null, it just cannot be parsed." },
            { id: "C", text: "IndexOutOfBoundsException", explanationIfWrong: "This occurs with arrays, not parsing." },
            { id: "D", text: "ArithmeticException", explanationIfWrong: "ArithmeticException occurs during division by zero." }
          ],
          correctAnswer: "A",
          explanationNote: "If the text cannot be converted into an integer, Java throws a NumberFormatException."
        },
        questionPool: [
          {
            id: "q-1.3-2-v1",
            question: "In Helsinki Java MOOC, how is an integer input recommended to be read from Scanner?",
            options: [
              { id: "A", text: "Integer.valueOf(scanner.nextLine())", explanationIfWrong: "" },
              { id: "B", text: "(int) scanner.nextLine()", explanationIfWrong: "Strings cannot be directly cast to int with (int)." },
              { id: "C", text: "scanner.toInt()", explanationIfWrong: "There is no toInt() method on Scanner." },
              { id: "D", text: "int(scanner.nextLine())", explanationIfWrong: "int() is Python type-conversion syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "Integer.valueOf(scanner.nextLine()) parses a line of string input into an integer."
          },
          {
            id: "q-1.3-2-v2",
            question: "What exception occurs if a user enters 'hello' when Integer.valueOf(scanner.nextLine()) expects a number?",
            options: [
              { id: "A", text: "NumberFormatException", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "The string is not null, it just cannot be parsed." },
              { id: "C", text: "IndexOutOfBoundsException", explanationIfWrong: "This occurs with arrays, not parsing." },
              { id: "D", text: "ArithmeticException", explanationIfWrong: "ArithmeticException occurs during division by zero." }
            ],
            correctAnswer: "A",
            explanationNote: "If the text cannot be converted into an integer, Java throws a NumberFormatException."
          }
        ]
      },
      {
        heading: "Reading Decimals with Double.valueOf()",
        text: "When reading decimal floating-point numbers (such as 3.14 or 42.5), we use 'Double.valueOf(scanner.nextLine())'. In Java source code and standard conversion, decimal points are represented using a period (.), not a comma.",
        codeSnippet: "import java.util.Scanner;\n\npublic class ReadDouble {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print(\"Give a decimal number: \");\n        double number = Double.valueOf(scanner.nextLine());\n        System.out.println(\"You gave \" + number);\n    }\n}",
        sampleInput: "3.1415",
        terminalOutput: "Give a decimal number: 3.1415\nYou gave 3.1415",
        tip: "A double stores 64-bit IEEE 754 floating point numbers with approximately 15-17 decimal digits of precision.",
        mcq: {
          id: "q-1.3-3-v1",
          question: "Which expression converts a line of scanner input into a floating-point double?",
          options: [
            { id: "A", text: "Double.valueOf(scanner.nextLine())", explanationIfWrong: "" },
            { id: "B", text: "Float.toInt(scanner.nextLine())", explanationIfWrong: "Float.toInt is not a valid Java method." },
            { id: "C", text: "double(scanner.nextLine())", explanationIfWrong: "double is a primitive keyword, not a parsing function." },
            { id: "D", text: "scanner.readDecimal()", explanationIfWrong: "There is no readDecimal method on Scanner." }
          ],
          correctAnswer: "A",
          explanationNote: "Double.valueOf(scanner.nextLine()) correctly parses text into a double primitive."
        },
        retestMcq: {
          id: "q-1.3-3-v2",
          question: "What decimal separator character is used by Double.valueOf(\"...\") in standard Java?",
          options: [
            { id: "A", text: ". (period / dot)", explanationIfWrong: "" },
            { id: "B", text: ", (comma)", explanationIfWrong: "Commas will trigger a NumberFormatException in standard parsing." },
            { id: "C", text: "; (semicolon)", explanationIfWrong: "Semicolons are statement terminators." },
            { id: "D", text: ": (colon)", explanationIfWrong: "Colons are not decimal separators." }
          ],
          correctAnswer: "A",
          explanationNote: "Java uses the dot (.) as the standard decimal point delimiter."
        },
        questionPool: [
          {
            id: "q-1.3-3-v1",
            question: "Which expression converts a line of scanner input into a floating-point double?",
            options: [
              { id: "A", text: "Double.valueOf(scanner.nextLine())", explanationIfWrong: "" },
              { id: "B", text: "Float.toInt(scanner.nextLine())", explanationIfWrong: "Float.toInt is not a valid Java method." },
              { id: "C", text: "double(scanner.nextLine())", explanationIfWrong: "double is a primitive keyword, not a parsing function." },
              { id: "D", text: "scanner.readDecimal()", explanationIfWrong: "There is no readDecimal method on Scanner." }
            ],
            correctAnswer: "A",
            explanationNote: "Double.valueOf(scanner.nextLine()) correctly parses text into a double primitive."
          },
          {
            id: "q-1.3-3-v2",
            question: "What decimal separator character is used by Double.valueOf(\"...\") in standard Java?",
            options: [
              { id: "A", text: ". (period / dot)", explanationIfWrong: "" },
              { id: "B", text: ", (comma)", explanationIfWrong: "Commas will trigger a NumberFormatException in standard parsing." },
              { id: "C", text: "; (semicolon)", explanationIfWrong: "Semicolons are statement terminators." },
              { id: "D", text: ": (colon)", explanationIfWrong: "Colons are not decimal separators." }
            ],
            correctAnswer: "A",
            explanationNote: "Java uses the dot (.) as the standard decimal point delimiter."
          }
        ]
      },
      {
        heading: "Reading Booleans with Boolean.valueOf()",
        text: "The 'boolean' type holds truth values: 'true' or 'false'. We parse boolean values from user input using 'Boolean.valueOf(scanner.nextLine())'. If the user enters the word 'true' (case-insensitive), it evaluates to true. Any other text evaluates to false.",
        codeSnippet: "import java.util.Scanner;\n\npublic class ReadBoolean {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print(\"Write a boolean: \");\n        boolean value = Boolean.valueOf(scanner.nextLine());\n        System.out.println(\"True or false? \" + value);\n    }\n}",
        sampleInput: "true",
        terminalOutput: "Write a boolean: true\nTrue or false? true",
        tip: "Notice that 'True', 'TRUE', and 'true' all evaluate to true when parsed with Boolean.valueOf().",
        mcq: {
          id: "q-1.3-4-v1",
          question: "What does Boolean.valueOf(\"TRUE\") evaluate to in Java?",
          options: [
            { id: "A", text: "true (it is case-insensitive)", explanationIfWrong: "" },
            { id: "B", text: "false (because it is capitalized)", explanationIfWrong: "Boolean.valueOf is case-insensitive." },
            { id: "C", text: "null", explanationIfWrong: "Primitive booleans cannot be null." },
            { id: "D", text: "NumberFormatException", explanationIfWrong: "Boolean.valueOf never throws NumberFormatException." }
          ],
          correctAnswer: "A",
          explanationNote: "Boolean.valueOf parses 'true' regardless of capitalization."
        },
        retestMcq: {
          id: "q-1.3-4-v2",
          question: "What does Boolean.valueOf(\"random text\") evaluate to?",
          options: [
            { id: "A", text: "false", explanationIfWrong: "" },
            { id: "B", text: "true", explanationIfWrong: "Only the string 'true' evaluates to true." },
            { id: "C", text: "Compilation Error", explanationIfWrong: "It compiles and returns false at runtime." },
            { id: "D", text: "Crash", explanationIfWrong: "Any string other than 'true' simply returns false." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, Boolean.valueOf returns true only if the string equals 'true' (ignoring case); otherwise false."
        },
        questionPool: [
          {
            id: "q-1.3-4-v1",
            question: "What does Boolean.valueOf(\"TRUE\") evaluate to in Java?",
            options: [
              { id: "A", text: "true (it is case-insensitive)", explanationIfWrong: "" },
              { id: "B", text: "false (because it is capitalized)", explanationIfWrong: "Boolean.valueOf is case-insensitive." },
              { id: "C", text: "null", explanationIfWrong: "Primitive booleans cannot be null." },
              { id: "D", text: "NumberFormatException", explanationIfWrong: "Boolean.valueOf never throws NumberFormatException." }
            ],
            correctAnswer: "A",
            explanationNote: "Boolean.valueOf parses 'true' regardless of capitalization."
          },
          {
            id: "q-1.3-4-v2",
            question: "What does Boolean.valueOf(\"random text\") evaluate to?",
            options: [
              { id: "A", text: "false", explanationIfWrong: "" },
              { id: "B", text: "true", explanationIfWrong: "Only the string 'true' evaluates to true." },
              { id: "C", text: "Compilation Error", explanationIfWrong: "It compiles and returns false at runtime." },
              { id: "D", text: "Crash", explanationIfWrong: "Any string other than 'true' simply returns false." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, Boolean.valueOf returns true only if the string equals 'true' (ignoring case); otherwise false."
          }
        ]
      },
      {
        heading: "Reading Multiple Inputs Sequentially",
        text: "A program often requires multiple inputs one after another. Each call to 'scanner.nextLine()' consumes the next line entered by the user. If you call scanner.nextLine() three times, the program waits for three distinct lines from the user.",
        codeSnippet: "import java.util.Scanner;\n\npublic class Story {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.println(\"I will tell you a story, but I need some information first.\");\n        System.out.println(\"What is the main character called?\");\n        String name = scanner.nextLine();\n        System.out.println(\"What is their job?\");\n        String job = scanner.nextLine();\n        System.out.println(\"Once upon a time there was \" + name + \", who was \" + job + \".\");\n    }\n}",
        sampleInput: "Bob\na builder",
        terminalOutput: "I will tell you a story, but I need some information first.\nWhat is the main character called?\nBob\nWhat is their job?\na builder\nOnce upon a time there was Bob, who was a builder.",
        tip: "Keep Scanner open throughout the lifecycle of your main method.",
        mcq: {
          id: "q-1.3-5-v1",
          question: "How many times does the program pause for user input if scanner.nextLine() is called 4 times?",
          options: [
            { id: "A", text: "Exactly 4 times", explanationIfWrong: "" },
            { id: "B", text: "Only once, reading all 4 lines together", explanationIfWrong: "Each nextLine() call waits for one distinct line." },
            { id: "C", text: "2 times", explanationIfWrong: "Each call corresponds to one line of input." },
            { id: "D", text: "Infinite times", explanationIfWrong: "It pauses once per invocation." }
          ],
          correctAnswer: "A",
          explanationNote: "Each scanner.nextLine() invocation waits for and consumes exactly one line."
        },
        retestMcq: {
          id: "q-1.3-5-v2",
          question: "If a user presses Enter without typing any text, what does scanner.nextLine() return?",
          options: [
            { id: "A", text: "An empty string \"\"", explanationIfWrong: "" },
            { id: "B", text: "null", explanationIfWrong: "An empty line returns an empty string \"\", not null." },
            { id: "C", text: "It causes an immediate program crash", explanationIfWrong: "Empty lines are valid input." },
            { id: "D", text: "0", explanationIfWrong: "nextLine returns a String, not an integer." }
          ],
          correctAnswer: "A",
          explanationNote: "Pressing Enter immediately produces an empty string (\"\")."
        },
        questionPool: [
          {
            id: "q-1.3-5-v1",
            question: "How many times does the program pause for user input if scanner.nextLine() is called 4 times?",
            options: [
              { id: "A", text: "Exactly 4 times", explanationIfWrong: "" },
              { id: "B", text: "Only once, reading all 4 lines together", explanationIfWrong: "Each nextLine() call waits for one distinct line." },
              { id: "C", text: "2 times", explanationIfWrong: "Each call corresponds to one line of input." },
              { id: "D", text: "Infinite times", explanationIfWrong: "It pauses once per invocation." }
            ],
            correctAnswer: "A",
            explanationNote: "Each scanner.nextLine() invocation waits for and consumes exactly one line."
          },
          {
            id: "q-1.3-5-v2",
            question: "If a user presses Enter without typing any text, what does scanner.nextLine() return?",
            options: [
              { id: "A", text: "An empty string \"\"", explanationIfWrong: "" },
              { id: "B", text: "null", explanationIfWrong: "An empty line returns an empty string \"\", not null." },
              { id: "C", text: "It causes an immediate program crash", explanationIfWrong: "Empty lines are valid input." },
              { id: "D", text: "0", explanationIfWrong: "nextLine returns a String, not an integer." }
            ],
            correctAnswer: "A",
            explanationNote: "Pressing Enter immediately produces an empty string (\"\")."
          }
        ]
      }
    ]
  },
  {
    id: "1-4-variables-types",
    number: "1.4",
    title: "Variables & Fundamental Data Types",
    subtitle: "Declare and assign variables, master int, double, boolean, and String, and understand memory storage.",
    readTime: "18 min",
    objectives: [
      "Understand variable declaration syntax: type name = value;",
      "Master the 4 fundamental types: String, int, double, boolean",
      "Understand variable mutability and value re-assignment",
      "Follow Java camelCase naming conventions and identifier rules",
      "Understand memory allocation and type safety"
    ],
    theoryBlocks: [
      {
        heading: "Variable Declaration & Assignment",
        text: "A variable is a named storage location in computer memory. Because Java is strongly and statically typed, you must declare the variable's type before you can use it. The syntax is: 'Type identifier = initialValue;'. Once declared, the variable's type can never change.",
        codeSnippet: "public class VariableDeclaration {\n    public static void main(String[] args) {\n        String text = \"contains text\";\n        int wholeNumber = 123;\n        double floatingPoint = 3.141592653;\n        boolean trueOrFalse = true;\n\n        System.out.println(\"Text: \" + text);\n        System.out.println(\"Integer: \" + wholeNumber);\n    }\n}",
        terminalOutput: "Text: contains text\nInteger: 123",
        tip: "Think of a variable as a labeled box. In Java, the box has a specific shape (type) and can only hold items matching that shape.",
        mcq: {
          id: "q-1.4-0-v1",
          question: "Which of the following correctly declares an integer variable with value 10 in Java?",
          options: [
            { id: "A", text: "int score = 10;", explanationIfWrong: "" },
            { id: "B", text: "score = 10;", explanationIfWrong: "Java requires explicit type declaration (int score = 10;)." },
            { id: "C", text: "integer score = 10;", explanationIfWrong: "The keyword is 'int', not 'integer'." },
            { id: "D", text: "var score: int = 10;", explanationIfWrong: "This is Kotlin/TypeScript syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "int score = 10; is the standard Java variable declaration."
        },
        retestMcq: {
          id: "q-1.4-0-v2",
          question: "Can a variable declared as 'int count = 5;' later be assigned a String like count = \"five\";?",
          options: [
            { id: "A", text: "No, Java is statically typed and will produce a compile error", explanationIfWrong: "" },
            { id: "B", text: "Yes, Java automatically converts the type dynamically", explanationIfWrong: "Java is statically typed; types cannot change at runtime." },
            { id: "C", text: "Yes, but only if count is marked static", explanationIfWrong: "Static does not change static type enforcement." },
            { id: "D", text: "Yes, but it prints a runtime warning", explanationIfWrong: "It fails at compile time." }
          ],
          correctAnswer: "A",
          explanationNote: "Java statically checks types at compile time; an int variable can only hold integer values."
        },
        questionPool: [
          {
            id: "q-1.4-0-v1",
            question: "Which of the following correctly declares an integer variable with value 10 in Java?",
            options: [
              { id: "A", text: "int score = 10;", explanationIfWrong: "" },
              { id: "B", text: "score = 10;", explanationIfWrong: "Java requires explicit type declaration (int score = 10;)." },
              { id: "C", text: "integer score = 10;", explanationIfWrong: "The keyword is 'int', not 'integer'." },
              { id: "D", text: "var score: int = 10;", explanationIfWrong: "This is Kotlin/TypeScript syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "int score = 10; is the standard Java variable declaration."
          },
          {
            id: "q-1.4-0-v2",
            question: "Can a variable declared as 'int count = 5;' later be assigned a String like count = \"five\";?",
            options: [
              { id: "A", text: "No, Java is statically typed and will produce a compile error", explanationIfWrong: "" },
              { id: "B", text: "Yes, Java automatically converts the type dynamically", explanationIfWrong: "Java is statically typed; types cannot change at runtime." },
              { id: "C", text: "Yes, but only if count is marked static", explanationIfWrong: "Static does not change static type enforcement." },
              { id: "D", text: "Yes, but it prints a runtime warning", explanationIfWrong: "It fails at compile time." }
            ],
            correctAnswer: "A",
            explanationNote: "Java statically checks types at compile time; an int variable can only hold integer values."
          }
        ]
      },
      {
        heading: "The String Type",
        text: "The 'String' type in Java represents a sequence of characters. Notice that String starts with an uppercase 'S' because it is a reference type (an object class in java.lang), unlike the primitive types int, double, and boolean which are lowercase.",
        codeSnippet: "public class StringsIntro {\n    public static void main(String[] args) {\n        String greeting = \"Hello\";\n        String name = \"Ada\";\n        String combined = greeting + \", \" + name + \"!\";\n        System.out.println(combined);\n    }\n}",
        terminalOutput: "Hello, Ada!",
        tip: "Because String is a class, it comes packed with useful methods like .length(), .toUpperCase(), and .equals().",
        mcq: {
          id: "q-1.4-1-v1",
          question: "Why does the type 'String' start with an uppercase letter while 'int' starts with lowercase?",
          options: [
            { id: "A", text: "String is a reference class type, while int is a primitive type", explanationIfWrong: "" },
            { id: "B", text: "It is an accidental typo in the Java language specification", explanationIfWrong: "This is by design in Java's type system." },
            { id: "C", text: "All data types with text must be capitalized", explanationIfWrong: "char is also a primitive type and is lowercase." },
            { id: "D", text: "int can be written as Int interchangeably", explanationIfWrong: "int must always be lowercase." }
          ],
          correctAnswer: "A",
          explanationNote: "String is an object reference type (class), whereas int is a fundamental primitive type."
        },
        retestMcq: {
          id: "q-1.4-1-v2",
          question: "What value does an uninitialized class field of type String default to?",
          options: [
            { id: "A", text: "null", explanationIfWrong: "" },
            { id: "B", text: "\"\"", explanationIfWrong: "Empty string is an instantiated object; uninitialized reference is null." },
            { id: "C", text: "undefined", explanationIfWrong: "undefined is a JavaScript concept, not Java." },
            { id: "D", text: "0", explanationIfWrong: "0 is for numeric primitives." }
          ],
          correctAnswer: "A",
          explanationNote: "Reference types in Java default to null when uninitialized."
        },
        questionPool: [
          {
            id: "q-1.4-1-v1",
            question: "Why does the type 'String' start with an uppercase letter while 'int' starts with lowercase?",
            options: [
              { id: "A", text: "String is a reference class type, while int is a primitive type", explanationIfWrong: "" },
              { id: "B", text: "It is an accidental typo in the Java language specification", explanationIfWrong: "This is by design in Java's type system." },
              { id: "C", text: "All data types with text must be capitalized", explanationIfWrong: "char is also a primitive type and is lowercase." },
              { id: "D", text: "int can be written as Int interchangeably", explanationIfWrong: "int must always be lowercase." }
            ],
            correctAnswer: "A",
            explanationNote: "String is an object reference type (class), whereas int is a fundamental primitive type."
          },
          {
            id: "q-1.4-1-v2",
            question: "What value does an uninitialized class field of type String default to?",
            options: [
              { id: "A", text: "null", explanationIfWrong: "" },
              { id: "B", text: "\"\"", explanationIfWrong: "Empty string is an instantiated object; uninitialized reference is null." },
              { id: "C", text: "undefined", explanationIfWrong: "undefined is a JavaScript concept, not Java." },
              { id: "D", text: "0", explanationIfWrong: "0 is for numeric primitives." }
            ],
            correctAnswer: "A",
            explanationNote: "Reference types in Java default to null when uninitialized."
          }
        ]
      },
      {
        heading: "The int & double Types",
        text: "Java distinguishes between whole numbers and numbers with decimal fractions. The 'int' type stores 32-bit signed integers (from -2,147,483,648 to 2,147,483,647). The 'double' type stores 64-bit IEEE 754 floating point numbers.",
        codeSnippet: "public class NumbersTypes {\n    public static void main(String[] args) {\n        int chickens = 9000;\n        double baconWeight = 0.1;\n        System.out.println(\"Chickens: \" + chickens);\n        System.out.println(\"Bacon: \" + baconWeight + \" kg\");\n    }\n}",
        terminalOutput: "Chickens: 9000\nBacon: 0.1 kg",
        warning: "Assigning a decimal number to an int (e.g. int x = 4.2;) produces a compiler error: 'lossy conversion from double to int'.",
        mcq: {
          id: "q-1.4-2-v1",
          question: "Which line will result in a compilation error in Java?",
          options: [
            { id: "A", text: "int count = 4.5;", explanationIfWrong: "" },
            { id: "B", text: "double pi = 3.1415;", explanationIfWrong: "Valid double declaration." },
            { id: "C", text: "double ratio = 5;", explanationIfWrong: "Widening conversion from int to double (5 -> 5.0) is allowed automatically." },
            { id: "D", text: "int negative = -100;", explanationIfWrong: "int can store negative numbers." }
          ],
          correctAnswer: "A",
          explanationNote: "Java prevents lossy conversion from floating point double to integer int without explicit cast."
        },
        retestMcq: {
          id: "q-1.4-2-v2",
          question: "What happens if you assign an int to a double: double value = 10;?",
          options: [
            { id: "A", text: "Java automatically widens 10 to 10.0 without error", explanationIfWrong: "" },
            { id: "B", text: "Compilation Error: Type mismatch", explanationIfWrong: "Widening primitive conversion is performed automatically." },
            { id: "C", text: "value stores null", explanationIfWrong: "Primitives cannot be null." },
            { id: "D", text: "value stores 0", explanationIfWrong: "10 is converted to 10.0." }
          ],
          correctAnswer: "A",
          explanationNote: "Widening primitive conversion (int to double) occurs automatically, storing 10.0."
        },
        questionPool: [
          {
            id: "q-1.4-2-v1",
            question: "Which line will result in a compilation error in Java?",
            options: [
              { id: "A", text: "int count = 4.5;", explanationIfWrong: "" },
              { id: "B", text: "double pi = 3.1415;", explanationIfWrong: "Valid double declaration." },
              { id: "C", text: "double ratio = 5;", explanationIfWrong: "Widening conversion from int to double (5 -> 5.0) is allowed automatically." },
              { id: "D", text: "int negative = -100;", explanationIfWrong: "int can store negative numbers." }
            ],
            correctAnswer: "A",
            explanationNote: "Java prevents lossy conversion from floating point double to integer int without explicit cast."
          },
          {
            id: "q-1.4-2-v2",
            question: "What happens if you assign an int to a double: double value = 10;?",
            options: [
              { id: "A", text: "Java automatically widens 10 to 10.0 without error", explanationIfWrong: "" },
              { id: "B", text: "Compilation Error: Type mismatch", explanationIfWrong: "Widening primitive conversion is performed automatically." },
              { id: "C", text: "value stores null", explanationIfWrong: "Primitives cannot be null." },
              { id: "D", text: "value stores 0", explanationIfWrong: "10 is converted to 10.0." }
            ],
            correctAnswer: "A",
            explanationNote: "Widening primitive conversion (int to double) occurs automatically, storing 10.0."
          }
        ]
      },
      {
        heading: "The boolean Type",
        text: "The 'boolean' primitive type can only ever store one of two values: 'true' or 'false'. Booleans are fundamental in programming because all decision-making and conditionals (if/else) are evaluated as boolean expressions.",
        codeSnippet: "public class BooleansIntro {\n    public static void main(String[] args) {\n        boolean isJavaFun = true;\n        boolean isFishBird = false;\n        System.out.println(\"Is Java fun? \" + isJavaFun);\n        System.out.println(\"Can fish fly? \" + isFishBird);\n    }\n}",
        terminalOutput: "Is Java fun? true\nCan fish fly? false",
        tip: "Boolean literals in Java are lowercase: true and false (not True or False as in Python).",
        mcq: {
          id: "q-1.4-3-v1",
          question: "Which of the following are the only two valid literal values for a Java boolean?",
          options: [
            { id: "A", text: "true and false (all lowercase)", explanationIfWrong: "" },
            { id: "B", text: "True and False (capitalized)", explanationIfWrong: "Java requires lowercase true and false." },
            { id: "C", text: "1 and 0", explanationIfWrong: "In Java, 1 and 0 are ints and cannot be assigned to boolean directly." },
            { id: "D", text: "\"true\" and \"false\" (strings)", explanationIfWrong: "Strings with quotes are String objects, not boolean primitives." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, the only two boolean literals are lowercase 'true' and 'false'."
        },
        retestMcq: {
          id: "q-1.4-3-v2",
          question: "What happens if you write boolean flag = 1; in Java?",
          options: [
            { id: "A", text: "Compile error: incompatible types: int cannot be converted to boolean", explanationIfWrong: "" },
            { id: "B", text: "flag becomes true automatically", explanationIfWrong: "Unlike C/C++, Java does not treat integers as booleans." },
            { id: "C", text: "flag becomes false", explanationIfWrong: "Java enforces strict type safety at compile time." },
            { id: "D", text: "flag becomes 1", explanationIfWrong: "A boolean variable cannot hold an integer." }
          ],
          correctAnswer: "A",
          explanationNote: "Java does not permit implicit conversion between integers and booleans."
        },
        questionPool: [
          {
            id: "q-1.4-3-v1",
            question: "Which of the following are the only two valid literal values for a Java boolean?",
            options: [
              { id: "A", text: "true and false (all lowercase)", explanationIfWrong: "" },
              { id: "B", text: "True and False (capitalized)", explanationIfWrong: "Java requires lowercase true and false." },
              { id: "C", text: "1 and 0", explanationIfWrong: "In Java, 1 and 0 are ints and cannot be assigned to boolean directly." },
              { id: "D", text: "\"true\" and \"false\" (strings)", explanationIfWrong: "Strings with quotes are String objects, not boolean primitives." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, the only two boolean literals are lowercase 'true' and 'false'."
          },
          {
            id: "q-1.4-3-v2",
            question: "What happens if you write boolean flag = 1; in Java?",
            options: [
              { id: "A", text: "Compile error: incompatible types: int cannot be converted to boolean", explanationIfWrong: "" },
              { id: "B", text: "flag becomes true automatically", explanationIfWrong: "Unlike C/C++, Java does not treat integers as booleans." },
              { id: "C", text: "flag becomes false", explanationIfWrong: "Java enforces strict type safety at compile time." },
              { id: "D", text: "flag becomes 1", explanationIfWrong: "A boolean variable cannot hold an integer." }
            ],
            correctAnswer: "A",
            explanationNote: "Java does not permit implicit conversion between integers and booleans."
          }
        ]
      },
      {
        heading: "Variable Reassignment & Mutability",
        text: "Once a variable is declared, its value can be updated by using the assignment operator '=' without repeating its type. Repeating the type (e.g. 'int number = 5; int number = 10;') produces a compile error: 'variable number is already defined'.",
        codeSnippet: "public class Reassignment {\n    public static void main(String[] args) {\n        int number = 123;\n        System.out.println(number);\n        \n        number = 42; // Reassigning new value to existing variable\n        System.out.println(number);\n    }\n}",
        terminalOutput: "123\n42",
        tip: "Only write the type during variable creation. In subsequent assignments, use just the variable name.",
        mcq: {
          id: "q-1.4-4-v1",
          question: "What happens if you execute:\nint x = 10;\nint x = 20;",
          options: [
            { id: "A", text: "Compilation Error: variable x is already defined", explanationIfWrong: "" },
            { id: "B", text: "x is updated to 20 smoothly", explanationIfWrong: "To update, you must omit 'int' on the second line (x = 20;)." },
            { id: "C", text: "x holds both 10 and 20 as an array", explanationIfWrong: "int is a scalar value, not an array." },
            { id: "D", text: "The first value 10 is permanently kept", explanationIfWrong: "It does not compile at all." }
          ],
          correctAnswer: "A",
          explanationNote: "Redeclaring an existing variable with its type causes a compilation error."
        },
        retestMcq: {
          id: "q-1.4-4-v2",
          question: "Which line correctly reassigns the value 50 to an already declared integer variable 'points'?",
          options: [
            { id: "A", text: "points = 50;", explanationIfWrong: "" },
            { id: "B", text: "int points = 50;", explanationIfWrong: "Writing 'int' redeclares the variable." },
            { id: "C", text: "set points = 50;", explanationIfWrong: "set is not a Java keyword." },
            { id: "D", text: "points := 50;", explanationIfWrong: ":= is Go syntax, not Java." }
          ],
          correctAnswer: "A",
          explanationNote: "Reassignment uses the variable name directly followed by '='."
        },
        questionPool: [
          {
            id: "q-1.4-4-v1",
            question: "What happens if you execute:\nint x = 10;\nint x = 20;",
            options: [
              { id: "A", text: "Compilation Error: variable x is already defined", explanationIfWrong: "" },
              { id: "B", text: "x is updated to 20 smoothly", explanationIfWrong: "To update, you must omit 'int' on the second line (x = 20;)." },
              { id: "C", text: "x holds both 10 and 20 as an array", explanationIfWrong: "int is a scalar value, not an array." },
              { id: "D", text: "The first value 10 is permanently kept", explanationIfWrong: "It does not compile at all." }
            ],
            correctAnswer: "A",
            explanationNote: "Redeclaring an existing variable with its type causes a compilation error."
          },
          {
            id: "q-1.4-4-v2",
            question: "Which line correctly reassigns the value 50 to an already declared integer variable 'points'?",
            options: [
              { id: "A", text: "points = 50;", explanationIfWrong: "" },
              { id: "B", text: "int points = 50;", explanationIfWrong: "Writing 'int' redeclares the variable." },
              { id: "C", text: "set points = 50;", explanationIfWrong: "set is not a Java keyword." },
              { id: "D", text: "points := 50;", explanationIfWrong: ":= is Go syntax, not Java." }
            ],
            correctAnswer: "A",
            explanationNote: "Reassignment uses the variable name directly followed by '='."
          }
        ]
      },
      {
        heading: "Variable Naming Conventions (camelCase)",
        text: "In Java, variable names must begin with a letter, an underscore '_', or a dollar sign '$'. They cannot begin with numbers. Standard Java conventions dictate that variable names follow 'lowerCamelCase': the first word is lowercase, and each subsequent word starts with an uppercase letter.",
        codeSnippet: "// EXCELLENT JAVA CAMELCASE:\nint studentAge = 20;\ndouble accountBalance = 1500.50;\nboolean hasCompletedExam = true;\n\n// INVALID IDENTIFIERS:\n// int 2ndPlayer = 10;  // Cannot start with a digit\n// int student-age = 20; // Hyphen is minus operator",
        terminalOutput: "Valid camelCase identifiers accepted",
        warning: "Never use Java reserved words (like class, public, int, void) as variable identifiers.",
        mcq: {
          id: "q-1.4-5-v1",
          question: "Which of the following variable names follows standard Java naming conventions?",
          options: [
            { id: "A", text: "numberOfDays", explanationIfWrong: "" },
            { id: "B", text: "number_of_days", explanationIfWrong: "snake_case is Python/Ruby convention, not standard Java." },
            { id: "C", text: "NumberOfDays", explanationIfWrong: "Starting with a capital letter is reserved for classes in Java." },
            { id: "D", text: "2numberOfDays", explanationIfWrong: "Variable names cannot start with a digit in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "lowerCamelCase (e.g. numberOfDays) is the standard convention for Java variable names."
        },
        retestMcq: {
          id: "q-1.4-5-v2",
          question: "Which variable name will cause a compile error in Java?",
          options: [
            { id: "A", text: "1stPlace", explanationIfWrong: "" },
            { id: "B", text: "firstPlace", explanationIfWrong: "Valid identifier." },
            { id: "C", text: "_count", explanationIfWrong: "Identifiers may begin with an underscore." },
            { id: "D", text: "$amount", explanationIfWrong: "Identifiers may begin with a dollar sign." }
          ],
          correctAnswer: "A",
          explanationNote: "Identifiers in Java cannot begin with a numeric digit."
        },
        questionPool: [
          {
            id: "q-1.4-5-v1",
            question: "Which of the following variable names follows standard Java naming conventions?",
            options: [
              { id: "A", text: "numberOfDays", explanationIfWrong: "" },
              { id: "B", text: "number_of_days", explanationIfWrong: "snake_case is Python/Ruby convention, not standard Java." },
              { id: "C", text: "NumberOfDays", explanationIfWrong: "Starting with a capital letter is reserved for classes in Java." },
              { id: "D", text: "2numberOfDays", explanationIfWrong: "Variable names cannot start with a digit in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "lowerCamelCase (e.g. numberOfDays) is the standard convention for Java variable names."
          },
          {
            id: "q-1.4-5-v2",
            question: "Which variable name will cause a compile error in Java?",
            options: [
              { id: "A", text: "1stPlace", explanationIfWrong: "" },
              { id: "B", text: "firstPlace", explanationIfWrong: "Valid identifier." },
              { id: "C", text: "_count", explanationIfWrong: "Identifiers may begin with an underscore." },
              { id: "D", text: "$amount", explanationIfWrong: "Identifiers may begin with a dollar sign." }
            ],
            correctAnswer: "A",
            explanationNote: "Identifiers in Java cannot begin with a numeric digit."
          }
        ]
      }
    ]
  },
  {
    id: "1-5-calculating-numbers",
    number: "1.5",
    title: "Calculating with Numbers & Division",
    subtitle: "Perform arithmetic calculations, master integer division vs floating-point division, and compute averages.",
    readTime: "20 min",
    objectives: [
      "Use basic arithmetic operators: +, -, *, /, %",
      "Understand calculation precedence and parentheses",
      "Master the critical difference between integer division and floating point division",
      "Cast values explicitly to double for accurate decimal math",
      "Calculate averages across multiple numbers",
      "Calculate total seconds from a given number of days (MOOC exercise)"
    ],
    theoryBlocks: [
      {
        heading: "Basic Arithmetic Operations",
        text: "Java provides standard arithmetic operators: addition (+), subtraction (-), multiplication (*), division (/), and modulo remainder (%). Multiplication, division, and modulo take precedence over addition and subtraction. Parentheses '()' can be used to alter calculation order.",
        codeSnippet: "public class Arithmetic {\n    public static void main(String[] args) {\n        int first = 8;\n        int second = 2;\n        System.out.println(first + second); // 10\n        System.out.println(first - second); // 6\n        System.out.println(first * second); // 16\n        System.out.println(first / second); // 4\n        System.out.println(first % second); // 0\n    }\n}",
        terminalOutput: "10\n6\n16\n4\n0",
        tip: "The modulo operator (%) yields the integer remainder after division (e.g. 7 % 3 is 1).",
        mcq: {
          id: "q-1.5-0-v1",
          question: "What is the result of the expression: 2 + 3 * 4 in Java?",
          options: [
            { id: "A", text: "14", explanationIfWrong: "" },
            { id: "B", text: "20", explanationIfWrong: "Multiplication (*) has higher precedence than addition (+)." },
            { id: "C", text: "24", explanationIfWrong: "2 + (3 * 4) = 2 + 12 = 14." },
            { id: "D", text: "9", explanationIfWrong: "Order of operations dictates multiplication first." }
          ],
          correctAnswer: "A",
          explanationNote: "Multiplication (3 * 4 = 12) is evaluated first, then 2 + 12 = 14."
        },
        retestMcq: {
          id: "q-1.5-0-v2",
          question: "What does the expression 17 % 5 evaluate to in Java?",
          options: [
            { id: "A", text: "2", explanationIfWrong: "" },
            { id: "B", text: "3", explanationIfWrong: "5 * 3 = 15, remainder is 2." },
            { id: "C", text: "3.4", explanationIfWrong: "Modulo produces the integer remainder." },
            { id: "D", text: "0", explanationIfWrong: "17 is not evenly divisible by 5." }
          ],
          correctAnswer: "A",
          explanationNote: "17 divided by 5 equals 3 with a remainder of 2."
        },
        questionPool: [
          {
            id: "q-1.5-0-v1",
            question: "What is the result of the expression: 2 + 3 * 4 in Java?",
            options: [
              { id: "A", text: "14", explanationIfWrong: "" },
              { id: "B", text: "20", explanationIfWrong: "Multiplication (*) has higher precedence than addition (+)." },
              { id: "C", text: "24", explanationIfWrong: "2 + (3 * 4) = 2 + 12 = 14." },
              { id: "D", text: "9", explanationIfWrong: "Order of operations dictates multiplication first." }
            ],
            correctAnswer: "A",
            explanationNote: "Multiplication (3 * 4 = 12) is evaluated first, then 2 + 12 = 14."
          },
          {
            id: "q-1.5-0-v2",
            question: "What does the expression 17 % 5 evaluate to in Java?",
            options: [
              { id: "A", text: "2", explanationIfWrong: "" },
              { id: "B", text: "3", explanationIfWrong: "5 * 3 = 15, remainder is 2." },
              { id: "C", text: "3.4", explanationIfWrong: "Modulo produces the integer remainder." },
              { id: "D", text: "0", explanationIfWrong: "17 is not evenly divisible by 5." }
            ],
            correctAnswer: "A",
            explanationNote: "17 divided by 5 equals 3 with a remainder of 2."
          }
        ]
      },
      {
        heading: "Integer Division Truncation Mechanics",
        text: "This is one of the most critical concepts in Java: when both operands in a division are integers, Java performs INTEGER DIVISION. Any fractional decimal part is strictly discarded (truncated), not rounded. For example, 3 / 2 evaluates to 1, and 1 / 2 evaluates to 0!",
        codeSnippet: "public class IntegerDivision {\n    public static void main(String[] args) {\n        int result = 3 / 2;\n        System.out.println(\"3 / 2 = \" + result); // Prints 1\n        \n        double badResult = 3 / 2;\n        System.out.println(\"double badResult = \" + badResult); // Prints 1.0!\n    }\n}",
        terminalOutput: "3 / 2 = 1\ndouble badResult = 1.0",
        warning: "Notice: storing '3 / 2' into a double still results in 1.0, because integer division (3 / 2) is calculated FIRST to 1 before being stored!",
        mcq: {
          id: "q-1.5-1-v1",
          question: "What does the expression 7 / 2 evaluate to in Java?",
          options: [
            { id: "A", text: "3", explanationIfWrong: "" },
            { id: "B", text: "3.5", explanationIfWrong: "Both 7 and 2 are integers, so integer division discards the decimal fraction." },
            { id: "C", text: "4", explanationIfWrong: "Integer division truncates; it does not round up." },
            { id: "D", text: "3.0", explanationIfWrong: "The result of int / int is an int (3)." }
          ],
          correctAnswer: "A",
          explanationNote: "Integer division truncates 3.5 down to 3."
        },
        retestMcq: {
          id: "q-1.5-1-v2",
          question: "What is printed by: System.out.println(1 / 2); in Java?",
          options: [
            { id: "A", text: "0", explanationIfWrong: "" },
            { id: "B", text: "0.5", explanationIfWrong: "Both operands are integers, so integer division drops the fraction." },
            { id: "C", text: "1", explanationIfWrong: "1 / 2 is 0 with remainder 1." },
            { id: "D", text: "ArithmeticException", explanationIfWrong: "Division by 2 is valid; division by zero produces exception." }
          ],
          correctAnswer: "A",
          explanationNote: "Integer division 1 / 2 truncates to 0."
        },
        questionPool: [
          {
            id: "q-1.5-1-v1",
            question: "What does the expression 7 / 2 evaluate to in Java?",
            options: [
              { id: "A", text: "3", explanationIfWrong: "" },
              { id: "B", text: "3.5", explanationIfWrong: "Both 7 and 2 are integers, so integer division discards the decimal fraction." },
              { id: "C", text: "4", explanationIfWrong: "Integer division truncates; it does not round up." },
              { id: "D", text: "3.0", explanationIfWrong: "The result of int / int is an int (3)." }
            ],
            correctAnswer: "A",
            explanationNote: "Integer division truncates 3.5 down to 3."
          },
          {
            id: "q-1.5-1-v2",
            question: "What is printed by: System.out.println(1 / 2); in Java?",
            options: [
              { id: "A", text: "0", explanationIfWrong: "" },
              { id: "B", text: "0.5", explanationIfWrong: "Both operands are integers, so integer division drops the fraction." },
              { id: "C", text: "1", explanationIfWrong: "1 / 2 is 0 with remainder 1." },
              { id: "D", text: "ArithmeticException", explanationIfWrong: "Division by 2 is valid; division by zero produces exception." }
            ],
            correctAnswer: "A",
            explanationNote: "Integer division 1 / 2 truncates to 0."
          }
        ]
      },
      {
        heading: "Floating-Point Division & Explicit Type Casting",
        text: "To obtain an accurate decimal result from division, at least one of the operands must be a floating-point number ('double'). You can achieve this by making a numeric literal a decimal (e.g. 3.0 / 2) or by explicitly type-casting with '(double)' before the variable.",
        codeSnippet: "public class AccurateDivision {\n    public static void main(String[] args) {\n        double result1 = 3.0 / 2; // 1.5\n        \n        int first = 3;\n        int second = 2;\n        double result2 = (double) first / second; // 1.5\n        \n        System.out.println(result1);\n        System.out.println(result2);\n    }\n}",
        terminalOutput: "1.5\n1.5",
        tip: "Type casting (double) applies to the immediate variable next to it: (double) first / second converts 'first' to double first, forcing floating-point division.",
        mcq: {
          id: "q-1.5-2-v1",
          question: "Which of the following expressions evaluates to 1.5 in Java?",
          options: [
            { id: "A", text: "(double) 3 / 2", explanationIfWrong: "" },
            { id: "B", text: "(double) (3 / 2)", explanationIfWrong: "3 / 2 evaluates to 1 first, which is then cast to 1.0." },
            { id: "C", text: "3 / 2", explanationIfWrong: "Both are ints, evaluating to 1." },
            { id: "D", text: "double(3 / 2)", explanationIfWrong: "Invalid Java cast syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "(double) 3 / 2 casts 3 to 3.0 first, resulting in 3.0 / 2 = 1.5."
        },
        retestMcq: {
          id: "q-1.5-2-v2",
          question: "What is the value of: double x = (double) (5 / 2);?",
          options: [
            { id: "A", text: "2.0", explanationIfWrong: "" },
            { id: "B", text: "2.5", explanationIfWrong: "Parentheses cause 5 / 2 to truncate to 2 BEFORE casting." },
            { id: "C", text: "2", explanationIfWrong: "x is a double, so it prints with a decimal (.0)." },
            { id: "D", text: "Compilation Error", explanationIfWrong: "This is valid Java syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "Because of parentheses, integer division 5 / 2 runs first yielding 2, which casts to 2.0."
        },
        questionPool: [
          {
            id: "q-1.5-2-v1",
            question: "Which of the following expressions evaluates to 1.5 in Java?",
            options: [
              { id: "A", text: "(double) 3 / 2", explanationIfWrong: "" },
              { id: "B", text: "(double) (3 / 2)", explanationIfWrong: "3 / 2 evaluates to 1 first, which is then cast to 1.0." },
              { id: "C", text: "3 / 2", explanationIfWrong: "Both are ints, evaluating to 1." },
              { id: "D", text: "double(3 / 2)", explanationIfWrong: "Invalid Java cast syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "(double) 3 / 2 casts 3 to 3.0 first, resulting in 3.0 / 2 = 1.5."
          },
          {
            id: "q-1.5-2-v2",
            question: "What is the value of: double x = (double) (5 / 2);?",
            options: [
              { id: "A", text: "2.0", explanationIfWrong: "" },
              { id: "B", text: "2.5", explanationIfWrong: "Parentheses cause 5 / 2 to truncate to 2 BEFORE casting." },
              { id: "C", text: "2", explanationIfWrong: "x is a double, so it prints with a decimal (.0)." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "This is valid Java syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "Because of parentheses, integer division 5 / 2 runs first yielding 2, which casts to 2.0."
          }
        ]
      },
      {
        heading: "Calculating Averages of Numbers (MOOC Exercise)",
        text: "A classic exercise in Part 1 is computing the average of two or three numbers. To calculate the average correctly, we add the numbers together and divide by the count as a floating point number (e.g. 2.0 or 3.0), or cast the sum to double.",
        codeSnippet: "public class AverageCalculator {\n    public static void main(String[] args) {\n        int first = 9;\n        int second = 2;\n        double average = (double) (first + second) / 2;\n        System.out.println(\"The average is \" + average); // 5.5\n    }\n}",
        terminalOutput: "The average is 5.5",
        tip: "Notice we use (first + second) in parentheses before casting to double, ensuring the full sum is converted.",
        mcq: {
          id: "q-1.5-3-v1",
          question: "How do you calculate the precise decimal average of two integers a and b in Java?",
          options: [
            { id: "A", text: "(double) (a + b) / 2", explanationIfWrong: "" },
            { id: "B", text: "(a + b) / 2", explanationIfWrong: "This performs integer division, losing decimal precision." },
            { id: "C", text: "a + b / 2.0", explanationIfWrong: "Division happens before addition without parentheses." },
            { id: "D", text: "Math.average(a, b)", explanationIfWrong: "Java's Math class does not have an average method." }
          ],
          correctAnswer: "A",
          explanationNote: "(double) (a + b) / 2 correctly casts the sum to double before division."
        },
        retestMcq: {
          id: "q-1.5-3-v2",
          question: "If int a = 1, b = 2, c = 3; what does (a + b + c) / 3 produce?",
          options: [
            { id: "A", text: "2 (since 6 / 3 is exactly 2)", explanationIfWrong: "" },
            { id: "B", text: "2.0", explanationIfWrong: "Result of integer division is an integer." },
            { id: "C", text: "1.5", explanationIfWrong: "6 / 3 = 2." },
            { id: "D", text: "Compilation Error", explanationIfWrong: "Completely valid integer math." }
          ],
          correctAnswer: "A",
          explanationNote: "6 / 3 is cleanly 2."
        },
        questionPool: [
          {
            id: "q-1.5-3-v1",
            question: "How do you calculate the precise decimal average of two integers a and b in Java?",
            options: [
              { id: "A", text: "(double) (a + b) / 2", explanationIfWrong: "" },
              { id: "B", text: "(a + b) / 2", explanationIfWrong: "This performs integer division, losing decimal precision." },
              { id: "C", text: "a + b / 2.0", explanationIfWrong: "Division happens before addition without parentheses." },
              { id: "D", text: "Math.average(a, b)", explanationIfWrong: "Java's Math class does not have an average method." }
            ],
            correctAnswer: "A",
            explanationNote: "(double) (a + b) / 2 correctly casts the sum to double before division."
          },
          {
            id: "q-1.5-3-v2",
            question: "If int a = 1, b = 2, c = 3; what does (a + b + c) / 3 produce?",
            options: [
              { id: "A", text: "2 (since 6 / 3 is exactly 2)", explanationIfWrong: "" },
              { id: "B", text: "2.0", explanationIfWrong: "Result of integer division is an integer." },
              { id: "C", text: "1.5", explanationIfWrong: "6 / 3 = 2." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "Completely valid integer math." }
            ],
            correctAnswer: "A",
            explanationNote: "6 / 3 is cleanly 2."
          }
        ]
      },
      {
        heading: "Seconds in Days (Helsinki MOOC Task 4)",
        text: "In the Helsinki MOOC 'Seconds in a Day' exercise, the program reads a number of days from the user and calculates the total seconds. There are 24 hours in a day, 60 minutes in an hour, and 60 seconds in a minute: seconds = days * 24 * 60 * 60 = days * 86400.",
        codeSnippet: "public class SecondsInDays {\n    public static void main(String[] args) {\n        int days = 5;\n        int seconds = days * 24 * 60 * 60;\n        System.out.println(seconds); // 432000\n    }\n}",
        terminalOutput: "432000",
        tip: "Multiplication chain 'days * 24 * 60 * 60' is evaluated sequentially from left to right.",
        mcq: {
          id: "q-1.5-4-v1",
          question: "How many seconds are in 1 complete day?",
          options: [
            { id: "A", text: "86,400 seconds (24 * 60 * 60)", explanationIfWrong: "" },
            { id: "B", text: "3,600 seconds", explanationIfWrong: "3,600 is the number of seconds in one hour." },
            { id: "C", text: "1,440 seconds", explanationIfWrong: "1,440 is the number of minutes in a day." },
            { id: "D", text: "100,000 seconds", explanationIfWrong: "24 * 3600 = 86400." }
          ],
          correctAnswer: "A",
          explanationNote: "24 hours * 60 minutes * 60 seconds = 86,400 seconds."
        },
        retestMcq: {
          id: "q-1.5-4-v2",
          question: "What is the formula to calculate seconds for 'n' days in Java?",
          options: [
            { id: "A", text: "n * 24 * 60 * 60", explanationIfWrong: "" },
            { id: "B", text: "n * 24 * 60", explanationIfWrong: "This calculates minutes, not seconds." },
            { id: "C", text: "n * 3600", explanationIfWrong: "3600 is seconds per hour, missing the 24 hours factor." },
            { id: "D", text: "n * 8640", explanationIfWrong: "A day has 86,400 seconds, not 8,640." }
          ],
          correctAnswer: "A",
          explanationNote: "n days * 24 hours * 60 minutes * 60 seconds."
        },
        questionPool: [
          {
            id: "q-1.5-4-v1",
            question: "How many seconds are in 1 complete day?",
            options: [
              { id: "A", text: "86,400 seconds (24 * 60 * 60)", explanationIfWrong: "" },
              { id: "B", text: "3,600 seconds", explanationIfWrong: "3,600 is the number of seconds in one hour." },
              { id: "C", text: "1,440 seconds", explanationIfWrong: "1,440 is the number of minutes in a day." },
              { id: "D", text: "100,000 seconds", explanationIfWrong: "24 * 3600 = 86400." }
            ],
            correctAnswer: "A",
            explanationNote: "24 hours * 60 minutes * 60 seconds = 86,400 seconds."
          },
          {
            id: "q-1.5-4-v2",
            question: "What is the formula to calculate seconds for 'n' days in Java?",
            options: [
              { id: "A", text: "n * 24 * 60 * 60", explanationIfWrong: "" },
              { id: "B", text: "n * 24 * 60", explanationIfWrong: "This calculates minutes, not seconds." },
              { id: "C", text: "n * 3600", explanationIfWrong: "3600 is seconds per hour, missing the 24 hours factor." },
              { id: "D", text: "n * 8640", explanationIfWrong: "A day has 86,400 seconds, not 8,640." }
            ],
            correctAnswer: "A",
            explanationNote: "n days * 24 hours * 60 minutes * 60 seconds."
          }
        ]
      },
      {
        heading: "Division by Zero in Java",
        text: "In Java integer arithmetic, dividing any integer by zero (e.g. 10 / 0) throws an 'ArithmeticException: / by zero' at runtime and halts execution. However, in floating-point math, dividing a double by zero (e.g. 10.0 / 0.0) does NOT throw an exception; it evaluates to 'Infinity'!",
        codeSnippet: "public class DivisionByZero {\n    public static void main(String[] args) {\n        // int error = 10 / 0; // Throws ArithmeticException!\n        double infinity = 10.0 / 0.0;\n        System.out.println(infinity); // Prints 'Infinity'\n    }\n}",
        terminalOutput: "Infinity",
        warning: "Always validate that integer divisors are non-zero before dividing to prevent program crashes.",
        mcq: {
          id: "q-1.5-5-v1",
          question: "What happens when you execute: int result = 10 / 0; in Java?",
          options: [
            { id: "A", text: "Throws an ArithmeticException: / by zero at runtime", explanationIfWrong: "" },
            { id: "B", text: "result becomes 0", explanationIfWrong: "Java does not silently evaluate 10 / 0 to 0." },
            { id: "C", text: "result becomes Infinity", explanationIfWrong: "Infinity is only for floating-point doubles, not ints." },
            { id: "D", text: "Compile-time syntax error", explanationIfWrong: "It compiles, but crashes at runtime." }
          ],
          correctAnswer: "A",
          explanationNote: "Integer division by zero throws an ArithmeticException at runtime."
        },
        retestMcq: {
          id: "q-1.5-5-v2",
          question: "What does the expression 5.0 / 0.0 evaluate to in Java?",
          options: [
            { id: "A", text: "Infinity", explanationIfWrong: "" },
            { id: "B", text: "ArithmeticException", explanationIfWrong: "IEEE 754 floating-point standard produces Infinity rather than throwing." },
            { id: "C", text: "NaN", explanationIfWrong: "0.0 / 0.0 is NaN; positive / 0.0 is Infinity." },
            { id: "D", text: "0.0", explanationIfWrong: "It evaluates to positive Infinity." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java floating-point arithmetic, non-zero double divided by zero produces Infinity."
        },
        questionPool: [
          {
            id: "q-1.5-5-v1",
            question: "What happens when you execute: int result = 10 / 0; in Java?",
            options: [
              { id: "A", text: "Throws an ArithmeticException: / by zero at runtime", explanationIfWrong: "" },
              { id: "B", text: "result becomes 0", explanationIfWrong: "Java does not silently evaluate 10 / 0 to 0." },
              { id: "C", text: "result becomes Infinity", explanationIfWrong: "Infinity is only for floating-point doubles, not ints." },
              { id: "D", text: "Compile-time syntax error", explanationIfWrong: "It compiles, but crashes at runtime." }
            ],
            correctAnswer: "A",
            explanationNote: "Integer division by zero throws an ArithmeticException at runtime."
          },
          {
            id: "q-1.5-5-v2",
            question: "What does the expression 5.0 / 0.0 evaluate to in Java?",
            options: [
              { id: "A", text: "Infinity", explanationIfWrong: "" },
              { id: "B", text: "ArithmeticException", explanationIfWrong: "IEEE 754 floating-point standard produces Infinity rather than throwing." },
              { id: "C", text: "NaN", explanationIfWrong: "0.0 / 0.0 is NaN; positive / 0.0 is Infinity." },
              { id: "D", text: "0.0", explanationIfWrong: "It evaluates to positive Infinity." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java floating-point arithmetic, non-zero double divided by zero produces Infinity."
          }
        ]
      }
    ]
  },
  {
    id: "1-6-conditional-logic",
    number: "1.6",
    title: "Conditional Statements & Logic",
    subtitle: "Branch execution with if, else-if, else, comparison operators, and String .equals() comparison.",
    readTime: "22 min",
    objectives: [
      "Use if statements to execute code conditionally",
      "Master comparison operators: >, >=, <, <=, ==, !=",
      "Use else and else-if branches to handle multiple alternative cases",
      "Understand why Strings MUST be compared using .equals() and NEVER ==",
      "Combine conditions with logical AND (&&) and logical OR (||)",
      "Invert conditions with logical NOT (!)",
      "Build the classic Helsinki MOOC 'Speeding Ticket' validation program"
    ],
    theoryBlocks: [
      {
        heading: "Conditional Statements & The If Block",
        text: "A conditional statement allows a program to make decisions. In Java, an 'if' statement evaluates a boolean condition placed inside parentheses '(condition)'. If the condition evaluates to true, the block of statements enclosed in curly brackets '{ ... }' is executed; otherwise, it is skipped.",
        codeSnippet: "public class SpeedingTicket {\n    public static void main(String[] args) {\n        int speed = 130;\n        if (speed > 120) {\n            System.out.println(\"Speeding ticket!\");\n        }\n    }\n}",
        terminalOutput: "Speeding ticket!",
        tip: "Always use curly braces { } around conditional bodies, even for single statements, to maintain clean and safe code.",
        mcq: {
          id: "q-1.6-0-v1",
          question: "When is the code inside an 'if' block executed in Java?",
          options: [
            { id: "A", text: "Only when the condition inside parentheses evaluates to true", explanationIfWrong: "" },
            { id: "B", text: "Only when the condition evaluates to false", explanationIfWrong: "false causes the if block to be skipped." },
            { id: "C", text: "Always, unconditionally", explanationIfWrong: "Conditionals are branch points that depend on the boolean test." },
            { id: "D", text: "Only if the condition is greater than 0", explanationIfWrong: "The condition must evaluate strictly to boolean true." }
          ],
          correctAnswer: "A",
          explanationNote: "An if block executes if and only if its condition evaluates to true."
        },
        retestMcq: {
          id: "q-1.6-0-v2",
          question: "What must wrap the condition in an if statement in Java: if condition { } or if (condition) { }?",
          options: [
            { id: "A", text: "Parentheses () are strictly mandatory: if (condition)", explanationIfWrong: "" },
            { id: "B", text: "Parentheses are optional as in Python or Go", explanationIfWrong: "Java syntax strictly requires parentheses around conditions." },
            { id: "C", text: "Square brackets [] must be used", explanationIfWrong: "Square brackets are for array types." },
            { id: "D", text: "Condition must be enclosed in quotes", explanationIfWrong: "Conditions are boolean expressions, not string literals." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, the condition of an if statement must be surrounded by parentheses."
        },
        questionPool: [
          {
            id: "q-1.6-0-v1",
            question: "When is the code inside an 'if' block executed in Java?",
            options: [
              { id: "A", text: "Only when the condition inside parentheses evaluates to true", explanationIfWrong: "" },
              { id: "B", text: "Only when the condition evaluates to false", explanationIfWrong: "false causes the if block to be skipped." },
              { id: "C", text: "Always, unconditionally", explanationIfWrong: "Conditionals are branch points that depend on the boolean test." },
              { id: "D", text: "Only if the condition is greater than 0", explanationIfWrong: "The condition must evaluate strictly to boolean true." }
            ],
            correctAnswer: "A",
            explanationNote: "An if block executes if and only if its condition evaluates to true."
          },
          {
            id: "q-1.6-0-v2",
            question: "What must wrap the condition in an if statement in Java: if condition { } or if (condition) { }?",
            options: [
              { id: "A", text: "Parentheses () are strictly mandatory: if (condition)", explanationIfWrong: "" },
              { id: "B", text: "Parentheses are optional as in Python or Go", explanationIfWrong: "Java syntax strictly requires parentheses around conditions." },
              { id: "C", text: "Square brackets [] must be used", explanationIfWrong: "Square brackets are for array types." },
              { id: "D", text: "Condition must be enclosed in quotes", explanationIfWrong: "Conditions are boolean expressions, not string literals." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, the condition of an if statement must be surrounded by parentheses."
          }
        ]
      },
      {
        heading: "Comparison Operators (==, !=, >, <, >=, <=)",
        text: "Comparison operators compare values and evaluate to either true or false: '==' checks for equality, '!=' checks for inequality, '>' is strictly greater than, '<' is strictly less than, '>=' is greater than or equal to, and '<=' is less than or equal to.",
        codeSnippet: "public class Comparisons {\n    public static void main(String[] args) {\n        int number = 55;\n        if (number != 0) {\n            System.out.println(\"Number is non-zero\");\n        }\n        if (number >= 50) {\n            System.out.println(\"Number is at least 50\");\n        }\n    }\n}",
        terminalOutput: "Number is non-zero\nNumber is at least 50",
        warning: "Never confuse the assignment operator '=' (which stores a value) with the comparison operator '==' (which tests equality).",
        mcq: {
          id: "q-1.6-1-v1",
          question: "Which operator checks if two numeric values are equal in Java?",
          options: [
            { id: "A", text: "==", explanationIfWrong: "" },
            { id: "B", text: "=", explanationIfWrong: "= is the variable assignment operator." },
            { id: "C", text: "===", explanationIfWrong: "=== is JavaScript identity operator; it does not exist in Java." },
            { id: "D", text: "equals", explanationIfWrong: "== is the operator for primitive comparison." }
          ],
          correctAnswer: "A",
          explanationNote: "The double equals operator (==) checks for equality between primitive values."
        },
        retestMcq: {
          id: "q-1.6-1-v2",
          question: "Which operator tests whether a value is NOT equal to another in Java?",
          options: [
            { id: "A", text: "!=", explanationIfWrong: "" },
            { id: "B", text: "<>", explanationIfWrong: "<> is SQL/Pascal syntax, not Java." },
            { id: "C", text: "not ==", explanationIfWrong: "The exclamation mark prefix != is the operator." },
            { id: "D", text: "!==", explanationIfWrong: "!== does not exist in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "!= is Java's inequality operator."
        },
        questionPool: [
          {
            id: "q-1.6-1-v1",
            question: "Which operator checks if two numeric values are equal in Java?",
            options: [
              { id: "A", text: "==", explanationIfWrong: "" },
              { id: "B", text: "=", explanationIfWrong: "= is the variable assignment operator." },
              { id: "C", text: "===", explanationIfWrong: "=== is JavaScript identity operator; it does not exist in Java." },
              { id: "D", text: "equals", explanationIfWrong: "== is the operator for primitive comparison." }
            ],
            correctAnswer: "A",
            explanationNote: "The double equals operator (==) checks for equality between primitive values."
          },
          {
            id: "q-1.6-1-v2",
            question: "Which operator tests whether a value is NOT equal to another in Java?",
            options: [
              { id: "A", text: "!=", explanationIfWrong: "" },
              { id: "B", text: "<>", explanationIfWrong: "<> is SQL/Pascal syntax, not Java." },
              { id: "C", text: "not ==", explanationIfWrong: "The exclamation mark prefix != is the operator." },
              { id: "D", text: "!==", explanationIfWrong: "!== does not exist in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "!= is Java's inequality operator."
          }
        ]
      },
      {
        heading: "Else and Else-If Branches",
        text: "When an alternative branch is needed if the condition is false, we append an 'else' block. When multiple mutually exclusive conditions exist, we chain 'else if' branches. Java evaluates them top-to-bottom and executes only the first branch whose condition is true.",
        codeSnippet: "public class Branches {\n    public static void main(String[] args) {\n        int number = 0;\n        if (number > 0) {\n            System.out.println(\"The number is positive.\");\n        } else if (number < 0) {\n            System.out.println(\"The number is negative.\");\n        } else {\n            System.out.println(\"The number is zero.\");\n        }\n    }\n}",
        terminalOutput: "The number is zero.",
        tip: "An else block has no condition; it catches all cases not satisfied by prior if and else-if checks.",
        mcq: {
          id: "q-1.6-2-v1",
          question: "In an if - else if - else chain, how many blocks can execute at most?",
          options: [
            { id: "A", text: "Exactly one block (the first one matching true)", explanationIfWrong: "" },
            { id: "B", text: "All blocks whose conditions are true", explanationIfWrong: "Once a matching branch runs, the rest of the chain is skipped." },
            { id: "C", text: "Always all of them sequentially", explanationIfWrong: "Branches are mutually exclusive." },
            { id: "D", text: "The else block always executes regardless", explanationIfWrong: "The else block only executes if all preceding conditions failed." }
          ],
          correctAnswer: "A",
          explanationNote: "In an if - else if - else chain, only the first matching branch executes."
        },
        retestMcq: {
          id: "q-1.6-2-v2",
          question: "When does the code inside an 'else' block execute?",
          options: [
            { id: "A", text: "When all preceding if and else-if conditions evaluated to false", explanationIfWrong: "" },
            { id: "B", text: "Whenever an error occurs in the if block", explanationIfWrong: "That is try-catch, not if-else." },
            { id: "C", text: "When the program exits the loop", explanationIfWrong: "else is part of conditional branching." },
            { id: "D", text: "Before the if block runs", explanationIfWrong: "else is evaluated only after prior checks fail." }
          ],
          correctAnswer: "A",
          explanationNote: "The else branch acts as the default fallback when preceding conditions evaluate to false."
        },
        questionPool: [
          {
            id: "q-1.6-2-v1",
            question: "In an if - else if - else chain, how many blocks can execute at most?",
            options: [
              { id: "A", text: "Exactly one block (the first one matching true)", explanationIfWrong: "" },
              { id: "B", text: "All blocks whose conditions are true", explanationIfWrong: "Once a matching branch runs, the rest of the chain is skipped." },
              { id: "C", text: "Always all of them sequentially", explanationIfWrong: "Branches are mutually exclusive." },
              { id: "D", text: "The else block always executes regardless", explanationIfWrong: "The else block only executes if all preceding conditions failed." }
            ],
            correctAnswer: "A",
            explanationNote: "In an if - else if - else chain, only the first matching branch executes."
          },
          {
            id: "q-1.6-2-v2",
            question: "When does the code inside an 'else' block execute?",
            options: [
              { id: "A", text: "When all preceding if and else-if conditions evaluated to false", explanationIfWrong: "" },
              { id: "B", text: "Whenever an error occurs in the if block", explanationIfWrong: "That is try-catch, not if-else." },
              { id: "C", text: "When the program exits the loop", explanationIfWrong: "else is part of conditional branching." },
              { id: "D", text: "Before the if block runs", explanationIfWrong: "else is evaluated only after prior checks fail." }
            ],
            correctAnswer: "A",
            explanationNote: "The else branch acts as the default fallback when preceding conditions evaluate to false."
          }
        ]
      },
      {
        heading: "Comparing Strings with .equals() (CRITICAL Java Rule)",
        text: "In Java, Strings MUST be compared using the '.equals()' method, NEVER with '=='. In Java, '==' compares memory addresses (object references), not character contents! Two distinct String objects containing the exact same letters 'hello' will fail an '==' check if they reside in different memory locations.",
        codeSnippet: "public class StringComparison {\n    public static void main(String[] args) {\n        String password = \"secret\";\n        \n        // CORRECT WAY:\n        if (password.equals(\"secret\")) {\n            System.out.println(\"Access granted!\");\n        }\n        \n        // WRONG: if (password == \"secret\") // Flaky & Dangerous!\n    }\n}",
        terminalOutput: "Access granted!",
        warning: "Never use == to compare strings in Java. Always write stringA.equals(stringB).",
        mcq: {
          id: "q-1.6-3-v1",
          question: "How MUST strings be compared for content equality in Java?",
          options: [
            { id: "A", text: "text.equals(\"target\")", explanationIfWrong: "" },
            { id: "B", text: "text == \"target\"", explanationIfWrong: "== compares memory references, not text contents in Java." },
            { id: "C", text: "text.compare(\"target\")", explanationIfWrong: "The method is .equals() or .compareTo(), not .compare()." },
            { id: "D", text: "text = \"target\"", explanationIfWrong: "= is assignment, not comparison." }
          ],
          correctAnswer: "A",
          explanationNote: "Strings in Java must be compared using the .equals() method."
        },
        retestMcq: {
          id: "q-1.6-3-v2",
          question: "What does the '==' operator compare when applied to two String variables in Java?",
          options: [
            { id: "A", text: "Whether they reference the exact same memory address (reference identity)", explanationIfWrong: "" },
            { id: "B", text: "The alphabetical order of their characters", explanationIfWrong: "Alphabetical comparison uses compareTo()." },
            { id: "C", text: "The character count of both strings", explanationIfWrong: "Length comparison uses .length()." },
            { id: "D", text: "Whether they contain the same characters", explanationIfWrong: "Content equality is checked by .equals()." }
          ],
          correctAnswer: "A",
          explanationNote: "== checks if both references point to the exact same memory location."
        },
        questionPool: [
          {
            id: "q-1.6-3-v1",
            question: "How MUST strings be compared for content equality in Java?",
            options: [
              { id: "A", text: "text.equals(\"target\")", explanationIfWrong: "" },
              { id: "B", text: "text == \"target\"", explanationIfWrong: "== compares memory references, not text contents in Java." },
              { id: "C", text: "text.compare(\"target\")", explanationIfWrong: "The method is .equals() or .compareTo(), not .compare()." },
              { id: "D", text: "text = \"target\"", explanationIfWrong: "= is assignment, not comparison." }
            ],
            correctAnswer: "A",
            explanationNote: "Strings in Java must be compared using the .equals() method."
          },
          {
            id: "q-1.6-3-v2",
            question: "What does the '==' operator compare when applied to two String variables in Java?",
            options: [
              { id: "A", text: "Whether they reference the exact same memory address (reference identity)", explanationIfWrong: "" },
              { id: "B", text: "The alphabetical order of their characters", explanationIfWrong: "Alphabetical comparison uses compareTo()." },
              { id: "C", text: "The character count of both strings", explanationIfWrong: "Length comparison uses .length()." },
              { id: "D", text: "Whether they contain the same characters", explanationIfWrong: "Content equality is checked by .equals()." }
            ],
            correctAnswer: "A",
            explanationNote: "== checks if both references point to the exact same memory location."
          }
        ]
      },
      {
        heading: "Logical Operators: AND (&&) & OR (||)",
        text: "You can combine multiple conditions using logical operators: '&&' (logical AND) requires BOTH conditions to be true. '||' (logical OR) requires AT LEAST ONE condition to be true. Java uses short-circuit evaluation: in 'false && ...', the second condition is never evaluated because the outcome is already guaranteed to be false.",
        codeSnippet: "public class LogicalOperators {\n    public static void main(String[] args) {\n        int number = 7;\n        if (number >= 5 && number <= 10) {\n            System.out.println(\"Number is between 5 and 10!\");\n        }\n        \n        int age = 70;\n        if (age < 18 || age >= 65) {\n            System.out.println(\"Eligible for special discount\");\n        }\n    }\n}",
        terminalOutput: "Number is between 5 and 10!\nEligible for special discount",
        tip: "Short-circuit evaluation prevents NullPointerExceptions (e.g. if (str != null && str.length() > 0)).",
        mcq: {
          id: "q-1.6-4-v1",
          question: "Which operator represents logical AND in Java?",
          options: [
            { id: "A", text: "&&", explanationIfWrong: "" },
            { id: "B", text: "and", explanationIfWrong: "and is used in Python, not Java." },
            { id: "C", text: "& (single ampersand)", explanationIfWrong: "& is bitwise AND without short-circuiting." },
            { id: "D", text: "AND", explanationIfWrong: "Java operators are lowercase symbols." }
          ],
          correctAnswer: "A",
          explanationNote: "&& is Java's short-circuit logical AND operator."
        },
        retestMcq: {
          id: "q-1.6-4-v2",
          question: "What does true || false evaluate to in Java?",
          options: [
            { id: "A", text: "true", explanationIfWrong: "" },
            { id: "B", text: "false", explanationIfWrong: "The OR operator evaluates to true if at least one operand is true." },
            { id: "C", text: "null", explanationIfWrong: "Logical operators return boolean values." },
            { id: "D", text: "Compilation Error", explanationIfWrong: "Valid boolean expression." }
          ],
          correctAnswer: "A",
          explanationNote: "Logical OR (||) yields true if either operand is true."
        },
        questionPool: [
          {
            id: "q-1.6-4-v1",
            question: "Which operator represents logical AND in Java?",
            options: [
              { id: "A", text: "&&", explanationIfWrong: "" },
              { id: "B", text: "and", explanationIfWrong: "and is used in Python, not Java." },
              { id: "C", text: "& (single ampersand)", explanationIfWrong: "& is bitwise AND without short-circuiting." },
              { id: "D", text: "AND", explanationIfWrong: "Java operators are lowercase symbols." }
            ],
            correctAnswer: "A",
            explanationNote: "&& is Java's short-circuit logical AND operator."
          },
          {
            id: "q-1.6-4-v2",
            question: "What does true || false evaluate to in Java?",
            options: [
              { id: "A", text: "true", explanationIfWrong: "" },
              { id: "B", text: "false", explanationIfWrong: "The OR operator evaluates to true if at least one operand is true." },
              { id: "C", text: "null", explanationIfWrong: "Logical operators return boolean values." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "Valid boolean expression." }
            ],
            correctAnswer: "A",
            explanationNote: "Logical OR (||) yields true if either operand is true."
          }
        ]
      },
      {
        heading: "Logical NOT (!) & Speeding Ticket Challenge",
        text: "The logical NOT operator '!' negates or flips a boolean value: '!true' becomes 'false', and '!false' becomes 'true'. This is helpful for checking negative states like 'if (!scanner.hasNextInt())'. Combining conditionals, variables, and Scanner completes Part 1 of the Helsinki Java MOOC curriculum!",
        codeSnippet: "public class LogicalNot {\n    public static void main(String[] args) {\n        boolean isRaining = false;\n        if (!isRaining) {\n            System.out.println(\"No umbrella needed today!\");\n        }\n    }\n}",
        terminalOutput: "No umbrella needed today!",
        tip: "Congratulations on completing all 6 modules of Helsinki Java MOOC Part 1!",
        mcq: {
          id: "q-1.6-5-v1",
          question: "What does the expression !(5 > 2) evaluate to in Java?",
          options: [
            { id: "A", text: "false", explanationIfWrong: "" },
            { id: "B", text: "true", explanationIfWrong: "5 > 2 is true, and ! inverts true to false." },
            { id: "C", text: "5", explanationIfWrong: "Logical operations evaluate to boolean." },
            { id: "D", text: "Compilation Error", explanationIfWrong: "! can invert any boolean expression in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "5 > 2 evaluates to true. Negating true with ! yields false."
        },
        retestMcq: {
          id: "q-1.6-5-v2",
          question: "What is the result of !(!true)?",
          options: [
            { id: "A", text: "true", explanationIfWrong: "" },
            { id: "B", text: "false", explanationIfWrong: "Double negation flips back to true." },
            { id: "C", text: "null", explanationIfWrong: "Boolean values are primitive." },
            { id: "D", text: "Syntax Error", explanationIfWrong: "Double negation is valid." }
          ],
          correctAnswer: "A",
          explanationNote: "!true is false, and !false is true."
        },
        questionPool: [
          {
            id: "q-1.6-5-v1",
            question: "What does the expression !(5 > 2) evaluate to in Java?",
            options: [
              { id: "A", text: "false", explanationIfWrong: "" },
              { id: "B", text: "true", explanationIfWrong: "5 > 2 is true, and ! inverts true to false." },
              { id: "C", text: "5", explanationIfWrong: "Logical operations evaluate to boolean." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "! can invert any boolean expression in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "5 > 2 evaluates to true. Negating true with ! yields false."
          },
          {
            id: "q-1.6-5-v2",
            question: "What is the result of !(!true)?",
            options: [
              { id: "A", text: "true", explanationIfWrong: "" },
              { id: "B", text: "false", explanationIfWrong: "Double negation flips back to true." },
              { id: "C", text: "null", explanationIfWrong: "Boolean values are primitive." },
              { id: "D", text: "Syntax Error", explanationIfWrong: "Double negation is valid." }
            ],
            correctAnswer: "A",
            explanationNote: "!true is false, and !false is true."
          }
        ]
      }
    ]
  }
];

// Helper to retrieve or select active questions for a given level with duplicate prevention
export const getActiveQuestionsForLevel = (
  section: SectionContent,
  studentId: string,
  forceNewSet: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_java_question_history_${studentId}`;
  const activeSetKey = `dopilot_java_active_questions_${section.id}_${studentId}`;

  // If not forcing a new set, return previously assigned questions for this level if present
  if (!forceNewSet) {
    try {
      const saved = localStorage.getItem(activeSetKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === section.theoryBlocks.length) {
          return parsed;
        }
      }
    } catch {}
  }

  // Retrieve student's seen question history
  let seenIds: string[] = [];
  try {
    const historySaved = localStorage.getItem(historyKey);
    if (historySaved) {
      seenIds = JSON.parse(historySaved);
    }
  } catch {}

  const selectedQuestions: McqQuestion[] = [];
  const newlySeenIds: string[] = [];

  section.theoryBlocks.forEach((block, bIdx) => {
    // Get question pool for this concept
    const pool: McqQuestion[] = block.questionPool && block.questionPool.length > 0
      ? block.questionPool
      : [
          { ...block.mcq!, id: `q-${section.id}-${bIdx}-v1` },
          { ...(block.retestMcq || block.mcq!), id: `q-${section.id}-${bIdx}-v2` }
        ];

    // Filter out questions previously seen by this student
    const unseen = pool.filter(q => q.id && !seenIds.includes(q.id));

    let chosenQuestion: McqQuestion;
    if (unseen.length > 0) {
      chosenQuestion = unseen[0];
    } else {
      // If all questions in pool have already been seen across multiple resets, pick the last one
      chosenQuestion = pool[pool.length - 1];
    }

    selectedQuestions.push(chosenQuestion);
    if (chosenQuestion.id && !seenIds.includes(chosenQuestion.id)) {
      newlySeenIds.push(chosenQuestion.id);
    }
  });

  // Save newly seen question IDs to student's persistent history
  const updatedHistory = [...seenIds, ...newlySeenIds];
  try {
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    localStorage.setItem(activeSetKey, JSON.stringify(selectedQuestions));
  } catch {}

  return selectedQuestions;
};

// Consecutive failure tracking helpers
export const getConsecutiveFailures = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_java_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevels = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_java_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCount = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_java_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCount = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_java_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResult = (
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
  const currentAttempt = getLevelAttemptCount(sectionId, studentId);

  if (isPassed) {
    // If student passed on Attempt 1 or Attempt 2:
    // Reset consecutive failed levels streak to 0!
    try {
      localStorage.setItem(`dopilot_java_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_java_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_java_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_java_locked_${studentId}`);
    } catch {}

    return {
      isPassed: true,
      attemptCount: currentAttempt,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    // FAILED this attempt (score <= 80%)
    if (currentAttempt === 1) {
      // First failure in this level -> Prepare for Attempt 2
      setLevelAttemptCount(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevels(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      // Second failure in this level!
      const prevStreak = getConsecutiveFailedLevels(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_java_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_java_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_java_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailures = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_java_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_java_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_java_locked_${studentId}`);
    localStorage.removeItem(`dopilot_java_locked_progression_${studentId}`);
  } catch {}
};
