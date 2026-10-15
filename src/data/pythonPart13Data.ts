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

export const PART_13_SECTIONS: SectionContent[] = [
  {
    "id": "13-1-pygame-window-game-loop",
    "number": "13.1",
    "title": "Pygame Setup & The Central Game Loop",
    "subtitle": "Initialize the Pygame engine, create a graphical display window, and construct the continuous game loop.",
    "readTime": "22 min",
    "objectives": [
      "Initialize the Pygame engine and its core subsystems with pygame.init()",
      "Create a graphical display surface and configure window titles with set_caption()",
      "Master the 3-phase structure of every game loop: Events, Updates, and Rendering",
      "Understand double buffering, screen flipping, and difference between flip() and update()",
      "Regulate execution speed and prevent CPU 100% usage with pygame.time.Clock",
      "Handle graceful application termination on pygame.QUIT events"
    ],
    "theoryBlocks": [
      {
        "heading": "Pygame Initialization & Core Subsystems",
        "text": "Pygame is a cross-platform Python wrapper around the high-performance Simple DirectMedia Layer (SDL) C library. Before utilizing any graphics, audio, font, or input capabilities, you must initialize Pygame's subsystems using `pygame.init()`. When the game session finishes, `pygame.quit()` shuts down all active hardware interfaces and releases system memory. Pairing `pygame.quit()` with `sys.exit()` guarantees that the Python interpreter terminates without hanging terminal processes.",
        "codeSnippet": "import pygame\nimport sys\n\n# 1. Initialize all imported Pygame modules\npygame.init()\nprint(\"Pygame subsystems initialized successfully!\")\n\n# When exiting game application:\n# pygame.quit()  # Uninitialize display and sound drivers\n# sys.exit()     # Terminate Python process",
        "terminalOutput": "pygame 2.5.2 (SDL 2.28.3, Python 3.11.4)\nHello from the pygame community. https://www.pygame.org/contribute.html\nPygame subsystems initialized successfully!",
        "tip": "Always call `pygame.init()` at the very start of your program before calling any other Pygame functions.",
        "mcq": {
          "question": "What function must be called before using any graphics or sound features in Pygame?",
          "options": [
            {
              "id": "A",
              "text": "pygame.init()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.start()",
              "explanationIfWrong": "'start' is not a valid Pygame module function."
            },
            {
              "id": "C",
              "text": "pygame.run()",
              "explanationIfWrong": "Pygame does not use pygame.run()."
            },
            {
              "id": "D",
              "text": "pygame.open()",
              "explanationIfWrong": "pygame.init() is the mandatory initialization function."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.init() initializes all internal Pygame modules and hardware drivers (display, audio, font, joystick).",
          "id": "q-13-1-pygame-window-game-loop-0-v1"
        },
        "retestMcq": {
          "question": "Why is it best practice to call both pygame.quit() and sys.exit() when closing a game?",
          "options": [
            {
              "id": "A",
              "text": "pygame.quit() uninitializes hardware drivers; sys.exit() terminates the Python interpreter process cleanly",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.quit() only minimizes the window",
              "explanationIfWrong": "pygame.quit() shuts down Pygame subsystems completely."
            },
            {
              "id": "C",
              "text": "sys.exit() deletes temporary save files",
              "explanationIfWrong": "sys.exit() terminates the Python process."
            },
            {
              "id": "D",
              "text": "They are identical and calling both is redundant",
              "explanationIfWrong": "They perform complementary cleanup duties."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.quit() frees graphic and audio resources, while sys.exit() stops Python execution to prevent zombie processes.",
          "id": "q-13-1-pygame-window-game-loop-0-v2"
        },
        "questionPool": [
          {
            "question": "What function must be called before using any graphics or sound features in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "pygame.init()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.start()",
                "explanationIfWrong": "'start' is not a valid Pygame module function."
              },
              {
                "id": "C",
                "text": "pygame.run()",
                "explanationIfWrong": "Pygame does not use pygame.run()."
              },
              {
                "id": "D",
                "text": "pygame.open()",
                "explanationIfWrong": "pygame.init() is the mandatory initialization function."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.init() initializes all internal Pygame modules and hardware drivers (display, audio, font, joystick).",
            "id": "q-13-1-pygame-window-game-loop-0-v1"
          },
          {
            "question": "Why is it best practice to call both pygame.quit() and sys.exit() when closing a game?",
            "options": [
              {
                "id": "A",
                "text": "pygame.quit() uninitializes hardware drivers; sys.exit() terminates the Python interpreter process cleanly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.quit() only minimizes the window",
                "explanationIfWrong": "pygame.quit() shuts down Pygame subsystems completely."
              },
              {
                "id": "C",
                "text": "sys.exit() deletes temporary save files",
                "explanationIfWrong": "sys.exit() terminates the Python process."
              },
              {
                "id": "D",
                "text": "They are identical and calling both is redundant",
                "explanationIfWrong": "They perform complementary cleanup duties."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.quit() frees graphic and audio resources, while sys.exit() stops Python execution to prevent zombie processes.",
            "id": "q-13-1-pygame-window-game-loop-0-v2"
          },
          {
            "question": "What underlying C library does Pygame utilize for low-level graphics, audio, and event handling?",
            "options": [
              {
                "id": "A",
                "text": "SDL (Simple DirectMedia Layer)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "DirectX exclusively",
                "explanationIfWrong": "Pygame wraps cross-platform SDL, not Windows-only DirectX."
              },
              {
                "id": "C",
                "text": "OpenGL exclusively",
                "explanationIfWrong": "SDL is the core foundation library."
              },
              {
                "id": "D",
                "text": "Qt GUI",
                "explanationIfWrong": "Pygame is built on SDL."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Pygame is built on top of SDL, a cross-platform multimedia library used worldwide for 2D game development.",
            "id": "q-13-1-pygame-window-game-loop-0-v3"
          }
        ]
      },
      {
        "heading": "Creating the Display Surface & Window Coordinates",
        "text": "The main game window in Pygame is a `Surface` object created using `pygame.display.set_mode((width, height))`. The parameter is a tuple of pixel dimensions. In Pygame's 2D coordinate system, the origin `(0, 0)` is located at the TOP-LEFT corner of the window. The X-axis increases horizontally to the RIGHT, and the Y-axis increases vertically DOWNWARD. You can customize the window title bar using `pygame.display.set_caption('My Game')`.",
        "codeSnippet": "import pygame\n\npygame.init()\n\n# Create a 640x480 pixel window\nSCREEN_WIDTH = 640\nSCREEN_HEIGHT = 480\nscreen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))\n\n# Set window title bar text\npygame.display.set_caption(\"DO PILOT \u2014 Arcade Odyssey 2D\")\n\nprint(\"Screen Surface size:\", screen.get_size())\nprint(\"Origin (0,0) is at top-left corner\")",
        "terminalOutput": "Screen Surface size: (640, 480)\nOrigin (0,0) is at top-left corner",
        "tip": "Remember: In computer graphics, Y increases DOWNWARDS. Moving an object up means decreasing its Y coordinate.",
        "mcq": {
          "question": "Where is the coordinate origin (0, 0) located in a Pygame window?",
          "options": [
            {
              "id": "A",
              "text": "At the top-left corner of the window",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "At the exact center of the window",
              "explanationIfWrong": "Standard Cartesian center coordinates are not the Pygame default."
            },
            {
              "id": "C",
              "text": "At the bottom-left corner of the window",
              "explanationIfWrong": "Math graphs place (0,0) at bottom-left; computer displays use top-left."
            },
            {
              "id": "D",
              "text": "At the bottom-right corner",
              "explanationIfWrong": "Origin is strictly top-left."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Pygame (and almost all 2D computer graphics), (0, 0) is the top-left corner. Increasing Y moves downwards.",
          "id": "q-13-1-pygame-window-game-loop-1-v1"
        },
        "retestMcq": {
          "question": "How do you move a player sprite UPWARDS in a Pygame window?",
          "options": [
            {
              "id": "A",
              "text": "Decrease its y coordinate (e.g. y -= speed)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Increase its y coordinate (e.g. y += speed)",
              "explanationIfWrong": "Increasing y moves the sprite downward toward the bottom of the screen."
            },
            {
              "id": "C",
              "text": "Increase its x coordinate",
              "explanationIfWrong": "x controls horizontal left/right position."
            },
            {
              "id": "D",
              "text": "Decrease its x coordinate",
              "explanationIfWrong": "Decreasing x moves the sprite left."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Because Y=0 is at the top of the screen, decreasing Y moves an object closer to the top.",
          "id": "q-13-1-pygame-window-game-loop-1-v2"
        },
        "questionPool": [
          {
            "question": "Where is the coordinate origin (0, 0) located in a Pygame window?",
            "options": [
              {
                "id": "A",
                "text": "At the top-left corner of the window",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "At the exact center of the window",
                "explanationIfWrong": "Standard Cartesian center coordinates are not the Pygame default."
              },
              {
                "id": "C",
                "text": "At the bottom-left corner of the window",
                "explanationIfWrong": "Math graphs place (0,0) at bottom-left; computer displays use top-left."
              },
              {
                "id": "D",
                "text": "At the bottom-right corner",
                "explanationIfWrong": "Origin is strictly top-left."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Pygame (and almost all 2D computer graphics), (0, 0) is the top-left corner. Increasing Y moves downwards.",
            "id": "q-13-1-pygame-window-game-loop-1-v1"
          },
          {
            "question": "How do you move a player sprite UPWARDS in a Pygame window?",
            "options": [
              {
                "id": "A",
                "text": "Decrease its y coordinate (e.g. y -= speed)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Increase its y coordinate (e.g. y += speed)",
                "explanationIfWrong": "Increasing y moves the sprite downward toward the bottom of the screen."
              },
              {
                "id": "C",
                "text": "Increase its x coordinate",
                "explanationIfWrong": "x controls horizontal left/right position."
              },
              {
                "id": "D",
                "text": "Decrease its x coordinate",
                "explanationIfWrong": "Decreasing x moves the sprite left."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Because Y=0 is at the top of the screen, decreasing Y moves an object closer to the top.",
            "id": "q-13-1-pygame-window-game-loop-1-v2"
          },
          {
            "question": "What is the return type of pygame.display.set_mode((800, 600))?",
            "options": [
              {
                "id": "A",
                "text": "A pygame.Surface object representing the window display",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A boolean True or False",
                "explanationIfWrong": "set_mode returns the display Surface."
              },
              {
                "id": "C",
                "text": "An integer window ID",
                "explanationIfWrong": "Pygame encapsulates windows as Surface objects."
              },
              {
                "id": "D",
                "text": "A tuple of pixel coordinates",
                "explanationIfWrong": "It returns the main Surface object."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "set_mode() returns the primary display Surface upon which all game elements, sprites, and backgrounds are drawn.",
            "id": "q-13-1-pygame-window-game-loop-1-v3"
          }
        ]
      },
      {
        "heading": "The Central Game Loop Pattern",
        "text": "Every real-time interactive game is driven by a central loop (the Game Loop) that runs continuously until the player quits. Every iteration of this loop represents one 'frame' and performs three non-negotiable steps in strict order: 1) Event Handling (poll keyboard, mouse, window events); 2) State Updates (move characters, apply physics, check collisions, update score); 3) Rendering/Drawing (clear screen, draw background, draw sprites, flip display buffers).",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\nclock = pygame.time.Clock()\nrunning = True\n\nwhile running:\n    # 1. Event Handling Phase\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n            \n    # 2. State Update Phase (game logic, physics)\n    # player.update()\n    \n    # 3. Rendering Phase\n    screen.fill((30, 30, 40))  # Clear screen\n    # screen.blit(player, (x, y))\n    pygame.display.flip()      # Present new frame\n    \n    clock.tick(60)             # Cap at 60 FPS\n\npygame.quit()",
        "terminalOutput": "Game loop executed and terminated gracefully.",
        "tip": "Mnemonic for game loop phases: 'Input -> Process -> Render'.",
        "mcq": {
          "question": "What are the three essential phases executed inside every iteration of a game loop?",
          "options": [
            {
              "id": "A",
              "text": "Event Handling, State Updates, and Rendering",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Compilation, Linking, and Execution",
              "explanationIfWrong": "These are build-time steps, not game loop phases."
            },
            {
              "id": "C",
              "text": "Login, Authentication, and Session Termination",
              "explanationIfWrong": "These are web server authentication steps."
            },
            {
              "id": "D",
              "text": "Allocation, Garbage Collection, and Deallocation",
              "explanationIfWrong": "These are memory management routines."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The fundamental game loop pattern is: 1) Process Inputs/Events, 2) Update Game State/Physics, 3) Draw/Render Frame.",
          "id": "q-13-1-pygame-window-game-loop-2-v1"
        },
        "retestMcq": {
          "question": "What happens if a game loop updates positions and renders graphics without polling pygame.event.get()?",
          "options": [
            {
              "id": "A",
              "text": "The operating system marks the window as 'Not Responding' and freezes because the event queue overflows",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The game runs 10 times faster",
              "explanationIfWrong": "Failure to pump events causes the OS window manager to freeze the app."
            },
            {
              "id": "C",
              "text": "Pygame automatically closes the window",
              "explanationIfWrong": "The window hangs rather than closing."
            },
            {
              "id": "D",
              "text": "The display turns grayscale",
              "explanationIfWrong": "Display colors are unaffected."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The operating system expects applications to pump and clear their event queue continuously; ignoring it causes the OS to flag the window as unresponsive.",
          "id": "q-13-1-pygame-window-game-loop-2-v2"
        },
        "questionPool": [
          {
            "question": "What are the three essential phases executed inside every iteration of a game loop?",
            "options": [
              {
                "id": "A",
                "text": "Event Handling, State Updates, and Rendering",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Compilation, Linking, and Execution",
                "explanationIfWrong": "These are build-time steps, not game loop phases."
              },
              {
                "id": "C",
                "text": "Login, Authentication, and Session Termination",
                "explanationIfWrong": "These are web server authentication steps."
              },
              {
                "id": "D",
                "text": "Allocation, Garbage Collection, and Deallocation",
                "explanationIfWrong": "These are memory management routines."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The fundamental game loop pattern is: 1) Process Inputs/Events, 2) Update Game State/Physics, 3) Draw/Render Frame.",
            "id": "q-13-1-pygame-window-game-loop-2-v1"
          },
          {
            "question": "What happens if a game loop updates positions and renders graphics without polling pygame.event.get()?",
            "options": [
              {
                "id": "A",
                "text": "The operating system marks the window as 'Not Responding' and freezes because the event queue overflows",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The game runs 10 times faster",
                "explanationIfWrong": "Failure to pump events causes the OS window manager to freeze the app."
              },
              {
                "id": "C",
                "text": "Pygame automatically closes the window",
                "explanationIfWrong": "The window hangs rather than closing."
              },
              {
                "id": "D",
                "text": "The display turns grayscale",
                "explanationIfWrong": "Display colors are unaffected."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The operating system expects applications to pump and clear their event queue continuously; ignoring it causes the OS to flag the window as unresponsive.",
            "id": "q-13-1-pygame-window-game-loop-2-v2"
          },
          {
            "question": "When does the game loop terminate?",
            "options": [
              {
                "id": "A",
                "text": "When the loop condition (e.g. running) becomes False",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Automatically after 60 seconds",
                "explanationIfWrong": "The loop runs indefinitely until explicitly stopped."
              },
              {
                "id": "C",
                "text": "Whenever clock.tick() is called",
                "explanationIfWrong": "clock.tick() regulates speed, it does not stop the loop."
              },
              {
                "id": "D",
                "text": "When a key is pressed",
                "explanationIfWrong": "Keys trigger event actions, not automatic loop termination."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A boolean flag like 'running = True' controls the while loop. Setting running = False allows the loop to exit cleanly.",
            "id": "q-13-1-pygame-window-game-loop-2-v3"
          }
        ]
      },
      {
        "heading": "Screen Refreshing & Double Buffering",
        "text": "Pygame displays use a technique called 'Double Buffering' to prevent visual flickering and screen tearing. There are two buffers: the Front Buffer (what the user currently sees on their monitor) and the Back Buffer (an off-screen canvas where your code draws shapes and sprites). When drawing is complete, `pygame.display.flip()` swaps the front and back buffers instantaneously, displaying the completed frame to the player without showing half-drawn sprites.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\n\n# Drawing occurs off-screen in the back buffer:\nscreen.fill((0, 0, 0))\npygame.draw.rect(screen, (0, 255, 128), (50, 50, 100, 100))\n\n# Swaps the back buffer into active display view\npygame.display.flip()\nprint(\"Back buffer swapped to front screen display!\")\npygame.quit()",
        "terminalOutput": "Back buffer swapped to front screen display!",
        "tip": "`pygame.display.flip()` updates the entire window; `pygame.display.update(rect_list)` can selectively update dirty rectangles for performance optimizations.",
        "mcq": {
          "question": "What is the primary purpose of 'Double Buffering' in graphics programming?",
          "options": [
            {
              "id": "A",
              "text": "To prevent visual flickering and screen tearing by drawing off-screen before displaying the complete frame",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To store two copies of the game code in RAM",
              "explanationIfWrong": "Double buffering is a graphics rendering technique, not code duplication."
            },
            {
              "id": "C",
              "text": "To support two players simultaneously",
              "explanationIfWrong": "Player count is unrelated to display buffers."
            },
            {
              "id": "D",
              "text": "To double the maximum resolution of the monitor",
              "explanationIfWrong": "Hardware resolution is physical."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Double buffering draws the next frame in a hidden off-screen back buffer. Flipping buffers makes the new frame visible all at once, eliminating partial-draw artifacts.",
          "id": "q-13-1-pygame-window-game-loop-3-v1"
        },
        "retestMcq": {
          "question": "What function makes everything drawn on the display surface visible on the user's screen?",
          "options": [
            {
              "id": "A",
              "text": "pygame.display.flip()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.render()",
              "explanationIfWrong": "There is no pygame.render() function."
            },
            {
              "id": "C",
              "text": "screen.show()",
              "explanationIfWrong": "Surface objects do not have a .show() method."
            },
            {
              "id": "D",
              "text": "pygame.screen.paint()",
              "explanationIfWrong": "Invalid Pygame function."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.display.flip() updates the entire surface display to the screen by flipping the buffers.",
          "id": "q-13-1-pygame-window-game-loop-3-v2"
        },
        "questionPool": [
          {
            "question": "What is the primary purpose of 'Double Buffering' in graphics programming?",
            "options": [
              {
                "id": "A",
                "text": "To prevent visual flickering and screen tearing by drawing off-screen before displaying the complete frame",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To store two copies of the game code in RAM",
                "explanationIfWrong": "Double buffering is a graphics rendering technique, not code duplication."
              },
              {
                "id": "C",
                "text": "To support two players simultaneously",
                "explanationIfWrong": "Player count is unrelated to display buffers."
              },
              {
                "id": "D",
                "text": "To double the maximum resolution of the monitor",
                "explanationIfWrong": "Hardware resolution is physical."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Double buffering draws the next frame in a hidden off-screen back buffer. Flipping buffers makes the new frame visible all at once, eliminating partial-draw artifacts.",
            "id": "q-13-1-pygame-window-game-loop-3-v1"
          },
          {
            "question": "What function makes everything drawn on the display surface visible on the user's screen?",
            "options": [
              {
                "id": "A",
                "text": "pygame.display.flip()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.render()",
                "explanationIfWrong": "There is no pygame.render() function."
              },
              {
                "id": "C",
                "text": "screen.show()",
                "explanationIfWrong": "Surface objects do not have a .show() method."
              },
              {
                "id": "D",
                "text": "pygame.screen.paint()",
                "explanationIfWrong": "Invalid Pygame function."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.display.flip() updates the entire surface display to the screen by flipping the buffers.",
            "id": "q-13-1-pygame-window-game-loop-3-v2"
          },
          {
            "question": "What happens if you draw sprites but forget to call pygame.display.flip() or pygame.display.update()?",
            "options": [
              {
                "id": "A",
                "text": "The screen remains blank/black because the back buffer was never presented to the monitor",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Pygame raises a RenderError",
                "explanationIfWrong": "No exception is raised; drawings simply remain unseen in the back buffer."
              },
              {
                "id": "C",
                "text": "The computer crashes",
                "explanationIfWrong": "It causes no system crash."
              },
              {
                "id": "D",
                "text": "The window closes automatically",
                "explanationIfWrong": "The window stays open, but shows nothing."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "All drawing commands target the off-screen buffer. Without flip(), the updated buffer is never transferred to the visible display.",
            "id": "q-13-1-pygame-window-game-loop-3-v3"
          }
        ]
      },
      {
        "heading": "Frame Rate Regulation with pygame.time.Clock",
        "text": "Without frame rate throttling, a game loop will run as fast as the CPU allows\u2014often thousands of frames per second. This overheats the processor, drains laptop batteries, and causes game physics to run at uncontrollably erratic speeds depending on hardware. Pygame provides `pygame.time.Clock()`. Calling `clock.tick(60)` inside the loop pauses execution just long enough to ensure the game runs at exactly 60 frames per second.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((300, 200))\nclock = pygame.time.Clock()\n\nfor frame_num in range(3):\n    # clock.tick(60) limits loop to 60 FPS and returns delta time in ms\n    dt = clock.tick(60)\n    print(f\"Frame {frame_num}: Elapsed {dt} ms, FPS: {clock.get_fps():.1f}\")\n\npygame.quit()",
        "terminalOutput": "Frame 0: Elapsed 17 ms, FPS: 0.0\nFrame 1: Elapsed 16 ms, FPS: 60.1\nFrame 2: Elapsed 17 ms, FPS: 59.8",
        "tip": "`clock.tick(60)` returns the number of milliseconds passed since the previous call (approximately 16.6 ms for 60 FPS).",
        "mcq": {
          "question": "What is the primary function of clock.tick(60) inside a game loop?",
          "options": [
            {
              "id": "A",
              "text": "It caps the loop execution speed at a stable 60 frames per second, preventing CPU runaway",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It counts down a 60-second game timer",
              "explanationIfWrong": "tick() regulates FPS, not game countdowns."
            },
            {
              "id": "C",
              "text": "It forces the game to run at 60 MHz CPU speed",
              "explanationIfWrong": "CPU clock frequencies are controlled by hardware."
            },
            {
              "id": "D",
              "text": "It draws 60 pixels per second",
              "explanationIfWrong": "tick() controls frame timing, not pixel counts."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "clock.tick(60) calculates how long the current frame took and sleeps for the remainder of 1/60th of a second to maintain a steady 60 FPS.",
          "id": "q-13-1-pygame-window-game-loop-4-v1"
        },
        "retestMcq": {
          "question": "What does clock.tick(60) return to the caller?",
          "options": [
            {
              "id": "A",
              "text": "The number of milliseconds that elapsed since the last tick call",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The current FPS as a float",
              "explanationIfWrong": "clock.get_fps() returns the current FPS."
            },
            {
              "id": "C",
              "text": "The current date and time",
              "explanationIfWrong": "time.time() or datetime returns timestamps."
            },
            {
              "id": "D",
              "text": "A boolean indicating if the game is lagging",
              "explanationIfWrong": "It returns the elapsed delta time in milliseconds."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "clock.tick() returns the delta time (in milliseconds) since the previous frame, useful for delta-time movement calculations.",
          "id": "q-13-1-pygame-window-game-loop-4-v2"
        },
        "questionPool": [
          {
            "question": "What is the primary function of clock.tick(60) inside a game loop?",
            "options": [
              {
                "id": "A",
                "text": "It caps the loop execution speed at a stable 60 frames per second, preventing CPU runaway",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It counts down a 60-second game timer",
                "explanationIfWrong": "tick() regulates FPS, not game countdowns."
              },
              {
                "id": "C",
                "text": "It forces the game to run at 60 MHz CPU speed",
                "explanationIfWrong": "CPU clock frequencies are controlled by hardware."
              },
              {
                "id": "D",
                "text": "It draws 60 pixels per second",
                "explanationIfWrong": "tick() controls frame timing, not pixel counts."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "clock.tick(60) calculates how long the current frame took and sleeps for the remainder of 1/60th of a second to maintain a steady 60 FPS.",
            "id": "q-13-1-pygame-window-game-loop-4-v1"
          },
          {
            "question": "What does clock.tick(60) return to the caller?",
            "options": [
              {
                "id": "A",
                "text": "The number of milliseconds that elapsed since the last tick call",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The current FPS as a float",
                "explanationIfWrong": "clock.get_fps() returns the current FPS."
              },
              {
                "id": "C",
                "text": "The current date and time",
                "explanationIfWrong": "time.time() or datetime returns timestamps."
              },
              {
                "id": "D",
                "text": "A boolean indicating if the game is lagging",
                "explanationIfWrong": "It returns the elapsed delta time in milliseconds."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "clock.tick() returns the delta time (in milliseconds) since the previous frame, useful for delta-time movement calculations.",
            "id": "q-13-1-pygame-window-game-loop-4-v2"
          },
          {
            "question": "Approximately how many milliseconds does each frame take when running at 60 FPS?",
            "options": [
              {
                "id": "A",
                "text": "16.7 milliseconds (1000 ms / 60)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "60.0 milliseconds",
                "explanationIfWrong": "60 ms would yield approximately 16 FPS."
              },
              {
                "id": "C",
                "text": "1.0 millisecond",
                "explanationIfWrong": "1 ms would mean 1000 FPS."
              },
              {
                "id": "D",
                "text": "100 milliseconds",
                "explanationIfWrong": "100 ms would mean 10 FPS."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "1 second = 1000 milliseconds. 1000 / 60 = ~16.666 milliseconds per frame.",
            "id": "q-13-1-pygame-window-game-loop-4-v3"
          }
        ]
      },
      {
        "heading": "Graceful Window Termination & Event Polling",
        "text": "When a user clicks the 'X' button on a window, the operating system generates a window-close event. In Pygame, this arrives in the event queue as `pygame.QUIT`. In your event handling loop, you inspect events using `pygame.event.get()`. If `event.type == pygame.QUIT`, set your running flag to `False`. The loop will exit, execute cleanup code, and shut down without error.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((300, 200))\n\n# Standard event loop handling QUIT\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            print(\"Window close requested! Cleaning up...\")\n            running = False\n    break  # Break for test script demonstration\n\npygame.quit()",
        "terminalOutput": "Window close requested! Cleaning up...",
        "tip": "Never call `sys.exit()` directly inside the event loop without calling `pygame.quit()` first, or your terminal window may freeze.",
        "mcq": {
          "question": "What event type is triggered when the user clicks the window's close (X) button?",
          "options": [
            {
              "id": "A",
              "text": "pygame.QUIT",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.WINDOW_CLOSE",
              "explanationIfWrong": "The standard Pygame constant is pygame.QUIT."
            },
            {
              "id": "C",
              "text": "pygame.EXIT",
              "explanationIfWrong": "Pygame uses pygame.QUIT."
            },
            {
              "id": "D",
              "text": "pygame.KILL",
              "explanationIfWrong": "Invalid event constant."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "When the user clicks the operating system close button or sends a SIGTERM, Pygame posts a pygame.QUIT event to the queue.",
          "id": "q-13-1-pygame-window-game-loop-5-v1"
        },
        "retestMcq": {
          "question": "What does pygame.event.get() do?",
          "options": [
            {
              "id": "A",
              "text": "Removes and returns all pending events from the internal event queue",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Blocks and pauses execution until a key is pressed",
              "explanationIfWrong": "pygame.event.wait() blocks; get() returns immediately with pending events."
            },
            {
              "id": "C",
              "text": "Returns only mouse click events",
              "explanationIfWrong": "It returns all event types (keyboard, mouse, window, joystick)."
            },
            {
              "id": "D",
              "text": "Clears the screen surface",
              "explanationIfWrong": "screen.fill() clears surfaces; event.get() reads input events."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.event.get() empties the event queue and returns a list of all Event objects that occurred since the last call.",
          "id": "q-13-1-pygame-window-game-loop-5-v2"
        },
        "questionPool": [
          {
            "question": "What event type is triggered when the user clicks the window's close (X) button?",
            "options": [
              {
                "id": "A",
                "text": "pygame.QUIT",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.WINDOW_CLOSE",
                "explanationIfWrong": "The standard Pygame constant is pygame.QUIT."
              },
              {
                "id": "C",
                "text": "pygame.EXIT",
                "explanationIfWrong": "Pygame uses pygame.QUIT."
              },
              {
                "id": "D",
                "text": "pygame.KILL",
                "explanationIfWrong": "Invalid event constant."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When the user clicks the operating system close button or sends a SIGTERM, Pygame posts a pygame.QUIT event to the queue.",
            "id": "q-13-1-pygame-window-game-loop-5-v1"
          },
          {
            "question": "What does pygame.event.get() do?",
            "options": [
              {
                "id": "A",
                "text": "Removes and returns all pending events from the internal event queue",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Blocks and pauses execution until a key is pressed",
                "explanationIfWrong": "pygame.event.wait() blocks; get() returns immediately with pending events."
              },
              {
                "id": "C",
                "text": "Returns only mouse click events",
                "explanationIfWrong": "It returns all event types (keyboard, mouse, window, joystick)."
              },
              {
                "id": "D",
                "text": "Clears the screen surface",
                "explanationIfWrong": "screen.fill() clears surfaces; event.get() reads input events."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.event.get() empties the event queue and returns a list of all Event objects that occurred since the last call.",
            "id": "q-13-1-pygame-window-game-loop-5-v2"
          },
          {
            "question": "Why is 'for event in pygame.event.get():' structured as a for-loop rather than an if-statement?",
            "options": [
              {
                "id": "A",
                "text": "Multiple events (e.g. mouse movement and multiple keypresses) can occur in a single frame, so all must be processed",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "if statements cannot inspect event types",
                "explanationIfWrong": "if statements inspect individual events inside the loop."
              },
              {
                "id": "C",
                "text": "Pygame raises an error if an if statement is used",
                "explanationIfWrong": "No error occurs, but events would be missed."
              },
              {
                "id": "D",
                "text": "To make the game run at 60 FPS",
                "explanationIfWrong": "clock.tick() regulates FPS."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Between any two frames, a user might press a key, click a mouse, and resize the window. Looping processes every queued event.",
            "id": "q-13-1-pygame-window-game-loop-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "13-2-rendering-graphics-animation",
    "number": "13.2",
    "title": "Drawing Shapes, Images & Animation",
    "subtitle": "Draw 2D primitives, load sprite surfaces, clear screens, and animate movement across frames.",
    "readTime": "24 min",
    "objectives": [
      "Represent colors using 3-element (R, G, B) tuples with values 0-255",
      "Clear and repaint the display surface every frame with screen.fill()",
      "Draw geometric shapes using pygame.draw (rectangles, circles, lines)",
      "Load external image assets using pygame.image.load() and blit them onto surfaces",
      "Animate sprite motion by updating coordinates and preventing visual ghost trails",
      "Utilize pygame.Rect objects for spatial positioning, dimensions, and center anchoring"
    ],
    "theoryBlocks": [
      {
        "heading": "RGB Color Representation & Screen Clearing",
        "text": "Colors in Pygame are specified as 3-element tuples `(Red, Green, Blue)`, where each color channel is an integer ranging from `0` (no intensity) to `255` (full intensity). For example, `(0, 0, 0)` is Black, `(255, 255, 255)` is White, `(255, 0, 0)` is Red, and `(0, 255, 128)` is Mint Green. At the beginning of every frame's rendering phase, you MUST call `screen.fill(COLOR)` to paint over the previous frame; otherwise, moving objects leave a permanent smeared trail of pixels behind them.",
        "codeSnippet": "import pygame\n\n# Color definitions as (R, G, B) constants\nBLACK = (0, 0, 0)\nWHITE = (255, 255, 255)\nNAVY  = (15, 23, 42)\nNEON  = (0, 255, 157)\n\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\n\n# Paint entire screen with dark navy background\nscreen.fill(NAVY)\npygame.display.flip()\nprint(\"Screen filled with RGB:\", NAVY)\npygame.quit()",
        "terminalOutput": "Screen filled with RGB: (15, 23, 42)",
        "tip": "If a moving sprite leaves an unwanted trail across the window, you forgot to call `screen.fill()` at the start of your rendering phase!",
        "mcq": {
          "question": "What RGB tuple represents pure Yellow in Pygame?",
          "options": [
            {
              "id": "A",
              "text": "(255, 255, 0) [Full Red + Full Green]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "(0, 255, 255)",
              "explanationIfWrong": "(0, 255, 255) is Cyan (Green + Blue)."
            },
            {
              "id": "C",
              "text": "(255, 0, 255)",
              "explanationIfWrong": "(255, 0, 255) is Magenta (Red + Blue)."
            },
            {
              "id": "D",
              "text": "(128, 128, 128)",
              "explanationIfWrong": "(128, 128, 128) is Gray."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In additive RGB color mixing, Red (255) + Green (255) + Blue (0) combines into pure Yellow.",
          "id": "q-13-2-rendering-graphics-animation-0-v1"
        },
        "retestMcq": {
          "question": "Why must screen.fill() be called at the beginning of every frame's rendering phase?",
          "options": [
            {
              "id": "A",
              "text": "To erase the previous frame's drawings so moving sprites don't leave permanent smear trails",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To reset the frame rate to 60 FPS",
              "explanationIfWrong": "clock.tick() handles frame rate."
            },
            {
              "id": "C",
              "text": "To empty the keyboard event queue",
              "explanationIfWrong": "pygame.event.get() clears the event queue."
            },
            {
              "id": "D",
              "text": "To prevent the window from minimizing",
              "explanationIfWrong": "screen.fill() only updates pixel colors."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without clearing the canvas every frame, previously drawn pixels remain on screen, causing moving sprites to leave visual trails.",
          "id": "q-13-2-rendering-graphics-animation-0-v2"
        },
        "questionPool": [
          {
            "question": "What RGB tuple represents pure Yellow in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "(255, 255, 0) [Full Red + Full Green]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "(0, 255, 255)",
                "explanationIfWrong": "(0, 255, 255) is Cyan (Green + Blue)."
              },
              {
                "id": "C",
                "text": "(255, 0, 255)",
                "explanationIfWrong": "(255, 0, 255) is Magenta (Red + Blue)."
              },
              {
                "id": "D",
                "text": "(128, 128, 128)",
                "explanationIfWrong": "(128, 128, 128) is Gray."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In additive RGB color mixing, Red (255) + Green (255) + Blue (0) combines into pure Yellow.",
            "id": "q-13-2-rendering-graphics-animation-0-v1"
          },
          {
            "question": "Why must screen.fill() be called at the beginning of every frame's rendering phase?",
            "options": [
              {
                "id": "A",
                "text": "To erase the previous frame's drawings so moving sprites don't leave permanent smear trails",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To reset the frame rate to 60 FPS",
                "explanationIfWrong": "clock.tick() handles frame rate."
              },
              {
                "id": "C",
                "text": "To empty the keyboard event queue",
                "explanationIfWrong": "pygame.event.get() clears the event queue."
              },
              {
                "id": "D",
                "text": "To prevent the window from minimizing",
                "explanationIfWrong": "screen.fill() only updates pixel colors."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without clearing the canvas every frame, previously drawn pixels remain on screen, causing moving sprites to leave visual trails.",
            "id": "q-13-2-rendering-graphics-animation-0-v2"
          },
          {
            "question": "What is the valid numerical range for each color channel in an RGB tuple in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "0 to 255 inclusive (8-bit integer)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "0.0 to 1.0 (float)",
                "explanationIfWrong": "Some shader engines use 0.0-1.0; Pygame uses 0-255 integers."
              },
              {
                "id": "C",
                "text": "1 to 100 (percentage)",
                "explanationIfWrong": "Pygame color channels are 8-bit bytes (0-255)."
              },
              {
                "id": "D",
                "text": "-128 to 127 (signed byte)",
                "explanationIfWrong": "Color channels are unsigned (0 to 255)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each color channel in standard 24/32-bit color is an unsigned 8-bit integer from 0 to 255.",
            "id": "q-13-2-rendering-graphics-animation-0-v3"
          }
        ]
      },
      {
        "heading": "Drawing Geometric Primitives with pygame.draw",
        "text": "The `pygame.draw` module provides functions to render geometric shapes directly onto any Surface: 1) `pygame.draw.rect(surface, color, rect, width=0)`: draws a rectangle (if `width=0`, it is filled solid); 2) `pygame.draw.circle(surface, color, center_pos, radius, width=0)`: draws a circle around `(x, y)`; 3) `pygame.draw.line(surface, color, start_pos, end_pos, width=1)`: draws a line segment.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\n\nscreen.fill((20, 20, 30))\n\n# 1. Filled rectangle at (x=50, y=50) with width=120, height=60\npygame.draw.rect(screen, (0, 200, 255), (50, 50, 120, 60))\n\n# 2. Outline-only circle with radius=40 and border width=3\npygame.draw.circle(screen, (255, 80, 80), (280, 150), 40, width=3)\n\n# 3. Line connecting two points\npygame.draw.line(screen, (255, 255, 255), (0, 0), (400, 300), width=2)\n\npygame.display.flip()\npygame.quit()",
        "terminalOutput": "Geometric primitives rendered to back buffer.",
        "tip": "Setting `width=0` (the default) produces a solid filled shape; setting `width > 0` draws an outline with that border thickness.",
        "mcq": {
          "question": "In pygame.draw.rect(screen, color, (x, y, w, h), width=0), what does width=0 specify?",
          "options": [
            {
              "id": "A",
              "text": "The rectangle is filled with solid color",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The rectangle is invisible (0 width)",
              "explanationIfWrong": "width=0 is Pygame convention for solid fill."
            },
            {
              "id": "C",
              "text": "The rectangle has a 1-pixel border",
              "explanationIfWrong": "width=1 produces a 1-pixel border."
            },
            {
              "id": "D",
              "text": "The rectangle is drawn with rounded corners",
              "explanationIfWrong": "Rounded corners use the border_radius parameter."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Pygame drawing functions, specifying width=0 fills the entire shape with the solid color.",
          "id": "q-13-2-rendering-graphics-animation-1-v1"
        },
        "retestMcq": {
          "question": "What parameters does pygame.draw.circle() require?",
          "options": [
            {
              "id": "A",
              "text": "surface, color, center_coordinates (x, y), radius",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "surface, color, bounding_box",
              "explanationIfWrong": "rectangles take bounding boxes; circle takes center and radius."
            },
            {
              "id": "C",
              "text": "surface, diameter, color",
              "explanationIfWrong": "radius is used, not diameter."
            },
            {
              "id": "D",
              "text": "color, x, y, width, height",
              "explanationIfWrong": "Surface comes first, followed by color, center, and radius."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The signature is pygame.draw.circle(surface, color, center, radius, width=0).",
          "id": "q-13-2-rendering-graphics-animation-1-v2"
        },
        "questionPool": [
          {
            "question": "In pygame.draw.rect(screen, color, (x, y, w, h), width=0), what does width=0 specify?",
            "options": [
              {
                "id": "A",
                "text": "The rectangle is filled with solid color",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The rectangle is invisible (0 width)",
                "explanationIfWrong": "width=0 is Pygame convention for solid fill."
              },
              {
                "id": "C",
                "text": "The rectangle has a 1-pixel border",
                "explanationIfWrong": "width=1 produces a 1-pixel border."
              },
              {
                "id": "D",
                "text": "The rectangle is drawn with rounded corners",
                "explanationIfWrong": "Rounded corners use the border_radius parameter."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Pygame drawing functions, specifying width=0 fills the entire shape with the solid color.",
            "id": "q-13-2-rendering-graphics-animation-1-v1"
          },
          {
            "question": "What parameters does pygame.draw.circle() require?",
            "options": [
              {
                "id": "A",
                "text": "surface, color, center_coordinates (x, y), radius",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "surface, color, bounding_box",
                "explanationIfWrong": "rectangles take bounding boxes; circle takes center and radius."
              },
              {
                "id": "C",
                "text": "surface, diameter, color",
                "explanationIfWrong": "radius is used, not diameter."
              },
              {
                "id": "D",
                "text": "color, x, y, width, height",
                "explanationIfWrong": "Surface comes first, followed by color, center, and radius."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The signature is pygame.draw.circle(surface, color, center, radius, width=0).",
            "id": "q-13-2-rendering-graphics-animation-1-v2"
          },
          {
            "question": "What 4-element tuple defines the dimensions of a rectangle in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "(x, y, width, height)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "(x1, y1, x2, y2)",
                "explanationIfWrong": "Pygame uses top-left coordinates plus width and height, not two endpoints."
              },
              {
                "id": "C",
                "text": "(width, height, x, y)",
                "explanationIfWrong": "Position (x, y) comes before dimensions (w, h)."
              },
              {
                "id": "D",
                "text": "(top, left, bottom, right)",
                "explanationIfWrong": "The tuple is strictly (x, y, width, height)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A rectangle tuple in Pygame is structured as (x_position, y_position, pixel_width, pixel_height).",
            "id": "q-13-2-rendering-graphics-animation-1-v3"
          }
        ]
      },
      {
        "heading": "Loading & Blitting Image Sprites",
        "text": "For game sprites and background art, load image files (PNG, JPG) using `pygame.image.load('hero.png')`. To optimize rendering performance, immediately convert the loaded surface to match the display pixel format using `.convert()` (for opaque images) or `.convert_alpha()` (for PNGs with transparent backgrounds). To draw an image onto the screen, use `screen.blit(image_surface, (x, y))`. 'Blit' stands for Block Image Transfer.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\n\n# Load and convert image for maximum rendering speed and transparency support\n# hero = pygame.image.load(\"hero.png\").convert_alpha()\n# screen.blit(hero, (100, 150))\n\nprint(\"Syntax: screen.blit(image_surface, (x_pos, y_pos))\")\npygame.quit()",
        "terminalOutput": "Syntax: screen.blit(image_surface, (x_pos, y_pos))",
        "tip": "Always call `.convert_alpha()` on PNG sprites with transparent pixels. Without it, Pygame must convert pixel formats on every single frame, causing significant lag.",
        "mcq": {
          "question": "What method copies and draws one Surface onto another Surface in Pygame?",
          "options": [
            {
              "id": "A",
              "text": "surface.blit()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "surface.draw()",
              "explanationIfWrong": "Drawing shapes is in pygame.draw; drawing surfaces is blit()."
            },
            {
              "id": "C",
              "text": "surface.paste()",
              "explanationIfWrong": "paste() is used in PIL/Pillow, not Pygame."
            },
            {
              "id": "D",
              "text": "surface.render()",
              "explanationIfWrong": "render() is for fonts; blit() is for surfaces."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "blit() (Block Image Transfer) copies the pixels from a source Surface onto a destination Surface at specified coordinates.",
          "id": "q-13-2-rendering-graphics-animation-2-v1"
        },
        "retestMcq": {
          "question": "Why should you call .convert_alpha() immediately after loading a transparent PNG image?",
          "options": [
            {
              "id": "A",
              "text": "It converts the image's pixel format to match the display surface, dramatically accelerating blitting speed while preserving transparency",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It converts the image into a 3D vector model",
              "explanationIfWrong": "Pygame is a 2D engine; convert_alpha handles 2D pixel alignment."
            },
            {
              "id": "C",
              "text": "It resizes the image to fit the screen automatically",
              "explanationIfWrong": "pygame.transform.scale resizes images; convert_alpha does not."
            },
            {
              "id": "D",
              "text": "It compresses the image using ZIP",
              "explanationIfWrong": "It decodes pixels into native display format in RAM."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": ".convert_alpha() matches the image's internal pixel format to the display, allowing hardware-accelerated blitting with transparency.",
          "id": "q-13-2-rendering-graphics-animation-2-v2"
        },
        "questionPool": [
          {
            "question": "What method copies and draws one Surface onto another Surface in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "surface.blit()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "surface.draw()",
                "explanationIfWrong": "Drawing shapes is in pygame.draw; drawing surfaces is blit()."
              },
              {
                "id": "C",
                "text": "surface.paste()",
                "explanationIfWrong": "paste() is used in PIL/Pillow, not Pygame."
              },
              {
                "id": "D",
                "text": "surface.render()",
                "explanationIfWrong": "render() is for fonts; blit() is for surfaces."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "blit() (Block Image Transfer) copies the pixels from a source Surface onto a destination Surface at specified coordinates.",
            "id": "q-13-2-rendering-graphics-animation-2-v1"
          },
          {
            "question": "Why should you call .convert_alpha() immediately after loading a transparent PNG image?",
            "options": [
              {
                "id": "A",
                "text": "It converts the image's pixel format to match the display surface, dramatically accelerating blitting speed while preserving transparency",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It converts the image into a 3D vector model",
                "explanationIfWrong": "Pygame is a 2D engine; convert_alpha handles 2D pixel alignment."
              },
              {
                "id": "C",
                "text": "It resizes the image to fit the screen automatically",
                "explanationIfWrong": "pygame.transform.scale resizes images; convert_alpha does not."
              },
              {
                "id": "D",
                "text": "It compresses the image using ZIP",
                "explanationIfWrong": "It decodes pixels into native display format in RAM."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": ".convert_alpha() matches the image's internal pixel format to the display, allowing hardware-accelerated blitting with transparency.",
            "id": "q-13-2-rendering-graphics-animation-2-v2"
          },
          {
            "question": "If screen.blit(sprite, (50, 100)) is executed, where does the sprite appear?",
            "options": [
              {
                "id": "A",
                "text": "With its top-left corner positioned at pixel (50, 100)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "With its center positioned at (50, 100)",
                "explanationIfWrong": "blit anchors by default to the top-left corner of the sprite surface."
              },
              {
                "id": "C",
                "text": "With its bottom-right corner at (50, 100)",
                "explanationIfWrong": "Default anchor is top-left."
              },
              {
                "id": "D",
                "text": "At a random position within 50x100 pixels",
                "explanationIfWrong": "Coordinates are exact pixel offsets."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "blit(surface, (x, y)) places the top-left corner of the source surface at coordinates (x, y) on the target surface.",
            "id": "q-13-2-rendering-graphics-animation-2-v3"
          }
        ]
      },
      {
        "heading": "Principles of Animation & Boundary Bouncing",
        "text": "Animation in computer games is the illusion of movement created by slightly altering coordinates between successive frames. To make an object move horizontally, add velocity to its X coordinate: `x += speed`. To bounce off window boundaries, check if the object has hit an edge: if `x <= 0` (left edge) or `x + width >= SCREEN_WIDTH` (right edge), invert the velocity: `speed = -speed`.",
        "codeSnippet": "x = 100\nspeed_x = 5\nball_radius = 20\nSCREEN_WIDTH = 640\n\n# Simulated frame update\nfor frame in range(4):\n    x += speed_x\n    # Boundary collision check\n    if x + ball_radius >= SCREEN_WIDTH or x - ball_radius <= 0:\n        speed_x = -speed_x  # Reverse direction\n    print(f\"Frame {frame}: Ball X = {x}, Velocity = {speed_x}\")",
        "terminalOutput": "Frame 0: Ball X = 105, Velocity = 5\nFrame 1: Ball X = 110, Velocity = 5\nFrame 2: Ball X = 115, Velocity = 5\nFrame 3: Ball X = 120, Velocity = 5",
        "tip": "Multiplying velocity by `-1` (`vx = -vx`) reverses horizontal movement; `vy = -vy` reverses vertical movement.",
        "mcq": {
          "question": "How do you reverse the horizontal movement direction of a bouncing ball sprite?",
          "options": [
            {
              "id": "A",
              "text": "velocity_x = -velocity_x (multiply horizontal velocity by -1)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "x = 0",
              "explanationIfWrong": "Resetting x teleports the ball to the left edge rather than bouncing."
            },
            {
              "id": "C",
              "text": "velocity_y = -velocity_y",
              "explanationIfWrong": "velocity_y controls vertical up/down movement."
            },
            {
              "id": "D",
              "text": "velocity_x = 0",
              "explanationIfWrong": "Setting velocity to 0 stops the ball completely."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Negating the velocity vector component inverts the direction of movement along that axis.",
          "id": "q-13-2-rendering-graphics-animation-3-v1"
        },
        "retestMcq": {
          "question": "Given SCREEN_WIDTH = 800 and sprite_width = 50, what condition tests if the sprite has hit the right screen edge?",
          "options": [
            {
              "id": "A",
              "text": "x + sprite_width >= SCREEN_WIDTH",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "x >= SCREEN_WIDTH",
              "explanationIfWrong": "This allows the sprite to be completely off-screen before triggering."
            },
            {
              "id": "C",
              "text": "x == 0",
              "explanationIfWrong": "x == 0 is the left edge."
            },
            {
              "id": "D",
              "text": "x - sprite_width >= 800",
              "explanationIfWrong": "x + sprite_width represents the rightmost edge of the sprite."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since x is the left edge of the sprite, x + sprite_width is its right edge. Reaching SCREEN_WIDTH means it hit the right boundary.",
          "id": "q-13-2-rendering-graphics-animation-3-v2"
        },
        "questionPool": [
          {
            "question": "How do you reverse the horizontal movement direction of a bouncing ball sprite?",
            "options": [
              {
                "id": "A",
                "text": "velocity_x = -velocity_x (multiply horizontal velocity by -1)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "x = 0",
                "explanationIfWrong": "Resetting x teleports the ball to the left edge rather than bouncing."
              },
              {
                "id": "C",
                "text": "velocity_y = -velocity_y",
                "explanationIfWrong": "velocity_y controls vertical up/down movement."
              },
              {
                "id": "D",
                "text": "velocity_x = 0",
                "explanationIfWrong": "Setting velocity to 0 stops the ball completely."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Negating the velocity vector component inverts the direction of movement along that axis.",
            "id": "q-13-2-rendering-graphics-animation-3-v1"
          },
          {
            "question": "Given SCREEN_WIDTH = 800 and sprite_width = 50, what condition tests if the sprite has hit the right screen edge?",
            "options": [
              {
                "id": "A",
                "text": "x + sprite_width >= SCREEN_WIDTH",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "x >= SCREEN_WIDTH",
                "explanationIfWrong": "This allows the sprite to be completely off-screen before triggering."
              },
              {
                "id": "C",
                "text": "x == 0",
                "explanationIfWrong": "x == 0 is the left edge."
              },
              {
                "id": "D",
                "text": "x - sprite_width >= 800",
                "explanationIfWrong": "x + sprite_width represents the rightmost edge of the sprite."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since x is the left edge of the sprite, x + sprite_width is its right edge. Reaching SCREEN_WIDTH means it hit the right boundary.",
            "id": "q-13-2-rendering-graphics-animation-3-v2"
          },
          {
            "question": "If speed = 4 pixels/frame at 60 FPS, how many pixels does the sprite travel in 1 second?",
            "options": [
              {
                "id": "A",
                "text": "240 pixels (4 pixels * 60 frames)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "64 pixels",
                "explanationIfWrong": "4 * 60 = 240 pixels."
              },
              {
                "id": "C",
                "text": "15 pixels",
                "explanationIfWrong": "60 / 4 is 15; travel distance is speed multiplied by frames."
              },
              {
                "id": "D",
                "text": "400 pixels",
                "explanationIfWrong": "4 * 60 = 240."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "At 60 frames per second with 4 pixels moved per frame, total distance in one second is 4 * 60 = 240 pixels.",
            "id": "q-13-2-rendering-graphics-animation-3-v3"
          }
        ]
      },
      {
        "heading": "Working with pygame.Rect Objects",
        "text": "The `pygame.Rect(x, y, width, height)` class is one of Pygame's most powerful tools. A `Rect` represents a 2D rectangular area and provides dozens of virtual convenience attributes: `.x`, `.y`, `.top`, `.bottom`, `.left`, `.right`, `.center`, `.midtop`, `.centerx`, `.size`. Changing any attribute (such as `rect.center = (320, 240)`) automatically recalculates all other coordinates! You can pass a `Rect` directly to `pygame.draw.rect()` and `screen.blit()`.",
        "codeSnippet": "import pygame\n\n# Create a Rect positioned at (100, 100) with size 50x50\nplayer_rect = pygame.Rect(100, 100, 50, 50)\n\nprint(\"Initial top-left:\", player_rect.topleft)\nprint(\"Initial center:  \", player_rect.center)\n\n# Center the rectangle in a 640x480 screen with ONE line of code:\nplayer_rect.center = (320, 240)\n\nprint(\"Centered topleft:\", player_rect.topleft)\nprint(\"Centered center: \", player_rect.center)",
        "terminalOutput": "Initial top-left: (100, 100)\nInitial center:   (125, 125)\nCentered topleft: (295, 215)\nCentered center:  (320, 240)",
        "tip": "Assigning to `rect.center` or `rect.midbottom` is the cleanest way to position sprites without manual coordinate math.",
        "mcq": {
          "question": "What happens when you assign a new coordinate to rect.center = (400, 300) in Pygame?",
          "options": [
            {
              "id": "A",
              "text": "Pygame automatically recalculates rect.x, rect.y, rect.top, rect.bottom to center the rectangle at that point",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The rectangle size shrinks to 0",
              "explanationIfWrong": "Dimensions (width and height) remain unchanged."
            },
            {
              "id": "C",
              "text": "It raises an AttributeError because center is read-only",
              "explanationIfWrong": "center is fully mutable in Pygame Rects."
            },
            {
              "id": "D",
              "text": "It moves only the center point while leaving borders in place",
              "explanationIfWrong": "The entire rectangle moves to center on that point."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Pygame Rect virtual attributes automatically shift the rectangle so its center matches the assigned coordinate.",
          "id": "q-13-2-rendering-graphics-animation-4-v1"
        },
        "retestMcq": {
          "question": "How can you get a Rect matching the exact dimensions of a loaded image surface?",
          "options": [
            {
              "id": "A",
              "text": "image.get_rect()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "image.to_rect()",
              "explanationIfWrong": "The method is named get_rect()."
            },
            {
              "id": "C",
              "text": "pygame.Rect(image)",
              "explanationIfWrong": "Rect constructor requires x, y, width, height numbers."
            },
            {
              "id": "D",
              "text": "image.bounds",
              "explanationIfWrong": "get_rect() is the standard method."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "surface.get_rect() returns a new Rect starting at (0, 0) with width and height matching the surface.",
          "id": "q-13-2-rendering-graphics-animation-4-v2"
        },
        "questionPool": [
          {
            "question": "What happens when you assign a new coordinate to rect.center = (400, 300) in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "Pygame automatically recalculates rect.x, rect.y, rect.top, rect.bottom to center the rectangle at that point",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The rectangle size shrinks to 0",
                "explanationIfWrong": "Dimensions (width and height) remain unchanged."
              },
              {
                "id": "C",
                "text": "It raises an AttributeError because center is read-only",
                "explanationIfWrong": "center is fully mutable in Pygame Rects."
              },
              {
                "id": "D",
                "text": "It moves only the center point while leaving borders in place",
                "explanationIfWrong": "The entire rectangle moves to center on that point."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Pygame Rect virtual attributes automatically shift the rectangle so its center matches the assigned coordinate.",
            "id": "q-13-2-rendering-graphics-animation-4-v1"
          },
          {
            "question": "How can you get a Rect matching the exact dimensions of a loaded image surface?",
            "options": [
              {
                "id": "A",
                "text": "image.get_rect()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "image.to_rect()",
                "explanationIfWrong": "The method is named get_rect()."
              },
              {
                "id": "C",
                "text": "pygame.Rect(image)",
                "explanationIfWrong": "Rect constructor requires x, y, width, height numbers."
              },
              {
                "id": "D",
                "text": "image.bounds",
                "explanationIfWrong": "get_rect() is the standard method."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "surface.get_rect() returns a new Rect starting at (0, 0) with width and height matching the surface.",
            "id": "q-13-2-rendering-graphics-animation-4-v2"
          },
          {
            "question": "If a Rect has x=100, y=50, width=40, height=30, what is the value of rect.bottom?",
            "options": [
              {
                "id": "A",
                "text": "80 (y + height = 50 + 30)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "50",
                "explanationIfWrong": "50 is rect.top."
              },
              {
                "id": "C",
                "text": "140",
                "explanationIfWrong": "140 is rect.right (x + width = 100 + 40)."
              },
              {
                "id": "D",
                "text": "30",
                "explanationIfWrong": "30 is rect.height."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "rect.bottom is the Y coordinate of the bottom edge: y + height = 50 + 30 = 80.",
            "id": "q-13-2-rendering-graphics-animation-4-v3"
          }
        ]
      },
      {
        "heading": "Rotating & Scaling Surfaces with pygame.transform",
        "text": "Pygame surfaces can be modified using functions in the pygame.transform module. pygame.transform.scale() stretches or shrinks a surface to a new (width, height) pixel dimension, while pygame.transform.rotate() rotates a surface counter-clockwise by a specified angle in degrees. Because rotation changes the dimensions of the bounding box, rotating around an entity's center requires recalculating the rect center after transformation.",
        "codeSnippet": "import pygame\n\n# Load original sprite image\noriginal_image = pygame.image.load('spaceship.png')\n\n# Scale surface to new size\nsmall_image = pygame.transform.scale(original_image, (40, 40))\n\n# Rotate surface by angle (degrees, counter-clockwise)\nangle = 45\nrotated_image = pygame.transform.rotate(small_image, angle)\nnew_rect = rotated_image.get_rect(center=(200, 150))",
        "terminalOutput": "Surface transformed: 40x40 -> rotated bounding rect 56x56",
        "tip": "Always rotate from the original un-rotated image each frame to avoid cumulative distortion and degradation.",
        "mcq": {
          "question": "Why should you always rotate from the original surface rather than repeatedly rotating the already-rotated surface?",
          "options": [
            { "id": "A", "text": "Repeated rotations cause cumulative loss of image resolution and progressive distortion", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "Pygame crashes if a surface is rotated more than once", "explanationIfWrong": "It does not crash, but visual quality deteriorates rapidly." },
            { "id": "C", "text": "pygame.transform.rotate only works once per game loop", "explanationIfWrong": "It can be called as often as needed." },
            { "id": "D", "text": "It inverts RGB color values", "explanationIfWrong": "Rotation affects geometry, not color values." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Each pixel grid rotation samples approximations; rotating an already rotated image compounds quantization errors, turning it into blurry noise.",
          "id": "q-13-2-rendering-graphics-animation-5-v1"
        },
        "retestMcq": {
          "question": "What happens to the bounding rectangle dimensions when a non-square surface is rotated by 45 degrees?",
          "options": [
            { "id": "A", "text": "The width and height of the new bounding box increase to encompass the angled corners", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "The dimensions stay exactly the same", "explanationIfWrong": "Angled bounding boxes are strictly axis-aligned and expand." },
            { "id": "C", "text": "The surface is automatically cropped to its original dimensions", "explanationIfWrong": "Pygame creates a larger surface to prevent clipping." },
            { "id": "D", "text": "The surface becomes 1x1 pixel", "explanationIfWrong": "Surface size adapts to contain the rotated content." }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.transform.rotate returns a new, larger axis-aligned bounding box so none of the rotated sprite pixels are clipped.",
          "id": "q-13-2-rendering-graphics-animation-5-v2"
        },
        "questionPool": [
          {
            "question": "Why should you always rotate from the original surface rather than repeatedly rotating the already-rotated surface?",
            "options": [
              { "id": "A", "text": "Repeated rotations cause cumulative loss of image resolution and progressive distortion", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "Pygame crashes if a surface is rotated more than once", "explanationIfWrong": "It does not crash, but visual quality deteriorates rapidly." },
              { "id": "C", "text": "pygame.transform.rotate only works once per game loop", "explanationIfWrong": "It can be called as often as needed." },
              { "id": "D", "text": "It inverts RGB color values", "explanationIfWrong": "Rotation affects geometry, not color values." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Each pixel grid rotation samples approximations; rotating an already rotated image compounds quantization errors, turning it into blurry noise.",
            "id": "q-13-2-rendering-graphics-animation-5-v1"
          },
          {
            "question": "What happens to the bounding rectangle dimensions when a non-square surface is rotated by 45 degrees?",
            "options": [
              { "id": "A", "text": "The width and height of the new bounding box increase to encompass the angled corners", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "The dimensions stay exactly the same", "explanationIfWrong": "Angled bounding boxes are strictly axis-aligned and expand." },
              { "id": "C", "text": "The surface is automatically cropped to its original dimensions", "explanationIfWrong": "Pygame creates a larger surface to prevent clipping." },
              { "id": "D", "text": "The surface becomes 1x1 pixel", "explanationIfWrong": "Surface size adapts to contain the rotated content." }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.transform.rotate returns a new, larger axis-aligned bounding box so none of the rotated sprite pixels are clipped.",
            "id": "q-13-2-rendering-graphics-animation-5-v2"
          }
        ]
      }
    ]
  },
  {
    "id": "13-3-keyboard-mouse-events",
    "number": "13.3",
    "title": "Keyboard & Mouse Input Handling",
    "subtitle": "Capture discrete key presses, continuous key holds, mouse clicks, and cursor movements.",
    "readTime": "24 min",
    "objectives": [
      "Contrast discrete event polling (KEYDOWN) with continuous state polling (get_pressed())",
      "Inspect event.key codes such as pygame.K_LEFT, pygame.K_SPACE, pygame.K_ESCAPE",
      "Implement responsive, smooth character movement using continuous key states",
      "Track cursor coordinates and handle mouse motion events (pygame.MOUSEMOTION)",
      "Detect mouse button clicks and point collisions with rect.collidepoint(event.pos)",
      "Construct interactive clickable UI buttons with hover color transitions"
    ],
    "theoryBlocks": [
      {
        "heading": "Discrete vs Continuous Input",
        "text": "A fundamental distinction in game programming is between DISCRETE events and CONTINUOUS state: 1) Discrete events (`pygame.KEYDOWN`) fire ONCE when a key is initially pressed down. They are ideal for one-time actions like firing a laser, jumping, opening an inventory menu, or pausing the game. 2) Continuous state (`pygame.key.get_pressed()`) returns a snapshot of which keys are currently being held down. It is ideal for continuous operations like walking or driving a car.",
        "codeSnippet": "# 1. Discrete event (inside event queue loop)\n# if event.type == pygame.KEYDOWN:\n#     if event.key == pygame.K_SPACE:\n#         player.shoot_laser()  # Fires once per tap!\n\n# 2. Continuous state (outside event loop, in update phase)\n# keys = pygame.key.get_pressed()\n# if keys[pygame.K_RIGHT]:\n#     player.x += speed        # Moves smoothly every frame key is held!",
        "terminalOutput": "Discrete: Fires once on press. Continuous: Applies every frame held.",
        "tip": "Use `KEYDOWN` for jumping or shooting; use `pygame.key.get_pressed()` for smooth walking and steering.",
        "mcq": {
          "question": "Which input technique should you use for firing a weapon that shoots once per key tap?",
          "options": [
            {
              "id": "A",
              "text": "Discrete event checking (if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Continuous state polling (keys[pygame.K_SPACE])",
              "explanationIfWrong": "Continuous polling would fire every frame (~60 bullets per second) while held."
            },
            {
              "id": "C",
              "text": "mouse.get_visible()",
              "explanationIfWrong": "Visibility does not detect key taps."
            },
            {
              "id": "D",
              "text": "clock.tick()",
              "explanationIfWrong": "clock controls FPS, not input."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "KEYDOWN events fire exactly once when the key is pressed down, preventing unintended machine-gun repetition on single taps.",
          "id": "q-13-3-keyboard-mouse-events-0-v1"
        },
        "retestMcq": {
          "question": "Why is pygame.key.get_pressed() superior to KEYDOWN for moving a character smoothly across the screen?",
          "options": [
            {
              "id": "A",
              "text": "It checks if the key is currently held down on every frame, eliminating operating system key repeat delays",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It uses less electricity",
              "explanationIfWrong": "Power consumption is unaffected."
            },
            {
              "id": "C",
              "text": "It automatically detects wall collisions",
              "explanationIfWrong": "Collisions require explicit geometry checks."
            },
            {
              "id": "D",
              "text": "KEYDOWN does not work for arrow keys",
              "explanationIfWrong": "KEYDOWN works for all keys, but repeats depend on OS settings."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.key.get_pressed() returns the real-time held state of all keys, allowing smooth, continuous movement on every frame.",
          "id": "q-13-3-keyboard-mouse-events-0-v2"
        },
        "questionPool": [
          {
            "question": "Which input technique should you use for firing a weapon that shoots once per key tap?",
            "options": [
              {
                "id": "A",
                "text": "Discrete event checking (if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Continuous state polling (keys[pygame.K_SPACE])",
                "explanationIfWrong": "Continuous polling would fire every frame (~60 bullets per second) while held."
              },
              {
                "id": "C",
                "text": "mouse.get_visible()",
                "explanationIfWrong": "Visibility does not detect key taps."
              },
              {
                "id": "D",
                "text": "clock.tick()",
                "explanationIfWrong": "clock controls FPS, not input."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "KEYDOWN events fire exactly once when the key is pressed down, preventing unintended machine-gun repetition on single taps.",
            "id": "q-13-3-keyboard-mouse-events-0-v1"
          },
          {
            "question": "Why is pygame.key.get_pressed() superior to KEYDOWN for moving a character smoothly across the screen?",
            "options": [
              {
                "id": "A",
                "text": "It checks if the key is currently held down on every frame, eliminating operating system key repeat delays",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It uses less electricity",
                "explanationIfWrong": "Power consumption is unaffected."
              },
              {
                "id": "C",
                "text": "It automatically detects wall collisions",
                "explanationIfWrong": "Collisions require explicit geometry checks."
              },
              {
                "id": "D",
                "text": "KEYDOWN does not work for arrow keys",
                "explanationIfWrong": "KEYDOWN works for all keys, but repeats depend on OS settings."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.key.get_pressed() returns the real-time held state of all keys, allowing smooth, continuous movement on every frame.",
            "id": "q-13-3-keyboard-mouse-events-0-v2"
          },
          {
            "question": "What data type does pygame.key.get_pressed() return?",
            "options": [
              {
                "id": "A",
                "text": "A sequence/tuple of booleans where each key constant index is True (held) or False",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A string of pressed characters",
                "explanationIfWrong": "It returns a sequence indexed by key constants."
              },
              {
                "id": "C",
                "text": "A list of event objects",
                "explanationIfWrong": "event.get() returns event objects; get_pressed() returns boolean states."
              },
              {
                "id": "D",
                "text": "An integer keycode",
                "explanationIfWrong": "It covers all keyboard keys simultaneously."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "get_pressed() returns a sequence indexed by constants like pygame.K_UP, where True indicates the key is currently held down.",
            "id": "q-13-3-keyboard-mouse-events-0-v3"
          }
        ]
      },
      {
        "heading": "Discrete Key Press Events & Key Constants",
        "text": "Inside the event loop, whenever `event.type == pygame.KEYDOWN`, the `event.key` attribute contains an integer identifier representing the specific key that was pressed. Pygame defines constants for every physical key on standard keyboards: `pygame.K_LEFT`, `pygame.K_RIGHT`, `pygame.K_UP`, `pygame.K_DOWN`, `pygame.K_SPACE`, `pygame.K_ESCAPE`, `pygame.K_w`, `pygame.K_a`, `pygame.K_s`, `pygame.K_d`, `pygame.K_RETURN`.",
        "codeSnippet": "import pygame\n\n# Simulating event handling\n# for event in pygame.event.get():\n#     if event.type == pygame.KEYDOWN:\n#         if event.key == pygame.K_ESCAPE:\n#             running = False  # Pressing ESC exits game\n#         elif event.key == pygame.K_r:\n#             restart_level()  # Pressing 'R' restarts level\n\nprint(\"Key constants: pygame.K_ESCAPE, pygame.K_SPACE, pygame.K_RETURN\")",
        "terminalOutput": "Key constants: pygame.K_ESCAPE, pygame.K_SPACE, pygame.K_RETURN",
        "tip": "Always allow players to exit or pause the game cleanly using `pygame.K_ESCAPE`.",
        "mcq": {
          "question": "What Pygame constant represents the Spacebar key?",
          "options": [
            {
              "id": "A",
              "text": "pygame.K_SPACE",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.K_SPACEBAR",
              "explanationIfWrong": "The constant is pygame.K_SPACE."
            },
            {
              "id": "C",
              "text": "pygame.KEY_SPACE",
              "explanationIfWrong": "Pygame key constants start with K_, not KEY_."
            },
            {
              "id": "D",
              "text": "pygame.SPACE",
              "explanationIfWrong": "Invalid constant."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Spacebar constant in Pygame is pygame.K_SPACE.",
          "id": "q-13-3-keyboard-mouse-events-1-v1"
        },
        "retestMcq": {
          "question": "How do you detect when a player RELEASES a key that they had been holding down?",
          "options": [
            {
              "id": "A",
              "text": "Check for event.type == pygame.KEYUP",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Check for event.type == pygame.KEYRELEASE",
              "explanationIfWrong": "Pygame uses pygame.KEYUP."
            },
            {
              "id": "C",
              "text": "Check for event.key == False",
              "explanationIfWrong": "event.key is an integer keycode."
            },
            {
              "id": "D",
              "text": "Check for pygame.key.released()",
              "explanationIfWrong": "No such function exists."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.KEYUP is dispatched when a previously depressed key is released.",
          "id": "q-13-3-keyboard-mouse-events-1-v2"
        },
        "questionPool": [
          {
            "question": "What Pygame constant represents the Spacebar key?",
            "options": [
              {
                "id": "A",
                "text": "pygame.K_SPACE",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.K_SPACEBAR",
                "explanationIfWrong": "The constant is pygame.K_SPACE."
              },
              {
                "id": "C",
                "text": "pygame.KEY_SPACE",
                "explanationIfWrong": "Pygame key constants start with K_, not KEY_."
              },
              {
                "id": "D",
                "text": "pygame.SPACE",
                "explanationIfWrong": "Invalid constant."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Spacebar constant in Pygame is pygame.K_SPACE.",
            "id": "q-13-3-keyboard-mouse-events-1-v1"
          },
          {
            "question": "How do you detect when a player RELEASES a key that they had been holding down?",
            "options": [
              {
                "id": "A",
                "text": "Check for event.type == pygame.KEYUP",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Check for event.type == pygame.KEYRELEASE",
                "explanationIfWrong": "Pygame uses pygame.KEYUP."
              },
              {
                "id": "C",
                "text": "Check for event.key == False",
                "explanationIfWrong": "event.key is an integer keycode."
              },
              {
                "id": "D",
                "text": "Check for pygame.key.released()",
                "explanationIfWrong": "No such function exists."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.KEYUP is dispatched when a previously depressed key is released.",
            "id": "q-13-3-keyboard-mouse-events-1-v2"
          },
          {
            "question": "What is the standard key constant for the Escape key in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "pygame.K_ESCAPE",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.K_ESC",
                "explanationIfWrong": "The full word pygame.K_ESCAPE is used."
              },
              {
                "id": "C",
                "text": "pygame.ESCAPE",
                "explanationIfWrong": "Key constants use the K_ prefix."
              },
              {
                "id": "D",
                "text": "pygame.KEY_ESCAPE",
                "explanationIfWrong": "Prefix is K_, not KEY_."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Escape key constant is pygame.K_ESCAPE.",
            "id": "q-13-3-keyboard-mouse-events-1-v3"
          }
        ]
      },
      {
        "heading": "Mouse Motion & Cursor Tracking",
        "text": "Pygame allows you to track mouse movements in two ways: 1) Through the event queue by listening for `pygame.MOUSEMOTION`, where `event.pos` contains the current `(x, y)` pixel coordinates of the cursor and `event.rel` contains relative movement `(dx, dy)`; 2) Polling continuous coordinates anywhere in code via `mouse_x, mouse_y = pygame.mouse.get_pos()`. This is essential for crosshairs, cursor-following sprites, and aim mechanics.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\n\n# Continuous mouse position query\npos = pygame.mouse.get_pos()\nprint(\"Current cursor position:\", pos)\n\n# Hide OS cursor to draw custom crosshair sprite\npygame.mouse.set_visible(False)\nprint(\"OS cursor hidden for custom crosshair rendering\")\n\npygame.quit()",
        "terminalOutput": "Current cursor position: (0, 0)\nOS cursor hidden for custom crosshair rendering",
        "tip": "Use `pygame.mouse.set_visible(False)` when you want to render a custom animated crosshair sprite in place of the default OS cursor.",
        "mcq": {
          "question": "What function returns the current (x, y) coordinates of the mouse cursor at any time?",
          "options": [
            {
              "id": "A",
              "text": "pygame.mouse.get_pos()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.cursor.coordinates()",
              "explanationIfWrong": "Invalid module function."
            },
            {
              "id": "C",
              "text": "screen.get_mouse()",
              "explanationIfWrong": "Surface objects do not track mouse positions."
            },
            {
              "id": "D",
              "text": "pygame.get_mouse_position()",
              "explanationIfWrong": "The function is located in the pygame.mouse module."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.mouse.get_pos() returns a tuple (x, y) of the cursor's current position within the window.",
          "id": "q-13-3-keyboard-mouse-events-2-v1"
        },
        "retestMcq": {
          "question": "How do you hide the standard operating system cursor inside the game window?",
          "options": [
            {
              "id": "A",
              "text": "pygame.mouse.set_visible(False)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.cursor.hide()",
              "explanationIfWrong": "The function is pygame.mouse.set_visible()."
            },
            {
              "id": "C",
              "text": "screen.cursor = None",
              "explanationIfWrong": "Surfaces do not have a cursor property."
            },
            {
              "id": "D",
              "text": "pygame.display.hide_cursor()",
              "explanationIfWrong": "Cursor settings reside in pygame.mouse."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.mouse.set_visible(False) hides the default operating system pointer.",
          "id": "q-13-3-keyboard-mouse-events-2-v2"
        },
        "questionPool": [
          {
            "question": "What function returns the current (x, y) coordinates of the mouse cursor at any time?",
            "options": [
              {
                "id": "A",
                "text": "pygame.mouse.get_pos()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.cursor.coordinates()",
                "explanationIfWrong": "Invalid module function."
              },
              {
                "id": "C",
                "text": "screen.get_mouse()",
                "explanationIfWrong": "Surface objects do not track mouse positions."
              },
              {
                "id": "D",
                "text": "pygame.get_mouse_position()",
                "explanationIfWrong": "The function is located in the pygame.mouse module."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.mouse.get_pos() returns a tuple (x, y) of the cursor's current position within the window.",
            "id": "q-13-3-keyboard-mouse-events-2-v1"
          },
          {
            "question": "How do you hide the standard operating system cursor inside the game window?",
            "options": [
              {
                "id": "A",
                "text": "pygame.mouse.set_visible(False)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.cursor.hide()",
                "explanationIfWrong": "The function is pygame.mouse.set_visible()."
              },
              {
                "id": "C",
                "text": "screen.cursor = None",
                "explanationIfWrong": "Surfaces do not have a cursor property."
              },
              {
                "id": "D",
                "text": "pygame.display.hide_cursor()",
                "explanationIfWrong": "Cursor settings reside in pygame.mouse."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.mouse.set_visible(False) hides the default operating system pointer.",
            "id": "q-13-3-keyboard-mouse-events-2-v2"
          },
          {
            "question": "In a pygame.MOUSEMOTION event, what does event.rel represent?",
            "options": [
              {
                "id": "A",
                "text": "The relative movement (change in x, change in y) since the previous event",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The absolute screen position",
                "explanationIfWrong": "event.pos is the absolute position; event.rel is relative delta."
              },
              {
                "id": "C",
                "text": "The mouse button release status",
                "explanationIfWrong": "rel stands for relative motion."
              },
              {
                "id": "D",
                "text": "The reliability of the mouse hardware",
                "explanationIfWrong": "rel means relative displacement."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "event.rel provides (dx, dy), indicating how many pixels the mouse shifted since the previous mouse event.",
            "id": "q-13-3-keyboard-mouse-events-2-v3"
          }
        ]
      },
      {
        "heading": "Mouse Clicks & Point Collisions",
        "text": "When the user clicks a mouse button, Pygame emits a `pygame.MOUSEBUTTONDOWN` event. The attribute `event.button` indicates which button was clicked: `1` is Left Click, `2` is Middle/Scroll Wheel Click, `3` is Right Click, `4` is Scroll Up, and `5` is Scroll Down. The attribute `event.pos` gives the `(x, y)` coordinate. To check if a click occurred inside a UI element (like a button or sprite), use `rect.collidepoint(event.pos)`.",
        "codeSnippet": "import pygame\n\nbutton_rect = pygame.Rect(100, 50, 120, 40)\n\n# Simulated click at (150, 70) which is inside the button\nclick_pos = (150, 70)\nif button_rect.collidepoint(click_pos):\n    print(\"Button clicked successfully!\")\nelse:\n    print(\"Click missed the button.\")",
        "terminalOutput": "Button clicked successfully!",
        "tip": "`rect.collidepoint(point)` returns `True` if the (x, y) point lies inside the rectangle boundaries.",
        "mcq": {
          "question": "What integer value represents the Left Mouse Button in event.button during a MOUSEBUTTONDOWN event?",
          "options": [
            {
              "id": "A",
              "text": "1",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "0",
              "explanationIfWrong": "Pygame mouse buttons are 1-indexed; 1 is left click."
            },
            {
              "id": "C",
              "text": "2",
              "explanationIfWrong": "2 is the middle scroll wheel button."
            },
            {
              "id": "D",
              "text": "3",
              "explanationIfWrong": "3 is the right mouse button."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Pygame, mouse buttons are 1 for left click, 2 for middle click, and 3 for right click.",
          "id": "q-13-3-keyboard-mouse-events-3-v1"
        },
        "retestMcq": {
          "question": "How do you test if a mouse click occurred inside a button rectangle named btn_rect?",
          "options": [
            {
              "id": "A",
              "text": "btn_rect.collidepoint(event.pos)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "event.pos.inside(btn_rect)",
              "explanationIfWrong": "Tuples do not have an inside() method."
            },
            {
              "id": "C",
              "text": "btn_rect.contains(mouse)",
              "explanationIfWrong": "The Rect method is collidepoint()."
            },
            {
              "id": "D",
              "text": "pygame.mouse.hits(btn_rect)",
              "explanationIfWrong": "The check is performed using the Rect's collidepoint method."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Rect.collidepoint((x, y)) tests whether the given coordinate point is located inside the rectangle.",
          "id": "q-13-3-keyboard-mouse-events-3-v2"
        },
        "questionPool": [
          {
            "question": "What integer value represents the Left Mouse Button in event.button during a MOUSEBUTTONDOWN event?",
            "options": [
              {
                "id": "A",
                "text": "1",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "0",
                "explanationIfWrong": "Pygame mouse buttons are 1-indexed; 1 is left click."
              },
              {
                "id": "C",
                "text": "2",
                "explanationIfWrong": "2 is the middle scroll wheel button."
              },
              {
                "id": "D",
                "text": "3",
                "explanationIfWrong": "3 is the right mouse button."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Pygame, mouse buttons are 1 for left click, 2 for middle click, and 3 for right click.",
            "id": "q-13-3-keyboard-mouse-events-3-v1"
          },
          {
            "question": "How do you test if a mouse click occurred inside a button rectangle named btn_rect?",
            "options": [
              {
                "id": "A",
                "text": "btn_rect.collidepoint(event.pos)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "event.pos.inside(btn_rect)",
                "explanationIfWrong": "Tuples do not have an inside() method."
              },
              {
                "id": "C",
                "text": "btn_rect.contains(mouse)",
                "explanationIfWrong": "The Rect method is collidepoint()."
              },
              {
                "id": "D",
                "text": "pygame.mouse.hits(btn_rect)",
                "explanationIfWrong": "The check is performed using the Rect's collidepoint method."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Rect.collidepoint((x, y)) tests whether the given coordinate point is located inside the rectangle.",
            "id": "q-13-3-keyboard-mouse-events-3-v2"
          },
          {
            "question": "What does pygame.mouse.get_pressed() return?",
            "options": [
              {
                "id": "A",
                "text": "A 3-element tuple of booleans (left, middle, right) indicating which mouse buttons are held down",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The (x, y) cursor position",
                "explanationIfWrong": "pygame.mouse.get_pos() returns coordinates."
              },
              {
                "id": "C",
                "text": "An integer 1, 2, or 3",
                "explanationIfWrong": "It returns a tuple of booleans for all 3 buttons."
              },
              {
                "id": "D",
                "text": "The scroll wheel speed",
                "explanationIfWrong": "It reports button states."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.mouse.get_pressed() returns (left_held, middle_held, right_held) as booleans.",
            "id": "q-13-3-keyboard-mouse-events-3-v3"
          }
        ]
      },
      {
        "heading": "Building Interactive UI Buttons",
        "text": "A standard interactive UI button in Pygame combines a `Rect` boundary, text rendering via `pygame.font.SysFont()`, and state checking: 1) On every frame, check if `button_rect.collidepoint(pygame.mouse.get_pos())`; if True, draw the button with a lighter 'hover' color; 2) In the event loop, if `event.type == pygame.MOUSEBUTTONDOWN` and `event.button == 1` and `button_rect.collidepoint(event.pos)`, trigger the button's action.",
        "codeSnippet": "import pygame\n\npygame.init()\nfont = pygame.font.SysFont(\"Arial\", 24)\n\n# Create button rect\nbtn_rect = pygame.Rect(50, 50, 160, 45)\n\n# Render text surface\ntext_surf = font.render(\"Start Game\", True, (255, 255, 255))\ntext_rect = text_surf.get_rect(center=btn_rect.center)\n\nprint(\"Button Rect:\", btn_rect)\nprint(\"Text centered at:\", text_rect.center)\npygame.quit()",
        "terminalOutput": "Button Rect: <rect(50, 50, 160, 45)>\nText centered at: (130, 72)",
        "tip": "Centering text: `text_surf.get_rect(center=button_rect.center)` perfectly centers your label inside the button!",
        "mcq": {
          "question": "How do you render text in Pygame using a Font object?",
          "options": [
            {
              "id": "A",
              "text": "font.render(text_string, antialias_bool, color_tuple)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.draw.text(screen, text_string)",
              "explanationIfWrong": "pygame.draw does not have a text function."
            },
            {
              "id": "C",
              "text": "screen.write(text_string)",
              "explanationIfWrong": "Surfaces do not have a .write() method."
            },
            {
              "id": "D",
              "text": "font.draw(text_string, surface)",
              "explanationIfWrong": "font.render() creates a new Surface, which is then blitted."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "font.render(text, antialias, color) returns a new Surface containing the rendered text pixels.",
          "id": "q-13-3-keyboard-mouse-events-4-v1"
        },
        "retestMcq": {
          "question": "What does the second parameter (antialias) in font.render('Score', True, (255, 255, 255)) control?",
          "options": [
            {
              "id": "A",
              "text": "Smooths font edges using subpixel blending to eliminate jagged pixelated artifacts",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Makes the text bold",
              "explanationIfWrong": "font.set_bold(True) controls bolding."
            },
            {
              "id": "C",
              "text": "Makes the text italic",
              "explanationIfWrong": "font.set_italic(True) controls italics."
            },
            {
              "id": "D",
              "text": "Enables 3D text perspective",
              "explanationIfWrong": "Pygame fonts are 2D pixel surfaces."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Antialiasing smooths the character contours, producing professional crisp typography.",
          "id": "q-13-3-keyboard-mouse-events-4-v2"
        },
        "questionPool": [
          {
            "question": "How do you render text in Pygame using a Font object?",
            "options": [
              {
                "id": "A",
                "text": "font.render(text_string, antialias_bool, color_tuple)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.draw.text(screen, text_string)",
                "explanationIfWrong": "pygame.draw does not have a text function."
              },
              {
                "id": "C",
                "text": "screen.write(text_string)",
                "explanationIfWrong": "Surfaces do not have a .write() method."
              },
              {
                "id": "D",
                "text": "font.draw(text_string, surface)",
                "explanationIfWrong": "font.render() creates a new Surface, which is then blitted."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "font.render(text, antialias, color) returns a new Surface containing the rendered text pixels.",
            "id": "q-13-3-keyboard-mouse-events-4-v1"
          },
          {
            "question": "What does the second parameter (antialias) in font.render('Score', True, (255, 255, 255)) control?",
            "options": [
              {
                "id": "A",
                "text": "Smooths font edges using subpixel blending to eliminate jagged pixelated artifacts",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Makes the text bold",
                "explanationIfWrong": "font.set_bold(True) controls bolding."
              },
              {
                "id": "C",
                "text": "Makes the text italic",
                "explanationIfWrong": "font.set_italic(True) controls italics."
              },
              {
                "id": "D",
                "text": "Enables 3D text perspective",
                "explanationIfWrong": "Pygame fonts are 2D pixel surfaces."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Antialiasing smooths the character contours, producing professional crisp typography.",
            "id": "q-13-3-keyboard-mouse-events-4-v2"
          },
          {
            "question": "How do you implement a hover effect where a button turns bright green when the mouse is over it?",
            "options": [
              {
                "id": "A",
                "text": "Check button_rect.collidepoint(pygame.mouse.get_pos()) during rendering and choose the hover color if True",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Use CSS :hover inside Pygame",
                "explanationIfWrong": "Pygame does not support web CSS stylesheets."
              },
              {
                "id": "C",
                "text": "Call button.hover()",
                "explanationIfWrong": "Rect objects have no .hover() method."
              },
              {
                "id": "D",
                "text": "Set pygame.mouse.color = GREEN",
                "explanationIfWrong": "Cursor color does not alter button surfaces."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Evaluating collidepoint with the current mouse position allows you to toggle the fill color between normal and hover states.",
            "id": "q-13-3-keyboard-mouse-events-4-v3"
          }
        ]
      },
      {
        "heading": "Custom Events & Periodic Timer Triggers",
        "text": "Beyond keyboard and mouse inputs, Pygame lets you register custom periodic events using pygame.time.set_timer(). Custom event IDs must be constructed starting from pygame.USEREVENT (e.g. SPAWN_ENEMY = pygame.USEREVENT + 1). When the timer interval in milliseconds expires, Pygame posts your custom event to the event queue, allowing the game loop to spawn hazards, decrement countdown clocks, or trigger periodic environmental changes cleanly without manual timestamp diffs.",
        "codeSnippet": "import pygame\n\n# Define unique custom event ID\nSPAWN_ENEMY = pygame.USEREVENT + 1\n\n# Trigger SPAWN_ENEMY every 2000 milliseconds (2 seconds)\npygame.time.set_timer(SPAWN_ENEMY, 2000)\n\n# In game loop event handling:\nfor event in pygame.event.get():\n    if event.type == SPAWN_ENEMY:\n        spawn_new_hazard()",
        "terminalOutput": "Timer event registered: ID 32848 firing every 2000ms",
        "tip": "To cancel a timer, call pygame.time.set_timer(EVENT_ID, 0) with 0 as the interval parameter.",
        "mcq": {
          "question": "How do you create a safe, custom user event in Pygame that does not collide with built-in hardware events?",
          "options": [
            { "id": "A", "text": "Define an identifier as pygame.USEREVENT + n", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "Assign a string like event.type = 'SPAWN'", "explanationIfWrong": "Event types in Pygame must be integer codes." },
            { "id": "C", "text": "Override pygame.KEYDOWN with custom flags", "explanationIfWrong": "Overriding built-in events breaks keyboard processing." },
            { "id": "D", "text": "Call pygame.create_event()", "explanationIfWrong": "Pygame has no create_event() factory." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Pygame reserves integers below pygame.USEREVENT for internal SDL events. Custom events must be >= pygame.USEREVENT.",
          "id": "q-13-3-keyboard-mouse-events-5-v1"
        },
        "retestMcq": {
          "question": "How can you stop a recurring timer event previously scheduled with pygame.time.set_timer(EVENT_ID, 1500)?",
          "options": [
            { "id": "A", "text": "Call pygame.time.set_timer(EVENT_ID, 0)", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "Call pygame.time.stop_timer(EVENT_ID)", "explanationIfWrong": "There is no stop_timer() function in Pygame." },
            { "id": "C", "text": "Delete the EVENT_ID variable with del", "explanationIfWrong": "Deleting Python references does not alter the C event pump." },
            { "id": "D", "text": "Call pygame.event.clear()", "explanationIfWrong": "event.clear() empties pending events but does not stop scheduled timers." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Passing 0 as the millisecond interval to pygame.time.set_timer deactivates the recurring event timer.",
          "id": "q-13-3-keyboard-mouse-events-5-v2"
        },
        "questionPool": [
          {
            "question": "How do you create a safe, custom user event in Pygame that does not collide with built-in hardware events?",
            "options": [
              { "id": "A", "text": "Define an identifier as pygame.USEREVENT + n", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "Assign a string like event.type = 'SPAWN'", "explanationIfWrong": "Event types in Pygame must be integer codes." },
              { "id": "C", "text": "Override pygame.KEYDOWN with custom flags", "explanationIfWrong": "Overriding built-in events breaks keyboard processing." },
              { "id": "D", "text": "Call pygame.create_event()", "explanationIfWrong": "Pygame has no create_event() factory." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Pygame reserves integers below pygame.USEREVENT for internal SDL events. Custom events must be >= pygame.USEREVENT.",
            "id": "q-13-3-keyboard-mouse-events-5-v1"
          },
          {
            "question": "How can you stop a recurring timer event previously scheduled with pygame.time.set_timer(EVENT_ID, 1500)?",
            "options": [
              { "id": "A", "text": "Call pygame.time.set_timer(EVENT_ID, 0)", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "Call pygame.time.stop_timer(EVENT_ID)", "explanationIfWrong": "There is no stop_timer() function in Pygame." },
              { "id": "C", "text": "Delete the EVENT_ID variable with del", "explanationIfWrong": "Deleting Python references does not alter the C event pump." },
              { "id": "D", "text": "Call pygame.event.clear()", "explanationIfWrong": "event.clear() empties pending events but does not stop scheduled timers." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing 0 as the millisecond interval to pygame.time.set_timer deactivates the recurring event timer.",
            "id": "q-13-3-keyboard-mouse-events-5-v2"
          }
        ]
      }
    ]
  },
  {
    "id": "13-4-movement-mechanics-collision",
    "number": "13.4",
    "title": "Movement Mechanics & Collision Physics",
    "subtitle": "Implement diagonal normalization, friction/inertia, bounding-box collisions, and score tracking.",
    "readTime": "24 min",
    "objectives": [
      "Calculate frame-rate independent movement using delta time (dt)",
      "Diagnose and fix the diagonal speed bug using vector normalization",
      "Perform Axis-Aligned Bounding Box (AABB) collision checks with rect1.colliderect(rect2)",
      "Detect list and group collisions with collidelist() and collidelistall()",
      "Implement circular distance-based collision detection using Euclidean math",
      "Structure clean game state machines (Title Screen, Gameplay, Game Over)"
    ],
    "theoryBlocks": [
      {
        "heading": "Delta Time & Frame-Rate Independent Movement",
        "text": "If you update positions by a fixed pixel amount each frame (`x += 5`), a player on a 144 Hz monitor will move more than twice as fast as a player on a 60 Hz monitor! Professional games use Delta Time (`dt`), which measures the exact fraction of a second elapsed since the last frame: `dt = clock.tick(60) / 1000.0`. Movement is then calculated as `x += speed * dt` where speed is measured in pixels per second. This guarantees identical movement speed regardless of whether the game runs at 30 FPS or 240 FPS.",
        "codeSnippet": "import pygame\n\npygame.init()\nclock = pygame.time.Clock()\n\n# Desired player speed: 200 pixels per second\nSPEED_PER_SEC = 200\nplayer_x = 0.0\n\n# Simulate 3 frames\nfor _ in range(3):\n    # dt in seconds (e.g. 16.6 ms / 1000 = ~0.0166 sec)\n    dt = clock.tick(60) / 1000.0\n    player_x += SPEED_PER_SEC * dt\n    print(f\"dt: {dt:.4f}s -> Player X: {player_x:.2f} px\")\n\npygame.quit()",
        "terminalOutput": "dt: 0.0167s -> Player X: 3.33 px\ndt: 0.0166s -> Player X: 6.66 px\ndt: 0.0167s -> Player X: 10.00 px",
        "tip": "Store player position as float variables (`self.x`, `self.y`) and assign to integer `rect.x = int(self.x)` for rendering.",
        "mcq": {
          "question": "What is 'Delta Time' (dt) in game development?",
          "options": [
            {
              "id": "A",
              "text": "The fraction of a second that elapsed since the previous frame, used to achieve frame-rate independent movement",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The total duration the game has been running",
              "explanationIfWrong": "That is total elapsed time, not per-frame delta."
            },
            {
              "id": "C",
              "text": "The time required to save a game to disk",
              "explanationIfWrong": "dt is frame duration."
            },
            {
              "id": "D",
              "text": "The time delay between player keypresses",
              "explanationIfWrong": "dt measures render loop duration."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Delta time scales movement by real-world time rather than frame count, ensuring consistent physics across differing hardware.",
          "id": "q-13-4-movement-mechanics-collision-0-v1"
        },
        "retestMcq": {
          "question": "Why is position += speed * dt preferred over position += speed?",
          "options": [
            {
              "id": "A",
              "text": "It ensures the sprite moves at the exact same physical speed on 30 FPS, 60 FPS, and 144 FPS screens",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It prevents the sprite from moving backwards",
              "explanationIfWrong": "Velocity signs determine direction."
            },
            {
              "id": "C",
              "text": "It automatically disables gravity",
              "explanationIfWrong": "Gravity is also scaled by dt."
            },
            {
              "id": "D",
              "text": "It makes sprites move 1000 times faster",
              "explanationIfWrong": "It normalizes speed to units per second."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without delta time, players on high-refresh-rate monitors move faster than players on low-refresh-rate displays.",
          "id": "q-13-4-movement-mechanics-collision-0-v2"
        },
        "questionPool": [
          {
            "question": "What is 'Delta Time' (dt) in game development?",
            "options": [
              {
                "id": "A",
                "text": "The fraction of a second that elapsed since the previous frame, used to achieve frame-rate independent movement",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The total duration the game has been running",
                "explanationIfWrong": "That is total elapsed time, not per-frame delta."
              },
              {
                "id": "C",
                "text": "The time required to save a game to disk",
                "explanationIfWrong": "dt is frame duration."
              },
              {
                "id": "D",
                "text": "The time delay between player keypresses",
                "explanationIfWrong": "dt measures render loop duration."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Delta time scales movement by real-world time rather than frame count, ensuring consistent physics across differing hardware.",
            "id": "q-13-4-movement-mechanics-collision-0-v1"
          },
          {
            "question": "Why is position += speed * dt preferred over position += speed?",
            "options": [
              {
                "id": "A",
                "text": "It ensures the sprite moves at the exact same physical speed on 30 FPS, 60 FPS, and 144 FPS screens",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It prevents the sprite from moving backwards",
                "explanationIfWrong": "Velocity signs determine direction."
              },
              {
                "id": "C",
                "text": "It automatically disables gravity",
                "explanationIfWrong": "Gravity is also scaled by dt."
              },
              {
                "id": "D",
                "text": "It makes sprites move 1000 times faster",
                "explanationIfWrong": "It normalizes speed to units per second."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without delta time, players on high-refresh-rate monitors move faster than players on low-refresh-rate displays.",
            "id": "q-13-4-movement-mechanics-collision-0-v2"
          },
          {
            "question": "If speed is 300 pixels per second and dt is 0.0166 seconds (60 FPS), how far does the player move in that single frame?",
            "options": [
              {
                "id": "A",
                "text": "Approximately 5.0 pixels (300 * 0.0166)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "300 pixels",
                "explanationIfWrong": "300 pixels is the movement per full second, not per frame."
              },
              {
                "id": "C",
                "text": "18.0 pixels",
                "explanationIfWrong": "300 * 0.0166 = ~4.98 pixels."
              },
              {
                "id": "D",
                "text": "0.5 pixels",
                "explanationIfWrong": "300 * 0.0166 = 5.0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Distance = speed * dt = 300 * 0.0166 = 4.98 (~5) pixels per frame.",
            "id": "q-13-4-movement-mechanics-collision-0-v3"
          }
        ]
      },
      {
        "heading": "Diagonal Speed Normalization",
        "text": "If a player moves horizontally at speed $V$ (`dx = 1`) and vertically at speed $V$ (`dy = 1`), Pythagorean theorem states that their total diagonal speed is $\\sqrt{1^2 + 1^2} = \\sqrt{2} \\approx 1.414$ ($41.4\\%$ faster than moving in a straight line!). This is the famous 'diagonal movement bug'. To fix it, if both horizontal and vertical inputs are active, divide each component by $\\sqrt{2} \\approx 1.4142$ (or multiply by $0.7071$) to normalize the direction vector to a length of 1.",
        "codeSnippet": "import math\n\ndx, dy = 1, 1  # Moving diagonal (Right + Down)\n\n# Calculate raw magnitude\nmagnitude = math.hypot(dx, dy)  # sqrt(1^2 + 1^2) = 1.4142\nprint(f\"Unnormalized diagonal magnitude: {magnitude:.4f} (41.4% too fast!)\")\n\n# Normalize vector components to unit length of 1.0\nnorm_dx = dx / magnitude\nnorm_dy = dy / magnitude\nnew_mag = math.hypot(norm_dx, norm_dy)\nprint(f\"Normalized components: ({norm_dx:.4f}, {norm_dy:.4f})\")\nprint(f\"Normalized magnitude:  {new_mag:.4f} (Exactly 1.0!)\")",
        "terminalOutput": "Unnormalized diagonal magnitude: 1.4142 (41.4% too fast!)\nNormalized components: (0.7071, 0.7071)\nNormalized magnitude:  1.0000 (Exactly 1.0!)",
        "tip": "Pygame 2.0+ provides `pygame.math.Vector2`, which features built-in vector normalization: `vec.normalize()`.",
        "mcq": {
          "question": "Why does a player move approximately 41.4% faster diagonally if movement is coded as: if right: x += s; if down: y += s?",
          "options": [
            {
              "id": "A",
              "text": "By the Pythagorean theorem, the hypotenuse vector length sqrt(s^2 + s^2) is s * sqrt(2) \u2248 1.414s",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because the CPU doubles clock speed during diagonal movement",
              "explanationIfWrong": "CPU clock speed is completely unrelated."
            },
            {
              "id": "C",
              "text": "Because diagonal pixels are larger on monitors",
              "explanationIfWrong": "Pixels are square."
            },
            {
              "id": "D",
              "text": "It is a deliberate design choice by Microsoft",
              "explanationIfWrong": "It is basic vector geometry."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Moving 1 unit on X and 1 unit on Y creates a resultant velocity vector of length sqrt(2) = 1.414.",
          "id": "q-13-4-movement-mechanics-collision-1-v1"
        },
        "retestMcq": {
          "question": "What factor should diagonal components (dx, dy) be multiplied by to normalize speed to 1.0?",
          "options": [
            {
              "id": "A",
              "text": "1 / sqrt(2) \u2248 0.7071",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "0.5000",
              "explanationIfWrong": "0.5 would reduce speed by half (magnitude 0.707)."
            },
            {
              "id": "C",
              "text": "1.4142",
              "explanationIfWrong": "1.4142 would make the player even faster."
            },
            {
              "id": "D",
              "text": "2.0000",
              "explanationIfWrong": "2.0 doubles speed."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Multiplying each component by 1/sqrt(2) (~0.7071) yields sqrt(0.7071^2 + 0.7071^2) = 1.0.",
          "id": "q-13-4-movement-mechanics-collision-1-v2"
        },
        "questionPool": [
          {
            "question": "Why does a player move approximately 41.4% faster diagonally if movement is coded as: if right: x += s; if down: y += s?",
            "options": [
              {
                "id": "A",
                "text": "By the Pythagorean theorem, the hypotenuse vector length sqrt(s^2 + s^2) is s * sqrt(2) \u2248 1.414s",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because the CPU doubles clock speed during diagonal movement",
                "explanationIfWrong": "CPU clock speed is completely unrelated."
              },
              {
                "id": "C",
                "text": "Because diagonal pixels are larger on monitors",
                "explanationIfWrong": "Pixels are square."
              },
              {
                "id": "D",
                "text": "It is a deliberate design choice by Microsoft",
                "explanationIfWrong": "It is basic vector geometry."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Moving 1 unit on X and 1 unit on Y creates a resultant velocity vector of length sqrt(2) = 1.414.",
            "id": "q-13-4-movement-mechanics-collision-1-v1"
          },
          {
            "question": "What factor should diagonal components (dx, dy) be multiplied by to normalize speed to 1.0?",
            "options": [
              {
                "id": "A",
                "text": "1 / sqrt(2) \u2248 0.7071",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "0.5000",
                "explanationIfWrong": "0.5 would reduce speed by half (magnitude 0.707)."
              },
              {
                "id": "C",
                "text": "1.4142",
                "explanationIfWrong": "1.4142 would make the player even faster."
              },
              {
                "id": "D",
                "text": "2.0000",
                "explanationIfWrong": "2.0 doubles speed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiplying each component by 1/sqrt(2) (~0.7071) yields sqrt(0.7071^2 + 0.7071^2) = 1.0.",
            "id": "q-13-4-movement-mechanics-collision-1-v2"
          },
          {
            "question": "What Pygame class provides built-in 2D vector mathematics including vector.normalize()?",
            "options": [
              {
                "id": "A",
                "text": "pygame.math.Vector2",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.geometry.Point2D",
                "explanationIfWrong": "The class is pygame.math.Vector2."
              },
              {
                "id": "C",
                "text": "pygame.Physics2D",
                "explanationIfWrong": "Pygame does not have a Physics2D module."
              },
              {
                "id": "D",
                "text": "pygame.Rect",
                "explanationIfWrong": "Rect handles rectangular boundaries, not direction vectors."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.math.Vector2 offers vector arithmetic, dot products, length(), and normalize().",
            "id": "q-13-4-movement-mechanics-collision-1-v3"
          }
        ]
      },
      {
        "heading": "Bounding-Box Collision Detection with colliderect()",
        "text": "The fastest and most common 2D collision check is Axis-Aligned Bounding Box (AABB) collision. In Pygame, every `Rect` object has a method `rect1.colliderect(rect2)` which returns `True` if two rectangles overlap in 2D space. Two rectangles overlap if and only if they overlap on BOTH the horizontal X-axis and vertical Y-axis simultaneously.",
        "codeSnippet": "import pygame\n\nplayer_rect = pygame.Rect(100, 100, 40, 40)\nenemy_rect  = pygame.Rect(120, 110, 40, 40)   # Overlaps player!\ncoin_rect   = pygame.Rect(300, 300, 20, 20)   # Far away\n\nprint(\"Player hits enemy?:\", player_rect.colliderect(enemy_rect))\nprint(\"Player hits coin?: \", player_rect.colliderect(coin_rect))",
        "terminalOutput": "Player hits enemy?: True\nPlayer hits coin?:  False",
        "tip": "`colliderect()` is computationally trivial (just 4 inequality comparisons), making it capable of checking thousands of sprite pairs per frame.",
        "mcq": {
          "question": "What does rect1.colliderect(rect2) return in Pygame?",
          "options": [
            {
              "id": "A",
              "text": "True if the two rectangles overlap anywhere in 2D space, otherwise False",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The pixel coordinates of the intersection",
              "explanationIfWrong": "rect1.clip(rect2) returns the overlapping rectangle; colliderect returns a boolean."
            },
            {
              "id": "C",
              "text": "The distance in pixels between centers",
              "explanationIfWrong": "colliderect returns True/False."
            },
            {
              "id": "D",
              "text": "The angle of bounce",
              "explanationIfWrong": "It tests collision overlap, not physics reflections."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "colliderect() performs an AABB overlap test and returns True if the two rectangular boundaries intersect.",
          "id": "q-13-4-movement-mechanics-collision-2-v1"
        },
        "retestMcq": {
          "question": "Under what condition do two Axis-Aligned Bounding Boxes (rectangles) overlap?",
          "options": [
            {
              "id": "A",
              "text": "They must overlap simultaneously on both the horizontal (X) and vertical (Y) axes",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "If their centers have the exact same coordinates",
              "explanationIfWrong": "Centers do not need to match; any edge overlap counts."
            },
            {
              "id": "C",
              "text": "If either X or Y overlaps",
              "explanationIfWrong": "If only X overlaps, one rect is above or below the other without colliding."
            },
            {
              "id": "D",
              "text": "Only if one rectangle is completely inside the other",
              "explanationIfWrong": "Partial edge intersections trigger collisions."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "AABB collision requires overlap along both perpendicular projection axes (X and Y).",
          "id": "q-13-4-movement-mechanics-collision-2-v2"
        },
        "questionPool": [
          {
            "question": "What does rect1.colliderect(rect2) return in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "True if the two rectangles overlap anywhere in 2D space, otherwise False",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The pixel coordinates of the intersection",
                "explanationIfWrong": "rect1.clip(rect2) returns the overlapping rectangle; colliderect returns a boolean."
              },
              {
                "id": "C",
                "text": "The distance in pixels between centers",
                "explanationIfWrong": "colliderect returns True/False."
              },
              {
                "id": "D",
                "text": "The angle of bounce",
                "explanationIfWrong": "It tests collision overlap, not physics reflections."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "colliderect() performs an AABB overlap test and returns True if the two rectangular boundaries intersect.",
            "id": "q-13-4-movement-mechanics-collision-2-v1"
          },
          {
            "question": "Under what condition do two Axis-Aligned Bounding Boxes (rectangles) overlap?",
            "options": [
              {
                "id": "A",
                "text": "They must overlap simultaneously on both the horizontal (X) and vertical (Y) axes",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "If their centers have the exact same coordinates",
                "explanationIfWrong": "Centers do not need to match; any edge overlap counts."
              },
              {
                "id": "C",
                "text": "If either X or Y overlaps",
                "explanationIfWrong": "If only X overlaps, one rect is above or below the other without colliding."
              },
              {
                "id": "D",
                "text": "Only if one rectangle is completely inside the other",
                "explanationIfWrong": "Partial edge intersections trigger collisions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "AABB collision requires overlap along both perpendicular projection axes (X and Y).",
            "id": "q-13-4-movement-mechanics-collision-2-v2"
          },
          {
            "question": "What is the computational complexity of testing an AABB collision between two Rects?",
            "options": [
              {
                "id": "A",
                "text": "O(1) constant time (4 simple scalar comparisons)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "O(N) where N is number of pixels",
                "explanationIfWrong": "AABB tests bounding box coordinates, not individual pixels."
              },
              {
                "id": "C",
                "text": "O(N^2)",
                "explanationIfWrong": "Rect collision is O(1)."
              },
              {
                "id": "D",
                "text": "O(log N)",
                "explanationIfWrong": "It requires only 4 comparisons."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Testing `r1.left < r2.right and r1.right > r2.left and r1.top < r2.bottom and r1.bottom > r2.top` takes O(1) constant time.",
            "id": "q-13-4-movement-mechanics-collision-2-v3"
          }
        ]
      },
      {
        "heading": "List Collisions: Collecting Items & Coins",
        "text": "In arcade games, a player frequently interacts with collections of objects (such as coins, enemies, or projectiles). Pygame provides `rect.collidelist(rect_list)`, which returns the INDEX of the first colliding rectangle in the list (or `-1` if none collide). For collecting coins, you can pop the collected coin from the list and increment the score counter.",
        "codeSnippet": "import pygame\n\nplayer = pygame.Rect(100, 100, 30, 30)\ncoins = [\n    pygame.Rect(50, 50, 15, 15),\n    pygame.Rect(105, 105, 15, 15),  # Coin index 1 collides with player!\n    pygame.Rect(200, 200, 15, 15)\n]\n\nhit_idx = player.collidelist(coins)\nif hit_idx != -1:\n    collected = coins.pop(hit_idx)\n    print(f\"Coin collected at index {hit_idx}! Remaining coins: {len(coins)}\")",
        "terminalOutput": "Coin collected at index 1! Remaining coins: 2",
        "tip": "`rect.collidelistall(rect_list)` returns a list of ALL colliding indices if multiple collisions occur in one frame.",
        "mcq": {
          "question": "What does rect.collidelist(rect_list) return when NO rectangles in the list collide with rect?",
          "options": [
            {
              "id": "A",
              "text": "-1",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "None",
              "explanationIfWrong": "It returns integer index -1."
            },
            {
              "id": "C",
              "text": "False",
              "explanationIfWrong": "It returns an integer."
            },
            {
              "id": "D",
              "text": "IndexError",
              "explanationIfWrong": "No exception is raised; it returns -1 safely."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Following C/Python indexing conventions, collidelist() returns -1 when no intersection is detected.",
          "id": "q-13-4-movement-mechanics-collision-3-v1"
        },
        "retestMcq": {
          "question": "How do you remove a collected coin from a list named coins when player.collidelist(coins) returns hit_idx?",
          "options": [
            {
              "id": "A",
              "text": "coins.pop(hit_idx)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "coins.remove(hit_idx)",
              "explanationIfWrong": "remove() looks for the value, not the index; pop() removes by index."
            },
            {
              "id": "C",
              "text": "del coins",
              "explanationIfWrong": "del coins deletes the entire list variable."
            },
            {
              "id": "D",
              "text": "coins.clear()",
              "explanationIfWrong": "clear() removes all coins."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "list.pop(index) removes and returns the item at that specific index from the list.",
          "id": "q-13-4-movement-mechanics-collision-3-v2"
        },
        "questionPool": [
          {
            "question": "What does rect.collidelist(rect_list) return when NO rectangles in the list collide with rect?",
            "options": [
              {
                "id": "A",
                "text": "-1",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "None",
                "explanationIfWrong": "It returns integer index -1."
              },
              {
                "id": "C",
                "text": "False",
                "explanationIfWrong": "It returns an integer."
              },
              {
                "id": "D",
                "text": "IndexError",
                "explanationIfWrong": "No exception is raised; it returns -1 safely."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Following C/Python indexing conventions, collidelist() returns -1 when no intersection is detected.",
            "id": "q-13-4-movement-mechanics-collision-3-v1"
          },
          {
            "question": "How do you remove a collected coin from a list named coins when player.collidelist(coins) returns hit_idx?",
            "options": [
              {
                "id": "A",
                "text": "coins.pop(hit_idx)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "coins.remove(hit_idx)",
                "explanationIfWrong": "remove() looks for the value, not the index; pop() removes by index."
              },
              {
                "id": "C",
                "text": "del coins",
                "explanationIfWrong": "del coins deletes the entire list variable."
              },
              {
                "id": "D",
                "text": "coins.clear()",
                "explanationIfWrong": "clear() removes all coins."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "list.pop(index) removes and returns the item at that specific index from the list.",
            "id": "q-13-4-movement-mechanics-collision-3-v2"
          },
          {
            "question": "If a player hits 3 coins simultaneously, which method returns all 3 indices as a list [0, 2, 4]?",
            "options": [
              {
                "id": "A",
                "text": "player.collidelistall(coins)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "player.collidelist(coins)",
                "explanationIfWrong": "collidelist() returns only the first colliding index."
              },
              {
                "id": "C",
                "text": "player.collide_all(coins)",
                "explanationIfWrong": "The method is collidelistall()."
              },
              {
                "id": "D",
                "text": "coins.collide(player)",
                "explanationIfWrong": "The check is on the player Rect."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "collidelistall() finds and returns a list containing all indices of colliding rectangles.",
            "id": "q-13-4-movement-mechanics-collision-3-v3"
          }
        ]
      },
      {
        "heading": "Game State Management & HUD Scoring",
        "text": "Real games require structured state transitions: `START_SCREEN`, `PLAYING`, and `GAME_OVER`. Instead of cramming all code into a single chaotic loop, use a state variable (`game_state = 'MENU'`). In the update and render phases, branch based on `game_state`: draw title text and wait for Spacebar in `MENU`; update gameplay and physics in `PLAYING`; display final score and restart options in `GAME_OVER`.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\nfont = pygame.font.SysFont(\"Arial\", 20)\n\nscore = 150\nhigh_score = 300\ngame_state = \"GAME_OVER\"\n\nif game_state == \"GAME_OVER\":\n    # Render HUD overlay\n    score_surf = font.render(f\"Score: {score} | Best: {high_score}\", True, (255, 200, 0))\n    print(\"Render HUD:\", f\"Score: {score} | Best: {high_score}\")\n\npygame.quit()",
        "terminalOutput": "Render HUD: Score: 150 | Best: 300",
        "tip": "State machines prevent input conflicts: for instance, moving the player is disabled while on the Game Over screen!",
        "mcq": {
          "question": "Why is a Game State Machine (e.g. state = 'MENU', 'PLAYING', 'GAME_OVER') essential in game architecture?",
          "options": [
            {
              "id": "A",
              "text": "It isolates input handling, update logic, and rendering routines for different phases of the application",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It allows Pygame to connect to multiplayer cloud servers",
              "explanationIfWrong": "State machines organize local control flow."
            },
            {
              "id": "C",
              "text": "It prevents the CPU from running at 60 FPS",
              "explanationIfWrong": "Frame rate is regulated by clock.tick()."
            },
            {
              "id": "D",
              "text": "It automatically translates game text to Finnish",
              "explanationIfWrong": "Language localization is unrelated to state machines."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A state machine ensures that player controls only move the character during active gameplay and not during pause or game-over menus.",
          "id": "q-13-4-movement-mechanics-collision-4-v1"
        },
        "retestMcq": {
          "question": "What is the Heads-Up Display (HUD) in a video game?",
          "options": [
            {
              "id": "A",
              "text": "The on-screen overlay showing vital statistics like score, health, and timer",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The physical monitor frame",
              "explanationIfWrong": "HUD is a software graphics overlay."
            },
            {
              "id": "C",
              "text": "The operating system taskbar",
              "explanationIfWrong": "HUD is inside the game canvas."
            },
            {
              "id": "D",
              "text": "The game's audio driver",
              "explanationIfWrong": "HUD is visual."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The HUD renders player statistics (points, lives, ammo, mini-map) on top of the world canvas.",
          "id": "q-13-4-movement-mechanics-collision-4-v2"
        },
        "questionPool": [
          {
            "question": "Why is a Game State Machine (e.g. state = 'MENU', 'PLAYING', 'GAME_OVER') essential in game architecture?",
            "options": [
              {
                "id": "A",
                "text": "It isolates input handling, update logic, and rendering routines for different phases of the application",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It allows Pygame to connect to multiplayer cloud servers",
                "explanationIfWrong": "State machines organize local control flow."
              },
              {
                "id": "C",
                "text": "It prevents the CPU from running at 60 FPS",
                "explanationIfWrong": "Frame rate is regulated by clock.tick()."
              },
              {
                "id": "D",
                "text": "It automatically translates game text to Finnish",
                "explanationIfWrong": "Language localization is unrelated to state machines."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A state machine ensures that player controls only move the character during active gameplay and not during pause or game-over menus.",
            "id": "q-13-4-movement-mechanics-collision-4-v1"
          },
          {
            "question": "What is the Heads-Up Display (HUD) in a video game?",
            "options": [
              {
                "id": "A",
                "text": "The on-screen overlay showing vital statistics like score, health, and timer",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The physical monitor frame",
                "explanationIfWrong": "HUD is a software graphics overlay."
              },
              {
                "id": "C",
                "text": "The operating system taskbar",
                "explanationIfWrong": "HUD is inside the game canvas."
              },
              {
                "id": "D",
                "text": "The game's audio driver",
                "explanationIfWrong": "HUD is visual."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The HUD renders player statistics (points, lives, ammo, mini-map) on top of the world canvas.",
            "id": "q-13-4-movement-mechanics-collision-4-v2"
          },
          {
            "question": "When switching game_state from 'GAME_OVER' back to 'PLAYING', what must occur?",
            "options": [
              {
                "id": "A",
                "text": "Reset gameplay variables (e.g. score = 0, player positions, lives, and coin lists)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Re-install Pygame with pip",
                "explanationIfWrong": "Re-installation is never needed during gameplay."
              },
              {
                "id": "C",
                "text": "Close the operating system window",
                "explanationIfWrong": "Restarting a level should keep the window open."
              },
              {
                "id": "D",
                "text": "Delete the high score file",
                "explanationIfWrong": "High scores should be preserved across runs."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Transitioning back to active gameplay requires re-initializing player coordinates, resetting scores, and respawning collectibles.",
            "id": "q-13-4-movement-mechanics-collision-4-v3"
          }
        ]
      },
      {
        "heading": "Game Over Sequences & Restart Loops",
        "text": "When a game reaches an end state (such as the player running out of lives or completing a level), the game should not abruptly quit. Instead, transitioning to a dedicated 'GAME_OVER' or 'VICTORY' state lets players view their final score, see high scores, and restart by pressing a key (like Space or Enter). In this state, game simulation and entity updates pause, while the event loop continues listening for reset inputs that re-initialize player health, positions, and hazards.",
        "codeSnippet": "def reset_game():\n    global player_rect, score, lives, game_state\n    player_rect.center = (320, 240)\n    score = 0\n    lives = 3\n    game_state = 'PLAYING'\n\n# In event handling:\nif game_state == 'GAME_OVER':\n    if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:\n        reset_game()",
        "terminalOutput": "Game reset triggered: Score 0, Lives 3, State PLAYING",
        "tip": "Encapsulate your game variables in a reset function or class method so restarting doesn't require restarting Python.",
        "mcq": {
          "question": "What is the recommended design pattern for handling a game over screen and restart in Pygame?",
          "options": [
            { "id": "A", "text": "Pause entity updates, render a game over HUD, and listen for a restart key that calls a reset function", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "Call sys.exit() immediately when lives reach 0", "explanationIfWrong": "Abruptly exiting closes the window without giving feedback to the player." },
            { "id": "C", "text": "Use an infinite loop with time.sleep()", "explanationIfWrong": "time.sleep freezes the event pump and causes the OS to report 'Not Responding'." },
            { "id": "D", "text": "Re-run the Python script from bash inside the game loop", "explanationIfWrong": "Spawning new processes is inefficient and bad practice." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Switching game_state keeps the display surface alive, halts world physics, and waits for player confirmation to re-initialize variables.",
          "id": "q-13-4-movement-mechanics-collision-5-v1"
        },
        "retestMcq": {
          "question": "Why should you never use time.sleep() to pause execution on a game over screen in Pygame?",
          "options": [
            { "id": "A", "text": "It halts the main thread, blocking event polling and causing the OS to report the window as frozen", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "time.sleep() deletes textures from GPU VRAM", "explanationIfWrong": "time.sleep() does not affect graphics memory." },
            { "id": "C", "text": "Pygame throws a ThreadBlockError", "explanationIfWrong": "No such error exists; the application simply hangs." },
            { "id": "D", "text": "time.sleep() only works in command line scripts", "explanationIfWrong": "It functions in any script, but freezes the GUI event pump." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Operating systems expect GUI applications to poll events frequently; sleeping stops pygame.event.get(), making the window unresponsive.",
          "id": "q-13-4-movement-mechanics-collision-5-v2"
        },
        "questionPool": [
          {
            "question": "What is the recommended design pattern for handling a game over screen and restart in Pygame?",
            "options": [
              { "id": "A", "text": "Pause entity updates, render a game over HUD, and listen for a restart key that calls a reset function", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "Call sys.exit() immediately when lives reach 0", "explanationIfWrong": "Abruptly exiting closes the window without giving feedback to the player." },
              { "id": "C", "text": "Use an infinite loop with time.sleep()", "explanationIfWrong": "time.sleep freezes the event pump and causes the OS to report 'Not Responding'." },
              { "id": "D", "text": "Re-run the Python script from bash inside the game loop", "explanationIfWrong": "Spawning new processes is inefficient and bad practice." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Switching game_state keeps the display surface alive, halts world physics, and waits for player confirmation to re-initialize variables.",
            "id": "q-13-4-movement-mechanics-collision-5-v1"
          },
          {
            "question": "Why should you never use time.sleep() to pause execution on a game over screen in Pygame?",
            "options": [
              { "id": "A", "text": "It halts the main thread, blocking event polling and causing the OS to report the window as frozen", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "time.sleep() deletes textures from GPU VRAM", "explanationIfWrong": "time.sleep() does not affect graphics memory." },
              { "id": "C", "text": "Pygame throws a ThreadBlockError", "explanationIfWrong": "No such error exists; the application simply hangs." },
              { "id": "D", "text": "time.sleep() only works in command line scripts", "explanationIfWrong": "It functions in any script, but freezes the GUI event pump." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Operating systems expect GUI applications to poll events frequently; sleeping stops pygame.event.get(), making the window unresponsive.",
            "id": "q-13-4-movement-mechanics-collision-5-v2"
          }
        ]
      }
    ]
  }
];

// Question pool selector for Part 13
export const getActiveQuestionsForLevelPart13 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part13_seen_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part13_active_qset_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 13
export const getConsecutiveFailuresPart13 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part13_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart13 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part13_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart13 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part13_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart13 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part13_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart13 = (
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
  const currentAttempt = getLevelAttemptCountPart13(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part13_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part13_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part13_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part13_locked_${studentId}`);
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
      setLevelAttemptCountPart13(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart13(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart13(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part13_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part13_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part13_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart13 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part13_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part13_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part13_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part13_locked_progression_${studentId}`);
  } catch {}
};
