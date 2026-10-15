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

export const PART_3_SECTIONS: SectionContent[] = [
  {
    id: "3-1-lists",
    number: "3.1",
    title: "Lists (ArrayList)",
    subtitle: "Master dynamic collections in Java: creating ArrayLists, adding items, retrieving by index, size calculation, and for-each iteration.",
    readTime: "20 min",
    objectives: [
      "Import and instantiate java.util.ArrayList for dynamic collections",
      "Add elements to a list using .add()",
      "Retrieve elements by index using .get() with zero-based indexing",
      "Determine total item count using .size()",
      "Iterate through lists with both indexed for loops and enhanced for-each loops",
      "Search for items using .contains() and remove elements with .remove()"
    ],
    theoryBlocks: [
      {
        heading: "Creating an ArrayList",
        text: "Unlike fixed-size arrays, an ArrayList in Java grows and shrinks dynamically as elements are added or removed. It resides in the 'java.util' package and must be imported. Because ArrayLists only store object references, primitive types must use their wrapper classes (e.g. Integer, Double, Boolean).",
        codeSnippet: "import java.util.ArrayList;\n\npublic class ListCreation {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<>();\n        ArrayList<Integer> numbers = new ArrayList<>();\n        System.out.println(\"Empty list size: \" + names.size());\n    }\n}",
        terminalOutput: "Empty list size: 0",
        tip: "Use the diamond operator '<>' on the right side of the assignment: new ArrayList<>() instead of repeating the type.",
        warning: "You cannot create an ArrayList of primitive types like ArrayList<int>. You must use wrapper class: ArrayList<Integer>.",
        mcq: {
          id: "q-3.1-0-v1",
          question: "Which of the following statements correctly declares an ArrayList of integers in Java?",
          options: [
            { id: "A", text: "ArrayList<Integer> numbers = new ArrayList<>();", explanationIfWrong: "" },
            { id: "B", text: "ArrayList<int> numbers = new ArrayList<int>();", explanationIfWrong: "Generic type arguments cannot be primitive types like 'int'." },
            { id: "C", text: "List numbers = new int[];", explanationIfWrong: "This is invalid array/list mixed syntax." },
            { id: "D", text: "ArrayList numbers = new Array();", explanationIfWrong: "Array is not a class used this way in Java." }
          ],
          correctAnswer: "A",
          explanationNote: "ArrayList requires an object type as its generic parameter, so you must use the wrapper class 'Integer' rather than the primitive 'int'."
        },
        questionPool: [
          {
            id: "q-3.1-0-v2",
            question: "Which package must be imported to use the ArrayList class in Java?",
            options: [
              { id: "A", text: "java.util.ArrayList", explanationIfWrong: "" },
              { id: "B", text: "java.lang.ArrayList", explanationIfWrong: "ArrayList is in java.util, not java.lang." },
              { id: "C", text: "java.io.ArrayList", explanationIfWrong: "java.io is for input/output streams." },
              { id: "D", text: "No import needed (built-in like System)", explanationIfWrong: "Only classes in java.lang are automatically imported." }
            ],
            correctAnswer: "A",
            explanationNote: "ArrayList is part of Java's collection framework located in the 'java.util' package."
          }
        ]
      },
      {
        heading: "Adding and Accessing List Elements",
        text: "To insert an item into an ArrayList, call the '.add(value)' method. Elements are appended to the end of the list. To retrieve an item, call '.get(index)'. Like arrays, ArrayList indices are zero-based: the first element is at index 0.",
        codeSnippet: "import java.util.ArrayList;\n\npublic class AddAndGet {\n    public static void main(String[] args) {\n        ArrayList<String> words = new ArrayList<>();\n        words.add(\"First\");\n        words.add(\"Second\");\n        System.out.println(words.get(0));\n        System.out.println(words.get(1));\n    }\n}",
        terminalOutput: "First\nSecond",
        tip: "Calling words.get(index) does not remove the item from the list; it only reads it.",
        warning: "Accessing an index that does not exist throws an 'IndexOutOfBoundsException'.",
        mcq: {
          id: "q-3.1-1-v1",
          question: "If a list contains [\"Apple\", \"Banana\", \"Cherry\"], what does list.get(1) return?",
          options: [
            { id: "A", text: "Banana", explanationIfWrong: "" },
            { id: "B", text: "Apple", explanationIfWrong: "Apple is at index 0." },
            { id: "C", text: "Cherry", explanationIfWrong: "Cherry is at index 2." },
            { id: "D", text: "IndexOutOfBoundsException", explanationIfWrong: "Index 1 exists and holds \"Banana\"." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java's zero-based indexing: index 0 is Apple, index 1 is Banana, and index 2 is Cherry."
        },
        questionPool: [
          {
            id: "q-3.1-1-v2",
            question: "What exception is thrown if you call list.get(5) on an ArrayList containing only 3 elements?",
            options: [
              { id: "A", text: "IndexOutOfBoundsException", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "Accessing an out-of-range index throws IndexOutOfBoundsException, not NullPointerException." },
              { id: "C", text: "IllegalArgumentException", explanationIfWrong: "The exception is IndexOutOfBoundsException." },
              { id: "D", text: "It returns null without throwing an exception", explanationIfWrong: "Java strictly throws IndexOutOfBoundsException." }
            ],
            correctAnswer: "A",
            explanationNote: "If the requested index is negative or >= list.size(), Java throws IndexOutOfBoundsException."
          }
        ]
      },
      {
        heading: "List Size and The Last Element",
        text: "The '.size()' method returns the total number of elements currently stored in the list. Because indexing starts at 0, the last valid element is always located at index 'list.size() - 1'.",
        codeSnippet: "import java.util.ArrayList;\n\npublic class LastElement {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add(\"Helsinki\");\n        list.add(\"Espoo\");\n        list.add(\"Tampere\");\n        int lastIndex = list.size() - 1;\n        System.out.println(\"Last city: \" + list.get(lastIndex));\n    }\n}",
        terminalOutput: "Last city: Tampere",
        tip: "Remember: size() has parentheses (it is a method), whereas an array's length has NO parentheses (.length).",
        mcq: {
          id: "q-3.1-2-v1",
          question: "How do you retrieve the last element of an ArrayList named 'items'?",
          options: [
            { id: "A", text: "items.get(items.size() - 1)", explanationIfWrong: "" },
            { id: "B", text: "items.get(items.size())", explanationIfWrong: "items.size() is 1 past the end, throwing IndexOutOfBoundsException." },
            { id: "C", text: "items.get(-1)", explanationIfWrong: "Java does not support negative indices like Python." },
            { id: "D", text: "items.last()", explanationIfWrong: "There is no 'last()' method on standard ArrayList." }
          ],
          correctAnswer: "A",
          explanationNote: "Because indexing starts at 0, the index of the final element is always 'size() - 1'."
        },
        questionPool: [
          {
            id: "q-3.1-2-v2",
            question: "What happens if you execute 'list.get(list.size())' on a non-empty ArrayList?",
            options: [
              { id: "A", text: "IndexOutOfBoundsException is thrown", explanationIfWrong: "" },
              { id: "B", text: "It returns the last element", explanationIfWrong: "The last element is at size() - 1." },
              { id: "C", text: "It returns 0", explanationIfWrong: "It throws an exception." },
              { id: "D", text: "It appends a new null element", explanationIfWrong: "get() never mutates the list." }
            ],
            correctAnswer: "A",
            explanationNote: "The valid indices range from 0 to size() - 1. Requesting index size() is out of bounds."
          }
        ]
      },
      {
        heading: "Iterating with Index Loops & For-Each",
        text: "There are two primary ways to iterate through an ArrayList: 1) Traditional indexed loop: 'for (int i = 0; i < list.size(); i++)', and 2) Enhanced for-each loop: 'for (String item : list)'. The for-each loop is cleaner when you don't need the index number.",
        codeSnippet: "import java.util.ArrayList;\n\npublic class Iteration {\n    public static void main(String[] args) {\n        ArrayList<String> fruits = new ArrayList<>();\n        fruits.add(\"Mango\");\n        fruits.add(\"Pineapple\");\n        for (String fruit : fruits) {\n            System.out.println(fruit);\n        }\n    }\n}",
        terminalOutput: "Mango\nPineapple",
        tip: "Read 'for (String fruit : fruits)' aloud as: 'For each String fruit in fruits'.",
        mcq: {
          id: "q-3.1-3-v1",
          question: "When should you prefer a traditional indexed for loop over an enhanced for-each loop?",
          options: [
            { id: "A", text: "When you need to know or modify the element at a specific index 'i'", explanationIfWrong: "" },
            { id: "B", text: "When the list has more than 10 elements", explanationIfWrong: "List size does not dictate which loop to use." },
            { id: "C", text: "For-each loops are not supported on ArrayList in Java", explanationIfWrong: "For-each loops work seamlessly with ArrayList." },
            { id: "D", text: "When the elements are Strings", explanationIfWrong: "For-each works with any object type." }
          ],
          correctAnswer: "A",
          explanationNote: "The for-each loop hides index management; when you need index numbers or stepped iteration, use the standard indexed loop."
        },
        questionPool: [
          {
            id: "q-3.1-3-v2",
            question: "In 'for (int num : numbers)', what does 'num' represent during each iteration?",
            options: [
              { id: "A", text: "The actual value of the current element in the list", explanationIfWrong: "" },
              { id: "B", text: "The index of the element", explanationIfWrong: "In a for-each loop, the variable is the element, not the index." },
              { id: "C", text: "The size of the list", explanationIfWrong: "size() is the list length." },
              { id: "D", text: "A copy of the entire list", explanationIfWrong: "num is a single element." }
            ],
            correctAnswer: "A",
            explanationNote: "In an enhanced for-each loop, the loop variable directly receives the value of the current item."
          }
        ]
      },
      {
        heading: "Searching with .contains() & Removing Items",
        text: "To check whether a value exists inside an ArrayList, use 'list.contains(value)', which returns true or false. To remove an element, 'list.remove(value)' removes the first occurrence, or 'list.remove(index)' removes by position.",
        codeSnippet: "import java.util.ArrayList;\n\npublic class ContainsAndRemove {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<>();\n        names.add(\"Ada\");\n        names.add(\"Grace\");\n        if (names.contains(\"Ada\")) {\n            System.out.println(\"Ada is in the list!\");\n        }\n        names.remove(\"Ada\");\n        System.out.println(\"Remaining: \" + names.size());\n    }\n}",
        terminalOutput: "Ada is in the list!\nRemaining: 1",
        tip: "When removing an element, all subsequent elements shift left by one position to fill the gap.",
        mcq: {
          id: "q-3.1-4-v1",
          question: "What does 'list.contains(\"Python\")' return if \"Python\" is in the ArrayList?",
          options: [
            { id: "A", text: "true", explanationIfWrong: "" },
            { id: "B", text: "1", explanationIfWrong: "contains returns a boolean (true/false), not an int." },
            { id: "C", text: "The index where \"Python\" was found", explanationIfWrong: "indexOf() returns the index; contains() returns boolean." },
            { id: "D", text: "\"Python\"", explanationIfWrong: "contains returns boolean true or false." }
          ],
          correctAnswer: "A",
          explanationNote: "The '.contains()' method returns true if the specified element is found in the list, and false otherwise."
        },
        questionPool: [
          {
            id: "q-3.1-4-v2",
            question: "If a list has [\"A\", \"B\", \"C\"], what are the remaining elements after 'list.remove(1)'?",
            options: [
              { id: "A", text: "[\"A\", \"C\"] (the element at index 1 is removed)", explanationIfWrong: "" },
              { id: "B", text: "[\"B\", \"C\"]", explanationIfWrong: "\"A\" was at index 0." },
              { id: "C", text: "[\"A\", \"B\"]", explanationIfWrong: "\"C\" was at index 2." },
              { id: "D", text: "[]", explanationIfWrong: "Only the single element at index 1 is removed." }
            ],
            correctAnswer: "A",
            explanationNote: "Index 1 is \"B\". After removing it, \"C\" shifts from index 2 to index 1, leaving [\"A\", \"C\"]."
          }
        ]
      },
      {
        heading: "Passing Lists to Methods as Parameters",
        text: "Just like primitives, an ArrayList can be passed into methods as a parameter: 'public static void print(ArrayList<String> list)'. Because lists are reference types, any modifications made to the list inside the method affect the original list!",
        codeSnippet: "import java.util.ArrayList;\n\npublic class MethodList {\n    public static void main(String[] args) {\n        ArrayList<String> tasks = new ArrayList<>();\n        tasks.add(\"Read Chapter\");\n        printTasks(tasks);\n    }\n\n    public static void printTasks(ArrayList<String> list) {\n        for (String task : list) {\n            System.out.println(\"- \" + task);\n        }\n    }\n}",
        terminalOutput: "- Read Chapter",
        tip: "Passing lists to methods allows you to break large collection-processing algorithms into modular, testable units.",
        mcq: {
          id: "q-3.1-5-v1",
          question: "What happens if a method calls 'list.add(\"Extra\");' on an ArrayList passed into it as a parameter?",
          options: [
            { id: "A", text: "The item is added to the caller's list, because ArrayList is passed by reference", explanationIfWrong: "" },
            { id: "B", text: "Only a temporary copy inside the method is modified", explanationIfWrong: "Java passes object references; the list is not copied." },
            { id: "C", text: "A compilation error occurs", explanationIfWrong: "Modifying list parameters is standard in Java." },
            { id: "D", text: "The method throws an UnsupportedOperationException", explanationIfWrong: "Standard ArrayLists are mutable." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, object references are passed by value. The parameter references the exact same list object in memory, so changes persist."
        },
        questionPool: [
          {
            id: "q-3.1-5-v2",
            question: "Which method signature correctly accepts an ArrayList of integers and returns the sum as an int?",
            options: [
              { id: "A", text: "public static int sum(ArrayList<Integer> numbers)", explanationIfWrong: "" },
              { id: "B", text: "public static void sum(ArrayList numbers)", explanationIfWrong: "void cannot return an int sum." },
              { id: "C", text: "public static Integer[] sum(int list)", explanationIfWrong: "The parameter is a single int, not an ArrayList." },
              { id: "D", text: "public int sum(list<int> numbers)", explanationIfWrong: "Primitive int cannot be generic type." }
            ],
            correctAnswer: "A",
            explanationNote: "The method specifies return type 'int' and parameter type 'ArrayList<Integer>'."
          }
        ]
      }
    ]
  },
  {
    id: "3-2-arrays",
    number: "3.2",
    title: "Fixed-Size Arrays",
    subtitle: "Master classic Java arrays: array creation with fixed lengths, index assignment, .length property, initializer shortcuts, and array algorithms.",
    readTime: "20 min",
    objectives: [
      "Understand the key differences between fixed-size arrays and dynamic ArrayLists",
      "Declare and instantiate arrays using 'new int[size]'",
      "Read and assign values at specific indices using brackets '[]'",
      "Determine array size using the '.length' field (no parentheses)",
      "Use array initializer syntax: int[] numbers = {10, 20, 30}",
      "Implement linear search and summing across array elements"
    ],
    theoryBlocks: [
      {
        heading: "Declaring and Instantiating Arrays",
        text: "An array is a container object that holds a fixed number of values of a single type. The length of an array is established when the array is created and cannot change thereafter. In Java, square brackets '[]' signify an array type.",
        codeSnippet: "public class ArrayCreation {\n    public static void main(String[] args) {\n        int[] numbers = new int[3];\n        numbers[0] = 10;\n        numbers[1] = 20;\n        numbers[2] = 30;\n        System.out.println(\"Element at 0: \" + numbers[0]);\n    }\n}",
        terminalOutput: "Element at 0: 10",
        tip: "When an int array is created with 'new int[3]', all slots are automatically initialized to default 0 (boolean to false, objects to null).",
        warning: "You cannot change the size of an array after creation. If you need a resizable container, use an ArrayList.",
        mcq: {
          id: "q-3.2-0-v1",
          question: "What is the primary difference between a Java Array (int[]) and an ArrayList (ArrayList<Integer>)?",
          options: [
            { id: "A", text: "Arrays have a fixed size upon creation, while ArrayLists grow dynamically", explanationIfWrong: "" },
            { id: "B", text: "Arrays cannot store numbers", explanationIfWrong: "Arrays can store any primitive or object type." },
            { id: "C", text: "ArrayLists are faster than arrays for direct index access", explanationIfWrong: "Arrays are primitive and slightly faster." },
            { id: "D", text: "Arrays require the java.util.Array import", explanationIfWrong: "Arrays are built directly into Java syntax without imports." }
          ],
          correctAnswer: "A",
          explanationNote: "Arrays have a fixed capacity determined at creation; ArrayLists manage a dynamic internal array that expands automatically."
        },
        questionPool: [
          {
            id: "q-3.2-0-v2",
            question: "What is the default value of elements in a newly created 'new int[5]' array before any assignment?",
            options: [
              { id: "A", text: "0", explanationIfWrong: "" },
              { id: "B", text: "null", explanationIfWrong: "Primitive ints default to 0, not null." },
              { id: "C", text: "-1", explanationIfWrong: "Java initializes numeric primitives to 0." },
              { id: "D", text: "Random garbage memory values", explanationIfWrong: "Unlike C++, Java guarantees zero-initialization." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, primitive numeric array elements are automatically initialized to 0."
          }
        ]
      },
      {
        heading: "The .length Field (No Parentheses)",
        text: "To determine how many elements an array can hold, access its public constant field '.length'. Crucially, unlike String.length() or ArrayList.size(), array length is a field, not a method, so you do NOT write parentheses '()'.",
        codeSnippet: "public class ArrayLength {\n    public static void main(String[] args) {\n        String[] names = new String[4];\n        System.out.println(\"Array length: \" + names.length);\n    }\n}",
        terminalOutput: "Array length: 4",
        tip: "Memory trick: String has method .length(), ArrayList has method .size(), but Array has field .length.",
        mcq: {
          id: "q-3.2-1-v1",
          question: "Which syntax correctly gets the number of elements in an array named 'values'?",
          options: [
            { id: "A", text: "values.length", explanationIfWrong: "" },
            { id: "B", text: "values.length()", explanationIfWrong: ".length() with parentheses is for String, not arrays." },
            { id: "C", text: "values.size()", explanationIfWrong: ".size() is for ArrayList, not arrays." },
            { id: "D", text: "values.count", explanationIfWrong: "There is no 'count' field in Java arrays." }
          ],
          correctAnswer: "A",
          explanationNote: "Java arrays have a final instance variable called 'length' (without parentheses)."
        },
        questionPool: [
          {
            id: "q-3.2-1-v2",
            question: "What compiler error occurs if you write 'numbers.length()' on an int[] array?",
            options: [
              { id: "A", text: "cannot find symbol method length()", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "This is caught at compile time." },
              { id: "C", text: "ArrayIndexOutOfBoundsException", explanationIfWrong: "ArrayIndexOutOfBounds occurs at runtime on index access." },
              { id: "D", text: "It compiles and runs normally", explanationIfWrong: "The compiler rejects calling a field as a method." }
            ],
            correctAnswer: "A",
            explanationNote: "The compiler looks for a method named 'length()' and fails because 'length' is a variable, not a method."
          }
        ]
      },
      {
        heading: "Array Initializer Syntax",
        text: "If you know the values ahead of time, you can declare and populate an array simultaneously using curly braces '{ ... }'. Java automatically allocates an array with length equal to the number of elements provided.",
        codeSnippet: "public class ArrayInitializer {\n    public static void main(String[] args) {\n        int[] primes = { 2, 3, 5, 7, 11 };\n        System.out.println(\"First prime: \" + primes[0]);\n        System.out.println(\"Total primes: \" + primes.length);\n    }\n}",
        terminalOutput: "First prime: 2\nTotal primes: 5",
        tip: "This shorthand is only permitted directly in the declaration statement (int[] arr = {1, 2};).",
        mcq: {
          id: "q-3.2-2-v1",
          question: "What is the length of 'int[] grades = { 90, 85, 95, 100 };'?",
          options: [
            { id: "A", text: "4", explanationIfWrong: "" },
            { id: "B", text: "3", explanationIfWrong: "Indices are 0 to 3, but the length is 4." },
            { id: "C", text: "100", explanationIfWrong: "100 is the value at index 3." },
            { id: "D", text: "0", explanationIfWrong: "The array has 4 initialized elements." }
          ],
          correctAnswer: "A",
          explanationNote: "The array contains 4 values, so its .length field is 4."
        },
        questionPool: [
          {
            id: "q-3.2-2-v2",
            question: "What is the index of the value '7' in 'int[] data = { 2, 5, 7, 9 };'?",
            options: [
              { id: "A", text: "2", explanationIfWrong: "" },
              { id: "B", text: "3", explanationIfWrong: "Index 3 contains 9." },
              { id: "C", text: "1", explanationIfWrong: "Index 1 contains 5." },
              { id: "D", text: "7", explanationIfWrong: "7 is the value, not the index." }
            ],
            correctAnswer: "A",
            explanationNote: "Index 0 is 2, index 1 is 5, index 2 is 7."
          }
        ]
      },
      {
        heading: "Iterating Across Arrays with For Loops",
        text: "You can iterate through an array from index 0 up to 'array.length - 1' using a standard for loop: 'for (int i = 0; i < array.length; i++)'. Notice the strictly '<' operator to ensure the loop stops before reaching out-of-bounds.",
        codeSnippet: "public class PrintArray {\n    public static void main(String[] args) {\n        int[] values = { 10, 20, 30 };\n        for (int i = 0; i < values.length; i++) {\n            System.out.println(\"Index \" + i + \": \" + values[i]);\n        }\n    }\n}",
        terminalOutput: "Index 0: 10\nIndex 1: 20\nIndex 2: 30",
        tip: "Notice that 'i < values.length' ensures the loop runs for i = 0, 1, 2 and halts before i reaches 3.",
        warning: "Writing 'i <= values.length' is a very common off-by-one bug that throws ArrayIndexOutOfBoundsException!",
        mcq: {
          id: "q-3.2-3-v1",
          question: "Why does 'for (int i = 0; i <= array.length; i++)' fail at runtime?",
          options: [
            { id: "A", text: "It attempts to access array[array.length], which is 1 past the valid range, throwing ArrayIndexOutOfBoundsException", explanationIfWrong: "" },
            { id: "B", text: "The Java compiler refuses to compile '<=' in for loops", explanationIfWrong: "It compiles; the error happens at runtime." },
            { id: "C", text: "It causes an infinite loop", explanationIfWrong: "It crashes on the last iteration." },
            { id: "D", text: "array.length is not accessible inside a loop", explanationIfWrong: "array.length is accessible anywhere the array is in scope." }
          ],
          correctAnswer: "A",
          explanationNote: "Because array indices range from 0 to length - 1, accessing index 'length' exceeds bounds and throws ArrayIndexOutOfBoundsException."
        },
        questionPool: [
          {
            id: "q-3.2-3-v2",
            question: "Can an enhanced for-each loop be used with traditional arrays like 'int[] nums'?",
            options: [
              { id: "A", text: "Yes, 'for (int n : nums)' works identically for both arrays and ArrayLists", explanationIfWrong: "" },
              { id: "B", text: "No, for-each is only for ArrayLists", explanationIfWrong: "For-each was introduced specifically for both arrays and collections." },
              { id: "C", text: "Only if the array contains Strings", explanationIfWrong: "It works for any primitive or object array." },
              { id: "D", text: "Only in Java 21", explanationIfWrong: "For-each has been in Java since Java 5." }
            ],
            correctAnswer: "A",
            explanationNote: "The enhanced for-each loop works seamlessly over traditional arrays and any Iterable collection."
          }
        ]
      },
      {
        heading: "Searching an Array for a Target Value",
        text: "Linear search checks each element from start to finish until the target is found. If found, save the index or return true; if the loop completes without finding the target, report that it is not present.",
        codeSnippet: "public class ArraySearch {\n    public static void main(String[] args) {\n        int[] numbers = { 4, 18, 9, 25 };\n        int searchFor = 9;\n        boolean found = false;\n        for (int num : numbers) {\n            if (num == searchFor) {\n                found = true;\n                break;\n            }\n        }\n        System.out.println(\"Found: \" + found);\n    }\n}",
        terminalOutput: "Found: true",
        tip: "Using 'break;' as soon as the target is located prevents unnecessary iterations over the rest of the array.",
        mcq: {
          id: "q-3.2-4-v1",
          question: "In the worst case (target not present), how many elements does linear search inspect in an array of size N?",
          options: [
            { id: "A", text: "All N elements", explanationIfWrong: "" },
            { id: "B", text: "1 element", explanationIfWrong: "It must check every element before concluding it's absent." },
            { id: "C", text: "N / 2 elements", explanationIfWrong: "N/2 is the average case when present, but worst case is N." },
            { id: "D", text: "0 elements", explanationIfWrong: "It has to inspect the elements." }
          ],
          correctAnswer: "A",
          explanationNote: "Linear search must inspect all N elements before confirming that the target is not in the array."
        },
        questionPool: [
          {
            id: "q-3.2-4-v2",
            question: "Why should you include 'break;' when a target is found in linear search?",
            options: [
              { id: "A", text: "It terminates the loop early, saving CPU time", explanationIfWrong: "" },
              { id: "B", text: "Java requires break in all if statements", explanationIfWrong: "break is optional and used for control flow." },
              { id: "C", text: "Without break, found would reset to false", explanationIfWrong: "found is only set to true." },
              { id: "D", text: "It prevents compilation errors", explanationIfWrong: "It is an optimization, not a syntax requirement." }
            ],
            correctAnswer: "A",
            explanationNote: "Once the item is found, continuing to loop over remaining elements is wasted computation."
          }
        ]
      },
      {
        heading: "Summing Elements in an Array",
        text: "To sum an array, initialize an accumulator 'int sum = 0;' before the loop. Iterate through the array using either loop style, adding each element to the sum: 'sum += num;'.",
        codeSnippet: "public class SumArray {\n    public static void main(String[] args) {\n        int[] values = { 5, 1, 3, 4, 2 };\n        int sum = 0;\n        for (int v : values) {\n            sum += v;\n        }\n        System.out.println(\"Sum: \" + sum);\n    }\n}",
        terminalOutput: "Sum: 15",
        tip: "To calculate the average of an array: (double) sum / values.length.",
        mcq: {
          id: "q-3.2-5-v1",
          question: "Given 'int[] arr = { 2, 4, 6 };', what is '(double) sum / arr.length'?",
          options: [
            { id: "A", text: "4.0", explanationIfWrong: "" },
            { id: "B", text: "4", explanationIfWrong: "It is cast to double, producing 4.0." },
            { id: "C", text: "12.0", explanationIfWrong: "12 is the sum; average is 12 / 3 = 4.0." },
            { id: "D", text: "3.0", explanationIfWrong: "12 / 3 is 4.0." }
          ],
          correctAnswer: "A",
          explanationNote: "Sum = 2 + 4 + 6 = 12. Length = 3. 12.0 / 3 = 4.0."
        },
        questionPool: [
          {
            id: "q-3.2-5-v2",
            question: "What happens if you calculate the average of an empty array 'new int[0]' using 'sum / arr.length'?",
            options: [
              { id: "A", text: "ArithmeticException: / by zero", explanationIfWrong: "" },
              { id: "B", text: "0", explanationIfWrong: "Integer division by 0 throws an exception in Java." },
              { id: "C", text: "null", explanationIfWrong: "Primitives cannot be null." },
              { id: "D", text: "It returns NaN", explanationIfWrong: "Integer division throws ArithmeticException; floating-point division returns NaN." }
            ],
            correctAnswer: "A",
            explanationNote: "Dividing an integer by 0 (arr.length == 0) throws an ArithmeticException."
          }
        ]
      }
    ]
  },
  {
    id: "3-3-using-strings",
    number: "3.3",
    title: "Using Strings & Text Processing",
    subtitle: "Master text manipulation: string immutability, splitting strings with .split(), parsing CSV records, and extracting numeric data.",
    readTime: "25 min",
    objectives: [
      "Understand that Java Strings are immutable objects",
      "Split strings into arrays of substrings using the .split() method",
      "Parse delimited data (like comma-separated values)",
      "Convert text tokens into numbers using Integer.valueOf()",
      "Process user-entered tabular data line by line",
      "Search and inspect text with .contains(), .indexOf(), and .length()"
    ],
    theoryBlocks: [
      {
        heading: "String Immutability & Basic Methods",
        text: "In Java, String objects are immutable: once created, their character contents can never be changed. Any method that appears to modify a String (like .toUpperCase() or .replace()) actually creates and returns a brand-new String object.",
        codeSnippet: "public class StringImmutability {\n    public static void main(String[] args) {\n        String text = \"hello\";\n        text.toUpperCase(); // Returned string is ignored!\n        System.out.println(text);\n        text = text.toUpperCase(); // Reassigned!\n        System.out.println(text);\n    }\n}",
        terminalOutput: "hello\nHELLO",
        tip: "Always remember to reassign the result if you want to store the transformed string: text = text.trim();",
        mcq: {
          id: "q-3.3-0-v1",
          question: "Given 'String s = \"java\"; s.concat(\" rules\"); System.out.println(s);', what is printed?",
          options: [
            { id: "A", text: "\"java\"", explanationIfWrong: "" },
            { id: "B", text: "\"java rules\"", explanationIfWrong: "Strings are immutable; s was not reassigned (s = s.concat(...))." },
            { id: "C", text: "\"rules\"", explanationIfWrong: "s still references \"java\"." },
            { id: "D", text: "A compilation error", explanationIfWrong: "The code is valid Java; the returned string is simply discarded." }
          ],
          correctAnswer: "A",
          explanationNote: "Because String is immutable, calling concat() returns a new string without modifying 's'. Since 's' was not reassigned, it remains \"java\"."
        },
        questionPool: [
          {
            id: "q-3.3-0-v2",
            question: "How do you obtain the character at index 2 of a String 'word'?",
            options: [
              { id: "A", text: "word.charAt(2)", explanationIfWrong: "" },
              { id: "B", text: "word[2]", explanationIfWrong: "Bracket syntax [] is for arrays, not Strings in Java." },
              { id: "C", text: "word.get(2)", explanationIfWrong: "get() is for ArrayList." },
              { id: "D", text: "word.char(2)", explanationIfWrong: "The method is 'charAt(int index)'." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, individual characters of a String are accessed using the '.charAt(index)' method."
          }
        ]
      },
      {
        heading: "Splitting Strings with .split()",
        text: "The '.split(delimiter)' method divides a single string into pieces based on a separator character or regex, returning a 'String[]' array of the resulting tokens. For example, splitting by space breaks a sentence into words.",
        codeSnippet: "public class SplitExample {\n    public static void main(String[] args) {\n        String sentence = \"programming in java is fun\";\n        String[] words = sentence.split(\" \");\n        for (String w : words) {\n            System.out.println(w);\n        }\n    }\n}",
        terminalOutput: "programming\nin\njava\nis\nfun",
        tip: "The returned object from .split() is a standard String[] array, so you can access pieces with pieces[0], pieces[1], etc.",
        mcq: {
          id: "q-3.3-1-v1",
          question: "What does 'String[] parts = \"one:two:three\".split(\":\");' produce?",
          options: [
            { id: "A", text: "A String array containing [\"one\", \"two\", \"three\"] with length 3", explanationIfWrong: "" },
            { id: "B", text: "A single String \"onetwothree\"", explanationIfWrong: ".split() returns an array of strings." },
            { id: "C", text: "An ArrayList of Strings", explanationIfWrong: ".split() returns an array (String[]), not an ArrayList." },
            { id: "D", text: "A compilation error", explanationIfWrong: ".split(\":\") is standard Java." }
          ],
          correctAnswer: "A",
          explanationNote: ".split(\":\") splits the string at each colon ':' into an array of 3 strings."
        },
        questionPool: [
          {
            id: "q-3.3-1-v2",
            question: "What is 'parts.length' after calling 'String[] parts = \"hello\".split(\" \");'?",
            options: [
              { id: "A", text: "1 (no spaces found, so the whole string is the single element)", explanationIfWrong: "" },
              { id: "B", text: "0", explanationIfWrong: "If the delimiter is not found, the original string is returned as the only element." },
              { id: "C", text: "5", explanationIfWrong: "It does not split into characters unless delimiter is \"\"." },
              { id: "D", text: "NullPointerException", explanationIfWrong: "No exception is thrown." }
            ],
            correctAnswer: "A",
            explanationNote: "When the delimiter is not present in the string, split() returns an array containing the entire original string as index 0."
          }
        ]
      },
      {
        heading: "Parsing CSV Structured Data",
        text: "A classic Helsinki MOOC problem asks to read lines formatted as 'name,age' (e.g. 'sebastian,28') until an empty string is entered. Using '.split(\",\")', pieces[0] is the name and pieces[1] is the age string.",
        codeSnippet: "public class ParseCSV {\n    public static void main(String[] args) {\n        String line = \"sebastian,28\";\n        String[] pieces = line.split(\",\");\n        String name = pieces[0];\n        int age = Integer.valueOf(pieces[1]);\n        System.out.println(name + \" is \" + age + \" years old\");\n    }\n}",
        terminalOutput: "sebastian is 28 years old",
        tip: "Always check 'if (line.isEmpty()) break;' or 'if (line.equals(\"\")) break;' to exit user input loops cleanly.",
        mcq: {
          id: "q-3.3-2-v1",
          question: "In 'sebastian,28', how do you convert the age portion (pieces[1]) into an integer?",
          options: [
            { id: "A", text: "Integer.valueOf(pieces[1]) or Integer.parseInt(pieces[1])", explanationIfWrong: "" },
            { id: "B", text: "(int) pieces[1]", explanationIfWrong: "Strings cannot be directly cast to primitive int." },
            { id: "C", text: "pieces[1].toInt()", explanationIfWrong: "Java does not have a .toInt() method on String." },
            { id: "D", text: "Math.toInt(pieces[1])", explanationIfWrong: "Math has no toInt method." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, converting a String to an integer is done using Integer.valueOf() or Integer.parseInt()."
        },
        questionPool: [
          {
            id: "q-3.3-2-v2",
            question: "What exception occurs if pieces[1] contains \"twenty\" when calling Integer.valueOf(pieces[1])?",
            options: [
              { id: "A", text: "NumberFormatException", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "\"twenty\" is not null." },
              { id: "C", text: "ClassCastException", explanationIfWrong: "It is a parse error, not a cast error." },
              { id: "D", text: "ArithmeticException", explanationIfWrong: "Parsing non-numeric strings throws NumberFormatException." }
            ],
            correctAnswer: "A",
            explanationNote: "Integer.valueOf() throws NumberFormatException if the string cannot be parsed into an integer."
          }
        ]
      },
      {
        heading: "Finding Oldest Person Pattern",
        text: "To find the oldest person from CSV input lines: track 'int oldestAge = -1;' and 'String oldestName = \"\";'. For each line, parse age = Integer.valueOf(pieces[1]). If age > oldestAge, update oldestAge = age and oldestName = pieces[0].",
        codeSnippet: "public class OldestPerson {\n    public static void main(String[] args) {\n        String[] lines = { \"ada,20\", \"linus,54\", \"grace,40\" };\n        int maxAge = -1;\n        String oldest = \"\";\n        for (String line : lines) {\n            String[] parts = line.split(\",\");\n            int age = Integer.valueOf(parts[1]);\n            if (age > maxAge) {\n                maxAge = age;\n                oldest = parts[0];\n            }\n        }\n        System.out.println(\"Oldest: \" + oldest + \" (\" + maxAge + \")\");\n    }\n}",
        terminalOutput: "Oldest: linus (54)",
        tip: "Initializing maxAge to -1 ensures that even a 0-year-old newborn will correctly update the record.",
        mcq: {
          id: "q-3.3-3-v1",
          question: "Why should oldestAge be initialized to -1 (or Integer.MIN_VALUE) rather than a positive number like 100?",
          options: [
            { id: "A", text: "Because if everyone in the list is younger than 100, the condition 'age > maxAge' would never be true", explanationIfWrong: "" },
            { id: "B", text: "Java requires all max variables to be -1", explanationIfWrong: "It is an algorithmic choice, not a syntax rule." },
            { id: "C", text: "Positive numbers cause compiler errors in split loops", explanationIfWrong: "Any valid integer compiles." },
            { id: "D", text: "It prevents NumberFormatException", explanationIfWrong: "The initialization value has no effect on parsing." }
          ],
          correctAnswer: "A",
          explanationNote: "When finding a maximum, initialize to the lowest possible value so the very first item inspected becomes the baseline."
        },
        questionPool: [
          {
            id: "q-3.3-3-v2",
            question: "In the OldestPerson example, what is 'oldest' if the input has only one person: 'ada,20'?",
            options: [
              { id: "A", text: "\"ada\"", explanationIfWrong: "" },
              { id: "B", text: "\"\"", explanationIfWrong: "20 > -1 is true, so oldest becomes \"ada\"." },
              { id: "C", text: "null", explanationIfWrong: "oldest was initialized to \"\" and updated to \"ada\"." },
              { id: "D", text: "20", explanationIfWrong: "oldest stores the name, not the age." }
            ],
            correctAnswer: "A",
            explanationNote: "Because 20 > -1 is true, both maxAge and oldest are updated to 20 and \"ada\"."
          }
        ]
      },
      {
        heading: "Searching Strings with .contains() & .indexOf()",
        text: "To determine if a substring exists within a String, call 'text.contains(sub)'. To find the exact index position where the substring starts, call 'text.indexOf(sub)'. If the substring is not found, indexOf returns -1.",
        codeSnippet: "public class StringSearch {\n    public static void main(String[] args) {\n        String phrase = \"university of helsinki\";\n        System.out.println(phrase.contains(\"helsinki\"));\n        System.out.println(phrase.indexOf(\"helsinki\"));\n        System.out.println(phrase.indexOf(\"java\"));\n    }\n}",
        terminalOutput: "true\n14\n-1",
        tip: "Checking 'text.indexOf(sub) != -1' is logically identical to 'text.contains(sub)'.",
        mcq: {
          id: "q-3.3-4-v1",
          question: "What does 'text.indexOf(\"zebra\")' return if \"zebra\" is NOT present in 'text'?",
          options: [
            { id: "A", text: "-1", explanationIfWrong: "" },
            { id: "B", text: "0", explanationIfWrong: "0 means the substring is at the very beginning of the string." },
            { id: "C", text: "false", explanationIfWrong: "indexOf returns an int index, not a boolean." },
            { id: "D", text: "StringIndexOutOfBoundsException", explanationIfWrong: "indexOf does not throw an exception when not found; it returns -1." }
          ],
          correctAnswer: "A",
          explanationNote: "In Java, '.indexOf()' returns -1 as a sentinel value whenever the substring cannot be located."
        },
        questionPool: [
          {
            id: "q-3.3-4-v2",
            question: "What does \"banana\".indexOf(\"a\") return?",
            options: [
              { id: "A", text: "1 (the index of the FIRST occurrence)", explanationIfWrong: "" },
              { id: "B", text: "3 (the second occurrence)", explanationIfWrong: "indexOf returns the first occurrence." },
              { id: "C", text: "5 (the last occurrence)", explanationIfWrong: "lastIndexOf returns the last occurrence." },
              { id: "D", text: "3 (the total count of 'a's)", explanationIfWrong: "indexOf returns a position, not a count." }
            ],
            correctAnswer: "A",
            explanationNote: "In \"banana\", the first 'a' is at index 1 ('b' is index 0)."
          }
        ]
      },
      {
        heading: "String Length vs Array Length vs List Size",
        text: "One of the most common pitfalls in Java is keeping the length/size properties straight: 1) String uses method '.length()', 2) Array uses field '.length' (no parentheses), and 3) ArrayList uses method '.size()'.",
        codeSnippet: "import java.util.ArrayList;\n\npublic class LengthComparison {\n    public static void main(String[] args) {\n        String str = \"Java\";\n        int[] arr = { 1, 2, 3 };\n        ArrayList<String> list = new ArrayList<>();\n        list.add(\"A\");\n\n        System.out.println(str.length()); // 4\n        System.out.println(arr.length);   // 3\n        System.out.println(list.size());   // 1\n    }\n}",
        terminalOutput: "4\n3\n1",
        tip: "Commit this rule to memory: String has length(), Array has length, Collection has size().",
        mcq: {
          id: "q-3.3-5-v1",
          question: "Which of the following correctly pairs each Java type with its sizing syntax?",
          options: [
            { id: "A", text: "String: .length() | Array: .length | ArrayList: .size()", explanationIfWrong: "" },
            { id: "B", text: "String: .size() | Array: .length() | ArrayList: .length", explanationIfWrong: "Mismatched." },
            { id: "C", text: "String: .length | Array: .size() | ArrayList: .length()", explanationIfWrong: "Mismatched." },
            { id: "D", text: "All three use .count()", explanationIfWrong: "Java does not use .count() for these." }
          ],
          correctAnswer: "A",
          explanationNote: "String uses method .length(), Array uses property .length, and ArrayList uses method .size()."
        },
        questionPool: [
          {
            id: "q-3.3-5-v2",
            question: "What is \"\".length() on an empty string?",
            options: [
              { id: "A", text: "0", explanationIfWrong: "" },
              { id: "B", text: "null", explanationIfWrong: "length() returns a primitive int." },
              { id: "C", text: "-1", explanationIfWrong: "Length is non-negative." },
              { id: "D", text: "NullPointerException", explanationIfWrong: "\"\" is an instantiated empty string, not null." }
            ],
            correctAnswer: "A",
            explanationNote: "An empty string contains 0 characters, so its .length() is 0."
          }
        ]
      }
    ]
  }
];

// Helper functions matching Python Part 3 mechanics

export function getActiveQuestionsForLevelPart3(
  section: SectionContent,
  studentId: string,
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part3_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart3(studentId: string): number {
  try {
    const key = `dopilot_java_part3_consecutive_failures_${studentId}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart3(studentId: string): void {
  try {
    localStorage.setItem(`dopilot_java_part3_consecutive_failures_${studentId}`, '0');
  } catch {}
}

export function setLevelAttemptCountPart3(sectionId: string, studentId: string, count: number): void {
  try {
    localStorage.setItem(`dopilot_java_part3_attempt_${studentId}_${sectionId}`, String(count));
  } catch {}
}

export function getLevelAttemptCountPart3(sectionId: string, studentId: string): number {
  try {
    const raw = localStorage.getItem(`dopilot_java_part3_attempt_${studentId}_${sectionId}`);
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart3 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart3(
  sectionId: string,
  studentId: string,
  isPassed: boolean
): AttemptResultPart3 {
  const attemptKey = `dopilot_java_part3_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part3_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part3_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = localStorage.getItem(attemptKey);
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart3(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart3(studentId);
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
