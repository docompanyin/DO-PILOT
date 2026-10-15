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
    "id": "6-1-reading-files",
    "number": "6.1",
    "title": "Reading Files",
    "subtitle": "Open and read text and CSV files using open(), context managers, line-by-line traversal, and data cleaning.",
    "readTime": "20 min",
    "objectives": [
      "Open files safely using the with statement and context managers",
      "Read complete file contents using .read() and .read().splitlines()",
      "Iterate through large files line by line using for line in file",
      "Strip newline characters (\\n) and whitespace using .strip()",
      "Parse structured CSV data by splitting delimited lines",
      "Convert string numbers from files into integer and float data types"
],
    "theoryBlocks": [
      {
        "heading": "Opening Files with the with Statement",
        "text": "In Python, you open files using the built-in open(filename, mode) function. Mode 'r' opens the file for reading. The standard and safest way to handle files is using the with statement (a context manager): it guarantees that Python automatically closes the file when the block finishes, even if an error occurs.",
        "codeSnippet": "with open(\"data.txt\", \"r\") as file:\n    content = file.read()\n    print(content)\n# The file is automatically closed here!",
        "terminalOutput": "Hello from Python file handling!",
        "tip": "Always use with open(...) as file: instead of manual file = open() and file.close() calls.",
        "mcq": {
          "id": "q-6.1-0-v1",
          "question": "Why is the with statement recommended when working with files in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "It guarantees the file is automatically closed when execution leaves the block, even if an error occurs",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It automatically encrypts the file contents",
                              "explanationIfWrong": "with does not perform encryption."
                    },
                    {
                              "id": "C",
                              "text": "It speeds up file reading by 10x",
                              "explanationIfWrong": "with manages resource cleanup, not raw disk I/O speed."
                    },
                    {
                              "id": "D",
                              "text": "It prevents the file from ever being modified",
                              "explanationIfWrong": "File permissions are controlled by mode, not with."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The with statement defines a context manager that ensures file descriptor resources are safely released upon exit."
},
        "retestMcq": {
          "id": "q-6.1-0-v2",
          "question": "What is the default mode if the second argument to open('example.txt') is omitted?",
          "options": [
                    {
                              "id": "A",
                              "text": "'r' (read text mode)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'w' (write mode)",
                              "explanationIfWrong": "Write mode requires explicit 'w'; default is read mode."
                    },
                    {
                              "id": "C",
                              "text": "'a' (append mode)",
                              "explanationIfWrong": "Append mode requires explicit 'a'."
                    },
                    {
                              "id": "D",
                              "text": "'b' (binary mode)",
                              "explanationIfWrong": "Text mode 'r' is the default."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "open('file.txt') defaults to 'rt' (read text mode)."
},
        "questionPool": [
          {
            "id": "q-6.1-0-v1",
            "question": "Why is the with statement recommended when working with files in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It guarantees the file is automatically closed when execution leaves the block, even if an error occurs",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It automatically encrypts the file contents",
                                    "explanationIfWrong": "with does not perform encryption."
                        },
                        {
                                    "id": "C",
                                    "text": "It speeds up file reading by 10x",
                                    "explanationIfWrong": "with manages resource cleanup, not raw disk I/O speed."
                        },
                        {
                                    "id": "D",
                                    "text": "It prevents the file from ever being modified",
                                    "explanationIfWrong": "File permissions are controlled by mode, not with."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The with statement defines a context manager that ensures file descriptor resources are safely released upon exit."
},
          {
            "id": "q-6.1-0-v2",
            "question": "What is the default mode if the second argument to open('example.txt') is omitted?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'r' (read text mode)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'w' (write mode)",
                                    "explanationIfWrong": "Write mode requires explicit 'w'; default is read mode."
                        },
                        {
                                    "id": "C",
                                    "text": "'a' (append mode)",
                                    "explanationIfWrong": "Append mode requires explicit 'a'."
                        },
                        {
                                    "id": "D",
                                    "text": "'b' (binary mode)",
                                    "explanationIfWrong": "Text mode 'r' is the default."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "open('file.txt') defaults to 'rt' (read text mode)."
},
          {
            "id": "q-6.1-0-v3",
            "question": "What exception is raised if you try to open a non-existent file in 'r' mode?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "FileNotFoundError",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "FileExistsError",
                                    "explanationIfWrong": "FileExistsError is for creating files that already exist in exclusive 'x' mode."
                        },
                        {
                                    "id": "C",
                                    "text": "ValueError",
                                    "explanationIfWrong": "Python raises the specific OS exception FileNotFoundError."
                        },
                        {
                                    "id": "D",
                                    "text": "PermissionError",
                                    "explanationIfWrong": "Missing files raise FileNotFoundError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Attempting to read a file that does not exist raises a FileNotFoundError."
}
        ]
      },
      {
        "heading": "Reading Complete Content with .read()",
        "text": "The .read() method reads the entire remaining contents of a file as a single string. If you want a list of lines with trailing newline characters removed, chaining .read().splitlines() is a concise and popular approach.",
        "codeSnippet": "with open(\"names.txt\", \"r\") as f:\n    text = f.read()\n    print(f\"Total characters: {len(text)}\")\n    lines = text.splitlines()\n    print(f\"Total lines: {len(lines)}\")",
        "terminalOutput": "Total characters: 154\nTotal lines: 10",
        "warning": "Avoid .read() on massive files (e.g. 5 GB) because it loads the entire file into RAM all at once.",
        "mcq": {
          "id": "q-6.1-1-v1",
          "question": "What data type does file.read() return?",
          "options": [
                    {
                              "id": "A",
                              "text": "A single string containing the entire file content",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A list of strings for each line",
                              "explanationIfWrong": "A list of lines is returned by .readlines(), while .read() returns a string."
                    },
                    {
                              "id": "C",
                              "text": "A tuple of bytes",
                              "explanationIfWrong": "In text mode 'r', .read() returns a str."
                    },
                    {
                              "id": "D",
                              "text": "A generator iterator",
                              "explanationIfWrong": ".read() loads the full string into memory."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "file.read() reads the full stream into memory as a standard str object."
},
        "retestMcq": {
          "id": "q-6.1-1-v2",
          "question": "Why is .read().splitlines() often preferred over .readlines()?",
          "options": [
                    {
                              "id": "A",
                              "text": "It automatically strips the trailing newline characters (\\n) from every line",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It reverses the lines automatically",
                              "explanationIfWrong": "It preserves original line order."
                    },
                    {
                              "id": "C",
                              "text": "It converts all text to uppercase",
                              "explanationIfWrong": "It only splits on line breaks."
                    },
                    {
                              "id": "D",
                              "text": "It ignores empty lines",
                              "explanationIfWrong": "Empty lines are preserved as empty strings."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": ".splitlines() breaks text into a list without retaining the trailing '\\n' characters."
},
        "questionPool": [
          {
            "id": "q-6.1-1-v1",
            "question": "What data type does file.read() return?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A single string containing the entire file content",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A list of strings for each line",
                                    "explanationIfWrong": "A list of lines is returned by .readlines(), while .read() returns a string."
                        },
                        {
                                    "id": "C",
                                    "text": "A tuple of bytes",
                                    "explanationIfWrong": "In text mode 'r', .read() returns a str."
                        },
                        {
                                    "id": "D",
                                    "text": "A generator iterator",
                                    "explanationIfWrong": ".read() loads the full string into memory."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "file.read() reads the full stream into memory as a standard str object."
},
          {
            "id": "q-6.1-1-v2",
            "question": "Why is .read().splitlines() often preferred over .readlines()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It automatically strips the trailing newline characters (\\n) from every line",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It reverses the lines automatically",
                                    "explanationIfWrong": "It preserves original line order."
                        },
                        {
                                    "id": "C",
                                    "text": "It converts all text to uppercase",
                                    "explanationIfWrong": "It only splits on line breaks."
                        },
                        {
                                    "id": "D",
                                    "text": "It ignores empty lines",
                                    "explanationIfWrong": "Empty lines are preserved as empty strings."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ".splitlines() breaks text into a list without retaining the trailing '\\n' characters."
},
          {
            "id": "q-6.1-1-v3",
            "question": "What does a second call to file.read() return immediately after the first read has finished?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "An empty string \"\", because the file pointer is already at the end of the file",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The entire file again from the beginning",
                                    "explanationIfWrong": "The pointer does not rewind automatically; you would need file.seek(0)."
                        },
                        {
                                    "id": "C",
                                    "text": "It raises an EOFError",
                                    "explanationIfWrong": "Reading at EOF simply returns an empty string."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "It returns an empty string, not None."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "File reading is stateful. Once the file pointer reaches the end, further reads return \"\"."
}
        ]
      },
      {
        "heading": "Line-by-Line Iteration with for line in file",
        "text": "The most memory-efficient way to process a file is iterating directly over the file object using a for loop: for line in file. Python streams one line at a time from disk into memory, allowing you to process files containing gigabytes of data without running out of RAM.",
        "codeSnippet": "with open(\"grades.csv\", \"r\") as file:\n    for line in file:\n        line = line.strip()  # Remove trailing newline \\n\n        print(f\"Processing: {line}\")",
        "terminalOutput": "Processing: Alice,95\nProcessing: Bob,88\nProcessing: Charlie,76",
        "tip": "Each line read from a file includes its trailing newline \\n. Use line.strip() to clean it.",
        "mcq": {
          "id": "q-6.1-2-v1",
          "question": "What is the primary memory advantage of using for line in file: over file.readlines()?",
          "options": [
                    {
                              "id": "A",
                              "text": "It loads only one line into memory at a time rather than loading all lines at once into RAM",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It compresses the file on disk automatically",
                              "explanationIfWrong": "Iteration does not compress disk files."
                    },
                    {
                              "id": "C",
                              "text": "It skips blank lines without reading them",
                              "explanationIfWrong": "All lines are yielded, including empty ones."
                    },
                    {
                              "id": "D",
                              "text": "It runs the loop in background threads",
                              "explanationIfWrong": "Iteration is sequential streaming."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "File objects act as iterators, lazily yielding one line at a time to maintain low memory usage."
},
        "retestMcq": {
          "id": "q-6.1-2-v2",
          "question": "Why does printing lines directly from a file with print(line) often produce double line spacing?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because line already has a trailing '\\n' and print() appends its own newline by default",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because the terminal font is double-spaced",
                              "explanationIfWrong": "The two newlines (from line and from print) cause the blank row."
                    },
                    {
                              "id": "C",
                              "text": "Because text files always duplicate blank spaces",
                              "explanationIfWrong": "Each file line ends in '\\n'."
                    },
                    {
                              "id": "D",
                              "text": "Because Python prints in draft mode",
                              "explanationIfWrong": "The trailing '\\n' combined with print's default newline creates 2 newlines."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The line contains '\\n' and print() adds another '\\n'. Use line.strip() or print(line, end='')."
},
        "questionPool": [
          {
            "id": "q-6.1-2-v1",
            "question": "What is the primary memory advantage of using for line in file: over file.readlines()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It loads only one line into memory at a time rather than loading all lines at once into RAM",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It compresses the file on disk automatically",
                                    "explanationIfWrong": "Iteration does not compress disk files."
                        },
                        {
                                    "id": "C",
                                    "text": "It skips blank lines without reading them",
                                    "explanationIfWrong": "All lines are yielded, including empty ones."
                        },
                        {
                                    "id": "D",
                                    "text": "It runs the loop in background threads",
                                    "explanationIfWrong": "Iteration is sequential streaming."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "File objects act as iterators, lazily yielding one line at a time to maintain low memory usage."
},
          {
            "id": "q-6.1-2-v2",
            "question": "Why does printing lines directly from a file with print(line) often produce double line spacing?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because line already has a trailing '\\n' and print() appends its own newline by default",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because the terminal font is double-spaced",
                                    "explanationIfWrong": "The two newlines (from line and from print) cause the blank row."
                        },
                        {
                                    "id": "C",
                                    "text": "Because text files always duplicate blank spaces",
                                    "explanationIfWrong": "Each file line ends in '\\n'."
                        },
                        {
                                    "id": "D",
                                    "text": "Because Python prints in draft mode",
                                    "explanationIfWrong": "The trailing '\\n' combined with print's default newline creates 2 newlines."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The line contains '\\n' and print() adds another '\\n'. Use line.strip() or print(line, end='')."
},
          {
            "id": "q-6.1-2-v3",
            "question": "What does line.strip() remove from the string line?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "All leading and trailing whitespace characters, including spaces, tabs (\\t), and newlines (\\n)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Only characters in the middle of words",
                                    "explanationIfWrong": ".strip() only removes characters at the beginning and end."
                        },
                        {
                                    "id": "C",
                                    "text": "All punctuation marks",
                                    "explanationIfWrong": "It strips whitespace by default, not punctuation."
                        },
                        {
                                    "id": "D",
                                    "text": "Only uppercase letters",
                                    "explanationIfWrong": "It cleans whitespace."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ".strip() removes whitespace (including '\\n', '\\r', '\\t', ' ') from both ends of the string."
}
        ]
      },
      {
        "heading": "Reading All Lines with .readlines()",
        "text": "The .readlines() method reads all lines from the file and returns them as a list of strings, where each element represents one line (including its trailing \\n).",
        "codeSnippet": "with open(\"items.txt\", \"r\") as file:\n    lines = file.readlines()\n\nprint(f\"First line: {lines[0].strip()}\")\nprint(f\"Last line: {lines[-1].strip()}\")",
        "terminalOutput": "First line: Laptop\nLast line: Monitor",
        "mcq": {
          "id": "q-6.1-3-v1",
          "question": "What does file.readlines() return?",
          "options": [
                    {
                              "id": "A",
                              "text": "A list of strings, where each item is a line from the file",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A single continuous string",
                              "explanationIfWrong": ".read() returns a single string; .readlines() returns a list."
                    },
                    {
                              "id": "C",
                              "text": "A dictionary of line numbers and text",
                              "explanationIfWrong": "It returns a list of strings."
                    },
                    {
                              "id": "D",
                              "text": "The number of lines as an integer",
                              "explanationIfWrong": "It returns the list of lines; use len() to count them."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "readlines() returns a list where each element corresponds to one line of the file."
},
        "retestMcq": {
          "id": "q-6.1-3-v2",
          "question": "If a file has 5 lines, what is len(file.readlines())?",
          "options": [
                    {
                              "id": "A",
                              "text": "5",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "4",
                              "explanationIfWrong": "Length is the count of items in the list (5)."
                    },
                    {
                              "id": "C",
                              "text": "1",
                              "explanationIfWrong": "Each line forms an element in the returned list."
                    },
                    {
                              "id": "D",
                              "text": "0",
                              "explanationIfWrong": "There are 5 elements."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Each line of the file is an element in the list, so the list has length 5."
},
        "questionPool": [
          {
            "id": "q-6.1-3-v1",
            "question": "What does file.readlines() return?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A list of strings, where each item is a line from the file",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A single continuous string",
                                    "explanationIfWrong": ".read() returns a single string; .readlines() returns a list."
                        },
                        {
                                    "id": "C",
                                    "text": "A dictionary of line numbers and text",
                                    "explanationIfWrong": "It returns a list of strings."
                        },
                        {
                                    "id": "D",
                                    "text": "The number of lines as an integer",
                                    "explanationIfWrong": "It returns the list of lines; use len() to count them."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "readlines() returns a list where each element corresponds to one line of the file."
},
          {
            "id": "q-6.1-3-v2",
            "question": "If a file has 5 lines, what is len(file.readlines())?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "5",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "4",
                                    "explanationIfWrong": "Length is the count of items in the list (5)."
                        },
                        {
                                    "id": "C",
                                    "text": "1",
                                    "explanationIfWrong": "Each line forms an element in the returned list."
                        },
                        {
                                    "id": "D",
                                    "text": "0",
                                    "explanationIfWrong": "There are 5 elements."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each line of the file is an element in the list, so the list has length 5."
},
          {
            "id": "q-6.1-3-v3",
            "question": "Does .readlines() remove the newline character '\\n' from the ends of lines?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, each string in the list retains its trailing '\\n' (except possibly the very last line if no newline was present)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, .readlines() strips all whitespace automatically",
                                    "explanationIfWrong": "readlines() retains raw line content including '\\n'."
                        },
                        {
                                    "id": "C",
                                    "text": "Only on Linux",
                                    "explanationIfWrong": "Newline retention is standard across all platforms."
                        },
                        {
                                    "id": "D",
                                    "text": "Only if using Python 2",
                                    "explanationIfWrong": "Python 3 preserves trailing newlines in readlines()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Lines returned by readlines() include their trailing '\\n'."
}
        ]
      },
      {
        "heading": "Parsing Delimited CSV Data",
        "text": "A CSV (Comma-Separated Values) file stores tabular data as plain text lines separated by delimiters (such as commas , or semicolons ;). To parse a line, strip the newline and call .split(delimiter).",
        "codeSnippet": "csv_data = \"Alice;22;Helsinki\\nBob;25;Tampere\"\nfor line in csv_data.splitlines():\n    parts = line.split(\";\")\n    name = parts[0]\n    age = int(parts[1])\n    city = parts[2]\n    print(f\"{name} is {age} years old from {city}\")",
        "terminalOutput": "Alice is 22 years old from Helsinki\nBob is 25 years old from Tampere",
        "tip": "In Finland and parts of Europe, CSV files often use semicolons (;) as delimiters because commas are used as decimal separators in numbers.",
        "mcq": {
          "id": "q-6.1-4-v1",
          "question": "Given line = 'TKT10001;Intro to Programming;5\\n', how do you parse the course name?",
          "options": [
                    {
                              "id": "A",
                              "text": "line.strip().split(';')[1]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "line.split()[1]",
                              "explanationIfWrong": "Default split() splits on whitespace, splitting 'Intro' from 'to'."
                    },
                    {
                              "id": "C",
                              "text": "line[1]",
                              "explanationIfWrong": "line[1] is the single character 'K'."
                    },
                    {
                              "id": "D",
                              "text": "line.parse(';')[1]",
                              "explanationIfWrong": "Strings do not have a .parse() method; use .split()."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Splitting by ';' after stripping yields parts; index 1 is 'Intro to Programming'."
},
        "retestMcq": {
          "id": "q-6.1-4-v2",
          "question": "What happens if a CSV file line contains fewer fields than expected, e.g. parts = line.split(',') and you access parts[2]?",
          "options": [
                    {
                              "id": "A",
                              "text": "IndexError: list index out of range",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It assigns parts[2] = None automatically",
                              "explanationIfWrong": "Python raises an IndexError when an index does not exist in the list."
                    },
                    {
                              "id": "C",
                              "text": "KeyError",
                              "explanationIfWrong": "Lists raise IndexError for missing positions."
                    },
                    {
                              "id": "D",
                              "text": "ValueError",
                              "explanationIfWrong": "Accessing invalid list indices raises IndexError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "If parts has length less than 3, parts[2] triggers an IndexError."
},
        "questionPool": [
          {
            "id": "q-6.1-4-v1",
            "question": "Given line = 'TKT10001;Intro to Programming;5\\n', how do you parse the course name?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "line.strip().split(';')[1]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "line.split()[1]",
                                    "explanationIfWrong": "Default split() splits on whitespace, splitting 'Intro' from 'to'."
                        },
                        {
                                    "id": "C",
                                    "text": "line[1]",
                                    "explanationIfWrong": "line[1] is the single character 'K'."
                        },
                        {
                                    "id": "D",
                                    "text": "line.parse(';')[1]",
                                    "explanationIfWrong": "Strings do not have a .parse() method; use .split()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Splitting by ';' after stripping yields parts; index 1 is 'Intro to Programming'."
},
          {
            "id": "q-6.1-4-v2",
            "question": "What happens if a CSV file line contains fewer fields than expected, e.g. parts = line.split(',') and you access parts[2]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "IndexError: list index out of range",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It assigns parts[2] = None automatically",
                                    "explanationIfWrong": "Python raises an IndexError when an index does not exist in the list."
                        },
                        {
                                    "id": "C",
                                    "text": "KeyError",
                                    "explanationIfWrong": "Lists raise IndexError for missing positions."
                        },
                        {
                                    "id": "D",
                                    "text": "ValueError",
                                    "explanationIfWrong": "Accessing invalid list indices raises IndexError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "If parts has length less than 3, parts[2] triggers an IndexError."
},
          {
            "id": "q-6.1-4-v3",
            "question": "Which Python standard library module is specialized for robust CSV parsing and writing?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "csv",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "table",
                                    "explanationIfWrong": "The module is named csv."
                        },
                        {
                                    "id": "C",
                                    "text": "spreadsheet",
                                    "explanationIfWrong": "The built-in module is csv."
                        },
                        {
                                    "id": "D",
                                    "text": "io.csv",
                                    "explanationIfWrong": "The standard module is simply csv."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "import csv provides csv.reader and csv.writer for handling quoted fields, commas, and escapes."
}
        ]
      },
      {
        "heading": "Filtering & Cleaning Data from Files",
        "text": "When reading data files, you typically filter out invalid rows (like blank lines or comments) and convert string tokens to appropriate types (such as int or float) before storing them in application collections.",
        "codeSnippet": "scores = []\nwith open(\"results.txt\", \"w\") as f:\n    f.write(\"85\\n92\\n# Comment\\n\\n78\\n\")\n\nwith open(\"results.txt\", \"r\") as f:\n    for line in f:\n        line = line.strip()\n        if not line or line.startswith(\"#\"):\n            continue  # Skip blank lines and comments\n        scores.append(int(line))\n\nprint(f\"Scores: {scores}, Average: {sum(scores)/len(scores):.1f}\")",
        "terminalOutput": "Scores: [85, 92, 78], Average: 85.0",
        "mcq": {
          "id": "q-6.1-5-v1",
          "question": "Why is if not line: continue used when processing lines in a file loop?",
          "options": [
                    {
                              "id": "A",
                              "text": "To skip empty or blank lines so they don't cause conversion errors or invalid entries",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "To break out of the loop immediately",
                              "explanationIfWrong": "continue skips to the next iteration; break exits the loop."
                    },
                    {
                              "id": "C",
                              "text": "To reverse the line order",
                              "explanationIfWrong": "It only filters out empty strings."
                    },
                    {
                              "id": "D",
                              "text": "To close the file",
                              "explanationIfWrong": "The context manager closes the file."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Empty strings evaluate to False in boolean context (not line is True), cleanly skipping blank rows."
},
        "retestMcq": {
          "id": "q-6.1-5-v2",
          "question": "What error occurs if you run int('3.14') directly on a line read from a file?",
          "options": [
                    {
                              "id": "A",
                              "text": "ValueError: invalid literal for int() with base 10: '3.14'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It truncates to 3",
                              "explanationIfWrong": "int() cannot parse strings with decimal points directly; use int(float('3.14'))."
                    },
                    {
                              "id": "C",
                              "text": "TypeError",
                              "explanationIfWrong": "Passing a string with decimals to int() raises ValueError."
                    },
                    {
                              "id": "D",
                              "text": "It returns 3.14",
                              "explanationIfWrong": "int() returns integers."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "int() expects integer characters. Convert via float('3.14') first if decimal strings are present."
},
        "questionPool": [
          {
            "id": "q-6.1-5-v1",
            "question": "Why is if not line: continue used when processing lines in a file loop?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To skip empty or blank lines so they don't cause conversion errors or invalid entries",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "To break out of the loop immediately",
                                    "explanationIfWrong": "continue skips to the next iteration; break exits the loop."
                        },
                        {
                                    "id": "C",
                                    "text": "To reverse the line order",
                                    "explanationIfWrong": "It only filters out empty strings."
                        },
                        {
                                    "id": "D",
                                    "text": "To close the file",
                                    "explanationIfWrong": "The context manager closes the file."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Empty strings evaluate to False in boolean context (not line is True), cleanly skipping blank rows."
},
          {
            "id": "q-6.1-5-v2",
            "question": "What error occurs if you run int('3.14') directly on a line read from a file?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError: invalid literal for int() with base 10: '3.14'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It truncates to 3",
                                    "explanationIfWrong": "int() cannot parse strings with decimal points directly; use int(float('3.14'))."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Passing a string with decimals to int() raises ValueError."
                        },
                        {
                                    "id": "D",
                                    "text": "It returns 3.14",
                                    "explanationIfWrong": "int() returns integers."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "int() expects integer characters. Convert via float('3.14') first if decimal strings are present."
},
          {
            "id": "q-6.1-5-v3",
            "question": "What string method checks whether a line starts with a comment marker like '# '?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "line.startswith('#')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "line.has_prefix('#')",
                                    "explanationIfWrong": "Python uses .startswith(), not .has_prefix()."
                        },
                        {
                                    "id": "C",
                                    "text": "line.prefix('#')",
                                    "explanationIfWrong": "The method name is startswith."
                        },
                        {
                                    "id": "D",
                                    "text": "line.starts('#')",
                                    "explanationIfWrong": "The method is startswith()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "str.startswith(prefix) returns True if the string begins with the specified substring."
}
        ]
      }
    ]
  },
  {
    "id": "6-2-writing-files",
    "number": "6.2",
    "title": "Writing Files",
    "subtitle": "Create new files, overwrite, append with 'a' mode, write formatted text, and persist structured datasets.",
    "readTime": "20 min",
    "objectives": [
      "Open files in write mode ('w') and understand overwrite behavior",
      "Write strings to files using the .write() method and handle manual newlines",
      "Append new data to existing files using append mode ('a')",
      "Write multiple lines simultaneously using .writelines()",
      "Save tabular and dictionary data into formatted CSV text files",
      "Understand file flushing and buffer persistence mechanics"
],
    "theoryBlocks": [
      {
        "heading": "Writing to Files with 'w' Mode",
        "text": "Opening a file in write mode ('w') creates the file if it does not exist. If the file already exists, opening it in 'w' mode instantly erases (truncates) its entire existing content! Always use caution when selecting write mode.",
        "codeSnippet": "with open(\"output.txt\", \"w\") as file:\n    file.write(\"First line\\n\")\n    file.write(\"Second line\\n\")\n\nprint(\"File written successfully!\")",
        "terminalOutput": "File written successfully!",
        "warning": "Warning: open(file, 'w') wipes the file immediately when opened, before you even call .write().",
        "mcq": {
          "id": "q-6.2-0-v1",
          "question": "What happens if you open an existing file that has 1,000 lines of data using open('file.txt', 'w')?",
          "options": [
                    {
                              "id": "A",
                              "text": "The entire existing contents are erased (truncated to 0 bytes) immediately upon opening",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "New content is added to the end of the file",
                              "explanationIfWrong": "Adding to the end requires append mode 'a', not 'w'."
                    },
                    {
                              "id": "C",
                              "text": "Python raises a FileExistsError",
                              "explanationIfWrong": "'w' overwrites without error; 'x' raises FileExistsError."
                    },
                    {
                              "id": "D",
                              "text": "Python prompts the user for confirmation",
                              "explanationIfWrong": "Python executes the operation silently."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "'w' mode creates an empty file, completely overwriting any existing data."
},
        "retestMcq": {
          "id": "q-6.2-0-v2",
          "question": "What happens if the file specified in open('new_file.txt', 'w') does not exist on disk?",
          "options": [
                    {
                              "id": "A",
                              "text": "Python creates a brand-new empty file with that name",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python raises a FileNotFoundError",
                              "explanationIfWrong": "FileNotFoundError only happens in read mode 'r'; 'w' creates the file."
                    },
                    {
                              "id": "C",
                              "text": "The program crashes",
                              "explanationIfWrong": "'w' mode creates non-existent files automatically."
                    },
                    {
                              "id": "D",
                              "text": "The filename is renamed to temp.txt",
                              "explanationIfWrong": "The specified file is created."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Write mode automatically creates the file if it does not already exist."
},
        "questionPool": [
          {
            "id": "q-6.2-0-v1",
            "question": "What happens if you open an existing file that has 1,000 lines of data using open('file.txt', 'w')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The entire existing contents are erased (truncated to 0 bytes) immediately upon opening",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "New content is added to the end of the file",
                                    "explanationIfWrong": "Adding to the end requires append mode 'a', not 'w'."
                        },
                        {
                                    "id": "C",
                                    "text": "Python raises a FileExistsError",
                                    "explanationIfWrong": "'w' overwrites without error; 'x' raises FileExistsError."
                        },
                        {
                                    "id": "D",
                                    "text": "Python prompts the user for confirmation",
                                    "explanationIfWrong": "Python executes the operation silently."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'w' mode creates an empty file, completely overwriting any existing data."
},
          {
            "id": "q-6.2-0-v2",
            "question": "What happens if the file specified in open('new_file.txt', 'w') does not exist on disk?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Python creates a brand-new empty file with that name",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python raises a FileNotFoundError",
                                    "explanationIfWrong": "FileNotFoundError only happens in read mode 'r'; 'w' creates the file."
                        },
                        {
                                    "id": "C",
                                    "text": "The program crashes",
                                    "explanationIfWrong": "'w' mode creates non-existent files automatically."
                        },
                        {
                                    "id": "D",
                                    "text": "The filename is renamed to temp.txt",
                                    "explanationIfWrong": "The specified file is created."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Write mode automatically creates the file if it does not already exist."
},
          {
            "id": "q-6.2-0-v3",
            "question": "Which mode should you choose if you want to ensure the file is created ONLY if it does not already exist (failing if it exists)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'x' (exclusive creation mode)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'w'",
                                    "explanationIfWrong": "'w' overwrites existing files silently."
                        },
                        {
                                    "id": "C",
                                    "text": "'a'",
                                    "explanationIfWrong": "'a' appends to existing files."
                        },
                        {
                                    "id": "D",
                                    "text": "'r+'",
                                    "explanationIfWrong": "'r+' requires the file to exist already."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Mode 'x' opens for exclusive creation, raising FileExistsError if the file already exists."
}
        ]
      },
      {
        "heading": "The .write() Method and Newlines",
        "text": "Unlike the print() function, the file.write(string) method does NOT automatically append a newline character to the text. If you want separate lines in your file, you must explicitly include '\\n' at the end of each string.",
        "codeSnippet": "with open(\"sample.txt\", \"w\") as f:\n    # Without \\n, words run together:\n    f.write(\"Hello\")\n    f.write(\"World\")\n    # With \\n:\n    f.write(\"\\nThird Line\\n\")",
        "terminalOutput": "# File contents:\nHelloWorld\nThird Line",
        "tip": "You can also use print(\"Hello\", file=f) which automatically appends '\\n' just like standard terminal print.",
        "mcq": {
          "id": "q-6.2-1-v1",
          "question": "What is the content of the file after running f.write('A'); f.write('B')?",
          "options": [
                    {
                              "id": "A",
                              "text": "'AB' on a single line",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'A' on line 1, and 'B' on line 2",
                              "explanationIfWrong": ".write() does not insert newlines automatically."
                    },
                    {
                              "id": "C",
                              "text": "'A B' separated by space",
                              "explanationIfWrong": ".write() does not insert spaces."
                    },
                    {
                              "id": "D",
                              "text": "['A', 'B']",
                              "explanationIfWrong": "Files store raw character streams."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "file.write() writes the exact string characters without adding newlines, producing 'AB'."
},
        "retestMcq": {
          "id": "q-6.2-1-v2",
          "question": "What error occurs if you pass an integer to file.write(42)?",
          "options": [
                    {
                              "id": "A",
                              "text": "TypeError: write() argument must be str, not int",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "ValueError: invalid number",
                              "explanationIfWrong": "Type mismatches raise TypeError."
                    },
                    {
                              "id": "C",
                              "text": "It converts 42 to '42' automatically",
                              "explanationIfWrong": "write() does not convert types; you must pass str(42) or f\"{42}\"."
                    },
                    {
                              "id": "D",
                              "text": "It writes 42 in binary format",
                              "explanationIfWrong": "Text files expect str objects."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "file.write() requires an argument of type str. Numbers must be converted with str() or f-strings."
},
        "questionPool": [
          {
            "id": "q-6.2-1-v1",
            "question": "What is the content of the file after running f.write('A'); f.write('B')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'AB' on a single line",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'A' on line 1, and 'B' on line 2",
                                    "explanationIfWrong": ".write() does not insert newlines automatically."
                        },
                        {
                                    "id": "C",
                                    "text": "'A B' separated by space",
                                    "explanationIfWrong": ".write() does not insert spaces."
                        },
                        {
                                    "id": "D",
                                    "text": "['A', 'B']",
                                    "explanationIfWrong": "Files store raw character streams."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "file.write() writes the exact string characters without adding newlines, producing 'AB'."
},
          {
            "id": "q-6.2-1-v2",
            "question": "What error occurs if you pass an integer to file.write(42)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: write() argument must be str, not int",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ValueError: invalid number",
                                    "explanationIfWrong": "Type mismatches raise TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "It converts 42 to '42' automatically",
                                    "explanationIfWrong": "write() does not convert types; you must pass str(42) or f\"{42}\"."
                        },
                        {
                                    "id": "D",
                                    "text": "It writes 42 in binary format",
                                    "explanationIfWrong": "Text files expect str objects."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "file.write() requires an argument of type str. Numbers must be converted with str() or f-strings."
},
          {
            "id": "q-6.2-1-v3",
            "question": "What does file.write(text) return in Python 3?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The number of characters written as an integer",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "None",
                                    "explanationIfWrong": "In Python 3, .write() returns the character count written."
                        },
                        {
                                    "id": "C",
                                    "text": "The file object itself",
                                    "explanationIfWrong": "It returns an integer."
                        },
                        {
                                    "id": "D",
                                    "text": "True",
                                    "explanationIfWrong": "It returns the number of characters written."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python 3, file.write() returns the integer count of characters written to the stream."
}
        ]
      },
      {
        "heading": "Appending to Files with 'a' Mode",
        "text": "Opening a file in append mode ('a') creates the file if it does not exist, or positions the write pointer at the very end of the file if it does exist. Any text written is appended to the existing content without erasing prior data.",
        "codeSnippet": "# Append a new log entry:\nwith open(\"app.log\", \"a\") as log:\n    log.write(\"User logged in at 10:45 AM\\n\")\n    log.write(\"User logged out at 11:00 AM\\n\")",
        "terminalOutput": "Log entries added successfully without deleting previous logs!",
        "mcq": {
          "id": "q-6.2-2-v1",
          "question": "What happens to the existing data in a file when opened with mode 'a'?",
          "options": [
                    {
                              "id": "A",
                              "text": "The existing data is completely preserved, and new writes are added to the end",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The existing data is overwritten from the beginning",
                              "explanationIfWrong": "Overwriting is mode 'w'; mode 'a' appends."
                    },
                    {
                              "id": "C",
                              "text": "The file is locked and cannot be read",
                              "explanationIfWrong": "Mode 'a' allows appending."
                    },
                    {
                              "id": "D",
                              "text": "The file is converted to read-only",
                              "explanationIfWrong": "Mode 'a' is write-only at EOF."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "'a' (append mode) writes exclusively at the end of the file, preserving all existing contents."
},
        "retestMcq": {
          "id": "q-6.2-2-v2",
          "question": "Which mode allows reading the file AND writing to the end without truncating?",
          "options": [
                    {
                              "id": "A",
                              "text": "'a+'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'w+'",
                              "explanationIfWrong": "'w+' truncates the file immediately upon opening."
                    },
                    {
                              "id": "C",
                              "text": "'r'",
                              "explanationIfWrong": "'r' is read-only."
                    },
                    {
                              "id": "D",
                              "text": "'w'",
                              "explanationIfWrong": "'w' does not allow appending."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "'a+' opens the file for both appending and reading without truncating existing content."
},
        "questionPool": [
          {
            "id": "q-6.2-2-v1",
            "question": "What happens to the existing data in a file when opened with mode 'a'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The existing data is completely preserved, and new writes are added to the end",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The existing data is overwritten from the beginning",
                                    "explanationIfWrong": "Overwriting is mode 'w'; mode 'a' appends."
                        },
                        {
                                    "id": "C",
                                    "text": "The file is locked and cannot be read",
                                    "explanationIfWrong": "Mode 'a' allows appending."
                        },
                        {
                                    "id": "D",
                                    "text": "The file is converted to read-only",
                                    "explanationIfWrong": "Mode 'a' is write-only at EOF."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'a' (append mode) writes exclusively at the end of the file, preserving all existing contents."
},
          {
            "id": "q-6.2-2-v2",
            "question": "Which mode allows reading the file AND writing to the end without truncating?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'a+'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'w+'",
                                    "explanationIfWrong": "'w+' truncates the file immediately upon opening."
                        },
                        {
                                    "id": "C",
                                    "text": "'r'",
                                    "explanationIfWrong": "'r' is read-only."
                        },
                        {
                                    "id": "D",
                                    "text": "'w'",
                                    "explanationIfWrong": "'w' does not allow appending."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'a+' opens the file for both appending and reading without truncating existing content."
},
          {
            "id": "q-6.2-2-v3",
            "question": "If you want to append numbers 1 to 3 to a file counter.txt, each on its own line, which code is correct?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "with open('counter.txt', 'a') as f: for i in range(1, 4): f.write(f'{i}\\n')",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "with open('counter.txt', 'w') as f: for i in range(1, 4): f.write(f'{i}')",
                                    "explanationIfWrong": "'w' erases prior contents, and omitting \\n puts them on one line."
                        },
                        {
                                    "id": "C",
                                    "text": "with open('counter.txt', 'r') as f: f.append('1\\n2\\n3\\n')",
                                    "explanationIfWrong": "File objects do not have an append method."
                        },
                        {
                                    "id": "D",
                                    "text": "open('counter.txt').write('123')",
                                    "explanationIfWrong": "Default mode is read-only, causing UnsupportedOperation."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Mode 'a' appends, and f'{i}\\n' writes each number with a terminating newline."
}
        ]
      },
      {
        "heading": "Writing Lists of Lines with .writelines()",
        "text": "The .writelines(list_of_strings) method writes a sequence of strings directly to the file. Note that like .write(), .writelines() does NOT append newlines between items; each string in the list must already end in '\\n'.",
        "codeSnippet": "cities = [\"Helsinki\\n\", \"Espoo\\n\", \"Vantaa\\n\"]\n\nwith open(\"cities.txt\", \"w\") as f:\n    f.writelines(cities)\n\nprint(\"Written 3 cities!\")",
        "terminalOutput": "Written 3 cities!",
        "mcq": {
          "id": "q-6.2-3-v1",
          "question": "Does file.writelines(['apple', 'banana']) add newlines between elements?",
          "options": [
                    {
                              "id": "A",
                              "text": "No, it writes them concatenated ('applebanana') unless each string ends in '\\n'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Yes, it adds a newline after each item automatically",
                              "explanationIfWrong": "Despite its name, writelines does not insert newlines."
                    },
                    {
                              "id": "C",
                              "text": "It adds commas between elements",
                              "explanationIfWrong": "It writes raw strings consecutively."
                    },
                    {
                              "id": "D",
                              "text": "It raises a TypeError",
                              "explanationIfWrong": "Passing a list of strings is valid."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Despite the plural name 'writelines', the method writes strings back-to-back without adding newlines."
},
        "retestMcq": {
          "id": "q-6.2-3-v2",
          "question": "How can you write a list of plain words ['cat', 'dog'] with newlines using a comprehension?",
          "options": [
                    {
                              "id": "A",
                              "text": "f.writelines([f\"{w}\\n\" for w in words])",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "f.writelines(words, newline=True)",
                              "explanationIfWrong": "writelines does not take a newline argument."
                    },
                    {
                              "id": "C",
                              "text": "f.write(words)",
                              "explanationIfWrong": "write() expects a single string, not a list."
                    },
                    {
                              "id": "D",
                              "text": "f.write_lines(words)",
                              "explanationIfWrong": "The method is writelines, not write_lines."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Appending '\\n' to each item via a comprehension ensures proper line-by-line formatting."
},
        "questionPool": [
          {
            "id": "q-6.2-3-v1",
            "question": "Does file.writelines(['apple', 'banana']) add newlines between elements?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, it writes them concatenated ('applebanana') unless each string ends in '\\n'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, it adds a newline after each item automatically",
                                    "explanationIfWrong": "Despite its name, writelines does not insert newlines."
                        },
                        {
                                    "id": "C",
                                    "text": "It adds commas between elements",
                                    "explanationIfWrong": "It writes raw strings consecutively."
                        },
                        {
                                    "id": "D",
                                    "text": "It raises a TypeError",
                                    "explanationIfWrong": "Passing a list of strings is valid."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Despite the plural name 'writelines', the method writes strings back-to-back without adding newlines."
},
          {
            "id": "q-6.2-3-v2",
            "question": "How can you write a list of plain words ['cat', 'dog'] with newlines using a comprehension?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "f.writelines([f\"{w}\\n\" for w in words])",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "f.writelines(words, newline=True)",
                                    "explanationIfWrong": "writelines does not take a newline argument."
                        },
                        {
                                    "id": "C",
                                    "text": "f.write(words)",
                                    "explanationIfWrong": "write() expects a single string, not a list."
                        },
                        {
                                    "id": "D",
                                    "text": "f.write_lines(words)",
                                    "explanationIfWrong": "The method is writelines, not write_lines."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Appending '\\n' to each item via a comprehension ensures proper line-by-line formatting."
},
          {
            "id": "q-6.2-3-v3",
            "question": "What error occurs if file.writelines([1, 2, 3]) is called with integers?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: sequence item 0: expected str instance, int found",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ValueError",
                                    "explanationIfWrong": "Type mismatches raise TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "It writes 123",
                                    "explanationIfWrong": "Items must be strings."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "This is a runtime TypeError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "All items passed to writelines() must be str objects."
}
        ]
      },
      {
        "heading": "Writing Structured CSV Files",
        "text": "To write structured data to a CSV file, format each row as a string with fields separated by delimiters, ending with '\\n'. Writing a header row first describes the columns.",
        "codeSnippet": "students = [\n    {\"name\": \"Ada\", \"score\": 95},\n    {\"name\": \"Linus\", \"score\": 92}\n]\n\nwith open(\"students.csv\", \"w\") as f:\n    f.write(\"name,score\\n\")  # Header row\n    for s in students:\n        f.write(f\"{s['name']},{s['score']}\\n\")",
        "terminalOutput": "# students.csv contains:\nname,score\nAda,95\nLinus,92",
        "mcq": {
          "id": "q-6.2-4-v1",
          "question": "What is the purpose of writing a header row (e.g. 'name,age,grade\\n') at the top of a CSV file?",
          "options": [
                    {
                              "id": "A",
                              "text": "It labels the columns so human readers and software parsers know what data each column contains",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It is required by the Python compiler",
                              "explanationIfWrong": "Headers are not strictly mandatory, but standard practice."
                    },
                    {
                              "id": "C",
                              "text": "It encrypts the remaining data",
                              "explanationIfWrong": "Headers are plain text."
                    },
                    {
                              "id": "D",
                              "text": "It defines Python variable types",
                              "explanationIfWrong": "CSV is a plain text format without type definitions."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Header rows provide schema metadata identifying the attributes stored in each column."
},
        "retestMcq": {
          "id": "q-6.2-4-v2",
          "question": "What potential issue arises if a text field to be written into a comma-delimited CSV contains a comma itself (e.g. 'Helsinki, Finland')?",
          "options": [
                    {
                              "id": "A",
                              "text": "The comma will be misread as a column separator unless the field is enclosed in quotes (\"Helsinki, Finland\")",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python deletes the comma automatically",
                              "explanationIfWrong": "Python writes whatever string is provided."
                    },
                    {
                              "id": "C",
                              "text": "A SyntaxError crashes the script",
                              "explanationIfWrong": "The error occurs when reading the corrupted data later."
                    },
                    {
                              "id": "D",
                              "text": "The file is converted to a binary file",
                              "explanationIfWrong": "The delimiter creates extra columns unless escaped."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Values containing commas must be wrapped in quotes or handled using the standard csv module."
},
        "questionPool": [
          {
            "id": "q-6.2-4-v1",
            "question": "What is the purpose of writing a header row (e.g. 'name,age,grade\\n') at the top of a CSV file?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It labels the columns so human readers and software parsers know what data each column contains",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It is required by the Python compiler",
                                    "explanationIfWrong": "Headers are not strictly mandatory, but standard practice."
                        },
                        {
                                    "id": "C",
                                    "text": "It encrypts the remaining data",
                                    "explanationIfWrong": "Headers are plain text."
                        },
                        {
                                    "id": "D",
                                    "text": "It defines Python variable types",
                                    "explanationIfWrong": "CSV is a plain text format without type definitions."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Header rows provide schema metadata identifying the attributes stored in each column."
},
          {
            "id": "q-6.2-4-v2",
            "question": "What potential issue arises if a text field to be written into a comma-delimited CSV contains a comma itself (e.g. 'Helsinki, Finland')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The comma will be misread as a column separator unless the field is enclosed in quotes (\"Helsinki, Finland\")",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python deletes the comma automatically",
                                    "explanationIfWrong": "Python writes whatever string is provided."
                        },
                        {
                                    "id": "C",
                                    "text": "A SyntaxError crashes the script",
                                    "explanationIfWrong": "The error occurs when reading the corrupted data later."
                        },
                        {
                                    "id": "D",
                                    "text": "The file is converted to a binary file",
                                    "explanationIfWrong": "The delimiter creates extra columns unless escaped."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Values containing commas must be wrapped in quotes or handled using the standard csv module."
},
          {
            "id": "q-6.2-4-v3",
            "question": "Which method on string objects joins a list of strings row = ['A', 'B', 'C'] into a comma-separated row?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "\",\".join(row)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "row.join(\",\")",
                                    "explanationIfWrong": "join() is called on the separator string: sep.join(list)."
                        },
                        {
                                    "id": "C",
                                    "text": "str.csv(row)",
                                    "explanationIfWrong": "There is no str.csv method."
                        },
                        {
                                    "id": "D",
                                    "text": "row.split(\",\")",
                                    "explanationIfWrong": "split() turns a string into a list; join() does the reverse."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "\",\".join(row) concatenates list elements separated by commas: 'A,B,C'."
}
        ]
      },
      {
        "heading": "File Flushing and Buffering",
        "text": "For performance reasons, operating systems buffer file writes in memory before flushing them to the physical disk. When a file is closed (or when file.flush() is called), all buffered bytes are guaranteed to be written to disk.",
        "codeSnippet": "with open(\"log.txt\", \"w\") as f:\n    f.write(\"Important event!\")\n    f.flush()  # Forces write from RAM buffer to disk immediately",
        "terminalOutput": "Event flushed to disk!",
        "tip": "Exiting a with block automatically flushes and closes the file.",
        "mcq": {
          "id": "q-6.2-5-v1",
          "question": "What does file.flush() do?",
          "options": [
                    {
                              "id": "A",
                              "text": "Forces any buffered write data in RAM to be written immediately to the physical disk",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Deletes the contents of the file",
                              "explanationIfWrong": "flush writes buffered data; it does not delete."
                    },
                    {
                              "id": "C",
                              "text": "Closes the file permanently",
                              "explanationIfWrong": "close() flushes and closes; flush() keeps the file open."
                    },
                    {
                              "id": "D",
                              "text": "Rewinds the read pointer to line 0",
                              "explanationIfWrong": "Rewinding is done with file.seek(0)."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "flush() empties internal I/O write buffers to storage without closing the file."
},
        "retestMcq": {
          "id": "q-6.2-5-v2",
          "question": "If your program crashes or loses power before a file without with is closed, what could happen to written data?",
          "options": [
                    {
                              "id": "A",
                              "text": "Data residing in memory buffers may be lost and never written to disk",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python automatically recovers it from BIOS",
                              "explanationIfWrong": "Unflushed RAM buffers are lost on sudden power failure."
                    },
                    {
                              "id": "C",
                              "text": "The entire hard drive is corrupted",
                              "explanationIfWrong": "Only unflushed file data is lost."
                    },
                    {
                              "id": "D",
                              "text": "The operating system restarts the script",
                              "explanationIfWrong": "Buffered data is simply dropped."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Unflushed buffers remain in volatile memory. Using with open() ensures timely flushing and closing."
},
        "questionPool": [
          {
            "id": "q-6.2-5-v1",
            "question": "What does file.flush() do?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Forces any buffered write data in RAM to be written immediately to the physical disk",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Deletes the contents of the file",
                                    "explanationIfWrong": "flush writes buffered data; it does not delete."
                        },
                        {
                                    "id": "C",
                                    "text": "Closes the file permanently",
                                    "explanationIfWrong": "close() flushes and closes; flush() keeps the file open."
                        },
                        {
                                    "id": "D",
                                    "text": "Rewinds the read pointer to line 0",
                                    "explanationIfWrong": "Rewinding is done with file.seek(0)."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "flush() empties internal I/O write buffers to storage without closing the file."
},
          {
            "id": "q-6.2-5-v2",
            "question": "If your program crashes or loses power before a file without with is closed, what could happen to written data?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Data residing in memory buffers may be lost and never written to disk",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python automatically recovers it from BIOS",
                                    "explanationIfWrong": "Unflushed RAM buffers are lost on sudden power failure."
                        },
                        {
                                    "id": "C",
                                    "text": "The entire hard drive is corrupted",
                                    "explanationIfWrong": "Only unflushed file data is lost."
                        },
                        {
                                    "id": "D",
                                    "text": "The operating system restarts the script",
                                    "explanationIfWrong": "Buffered data is simply dropped."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Unflushed buffers remain in volatile memory. Using with open() ensures timely flushing and closing."
},
          {
            "id": "q-6.2-5-v3",
            "question": "Does exiting a with open(...) as f: block automatically flush the write buffer?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, closing the file automatically flushes all pending write buffers to disk",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, you must always call f.flush() manually before exiting",
                                    "explanationIfWrong": "file.close() implicitly flushes the buffer."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if the file is smaller than 1 KB",
                                    "explanationIfWrong": "All buffered data is flushed on close."
                        },
                        {
                                    "id": "D",
                                    "text": "Only in Python on Windows",
                                    "explanationIfWrong": "This is universal across all operating systems."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "File closure performs an implicit flush, ensuring data integrity upon with block exit."
}
        ]
      }
    ]
  },
  {
    "id": "6-3-handling-errors",
    "number": "6.3",
    "title": "Handling Errors & Exceptions",
    "subtitle": "Build resilient programs using try-except blocks, catching specific exceptions, else/finally clauses, and raise.",
    "readTime": "25 min",
    "objectives": [
      "Intercept runtime errors and prevent program crashes with try-except",
      "Catch specific exceptions (ValueError, FileNotFoundError, ZeroDivisionError)",
      "Structure multi-branch exception handlers for different failure modes",
      "Inspect error messages dynamically using except Exception as e",
      "Use else for code that runs only when no errors occur, and finally for cleanup",
      "Trigger custom validation exceptions using the raise statement"
],
    "theoryBlocks": [
      {
        "heading": "Introduction to Exceptions & try-except",
        "text": "An exception is an error that occurs during program execution. If unhandled, an exception halts execution and displays a traceback. A try-except block intercepts the exception, allowing the program to handle the issue gracefully and continue running.",
        "codeSnippet": "try:\n    age = int(input(\"Enter your age: \"))\n    print(f\"Next year you will be {age + 1}\")\nexcept:\n    print(\"Invalid input! Please enter a valid whole number.\")\n\nprint(\"Program continues running normally.\")",
        "terminalOutput": "Enter your age: abc\nInvalid input! Please enter a valid whole number.\nProgram continues running normally.",
        "mcq": {
          "id": "q-6.3-0-v1",
          "question": "What happens when an exception occurs inside the try block of a try-except statement?",
          "options": [
                    {
                              "id": "A",
                              "text": "Execution immediately stops in the try block and jumps to the matching except block",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python retries the failed line 3 times automatically",
                              "explanationIfWrong": "Python does not retry lines automatically."
                    },
                    {
                              "id": "C",
                              "text": "The entire program crashes and terminates",
                              "explanationIfWrong": "The except block catches the error, preventing a crash."
                    },
                    {
                              "id": "D",
                              "text": "The variable is assigned None and try continues to the next line",
                              "explanationIfWrong": "Execution abandons the rest of the try block immediately."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When an exception is raised in try, control transfers immediately to the corresponding except handler."
},
        "retestMcq": {
          "id": "q-6.3-0-v2",
          "question": "What happens if NO exception occurs inside the try block?",
          "options": [
                    {
                              "id": "A",
                              "text": "The try block finishes completely and the except block is skipped entirely",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The except block executes anyway as a confirmation",
                              "explanationIfWrong": "except only runs when an error is caught."
                    },
                    {
                              "id": "C",
                              "text": "A Warning is printed to the console",
                              "explanationIfWrong": "Successful execution produces no warnings."
                    },
                    {
                              "id": "D",
                              "text": "The program halts",
                              "explanationIfWrong": "Execution continues to statements after the try-except."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "If no error occurs, the except block is bypassed and execution continues past it."
},
        "questionPool": [
          {
            "id": "q-6.3-0-v1",
            "question": "What happens when an exception occurs inside the try block of a try-except statement?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Execution immediately stops in the try block and jumps to the matching except block",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python retries the failed line 3 times automatically",
                                    "explanationIfWrong": "Python does not retry lines automatically."
                        },
                        {
                                    "id": "C",
                                    "text": "The entire program crashes and terminates",
                                    "explanationIfWrong": "The except block catches the error, preventing a crash."
                        },
                        {
                                    "id": "D",
                                    "text": "The variable is assigned None and try continues to the next line",
                                    "explanationIfWrong": "Execution abandons the rest of the try block immediately."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When an exception is raised in try, control transfers immediately to the corresponding except handler."
},
          {
            "id": "q-6.3-0-v2",
            "question": "What happens if NO exception occurs inside the try block?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The try block finishes completely and the except block is skipped entirely",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The except block executes anyway as a confirmation",
                                    "explanationIfWrong": "except only runs when an error is caught."
                        },
                        {
                                    "id": "C",
                                    "text": "A Warning is printed to the console",
                                    "explanationIfWrong": "Successful execution produces no warnings."
                        },
                        {
                                    "id": "D",
                                    "text": "The program halts",
                                    "explanationIfWrong": "Execution continues to statements after the try-except."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "If no error occurs, the except block is bypassed and execution continues past it."
},
          {
            "id": "q-6.3-0-v3",
            "question": "Why is a bare except: (catching all exceptions without specifying a type) considered bad practice?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It can mask unexpected bugs, typos, and even prevent the user from stopping the program with Ctrl+C (KeyboardInterrupt)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It causes a SyntaxError in Python 3",
                                    "explanationIfWrong": "It is valid syntax, but poor software engineering."
                        },
                        {
                                    "id": "C",
                                    "text": "It slows down execution by 100x",
                                    "explanationIfWrong": "The issue is debugging and safety, not speed."
                        },
                        {
                                    "id": "D",
                                    "text": "It only works on numbers",
                                    "explanationIfWrong": "It catches everything, which is dangerous."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Catching all exceptions hides programmer typos (NameError) and system interrupts (KeyboardInterrupt)."
}
        ]
      },
      {
        "heading": "Catching Specific Exceptions",
        "text": "Best practice is to catch only the specific exceptions your code expects and can reasonably handle, such as ValueError for invalid conversions, or FileNotFoundError for missing files.",
        "codeSnippet": "filename = \"non_existent.txt\"\ntry:\n    with open(filename, \"r\") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print(f\"Sorry, the file '{filename}' could not be located.\")",
        "terminalOutput": "Sorry, the file 'non_existent.txt' could not be located.",
        "tip": "Catching specific exceptions ensures that real programming bugs (like misspelled variable names) are not accidentally silenced.",
        "mcq": {
          "id": "q-6.3-1-v1",
          "question": "Which specific exception should you catch when asking a user to convert an input string into an integer with int()?",
          "options": [
                    {
                              "id": "A",
                              "text": "ValueError",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "TypeError",
                              "explanationIfWrong": "Passing a non-numeric string to int() raises ValueError."
                    },
                    {
                              "id": "C",
                              "text": "IndexError",
                              "explanationIfWrong": "IndexError is for sequence indices."
                    },
                    {
                              "id": "D",
                              "text": "KeyError",
                              "explanationIfWrong": "KeyError is for dictionaries."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "int('abc') raises ValueError: invalid literal for int()."
},
        "retestMcq": {
          "id": "q-6.3-1-v2",
          "question": "What specific exception is raised when dividing a number by zero?",
          "options": [
                    {
                              "id": "A",
                              "text": "ZeroDivisionError",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "ArithmeticOverflowError",
                              "explanationIfWrong": "Python raises ZeroDivisionError specifically."
                    },
                    {
                              "id": "C",
                              "text": "MathError",
                              "explanationIfWrong": "The standard built-in exception is ZeroDivisionError."
                    },
                    {
                              "id": "D",
                              "text": "ValueError",
                              "explanationIfWrong": "Division by zero is ZeroDivisionError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "10 / 0 raises ZeroDivisionError: division by zero."
},
        "questionPool": [
          {
            "id": "q-6.3-1-v1",
            "question": "Which specific exception should you catch when asking a user to convert an input string into an integer with int()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ValueError",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Passing a non-numeric string to int() raises ValueError."
                        },
                        {
                                    "id": "C",
                                    "text": "IndexError",
                                    "explanationIfWrong": "IndexError is for sequence indices."
                        },
                        {
                                    "id": "D",
                                    "text": "KeyError",
                                    "explanationIfWrong": "KeyError is for dictionaries."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "int('abc') raises ValueError: invalid literal for int()."
},
          {
            "id": "q-6.3-1-v2",
            "question": "What specific exception is raised when dividing a number by zero?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "ZeroDivisionError",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ArithmeticOverflowError",
                                    "explanationIfWrong": "Python raises ZeroDivisionError specifically."
                        },
                        {
                                    "id": "C",
                                    "text": "MathError",
                                    "explanationIfWrong": "The standard built-in exception is ZeroDivisionError."
                        },
                        {
                                    "id": "D",
                                    "text": "ValueError",
                                    "explanationIfWrong": "Division by zero is ZeroDivisionError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "10 / 0 raises ZeroDivisionError: division by zero."
},
          {
            "id": "q-6.3-1-v3",
            "question": "Can you catch multiple specific exceptions in a single except line?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, by passing them as a tuple: except (ValueError, TypeError):",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, each exception must always be on a separate except line",
                                    "explanationIfWrong": "Grouping in parentheses is standard syntax."
                        },
                        {
                                    "id": "C",
                                    "text": "Yes, using the and keyword: except ValueError and TypeError:",
                                    "explanationIfWrong": "Python syntax requires a tuple in parentheses."
                        },
                        {
                                    "id": "D",
                                    "text": "Only if they inherit from the same module",
                                    "explanationIfWrong": "Any exception classes can be grouped."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "except (ValueError, TypeError): handles either exception type with the same code."
}
        ]
      },
      {
        "heading": "Multiple Except Blocks",
        "text": "A try statement can have multiple except clauses to handle different exceptions with specialized responses. Python evaluates except blocks from top to bottom and executes the first matching block.",
        "codeSnippet": "def read_number_from_file(filename):\n    try:\n        with open(filename, \"r\") as f:\n            return int(f.read().strip())\n    except FileNotFoundError:\n        print(\"Error: File does not exist.\")\n    except ValueError:\n        print(\"Error: File does not contain a valid integer.\")",
        "terminalOutput": "Error: File does not exist.",
        "mcq": {
          "id": "q-6.3-2-v1",
          "question": "How does Python choose which except block to execute when an exception occurs?",
          "options": [
                    {
                              "id": "A",
                              "text": "It checks each except block from top to bottom and runs the first one that matches the raised exception type",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It runs all matching except blocks simultaneously",
                              "explanationIfWrong": "Only one matching except block executes."
                    },
                    {
                              "id": "C",
                              "text": "It picks the one with the shortest code",
                              "explanationIfWrong": "It evaluates sequentially top to bottom."
                    },
                    {
                              "id": "D",
                              "text": "It runs the last except block always",
                              "explanationIfWrong": "The first matching handler wins."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Matching proceeds sequentially top to bottom; the first matching exception class handles the error."
},
        "retestMcq": {
          "id": "q-6.3-2-v2",
          "question": "Why should more specific exceptions (like FileNotFoundError) be placed above general ones (like Exception) in multiple except blocks?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because Exception matches almost all exceptions; placing it first would catch everything and make the specific block unreachable",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because Python raises a SyntaxError if Exception is not last",
                              "explanationIfWrong": "It is syntactically allowed, but makes subsequent blocks unreachable."
                    },
                    {
                              "id": "C",
                              "text": "Specific exceptions take more RAM",
                              "explanationIfWrong": "Order determines matching priority."
                    },
                    {
                              "id": "D",
                              "text": "There is no difference in ordering",
                              "explanationIfWrong": "Order is critical because Python picks the first match."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Subclasses must precede parent classes; otherwise the broader class intercepts the exception first."
},
        "questionPool": [
          {
            "id": "q-6.3-2-v1",
            "question": "How does Python choose which except block to execute when an exception occurs?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It checks each except block from top to bottom and runs the first one that matches the raised exception type",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It runs all matching except blocks simultaneously",
                                    "explanationIfWrong": "Only one matching except block executes."
                        },
                        {
                                    "id": "C",
                                    "text": "It picks the one with the shortest code",
                                    "explanationIfWrong": "It evaluates sequentially top to bottom."
                        },
                        {
                                    "id": "D",
                                    "text": "It runs the last except block always",
                                    "explanationIfWrong": "The first matching handler wins."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Matching proceeds sequentially top to bottom; the first matching exception class handles the error."
},
          {
            "id": "q-6.3-2-v2",
            "question": "Why should more specific exceptions (like FileNotFoundError) be placed above general ones (like Exception) in multiple except blocks?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because Exception matches almost all exceptions; placing it first would catch everything and make the specific block unreachable",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because Python raises a SyntaxError if Exception is not last",
                                    "explanationIfWrong": "It is syntactically allowed, but makes subsequent blocks unreachable."
                        },
                        {
                                    "id": "C",
                                    "text": "Specific exceptions take more RAM",
                                    "explanationIfWrong": "Order determines matching priority."
                        },
                        {
                                    "id": "D",
                                    "text": "There is no difference in ordering",
                                    "explanationIfWrong": "Order is critical because Python picks the first match."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Subclasses must precede parent classes; otherwise the broader class intercepts the exception first."
},
          {
            "id": "q-6.3-2-v3",
            "question": "What happens if an exception occurs that does NOT match any of the provided except blocks?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The exception propagates uncaught up the call stack, potentially crashing the program if not handled by a caller",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python ignores the exception and continues silently",
                                    "explanationIfWrong": "Unmatched exceptions propagate and crash if unhandled."
                        },
                        {
                                    "id": "C",
                                    "text": "The first except block runs as a fallback",
                                    "explanationIfWrong": "Only matching handlers execute."
                        },
                        {
                                    "id": "D",
                                    "text": "The script restarts",
                                    "explanationIfWrong": "The runtime prints a traceback."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "An unhandled exception bubbles up the stack until caught or until the program terminates with a traceback."
}
        ]
      },
      {
        "heading": "Inspecting Exceptions with 'as e'",
        "text": "By adding as error_variable to the except clause, you capture the exception instance. This object contains the specific error message generated by the Python runtime.",
        "codeSnippet": "try:\n    num = int(\"not_a_number\")\nexcept ValueError as e:\n    print(f\"Caught error type: {type(e).__name__}\")\n    print(f\"Details: {e}\")",
        "terminalOutput": "Caught error type: ValueError\nDetails: invalid literal for int() with base 10: 'not_a_number'",
        "mcq": {
          "id": "q-6.3-3-v1",
          "question": "What does e contain in except ValueError as e:?",
          "options": [
                    {
                              "id": "A",
                              "text": "The exception instance containing the runtime error description message",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The line number of the code where the file was imported",
                              "explanationIfWrong": "e is the exception object; printing it displays the error string."
                    },
                    {
                              "id": "C",
                              "text": "A boolean indicating if the error was fatal",
                              "explanationIfWrong": "It is an Exception object."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "It holds the instantiated exception."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "as e assigns the raised exception instance to variable e, whose str representation is the error message."
},
        "retestMcq": {
          "id": "q-6.3-3-v2",
          "question": "How can you get the name of the exception class from e?",
          "options": [
                    {
                              "id": "A",
                              "text": "type(e).__name__",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "e.class_name()",
                              "explanationIfWrong": "Use standard type(e).__name__."
                    },
                    {
                              "id": "C",
                              "text": "name(e)",
                              "explanationIfWrong": "There is no built-in name() function."
                    },
                    {
                              "id": "D",
                              "text": "e.exception_type",
                              "explanationIfWrong": "type(e).__name__ is standard in Python."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "type(e).__name__ returns the string name of the exception's class (e.g. 'ValueError')."
},
        "questionPool": [
          {
            "id": "q-6.3-3-v1",
            "question": "What does e contain in except ValueError as e:?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The exception instance containing the runtime error description message",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The line number of the code where the file was imported",
                                    "explanationIfWrong": "e is the exception object; printing it displays the error string."
                        },
                        {
                                    "id": "C",
                                    "text": "A boolean indicating if the error was fatal",
                                    "explanationIfWrong": "It is an Exception object."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "It holds the instantiated exception."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "as e assigns the raised exception instance to variable e, whose str representation is the error message."
},
          {
            "id": "q-6.3-3-v2",
            "question": "How can you get the name of the exception class from e?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "type(e).__name__",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "e.class_name()",
                                    "explanationIfWrong": "Use standard type(e).__name__."
                        },
                        {
                                    "id": "C",
                                    "text": "name(e)",
                                    "explanationIfWrong": "There is no built-in name() function."
                        },
                        {
                                    "id": "D",
                                    "text": "e.exception_type",
                                    "explanationIfWrong": "type(e).__name__ is standard in Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "type(e).__name__ returns the string name of the exception's class (e.g. 'ValueError')."
},
          {
            "id": "q-6.3-3-v3",
            "question": "Is the variable e in except Exception as e accessible after the except block finishes?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, Python automatically deletes the variable e at the end of the except block to prevent reference cycles",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, it becomes a global variable",
                                    "explanationIfWrong": "Python 3 explicitly clears exception variables at block end."
                        },
                        {
                                    "id": "C",
                                    "text": "Yes, but its value is set to 0",
                                    "explanationIfWrong": "The name is unbound completely."
                        },
                        {
                                    "id": "D",
                                    "text": "Only if declared with global e",
                                    "explanationIfWrong": "Python deletes the name binding to break traceback reference cycles."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python 3, target variables in as clauses are deleted at the end of the except block to avoid memory cycles with stack frames."
}
        ]
      },
      {
        "heading": "The else and finally Clauses",
        "text": "A try statement can include else and finally clauses. The else block runs ONLY if the try block succeeded without any exceptions. The finally block runs unconditionally\u2014regardless of whether exceptions occurred, were caught, or even if return executed!",
        "codeSnippet": "def process_file(path):\n    try:\n        f = open(path, \"r\")\n        content = f.read()\n    except FileNotFoundError:\n        print(\"File missing!\")\n    else:\n        print(f\"File read successfully! Length: {len(content)}\")\n    finally:\n        print(\"Cleanup: This always runs!\")",
        "terminalOutput": "File missing!\nCleanup: This always runs!",
        "tip": "finally is ideal for releasing external resources, closing network sockets, or cleaning temporary files.",
        "mcq": {
          "id": "q-6.3-4-v1",
          "question": "When does the else block of a try-except-else-finally statement execute?",
          "options": [
                    {
                              "id": "A",
                              "text": "Only when the try block executes completely without raising any exceptions",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Whenever an exception is caught by except",
                              "explanationIfWrong": "If an exception occurs, else is skipped."
                    },
                    {
                              "id": "C",
                              "text": "After the finally block",
                              "explanationIfWrong": "else runs before finally."
                    },
                    {
                              "id": "D",
                              "text": "Only if the file is empty",
                              "explanationIfWrong": "else runs whenever no exceptions occurred in try."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The else block executes only if no exceptions were raised during the try block."
},
        "retestMcq": {
          "id": "q-6.3-4-v2",
          "question": "Under what conditions does the finally block execute?",
          "options": [
                    {
                              "id": "A",
                              "text": "Always, whether an exception occurred or not, and even if a return statement executed",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Only if an uncaught exception occurred",
                              "explanationIfWrong": "finally executes in all outcomes."
                    },
                    {
                              "id": "C",
                              "text": "Only if no exception occurred",
                              "explanationIfWrong": "That is the else block, not finally."
                    },
                    {
                              "id": "D",
                              "text": "Only when manually called",
                              "explanationIfWrong": "finally is executed automatically by the runtime."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The finally clause is guaranteed to run before exiting the try construct, ensuring cleanup."
},
        "questionPool": [
          {
            "id": "q-6.3-4-v1",
            "question": "When does the else block of a try-except-else-finally statement execute?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Only when the try block executes completely without raising any exceptions",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Whenever an exception is caught by except",
                                    "explanationIfWrong": "If an exception occurs, else is skipped."
                        },
                        {
                                    "id": "C",
                                    "text": "After the finally block",
                                    "explanationIfWrong": "else runs before finally."
                        },
                        {
                                    "id": "D",
                                    "text": "Only if the file is empty",
                                    "explanationIfWrong": "else runs whenever no exceptions occurred in try."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The else block executes only if no exceptions were raised during the try block."
},
          {
            "id": "q-6.3-4-v2",
            "question": "Under what conditions does the finally block execute?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Always, whether an exception occurred or not, and even if a return statement executed",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Only if an uncaught exception occurred",
                                    "explanationIfWrong": "finally executes in all outcomes."
                        },
                        {
                                    "id": "C",
                                    "text": "Only if no exception occurred",
                                    "explanationIfWrong": "That is the else block, not finally."
                        },
                        {
                                    "id": "D",
                                    "text": "Only when manually called",
                                    "explanationIfWrong": "finally is executed automatically by the runtime."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The finally clause is guaranteed to run before exiting the try construct, ensuring cleanup."
},
          {
            "id": "q-6.3-4-v3",
            "question": "What is printed by this function?\n\ndef demo():\n    try:\n        return 1\n    finally:\n        print('Done')\n\nval = demo()",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Prints 'Done' and returns 1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Returns 1 without printing 'Done'",
                                    "explanationIfWrong": "finally is guaranteed to execute before the function actually exits."
                        },
                        {
                                    "id": "C",
                                    "text": "Prints 'Done' and returns None",
                                    "explanationIfWrong": "The return 1 value is preserved."
                        },
                        {
                                    "id": "D",
                                    "text": "Raises a SyntaxError",
                                    "explanationIfWrong": "return inside try with finally is valid Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Even with return in the try block, the finally block executes before control transfers back to the caller."
}
        ]
      },
      {
        "heading": "Raising Exceptions with raise",
        "text": "You can deliberately trigger an exception in your code using the raise statement, followed by an exception class and an error message. This is standard for input validation and enforcing contract invariants.",
        "codeSnippet": "def set_age(age: int):\n    if age < 0:\n        raise ValueError(f\"Age cannot be negative: {age}\")\n    if age > 150:\n        raise ValueError(f\"Age is unrealistically large: {age}\")\n    print(f\"Age set to {age}\")\n\ntry:\n    set_age(-5)\nexcept ValueError as err:\n    print(f\"Validation failed: {err}\")",
        "terminalOutput": "Validation failed: Age cannot be negative: -5",
        "mcq": {
          "id": "q-6.3-5-v1",
          "question": "Which Python keyword is used to explicitly trigger an exception?",
          "options": [
                    {
                              "id": "A",
                              "text": "raise",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "throw",
                              "explanationIfWrong": "'throw' is used in Java/JavaScript; Python uses 'raise'."
                    },
                    {
                              "id": "C",
                              "text": "error",
                              "explanationIfWrong": "There is no 'error' keyword in Python."
                    },
                    {
                              "id": "D",
                              "text": "crash",
                              "explanationIfWrong": "Python uses 'raise'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The raise keyword is used to raise an exception manually in Python."
},
        "retestMcq": {
          "id": "q-6.3-5-v2",
          "question": "What is the primary reason to raise a ValueError in a function that receives invalid input arguments?",
          "options": [
                    {
                              "id": "A",
                              "text": "To alert caller code immediately that an inappropriate value was supplied, preventing corrupt data from propagating",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "To restart the computer",
                              "explanationIfWrong": "Raising exceptions signals errors to calling software."
                    },
                    {
                              "id": "C",
                              "text": "To format the input string",
                              "explanationIfWrong": "Exceptions signal abnormal operational conditions."
                    },
                    {
                              "id": "D",
                              "text": "To convert the variable to a float",
                              "explanationIfWrong": "Raising an exception halts normal flow."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Raising exceptions halts execution early when preconditions fail, protecting program integrity."
},
        "questionPool": [
          {
            "id": "q-6.3-5-v1",
            "question": "Which Python keyword is used to explicitly trigger an exception?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "raise",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "throw",
                                    "explanationIfWrong": "'throw' is used in Java/JavaScript; Python uses 'raise'."
                        },
                        {
                                    "id": "C",
                                    "text": "error",
                                    "explanationIfWrong": "There is no 'error' keyword in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "crash",
                                    "explanationIfWrong": "Python uses 'raise'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The raise keyword is used to raise an exception manually in Python."
},
          {
            "id": "q-6.3-5-v2",
            "question": "What is the primary reason to raise a ValueError in a function that receives invalid input arguments?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To alert caller code immediately that an inappropriate value was supplied, preventing corrupt data from propagating",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "To restart the computer",
                                    "explanationIfWrong": "Raising exceptions signals errors to calling software."
                        },
                        {
                                    "id": "C",
                                    "text": "To format the input string",
                                    "explanationIfWrong": "Exceptions signal abnormal operational conditions."
                        },
                        {
                                    "id": "D",
                                    "text": "To convert the variable to a float",
                                    "explanationIfWrong": "Raising an exception halts normal flow."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Raising exceptions halts execution early when preconditions fail, protecting program integrity."
},
          {
            "id": "q-6.3-5-v3",
            "question": "What does a bare raise (with no exception argument) do inside an except block?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Re-raises the current exception that was caught, allowing outer handlers to also see it",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Raises a generic RuntimeError",
                                    "explanationIfWrong": "Bare raise preserves and re-raises the active exception."
                        },
                        {
                                    "id": "C",
                                    "text": "Clears the active exception and continues",
                                    "explanationIfWrong": "It re-raises the exception."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError",
                                    "explanationIfWrong": "Bare raise is standard idiom for re-raising active exceptions."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A bare raise inside an except handler re-raises the active exception up the call chain."
}
        ]
      }
    ]
  }
];


// Function to get active questions for a level
// Supports dynamic variant rotation (v1, v2, v3) without duplicate repeat
export const getActiveQuestionsForLevelPart6 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part6_question_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part6_active_questions_${section.id}_${studentId}`;

  let seenIds: string[] = [];
  try {
    const raw = localStorage.getItem(historyKey);
    if (raw) seenIds = JSON.parse(raw);
  } catch {}

  // If not forcing new questions and an active set is stored, use it
  if (!forceNewQuestions) {
    try {
      const activeRaw = localStorage.getItem(activeSetKey);
      if (activeRaw) {
        const saved = JSON.parse(activeRaw);
        if (Array.isArray(saved) && saved.length === section.theoryBlocks.length) {
          return saved;
        }
      }
    } catch {}
  }

  const selectedQuestions: McqQuestion[] = [];
  const newlySeenIds: string[] = [];

  section.theoryBlocks.forEach((block, bIdx) => {
    const pool: McqQuestion[] = block.questionPool && block.questionPool.length > 0
      ? block.questionPool
      : [
          { ...block.mcq!, id: `q-${section.id}-${bIdx}-v1` },
          { ...(block.retestMcq || block.mcq!), id: `q-${section.id}-${bIdx}-v2` }
        ];

    const unseen = pool.filter(q => q.id && !seenIds.includes(q.id));

    let chosenQuestion: McqQuestion;
    if (unseen.length > 0) {
      chosenQuestion = unseen[0];
    } else {
      chosenQuestion = pool[pool.length - 1];
    }

    selectedQuestions.push(chosenQuestion);
    if (chosenQuestion.id && !seenIds.includes(chosenQuestion.id)) {
      newlySeenIds.push(chosenQuestion.id);
    }
  });

  const updatedHistory = [...seenIds, ...newlySeenIds];
  try {
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    localStorage.setItem(activeSetKey, JSON.stringify(selectedQuestions));
  } catch {}

  return selectedQuestions;
};

// Consecutive failure tracking helpers for Part 6
export const getConsecutiveFailuresPart6 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part6_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart6 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part6_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart6 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part6_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart6 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part6_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart6 = (
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
  const currentAttempt = getLevelAttemptCountPart6(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part6_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part6_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part6_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part6_locked_${studentId}`);
    } catch {}

    return {
      isPassed: true,
      attemptCount: currentAttempt,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    if (currentAttempt === 1) {
      setLevelAttemptCountPart6(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart6(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart6(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part6_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part6_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part6_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart6 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part6_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part6_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part6_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part6_locked_progression_${studentId}`);
  } catch {}
};
