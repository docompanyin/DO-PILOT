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
    "id": "3-1-loops-with-conditions",
    "number": "3.1",
    "title": "Loops with Conditions",
    "subtitle": "Control iteration using boolean loop conditions, sentinel values, accumulators, break, and continue.",
    "readTime": "20 min",
    "objectives": [
      "Use while loops with explicit condition expressions",
      "Handle user input termination using sentinel values",
      "Compute running sums, counts, and averages with accumulators",
      "Interrupt loops immediately with the break statement",
      "Skip loop iterations cleanly with continue",
      "Identify and avoid infinite loops and off-by-one errors"
],
    "theoryBlocks": [
      {
        "heading": "Condition in While Loops",
        "text": "Instead of creating an endless while True loop and using break, a while loop can directly evaluate a conditional expression. The loop executes as long as the condition evaluates to True. When the condition evaluates to False before an iteration, the loop terminates automatically.",
        "codeSnippet": "number = 1\nwhile number <= 5:\n    print(number)\n    number += 1\nprint(\"Ready!\")",
        "terminalOutput": "1\n2\n3\n4\n5\nReady!",
        "tip": "Always ensure the condition variable changes inside the loop body, otherwise the loop will execute forever.",
        "mcq": {
          "id": "q-3.1-0-v1",
          "question": "What is printed by the following loop?\n\nx = 3\nwhile x > 0:\n    print(x, end=' ')\n    x -= 1",
          "options": [
                    {
                              "id": "A",
                              "text": "3 2 1",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "3 2 1 0",
                              "explanationIfWrong": "When x reaches 0, the condition 0 > 0 evaluates to False, so 0 is never printed."
                    },
                    {
                              "id": "C",
                              "text": "2 1 0",
                              "explanationIfWrong": "The loop begins with x = 3, so 3 is printed first before decrementing."
                    },
                    {
                              "id": "D",
                              "text": "Infinite loop",
                              "explanationIfWrong": "x decreases by 1 in every iteration, so it will reach 0 and terminate."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "x starts at 3 and decrements by 1 each step. The loop prints 3, 2, and 1. When x becomes 0, the condition x > 0 is False and the loop ends."
},
        "retestMcq": {
          "id": "q-3.1-0-v2",
          "question": "How many times will this loop execute?\n\ni = 0\nwhile i < 4:\n    i += 2",
          "options": [
                    {
                              "id": "A",
                              "text": "2 times",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "4 times",
                              "explanationIfWrong": "i increments by 2 each iteration, not by 1."
                    },
                    {
                              "id": "C",
                              "text": "1 time",
                              "explanationIfWrong": "i reaches 2 on the first run, then 4 on the second run, terminating the loop."
                    },
                    {
                              "id": "D",
                              "text": "3 times",
                              "explanationIfWrong": "i jumps 0 -> 2 -> 4; when i=4, 4 < 4 is False."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Iteration 1: i=0 (< 4) -> i becomes 2. Iteration 2: i=2 (< 4) -> i becomes 4. When i=4, 4 < 4 is False. It runs exactly 2 times."
},
        "questionPool": [
          {
            "id": "q-3.1-0-v1",
            "question": "What is printed by the following loop?\n\nx = 3\nwhile x > 0:\n    print(x, end=' ')\n    x -= 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "3 2 1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3 2 1 0",
                                    "explanationIfWrong": "When x reaches 0, the condition 0 > 0 evaluates to False, so 0 is never printed."
                        },
                        {
                                    "id": "C",
                                    "text": "2 1 0",
                                    "explanationIfWrong": "The loop begins with x = 3, so 3 is printed first before decrementing."
                        },
                        {
                                    "id": "D",
                                    "text": "Infinite loop",
                                    "explanationIfWrong": "x decreases by 1 in every iteration, so it will reach 0 and terminate."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "x starts at 3 and decrements by 1 each step. The loop prints 3, 2, and 1. When x becomes 0, the condition x > 0 is False and the loop ends."
},
          {
            "id": "q-3.1-0-v2",
            "question": "How many times will this loop execute?\n\ni = 0\nwhile i < 4:\n    i += 2",
            "options": [
                        {
                                    "id": "A",
                                    "text": "2 times",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "4 times",
                                    "explanationIfWrong": "i increments by 2 each iteration, not by 1."
                        },
                        {
                                    "id": "C",
                                    "text": "1 time",
                                    "explanationIfWrong": "i reaches 2 on the first run, then 4 on the second run, terminating the loop."
                        },
                        {
                                    "id": "D",
                                    "text": "3 times",
                                    "explanationIfWrong": "i jumps 0 -> 2 -> 4; when i=4, 4 < 4 is False."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iteration 1: i=0 (< 4) -> i becomes 2. Iteration 2: i=2 (< 4) -> i becomes 4. When i=4, 4 < 4 is False. It runs exactly 2 times."
},
          {
            "id": "q-3.1-0-v3",
            "question": "What happens if the condition in a while loop is False at the very beginning?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The loop body never executes, and execution continues after the loop",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The loop executes at least once before checking the condition",
                                    "explanationIfWrong": "Python while loops check the condition before every iteration, including the very first one."
                        },
                        {
                                    "id": "C",
                                    "text": "Python raises a RuntimeError",
                                    "explanationIfWrong": "A False loop condition is completely valid normal control flow."
                        },
                        {
                                    "id": "D",
                                    "text": "The loop runs indefinitely",
                                    "explanationIfWrong": "A False condition immediately skips the loop body."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python while loops are pre-test loops. If the condition is False from the start, the loop body is bypassed entirely."
}
        ]
      },
      {
        "heading": "Loop Termination with Sentinel Values",
        "text": "A sentinel value is a special input value (like -1, 0, or 'end') that signals the loop should stop asking for more input. The loop condition checks whether the current input differs from the sentinel value.",
        "codeSnippet": "word = input(\"Enter a word (stop to quit): \")\nwhile word != \"stop\":\n    print(f\"You typed: {word}\")\n    word = input(\"Enter a word (stop to quit): \")\nprint(\"Done!\")",
        "terminalOutput": "Enter a word (stop to quit): python\nYou typed: python\nEnter a word (stop to quit): stop\nDone!",
        "warning": "Remember to prompt for new input inside the loop, otherwise word never changes and the loop repeats endlessly.",
        "mcq": {
          "id": "q-3.1-1-v1",
          "question": "In the code below, what is the sentinel value?\n\nval = int(input())\nwhile val != -1:\n    total += val\n    val = int(input())",
          "options": [
                    {
                              "id": "A",
                              "text": "-1",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "0",
                              "explanationIfWrong": "The loop checks val != -1, not 0."
                    },
                    {
                              "id": "C",
                              "text": "total",
                              "explanationIfWrong": "total is an accumulator variable, not the terminating sentinel value."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "-1 is explicitly tested to stop the loop."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The loop runs as long as val != -1. The input -1 is the sentinel value signaling loop termination."
},
        "retestMcq": {
          "id": "q-3.1-1-v2",
          "question": "What is the primary risk if you forget to read the next value inside a sentinel while loop?",
          "options": [
                    {
                              "id": "A",
                              "text": "An infinite loop occurs because the sentinel variable never changes",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A SyntaxError is thrown by Python",
                              "explanationIfWrong": "Syntactically the code is valid, but it causes a logical infinite loop."
                    },
                    {
                              "id": "C",
                              "text": "The variable is automatically reset to None",
                              "explanationIfWrong": "Variables retain their value until reassigned."
                    },
                    {
                              "id": "D",
                              "text": "The loop automatically breaks on the second iteration",
                              "explanationIfWrong": "Python does not know when to break unless condition evaluates to False or break is called."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "If the variable is not updated within the loop body, its initial value never changes, causing the condition to remain True forever."
},
        "questionPool": [
          {
            "id": "q-3.1-1-v1",
            "question": "In the code below, what is the sentinel value?\n\nval = int(input())\nwhile val != -1:\n    total += val\n    val = int(input())",
            "options": [
                        {
                                    "id": "A",
                                    "text": "-1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "0",
                                    "explanationIfWrong": "The loop checks val != -1, not 0."
                        },
                        {
                                    "id": "C",
                                    "text": "total",
                                    "explanationIfWrong": "total is an accumulator variable, not the terminating sentinel value."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "-1 is explicitly tested to stop the loop."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The loop runs as long as val != -1. The input -1 is the sentinel value signaling loop termination."
},
          {
            "id": "q-3.1-1-v2",
            "question": "What is the primary risk if you forget to read the next value inside a sentinel while loop?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "An infinite loop occurs because the sentinel variable never changes",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A SyntaxError is thrown by Python",
                                    "explanationIfWrong": "Syntactically the code is valid, but it causes a logical infinite loop."
                        },
                        {
                                    "id": "C",
                                    "text": "The variable is automatically reset to None",
                                    "explanationIfWrong": "Variables retain their value until reassigned."
                        },
                        {
                                    "id": "D",
                                    "text": "The loop automatically breaks on the second iteration",
                                    "explanationIfWrong": "Python does not know when to break unless condition evaluates to False or break is called."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "If the variable is not updated within the loop body, its initial value never changes, causing the condition to remain True forever."
},
          {
            "id": "q-3.1-1-v3",
            "question": "Which loop condition correctly stops when the user types 'quit' or 'exit'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "while command != 'quit' and command != 'exit':",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "while command != 'quit' or command != 'exit':",
                                    "explanationIfWrong": "Using 'or' with != results in an infinite loop because a single string cannot equal both 'quit' and 'exit' simultaneously."
                        },
                        {
                                    "id": "C",
                                    "text": "while command == 'quit' and command == 'exit':",
                                    "explanationIfWrong": "This condition would be False immediately since command cannot equal both at once."
                        },
                        {
                                    "id": "D",
                                    "text": "while not command:",
                                    "explanationIfWrong": "This only checks if command is empty, ignoring 'quit' and 'exit'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "By De Morgan's laws, to keep running when the command is neither 'quit' nor 'exit', we must require: command != 'quit' and command != 'exit'."
}
        ]
      },
      {
        "heading": "Counting and Accumulators",
        "text": "An accumulator is a variable initialized before a loop that gathers or combines results across iterations, such as a running total, product, or count. Each iteration updates the accumulator using augmented assignment operators like += or *=.",
        "codeSnippet": "sum_numbers = 0\ncount = 0\n\nwhile count < 4:\n    count += 1\n    sum_numbers += count\n\nprint(f\"Count: {count}, Sum: {sum_numbers}\")",
        "terminalOutput": "Count: 4, Sum: 10",
        "tip": "Initialize accumulators before the loop starts. If initialized inside, they are re-created on each iteration.",
        "mcq": {
          "id": "q-3.1-2-v1",
          "question": "What is the final value of product after this loop?\n\nproduct = 1\nx = 1\nwhile x <= 3:\n    product *= x\n    x += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "6",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "3",
                              "explanationIfWrong": "The loop multiplies 1 * 1 * 2 * 3 = 6."
                    },
                    {
                              "id": "C",
                              "text": "1",
                              "explanationIfWrong": "product updates each iteration: 1 -> 1 -> 2 -> 6."
                    },
                    {
                              "id": "D",
                              "text": "24",
                              "explanationIfWrong": "The loop stops when x becomes 4, so it multiplies up to 3 only."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "x=1: product = 1*1=1. x=2: product = 1*2=2. x=3: product = 2*3=6. Then x=4 stops the loop."
},
        "retestMcq": {
          "id": "q-3.1-2-v2",
          "question": "What is the bug in this attempt to calculate the sum of numbers from 1 to 5?\n\nwhile i <= 5:\n    total = 0\n    total += i\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "total is reset to 0 in every iteration instead of accumulating",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "i += 1 causes a SyntaxError",
                              "explanationIfWrong": "i += 1 is valid Python syntax."
                    },
                    {
                              "id": "C",
                              "text": "total += i is not permitted in while loops",
                              "explanationIfWrong": "+= works anywhere in Python."
                    },
                    {
                              "id": "D",
                              "text": "The loop runs 0 times",
                              "explanationIfWrong": "If i is initialized, it runs, but total is overwritten each pass."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "total = 0 placed inside the loop body resets the accumulator every iteration, discarding all previous sums."
},
        "questionPool": [
          {
            "id": "q-3.1-2-v1",
            "question": "What is the final value of product after this loop?\n\nproduct = 1\nx = 1\nwhile x <= 3:\n    product *= x\n    x += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "6",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3",
                                    "explanationIfWrong": "The loop multiplies 1 * 1 * 2 * 3 = 6."
                        },
                        {
                                    "id": "C",
                                    "text": "1",
                                    "explanationIfWrong": "product updates each iteration: 1 -> 1 -> 2 -> 6."
                        },
                        {
                                    "id": "D",
                                    "text": "24",
                                    "explanationIfWrong": "The loop stops when x becomes 4, so it multiplies up to 3 only."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "x=1: product = 1*1=1. x=2: product = 1*2=2. x=3: product = 2*3=6. Then x=4 stops the loop."
},
          {
            "id": "q-3.1-2-v2",
            "question": "What is the bug in this attempt to calculate the sum of numbers from 1 to 5?\n\nwhile i <= 5:\n    total = 0\n    total += i\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "total is reset to 0 in every iteration instead of accumulating",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "i += 1 causes a SyntaxError",
                                    "explanationIfWrong": "i += 1 is valid Python syntax."
                        },
                        {
                                    "id": "C",
                                    "text": "total += i is not permitted in while loops",
                                    "explanationIfWrong": "+= works anywhere in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "The loop runs 0 times",
                                    "explanationIfWrong": "If i is initialized, it runs, but total is overwritten each pass."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "total = 0 placed inside the loop body resets the accumulator every iteration, discarding all previous sums."
},
          {
            "id": "q-3.1-2-v3",
            "question": "How should an accumulator counting matching items be initialized?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "count = 0 before the loop",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "count = 1 before the loop",
                                    "explanationIfWrong": "Starting at 1 gives an off-by-one count if 0 matches occur."
                        },
                        {
                                    "id": "C",
                                    "text": "count = 0 inside the loop",
                                    "explanationIfWrong": "Initializing inside resets the count back to 0 on every iteration."
                        },
                        {
                                    "id": "D",
                                    "text": "count = None",
                                    "explanationIfWrong": "None cannot be added to an integer with += 1."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Counting begins at 0 prior to starting the loop so each occurrence can increment it by 1."
}
        ]
      },
      {
        "heading": "The break Statement",
        "text": "The break statement terminates the execution of the innermost active loop immediately, jumping to the first statement following the loop. It is commonly used when a specific termination condition is discovered in the middle of a loop.",
        "codeSnippet": "while True:\n    val = int(input(\"Enter positive number (0 to end): \"))\n    if val == 0:\n        break\n    print(f\"Square: {val ** 2}\")\nprint(\"Loop finished!\")",
        "terminalOutput": "Enter positive number (0 to end): 5\nSquare: 25\nEnter positive number (0 to end): 0\nLoop finished!",
        "mcq": {
          "id": "q-3.1-3-v1",
          "question": "What is the output of this code?\n\ni = 1\nwhile i < 10:\n    if i == 4:\n        break\n    print(i, end=' ')\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "1 2 3",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "1 2 3 4",
                              "explanationIfWrong": "The break executes before print(i) when i == 4, so 4 is not printed."
                    },
                    {
                              "id": "C",
                              "text": "1 2 3 4 5",
                              "explanationIfWrong": "break immediately exits when i reaches 4."
                    },
                    {
                              "id": "D",
                              "text": "1 2",
                              "explanationIfWrong": "i=3 executes print(3) and increments to 4; 3 is definitely printed."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When i reaches 4, if i == 4 triggers break before the print statement, immediately stopping the loop."
},
        "retestMcq": {
          "id": "q-3.1-3-v2",
          "question": "Where does program control go when a break statement executes inside a while loop?",
          "options": [
                    {
                              "id": "A",
                              "text": "To the first line of code immediately after the while loop",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Back to the loop header condition",
                              "explanationIfWrong": "That is what continue does, not break."
                    },
                    {
                              "id": "C",
                              "text": "It terminates the entire Python script",
                              "explanationIfWrong": "sys.exit() terminates the script; break only exits the enclosing loop."
                    },
                    {
                              "id": "D",
                              "text": "To the top of the function",
                              "explanationIfWrong": "break only leaves the immediate loop structure."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "break terminates the active loop and resumes execution at the statement following the loop block."
},
        "questionPool": [
          {
            "id": "q-3.1-3-v1",
            "question": "What is the output of this code?\n\ni = 1\nwhile i < 10:\n    if i == 4:\n        break\n    print(i, end=' ')\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "1 2 3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1 2 3 4",
                                    "explanationIfWrong": "The break executes before print(i) when i == 4, so 4 is not printed."
                        },
                        {
                                    "id": "C",
                                    "text": "1 2 3 4 5",
                                    "explanationIfWrong": "break immediately exits when i reaches 4."
                        },
                        {
                                    "id": "D",
                                    "text": "1 2",
                                    "explanationIfWrong": "i=3 executes print(3) and increments to 4; 3 is definitely printed."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When i reaches 4, if i == 4 triggers break before the print statement, immediately stopping the loop."
},
          {
            "id": "q-3.1-3-v2",
            "question": "Where does program control go when a break statement executes inside a while loop?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To the first line of code immediately after the while loop",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Back to the loop header condition",
                                    "explanationIfWrong": "That is what continue does, not break."
                        },
                        {
                                    "id": "C",
                                    "text": "It terminates the entire Python script",
                                    "explanationIfWrong": "sys.exit() terminates the script; break only exits the enclosing loop."
                        },
                        {
                                    "id": "D",
                                    "text": "To the top of the function",
                                    "explanationIfWrong": "break only leaves the immediate loop structure."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "break terminates the active loop and resumes execution at the statement following the loop block."
},
          {
            "id": "q-3.1-3-v3",
            "question": "What will be printed by this code?\n\nn = 5\nwhile n > 0:\n    n -= 1\n    if n == 2:\n        break\n    print(n, end=' ')",
            "options": [
                        {
                                    "id": "A",
                                    "text": "4 3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "5 4 3",
                                    "explanationIfWrong": "n -= 1 happens before print, so when n is initially 5, it becomes 4 before printing."
                        },
                        {
                                    "id": "C",
                                    "text": "4 3 2",
                                    "explanationIfWrong": "When n == 2, the break statement executes before print(n)."
                        },
                        {
                                    "id": "D",
                                    "text": "3 2 1",
                                    "explanationIfWrong": "The loop starts at n=5 -> n=4, printing 4 first."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "1st pass: n becomes 4, prints 4. 2nd pass: n becomes 3, prints 3. 3rd pass: n becomes 2, break executes. Output: 4 3."
}
        ]
      },
      {
        "heading": "The continue Statement",
        "text": "The continue statement stops the current iteration and jumps immediately to the next evaluation of the loop condition. Unlike break, continue does NOT exit the loop; it simply skips the remainder of the current iteration's body.",
        "codeSnippet": "n = 0\nwhile n < 5:\n    n += 1\n    if n == 3:\n        continue\n    print(n, end=\" \")",
        "terminalOutput": "1 2 4 5",
        "warning": "Be careful when using continue in while loops: make sure your loop counter is updated before the continue statement, otherwise you will trigger an infinite loop!",
        "mcq": {
          "id": "q-3.1-4-v1",
          "question": "What will the following code print?\n\nx = 0\nwhile x < 4:\n    x += 1\n    if x == 2:\n        continue\n    print(x, end=' ')",
          "options": [
                    {
                              "id": "A",
                              "text": "1 3 4",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "1 2 3 4",
                              "explanationIfWrong": "When x == 2, continue skips print(x)."
                    },
                    {
                              "id": "C",
                              "text": "1",
                              "explanationIfWrong": "continue does not stop the loop; only iteration 2 is skipped."
                    },
                    {
                              "id": "D",
                              "text": "2 3 4",
                              "explanationIfWrong": "x starts at 0 and becomes 1 on pass 1, printing 1."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When x reaches 2, continue skips the print statement. 1, 3, and 4 are printed."
},
        "retestMcq": {
          "id": "q-3.1-4-v2",
          "question": "What bug is present in this snippet?\n\ni = 0\nwhile i < 5:\n    if i == 2:\n        continue\n    print(i)\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "An infinite loop occurs when i is 2 because i += 1 is skipped",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "SyntaxError on continue",
                              "explanationIfWrong": "continue is valid syntax."
                    },
                    {
                              "id": "C",
                              "text": "TypeError because i is an integer",
                              "explanationIfWrong": "Comparisons and operations on integers are fully valid."
                    },
                    {
                              "id": "D",
                              "text": "It prints 0 1 3 4",
                              "explanationIfWrong": "When i is 2, continue skips i += 1, so i remains 2 forever."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When i is 2, continue skips i += 1 at the bottom. i stays 2 on every subsequent pass, creating an infinite loop."
},
        "questionPool": [
          {
            "id": "q-3.1-4-v1",
            "question": "What will the following code print?\n\nx = 0\nwhile x < 4:\n    x += 1\n    if x == 2:\n        continue\n    print(x, end=' ')",
            "options": [
                        {
                                    "id": "A",
                                    "text": "1 3 4",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1 2 3 4",
                                    "explanationIfWrong": "When x == 2, continue skips print(x)."
                        },
                        {
                                    "id": "C",
                                    "text": "1",
                                    "explanationIfWrong": "continue does not stop the loop; only iteration 2 is skipped."
                        },
                        {
                                    "id": "D",
                                    "text": "2 3 4",
                                    "explanationIfWrong": "x starts at 0 and becomes 1 on pass 1, printing 1."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When x reaches 2, continue skips the print statement. 1, 3, and 4 are printed."
},
          {
            "id": "q-3.1-4-v2",
            "question": "What bug is present in this snippet?\n\ni = 0\nwhile i < 5:\n    if i == 2:\n        continue\n    print(i)\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "An infinite loop occurs when i is 2 because i += 1 is skipped",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "SyntaxError on continue",
                                    "explanationIfWrong": "continue is valid syntax."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError because i is an integer",
                                    "explanationIfWrong": "Comparisons and operations on integers are fully valid."
                        },
                        {
                                    "id": "D",
                                    "text": "It prints 0 1 3 4",
                                    "explanationIfWrong": "When i is 2, continue skips i += 1, so i remains 2 forever."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When i is 2, continue skips i += 1 at the bottom. i stays 2 on every subsequent pass, creating an infinite loop."
},
          {
            "id": "q-3.1-4-v3",
            "question": "What is the key difference between break and continue?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "break terminates the entire loop, while continue skips only the rest of the current iteration",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "break skips one iteration, while continue terminates the entire loop",
                                    "explanationIfWrong": "This is backwards: break exits the loop."
                        },
                        {
                                    "id": "C",
                                    "text": "break can only be used with if, while continue cannot",
                                    "explanationIfWrong": "Both are almost always used with if statements."
                        },
                        {
                                    "id": "D",
                                    "text": "There is no difference in while loops",
                                    "explanationIfWrong": "They perform completely distinct control flow operations."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "break immediately finishes the loop structure; continue skips straight to the next iteration's condition test."
}
        ]
      },
      {
        "heading": "Infinite Loops & Off-by-One Errors",
        "text": "An infinite loop runs forever without terminating because its condition never evaluates to False and no break executes. An off-by-one error occurs when a loop iterates one time too few or one time too many, often caused by using < instead of <= or wrong initial values.",
        "codeSnippet": "# Correct: prints 1, 2, 3 (exactly 3 times)\ncount = 1\nwhile count <= 3:\n    print(f\"Round {count}\")\n    count += 1",
        "terminalOutput": "Round 1\nRound 2\nRound 3",
        "mcq": {
          "id": "q-3.1-5-v1",
          "question": "Which of the following will run infinitely?\n\nOption A: x = 1; while x > 0: x += 1\nOption B: x = 5; while x > 0: x -= 1\nOption C: x = 0; while x < 5: x += 2\nOption D: x = 10; while x == 0: x -= 1",
          "options": [
                    {
                              "id": "A",
                              "text": "Option A (x = 1; while x > 0: x += 1)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Option B",
                              "explanationIfWrong": "x decreases from 5 down to 0, which terminates."
                    },
                    {
                              "id": "C",
                              "text": "Option C",
                              "explanationIfWrong": "x increments 0 -> 2 -> 4 -> 6, which stops when x >= 5."
                    },
                    {
                              "id": "D",
                              "text": "Option D",
                              "explanationIfWrong": "10 == 0 is False initially, so Option D never even runs."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Option A, x starts at 1 and increases continuously, so x > 0 remains True forever."
},
        "retestMcq": {
          "id": "q-3.1-5-v2",
          "question": "If you want a loop to print numbers from 1 to 10 inclusive, which condition should you use if i starts at 1 and increments by 1?\n\ni = 1\nwhile [CONDITION]:\n    print(i)\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "i <= 10",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "i < 10",
                              "explanationIfWrong": "i < 10 stops at 9, causing an off-by-one error."
                    },
                    {
                              "id": "C",
                              "text": "i > 10",
                              "explanationIfWrong": "1 > 10 is False immediately, so nothing prints."
                    },
                    {
                              "id": "D",
                              "text": "i == 10",
                              "explanationIfWrong": "1 == 10 is False initially, so nothing prints."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "To include 10, the loop must execute when i is 10, meaning i <= 10 (or i < 11)."
},
        "questionPool": [
          {
            "id": "q-3.1-5-v1",
            "question": "Which of the following will run infinitely?\n\nOption A: x = 1; while x > 0: x += 1\nOption B: x = 5; while x > 0: x -= 1\nOption C: x = 0; while x < 5: x += 2\nOption D: x = 10; while x == 0: x -= 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Option A (x = 1; while x > 0: x += 1)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Option B",
                                    "explanationIfWrong": "x decreases from 5 down to 0, which terminates."
                        },
                        {
                                    "id": "C",
                                    "text": "Option C",
                                    "explanationIfWrong": "x increments 0 -> 2 -> 4 -> 6, which stops when x >= 5."
                        },
                        {
                                    "id": "D",
                                    "text": "Option D",
                                    "explanationIfWrong": "10 == 0 is False initially, so Option D never even runs."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Option A, x starts at 1 and increases continuously, so x > 0 remains True forever."
},
          {
            "id": "q-3.1-5-v2",
            "question": "If you want a loop to print numbers from 1 to 10 inclusive, which condition should you use if i starts at 1 and increments by 1?\n\ni = 1\nwhile [CONDITION]:\n    print(i)\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "i <= 10",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "i < 10",
                                    "explanationIfWrong": "i < 10 stops at 9, causing an off-by-one error."
                        },
                        {
                                    "id": "C",
                                    "text": "i > 10",
                                    "explanationIfWrong": "1 > 10 is False immediately, so nothing prints."
                        },
                        {
                                    "id": "D",
                                    "text": "i == 10",
                                    "explanationIfWrong": "1 == 10 is False initially, so nothing prints."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "To include 10, the loop must execute when i is 10, meaning i <= 10 (or i < 11)."
},
          {
            "id": "q-3.1-5-v3",
            "question": "What is printed when this loop executes?\n\ni = 5\nwhile i < 5:\n    print(i)\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Nothing is printed",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "5",
                                    "explanationIfWrong": "5 < 5 is False, so the body never executes."
                        },
                        {
                                    "id": "C",
                                    "text": "0 1 2 3 4",
                                    "explanationIfWrong": "i starts at 5, not 0."
                        },
                        {
                                    "id": "D",
                                    "text": "Infinite loop",
                                    "explanationIfWrong": "The condition is False immediately, so no loop occurs."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since 5 < 5 is False on the initial evaluation, the loop body is bypassed completely."
}
        ]
      }
    ]
  },
  {
    "id": "3-2-strings",
    "number": "3.2",
    "title": "Working with Strings",
    "subtitle": "Master zero-based indexing, negative indexing, len(), string slicing, step strides, and the in search operator.",
    "readTime": "20 min",
    "objectives": [
      "Access individual characters with zero-based indexing",
      "Use negative indices to read characters from the end of a string",
      "Calculate string length with len() and avoid IndexError",
      "Extract substrings using slice syntax [start:end]",
      "Utilize step strides and slice reversal [::-1]",
      "Search for characters and substrings using the in keyword"
],
    "theoryBlocks": [
      {
        "heading": "String Indexing",
        "text": "Strings in Python are sequences of characters. Each character occupies a specific position called an index. Python uses zero-based indexing: the first character is at index 0, the second is at index 1, and so on. Individual characters are accessed using square brackets.",
        "codeSnippet": "word = \"Python\"\nprint(word[0])  # First character\nprint(word[1])  # Second character\nprint(word[4])  # Fifth character",
        "terminalOutput": "P\ny\no",
        "tip": "Strings in Python are immutable. You cannot change a character using word[0] = 'J'.",
        "mcq": {
          "id": "q-3.2-0-v1",
          "question": "Given word = 'PROGRAM', what is word[3]?",
          "options": [
                    {
                              "id": "A",
                              "text": "'G'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'O'",
                              "explanationIfWrong": "'O' is at index 2 (P=0, R=1, O=2)."
                    },
                    {
                              "id": "C",
                              "text": "'R'",
                              "explanationIfWrong": "'R' is at index 1 and index 4."
                    },
                    {
                              "id": "D",
                              "text": "'P'",
                              "explanationIfWrong": "'P' is at index 0."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "0: P, 1: R, 2: O, 3: G. Therefore word[3] evaluates to 'G'."
},
        "retestMcq": {
          "id": "q-3.2-0-v2",
          "question": "What is the index of the first character in any non-empty Python string?",
          "options": [
                    {
                              "id": "A",
                              "text": "0",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "1",
                              "explanationIfWrong": "Python uses 0-based indexing, not 1-based."
                    },
                    {
                              "id": "C",
                              "text": "-0",
                              "explanationIfWrong": "Standard index notation for the first element is 0."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "0 is the standard index."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python sequences are 0-indexed, meaning the first element is at index 0."
},
        "questionPool": [
          {
            "id": "q-3.2-0-v1",
            "question": "Given word = 'PROGRAM', what is word[3]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'G'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'O'",
                                    "explanationIfWrong": "'O' is at index 2 (P=0, R=1, O=2)."
                        },
                        {
                                    "id": "C",
                                    "text": "'R'",
                                    "explanationIfWrong": "'R' is at index 1 and index 4."
                        },
                        {
                                    "id": "D",
                                    "text": "'P'",
                                    "explanationIfWrong": "'P' is at index 0."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "0: P, 1: R, 2: O, 3: G. Therefore word[3] evaluates to 'G'."
},
          {
            "id": "q-3.2-0-v2",
            "question": "What is the index of the first character in any non-empty Python string?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "0",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1",
                                    "explanationIfWrong": "Python uses 0-based indexing, not 1-based."
                        },
                        {
                                    "id": "C",
                                    "text": "-0",
                                    "explanationIfWrong": "Standard index notation for the first element is 0."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "0 is the standard index."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python sequences are 0-indexed, meaning the first element is at index 0."
},
          {
            "id": "q-3.2-0-v3",
            "question": "What error occurs if you try to execute s = 'cat'; s[0] = 'b'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: 'str' object does not support item assignment",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "IndexError: string index out of range",
                                    "explanationIfWrong": "0 is a valid index, but strings cannot be modified in-place."
                        },
                        {
                                    "id": "C",
                                    "text": "ValueError: invalid character replacement",
                                    "explanationIfWrong": "Python raises a TypeError for immutable item assignment."
                        },
                        {
                                    "id": "D",
                                    "text": "SyntaxError: invalid syntax",
                                    "explanationIfWrong": "The syntax is valid, but the operation violates string immutability at runtime."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Strings are immutable in Python; you cannot reassign individual characters by index."
}
        ]
      },
      {
        "heading": "Negative Indexing",
        "text": "Python supports negative indexing to access characters from the right end of a string without calculating its length. The last character is at index -1, the second-to-last is at -2, and so forth.",
        "codeSnippet": "course = \"HELSINKI\"\nprint(course[-1])  # Last character\nprint(course[-2])  # Second from right\nprint(course[-8])  # First character",
        "terminalOutput": "I\nK\nH",
        "mcq": {
          "id": "q-3.2-1-v1",
          "question": "What is printed by word = 'PILOT'; print(word[-1])?",
          "options": [
                    {
                              "id": "A",
                              "text": "T",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "P",
                              "explanationIfWrong": "'P' is at index 0 (or -5). -1 is the last character."
                    },
                    {
                              "id": "C",
                              "text": "O",
                              "explanationIfWrong": "'O' is at index -2."
                    },
                    {
                              "id": "D",
                              "text": "IndexError",
                              "explanationIfWrong": "-1 is valid for any non-empty string."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Negative index -1 always accesses the very last character of a non-empty sequence, which is 'T'."
},
        "retestMcq": {
          "id": "q-3.2-1-v2",
          "question": "For s = 'PYTHON', which index accesses the letter 'O'?",
          "options": [
                    {
                              "id": "A",
                              "text": "s[-2]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "s[-1]",
                              "explanationIfWrong": "s[-1] is 'N'."
                    },
                    {
                              "id": "C",
                              "text": "s[-3]",
                              "explanationIfWrong": "s[-3] is 'H'."
                    },
                    {
                              "id": "D",
                              "text": "s[-4]",
                              "explanationIfWrong": "s[-4] is 'T'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In 'PYTHON', 'N' is -1 and 'O' is -2."
},
        "questionPool": [
          {
            "id": "q-3.2-1-v1",
            "question": "What is printed by word = 'PILOT'; print(word[-1])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "T",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "P",
                                    "explanationIfWrong": "'P' is at index 0 (or -5). -1 is the last character."
                        },
                        {
                                    "id": "C",
                                    "text": "O",
                                    "explanationIfWrong": "'O' is at index -2."
                        },
                        {
                                    "id": "D",
                                    "text": "IndexError",
                                    "explanationIfWrong": "-1 is valid for any non-empty string."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Negative index -1 always accesses the very last character of a non-empty sequence, which is 'T'."
},
          {
            "id": "q-3.2-1-v2",
            "question": "For s = 'PYTHON', which index accesses the letter 'O'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "s[-2]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "s[-1]",
                                    "explanationIfWrong": "s[-1] is 'N'."
                        },
                        {
                                    "id": "C",
                                    "text": "s[-3]",
                                    "explanationIfWrong": "s[-3] is 'H'."
                        },
                        {
                                    "id": "D",
                                    "text": "s[-4]",
                                    "explanationIfWrong": "s[-4] is 'T'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In 'PYTHON', 'N' is -1 and 'O' is -2."
},
          {
            "id": "q-3.2-1-v3",
            "question": "If a string has length 4, which negative index refers to the first character?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "-4",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "-1",
                                    "explanationIfWrong": "-1 refers to the last character."
                        },
                        {
                                    "id": "C",
                                    "text": "-0",
                                    "explanationIfWrong": "-0 is equal to 0 in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "-5",
                                    "explanationIfWrong": "-5 is out of range for a 4-character string."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "For length N, negative indices range from -1 (last) down to -N (first). For length 4, -4 is the first character."
}
        ]
      },
      {
        "heading": "String Length and IndexError",
        "text": "The built-in len() function returns the total number of characters in a string. Because indices start at 0, the highest positive index in a string is always len(string) - 1. Attempting to access an index greater than or equal to len() raises an IndexError.",
        "codeSnippet": "text = \"Code\"\nprint(len(text))     # 4\nprint(text[3])       # 'e' (valid: len - 1)\n# print(text[4])     # Raises IndexError!",
        "terminalOutput": "4\ne",
        "warning": "Common mistake: text[len(text)] will always crash with IndexError: string index out of range.",
        "mcq": {
          "id": "q-3.2-2-v1",
          "question": "What is the result of running:\n\nname = 'Ada'\nprint(name[len(name)])",
          "options": [
                    {
                              "id": "A",
                              "text": "IndexError: string index out of range",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'a'",
                              "explanationIfWrong": "The last character is at len(name) - 1, which is index 2."
                    },
                    {
                              "id": "C",
                              "text": "3",
                              "explanationIfWrong": "len(name) returns 3, but indexing at 3 fails because indices are 0, 1, 2."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "Python raises an exception rather than returning None."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "len('Ada') is 3. Valid positive indices are 0, 1, and 2. Index 3 causes an IndexError."
},
        "retestMcq": {
          "id": "q-3.2-2-v2",
          "question": "How do you safely access the last character of any non-empty string s?",
          "options": [
                    {
                              "id": "A",
                              "text": "s[-1] or s[len(s) - 1]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "s[len(s)]",
                              "explanationIfWrong": "s[len(s)] raises IndexError."
                    },
                    {
                              "id": "C",
                              "text": "s.last()",
                              "explanationIfWrong": "Strings do not have a .last() method in Python."
                    },
                    {
                              "id": "D",
                              "text": "s[0]",
                              "explanationIfWrong": "s[0] is the first character, not the last."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Both negative index -1 and positive index len(s) - 1 point to the final character."
},
        "questionPool": [
          {
            "id": "q-3.2-2-v1",
            "question": "What is the result of running:\n\nname = 'Ada'\nprint(name[len(name)])",
            "options": [
                        {
                                    "id": "A",
                                    "text": "IndexError: string index out of range",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'a'",
                                    "explanationIfWrong": "The last character is at len(name) - 1, which is index 2."
                        },
                        {
                                    "id": "C",
                                    "text": "3",
                                    "explanationIfWrong": "len(name) returns 3, but indexing at 3 fails because indices are 0, 1, 2."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "Python raises an exception rather than returning None."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "len('Ada') is 3. Valid positive indices are 0, 1, and 2. Index 3 causes an IndexError."
},
          {
            "id": "q-3.2-2-v2",
            "question": "How do you safely access the last character of any non-empty string s?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "s[-1] or s[len(s) - 1]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "s[len(s)]",
                                    "explanationIfWrong": "s[len(s)] raises IndexError."
                        },
                        {
                                    "id": "C",
                                    "text": "s.last()",
                                    "explanationIfWrong": "Strings do not have a .last() method in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "s[0]",
                                    "explanationIfWrong": "s[0] is the first character, not the last."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Both negative index -1 and positive index len(s) - 1 point to the final character."
},
          {
            "id": "q-3.2-2-v3",
            "question": "What does len('') evaluate to for an empty string?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "0",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1",
                                    "explanationIfWrong": "An empty string has 0 characters."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "len() always returns an integer."
                        },
                        {
                                    "id": "D",
                                    "text": "Error",
                                    "explanationIfWrong": "len('') is completely valid and returns 0."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "An empty string contains zero characters, so len('') is 0."
}
        ]
      },
      {
        "heading": "String Slicing",
        "text": "A slice extracts a portion of a string using the syntax string[start:end]. Crucially, the start index is inclusive, while the end index is exclusive (up to but not including end). The length of the resulting slice is always end - start.",
        "codeSnippet": "message = \"University\"\nprint(message[0:3])  # indices 0, 1, 2\nprint(message[4:8])  # indices 4, 5, 6, 7",
        "terminalOutput": "Uni\nrsi",
        "tip": "Think of slice indices as pointing between characters: 0|U|1|n|2|i|3|v|4...",
        "mcq": {
          "id": "q-3.2-3-v1",
          "question": "What is printed by:\n\ns = 'HELSINKI'\nprint(s[2:5])",
          "options": [
                    {
                              "id": "A",
                              "text": "'LSI'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'LSIN'",
                              "explanationIfWrong": "Index 5 is exclusive, so index 5 ('N') is omitted."
                    },
                    {
                              "id": "C",
                              "text": "'ELS'",
                              "explanationIfWrong": "'E' is at index 1. Index 2 is 'L'."
                    },
                    {
                              "id": "D",
                              "text": "'SIN'",
                              "explanationIfWrong": "'S' is at index 3."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Index 2 is 'L', index 3 is 'S', index 4 is 'I'. Index 5 ('N') is excluded. The result is 'LSI'."
},
        "retestMcq": {
          "id": "q-3.2-3-v2",
          "question": "If word = 'PYTHON', what is word[0:2]?",
          "options": [
                    {
                              "id": "A",
                              "text": "'PY'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'PYT'",
                              "explanationIfWrong": "Index 2 is exclusive, so only characters 0 and 1 are included."
                    },
                    {
                              "id": "C",
                              "text": "'P'",
                              "explanationIfWrong": "Length is 2 - 0 = 2 characters."
                    },
                    {
                              "id": "D",
                              "text": "'Y'",
                              "explanationIfWrong": "'Y' is at index 1 only."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "0: P, 1: Y. Index 2 is excluded, yielding 'PY'."
},
        "questionPool": [
          {
            "id": "q-3.2-3-v1",
            "question": "What is printed by:\n\ns = 'HELSINKI'\nprint(s[2:5])",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'LSI'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'LSIN'",
                                    "explanationIfWrong": "Index 5 is exclusive, so index 5 ('N') is omitted."
                        },
                        {
                                    "id": "C",
                                    "text": "'ELS'",
                                    "explanationIfWrong": "'E' is at index 1. Index 2 is 'L'."
                        },
                        {
                                    "id": "D",
                                    "text": "'SIN'",
                                    "explanationIfWrong": "'S' is at index 3."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Index 2 is 'L', index 3 is 'S', index 4 is 'I'. Index 5 ('N') is excluded. The result is 'LSI'."
},
          {
            "id": "q-3.2-3-v2",
            "question": "If word = 'PYTHON', what is word[0:2]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'PY'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'PYT'",
                                    "explanationIfWrong": "Index 2 is exclusive, so only characters 0 and 1 are included."
                        },
                        {
                                    "id": "C",
                                    "text": "'P'",
                                    "explanationIfWrong": "Length is 2 - 0 = 2 characters."
                        },
                        {
                                    "id": "D",
                                    "text": "'Y'",
                                    "explanationIfWrong": "'Y' is at index 1 only."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "0: P, 1: Y. Index 2 is excluded, yielding 'PY'."
},
          {
            "id": "q-3.2-3-v3",
            "question": "What is the length of the slice text[3:8]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "5",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "6",
                                    "explanationIfWrong": "Remember: 8 - 3 = 5 characters."
                        },
                        {
                                    "id": "C",
                                    "text": "8",
                                    "explanationIfWrong": "The slice starts at index 3, not index 0."
                        },
                        {
                                    "id": "D",
                                    "text": "4",
                                    "explanationIfWrong": "Indices included are 3, 4, 5, 6, 7 (5 elements)."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "For any slice text[a:b] where b >= a, the length is b - a. Here 8 - 3 = 5."
}
        ]
      },
      {
        "heading": "Slice Shortcuts & Step Strides",
        "text": "If start is omitted, it defaults to 0 (:end extracts from the beginning). If end is omitted, it defaults to the end of the string (start: extracts until the end). An optional third argument specifies step stride: string[start:end:step]. A step of -1 reverses the string: string[::-1].",
        "codeSnippet": "word = \"DEVELOPER\"\nprint(word[:3])     # \"DEV\" (start from 0)\nprint(word[6:])     # \"PER\" (from 6 to end)\nprint(word[::2])    # \"DVLP\" (every 2nd char)\nprint(word[::-1])   # \"REPOLEVED\" (reversed)",
        "terminalOutput": "DEV\nPER\nDVLP\nREPOLEVED",
        "mcq": {
          "id": "q-3.2-4-v1",
          "question": "What is the output of 'HELLO'[::-1] in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "'OLLEH'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'HELLO'",
                              "explanationIfWrong": "A step of -1 reverses the entire string."
                    },
                    {
                              "id": "C",
                              "text": "Error",
                              "explanationIfWrong": "[::-1] is standard Python idiom for reversing a sequence."
                    },
                    {
                              "id": "D",
                              "text": "'O'",
                              "explanationIfWrong": "It reverses the full sequence, not just the last item."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Omitting start and end with a step of -1 iterates backwards from end to start, reversing 'HELLO' to 'OLLEH'."
},
        "retestMcq": {
          "id": "q-3.2-4-v2",
          "question": "What does s[:4] extract from string s?",
          "options": [
                    {
                              "id": "A",
                              "text": "The first 4 characters (indices 0, 1, 2, 3)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The first 5 characters (indices 0, 1, 2, 3, 4)",
                              "explanationIfWrong": "4 is the exclusive stop index, so only 4 characters are included."
                    },
                    {
                              "id": "C",
                              "text": "Characters starting from index 4 to the end",
                              "explanationIfWrong": "That would be s[4:], not s[:4]."
                    },
                    {
                              "id": "D",
                              "text": "Index 4 only",
                              "explanationIfWrong": "Index 4 only is written s[4]."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "s[:4] defaults start to 0 and stops before index 4, taking indices 0, 1, 2, and 3."
},
        "questionPool": [
          {
            "id": "q-3.2-4-v1",
            "question": "What is the output of 'HELLO'[::-1] in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'OLLEH'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'HELLO'",
                                    "explanationIfWrong": "A step of -1 reverses the entire string."
                        },
                        {
                                    "id": "C",
                                    "text": "Error",
                                    "explanationIfWrong": "[::-1] is standard Python idiom for reversing a sequence."
                        },
                        {
                                    "id": "D",
                                    "text": "'O'",
                                    "explanationIfWrong": "It reverses the full sequence, not just the last item."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Omitting start and end with a step of -1 iterates backwards from end to start, reversing 'HELLO' to 'OLLEH'."
},
          {
            "id": "q-3.2-4-v2",
            "question": "What does s[:4] extract from string s?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The first 4 characters (indices 0, 1, 2, 3)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The first 5 characters (indices 0, 1, 2, 3, 4)",
                                    "explanationIfWrong": "4 is the exclusive stop index, so only 4 characters are included."
                        },
                        {
                                    "id": "C",
                                    "text": "Characters starting from index 4 to the end",
                                    "explanationIfWrong": "That would be s[4:], not s[:4]."
                        },
                        {
                                    "id": "D",
                                    "text": "Index 4 only",
                                    "explanationIfWrong": "Index 4 only is written s[4]."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "s[:4] defaults start to 0 and stops before index 4, taking indices 0, 1, 2, and 3."
},
          {
            "id": "q-3.2-4-v3",
            "question": "What is printed by word = 'abcdef'; print(word[1::2])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'bdf'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'ace'",
                                    "explanationIfWrong": "'ace' is word[0::2]. word[1::2] starts at index 1 ('b')."
                        },
                        {
                                    "id": "C",
                                    "text": "'bcdef'",
                                    "explanationIfWrong": "The step is 2, so it skips every other character."
                        },
                        {
                                    "id": "D",
                                    "text": "'fedcba'",
                                    "explanationIfWrong": "The step is positive (+2), so it moves forward."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Starts at index 1 ('b'), step of 2 picks index 3 ('d'), then index 5 ('f') -> 'bdf'."
}
        ]
      },
      {
        "heading": "Searching Substrings with 'in' and .find()",
        "text": "The in operator checks whether a substring exists within a string, returning True or False. The .find() method returns the lowest index where the substring is found, or -1 if the substring does not exist.",
        "codeSnippet": "quote = \"Keep learning Python\"\nprint(\"Python\" in quote)  # True\nprint(\"Java\" in quote)    # False\nprint(quote.find(\"learn\")) # 5\nprint(quote.find(\"Ruby\"))  # -1",
        "terminalOutput": "True\nFalse\n5\n-1",
        "tip": "Both in and .find() are case-sensitive. 'python' in 'Python' returns False.",
        "mcq": {
          "id": "q-3.2-5-v1",
          "question": "What is returned by 'cat' in 'education'?",
          "options": [
                    {
                              "id": "A",
                              "text": "True",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "False",
                              "explanationIfWrong": "'eduCATion' contains the contiguous sequence 'cat'."
                    },
                    {
                              "id": "C",
                              "text": "3",
                              "explanationIfWrong": "The in operator returns a boolean (True/False), not an index."
                    },
                    {
                              "id": "D",
                              "text": "TypeError",
                              "explanationIfWrong": "The in operator is designed for substring search."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "'cat' appears inside 'edu-cat-ion', so the condition evaluates to True."
},
        "retestMcq": {
          "id": "q-3.2-5-v2",
          "question": "What does text.find('xyz') return if 'xyz' does not appear anywhere in text?",
          "options": [
                    {
                              "id": "A",
                              "text": "-1",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "False",
                              "explanationIfWrong": ".find() returns an integer, not a boolean."
                    },
                    {
                              "id": "C",
                              "text": "IndexError",
                              "explanationIfWrong": ".find() returns -1 gracefully when not found; .index() raises ValueError."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "Python returns -1 to indicate missing substring."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python's str.find() returns -1 when the substring cannot be located."
},
        "questionPool": [
          {
            "id": "q-3.2-5-v1",
            "question": "What is returned by 'cat' in 'education'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "True",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "False",
                                    "explanationIfWrong": "'eduCATion' contains the contiguous sequence 'cat'."
                        },
                        {
                                    "id": "C",
                                    "text": "3",
                                    "explanationIfWrong": "The in operator returns a boolean (True/False), not an index."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "The in operator is designed for substring search."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'cat' appears inside 'edu-cat-ion', so the condition evaluates to True."
},
          {
            "id": "q-3.2-5-v2",
            "question": "What does text.find('xyz') return if 'xyz' does not appear anywhere in text?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "-1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "False",
                                    "explanationIfWrong": ".find() returns an integer, not a boolean."
                        },
                        {
                                    "id": "C",
                                    "text": "IndexError",
                                    "explanationIfWrong": ".find() returns -1 gracefully when not found; .index() raises ValueError."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "Python returns -1 to indicate missing substring."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python's str.find() returns -1 when the substring cannot be located."
},
          {
            "id": "q-3.2-5-v3",
            "question": "Is the substring search 'apple' in 'Apple Pie' True or False?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "False, because Python substring matching is case-sensitive",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "True, because case is ignored",
                                    "explanationIfWrong": "Python string operations are case-sensitive by default."
                        },
                        {
                                    "id": "C",
                                    "text": "Raises a ValueError",
                                    "explanationIfWrong": "Case differences simply evaluate to False."
                        },
                        {
                                    "id": "D",
                                    "text": "True if using Python 3",
                                    "explanationIfWrong": "Case sensitivity applies across all Python versions."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'Apple' has uppercase 'A', so 'apple' with lowercase 'a' is not found."
}
        ]
      }
    ]
  },
  {
    "id": "3-3-more-loops",
    "number": "3.3",
    "title": "More Loops & Nested Iteration",
    "subtitle": "Build complex programs using nested loops, 2D coordinates, patterns, and loop flags.",
    "readTime": "20 min",
    "objectives": [
      "Construct new strings dynamically through loop concatenation",
      "Traverse strings character by character using loop index counters",
      "Understand the execution flow of nested while loops",
      "Print 2D shapes, grids, and coordinate matrices",
      "Build dynamic pattern algorithms where inner loops depend on outer loops",
      "Use boolean flags to terminate multi-layered nested loops cleanly"
],
    "theoryBlocks": [
      {
        "heading": "Building Strings with Loops",
        "text": "You can construct a string character by character inside a loop using concatenation (+=). This technique is essential for building formatted output, borders, repeating symbols, or filtered text.",
        "codeSnippet": "length = 5\nline = \"\"\nwhile len(line) < length:\n    line += \"*\"\nprint(line)",
        "terminalOutput": "*****",
        "tip": "You can also use string multiplication like '*' * 5 for simple repetition, but loops allow conditional character generation.",
        "mcq": {
          "id": "q-3.3-0-v1",
          "question": "What is the value of result after this loop?\n\nresult = \"\"\ni = 0\nwhile i < 3:\n    result += str(i)\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "\"012\"",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "\"0123\"",
                              "explanationIfWrong": "i < 3 terminates when i reaches 3, so 3 is not appended."
                    },
                    {
                              "id": "C",
                              "text": "\"123\"",
                              "explanationIfWrong": "i starts at 0, so '0' is appended first."
                    },
                    {
                              "id": "D",
                              "text": "3",
                              "explanationIfWrong": "result is a string, concatenated with += str(i)."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Iteration 0 adds '0', iteration 1 adds '1', iteration 2 adds '2'. The loop terminates at i=3, resulting in '012'."
},
        "retestMcq": {
          "id": "q-3.3-0-v2",
          "question": "What will be printed by the following code?\n\nword = \"\"\nwhile len(word) < 4:\n    word += \"ab\"\nprint(word)",
          "options": [
                    {
                              "id": "A",
                              "text": "\"abab\"",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "\"ab\"",
                              "explanationIfWrong": "len('ab') is 2, which is < 4, so it runs again."
                    },
                    {
                              "id": "C",
                              "text": "\"ababab\"",
                              "explanationIfWrong": "After adding 'ab' twice, len(word) is 4, so 4 < 4 is False."
                    },
                    {
                              "id": "D",
                              "text": "\"a\"",
                              "explanationIfWrong": "It appends 'ab' as a unit."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Pass 1: word becomes 'ab' (len=2 < 4). Pass 2: word becomes 'abab' (len=4). Now 4 < 4 is False and the loop stops."
},
        "questionPool": [
          {
            "id": "q-3.3-0-v1",
            "question": "What is the value of result after this loop?\n\nresult = \"\"\ni = 0\nwhile i < 3:\n    result += str(i)\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "\"012\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "\"0123\"",
                                    "explanationIfWrong": "i < 3 terminates when i reaches 3, so 3 is not appended."
                        },
                        {
                                    "id": "C",
                                    "text": "\"123\"",
                                    "explanationIfWrong": "i starts at 0, so '0' is appended first."
                        },
                        {
                                    "id": "D",
                                    "text": "3",
                                    "explanationIfWrong": "result is a string, concatenated with += str(i)."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iteration 0 adds '0', iteration 1 adds '1', iteration 2 adds '2'. The loop terminates at i=3, resulting in '012'."
},
          {
            "id": "q-3.3-0-v2",
            "question": "What will be printed by the following code?\n\nword = \"\"\nwhile len(word) < 4:\n    word += \"ab\"\nprint(word)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "\"abab\"",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "\"ab\"",
                                    "explanationIfWrong": "len('ab') is 2, which is < 4, so it runs again."
                        },
                        {
                                    "id": "C",
                                    "text": "\"ababab\"",
                                    "explanationIfWrong": "After adding 'ab' twice, len(word) is 4, so 4 < 4 is False."
                        },
                        {
                                    "id": "D",
                                    "text": "\"a\"",
                                    "explanationIfWrong": "It appends 'ab' as a unit."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Pass 1: word becomes 'ab' (len=2 < 4). Pass 2: word becomes 'abab' (len=4). Now 4 < 4 is False and the loop stops."
},
          {
            "id": "q-3.3-0-v3",
            "question": "Which loop correctly collects only vowels from word = 'education' into a new string?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "while i < len(word): if word[i] in 'aeiou': vowels += word[i]; i += 1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "while i <= len(word): vowels += word[i]; i += 1",
                                    "explanationIfWrong": "Using <= causes IndexError on the last pass."
                        },
                        {
                                    "id": "C",
                                    "text": "while i < len(word): vowels = word[i]; i += 1",
                                    "explanationIfWrong": "Using = overwrites vowels instead of accumulating."
                        },
                        {
                                    "id": "D",
                                    "text": "while word in 'aeiou': vowels += word",
                                    "explanationIfWrong": "word is the entire string, not individual characters."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Indexing each character up to len(word) and appending to vowels if found in 'aeiou' correctly filters the string."
}
        ]
      },
      {
        "heading": "Traversing Strings with While Loops",
        "text": "By maintaining an integer index variable starting at 0, a while loop can step through every character in a string one by one until the index reaches len(string).",
        "codeSnippet": "word = \"PYTHON\"\nindex = 0\nwhile index < len(word):\n    print(f\"Char {index}: {word[index]}\")\n    index += 1",
        "terminalOutput": "Char 0: P\nChar 1: Y\nChar 2: T\nChar 3: H\nChar 4: O\nChar 5: N",
        "mcq": {
          "id": "q-3.3-1-v1",
          "question": "What is the maximum index checked by while index < len(s): when s = 'CODE'?",
          "options": [
                    {
                              "id": "A",
                              "text": "3",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "4",
                              "explanationIfWrong": "len('CODE') is 4; when index reaches 4, 4 < 4 is False."
                    },
                    {
                              "id": "C",
                              "text": "2",
                              "explanationIfWrong": "Index 3 ('E') is checked when index=3."
                    },
                    {
                              "id": "D",
                              "text": "5",
                              "explanationIfWrong": "len('CODE') is 4, so indices are 0 to 3."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "len('CODE') is 4. The indices visited are 0, 1, 2, and 3. When index is 4, 4 < 4 is False."
},
        "retestMcq": {
          "id": "q-3.3-1-v2",
          "question": "How do you traverse a string backwards from the last character to the first using a while loop?",
          "options": [
                    {
                              "id": "A",
                              "text": "i = len(s) - 1; while i >= 0: print(s[i]); i -= 1",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "i = len(s); while i > 0: print(s[i]); i -= 1",
                              "explanationIfWrong": "s[len(s)] raises an IndexError on the very first pass."
                    },
                    {
                              "id": "C",
                              "text": "i = -1; while i < len(s): print(s[i]); i += 1",
                              "explanationIfWrong": "This increments towards 0, not backwards across the string."
                    },
                    {
                              "id": "D",
                              "text": "i = 0; while i < len(s): print(s[-i]); i += 1",
                              "explanationIfWrong": "s[-0] is s[0], which does not start from the end."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Starting at len(s) - 1 and decrementing down to 0 safely accesses characters in reverse order."
},
        "questionPool": [
          {
            "id": "q-3.3-1-v1",
            "question": "What is the maximum index checked by while index < len(s): when s = 'CODE'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "4",
                                    "explanationIfWrong": "len('CODE') is 4; when index reaches 4, 4 < 4 is False."
                        },
                        {
                                    "id": "C",
                                    "text": "2",
                                    "explanationIfWrong": "Index 3 ('E') is checked when index=3."
                        },
                        {
                                    "id": "D",
                                    "text": "5",
                                    "explanationIfWrong": "len('CODE') is 4, so indices are 0 to 3."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "len('CODE') is 4. The indices visited are 0, 1, 2, and 3. When index is 4, 4 < 4 is False."
},
          {
            "id": "q-3.3-1-v2",
            "question": "How do you traverse a string backwards from the last character to the first using a while loop?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "i = len(s) - 1; while i >= 0: print(s[i]); i -= 1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "i = len(s); while i > 0: print(s[i]); i -= 1",
                                    "explanationIfWrong": "s[len(s)] raises an IndexError on the very first pass."
                        },
                        {
                                    "id": "C",
                                    "text": "i = -1; while i < len(s): print(s[i]); i += 1",
                                    "explanationIfWrong": "This increments towards 0, not backwards across the string."
                        },
                        {
                                    "id": "D",
                                    "text": "i = 0; while i < len(s): print(s[-i]); i += 1",
                                    "explanationIfWrong": "s[-0] is s[0], which does not start from the end."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Starting at len(s) - 1 and decrementing down to 0 safely accesses characters in reverse order."
},
          {
            "id": "q-3.3-1-v3",
            "question": "What will happen if you write while i <= len(s): print(s[i]); i += 1?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "IndexError: string index out of range on the last iteration",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It prints the entire string correctly",
                                    "explanationIfWrong": "Valid indices stop at len(s) - 1. When i == len(s), it crashes."
                        },
                        {
                                    "id": "C",
                                    "text": "It runs infinitely",
                                    "explanationIfWrong": "i increments, but the crash terminates execution."
                        },
                        {
                                    "id": "D",
                                    "text": "It prints an extra space",
                                    "explanationIfWrong": "Accessing s[len(s)] raises an IndexError exception."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since indices are 0 to len(s) - 1, accessing s[len(s)] throws an IndexError."
}
        ]
      },
      {
        "heading": "Nested Loops Execution Flow",
        "text": "A nested loop is a loop inside another loop. For every single iteration of the outer loop, the inner loop executes completely from beginning to end. If the outer loop runs M times and the inner loop runs N times, the inner loop body executes M * N times in total.",
        "codeSnippet": "row = 1\nwhile row <= 2:\n    col = 1\n    while col <= 3:\n        print(f\"({row},{col})\", end=\" \")\n        col += 1\n    print()  # Newline after each row\n    row += 1",
        "terminalOutput": "(1,1) (1,2) (1,3) \n(2,1) (2,2) (2,3) ",
        "tip": "Always re-initialize the inner loop's counter (e.g. col = 1) inside the outer loop body before the inner loop starts.",
        "mcq": {
          "id": "q-3.3-2-v1",
          "question": "How many times does the print() inside the inner loop execute?\n\ni = 0\nwhile i < 3:\n    j = 0\n    while j < 4:\n        print('*')\n        j += 1\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "12 times",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "7 times",
                              "explanationIfWrong": "The counts multiply (3 * 4), they do not add."
                    },
                    {
                              "id": "C",
                              "text": "4 times",
                              "explanationIfWrong": "The outer loop runs 3 times, each running the inner loop 4 times."
                    },
                    {
                              "id": "D",
                              "text": "3 times",
                              "explanationIfWrong": "The inner loop runs multiple times per outer loop pass."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Outer loop runs 3 times (i = 0, 1, 2). For each outer pass, inner loop runs 4 times (j = 0, 1, 2, 3). Total = 3 * 4 = 12."
},
        "retestMcq": {
          "id": "q-3.3-2-v2",
          "question": "What common mistake happens if j = 0 is placed before the outer loop instead of inside it?\n\nj = 0  # <--- Placed outside!\nwhile i < 3:\n    while j < 2:\n        print(j)\n        j += 1\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "The inner loop only runs on the first outer iteration, because j remains 2 afterwards",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It raises a NameError",
                              "explanationIfWrong": "j is defined, but it never gets reset."
                    },
                    {
                              "id": "C",
                              "text": "It causes an infinite loop",
                              "explanationIfWrong": "i still increments to 3 and stops."
                    },
                    {
                              "id": "D",
                              "text": "The inner loop runs backwards",
                              "explanationIfWrong": "j never decrements; it stays at 2."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without resetting j = 0 inside the outer loop, j stays at 2 after the first outer iteration, so the inner loop condition j < 2 is False for all remaining passes."
},
        "questionPool": [
          {
            "id": "q-3.3-2-v1",
            "question": "How many times does the print() inside the inner loop execute?\n\ni = 0\nwhile i < 3:\n    j = 0\n    while j < 4:\n        print('*')\n        j += 1\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "12 times",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "7 times",
                                    "explanationIfWrong": "The counts multiply (3 * 4), they do not add."
                        },
                        {
                                    "id": "C",
                                    "text": "4 times",
                                    "explanationIfWrong": "The outer loop runs 3 times, each running the inner loop 4 times."
                        },
                        {
                                    "id": "D",
                                    "text": "3 times",
                                    "explanationIfWrong": "The inner loop runs multiple times per outer loop pass."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Outer loop runs 3 times (i = 0, 1, 2). For each outer pass, inner loop runs 4 times (j = 0, 1, 2, 3). Total = 3 * 4 = 12."
},
          {
            "id": "q-3.3-2-v2",
            "question": "What common mistake happens if j = 0 is placed before the outer loop instead of inside it?\n\nj = 0  # <--- Placed outside!\nwhile i < 3:\n    while j < 2:\n        print(j)\n        j += 1\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The inner loop only runs on the first outer iteration, because j remains 2 afterwards",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It raises a NameError",
                                    "explanationIfWrong": "j is defined, but it never gets reset."
                        },
                        {
                                    "id": "C",
                                    "text": "It causes an infinite loop",
                                    "explanationIfWrong": "i still increments to 3 and stops."
                        },
                        {
                                    "id": "D",
                                    "text": "The inner loop runs backwards",
                                    "explanationIfWrong": "j never decrements; it stays at 2."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without resetting j = 0 inside the outer loop, j stays at 2 after the first outer iteration, so the inner loop condition j < 2 is False for all remaining passes."
},
          {
            "id": "q-3.3-2-v3",
            "question": "What is the output of:\n\nx = 1\nwhile x <= 2:\n    y = 1\n    while y <= 2:\n        print(x * y, end=' ')\n        y += 1\n    x += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "1 2 2 4",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1 2 3 4",
                                    "explanationIfWrong": "When x=2, y=1: 2*1=2. When x=2, y=2: 2*2=4."
                        },
                        {
                                    "id": "C",
                                    "text": "1 1 2 2",
                                    "explanationIfWrong": "y increments from 1 to 2 in each row."
                        },
                        {
                                    "id": "D",
                                    "text": "2 4",
                                    "explanationIfWrong": "x=1 also runs, producing 1*1=1 and 1*2=2."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Row 1 (x=1): 1*1=1, 1*2=2. Row 2 (x=2): 2*1=2, 2*2=4. Output: 1 2 2 4."
}
        ]
      },
      {
        "heading": "Printing Patterns and 2D Grids",
        "text": "Nested loops are widely used to print 2D shapes, grids, and tables. The outer loop controls rows, and the inner loop prints columns across the current row using end='' to keep characters on the same line, followed by an empty print() to move to the next line.",
        "codeSnippet": "rows = 3\ncols = 4\nr = 0\nwhile r < rows:\n    c = 0\n    while c < cols:\n        print(\"#\", end=\"\")\n        c += 1\n    print()  # Move to next line\n    r += 1",
        "terminalOutput": "####\n####\n####",
        "mcq": {
          "id": "q-3.3-3-v1",
          "question": "What role does the print() statement at the end of the outer loop play?",
          "options": [
                    {
                              "id": "A",
                              "text": "It prints a newline character, advancing output to the next line for the new row",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It resets the inner loop counter",
                              "explanationIfWrong": "Counters must be reset explicitly with assignment, e.g. c = 0."
                    },
                    {
                              "id": "C",
                              "text": "It breaks out of the outer loop",
                              "explanationIfWrong": "print() only outputs text; it does not change control flow."
                    },
                    {
                              "id": "D",
                              "text": "It clears the terminal screen",
                              "explanationIfWrong": "print() outputs an empty newline."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Calling print() with no arguments prints a standard newline character, moving the cursor to the beginning of the next row."
},
        "retestMcq": {
          "id": "q-3.3-3-v2",
          "question": "How many total '#' characters are printed by this code?\n\nr = 0\nwhile r < 5:\n    c = 0\n    while c < 3:\n        print('#', end='')\n        c += 1\n    print()\n    r += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "15",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "8",
                              "explanationIfWrong": "5 rows times 3 columns = 15 total characters."
                    },
                    {
                              "id": "C",
                              "text": "5",
                              "explanationIfWrong": "Each row prints 3 characters."
                    },
                    {
                              "id": "D",
                              "text": "3",
                              "explanationIfWrong": "The outer loop runs 5 times."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "5 rows * 3 columns = 15 '#' characters printed in a 5x3 grid."
},
        "questionPool": [
          {
            "id": "q-3.3-3-v1",
            "question": "What role does the print() statement at the end of the outer loop play?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It prints a newline character, advancing output to the next line for the new row",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It resets the inner loop counter",
                                    "explanationIfWrong": "Counters must be reset explicitly with assignment, e.g. c = 0."
                        },
                        {
                                    "id": "C",
                                    "text": "It breaks out of the outer loop",
                                    "explanationIfWrong": "print() only outputs text; it does not change control flow."
                        },
                        {
                                    "id": "D",
                                    "text": "It clears the terminal screen",
                                    "explanationIfWrong": "print() outputs an empty newline."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Calling print() with no arguments prints a standard newline character, moving the cursor to the beginning of the next row."
},
          {
            "id": "q-3.3-3-v2",
            "question": "How many total '#' characters are printed by this code?\n\nr = 0\nwhile r < 5:\n    c = 0\n    while c < 3:\n        print('#', end='')\n        c += 1\n    print()\n    r += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "15",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "8",
                                    "explanationIfWrong": "5 rows times 3 columns = 15 total characters."
                        },
                        {
                                    "id": "C",
                                    "text": "5",
                                    "explanationIfWrong": "Each row prints 3 characters."
                        },
                        {
                                    "id": "D",
                                    "text": "3",
                                    "explanationIfWrong": "The outer loop runs 5 times."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "5 rows * 3 columns = 15 '#' characters printed in a 5x3 grid."
},
          {
            "id": "q-3.3-3-v3",
            "question": "Why is end='' passed to print('*', end='') in pattern drawing?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "To prevent print from automatically inserting a newline after each character",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "To terminate the loop",
                                    "explanationIfWrong": "end='' is just a formatting argument to the print function."
                        },
                        {
                                    "id": "C",
                                    "text": "To convert the asterisk into an integer",
                                    "explanationIfWrong": "end specifies the trailing character of print output."
                        },
                        {
                                    "id": "D",
                                    "text": "To speed up loop execution",
                                    "explanationIfWrong": "It controls newline formatting."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "By default, print() appends a newline ('\\n'). Setting end='' allows printing multiple items consecutively on the same line."
}
        ]
      },
      {
        "heading": "Dependent Loop Counters (Triangles)",
        "text": "When drawing triangular patterns or calculating progressive combinations, the inner loop's termination condition often depends on the current value of the outer loop's counter (e.g. while col <= row).",
        "codeSnippet": "row = 1\nwhile row <= 4:\n    col = 1\n    while col <= row:\n        print(\"*\", end=\"\")\n        col += 1\n    print()\n    row += 1",
        "terminalOutput": "*\n**\n***\n****",
        "tip": "On row 1, col runs 1..1 (1 star). On row 2, col runs 1..2 (2 stars). On row N, col runs 1..N (N stars).",
        "mcq": {
          "id": "q-3.3-4-v1",
          "question": "What does the code below print?\n\ni = 1\nwhile i <= 3:\n    j = 1\n    while j <= i:\n        print(j, end='')\n        j += 1\n    print()\n    i += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "1\\n12\\n123",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "1\\n22\\n333",
                              "explanationIfWrong": "It prints j, which increments 1, 2, 3 on each row, not i."
                    },
                    {
                              "id": "C",
                              "text": "123\\n123\\n123",
                              "explanationIfWrong": "The inner loop condition is j <= i, so the width grows row by row."
                    },
                    {
                              "id": "D",
                              "text": "3\\n2\\n1",
                              "explanationIfWrong": "i starts at 1 and increases to 3."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Row 1 (i=1): prints j=1. Row 2 (i=2): prints j=1, 2. Row 3 (i=3): prints j=1, 2, 3."
},
        "retestMcq": {
          "id": "q-3.3-4-v2",
          "question": "How many total stars are printed by this code?\n\nr = 1\nwhile r <= 3:\n    c = 1\n    while c <= r:\n        print('*', end='')\n        c += 1\n    r += 1",
          "options": [
                    {
                              "id": "A",
                              "text": "6",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "9",
                              "explanationIfWrong": "1 + 2 + 3 = 6 stars total."
                    },
                    {
                              "id": "C",
                              "text": "3",
                              "explanationIfWrong": "Row 1 prints 1, row 2 prints 2, row 3 prints 3."
                    },
                    {
                              "id": "D",
                              "text": "4",
                              "explanationIfWrong": "1 + 2 + 3 = 6."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Row 1: 1 star. Row 2: 2 stars. Row 3: 3 stars. Sum = 1 + 2 + 3 = 6 stars."
},
        "questionPool": [
          {
            "id": "q-3.3-4-v1",
            "question": "What does the code below print?\n\ni = 1\nwhile i <= 3:\n    j = 1\n    while j <= i:\n        print(j, end='')\n        j += 1\n    print()\n    i += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "1\\n12\\n123",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1\\n22\\n333",
                                    "explanationIfWrong": "It prints j, which increments 1, 2, 3 on each row, not i."
                        },
                        {
                                    "id": "C",
                                    "text": "123\\n123\\n123",
                                    "explanationIfWrong": "The inner loop condition is j <= i, so the width grows row by row."
                        },
                        {
                                    "id": "D",
                                    "text": "3\\n2\\n1",
                                    "explanationIfWrong": "i starts at 1 and increases to 3."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Row 1 (i=1): prints j=1. Row 2 (i=2): prints j=1, 2. Row 3 (i=3): prints j=1, 2, 3."
},
          {
            "id": "q-3.3-4-v2",
            "question": "How many total stars are printed by this code?\n\nr = 1\nwhile r <= 3:\n    c = 1\n    while c <= r:\n        print('*', end='')\n        c += 1\n    r += 1",
            "options": [
                        {
                                    "id": "A",
                                    "text": "6",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "9",
                                    "explanationIfWrong": "1 + 2 + 3 = 6 stars total."
                        },
                        {
                                    "id": "C",
                                    "text": "3",
                                    "explanationIfWrong": "Row 1 prints 1, row 2 prints 2, row 3 prints 3."
                        },
                        {
                                    "id": "D",
                                    "text": "4",
                                    "explanationIfWrong": "1 + 2 + 3 = 6."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Row 1: 1 star. Row 2: 2 stars. Row 3: 3 stars. Sum = 1 + 2 + 3 = 6 stars."
},
          {
            "id": "q-3.3-4-v3",
            "question": "If you want a downward triangle of 3 rows (3 stars, then 2 stars, then 1 star), how should row initialize and update?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "row = 3; while row >= 1: ... row -= 1",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "row = 1; while row <= 3: ... row += 1",
                                    "explanationIfWrong": "This produces an upward triangle: 1, 2, 3 stars."
                        },
                        {
                                    "id": "C",
                                    "text": "row = 0; while row < 3: ... row -= 1",
                                    "explanationIfWrong": "Decrementing from 0 results in an infinite negative loop."
                        },
                        {
                                    "id": "D",
                                    "text": "row = 3; while row > 3: ... row -= 1",
                                    "explanationIfWrong": "3 > 3 is False initially, so it never executes."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Starting row at 3 and decrementing down to 1 causes the inner loop (up to row) to print 3, then 2, then 1 stars."
}
        ]
      },
      {
        "heading": "Boolean Flags for Multi-Level Loops",
        "text": "A break statement only terminates the innermost loop enclosing it. If you want to break out of multiple nested loops simultaneously, you can use a boolean flag variable checked by both loops.",
        "codeSnippet": "found = False\ni = 1\nwhile i <= 5 and not found:\n    j = 1\n    while j <= 5:\n        if i * j == 12:\n            print(f\"Found pair: {i} and {j}\")\n            found = True\n            break\n        j += 1\n    i += 1",
        "terminalOutput": "Found pair: 2 and 6",
        "mcq": {
          "id": "q-3.3-5-v1",
          "question": "Why doesn't a single break statement inside the inner loop exit both loops?",
          "options": [
                    {
                              "id": "A",
                              "text": "In Python, break only exits the innermost loop that directly contains it",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python requires an exit keyword to break outer loops",
                              "explanationIfWrong": "Python has no loop exit keyword; flags or functions with return are used."
                    },
                    {
                              "id": "C",
                              "text": "break applies to the outer loop only",
                              "explanationIfWrong": "break always applies to the innermost loop."
                    },
                    {
                              "id": "D",
                              "text": "Nested loops do not support break",
                              "explanationIfWrong": "break works normally inside nested loops, affecting the immediate loop."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A break statement only interrupts the closest enclosing loop. The outer loop continues running its next iteration unless explicitly stopped."
},
        "retestMcq": {
          "id": "q-3.3-5-v2",
          "question": "What is the recommended alternative to boolean flags when you want to exit all nested loops upon finding a result inside a function?",
          "options": [
                    {
                              "id": "A",
                              "text": "Use return, which immediately exits the entire function and all nested loops inside it",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Use break twice in a row",
                              "explanationIfWrong": "A second break on the next line is unreachable code."
                    },
                    {
                              "id": "C",
                              "text": "Use pass",
                              "explanationIfWrong": "pass does nothing and continues loop execution."
                    },
                    {
                              "id": "D",
                              "text": "Use continue",
                              "explanationIfWrong": "continue only skips the current iteration."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A return statement inside a function immediately terminates function execution, cleanly escaping any number of nested loops."
},
        "questionPool": [
          {
            "id": "q-3.3-5-v1",
            "question": "Why doesn't a single break statement inside the inner loop exit both loops?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "In Python, break only exits the innermost loop that directly contains it",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python requires an exit keyword to break outer loops",
                                    "explanationIfWrong": "Python has no loop exit keyword; flags or functions with return are used."
                        },
                        {
                                    "id": "C",
                                    "text": "break applies to the outer loop only",
                                    "explanationIfWrong": "break always applies to the innermost loop."
                        },
                        {
                                    "id": "D",
                                    "text": "Nested loops do not support break",
                                    "explanationIfWrong": "break works normally inside nested loops, affecting the immediate loop."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A break statement only interrupts the closest enclosing loop. The outer loop continues running its next iteration unless explicitly stopped."
},
          {
            "id": "q-3.3-5-v2",
            "question": "What is the recommended alternative to boolean flags when you want to exit all nested loops upon finding a result inside a function?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Use return, which immediately exits the entire function and all nested loops inside it",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Use break twice in a row",
                                    "explanationIfWrong": "A second break on the next line is unreachable code."
                        },
                        {
                                    "id": "C",
                                    "text": "Use pass",
                                    "explanationIfWrong": "pass does nothing and continues loop execution."
                        },
                        {
                                    "id": "D",
                                    "text": "Use continue",
                                    "explanationIfWrong": "continue only skips the current iteration."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A return statement inside a function immediately terminates function execution, cleanly escaping any number of nested loops."
},
          {
            "id": "q-3.3-5-v3",
            "question": "What will be printed when this code finishes?\n\nstop_all = False\nx = 0\nwhile x < 3 and not stop_all:\n    y = 0\n    while y < 3:\n        if x == 1:\n            stop_all = True\n            break\n        y += 1\n    x += 1\nprint(x)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "2",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "1",
                                    "explanationIfWrong": "When x=1, the inner loop sets stop_all=True and breaks, then x += 1 runs, making x=2 before outer loop condition stops."
                        },
                        {
                                    "id": "C",
                                    "text": "3",
                                    "explanationIfWrong": "The outer loop checks 'and not stop_all' at x=2 and terminates early."
                        },
                        {
                                    "id": "D",
                                    "text": "0",
                                    "explanationIfWrong": "x advances past 0."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "At x=1, inner loop sets stop_all=True and breaks. x increments to 2. Next outer condition check sees not stop_all is False, so outer loop ends. x is 2."
}
        ]
      }
    ]
  },
  {
    "id": "3-4-functions",
    "number": "3.4",
    "title": "Defining Functions",
    "subtitle": "Structure reusable code with def, parameters, return values, docstrings, and local scope rules.",
    "readTime": "25 min",
    "objectives": [
      "Define custom reusable functions using the def keyword",
      "Pass data into functions via parameters and arguments",
      "Work with multiple parameters in positional order",
      "Return computed results to caller code using the return statement",
      "Differentiate clearly between printing values and returning values",
      "Understand local variable scope versus global scope"
],
    "theoryBlocks": [
      {
        "heading": "Defining Functions with def",
        "text": "A function is a named, reusable block of code designed to perform a specific task. In Python, you define a function using the def keyword, followed by the function name, parentheses (), and a colon :. The body of the function is indented. Calling the function executes its body.",
        "codeSnippet": "def greet():\n    print(\"Hello!\")\n    print(\"Welcome to Python functions.\")\n\n# Calling the function twice\ngreet()\ngreet()",
        "terminalOutput": "Hello!\nWelcome to Python functions.\nHello!\nWelcome to Python functions.",
        "tip": "Function definitions must appear in the code before the line where they are called, because Python executes line-by-line from top to bottom.",
        "mcq": {
          "id": "q-3.4-0-v1",
          "question": "Which keyword is used to define a new function in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "def",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "function",
                              "explanationIfWrong": "'function' is used in JavaScript, not Python."
                    },
                    {
                              "id": "C",
                              "text": "fun",
                              "explanationIfWrong": "'fun' is used in Kotlin, not Python."
                    },
                    {
                              "id": "D",
                              "text": "define",
                              "explanationIfWrong": "Python uses the 3-letter keyword 'def'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Python uses the keyword def (short for define) to declare functions."
},
        "retestMcq": {
          "id": "q-3.4-0-v2",
          "question": "What happens when Python encounters a def statement without calling the function?",
          "options": [
                    {
                              "id": "A",
                              "text": "It defines and stores the function in memory, but does not execute the function body",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It executes the body immediately once",
                              "explanationIfWrong": "The function body only runs when the function is explicitly invoked with ()."
                    },
                    {
                              "id": "C",
                              "text": "It raises a warning if the function is not immediately invoked",
                              "explanationIfWrong": "Uncalled functions are completely valid."
                    },
                    {
                              "id": "D",
                              "text": "It compiles the code to C automatically",
                              "explanationIfWrong": "Python stores the function object in bytecode."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "def registers the function name and instructions; the body code runs only when called with parentheses like my_func()."
},
        "questionPool": [
          {
            "id": "q-3.4-0-v1",
            "question": "Which keyword is used to define a new function in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "def",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "function",
                                    "explanationIfWrong": "'function' is used in JavaScript, not Python."
                        },
                        {
                                    "id": "C",
                                    "text": "fun",
                                    "explanationIfWrong": "'fun' is used in Kotlin, not Python."
                        },
                        {
                                    "id": "D",
                                    "text": "define",
                                    "explanationIfWrong": "Python uses the 3-letter keyword 'def'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python uses the keyword def (short for define) to declare functions."
},
          {
            "id": "q-3.4-0-v2",
            "question": "What happens when Python encounters a def statement without calling the function?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It defines and stores the function in memory, but does not execute the function body",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It executes the body immediately once",
                                    "explanationIfWrong": "The function body only runs when the function is explicitly invoked with ()."
                        },
                        {
                                    "id": "C",
                                    "text": "It raises a warning if the function is not immediately invoked",
                                    "explanationIfWrong": "Uncalled functions are completely valid."
                        },
                        {
                                    "id": "D",
                                    "text": "It compiles the code to C automatically",
                                    "explanationIfWrong": "Python stores the function object in bytecode."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "def registers the function name and instructions; the body code runs only when called with parentheses like my_func()."
},
          {
            "id": "q-3.4-0-v3",
            "question": "What error occurs if you call say_hi() before defining it?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "NameError: name 'say_hi' is not defined",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "SyntaxError: missing function",
                                    "explanationIfWrong": "Syntax is valid; the name lookup fails at runtime."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError: null reference",
                                    "explanationIfWrong": "Python raises NameError when an identifier has not yet been assigned."
                        },
                        {
                                    "id": "D",
                                    "text": "FunctionError",
                                    "explanationIfWrong": "Python does not have a FunctionError exception."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because Python executes sequentially, calling a function before its def statement raises a NameError."
}
        ]
      },
      {
        "heading": "Function Parameters & Arguments",
        "text": "Parameters are variable names listed inside the function's parentheses in its definition. Arguments are the concrete values passed into the function when it is called. Inside the function body, the parameter acts as a local variable containing the passed value.",
        "codeSnippet": "def greet_person(name):\n    print(f\"Hello {name}, great to see you!\")\n\ngreet_person(\"Alice\")\ngreet_person(\"Bob\")",
        "terminalOutput": "Hello Alice, great to see you!\nHello Bob, great to see you!",
        "mcq": {
          "id": "q-3.4-1-v1",
          "question": "In def show(text):, what is text called?",
          "options": [
                    {
                              "id": "A",
                              "text": "A parameter",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "An argument",
                              "explanationIfWrong": "Arguments are the actual values passed during the call (e.g. show('hello'))."
                    },
                    {
                              "id": "C",
                              "text": "A global variable",
                              "explanationIfWrong": "text is local to the function."
                    },
                    {
                              "id": "D",
                              "text": "A return value",
                              "explanationIfWrong": "text is an input variable, not a return value."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Parameters are defined in the function header; arguments are the actual values supplied during the call."
},
        "retestMcq": {
          "id": "q-3.4-1-v2",
          "question": "What error occurs if a function defined as def square(n): is called with no arguments: square()?",
          "options": [
                    {
                              "id": "A",
                              "text": "TypeError: missing 1 required positional argument: 'n'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "ValueError: argument cannot be None",
                              "explanationIfWrong": "Python raises a TypeError for argument mismatch."
                    },
                    {
                              "id": "C",
                              "text": "It automatically assigns n = 0",
                              "explanationIfWrong": "Python does not guess default values unless explicitly provided in the header."
                    },
                    {
                              "id": "D",
                              "text": "NameError: n is not defined",
                              "explanationIfWrong": "Argument count checking triggers a TypeError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When required parameters are omitted in a call, Python raises a TypeError."
},
        "questionPool": [
          {
            "id": "q-3.4-1-v1",
            "question": "In def show(text):, what is text called?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A parameter",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "An argument",
                                    "explanationIfWrong": "Arguments are the actual values passed during the call (e.g. show('hello'))."
                        },
                        {
                                    "id": "C",
                                    "text": "A global variable",
                                    "explanationIfWrong": "text is local to the function."
                        },
                        {
                                    "id": "D",
                                    "text": "A return value",
                                    "explanationIfWrong": "text is an input variable, not a return value."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Parameters are defined in the function header; arguments are the actual values supplied during the call."
},
          {
            "id": "q-3.4-1-v2",
            "question": "What error occurs if a function defined as def square(n): is called with no arguments: square()?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: missing 1 required positional argument: 'n'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "ValueError: argument cannot be None",
                                    "explanationIfWrong": "Python raises a TypeError for argument mismatch."
                        },
                        {
                                    "id": "C",
                                    "text": "It automatically assigns n = 0",
                                    "explanationIfWrong": "Python does not guess default values unless explicitly provided in the header."
                        },
                        {
                                    "id": "D",
                                    "text": "NameError: n is not defined",
                                    "explanationIfWrong": "Argument count checking triggers a TypeError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When required parameters are omitted in a call, Python raises a TypeError."
},
          {
            "id": "q-3.4-1-v3",
            "question": "Can you pass an expression or variable as an argument, such as print_double(x + 5)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes, Python evaluates the expression x + 5 first, then passes the resulting value",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No, only literal numbers can be passed",
                                    "explanationIfWrong": "Any valid Python expression can be passed as an argument."
                        },
                        {
                                    "id": "C",
                                    "text": "No, you must assign it to a temporary variable first",
                                    "explanationIfWrong": "Expressions can be evaluated directly in the call parentheses."
                        },
                        {
                                    "id": "D",
                                    "text": "Yes, but it causes a SyntaxWarning",
                                    "explanationIfWrong": "Passing evaluated expressions is standard Python practice."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python evaluates arguments prior to entering the function, passing the resulting object reference."
}
        ]
      },
      {
        "heading": "Multiple Parameters",
        "text": "Functions can accept multiple parameters separated by commas. By default, arguments are matched to parameters positionally from left to right.",
        "codeSnippet": "def print_box(width, height, char):\n    row = 0\n    while row < height:\n        print(char * width)\n        row += 1\n\nprint_box(4, 2, \"#\")",
        "terminalOutput": "####\n####",
        "mcq": {
          "id": "q-3.4-2-v1",
          "question": "Given def order(first, second): print(first, second), what is printed by order('B', 'A')?",
          "options": [
                    {
                              "id": "A",
                              "text": "B A",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A B",
                              "explanationIfWrong": "Positional arguments bind left-to-right: first receives 'B' and second receives 'A'."
                    },
                    {
                              "id": "C",
                              "text": "Error",
                              "explanationIfWrong": "Passing two arguments to two parameters is completely valid."
                    },
                    {
                              "id": "D",
                              "text": "('B', 'A')",
                              "explanationIfWrong": "print(first, second) prints them separated by a space, not as a tuple."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The first argument 'B' maps to parameter first, and 'A' maps to second. Output is 'B A'."
},
        "retestMcq": {
          "id": "q-3.4-2-v2",
          "question": "What happens if you pass 3 arguments to a function that only defines 2 parameters?",
          "options": [
                    {
                              "id": "A",
                              "text": "TypeError: takes 2 positional arguments but 3 were given",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The third argument is silently ignored",
                              "explanationIfWrong": "Python strictly verifies argument count unless *args is declared."
                    },
                    {
                              "id": "C",
                              "text": "The arguments are packed into a list",
                              "explanationIfWrong": "Automatic packing requires explicit variable argument syntax."
                    },
                    {
                              "id": "D",
                              "text": "A SyntaxError occurs before compilation",
                              "explanationIfWrong": "Argument count mismatches are detected at runtime as TypeErrors."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Passing too many arguments raises a TypeError specifying the expected and received counts."
},
        "questionPool": [
          {
            "id": "q-3.4-2-v1",
            "question": "Given def order(first, second): print(first, second), what is printed by order('B', 'A')?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "B A",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A B",
                                    "explanationIfWrong": "Positional arguments bind left-to-right: first receives 'B' and second receives 'A'."
                        },
                        {
                                    "id": "C",
                                    "text": "Error",
                                    "explanationIfWrong": "Passing two arguments to two parameters is completely valid."
                        },
                        {
                                    "id": "D",
                                    "text": "('B', 'A')",
                                    "explanationIfWrong": "print(first, second) prints them separated by a space, not as a tuple."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The first argument 'B' maps to parameter first, and 'A' maps to second. Output is 'B A'."
},
          {
            "id": "q-3.4-2-v2",
            "question": "What happens if you pass 3 arguments to a function that only defines 2 parameters?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: takes 2 positional arguments but 3 were given",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The third argument is silently ignored",
                                    "explanationIfWrong": "Python strictly verifies argument count unless *args is declared."
                        },
                        {
                                    "id": "C",
                                    "text": "The arguments are packed into a list",
                                    "explanationIfWrong": "Automatic packing requires explicit variable argument syntax."
                        },
                        {
                                    "id": "D",
                                    "text": "A SyntaxError occurs before compilation",
                                    "explanationIfWrong": "Argument count mismatches are detected at runtime as TypeErrors."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing too many arguments raises a TypeError specifying the expected and received counts."
},
          {
            "id": "q-3.4-2-v3",
            "question": "What is printed by:\n\ndef calc(a, b):\n    print(a - b)\n\ncalc(2, 5)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "-3",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3",
                                    "explanationIfWrong": "a is 2 and b is 5; 2 - 5 = -3."
                        },
                        {
                                    "id": "C",
                                    "text": "7",
                                    "explanationIfWrong": "It subtracts (a - b), not adds."
                        },
                        {
                                    "id": "D",
                                    "text": "-7",
                                    "explanationIfWrong": "2 - 5 is -3."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Positional matching assigns a = 2, b = 5. The result of 2 - 5 is -3."
}
        ]
      },
      {
        "heading": "Return Values with return",
        "text": "The return statement sends a value back from the function to the location where the function was called. Once return executes, the function terminates immediately, and any code after return is skipped.",
        "codeSnippet": "def square(n):\n    return n * n\n\nresult = square(4)\nprint(f\"4 squared is {result}\")\nprint(f\"5 squared is {square(5)}\")",
        "terminalOutput": "4 squared is 16\n5 squared is 25",
        "warning": "If a function does not have a return statement (or executes return with no value), it implicitly returns None.",
        "mcq": {
          "id": "q-3.4-3-v1",
          "question": "What does a function return if it finishes executing without encountering a return statement?",
          "options": [
                    {
                              "id": "A",
                              "text": "None",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "0",
                              "explanationIfWrong": "Python does not default to 0; it returns None."
                    },
                    {
                              "id": "C",
                              "text": "False",
                              "explanationIfWrong": "None is the special null object in Python, not False."
                    },
                    {
                              "id": "D",
                              "text": "Raises an error",
                              "explanationIfWrong": "Functions without return statements are valid and return None."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, any function that finishes without an explicit return statement returns None."
},
        "retestMcq": {
          "id": "q-3.4-3-v2",
          "question": "What is printed by this code?\n\ndef check(x):\n    if x > 0:\n        return 'Positive'\n    return 'Non-positive'\n    print('End of function')\n\nprint(check(5))",
          "options": [
                    {
                              "id": "A",
                              "text": "Positive",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Positive\\nEnd of function",
                              "explanationIfWrong": "print('End of function') is unreachable because return immediately exits the function."
                    },
                    {
                              "id": "C",
                              "text": "Non-positive",
                              "explanationIfWrong": "5 > 0 is True, so return 'Positive' executes."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "It explicitly returns 'Positive'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When x=5, the condition x > 0 triggers return 'Positive'. The function exits immediately; subsequent lines never execute."
},
        "questionPool": [
          {
            "id": "q-3.4-3-v1",
            "question": "What does a function return if it finishes executing without encountering a return statement?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "None",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "0",
                                    "explanationIfWrong": "Python does not default to 0; it returns None."
                        },
                        {
                                    "id": "C",
                                    "text": "False",
                                    "explanationIfWrong": "None is the special null object in Python, not False."
                        },
                        {
                                    "id": "D",
                                    "text": "Raises an error",
                                    "explanationIfWrong": "Functions without return statements are valid and return None."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, any function that finishes without an explicit return statement returns None."
},
          {
            "id": "q-3.4-3-v2",
            "question": "What is printed by this code?\n\ndef check(x):\n    if x > 0:\n        return 'Positive'\n    return 'Non-positive'\n    print('End of function')\n\nprint(check(5))",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Positive",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Positive\\nEnd of function",
                                    "explanationIfWrong": "print('End of function') is unreachable because return immediately exits the function."
                        },
                        {
                                    "id": "C",
                                    "text": "Non-positive",
                                    "explanationIfWrong": "5 > 0 is True, so return 'Positive' executes."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "It explicitly returns 'Positive'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When x=5, the condition x > 0 triggers return 'Positive'. The function exits immediately; subsequent lines never execute."
},
          {
            "id": "q-3.4-3-v3",
            "question": "What is the key difference between print() and return inside a function?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "print() displays text on the screen, while return delivers a value back to the program to be stored or used in calculations",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "print() saves values to variables, while return prints to console",
                                    "explanationIfWrong": "This is the exact opposite of what they do."
                        },
                        {
                                    "id": "C",
                                    "text": "There is no difference; they are interchangeable",
                                    "explanationIfWrong": "They serve fundamentally different purposes: I/O display vs data flow."
                        },
                        {
                                    "id": "D",
                                    "text": "return can only be used once per file",
                                    "explanationIfWrong": "return can be used multiple times in any function."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "print() produces console output for human viewing; return sends data back to the calling code for further computation."
}
        ]
      },
      {
        "heading": "Using Return Values in Expressions",
        "text": "Because a function call evaluates to its returned value, function calls can be used directly inside mathematical expressions, print statements, conditional checks, or as arguments to other functions.",
        "codeSnippet": "def minimum(a, b):\n    if a < b:\n        return a\n    return b\n\nsmallest = minimum(15, 8)\ntotal = minimum(4, 9) + minimum(10, 2)\nprint(f\"Smallest: {smallest}, Total: {total}\")",
        "terminalOutput": "Smallest: 8, Total: 6",
        "mcq": {
          "id": "q-3.4-4-v1",
          "question": "What is the value of result?\n\ndef double(n):\n    return n * 2\n\nresult = double(double(3))",
          "options": [
                    {
                              "id": "A",
                              "text": "12",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "6",
                              "explanationIfWrong": "double(3) returns 6, then double(6) returns 12."
                    },
                    {
                              "id": "C",
                              "text": "9",
                              "explanationIfWrong": "3 * 2 = 6; 6 * 2 = 12."
                    },
                    {
                              "id": "D",
                              "text": "Error",
                              "explanationIfWrong": "Nested function calls are standard Python syntax."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Innermost call: double(3) returns 6. Outermost call: double(6) returns 12."
},
        "retestMcq": {
          "id": "q-3.4-4-v2",
          "question": "What is the result of x = add(2, 3) * 2 if add(a, b) does print(a + b) instead of return a + b?",
          "options": [
                    {
                              "id": "A",
                              "text": "TypeError: unsupported operand type(s) for *: 'NoneType' and 'int'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "10",
                              "explanationIfWrong": "Without return, add() returns None. None * 2 raises a TypeError."
                    },
                    {
                              "id": "C",
                              "text": "5",
                              "explanationIfWrong": "5 is printed to the console, but not returned to the expression."
                    },
                    {
                              "id": "D",
                              "text": "0",
                              "explanationIfWrong": "None cannot be multiplied by an integer."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since add() only prints and doesn't return, its return value is None. Multiplying None * 2 crashes with a TypeError."
},
        "questionPool": [
          {
            "id": "q-3.4-4-v1",
            "question": "What is the value of result?\n\ndef double(n):\n    return n * 2\n\nresult = double(double(3))",
            "options": [
                        {
                                    "id": "A",
                                    "text": "12",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "6",
                                    "explanationIfWrong": "double(3) returns 6, then double(6) returns 12."
                        },
                        {
                                    "id": "C",
                                    "text": "9",
                                    "explanationIfWrong": "3 * 2 = 6; 6 * 2 = 12."
                        },
                        {
                                    "id": "D",
                                    "text": "Error",
                                    "explanationIfWrong": "Nested function calls are standard Python syntax."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Innermost call: double(3) returns 6. Outermost call: double(6) returns 12."
},
          {
            "id": "q-3.4-4-v2",
            "question": "What is the result of x = add(2, 3) * 2 if add(a, b) does print(a + b) instead of return a + b?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: unsupported operand type(s) for *: 'NoneType' and 'int'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "10",
                                    "explanationIfWrong": "Without return, add() returns None. None * 2 raises a TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "5",
                                    "explanationIfWrong": "5 is printed to the console, but not returned to the expression."
                        },
                        {
                                    "id": "D",
                                    "text": "0",
                                    "explanationIfWrong": "None cannot be multiplied by an integer."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since add() only prints and doesn't return, its return value is None. Multiplying None * 2 crashes with a TypeError."
},
          {
            "id": "q-3.4-4-v3",
            "question": "What is printed by:\n\ndef is_even(n):\n    return n % 2 == 0\n\nif is_even(6):\n    print('Yes')\nelse:\n    print('No')",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Yes",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "No",
                                    "explanationIfWrong": "6 % 2 == 0 evaluates to True, so 'Yes' is printed."
                        },
                        {
                                    "id": "C",
                                    "text": "True",
                                    "explanationIfWrong": "The if statement checks the True condition and executes print('Yes')."
                        },
                        {
                                    "id": "D",
                                    "text": "Error",
                                    "explanationIfWrong": "Using a boolean return value in an if condition is idiomatic Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "is_even(6) evaluates to True (6 % 2 == 0 is True), so the if-branch executes and prints 'Yes'."
}
        ]
      },
      {
        "heading": "Variable Scope: Local vs. Global",
        "text": "Variables created inside a function (including parameters) have local scope. They exist only while the function is executing and cannot be accessed from outside the function. Variables defined outside any function have global scope and can be read anywhere in the module.",
        "codeSnippet": "def compute():\n    local_num = 42\n    print(f\"Inside function: {local_num}\")\n\ncompute()\n# print(local_num)  # Raises NameError: name 'local_num' is not defined!",
        "terminalOutput": "Inside function: 42",
        "tip": "Avoid naming local and global variables the same to prevent confusion and accidental shadowing.",
        "mcq": {
          "id": "q-3.4-5-v1",
          "question": "What happens when you try to access a variable defined inside a function from outside that function?",
          "options": [
                    {
                              "id": "A",
                              "text": "NameError: name is not defined",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It returns None",
                              "explanationIfWrong": "Python does not find the name in the global scope and raises an exception."
                    },
                    {
                              "id": "C",
                              "text": "It returns the value stored during the last call",
                              "explanationIfWrong": "Local variables are destroyed after the function returns."
                    },
                    {
                              "id": "D",
                              "text": "ScopeError",
                              "explanationIfWrong": "Python's exception for undefined names is NameError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Local variables only exist in the function's local scope. Outside the function, they do not exist, triggering a NameError."
},
        "retestMcq": {
          "id": "q-3.4-5-v2",
          "question": "What is printed by this code?\n\nx = 10\ndef modify():\n    x = 20\n\nmodify()\nprint(x)",
          "options": [
                    {
                              "id": "A",
                              "text": "10",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "20",
                              "explanationIfWrong": "x = 20 creates a new local variable x inside modify(), leaving the global x unchanged."
                    },
                    {
                              "id": "C",
                              "text": "None",
                              "explanationIfWrong": "The global x retains its value of 10."
                    },
                    {
                              "id": "D",
                              "text": "Error",
                              "explanationIfWrong": "Assigning to a variable inside a function simply creates a local variable."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Assigning x = 20 inside modify creates a local variable. The global variable x remains 10."
},
        "questionPool": [
          {
            "id": "q-3.4-5-v1",
            "question": "What happens when you try to access a variable defined inside a function from outside that function?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "NameError: name is not defined",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It returns None",
                                    "explanationIfWrong": "Python does not find the name in the global scope and raises an exception."
                        },
                        {
                                    "id": "C",
                                    "text": "It returns the value stored during the last call",
                                    "explanationIfWrong": "Local variables are destroyed after the function returns."
                        },
                        {
                                    "id": "D",
                                    "text": "ScopeError",
                                    "explanationIfWrong": "Python's exception for undefined names is NameError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Local variables only exist in the function's local scope. Outside the function, they do not exist, triggering a NameError."
},
          {
            "id": "q-3.4-5-v2",
            "question": "What is printed by this code?\n\nx = 10\ndef modify():\n    x = 20\n\nmodify()\nprint(x)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "10",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "20",
                                    "explanationIfWrong": "x = 20 creates a new local variable x inside modify(), leaving the global x unchanged."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "The global x retains its value of 10."
                        },
                        {
                                    "id": "D",
                                    "text": "Error",
                                    "explanationIfWrong": "Assigning to a variable inside a function simply creates a local variable."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Assigning x = 20 inside modify creates a local variable. The global variable x remains 10."
},
          {
            "id": "q-3.4-5-v3",
            "question": "Why is keeping variables local to functions considered a best programming practice?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It prevents unintended side effects, keeps functions modular, and makes code easier to test and debug",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Local variables use 10 times less memory in Python",
                                    "explanationIfWrong": "Memory difference is negligible; modularity and safety are the main reasons."
                        },
                        {
                                    "id": "C",
                                    "text": "Python limits programs to 5 global variables",
                                    "explanationIfWrong": "There is no limit on global variables in Python."
                        },
                        {
                                    "id": "D",
                                    "text": "Global variables are deprecated in Python 3",
                                    "explanationIfWrong": "Global variables exist in Python 3, but minimizing them is best practice."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Encapsulating variables inside functions isolates behavior, prevents accidental modifications across the program, and makes code easier to reason about."
}
        ]
      }
    ]
  }
];


// Function to get active questions for a level
// Supports dynamic variant rotation (v1, v2, v3) without duplicate repeat
export const getActiveQuestionsForLevelPart3 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part3_question_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part3_active_questions_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 3
export const getConsecutiveFailuresPart3 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part3_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart3 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part3_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart3 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part3_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart3 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part3_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart3 = (
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
  const currentAttempt = getLevelAttemptCountPart3(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part3_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part3_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part3_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part3_locked_${studentId}`);
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
      setLevelAttemptCountPart3(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart3(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart3(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part3_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part3_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part3_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart3 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part3_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part3_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part3_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part3_locked_progression_${studentId}`);
  } catch {}
};
