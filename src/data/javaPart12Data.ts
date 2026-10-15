// src/data/javaPart12Data.ts
// Helsinki MOOC Java Programming Part 12: Generics, Custom Collections Under The Hood, Randomness & 2D Arrays

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

export const PART_12_SECTIONS: SectionContent[] = [
  // -------------------------------------------------------------
  // LEVEL 12.1: Type Parameters (Generics)
  // -------------------------------------------------------------
  {
    id: "12-1-generics",
    number: "12.1",
    title: "Type Parameters (Generics)",
    subtitle: "Generic classes, type variables, generic methods, bounded wildcards, and runtime type erasure.",
    readTime: "25 min",
    objectives: [
      "Understand the motivation for Generics: compile-time type safety without manual casting",
      "Declare and implement generic classes with type parameter <T>",
      "Define generic methods with type parameters preceding the return type",
      "Apply bounded type parameters using <T extends Comparable<T>>",
      "Recognize the implications of Java's runtime Type Erasure and its restrictions on instantiating T",
      "Utilize wildcard types (? extends SuperType and ? super SubType) for flexible API arguments"
    ],
    theoryBlocks: [
      {
        heading: "Motivation for Generics and Generic Classes",
        text: `Prior to Java 5, collections stored raw 'Object' references. Retrieving an element required explicit casting: 'String s = (String) list.get(0);'. A misplaced type caused catastrophic 'ClassCastException' at runtime.\n\nGenerics introduced compile-time type safety. A class or interface that operates over a parameterized type is declared with angle brackets '<T>':\n\npublic class Locker<T> {\n    private T element;\n    public void set(T element) { this.element = element; }\n    public T get() { return this.element; }\n}\n\nStandard type parameter naming conventions:\n• 'T': Type (general)\n• 'E': Element (collections)\n• 'K': Key (maps)\n• 'V': Value (maps)\n• 'N': Number`,
        codeSnippet: `public class Locker<T> {
    private T item;

    public void store(T item) {
        this.item = item;
    }

    public T retrieve() {
        return this.item;
    }
}

// In main:
// Locker<String> noteLocker = new Locker<>();
// noteLocker.store("Secret Recipe");
// String note = noteLocker.retrieve(); // No cast needed!
// noteLocker.store(42); // Compile-time error caught by IDE!`,
        terminalOutput: `Secret Recipe`,
        tip: "Generics shift type errors from runtime crashes to compile-time compiler errors, making your software vastly more reliable.",
        mcq: {
          id: "12-1-1",
          question: "What is the primary advantage of Java Generics over storing raw 'Object' references?",
          options: [
            { id: "A", text: "Generics reduce the size of the compiled .class file by 50%" },
            { id: "B", text: "Generics enforce compile-time type safety, eliminating manual casting and preventing ClassCastException" },
            { id: "C", text: "Generics allow primitive types like int to be stored without wrapper classes" },
            { id: "D", text: "Generics disable the Java Garbage Collector" }
          ],
          correctAnswer: "B",
          explanationNote: "Generics provide strong compile-time type verification, catching incorrect types at build time rather than failing with ClassCastException at runtime."
        },
        questionPool: [
          {
            id: "12-1-1-alt",
            question: "By Java convention, which single uppercase letter is conventionally used for an Element type parameter in a custom list or collection?",
            options: [
              { id: "A", text: "T" },
              { id: "B", text: "E" },
              { id: "C", text: "K" },
              { id: "D", text: "V" }
            ],
            correctAnswer: "B",
            explanationNote: "By convention, 'E' stands for Element (in collections), 'T' for Type, 'K' for Key, and 'V' for Value."
          }
        ]
      },
      {
        heading: "Generic Methods",
        text: `In addition to generic classes, individual methods can declare their own type parameters, independent of whether the enclosing class is generic or not.\n\nThe type parameter declaration appears BEFORE the method's return type:\n\npublic static <T> void swap(T[] array, int i, int j) {\n    T temp = array[i];\n    array[i] = array[j];\n    array[j] = temp;\n}\n\nWhen calling a generic method, the Java compiler uses 'type inference' to determine the actual type argument based on the passed parameters. You rarely need to specify the type explicitly at the call site.`,
        codeSnippet: `public class GenericUtility {
    // Generic method: type parameter <T> precedes return type T
    public static <T> T getFirst(T[] array) {
        if (array == null || array.length == 0) {
            return null;
        }
        return array[0];
    }

    public static void main(String[] args) {
        String[] names = { "Linus", "James", "Dennis" };
        Integer[] nums = { 101, 202, 303 };

        // Type inferred automatically:
        String firstLetter = getFirst(names);
        Integer firstNumber = getFirst(nums);

        System.out.println("First name: " + firstLetter);
        System.out.println("First num: " + firstNumber);
    }
}`,
        terminalOutput: `First name: Linus
First num: 101`,
        tip: "Notice the syntax: '<T> T getFirst(T[] array)'. The first '<T>' declares the generic type parameter for the method, and the second 'T' is the return type.",
        mcq: {
          id: "12-1-2",
          question: "Where is the type parameter declared in a standalone generic static method?",
          options: [
            { id: "A", text: "Inside the method parameter parentheses after the arguments" },
            { id: "B", text: "Immediately before the method's return type (e.g. public static <T> T method())" },
            { id: "C", text: "At the end of the method body before the closing curly brace" },
            { id: "D", text: "Directly after the class name only" }
          ],
          correctAnswer: "B",
          explanationNote: "Generic methods declare their type parameters in angle brackets directly preceding the return type: 'public static <T> void print(T item)'."
        },
        questionPool: [
          {
            id: "12-1-2-alt",
            question: "Can a non-generic class contain generic methods in Java?",
            options: [
              { id: "A", text: "Yes, any class can contain generic methods" },
              { id: "B", text: "No, only generic classes (class Name<T>) can declare generic methods" },
              { id: "C", text: "Only if the method is declared private" },
              { id: "D", text: "Only in abstract classes" }
            ],
            correctAnswer: "A",
            explanationNote: "Generic methods can appear in regular non-generic classes or generic classes alike."
          }
        ]
      },
      {
        heading: "Bounded Type Parameters",
        text: `By default, an unbounded type parameter '<T>' can represent any object type. Inside the generic class or method, you can only invoke methods defined on 'java.lang.Object' (such as toString() or equals()).\n\nTo restrict the types that can be used and to access specific methods on 'T', use 'bounded type parameters' with the 'extends' keyword:\n\npublic static <T extends Comparable<T>> T findMax(T a, T b) {\n    return a.compareTo(b) > 0 ? a : b;\n}\n\nKey rules:\n• In bounded generics, 'extends' is used for BOTH superclasses and interfaces (e.g. '<T extends Number>', '<T extends Comparable<T>>').\n• Multiple bounds can be joined with '&': '<T extends Number & Comparable<T>>'. If a class bound is present, it must be listed first before any interface bounds.`,
        codeSnippet: `public class MathHelper {
    // T must implement Comparable<T>
    public static <T extends Comparable<T>> T max(T first, T second) {
        if (first.compareTo(second) >= 0) {
            return first;
        }
        return second;
    }

    public static void main(String[] args) {
        System.out.println(max(45, 12)); // Works with Integer
        System.out.println(max("Zebra", "Apple")); // Works with String
        // max(new Object(), new Object()); // Compiler error! Object does not implement Comparable
    }
}`,
        terminalOutput: `45
Zebra`,
        tip: "Remember: In generic type parameter declarations, 'extends' is universally used whether the bound is a class or an interface. Never write 'implements' inside <T extends Interface>.",
        mcq: {
          id: "12-1-3",
          question: "Which keyword is used in a generic type parameter declaration to require that T implement an interface (e.g. Comparable)?",
          options: [
            { id: "A", text: "implements (e.g. <T implements Comparable<T>>)" },
            { id: "B", text: "extends (e.g. <T extends Comparable<T>>)" },
            { id: "C", text: "instanceof (e.g. <T instanceof Comparable<T>>)" },
            { id: "D", text: "super (e.g. <T super Comparable<T>>)" }
          ],
          correctAnswer: "B",
          explanationNote: "In Java generics, the 'extends' keyword is used for both class inheritance and interface implementation bounds."
        },
        questionPool: [
          {
            id: "12-1-3-alt",
            question: "Why does the method '<T extends Number> double sum(T a, T b)' allow calling 'a.doubleValue()'?",
            options: [
              { id: "A", text: "Because the compiler guarantees T is a subtype of Number, which declares doubleValue()" },
              { id: "B", text: "Because all objects have doubleValue()" },
              { id: "C", text: "Because the JVM uses reflection" },
              { id: "D", text: "Because primitive conversion is disabled" }
            ],
            correctAnswer: "A",
            explanationNote: "The bound '<T extends Number>' ensures that T is guaranteed to have all methods of the Number class, such as doubleValue()."
          }
        ]
      },
      {
        heading: "Type Erasure and Its Practical Limitations",
        text: `Java implemented generics using 'Type Erasure' to ensure backward compatibility with older pre-generic Java code.\n\nWhat happens during compilation:\n1. The compiler inspects types and inserts casts automatically where needed.\n2. The compiler then ERASES all generic type arguments: '<T>' becomes 'Object' (or its bound, such as 'Number' in '<T extends Number>').\n3. At runtime, the compiled bytecode contains no record of the exact type argument!\n\nConsequences & Limitations of Type Erasure:\n• You cannot instantiate a generic type directly: 'new T()' is illegal!\n• You cannot create generic arrays directly: 'new T[10]' is illegal! (Instead, create an Object[] array and cast: (T[]) new Object[size]).\n• You cannot use primitive types as type arguments: 'List<int>' is invalid; you must use wrapper classes like 'List<Integer>'.\n• 'instanceof' with generic type arguments is illegal: 'obj instanceof List<String>' causes a compiler error.`,
        codeSnippet: `public class GenericBox<T> {
    private Object[] elements;
    private int size;

    @SuppressWarnings("unchecked")
    public GenericBox(int capacity) {
        // new T[capacity] is illegal! Must create Object[] and cast:
        this.elements = new Object[capacity];
        this.size = 0;
    }

    public void add(T item) {
        elements[size++] = item;
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        return (T) elements[index];
    }
}`,
        terminalOutput: `GenericBox<String> box = new GenericBox<>(5);
box.add("Java 21");
System.out.println(box.get(0));
// Output: Java 21`,
        tip: "Understanding Type Erasure explains why Java requires wrapper classes (Integer, Double) instead of primitive types (int, double) in collections.",
        mcq: {
          id: "12-1-4",
          question: "Which of the following operations is ILLEGAL in Java due to Type Erasure?",
          options: [
            { id: "A", text: "T variable = null;" },
            { id: "B", text: "T item = new T();" },
            { id: "C", text: "public T getElement() { return element; }" },
            { id: "D", text: "public void process(T item) {}" }
          ],
          correctAnswer: "B",
          explanationNote: "Because type information for T is erased at compile time, the JVM does not know which constructor to invoke at runtime; hence 'new T()' is prohibited."
        },
        questionPool: [
          {
            id: "12-1-4-alt",
            question: "Why is 'ArrayList<int>' illegal in Java syntax?",
            options: [
              { id: "A", text: "Generics only support reference types that inherit from java.lang.Object" },
              { id: "B", text: "Integers cannot be stored in arrays" },
              { id: "C", text: "int is reserved exclusively for loop counters" },
              { id: "D", text: "Java 21 deprecated primitive types" }
            ],
            correctAnswer: "A",
            explanationNote: "Type parameters must be reference types because type erasure replaces them with Object. Primitive types like int must use wrapper types like Integer."
          }
        ]
      },
      {
        heading: "Wildcards: ? extends and ? super",
        text: `In Java, generic types are 'invariant'. Even though 'Integer' is a subtype of 'Number', 'List<Integer>' is NOT a subtype of 'List<Number>'! You cannot pass a 'List<Integer>' to a method expecting 'List<Number>'.\n\nTo allow polymorphic parameters with generics, Java uses Wildcards ('?'):\n\n1. Upper-bounded wildcard ('? extends T'):\n'List<? extends Number>' accepts a List of Number or any of its subclasses (Integer, Double, etc.).\nUse this when you are READING data from the structure ('Producer Extends'). You cannot add elements to it!\n\n2. Lower-bounded wildcard ('? super T'):\n'List<? super Integer>' accepts a List of Integer or any of its superclasses (Number, Object).\nUse this when you are WRITING data into the structure ('Consumer Super').\n\nRemember the mnemonic: PECS — Producer Extends, Consumer Super!`,
        codeSnippet: `import java.util.List;

public class WildcardDemo {
    // Upper-bounded: Producer (we only read values from list)
    public static double sumOfNumbers(List<? extends Number> list) {
        double sum = 0.0;
        for (Number n : list) {
            sum += n.doubleValue();
        }
        return sum;
    }

    public static void main(String[] args) {
        List<Integer> ints = List.of(1, 2, 3);
        List<Double> doubles = List.of(1.5, 2.5, 3.5);

        System.out.println("Sum of ints: " + sumOfNumbers(ints));
        System.out.println("Sum of doubles: " + sumOfNumbers(doubles));
    }
}`,
        terminalOutput: `Sum of ints: 6.0
Sum of doubles: 7.5`,
        tip: "PECS Principle: If your method reads items from a collection, declare it as '? extends T'. If your method writes items into a collection, declare it as '? super T'.",
        mcq: {
          id: "12-1-5",
          question: "According to the PECS guideline in Java, when should you use '? extends T'?",
          options: [
            { id: "A", text: "When you only produce/read items from the collection" },
            { id: "B", text: "When you only insert/write items into the collection" },
            { id: "C", text: "When the collection must contain both primitive and object types" },
            { id: "D", text: "When you want to delete elements from the collection" }
          ],
          correctAnswer: "A",
          explanationNote: "PECS stands for 'Producer Extends, Consumer Super'. Use '? extends' when you only read (produce) values from the collection."
        },
        questionPool: [
          {
            id: "12-1-5-alt",
            question: "Why does 'List<Number> list = new ArrayList<Integer>();' cause a compilation error?",
            options: [
              { id: "A", text: "Generic types are invariant; List<Integer> is not a subtype of List<Number>" },
              { id: "B", text: "ArrayList does not support Integer" },
              { id: "C", text: "Number is an interface, not an abstract class" },
              { id: "D", text: "Integer does not extend Number" }
            ],
            correctAnswer: "A",
            explanationNote: "Generics in Java are invariant. If this were allowed, someone could call list.add(3.14) and insert a Double into an Integer list!"
          }
        ]
      },
      {
        heading: "Multiple Type Parameters (Map-style Key-Value)",
        text: `Generic classes and interfaces can accept multiple type parameters separated by commas: '<K, V>'.\n\nA classic example is a key-value Pair or Map entry:\n\npublic class Pair<K, V> {\n    private K key;\n    private V value;\n\n    public Pair(K key, V value) {\n        this.key = key;\n        this.value = value;\n    }\n\n    public K getKey() { return key; }\n    public V getValue() { return value; }\n}\n\nEach type parameter operates independently and can be bound to different concrete types (e.g. 'Pair<String, Integer>', 'Pair<Long, Person>').`,
        codeSnippet: `public class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return this.key; }
    public V getValue() { return this.value; }

    @Override
    public String toString() {
        return "(" + key + " -> " + value + ")";
    }

    public static void main(String[] args) {
        Pair<String, Integer> score = new Pair<>("Ada", 100);
        System.out.println(score);
    }
}`,
        terminalOutput: `(Ada -> 100)`,
        tip: "Multiple generic type parameters allow modeling flexible associative pairs, tuples, and data structures with full type safety.",
        mcq: {
          id: "12-1-6",
          question: "How are multiple type parameters declared on a generic class header?",
          options: [
            { id: "A", text: "class Pair<K><V>" },
            { id: "B", text: "class Pair<K, V>" },
            { id: "C", text: "class Pair<K & V>" },
            { id: "D", text: "class Pair[K, V]" }
          ],
          correctAnswer: "B",
          explanationNote: "Multiple type parameters are comma-separated inside single angle brackets, e.g. class Pair<K, V>."
        },
        questionPool: [
          {
            id: "12-1-6-alt",
            question: "Can both type parameters in a 'Pair<K, V>' be instantiated with the same concrete type, such as 'Pair<String, String>'?",
            options: [
              { id: "A", text: "Yes, K and V can be distinct or identical types" },
              { id: "B", text: "No, Java requires K and V to be different types" },
              { id: "C", text: "Only if K is an interface" },
              { id: "D", text: "Only if V is declared final" }
            ],
            correctAnswer: "A",
            explanationNote: "Independent type parameters can be bound to different types or the same type (e.g. Pair<String, String>)."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 12.2: Array Lists and Hash Tables Under The Hood
  // -------------------------------------------------------------
  {
    id: "12-2-collections-internals",
    number: "12.2",
    title: "Array Lists and Hash Tables Under The Hood",
    subtitle: "Internal backing arrays, dynamic capacity doubling, hash buckets, load factor, and collision resolution.",
    readTime: "25 min",
    objectives: [
      "Understand how ArrayList uses a fixed-size internal array (T[]) to deliver O(1) indexed lookups",
      "Explain the dynamic growth algorithm: array resizing and amortized constant O(1) time insertion",
      "Explore the internal structure of HashMap as an array of linked list / red-black tree buckets",
      "Trace how key.hashCode() and the modulo/bitwise operator compute the bucket array index",
      "Understand hash collisions and how HashMap resolves them via chaining",
      "Explain capacity, load factor (0.75), and the rehashing process when capacity threshold is reached"
    ],
    theoryBlocks: [
      {
        heading: "ArrayList Internal Architecture",
        text: `Under the hood, Java's 'ArrayList<T>' is backed by a plain, fixed-size Java array: 'private Object[] elementData;'.\n\nKey mechanics:\n• 'size': The number of actual elements currently stored by the user.\n• 'capacity': The length of the internal backing array ('elementData.length').\n\nIndexed lookups ('list.get(index)') take O(1) constant time because array elements can be accessed immediately by memory address offset computation ('base_address + index * reference_size').\n\nHowever, plain arrays have fixed sizes. When an ArrayList runs out of capacity during an 'add()' operation, it must allocate a larger array and copy all existing elements over!`,
        codeSnippet: `// Simplified custom ArrayList implementation:
public class SimpleList<T> {
    private Object[] elements;
    private int size;

    public SimpleList() {
        this.elements = new Object[10]; // Initial capacity: 10
        this.size = 0;
    }

    public int size() {
        return this.size;
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index " + index + " out of bounds");
        }
        return (T) this.elements[index];
    }
}`,
        terminalOutput: `SimpleList<String> list = new SimpleList<>();
System.out.println("Size: " + list.size());
// Backing array capacity is 10, but size is 0.`,
        tip: "Distinguish between 'size' (number of items added) and 'capacity' (total slots currently allocated in the backing array).",
        mcq: {
          id: "12-2-1",
          question: "What fundamental underlying data structure does ArrayList use internally in Java?",
          options: [
            { id: "A", text: "A doubly linked list of node objects" },
            { id: "B", text: "A contiguous, fixed-size array of Object references" },
            { id: "C", text: "A binary search tree" },
            { id: "D", text: "A hash table" }
          ],
          correctAnswer: "B",
          explanationNote: "ArrayList is backed by an internal contiguous Object[] array that grows dynamically as elements are added."
        },
        questionPool: [
          {
            id: "12-2-1-alt",
            question: "Why does 'arrayList.get(50)' execute in O(1) constant time?",
            options: [
              { id: "A", text: "Array memory is contiguous, allowing direct pointer arithmetic offset calculation" },
              { id: "B", text: "It uses binary search on keys" },
              { id: "C", text: "It caches all lookups on the CPU L1 cache" },
              { id: "D", text: "It runs a background thread to find the element" }
            ],
            correctAnswer: "A",
            explanationNote: "Arrays occupy contiguous memory addresses, so getting an element at index i takes O(1) constant time via direct memory offset calculation."
          }
        ]
      },
      {
        heading: "Dynamic Resizing and Amortized O(1) Time",
        text: `When 'list.add(item)' is called and 'size == elements.length', the array is full. The ArrayList grows by:\n1. Creating a new array with increased capacity (typically '1.5x' or '2x' larger: 'newCapacity = oldCapacity + (oldCapacity >> 1)').\n2. Copying all elements from the old array into the new array using 'System.arraycopy()'.\n3. Pointing 'this.elements' to the new array.\n\nWhile copying takes O(N) time for that specific addition, resizing occurs exponentially less frequently as the array grows larger. Averaged over many additions, the time per 'add()' operation is 'Amortized O(1)' constant time!`,
        codeSnippet: `public void add(T item) {
    if (this.size == this.elements.length) {
        grow();
    }
    this.elements[this.size] = item;
    this.size++;
}

private void grow() {
    int newCapacity = this.elements.length * 2;
    Object[] newArray = new Object[newCapacity];
    for (int i = 0; i < this.elements.length; i++) {
        newArray[i] = this.elements[i];
    }
    this.elements = newArray;
    System.out.println("Backing array grown to: " + newCapacity);
}`,
        terminalOutput: `// When adding 11th item:
// Backing array grown to: 20`,
        tip: "If you know in advance that your list will contain 100,000 items, initialize it with 'new ArrayList<>(100000)' to prevent dozens of expensive intermediate array reallocations!",
        mcq: {
          id: "12-2-2",
          question: "What is the average ('amortized') time complexity of appending an element to an ArrayList?",
          options: [
            { id: "A", text: "O(N^2)" },
            { id: "B", text: "O(log N)" },
            { id: "C", text: "Amortized O(1) constant time" },
            { id: "D", text: "O(N)" }
          ],
          correctAnswer: "C",
          explanationNote: "Although an occasional resize takes O(N) time, doubling the capacity makes resizes so rare that the average cost per insertion is amortized O(1)."
        },
        questionPool: [
          {
            id: "12-2-2-alt",
            question: "Why is initializing 'new ArrayList<>(50000)' beneficial when loading 50,000 items from a database?",
            options: [
              { id: "A", text: "It prevents repetitive resizing and array copying overhead" },
              { id: "B", text: "It converts the list to a LinkedList" },
              { id: "C", text: "It makes the database query run faster" },
              { id: "D", text: "It disables Java type checking" }
            ],
            correctAnswer: "A",
            explanationNote: "Pre-sizing avoids multiple internal array allocations and array copying operations as the collection grows."
          }
        ]
      },
      {
        heading: "HashMap Architecture: Array of Buckets",
        text: `A 'HashMap<K, V>' achieves near-instantaneous key lookups (average O(1) time) by combining an array with hash functions.\n\nInside HashMap:\n• An array of 'Node<K, V>[] table' (often referred to as 'buckets').\n• Each node stores: 'int hash', 'K key', 'V value', and 'Node<K, V> next'.\n\nWhen you call 'map.put(key, value)' or 'map.get(key)':\n1. Calculate the hash code of the key: 'int hash = key.hashCode()'.\n2. Compute the bucket index in the table:\n'int index = Math.abs(hash) % table.length;' (or bitwise 'hash & (table.length - 1)').\n3. Go directly to 'table[index]' in O(1) constant time!`,
        codeSnippet: `public class SimpleHashMapBucketDemo {
    public static int getBucketIndex(String key, int tableSize) {
        int hash = key.hashCode();
        return Math.abs(hash) % tableSize;
    }

    public static void main(String[] args) {
        int tableSize = 16;
        String[] keys = { "Alice", "Bob", "Charlie", "Diana" };

        for (String k : keys) {
            int bucket = getBucketIndex(k, tableSize);
            System.out.println(k + " (hash: " + k.hashCode() + ") -> Bucket " + bucket);
        }
    }
}`,
        terminalOutput: `Alice (hash: 63350368) -> Bucket 0
Bob (hash: 66965) -> Bucket 5
Charlie (hash: 104431) -> Bucket 7
Diana (hash: 66052737) -> Bucket 1`,
        tip: "A good hashCode() implementation distributes keys uniformly across all available bucket indices, minimizing collisions.",
        mcq: {
          id: "12-2-3",
          question: "How does HashMap determine which bucket index corresponds to a given key?",
          options: [
            { id: "A", text: "By iterating through all keys and checking equals()" },
            { id: "B", text: "By taking the key's hashCode and mapping it within the array bounds using modulo/bitwise operators" },
            { id: "C", text: "By sorting the array alphabetically" },
            { id: "D", text: "By assigning random numbers" }
          ],
          correctAnswer: "B",
          explanationNote: "HashMap hashes the key with key.hashCode() and maps the hash value to a bucket index using modulo or bitwise masking (hash & (capacity - 1))."
        },
        questionPool: [
          {
            id: "12-2-3-alt",
            question: "What is each element in the internal HashMap table array called?",
            options: [
              { id: "A", text: "A bucket" },
              { id: "B", text: "A thread" },
              { id: "C", text: "A stack frame" },
              { id: "D", text: "A vector" }
            ],
            correctAnswer: "A",
            explanationNote: "In hash table terminology, each slot in the internal array is traditionally called a bucket."
          }
        ]
      },
      {
        heading: "Handling Hash Collisions with Separate Chaining",
        text: `Because there are infinite possible object values but only a finite number of 32-bit integers (and even fewer bucket slots, e.g. 16), two different keys will inevitably hash to the EXACT same bucket index. This is known as a 'Hash Collision'.\n\nHow Java handles collisions (Separate Chaining):\n1. Each bucket in the array is the head of a linked list (or balanced red-black tree in Java 8+ if the chain exceeds 8 nodes).\n2. When two keys collide at 'table[index]', the new entry is appended to the chain in that bucket.\n3. When 'map.get(key)' is called:\n   - Jump to the bucket index in O(1).\n   - Traverse the linked list in that bucket, comparing each entry using 'entry.key.equals(searchedKey)'.\n   - Return the corresponding value when .equals() returns true!`,
        codeSnippet: `// Node in a bucket chain:
public class HashNode<K, V> {
    K key;
    V value;
    HashNode<K, V> next; // Linked list chain for collisions

    public HashNode(K key, V value, HashNode<K, V> next) {
        this.key = key;
        this.value = value;
        this.next = next;
    }
}

// When two different keys map to bucket index 4:
// table[4] -> [Key: "John", Val: 25] -> [Key: "Emily", Val: 30] -> null`,
        terminalOutput: `Collision handled via linked list chaining in bucket 4.`,
        tip: "This explains why BOTH equals() AND hashCode() must be overridden consistently! hashCode() finds the bucket, and equals() finds the exact key within the bucket chain.",
        mcq: {
          id: "12-2-4",
          question: "When two distinct keys produce the same bucket index, how does standard HashMap resolve the collision?",
          options: [
            { id: "A", text: "It throws a HashCollisionException" },
            { id: "B", text: "It overwrites the older key-value pair and deletes it" },
            { id: "C", text: "It chains multiple entries in that bucket using a linked list (or red-black tree)" },
            { id: "D", text: "It restarts the JVM" }
          ],
          correctAnswer: "C",
          explanationNote: "HashMap uses separate chaining: colliding entries are linked together into a list (or tree) inside that bucket."
        },
        questionPool: [
          {
            id: "12-2-4-alt",
            question: "What method is used to determine if a key in a bucket's collision chain matches the requested lookup key?",
            options: [
              { id: "A", text: "key.equals(otherKey)" },
              { id: "B", text: "key == otherKey" },
              { id: "C", text: "key.compareTo(otherKey)" },
              { id: "D", text: "key.toString().length()" }
            ],
            correctAnswer: "A",
            explanationNote: "Once the bucket is located via hashCode, Java uses key.equals() to locate the exact matching key within that bucket."
          }
        ]
      },
      {
        heading: "Load Factor, Capacity, and Rehashing",
        text: `As more elements are added to a HashMap, the bucket chains grow longer. If all buckets become crowded, lookup time degrades from O(1) to O(N)!\n\nTo prevent this, HashMap dynamically resizes using two configuration parameters:\n1. 'Initial Capacity': Default is 16 buckets.\n2. 'Load Factor': Default is 0.75 (75%).\n\nThreshold Formula:\n'threshold = capacity * loadFactor' (16 * 0.75 = 12 elements).\n\nWhen the number of stored entries exceeds the threshold (e.g. 13th element inserted):\n• The capacity of the bucket array is DOUBLED (from 16 to 32).\n• 'Rehashing': Every single existing entry is recalculated and redistributed across the new 32-bucket array!`,
        codeSnippet: `import java.util.HashMap;

public class LoadFactorDemo {
    public static void main(String[] args) {
        // Default HashMap: capacity = 16, load factor = 0.75
        // Resizes to 32 when element count exceeds 12.
        HashMap<String, Integer> map = new HashMap<>(16, 0.75f);

        for (int i = 1; i <= 20; i++) {
            map.put("Key_" + i, i);
        }
        System.out.println("Map populated with " + map.size() + " items.");
    }
}`,
        terminalOutput: `Map populated with 20 items.
// Rehash occurred automatically at item 13!`,
        tip: "A load factor of 0.75 offers the ideal trade-off between time complexity (fast lookups) and space complexity (memory usage).",
        mcq: {
          id: "12-2-5",
          question: "What is the default load factor of a standard Java HashMap?",
          options: [
            { id: "A", text: "0.50 (50%)" },
            { id: "B", text: "0.75 (75%)" },
            { id: "C", text: "1.00 (100%)" },
            { id: "D", text: "0.25 (25%)" }
          ],
          correctAnswer: "B",
          explanationNote: "The default load factor for HashMap in Java is 0.75, which provides an optimal balance between time and space efficiency."
        },
        questionPool: [
          {
            id: "12-2-5-alt",
            question: "What occurs during 'rehashing' when a HashMap exceeds its load threshold?",
            options: [
              { id: "A", text: "The bucket array doubles in size and all existing entries are redistributed across the new buckets" },
              { id: "B", text: "All values are wiped clean" },
              { id: "C", text: "Keys are encrypted with SHA-256" },
              { id: "D", text: "The map is converted into an array of strings" }
            ],
            correctAnswer: "A",
            explanationNote: "Rehashing doubles the table capacity and re-computes bucket indices for all stored entries to keep chains short and fast."
          }
        ]
      },
      {
        heading: "Time Complexity: HashMap vs ArrayList vs LinkedList",
        text: `Choosing the right collection requires understanding their asymptotic time complexities:\n\n1. 'ArrayList':\n• Access by index: O(1) instantaneous\n• Append to end: Amortized O(1)\n• Insert/Delete at beginning: O(N) (requires shifting all subsequent elements)\n• Search by value: O(N)\n\n2. 'LinkedList':\n• Access by index: O(N) (must traverse from head or tail)\n• Insert/Delete at beginning/known node: O(1)\n• Search by value: O(N)\n\n3. 'HashMap':\n• Search by key: O(1) average\n• Insert by key: O(1) average\n• Delete by key: O(1) average\n• Worst-case (all keys collide): O(log N) in modern Java (tree buckets) or O(N)`,
        codeSnippet: `// Quick Reference:
// Operation         ArrayList    LinkedList    HashMap
// ----------------------------------------------------
// get(index/key)      O(1)          O(N)         O(1)
// add(at end)       O(1) amort    O(1)           N/A
// insert(at 0)        O(N)          O(1)         N/A
// contains(val/key)   O(N)          O(N)         O(1)`,
        terminalOutput: `Choose HashMap for fast key lookups.
Choose ArrayList for indexed access and sequential iteration.`,
        tip: "In 95% of real-world scenarios, ArrayList outperforms LinkedList even for mid-list operations because modern CPU caches excel at sequential contiguous memory.",
        mcq: {
          id: "12-2-6",
          question: "Which collection provides O(1) average time complexity for searching an element by key?",
          options: [
            { id: "A", text: "ArrayList" },
            { id: "B", text: "LinkedList" },
            { id: "C", text: "HashMap" },
            { id: "D", text: "TreeSet (without hashing)" }
          ],
          correctAnswer: "C",
          explanationNote: "HashMap provides average O(1) constant time complexity for key lookups, insertions, and deletions via hash calculation."
        },
        questionPool: [
          {
            id: "12-2-6-alt",
            question: "Why is 'arrayList.add(0, item)' an O(N) operation?",
            options: [
              { id: "A", text: "All existing N elements must be shifted right by one position in memory" },
              { id: "B", text: "It requires garbage collection" },
              { id: "C", text: "It triggers a rehash" },
              { id: "D", text: "It must sort the entire array" }
            ],
            correctAnswer: "A",
            explanationNote: "Inserting at index 0 requires shifting every existing element one index to the right in the backing array, requiring O(N) steps."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 12.3: Randomness and Multidimensional Arrays
  // -------------------------------------------------------------
  {
    id: "12-3-randomness-2d-arrays",
    number: "12.3",
    title: "Randomness and Multidimensional Arrays",
    subtitle: "The Random class, pseudo-random generators, 2D matrices, nested loops, and ragged arrays.",
    readTime: "25 min",
    objectives: [
      "Generate pseudo-random integers and doubles using java.util.Random",
      "Produce numbers within a specific bound [0, bound) and custom range [min, max]",
      "Declare and initialize two-dimensional arrays (int[][] matrix = new int[rows][cols])",
      "Traverse, populate, and print 2D grids using nested for-loops",
      "Understand matrix coordinate systems: matrix[row][col] (row-major order)",
      "Explore ragged (jagged) arrays where individual rows have differing lengths"
    ],
    theoryBlocks: [
      {
        heading: "The Random Class in Java",
        text: `Java provides 'java.util.Random' to generate pseudo-random numbers based on a 48-bit seed.\n\nKey methods on Random:\n• 'nextInt()': Returns any pseudo-random 32-bit integer (can be positive or negative).\n• 'nextInt(int bound)': Returns a pseudo-random integer between 0 (inclusive) and 'bound' (exclusive): [0, bound - 1].\n• 'nextDouble()': Returns a pseudorandom double between 0.0 (inclusive) and 1.0 (exclusive): [0.0, 1.0).\n• 'nextBoolean()': Returns true or false with approximately equal probability.\n\nTo generate numbers within a custom range [min, max]:\n'int val = rand.nextInt(max - min + 1) + min;'`,
        codeSnippet: `import java.util.Random;

public class RandomDemo {
    public static void main(String[] args) {
        Random rand = new Random();

        // Roll a 6-sided die: [1, 6]
        int diceRoll = rand.nextInt(6) + 1;
        System.out.println("Dice roll: " + diceRoll);

        // Random percentage [0.0, 100.0)
        double percentage = rand.nextDouble() * 100;
        System.out.printf("Random chance: %.2f%%%n", percentage);

        // Random boolean coin flip:
        boolean coin = rand.nextBoolean();
        System.out.println("Coin flip: " + (coin ? "Heads" : "Tails"));
    }
}`,
        terminalOutput: `Dice roll: 4
Random chance: 73.48%
Coin flip: Heads`,
        tip: "Remember that 'rand.nextInt(10)' returns 0 through 9 (10 numbers total). It NEVER returns 10! The upper bound is strictly exclusive.",
        mcq: {
          id: "12-3-1",
          question: "What is the possible range of values returned by 'random.nextInt(10)'?",
          options: [
            { id: "A", text: "Integers from 1 to 10 inclusive" },
            { id: "B", text: "Integers from 0 to 9 inclusive" },
            { id: "C", text: "Integers from 0 to 10 inclusive" },
            { id: "D", text: "Floating point values between 0.0 and 10.0" }
          ],
          correctAnswer: "B",
          explanationNote: "random.nextInt(bound) generates a uniformly distributed integer from 0 (inclusive) up to bound (exclusive), so nextInt(10) produces 0 through 9."
        },
        questionPool: [
          {
            id: "12-3-1-alt",
            question: "How do you simulate rolling a standard 6-sided die returning an integer from 1 to 6 inclusive?",
            options: [
              { id: "A", text: "random.nextInt(6) + 1" },
              { id: "B", text: "random.nextInt(7)" },
              { id: "C", text: "random.nextInt(1, 6)" },
              { id: "D", text: "random.nextInt(5) + 1" }
            ],
            correctAnswer: "A",
            explanationNote: "random.nextInt(6) gives [0..5]. Adding 1 shifts the range to [1..6]."
          }
        ]
      },
      {
        heading: "Seeded Random Numbers for Reproducibility",
        text: `Computers cannot generate truly random numbers without specialized quantum or atmospheric hardware sensors; they use 'pseudo-random' mathematical algorithms (Linear Congruential Generators).\n\nIf you initialize Random with a specific 'seed' integer:\n'Random rand = new Random(1337);'\n\nThe sequence of generated numbers will be 100% IDENTICAL every time the program runs!\n\nThis is invaluable for:\n• Unit testing (deterministic repeatable tests for algorithms that simulate randomness)\n• Procedural generation in games (e.g. generating the same Minecraft world from a world seed)\n• Reproducible scientific experiments.`,
        codeSnippet: `import java.util.Random;

public class SeededRandomDemo {
    public static void main(String[] args) {
        // Seed 42 guarantees identical output on every run across any computer!
        Random r1 = new Random(42);
        Random r2 = new Random(42);

        System.out.println("R1: " + r1.nextInt(100) + ", " + r1.nextInt(100));
        System.out.println("R2: " + r2.nextInt(100) + ", " + r2.nextInt(100));
    }
}`,
        terminalOutput: `R1: 30, 73
R2: 30, 73`,
        tip: "When you use the default constructor 'new Random()', Java automatically seeds it with System.nanoTime() mixed with an atomic counter so each run is different.",
        mcq: {
          id: "12-3-2",
          question: "What happens when two separate 'new Random(42)' instances are created with the exact same seed?",
          options: [
            { id: "A", text: "They generate completely different unpredictable numbers" },
            { id: "B", text: "They generate the exact same sequence of pseudo-random numbers in the same order" },
            { id: "C", text: "The JVM throws a DuplicateSeedException" },
            { id: "D", text: "Both generators will only ever return the number 42" }
          ],
          correctAnswer: "B",
          explanationNote: "Supplying a fixed seed initializes the pseudo-random formula to a deterministic starting state, producing identical sequences."
        },
        questionPool: [
          {
            id: "12-3-2-alt",
            question: "Why are seeded random generators particularly useful in unit testing?",
            options: [
              { id: "A", text: "They run 10x faster than unseeded generators" },
              { id: "B", text: "They ensure tests are deterministic and reproducible rather than flaky" },
              { id: "C", text: "They bypass memory allocation" },
              { id: "D", text: "They automatically mock network calls" }
            ],
            correctAnswer: "B",
            explanationNote: "Seeded generators eliminate randomness variability, making unit tests deterministic and reproducible across builds."
          }
        ]
      },
      {
        heading: "Declaring and Allocating Two-Dimensional Arrays",
        text: `In Java, a two-dimensional array is literally an 'array of arrays'. It can be visualized as a grid, matrix, or spreadsheet of rows and columns.\n\nSyntax:\nint[][] matrix = new int[rows][columns];\n\nExample:\nint[][] grid = new int[3][4]; // 3 rows, 4 columns (12 total cells)\n\nMemory initialization:\nWhen allocated, all elements are automatically initialized to their default values (0 for int, false for boolean, null for reference types).\n\nDirect inline initialization:\nint[][] matrix = {\n    { 1, 2, 3 },\n    { 4, 5, 6 },\n    { 7, 8, 9 }\n};`,
        codeSnippet: `public class MatrixInitDemo {
    public static void main(String[] args) {
        // Allocate 2 rows, 3 columns:
        int[][] board = new int[2][3];

        board[0][0] = 10;
        board[0][1] = 20;
        board[0][2] = 30;
        board[1][0] = 40;
        board[1][1] = 50;
        board[1][2] = 60;

        System.out.println("Rows: " + board.length);
        System.out.println("Cols in row 0: " + board[0].length);
        System.out.println("Cell [1][2]: " + board[1][2]);
    }
}`,
        terminalOutput: `Rows: 2
Cols in row 0: 3
Cell [1][2]: 60`,
        tip: "Remember: 'matrix.length' gives the number of rows. 'matrix[row].length' gives the number of columns in that specific row.",
        mcq: {
          id: "12-3-3",
          question: "Given 'int[][] grid = new int[4][7];', what does 'grid.length' evaluate to?",
          options: [
            { id: "A", text: "7 (the column count)" },
            { id: "B", text: "28 (the total cell count)" },
            { id: "C", text: "4 (the row count)" },
            { id: "D", text: "0" }
          ],
          correctAnswer: "C",
          explanationNote: "In Java, grid.length returns the length of the outer array, which corresponds to the number of rows (4)."
        },
        questionPool: [
          {
            id: "12-3-3-alt",
            question: "How do you access the element located at row index 2 and column index 3 in a 2D array?",
            options: [
              { id: "A", text: "array[2, 3]" },
              { id: "B", text: "array[2][3]" },
              { id: "C", text: "array.get(2, 3)" },
              { id: "D", text: "array[3][2]" }
            ],
            correctAnswer: "B",
            explanationNote: "Java uses row-major double bracket indexing: array[row][col] — in this case array[2][3]."
          }
        ]
      },
      {
        heading: "Traversing 2D Grids with Nested Loops",
        text: `Iterating over all cells in a 2D array is typically accomplished using two nested for-loops:\n• The outer loop iterates through each row index: 'row' from 0 to 'grid.length - 1'.\n• The inner loop iterates through each column index in that row: 'col' from 0 to 'grid[row].length - 1'.\n\nThis pattern is known as 'Row-Major Traversal'. It matches how computer memory caches data sequentially, delivering maximum performance.`,
        codeSnippet: `public class GridTraversal {
    public static void printMatrix(int[][] matrix) {
        for (int row = 0; row < matrix.length; row++) {
            for (int col = 0; col < matrix[row].length; col++) {
                System.out.print(matrix[row][col] + " ");
            }
            System.out.println(); // New line after each row
        }
    }

    public static int sumMatrix(int[][] matrix) {
        int total = 0;
        for (int[] row : matrix) {
            for (int val : row) {
                total += val;
            }
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] sample = {
            { 1, 2, 3 },
            { 4, 5, 6 }
        };
        printMatrix(sample);
        System.out.println("Total sum: " + sumMatrix(sample));
    }
}`,
        terminalOutput: `1 2 3 
4 5 6 
Total sum: 21`,
        tip: "Enhanced for-each loops work seamlessly with 2D arrays: 'for (int[] row : matrix)' extracts each row, and 'for (int val : row)' extracts each individual cell value!",
        mcq: {
          id: "12-3-4",
          question: "In standard row-major nested loop traversal of a 2D array, which index does the outer loop typically iterate over?",
          options: [
            { id: "A", text: "The row index (row = 0 to matrix.length - 1)" },
            { id: "B", text: "The column index" },
            { id: "C", text: "The diagonal index" },
            { id: "D", text: "The random seed" }
          ],
          correctAnswer: "A",
          explanationNote: "Row-major traversal iterates row by row in the outer loop, and through the columns of each row in the inner loop."
        },
        questionPool: [
          {
            id: "12-3-4-alt",
            question: "What does the outer loop variable 'row' represent in 'for (int[] row : matrix)'?",
            options: [
              { id: "A", text: "A single 1-dimensional array representing an entire row of values" },
              { id: "B", text: "A single integer cell" },
              { id: "C", text: "The number of rows in the matrix" },
              { id: "D", text: "A column vector" }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, a 2D array is an array of 1D arrays; iterating over matrix yields each 1D int[] row."
          }
        ]
      },
      {
        heading: "Ragged (Jagged) Arrays",
        text: `Because Java implements multidimensional arrays as arrays of array references, individual rows do NOT have to have identical lengths!\n\nAn array where different rows have differing column lengths is called a 'ragged array' (or jagged array).\n\nCreating a ragged array:\nint[][] triangle = new int[3][]; // Allocate 3 rows, but columns not yet created\ntriangle[0] = new int[1]; // Row 0 has 1 column\ntriangle[1] = new int[2]; // Row 1 has 2 columns\ntriangle[2] = new int[3]; // Row 2 has 3 columns\n\nRagged arrays are memory-efficient for triangular matrices, pyramid data, or tabular datasets where different rows have varying numbers of recordings.`,
        codeSnippet: `public class RaggedArrayDemo {
    public static void main(String[] args) {
        int[][] jagged = {
            { 1 },
            { 2, 3 },
            { 4, 5, 6 },
            { 7, 8, 9, 10 }
        };

        for (int i = 0; i < jagged.length; i++) {
            System.out.println("Row " + i + " length: " + jagged[i].length);
        }
    }
}`,
        terminalOutput: `Row 0 length: 1
Row 1 length: 2
Row 2 length: 3
Row 3 length: 4`,
        tip: "Always use 'matrix[row].length' rather than assuming every row has 'matrix[0].length' columns; otherwise, ragged arrays will throw an ArrayIndexOutOfBoundsException.",
        mcq: {
          id: "12-3-5",
          question: "What is a 'ragged array' (jagged array) in Java?",
          options: [
            { id: "A", text: "An array that contains corrupted memory" },
            { id: "B", text: "A 2D array where different rows have different lengths" },
            { id: "C", text: "An array that cannot be resized" },
            { id: "D", text: "An array sorted in descending order" }
          ],
          correctAnswer: "B",
          explanationNote: "A ragged array is a multidimensional array in which the member arrays (rows) can have different sizes."
        },
        questionPool: [
          {
            id: "12-3-5-alt",
            question: "Why does Java support ragged arrays natively?",
            options: [
              { id: "A", text: "Because multidimensional arrays in Java are arrays of array references, each allocated independently" },
              { id: "B", text: "Because C++ did not support them" },
              { id: "C", text: "Because primitive types cannot be grouped" },
              { id: "D", text: "It is an accidental compiler bug" }
            ],
            correctAnswer: "A",
            explanationNote: "In Java, a 2D array is an array containing references to independent 1D array objects on the heap, allowing each row to be any size."
          }
        ]
      },
      {
        heading: "Practical Application: Game Boards and 2D Grids",
        text: `2D arrays are the standard foundation for board games, simulations, and graphics grids (such as Tic-Tac-Toe, Chess, Conway's Game of Life, or Sudoku).\n\nKey techniques:\n• Boundary checking: Before accessing 'grid[r][c]', always verify that 'r >= 0 && r < grid.length && c >= 0 && c < grid[r].length' to prevent IndexOutOfBoundsException.\n• Neighbor checking: In grid simulations, an element at '(r, c)' has up to 8 neighbors, accessed with delta offsets: 'for (int dr = -1; dr <= 1; dr++) for (int dc = -1; dc <= 1; dc++)'.`,
        codeSnippet: `public class TicTacToeBoard {
    private char[][] board;

    public TicTacToeBoard() {
        this.board = new char[3][3];
        for (int r = 0; r < 3; r++) {
            for (int c = 0; c < 3; c++) {
                board[r][c] = '-';
            }
        }
    }

    public boolean placePiece(int row, int col, char piece) {
        if (row < 0 || row >= 3 || col < 0 || col >= 3) {
            return false; // Out of bounds
        }
        if (board[row][col] != '-') {
            return false; // Already occupied
        }
        board[row][col] = piece;
        return true;
    }
}`,
        terminalOutput: `TicTacToeBoard game = new TicTacToeBoard();
game.placePiece(1, 1, 'X');
System.out.println("Move placed at center!");
// Output: Move placed at center!`,
        tip: "Always guard grid coordinates with boundary validation checks before indexing into arrays.",
        mcq: {
          id: "12-3-6",
          question: "Which condition properly checks whether row 'r' and column 'c' are valid coordinates within a rectangular matrix 'int[][] m'?",
          options: [
            { id: "A", text: "r > 0 && c > 0" },
            { id: "B", text: "r >= 0 && r < m.length && c >= 0 && c < m[0].length" },
            { id: "C", text: "r <= m.length && c <= m.length" },
            { id: "D", text: "m.contains(r, c)" }
          ],
          correctAnswer: "B",
          explanationNote: "Valid row indices are 0 to m.length - 1, and valid column indices are 0 to m[0].length - 1."
        },
        questionPool: [
          {
            id: "12-3-6-alt",
            question: "What exception is thrown if you attempt to access 'grid[-1][0]'?",
            options: [
              { id: "A", text: "NullPointerException" },
              { id: "B", text: "ArrayIndexOutOfBoundsException" },
              { id: "C", text: "IllegalArgumentException" },
              { id: "D", text: "ArithmeticException" }
            ],
            correctAnswer: "B",
            explanationNote: "Negative indices are out of bounds in Java and trigger an ArrayIndexOutOfBoundsException."
          }
        ]
      }
    ]
  }
];

// Helper functions for state, pools, and streak tracking

export function getActiveQuestionsForLevelPart12(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part12_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart12(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part12_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart12(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part12_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart12(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part12_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart12(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part12_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart12 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart12(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart12 {
  const attemptKey = `dopilot_java_part12_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part12_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part12_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart12(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart12(studentId);
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
