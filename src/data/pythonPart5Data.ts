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
    "id": "5-1-more-lists-and-matrices",
    "number": "5.1",
    "title": "More Lists & 2D Matrices",
    "subtitle": "Work with two-dimensional data structures, nested lists, matrix indexing, and grid algorithms.",
    "readTime": "20 min",
    "objectives": [
      "Create and initialize two-dimensional lists (matrices) in Python",
      "Access elements using double indexing syntax matrix[row][col]",
      "Traverse 2D grids using nested for loops",
      "Modify specific grid cells in-place without corrupting adjacent rows",
      "Avoid the dangerous list multiplication trap [[0] * N] * M",
      "Extract rows, columns, and sub-grids (such as Sudoku blocks)"
],
    "theoryBlocks": [
      {
        "heading": "Two-Dimensional Lists (Matrices)",
        "text": "A matrix or 2D grid in Python is represented as a list of lists. Each inner list represents a row, and elements inside that inner list represent the columns of that row. You access elements using two sets of square brackets: matrix[row_index][col_index].",
        "codeSnippet": "grid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\n# Row 0, Column 2 -> 3\nprint(grid[0][2])\n# Row 1, Column 1 -> 5 (center)\nprint(grid[1][1])",
        "terminalOutput": "3\n5",
        "tip": "Remember: the first index selects the row (outer list), and the second index selects the column (inner list).",
        "mcq": {
          "id": "q-5.1-0-v1",
          "question": "Given m = [[10, 20], [30, 40], [50, 60]], what is m[2][0]?",
          "options": [
                    {
                              "id": "A",
                              "text": "50",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "30",
                              "explanationIfWrong": "m[1][0] is 30. Row 2 is [50, 60]."
                    },
                    {
                              "id": "C",
                              "text": "60",
                              "explanationIfWrong": "m[2][1] is 60. Col 0 is 50."
                    },
                    {
                              "id": "D",
                              "text": "20",
                              "explanationIfWrong": "m[0][1] is 20."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "m[2] selects the third row [50, 60]. Index [0] of that row is 50."
},
        "retestMcq": {
          "id": "q-5.1-0-v2",
          "question": "What does len(matrix) return for a 2D matrix with 4 rows and 3 columns?",
          "options": [
                    {
                              "id": "A",
                              "text": "4 (the number of rows)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "3 (the number of columns)",
                              "explanationIfWrong": "len(matrix[0]) gives the number of columns, not len(matrix)."
                    },
                    {
                              "id": "C",
                              "text": "12 (the total element count)",
                              "explanationIfWrong": "len() returns the outer list size, which is the row count."
                    },
                    {
                              "id": "D",
                              "text": "7",
                              "explanationIfWrong": "len() counts outer items (rows) only."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "len(matrix) returns the length of the outer list, which corresponds to the number of rows (4)."
},
        "questionPool": [
          {
            "id": "q-5.1-0-v1",
            "question": "Given m = [[10, 20], [30, 40], [50, 60]], what is m[2][0]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "50",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "30",
                                    "explanationIfWrong": "m[1][0] is 30. Row 2 is [50, 60]."
                        },
                        {
                                    "id": "C",
                                    "text": "60",
                                    "explanationIfWrong": "m[2][1] is 60. Col 0 is 50."
                        },
                        {
                                    "id": "D",
                                    "text": "20",
                                    "explanationIfWrong": "m[0][1] is 20."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "m[2] selects the third row [50, 60]. Index [0] of that row is 50."
},
          {
            "id": "q-5.1-0-v2",
            "question": "What does len(matrix) return for a 2D matrix with 4 rows and 3 columns?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "4 (the number of rows)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3 (the number of columns)",
                                    "explanationIfWrong": "len(matrix[0]) gives the number of columns, not len(matrix)."
                        },
                        {
                                    "id": "C",
                                    "text": "12 (the total element count)",
                                    "explanationIfWrong": "len() returns the outer list size, which is the row count."
                        },
                        {
                                    "id": "D",
                                    "text": "7",
                                    "explanationIfWrong": "len() counts outer items (rows) only."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "len(matrix) returns the length of the outer list, which corresponds to the number of rows (4)."
},
          {
            "id": "q-5.1-0-v3",
            "question": "How do you access the element at the bottom-right corner of a non-empty 2D list grid?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "grid[-1][-1]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "grid[0][0]",
                                    "explanationIfWrong": "grid[0][0] is the top-left corner."
                        },
                        {
                                    "id": "C",
                                    "text": "grid[len(grid)][len(grid)]",
                                    "explanationIfWrong": "This causes an IndexError because indices are 0-based."
                        },
                        {
                                    "id": "D",
                                    "text": "grid.corner()",
                                    "explanationIfWrong": "Lists have no .corner() method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Negative index -1 on the outer list accesses the last row, and -1 on the inner list accesses the last column."
}
        ]
      },
      {
        "heading": "Traversing 2D Grids",
        "text": "To process every item in a 2D matrix, use nested for loops. The outer loop iterates over rows, and the inner loop iterates over columns or items in each row.",
        "codeSnippet": "matrix = [\n    [1, 2],\n    [3, 4]\n]\n\n# By items directly:\nfor row in matrix:\n    for val in row:\n        print(val, end=\" \")\n    print()",
        "terminalOutput": "1 2 \n3 4 ",
        "mcq": {
          "id": "q-5.1-1-v1",
          "question": "How do you traverse a 2D matrix using indices if you need the row and column coordinates?",
          "options": [
                    {
                              "id": "A",
                              "text": "for r in range(len(m)): for c in range(len(m[r])): ...",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "for r, c in m: ...",
                              "explanationIfWrong": "m yields rows, not coordinate pairs."
                    },
                    {
                              "id": "C",
                              "text": "for i in range(len(m) * 2): ...",
                              "explanationIfWrong": "Dimensions are navigated via nested loops."
                    },
                    {
                              "id": "D",
                              "text": "m.traverse()",
                              "explanationIfWrong": "Lists do not have a traverse method."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Outer loop iterates rows (0 to len(m)-1), inner loop iterates columns in that row (0 to len(m[r])-1)."
},
        "retestMcq": {
          "id": "q-5.1-1-v2",
          "question": "What is printed by this code?\n\ngrid = [[1, 1], [2, 2]]\ntotal = 0\nfor row in grid:\n    for val in row:\n        total += val\nprint(total)",
          "options": [
                    {
                              "id": "A",
                              "text": "6",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "4",
                              "explanationIfWrong": "1 + 1 + 2 + 2 = 6."
                    },
                    {
                              "id": "C",
                              "text": "2",
                              "explanationIfWrong": "All elements across both rows are summed."
                    },
                    {
                              "id": "D",
                              "text": "8",
                              "explanationIfWrong": "Sum is 1 + 1 + 2 + 2 = 6."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The nested loop visits every element: 1 + 1 + 2 + 2 = 6."
},
        "questionPool": [
          {
            "id": "q-5.1-1-v1",
            "question": "How do you traverse a 2D matrix using indices if you need the row and column coordinates?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "for r in range(len(m)): for c in range(len(m[r])): ...",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "for r, c in m: ...",
                                    "explanationIfWrong": "m yields rows, not coordinate pairs."
                        },
                        {
                                    "id": "C",
                                    "text": "for i in range(len(m) * 2): ...",
                                    "explanationIfWrong": "Dimensions are navigated via nested loops."
                        },
                        {
                                    "id": "D",
                                    "text": "m.traverse()",
                                    "explanationIfWrong": "Lists do not have a traverse method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Outer loop iterates rows (0 to len(m)-1), inner loop iterates columns in that row (0 to len(m[r])-1)."
},
          {
            "id": "q-5.1-1-v2",
            "question": "What is printed by this code?\n\ngrid = [[1, 1], [2, 2]]\ntotal = 0\nfor row in grid:\n    for val in row:\n        total += val\nprint(total)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "6",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "4",
                                    "explanationIfWrong": "1 + 1 + 2 + 2 = 6."
                        },
                        {
                                    "id": "C",
                                    "text": "2",
                                    "explanationIfWrong": "All elements across both rows are summed."
                        },
                        {
                                    "id": "D",
                                    "text": "8",
                                    "explanationIfWrong": "Sum is 1 + 1 + 2 + 2 = 6."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The nested loop visits every element: 1 + 1 + 2 + 2 = 6."
},
          {
            "id": "q-5.1-1-v3",
            "question": "How do you extract an entire single column (e.g. column 1) from matrix m?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "col = [row[1] for row in m]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "col = m[:][1]",
                                    "explanationIfWrong": "m[:][1] slices the outer list and selects row 1, not column 1."
                        },
                        {
                                    "id": "C",
                                    "text": "col = m[:, 1]",
                                    "explanationIfWrong": "Comma slicing [:, 1] is NumPy syntax, invalid on standard Python lists."
                        },
                        {
                                    "id": "D",
                                    "text": "col = m.column(1)",
                                    "explanationIfWrong": "Standard lists have no .column() method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Standard Python lists require iterating through each row and picking row[col_idx]."
}
        ]
      },
      {
        "heading": "The 2D List Multiplication Trap",
        "text": "A common mistake when initializing an M x N matrix of zeros is writing [[0] * N] * M. This creates M references to the exact same inner list in memory! Modifying one cell will change that entire column across all rows.",
        "codeSnippet": "# BUGGY INITIALIZATION:\nbad_grid = [[0] * 3] * 3\nbad_grid[0][0] = 9\nprint(f\"Buggy: {bad_grid}\")\n\n# CORRECT INITIALIZATION:\ngood_grid = [[0] * 3 for _ in range(3)]\ngood_grid[0][0] = 9\nprint(f\"Correct: {good_grid}\")",
        "terminalOutput": "Buggy: [[9, 0, 0], [9, 0, 0], [9, 0, 0]]\nCorrect: [[9, 0, 0], [0, 0, 0], [0, 0, 0]]",
        "warning": "Never use * on a list of lists. Always use a list comprehension: [[0] * cols for _ in range(rows)].",
        "mcq": {
          "id": "q-5.1-2-v1",
          "question": "Why does grid = [[0] * 3] * 3 cause bugs when modifying grid[0][0] = 1?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because * 3 duplicates the reference to the same inner list, so all 3 rows share the same object in memory",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because 0 is immutable in Python",
                              "explanationIfWrong": "0 is immutable, but the bug is caused by shared inner list references."
                    },
                    {
                              "id": "C",
                              "text": "Because Python limits 2D matrices to 2 rows",
                              "explanationIfWrong": "There is no limit on row count."
                    },
                    {
                              "id": "D",
                              "text": "Because it raises an IndentationError",
                              "explanationIfWrong": "The code runs without error, producing a subtle memory reference bug."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Multiplying the outer list creates 3 references pointing to the single same inner list in memory."
},
        "retestMcq": {
          "id": "q-5.1-2-v2",
          "question": "What is the recommended, safe way to create a 3x3 matrix initialized with zeros?",
          "options": [
                    {
                              "id": "A",
                              "text": "[[0] * 3 for _ in range(3)]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[[0] * 3] * 3",
                              "explanationIfWrong": "This triggers the shared reference bug."
                    },
                    {
                              "id": "C",
                              "text": "list(0 * 3 * 3)",
                              "explanationIfWrong": "list() cannot be called on an integer."
                    },
                    {
                              "id": "D",
                              "text": "matrix(3, 3, 0)",
                              "explanationIfWrong": "There is no built-in matrix() function in Python."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The list comprehension constructs a brand new, independent inner list on each iteration of range(3)."
},
        "questionPool": [
          {
            "id": "q-5.1-2-v1",
            "question": "Why does grid = [[0] * 3] * 3 cause bugs when modifying grid[0][0] = 1?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because * 3 duplicates the reference to the same inner list, so all 3 rows share the same object in memory",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because 0 is immutable in Python",
                                    "explanationIfWrong": "0 is immutable, but the bug is caused by shared inner list references."
                        },
                        {
                                    "id": "C",
                                    "text": "Because Python limits 2D matrices to 2 rows",
                                    "explanationIfWrong": "There is no limit on row count."
                        },
                        {
                                    "id": "D",
                                    "text": "Because it raises an IndentationError",
                                    "explanationIfWrong": "The code runs without error, producing a subtle memory reference bug."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiplying the outer list creates 3 references pointing to the single same inner list in memory."
},
          {
            "id": "q-5.1-2-v2",
            "question": "What is the recommended, safe way to create a 3x3 matrix initialized with zeros?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[[0] * 3 for _ in range(3)]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[[0] * 3] * 3",
                                    "explanationIfWrong": "This triggers the shared reference bug."
                        },
                        {
                                    "id": "C",
                                    "text": "list(0 * 3 * 3)",
                                    "explanationIfWrong": "list() cannot be called on an integer."
                        },
                        {
                                    "id": "D",
                                    "text": "matrix(3, 3, 0)",
                                    "explanationIfWrong": "There is no built-in matrix() function in Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The list comprehension constructs a brand new, independent inner list on each iteration of range(3)."
},
          {
            "id": "q-5.1-2-v3",
            "question": "What does a is b evaluate to for row 0 and row 1 in bad = [[0]] * 2?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "True, because bad[0] and bad[1] refer to the exact same object in memory",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "False, because they are distinct rows",
                                    "explanationIfWrong": "* duplicates references, not objects."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "is returns a boolean."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "is is valid for any objects."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "bad[0] is bad[1] is True because both elements point to the same list."
}
        ]
      },
      {
        "heading": "Modifying 2D Grid Cells",
        "text": "Modifying an element in a properly initialized 2D list is done by direct assignment: grid[row][col] = new_value. Always verify that both row and col are within valid range bounds to prevent an IndexError.",
        "codeSnippet": "board = [\n    [\".\", \".\", \".\"],\n    [\".\", \".\", \".\"],\n    [\".\", \".\", \".\"]\n]\n\n# Place 'X' at center and 'O' at top-left\nboard[1][1] = \"X\"\nboard[0][0] = \"O\"\n\nfor r in board:\n    print(\" \".join(r))",
        "terminalOutput": "O . .\n. X .\n. . .",
        "mcq": {
          "id": "q-5.1-3-v1",
          "question": "In a 3x3 tic-tac-toe grid, which line places 'X' at the bottom-left corner?",
          "options": [
                    {
                              "id": "A",
                              "text": "grid[2][0] = 'X'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "grid[0][2] = 'X'",
                              "explanationIfWrong": "grid[0][2] is the top-right corner."
                    },
                    {
                              "id": "C",
                              "text": "grid[2][2] = 'X'",
                              "explanationIfWrong": "grid[2][2] is the bottom-right corner."
                    },
                    {
                              "id": "D",
                              "text": "grid[0][0] = 'X'",
                              "explanationIfWrong": "grid[0][0] is the top-left corner."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Bottom row is index 2; leftmost column is index 0 -> grid[2][0]."
},
        "retestMcq": {
          "id": "q-5.1-3-v2",
          "question": "How do you verify that coordinates (r, c) are valid inside a matrix m before accessing m[r][c]?",
          "options": [
                    {
                              "id": "A",
                              "text": "0 <= r < len(m) and 0 <= c < len(m[0])",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "r < len(m) or c < len(m[0])",
                              "explanationIfWrong": "Both row and column must be verified with 'and', including non-negative bounds."
                    },
                    {
                              "id": "C",
                              "text": "r <= len(m) and c <= len(m[0])",
                              "explanationIfWrong": "Using <= causes IndexError because indices stop at length - 1."
                    },
                    {
                              "id": "D",
                              "text": "m.contains(r, c)",
                              "explanationIfWrong": "Lists do not have a .contains() method."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "0 <= r < len(m) checks the row bound, and 0 <= c < len(m[0]) checks the column bound."
},
        "questionPool": [
          {
            "id": "q-5.1-3-v1",
            "question": "In a 3x3 tic-tac-toe grid, which line places 'X' at the bottom-left corner?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "grid[2][0] = 'X'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "grid[0][2] = 'X'",
                                    "explanationIfWrong": "grid[0][2] is the top-right corner."
                        },
                        {
                                    "id": "C",
                                    "text": "grid[2][2] = 'X'",
                                    "explanationIfWrong": "grid[2][2] is the bottom-right corner."
                        },
                        {
                                    "id": "D",
                                    "text": "grid[0][0] = 'X'",
                                    "explanationIfWrong": "grid[0][0] is the top-left corner."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Bottom row is index 2; leftmost column is index 0 -> grid[2][0]."
},
          {
            "id": "q-5.1-3-v2",
            "question": "How do you verify that coordinates (r, c) are valid inside a matrix m before accessing m[r][c]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "0 <= r < len(m) and 0 <= c < len(m[0])",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "r < len(m) or c < len(m[0])",
                                    "explanationIfWrong": "Both row and column must be verified with 'and', including non-negative bounds."
                        },
                        {
                                    "id": "C",
                                    "text": "r <= len(m) and c <= len(m[0])",
                                    "explanationIfWrong": "Using <= causes IndexError because indices stop at length - 1."
                        },
                        {
                                    "id": "D",
                                    "text": "m.contains(r, c)",
                                    "explanationIfWrong": "Lists do not have a .contains() method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "0 <= r < len(m) checks the row bound, and 0 <= c < len(m[0]) checks the column bound."
},
          {
            "id": "q-5.1-3-v3",
            "question": "What is the result of grid = [[1, 2], [3, 4]]; grid[0] = [9, 9]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[[9, 9], [3, 4]]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[[1, 2], [9, 9]]",
                                    "explanationIfWrong": "grid[0] is the first row, not the second."
                        },
                        {
                                    "id": "C",
                                    "text": "[[9, 2], [3, 4]]",
                                    "explanationIfWrong": "grid[0] = [9, 9] replaces the entire first row."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Reassigning a row is valid list item assignment."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Assigning to grid[0] replaces the entire row 0 with [9, 9]."
}
        ]
      },
      {
        "heading": "Copying 2D Lists: Shallow vs. Deep",
        "text": "A standard slice copy matrix[:] or matrix.copy() only creates a shallow copy: the outer list is new, but its elements are still references to the same inner row lists! To create a completely independent copy of a 2D list, use copy.deepcopy() from the copy module, or a list comprehension.",
        "codeSnippet": "import copy\n\noriginal = [[1, 2], [3, 4]]\nshallow = original.copy()\ndeep = copy.deepcopy(original)\n\noriginal[0][0] = 99\nprint(f\"Shallow affected: {shallow[0][0]}\")\nprint(f\"Deep unaffected: {deep[0][0]}\")",
        "terminalOutput": "Shallow affected: 99\nDeep unaffected: 1",
        "mcq": {
          "id": "q-5.1-4-v1",
          "question": "Why does shallow = matrix.copy() still allow changes in shallow[0][0] to affect matrix[0][0]?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because shallow copy only clones the outer list; the inner row lists are still shared by reference",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because integers are passed by reference",
                              "explanationIfWrong": "Integers are immutable; the inner list is the shared object."
                    },
                    {
                              "id": "C",
                              "text": "Because .copy() is broken in Python",
                              "explanationIfWrong": ".copy() behaves as a shallow copy by design."
                    },
                    {
                              "id": "D",
                              "text": "Because 2D lists cannot be copied",
                              "explanationIfWrong": "They can be copied using deepcopy."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A shallow copy copies the container, not the nested objects inside it. Both outer lists point to the same row lists."
},
        "retestMcq": {
          "id": "q-5.1-4-v2",
          "question": "Which function from the Python standard library creates a completely independent copy of nested data structures?",
          "options": [
                    {
                              "id": "A",
                              "text": "copy.deepcopy()",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "copy.shallow()",
                              "explanationIfWrong": "copy.copy() is shallow; deepcopy() recursively clones nested structures."
                    },
                    {
                              "id": "C",
                              "text": "clone()",
                              "explanationIfWrong": "There is no built-in clone() function."
                    },
                    {
                              "id": "D",
                              "text": "list.duplicate()",
                              "explanationIfWrong": "Lists do not have a duplicate method."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "copy.deepcopy() recursively copies all nested containers and objects."
},
        "questionPool": [
          {
            "id": "q-5.1-4-v1",
            "question": "Why does shallow = matrix.copy() still allow changes in shallow[0][0] to affect matrix[0][0]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because shallow copy only clones the outer list; the inner row lists are still shared by reference",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because integers are passed by reference",
                                    "explanationIfWrong": "Integers are immutable; the inner list is the shared object."
                        },
                        {
                                    "id": "C",
                                    "text": "Because .copy() is broken in Python",
                                    "explanationIfWrong": ".copy() behaves as a shallow copy by design."
                        },
                        {
                                    "id": "D",
                                    "text": "Because 2D lists cannot be copied",
                                    "explanationIfWrong": "They can be copied using deepcopy."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A shallow copy copies the container, not the nested objects inside it. Both outer lists point to the same row lists."
},
          {
            "id": "q-5.1-4-v2",
            "question": "Which function from the Python standard library creates a completely independent copy of nested data structures?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "copy.deepcopy()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "copy.shallow()",
                                    "explanationIfWrong": "copy.copy() is shallow; deepcopy() recursively clones nested structures."
                        },
                        {
                                    "id": "C",
                                    "text": "clone()",
                                    "explanationIfWrong": "There is no built-in clone() function."
                        },
                        {
                                    "id": "D",
                                    "text": "list.duplicate()",
                                    "explanationIfWrong": "Lists do not have a duplicate method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "copy.deepcopy() recursively copies all nested containers and objects."
},
          {
            "id": "q-5.1-4-v3",
            "question": "How can you deep-copy a 2D list matrix using a list comprehension without importing the copy module?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[row[:] for row in matrix]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[row for row in matrix]",
                                    "explanationIfWrong": "This still references the same inner row objects."
                        },
                        {
                                    "id": "C",
                                    "text": "matrix[:][:]",
                                    "explanationIfWrong": "matrix[:][:] simply slices the outer list twice, remaining shallow."
                        },
                        {
                                    "id": "D",
                                    "text": "[matrix]",
                                    "explanationIfWrong": "This wraps the matrix in another list."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "row[:] creates a fresh copy of each inner row list, producing an independent 2D matrix."
}
        ]
      },
      {
        "heading": "Grid Algorithms: Row, Column & Block Checks",
        "text": "Grid validation algorithms (such as in Sudoku or game boards) verify that rows, columns, or sub-grids contain no duplicates. A row check simply checks row for duplicates; a column check collects column elements into a list; a 3x3 block check slices a range of rows and columns.",
        "codeSnippet": "def row_has_duplicates(row):\n    seen = []\n    for val in row:\n        if val != 0 and val in seen:\n            return True\n        seen.append(val)\n    return False\n\nprint(row_has_duplicates([1, 2, 3, 4]))     # False\nprint(row_has_duplicates([1, 2, 3, 2]))     # True",
        "terminalOutput": "False\nTrue",
        "mcq": {
          "id": "q-5.1-5-v1",
          "question": "In a 9x9 Sudoku board, how many total 3x3 sub-grids are there?",
          "options": [
                    {
                              "id": "A",
                              "text": "9",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "3",
                              "explanationIfWrong": "There are 3 blocks horizontally and 3 vertically: 3 * 3 = 9."
                    },
                    {
                              "id": "C",
                              "text": "27",
                              "explanationIfWrong": "9 rows * 9 cols = 81 cells / 9 cells per block = 9 blocks."
                    },
                    {
                              "id": "D",
                              "text": "81",
                              "explanationIfWrong": "81 is the number of individual cells, not 3x3 blocks."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A 9x9 Sudoku board divides into a 3x3 arrangement of 9 sub-grids."
},
        "retestMcq": {
          "id": "q-5.1-5-v2",
          "question": "Which loop collects all elements in column col_idx from a 2D matrix m into a list?",
          "options": [
                    {
                              "id": "A",
                              "text": "col = [m[r][col_idx] for r in range(len(m))]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "col = m[col_idx]",
                              "explanationIfWrong": "m[col_idx] extracts a row, not a column."
                    },
                    {
                              "id": "C",
                              "text": "col = [m[col_idx][r] for r in range(len(m))]",
                              "explanationIfWrong": "This swaps row and column indices."
                    },
                    {
                              "id": "D",
                              "text": "col = m[:, col_idx]",
                              "explanationIfWrong": "This syntax requires third-party NumPy, invalid in standard Python."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Iterating over every row r and reading m[r][col_idx] constructs the column list."
},
        "questionPool": [
          {
            "id": "q-5.1-5-v1",
            "question": "In a 9x9 Sudoku board, how many total 3x3 sub-grids are there?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "9",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3",
                                    "explanationIfWrong": "There are 3 blocks horizontally and 3 vertically: 3 * 3 = 9."
                        },
                        {
                                    "id": "C",
                                    "text": "27",
                                    "explanationIfWrong": "9 rows * 9 cols = 81 cells / 9 cells per block = 9 blocks."
                        },
                        {
                                    "id": "D",
                                    "text": "81",
                                    "explanationIfWrong": "81 is the number of individual cells, not 3x3 blocks."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A 9x9 Sudoku board divides into a 3x3 arrangement of 9 sub-grids."
},
          {
            "id": "q-5.1-5-v2",
            "question": "Which loop collects all elements in column col_idx from a 2D matrix m into a list?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "col = [m[r][col_idx] for r in range(len(m))]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "col = m[col_idx]",
                                    "explanationIfWrong": "m[col_idx] extracts a row, not a column."
                        },
                        {
                                    "id": "C",
                                    "text": "col = [m[col_idx][r] for r in range(len(m))]",
                                    "explanationIfWrong": "This swaps row and column indices."
                        },
                        {
                                    "id": "D",
                                    "text": "col = m[:, col_idx]",
                                    "explanationIfWrong": "This syntax requires third-party NumPy, invalid in standard Python."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iterating over every row r and reading m[r][col_idx] constructs the column list."
},
          {
            "id": "q-5.1-5-v3",
            "question": "How can you quickly test if a list of numbers numbers contains any duplicate values?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "len(numbers) != len(set(numbers))",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "sum(numbers) == 0",
                                    "explanationIfWrong": "Sum has no relation to duplicates."
                        },
                        {
                                    "id": "C",
                                    "text": "numbers.duplicates()",
                                    "explanationIfWrong": "Lists have no .duplicates() method."
                        },
                        {
                                    "id": "D",
                                    "text": "max(numbers) == min(numbers)",
                                    "explanationIfWrong": "This only tests if all elements are identical."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Converting to a set removes duplicates. If length shrinks, duplicates were present."
}
        ]
      }
    ]
  },
  {
    "id": "5-2-references-and-memory",
    "number": "5.2",
    "title": "References & Memory Mechanics",
    "subtitle": "Understand Python variables as references, object identity, the id() function, and mutability side effects.",
    "readTime": "20 min",
    "objectives": [
      "Understand that Python variables are names referencing objects in memory",
      "Differentiate value equality (==) from object identity (is)",
      "Inspect memory addresses using the built-in id() function",
      "Recognize mutable vs immutable data types in Python",
      "Prevent accidental mutation bugs caused by variable aliasing",
      "Write pure functions that avoid mutating arguments unexpectedly"
],
    "theoryBlocks": [
      {
        "heading": "Variables as References",
        "text": "In Python, variables do not store values directly; they store references (memory addresses) pointing to objects. When you write b = a, you do not copy the object; you simply attach a second label (an alias) pointing to the same object in memory.",
        "codeSnippet": "list1 = [1, 2, 3]\nlist2 = list1  # list2 references the exact same list\n\nlist2.append(4)\nprint(f\"list1: {list1}\")\nprint(f\"list2: {list2}\")",
        "terminalOutput": "list1: [1, 2, 3, 4]\nlist2: [1, 2, 3, 4]",
        "tip": "Think of variables as name tags pinned onto objects, not boxes containing values.",
        "mcq": {
          "id": "q-5.2-0-v1",
          "question": "When you execute b = a where a is a list, what happens in memory?",
          "options": [
                    {
                              "id": "A",
                              "text": "b is assigned a reference pointing to the exact same list object as a",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python creates a duplicate copy of the list at a new memory address",
                              "explanationIfWrong": "Assignment never copies objects in Python."
                    },
                    {
                              "id": "C",
                              "text": "a is deleted and replaced by b",
                              "explanationIfWrong": "Both names coexist pointing to the same object."
                    },
                    {
                              "id": "D",
                              "text": "b is converted to an immutable tuple",
                              "explanationIfWrong": "The type is unchanged."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, assignment binds a name to an existing object reference without copying."
},
        "retestMcq": {
          "id": "q-5.2-0-v2",
          "question": "What is an alias in Python programming?",
          "options": [
                    {
                              "id": "A",
                              "text": "Multiple variable names that refer to the exact same object in memory",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A function that has no return statement",
                              "explanationIfWrong": "That is a void/fruitless function."
                    },
                    {
                              "id": "C",
                              "text": "A syntax error caused by misspelled variables",
                              "explanationIfWrong": "Misspelled names cause NameError."
                    },
                    {
                              "id": "D",
                              "text": "A private variable inside a class",
                              "explanationIfWrong": "Aliasing refers to shared object references."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Aliasing occurs when two or more variables point to the same memory location."
},
        "questionPool": [
          {
            "id": "q-5.2-0-v1",
            "question": "When you execute b = a where a is a list, what happens in memory?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "b is assigned a reference pointing to the exact same list object as a",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python creates a duplicate copy of the list at a new memory address",
                                    "explanationIfWrong": "Assignment never copies objects in Python."
                        },
                        {
                                    "id": "C",
                                    "text": "a is deleted and replaced by b",
                                    "explanationIfWrong": "Both names coexist pointing to the same object."
                        },
                        {
                                    "id": "D",
                                    "text": "b is converted to an immutable tuple",
                                    "explanationIfWrong": "The type is unchanged."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, assignment binds a name to an existing object reference without copying."
},
          {
            "id": "q-5.2-0-v2",
            "question": "What is an alias in Python programming?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Multiple variable names that refer to the exact same object in memory",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A function that has no return statement",
                                    "explanationIfWrong": "That is a void/fruitless function."
                        },
                        {
                                    "id": "C",
                                    "text": "A syntax error caused by misspelled variables",
                                    "explanationIfWrong": "Misspelled names cause NameError."
                        },
                        {
                                    "id": "D",
                                    "text": "A private variable inside a class",
                                    "explanationIfWrong": "Aliasing refers to shared object references."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Aliasing occurs when two or more variables point to the same memory location."
},
          {
            "id": "q-5.2-0-v3",
            "question": "What is printed by:\n\nx = [10]\ny = x\nx = [20]\nprint(y)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[10]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[20]",
                                    "explanationIfWrong": "Reassigning x = [20] binds x to a new list, leaving y pointing to [10]."
                        },
                        {
                                    "id": "C",
                                    "text": "[10, 20]",
                                    "explanationIfWrong": "No appending occurred."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "y retains its reference to [10]."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Reassigning x = [20] creates a new list for x. y continues to point to the original [10]."
}
        ]
      },
      {
        "heading": "Object Identity vs. Equality: is vs ==",
        "text": "The == operator checks value equality (whether two objects have the same content). The is operator checks object identity (whether two variables point to the exact same memory address). Two distinct objects can be equal (==) without being identical (is).",
        "codeSnippet": "a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)  # True: identical contents\nprint(a is b)  # False: two separate objects in memory!\nprint(a is c)  # True: same memory address!",
        "terminalOutput": "True\nFalse\nTrue",
        "mcq": {
          "id": "q-5.2-1-v1",
          "question": "What does the expression x is y check in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "Whether x and y refer to the exact same object in memory (id(x) == id(y))",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Whether x and y have the same string length",
                              "explanationIfWrong": "Length is checked with len(x) == len(y)."
                    },
                    {
                              "id": "C",
                              "text": "Whether x and y have the same data type",
                              "explanationIfWrong": "Type is checked with type(x) is type(y) or isinstance()."
                    },
                    {
                              "id": "D",
                              "text": "Whether x is smaller than y",
                              "explanationIfWrong": "Comparison is done with <."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "is tests identity (memory address), while == tests value equality."
},
        "retestMcq": {
          "id": "q-5.2-1-v2",
          "question": "Why is if val is None: preferred over if val == None: in idiomatic Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "None is a unique singleton in Python, and is checks identity directly without invoking __eq__()",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "== None raises a SyntaxError in Python 3",
                              "explanationIfWrong": "== None is valid syntax, but PEP 8 mandates is None."
                    },
                    {
                              "id": "C",
                              "text": "is None is slower than == None",
                              "explanationIfWrong": "is None is faster because it does a pointer comparison."
                    },
                    {
                              "id": "D",
                              "text": "None cannot be compared with ==",
                              "explanationIfWrong": "It can, but custom __eq__ methods could override it."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "PEP 8 specifies that comparisons to singletons like None should always be done with is or is not."
},
        "questionPool": [
          {
            "id": "q-5.2-1-v1",
            "question": "What does the expression x is y check in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Whether x and y refer to the exact same object in memory (id(x) == id(y))",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Whether x and y have the same string length",
                                    "explanationIfWrong": "Length is checked with len(x) == len(y)."
                        },
                        {
                                    "id": "C",
                                    "text": "Whether x and y have the same data type",
                                    "explanationIfWrong": "Type is checked with type(x) is type(y) or isinstance()."
                        },
                        {
                                    "id": "D",
                                    "text": "Whether x is smaller than y",
                                    "explanationIfWrong": "Comparison is done with <."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "is tests identity (memory address), while == tests value equality."
},
          {
            "id": "q-5.2-1-v2",
            "question": "Why is if val is None: preferred over if val == None: in idiomatic Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "None is a unique singleton in Python, and is checks identity directly without invoking __eq__()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "== None raises a SyntaxError in Python 3",
                                    "explanationIfWrong": "== None is valid syntax, but PEP 8 mandates is None."
                        },
                        {
                                    "id": "C",
                                    "text": "is None is slower than == None",
                                    "explanationIfWrong": "is None is faster because it does a pointer comparison."
                        },
                        {
                                    "id": "D",
                                    "text": "None cannot be compared with ==",
                                    "explanationIfWrong": "It can, but custom __eq__ methods could override it."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 specifies that comparisons to singletons like None should always be done with is or is not."
},
          {
            "id": "q-5.2-1-v3",
            "question": "What is the result of [1, 2] is [1, 2]?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "False",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "True",
                                    "explanationIfWrong": "Each literal [1, 2] allocates a distinct list object in memory."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError",
                                    "explanationIfWrong": "is is valid on any objects."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "is evaluates to a boolean."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Evaluating [1, 2] twice creates two separate list instances in memory, so is evaluates to False."
}
        ]
      },
      {
        "heading": "The id() Function",
        "text": "The built-in id() function returns the unique integer identity of an object, which corresponds to its memory address in CPython. If id(a) == id(b), then a is b is True.",
        "codeSnippet": "x = [5, 10]\ny = x\nz = [5, 10]\n\nprint(f\"id(x): {id(x)}\")\nprint(f\"id(y): {id(y)} (matches x)\")\nprint(f\"id(z): {id(z)} (different!)\")",
        "terminalOutput": "id(x): 2145892345024\nid(y): 2145892345024 (matches x)\nid(z): 2145892345664 (different!)",
        "mcq": {
          "id": "q-5.2-2-v1",
          "question": "What does the id(obj) function return in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "An integer representing the unique identity (memory address) of the object",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The variable name as a string",
                              "explanationIfWrong": "id() returns an integer, not a string."
                    },
                    {
                              "id": "C",
                              "text": "The byte size of the object in RAM",
                              "explanationIfWrong": "Size is returned by sys.getsizeof()."
                    },
                    {
                              "id": "D",
                              "text": "The hash value of the object",
                              "explanationIfWrong": "Hash is returned by hash()."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "id() returns an integer guaranteed to be unique and constant for the object during its lifetime."
},
        "retestMcq": {
          "id": "q-5.2-2-v2",
          "question": "If id(x) == id(y) is True, what can you definitively conclude?",
          "options": [
                    {
                              "id": "A",
                              "text": "x is y is True; both variables refer to the exact same object",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "x and y have the same value but are in different memory spots",
                              "explanationIfWrong": "Equal id means the exact same memory location."
                    },
                    {
                              "id": "C",
                              "text": "x and y are both strings",
                              "explanationIfWrong": "Any object type has an id."
                    },
                    {
                              "id": "D",
                              "text": "x and y are both equal to 0",
                              "explanationIfWrong": "id() does not test numeric equality."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "id() reflects memory address; identical IDs mean identical object references."
},
        "questionPool": [
          {
            "id": "q-5.2-2-v1",
            "question": "What does the id(obj) function return in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "An integer representing the unique identity (memory address) of the object",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The variable name as a string",
                                    "explanationIfWrong": "id() returns an integer, not a string."
                        },
                        {
                                    "id": "C",
                                    "text": "The byte size of the object in RAM",
                                    "explanationIfWrong": "Size is returned by sys.getsizeof()."
                        },
                        {
                                    "id": "D",
                                    "text": "The hash value of the object",
                                    "explanationIfWrong": "Hash is returned by hash()."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "id() returns an integer guaranteed to be unique and constant for the object during its lifetime."
},
          {
            "id": "q-5.2-2-v2",
            "question": "If id(x) == id(y) is True, what can you definitively conclude?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "x is y is True; both variables refer to the exact same object",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "x and y have the same value but are in different memory spots",
                                    "explanationIfWrong": "Equal id means the exact same memory location."
                        },
                        {
                                    "id": "C",
                                    "text": "x and y are both strings",
                                    "explanationIfWrong": "Any object type has an id."
                        },
                        {
                                    "id": "D",
                                    "text": "x and y are both equal to 0",
                                    "explanationIfWrong": "id() does not test numeric equality."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "id() reflects memory address; identical IDs mean identical object references."
},
          {
            "id": "q-5.2-2-v3",
            "question": "Can the id() of an object change while the object remains alive in memory?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, an object's id is guaranteed to remain constant throughout its lifetime",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, whenever you append an item to it",
                                    "explanationIfWrong": "Mutating a list modifies it in-place without changing its id."
                        },
                        {
                                    "id": "C",
                                    "text": "Yes, every time garbage collection runs",
                                    "explanationIfWrong": "CPython does not move objects during their lifetime."
                        },
                        {
                                    "id": "D",
                                    "text": "Only for integers larger than 256",
                                    "explanationIfWrong": "Object ID is immutable during object life."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Python guarantees that an object's identity remains fixed from creation until destruction."
}
        ]
      },
      {
        "heading": "Mutable vs. Immutable Types",
        "text": "Data types in Python are either mutable (can be changed in-place) or immutable (cannot be changed after creation). Strings, integers, floats, booleans, and tuples are immutable. Lists, dictionaries, and sets are mutable.",
        "codeSnippet": "# Immutable: creating 'new' string\ns = \"hello\"\n# s[0] = 'H'  # TypeError!\ns = s.upper()  # Rebinds s to a brand new string 'HELLO'\n\n# Mutable: modifying in-place\nlst = [1, 2]\nlst.append(3)  # Modifies existing list object directly",
        "terminalOutput": "HELLO\n[1, 2, 3]",
        "mcq": {
          "id": "q-5.2-3-v1",
          "question": "Which of the following is an IMMUTABLE data type in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "tuple",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "list",
                              "explanationIfWrong": "Lists are mutable."
                    },
                    {
                              "id": "C",
                              "text": "dict",
                              "explanationIfWrong": "Dictionaries are mutable."
                    },
                    {
                              "id": "D",
                              "text": "set",
                              "explanationIfWrong": "Sets are mutable."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Tuples are immutable sequences; once created, their elements cannot be changed or reordered."
},
        "retestMcq": {
          "id": "q-5.2-3-v2",
          "question": "What happens in memory when you execute an integer increment x = x + 1?",
          "options": [
                    {
                              "id": "A",
                              "text": "A new integer object is created and x is rebound to reference it, because ints are immutable",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The existing integer object is modified in-place in memory",
                              "explanationIfWrong": "Integers are immutable; they can never be modified in-place."
                    },
                    {
                              "id": "C",
                              "text": "x is converted into a float",
                              "explanationIfWrong": "Adding an int to an int produces an int."
                    },
                    {
                              "id": "D",
                              "text": "A TypeError is raised",
                              "explanationIfWrong": "Rebinding is normal Python behavior."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because integers are immutable, x + 1 creates a new int object and binds x to the new address."
},
        "questionPool": [
          {
            "id": "q-5.2-3-v1",
            "question": "Which of the following is an IMMUTABLE data type in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "tuple",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "list",
                                    "explanationIfWrong": "Lists are mutable."
                        },
                        {
                                    "id": "C",
                                    "text": "dict",
                                    "explanationIfWrong": "Dictionaries are mutable."
                        },
                        {
                                    "id": "D",
                                    "text": "set",
                                    "explanationIfWrong": "Sets are mutable."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Tuples are immutable sequences; once created, their elements cannot be changed or reordered."
},
          {
            "id": "q-5.2-3-v2",
            "question": "What happens in memory when you execute an integer increment x = x + 1?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A new integer object is created and x is rebound to reference it, because ints are immutable",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The existing integer object is modified in-place in memory",
                                    "explanationIfWrong": "Integers are immutable; they can never be modified in-place."
                        },
                        {
                                    "id": "C",
                                    "text": "x is converted into a float",
                                    "explanationIfWrong": "Adding an int to an int produces an int."
                        },
                        {
                                    "id": "D",
                                    "text": "A TypeError is raised",
                                    "explanationIfWrong": "Rebinding is normal Python behavior."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because integers are immutable, x + 1 creates a new int object and binds x to the new address."
},
          {
            "id": "q-5.2-3-v3",
            "question": "Which of the following types can be safely used as a dictionary key or set element?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Immutable types like int, str, and tuple",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Mutable types like list and dict",
                                    "explanationIfWrong": "Lists and dicts are unhashable and cannot be dict keys."
                        },
                        {
                                    "id": "C",
                                    "text": "Only boolean values",
                                    "explanationIfWrong": "Any hashable (immutable) type can be a key."
                        },
                        {
                                    "id": "D",
                                    "text": "Any data type without restriction",
                                    "explanationIfWrong": "Keys must be hashable."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dictionary keys must be hashable, which requires them to be immutable."
}
        ]
      },
      {
        "heading": "Function Arguments and Mutation Side Effects",
        "text": "When you pass a mutable object (like a list) to a function, any mutations performed inside the function persist outside. If a function is expected to return a modified result without altering the original, it should make a copy first.",
        "codeSnippet": "def pure_double(items):\n    # Pure function: does not mutate argument\n    return [x * 2 for x in items]\n\nnums = [1, 2, 3]\nresult = pure_double(nums)\nprint(f\"Original untouched: {nums}\")\nprint(f\"Result: {result}\")",
        "terminalOutput": "Original untouched: [1, 2, 3]\nResult: [2, 4, 6]",
        "tip": "A function that has no side effects and returns the same output for the same input is called a pure function.",
        "mcq": {
          "id": "q-5.2-4-v1",
          "question": "What is a side effect in Python function execution?",
          "options": [
                    {
                              "id": "A",
                              "text": "When a function modifies an external state, such as mutating a passed list or writing to a file",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "When a function takes longer than 1 second to run",
                              "explanationIfWrong": "Execution time is performance, not a side effect."
                    },
                    {
                              "id": "C",
                              "text": "When a function returns None",
                              "explanationIfWrong": "Returning None is normal function behavior."
                    },
                    {
                              "id": "D",
                              "text": "When a function has type hints",
                              "explanationIfWrong": "Type hints are annotations."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A side effect is any observable change outside the function's local scope, such as mutating caller data."
},
        "retestMcq": {
          "id": "q-5.2-4-v2",
          "question": "What will be printed by:\n\ndef clear_it(data):\n    data.clear()\n\nvals = [1, 2, 3]\nclear_it(vals)\nprint(vals)",
          "options": [
                    {
                              "id": "A",
                              "text": "[]",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "[1, 2, 3]",
                              "explanationIfWrong": "data.clear() mutates the caller's list in place."
                    },
                    {
                              "id": "C",
                              "text": "None",
                              "explanationIfWrong": "vals is still a list, but now empty: []."
                    },
                    {
                              "id": "D",
                              "text": "TypeError",
                              "explanationIfWrong": "clear() is a valid list method."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "data.clear() modifies the referenced list directly, emptying vals to []."
},
        "questionPool": [
          {
            "id": "q-5.2-4-v1",
            "question": "What is a side effect in Python function execution?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "When a function modifies an external state, such as mutating a passed list or writing to a file",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "When a function takes longer than 1 second to run",
                                    "explanationIfWrong": "Execution time is performance, not a side effect."
                        },
                        {
                                    "id": "C",
                                    "text": "When a function returns None",
                                    "explanationIfWrong": "Returning None is normal function behavior."
                        },
                        {
                                    "id": "D",
                                    "text": "When a function has type hints",
                                    "explanationIfWrong": "Type hints are annotations."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A side effect is any observable change outside the function's local scope, such as mutating caller data."
},
          {
            "id": "q-5.2-4-v2",
            "question": "What will be printed by:\n\ndef clear_it(data):\n    data.clear()\n\nvals = [1, 2, 3]\nclear_it(vals)\nprint(vals)",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[]",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "[1, 2, 3]",
                                    "explanationIfWrong": "data.clear() mutates the caller's list in place."
                        },
                        {
                                    "id": "C",
                                    "text": "None",
                                    "explanationIfWrong": "vals is still a list, but now empty: []."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "clear() is a valid list method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "data.clear() modifies the referenced list directly, emptying vals to []."
},
          {
            "id": "q-5.2-4-v3",
            "question": "How should a function be written to sort numbers without altering the caller's original list?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Use return sorted(numbers)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Use numbers.sort(); return numbers",
                                    "explanationIfWrong": "numbers.sort() mutates the caller's original list."
                        },
                        {
                                    "id": "C",
                                    "text": "Use del numbers[:]",
                                    "explanationIfWrong": "This deletes all elements from the caller's list."
                        },
                        {
                                    "id": "D",
                                    "text": "Use numbers.reverse()",
                                    "explanationIfWrong": "reverse() also mutates in-place."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "sorted() creates and returns a brand-new sorted list, preserving the original untouched."
}
        ]
      },
      {
        "heading": "Garbage Collection & Object Lifetimes",
        "text": "Python manages memory automatically using reference counting combined with a cyclic garbage collector. When no variables reference an object (its reference count drops to zero), Python deallocates its memory immediately.",
        "codeSnippet": "a = [1, 2, 3]  # Reference count is 1\nb = a          # Reference count is 2\ndel a          # Reference count drops to 1 (b still exists)\ndel b          # Reference count drops to 0 -> memory deallocated!",
        "mcq": {
          "id": "q-5.2-5-v1",
          "question": "When does Python automatically free the memory used by an object?",
          "options": [
                    {
                              "id": "A",
                              "text": "When there are no more active references pointing to that object (reference count is 0)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Only when the user closes their computer",
                              "explanationIfWrong": "Python deallocates memory continuously while running."
                    },
                    {
                              "id": "C",
                              "text": "At midnight every day",
                              "explanationIfWrong": "Garbage collection is real-time."
                    },
                    {
                              "id": "D",
                              "text": "When the file exceeds 1 MB",
                              "explanationIfWrong": "Memory management is reference-driven."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "When an object's reference count drops to zero, Python immediately reclaims its memory."
},
        "retestMcq": {
          "id": "q-5.2-5-v2",
          "question": "What does the del x statement do in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "It deletes the variable name x and decrements the reference count of the object it pointed to",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It forcefully deletes the object from RAM even if other variables point to it",
                              "explanationIfWrong": "del unbinds the name; the object persists if other references remain."
                    },
                    {
                              "id": "C",
                              "text": "It sets x = 0",
                              "explanationIfWrong": "del removes the variable name entirely from scope."
                    },
                    {
                              "id": "D",
                              "text": "It formats the hard drive",
                              "explanationIfWrong": "del is standard variable unbinding."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "del removes the name binding and decrements the target object's reference count."
},
        "questionPool": [
          {
            "id": "q-5.2-5-v1",
            "question": "When does Python automatically free the memory used by an object?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "When there are no more active references pointing to that object (reference count is 0)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Only when the user closes their computer",
                                    "explanationIfWrong": "Python deallocates memory continuously while running."
                        },
                        {
                                    "id": "C",
                                    "text": "At midnight every day",
                                    "explanationIfWrong": "Garbage collection is real-time."
                        },
                        {
                                    "id": "D",
                                    "text": "When the file exceeds 1 MB",
                                    "explanationIfWrong": "Memory management is reference-driven."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "When an object's reference count drops to zero, Python immediately reclaims its memory."
},
          {
            "id": "q-5.2-5-v2",
            "question": "What does the del x statement do in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It deletes the variable name x and decrements the reference count of the object it pointed to",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It forcefully deletes the object from RAM even if other variables point to it",
                                    "explanationIfWrong": "del unbinds the name; the object persists if other references remain."
                        },
                        {
                                    "id": "C",
                                    "text": "It sets x = 0",
                                    "explanationIfWrong": "del removes the variable name entirely from scope."
                        },
                        {
                                    "id": "D",
                                    "text": "It formats the hard drive",
                                    "explanationIfWrong": "del is standard variable unbinding."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "del removes the name binding and decrements the target object's reference count."
},
          {
            "id": "q-5.2-5-v3",
            "question": "Which Python module provides tools to inspect or manually trigger garbage collection?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "gc",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "memory",
                                    "explanationIfWrong": "The module is named gc (Garbage Collector)."
                        },
                        {
                                    "id": "C",
                                    "text": "clean",
                                    "explanationIfWrong": "The standard library module is gc."
                        },
                        {
                                    "id": "D",
                                    "text": "sysmem",
                                    "explanationIfWrong": "gc is the standard module."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "import gc provides the interface to Python's cyclic garbage collector."
}
        ]
      }
    ]
  },
  {
    "id": "5-3-dictionary-basics",
    "number": "5.3",
    "title": "Dictionary Fundamentals",
    "subtitle": "Store, search, and update key-value pairs using Python dictionaries, dict methods, and key lookups.",
    "readTime": "20 min",
    "objectives": [
      "Create dictionaries using curly braces {key: value} and dict()",
      "Access values by key and prevent KeyError using .get()",
      "Add, update, and remove key-value entries in dictionaries",
      "Iterate over keys, values, and (key, value) pairs with .items()",
      "Check for key existence using the in operator",
      "Understand why dictionary lookups are O(1) constant time"
],
    "theoryBlocks": [
      {
        "heading": "Dictionary Syntax & Key-Value Pairs",
        "text": "A dictionary is an unordered (ordered by insertion since Python 3.7) collection of key-value pairs. Each key is separated from its value by a colon :, and pairs are separated by commas inside curly braces {}. Keys must be immutable and unique.",
        "codeSnippet": "capitals = {\n    \"Finland\": \"Helsinki\",\n    \"Sweden\": \"Stockholm\",\n    \"Norway\": \"Oslo\"\n}\n\nprint(capitals[\"Finland\"])\nprint(f\"Total countries: {len(capitals)}\")",
        "terminalOutput": "Helsinki\nTotal countries: 3",
        "tip": "Keys in a dictionary must be immutable (strings, numbers, tuples). Values can be any data type.",
        "mcq": {
          "id": "q-5.3-0-v1",
          "question": "What is printed by person = {'name': 'Ada', 'age': 25}; print(person['name'])?",
          "options": [
                    {
                              "id": "A",
                              "text": "'Ada'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "'name'",
                              "explanationIfWrong": "Indexing by key returns the associated value."
                    },
                    {
                              "id": "C",
                              "text": "25",
                              "explanationIfWrong": "Key 'name' maps to 'Ada'."
                    },
                    {
                              "id": "D",
                              "text": "KeyError",
                              "explanationIfWrong": "'name' is a valid existing key."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Looking up person['name'] retrieves the value associated with the key 'name', which is 'Ada'."
},
        "retestMcq": {
          "id": "q-5.3-0-v2",
          "question": "What happens if you define a dictionary with duplicate keys, e.g. d = {'a': 1, 'a': 2}?",
          "options": [
                    {
                              "id": "A",
                              "text": "The later value overwrites the earlier value, resulting in {'a': 2}",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python raises a DuplicateKeyError",
                              "explanationIfWrong": "Python allows duplicate key declarations in literals, keeping the last one."
                    },
                    {
                              "id": "C",
                              "text": "Both values are kept in a list: {'a': [1, 2]}",
                              "explanationIfWrong": "Keys must map to a single value; later assignments overwrite."
                    },
                    {
                              "id": "D",
                              "text": "The dictionary becomes empty",
                              "explanationIfWrong": "The last value is retained."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dictionary keys must be unique; assigning to an existing key updates its value."
},
        "questionPool": [
          {
            "id": "q-5.3-0-v1",
            "question": "What is printed by person = {'name': 'Ada', 'age': 25}; print(person['name'])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "'Ada'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'name'",
                                    "explanationIfWrong": "Indexing by key returns the associated value."
                        },
                        {
                                    "id": "C",
                                    "text": "25",
                                    "explanationIfWrong": "Key 'name' maps to 'Ada'."
                        },
                        {
                                    "id": "D",
                                    "text": "KeyError",
                                    "explanationIfWrong": "'name' is a valid existing key."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Looking up person['name'] retrieves the value associated with the key 'name', which is 'Ada'."
},
          {
            "id": "q-5.3-0-v2",
            "question": "What happens if you define a dictionary with duplicate keys, e.g. d = {'a': 1, 'a': 2}?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The later value overwrites the earlier value, resulting in {'a': 2}",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python raises a DuplicateKeyError",
                                    "explanationIfWrong": "Python allows duplicate key declarations in literals, keeping the last one."
                        },
                        {
                                    "id": "C",
                                    "text": "Both values are kept in a list: {'a': [1, 2]}",
                                    "explanationIfWrong": "Keys must map to a single value; later assignments overwrite."
                        },
                        {
                                    "id": "D",
                                    "text": "The dictionary becomes empty",
                                    "explanationIfWrong": "The last value is retained."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dictionary keys must be unique; assigning to an existing key updates its value."
},
          {
            "id": "q-5.3-0-v3",
            "question": "Which of the following CANNOT be used as a dictionary key in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "[1, 2] (a list)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "'id' (a string)",
                                    "explanationIfWrong": "Strings are immutable and valid keys."
                        },
                        {
                                    "id": "C",
                                    "text": "(1, 2) (a tuple of numbers)",
                                    "explanationIfWrong": "Tuples containing immutable items are valid keys."
                        },
                        {
                                    "id": "D",
                                    "text": "42 (an integer)",
                                    "explanationIfWrong": "Integers are immutable and valid keys."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Lists are mutable and therefore unhashable. Attempting to use a list as a dict key raises TypeError: unhashable type: 'list'."
}
        ]
      },
      {
        "heading": "Accessing Values: [] vs. .get()",
        "text": "Accessing a non-existent key using square brackets d[key] raises a KeyError, crashing the program. The .get(key, default) method safely retrieves a value, returning None (or a specified default value) if the key is not found.",
        "codeSnippet": "phonebook = {\"Alice\": \"555-1234\"}\n\n# Safe lookup with .get():\nprint(phonebook.get(\"Alice\"))          # \"555-1234\"\nprint(phonebook.get(\"Bob\"))            # None\nprint(phonebook.get(\"Bob\", \"Unknown\")) # \"Unknown\"",
        "terminalOutput": "555-1234\nNone\nUnknown",
        "mcq": {
          "id": "q-5.3-1-v1",
          "question": "What happens when you run d = {'x': 10}; print(d['y'])?",
          "options": [
                    {
                              "id": "A",
                              "text": "KeyError: 'y'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "None",
                              "explanationIfWrong": "Square bracket syntax raises KeyError; use .get('y') to receive None."
                    },
                    {
                              "id": "C",
                              "text": "0",
                              "explanationIfWrong": "Python does not default to 0 for missing keys."
                    },
                    {
                              "id": "D",
                              "text": "IndexError",
                              "explanationIfWrong": "Dictionaries raise KeyError, not IndexError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Accessing a missing key with d[key] always raises a KeyError."
},
        "retestMcq": {
          "id": "q-5.3-1-v2",
          "question": "What is returned by scores.get('Math', 0) if 'Math' is not in scores?",
          "options": [
                    {
                              "id": "A",
                              "text": "0",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "None",
                              "explanationIfWrong": "0 was explicitly passed as the fallback default argument."
                    },
                    {
                              "id": "C",
                              "text": "KeyError",
                              "explanationIfWrong": ".get() never raises KeyError."
                    },
                    {
                              "id": "D",
                              "text": "False",
                              "explanationIfWrong": "The specified default is 0."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": ".get(key, default) returns the default argument (0) when the key is missing."
},
        "questionPool": [
          {
            "id": "q-5.3-1-v1",
            "question": "What happens when you run d = {'x': 10}; print(d['y'])?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "KeyError: 'y'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "None",
                                    "explanationIfWrong": "Square bracket syntax raises KeyError; use .get('y') to receive None."
                        },
                        {
                                    "id": "C",
                                    "text": "0",
                                    "explanationIfWrong": "Python does not default to 0 for missing keys."
                        },
                        {
                                    "id": "D",
                                    "text": "IndexError",
                                    "explanationIfWrong": "Dictionaries raise KeyError, not IndexError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Accessing a missing key with d[key] always raises a KeyError."
},
          {
            "id": "q-5.3-1-v2",
            "question": "What is returned by scores.get('Math', 0) if 'Math' is not in scores?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "0",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "None",
                                    "explanationIfWrong": "0 was explicitly passed as the fallback default argument."
                        },
                        {
                                    "id": "C",
                                    "text": "KeyError",
                                    "explanationIfWrong": ".get() never raises KeyError."
                        },
                        {
                                    "id": "D",
                                    "text": "False",
                                    "explanationIfWrong": "The specified default is 0."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ".get(key, default) returns the default argument (0) when the key is missing."
},
          {
            "id": "q-5.3-1-v3",
            "question": "How do you check if a key 'email' exists in dictionary user before accessing it?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "if 'email' in user:",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "if user.has_key('email'):",
                                    "explanationIfWrong": "has_key() was removed in Python 3; use in instead."
                        },
                        {
                                    "id": "C",
                                    "text": "if user.contains('email'):",
                                    "explanationIfWrong": "contains() is not a dict method."
                        },
                        {
                                    "id": "D",
                                    "text": "if 'email' in user.keys(): only",
                                    "explanationIfWrong": "'email' in user checks keys directly and is more efficient."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'key' in dict checks if key exists in O(1) time."
}
        ]
      },
      {
        "heading": "Adding, Updating & Deleting Entries",
        "text": "Add or update entries using assignment: dict[key] = value. If the key already exists, its value is overwritten; if not, a new entry is created. Delete entries using del dict[key] or dict.pop(key) to retrieve and remove.",
        "codeSnippet": "inventory = {\"apples\": 5, \"oranges\": 2}\n\ninventory[\"apples\"] = 10     # Update existing\ninventory[\"bananas\"] = 7    # Add new\npopped = inventory.pop(\"oranges\") # Remove & return 2\n\nprint(inventory)\nprint(f\"Popped: {popped}\")",
        "terminalOutput": "{'apples': 10, 'bananas': 7}\nPopped: 2",
        "mcq": {
          "id": "q-5.3-2-v1",
          "question": "What does inventory['apples'] = 15 do if 'apples' is already in inventory?",
          "options": [
                    {
                              "id": "A",
                              "text": "Updates the value of 'apples' to 15",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Adds a second 'apples' key with value 15",
                              "explanationIfWrong": "Keys must be unique; it updates the existing entry."
                    },
                    {
                              "id": "C",
                              "text": "Raises a KeyError",
                              "explanationIfWrong": "Assignment creates or updates without error."
                    },
                    {
                              "id": "D",
                              "text": "Creates a list [existing, 15]",
                              "explanationIfWrong": "It replaces the existing value directly."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Assigning to an existing key overwrites the current value associated with that key."
},
        "retestMcq": {
          "id": "q-5.3-2-v2",
          "question": "What does d.pop('status', 'offline') do if 'status' is NOT in d?",
          "options": [
                    {
                              "id": "A",
                              "text": "Returns 'offline' without raising an error",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Raises a KeyError",
                              "explanationIfWrong": "Providing a default prevents KeyError."
                    },
                    {
                              "id": "C",
                              "text": "Adds 'status': 'offline' to d",
                              "explanationIfWrong": ".pop() only removes; it does not insert."
                    },
                    {
                              "id": "D",
                              "text": "Returns None",
                              "explanationIfWrong": "It returns the provided default 'offline'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Like .get(), .pop(key, default) returns the fallback default if the key is missing."
},
        "questionPool": [
          {
            "id": "q-5.3-2-v1",
            "question": "What does inventory['apples'] = 15 do if 'apples' is already in inventory?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Updates the value of 'apples' to 15",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Adds a second 'apples' key with value 15",
                                    "explanationIfWrong": "Keys must be unique; it updates the existing entry."
                        },
                        {
                                    "id": "C",
                                    "text": "Raises a KeyError",
                                    "explanationIfWrong": "Assignment creates or updates without error."
                        },
                        {
                                    "id": "D",
                                    "text": "Creates a list [existing, 15]",
                                    "explanationIfWrong": "It replaces the existing value directly."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Assigning to an existing key overwrites the current value associated with that key."
},
          {
            "id": "q-5.3-2-v2",
            "question": "What does d.pop('status', 'offline') do if 'status' is NOT in d?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Returns 'offline' without raising an error",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Raises a KeyError",
                                    "explanationIfWrong": "Providing a default prevents KeyError."
                        },
                        {
                                    "id": "C",
                                    "text": "Adds 'status': 'offline' to d",
                                    "explanationIfWrong": ".pop() only removes; it does not insert."
                        },
                        {
                                    "id": "D",
                                    "text": "Returns None",
                                    "explanationIfWrong": "It returns the provided default 'offline'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Like .get(), .pop(key, default) returns the fallback default if the key is missing."
},
          {
            "id": "q-5.3-2-v3",
            "question": "How do you remove all items from a dictionary d, leaving it as {}?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "d.clear()",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "del d",
                                    "explanationIfWrong": "del d destroys the variable d entirely."
                        },
                        {
                                    "id": "C",
                                    "text": "d.empty()",
                                    "explanationIfWrong": "Python dicts have no .empty() method."
                        },
                        {
                                    "id": "D",
                                    "text": "d.remove_all()",
                                    "explanationIfWrong": "Use .clear() to empty a dictionary."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "d.clear() removes all key-value pairs from the dictionary in-place."
}
        ]
      },
      {
        "heading": "Iterating Over Dictionaries",
        "text": "By default, iterating over a dictionary iterates over its keys. The .values() method iterates over values. The .items() method yields (key, value) tuple pairs, which can be unpacked directly in a for loop.",
        "codeSnippet": "prices = {\"coffee\": 3.5, \"tea\": 2.8, \"juice\": 4.0}\n\n# Iterating with .items():\nfor item, price in prices.items():\n    print(f\"{item}: ${price:.2f}\")",
        "terminalOutput": "coffee: $3.50\ntea: $2.80\njuice: $4.00",
        "tip": "Always use for key, val in d.items(): when you need both keys and values inside a loop.",
        "mcq": {
          "id": "q-5.3-3-v1",
          "question": "What does for x in my_dict: iterate over by default?",
          "options": [
                    {
                              "id": "A",
                              "text": "The keys of my_dict",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "The values of my_dict",
                              "explanationIfWrong": "To iterate values, call my_dict.values()."
                    },
                    {
                              "id": "C",
                              "text": "(key, value) pairs",
                              "explanationIfWrong": "To iterate pairs, call my_dict.items()."
                    },
                    {
                              "id": "D",
                              "text": "The length of my_dict",
                              "explanationIfWrong": "Iteration yields each key in sequence."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Python, looping directly over a dictionary iterates over its keys."
},
        "retestMcq": {
          "id": "q-5.3-3-v2",
          "question": "What does d.items() yield in each iteration?",
          "options": [
                    {
                              "id": "A",
                              "text": "A tuple of (key, value)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A list of keys",
                              "explanationIfWrong": "It yields key-value tuple pairs."
                    },
                    {
                              "id": "C",
                              "text": "A string of 'key: value'",
                              "explanationIfWrong": "It yields a 2-element tuple (k, v)."
                    },
                    {
                              "id": "D",
                              "text": "The dictionary size",
                              "explanationIfWrong": "It yields key and value pairs."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": ".items() produces a view of 2-tuples containing (key, value)."
},
        "questionPool": [
          {
            "id": "q-5.3-3-v1",
            "question": "What does for x in my_dict: iterate over by default?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The keys of my_dict",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "The values of my_dict",
                                    "explanationIfWrong": "To iterate values, call my_dict.values()."
                        },
                        {
                                    "id": "C",
                                    "text": "(key, value) pairs",
                                    "explanationIfWrong": "To iterate pairs, call my_dict.items()."
                        },
                        {
                                    "id": "D",
                                    "text": "The length of my_dict",
                                    "explanationIfWrong": "Iteration yields each key in sequence."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Python, looping directly over a dictionary iterates over its keys."
},
          {
            "id": "q-5.3-3-v2",
            "question": "What does d.items() yield in each iteration?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A tuple of (key, value)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A list of keys",
                                    "explanationIfWrong": "It yields key-value tuple pairs."
                        },
                        {
                                    "id": "C",
                                    "text": "A string of 'key: value'",
                                    "explanationIfWrong": "It yields a 2-element tuple (k, v)."
                        },
                        {
                                    "id": "D",
                                    "text": "The dictionary size",
                                    "explanationIfWrong": "It yields key and value pairs."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ".items() produces a view of 2-tuples containing (key, value)."
},
          {
            "id": "q-5.3-3-v3",
            "question": "What error occurs if you try to modify a dictionary (e.g. del d[k]) while iterating directly over for k in d:?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "RuntimeError: dictionary changed size during iteration",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "IndexError: dict index altered",
                                    "explanationIfWrong": "Python raises a RuntimeError to prevent undefined iteration behavior."
                        },
                        {
                                    "id": "C",
                                    "text": "It silently skips the next key",
                                    "explanationIfWrong": "Python actively detects and prevents in-loop dictionary size mutation."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "The exception is RuntimeError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Modifying keys during direct iteration raises RuntimeError. Iterate over list(d.keys()) instead if deleting."
}
        ]
      },
      {
        "heading": "Counting & Histogram Patterns",
        "text": "A histogram or frequency table counts how often items appear. Dictionaries are the ideal structure for this: iterate through the items and increment the count using dict[item] = dict.get(item, 0) + 1.",
        "codeSnippet": "word = \"banana\"\ncounts = {}\n\nfor char in word:\n    counts[char] = counts.get(char, 0) + 1\n\nprint(counts)",
        "terminalOutput": "{'b': 1, 'a': 3, 'n': 2}",
        "mcq": {
          "id": "q-5.3-4-v1",
          "question": "Why is counts.get(item, 0) + 1 preferred when building a frequency dictionary?",
          "options": [
                    {
                              "id": "A",
                              "text": "If the item is new, .get(item, 0) safely returns 0, allowing the count to increment to 1 without a KeyError",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It forces counts to only store positive integers",
                              "explanationIfWrong": "It prevents KeyError on the first encounter."
                    },
                    {
                              "id": "C",
                              "text": "It sorts the dictionary alphabetically",
                              "explanationIfWrong": "get() does not sort."
                    },
                    {
                              "id": "D",
                              "text": "It is required by Python syntax",
                              "explanationIfWrong": "You could also use an if-else check, but .get() is more concise."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": ".get(item, 0) returns 0 if item is seen for the first time, cleanly avoiding KeyError."
},
        "retestMcq": {
          "id": "q-5.3-4-v2",
          "question": "What is the result of counts after running the histogram pattern on 'test'?",
          "options": [
                    {
                              "id": "A",
                              "text": "{'t': 2, 'e': 1, 's': 1}",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "{'t': 1, 'e': 1, 's': 1}",
                              "explanationIfWrong": "'t' appears twice (first and last letter)."
                    },
                    {
                              "id": "C",
                              "text": "['t', 'e', 's', 't']",
                              "explanationIfWrong": "It produces a dictionary of frequencies."
                    },
                    {
                              "id": "D",
                              "text": "{'test': 4}",
                              "explanationIfWrong": "The loop counts individual characters."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "'t' appears 2 times, 'e' 1 time, and 's' 1 time."
},
        "questionPool": [
          {
            "id": "q-5.3-4-v1",
            "question": "Why is counts.get(item, 0) + 1 preferred when building a frequency dictionary?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "If the item is new, .get(item, 0) safely returns 0, allowing the count to increment to 1 without a KeyError",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It forces counts to only store positive integers",
                                    "explanationIfWrong": "It prevents KeyError on the first encounter."
                        },
                        {
                                    "id": "C",
                                    "text": "It sorts the dictionary alphabetically",
                                    "explanationIfWrong": "get() does not sort."
                        },
                        {
                                    "id": "D",
                                    "text": "It is required by Python syntax",
                                    "explanationIfWrong": "You could also use an if-else check, but .get() is more concise."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": ".get(item, 0) returns 0 if item is seen for the first time, cleanly avoiding KeyError."
},
          {
            "id": "q-5.3-4-v2",
            "question": "What is the result of counts after running the histogram pattern on 'test'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "{'t': 2, 'e': 1, 's': 1}",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "{'t': 1, 'e': 1, 's': 1}",
                                    "explanationIfWrong": "'t' appears twice (first and last letter)."
                        },
                        {
                                    "id": "C",
                                    "text": "['t', 'e', 's', 't']",
                                    "explanationIfWrong": "It produces a dictionary of frequencies."
                        },
                        {
                                    "id": "D",
                                    "text": "{'test': 4}",
                                    "explanationIfWrong": "The loop counts individual characters."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "'t' appears 2 times, 'e' 1 time, and 's' 1 time."
},
          {
            "id": "q-5.3-4-v3",
            "question": "Which Python standard library module provides a specialized dict subclass specifically for counting frequencies?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "collections.Counter",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "itertools.Frequency",
                                    "explanationIfWrong": "The class is Counter from the collections module."
                        },
                        {
                                    "id": "C",
                                    "text": "math.histogram",
                                    "explanationIfWrong": "math module does not have a histogram class."
                        },
                        {
                                    "id": "D",
                                    "text": "sys.counter",
                                    "explanationIfWrong": "Counter is in collections."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "from collections import Counter provides an automatic frequency dictionary."
}
        ]
      },
      {
        "heading": "Dictionary Performance & Hash Tables",
        "text": "Under the hood, Python dictionaries are implemented using hash tables. Looking up, inserting, or deleting a key has an average time complexity of O(1) constant time, making dictionaries vastly faster than searching through lists (O(N)) for large datasets.",
        "codeSnippet": "import time\n\n# Fast O(1) lookup even with 100,000 items:\nuser_db = {f\"user_{i}\": i for i in range(100000)}\nprint(\"user_99999\" in user_db)  # Instantaneous O(1) check",
        "terminalOutput": "True",
        "mcq": {
          "id": "q-5.3-5-v1",
          "question": "What is the average time complexity of checking if a key exists in a Python dictionary ('key' in d)?",
          "options": [
                    {
                              "id": "A",
                              "text": "O(1) - Constant time",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "O(N) - Linear time proportional to dictionary size",
                              "explanationIfWrong": "Lists take O(N), but dictionaries use hash tables for O(1) lookups."
                    },
                    {
                              "id": "C",
                              "text": "O(N^2) - Quadratic time",
                              "explanationIfWrong": "Hash table lookups are near instantaneous."
                    },
                    {
                              "id": "D",
                              "text": "O(log N)",
                              "explanationIfWrong": "Binary search trees take O(log N); hash tables average O(1)."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dictionaries use hash maps, providing O(1) average lookup regardless of size."
},
        "retestMcq": {
          "id": "q-5.3-5-v2",
          "question": "Why must all dictionary keys be hashable objects in Python?",
          "options": [
                    {
                              "id": "A",
                              "text": "Because the dictionary uses the key's hash value to locate its storage bucket in constant time",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because Python encrypts dictionary keys for security",
                              "explanationIfWrong": "Hashing is for fast bucket indexing, not encryption."
                    },
                    {
                              "id": "C",
                              "text": "To sort keys automatically in ascending order",
                              "explanationIfWrong": "Hashing is not sorting."
                    },
                    {
                              "id": "D",
                              "text": "Because CPython stores dictionaries on disk",
                              "explanationIfWrong": "Dictionaries reside in memory."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The hash value of a key determines its bucket index in the hash table."
},
        "questionPool": [
          {
            "id": "q-5.3-5-v1",
            "question": "What is the average time complexity of checking if a key exists in a Python dictionary ('key' in d)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "O(1) - Constant time",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "O(N) - Linear time proportional to dictionary size",
                                    "explanationIfWrong": "Lists take O(N), but dictionaries use hash tables for O(1) lookups."
                        },
                        {
                                    "id": "C",
                                    "text": "O(N^2) - Quadratic time",
                                    "explanationIfWrong": "Hash table lookups are near instantaneous."
                        },
                        {
                                    "id": "D",
                                    "text": "O(log N)",
                                    "explanationIfWrong": "Binary search trees take O(log N); hash tables average O(1)."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dictionaries use hash maps, providing O(1) average lookup regardless of size."
},
          {
            "id": "q-5.3-5-v2",
            "question": "Why must all dictionary keys be hashable objects in Python?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Because the dictionary uses the key's hash value to locate its storage bucket in constant time",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because Python encrypts dictionary keys for security",
                                    "explanationIfWrong": "Hashing is for fast bucket indexing, not encryption."
                        },
                        {
                                    "id": "C",
                                    "text": "To sort keys automatically in ascending order",
                                    "explanationIfWrong": "Hashing is not sorting."
                        },
                        {
                                    "id": "D",
                                    "text": "Because CPython stores dictionaries on disk",
                                    "explanationIfWrong": "Dictionaries reside in memory."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The hash value of a key determines its bucket index in the hash table."
},
          {
            "id": "q-5.3-5-v3",
            "question": "If you need to repeatedly check membership for 1,000,000 items, should you use a list or a dict/set?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Use a dict or set, because O(1) lookups are orders of magnitude faster than O(N) list searches",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Use a list, because lists consume less CPU power",
                                    "explanationIfWrong": "List linear search O(N) would require up to 1,000,000 comparisons per check."
                        },
                        {
                                    "id": "C",
                                    "text": "There is no difference in search speed",
                                    "explanationIfWrong": "The difference between O(1) and O(N) on 1 million items is massive."
                        },
                        {
                                    "id": "D",
                                    "text": "Use a while loop with a string",
                                    "explanationIfWrong": "Sets and dicts are built for fast lookups."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Searching 1,000,000 items with in on a list takes O(N), whereas dict/set takes O(1) constant time."
}
        ]
      }
    ]
  },
  {
    "id": "5-4-tuples-and-complex-structures",
    "number": "5.4",
    "title": "Tuples & Complex Data Structures",
    "subtitle": "Leverage immutable tuples, nested structures, compound keys, and dictionary transformations.",
    "readTime": "25 min",
    "objectives": [
      "Create tuples with parentheses () and comma syntax",
      "Understand tuple immutability and when to use tuples over lists",
      "Use tuples as compound dictionary keys (e.g. coordinates (x, y))",
      "Store lists and dictionaries as values inside complex nested data structures",
      "Invert dictionaries to swap keys and values",
      "Sort complex dictionaries and lists of tuples"
],
    "theoryBlocks": [
      {
        "heading": "Tuples: Immutable Sequences",
        "text": "A tuple is an ordered, immutable sequence written with parentheses (). Unlike lists, once a tuple is created, its elements cannot be reassigned, appended, or deleted. Tuples are faster and consume less memory than lists.",
        "codeSnippet": "point = (10, 20)\nprint(point[0])   # 10\nprint(point[1])   # 20\n\n# point[0] = 15   # Raises TypeError: 'tuple' object does not support item assignment",
        "terminalOutput": "10\n20",
        "tip": "To create a tuple with a single item, you must include a trailing comma: single = (42,). Without the comma, (42) is just an integer in parentheses.",
        "mcq": {
          "id": "q-5.4-0-v1",
          "question": "How do you create a tuple containing the single integer 5?",
          "options": [
                    {
                              "id": "A",
                              "text": "(5,)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "(5)",
                              "explanationIfWrong": "(5) evaluates to the integer 5, not a tuple."
                    },
                    {
                              "id": "C",
                              "text": "tuple[5]",
                              "explanationIfWrong": "Square brackets are for indexing or type hints."
                    },
                    {
                              "id": "D",
                              "text": "[5,]",
                              "explanationIfWrong": "[5,] creates a single-element list."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A trailing comma (5,) is required to distinguish a single-element tuple from a grouped expression."
},
        "retestMcq": {
          "id": "q-5.4-0-v2",
          "question": "What happens if you attempt to execute t = (1, 2); t.append(3)?",
          "options": [
                    {
                              "id": "A",
                              "text": "AttributeError: 'tuple' object has no attribute 'append'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "t becomes (1, 2, 3)",
                              "explanationIfWrong": "Tuples are immutable; they do not have append or extend methods."
                    },
                    {
                              "id": "C",
                              "text": "TypeError: tuples are read-only",
                              "explanationIfWrong": "Attempting to call non-existent append raises AttributeError."
                    },
                    {
                              "id": "D",
                              "text": "It converts t into a list",
                              "explanationIfWrong": "Python does not automatically convert types on method calls."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because tuples are immutable, they do not possess mutating methods like append(), insert(), or pop()."
},
        "questionPool": [
          {
            "id": "q-5.4-0-v1",
            "question": "How do you create a tuple containing the single integer 5?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "(5,)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "(5)",
                                    "explanationIfWrong": "(5) evaluates to the integer 5, not a tuple."
                        },
                        {
                                    "id": "C",
                                    "text": "tuple[5]",
                                    "explanationIfWrong": "Square brackets are for indexing or type hints."
                        },
                        {
                                    "id": "D",
                                    "text": "[5,]",
                                    "explanationIfWrong": "[5,] creates a single-element list."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A trailing comma (5,) is required to distinguish a single-element tuple from a grouped expression."
},
          {
            "id": "q-5.4-0-v2",
            "question": "What happens if you attempt to execute t = (1, 2); t.append(3)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "AttributeError: 'tuple' object has no attribute 'append'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "t becomes (1, 2, 3)",
                                    "explanationIfWrong": "Tuples are immutable; they do not have append or extend methods."
                        },
                        {
                                    "id": "C",
                                    "text": "TypeError: tuples are read-only",
                                    "explanationIfWrong": "Attempting to call non-existent append raises AttributeError."
                        },
                        {
                                    "id": "D",
                                    "text": "It converts t into a list",
                                    "explanationIfWrong": "Python does not automatically convert types on method calls."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because tuples are immutable, they do not possess mutating methods like append(), insert(), or pop()."
},
          {
            "id": "q-5.4-0-v3",
            "question": "Why would a programmer choose a tuple instead of a list to store geographic coordinates (lat, lon)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Coordinates are a fixed-size record that should never change, and tuples can be used as dictionary keys",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Tuples allow negative latitude values while lists do not",
                                    "explanationIfWrong": "Lists support all numeric values."
                        },
                        {
                                    "id": "C",
                                    "text": "Tuples can only store floats",
                                    "explanationIfWrong": "Tuples can store any data type."
                        },
                        {
                                    "id": "D",
                                    "text": "Tuples are required by GPS hardware",
                                    "explanationIfWrong": "This is a software architecture choice."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Tuples signify fixed, immutable records and their immutability allows them to be used as hashable dict keys."
}
        ]
      },
      {
        "heading": "Tuples as Dictionary Keys",
        "text": "Because lists are mutable, they cannot be used as dictionary keys. Tuples containing only immutable elements are hashable and can be used as compound keys, making them ideal for representing 2D grid coordinates or multi-part identifiers.",
        "codeSnippet": "board = {}\n# Use (row, col) tuple as dictionary key:\nboard[(0, 0)] = \"Rook\"\nboard[(0, 1)] = \"Knight\"\nboard[(7, 4)] = \"King\"\n\nprint(board.get((7, 4)))\nprint(board.get((5, 5), \"Empty\"))",
        "terminalOutput": "King\nEmpty",
        "mcq": {
          "id": "q-5.4-1-v1",
          "question": "Why is grid[(row, col)] = 'X' valid, while grid[[row, col]] = 'X' raises a TypeError?",
          "options": [
                    {
                              "id": "A",
                              "text": "Tuples are immutable and hashable, while lists are mutable and unhashable",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Dictionaries only accept pairs of numbers",
                              "explanationIfWrong": "Dictionaries accept any hashable type as key."
                    },
                    {
                              "id": "C",
                              "text": "Lists can only hold strings",
                              "explanationIfWrong": "Lists can hold any type."
                    },
                    {
                              "id": "D",
                              "text": "Square brackets cannot be nested",
                              "explanationIfWrong": "The issue is hashability, not syntax."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Dict keys must be hashable; tuples of immutable items are hashable, whereas lists are unhashable."
},
        "retestMcq": {
          "id": "q-5.4-1-v2",
          "question": "Can a tuple containing a list, e.g. t = (1, [2, 3]), be used as a dictionary key?",
          "options": [
                    {
                              "id": "A",
                              "text": "No, because the tuple contains a mutable object ([2, 3]), making the entire tuple unhashable",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Yes, any tuple can always be a dictionary key",
                              "explanationIfWrong": "A tuple is only hashable if all of its elements are hashable."
                    },
                    {
                              "id": "C",
                              "text": "Yes, but Python converts the inner list into a tuple automatically",
                              "explanationIfWrong": "Python does not automatically convert inner objects."
                    },
                    {
                              "id": "D",
                              "text": "Only in Python 3.12+",
                              "explanationIfWrong": "Unhashable elements invalidate tuple hashability in all Python versions."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "A tuple is only hashable if every element inside it is also hashable."
},
        "questionPool": [
          {
            "id": "q-5.4-1-v1",
            "question": "Why is grid[(row, col)] = 'X' valid, while grid[[row, col]] = 'X' raises a TypeError?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Tuples are immutable and hashable, while lists are mutable and unhashable",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Dictionaries only accept pairs of numbers",
                                    "explanationIfWrong": "Dictionaries accept any hashable type as key."
                        },
                        {
                                    "id": "C",
                                    "text": "Lists can only hold strings",
                                    "explanationIfWrong": "Lists can hold any type."
                        },
                        {
                                    "id": "D",
                                    "text": "Square brackets cannot be nested",
                                    "explanationIfWrong": "The issue is hashability, not syntax."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Dict keys must be hashable; tuples of immutable items are hashable, whereas lists are unhashable."
},
          {
            "id": "q-5.4-1-v2",
            "question": "Can a tuple containing a list, e.g. t = (1, [2, 3]), be used as a dictionary key?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "No, because the tuple contains a mutable object ([2, 3]), making the entire tuple unhashable",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Yes, any tuple can always be a dictionary key",
                                    "explanationIfWrong": "A tuple is only hashable if all of its elements are hashable."
                        },
                        {
                                    "id": "C",
                                    "text": "Yes, but Python converts the inner list into a tuple automatically",
                                    "explanationIfWrong": "Python does not automatically convert inner objects."
                        },
                        {
                                    "id": "D",
                                    "text": "Only in Python 3.12+",
                                    "explanationIfWrong": "Unhashable elements invalidate tuple hashability in all Python versions."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A tuple is only hashable if every element inside it is also hashable."
},
          {
            "id": "q-5.4-1-v3",
            "question": "What is printed by coords = {(1, 2): 'Target'}; print((1, 2) in coords)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "True",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "False",
                                    "explanationIfWrong": "The tuple (1, 2) matches the dictionary key."
                        },
                        {
                                    "id": "C",
                                    "text": "'Target'",
                                    "explanationIfWrong": "The in operator returns a boolean."
                        },
                        {
                                    "id": "D",
                                    "text": "TypeError",
                                    "explanationIfWrong": "Tuples are valid hashable keys."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "(1, 2) is a valid key in coords, so the in check evaluates to True."
}
        ]
      },
      {
        "heading": "Complex Nested Data Structures",
        "text": "Real-world data is rarely flat. Python allows arbitrary nesting: lists of dictionaries, dictionaries whose values are lists, or dictionaries of dictionaries. Accessing nested values chains indexing brackets.",
        "codeSnippet": "students = {\n    \"Alice\": {\"grades\": [90, 95], \"major\": \"CS\"},\n    \"Bob\": {\"grades\": [78, 82], \"major\": \"Math\"}\n}\n\n# Accessing nested structures:\nprint(students[\"Alice\"][\"major\"])\nprint(students[\"Alice\"][\"grades\"][0])",
        "terminalOutput": "CS\n90",
        "mcq": {
          "id": "q-5.4-2-v1",
          "question": "Given company = {'dev': [{'name': 'Liisa'}, {'name': 'Antti'}]}, how do you access the string 'Antti'?",
          "options": [
                    {
                              "id": "A",
                              "text": "company['dev'][1]['name']",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "company['dev'][0]['name']",
                              "explanationIfWrong": "Index 0 is 'Liisa'; index 1 is 'Antti'."
                    },
                    {
                              "id": "C",
                              "text": "company['dev']['name'][1]",
                              "explanationIfWrong": "company['dev'] is a list, so integer index [1] must come before key ['name']."
                    },
                    {
                              "id": "D",
                              "text": "company[1]['name']",
                              "explanationIfWrong": "The outer structure is a dict keyed by 'dev'."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "company['dev'] gets the list; [1] gets the second dict; ['name'] gets 'Antti'."
},
        "retestMcq": {
          "id": "q-5.4-2-v2",
          "question": "How do you append a new grade 88 to Alice's grade list in data = {'Alice': [90, 92]}?",
          "options": [
                    {
                              "id": "A",
                              "text": "data['Alice'].append(88)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "data.append('Alice', 88)",
                              "explanationIfWrong": "Dictionaries do not have an append method; lists do."
                    },
                    {
                              "id": "C",
                              "text": "data['Alice'] += 88",
                              "explanationIfWrong": "You cannot add an int to a list with += directly."
                    },
                    {
                              "id": "D",
                              "text": "data['Alice'][2] = 88",
                              "explanationIfWrong": "Index 2 does not exist yet; assigning causes IndexError."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "data['Alice'] returns the mutable list, which can then be mutated with .append(88)."
},
        "questionPool": [
          {
            "id": "q-5.4-2-v1",
            "question": "Given company = {'dev': [{'name': 'Liisa'}, {'name': 'Antti'}]}, how do you access the string 'Antti'?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "company['dev'][1]['name']",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "company['dev'][0]['name']",
                                    "explanationIfWrong": "Index 0 is 'Liisa'; index 1 is 'Antti'."
                        },
                        {
                                    "id": "C",
                                    "text": "company['dev']['name'][1]",
                                    "explanationIfWrong": "company['dev'] is a list, so integer index [1] must come before key ['name']."
                        },
                        {
                                    "id": "D",
                                    "text": "company[1]['name']",
                                    "explanationIfWrong": "The outer structure is a dict keyed by 'dev'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "company['dev'] gets the list; [1] gets the second dict; ['name'] gets 'Antti'."
},
          {
            "id": "q-5.4-2-v2",
            "question": "How do you append a new grade 88 to Alice's grade list in data = {'Alice': [90, 92]}?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "data['Alice'].append(88)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "data.append('Alice', 88)",
                                    "explanationIfWrong": "Dictionaries do not have an append method; lists do."
                        },
                        {
                                    "id": "C",
                                    "text": "data['Alice'] += 88",
                                    "explanationIfWrong": "You cannot add an int to a list with += directly."
                        },
                        {
                                    "id": "D",
                                    "text": "data['Alice'][2] = 88",
                                    "explanationIfWrong": "Index 2 does not exist yet; assigning causes IndexError."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "data['Alice'] returns the mutable list, which can then be mutated with .append(88)."
},
          {
            "id": "q-5.4-2-v3",
            "question": "What is the result of len(d) where d = {'users': [{'id': 1}, {'id': 2}], 'count': 2}?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "2",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "3",
                                    "explanationIfWrong": "len(d) counts the top-level keys ('users' and 'count')."
                        },
                        {
                                    "id": "C",
                                    "text": "4",
                                    "explanationIfWrong": "len() does not recursively count nested items."
                        },
                        {
                                    "id": "D",
                                    "text": "1",
                                    "explanationIfWrong": "There are 2 top-level keys."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "d has two top-level keys ('users' and 'count'), so len(d) is 2."
}
        ]
      },
      {
        "heading": "Inverting a Dictionary",
        "text": "Inverting a dictionary means swapping its keys and values so that original values become keys, and original keys become values. This requires that the original values are immutable and unique.",
        "codeSnippet": "codes = {\"FIN\": \"Finland\", \"SWE\": \"Sweden\", \"NOR\": \"Norway\"}\n\n# Invert dictionary:\ninverted = {country: code for code, country in codes.items()}\nprint(inverted[\"Finland\"])",
        "terminalOutput": "FIN",
        "tip": "If the original dictionary has duplicate values, inverting it directly will overwrite keys. In that case, map each value to a list of original keys.",
        "mcq": {
          "id": "q-5.4-3-v1",
          "question": "What happens if you invert a dictionary where multiple keys share the same value (e.g. {'a': 1, 'b': 1})?",
          "options": [
                    {
                              "id": "A",
                              "text": "One of the keys will overwrite the other, resulting in only one key 1 in the inverted dictionary",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Python raises a DuplicateValueError",
                              "explanationIfWrong": "Dictionary comprehension simply overwrites duplicate keys."
                    },
                    {
                              "id": "C",
                              "text": "Both values are kept in a tuple automatically",
                              "explanationIfWrong": "Grouping requires explicit logic; simple comprehensions overwrite."
                    },
                    {
                              "id": "D",
                              "text": "The dictionary refuses to invert",
                              "explanationIfWrong": "It executes normally with data loss."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since dictionary keys must be unique, subsequent assignments to key 1 overwrite previous entries."
},
        "retestMcq": {
          "id": "q-5.4-3-v2",
          "question": "What error occurs if you try to invert d = {'user': ['admin', 'editor']} using {v: k for k, v in d.items()}?",
          "options": [
                    {
                              "id": "A",
                              "text": "TypeError: unhashable type: 'list'",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "KeyError: 'admin'",
                              "explanationIfWrong": "The error occurs because the list cannot become a key."
                    },
                    {
                              "id": "C",
                              "text": "ValueError",
                              "explanationIfWrong": "Unhashable keys trigger TypeError."
                    },
                    {
                              "id": "D",
                              "text": "It inverts successfully",
                              "explanationIfWrong": "Lists cannot be dictionary keys."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The value v is a list. Attempting to use a list as a dictionary key raises TypeError: unhashable type: 'list'."
},
        "questionPool": [
          {
            "id": "q-5.4-3-v1",
            "question": "What happens if you invert a dictionary where multiple keys share the same value (e.g. {'a': 1, 'b': 1})?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "One of the keys will overwrite the other, resulting in only one key 1 in the inverted dictionary",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Python raises a DuplicateValueError",
                                    "explanationIfWrong": "Dictionary comprehension simply overwrites duplicate keys."
                        },
                        {
                                    "id": "C",
                                    "text": "Both values are kept in a tuple automatically",
                                    "explanationIfWrong": "Grouping requires explicit logic; simple comprehensions overwrite."
                        },
                        {
                                    "id": "D",
                                    "text": "The dictionary refuses to invert",
                                    "explanationIfWrong": "It executes normally with data loss."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since dictionary keys must be unique, subsequent assignments to key 1 overwrite previous entries."
},
          {
            "id": "q-5.4-3-v2",
            "question": "What error occurs if you try to invert d = {'user': ['admin', 'editor']} using {v: k for k, v in d.items()}?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "TypeError: unhashable type: 'list'",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "KeyError: 'admin'",
                                    "explanationIfWrong": "The error occurs because the list cannot become a key."
                        },
                        {
                                    "id": "C",
                                    "text": "ValueError",
                                    "explanationIfWrong": "Unhashable keys trigger TypeError."
                        },
                        {
                                    "id": "D",
                                    "text": "It inverts successfully",
                                    "explanationIfWrong": "Lists cannot be dictionary keys."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The value v is a list. Attempting to use a list as a dictionary key raises TypeError: unhashable type: 'list'."
},
          {
            "id": "q-5.4-3-v3",
            "question": "Which code correctly inverts mapping = {'a': 10, 'b': 20} into {10: 'a', 20: 'b'}?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "{val: key for key, val in mapping.items()}",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "mapping.invert()",
                                    "explanationIfWrong": "Python dicts do not have an .invert() method."
                        },
                        {
                                    "id": "C",
                                    "text": "mapping[::-1]",
                                    "explanationIfWrong": "Dictionaries cannot be sliced."
                        },
                        {
                                    "id": "D",
                                    "text": "{key: val for val, key in mapping.items()}",
                                    "explanationIfWrong": ".items() yields (key, val), not (val, key)."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iterating (key, val) with .items() and constructing {val: key} correctly inverts the mapping."
}
        ]
      },
      {
        "heading": "Sorting Dictionaries & Lists of Tuples",
        "text": "Dictionaries themselves are ordered by insertion, but you can sort their entries by key or by value using sorted(). Passing a key function (such as a lambda or itemgetter) allows sorting complex records by any attribute.",
        "codeSnippet": "scores = {\"Alice\": 88, \"Bob\": 95, \"Charlie\": 78}\n\n# Sorted by key alphabetically:\nby_name = sorted(scores.items())\nprint(f\"By name: {by_name}\")\n\n# Sorted by score descending:\nby_score = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)\nprint(f\"By score: {by_score}\")",
        "terminalOutput": "By name: [('Alice', 88), ('Bob', 95), ('Charlie', 78)]\nBy score: [('Bob', 95), ('Alice', 88), ('Charlie', 78)]",
        "mcq": {
          "id": "q-5.4-4-v1",
          "question": "What does sorted(d) return when called directly on a dictionary d?",
          "options": [
                    {
                              "id": "A",
                              "text": "A sorted list of the dictionary's keys",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "A sorted copy of the dictionary",
                              "explanationIfWrong": "sorted() always returns a list."
                    },
                    {
                              "id": "C",
                              "text": "A list of sorted values",
                              "explanationIfWrong": "Direct iteration over dict yields keys."
                    },
                    {
                              "id": "D",
                              "text": "None",
                              "explanationIfWrong": "sorted() returns a new sorted list."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Iterating over a dictionary yields its keys; sorted(d) returns a sorted list of those keys."
},
        "retestMcq": {
          "id": "q-5.4-4-v2",
          "question": "What does key=lambda x: x[1] do in sorted(people, key=lambda x: x[1]) where people is a list of ('name', age) tuples?",
          "options": [
                    {
                              "id": "A",
                              "text": "It sorts the tuples based on age (the item at index 1)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "It sorts the tuples based on name",
                              "explanationIfWrong": "Name is at index 0."
                    },
                    {
                              "id": "C",
                              "text": "It skips the first tuple",
                              "explanationIfWrong": "The key function extracts the comparison value for sorting."
                    },
                    {
                              "id": "D",
                              "text": "It limits the results to 1 item",
                              "explanationIfWrong": "key defines the sort comparison metric."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "The lambda extracts item[1] (the age) as the sorting criterion for each tuple."
},
        "questionPool": [
          {
            "id": "q-5.4-4-v1",
            "question": "What does sorted(d) return when called directly on a dictionary d?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "A sorted list of the dictionary's keys",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "A sorted copy of the dictionary",
                                    "explanationIfWrong": "sorted() always returns a list."
                        },
                        {
                                    "id": "C",
                                    "text": "A list of sorted values",
                                    "explanationIfWrong": "Direct iteration over dict yields keys."
                        },
                        {
                                    "id": "D",
                                    "text": "None",
                                    "explanationIfWrong": "sorted() returns a new sorted list."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iterating over a dictionary yields its keys; sorted(d) returns a sorted list of those keys."
},
          {
            "id": "q-5.4-4-v2",
            "question": "What does key=lambda x: x[1] do in sorted(people, key=lambda x: x[1]) where people is a list of ('name', age) tuples?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "It sorts the tuples based on age (the item at index 1)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "It sorts the tuples based on name",
                                    "explanationIfWrong": "Name is at index 0."
                        },
                        {
                                    "id": "C",
                                    "text": "It skips the first tuple",
                                    "explanationIfWrong": "The key function extracts the comparison value for sorting."
                        },
                        {
                                    "id": "D",
                                    "text": "It limits the results to 1 item",
                                    "explanationIfWrong": "key defines the sort comparison metric."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "The lambda extracts item[1] (the age) as the sorting criterion for each tuple."
},
          {
            "id": "q-5.4-4-v3",
            "question": "How do tuples sort by default when compared against each other, e.g. (1, 5) vs (1, 2)?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "Element by element from left to right: first comparing index 0, then index 1 if tied",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "By the sum of their elements",
                                    "explanationIfWrong": "Tuples sort lexicographically, not by mathematical sum."
                        },
                        {
                                    "id": "C",
                                    "text": "By their length only",
                                    "explanationIfWrong": "Elements are compared sequentially."
                        },
                        {
                                    "id": "D",
                                    "text": "In random order",
                                    "explanationIfWrong": "Tuple comparison is strictly deterministic."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Tuples sort lexicographically: (1, 5) > (1, 2) because 5 > 2 after index 0 ties at 1."
}
        ]
      },
      {
        "heading": "Combining Data Structures in Practice",
        "text": "In practical applications, complex data is represented using combinations of lists, dictionaries, and tuples. Structuring data with clear naming and predictable access paths makes programs maintainable and scalable.",
        "codeSnippet": "course_database = [\n    {\"code\": \"TKT10001\", \"name\": \"Intro to Programming\", \"credits\": 5},\n    {\"code\": \"TKT10002\", \"name\": \"Advanced Programming\", \"credits\": 5}\n]\n\ndef total_credits(courses):\n    return sum(c[\"credits\"] for c in courses)\n\nprint(f\"Total Credits: {total_credits(course_database)}\")",
        "terminalOutput": "Total Credits: 10",
        "mcq": {
          "id": "q-5.4-5-v1",
          "question": "Why is a list of dictionaries often used to represent database records or JSON API responses?",
          "options": [
                    {
                              "id": "A",
                              "text": "The list maintains row order, while each dictionary maps field names to values flexibly",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "Because JSON does not support numbers",
                              "explanationIfWrong": "JSON supports numbers, booleans, strings, arrays, and objects."
                    },
                    {
                              "id": "C",
                              "text": "Because lists of dictionaries cannot be modified",
                              "explanationIfWrong": "Both are fully mutable."
                    },
                    {
                              "id": "D",
                              "text": "Because Python forbids standalone dictionaries",
                              "explanationIfWrong": "Standalone dicts are standard."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "List-of-dicts mirrors table rows with named columns, making it the industry standard for tabular/API data."
},
        "retestMcq": {
          "id": "q-5.4-5-v2",
          "question": "How do you find the course with code 'TKT10002' from the course_database list?",
          "options": [
                    {
                              "id": "A",
                              "text": "next((c for c in course_database if c['code'] == 'TKT10002'), None)",
                              "explanationIfWrong": "This is the correct answer."
                    },
                    {
                              "id": "B",
                              "text": "course_database['TKT10002']",
                              "explanationIfWrong": "course_database is a list, so key lookup fails with TypeError."
                    },
                    {
                              "id": "C",
                              "text": "course_database.find('TKT10002')",
                              "explanationIfWrong": "Lists do not have a .find() method."
                    },
                    {
                              "id": "D",
                              "text": "course_database.get('code')",
                              "explanationIfWrong": "Lists do not have a .get() method."
                    }
          ],
          "correctAnswer": "A",
          "explanationNote": "Iterating with a generator expression and next() cleanly finds the matching record."
},
        "questionPool": [
          {
            "id": "q-5.4-5-v1",
            "question": "Why is a list of dictionaries often used to represent database records or JSON API responses?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "The list maintains row order, while each dictionary maps field names to values flexibly",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "Because JSON does not support numbers",
                                    "explanationIfWrong": "JSON supports numbers, booleans, strings, arrays, and objects."
                        },
                        {
                                    "id": "C",
                                    "text": "Because lists of dictionaries cannot be modified",
                                    "explanationIfWrong": "Both are fully mutable."
                        },
                        {
                                    "id": "D",
                                    "text": "Because Python forbids standalone dictionaries",
                                    "explanationIfWrong": "Standalone dicts are standard."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "List-of-dicts mirrors table rows with named columns, making it the industry standard for tabular/API data."
},
          {
            "id": "q-5.4-5-v2",
            "question": "How do you find the course with code 'TKT10002' from the course_database list?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "next((c for c in course_database if c['code'] == 'TKT10002'), None)",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "course_database['TKT10002']",
                                    "explanationIfWrong": "course_database is a list, so key lookup fails with TypeError."
                        },
                        {
                                    "id": "C",
                                    "text": "course_database.find('TKT10002')",
                                    "explanationIfWrong": "Lists do not have a .find() method."
                        },
                        {
                                    "id": "D",
                                    "text": "course_database.get('code')",
                                    "explanationIfWrong": "Lists do not have a .get() method."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "Iterating with a generator expression and next() cleanly finds the matching record."
},
          {
            "id": "q-5.4-5-v3",
            "question": "What is the best way to convert course_database into a lookup dictionary keyed by course code?",
            "options": [
                        {
                                    "id": "A",
                                    "text": "{c['code']: c for c in course_database}",
                                    "explanationIfWrong": "This is the correct answer."
                        },
                        {
                                    "id": "B",
                                    "text": "dict(course_database)",
                                    "explanationIfWrong": "dict() requires pairs of (key, value), not dicts."
                        },
                        {
                                    "id": "C",
                                    "text": "course_database.to_dict()",
                                    "explanationIfWrong": "Built-in lists do not have a .to_dict() method."
                        },
                        {
                                    "id": "D",
                                    "text": "{c: c['code'] for c in course_database}",
                                    "explanationIfWrong": "This puts the dict as the key, which fails with TypeError: unhashable type: 'dict'."
                        }
            ],
            "correctAnswer": "A",
            "explanationNote": "A dictionary comprehension mapping c['code'] to c creates an instant O(1) lookup table."
}
        ]
      }
    ]
  }
];


// Function to get active questions for a level
// Supports dynamic variant rotation (v1, v2, v3) without duplicate repeat
export const getActiveQuestionsForLevelPart5 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part5_question_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part5_active_questions_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 5
export const getConsecutiveFailuresPart5 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part5_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart5 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part5_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart5 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part5_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart5 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part5_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart5 = (
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
  const currentAttempt = getLevelAttemptCountPart5(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part5_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part5_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part5_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part5_locked_${studentId}`);
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
      setLevelAttemptCountPart5(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart5(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart5(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part5_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part5_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part5_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart5 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part5_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part5_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part5_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part5_locked_progression_${studentId}`);
  } catch {}
};
