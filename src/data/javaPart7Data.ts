// src/data/javaPart7Data.ts
// Helsinki MOOC Java Programming Part 7: Algorithms, Searching, Sorting, and Larger Systems

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

export const PART_7_SECTIONS: SectionContent[] = [
  // -------------------------------------------------------------
  // LEVEL 7.1: Searching Algorithms (Linear & Binary Search)
  // -------------------------------------------------------------
  {
    id: "7-1-searching",
    number: "7.1",
    title: "Searching Algorithms",
    subtitle: "Linear search, binary search, logarithmic halving, Big-O complexity, and Collections.binarySearch().",
    readTime: "25 min",
    objectives: [
      "Implement and analyze linear search on unsorted collections with O(n) worst-case complexity",
      "Understand why binary search requires a pre-sorted list or array to function",
      "Trace binary search index halving and compute logarithmic step counts (O(log n))",
      "Safely calculate the middle index: left + (right - left) / 2 to avoid integer overflow",
      "Interpret the return values of Collections.binarySearch() and negative insertion indexes",
      "Identify when sorting before searching is computationally justified versus linear search"
    ],
    theoryBlocks: [
      {
        heading: "Linear Search and O(N) Worst Case",
        text: "Linear search examines each item sequentially from the first index to the last until the target is found or the end of the collection is reached. Because it checks elements one by one without relying on ordering, it works on any unsorted list or array.",
        codeSnippet: "public static int linearSearch(ArrayList<Integer> list, int target) {\n    for (int i = 0; i < list.size(); i++) {\n        if (list.get(i) == target) {\n            return i; // Found at index i\n        }\n    }\n    return -1; // Not found\n}",
        terminalOutput: "ArrayList: [42, 17, 99, 8, 23]\nlinearSearch(list, 99) -> returns index 2\nlinearSearch(list, 100) -> returns -1 (5 comparisons)",
        tip: "Linear search is the simplest search algorithm and is ideal for small collections or when searching an unsorted collection exactly once.",
        warning: "In the worst case (the element is at the very end or absent), linear search visits all N items, requiring O(N) comparisons.",
        mcq: {
          id: "j7-1-1",
          question: "What is the worst-case time complexity of linear search when searching an array of N elements?",
          options: [
            { id: "A", text: "O(N), because in the worst case every single element must be checked", explanationIfWrong: "" },
            { id: "B", text: "O(1), because the element is found immediately", explanationIfWrong: "O(1) is the best case, not the worst case." },
            { id: "C", text: "O(log N), because elements are divided in half", explanationIfWrong: "Linear search does not divide elements in half." },
            { id: "D", text: "O(N^2), because of nested loops", explanationIfWrong: "Linear search uses a single loop, not nested loops." }
          ],
          correctAnswer: "A",
          explanationNote: "Linear search must inspect all N items sequentially in the worst case, giving linear O(N) time complexity."
        },
        questionPool: [
          {
            id: "j7-1-1-alt1",
            question: "When is linear search strictly preferable over binary search?",
            options: [
              { id: "A", text: "When the collection is unsorted and you only need to perform a single search", explanationIfWrong: "" },
              { id: "B", text: "When searching an array with 10 million pre-sorted records", explanationIfWrong: "Binary search is vastly superior on large sorted arrays." },
              { id: "C", text: "When you want O(log N) runtime guarantees", explanationIfWrong: "Linear search is O(N), not O(log N)." },
              { id: "D", text: "Never under any circumstances", explanationIfWrong: "Linear search is preferred when sorting beforehand costs more than searching." }
            ],
            correctAnswer: "A",
            explanationNote: "Sorting an unsorted list takes O(N log N). For a single search, O(N) linear search is faster than sorting first."
          },
          {
            id: "j7-1-1-alt2",
            question: "What does linear search return if the target element does not exist in the collection?",
            options: [
              { id: "A", text: "Commonly -1, indicating the element was not found", explanationIfWrong: "" },
              { id: "B", text: "It throws an ElementNotFoundException", explanationIfWrong: "Standard search functions return an indicator value like -1." },
              { id: "C", text: "It returns 0", explanationIfWrong: "0 is a valid array index (the first element)." },
              { id: "D", text: "It returns Integer.MAX_VALUE", explanationIfWrong: "-1 is the universal convention in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "-1 is universally recognized in Java (e.g. String.indexOf, Collections.indexOf) as 'not found'."
          }
        ]
      },
      {
        heading: "Binary Search & The Sorted Precondition",
        text: "Binary search is an algorithm that searches a sorted list by repeatedly dividing the search interval in half. It begins by comparing the target with the middle element. If the target matches, its index is returned. If the target is smaller, search continues in the left half; if larger, in the right half.",
        codeSnippet: "public static int binarySearch(int[] arr, int target) {\n    int left = 0;\n    int right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}",
        terminalOutput: "Sorted: [3, 7, 12, 19, 25, 38, 44]\nSearch 25: mid=19 (<25) -> left half discarded -> mid=25 -> Found index 4!",
        tip: "Binary search only works on sorted collections! If invoked on unsorted data, it will discard sections containing the target.",
        warning: "Never invoke binary search without ensuring the list is already sorted in ascending order.",
        mcq: {
          id: "j7-1-2",
          question: "What is the absolute mandatory requirement for binary search to function correctly?",
          options: [
            { id: "A", text: "The elements in the collection must be sorted in ascending order", explanationIfWrong: "" },
            { id: "B", text: "The array must contain an even number of elements", explanationIfWrong: "Binary search works on arrays of any size, even or odd." },
            { id: "C", text: "The array must contain only positive integers", explanationIfWrong: "Negative numbers and objects can be binary searched." },
            { id: "D", text: "All elements must be prime numbers", explanationIfWrong: "Values can be any comparable data." }
          ],
          correctAnswer: "A",
          explanationNote: "Binary search depends on order: knowing that smaller items reside to the left and larger items to the right is what allows it to safely eliminate half of the elements."
        },
        questionPool: [
          {
            id: "j7-1-2-alt1",
            question: "What happens if you run binary search on an unsorted array?",
            options: [
              { id: "A", text: "The algorithm may incorrectly report that an existing element is not found because it eliminated the wrong half", explanationIfWrong: "" },
              { id: "B", text: "Java automatically sorts the array during the search", explanationIfWrong: "Binary search does not modify or sort the array." },
              { id: "C", text: "A CompilationError occurs", explanationIfWrong: "It compiles without issues; the error is logical at runtime." },
              { id: "D", text: "It executes in O(N^2) time", explanationIfWrong: "It still halves the array, but yields wrong results." }
            ],
            correctAnswer: "A",
            explanationNote: "Without sorted ordering, the decision to discard the left or right half is arbitrary, causing existing elements to be missed."
          },
          {
            id: "j7-1-2-alt2",
            question: "In binary search, if arr[mid] < target, which pointer is updated and how?",
            options: [
              { id: "A", text: "left = mid + 1, narrowing the search to the right sub-array", explanationIfWrong: "" },
              { id: "B", text: "right = mid - 1", explanationIfWrong: "That is done when arr[mid] > target." },
              { id: "C", text: "left = 0", explanationIfWrong: "Setting left to 0 would restart from the beginning." },
              { id: "D", text: "mid = target", explanationIfWrong: "mid is an index, not a value." }
            ],
            correctAnswer: "A",
            explanationNote: "Since arr[mid] is smaller than target, the target must lie to the right of mid in a sorted array, so left = mid + 1."
          }
        ]
      },
      {
        heading: "Logarithmic Growth and O(log N) Efficiency",
        text: "Because binary search eliminates half of the remaining items with every comparison, the number of required steps grows logarithmically: O(log2 N). For an array of 1,024 elements, at most 11 comparisons are required (log2(1024) = 10). For 1 billion elements, only ~30 comparisons are required!",
        codeSnippet: "// Search space reduction for N = 1024:\n// Step 1: 1024 -> 512\n// Step 2: 512  -> 256\n// Step 3: 256  -> 128\n// Step 4: 128  -> 64\n// Step 5: 64   -> 32\n// Step 6: 32   -> 16\n// Step 7: 16   -> 8\n// Step 8: 8    -> 4\n// Step 9: 4    -> 2\n// Step 10: 2   -> 1\n// Step 11: Found or absent!",
        terminalOutput: "Linear Search: 1,000,000,000 operations worst case\nBinary Search: ~30 operations worst case",
        tip: "O(log N) represents exponential efficiency: doubling the data size adds only 1 additional comparison step.",
        warning: "Never use linear search on large sorted datasets when logarithmic binary search is available.",
        mcq: {
          id: "j7-1-3",
          question: "For a sorted list containing 1,024 elements, what is the maximum number of comparisons binary search needs in the worst case?",
          options: [
            { id: "A", text: "At most 11 comparisons (since 2^10 = 1024)", explanationIfWrong: "" },
            { id: "B", text: "1,024 comparisons", explanationIfWrong: "1,024 comparisons would be linear search." },
            { id: "C", text: "512 comparisons", explanationIfWrong: "Halving repeatedly shrinks 1024 to 1 in 10-11 steps." },
            { id: "D", text: "100 comparisons", explanationIfWrong: "log2(1024) is 10." }
          ],
          correctAnswer: "A",
          explanationNote: "Because 2^10 = 1024, binary search will narrow 1,024 items down to a single element in at most 10 to 11 comparisons."
        },
        questionPool: [
          {
            id: "j7-1-3-alt1",
            question: "If the number of items in a sorted array is quadrupled from N to 4N, how many additional comparisons does binary search need?",
            options: [
              { id: "A", text: "Exactly 2 additional comparisons (since log2(4) = 2)", explanationIfWrong: "" },
              { id: "B", text: "4 times as many comparisons", explanationIfWrong: "That would be linear search O(N), not logarithmic." },
              { id: "C", text: "16 additional comparisons", explanationIfWrong: "Logarithmic growth increases by only 1 step per 2x increase." },
              { id: "D", text: "Half as many comparisons", explanationIfWrong: "More elements always require equal or more comparisons." }
            ],
            correctAnswer: "A",
            explanationNote: "log2(4N) = log2(N) + log2(4) = log2(N) + 2. Quadrupling the dataset size adds only 2 comparisons!"
          },
          {
            id: "j7-1-3-alt2",
            question: "Approximately how many comparisons does binary search need to find a value in a sorted list of 1 million items?",
            options: [
              { id: "A", text: "Around 20 comparisons (since 2^20 ≈ 1,048,576)", explanationIfWrong: "" },
              { id: "B", text: "500,000 comparisons", explanationIfWrong: "500,000 is the average for linear search, not binary search." },
              { id: "C", text: "1,000 comparisons", explanationIfWrong: "log2(1,000,000) is ~20, not 1,000." },
              { id: "D", text: "1 million comparisons", explanationIfWrong: "1 million is linear search worst case." }
            ],
            correctAnswer: "A",
            explanationNote: "2^20 = 1,048,576. Binary search handles 1 million items in approximately 20 checks."
          }
        ]
      },
      {
        heading: "Preventing Integer Overflow in Middle Index",
        text: "When implementing binary search, many beginners write 'int mid = (left + right) / 2;'. However, if 'left + right' exceeds 2,147,483,647 (Integer.MAX_VALUE), 32-bit signed integer overflow occurs and becomes negative, throwing an ArrayIndexOutOfBoundsException! The safe formula is 'left + (right - left) / 2;'.",
        codeSnippet: "// RISKY (Overflow bug):\nint left = 1_500_000_000;\nint right = 2_000_000_000;\nint badMid = (left + right) / 2; // Sum overflows to -794,967,296 -> Crash!\n\n// SAFE:\nint safeMid = left + (right - left) / 2; // Computes 1,750,000,000 cleanly",
        terminalOutput: "Integer.MAX_VALUE = 2147483647\nSafe formula avoids negative indices!",
        tip: "Joshua Bloch documented this bug in 2006, showing it existed undetected in standard libraries for nearly 20 years.",
        warning: "Always write 'left + (right - left) / 2' in production binary search algorithms.",
        mcq: {
          id: "j7-1-4",
          question: "Why is 'int mid = left + (right - left) / 2;' preferred over '(left + right) / 2;' in Java binary search?",
          options: [
            { id: "A", text: "It prevents 32-bit signed integer overflow when left + right exceeds Integer.MAX_VALUE", explanationIfWrong: "" },
            { id: "B", text: "It calculates floating-point values with higher precision", explanationIfWrong: "Indices are integer values, not floating-point." },
            { id: "C", text: "It runs twice as fast in the JVM bytecode", explanationIfWrong: "Both take negligible nanoseconds; the difference is correctness." },
            { id: "D", text: "Java does not support parentheses around addition", explanationIfWrong: "Java fully supports parentheses in arithmetic expressions." }
          ],
          correctAnswer: "A",
          explanationNote: "When left + right exceeds Integer.MAX_VALUE, the sum wraps around into a negative number, causing ArrayIndexOutOfBoundsException. Calculating right - left first prevents this."
        },
        questionPool: [
          {
            id: "j7-1-4-alt1",
            question: "What exception is thrown if integer overflow causes the calculated mid index to become negative in an array access?",
            options: [
              { id: "A", text: "ArrayIndexOutOfBoundsException", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "The array is not null; the index is invalid." },
              { id: "C", text: "ArithmeticException", explanationIfWrong: "Division by zero throws ArithmeticException, not negative array indexing." },
              { id: "D", text: "ClassCastException", explanationIfWrong: "No casting is involved in array indexing." }
            ],
            correctAnswer: "A",
            explanationNote: "Negative indices are out of bounds in Java arrays and throw ArrayIndexOutOfBoundsException."
          },
          {
            id: "j7-1-4-alt2",
            question: "What bitwise operator trick can also safely compute the average of two non-negative integers without overflow?",
            options: [
              { id: "A", text: "(left + right) >>> 1 (unsigned right shift)", explanationIfWrong: "" },
              { id: "B", text: "left ^ right", explanationIfWrong: "^ is bitwise XOR, not division." },
              { id: "C", text: "left & right", explanationIfWrong: "& is bitwise AND." },
              { id: "D", text: "(left + right) << 1", explanationIfWrong: "<< 1 multiplies by 2, not divides." }
            ],
            correctAnswer: "A",
            explanationNote: "Unsigned right shift >>> treats the sign bit as a value bit, correctly dividing the 32-bit sum without sign inversion."
          }
        ]
      },
      {
        heading: "Collections.binarySearch() and Negative Return Values",
        text: "Java provides 'Collections.binarySearch(list, key)' for ArrayLists and 'Arrays.binarySearch(arr, key)' for arrays. If the key is found, its index is returned. If the key is NOT found, it returns a negative number: '-(insertion_point) - 1', where insertion_point is where the key would be inserted while preserving order.",
        codeSnippet: "ArrayList<Integer> numbers = new ArrayList<>(List.of(10, 20, 30, 40));\nint foundIdx = Collections.binarySearch(numbers, 30); // returns 2\n\nint absentIdx = Collections.binarySearch(numbers, 25); \n// 25 belongs at index 2.\n// Formula: -(2) - 1 = -3!\nif (absentIdx < 0) {\n    int insertAt = -absentIdx - 1; // 2\n    numbers.add(insertAt, 25);\n}",
        terminalOutput: "Found: index 2\nAbsent: returned -3 -> insertAt index 2 -> list: [10, 20, 25, 30, 40]",
        tip: "Check 'if (index >= 0)' to determine if an element was found.",
        warning: "If the list is not sorted before calling Collections.binarySearch(), the return value is undefined.",
        mcq: {
          id: "j7-1-5",
          question: "What does Collections.binarySearch() return if the searched key is NOT in the sorted list?",
          options: [
            { id: "A", text: "A negative value: -(insertion point) - 1, encoding where the item belongs", explanationIfWrong: "" },
            { id: "B", text: "Always -1 regardless of where the item would belong", explanationIfWrong: "String.indexOf returns -1, but binarySearch encodes the insertion point." },
            { id: "C", text: "null", explanationIfWrong: "binarySearch returns an int primitive, not an object reference." },
            { id: "D", text: "It throws a NoSuchElementException", explanationIfWrong: "It returns a negative integer instead of throwing an exception." }
          ],
          correctAnswer: "A",
          explanationNote: "The returned value -(insertion_point) - 1 allows callers to both verify absence and immediately insert the element into its sorted position."
        },
        questionPool: [
          {
            id: "j7-1-5-alt1",
            question: "Given a sorted list [10, 20, 30, 40], what does Collections.binarySearch(list, 5) return?",
            options: [
              { id: "A", text: "-1 (since 5 belongs at index 0: -(0) - 1 = -1)", explanationIfWrong: "" },
              { id: "B", text: "0", explanationIfWrong: "0 would mean 5 was found at index 0." },
              { id: "C", text: "-5", explanationIfWrong: "The insertion point is 0, not 4." },
              { id: "D", text: "-4", explanationIfWrong: "Formula is -(0) - 1 = -1." }
            ],
            correctAnswer: "A",
            explanationNote: "5 is smaller than all items, so its insertion point is index 0. The return value is -(0) - 1 = -1."
          },
          {
            id: "j7-1-5-alt2",
            question: "How do you recover the exact insertion index from a negative binarySearch result 'int idx'?",
            options: [
              { id: "A", text: "-idx - 1", explanationIfWrong: "" },
              { id: "B", text: "Math.abs(idx)", explanationIfWrong: "If idx = -1, Math.abs(-1) = 1, but insertion point was 0!" },
              { id: "C", text: "idx * -1", explanationIfWrong: "Negating alone does not reverse the - 1 offset." },
              { id: "D", text: "idx + 1", explanationIfWrong: "idx is negative, so idx + 1 would remain negative or 0." }
            ],
            correctAnswer: "A",
            explanationNote: "Algebraically: idx = -insertPoint - 1 => insertPoint = -idx - 1."
          }
        ]
      },
      {
        heading: "Search Cost Amortization & Strategy",
        text: "Sorting an unsorted list of N items takes O(N log N) time. If you only search once, linear search O(N) is much faster than sorting first. However, if you perform M queries on the same collection, sorting once in O(N log N) and running M binary searches in O(M log N) is orders of magnitude faster than M linear searches O(M * N).",
        codeSnippet: "// Cost Comparison for 100,000 items & 1,000 queries:\n// Strategy 1 (Repeated Linear Search):\n// 1,000 * 100,000 = 100,000,000 comparisons!\n\n// Strategy 2 (Sort once + Binary Search):\n// Sort: 100,000 * log2(100,000) ≈ 1,660,000 ops\n// 1,000 Binary searches: 1,000 * 17 ≈ 17,000 ops\n// Total: ~1,677,000 ops (~60x FASTER!)",
        terminalOutput: "1 Query: Linear Search wins\n1,000 Queries: Sort once + Binary Search dominates",
        tip: "Amortization means spreading the upfront cost of sorting across numerous future fast lookups.",
        warning: "Don't sort before every search! Sort once, then perform all queries.",
        mcq: {
          id: "j7-1-6",
          question: "You have an unsorted list of 500,000 items and need to execute exactly ONE search. Which approach is computationally faster?",
          options: [
            { id: "A", text: "Run a direct linear search without sorting first", explanationIfWrong: "" },
            { id: "B", text: "Sort the list with Collections.sort() first, then binary search", explanationIfWrong: "Sorting takes ~9.5 million operations, while linear search takes at most 500,000." },
            { id: "C", text: "Reverse the list twice and run binary search", explanationIfWrong: "Reversing does not sort the list." },
            { id: "D", text: "Both take the exact same time", explanationIfWrong: "Sorting first is nearly 20 times slower for a single search." }
          ],
          correctAnswer: "A",
          explanationNote: "For a single search, sorting first costs O(N log N), which is much more expensive than the O(N) cost of a single linear scan."
        },
        questionPool: [
          {
            id: "j7-1-6-alt1",
            question: "When does sorting an unsorted collection before searching become advantageous?",
            options: [
              { id: "A", text: "When you will perform multiple searches on the dataset, amortizing the sort cost", explanationIfWrong: "" },
              { id: "B", text: "When you only search once for one item", explanationIfWrong: "For one search, linear search is faster." },
              { id: "C", text: "Only when the collection has fewer than 3 items", explanationIfWrong: "Small lists show negligible difference." },
              { id: "D", text: "When the computer runs out of disk space", explanationIfWrong: "RAM and time complexity dictate the decision." }
            ],
            correctAnswer: "A",
            explanationNote: "Repeated binary searches easily amortize the initial O(N log N) sorting overhead."
          },
          {
            id: "j7-1-6-alt2",
            question: "What is the time complexity of running M binary searches on a pre-sorted list of N elements?",
            options: [
              { id: "A", text: "O(M * log N)", explanationIfWrong: "" },
              { id: "B", text: "O(M * N)", explanationIfWrong: "O(M * N) would be M linear searches." },
              { id: "C", text: "O(N^2)", explanationIfWrong: "Binary search never degrades to quadratic." },
              { id: "D", text: "O(1)", explanationIfWrong: "Each search takes logarithmic time." }
            ],
            correctAnswer: "A",
            explanationNote: "Each binary search costs O(log N). Performing M searches results in O(M log N)."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 7.2: Sorting Algorithms (Selection Sort & Built-in Sort)
  // -------------------------------------------------------------
  {
    id: "7-2-sorting",
    number: "7.2",
    title: "Sorting Algorithms",
    subtitle: "Selection sort, in-place swapping, Comparable<T>, compareTo contract, Dual-Pivot Quicksort and Timsort.",
    readTime: "25 min",
    objectives: [
      "Implement Selection Sort by finding the smallest remaining element and swapping in-place",
      "Analyze the O(N^2) quadratic comparison complexity of Selection Sort",
      "Implement the classic 3-step value swapping pattern using a temporary variable",
      "Implement the Comparable<T> interface and write correct compareTo(T other) methods",
      "Understand Dual-Pivot Quicksort for primitives and Timsort for object collections",
      "Format arrays for terminal display using Arrays.toString() instead of default memory hashes"
    ],
    theoryBlocks: [
      {
        heading: "Selection Sort Mechanics & In-Place Ordering",
        text: "Selection sort is an intuitive comparison sorting algorithm. It divides the array into a sorted subarray at the left and an unsorted subarray at the right. In each iteration, it finds the smallest element in the unsorted subarray and swaps it with the leftmost unsorted element, moving the boundary one step to the right.",
        codeSnippet: "public static void selectionSort(int[] array) {\n    for (int i = 0; i < array.length - 1; i++) {\n        int smallestIndex = i;\n        for (int j = i + 1; j < array.length; j++) {\n            if (array[j] < array[smallestIndex]) {\n                smallestIndex = j;\n            }\n        }\n        // Swap array[i] with array[smallestIndex]\n        int temp = array[i];\n        array[i] = array[smallestIndex];\n        array[smallestIndex] = temp;\n    }\n}",
        terminalOutput: "Initial: [8, 3, 7, 2]\nPass 0 (swap 8 & 2): [2, 3, 7, 8]\nPass 1 (3 is smallest): [2, 3, 7, 8]\nPass 2 (7 is smallest): [2, 3, 7, 8] -> Sorted!",
        tip: "Selection sort performs at most N - 1 swaps, making it useful when the cost of writing to memory is extremely high.",
        warning: "Selection sort always performs O(N^2) comparisons, even if the array is already sorted.",
        mcq: {
          id: "j7-2-1",
          question: "What is the time complexity of Selection Sort in both the average and worst cases?",
          options: [
            { id: "A", text: "O(N^2), because it uses two nested loops making N*(N-1)/2 comparisons", explanationIfWrong: "" },
            { id: "B", text: "O(N log N)", explanationIfWrong: "Quicksort and mergesort achieve O(N log N), not selection sort." },
            { id: "C", text: "O(N)", explanationIfWrong: "Selection sort requires quadratic comparisons." },
            { id: "D", text: "O(1)", explanationIfWrong: "O(1) is constant time." }
          ],
          correctAnswer: "A",
          explanationNote: "Selection sort executes nested loops: the outer loop runs N times and the inner scans remaining items, totaling N*(N-1)/2 comparisons, which is O(N^2)."
        },
        questionPool: [
          {
            id: "j7-2-1-alt1",
            question: "How many swaps does selection sort perform on an array of length N in the worst case?",
            options: [
              { id: "A", text: "At most N - 1 swaps", explanationIfWrong: "" },
              { id: "B", text: "N^2 swaps", explanationIfWrong: "Comparisons are N^2, but swaps occur only once per outer loop pass (at most N - 1)." },
              { id: "C", text: "N * log N swaps", explanationIfWrong: "Swaps are bounded by the outer loop iterations." },
              { id: "D", text: "0 swaps", explanationIfWrong: "Swaps are needed to reorder unsorted arrays." }
            ],
            correctAnswer: "A",
            explanationNote: "One swap occurs per outer loop iteration, so selection sort performs at most N - 1 swaps total."
          },
          {
            id: "j7-2-1-alt2",
            question: "If an array of 1,000 items is ALREADY sorted, how many comparisons does standard selection sort perform?",
            options: [
              { id: "A", text: "Around 500,000 comparisons (N*(N-1)/2) because it still scans the unsorted portion every pass", explanationIfWrong: "" },
              { id: "B", text: "Only 1 comparison", explanationIfWrong: "Selection sort does not detect existing sortedness." },
              { id: "C", text: "0 comparisons", explanationIfWrong: "The inner loop runs unconditionally." },
              { id: "D", text: "1,000 comparisons", explanationIfWrong: "The nested loops still execute." }
            ],
            correctAnswer: "A",
            explanationNote: "Standard selection sort does not short-circuit: it always scans to find the minimum, taking quadratic comparisons regardless of initial order."
          }
        ]
      },
      {
        heading: "Swapping Elements with Temporary Variable",
        text: "In Java, swapping two elements in an array requires a temporary variable ('temp'). If you write 'arr[i] = arr[j];' first, the original value of 'arr[i]' is permanently erased and overwritten before it can be assigned to 'arr[j]'.",
        codeSnippet: "int[] numbers = {10, 20, 30};\n\n// 3-Step Swap of index 0 and index 2:\nint temp = numbers[0]; // Step 1: Save 10 in temp\nnumbers[0] = numbers[2]; // Step 2: Overwrite index 0 with 30\nnumbers[2] = temp;       // Step 3: Put saved 10 into index 2\n\n// Result: numbers is now {30, 20, 10}",
        terminalOutput: "Before: [10, 20, 30]\nAfter Swap: [30, 20, 10]",
        tip: "Think of swapping two glasses filled with liquid: you need an empty third glass to hold one liquid temporarily while transferring.",
        warning: "Never write 'a = b; b = a;' — both variables will end up having the value of b!",
        mcq: {
          id: "j7-2-2",
          question: "What is the correct 3-step sequence to swap elements at indices i and j in an array arr?",
          options: [
            { id: "A", text: "int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;", explanationIfWrong: "" },
            { id: "B", text: "arr[i] = arr[j]; arr[j] = arr[i];", explanationIfWrong: "This permanently overwrites arr[i] with arr[j], duplicating arr[j]." },
            { id: "C", text: "arr[j] = arr[i]; arr[i] = arr[j];", explanationIfWrong: "This duplicates arr[i] into both positions." },
            { id: "D", text: "arr.swap(i, j);", explanationIfWrong: "Java primitive arrays do not have a built-in .swap() method." }
          ],
          correctAnswer: "A",
          explanationNote: "The temporary variable preserves arr[i] before it is overwritten with arr[j], allowing arr[j] to receive the original arr[i] value."
        },
        questionPool: [
          {
            id: "j7-2-2-alt1",
            question: "How do you swap two elements at index 1 and 3 in an ArrayList<String> named 'words' using Java Collections?",
            options: [
              { id: "A", text: "Collections.swap(words, 1, 3);", explanationIfWrong: "" },
              { id: "B", text: "words.swap(1, 3);", explanationIfWrong: "ArrayList itself does not define a swap method." },
              { id: "C", text: "words[1] = words[3];", explanationIfWrong: "ArrayList uses .get() and .set(), not bracket notation." },
              { id: "D", text: "Arrays.swap(words, 1, 3);", explanationIfWrong: "Arrays.swap does not exist in java.util.Arrays." }
            ],
            correctAnswer: "A",
            explanationNote: "Collections.swap(list, i, j) is the standard utility for swapping elements in an ArrayList."
          },
          {
            id: "j7-2-2-alt2",
            question: "What would result from executing: numbers[0] = numbers[1]; numbers[1] = numbers[0]; on {5, 9}?",
            options: [
              { id: "A", text: "{9, 9} because the original value 5 was overwritten without being stored in a temporary variable", explanationIfWrong: "" },
              { id: "B", text: "{9, 5}", explanationIfWrong: "The value 5 was erased in the first statement." },
              { id: "C", text: "{5, 5}", explanationIfWrong: "numbers[0] was assigned 9 first." },
              { id: "D", text: "A CompilationError", explanationIfWrong: "The code compiles and runs, but causes data corruption." }
            ],
            correctAnswer: "A",
            explanationNote: "Without storing 5 in a temp variable, step 1 turns numbers[0] into 9. Step 2 assigns numbers[0] (which is now 9) into numbers[1], leaving {9, 9}."
          }
        ]
      },
      {
        heading: "The Comparable<T> Interface & Natural Ordering",
        text: "To sort a list of custom objects (e.g. Member, Book, Student) using 'Collections.sort(list)', the object's class must implement the generic interface 'Comparable<T>' and provide an implementation of 'public int compareTo(T other)'. This method defines the natural ordering of the class.",
        codeSnippet: "public class Member implements Comparable<Member> {\n    private String name;\n    private int height;\n\n    public Member(String name, int height) {\n        this.name = name;\n        this.height = height;\n    }\n\n    public int getHeight() { return this.height; }\n\n    @Override\n    public int compareTo(Member other) {\n        return this.height - other.height; // Natural order by height (ascending)\n    }\n}",
        terminalOutput: "ArrayList<Member> members = ...;\nCollections.sort(members); // Now sorts members cleanly by height!",
        tip: "If a class does not implement Comparable, calling Collections.sort(list) will fail to compile with a type error.",
        warning: "Always use '@Override' when implementing compareTo to ensure the signature matches exactly.",
        mcq: {
          id: "j7-2-3",
          question: "Which interface must a class implement to enable direct sorting with Collections.sort(list)?",
          options: [
            { id: "A", text: "Comparable<T>", explanationIfWrong: "" },
            { id: "B", text: "Serializable", explanationIfWrong: "Serializable is for object serialization." },
            { id: "C", text: "Cloneable", explanationIfWrong: "Cloneable is for object cloning." },
            { id: "D", text: "Sortable<T>", explanationIfWrong: "Sortable is not a standard Java interface." }
          ],
          correctAnswer: "A",
          explanationNote: "Implementing Comparable<T> and defining compareTo(T other) provides the natural sorting logic required by Collections.sort()."
        },
        questionPool: [
          {
            id: "j7-2-3-alt1",
            question: "Where is the compareTo method declared in Java?",
            options: [
              { id: "A", text: "In the java.lang.Comparable<T> interface", explanationIfWrong: "" },
              { id: "B", text: "In java.lang.Object", explanationIfWrong: "Object declares equals, hashCode, toString, but NOT compareTo." },
              { id: "C", text: "In java.util.Scanner", explanationIfWrong: "Scanner is for text parsing." },
              { id: "D", text: "In java.lang.Math", explanationIfWrong: "Math contains static math functions." }
            ],
            correctAnswer: "A",
            explanationNote: "Comparable<T> belongs to java.lang and specifies public int compareTo(T o)."
          },
          {
            id: "j7-2-3-alt2",
            question: "How do you sort a list of Students in reverse (descending) order of their score?",
            options: [
              { id: "A", text: "In compareTo: return other.getScore() - this.getScore();", explanationIfWrong: "" },
              { id: "B", text: "In compareTo: return this.getScore() - other.getScore();", explanationIfWrong: "this - other produces ascending order." },
              { id: "C", text: "Return 0 unconditionally", explanationIfWrong: "Returning 0 treats all elements as equal." },
              { id: "D", text: "Throw an UnsupportedOperationException", explanationIfWrong: "Throwing an exception crashes sorting." }
            ],
            correctAnswer: "A",
            explanationNote: "Returning other - this reverses the sign of comparisons, producing descending order."
          }
        ]
      },
      {
        heading: "The compareTo() Contract: Negative, Zero, Positive",
        text: "The compareTo method must adhere to a strict 3-way comparison contract:\n• Return a NEGATIVE integer if 'this' is smaller than 'other' (this should appear before other)\n• Return ZERO if 'this' is equal to 'other'\n• Return a POSITIVE integer if 'this' is greater than 'other' (this should appear after other).",
        codeSnippet: "@Override\npublic int compareTo(Person other) {\n    if (this.age < other.age) {\n        return -1; // this comes first\n    } else if (this.age > other.age) {\n        return 1;  // other comes first\n    }\n    return 0;      // identical age\n}\n\n// For String fields, delegate to String's compareTo:\n// return this.name.compareTo(other.name);",
        terminalOutput: "alice.compareTo(bob) -> negative (Alice is younger)\ncharlie.compareTo(alice) -> positive (Charlie is older)",
        tip: "For Strings, never subtract characters manually; always delegate to this.name.compareTo(other.name).",
        warning: "Be cautious with direct integer subtraction (this.val - other.val) when values could be negative due to integer overflow; use Integer.compare(a, b) instead.",
        mcq: {
          id: "j7-2-4",
          question: "According to the Java Comparable contract, what should compareTo(T other) return if 'this' object should be placed BEFORE 'other' in ascending order?",
          options: [
            { id: "A", text: "A negative integer (< 0)", explanationIfWrong: "" },
            { id: "B", text: "A positive integer (> 0)", explanationIfWrong: "Positive means 'this' is greater and comes AFTER." },
            { id: "C", text: "Zero (0)", explanationIfWrong: "Zero means they are considered equal in ordering." },
            { id: "D", text: "true", explanationIfWrong: "compareTo returns an int, not a boolean." }
          ],
          correctAnswer: "A",
          explanationNote: "A negative return value signals that 'this' is smaller than 'other' and should precede it in sorted order."
        },
        questionPool: [
          {
            id: "j7-2-4-alt1",
            question: "What helper method from java.lang.Integer safely compares two integers without risk of subtraction overflow?",
            options: [
              { id: "A", text: "Integer.compare(this.value, other.value)", explanationIfWrong: "" },
              { id: "B", text: "Integer.sub(this.value, other.value)", explanationIfWrong: "Integer.sub does not exist." },
              { id: "C", text: "Math.sort(this.value, other.value)", explanationIfWrong: "Math.sort does not exist." },
              { id: "D", text: "this.value.compareTo(other.value)", explanationIfWrong: "Primitives cannot invoke methods." }
            ],
            correctAnswer: "A",
            explanationNote: "Integer.compare(x, y) returns negative, zero, or positive safely without overflow issues."
          },
          {
            id: "j7-2-4-alt2",
            question: "How do you implement compareTo to order Books alphabetically by title?",
            options: [
              { id: "A", text: "return this.title.compareTo(other.title);", explanationIfWrong: "" },
              { id: "B", text: "return this.title.length() - other.title.length();", explanationIfWrong: "That sorts by length, not alphabetical order." },
              { id: "C", text: "return this.title.equals(other.title) ? 1 : 0;", explanationIfWrong: "equals returns boolean and lacks relative ordering." },
              { id: "D", text: "return this.title - other.title;", explanationIfWrong: "String subtraction is illegal in Java." }
            ],
            correctAnswer: "A",
            explanationNote: "Delegating to String.compareTo sorts lexicographically according to Unicode alphabetical ordering."
          }
        ]
      },
      {
        heading: "Dual-Pivot Quicksort and Timsort in the JDK",
        text: "Java's standard library does not use basic selection sort or bubble sort. When you call 'Arrays.sort(primitiveArray)', Java runs Vladimir Yaroslavskiy's Dual-Pivot Quicksort, which partitions elements around two pivots for O(N log N) performance. When sorting objects (or Collections.sort), Java uses Timsort, a hybrid of merge sort and insertion sort that is stable and runs in O(N log N).",
        codeSnippet: "// 1. Primitive arrays (int[], double[], etc.):\nint[] nums = {45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 45};\nArrays.sort(nums); // Dual-Pivot Quicksort (O(N log N))\n\n// 2. Object collections:\nArrayList<String> names = new ArrayList<>(List.of(\"Zack\", \"Beth\", \"Adam\"));\nCollections.sort(names); // Timsort (O(N log N), stable)",
        terminalOutput: "Primitives: Dual-Pivot Quicksort\nObjects: Timsort (Preserves relative order of equal items)",
        tip: "A 'stable' sort preserves the relative order of elements that have equal sorting keys. Timsort is stable; Quicksort is not.",
        warning: "Never write your own sorting algorithm for production data when Arrays.sort and Collections.sort are tested and highly optimized.",
        mcq: {
          id: "j7-2-5",
          question: "What algorithm does Java utilize when calling Arrays.sort() on a primitive int[] array?",
          options: [
            { id: "A", text: "Dual-Pivot Quicksort, running in O(N log N) time", explanationIfWrong: "" },
            { id: "B", text: "Selection Sort", explanationIfWrong: "Selection sort is O(N^2) and too slow for standard libraries." },
            { id: "C", text: "Bubble Sort", explanationIfWrong: "Bubble sort is an educational O(N^2) algorithm." },
            { id: "D", text: "Linear Insertion Sort exclusively", explanationIfWrong: "Insertion sort is only used for tiny sub-arrays." }
          ],
          correctAnswer: "A",
          explanationNote: "Java uses Dual-Pivot Quicksort for primitives, which partitions into three segments using two pivots to minimize cache misses."
        },
        questionPool: [
          {
            id: "j7-2-5-alt1",
            question: "Why does Java use Timsort (a stable sort) for object lists instead of Quicksort?",
            options: [
              { id: "A", text: "Stability guarantees that objects with identical keys retain their original relative order", explanationIfWrong: "" },
              { id: "B", text: "Quicksort cannot run on objects", explanationIfWrong: "Quicksort can run on objects, but it is unstable." },
              { id: "C", text: "Timsort uses zero memory", explanationIfWrong: "Timsort uses O(N) extra memory." },
              { id: "D", text: "Quicksort requires Java 25", explanationIfWrong: "Quicksort has existed since the 1960s." }
            ],
            correctAnswer: "A",
            explanationNote: "When sorting objects (like sorting students by grade), stability ensures students with the same grade remain in their previous alphabetical order."
          },
          {
            id: "j7-2-5-alt2",
            question: "What is the worst-case time complexity of Timsort?",
            options: [
              { id: "A", text: "O(N log N)", explanationIfWrong: "" },
              { id: "B", text: "O(N^2)", explanationIfWrong: "Standard Quicksort can degrade to O(N^2), but Timsort guarantees O(N log N)." },
              { id: "C", text: "O(N)", explanationIfWrong: "O(N) is Timsort's best-case on already sorted data, not worst case." },
              { id: "D", text: "O(log N)", explanationIfWrong: "No general comparison sort can achieve O(log N)." }
            ],
            correctAnswer: "A",
            explanationNote: "Timsort guarantees O(N log N) worst-case performance based on its merge-sort foundation."
          }
        ]
      },
      {
        heading: "Displaying Arrays with Arrays.toString()",
        text: "In Java, primitive arrays and raw object arrays are objects, but they do NOT override toString() from java.lang.Object. Printing an array directly with 'System.out.println(arr)' outputs something unreadable like '[I@685f4c2e' (the type identifier and memory hashcode). Use 'Arrays.toString(arr)' to format array elements cleanly.",
        codeSnippet: "int[] numbers = {10, 50, 30};\nArrays.sort(numbers);\n\n// WRONG:\nSystem.out.println(numbers); // Prints: [I@7699a589\n\n// RIGHT:\nSystem.out.println(Arrays.toString(numbers)); // Prints: [10, 30, 50]",
        terminalOutput: "Direct Print: [I@7699a589\nArrays.toString: [10, 30, 50]",
        tip: "For multidimensional (2D) arrays, use Arrays.deepToString(matrix).",
        warning: "ArrayList automatically prints brackets and elements because ArrayList overrides toString(); primitive arrays do not.",
        mcq: {
          id: "j7-2-6",
          question: "How should you format and print the contents of a primitive int[] array named 'data' to the terminal?",
          options: [
            { id: "A", text: "System.out.println(Arrays.toString(data));", explanationIfWrong: "" },
            { id: "B", text: "System.out.println(data.toString());", explanationIfWrong: "data.toString() prints the default hash code like [I@..." },
            { id: "C", text: "System.out.println((String) data);", explanationIfWrong: "An int[] cannot be cast to a String." },
            { id: "D", text: "System.out.println(data.print());", explanationIfWrong: "Arrays do not possess a .print() method." }
          ],
          correctAnswer: "A",
          explanationNote: "Arrays.toString(data) converts the array items into a clean comma-separated bracketed string '[item1, item2]'."
        },
        questionPool: [
          {
            id: "j7-2-6-alt1",
            question: "What does printing 'new int[]{1, 2, 3}' directly with System.out.println produce?",
            options: [
              { id: "A", text: "A type indicator and memory hashcode like '[I@685f4c2e'", explanationIfWrong: "" },
              { id: "B", text: "[1, 2, 3]", explanationIfWrong: "Java arrays do not override toString() to display contents." },
              { id: "C", text: "123", explanationIfWrong: "Elements are not concatenated automatically." },
              { id: "D", text: "A NullPointerException", explanationIfWrong: "The array object exists; it just has default Object.toString()." }
            ],
            correctAnswer: "A",
            explanationNote: "The default Object.toString() formats class name + '@' + hex hashcode. For int[], the class name is '[I'."
          },
          {
            id: "j7-2-6-alt2",
            question: "How do you print a 2-dimensional array int[][] grid in readable matrix format?",
            options: [
              { id: "A", text: "System.out.println(Arrays.deepToString(grid));", explanationIfWrong: "" },
              { id: "B", text: "System.out.println(Arrays.toString(grid));", explanationIfWrong: "Arrays.toString on 2D arrays prints array hashes for nested rows: [[I@..., [I@...]." },
              { id: "C", text: "System.out.println(grid.toString());", explanationIfWrong: "This prints [[I@..." },
              { id: "D", text: "System.out.println(Collections.toString(grid));", explanationIfWrong: "Collections.toString does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "Arrays.deepToString recurses into sub-arrays to print nested dimensions cleanly."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 7.3: Larger Programming Projects & Architecture
  // -------------------------------------------------------------
  {
    id: "7-3-larger-projects",
    number: "7.3",
    title: "Larger Systems & Architecture",
    subtitle: "Separation of concerns, domain logic vs UI, Recipe Search, Grade Statistics, frequency counter arrays, and testing.",
    readTime: "30 min",
    objectives: [
      "Decompose complex systems into domain models, data collections, and dedicated user interface classes",
      "Parse multi-line structured text files using empty lines as block delimiters (Recipe Search)",
      "Map continuous numeric intervals to discrete categories using clean if-chains (Grade Statistics)",
      "Count frequency distributions in O(1) time using indexed bucket arrays (int[] gradeCounts)",
      "Encapsulate domain mutations within methods instead of exposing raw internal state",
      "Inject Scanner instances via constructors to enable automated UI testing with simulated input"
    ],
    theoryBlocks: [
      {
        heading: "Separating UI and Domain Logic",
        text: "In professional software architecture, user input/output (Scanner, System.out) must NEVER be mixed into domain classes (e.g. Recipe, Student, Book). Domain classes should only store data and represent business rules. A dedicated 'UserInterface' or 'TextUI' class handles user prompts and delegates operations to domain objects.",
        codeSnippet: "// Clean Domain Model: Pure POJO\npublic class Recipe {\n    private String name;\n    private int cookingTime;\n    private ArrayList<String> ingredients;\n\n    public Recipe(String name, int cookingTime, ArrayList<String> ingredients) {\n        this.name = name;\n        this.cookingTime = cookingTime;\n        this.ingredients = ingredients;\n    }\n    public String getName() { return this.name; }\n    public int getCookingTime() { return this.cookingTime; }\n    public boolean hasIngredient(String item) { return this.ingredients.contains(item); }\n}",
        terminalOutput: "Domain Class: Recipe, RecipeBook (NO System.out, NO Scanner)\nUI Class: UserInterface (All System.out & Scanner commands)",
        tip: "Keeping domain models clean enables them to be reused in web APIs, mobile apps, and automated test runners without modification.",
        warning: "Never place Scanner prompts inside domain entity constructors or getter methods.",
        mcq: {
          id: "j7-3-1",
          question: "Why should Scanner prompts and System.out calls be kept completely outside of domain model classes like Recipe or Member?",
          options: [
            { id: "A", text: "To decouple domain logic from console I/O, allowing domain models to be tested automatically and reused across different interfaces", explanationIfWrong: "" },
            { id: "B", text: "Because Java forbids System.out in classes without a main method", explanationIfWrong: "Java allows System.out anywhere, but it violates clean design principles." },
            { id: "C", text: "Domain classes run 10x slower if they print text", explanationIfWrong: "The architectural benefit is decoupling and testability, not CPU speed." },
            { id: "D", text: "Because Scanner requires static memory allocation", explanationIfWrong: "Scanner instances are normal heap objects." }
          ],
          correctAnswer: "A",
          explanationNote: "Separating UI from domain logic maintains the Single Responsibility Principle and allows domain logic to be tested deterministically without terminal prompts."
        },
        questionPool: [
          {
            id: "j7-3-1-alt1",
            question: "Which class in a modular application should contain the while(true) command loop?",
            options: [
              { id: "A", text: "A dedicated UserInterface (or TextUI) class", explanationIfWrong: "" },
              { id: "B", text: "Every domain model class", explanationIfWrong: "Domain classes should not control application flow loops." },
              { id: "C", text: "The database storage class", explanationIfWrong: "Storage classes manage collections, not user command loops." },
              { id: "D", text: "The Java virtual machine launcher script", explanationIfWrong: "UI loops belong in Java source classes." }
            ],
            correctAnswer: "A",
            explanationNote: "The UserInterface class orchestrates user inputs, processes menu options, and prints results."
          },
          {
            id: "j7-3-1-alt2",
            question: "What design principle states that each class should have only one reason to change?",
            options: [
              { id: "A", text: "Single Responsibility Principle (SRP)", explanationIfWrong: "" },
              { id: "B", text: "Multiple Inheritance Principle", explanationIfWrong: "Java does not support multiple class inheritance." },
              { id: "C", text: "Liskov Duplication Principle", explanationIfWrong: "Liskov Substitution Principle is about subtype polymorphism." },
              { id: "D", text: "Open Loop Protocol", explanationIfWrong: "This is not an OOP principle." }
            ],
            correctAnswer: "A",
            explanationNote: "The Single Responsibility Principle ensures each class focuses on a single aspect of the application (e.g. data modeling, storage, or UI)."
          }
        ]
      },
      {
        heading: "Grade Interval Classification Logic",
        text: "In the Helsinki 'Grade Statistics' project, total exam points (0-100) must be converted into discrete grades from 0 to 5. Rather than writing verbose nested compound conditions like '(points >= 50 && points < 60)', you can write a clean cascading series of lower-to-higher checks that immediately return upon meeting the threshold.",
        codeSnippet: "public static int pointsToGrade(int points) {\n    if (points < 0 || points > 100) return -1; // invalid\n    if (points < 50) return 0;\n    if (points < 60) return 1;\n    if (points < 70) return 2;\n    if (points < 80) return 3;\n    if (points < 90) return 4;\n    return 5;\n}",
        terminalOutput: "Points: 49 -> Grade: 0\nPoints: 72 -> Grade: 3\nPoints: 95 -> Grade: 5",
        tip: "By returning immediately from each if branch, you eliminate the need for 'else' and redundant upper-bound checks.",
        warning: "Always validate that inputs fall within valid ranges (e.g. 0 to 100) before classifying.",
        mcq: {
          id: "j7-3-2",
          question: "Under the standard MOOC grade scale (0: <50, 1: 50-59, 2: 60-69, 3: 70-79, 4: 80-89, 5: 90-100), what grade is awarded for 72 points?",
          options: [
            { id: "A", text: "Grade 3", explanationIfWrong: "" },
            { id: "B", text: "Grade 2", explanationIfWrong: "Grade 2 is for points between 60 and 69." },
            { id: "C", text: "Grade 4", explanationIfWrong: "Grade 4 is for points between 80 and 89." },
            { id: "D", text: "Grade 1", explanationIfWrong: "Grade 1 is for points between 50 and 59." }
          ],
          correctAnswer: "A",
          explanationNote: "72 is in the [70, 79] interval, which corresponds to Grade 3."
        },
        questionPool: [
          {
            id: "j7-3-2-alt1",
            question: "What is the minimum number of exam points required to achieve a passing grade (Grade 1 or higher) in Helsinki Java MOOC?",
            options: [
              { id: "A", text: "50 points", explanationIfWrong: "" },
              { id: "B", text: "40 points", explanationIfWrong: "Points below 50 receive grade 0 (fail)." },
              { id: "C", text: "60 points", explanationIfWrong: "60 gives grade 2; 50 is sufficient for passing grade 1." },
              { id: "D", text: "75 points", explanationIfWrong: "Passing benchmark is 50 points." }
            ],
            correctAnswer: "A",
            explanationNote: "Points from 50 to 59 yield Grade 1. Below 50 points is Grade 0 (failed)."
          },
          {
            id: "j7-3-2-alt2",
            question: "How should a grade calculation program handle exam inputs outside [0, 100], such as -1 or 105?",
            options: [
              { id: "A", text: "Discard them and do not include them in the statistics calculation", explanationIfWrong: "" },
              { id: "B", text: "Treat negative numbers as Grade 5", explanationIfWrong: "Invalid input should never be converted into top grades." },
              { id: "C", text: "Crash the program with System.exit(0)", explanationIfWrong: "User input errors should be ignored gracefully." },
              { id: "D", text: "Convert them to positive 100 automatically", explanationIfWrong: "Silently mutating invalid data corrupts results." }
            ],
            correctAnswer: "A",
            explanationNote: "The MOOC specification states inputs < 0 or > 100 must be ignored and excluded from point averages and grade distributions."
          }
        ]
      },
      {
        heading: "Parsing Multi-Line Blocks with Empty Line Delimiters",
        text: "In the 'Recipe Search' project, recipes in the text file are grouped in multi-line blocks separated by an empty line:\nLine 1: Recipe Name\nLine 2: Cooking time in minutes\nLines 3+: Ingredients (one per line)\nEmpty line: marks end of recipe.",
        codeSnippet: "ArrayList<Recipe> recipes = new ArrayList<>();\nwhile (scanner.hasNextLine()) {\n    String name = scanner.nextLine();\n    if (name.isEmpty()) continue;\n    int time = Integer.parseInt(scanner.nextLine());\n    ArrayList<String> ingredients = new ArrayList<>();\n    while (scanner.hasNextLine()) {\n        String ing = scanner.nextLine();\n        if (ing.isEmpty()) break; // End of this recipe block!\n        ingredients.add(ing);\n    }\n    recipes.add(new Recipe(name, time, ingredients));\n}",
        terminalOutput: "Pancakes\n30\nmilk\negg\nflour\nsugar\n\nMeatballs\n20\nground meat\negg\nflour",
        tip: "Check 'line.isEmpty()' to detect the empty blank lines between consecutive blocks.",
        warning: "Files might not end with an empty line; make sure the outer loop properly handles the final recipe without an ending blank line.",
        mcq: {
          id: "j7-3-3",
          question: "When parsing a recipe file using Scanner, how do you detect the boundary that separates one recipe block from the next?",
          options: [
            { id: "A", text: "Check if line.isEmpty() is true, indicating an empty blank line delimiter", explanationIfWrong: "" },
            { id: "B", text: "Check if line.equals(\"END_OF_RECIPE\")", explanationIfWrong: "The file uses blank lines, not special keyword strings." },
            { id: "C", text: "Check if scanner.nextInt() == 0", explanationIfWrong: "Lines are text strings, not integer zeros." },
            { id: "D", text: "Check if line == null", explanationIfWrong: "scanner.nextLine() returns an empty string \"\", not null, for blank lines." }
          ],
          correctAnswer: "A",
          explanationNote: "scanner.nextLine() returns an empty string \"\" when encountering blank lines; line.isEmpty() correctly detects block boundaries."
        },
        questionPool: [
          {
            id: "j7-3-3-alt1",
            question: "Why should you use Paths.get(fileName) with try-with-resources when reading a recipe file?",
            options: [
              { id: "A", text: "It ensures the file stream is automatically closed even if an exception occurs during parsing", explanationIfWrong: "" },
              { id: "B", text: "It speeds up hard drive rotation", explanationIfWrong: "Software try-with-resources manages file descriptors, not hardware speed." },
              { id: "C", text: "It converts text files into binary files", explanationIfWrong: "Files are parsed as text." },
              { id: "D", text: "It is required for Scanner to read integers", explanationIfWrong: "Scanner can read from any stream." }
            ],
            correctAnswer: "A",
            explanationNote: "Try-with-resources guarantees file handle closure and prevents operating system resource leaks."
          },
          {
            id: "j7-3-3-alt2",
            question: "What happens if a recipe file does not contain an empty line after the very last recipe at the end of the file?",
            options: [
              { id: "A", text: "The inner while loop terminates because scanner.hasNextLine() returns false at EOF", explanationIfWrong: "" },
              { id: "B", text: "An InfiniteLoopException is thrown", explanationIfWrong: "Scanner reaches EOF and hasNextLine() returns false." },
              { id: "C", text: "The entire file is re-read from the beginning", explanationIfWrong: "Scanner does not rewind automatically." },
              { id: "D", text: "The first recipe is deleted", explanationIfWrong: "The data is preserved." }
            ],
            correctAnswer: "A",
            explanationNote: "When reaching end of file (EOF), hasNextLine() safely returns false, terminating the reading loop."
          }
        ]
      },
      {
        heading: "Frequency Counter Bucket Arrays",
        text: "When tracking how many times each grade (0 to 5) appears in a dataset, creating an integer array of size 6 ('int[] gradeCounts = new int[6];') allows O(1) index-based frequency counting. The grade value itself serves as the index: 'gradeCounts[grade]++'. Printing the distribution as stars is then a simple loop.",
        codeSnippet: "int[] gradeCounts = new int[6]; // indexes 0, 1, 2, 3, 4, 5\nfor (int grade : studentGrades) {\n    if (grade >= 0 && grade <= 5) {\n        gradeCounts[grade]++; // O(1) frequency tally!\n    }\n}\n\n// Print Grade Distribution (5 down to 0):\nfor (int g = 5; g >= 0; g--) {\n    System.out.print(g + \": \");\n    for (int star = 0; star < gradeCounts[g]; star++) {\n        System.out.print(\"*\");\n    }\n    System.out.println();\n}",
        terminalOutput: "Grade distribution:\n5: ***\n4: *\n3: **\n2: \n1: *\n0: *",
        tip: "A bucket array replaces complicated if-else frequency counters with simple O(1) array indexing.",
        warning: "Ensure the index is strictly between 0 and array.length - 1 before incrementing to avoid index out of bounds.",
        mcq: {
          id: "j7-3-4",
          question: "Why is 'int[] gradeCounts = new int[6];' an optimal choice for tallying student grades from 0 to 5?",
          options: [
            { id: "A", text: "Because the grade itself (0 to 5) maps directly to array indices, enabling O(1) direct tallying via gradeCounts[grade]++", explanationIfWrong: "" },
            { id: "B", text: "Because it connects the program to an external cloud database", explanationIfWrong: "It is an in-memory primitive array." },
            { id: "C", text: "Because Java arrays automatically draw star characters", explanationIfWrong: "Star printing is handled by our own print loop." },
            { id: "D", text: "Because arrays prevent students from failing", explanationIfWrong: "Arrays are data structures, not academic evaluators." }
          ],
          correctAnswer: "A",
          explanationNote: "Direct indexing avoids 6 separate counter variables or nested if-statements, allowing instant O(1) increments."
        },
        questionPool: [
          {
            id: "j7-3-4-alt1",
            question: "In the Helsinki Grade Distribution output, why is the printing loop written from 5 down to 0 instead of 0 up to 5?",
            options: [
              { id: "A", text: "The specification requires highest grade 5 at the top, down to failing grade 0 at the bottom", explanationIfWrong: "" },
              { id: "B", text: "Java arrays cannot be traversed from 0 upwards", explanationIfWrong: "Java arrays can be iterated in any direction." },
              { id: "C", text: "Downwards loops run twice as fast", explanationIfWrong: "Direction has no noticeable speed difference." },
              { id: "D", text: "To avoid ArrayIndexOutOfBoundsException", explanationIfWrong: "Both directions are safe with valid bounds." }
            ],
            correctAnswer: "A",
            explanationNote: "The MOOC visual specification displays grade 5 at the top and grade 0 at the bottom."
          },
          {
            id: "j7-3-4-alt2",
            question: "How do you calculate pass percentage given 'passingCount' and 'totalParticipants' as integers?",
            options: [
              { id: "A", text: "100.0 * passingCount / totalParticipants", explanationIfWrong: "" },
              { id: "B", text: "passingCount / totalParticipants * 100", explanationIfWrong: "Integer division produces 0 before multiplying by 100." },
              { id: "C", text: "(int) (passingCount / totalParticipants)", explanationIfWrong: "This truncates to 0 for any percentage < 100%." },
              { id: "D", text: "passingCount % totalParticipants", explanationIfWrong: "% is modulo remainder, not percentage." }
            ],
            correctAnswer: "A",
            explanationNote: "Multiplying by 100.0 promotes the operation to floating-point division, avoiding integer division truncation."
          }
        ]
      },
      {
        heading: "Encapsulating Domain Entities in Collections",
        text: "In projects like 'Big Year' (bird observation tracker), real-world entities should be modeled as objects ('Bird') with private attributes (name, latinName, observationCount) and public domain methods ('observe()'). These objects are held in a collection manager or service class.",
        codeSnippet: "public class Bird {\n    private String name;\n    private String latinName;\n    private int observations;\n\n    public Bird(String name, String latinName) {\n        this.name = name;\n        this.latinName = latinName;\n        this.observations = 0;\n    }\n\n    public void observe() {\n        this.observations++; // Encapsulated mutation\n    }\n\n    public String getName() { return this.name; }\n    public int getObservations() { return this.observations; }\n}",
        terminalOutput: "Hawk (Accipiter gentilis): 3 observations\nSparrow (Passer domesticus): 1 observations",
        tip: "By calling 'bird.observe()', the caller doesn't need to know how observations are stored or incremented.",
        warning: "Never expose private counters directly as public variables; always mutate through domain methods.",
        mcq: {
          id: "j7-3-5",
          question: "In the Big Year bird observation project, what is the best way to record a sighting of a bird?",
          options: [
            { id: "A", text: "Call an encapsulated domain method 'bird.observe()' which increments its internal counter", explanationIfWrong: "" },
            { id: "B", text: "bird.observations = bird.observations + 1; with public instance variables", explanationIfWrong: "Exposing public instance variables violates encapsulation." },
            { id: "C", text: "Create a new bird with observation count 1 and delete the old bird", explanationIfWrong: "This destroys the existing entity history unnecessarily." },
            { id: "D", text: "Write the observation directly to System.out without saving state", explanationIfWrong: "State must be maintained to print statistics." }
          ],
          correctAnswer: "A",
          explanationNote: "Encapsulating the count inside the Bird class and exposing a clean 'observe()' method maintains object-oriented encapsulation."
        },
        questionPool: [
          {
            id: "j7-3-5-alt1",
            question: "How do you search for a bird in an ArrayList<Bird> by its common name?",
            options: [
              { id: "A", text: "Loop through the list with a for-each loop and check if bird.getName().equalsIgnoreCase(searchName)", explanationIfWrong: "" },
              { id: "B", text: "birds.contains(searchName)", explanationIfWrong: "The list contains Bird objects, not String names." },
              { id: "C", text: "birds.get(searchName)", explanationIfWrong: "ArrayList.get() takes an integer index, not a string." },
              { id: "D", text: "bird.equals(searchName)", explanationIfWrong: "A Bird object is not equal to a String object." }
            ],
            correctAnswer: "A",
            explanationNote: "Iterating through the Bird objects and comparing their names using equalsIgnoreCase provides a robust search."
          },
          {
            id: "j7-3-5-alt2",
            question: "What should the UI print if the user attempts to observe a bird name that is not in the database?",
            options: [
              { id: "A", text: "\"Not a bird!\"", explanationIfWrong: "" },
              { id: "B", text: "NullPointerException", explanationIfWrong: "User errors should be caught cleanly, not throw unhandled exceptions." },
              { id: "C", text: "Add a bird with latin name \"Unknown\"", explanationIfWrong: "MOOC requires reporting that it's not in the database." },
              { id: "D", text: "Terminate the program", explanationIfWrong: "The command loop should continue running." }
            ],
            correctAnswer: "A",
            explanationNote: "According to the Helsinki MOOC Big Year exercise, missing birds prompt the message 'Not a bird!'."
          }
        ]
      },
      {
        heading: "Dependency Injection for Automated UI Testing",
        text: "To test a text-based User Interface automatically without requiring a human to type into the keyboard, pass the Scanner into the TextUI constructor: 'public TextUI(Scanner scanner, Database db)'. In automated unit tests, you can instantiate a Scanner over a predefined String: 'new Scanner(\"add\\nHawk\\nquit\\n\");'. The UI reads the simulated input and runs to completion automatically!",
        codeSnippet: "// Production Usage:\nScanner keyboard = new Scanner(System.in);\nTextUI ui = new TextUI(keyboard, database);\nui.start();\n\n// Automated Unit Test:\nString simulatedInput = \"add\\nRobin\\nErithacus rubecula\\nobservation\\nRobin\\nquit\\n\";\nScanner mockScanner = new Scanner(simulatedInput);\nTextUI testUi = new TextUI(mockScanner, database);\ntestUi.start(); // Runs deterministically in milliseconds with zero human typing!",
        terminalOutput: "Tests run: 12, Failures: 0, Errors: 0, Time elapsed: 0.124 s",
        tip: "This pattern is known as Dependency Injection: dependencies are supplied from the outside rather than created internally.",
        warning: "Never hardcode 'new Scanner(System.in)' inside the constructor or methods of your UI class.",
        mcq: {
          id: "j7-3-6",
          question: "What is the primary testing benefit of injecting a Scanner via the UserInterface constructor ('public UserInterface(Scanner scanner, RecipeBook book)')?",
          options: [
            { id: "A", text: "Unit tests can pass a Scanner initialized with a String of simulated commands to test the entire UI flow without manual human typing", explanationIfWrong: "" },
            { id: "B", text: "It allows the Scanner to read data from a GPU", explanationIfWrong: "Scanner reads text streams, not GPU memory." },
            { id: "C", text: "It avoids having to compile the class", explanationIfWrong: "All Java source code must be compiled." },
            { id: "D", text: "It converts Scanner into a multi-threaded web server", explanationIfWrong: "Scanner remains a sequential tokenizer." }
          ],
          correctAnswer: "A",
          explanationNote: "Constructing 'new Scanner(\"command1\\ncommand2\\nquit\")' allows automated grading test suites to verify UI behavior instantly and deterministically."
        },
        questionPool: [
          {
            id: "j7-3-6-alt1",
            question: "Where should the entry point (main method) be placed in a cleanly architected multi-class Java program?",
            options: [
              { id: "A", text: "In a dedicated Main class that initializes dependencies, wires them together, and starts the UI", explanationIfWrong: "" },
              { id: "B", text: "Inside every domain model class", explanationIfWrong: "Domain models should not have main methods in production." },
              { id: "C", text: "Inside the Scanner class in the Java SDK", explanationIfWrong: "SDK classes cannot be modified by developers." },
              { id: "D", text: "In an interface file", explanationIfWrong: "Interfaces cannot contain the main application lifecycle launcher." }
            ],
            correctAnswer: "A",
            explanationNote: "A dedicated Main class acts as the composition root, constructing objects and launching the application."
          },
          {
            id: "j7-3-6-alt2",
            question: "What method starts execution of the TextUI command loop?",
            options: [
              { id: "A", text: "A dedicated method such as 'start()' or 'run()'", explanationIfWrong: "" },
              { id: "B", text: "The constructor executes the loop automatically and never returns", explanationIfWrong: "Constructors should only initialize state; running loops in constructors blocks instantiation." },
              { id: "C", text: "System.gc()", explanationIfWrong: "System.gc requests garbage collection." },
              { id: "D", text: "Object.finalize()", explanationIfWrong: "finalize is an obsolete cleanup method." }
            ],
            correctAnswer: "A",
            explanationNote: "Calling ui.start() after object instantiation cleanly separates object construction from program execution."
          }
        ]
      }
    ]
  }
];

// Helper functions for Level Failure, Question Pool Rotation, and Attempt Tracking

export function getActiveQuestionsForLevelPart7(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part7_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart7(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part7_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart7(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part7_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart7(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part7_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart7(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part7_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart7 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart7(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart7 {
  const attemptKey = `dopilot_java_part7_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part7_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part7_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart7(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart7(studentId);
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
