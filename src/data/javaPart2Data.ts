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

export const PART_2_SECTIONS: SectionContent[] = [
  {
    id: "2-1-recurring-problems",
    number: "2.1",
    title: "Recurring Problems & Patterns",
    subtitle: "Master common algorithmic patterns: calculating squares, square roots with Math.sqrt, absolute values, and comparison branching.",
    readTime: "15 min",
    objectives: [
      "Calculate squares of numbers using multiplication",
      "Compute square roots using Java's built-in Math.sqrt() method",
      "Determine absolute values using Math.abs() and conditional branching",
      "Compare two numbers and output relative magnitude",
      "Formulate boolean comparison logic with multiple branches",
      "Handle numeric conversions and edge-cases accurately"
    ],
    theoryBlocks: [
      {
        heading: "Squaring Numbers & Multiplying Values",
        text: "In Java, squaring a number simply means multiplying the value by itself (number * number). While some languages provide an exponentiation operator like '**' or '^', in Java '^' is the bitwise XOR operator, not power. For squaring integers, direct multiplication is both standard and most efficient.",
        codeSnippet: "import java.util.Scanner;\n\npublic class Squared {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int number = 4;\n        int square = number * number;\n        System.out.println(square);\n    }\n}",
        terminalOutput: "16",
        tip: "Never use '^' for exponentiation in Java. In Java, 4 ^ 2 is bitwise XOR resulting in 6, not 16.",
        warning: "Squaring very large integers can cause 32-bit integer overflow. If multiplying numbers larger than 46,340, use 'long'.",
        mcq: {
          id: "q-2.1-0-v1",
          question: "How do you correctly square an integer variable named 'val' in Java?",
          options: [
            { id: "A", text: "val * val", explanationIfWrong: "" },
            { id: "B", text: "val ^ 2", explanationIfWrong: "'^' is bitwise XOR in Java, not the power operator." },
            { id: "C", text: "val ** 2", explanationIfWrong: "'**' is not a valid Java operator." },
            { id: "D", text: "Math.square(val)", explanationIfWrong: "There is no 'Math.square()' method in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, multiplying the variable by itself ('val * val') is the correct and idiomatic way to square an integer."
        },
        questionPool: [
          {
            id: "q-2.1-0-v2",
            question: "What does the expression (5 ^ 2) evaluate to in Java?",
            options: [
              { id: "A", text: "7 (because '^' is the bitwise XOR operator)", explanationIfWrong: "" },
              { id: "B", text: "25 (because '^' computes exponentiation)", explanationIfWrong: "'^' is bitwise XOR, not power." },
              { id: "C", text: "10 (multiplication)", explanationIfWrong: "It does not multiply." },
              { id: "D", text: "A compilation error", explanationIfWrong: "'^' is valid syntax for bitwise XOR." }
            ],
            correctAnswer: "A",
            explanationNote: "In binary, 5 is 101 and 2 is 010. 101 XOR 010 equals 111 in binary, which is 7."
          }
        ]
      },
      {
        heading: "Square Root with Math.sqrt()",
        text: "To compute the square root of a number, Java provides the static method 'Math.sqrt()' in the 'java.lang.Math' package. Because Math is in java.lang, no import is required. 'Math.sqrt()' accepts a double and always returns a double value.",
        codeSnippet: "public class SquareRoot {\n    public static void main(String[] args) {\n        double root = Math.sqrt(81);\n        System.out.println(root);\n    }\n}",
        terminalOutput: "9.0",
        tip: "Math.sqrt() always returns a 'double'. To assign it to an 'int', you must explicitly cast: (int) Math.sqrt(81).",
        warning: "Calling Math.sqrt() on a negative number returns 'NaN' (Not a Number), not an exception.",
        mcq: {
          id: "q-2.1-1-v1",
          question: "What does Math.sqrt(25) return in Java?",
          options: [
            { id: "A", text: "5.0 (type double)", explanationIfWrong: "" },
            { id: "B", text: "5 (type int)", explanationIfWrong: "Math.sqrt returns double, not int." },
            { id: "C", text: "\"5.0\" (type String)", explanationIfWrong: "Math.sqrt returns a numeric double, not a String." },
            { id: "D", text: "25.0", explanationIfWrong: "25.0 is the input, not the square root." }
          ],
          correctAnswer: "A",
          explanationNote: "Math.sqrt() always returns a double value. For input 25, it returns 5.0."
        },
        questionPool: [
          {
            id: "q-2.1-1-v2",
            question: "What is the return value of Math.sqrt(-9) in Java?",
            options: [
              { id: "A", text: "NaN (Double.NaN)", explanationIfWrong: "" },
              { id: "B", text: "ArithmeticException", explanationIfWrong: "Java does not throw an exception for Math.sqrt(-9); it returns NaN." },
              { id: "C", text: "-3.0", explanationIfWrong: "Square roots of negative numbers cannot be real numbers." },
              { id: "D", text: "0.0", explanationIfWrong: "It returns NaN." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java floating-point arithmetic (IEEE 754), Math.sqrt of a negative number produces NaN (Not a Number)."
          }
        ]
      },
      {
        heading: "Absolute Values with Math.abs()",
        text: "The absolute value of a number is its non-negative magnitude (distance from 0). Java provides 'Math.abs()' which is overloaded for int, long, float, and double. If the input is positive or zero, it is returned unchanged. If negative, the negated positive value is returned.",
        codeSnippet: "public class AbsoluteValue {\n    public static void main(String[] args) {\n        int negative = -42;\n        int positive = Math.abs(negative);\n        System.out.println(positive);\n    }\n}",
        terminalOutput: "42",
        tip: "You can also compute absolute value manually: if (number < 0) { number = -number; }.",
        mcq: {
          id: "q-2.1-2-v1",
          question: "What is the result of Math.abs(-17)?",
          options: [
            { id: "A", text: "17", explanationIfWrong: "" },
            { id: "B", text: "-17", explanationIfWrong: "Absolute value is non-negative." },
            { id: "C", text: "0", explanationIfWrong: "Math.abs does not reset to zero." },
            { id: "D", text: "-1", explanationIfWrong: "It returns the magnitude." }
          ],
          correctAnswer: "A",
          explanationNote: "Math.abs(-17) returns 17 by stripping the negative sign."
        },
        questionPool: [
          {
            id: "q-2.1-2-v2",
            question: "Without using Math.abs(), which code snippet correctly calculates the absolute value of int 'x'?",
            options: [
              { id: "A", text: "if (x < 0) { x = x * -1; }", explanationIfWrong: "" },
              { id: "B", text: "x = +x;", explanationIfWrong: "+x does not convert negative numbers to positive." },
              { id: "C", text: "x = x / -1;", explanationIfWrong: "This negates positive numbers too." },
              { id: "D", text: "if (x > 0) { x = -x; }", explanationIfWrong: "This makes positive numbers negative." }
            ],
            correctAnswer: "A",
            explanationNote: "Multiplying a negative integer by -1 converts it into its positive absolute value."
          }
        ]
      },
      {
        heading: "Comparing Two Numbers",
        text: "When comparing two numeric inputs, there are three mutually exclusive relationships: first > second, first < second, or first == second. In Java, an 'if - else if - else' ladder ensures that exactly one comparison branch executes.",
        codeSnippet: "public class ComparingNumbers {\n    public static void main(String[] args) {\n        int a = 8;\n        int b = 8;\n        if (a > b) {\n            System.out.println(a + \" is greater than \" + b);\n        } else if (a < b) {\n            System.out.println(a + \" is smaller than \" + b);\n        } else {\n            System.out.println(a + \" is equal to \" + b);\n        }\n    }\n}",
        terminalOutput: "8 is equal to 8",
        tip: "Notice that the 'else' branch handles equality automatically without needing an explicit 'else if (a == b)'.",
        mcq: {
          id: "q-2.1-3-v1",
          question: "Given int x = 12 and int y = 15, which branch of the standard compare ladder executes?",
          options: [
            { id: "A", text: "else if (x < y)", explanationIfWrong: "" },
            { id: "B", text: "if (x > y)", explanationIfWrong: "12 is not greater than 15." },
            { id: "C", text: "else (x == y)", explanationIfWrong: "12 is not equal to 15." },
            { id: "D", text: "All branches execute sequentially", explanationIfWrong: "Only the first true branch in an if-else if-else chain executes." }
          ],
          correctAnswer: "A",
          explanationNote: "Because 12 < 15, the condition 'x < y' evaluates to true and its code block runs."
        },
        questionPool: [
          {
            id: "q-2.1-3-v2",
            question: "Why does an 'if - else if - else' structure execute faster and safer than three independent 'if' statements?",
            options: [
              { id: "A", text: "As soon as one branch evaluates to true, the remaining branches are skipped entirely", explanationIfWrong: "" },
              { id: "B", text: "Independent if statements cannot compare integers", explanationIfWrong: "They can compare integers." },
              { id: "C", text: "The Java compiler rejects multiple if statements in the same method", explanationIfWrong: "Multiple if statements are valid." },
              { id: "D", text: "Else if converts integers to boolean variables automatically", explanationIfWrong: "It does not convert integers to booleans." }
            ],
            correctAnswer: "A",
            explanationNote: "An if-else chain is mutually exclusive: once a branch is satisfied, Java skips all subsequent conditions in that chain."
          }
        ]
      },
      {
        heading: "Root of Sum Pattern",
        text: "A classic Helsinki MOOC exercise asks to read two integers, compute their sum, and then print the square root of that sum. This requires chaining: first reading inputs, calculating sum = a + b, and then Math.sqrt(sum).",
        codeSnippet: "public class RootOfSum {\n    public static void main(String[] args) {\n        int first = 9;\n        int second = 16;\n        int sum = first + second; // 25\n        double result = Math.sqrt(sum);\n        System.out.println(result);\n    }\n}",
        terminalOutput: "5.0",
        tip: "Break the problem down step-by-step: 1) calculate the sum, 2) compute square root, 3) print output.",
        mcq: {
          id: "q-2.1-4-v1",
          question: "If int first = 60 and int second = 40, what is the output of Math.sqrt(first + second)?",
          options: [
            { id: "A", text: "10.0", explanationIfWrong: "" },
            { id: "B", text: "10", explanationIfWrong: "Math.sqrt returns double (10.0)." },
            { id: "C", text: "100.0", explanationIfWrong: "100 is the sum, not the square root." },
            { id: "D", text: "50.0", explanationIfWrong: "The square root of 100 is 10.0." }
          ],
          correctAnswer: "A",
          explanationNote: "first + second = 60 + 40 = 100. Math.sqrt(100) returns 10.0."
        },
        questionPool: [
          {
            id: "q-2.1-4-v2",
            question: "What is the result of Math.sqrt(18 + 7)?",
            options: [
              { id: "A", text: "5.0", explanationIfWrong: "" },
              { id: "B", text: "25.0", explanationIfWrong: "25 is the sum, not the square root." },
              { id: "C", text: "5", explanationIfWrong: "Math.sqrt returns a double." },
              { id: "D", text: "6.25", explanationIfWrong: "The square root of 25 is 5.0." }
            ],
            correctAnswer: "A",
            explanationNote: "18 + 7 = 25. The square root of 25 is 5.0."
          }
        ]
      },
      {
        heading: "Comparing Strings with .equals() Revisited",
        text: "Remember from Part 1: when comparing String inputs from Scanner, '==' checks reference equality (memory location), whereas '.equals()' checks character content. When checking for a sentinel word like 'end' or 'yes', you must always use .equals().",
        codeSnippet: "public class StringMatch {\n    public static void main(String[] args) {\n        String response = \"yes\";\n        if (response.equals(\"yes\")) {\n            System.out.println(\"Confirmed!\");\n        }\n    }\n}",
        terminalOutput: "Confirmed!",
        tip: "To compare case-insensitively, use response.equalsIgnoreCase(\"yes\").",
        mcq: {
          id: "q-2.1-5-v1",
          question: "Which of the following is the only correct way to check if a user input String equals \"quit\"?",
          options: [
            { id: "A", text: "input.equals(\"quit\")", explanationIfWrong: "" },
            { id: "B", text: "input == \"quit\"", explanationIfWrong: "'==' compares memory reference, which often fails for user input." },
            { id: "C", text: "input.compare(\"quit\")", explanationIfWrong: "The method is .equals() or .compareTo()." },
            { id: "D", text: "input = \"quit\"", explanationIfWrong: "Single '=' is assignment, not comparison." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, always use '.equals()' (or '.equalsIgnoreCase()') to compare String values."
        },
        questionPool: [
          {
            id: "q-2.1-5-v2",
            question: "What does \"hello\".equalsIgnoreCase(\"HELLO\") return?",
            options: [
              { id: "A", text: "true", explanationIfWrong: "" },
              { id: "B", text: "false", explanationIfWrong: "equalsIgnoreCase ignores uppercase vs lowercase." },
              { id: "C", text: "0", explanationIfWrong: "It returns boolean true/false, not an int." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "equalsIgnoreCase is a standard method on String." }
            ],
            correctAnswer: "A",
            explanationNote: "equalsIgnoreCase compares the letters without regard to case, returning true."
          }
        ]
      }
    ]
  },
  {
    id: "2-2-repeating-functionality",
    number: "2.2",
    title: "Repeating Functionality & While Loops",
    subtitle: "Master while (true) loops, exit conditions using the break command, reading continuous user inputs, and tracking running counts.",
    readTime: "20 min",
    objectives: [
      "Understand the mechanics of a while (true) loop",
      "Terminate loop execution immediately using the 'break' statement",
      "Process indefinite user input until a termination command is entered",
      "Accumulate counts of numbers entered inside a loop",
      "Calculate the running sum of inputs",
      "Avoid infinite loops through clear termination boundaries"
    ],
    theoryBlocks: [
      {
        heading: "The while (true) Loop Structure",
        text: "The simplest way to repeat an action indefinitely in Java is the 'while (true)' loop. Because the boolean literal 'true' never changes to false, the loop body will repeat endlessly unless explicitly terminated from within.",
        codeSnippet: "public class SimpleLoop {\n    public static void main(String[] args) {\n        int count = 0;\n        while (true) {\n            System.out.println(\"Loop iteration: \" + count);\n            count++;\n            if (count == 3) {\n                break;\n            }\n        }\n    }\n}",
        terminalOutput: "Loop iteration: 0\nLoop iteration: 1\nLoop iteration: 2",
        tip: "A while (true) loop must have at least one reachable 'break;' statement to prevent freezing the application.",
        warning: "A loop without a reachable exit condition is called an 'infinite loop'.",
        mcq: {
          id: "q-2.2-0-v1",
          question: "What happens when a Java program encounters an unconditional 'while (true) { System.out.println(\"Hi\"); }' with no break?",
          options: [
            { id: "A", text: "It prints \"Hi\" forever in an infinite loop", explanationIfWrong: "" },
            { id: "B", text: "It runs exactly once and terminates", explanationIfWrong: "The condition 'true' never becomes false." },
            { id: "C", text: "The compiler throws an error", explanationIfWrong: "Infinite loops compile without error." },
            { id: "D", text: "It stops after 100 iterations", explanationIfWrong: "Java does not impose an automatic iteration limit." }
          ],
          correctAnswer: "A",
          explanationNote: "Because 'true' is permanently true and there is no 'break', the loop runs indefinitely."
        },
        questionPool: [
          {
            id: "q-2.2-0-v2",
            question: "Which keyword immediately exits a loop and resumes execution after the closing brace?",
            options: [
              { id: "A", text: "break", explanationIfWrong: "" },
              { id: "B", text: "stop", explanationIfWrong: "'stop' is not a keyword in Java." },
              { id: "C", text: "exit", explanationIfWrong: "'exit' is not a keyword for loops." },
              { id: "D", text: "skip", explanationIfWrong: "'skip' is not a Java keyword." }
            ],
            correctAnswer: "A",
            explanationNote: "The 'break' keyword immediately terminates the innermost enclosing loop."
          }
        ]
      },
      {
        heading: "Breaking Out of Loops with 'break'",
        text: "The 'break' command is used inside a loop body (typically within an 'if' statement) to immediately cease execution of the loop. Control jumps directly to the statement immediately following the loop's closing curly brace '}'.",
        codeSnippet: "public class BreakExample {\n    public static void main(String[] args) {\n        while (true) {\n            System.out.println(\"Executing...\");\n            break;\n            // System.out.println(\"Never runs\"); // Unreachable code!\n        }\n        System.out.println(\"Loop finished.\");\n    }\n}",
        terminalOutput: "Executing...\nLoop finished.",
        tip: "Writing any code directly after an unconditional 'break;' inside the same block causes a 'unreachable code' compiler error.",
        mcq: {
          id: "q-2.2-1-v1",
          question: "Where does program execution jump when a 'break' statement is executed inside a while loop?",
          options: [
            { id: "A", text: "To the statement immediately following the loop's closing brace", explanationIfWrong: "" },
            { id: "B", text: "Back to the top of the loop for the next iteration", explanationIfWrong: "That is what 'continue' does, not 'break'." },
            { id: "C", text: "It terminates the entire Java application immediately", explanationIfWrong: "System.exit() does that, not 'break'." },
            { id: "D", text: "To the start of the main method", explanationIfWrong: "'break' does not restart methods." }
          ],
          correctAnswer: "A",
          explanationNote: "'break' halts the loop and transfers execution directly to the code right after the loop."
        },
        questionPool: [
          {
            id: "q-2.2-1-v2",
            question: "What error occurs if you place code immediately after an unconditional 'break;' before the closing brace?",
            options: [
              { id: "A", text: "Unreachable code compilation error", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "This is a runtime exception, not a compilation error." },
              { id: "C", text: "StackOverflowError", explanationIfWrong: "StackOverflow occurs with deep recursion." },
              { id: "D", text: "It executes normally", explanationIfWrong: "Java detects unreachable statements at compile time." }
            ],
            correctAnswer: "A",
            explanationNote: "The Java compiler detects when a statement cannot possibly be reached and refuses to compile."
          }
        ]
      },
      {
        heading: "Reading Input until Sentinel Value",
        text: "A frequent pattern in Helsinki MOOC Part 2 is reading inputs repeatedly until the user types a specific termination number (e.g. 4 or 0). Inside the loop, read the input. If it equals the sentinel, 'break;'. Otherwise, process it.",
        codeSnippet: "import java.util.Scanner;\n\npublic class StayPositive {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(\"1\\n5\\n4\\n\");\n        while (true) {\n            int number = Integer.valueOf(scanner.nextLine());\n            if (number == 4) {\n                break;\n            }\n            System.out.println(\"You gave: \" + number);\n        }\n    }\n}",
        terminalOutput: "You gave: 1\nYou gave: 5",
        tip: "Notice that '4' is not printed because the 'if (number == 4) break;' precedes the println statement.",
        mcq: {
          id: "q-2.2-2-v1",
          question: "Why was the value '4' not printed in the StayPositive example?",
          options: [
            { id: "A", text: "The break statement executed before the println statement", explanationIfWrong: "" },
            { id: "B", text: "Scanner automatically filters out the number 4", explanationIfWrong: "Scanner does not filter inputs." },
            { id: "C", text: "Integer.valueOf(4) returns null", explanationIfWrong: "Integer.valueOf converts 4 to int 4." },
            { id: "D", text: "4 is a reserved number in Java", explanationIfWrong: "4 is a regular number." }
          ],
          correctAnswer: "A",
          explanationNote: "Because 'break' was called inside the 'if (number == 4)' block before println, the loop exited immediately."
        },
        questionPool: [
          {
            id: "q-2.2-2-v2",
            question: "If the println statement were placed BEFORE the 'if (number == 4) break;', would '4' be printed?",
            options: [
              { id: "A", text: "Yes, 'You gave: 4' would be printed before breaking", explanationIfWrong: "" },
              { id: "B", text: "No, break prevents any previous statements from running", explanationIfWrong: "Statements before break execute sequentially." },
              { id: "C", text: "It causes a compilation error", explanationIfWrong: "Placing println before the if condition is valid." },
              { id: "D", text: "It prints twice", explanationIfWrong: "It prints once." }
            ],
            correctAnswer: "A",
            explanationNote: "Statements in Java execute in strict top-to-bottom order. Code before 'break' executes normally."
          }
        ]
      },
      {
        heading: "Counting Numbers with an Accumulator",
        text: "To count how many numbers the user enters before typing a sentinel value (e.g. 0), declare a counter variable OUTSIDE the loop: 'int count = 0;'. Each time a valid number is received, increment 'count++'.",
        codeSnippet: "public class NumberOfNumbers {\n    public static void main(String[] args) {\n        int count = 0;\n        int[] simulatedInputs = { 5, 22, 9, 0 };\n        for (int num : simulatedInputs) {\n            if (num == 0) {\n                break;\n            }\n            count++;\n        }\n        System.out.println(\"Number of numbers: \" + count);\n    }\n}",
        terminalOutput: "Number of numbers: 3",
        tip: "Crucial rule: accumulator variables must be declared OUTSIDE the loop. If declared inside, they are re-initialized to 0 on every iteration!",
        mcq: {
          id: "q-2.2-3-v1",
          question: "What happens if you declare 'int count = 0;' INSIDE the while loop body?",
          options: [
            { id: "A", text: "The counter is reset to 0 on every iteration, never exceeding 1", explanationIfWrong: "" },
            { id: "B", text: "The program fails to compile due to duplicate variable names", explanationIfWrong: "Scope is renewed each iteration." },
            { id: "C", text: "The loop terminates immediately", explanationIfWrong: "It does not terminate the loop." },
            { id: "D", text: "The counter retains its value across iterations", explanationIfWrong: "Variables declared inside a block go out of scope at the end of that block." }
          ],
          correctAnswer: "A",
          explanationNote: "Variables declared inside a loop are newly created and initialized on every single iteration."
        },
        questionPool: [
          {
            id: "q-2.2-3-v2",
            question: "What does the expression 'count++' do in Java?",
            options: [
              { id: "A", text: "Increments the value of count by 1", explanationIfWrong: "" },
              { id: "B", text: "Doubles the value of count", explanationIfWrong: "count *= 2 doubles the value." },
              { id: "C", text: "Checks if count is positive", explanationIfWrong: "It is an increment operation, not a comparison." },
              { id: "D", text: "Sets count to 0", explanationIfWrong: "It adds 1 to the current value." }
            ],
            correctAnswer: "A",
            explanationNote: "'count++' is the postfix increment operator, shorthand for 'count = count + 1'."
          }
        ]
      },
      {
        heading: "Sum of Numbers Pattern",
        text: "Just like counting, summing values requires an accumulator initialized to 0 outside the loop: 'int sum = 0;'. For every input that is not the sentinel, add it: 'sum = sum + number;' or 'sum += number;'.",
        codeSnippet: "public class SumOfNumbers {\n    public static void main(String[] args) {\n        int sum = 0;\n        int[] values = { 10, 25, 5, 0 };\n        for (int v : values) {\n            if (v == 0) {\n                break;\n            }\n            sum += v;\n        }\n        System.out.println(\"Sum of the numbers: \" + sum);\n    }\n}",
        terminalOutput: "Sum of the numbers: 40",
        tip: "'sum += v' is equivalent to 'sum = sum + v'.",
        mcq: {
          id: "q-2.2-4-v1",
          question: "If a user inputs 3, 4, -2, and then 0 to stop, what is the final value of 'sum += number'?",
          options: [
            { id: "A", text: "5", explanationIfWrong: "" },
            { id: "B", text: "7", explanationIfWrong: "3 + 4 + (-2) = 5, not 7." },
            { id: "C", text: "9", explanationIfWrong: "The negative number subtracts from the sum." },
            { id: "D", text: "0", explanationIfWrong: "The sum of 3, 4, and -2 is 5." }
          ],
          correctAnswer: "A",
          explanationNote: "3 + 4 = 7; 7 + (-2) = 5. When 0 is entered, the loop breaks with sum = 5."
        },
        questionPool: [
          {
            id: "q-2.2-4-v2",
            question: "Which operator is the compound addition assignment shorthand for 'sum = sum + val'?",
            options: [
              { id: "A", text: "sum += val", explanationIfWrong: "" },
              { id: "B", text: "sum =+ val", explanationIfWrong: "= +val assigns positive val, not addition." },
              { id: "C", text: "sum ++ val", explanationIfWrong: "++ is increment by 1." },
              { id: "D", text: "sum +== val", explanationIfWrong: "+== is invalid syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "'+=' is Java's addition assignment operator."
          }
        ]
      },
      {
        heading: "Counting Negative Numbers with Conditionals",
        text: "You can combine accumulators with conditional checks inside a loop. For example, to count only negative numbers, check 'if (number < 0) { negativeCount++; }'. Other numbers can be ignored or counted separately.",
        codeSnippet: "public class NumberOfNegativeNumbers {\n    public static void main(String[] args) {\n        int negatives = 0;\n        int[] inputs = { -2, 5, -8, 12, 0 };\n        for (int n : inputs) {\n            if (n == 0) break;\n            if (n < 0) {\n                negatives++;\n            }\n        }\n        System.out.println(\"Number of negative numbers: \" + negatives);\n    }\n}",
        terminalOutput: "Number of negative numbers: 2",
        tip: "Keep conditional checks simple and clean: handle the exit condition first, then handle category filters.",
        mcq: {
          id: "q-2.2-5-v1",
          question: "Given inputs: [-1, 0], how many times does 'negatives++' execute in the NumberOfNegativeNumbers pattern?",
          options: [
            { id: "A", text: "1 time", explanationIfWrong: "" },
            { id: "B", text: "2 times", explanationIfWrong: "0 is not < 0 and triggers break." },
            { id: "C", text: "0 times", explanationIfWrong: "-1 is strictly less than 0." },
            { id: "D", text: "Infinite times", explanationIfWrong: "The loop breaks on 0." }
          ],
          correctAnswer: "A",
          explanationNote: "-1 is negative, so negatives becomes 1. Next, 0 is received, which triggers break immediately."
        },
        questionPool: [
          {
            id: "q-2.2-5-v2",
            question: "What is the result of checking 'if (0 < 0)'?",
            options: [
              { id: "A", text: "false (0 is not strictly less than 0)", explanationIfWrong: "" },
              { id: "B", text: "true", explanationIfWrong: "0 is equal to 0, not less than 0." },
              { id: "C", text: "NullPointerException", explanationIfWrong: "Primitive comparisons do not throw NullPointerException." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "Comparing integers with '<' is valid syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "Zero is neither positive nor negative; 0 < 0 evaluates to false."
          }
        ]
      }
    ]
  },
  {
    id: "2-3-more-loops",
    number: "2.3",
    title: "More Loops & The For Loop",
    subtitle: "Explore while loops with conditional expressions, for loops, step counting, running averages, and skipping iterations with continue.",
    readTime: "20 min",
    objectives: [
      "Write while loops with active boolean conditional expressions",
      "Master the 3-part syntax of the Java 'for' loop",
      "Count from 1 to a user-specified number",
      "Count backwards from a number down to zero",
      "Calculate averages by combining sum and count with double casting",
      "Use the 'continue' keyword to skip the remainder of an iteration"
    ],
    theoryBlocks: [
      {
        heading: "While Loop with a Conditional Expression",
        text: "Instead of 'while (true)' with an internal 'break', a while loop can directly evaluate a condition in its parentheses: 'while (condition)'. The loop checks the condition before every iteration; as soon as the condition evaluates to false, the loop terminates.",
        codeSnippet: "public class WhileCondition {\n    public static void main(String[] args) {\n        int number = 1;\n        while (number <= 5) {\n            System.out.println(number);\n            number++;\n        }\n    }\n}",
        terminalOutput: "1\n2\n3\n4\n5",
        tip: "Make sure the variable checked in the condition changes inside the loop body, otherwise the condition will never become false!",
        mcq: {
          id: "q-2.3-0-v1",
          question: "In the WhileCondition example, what is the value of 'number' after the loop finishes executing?",
          options: [
            { id: "A", text: "6", explanationIfWrong: "" },
            { id: "B", text: "5", explanationIfWrong: "When number is 5, it enters the loop and increments to 6 before failing the check." },
            { id: "C", text: "4", explanationIfWrong: "The loop continues while number <= 5." },
            { id: "D", text: "0", explanationIfWrong: "The number increments upwards." }
          ],
          correctAnswer: "A",
          explanationNote: "When number is 5, '5 <= 5' is true, so it prints 5 and executes 'number++' (becoming 6). Then '6 <= 5' is false, ending the loop."
        },
        questionPool: [
          {
            id: "q-2.3-0-v2",
            question: "What happens if you forget to increment 'number++' inside a 'while (number <= 5)' loop starting at 1?",
            options: [
              { id: "A", text: "It creates an infinite loop printing '1' endlessly", explanationIfWrong: "" },
              { id: "B", text: "The compiler automatically inserts number++", explanationIfWrong: "Java does not automatically alter your loop logic." },
              { id: "C", text: "The loop terminates after 5 seconds", explanationIfWrong: "Java does not impose timeouts on while loops." },
              { id: "D", text: "A compilation error occurs", explanationIfWrong: "The code is syntactically valid." }
            ],
            correctAnswer: "A",
            explanationNote: "If the loop variable never changes, 'number <= 5' remains permanently true."
          }
        ]
      },
      {
        heading: "The For Loop Structure",
        text: "The 'for' loop bundles loop variable declaration, loop continuation condition, and variable increment into a single concise header: 'for (initialization; condition; increment) { ... }'. It is the preferred loop when the number of iterations is known in advance.",
        codeSnippet: "public class ForLoopExample {\n    public static void main(String[] args) {\n        for (int i = 0; i < 4; i++) {\n            System.out.println(\"i is: \" + i);\n        }\n    }\n}",
        terminalOutput: "i is: 0\ni is: 1\ni is: 2\ni is: 3",
        tip: "By convention, index variables in for loops are named 'i', 'j', and 'k'.",
        warning: "The variable 'int i' declared in the for-loop header only exists inside the loop body (local scope).",
        mcq: {
          id: "q-2.3-1-v1",
          question: "What are the three parts inside the parentheses of a standard for loop: for (A; B; C)?",
          options: [
            { id: "A", text: "initialization; condition; change/increment", explanationIfWrong: "" },
            { id: "B", text: "condition; initialization; print statement", explanationIfWrong: "Initialization comes first." },
            { id: "C", text: "start; stop; break", explanationIfWrong: "'break' is a statement, not the third component." },
            { id: "D", text: "variable; return type; visibility", explanationIfWrong: "Those are method components." }
          ],
          correctAnswer: "A",
          explanationNote: "The for loop syntax is: for (initialization; condition; increment/update)."
        },
        questionPool: [
          {
            id: "q-2.3-1-v2",
            question: "Can the variable 'i' declared in 'for (int i = 0; i < 5; i++)' be accessed outside the for loop?",
            options: [
              { id: "A", text: "No, 'i' is scoped strictly within the for loop block", explanationIfWrong: "" },
              { id: "B", text: "Yes, 'i' remains in scope for the entire method", explanationIfWrong: "Its scope ends at the closing brace of the for loop." },
              { id: "C", text: "Yes, but only if it's declared static", explanationIfWrong: "Local loop variables cannot be static." },
              { id: "D", text: "Yes, with the value 5", explanationIfWrong: "The compiler will report 'cannot find symbol: variable i'." }
            ],
            correctAnswer: "A",
            explanationNote: "A variable declared in the for-loop initialization header only exists within that loop."
          }
        ]
      },
      {
        heading: "Counting from a Number to Another Number",
        text: "A Helsinki exercise asks to read a start number and an end number, then print all numbers from start to end inclusive. In a for loop, set the start value: 'for (int i = start; i <= end; i++)'. If start > end, the loop simply does not run.",
        codeSnippet: "public class FromWhereToWhere {\n    public static void main(String[] args) {\n        int start = 3;\n        int end = 6;\n        for (int i = start; i <= end; i++) {\n            System.out.println(i);\n        }\n    }\n}",
        terminalOutput: "3\n4\n5\n6",
        tip: "Notice the '<=' operator. If you use '<', the final number 'end' will not be printed!",
        mcq: {
          id: "q-2.3-2-v1",
          question: "If start = 10 and end = 5, what does 'for (int i = start; i <= end; i++)' output?",
          options: [
            { id: "A", text: "Nothing (the condition 10 <= 5 is false immediately)", explanationIfWrong: "" },
            { id: "B", text: "10", explanationIfWrong: "The condition is checked BEFORE the first iteration." },
            { id: "C", text: "10 9 8 7 6 5", explanationIfWrong: "i++ increments upwards, not downwards." },
            { id: "D", text: "An IndexOutOfBoundsException", explanationIfWrong: "No exception is thrown." }
          ],
          correctAnswer: "A",
          explanationNote: "The loop condition '10 <= 5' is evaluated before the first execution and is false, so the loop body never runs."
        },
        questionPool: [
          {
            id: "q-2.3-2-v2",
            question: "How do you count backwards from 5 down to 1 using a for loop?",
            options: [
              { id: "A", text: "for (int i = 5; i >= 1; i--)", explanationIfWrong: "" },
              { id: "B", text: "for (int i = 5; i <= 1; i--)", explanationIfWrong: "5 <= 1 is false immediately." },
              { id: "C", text: "for (int i = 1; i <= 5; i++)", explanationIfWrong: "This counts upwards from 1 to 5." },
              { id: "D", text: "for (int i = 5; i > 1; i++)", explanationIfWrong: "i++ would count up to infinity." }
            ],
            correctAnswer: "A",
            explanationNote: "To count down, start at the high number, test with '>=', and decrement with 'i--'."
          }
        ]
      },
      {
        heading: "Calculating the Average of Inputs",
        text: "To calculate the average of numbers entered, you need both their sum and their count. Average = sum / count. Crucially, in Java, integer division truncates: '5 / 2 == 2'. To get '2.5', at least one operand must be cast to 'double': '(double) sum / count'.",
        codeSnippet: "public class AverageOfNumbers {\n    public static void main(String[] args) {\n        int sum = 25;\n        int count = 4;\n        double average = (double) sum / count;\n        System.out.println(\"Average: \" + average);\n    }\n}",
        terminalOutput: "Average: 6.25",
        tip: "Always check that count > 0 before dividing! Dividing by 0 in integer math throws ArithmeticException; in double it returns Infinity or NaN.",
        mcq: {
          id: "q-2.3-3-v1",
          question: "What is the output of 'int sum = 9; int count = 2; System.out.println((double) sum / count);'?",
          options: [
            { id: "A", text: "4.5", explanationIfWrong: "" },
            { id: "B", text: "4.0", explanationIfWrong: "Because sum is cast to double first, floating-point division is used." },
            { id: "C", text: "4", explanationIfWrong: "The result is a double." },
            { id: "D", text: "4.50000000", explanationIfWrong: "Standard double output prints 4.5." }
          ],
          correctAnswer: "A",
          explanationNote: "Casting 'sum' to (double) converts 9 to 9.0. 9.0 / 2 produces 4.5."
        },
        questionPool: [
          {
            id: "q-2.3-3-v2",
            question: "What does 'double avg = (double) (sum / count);' evaluate to if sum = 9 and count = 2?",
            options: [
              { id: "A", text: "4.0 (integer division happens first inside parentheses)", explanationIfWrong: "" },
              { id: "B", text: "4.5", explanationIfWrong: "sum / count is inside parentheses, so integer truncation happens before the cast." },
              { id: "C", text: "4", explanationIfWrong: "The variable is a double, so it prints 4.0." },
              { id: "D", text: "Compilation Error", explanationIfWrong: "Casting parenthesized expressions is valid." }
            ],
            correctAnswer: "A",
            explanationNote: "Parentheses have higher precedence: 9 / 2 evaluates to integer 4 first. (double) 4 becomes 4.0."
          }
        ]
      },
      {
        heading: "Skipping with the 'continue' Statement",
        text: "While 'break' exits the loop completely, 'continue' only skips the remaining statements of the CURRENT iteration and immediately advances to the next iteration. In a for loop, it jumps straight to the increment step.",
        codeSnippet: "public class ContinueExample {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            if (i == 3) {\n                continue; // Skip printing 3\n            }\n            System.out.print(i + \" \");\n        }\n    }\n}",
        terminalOutput: "1 2 4 5 ",
        tip: "Use 'continue' when you want to ignore certain bad inputs without stopping the entire loop.",
        mcq: {
          id: "q-2.3-4-v1",
          question: "What is the key difference between 'break' and 'continue' inside a loop?",
          options: [
            { id: "A", text: "'break' exits the loop entirely, while 'continue' jumps to the next iteration", explanationIfWrong: "" },
            { id: "B", text: "'continue' exits the loop entirely, while 'break' skips one iteration", explanationIfWrong: "It is the opposite." },
            { id: "C", text: "'continue' can only be used in switch statements", explanationIfWrong: "continue is used in loops." },
            { id: "D", text: "'break' restarts the loop from 0", explanationIfWrong: "break terminates the loop." }
          ],
          correctAnswer: "A",
          explanationNote: "'break' ceases the entire loop; 'continue' skips only the remainder of the current iteration."
        },
        questionPool: [
          {
            id: "q-2.3-4-v2",
            question: "In a while loop, why must you be careful when using 'continue' with an index variable?",
            options: [
              { id: "A", text: "If the increment (i++) is placed after 'continue', it will be skipped, causing an infinite loop", explanationIfWrong: "" },
              { id: "B", text: "continue is not allowed in while loops", explanationIfWrong: "continue is valid in while loops." },
              { id: "C", text: "continue resets the index to 0", explanationIfWrong: "It does not reset the index." },
              { id: "D", text: "continue crashes the JVM", explanationIfWrong: "continue is standard Java control flow." }
            ],
            correctAnswer: "A",
            explanationNote: "In while loops, if 'continue' skips past 'i++', the loop variable never updates, causing an infinite loop."
          }
        ]
      },
      {
        heading: "Factorial Calculation with a Loop",
        text: "The factorial of a number n (denoted n!) is the product of all positive integers from 1 up to n (e.g. 4! = 1 * 2 * 3 * 4 = 24). For factorials, initialize the accumulator to 1: 'int factorial = 1;', then multiply: 'factorial *= i;'.",
        codeSnippet: "public class Factorial {\n    public static void main(String[] args) {\n        int n = 5;\n        int result = 1;\n        for (int i = 1; i <= n; i++) {\n            result *= i;\n        }\n        System.out.println(\"Factorial of 5: \" + result);\n    }\n}",
        terminalOutput: "Factorial of 5: 120",
        tip: "By definition, 0! = 1. Since starting with result = 1 and loop condition i <= 0 fails immediately, the code handles 0! correctly.",
        mcq: {
          id: "q-2.3-5-v1",
          question: "Why must a factorial accumulator variable be initialized to 1 instead of 0?",
          options: [
            { id: "A", text: "Multiplying any number by 0 results in 0, which would leave the total permanently at 0", explanationIfWrong: "" },
            { id: "B", text: "Java does not permit initializing integers to 0 in loops", explanationIfWrong: "Java allows initializing integers to 0." },
            { id: "C", text: "The Java compiler throws an ArithmeticException if multiplied by 0", explanationIfWrong: "Multiplying by 0 is valid and produces 0." },
            { id: "D", text: "Factorials can only be computed with floating-point numbers", explanationIfWrong: "Factorials are defined for non-negative integers." }
          ],
          correctAnswer: "A",
          explanationNote: "Multiplicative accumulators must start at 1 (the identity element for multiplication), whereas additive accumulators start at 0."
        },
        questionPool: [
          {
            id: "q-2.3-5-v2",
            question: "What is the factorial of 4 (4!) computed by the loop?",
            options: [
              { id: "A", text: "24 (1 * 2 * 3 * 4)", explanationIfWrong: "" },
              { id: "B", text: "16", explanationIfWrong: "4! is 1*2*3*4 = 24." },
              { id: "C", text: "10", explanationIfWrong: "10 is the sum 1+2+3+4, not the product." },
              { id: "D", text: "64", explanationIfWrong: "4! = 24." }
            ],
            correctAnswer: "A",
            explanationNote: "1 * 2 * 3 * 4 = 24."
          }
        ]
      }
    ]
  },
  {
    id: "2-4-methods",
    number: "2.4",
    title: "Methods & Modular Program Design",
    subtitle: "Master defining custom static methods, passing parameters, returning values with return, and dividing complex programs into small pieces.",
    readTime: "25 min",
    objectives: [
      "Understand what a method is and how it avoids duplicate code",
      "Declare custom static methods in Java with 'public static void'",
      "Call methods from inside the 'main' method",
      "Pass arguments into method parameters",
      "Return values from methods using the 'return' keyword",
      "Decompose problems into clean, reusable modular units"
    ],
    theoryBlocks: [
      {
        heading: "Defining and Calling Custom Methods",
        text: "A method is a named block of code that performs a specific task. By creating methods, we can write a procedure once and call it multiple times from different places. In procedural Java, custom methods are declared inside the class using: 'public static void methodName() { ... }'.",
        codeSnippet: "public class CustomMethods {\n    public static void main(String[] args) {\n        greet();\n        greet();\n    }\n\n    public static void greet() {\n        System.out.println(\"Greetings from a custom method!\");\n    }\n}",
        terminalOutput: "Greetings from a custom method!\nGreetings from a custom method!",
        tip: "By Java naming convention, method names start with a lowercase letter and use camelCase (e.g. printMessage, calculateTotal).",
        warning: "Custom methods must be declared inside the class body, but OUTSIDE the main method body.",
        mcq: {
          id: "q-2.4-0-v1",
          question: "Where in a Java file should a new custom method be written?",
          options: [
            { id: "A", text: "Inside the class curly braces, but outside any other method", explanationIfWrong: "" },
            { id: "B", text: "Inside the curly braces of public static void main", explanationIfWrong: "Java does not support declaring methods directly inside other methods." },
            { id: "C", text: "Outside the class definition after the final brace", explanationIfWrong: "All Java methods must be inside a class definition." },
            { id: "D", text: "Before the import statements at the top of the file", explanationIfWrong: "Code must be inside a class." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, methods are members of a class and must be defined inside the class body, but outside other methods."
        },
        questionPool: [
          {
            id: "q-2.4-0-v2",
            question: "What does the keyword 'void' mean in a method header like 'public static void printStars()'?",
            options: [
              { id: "A", text: "The method does not return any value to the caller", explanationIfWrong: "" },
              { id: "B", text: "The method accepts no parameters", explanationIfWrong: "Parameters are specified inside the parentheses, not by void." },
              { id: "C", text: "The method cannot be called from main", explanationIfWrong: "void methods can easily be called from main." },
              { id: "D", text: "The method is empty", explanationIfWrong: "The method has a body; it simply returns no data." }
            ],
            correctAnswer: "A",
            explanationNote: "'void' indicates that the method completes an action and returns nothing back to the calling code."
          }
        ]
      },
      {
        heading: "Method Parameters & Arguments",
        text: "Parameters are variables defined in the method declaration that receive data passed from the caller. Arguments are the actual values passed into the method when called. Parameters allow a single method to produce different outputs based on different inputs.",
        codeSnippet: "public class MethodParameters {\n    public static void main(String[] args) {\n        printGreeting(\"Ada\");\n        printGreeting(\"Linus\");\n    }\n\n    public static void printGreeting(String name) {\n        System.out.println(\"Hello, \" + name + \"!\");\n    }\n}",
        terminalOutput: "Hello, Ada!\nHello, Linus!",
        tip: "You can define multiple parameters by separating them with commas: public static void sum(int a, int b).",
        mcq: {
          id: "q-2.4-1-v1",
          question: "In 'printGreeting(\"Ada\")', what is '\"Ada\"' called versus 'String name' in the method definition?",
          options: [
            { id: "A", text: "\"Ada\" is the argument; 'String name' is the parameter", explanationIfWrong: "" },
            { id: "B", text: "\"Ada\" is the parameter; 'String name' is the argument", explanationIfWrong: "Parameters are the variables in the definition; arguments are the values passed." },
            { id: "C", text: "Both are parameters", explanationIfWrong: "The passed value is specifically called an argument." },
            { id: "D", text: "Both are return values", explanationIfWrong: "Neither is a return value." }
          ],
          correctAnswer: "A",
          explanationNote: "Parameters are the formal variables declared in the method signature; arguments are the actual values supplied during a call."
        },
        questionPool: [
          {
            id: "q-2.4-1-v2",
            question: "What happens if a method specifies 'public static void test(int a, int b)' and you call 'test(5)'?",
            options: [
              { id: "A", text: "A compilation error occurs due to argument count mismatch", explanationIfWrong: "" },
              { id: "B", text: "Java defaults 'b' to 0 automatically", explanationIfWrong: "Java does not have default parameter values." },
              { id: "C", text: "The program compiles but throws a NullPointerException at runtime", explanationIfWrong: "This is detected at compile time." },
              { id: "D", text: "b is assigned null", explanationIfWrong: "Primitive int cannot be null, and Java enforces exact parameter matching." }
            ],
            correctAnswer: "A",
            explanationNote: "Java requires that the number and types of arguments strictly match the method's parameter list."
          }
        ]
      },
      {
        heading: "Returning Values from Methods",
        text: "Methods can compute a result and pass it back to the caller using the 'return' keyword. When a method returns a value, its header specifies the data type (e.g. 'int', 'double', 'String') instead of 'void'. The caller can then store this returned value in a variable.",
        codeSnippet: "public class ReturnValues {\n    public static void main(String[] args) {\n        int result = sum(15, 25);\n        System.out.println(\"The sum is: \" + result);\n    }\n\n    public static int sum(int first, int second) {\n        return first + second;\n    }\n}",
        terminalOutput: "The sum is: 40",
        tip: "As soon as a 'return' statement executes, the method terminates immediately and control returns to the caller.",
        warning: "If a method header specifies a return type like 'int', EVERY possible execution path through the method must hit a return statement that yields an int.",
        mcq: {
          id: "q-2.4-2-v1",
          question: "What must you replace 'void' with in a method header if the method returns an integer?",
          options: [
            { id: "A", text: "int", explanationIfWrong: "" },
            { id: "B", text: "Integer.return", explanationIfWrong: "The return type is simply 'int'." },
            { id: "C", text: "return", explanationIfWrong: "'return' is a statement keyword, not a type name." },
            { id: "D", text: "output(int)", explanationIfWrong: "Java method headers use the type name directly." }
          ],
          correctAnswer: "A",
          explanationNote: "The method signature specifies the return type directly before the method name: 'public static int sum(...) '."
        },
        questionPool: [
          {
            id: "q-2.4-2-v2",
            question: "What happens if a non-void method fails to return a value along one of its execution branches?",
            options: [
              { id: "A", text: "The code will not compile: 'missing return statement'", explanationIfWrong: "" },
              { id: "B", text: "It returns 0 by default", explanationIfWrong: "Java requires explicit returns on all paths." },
              { id: "C", text: "It returns null", explanationIfWrong: "Java compiler flags this as an error." },
              { id: "D", text: "A runtime exception is thrown when that branch is hit", explanationIfWrong: "The compiler catches this before the program ever runs." }
            ],
            correctAnswer: "A",
            explanationNote: "The Java compiler strictly checks that all code paths in a non-void method end in a valid return statement."
          }
        ]
      },
      {
        heading: "Calling Methods from Other Methods",
        text: "Methods can call other methods. A great programming practice is to break complex problems into smaller, single-purpose helper methods. For example, a method 'smallest(int a, int b)' can be used by another method 'smallestOfThree(int a, int b, int c)'.",
        codeSnippet: "public class ModularCode {\n    public static void main(String[] args) {\n        int min = smallestOfThree(10, 4, 18);\n        System.out.println(\"Smallest: \" + min);\n    }\n\n    public static int smallest(int a, int b) {\n        return (a < b) ? a : b;\n    }\n\n    public static int smallestOfThree(int a, int b, int c) {\n        return smallest(smallest(a, b), c);\n    }\n}",
        terminalOutput: "Smallest: 4",
        tip: "Notice how smallestOfThree reuses 'smallest' twice: smallest(smallest(a, b), c). This eliminates code duplication!",
        mcq: {
          id: "q-2.4-3-v1",
          question: "What is the primary benefit of composing larger methods from smaller helper methods?",
          options: [
            { id: "A", text: "Code reusability, modularity, readability, and easier isolated debugging", explanationIfWrong: "" },
            { id: "B", text: "It makes the compiled program run 10x faster", explanationIfWrong: "Method calls have tiny overhead; the benefit is clarity and maintainability." },
            { id: "C", text: "It reduces memory usage to zero", explanationIfWrong: "Memory is still used for frames." },
            { id: "D", text: "It removes the need for classes in Java", explanationIfWrong: "Classes are still mandatory in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "Breaking code into small, single-responsibility methods makes programs readable, reusable, and easy to test."
        },
        questionPool: [
          {
            id: "q-2.4-3-v2",
            question: "In 'smallest(smallest(10, 4), 18)', which part evaluates first?",
            options: [
              { id: "A", text: "The inner call: smallest(10, 4) evaluates to 4", explanationIfWrong: "" },
              { id: "B", text: "The outer call evaluates first", explanationIfWrong: "Arguments must be evaluated before the outer call can receive them." },
              { id: "C", text: "They evaluate concurrently in parallel threads", explanationIfWrong: "Method argument evaluation is sequential." },
              { id: "D", text: "18 is compared to 10 first", explanationIfWrong: "Inner expression executes first." }
            ],
            correctAnswer: "A",
            explanationNote: "Java evaluates method arguments from inside-out: smallest(10, 4) produces 4, then smallest(4, 18) produces 4."
          }
        ]
      },
      {
        heading: "Printing Stars Pattern with Methods",
        text: "The classic Helsinki MOOC exercise 'Printing Stars' illustrates method decomposition: 1) write 'printStars(int count)' that prints a given number of stars using a loop, 2) write 'printSquare(int size)' that simply calls 'printStars' size times!",
        codeSnippet: "public class PrintingStars {\n    public static void main(String[] args) {\n        printSquare(3);\n    }\n\n    public static void printStars(int count) {\n        for (int i = 0; i < count; i++) {\n            System.out.print(\"*\");\n        }\n        System.out.println();\n    }\n\n    public static void printSquare(int size) {\n        for (int i = 0; i < size; i++) {\n            printStars(size);\n        }\n    }\n}",
        terminalOutput: "***\n***\n***",
        tip: "By delegating the star-printing logic to printStars, printSquare only needs to manage rows, making both methods trivial to understand.",
        mcq: {
          id: "q-2.4-4-v1",
          question: "How many total stars are printed when 'printSquare(4)' is called?",
          options: [
            { id: "A", text: "16 stars (4 rows of 4 stars)", explanationIfWrong: "" },
            { id: "B", text: "4 stars", explanationIfWrong: "It runs printStars(4) four times." },
            { id: "C", text: "8 stars", explanationIfWrong: "4 rows of 4 is 4 * 4 = 16." },
            { id: "D", text: "20 stars", explanationIfWrong: "4 * 4 = 16." }
          ],
          correctAnswer: "A",
          explanationNote: "printSquare(4) loops 4 times, calling printStars(4) each time, producing 4 * 4 = 16 stars in a 4x4 grid."
        },
        questionPool: [
          {
            id: "q-2.4-4-v2",
            question: "If printStars(int count) used System.out.println(\"*\") inside the loop instead of print(\"*\"), what shape would printSquare make?",
            options: [
              { id: "A", text: "A single vertical column of stars", explanationIfWrong: "" },
              { id: "B", text: "A horizontal line", explanationIfWrong: "println adds a newline after every star." },
              { id: "C", text: "A diagonal line", explanationIfWrong: "No indentation is added." },
              { id: "D", text: "A square", explanationIfWrong: "A square requires multiple stars per line." }
            ],
            correctAnswer: "A",
            explanationNote: "println advances to a new line after every character, creating a vertical column instead of a row."
          }
        ]
      },
      {
        heading: "Method Overloading in Java",
        text: "In Java, multiple methods in the same class can share the exact same name, as long as their parameter lists are different (different number of parameters, or different parameter types). This feature is called 'method overloading'. The compiler determines which version to call based on the arguments provided.",
        codeSnippet: "public class OverloadExample {\n    public static void main(String[] args) {\n        System.out.println(add(2, 3));       // calls add(int, int)\n        System.out.println(add(2.5, 3.5));   // calls add(double, double)\n    }\n\n    public static int add(int a, int b) {\n        return a + b;\n    }\n\n    public static double add(double a, double b) {\n        return a + b;\n    }\n}",
        terminalOutput: "5\n6.0",
        tip: "Method overloading cannot be differentiated solely by return type. The parameter signatures must differ.",
        mcq: {
          id: "q-2.4-5-v1",
          question: "Can two methods in the same Java class have the exact same name and the exact same parameters, but different return types?",
          options: [
            { id: "A", text: "No, Java requires the parameter list (signature) to differ for method overloading", explanationIfWrong: "" },
            { id: "B", text: "Yes, the return type alone differentiates overloaded methods", explanationIfWrong: "Return type alone cannot differentiate methods in Java." },
            { id: "C", text: "Yes, but only if both methods are public", explanationIfWrong: "Visibility does not affect overloading rules." },
            { id: "D", text: "Yes, but only in Java 21", explanationIfWrong: "This has always been disallowed in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, method signatures consist of the method name and parameter types. Return type alone is insufficient to overload a method."
        },
        questionPool: [
          {
            id: "q-2.4-5-v2",
            question: "Which of the following method signatures successfully overloads 'public static void display(String msg)'?",
            options: [
              { id: "A", text: "public static void display(String msg, int count)", explanationIfWrong: "" },
              { id: "B", text: "public static int display(String msg)", explanationIfWrong: "Differs only by return type, which is illegal in Java." },
              { id: "C", text: "private static void display(String text)", explanationIfWrong: "Changing variable name from 'msg' to 'text' does not change the signature." },
              { id: "D", text: "public void display(String msg)", explanationIfWrong: "Removing static does not change the parameter signature." }
            ],
            correctAnswer: "A",
            explanationNote: "Adding a second parameter '(String msg, int count)' changes the parameter list, making it a valid overloaded method."
          }
        ]
      }
    ]
  }
];

// Helper functions matching Python Part 2 mechanics

export function getActiveQuestionsForLevelPart2(
  section: SectionContent,
  studentId: string,
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part2_seen_${studentId}_${section.id}`;
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
        // Pool exhausted, reset seen list and pick random
        const picked = pool[Math.floor(Math.random() * pool.length)];
        activeQuestions.push(picked);
      }
    } else {
      // Default: pick first question (block.mcq)
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

export function getConsecutiveFailedLevelsPart2(studentId: string): number {
  try {
    const key = `dopilot_java_part2_consecutive_failures_${studentId}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart2(studentId: string): void {
  try {
    localStorage.setItem(`dopilot_java_part2_consecutive_failures_${studentId}`, '0');
  } catch {}
}

export function setLevelAttemptCountPart2(sectionId: string, studentId: string, count: number): void {
  try {
    localStorage.setItem(`dopilot_java_part2_attempt_${studentId}_${sectionId}`, String(count));
  } catch {}
}

export function getLevelAttemptCountPart2(sectionId: string, studentId: string): number {
  try {
    const raw = localStorage.getItem(`dopilot_java_part2_attempt_${studentId}_${sectionId}`);
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart2 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart2(
  sectionId: string,
  studentId: string,
  isPassed: boolean
): AttemptResultPart2 {
  const attemptKey = `dopilot_java_part2_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part2_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part2_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = localStorage.getItem(attemptKey);
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart2(studentId);

  if (isPassed) {
    // Passed: reset consecutive streak to 0
    resetConsecutiveFailuresPart2(studentId);
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
    // Failed
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
