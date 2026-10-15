// src/data/javaPart10Data.ts
// Helsinki MOOC Java Programming Part 10: Streams, Lambdas, StringBuilder, Regex, and Enums

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
  // -------------------------------------------------------------
  // LEVEL 10.1: Handling Collections as Streams
  // -------------------------------------------------------------
  {
    id: "10-1-streams",
    number: "10.1",
    title: "Handling Collections as Streams",
    subtitle: "The Stream API, filter, map, mapToInt, reduce, distinct, sorted, and Collectors.toList().",
    readTime: "25 min",
    objectives: [
      "Process collections declaratively using the Java Stream API (.stream())",
      "Filter elements with Predicates using .filter() and transform elements with .map()",
      "Convert object streams to numeric streams using .mapToInt() to compute sum() and average()",
      "Collect processed streams back into collections using Collectors.toList()",
      "Eliminate duplicates with .distinct() and sort stream items with .sorted()",
      "Combine values using .reduce() with accumulator lambdas"
    ],
    theoryBlocks: [
      {
        heading: "Introduction to the Stream API",
        text: "Introduced in Java 8, the Stream API allows you to process sequences of elements declaratively rather than imperatively with manual for-loops. A stream pipeline consists of three parts:\n1. A source (e.g. 'list.stream()')\n2. Zero or more intermediate operations (e.g. 'filter', 'map')\n3. Exactly one terminal operation (e.g. 'count', 'forEach', 'collect') which triggers execution.",
        codeSnippet: "import java.util.ArrayList;\nimport java.util.List;\n\nList<Integer> numbers = List.of(1, -2, 3, -4, 5);\n\n// Count positive numbers declaratively:\nlong count = numbers.stream()\n    .filter(n -> n > 0)\n    .count();\n\nSystem.out.println(\"Positive numbers: \" + count); // 3",
        terminalOutput: "Positive numbers: 3\nOriginal list remains untouched (immutability)",
        tip: "Streams do not store data or modify the underlying source collection; they process data in motion.",
        warning: "A stream can only be traversed once! Reusing a closed stream throws an IllegalStateException.",
        mcq: {
          id: "j10-1-1",
          question: "What happens to the original list when you process its elements through a Java Stream pipeline?",
          options: [
            { id: "A", text: "Nothing; streams do not modify the underlying collection, preserving immutability", explanationIfWrong: "" },
            { id: "B", text: "The filtered elements are permanently deleted from the original list", explanationIfWrong: "Streams are non-mutating." },
            { id: "C", text: "The original list is converted into an array", explanationIfWrong: "The original list remains unchanged." },
            { id: "D", text: "The list is locked for editing forever", explanationIfWrong: "No lock is placed on the original collection." }
          ],
          correctAnswer: "A",
          explanationNote: "Streams are functional pipelines that produce new results without mutating the source collection."
        },
        questionPool: [
          {
            id: "j10-1-1-alt1",
            question: "What happens if you attempt to perform a second terminal operation on a Stream that has already been consumed?",
            options: [
              { id: "A", text: "An IllegalStateException is thrown ('stream has already been operated upon or closed')", explanationIfWrong: "" },
              { id: "B", text: "It restarts the stream from the beginning automatically", explanationIfWrong: "Streams cannot be restarted once consumed." },
              { id: "C", text: "It returns null", explanationIfWrong: "An exception is thrown." },
              { id: "D", text: "It runs in reverse order", explanationIfWrong: "Streams cannot be reused." }
            ],
            correctAnswer: "A",
            explanationNote: "Java streams are one-use only pipelines. Once a terminal operation completes, the stream is closed."
          },
          {
            id: "j10-1-1-alt2",
            question: "Which of the following is a terminal operation in a Stream pipeline?",
            options: [
              { id: "A", text: "count()", explanationIfWrong: "" },
              { id: "B", text: "filter()", explanationIfWrong: "filter is an intermediate operation." },
              { id: "C", text: "map()", explanationIfWrong: "map is an intermediate operation." },
              { id: "D", text: "distinct()", explanationIfWrong: "distinct is an intermediate operation." }
            ],
            correctAnswer: "A",
            explanationNote: "count() produces a scalar long result and terminates the stream."
          }
        ]
      },
      {
        heading: "Filtering (.filter) and Transforming (.map)",
        text: "The two most common intermediate operations are:\n• '.filter(predicate)': Retains only elements that satisfy a condition (returns true).\n• '.map(function)': Transforms each element into another value (e.g. extracting a field or calculating a square).",
        codeSnippet: "List<String> names = List.of(\"Alice\", \"Bob\", \"Alexander\", \"Benjamin\");\n\nnames.stream()\n    .filter(name -> name.startsWith(\"A\")) // Keep names starting with 'A'\n    .map(name -> name.toUpperCase())      // Convert each to uppercase\n    .forEach(name -> System.out.println(name));",
        terminalOutput: "ALICE\nALEXANDER",
        tip: "Intermediate operations are lazy: they only process elements when the terminal operation is reached.",
        warning: "Make sure lambda expressions inside .map() do not cause side effects or modify external variables.",
        mcq: {
          id: "j10-1-2",
          question: "What does the '.map()' operation do in a Java Stream pipeline?",
          options: [
            { id: "A", text: "Transforms each stream element by applying a function, producing a stream of the transformed values", explanationIfWrong: "" },
            { id: "B", text: "Filters elements matching a boolean condition", explanationIfWrong: "That is what filter() does." },
            { id: "C", text: "Converts the stream into a HashMap", explanationIfWrong: "Collectors.toMap() converts to a map; .map() transforms elements." },
            { id: "D", text: "Sorts elements alphabetically", explanationIfWrong: "sorted() performs sorting." }
          ],
          correctAnswer: "A",
          explanationNote: "map() transforms each element using a mapping function (e.g. String -> Integer, Person -> String)."
        },
        questionPool: [
          {
            id: "j10-1-2-alt1",
            question: "Given a list of Person objects, how do you extract a stream of their names using .map()?",
            options: [
              { id: "A", text: ".map(p -> p.getName())", explanationIfWrong: "" },
              { id: "B", text: ".filter(p -> p.getName())", explanationIfWrong: "filter requires a boolean Predicate." },
              { id: "C", text: ".reduce(p -> p.getName())", explanationIfWrong: "reduce combines elements with a BinaryOperator." },
              { id: "D", text: ".collect(p -> p.getName())", explanationIfWrong: "collect takes a Collector." }
            ],
            correctAnswer: "A",
            explanationNote: ".map(p -> p.getName()) transforms a Stream<Person> into a Stream<String> of names."
          },
          {
            id: "j10-1-2-alt2",
            question: "Why are stream intermediate operations described as 'lazy'?",
            options: [
              { id: "A", text: "They do not execute until a terminal operation is called on the stream", explanationIfWrong: "" },
              { id: "B", text: "They only run on weekends", explanationIfWrong: "Lazy evaluation means execution is deferred until output is needed." },
              { id: "C", text: "They run 50% slower than loops", explanationIfWrong: "JIT compiler optimizes stream operations." },
              { id: "D", text: "They discard half the elements", explanationIfWrong: "Lazy means deferred execution." }
            ],
            correctAnswer: "A",
            explanationNote: "Lazy evaluation avoids unnecessary computation until the terminal operation demands results."
          }
        ]
      },
      {
        heading: "Numeric Streams: mapToInt, sum, and average",
        text: "Standard streams hold objects (Stream<Integer>). To perform numeric calculations like computing averages or sums without boxing overhead, convert to an 'IntStream' using '.mapToInt(n -> n)'. An IntStream provides dedicated numeric operations: '.sum()', '.average()', '.min()', and '.max()'.",
        codeSnippet: "List<Integer> grades = List.of(80, 90, 75, 95);\n\n// Compute average as a double:\ndouble avg = grades.stream()\n    .mapToInt(g -> g)\n    .average()\n    .orElse(0.0); // Safe fallback if empty!\n\nSystem.out.println(\"Average: \" + avg); // 85.0",
        terminalOutput: "Average: 85.0\n.average() returns OptionalDouble for empty list safety",
        tip: "IntStream.average() returns an 'OptionalDouble'. Use '.orElse(0.0)' to extract the value safely.",
        warning: "Never invoke .getAsDouble() on an empty OptionalDouble or it will throw NoSuchElementException.",
        mcq: {
          id: "j10-1-3",
          question: "Why does 'IntStream.average()' return an 'OptionalDouble' instead of a raw double?",
          options: [
            { id: "A", text: "To prevent division-by-zero errors when the stream is empty, allowing safe fallback with .orElse(0.0)", explanationIfWrong: "" },
            { id: "B", text: "Because Java does not support primitive double returns", explanationIfWrong: "Java fully supports primitive doubles." },
            { id: "C", text: "Because OptionalDouble consumes less RAM", explanationIfWrong: "Optional is for null-safety, not memory reduction." },
            { id: "D", text: "To format numbers as strings", explanationIfWrong: "OptionalDouble is an optional container for a double value." }
          ],
          correctAnswer: "A",
          explanationNote: "OptionalDouble explicitly models the absence of a value when the stream has 0 elements."
        },
        questionPool: [
          {
            id: "j10-1-3-alt1",
            question: "How do you calculate the sum of all elements in an 'IntStream'?",
            options: [
              { id: "A", text: ".sum()", explanationIfWrong: "" },
              { id: "B", text: ".total()", explanationIfWrong: "total() is not an IntStream method." },
              { id: "C", text: ".add()", explanationIfWrong: "add() is for collections." },
              { id: "D", text: ".countAll()", explanationIfWrong: "count() returns the number of items, not their sum." }
            ],
            correctAnswer: "A",
            explanationNote: "IntStream.sum() returns the arithmetic sum of elements as a primitive int (or long)."
          },
          {
            id: "j10-1-3-alt2",
            question: "How do you filter a list of numbers to keep only positive numbers and compute their sum?",
            options: [
              { id: "A", text: "numbers.stream().filter(n -> n > 0).mapToInt(n -> n).sum()", explanationIfWrong: "" },
              { id: "B", text: "numbers.filter(n > 0).sum()", explanationIfWrong: "Lists do not have direct filter or sum methods." },
              { id: "C", text: "numbers.stream().sum(n -> n > 0)", explanationIfWrong: "sum does not take a filter predicate." },
              { id: "D", text: "numbers.map(n > 0).sum()", explanationIfWrong: "map does not filter elements." }
            ],
            correctAnswer: "A",
            explanationNote: "Pipeline order: .stream() -> .filter(n -> n > 0) -> .mapToInt(n -> n) -> .sum()."
          }
        ]
      },
      {
        heading: "Collecting to Collections with Collectors.toList()",
        text: "To collect elements processed by a stream into a standard 'ArrayList' or 'List', use the terminal operation '.collect(Collectors.toList())'. In Java 16+, you can also write the shorthand '.toList()' directly on the stream.",
        codeSnippet: "import java.util.stream.Collectors;\n\nList<String> names = List.of(\"Alice\", \"Bob\", \"Alexander\");\n\n// Filter and collect into a new List:\nList<String> aNames = names.stream()\n    .filter(name -> name.startsWith(\"A\"))\n    .collect(Collectors.toList());\n\nSystem.out.println(aNames); // [Alice, Alexander]",
        terminalOutput: "[Alice, Alexander]\nNew List created and populated with filtered items!",
        tip: "Collectors.toList() returns a mutable List; stream.toList() (Java 16+) returns an unmodifiable List.",
        warning: "Remember that collect() is a terminal operation: it executes the pipeline and closes the stream.",
        mcq: {
          id: "j10-1-4",
          question: "Which terminal operation is used to gather the elements of a stream into an ArrayList or List?",
          options: [
            { id: "A", text: ".collect(Collectors.toList())", explanationIfWrong: "" },
            { id: "B", text: ".toListArray()", explanationIfWrong: "toListArray is not a stream method." },
            { id: "C", text: ".asCollection()", explanationIfWrong: "asCollection does not exist." },
            { id: "D", text: ".exportList()", explanationIfWrong: "exportList does not exist." }
          ],
          correctAnswer: "A",
          explanationNote: "collect(Collectors.toList()) collects stream elements into a new List collection."
        },
        questionPool: [
          {
            id: "j10-1-4-alt1",
            question: "What Java package contains the 'Collectors' utility class?",
            options: [
              { id: "A", text: "java.util.stream", explanationIfWrong: "" },
              { id: "B", text: "java.lang", explanationIfWrong: "Collectors is in java.util.stream." },
              { id: "C", text: "java.io", explanationIfWrong: "java.io is for I/O streams." },
              { id: "D", text: "java.net", explanationIfWrong: "java.net is for networking." }
            ],
            correctAnswer: "A",
            explanationNote: "java.util.stream.Collectors provides implementations of various collector reductions."
          },
          {
            id: "j10-1-4-alt2",
            question: "How can you collect stream elements into a comma-separated String like \"Alice, Bob, Alexander\"?",
            options: [
              { id: "A", text: ".collect(Collectors.joining(\", \"))", explanationIfWrong: "" },
              { id: "B", text: ".toString(\", \")", explanationIfWrong: "Stream does not have an overloaded toString with delimiter." },
              { id: "C", text: ".join(\", \")", explanationIfWrong: "join is not a direct stream method." },
              { id: "D", text: ".concatAll(\", \")", explanationIfWrong: "concatAll does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "Collectors.joining(\", \") joins String elements with the specified delimiter into a single String."
          }
        ]
      },
      {
        heading: "Sorting and Distinct Elements in Streams",
        text: "Streams provide convenient operations to deduplicate and sort items:\n• '.distinct()': Eliminates duplicate elements based on their 'equals()' and 'hashCode()'.\n• '.sorted()': Sorts elements in natural order (or according to a provided Comparator).",
        codeSnippet: "List<Integer> numbers = List.of(5, 2, 8, 2, 5, 1, 9);\n\nList<Integer> sortedUnique = numbers.stream()\n    .distinct() // Removes duplicate 2 and 5\n    .sorted()   // Orders in ascending sequence\n    .collect(Collectors.toList());\n\nSystem.out.println(sortedUnique); // [1, 2, 5, 8, 9]",
        terminalOutput: "[1, 2, 5, 8, 9]",
        tip: "distinct() relies on correct implementation of equals() and hashCode() on custom objects.",
        warning: "sorted() requires buffering all elements in memory, so it is a stateful intermediate operation.",
        mcq: {
          id: "j10-1-5",
          question: "How does the '.distinct()' operation determine whether two stream elements are duplicates?",
          options: [
            { id: "A", text: "By using the object's equals() and hashCode() methods", explanationIfWrong: "" },
            { id: "B", text: "By comparing memory addresses with '==' only", explanationIfWrong: "It uses equals and hashCode." },
            { id: "C", text: "By comparing their variable names", explanationIfWrong: "Variable names do not exist at runtime." },
            { id: "D", text: "By checking if they were created in the same year", explanationIfWrong: "distinct() is a general object equality filter." }
          ],
          correctAnswer: "A",
          explanationNote: "distinct() uses equals() and hashCode() to recognize duplicate objects, just like a HashSet."
        },
        questionPool: [
          {
            id: "j10-1-5-alt1",
            question: "How do you sort a stream of Strings in descending (reverse) alphabetical order?",
            options: [
              { id: "A", text: ".sorted(Comparator.reverseOrder())", explanationIfWrong: "" },
              { id: "B", text: ".sorted(reverse)", explanationIfWrong: "reverse is not a built-in comparator." },
              { id: "C", text: ".reverse()", explanationIfWrong: "reverse() is not a Stream intermediate operation." },
              { id: "D", text: ".sortDescending()", explanationIfWrong: "sortDescending does not exist on Stream." }
            ],
            correctAnswer: "A",
            explanationNote: ".sorted(Comparator.reverseOrder()) orders elements in reverse natural order."
          },
          {
            id: "j10-1-5-alt2",
            question: "What is the requirement for elements when calling '.sorted()' with no arguments on a Stream<T>?",
            options: [
              { id: "A", text: "Class T must implement Comparable<T>", explanationIfWrong: "" },
              { id: "B", text: "Class T must be final", explanationIfWrong: "Final modifier is not required." },
              { id: "C", text: "Class T must be an interface", explanationIfWrong: "Concrete classes can be sorted." },
              { id: "D", text: "Class T must extend Number", explanationIfWrong: "Strings and custom objects can be sorted." }
            ],
            correctAnswer: "A",
            explanationNote: "Natural sorting requires elements to implement Comparable; otherwise ClassCastException occurs."
          }
        ]
      },
      {
        heading: "The .reduce() Operation",
        text: "The 'reduce()' operation combines all elements of a stream into a single cumulative result using an accumulator function. It takes an initial identity value and a BinaryOperator lambda: 'reduce(initialValue, (acc, item) -> acc + item)'.",
        codeSnippet: "List<Integer> values = List.of(1, 2, 3, 4, 5);\n\n// Compute product (1 * 2 * 3 * 4 * 5 = 120):\nint product = values.stream()\n    .reduce(1, (acc, n) -> acc * n);\n\nSystem.out.println(\"Product: \" + product); // 120",
        terminalOutput: "Product: 120\nCumulative reduction from 5 items to 1 scalar result",
        tip: "For sum reductions, 0 is the identity. For multiplication, 1 is the identity.",
        warning: "Ensure the identity value satisfies the mathematical identity property (e.g. n + 0 == n, n * 1 == n).",
        mcq: {
          id: "j10-1-6",
          question: "In the operation 'stream.reduce(0, (acc, n) -> acc + n)', what does the argument '0' represent?",
          options: [
            { id: "A", text: "The identity value (initial starting value of the accumulator)", explanationIfWrong: "" },
            { id: "B", text: "The maximum number of items to process", explanationIfWrong: "limit() controls count, not reduce." },
            { id: "C", text: "The index of the stream to start from", explanationIfWrong: "Streams process all elements." },
            { id: "D", text: "A flag indicating single-threaded mode", explanationIfWrong: "It is the mathematical identity element." }
          ],
          correctAnswer: "A",
          explanationNote: "The first parameter to reduce is the initial identity value of the reduction accumulator."
        },
        questionPool: [
          {
            id: "j10-1-6-alt1",
            question: "What would happen if you used '0' as the identity value for a multiplication reduction: '.reduce(0, (acc, n) -> acc * n)'?",
            options: [
              { id: "A", text: "The result would always be 0 because 0 multiplied by anything is 0", explanationIfWrong: "" },
              { id: "B", text: "An ArithmeticException would be thrown", explanationIfWrong: "Multiplication by 0 is valid arithmetic; it evaluates to 0." },
              { id: "C", text: "It would correctly compute the product", explanationIfWrong: "Multiplication identity is 1, not 0." },
              { id: "D", text: "The stream would not compile", explanationIfWrong: "It compiles, but yields 0 logically." }
            ],
            correctAnswer: "A",
            explanationNote: "Because 0 * x = 0, multiplying with initial value 0 produces 0. The multiplicative identity is 1."
          },
          {
            id: "j10-1-6-alt2",
            question: "How can you concatenate a list of Strings into one combined String using reduce?",
            options: [
              { id: "A", text: "words.stream().reduce(\"\", (acc, word) -> acc + word)", explanationIfWrong: "" },
              { id: "B", text: "words.stream().reduce(0, (acc, word) -> acc + word)", explanationIfWrong: "Starting with integer 0 causes a type mismatch." },
              { id: "C", text: "words.reduceAll()", explanationIfWrong: "reduceAll is not a method." },
              { id: "D", text: "words.stream().concat()", explanationIfWrong: "concat() is a static method on Stream, not instance." }
            ],
            correctAnswer: "A",
            explanationNote: "With initial empty string \"\", (acc, word) -> acc + word accumulates all words sequentially."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 10.2: Lambda Expressions & Method References
  // -------------------------------------------------------------
  {
    id: "10-2-lambdas",
    number: "10.2",
    title: "Lambda Expressions & Method References",
    subtitle: "Lambda syntax, method references (Class::method), and java.util.function interfaces.",
    readTime: "25 min",
    objectives: [
      "Write concise lambda expressions with zero, one, or multiple parameters",
      "Replace anonymous inner classes with equivalent lambdas",
      "Use method references (Class::method, object::method) for concise code",
      "Utilize core functional interfaces: Predicate<T>, Function<T, R>, Consumer<T>, Supplier<T>",
      "Compose functional predicates using .and(), .or(), and .negate()",
      "Understand variable capture and effectively final variables in lambdas"
    ],
    theoryBlocks: [
      {
        heading: "Lambda Expression Syntax",
        text: "A lambda expression is an anonymous function (a function without a name) that can be passed as an argument. The syntax consists of parameters, the arrow operator '->', and a body:\n• One parameter: 'x -> x * 2'\n• Multiple parameters: '(x, y) -> x + y'\n• Multi-line body: '(x, y) -> { int sum = x + y; return sum; }'.",
        codeSnippet: "// 1. Single parameter (parentheses optional):\nPredicate<String> isShort = s -> s.length() < 5;\n\n// 2. Multiple parameters:\nBinaryOperator<Integer> add = (a, b) -> a + b;\n\n// 3. Multi-line body with curly braces and explicit return:\nFunction<String, Integer> parser = str -> {\n    String clean = str.trim();\n    return Integer.parseInt(clean);\n};",
        terminalOutput: "isShort.test(\"Java\") -> true\nadd.apply(10, 20) -> 30\nparser.apply(\" 42 \") -> 42",
        tip: "If the body is a single expression, curly braces and the 'return' keyword can be omitted.",
        warning: "If curly braces are used in the body, the 'return' keyword is mandatory if the method returns a value.",
        mcq: {
          id: "j10-2-1",
          question: "Which of the following is a syntactically valid single-line lambda expression that checks if an integer n is even?",
          options: [
            { id: "A", text: "n -> n % 2 == 0", explanationIfWrong: "" },
            { id: "B", text: "n => n % 2 == 0", explanationIfWrong: "=> is JavaScript syntax, Java uses ->." },
            { id: "C", text: "lambda n: n % 2 == 0", explanationIfWrong: "lambda is Python syntax." },
            { id: "D", text: "function(n) { return n % 2 == 0; }", explanationIfWrong: "function keyword is JavaScript." }
          ],
          correctAnswer: "A",
          explanationNote: "Java lambda syntax uses 'parameter -> expression', so 'n -> n % 2 == 0' is correct."
        },
        questionPool: [
          {
            id: "j10-2-1-alt1",
            question: "When are parentheses mandatory around the parameter list of a lambda expression?",
            options: [
              { id: "A", text: "When there are zero parameters ( () -> ... ) or two or more parameters ( (a, b) -> ... )", explanationIfWrong: "" },
              { id: "B", text: "Only when parameters are strings", explanationIfWrong: "Data types do not dictate parentheses." },
              { id: "C", text: "Parentheses are never allowed", explanationIfWrong: "Parentheses are mandatory for 0 or 2+ params." },
              { id: "D", text: "Only in try-catch blocks", explanationIfWrong: "Syntax rule applies everywhere." }
            ],
            correctAnswer: "A",
            explanationNote: "Parentheses are optional only for exactly one untyped parameter: 'x -> ...'. Zero or 2+ parameters require parentheses."
          },
          {
            id: "j10-2-1-alt2",
            question: "What must you include if you enclose a lambda body with curly braces '{ ... }' and it returns a value?",
            options: [
              { id: "A", text: "The explicit 'return' keyword and a semicolon (e.g. { return x * 2; })", explanationIfWrong: "" },
              { id: "B", text: "The 'yield' keyword", explanationIfWrong: "yield is for switch expressions." },
              { id: "C", text: "The 'export' keyword", explanationIfWrong: "export is not Java syntax." },
              { id: "D", text: "Nothing extra", explanationIfWrong: "Without return, curly brace blocks evaluate to void." }
            ],
            correctAnswer: "A",
            explanationNote: "Block lambdas using curly braces require an explicit return statement."
          }
        ]
      },
      {
        heading: "Method References (Class::method)",
        text: "When a lambda expression merely calls an existing method on its parameter without doing anything else, it can be written more cleanly as a 'method reference' using the '::' operator. For example, 's -> System.out.println(s)' becomes 'System.out::println'.",
        codeSnippet: "// Lambda vs Method Reference:\n// 1. Static method:\n// Lambda: s -> Integer.parseInt(s)\nFunction<String, Integer> f1 = Integer::parseInt;\n\n// 2. Instance method of an arbitrary object of a particular type:\n// Lambda: p -> p.getName()\nFunction<Person, String> f2 = Person::getName;\n\n// 3. Instance method of an existing object:\n// Lambda: x -> System.out.println(x)\nConsumer<String> printer = System.out::println;",
        terminalOutput: "names.forEach(System.out::println);\nPrints each name cleanly using method reference!",
        tip: "Method references make stream pipelines concise and highly readable.",
        warning: "Method references do not accept arguments; they delegate all passed parameters directly.",
        mcq: {
          id: "j10-2-2",
          question: "Which method reference is equivalent to the lambda expression 'person -> person.getAge()'?",
          options: [
            { id: "A", text: "Person::getAge", explanationIfWrong: "" },
            { id: "B", text: "Person.getAge()", explanationIfWrong: "Method reference uses '::' operator, not dot notation with parentheses." },
            { id: "C", text: "Person->getAge", explanationIfWrong: "-> is lambda operator, :: is method reference operator." },
            { id: "D", text: "Person::new", explanationIfWrong: "Person::new is a constructor reference." }
          ],
          correctAnswer: "A",
          explanationNote: "ClassName::instanceMethod references an instance method invoked on the parameter."
        },
        questionPool: [
          {
            id: "j10-2-2-alt1",
            question: "Which method reference is equivalent to the constructor call '() -> new ArrayList<>()'?",
            options: [
              { id: "A", text: "ArrayList::new", explanationIfWrong: "" },
              { id: "B", text: "ArrayList::create", explanationIfWrong: "Constructor references use the 'new' keyword with ::." },
              { id: "C", text: "new ArrayList::()", explanationIfWrong: "Syntax is ClassName::new." },
              { id: "D", text: "ArrayList.construct", explanationIfWrong: "construct is not a keyword." }
            ],
            correctAnswer: "A",
            explanationNote: "ClassName::new is a constructor reference in Java."
          },
          {
            id: "j10-2-2-alt2",
            question: "What operator is used to create a method reference in Java?",
            options: [
              { id: "A", text: ":: (double colon)", explanationIfWrong: "" },
              { id: "B", text: "-> (arrow)", explanationIfWrong: "-> is for lambda expressions." },
              { id: "C", text: ". (dot)", explanationIfWrong: ". is for standard member access." },
              { id: "D", text: "# (hash)", explanationIfWrong: "# is used in Javadoc, not Java code." }
            ],
            correctAnswer: "A",
            explanationNote: "The double colon '::' is the method reference operator introduced in Java 8."
          }
        ]
      },
      {
        heading: "Core Functional Interfaces (java.util.function)",
        text: "Java provides built-in functional interfaces in 'java.util.function' so you rarely need to declare your own:\n• 'Predicate<T>': 'boolean test(T t)' (tests a condition)\n• 'Consumer<T>': 'void accept(T t)' (consumes a value, prints or logs)\n• 'Function<T, R>': 'R apply(T t)' (transforms T into R)\n• 'Supplier<T>': 'T get()' (supplies or creates a new value).",
        codeSnippet: "Predicate<Integer> isAdult = age -> age >= 18;\nConsumer<String> logger = msg -> System.out.println(\"[LOG] \" + msg);\nFunction<String, Integer> lengthFinder = s -> s.length();\nSupplier<Double> randomizer = () -> Math.random();\n\nif (isAdult.test(20)) {\n    logger.accept(\"Adult registered with name length \" + lengthFinder.apply(\"John\"));\n}",
        terminalOutput: "[LOG] Adult registered with name length 4",
        tip: "Remember: Predicate returns boolean, Function returns any R, Consumer returns void, Supplier takes no arguments.",
        warning: "Don't confuse Predicate (returns boolean) with Function<T, Boolean>.",
        mcq: {
          id: "j10-2-3",
          question: "Which functional interface accepts an argument of type T, performs an action with it, and returns 'void'?",
          options: [
            { id: "A", text: "Consumer<T>", explanationIfWrong: "" },
            { id: "B", text: "Supplier<T>", explanationIfWrong: "Supplier takes NO arguments and returns a value." },
            { id: "C", text: "Predicate<T>", explanationIfWrong: "Predicate returns boolean." },
            { id: "D", text: "Function<T, R>", explanationIfWrong: "Function returns type R." }
          ],
          correctAnswer: "A",
          explanationNote: "Consumer<T> has a single method 'void accept(T t)' that consumes a value without returning anything."
        },
        questionPool: [
          {
            id: "j10-2-3-alt1",
            question: "Which functional interface takes no arguments and returns a newly generated value of type T?",
            options: [
              { id: "A", text: "Supplier<T>", explanationIfWrong: "" },
              { id: "B", text: "Consumer<T>", explanationIfWrong: "Consumer takes a value and returns void." },
              { id: "C", text: "Predicate<T>", explanationIfWrong: "Predicate takes a value and returns boolean." },
              { id: "D", text: "UnaryOperator<T>", explanationIfWrong: "UnaryOperator takes and returns T." }
            ],
            correctAnswer: "A",
            explanationNote: "Supplier<T> defines 'T get()' and acts as a factory providing values."
          },
          {
            id: "j10-2-3-alt2",
            question: "Which functional interface is used as the argument to the stream '.filter()' method?",
            options: [
              { id: "A", text: "Predicate<T>", explanationIfWrong: "" },
              { id: "B", text: "Consumer<T>", explanationIfWrong: "Consumer is used in .forEach()." },
              { id: "C", text: "Function<T, R>", explanationIfWrong: "Function is used in .map()." },
              { id: "D", text: "Supplier<T>", explanationIfWrong: "Supplier is not used in filter." }
            ],
            correctAnswer: "A",
            explanationNote: "filter() takes a Predicate<T> to test whether each item should be retained in the stream."
          }
        ]
      },
      {
        heading: "Composing Predicates (.and, .or, .negate)",
        text: "Predicates can be chained and combined logically using default methods on the Predicate interface:\n• 'p1.and(p2)': Both conditions must be true.\n• 'p1.or(p2)': At least one condition must be true.\n• 'p1.negate()': Reverses the condition (logical NOT).",
        codeSnippet: "Predicate<Integer> isPositive = n -> n > 0;\nPredicate<Integer> isEven = n -> n % 2 == 0;\n\nPredicate<Integer> isPositiveAndEven = isPositive.and(isEven);\nPredicate<Integer> isNegativeOrZero = isPositive.negate();\n\nSystem.out.println(isPositiveAndEven.test(4));  // true\nSystem.out.println(isPositiveAndEven.test(3));  // false (odd)\nSystem.out.println(isNegativeOrZero.test(-5));  // true",
        terminalOutput: "isPositiveAndEven.test(4) -> true\nisPositiveAndEven.test(3) -> false\nisNegativeOrZero.test(-5) -> true",
        tip: "Predicate composition creates modular, readable business rules that can be recombined dynamically.",
        warning: "Be mindful of evaluation order when combining multiple .and() and .or() predicates.",
        mcq: {
          id: "j10-2-4",
          question: "How do you combine two predicates 'p1' and 'p2' so that the resulting predicate evaluates to true only when BOTH conditions are satisfied?",
          options: [
            { id: "A", text: "p1.and(p2)", explanationIfWrong: "" },
            { id: "B", text: "p1.plus(p2)", explanationIfWrong: "plus is not a method on Predicate." },
            { id: "C", text: "p1 && p2", explanationIfWrong: "&& cannot be applied directly to Predicate objects without calling .test()." },
            { id: "D", text: "Predicate.combine(p1, p2)", explanationIfWrong: "combine is not a standard method." }
          ],
          correctAnswer: "A",
          explanationNote: "p1.and(p2) returns a composed predicate representing short-circuit logical AND."
        },
        questionPool: [
          {
            id: "j10-2-4-alt1",
            question: "What does 'predicate.negate()' do?",
            options: [
              { id: "A", text: "Returns a predicate that represents the logical negation of this predicate (!condition)", explanationIfWrong: "" },
              { id: "B", text: "Multiplies the input by -1", explanationIfWrong: "Predicate deals with boolean tests, not numeric negation." },
              { id: "C", text: "Throws an exception if the test fails", explanationIfWrong: "It returns inverted booleans." },
              { id: "D", text: "Clears the predicate to null", explanationIfWrong: "It produces a valid inverted Predicate." }
            ],
            correctAnswer: "A",
            explanationNote: "negate() inverts the boolean result of the predicate."
          },
          {
            id: "j10-2-4-alt2",
            question: "How do you test if a number is positive OR even?",
            options: [
              { id: "A", text: "isPositive.or(isEven)", explanationIfWrong: "" },
              { id: "B", text: "isPositive.either(isEven)", explanationIfWrong: "The method name is or()." },
              { id: "C", text: "isPositive || isEven", explanationIfWrong: "|| cannot be applied directly to Predicate objects." },
              { id: "D", text: "isPositive.xor(isEven)", explanationIfWrong: "xor is exclusive or, not standard logical or." }
            ],
            correctAnswer: "A",
            explanationNote: "isPositive.or(isEven) returns true if either predicate evaluates to true."
          }
        ]
      },
      {
        heading: "Effectively Final Variables in Lambdas",
        text: "A lambda expression can access local variables defined in the surrounding scope. However, any local variable accessed inside a lambda MUST be 'final' or 'effectively final' (its value is never changed after initialization). If you try to reassign the variable, the compiler rejects the lambda.",
        codeSnippet: "int multiplier = 5; // effectively final (never reassigned)\n\nList<Integer> numbers = List.of(1, 2, 3);\nnumbers.stream()\n    .map(n -> n * multiplier) // OK: reads multiplier\n    .forEach(System.out::println);\n\n// ILLEGAL:\n// multiplier = 10; // Would cause compiler error in the lambda above!",
        terminalOutput: "Output: 5, 10, 15\nMultiplier is effectively final and safely captured.",
        tip: "A variable is 'effectively final' if it could have been declared with the 'final' keyword without causing an error.",
        warning: "You cannot modify a local variable inside a lambda: 'int sum = 0; list.forEach(n -> sum += n);' will NOT compile!",
        mcq: {
          id: "j10-2-5",
          question: "Why will 'int total = 0; numbers.forEach(n -> total += n);' fail to compile in Java?",
          options: [
            { id: "A", text: "Because local variables captured by a lambda expression must be final or effectively final and cannot be modified inside the lambda", explanationIfWrong: "" },
            { id: "B", text: "Because forEach does not accept lambdas", explanationIfWrong: "forEach accepts a Consumer lambda." },
            { id: "C", text: "Because numbers cannot be added with '+='", explanationIfWrong: "The issue is mutating local variables inside lambdas." },
            { id: "D", text: "Because total must be a double", explanationIfWrong: "Type is not the issue; mutability is." }
          ],
          correctAnswer: "A",
          explanationNote: "Local variables captured by lambdas must be effectively final. Use .mapToInt().sum() or .reduce() for summing."
        },
        questionPool: [
          {
            id: "j10-2-5-alt1",
            question: "What is an 'effectively final' variable in Java?",
            options: [
              { id: "A", text: "A variable whose value is never changed after it is initialized, even if the 'final' keyword is omitted", explanationIfWrong: "" },
              { id: "B", text: "A variable marked with the 'static' keyword", explanationIfWrong: "Static variables are class-level and can be mutable." },
              { id: "C", text: "A variable stored on the hard drive", explanationIfWrong: "Local variables live on the Stack." },
              { id: "D", text: "A variable that cannot be read", explanationIfWrong: "Effectively final variables are read-only." }
            ],
            correctAnswer: "A",
            explanationNote: "A variable is effectively final if its value remains constant after assignment."
          },
          {
            id: "j10-2-5-alt2",
            question: "What is the idiomatic Stream API replacement for summing numbers instead of mutating a local variable in forEach?",
            options: [
              { id: "A", text: "numbers.stream().mapToInt(Integer::intValue).sum()", explanationIfWrong: "" },
              { id: "B", text: "numbers.sumAll()", explanationIfWrong: "sumAll is not a method on List." },
              { id: "C", text: "numbers.loopAndSum()", explanationIfWrong: "loopAndSum is not a method." },
              { id: "D", text: "System.sum(numbers)", explanationIfWrong: "System does not sum lists." }
            ],
            correctAnswer: "A",
            explanationNote: "The Stream API uses mapToInt().sum() or reduce() for pure functional aggregation."
          }
        ]
      },
      {
        heading: "Sorting with Comparator and Lambdas",
        text: "The 'Comparator' interface allows custom sorting logic on the fly without modifying the original class. You can create comparators using lambda expressions '(a, b) -> a.getScore() - b.getScore()' or with the factory method 'Comparator.comparing(Person::getName)'.",
        codeSnippet: "List<Person> people = new ArrayList<>(List.of(\n    new Person(\"Charlie\", 25),\n    new Person(\"Alice\", 30),\n    new Person(\"Bob\", 20)\n));\n\n// Sort by age using Comparator.comparingInt:\npeople.sort(Comparator.comparingInt(Person::getAge));\n\n// Sort by name using Comparator.comparing:\npeople.sort(Comparator.comparing(Person::getName));",
        terminalOutput: "Sorted by Age: Bob (20), Charlie (25), Alice (30)\nSorted by Name: Alice (30), Bob (20), Charlie (25)",
        tip: "Chain secondary sorting criteria with '.thenComparing()': 'Comparator.comparing(Person::getName).thenComparing(Person::getAge)'.",
        warning: "List.sort() mutates the list in place; stream.sorted() returns a new sorted stream.",
        mcq: {
          id: "j10-2-6",
          question: "How can you sort a list of people primarily by 'name', and if names are identical, secondarily by 'age'?",
          options: [
            { id: "A", text: "people.sort(Comparator.comparing(Person::getName).thenComparing(Person::getAge));", explanationIfWrong: "" },
            { id: "B", text: "people.sort(Person::getName, Person::getAge);", explanationIfWrong: "List.sort accepts only a single Comparator." },
            { id: "C", text: "people.sortDual(Person::getName);", explanationIfWrong: "sortDual does not exist." },
            { id: "D", text: "Collections.sortBoth(people);", explanationIfWrong: "sortBoth does not exist." }
          ],
          correctAnswer: "A",
          explanationNote: "Comparator.comparing().thenComparing() chains multiple comparison criteria cleanly."
        },
        questionPool: [
          {
            id: "j10-2-6-alt1",
            question: "What is the difference between 'Comparable' and 'Comparator' in Java?",
            options: [
              { id: "A", text: "Comparable defines the single natural ordering inside the class itself; Comparator is an external strategy allowing multiple different sorting rules", explanationIfWrong: "" },
              { id: "B", text: "Comparable is for numbers; Comparator is for strings", explanationIfWrong: "Both work with any object type." },
              { id: "C", text: "Comparable is deprecated", explanationIfWrong: "Both are widely used standard interfaces." },
              { id: "D", text: "Comparator can only sort descending", explanationIfWrong: "Comparator can sort in any direction." }
            ],
            correctAnswer: "A",
            explanationNote: "Comparable defines natural ordering (compareTo); Comparator defines external custom sorting strategies (compare)."
          },
          {
            id: "j10-2-6-alt2",
            question: "How do you reverse the ordering of an existing Comparator 'comp'?",
            options: [
              { id: "A", text: "comp.reversed()", explanationIfWrong: "" },
              { id: "B", text: "comp.invert()", explanationIfWrong: "The method name is reversed()." },
              { id: "C", text: "comp.not()", explanationIfWrong: "not() is for Predicates, not Comparators." },
              { id: "D", text: "!comp", explanationIfWrong: "! cannot be applied to objects." }
            ],
            correctAnswer: "A",
            explanationNote: "Comparator.reversed() returns a comparator that imposes the reverse ordering of this comparator."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 10.3: Other Useful Techniques (StringBuilder, Regex, Enums)
  // -------------------------------------------------------------
  {
    id: "10-3-other-techniques",
    number: "10.3",
    title: "Other Useful Techniques",
    subtitle: "High-performance StringBuilder, regular expressions with String.matches, and Java Enumerated Types (enums).",
    readTime: "25 min",
    objectives: [
      "Avoid string concatenation bottlenecks in loops using mutable StringBuilder",
      "Validate user input formats using regular expressions and String.matches()",
      "Use regex character classes [a-z], [0-9], and quantifiers (*, +, ?, {n})",
      "Declare typesafe enumeration sets using the 'enum' keyword",
      "Attach custom constructor parameters, fields, and getters to enum constants",
      "Iterate over enum values with Enum.values() and compare enums with =="
    ],
    theoryBlocks: [
      {
        heading: "StringBuilder: Efficient String Concatenation",
        text: "In Java, 'String' is immutable: every time you concatenate with '+' in a loop, a brand new String object is allocated on the Heap, copying all previous characters (O(N^2) quadratic time). 'StringBuilder' is a mutable character buffer: appending with '.append()' operates in O(1) amortized time, running thousands of times faster in loops!",
        codeSnippet: "// SLOW (Allocates 10,000 strings in heap):\n// String s = \"\";\n// for (int i = 0; i < 10000; i++) s += i;\n\n// FAST: High-performance StringBuilder (Single buffer):\nStringBuilder sb = new StringBuilder();\nfor (int i = 1; i <= 5; i++) {\n    sb.append(i).append(\" \");\n}\nString result = sb.toString();\nSystem.out.println(result); // \"1 2 3 4 5 \"",
        terminalOutput: "StringBuilder result: \"1 2 3 4 5 \"\nLinear O(N) performance vs quadratic O(N^2) string copying",
        tip: "Use StringBuilder whenever building strings inside loops or processing large files.",
        warning: "For a simple one-line concatenation like '\"Hello \" + name', standard '+' is fine because the compiler optimizes it automatically.",
        mcq: {
          id: "j10-3-1",
          question: "Why is using 'StringBuilder.append()' vastly superior to 'str += item' inside a loop with 100,000 iterations?",
          options: [
            { id: "A", text: "Because String is immutable, so '+=' reallocates and copies the entire string on every iteration (O(N^2)), while StringBuilder modifies a mutable buffer in-place (O(N))", explanationIfWrong: "" },
            { id: "B", text: "Because StringBuilder compresses text into zip files", explanationIfWrong: "StringBuilder manages a char array buffer." },
            { id: "C", text: "Because Java prohibits '+=' inside loops", explanationIfWrong: "+= is allowed, but causes severe performance degradation." },
            { id: "D", text: "Because StringBuilder runs on GPU threads", explanationIfWrong: "StringBuilder runs on standard CPU memory." }
          ],
          correctAnswer: "A",
          explanationNote: "String immutability causes '+=' in loops to copy quadratic amounts of character data. StringBuilder appends in-place."
        },
        questionPool: [
          {
            id: "j10-3-1-alt1",
            question: "How do you convert the content accumulated in a StringBuilder into a standard Java String?",
            options: [
              { id: "A", text: "sb.toString()", explanationIfWrong: "" },
              { id: "B", text: "(String) sb", explanationIfWrong: "StringBuilder cannot be cast to String." },
              { id: "C", text: "sb.asString()", explanationIfWrong: "The method is toString()." },
              { id: "D", text: "sb.toText()", explanationIfWrong: "toText does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling sb.toString() creates and returns a standard immutable String containing the buffer's text."
          },
          {
            id: "j10-3-1-alt2",
            question: "What is the difference between 'StringBuilder' and 'StringBuffer' in Java?",
            options: [
              { id: "A", text: "StringBuilder is unsynchronized and faster for single-threaded use; StringBuffer is synchronized and thread-safe", explanationIfWrong: "" },
              { id: "B", text: "StringBuffer can only store numbers", explanationIfWrong: "Both store character text." },
              { id: "C", text: "StringBuilder is deprecated", explanationIfWrong: "StringBuilder is the modern recommended choice for single threads." },
              { id: "D", text: "StringBuffer was introduced in Java 21", explanationIfWrong: "StringBuffer is the legacy class from Java 1.0." }
            ],
            correctAnswer: "A",
            explanationNote: "StringBuilder avoids synchronization overhead and is preferred in single-threaded code."
          }
        ]
      },
      {
        heading: "Regular Expressions (Regex) with String.matches()",
        text: "A regular expression (regex) is a pattern that describes a set of strings. The method 'str.matches(regex)' checks whether the ENTIRE string matches the pattern, returning true or false. It is widely used to validate phone numbers, student IDs, and dates.",
        codeSnippet: "String studentNumber = \"012345678\";\n\n// Check if string contains only digits and is 9 digits long:\nif (studentNumber.matches(\"[0-9]{9}\")) {\n    System.out.println(\"Valid student number!\");\n}\n\n// Check if day of week:\nString day = \"tue\";\nSystem.out.println(day.matches(\"mon|tue|wed|thu|fri|sat|sun\")); // true",
        terminalOutput: "Valid student number!\ntue matches: true",
        tip: "Remember that 'String.matches()' requires the WHOLE string to match the pattern, not just a substring.",
        warning: "In Java strings, backslashes in regex must be escaped with a double backslash: write '\\\\d' instead of '\\d'.",
        mcq: {
          id: "j10-3-2",
          question: "What does 'str.matches(\"[0-9]+\")' verify about the string 'str'?",
          options: [
            { id: "A", text: "It verifies that 'str' consists of one or more digits and nothing else", explanationIfWrong: "" },
            { id: "B", text: "It adds all numbers in the string together", explanationIfWrong: "matches() validates pattern matching, it does not do math." },
            { id: "C", text: "It checks if the string has at least one letter", explanationIfWrong: "[0-9] matches digits only." },
            { id: "D", text: "It checks if the string is empty", explanationIfWrong: "+ quantifier requires at least one character." }
          ],
          correctAnswer: "A",
          explanationNote: "[0-9] matches any digit; the '+' quantifier requires one or more occurrences."
        },
        questionPool: [
          {
            id: "j10-3-2-alt1",
            question: "What does the quantifier '*' mean in a regular expression?",
            options: [
              { id: "A", text: "Zero or more repetitions of the preceding element", explanationIfWrong: "" },
              { id: "B", text: "Exactly one occurrence", explanationIfWrong: "One occurrence has no quantifier." },
              { id: "C", text: "One or more occurrences", explanationIfWrong: "One or more is '+'." },
              { id: "D", text: "Zero or one occurrence", explanationIfWrong: "Zero or one is '?'." }
            ],
            correctAnswer: "A",
            explanationNote: "In regex: * means 0 or more, + means 1 or more, ? means 0 or 1."
          },
          {
            id: "j10-3-2-alt2",
            question: "Why must you write '\\\\d' instead of '\\d' in a Java string literal for a regex digit match?",
            options: [
              { id: "A", text: "Because the backslash is an escape character in Java string literals, so it must be escaped as '\\\\' to pass a literal '\\d' to the regex engine", explanationIfWrong: "" },
              { id: "B", text: "Because \\d matches double digits", explanationIfWrong: "\\d matches a single digit." },
              { id: "C", text: "Java requires all regex symbols to be doubled", explanationIfWrong: "Only the backslash escape requires doubling." },
              { id: "D", text: "To make regex run in multithreaded mode", explanationIfWrong: "It is string literal syntax." }
            ],
            correctAnswer: "A",
            explanationNote: "Java compiler consumes the first backslash to escape the second, resulting in '\\d' in memory for the regex engine."
          }
        ]
      },
      {
        heading: "Regex Character Classes & Alternation",
        text: "Regex provides powerful character class syntax:\n• '[abc]': matches 'a', 'b', or 'c'\n• '[a-z]': matches any lowercase letter\n• '[a-zA-Z]': matches any uppercase or lowercase letter\n• 'a|b': matches either 'a' or 'b' (alternation)\n• '{3}': matches exactly 3 times\n• '{2,5}': matches between 2 and 5 times.",
        codeSnippet: "// Validating 24-hour time format (e.g. 14:30):\nString timeRegex = \"([01][0-9]|2[0-3]):[0-5][0-9]\";\n\nSystem.out.println(\"14:30\".matches(timeRegex)); // true\nSystem.out.println(\"25:00\".matches(timeRegex)); // false (hour > 23)\nSystem.out.println(\"09:65\".matches(timeRegex)); // false (minute > 59)",
        terminalOutput: "14:30 -> Valid time\n25:00 -> Invalid time",
        tip: "Parentheses '(...)' group sub-expressions, enabling alternation like '([01][0-9]|2[0-3])'.",
        warning: "Without parentheses, '|' applies to the entire expression on either side.",
        mcq: {
          id: "j10-3-3",
          question: "Which regular expression matches a string that consists of exactly 3 uppercase letters followed by exactly 3 digits (e.g. \"ABC123\")?",
          options: [
            { id: "A", text: "[A-Z]{3}[0-9]{3}", explanationIfWrong: "" },
            { id: "B", text: "[A-Z]+[0-9]+", explanationIfWrong: "'+' matches one or more, not exactly 3." },
            { id: "C", text: "[A-Z]{3}|[0-9]{3}", explanationIfWrong: "'|' means either 3 letters OR 3 digits, not both in sequence." },
            { id: "D", text: "(A-Z)3(0-9)3", explanationIfWrong: "Braces {n} denote quantifiers; brackets [ ] denote character classes." }
          ],
          correctAnswer: "A",
          explanationNote: "[A-Z]{3} matches 3 uppercase letters, followed immediately by [0-9]{3} matching 3 digits."
        },
        questionPool: [
          {
            id: "j10-3-3-alt1",
            question: "What does the regex '[^0-9]' match?",
            options: [
              { id: "A", text: "Any single character that is NOT a digit (negated character class)", explanationIfWrong: "" },
              { id: "B", text: "A number that starts with 0", explanationIfWrong: "^ inside brackets negates the character class." },
              { id: "C", text: "The power of 9", explanationIfWrong: "^ is not an exponent in regex." },
              { id: "D", text: "Only numbers above 9", explanationIfWrong: "It matches non-digits." }
            ],
            correctAnswer: "A",
            explanationNote: "Inside square brackets, '^' negates the class, matching any character except the listed characters."
          },
          {
            id: "j10-3-3-alt2",
            question: "How do you check if a string consists entirely of vowels (a, e, i, o, u) in lowercase?",
            options: [
              { id: "A", text: "str.matches(\"[aeiou]+\")", explanationIfWrong: "" },
              { id: "B", text: "str.matches(\"vowels*\")", explanationIfWrong: "vowels is not a regex character class." },
              { id: "C", text: "str.contains(\"aeiou\")", explanationIfWrong: "contains checks for exact substring \"aeiou\"." },
              { id: "D", text: "str.isVowel()", explanationIfWrong: "isVowel does not exist on String." }
            ],
            correctAnswer: "A",
            explanationNote: "[aeiou]+ matches one or more lowercase vowel characters."
          }
        ]
      },
      {
        heading: "Enumerated Types (enum)",
        text: "If you have a fixed set of predefined constants (such as days of the week, card suits, or order statuses), use an 'enum' instead of integer constants or raw strings. Enums provide compile-time type safety: a method expecting a 'Suit' cannot accidentally be passed an arbitrary invalid string like 'banana'.",
        codeSnippet: "public enum Suit {\n    DIAMOND,\n    SPADE,\n    CLUB,\n    HEART\n}\n\npublic class Card {\n    private int value;\n    private Suit suit; // Typesafe enum!\n\n    public Card(int value, Suit suit) {\n        this.value = value;\n        this.suit = suit;\n    }\n    public Suit getSuit() { return this.suit; }\n}",
        terminalOutput: "Card c = new Card(10, Suit.HEART);\nSystem.out.println(c.getSuit()); // Prints \"HEART\"",
        tip: "Enum constants are conventionally written in ALL_CAPS.",
        warning: "You can compare enum values using '==' safely because each enum constant is a unique singleton instance.",
        mcq: {
          id: "j10-3-4",
          question: "Why is using an 'enum' for card suits (Suit.HEART, Suit.SPADE) better than using raw Strings (\"HEART\", \"SPADE\")?",
          options: [
            { id: "A", text: "Enums provide compile-time type safety, preventing invalid values (like typos \"HART\") from ever compiling", explanationIfWrong: "" },
            { id: "B", text: "Enums run in C++ mode", explanationIfWrong: "Enums are pure Java language objects." },
            { id: "C", text: "Strings cannot be stored in classes", explanationIfWrong: "Strings can be stored anywhere." },
            { id: "D", text: "Enums eliminate the need for constructors", explanationIfWrong: "Classes using enums still have constructors." }
          ],
          correctAnswer: "A",
          explanationNote: "Enums restrict possible values to a predefined set, caught at compile time if mistyped."
        },
        questionPool: [
          {
            id: "j10-3-4-alt1",
            question: "Why is it safe to compare two enum values using the '==' operator in Java?",
            options: [
              { id: "A", text: "Because the JVM guarantees that each enum constant is a unique singleton instance in memory", explanationIfWrong: "" },
              { id: "B", text: "Because enums are primitive types", explanationIfWrong: "Enums are special reference classes extending java.lang.Enum." },
              { id: "C", text: "Because == triggers deep reflection on enums", explanationIfWrong: "== compares direct reference pointers." },
              { id: "D", text: "It is not safe; equals() must always be used", explanationIfWrong: "== is completely safe and idiomatic for enums." }
            ],
            correctAnswer: "A",
            explanationNote: "Because each enum constant exists as a single instance in the JVM, == and .equals() are identical."
          },
          {
            id: "j10-3-4-alt2",
            question: "How can you get an array of all constants declared in the 'Suit' enum?",
            options: [
              { id: "A", text: "Suit.values()", explanationIfWrong: "" },
              { id: "B", text: "Suit.getAll()", explanationIfWrong: "getAll does not exist." },
              { id: "C", text: "Suit.toArray()", explanationIfWrong: "toArray is for Collections." },
              { id: "D", text: "Suit.constants()", explanationIfWrong: "constants does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "The compiler automatically adds a static .values() method returning an array of all enum constants."
          }
        ]
      },
      {
        heading: "Enums with Instance Variables and Getters",
        text: "Enums in Java are full-fledged classes! They can have private instance variables, constructors, and methods. Enum constructors are implicitly 'private' and are invoked when the enum constants are loaded by the JVM.",
        codeSnippet: "public enum Color {\n    RED(\"#FF0000\"),\n    GREEN(\"#00FF00\"),\n    BLUE(\"#0000FF\");\n\n    private final String hexCode;\n\n    // Enum constructor (private by default):\n    Color(String hexCode) {\n        this.hexCode = hexCode;\n    }\n\n    public String getHexCode() {\n        return this.hexCode;\n    }\n}",
        terminalOutput: "Color c = Color.RED;\nSystem.out.println(c.getHexCode()); // \"#FF0000\"",
        tip: "Mark instance variables in enums as 'final' because enum constants should represent immutable state.",
        warning: "Enum constructors cannot be declared public; they can only be private or package-private.",
        mcq: {
          id: "j10-3-5",
          question: "Can an enum in Java contain private instance variables, constructors, and getter methods?",
          options: [
            { id: "A", text: "Yes, Java enums are full-featured classes and can have instance variables, constructors, and methods", explanationIfWrong: "" },
            { id: "B", text: "No, enums can only contain names separated by commas", explanationIfWrong: "Java enums are much more powerful than C-style enums." },
            { id: "C", text: "Only if the enum extends Thread", explanationIfWrong: "Enums already implicitly extend java.lang.Enum." },
            { id: "D", text: "Only in static nested classes", explanationIfWrong: "Any enum can have fields and methods." }
          ],
          correctAnswer: "A",
          explanationNote: "Java enums are special classes that support fields, constructors, interfaces, and methods."
        },
        questionPool: [
          {
            id: "j10-3-5-alt1",
            question: "Why cannot an enum constructor be declared with the 'public' access modifier?",
            options: [
              { id: "A", text: "Because enums cannot be instantiated from outside using 'new'; constants are created internally when the enum class loads", explanationIfWrong: "" },
              { id: "B", text: "Because public is reserved for interfaces", explanationIfWrong: "public is used across classes and methods." },
              { id: "C", text: "It is a bug in the Java compiler", explanationIfWrong: "It is an intentional design constraint." },
              { id: "D", text: "To prevent enums from being printed", explanationIfWrong: "Enums can be printed with .name() or .toString()." }
            ],
            correctAnswer: "A",
            explanationNote: "Allowing public constructors would allow external code to create new enum constants at runtime, violating the fixed-set contract."
          },
          {
            id: "j10-3-5-alt2",
            question: "What method returns the exact declared name of an enum constant as a String (e.g. \"RED\")?",
            options: [
              { id: "A", text: "color.name()", explanationIfWrong: "" },
              { id: "B", text: "color.id()", explanationIfWrong: "id() is not an Enum method." },
              { id: "C", text: "color.getLabel()", explanationIfWrong: "getLabel is not built-in." },
              { id: "D", text: "color.key()", explanationIfWrong: "key() is not an Enum method." }
            ],
            correctAnswer: "A",
            explanationNote: ".name() returns the exact identifier of the enum constant as declared."
          }
        ]
      },
      {
        heading: "Iterating and Switching over Enums",
        text: "Enums integrate seamlessly with 'switch' statements and expressions. Because the compiler knows all possible enum values, it can check for missing branches and doesn't require prefixing with the enum name inside switch cases.",
        codeSnippet: "public enum Level {\n    EASY, MEDIUM, HARD\n}\n\npublic static int getScoreMultiplier(Level level) {\n    return switch (level) {\n        case EASY -> 1;\n        case MEDIUM -> 2;\n        case HARD -> 3;\n    };\n}\n\n// Iterate over all levels:\nfor (Level lvl : Level.values()) {\n    System.out.println(lvl + \": multiplier \" + getScoreMultiplier(lvl));\n}",
        terminalOutput: "EASY: multiplier 1\nMEDIUM: multiplier 2\nHARD: multiplier 3",
        tip: "Switch expressions with '->' do not require 'break' statements and eliminate fall-through bugs.",
        warning: "Do not write 'case Level.EASY:' inside switch statements; write 'case EASY:' directly.",
        mcq: {
          id: "j10-3-6",
          question: "When writing a switch statement on an enum variable 'Level level', how should the case label for 'Level.EASY' be written?",
          options: [
            { id: "A", text: "case EASY: (the enum name is omitted)", explanationIfWrong: "" },
            { id: "B", text: "case Level.EASY:", explanationIfWrong: "Writing the qualifying enum name in the case label causes a compilation error." },
            { id: "C", text: "case \"EASY\":", explanationIfWrong: "The case label must be the enum constant identifier, not a string." },
            { id: "D", text: "case 0:", explanationIfWrong: "Enums are matched by constant name, not raw ordinal integers." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java switch statements over enums, the case label must be unqualified: 'case EASY:'."
        },
        questionPool: [
          {
            id: "j10-3-6-alt1",
            question: "What method converts a String like \"MEDIUM\" back into its corresponding enum constant Level.MEDIUM?",
            options: [
              { id: "A", text: "Level.valueOf(\"MEDIUM\")", explanationIfWrong: "" },
              { id: "B", text: "Level.from(\"MEDIUM\")", explanationIfWrong: "The method is valueOf()." },
              { id: "C", text: "(Level) \"MEDIUM\"", explanationIfWrong: "Strings cannot be cast to enums." },
              { id: "D", text: "Level.parse(\"MEDIUM\")", explanationIfWrong: "parse is not an enum method." }
            ],
            correctAnswer: "A",
            explanationNote: "Enum.valueOf(String) parses a string and returns the matching enum constant (or throws IllegalArgumentException if invalid)."
          },
          {
            id: "j10-3-6-alt2",
            question: "What exception is thrown if you call 'Level.valueOf(\"IMPOSSIBLE\")' when \"IMPOSSIBLE\" is not a declared enum constant?",
            options: [
              { id: "A", text: "IllegalArgumentException", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "Invalid names throw IllegalArgumentException." },
              { id: "C", text: "ClassCastException", explanationIfWrong: "No casting is involved." },
              { id: "D", text: "It returns null", explanationIfWrong: "valueOf throws an exception on unrecognized names." }
            ],
            correctAnswer: "A",
            explanationNote: "valueOf throws IllegalArgumentException if the specified enum type has no constant with the specified name."
          }
        ]
      }
    ]
  }
];

// Helper functions for Level Failure, Question Pool Rotation, and Attempt Tracking

export function getActiveQuestionsForLevelPart10(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part10_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart10(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part10_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart10(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part10_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart10(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part10_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart10(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part10_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart10 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart10(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart10 {
  const attemptKey = `dopilot_java_part10_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part10_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part10_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart10(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart10(studentId);
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
