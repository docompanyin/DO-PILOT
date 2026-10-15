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

export const PART_6_SECTIONS: SectionContent[] = [
  {
    id: "6-1-list-on-object",
    number: "6.1",
    title: "Objects on a List and a List on an Object",
    subtitle: "Encapsulate dynamic collections inside domain classes, aggregate calculations, and build rich object hierarchies.",
    readTime: "25 min",
    objectives: [
      "Declare and initialize an ArrayList as an instance variable inside a custom class",
      "Encapsulate collection operations (add, count, search, average) within domain methods",
      "Calculate aggregated metrics (total weight, average score) across contained objects",
      "Format and print multi-item collections from an object's toString() method",
      "Maintain strict encapsulation by avoiding exposing raw internal list references",
      "Construct layered real-world models (e.g. Package of Gifts, Playlist of Songs)"
    ],
    theoryBlocks: [
      {
        heading: "ArrayList as an Instance Variable",
        text: "Just as a class can have primitive variables or single object references, it can have an entire collection as an instance variable. For example, a 'Playlist' class can contain an 'ArrayList<Song>' to manage its songs. The list is initialized in the constructor so it is ready to receive items.",
        codeSnippet: "import java.util.ArrayList;\n\npublic class Playlist {\n    private String name;\n    private ArrayList<Song> songs;\n\n    public Playlist(String name) {\n        this.name = name;\n        this.songs = new ArrayList<>(); // Initialized once per playlist instance\n    }\n\n    public void addSong(Song song) {\n        this.songs.add(song);\n    }\n}",
        terminalOutput: "Playlist rock = new Playlist(\"Classic Rock\");\nrock.addSong(new Song(\"Bohemian Rhapsody\", 354));",
        tip: "Always instantiate the collection in the constructor: 'this.songs = new ArrayList<>();' to prevent NullPointerExceptions when calling addSong().",
        warning: "Never declare the ArrayList as static unless the list is intended to be shared identically across all playlist instances.",
        mcq: {
          id: "j6-1-1",
          question: "Where should an ArrayList instance variable (e.g. 'private ArrayList<Song> songs;') typically be instantiated with 'new ArrayList<>()'?",
          options: [
            { id: "A", text: "Inside the class constructor, ensuring each newly created object has its own dedicated empty list", explanationIfWrong: "" },
            { id: "B", text: "Inside every method that reads the list", explanationIfWrong: "Instantiating in every read method would wipe out existing items with a blank list." },
            { id: "C", text: "In a separate text file on the hard drive", explanationIfWrong: "Object instantiation happens in Java source code." },
            { id: "D", text: "Only inside static methods", explanationIfWrong: "Instance variables belong to constructors and instance methods." }
          ],
          correctAnswer: "A",
          explanationNote: "Instantiating the list inside the constructor guarantees every object instance possesses its own distinct collection."
        },
        questionPool: [
          {
            id: "j6-1-1-alt1",
            question: "What happens if a class declares 'private ArrayList<Song> songs;' but forgets to instantiate it with 'new ArrayList<>()' before calling 'songs.add(s)'?",
            options: [
              { id: "A", text: "A NullPointerException is thrown at runtime because 'songs' is null", explanationIfWrong: "" },
              { id: "B", text: "Java creates an array of size 10 automatically", explanationIfWrong: "Java does not automatically instantiate null object reference fields." },
              { id: "C", text: "The song is discarded silently", explanationIfWrong: "Dereferencing null throws an exception immediately." },
              { id: "D", text: "The code will not compile", explanationIfWrong: "Uninitialized fields compile fine; the crash happens at runtime." }
            ],
            correctAnswer: "A",
            explanationNote: "Reference variables default to null. Calling any method on null throws NullPointerException."
          },
          {
            id: "j6-1-1-alt2",
            question: "Why is encapsulating an ArrayList inside a class better than exposing a raw public ArrayList directly?",
            options: [
              { id: "A", text: "The containing class can validate additions, enforce business rules, and hide storage details from external code", explanationIfWrong: "" },
              { id: "B", text: "Raw ArrayLists cannot hold custom objects", explanationIfWrong: "ArrayLists can hold any custom objects." },
              { id: "C", text: "Public ArrayLists compile 50% slower", explanationIfWrong: "Access modifiers govern visibility, not compiler speed." },
              { id: "D", text: "Encapsulation converts the list to a fixed array", explanationIfWrong: "Encapsulation preserves the dynamic collection while protecting it." }
            ],
            correctAnswer: "A",
            explanationNote: "Encapsulation protects the collection from unauthorized external tampering and centralizes domain validation."
          }
        ]
      },
      {
        heading: "Aggregating Data from Contained Objects",
        text: "A frequent responsibility of an object containing a list is computing aggregated metrics across its items. For example, a 'Package' containing an 'ArrayList<Gift>' can compute the total weight of all gifts by iterating through the list and summing each gift's weight.",
        codeSnippet: "public class Package {\n    private ArrayList<Gift> gifts = new ArrayList<>();\n\n    public void addGift(Gift gift) {\n        this.gifts.add(gift);\n    }\n\n    public int totalWeight() {\n        int sum = 0;\n        for (Gift gift : this.gifts) {\n            sum += gift.getWeight();\n        }\n        return sum;\n    }\n}",
        terminalOutput: "Package pkg = new Package();\npkg.addGift(new Gift(\"Book\", 2));\npkg.addGift(new Gift(\"Laptop\", 3));\nSystem.out.println(pkg.totalWeight()); // 5",
        tip: "By calculating totalWeight() in Package, callers never need to know how the gifts are stored or looped over.",
        warning: "Return 0 if the list is empty rather than throwing an exception.",
        mcq: {
          id: "j6-1-2",
          question: "How does the 'totalWeight()' method in Package compute the combined weight of all gifts?",
          options: [
            { id: "A", text: "It initializes an accumulator sum to 0, loops through each Gift in the list, and adds gift.getWeight() to the sum", explanationIfWrong: "" },
            { id: "B", text: "It multiplies gifts.size() by 100", explanationIfWrong: "Gifts have varying individual weights." },
            { id: "C", text: "It calls Math.sum(gifts)", explanationIfWrong: "Math.sum does not exist in java.lang.Math." },
            { id: "D", text: "It converts all gifts into integer primitives", explanationIfWrong: "It accesses each gift's getter via the loop." }
          ],
          correctAnswer: "A",
          explanationNote: "Looping with an accumulator variable summing getter return values is the standard aggregation pattern."
        },
        questionPool: [
          {
            id: "j6-1-2-alt1",
            question: "What will 'totalWeight()' return if a Package has had no gifts added to it?",
            options: [
              { id: "A", text: "0", explanationIfWrong: "" },
              { id: "B", text: "-1", explanationIfWrong: "The accumulator starts at 0 and the loop doesn't execute." },
              { id: "C", text: "NullPointerException", explanationIfWrong: "The list is initialized and empty, so the loop safely executes 0 times." },
              { id: "D", text: "IndexOutOfBoundsException", explanationIfWrong: "For-each loops handle empty collections gracefully." }
            ],
            correctAnswer: "A",
            explanationNote: "For an empty list, the for-each loop executes 0 times and the initial sum of 0 is returned."
          },
          {
            id: "j6-1-2-alt2",
            question: "How would you compute the average weight of gifts in the Package class?",
            options: [
              { id: "A", text: "If gifts.isEmpty() return 0; otherwise return (double) this.totalWeight() / this.gifts.size();", explanationIfWrong: "" },
              { id: "B", text: "Divide totalWeight() by 2", explanationIfWrong: "You must divide by the actual number of gifts (size)." },
              { id: "C", text: "Write gifts.average()", explanationIfWrong: "ArrayList does not have a built-in average() method." },
              { id: "D", text: "Return (int) totalWeight()", explanationIfWrong: "Averages generally require decimal precision (double)." }
            ],
            correctAnswer: "A",
            explanationNote: "Check for empty to avoid division by zero, then divide totalWeight by list size with floating-point casting."
          }
        ]
      },
      {
        heading: "Searching Inside an Object's Collection",
        text: "Classes that hold collections often provide query methods to look up specific contained items. For example, a 'Menu' can check if a meal is already on the menu using contains(), or a 'GradeRegister' can count how many students received a grade 5.",
        codeSnippet: "public class Menu {\n    private ArrayList<String> meals = new ArrayList<>();\n\n    public void addMeal(String meal) {\n        if (!this.meals.contains(meal)) {\n            this.meals.add(meal);\n        }\n    }\n\n    public void clearMenu() {\n        this.meals.clear();\n    }\n}",
        terminalOutput: "Menu menu = new Menu();\nmenu.addMeal(\"Pasta\");\nmenu.addMeal(\"Pasta\"); // Ignored! No duplicates allowed.",
        tip: "Using '!this.meals.contains(meal)' inside addMeal() ensures the menu contains only unique meals.",
        warning: "When using contains() on custom objects, ensure the object class overrides equals() properly.",
        mcq: {
          id: "j6-1-3",
          question: "What does 'menu.addMeal(\"Pasta\")' do if \"Pasta\" is already in the Menu's meals list in the code above?",
          options: [
            { id: "A", text: "It skips adding the meal because '!this.meals.contains(meal)' evaluates to false", explanationIfWrong: "" },
            { id: "B", text: "It replaces the existing \"Pasta\" with a new copy", explanationIfWrong: "The if-condition bypasses the add call entirely." },
            { id: "C", text: "It throws a DuplicateItemException", explanationIfWrong: "No exception is thrown; it simply ignores duplicates." },
            { id: "D", text: "It appends \"Pasta 2\"", explanationIfWrong: "No string renaming occurs." }
          ],
          correctAnswer: "A",
          explanationNote: "Because contains(\"Pasta\") is true, !contains evaluates to false and the add call is skipped."
        },
        questionPool: [
          {
            id: "j6-1-3-alt1",
            question: "What does the 'meals.clear()' method do in ArrayList?",
            options: [
              { id: "A", text: "Removes all elements from the list, resetting its size to 0", explanationIfWrong: "" },
              { id: "B", text: "Deletes the ArrayList from memory", explanationIfWrong: "The list object remains, but its elements are cleared." },
              { id: "C", text: "Replaces every element with null", explanationIfWrong: "clear() removes elements, it does not fill with nulls." },
              { id: "D", text: "Converts strings to uppercase", explanationIfWrong: "clear() empties the collection." }
            ],
            correctAnswer: "A",
            explanationNote: "clear() removes all items from the collection, making size() return 0."
          },
          {
            id: "j6-1-3-alt2",
            question: "How can you find a Book by title in a 'Library' class holding 'ArrayList<Book> books'?",
            options: [
              { id: "A", text: "Loop through books with for-each and return the book if book.getTitle().equalsIgnoreCase(title)", explanationIfWrong: "" },
              { id: "B", text: "Write books.find(title)", explanationIfWrong: "ArrayList does not have a find(String) method." },
              { id: "C", text: "Call books.get(title)", explanationIfWrong: "ArrayList.get() takes an int index, not a String title." },
              { id: "D", text: "Convert the library to a CSV file", explanationIfWrong: "Linear search in memory is immediate." }
            ],
            correctAnswer: "A",
            explanationNote: "Iterating through the list and matching titles with equalsIgnoreCase() is standard linear search."
          }
        ]
      },
      {
        heading: "Formatting and Printing Collections in toString()",
        text: "When overriding toString() for a class containing a list, you can format every contained object into a neat multi-line representation using a loop or String building.",
        codeSnippet: "public class Playlist {\n    private String name;\n    private ArrayList<Song> songs = new ArrayList<>();\n\n    public String toString() {\n        String result = \"Playlist: \" + this.name + \" (\" + this.songs.size() + \" songs)\\n\";\n        for (Song song : this.songs) {\n            result += \" - \" + song + \"\\n\";\n        }\n        return result;\n    }\n}",
        terminalOutput: "Playlist: Summer Vibes (2 songs)\n - Sun Is Shining (3:15)\n - Ocean Breeze (4:02)\n",
        tip: "Each 'song' in 'result += song' automatically calls Song's toString() method.",
        warning: "Remember that string concatenation in loops creates temporary strings. For very large lists (thousands of items), StringBuilder is preferred.",
        mcq: {
          id: "j6-1-4",
          question: "When 'result += \" - \" + song + \"\\n\";' executes, how is the 'song' object converted to text?",
          options: [
            { id: "A", text: "Java automatically invokes song.toString() to retrieve its formatted string representation", explanationIfWrong: "" },
            { id: "B", text: "Java prints the song's hard drive path", explanationIfWrong: "Objects in memory do not have hard drive paths." },
            { id: "C", text: "A compilation error occurs unless you write (String) song", explanationIfWrong: "String concatenation (+) automatically invokes toString()." },
            { id: "D", text: "The song's memory address is concatenated as hex", explanationIfWrong: "If Song overrides toString(), its custom string is used." }
          ],
          correctAnswer: "A",
          explanationNote: "String concatenation automatically invokes the toString() method on any object operand."
        },
        questionPool: [
          {
            id: "j6-1-4-alt1",
            question: "What class is recommended in Java for high-performance string accumulation inside large loops?",
            options: [
              { id: "A", text: "StringBuilder", explanationIfWrong: "" },
              { id: "B", text: "StringConcatFactory", explanationIfWrong: "StringBuilder is the standard developer utility for mutable string building." },
              { id: "C", text: "ArrayBuffer", explanationIfWrong: "ArrayBuffer is not a standard Java text class." },
              { id: "D", text: "CharStream", explanationIfWrong: "StringBuilder provides .append() for accumulating text." }
            ],
            correctAnswer: "A",
            explanationNote: "StringBuilder avoids creating temporary intermediate string objects during repetitive concatenation."
          },
          {
            id: "j6-1-4-alt2",
            question: "What will Playlist's toString() return if no songs have been added yet?",
            options: [
              { id: "A", text: "\"Playlist: \" + name + \" (0 songs)\\n\"", explanationIfWrong: "" },
              { id: "B", text: "null", explanationIfWrong: "The result string is initialized and returned." },
              { id: "C", text: "IndexOutOfBoundsException", explanationIfWrong: "The loop simply executes zero times." },
              { id: "D", text: "Empty string \"\"", explanationIfWrong: "The header string is present." }
            ],
            correctAnswer: "A",
            explanationNote: "The header line is created and the loop over the empty list finishes without appending song rows."
          }
        ]
      },
      {
        heading: "Complex Domain Relationships: GradeRegister Example",
        text: "Realistic applications often involve multiple lists or domain objects coordinating complex tasks. In Helsinki MOOC's 'GradeRegister', one list stores exam points while another stores calculated grade distributions (grades 0 to 5). Methods convert points to grades (e.g. 50-59 points = grade 1) and calculate averages.",
        codeSnippet: "public class GradeRegister {\n    private ArrayList<Integer> grades = new ArrayList<>();\n\n    public void addGradeBasedOnPoints(int points) {\n        this.grades.add(pointsToGrade(points));\n    }\n\n    public static int pointsToGrade(int points) {\n        if (points < 50) return 0;\n        if (points < 60) return 1;\n        if (points < 70) return 2;\n        if (points < 80) return 3;\n        if (points < 90) return 4;\n        return 5;\n    }\n}",
        terminalOutput: "GradeRegister reg = new GradeRegister();\nreg.addGradeBasedOnPoints(82); // Grade 4 added to list",
        tip: "Static helper methods like 'pointsToGrade(int points)' are easy to test with simple inputs and expected outputs.",
        warning: "Always test boundary conditions: exactly 50 points, 60 points, etc.",
        mcq: {
          id: "j6-1-5",
          question: "Given 'pointsToGrade(70)', what grade is returned according to the logic above?",
          options: [
            { id: "A", text: "3", explanationIfWrong: "" },
            { id: "B", text: "2", explanationIfWrong: "points < 70 returns 2, so 70 is not < 70; it falls through to points < 80 which returns 3." },
            { id: "C", text: "4", explanationIfWrong: "70 is less than 80, returning 3." },
            { id: "D", text: "0", explanationIfWrong: "70 is well above failing threshold." }
          ],
          correctAnswer: "A",
          explanationNote: "70 is not < 70 (so it doesn't return 2). It satisfies 70 < 80, returning grade 3."
        },
        questionPool: [
          {
            id: "j6-1-5-alt1",
            question: "Why is 'pointsToGrade' declared as 'static' in GradeRegister?",
            options: [
              { id: "A", text: "Because it computes a grade purely from the 'points' parameter without needing any instance variable state", explanationIfWrong: "" },
              { id: "B", text: "Because static methods run in the GPU", explanationIfWrong: "Static methods execute on the CPU." },
              { id: "C", text: "Because it cannot be called outside the class", explanationIfWrong: "It is public static, so it can be called anywhere." },
              { id: "D", text: "Because it modifies all grades across all registers", explanationIfWrong: "It does not modify anything; it's a pure conversion function." }
            ],
            correctAnswer: "A",
            explanationNote: "Methods that depend solely on their input parameters and do not inspect instance fields should be declared static."
          },
          {
            id: "j6-1-5-alt2",
            question: "What does 'pointsToGrade(49)' return?",
            options: [
              { id: "A", text: "0", explanationIfWrong: "" },
              { id: "B", text: "1", explanationIfWrong: "49 is strictly less than 50, which triggers the first if condition returning 0." },
              { id: "C", text: "-1", explanationIfWrong: "The failing grade is 0." },
              { id: "D", text: "5", explanationIfWrong: "49 is failing." }
            ],
            correctAnswer: "A",
            explanationNote: "49 satisfies 'points < 50', immediately returning 0."
          }
        ]
      },
      {
        heading: "Protecting Contained Collections (Defensive Copying)",
        text: "When exposing items from an internal list, returning a copy or unmodifiable view prevents external code from corrupting your internal state. If a caller calls 'register.getGrades().clear()', an encapsulated class should remain unaffected.",
        codeSnippet: "public class GradeRegister {\n    private ArrayList<Integer> grades = new ArrayList<>();\n\n    public ArrayList<Integer> getGrades() {\n        return new ArrayList<>(this.grades); // Defensive copy\n    }\n}",
        terminalOutput: "ArrayList<Integer> copy = register.getGrades();\ncopy.clear(); // register.getGrades() STILL has all grades intact!",
        tip: "Alternatively, use 'Collections.unmodifiableList(this.grades)' to return a read-only view that throws an exception if modification is attempted.",
        warning: "Never return 'return this.grades;' directly if external code should not have write permissions.",
        mcq: {
          id: "j6-1-6",
          question: "What happens if external code executes 'register.getGrades().clear()' when getGrades() returns 'new ArrayList<>(this.grades)'?",
          options: [
            { id: "A", text: "Only the copy list is cleared; the internal 'grades' list inside GradeRegister remains completely untouched", explanationIfWrong: "" },
            { id: "B", text: "The internal 'grades' list inside GradeRegister is emptied", explanationIfWrong: "Because a new ArrayList was returned, only that copy was cleared." },
            { id: "C", text: "An UnsupportedOperationException is thrown", explanationIfWrong: "The copy is a standard mutable ArrayList, so clear() succeeds on the copy." },
            { id: "D", text: "The JVM terminates", explanationIfWrong: "Standard collection operation." }
          ],
          correctAnswer: "A",
          explanationNote: "Defensive copying isolates external modifications to the copy, leaving the class's internal state safe."
        },
        questionPool: [
          {
            id: "j6-1-6-alt1",
            question: "What utility method in 'java.util.Collections' produces a read-only list view that throws an exception on add/remove?",
            options: [
              { id: "A", text: "Collections.unmodifiableList(list)", explanationIfWrong: "" },
              { id: "B", text: "Collections.lockList(list)", explanationIfWrong: "There is no lockList method." },
              { id: "C", text: "list.makeReadOnly()", explanationIfWrong: "ArrayList does not have a makeReadOnly() method." },
              { id: "D", text: "Collections.freeze(list)", explanationIfWrong: "Use Collections.unmodifiableList()." }
            ],
            correctAnswer: "A",
            explanationNote: "Collections.unmodifiableList(list) wraps a list in an unmodifiable wrapper that rejects mutating calls."
          },
          {
            id: "j6-1-6-alt2",
            question: "Why is encapsulation essential in large team codebases?",
            options: [
              { id: "A", text: "It prevents team members from inadvertently corrupting class state, making each module reliable and predictable", explanationIfWrong: "" },
              { id: "B", text: "Because it makes compilation faster", explanationIfWrong: "Encapsulation is an architecture principle, not a build speed hack." },
              { id: "C", text: "Because Java requires all variables to be public otherwise", explanationIfWrong: "Java encourages private instance variables." },
              { id: "D", text: "It reduces memory on the GPU", explanationIfWrong: "No GPU involvement." }
            ],
            correctAnswer: "A",
            explanationNote: "Encapsulation ensures classes maintain their internal invariants without unexpected external interference."
          }
        ]
      }
    ]
  },
  {
    id: "6-2-separating-ui",
    number: "6.2",
    title: "Separating the User Interface from Program Logic",
    subtitle: "Architect software into clean layers: isolating UI input/output from business domain logic and command loops.",
    readTime: "25 min",
    objectives: [
      "Understand the architectural separation between presentation (UI) and core business logic",
      "Build a dedicated UserInterface class that accepts Scanner and domain model dependencies",
      "Implement an interactive command loop: read command, execute action, break on 'stop'",
      "Prevent console printing and input reading inside core domain classes",
      "Explain how UI separation allows effortless transitions to GUI, Web, or Mobile platforms"
    ],
    theoryBlocks: [
      {
        heading: "Why Separate User Interface and Program Logic?",
        text: "A fundamental rule of professional software design is separation of concerns. Program logic (e.g. WordSet, TodoList) should only manage data and computations; it should NOT read from Scanner or print to System.out. A dedicated UserInterface class handles user interaction and calls methods on the domain logic.",
        codeSnippet: "// Domain Model (PURE LOGIC, NO SCANNER OR PRINTLN):\npublic class WordSet {\n    private ArrayList<String> words = new ArrayList<>();\n\n    public void add(String word) {\n        this.words.add(word);\n    }\n\n    public boolean contains(String word) {\n        return this.words.contains(word);\n    }\n}",
        terminalOutput: "// WordSet has NO Scanner and NO System.out.println()!",
        tip: "If domain logic contains no printing or scanning, you can reuse the exact same WordSet class in a console app, a web app, or an Android app without changing a single line.",
        warning: "Never put 'Scanner scanner = new Scanner(System.in)' inside your core data models.",
        mcq: {
          id: "j6-2-1",
          question: "Why should domain logic classes (like WordSet or BankAccount) avoid using Scanner and System.out.println directly?",
          options: [
            { id: "A", text: "To decouple data and business rules from the user interface, making domain logic reusable, testable, and independent of presentation format", explanationIfWrong: "" },
            { id: "B", text: "Because Java forbids System.out outside of the main method", explanationIfWrong: "System.out compiles anywhere, but putting it in domain classes violates clean architecture." },
            { id: "C", text: "Because Scanner consumes 1 GB of memory if imported in multiple files", explanationIfWrong: "Scanner is lightweight; the reason is design purity and separation of concerns." },
            { id: "D", text: "Because print statements delete objects from the heap", explanationIfWrong: "Printing has no effect on heap memory." }
          ],
          correctAnswer: "A",
          explanationNote: "Separating domain logic from UI makes your code testable, modular, and reusable across web, mobile, and desktop environments."
        },
        questionPool: [
          {
            id: "j6-2-1-alt1",
            question: "What design principle states that each class should have only one reason to change (e.g. UI changes vs business logic changes)?",
            options: [
              { id: "A", text: "Single Responsibility Principle (SRP)", explanationIfWrong: "" },
              { id: "B", text: "Open Loop Polymorphism", explanationIfWrong: "Not a real principle." },
              { id: "C", text: "Liskov Substitution only", explanationIfWrong: "LSP deals with subtyping, not single responsibility." },
              { id: "D", text: "Binary Separation Theorem", explanationIfWrong: "Not a software engineering principle." }
            ],
            correctAnswer: "A",
            explanationNote: "The Single Responsibility Principle (SRP) states that a class should have one, and only one, reason to change."
          },
          {
            id: "j6-2-1-alt2",
            question: "If you decide to replace a console interface with a web browser interface, which classes need modification if UI is properly separated?",
            options: [
              { id: "A", text: "Only the UI layer; the domain logic classes remain 100% untouched", explanationIfWrong: "" },
              { id: "B", text: "Every class in the entire codebase must be rewritten from scratch", explanationIfWrong: "Clean architecture prevents cascading rewrites." },
              { id: "C", text: "Only classes that extend ArrayList", explanationIfWrong: "Domain models don't need changes." },
              { id: "D", text: "Only static methods", explanationIfWrong: "Only the presentation layer changes." }
            ],
            correctAnswer: "A",
            explanationNote: "Decoupling ensures that swapping the presentation layer requires zero changes to the underlying business models."
          }
        ]
      },
      {
        heading: "Designing the UserInterface Class",
        text: "The UserInterface class receives its dependencies (the Scanner and the domain model) through its constructor. It typically exposes a single public method: 'start()', which runs the interactive loop.",
        codeSnippet: "import java.util.Scanner;\n\npublic class UserInterface {\n    private WordSet wordSet;\n    private Scanner scanner;\n\n    public UserInterface(WordSet wordSet, Scanner scanner) {\n        this.wordSet = wordSet;\n        this.scanner = scanner;\n    }\n\n    public void start() {\n        // Interactive loop logic goes here\n    }\n}",
        terminalOutput: "// Dependencies are cleanly injected through the constructor",
        tip: "Passing dependencies like Scanner into the constructor is known as Dependency Injection. It makes testing with simulated inputs effortless!",
        warning: "Do not create a new Scanner(System.in) inside UserInterface if one is already passed in constructor.",
        mcq: {
          id: "j6-2-2",
          question: "What is the technique called where dependencies (like Scanner and WordSet) are passed into a class's constructor from the outside?",
          options: [
            { id: "A", text: "Dependency Injection", explanationIfWrong: "" },
            { id: "B", text: "Recursive Delegation", explanationIfWrong: "Dependency Injection refers to supplying objects to a class rather than having the class construct them itself." },
            { id: "C", text: "Static Inversion", explanationIfWrong: "Dependency Injection is the industry-standard term." },
            { id: "D", text: "Variable Shadowing", explanationIfWrong: "Shadowing refers to naming collisions." }
          ],
          correctAnswer: "A",
          explanationNote: "Dependency injection supplies external collaborators to a class, improving flexibility, testability, and modularity."
        },
        questionPool: [
          {
            id: "j6-2-2-alt1",
            question: "How does injecting a Scanner into UserInterface make automated testing easier?",
            options: [
              { id: "A", text: "You can pass a Scanner reading from a String rather than System.in to simulate user keystrokes in tests", explanationIfWrong: "" },
              { id: "B", text: "It forces the Scanner to read only numbers", explanationIfWrong: "Scanner can read any text." },
              { id: "C", text: "It doubles the execution speed of the JVM", explanationIfWrong: "Testing flexibility is the primary benefit." },
              { id: "D", text: "It disables all keyboard events on the OS", explanationIfWrong: "It provides simulated input strings for testing." }
            ],
            correctAnswer: "A",
            explanationNote: "By injecting Scanner, automated unit tests can pass 'new Scanner(\"add\\ntest\\nstop\")' to test the UI automatically."
          },
          {
            id: "j6-2-2-alt2",
            question: "What code should be in 'main()' when using a separate UserInterface class?",
            options: [
              { id: "A", text: "Scanner scanner = new Scanner(System.in); WordSet set = new WordSet(); UserInterface ui = new UserInterface(set, scanner); ui.start();", explanationIfWrong: "" },
              { id: "B", text: "All 500 lines of application logic directly inside main()", explanationIfWrong: "Main should only assemble dependencies and kick off execution." },
              { id: "C", text: "System.exit(0);", explanationIfWrong: "Main must initialize the application." },
              { id: "D", text: "Just import statements", explanationIfWrong: "Executable code must be in main()." }
            ],
            correctAnswer: "A",
            explanationNote: "Main's role in clean architecture is simply composing the components and launching the UI via ui.start()."
          }
        ]
      },
      {
        heading: "The Command Loop Architecture",
        text: "The start() method usually runs a while (true) loop that prompts the user for a command. It reads the command, evaluates it using if-else statements, calls corresponding methods on the domain model, and breaks out of the loop when the exit command (e.g. \"stop\") is entered.",
        codeSnippet: "public void start() {\n    while (true) {\n        System.out.print(\"Command: \");\n        String command = scanner.nextLine();\n\n        if (command.equals(\"stop\")) {\n            break;\n        }\n\n        if (command.equals(\"add\")) {\n            System.out.print(\"Word: \");\n            String word = scanner.nextLine();\n            this.wordSet.add(word);\n        } else {\n            System.out.println(\"Unknown command\");\n        }\n    }\n    System.out.println(\"Bye bye!\");\n}",
        terminalOutput: "Command: add\nWord: Java\nCommand: stop\nBye bye!",
        tip: "Keep individual command actions concise. If a command involves multiple steps, extract it into a private helper method like 'addWord()'.",
        warning: "Always use .equals() or .equalsIgnoreCase() to compare command strings, never '=='.",
        mcq: {
          id: "j6-2-3",
          question: "What statement terminates the while (true) command loop when the user enters \"stop\"?",
          options: [
            { id: "A", text: "break;", explanationIfWrong: "" },
            { id: "B", text: "continue;", explanationIfWrong: "'continue' skips to the next iteration; 'break' exits the loop." },
            { id: "C", text: "System.gc();", explanationIfWrong: "System.gc requests garbage collection, it does not stop loops." },
            { id: "D", text: "return 0;", explanationIfWrong: "void methods cannot return values; break cleanly exits loops." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'break;' statement exits the innermost enclosing loop immediately."
        },
        questionPool: [
          {
            id: "j6-2-3-alt1",
            question: "Why is decomposing complex command branches into private helper methods (e.g. 'private void processAdd()') beneficial?",
            options: [
              { id: "A", text: "It prevents the start() method from growing into an unreadable monster method with dozens of nested blocks", explanationIfWrong: "" },
              { id: "B", text: "Because while loops cannot contain more than 10 lines in Java", explanationIfWrong: "While loops have no line limit." },
              { id: "C", text: "It creates new threads for every command", explanationIfWrong: "Methods execute synchronously on the current thread." },
              { id: "D", text: "It allows primitives to hold null", explanationIfWrong: "Primitives never hold null." }
            ],
            correctAnswer: "A",
            explanationNote: "Extracting command branches into helper methods keeps the main command loop concise and readable."
          },
          {
            id: "j6-2-3-alt2",
            question: "What happens if a user types \"add\" but the code checks 'command == \"add\"'?",
            options: [
              { id: "A", text: "The check fails (returns false) because user input is a newly allocated heap string with a different memory address", explanationIfWrong: "" },
              { id: "B", text: "It matches perfectly every time", explanationIfWrong: "'==' tests reference equality, not character content." },
              { id: "C", text: "A NullPointerException is thrown", explanationIfWrong: "'command' is non-null." },
              { id: "D", text: "The loop terminates instantly", explanationIfWrong: "It falls through to the 'Unknown command' block." }
            ],
            correctAnswer: "A",
            explanationNote: "Comparing user input strings with '==' fails because user input strings reside at distinct heap addresses. Always use .equals()."
          }
        ]
      },
      {
        heading: "Handling User Input Errors Gracefully",
        text: "In user-facing applications, users will enter invalid commands, missing files, or letters when numbers are expected. The UI layer is responsible for intercepting these input errors with validation or try-catch blocks without crashing the domain logic.",
        codeSnippet: "public void processAdd() {\n    System.out.print(\"Enter item name: \");\n    String name = scanner.nextLine();\n    if (name.trim().isEmpty()) {\n        System.out.println(\"Item name cannot be empty!\");\n        return;\n    }\n    this.todoList.add(name);\n}",
        terminalOutput: "Enter item name: \nItem name cannot be empty!",
        tip: "Validate inputs in the UI before passing them to the domain model to keep the domain model clean.",
        warning: "Never allow uncaught NumberFormatExceptions from scanner input to terminate the entire application.",
        mcq: {
          id: "j6-2-4",
          question: "Which layer of the software is primarily responsible for validating that user keystrokes are well-formed before invoking business actions?",
          options: [
            { id: "A", text: "The User Interface (UI) layer", explanationIfWrong: "" },
            { id: "B", text: "The Java Virtual Machine garbage collector", explanationIfWrong: "The GC manages memory, not user input validation." },
            { id: "C", text: "The computer's operating system BIOS", explanationIfWrong: "Input parsing is handled by the application UI layer." },
            { id: "D", text: "The CPU arithmetic logic unit", explanationIfWrong: "Application code in the UI validates input." }
          ],
          correctAnswer: "A",
          explanationNote: "The UI layer interfaces with the human operator and ensures inputs are formatted properly before domain methods are invoked."
        },
        questionPool: [
          {
            id: "j6-2-4-alt1",
            question: "How can the UI safely read an integer without crashing if the user enters letters like \"abc\"?",
            options: [
              { id: "A", text: "Wrap Integer.valueOf(scanner.nextLine()) in a try-catch block catching NumberFormatException", explanationIfWrong: "" },
              { id: "B", text: "Use scanner.readOnlyNumbers()", explanationIfWrong: "readOnlyNumbers is not a method in Scanner." },
              { id: "C", text: "Cast the string to int using (int)", explanationIfWrong: "Strings cannot be cast to int directly." },
              { id: "D", text: "Disable the keyboard", explanationIfWrong: "Catching NumberFormatException is the standard, safe pattern." }
            ],
            correctAnswer: "A",
            explanationNote: "Catching NumberFormatException allows prompting the user again instead of abruptly crashing."
          },
          {
            id: "j6-2-4-alt2",
            question: "What does 'name.trim().isEmpty()' check for?",
            options: [
              { id: "A", text: "Whether the string consists entirely of whitespace or is completely empty", explanationIfWrong: "" },
              { id: "B", text: "Whether the string has more than 10 characters", explanationIfWrong: "trim() strips leading/trailing whitespace, and isEmpty() checks if length is 0." },
              { id: "C", text: "Whether the string contains numbers", explanationIfWrong: "It checks for blank/empty strings." },
              { id: "D", text: "Whether the string was deleted from disk", explanationIfWrong: "It checks string content in memory." }
            ],
            correctAnswer: "A",
            explanationNote: "'trim()' strips leading and trailing whitespace, so trimming a string of spaces yields an empty string."
          }
        ]
      },
      {
        heading: "TodoList Application Example",
        text: "A classic example of UI separation is the TodoList. The 'TodoList' class encapsulates an ArrayList<String>, providing methods: add(task), print(), and remove(number). The 'UserInterface' class translates user commands (\"add\", \"list\", \"remove\", \"stop\") into calls on the TodoList.",
        codeSnippet: "public class TodoList {\n    private ArrayList<String> tasks = new ArrayList<>();\n\n    public void add(String task) {\n        this.tasks.add(task);\n    }\n\n    public void print() {\n        for (int i = 0; i < this.tasks.size(); i++) {\n            System.out.println((i + 1) + \": \" + this.tasks.get(i));\n        }\n    }\n\n    public void remove(int number) {\n        int index = number - 1; // 1-based to 0-based index\n        if (index >= 0 && index < this.tasks.size()) {\n            this.tasks.remove(index);\n        }\n    }\n}",
        terminalOutput: "1: Buy milk\n2: Read Java MOOC",
        tip: "Notice that users think in 1-based numbering (\"remove item 1\"), but ArrayLists use 0-based indexing. The class cleanly translates between them!",
        warning: "Always check that index is within 'index >= 0 && index < tasks.size()' before calling tasks.remove(index).",
        mcq: {
          id: "j6-2-5",
          question: "Why does the remove method calculate 'int index = number - 1;'?",
          options: [
            { id: "A", text: "Because human users expect 1-based numbering (item 1), while Java ArrayLists are 0-based (index 0)", explanationIfWrong: "" },
            { id: "B", text: "Because Java arrays always lose their first element", explanationIfWrong: "Java arrays start at 0, they do not lose elements." },
            { id: "C", text: "To subtract 1 point from the user's score", explanationIfWrong: "It is an index offset adjustment." },
            { id: "D", text: "Because the last item is at index -1", explanationIfWrong: "Java does not support negative indexing like Python." }
          ],
          correctAnswer: "A",
          explanationNote: "Converting 1-based user input to 0-based collection indices is a standard user interface pattern."
        },
        questionPool: [
          {
            id: "j6-2-5-alt1",
            question: "What happens if a user asks to remove item 5 when the TodoList only has 2 tasks, and boundary checks are in place?",
            options: [
              { id: "A", text: "The method safely ignores the request or shows an error message without throwing IndexOutOfBoundsException", explanationIfWrong: "" },
              { id: "B", text: "The entire application crashes with IndexOutOfBoundsException", explanationIfWrong: "The boundary check (index >= 0 && index < size) prevents the crash." },
              { id: "C", text: "All 2 tasks are deleted", explanationIfWrong: "Nothing is deleted when the index is invalid." },
              { id: "D", text: "The JVM restarts", explanationIfWrong: "Boundary checks prevent exceptions." }
            ],
            correctAnswer: "A",
            explanationNote: "Guarding collection access with boundary checks prevents IndexOutOfBoundsException."
          },
          {
            id: "j6-2-5-alt2",
            question: "Why is the print() method numbered as '(i + 1) + \": \" + task'?",
            options: [
              { id: "A", text: "To display human-friendly 1-based numbering starting at 1 rather than 0", explanationIfWrong: "" },
              { id: "B", text: "Because ArrayLists cannot print index 0", explanationIfWrong: "Index 0 is valid, but humans naturally count from 1." },
              { id: "C", text: "Because i + 1 executes faster", explanationIfWrong: "It is purely for presentation aesthetics." },
              { id: "D", text: "To skip the first item", explanationIfWrong: "It prints item 0 as \"1: ...\"." }
            ],
            correctAnswer: "A",
            explanationNote: "Adding 1 to the loop index presents familiar 1-based counting for users."
          }
        ]
      },
      {
        heading: "Architecture of Multi-Class Programs",
        text: "In comprehensive Java programs, classes belong to distinct conceptual roles: 1. Domain Entities (e.g. Task, Song, Person), 2. Containers / Services (e.g. TodoList, Playlist, GradeRegister), 3. User Interface (e.g. UserInterface), and 4. Application Entry Point (Main). This layered architecture keeps projects clean and scalable.",
        codeSnippet: "// Main.java: Assembly and launch\npublic class Main {\n    public static void main(String[] args) {\n        TodoList list = new TodoList();\n        Scanner scanner = new Scanner(System.in);\n        UserInterface ui = new UserInterface(list, scanner);\n        ui.start();\n    }\n}",
        terminalOutput: "// Scalable architecture separating model, controller, and UI",
        tip: "This clean separation is the foundation of the MVC (Model-View-Controller) design pattern used throughout industry software.",
        warning: "Never put business logic in Main. Main should only wire components and start the program.",
        mcq: {
          id: "j6-2-6",
          question: "What is the primary role of the 'Main' class in a clean layered Java application?",
          options: [
            { id: "A", text: "To instantiate the domain models and UI dependencies, wire them together, and launch the user interface", explanationIfWrong: "" },
            { id: "B", text: "To implement all algorithms and database queries directly", explanationIfWrong: "Algorithms and queries belong in domain service classes." },
            { id: "C", text: "To define private instance variables for all other classes", explanationIfWrong: "Each class defines its own instance variables." },
            { id: "D", text: "To recompile the Java bytecode at runtime", explanationIfWrong: "Main executes the pre-compiled bytecode." }
          ],
          correctAnswer: "A",
          explanationNote: "In clean architecture, Main acts as the bootstrap composer, initializing components, wiring dependencies, and calling start()."
        },
        questionPool: [
          {
            id: "j6-2-6-alt1",
            question: "Which of the following classes represents a 'Domain Entity' in a school management system?",
            options: [
              { id: "A", text: "Student", explanationIfWrong: "" },
              { id: "B", text: "Scanner", explanationIfWrong: "Scanner is a built-in I/O utility." },
              { id: "C", text: "UserInterface", explanationIfWrong: "UserInterface belongs to the presentation layer." },
              { id: "D", text: "Main", explanationIfWrong: "Main is the application bootstrap class." }
            ],
            correctAnswer: "A",
            explanationNote: "Student is a core domain entity representing real-world business data and state."
          },
          {
            id: "j6-2-6-alt2",
            question: "What industry architectural pattern mirrors the separation of data models, views, and controllers?",
            options: [
              { id: "A", text: "MVC (Model-View-Controller)", explanationIfWrong: "" },
              { id: "B", text: "Single Thread Isolation", explanationIfWrong: "MVC is the classic architectural pattern for UI separation." },
              { id: "C", text: "Binary Tree Traversal", explanationIfWrong: "That is an algorithm, not an architectural pattern." },
              { id: "D", text: "Primitive Wrapper Inversion", explanationIfWrong: "Not a design pattern." }
            ],
            correctAnswer: "A",
            explanationNote: "MVC separates business logic (Model), user display (View), and input orchestration (Controller)."
          }
        ]
      }
    ]
  },
  {
    id: "6-3-intro-to-testing",
    number: "6.3",
    title: "Introduction to Testing & Testable Code",
    subtitle: "Understand automated unit testing, boundary conditions, writing pure testable methods, and automated assertions.",
    readTime: "25 min",
    objectives: [
      "Understand why automated unit testing is essential in professional software engineering",
      "Write testable methods with explicit inputs and return values rather than printing",
      "Identify boundary conditions and edge cases (empty collections, 0, negative values)",
      "Construct assertion checks comparing expected results with actual outputs",
      "Avoid test fragility caused by hard-coded console output dependencies"
    ],
    theoryBlocks: [
      {
        heading: "Why Automated Testing is Crucial",
        text: "Manual testing (running the program and typing inputs by hand every time) is slow, tedious, and error-prone. As applications grow to thousands of lines, manual testing becomes impossible. Automated tests verify code correctness in milliseconds, preventing regressions when code is refactored.",
        codeSnippet: "// Manual testing: typing in terminal over and over\n// Automated testing: executing code that verifies output instantly!\n\npublic class CalculatorTest {\n    public static void testAddition() {\n        Calculator calc = new Calculator();\n        int result = calc.add(2, 3);\n        if (result != 5) {\n            System.out.println(\"TEST FAILED: expected 5 but got \" + result);\n        } else {\n            System.out.println(\"TEST PASSED\");\n        }\n    }\n}",
        terminalOutput: "TEST PASSED",
        tip: "An automated test suite gives you confidence to refactor and optimize code without fear of breaking existing features.",
        warning: "A regression is an unintentional bug introduced into previously working features during code changes.",
        mcq: {
          id: "j6-3-1",
          question: "What is a 'regression' in software development?",
          options: [
            { id: "A", text: "A bug inadvertently introduced into an existing, previously working feature during a new code change", explanationIfWrong: "" },
            { id: "B", text: "Reverting from Java 21 to Java 8", explanationIfWrong: "A regression refers to bug introduction, not version downgrades." },
            { id: "C", text: "Deleting unused class files from disk", explanationIfWrong: "Deleting unused files is refactoring or cleanup." },
            { id: "D", text: "Running code in debug mode", explanationIfWrong: "Regression is a defect where working functionality breaks." }
          ],
          correctAnswer: "A",
          explanationNote: "A regression occurs when modifications or new features unintentionally break existing, verified functionality."
        },
        questionPool: [
          {
            id: "j6-3-1-alt1",
            question: "Why is automated testing superior to manual terminal testing?",
            options: [
              { id: "A", text: "Automated tests run in milliseconds, can be repeated thousands of times, and reliably catch regressions without human error", explanationIfWrong: "" },
              { id: "B", text: "Because automated tests require no CPU memory", explanationIfWrong: "Automated tests execute in memory." },
              { id: "C", text: "Because manual testing is forbidden by the Java compiler", explanationIfWrong: "Manual testing is allowed, but inefficient and prone to oversights." },
              { id: "D", text: "Because automated tests convert all code to C++", explanationIfWrong: "Tests run in Java on the JVM." }
            ],
            correctAnswer: "A",
            explanationNote: "Automated test suites can be executed repeatedly on every change, ensuring immediate regression detection."
          },
          {
            id: "j6-3-1-alt2",
            question: "What is a 'Unit Test' in object-oriented programming?",
            options: [
              { id: "A", text: "An automated test that verifies a single small unit of code (typically an individual method or class) in isolation", explanationIfWrong: "" },
              { id: "B", text: "A test that checks the electrical power unit of the computer", explanationIfWrong: "Unit testing refers to software units of code." },
              { id: "C", text: "A test that requires 100 people testing simultaneously", explanationIfWrong: "Unit tests are automated and execute isolated code units." },
              { id: "D", text: "A test written only in assembly language", explanationIfWrong: "Unit tests are written in the same language as the application." }
            ],
            correctAnswer: "A",
            explanationNote: "Unit tests target the smallest testable parts of an application, such as individual methods, in isolation."
          }
        ]
      },
      {
        heading: "Writing Testable Methods (Return Values vs Printing)",
        text: "Methods that print to System.out are very difficult to test automatically because assertions cannot easily read terminal text. Methods that RETURN values (e.g. int, boolean, String) are effortlessly testable: a test calls the method and asserts whether the returned value equals the expected value.",
        codeSnippet: "// UNTESTABLE:\npublic void printArea(int w, int h) {\n    System.out.println(w * h);\n}\n\n// TESTABLE:\npublic int area(int w, int h) {\n    return w * h;\n}",
        terminalOutput: "// Test:\nif (calc.area(5, 4) == 20) { /* Success! */ }",
        tip: "Rule of thumb: make calculation methods return their results. Let the UI layer handle printing the returned values.",
        warning: "Avoid 'void' return types for methods that perform calculations; return the calculated result instead.",
        mcq: {
          id: "j6-3-2",
          question: "Why is 'public int area(int w, int h)' much more testable than 'public void printArea(int w, int h)'?",
          options: [
            { id: "A", text: "Because it returns a value that can be directly verified against an expected value using an automated assertion", explanationIfWrong: "" },
            { id: "B", text: "Because void methods cannot be compiled in test classes", explanationIfWrong: "Void methods compile fine, but testing their side effects is cumbersome." },
            { id: "C", text: "Because int calculations are 10 times faster than void calculations", explanationIfWrong: "It is an architectural testability distinction, not speed." },
            { id: "D", text: "Because printArea deletes variables", explanationIfWrong: "Printing does not delete variables." }
          ],
          correctAnswer: "A",
          explanationNote: "Returning values allows test code to compare actual returned values directly against expected values."
        },
        questionPool: [
          {
            id: "j6-3-2-alt1",
            question: "What is an 'assertion' in automated testing?",
            options: [
              { id: "A", text: "A statement that checks whether a condition is true or whether an actual result matches an expected result", explanationIfWrong: "" },
              { id: "B", text: "A comment ignored by the compiler", explanationIfWrong: "Assertions actively execute and verify conditions." },
              { id: "C", text: "A loop that runs infinitely", explanationIfWrong: "Assertions evaluate a boolean expression once." },
              { id: "D", text: "A variable holding the current date", explanationIfWrong: "Assertions compare actual vs expected values." }
            ],
            correctAnswer: "A",
            explanationNote: "Assertions verify that the system under test produces the expected output. If an assertion fails, the test fails."
          },
          {
            id: "j6-3-2-alt2",
            question: "What should a test do if the actual result does NOT match the expected result?",
            options: [
              { id: "A", text: "Report an error or throw an AssertionError detailing the expected vs actual value", explanationIfWrong: "" },
              { id: "B", text: "Change the expected value to match whatever the code returned", explanationIfWrong: "Changing tests to match buggy code defeats the purpose of testing!" },
              { id: "C", text: "Delete the source code file", explanationIfWrong: "The test must report the failure so the bug can be fixed." },
              { id: "D", text: "Ignore the difference silently", explanationIfWrong: "Silent failures hide critical bugs." }
            ],
            correctAnswer: "A",
            explanationNote: "Tests must clearly report discrepancies between expected and actual results so developers can identify and fix bugs."
          }
        ]
      },
      {
        heading: "Identifying Boundary Conditions and Edge Cases",
        text: "Bugs rarely happen in the common, happy path; they almost always lurk at the boundaries! When writing tests, always test edge cases: empty lists (size 0), single-element collections, zeros, negative numbers, and boundary limits (e.g. exactly 50 or 60 points).",
        codeSnippet: "public class Statistics {\n    private ArrayList<Integer> numbers = new ArrayList<>();\n\n    public double average() {\n        if (this.numbers.isEmpty()) {\n            return 0.0; // Edge case: empty list should return 0, NOT divide by zero!\n        }\n        int sum = 0;\n        for (int n : this.numbers) sum += n;\n        return (double) sum / this.numbers.size();\n    }\n}",
        terminalOutput: "Statistics stats = new Statistics();\nSystem.out.println(stats.average()); // 0.0 (safely handles edge case)",
        tip: "A method that handles edge cases gracefully is called robust.",
        warning: "Dividing by zero with integers throws ArithmeticException; with floating-point numbers it produces NaN or Infinity.",
        mcq: {
          id: "j6-3-3",
          question: "Which of the following represents a critical edge case when testing a method that calculates the average of numbers in a collection?",
          options: [
            { id: "A", text: "An empty collection with 0 elements (testing for division by zero)", explanationIfWrong: "" },
            { id: "B", text: "A list of exactly 3 positive numbers", explanationIfWrong: "That is a standard common case, not a boundary edge case." },
            { id: "C", text: "A list of 10 identical numbers", explanationIfWrong: "Testing empty or boundary limits is the critical edge case." },
            { id: "D", text: "Calling the method on a Friday", explanationIfWrong: "Dates are irrelevant to collection math." }
          ],
          correctAnswer: "A",
          explanationNote: "An empty collection tests whether the method guards against division by zero (size == 0)."
        },
        questionPool: [
          {
            id: "j6-3-3-alt1",
            question: "What value does integer division '5 / 0' produce in Java?",
            options: [
              { id: "A", text: "It throws an ArithmeticException: / by zero", explanationIfWrong: "" },
              { id: "B", text: "0", explanationIfWrong: "Integer division by zero throws ArithmeticException in Java." },
              { id: "C", text: "Infinity", explanationIfWrong: "Floating-point division (5.0 / 0.0) yields Infinity; integer division throws an exception." },
              { id: "D", text: "null", explanationIfWrong: "Primitives cannot be null." }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, integer division by zero immediately throws ArithmeticException."
          },
          {
            id: "j6-3-3-alt2",
            question: "Why should you test boundary values (e.g. testing 49, 50, and 51 when the passing score is 50)?",
            options: [
              { id: "A", text: "Off-by-one errors (using '<' instead of '<=') are extremely common at boundary thresholds", explanationIfWrong: "" },
              { id: "B", text: "Because boundary values consume more memory", explanationIfWrong: "Memory usage is constant." },
              { id: "C", text: "Because the compiler ignores numbers ending in 0", explanationIfWrong: "The compiler processes all numbers identically." },
              { id: "D", text: "To format the numbers in hexadecimal", explanationIfWrong: "Boundary testing targets comparison operators." }
            ],
            correctAnswer: "A",
            explanationNote: "Off-by-one errors frequently occur at comparison boundaries (e.g., using < vs <=)."
          }
        ]
      },
      {
        heading: "Simulating User Input in Tests",
        text: "Because we used Dependency Injection to pass Scanner into UserInterface, we can simulate user interaction in automated tests without touching the keyboard. By constructing a Scanner with a String, the Scanner reads lines from that string as if typed by a user!",
        codeSnippet: "String simulatedInput = \"add\\nBuy milk\\nstop\\n\";\nScanner testScanner = new Scanner(simulatedInput);\n\nTodoList list = new TodoList();\nUserInterface ui = new UserInterface(list, testScanner);\nui.start();\n\n// Assert that the task was added successfully:\nSystem.out.println(list.getTasks().contains(\"Buy milk\")); // true!",
        terminalOutput: "true",
        tip: "Line breaks ('\\n') in the simulated input string separate sequential Enter key presses.",
        warning: "Always ensure your simulated input string contains the stop command ('stop\\n'), otherwise the while (true) loop will run out of lines and throw NoSuchElementException.",
        mcq: {
          id: "j6-3-4",
          question: "How can automated tests simulate user input for a UserInterface class that accepts a Scanner?",
          options: [
            { id: "A", text: "By initializing Scanner with a multiline String containing commands separated by '\\n' (e.g. new Scanner(\"add\\nmilk\\nstop\"))", explanationIfWrong: "" },
            { id: "B", text: "By writing a robotic script that presses physical keyboard keys", explanationIfWrong: "Passing input strings to Scanner is fast, pure, and automated in memory." },
            { id: "C", text: "Automated input simulation is impossible in Java", explanationIfWrong: "Scanner reads from any Readable source, including Strings." },
            { id: "D", text: "By deleting the Scanner class from java.util", explanationIfWrong: "Scanner handles simulated strings naturally." }
          ],
          correctAnswer: "A",
          explanationNote: "Scanner can scan from in-memory String sources, providing automated user keystroke simulation."
        },
        questionPool: [
          {
            id: "j6-3-4-alt1",
            question: "What happens if a simulated test input string runs out of lines without entering the \"stop\" command?",
            options: [
              { id: "A", text: "Scanner.nextLine() throws NoSuchElementException because there are no more lines to read", explanationIfWrong: "" },
              { id: "B", text: "It creates infinite empty strings", explanationIfWrong: "When the string source is exhausted, Scanner throws NoSuchElementException." },
              { id: "C", text: "The test passes automatically", explanationIfWrong: "An unhandled exception fails the test." },
              { id: "D", text: "The computer restarts", explanationIfWrong: "Standard exception handling applies." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling nextLine() on an exhausted Scanner without hasNextLine() throws NoSuchElementException."
          },
          {
            id: "j6-3-4-alt2",
            question: "What character in a Java String literal represents the Enter key (newline)?",
            options: [
              { id: "A", text: "\\n", explanationIfWrong: "" },
              { id: "B", text: "\\t", explanationIfWrong: "\\t represents a tab character." },
              { id: "C", text: "\\e", explanationIfWrong: "\\e is escape." },
              { id: "D", text: "\\b", explanationIfWrong: "\\b is backspace." }
            ],
            correctAnswer: "A",
            explanationNote: "The escape sequence '\\n' represents the newline (line feed) character."
          }
        ]
      },
      {
        heading: "Writing Isolated, Independent Tests",
        text: "Tests must be completely independent of each other. The result of Test B must never depend on whether Test A ran first or modified shared static state. Every test should instantiate its own fresh objects and verify state cleanly.",
        codeSnippet: "public class ListTest {\n    public static void testAdd() {\n        TodoList list = new TodoList(); // Fresh instance\n        list.add(\"Task 1\");\n        assert list.getTasks().size() == 1;\n    }\n\n    public static void testRemove() {\n        TodoList list = new TodoList(); // Independent fresh instance\n        list.add(\"Task 1\");\n        list.remove(1);\n        assert list.getTasks().isEmpty();\n    }\n}",
        terminalOutput: "// Each test starts with a clean slate and can run in any order",
        tip: "Tests that share mutable static variables are brittle and fail randomly depending on execution order.",
        warning: "Never rely on tests executing in a specific top-to-bottom order.",
        mcq: {
          id: "j6-3-5",
          question: "Why must automated unit tests be completely isolated and independent of each other?",
          options: [
            { id: "A", text: "To guarantee that a test failure is caused strictly by the unit under test, not by side effects from previous tests", explanationIfWrong: "" },
            { id: "B", text: "Because Java will delete any class that runs two tests in sequence", explanationIfWrong: "Java runs test suites sequentially or concurrently." },
            { id: "C", text: "Because isolated tests run without consuming RAM", explanationIfWrong: "All tests use memory." },
            { id: "D", text: "To convert tests to boolean primitives", explanationIfWrong: "Isolation is a reliability and determinism requirement." }
          ],
          correctAnswer: "A",
          explanationNote: "Independent tests are deterministic: they produce the same result regardless of execution order or test suite size."
        },
        questionPool: [
          {
            id: "j6-3-5-alt1",
            question: "What is a 'flaky test' in software engineering?",
            options: [
              { id: "A", text: "A test that nondeterministically passes or fails on the same code without any changes", explanationIfWrong: "" },
              { id: "B", text: "A test that takes less than 1 millisecond to run", explanationIfWrong: "Fast tests are desirable, not flaky." },
              { id: "C", text: "A test written in Python instead of Java", explanationIfWrong: "Flakiness refers to non-deterministic test outcomes." },
              { id: "D", text: "A test that verifies math equations", explanationIfWrong: "Flaky tests fail randomly due to state leakage or timing bugs." }
            ],
            correctAnswer: "A",
            explanationNote: "Flaky tests exhibit intermittent, non-deterministic failures without code changes, often caused by shared state or timing issues."
          },
          {
            id: "j6-3-5-alt2",
            question: "How can test state leakage be prevented?",
            options: [
              { id: "A", text: "By creating fresh object instances in every test and avoiding mutable static fields", explanationIfWrong: "" },
              { id: "B", text: "By making all fields static", explanationIfWrong: "Static fields share state across tests, increasing leakage!" },
              { id: "C", text: "By running tests only once a month", explanationIfWrong: "Tests should run on every commit." },
              { id: "D", text: "By disabling assertions", explanationIfWrong: "Disabling assertions stops testing altogether." }
            ],
            correctAnswer: "A",
            explanationNote: "Creating fresh instances inside each test ensures zero state bleed between test executions."
          }
        ]
      },
      {
        heading: "Summary of Software Quality & Testing Mindset",
        text: "Professional software engineers write code with testing in mind from day one. By separating the user interface from domain models, decomposing big classes into small collaborating objects, and writing pure methods with return values, your Java applications become robust, scalable, and effortlessly maintainable.",
        codeSnippet: "// Clean Architecture Triad:\n// 1. Domain Models: pure logic, state, and calculations\n// 2. Automated Tests: verifies domain rules across edge cases\n// 3. User Interface: gathers input and presents output cleanly",
        terminalOutput: "// 100% test coverage with zero coupling between UI and data logic!",
        tip: "Code that is difficult to test is almost always code that is poorly designed. If a method is hard to test, refactor it into smaller pieces!",
        warning: "Don't treat testing as an afterthought; design your classes to be testable from the beginning.",
        mcq: {
          id: "j6-3-6",
          question: "If a developer finds that a method is extremely difficult to test automatically, what is usually the underlying cause?",
          options: [
            { id: "A", text: "The method is doing too many things at once, tightly coupling business logic with console printing, user input, or hard-coded dependencies", explanationIfWrong: "" },
            { id: "B", text: "The Java compiler is corrupted", explanationIfWrong: "Difficult testing almost always points to architectural design flaws." },
            { id: "C", text: "The method has too few parameters", explanationIfWrong: "Fewer parameters usually make testing simpler." },
            { id: "D", text: "The operating system does not support automated tests", explanationIfWrong: "Unit testing runs cross-platform on any OS." }
          ],
          correctAnswer: "A",
          explanationNote: "Hard-to-test code is a primary symptom of tight coupling, lack of separation of concerns, and violating the Single Responsibility Principle."
        },
        questionPool: [
          {
            id: "j6-3-6-alt1",
            question: "What does 'Separation of Concerns' achieve in a software application?",
            options: [
              { id: "A", text: "Divides software into distinct sections, each addressing a separate concern (e.g. data storage vs presentation vs calculation)", explanationIfWrong: "" },
              { id: "B", text: "Separates numbers from letters in memory", explanationIfWrong: "It is an architectural modularity principle." },
              { id: "C", text: "Deletes old comments from git history", explanationIfWrong: "It organizes code responsibilities." },
              { id: "D", text: "Restricts Java programs to 100 lines total", explanationIfWrong: "It enables scaling to millions of lines cleanly." }
            ],
            correctAnswer: "A",
            explanationNote: "Separation of concerns organizes software so each module handles a distinct, cohesive responsibility."
          },
          {
            id: "j6-3-6-alt2",
            question: "What is the recommended response when a method is doing too much and cannot be tested cleanly?",
            options: [
              { id: "A", text: "Refactor: break the method into smaller helper methods and separate UI interaction from the computation logic", explanationIfWrong: "" },
              { id: "B", text: "Skip testing that method altogether", explanationIfWrong: "Skipping tests leaves risky bugs in production." },
              { id: "C", text: "Combine all other classes into that method", explanationIfWrong: "That creates a monolithic anti-pattern." },
              { id: "D", text: "Make all variables public", explanationIfWrong: "Breaking encapsulation makes code worse." }
            ],
            correctAnswer: "A",
            explanationNote: "Refactoring complex methods into focused, pure components restores testability and code health."
          }
        ]
      }
    ]
  }
];

// Helper functions matching Python & Java Part 1-5 mechanics

export function getActiveQuestionsForLevelPart6(
  section: SectionContent,
  studentId: string,
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part6_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart6(studentId: string): number {
  try {
    const key = `dopilot_java_part6_consecutive_failures_${studentId}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart6(studentId: string): void {
  try {
    localStorage.setItem(`dopilot_java_part6_consecutive_failures_${studentId}`, '0');
  } catch {}
}

export function setLevelAttemptCountPart6(sectionId: string, studentId: string, count: number): void {
  try {
    localStorage.setItem(`dopilot_java_part6_attempt_${studentId}_${sectionId}`, String(count));
  } catch {}
}

export function getLevelAttemptCountPart6(sectionId: string, studentId: string): number {
  try {
    const raw = localStorage.getItem(`dopilot_java_part6_attempt_${studentId}_${sectionId}`);
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart6 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart6(
  sectionId: string,
  studentId: string,
  isPassed: boolean
): AttemptResultPart6 {
  const attemptKey = `dopilot_java_part6_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part6_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part6_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = localStorage.getItem(attemptKey);
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart6(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart6(studentId);
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
